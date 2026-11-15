import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const M = createRequire(import.meta.url)("../assets/entity-match.js");
const ents = [
  { id: "ifakt", type: "org", name: "iFAKT GmbH", aliases: ["iFAKT"], web: "https://www.ifakt.de" },
  { id: "microsoft", type: "org", name: "Microsoft", web: "https://www.microsoft.com" },
  { id: "micro-focus", type: "org", name: "Micro Focus International plc" },
  { id: "acme", type: "org", name: "Acme & Co. KG", same_as: ["https://acme.example.co.uk", "https://www.linkedin.com/company/acme"] },
  { id: "copilot", type: "product", name: "Copilot", web: "https://copilot.microsoft.com" },
];
test("Normalisierung: Rechtsform, Satzzeichen, Gross-/Kleinschreibung", () => {
  assert.equal(M.norm("iFAKT GmbH"), "ifakt");
  assert.equal(M.norm("Acme & Co. KG"), "acme");
  assert.equal(M.norm("Müller e.K."), "muller");
  assert.equal(M.norm("Foo, Inc."), "foo");
  assert.equal(M.domainOf("https://www.ifakt.de/team"), "ifakt.de");
  assert.equal(M.domainOf("ifakt.de"), "ifakt.de");
  assert.equal(M.domainOf("foo.bar.example.co.uk"), "example.co.uk");
  assert.equal(M.domainOf("iFAKT GmbH"), "");
});
test("Treffer: ifakt, iFAKT, iFAKT GmbH, ifakt.de, https://www.ifakt.de -> ifakt", () => {
  for (const q of ["ifakt", "iFAKT", "iFAKT GmbH", "IFAKT gmbh", "ifakt.de", "https://www.ifakt.de", "ifakt ag"]) assert.equal(M.match(q, ents, "org").entity?.id, "ifakt", q);
  assert.equal(M.match("Acme", ents, "org").entity?.id, "acme");
  assert.equal(M.match("acme.example.co.uk", ents, "org").entity?.id, "acme");
});
test("Eindeutiger Praefix wird genommen, mehrere werden als Liste angeboten, nichts bleibt leer", () => {
  assert.equal(M.match("Microso", ents, "org").entity?.id, "microsoft");
  const many = M.match("micro", ents, "org"); assert.equal(many.entity, null); assert.deepEqual(many.candidates.map((e) => e.id).sort(), ["micro-focus", "microsoft"]);
  const none = M.match("Zzz Firma", ents, "org"); assert.equal(none.entity, null); assert.equal(none.candidates.length, 0);
  assert.equal(M.match("copilot", ents, "org").entity, null);   // Typ-Filter
});
test("Vorschlag fuer Community-Firma: Domain vor Name, nur eindeutig", () => {
  assert.equal(M.suggest("Ganz anders", "https://ifakt.de", ents).by, "domain");
  assert.equal(M.suggest("iFAKT GmbH", "", ents).entity.id, "ifakt");
  assert.equal(M.suggest("iFAKT GmbH", "", ents).domain, "ifakt.de");
  assert.equal(M.suggest("Unbekannt", "https://unbekannt.io", ents), null);
  assert.equal(M.slug("Müller & Söhne GmbH"), "muller-sohne");
});
test("Schritt 1 (Firma/Event): Name oder Website findet vorhandene Einträge, getrennt nach Typ", () => {
  const evs = [{ id: "m365con", type: "event", name: "M365Con 2027", web: "https://m365con.net" }, { id: "summit-berlin", type: "event", name: "Summit Berlin", web: "https://summit.example.com/2027" }, { id: "summit-hamburg", type: "event", name: "Summit Hamburg" }];
  assert.equal(M.match("https://m365con.net/tickets", evs, "event").entity?.id, "m365con");
  assert.equal(M.match("M365Con", evs, "event").entity?.id, "m365con");
  assert.equal(M.match("m365con 2027", evs, "event").entity?.id, "m365con");
  const many = M.match("summit", evs, "event"); assert.equal(many.entity, null); assert.equal(many.candidates.length, 2);
  assert.equal(M.match("ifakt", [...ents, ...evs], "event").candidates.length, 0);   // Firma taucht nicht bei Events auf
  assert.equal(M.match("ifakt.de", [...ents, ...evs], "org").entity?.id, "ifakt");
});
