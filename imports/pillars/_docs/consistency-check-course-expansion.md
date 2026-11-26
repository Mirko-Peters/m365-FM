# Consistency check: 10 new pillars and 15 clusters (US English), November 20, 2026

Scope: all 35 English files in `/mnt/project-files/seo-pillars-en/` (10 existing pillars, 10 new pillars, 15 clusters in `clusters/`). Rules: `_course-expansion-brief.md` and `_localization-brief.md`. No course outline (Mirko builds the course himself).

## 1. Status per article

Word counts: `wc -w` from H1 to Conclusion (incl. FAQ), as measured in this check. Every article went through 3 expert-panel rounds (9 roles) plus a 4th verification round (fact checker, critic, subject expert).

### New pillars (`/en/learn/<slug>/`)

| Article | Words | Sources | Open [unverified] markers |
|---|---|---|---|
| 5s-visual-management | 15,780 | 47 | 11 |
| smed-changeover-reduction | 15,134 | 40 | 4 |
| tpm-oee | 13,800 | 37 | 6 |
| kanban-pull-system | 14,737 | 28 | 2 |
| six-sigma-root-cause-analysis | 15,908 | 33 | 17 |
| sop-mrp-production-planning | 16,314 | 37 | 9 |
| mes-isa-95 | 15,433 | 44 | 18 |
| predictive-maintenance-iiot | 15,834 | 37 | 11 |
| theory-of-constraints | 16,296 | 29 | 11 |
| ot-cybersecurity-iec-62443 | 16,921 | 40 | 11 |

Longest google.com competitors were 2,800 to 6,000 words; every pillar is 2.5 to 5 times longer.

### Clusters (`/en/learn/<parent>/<slug>/`)

| Parent | Cluster | Words | Sources | Open markers |
|---|---|---|---|---|
| lean-manufacturing | kaizen | 4,962 | 13 | 3 |
| lean-manufacturing | pdca-cycle | 3,990 | 10 | 5 |
| lean-manufacturing | a3-problem-solving | 3,970 | 8 | 3 |
| lean-manufacturing | poka-yoke | 4,206 | 7 | 3 |
| shop-floor-management | standard-work | 4,966 | 10 | 1 |
| shop-floor-management | andon | 4,934 | 16 | 0 |
| shop-floor-management | paperless-manufacturing | 4,825 | 12 | 0 |
| production-scheduling-aps | lot-sizing | 5,114 | 14 | 4 |
| production-scheduling-aps | manufacturing-inventory-management | 5,115 | 11 | 6 |
| production-scheduling-aps | intralogistics | 4,523 | 10 | 8 |
| digital-twin-manufacturing | manufacturing-simulation | 5,115 | 20 | 5 |
| digital-twin-manufacturing | process-mining-manufacturing | 5,032 | 13 | 5 |
| operational-excellence | sustainable-manufacturing | 5,003 | 20 | 1 |
| operational-excellence | supply-chain-resilience | 4,543 | 11 | 2 |
| operational-excellence | manufacturing-workforce-skills | 4,734 | 11 | 4 |

Marker counts include mentions in editorial notes and review logs, not only body text. Remaining markers are mostly practitioner estimates (rollout durations, team sizes), paywalled standard clauses (AIAG, AS9100, IATF 16949) and a few historical attributions. Each file's editorial notes list them.

## 2. Checks across all files

| Check | Result |
|---|---|
| Internal links `/en/learn/...` | All URLs in all 35 files resolve to the 20 pillar and 15 cluster slugs. No broken or variant slugs. |
| Inbound links | Every new article has 4 or more inbound links from other files (process mining is lowest with 4; manufacturing-kpis highest with 32). |
| Disclosure | "Note: The author works at iFAKT GmbH." in every author box (and in iFAKT passages where they exist). |
| Sponsored / paid partnership | No such label anywhere (only mentioned in editorial notes as "no sponsored label"). |
| Toulouse | Not mentioned in any article. |
| iFAKT passages | Only where they fit (SMED, simulation, process mining, a few value stream angles). Most new articles have none in the body. |
| 85% "world-class OEE" | Same handling everywhere: often attributed to Nakajima, primary passage not found, not a universal benchmark. |
| Six Sigma origin | Motorola, 1986 (OpEx table) and "mid-1980s" (lean, Six Sigma pillar). Compatible; no change. |
| Lean sequence "pull before leveling" | Kanban pillar explains that volume leveling at the pacemaker often starts with the first loops and mix leveling follows SMED. Compatible with the lean pillar; no change. |
| Year of *The Goal* | 1984 everywhere. |

## 3. Changes to the existing 10 English pillars

- **All 10:** a "New guides in this series (planned)" list at the end of Further reading, plus a review-log note "Consistency check (course expansion), November 20, 2026". No facts changed.
- **Deep-dive links in body sections:** lean-manufacturing (5S, standard work, SMED, kanban, poka-yoke, andon, TPM, kaizen/PDCA, A3, DMAIC), shop-floor-management (standardization, andon, digital boards), production-scheduling-aps (MRP, TOC, lot sizing, safety stock), digital-twin-manufacturing (simulation types, simulation study), operational-excellence (vs. Six Sigma, culture and people), manufacturing-kpis (changeover, OEE, maintenance KPIs), manufacturing-it-azure (IT/OT security).
- **production-scheduling-aps:** removed "theory of constraints, drum buffer rope" from secondary keywords to avoid cannibalizing the new theory-of-constraints pillar.

## 4. Corrections from the verification round (selection)

- SMED: absorption costing under US GAAP changed from "permissible" to "required in substance" (ASC 330).
- Theory of constraints: Linhares DOI pointed to an unrelated paper; corrected to 10.1016/j.ijpe.2009.04.023.
- MES/ISA-95: FDA Computer Software Assurance guidance corrected to final (February 2026) and device-only.
- OT cybersecurity: Colonial Pipeline wording now based on Senate testimony; CIRCIA status and the CMMC OT scoping updated.
- Supply chain resilience: EO 14017 is not revoked; it is under review via EO 14239.
- S&OP/MRP: the Demand Driven Institute certifies software and individuals, not training.
- Predictive maintenance: ISO 13381-1:2015 has a draft successor.
- Paperless manufacturing: ISO 9001:2026 (published September 16, 2026) added.

## 5. Open for Mirko

1. **Cluster URLs:** the nested scheme `/en/learn/<pillar>/<cluster>/` is an assumption. Confirm with the CMS.
2. **Paywalled standards:** several clauses (AIAG-VDA FMEA, AS9100, IATF 16949) rest on secondary sources. Buy the standards or keep the markers.
3. **Expert review before publishing:** a CPA/controller for the accounting sections (SMED, ToC, inventory), EHS for lockout/tagout (SMED, TPM), regulatory affairs for 21 CFR Part 11 (paperless, MES).
4. **SERP refresh:** the search limit ran out during writing, so some competitive analyses and "People also ask" lists rely on competitor FAQs or authority pages (OT security, resilience, workforce, intralogistics). Re-run with NEURONwriter before publishing.
5. **Small editorial calls:** keep the one iFAKT Polaris sentence in SMED; keep or drop Toyota "wireless andon since 2014"; offer the simulation Python model and the process-mining event log as downloads.

## 6. Round 5: SERP re-check and on-page optimization (November 20-23, 2026)

Mirko approved the re-check on November 20. The NEURONwriter monthly quota for new analyses was used up, so 13 articles were scored against existing NEURONwriter analyses from November 11, 2026 (m365.fm project, google.com); the other 12 were re-checked with web searches. Every article has a "Round 5" entry in its review log with changes (old -> new) and sign-offs. No new facts without a source; one new source in a3-problem-solving ([9]) and supply-chain-resilience ([12]).

| Article | Data | NW score before -> after | Notes |
|---|---|---|---|
| 5s-visual-management | NW | 72 -> 80 (top 83) | new meta, FAQ 18 -> 21 |
| smed-changeover-reduction | NW | 74 -> 79 (top 93) | new meta, FAQ 16 -> 19 |
| tpm-oee | NW | not scored -> 89 (top 90) | new meta/H1, FAQ 17 -> 21 |
| kanban-pull-system | NW | 63 -> 82 (top 74) | new meta, FAQ 17 -> 22 |
| six-sigma-root-cause-analysis | NW + web | 64 -> 85 (top 91) | "(RCA)" in meta/H1, new section "How to conduct a root cause analysis", FAQ 17 -> 21 |
| theory-of-constraints | NW terms only | not scorable (page too large for the tool) | 10 changes; underused terms 59 -> 50 of 98; score by URL after publishing |
| kaizen | NW | 82 -> 91 | 10 changes |
| pdca-cycle | NW | 65 -> 80 | 9 changes |
| a3-problem-solving | NW | 73 -> 80 | 10 changes |
| poka-yoke | NW | 44 -> 75 | 8 changes |
| standard-work | NW | 76 -> 87 | 6 changes |
| manufacturing-inventory-management | NW | 61 -> 78 | 9 changes |
| manufacturing-simulation | NW | 48 -> 64 | 8 changes |
| sop-mrp-production-planning, mes-isa-95, predictive-maintenance-iiot, ot-cybersecurity-iec-62443 | web | n/a | 6-8 changes each, 2-4 new FAQs; MES meta title now "Manufacturing Execution System (MES) and ISA-95 Guide"; OT longest competitor corrected to Rockwell (approx. 4,500-5,000 words) |
| andon, paperless-manufacturing, lot-sizing, intralogistics, process-mining-manufacturing, sustainable-manufacturing, supply-chain-resilience, manufacturing-workforce-skills | web | n/a | 4-5 changes and 1-3 new FAQs each; real top-10 tables added for resilience and workforce; first SERP positions for intralogistics |

Limits: the web search tool shows no live "People also ask" box, so questions came from NEURONwriter, competitor FAQs and headings. Questions without a verifiable source were left out (e.g. "What is replacing Six Sigma?", "7 types of maintenance", kaizen "5 elements"). Re-score theory-of-constraints and the web-checked articles in NEURONwriter after the December quota reset or by URL after publication.

Specialist hand-over list: `_specialist-review-list.md`.
