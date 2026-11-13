"""Blog je Mitglied: oeffentliche Beitragsseiten (BlogPosting) und Verzeichnisse je Sprache. Beitraege kommen freigegeben aus /api/blog/export."""
import json, re
from datetime import datetime, timezone
from site_i18n import COMM_LANGS, pfx, pfx2, T
from site_learn import ENTS, esc, _fetch_json, LCSS, WT, wiki_render, wiki_images, WCSS
import site_notes as SNT
import site_members as MEM
import site_topics as TOP
import site_sponsorships as SPM   # T37 Sponsor: Kennzeichnung bezahlter Beitraege (data/sponsorships.json)
import site_img_dims as IMG
import site_listen as LST   # Anhoeren-Karten (Stoerer) in den Beitraegen
import site_index_rule as IR   # Index-Regel "ab 2500 Zeichen eigener Text" (13.11.2026)
import site_milestones as MST   # Wochenzusammenfassungen: eigene Vor/Zurueck-Reihe, darunter nur weitere Zusammenfassungen statt Inhaltslisten
from site_design import pager as PG, neighbours as NB   # Vor/Zurueck am Seitenende (rel=prev/next)


_H1 = re.compile(r"<h1(\s[^>]*)?>(.*?)</h1\s*>", re.I | re.S)


def one_h1(html, title=""):
    """Entfernt eine fuehrende <h1>, die nur den Titel wiederholt, und macht alle weiteren <h1> im Beitragstext zu <h2> (die Seite setzt den Titel selbst als einzige <h1>)."""
    if not html or "<h1" not in html.lower():
        return html
    norm = lambda t: re.sub(r"\W+", "", re.sub(r"<[^>]+>", "", t or "")).lower()
    m = _H1.search(html)
    if m and not re.sub(r"<[^>]+>|\s", "", html[:m.start()]).strip() and norm(m.group(2)) == norm(title):
        html = html[:m.start()] + html[m.end():]
    return _H1.sub(lambda x: f"<h2{x.group(1) or ''}>{x.group(2)}</h2>", html)


def disclosures(p, body_html, lang, skip=()):
    """Transparenzhinweise (Feld disclosure, wie auf den Entitaetsseiten: site_entities.disclosure_of) zu Themen und verlinkten Entitaeten des Beitrags,
    z. B. iFAKT bei Links auf /entity/ifakt/ oder ein Polaris-Modul (developed_by/part_of ifakt). In allen Sprachfassungen (ohne Text der Sprache: Englisch).
    skip: Entitaeten des Sponsorings dieses Beitrags, die SPM.note schon kennzeichnet. Jeder Hinweis nur einmal."""
    import site_entities as SENT
    ids = dict.fromkeys([t for t in (p.get("topics") or []) if isinstance(t, str)] + re.findall(r'/entity/([a-z0-9][a-z0-9-]{1,79})/', body_html or ""))
    return list(dict.fromkeys(d for i in ids if i in ENTS and i not in skip for d in [SENT.disclosure_of(ENTS[i], lang)] if d))


def fetch_posts(api):
    items = (_fetch_json(f"{api}/api/blog/export", timeout=120) or {}).get("items", [])
    if any(p.get("has_html") for p in items):   # uebernommene Beitraege: HTML seitenweise nachladen
        html, off = {}, 0
        while True:
            part = (_fetch_json(f"{api}/api/blog/html?offset={off}&limit=40", timeout=120) or {}).get("items", [])
            for x in part: html[x["id"]] = x["html"]
            if len(part) < 40: break
            off += 40
        for p in items:
            if p.get("has_html"): p["html"] = html.get(p["id"], "")
    return items


def _aitr(p, lang, BASE=""):
    if not p.get("ai_tr"): return ""
    o = f' <a href="{BASE}/community/u/{p["handle"]}/blog/{p["slug"]}/" hreflang="en" lang="en">{esc(T(lang, "Read the English original", "Englisches Original lesen"))}</a>' if p.get("tr_of") and BASE else ""
    return f'<p class="mut"><em>{esc(T(lang, "Automatically translated with AI from the original post.", "Automatisch mit KI aus dem Originalbeitrag übersetzt."))}</em>{o}</p>'


def _author_node(BASE, a, au):
    """Autor als Person-Knoten: hat die Person eine Entitaet (Claim oder Seitenautor), ist deren @id die eine Identitaet, das Profil haengt als sameAs daran."""
    eid = MEM.person_entity(a["handle"])
    if eid:
        return {"@type": "Person", "@id": f"{BASE}/entity/{eid}/#entity", "name": a["name"], "url": au}   # nur Identitaet; den vollen Knoten ergaenzt page() (complete_ld)
    return {"@type": "Person", "@id": au + "#person", "name": a["name"], "url": au}


TOPJS = ('(function(){var r=document.querySelector(".bl-top");if(!r)return;var A=r.dataset.api,L=r.dataset.lang,C=r.dataset.croot,ol=r.querySelector("ol"),em=r.querySelector(".bl-top-empty"),bs=[].slice.call(r.querySelectorAll("button"));'
         'function show(it){ol.textContent="";em.hidden=it.length>0;it.forEach(function(x){var li=document.createElement("li"),a=document.createElement("a");a.href=C+"u/"+x.handle+"/blog/"+x.slug+"/";a.textContent=x.title;li.appendChild(a);'
         'var s=document.createElement("span");s.className="mut";s.textContent=" \u00b7 \u25b2 "+x.votes;li.appendChild(s);ol.appendChild(li)})}'
         'bs.forEach(function(b){b.addEventListener("click",function(){bs.forEach(function(o){o.setAttribute("aria-pressed",o===b?"true":"false")});'
         'fetch(A+"/api/blog/top?period="+b.dataset.p+"&lang="+L+"&limit=10").then(function(q){return q.json()}).then(function(d){show(d.items||[])}).catch(function(){})})})})();')
TOPCSS = '<style>.bl-top{margin:1.5em 0}.bl-top h2{font-size:1.15rem}.bl-top .tabs{display:flex;flex-wrap:wrap;gap:.4em;margin:.6em 0}.bl-top button{font:inherit;cursor:pointer;border:1px solid var(--bd);border-radius:2em;padding:.25em .9em;background:var(--card);color:inherit}.bl-top button[aria-pressed=true]{border-color:var(--ac);font-weight:700}.bl-top ol{padding-left:1.4em}</style>'
TOP_PERIODS = (("day", "Today", "Heute"), ("week", "This week", "Diese Woche"), ("month", "This month", "Dieser Monat"), ("year", "This year", "Dieses Jahr"), ("evergreen", "Evergreen", "Evergreen"))


def top_block(lang, items, croot, api):
    """Top-Beitraege nach Upvotes: Tabs Tag / Woche / Monat / Jahr / evergreen. Ohne Skript steht die Evergreen-Liste (alle Stimmen, Stand Seitenbau) im HTML; die Tabs holen die Zahlen live
    aus /api/blog/top. Hat mit dem Index nichts zu tun (alle Beitraege stehen auf index)."""
    orig = [p for p in items if not p.get("tr_of")]
    pool = orig or items   # Sprache mit eigenen Originalen: nur diese (API filtert nach Sprache); reine Uebersetzungssprache: Stimmen des Originals, die API ohne Sprachfilter
    ev = sorted([p for p in pool if p.get("votes", 0) > 0], key=lambda p: (-p["votes"], -p["published"]))[:10]
    li = "".join(f'<li><a href="{croot}u/{p["handle"]}/blog/{p["slug"]}/">{esc(p["title"])}</a> <span class="mut">· ▲ {p["votes"]}</span></li>' for p in ev)
    tabs = "".join(f'<button type="button" data-p="{k}" aria-pressed="{"true" if k == "evergreen" else "false"}">{esc(T(lang, en, de))}</button>' for k, en, de in TOP_PERIODS)
    return (f'{TOPCSS}<section class="bl-top" data-api="{esc(api)}" data-lang="{lang if orig else ""}" data-croot="{croot}"><h2>{esc(T(lang, "Most upvoted posts", "Meistgelobte Beiträge"))}</h2>'
            f'<div class="tabs" role="group" aria-label="{esc(T(lang, "Time range", "Zeitraum"))}">{tabs}</div><ol>{li}</ol>'
            f'<p class="bl-top-empty mut"{"" if not ev else " hidden"}>{esc(T(lang, "No upvotes in this period yet.", "In diesem Zeitraum gibt es noch keine Upvotes."))}</p><script>{TOPJS}</script></section>')


def iso(ts):
    return datetime.fromtimestamp(ts, timezone.utc).strftime("%Y-%m-%d")


VOTEJS = ('(function(){var A="%API%",H="%H%",bs=[].slice.call(document.querySelectorAll(".bl-vote"));if(!bs.length)return;'
          'function f(p,o){o=o||{};o.credentials="include";o.headers=Object.assign({"x-requested-with":"m365"},o.headers||{});return fetch(A+p,o).then(function(r){return r.json()})}'
          'f("/api/blog/votes?handle="+H).then(function(d){bs.forEach(function(b){var s=b.dataset.s;b.querySelector(".n").textContent=(d.votes||{})[s]||0;if((d.mine||[]).indexOf(s)>-1)b.setAttribute("aria-pressed","true")})}).catch(function(){});'
          'bs.forEach(function(b){b.addEventListener("click",function(){f("/api/blog/vote",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({handle:H,slug:b.dataset.s})}).then(function(d){if(d.error==="login"){location.href=A.replace("api-","")+"/community/";return}'
          'if(d.ok){b.querySelector(".n").textContent=d.votes;b.setAttribute("aria-pressed",d.voted?"true":"false")}}).catch(function(){})})})})();')

FOLLOWJS = ('(function(){var A="%API%",b=document.querySelector(".bl-follow");if(!b)return;var H=b.dataset.h,t=b.querySelector(".t");'
            'function f(p,o){o=o||{};o.credentials="include";o.headers=Object.assign({"x-requested-with":"m365"},o.headers||{});return fetch(A+p,o).then(function(r){return r.json()})}'
            'function set(on){b.setAttribute("aria-pressed",on?"true":"false");t.textContent=on?"%FOLLOWING%":"%FOLLOW%"}'
            'f("/api/blog/following").then(function(d){if(d.following)set(d.following.indexOf(H)>-1)}).catch(function(){});'
            'b.addEventListener("click",function(){var on=b.getAttribute("aria-pressed")!=="true";f("/api/blog/follow",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({handle:H,on:on})}).then(function(d){if(d.error==="login"){location.href=A.replace("api-","")+"/community/";return}if(d.ok)set(on)}).catch(function(){})})})();')

CSS = ('<style>.bl-list{padding:0}.bl-list li{list-style:none;padding:.8em 0;border-bottom:1px solid var(--bd)}.bl-vote{font:inherit;cursor:pointer;border:1px solid var(--bd);border-radius:2em;padding:.25em .8em;background:var(--card);color:inherit}'
       '.bl-vote[aria-pressed=true]{border-color:var(--ac)}.bl-rel{margin:1.5em 0}.bl-rel h2{font-size:1.15rem}.en-al{text-decoration:underline dotted;text-underline-offset:.15em}</style>')


def build(g, posts, people, api):
    BASE, write, page, header, footer, footer_en, LANGS = g["BASE"], g["write"], g["page"], g["header"], g["footer"], g["footer_en"], g["LANGS"]
    ctags = g.get("community_tags")
    sitemap, TODAY = g["sitemap"], g["TODAY"]
    shell = lambda lang, b: f'{header(lang, "")}<main class="wrap" style="max-width:48em">{b}</main>{footer(lang) if lang in LANGS else footer_en()}'
    pb = {p["handle"]: p for p in people}
    if any(p.get("legacy") for p in posts) and "mirko-p" not in pb:   # frueherer Blog: Autor ist auch ohne Profil-Export da
        pb["mirko-p"] = {"handle": "mirko-p", "name": "Mirko Peters"}
    posts = [p for p in posts if p["handle"] in pb]
    links = {i: [e["name"], f"{BASE}/entity/{i}/"] for i, e in ENTS.items()}
    tr_langs = {}   # (slug, handle) -> freigegebene Sprachfassungen (fuer hreflang)
    for p in posts:
        if p.get("tr_of") and p.get("tr_index"):
            tr_langs.setdefault((p["slug"], p["handle"]), []).append(p["lang"])
    _ntr = {}
    for p in posts:
        if p.get("tr_of"): _ntr[p["lang"]] = _ntr.get(p["lang"], 0) + 1
    for _l, _n in sorted(_ntr.items()): print(f"Blog: {_n} Sprachfassungen {_l}, indexierbar: {sum(1 for p in posts if p.get('tr_of') and p['lang'] == _l and p.get('tr_index'))}")
    for lang in COMM_LANGS:
        mine = [p for p in posts if p["lang"] == lang]
        if not mine:
            croot = f"{BASE}{pfx(lang)}/community/"; t0 = T(lang, "Blog", "Blog"); ru = f"{croot}blog/"
            intro = T(lang, "Blog posts from members of the Microsoft community. Nothing published in this language yet.", "Blogbeiträge von Mitgliedern der Microsoft-Community. In dieser Sprache gibt es noch nichts.")
            b = shell(lang, f'<h1>{esc(t0)}</h1><p class="mut">{esc(intro)}</p>')
            write(f"{pfx2(lang)}community/blog/index.html", page(lang, f"{t0} – M365.FM", intro, ru, b, None, None, og_type="website", extra_head=LCSS, noindex=True))
            continue
        w = WT.get(lang, WT["en"]); croot = f"{BASE}{pfx(lang)}/community/"
        links_l = {i: [e["name"], f"{BASE}{pfx(lang) if lang == 'de' else ''}/entity/{i}/"] for i, e in ENTS.items()}
        title_blog = T(lang, "Blog", "Blog")
        _idx_keys = set()   # (handle, slug) der indexierbaren Beitraege dieser Sprache: Grundlage der Verzeichnisse
        _seq = {}   # Beitraege je Autor in dieser Sprache, neueste zuerst: Vor/Zurueck blaettert durch den Blog der Autorin bzw. des Autors
        _sk = lambda q: (q["handle"], MST.is_milestone(q))   # Wochenzusammenfassungen blaettern nur untereinander, die uebrigen Beitraege ohne sie
        for q in sorted(mine, key=lambda q: (q.get("published") or 0, q["slug"]), reverse=True): _seq.setdefault(_sk(q), []).append(q)
        _pos = {(q["handle"], q["slug"]): i for h, s_ in _seq.items() for i, q in enumerate(s_)}
        _content = [q for q in mine if not MST.is_milestone(q)]
        _running = SPM.running()   # laufende Sponsorings inkl. Karenzzeit (einmal je Sprache)
        for p in mine:
            a = pb[p["handle"]]; au = f"{BASE}/community/u/{a['handle']}/"
            u = f"{croot}u/{p['handle']}/blog/{p['slug']}/"
            body_html, refs = (p["html"], []) if p.get("html") else wiki_render(p["body"], links_l, w)   # uebernommene fruehere Blogbeitraege: HTML bleibt vollstaendig erhalten
            body_html = one_h1(body_html, p["title"])   # Bing-SEO-Bericht: nur die Seitenueberschrift ist <h1>; <h1> im Beitragstext wird <h2>, eine Wiederholung des Titels entfaellt
            if p.get("html"):   # erste Nennung einer Entitaet im Text auf ihre Seite verlinken (Wissensgraph aus dem Artikel heraus), in allen Sprachen
                body_html, _al = TOP.autolink_html(body_html, ENTS, lambda i: links_l[i][1], max_links=8)
            if not p.get("legacy"):
                body_html = IMG.enhance(body_html)
            body_html = IMG.eager_first(body_html)   # erstes Bild oben im Beitrag (oft das LCP-Element) nicht lazy laden
            _ms = MST.is_milestone(p)
            if not _ms: body_html = LST.apply(BASE, body_html, p, lang, ENTS)   # "Anhoeren"-Karten (site_listen): 1-2 passende Folgen und "Show folgen", nur bei guter Uebereinstimmung
            _rel = [] if _ms else TOP.related(_content, p, k=6)
            relbox = MST.more_box(lang, BASE, posts, p) if _ms else (f'<section class="bl-rel"><h2>{esc(T(lang, "Related articles", "Verwandte Artikel"))}</h2><ul class="bl-list">' + "".join(
                f'<li><a href="{croot}u/{r["handle"]}/blog/{r["slug"]}/"><b>{esc(r["title"])}</b></a> <span class="mut">· {iso(r["published"])}</span></li>' for r in _rel) + "</ul></section>") if _rel else ""
            if p.get("html") and not p.get("images"): p["images"] = re.findall(r'<img[^>]+src="(https://[^"]+)"', p["html"])
            _spr = SPM.post(p["handle"], p["slug"])   # T37 Sponsor: Beitrag aus einem Sponsoring (alle Sprachfassungen, dauerhaft)
            _spr_ex = SPM.post_extras(_spr, SPM._state()["today"], ENTS)   # Mirko 6.11.2026: Sponsor-Entitaeten extra zur Obergrenze von 10
            topics, _spx = SPM.split_topics([t for t in p.get("topics", []) if t in ENTS], [x for x in _spr_ex if x in ENTS])
            tl = (f'<section class="bl-ents"><h2>{esc(T(lang, "Entities in this article", "Entitäten in diesem Artikel"))}</h2><p>' + "".join(f'<a class="mb-tag" href="{links_l[t][1]}">{esc(ENTS[t]["name"])}</a> ' + (f'<small class="mut">{esc(SPM.badge(lang, _spr))}</small> ' if t in _spx else '') for t in topics) + '</p></section>') if topics else ""
            vote = "" if p.get("legacy") else f'<p><button type="button" class="bl-vote" data-s="{esc(p["slug"])}" aria-pressed="false" aria-label="Upvote">▲ <span class="n">{p.get("votes", 0)}</span></button></p>'
            _kp, _fq, _fld = SNT.sections(p.get("keypoints"), p.get("faq"), lang)   # Kernpunkte und FAQ aus eigenen Feldern
            if p.get("html"): _fq = ""   # FAQ steht schon im Text des Beitrags; nur das Schema (FAQPage) bleibt
            cos = [c for c in (p.get("coauthors") or []) if c.get("handle") in pb and c["handle"] != p["handle"]]
            co_html = "".join(f' {esc(T(lang, "and", "und"))} <a href="{croot}u/{c["handle"]}/" rel="author">{esc(pb[c["handle"]]["name"])}</a>' for c in cos) if len(cos) == 1 else "".join(f', <a href="{croot}u/{c["handle"]}/" rel="author">{esc(pb[c["handle"]]["name"])}</a>' for c in cos)
            upd_html = f' · {esc(T(lang, "Updated", "Aktualisiert"))} <time datetime="{iso(p["updated"])}">{iso(p["updated"])}</time>' if p.get("updated") and iso(p["updated"]) != iso(p["published"]) else ""
            _disc = "".join(f'<p class="en-disc" role="note" style="{SPM.NOTE_STYLE}">{esc(d)}</p>' for d in disclosures(p, body_html, lang, skip=_spr_ex))
            b = shell(lang, f'{WCSS}{CSS}<p class="mut"><a href="{croot}blog/">{esc(title_blog)}</a> · <a href="{croot}u/{p["handle"]}/blog/">{esc(a["name"])}</a></p><article class="wk-body"><h1>{esc(p["title"])}</h1>{SPM.note(lang, _spr, "post")}{_disc}'
                            f'<p class="mut">{esc(T(lang, "By", "Von"))} <a href="{croot}u/{p["handle"]}/" rel="author">{esc(a["name"])}</a>{co_html}{esc(" · ")}<time datetime="{iso(p["published"])}">{iso(p["published"])}</time>{upd_html}</p>'
                            f'{("<p>" + esc(p["summary"]) + "</p>") if p.get("summary") else ""}{_aitr(p, lang, BASE)}{_kp}{body_html}{IMG.CSS if IMG.needs_responsive_css(body_html) else ""}{_fq}{SNT.CSS if (_kp or _fq) else ""}</article>{tl}{relbox}{vote}'
                            f'<p>{("" if p.get("legacy") else "<button type=" + chr(34) + "button" + chr(34) + " class=" + chr(34) + "bl-vote bl-follow" + chr(34) + " data-h=" + chr(34) + esc(p["handle"]) + chr(34) + " aria-pressed=" + chr(34) + "false" + chr(34) + "><span class=" + chr(34) + "t" + chr(34) + ">" + esc(T(lang, "Follow this blog", "Blog abonnieren")) + "</span></button> ")}<a href="{croot}u/{p["handle"]}/blog/feed.xml">RSS</a></p>'
                            + ((g.get("author_box")(lang) if g.get("author_box") and p["handle"] == "mirko-p" and lang in ("en", "de") else ""))
                            + PG(lang, *[(f'{croot}u/{x["handle"]}/blog/{x["slug"]}/', x["title"]) if x else None for x in NB(_seq[_sk(p)], _pos[(p["handle"], p["slug"])])], kind="article")
                            + ("" if p.get("legacy") else (f'<section id="c-comments"></section>'
                            f'<script>{VOTEJS.replace("%API%", api).replace("%H%", p["handle"])}</script><script>{FOLLOWJS.replace("%API%", api).replace("%FOLLOW%", esc(T(lang, "Follow this blog", "Blog abonnieren"))).replace("%FOLLOWING%", esc(T(lang, "Following", "Abonniert")))}</script>'
                            + (ctags(lang, "blog%d" % p["id"]) if ctags else ""))))   # fruehere Blogbeitraege: keine Verbindung zur Community-Datenbank (kein Upvote, Abo, Kommentar)
            ld = [{"@context": "https://schema.org", "@type": "BlogPosting", "@id": u + "#post", "mainEntityOfPage": u, "headline": p["title"], "description": p.get("summary") or "",
                   "inLanguage": lang, **({"image": p["images"][:6]} if p.get("html") and p.get("images") else ({"image": [i["url"] for i in wiki_images(p["body"])]} if wiki_images(p["body"]) else {})), "datePublished": iso(p["published"]), "dateModified": iso(p.get("updated") or p["published"]),
                   "author": [_author_node(BASE, a, au)] + [{"@type": "Person", "@id": f"{BASE}/community/u/{c['handle']}/#person", "name": pb[c["handle"]]["name"], "url": f"{BASE}/community/u/{c['handle']}/"} for c in cos],
                   "about": [{"@id": f"{BASE}/entity/{t}/#entity"} for t in topics], "citation": [{"@type": "CreativeWork", "name": r["title"], "url": r["url"]} for r in refs],
                   "publisher": {"@id": f"{BASE}/#org"}}] + _fld + [{"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [   # T4: Verlag und Brotkrumen
                       {"@type": "ListItem", "position": 1, "name": "M365.FM", "item": f"{BASE}/"}, {"@type": "ListItem", "position": 2, "name": a["name"], "item": au},
                       {"@type": "ListItem", "position": 3, "name": "Blog", "item": au + "blog/"}, {"@type": "ListItem", "position": 4, "name": p["title"], "item": u}]}]
            if _spr:
                ld[0]["sponsor"] = SPM.ld(_spr)   # T37 Sponsor: BlogPosting.sponsor
            b = SPM.mark(b, _spr + [r for r in _running if r not in _spr], "post")   # Links zur Website eines laufenden Sponsors tragen rel="sponsored", auch ohne Eintrag unter "posts" (Cognillo-Reihe); ohne Sponsoring unveraendert
            noidx = False   # 13.11.2026: alle Blogbeitraege stehen auf index. Upvotes entscheiden nicht mehr ueber den Index, sondern nur noch ueber die Top-Listen (Tag, Woche, Monat, Jahr, evergreen)
            if p.get("tr_of"):
                noidx = not p.get("tr_index")   # Sprachfassungen: nur nach Freigabe je Sprache (data/blog_tr.json "index") oder ab 2500 Zeichen (site_index_rule, im Uebersetzungsschritt) indexierbar - an genau einer Stelle entschieden
            if not noidx: _idx_keys.add((p["handle"], p["slug"]))
            _alt = None
            if p.get("html") and (p["slug"], p["handle"]) in tr_langs:   # hreflang nur zwischen indexierbaren Fassungen (Original + freigegebene Sprachen)
                _alt = {"en": f"{BASE}/community/u/{p['handle']}/blog/{p['slug']}/", **{l: f"{BASE}{pfx(l)}/community/u/{p['handle']}/blog/{p['slug']}/" for l in tr_langs[(p["slug"], p["handle"])]}}
                if noidx or len(_alt) < 2: _alt = None
            _og = f"{BASE}/community/u/{p['handle']}/blog/{p['slug']}/" if p.get("tr_of") else None   # Sprachfassungen teilen das Teilen-Bild des Originals (sonst Tausende neue Bilder)
            (g.get("write_r2") if (p.get("tr_of") and g.get("write_r2")) else write)(f"{pfx2(lang)}community/u/{p['handle']}/blog/{p['slug']}/index.html", page(lang, f'{p["title"]} – {a["name"]} | M365.FM', (p.get("summary") or "")[:155], u, b, _alt, ld, xdefault=(_alt or {}).get("en"), og_type="article", extra_head=LCSS, noindex=noidx, og_of=_og, side=(g["side"](lang, p["title"] + " " + (p.get("summary") or ""), ids=topics) if g.get("side") else "")))   # Sprachfassungen liegen im R2-Bucket
            if not noidx:
                sitemap.append((u, iso(p.get("updated") or p["published"]), _alt))
        # Verzeichnisse: je Autor und gesamt
        def lst(items):
            return '<ul class="bl-list">' + "".join(f'<li><a href="{croot}u/{p["handle"]}/blog/{p["slug"]}/"><b>{esc(p["title"])}</b></a> <span class="mut">· {esc(pb[p["handle"]]["name"])} · {iso(p["published"])}</span>'
                                                   f'{("<br>" + esc(p["summary"])) if p.get("summary") else ""}</li>' for p in items) + "</ul>"
        is_by = lambda p, h: p["handle"] == h or any(c.get("handle") == h for c in (p.get("coauthors") or []))   # Co-Autoren: der Beitrag steht auch in ihrer Blogliste
        _pub = lambda p: (p["handle"], p["slug"]) in _idx_keys   # zaehlt fuer den Index der Verzeichnisse: genau die Beitraege, die oben auf index stehen (alle Originalbeitraege, freigegebene Sprachfassungen)
        PER = 100   # T6: Verzeichnisse seitenweise (vorher alle ~2.300 Beitraege in einer Liste, ca. 1 MB)
        def paged(items, ru, rel, head_html, title, desc, noidx, ld=None):
            npg = max(1, (len(items) + PER - 1) // PER)
            for pno in range(npg):
                part = items[pno * PER:(pno + 1) * PER]
                pu = ru if pno == 0 else f"{ru}page/{pno + 1}/"
                nav = ""
                if npg > 1:
                    links = " ".join(f'<a href="{ru if q == 0 else f"{ru}page/{q + 1}/"}"{" aria-current=page style=font-weight:700" if q == pno else ""}>{q + 1}</a>' for q in range(npg))
                    nav = f'<nav class="pages" aria-label="{esc(T(lang, "Pages", "Seiten"))}" style="margin:1em 0">{esc(T(lang, "Page", "Seite"))} {links}</nav>'
                prev_next = ((f'<link rel="prev" href="{ru if pno == 1 else f"{ru}page/{pno}/"}">' if pno else "") + (f'<link rel="next" href="{ru}page/{pno + 2}/">' if pno + 1 < npg else ""))
                b = shell(lang, f'{CSS}{head_html}{nav}{lst(part)}{nav}')
                write(f"{pfx2(lang)}{rel}{'' if pno == 0 else f'page/{pno + 1}/'}index.html", page(lang, title + (f" ({pno + 1})" if pno else ""), desc, pu, b, None, ld if pno == 0 else None, og_type="website", extra_head=LCSS + prev_next, noindex=noidx))
                if not noidx:
                    sitemap.append((pu, (iso(part[0]["published"]) if part else TODAY), None))
        for h in sorted({p["handle"] for p in mine} | {c["handle"] for p in mine for c in (p.get("coauthors") or []) if c.get("handle") in pb}):
            noidx = not any(is_by(p, h) and _pub(p) for p in mine)
            it = sorted([p for p in mine if is_by(p, h)], key=lambda x: -x["published"]); ru = f"{croot}u/{h}/blog/"
            nm = pb[h]["name"]
            paged(it, ru, f"community/u/{h}/blog/", f'<h1>{esc(title_blog)} – {esc(nm)}</h1><p><a href="{croot}u/{h}/">{esc(nm)}</a></p>', f'{title_blog} – {nm} | M365.FM', nm, noidx)
            write(f"{pfx2(lang)}community/u/{h}/blog/feed.xml", rss(f"{title_blog} – {nm}", ru, it, croot, pb, lang))
        noidx = not any(_pub(p) for p in mine)
        it = sorted(mine, key=lambda x: -x["published"]); ru = f"{croot}blog/"
        intro = T(lang, "Blog posts from members of the Microsoft community.", "Blogbeiträge von Mitgliedern der Microsoft-Community.")
        ld = [{"@context": "https://schema.org", "@type": "Blog", "name": "M365.FM " + title_blog, "url": ru, "inLanguage": lang,
               "blogPost": [{"@id": f"{croot}u/{p['handle']}/blog/{p['slug']}/#post"} for p in it[:50]]}]
        write(f"{pfx2(lang)}community/blog/feed.xml", rss("M365.FM " + title_blog, ru, it, croot, pb, lang))
        paged(it, ru, "community/blog/", f'<h1>{esc(title_blog)}</h1><p class="mut">{esc(intro)}</p>' + top_block(lang, mine, croot, api), f'{title_blog} – M365.FM', intro, noidx, ld)


def rss(title, link, items, croot, pb, lang):
    from xml.sax.saxutils import escape as x
    from email.utils import formatdate
    it = "".join(f"<item><title>{x(p['title'])}</title><link>{croot}u/{p['handle']}/blog/{p['slug']}/</link><guid>{croot}u/{p['handle']}/blog/{p['slug']}/</guid>"
                 f"<pubDate>{formatdate(p['published'])}</pubDate><author>{x(pb[p['handle']]['name'])}</author><description>{x(p.get('summary') or '')}</description></item>" for p in items[:50])
    return f'<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>{x(title)}</title><link>{link}</link><description>{x(title)}</description><language>{lang}</language>{it}</channel></rss>'
