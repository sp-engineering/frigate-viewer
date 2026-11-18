package com.frigateviewer;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.security.KeyChain;
import com.facebook.react.modules.network.OkHttpClientProvider;
import com.reactnativenavigation.NavigationActivity;

public class MainActivity extends NavigationActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        final SharedPreferences p = getSharedPreferences(MtlsOkHttpFactory.PREFS, MODE_PRIVATE);
        // Pytamy tylko raz; "Anuluj" zapisuje pusty alias, żeby nie pytać przy każdym starcie.
        if (!p.contains(MtlsOkHttpFactory.KEY_ALIAS)) {
            KeyChain.choosePrivateKeyAlias(this, alias -> {
                p.edit().putString(MtlsOkHttpFactory.KEY_ALIAS, alias == null ? "" : alias).apply();
                OkHttpClientProvider.getOkHttpClient().connectionPool().evictAll();
            }, null, null, null, -1, null);
        }
    }
}
