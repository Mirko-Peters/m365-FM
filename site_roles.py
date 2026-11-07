"""Sichtbare Rollen-Abzeichen fuer Redaktion und Moderation (Editor, Moderator): farbiger Ring um das Profilbild mit kleinem Symbol,
Chip neben dem Namen mit Tooltip und Link zur Erklaerseite /rollen/, Rolle im Person-JSON-LD. Eine Stelle fuer alle Orte, an denen Personen
erscheinen (Profil, Autorenkasten, Mitglieder- und Teamlisten, Event-Speaker); das Skript assets/page.js nutzt dieselben Texte fuer Kommentare."""
from html import escape as esc

ROLES = ("editor", "moderator")
_BY_HANDLE = {}
_SCOPE = {}   # Profil-Handle -> Themen-IDs eines Fach-Editors
SUBJ = {"en": "Subject editor for", "de": "Fach-Editor für", "es": "Editor especializado en", "fr": "Éditeur spécialisé en", "it": "Editor specializzato in", "pt": "Editor especializado em", "nl": "Vakeditor voor", "pl": "Redaktor tematyczny:", "id": "Editor spesialis untuk", "ru": "Редактор по темам:", "uk": "Редактор за темами:", "ar": "محرر متخصص في", "he": "עורך תחום:", "ja": "専門エディター:", "ko": "전문 에디터:"}   # Profil-Handle -> "editor" | "moderator" (vom Seitenbau mit den Profildaten gefuellt)

# Chip-Name bleibt in jeder Sprache gleich (Eigenname der Rolle), Tooltip und Beschreibung je Sprache.
TT = {
    "en": {"editor": "Editor: reviews and improves content on M365.FM", "moderator": "Moderator: keeps comments and answers respectful", "more": "What do these roles mean?", "title": "Editors and moderators at M365.FM"},
    "de": {"editor": "Editor: prüft und verbessert Inhalte auf M365.FM", "moderator": "Moderator: sorgt für respektvolle Kommentare und Antworten", "more": "Was bedeuten diese Rollen?", "title": "Editoren und Moderatoren bei M365.FM"},
    "es": {"editor": "Editor: revisa y mejora los contenidos de M365.FM", "moderator": "Moderador: cuida que los comentarios y respuestas sean respetuosos", "more": "¿Qué significan estos roles?", "title": "Editores y moderadores en M365.FM"},
    "fr": {"editor": "Éditeur : relit et améliore les contenus de M365.FM", "moderator": "Modérateur : veille au respect dans les commentaires et réponses", "more": "Que signifient ces rôles ?", "title": "Éditeurs et modérateurs sur M365.FM"},
    "it": {"editor": "Editor: controlla e migliora i contenuti di M365.FM", "moderator": "Moderatore: cura il rispetto in commenti e risposte", "more": "Cosa significano questi ruoli?", "title": "Editor e moderatori su M365.FM"},
    "pt": {"editor": "Editor: revê e melhora os conteúdos do M365.FM", "moderator": "Moderador: zela por comentários e respostas respeitosos", "more": "O que significam estes papéis?", "title": "Editores e moderadores no M365.FM"},
    "nl": {"editor": "Editor: controleert en verbetert content op M365.FM", "moderator": "Moderator: bewaakt respectvolle reacties en antwoorden", "more": "Wat betekenen deze rollen?", "title": "Editors en moderators bij M365.FM"},
    "pl": {"editor": "Redaktor: sprawdza i poprawia treści w M365.FM", "moderator": "Moderator: dba o uprzejme komentarze i odpowiedzi", "more": "Co oznaczają te role?", "title": "Redaktorzy i moderatorzy w M365.FM"},
    "id": {"editor": "Editor: memeriksa dan memperbaiki konten di M365.FM", "moderator": "Moderator: menjaga komentar dan jawaban tetap sopan", "more": "Apa arti peran ini?", "title": "Editor dan moderator di M365.FM"},
    "ru": {"editor": "Редактор: проверяет и улучшает материалы M365.FM", "moderator": "Модератор: следит за уважительными комментариями и ответами", "more": "Что означают эти роли?", "title": "Редакторы и модераторы M365.FM"},
    "uk": {"editor": "Редактор: перевіряє й покращує матеріали M365.FM", "moderator": "Модератор: стежить за шанобливими коментарями та відповідями", "more": "Що означають ці ролі?", "title": "Редактори й модератори M365.FM"},
    "ar": {"editor": "محرر: يراجع محتوى M365.FM ويحسّنه", "moderator": "مشرف: يحافظ على احترام التعليقات والإجابات", "more": "ماذا تعني هذه الأدوار؟", "title": "المحررون والمشرفون في M365.FM"},
    "he": {"editor": "עורך: בודק ומשפר תוכן ב-M365.FM", "moderator": "מנחה: שומר על תגובות ותשובות מכבדות", "more": "מה משמעות התפקידים?", "title": "עורכים ומנחים ב-M365.FM"},
    "ja": {"editor": "エディター: M365.FM のコンテンツを確認・改善します", "moderator": "モデレーター: コメントや回答が丁寧に保たれるよう見守ります", "more": "これらの役割について", "title": "M365.FM のエディターとモデレーター"},
    "ko": {"editor": "에디터: M365.FM 콘텐츠를 검토하고 개선합니다", "moderator": "모더레이터: 댓글과 답변이 정중하게 유지되도록 돕습니다", "more": "이 역할은 무엇인가요?", "title": "M365.FM 에디터와 모더레이터"},
}
NAME = {"editor": "Editor", "moderator": "Moderator"}
# Symbole als Inline-SVG: Stift (Editor), Schild (Moderator); dekorativ, der Name steckt im aria-label des Umschlags
ICON = {
    "editor": '<svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true" focusable="false"><path fill="currentColor" d="M3 17.25V21h3.75L17.8 9.94l-3.75-3.75L3 17.25zm17.7-10.2a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>',
    "moderator": '<svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 2 4 5v6c0 5 3.4 9.6 8 11 4.6-1.4 8-6 8-11V5l-8-3zm-1 14-3.5-3.5 1.4-1.4L11 13.2l4.1-4.1 1.4 1.4L11 16z"/></svg>',
}
CSS = (":root{--role-editor:var(--ac);--role-mod:#0f766e}@media (prefers-color-scheme:dark){:root{--role-mod:#2dd4bf}}:root[data-theme=dark]{--role-mod:#2dd4bf}:root[data-theme=light]{--role-mod:#0f766e}"
       ".rav{position:relative;display:inline-block;padding:3px;border-radius:50%;line-height:0;vertical-align:middle;background:var(--role-editor);animation:rshine 1.4s ease-out 1}.rav-moderator{background:var(--role-mod)}"
       ".rav>img{border-radius:50%;display:block;border:2px solid var(--bg);box-sizing:border-box}"
       ".rav-i{position:absolute;inset-inline-end:-4px;bottom:-4px;width:22px;height:22px;border-radius:50%;background:var(--role-editor);color:#fff;border:2px solid var(--bg);display:flex;align-items:center;justify-content:center}.rav-moderator .rav-i{background:var(--role-mod)}"
       ".rav-s{padding:2px}.rav-s .rav-i{width:15px;height:15px;inset-inline-end:-3px;bottom:-3px;border-width:1.5px}.rav-s .rav-i svg{width:9px;height:9px}"
       ".rchip{display:inline-flex;align-items:center;gap:.3em;font:600 .72rem/1.5 inherit;padding:0 .6em;border-radius:1em;background:var(--role-editor);color:#fff;text-decoration:none;vertical-align:middle;margin-inline-start:.4em;white-space:nowrap}.rchip-moderator{background:var(--role-mod)}"
       ".rchip:hover,.rchip:focus-visible{text-decoration:underline}"
       "@keyframes rshine{from{filter:brightness(1.7) saturate(1.4)}to{filter:none}}@media (prefers-reduced-motion:reduce){.rav{animation:none}}")


def set_people(people):
    """Rollen aus dem Profil-Export merken (nur Editor und Moderator, nichts anderes wird sichtbar)."""
    _BY_HANDLE.clear(); _SCOPE.clear()
    for p in people or []:
        r = role_of(p)
        if r and p.get("handle"):
            _BY_HANDLE[p["handle"]] = r
            if r == "editor" and p.get("scope"):
                _SCOPE[p["handle"]] = [e for e in p["scope"] if isinstance(e, str)]


def role_of(x):
    r = (x or {}).get("role")
    return r if r in ROLES else ""


def role_for(handle):
    return _BY_HANDLE.get(handle, "")


def _t(lang):
    return TT.get(lang) or TT["en"]


def pfx_for(lang):
    return "" if lang == "en" else lang + "/"


def about_url(BASE, lang):
    return f"{BASE}/rollen/" if lang == "en" else f"{BASE}/{lang}/rollen/"


def scope_names(scope):
    """Themen-IDs -> Namen (Entitaeten, falls geladen), sonst die IDs."""
    try:
        from site_learn import ENTS
    except Exception:
        ENTS = {}
    return [ENTS[e]["name"] if e in ENTS and isinstance(ENTS[e], dict) and ENTS[e].get("name") else e for e in scope or []]


def tooltip(lang, role, scope=None):
    t = _t(lang)
    if role == "editor" and scope:
        return f'{SUBJ.get(lang) or SUBJ["en"]} {", ".join(scope_names(scope))}'
    return t[role]


def chip(BASE, lang, role, scope=None):
    """Chip 'Editor'/'Moderator' neben dem Namen: Tooltip (title) und Link zur Erklaerung; Fach-Editor: Tooltip nennt die Themen."""
    if role not in ROLES:
        return ""
    t = dict(_t(lang)); t[role] = tooltip(lang, role, scope)
    return (f'<a class="rchip rchip-{role}" href="{about_url(BASE, lang)}#{role}" title="{esc(t[role])}" data-role="{role}">{ICON[role]}<span>{NAME[role]}</span>'
            f'<span class="sr-only" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)"> – {esc(t[role])}</span></a>')


def avatar(img_html, role, lang="en", small=False):
    """Ring + Symbol um ein fertiges <img>-Tag (ohne eigenes Float): Rollen-Name als Textalternative."""
    if role not in ROLES or not img_html:
        return img_html
    return (f'<span class="rav rav-{role}{" rav-s" if small else ""}" role="group" aria-label="{NAME[role]}">{img_html}'
            f'<span class="rav-i" role="img" aria-label="{NAME[role]}">{ICON[role]}</span></span>')


def chip_for(BASE, lang, handle):
    return chip(BASE, lang, role_for(handle), _SCOPE.get(handle))


def ld_role(BASE, role):
    """Rolle bei M365.FM fuer das Person-JSON-LD (memberOf mit roleName); der Organisationsknoten /#org bleibt unveraendert."""
    return {"@type": "OrganizationRole", "memberOf": {"@id": f"{BASE}/#org"}, "roleName": NAME[role]} if role in ROLES else None


def add_to_person_ld(BASE, node, role):
    """Haengt die Rolle an memberOf an, ohne bestehende Eintraege (Microsoft-Programme) oder hasOccupation zu ueberschreiben."""
    r = ld_role(BASE, role)
    if not r:
        return node
    cur = node.get("memberOf")
    node["memberOf"] = (cur if isinstance(cur, list) else [cur] if cur else []) + [r]
    return node


def js_cfg(BASE, lang):
    """Texte und Link fuer die Chips in Kommentaren und Bestenlisten (assets/community.js); dieselben Quellen wie die statischen Seiten."""
    t = _t(lang)
    return {"editor": t["editor"], "moderator": t["moderator"], "subject": SUBJ.get(lang) or SUBJ["en"], "url": about_url(BASE, lang)}


def about_page_body(BASE, lang):
    t = _t(lang)
    sec = "".join(f'<section id="{r}"><h2>{ICON[r].replace("12", "20")} {NAME[r]}</h2><p>{esc(t[r])}.</p></section>' for r in ROLES)
    return f'<main class="wrap" id="main" style="max-width:44em"><h1>{esc(t["title"])}</h1>{sec}</main>'
