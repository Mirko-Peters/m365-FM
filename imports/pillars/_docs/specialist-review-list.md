# Specialist review list: what to hand over before publishing (November 23, 2026)

Mirko decided (November 20, 2026) that three kinds of specialists read the sensitive sections of the 25 new English articles before they go live. Each list gives the file and the section headings to read (search the file for the heading). Every file's "Editorial notes" also list the open [unverified] items in that area.

Files are in `/mnt/project-files/seo-pillars-en/` (clusters in `clusters/`).

## 1. CPA / plant controller (US GAAP, tax, finance logic)

What to check: ASC 330 inventory costing and absorption costing statements, ASU 2015-11 (lower of cost and net realizable value), 26 U.S.C. § 263A (UNICAP), LIFO/FIFO, capex vs. opex, ASC 350-40 / ASU 2025-06 (internal-use software), throughput accounting vs. standard costing, ROI examples.

| File | Sections |
|---|---|
| clusters/manufacturing-inventory-management.md | 2.2 Carrying cost · 8.1 What goes into inventory cost · 8.2 Cost flow assumptions: FIFO, LIFO, weighted average · 8.3 Write-downs: lower of cost and net realizable value (the whole section 8 is the priority) |
| theory-of-constraints.md | Throughput accounting vs. cost accounting · Worked example: standard cost vs. throughput accounting · Inventory and reported profit · FAQ "What is throughput accounting?" |
| smed-changeover-reduction.md | The absorption-costing effect |
| kanban-pull-system.md | The finance view: cash, carrying cost and reported profit |
| mes-isa-95.md | Cost structure · Benefit structure · Worked example: a 220-employee valve plant (capitalization of internal-use software) |
| predictive-maintenance-iiot.md | Capex, opex and how finance will see it · ROI of predictive maintenance: a worked example |
| clusters/lot-sizing.md | 2. The cost model behind every rule · 3.3 Quantity discounts |
| 5s-visual-management.md | What the calculation teaches (red-tag / scrapped inventory accounting is still [unverified]) |
| clusters/paperless-manufacturing.md | The regulated-plant lever: release lead time (business case figures) |

## 2. EHS / safety professional (OSHA)

What to check: 29 CFR 1910.147 lockout/tagout incl. the minor servicing exception, 1910.212 machine guarding, 1910.178 powered industrial trucks, 1910.1200 HazCom labeling, 1910.144/145 safety colors and signs, ANSI Z535, floor marking, ergonomics, required OSHA training, how autonomous maintenance and quick changeover interact with LOTO.

| File | Sections |
|---|---|
| smed-changeover-reduction.md | Setting up is servicing under OSHA's lockout/tagout standard · The minor servicing exception: narrow, not a loophole · Common SMED mistakes |
| tpm-oee.md | TPM and safety: lockout/tagout, ergonomics and the operator's voice · Where 29 CFR 1910.147 applies · FAQ "Does lockout/tagout apply to autonomous maintenance?" |
| 5s-visual-management.md | What OSHA requires (federal general industry, 29 CFR 1910) · Floor marking: requirement vs. convention · Step 2: Set in order · Step 3: Shine |
| clusters/intralogistics.md | 8.1 OSHA rules for powered industrial trucks · FAQ "Do forklift operators need OSHA certification?" · 6. Equipment: forklifts, tuggers, conveyors, AGVs and AMRs (ANSI/A3 R15.08, B56.5, ISO 3691-4) |
| clusters/manufacturing-workforce-skills.md | OSHA training requirements in the matrix · FAQ "Which OSHA training is required in manufacturing?" |
| clusters/poka-yoke.md | 20 poka-yoke examples from manufacturing (machine guarding, 1910.212) |
| clusters/andon.md | Andon light colors and safety |
| predictive-maintenance-iiot.md | Safety during installation and repairs · Infrared thermography (NFPA 70B, arc flash) |
| theory-of-constraints.md | Safety rules do not bend for the constraint |
| clusters/standard-work.md | Standard work for non-cyclic tasks |
| clusters/kaizen.md | People, safety and labor relations |

Also worth a labor-relations / employment counsel read (optional): tpm-oee.md and kaizen.md labor sections (NLRA, *Electromation*), kanban-pull-system.md "Involving operators, handlers and their representatives".

## 3. Regulatory affairs / quality (FDA, aerospace, automotive, defense)

What to check: FDA 21 CFR Part 11 (electronic records and signatures), 21 CFR 211 and QMSR (21 CFR 820, device history records), FDA Computer Software Assurance guidance (final, February 2026), FSMA 204, ISO 9001:2026, AS9100, IATF 16949 clauses, CAPA, CMMC 2.0 / NIST SP 800-171, ITAR.

| File | Sections |
|---|---|
| clusters/paperless-manufacturing.md | FDA 21 CFR Part 11: electronic records and signatures · Data integrity · Hybrid records · Medical devices: QMSR · Aerospace and automotive · FAQ "Is a paperless system required to comply with 21 CFR Part 11?" |
| mes-isa-95.md | FDA 21 CFR Part 11: electronic records and signatures · Medical devices: QMSR and device history records · Food: FSMA 204 traceability · Automotive and aerospace |
| six-sigma-root-cause-analysis.md | When RCA is required: CAPA in regulated industries (IATF, AS9100, AS13000, ISO 13485 clauses; several still [unverified] because the standards are paywalled) |
| ot-cybersecurity-iec-62443.md | CMMC 2.0 for defense suppliers · The framework landscape: 62443, NIST, CISA, CMMC, NIS2 and the CRA |
| smed-changeover-reduction.md | Regulated industries · Cleaning-dominated and regulated changeovers (food, pharma, chemicals) |
| clusters/sustainable-manufacturing.md | The regulatory status table (SEC climate rule, California SB 253/261, EU CSRD, CBAM) · FAQs "Does the SEC climate disclosure rule apply to my company?", "Who has to report under California SB 253?", "Do US manufacturers have to comply with CSRD?" |

## Open decision

Several AS9100, IATF 16949 and AIAG-VDA FMEA clause references rest on secondary sources because the standards are paywalled. Either the regulatory reviewer confirms them from the purchased standards, or the [unverified] markers stay.
