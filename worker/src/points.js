// Punkte einloesen: Guthaben, Katalog, Einloesung (sofort oder als Anfrage fuer die Redaktion)
import { cleanText, rateLimit } from "./util.js";
import { stats } from "./badges.js";
import { gate, inScope, logEdit } from "./perm.js";

export const CATALOG = [
  { id: "contacts", cost: 100, auto: true },      // +5 neue Kontakte heute
  { id: "spotlight", cost: 500, auto: false },   // eigener Artikel/Beitrag wird auf der M365-Show-Company-Page geteilt
  { id: "video", cost: 1500, auto: false },       // Stick-Man-Video zu eigener (freigegebener) Episode/eigenem Beitrag
];
const now = () => Math.floor(Date.now() / 1000);
const today = () => new Date().toISOString().slice(0, 10);

export async function handlePoints(env, request, url, path, user, J) {
  const db = env.DB, method = request.method;
  if (!user) return J({ error: "login" }, 401);
  if (path === "/api/points" && method === "GET") {
    const st = await stats(db, user.id);
    const hist = (await db.prepare("SELECT id,item,cost,status,created FROM points_spent WHERE user_id=? ORDER BY created DESC LIMIT 30").bind(user.id).all()).results || [];
    return J({ earned: st.earned, spent: st.spent, balance: st.balance, catalog: CATALOG, history: hist });
  }
  if (path === "/api/points/redeem" && method === "POST") {
    if (!(await rateLimit(db, `redeem:${user.id}`, 10, 3600))) return J({ error: "rate_limit" }, 429);
    const b = await request.json().catch(() => ({})), it = CATALOG.find((c) => c.id === b.item); if (!it) return J({ error: "bad_item" }, 400);
    const st = await stats(db, user.id); if (st.balance < it.cost) return J({ error: "not_enough", balance: st.balance }, 400);
    const note = cleanText(b.note || "", 300).replace(/[<>]/g, "");
    await db.prepare("INSERT INTO points_spent(user_id,item,cost,status,note,created) VALUES(?,?,?,?,?,?)").bind(user.id, it.id, it.cost, it.auto ? "done" : "pending", note, now()).run();
    if (it.id === "contacts") await db.prepare("INSERT INTO msg_bonus(user_id,day,extra) VALUES(?,?,5) ON CONFLICT(user_id,day) DO UPDATE SET extra=extra+5").bind(user.id, today()).run();
    return J({ ok: true, balance: st.balance - it.cost, status: it.auto ? "done" : "pending" });
  }
  if (path === "/api/admin/points/requests" && method === "GET") {
    const g = await gate(db, user, "queue.review"); if (!g.ok || !inScope(g.actor, {})) return J({ error: "forbidden" }, 403);   // Editoren und Admin; ohne Thema, also nicht fuer Fach-Editoren
    return J({ items: (await db.prepare("SELECT p.id,p.item,p.cost,p.note,p.created,u.name FROM points_spent p JOIN users u ON u.id=p.user_id WHERE p.status='pending' ORDER BY p.created").all()).results || [] });
  }
  if (path === "/api/admin/points/decide" && method === "POST") {
    // Einloesung bestaetigen/ablehnen: can() wie jede Entscheidung - nie die eigene Einloesung, nie die eines Kollegen der eigenen Firma; im Protokoll
    const b = await request.json().catch(() => ({})), row = await db.prepare("SELECT id,user_id,item,cost FROM points_spent WHERE id=? AND status='pending'").bind(+b.id).first();
    const g = await gate(db, user, b.ok ? "review.approve" : "review.reject", { ownerId: row?.user_id ?? null }); if (!g.ok) return J({ error: g.why }, 403);
    if (!row) return J({ error: "not_found" }, 404);
    if (b.ok) await db.prepare("UPDATE points_spent SET status='done' WHERE id=? AND status='pending'").bind(row.id).run(); else await db.prepare("DELETE FROM points_spent WHERE id=? AND status='pending'").bind(row.id).run();   // Ablehnung = Punkte zurueck
    await logEdit(db, g.actor, b.ok ? "review.approve" : "review.reject", "points", row.id, { reason: `${row.item} (${row.cost})`, before: { status: "pending" }, after: { status: b.ok ? "done" : "rejected" } });
    return J({ ok: true });
  }
  return null;
}
