"""SEO-Titel und Meta-Descriptions fuer Entitaeten, Lernbereich und Verzeichnis (Bereich A, Auftrag "suchintent-freundlich").

Reine Funktionen ohne Seitenbau: site_entities.py, site_learn.py und site_directory.py rufen sie auf, tests/test_meta_entities.py prueft sie
mit echten Datensaetzen aus data/. Die Titel haben keine Marke: page() haengt " | M365.FM" an (seo_title). Ziel: Titel samt Marke <= 60 Zeichen,
Description 120-155 Zeichen, nie mitten im Satz abgeschnitten. Schema.org-Namen bleiben unberuehrt (nur <title> und meta description).

Suchabsicht je Seitentyp:
  Begriff, Produkt, Plattform, Medium  -> "Was ist X?" (Definition zuerst)
  Zertifizierung                       -> "Was ist X?" + Zertifizierungsueberblick
  Person                               -> "Wer ist X?" (Profil, Rolle)
  Firma, Event, Branche, Job, Kategorie -> Name + was die Seite zeigt
  Hubs                                 -> Inhalt + Nutzen (Zahlen nur aus den Daten)
Feste Textbausteine stehen in den Tabellen TOK (Entitaeten, alle 15 Community-Sprachen), PATH und LEARN (alle 15 Sprachen) sowie EN_DE
(nur en/de: Entitaets-Hub, Glossar, Trainer, Verzeichnis). Fehlt eine Sprache oder ein Baustein, gilt Englisch; die Funktionen fuer die nur in
en/de gepflegten Seiten liefern fuer andere Sprachen None, dann bleibt der bisherige Text der Seite (diese Seiten sind dort noindex)."""
import re

BRAND_LEN = len(" | M365.FM")
TITLE_MAX = 60            # Ziel inkl. Marke
DESC_LO, DESC_HI = 120, 155
_STOP = {"and", "or", "of", "the", "with", "for", "to", "in", "a", "an", "by", "on", "at", "as", "und", "oder", "von", "mit", "für", "zu", "im", "der", "die", "das", "ein", "eine"}

# ---------------------------------------------------------------- Bausteine Entitaeten (15 Sprachen)
# what/who: Fragekopf mit {n}; who "{n}:" = kein Fragekopf (Sprachen mit Geschlechtsformen). def/use/eps/prof/role/comp/evt/ind/job/ovr/ex/cert: Woerter.
# amp/com: Verbinder ("a, b & c"); hs: Leerraum nach dem Kopf; more_eps/more: Satz fuer kurze Beschreibungen.
_K = "what who def use eps prof role comp evt ind job ovr ex cert amp com hs more_eps more".split()


def _t(*v):
    d = dict(zip(_K, v))
    d.setdefault("hs", " ")
    return d


TOK = {
    "en": _t("What Is {n}?", "Who Is {n}?", "Definition", "Use Cases", "Episodes", "Profile", "Role", "Company Profile", "Event Overview", "Industry Overview", "Role Overview", "Overview",
             "Examples", "Certification Overview", " & ", ", ", " ", "Key facts, related topics and podcast episodes on M365.FM.", "Key facts and related topics on M365.FM."),
    "de": _t("Was ist {n}?", "Wer ist {n}?", "Definition", "Einsatz", "Folgen", "Profil", "Rolle", "Firmenprofil", "Event-Überblick", "Branchenüberblick", "Rollenprofil", "Überblick",
             "Beispiele", "Zertifizierung im Überblick", " & ", ", ", " ", "Fakten, verwandte Themen und Podcast-Folgen auf M365.FM.", "Fakten und verwandte Themen auf M365.FM."),
    "fr": _t("Qu'est-ce que {n} ?", "Qui est {n} ?", "Définition", "Cas d'usage", "Épisodes", "Profil", "Rôle", "Profil de l'entreprise", "Présentation de l'événement", "Aperçu du secteur", "Aperçu du rôle",
             "Aperçu", "Exemples", "Aperçu de la certification", " & ", ", ", " ", "Faits clés, sujets liés et épisodes du podcast sur M365.FM.", "Faits clés et sujets liés sur M365.FM."),
    "es": _t("¿Qué es {n}?", "¿Quién es {n}?", "Definición", "Casos de uso", "Episodios", "Perfil", "Rol", "Perfil de la empresa", "Resumen del evento", "Resumen del sector", "Resumen del puesto",
             "Resumen", "Ejemplos", "Resumen de la certificación", " & ", ", ", " ", "Datos clave, temas relacionados y episodios del pódcast en M365.FM.", "Datos clave y temas relacionados en M365.FM."),
    "it": _t("Cos'è {n}?", "Chi è {n}?", "Definizione", "Casi d'uso", "Episodi", "Profilo", "Ruolo", "Profilo aziendale", "Panoramica dell'evento", "Panoramica del settore", "Panoramica del ruolo",
             "Panoramica", "Esempi", "Panoramica della certificazione", " & ", ", ", " ", "Fatti chiave, argomenti correlati ed episodi del podcast su M365.FM.", "Fatti chiave e argomenti correlati su M365.FM."),
    "nl": _t("Wat is {n}?", "Wie is {n}?", "Definitie", "Toepassingen", "Afleveringen", "Profiel", "Rol", "Bedrijfsprofiel", "Evenement in het kort", "Sector in het kort", "Rol in het kort",
             "Overzicht", "Voorbeelden", "Certificering in het kort", " & ", ", ", " ", "Kerngegevens, verwante onderwerpen en podcastafleveringen op M365.FM.", "Kerngegevens en verwante onderwerpen op M365.FM."),
    "pt": _t("O que é {n}?", "Quem é {n}?", "Definição", "Casos de uso", "Episódios", "Perfil", "Função", "Perfil da empresa", "Visão geral do evento", "Visão geral do setor", "Visão geral da função",
             "Visão geral", "Exemplos", "Visão geral da certificação", " & ", ", ", " ", "Fatos principais, tópicos relacionados e episódios do podcast no M365.FM.", "Fatos principais e tópicos relacionados no M365.FM."),
    "pl": _t("Czym jest {n}?", "Kim jest {n}?", "Definicja", "Zastosowania", "Odcinki", "Profil", "Rola", "Profil firmy", "Przegląd wydarzenia", "Przegląd branży", "Przegląd roli",
             "Przegląd", "Przykłady", "Przegląd certyfikacji", " & ", ", ", " ", "Najważniejsze fakty, powiązane tematy i odcinki podcastu w M365.FM.", "Najważniejsze fakty i powiązane tematy w M365.FM."),
    "id": _t("Apa Itu {n}?", "Siapa {n}?", "Definisi", "Kasus Penggunaan", "Episode", "Profil", "Peran", "Profil Perusahaan", "Ringkasan Acara", "Ringkasan Industri", "Ringkasan Peran",
             "Ringkasan", "Contoh", "Ringkasan Sertifikasi", " & ", ", ", " ", "Fakta utama, topik terkait, dan episode podcast di M365.FM.", "Fakta utama dan topik terkait di M365.FM."),
    "ru": _t("Что такое {n}?", "{n}:", "Определение", "применение", "выпуски", "Профиль", "роль", "Профиль компании", "Обзор мероприятия", "Обзор отрасли", "Обзор роли", "Обзор",
             "примеры", "Обзор сертификации", " и ", ", ", " ", "Ключевые факты, связанные темы и выпуски подкаста на M365.FM.", "Ключевые факты и связанные темы на M365.FM."),
    "uk": _t("Що таке {n}?", "{n}:", "Визначення", "застосування", "епізоди", "Профіль", "роль", "Профіль компанії", "Огляд події", "Огляд галузі", "Огляд ролі", "Огляд",
             "приклади", "Огляд сертифікації", " і ", ", ", " ", "Ключові факти, пов’язані теми й епізоди подкасту на M365.FM.", "Ключові факти та пов’язані теми на M365.FM."),
    "ar": _t("ما هو {n}؟", "من هو {n}؟", "التعريف", "حالات الاستخدام", "الحلقات", "الملف الشخصي", "الدور", "ملف الشركة", "نظرة على الفعالية", "نظرة على القطاع", "نظرة على الدور",
             "نظرة عامة", "أمثلة", "نظرة على الشهادة", " و", "، ", " ", "حقائق أساسية ومواضيع ذات صلة وحلقات البودكاست على M365.FM.", "حقائق أساسية ومواضيع ذات صلة على M365.FM."),
    "he": _t("מהו {n}?", "{n}:", "הגדרה", "שימושים", "פרקים", "פרופיל", "תפקיד", "פרופיל החברה", "סקירת האירוע", "סקירת התחום", "סקירת התפקיד", "סקירה", "דוגמאות", "סקירת ההסמכה",
             " ו", ", ", " ", "עובדות מרכזיות, נושאים קשורים ופרקי פודקאסט ב-M365.FM.", "עובדות מרכזיות ונושאים קשורים ב-M365.FM."),
    "ja": _t("{n}とは？", "{n}:", "定義", "活用例", "エピソード", "プロフィール", "役割", "企業プロフィール", "イベント概要", "業界の概要", "職種の概要", "概要", "例", "認定資格の概要",
             "・", "・", "", "主な事実、関連トピック、ポッドキャストのエピソードをM365.FMで。", "主な事実と関連トピックをM365.FMで。"),
    "ko": _t("{n}란?", "{n}:", "정의", "활용 사례", "에피소드", "프로필", "역할", "기업 프로필", "행사 개요", "산업 개요", "직무 개요", "개요", "예시", "자격증 개요",
             " 및 ", ", ", " ", "핵심 사실, 관련 주제, 팟캐스트 에피소드를 M365.FM에서 확인하세요.", "핵심 사실과 관련 주제를 M365.FM에서 확인하세요."),
}


def tok(lang):
    return {**TOK["en"], **TOK.get(lang, {})}


def _join(t, parts):
    parts = [p for p in parts if p]
    if len(parts) < 2:
        return "".join(parts)
    return t["com"].join(parts[:-1]) + t["amp"] + parts[-1]


def _pick(cands, name=""):
    """Erste Variante, die samt Marke in TITLE_MAX passt; sonst die kuerzeste (seo_title laesst bis 70 Zeichen ohne Marke zu); ist selbst die ueber 70, nur der Name."""
    for c in cands:
        if len(c) + BRAND_LEN <= TITLE_MAX:
            return c
    c = min(cands, key=len)
    return c if len(c) <= 70 or not name else name


# ---------------------------------------------------------------- Description
def _clean(s):
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", s or "")).strip()


def lead_text(text, hi=DESC_HI):
    """Anfang von text als ganze Saetze bis hi Zeichen. Ist schon der erste Satz laenger: Schnitt an Komma/Semikolon/Gedankenstrich (mit Punkt), sonst an einer Wortgrenze mit '…'."""
    s = _clean(text)
    if len(s) <= hi:
        return s
    out = ""
    for sent in re.split(r"(?<=[.!?。])\s+", s):
        cand = f"{out} {sent}".strip()
        if len(cand) > hi:
            break
        out = cand
    if out:
        return out
    cut = s[:hi]
    best = 0
    for m in re.finditer(r"[,;](?=\s)|\s[–—-](?=\s)|(?<=\s)(?=(?:and|that|which|in which|with|using|by|for|to|from|where|when|while|because|including|as|so|through|via|across|under|into|against|und|mit|für|durch|bei|wobei|sowie|damit|wenn|um|während|weil|sodass|zur|zum|indem)\s)", cut):
        head = cut[:m.start()].rstrip(",;–—- ")
        punct = cut[m.start():m.start() + 1] in ",;–—-"
        if len(head) >= (45 if punct else 60) and head.rsplit(" ", 1)[-1].lower() not in _STOP and m.start() > best:
            best = m.start()   # laengster Anfang, der an einer Satzfuge endet (Komma, Semikolon, Strich oder vor Nebensatz-/Anschlusswort)
    if best:
        return cut[:best].rstrip(",;–—- ") + "."
    return cut[:hi - 1].rsplit(" ", 1)[0].rstrip(",;:–—-") + "…"


def build_desc(lead, more="", prefix="", lo=DESC_LO, hi=DESC_HI):
    """prefix (Name, falls die Beschreibung ihn nicht nennt) + Anfang der Beschreibung (ganze Saetze) + more, solange es unter hi bleibt und lead kuerzer als lo ist."""
    pre = f"{prefix} – " if prefix else ""
    body = lead_text(lead, hi - len(pre)) if lead else ""
    out = pre + body
    if more and len(out) < lo and len(out) + 1 + len(more) <= hi:
        out = f"{out} {more}".strip()
    return out


# ---------------------------------------------------------------- Entitaeten
_CODE = re.compile(r"\b([A-Z]{1,3}-\d{3})\b")


def _name(e):
    """Anzeigename: bei Zertifizierungen ohne das Praefix 'Microsoft Certified:'."""
    n = e["name"].strip()
    return re.sub(r"^Microsoft Certified:\s*", "", n) if e.get("type") == "cert" else n


def _short(n):
    """Name ohne angehaengte Klammer ('Threads (Azure AI Foundry Agent Service)' -> 'Threads'), nur wenn danach noch etwas uebrig ist."""
    x = re.sub(r"\s*\([^()]*\)\s*$", "", n).strip()
    return x if len(x) >= 3 else n


def entity_title(lang, e, n_eps=0, dup=0, keep=False):
    t = tok(lang)
    typ = e.get("type")
    n = _name(e)
    if dup:
        n = f"{n} ({dup + 1})"   # gleicher Name unter zwei Kennungen (4 Paare): der zweite Eintrag bekommt eine Zahl, sonst identische Titel
    hs = t["hs"]
    eps = [t["eps"]] if n_eps else []

    def q(head, *parts):   # Kopf + Bausteine; der Folgen-Baustein haengt hinten dran, wenn die Seite Folgen hat
        parts = [*parts, *eps]
        return f"{head}{hs}{_join(t, parts)}" if parts else head

    def col(name, *parts):   # "Name: Bausteine"
        return f"{name}: {_join(t, [*parts, *eps])}"
    what = lambda x: t["what"].format(n=x)
    ns = n if (dup or keep) else _short(n)   # keep: ein anderer Eintrag haette gekuerzt denselben Namen
    if typ in ("concept", "product", "platform", "media"):
        c = [q(what(n), t["def"], t["use"]), q(what(n), t["def"]), f"{what(n)}{hs}{_join(t, [t['def'], t['use']])}", f"{what(n)}{hs}{t['def']}", what(n)]   # mit Folgen: voll, ohne Anwendungsfaelle, ohne Folgen
        if ns != n:   # zu langer Name: ohne Klammerzusatz
            c += [f"{what(ns)}{hs}{_join(t, [t['def'], t['use']])}", f"{what(ns)}{hs}{t['def']}", what(ns)]
    elif typ == "cert":
        code = (_CODE.findall(n) or [""])[-1]
        c = [q(what(n), t["cert"]), f"{what(n)}{hs}{t['cert']}", what(n)]
        if code:   # sehr lange Namen: nach der Pruefungsnummer suchen die Leute (AZ-104), der volle Name steht in der Beschreibung
            c += [f"{what(code)}{hs}{t['cert']}", what(code)]
    elif typ == "person":
        who = t["who"].format(n=n)
        c = [q(who, t["prof"], t["role"]), f"{who}{hs}{_join(t, [t['prof'], t['role']])}", f"{who}{hs}{t['prof']}"]
    elif typ == "org":
        c = [col(n, t["comp"]), f"{n}: {t['comp']}"] + ([f"{ns}: {t['comp']}"] if ns != n else [])
    elif typ == "event":
        c = [col(n, t["evt"]), f"{n}: {t['evt']}"]
    elif typ == "industry":
        c = [col(n, t["ind"], t["use"]), f"{n}: {_join(t, [t['ind'], t['use']])}", f"{n}: {t['ind']}"]
    elif typ == "job":
        c = [col(n, t["job"]), f"{n}: {t['job']}"]
    else:   # category und Unbekanntes
        c = [col(n, t["ovr"], t["ex"]), f"{n}: {_join(t, [t['ovr'], t['ex']])}", f"{n}: {t['ovr']}"]
    return _pick(c, n)


def entity_desc(lang, e, desc, n_eps=0, type_label=""):
    t = tok(lang)
    n = _name(e)
    core = re.sub(r"\s*\(.*?\)", "", n).strip().lower()
    d = _clean(desc)
    if not d:
        d = f"{n} ({type_label})." if type_label else f"{n}."
    dl = d.lower()
    w = core.split()
    named = bool(core) and (core in dl or (len(w) >= 3 and w[0] in dl and w[-1] in dl))   # Personen mit zweitem Vornamen: Vor- und Nachname genuegen
    pre = "" if named else n
    if len(pre) > 70 and e.get("type") == "cert" and _CODE.findall(pre):
        pre = _CODE.findall(pre)[-1]   # Zertifizierung mit sehr langem Namen: Pruefungsnummer als Anfang
    return build_desc(d, t["more_eps"] if n_eps else t["more"], pre)


def name_flags(ents):
    """{id: (dup, keep)}: dup = Rang unter Eintraegen mit gleichem Namen (0 = einzigartig oder erster nach Kennung, 1 = zweiter ...; der Titel bekommt dann '(2)'),
    keep = gleicher Name nach dem Kuerzen um die Klammer (Titel bleibt ungekuerzt)."""
    full, short = {}, {}
    for e in sorted(ents, key=lambda x: x["id"]):
        full.setdefault(_name(e).lower(), []).append(e["id"])
        short.setdefault(_short(_name(e)).lower(), []).append(e["id"])
    return {e["id"]: (full[_name(e).lower()].index(e["id"]), len(short[_short(_name(e)).lower()]) > 1) for e in ents}


def entity_meta(lang, e, desc, n_eps=0, flags=(0, False), type_label=""):
    """(title ohne Marke, description) einer Entitaetsseite. desc = Kurzbeschreibung in der Sprache der Seite, n_eps = Zahl der Folgen auf der Seite,
    flags = name_flags(...)[id]."""
    return entity_title(lang, e, n_eps, *flags), entity_desc(lang, e, desc, n_eps, type_label)


# ---------------------------------------------------------------- Lernpfade und Lern-Hub (15 Sprachen)
PATH = {   # p1: Titel lang, p2: Titel kurz, pa/pb: Description (pb mit {n} Folgen)
    "en": ("{cat} Learning Path: Episodes in Order", "{cat}: Learning Path", "Learn {cat} step by step: podcast episodes in a sensible order, with progress tracking in your browser.", "Episodes in this path: {n}."),
    "de": ("Lernpfad {cat}: Folgen in Reihenfolge", "Lernpfad: {cat}", "{cat} Schritt für Schritt lernen: Podcast-Folgen in sinnvoller Reihenfolge, mit Fortschrittsanzeige in deinem Browser.", "Folgen in diesem Pfad: {n}."),
    "fr": ("Parcours {cat} : épisodes dans l'ordre", "Parcours : {cat}", "Apprenez {cat} pas à pas : épisodes du podcast dans un ordre logique, avec suivi de progression dans votre navigateur.", "Épisodes dans ce parcours : {n}."),
    "es": ("Ruta {cat}: episodios en orden", "Ruta de aprendizaje: {cat}", "Aprende {cat} paso a paso: episodios del pódcast en un orden lógico y seguimiento de tu progreso en el navegador.", "Episodios en esta ruta: {n}."),
    "it": ("Percorso {cat}: episodi in ordine", "Percorso: {cat}", "Impara {cat} passo dopo passo: episodi del podcast in ordine logico, con il tuo avanzamento salvato nel browser.", "Episodi in questo percorso: {n}."),
    "nl": ("Leerpad {cat}: afleveringen op volgorde", "Leerpad: {cat}", "Leer {cat} stap voor stap: podcastafleveringen in een logische volgorde, met voortgang die in je browser wordt bijgehouden.", "Afleveringen in dit leerpad: {n}."),
    "pt": ("Trilha {cat}: episódios em ordem", "Trilha: {cat}", "Aprenda {cat} passo a passo: episódios do podcast em ordem lógica, com acompanhamento do progresso no navegador.", "Episódios nesta trilha: {n}."),
    "pl": ("Ścieżka {cat}: odcinki po kolei", "Ścieżka: {cat}", "Poznawaj {cat} krok po kroku: odcinki podcastu w logicznej kolejności, z zapisem postępów w przeglądarce.", "Odcinki na tej ścieżce: {n}."),
    "id": ("Jalur Belajar {cat}: Episode Berurutan", "Jalur Belajar: {cat}", "Pelajari {cat} selangkah demi selangkah: episode podcast dalam urutan yang masuk akal, dengan progres tersimpan di browser.", "Episode di jalur ini: {n}."),
    "ru": ("Маршрут «{cat}»: выпуски по порядку", "Маршрут: {cat}", "Изучайте «{cat}» шаг за шагом: выпуски подкаста в удобном порядке, прогресс сохраняется в браузере.", "Выпусков в маршруте: {n}."),
    "uk": ("Маршрут «{cat}»: епізоди по порядку", "Маршрут: {cat}", "Вивчайте «{cat}» крок за кроком: епізоди подкасту в зручному порядку, прогрес зберігається в браузері.", "Епізодів у маршруті: {n}."),
    "ar": ("مسار {cat}: الحلقات بالترتيب", "مسار: {cat}", "تعلّم {cat} خطوة بخطوة: حلقات البودكاست بترتيب منطقي مع حفظ تقدمك في المتصفح.", "عدد الحلقات في هذا المسار: {n}."),
    "he": ("מסלול {cat}: הפרקים לפי הסדר", "מסלול: {cat}", "ללמוד {cat} צעד אחר צעד: פרקי פודקאסט בסדר הגיוני, עם שמירת ההתקדמות בדפדפן.", "מספר הפרקים במסלול: {n}."),
    "ja": ("{cat}の学習パス：エピソードを順番に", "学習パス：{cat}", "{cat}を順を追って学べます。ポッドキャストのエピソードを最適な順に並べ、進捗はブラウザに保存されます。", "このパスのエピソード数：{n}。"),
    "ko": ("{cat} 학습 경로: 에피소드 순서대로", "학습 경로: {cat}", "{cat}을(를) 단계별로 배워요: 논리적인 순서의 팟캐스트 에피소드와 브라우저에 저장되는 진행률.", "이 경로의 에피소드 수: {n}."),
}

LEARN = {   # (Titel, Description) des Lern-Hubs mit Glossar, Lernpfaden und Trainer
    "en": ("Learn Microsoft 365: Glossary, Paths & Quizzes", "Free tools to learn Microsoft 365, Copilot, Azure and security: a glossary, guided learning paths built from podcast episodes and a practice quiz trainer."),
    "de": ("Microsoft 365 lernen: Glossar, Lernpfade & Quiz", "Kostenlos Microsoft 365, Copilot, Azure und Sicherheit lernen: Glossar, geführte Lernpfade aus Podcast-Folgen und ein Übungs-Trainer mit Quizfragen."),
    "fr": ("Apprendre Microsoft 365 : glossaire, parcours, quiz", "Outils gratuits pour apprendre Microsoft 365, Copilot, Azure et la sécurité : glossaire, parcours guidés tirés du podcast et entraîneur de quiz."),
    "es": ("Aprende Microsoft 365: glosario, rutas y quiz", "Herramientas gratuitas para aprender Microsoft 365, Copilot, Azure y seguridad: glosario, rutas guiadas con episodios del pódcast y entrenador de quiz."),
    "it": ("Imparare Microsoft 365: glossario, percorsi e quiz", "Strumenti gratuiti per imparare Microsoft 365, Copilot, Azure e sicurezza: glossario, percorsi guidati con gli episodi del podcast e allenatore di quiz."),
    "nl": ("Microsoft 365 leren: woordenlijst & leerpaden", "Gratis leren over Microsoft 365, Copilot, Azure en beveiliging: woordenlijst, begeleide leerpaden met podcastafleveringen en een oefentrainer."),
    "pt": ("Aprender Microsoft 365: glossário, trilhas e quiz", "Ferramentas gratuitas para aprender Microsoft 365, Copilot, Azure e segurança: glossário, trilhas guiadas com episódios do podcast e treinador de quiz."),
    "pl": ("Nauka Microsoft 365: słownik, ścieżki i quizy", "Darmowe narzędzia do nauki Microsoft 365, Copilota, Azure i bezpieczeństwa: słownik, ścieżki nauki z odcinków podcastu i trener quizów."),
    "id": ("Belajar Microsoft 365: glosarium, jalur & kuis", "Alat gratis untuk belajar Microsoft 365, Copilot, Azure, dan keamanan: glosarium, jalur belajar dari episode podcast, dan pelatih kuis latihan."),
    "ru": ("Изучение Microsoft 365: глоссарий и маршруты", "Бесплатные инструменты для изучения Microsoft 365, Copilot, Azure и безопасности: глоссарий, учебные маршруты из выпусков подкаста и тренажёр с вопросами."),
    "uk": ("Вивчення Microsoft 365: глосарій і маршрути", "Безкоштовні інструменти для вивчення Microsoft 365, Copilot, Azure і безпеки: глосарій, навчальні маршрути з епізодів подкасту та тренажер із запитаннями."),
    "ar": ("تعلّم Microsoft 365: مصطلحات ومسارات واختبارات", "أدوات مجانية لتعلّم Microsoft 365 وCopilot وAzure والأمان: قاموس مصطلحات ومسارات تعلّم من حلقات البودكاست ومدرّب أسئلة للتمرين."),
    "he": ("לימוד Microsoft 365: מילון מונחים ומסלולי למידה", "כלים חינמיים ללימוד Microsoft 365, ‏Copilot, ‏Azure ואבטחה: מילון מונחים, מסלולי למידה מפרקי הפודקאסט ומאמן שאלות לתרגול."),
    "ja": ("Microsoft 365を学ぶ：用語集・学習パス・クイズ", "Microsoft 365、Copilot、Azure、セキュリティを無料で学べるツール。用語集、ポッドキャストのエピソードから作った学習パス、練習用クイズトレーナー。"),
    "ko": ("Microsoft 365 배우기: 용어집·학습 경로·퀴즈", "Microsoft 365, Copilot, Azure, 보안을 무료로 배우는 도구: 용어집, 팟캐스트 에피소드로 구성한 학습 경로, 연습용 퀴즈 트레이너."),
}


def path_meta(lang, cat, n):
    p1, p2, pa, pb = PATH.get(lang) or PATH["en"]
    title = _pick([p1.format(cat=cat), p2.format(cat=cat)], cat)
    return title, build_desc(f"{pa.format(cat=cat)} {pb.format(n=n)}")


def learn_meta(lang):
    t, d = LEARN.get(lang) or LEARN["en"]
    return t, build_desc(d)


# ---------------------------------------------------------------- nur en/de: Hubs, Glossar, Trainer, Verzeichnis
def _num(lang, n):
    return f"{n:,}" if lang == "en" else f"{n:,}".replace(",", ".")


def _floor100(n):
    return max(n // 100 * 100, 0)


def entities_hub_meta(lang, n):
    """Entitaets-Hub /entity/ (en, de). n = Zahl der Eintraege."""
    if lang == "en":
        return ("Microsoft Topics Explained: Products & Concepts",
                build_desc(f"Look up {_num(lang, n)} Microsoft products, concepts, certifications and companies, each with a definition, key facts and related topics."))
    if lang == "de":
        return ("Microsoft-Themen erklärt: Produkte & Konzepte",
                build_desc(f"{_num(lang, n)} Microsoft-Produkte, Konzepte, Zertifizierungen und Firmen nachschlagen, jeweils mit Definition, Fakten und verwandten Themen."))
    return None


def glossary_meta(lang, n_terms):
    """Glossar-Hub (en, de). Die Zahl ist auf volle Hundert abgerundet ('1.000+'), aus der Zahl der Glossareintraege."""
    n = _floor100(n_terms)
    big = n >= 100
    if lang == "en":
        return (f"Microsoft 365 Glossary: {_num(lang, n)}+ Terms Explained" if big else "Microsoft 365 Glossary: Terms Explained",
                build_desc("Short, clear definitions of " + (f"{_num(lang, n)}+ " if big else "") + "Microsoft 365, Copilot, Azure, Power Platform and security terms, each linked to its page with facts and related topics."))
    if lang == "de":
        return (f"Microsoft-365-Glossar: {_num(lang, n)}+ Begriffe erklärt" if big else "Microsoft-365-Glossar: Begriffe erklärt",
                build_desc("Kurze, klare Definitionen von " + (f"über {_num(lang, n)} " if big else "") + "Begriffen rund um Microsoft 365, Copilot, Azure, Power Platform und Sicherheit, jeweils mit Link zur Seite mit Fakten und verwandten Themen."))
    return None


def trainer_meta(lang):
    if lang == "en":
        return ("Microsoft 365 Quiz Trainer: Practice Questions", build_desc("Practise with random quiz questions from the podcast episodes in this language, with explanations and a printable certificate of completion."))
    if lang == "de":
        return ("Microsoft 365 Quiz-Trainer: Übungsfragen", build_desc("Übe mit zufälligen Quizfragen aus den Podcast-Folgen in dieser Sprache, mit Erklärungen und einem druckbaren Teilnahmezertifikat."))
    return None


def learn_en_meta():
    """Englischer Lern-Hub /learn/ (Glossar, Entitaeten, Mitglieder, Firmen, Events; ohne Lernpfade)."""
    return ("Learn Microsoft 365: Glossary, Topics & Experts",
            build_desc("Free resources to learn Microsoft 365, Copilot, Azure and security: the glossary, the topic database and the experts, companies and events of the community."))


_CNT = {"en": {"expert": ("expert", "experts"), "company": ("company", "companies"), "event": ("event", "events")},
        "de": {"expert": ("Expert:in", "Expert:innen"), "company": ("Firma", "Firmen"), "event": ("Event", "Events")}}


def _parts(lang, ex, co, ev, with_ms=True):
    """'7 Microsoft 365 experts, 3 companies and 2 events' (nur was es gibt); de: '7 Microsoft-365-Expert:innen, 3 Firmen und 2 Events'."""
    c = _CNT[lang]
    out = []
    for n, k in ((ex, "expert"), (co, "company"), (ev, "event")):
        if not n:
            continue
        w = c[k][0 if n == 1 else 1]
        if k == "expert" and with_ms:
            w = ("Microsoft-365-" + w) if lang == "de" else ("Microsoft 365 " + w)
        out.append(f"{n} {w}")
    if len(out) < 2:
        return "".join(out)
    return ", ".join(out[:-1]) + (" und " if lang == "de" else " and ") + out[-1]


def directory_hub_meta(lang, ex, co, ev):
    """Verzeichnis-Hub (en, de) mit Zahlen aus den Eintraegen."""
    if lang == "en":
        p = _parts(lang, ex, co, ev, with_ms=False)
        return ("Microsoft 365 Experts & Companies Directory",
                build_desc((f"Find Microsoft 365 experts, companies and events: {p} from the Microsoft community, filterable by topic, country and city." if p else
                            "Find Microsoft 365 experts, companies and events in the Microsoft community, filterable by topic, country and city.")))
    if lang == "de":
        p = _parts(lang, ex, co, ev, with_ms=False)
        return ("Microsoft-365-Verzeichnis: Expert:innen & Firmen",
                build_desc((f"Microsoft-365-Expert:innen, Firmen und Events finden: {p} der Microsoft-Community, filterbar nach Thema, Land und Stadt." if p else
                            "Microsoft-365-Expert:innen, Firmen und Events der Microsoft-Community finden, filterbar nach Thema, Land und Stadt.")))
    return None


def _noun_phrase(lang, ex, co):
    if lang == "de":
        return "Expert:innen & Firmen" if ex and co else "Firmen" if co and not ex else "Expert:innen"
    return "Experts & Companies" if ex and co else "Companies" if co and not ex else "Experts"


def directory_place_title(lang, kind, label, place, ex, co):
    """Titel einer Land-, Stadt- oder Themenseite des Verzeichnisses (en, de), sonst None. Stadtseiten nennen das Land mit, damit gleiche Stadtnamen nicht denselben Titel tragen."""
    if lang not in ("en", "de"):
        return None
    full = _noun_phrase(lang, ex, co)
    only_ex = ("Experts" if lang == "en" else "Expert:innen") if ex else full
    if kind == "country":
        return _pick([f"Microsoft 365 {full} in {place}", f"M365 {full} in {place}", f"Microsoft 365 {only_ex} in {place}"], place)
    if kind == "city":
        return _pick([f"Microsoft 365 {full} in {label}, {place}", f"M365 {full} in {label}, {place}", f"Microsoft 365 {only_ex} in {label}, {place}",
                      f"M365 {only_ex} in {label}, {place}", f"Microsoft 365 {only_ex} in {label}"], label)
    if lang == "de":
        return _pick([f"{label}: {full} in {place}", f"{label}: {only_ex} in {place}", f"{label}: {only_ex}"], label)
    return _pick([f"{label} {full} in {place}", f"{label} {only_ex} in {place}", f"{label} {only_ex}"], label)


def directory_place_desc(lang, kind, label, place, ex, co, ev, intro=""):
    """Description einer Land-/Stadt-/Themenseite (en, de): Anfang des eigenen Einleitungstexts, sonst Satz mit den Zahlen der Eintraege; None fuer andere Sprachen."""
    if lang not in ("en", "de"):
        return None
    if intro and len(_clean(intro)) >= 80:
        return build_desc(intro)
    where = place if kind == "country" else f"{label}, {place}" if kind == "city" else place
    if kind == "topic":
        p = _parts(lang, ex, co, 0, with_ms=False)
        if lang == "de":
            return build_desc(f"{p} zu {label} in {where} finden: Profile, Themen und Events der Microsoft-365-Community." if p else f"Profile, Themen und Events zu {label} in {where} aus der Microsoft-365-Community.")
        return build_desc(f"Find {p} for {label} in {where}: profiles, topics and events from the Microsoft 365 community." if p else f"Profiles, topics and events for {label} in {where} from the Microsoft 365 community.")
    p = _parts(lang, ex, co, ev)
    if lang == "de":
        return build_desc(f"{p} in {where} finden: Profile, Themen und Events der Microsoft-365-Community." if p else f"Profile, Themen und Events in {where} aus der Microsoft-365-Community.")
    return build_desc(f"Find {p} in {where}: profiles, topics and events from the Microsoft 365 community." if p else f"Profiles, topics and events in {where} from the Microsoft 365 community.")
