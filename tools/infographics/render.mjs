#!/usr/bin/env node
// Infografiken rendern: node tools/infographics/render.mjs <jobs.json> <results.json> [--conc 2]
// jobs.json: [{ "out": "pfad/ohne/endung", "spec": {template, ...}, }]
// Je Job: <out>.png (Standbild). Keine Videos/Schleifen (Entscheidung 18.11.2026: geteilt wird das Standbild).
// results.json: [{ out, ok, w, h, issues: [...] }]. Ein Bild mit Layoutfehlern (Ueberlauf, ausserhalb der Flaeche, Text auf Text) gilt als fehlgeschlagen: kein Upload.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { render } from './templates.mjs';
import { SIZES } from './templates.mjs';
const require = createRequire(import.meta.url);
let chromium; try { ({ chromium } = require('playwright')); } catch { ({ chromium } = await import('playwright')); }

const [jobsF, resF] = process.argv.slice(2);
const conc = Number((process.argv.indexOf('--conc') > 0 && process.argv[process.argv.indexOf('--conc') + 1]) || 2);
if (!jobsF || !resF) { console.error('Aufruf: render.mjs <jobs.json> <results.json> [--conc N]'); process.exit(2); }
const jobs = JSON.parse(fs.readFileSync(jobsF, 'utf8'));

const QA = () => {   // laeuft im Browser: Layoutpruefung
  const issues = [], cv = document.querySelector('.cv'), cr = cv.getBoundingClientRect();
  const els = [...cv.querySelectorAll('.p,.t,.n,.h,.s,.k,.m,.ft,.gr,[data-hero]')].filter(e => e.getBoundingClientRect().width > 0);
  for (const e of els) {
    const r = e.getBoundingClientRect(), nm = (e.className || e.tagName).toString().split(' ')[0];
    if (r.left < cr.left - 2 || r.top < cr.top - 2 || r.right > cr.right + 2 || r.bottom > cr.bottom + 2) issues.push('ausserhalb:' + nm);
    const fs_ = parseFloat(getComputedStyle(e).fontSize) || 16;  // Zeilenbox kleiner als Glyphen (line-height<1) ist kein Ueberlauf
    if (!e.matches('.gr') && !(e.hasAttribute('data-hero') && !e.classList.contains('p')) && (e.scrollHeight > e.clientHeight + 0.6 * fs_ || e.scrollWidth > e.clientWidth + 3)) issues.push('ueberlauf:' + nm);
  }
  const txt = els.filter(e => e.matches('.t,.n,.h,.s,.k,.m,.ft,.gr,[data-hero]:not(.p)'));
  for (let i = 0; i < txt.length; i++) for (let j = i + 1; j < txt.length; j++) {
    if (txt[i].contains(txt[j]) || txt[j].contains(txt[i])) continue;
    if (txt[i].matches('.gr,[data-hero]') && txt[j].matches('.gr,[data-hero]')) continue;
    const a = txt[i].getBoundingClientRect(), b = txt[j].getBoundingClientRect();
    const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left), oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
    if (ox > 6 && oy > 6) issues.push('text-auf-text:' + (txt[i].className || '') + '/' + (txt[j].className || ''));
  }
  return [...new Set(issues)];
};

const browser = await chromium.launch();
const results = [];
let next = 0;
async function worker() {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  for (;;) {
    const j = jobs[next++]; if (!j) break;
    const res = { out: j.out, ok: false, issues: [] };
    try {
      const [W, H] = SIZES[j.spec.template]; res.w = W; res.h = H;
      fs.mkdirSync(path.dirname(j.out), { recursive: true });
      await page.setViewportSize({ width: W, height: H });
      const hf = j.out + '.html'; fs.writeFileSync(hf, render({ ...j.spec, anim: false }));   // als Datei laden: aus about:blank darf Chromium die Schriften (file://) nicht lesen
      await page.goto(pathToFileURL(hf).href, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      res.issues = await page.evaluate(QA);
      await page.screenshot({ path: j.out + '.png' }); fs.rmSync(hf, { force: true });
      res.ok = res.issues.length === 0;
    } catch (e) { res.issues.push('fehler:' + String(e.message).slice(0, 160)); }
    results.push(res);
  }
  await page.close();
}
await Promise.all(Array.from({ length: Math.max(1, conc) }, worker));
fs.writeFileSync(resF, JSON.stringify(results));
await browser.close();
const bad = results.filter(r => !r.ok).length;
console.log(`gerendert: ${results.length - bad} ok, ${bad} mit Befund`);
