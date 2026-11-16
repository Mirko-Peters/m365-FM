// Verwaltung (admin.m365.fm) und Konto/Profil (profil.m365.fm): CORS mit Cookie und Rueckkehr nach der Anmeldung nur fuer SITE, PARTNER_SITE, ADMIN_SITE
// und PROFIL_SITE, nichts Fremdes, nichts Aehnliches.
import { test } from "node:test";
import assert from "node:assert/strict";
import worker from "../src/index.js";
import { cors, adminOrigin, profilOrigin, isOwnSite, b64u } from "../src/util.js";

const base = { SITE: "https://www.m365.fm", API: "https://api-dub.m365.fm", SESSION_SECRET: "s", GOOGLE_CLIENT_ID: "id", GOOGLE_CLIENT_SECRET: "sec" };
const all = { ...base, PARTNER_SITE: "https://partner.m365.fm", ADMIN_SITE: "https://admin.m365.fm", PROFIL_SITE: "https://profil.m365.fm" };
const req = (origin) => new Request("https://api-dub.m365.fm/api/me", { headers: origin ? { origin } : {} });
const BAD = ["", undefined, "http://admin.m365.fm", "https://admin.m365.fm/x", "https://u:p@admin.m365.fm", "https://:p@admin.m365.fm", "admin.m365.fm", "https://admin.m365.fm/?a=1", "https://admin.m365.fm/#x", "javascript:alert(1)"];

test("adminOrigin und profilOrigin: nur ein reiner https-Ursprung zaehlt", () => {
  assert.equal(adminOrigin(all), "https://admin.m365.fm");
  assert.equal(profilOrigin(all), "https://profil.m365.fm");
  assert.equal(adminOrigin({ ADMIN_SITE: "https://admin.m365.fm/" }), "https://admin.m365.fm");
  for (const bad of BAD) {
    assert.equal(adminOrigin({ ADMIN_SITE: bad }), "", String(bad));
    assert.equal(profilOrigin({ PROFIL_SITE: String(bad).replace("admin", "profil") }), "", String(bad));
  }
  assert.equal(isOwnSite(base, "https://admin.m365.fm"), false, "ohne ADMIN_SITE nicht erlaubt");
  assert.equal(isOwnSite(base, "https://profil.m365.fm"), false, "ohne PROFIL_SITE nicht erlaubt");
  assert.equal(isOwnSite({ ...base, ADMIN_SITE: "https://admin.m365.fm" }, "https://profil.m365.fm"), false, "jede Adresse nur fuer sich");
  assert.equal(isOwnSite(all, "https://partner.m365.fm"), true, "Sponsor-Dashboard bleibt erlaubt");
});

test("CORS: admin und profil duerfen mit Cookie anfragen, wenn gesetzt; Fremde und aehnliche Namen nie", () => {
  for (const o of ["https://admin.m365.fm", "https://profil.m365.fm", "https://partner.m365.fm", "https://www.m365.fm"]) {
    const ok = cors(all, req(o));
    assert.equal(ok["access-control-allow-origin"], o, o);
    assert.equal(ok["access-control-allow-credentials"], "true", o);
  }
  assert.equal(cors(base, req("https://admin.m365.fm"))["access-control-allow-origin"], undefined);
  assert.equal(cors(base, req("https://profil.m365.fm"))["access-control-allow-origin"], undefined);
  for (const o of ["https://admin.m365.fm.evil.example", "https://evil-admin.m365.fm", "https://xadmin.m365.fm", "http://admin.m365.fm", "https://profil.m365.fm.evil.example", "https://profile.m365.fm", "https://konto.m365.fm", "null"]) {
    const h = cors(all, req(o));
    assert.equal(h["access-control-allow-origin"], undefined, o);
    assert.equal(h["access-control-allow-credentials"], undefined, o);
  }
});

test("Anmeldung: Rueckkehr zu admin und profil moeglich, Fremdes faellt auf die Website zurueck", async () => {
  const back = async (env, ret) => {
    const r = await worker.fetch(new Request("https://api-dub.m365.fm/auth/login/google?return=" + encodeURIComponent(ret)), env, {});
    assert.equal(r.status, 302);
    const val = /m365o=([^;]+)/.exec(r.headers.get("set-cookie"))[1].split(".")[0];
    return new TextDecoder().decode(b64u.dec(val.split("|")[1]));
  };
  assert.equal(await back(all, "https://admin.m365.fm/"), "https://admin.m365.fm/");
  assert.equal(await back(all, "https://profil.m365.fm/de/?invite=abc"), "https://profil.m365.fm/de/?invite=abc");
  assert.equal(await back(base, "https://admin.m365.fm/"), "https://www.m365.fm/", "ohne ADMIN_SITE zurueck zur Website");
  assert.equal(await back(base, "https://profil.m365.fm/"), "https://www.m365.fm/", "ohne PROFIL_SITE zurueck zur Website");
  for (const evil of ["https://evil.example/", "https://admin.m365.fm.evil.example/", "https://profil.m365.fm@evil.example/", "//evil.example", "javascript:alert(1)", "https://admin.m365.fm:8443/"])
    assert.equal(await back(all, evil), "https://www.m365.fm/", evil);
  const r = await worker.fetch(new Request("https://api-dub.m365.fm/auth/login/google?return=" + encodeURIComponent("https://admin.m365.fm/")), all, {});
  assert.equal(new URL(r.headers.get("location")).searchParams.get("redirect_uri"), "https://api-dub.m365.fm/auth/callback/google", "OAuth-Rueckleitung bleibt bei api-dub");
});

test("Sitzungs-Cookie bleibt host-only und HttpOnly (nicht auf *.m365.fm ausgeweitet)", async () => {
  const { cookie } = await import("../src/util.js");
  const c = cookie("m365s", "x", 100);
  assert.match(c, /HttpOnly/); assert.match(c, /Secure/); assert.match(c, /SameSite=Lax/);
  assert.doesNotMatch(c, /Domain=/i);
});
