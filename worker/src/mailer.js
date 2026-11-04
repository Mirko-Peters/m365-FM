function senderAddress(from) {
  const value = String(from || "");
  const open = value.lastIndexOf("<"), close = value.lastIndexOf(">");
  if (open < 0 || close !== value.length - 1 || close <= open + 1) return value;
  const email = value.slice(open + 1, close).trim();
  if (!email || email.includes("<") || email.includes(">")) return value;
  const name = value.slice(0, open).trim();
  return name ? { email, name } : email;
}

export function mailReady(env) {
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

export async function sendMail(env, { to, subject, html, text, headers = {}, lang = "en", bannerAt = Date.now() }) {
  const banner = conBanner(lang, bannerAt);
  if (banner && typeof html === "string") html += banner;
  if (banner && typeof text === "string") text += lang === "de"
    ? "\n\nM365Con · Mehr erfahren: https://m365con.net"
    : "\n\nM365Con · Learn more: https://m365con.net";
  if (env?.EMAIL) {
    try {
      const response = await env.EMAIL.send({
        to,
        from: senderAddress(env.MAIL_FROM),
        subject,
        ...(html !== undefined ? { html } : {}),
        ...(text !== undefined ? { text } : {}),
        ...(Object.keys(headers).length ? { headers } : {}),
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
      body: JSON.stringify({ from: env.MAIL_FROM, to, subject, html, ...(text !== undefined ? { text } : {}), headers }),
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
