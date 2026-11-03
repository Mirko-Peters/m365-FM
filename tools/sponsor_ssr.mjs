// T37 Sponsor-Seite: Vorab-Rendern im Seitenbau (site_sponsor.py ruft das Skript einmal je Bau auf).
// Eingabe (stdin): {P, E, nLangs, con, langs: [{lang, T, state, page, nums}]}, Ausgabe (stdout): {lang: {view, rowsHtml, recHtml, pickedHtml, key, nums}}.
// Dieselben Funktionen wie im Browser (assets/sponsor-calc.js): Standardpaket ohne Layoutsprung, Zahlen mit Intl je Sprache.
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const SC = require("../assets/sponsor-calc.js");
let s = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (d) => { s += d; });
process.stdin.on("end", () => { process.stdout.write(JSON.stringify(SC.ssr(JSON.parse(s)))); });
