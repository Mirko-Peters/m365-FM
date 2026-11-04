"""Mehrsprachige Service-Landingpages aus den freigegebenen Canvas-Entwürfen."""
import html
import json
from pathlib import Path

ROOT = Path(__file__).parent
LANGS_ALL = ("en", "de", "es", "fr", "it", "pt", "nl", "pl", "id", "ru", "uk", "ar", "he", "ja", "ko")


def _text(lang, text):
    from site_i18n import T
    return T(lang, text[0], text[1])


def _t(lang, text):
    return html.escape(_text(lang, text), quote=True)


def footer_label(lang):
    return _t(lang, ("Services", "Services"))


def hub_url(base, lang):
    return _url(base, lang, HUB["path"])


def _page(path, h1, lead, cta, cta_url, cards, faq, related=()):
    return dict(path=path, h1=h1, lead=lead, cta=cta, cta_url=cta_url, cards=cards, faq=faq, related=related)


HUB = {
    "path": "services/",
    "h1": ("M365.FM services", "M365.FM Services"),
    "lead": ("One place for everything M365.FM offers. Start with who you are, or what you want to do.",
             "Alle Angebote von M365.FM an einem Ort. Starte mit deiner Zielgruppe oder mit dem, was du erreichen willst."),
    "audiences": [
        (("Sponsors and vendors", "Sponsoren und Anbieter"), ("Reach Microsoft 365 professionals through the podcast and sponsor offer.", "Erreiche Microsoft-365-Fachleute über den Podcast und das Sponsoring-Angebot."), "for/sponsors/"),
        (("Experts", "Experten"), ("A profile and a free contribution portfolio for your community work.", "Profil und kostenloses Beitragsportfolio für dein Community-Engagement."), "for/experts/"),
        (("Podcasters", "Podcaster"), ("Bring your show to M365.FM's own website and find guests by topic.", "Bringe deinen Podcast auf die M365.FM-Website und finde Gäste nach Themen."), "for/podcasters/"),
        (("Publishers", "Redaktionen"), ("Find Microsoft 365 experts or post a free, relevant request.", "Finde Microsoft-365-Experten oder veröffentliche eine kostenlose, passende Anfrage."), "for/publishers/"),
        (("Event organizers", "Veranstalter"), ("Publish an event, invite speakers and connect sessions with profiles.", "Veröffentliche Events, lade Speaker ein und verknüpfe Sessions mit Profilen."), "for/organizers/"),
        (("IT teams and listeners", "IT-Teams und Hörer"), ("Follow Microsoft 365 in your language, with an optional free ad-free membership.", "Verfolge Microsoft 365 in deiner Sprache – auf Wunsch mit kostenloser werbefreier Mitgliedschaft."), "for/it-teams/"),
    ],
    "goals": [
        (("Reach Microsoft 365 buyers", "Microsoft-365-Käufer erreichen"), ("Sponsorship and measurable visibility.", "Sponsoring und messbare Sichtbarkeit."), "i-want-to/reach-microsoft-365-buyers/"),
        (("Prove my community impact", "Mein Community-Engagement belegen"), ("Collect appearances, sessions and other contributions.", "Auftritte, Sessions und weitere Beiträge sammeln."), "i-want-to/prove-my-community-impact/"),
        (("Find an expert", "Einen Experten finden"), ("Free matching for publishers, podcasters and organizers.", "Kostenloses Matching für Redaktionen, Podcaster und Veranstalter."), "i-want-to/find-an-expert/"),
        (("Grow my podcast", "Meinen Podcast weiterentwickeln"), ("Create pages on M365.FM and find relevant guests.", "Seiten auf M365.FM veröffentlichen und passende Gäste finden."), "i-want-to/grow-my-podcast/"),
        (("Run a community event", "Ein Community-Event veranstalten"), ("Manage event pages, speakers and sessions.", "Eventseiten, Speaker und Sessions verwalten."), "i-want-to/run-a-community-event/"),
        (("Stay current on Microsoft 365", "Bei Microsoft 365 auf dem Laufenden bleiben"), ("Listen, look up product updates and learn in your language.", "In deiner Sprache hören, Produktupdates nachschlagen und dazulernen."), "i-want-to/stay-current-on-microsoft-365/"),
    ],
}


PAGES = [
    _page("for/sponsors/", ("For sponsors and vendors", "Für Sponsoren und Anbieter"),
          ("Reach Microsoft 365 professionals through M365.FM's podcast and topic pages. The sponsor configurator explains the available options and current pricing.",
           "Erreiche Microsoft-365-Fachleute über den M365.FM-Podcast und Themenseiten. Der Sponsoring-Konfigurator erklärt die Möglichkeiten und aktuellen Preise."),
          ("View the sponsor offer", "Sponsoring-Angebot ansehen"), "/sponsor/",
          [(("Podcast sponsorship", "Podcast-Sponsoring"), ("Explore placements across the podcast and its language editions in the configurator.", "Prüfe im Konfigurator Platzierungen im Podcast und seinen Sprachfassungen.")),
           (("Topic sponsorship", "Themen-Sponsoring"), ("See whether a topic package fits your goals and budget.", "Prüfe, ob ein Themenpaket zu deinen Zielen und deinem Budget passt.")),
           (("Measure results", "Ergebnisse messen"), ("The offer page uses Spreaker for podcast figures and the available Search Console and Bing Webmaster Tools data for search and AI citations.", "Die Angebotsseite nutzt Spreaker für Podcast-Kennzahlen sowie verfügbare Daten der Search Console und Bing Webmaster Tools für Suche und KI-Zitate."))],
          [(("Where do the figures come from?", "Woher stammen die Kennzahlen?"), ("Podcast figures come from Spreaker. Search and AI-citation figures are shown only when the corresponding source data is available.", "Podcast-Kennzahlen stammen von Spreaker. Such- und KI-Zitate werden nur angezeigt, wenn Daten aus der jeweiligen Quelle vorliegen.")),
           (("Where can I see current pricing?", "Wo finde ich aktuelle Preise?"), ("The sponsor page is the source for current packages and prices.", "Die Sponsoring-Seite ist die Quelle für aktuelle Pakete und Preise."))],
          (("Find an expert", "Einen Experten finden", "i-want-to/find-an-expert/"),)),
    _page("for/experts/", ("For experts", "Für Experten"),
          ("Keep a clear record of your community work. Your M365.FM profile can collect podcast appearances, event sessions, quotes and articles.",
           "Behalte den Überblick über dein Community-Engagement. Dein M365.FM-Profil kann Podcast-Auftritte, Event-Sessions, Zitate und Artikel sammeln."),
          ("Open your profile", "Profil öffnen"), "/community/",
          [(("MVP Contribution Tracker", "MVP Contribution Tracker"), ("Collect contributions by date and type, then review your portfolio for a reporting period. Free.", "Sammle Beiträge nach Datum und Typ und prüfe dein Portfolio für einen Berichtszeitraum. Kostenlos.")),
           (("Expert requests", "Anfragen an Experten"), ("Opt in to relevant media requests. Your contact details are shared only after you accept.", "Erhalte auf Wunsch passende Medienanfragen. Deine Kontaktdaten werden erst nach deiner Zusage geteilt.")),
           (("Verified profile", "Verifiziertes Profil"), ("Claim your profile and manage which information is visible.", "Beanspruche dein Profil und verwalte, welche Informationen sichtbar sind."))],
          [(("Does the tracker guarantee an MVP award?", "Garantiert der Tracker eine MVP-Auszeichnung?"), ("No. It helps collect evidence; Microsoft decides about awards.", "Nein. Er hilft beim Sammeln von Nachweisen; über Auszeichnungen entscheidet Microsoft.")),
           (("Does it cost anything?", "Kostet das etwas?"), ("The profile and MVP Contribution Tracker are free.", "Profil und MVP Contribution Tracker sind kostenlos."))],
          (("Prove my community impact", "Mein Community-Engagement belegen", "i-want-to/prove-my-community-impact/"),)),
    _page("for/podcasters/", ("For podcasters and creators", "Für Podcaster und Creator"),
          ("Bring your Microsoft-focused podcast to M365.FM's own website, connect episodes with topics and guests, and find new guest opportunities.",
           "Bringe deinen Microsoft-Podcast auf die M365.FM-Website, verknüpfe Folgen mit Themen und Gästen und entdecke neue Möglichkeiten für Gäste."),
          ("Ask about a podcast import", "Podcast-Import anfragen"), "/community/",
          [(("Pages on M365.FM", "Seiten auf M365.FM"), ("An import creates pages on M365.FM. Your existing hosting and RSS feed stay where they are; no paid move or hosting transfer is offered.", "Ein Import erstellt Seiten auf M365.FM. Dein bisheriges Hosting und dein RSS-Feed bleiben unverändert; ein kostenpflichtiger Umzug oder Hosting-Transfer wird nicht angeboten.")),
           (("Guest exchange", "Gästebörse"), ("Find guests and hosts through shared topics. Matching is free.", "Finde Gäste und Hosts über gemeinsame Themen. Das Matching ist kostenlos.")),
           (("Advertising funds the pages", "Werbung finanziert die Seiten"), ("The imported pages on M365.FM carry advertising, which helps keep the service free.", "Die importierten Seiten auf M365.FM enthalten Werbung. Sie trägt dazu bei, den Service kostenlos anzubieten."))],
          [(("Do I lose my listeners or hosting?", "Verliere ich Hörer oder mein Hosting?"), ("No. The import creates pages on M365.FM; your podcast hosting and feed remain yours.", "Nein. Der Import erstellt Seiten auf M365.FM; dein Podcast-Hosting und Feed bleiben bei dir.")),
           (("What does the import cost?", "Was kostet der Import?"), ("There is no price for the current import offer. It supports pages on M365.FM only.", "Für das aktuelle Import-Angebot wird kein Preis genannt. Unterstützt werden ausschließlich Seiten auf M365.FM."))],
          (("Grow my podcast", "Meinen Podcast weiterentwickeln", "i-want-to/grow-my-podcast/"),)),
    _page("for/publishers/", ("For journalists, editors and PR", "Für Journalisten, Redaktionen und PR"),
          ("Find Microsoft 365 experts by topic and language, or post a relevant request and let opted-in experts respond. Free for publishers and experts.",
           "Finde Microsoft-365-Experten nach Thema und Sprache oder veröffentliche eine passende Anfrage. Kostenlos für Redaktionen und Experten."),
          ("Find an expert", "Experten finden"), "/community/",
          [(("Search by expertise", "Nach Fachwissen suchen"), ("Review profiles and their public contributions to find a relevant source.", "Prüfe Profile und öffentliche Beiträge, um passende Ansprechpartner zu finden.")),
           (("Post a request", "Anfrage veröffentlichen"), ("Share the topic, format, language and deadline. Only experts who opted in can receive requests.", "Nenne Thema, Format, Sprache und Frist. Anfragen erhalten nur Experten, die zugestimmt haben.")),
           (("Relevant requests only", "Nur passende Anfragen"), ("The publisher offer is free and has a no-spam rule. Spam-like requests can be blocked and repeat abuse can lose access.", "Das Angebot ist kostenlos und hat eine No-Spam-Regel. Spamverdächtige Anfragen können blockiert und wiederholter Missbrauch gesperrt werden."))],
          [(("Does Expert Connect cost anything?", "Kostet Expert Connect etwas?"), ("No. Expert Connect is free for publishers and experts.", "Nein. Expert Connect ist für Redaktionen und Experten kostenlos.")),
           (("Can I contact every expert?", "Kann ich jeden Experten kontaktieren?"), ("Requests go only to opted-in experts; contact details are shared after they accept.", "Anfragen gehen nur an Experten, die zugestimmt haben. Kontaktdaten werden nach ihrer Zusage geteilt."))],
          (("Find an expert", "Einen Experten finden", "i-want-to/find-an-expert/"),)),
    _page("for/organizers/", ("For event organizers", "Für Event-Veranstalter"),
          ("Publish your community event, invite speakers and connect each confirmed session to its speaker profile.",
           "Veröffentliche dein Community-Event, lade Speaker ein und verknüpfe bestätigte Sessions mit den Profilen der Vortragenden."),
          ("Open the community", "Community öffnen"), "/community/",
          [(("Event pages and sessions", "Eventseiten und Sessions"), ("Give your agenda, speakers and topics a place people can find.", "Gib deiner Agenda, den Speakern und Themen einen auffindbaren Platz.")),
           (("Speaker invitations", "Speaker-Einladungen"), ("Invite people by email or LinkedIn; speakers can confirm their sessions through their profile.", "Lade Personen per E-Mail oder LinkedIn ein. Speaker können Sessions über ihr Profil bestätigen.")),
           (("Team and participants", "Team und Teilnehmende"), ("Coordinate event roles and let participants choose whether their profile is public.", "Koordiniere Event-Rollen und lass Teilnehmende selbst entscheiden, ob ihr Profil öffentlich ist."))],
          [(("Can I import an existing event?", "Kann ich ein bestehendes Event importieren?"), ("Ask the M365.FM team about importing an event and its sessions.", "Wende dich wegen des Imports eines Events und seiner Sessions an das M365.FM-Team.")),
           (("How do I get started?", "Wie fange ich an?"), ("Open the community and sign in to see the available event tools.", "Öffne die Community und melde dich an, um die verfügbaren Event-Funktionen zu sehen."))],
          (("Run a community event", "Ein Community-Event veranstalten", "i-want-to/run-a-community-event/"),)),
    _page("for/it-teams/", ("For IT teams and Microsoft 365 listeners", "Für IT-Teams und Microsoft-365-Hörer"),
          ("Help your team keep up with Microsoft 365: listen in your language, look up product updates and get explanations of unfamiliar terms.",
           "Hilf deinem Team, bei Microsoft 365 auf dem Laufenden zu bleiben: in der eigenen Sprache hören, Produktupdates nachschlagen und Begriffe erklärt bekommen."),
          ("Choose a language", "Sprache auswählen"), "/#languages",
          [(("Podcast in your language", "Podcast in deiner Sprache"), ("The M365.FM podcast is available across the site's language editions.", "Der M365.FM-Podcast ist in den Sprachfassungen der Website verfügbar.")),
           (("Product updates and explanations", "Produktupdates und Erklärungen"), ("Browse product pages, the community wiki and explanations linked from articles.", "Nutze Produktseiten, das Community-Wiki und Erklärungen aus Artikeln.")),
           (("Free ad-free membership", "Kostenlose werbefreie Mitgliedschaft"), ("A free account can unlock an ad-free listening and site experience.", "Ein kostenloses Konto kann werbefreies Hören und eine werbefreie Website freischalten."))],
          [(("Where can we listen?", "Wo können wir hören?"), ("Listen on Spreaker, Apple Podcasts, Spotify, YouTube and other podcast apps that support RSS.", "Höre auf Spreaker, Apple Podcasts, Spotify, YouTube und in weiteren Podcast-Apps mit RSS-Unterstützung.")),
           (("Is the ad-free membership free?", "Ist die werbefreie Mitgliedschaft kostenlos?"), ("Yes. The listener membership is free and requires an account.", "Ja. Die Hörermitgliedschaft ist kostenlos und benötigt ein Konto."))],
          (("Stay current on Microsoft 365", "Bei Microsoft 365 auf dem Laufenden bleiben", "i-want-to/stay-current-on-microsoft-365/"),)),
    _page("i-want-to/reach-microsoft-365-buyers/", ("Reach Microsoft 365 buyers", "Microsoft-365-Käufer erreichen"),
          ("Reach the people who listen to Microsoft 365 podcasts, search for answers and use AI assistants. See the sponsor offer and its measurement sources.",
           "Erreiche Menschen, die Microsoft-365-Podcasts hören, nach Antworten suchen und KI-Assistenten nutzen. Sieh dir das Sponsoring-Angebot und seine Messquellen an."),
          ("View sponsorship options", "Sponsoring-Möglichkeiten ansehen"), "/sponsor/",
          [(("Podcast and topic sponsorship", "Podcast- und Themen-Sponsoring"), ("Choose a goal and review current options and prices on the sponsor page.", "Wähle ein Ziel und prüfe aktuelle Möglichkeiten und Preise auf der Sponsoring-Seite.")),
           (("Search and AI citations", "Such- und KI-Zitate"), ("Search Console and Bing Webmaster Tools figures are shown only when source data is available and are refreshed through the existing monthly process.", "Zahlen aus Search Console und Bing Webmaster Tools erscheinen nur, wenn Quelldaten verfügbar sind, und werden über den bestehenden monatlichen Ablauf aktualisiert.")),
           (("Podcast figures", "Podcast-Kennzahlen"), ("Spreaker is the source for podcast figures and downloads. The latest available period is shown below.", "Spreaker ist die Quelle für Podcast-Kennzahlen und Downloads. Der zuletzt verfügbare Zeitraum steht unten."))],
          [(("Where can I see prices?", "Wo sehe ich die Preise?"), ("The sponsor page contains the current packages and prices.", "Die Sponsoring-Seite enthält die aktuellen Pakete und Preise.")),
           (("Are all search metrics always available?", "Sind alle Suchkennzahlen immer verfügbar?"), ("No. The page labels metrics by source and does not invent a value when a source has no data.", "Nein. Die Seite kennzeichnet Kennzahlen nach Quelle und erfindet keine Werte, wenn Quelldaten fehlen."))],
          (("For sponsors", "Für Sponsoren", "for/sponsors/"),)),
    _page("i-want-to/prove-my-community-impact/", ("Prove my community impact", "Mein Community-Engagement belegen"),
          ("Build a useful record as you contribute, instead of searching through calendars when a reporting deadline arrives.",
           "Baue während deines Engagements einen aussagekräftigen Nachweis auf, statt zum Stichtag Kalender zu durchsuchen."),
          ("Open your profile", "Profil öffnen"), "/community/",
          [(("MVP Contribution Tracker", "MVP Contribution Tracker"), ("Review podcast appearances, event sessions, quotes, mentions and articles in one portfolio. Free.", "Prüfe Podcast-Auftritte, Event-Sessions, Zitate, Erwähnungen und Artikel in einem Portfolio. Kostenlos.")),
           (("Export by period", "Nach Zeitraum exportieren"), ("Collect contributions and prepare a report for the period you need.", "Sammle Beiträge und bereite einen Bericht für den gewünschten Zeitraum vor.")),
           (("Your work, your profile", "Deine Arbeit, dein Profil"), ("Claim your profile to manage its public information and contributions.", "Beanspruche dein Profil, um öffentliche Informationen und Beiträge zu verwalten."))],
          [(("Does a score guarantee an award?", "Garantiert eine Punktzahl eine Auszeichnung?"), ("No. The tracker organizes evidence; Microsoft decides about MVP awards.", "Nein. Der Tracker ordnet Nachweise. Über MVP-Auszeichnungen entscheidet Microsoft.")),
           (("Is the tracker free?", "Ist der Tracker kostenlos?"), ("Yes. The MVP Contribution Tracker is free.", "Ja. Der MVP Contribution Tracker ist kostenlos."))],
          (("For experts", "Für Experten", "for/experts/"),)),
    _page("i-want-to/find-an-expert/", ("Find an expert or a podcast guest", "Einen Experten oder Podcast-Gast finden"),
          ("For an article, interview, podcast or event. Find people through shared topics and languages; matching is free.",
           "Für Artikel, Interviews, Podcasts oder Events. Finde Menschen über gemeinsame Themen und Sprachen; das Matching ist kostenlos."),
          ("Open the community", "Community öffnen"), "/community/",
          [(("Expert Connect", "Expert Connect"), ("Publishers can search or post a request for an opted-in expert. Free for both sides, with a no-spam rule.", "Redaktionen können suchen oder eine Anfrage an Experten veröffentlichen, die zugestimmt haben. Kostenlos für beide Seiten, mit No-Spam-Regel.")),
           (("Guest exchange", "Gästebörse"), ("Podcasters and prospective guests can find each other through shared topics. Free.", "Podcaster und potenzielle Gäste finden einander über gemeinsame Themen. Kostenlos.")),
           (("Event speakers", "Speaker für Events"), ("Organizers can invite speakers and connect confirmed sessions to profiles.", "Veranstalter können Speaker einladen und bestätigte Sessions mit Profilen verknüpfen."))],
          [(("Do I need an account?", "Brauche ich ein Konto?"), ("Sign in to contact people or manage a request.", "Melde dich an, um Personen zu kontaktieren oder eine Anfrage zu verwalten.")),
           (("When are contact details shared?", "Wann werden Kontaktdaten geteilt?"), ("Only after an expert accepts a request.", "Erst nachdem ein Experte eine Anfrage angenommen hat."))],
          (("For publishers", "Für Redaktionen", "for/publishers/"),)),
    _page("i-want-to/grow-my-podcast/", ("Grow my podcast", "Meinen Podcast weiterentwickeln"),
          ("Create discoverable pages for your show on M365.FM, connect episodes with topics and guests, and explore the free guest exchange.",
           "Veröffentliche auffindbare Seiten für deinen Podcast auf M365.FM, verknüpfe Folgen mit Themen und Gästen und nutze die kostenlose Gästebörse."),
          ("Ask about a podcast import", "Podcast-Import anfragen"), "/community/",
          [(("Import your RSS feed", "RSS-Feed importieren"), ("The current offer creates pages on M365.FM only. Your host and feed stay where they are; pages are funded by advertising.", "Das aktuelle Angebot erstellt ausschließlich Seiten auf M365.FM. Hosting und Feed bleiben unverändert; Werbung finanziert die Seiten.")),
           (("Find relevant guests", "Passende Gäste finden"), ("Match with experts and other podcasters through shared topics. Free.", "Finde über gemeinsame Themen Experten und andere Podcaster. Kostenlos.")),
           (("Keep control", "Die Kontrolle behalten"), ("Your existing podcast feed and hosting remain yours; this is not a hosting migration.", "Dein bestehender Podcast-Feed und dein Hosting bleiben bei dir; es handelt sich nicht um einen Hosting-Umzug."))],
          [(("Do I lose my subscribers?", "Verliere ich meine Abonnenten?"), ("No. Your existing feed and hosting remain unchanged.", "Nein. Dein bestehender Feed und dein Hosting bleiben unverändert.")),
           (("What does the move cost?", "Was kostet der Umzug?"), ("No price is stated for the current offer, which supports your own pages on M365.FM only.", "Für das aktuelle Angebot wird kein Preis genannt. Es unterstützt ausschließlich eigene Seiten auf M365.FM."))],
          (("For podcasters", "Für Podcaster", "for/podcasters/"),)),
    _page("i-want-to/run-a-community-event/", ("Run a community event", "Ein Community-Event veranstalten"),
          ("Build an event page, invite speakers and link sessions with the people who present them.",
           "Erstelle eine Eventseite, lade Speaker ein und verknüpfe Sessions mit den Personen, die sie halten."),
          ("Open the community", "Community öffnen"), "/community/",
          [(("Create an event page", "Eventseite erstellen"), ("Publish event details, topics and sessions in one place.", "Veröffentliche Event-Details, Themen und Sessions an einem Ort.")),
           (("Invite and confirm speakers", "Speaker einladen und bestätigen"), ("Send invitations and let speakers confirm sessions through their profiles.", "Versende Einladungen und lass Speaker Sessions über ihre Profile bestätigen.")),
           (("Coordinate participants", "Teilnehmende koordinieren"), ("Manage event roles and participant visibility in the existing community tools.", "Verwalte Event-Rollen und die Sichtbarkeit von Teilnehmenden mit den vorhandenen Community-Funktionen."))],
          [(("Can I import an existing event?", "Kann ich ein bestehendes Event importieren?"), ("Ask the M365.FM team about importing your agenda and sessions.", "Wende dich wegen des Imports deiner Agenda und Sessions an das M365.FM-Team.")),
           (("Where do I manage an event?", "Wo verwalte ich ein Event?"), ("Sign in to the community to see the event tools available to your account.", "Melde dich in der Community an, um die für dein Konto verfügbaren Event-Funktionen zu sehen."))],
          (("For event organizers", "Für Event-Veranstalter", "for/organizers/"),)),
    _page("i-want-to/stay-current-on-microsoft-365/", ("Stay current on Microsoft 365", "Bei Microsoft 365 auf dem Laufenden bleiben"),
          ("Follow product changes without reading every update: listen to the podcast, look up product pages and learn in your language.",
           "Verfolge Produktänderungen, ohne jedes Update lesen zu müssen: höre den Podcast, schlage Produktseiten nach und lerne in deiner Sprache."),
          ("Listen to the podcast", "Podcast anhören"), "/show/",
          [(("Listen", "Hören"), ("Daily podcast episodes and language editions help you follow Microsoft 365.", "Tägliche Podcast-Folgen und Sprachfassungen helfen dir, Microsoft 365 zu verfolgen.")),
           (("Look up", "Nachschlagen"), ("Product pages, the community wiki and linked explanations add context to new terms.", "Produktseiten, das Community-Wiki und verknüpfte Erklärungen ordnen neue Begriffe ein.")),
           (("Choose an ad-free experience", "Werbefreies Angebot wählen"), ("The ad-free listener membership is free with an account.", "Die werbefreie Hörermitgliedschaft ist mit einem Konto kostenlos."))],
          [(("Is the ad-free membership free?", "Ist die werbefreie Mitgliedschaft kostenlos?"), ("Yes. The listener membership is free and requires an account.", "Ja. Die Hörermitgliedschaft ist kostenlos und benötigt ein Konto.")),
           (("Can I listen in my language?", "Kann ich in meiner Sprache hören?"), ("Use the language selector to find the available M365.FM edition.", "Nutze die Sprachauswahl, um die verfügbare M365.FM-Ausgabe zu finden."))],
          (("For IT teams and listeners", "Für IT-Teams und Hörer", "for/it-teams/"),)),
]


def _url(base, lang, path):
    return f"{base}/{lang + '/' if lang != 'en' else ''}{path}"


def _card(base, lang, title, desc, path):
    return (f'<div><h3><a href="{html.escape(_url(base, lang, path), quote=True)}">{_t(lang, title)}</a></h3>'
            f'<p>{_t(lang, desc)}</p></div>')


def _stats(g, lang):
    from site_sponsor import load_stats
    stats = g.get("stats")
    if stats is None:
        stats = load_stats()
    rows = []
    downloads = g.get("spreaker_downloads")
    download_available = isinstance(downloads, (int, float)) and not isinstance(downloads, bool)
    if downloads is None:
        top = ROOT / "data" / "top.json"
        try:
            data = json.loads(top.read_text("utf-8"))
            sp = data.get("spreaker") or {}
            values = sp.get("downloads") or {}
            download_available = any(isinstance(values.get(l), (int, float)) and not isinstance(values.get(l), bool) for l in LANGS_ALL)
            downloads = sum(values[l] for l in LANGS_ALL if isinstance(values.get(l), (int, float)) and not isinstance(values.get(l), bool))
            period = f'{sp.get("from", "")}–{sp.get("to", "")}'.strip("–")
        except (OSError, ValueError, TypeError):
            downloads, period = None, ""
    else:
        period = g.get("spreaker_period", "")
    if download_available and downloads >= 0:
        rows.append(f'<div><b>{downloads:,}</b><span>{_t(lang, ("Spreaker downloads", "Spreaker-Downloads"))}</span>'
                    f'<small>{_t(lang, ("Site language editions · ", "Sprachfassungen der Website · "))}{html.escape(period, quote=True)}</small></div>')
    episodes = g.get("n_main")
    if isinstance(episodes, int) and episodes > 0:
        rows.append(f'<div><b>{episodes:,}</b><span>{_t(lang, ("Published episodes", "Veröffentlichte Folgen"))}</span>'
                    f'<small>{_t(lang, ("Source: Spreaker", "Quelle: Spreaker"))}</small></div>')
    languages = g.get("n_langs")
    if isinstance(languages, int) and languages > 0:
        rows.append(f'<div><b>{languages}</b><span>{_t(lang, ("Dubbed language editions", "Dub-Ausgaben"))}</span></div>')
    bing = stats.get("bing") or {}
    if bing.get("ok"):
        rows.append(f'<div><b>{bing["citations"]:,}</b><span>{_t(lang, ("AI citations", "KI-Zitate"))}</span>'
                    f'<small>{_t(lang, ("Source: Bing Webmaster Tools", "Quelle: Bing Webmaster Tools"))} · {html.escape((bing.get("period") or {}).get("from", ""), quote=True)} – {html.escape((bing.get("period") or {}).get("to", ""), quote=True)}</small></div>')
    gsc = stats.get("gsc") or {}
    if gsc.get("ok"):
        rows.append(f'<div><b>{gsc["clicks"]:,}</b><span>{_t(lang, ("Google Search clicks", "Google-Suchklicks"))}</span>'
                    f'<small>{_t(lang, ("Source: Google Search Console", "Quelle: Google Search Console"))}</small></div>')
    return f'<div class="stats" aria-label="{_t(lang, ("Figures and sources", "Kennzahlen und Quellen"))}">{"".join(rows)}</div>' if rows else ""


def build(g):
    """Schreibt Hub und Zielseiten in allen 15 Sprachpfaden und meldet sie für hreflang und Sitemap an."""
    base, today = g["BASE"], g["TODAY"]
    langs = ["en"] + [lang for lang in LANGS_ALL[1:] if lang in g["LANGS"]]
    alts_for = lambda path: {lang: _url(base, lang, path) for lang in langs}
    for lang in langs:
        prefix = "" if lang == "en" else f"{lang}/"
        alt_hub = alts_for(HUB["path"])
        hub_url = alt_hub[lang]
        h1_text = _text(lang, HUB["h1"])
        lead_text = _text(lang, HUB["lead"])
        h1 = html.escape(h1_text, quote=True)
        lead = html.escape(lead_text, quote=True)
        audiences = "".join(_card(base, lang, title, desc, path) for title, desc, path in HUB["audiences"])
        goals = "".join(_card(base, lang, title, desc, path) for title, desc, path in HUB["goals"])
        matrix = [
            (("Ad-free listener membership", "Werbefreie Hörermitgliedschaft"), ("Free", "Kostenlos")),
            (("MVP Contribution Tracker", "MVP Contribution Tracker"), ("Free", "Kostenlos")),
            (("Publisher and expert matching", "Matching für Redaktionen und Experten"), ("Free · no spam", "Kostenlos · kein Spam")),
            (("Podcast pages on M365.FM", "Podcastseiten auf M365.FM"), ("No price stated · advertising-funded", "Ohne Preisangabe · werbefinanziert")),
            (("Event tools", "Event-Funktionen"), ("Ask about availability", "Verfügbarkeit anfragen")),
            (("Sponsor offer", "Sponsoring-Angebot"), ("See current offer", "Aktuelles Angebot ansehen")),
        ]
        table = "".join(f'<div><h3>{_t(lang, name)}</h3><p>{_t(lang, price)}</p></div>' for name, price in matrix)
        body = (f'{g["header"](lang, "")}<main class="wrap" id="main"><div class="hero"><div class="kicker">{_t(lang, ("M365.FM · Services", "M365.FM · Services"))}</div>'
                f'<h1>{h1}</h1><p class="lede">{lead}</p><div class="btns"><a class="btn main" href="{html.escape(_url(base, lang, "for/experts/"), quote=True)}">{_t(lang, ("Explore services", "Angebote entdecken"))}</a></div></div>'
                f'<section class="sec"><h2 class="kicker">{_t(lang, ("I am …", "Ich bin …"))}</h2><div class="cols">{audiences}</div></section>'
                f'<section class="sec"><h2 class="kicker">{_t(lang, ("I want to …", "Ich möchte …"))}</h2><div class="cols">{goals}</div></section>'
                f'<section class="sec"><h2>{_t(lang, ("Services at a glance", "Angebote im Überblick"))}</h2><div class="cols">{table}</div></section>'
                f'{_stats(g, lang)}</main>{g["footer"](lang)}')
        ld = [{"@context": "https://schema.org", "@type": "WebPage", "@id": hub_url + "#page", "url": hub_url,
               "name": h1_text, "description": lead_text, "inLanguage": lang, "dateModified": today,
               "isPartOf": {"@id": f"{base}/#website"}}]
        g["write"](prefix + HUB["path"] + "index.html", g["page"](lang, h1_text + " – M365.FM", lead_text, hub_url, body,
                  alt_hub, ld, xdefault=alt_hub["en"], og_type="website", share=False))
        g["sitemap"].append((hub_url, today, alt_hub))

        for spec in PAGES:
            url = alts_for(spec["path"])[lang]
            alt = alts_for(spec["path"])
            title_text = _text(lang, spec["h1"])
            lead_text = _text(lang, spec["lead"])
            title = html.escape(title_text, quote=True)
            lead = html.escape(lead_text, quote=True)
            cards = "".join(f'<div><h3>{_t(lang, title_)}</h3><p>{_t(lang, desc)}</p></div>' for title_, desc in spec["cards"])
            faq = "".join(f'<details><summary>{_t(lang, q)}</summary><p>{_t(lang, a)}</p></details>' for q, a in spec["faq"])
            related = "".join(f'<a class="btn" href="{html.escape(_url(base, lang, path), quote=True)}">{_t(lang, (label, de_label))}</a>'
                              for label, de_label, path in spec["related"])
            cta = _t(lang, spec["cta"])
            cta_path = spec["cta_url"].lstrip("/")
            if cta_path == "show/" and lang != "en":
                cta_path = "podcast/"
            cta_url = html.escape(_url(base, lang, cta_path), quote=True) if spec["cta_url"].startswith("/") else html.escape(spec["cta_url"], quote=True)
            all_services = html.escape(_url(base, lang, HUB["path"]), quote=True)
            body = (f'{g["header"](lang, "")}<main class="wrap" id="main"><nav class="crumbs" aria-label="{_t(lang, ("Breadcrumb", "Brotkrumennavigation"))}"><a href="{html.escape(hub_url, quote=True)}">{_t(lang, ("Services", "Services"))}</a></nav>'
                    f'<div class="hero"><div class="kicker">{_t(lang, ("M365.FM · Services", "M365.FM · Services"))}</div><h1>{title}</h1><p class="lede">{lead}</p>'
                    f'<div class="btns"><a class="btn main" href="{cta_url}">{cta}</a><a class="btn" href="{all_services}">{_t(lang, ("All services", "Alle Angebote"))}</a></div></div>'
                    f'<section class="sec"><h2>{_t(lang, ("What you get", "Deine Möglichkeiten"))}</h2><div class="cols">{cards}</div></section>'
                    f'{"<section class=\"sec\"><h2>" + _t(lang, ("Figures and sources", "Kennzahlen und Quellen")) + "</h2>" + _stats(g, lang) + "</section>" if spec["path"] == "i-want-to/reach-microsoft-365-buyers/" else ""}'
                    f'<section class="sec faq"><h2>{_t(lang, ("Questions and answers", "Häufige Fragen"))}</h2>{faq}</section>'
                    f'{"<section class=\"sec\"><h2>" + _t(lang, ("Also useful", "Auch hilfreich")) + "</h2><div class=\"btns\">" + related + "</div></section>" if related else ""}</main>'
                    f'<section class="band"><div class="wrap"><h2>{cta}</h2><div class="btns"><a class="btn main" href="{cta_url}">{cta}</a></div></div></section>{g["footer"](lang)}')
            ld = [{"@context": "https://schema.org", "@type": "WebPage", "@id": url + "#page", "url": url,
                   "name": title_text, "description": lead_text, "inLanguage": lang, "dateModified": today,
                   "isPartOf": {"@id": f"{base}/#website"}},
                  {"@context": "https://schema.org", "@type": "FAQPage", "@id": url + "#faq", "inLanguage": lang,
                   "mainEntity": [{"@type": "Question", "name": _text(lang, q), "acceptedAnswer": {"@type": "Answer", "text": _text(lang, a)}} for q, a in spec["faq"]]}]
            g["write"](prefix + spec["path"] + "index.html",
                       g["page"](lang, title_text + " – M365.FM", lead_text, url, body, alt, ld,
                                 xdefault=alt["en"], og_type="website", share=False))
            g["sitemap"].append((url, today, alt))
