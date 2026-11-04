const GUARD = "@cf/meta/llama-guard-3-8b";
const TEASER = "@cf/meta/llama-3.1-8b-instruct";
const GUARD_CATEGORIES = {
  S1: "Gewalttaten", S2: "Nichtgewalttätige Straftaten", S3: "Sexualbezogene Straftaten",
  S4: "Kindesausbeutung", S5: "Verleumdung", S6: "Spezialisierte Beratung",
  S7: "Datenschutz", S8: "Geistiges Eigentum", S9: "Waffen",
  S10: "Hassrede", S11: "Suizid/Selbstverletzung", S12: "Sexuelle Inhalte", S13: "Wahlen",
};
const now = () => Math.floor(Date.now() / 1000);
const day = () => new Date().toISOString().slice(0, 10);
const summaryReady = new WeakSet();

export function estimatedNeurons(text) {
  return Math.max(1, Math.ceil([...String(text || "")].length / 4) + 128);
}

export async function reserveWorkersAi(db, env, neurons, utcDay = day()) {
  neurons = Math.ceil(Number(neurons));
  const configured = Number(env.WORKERS_AI_DAILY_NEURONS);
  const limit = Math.max(0, Math.floor(Number.isFinite(configured) ? configured : 9000));
  if (!Number.isSafeInteger(neurons) || neurons < 1 || neurons > limit) return false;
  try {
    const r = await db.prepare(
      "INSERT INTO workers_ai_daily(day,neurons) VALUES(?,?) ON CONFLICT(day) DO UPDATE SET neurons=neurons+excluded.neurons WHERE neurons+excluded.neurons<=?",
    ).bind(utcDay, neurons, limit).run();
    return (r.meta?.changes || 0) > 0;
  } catch {
    return false;
  }
}

export async function runWorkersAi(env, model, input, neurons = estimatedNeurons(JSON.stringify(input))) {
  if (!env.AI?.run || !(await reserveWorkersAi(env.DB, env, neurons))) return null;
  let timer;
  try {
    return await Promise.race([
      env.AI.run(model, input),
      new Promise((_, reject) => { timer = setTimeout(() => reject(new Error("timeout")), 2500); }),
    ]);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function moderateText(env, user, text) {
  if (user?.admin || user?.editor || !text) return { unsafe: false, skipped: true };
  const result = await runWorkersAi(env, GUARD, { messages: [{ role: "user", content: String(text).slice(0, 16000) }] });
  const response = String(result?.response || "").trim();
  if (!/^unsafe(?:\s|$)/i.test(response)) return { unsafe: false };
  const categories = [...new Set((response.match(/\bS\d+\b/g) || []))];
  return { unsafe: true, category: categories.map((code) => `${code}: ${GUARD_CATEGORIES[code] || "Andere"}`).join(", ") || "Unkategorisiert" };
}

export async function makeTeaser(env, text, lang) {
  if (!text) return "";
  const language = String(lang || "en").slice(0, 20);
  const result = await runWorkersAi(env, TEASER, {
    messages: [{ role: "user", content: `Write a factual teaser in the same language as this source (${language}), using 1–2 sentences and at most 300 characters. Do not invent details. Return only the teaser.\n\n${String(text).slice(0, 5000)}` }],
  });
  let teaser = String(result?.response || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().replace(/^["“”']|["“”']$/g, "");
  const sentences = [...teaser.matchAll(/[.!?](?:\s|$)/g)];
  if (sentences.length > 2) teaser = teaser.slice(0, sentences[1].index + 1).trim();
  return teaser.slice(0, 300);
}

export async function teaserValue(env, existing, auto, submitted, source, lang) {
  const provided = String(submitted || "").trim().slice(0, 300);
  if (provided) return { text: provided, auto: provided === existing ? !!auto : false };
  if (existing) return { text: existing, auto: !!auto };
  const generated = await makeTeaser(env, source, lang);
  return { text: generated, auto: !!generated };
}

export async function queueAiReview(db, kind, id, userId, category, content, created = now()) {
  await db.prepare(
    "INSERT INTO ai_review_queue(kind,item_id,user_id,category,content,created,status) VALUES(?,?,?,?,?,?,'pending') ON CONFLICT(kind,item_id) DO UPDATE SET user_id=excluded.user_id,category=excluded.category,content=excluded.content,created=excluded.created,status='pending'",
  ).bind(kind, id, userId, String(category || "Unkategorisiert").slice(0, 80), String(content || "").slice(0, 5000), created).run();
}

export async function ensureAiSummaryCols(db) {
  if (summaryReady.has(db)) return;
  for (const [table, columns] of [["blog_posts", ["summary_auto INTEGER NOT NULL DEFAULT 0"]], ["pod_episodes", ["summary TEXT NOT NULL DEFAULT ''", "summary_auto INTEGER NOT NULL DEFAULT 0"]], ["yt_videos", ["summary TEXT NOT NULL DEFAULT ''", "summary_auto INTEGER NOT NULL DEFAULT 0"]]]) {
    try { await db.prepare(`SELECT summary,summary_auto FROM ${table} LIMIT 1`).first(); }
    catch {
      for (const column of columns) {
        try { await db.prepare(`ALTER TABLE ${table} ADD COLUMN ${column}`).run(); } catch { /* Spalte existiert bereits */ }
      }
    }
  }
  summaryReady.add(db);
}

const isStaff = (user) => !!(user?.admin || user?.editor);

export async function handleModerationAdmin(env, request, path, user, J) {
  if (path !== "/api/admin/moderation" && path !== "/api/admin/moderation/decide") return null;
  if (!isStaff(user)) return J({ error: "forbidden" }, 403);
  const db = env.DB;
  if (path === "/api/admin/moderation" && request.method === "GET") {
    const rows = (await db.prepare(
      "SELECT id,kind,item_id,user_id,category,content,created FROM ai_review_queue WHERE status='pending' AND kind<>'blog' ORDER BY created LIMIT 100",
    ).all()).results || [];
    return J({ items: rows });
  }
  if (path === "/api/admin/moderation/decide" && request.method === "POST") {
    const b = await request.json().catch(() => ({})), id = Number(b.id), approve = b.approve === true;
    if (!Number.isSafeInteger(id) || id < 1) return J({ error: "bad_request" }, 400);
    const row = await db.prepare("SELECT kind,item_id FROM ai_review_queue WHERE id=? AND status='pending'").bind(id).first();
    if (!row) return J({ error: "not_found" }, 404);
    const actions = {
      comment: ["UPDATE comments SET status=? WHERE id=?", approve ? "ok" : "hidden"],
      question: ["UPDATE entity_q SET hidden=? WHERE id=?", approve ? 0 : 1],
      answer: ["UPDATE entity_a SET hidden=? WHERE id=?", approve ? 0 : 1],
      review: ["UPDATE show_reviews SET status=? WHERE id=?", approve ? "published" : "hidden"],
      podcast: ["UPDATE pod_episodes SET status=?,updated=? WHERE id=?", approve ? "submitted" : "rejected", now()],
      video: ["UPDATE yt_videos SET status=?,updated=? WHERE id=?", approve ? "submitted" : "rejected", now()],
    };
    const action = actions[row.kind];
    if (!action) return J({ error: "bad_request" }, 400);
    const [sql, ...values] = action;
    await db.prepare(sql).bind(...values, row.item_id).run();
    await db.prepare("UPDATE ai_review_queue SET status=? WHERE id=?").bind(approve ? "approved" : "rejected", id).run();
    return J({ ok: true });
  }
  return J({ error: "not_found" }, 404);
}

export async function handleAiBudget(env, request, path, J) {
  if (path !== "/api/internal/ai-budget") return null;
  const [scheme, token, ...extra] = String(request.headers.get("authorization") || "").split(" ");
  if (request.method !== "POST" || !env.CF_AI_TOKEN || scheme !== "Bearer" || token !== env.CF_AI_TOKEN || extra.length) {
    return J({ error: "forbidden" }, 403);
  }
  const b = await request.json().catch(() => ({})), neurons = Number(b.neurons);
  if (!Number.isSafeInteger(neurons) || neurons < 1) return J({ error: "bad_request" }, 400);
  const reserved = await reserveWorkersAi(env.DB, env, neurons);
  const configured = Number(env.WORKERS_AI_DAILY_NEURONS);
  return J({ reserved, limit: Math.max(0, Math.floor(Number.isFinite(configured) ? configured : 9000)) });
}
