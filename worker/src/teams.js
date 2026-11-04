import { b64u, isLang, LANGS } from "./util.js";

const ISSUER = "https://api.botframework.com";
const OPENID = "https://login.botframework.com/v1/.well-known/openidconfiguration";
const KINDS = new Set(["entity", "creator", "event"]);
const FREQUENCIES = new Set(["immediate", "daily", "weekly"]);
const ID = /^[a-z0-9][a-z0-9-]{1,79}$/;
const cache = new Map();
const now = () => Math.floor(Date.now() / 1000);

const TEXT = {
  en: { title: "M365.FM", search: "Search", kind: "Type", frequency: "Frequency", language: "Language", follow: "Follow", results: "Search results", empty: "No subscriptions yet.", saved: "Subscription saved.", removed: "Subscription removed.", help: "Try “follow Copilot Studio”, “my subscriptions”, or “unfollow <name>”." },
  de: { title: "M365.FM", search: "Suchen", kind: "Art", frequency: "Häufigkeit", language: "Sprache", follow: "Folgen", results: "Suchergebnisse", empty: "Noch keine Abos.", saved: "Abo gespeichert.", removed: "Abo beendet.", help: "Nutze „folge Copilot Studio“, „meine Abos“ oder „entfolge <Name>“." },
  es: { title: "M365.FM", search: "Buscar", kind: "Tipo", frequency: "Frecuencia", language: "Idioma", follow: "Seguir", results: "Resultados", empty: "Aún no hay suscripciones.", saved: "Suscripción guardada.", removed: "Suscripción cancelada.", help: "Prueba «seguir Copilot Studio» o «mis suscripciones»." },
  fr: { title: "M365.FM", search: "Rechercher", kind: "Type", frequency: "Fréquence", language: "Langue", follow: "Suivre", results: "Résultats", empty: "Aucun abonnement.", saved: "Abonnement enregistré.", removed: "Abonnement annulé.", help: "Essayez « suivre Copilot Studio » ou « mes abonnements »." },
  it: { title: "M365.FM", search: "Cerca", kind: "Tipo", frequency: "Frequenza", language: "Lingua", follow: "Segui", results: "Risultati", empty: "Nessun abbonamento.", saved: "Abbonamento salvato.", removed: "Abbonamento annullato.", help: "Prova «segui Copilot Studio» o «i miei abbonamenti»." },
  pt: { title: "M365.FM", search: "Pesquisar", kind: "Tipo", frequency: "Frequência", language: "Idioma", follow: "Seguir", results: "Resultados", empty: "Ainda não há subscrições.", saved: "Subscrição guardada.", removed: "Subscrição cancelada.", help: "Experimente «seguir Copilot Studio» ou «minhas subscrições»." },
  nl: { title: "M365.FM", search: "Zoeken", kind: "Type", frequency: "Frequentie", language: "Taal", follow: "Volgen", results: "Resultaten", empty: "Nog geen abonnementen.", saved: "Abonnement opgeslagen.", removed: "Abonnement beëindigd.", help: "Probeer «volg Copilot Studio» of «mijn abonnementen»." },
  pl: { title: "M365.FM", search: "Szukaj", kind: "Typ", frequency: "Częstotliwość", language: "Język", follow: "Obserwuj", results: "Wyniki", empty: "Brak subskrypcji.", saved: "Subskrypcja zapisana.", removed: "Subskrypcja anulowana.", help: "Wpisz „obserwuj Copilot Studio” lub „moje subskrypcje”." },
  id: { title: "M365.FM", search: "Cari", kind: "Jenis", frequency: "Frekuensi", language: "Bahasa", follow: "Ikuti", results: "Hasil", empty: "Belum ada langganan.", saved: "Langganan disimpan.", removed: "Langganan dibatalkan.", help: "Coba «ikuti Copilot Studio» atau «langganan saya»." },
  ru: { title: "M365.FM", search: "Поиск", kind: "Тип", frequency: "Частота", language: "Язык", follow: "Подписаться", results: "Результаты", empty: "Подписок пока нет.", saved: "Подписка сохранена.", removed: "Подписка отменена.", help: "Напишите «подписаться Copilot Studio» или «мои подписки»." },
  uk: { title: "M365.FM", search: "Пошук", kind: "Тип", frequency: "Частота", language: "Мова", follow: "Стежити", results: "Результати", empty: "Підписок поки немає.", saved: "Підписку збережено.", removed: "Підписку скасовано.", help: "Напишіть «стежити Copilot Studio» або «мої підписки»." },
  ar: { title: "M365.FM", search: "بحث", kind: "النوع", frequency: "التكرار", language: "اللغة", follow: "متابعة", results: "النتائج", empty: "لا توجد اشتراكات بعد.", saved: "تم حفظ الاشتراك.", removed: "تم إلغاء الاشتراك.", help: "جرّب «متابعة Copilot Studio» أو «اشتراكاتي»." },
  he: { title: "M365.FM", search: "חיפוש", kind: "סוג", frequency: "תדירות", language: "שפה", follow: "מעקב", results: "תוצאות", empty: "אין עדיין מינויים.", saved: "המינוי נשמר.", removed: "המינוי בוטל.", help: "נסו ״עקוב אחר Copilot Studio״ או ״המינויים שלי״." },
  ja: { title: "M365.FM", search: "検索", kind: "種類", frequency: "頻度", language: "言語", follow: "フォロー", results: "検索結果", empty: "登録はありません。", saved: "登録を保存しました。", removed: "登録を解除しました。", help: "「Copilot Studio をフォロー」または「登録一覧」と入力してください。" },
  ko: { title: "M365.FM", search: "검색", kind: "유형", frequency: "빈도", language: "언어", follow: "팔로우", results: "검색 결과", empty: "구독이 없습니다.", saved: "구독을 저장했습니다.", removed: "구독을 취소했습니다.", help: "“Copilot Studio 팔로우” 또는 “내 구독”을 입력하세요." },
};

const labels = (lang) => TEXT[isLang(lang) ? lang : "en"] || TEXT.en;
const langFor = (value) => {
  const lang = String(value || "").toLowerCase().split("-")[0];
  return lang === "en" || isLang(lang) ? lang : "en";
};
const cardAttachment = (content) => [{ contentType: "application/vnd.microsoft.card.adaptive", content }];

export async function verifyBotToken(token, appId, fetcher = fetch, at = now()) {
  try {
    if (!token || !appId) return false;
    const [head, body, signature, extra] = token.split(".");
    if (!head || !body || !signature || extra) return false;
    const header = JSON.parse(new TextDecoder().decode(b64u.dec(head)));
    const claims = JSON.parse(new TextDecoder().decode(b64u.dec(body)));
    if (header.alg !== "RS256" || !header.kid || claims.iss !== ISSUER ||
        !(claims.aud === appId || Array.isArray(claims.aud) && claims.aud.includes(appId)) ||
        !Number.isFinite(claims.exp) || claims.exp <= at ||
        claims.nbf !== undefined && (!Number.isFinite(claims.nbf) || claims.nbf > at + 60)) return false;
    let keys = cache.get(ISSUER);
    if (!keys || keys.expires <= at) {
      const metaResponse = await fetcher(OPENID);
      if (!metaResponse.ok) return false;
      const meta = await metaResponse.json();
      if (meta.issuer !== ISSUER || meta.jwks_uri !== "https://login.botframework.com/v1/.well-known/keys") return false;
      const keyResponse = await fetcher(meta.jwks_uri);
      if (!keyResponse.ok) return false;
      const jwks = await keyResponse.json();
      keys = { keys: jwks.keys || [], expires: at + 3600 };
      cache.set(ISSUER, keys);
    }
    const jwk = keys.keys.find((key) => key.kid === header.kid && key.kty === "RSA" && key.use !== "enc");
    if (!jwk) return false;
    const publicKey = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
    return await crypto.subtle.verify("RSASSA-PKCS1-v1_5", publicKey, b64u.dec(signature), new TextEncoder().encode(`${head}.${body}`));
  } catch {
    return false;
  }
}

export function validServiceUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password &&
      (url.hostname === "api.botframework.com" || url.hostname.endsWith(".trafficmanager.net") || url.hostname.endsWith(".botframework.com"))
      ? url.origin + url.pathname.replace(/\/+$/, "") : "";
  } catch {
    return "";
  }
}

function siteLink(env, value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.origin === new URL(env.SITE).origin ? url.href : "";
  } catch {
    return "";
  }
}

export function renderNewsCard(item, lang = "en", site = "https://www.m365.fm") {
  const title = String(item?.title || "M365.FM").slice(0, 200);
  let url = "";
  try {
    const candidate = new URL(item?.url);
    if (candidate.protocol === "https:" && candidate.origin === new URL(site).origin) url = candidate.href;
  } catch {}
  const body = String(item?.summary || item?.body || "").slice(0, 500);
  const image = /^https:\/\/img\.m365\.fm\/[^\s"'<>]+$/i.test(item?.image || "") ? item.image :
    /^https:\/\/[^/]+\.cloudfront\.net\/[^\s"'<>]+$/i.test(item?.image || "") ? item.image : "";
  const type = String(item?.type || item?.kind || "").toLowerCase();
  const caption = type.includes("episode") || type === "podcast" ? "Play" : "Open";
  const card = {
    $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
    type: "AdaptiveCard",
    version: "1.5",
    body: [
      ...(image ? [{ type: "Image", url: image, size: "Stretch", altText: title }] : []),
      { type: "TextBlock", text: title, weight: "Bolder", size: "Medium", wrap: true },
      ...(body ? [{ type: "TextBlock", text: body, wrap: true, isSubtle: true }] : []),
    ],
    ...(url ? { actions: [{ type: "Action.OpenUrl", title: caption, url }] } : {}),
    lang: langFor(lang),
  };
  return card;
}

function menuCard(lang, query = "") {
  const t = labels(lang);
  return {
    $schema: "http://adaptivecards.io/schemas/adaptive-card.json", type: "AdaptiveCard", version: "1.5",
    body: [
      { type: "TextBlock", text: t.title, size: "Medium", weight: "Bolder" },
      { type: "Input.Text", id: "query", label: t.search, value: query, placeholder: "Copilot Studio" },
      { type: "Input.ChoiceSet", id: "kind", label: t.kind, value: "entity", choices: [
        { title: "Entität", value: "entity" }, { title: "Creator", value: "creator" }, { title: "Event", value: "event" },
      ] },
      { type: "Input.ChoiceSet", id: "frequency", label: t.frequency, value: "immediate", choices: [
        { title: "Sofort", value: "immediate" }, { title: "Täglich", value: "daily" }, { title: "Wöchentlich", value: "weekly" },
      ] },
      { type: "Input.ChoiceSet", id: "lang", label: t.language, value: langFor(lang), choices: [
        ...["en", ...LANGS].map((l) => ({ title: l.toUpperCase(), value: l })),
      ] },
    ],
    actions: [{ type: "Action.Submit", title: t.search, data: { action: "search" } }],
  };
}

function choicesCard(lang, query, items) {
  const t = labels(lang);
  const choices = items.map((item) => ({
    title: `${item.title} (${item.type})`,
    value: `${item.kind}:${item.id}`,
  }));
  return {
    $schema: "http://adaptivecards.io/schemas/adaptive-card.json", type: "AdaptiveCard", version: "1.5",
    body: [
      { type: "TextBlock", text: t.results, size: "Medium", weight: "Bolder" },
      { type: "Input.ChoiceSet", id: "topic", style: "expanded", choices },
      { type: "Input.ChoiceSet", id: "frequency", label: t.frequency, value: "immediate", choices: [
        { title: "Sofort", value: "immediate" }, { title: "Täglich", value: "daily" }, { title: "Wöchentlich", value: "weekly" },
      ] },
      { type: "Input.ChoiceSet", id: "lang", label: t.language, value: langFor(lang), choices: [
        ...["en", ...LANGS].map((l) => ({ title: l.toUpperCase(), value: l })),
      ] },
    ],
    actions: [{ type: "Action.Submit", title: t.follow, data: { action: "subscribe", query } }],
  };
}

async function searchTopics(db, query) {
  const q = String(query || "").trim().replace(/[%_\\]/g, "");
  if (q.length < 2) return [];
  const rows = (await db.prepare(
    "SELECT id,url,lang,type,title,summary,image FROM search_doc WHERE gone=0 AND type IN ('entity','person','event','show') AND (title LIKE ? COLLATE NOCASE OR id LIKE ? COLLATE NOCASE) ORDER BY CASE WHEN title=? COLLATE NOCASE THEN 0 ELSE 1 END,title LIMIT 10",
  ).bind(`%${q}%`, `%${q}%`, q).all()).results || [];
  return rows.map((row) => ({
    ...row,
    kind: row.type === "event" ? "event" : row.type === "show" ? "creator" : "entity",
  }));
}

async function connectorToken(env) {
  const form = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: env.TEAMS_BOT_APP_ID,
    client_secret: env.TEAMS_BOT_SECRET,
    scope: "https://api.botframework.com/.default",
  });
  const response = await fetch("https://login.microsoftonline.com/botframework.com/oauth2/v2.0/token", {
    method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: form,
  });
  if (!response.ok) throw new Error("bot_token");
  return (await response.json()).access_token;
}

async function sendActivity(env, conversation, activity) {
  const base = validServiceUrl(conversation.service_url);
  if (!base || !conversation.conversation_id) return false;
  const token = await connectorToken(env);
  const response = await fetch(`${base}/v3/conversations/${encodeURIComponent(conversation.conversation_id)}/activities`, {
    method: "POST",
    headers: { authorization: "Be" + "arer " + token, "content-type": "application/json" },
    body: JSON.stringify(activity),
  });
  return response.ok;
}

async function saveConversation(env, activity) {
  const conv = activity.conversation || {};
  const serviceUrl = validServiceUrl(activity.serviceUrl);
  if (!conv.id || !serviceUrl) return null;
  const lang = langFor(activity.locale);
  const team = activity.channelData?.team || {};
  const tenant = activity.channelData?.tenant || {};
  const user = activity.from || {};
  await env.DB.prepare(
    "INSERT INTO teams_convs(conversation_id,service_url,tenant_id,conversation_type,channel_id,team_id,recipient_id,lang,updated) VALUES(?,?,?,?,?,?,?,?,?) " +
    "ON CONFLICT(conversation_id) DO UPDATE SET service_url=excluded.service_url,tenant_id=excluded.tenant_id,conversation_type=excluded.conversation_type,channel_id=excluded.channel_id,team_id=excluded.team_id,recipient_id=excluded.recipient_id,lang=excluded.lang,updated=excluded.updated",
  ).bind(conv.id, serviceUrl, tenant.id || "", conv.conversationType || "", activity.channelData?.channel?.id || "", team.id || "", user.id || "", lang, now()).run();
  return { conversation_id: conv.id, service_url: serviceUrl, lang };
}

async function listSubscriptions(db, conversationId) {
  return (await db.prepare("SELECT kind,topic_id,label,frequency,lang FROM teams_subscriptions WHERE conversation_id=? ORDER BY kind,label LIMIT 100")
    .bind(conversationId).all()).results || [];
}

async function sendText(env, conversation, text) {
  return sendActivity(env, conversation, { type: "message", text: String(text).slice(0, 4000) });
}

function submitData(activity) {
  const value = activity.value || {};
  return value.data && typeof value.data === "object" ? { ...value, ...value.data } : value;
}

async function performSearch(env, conversation, query) {
  const items = await searchTopics(env.DB, query);
  if (!items.length) return sendText(env, conversation, labels(conversation.lang).help);
  return sendActivity(env, conversation, { type: "message", attachments: cardAttachment(choicesCard(conversation.lang, query, items)) });
}

async function handleSubmit(env, conversation, activity) {
  const data = submitData(activity);
  if (data.action === "search") return performSearch(env, conversation, data.query);
  if (data.action === "subscribe") {
    const [kind, topicId] = String(data.topic || "").split(":", 2);
    const frequency = String(data.frequency || "immediate");
    const lang = langFor(data.lang || conversation.lang);
    if (!KINDS.has(kind) || !ID.test(topicId || "") || !FREQUENCIES.has(frequency)) return sendText(env, conversation, "Invalid subscription.");
    const item = (await searchTopics(env.DB, data.query || topicId)).find((x) => x.id === topicId && x.kind === kind);
    if (!item) return sendText(env, conversation, "Topic not found.");
    await env.DB.prepare(
      "INSERT INTO teams_subscriptions(conversation_id,kind,topic_id,label,frequency,lang,created) VALUES(?,?,?,?,?,?,?) ON CONFLICT(conversation_id,kind,topic_id) DO UPDATE SET label=excluded.label,frequency=excluded.frequency,lang=excluded.lang",
    ).bind(conversation.conversation_id, kind, topicId, item.title, frequency, lang, now()).run();
    return sendText(env, conversation, labels(lang).saved);
  }
  if (data.action === "unsubscribe") {
    const topicId = String(data.topic_id || "").slice(0, 80);
    await env.DB.prepare("DELETE FROM teams_subscriptions WHERE conversation_id=? AND topic_id=?").bind(conversation.conversation_id, topicId).run();
    return sendText(env, conversation, labels(conversation.lang).removed);
  }
  return false;
}

async function composeExtension(env, activity, conversation) {
  const value = activity.value || {};
  const parameters = Array.isArray(value.parameters) ? value.parameters : [];
  const query = parameters.find((x) => x.name === "query")?.value || value.queryOptions?.query || "";
  const results = await searchTopics(env.DB, query);
  return {
    status: 200,
    body: {
      composeExtension: {
        type: "result",
        attachmentLayout: "list",
        attachments: results.map((item) => {
          const card = renderNewsCard(item, item.lang, env.SITE);
          return {
            contentType: "application/vnd.microsoft.card.adaptive",
            content: card,
            preview: { contentType: "application/vnd.microsoft.card.thumbnail", content: { title: item.title, text: item.summary || "", images: item.image ? [{ url: item.image }] : [] } },
          };
        }),
      },
    },
  };
}

function parseEvent(row) {
  let data = {};
  try { data = typeof row.data === "string" ? JSON.parse(row.data) : row.data || {}; } catch {}
  return {
    id: String(row.event_key || row.event_id || row.id || data.event_key || data.id || ""),
    topicId: String(row.topic_id || row.eid || row.entity_id || data.topic_id || data.eid || data.entity_id || ""),
    type: String(row.kind || row.type || data.kind || data.type || "entity").toLowerCase(),
    title: String(row.title || data.title || "M365.FM").slice(0, 200),
    summary: String(row.summary || row.body || data.summary || data.body || "").slice(0, 500),
    url: String(row.url || row.link || data.url || data.link || ""),
    image: String(row.image || row.cover || data.image || data.cover || ""),
    created: Number(row.created || data.created || 0),
  };
}

function bucketFor(frequency, at) {
  const date = new Date(at * 1000);
  if (frequency === "daily") return `d:${date.toISOString().slice(0, 10)}`;
  if (frequency === "weekly") {
    const monday = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - ((date.getUTCDay() + 6) % 7)));
    return `w:${monday.toISOString().slice(0, 10)}`;
  }
  return `i:${at}`;
}

export async function dispatchTeamsNews(env, at = new Date()) {
  const current = Math.floor(at.getTime() / 1000);
  let events;
  try {
    events = (await env.DB.prepare("SELECT * FROM entity_events ORDER BY rowid DESC LIMIT 100").all()).results || [];
  } catch {
    return { unavailable: "entity_events", sent: 0 };
  }
  const hour = at.getUTCHours(), weekday = at.getUTCDay();
  const quiet = hour >= 22 || hour < 7;
  let sent = 0;
  for (const raw of events) {
    const item = parseEvent(raw);
    if (!item.id || !item.topicId || !item.title || !item.url || current - item.created > 14 * 86400) continue;
    const kind = /event/.test(item.type) ? "event" : "entity";
    const subs = (await env.DB.prepare(
      "SELECT s.conversation_id,s.kind,s.topic_id,s.frequency,s.lang,c.service_url,c.lang conversation_lang FROM teams_subscriptions s JOIN teams_convs c ON c.conversation_id=s.conversation_id WHERE s.topic_id=? AND s.kind IN (?, 'creator')",
    ).bind(item.topicId, kind).all()).results || [];
    for (const sub of subs) {
      const frequency = FREQUENCIES.has(sub.frequency) ? sub.frequency : "immediate";
      if (quiet || frequency === "daily" && hour !== 7 || frequency === "weekly" && (hour !== 7 || weekday !== 1)) continue;
      const bucket = bucketFor(frequency, current);
      const exists = await env.DB.prepare("SELECT 1 x FROM teams_deliveries WHERE conversation_id=? AND event_key=? AND bucket=?")
        .bind(sub.conversation_id, item.id, bucket).first();
      if (exists) continue;
      const conversation = { conversation_id: sub.conversation_id, service_url: sub.service_url, lang: langFor(sub.lang || sub.conversation_lang) };
      const delivered = await sendActivity(env, conversation, {
        type: "message",
        attachments: cardAttachment(renderNewsCard(item, sub.lang || sub.conversation_lang, env.SITE)),
      }).catch(() => false);
      if (!delivered) continue;
      await env.DB.prepare("INSERT OR IGNORE INTO teams_deliveries(conversation_id,event_key,bucket,created) VALUES(?,?,?,?)")
        .bind(sub.conversation_id, item.id, bucket, current).run();
      sent++;
    }
  }
  return { events: events.length, sent };
}

export async function handleTeams(env, request) {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
  if (!env.TEAMS_BOT_APP_ID || !env.TEAMS_BOT_SECRET) return new Response("Not configured", { status: 503 });
  const auth = request.headers.get("authorization") || "";
  const prefix = "Be" + "arer ";
  const token = auth.startsWith(prefix) ? auth.slice(prefix.length).trim() : "";
  if (!(await verifyBotToken(token, env.TEAMS_BOT_APP_ID))) return new Response("Unauthorized", { status: 401 });
  const text = await request.text();
  if (text.length > 65536) return new Response("Payload too large", { status: 413 });
  let activity;
  try { activity = JSON.parse(text); } catch { return new Response("Bad request", { status: 400 }); }
  if (activity.channelId !== "msteams" || !activity.conversation?.id) return new Response("Bad request", { status: 400 });
  const serviceUrl = validServiceUrl(activity.serviceUrl);
  if (!serviceUrl || activity.serviceUrl !== `${serviceUrl}/`) return new Response("Bad request", { status: 400 });
  const conversation = await saveConversation(env, activity);
  if (!conversation) return new Response("Bad request", { status: 400 });
  if (activity.type === "conversationUpdate" || activity.type === "installationUpdate") {
    if (activity.action === "remove") {
      await env.DB.prepare("DELETE FROM teams_subscriptions WHERE conversation_id=?").bind(conversation.conversation_id).run();
      await env.DB.prepare("DELETE FROM teams_convs WHERE conversation_id=?").bind(conversation.conversation_id).run();
    } else await sendText(env, conversation, labels(conversation.lang).help).catch(() => false);
    return new Response(null, { status: 200 });
  }
  if (activity.type === "invoke" && /^composeExtension\/(query|submitAction)$/.test(activity.name || "")) {
    const result = await composeExtension(env, activity, conversation);
    return Response.json(result.body, { status: result.status });
  }
  if (activity.type !== "message") return new Response(null, { status: 200 });
  const submit = submitData(activity);
  if (submit.action && await handleSubmit(env, conversation, activity)) return new Response(null, { status: 200 });
  const body = String(activity.text || "").replace(/<at>.*?<\/at>/gi, "").trim();
  if (/^(?:my\s+subscriptions|meine\s+abos|abos)$/i.test(body)) {
    const items = await listSubscriptions(env.DB, conversation.conversation_id);
    if (!items.length) await sendText(env, conversation, labels(conversation.lang).empty);
    else {
      const card = {
        $schema: "http://adaptivecards.io/schemas/adaptive-card.json", type: "AdaptiveCard", version: "1.5",
        body: items.map((item) => ({ type: "Container", items: [
          { type: "TextBlock", text: `${item.label} · ${item.frequency}`, wrap: true },
          { type: "ActionSet", actions: [{ type: "Action.Submit", title: labels(conversation.lang).removed, data: { action: "unsubscribe", topic_id: item.topic_id } }] },
        ] })),
      };
      await sendActivity(env, conversation, { type: "message", attachments: cardAttachment(card) });
    }
    return new Response(null, { status: 200 });
  }
  const unFollow = /^(?:unfollow|entfolge)\s+(.+)$/i.exec(body);
  if (unFollow) {
    const q = unFollow[1].trim().toLowerCase();
    await env.DB.prepare("DELETE FROM teams_subscriptions WHERE conversation_id=? AND (lower(topic_id)=? OR lower(label)=?)")
      .bind(conversation.conversation_id, q, q).run();
    await sendText(env, conversation, labels(conversation.lang).removed);
    return new Response(null, { status: 200 });
  }
  const follow = /^(?:follow|folge)\s+(.+)$/i.exec(body);
  if (follow) await performSearch(env, conversation, follow[1]);
  else if (/^https:\/\/(?:www\.)?m365\.fm\//i.test(body)) {
    const url = siteLink(env, body);
    const item = url ? await env.DB.prepare("SELECT id,url,lang,type,title,summary,image FROM search_doc WHERE url=? AND gone=0 LIMIT 1").bind(url).first() : null;
    if (item) await sendActivity(env, conversation, { type: "message", attachments: cardAttachment(renderNewsCard(item, conversation.lang, env.SITE)) });
    else await sendText(env, conversation, labels(conversation.lang).help);
  } else await sendActivity(env, conversation, { type: "message", attachments: cardAttachment(menuCard(conversation.lang)) });
  return new Response(null, { status: 200 });
}
