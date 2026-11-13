#!/usr/bin/env python3
"""Passt die im CI mit `npx cap add android` erzeugte Android-Plattform an (android/mvp-tracker/android/).

Warum nicht eingecheckt: Die Capacitor-Vorlage enthaelt Rasterbilder (Splash, Symbole), die laut CLAUDE.md nicht ins Repo gehoeren,
und der Build bleibt mit package-lock.json + diesem Skript reproduzierbar. Das Skript ist idempotent (mehrfach ausfuehrbar).

Was es tut:
  1. MainActivity (Teilen-in-die-App, Zurueck-Taste, Splash) aus tools/native/ einsetzen
  2. AndroidManifest: Intent-Filter (SEND text/plain, App-Links), kein Backup, kein Klartext-Verkehr
  3. Farben/Themes (Statusleiste #3b6391, Splash), Texte, adaptive Symbole; Vorlagen-Rasterbilder (Splash) entfernen
  4. versionCode/versionName aus Umgebung (VERSION_CODE, VERSION_NAME)
  5. Signierung des Release-Builds nur ueber Umgebungsvariablen (ANDROID_KEYSTORE_PATH, ...), nie im Code
  6. google-services.json nur wenn GOOGLE_SERVICES_JSON_FILE gesetzt ist (native Push per FCM)
Keine Zugangsdaten in dieser Datei.
"""
import os
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
AND = ROOT / "android"
APP_ID = "fm.m365.contributor"
APP_NAME = "M365.FM Contributor"
PRIMARY = "#3b6391"      # Statusleiste, wie theme_color der Web-App
ICON_BG = "#1d2126"      # Hintergrund des Favicons


def die(msg):
    print("FEHLER:", msg, file=sys.stderr)
    sys.exit(1)


def read(p):
    return p.read_text(encoding="utf-8")


def write(p, s):
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(s, encoding="utf-8")


if not (AND / "app" / "build.gradle").exists():
    die("android/mvp-tracker/android fehlt: zuerst `npx cap add android` ausfuehren")
main = AND / "app" / "src" / "main"
res = main / "res"

# 1. MainActivity: Vorlage legt sie unter java/<appId als Pfad>/MainActivity.java ab
java_dir = main / "java" / Path(*APP_ID.split("."))
found = list((main / "java").rglob("MainActivity.java"))
for f in found:
    if f.parent != java_dir:
        f.unlink()
java_dir.mkdir(parents=True, exist_ok=True)
shutil.copyfile(ROOT / "tools" / "native" / "MainActivity.java", java_dir / "MainActivity.java")
print("MainActivity.java eingesetzt")

# 2. Manifest
mf = main / "AndroidManifest.xml"
x = read(mf)
x = x.replace('android:allowBackup="true"', 'android:allowBackup="false"')
if "usesCleartextTraffic" not in x:
    x = x.replace("<application", '<application\n        android:usesCleartextTraffic="false"', 1)
MARK = "<!-- m365fm: Intent-Filter -->"
if MARK not in x:
    filters = f"""{MARK}
            <!-- Teilen aus anderen Apps: Text mit Link -->
            <intent-filter>
                <action android:name="android.intent.action.SEND" />
                <category android:name="android.intent.category.DEFAULT" />
                <data android:mimeType="text/plain" />
            </intent-filter>
            <!-- App-Links: https://www.m365.fm/community/contributor/ (alle Sprachen); verifiziert ueber /.well-known/assetlinks.json -->
            <intent-filter android:autoVerify="true">
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="https" android:host="www.m365.fm" android:pathPrefix="/community/contributor/" />
                <data android:scheme="https" android:host="www.m365.fm" android:pathPattern="/..*/community/contributor/.*" />
            </intent-filter>
        """
    if "</activity>" not in x:
        die("AndroidManifest.xml: </activity> nicht gefunden")
    x = x.replace("</activity>", filters + "</activity>", 1)
write(mf, x)
print("AndroidManifest.xml angepasst")

# 3. Texte, Farben, Themes, Symbole
write(res / "values" / "strings.xml", f"""<?xml version='1.0' encoding='utf-8'?>
<resources>
    <string name="app_name">{APP_NAME}</string>
    <string name="title_activity_main">{APP_NAME}</string>
    <string name="package_name">{APP_ID}</string>
    <string name="custom_url_scheme">{APP_ID}</string>
</resources>
""")
write(res / "values" / "ic_launcher_background.xml", f"""<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">{ICON_BG}</color>
</resources>
""")
write(res / "values" / "colors.xml", f"""<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="colorPrimary">{PRIMARY}</color>
    <color name="colorPrimaryDark">{PRIMARY}</color>
    <color name="colorAccent">{PRIMARY}</color>
</resources>
""")
write(res / "values" / "styles.xml", """<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="AppTheme" parent="Theme.AppCompat.Light.DarkActionBar">
        <item name="colorPrimary">@color/colorPrimary</item>
        <item name="colorPrimaryDark">@color/colorPrimaryDark</item>
        <item name="colorAccent">@color/colorAccent</item>
    </style>

    <!-- Statusleiste in #3b6391 (ab Android 15 zeichnet die Seite unter der Leiste; der Fensterhintergrund bleibt Primaerfarbe) -->
    <style name="AppTheme.NoActionBar" parent="Theme.AppCompat.DayNight.NoActionBar">
        <item name="windowActionBar">false</item>
        <item name="windowNoTitle">true</item>
        <item name="android:windowBackground">@color/colorPrimary</item>
        <item name="android:statusBarColor">@color/colorPrimary</item>
        <item name="android:navigationBarColor">@color/colorPrimary</item>
        <item name="android:windowLightStatusBar">false</item>
    </style>

    <style name="AppTheme.NoActionBarLaunch" parent="Theme.SplashScreen">
        <item name="windowSplashScreenBackground">@color/ic_launcher_background</item>
        <item name="windowSplashScreenAnimatedIcon">@mipmap/ic_launcher_foreground</item>
        <item name="postSplashScreenTheme">@style/AppTheme.NoActionBar</item>
    </style>
</resources>
""")
adaptive = """<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
"""
write(res / "mipmap-anydpi-v26" / "ic_launcher.xml", adaptive)
write(res / "mipmap-anydpi-v26" / "ic_launcher_round.xml", adaptive)
# Vorlagen-Dateien, die wir ersetzen oder nicht brauchen (Splash-Rasterbilder, Vektor-Symbol der Vorlage)
for pattern in ("drawable*/splash.png",):
    for f in res.glob(pattern):
        f.unlink()
for f in (res / "drawable" / "ic_launcher_background.xml", res / "drawable-v24" / "ic_launcher_foreground.xml"):
    if f.exists():
        f.unlink()
print("Ressourcen geschrieben")

# 4. Version und 5. Signierung in app/build.gradle
bg = AND / "app" / "build.gradle"
g = read(bg)
vc, vn = os.environ.get("VERSION_CODE", "1"), os.environ.get("VERSION_NAME", "1.0.0")
if not vc.isdigit():
    die("VERSION_CODE muss eine Zahl sein")
if not re.fullmatch(r"[0-9A-Za-z.\-]+", vn):
    die("VERSION_NAME enthaelt unzulaessige Zeichen")
g = re.sub(r"versionCode\s+\d+", f"versionCode {vc}", g, count=1)
g = re.sub(r'versionName\s+"[^"]*"', f'versionName "{vn}"', g, count=1)
if f'applicationId "{APP_ID}"' not in g and f"applicationId '{APP_ID}'" not in g and f'applicationId = "{APP_ID}"' not in g:
    die("applicationId in app/build.gradle ist nicht " + APP_ID)
SIGN = "// m365fm: Signierung ueber Umgebungsvariablen"
if SIGN not in g:
    g += f"""

{SIGN} (CI-Secrets). Ohne ANDROID_KEYSTORE_PATH bleibt der Release-Build unsigniert.
def m365KeystorePath = System.getenv("ANDROID_KEYSTORE_PATH")
if (m365KeystorePath) {{
    android {{
        signingConfigs {{
            release {{
                storeFile file(m365KeystorePath)
                storePassword System.getenv("ANDROID_KEYSTORE_PASSWORD")
                keyAlias System.getenv("ANDROID_KEY_ALIAS")
                keyPassword System.getenv("ANDROID_KEY_PASSWORD")
            }}
        }}
        buildTypes {{
            release {{
                signingConfig signingConfigs.release
            }}
        }}
    }}
}}
"""
write(bg, g)
print(f"build.gradle: versionCode {vc}, versionName {vn}")

# 6. Native Push: google-services.json nur aus Secret
gs = os.environ.get("GOOGLE_SERVICES_JSON_FILE", "").strip()
if gs:
    if not Path(gs).is_file():
        die("GOOGLE_SERVICES_JSON_FILE zeigt auf keine Datei")
    shutil.copyfile(gs, AND / "app" / "google-services.json")
    print("google-services.json eingesetzt: native Push (FCM) vorbereitet")
else:
    print("keine google-services.json: native Push bleibt inaktiv")
