/* T37 Sponsor-Seite (/sponsor/): reine Funktionen ohne DOM - Preise, Laufzeitrabatt, PR-Empfehlung, Schwierigkeit -> Laufzeit,
   Zeit bis zur Wirkung, Texte (Intl.PluralRules, Rueckfall je Schluessel auf Englisch), Zeilen, Empfehlung, Anfrage-Paket v1.
   UMD: im Browser window.SponsorCalc, in Node require("assets/sponsor-calc.js") (Tests, Vorab-Rendern im Seitenbau).
   Preise und Regeln kommen nur aus data/sponsor_pricing.json (P), Texte aus data/sponsor_i18n.json (C = {lang, T: eigene Texte, E: Englisch}).
   Rechnet wie Prototyp v2 (Mirko), mit den Vorgaben aus design.md D1: 14 Sprachen in USD im Monatsbetrag, keine Einheiten-Mischung
   in einer Spanne, PR-Hinweis nur bei gewaehlten PR-Artikeln. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.SponsorCalc = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  var EMAIL_RE = /^[^\s@<>]{1,64}@[^\s@<>]{1,190}\.[a-z]{2,}$/i;   // wie worker/src/sponsor.js
  var STRIP_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F​-‏‪-‮⁦-⁩]/g;   // wie cleanText im Worker
  var ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return ESC[c]; }); }
  function clean(s) { return String(s == null ? "" : s).replace(STRIP_RE, "").replace(/\s+/g, " ").trim(); }

  /* ---- Zahlen und Texte ---- */
  function fmtUsd(n) {   // "$" + ganze Dollar mit en-US-Gruppierung, in jeder Sprache (USD-Konvention); negativ mit U+2212
    var r = Math.round(n), s = String(Math.abs(r)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return (r < 0 ? "−" : "") + "$" + s;
  }
  var NF = {}, PRC = {};
  function num(C, v) {   // Zahl der Seitensprache, lateinische Ziffern, hoechstens eine Nachkommastelle
    if (C && C.dec != null && Math.abs(v) < 1e3) {   // unter Tausend: keine Gruppierung noetig   // Browser: Dezimalzeichen kommt vorab aus dem Seitenbau (Intl.NumberFormat kostet beim ersten Aufruf ~20 ms)
      var s = String(Math.round(v * 10) / 10);
      return C.dec === "." ? s : s.replace(".", C.dec);
    }
    var k = (C && C.lang) || "en";
    try { return (NF[k] || (NF[k] = new Intl.NumberFormat(k + "-u-nu-latn", { maximumFractionDigits: 1 }))).format(v); }
    catch (e) { return String(v); }
  }
  function decimalSep(lang) {
    try { var p = new Intl.NumberFormat((lang || "en") + "-u-nu-latn").formatToParts(1.5); for (var i = 0; i < p.length; i++) if (p[i].type === "decimal") return p[i].value; }
    catch (e) {}
    return ".";
  }
  function pcat(lang, n) {
    var k = lang || "en";
    try { return (PRC[k] || (PRC[k] = new Intl.PluralRules(k))).select(n); }
    catch (e) { return n === 1 ? "one" : "other"; }
  }
  function lookup(C, key, n) {
    var own = (C && C.T) || {}, en = (C && C.E) || own;
    if (n === undefined) return own[key] != null ? own[key] : en[key] != null ? en[key] : key;
    var c = pcat(C.lang, n), ce = pcat("en", n);
    if (own[key + "." + c] != null) return own[key + "." + c];
    if (own[key + ".other"] != null) return own[key + ".other"];
    if (en[key + "." + ce] != null) return en[key + "." + ce];
    return en[key + ".other"] != null ? en[key + ".other"] : key;
  }
  function fill(s, vars) {
    return String(s).replace(/\{([a-z_]+)\}/g, function (m, k) { return vars && vars[k] != null ? String(vars[k]) : m; });
  }
  function t(C, key, vars) { return fill(lookup(C, key), vars); }
  function tn(C, key, n, vars) {   // Pluralform fuer n; {n} = n in der Zahlenschreibweise der Sprache
    var v = { n: num(C, n) }; if (vars) for (var k in vars) v[k] = vars[k];
    return fill(lookup(C, key, n), v);
  }

  /* ---- Regeln ---- */
  function clampStep(v, P) { return Math.min(P.stepper.max, Math.max(P.stepper.min, Math.round(+v || 0))); }
  function levelOf(tp, P) {
    if (tp.custom) return P.levels.custom;
    if (!tp.rated || !(tp.lvl >= 1)) return P.levels.unrated;
    return tp.lvl;
  }
  function prRecommendation(rt, nTopics, P) {   // 1/1/2/4 nach Laufzeit, ab zwei Themen mal Anzahl der Themen, hoechstens pr_rec_cap
    var b = +P.pr_rec[rt] || 0;
    return nTopics > 1 ? Math.min(P.pr_rec_cap, b * nTopics) : b;
  }
  function recRuntime(levels, P) {   // Schwierigkeit -> empfohlene Laufzeit (Monate); ohne Thema none_runtime
    if (!levels.length) return P.levels.none_runtime;
    var m = 0;
    for (var i = 0; i < levels.length; i++) m = Math.max(m, +P.levels.runtime[levels[i]] || 0);
    return m;
  }
  function pct(v, P) { return Math.min(100, v / P.effect.scale_months * 100); }
  function effect(s, hardest, prCount, P) {   // Zeit bis zur Wirkung (Monate): Grundspannen, Abzuege in fester Reihenfolge, mal Faktor des schwersten Themas, Mindestwerte
    var E = P.effect, g = E.base.geo.slice(), q = E.base.seo.slice();
    for (var i = 0; i < E.adjust.length; i++) {
      var a = E.adjust[i], on = a["if"] === "lang" ? s.l14 : s[a["if"]];
      if (!on) continue;
      var k = a.per_article != null ? Math.min(prCount, a.max_articles) * a.per_article : 1;
      g[0] -= a.geo[0] * k; g[1] -= a.geo[1] * k; q[0] -= a.seo[0] * k; q[1] -= a.seo[1] * k;
    }
    var m = +P.levels.mult[hardest];
    var ga = Math.max(E.min.geo, g[0] * m), gb = Math.max(ga + E.min.geo_span, g[1] * m);
    var sa = Math.max(E.min.seo, q[0] * m), sb = Math.max(sa + E.min.seo_span, q[1] * m);
    return { geo: [ga, gb], seo: [sa, sb], geoR: span(ga, gb, P), seoR: span(sa, sb, P),
             bars: { geo: [pct(ga, P), pct(gb, P)], seo: [pct(sa, P), pct(sb, P)] } };
  }
  function span(a, b, P) {   // eine Einheit je Spanne: Wochen nur, wenn das Ende unter weeks_below Monaten liegt
    var E = P.effect;
    if (b < E.weeks_below) return { unit: "weeks", a: Math.round(a * E.weeks_per_month), b: Math.round(b * E.weeks_per_month) };
    return { unit: "months", a: Math.round(a * 10) / 10, b: Math.round(b * 10) / 10 };
  }
  function tipsFor(s, r) {
    var tips = [];
    if (s.rt < r.recRt) tips.push("rt<recRt");
    if (s.goal === "ai") { if (!s.pr) tips.push("ai:noPR"); if (!s.auth && r.hardest >= r.hardFrom) tips.push("ai:noAuthHard"); }
    if (s.goal === "vis") { if (!s.video) tips.push("vis:noVideo"); if (!s.l14) tips.push("vis:noLang"); if (!s.topic) tips.push("vis:noTopic"); }
    if (s.goal === "lead") { tips.push("lead:dash"); if (!s.video) tips.push("lead:noVideo"); if (!s.expert) tips.push("lead:noExpert"); }
    if (r.n > 2) tips.push("manyTopics");
    if (!tips.length) tips.push("fits");
    return tips;
  }

  /* s = {goal: ai|vis|lead, rt, topics: [{id, name, en, lvl, rated, example, custom, url}], video, pr, auth, dash, l14, topic, expert, li, live, con,
          cnt: {pr, ex, li, lv}, prTouched}   live = Livesession (LinkedIn M365 Show + YouTube), je Stueck, einmalig, ohne Rabatt */
  function compute(s, P) {
    var pr = P.prices, n = s.topics.length, packs = Math.max(1, n), cnt = s.cnt || {};
    var lv = s.topics.map(function (tp) { return levelOf(tp, P); });
    var prRec = prRecommendation(s.rt, n, P), prCount = s.prTouched ? clampStep(cnt.pr, P) : prRec;
    var ex = clampStep(cnt.ex, P), li = clampStep(cnt.li, P), lvN = clampStep(cnt.lv, P);
    var rate = +P.discount[s.rt] || 0;
    var discBase = (pr.base + (s.video ? pr.video : 0)) * packs, discount = Math.round(discBase * rate);
    var monthly = discBase - discount + (s.auth ? pr.auth : 0) + (s.topic ? pr.topic : 0) + (s.li ? li * pr.li : 0) + (s.l14 ? pr.lang : 0);
    var dash = !!(s.dash || s.goal === "lead");   // Leads: Dashboard Pflicht
    var oneOff = (s.pr ? prCount * pr.pr : 0) + (dash ? pr.dash : 0) + (s.expert ? ex * pr.expert : 0) + (s.live ? lvN * pr.live : 0);
    var hardest = n ? Math.max.apply(null, lv) : P.levels.none, recRt = recRuntime(lv, P);
    var eff = effect(s, hardest, prCount, P);
    return { n: n, packs: packs, levels: lv, prRec: prRec, prCount: prCount, ex: ex, li: li, lv: lvN, discountRate: rate, discountPct: Math.round(rate * 100),
             discBase: discBase, discount: discount, monthly: monthly, oneOff: oneOff, total: monthly * s.rt + oneOff, dash: dash,
             hardest: hardest, recRt: recRt, geo: eff.geo, seo: eff.seo, geoR: eff.geoR, seoR: eff.seoR, bars: eff.bars, run: pct(s.rt, P),
             tips: tipsFor(s, { recRt: recRt, hardest: hardest, hardFrom: P.levels.hard_from, n: n }) };
  }

  /* ---- Texte der Ansicht ---- */
  function months(C, m) { return tn(C, "months", m); }
  function rtLabel(C, P, l) { var m = +P.levels.runtime[l]; return tn(C, l >= P.levels.hard_from ? "months_plus" : "months", m); }
  function lvlName(C, l) { return t(C, "lvl" + l); }
  function badge(C, tp, P) {
    if (tp.custom) return "";
    if (!tp.rated) return t(C, "lvl_unrated");
    return tp.example ? t(C, "lvl_example", { level: lvlName(C, tp.lvl) }) : lvlName(C, tp.lvl);
  }
  function rangeText(C, R) {
    var k = R.unit === "weeks" ? "weeks_in" : "months_in";
    return t(C, "range", { a: tn(C, k, R.a), b: tn(C, k, R.b) });
  }
  function rows(s, r, P, C, ctx) {   // Zeilen der Preisuebersicht: {k, label, amount, cls, monthly}
    var pr = P.prices, out = [], nT = tn(C, "topics", r.packs);
    function add(k, label, amount, cls, monthly) { out.push({ k: k, label: label, amount: amount, cls: cls || "", monthly: !!monthly }); }
    add("base", t(C, "row_base", { topics: nT }), fmtUsd(pr.base * r.packs), "", true);
    if (s.video) add("video", t(C, "row_video", { topics: nT }), fmtUsd(pr.video * r.packs), "", true);
    if (r.discount > 0) add("disc", t(C, "row_disc", { pct: num(C, r.discountPct) }), fmtUsd(-r.discount), "save", true);
    if (s.auth) add("auth", t(C, "row_auth"), fmtUsd(pr.auth), "", true);
    if (s.topic) add("topic", t(C, "row_topic"), fmtUsd(pr.topic), "", true);
    if (s.li) add("li", t(C, "row_li", { n: num(C, r.li) }), fmtUsd(r.li * pr.li), "", true);
    if (s.l14) add("l14", t(C, "row_lang", { n: num(C, ctx.nLangs) }), fmtUsd(pr.lang), "", true);
    add("month", t(C, "row_month"), fmtUsd(r.monthly), "sum");
    if (s.pr) add("pr", t(C, "row_pr", { n: num(C, r.prCount) }), fmtUsd(r.prCount * pr.pr));
    if (s.expert) add("expert", t(C, "row_expert", { n: num(C, r.ex) }), fmtUsd(r.ex * pr.expert));
    if (s.live) add("live", t(C, "row_live", { n: num(C, r.lv) }), fmtUsd(r.lv * pr.live));
    if (r.dash) add("dash", t(C, "row_dash"), fmtUsd(pr.dash));
    if (s.con && ctx.con !== false) add("con", t(C, "row_con"), t(C, "on_request"));
    add("total", t(C, "row_total"), fmtUsd(r.total), "sum");
    return out;
  }
  function tipText(C, P, ctx, r, code) {
    switch (code) {
      case "rt<recRt": return t(C, "tip_runtime", { runtime: months(C, r.recRt) });
      case "ai:noPR": return t(C, "tip_ai_pr");
      case "ai:noAuthHard": return t(C, "tip_ai_auth");
      case "vis:noVideo": return t(C, "tip_vis_video");
      case "vis:noLang": return t(C, "tip_vis_lang", { n: num(C, ctx.nLangs) });
      case "vis:noTopic": return t(C, "tip_vis_topic", { n: num(C, P.topic_sponsors_max) });
      case "lead:dash": return t(C, "tip_lead_dash");
      case "lead:noVideo": return t(C, "tip_lead_video");
      case "lead:noExpert": return t(C, "tip_lead_expert");
      case "manyTopics": return t(C, "tip_many", { topics_mean: tn(C, "topics_mean", r.n), episodes: tn(C, "episodes", r.n * P.episodes_per_topic) });
      default: return t(C, "tip_fits");
    }
  }
  function view(s, P, C, ctx) {
    ctx = ctx || {};
    var r = compute(s, P), eps = r.packs * P.episodes_per_topic;
    var v = { calc: r, counts: { pr: r.prCount, ex: r.ex, li: r.li, lv: r.lv } };
    v.pkCount = t(C, "pk_count", { topics: tn(C, "topics", r.packs), episodes: tn(C, "episodes_month", eps) });
    v.prRec = t(C, "pr_rec", { runtime: months(C, s.rt), topics: tn(C, "topics", r.packs), articles: tn(C, "articles", r.prRec) });
    v.prRecShow = !!s.pr;
    v.rtRec = t(C, "rt_rec", { runtime: months(C, r.recRt) });
    v.monthly = fmtUsd(r.monthly);
    v.totalLine = t(C, "total_line", { total: fmtUsd(r.total), runtime: months(C, s.rt) });
    v.noTopic = !r.n;
    v.rows = rows(s, r, P, C, ctx);
    v.tText = t(C, "t_text", { hardest: t(C, "t_hardest", { level: lvlName(C, r.hardest) }), geo: t(C, "t_geo", { range: rangeText(C, r.geoR) }),
                               seo: t(C, "t_seo", { range: rangeText(C, r.seoR) }), tail: t(C, "t_tail") });
    v.recHead = t(C, "rec_" + s.goal);
    v.tips = r.tips.map(function (c) { return tipText(C, P, ctx, r, c); });
    v.lock = s.goal === "lead";
    v.summary = t(C, "req_summary", { monthly: fmtUsd(r.monthly), total: fmtUsd(r.total), runtime: months(C, s.rt) });
    v.bars = { geo: [r.bars.geo[0], r.bars.geo[1] - r.bars.geo[0]], seo: [r.bars.seo[0], r.bars.seo[1] - r.bars.seo[0]], run: r.run };
    return v;
  }

  /* ---- HTML-Bausteine (auch fuer das Vorab-Rendern im Seitenbau) ---- */
  function rowsHtml(list) {
    return list.map(function (x) {
      return '<div class="spn-row' + (x.cls ? " spn-" + x.cls : "") + '"><span>' + esc(x.label) + '</span><span class="spn-amt" dir="ltr">' + esc(x.amount) + "</span></div>";
    }).join("");
  }
  function recHtml(v) { return '<strong>' + esc(v.recHead) + "</strong>" + v.tips.map(function (x) { return '<span>' + esc(x) + "</span>"; }).join(""); }
  function pickedHtml(s, P, C) {
    if (!s.topics.length) return '<p class="spn-empty">' + esc(t(C, "picked_empty")) + "</p>";
    var maxL = Object.keys(P.levels.mult).length;
    return '<ul class="spn-plist">' + s.topics.map(function (tp, i) {
      var l = levelOf(tp, P), meta;
      if (tp.custom) meta = t(C, "picked_custom");
      else if (!tp.rated) meta = t(C, "picked_unrated", { runtime: rtLabel(C, P, l) });
      else meta = t(C, "picked_meta", { level: badge(C, tp, P), runtime: rtLabel(C, P, l) });
      var name = tp.url ? '<a href="' + esc(tp.url) + '">' + esc(tp.name) + "</a>" : esc(tp.name);
      return '<li class="spn-prow"><div><strong>' + name + '</strong><span class="spn-meta">' + esc(meta) + "</span></div>" +
        '<span class="spn-meter" aria-hidden="true"><i style="width:' + Math.round(100 * l / maxL) + '%"></i></span>' +
        '<button type="button" class="spn-rm" data-rm="' + i + '" aria-label="' + esc(t(C, "remove", { name: tp.name })) + '">×</button></li>';
    }).join("") + "</ul>";
  }

  /* ---- Anfrage: Paket v1 (nur Zeichenketten, englische Bezeichnungen, Tiefe <= 2, <= 30 Schluessel, <= 5000 Zeichen) ---- */
  var COMPONENTS = { base: 1, video: 1, disc: 1, auth: 1, pr: 1 }, EXTRAS = { l14: 1, topic: 1, li: 1, expert: 1, live: 1, dash: 1, con: 1 };
  function buildPackage(s, P, C, ctx) {
    var E = { lang: "en", T: (C && C.E) || (C && C.T) || {}, E: (C && C.E) || (C && C.T) || {} };
    var r = compute(s, P), list = rows(s, r, P, E, ctx);
    function line(x) { return t(E, x.monthly ? "pkg_line_month" : "pkg_line", { label: x.label, amount: x.amount }); }
    function rng(R) { return t(E, R.unit === "weeks" ? "pkg_range_weeks" : "pkg_range_months", { a: num(E, R.a), b: num(E, R.b) }); }
    var topics = s.topics.slice(0, P.max_topics).map(function (tp) {
      var nm = clean(tp.en || tp.name).slice(0, 200);
      if (tp.custom) return t(E, "pkg_own", { name: nm });
      if (!tp.rated) return t(E, "pkg_unrated", { name: nm });
      return t(E, tp.example ? "pkg_example" : "pkg_rated", { name: nm, level: lvlName(E, tp.lvl) });
    });
    var pkg = { v: "1", goal: t(E, "pkg_goal_" + s.goal), topics: topics, duration: months(E, s.rt),
                components: list.filter(function (x) { return COMPONENTS[x.k]; }).map(line),
                extras: list.filter(function (x) { return EXTRAS[x.k]; }).map(line),
                monthlyUsd: fmtUsd(r.monthly), oneOffUsd: fmtUsd(r.oneOff), totalUsd: fmtUsd(r.total), discount: r.discountPct + "%",
                effect: t(E, "pkg_effect", { geo: rng(r.geoR), seo: rng(r.seoR) }), page: String(ctx.page || "") };
    while (JSON.stringify(pkg).length > 5000 && pkg.topics.length > 1) pkg.topics.pop();
    return pkg;
  }
  function validate(f, nTopics) {   // wie der Server: Firma und Name mind. 2 Zeichen, E-Mail nach EMAIL_RE (<= 254), mindestens ein Thema
    var e = {}, c = clean(f.company), n = clean(f.name), m = clean(f.email);
    if (c.length < 2) e.company = "err_company";
    if (n.length < 2) e.name = "err_name";
    if (m.length > 254 || !EMAIL_RE.test(m)) e.email = "err_email";
    if (!nTopics) e.topics = "err_topics";
    return e;
  }
  function requestBody(f, pkg, lang) {
    return { company: clean(f.company).slice(0, 160), name: clean(f.name).slice(0, 120), email: clean(f.email).toLowerCase().slice(0, 254),
             message: String(f.message || "").replace(STRIP_RE, "").trim().slice(0, 2000), package: pkg, website: String(f.website || ""), lang: lang || "en" };
  }
  function errorKey(status, j) {   // Antwort der API -> Textschluessel (null = gesendet)
    if (status === 200 && j && j.ok) return null;
    if (status === 400) return "err_400";
    if (status === 429) return "err_429";
    return "err_send";
  }
  function stateKey(s) {
    return JSON.stringify([s.goal, s.rt, s.topics.map(function (x) { return x.id; }), !!s.video, !!s.pr, !!s.auth, !!s.dash, !!s.l14, !!s.topic, !!s.expert,
                           !!s.li, !!s.con, s.prTouched ? s.cnt.pr : 0, s.cnt.ex, s.cnt.li, !!s.live, s.cnt.lv]);
  }

  /* ---- Vorab-Rendern im Seitenbau (tools/sponsor_ssr.mjs): Standardpaket je Sprache + Zahlen fuer die Belegkarten ---- */
  function ssr(input) {
    var out = {};
    (input.langs || []).forEach(function (L) {
      var C = { lang: L.lang, T: L.T || {}, E: input.E, dec: decimalSep(L.lang) }, ctx = { nLangs: input.nLangs, con: input.con, page: L.page };
      var v = view(L.state, input.P, C, ctx), nums = {};
      (L.nums || []).forEach(function (x) {
        var o = x[2] === "compact" ? { notation: "compact", maximumFractionDigits: 1 } : { maximumFractionDigits: 0 };
        try { nums[x[0]] = new Intl.NumberFormat(L.lang + "-u-nu-latn", o).format(x[1]); } catch (e) { nums[x[0]] = String(x[1]); }
      });
      out[L.lang] = { view: v, rowsHtml: rowsHtml(v.rows), recHtml: recHtml(v), pickedHtml: pickedHtml(L.state, input.P, C), key: stateKey(L.state), nums: nums, dec: C.dec,
                      rtLabels: input.P.runtimes.map(function (m) { return months(C, m); }) };
    });
    return out;
  }

  /* ---- Direkt bestellen per PayPal-Rechnung (#281): nur ohne M365Con (bleibt "auf Anfrage"). Der Server rechnet den Preis neu. ---- */
  function invoiceAllowed(s) { return !(s && s.con); }
  function orderPackage(s) {
    var c = s.cnt || {};
    return { goal: s.goal, rt: s.rt, topics: (s.topics || []).map(function (tp) { return clean(tp.en || tp.name).slice(0, 80); }),
             video: !!s.video, pr: !!s.pr, auth: !!s.auth, dash: !!s.dash, l14: !!s.l14, topic: !!s.topic, expert: !!s.expert, li: !!s.li, live: !!s.live,
             con: !!s.con, prTouched: !!s.prTouched, cnt: { pr: c.pr, ex: c.ex, li: c.li, lv: c.lv } };
  }

  return { EMAIL_RE: EMAIL_RE, esc: esc, clean: clean, fmtUsd: fmtUsd, num: num, decimalSep: decimalSep, plural: pcat, lookup: lookup, fill: fill, t: t, tn: tn,
           clampStep: clampStep, levelOf: levelOf, prRecommendation: prRecommendation, recRuntime: recRuntime, effect: effect, span: span, pct: pct,
           compute: compute, rows: rows, view: view, rangeText: rangeText, months: months, rowsHtml: rowsHtml, recHtml: recHtml, pickedHtml: pickedHtml, badge: badge,
           buildPackage: buildPackage, validate: validate, requestBody: requestBody, errorKey: errorKey, stateKey: stateKey, ssr: ssr,
           invoiceAllowed: invoiceAllowed, orderPackage: orderPackage };
});
