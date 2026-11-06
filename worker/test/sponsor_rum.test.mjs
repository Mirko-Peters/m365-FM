import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { handleSponsor } from "../src/sponsor.js";

// Cloudflare Web Analytics (Quelle cloudflare_rum) gegen ungefilterte Zonen-Anfragen (Quelle cloudflare):
// pro Platzierung+Tag+Pfad zaehlt der RUM-Wert, der Zonenwert nur dort, wo es keinen RUM-Wert gibt; die Quelle wird ehrlich beschriftet.
async function setup() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:");
  const dir = new URL("../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(f, dir), "utf-8"));
  const db = {
    prepare(sql) {
      const st = raw.prepare(sql); let args = [];
      const o = {
        bind(...a) { args = a; return o; },
        all: async () => ({ results: st.all(...args) }),
        first: async () => st.get(...args) ?? null,
        run: async () => { const r = st.run(...args); return { meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; },
      };
      return o;
    },
    async batch(stmts) { for (const st of stmts) await st.run(); },
  };
  raw.exec(`
    INSERT INTO users(id,provider,sub,name,role,banned,created) VALUES (1,'google','sponsor','Sponsor User','user',0,1);
    INSERT INTO orgs(id,handle,name,website,created) VALUES (1,'acme','Acme GmbH','https://acme.example/',1);
    INSERT INTO org_members(org_id,user_id,role,status,created) VALUES (1,1,'owner','active',1);
    INSERT INTO sponsor_placements(id,org_id,title,channel,langs,start,end,refs,created) VALUES
      ('acme-web',1,'Website placement','website','en','2026-10-01','2026-12-01','{}',1);
  `);
  const env = { DB: db, ADMIN_SUBS: "", SITE: "https://www.m365.fm", CRON_KEY: "test-cron-key" };
  const J = (data, status = 200, headers = {}) => new Response(JSON.stringify(data), { status, headers });
  const call = (path, method, user, body, extraHeaders = {}) => {
    const request = new Request(`https://api.example${path}`, {
      method, headers: { "content-type": "application/json", "x-requested-with": "m365", ...extraHeaders },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    return handleSponsor(env, request, new URL(request.url), new URL(request.url).pathname, J, user);
  };
  return { raw, call };
}

const row = (day, dim, value, source) => ({ placement_id: "acme-web", day, metric: "page_views", dim, value, source, kind: "measured" });

test("sponsor metrics: cloudflare_rum wird angenommen und ersetzt den Zonenwert desselben Tages und Pfads", async () => {
  const { call } = await setup();
  const cron = { "x-cron-key": "test-cron-key" };
  // Zone (ungefiltert) fuer drei Tage, Web Analytics nur fuer zwei davon (11-03 mit gemessener 0)
  let response = await call("/api/internal/sponsor-metrics", "POST", null, { metrics: [
    row("2026-10-28", "/entity/x/", 500, "cloudflare"),
    row("2026-11-02", "/entity/x/", 400, "cloudflare"),
    row("2026-11-03", "/entity/x/", 300, "cloudflare"),
    row("2026-11-02", "/entity/x/", 40, "cloudflare_rum"),
    row("2026-11-03", "/entity/x/", 0, "cloudflare_rum"),
  ] }, cron);
  assert.equal(response.status, 200, "Quelle cloudflare_rum ist erlaubt");
  assert.equal((await call("/api/internal/sponsor-metrics", "POST", null,
    { metrics: [{ ...row("2026-11-03", "/entity/x/", 1, "cloudflare_rum"), metric: "podcast_plays" }] }, cron)).status, 400,
    "cloudflare_rum liefert nur page_views");

  // Oktober + November: RUM fuer 11-02/11-03, Zone nur fuer 10-28 (vor Web Analytics) -> 500 + 40 + 0
  let result = await (await call("/api/sponsor/dashboard?from=2026-10-01&to=2026-11-30", "GET", { id: 1 })).json();
  let pv = result.orgs[0].metrics.find((m) => m.key === "page_views");
  assert.equal(pv.value, 540, "keine Doppelzaehlung: Zonenwert entfaellt, wo es einen RUM-Wert gibt");
  assert.equal(pv.source, "Cloudflare Analytics", "mit ungefilterten Tagen bleibt die Kennzeichnung der Zonen-Statistik");
  assert.deepEqual(result.orgs[0].placements[0].metrics.map((m) => [m.day, m.source, m.value]),
    [["2026-10-28", "cloudflare", 500], ["2026-11-02", "cloudflare_rum", 40], ["2026-11-03", "cloudflare_rum", 0]]);
  assert.equal(result.orgs[0].weekly.reduce((sum, w) => sum + w.website, 0), 540, "Wochenverlauf ohne Doppelzaehlung");

  // Nur November: ausschliesslich Web Analytics -> als solche beschriftet
  result = await (await call("/api/sponsor/dashboard?from=2026-11-01&to=2026-11-30", "GET", { id: 1 })).json();
  pv = result.orgs[0].metrics.find((m) => m.key === "page_views");
  assert.equal(pv.value, 40);
  assert.equal(pv.source, "Cloudflare Web Analytics");

  const detail = await (await call("/api/sponsor/placement?id=acme-web&from=2026-11-01&to=2026-11-30", "GET", { id: 1 })).json();
  const records = detail.metrics || detail.placement?.metrics || [];
  assert.deepEqual(records.map((m) => m.source), ["cloudflare_rum", "cloudflare_rum"], "Detailansicht ohne ersetzten Zonenwert");
});
