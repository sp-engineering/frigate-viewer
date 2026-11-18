package com.frigateviewer;

import android.content.Context;
import android.content.SharedPreferences;
import android.security.KeyChain;
import android.util.Log;

import com.facebook.react.modules.network.OkHttpClientFactory;
import com.facebook.react.modules.network.ReactCookieJarContainer;

import java.net.Socket;
import java.security.KeyStore;
import java.security.Principal;
import java.security.PrivateKey;
import java.security.cert.X509Certificate;
import java.util.concurrent.TimeUnit;

import javax.net.ssl.KeyManager;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.TrustManagerFactory;
import javax.net.ssl.X509KeyManager;
import javax.net.ssl.X509TrustManager;

import okhttp3.OkHttpClient;

/**
 * Zastępuje IgnoreSSLFactory. Jeden OkHttpClient dla fetch(), <Image> (Fresco)
 * i rn-fetch-blob (klipy, share) — wszystkie biorą klienta z OkHttpClientProvider.
 *
 * Certyfikat klienta pochodzi z Android KeyChain (alias wybrany raz w MainActivity).
 * Wysyłany jest tylko wtedy, gdy serwer o niego poprosi (CertificateRequest),
 * więc serwer LAN bez mTLS działa jak dotąd, a host za Cloudflare dostaje cert.
 */
public class MtlsOkHttpFactory implements OkHttpClientFactory {
    private static final String TAG = "MtlsOkHttpFactory";
    static final String PREFS = "mtls";
    static final String KEY_ALIAS = "alias";

    private final Context ctx;

    public MtlsOkHttpFactory(Context ctx) {
        this.ctx = ctx.getApplicationContext();
    }

    @Override
    public OkHttpClient createNewNetworkModuleClient() {
        try {
            // Normalna weryfikacja serwera (system + user CA wg network_security_config.xml)
            TrustManagerFactory tmf = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
            tmf.init((KeyStore) null);
            X509TrustManager tm = (X509TrustManager) tmf.getTrustManagers()[0];

            SSLContext ssl = SSLContext.getInstance("TLS");
            ssl.init(new KeyManager[]{new KeyChainKeyManager(ctx)}, new TrustManager[]{tm}, null);

            return new OkHttpClient.Builder()
                    .connectTimeout(0, TimeUnit.MILLISECONDS)
                    .readTimeout(0, TimeUnit.MILLISECONDS)
                    .writeTimeout(0, TimeUnit.MILLISECONDS)
                    .cookieJar(new ReactCookieJarContainer())
                    .sslSocketFactory(ssl.getSocketFactory(), tm)
                    .build();
        } catch (Exception e) {
            Log.e(TAG, "init failed", e);
            throw new RuntimeException(e);
        }
    }

    /** KeyManager czytający alias z SharedPreferences przy każdym handshake'u. */
    static class KeyChainKeyManager implements X509KeyManager {
        private final Context ctx;
        private volatile String cachedAlias;
        private volatile PrivateKey cachedKey;
        private volatile X509Certificate[] cachedChain;

        KeyChainKeyManager(Context ctx) { this.ctx = ctx; }

        private String alias() {
            SharedPreferences p = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
            String a = p.getString(KEY_ALIAS, null);
            return (a == null || a.isEmpty()) ? null : a;
        }

        @Override
        public String chooseClientAlias(String[] keyType, Principal[] issuers, Socket socket) {
            return alias(); // null => nie wysyłamy certu
        }

        @Override
        public X509Certificate[] getCertificateChain(String alias) {
            load(alias);
            return cachedChain;
        }

        @Override
        public PrivateKey getPrivateKey(String alias) {
            load(alias);
            return cachedKey;
        }

        // Handshake idzie na wątku OkHttp, więc blokujące KeyChain.* jest tu OK
        private synchronized void load(String alias) {
            if (alias == null || alias.equals(cachedAlias)) return;
            try {
                cachedKey = KeyChain.getPrivateKey(ctx, alias);
                cachedChain = KeyChain.getCertificateChain(ctx, alias);
                cachedAlias = alias;
            } catch (Exception e) {
                Log.e(TAG, "KeyChain load failed for " + alias, e);
            }
        }

        @Override public String[] getClientAliases(String keyType, Principal[] issuers) { String a = alias(); return a == null ? null : new String[]{a}; }
        @Override public String chooseServerAlias(String keyType, Principal[] issuers, Socket socket) { return null; }
        @Override public String[] getServerAliases(String keyType, Principal[] issuers) { return null; }
    }
}
