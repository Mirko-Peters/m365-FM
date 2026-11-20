# Brief: US English versions of the 10 m365.fm pillar compendiums (2026-11-20)

Requested by Mirko: a US English version of all ten German compendium articles in `/mnt/project-files/seo-pillars/`.
This is a **localization for a US audience**, not a literal translation.

## Slug and title map (use these for all internal links between the English versions)

Base URL: `https://www.m365.fm/en/learn/<slug>/` (hreflang `en-US` <-> German `de-DE` at `https://www.m365.fm/learn/<german-slug>/`).

| # | German source file | English slug | Working main keyword (verify via SERP) |
|---|---|---|---|
| 1 | lean-management.md | `lean-manufacturing` | lean manufacturing |
| 2 | operational-excellence.md | `operational-excellence` | operational excellence |
| 3 | wertstromanalyse.md | `value-stream-mapping` | value stream mapping |
| 4 | digitaler-zwilling.md | `digital-twin-manufacturing` | digital twin in manufacturing |
| 5 | produktionsplanung-aps.md | `production-scheduling-aps` | production scheduling software / APS |
| 6 | shopfloor-management.md | `shop-floor-management` | shop floor management / gemba walk |
| 7 | produktionskennzahlen.md | `manufacturing-kpis` | manufacturing KPIs |
| 8 | ifakt-polaris.md | `ifakt-polaris` | value stream mapping software |
| 9 | manufacturing-it-azure.md | `manufacturing-it-azure` | Azure for manufacturing |
| 10 | produktionsplanung-luftfahrt.md | `aerospace-production-planning` | aerospace production planning |

Every English article links to the other English articles (by the URLs above, absolute) wherever the German one links to the German sister, plus a "Further reading on m365.fm" list naming all relevant sisters. Mark them "(planned)" like the German ones. Links to m365.fm entity pages (`/entity/...`) stay as they are.

## Localization rules

- US spelling (optimize, color, program, center), US number format (1,000.5), dates as "November 20, 2026", currency: keep EUR figures where the source is EUR and add an approximate USD value only if useful and labeled "approx.". Units: imperial first where US readers expect it, metric in parentheses (or the reverse for engineering values that are metric in practice); never silently convert.
- Prefer US / English-language sources and standards where real equivalents exist: OSHA, NIST (incl. NIST MEP, NIST CSF 2.0), ISA-95 / ISA/IEC 62443, ANSI, ASQ, AME (Association for Manufacturing Excellence), Lean Enterprise Institute, Shingo Institute, SME, MESA International, NAM, Deloitte/McKinsey US studies, US BLS/Census data, FAA (for aerospace: FAA Part 145, 14 CFR, AS9100/AS9145, ITAR/EAR, DFARS/CMMC 2.0), FTC Endorsement Guides. Every new source must be **opened and verified** (web search/fetch); no source from memory. If not verifiable, keep the original source or mark [unverified].
- German context stays where it adds value, but explained for US readers (e.g. VDI guidelines, ifaa, REFA, Fraunhofer, NIS2, German works councils / Betriebsrat, GDPR). Do not delete correct German sources just because they are German; add English equivalents.
- US search intent: check the top-ranking English pages on google.com for the main keyword (word count, structure, gaps) with web search and fetch, and write a short "Competitive analysis (google.com SERP, November 2026)" table like the German one. Target: more complete and longer than the longest competitor, without padding.
- Re-do H1, H2s, short answer, key takeaways, FAQ (questions US users actually ask, e.g. "People also ask"), meta title (<= 60 chars), meta description (<= 155 chars), main + secondary English keywords, schema suggestion (JSON-LD, `inLanguage: en-US`).
- Keep all facts accurate. Carry over the German [unverified] markings and editorial notes, translated. Do not add numbers you cannot source.
- iFAKT facts: iFAKT GmbH, headquarters Curiestrasse 2, 70563 Stuttgart, Germany (commercial register Stuttgart HRB 22661). **Never mention Toulouse** (office closed). **No "paid partnership" / "sponsored" claim**; iFAKT does not pay for publication. Disclosure in iFAKT sections and author box exactly: "**Note: The author works at iFAKT GmbH.**" (this satisfies the FTC's material-connection disclosure; mention that in the editorial notes only, not as a sponsorship label). Vendor claims stay labeled as vendor claims.
- Author box: "[Mirko Peters](https://www.m365.fm/entity/mirko-peters/) is the host of m365.fm and works at iFAKT GmbH. On m365.fm he writes about ..." (keep the editor placeholder for role/bio/photo).
- Style: plain, specific, no marketing fluff, no AI clichés ("delve", "in today's fast-paced world", "it's not X, it's Y" chains, "game-changer"), no em-dash chains, short paragraphs.

## File structure (same as the German files)

1. `# SEO metadata` table (Meta title, Meta description, Slug, Main keyword, Secondary keywords, Search intent, Target word count incl. actual `wc -w` of H1..Conclusion, Language version `en-US` + hreflang pair)
2. `# Competitive analysis (google.com SERP, November 2026)`
3. The article (H1 .. Conclusion, FAQ, Further reading)
4. `# Author box`
5. `# Sources` (numbered, matching [n] in text)
6. `# Editorial notes` (vendor-only claims, unverified items, internal links, schema JSON-LD, recommended graphics, hreflang/cannibalization note)
7. `## Review log` — the review loop for the English version

## Review loop (at least one full round per article)

Five roles: Subject-matter expert, SEO specialist (US), Reader from the US target audience (plant manager / ops leader / M365 admin as fits), Fact checker (actively re-verifies every changed or new fact and every new US source online), Critic (fluff, bias, iFAKT neutrality, AI tone, Germanisms). Round 1 findings with verdicts -> discussion of conflicts -> optimization (list old -> new) -> Round 2 verdicts. Repeat until all five are satisfied. Document it in the Review log.

## Output

- File: `/mnt/project-files/seo-pillars-en/<english-slug>.md`
- Claude Doc: one doc per article, title = the English H1.
