package com.frigateviewer;

import android.content.Context;
import android.security.KeyPairGeneratorSpec;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;

import java.io.IOException;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.CertificateException;
import java.util.Enumeration;
import java.security.KeyStore.PrivateKeyEntry;
import java.security.PrivateKey;
import java.security.cert.Certificate;
import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSocketFactory;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.Headers;

/**
 * React Native module for accessing client certificates from Android Keystore.
 * Allows the app to use mTLS authentication by retrieving certificates installed on the device.
 */
public class ClientCertModule extends ReactContextBaseJavaModule {

  private static final String MODULE_NAME = "ClientCertModule";
  private KeyStore keyStore;
  private OkHttpClient httpClient;

  public ClientCertModule(ReactApplicationContext reactContext) {
    super(reactContext);
    initializeKeyStore();
  }

  @Override
  public String getName() {
    return MODULE_NAME;
  }

  /**
   * Initialize the Android KeyStore.
   * Called during module construction to prepare KeyStore access.
   */
  private void initializeKeyStore() {
    try {
      keyStore = KeyStore.getInstance("AndroidKeyStore");
      keyStore.load(null);
    } catch (KeyStoreException | IOException | NoSuchAlgorithmException | CertificateException e) {
      android.util.Log.e(MODULE_NAME, "Failed to initialize KeyStore", e);
    }
  }

  /**
   * List all available client certificates in the device's KeyStore.
   * @param promise Promise to resolve with array of certificate aliases
   */
  @ReactMethod
  public void listCertificates(Promise promise) {
    try {
      if (keyStore == null) {
        promise.reject("KEYSTORE_NOT_INITIALIZED", "KeyStore not initialized");
        return;
      }

      WritableArray certificates = Arguments.createArray();
      Enumeration<String> aliases = keyStore.aliases();

      while (aliases.hasMoreElements()) {
        String alias = aliases.nextElement();
        if (keyStore.entryInstanceOf(alias, KeyStore.PrivateKeyEntry.class)) {
          WritableMap cert = Arguments.createMap();
          cert.putString("alias", alias);

          // Try to get certificate info
          try {
            java.security.cert.Certificate certificate = keyStore.getCertificate(alias);
            if (certificate != null) {
              cert.putString("type", certificate.getType());
            }
          } catch (Exception e) {
            android.util.Log.d(MODULE_NAME, "Could not get certificate info for " + alias, e);
          }

          certificates.pushMap(cert);
        }
      }

      promise.resolve(certificates);
    } catch (KeyStoreException e) {
      promise.reject("KEYSTORE_ERROR", "Error accessing KeyStore", e);
    }
  }

  /**
   * Get the certificate chain for a specific certificate alias.
   * @param alias The certificate alias
   * @param promise Promise to resolve with certificate chain data
   */
  @ReactMethod
  public void getCertificateChain(String alias, Promise promise) {
    try {
      if (keyStore == null) {
        promise.reject("KEYSTORE_NOT_INITIALIZED", "KeyStore not initialized");
        return;
      }

      java.security.cert.Certificate[] certChain = keyStore.getCertificateChain(alias);
      if (certChain == null) {
        promise.reject("CERT_NOT_FOUND", "Certificate not found for alias: " + alias);
        return;
      }

      WritableArray chain = Arguments.createArray();
      for (java.security.cert.Certificate cert : certChain) {
        WritableMap certData = Arguments.createMap();
        certData.putString("type", cert.getType());
        
        if (cert instanceof java.security.cert.X509Certificate) {
          java.security.cert.X509Certificate x509 = (java.security.cert.X509Certificate) cert;
          certData.putString("subjectDN", x509.getSubjectDN().toString());
          certData.putString("issuerDN", x509.getIssuerDN().toString());
        }
        
        chain.pushMap(certData);
      }

      promise.resolve(chain);
    } catch (KeyStoreException e) {
      promise.reject("KEYSTORE_ERROR", "Error accessing certificate chain", e);
    }
  }

  /**
   * Get the private key for a specific certificate alias.
   * Note: The private key itself is not returned for security reasons.
   * Instead, this method verifies that the key exists and can be used for authentication.
   * 
   * @param alias The certificate alias
   * @param promise Promise to resolve with availability status
   */
  @ReactMethod
  public void getPrivateKeyInfo(String alias, Promise promise) {
    try {
      if (keyStore == null) {
        promise.reject("KEYSTORE_NOT_INITIALIZED", "KeyStore not initialized");
        return;
      }

      if (!keyStore.containsAlias(alias)) {
        promise.reject("CERT_NOT_FOUND", "Certificate not found for alias: " + alias);
        return;
      }

      if (!keyStore.entryInstanceOf(alias, KeyStore.PrivateKeyEntry.class)) {
        promise.reject("INVALID_CERT_TYPE", "Certificate at alias is not a PrivateKeyEntry");
        return;
      }

      WritableMap result = Arguments.createMap();
      result.putString("alias", alias);
      result.putBoolean("isPrivateKeyAvailable", true);

      promise.resolve(result);
    } catch (KeyStoreException e) {
      promise.reject("KEYSTORE_ERROR", "Error checking private key", e);
    }
  }

  /**
   * Check if a certificate with the given alias exists in the KeyStore.
   * @param alias The certificate alias
   * @param promise Promise to resolve with availability status
   */
  @ReactMethod
  public void checkCertificateAvailability(String alias, Promise promise) {
    try {
      if (keyStore == null) {
        promise.reject("KEYSTORE_NOT_INITIALIZED", "KeyStore not initialized");
        return;
      }

      WritableMap result = Arguments.createMap();
      result.putBoolean("exists", keyStore.containsAlias(alias));
      result.putBoolean("isPrivateKeyEntry", 
        keyStore.containsAlias(alias) && 
        keyStore.entryInstanceOf(alias, KeyStore.PrivateKeyEntry.class));

      promise.resolve(result);
    } catch (KeyStoreException e) {
      promise.reject("KEYSTORE_ERROR", "Error checking certificate availability", e);
    }
  }

  /**
   * Perform an HTTP request using a client certificate from the KeyStore.
   * The certificate is used for mutual TLS authentication (mTLS).
   * 
   * @param url The URL to request
   * @param certAlias The certificate alias from the KeyStore
   * @param method HTTP method (GET, POST, etc.)
   * @param headers Array of header objects {key, value}
   * @param body Request body (optional)
   * @param promise Promise to resolve with the response
   */
  @ReactMethod
  public void performHttpRequestWithClientCert(
    String url,
    String certAlias,
    String method,
    ReadableArray headers,
    String body,
    Promise promise) {
    
    try {
      if (keyStore == null) {
        promise.reject("KEYSTORE_NOT_INITIALIZED", "KeyStore not initialized");
        return;
      }

      // Create an SSLContext with the client certificate
      SSLContext sslContext = createSSLContextWithClientCert(certAlias);
      if (sslContext == null) {
        promise.reject("CERT_ERROR", "Could not create SSL context with certificate: " + certAlias);
        return;
      }

      // Create an OkHttpClient with the SSL context
      OkHttpClient client = new OkHttpClient.Builder()
        .sslSocketFactory(sslContext.getSocketFactory(), new javax.net.ssl.X509TrustManager() {
          @Override
          public void checkClientTrusted(java.security.cert.X509Certificate[] chain, String authType) {
          }

          @Override
          public void checkServerTrusted(java.security.cert.X509Certificate[] chain, String authType) {
          }

          @Override
          public java.security.cert.X509Certificate[] getAcceptedIssuers() {
            return new java.security.cert.X509Certificate[0];
          }
        })
        .build();

      // Build the request
      Request.Builder requestBuilder = new Request.Builder()
        .url(url)
        .method(method, method.equals("POST") || method.equals("PUT") ? okhttp3.RequestBody.create(body, null) : null);

      // Add headers
      if (headers != null) {
        for (int i = 0; i < headers.size(); i++) {
          ReadableMap header = headers.getMap(i);
          String key = header.getString("key");
          String value = header.getString("value");
          if (key != null && value != null) {
            requestBuilder.addHeader(key, value);
          }
        }
      }

      Request request = requestBuilder.build();

      // Perform the request
      Response response = client.newCall(request).execute();

      // Build the response
      WritableMap result = Arguments.createMap();
      result.putInt("statusCode", response.code());
      result.putString("body", response.body() != null ? response.body().string() : "");

      WritableMap responseHeaders = Arguments.createMap();
      Headers respHeaders = response.headers();
      for (String name : respHeaders.names()) {
        responseHeaders.putString(name, respHeaders.get(name));
      }
      result.putMap("headers", responseHeaders);

      promise.resolve(result);

    } catch (Exception e) {
      android.util.Log.e(MODULE_NAME, "Error performing HTTP request with client cert", e);
      promise.reject("HTTP_ERROR", "Error performing HTTP request: " + e.getMessage(), e);
    }
  }

  /**
   * Create an SSLContext configured with a client certificate from the KeyStore.
   */
  private SSLContext createSSLContextWithClientCert(String certAlias) {
    try {
      // Create a KeyManagerFactory and initialize it with the KeyStore
      KeyManagerFactory kmf = KeyManagerFactory.getInstance(KeyManagerFactory.getDefaultAlgorithm());
      kmf.init(keyStore, null);

      // Create an SSLContext and initialize it with the KeyManager
      SSLContext context = SSLContext.getInstance("TLSv1.2");
      context.init(kmf.getKeyManagers(), null, null);

      return context;
    } catch (Exception e) {
      android.util.Log.e(MODULE_NAME, "Error creating SSL context with client cert", e);
      return null;
    }
  }
}

