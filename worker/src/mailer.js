import { isStaging } from "./staging.js";

function senderAddress(from) {
  const value = String(from || "");
  const open = value.lastIndexOf("<"), close = value.lastIndexOf(">");
  if (open < 0 || close !== value.length - 1 || close <= open + 1) return value;
  const email = value.slice(open + 1, close).trim();
  if (!email || email.includes("<") || email.includes(">")) return value;
  const name = value.slice(0, open).trim();
  return name ? { email, name } : email;
}

// Anzeigename setzen (technische Absenderadresse bleibt die von MAIL_FROM)
function withName(from, name) {
  if (!name) return from;
  const email = typeof from === "string" ? from : from.email;
  return { email, name: String(name).replace(/[<>"\r\n]/g, "") };
}
function resendFrom(from, name) {
  const w = withName(senderAddress(from), name);
  return typeof w === "string" ? w : `${w.name} <${w.email}>`;
}

export function mailReady(env) {
  if (isStaging(env)) return false;   // Testumgebung: nie Mail (staging.js)
  return !!(env?.EMAIL || env?.RESEND_API_KEY);
}

export function conBanner(lang = "en", at = Date.now()) {
  const date = at instanceof Date ? at : new Date(at);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) > "2027-01-22") return "";
  return lang === "de"
    ? '<p style="font-size:12px;color:#6b7785;text-align:center">M365Con · <a href="https://m365con.net" style="color:#3b6391">Mehr erfahren</a></p>'
    : '<p style="font-size:12px;color:#6b7785;text-align:center">M365Con · <a href="https://m365con.net" style="color:#3b6391">Learn more</a></p>';
}

async function countMail(env) {
  if (!env?.DB) return;
  const month = new Date().toISOString().slice(0, 7);
  try {
    await env.DB.prepare("INSERT INTO mail_monthly_usage(month,sent) VALUES(?,1) ON CONFLICT(month) DO UPDATE SET sent=sent+1").bind(month).run();
  } catch { /* Mailversand nicht von der Statistik abhängig machen. */ }
}

// Anhang-Inhalt als Base64 (fuer Resend). Binaerdaten (Uint8Array/ArrayBuffer) werden umgewandelt, Strings gelten schon als Base64.
export function b64(content) {
  if (typeof content === "string") return content;
  const buf = content instanceof Uint8Array ? content : new Uint8Array(content);
  let s = "";
  for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000));
  return btoa(s);
}

export async function sendMail(env, { to, subject, html, text, headers = {}, replyTo = "", fromName = "", attachments = [], lang = "en", bannerAt = Date.now(), banner: withBanner = true }) {
  if (isStaging(env)) { console.log("mail_send", JSON.stringify({ provider: "none", suppressed: "staging" })); return { ok: false, status: 0, suppressed: "staging" }; }   // Testumgebung: nichts wird gesendet, auch nicht bei gesetztem Schluessel
  // attachments: [{ filename, content (Uint8Array/ArrayBuffer oder Base64-String), type, disposition }] - Cloudflare Email Service und Resend.
  // Cloudflare bekommt Binaerdaten unveraendert (5.11.2026: per Base64-String verschickte Mediadaten kamen als ungueltiges PDF an).
  // banner: false laesst den M365Con-Hinweis weg (Einladungen an Personen ohne Konto: Hinweis auf gespeicherte Daten, keine Eigenwerbung anhaengen).
  const banner = withBanner === false ? "" : conBanner(lang, bannerAt);
  if (banner && typeof html === "string") html += banner;
  if (banner && typeof text === "string") text += lang === "de"
    ? "\n\nM365Con · Mehr erfahren: https://m365con.net"
    : "\n\nM365Con · Learn more: https://m365con.net";
  if (env?.EMAIL) {
    try {
      const response = await env.EMAIL.send({
        to,
        from: withName(senderAddress(env.MAIL_FROM), fromName),
        subject,
        ...(html !== undefined ? { html } : {}),
        ...(text !== undefined ? { text } : {}),
        ...(Object.keys(headers).length ? { headers } : {}),
        ...(replyTo ? { replyTo } : {}),
        ...(attachments.length ? { attachments } : {}),
      });
      const messageId = response?.messageId || "";
      await countMail(env);
      console.log("mail_send", JSON.stringify({ provider: "cloudflare", status: 200, messageId }));
      return { ok: true, status: 200, messageId };
    } catch (error) {
      const status = Number(error?.status) || 0;
      console.error("mail_send", JSON.stringify({ provider: "cloudflare", status, code: String(error?.code || "send_failed").slice(0, 80) }));
      return { ok: false, status };
    }
  }

  const resendKey = env?.RESEND_API_KEY;
  if (!resendKey) return { ok: false, status: 0 };
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: "Bearer " + resendKey, "content-type": "application/json" },
      body: JSON.stringify({ from: fromName ? resendFrom(env.MAIL_FROM, fromName) : env.MAIL_FROM, to, subject, html, ...(text !== undefined ? { text } : {}), headers,
        ...(replyTo ? { reply_to: replyTo } : {}),
        ...(attachments.length ? { attachments: attachments.map((a) => ({ filename: a.filename, content: b64(a.content), content_type: a.type })) } : {}) }),
    });
    const data = await response.json().catch(() => ({}));
    const messageId = typeof data?.id === "string" ? data.id : "";
    if (response.ok) await countMail(env);
    console.log("mail_send", JSON.stringify({ provider: "resend", status: response.status, messageId }));
    return { ok: response.ok, status: response.status, messageId };
  } catch (error) {
    const status = Number(error?.status) || 0;
    console.error("mail_send", JSON.stringify({ provider: "resend", status, code: String(error?.code || "send_failed").slice(0, 80) }));
    return { ok: false, status };
  }
}
