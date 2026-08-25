import Foundation
import React
import Security

/**
 * React Native module for accessing client certificates from iOS Keychain.
 * Allows the app to use mTLS authentication by retrieving certificates installed on the device.
 */
@objc(ClientCertModule)
class ClientCertModule: NSObject {
  
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
}
