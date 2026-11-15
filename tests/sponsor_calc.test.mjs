// T37 Sponsor-Seite: assets/sponsor-calc.js gegen JEDEN Testvektor des Prototyps v2 (tests/sponsor_vectors.json, unveraendert aus
// spec_constants.json). Lauf: node --test tests/   (blockierender Schritt in .github/workflows/site.yml)
// Abweichungen vom Prototyp, alle aus design.md (D1/D2) und hier einzeln begruendet:
//   A1 D1 "14 languages = USD 300/Monat, ohne Rabatt, im Monatsbetrag": Monats- und Gesamtbetrag = output.usdTarget statt Prototyp-Wert;
//      die EUR-Zeile (t-eur, " · plus €…", "€300") gibt es nicht mehr, die Zeile "14 language shows" zeigt $300.
//   A2 D1 "no week/month unit mix": eine Spanne hat eine Einheit ("12 weeks to 5.1 months" -> "2.9 months to 5.1 months"),
//      GEO- und SEO-Spanne stehen in getrennten Saetzen (t-text: ", ranking gains" -> ". Ranking gains").
//   A3 Plural ueber Intl.PluralRules (Auftrag): "4 article(s)." -> "4 articles."; Zeilen "Base package × 2" -> "Base package × 2 topics"
//      (wie im Paket-Beispiel von design.md D2 "Base package × 2 topics – …").
//   A4 Ticket-Name "Digital PR" (spec §10 #15): Tipp "authority building adds …" -> "digital PR adds …", Zeile "Authority building" -> "Digital PR".
//   A5 Mirko, 6.11.2026: das Extra "Themen-Sponsoring" (1.500 USD/Monat, hoechstens 3 je Thema) gibt es nicht mehr; an seiner Stelle klappt
//      "Banner-Werbung" die Buchung der Werbeplaetze (#285) auf. Banner zaehlen nicht zum USD-Paketpreis (TKP in EUR vom Server) und nicht zur
//      Zeit bis zur Wirkung. Geaendert in tests/sponsor_vectors.json, nur wo "topic" vorkam:
//      - "1 very hard topic, 12 months, video+PR+auth+topic+lang" -> "... +banner ads+lang (A5)": topic -> ads; Monat 6.200 -> 4.700 USD,
//        Summe 76.400 -> 58.400 USD (ohne 1.500 USD x 12); SEO-Ende 7.41 -> 8.36 Monate (kein Topic-Abzug 0.5 x 1.9), Balken 57 -> 64.3077 %.
//      - "custom topic only (medium, to be rated), 6 months" -> "..., banner ads (A5)": topic -> ads; Monat 5.400 -> 3.900 USD,
//        Summe 32.400 -> 23.400 USD; SEO-Ende 6 -> 6.5 Monate, Balken 46.1538 -> 50 %. GEO bleibt (Mindestwerte).
//      - "1 medium topic, 3 months, video + PR" und vis_3m_no_topics_pr_off_dash_kept: Tipp vis:noTopic -> vis:noAds (Text tip_vis_ads).
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
const require = createRequire(import.meta.url);
const SC = require("../assets/sponsor-calc.js");
const root = new URL("..", import.meta.url);
const J = (p) => JSON.parse(readFileSync(new URL(p, root), "utf8"));
const P = J("data/sponsor_pricing.json"), I = J("data/sponsor_i18n.json"), V = J("tests/sponsor_vectors.json");
const EN = { lang: "en", T: I.en, E: I.en }, CTX = { nLangs: 14, page: "/sponsor/" };
const close = (a, b, msg) => assert.ok(Math.abs(a - b) < 1e-3, `${msg}: ${a} != ${b}`);
const LVL = { 1: "easy", 2: "medium", 3: "hard", 4: "very hard" };

function state(inp) {
  return { goal: inp.goal, rt: inp.rt, topics: (inp.picked || []).map(([name, lvl, custom], i) => ({ id: "t" + i, name, lvl, rated: !custom, custom: !!custom, example: false })),
           video: !!inp.video, pr: !!inp.pr, auth: !!inp.auth, dash: !!inp.dash, l14: !!inp.lang, ads: !!inp.ads, expert: !!inp.expert, li: !!inp.li, live: !!inp.live, con: !!inp.con,
           cnt: { pr: 2, ex: 1, li: 1, ...(inp.cnt || {}) }, prTouched: !!inp.prTouched };
}
const DEFAULT = { goal: "ai", rt: 6, picked: [["Your brand name", 1], ["Microsoft Teams Phone", 3]], pr: true };

for (const [name, vec] of Object.entries(V.test_vectors)) {
  test(`Vektor: ${name}`, () => {
    const o = vec.output, s = state(vec.input), r = SC.compute(s, P);
    assert.equal(r.packs, o.packs, "packs");
    assert.equal(r.prRec, o.prRec, "prRec");
    assert.equal(r.prCount, o.prCount, "prCount");
    close(r.discountRate, o.discountRate, "discountRate");
    assert.equal(r.discount, o.discount, "discount");
    assert.equal(r.oneOff, o.oneOffUsd, "oneOff");
    // A1: Monat/Gesamt in USD inkl. 14 Sprachen; ohne 14 Sprachen identisch mit dem Prototyp
    assert.equal(r.monthly, o.usdTarget.monthlyUsd, "monthly (USD-Ziel)");
    assert.equal(r.total, o.usdTarget.totalUsd, "total (USD-Ziel)");
    assert.equal(SC.fmtUsd(r.monthly), o.usdTarget.monthlyText);
    assert.equal(SC.fmtUsd(r.total), o.usdTarget.totalText);
    if (!o.eurLang) { assert.equal(r.monthly, o.monthlyUsd); assert.equal(r.total, o.totalUsd); }
    else { assert.equal(r.monthly, o.monthlyUsd + o.eurLang.perMonth, "A1: 14 Sprachen im Monat"); assert.equal(r.total, o.totalUsd + o.eurLang.runtime, "A1: 14 Sprachen in der Summe"); }
    assert.equal(LVL[r.hardest], o.hardest, "hardest");
    close(r.geo[0], o.geo[0], "geoA"); close(r.geo[1], o.geo[1], "geoB"); close(r.seo[0], o.seo[0], "seoA"); close(r.seo[1], o.seo[1], "seoB");
    close(r.bars.geo[0], o.barPct.geo[0], "bar geo left"); close(r.bars.geo[1], o.barPct.geo[1], "bar geo right");
    close(r.bars.seo[0], o.barPct.seo[0], "bar seo left"); close(r.bars.seo[1], o.barPct.seo[1], "bar seo right");
    close(r.run, o.barPct.run, "run marker");
    assert.equal(r.recRt, o.recRt, "recRt");
    assert.deepEqual(r.tips, o.tips, "tips");
    assert.equal(SC.rangeText(EN, r.geoR), o.geoText, "geoText");
    const seoText = o.seoText === "12 weeks to 5.1 months" ? "2.9 months to 5.1 months" : o.seoText;   // A2
    assert.equal(SC.rangeText(EN, r.seoR), seoText, "seoText");
    const v = SC.view(s, P, EN, CTX);
    assert.ok(!v.rows.some((x) => /€/.test(x.label + x.amount)), "A1: keine EUR-Zeile");
  });
}

// A1/A3/A4 auf die exakten Ausgaben des Prototyp-Skripts angewandt
function adaptRow([label, amount], usd) {
  label = label.replace(/^(Base|Video) package × (\d+)$/, (m, k, n) => `${k} package × ${n} topic${n === "1" ? "" : "s"}`)   // A3
               .replace(/^Authority building$/, "Digital PR");   // A4
  if (amount.startsWith("€")) amount = "$" + amount.slice(1);   // A1
  if (usd && label === "Per month") amount = usd.monthly;   // A1
  if (usd && label === "Total for the runtime") amount = usd.total;   // A1
  return [label, amount];
}
const adaptText = (s) => s.replace(/(\d+) article\(s\)\./, (m, n) => `${n} article${n === "1" ? "" : "s"}.`)   // A3
                        .replace(/, ranking gains in about/, ". Ranking gains in about")   // A2
                        .replace("authority building adds", "digital PR adds");   // A4

test("Prototyp-Ausgabe: Standard beim Laden", () => {
  const X = V.exact_outputs_from_prototype_script.default_on_load, v = SC.view(state(DEFAULT), P, EN, CTX);
  assert.equal(v.pkCount, X["pk-count"]);
  assert.equal(v.counts.pr, X["pr-count"]);
  assert.equal(v.prRec, adaptText(X["pr-rec"]));
  assert.equal(v.rtRec, X["rt-rec"]);
  assert.equal(v.monthly, X["t-month"]);
  assert.equal(v.totalLine, X["t-total"]);
  assert.deepEqual(v.rows.map((x) => [x.label, x.amount]), X.rows.map((x) => adaptRow(x)));
  assert.equal(v.tText, adaptText(X["t-text"]));
  assert.deepEqual([v.recHead, ...v.tips], X.rec.map(adaptText));
  close(v.bars.geo[0], X.bars_pct.geo_left, "geo left"); close(v.bars.geo[1], X.bars_pct.geo_width, "geo width");
  close(v.bars.seo[0], X.bars_pct.seo_left, "seo left"); close(v.bars.seo[1], X.bars_pct.seo_width, "seo width"); close(v.bars.run, X.bars_pct.run, "run");
  assert.equal(v.prRecShow, true); assert.equal(v.lock, false); assert.equal(v.noTopic, false);
});

test("Prototyp-Ausgabe: Leads, 12 Monate, Video, 14 Sprachen, LinkedIn × 1, PR (A1: $7,200 / $90,900)", () => {
  const X = V.exact_outputs_from_prototype_script.lead_12m_video_lang_li1_pr;
  const s = state({ ...DEFAULT, goal: "lead", rt: 12, video: true, lang: true, li: true }), v = SC.view(s, P, EN, CTX);
  const usd = { monthly: X.usd_target.monthly, total: X.usd_target.total };
  assert.equal(v.counts.pr, X["pr-count"]);
  assert.equal(v.monthly, usd.monthly);
  assert.equal(v.totalLine, `${usd.total} for 12 months, incl. one-time items`);   // A1: ohne " · plus €3600"
  assert.deepEqual(v.rows.map((x) => [x.label, x.amount]), X.rows.map((x) => adaptRow(x, usd)));
  assert.equal(v.tText, adaptText(X["t-text"]));
  assert.deepEqual([v.recHead, ...v.tips], X.rec);
  assert.equal(v.lock, true, "Dashboard gesperrt bei Leads"); assert.equal(v.calc.dash, true);
});

test("Prototyp-Ausgabe: Markensichtbarkeit, 3 Monate, ohne Thema, ohne PR, Dashboard bleibt nach Leads an", () => {
  const X = V.exact_outputs_from_prototype_script.vis_3m_no_topics_pr_off_dash_kept;
  const s = state({ goal: "vis", rt: 3, picked: [], pr: false, dash: X["x-dash"].checked }), v = SC.view(s, P, EN, CTX);
  assert.equal(v.pkCount, X["pk-count"]);
  assert.equal(v.prRec, adaptText(X["pr-rec"]));
  assert.equal(v.prRecShow, false, "PR-Hinweis nur mit PR-Artikeln (D1)");
  assert.equal(v.rtRec, X["rt-rec"]);
  assert.equal(v.monthly, X["t-month"]);
  assert.equal(v.totalLine, X["t-total"]);
  assert.equal(v.tText, adaptText(X["t-text"]));
  assert.deepEqual([v.recHead, ...v.tips], X.rec);
  assert.equal(v.lock, X["x-dash"].disabled); assert.equal(v.noTopic, true);
  assert.equal(SC.pickedHtml(s, P, EN), '<p class="spn-empty">Pick at least one topic above.</p>');
});

test("Paket v1: Form, nur Zeichenketten, englisch, Grenzen der API", () => {
  const vec = V.test_vectors["goal lead, 2 topics (hard, medium), 6 months, video, expert x2, LinkedIn x2, PR"];
  const s = state(vec.input); s.topics[0].example = true;
  const de = { lang: "de", T: I.de, E: I.en };
  const pkg = SC.buildPackage(s, P, de, { nLangs: 14, page: "/de/sponsor/" });
  assert.deepEqual(Object.keys(pkg), ["v", "goal", "topics", "duration", "components", "extras", "monthlyUsd", "oneOffUsd", "totalUsd", "discount", "effect", "page"]);
  assert.deepEqual(pkg, {
    v: "1", goal: "Leads", topics: ["Windows 365 (hard, example rating)", "Teams Rooms (medium)"], duration: "6 months",
    components: ["Base package × 2 topics – $6,000/month", "Video package × 2 topics – $2,000/month", "Runtime discount −10 % – −$800/month", "PR articles × 4 (one-time) – $2,000"],
    extras: ["LinkedIn newsletter × 2 – $200/month", "Expert episodes × 2 (one-time) – $300", "Sponsor dashboard (one-time) – $500"],
    monthlyUsd: "$7,400", oneOffUsd: "$2,800", totalUsd: "$47,200", discount: "10%",
    effect: "AI citations in ~6–8 weeks, rankings in ~4.1–8.3 months", page: "/de/sponsor/" });
  const big = state({ goal: "vis", rt: 12, picked: Array.from({ length: 25 }, (_, i) => ["x".repeat(78) + i, 2, true]), video: true, lang: true, ads: true, li: true, expert: true, pr: true, con: true });
  const p2 = SC.buildPackage(big, P, EN, { nLangs: 14, page: "/sponsor/", con: true });
  const js = JSON.stringify(p2);
  assert.ok(js.length <= 5000, "<= 5000 Zeichen: " + js.length);
  assert.ok(Object.keys(p2).length <= 30);
  for (const [k, val] of Object.entries(p2)) {
    if (Array.isArray(val)) { assert.ok(val.length <= 20, k); val.forEach((x) => { assert.equal(typeof x, "string"); assert.ok(x.length <= 300); }); }
    else assert.equal(typeof val, "string", k);
  }
  assert.ok(p2.extras.includes("M365Con 2027 – on request"));
  for (const k of ["goal", "topics", "duration", "components", "monthlyUsd", "totalUsd"]) assert.ok(k in p2, k);   // Mail/Admin lesen diese Schluessel
});

// Issue #260: Livesession (LinkedIn-Unternehmensseite M365 Show + YouTube), je Stueck einmalig, ohne Laufzeitrabatt
test("Livesession: 1.000 USD je Stueck, einmalig, ohne Rabatt, Zeile und Paket", () => {
  assert.equal(P.prices.live, 1000);
  assert.equal(P.units.live, "each");
  const off = SC.compute(state(DEFAULT), P);
  for (const [rt, n] of [[1, 1], [6, 2], [12, 3]]) {
    const s = state({ ...DEFAULT, rt, live: true, cnt: { lv: n } }), r = SC.compute(s, P);
    const base = SC.compute(state({ ...DEFAULT, rt }), P);
    assert.equal(r.lv, n);
    assert.equal(r.monthly, base.monthly, "nicht im Monatsbetrag");
    assert.equal(r.discount, base.discount, "kein Rabatt auf die Livesession");
    assert.equal(r.oneOff, base.oneOff + n * 1000, "einmalig je Stueck");
    assert.equal(r.total, base.total + n * 1000);
  }
  // Vektor 6 Monate, Standard + 2 Livesessions: $34,400 + $2,000
  const s = state({ ...DEFAULT, live: true, cnt: { lv: 2 } }), v = SC.view(s, P, EN, CTX);
  assert.equal(off.total, 34400);
  assert.equal(v.totalLine, "$36,400 for 6 months, incl. one-time items");
  const row = v.rows.find((x) => x.k === "live");
  assert.deepEqual([row.label, row.amount, row.monthly], ["Live sessions × 2 (one-time)", "$2,000", false]);
  assert.equal(v.counts.lv, 2);
  assert.ok(!SC.view(state(DEFAULT), P, EN, CTX).rows.some((x) => x.k === "live"), "ohne Haken keine Zeile");
  const pkg = SC.buildPackage(s, P, { lang: "de", T: I.de, E: I.en }, CTX);
  assert.ok(pkg.extras.includes("Live sessions × 2 (one-time) – $2,000"), JSON.stringify(pkg.extras));
  assert.equal(pkg.totalUsd, "$36,400");
  // Stepper-Grenzen wie bei den anderen Zaehlern; ohne Zaehler gilt 1
  assert.equal(SC.compute(state({ ...DEFAULT, live: true, cnt: { lv: 99 } }), P).lv, P.stepper.max);
  const s0 = state({ ...DEFAULT, live: true }); delete s0.cnt.lv;
  assert.equal(SC.compute(s0, P).oneOff, off.oneOff + 1000);
  assert.notEqual(SC.stateKey(s), SC.stateKey(state(DEFAULT)), "Zustandsschluessel kennt die Livesession");
  for (const lang of Object.keys(I).filter((k) => k !== "_doc"))
    for (const k of ["live_h", "live_hint", "live_note", "live_stepper", "row_live", "unit_session"]) assert.ok(I[lang][k], `${lang}: ${k}`);
});

// A5: Banner-Werbung statt Themen-Sponsoring - Zeile nach der USD-Summe, Betrag nur vom Server, Paketzeile fuer die Anfrage
test("Banner-Werbung: nicht im USD-Preis, eigene Zeile, Zusammenfassung, Paket, Tipp, keine Platzgrenze", () => {
  assert.ok(!("topic" in P.prices) && !("topic_sponsors_max" in P), "kein Themen-Sponsoring mehr in den Preisen");
  assert.ok(!P.effect.adjust.some((a) => a.if === "topic" || a.if === "ads"), "Banner aendern die Zeit bis zur Wirkung nicht");
  const off = SC.compute(state(DEFAULT), P);
  const sel = { product: "banner_mid", name: "Middle banner (300×250)", page_types: ["episode", "entity", "blog"], topics: ["teams-phone"], months: 3, quantity: 20000, exclusive: false, net_cents: 62500 };
  const s = { ...state(DEFAULT), ads: true, adsSel: sel }, r = SC.compute(s, P);
  assert.equal(r.monthly, off.monthly); assert.equal(r.total, off.total); assert.deepEqual(r.seo, off.seo);
  const v = SC.view(s, P, EN, CTX), rows = v.rows.map((x) => x.k);
  assert.deepEqual(rows.slice(-2), ["total", "ads"], "Banner nach der USD-Summe");
  const row = v.rows.find((x) => x.k === "ads");
  assert.deepEqual([row.label, row.amount, row.cls], ["Banner advertising · 20,000 impressions (net, EUR, billed separately)", "€625.00", "ads"]);
  assert.equal(v.summary, "Your package: $5,400 per month, $34,400 for 6 months. Plus banner advertising: €625.00 net, billed separately.");
  const de = SC.view(s, P, { lang: "de", T: I.de, E: I.en }, CTX).rows.find((x) => x.k === "ads");
  assert.deepEqual([de.label, de.amount], ["Banner-Werbung · 20.000 Einblendungen (netto, EUR, separat berechnet)", "625,00\u00a0€"]);
  // ohne Preis vom Server (Abfrage laeuft noch / API nicht erreichbar): offen, nie ein selbst gerechneter Betrag
  const open = SC.view({ ...s, adsSel: { ...sel, net_cents: null } }, P, EN, CTX);
  assert.equal(open.rows.find((x) => x.k === "ads").amount, "price follows");
  assert.equal(open.summary, "Your package: $5,400 per month, $34,400 for 6 months. Plus banner advertising – the price follows with our offer.");
  assert.equal(SC.view({ ...state(DEFAULT), ads: true }, P, EN, CTX).rows.find((x) => x.k === "ads").label, "Banner advertising", "vor der ersten Abfrage");
  // Anfrage (Buchung aus): Auswahl als eine englische Zeile in extras, Schluessel des Pakets unveraendert
  const pkg = SC.buildPackage(s, P, { lang: "de", T: I.de, E: I.en }, CTX);
  assert.deepEqual(Object.keys(pkg), ["v", "goal", "topics", "duration", "components", "extras", "monthlyUsd", "oneOffUsd", "totalUsd", "discount", "effect", "page"]);
  assert.ok(pkg.extras.includes("Banner advertising: Middle banner (300×250), 20,000 impressions, 3 months, pages: episode, entity, blog, topics: teams-phone – €625.00 net"), JSON.stringify(pkg.extras));
  assert.equal(pkg.totalUsd, "$34,400");
  assert.ok(!("topic" in SC.orderPackage(s)) && !("ads" in SC.orderPackage(s)), "Banner nicht in der Paket-Bestellung (eigene Buchung)");
  assert.notEqual(SC.stateKey(s), SC.stateKey(state(DEFAULT)), "Zustandsschluessel kennt die Banner-Werbung");
  // Tipp fuer Markensichtbarkeit; ohne Haken ein Hinweis auf Banner, keine Platzgrenze mehr im Text
  const vis = SC.view(state({ goal: "vis", rt: 6, picked: [["Teams Rooms", 2]], video: true, lang: true }), P, EN, CTX);
  assert.ok(vis.calc.tips.includes("vis:noAds"));
  assert.ok(!SC.view({ ...state({ goal: "vis", rt: 6, picked: [["Teams Rooms", 2]], video: true, lang: true }), ads: true }, P, EN, CTX).calc.tips.includes("vis:noAds"));
  for (const lang of Object.keys(I).filter((k) => k !== "_doc")) {
    for (const k of ["ads_h", "ads_hint", "ads_price", "unit_cpm", "ads_on", "ads_off", "row_ads", "row_ads_open", "sum_ads", "sum_ads_open", "tip_vis_ads"]) assert.ok(I[lang][k], `${lang}: ${k}`);
    for (const k of ["topic_h", "topic_hint", "row_topic", "tip_vis_topic"]) assert.ok(!(k in I[lang]), `${lang}: ${k} entfernt`);
    assert.ok(!/\{n\}/.test(I[lang].tip_vis_ads), `${lang}: keine Platzzahl`);
  }
});

test("Formularpruefung wie die API und Fehlerzuordnung", () => {
  assert.deepEqual(SC.validate({ company: "A", name: " B ", email: "x@y" }, 0), { company: "err_company", name: "err_name", email: "err_email", topics: "err_topics" });
  assert.deepEqual(SC.validate({ company: "Ab", name: "Cd", email: "ab@example.com" }, 1), {});
  assert.deepEqual(SC.validate({ company: "​A​", name: "Cd", email: "AB@Example.COM" }, 1), { company: "err_company" }, "Nullbreiten-Zeichen zaehlen nicht");
  assert.equal(SC.errorKey(200, { ok: true }), null);
  assert.equal(SC.errorKey(400, { error: "bad_request" }), "err_400");
  assert.equal(SC.errorKey(429, { error: "rate_limit" }), "err_429");
  assert.equal(SC.errorKey(500, { error: "server" }), "err_send");
  assert.equal(SC.errorKey(0, null), "err_send");
  const b = SC.requestBody({ company: " Firma ", name: "Name", email: " A@B.DE ", message: "Hallo", website: "" }, { v: "1" }, "de");
  assert.deepEqual(b, { company: "Firma", name: "Name", email: "a@b.de", message: "Hallo", package: { v: "1" }, website: "", lang: "de" });
});

test("Plural: Intl.PluralRules je Sprache, Rueckfall je Schluessel auf Englisch mit englischer Regel", () => {
  const ru = { lang: "ru", T: { "episodes.one": "{n} выпуск", "episodes.few": "{n} выпуска", "episodes.many": "{n} выпусков", "episodes.other": "{n} выпуска" }, E: I.en };
  assert.equal(SC.tn(ru, "episodes", 31), "31 выпуск");
  assert.equal(SC.tn(ru, "episodes", 62), "62 выпуска");
  assert.equal(SC.tn(ru, "episodes", 25), "25 выпусков");
  assert.equal(SC.tn(ru, "topics", 21), "21 topics", "ohne russischen Text: englische Form nach englischer Regel");
  assert.equal(SC.tn({ lang: "pl", T: {}, E: I.en }, "months", 1), "1 month");
  assert.equal(SC.tn({ lang: "de", T: I.de, E: I.en }, "months_in", 4.8), "4,8 Monaten");
  assert.equal(SC.tn({ lang: "ar", T: {}, E: I.en }, "weeks_in", 7), "7 weeks", "lateinische Ziffern");
  const de = SC.view(state(DEFAULT), P, { lang: "de", T: I.de, E: I.en }, CTX);
  assert.equal(de.pkCount, "× 2 Themen · 62 Folgen/Monat");
  assert.equal(de.prRec, "Empfohlen für 6 Monate und 2 Themen: 4 Artikel.");
  assert.equal(de.totalLine, "$34,400 für 6 Monate, inkl. Einmalposten");
  assert.equal(de.tText, "Schwierigstes Thema: schwer. Erste KI-Zitate in etwa 7 Wochen bis 11 Wochen. Bessere Rankings in etwa 4,8 Monaten bis 9 Monaten. Die gestrichelte Linie markiert das Ende Ihrer Laufzeit. Schätzung, keine Garantie.");
});

test("Eigenes Thema wird escaped", () => {
  const s = state({ ...DEFAULT, picked: [['<img src=x onerror=alert(1)>"&', 2, true]] });
  const h = SC.pickedHtml(s, P, EN);
  assert.ok(!h.includes("<img"), h);
  assert.ok(h.includes("&lt;img src=x onerror=alert(1)&gt;&quot;&amp;"));
});

test("Texte: de vollstaendig, gleiche Platzhalter wie en", () => {
  const ph = (s) => [...String(s).matchAll(/\{([a-z_]+)\}/g)].map((m) => m[1]).sort().join(",");
  for (const [k, v] of Object.entries(I.en)) {
    if (k.startsWith("pkg_")) { assert.ok(!(k in I.de), `${k} nur englisch`); continue; }
    assert.ok(k in I.de, `de fehlt: ${k}`);
    assert.equal(ph(I.de[k]), ph(v), `Platzhalter ${k}`);
  }
});

test("Keine Preise im JS ausser aus data/sponsor_pricing.json", () => {
  const prices = Object.values(P.prices).filter((x) => x !== 100);   // 100 ist auch der Prozentfaktor
  for (const f of ["assets/sponsor-calc.js", "assets/sponsor.js"]) {
    const src = readFileSync(new URL(f, root), "utf8").replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");
    for (const p of prices) assert.ok(!new RegExp(`\\b${p}\\b`).test(src), `${f} enthaelt ${p}`);
  }
});

test("Zahlen: vorab bestimmtes Dezimalzeichen ergibt dasselbe wie Intl.NumberFormat (alle 15 Sprachen)", () => {
  for (const lang of ["en", "de", "es", "fr", "it", "pt", "nl", "pl", "id", "ru", "uk", "ar", "he", "ja", "ko"]) {
    const intl = { lang }, fast = { lang, dec: SC.decimalSep(lang) };
    for (const v of [0, 1, 2.9, 3, 4.8, 5.1, 8.3, 9, 10.5, 12, 14, 31, 62, 620, 999]) assert.equal(SC.num(fast, v), SC.num(intl, v), `${lang} ${v}`);
  }
});
