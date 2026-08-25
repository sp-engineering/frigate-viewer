import Foundation
import React
import Security

/**
 * React Native module for accessing client certificates from iOS Keychain.
 * Allows the app to use mTLS authentication by retrieving certificates installed on the device.
 */
@objc(ClientCertModule)
class ClientCertModule: NSObject, URLSessionDelegate {
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
  
  /**
   * List all available client certificates in the device's Keychain.
   * @param resolve Promise to resolve with array of certificate identities
   * @param reject Promise to reject on error
   */
  @objc
  func listCertificates(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    do {
      let certificates = try listKeychainCertificates()
      resolve(certificates)
    } catch {
      reject("KEYCHAIN_ERROR", "Error accessing Keychain", error)
    }
  }
  
  /**
   * Get the certificate details for a specific certificate identity.
   * @param identity The certificate identity/label
   * @param resolve Promise to resolve with certificate information
   * @param reject Promise to reject on error
   */
  @objc
  func getCertificateInfo(_ identity: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    do {
      let info = try getCertificateDetails(identity: identity)
      resolve(info)
    } catch {
      reject("KEYCHAIN_ERROR", "Error accessing certificate", error)
    }
  }
  
  /**
   * Check if a certificate with the given identity exists in the Keychain.
   * @param identity The certificate identity/label
   * @param resolve Promise to resolve with availability status
   * @param reject Promise to reject on error
   */
  @objc
  func checkCertificateAvailability(_ identity: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    do {
      let available = try isCertificateAvailable(identity: identity)
      resolve([
        "exists": available,
        "identity": identity
      ])
    } catch {
      reject("KEYCHAIN_ERROR", "Error checking certificate availability", error)
    }
  }
  
  /**
   * Perform an HTTP request using a client certificate from the Keychain.
   * The certificate is used for mutual TLS authentication (mTLS).
   * 
   * @param url The URL to request
   * @param certIdentity The certificate identity from the Keychain
   * @param method HTTP method (GET, POST, etc.)
   * @param headers Array of header objects {key, value}
   * @param body Request body (optional)
   * @param resolve Promise to resolve with the response
   * @param reject Promise to reject on error
   */
  @objc
  func performHttpRequestWithClientCert(
    _ url: String,
    certIdentity: String,
    method: String,
    headers: [[String: String]],
    body: String?,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    guard let url = URL(string: url) else {
      reject("INVALID_URL", "Invalid URL: \(url)", nil)
      return
    }
    
    do {
      // Get the identity from the Keychain
      guard let identity = try getIdentityFromKeychain(certIdentity) else {
        reject("CERT_NOT_FOUND", "Certificate not found: \(certIdentity)", nil)
        return
      }
      
      // Build the request
      var request = URLRequest(url: url)
      request.httpMethod = method
      
      // Add headers
      for header in headers {
        if let key = header["key"], let value = header["value"] {
          request.setValue(value, forHTTPHeaderField: key)
        }
      }
      
      // Add body if present
      if let body = body {
        request.httpBody = body.data(using: .utf8)
      }
      
      // Create a URLSession with a delegate that provides the client certificate
      let configuration = URLSessionConfiguration.default
      let delegate = ClientCertURLSessionDelegate(identity: identity)
      let session = URLSession(configuration: configuration, delegate: delegate, delegateQueue: nil)
      
      // Perform the request
      let task = session.dataTask(with: request) { data, response, error in
        if let error = error {
          reject("HTTP_ERROR", "HTTP request failed: \(error.localizedDescription)", error)
          return
        }
        
        guard let httpResponse = response as? HTTPURLResponse else {
          reject("HTTP_ERROR", "Invalid response", nil)
          return
        }
        
        let responseBody = String(data: data ?? Data(), encoding: .utf8) ?? ""
        var responseHeaders: [String: String] = [:]
        
        for (key, value) in httpResponse.allHeaderFields {
          if let keyStr = key as? String, let valueStr = value as? String {
            responseHeaders[keyStr] = valueStr
          }
        }
        
        let result: [String: Any] = [
          "statusCode": httpResponse.statusCode,
          "body": responseBody,
          "headers": responseHeaders
        ]
        
        resolve(result)
      }
      
      task.resume()
      
    } catch {
      reject("KEYCHAIN_ERROR", "Error accessing certificate: \(error.localizedDescription)", error)
    }
  }
  
  // MARK: - Private Helper Methods
  
  /**
   * Retrieve all certificates from the Keychain that can be used for client authentication.
   */
  private func listKeychainCertificates() throws -> [[String: Any]] {
    var result: CFTypeRef?
    
    // Query for all identities (certificates with private keys)
    let query: [String: Any] = [
      kSecClass as String: kSecClassIdentity,
      kSecMatchLimit as String: kSecMatchLimitAll,
      kSecReturnAttributes as String: true,
      kSecReturnRef as String: true
    ]
    
    let status = SecItemCopyMatching(query as CFDictionary, &result)
    
    guard status == errSecSuccess else {
      if status == errSecItemNotFound {
        return []
      }
      throw NSError(domain: NSOSStatusErrorDomain, code: Int(status), userInfo: nil)
    }
    
    guard let identities = result as? [SecIdentity] else {
      return []
    }
    
    var certificates: [[String: Any]] = []
    
    for identity in identities {
      var cert: SecCertificate?
      SecIdentityCopyCertificate(identity, &cert)
      
      guard let certificate = cert else {
        continue
      }
      
      var commonName: CFString?
      SecCertificateCopyCommonName(certificate, &commonName)
      
      var certData: [String: Any] = [
        "type": "identity"
      ]
      
      if let cn = commonName as String? {
        certData["identity"] = cn
        certData["commonName"] = cn
      }
      
      certificates.append(certData)
    }
    
    return certificates
  }
  
  /**
   * Get detailed information about a specific certificate.
   */
  private func getCertificateDetails(identity: String) throws -> [String: Any] {
    let identities = try listKeychainCertificates()
    
    guard let cert = identities.first(where: { 
      ($0["identity"] as? String) == identity || ($0["commonName"] as? String) == identity
    }) else {
      throw NSError(domain: "ClientCertModule", code: 1, userInfo: [
        NSLocalizedDescriptionKey: "Certificate not found: \(identity)"
      ])
    }
    
    return cert
  }
  
  /**
   * Check if a certificate is available in the Keychain.
   */
  private func isCertificateAvailable(identity: String) throws -> Bool {
    let identities = try listKeychainCertificates()
    return identities.contains { 
      ($0["identity"] as? String) == identity || ($0["commonName"] as? String) == identity
    }
  }
  
  /**
   * Get a SecIdentity from the Keychain by its common name.
   */
  private func getIdentityFromKeychain(_ identityName: String) throws -> SecIdentity? {
    var result: CFTypeRef?
    
    let query: [String: Any] = [
      kSecClass as String: kSecClassIdentity,
      kSecMatchLimit as String: kSecMatchLimitAll,
      kSecReturnRef as String: true
    ]
    
    let status = SecItemCopyMatching(query as CFDictionary, &result)
    
    guard status == errSecSuccess else {
      if status == errSecItemNotFound {
        return nil
      }
      throw NSError(domain: NSOSStatusErrorDomain, code: Int(status), userInfo: nil)
    }
    
    guard let identities = result as? [SecIdentity] else {
      return nil
    }
    
    // Find the identity matching the given name
    for identity in identities {
      var cert: SecCertificate?
      SecIdentityCopyCertificate(identity, &cert)
      
      if let certificate = cert {
        var commonName: CFString?
        SecCertificateCopyCommonName(certificate, &commonName)
        
        if let cn = commonName as String?, cn == identityName {
          return identity
        }
      }
    }
    
    return nil
  }
}

/**
 * URLSessionDelegate that provides client certificates for mutual TLS authentication.
 */
class ClientCertURLSessionDelegate: NSObject, URLSessionDelegate {
  let identity: SecIdentity
  
  init(identity: SecIdentity) {
    self.identity = identity
    super.init()
  }
  
  func urlSession(
    _ session: URLSession,
    didReceive challenge: URLAuthenticationChallenge,
    completionHandler: @escaping (URLSession.AuthChallengeDisposition, URLCredential?) -> Void
  ) {
    if challenge.protectionSpace.authenticationMethod == NSURLAuthenticationMethodClientCertificate {
      // Provide the client certificate
      if let credential = URLCredential(identity: identity, certificates: nil, persistence: .forSession) {
        completionHandler(.useCredential, credential)
        return
      }
    }
    
    // For other challenges, use the default handling
    completionHandler(.performDefaultHandling, nil)
  }
}

