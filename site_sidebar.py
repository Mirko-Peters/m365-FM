"""Die eine Sidebar aller Inhaltsseiten (Folgen, Entitaeten, Blogbeitraege, Videos, Bibliothek, Events, Profile) in allen 15 Sprachen (Mirko, 6.11.2026:
"immer die gleiche"): M365Con-Karte, Google-Quelle, Themen & Personen der Seite (Wissensgraph), neueste Folgen der Sprache, Hoeren & folgen, Community.
Die fruehere Karte "M365.FM Show" (Show-Menue) gibt es nicht mehr; ihre Ziele stehen auf /show/ (site_podpage.py)."""
import json, re
from html import escape as esc
from pathlib import Path
D = Path(__file__).parent / "data"
TYPE_L = {"product": "Product", "concept": "Concept", "cert": "Certification", "platform": "Platform", "org": "Organization", "event": "Event", "person": "Person", "media": "Media", "category": "Topic"}
STOP = {"access", "project", "compliance", "governance", "automation", "prompt", "actions", "polling", "agent", "agents", "lists", "forms", "flow", "loop", "word", "bing", "stream", "sites", "pages", "tasks", "security", "identity", "copilot", "microsoft", "azure", "m365", "teams"}
TYPE_PRIO = {"product": 0, "person": 1, "cert": 2, "platform": 3, "concept": 4, "event": 5, "org": 6, "media": 7, "category": 9}
GSRC = "https://www.google.com/preferences/source?q=m365.fm"
CON = "https://m365con.net/?utm_source=m365.fm&utm_medium=sidebar&utm_campaign=attending2027"


class Index:
    def __init__(self):
        ents = json.loads((D / "entities.json").read_text("utf-8"))
        gp = D / "guest_entities.json"
        if gp.exists(): ents += json.loads(gp.read_text("utf-8"))
        self.by = {}; names = {}
        self.all = {e["id"]: e for e in ents}   # auch Kategorien: fuer feste Themenlisten (Entitaetsseite, Blogbeitrag)
        for e in ents:
            if e["type"] in ("category",) or e["id"] == "mirko-peters": continue
            for n in [e["name"]] + list(e.get("aliases") or []):
                n = (n or "").strip()
                if " " not in n and n.lower() in STOP and n.lower() != e["name"].lower(): continue
                if len(n) < (6 if e.get("guest") else 4) and n not in ("Teams", "Excel", "Word", "Azure", "Loop", "Viva", "Bing"): continue
                names.setdefault(n.lower(), e["id"])
            self.by[e["id"]] = e
        keys = sorted(names, key=len, reverse=True)
        self.names = names
        self.rx = re.compile(r"(?<![\w-])(" + "|".join(re.escape(k) for k in keys) + r")(?![\w-])", re.I) if keys else None

    def match(self, text, k=8):
        if not self.rx: return []
        cnt = {}
        for m in self.rx.finditer(text):
            i = self.names.get(m.group(1).lower()); cnt[i] = cnt.get(i, 0) + 1
        ids = sorted(cnt, key=lambda i: (self.by[i]["name"].lower() in STOP, -min(cnt[i], 3), TYPE_PRIO.get(self.by[i]["type"], 8), -cnt[i]))
        return [self.by[i] for i in ids[:k]]


# ---- Texte je Sprache ----
L10N = {
    "en": dict(listen="Listen & follow", platforms="All platforms", topics="Topics & people on this page", kg="Explore the knowledge graph →", latest="Latest episodes", all="All episodes →", join="Join the community", joint="Free profile, expert directory, events and your own page in the knowledge graph.", create="Create your profile →", seat="Save your free seat →", google="See <b>M365.FM</b> first in Google&nbsp;Top&nbsp;Stories."),
    "de": dict(listen="Hören & folgen", platforms="Alle Plattformen", topics="Themen & Personen auf dieser Seite", kg="Wissensgraph entdecken →", latest="Neueste Folgen", all="Alle Folgen →", join="Werde Teil der Community", joint="Kostenloses Profil, Expertenverzeichnis, Events und deine eigene Seite im Wissensgraphen.", create="Profil anlegen →", seat="Sichere dir deinen kostenlosen Platz →", google="Sieh <b>M365.FM</b> zuerst in Google&nbsp;Top&nbsp;Stories."),
    "es": dict(listen="Escucha y sigue", platforms="Todas las plataformas", topics="Temas y personas de esta página", kg="Explora el grafo de conocimiento →", latest="Últimos episodios", all="Todos los episodios →", join="Únete a la comunidad", joint="Perfil gratuito, directorio de expertos, eventos y tu propia página en el grafo de conocimiento.", create="Crea tu perfil →", seat="Reserva tu plaza gratis →", google="Ve <b>M365.FM</b> primero en Google&nbsp;Top&nbsp;Stories."),
    "fr": dict(listen="Écouter et suivre", platforms="Toutes les plateformes", topics="Sujets et personnes de cette page", kg="Explorer le graphe de connaissances →", latest="Derniers épisodes", all="Tous les épisodes →", join="Rejoignez la communauté", joint="Profil gratuit, annuaire d'experts, événements et votre propre page dans le graphe de connaissances.", create="Créer votre profil →", seat="Réservez votre place gratuite →", google="Voyez <b>M365.FM</b> en premier dans Google&nbsp;Top&nbsp;Stories."),
    "it": dict(listen="Ascolta e segui", platforms="Tutte le piattaforme", topics="Argomenti e persone di questa pagina", kg="Esplora il grafo della conoscenza →", latest="Ultimi episodi", all="Tutti gli episodi →", join="Unisciti alla community", joint="Profilo gratuito, elenco di esperti, eventi e la tua pagina nel grafo della conoscenza.", create="Crea il tuo profilo →", seat="Riserva il tuo posto gratuito →", google="Vedi <b>M365.FM</b> per primo in Google&nbsp;Top&nbsp;Stories."),
    "pt": dict(listen="Ouça e siga", platforms="Todas as plataformas", topics="Tópicos e pessoas desta página", kg="Explore o grafo de conhecimento →", latest="Últimos episódios", all="Todos os episódios →", join="Junte-se à comunidade", joint="Perfil gratuito, diretório de especialistas, eventos e a sua própria página no grafo de conhecimento.", create="Crie o seu perfil →", seat="Reserve a sua vaga gratuita →", google="Veja a <b>M365.FM</b> primeiro no Google&nbsp;Top&nbsp;Stories."),
    "nl": dict(listen="Luisteren en volgen", platforms="Alle platforms", topics="Onderwerpen en personen op deze pagina", kg="Verken de kennisgraaf →", latest="Nieuwste afleveringen", all="Alle afleveringen →", join="Word lid van de community", joint="Gratis profiel, expertgids, evenementen en je eigen pagina in de kennisgraaf.", create="Maak je profiel →", seat="Reserveer je gratis plek →", google="Zie <b>M365.FM</b> als eerste in Google&nbsp;Top&nbsp;Stories."),
    "pl": dict(listen="Słuchaj i obserwuj", platforms="Wszystkie platformy", topics="Tematy i osoby na tej stronie", kg="Poznaj graf wiedzy →", latest="Najnowsze odcinki", all="Wszystkie odcinki →", join="Dołącz do społeczności", joint="Bezpłatny profil, katalog ekspertów, wydarzenia i własna strona w grafie wiedzy.", create="Utwórz profil →", seat="Zarezerwuj bezpłatne miejsce →", google="Zobacz <b>M365.FM</b> jako pierwsze w Google&nbsp;Top&nbsp;Stories."),
    "id": dict(listen="Dengarkan & ikuti", platforms="Semua platform", topics="Topik dan tokoh di halaman ini", kg="Jelajahi grafik pengetahuan →", latest="Episode terbaru", all="Semua episode →", join="Bergabung dengan komunitas", joint="Profil gratis, direktori pakar, acara, dan halaman Anda sendiri di grafik pengetahuan.", create="Buat profil Anda →", seat="Amankan kursi gratis Anda →", google="Lihat <b>M365.FM</b> lebih dulu di Google&nbsp;Top&nbsp;Stories."),
    "ru": dict(listen="Слушать и подписаться", platforms="Все платформы", topics="Темы и люди на этой странице", kg="Изучите граф знаний →", latest="Последние выпуски", all="Все выпуски →", join="Присоединяйтесь к сообществу", joint="Бесплатный профиль, каталог экспертов, события и собственная страница в графе знаний.", create="Создать профиль →", seat="Займите бесплатное место →", google="Видьте <b>M365.FM</b> первым в Google&nbsp;Top&nbsp;Stories."),
    "uk": dict(listen="Слухати й підписатися", platforms="Усі платформи", topics="Теми та люди на цій сторінці", kg="Досліджуйте граф знань →", latest="Останні випуски", all="Усі випуски →", join="Приєднуйтесь до спільноти", joint="Безкоштовний профіль, каталог експертів, події та власна сторінка в графі знань.", create="Створити профіль →", seat="Забронюйте безкоштовне місце →", google="Бачте <b>M365.FM</b> першим у Google&nbsp;Top&nbsp;Stories."),
    "ar": dict(listen="استمع وتابع", platforms="كل المنصات", topics="المواضيع والأشخاص في هذه الصفحة", kg="استكشف الرسم البياني للمعرفة ←", latest="أحدث الحلقات", all="كل الحلقات ←", join="انضم إلى المجتمع", joint="ملف شخصي مجاني ودليل خبراء وفعاليات وصفحتك الخاصة في الرسم البياني للمعرفة.", create="أنشئ ملفك الشخصي ←", seat="احجز مقعدك المجاني ←", google="شاهد <b>M365.FM</b> أولًا في Google&nbsp;Top&nbsp;Stories."),
    "he": dict(listen="האזינו ועקבו", platforms="כל הפלטפורמות", topics="נושאים ואנשים בעמוד זה", kg="גלו את גרף הידע ←", latest="הפרקים האחרונים", all="כל הפרקים ←", join="הצטרפו לקהילה", joint="פרופיל חינמי, מדריך מומחים, אירועים ועמוד משלכם בגרף הידע.", create="צרו את הפרופיל שלכם ←", seat="שמרו את מקומכם בחינם ←", google="ראו את <b>M365.FM</b> ראשון ב-Google&nbsp;Top&nbsp;Stories."),
    "ja": dict(listen="聴く・フォローする", platforms="すべてのプラットフォーム", topics="このページのトピックと人物", kg="ナレッジグラフを探索 →", latest="最新エピソード", all="すべてのエピソード →", join="コミュニティに参加", joint="無料プロフィール、専門家ディレクトリ、イベント、ナレッジグラフ内のあなた自身のページ。", create="プロフィールを作成 →", seat="無料の席を確保 →", google="Google&nbsp;Top&nbsp;Stories で <b>M365.FM</b> を最初に表示。"),
    "ko": dict(listen="듣고 팔로우하기", platforms="모든 플랫폼", topics="이 페이지의 주제와 인물", kg="지식 그래프 둘러보기 →", latest="최신 에피소드", all="모든 에피소드 →", join="커뮤니티 참여", joint="무료 프로필, 전문가 디렉터리, 이벤트, 지식 그래프 속 나만의 페이지.", create="프로필 만들기 →", seat="무료 좌석 예약 →", google="Google&nbsp;Top&nbsp;Stories에서 <b>M365.FM</b>을 가장 먼저 보세요.")
    }


LISTEN = (("apple_show", "Apple Podcasts"), ("spotify_show", "Spotify"), ("amazon_show", "Amazon Music"), ("deezer_show", "Deezer"), ("iheart_show", "iHeart"))


def chips_for(ix, text="", ids=None, exclude=(), k=12):
    """Themen & Personen der Seite: feste Liste (ids, z. B. verwandte Entitaeten einer Entitaetsseite oder Themen eines Beitrags), sonst Treffer im Text."""
    out, seen = [], set(exclude or ())
    for i in ids or ():
        e = ix.all.get(i)
        if e and i not in seen and e.get("type") != "category":
            seen.add(i); out.append(e)
        if len(out) >= k: break
    if not out and text:
        out = [e for e in ix.match(text, k + len(seen)) if e["id"] not in seen][:k]
    return out


def render(ix, BASE, lang, text="", items=(), url_of=None, title_of=None, all_url="", shp=None, listen_url="", rss="", ent_prefix="", community_url="", ids=None, exclude=(), home=False):
    """Die Sidebar einer Seite in ihrer Sprache: M365Con-Karte, Google-Quelle, Themen/Personen der Seite, neueste Folgen der Sprache, Hoeren & folgen, Community.
    items/url_of/title_of: neueste Folgen der Sprache; all_url: alle Folgen; shp: Plattform-Links der Show der Sprache (data/platforms.json);
    listen_url: Seite mit allen Plattformen (nur wenn es sie gibt); rss: Feed der Show; home: Sprach-Startseite (ohne Hoeren-Karte, Aufbau wie bisher)."""
    t = L10N.get(lang) or L10N["en"]; shp = shp or {}
    chips = "".join(f'<li><a class="sb-chip t-{esc(e["type"])}" href="{BASE}{ent_prefix}/entity/{esc(e["id"])}/" title="{esc(TYPE_L.get(e["type"], ""))}"><i></i>{esc(e["name"])}</a></li>' for e in chips_for(ix, text, ids, exclude))
    ents = f'<section class="sb-card"><h2>{esc(t["topics"])}</h2><ul class="sb-chips">{chips}</ul><a class="sb-more" href="{BASE}{ent_prefix}/entity/">{esc(t["kg"])}</a></section>' if chips else ""
    late = "".join(f'<li><a href="{esc(url_of(x))}">{esc(title_of(x))}</a></li>' for x in list(items)[:5]) if url_of else ""
    new = f'<section class="sb-card"><h2>{esc(t["latest"])}</h2><ol class="sb-list">{late}</ol><a class="sb-more" href="{esc(all_url)}">{esc(t["all"])}</a></section>' if late else ""
    con = (f'<section class="sb-card sb-con"><a href="{CON}" rel="noopener" aria-label="M365Con International 2027"><img src="{BASE}/assets/attending-m365con.webp" alt="I\'m attending M365Con International 2027, January 11–22, 2027, free online event" width="675" height="563" loading="lazy"></a>'
           f'<a class="sb-btn" href="{CON}" rel="noopener">{esc(t["seat"])}</a></section>')
    goog = (f'<section class="sb-card sb-g"><a class="gb" href="{GSRC}" rel="noopener" target="_blank"><img src="{BASE}/assets/gsource.webp" alt="Add M365.fm as a preferred source on Google" width="647" height="192" loading="lazy"></a><p>{t["google"]}</p></section>')
    links = " ".join(f'<a href="{esc(shp[k])}" rel="noopener">{n}</a>' for k, n in LISTEN if shp.get(k))
    more = " ".join(x for x in ((f'<a href="{esc(listen_url)}">{esc(t["platforms"])}</a>' if listen_url else ""), (f'<a href="{esc(rss)}" rel="noopener">RSS</a>' if rss else "")) if x)
    foll = (f'<section class="sb-card"><h2>{esc(t["listen"])}</h2><p class="sb-links">{links}</p>' + (f'<p class="sb-links">{more}</p>' if more else "") + "</section>") if links and not home else ""
    comm = f'<section class="sb-card sb-comm"><h2>{esc(t["join"])}</h2><p>{esc(t["joint"])}</p><a class="sb-btn sb-ghost" href="{esc(community_url or BASE + "/community/")}">{esc(t["create"])}</a></section>'
    return f'<aside class="sbar" aria-label="Sidebar"><div class="sbar-in">{con}{goog}{ents}{new}{foll}{comm}</div></aside>'
