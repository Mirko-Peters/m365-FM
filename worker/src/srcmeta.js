// Fingerabdruck der Quelle in meta (D1-Kosten, Paket A): Cron-Importe, deren Quelldatei sich seit dem letzten erfolgreichen Lauf nicht
// geaendert hat, lesen und schreiben in D1 nichts weiter (eine meta-Zeile statt tausender UPSERTs). Der Hash wird erst nach einem
// erfolgreichen Lauf gespeichert; schlaegt der Lauf fehl, versucht der naechste es erneut. Zuruecksetzen: meta-Wert per UPDATE aendern.
import { sha256hex } from "./util.js";

export async function getMeta(db, k) {
  try { return (await db.prepare("SELECT v FROM meta WHERE k=?").bind(k).first())?.v ?? null; } catch { return null; }
}
export async function setMeta(db, k, v) {
  await db.prepare("INSERT INTO meta(k,v) VALUES(?,?) ON CONFLICT(k) DO UPDATE SET v=excluded.v WHERE meta.v<>excluded.v").bind(k, String(v)).run();
}

// Antwort lesen: Text (fuer den Hash) und JSON. Test-Doubles liefern teils nur json().
export async function readJson(res) {
  if (typeof res?.text === "function") { const text = await res.text(); return { text, json: JSON.parse(text) }; }
  const json = await res.json();
  return { json, text: JSON.stringify(json) };
}

// { same, h, commit() }: same = Quelle unveraendert seit dem letzten commit()
export async function sourceState(db, key, text) {
  const h = await sha256hex(String(text));
  const same = (await getMeta(db, key)) === h;
  return { same, h, commit: () => setMeta(db, key, h).catch(() => 0) };
}
