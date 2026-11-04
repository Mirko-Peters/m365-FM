import { afterEach, test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { campaignMail, claimCampaignStatus, claimCampaignTargets, conBanner, remindClaimCampaign, runClaimCampaign, startClaimCampaign } from "../src/claimcampaign.js";

const originalFetch = globalThis.fetch;
const originalNow = Date.now;
const address = (name) => `${name}${String.fromCharCode(64)}example.invalid`;
const seconds = 1_800_000_000;

afterEach(() => {
  globalThis.fetch = originalFetch;
  Date.now = originalNow;
});

async function database() {
  const { DatabaseSync } = await import("node:sqlite");
  const raw = new DatabaseSync(":memory:");
  const dir = new URL("../migrations/", import.meta.url);
  for (const file of readdirSync(dir).filter((name) => name.endsWith(".sql")).sort()) raw.exec(readFileSync(new URL(file, dir), "utf8"));
  const db = {
    prepare(sql) {
      const statement = raw.prepare(sql);
      let params = [];
      const adapter = {
        bind(...values) { params = values; return adapter; },
        async all() { return { results: statement.all(...params) }; },
        async first() { return statement.get(...params) ?? null; },
        async run() {
          const result = statement.run(...params);
          return { meta: { changes: Number(result.changes) } };
        },
      };
      return adapter;
    },
  };
  return { db, raw };
}

function sourceFetch(entities, speakers = []) {
  globalThis.fetch = async (url) => ({
    ok: true,
    json: async () => String(url).endsWith("/speakers.json") ? { speakers } : { entities },
  });
}

function liveEnv(db, send = async () => ({ messageId: "test" })) {
  return {
    DB: db,
    SITE: "https://www.m365.fm",
    API: "https://api-dub.m365.fm",
    MVP_COLLECTOR_LIVE: "1",
    MVP_COLLECTOR_URL: "https://www.m365.fm/community/collector/",
    CLAIM_CAMPAIGN_APPROVED: "1",
    EMAIL: { send },
  };
}

function addContact(raw, eid, name = eid) {
  raw.prepare("INSERT INTO entity_contacts(eid,email,name,created) VALUES(?,?,?,?)").run(eid, address(eid), name, seconds);
}

test("Zielliste schließt beanspruchte, eingeladene und abgemeldete Personen aus", async () => {
  const { db, raw } = await database();
  for (const eid of ["speaker", "guest", "both", "claimed", "invited", "blocked", "unmatched"]) addContact(raw, eid);
  raw.prepare("INSERT INTO entity_contact_lang(eid,lang) VALUES('guest','de')").run();
  raw.prepare("INSERT INTO entity_claims(eid,user_id,status,via,created) VALUES('claimed',1,'verified','manual',?)").run(seconds);
  raw.prepare("INSERT INTO entity_invites(token,eid,name,email,by_user,created) VALUES('token','invited','Invited',?,0,?)").run(address("invited"), seconds);
  raw.prepare("INSERT INTO invite_block(email,created) VALUES(?,?)").run(address("blocked"), seconds);
  sourceFetch([
    { id: "guest", type: "person", guest: true },
    { id: "both", type: "person", guest: true, speaker: true },
    { id: "claimed", type: "person", speaker: true },
    { id: "invited", type: "person", speaker: true },
    { id: "blocked", type: "person", guest: true },
  ], [{ id: "speaker" }, { id: "both" }]);
  const targets = await claimCampaignTargets({ DB: db, SITE: "https://www.m365.fm" });
  assert.deepEqual(targets.map(({ eid, source, lang }) => [eid, source, lang]), [
    ["both", "both", "en"],
    ["guest", "guest", "de"],
    ["speaker", "speaker", "en"],
  ]);
});

test("Kampagnenstart bleibt ohne Collector-Freigaben gesperrt und Vorschau zeigt keine Kontaktdaten", async () => {
  const { db } = await database();
  sourceFetch([]);
  const env = { DB: db, SITE: "https://www.m365.fm", API: "https://api-dub.m365.fm" };
  const status = await claimCampaignStatus(env);
  assert.equal(status.can_start, false);
  assert.equal((await startClaimCampaign(env, db)).error, "campaign_locked");
  assert.equal(await runClaimCampaign(env), 0);
  assert.doesNotMatch(JSON.stringify(status), /example\.invalid/);
});

test("Kampagne versendet höchstens 100 Einladungen pro UTC-Tag", async () => {
  const { db, raw } = await database();
  const entities = [];
  const speakers = [];
  for (let i = 0; i < 105; i++) {
    const id = `speaker-${i}`;
    addContact(raw, id);
    speakers.push({ id });
  }
  sourceFetch(entities, speakers);
  Date.now = () => seconds * 1000;
  const env = liveEnv(db);
  await startClaimCampaign(env, db);
  const log = console.log;
  console.log = () => {};
  try { assert.equal(await runClaimCampaign(env), 100); } finally { console.log = log; }
  assert.equal(await runClaimCampaign(env), 0);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM entity_invites WHERE status='sent'").get().n, 100);
  assert.equal(raw.prepare("SELECT COUNT(*) n FROM claim_campaign_invites").get().n, 100);
});

test("Kampagnen-Erinnerung erfolgt frühestens nach 14 Tagen und genau einmal", async () => {
  const { db, raw } = await database();
  let sends = 0;
  const env = liveEnv(db, async () => { sends++; return { messageId: "test" }; });
  const created = seconds - 15 * 86400;
  raw.prepare("INSERT INTO entity_invites(token,eid,name,email,by_user,status,created) VALUES('campaign-token','speaker','Alex',?,0,'sent',?)").run(address("speaker"), created);
  raw.prepare("INSERT INTO claim_campaign_invites(eid,token,source,created,sent_at,status) VALUES('speaker','campaign-token','speaker',? ,?,'sent')").run(created, seconds - 13 * 86400);
  Date.now = () => seconds * 1000;
  assert.equal(await remindClaimCampaign(env), 0);
  assert.equal(sends, 0);
  raw.prepare("UPDATE claim_campaign_invites SET sent_at=? WHERE token='campaign-token'").run(seconds - 14 * 86400);
  assert.equal(await remindClaimCampaign(env), 1);
  assert.equal(await remindClaimCampaign(env), 0);
  assert.equal(sends, 1);
  assert.equal(raw.prepare("SELECT reminded FROM claim_campaign_invites WHERE token='campaign-token'").get().reminded, 1);
});

test("Mailvorlagen sind zweisprachig, enthalten Abmeldung und verlinken den Collector nur live", () => {
  const env = { SITE: "https://www.m365.fm", API: "https://api-dub.m365.fm" };
  const de = campaignMail(env, { eid: "guest", name: "<Anna>", source: "guest" }, "de", "2026-11-04");
  assert.match(de.html, /Sie waren Gast im M365\.FM-Podcast/);
  assert.match(de.html, /&lt;Anna&gt;/);
  assert.match(de.html, /mit LinkedIn anmelden/);
  assert.equal(de.headers["List-Unsubscribe-Post"], "List-Unsubscribe=One-Click");
  assert.doesNotMatch(de.html, /MVP Contribution Collector/);
  const en = campaignMail({ ...env, MVP_COLLECTOR_LIVE: "1", MVP_COLLECTOR_URL: "https://www.m365.fm/community/collector/" }, { eid: "speaker", name: "Alex", source: "speaker" }, "en", "2026-11-04");
  assert.match(en.html, /You are a speaker at M365Con 27/);
  assert.match(en.html, /MVP Contribution Collector/);
  assert.match(conBanner("en", "2027-01-22"), /M365Con 2027/);
  assert.equal(conBanner("en", "2027-01-23"), "");
});
