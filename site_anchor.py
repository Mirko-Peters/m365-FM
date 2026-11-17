"""Linktexte im Altbestand beim Seitenbau verbessern (Audit F7/F8, Linktexte).

Betrifft nur Inhalte, die nicht mehr redaktionell gepflegt werden: die frueheren Podpage-Blogbeitraege mit ihren Sprachfassungen
(data/blog_i18n, site_legacy_blog) und die alten Podpage-Show-Notes der englischen Folgen samt uebersetzten Show Notes (site_podpage).
Die Quelldaten bleiben unveraendert; umgeschrieben wird die fertige HTML-Fassung einer Seite, also NACH dem Nachschlagen der
Uebersetzung (translate_blog.source_of und die Quell-Hashes sehen den Originaltext, nichts wird neu uebersetzt).

Regeln (Mirko 16.11.2026, Audit-Plan "Linktexte"):
- Interner Link mit allgemeinem Text ("here", "hier", "this guide", "learn more", "read more", "this link", "link" ... in allen 15 Sprachen)
  -> anchor_title(Titel der Zielseite) in der Seitensprache (Sprachfassung des Ziels, sonst Englisch).
- "Listen to the full episode" -> "Folge anhören: {Folgentitel}" in der Seitensprache.
- Externer Link mit allgemeinem Text -> Domain des Ziels (nach dem Bereinigen hat ein Link keinen title, deshalb die Domain).
- Spreaker-Unterstuetzer-Adresse als Linktext -> "M365.FM auf Spreaker unterstützen" (lokalisiert).
- "Link" in einer Tabellenzeile -> Text der ersten Zelle derselben Zeile.
- Leere oder nur aus einem Bild ohne Alt-Text bestehende Anker -> aria-label (Zieltitel bzw. Domain), sichtbarer Inhalt bleibt.
- Alles andere bleibt, insbesondere schon beschreibende Texte und "M365 FM" auf die Startseite.

Sprachfassungen: Ist die Ankerliste einer Uebersetzung deckungsgleich mit der des englischen Originals (gleiche Anzahl, gleiche Ziele
in derselben Reihenfolge, bei ueber 99 % der Beitraege der Fall), gilt die Einordnung des englischen Ankers ("here" -> "hier", "ici",
"こちら" ...). Sonst entscheiden die Wortlisten je Sprache (GENERIC/LISTEN).

Deterministisch und idempotent: der neue Text haengt nur vom Ziel, der Seitensprache und der Tabellenzeile ab; ein zweiter Lauf aendert
nichts. HTML wird nur innerhalb von <a ...>...</a> angefasst: Textknoten werden ersetzt, Tags (strong, em, img) bleiben stehen."""
import html as _h
import re
import unicodedata
from collections import Counter
from urllib.parse import urlsplit

import site_links as SLK

LANGS = ("en", "de", "fr", "es", "it", "nl", "pt", "pl", "id", "ru", "uk", "ar", "he", "ja", "ko")

LISTEN_LABEL = {"en": "Listen to the episode", "de": "Folge anhören", "fr": "Écouter l’épisode", "es": "Escuchar el episodio", "it": "Ascolta l’episodio",
                "nl": "Aflevering beluisteren", "pt": "Ouvir o episódio", "pl": "Posłuchaj odcinka", "id": "Dengarkan episode", "ru": "Слушать выпуск",
                "uk": "Слухати епізод", "ar": "استمع إلى الحلقة", "he": "האזינו לפרק", "ja": "エピソードを聴く", "ko": "에피소드 듣기"}
SUPPORT_LABEL = {"en": "Support M365.FM on Spreaker", "de": "M365.FM auf Spreaker unterstützen", "fr": "Soutenir M365.FM sur Spreaker", "es": "Apoyar a M365.FM en Spreaker",
                 "it": "Sostieni M365.FM su Spreaker", "nl": "M365.FM steunen op Spreaker", "pt": "Apoiar o M365.FM no Spreaker", "pl": "Wesprzyj M365.FM na Spreakerze",
                 "id": "Dukung M365.FM di Spreaker", "ru": "Поддержать M365.FM на Spreaker", "uk": "Підтримати M365.FM на Spreaker", "ar": "ادعم M365.FM على Spreaker",
                 "he": "תמכו ב-M365.FM ב-Spreaker", "ja": "SpreakerでM365.FMを応援する", "ko": "Spreaker에서 M365.FM 후원하기"}
HOME_NAME = "M365.FM"

# Allgemeine Linktexte je Sprache (normalisiert: klein, ohne Satzzeichen und Pfeile am Rand). Die Formen der Uebersetzungen stammen aus
# den Sprachfassungen in data/blog_i18n (Abgleich der Anker mit dem englischen Original, Stand 16.11.2026).
_G = {
    "en": "here|click here|details here|more details here|see here|read it here|this link|link|links|learn more|read more|more|more info|more information|"
          "this guide|this resource|this article|this post|this page|this episode|this podcast episode|this podcast|this deep dive|this discussion|"
          "this practical guide|this video|source|full article",
    "de": "hier|hier klicken|details hier|hier die details|mehr dazu|mehr erfahren|mehr lesen|weiterlesen|weitere informationen|mehr informationen|"
          "diesem link|unter diesem link|dieser link|diesen link|link|diesem leitfaden|in diesem leitfaden|dieser leitfaden|diesen leitfaden|diese anleitung|"
          "dieser anleitung|dieser ressource|diese ressource|in dieser ressource|diesem beitrag|diesen beitrag|in diesem beitrag|diesem artikel|in diesem artikel|"
          "dieser episode|dieser folge|diese episode|diese folge|dieser podcast-episode|diese podcast-folge|dieser podcast-folge|diese podcast-episode|"
          "diesem podcast|quelle|diesem deep dive|dieser diskussion|diese diskussion|diesem praxisnahen leitfaden|dieser praxisnahe leitfaden",
    "fr": "ici|cliquez ici|disponible ici|détails ici|plus de détails ici|en savoir plus|lire la suite|ce lien|via ce lien|lien|cet article|cette page|ce guide|"
          "dans ce guide|cette ressource|dans cette ressource|cet épisode|cet épisode de podcast|cet épisode du podcast|ce podcast|source|cette discussion|"
          "ce guide pratique|cette analyse approfondie",
    "es": "aquí|haz clic aquí|más información|lee más|leer más|este enlace|enlace|esta guía|este artículo|este recurso|este episodio|este episodio del podcast|"
          "este pódcast|este podcast|fuente|esta conversación|esta guía práctica|detalles aquí",
    "it": "qui|clicca qui|disponibile qui|scopri di più|leggi di più|questo link|a questo link|link|questa guida|questo articolo|questa pagina|questa risorsa|"
          "questo episodio|questo podcast|fonte|questa discussione|questa guida pratica|dettagli qui",
    "nl": "hier|klik hier|meer informatie|meer weten|lees meer|deze link|via deze link|link|deze gids|dit artikel|deze bron|deze aflevering|deze podcastaflevering|"
          "deze podcast|bron|deze discussie|deze praktische gids|details hier",
    "pt": "aqui|clique aqui|saiba mais|leia mais|este link|neste link|link|este guia|neste guia|guia|este artigo|este recurso|este episódio|este podcast|fonte|"
          "esta discussão|este guia prático|detalhes aqui",
    "pl": "tutaj|tu|kliknij tutaj|dowiedz się więcej|sprawdź więcej|czytaj więcej|tym linkiem|pod tym linkiem|ten link|link|odnośnik|tym przewodniku|"
          "ten przewodnik|tego przewodnika|tym artykule|ten artykuł|ten odcinek|tym odcinku|ten podcast|źródło|szczegóły tutaj",
    "id": "di sini|klik di sini|pelajari selengkapnya|selengkapnya|baca selengkapnya|tautan ini|tautan|panduan ini|artikel ini|sumber daya ini|episode ini|"
          "podcast ini|sumber|diskusi ini|detailnya di sini",
    "ru": "здесь|тут|нажмите здесь|подробнее|читать далее|этой ссылке|по этой ссылке|эта ссылка|ссылка|этом руководстве|это руководство|этим руководством|"
          "в этом руководстве|эта статья|этой статье|этот выпуск|этом выпуске|этот эпизод|этот подкаст|источник",
    "uk": "тут|тут детальніше|натисніть тут|детальніше|докладніше|дізнатися більше|читати далі|цим посиланням|за цим посиланням|цього посилання|посилання|"
          "цьому посібнику|цей посібник|цим посібником|ця стаття|цій статті|цей епізод|цьому епізоді|цей подкаст|джерело",
    "ar": "هنا|من هنا|اضغط هنا|انقر هنا|اطّلع هنا|اعرف المزيد|اطّلع على المزيد|اقرأ المزيد|هذا الرابط|رابط|هذا الدليل|هذا المقال|هذه الحلقة|هذا البودكاست|المصدر",
    "he": "כאן|לחצו כאן|היכנסו לכאן|לכאן|עיינו כאן|למידע נוסף|מידע נוסף|קראו עוד|קריאה נוספת|קישור זה|בקישור הזה|קישור הזה|הקישור הזה|קישור|מדריך זה|"
          "המדריך הזה|מדריך הזה|במדריך הזה|הפרק הזה|מקור",
    "ja": "こちら|ここ|こちらの記事|詳細を見る|詳細はこちら|詳しくはこちら|詳細情報|こちらのリンク|リンク|リンク先|こちらのガイド|このガイド|このエピソード|出典",
    "ko": "여기|여기를 클릭|자세히 보기|자세히 알아보기|더 알아보기|자세히 읽기|이 링크|링크|이 가이드|이 글|이 에피소드|출처",
}
_L = {
    "en": "listen to the full episode|listen to the episode|listen to this episode|listen now|listen here|listen to the full podcast episode",
    "de": "hören sie sich die vollständige episode an|hören sie sich die vollständige folge an|hören sie sich die vollständige folge|hören sie sich die vollständige episode|"
          "folge anhören|episode anhören|folge jetzt anhören|jetzt die folge anhören|ganze folge anhören",
    "fr": "écoutez l'épisode complet|écouter l'épisode complet|écouter l'intégralité de l'épisode|écouter l'épisode|écoutez l'épisode",
    "es": "escucha el episodio completo|escuchar el episodio completo|escuche el episodio completo|escucha el episodio|escuchar el episodio",
    "it": "ascolta l'episodio completo|ascoltare l'episodio completo|ascoltare la puntata completa|ascolta l'episodio|ascolta la puntata",
    "nl": "luister de volledige aflevering|luister naar de volledige aflevering|beluister de volledige aflevering|de volledige aflevering beluisteren|"
          "luister naar de aflevering|beluister de aflevering",
    "pt": "ouça o episódio completo|ouvir o episódio completo|ouça o episódio",
    "pl": "posłuchaj pełnego odcinka|posłuchaj całego odcinka|posłuchać całego odcinka|wysłuchaj pełnego odcinka|posłuchaj odcinka",
    "id": "dengarkan episode lengkapnya|mendengarkan episode lengkapnya|dengarkan episode lengkap|mendengarkan episode lengkap|dengarkan episodenya",
    "ru": "послушайте полный выпуск|послушайте полный эпизод|слушайте полный эпизод|прослушайте полный выпуск|слушать выпуск|слушать эпизод|слушайте эпизод",
    "uk": "послухайте повний епізод|послухайте повний випуск|слухайте повний епізод|прослухайте повний епізод|слухати епізод|слухайте епізод",
    "ar": "استمع إلى الحلقة الكاملة|استمع إلى الحلقة كاملة|الاستماع إلى الحلقة كاملة|الاستماع إلى الحلقة الكاملة|استمع إلى الحلقة|الاستماع إلى الحلقة|استمعوا إلى الحلقة",
    "he": "האזינו לפרק המלא|להאזין לפרק המלא|להאזנה לפרק|האזינו לפרק",
    "ja": "エピソード全編を聴く|エピソード全編を聴いて|エピソード全編をお聴きください|エピソードの全編を聴いて|エピソードを聴く",
    "ko": "전체 에피소드 듣기|전체 에피소드를 들어보십시오|전체 에피소드를 들어보세요|전체 에피소드를 들어 보십시오|에피소드 듣기",
}
_EDGE = " \t\r\n.,:;!?·…→←↗»«›‹>\"'()[]“”„‘’。、！？："


def norm(t):
    """Vergleichsform eines Linktexts: Unicode NFC, klein, typografische Apostrophe vereinheitlicht, Satzzeichen und Pfeile am Rand weg."""
    t = unicodedata.normalize("NFC", (t or "").replace("’", "'").replace("‘", "'").replace(" ", " "))
    return re.sub(r"\s+", " ", t).strip(_EDGE).lower()


GENERIC = {l: frozenset(norm(x) for x in v.split("|")) for l, v in _G.items()}
LISTEN = {l: frozenset(norm(x) for x in v.split("|")) for l, v in _L.items()}


def classify(text, lang):
    """'listen', 'generic' oder None (beschreibend, bleibt). Englische Formen gelten in jeder Sprache (unuebersetzte Reste)."""
    n = norm(text)
    if not n:
        return None
    for l in dict.fromkeys((lang, "en")):
        if n in LISTEN.get(l, ()):
            return "listen"
        if n in GENERIC.get(l, ()):
            return "generic"
    return None


def anchor_title(t, n=58):
    """Wie generate_site.anchor_title (Kernthema vor dem Doppelpunkt, hoechstens n Zeichen); hier dupliziert, weil generate_site kein Modul zum Importieren ist."""
    t = re.sub(r"\s*\((KI|AI)[^)]*\)\s*$", "", re.sub(r"<[^>]+>", "", t or "")).strip()
    main = t.split(":")[0].strip() if ":" in t and len(t.split(":")[0].strip()) >= 14 else t
    return main if len(main) <= n else main[: n - 1].rsplit(" ", 1)[0].rstrip(",;–-") + "…"


def plain(s):
    return re.sub(r"\s+", " ", _h.unescape(re.sub(r"<[^>]+>", " ", s or ""))).strip()


def domain(href):
    try:
        host = (urlsplit(href).hostname or "").lower()
    except ValueError:
        return ""
    return host[4:] if host.startswith("www.") else host


class Titles:
    """Titel interner Ziele je Sprache. episodes/posts: {slug: {lang: titel}} (ohne Sprachfassung gilt "en"); renames: alter -> neuer Folgen-Slug;
    extra: feste Weiterleitungen {"/alt": "/ziel/"} (data/redirects_extra.json); ents: {entitaet: name}; base: Adresse des Baus (zaehlt als intern).
    of(href, lang) -> (art, titel) mit art in episode/post/entity/home, oder None (externes oder unbekanntes Ziel)."""

    def __init__(self, episodes=None, posts=None, renames=None, extra=None, ents=None, base=""):
        self.episodes, self.posts = episodes or {}, posts or {}
        self.renames, self.extra, self.ents = renames or {}, extra or {}, ents or {}
        self.base = (base or "").rstrip("/")

    def path(self, href):
        """Pfad eines internen Links (ohne Query/Fragment) oder None."""
        href = _h.unescape(href or "").strip()
        if self.base and href.startswith(self.base + "/"):
            href = href[len(self.base):]
        s = SLK.split_internal(href)
        return s[2] if s else None

    def _t(self, table, slug, lang):
        """Titel in der Sprache, sonst Englisch; Platzhalter ohne Buchstaben oder Ziffern ("..." in einzelnen Maschinenfassungen) zaehlen nicht."""
        d = table.get(slug) or {}
        return next((t for t in (d.get(lang), d.get("en")) if t and re.search(r"\w", t)), None)

    def of(self, href, lang, _depth=0):
        p = self.path(href)
        if p is None:
            return None
        c = [x for x in p.split("/") if x]
        if c and c[0] in LANGS:   # Sprachpfad (/de/show/episodes/...): dasselbe Ziel, Titel in der Seitensprache
            c = c[1:]
        if not c:
            return "home", HOME_NAME
        if len(c) == 3 and c[:2] == ["show", "episodes"] or len(c) == 2 and c[0] == "m365-fm-podcast":
            t = self._t(self.episodes, self.renames.get(c[-1], c[-1]), lang)
            if t: return "episode", t
        if (len(c) == 2 and c[0] == "blog" or len(c) == 3 and c[:2] == ["show", "blog"]
                or len(c) == 5 and c[:2] == ["community", "u"] and c[2] in ("mirko-p", "mirko-peters") and c[3] == "blog"):
            t = self._t(self.posts, c[-1], lang)
            if t: return "post", t
        if len(c) == 2 and c[0] == "entity" and c[1] in self.ents:
            return "entity", self.ents[c[1]]
        if len(c) == 1:   # flache Podpage-Adresse: Folge, Beitrag oder feste Weiterleitung
            s = self.renames.get(c[0], c[0])
            t = self._t(self.episodes, s, lang)
            if t: return "episode", t
            t = self._t(self.posts, s, lang)
            if t: return "post", t
            to = self.extra.get("/" + c[0]) or self.extra.get("/" + c[0] + "/")
            if to and _depth < 2:
                return self.of(to, lang, _depth + 1)
        return None


_A = re.compile(r"<a\b([^>]*)>(.*?)</a\s*>", re.S | re.I)
_ATTR = re.compile(r"""\s([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*(?:"([^"]*)"|'([^']*)')""")
_TR = re.compile(r"<tr\b[^>]*>.*?</tr\s*>", re.S | re.I)
_CELL = re.compile(r"<t([dh])\b[^>]*>(.*?)</t\1\s*>", re.S | re.I)
_TAG = re.compile(r"(<[^>]+>)")
_URLTXT = re.compile(r"^(?:https?://|www\.)\S+$", re.I)
_CJK = re.compile(r"[぀-ヿ㐀-鿿가-힯]")


def _attrs(s):
    return {m.group(1).lower(): _h.unescape(m.group(2) if m.group(2) is not None else m.group(3)) for m in _ATTR.finditer(s or "")}


def anchors(html):
    """[(href, text)] aller Anker einer Seite in Reihenfolge."""
    return [(_attrs(m.group(1)).get("href", ""), plain(m.group(2))) for m in _A.finditer(html or "")]


def _set_text(inner, new):
    """Sichtbaren Text eines Ankers ersetzen, Tags darin (strong, em ...) bleiben: der erste nicht leere Textknoten bekommt den neuen Text, die uebrigen werden leer."""
    parts = _TAG.split(inner)
    done = False
    for i in range(0, len(parts), 2):
        if parts[i].strip():
            parts[i] = "" if done else _h.escape(new, quote=False)
            done = True
    return "".join(parts) if done else _h.escape(new, quote=False)


def _short(t, ref):
    """Uebersetzter Anker, dessen Original allgemein ist: nur ersetzen, wenn er nicht deutlich laenger ist (der Uebersetzer hat sonst schon beschrieben)."""
    if len(t) > 60:
        return False
    if _CJK.search(t) and " " not in t.strip():
        return len(t) <= 20
    return len(t.split()) <= len((ref or "").split()) + 2


def _row_context(html):
    """{Startposition eines Ankers: Text der ersten Zelle} fuer Anker in einer spaeteren Zelle derselben Tabellenzeile."""
    out = {}
    if "<tr" not in html.lower():
        return out
    for tr in _TR.finditer(html):
        cells = list(_CELL.finditer(tr.group(0)))
        if len(cells) < 2:
            continue
        first = plain(cells[0].group(2))
        if not first or len(first) > 120 or classify(first, "en") or _URLTXT.match(first):
            continue
        for c in cells[1:]:
            for a in _A.finditer(c.group(2)):
                out[tr.start() + c.start(2) + a.start()] = first
    return out


def _is_support(href):
    try:
        u = urlsplit(_h.unescape(href))
    except ValueError:
        return False
    return (u.hostname or "").lower().endswith("spreaker.com") and u.path.rstrip("/").endswith("/support")


STATS = Counter()   # (bereich, regel) -> Anzahl ersetzter Anker in diesem Bau
_HAS_ALT = re.compile(r"""<img\b[^>]*\balt\s*=\s*["'][^"'\s][^"']*["']""", re.I)


def _kinds(html, lang, ref):
    """Einordnung der englischen Anker, wenn die Ankerliste der Sprachfassung deckungsgleich ist (gleiche Ziele in gleicher Reihenfolge), sonst None."""
    if ref is None or lang == "en":
        return None
    ra, ha = anchors(ref), anchors(html)
    if len(ra) != len(ha) or any(a[0] != b[0] for a, b in zip(ra, ha)):
        return None
    return [(classify(t, "en"), t) for _, t in ra]


def _decide(i, m, lang, titles, kinds, rows):
    """Entscheidung fuer einen Anker: None (bleibt) oder (regel, neuer_text, aria). aria=True: Text bleibt, der Link bekommt aria-label=neuer_text."""
    at, inner = _attrs(m.group(1)), m.group(2)
    href = at.get("href", "")
    if not href or href.startswith(("#", "mailto:", "tel:")):
        return None
    text = plain(inner)
    t = titles.of(href, lang)
    if not text:   # leer oder nur Bild: sichtbar bleibt alles, der Link bekommt einen Namen
        if at.get("aria-label") or _HAS_ALT.search(inner):
            return None
        name = anchor_title(t[1]) if t else ("" if titles.path(href) is not None else domain(href))
        return ("aria-label", name, True) if name else ("nameless-unresolved", "", True)
    title = anchor_title(t[1]) if t else ""
    done = {norm(x) for x in (title, f"{LISTEN_LABEL[lang]}: {title}" if title else "", SUPPORT_LABEL[lang], rows.get(m.start(), "")) if x}
    if norm(text) in done:   # schon umgeschrieben (zweiter Lauf) oder zufaellig schon der Zieltitel
        return None
    if _is_support(href) and (_URLTXT.match(text) or classify(text, lang)):
        return "spreaker-support", SUPPORT_LABEL[lang], False
    cls = classify(text, lang)
    if cls is None and kinds is not None and kinds[i][0] and _short(text, kinds[i][1]):
        cls = "generic"   # Uebersetzung eines allgemeinen Ankers; bei "listen" weicht der Wortlaut ab (z. B. "der vollstaendigen Episode"): nur der Titel passt in den Satz
    if cls is None:
        return None
    if cls == "generic" and m.start() in rows:
        return "table-row", rows[m.start()], False
    if t:
        return f"{cls}-{t[0]}", (f"{LISTEN_LABEL[lang]}: {title}" if cls == "listen" and t[0] == "episode" else title), False
    if titles.path(href) is not None:
        return "unresolved-internal", "", False
    if cls == "listen":
        return "unresolved-listen", "", False
    d = domain(href)
    return ("external-domain", d, False) if d and norm(d) != norm(text) else None


def improve(html, lang, titles, ref=None, area="", stats=None):
    """Linktexte einer fertigen HTML-Fassung verbessern (Regeln oben). ref: HTML des englischen Originals (Sprachfassungen: Einordnung per Abgleich).
    stats: Counter fuer (area, regel), Standard STATS; "unresolved-*" zaehlt Anker, die bleiben, weil das Ziel unbekannt ist."""
    if not html or "<a" not in html.lower():
        return html
    stats = STATS if stats is None else stats
    lang = lang if lang in LANGS else "en"
    kinds, rows, pos = _kinds(html, lang, ref), _row_context(html), [0]

    def rep(m):
        i = pos[0]; pos[0] += 1
        d = _decide(i, m, lang, titles, kinds, rows)
        if not d:
            return m.group(0)
        rule, new, aria = d
        stats[(area, rule)] += 1
        if not new:
            return m.group(0)
        if aria:
            return f'<a{m.group(1)} aria-label="{_h.escape(new, quote=True)}">{m.group(2)}</a>'
        return f"<a{m.group(1)}>{_set_text(m.group(2), new)}</a>"

    return _A.sub(rep, html)


def weak(html, lang, titles, ref=None):
    """Schwache Anker einer Seite zaehlen (Bericht vorher/nachher), nach denselben Regeln wie improve: Counter {regel: anzahl}.
    Nach improve bleiben nur die "unresolved-*" (Ziel unbekannt) uebrig."""
    c = Counter()
    if not html or "<a" not in html.lower():
        return c
    lang = lang if lang in LANGS else "en"
    kinds, rows = _kinds(html, lang, ref), _row_context(html)
    for i, m in enumerate(_A.finditer(html)):
        d = _decide(i, m, lang, titles, kinds, rows)
        if d:
            c[d[0]] += 1
    return c


def summary(stats=None):
    """Eine Zeile fuers Protokoll: ersetzte Anker je Bereich und Regel."""
    stats = STATS if stats is None else stats
    by = {}
    for (area, rule), n in sorted(stats.items()):
        by.setdefault(area or "-", []).append(f"{rule} {n}")
    return "Linktexte Altbestand: " + (" | ".join(f"{a}: " + ", ".join(v) for a, v in by.items()) if by else "nichts ersetzt")
