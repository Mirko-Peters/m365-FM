// Blog auf der eigenen Domain (BLOG_OWN_DOMAIN.md): Auslieferung fuer den Site-Worker (sitewrk) und, ab dem zweiten Schritt, die Verwaltung der Domains.
import { byodOn } from "./byod_rules.js";
import { serveBlog, unknownHost } from "./byod_site.js";

// GET /api/byod/serve?host=<host>&path=<pfad>: fertige Seite des Blogs, wenn host eine AKTIVE Mitglieds-Domain ist. Sonst ein neutrales 404.
// Oeffentlich lesbar (es sind oeffentliche Inhalte), aber nur fuer aktive Domains; ohne Schalter BYOD=1 immer 404. Kein Cookie, keine Sitzung.
export async function handleByodServe(env, request, url) {
  if (!byodOn(env) || (request.method !== "GET" && request.method !== "HEAD")) return unknownHost();
  const r = await serveBlog(env, url.searchParams.get("host") || "", url.searchParams.get("path") || "/");
  return r || unknownHost();
}
