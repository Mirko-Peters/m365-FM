# Brief: course expansion "Manufacturing Excellence: from Lean basics to digital production planning" (2026-11-20)

Requested by Mirko (2026-11-20): 10 new English pillar articles and 15 cluster articles under the existing pillars, as the content base for his course. Mirko builds the course structure himself: do not write a course outline. Everything is **written directly in US English** for google.com (not translated from German). Same quality bar as the first 10 English pillars: deep research, SERP analysis, compendium length, expert-panel review loop, review log.

Read first: `_localization-brief.md` (general rules: US spelling, sources, iFAKT facts, disclosure, style, file structure) and at least one existing pillar, e.g. `lean-manufacturing.md`, for the exact layout. Where this brief differs, this brief wins.

## URL scheme and slugs

- Pillars: `https://www.m365.fm/en/learn/<slug>/` (same as the existing 10).
- Clusters: `https://www.m365.fm/en/learn/<parent-pillar-slug>/<cluster-slug>/` (nested under the parent pillar; an assumption, note it in editorial notes).
- New articles have **no German version**, so no hreflang pair; self-referencing canonical only.

### Existing pillars (link targets)

| Slug | Topic |
|---|---|
| `lean-manufacturing` | Lean Manufacturing |
| `operational-excellence` | Operational Excellence |
| `value-stream-mapping` | Value Stream Mapping |
| `digital-twin-manufacturing` | Digital Twin in Manufacturing |
| `production-scheduling-aps` | Production Scheduling and APS |
| `shop-floor-management` | Shop Floor Management and Gemba Walks |
| `manufacturing-kpis` | Manufacturing KPIs |
| `ifakt-polaris` | iFAKT Polaris (value stream software) |
| `manufacturing-it-azure` | Manufacturing IT with Azure |
| `aerospace-production-planning` | Aerospace Production Planning |

### New pillars (file `/mnt/project-files/seo-pillars-en/<slug>.md`, 10,000+ words H1..Conclusion)

| # | Slug | Working main keyword (verify on google.com) |
|---|---|---|
| P1 | `5s-visual-management` | 5S (5S lean / 5S methodology), visual management |
| P2 | `smed-changeover-reduction` | SMED / single minute exchange of die, changeover time reduction |
| P3 | `tpm-oee` | total productive maintenance (TPM), OEE |
| P4 | `kanban-pull-system` | kanban system in manufacturing, pull system |
| P5 | `six-sigma-root-cause-analysis` | Six Sigma, DMAIC, root cause analysis |
| P6 | `sop-mrp-production-planning` | sales and operations planning (S&OP), MRP, production planning in ERP |
| P7 | `mes-isa-95` | manufacturing execution system (MES), ISA-95 |
| P8 | `predictive-maintenance-iiot` | predictive maintenance, IIoT |
| P9 | `theory-of-constraints` | theory of constraints, bottleneck, drum-buffer-rope |
| P10 | `ot-cybersecurity-iec-62443` | OT cybersecurity, ISA/IEC 62443 |

### New clusters (file `/mnt/project-files/seo-pillars-en/clusters/<cluster-slug>.md`, 3,000-5,000 words H1..Conclusion)

| Parent pillar | Cluster slug | Working main keyword |
|---|---|---|
| lean-manufacturing | `kaizen` | kaizen, kaizen event |
| lean-manufacturing | `pdca-cycle` | PDCA cycle (Plan-Do-Check-Act, Deming cycle) |
| lean-manufacturing | `a3-problem-solving` | A3 problem solving, A3 report |
| lean-manufacturing | `poka-yoke` | poka-yoke, mistake proofing |
| shop-floor-management | `standard-work` | standard work, standardized work |
| shop-floor-management | `andon` | andon system |
| shop-floor-management | `paperless-manufacturing` | paperless manufacturing / paperless factory, digital work instructions |
| production-scheduling-aps | `lot-sizing` | lot sizing, economic order quantity / economic production quantity |
| production-scheduling-aps | `manufacturing-inventory-management` | manufacturing inventory management, safety stock |
| production-scheduling-aps | `intralogistics` | intralogistics, in-plant material flow, milk run |
| digital-twin-manufacturing | `manufacturing-simulation` | manufacturing simulation, discrete event simulation |
| digital-twin-manufacturing | `process-mining-manufacturing` | process mining in manufacturing |
| operational-excellence | `sustainable-manufacturing` | sustainable manufacturing, energy efficiency, scope 1-3 in plants |
| operational-excellence | `supply-chain-resilience` | supply chain resilience |
| operational-excellence | `manufacturing-workforce-skills` | manufacturing workforce skills, skills matrix, TWI |

Cluster rules: each cluster links to its parent pillar in the first 150 words and in "Further reading", links to its sibling clusters, and to new pillars where relevant. It is a focused deep dive, not a mini-pillar: answer the keyword better than the top 5 on google.com within 3,000-5,000 words.

## Interlinking

- Link to existing and new pillars with absolute URLs, marked "(planned)" in "Further reading" like the existing pillars. Only link where it helps the reader; every article links to at least 5 pillars/clusters in the body text.
- Suggested hubs: 5S/SMED/TPM/Kanban/Poka-yoke/Kaizen/PDCA/A3/Standard work -> `lean-manufacturing`; TPM/OEE -> `manufacturing-kpis`; S&OP/MRP/lot sizing/inventory/intralogistics/ToC -> `production-scheduling-aps`; MES/ISA-95/PdM/IIoT/OT security/paperless -> `manufacturing-it-azure` and `digital-twin-manufacturing`; Six Sigma/RCA -> `operational-excellence`; aerospace angles -> `aerospace-production-planning`; value stream angles -> `value-stream-mapping` and, only where a software example is genuinely useful, `ifakt-polaris`.
- The existing 10 English pillars will get links to their new clusters and the new pillars in the final consistency check (not by the article writers).

## Required standards and sources (verify online, never from memory)

Prefer US/English-language primary sources: OSHA (e.g. 29 CFR 1910.147 lockout/tagout, 1910.144/145 safety colors and signs), ANSI Z535, NIST (MEP, CSF 2.0, SP 800-82 Rev. 3), CISA (ICS advisories, Cross-Sector Cybersecurity Performance Goals), ISA-95 / IEC 62264, ISA/IEC 62443, ISA-18.2 (alarm management), ISO 22400 (KPIs for MOM), ASQ, AME, Lean Enterprise Institute, Shingo Institute, SME, MESA International, APICS/ASCM (SCOR, CPIM/CSCP), Japan Institute of Plant Maintenance (JIPM), Goldratt / TOC Institute, DOE (Better Plants, 50001 Ready), EPA, GHG Protocol, SEC climate rule status, BLS / Census, Deloitte / Manufacturing Institute skills gap studies, NAM. Peer-reviewed literature (DOI) where possible. Mark anything you cannot verify as [unverified]. Vendor claims stay labeled as vendor claims.

## iFAKT

Only where it genuinely fits (e.g. value stream / simulation / KPI analysis angles). Disclosure exactly "**Note: The author works at iFAKT GmbH.**" in any iFAKT passage and the author box. iFAKT does not pay for publication: no "sponsored" or "paid partnership" label. Never mention Toulouse. HQ: Curiestrasse 2, 70563 Stuttgart, Germany.

## Expert panel review loop (replaces the 5-role loop of the localization brief)

Each article (pillars AND clusters) goes through at least three full rounds (Mirko, 2026-11-20), documented in `## Review log` at the end of the file:

1. **Practitioner** (US plant manager / operations director, 20 years on the floor)
2. **Academic** (industrial engineering / operations management professor)
3. **IT/OT architect** (MES, ISA-95, OT security)
4. **Quality lead** (ASQ CQE / Six Sigma Black Belt, AS9100/IATF context)
5. **Finance** (plant controller / CFO: costs, ROI, inventory valuation, capex vs. opex)
6. **Worker voice and lean coach** (operator perspective, union/OSHA, respect for people)
7. **SEO specialist (US)** (search intent, SERP gaps, PAA, meta, structure, internal links)
8. **Fact checker** (re-verifies every number, quote, standard and source online)
9. **Critic** (fluff, AI tone, bias, iFAKT neutrality, padding)

Per round: findings per expert with verdict (satisfied / changes needed) -> **debate** where experts disagree (record positions and the resolution) -> optimization list (old -> new) -> next round. Stop only when all nine sign off. End with a short consensus statement and the final `wc -w` count.

## File structure

Same as `_localization-brief.md`: SEO metadata table (language `en-US`, no hreflang pair), Competitive analysis (google.com SERP, November 2026) with fetched pages and word counts, the article (H1, short answer, key takeaways, TOC, body, glossary where useful, FAQ from People also ask, Conclusion, Further reading on m365.fm), Author box, Sources (numbered, verified), Editorial notes (vendor claims, unverified items, internal links, JSON-LD schema with `inLanguage: en-US`, recommended graphics, cannibalization notes against the existing pillars), Review log.

Style: plain, specific, worked examples with numbers, formulas with calculations, templates and checklists in tables; no marketing fluff, no AI clichés, no em-dash chains, short paragraphs.
