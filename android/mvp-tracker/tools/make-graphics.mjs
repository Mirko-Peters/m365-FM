// Erzeugt alle Grafiken der Android-App aus assets/favicon.svg (keine Rasterbilder im Repo, CLAUDE.md):
//   node tools/make-graphics.mjs [res-Ordner]
// Ohne Argument: nur Store-Grafiken nach build/store-graphics/ (Play-Symbol 512x512, Feature-Grafik 1024x500, Telefon-Platzhalter nicht).
// Mit Argument (…/android/app/src/main/res): zusaetzlich Launcher-Symbole (mipmap-*), eckig, rund, adaptiv (Vordergrund).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const svgFile = path.resolve(root, "../../assets/favicon.svg");
const outStore = path.join(root, "build", "store-graphics");
const resDir = process.argv[2] ? path.resolve(process.argv[2]) : null;

const BG = "#1d2126";   // Hintergrund des Favicons
const AC = "#3b6391";   // --ac der Seite

const svg = fs.readFileSync(svgFile, "utf8");
const inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");   // Inhalt des Favicons (64x64)
const bgRect = '<rect width="64" height="64" fill="#1d2126"/>';
if (!inner.includes(bgRect)) throw new Error("assets/favicon.svg hat sich geaendert: Hintergrund-Rechteck nicht gefunden");
const glyph = inner.replace(bgRect, "");              // nur Schrift und Linien, transparent
const FONT = 'font-family="DejaVu Sans,Liberation Sans,Arial,sans-serif"';
// Schrift auf dem Runner: Arial Narrow fehlt, DejaVu/Liberation sind breiter -> "M365" waagerecht auf die Breite des Favicons stauchen
// (librsvg ignoriert textLength). Mittelpunkt bleibt x=32.
const fix = (s) => s.replace(/font-family="[^"]*"/g, FONT).replace(/<text ([^>]*)font-size="30"([^>]*)>([^<]*)<\/text>/g,
  '<g transform="translate(32 0) scale(0.62 1) translate(-32 0)"><text $1font-size="28"$2>$3</text></g>');

const png = (s, w, h) => sharp(Buffer.from(s), { density: 300 }).resize(w, h).png().toBuffer();
const square = (px) => png(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="${BG}"/>${fix(glyph)}</svg>`, px, px);
// Adaptiver Vordergrund: 108x108-Flaeche, Motiv in der sicheren Zone (66 von 108), Hintergrund kommt als Farbe aus den Ressourcen
const foreground = (px) => png(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 108 108"><g transform="translate(27 27) scale(0.84375)">${fix(glyph)}</g></svg>`, px, px);
const round = async (px) => sharp(await square(px)).composite([{ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}"><circle cx="${px / 2}" cy="${px / 2}" r="${px / 2}" fill="#fff"/></svg>`), blend: "dest-in" }]).png().toBuffer();

fs.mkdirSync(outStore, { recursive: true });
fs.writeFileSync(path.join(outStore, "play-icon-512.png"), await square(512));

// Feature-Grafik 1024x500: Verlauf Dunkel -> Seitenfarbe, Symbol links, Name rechts
const icon = await square(300);
const banner = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="500" viewBox="0 0 1024 500">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${BG}"/><stop offset="1" stop-color="${AC}"/></linearGradient></defs>
<rect width="1024" height="500" fill="url(#g)"/>
<text x="420" y="225" ${FONT} font-weight="700" font-size="64" fill="#eef0f3">M365.FM</text>
<text x="420" y="300" ${FONT} font-weight="700" font-size="64" fill="#eef0f3">Contributor</text>
<rect x="420" y="330" width="220" height="6" fill="#82a7d4"/>
<text x="420" y="385" ${FONT} font-size="30" fill="#dfe6ef">Your Microsoft community work</text>
</svg>`;
const bannerPng = await sharp(Buffer.from(banner), { density: 144 }).resize(1024, 500).png().toBuffer();
fs.writeFileSync(path.join(outStore, "feature-graphic-1024x500.png"),
  await sharp(bannerPng).composite([{ input: icon, left: 70, top: 100 }]).png().toBuffer());

if (resDir) {
  const dens = { mdpi: [48, 108], hdpi: [72, 162], xhdpi: [96, 216], xxhdpi: [144, 324], xxxhdpi: [192, 432] };
  for (const [d, [launcher, fg]] of Object.entries(dens)) {
    const dir = path.join(resDir, `mipmap-${d}`);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "ic_launcher.png"), await square(launcher));
    fs.writeFileSync(path.join(dir, "ic_launcher_round.png"), await round(launcher));
    fs.writeFileSync(path.join(dir, "ic_launcher_foreground.png"), await foreground(fg));
  }
  console.log("Launcher-Symbole geschrieben nach", resDir);
}
console.log("Store-Grafiken:", fs.readdirSync(outStore).join(", "));
