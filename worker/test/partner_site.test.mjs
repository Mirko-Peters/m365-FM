// Sponsor-Dashboard auf partner.m365.fm: CORS mit Cookie und Rueckkehr nach der Anmeldung nur fuer SITE und PARTNER_SITE, nichts Fremdes.
import { test } from "node:test";
import assert from "node:assert/strict";
import worker from "../src/index.js";
import { cors, partnerOrigin, isOwnSite, b64u } from "../src/util.js";

const base = { SITE: "https://www.m365.fm", API: "https://api-dub.m365.fm", SESSION_SECRET: "s", GOOGLE_CLIENT_ID: "id", GOOGLE_CLIENT_SECRET: "sec" };
const withPartner = { ...base, PARTNER_SITE: "https://partner.m365.fm" };
const req = (origin) => new Request("https://api-dub.m365.fm/api/me", { headers: origin ? { origin } : {} });

test("partnerOrigin: nur ein reiner https-Ursprung zaehlt", () => {
  assert.equal(partnerOrigin(withPartner), "https://partner.m365.fm");
  assert.equal(partnerOrigin({ PARTNER_SITE: "https://partner.m365.fm/" }), "https://partner.m365.fm");
  for (const bad of ["", undefined, "http://partner.m365.fm", "https://partner.m365.fm/x", "https://u:p@partner.m365.fm", "partner.m365.fm", "https://partner.m365.fm/?a=1", "javascript:alert(1)"])
    assert.equal(partnerOrigin({ PARTNER_SITE: bad }), "", String(bad));
  assert.equal(isOwnSite(withPartner, "https://www.m365.fm"), true);
  assert.equal(isOwnSite(base, "https://partner.m365.fm"), false, "ohne PARTNER_SITE nicht erlaubt");
  assert.equal(isOwnSite({ SITE: "https://www.m365.fm" }, ""), false);
});

test("CORS: partner.m365.fm darf mit Cookie anfragen, wenn PARTNER_SITE gesetzt ist; Fremde und aehnliche Namen nie", () => {
  const ok = cors(withPartner, req("https://partner.m365.fm"));
  assert.equal(ok["access-control-allow-origin"], "https://partner.m365.fm");
  assert.equal(ok["access-control-allow-credentials"], "true");
  assert.equal(cors(withPartner, req("https://www.m365.fm"))["access-control-allow-origin"], "https://www.m365.fm", "www bleibt erlaubt");
  assert.equal(cors(base, req("https://partner.m365.fm"))["access-control-allow-origin"], undefined, "ohne Einstellung nicht erlaubt");
  for (const o of ["https://partner.m365.fm.evil.example", "https://evilpartner.m365.fm", "http://partner.m365.fm", "https://other.m365.fm", "null"])
    assert.equal(cors(withPartner, req(o))["access-control-allow-origin"], undefined, o);
});

test("Anmeldung: Rueckkehr zu partner.m365.fm moeglich, fremde Adressen fallen auf die Website zurueck", async () => {
  const back = async (env, ret) => {
    const r = await worker.fetch(new Request("https://api-dub.m365.fm/auth/login/google?return=" + encodeURIComponent(ret)), env, {});
    assert.equal(r.status, 302);
    const val = /m365o=([^;]+)/.exec(r.headers.get("set-cookie"))[1].split(".")[0];
    return new TextDecoder().decode(b64u.dec(val.split("|")[1]));
  };
  assert.equal(await back(withPartner, "https://partner.m365.fm/de/report/?org=a"), "https://partner.m365.fm/de/report/?org=a");
  assert.equal(await back(withPartner, "https://www.m365.fm/community/"), "https://www.m365.fm/community/");
  assert.equal(await back(base, "https://partner.m365.fm/"), "https://www.m365.fm/", "ohne PARTNER_SITE zurueck zur Website");
  for (const evil of ["https://evil.example/", "https://partner.m365.fm.evil.example/", "//evil.example", "javascript:alert(1)", "https://partner.m365.fm@evil.example/"])
    assert.equal(await back(withPartner, evil), "https://www.m365.fm/", evil);
  // der OAuth-Rueckkehrpunkt beim Anbieter bleibt api-dub - keine neue Adresse bei Google/Microsoft/GitHub noetig
  const r = await worker.fetch(new Request("https://api-dub.m365.fm/auth/login/google?return=" + encodeURIComponent("https://partner.m365.fm/")), withPartner, {});
  assert.equal(new URL(r.headers.get("location")).searchParams.get("redirect_uri"), "https://api-dub.m365.fm/auth/callback/google");
});
