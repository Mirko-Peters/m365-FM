import { sha256hex } from "./util.js";

const VECTOR_MODEL = "@cf/baai/bge-m3";
const VECTOR_DIMENSIONS = 1024;
const EMBED_BATCH_SIZE = 100;
const UPSERT_BATCH_SIZE = 1000;
const RRF_K = 60;

export async function vectorId(key) {
  return (await sha256hex(String(key))).slice(0, 32);
}

function withTimeout(promise, timeoutMs) {
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) return promise;
  let timer;
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error("Workers-AI-Timeout")), timeoutMs);
    }),
  ]).finally(() => clearTimeout(timer));
}

export async function embed(env, texts, gatewayOptions = {}) {
  if (!env.AI || !Array.isArray(texts) || texts.some((text) => typeof text !== "string")) {
    throw new Error("Workers-AI-Binding oder Embedding-Eingabe fehlt");
  }
  const { requestTimeoutMs, ...gatewayOptionsWithoutTimeout } = gatewayOptions;
  const gateway = env.AI_GATEWAY_ID
    ? { id: env.AI_GATEWAY_ID, ...gatewayOptionsWithoutTimeout }
    : null;
  const vectors = [];
  for (let i = 0; i < texts.length; i += EMBED_BATCH_SIZE) {
    const batch = texts.slice(i, i + EMBED_BATCH_SIZE);
    const options = gateway ? { gateway } : undefined;
    const result = await withTimeout(
      env.AI.run(VECTOR_MODEL, { text: batch }, options),
      requestTimeoutMs,
    );
    const embeddings = result?.data;
    if (!Array.isArray(embeddings) || embeddings.length !== batch.length ||
        embeddings.some((vector) => !Array.isArray(vector) || vector.length !== VECTOR_DIMENSIONS ||
          vector.some((value) => !Number.isFinite(value)))) {
      throw new Error("Ungueltige BGE-M3-Embeddings");
    }
    vectors.push(...embeddings);
  }
  return vectors;
}

export async function upsertVectors(env, vectors) {
  if (!env.VEC) throw new Error("Vectorize-Binding fehlt");
  const results = [];
  for (let i = 0; i < vectors.length; i += UPSERT_BATCH_SIZE) {
    results.push(await env.VEC.upsert(vectors.slice(i, i + UPSERT_BATCH_SIZE)));
  }
  return results;
}

export async function queryVectors(env, vec, { filter, topK = 50, returnMetadata = "all" } = {}) {
  if (!env.VEC) throw new Error("Vectorize-Binding fehlt");
  const options = { topK, returnMetadata };
  if (filter && Object.keys(filter).length) options.filter = filter;
  return (await env.VEC.query(vec, options))?.matches || [];
}

export function rrf(lists, k = RRF_K) {
  const merged = new Map();
  for (const list of lists) {
    const seen = new Set();
    for (const [index, item] of (list || []).entries()) {
      if (!item || typeof item.id !== "string" || seen.has(item.id)) continue;
      seen.add(item.id);
      const current = merged.get(item.id) || { ...item, rrfScore: 0 };
      merged.set(item.id, {
        ...current,
        ...item,
        rrfScore: current.rrfScore + 1 / (k + index + 1),
      });
    }
  }
  return [...merged.values()].sort((a, b) => b.rrfScore - a.rrfScore || a.id.localeCompare(b.id))
    .map((item, index) => ({ ...item, rank: index + 1 }));
}
