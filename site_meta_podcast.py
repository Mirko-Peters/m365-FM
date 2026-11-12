"""SEO-Titel und Meta-Descriptions der Podcast-Seiten (Bereich B, 12.11.2026: "SEO Title and Description search intent friendly").

Reine Funktionen ohne Seitenbau: Folgenseiten (Dub-Sprachen, englische Hauptshow, lokalisierte Show-Fassungen), Sprach-Startseiten,
Podcast-Hub je Sprache, Top-Seiten, Themen-Seiten, Show-Netzwerk, Livestreams, Community-Folgen/-Videos und die Podpage-Unterseiten.

Regeln (Auftrag): Hauptbegriff zuerst, dann das Format (Podcast-Folge / Podcast Episode), Marke genau einmal hinten (' | M365.FM'),
Titel moeglichst bis 62 Zeichen (CJK-Zeichen zaehlen doppelt), Description 120-155 Zeichen, bevorzugt an einem Satzende, nichts erfundenes.
Schema.org-Namen bleiben unberuehrt: die Funktionen liefern nur das, was page(lang, title, desc, ...) als <title> und meta description bekommt.
Fehlt eine Sprache in einer Tabelle, gilt Englisch."""
import html as _html
import re
import unicodedata

BRAND = "M365.FM"
TITLE_MAX = 62          # Marke inklusive (seo_title in generate_site.py: limit 62, hart 70)
BARE_MAX = 70           # Titel ohne Marke (page() haengt sie nur bis 62 Zeichen an, laesst bis 70 unveraendert; Bing-Grenze)
DESC_MIN, DESC_MAX = 120, 155
_BRAND_RX = re.compile(r"M365[ .]?FM", re.I)
_EMOJI = re.compile("[\U0001F000-\U0001FAFF☀-➿‍️]")

# ---------------------------------------------------------------- Sprachtabellen (en, de, fr, es, it, nl, pt, pl, id, ru, uk, ar, he, ja, ko)
EP = {   # eine Folge (Format-Name im Titel)
    "en": "Podcast Episode", "de": "Podcast-Folge", "fr": "Épisode de podcast", "es": "Episodio de podcast", "it": "Episodio podcast", "nl": "Podcastaflevering",
    "pt": "Episódio de podcast", "pl": "Odcinek podcastu", "id": "Episode podcast", "ru": "Выпуск подкаста", "uk": "Випуск подкасту", "ar": "حلقة بودكاست",
    "he": "פרק פודקאסט", "ja": "ポッドキャスト", "ko": "팟캐스트"}
EPS = {  # mehrere Folgen
    "en": "Podcast Episodes", "de": "Podcast-Folgen", "fr": "Épisodes de podcast", "es": "Episodios de podcast", "it": "Episodi podcast", "nl": "Podcastafleveringen",
    "pt": "Episódios de podcast", "pl": "Odcinki podcastu", "id": "Episode podcast", "ru": "Выпуски подкаста", "uk": "Випуски подкасту", "ar": "حلقات بودكاست",
    "he": "פרקי פודקאסט", "ja": "ポッドキャスト", "ko": "팟캐스트 에피소드"}
VIDEO = {"en": "Video", "de": "Video", "fr": "Vidéo", "es": "Vídeo", "it": "Video", "nl": "Video", "pt": "Vídeo", "pl": "Wideo", "id": "Video", "ru": "Видео", "uk": "Відео",
         "ar": "فيديو", "he": "וידאו", "ja": "動画", "ko": "영상"}
WITH_V = {"en": "with video", "de": "mit Video", "fr": "avec vidéo", "es": "con vídeo", "it": "con video", "nl": "met video", "pt": "com vídeo", "pl": "z wideo", "id": "dengan video",
          "ru": "с видео", "uk": "з відео", "ar": "مع فيديو", "he": "עם וידאו", "ja": "（動画付き）", "ko": "(영상 포함)"}
WITH_VT = {"en": "with video and transcript", "de": "mit Video und Transkript", "fr": "avec vidéo et transcription", "es": "con vídeo y transcripción", "it": "con video e trascrizione",
           "nl": "met video en transcript", "pt": "com vídeo e transcrição", "pl": "z wideo i transkrypcją", "id": "dengan video dan transkrip", "ru": "с видео и расшифровкой",
           "uk": "з відео та розшифровкою", "ar": "مع فيديو ونص مكتوب", "he": "עם וידאו ותמלול", "ja": "（動画・文字起こし付き）", "ko": "(영상·대본 포함)"}
_NOSPACE = {"ja"}   # Sprachen ohne Leerzeichen zwischen Saetzen und Zusaetzen
DUB_LABELS = ("KI-Synchronfassung", "Doblaje IA", "Doublage IA", "Doppiaggio IA", "Dublagem IA", "AI-nasynchronisatie", "Dubbing AI", "Sulih Suara AI", "ИИ-дубляж",
              "ШІ-дубляж", "دبلجة بالذكاء الاصطناعي", "דיבוב AI", "AI吹き替え", "AI 더빙")
_DUB_RX = re.compile(r"\s*[（(]\s*(?:" + "|".join(re.escape(x) for x in DUB_LABELS) + r")\s*[)）]\s*$")

# Startseite je Sprache: (Titel, Beschreibung mit {n} = Zahl der Sprachen). Marke steht vorn: sie ist hier der Suchbegriff.
HOME = {
    "de": ("M365.FM – Microsoft 365 Podcast, Blog & Erklärvideos", "Microsoft 365, Copilot, Azure und Power Platform verständlich erklärt: Podcast, Blog, Events und Videos von Microsoft MVP Mirko Peters in {n} Sprachen."),
    "fr": ("M365.FM – Podcast, blog et vidéos sur Microsoft 365", "Microsoft 365, Copilot, Azure et Power Platform expliqués simplement : podcast, blog, événements et vidéos du Microsoft MVP Mirko Peters, en {n} langues."),
    "es": ("M365.FM – Pódcast, blog y vídeos sobre Microsoft 365", "Microsoft 365, Copilot, Azure y Power Platform explicados con claridad: pódcast, blog, eventos y vídeos del Microsoft MVP Mirko Peters en {n} idiomas."),
    "it": ("M365.FM – Podcast, blog e video su Microsoft 365", "Microsoft 365, Copilot, Azure e Power Platform spiegati in modo chiaro: podcast, blog, eventi e video del Microsoft MVP Mirko Peters in {n} lingue."),
    "pt": ("M365.FM – Podcast, blog e vídeos sobre Microsoft 365", "Microsoft 365, Copilot, Azure e Power Platform explicados de forma clara: podcast, blog, eventos e vídeos do Microsoft MVP Mirko Peters em {n} idiomas."),
    "nl": ("M365.FM – Podcast, blog en uitlegvideo’s over Microsoft 365", "Microsoft 365, Copilot, Azure en Power Platform helder uitgelegd: podcast, blog, events en uitlegvideo’s van Microsoft MVP Mirko Peters in {n} talen."),
    "pl": ("M365.FM – podcast, blog i filmy o Microsoft 365", "Microsoft 365, Copilot, Azure i Power Platform po ludzku: podcast, blog, wydarzenia i filmy od Microsoft MVP Mirko Petersa w {n} językach."),
    "id": ("M365.FM – Podcast, blog & video tentang Microsoft 365", "Microsoft 365, Copilot, Azure, dan Power Platform dijelaskan jelas: podcast, blog, acara, dan video dari Microsoft MVP Mirko Peters dalam {n} bahasa."),
    "ru": ("M365.FM – подкаст, блог и видео о Microsoft 365", "Microsoft 365, Copilot, Azure и Power Platform простым языком: подкаст, блог, события и видео от Microsoft MVP Mirko Peters на {n} языках."),
    "uk": ("M365.FM – подкаст, блог і відео про Microsoft 365", "Microsoft 365, Copilot, Azure і Power Platform простою мовою: подкаст, блог, події та відео від Microsoft MVP Mirko Peters {n} мовами."),
    "ar": ("M365.FM – بودكاست ومدونة وفيديوهات عن Microsoft 365", "شرح واضح لـ Microsoft 365 وCopilot وAzure وPower Platform: بودكاست ومدونة وفعاليات وفيديوهات من خبير Microsoft MVP ميركو بيترز بـ {n} لغة."),
    "he": ("M365.FM – פודקאסט, בלוג וסרטונים על Microsoft 365", "Microsoft 365, ‏Copilot, ‏Azure ו-Power Platform בהסבר ברור: פודקאסט, בלוג, אירועים וסרטוני הסבר מאת Microsoft MVP מירקו פטרס, ב-{n} שפות."),
    "ja": ("M365.FM – Microsoft 365のポッドキャスト・ブログ・解説動画", "Microsoft 365、Copilot、Azure、Power Platformをわかりやすく解説。Microsoft MVP Mirko Petersによるポッドキャスト、ブログ、イベント、解説動画を{n}言語で。"),
    "ko": ("M365.FM – Microsoft 365 팟캐스트, 블로그, 설명 영상", "Microsoft 365, Copilot, Azure, Power Platform을 쉽게 설명합니다. Microsoft MVP Mirko Peters의 팟캐스트, 블로그, 이벤트, 설명 영상을 {n}개 언어로."),
}
HOME["en"] = ("M365.FM – Microsoft 365 Podcast, Blog & Explainer Videos", "Microsoft 365, Copilot, Azure and Power Platform explained clearly: podcast, blog, events and videos by Microsoft MVP Mirko Peters in {n} languages.")

# Podcast-Hub der Sprache (/<l>/podcast/): Beschreibung mit {n} = Zahl der Folgen
PODHUB_D = {
    "en": "Microsoft 365, Copilot and AI at work: {n} podcast episodes by Microsoft MVP Mirko Peters – listen or watch the video.",
    "de": "Microsoft 365, Copilot und KI im Arbeitsalltag: {n} Podcast-Folgen auf Deutsch von Microsoft MVP Mirko Peters – anhören oder als Video ansehen.",
    "fr": "Microsoft 365, Copilot et IA au travail : {n} épisodes de podcast en français du Microsoft MVP Mirko Peters – à écouter ou à regarder en vidéo.",
    "es": "Microsoft 365, Copilot e IA en el trabajo: {n} episodios de podcast en español del Microsoft MVP Mirko Peters – para escuchar o ver en vídeo.",
    "it": "Microsoft 365, Copilot e IA nel lavoro: {n} episodi podcast in italiano del Microsoft MVP Mirko Peters – da ascoltare o guardare in video.",
    "pt": "Microsoft 365, Copilot e IA no trabalho: {n} episódios de podcast em português do Microsoft MVP Mirko Peters – para ouvir ou assistir em vídeo.",
    "nl": "Microsoft 365, Copilot en AI op de werkvloer: {n} podcastafleveringen in het Nederlands van Microsoft MVP Mirko Peters – luisteren of als video kijken.",
    "pl": "Microsoft 365, Copilot i AI w pracy: {n} odcinków podcastu po polsku od Microsoft MVP Mirko Petersa – posłuchaj lub obejrzyj wideo.",
    "id": "Microsoft 365, Copilot, dan AI di tempat kerja: {n} episode podcast berbahasa Indonesia dari Microsoft MVP Mirko Peters – dengarkan atau tonton videonya.",
    "ru": "Подкаст на русском о Microsoft 365, Copilot и ИИ в работе от Microsoft MVP Mirko Peters. Выпусков: {n}. Слушайте или смотрите видео.",
    "uk": "Подкаст українською про Microsoft 365, Copilot і ШІ в роботі від Microsoft MVP Mirko Peters. Випусків: {n}. Слухайте або дивіться відео.",
    "ar": "Microsoft 365 وCopilot والذكاء الاصطناعي في العمل: {n} حلقة بودكاست بالعربية من خبير Microsoft MVP ميركو بيترز – استمع أو شاهد الفيديو.",
    "he": "Microsoft 365, ‏Copilot ובינה מלאכותית בעבודה: {n} פרקי פודקאסט בעברית מאת Microsoft MVP מירקו פטרס – להאזנה או לצפייה בוידאו.",
    "ja": "仕事で使うMicrosoft 365・Copilot・AI：Microsoft MVP Mirko Petersの日本語ポッドキャスト全{n}エピソード。音声でも動画でも。",
    "ko": "업무 속 Microsoft 365·Copilot·AI: Microsoft MVP Mirko Peters의 한국어 팟캐스트 {n}개 에피소드. 오디오와 영상으로 만나 보세요.",
}
# Folgenliste der Sprachfassung (/<l>/show/episodes/): Titel-Format {eps} = Plural-Wort, {lang} = Sprachname
LIST_T = "{eps} – {lang}"
# Themen-Seiten: Beschreibung mit {n}, {label}, {list}
CAT_D = {
    "en": "{n} podcast episodes on {label}, e.g. {list}. Listen or watch the explainer video.",
    "de": "{n} Podcast-Folgen zu {label}, z. B. {list}. Anhören oder als Erklärvideo ansehen.",
    "fr": "{n} épisodes de podcast sur {label}, par ex. {list}. À écouter ou à regarder en vidéo.",
    "es": "{n} episodios de podcast sobre {label}, p. ej. {list}. Para escuchar o ver en vídeo.",
    "it": "{n} episodi podcast su {label}, ad es. {list}. Da ascoltare o guardare in video.",
    "pt": "{n} episódios de podcast sobre {label}, por ex. {list}. Para ouvir ou assistir em vídeo.",
    "nl": "{n} podcastafleveringen over {label}, bijv. {list}. Luister of bekijk de uitlegvideo.",
    "pl": "{n} odcinków podcastu o: {label}, m.in. {list}. Posłuchaj lub obejrzyj wideo.",
    "id": "{n} episode podcast tentang {label}, mis. {list}. Dengarkan atau tonton video penjelasnya.",
    "ru": "Подкаст по теме «{label}»: выпусков – {n}, например {list}. Слушайте или смотрите видео.",
    "uk": "Подкаст на тему «{label}»: випусків – {n}, наприклад {list}. Слухайте або дивіться відео.",
    "ar": "{n} حلقة بودكاست عن {label}، مثل: {list}. استمع أو شاهد الفيديو التوضيحي.",
    "he": "{n} פרקי פודקאסט בנושא {label}, למשל: {list}. להאזנה או לצפייה בסרטון הסבר.",
    "ja": "{label}に関するポッドキャスト全{n}エピソード（例：{list}）。音声でも動画でも。",
    "ko": "{label} 관련 팟캐스트 {n}개 에피소드(예: {list}). 오디오와 영상으로 확인하세요.",
}
# Top-Seiten: Beschreibung mit {list}
TOP_D = {
    "en": "The most listened-to M365.FM podcast episodes of the week, e.g. {list}.",
    "de": "Die meistgehörten M365.FM-Podcast-Folgen der Woche, z. B. {list}.",
    "fr": "Les épisodes du podcast M365.FM les plus écoutés de la semaine, par ex. {list}.",
    "es": "Los episodios del pódcast M365.FM más escuchados de la semana, p. ej. {list}.",
    "it": "Gli episodi del podcast M365.FM più ascoltati della settimana, ad es. {list}.",
    "pt": "Os episódios do podcast M365.FM mais ouvidos da semana, por ex. {list}.",
    "nl": "De meest beluisterde afleveringen van de M365.FM-podcast van deze week, bijv. {list}.",
    "pl": "Najczęściej słuchane odcinki podcastu M365.FM w tym tygodniu, m.in. {list}.",
    "id": "Episode podcast M365.FM yang paling banyak didengar minggu ini, mis. {list}.",
    "ru": "Самые популярные выпуски подкаста M365.FM за неделю, например: {list}.",
    "uk": "Найпопулярніші випуски подкасту M365.FM за тиждень, наприклад: {list}.",
    "ar": "أكثر حلقات بودكاست M365.FM استماعًا هذا الأسبوع، مثل: {list}.",
    "he": "פרקי הפודקאסט M365.FM הנשמעים ביותר השבוע, למשל: {list}.",
    "ja": "今週よく聴かれたM365.FMポッドキャストのエピソード（例：{list}）。",
    "ko": "이번 주 가장 많이 들은 M365.FM 팟캐스트 에피소드(예: {list}).",
}

# ---------------------------------------------------------------- Textwerkzeuge


def wlen(s):
    """Breite in Zeichen: CJK-Zeichen (voll breit) zaehlen doppelt, weil sie in Google-Ergebnissen doppelt so viel Platz brauchen."""
    return sum(2 if unicodedata.east_asian_width(c) in "WF" else 1 for c in s)


def plain(s):
    s = _html.unescape(re.sub(r"<[^>]+>", " ", s or ""))
    s = _EMOJI.sub("", s).replace("​", "")
    return re.sub(r"\s+", " ", s).strip()


def _cut_to(s, width):
    """Laengster Anfang von s mit wlen <= width."""
    out, w = [], 0
    for ch in s:
        cw = 2 if unicodedata.east_asian_width(ch) in "WF" else 1
        if w + cw > width: break
        out.append(ch); w += cw
    return "".join(out)


def _word_cut(s, width):
    """Auf width kuerzen: an einer Wortgrenze (bzw. zeichenweise bei CJK), mit Auslassungszeichen."""
    if wlen(s) <= width: return s
    cut = _cut_to(s, width - 1)
    if " " in cut and not re.search(r"[　-鿿가-힯]", cut[-3:]):
        cut = cut.rsplit(" ", 1)[0]
    return cut.rstrip(" ,;:–—-、，") + "…"


def junk(t):
    """Platzhalter aus der maschinellen Uebersetzung ('...', '<Portuguese title>', '(awaiting the complete summary text)') - zaehlt wie leer."""
    t = plain(t)
    return len(t) < 4 or bool(re.fullmatch(r"[.…\s]*|<[^>]*>", t)) or "awaiting the complete" in t.lower()


def clean_title(raw):
    """Folgentitel ohne Dub-Kennzeichen ('(KI-Synchronfassung)' u. a.), ohne HTML, ohne haengende Satzzeichen; ' - ' wird ' – '."""
    t = plain(raw)
    t = _DUB_RX.sub("", t)
    t = re.sub(r"\s*[|–—-]\s*M365[ .]?FM(?:\s+(?:Podcast|Guide))?\s*$", "", t, flags=re.I)   # angehaengte Marke ('| M365 FM'): wird einheitlich neu gesetzt
    t = re.sub(r"\s+[-–—]\s+(Simply Explained)$", r": \1", t)
    t = re.sub(r"(?<=\w)-\s+(?=[A-Z])", ": ", t)   # 'Production- Building ...' (Tippfehler in den Podpage-Titeln)
    t = re.sub(r"\s+-\s+", " – ", t)
    return re.sub(r"[\s:;,–—-]+$", "", t).strip()


_CUT = re.compile(r"(?<=[?!？！])\s+|:\s+|：|\s+[–—]\s+|\s*[（(]|[、，]|\s+with\s+|,\s+|،\s+")


# Verbindungswoerter, vor denen ein langer Titel ohne Satzzeichen ganz (ohne Auslassungszeichen) enden darf
_CONJ = {"en": "with|for|and|in|to|on|into", "de": "mit|für|und|in|zu|auf|im|bei", "fr": "avec|pour|et|dans|sur|ou|avant|après", "es": "con|para|y|en|sobre|o|sin", "it": "con|per|e|in|su|senza",
         "pt": "com|para|e|em|sobre|sem", "nl": "met|voor|en|in|op|zonder", "pl": "z|dla|i|w|na|oraz|bez", "id": "dengan|untuk|dan|di|pada|tanpa", "ru": "для|и|с|в|на|по|без|или", "uk": "для|і|й|та|з|у|в|на|по|без", "ar": "مع|في|على|عبر|باستخدام|بدون|من", "he": "עם|עבור|ללא|על|או"}


def _heads(base, lang="en"):
    """Der volle Titel und seine Anfaenge an natuerlichen Trennstellen (nach '?', vor ':', ' – ', '(', Komma, CJK-Komma; ersatzweise vor einem
    Verbindungswort der Sprache), laengster zuerst."""
    out = [base]
    for m in _CUT.finditer(base):
        h = base[:m.start()].rstrip(" ,;:–—-、，")
        if wlen(h) >= 14 and h not in out: out.append(h)
    if max((wlen(h) for h in out[1:]), default=0) < 24:   # nur wenn kein natuerlicher Anfang taugt, ersatzweise vor einem Verbindungswort schneiden
        conj = _CONJ.get(lang) or _CONJ["en"]
        for m in re.finditer(r"\s+(?:%s)\s+" % conj, base):
            h = base[:m.start()].rstrip(" ,;:–—-")
            if wlen(h) >= 20 and h not in out: out.append(h)
    out.sort(key=wlen, reverse=True)
    return out


def _is_phrase_cut(h, base):
    """True, wenn der Schnitt nach h in einer Aufzaehlung oder vor einem Verbindungswort liegt statt an ':', '–', '(', '?' oder 'with'."""
    rest = base[len(h):].lstrip()
    return bool(rest) and not h.endswith(("?", "!", "？", "！")) and rest[0] not in ":：–—(（" and not rest.startswith("with ")


def head(raw, width=50):
    """Kernthema eines Titels fuer Aufzaehlungen in Descriptions: der laengste natuerliche Anfang (vor ':', ' – ', '?' ...) bis width, ohne '?'/'!' am Ende."""
    base = clean_title(raw)
    hs = [h for h in _heads(base) if wlen(h) <= width]
    ok = [h for h in hs if h == base or not _is_phrase_cut(h, base)] or hs
    h = ok[0] if ok else _word_cut(base, width)
    return h.rstrip("?!？！ ")


class Uniq:
    """Merkt die vergebenen Titel je Sprache, damit zwei Seiten nicht denselben <title> bekommen."""
    def __init__(self): self.seen = set()
    def free(self, lang, t): return (lang, t) not in self.seen
    def take(self, lang, t): self.seen.add((lang, t)); return t


def _suffixes(lang, kind, series):
    word = (EP if kind == "episode" else VIDEO).get(lang) or (EP if kind == "episode" else VIDEO)["en"]
    out = []
    if series: out.append(f" – {series} | {BRAND}")
    out.append(f" – {word} | {BRAND}")
    if kind == "episode": out.append(f" | {BRAND} Podcast")
    out.append(f" | {BRAND}")
    return out


def episode_title(lang, raw, series="", kind="episode", uniq=None):
    """Titel einer Podcast-Folge: Thema zuerst, dann Format (' – Podcast-Folge'), dann die Marke. Das laengste Stueck des Titels, das mit der Marke in
    TITLE_MAX passt, bleibt erhalten; bleibt Platz, kommt das Format dazu. kind: episode | video."""
    base = clean_title(raw)
    if not base: return BRAND
    sufs = _suffixes(lang, kind, series)
    cands = _heads(base, lang)
    cut = _word_cut(base, BARE_MAX - 4)   # Notnagel: Wortgrenze mit Auslassungszeichen, ohne Marke
    opts = []   # (Wertung, Titel): Laenge des Kernthemas zaehlt, die Marke gibt einen kleinen Bonus, ein Auslassungszeichen kostet
    for c in dict.fromkeys(cands + [cut]):
        score = wlen(c) - (50 if c.endswith("…") else 0) - (22 if c != base and not c.endswith("…") and _is_phrase_cut(c, base) else 0)
        if _BRAND_RX.search(c):
            if wlen(c) <= 70: opts.append((score + 8, c))
            continue
        for s in sufs:   # das reichste Suffix, das noch passt (Format vor Marke allein)
            if wlen(c) + wlen(s) <= TITLE_MAX: opts.append((score + 8, c + s)); break
        else:
            if wlen(c) <= BARE_MAX: opts.append((score, c))   # ohne Marke (page() haengt sie nicht an, wenn es ueber 62 Zeichen waere)
    opts.sort(key=lambda x: -x[0])
    for _, t in opts:
        if uniq is None or uniq.free(lang, t):
            return uniq.take(lang, t) if uniq else t
    t = opts[0][1] if opts else cut
    return uniq.take(lang, t) if uniq else t


# ---------------------------------------------------------------- Descriptions
_SENT = re.compile(r"(?<=[.!?。！？])\s+|(?<=[。！？])(?=\S)")
_LEAD = re.compile(r"^(?:in|on) this (?:episode|show|session)(?: of the m365[ .]?fm podcast)?,\s*", re.I)
_CLAUSE = re.compile(r"; |: | – | — |；|：")   # nur starke Grenzen: Schnitte an Kommas (und vor 'und'/'and') liefern oft grammatisch kaputte Saetze ('... und zeigt.')


def _sentences(t):
    return [s.strip() for s in _SENT.split(t) if s.strip()]


def _end(lang): return "。" if lang == "ja" else "."


def _clause_cut(s, lang, lo=50, hi=DESC_MAX):
    """Zu langen Satz an der letzten Teilsatz-Grenze innerhalb hi kuerzen (Ende mit Punkt); ohne Grenze an der Wortgrenze mit Auslassungszeichen."""
    cut = _cut_to(s, hi - 1)
    pos = [m.start() for m in _CLAUSE.finditer(cut)]
    for p in reversed(pos):
        c = cut[:p].rstrip(" ,;:–—-、，；：")
        if wlen(c) >= lo: return c + _end(lang)
    return _word_cut(s, hi)


def episode_desc(lang, text, *, prefer_answer=False, has_video=False, has_transcript=False, lo=DESC_MIN, hi=DESC_MAX):
    """Description einer Folge: Kernaussage in ganzen Saetzen (bevorzugt 120-155 Zeichen). prefer_answer: die Antwort steht oft im letzten Satz des
    Einleitungsabsatzes ('Diese Folge zeigt ...'), der Aufhaenger davor nur, wenn beides passt. Ist noch Platz, nennt ein Zusatz das Format und - nur wenn
    die Seite es hat - Video und Transkript."""
    t = _LEAD.sub("", re.sub(r"https?://\S+", "", plain(text))).strip()
    if not t or junk(t): return ""
    t = t[0].upper() + t[1:] if t[0].islower() else t
    ss = _sentences(t)
    n = len(ss); best = None
    for i in range(n):
        for j in range(i, n):
            s = " ".join(ss[i:j + 1]) if lang not in _NOSPACE else "".join(ss[i:j + 1])
            L = wlen(s)
            if L > hi: break
            if L < 25: continue   # Wortreste ('.', 'Von') sind keine Aussage
            key = (L >= lo, (j == n - 1) if prefer_answer else (i == 0), L)
            if best is None or key > best[0]: best = (key, s)
    if prefer_answer and (best is None or not best[0][1]) and wlen(ss[-1]) > hi:   # die Antwort ist zu lang: bis zum letzten ganzen Teilsatz, nicht nur der Aufhaenger
        cs = _clause_cut(ss[-1], lang, hi=hi)
        if not cs.endswith("…") or best is None: best = ((True, True, wlen(cs)), cs)
    if best is None:
        s = _clause_cut(ss[0], lang, hi=hi)
    else:
        s = best[1]
    if best is not None and wlen(s) < lo and n > 1:   # zu kurz: naechster Satz bis zum letzten ganzen Teilsatz dazu
        k = next((j for j in range(n) if s.endswith(ss[j]) and (j == n - 1 or True)), None)
        if k is not None and k < n - 1 and not prefer_answer:
            room = hi - wlen(s) - 1
            ext = _clause_cut(ss[k + 1], lang, lo=30, hi=room) if room >= 40 and wlen(ss[k + 1]) > room else ss[k + 1]
            if ext and not ext.endswith("…") and wlen(s) + 1 + wlen(ext) <= hi:
                s = (s + ("" if lang in _NOSPACE else " ") + ext)
    if wlen(s) < 25: return ""   # nur ein Wortrest (z. B. 'Von' nach dem Entfernen einer Adresse): der Aufrufer nimmt seinen Rueckfall
    if wlen(s) < lo and (has_video or has_transcript):
        word = EP.get(lang) or EP["en"]
        w = (WITH_VT if has_transcript else WITH_V).get(lang) or (WITH_VT if has_transcript else WITH_V)["en"]
        add = f"{word} {w}{_end(lang)}" if lang not in _NOSPACE else f"{word}{w}{_end(lang)}"
        if wlen(s) + 1 + wlen(add) <= hi: s = f"{s} {add}"
    return s


def _fit_list(template, heads, **kw):
    """Beschreibung aus Vorlage mit {list}: so viele Kernthemen, wie in DESC_MAX passen (mindestens eins, notfalls gekuerzt)."""
    for k in range(len(heads), 0, -1):
        d = template.format(list=" · ".join(heads[:k]), **kw)
        if wlen(d) <= DESC_MAX: return d
    if not heads: return template.format(list="", **kw)
    room = DESC_MAX - wlen(template.format(list="", **kw))
    return template.format(list=_word_cut(heads[0], max(20, room)), **kw)


def _fit_title(parts, lang="en"):
    """Erste Titelvariante (Marke eingeschlossen), die in TITLE_MAX passt, sonst die kuerzeste."""
    for p in parts:
        t = p if _BRAND_RX.search(p) else f"{p} | {BRAND}"
        if wlen(t) <= TITLE_MAX: return t
    p = parts[-1]
    return p if _BRAND_RX.search(p) else f"{p} | {BRAND}"


# ---- englische Hauptshow: bisherige Podpage-Felder sind teils Schablone ("X Explained | M365 FM", "Learn X in plain English: practical use cases ...")
_TPL_DESC = re.compile(r"in plain English: practical use cases|is explained in this M365 FM episode|^Quick answer", re.I)


def templated_title(t):
    """Schablonentitel der Massen-Optimierung: 'X Explained | M365 FM', 'x ... Explained:' (haengender Doppelpunkt) oder klein geschrieben."""
    t = plain(t)
    if not t: return True
    if "simply explained" in t.lower(): return False
    return bool(re.search(r"\bExplained\b.*\|\s*M365 FM\b", t) or re.search(r"\bExplained\s*:\s*$", t) or t[0].islower())


def templated_desc(d):
    return bool(_TPL_DESC.search(plain(d)))


def en_episode_meta(name, meta_title="", meta_desc="", summary="", fallback="", uniq=None, has_transcript=False):
    """(Titel, Beschreibung) einer englischen Folge. Titel: der von Hand gesetzte meta_title, ausser er ist Schablone (kleingeschrieben, 'X Explained | M365 FM',
    haengender Doppelpunkt) - dann der echte Folgentitel. Beschreibung: eine nicht-schablonenhafte meta_description, sonst der Anfang der Zusammenfassung,
    sonst der erste Absatz der Show Notes; eine Schablone nur, wenn nichts anderes da ist."""
    base = name if (templated_title(meta_title) or not plain(meta_title)) else meta_title
    t = episode_title("en", base, uniq=uniq)
    cands = [x for x in (meta_desc, summary, fallback) if plain(x) and not templated_desc(x)]
    text = cands[0] if cands else meta_desc or fallback
    d = episode_desc("en", text, has_transcript=has_transcript, has_video=False, hi=160 if text is meta_desc and not templated_desc(meta_desc) else DESC_MAX)
    return t, d


# ---------------------------------------------------------------- Seitentypen
def home_meta(lang, n):
    """(Titel, Beschreibung) der Sprach-Startseite /<l>/."""
    t, d = HOME.get(lang) or HOME["en"]
    return t, d.format(n=n)


def podcast_hub_meta(lang, series_title, n):
    """(Titel, Beschreibung) von /<l>/podcast/. series_title = Titel der Show (shows_seo.json: Marke + Thema + Sprache), bleibt, wenn er passt."""
    t = plain(series_title)
    if wlen(t) > BARE_MAX:   # mit Marke im Titel laesst page() bis 70 Zeichen unveraendert
        for h in _heads(t):
            if wlen(h) <= BARE_MAX: t = h; break
        else: t = _word_cut(t, BARE_MAX)
    return t, (PODHUB_D.get(lang) or PODHUB_D["en"]).format(n=n)


def episode_list_meta(lang, n, lang_name):
    """(Titel, Beschreibung) der Folgenliste einer Sprachfassung (/<l>/show/episodes/): Plural-Wort, Sprache, Marke; Beschreibung wie der Podcast-Hub."""
    t = _fit_title([f"{(EPS.get(lang) or EPS['en'])} – {lang_name}", f"{(EPS.get(lang) or EPS['en'])}"])
    return t, (PODHUB_D.get(lang) or PODHUB_D["en"]).format(n=n)


def top_meta(lang, label, heading, titles):
    """(Titel, Beschreibung) der Top-Seite. heading = 'Top 10 der Woche 2.–8. Nov. 2026' (oder None), titles = Folgentitel der ersten Plaetze."""
    eps = EPS.get(lang) or EPS["en"]
    cands = []
    if heading: cands += [f"{heading}: {eps}", heading]
    cands += [f"{label}: {eps}", label]
    t = _fit_title(cands)
    return t, _fit_list(TOP_D.get(lang) or TOP_D["en"], [head(x) for x in titles[:3]])


def category_meta(lang, label, n, titles):
    """(Titel, Beschreibung) einer Themen-Seite (/<l>/c/<thema>/)."""
    eps = EPS.get(lang) or EPS["en"]
    t = _fit_title([f"{label} – {eps}", f"{label}: {eps}", label])
    return t, _fit_list(CAT_D.get(lang) or CAT_D["en"], [head(x) for x in titles[:3]], n=n, label=label)


# ---- englische Show-Seiten (site_podpage.py: /show/...)
def show_home_meta(name, descr):
    """Hub /show/: Marke, Thema, Format. descr = Beschreibung aus podcast.json."""
    d = episode_desc("en", descr)
    return "M365.FM Podcast: Microsoft 365, Copilot, Azure & AI", d


def episodes_list_meta(n):
    return ("All Episodes of the M365.FM Podcast",
            f"Browse all {n} episodes of the M365.FM podcast on Microsoft 365, Copilot, Azure and AI – with show notes, guests and links to listen.")


def guests_list_meta(n):
    return "Podcast Guests of the M365.FM Podcast", f"Meet the {n} guests of the M365.FM podcast and find the episodes they appear in."


def guest_meta(name, job="", bio="", n_eps=0):
    """Gastseite: 'Wer ist X?' - Name, Rolle, was man dort findet. Beschreibung: Name und Rolle zuerst, dann Bio-Anfang oder (nur gezaehlte) Folgen."""
    name = plain(name); job = plain(job)
    eps = f"{n_eps} podcast episode{'s' if n_eps != 1 else ''}" if n_eps else ""
    b = episode_desc("en", bio, lo=60, hi=DESC_MAX - 40)
    if re.match(r"(?:I|I’m|I'm|My|We|Our)\b", b): b = ""   # Ich-Biografien lesen sich neben dem Namen falsch
    cands = []
    for who in ([f"{name} ({job})"] if job and wlen(job) <= 60 else []) + [name]:
        if b: cands.append(f"{who} on the M365.FM podcast. {b}")
        cands.append(f"{who} is a guest of the M365.FM podcast. Read the profile and listen to " + (f"{eps} with {name}." if eps else "the episode."))
        cands.append(f"{who} is a guest of the M365.FM podcast – profile and episodes.")
    d = next((c for c in cands if wlen(c) <= DESC_MAX), cands[-1])
    title = _fit_title([f"{name}: Podcast Guest & Episodes", f"{name} – Podcast Guest", name])
    return title, d


def hosts_meta(names):
    names = [plain(n) for n in names if plain(n)]
    who = names[0] + (" and the other hosts" if len(names) > 1 else "") if names else "the hosts"
    return "Hosts of the M365.FM Podcast", f"Who hosts the M365.FM podcast? Meet {who} and see what the show covers on Microsoft 365, Azure and AI."


def sponsors_meta():
    return "Sponsors of the M365.FM Podcast", "The companies that support the M365.FM podcast about Microsoft 365, Copilot, Azure and AI."


def reviews_meta():
    return "Listener Reviews of the M365.FM Podcast", "What listeners say about the M365.FM podcast: ratings and reviews from Apple Podcasts and the M365.FM community."


def listen_meta():
    return "How to Listen to the M365.FM Podcast", "Listen to the M365.FM podcast on Apple Podcasts, Spotify, YouTube and other platforms – all links in one place."


# ---- Show-Netzwerk (site_shows.py: /shows/)
def network_episode_meta(lang, title, show_title, descr, uniq=None):
    return episode_title(lang, title, series=plain(show_title), uniq=uniq), episode_desc(lang, descr, has_video=False) or plain(title)


def network_show_meta(lang, show_title, author, descr, n_eps):
    """Show-Seite eines Netzwerk-Podcasts: Titel + 'Podcast von <Autor>', Beschreibung = Kern der Show."""
    st = plain(show_title); au = plain(author)
    t = _fit_title([f"{st} – Podcast by {au}", f"{st} – Podcast", st])
    d = episode_desc(lang, descr, lo=90)
    add = f"{n_eps} episode{'s' if n_eps != 1 else ''}" if n_eps else ""
    if d and add and wlen(d) + wlen(add) + 3 <= DESC_MAX: d = f"{d} {add[0].upper() + add[1:]}."
    return t, d or f"{st}: podcast by {au} on the M365.FM network."


def network_hub_meta(n_shows, n_eps):
    return "Podcasts of the M365.FM Network", f"{n_shows} podcasts of Microsoft community members with {n_eps} episodes – listen, read the transcripts and follow the shows on M365.FM."


# ---- Livestream (site_live.py)
LIVE_T = {"en": "M365 Show Live: Microsoft 365 Livestreams on YouTube", "de": "M365 Show Live: Microsoft-365-Livestreams auf YouTube"}


def live_hub_meta(lang, lede):
    return _fit_title([LIVE_T.get(lang) or LIVE_T["en"]]), episode_desc(lang, lede, lo=90)


def live_stream_meta(lang, title, descr):
    return episode_title(lang, title, series="M365 Show", kind="video"), episode_desc(lang, descr) or plain(title)


# ---- Community-Folgen und -Videos (site_podcast.py, site_video.py)
BY = {"en": "by", "de": "von"}


def community_item_meta(lang, kind, title, author, descr, uniq=None):
    """Folge oder Video eines Mitglieds: Thema zuerst, dann Format und Marke; Beschreibung nennt den Autor, wenn Platz ist."""
    t = episode_title(lang, title, kind="episode" if kind == "podcast" else "video", uniq=uniq)
    d = episode_desc(lang, descr, lo=90, hi=DESC_MAX)
    by = f"{(BY.get(lang) or BY['en'])} {plain(author)}"
    if not d: return t, f"{plain(title)} – {by}."[:DESC_MAX]
    return t, d
