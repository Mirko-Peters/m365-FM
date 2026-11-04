import { mailReady, sendMail } from "./mailer.js";
import { esc, randomToken } from "./util.js";

const now = () => Math.floor(Date.now() / 1000);
const ready = (env) => env?.MVP_COLLECTOR_LIVE === "1" && env?.CLAIM_CAMPAIGN_APPROVED === "1" && mailReady(env);
const emailOk = (value) => /^[^\s@<>]{1,64}@[^\s@<>]{1,190}\.[a-z]{2,}$/.test(value);

export function conBanner(lang, date = new Date().toISOString().slice(0, 10)) {
  if (date > "2027-01-22") return "";
  const text = lang === "de" ? "M365Con 2027 · 11.–22. Januar · kostenlos und online" : "M365Con 2027 · January 11–22 · free and online";
  return `<div style="background:#17324d;color:#fff;padding:14px 18px;text-align:center;border-radius:8px"><a href="https://m365con.net" style="color:#fff;font-weight:700;text-decoration:none">${text} · m365con.net</a></div>`;
}

async function sourceMap(env) {
  const [entityResponse, speakerResponse] = await Promise.all([
    fetch(`${env.SITE}/entities-src.json`),
    fetch(`${env.SITE}/speakers.json`),
  ]);
  if (!entityResponse.ok || !speakerResponse.ok) throw new Error("campaign_source_unavailable");
  const [entityData, speakerData] = await Promise.all([entityResponse.json(), speakerResponse.json()]);
  const entities = entityData.entities || [];
  const speakers = new Set((speakerData.speakers || []).map((item) => String(item.id || "")));
  const sources = new Map();
  for (const entity of entities) {
    if (entity?.type !== "person" || !entity.id) continue;
    const speaker = !!entity.speaker || speakers.has(entity.id);
    const guest = !!entity.guest;
    if (speaker || guest) sources.set(entity.id, speaker && guest ? "both" : speaker ? "speaker" : "guest");
  }
  for (const id of speakers) if (id && !sources.has(id)) sources.set(id, "speaker");
  return sources;
}

export async function claimCampaignTargets(env) {
  const sources = await sourceMap(env);
  const rows = (await env.DB.prepare(`SELECT c.eid,c.email,c.name,COALESCE(l.lang,'en') lang
    FROM entity_contacts c
    LEFT JOIN entity_contact_lang l ON l.eid=c.eid
    WHERE NOT EXISTS (SELECT 1 FROM invite_block b WHERE b.email=c.email)
      AND NOT EXISTS (SELECT 1 FROM entity_claims cl WHERE cl.eid=c.eid AND cl.status='verified')
      AND NOT EXISTS (SELECT 1 FROM entity_invites i WHERE i.eid=c.eid)
    ORDER BY c.eid`).all()).results || [];
  return rows.filter((row) => sources.has(row.eid) && emailOk(row.email))
    .map((row) => ({ ...row, source: sources.get(row.eid), lang: row.lang === "de" ? "de" : "en" }));
}

function collectorUrl(env) {
  try {
    const url = new URL(env.MVP_COLLECTOR_URL || "");
    return url.protocol === "https:" ? url.href : "";
  } catch { return ""; }
}

export function campaignMail(env, target, lang = target.lang, date = new Date().toISOString().slice(0, 10)) {
  const de = lang === "de", base = String(env.SITE || "").replace(/\/$/, "");
  const entityUrl = `${base}/${de ? "de/" : ""}entity/${encodeURIComponent(target.eid)}/`;
  const decline = `${env.API}/api/entityinvite/decline?t=${encodeURIComponent(target.token || "preview")}`;
  const linkedin = `${env.API}/auth/login/linkedin`;
  const current = date <= "2027-01-22";
  const attribution = {
    speaker: de ? (current ? "Sie sind Speaker bei M365Con 27." : "Sie waren Speaker bei M365Con 27.") : (current ? "You are a speaker at M365Con 27." : "You were a speaker at M365Con 27."),
    guest: de ? "Sie waren Gast im M365.FM-Podcast." : "You were a guest on the M365.FM podcast.",
    both: de ? (current ? "Sie sind Speaker bei M365Con 27 und waren Gast im M365.FM-Podcast." : "Sie waren Speaker bei M365Con 27 und Gast im M365.FM-Podcast.") : (current ? "You are a speaker at M365Con 27 and were a guest on the M365.FM podcast." : "You were a speaker at M365Con 27 and a guest on the M365.FM podcast."),
  }[target.source];
  const collector = env.MVP_COLLECTOR_LIVE === "1" && collectorUrl(env);
  const collectorText = collector ? (de
    ? `Podcast-Auftritte, Talks und Beiträge werden für den MVP-/MCT-Nachweis im <a href="${esc(collector)}">MVP Contribution Collector</a> gesammelt.`
    : `Podcast appearances, talks and contributions are collected for MVP/MCT evidence in the <a href="${esc(collector)}">MVP Contribution Collector</a>.`) : "";
  const banner = conBanner(lang, date);
  const name = esc(target.name);
  const body = de
    ? `<p>Hallo ${name},</p><p>${attribution}</p><p>Auf M365.FM gibt es eine <a href="${entityUrl}">Seite zu Ihnen</a>. Nach dem Beanspruchen können Sie Ihre Bio, Links und Ihr Foto pflegen.</p><p><a href="${env.SITE}/community/?invite=${encodeURIComponent(target.token || "preview")}#c-invite">Profil beanspruchen</a> · Sie können sich auch <a href="${linkedin}">mit LinkedIn anmelden</a>.</p>${collectorText ? `<p>${collectorText}</p>` : ""}<p>Wenn Sie diese Einladungen nicht erhalten möchten, <a href="${decline}">melden Sie sich hier ab</a>.</p>`
    : `<p>Hello ${name},</p><p>${attribution}</p><p>M365.FM has a <a href="${entityUrl}">page about you</a>. After claiming it, you can update your bio, links and photo.</p><p><a href="${env.SITE}/community/?invite=${encodeURIComponent(target.token || "preview")}#c-invite">Claim your profile</a> · You can also <a href="${linkedin}">sign in with LinkedIn</a>.</p>${collectorText ? `<p>${collectorText}</p>` : ""}<p>If you no longer want these invitations, <a href="${decline}">unsubscribe here</a>.</p>`;
  const html = `<div style="font-family:system-ui,Segoe UI,Arial,sans-serif;max-width:560px;margin:auto;color:#1b2430;line-height:1.55">${banner}<p style="font-weight:700;font-size:18px">M365.FM</p>${body}<hr style="border:0;border-top:1px solid #dde3ea;margin:20px 0"><p style="font-size:12px;color:#6b7785">${de ? "Diese Nachricht informiert Sie über eine Seite zu Ihrer Person. Es ist keine Werbung." : "This message informs you about a page about you. It is not advertising."}</p></div>`;
  return {
    subject: de ? "Beanspruchen Sie Ihr Profil auf M365.FM" : "Claim your profile on M365.FM",
    html,
    headers: { "List-Unsubscribe": `<${decline}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
  };
}

export async function claimCampaignStatus(env) {
  let targets = [], sourceError = false;
  try { targets = await claimCampaignTargets(env); } catch { sourceError = true; }
  const counts = { total: targets.length, speaker: 0, guest: 0, both: 0 };
  for (const target of targets) counts[target.source]++;
  const date = new Date().toISOString().slice(0, 10);
  const previews = {
    en: campaignMail(env, { eid: "sample-person", name: "Alex Example", source: "speaker", lang: "en" }, "en", date).html,
    de: campaignMail(env, { eid: "beispiel-person", name: "Anna Beispiel", source: "guest", lang: "de" }, "de", date).html,
  };
  const status = (await env.DB.prepare("SELECT v FROM meta WHERE k='claim_campaign_status'").first())?.v || "stopped";
  const midnight = Math.floor(now() / 86400) * 86400;
  const sentToday = (await env.DB.prepare("SELECT COUNT(*) n FROM claim_campaign_invites WHERE created>=?").bind(midnight).first())?.n || 0;
  const live = env.MVP_COLLECTOR_LIVE === "1" && !!collectorUrl(env);
  const approved = env.CLAIM_CAMPAIGN_APPROVED === "1";
  return { counts, previews, source_error: sourceError, status, sent_today: sentToday, live, approved, can_start: live && approved && mailReady(env) && !sourceError };
}

export async function startClaimCampaign(env, db) {
  if (env.MVP_COLLECTOR_LIVE !== "1" || !collectorUrl(env) || env.CLAIM_CAMPAIGN_APPROVED !== "1") return { error: "campaign_locked" };
  if (!mailReady(env)) return { error: "mail_off" };
  try { await claimCampaignTargets(env); } catch { return { error: "campaign_source_unavailable" }; }
  await db.prepare("INSERT INTO meta(k,v) VALUES('claim_campaign_status','running') ON CONFLICT(k) DO UPDATE SET v='running'").run();
  return { ok: true, status: "running" };
}

export async function runClaimCampaign(env) {
  if (!ready(env)) return 0;
  const status = (await env.DB.prepare("SELECT v FROM meta WHERE k='claim_campaign_status'").first())?.v;
  if (status !== "running") return 0;
  let targets;
  try { targets = await claimCampaignTargets(env); } catch { return 0; }
  if (!targets.length) {
    await env.DB.prepare("UPDATE meta SET v='complete' WHERE k='claim_campaign_status' AND v='running'").run();
    return 0;
  }
  const timestamp = now(), midnight = Math.floor(timestamp / 86400) * 86400;
  let sent = 0;
  for (const target of targets) {
    const token = randomToken(20);
    const reserve = await env.DB.prepare(`INSERT OR IGNORE INTO claim_campaign_invites(eid,token,source,created,status,reminded)
      SELECT ?,?,?,?,'sending',0
      WHERE (SELECT COUNT(*) FROM claim_campaign_invites WHERE created>=?) < 100`).bind(target.eid, token, target.source, timestamp, midnight).run();
    if (!reserve.meta?.changes) break;
    try {
      await env.DB.prepare("INSERT INTO entity_invites(token,eid,name,email,by_user,status,created) VALUES(?,?,?,?,0,'sent',?)").bind(token, target.eid, target.name, target.email, timestamp).run();
      const mail = campaignMail(env, { ...target, token }, target.lang);
      const result = await sendMail(env, { to: target.email, ...mail });
      await env.DB.prepare("UPDATE claim_campaign_invites SET status=?,sent_at=? WHERE eid=?").bind(result.ok ? "sent" : "failed", result.ok ? now() : 0, target.eid).run();
      await env.DB.prepare("UPDATE entity_invites SET status=? WHERE token=?").bind(result.ok ? "sent" : "failed", token).run();
      if (result.ok) sent++;
    } catch {
      await env.DB.prepare("UPDATE claim_campaign_invites SET status='failed' WHERE eid=?").bind(target.eid).run();
      await env.DB.prepare("UPDATE entity_invites SET status='failed' WHERE token=?").bind(token).run().catch(() => {});
    }
  }
  return sent;
}

export async function remindClaimCampaign(env) {
  if (!ready(env)) return 0;
  const timestamp = now();
  const rows = (await env.DB.prepare(`SELECT c.eid,c.token,c.source,i.name,i.email
    FROM claim_campaign_invites c JOIN entity_invites i ON i.token=c.token
    WHERE c.status='sent' AND c.reminded=0 AND c.sent_at<=? AND i.status='sent'
    LIMIT 100`).bind(timestamp - 14 * 86400).all()).results || [];
  for (const row of rows) {
    const target = { ...row, lang: "en" };
    const lang = (await env.DB.prepare("SELECT lang FROM entity_contact_lang WHERE eid=?").bind(row.eid).first())?.lang;
    const mail = campaignMail(env, target, lang === "de" ? "de" : "en");
    const reminder = {
      ...mail,
      subject: lang === "de" ? "Erinnerung: Ihr Profil auf M365.FM" : "Reminder: your M365.FM profile",
      html: mail.html.replace(/<p>(Hallo|Hello) /, `<p>${lang === "de" ? "Kurze Erinnerung: Hallo " : "A quick reminder: Hello "}`),
    };
    await sendMail(env, { to: row.email, ...reminder });
    await env.DB.prepare("UPDATE claim_campaign_invites SET reminded=1 WHERE token=? AND reminded=0").bind(row.token).run();
    await env.DB.prepare("UPDATE entity_invites SET reminded=1 WHERE token=?").bind(row.token).run();
  }
  return rows.length;
}
