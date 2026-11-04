import { b64u, isLang, LANGS } from "./util.js";
import { handleSearch } from "./search.js";

const ISSUER = "https://api.botframework.com";
const OPENID = "https://login.botframework.com/v1/.well-known/openidconfiguration";
const KINDS = new Set(["entity", "creator", "event"]);
const FREQUENCIES = new Set(["immediate", "daily", "weekly"]);
const ID = /^[a-z0-9][a-z0-9-]{1,79}$/;
const cache = new Map();
let connectorTokenCache;
const now = () => Math.floor(Date.now() / 1000);
const TZ_LABEL = { en: "Time zone", de: "Zeitzone", es: "Zona horaria", fr: "Fuseau horaire", it: "Fuso orario", pt: "Fuso horário", nl: "Tijdzone", pl: "Strefa czasowa", id: "Zona waktu", ru: "Часовой пояс", uk: "Часовий пояс", ar: "المنطقة الزمنية", he: "אזור זמן", ja: "タイムゾーン", ko: "시간대" };

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
const CHOICES = {
  de: { kinds: [["Entität", "entity"], ["Creator", "creator"], ["Event", "event"]], frequencies: [["Sofort", "immediate"], ["Täglich", "daily"], ["Wöchentlich", "weekly"]], open: "Öffnen", play: "Abspielen" },
  en: { kinds: [["Entity", "entity"], ["Creator", "creator"], ["Event", "event"]], frequencies: [["Immediately", "immediate"], ["Daily", "daily"], ["Weekly", "weekly"]], open: "Open", play: "Play" },
  es: { kinds: [["Entidad", "entity"], ["Creador", "creator"], ["Evento", "event"]], frequencies: [["Inmediatamente", "immediate"], ["Diaria", "daily"], ["Semanal", "weekly"]], open: "Abrir", play: "Reproducir" },
  fr: { kinds: [["Entité", "entity"], ["Créateur", "creator"], ["Événement", "event"]], frequencies: [["Immédiate", "immediate"], ["Quotidienne", "daily"], ["Hebdomadaire", "weekly"]], open: "Ouvrir", play: "Écouter" },
  it: { kinds: [["Entità", "entity"], ["Creator", "creator"], ["Evento", "event"]], frequencies: [["Immediata", "immediate"], ["Giornaliera", "daily"], ["Settimanale", "weekly"]], open: "Apri", play: "Riproduci" },
  pt: { kinds: [["Entidade", "entity"], ["Criador", "creator"], ["Evento", "event"]], frequencies: [["Imediata", "immediate"], ["Diária", "daily"], ["Semanal", "weekly"]], open: "Abrir", play: "Reproduzir" },
  nl: { kinds: [["Entiteit", "entity"], ["Maker", "creator"], ["Evenement", "event"]], frequencies: [["Direct", "immediate"], ["Dagelijks", "daily"], ["Wekelijks", "weekly"]], open: "Openen", play: "Afspelen" },
  pl: { kinds: [["Encja", "entity"], ["Twórca", "creator"], ["Wydarzenie", "event"]], frequencies: [["Natychmiast", "immediate"], ["Codziennie", "daily"], ["Co tydzień", "weekly"]], open: "Otwórz", play: "Odtwórz" },
  id: { kinds: [["Entitas", "entity"], ["Kreator", "creator"], ["Acara", "event"]], frequencies: [["Langsung", "immediate"], ["Harian", "daily"], ["Mingguan", "weekly"]], open: "Buka", play: "Putar" },
  ru: { kinds: [["Сущность", "entity"], ["Автор", "creator"], ["Событие", "event"]], frequencies: [["Сразу", "immediate"], ["Ежедневно", "daily"], ["Еженедельно", "weekly"]], open: "Открыть", play: "Воспроизвести" },
  uk: { kinds: [["Сутність", "entity"], ["Автор", "creator"], ["Подія", "event"]], frequencies: [["Одразу", "immediate"], ["Щодня", "daily"], ["Щотижня", "weekly"]], open: "Відкрити", play: "Відтворити" },
  ar: { kinds: [["كيان", "entity"], ["منشئ", "creator"], ["حدث", "event"]], frequencies: [["فورًا", "immediate"], ["يوميًا", "daily"], ["أسبوعيًا", "weekly"]], open: "فتح", play: "تشغيل" },
  he: { kinds: [["ישות", "entity"], ["יוצר", "creator"], ["אירוע", "event"]], frequencies: [["מיידי", "immediate"], ["יומי", "daily"], ["שבועי", "weekly"]], open: "פתיחה", play: "הפעלה" },
  ja: { kinds: [["エンティティ", "entity"], ["クリエイター", "creator"], ["イベント", "event"]], frequencies: [["すぐに", "immediate"], ["毎日", "daily"], ["毎週", "weekly"]], open: "開く", play: "再生" },
  ko: { kinds: [["엔터티", "entity"], ["크리에이터", "creator"], ["이벤트", "event"]], frequencies: [["즉시", "immediate"], ["매일", "daily"], ["매주", "weekly"]], open: "열기", play: "재생" },
};

const labels = (lang) => TEXT[isLang(lang) ? lang : "en"] || TEXT.en;
const langFor = (value) => {
  const lang = String(value || "").toLowerCase().split("-")[0];
  return lang === "en" || isLang(lang) ? lang : "en";
};
const timezoneName = (value) => {
  try { return new Intl.DateTimeFormat("en", { timeZone: value }).resolvedOptions().timeZone; } catch { return "UTC"; }
};
const cardAttachment = (content) => [{ contentType: "application/vnd.microsoft.card.adaptive", content }];

export async function verifyBotToken(token, appId, fetcher = fetch, at = now(), serviceUrl = "") {
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
    const normalizeServiceUrl = (value) => {
      const url = new URL(value);
      return url.origin + url.pathname.replace(/\/+$/, "");
    };
    if (claims.serviceurl && serviceUrl && normalizeServiceUrl(claims.serviceurl) !== normalizeServiceUrl(serviceUrl)) return false;
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
    return url.protocol === "https:" && !url.username && !url.password && !url.search && !url.hash &&
      (url.hostname === "api.botframework.com" || url.hostname.endsWith(".trafficmanager.net") || url.hostname.endsWith(".botframework.com"))
      ? url.origin + url.pathname.replace(/\/+$/, "") : "";
  } catch {
    return "";
  }
}

function siteLink(env, value) {
  try {
    const url = new URL(value);
    const site = new URL(env.SITE);
    const sameHost = url.origin === site.origin || url.hostname === "m365.fm" && site.hostname === "www.m365.fm";
    return url.protocol === "https:" && sameHost ? `${site.origin}${url.pathname}${url.search}${url.hash}` : "";
  } catch {
    return "";
  }
}

export function topicReference(row) {
  let path;
  try { path = new URL(row.url).pathname; } catch { return null; }
  const entity = /(?:^|\/)entity\/([a-z0-9-]+)(?:\/|$)/i.exec(path);
  if (entity && ["entity", "person"].includes(row.type)) return { id: entity[1], kind: "entity" };
  const creator = /\/community\/u\/([a-z0-9-]+)(?:\/|$)/i.exec(path);
  if (creator && row.type === "person") return { id: creator[1], kind: "creator" };
  const event = /\/(?:community\/)?events\/([a-z0-9-]+)(?:\/|$)/i.exec(path);
  if (event && row.type === "event") return { id: event[1], kind: "event" };
  return null;
}

export function renderNewsCard(item, lang = "en", site = "https://www.m365.fm") {
  const title = String(item?.title || "M365.FM").slice(0, 200);
  const url = siteLink({ SITE: site }, item?.url);
  const body = String(item?.summary || item?.body || "").slice(0, 500);
  const image = /^https:\/\/img\.m365\.fm\/[^\s"'<>]+$/i.test(item?.image || "") ? item.image :
    /^https:\/\/d3wo5wojvuv7l\.cloudfront\.net\/[^\s"'<>]+$/i.test(item?.image || "") ? item.image : "";
  const type = String(item?.type || item?.kind || "").toLowerCase();
  const choiceLabels = CHOICES[langFor(lang)] || CHOICES.en;
  const caption = type.includes("episode") || type === "podcast" ? choiceLabels.play : choiceLabels.open;
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

export function renderDigestCard(items, lang, site) {
  return {
    $schema: "http://adaptivecards.io/schemas/adaptive-card.json", type: "AdaptiveCard", version: "1.5",
    body: items.slice(0, 10).map((item) => {
      const card = renderNewsCard(item, lang, site);
      return {
        type: "Container",
        items: [
          ...card.body,
          ...(card.actions?.length ? [{ type: "ActionSet", actions: card.actions }] : []),
        ],
      };
    }),
    lang: langFor(lang),
  };
}

function menuCard(lang, query = "") {
  const t = labels(lang);
  const choiceLabels = CHOICES[langFor(lang)] || CHOICES.en;
  return {
    $schema: "http://adaptivecards.io/schemas/adaptive-card.json", type: "AdaptiveCard", version: "1.5",
    body: [
      { type: "TextBlock", text: t.title, size: "Medium", weight: "Bolder" },
      { type: "Input.Text", id: "query", label: t.search, value: query, placeholder: "Copilot Studio" },
      { type: "Input.ChoiceSet", id: "kind", label: t.kind, value: "entity", choices: choiceLabels.kinds.map(([title, value]) => ({ title, value })) },
      { type: "Input.ChoiceSet", id: "frequency", label: t.frequency, value: "immediate", choices: choiceLabels.frequencies.map(([title, value]) => ({ title, value })) },
      { type: "Input.ChoiceSet", id: "lang", label: t.language, value: langFor(lang), choices: [
        ...["en", ...LANGS].map((l) => ({ title: l.toUpperCase(), value: l })),
      ] },
      { type: "Input.Text", id: "timezone", label: TZ_LABEL[langFor(lang)], value: "UTC", placeholder: "Europe/Berlin" },
    ],
    actions: [{ type: "Action.Submit", title: t.search, data: { action: "search" } }],
  };
}

function choicesCard(lang, query, items) {
  const t = labels(lang);
  const choiceLabels = CHOICES[langFor(lang)] || CHOICES.en;
  const choices = items.map((item) => ({
    title: item.title,
    value: `${item.kind}:${item.id}`,
  }));
  return {
    $schema: "http://adaptivecards.io/schemas/adaptive-card.json", type: "AdaptiveCard", version: "1.5",
    body: [
      { type: "TextBlock", text: t.results, size: "Medium", weight: "Bolder" },
      { type: "Input.ChoiceSet", id: "topic", style: "expanded", choices },
      { type: "Input.ChoiceSet", id: "frequency", label: t.frequency, value: "immediate", choices: choiceLabels.frequencies.map(([title, value]) => ({ title, value })) },
      { type: "Input.ChoiceSet", id: "lang", label: t.language, value: langFor(lang), choices: [
        ...["en", ...LANGS].map((l) => ({ title: l.toUpperCase(), value: l })),
      ] },
      { type: "Input.Text", id: "timezone", label: TZ_LABEL[langFor(lang)], value: "UTC", placeholder: "Europe/Berlin" },
    ],
    actions: [{ type: "Action.Submit", title: t.follow, data: { action: "subscribe", query } }],
  };
}

async function searchContent(env, query, sourceRequest) {
  const q = String(query || "").trim();
  if (q.length < 1 || q.length > 100) return [];
  const url = new URL("/api/search", env.API || env.SITE);
  url.searchParams.set("q", q);
  url.searchParams.set("size", "10");
  const headers = new Headers();
  const clientIp = sourceRequest?.headers.get("cf-connecting-ip");
  if (clientIp) headers.set("cf-connecting-ip", clientIp);
  const request = new Request(url, { method: "GET", headers });
  const response = await handleSearch(env, request, url, (data, status = 200) =>
    new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } }));
  if (!response.ok) return [];
  return (await response.json()).results || [];
}

async function searchTopics(env, query, request) {
  return (await searchContent(env, query, request)).map((row) => {
    const ref = topicReference(row);
    return ref ? { ...row, ...ref } : null;
  }).filter(Boolean);
}

async function connectorToken(env) {
  if (connectorTokenCache?.expires > now()) return connectorTokenCache.value;
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
  const result = await response.json();
  connectorTokenCache = { value: result.access_token, expires: now() + Math.max(60, Number(result.expires_in || 3600) - 60) };
  return connectorTokenCache.value;
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

export async function readLimitedBody(request, limit = 65536) {
  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > limit) return null;
  if (!request.body) return "";
  const reader = request.body.getReader(), chunks = [];
  let length = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > limit) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  const body = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
  return new TextDecoder().decode(body);
}

async function performSearch(env, conversation, query, kind, request) {
  let items = await searchTopics(env, query, request);
  if (kind && KINDS.has(kind)) items = items.filter((item) => item.kind === kind);
  if (!items.length) return sendText(env, conversation, labels(conversation.lang).help);
  return sendActivity(env, conversation, { type: "message", attachments: cardAttachment(choicesCard(conversation.lang, query, items)) });
}

async function handleSubmit(env, conversation, activity, request) {
  const data = submitData(activity);
  if (data.action === "search") return performSearch(env, conversation, data.query, data.kind, request);
  if (data.action === "subscribe") {
    const [kind, topicId] = String(data.topic || "").split(":", 2);
    const frequency = String(data.frequency || "immediate");
    const lang = langFor(data.lang || conversation.lang);
    if (!KINDS.has(kind) || !ID.test(topicId || "") || !FREQUENCIES.has(frequency)) return sendText(env, conversation, "Invalid subscription.");
    const item = (await searchTopics(env, data.query || topicId, request)).find((x) => x.id === topicId && x.kind === kind);
    if (!item) return sendText(env, conversation, "Topic not found.");
    const existing = await env.DB.prepare("SELECT 1 x FROM teams_subscriptions WHERE conversation_id=? AND kind=? AND topic_id=?")
      .bind(conversation.conversation_id, kind, topicId).first();
    const count = await env.DB.prepare("SELECT COUNT(*) n FROM teams_subscriptions WHERE conversation_id=?").bind(conversation.conversation_id).first();
    if (!existing && (count?.n || 0) >= 50) return sendText(env, conversation, "Subscription limit reached.");
    const timezone = timezoneName(data.timezone || "UTC");
    await env.DB.prepare(
      "INSERT INTO teams_subscriptions(conversation_id,kind,topic_id,label,frequency,lang,timezone,created) VALUES(?,?,?,?,?,?,?,?) ON CONFLICT(conversation_id,kind,topic_id) DO UPDATE SET label=excluded.label,frequency=excluded.frequency,lang=excluded.lang,timezone=excluded.timezone",
    ).bind(conversation.conversation_id, kind, topicId, item.title, frequency, lang, timezone, now()).run();
    return sendText(env, conversation, labels(lang).saved);
  }
  if (data.action === "unsubscribe") {
    const topicId = String(data.topic_id || "").slice(0, 80);
    await env.DB.prepare("DELETE FROM teams_subscriptions WHERE conversation_id=? AND topic_id=?").bind(conversation.conversation_id, topicId).run();
    return sendText(env, conversation, labels(conversation.lang).removed);
  }
  return false;
}

async function composeExtension(env, activity, conversation, request) {
  const value = activity.value || {};
  const parameters = Array.isArray(value.parameters) ? value.parameters : [];
  const urlValue = parameters.find((x) => x.name === "url")?.value || "";
  const url = siteLink(env, urlValue);
  const urlResult = url ? await env.DB.prepare("SELECT id,url,lang,type,title,summary,image FROM search_doc WHERE url=? AND gone=0 LIMIT 1").bind(url).first() : null;
  const query = parameters.find((x) => x.name === "query")?.value || value.queryOptions?.query || "";
  const results = urlResult ? [urlResult] : await searchContent(env, query, request);
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
  const rawData = row.data || row.payload || row.event_data || row.payload_json;
  try { data = typeof rawData === "string" ? JSON.parse(rawData) : rawData || {}; } catch {}
  let translations = row.translations || row.i18n || data.translations || data.i18n || {};
  try { if (typeof translations === "string") translations = JSON.parse(translations); } catch { translations = {}; }
  const createdValue = row.created || row.created_at || data.created || data.created_at || 0;
  const numericCreated = Number(createdValue);
  const created = Number.isFinite(numericCreated) && numericCreated > 0
    ? Math.floor(numericCreated > 1000000000000 ? numericCreated / 1000 : numericCreated)
    : Math.floor(Date.parse(createdValue) / 1000) || 0;
  return {
    id: String(row.event_key || row.event_id || row.id || data.event_key || data.event_id || data.id || ""),
    topicId: String(row.topic_id || row.eid || row.entity_id || row.entity_eid || data.topic_id || data.eid || data.entity_id || data.entity_eid || ""),
    creator: String(row.creator_handle || row.handle || data.creator_handle || data.handle || ""),
    topicKind: String(row.topic_kind || row.subscription_kind || data.topic_kind || data.subscription_kind || ""),
    type: String(row.event_type || row.kind || row.type || data.event_type || data.kind || data.type || "entity").toLowerCase(),
    title: String(row.title || row.item_title || data.title || "M365.FM").slice(0, 200),
    summary: String(row.summary || row.description || row.body || data.summary || data.description || data.body || "").slice(0, 500),
    url: String(row.url || row.item_url || row.link || data.url || data.item_url || data.link || ""),
    image: String(row.image || row.cover || row.cover_url || data.image || data.cover || data.cover_url || ""),
    created,
    translations,
  };
}

function localizedEvent(item, lang) {
  const translation = item.translations?.[langFor(lang)] || {};
  return {
    ...item,
    title: String(translation.title || item.title),
    summary: String(translation.summary || translation.body || item.summary),
    url: String(translation.url || item.url),
    image: String(translation.image || item.image),
  };
}

function localTime(timezone, at) {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: timezoneName(timezone), year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", hourCycle: "h23", weekday: "short",
  }).formatToParts(new Date(at * 1000));
  return Object.fromEntries(parts.map((part) => [part.type, part.value]));
}

export function localBucket(frequency, timezone, at) {
  const local = localTime(timezone, at);
  const day = `${local.year}-${local.month}-${local.day}`;
  if (frequency === "daily") return `d:${day}`;
  if (frequency === "weekly") {
    const monday = new Date(`${day}T00:00:00Z`);
    monday.setUTCDate(monday.getUTCDate() - ((monday.getUTCDay() + 6) % 7));
    return `w:${monday.toISOString().slice(0, 10)}`;
  }
  return `i:${at}`;
}

export function deliveryTime(frequency, timezone, at) {
  const local = localTime(timezone, at);
  const hour = Number(local.hour);
  if (hour >= 22 || hour < 7) return false;
  return frequency === "immediate" || hour === 7 &&
    (frequency === "daily" || frequency === "weekly" && local.weekday === "Mon");
}

export async function dispatchTeamsNews(env, at = new Date()) {
  const current = Math.floor(at.getTime() / 1000);
  let events;
  try {
    events = (await env.DB.prepare("SELECT * FROM entity_events ORDER BY rowid DESC LIMIT 100").all()).results || [];
  } catch {
    return { unavailable: "entity_events", sent: 0 };
  }
  const groups = new Map();
  for (const raw of events) {
    const item = parseEvent(raw);
    if (!item.id || !item.topicId || !item.title || !item.url || current - item.created > 14 * 86400) continue;
    const kind = KINDS.has(item.topicKind) ? item.topicKind : /event/.test(item.type) ? "event" : "entity";
    const subs = (await env.DB.prepare(
      "SELECT s.conversation_id,s.kind,s.topic_id,s.frequency,s.lang,s.timezone,c.service_url,c.lang conversation_lang FROM teams_subscriptions s JOIN teams_convs c ON c.conversation_id=s.conversation_id WHERE (s.topic_id=? AND s.kind=?) OR (s.topic_id=? AND s.kind='creator')",
    ).bind(item.topicId, kind, item.creator).all()).results || [];
    for (const sub of subs) {
      const frequency = FREQUENCIES.has(sub.frequency) ? sub.frequency : "immediate";
      if (!deliveryTime(frequency, sub.timezone, current)) continue;
      const timezone = timezoneName(sub.timezone);
      const bucket = `${timezone}:${localBucket(frequency, timezone, current)}`;
      const alreadyDelivered = await env.DB.prepare("SELECT 1 x FROM teams_deliveries WHERE conversation_id=? AND event_key=? LIMIT 1")
        .bind(sub.conversation_id, item.id).first();
      if (alreadyDelivered) continue;
      if (frequency !== "immediate" && await env.DB.prepare("SELECT 1 x FROM teams_deliveries WHERE conversation_id=? AND bucket=? LIMIT 1")
        .bind(sub.conversation_id, bucket).first()) continue;
      const lang = langFor(sub.lang || sub.conversation_lang);
      const key = `${sub.conversation_id}|${frequency}|${bucket}|${lang}|${frequency === "immediate" ? item.id : ""}`;
      if (!groups.has(key)) groups.set(key, {
        conversation: { conversation_id: sub.conversation_id, service_url: sub.service_url, lang },
        frequency, bucket, events: [],
      });
      groups.get(key).events.push(item);
    }
  }
  let sent = 0;
  for (const group of groups.values()) {
    const candidates = [...new Map(group.events.map((item) => [item.id, item])).values()].slice(0, 10);
    const items = [];
    for (const item of candidates) {
      const reservation = await env.DB.prepare(
        "INSERT OR IGNORE INTO teams_deliveries(conversation_id,event_key,bucket,created) VALUES(?,?,?,?)",
      ).bind(group.conversation.conversation_id, item.id, group.bucket, current).run();
      if (reservation.meta?.changes) items.push(item);
    }
    if (!items.length) continue;
    const card = group.frequency === "immediate"
      ? renderNewsCard(localizedEvent(items[0], group.conversation.lang), group.conversation.lang, env.SITE)
      : renderDigestCard(items.map((item) => localizedEvent(item, group.conversation.lang)), group.conversation.lang, env.SITE);
    const delivered = await sendActivity(env, group.conversation, { type: "message", attachments: cardAttachment(card) }).catch(() => false);
    if (!delivered) {
      for (const item of items) await env.DB.prepare(
        "DELETE FROM teams_deliveries WHERE conversation_id=? AND event_key=? AND bucket=?",
      ).bind(group.conversation.conversation_id, item.id, group.bucket).run();
      continue;
    }
    sent++;
  }
  await env.DB.prepare("DELETE FROM teams_deliveries WHERE created<?").bind(current - 60 * 86400).run();
  return { events: events.length, sent };
}

export async function handleTeams(env, request) {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
  if (!env.TEAMS_BOT_APP_ID || !env.TEAMS_BOT_SECRET) return new Response("Not configured", { status: 503 });
  const auth = request.headers.get("authorization") || "";
  const prefix = "Be" + "arer ";
  const token = auth.startsWith(prefix) ? auth.slice(prefix.length).trim() : "";
  if (!(await verifyBotToken(token, env.TEAMS_BOT_APP_ID))) return new Response("Unauthorized", { status: 401 });
  const text = await readLimitedBody(request);
  if (text === null) return new Response("Payload too large", { status: 413 });
  let activity;
  try { activity = JSON.parse(text); } catch { return new Response("Bad request", { status: 400 }); }
  if (activity.channelId !== "msteams" || !activity.conversation?.id) return new Response("Bad request", { status: 400 });
  const serviceUrl = validServiceUrl(activity.serviceUrl);
  if (!serviceUrl) return new Response("Bad request", { status: 400 });
  if (!(await verifyBotToken(token, env.TEAMS_BOT_APP_ID, fetch, now(), activity.serviceUrl))) return new Response("Unauthorized", { status: 401 });
  const conversation = await saveConversation(env, activity);
  if (!conversation) return new Response("Bad request", { status: 400 });
  if (activity.type === "conversationUpdate" || activity.type === "installationUpdate") {
    const removed = activity.action === "remove" || (activity.membersRemoved || []).some((member) => member.id === activity.recipient?.id);
    if (removed) {
      await env.DB.prepare("DELETE FROM teams_subscriptions WHERE conversation_id=?").bind(conversation.conversation_id).run();
      await env.DB.prepare("DELETE FROM teams_deliveries WHERE conversation_id=?").bind(conversation.conversation_id).run();
      await env.DB.prepare("DELETE FROM teams_convs WHERE conversation_id=?").bind(conversation.conversation_id).run();
    } else await sendText(env, conversation, labels(conversation.lang).help).catch(() => false);
    return new Response(null, { status: 200 });
  }
  if (activity.type === "invoke" && /^composeExtension\/(query|submitAction)$/.test(activity.name || "")) {
    const result = await composeExtension(env, activity, conversation, request);
    return Response.json(result.body, { status: result.status });
  }
  if (activity.type !== "message") return new Response(null, { status: 200 });
  const submit = submitData(activity);
  if (submit.action && await handleSubmit(env, conversation, activity, request)) return new Response(null, { status: 200 });
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
    if (/^(?:all|alles|alle|everything)$/i.test(q)) {
      await env.DB.prepare("DELETE FROM teams_subscriptions WHERE conversation_id=?").bind(conversation.conversation_id).run();
    } else await env.DB.prepare("DELETE FROM teams_subscriptions WHERE conversation_id=? AND (lower(topic_id)=? OR lower(label)=?)")
      .bind(conversation.conversation_id, q, q).run();
    await sendText(env, conversation, labels(conversation.lang).removed);
    return new Response(null, { status: 200 });
  }
  const follow = /^(?:follow|folge)\s+(.+)$/i.exec(body);
  if (follow) await performSearch(env, conversation, follow[1], "", request);
  else if (/^https:\/\/(?:www\.)?m365\.fm\//i.test(body)) {
    const url = siteLink(env, body);
    const item = url ? await env.DB.prepare("SELECT id,url,lang,type,title,summary,image FROM search_doc WHERE url=? AND gone=0 LIMIT 1").bind(url).first() : null;
    if (item) await sendActivity(env, conversation, { type: "message", attachments: cardAttachment(renderNewsCard(item, conversation.lang, env.SITE)) });
    else await sendText(env, conversation, labels(conversation.lang).help);
  } else await sendActivity(env, conversation, { type: "message", attachments: cardAttachment(menuCard(conversation.lang)) });
  return new Response(null, { status: 200 });
}
