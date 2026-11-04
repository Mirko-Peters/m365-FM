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

export async function sendMail(env, { to, subject, html, text, headers = {}, replyTo = "", attachments = [] }) {
  // attachments: [{ filename, content (Base64), type, disposition }] - Cloudflare Email Service und Resend
  if (env?.EMAIL) {
    try {
      const response = await env.EMAIL.send({
        to,
        from: senderAddress(env.MAIL_FROM),
        subject,
        ...(html !== undefined ? { html } : {}),
        ...(text !== undefined ? { text } : {}),
        ...(Object.keys(headers).length ? { headers } : {}),
        ...(replyTo ? { replyTo } : {}),
        ...(attachments.length ? { attachments } : {}),
      });
      const messageId = response?.messageId || "";
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
      body: JSON.stringify({ from: env.MAIL_FROM, to, subject, html, ...(text !== undefined ? { text } : {}), headers,
        ...(replyTo ? { reply_to: replyTo } : {}),
        ...(attachments.length ? { attachments: attachments.map((a) => ({ filename: a.filename, content: a.content, content_type: a.type })) } : {}) }),
    });
    const data = await response.json().catch(() => ({}));
    const messageId = typeof data?.id === "string" ? data.id : "";
    console.log("mail_send", JSON.stringify({ provider: "resend", status: response.status, messageId }));
    return { ok: response.ok, status: response.status, messageId };
  } catch (error) {
    const status = Number(error?.status) || 0;
    console.error("mail_send", JSON.stringify({ provider: "resend", status, code: String(error?.code || "send_failed").slice(0, 80) }));
    return { ok: false, status };
  }
}
