# SEO metadata

| Field | Value |
|---|---|
| Meta title | Poka-Yoke in Manufacturing: Types, Examples, Steps (50 characters; before the November 20, 2026 SERP re-check: "Poka-Yoke (Mistake Proofing): Types, Examples, Steps") |
| Meta description | Poka-yoke (poka yoke) in manufacturing: control vs. warning devices, 3 methods, 20 examples, how to implement it to prevent errors, and a cost example. (151 characters; before the re-check: "Poka-yoke explained: control vs. warning devices, the 3 setting methods, 20 shop floor examples, a 5-step design process and a cost-benefit example.") |
| Slug | `/en/learn/lean-manufacturing/poka-yoke/` (full URL: https://www.m365.fm/en/learn/lean-manufacturing/poka-yoke/) |
| Parent pillar | [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) |
| Main keyword | poka-yoke, mistake proofing |
| Secondary keywords | poka yoke examples, error proofing, mistake-proofing devices, poka-yoke types, contact method, fixed-value method, motion-step method, source inspection, Shigeo Shingo, zero quality control, warning vs control poka-yoke, poka-yoke in manufacturing, poka-yoke verification, digital poka-yoke |
| Search intent | Informational with strong example intent ("poka yoke examples"). Audience: manufacturing and quality engineers, supervisors, CI coaches, quality managers in IATF 16949 and AS9100 environments |
| Target word count | 3,000-5,000 words (cluster). Actual H1 to Conclusion (`wc -w`): **4,576 words** (after the SERP re-check and optimization, November 20, 2026; 4,108 after the verification pass) |
| Language version | US English (`en-US`). New article without a German version: no hreflang pair, self-referencing canonical only |

# Competitive analysis (google.com SERP, November 2026)

Analyzed: English results on google.com (US) for "poka-yoke mistake proofing", searched November 20, 2026. Word counts are estimates of the main text.

| Page (URL) | approx. words | Strengths | Gaps |
|---|---|---|---|
| asq.org/quality-resources/mistake-proofing | approx. 850 | five-step procedure; setting functions (contact, fixed-value, motion-step, information enhancement); warning vs. control; successive, self and source inspection; service example | no Shingo history, no manufacturing examples, no cost data |
| lean.org/lexicon-terms/poka-yoke/ (Lean Enterprise Institute) | short lexicon entry (not counted) | shutdown vs. warning, workplace and everyday examples, four characteristics of good devices | no design process, no verification |
| shingo.org/mistake-proofing-mistakes/ (Shingo Institute, 2020) | blog article (not counted) | why devices fail: not in standard work, ergonomics, no root cause follow-up, operators not involved | no definitions or examples |
| psnet.ahrq.gov / AHRQ report "Mistake-Proofing the Design of Health Care Processes" (Grout, 2007) | report, about 120,000 characters | research-based, cost data (median device cost about $100), "not a panacea" chapter | healthcare focus |
| autodesk.com/products/fusion-360/blog/20-poka-yoke-examples/ | approx. 1,300 | LEI definition, numbered examples, six implementation steps | title promises 20 examples, page lists 15, mostly consumer products; no FAQ; uncited claims; no cost or verification guidance |
| tulip.co (poka-yoke ebook), mrpeasy.com, kainexus.com, Wikipedia | not fetched in full (shared fetch budget exhausted in this session; see editorial notes) | example lists and general explanations | to be checked before publication |

**Questions collected (SERP titles, competitor content and related searches; the People-also-ask box itself could not be captured in this session):** What is poka-yoke? What are the types of poka-yoke? What are examples of poka-yoke? Who invented poka-yoke? What is the difference between poka-yoke and error proofing? What are the three methods of poka-yoke? Is a checklist a poka-yoke? How do you implement poka-yoke? How do you verify a poka-yoke device works?

**How this article beats the competition:** Example lists dominate the SERP, but few pages connect the examples to a selection logic (prevention before detection, control before warning), show how to verify that a device still works, or calculate whether a device pays off. This article gives the hierarchy, the three setting methods and the inspection types in one place, 20 manufacturing examples sorted by type, a five-step design process with a worksheet, a daily verification routine, a cost-benefit example, and the failure modes the Shingo Institute and AHRQ describe.

**NEURONwriter re-check (analysis of November 11, 2026; query "poka-yoke in manufacturing", id 585dbd9c4b309bdf, google.com, English):** NEURONwriter's top 13 organic results have a median of about 1,580 words and an average content score of 45; its recommended length is 1,572 words. The strongest pages by score:

| Page (NW rank) | Words (NW) | NW content score |
|---|---|---|
| tervene.com/blog/poka-yoke-manufacturing/ (outside top 13) | 2,995 | 65 |
| rzsoftware.com/blog/poka-yoke-in-manufacturing (outside top 13) | 1,674 | 63 |
| rnaautomation.com/insight/poka-yoke-in-manufacturing/ (outside top 13) | 1,798 | 62 |
| lucid.co/blog/poka-yoke-in-lean-manufacturing (9) | 1,998 | 58 |
| codya.com (poka-yoke in manufacturing: types, devices) (6) | 1,536 | 54 |
| flowdit.com/poka-yoke/ (2) | 3,332 | 53 |
| businessmap.io (what is poka-yoke) (1) | 1,246 | 51 |
| **This article** | 4,576 | **44 before -> 75 after** |

People also ask (NW): What does poka-yoke mean in Lean methodology? What are the 5 lean manufacturing tools? What is poka in manufacturing? Can you give me 3 examples of poka-yoke in everyday life? NW topics: benefits of poka-yoke in manufacturing (importance 8), how to implement poka-yoke (7), poka-yoke in lean and Six Sigma (6). The main gaps were the keyword "poka-yoke in manufacturing" (not in title or H1), the unhyphenated spelling "poka yoke" (60% of competitors), and the method names "contact method", "fixed-value method", "motion-step method". "5 lean manufacturing tools" is off-topic for this cluster and belongs to the parent pillar.

---

# Poka-Yoke in Manufacturing (Mistake Proofing): Types, Methods and 20 Examples

*Updated: November 2026 · Reading time: about 17 minutes*

> **Short answer:** Poka-yoke (Japanese for "mistake-proofing") means simple, low-cost devices or design features that stop errors from turning into defects, for example a fixture that only accepts a part in the right orientation [1]. ASQ defines mistake proofing as any automatic device or method that makes an error impossible or makes it immediately obvious once it has occurred [2]. The strongest devices stop the process (control or shutdown); weaker ones warn (light, sound) [1][2].

This deep dive belongs to our [lean manufacturing guide](https://www.m365.fm/en/learn/lean-manufacturing/), which introduces poka-yoke as one of the tools of jidoka, building quality in at the source. Here we go further: the hierarchy of mistake-proofing approaches, Shingo's three detection methods, 20 shop floor examples, a design process, how to verify devices, and when a device pays for itself.

> **Key takeaways**
> - Poka-yoke aims at 100 percent quality by catching errors at the source [1]. It is attributed to Shigeo Shingo, who formalized it as part of his work on the Toyota Production System [3].
> - Shingo reportedly renamed "fool-proofing" (*baka-yoke*) to "mistake-proofing" (*poka-yoke*) out of respect for workers: mistakes are human, defects need not follow [4].
> - Control (shutdown) devices beat warning devices; the LEI calls shutdown devices the most powerful [1][2].
> - Three classic methods: contact, fixed-value and motion-step [2].
> - Good devices are simple, durable, reliable, inexpensive and fitted to the workplace [1]. In the AHRQ's collection, the median device cost about $100 [3].
> - Every device needs a verification routine; an untested sensor is a false sense of security.
> - A detection device without root cause follow-up becomes "just a scrap sorter" [4].

## Table of contents

1. [What is poka-yoke?](#what-is-poka-yoke)
2. [Errors vs. defects: the idea behind it](#errors-vs-defects-the-idea-behind-it)
3. [Benefits of poka-yoke in manufacturing](#benefits-of-poka-yoke-in-manufacturing)
4. [The hierarchy: from error prevention to inspection](#the-hierarchy-from-error-prevention-to-inspection)
5. [Types of poka-yoke: control vs. warning](#types-of-poka-yoke-control-vs-warning)
6. [The three methods: contact, fixed-value, motion-step](#the-three-methods-contact-fixed-value-motion-step)
7. [20 poka-yoke examples from manufacturing](#20-poka-yoke-examples-from-manufacturing)
8. [How to implement poka-yoke in five steps](#how-to-implement-poka-yoke-in-five-steps)
9. [Verifying poka-yoke devices](#verifying-poka-yoke-devices)
10. [Worked example: does a missing-bolt device pay off?](#worked-example-does-a-missing-bolt-device-pay-off)
11. [Why poka-yoke fails](#why-poka-yoke-fails)
12. [FAQ](#faq-poka-yoke-and-mistake-proofing)
13. [Conclusion](#conclusion)

## What is poka-yoke?

The Lean Enterprise Institute (LEI) defines poka-yoke as Japanese for "error-proofing": simple, low-cost devices that prevent operators from making errors such as choosing the wrong part, leaving out a part or installing a part backward [1]. The goal is "100% quality by finding defects at their source," so that teams fix causes rather than pass defects on [1].

ASQ uses "mistake proofing," with poka-yoke and fail-safing as synonyms, and defines it as using any automatic device or method that either makes it impossible for an error to occur or makes the error immediately obvious once it has occurred [2]. John Grout's report for the US Agency for Healthcare Research and Quality (AHRQ) defines it as "the use of process or design features to prevent errors or the negative impact of errors" and notes that Shingo formalized mistake-proofing as part of his contribution to the production system for Toyota automobiles [3].

The terms mistake proofing, error proofing and poka-yoke (also written poka yoke) are used interchangeably in US plants. The LEI gives the literal meaning: in Japanese, "poka" means inadvertent error and "yoke" means prevention [1]. Automotive customers usually say "error proofing."

### A short history

Shigeo Shingo described the system in *Zero Quality Control: Source Inspection and the Poka-Yoke System* (English edition 1986). The publisher's description states that the book contains 112 examples of shop floor devices, most costing under $100 to implement [5]. According to a Shingo Institute article, Shingo replaced the earlier term *baka-yoke* ("fool-proofing") with *poka-yoke* because calling workers fools disrespects them; his position was that mistakes are human, but the defects they cause need not occur [4].

## Errors vs. defects: the idea behind it

The central idea is the difference between an error and a defect. An error is a human or machine slip: a part placed backward, a step skipped, a wrong setting. A defect is what reaches the next process or the customer when the error is not caught: a defective part or product. Poka-yoke accepts that errors will happen and makes sure they do not become defects [4].

This changes where quality is checked. Shingo's book title already contains the term: *source inspection*. ASQ distinguishes three inspection types [2]:

| Inspection type | Who checks, when | Catches |
|---|---|---|
| Successive inspection | the next worker checks the previous step | defects, one step late |
| Self-inspection | the worker checks their own work right away | defects, immediately |
| Source inspection | conditions are verified before the step starts | errors, before they become defects |

The classic end-of-line inspection (judgment inspection) only sorts good from bad after the value has been added. Poka-yoke moves the check to the point where the error happens or, better, before it.

## Benefits of poka-yoke in manufacturing

Why do plants invest in error proofing when they already inspect? Because inspection finds defects after the value has been added, while a poka-yoke device acts at the source. The benefits in a manufacturing process:

- **Quality at the source.** The LEI states the aim as 100 percent quality by finding defects at their source [1]; zero defects becomes a design target instead of a slogan.
- **Low cost.** Most devices are simple: in the AHRQ's collection the median device cost about $100 [3].
- **Large effects on escapes.** A single well-chosen device can remove an error mode almost completely; the TRW case in the next section is an example [3].
- **Fewer quality checks downstream.** Once an error is physically impossible, the end-of-line check for it can be reduced, after the device has been verified.
- **Less stress for operators.** People no longer have to rely on memory and attention for every repetition of a routine step, which fits the respect-for-people idea behind the term [4].

The limits are covered below: devices can fail silently, can be bypassed, and cannot remove every error [3].

## The hierarchy: from error prevention to inspection

Not every mistake-proofing approach is equally strong, and both prevention and detection have their place. ASQ's procedure first looks for ways to make the error impossible (eliminate the step, replace it with an error-proof step, or make the correct action far easier) and only then, if prevention is not possible, for ways to detect the error and minimize its effects [2]. Grout cites Tsuda's four approaches in the same spirit: mistake prevention in the work environment, mistake detection, mistake prevention, and preventing the influence of mistakes [3].

| Level | Approach | Example | Strength |
|---|---|---|---|
| 1 | Eliminate the step (design) | a one-piece molded bracket replaces two parts and a screw | strongest: error impossible |
| 2 | Prevent by design (geometry) | asymmetric connector fits only one way | very strong, no sensor needed |
| 3 | Prevent by control (shutdown) | press will not cycle unless sensor confirms part is seated | strong, needs verification |
| 4 | Detect and stop | torque controller blocks transfer if bolt count is short | strong if the stop cannot be bypassed |
| 5 | Detect and warn | light and buzzer when a pick bin was skipped | medium: depends on response |
| 6 | Make errors visible | color-coded hoses, shadow boards, outlines | weak alone, useful support |
| 7 | Inspect afterward | final visual check, checklist | weakest: sorts, does not prevent |

The rule of thumb: go as high on the list as cost and technology allow. The payoff can be large: the AHRQ report cites TRW cutting defects from 288 to 2 parts per million with mistake-proofing [3]. Design changes (levels 1 and 2) belong in product development; that is why many companies include mistake-proofing in design reviews and process FMEAs [unverified: common practice, not a sourced requirement].

## Types of poka-yoke: control vs. warning

The LEI distinguishes two types [1]:

- **Shutdown (control) poka-yoke** stops the process. Example: a machine will not start if the workpiece is loaded incorrectly. The LEI calls these "the most powerful error-proofing devices" [1].
- **Warning poka-yoke** gives the operator an alert with a buzzer or a light [1].

ASQ uses the same split under the term "regulatory functions": warning functions use bells, buzzers, lights and other sensory signals; control functions prevent the process from proceeding until the error is corrected or, for source inspection, until the conditions are right [2].

| | Control (shutdown) | Warning |
|---|---|---|
| What happens | process stops or cannot start | signal; process can continue |
| Depends on operator response | no | yes |
| Best for | high-severity errors, high volume | low severity, or where stopping is unsafe or impossible |
| Risk | nuisance stops lead to bypassing | alarm fatigue; signal ignored |
| Example | nut runner controller locks fixture until 6 of 6 bolts are torqued | pick-to-light flashes red when the wrong bin is entered |

A warning device is only as good as the response behind it. If the buzzer sounds 40 times a shift for false alarms, operators will stop hearing it. That links poka-yoke to [andon](https://www.m365.fm/en/learn/shop-floor-management/andon/) (planned): a warning should trigger a defined response, not just noise.

## The three methods: contact, fixed-value, motion-step

ASQ calls these "setting functions": the ways a device checks a parameter or attribute [2]. The three are commonly attributed to Shingo [unverified against Shingo's own books in this session].

| Method | What it checks | Typical devices | Example |
|---|---|---|---|
| Contact (physical) | physical characteristics, often by physical contact: shape, size, position, diameter, temperature | guide pins, limit switches, proximity sensors, go/no-go gauges built into fixtures | fixture pin enters a hole only present on the correct variant |
| Fixed-value (counting) | the number of items or actions, or a weight | counters, scales, kitted trays with one pocket per part | torque tool counts fastenings; tray with 8 pockets must be empty |
| Motion-step (sequence) | that steps occur in the right order | sequence logic in PLC, pick-to-light, barcode scan before next step | label printer releases only after the test station records "pass" |

In short: the contact method checks the part, the fixed-value method checks the count, and the motion-step method checks that steps happen in the correct order.

ASQ adds information enhancement as a possible fourth type: making sure needed information is available and visible where and when it is needed [2]. Digital work instructions that show the right variant are an example; the [paperless manufacturing guide](https://www.m365.fm/en/learn/shop-floor-management/paperless-manufacturing/) (planned) covers them.

## 20 poka-yoke examples from manufacturing

The examples below are typical shop floor devices, grouped by method and type. Examples 1, 6 and 15 follow the LEI's descriptions [1]; the others are common practice and illustrative.

| # | Error prevented | Device | Method | Type |
|---|---|---|---|---|
| 1 | part loaded in wrong orientation | asymmetric part feature or fixture that accepts only one orientation [1] | contact | control (design) |
| 2 | wrong variant loaded | locating pin that fits a hole only the correct variant has | contact | control |
| 3 | part not fully seated | proximity sensor; press will not cycle unless seated | contact | control |
| 4 | oversize or undersize part enters assembly | built-in go/no-go slot on the conveyor | contact | control |
| 5 | connector plugged into wrong port | keyed connectors that fit one way only | contact | control (design) |
| 6 | part skipped in a kit | photocell above each bin; process stops until each beam was broken [1] | fixed-value / motion-step | control |
| 7 | missing fastener | torque controller counts tightenings and locks the fixture | fixed-value | control |
| 8 | missing small part in a box | check weigher rejects boxes outside the weight window | fixed-value | control |
| 9 | wrong number of parts picked | kit tray with exactly one pocket per part | fixed-value | warning (visual) |
| 10 | step skipped in sequence | PLC sequence interlock: step 4 tool enabled only after step 3 confirmed | motion-step | control |
| 11 | wrong label on product | scanner compares product barcode with label before release | motion-step | control |
| 12 | untested unit shipped | pack station accepts only serials with a "pass" record | motion-step | control |
| 13 | wrong program loaded on CNC | program called by scanning the part number on the traveler | motion-step | control |
| 14 | wrong hose connected | color-coded and differently sized couplings | contact | control (design) |
| 15 | wrong part combination for the variant | system checks the scanned parts against the build order [1] | motion-step | control |
| 16 | tool left in assembly | shadow board with sensor; line does not index until all tools are back | fixed-value | control |
| 17 | expired material used | scan at point of use rejects lots past their shelf life | contact (information) | control |
| 18 | wrong torque setting | tool receives program from the station controller; manual setting disabled | information enhancement | control |
| 19 | wrong drawing revision used | work instruction shown on screen from the order, paper copies removed | information enhancement | warning |
| 20 | part missing in final check | vision system compares image with a reference | contact | control |

The LEI also lists everyday examples that make the idea easy to teach: washing machines that do not start with the door open, lawn mowers that run only while the safety bar is held, and table saws that stop automatically [1].

**A word on safety devices.** Interlocks and light curtains that protect people from machine hazards are safety-related controls with their own design rules and regulations (OSHA's general machine guarding requirement, 29 CFR 1910.212(a)(1): "One or more methods of machine guarding shall be provided" [6]). Do not repurpose a safety device as a quality poka-yoke, and do not let a quality device weaken a safety function. Involve EHS when a device stops machine motion [unverified: safety-function design standards not checked in this session].

## How to implement poka-yoke in five steps

The steps follow ASQ's procedure [2], extended with selection and verification.

1. **Map the process and find the likely error points.** Use the flowchart, defect data, the PFMEA and the operators' knowledge. Prioritize by severity and frequency.
2. **Trace each error to its source.** What exactly goes wrong, and what condition allows it?
3. **Look for ways to prevent mistakes first.** Can the step be eliminated, replaced with an error-proof step, or made so that the correct action is the easiest one [2]?
4. **If prevention is not possible, detect and limit the effect.** Choose a setting function (contact, fixed-value, motion-step) and a regulatory function (control or warning) [2].
5. **Choose, test, implement, verify.** Build a cheap prototype, try it with operators on all shifts, add it to standard work and the control plan, and set up a verification routine [2].

**Template: poka-yoke worksheet**

| Field | Example |
|---|---|
| Process / station | housing assembly, station 3 |
| Error | one of six M8 bolts not tightened |
| Effect if not caught | loose cover, oil leak at customer; severity 8 (PFMEA) |
| Current detection | visual check at end of line |
| Source of the error | operator interrupted, loses count; no feedback from tool |
| Prevention option? | redesign with fewer bolts: rejected by design (sealing) |
| Setting function | fixed-value (count 6 tightenings with torque OK) |
| Regulatory function | control: fixture clamp does not release until 6 of 6 OK |
| Cost estimate | $6,000 (see worked example) |
| Verification method | daily start-of-shift test with 5 bolts; result in checklist |
| Owner / due date | manufacturing engineer, 4 weeks |
| Standard work updated? | yes, step 3.4 and reaction plan |

Involve the operators who will use the device from step 1. The Shingo Institute article names exclusion of users from the design as one of the reasons devices are rejected [4].

## Verifying poka-yoke devices

A poka-yoke that has silently failed is worse than none: everyone believes the error is impossible, so nobody looks. Verification is therefore part of the device, not an extra.

**Daily verification routine** (common practice; IATF 16949 clause 10.2.4 requires testing of error-proofing devices for failure or simulated failure, with the test frequency documented in the control plan [7])

| Step | What to do | Who | When |
|---|---|---|---|
| 1 | test the device with a known bad part or condition (a marked "challenge part," often painted red and called a "red rabbit" on many floors) | operator or team lead | start of each shift, after maintenance, after changeovers |
| 2 | confirm the device reacts (stop or signal) | operator | same |
| 3 | record the result on the verification sheet or in the MES | operator | same |
| 4 | if the device fails: stop, quarantine production since last good check, call quality | team lead | immediately |
| 5 | review verification records and bypass events | supervisor, quality | weekly |
| 6 | control challenge parts: numbered, stored, replaced when worn | quality | monthly |

**Bypass control.** Many devices can be switched off for maintenance or troubleshooting. Use a key or password, log every bypass with time and reason, and treat production during a bypass as suspect until checked. An unlogged bypass switch on a device is a common audit finding [unverified: practitioner observation].

## Worked example: does a missing-bolt device pay off?

The numbers are illustrative.

**Situation.** A line builds 1,200 housings per day on 250 days a year: 300,000 housings per year. Each has six bolts. Missing or untightened bolts occur in 150 of every million housings (150 ppm). The end-of-line visual check catches about 80 percent.

**Without poka-yoke:**

| Item | Calculation | Result |
|---|---|---|
| Housings with a missing bolt per year | 300,000 × 150 / 1,000,000 | 45 |
| Caught in plant (80%) | 45 × 0.8 | 36 |
| Escaped to customer (20%) | 45 × 0.2 | 9 |
| Internal rework cost | 36 × $60 | $2,160 |
| Field / warranty cost (oil leak, replacement, handling) | 9 × $2,500 | $22,500 |
| **Annual cost of the error** | | **$24,660** |

**Poka-yoke:** a counting function on the existing torque controller plus a fixture interlock (fixed-value, control).

| Item | Calculation | Result |
|---|---|---|
| Controller option, clamp interlock, wiring | quote | $4,500 |
| Engineering and PLC integration | 16 h × $95 | $1,520 |
| **Investment** | | **$6,020** |
| Daily verification time | 2 min × 3 shifts × 250 days = 1,500 min = 25 h × $45 | $1,125 per year |
| **Net annual benefit** | $24,660 − $1,125 | **$23,535** |
| **Simple payback** | $6,020 / $23,535 × 12 months | **about 3 months** |

Two cautions from a controller's view. First, warranty cost per escape is uncertain; use your own warranty data, and include customer chargebacks if your contracts have them. Second, the customer-side cost of an escape (a line stop at an OEM, a recall) can dwarf all of the above; for severity 9 or 10 failure modes, do not wait for a payback calculation.

## Why poka-yoke fails

The Shingo Institute article by Bruce Hamilton lists reasons teams reject or lose poka-yoke devices [4]. In short, with our fixes:

| Failure reason [4] | Fix |
|---|---|
| the added step is not in standard work, so operators trade speed for quality | add the device and its reaction to [standard work](https://www.m365.fm/en/learn/shop-floor-management/standard-work/) (planned) and to the cycle time |
| undocumented, untrained methods are not real standards | train every shift; document the reaction plan |
| devices that strain workers do not last | check reach, force and posture before rollout |
| detection without root cause follow-up becomes "just a scrap sorter" | log every catch; run 5 Whys, a [PDCA](https://www.m365.fm/en/learn/lean-manufacturing/pdca-cycle/) or [A3](https://www.m365.fm/en/learn/lean-manufacturing/a3-problem-solving/) on frequent catches |
| devices that do not work need further PDCA cycles | prototype, test, adjust before calling it done |
| the term is misused for any fixture or tooling | reserve "poka-yoke" for devices aimed at human error |
| users excluded from design | operators co-design and test the prototype |

Two more points from the AHRQ report: mistake-proofing is not a panacea and cannot eliminate all errors and failures from a process [3]. And a blame culture defeats the tool before it starts: the Shingo Institute article notes that organizations that punish or ridicule mistakes discourage reporting, so the errors that need devices are never found [4].

**Respect for people.** Poka-yoke is one of the clearest expressions of respect in lean: it assumes the operator is capable and that errors come from the process design, not from carelessness. Words matter here too. "Idiot-proofing" still circulates on some shop floors; Shingo dropped "fool-proofing" for that reason [4].

### Digital poka-yoke

Many modern devices are software: barcode verification before the next step, MES workflow interlocks that block a station when a previous step is missing, torque data tied to a serial number, pick-to-light systems driven by the order. These are motion-step and information-enhancement methods in a new form. They raise two new questions: who owns the logic when the software changes, and what happens when the network or MES is down. Plan a fallback (manual verification with sign-off) and include the interlocks in change management: version the PLC or MES logic, test changes with challenge parts before release, and restrict who can edit or disable them. That last point is also an OT security question, covered in the planned [OT cybersecurity guide](https://www.m365.fm/en/learn/ot-cybersecurity-iec-62443/). The planned [MES and ISA-95 guide](https://www.m365.fm/en/learn/mes-isa-95/) covers the system side.

### Poka-yoke in lean manufacturing and Six Sigma

Poka-yoke is part of jidoka, the lean principle to build quality into the process; it pairs with andon, which makes abnormalities visible and triggers a response. In a [Six Sigma](https://www.m365.fm/en/learn/six-sigma-root-cause-analysis/) (planned) project, poka-yoke is a typical Control-phase measure. In a [kaizen event](https://www.m365.fm/en/learn/lean-manufacturing/kaizen/), error-proofing is one of the classic event types. And in a PFMEA, a well-verified control-type device is the strongest detection or prevention control you can list.

## FAQ: poka-yoke and mistake proofing

### What is poka-yoke in simple terms?

A device or design feature that makes it impossible, or at least obvious, to do a step wrong, such as a plug that fits only one way. The LEI describes it as simple, low-cost error-proofing that aims at 100 percent quality [1].

### Who invented poka-yoke?

Shigeo Shingo formalized it as part of his work on the Toyota Production System [3] and described it in *Zero Quality Control* (English edition 1986) [5].

### What are the two types of poka-yoke?

Control (shutdown) devices, which stop the process, and warning devices, which signal with light or sound [1][2]. Control devices are stronger [1].

### What are the three methods of poka-yoke?

Contact (checks physical characteristics), fixed-value (checks counts or weights) and motion-step (checks the sequence of steps) [2]. ASQ mentions information enhancement as a possible fourth [2].

### What are examples of poka-yoke?

Asymmetric parts that fit only one way, photocells over parts bins, torque tools that count fastenings, check weighers, barcode verification before labeling, and everyday examples such as washing machines that will not start with the door open [1]. See the table of 20 examples above.

### Is a checklist a poka-yoke?

Not in the strict sense. A checklist relies on attention and catches nothing automatically; it is an inspection aid at the bottom of the hierarchy. It can be a useful interim measure until a device is in place.

### What is the difference between poka-yoke and error proofing?

None in practice. Poka-yoke is the Japanese term; error proofing and mistake proofing are the English equivalents [1][2].

### How much does a poka-yoke cost?

Often very little. Shingo's book describes devices mostly costing under $100 [5], and in the AHRQ's collection the median device cost about $100, with 90 percent at $1,000 or less [3]. Sensor- and software-based devices cost more; the worked example above costs about $6,000 and pays back in about three months.

### How do you verify a poka-yoke works?

Test it at the start of every shift, after maintenance and after changeovers with a known bad part or condition, record the result, and react immediately if it fails. Log and review every bypass.

### What does poka-yoke mean in lean?

In Japanese, "poka" means inadvertent error and "yoke" means prevention [1]. In lean manufacturing, poka-yoke is one of the tools of jidoka: it builds quality into the process so that an inadvertent error is stopped before it becomes a defective product.

### What are 3 examples of poka-yoke in everyday life?

The LEI lists several: washing machines that will not start until the door is closed, lawn mowers that run only while the safety bar is held down, and the auto-stop function on a table saw; it also names blind spot warnings and spell-check [1].

### Can poka-yoke eliminate all defects?

No. The AHRQ report states plainly that mistake-proofing is not a panacea and cannot eliminate all errors and failures from a process [3]. It removes specific, known error modes. Defects from variation, design or materials need other tools, such as SPC or a Six Sigma project.

### Can poka-yoke be used outside manufacturing?

Yes. Grout's mistake-proofing report was written for health care [3], and the everyday examples above come from cars, household appliances and software [1]. The logic is the same wherever a routine step can go wrong.

## Conclusion

Poka-yoke starts from a respectful assumption: people make mistakes, and the process should keep those mistakes from becoming defects. The strongest solutions remove the chance of error through design; the next best stop the process; warnings and checklists come last. The three setting methods (contact, fixed-value, motion-step) give engineers a simple vocabulary for designing devices, and ASQ's five-step procedure gives them an order of work. Two habits decide whether the devices keep working: daily verification with a known bad part, and root cause follow-up on every catch.

**Your next steps**

- [ ] List your top five escapes or internal defects by severity and frequency
- [ ] For each, ask: can we eliminate the step, prevent by design, or stop the process?
- [ ] Fill in the poka-yoke worksheet with the operators who do the work
- [ ] Build a cheap prototype and test it on all shifts
- [ ] Add the device and its reaction plan to standard work
- [ ] Start a daily verification routine with marked challenge parts

---

## Further reading on m365.fm

**Parent guide**
- [Lean Manufacturing: Principles, Tools, Implementation, and Limits](https://www.m365.fm/en/learn/lean-manufacturing/) (planned)

**Sibling deep dives**
- [Kaizen and Kaizen Events](https://www.m365.fm/en/learn/lean-manufacturing/kaizen/) (planned)
- [PDCA Cycle](https://www.m365.fm/en/learn/lean-manufacturing/pdca-cycle/) (planned)
- [A3 Problem Solving](https://www.m365.fm/en/learn/lean-manufacturing/a3-problem-solving/) (planned)

**Related guides**
- [Six Sigma and Root Cause Analysis](https://www.m365.fm/en/learn/six-sigma-root-cause-analysis/) (planned)
- [Standard Work](https://www.m365.fm/en/learn/shop-floor-management/standard-work/) (planned)
- [Andon Systems](https://www.m365.fm/en/learn/shop-floor-management/andon/) (planned)
- [Paperless Manufacturing](https://www.m365.fm/en/learn/shop-floor-management/paperless-manufacturing/) (planned)
- [MES and ISA-95](https://www.m365.fm/en/learn/mes-isa-95/) (planned)
- [OT Cybersecurity and ISA/IEC 62443](https://www.m365.fm/en/learn/ot-cybersecurity-iec-62443/) (planned)
- [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/) (planned)
- [Operational Excellence](https://www.m365.fm/en/learn/operational-excellence/) (planned)

**Glossary terms (entities)**
[Poka-yoke](https://www.m365.fm/entity/poka-yoke/) · [Lean management](https://www.m365.fm/entity/lean-management/) · [Standard work](https://www.m365.fm/entity/standard-work/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** is the host of m365.fm and works at iFAKT GmbH. On m365.fm he writes about lean manufacturing, operational excellence and the digital transformation of production. [Editor: add role, short bio and photo.]

**Note: The author works at iFAKT GmbH.**

# Sources

All sources accessed November 20, 2026.

1. Poka-Yoke. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/poka-yoke/
2. Mistake Proofing. American Society for Quality (ASQ). https://asq.org/quality-resources/mistake-proofing
3. Grout, J.: Mistake-Proofing the Design of Health Care Processes. AHRQ Publication No. 07-0020, Agency for Healthcare Research and Quality, May 2007. Full text via govinfo.gov: https://www.govinfo.gov/content/pkg/GOVPUB-HE20_6500-PURL-gpo3107/pdf/GOVPUB-HE20_6500-PURL-gpo3107.pdf (summary: https://psnet.ahrq.gov/issue/mistake-proofing-design-health-care-processes)
4. Hamilton, B.: Mistake-Proofing Mistakes (February 4, 2020). Shingo Institute blog. https://shingo.org/mistake-proofing-mistakes/
5. Shingo, S.: Zero Quality Control: Source Inspection and the Poka-Yoke System. Productivity Press, 1986; publisher page (Routledge). https://www.routledge.com/Zero-Quality-Control-Source-Inspection-and-the-Poka-yoke-System/Shingo/p/book/9780915299072
6. 29 CFR 1910.212, General requirements for all machines, paragraph (a)(1). OSHA. https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.212 (accessed November 20, 2026)
7. How to establish an error-proofing process according to IATF 16949 (clause 10.2.4; secondary source, the standard is paywalled). Advisera 16949 Academy. https://advisera.com/16949academy/wp-json/wp/v2/posts/10367 (accessed November 20, 2026)

# Editorial notes

**URL scheme:** nested cluster URL per the course-expansion brief; an assumption about the final CMS structure.

**Unverified items (marked in text):** mistake-proofing in design reviews/PFMEA as common practice; safety-function design standards (not checked); the OSHA guarding reference (1910.212(a)(1)) and IATF 16949 clause 10.2.4 were closed in the verification pass of November 20, 2026 via [6] and [7]; unlogged bypass switches as a common audit finding.

**Consistency with the parent pillar:** The pillar attributes the three detection methods to Shingo via Wikipedia [pillar 50]. This cluster cites ASQ [2] for the same three methods, a better source; recommend replacing the pillar citation in the final consistency check. The pillar's examples (orientation, photocells, part combination, everyday examples) match [1] and are reused with attribution.

**Worked example:** illustrative, recalculated: 1,200 × 250 = 300,000; × 150 ppm = 45; 36 / 9; 36 × 60 = 2,160; 9 × 2,500 = 22,500; total 24,660; 16 × 95 = 1,520; 4,500 + 1,520 = 6,020; 2 × 3 × 250 = 1,500 min = 25 h × 45 = 1,125; 24,660 − 1,125 = 23,535; 6,020 / 23,535 × 12 = 3.07 months.

**Competitive analysis gap:** Tulip, MRPeasy, KaiNexus and Wikipedia could not be fetched in this session (shared fetch budget). Add word counts before publication.

**Vendor claims:** none. **iFAKT:** not mentioned in the body; disclosure in author box only.

**Internal links (body):** parent pillar (first 150 words), siblings kaizen, PDCA, A3; clusters standard work, andon, paperless manufacturing; pillars MES/ISA-95 (new), Six Sigma (new), OT cybersecurity (new).

**Cannibalization:** The parent pillar has an H3 "Poka-yoke: prevent defects instead of inspecting" (about 300 words). This cluster owns "poka-yoke examples", "mistake proofing", "types of poka-yoke". The m365.fm entity page `/entity/poka-yoke/` should link here.

**Schema markup suggestion (JSON-LD)**

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TechArticle",
      "headline": "Poka-Yoke (Mistake Proofing): Types, Methods and 20 Examples from the Shop Floor",
      "inLanguage": "en-US",
      "author": {"@type": "Person", "name": "Mirko Peters", "url": "https://www.m365.fm/entity/mirko-peters/"},
      "publisher": {"@type": "Organization", "name": "m365.fm", "url": "https://www.m365.fm/"},
      "datePublished": "2026-11-20",
      "dateModified": "2026-11-20",
      "mainEntityOfPage": "https://www.m365.fm/en/learn/lean-manufacturing/poka-yoke/",
      "isPartOf": {"@type": "WebPage", "url": "https://www.m365.fm/en/learn/lean-manufacturing/"},
      "about": {"@type": "Thing", "name": "Poka-yoke", "sameAs": "https://www.m365.fm/entity/poka-yoke/"}
    },
    {
      "@type": "FAQPage",
      "inLanguage": "en-US",
      "mainEntity": [
        {"@type": "Question", "name": "What are the three methods of poka-yoke?", "acceptedAnswer": {"@type": "Answer", "text": "Contact (checks physical characteristics), fixed-value (checks counts or weights) and motion-step (checks the sequence of steps)."}},
        {"@type": "Question", "name": "What does poka-yoke mean in lean?", "acceptedAnswer": {"@type": "Answer", "text": "In Japanese, poka means inadvertent error and yoke means prevention. In lean manufacturing, poka-yoke is a jidoka tool that stops an error before it becomes a defective product."}},
        {"@type": "Question", "name": "What are 3 examples of poka-yoke in everyday life?", "acceptedAnswer": {"@type": "Answer", "text": "Washing machines that will not start until the door is closed, lawn mowers that run only while the safety bar is held down, and the auto-stop function on a table saw."}},
        {"@type": "Question", "name": "Can poka-yoke eliminate all defects?", "acceptedAnswer": {"@type": "Answer", "text": "No. Mistake-proofing removes specific, known error modes but cannot eliminate all errors and failures from a process."}},
        {"@type": "Question", "name": "Can poka-yoke be used outside manufacturing?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. It is used in health care, cars, household appliances and software, wherever a routine step can go wrong."}}
      ]
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.m365.fm/"},
        {"@type": "ListItem", "position": 2, "name": "Learn", "item": "https://www.m365.fm/en/learn/"},
        {"@type": "ListItem", "position": 3, "name": "Lean Manufacturing", "item": "https://www.m365.fm/en/learn/lean-manufacturing/"},
        {"@type": "ListItem", "position": 4, "name": "Poka-Yoke", "item": "https://www.m365.fm/en/learn/lean-manufacturing/poka-yoke/"}
      ]
    }
  ]
}
```

**Recommended graphics**

1. Mistake-proofing hierarchy as a pyramid (eliminate → inspect).
2. Control vs. warning device comparison with icons.
3. Photos or drawings of five example devices (keyed connector, locating pin, photocell bin, counting torque tool, check weigher).
4. Verification sheet template as a downloadable PDF.

## Review log

Expert-panel review per the course-expansion brief, November 20, 2026: nine roles, three full rounds (Mirko's update: at least three rounds for clusters). Roles: practitioner (US plant manager), academic (IE / operations management professor), IT/OT architect, quality lead (ASQ CQE / Black Belt, IATF 16949 / AS9100), finance (plant controller), worker voice and lean coach, SEO specialist (US), fact checker, critic. Starting point: first full draft (4,003 words H1 to Conclusion).

### Round 1: findings and verdicts

- **Practitioner (changes needed):** Verification routine is the most useful part. Use the shop floor term "red rabbit" for challenge parts; it is what people will search for and say.
- **Academic (satisfied with a remark):** Hierarchy and the mapping to Tsuda's four approaches are sound. The strength of the hierarchy argument would gain from one documented result.
- **IT/OT architect (changes needed):** Digital poka-yoke section needs more than a fallback: versioning and testing of PLC/MES interlock logic, and restricted edit rights. Unauthorized disabling of interlocks is also an OT security issue; link the planned OT cybersecurity pillar.
- **Quality lead (changes needed):** Devices belong in the control plan, not only in standard work. The IATF 16949 verification point is correctly marked unverified.
- **Finance (satisfied):** Cost of the error, investment, verification time and payback are separated correctly; the "do not wait for payback on severity 9-10" caution is right.
- **Worker voice and lean coach (satisfied):** The baka-yoke story and "idiot-proofing" remark set the right tone; verification time is treated as paid work.
- **SEO specialist (changes needed):** Autodesk ranks with "20 poka-yoke examples" but is not in the competitor table; it should be fetched and counted. Meta description length stated as 148, actual 149.
- **Fact checker (changes needed):** Re-verified online: LEI definition, "100% quality by finding defects at their source", shutdown vs. warning, examples, four characteristics [1]; ASQ definition, procedure, setting functions incl. information enhancement, warning and control functions, three inspection types [2]; Grout/AHRQ definition, Shingo formalized mistake-proofing for Toyota, Tsuda's four approaches, median cost about $100, 90 percent at $1,000 or less, TRW 288 -> 2 ppm, "not a panacea" [3]; Shingo Institute article: author, date, baka-yoke, seven failure reasons, "just a scrap sorter" [4]; *Zero Quality Control* 1986, 112 examples, most under $100 [5]. Error: Shingo's life dates (1909-1990) appear without a source in this article.
- **Critic (satisfied with a remark):** "Poka-yoke is one of the clearest expressions of respect in lean" is opinion but clearly framed as such; acceptable.

**Debate:**

- *Safety devices:* the practitioner wanted light curtains in the example list as quality devices; the worker voice and IT/OT architect objected because guarding devices follow safety rules. Resolution: keep the LEI's photocell-over-bins example (a quality device) and add the separate "word on safety devices" paragraph, marked unverified for the specific OSHA standard.
- *Checklists:* the quality lead wanted checklists excluded entirely; the practitioner argued they are a legitimate interim step. Resolution: the FAQ says a checklist is not a poka-yoke in the strict sense but a useful interim measure.

### Optimization 1: what changed (old -> new)

- "Shigeo Shingo (1909-1990) described the system" -> "Shigeo Shingo described the system".
- Added after the hierarchy rule of thumb: "the AHRQ report cites TRW cutting defects from 288 to 2 parts per million with mistake-proofing [3]".
- Verification step 1: "(a marked "challenge part," often painted red)" -> "(... often painted red and called a "red rabbit" on many floors)".
- Design step 5: "add it to standard work and set up a verification routine" -> "add it to standard work and the control plan, and set up a verification routine".
- Digital poka-yoke: "include the interlocks in change management." -> "... change management: version the PLC or MES logic, test changes with challenge parts before release, and restrict who can edit or disable them. That last point is also an OT security question ..." with a link to the planned OT cybersecurity pillar.
- Competitive analysis: added Autodesk (approx. 1,300 words; title promises 20 examples, page lists 15).
- Metadata: description "(148 characters)" -> "(149 characters)".

### Round 2: verdicts with spot fact check of the changes

- **Practitioner, IT/OT architect, quality lead, finance, worker voice, SEO specialist, critic (satisfied).** SEO notes the "20 examples" table now clearly beats the Autodesk page, which lists 15.
- **Academic (changes needed):** The H2 "Shingo's three methods" attributes the methods to Shingo, but the cited source [2] (ASQ) does not; the pillar's attribution rests on Wikipedia.
- **Fact checker (changes needed):** Same point; either verify against Shingo's book or soften. The book text was not accessible in this session.

**Debate:** SEO wanted to keep "Shingo" in the H2 for search; the fact checker and academic insisted on accuracy. Resolution: neutral H2, attribution stated in the text as "commonly attributed to Shingo [unverified]", meta description changed accordingly.

### Optimization 2: what changed (old -> new)

- H2 "Shingo's three methods: contact, fixed-value, motion-step" -> "The three methods: contact, fixed-value, motion-step"; TOC anchor updated; added "The three are commonly attributed to Shingo [unverified against Shingo's own books in this session]."
- Meta description "Shingo's three methods" -> "the 3 setting methods" (148 characters).
- Conclusion "Shingo's three methods (contact, fixed-value, motion-step)" -> "The three setting methods (contact, fixed-value, motion-step)".
- Further reading: added the planned OT cybersecurity pillar.

### Round 3: final verdicts

- **Critic (changes needed, then satisfied):** the competitive analysis still claimed "Shingo's three methods and the inspection types in one place"; changed to "the three setting methods ...".
- **Fact checker:** satisfied; 5 sources, all cited, every citation number exists. Remaining [unverified]: Shingo attribution of the three methods, OSHA guarding / safety-function standards, IATF 16949 verification clause, design-review practice, bypass audit finding.
- **Practitioner, academic, IT/OT architect, quality lead, finance, worker voice, SEO specialist:** satisfied.

**Optimization 3 (old -> new):** competitive analysis "Shingo's three methods and the inspection types in one place" -> "the three setting methods and the inspection types in one place".

**Consensus:** All nine roles release the article. Before publication: check the IATF 16949 error-proofing clause and the OSHA machine guarding reference, verify the Shingo attribution in *Zero Quality Control*, and count the remaining competitor pages (Tulip, MRPeasy, KaiNexus, Wikipedia). Also align the parent pillar's detection-method citation to ASQ.

**Word count:** `wc -w` on H1 through the end of "Conclusion" (incl. tables and FAQ, excluding Further reading, author box, sources, notes): 4,089 words.

### Round 4: verification pass, November 20, 2026

- Safety devices paragraph: "(OSHA machine guarding requirements) ... [unverified: specific OSHA standard and safety-function standards not checked]" -> names 29 CFR 1910.212(a)(1) with its wording, verified on osha.gov; new source [6]. Safety-function design standards (e.g. for interlocks and light curtains): still unverified (not reached).
- Daily verification routine: "[unverified: ... IATF 16949 also contains error-proofing verification requirements, not checked]" -> IATF 16949 clause 10.2.4 (testing of error-proofing devices for failure or simulated failure, test frequency in the control plan), verified via Advisera's summary of the clause [7] (secondary; standard paywalled).
- Three methods "commonly attributed to Shingo": still unverified (Shingo's book [5] not opened; publisher page only).
- Mistake-proofing in design reviews/PFMEA and unlogged bypass switches as an audit finding: still unverified (common practice by design).
- Competitor word counts (Tulip, MRPeasy, KaiNexus, Wikipedia): still open (low priority; not reached).
- No sister-pillar sources in this file.
- Word count: 4,089 -> 4,108 (`wc -w`, H1 to Conclusion).

Sign-off:
- **Fact checker:** satisfied; 7 sources, all cited; remaining [unverified] items are labeled and listed in the editorial notes.
- **Critic:** satisfied; the added clause details are short and useful, no fluff.
- **Subject expert (quality lead, IATF context):** satisfied; 10.2.4 is the clause auditors check for device verification; confirm the wording against a licensed copy before quoting it.

### Round 5: SERP re-check and optimization, November 20, 2026

**Data source:** NEURONwriter query 585dbd9c4b309bdf ("poka-yoke in manufacturing", google.com, analysis of November 11, 2026; no new analysis created). Content scored with evaluate-content using the article part (H1 to Further reading) and the meta title and description. Source [1] (LEI lexicon) re-opened on November 23, 2026 for the literal meaning and the everyday examples.

**Score:** 44 -> 75 (NW top-13 average 45, best analyzed competitor 65).

**Findings:** The article was the most complete page but scored at the competitor average because the main keyword "poka-yoke in manufacturing" was missing from title, H1 and headings, the spelling "poka yoke" never appeared, the method names were not used as phrases, and benefits, implementation and the lean meaning were not addressed as headings. Missing terms included alert, defective, prevent mistakes, manufacturing process, poka-yoke device, implement poka-yoke, 5 Whys, zero defects, prevention and detection, physical contact.

**Changes (old -> new):**
1. H1 "Poka-Yoke (Mistake Proofing): Types, Methods and 20 Examples from the Shop Floor" -> "Poka-Yoke in Manufacturing (Mistake Proofing): Types, Methods and 20 Examples".
2. New H2 "Benefits of poka-yoke in manufacturing" (about 170 words, five bullets): facts only from [1], [3], [4]; the TRW figure is referenced, not repeated.
3. H2 "The hierarchy: from elimination to inspection" -> "The hierarchy: from error prevention to inspection"; H2 "How to design a poka-yoke in five steps" -> "How to implement poka-yoke in five steps"; H3 "Poka-yoke and the bigger quality system" -> "Poka-yoke in lean manufacturing and Six Sigma" (TOC updated and renumbered).
4. "What is poka-yoke?": added the spelling "poka yoke" and the LEI's literal meaning ("poka" = inadvertent error, "yoke" = prevention [1], re-verified November 23, 2026).
5. Small term edits: "A defect is what reaches ... not caught." -> "... not caught: a defective part or product."; "alerts the operator" -> "gives the operator an alert"; contact method row "physical characteristics" -> "physical characteristics, often by physical contact"; new sentence "In short: the contact method checks the part, the fixed-value method checks the count, and the motion-step method checks that steps happen in the correct order."; step 3 "Look for prevention first." -> "Look for ways to prevent mistakes first."; hierarchy intro adds "and both prevention and detection have their place"; failure table "run a PDCA or A3" -> "run 5 Whys, a PDCA or A3"; digital section "MES interlocks" -> "MES workflow interlocks"; jidoka "building quality into the process" -> "the lean principle to build quality into the process".
6. Four new FAQs: "What does poka-yoke mean in lean?" [1], "What are 3 examples of poka-yoke in everyday life?" [1], "Can poka-yoke eliminate all defects?" [3], "Can poka-yoke be used outside manufacturing?" [1][3]. JSON-LD FAQPage extended.
7. Meta title "Poka-Yoke (Mistake Proofing): Types, Examples, Steps" -> "Poka-Yoke in Manufacturing: Types, Examples, Steps" (50 characters); meta description now "Poka-yoke (poka yoke) in manufacturing: control vs. warning devices, 3 methods, 20 examples, how to implement it to prevent errors, and a cost example." (151 characters).
8. Word count: 4,108 -> 4,576 (`wc -w`, H1 to Conclusion incl. FAQ).

Not adopted: "developed in the 1960s by Shigeo Shingo" and "Japanese industrial engineer" (frequent competitor phrases, but no source opened in this session confirms the decade; the LEI page does not mention Shingo); "5 lean manufacturing tools" (parent pillar topic).

Sign-off:
- **SEO specialist (US):** satisfied; the main keyword is now in title, H1 and two H2s; score 75 is ten points above the best competitor.
- **Critic:** satisfied; the benefits section avoids repeating the TRW figure, the new FAQs are short; no stuffing of the unhyphenated spelling (used once in body, once in the description).
- **Fact checker:** satisfied; literal meaning and everyday examples re-checked on the live LEI page (the page now also lists blind spot warnings, spell-check and auto-brake, so the FAQ wording "lists several" is accurate); AHRQ "not a panacea" statement was verified in Round 1.
- **Subject expert (quality lead):** satisfied; "Can poka-yoke eliminate all defects?" correctly points variation problems to SPC and Six Sigma.
