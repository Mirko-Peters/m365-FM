"""Unterstützen-Seite /support/ (EN) und /de/unterstuetzen/ (DE): freiwillige Unterstützung per PayPal, nach Zielen mit Fortschrittsbalken.
Daten: data/support.json (PayPal.me-Name, Ziele mit Betrag, Turnus und bisher eingegangener Summe). Solange kein PayPal-Name eingetragen ist,
bleibt die Seite noindex, ohne Sitemap-Eintrag und ohne Footer-Link; die Buttons zeigen dann „PayPal-Link folgt“.
Bewusst „Unterstützung“, nicht „Spende“: M365.FM ist keine gemeinnützige Organisation, es gibt keine Zuwendungsbestätigung."""
import html
import json
from pathlib import Path

ROOT = Path(__file__).parent
DATA = ROOT / "data" / "support.json"
PATH = {"en": "support/", "de": "de/unterstuetzen/"}

T = {
    "en": dict(
        title="Support M365.FM – help fund the next projects", kicker="Support M365.FM", h1="Support M365.FM",
        desc="Support M365.FM with a voluntary contribution via PayPal: running costs, the Android and iPhone apps and the next community projects – with transparent goals and progress.",
        lede="M365.FM is free: the podcast in 15 languages, the community, Expert Connect, the directory and the MVP tracker. If you want to help keep it that way, you can support a concrete goal below. Every goal shows what it costs and how much has come in.",
        monthly="per month", yearly="per year", once="one-time", raised="{raised} of {amount} raised", reached="Goal reached – thank you!",
        support="Support with {amount}", other="Choose your own amount", soon="PayPal link coming soon",
        how_h="How it works", how=["Pick a goal and pay via PayPal – any amount helps.", "Please add the goal (for example “Android apps”) as a note in PayPal so we can book it.",
                                   "Want to be listed? Write “public: <your name>” in the PayPal note. Without it you appear as “Anonymous”.",
                                   "We update the progress by hand, usually within a few days.", "Monthly goals start again at zero each month."],
        note_h="Good to know", note="This is a voluntary contribution to M365.FM, not a donation to a charity: there is no donation receipt and you receive nothing in return. Payments are processed by PayPal under PayPal's privacy policy.",
        wall_h="Who has supported M365.FM", wall_none="Be the first supporter!", anon="Anonymous", col_name="Supporter", col_sum="Total", col_goals="Goals", col_last="Latest",
        locked="Starts once {names} {verb} reached.", and_="and", is_="is", are_="are",
        updated="Last updated", privacy="Privacy policy", sponsor="Companies: become a sponsor", nogoals="New goals will be published here soon.",
    ),
    "de": dict(
        title="M365.FM unterstützen – die nächsten Projekte mitfinanzieren", kicker="M365.FM unterstützen", h1="M365.FM unterstützen",
        desc="Unterstütze M365.FM freiwillig per PayPal: laufende Kosten, die Android- und iPhone-App und die nächsten Community-Projekte – mit transparenten Zielen und Fortschritt.",
        lede="M365.FM ist kostenlos: der Podcast in 15 Sprachen, die Community, Expert Connect, das Verzeichnis und der MVP-Tracker. Wenn du helfen willst, dass das so bleibt, kannst du unten ein konkretes Ziel unterstützen. Jedes Ziel zeigt, was es kostet und wie viel schon zusammengekommen ist.",
        monthly="pro Monat", yearly="pro Jahr", once="einmalig", raised="{raised} von {amount} erreicht", reached="Ziel erreicht – danke!",
        support="Mit {amount} unterstützen", other="Eigenen Betrag wählen", soon="PayPal-Link folgt",
        how_h="So funktioniert's", how=["Ziel auswählen und per PayPal zahlen – jeder Betrag hilft.", "Bitte das Ziel (z. B. „Android-Apps“) als Mitteilung in PayPal angeben, damit wir es zuordnen können.",
                                        "Du willst genannt werden? Schreib „öffentlich: <dein Name>“ in die PayPal-Mitteilung. Ohne diesen Hinweis erscheinst du als „Anonym“.",
                                        "Den Fortschritt tragen wir von Hand nach, meist innerhalb weniger Tage.", "Monatliche Ziele beginnen jeden Monat wieder bei null."],
        note_h="Gut zu wissen", note="Das ist eine freiwillige Unterstützung von M365.FM, keine Spende an eine gemeinnützige Organisation: Es gibt keine Zuwendungsbestätigung und keine Gegenleistung. Die Zahlung wickelt PayPal nach seinen Datenschutzbestimmungen ab.",
        wall_h="Wer M365.FM unterstützt hat", wall_none="Sei die erste Person, die unterstützt!", anon="Anonym", col_name="Unterstützer:in", col_sum="Summe", col_goals="Ziele", col_last="Zuletzt",
        locked="Startet, sobald {names} erreicht {verb}.", and_="und", is_="ist", are_="sind",
        updated="Stand", privacy="Datenschutzerklärung", sponsor="Für Unternehmen: Sponsor werden", nogoals="Neue Ziele veröffentlichen wir hier in Kürze.",
    ),
}

CSS = """<style>
.sup-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;margin:26px 0}
.sup-card{background:var(--card);border:1px solid var(--bd);padding:20px;display:grid;gap:10px;align-content:start}
.sup-card h2{margin:0;font-size:1.35rem}.sup-card p{margin:0}
.sup-amt{font:600 2rem/1 "Barlow Condensed",sans-serif}.sup-amt small{font-size:.95rem;color:var(--mut);font-weight:500;margin-inline-start:6px}
.sup-bar{height:10px;background:var(--bd);overflow:hidden}.sup-bar span{display:block;height:100%;background:var(--ac)}
.sup-meta{color:var(--mut);font-size:.92rem}.sup-wall{width:100%;border-collapse:collapse;margin:12px 0 28px}.sup-wall th,.sup-wall td{text-align:start;padding:8px 10px;border-bottom:1px solid var(--bd)}.sup-wall td.n{font-variant-numeric:tabular-nums;white-space:nowrap}.sup-card.locked{opacity:.6}.sup-ok{color:#2f6b3a;font-weight:600}
.sup-btns{display:flex;flex-wrap:wrap;gap:8px}.sup-btns .btn[aria-disabled=true]{opacity:.55;pointer-events:none}
@media(prefers-color-scheme:dark){.sup-ok{color:#91d59a}}
</style>"""


def load():
    try:
        return json.loads(DATA.read_text("utf-8"))
    except (OSError, ValueError):
        return {"goals": []}


def money(v, cur):
    v = float(v or 0)
    s = f"{v:,.0f}" if v == int(v) else f"{v:,.2f}"
    return f"${s}" if cur == "USD" else f"{s} {cur}"


def url(base, lang):
    return f"{base}/{PATH['de' if lang == 'de' else 'en']}"


def active():
    """True, sobald ein PayPal-Name eingetragen ist (dann indexierbar, Sitemap, Footer-Link)."""
    return bool((load().get("paypal") or "").strip())


def build(g):
    base, today = g["BASE"], g["TODAY"]
    d = load()
    cur, handle = d.get("currency") or "USD", (d.get("paypal") or "").strip().strip("/")
    live = bool(handle)
    alts = {l: url(base, l) for l in ("en", "de")}
    sups = [x for x in d.get("supporters") or [] if float(x.get("amount") or 0) > 0]
    month = today[:7]

    def raised(gl):
        """Eingegangen = Startwert raised + Summe der Unterstützer:innen fuer dieses Ziel (monatliche Ziele: nur der laufende Monat)."""
        rows = [x for x in sups if x.get("goal") == gl.get("id") and (gl.get("recurring") != "monthly" or str(x.get("date", ""))[:7] == month)]
        return float(gl.get("raised") or 0) + sum(float(x["amount"]) for x in rows)

    for lang in ("en", "de"):
        t, e = T[lang], (lambda s: html.escape(str(s), quote=True))
        cards = []
        goals = {x.get("id"): x for x in d.get("goals") or []}
        reached = lambda x: float(x.get("amount") or 0) and raised(x) >= float(x.get("amount") or 0)
        for gl in d.get("goals") or []:
            need = [goals[r] for r in gl.get("requires") or [] if r in goals and not reached(goals[r])]
            amt, got = float(gl.get("amount") or 0), raised(gl)
            pct = max(0, min(100, round(got / amt * 100))) if amt else 0
            turn = t.get(gl.get("recurring") or "once", t["once"])
            done = amt and got >= amt
            pay = f"https://paypal.me/{handle}/{amt:g}{cur}" if live else ""
            free = f"https://paypal.me/{handle}" if live else ""
            btn = (f'<a class="btn main" href="{e(pay)}" rel="noopener" target="_blank">{e(t["support"].format(amount=money(amt, cur)))}</a>'
                   f'<a class="btn" href="{e(free)}" rel="noopener" target="_blank">{e(t["other"])}</a>') if live else \
                  f'<span class="btn" aria-disabled="true">{e(t["soon"])}</span>'
            if need:
                nm = [f'„{x["title"].get(lang) or x["title"]["en"]}“' if lang == "de" else f'“{x["title"].get(lang) or x["title"]["en"]}”' for x in need]
                names = (", ".join(nm[:-1]) + f' {t["and_"]} ' + nm[-1]) if len(nm) > 1 else nm[0]
                btn = f'<p class="sup-meta">🔒 {e(t["locked"].format(names=names, verb=t["are_"] if len(nm) > 1 else t["is_"]))}</p>'
            cards.append(f'<article class="sup-card{" locked" if need else ""}" id="goal-{e(gl.get("id", ""))}"><h2>{e(gl["title"].get(lang) or gl["title"]["en"])}</h2>'
                         f'<div class="sup-amt">{e(money(amt, cur))}<small>{e(turn)}</small></div>'
                         f'<p>{e(gl["desc"].get(lang) or gl["desc"]["en"])}</p>'
                         f'<div class="sup-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="{pct}"><span style="width:{pct}%"></span></div>'
                         f'<p class="sup-meta">{e(t["raised"].format(raised=money(got, cur), amount=money(amt, cur)))} · {pct} %</p>'
                         + (f'<p class="sup-ok">{e(t["reached"])}</p>' if done else (btn if need else f'<div class="sup-btns">{btn}</div>')) + '</article>')
        pre = "" if lang == "en" else "/de"

        def wall(lang, t, e):
            """Unterstuetzer-Liste: oeffentlich genannte je Name zusammengefasst, alle anderen als eine Zeile „Anonym“; groesste Summe zuerst."""
            agg = {}
            for x in sups:
                key = (x.get("name") or "").strip() if x.get("public") else ""
                a = agg.setdefault(key, {"sum": 0.0, "goals": set(), "last": "", "n": 0, "link": ""})
                a["sum"] += float(x["amount"]); a["n"] += 1; a["last"] = max(a["last"], str(x.get("date", "")))
                if x.get("goal") in goals: a["goals"].add(goals[x["goal"]]["title"].get(lang) or goals[x["goal"]]["title"]["en"])
                if x.get("public") and str(x.get("link", "")).startswith("https://"): a["link"] = x["link"]
            if not agg:
                return f'<p class="mut">{e(t["wall_none"])}</p>'
            rows = []
            for k, a in sorted(agg.items(), key=lambda kv: (kv[0] == "", -kv[1]["sum"])):
                who = e(k) if k else e(t["anon"]) + (f" ({a['n']})" if a["n"] > 1 else "")
                if k and a["link"]: who = f'<a href="{e(a["link"])}" rel="nofollow noopener">{who}</a>'
                rows.append(f'<tr><td>{who}</td><td class="n">{e(money(a["sum"], cur))}</td><td>{e(", ".join(sorted(a["goals"])))}</td><td class="n">{e(a["last"])}</td></tr>')
            return (f'<div style="overflow-x:auto"><table class="sup-wall"><thead><tr><th>{e(t["col_name"])}</th><th>{e(t["col_sum"])}</th><th>{e(t["col_goals"])}</th><th>{e(t["col_last"])}</th></tr></thead>'
                    f'<tbody>{"".join(rows)}</tbody></table></div>')
        body = (f'{g["header"](lang, "")}<main class="wrap">{CSS}<div class="hero"><div class="kicker">{e(t["kicker"])}</div>'
                f'<h1>{e(t["h1"])}</h1><p class="lede">{e(t["lede"])}</p></div>'
                f'<div class="sup-grid">{"".join(cards) or "<p>" + e(t["nogoals"]) + "</p>"}</div>'
                f'<h2>{e(t["wall_h"])}</h2>{wall(lang, t, e)}'
                f'<h2>{e(t["how_h"])}</h2><ol>{"".join("<li>" + e(x) + "</li>" for x in t["how"])}</ol>'
                f'<h2>{e(t["note_h"])}</h2><p>{e(t["note"])} <a href="{base}/{"datenschutz" if lang == "de" else "privacy"}/">{e(t["privacy"])}</a></p>'
                f'<p class="mut">{e(t["updated"])}: {e(d.get("updated") or today)} · <a href="{base}{pre}/sponsor/">{e(t["sponsor"])}</a></p>'
                f'</main>{g["footer"](lang)}')
        ld = [{"@context": "https://schema.org", "@type": "WebPage", "@id": alts[lang] + "#page", "url": alts[lang], "name": t["h1"], "description": t["desc"],
               "inLanguage": lang, "dateModified": d.get("updated") or today, "isPartOf": {"@id": f"{base}/#website"}}]
        g["write"](PATH[lang] + "index.html", g["page"](lang, t["title"], t["desc"], alts[lang], body, alts, ld, xdefault=alts["en"], og_type="website", share=live, noindex=not live))
        if live:
            g["sitemap"].append((alts[lang], today, alts))
