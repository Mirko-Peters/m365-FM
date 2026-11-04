const VECTOR_MODEL = "@cf/baai/bge-m3";
const VECTOR_DIMENSIONS = 1024;
const RRF_K = 60;

export async function embed(env, texts) {
  if (!env.AI || !Array.isArray(texts) || texts.some((text) => typeof text !== "string")) {
    throw new Error("Workers-AI-Binding oder Embedding-Eingabe fehlt");
  }
  const options = env.AI_GATEWAY ? { gateway: { id: env.AI_GATEWAY } } : undefined;
  const result = await env.AI.run(VECTOR_MODEL, { text: texts }, options);
  const vectors = result?.data;
  if (!Array.isArray(vectors) || vectors.length !== texts.length ||
      vectors.some((vector) => !Array.isArray(vector) || vector.length !== VECTOR_DIMENSIONS ||
        vector.some((value) => !Number.isFinite(value)))) {
    throw new Error("Ungueltige BGE-M3-Embeddings");
  }
  return vectors;
}

export async function upsertVectors(env, vectors) {
  if (!env.VEC) throw new Error("Vectorize-Binding fehlt");
  return env.VEC.upsert(vectors);
}

export async function queryVectors(env, vec, { filter, topK = 50 } = {}) {
  if (!env.VEC) throw new Error("Vectorize-Binding fehlt");
  const options = { topK, returnMetadata: "all" };
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
