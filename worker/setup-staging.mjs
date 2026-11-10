// Einrichtung/Deploy des Community-Workers in der TESTUMGEBUNG (laeuft im GitHub-Workflow worker-staging.yml, Umgebung `staging`).
// Fasst NUR Staging-Namen an: Worker m365-dub-community-staging, D1 m365-dub-staging, api-staging.m365.fm. Jeder wrangler-Aufruf traegt --env staging
// oder nennt die Staging-Datenbank ausdruecklich; vorab prueft guard() die Konfiguration und bricht bei jedem Live-Namen ab. Schreibt nie Secrets ins Log.
// Gegenstueck zu setup.mjs (Live) - setup.mjs wird hier nie aufgerufen.
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { webcrypto as crypto } from "node:crypto";

export const STAGING_DB = "m365-dub-staging";
export const LIVE_DB = "m365-dub";
export const STAGING_BLOCK = "[[env.staging.d1_databases]]";

const b64u = (b) => Buffer.from(b).toString("base64url");
const maskAccount = (value) => {
  let message = String(value);
  const accounts = new Set([process.env.CLOUDFLARE_ACCOUNT_ID || "", ...[...message.matchAll(/\b[a-f0-9]{32}\b/gi)].map(([a]) => a)].filter(Boolean));
  for (const account of accounts) message = message.replaceAll(account, "[Konto-ID]").replaceAll(account.slice(0, 6), "[Konto-ID]");
  return message;
};
const fail = (m) => { console.error("::error::" + maskAccount(String(m).replace(/\r?\n/g, " | ").slice(0, 900))); process.exit(1); };

// Die Konfiguration muss eindeutig Staging sein, bevor irgendetwas bei Cloudflare passiert.
export function guard(toml) {
  const at = toml.indexOf("\n[env.staging]");
  if (at < 0) return ["wrangler.toml hat keinen Abschnitt [env.staging]"];
  const code = toml.slice(at).split("\n").map((l) => l.replace(/#.*$/, "")).join("\n");   // ohne Kommentare
  const problems = [];
  if (!/^name = "m365-dub-community-staging"$/m.test(code)) problems.push('[env.staging] name muss "m365-dub-community-staging" sein');
  if (!new RegExp(`^database_name = "${STAGING_DB}"$`, "m").test(code)) problems.push(`D1 muss "${STAGING_DB}" heissen`);
  const forbidden = [[/api-dub\.m365\.fm/, "Live-API api-dub.m365.fm"], [/(?<![-\w])dub\.m365\.fm/, "dub.m365.fm"], [/www\.m365\.fm/, "www.m365.fm"], [/pattern = "m365\.fm/, "m365.fm (Live-Zone-Apex)"],
    [/database_name = "m365-dub"/, "Live-Datenbank m365-dub"], [/bucket_name = "m365-fm"/, "Live-Bucket m365-fm"], [/m365-search/, "Live-Index m365-search"],
    [/\[env\.staging\.ai\]/, "KI-Bindung"], [/\[\[env\.staging\.vectorize\]\]/, "Vectorize-Bindung"], [/send_email/, "Mail-Bindung"], [/\[env\.staging\.triggers\]/, "Crons"]];
  for (const [re, what] of forbidden) if (re.test(code)) problems.push("Im Staging-Abschnitt nicht erlaubt: " + what);
  return problems;
}

// database_id NUR im Staging-Block ersetzen (der Live-Eintrag weiter oben bleibt unberuehrt)
export function withStagingId(toml, id) {
  const i = toml.indexOf(STAGING_BLOCK);
  if (i < 0) throw new Error("Staging-D1-Block fehlt");
  const head = toml.slice(0, i), tail = toml.slice(i).replace(/database_id = "[^"]*"/, `database_id = "${id}"`);
  return head + tail;
}

if (process.argv[1] && import.meta.url === new URL(process.argv[1], "file:").href) {
  const run = (args, input) => spawnSync("npx", ["wrangler", ...args], { input, encoding: "utf8" });
  const toml0 = readFileSync("wrangler.toml", "utf8");
  const problems = guard(toml0);
  if (problems.length) fail("Staging-Schutz: " + problems.join("; "));
  console.log("Staging-Schutz: Konfiguration ist eindeutig Staging.");

  // 1) D1 finden oder anlegen, ID nur in den Staging-Block eintragen
  let list = run(["d1", "list", "--json"]);
  let dbs = []; try { dbs = JSON.parse(list.stdout); } catch { fail("d1 list: " + (list.stderr || list.stdout)); }
  let db = dbs.find((d) => d.name === STAGING_DB);
  if (!db) { const c = run(["d1", "create", STAGING_DB]); console.log(maskAccount(c.stdout.split("\n").slice(0, 3).join("\n"))); dbs = JSON.parse(run(["d1", "list", "--json"]).stdout); db = dbs.find((d) => d.name === STAGING_DB); }
  if (!db) fail("Staging-D1 konnte nicht angelegt werden");
  writeFileSync("wrangler.toml", withStagingId(toml0, db.uuid || db.id));
  console.log("D1:", db.name);

  // 2) Migrationen (dieselben wie live) auf die Staging-Datenbank
  const sch = run(["d1", "migrations", "apply", STAGING_DB, "--remote", "--env", "staging"]);
  if (sch.status !== 0) fail("Schema: " + (sch.stderr || sch.stdout));
  console.log("Schema ok");

  // 3) Deploy, danach Secrets (Worker muss existieren)
  const dep = run(["deploy", "--env", "staging"]);
  console.log(maskAccount(dep.stdout.split("\n").slice(-6).join("\n"))); if (dep.status !== 0) fail("Deploy: " + dep.stderr);

  let have = [];
  try { have = JSON.parse(run(["secret", "list", "--env", "staging", "--format", "json"]).stdout).map((s) => s.name); } catch { /* noch keine */ }
  const put = (k, v) => { const r = run(["secret", "put", k, "--env", "staging"], v); console.log(k, r.status === 0 ? "gesetzt" : "FEHLER " + maskAccount(r.stderr.slice(0, 200))); };
  const gen = { SESSION_SECRET: () => b64u(crypto.getRandomValues(new Uint8Array(32))), CRON_KEY: () => b64u(crypto.getRandomValues(new Uint8Array(24))) };
  for (const [k, f] of Object.entries(gen)) if (!have.includes(k)) put(k, f());
  // Nur Anmelde-Anbieter (lesen eine Identitaet), und nur aus eigenen STAGING_-Secrets: nie die Live-Schluessel. Mail, KI, LinkedIn, Spreaker usw. gibt es hier nicht.
  for (const k of ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "MS_CLIENT_ID", "MS_CLIENT_SECRET", "GH_OAUTH_CLIENT_ID", "GH_OAUTH_CLIENT_SECRET"]) if (process.env["STAGING_" + k]) put(k, process.env["STAGING_" + k]);
  console.log("Fertig. Worker: https://api-staging.m365.fm");
}
