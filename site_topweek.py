"""Top 10 der Vorwoche: Wochenbezeichnung je Sprache, JSON-LD (ItemList) und die englische Seite /top/.

Daten: data/top.json (sync_spreaker.py, Wochen-Schnappschuss Mo-So, Feld "week" = ISO-Woche). Die Seiten der Dub-Sprachen
(/<lang>/top/) baut generate_site.py, die englische Seite (Hauptshow, Folgen unter /show/episodes/<slug>/) baut build_en().
Englische Seiten ohne Sprachpfad liegen auf Wurzelebene wie /press/, /updates/, /accessibility/ -> /top/ (gleicher Pfad wie /de/top/)."""
import html
from datetime import date
import site_meta_podcast as MP   # suchintent-freundliche <title>/meta description

N_TOP = 10      # Eintraege auf der Top-Seite
N_TEASER = 5    # Eintraege im Teaser (Startseiten der Sprachen)
EN_REL = "top/"

# Monatskuerzel je Sprache (Januar..Dezember)
MON = {
    "en": "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(),
    "de": "Jan. Feb. März Apr. Mai Juni Juli Aug. Sept. Okt. Nov. Dez.".split(),
    "es": "ene. feb. mar. abr. may. jun. jul. ago. sept. oct. nov. dic.".split(),
    "fr": "janv. févr. mars avr. mai juin juil. août sept. oct. nov. déc.".split(),
    "it": "gen feb mar apr mag giu lug ago set ott nov dic".split(),
    "pt": "jan. fev. mar. abr. mai. jun. jul. ago. set. out. nov. dez.".split(),
    "nl": "jan feb mrt apr mei jun jul aug sep okt nov dec".split(),
    "pl": "sty lut mar kwi maj cze lip sie wrz paź lis gru".split(),
    "id": "Jan Feb Mar Apr Mei Jun Jul Agu Sep Okt Nov Des".split(),
    "ru": "янв. февр. мар. апр. мая июн. июл. авг. сент. окт. нояб. дек.".split(),
    "uk": "січ. лют. бер. квіт. трав. черв. лип. серп. вер. жовт. лист. груд.".split(),
    "ar": "يناير فبراير مارس أبريل مايو يونيو يوليو أغسطس سبتمبر أكتوبر نوفمبر ديسمبر".split(),
    "he": "ינו׳ פבר׳ מרץ אפר׳ מאי יוני יולי אוג׳ ספט׳ אוק׳ נוב׳ דצמ׳".split(),
}

# Ueberschrift der Top-Seite: {n} = Anzahl (hoechstens 10), {r} = Zeitraum
HEAD = {
    "en": "Top {n} of the week {r}", "de": "Top {n} der Woche {r}", "es": "Top {n} de la semana {r}", "fr": "Top {n} de la semaine {r}",
    "it": "Top {n} della settimana {r}", "pt": "Top {n} da semana {r}", "nl": "Top {n} van de week {r}", "pl": "Top {n} tygodnia {r}",
    "id": "Top {n} minggu {r}", "ru": "Топ-{n} недели {r}", "uk": "Топ-{n} тижня {r}", "ar": "أفضل {n} حلقات الأسبوع {r}",
    "he": "{n} הפרקים המובילים בשבוע {r}", "ja": "週間トップ{n}（{r}）", "ko": "주간 TOP {n} ({r})",
}
# Hinweis unter der Ueberschrift: Quelle und Aktualisierung
NOTE = {
    "en": "Ranked by Spreaker plays and downloads, Monday to Sunday. Updated every Tuesday.",
    "de": "Rangfolge nach Wiedergaben und Downloads bei Spreaker, Montag bis Sonntag. Aktualisiert jeden Dienstag.",
    "es": "Clasificación según reproducciones y descargas en Spreaker, de lunes a domingo. Se actualiza cada martes.",
    "fr": "Classement selon les écoutes et téléchargements sur Spreaker, du lundi au dimanche. Mis à jour chaque mardi.",
    "it": "Classifica per ascolti e download su Spreaker, da lunedì a domenica. Aggiornata ogni martedì.",
    "pt": "Classificação por reproduções e downloads no Spreaker, de segunda a domingo. Atualizado toda terça-feira.",
    "nl": "Gerangschikt op afspelingen en downloads bij Spreaker, maandag tot en met zondag. Elke dinsdag bijgewerkt.",
    "pl": "Ranking według odtworzeń i pobrań w Spreaker, od poniedziałku do niedzieli. Aktualizacja w każdy wtorek.",
    "id": "Peringkat berdasarkan putaran dan unduhan di Spreaker, Senin sampai Minggu. Diperbarui setiap Selasa.",
    "ru": "Рейтинг по прослушиваниям и загрузкам в Spreaker, с понедельника по воскресенье. Обновляется каждый вторник.",
    "uk": "Рейтинг за прослуховуваннями та завантаженнями в Spreaker, з понеділка по неділю. Оновлюється щовівторка.",
    "ar": "الترتيب حسب مرات التشغيل والتنزيل على Spreaker، من الاثنين إلى الأحد. يُحدَّث كل ثلاثاء.",
    "he": "הדירוג לפי השמעות והורדות ב-Spreaker, מיום שני עד יום ראשון. מתעדכן בכל יום שלישי.",
    "ja": "Spreakerでの再生数とダウンロード数（月曜〜日曜）によるランキング。毎週火曜日に更新。",
    "ko": "Spreaker 재생 및 다운로드 수 기준 순위(월요일~일요일). 매주 화요일 업데이트.",
}


def _d(s):
    try:
        return date.fromisoformat(str(s)[:10])
    except (TypeError, ValueError):
        return None


def period(topdata):
    """(von, bis) der Top-Daten als date; alter 7-Tage-Stand ohne "to" nutzt "week_end". Fehlt etwas: (None, None)."""
    a, b = _d((topdata or {}).get("from")), _d((topdata or {}).get("to") or (topdata or {}).get("week_end"))
    return (a, b) if a and b and a <= b else (None, None)


def snapshot_date(topdata):
    """Datum des Schnappschusses (dateModified, Sitemap-lastmod): Zeitpunkt des Abrufs, sonst Wochenende."""
    d = _d((topdata or {}).get("updated")) or period(topdata)[1]
    return d.isoformat() if d else None


def fmt_range(lang, a, b):
    """Zeitraum kurz und lokal: 'Nov 2–8, 2026', '2.–8. Nov. 2026', '2026年11月2日～8日' (Monats- und Jahreswechsel ausgeschrieben)."""
    if lang in ("ja", "ko"):
        y, m, d = ("年", "月", "日") if lang == "ja" else ("년 ", "월 ", "일")
        sep = "～" if lang == "ja" else "~"
        left = f"{a.year}{y}{a.month}{m}{a.day}{d}"
        right = (f"{b.year}{y}" if b.year != a.year else "") + (f"{b.month}{m}" if (b.month, b.year) != (a.month, a.year) else "") + f"{b.day}{d}"
        return (left + sep + right).strip()
    mon = MON.get(lang, MON["en"])
    ma, mb = mon[a.month - 1], mon[b.month - 1]
    if lang == "en":
        if a.year != b.year:
            return f"{ma} {a.day}, {a.year} – {mb} {b.day}, {b.year}"
        return f"{ma} {a.day}–{b.day}, {a.year}" if a.month == b.month else f"{ma} {a.day} – {mb} {b.day}, {a.year}"
    dot = "." if lang == "de" else ""
    pre = "ב" if lang == "he" else ""
    if a.year != b.year:
        return f"{a.day}{dot} {pre}{ma} {a.year} – {b.day}{dot} {pre}{mb} {b.year}"
    if a.month != b.month:
        return f"{a.day}{dot} {pre}{ma} – {b.day}{dot} {pre}{mb} {a.year}"
    return f"{a.day}{dot}–{b.day}{dot} {pre}{ma} {a.year}"


def heading(lang, n, topdata):
    """'Top 10 der Woche 2.–8. Nov. 2026' (lokalisiert); ohne Zeitraum None."""
    a, b = period(topdata)
    if not a:
        return None
    return HEAD.get(lang, HEAD["en"]).format(n=n, r=fmt_range(lang, a, b))


def note(lang):
    return NOTE.get(lang, NOTE["en"])


def item_list_ld(name, url, in_lang, date_modified, entries, crumbs):
    """CollectionPage mit ItemList (position, url, name) und BreadcrumbList. entries: [(url, name)], crumbs: [(name, url)]."""
    page = {"@context": "https://schema.org", "@type": "CollectionPage", "name": name, "url": url, "inLanguage": in_lang,
            "mainEntity": {"@type": "ItemList", "name": name, "itemListOrder": "https://schema.org/ItemListOrderDescending", "numberOfItems": len(entries),
                           "itemListElement": [{"@type": "ListItem", "position": n + 1, "url": u, "name": t} for n, (u, t) in enumerate(entries)]}}
    if date_modified:
        page["dateModified"] = date_modified
    return [page, {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": n + 1, "name": t, "item": u} for n, (t, u) in enumerate(crumbs)]}]


def en_items(topdata, by_sid, n=N_TOP):
    """Englische Top-Liste: Zeilen der Hauptshow (top.json 'en', Spreaker-Folgen-ID) -> Folgen der Hauptshow mit Seite
    (site_podpage.episode_index()['by_sid']). Nur Folgen mit Wiedergaben > 0, Rangfolge wie in top.json."""
    out, seen = [], set()
    for r in ((topdata or {}).get("langs") or {}).get("en") or []:
        sid = str(r.get("episode_id") or "")
        it = by_sid.get(sid)
        if it and (r.get("score") or 0) > 0 and sid not in seen:
            out.append(it); seen.add(sid)
        if len(out) >= n:
            break
    return out


def build_en(g, items, topdata, label, alts, switch=None):
    """Englische Top-Seite /top/ schreiben. g: BASE, write, page, header (fertiges Kopf-HTML), footer, esc, short.
    alts: hreflang-Cluster der indexierbaren Top-Seiten, switch: Sprachumschalter (alle Top-Seiten).
    -> (url, feed) oder (None, []), wenn keine echten Daten da sind."""
    if not items:
        return None, []
    BASE, esc = g["BASE"], g.get("esc", html.escape)
    u = f"{BASE}/{EN_REL}"
    h1 = heading("en", len(items), topdata) or label
    a, b = period(topdata)
    rows = "".join(f'<div class="row"><a href="{esc(x["url"])}" title="{esc(x["e"]["title"])}"><h3>{n + 1}. {esc(x["e"]["title"])}</h3></a>'
                   + (f'<p>{esc(g["short"](x.get("sum") or "", 150))}</p>' if x.get("sum") else "") + "</div>" for n, x in enumerate(items))
    crumbs = [("M365.FM", f"{BASE}/"), ("M365.FM Show", f"{BASE}/show/"), (label, u)]
    ld = item_list_ld(h1, u, "en", snapshot_date(topdata), [(x["url"], x["e"]["title"]) for x in items], crumbs)
    body = f"""{g["header"]}
<main class="wrap"><nav class="crumbs" aria-label="breadcrumb"><a href="{BASE}/">M365.FM</a> / <a href="{BASE}/show/">Show</a></nav>
<div class="kicker">★ English{(" · " + esc(fmt_range("en", a, b))) if a else ""}</div><h1>{esc(h1)}</h1><p class="mut">{esc(note("en"))}</p>
<div class="list">{rows}</div>
<p style="margin-top:1.6em"><a class="btn" href="{BASE}/show/episodes/">All episodes →</a></p></main>{g["footer"]("en")}"""
    _mt, desc = MP.top_meta("en", label, h1 if a else None, [x["e"]["title"] for x in items[:3]])
    g["write"](f"{EN_REL}index.html", g["page"]("en", _mt, desc, u, body, alts, ld, og_type="website", switch=switch or alts))
    feed = [{"rank": n + 1, "title": x["e"]["title"], "url": x["url"], "episode": int(x["sid"]) if str(x.get("sid", "")).isdigit() else x.get("sid")} for n, x in enumerate(items)]
    return u, feed
