"""Expert Connect (Publisher-Tool) /community/expert-connect/ (EN) und /de/community/expert-connect/ (DE).
Eine Seite mit nach Rollen gruppierten Bereichen: Experten finden, Anfrage ausschreiben, Meine Anfragen, passende Anfragen, Offene Aufrufe, Moderation (nur Admins).
Die Seite ist noindex; Anfragen lassen sich ohne Anmeldung ausfüllen, Veröffentlichungen laufen über den Worker (worker/src/expert_requests.js).
Themen fuer die Auswahl: community/expert-connect/topics.json (Entitaeten ohne Personen, Firmen und Events), wird nur bei Bedarf geladen.
Entwurf: design/publisher/ (Klickdummy)."""
import hashlib
import html
import json
from pathlib import Path

ROOT = Path(__file__).parent
TOPIC_TYPES = {"concept", "product", "cert", "platform", "category"}

T = {
    "en": {
        "title": "Expert Connect: find experts or post a request", "kicker": "Expert Connect",
        "h1": "Expert Connect: find experts or post a request",
        "lede": "Find verified experts for quotes, interviews, guest articles, podcasts and talks – or post a topic and let experts apply. Free, opt-in only, contact details after acceptance.",
        "desc": "Expert Connect: find experts or post a request",
        "hero_search": "Find experts", "hero_request": "Post a request", "hero_calls": "Are you an expert? See open calls",
        "group_seek": "I need an expert", "group_expert": "I am an expert",
        "tab_search": "Find experts", "tab_request": "Post a request", "tab_requests": "My requests", "tab_expert": "Matching requests & settings", "tab_calls": "Open calls", "tab_mod": "Moderation",
        "request_guest": "To publish, sign in with your community account – your text is kept.",
        "loading": "Loading …", "login": "Sign in with your community account to use this area.", "signin": "Sign in", "error": "Something went wrong. Please try again.",
        "q": "Topic or keyword", "search": "Search", "any": "Any", "format": "Format", "lang": "Language", "program": "Program", "level": "Level", "level_min": "Level ≥",
        "no_hits": "No matching experts yet. Try a broader topic or post a request – matching experts are notified.",
        "profile": "Profile", "ask_all": "Send one request to all matches", "score": "Match",
        "f_quote": "Quote", "f_interview": "Interview", "f_article": "Guest article", "f_podcast": "Podcast guest", "f_talk": "Talk",
        "r_title": "Title", "r_desc": "Briefing (20–1000 characters, no links or contact details)", "r_topics": "Topics (1–10)", "r_topic_ph": "Type a topic, e.g. Copilot", "add": "Add",
        "r_deadline": "Deadline (max. 60 days)", "r_mode": "Type", "mode_match": "Request to matching experts", "mode_open": "Open call – experts apply",
        "r_audience": "Who may answer", "aud_all": "All verified experts", "aud_mvp": "Only Microsoft MVPs", "aud_mct": "Only MCTs",
        "r_reach": "Medium and reach (e.g. trade magazine, 40k readers)", "r_hide": "Hide my medium until I accept an answer",
        "r_editorial": "This is an editorial request – no advertising, link building, surveys or sales.",
        "preview": "Check matches", "draft": "Save draft", "publish": "Publish",
        "preview_n": "{n} experts match right now ({mvp} MVP, {mct} MCT).", "preview_0": "No expert matches yet. You can still publish – new experts are matched daily.",
        "published": "Published. Matching experts are notified.", "held": "Saved. Your request is checked by a moderator before it goes out.", "drafted": "Draft saved.",
        "limits": "Limits: 5 new requests per week, 2 open calls at a time, accounts must be at least 24 hours old.",
        "my_none": "You have not created any requests yet.", "replies": "Answers", "no_replies": "No answers yet.",
        "accept": "Accept", "decline": "Decline", "report": "Report", "block": "Block", "close": "Close request", "extend": "Extend deadline", "sure": "Sure?",
        "reason": "Reason (optional)", "send_report": "Send report", "reported": "Reported. Thank you.", "blocked": "Blocked.", "closed": "Closed.", "accepted": "Accepted – contact details:",
        "declined": "Declined.", "extended": "Deadline extended.", "publish_draft": "Publish draft", "edit": "Edit",
        "st_draft": "Draft", "st_open": "Open", "st_held": "In review", "st_accepted": "Accepted", "st_closed": "Closed",
        "kind_match": "Answer", "kind_application": "Application",
        "matches_h": "Requests that match you", "matches_none": "No matching requests right now. Make sure your settings below are switched on.",
        "pitch": "Your short pitch (max. 600 characters, no contact details)", "send": "Send", "sent": "Sent.", "why": "Why you", "shared": "Shared topics",
        "accepted_h": "Accepted", "accepted_none": "Nothing accepted yet.", "settings_h": "My Expert Connect settings",
        "opt_in": "I want to receive requests from publishers (opt-in)", "s_formats": "Formats I accept", "s_langs": "Languages",
        "notify": "Notifications", "n_push": "Push right away", "n_weekly": "Weekly e-mail", "n_both": "Both", "n_none": "None",
        "contact": "Contact shared after acceptance", "c_platform": "Community messages", "c_email": "E-mail", "c_linkedin": "LinkedIn", "c_website": "Website",
        "contact_value": "Address or link", "pause": "Pause for 2 weeks", "paused_until": "Paused until {d}.", "save": "Save", "saved": "Saved.",
        "req_note": "Requests reach only verified MVPs/MCTs with a public profile, an active speaker listing and expertise level ≥ 3 in the topic.",
        "calls_h": "Open calls", "calls_none": "No open calls right now.", "sort_match": "Best match first", "sort_new": "Newest first", "apply": "Apply", "applied": "Application sent.", "responded": "You already applied.",
        "mod_held": "Held requests", "mod_reports": "Reports", "mod_log": "Moderation log", "release": "Release", "reject": "Reject", "delete_reply": "Delete answer", "none": "Nothing here.",
        "e_account_too_new": "New accounts can post after 24 hours.", "e_weekly_limit": "Maximum 5 new requests per week.", "e_open_call_limit": "Maximum 2 open calls at a time.",
        "e_daily_limit": "Maximum 10 answers per day.", "e_already_replied": "You already answered.", "e_blocked": "This account is blocked.", "e_text": "Please fill in the title and a briefing of at least 20 characters.",
        "e_topics": "Choose 1 to 10 topics.", "e_topic": "Unknown topic: {t}", "e_format": "Choose a format.", "e_lang": "Choose a language.", "e_deadline": "The deadline must be between today and 60 days ahead.",
        "e_contact_details": "Please remove links, e-mail addresses and phone numbers – contact details are shared after acceptance.", "e_audience": "Choose who may answer.",
        "e_opt_in_required": "Switch on Expert Connect in your settings and add a matching speaker listing first.", "e_rate_limit": "Too many reports – please try again later.",
        "e_bad_contact": "Please enter a valid e-mail address or https link.", "e_editorial": "Please confirm that this is an editorial request.",
        "e_not_found": "This item is no longer available.", "e_pitch": "Please write a short pitch.",
        "also": "Also useful", "mediakit": "Media kit", "landing": "How Expert Connect works", "members": "Member directory",
        "how_h": "How Expert Connect works",
        "how_seek_h": "For editors, podcasters and organizers",
        "how_seek": ["Post a request: title, short briefing, 1–10 topics, format (quote, interview, guest article, podcast, talk), language and a deadline of up to 60 days. Choose a request to matching experts or an open call.",
                     "We match it: verified Microsoft MVPs and MCTs who have switched on Expert Connect, have a public profile and are strong in your topic get notified by push or weekly e-mail. Some requests are checked by a moderator first.",
                     "Experts answer with a short pitch – or apply to your open call. You see why each expert fits.",
                     "You accept or decline. Only after you accept do you receive the contact details the expert has shared."],
        "how_expert_h": "For experts",
        "how_expert": ["Switch on Expert Connect in your settings (opt-in) and choose the formats, languages, notifications and the contact you want to share.",
                       "Keep your public profile and speaker listing up to date – topics and expertise decide which requests reach you.",
                       "Answer matching requests or apply to open calls with a short pitch (max. 600 characters, no contact details).",
                       "If the requester accepts, they receive the contact you chose. You can pause for two weeks at any time."],
        "how_rules": "Free for both sides. Editorial requests only – no advertising, link building, surveys or sales. No contact details before acceptance.",
    },
    "de": {
        "title": "Expert Connect: Experten finden oder Anfrage ausschreiben", "kicker": "Expert Connect",
        "h1": "Expert Connect: Experten finden oder Anfrage ausschreiben",
        "lede": "Finde verifizierte Experten für Zitate, Interviews, Gastbeiträge, Podcasts und Vorträge – oder stelle ein Thema ein und lass Experten sich bewerben. Kostenlos, nur mit Zustimmung, Kontakt erst nach Annahme.",
        "desc": "Expert Connect: Experten finden oder Anfrage ausschreiben",
        "hero_search": "Experten finden", "hero_request": "Anfrage ausschreiben", "hero_calls": "Du bist Experte? Offene Aufrufe ansehen",
        "group_seek": "Ich suche Experten", "group_expert": "Ich bin Experte",
        "tab_search": "Experten finden", "tab_request": "Anfrage ausschreiben", "tab_requests": "Meine Anfragen", "tab_expert": "Passende Anfragen & Einstellungen", "tab_calls": "Offene Aufrufe", "tab_mod": "Moderation",
        "request_guest": "Zum Veröffentlichen meldest du dich mit deinem Community-Konto an – dein Text bleibt erhalten.",
        "loading": "Wird geladen …", "login": "Melde dich mit deinem Community-Konto an, um diesen Bereich zu nutzen.", "signin": "Anmelden", "error": "Da ist etwas schiefgegangen. Bitte erneut versuchen.",
        "q": "Thema oder Stichwort", "search": "Suchen", "any": "Alle", "format": "Format", "lang": "Sprache", "program": "Programm", "level": "Level", "level_min": "Level ≥",
        "no_hits": "Noch keine passenden Experten. Versuche ein breiteres Thema oder stelle eine Anfrage – passende Experten werden benachrichtigt.",
        "profile": "Profil", "ask_all": "Eine Anfrage an alle Treffer", "score": "Treffer",
        "f_quote": "Zitat", "f_interview": "Interview", "f_article": "Gastbeitrag", "f_podcast": "Podcast-Gast", "f_talk": "Vortrag",
        "r_title": "Titel", "r_desc": "Briefing (20–1000 Zeichen, ohne Links und Kontaktdaten)", "r_topics": "Themen (1–10)", "r_topic_ph": "Thema eingeben, z. B. Copilot", "add": "Hinzufügen",
        "r_deadline": "Frist (max. 60 Tage)", "r_mode": "Art", "mode_match": "Anfrage an passende Experten", "mode_open": "Offener Aufruf – Experten bewerben sich",
        "r_audience": "Wer darf antworten", "aud_all": "Alle verifizierten Experten", "aud_mvp": "Nur Microsoft MVPs", "aud_mct": "Nur MCTs",
        "r_reach": "Medium und Reichweite (z. B. Fachmagazin, 40.000 Leser)", "r_hide": "Mein Medium verbergen, bis ich eine Antwort annehme",
        "r_editorial": "Das ist eine redaktionelle Anfrage – keine Werbung, kein Linkaufbau, keine Umfrage, kein Vertrieb.",
        "preview": "Treffer prüfen", "draft": "Als Entwurf speichern", "publish": "Veröffentlichen",
        "preview_n": "Aktuell passen {n} Experten ({mvp} MVP, {mct} MCT).", "preview_0": "Noch passt kein Experte. Du kannst trotzdem veröffentlichen – neue Experten werden täglich abgeglichen.",
        "published": "Veröffentlicht. Passende Experten werden benachrichtigt.", "held": "Gespeichert. Deine Anfrage wird vor dem Versand von der Moderation geprüft.", "drafted": "Entwurf gespeichert.",
        "limits": "Grenzen: 5 neue Anfragen pro Woche, 2 offene Aufrufe gleichzeitig, Konten müssen mindestens 24 Stunden alt sein.",
        "my_none": "Du hast noch keine Anfragen erstellt.", "replies": "Antworten", "no_replies": "Noch keine Antworten.",
        "accept": "Annehmen", "decline": "Ablehnen", "report": "Melden", "block": "Sperren", "close": "Anfrage schließen", "extend": "Frist verlängern", "sure": "Sicher?",
        "reason": "Grund (optional)", "send_report": "Meldung senden", "reported": "Gemeldet. Danke.", "blocked": "Gesperrt.", "closed": "Geschlossen.", "accepted": "Angenommen – Kontaktdaten:",
        "declined": "Abgelehnt.", "extended": "Frist verlängert.", "publish_draft": "Entwurf veröffentlichen", "edit": "Bearbeiten",
        "st_draft": "Entwurf", "st_open": "Offen", "st_held": "In Prüfung", "st_accepted": "Angenommen", "st_closed": "Geschlossen",
        "kind_match": "Antwort", "kind_application": "Bewerbung",
        "matches_h": "Anfragen, die zu dir passen", "matches_none": "Gerade passt keine Anfrage. Prüfe, ob deine Einstellungen unten eingeschaltet sind.",
        "pitch": "Dein Kurz-Pitch (max. 600 Zeichen, ohne Kontaktdaten)", "send": "Senden", "sent": "Gesendet.", "why": "Warum du", "shared": "Gemeinsame Themen",
        "accepted_h": "Angenommen", "accepted_none": "Noch nichts angenommen.", "settings_h": "Meine Expert-Connect-Einstellungen",
        "opt_in": "Ich möchte Anfragen von Redaktionen erhalten (Opt-in)", "s_formats": "Formate, die ich annehme", "s_langs": "Sprachen",
        "notify": "Benachrichtigung", "n_push": "Push sofort", "n_weekly": "Wöchentliche E-Mail", "n_both": "Beides", "n_none": "Keine",
        "contact": "Kontakt, der nach Annahme geteilt wird", "c_platform": "Community-Nachrichten", "c_email": "E-Mail", "c_linkedin": "LinkedIn", "c_website": "Website",
        "contact_value": "Adresse oder Link", "pause": "2 Wochen pausieren", "paused_until": "Pausiert bis {d}.", "save": "Speichern", "saved": "Gespeichert.",
        "req_note": "Anfragen erreichen nur verifizierte MVPs/MCTs mit öffentlichem Profil, aktivem Speaker-Eintrag und Fachlevel ≥ 3 im Thema.",
        "calls_h": "Offene Aufrufe", "calls_none": "Gerade gibt es keine offenen Aufrufe.", "sort_match": "Beste Treffer zuerst", "sort_new": "Neueste zuerst", "apply": "Bewerben", "applied": "Bewerbung gesendet.", "responded": "Du hast dich schon beworben.",
        "mod_held": "Zurückgehaltene Anfragen", "mod_reports": "Meldungen", "mod_log": "Moderationsprotokoll", "release": "Freigeben", "reject": "Ablehnen", "delete_reply": "Antwort löschen", "none": "Nichts vorhanden.",
        "e_account_too_new": "Neue Konten können nach 24 Stunden Anfragen stellen.", "e_weekly_limit": "Höchstens 5 neue Anfragen pro Woche.", "e_open_call_limit": "Höchstens 2 offene Aufrufe gleichzeitig.",
        "e_daily_limit": "Höchstens 10 Antworten pro Tag.", "e_already_replied": "Du hast schon geantwortet.", "e_blocked": "Dieses Konto ist gesperrt.", "e_text": "Bitte Titel und ein Briefing mit mindestens 20 Zeichen angeben.",
        "e_topics": "Wähle 1 bis 10 Themen.", "e_topic": "Unbekanntes Thema: {t}", "e_format": "Wähle ein Format.", "e_lang": "Wähle eine Sprache.", "e_deadline": "Die Frist muss zwischen heute und 60 Tagen liegen.",
        "e_contact_details": "Bitte Links, E-Mail-Adressen und Telefonnummern entfernen – Kontaktdaten werden nach der Annahme geteilt.", "e_audience": "Wähle, wer antworten darf.",
        "e_opt_in_required": "Schalte zuerst Expert Connect in deinen Einstellungen ein und lege einen passenden Speaker-Eintrag an.", "e_rate_limit": "Zu viele Meldungen – bitte später erneut versuchen.",
        "e_bad_contact": "Bitte eine gültige E-Mail-Adresse oder einen https-Link angeben.", "e_editorial": "Bitte bestätige, dass es eine redaktionelle Anfrage ist.",
        "e_not_found": "Dieser Eintrag ist nicht mehr verfügbar.", "e_pitch": "Bitte schreibe einen kurzen Pitch.",
        "also": "Auch hilfreich", "mediakit": "Mediadaten", "landing": "So funktioniert Expert Connect", "members": "Mitgliederverzeichnis",
        "how_h": "So funktioniert Expert Connect",
        "how_seek_h": "Für Redaktionen, Podcaster und Veranstalter",
        "how_seek": ["Anfrage ausschreiben: Titel, kurzes Briefing, 1–10 Themen, Format (Zitat, Interview, Gastbeitrag, Podcast, Vortrag), Sprache und eine Frist von bis zu 60 Tagen. Du wählst: Anfrage an passende Experten oder offener Aufruf.",
                     "Wir gleichen ab: Verifizierte Microsoft MVPs und MCTs, die Expert Connect eingeschaltet haben, ein öffentliches Profil haben und im Thema stark sind, werden per Push oder wöchentlicher E-Mail benachrichtigt. Manche Anfragen prüft vorher die Moderation.",
                     "Experten antworten mit einem kurzen Pitch – oder bewerben sich auf deinen offenen Aufruf. Du siehst, warum jemand passt.",
                     "Du nimmst an oder lehnst ab. Erst nach der Annahme bekommst du die Kontaktdaten, die der Experte freigegeben hat."],
        "how_expert_h": "Für Experten",
        "how_expert": ["Schalte Expert Connect in deinen Einstellungen ein (Opt-in) und wähle Formate, Sprachen, Benachrichtigung und den Kontakt, den du teilen möchtest.",
                       "Halte dein öffentliches Profil und deinen Speaker-Eintrag aktuell – Themen und Fachlevel entscheiden, welche Anfragen dich erreichen.",
                       "Beantworte passende Anfragen oder bewirb dich auf offene Aufrufe mit einem kurzen Pitch (max. 600 Zeichen, ohne Kontaktdaten).",
                       "Nimmt die Redaktion an, bekommt sie den Kontakt, den du gewählt hast. Du kannst jederzeit für zwei Wochen pausieren."],
        "how_rules": "Kostenlos für beide Seiten. Nur redaktionelle Anfragen – keine Werbung, kein Linkaufbau, keine Umfragen, kein Vertrieb. Keine Kontaktdaten vor der Annahme.",
    },
}

CSS = """<style>
.ec-tabs{display:flex;flex-wrap:wrap;gap:0;border-bottom:1px solid var(--bd);margin:24px 0 20px}
.ec-group{display:flex;flex:1 1 320px;flex-wrap:wrap;align-content:flex-start;min-width:0}
.ec-group-h{width:100%;padding:10px 16px 4px;color:var(--mut);font-size:.8rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase}
.ec-tabs a{padding:10px 16px;text-decoration:none;color:var(--mut);font:600 .95rem "Barlow Condensed",sans-serif;letter-spacing:.06em;text-transform:uppercase;border-bottom:3px solid transparent;margin-bottom:-1px}
.ec-tabs a[aria-current=page]{color:var(--fg);border-bottom-color:var(--ac)}
.ec-tabs a[hidden]{display:none}
.ec-hero-actions{display:flex;gap:10px;margin-top:18px}
.ec-hero-actions .btn{flex:1 1 0;min-width:0;text-align:center}
.ec-hero-expert{margin:8px 0 0;font-size:.9rem}
.ec-how{margin:28px 0 8px;border-top:2px solid var(--fg);padding-top:14px}
.ec-how h2{margin:0 0 12px}
.ec-how-cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:22px}
.ec-how h3{margin:0 0 8px;font-size:1.05rem}
.ec-how ol{margin:0;padding-inline-start:1.3em;display:grid;gap:8px}
.ec-how li{line-height:1.5}
.ec-how-rules{margin:14px 0 0;color:var(--mut);font-size:.95rem}
@media(max-width:600px){.ec-tabs{display:grid;grid-template-columns:1fr}.ec-group{width:100%}}
.ec-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px}
.ec-card{background:var(--card);border:1px solid var(--bd);padding:16px;display:grid;gap:8px;align-content:start}
.ec-card h3{margin:0;font-size:1.1rem}.ec-card p{margin:0}
.ec-form{display:grid;gap:12px;max-width:760px}
.ec-form label,.ec-lbl{display:grid;gap:5px;font-size:.8rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--mut)}
.ec-form input[type=text],.ec-form input[type=date],.ec-form input[type=email],.ec-form select,.ec-form textarea,.ec-bar input,.ec-bar select,.ec-card textarea,.ec-card input[type=text]{font:inherit;font-size:1rem;letter-spacing:0;text-transform:none;color:var(--fg);background:var(--bg);border:1px solid var(--bd);padding:9px 10px;border-radius:0;width:100%;box-sizing:border-box}
.ec-ck{display:flex!important;gap:8px;align-items:flex-start;text-transform:none!important;letter-spacing:0!important;font-weight:400!important;font-size:.95rem!important;color:var(--fg)!important}
.ec-ck input{margin-top:3px;flex:none}
.ec-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}
.ec-bar{display:flex;flex-wrap:wrap;gap:8px;align-items:end;margin-bottom:16px}.ec-bar input,.ec-bar select,.ec-form select,.ec-form input[type=text],.ec-form input[type=date]{height:42px}.ec-bar>*{flex:1 1 150px}.ec-bar .btn{flex:0 0 auto}
.ec-chips{display:flex;flex-wrap:wrap;gap:6px}.ec-chip{border:1px solid var(--bd);background:var(--bg);padding:2px 8px;font-size:.85rem}
.ec-chip button{border:0;background:none;color:var(--mut);cursor:pointer;padding:0 0 0 6px;font:inherit}
.ec-badge{display:inline-block;border:1px solid var(--bd);padding:0 6px;font:600 .78rem "Barlow Condensed",sans-serif;letter-spacing:.06em;text-transform:uppercase;margin-inline-end:4px}
.ec-badge.ac{border-color:var(--ac);color:var(--ac)}.ec-badge.ok{border-color:#2f6b3a;color:#2f6b3a}.ec-badge.warn{border-color:#9a4f0f;color:#9a4f0f}
.ec-meta{color:var(--mut);font-size:.9rem}
.ec-msg{min-height:1.3em;font-size:.95rem}.ec-msg.ok{color:#2f6b3a}.ec-msg.err{color:#a1361f}
.ec-btns{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.ec-reply{border-top:1px solid var(--bd);padding-top:8px;display:grid;gap:6px}
.ec-sec{margin:26px 0 10px}
.ec-score{font:600 1.4rem/1 "Barlow Condensed",sans-serif;color:var(--ac)}
@media(prefers-color-scheme:dark){.ec-badge.ok,.ec-msg.ok{color:#91d59a;border-color:#91d59a}.ec-badge.warn{color:#ffc078;border-color:#ffc078}}
</style>"""


def _asset(base, name):
    p = ROOT / "assets" / name
    h = hashlib.sha1(p.read_bytes()).hexdigest()[:10] if p.exists() else "0"
    return f"{base}/assets/{name}?v={h}"


def topics(ents):
    """[[id, Name], …] der Themen-Entitaeten (keine Personen, Firmen, Events), alphabetisch."""
    out = [[e["id"], e.get("name") or e["id"]] for e in ents.values() if e.get("type") in TOPIC_TYPES]
    return sorted(out, key=lambda x: x[1].lower())


def how(t, e):
    """Abschnitt "So funktioniert Expert Connect": je Rolle vier Schritte und die Regeln (Mirko, 5.11.2026)."""
    col = lambda h, steps: f'<div><h3>{e(h)}</h3><ol>' + "".join(f"<li>{e(x)}</li>" for x in steps) + "</ol></div>"
    return (f'<section class="ec-how" id="how" aria-labelledby="ec-how-h"><h2 id="ec-how-h">{e(t["how_h"])}</h2><div class="ec-how-cols">'
            + col(t["how_seek_h"], t["how_seek"]) + col(t["how_expert_h"], t["how_expert"])
            + f'</div><p class="ec-how-rules">{e(t["how_rules"])}</p></section>')


def build(g, ents, langs_all):
    """g: write, page, header, footer, BASE, LANGS, api. ents: Entitaeten (site_learn.ENTS). langs_all: Sprachen fuer Anfragen [(code, Name)]."""
    base, api = g["BASE"], g.get("api", "https://api-dub.m365.fm")
    g["write"]("community/expert-connect/topics.json", json.dumps(topics(ents), ensure_ascii=False, separators=(",", ":")))
    alts = {"en": f"{base}/community/expert-connect/", "de": f"{base}/de/community/expert-connect/"}
    for lang in ("en", "de"):
        t, e = T[lang], (lambda s: html.escape(s, quote=True))
        pre = "" if lang == "en" else "/de"
        def tab(k):
            return f'<a href="#{k}" data-tab="{k}"{" hidden" if k == "mod" else ""}>{e(t["tab_" + k])}</a>'
        tabs = (f'<div class="ec-group"><span class="ec-group-h">{e(t["group_seek"])}</span>'
                + "".join(tab(k) for k in ("search", "request", "requests"))
                + f'</div><div class="ec-group"><span class="ec-group-h">{e(t["group_expert"])}</span>'
                + "".join(tab(k) for k in ("calls", "expert")) + f'</div>{tab("mod")}')
        cfg = json.dumps({"api": api, "base": base, "lang": lang, "t": t, "topics": f"{base}/community/expert-connect/topics.json",
                          "langs": langs_all, "formats": ["quote", "interview", "article", "podcast", "talk"]},
                         ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
        body = (f'{g["header"](lang, "")}<main class="wrap">{CSS}<div class="hero"><div class="kicker">{e(t["kicker"])}</div>'
                f'<h1>{e(t["h1"])}</h1><p class="lede">{e(t["lede"])}</p>'
                f'<div class="ec-hero-actions"><a class="btn" href="#search">{e(t["hero_search"])}</a>'
                f'<a class="btn main" href="#request">{e(t["hero_request"])}</a></div>'
                f'<p class="ec-hero-expert"><a href="#calls">{e(t["hero_calls"])}</a></p></div>'
                + how(t, e) +
                f'<nav class="ec-tabs" aria-label="Expert Connect">{tabs}</nav>'
                f'<div id="ec" aria-live="polite"><p class="mut">{e(t["loading"])}</p></div>'
                f'<p class="mut" style="margin-top:32px">{e(t["also"])}: <a href="{base}{pre}/for/publishers/">{e(t["landing"])}</a> · '
                f'<a href="{base}{pre}/media-kit/">{e(t["mediakit"])}</a> · <a href="{base}{"" if lang == "en" else "/" + lang}/community/members/">{e(t["members"])}</a></p>'
                f'</main><script>window.M365EC={cfg}</script><script defer src="{_asset(base, "expert-connect.js")}"></script>{g["footer"](lang)}')
        ld = [{"@context": "https://schema.org", "@type": "WebApplication", "name": "M365.FM Expert Connect", "url": alts[lang], "applicationCategory": "BusinessApplication",
               "inLanguage": lang, "offers": {"@type": "Offer", "price": "0", "priceCurrency": "EUR"}, "description": t["desc"]}]
        g["write"](("" if lang == "en" else "de/") + "community/expert-connect/index.html",
                   g["page"](lang, t["title"], t["desc"], alts[lang], body, alts, ld, xdefault=alts["en"], og_type="website", share=False, noindex=True))
