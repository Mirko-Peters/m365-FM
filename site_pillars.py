"""Pillar-Kompendien und Lernpfad "Manufacturing Excellence" (Englisch und Deutsch).

Quellen: imports/pillars/<en|de>/<slug>.md (Dateien der Redaktion mit Metadaten-Tabelle, Artikel, Autorenbox, Quellen und internen Prüfhinweisen),
Registry und Pfad: data/pillars.json. Veröffentlicht werden nur Metadaten (Title, Description), Artikel, Autorenbox und Quellen. Wettbewerbsanalyse,
Prüfhinweise und Review-Protokoll bleiben in der Datei und erscheinen nie auf der Seite.

Seiten:  /learn/<slug>/ (en) und /de/learn/<slug>/ (de), Pfad /learn/path/<id>/ und /de/learn/path/<id>/.
Cluster: Blogbeiträge werden den Pillars per Entitäts-Themen und Slug-Muster zugeordnet (assign); jeder zugeordnete englische oder deutsche Beitrag zeigt
unten einen Kasten "Teil des Lernpfads" mit Link auf Pillar und Pfad (article_box). Verweise in den Dateien werden beim Bauen geprüft: unbekannte
Entitäten, Beiträge und Pillar-Adressen führen zu einer Warnung im Build-Log, der Link wird dann zu Text (nichts bricht den Bau)."""
import html as _html
import json
import re
from functools import lru_cache
from pathlib import Path

import site_infographics as IG   # Kopfbild und Infografiken der Leitfäden (nur mit Freigabe data/infographics_live.json)
import site_pillar_videos as PV   # Karte "Passende Videos" (Sticky-Man-Videos je Leitfaden, data/pillar_videos.json)

ROOT = Path(__file__).resolve().parent
DIR = ROOT / "imports" / "pillars"
LANGS = ("en", "de")   # handgepflegte Fassungen (imports/pillars/en, /de)
TR_LANGS = ("fr", "es", "it", "nl", "pt", "pl", "id", "ru", "uk", "ar", "he", "ja", "ko")   # Haiku-Uebersetzungen der englischen Fassung (translate_pillars.py)
UPDATED = "2026-11-20"
AUTHOR = "mirko-p"

UI = {
    "learn": ("Learn", "Lernen"), "path": ("Learning path", "Lernpfad"), "guide": ("Guide", "Leitfaden"), "step": ("Step {n} of {m}", "Schritt {n} von {m}"),
    "min": ("min read", "Min. Lesezeit"), "updated": ("Updated", "Aktualisiert"), "deeper": ("Go deeper: related articles", "Vertiefen: passende Artikel"),
    "prev": ("Previous step", "Vorheriger Schritt"), "next": ("Next step", "Nächster Schritt"), "author": ("About the author", "Über den Autor"),
    "sources": ("Sources", "Quellen"), "unv": ("unverified", "ungeprüft"), "unv_t": ("Not independently verified yet; see the sources.", "Noch nicht unabhängig belegt, siehe Quellen."),
    "start": ("Start the learning path", "Lernpfad starten"), "all": ("All guides in this path", "Alle Leitfäden in diesem Pfad"), "guides": ("Guides", "Leitfäden"),
    "paths": ("Learning paths", "Lernpfade"), "part": ("Part of the learning path", "Teil des Lernpfads"), "read": ("Read the guide", "Zum Leitfaden"),
    "overview": ("View the whole path", "Ganzen Pfad ansehen"), "disc": ("Note: The author works at iFAKT GmbH.", "Offenlegung: Der Autor arbeitet bei der iFAKT GmbH."), "articles": ("articles", "Artikel"), "toc": ("Contents", "Inhalt"),
    "src_lead": ("All online sources were retrieved on November 20, 2026.", "Alle Online-Quellen wurden am 20.11.2026 abgerufen."),
    "other": ("Deutsche Fassung", "English version"), "tbl": ("Table", "Tabelle"),
    # Vertiefungen (nur Englisch) und Leitfäden ohne Fassung der Sprache
    "deep": ("Deep dives", "Vertiefungen"), "deep_lead": ("Focused articles on single methods of this guide.", "Ausführliche Artikel zu einzelnen Methoden dieses Leitfadens (auf Englisch)."),
    "deep_one": ("Deep dive", "Vertiefung"), "deep_part": ("part of", "Teil von"), "back": ("Back to the guide", "Zurück zum Leitfaden"),
    "deep_more": ("More deep dives in this guide", "Weitere Vertiefungen dieses Leitfadens"), "en_only": ("in English", "auf Englisch"),
    # Abschlusstest und Zertifikat (Kasten auf der Pfadseite, Testseite, assets/learnquiz.js); uebersetzte Sprachen fallen auf Englisch zurueck
    "q_box": ("Final test & certificate", "Abschlusstest & Zertifikat"),
    "q_box_lead": ("Check what you have learned in this path and get a certificate for your profile.", "Prüfen Sie, was Sie in diesem Pfad gelernt haben, und erhalten Sie ein Zertifikat für Ihr Profil."),
    "q_free": ("Free of charge", "Kostenlos"),
    "q_login_need": ("Sign-in with a free m365.fm account required", "Anmeldung mit einem kostenlosen m365.fm-Konto nötig"),
    "q_count": ("{n} questions from {g} guides", "{n} Fragen aus {g} Leitfäden"),
    "q_pass": ("Pass mark {pct} % ({need} of {n} correct)", "Bestanden ab {pct} % ({need} von {n} richtig)"),
    "q_tries": ("Up to {m} attempts per 24 hours", "Bis zu {m} Versuche je 24 Stunden"),
    "q_certmail": ("Certificate via Certopus to the email address of your sign-in, ready to add to LinkedIn", "Zertifikat über Certopus an die E-Mail-Adresse Ihrer Anmeldung, mit Link für LinkedIn"),
    "q_go": ("Take the final test", "Zum Abschlusstest"),
    "q_soon": ("Test coming soon.", "Test folgt in Kürze."),
    "q_crumb": ("Final test", "Abschlusstest"),
    "q_seo": ("Final test and certificate: {path}", "Abschlusstest und Zertifikat: {path}"),
    "q_desc": ("Free final test for the learning path {path}: {n} questions, certificate by email.", "Kostenloser Abschlusstest zum Lernpfad {path}: {n} Fragen, Zertifikat per E-Mail."),
    "q_intro": ("The questions come from the guides of this path. You can open a guide at any time; after you submit, you see your result for each guide. Correct answers and explanations follow once you pass or have used all attempts.",
                "Die Fragen stammen aus den Leitfäden dieses Pfads. Sie können jederzeit nachlesen; nach der Abgabe sehen Sie Ihr Ergebnis je Leitfaden. Richtige Antworten und Erklärungen folgen nach dem Bestehen oder wenn alle Versuche aufgebraucht sind."),
    "q_back": ("Back to the learning path", "Zurück zum Lernpfad"),
    "q_nojs": ("The test needs JavaScript.", "Der Test braucht JavaScript."),
    "q_loading": ("Loading …", "Wird geladen …"),
    "q_login_h": ("Sign in", "Anmelden"), "q_result_h": ("Your result", "Ihr Ergebnis"),
    "q_login": ("Please sign in to take the test. Test and certificate are free.", "Bitte melden Sie sich an, um den Test zu machen. Test und Zertifikat sind kostenlos."),
    "q_signin": ("Sign in with", "Anmelden mit"),
    "q_start": ("Start the test", "Test starten"),
    "q_resume": ("Continue the test", "Test fortsetzen"),
    "q_left": ("Attempts left in the next 24 hours: {n} of {m}", "Verbleibende Versuche in den nächsten 24 Stunden: {n} von {m}"),
    "q_none_left": ("No attempts left for now. Please try again in 24 hours.", "Im Moment keine Versuche mehr. Bitte versuchen Sie es in 24 Stunden erneut."),
    "q_best": ("Your best result so far: {s} of {n}.", "Ihr bisher bestes Ergebnis: {s} von {n}."),
    "q_of": ("Question {i} of {n}", "Frage {i} von {n}"),
    "q_progress": ("{a} of {n} answered", "{a} von {n} beantwortet"),
    "q_valid": ("This attempt is valid until {t}.", "Dieser Versuch gilt bis {t}."),
    "q_submit": ("Submit answers", "Antworten abgeben"),
    "q_missing": ("{n} questions are still unanswered. Select Submit again to submit anyway.", "Noch {n} Fragen sind unbeantwortet. Zum Abgeben trotzdem erneut auf „Antworten abgeben“ klicken."),
    "q_noq": ("This question is not available on this page. Please reload the page.", "Diese Frage fehlt auf dieser Seite. Bitte laden Sie die Seite neu."),
    "q_result": ("Your result: {s} of {n} ({pct} %)", "Ihr Ergebnis: {s} von {n} ({pct} %)"),
    "q_passed": ("Passed – congratulations!", "Bestanden – herzlichen Glückwunsch!"),
    "q_failed": ("Not passed yet: you need {need} of {n} correct answers.", "Noch nicht bestanden: Nötig sind {need} von {n} richtigen Antworten."),
    "q_by_guide": ("Result by guide", "Ergebnis je Leitfaden"),
    "q_reread": ("Read the guide again", "Leitfaden nachlesen"),
    "q_review": ("Answers and explanations", "Antworten und Erklärungen"),
    "q_hidden": ("Correct answers and explanations for the questions you got wrong are shown once you pass or have used all attempts. Each guide's result shows what to read again.",
                 "Die richtigen Antworten und Erklärungen zu falsch beantworteten Fragen sehen Sie nach dem Bestehen oder wenn alle Versuche aufgebraucht sind. Das Ergebnis je Leitfaden zeigt, was Sie nachlesen sollten."),
    "q_hidden_noans": ("Correct answers are shown for the questions you answered.", "Richtige Antworten sehen Sie zu den Fragen, die Sie beantwortet haben."),
    "q_outdated": ("The test is being updated. Please reload this page later.", "Der Test wird gerade aktualisiert. Bitte laden Sie die Seite später neu."),
    "q_right": ("Correct", "Richtig"), "q_wrong": ("Wrong", "Falsch"),
    "q_yours": ("Your answer", "Ihre Antwort"), "q_correct": ("Correct answer", "Richtige Antwort"), "q_noans": ("no answer", "keine Antwort"),
    "q_retry": ("Try again", "Erneut versuchen"),
    "q_expired": ("This attempt has expired. Please start a new one.", "Dieser Versuch ist abgelaufen. Bitte starten Sie einen neuen."),
    "q_passed_before": ("You have passed this test ({s} of {n}).", "Sie haben diesen Test bestanden ({s} von {n})."),
    "q_cert_h": ("Your certificate", "Ihr Zertifikat"),
    "q_cert_lead": ("Certopus creates your certificate and sends it to the email address of your sign-in. The name appears on the certificate exactly as entered.",
                    "Certopus erstellt Ihr Zertifikat und schickt es an die E-Mail-Adresse Ihrer Anmeldung. Der Name steht genau so auf dem Zertifikat."),
    "q_name": ("Name on the certificate", "Name auf dem Zertifikat"),
    "q_consent": ("I agree that my name and the email address of my sign-in are sent to Certopus (DevSquirrel Technologies Private Limited, India) to create and send the certificate. More in the {link}.",
                  "Ich bin einverstanden, dass mein Name und die E-Mail-Adresse meiner Anmeldung an Certopus (DevSquirrel Technologies Private Limited, Indien) übermittelt werden, um das Zertifikat zu erstellen und zu versenden. Mehr in der {link}."),
    "q_privacy": ("privacy policy", "Datenschutzerklärung"),
    "q_cert_btn": ("Request certificate", "Zertifikat anfordern"),
    "q_cert_ok": ("Your certificate is ready. Certopus has also sent it to you by email.", "Ihr Zertifikat ist fertig. Certopus hat es Ihnen auch per E-Mail geschickt."),
    "q_cert_view": ("View certificate", "Zertifikat ansehen"),
    "q_cert_pdf": ("Download PDF", "PDF herunterladen"),
    "q_linkedin": ("Add to LinkedIn", "Zu LinkedIn hinzufügen"),
    "q_cert_off": ("Your certificate will follow soon – you will receive it by email.", "Ihr Zertifikat folgt in Kürze – Sie erhalten es per E-Mail."),
    "q_cert_err": ("The certificate could not be created right now. Please try again later.", "Das Zertifikat konnte gerade nicht erstellt werden. Bitte versuchen Sie es später erneut."),
    "q_err_name": ("Please enter a name with 2 to 80 characters.", "Bitte geben Sie einen Namen mit 2 bis 80 Zeichen ein."),
    "q_err_name_url": ("Please enter only your name – no web address, domain, @ or /.", "Bitte geben Sie nur Ihren Namen ein – ohne Webadresse, Domain, @ oder /."),
    # Empfaenger: E-Mail-Adresse der Anmeldung (Zusatzschritt beim Anbieter, worker/src/learnquiz.js certMailCallback), kein Eingabefeld
    "q_mail_to": ("The certificate goes to the email address of your sign-in: {email} ({src}).", "Das Zertifikat geht an die E-Mail-Adresse Ihrer Anmeldung: {email} ({src})."),
    "q_mail_src_account": ("confirmed address of your account", "bestätigte Adresse Ihres Kontos"),
    "q_mail_need": ("The certificate goes to the email address of your sign-in. Please take it over from one of your sign-ins – we use it only for this certificate.",
                    "Das Zertifikat geht an die E-Mail-Adresse Ihrer Anmeldung. Bitte übernehmen Sie sie aus einer Ihrer Anmeldungen – wir verwenden sie nur für dieses Zertifikat."),
    "q_mail_none": ("Your account has no sign-in that can provide an email address. Please link a sign-in with LinkedIn, Microsoft, Google or GitHub in your profile settings.",
                    "Ihr Konto hat keine Anmeldung, die eine E-Mail-Adresse liefern kann. Bitte verknüpfen Sie in Ihren Profileinstellungen eine Anmeldung bei LinkedIn, Microsoft, Google oder GitHub."),
    "q_mail_btn": ("Use the email address from your {p} sign-in", "E-Mail aus Ihrer Anmeldung bei {p} übernehmen"),
    "q_mail_other": ("To use a different address, choose another of your sign-ins:", "Für eine andere Adresse wählen Sie eine andere Ihrer Anmeldungen:"),
    "q_mail_hint": ("You will be sent to the provider briefly and then come back here. Your sign-in and your result stay as they are.",
                    "Sie werden kurz zum Anbieter weitergeleitet und kommen dann hierher zurück. Ihre Anmeldung und Ihr Ergebnis bleiben unverändert."),
    "q_mail_ok": ("The email address of your sign-in has been taken over.", "Die E-Mail-Adresse Ihrer Anmeldung wurde übernommen."),
    "q_mail_wrong": ("This sign-in does not belong to your m365.fm account. Please choose, at the provider, the account you use to sign in to m365.fm.",
                     "Diese Anmeldung gehört nicht zu Ihrem m365.fm-Konto. Bitte wählen Sie beim Anbieter das Konto, mit dem Sie sich bei m365.fm anmelden."),
    "q_mail_unverified": ("The provider has not confirmed this email address, so it cannot be used for the certificate (this is often the case with Microsoft work or school accounts). Please choose another sign-in.",
                          "Der Anbieter hat diese E-Mail-Adresse nicht bestätigt, deshalb kann sie nicht für das Zertifikat verwendet werden (bei Microsoft-Arbeits- oder Schulkonten ist das oft so). Bitte wählen Sie eine andere Anmeldung."),
    "q_mail_session": ("Your session has expired. Please try again.", "Ihre Sitzung ist abgelaufen. Bitte versuchen Sie es erneut."),
    "q_mail_cancel": ("The step was cancelled. No email address was taken over.", "Der Schritt wurde abgebrochen. Es wurde keine E-Mail-Adresse übernommen."),
    "q_err_need_email": ("Please first take over the email address of your sign-in.", "Bitte übernehmen Sie zuerst die E-Mail-Adresse Ihrer Anmeldung."),
    "q_err_consent": ("Please confirm that you agree.", "Bitte bestätigen Sie die Einwilligung."),
    "q_err_rate": ("Too many requests. Please try again later.", "Zu viele Anfragen. Bitte versuchen Sie es später erneut."),
    "q_err": ("Something went wrong. Please reload the page.", "Etwas ist schiefgelaufen. Bitte laden Sie die Seite neu."),
}


@lru_cache(maxsize=1)
def overlay():
    """data/pillars_i18n.json: {"ui": {lang: {key: text}}, "reg": {lang: {path, pillars}}, "index": [lang]} - Texte der uebersetzten Sprachen (translate_pillars.py)."""
    f = ROOT / "data" / "pillars_i18n.json"
    try: return json.loads(f.read_text("utf-8"))
    except (OSError, ValueError): return {}


def active():
    """Sprachen mit Seiten: en, de und jede uebersetzte Sprache, deren Texte und mindestens ein Leitfaden vorliegen."""
    ov = overlay()
    return LANGS + tuple(l for l in TR_LANGS if (ov.get("reg") or {}).get(l) and (ov.get("ui") or {}).get(l) and any((DIR / l).glob("*.md")))


def indexed(lang):
    """en/de immer; uebersetzte Sprachen erst nach Freigabe (data/pillars_i18n.json "index"), vorher noindex und ohne hreflang."""
    return lang in LANGS or lang in (overlay().get("index") or ())


def lp(lang):
    return "" if lang == "en" else f"/{lang}"


def tx(lang, key, **kw):
    if lang in LANGS: s = UI[key][1 if lang == "de" else 0]
    else: s = ((overlay().get("ui") or {}).get(lang) or {}).get(key) or UI[key][1 if key == "other" else 0]
    return s.format(**kw) if kw else s


def esc(s):
    return _html.escape(str(s or ""), quote=True)


def qx(lang, key, **kw):
    """Texte des Abschlusstests: Platzhalter {x} werden ersetzt, ohne str.format (eine Uebersetzung mit veraendertem Platzhalter bricht den Bau nicht,
    dann gilt der englische Text)."""
    s = tx(lang, key)
    for k, v in kw.items(): s = s.replace("{" + k + "}", str(v))
    if re.search(r"\{\w+\}", s) and lang != "en": return qx("en", key, **kw)
    return s


@lru_cache(maxsize=1)
def registry():
    r = json.loads((ROOT / "data" / "pillars.json").read_text("utf-8"))
    for lang, d in ((overlay().get("reg")) or {}).items():   # Texte der uebersetzten Sprachen daneben legen; fehlt ein Feld, gilt Englisch
        pa, dp = r["path"], d.get("path") or {}
        for k in ("title", "seo_title", "short", "intro"):
            pa[k][lang] = dp.get(k) or pa[k]["en"]
        for i, st in enumerate(pa["stages"]):
            stg = dp.get("stages") or []
            ds = stg[i] if i < len(stg) else {}
            for k in ("title", "text"): st[k][lang] = ds.get(k) or st[k]["en"]
        for p in r["pillars"]:
            p["label"][lang] = ((d.get("pillars") or {}).get(p["id"]) or {}).get("label") or p["label"]["en"]
    return r


def pillars():
    return registry()["pillars"]


def by_id(pid):
    return next((p for p in pillars() if p["id"] == pid), None)


def slug_of(p, lang):
    return p["slug"].get(lang) or p["slug"]["en"]   # uebersetzte Sprachen behalten den englischen Slug


def url(BASE, p, lang):
    return f"{BASE}{lp(lang)}/learn/{slug_of(p, lang)}/"


def path_url(BASE, lang):
    return f"{BASE}{lp(lang)}/learn/path/{registry()['path']['id']}/"


def order():
    """Pillars in Lernreihenfolge (Stufe für Stufe)."""
    return [by_id(i) for st in registry()["path"]["stages"] for i in st["pillars"]]


def pillar_file(p, lang):
    return DIR / lang / f"{slug_of(p, lang)}.md"


@lru_cache(maxsize=None)
def _has(pid, lang):
    p = by_id(pid)
    if not p: return False
    if lang == "de" and not p["slug"].get("de"): return False   # Leitfaden ohne deutsche Fassung (nur Englisch)
    return pillar_file(p, lang).exists()


def has(p, lang):
    """Gibt es den Leitfaden in dieser Sprache (Datei vorhanden)? Neue Leitfäden gibt es teils nur auf Englisch."""
    return _has(p["id"], lang)


def order_l(lang):
    """Lernreihenfolge der Leitfäden mit Fassung in dieser Sprache (Schrittzähler, Vor/Zurück: nie ein Link auf eine fehlende Seite)."""
    return [p for p in order() if has(p, lang)]


def pdate(x):
    """Datum eines Leitfadens oder einer Vertiefung (data/pillars.json "date", sonst UPDATED)."""
    return x.get("date") or UPDATED


def clusters():
    """Vertiefungen (nur Englisch): [{id, parent, slug: {en}, label: {en}}] in Reihenfolge der Registry."""
    return [c for c in registry().get("clusters") or [] if by_id(c.get("parent"))]


def clusters_of(pid):
    return [c for c in clusters() if c["parent"] == pid and cluster_file(c).exists()]


def cluster_file(c):
    return DIR / "en" / "clusters" / f"{c['slug']['en']}.md"


def cluster_url(BASE, c):
    return f"{BASE}/learn/{slug_of(by_id(c['parent']), 'en')}/{c['slug']['en']}/"


def find_cluster(parent_slug, slug):
    """Vertiefung zu /learn/<parent>/<slug>/ (Eltern-Slug en oder de) oder None."""
    p = next((q for q in pillars() if parent_slug in (q["slug"]["en"], q["slug"].get("de"))), None)
    if not p: return None
    return next((c for c in clusters_of(p["id"]) if c["slug"]["en"] == slug), None)


# ---------- Datei lesen ----------
H1 = re.compile(r"^# (.+)$")
SKIP_H1 = ("competitive", "wettbewerb", "editorial", "prüfhinweise", "pruefhinweise")


def _sections(text):
    """Teilt an Überschriften der Ebene 1 (ausserhalb von Codeblöcken) -> [(titel, [zeilen])]."""
    out, cur, fence = [], None, False
    for ln in text.splitlines():
        if ln.startswith("```"): fence = not fence
        m = None if fence else H1.match(ln)
        if m:
            cur = (m.group(1).strip(), []); out.append(cur)
        elif cur is not None:
            cur[1].append(ln)
    return out


def _split_h2(article):
    """Zieht Abschnitte am Ende heraus, die nur für die Redaktion oder als eigene Kästen gedacht sind: Autorenbox, Quellen, Review-Protokoll (## im Artikel)."""
    lines, keep, taken, cur, fence = article.split("\n"), [], {"author": [], "sources": []}, None, False
    for ln in lines:
        if ln.startswith("```"): fence = not fence
        m = None if fence else re.match(r"^##\s+(.*)$", ln)
        if m:
            t = re.sub(r"^\d+\.\s*", "", m.group(1)).strip().lower()
            if t.startswith(("review-protokoll", "review log", "prüfhinweise", "editorial notes")): cur = "drop"; continue
            if t.startswith(("quellen", "sources")): cur = "sources"; continue
            if t.startswith(("über den autor", "ueber den autor", "autorenbox", "author box", "about the author")): cur = "author"; continue
            cur = None
        if cur == "drop": continue
        if cur in taken: taken[cur].append(ln)
        else: keep.append(ln)
    return "\n".join(keep).strip("\n"), "\n".join(taken["author"]).strip("\n"), "\n".join(taken["sources"]).strip("\n")


_PLACEHOLDER = re.compile(r"[ \t]*\*?\[(?:Editor|Redaktion)[^\]]*\]\*?", re.I)
_INTERNAL = re.compile(r"\s*\([^()]*(?:review log|editorial notes|review-protokoll|prüfhinweise|competitive analysis|wettbewerbsanalyse)[^()]*\)", re.I)


_PLAN_PAREN = re.compile(r"\s*\((?:(?:planned|geplant)(?=[,;)])|in preparation|in Vorbereitung|links go live|Links werden)[^()]*\)", re.I)
_PLAN_TAIL = re.compile(r"\s*,\s*planned\)")


def scrub(md):
    """Entfernt alles, was nur für die Redaktion gedacht ist: Platzhalter ([Editor: ...]), Klammerverweise auf Prüfhinweise und Review-Protokolle,
    Zeile mit Stand und Lesezeit, Verweiszeile auf die andere Sprachfassung (die Seite setzt hreflang und einen Link selbst), Vermerke "geplant/planned"
    (alle Leitfäden des Pfads sind veröffentlicht), die nicht belegte Gründer-Aussage zu iFAKT."""
    md = _INTERNAL.sub("", _PLACEHOLDER.sub("", md))
    md = re.sub(r"\A\s*\*(?:Updated|Stand)\b[^\n]*\*[ \t]*\n", "", md)
    md = re.sub(r"(?m)^\**(?:German version|English version|Deutsche Fassung|Englische Fassung)\b:?\**.*\n?", "", md)
    md = _PLAN_TAIL.sub(")", _PLAN_PAREN.sub("", md))
    # Vermerke der neuen Leitfäden und Vertiefungen (Kursausbau 26.11.2026): alle Ziele sind veröffentlicht oder werden beim Bau geprüft
    md = re.sub(r"\s*\((?:both |all )?planned(?: (?:clusters?|pillars?|guides?|deep dives?))?\)", "", md)
    md = re.sub(r"\b([Tt]he|[Oo]ur) planned pillars?\b", r"\1 guide", md)
    md = re.sub(r"\b([Tt]he|[Oo]ur) planned clusters?\b", r"\1 deep dive", md)
    md = re.sub(r"\b([Tt]he|[Ss]ee the|[Ii]n the|[Oo]ur|[Ss]ee our) planned (?=\[[^\]]+\]\(https?://(?:www\.)?m365\.fm/(?:en/)?learn/)", r"\1 ", md)
    md = re.sub(r"(\]\(https?://(?:www\.)?m365\.fm/(?:en/)?learn/[a-z0-9/-]+\)) pillar\b", r"\1 guide", md)
    # Wettbewerber-Hinweise aus der SERP-Analyse im Fließtext (die Datei bleibt unverändert)
    md = re.sub(r"\b(Some|Several|Many|Most|Other) competitor pages\b", r"\1 web pages", md)
    md = re.sub(r"\bNearly every competitor page\b", "Nearly every web page", md)
    md = re.sub(r"\bCompetitor pages\b(?!\s*:)", "Many web pages", md)
    md = re.sub(r"\bthe vendor pages in the SERP\b", "vendor pages in search results", md)
    _FR = {"parent pillar": "Parent guide", "sibling clusters": "More deep dives", "sibling cluster": "More deep dives", "sibling deep dives": "More deep dives",
           "cluster guides": "Deep dives", "deep dives (clusters)": "Deep dives", "related pillars and clusters": "Related guides and deep dives",
           "related pillars": "Related guides", "pillar guides": "Guides in this learning path"}   # Zwischentitel der Verweislisten (Fachjargon der Redaktion)
    md = re.sub(r"(?m)^\*\*([A-Za-z ()]+)\*\*[ \t]*$", lambda m: f"**{_FR[m.group(1).strip().lower()]}**" if m.group(1).strip().lower() in _FR else m.group(0), md)
    # Bezeichnungen der Verweislisten: Leitfäden sind veröffentlicht
    md = re.sub(r"(?m)^(\*\*|#{2,4} )(?:Sister guides|Related guides|Sister compendiums|m365\.fm compendiums in English)[^*\n]*(\*\*)?[ \t]*$", lambda m: f"{m.group(1)}Related guides{m.group(2) or ''}", md)
    md = re.sub(r"(?m)^(\*\*|#{2,4} )(?:Geplante )?(?:Schwester-(?:Pillars|Kompendien)|Pillar-Pages|Kompendien)[^*\n]*(\*\*)?[ \t]*$", lambda m: f"{m.group(1)}Weiterführende Leitfäden{m.group(2) or ''}", md)
    for a, b in ((r"\b([Tt]he|[Ss]ee the|[Ii]n the) planned (?=(?:m365\.fm |\[)?[\w .&/-]{0,60}?(?:guide|guides|compendium|compendiums)\b)", r"\1 "),
                 (r"\bplanned (?=(?:m365\.fm |\[)?[\w .&/-]{0,60}?(?:guide|guides|compendium|compendiums)\b)", ""),
                 (r"\bis planned in the\b", "is given in the"),
                 (r"a separate guide is planned at", "a separate guide is at"), (r"A full guide is planned:", "A full guide:"),
                 (r"\s*[;,] eine (?:eigene )?Pillar-(?:Page|Seite)[^.;]*? ist geplant(?: \([^)]*\))?", ""),
                 (r"(?<=[.!?] )Eine (?:eigene )?Pillar-(?:Page|Seite)[^.]*? ist geplant(?: \([^)]*\))?\.[ \t]*", ""),
                 (r"\bEine (?:eigene )?Pillar-(?:Page|Seite)[^.]*? ist geplant(?: \([^)]*\))?\.[ \t]*", ""),
                 (r"geplante[n]? Pillar-(Seiten|Seite|Pages|Page)", r"Pillar-\1"),
                 (r"German version cited in the German article; English version:", "German page; English page:"),
                 (r"Die NEURONwriter-Analyse zeigt, dass Suchende bei „Wertstromanalyse Software“ vor allem wissen wollen,", "Bei der Suche nach Wertstromanalyse-Software wollen die meisten vor allem wissen,"),
                 (r"\bUS competitor pages typically", "Many US pages typically"), (r"viele Wettbewerberseiten datieren", "viele Webseiten datieren"),
                 (r"was founded in 2001 by Jörg Drees", "was, according to the company, founded in 2001"),
                 (r"wurde 2001 von Jörg Drees gegründet", "wurde nach Unternehmensangaben 2001 gegründet")):
        md = re.sub(a, b, md)
    # Adressen in Backticks (/learn/<slug>/) werden zu Links auf den Pillar
    md = re.sub(r"(?m)^(\s*[-*]\s+)`(/(?:en/)?learn/[a-z0-9-]+/(?:[a-z0-9-]+/)?)`:\s*(.+?)\s*$", lambda m: f"{m.group(1)}[{m.group(3)}](https://www.m365.fm{m.group(2)})", md)
    md = re.sub(r"(?m)^(\s*[-*]\s+)([^:\n`\[]+?):\s*`(/(?:en/)?learn/[a-z0-9-]+/(?:[a-z0-9-]+/)?)`.*$", lambda m: f"{m.group(1)}[{m.group(2).strip()}](https://www.m365.fm{m.group(3)})", md)
    return md


def parse_file(path):
    """-> dict(meta, h1, article, author, sources, multi) oder None, wenn die Datei fehlt. multi: der Artikel hat weitere Überschriften der Ebene 1 (Teile)."""
    path = Path(path)
    if not path.exists(): return None
    secs = _sections(path.read_text("utf-8"))
    d = {"meta": {}, "h1": "", "article": "", "author": "", "sources": "", "multi": False}
    for title, lines in secs:
        t = title.lower()
        body = "\n".join(lines).strip("\n")
        body = re.sub(r"(?:^|\n)---\s*$", "", body).strip("\n")
        if t.startswith(("seo",)):
            for ln in lines:
                c = [x.strip() for x in ln.strip().strip("|").split("|")]
                if len(c) >= 2 and not set(c[0]) <= set("-: ") and c[0].lower() not in ("field", "feld"):
                    d["meta"][c[0].lower()] = c[1].strip("`")
        elif t.startswith(SKIP_H1):
            continue
        elif t.startswith(("author", "autorenbox")):
            d["author"] = body
        elif t.startswith(("sources", "quellen")):
            d["sources"] = body
        elif not d["h1"]:
            d["h1"], d["article"] = title, body
        else:   # weiterer Teil des Artikels ("Part B ...")
            d["article"] += f"\n\n# {title}\n\n{body}"; d["multi"] = True
    a, au, so = _split_h2(d["article"])
    d["article"] = a
    d["author"], d["sources"] = d["author"], d["sources"]
    if au and not d["author"]: d["author"] = au
    if so and not d["sources"]: d["sources"] = so
    for k in ("article", "author", "sources"): d[k] = scrub(d[k])
    return d


def meta_value(meta, *keys):
    for k in keys:
        if k in meta:
            return re.sub(r"\s*\(\d+\s*(characters|zeichen)\b.*$", "", meta[k], flags=re.I).strip()
    return ""


# ---------- Markdown -> HTML ----------
def slugify(s):
    s = re.sub(r"<[^>]+>|[*_`]", "", re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", s)).strip().lower()
    return re.sub(r"\s", "-", re.sub(r"[^\w\- ]", "", s, flags=re.U))


class Ctx:
    """Prüfstand für Links: ents (Entitäts-IDs), posts (en: {slug}, de: {slug} mit Sprachfassung), pillars. warn sammelt Hinweise."""
    def __init__(self, BASE, ents, en_posts, de_posts, episodes=None, tr_posts=None):
        self.BASE, self.ents, self.en_posts, self.de_posts, self.episodes = BASE, ents, en_posts, de_posts, episodes
        self.tr_posts = tr_posts or {}   # {lang: {slug}} Sprachfassungen der Beitraege (ausser de)
        self.warn = []

    def link(self, u, lang):
        """-> neue Adresse oder None (Link entfällt, Text bleibt)."""
        m = re.match(r"https?://(?:www\.)?m365\.fm(/[^#?\s]*)?(#\S*)?$", u)
        if not m: return u
        path, frag = m.group(1) or "/", m.group(2) or ""
        pre = lp(lang)
        if re.match(r"/(?:en/)?learn/?$", path): return f"{self.BASE}{pre}/learn/{frag}"   # Lern-Hub
        mm = re.match(r"/(?:en/)?learn/path/([a-z0-9-]+)/?$", path)
        if mm:
            if mm.group(1) == registry()["path"]["id"]: return path_url(self.BASE, lang) + frag
            self.warn.append(f"Pillar-Adresse unbekannt: {u}"); return None
        mm = re.match(r"/(?:en/)?learn/([a-z0-9-]+)/([a-z0-9-]+)/?$", path)
        if mm:   # Vertiefung /learn/<leitfaden>/<vertiefung>/ (nur Englisch)
            c = find_cluster(*mm.groups())
            if c: return cluster_url(self.BASE, c) + frag
            self.warn.append(f"Pillar-Adresse unbekannt: {u}"); return None
        mm = re.match(r"/(?:en/)?learn/([a-z0-9-]+)/?$", path)
        if mm:
            p = next((q for q in pillars() if mm.group(1) in (q["slug"]["en"], q["slug"].get("de"))), None)
            if p: return url(self.BASE, p, lang if has(p, lang) else "en") + frag   # Leitfaden ohne Fassung der Sprache: englische Seite
            self.warn.append(f"Pillar-Adresse unbekannt: {u}"); return None
        mm = re.match(r"/entity/([a-z0-9-]+)/?$", path)
        if mm:
            if mm.group(1) in self.ents: return f"{self.BASE}{pre}/entity/{mm.group(1)}/{frag}"
            self.warn.append(f"Entität unbekannt: {mm.group(1)}"); return None
        mm = re.match(r"/community/u/([a-z0-9-]+)/blog/([a-z0-9-]+)/?$", path)
        if mm:
            h, s = mm.groups()
            if (s in self.de_posts if lang == "de" else s in self.tr_posts.get(lang, ())) and lang != "en": return f"{self.BASE}{pre}/community/u/{h}/blog/{s}/{frag}"
            if s in self.en_posts: return f"{self.BASE}/community/u/{h}/blog/{s}/{frag}"
            self.warn.append(f"Beitrag nicht live: {s}"); return None
        mm = re.match(r"/show/episodes/([a-z0-9-]+)/?$", path)
        if mm and self.episodes is not None and mm.group(1) not in self.episodes:
            self.warn.append(f"Folge unbekannt: {mm.group(1)}"); return None
        return f"{self.BASE}{path}{frag}"


def inline(s, lang, cx):
    s = esc(s)

    def _learn(m):   # `/learn/<slug>/` bzw. `/learn/<slug>/<vertiefung>/` im Text: Link auf Pillar oder Vertiefung, sonst Code
        if m.group(2):
            c = find_cluster(m.group(1), m.group(2)); lab = c and c["label"]["en"]
        else:
            p = next((q for q in pillars() if m.group(1) in (q["slug"]["en"], q["slug"].get("de"))), None); lab = p and p["label"][lang]
        if not lab or not cx: return m.group(0)
        n = cx.link(f"https://www.m365.fm/learn/{m.group(1)}/" + (f"{m.group(2)}/" if m.group(2) else ""), lang)
        return f'<a href="{esc(n)}">{esc(lab)}</a>' if n else esc(lab)
    s = re.sub(r"`/(?:en/)?learn/([a-z0-9-]+)/(?:([a-z0-9-]+)/?)?`", _learn, s)
    s = re.sub(r"`([^`]+)`", r"<code>\1</code>", s)
    s = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", s)
    s = re.sub(r"(?<!\*)\*(?!\*)([^*\n]+?)\*(?!\*)", r"<em>\1</em>", s)

    def a(m):
        label, u = m.group(1), _html.unescape(m.group(2))
        if u.startswith("#"): return f'<a href="{esc(u)}">{label}</a>'
        n = cx.link(u, lang) if cx else u
        if n is None: return label
        ext = not n.startswith(cx.BASE) if cx else True
        return f'<a href="{esc(n)}"' + (' rel="noopener" target="_blank"' if ext else "") + f'>{label}</a>'
    return re.sub(r"\[([^\]]+)\]\(((?:https?://|#)[^\s)]+)\)", a, s)


_TROW = re.compile(r"^\s*\|.*\|\s*$")
_TSEP = re.compile(r"^\s*\|[\s:|-]+\|\s*$")
_LI = re.compile(r"^(\s*)([-*]|\d+[.)])\s+(.*)$")


def _cells(r):
    return [c.strip() for c in r.strip().strip("|").split("|")]


def render(md, lang, cx, ids=True, demote=0):   # demote=1: "# Teil" wird h2, "##" h3 (Artikel mit mehreren Teilen)
    """Markdown der Kompendien -> HTML (Überschriften mit Sprungmarke, Absätze, Listen, Zitate, Tabellen, Codeblöcke)."""
    lines, out, seen, i = md.split("\n"), [], {}, 0
    heads = []

    def para(buf):
        return "<p>" + inline(" ".join(x.strip() for x in buf), lang, cx) + "</p>"
    while i < len(lines):
        ln = lines[i]
        if not ln.strip() or re.match(r"^\s*---+\s*$", ln): i += 1; continue
        if ln.startswith("```"):
            j, code = i + 1, []
            while j < len(lines) and not lines[j].startswith("```"): code.append(lines[j]); j += 1
            out.append(f"<pre><code>{esc(chr(10).join(code))}</code></pre>"); i = j + 1; continue
        m = re.match(r"^(#{1,4})\s+(.*)$", ln)
        if m:
            lvl = min(max(len(m.group(1)) + demote, 2), 4); raw = m.group(2).strip(); sid = slugify(raw) or "s"
            if sid in seen: seen[sid] += 1; sid = f"{sid}-{seen[sid]}"
            else: seen[sid] = 0
            heads.append((lvl, raw, sid))
            out.append(f'<h{lvl} id="{sid}">{inline(raw, lang, cx)}</h{lvl}>' if ids else f"<h{lvl}>{inline(raw, lang, cx)}</h{lvl}>"); i += 1; continue
        if _TROW.match(ln) and i + 1 < len(lines) and _TSEP.match(lines[i + 1]):
            j = i + 2
            while j < len(lines) and _TROW.match(lines[j]): j += 1
            head, body = _cells(ln), [_cells(r) for r in lines[i + 2:j]]
            th = "".join(f'<th scope="col">{inline(c, lang, cx)}</th>' for c in head)
            tb = "".join("<tr>" + "".join(f"<td>{inline(c, lang, cx)}</td>" for c in (r + [""] * len(head))[:max(len(head), len(r))]) + "</tr>" for r in body)
            out.append(f'<div class="pl-tbl" role="region" tabindex="0" aria-label="{esc(tx(lang, "tbl"))}"><table><thead><tr>{th}</tr></thead><tbody>{tb}</tbody></table></div>'); i = j; continue
        if ln.startswith(">"):
            j, buf = i, []
            while j < len(lines) and lines[j].startswith(">"): buf.append(re.sub(r"^>\s?", "", lines[j])); j += 1
            out.append("<blockquote>" + render("\n".join(buf), lang, cx, ids=False)[0] + "</blockquote>"); i = j; continue
        m = _LI.match(ln)
        if m:
            kind = "ol" if m.group(2)[0].isdigit() else "ul"; items, j = [], i
            start = int(re.match(r"\d+", m.group(2)).group()) if kind == "ol" else 0
            while j < len(lines):
                mm = _LI.match(lines[j])
                if mm and (mm.group(2)[0].isdigit()) == (kind == "ol"): items.append(mm.group(3).strip()); j += 1; continue
                if lines[j].strip() and lines[j].startswith("  ") and items and not _LI.match(lines[j]): items[-1] += " " + lines[j].strip(); j += 1; continue
                break
            out.append(f"<{kind}" + (f' start="{start}"' if kind == "ol" and start > 1 else "") + ">" + "".join(f"<li>{inline(x, lang, cx)}</li>" for x in items) + f"</{kind}>"); i = j; continue
        j, buf = i, []
        while j < len(lines) and lines[j].strip() and not re.match(r"^(#{1,4}\s|```|>|\s*---+\s*$)", lines[j]) and not _LI.match(lines[j]) and not (_TROW.match(lines[j]) and j + 1 < len(lines) and _TSEP.match(lines[j + 1])):
            buf.append(lines[j]); j += 1
        out.append(para(buf)); i = j
    return "\n".join(out), heads


def fix_anchors(h, heads, cx):
    """Sprungmarken des Inhaltsverzeichnisses mit den Überschrift-IDs abgleichen (Doppelstriche und Nummern ignorieren); unbekannte: Hinweis im Build-Log."""
    ids = {x[2] for x in heads}
    flat = lambda a: re.sub(r"-+", "-", a).strip("-")
    by_flat = {}
    for x in heads: by_flat.setdefault(flat(x[2]), x[2]); by_flat.setdefault(re.sub(r"^\d+-", "", flat(x[2])), x[2])

    def fix(m):
        a = m.group(1)
        if a in ids or a.startswith("src-"): return m.group(0)
        n = by_flat.get(flat(a)) or by_flat.get(re.sub(r"^\d+-", "", flat(a)))
        if n: return f'href="#{n}"'
        cx.warn.append(f"Sprungmarke ohne Überschrift: #{a}"); return m.group(0)
    return re.sub(r'href="#([^"]+)"', fix, h)


def finish(h, n_sources, lang, dropped=()):
    """Nachbearbeitung: [12] -> Sprung zur Quelle, Marker [unverified]/[ungeprüft] -> kleiner Hinweis, "(planned)"/"(geplant)" entfällt."""
    h = re.sub(r"\s*\((?:planned|geplant)\)", "", h)
    def unv(m):   # [unverified] oder [unverified: Grund] -> kleines Etikett, der Grund steht im Tooltip
        why = re.sub(r"<[^>]+>", "", m.group(1) or "")
        why = re.sub(r"[;,]?\s*(?:confirm|check|verify|re-check)\b[^;\]]*?\bbefore (?:publication|go-live|publishing)\b", "", why, flags=re.I)   # Auftrag an die Redaktion, kein Hinweis für Lesende
        why = why.strip().rstrip(".").replace('"', "&quot;")
        title = f"{tx(lang, 'unv_t')} {why[:1].upper() + why[1:]}." if why else esc(tx(lang, "unv_t"))
        return f'<sup class="pl-unv" title="{title}">{esc(tx(lang, "unv"))}</sup>'
    h = re.sub(r"\[(?:unverified|ungeprüft|ungepruft)(?::\s*([^\]]*))?\]", unv, h, flags=re.I)

    valid = n_sources if isinstance(n_sources, (set, frozenset)) else set(range(1, n_sources + 1))

    def cites(seg):
        def one(m):
            n = int(m.group(2))
            if n in valid: return f'{m.group(1)}<a class="pl-cite" href="#src-{n}">[{n}]</a>'
            return "" if n in dropped else m.group(0)   # Verweis auf eine entfallene interne Quelle verschwindet samt Leerzeichen davor
        return re.sub(r"(\s?)\[(\d{1,3})\]", one, seg)
    return re.sub(r">([^<]+)<", lambda m: ">" + cites(m.group(1)) + "<", h)


_DROP_SRC = re.compile(r"^(?:NEURONwriter\b|Competitor pages\b|Wettbewerberseiten\b)", re.I)
_URL = re.compile(r"(?<![\](\"'=])\bhttps?://[^\s<>)\]]+[^\s<>)\].,;:]")


def sources_html(md, lang, cx):
    """Quellenliste: Nummern bleiben erhalten (Verweise [n] im Text), interne Quellen (NEURONwriter-Analysen, Wettbewerberseiten) entfallen, Wettbewerber-Marken in
    Klammern ebenfalls; blosse Adressen werden zu Links; der Einleitungssatz ist ein Standardsatz. -> (html, Nummern der veröffentlichten Quellen, Nummern der entfallenen)."""
    items = []
    for ln in md.split("\n"):
        m = re.match(r"^\s*(\d{1,3})[.)]\s+(.*)$", ln)
        if m: items.append([int(m.group(1)), m.group(2)])
        elif items and ln.strip() and not ln.startswith(("#", ">")): items[-1][1] += " " + ln.strip()
    keep, dropped = [], set()
    for n, t in items:
        if _DROP_SRC.match(t.strip()) or re.search(r"\(competitor page\b", t, re.I): dropped.add(n); continue   # nur für die SERP-Analyse, im Text nicht zitiert
        t = re.sub(r"\s*\((?:competitor|Wettbewerber)\)", "", t, flags=re.I)
        t = re.sub(r"\((?:competitor|Wettbewerber), ", "(", t, flags=re.I)
        t = re.sub(r"\(used for the competitive analysis and as (?=a pointer)", "(", t)   # Arbeitsvermerke der Redaktion in Quellenangaben
        t = re.sub(r";?\s*re-checked in (?:the )?review round \d+", "", t)
        t = re.sub(r"\s*for the SERP re-check\b", "", t)
        keep.append((n, _URL.sub(lambda u: f"[{u.group(0)}]({u.group(0)})", t)))
    lis = "".join(f'<li id="src-{n}" value="{n}">{inline(t, lang, cx)}</li>' for n, t in keep)
    lead = f"<p>{esc(tx(lang, 'src_lead'))}</p>" if keep else ""
    return lead + f'<ol class="pl-src">{lis}</ol>', {n for n, _ in keep}, dropped


def faq_of(md):
    """FAQ-Fragen und Antworten aus dem Abschnitt "## FAQ"/"## Häufige Fragen" (### Frage, danach Absätze)."""
    out, inside, q, a = [], False, None, []
    for ln in md.split("\n"):
        m = re.match(r"^##\s+(.*)$", ln)
        if m:
            if q and a: out.append((q, " ".join(a)))
            q, a = None, []; inside = bool(re.match(r"(\d+\.\s*)?(FAQ|Häufige|Frequently)", m.group(1).strip(), re.I)); continue
        if not inside: continue
        m = re.match(r"^###\s+(.*)$", ln) or re.match(r"^\*\*(.+\?)\*\*\s*$", ln)
        if m:
            if q and a: out.append((q, " ".join(a)))
            q, a = m.group(1).strip(), []
        elif q and ln.strip(): a.append(ln.strip())
    if q and a: out.append((q, " ".join(a)))
    clean = lambda s: re.sub(r"\s+", " ", re.sub(r"\[(\d{1,3})\]|\[(?:unverified|ungeprüft)[^\]]*\]", "", re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", re.sub(r"[*`>]", "", s)))).strip()
    return [(clean(q), clean(a)[:1200]) for q, a in out if q and a][:12]


# ---------- Zuordnung der Blogbeiträge ----------
ASSIGN = {}   # (handle, slug) -> [pillar-ids nach Güte]
CLUSTER = {}  # pillar-id -> [post, ...] nach Güte
ASSIGN_DE = {}   # (handle, slug) -> bester Leitfaden mit deutscher Fassung (Kasten auf deutschen und übersetzten Blogseiten, wenn der erste nur Englisch ist)
CLUSTER_DE = {}  # pillar-id -> weitere Beiträge, die nur über ASSIGN_DE zugeordnet sind (Liste "Vertiefen" der deutschen und übersetzten Seiten)


def _norm(x):
    return re.sub(r"[^a-z0-9]+", " ", (x or "").lower()).strip()


def _match(p, post):
    """Güte der Zuordnung: Entitäts-Thema 2 Punkte; Slug-Muster (an Wortgrenzen) 2 Punkte, nur Titel 1 Punkt."""
    topics = set(post.get("topics") or [])
    hit = 0
    for t in p.get("topics", []):
        if t.endswith("*"): hit += sum(1 for x in topics if x.startswith(t[:-1]))
        elif t in topics: hit += 1
    rx, rr = p.get("re"), 0
    if rx:
        pat = f"(?<![a-z0-9])(?:{rx})(?![a-z0-9])"
        if re.search(pat, _norm(post.get("slug"))): rr = 2
        elif re.search(pat, _norm(post.get("title"))): rr = 1
    sc = 2 * hit + rr
    return max(sc, 4) if post.get("slug") in (p.get("pins") or ()) else sc   # fest zugeordnete Beiträge (pins) zählen mindestens als deutlicher Treffer


def assign(posts):
    """Ordnet live veröffentlichte englische Originalbeiträge den Pillars zu (Themen und Slug-Muster)."""
    ASSIGN.clear(); CLUSTER.clear(); ASSIGN_DE.clear(); CLUSTER_DE.clear()
    pool = [x for x in posts if (x.get("lang") or "en") == "en" and not x.get("tr_of") and x.get("slug") and x.get("handle")]
    for p in pillars(): CLUSTER[p["id"]] = []; CLUSTER_DE[p["id"]] = []
    de_ok = {p["id"] for p in pillars() if p["slug"].get("de")}
    for post in pool:
        sc = sorted(((_match(p, post), -i, p["id"]) for i, p in enumerate(pillars())), reverse=True)
        keep = []
        for k, (s, _, pid) in enumerate(sc[:2]):   # erster Pillar ab 2 Punkten, zweiter nur bei deutlichem Treffer (ab 4)
            if s >= (2 if k == 0 else 4): keep.append((s, pid))
        key = (post["handle"], post["slug"])
        if keep: ASSIGN[key] = [pid for _, pid in keep]
        for s, pid in keep: CLUSTER[pid].append((s, post.get("published") or 0, post))
        de = next(((s, pid) for s, _, pid in sc if pid in de_ok), None)   # wie vor dem Ausbau: bester Leitfaden unter denen mit deutscher Fassung
        if de and de[0] >= 2:
            ASSIGN_DE[key] = de[1]
            if de[1] not in ASSIGN.get(key, ()): CLUSTER_DE[de[1]].append((de[0], post.get("published") or 0, post))
    srt = lambda l: [x[2] for x in sorted(l, key=lambda y: (-y[0], -y[1]))]
    for pid in CLUSTER: CLUSTER[pid] = srt(CLUSTER[pid]); CLUSTER_DE[pid] = srt(CLUSTER_DE[pid])
    return {pid: len(v) for pid, v in CLUSTER.items()}


def related(pid, lang):
    """Zugeordnete Beiträge eines Leitfadens für Seiten dieser Sprache: en wie assign; andere Sprachen zusätzlich die Beiträge, deren erster Leitfaden
    nur Englisch ist (dort bleibt der bisherige Leitfaden mit deutscher Fassung), nach Güte."""
    return CLUSTER.get(pid, []) + ([] if lang == "en" else CLUSTER_DE.get(pid, []))


def _post_url(BASE, post, lang):
    return f"{BASE}{lp(lang)}/community/u/{post['handle']}/blog/{post['slug']}/"


def article_box(post, lang, BASE):
    """Kasten "Teil des Lernpfads" unter einem Blogbeitrag (nur freigegebene Sprachen, nur zugeordnete Beiträge)."""
    if lang not in active() or not indexed(lang): return ""   # Blogseiten verlinken nur auf freigegebene Sprachfassungen (die anderen sind noindex)
    key = (post.get("handle"), post.get("slug"))
    ids = ASSIGN.get(key)
    if not ids: return ""
    p = next((q for q in map(by_id, ids) if q and has(q, lang)), None)   # erster zugeordneter Leitfaden MIT Fassung der Sprache
    if not p and lang != "en" and ASSIGN_DE.get(key): p = by_id(ASSIGN_DE[key])   # erster nur Englisch: bisheriger Leitfaden mit deutscher Fassung
    if not p or not has(p, lang): return ""
    st = "margin:1.5em 0;padding:.8em 1em;border:1px solid var(--bd,#ccd);border-left:4px solid var(--ac,#0a6);border-radius:.4em"   # inline: Blogseiten laden das CSS der Pillar-Seiten nicht
    return (f'<aside class="pl-box" style="{st}" aria-label="{esc(tx(lang, "part"))}"><p class="mut" style="margin:.3em 0">{esc(tx(lang, "part"))}: <a href="{path_url(BASE, lang)}">{esc(registry()["path"]["title"][lang])}</a></p>'
            f'<p style="margin:.3em 0"><a href="{url(BASE, p, lang)}"><b>{esc(p["label"][lang])}</b></a> · {esc(tx(lang, "read"))}</p></aside>')


# ---------- Abschlusstest ----------
# Fragen ohne Loesung: data/pillar_quiz.json (tools/pillar_quiz.py). Die Antworten liegen nur im Worker (D1, worker/src/learnquiz.js); die Seite bettet je
# Sprache nur id, Frage und Optionen ein. Fehlt die Datei oder ist sie leer, zeigen Kasten und Testseite "Test folgt in Kürze".
QUIZ_FILE = ROOT / "data" / "pillar_quiz.json"
PER_PILLAR, PASS_PCT, MAX_TRIES = 3, 80, 3   # wie worker/src/learnquiz.js (PER_PILLAR, PASS_PCT, MAX_ATTEMPTS)
QUIZ_TARGET, PER_MIN, PER_MAX = 30, 2, 3   # wie worker/src/learnquiz.js: Fragen je Leitfaden-Gruppe = per_group(Zahl der Gruppen mit Fragen)


def per_group(n_groups):
    """Fragen je Leitfaden-Gruppe: gleichmäßig über alle Gruppen mit Fragen, Ziel QUIZ_TARGET, je Gruppe PER_MIN bis PER_MAX
    (10 Gruppen: 3 -> 30 Fragen; 15: 2 -> 30; 20: 2 -> 40). Gleiche Formel wie perGroup im Worker."""
    return min(PER_MAX, max(PER_MIN, -(-QUIZ_TARGET // max(1, n_groups))))
QUIZ_KEYS = ("id", "q", "opts")   # nur diese Felder einer Frage erreichen die Seite


def quiz_doc():
    """Inhalt von data/pillar_quiz.json für den Pfad dieser Registry, sonst {} (Datei fehlt, kaputt oder für einen anderen Pfad)."""
    try: d = json.loads(QUIZ_FILE.read_text("utf-8"))
    except (OSError, ValueError): return {}
    if not isinstance(d, dict) or not isinstance(d.get("pillars"), dict): return {}
    return d if d.get("path", registry()["path"]["id"]) == registry()["path"]["id"] else {}


def _clean_q(x):
    if not isinstance(x, dict): return None
    qid, q, opts = x.get("id"), x.get("q"), x.get("opts")
    if not (isinstance(qid, str) and re.fullmatch(r"[a-z0-9][a-z0-9-]{1,80}-\d{1,3}", qid) and isinstance(q, str) and q.strip()): return None
    if not (isinstance(opts, list) and 2 <= len(opts) <= 4 and all(isinstance(o, str) and o.strip() for o in opts)): return None
    return {"id": qid, "q": q.strip(), "opts": [o.strip() for o in opts]}


def quiz_groups(doc, lang, guide_url):
    """Fragen der Seite je Leitfaden in Lernreihenfolge: [{id, t (Titel), u (Adresse), qs: [{id, q, opts}]}]. Sprache des Tests: de oder en (andere Sprachen: en);
    fehlt einem Leitfaden die deutsche Fassung, gilt die englische."""
    ql = "de" if lang == "de" else "en"
    out = []
    for p in order():
        d = (doc.get("pillars") or {}).get(p["id"]) or {}
        if not isinstance(d, dict): continue
        qs = [c for c in (_clean_q(x) for x in (d.get(ql) or d.get("en") or [])) if c]
        if qs: out.append({"id": p["id"], "t": p["label"][lang], "u": guide_url(p), "qs": qs})
    return out


def quiz_numbers(groups):
    """-> (Fragen je Versuch, nötig zum Bestehen). Je Gruppe per_group(Zahl der Gruppen) Fragen; ohne Fragen: Annahme für alle Leitfäden des Pfads."""
    if groups:
        k = per_group(len(groups)); n = sum(min(k, len(g["qs"])) for g in groups)
    else:
        n = per_group(len(order())) * len(order())
    return n, -(-n * PASS_PCT // 100)


def quiz_url(BASE, lang):
    return path_url(BASE, lang) + "test/"


def _asset_v(name):
    import hashlib
    try: return hashlib.sha1((ROOT / "assets" / name).read_bytes()).hexdigest()[:8]
    except OSError: return "0"


def quiz_box(lang, BASE, groups):
    """Kasten "Abschlusstest & Zertifikat" unter den Stufen der Pfadseite."""
    n, need = quiz_numbers(groups)
    facts = [qx(lang, "q_free"), qx(lang, "q_login_need"), qx(lang, "q_count", n=n, g=len(groups) or len(order()), k=per_group(len(groups) or len(order()))), qx(lang, "q_pass", pct=PASS_PCT, need=need, n=n),
             qx(lang, "q_tries", m=MAX_TRIES), qx(lang, "q_certmail")]
    act = (f'<p><a class="btn main" href="{quiz_url(BASE, lang)}">{esc(qx(lang, "q_go"))}</a></p>' if groups
           else f'<p class="pl-soon"><strong>{esc(qx(lang, "q_soon"))}</strong></p>')
    return (f'<section class="pl-box pl-quiz" aria-labelledby="pl-quiz-h"><h2 id="pl-quiz-h">{esc(qx(lang, "q_box"))}</h2><p>{esc(qx(lang, "q_box_lead"))}</p>'
            f'<ul>{"".join(f"<li>{esc(x)}</li>" for x in facts)}</ul>{act}</section>')


JS_KEYS = ("q_loading", "q_login_h", "q_result_h", "q_login","q_signin", "q_start", "q_resume", "q_left", "q_none_left", "q_best", "q_of", "q_progress", "q_valid", "q_submit", "q_missing", "q_noq",
           "q_result", "q_passed", "q_failed", "q_by_guide", "q_reread", "q_review", "q_right", "q_wrong", "q_yours", "q_correct", "q_noans", "q_retry", "q_expired",
           "q_passed_before", "q_cert_h", "q_cert_lead", "q_name", "q_consent", "q_privacy", "q_cert_btn", "q_cert_ok", "q_cert_view", "q_cert_pdf", "q_linkedin",
           "q_cert_off", "q_cert_err", "q_err_name", "q_err_consent", "q_err_rate", "q_err", "q_soon", "q_err_name_url", "q_hidden", "q_hidden_noans", "q_outdated",
           "q_mail_to", "q_mail_src_account", "q_mail_need", "q_mail_none", "q_mail_btn", "q_mail_other", "q_mail_hint", "q_mail_ok", "q_mail_wrong",
           "q_mail_unverified", "q_mail_session", "q_mail_cancel", "q_err_need_email")

QUIZ_CSS = """<style>
.lq-facts{margin:.6em 0 1.2em;padding-left:1.2em}.lq-facts li{margin:.2em 0}
#lq-app{margin:1.5em 0 2em}#lq-app h2{margin-top:1.2em}
.lq-g{margin:2.2em 0 .2em;font-size:1.25rem}.lq-g a{font-size:.8rem;font-weight:500;margin-inline-start:.6em}
.lq-form .qq{margin:1.2em 0 1.6em}html:has(.lq-form){scroll-padding-bottom:7em}
.lq-bar{position:sticky;bottom:0;z-index:5;display:flex;flex-wrap:wrap;align-items:center;gap:.6em 1em;margin:1.5em 0 0;padding:.7em 0;background:var(--bg);border-top:1px solid var(--bd)}
.lq-bar progress{flex:1 1 8em;height:.55em;accent-color:var(--ac)}.lq-bar span{font-size:.92em;color:var(--mut)}
.lq-btns{display:flex;flex-wrap:wrap;gap:.6em;margin:1em 0}
.lq-big{font-size:1.25rem;font-weight:700;margin:.4em 0}
.lq-ok{color:var(--f-ok,#1e7a4a)}.lq-no{color:var(--f-err,#b3261e)}
.lq-pp{padding-left:1.2em}.lq-pp li{margin:.35em 0}
.lq-rev ol{padding-left:1.2em}.lq-rev li{margin:1.1em 0}.lq-rev p{margin:.25em 0}.lq-rev summary{cursor:pointer;font-weight:700;padding:.4em 0}
.lq-cert{margin:1.5em 0;padding:1em;border:1px solid var(--bd);border-radius:.5em;background:var(--card)}
.lq-cert label{display:block;margin:.9em 0 .3em;font-weight:600}.lq-cert input:not([type=checkbox]){width:100%;max-width:28em}
.lq-cert .lq-chk{display:flex;gap:.6em;align-items:flex-start;font-weight:400;line-height:1.45}.lq-chk input{margin-top:.25em;width:18px;height:18px;flex:none;accent-color:var(--ac)}
.lq-err{color:var(--f-err,#b3261e);font-weight:600}
.lq-mail{margin:.8em 0}.lq-mail p{margin:.4em 0}.lq-to{font-weight:600;overflow-wrap:anywhere}.lq-mail .btn{white-space:normal;text-align:center}
</style>"""


def quiz_page(g, lang, groups, pa, crumbs0, langs):
    """Testseite (noindex, nicht in der Sitemap): Fragen der Sprache als JSON, Ablauf in assets/learnquiz.js."""
    BASE, api = g["BASE"], g.get("api", "https://api-dub.m365.fm")
    tu, pu = quiz_url(BASE, lang), path_url(BASE, lang)
    title = pa["title"][lang]
    n, need = quiz_numbers(groups)
    facts = [qx(lang, "q_free"), qx(lang, "q_login_need"), qx(lang, "q_count", n=n, g=len(groups) or len(order()), k=per_group(len(groups) or len(order()))), qx(lang, "q_pass", pct=PASS_PCT, need=need, n=n),
             qx(lang, "q_tries", m=MAX_TRIES), qx(lang, "q_certmail")]
    crumbs = crumbs0 + [(qx(lang, "q_crumb"), tu)]
    nav = '<nav aria-label="breadcrumb">' + " › ".join(f'<a href="{x}">{esc(t)}</a>' for t, x in crumbs[:-1]) + f" › {esc(crumbs[-1][0])}</nav>"
    head = (f'{CSS}{QUIZ_CSS}{nav}<h1>{esc(qx(lang, "q_box"))}</h1><p class="pl-meta">{esc(tx(lang, "path"))}: <a href="{pu}">{esc(title)}</a></p>'
            f'<ul class="lq-facts">{"".join(f"<li>{esc(x)}</li>" for x in facts)}</ul>')
    if groups:
        priv = f"{BASE}/datenschutz/#lernpfad-zertifikat" if lang == "de" else f"{BASE}/privacy/#learning-path-certificate"
        cfg = {"api": api, "lang": lang, "qlang": "de" if lang == "de" else "en", "path": pa["id"], "privacy": priv, "pathUrl": pu, "max": MAX_TRIES,
               "t": {k: tx(lang, k) for k in JS_KEYS}}
        data = {"path": pa["id"], "lang": cfg["qlang"], "groups": groups}
        js = lambda o: json.dumps(o, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
        app = (f'<p>{esc(qx(lang, "q_intro"))}</p><p id="lq-status" class="lq-err" role="alert"></p><div id="lq-app"><p class="mut">{esc(qx(lang, "q_loading"))}</p>'
               f'<noscript><p><strong>{esc(qx(lang, "q_nojs"))}</strong></p></noscript></div>'
               f'<script type="application/json" id="lq-data">{js(data)}</script><script>window.M365LQ={js(cfg)}</script>'
               f'<script defer src="{BASE}/assets/learnquiz.js?v={_asset_v("learnquiz.js")}"></script>')
    else:
        app = f'<div class="pl-box"><p><strong>{esc(qx(lang, "q_soon"))}</strong></p></div>'
    b = _shell(g, lang, head + app + f'<p><a href="{pu}">{esc(qx(lang, "q_back"))}</a></p>')
    ld = [_crumb_ld(BASE, crumbs)]
    switch = {l: quiz_url(BASE, l) for l in langs}
    return g["page"](lang, qx(lang, "q_seo", path=title), qx(lang, "q_desc", path=title, n=n), tu, b, None, ld, og_type="website", noindex=True, switch=switch)


# ---------- Seiten ----------
CSS = """<style>
.pl-meta{color:var(--mut,#667);font-size:.92em;margin:.2em 0 1em}
.pl-art{max-width:46em}
.pl-art h2{margin-top:1.8em;scroll-margin-top:5em}.pl-art h3,.pl-art h4{scroll-margin-top:5em}
.pl-art blockquote{margin:1.2em 0;padding:.6em 1em;border-left:4px solid var(--ac,#0a6);background:rgba(120,140,150,.1);border-radius:0 .4em .4em 0}
.pl-art blockquote p{margin:.4em 0}
.pl-tbl{overflow-x:auto;margin:1em 0}.pl-tbl table{border-collapse:collapse;min-width:100%;font-size:.94em}
.pl-tbl th,.pl-tbl td{border:1px solid var(--bd,#ccd);padding:.4em .6em;text-align:left;vertical-align:top}
.pl-tbl th{background:rgba(120,140,150,.14)}
.pl-art pre{overflow-x:auto;padding:.8em;background:rgba(120,140,150,.12);border-radius:.4em}
.pl-unv{font-size:.7em;color:#b45;border:1px solid currentColor;border-radius:.6em;padding:0 .4em;margin-left:.15em;white-space:nowrap}
.pl-cite{text-decoration:none;font-size:.85em}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .pl-unv{color:#f4a3b6}}
:root[data-theme="dark"] .pl-unv{color:#f4a3b6}
.pl-src li{margin:.35em 0;overflow-wrap:anywhere}
.pl-step{display:flex;gap:1em;flex-wrap:wrap;margin:2em 0}.pl-step a{flex:1 1 14em;display:block;padding:.8em 1em;border:1px solid var(--bd,#ccd);border-radius:.5em;text-decoration:none}
.pl-step small{display:block;color:var(--mut,#667)}
.pl-box{margin:1.5em 0;padding:.8em 1em;border:1px solid var(--bd,#ccd);border-left:4px solid var(--ac,#0a6);border-radius:.4em}.pl-box p{margin:.3em 0}
.pl-stage{margin:2em 0 .4em}.pl-step-n{display:inline-block;min-width:2em;height:2em;line-height:2em;text-align:center;border-radius:50%;background:var(--ac,#0a6);color:#fff;margin-right:.5em;font-weight:700}
.pl-card{border:1px solid var(--bd,#ccd);border-radius:.5em;padding:1em;margin:.8em 0}.pl-card h3{margin:.1em 0 .3em}.pl-card ul{margin:.4em 0 0;padding-left:1.2em}
.pl-dd{margin:.6em 0 0}.pl-dd b{display:block;font-size:.92em}.pl-deep li{margin:.35em 0}.pl-deep small{color:var(--mut,#667)}
</style>"""


_DISC = re.compile(r"Note:|Offenlegung|Disclosure|vendor of iFAKT|Anbieter von iFAKT", re.I)


def _author_html(md, lang, cx, box=None):
    """Autorenbox der Seite: der vorhandene Kasten des Profils mirko-p (Foto, Kurzvita, Expertise; generate_site.author_box) plus der iFAKT-Hinweis aus der Datei.
    Ohne Kasten (z. B. im Test) der Text der Datei."""
    md = re.sub(r"^\*\[(?:Editor|Redaktion)[^\n]*\]\*\s*$", "", md, flags=re.M)   # Platzhalter für die Redaktion nie veröffentlichen
    if box:
        disc = [p for p in re.split(r"\n\s*\n", md) if _DISC.search(p)]
        return box(lang) + (render("\n\n".join(disc), lang, cx, ids=False)[0] if disc else f"<p><strong>{esc(tx(lang, 'disc'))}</strong></p>")   # Pflichthinweis zu iFAKT auf jeder Seite
    return render(md, lang, cx, ids=False)[0]


def _article(p, lang, BASE, cx):
    f = ROOT / "imports" / "pillars" / lang / f"{slug_of(p, lang)}.md"
    d = parse_file(f)
    if not d or not d["h1"] or not d["article"]: return None
    src_html, n_src, dropped = sources_html(d["sources"], lang, cx) if d["sources"] else ("", set(), set())
    body, heads = render(d["article"], lang, cx)   # weitere Teile ("# Teil") werden gleichrangige h2, kein Sprung in der Hierarchie
    body = fix_anchors(body, heads, cx)
    body = finish(body, n_src, lang, dropped)
    return d, body, src_html, heads


def _shell(g, lang, b, wide="56em"):
    BASE, header, footer, footer_en, LANGS_ = g["BASE"], g["header"], g["footer"], g["footer_en"], g["LANGS"]
    return f'{header(lang, "")}<main class="wrap" style="max-width:{wide}">{b}</main>{footer(lang) if lang in LANGS_ else footer_en()}'


def _crumb_ld(BASE, items):
    return {"@context": "https://schema.org", "@type": "BreadcrumbList",
            "itemListElement": [{"@type": "ListItem", "position": i + 1, "name": n, "item": u} for i, (n, u) in enumerate(items)]}


def hub_card(lang, BASE):
    """Karte des Lernpfads für die Lern-Hubs /learn/ (en) und /de/learn/."""
    if lang not in active() or not registry().get("path"): return ""
    pa = registry()["path"]
    return f'<a class="ln-card" href="{path_url(BASE, lang)}"><b>{esc(pa["title"][lang])}</b><span>{esc(pa["short"][lang])}</span></a>'


def hub_html(lang, BASE):
    c = hub_card(lang, BASE)
    return f'<h2>{esc(tx(lang, "paths"))}</h2><div class="ln-grid">{c}</div>' if c else ""


def _deep_list(BASE, cs, lang, cdocs, cls="pl-deep"):
    """Liste der Vertiefungen eines Leitfadens (Link, Beschreibung); auf Seiten anderer Sprachen mit hreflang="en"."""
    hl = '' if lang == "en" else ' hreflang="en" lang="en"'
    return "<ul>" + "".join(f'<li><a href="{cluster_url(BASE, c)}"{hl}>{esc(c["label"]["en"])}</a>' + (f' <small>{esc(cdocs[c["id"]]["desc"])}</small>' if cls == "pl-deep" and cdocs[c["id"]]["desc"] else "")
                            + "</li>" for c in cs) + "</ul>"


def build_clusters(g, cx, cdocs, pa):
    """Seiten der Vertiefungen /learn/<leitfaden>/<vertiefung>/ (nur Englisch): Canonical auf sich selbst, kein hreflang, in der Sitemap (ausser noindex)."""
    BASE, write, page, sitemap = g["BASE"], g["write"], g["page"], g["sitemap"]
    n = 0
    for c in clusters():
        d = cdocs.get(c["id"])
        if not d: continue
        p = by_id(c["parent"]); lang = "en"
        u, pu = cluster_url(BASE, c), url(BASE, p, "en")
        crumbs = [(tx(lang, "learn"), f"{BASE}/learn/"), (pa["title"][lang], path_url(BASE, lang)), (p["label"][lang], pu), (c["label"]["en"], u)]
        nav = '<nav aria-label="breadcrumb">' + " › ".join(f'<a href="{x}">{esc(t)}</a>' for t, x in crumbs[:-1]) + f" › {esc(crumbs[-1][0])}</nav>"
        sib = [x for x in clusters_of(p["id"]) if x["id"] != c["id"] and x["id"] in cdocs]
        more = (f'<section class="pl-box pl-deep"><h2>{esc(tx(lang, "deep_more"))}</h2>{_deep_list(BASE, sib, lang, cdocs)}</section>' if sib else "")
        dt = pdate(c)
        b = _shell(g, lang, f'{CSS}{nav}<article class="pl-art"><h1>{esc(d["h1"])}</h1><p class="pl-meta">{esc(tx(lang, "deep_one"))} · {esc(tx(lang, "deep_part"))} <a href="{pu}">{esc(p["label"][lang])}</a> · '
                   f'{d["mins"]} {esc(tx(lang, "min"))} · {esc(tx(lang, "updated"))} <time datetime="{dt}">{dt}</time> · <a href="{path_url(BASE, lang)}">{esc(tx(lang, "overview"))}</a></p>'
                   f'{d["body"]}</article>{more}<nav class="pl-step" aria-label="{esc(tx(lang, "path"))}"><a href="{pu}" rel="up"><small>{esc(tx(lang, "back"))}</small><b>{esc(p["label"][lang])}</b></a></nav>'
                   + (f'<section class="pl-author">{"" if g.get("author_box") else "<h2>" + esc(tx(lang, "author")) + "</h2>"}{d["auth"]}</section>' if d["auth"] else "")
                   + (f'<section class="pl-sources" id="sources"><h2>{esc(tx(lang, "sources"))}</h2>{d["src"]}</section>' if d["src"] else ""))
        art = {"@context": "https://schema.org", "@type": "Article", "@id": u + "#article", "headline": d["h1"][:110], "description": d["desc"], "inLanguage": lang,
               "url": u, "mainEntityOfPage": u, "datePublished": dt, "dateModified": dt, "wordCount": d["words"],
               "author": {"@type": "Person", "@id": f"{BASE}/community/u/{AUTHOR}/#person", "name": "Mirko Peters", "url": f"{BASE}/community/u/{AUTHOR}/"},
               "publisher": {"@id": f"{BASE}/#org"},
               "isPartOf": [{"@type": "Course", "@id": path_url(BASE, lang) + "#course", "name": pa["title"][lang], "url": path_url(BASE, lang)},
                            {"@type": "Article", "@id": pu + "#article", "name": p["label"][lang], "url": pu}]}
        ld = [art, _crumb_ld(BASE, crumbs)]
        if d["faq"]: ld.append({"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in d["faq"]]})
        noidx = bool(c.get("noindex") or p.get("noindex"))
        write(f"learn/{slug_of(p, 'en')}/{c['slug']['en']}/index.html", page(lang, d["title"], d["desc"], u, b, None, ld, og_type="article", noindex=noidx))
        if not noidx: sitemap.append((u, dt, None))
        n += 1
    return n


def _cluster_docs(BASE, cx, g):
    """Vertiefungen lesen und rendern -> {id: {h1, title, desc, body, src, auth, words, mins, faq}} (nur vorhandene Dateien)."""
    out = {}
    for c in clusters():
        d = parse_file(cluster_file(c))
        if not d or not d["h1"] or not d["article"]: print(f"Pillars: Vertiefung fehlt oder leer: en/clusters/{c['slug']['en']}.md"); continue
        src_html, n_src, dropped = sources_html(d["sources"], "en", cx) if d["sources"] else ("", set(), set())
        body, heads = render(d["article"], "en", cx)
        body = finish(fix_anchors(body, heads, cx), n_src, "en", dropped)
        words = len(re.sub(r"<[^>]+>", " ", body).split())
        out[c["id"]] = {"h1": d["h1"], "title": meta_value(d["meta"], "meta title", "meta-title") or d["h1"], "desc": meta_value(d["meta"], "meta description", "meta-description"),
                        "body": body, "src": src_html, "auth": _author_html(d["author"], "en", cx, g.get("author_box")) if d["author"] else "",
                        "words": words, "mins": max(1, round(words / 220)), "faq": faq_of(d["article"])}
    return out


def build(g, posts, ents, written=None):
    """Schreibt alle Pillar-Seiten, die Vertiefungen und die Pfadseiten. g: Kontext wie bei site_library.build. posts: live veröffentlichte Beiträge (aller Sprachen)."""
    BASE, write, page, sitemap = g["BASE"], g["write"], g["page"], g["sitemap"]
    _has.cache_clear()
    reg = registry(); pa = reg["path"]
    en_posts = {x["slug"] for x in posts if (x.get("lang") or "en") == "en" and not x.get("tr_of")}
    de_by_slug = {x["slug"]: x for x in posts if x.get("lang") == "de"}
    de_posts = set(de_by_slug)
    by_lang = {l: {x["slug"]: x for x in posts if x.get("lang") == l} for l in active() if l not in ("en",)}   # Sprachfassungen der Beitraege je Sprache
    ttl = lambda x, lang: (by_lang.get(lang, {}).get(x["slug"]) or x)["title"] if lang != "en" else x["title"]   # Seiten zeigen den Titel der Übersetzung
    cx = Ctx(BASE, ents, en_posts, de_posts, g.get("episode_slugs"), {l: set(v) for l, v in by_lang.items() if l != "de"})
    counts = assign(posts)
    langs = active()
    made = {l: 0 for l in langs}
    cards = {}
    cdocs = _cluster_docs(BASE, cx, g)   # Vertiefungen vorab: Kasten "Deep dives" auf dem Eltern-Leitfaden und Liste auf der Pfadseite
    deep = {p["id"]: [c for c in clusters_of(p["id"]) if c["id"] in cdocs] for p in pillars()}
    for lang in langs:
        ordered = order_l(lang); n_pillars = len(ordered)   # Schritte und Vor/Zurück nur über Leitfäden mit Fassung dieser Sprache
        for p in pillars():
            if not has(p, lang):
                if lang == "en" or p["slug"].get("de"): print(f"Pillars: Datei fehlt oder leer: {lang}/{slug_of(p, lang)}.md")   # Leitfäden nur auf Englisch: in anderen Sprachen kein Hinweis
                continue
            res = _article(p, lang, BASE, cx)
            if not res: print(f"Pillars: Datei fehlt oder leer: {lang}/{slug_of(p, lang)}.md"); continue
            d, body, src_html, heads = res
            u = url(BASE, p, lang)
            idx = next((i for i, q in enumerate(ordered) if q["id"] == p["id"]), None)
            words = len(re.sub(r"<[^>]+>", " ", body).split()); mins = max(1, round(words / 220))
            title = meta_value(d["meta"], "meta title", "meta-title") or d["h1"]
            desc = meta_value(d["meta"], "meta description", "meta-description")
            noidx = not indexed(lang) or bool(p.get("noindex"))
            alts = {} if p.get("noindex") else {l: url(BASE, p, l) for l in langs if indexed(l) and has(p, l)}   # hreflang nur zwischen indexierbaren Fassungen
            pv = ordered[idx - 1] if idx else None
            nx = ordered[idx + 1] if idx is not None and idx + 1 < n_pillars else None
            step = "".join(f'<a href="{url(BASE, q, lang)}"{" rel=" + chr(34) + rel + chr(34)}><small>{esc(tx(lang, key))}</small><b>{esc(q["label"][lang])}</b></a>' for q, key, rel in ((pv, "prev", "prev"), (nx, "next", "next")) if q)
            rel_posts = related(p["id"], lang)
            if lang != "en": rel_posts = [x for x in rel_posts if x["slug"] in by_lang.get(lang, {})]
            ol = "de" if lang == "en" else "en"
            other = f' · <a href="{alts[ol]}" hreflang="{ol}" lang="{ol}">{esc(tx(lang, "other"))}</a>' if ol in alts else ""
            deeper = ""
            if rel_posts:
                deeper = f'<section class="pl-deeper"><h2>{esc(tx(lang, "deeper"))}</h2><ul>' + "".join(f'<li><a href="{_post_url(BASE, x, lang)}">{esc(ttl(x, lang))}</a></li>' for x in rel_posts[:12]) + "</ul></section>"
            dd = ""
            if lang == "en" and deep.get(p["id"]):   # Kasten "Deep dives" (Vertiefungen nur auf Englisch)
                dd = (f'<section class="pl-box pl-deep" aria-labelledby="pl-deep-h"><h2 id="pl-deep-h">{esc(tx(lang, "deep"))}</h2><p>{esc(tx(lang, "deep_lead"))}</p>'
                      f'{_deep_list(BASE, deep[p["id"]], lang, cdocs)}</section>')
            _pv = g.get("pillar_videos")   # Karte "Passende Videos" (site_pillar_videos.py, data/pillar_videos.json); ohne Zuordnung bleibt die Seite unveraendert
            vids = PV.card(_pv["doc"], p["id"], lang, _pv["pages"], _pv["r2"], _pv["dims"]) if _pv else ""
            _ig = bool(IG.get("pillar", p["id"], lang))   # Kopfbild (Teilen-Bild) und 9-10 Infografiken im Text; ohne Freigabe in data/infographics_live.json bleibt die Seite unveraendert
            if _ig: body = IG.inject(body, "pillar", p["id"], lang)
            auth = _author_html(d["author"], lang, cx, g.get("author_box")) if d["author"] else ""
            crumbs = [(tx(lang, "learn"), f"{BASE}{lp(lang)}/learn/"), (pa["title"][lang], path_url(BASE, lang)), (p["label"][lang], u)]
            nav = '<nav aria-label="breadcrumb">' + " › ".join(f'<a href="{x}">{esc(n)}</a>' for n, x in crumbs[:-1]) + f" › {esc(crumbs[-1][0])}</nav>"
            dt = pdate(p)
            b = _shell(g, lang, f'{CSS}{nav}<article class="pl-art"><h1>{esc(d["h1"])}</h1><p class="pl-meta">{esc(tx(lang, "guide"))} · {esc(tx(lang, "step", n=idx + 1, m=n_pillars))} · '
                       f'{mins} {esc(tx(lang, "min"))} · {esc(tx(lang, "updated"))} <time datetime="{dt}">{dt}</time> · <a href="{path_url(BASE, lang)}">{esc(tx(lang, "overview"))}</a>{other}</p>'
                       f'{IG.hero_figure("pillar", p["id"], lang) if _ig else ""}{body}</article>{dd}{vids}{deeper}<nav class="pl-step" aria-label="{esc(tx(lang, "path"))}">{step}</nav>'
                       + (f'<section class="pl-author">{"" if g.get("author_box") else "<h2>" + esc(tx(lang, "author")) + "</h2>"}{auth}</section>' if auth else "")
                       + (f'<section class="pl-sources" id="sources"><h2>{esc(tx(lang, "sources"))}</h2>{src_html}</section>' if src_html else ""))
            author_id = f"{BASE}/community/u/{AUTHOR}/#person"
            art = {"@context": "https://schema.org", "@type": "Article", "@id": u + "#article", "headline": d["h1"][:110], "description": desc, "inLanguage": lang,
                   "url": u, "mainEntityOfPage": u, "datePublished": dt, "dateModified": dt, "wordCount": words,
                   "author": {"@type": "Person", "@id": author_id, "name": "Mirko Peters", "url": f"{BASE}/community/u/{AUTHOR}/"},
                   "publisher": {"@id": f"{BASE}/#org"},
                   "isPartOf": {"@type": "Course", "@id": path_url(BASE, lang) + "#course", "name": pa["title"][lang], "url": path_url(BASE, lang)}}
            if lang == "en" and deep.get(p["id"]): art["hasPart"] = [{"@type": "Article", "@id": cluster_url(BASE, c) + "#article", "name": c["label"]["en"], "url": cluster_url(BASE, c)} for c in deep[p["id"]]]
            _vref = PV.ld_refs(_pv["doc"], p["id"], lang, _pv["pages"], lambda x: x in _pv["ld"]) if _pv else []
            if _vref: art["video"] = _vref   # nur Verweise auf die VideoObject-Knoten der Videoseiten, keine zweite Beschreibung
            ld = [art, _crumb_ld(BASE, crumbs)] + (IG.image_ld(BASE, "pillar", p["id"], lang, u, title=d["h1"], date=dt) if _ig else [])
            faq = faq_of(d["article"])
            if faq: ld.append({"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faq]})
            write(f"{lp(lang)[1:] + '/' if lang != 'en' else ''}learn/{slug_of(p, lang)}/index.html", page(lang, title, desc, u, b, alts if len(alts) > 1 and not noidx else None, ld, xdefault=alts.get("en"), og_type="article", noindex=noidx, **(IG.page_kw("pillar", p["id"], lang) if _ig else {})))
            if not noidx: sitemap.append((u, dt, alts if len(alts) > 1 else None))
            made[lang] += 1
            cards[(lang, p["id"])] = (desc, mins)
    try:   # Vertiefungen: ein Fehler hier darf die Leitfäden und Pfadseiten nicht kippen
        n_deep = build_clusters(g, cx, cdocs, pa)
    except Exception as e:  # noqa: BLE001
        print(f"::warning::Pillars: Vertiefungen nicht gebaut: {type(e).__name__}: {e}"); n_deep = 0
    # Pfadseiten (mit Kasten "Abschlusstest & Zertifikat") und Testseiten
    qdoc = quiz_doc()
    path_langs = []
    for lang in langs:
        pu = path_url(BASE, lang)
        stages = ""
        items = []
        n = 0
        for si, st in enumerate(pa["stages"]):
            blk = ""
            for pid in st["pillars"]:
                p = by_id(pid)
                own = (lang, pid) in cards
                if not own and ("en", pid) not in cards: continue
                # Leitfaden ohne Fassung dieser Sprache (neu, nur Englisch): Karte mit Link auf die englische Seite, denn der Abschlusstest fragt ihn ab
                cl = lang if own else "en"
                desc, mins = cards[(cl, pid)]
                if own: n += 1   # Nummern wie "Schritt n von m" der Leitfadenseiten dieser Sprache; Karten nur auf Englisch ohne Nummer
                rel = related(pid, lang)
                if lang != "en": rel = [x for x in rel if x["slug"] in by_lang.get(lang, {})]
                lst = ("<ul>" + "".join(f'<li><a href="{_post_url(BASE, x, lang)}">{esc(ttl(x, lang))}</a></li>' for x in rel[:5]) + "</ul>") if rel and own else ""
                _pv = g.get("pillar_videos")
                vl = PV.path_line(_pv["doc"], pid, lang, _pv["pages"]) if _pv and own else ""   # passende Videos des Leitfadens als Links (ohne Bilder)
                dl = f'<div class="pl-dd"><b>{esc(tx(lang, "deep"))}</b>{_deep_list(BASE, deep[pid], lang, cdocs, cls="pl-dd")}</div>' if deep.get(pid) else ""
                hl = "" if own else ' hreflang="en"'
                mark = "" if own else f' <small lang="{lang}">({esc(tx(lang, "en_only"))})</small>'
                blk += (f'<div class="pl-card"><h3>{f'<span class="pl-step-n">{n}</span>' if own else ""}<a href="{url(BASE, p, cl)}"{hl}>{esc(p["label"][lang])}</a>{mark}</h3><p{"" if own else " lang=" + chr(34) + "en" + chr(34)}>{esc(desc)}</p>'
                        f'<p class="mut">{mins} {esc(tx(lang, "min"))}</p>{lst}{vl}{dl}</div>')
                items.append((n, p, cl))
            if blk: stages += f'<h2 class="pl-stage">{esc(st["title"][lang])}</h2><p class="mut">{esc(st["text"][lang])}</p>{blk}'
        if not items or not any(cl == lang for _, _, cl in items): continue
        first = url(BASE, items[0][1], items[0][2])
        crumbs = [(tx(lang, "learn"), f"{BASE}{lp(lang)}/learn/"), (pa["title"][lang], pu)]
        nav = f'<nav aria-label="breadcrumb"><a href="{crumbs[0][1]}">{esc(crumbs[0][0])}</a> › {esc(crumbs[1][0])}</nav>'
        groups = quiz_groups(qdoc, lang, lambda q, _l=lang: url(BASE, q, _l if (_l, q["id"]) in cards else "en"))   # Leitfaden ohne Fassung der Sprache: englische Seite
        b = _shell(g, lang, f'{CSS}{nav}<h1>{esc(pa["title"][lang])}</h1><p class="pl-meta">{esc(tx(lang, "path"))} · {len(items)} {esc(tx(lang, "guides"))}</p>'
                   f'<p>{esc(pa["intro"][lang])}</p><p><a class="btn main" href="{first}">{esc(tx(lang, "start"))}</a></p>{stages}{quiz_box(lang, BASE, groups)}')
        alts = {l: path_url(BASE, l) for l in langs if indexed(l)}
        noidx = not indexed(lang)
        parts = []
        for _, q, cl in items:
            parts.append({"@type": "WebPage", "name": q["label"][lang], "url": url(BASE, q, cl), **({} if cl == lang else {"inLanguage": "en"})})
            parts += [{"@type": "WebPage", "name": c["label"]["en"], "url": cluster_url(BASE, c), "inLanguage": "en"} for c in deep.get(q["id"], [])]
        ld = [{"@context": "https://schema.org", "@type": "Course", "@id": pu + "#course", "name": pa["title"][lang], "description": pa["short"][lang], "inLanguage": lang, "url": pu,
               "provider": {"@id": f"{BASE}/#org"}, "isAccessibleForFree": True, "hasPart": parts},
              {"@context": "https://schema.org", "@type": "ItemList", "name": pa["title"][lang], "itemListElement": [{"@type": "ListItem", "position": i + 1, "url": url(BASE, q, cl), "name": q["label"][lang]} for i, (_, q, cl) in enumerate(items)]},
              _crumb_ld(BASE, crumbs)]
        write(f"{lp(lang)[1:] + '/' if lang != 'en' else ''}learn/path/{pa['id']}/index.html", page(lang, pa["seo_title"][lang], pa["short"][lang], pu, b, None if noidx else alts, ld, xdefault=alts["en"], og_type="website", noindex=noidx))
        if not noidx: sitemap.append((pu, max([UPDATED] + [pdate(p) for p in pillars()] + [pdate(c) for c in clusters()]), alts))
        path_langs.append((lang, groups, crumbs))
    for lang, groups, crumbs in path_langs:   # Testseiten: noindex, nie in der Sitemap
        write(f"{lp(lang)[1:] + '/' if lang != 'en' else ''}learn/path/{pa['id']}/test/index.html", quiz_page(g, lang, groups, pa, crumbs, [l for l, _, _ in path_langs]))
    if cx.warn:
        print(f"Pillars: {len(cx.warn)} Hinweise zu Links (Link entfällt, Text bleibt):")
        for w in sorted(set(cx.warn))[:40]: print("  ", w)
    print(f"Pillars: {made['en']} englische und {made['de']} deutsche Seiten" + "".join(f", {n} {l}" for l, n in made.items() if l not in LANGS) + f", {n_deep} Vertiefungen; Pfad mit {len(order())} Leitfäden; Cluster-Artikel je Pillar:", {k: v for k, v in counts.items()})
    return made
