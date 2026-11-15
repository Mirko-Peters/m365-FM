package fm.m365.contributor;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.SystemClock;
import android.webkit.WebView;
import androidx.activity.OnBackPressedCallback;
import androidx.core.splashscreen.SplashScreen;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.WebViewListener;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Huelle der Web-App M365.FM Contributor. Native Zusatzfunktionen (Play verlangt Mehrwert gegenueber der Webseite):
 * - Teilen-in-die-App: "Teilen" in einer anderen App (Text mit https-Link) oeffnet die Erfassen-Ansicht mit vorbefuelltem Link
 * - Zurueck-Taste geht in der Web-App zurueck und beendet die App erst auf der ersten Seite
 * - Splash-Screen bis die Seite geladen ist (hoechstens 3 Sekunden)
 * - App-Links (https://www.m365.fm/community/contributor/...) oeffnen direkt in der App
 * Diese Datei wird von tools/customize_android.py in die im CI erzeugte Android-Plattform kopiert.
 */
public class MainActivity extends BridgeActivity {
    private static final String APP_URL = "https://www.m365.fm/community/contributor/";
    private static final String APP_HOST = "www.m365.fm";
    private static final Pattern LINK = Pattern.compile("https://[^\\s<>\"']+");
    private static final long SPLASH_MAX_MS = 3000;

    private volatile boolean pageLoaded = false;
    private long startedAt;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        SplashScreen splash = SplashScreen.installSplashScreen(this);
        startedAt = SystemClock.uptimeMillis();
        splash.setKeepOnScreenCondition(() -> !pageLoaded && SystemClock.uptimeMillis() - startedAt < SPLASH_MAX_MS);
        super.onCreate(savedInstanceState);

        if (bridge != null) {
            bridge.addWebViewListener(new WebViewListener() {
                @Override
                public void onPageLoaded(WebView webView) {
                    pageLoaded = true;
                }

                @Override
                public void onReceivedError(WebView webView) {
                    pageLoaded = true;
                }
            });
        } else {
            pageLoaded = true;
        }

        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                WebView webView = bridge != null ? bridge.getWebView() : null;
                if (webView != null && webView.canGoBack()) {
                    webView.goBack();
                } else {
                    finish();
                }
            }
        });
    }

    // BridgeActivity.load() ruft onNewIntent(getIntent()) beim Start auf, damit sind Kaltstart und laufende App abgedeckt.
    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        handleIncoming(intent);
    }

    private void handleIncoming(Intent intent) {
        if (intent == null || bridge == null) {
            return;
        }
        String target = null;
        if (Intent.ACTION_SEND.equals(intent.getAction())) {
            CharSequence text = intent.getCharSequenceExtra(Intent.EXTRA_TEXT);
            if (text == null) {
                return;
            }
            String link = firstHttpsLink(text.toString());
            target = APP_URL + (link != null ? "?link=" + Uri.encode(link) : "") + "#add";
            intent.removeExtra(Intent.EXTRA_TEXT);   // nach Prozess-Neustart nicht noch einmal auswerten
            setIntent(intent);
        } else if (Intent.ACTION_VIEW.equals(intent.getAction()) && intent.getData() != null) {
            Uri data = intent.getData();
            if ("https".equals(data.getScheme()) && APP_HOST.equals(data.getHost())
                    && data.getPath() != null && data.getPath().contains("/community/contributor/")) {
                target = data.toString();
            }
        }
        if (target == null) {
            return;
        }
        final String url = target;
        final WebView webView = bridge.getWebView();
        // post: erst nach dem Start-Laden der Bridge (server.url), sonst wuerde es von diesem ueberschrieben
        webView.post(() -> webView.loadUrl(url));
    }

    static String firstHttpsLink(String text) {
        Matcher m = LINK.matcher(text);
        if (!m.find()) {
            return null;
        }
        String link = m.group();
        while (link.length() > 8 && ".,;:!?)]}".indexOf(link.charAt(link.length() - 1)) >= 0) {
            link = link.substring(0, link.length() - 1);
        }
        return link.length() > 2000 ? null : link;
    }
}
