"""Die eine Sidebar aller Inhaltsseiten (Folgen, Entitaeten, Blogbeitraege, Videos, Bibliothek, Events, Profile) in allen 15 Sprachen (Mirko, 6.11.2026:
"immer die gleiche"): M365Con-Karte, Google-Quelle, Themen & Personen der Seite (Wissensgraph), Aehnliche Folgen (nur Inhaltsseiten, fest je Inhalt: site_related.py),
Hoeren & folgen, Community. Die Karte "Neueste Folgen" gibt es seit 25.11.2026 nicht mehr (Mirko: aenderte bei jeder neuen Folge fast alle Seiten);
L10N "latest" bleibt ungenutzt stehen. Die fruehere Karte "M365.FM Show" (Show-Menue) gibt es nicht mehr; ihre Ziele stehen auf /show/ (site_podpage.py)."""
import json, re
from html import escape as esc
from pathlib import Path
D = Path(__file__).parent / "data"
TYPE_L = {"product": "Product", "concept": "Concept", "cert": "Certification", "platform": "Platform", "org": "Organization", "event": "Event", "person": "Person", "media": "Media", "category": "Topic", "industry": "Industry", "job": "Job / role"}
TYPE_DE = {"product": "Produkt", "concept": "Konzept", "cert": "Zertifizierung", "platform": "Plattform", "org": "Organisation", "event": "Veranstaltung", "person": "Person", "media": "Medium", "category": "Thema", "industry": "Branche", "job": "Job / Rolle"}


def type_label(lang, t):
    """title der Chips in der Sprache der Seite (Audit A11Y-6: vorher englisch auf allen Sprachseiten); andere Sprachen ueber site_i18n.T."""
    from site_i18n import T
    return T(lang, TYPE_L[t], TYPE_DE[t]) if t in TYPE_L else ""


STOP = {"access", "project", "compliance", "governance", "automation", "prompt", "actions", "polling", "agent", "agents", "lists", "forms", "flow", "loop", "word", "bing", "stream", "sites", "pages", "tasks", "security", "identity", "copilot", "microsoft", "azure", "m365", "teams"}
TYPE_PRIO = {"product": 0, "person": 1, "cert": 2, "platform": 3, "concept": 4, "event": 5, "org": 6, "media": 7, "category": 9, "industry": 8, "job": 8}
GSRC = "https://www.google.com/preferences/source?q=m365.fm"
CON = "https://m365con.net/?utm_source=m365.fm&utm_medium=sidebar&utm_campaign=attending2027"
# Bild der M365Con-Karte: verkleinerte Fassungen im R2-Bucket (tools/sidebar_con_img.py -> design/sidebar/, data/r2_local.json, Workflow r2-images.yml).
# Auf dem Desktop ist es oft das LCP-Element (Lighthouse /entity/copilot/, 17.11.2026: 675 px / 68,5 KB fuer ~310 CSS-px, loading=lazy).
CON_WIDTHS = (340, 480, 675)   # 1x, 1,25-1,5x und 2x der Desktop-Breite (19,4rem); 675 = Breite der Quelle, nicht hochskaliert
CON_WH = (675, 563)   # Seitenverhaeltnis fuer width/height (Platz reserviert, keine Verschiebung)
CON_DESK = "(min-width: 62.01rem)"   # ab hier steht die Seitenleiste rechts neben dem Inhalt (assets/sbar.css: max-width:62rem = darunter)
# Desktop: Spalte 20.5rem minus 2 x .55rem Innenabstand der Karte; darunter 3 Spalten ab 52.75rem (30vw), 2 Spalten (50vw) (minmax(16rem,1fr)) bzw. eine Spalte (100vw - 2 x 22px .wrap - 1.1rem)
CON_SIZES = CON_DESK + " 19.4rem, (min-width: 52.75rem) 30vw, (min-width: 36rem) 50vw, calc(100vw - 62px)"
CON_ALT = "I'm attending M365Con International 2027, January 11–22, 2027, free online event"


# Mirko 24.11.2026: "Statt Grafik in der Sidebar lieber einen Text-Banner". Echte Besucher (Cloudflare Web Analytics, LCP-Element) sahen auf dem
# Desktop meist das Kartenbild als LCP (3,2-22 s) statt des Inhalts. Der Text-Banner kommt ohne Bild, ohne Preload und ohne fremden Host aus;
# Texte wie das Haus-Banner (site_ads.CON_TXT, 15 Sprachen). False = wieder das Bild (con_img/con_preload bleiben dafuer erhalten).
CON_TEXT = True


def con_text(lang):
    """M365Con-Karte als reiner Text (Titel + Termin/Sessions), Link wie das Bild vorher."""
    import site_ads as ADS
    t1, t2 = ADS.CON_TXT.get(lang) or ADS.CON_TXT["en"]
    return (f'<a class="sb-cont" href="{CON}" rel="noopener"><b>{esc(t1)}</b><span>{esc(t2)}</span></a>')


# Mirko 24.11.2026: auch die Google-Karte als Text-Banner statt Bild (assets/gsource.webp, 647x192, bleibt als Datei erhalten).
GADD = {
    "en": "Add M365.FM as a preferred source on Google", "de": "M365.FM als bevorzugte Quelle bei Google hinzufügen",
    "es": "Añade M365.FM como fuente preferida en Google", "fr": "Ajoutez M365.FM comme source préférée sur Google",
    "it": "Aggiungi M365.FM come fonte preferita su Google", "pt": "Adicione a M365.FM como fonte preferida no Google",
    "nl": "Voeg M365.FM toe als voorkeursbron in Google", "pl": "Dodaj M365.FM jako preferowane źródło w Google",
    "id": "Tambahkan M365.FM sebagai sumber pilihan di Google", "ru": "Добавьте M365.FM в предпочитаемые источники Google",
    "uk": "Додайте M365.FM до бажаних джерел у Google", "ar": "أضف M365.FM كمصدر مفضّل في Google",
    "he": "הוסיפו את M365.FM כמקור מועדף ב-Google", "ja": "M365.FM を Google の優先ソースに追加",
    "ko": "M365.FM을 Google 선호 소스로 추가",
}


def google_text(lang):
    """Google-Karte als Text: Knopf-Link mit farbigem G und dem Satz in der Sprache der Seite."""
    return (f'<a class="gb gbt" href="{GSRC}" rel="noopener" target="_blank"><span class="gg" aria-hidden="true">G</span>'
            f'<span>{esc(GADD.get(lang) or GADD["en"])}</span></a>')


def con_file(w, ext):
    return f"design/sidebar/attending-m365con-{w}.{ext}"


def con_sources():
    """(avif-srcset oder "", webp-srcset, webp-URL der groessten Fassung) aus img.m365.fm, oder None, solange r2-images.yml die WebP-Fassungen
    nicht hochgeladen hat (dann bleibt das bisherige Bild /assets/attending-m365con.webp). AVIF nur, wenn alle Breiten hochgeladen sind
    (tools/sidebar_con_img.py legt sie nur an, wenn sie kleiner als WebP sind)."""
    import site_r2 as R2
    webp = [(R2.local(con_file(w, "webp")), w) for w in CON_WIDTHS]
    if not all(u for u, _ in webp):
        return None
    avif = [(R2.local(con_file(w, "avif")), w) for w in CON_WIDTHS]
    ss = lambda xs: ", ".join(f"{u} {w}w" for u, w in xs)
    return (ss(avif) if all(u for u, _ in avif) else ""), ss(webp), webp[-1][0]


def con_img(BASE):
    """Bild der M365Con-Karte. Mit R2-Fassungen: <picture> (AVIF, sonst WebP) mit srcset/sizes, ohne loading=lazy. fetchpriority=low am <img>:
    auf dem Handy steht die Seitenleiste unter dem Inhalt (sonst hebt Chrome es als eines der ersten Bilder auf "Medium"); auf dem Desktop holt
    con_preload im Kopf dieselbe Datei mit hoher Prioritaet, das <img> nimmt sie aus dem Preload (eine Anfrage, im Browsertest geprueft).
    Ohne R2-Fassungen: das bisherige Bild unveraendert (lazy, kein Preload)."""
    src = con_sources()
    w, h = CON_WH
    if not src:
        return f'<img src="{BASE}/assets/attending-m365con.webp" alt="{CON_ALT}" width="{w}" height="{h}" loading="lazy">'
    avif, webp, big = src
    a = f'<source type="image/avif" srcset="{esc(avif)}" sizes="{CON_SIZES}">' if avif else ""
    return f'<picture class="sb-conp">{a}<img src="{esc(big)}" srcset="{esc(webp)}" sizes="{CON_SIZES}" alt="{CON_ALT}" width="{w}" height="{h}" fetchpriority="low"></picture>'


def con_preload(body):
    """Desktop-Preload des Kartenbilds fuer den <head>, nur wenn die Seite die Karte mit den R2-Fassungen enthaelt (faellt mit der Karte weg).
    media: nur Desktop, dort ist das Bild das LCP-Element; dieselben srcset/sizes wie im <picture>, damit der Browser dieselbe Datei waehlt.
    Mit AVIF: type=image/avif (Browser ohne AVIF ueberspringen den Preload und laden das WebP wie bisher ueber das <img>)."""
    if CON_TEXT or '<picture class="sb-conp">' not in body:   # Text-Banner: kein Bild, kein Preload
        return ""
    src = con_sources()
    if not src:
        return ""
    avif, webp, _ = src
    t = ' type="image/avif"' if avif else ""
    return (f'<link rel="preload" as="image"{t} imagesrcset="{esc(avif or webp)}" imagesizes="{CON_SIZES}" media="{CON_DESK}" fetchpriority="high">')


class Index:
    """Themen-Chips der Seitenleiste ueber den gemeinsamen Namensindex (site_entmatch): Eigennamen mit Beachtung der Schreibung, Allerweltswoerter
    ("surface", "react", "Teams" am Satzanfang) nur in Eigennamen-Stellung und mit Kontext der Seite (Audit Linktexte E2)."""
    def __init__(self, ents=None):
        import site_entmatch as EM
        self.m = EM.shared(ents)
        self.all = dict(self.m.ents)   # auch Kategorien: fuer feste Themenlisten (Entitaetsseite, Blogbeitrag)
        self.by = {i: e for i, e in self.m.live.items() if e.get("type") not in ("category",) and i != "mirko-peters"}
        self.names = self.m.names   # Fingerabdruck des Index (site_topics._fp)

    def ids(self, text, lang="en", ctx=()):
        """{id: Nennungen} (ohne Kategorien und Host) in der Reihenfolge der ersten Nennung."""
        return {i: n for i, n in self.m.ids(text, lang, ctx, generic=False).items() if i in self.by}

    def match(self, text, k=8, lang="en", ctx=()):
        cnt = self.ids(text, lang, ctx)
        ids = sorted(cnt, key=lambda i: (self.by[i]["name"].lower() in STOP, -min(cnt[i], 3), TYPE_PRIO.get(self.by[i]["type"], 8), -cnt[i]))
        return [self.by[i] for i in ids[:k]]


# ---- Texte je Sprache ----
L10N = {
    "en": dict(listen="Listen & follow", platforms="All platforms", topics="Topics & people on this page", kg="Explore the knowledge graph →", related="Similar episodes", latest="Latest episodes", all="All episodes →", join="Join the community", joint="Free profile, expert directory, events and your own page in the knowledge graph.", create="Create your profile →", seat="Save your free seat →", google="See <b>M365.FM</b> first in Google&nbsp;Top&nbsp;Stories."),
    "de": dict(listen="Hören & folgen", platforms="Alle Plattformen", topics="Themen & Personen auf dieser Seite", kg="Wissensgraph entdecken →", related="Ähnliche Folgen", latest="Neueste Folgen", all="Alle Folgen →", join="Werde Teil der Community", joint="Kostenloses Profil, Expertenverzeichnis, Events und deine eigene Seite im Wissensgraphen.", create="Profil anlegen →", seat="Sichere dir deinen kostenlosen Platz →", google="Sieh <b>M365.FM</b> zuerst in Google&nbsp;Top&nbsp;Stories."),
    "es": dict(listen="Escucha y sigue", platforms="Todas las plataformas", topics="Temas y personas de esta página", kg="Explora el grafo de conocimiento →", related="Episodios similares", latest="Últimos episodios", all="Todos los episodios →", join="Únete a la comunidad", joint="Perfil gratuito, directorio de expertos, eventos y tu propia página en el grafo de conocimiento.", create="Crea tu perfil →", seat="Reserva tu plaza gratis →", google="Ve <b>M365.FM</b> primero en Google&nbsp;Top&nbsp;Stories."),
    "fr": dict(listen="Écouter et suivre", platforms="Toutes les plateformes", topics="Sujets et personnes de cette page", kg="Explorer le graphe de connaissances →", related="Épisodes similaires", latest="Derniers épisodes", all="Tous les épisodes →", join="Rejoignez la communauté", joint="Profil gratuit, annuaire d'experts, événements et votre propre page dans le graphe de connaissances.", create="Créer votre profil →", seat="Réservez votre place gratuite →", google="Voyez <b>M365.FM</b> en premier dans Google&nbsp;Top&nbsp;Stories."),
    "it": dict(listen="Ascolta e segui", platforms="Tutte le piattaforme", topics="Argomenti e persone di questa pagina", kg="Esplora il grafo della conoscenza →", related="Episodi simili", latest="Ultimi episodi", all="Tutti gli episodi →", join="Unisciti alla community", joint="Profilo gratuito, elenco di esperti, eventi e la tua pagina nel grafo della conoscenza.", create="Crea il tuo profilo →", seat="Riserva il tuo posto gratuito →", google="Vedi <b>M365.FM</b> per primo in Google&nbsp;Top&nbsp;Stories."),
    "pt": dict(listen="Ouça e siga", platforms="Todas as plataformas", topics="Tópicos e pessoas desta página", kg="Explore o grafo de conhecimento →", related="Episódios semelhantes", latest="Últimos episódios", all="Todos os episódios →", join="Junte-se à comunidade", joint="Perfil gratuito, diretório de especialistas, eventos e a sua própria página no grafo de conhecimento.", create="Crie o seu perfil →", seat="Reserve a sua vaga gratuita →", google="Veja a <b>M365.FM</b> primeiro no Google&nbsp;Top&nbsp;Stories."),
    "nl": dict(listen="Luisteren en volgen", platforms="Alle platforms", topics="Onderwerpen en personen op deze pagina", kg="Verken de kennisgraaf →", related="Vergelijkbare afleveringen", latest="Nieuwste afleveringen", all="Alle afleveringen →", join="Word lid van de community", joint="Gratis profiel, expertgids, evenementen en je eigen pagina in de kennisgraaf.", create="Maak je profiel →", seat="Reserveer je gratis plek →", google="Zie <b>M365.FM</b> als eerste in Google&nbsp;Top&nbsp;Stories."),
    "pl": dict(listen="Słuchaj i obserwuj", platforms="Wszystkie platformy", topics="Tematy i osoby na tej stronie", kg="Poznaj graf wiedzy →", related="Podobne odcinki", latest="Najnowsze odcinki", all="Wszystkie odcinki →", join="Dołącz do społeczności", joint="Bezpłatny profil, katalog ekspertów, wydarzenia i własna strona w grafie wiedzy.", create="Utwórz profil →", seat="Zarezerwuj bezpłatne miejsce →", google="Zobacz <b>M365.FM</b> jako pierwsze w Google&nbsp;Top&nbsp;Stories."),
    "id": dict(listen="Dengarkan & ikuti", platforms="Semua platform", topics="Topik dan tokoh di halaman ini", kg="Jelajahi grafik pengetahuan →", related="Episode serupa", latest="Episode terbaru", all="Semua episode →", join="Bergabung dengan komunitas", joint="Profil gratis, direktori pakar, acara, dan halaman Anda sendiri di grafik pengetahuan.", create="Buat profil Anda →", seat="Amankan kursi gratis Anda →", google="Lihat <b>M365.FM</b> lebih dulu di Google&nbsp;Top&nbsp;Stories."),
    "ru": dict(listen="Слушать и подписаться", platforms="Все платформы", topics="Темы и люди на этой странице", kg="Изучите граф знаний →", related="Похожие выпуски", latest="Последние выпуски", all="Все выпуски →", join="Присоединяйтесь к сообществу", joint="Бесплатный профиль, каталог экспертов, события и собственная страница в графе знаний.", create="Создать профиль →", seat="Займите бесплатное место →", google="Видьте <b>M365.FM</b> первым в Google&nbsp;Top&nbsp;Stories."),
    "uk": dict(listen="Слухати й підписатися", platforms="Усі платформи", topics="Теми та люди на цій сторінці", kg="Досліджуйте граф знань →", related="Схожі випуски", latest="Останні випуски", all="Усі випуски →", join="Приєднуйтесь до спільноти", joint="Безкоштовний профіль, каталог експертів, події та власна сторінка в графі знань.", create="Створити профіль →", seat="Забронюйте безкоштовне місце →", google="Бачте <b>M365.FM</b> першим у Google&nbsp;Top&nbsp;Stories."),
    "ar": dict(listen="استمع وتابع", platforms="كل المنصات", topics="المواضيع والأشخاص في هذه الصفحة", kg="استكشف الرسم البياني للمعرفة ←", related="حلقات مشابهة", latest="أحدث الحلقات", all="كل الحلقات ←", join="انضم إلى المجتمع", joint="ملف شخصي مجاني ودليل خبراء وفعاليات وصفحتك الخاصة في الرسم البياني للمعرفة.", create="أنشئ ملفك الشخصي ←", seat="احجز مقعدك المجاني ←", google="شاهد <b>M365.FM</b> أولًا في Google&nbsp;Top&nbsp;Stories."),
    "he": dict(listen="האזינו ועקבו", platforms="כל הפלטפורמות", topics="נושאים ואנשים בעמוד זה", kg="גלו את גרף הידע ←", related="פרקים דומים", latest="הפרקים האחרונים", all="כל הפרקים ←", join="הצטרפו לקהילה", joint="פרופיל חינמי, מדריך מומחים, אירועים ועמוד משלכם בגרף הידע.", create="צרו את הפרופיל שלכם ←", seat="שמרו את מקומכם בחינם ←", google="ראו את <b>M365.FM</b> ראשון ב-Google&nbsp;Top&nbsp;Stories."),
    "ja": dict(listen="聴く・フォローする", platforms="すべてのプラットフォーム", topics="このページのトピックと人物", kg="ナレッジグラフを探索 →", related="似ているエピソード", latest="最新エピソード", all="すべてのエピソード →", join="コミュニティに参加", joint="無料プロフィール、専門家ディレクトリ、イベント、ナレッジグラフ内のあなた自身のページ。", create="プロフィールを作成 →", seat="無料の席を確保 →", google="Google&nbsp;Top&nbsp;Stories で <b>M365.FM</b> を最初に表示。"),
    "ko": dict(listen="듣고 팔로우하기", platforms="모든 플랫폼", topics="이 페이지의 주제와 인물", kg="지식 그래프 둘러보기 →", related="비슷한 에피소드", latest="최신 에피소드", all="모든 에피소드 →", join="커뮤니티 참여", joint="무료 프로필, 전문가 디렉터리, 이벤트, 지식 그래프 속 나만의 페이지.", create="프로필 만들기 →", seat="무료 좌석 예약 →", google="Google&nbsp;Top&nbsp;Stories에서 <b>M365.FM</b>을 가장 먼저 보세요.")
    }


LISTEN = (("apple_show", "Apple Podcasts"), ("spotify_show", "Spotify"), ("amazon_show", "Amazon Music"), ("deezer_show", "Deezer"), ("iheart_show", "iHeart"))


def chips_for(ix, text="", ids=None, exclude=(), k=12, lang="en"):
    """Themen & Personen der Seite: feste Liste (ids, z. B. verwandte Entitaeten einer Entitaetsseite oder Themen eines Beitrags), sonst Treffer im Text
    (Kontext der Seite: ihre festen ids und die eigene Entitaet aus exclude)."""
    out, seen = [], set(exclude or ())
    for i in ids or ():
        e = ix.all.get(i)
        if e and i not in seen and e.get("type") != "category":
            seen.add(i); out.append(e)
        if len(out) >= k: break
    if not out and text:
        out = [e for e in ix.match(text, k + len(seen), lang=lang, ctx=set(ids or ()) | set(exclude or ())) if e["id"] not in seen][:k]
    return out


def render(ix, BASE, lang, text="", items=(), url_of=None, title_of=None, all_url="", shp=None, listen_url="", rss="", ent_prefix="", community_url="", ids=None, exclude=(), home=False, topics_h="", related=None):
    """Die Sidebar einer Seite in ihrer Sprache: M365Con-Karte, Google-Quelle, Themen/Personen der Seite, Aehnliche Folgen, Hoeren & folgen, Community.
    related: [(url, titel)] der festen aehnlichen Folgen (site_related.links); None/leer = keine Folgen-Karte (Uebersichtsseiten).
    items/url_of/title_of: frueher die neuesten Folgen der Sprache, nur noch aus Kompatibilitaet angenommen und ohne Wirkung; all_url: alle Folgen; shp: Plattform-Links der Show der Sprache (data/platforms.json);
    listen_url: Seite mit allen Plattformen (nur wenn es sie gibt); rss: Feed der Show; home: Sprach-Startseite (ohne Hoeren-Karte, Aufbau wie bisher).
    topics_h: Ueberschrift der Themen-Karte mit der Beziehung zur Seite ("Mit Power BI verknuepfte Themen", "Themen & Personen dieser Folge", site_linkctx side.*);
    ohne Angabe bei Treffern im Text "Auf dieser Seite erwaehnt" (site_linkctx side.page), bei fester Liste die allgemeine "Themen & Personen auf dieser Seite"."""
    t = L10N.get(lang) or L10N["en"]; shp = shp or {}
    import site_ename as EN   # Linktext = Name in der Sprache der Seite (wie Listen und Brotkruemel), englischer Rest mit lang="en", RTL in <bdi>
    got = chips_for(ix, text, ids, exclude, lang=lang)
    _pid = next(iter(exclude), None) if len(tuple(exclude or ())) == 1 else None   # Entitaetsseite: ihre eigene Entitaet (Hersteller/Kategorie gleich der Seite entfallen im Zusatz)
    # Paket 6: Name mit kurzem Zusatz im Chip ("Power BI – Analyse- und BI-Werkzeug von Microsoft"), title = Kurzbeschreibung der Seitensprache (sonst der Typ)
    chips = "".join(f'<li>{EN.list_link(BASE + ent_prefix + "/entity/" + e["id"] + "/", e, lang, _pid, ix.all, cls="sb-chip t-" + esc(e["type"]), pre="<i></i>")}</li>' for e in got)
    if not topics_h and got and not set(ids or ()) & {e["id"] for e in got}:
        import site_linkctx as LC   # Treffer im Text der Seite: die Beziehung ist "auf dieser Seite erwaehnt" (Messung Paket 4, misses 5)
        topics_h = LC.plain(lang, "side.page")
    ents = f'<section class="sb-card"><h2>{esc(topics_h or t["topics"])}</h2><ul class="sb-chips">{chips}</ul><a class="sb-more" href="{BASE}{ent_prefix}/entity/">{esc(t["kg"])}</a></section>' if chips else ""
    rel = "".join(f'<li><a href="{esc(u)}">{esc(ti)}</a></li>' for u, ti in list(related or ())[:5])   # feste Auswahl je Inhalt (site_related), nie "neueste"
    new = (f'<section class="sb-card sb-rel"><h2>{esc(t["related"])}</h2><ul class="sb-list">{rel}</ul>'
           + (f'<a class="sb-more" href="{esc(all_url)}">{esc(t["all"])}</a>' if all_url else "") + '</section>') if rel else ""
    con = (f'<section class="sb-card sb-con">' + (con_text(lang) if CON_TEXT else f'<a href="{CON}" rel="noopener" aria-label="M365Con International 2027">{con_img(BASE)}</a>')
           + f'<a class="sb-btn" href="{CON}" rel="noopener">{esc(t["seat"])}</a></section>')
    import site_ads as ADS
    if not ADS.con_running():   # nach dem Event (CON_UNTIL 22.01.2027, gleiches Ende wie Haus-Banner und Kopfleiste) faellt die Karte weg; der taegliche Bau raeumt auf
        con = ""
    goog = (f'<section class="sb-card sb-g">' + (google_text(lang) if CON_TEXT else f'<a class="gb" href="{GSRC}" rel="noopener" target="_blank"><img src="{BASE}/assets/gsource.webp" alt="Add M365.fm as a preferred source on Google" width="647" height="192" loading="lazy"></a>') + f'<p>{t["google"]}</p></section>')
    links = " ".join(f'<a href="{esc(shp[k])}" rel="noopener">{n}</a>' for k, n in LISTEN if shp.get(k))
    more = " ".join(x for x in ((f'<a href="{esc(listen_url)}">{esc(t["platforms"])}</a>' if listen_url else ""), (f'<a href="{esc(rss)}" rel="noopener">RSS</a>' if rss else "")) if x)
    foll = (f'<section class="sb-card"><h2>{esc(t["listen"])}</h2><p class="sb-links">{links}</p>' + (f'<p class="sb-links">{more}</p>' if more else "") + "</section>") if links and not home else ""
    comm = f'<section class="sb-card sb-comm"><h2>{esc(t["join"])}</h2><p>{esc(t["joint"])}</p><a class="sb-btn sb-ghost" href="{esc(community_url or BASE + "/community/")}">{esc(t["create"])}</a></section>'
    return f'<aside class="sbar" aria-label="Sidebar"><div class="sbar-in">{con}{goog}{ents}{new}{foll}{comm}</div></aside>'
