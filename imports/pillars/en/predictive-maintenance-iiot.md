# SEO metadata

| Field | Value |
|---|---|
| Meta title | Predictive Maintenance & IIoT: Techniques, ROI, Roadmap (55 characters; alternative: "Predictive Maintenance with IIoT: A Practical Guide", 51 characters) |
| Meta description | Predictive maintenance and IIoT explained: P-F curve, vibration, oil, thermography, sensor-to-CMMS architecture, ML and RUL, a worked ROI and KPIs. (147 characters) |
| Slug | `/en/learn/predictive-maintenance-iiot/` (full URL: https://www.m365.fm/en/learn/predictive-maintenance-iiot/) |
| Main keyword | predictive maintenance; IIoT (industrial internet of things) |
| Secondary keywords | what is predictive maintenance, predictive maintenance vs preventive maintenance, condition-based maintenance, condition monitoring, predictive maintenance techniques, vibration analysis, infrared thermography, oil analysis, ultrasound testing, motor current signature analysis, P-F curve, P-F interval, reliability-centered maintenance, IIoT predictive maintenance, IIoT architecture, OPC UA, MQTT, Sparkplug, unified namespace, edge computing, predictive maintenance machine learning, anomaly detection, remaining useful life, Weibull analysis, predictive maintenance ROI, predictive maintenance pilot, predictive maintenance KPIs, MTBF, MTTR, PM compliance, ISO 17359, ISO 13374, ISO 20816, predictive maintenance cybersecurity |
| Search intent | Informational (definition, techniques, how it works) with strong commercial investigation (ROI, implementation, build vs. buy). Audience: maintenance and reliability managers, plant managers, operations directors, reliability engineers, OT/IT engineers and controllers evaluating a predictive maintenance program |
| Target word count | At least 10,000 words (longest English competitor on google.com: approx. 4,500 to 5,000 words). Actual H1 to Conclusion incl. tables, glossary and FAQ (`wc -w`): **15,871 words** (after the round 5 SERP re-check of November 20, 2026; 15,604 after round 4, 15,483 before the verification pass) |
| Language version | US English (`en-US`). New article without a German version: no hreflang pair, self-referencing canonical only |

# Competitive analysis (google.com SERP, November 2026)

Analyzed: English-language results on google.com (US) for "predictive maintenance", "what is predictive maintenance IIoT guide", "predictive maintenance complete guide manufacturing techniques ROI" and "IIoT predictive maintenance architecture OPC UA MQTT" (retrieved November 20, 2026). Pages were fetched; word counts are estimates of the main text without navigation, forms and footers.

| Page (URL) | approx. words | Strengths | Gaps |
|---|---|---|---|
| netsuite.com/portal/resource/articles/erp/predictive-maintenance.shtml | 4,500–5,000 | longest page; seven-step process, eight techniques as H3s, honest drawbacks section, key takeaways, short FAQ | almost no sources (one Siemens statistic), no ROI calculation, no P-F curve, no standards, RUL never explained, security reduced to "securely", ERP pitch |
| intelliarts.com/blog/predictive-maintenance-in-manufacturing/ | approx. 3,500 | question-style H2s, named sources (McKinsey, Deloitte), roadmap with team roles and data needs, 8 FAQs incl. model drift | formulas only as images, internal contradictions on timeline and data needs, no P-F curve, no standards, RUL not defined, no security |
| oxmaint.com (Predictive Maintenance for Manufacturing, Complete 2026 Guide) | 2,800–3,000 | equipment-specific failure costs and warning windows, 60-day roadmap, FAQ | financial table does not reconcile, inconsistent accuracy and warning-window figures, unsourced "DOE benchmark", vendor CTAs, no protocols, no security |
| tractian.com/en/glossary/predictive-maintenance | 2,500–2,700 | only competitor with an internally consistent ROI formula and example; P-F curve defined; technique table; 7 FAQs | no sources for ROI ranges (500% to 1,000%+), no standards, ML/RUL at headline level, no IIoT architecture or protocols, security only in FAQ |
| ibm.com/think/topics/predictive-maintenance | 2,000–2,300 | clear definition and contrast with preventive, workflow, industry examples | most claims unsourced, "five stages" with four shown, no ROI method, no P-F curve, no standards, no roadmap, no FAQ, Maximo links |
| sap.com (What is predictive maintenance?) | 2,000–2,300 | broad strategy list incl. RCM and prescriptive, sensor types tied to signals, challenges section | case figures without sources, prescriptive maintenance mis-defined, no ROI, no FAQ, no standards |
| en.wikipedia.org/wiki/Predictive_maintenance | approx. 1,550 | lists techniques incl. MCSA, academic references (Mobley, Susto) | no section headings, savings claims vague, no P-F interval, no DOE, not practitioner-oriented |
| spartakustech.com (What Is IIoT in Predictive Maintenance?) | 1,400–1,600 | layered IIoT stack, names MQTT, OPC UA and Modbus TCP, pilot size and baseline period, pitfalls incl. cybersecurity | repeats the DOE survey percentages as "reliability literature" without citation, no ROI, no standards, no P-F curve, no FAQ |
| ifm.com (What is predictive maintenance? Complete overview) | approx. 1,300 | dollar case studies, maturity framing, route-based vs. online models | no formulas, "87.3% fewer defects" without baseline, no standards, no P-F curve, no security, consultation form |
| splunk.com (What is predictive maintenance?) | 1,000–1,100 | downtime cost framing, strategy comparison | unsourced headline figures, no roadmap, no FAQ, false-positive/false-negative mix-up |

**"People also ask" style questions collected (google.com SERP FAQ blocks and related searches, November 2026):** What is predictive maintenance in simple terms? What is the difference between predictive and preventive maintenance? What are the four types of maintenance? What is IIoT? What are examples of predictive maintenance? What techniques are used in predictive maintenance? What is the P-F curve? How much does predictive maintenance save? What is the ROI of predictive maintenance? How do you implement predictive maintenance? Which sensors are used? Do you need machine learning? What data is needed? Can it work on older machines? How do you prevent model drift?

**How this article beats the competition:** None of the ten pages cites ISO 17359, ISO 13374 or ISO 20816, and only Tractian explains the P-F curve, in one paragraph. At least one page repeats the DOE survey percentages as "reliability literature" without naming the DOE, and another quotes "87.3% fewer defects" without a baseline; the NIST survey analysis that reports an 87% lower defect rate also warns that many of its differences are not statistically significant. This article traces both numbers to their source and labels vendor and consultancy figures. It adds what the SERP leaves out: a P-F interval calculation, bearing defect frequency and data-volume calculations that explain sampling and edge design, a five-layer IIoT architecture with OPC UA, MQTT, Sparkplug and the unified namespace, an ML section that separates anomaly detection, diagnosis, failure prediction and RUL with a cost-weighted precision/recall example, Weibull analysis, a complete ROI model with sensitivity and break-even, a criticality scoring table, a phased roadmap with gates, SMRP-style KPIs with worked examples, US safety (OSHA lockout/tagout, NFPA 70B) and a security section based on NIST SP 800-82 Rev. 3 and ISA/IEC 62443. At 15,483 words it is about 3.1 times as long as the longest competitor, with the length going into calculations, tables and checklists.


### SERP re-check, November 20, 2026

Re-checked with web search on google.com (US) for the main keyword "predictive maintenance" and the variant "IIoT predictive maintenance" (searches November 20, 2026; page fetches completed November 23, 2026 after a tool quota pause). No NEURONwriter analysis exists for this article.

| Query | Top results (order as returned) | Fetched: approx. words and structure |
|---|---|---|
| predictive maintenance | Wikipedia; ibm.com/think/topics/predictive-maintenance; sap.com; netsuite.com; splunk.com; databricks.com glossary; tractian.com; datarobot.com; intel.com; mathworks.com; ifm.com; aws.amazon.com/what-is/predictive-maintenance; fluke.com; deloitte.com (PDF) | IBM: about 2,700 words (longer than in the original analysis), H2s on how it works, five types of analysis, benefits, use cases by industry, future; no FAQ. AWS: 2,200–2,400 words, question H2s: how does it work (monitoring, analysis, action), technologies, benefits, use cases, difference from other types (vs. preventive, vs. inspection, vs. condition-based), challenges. Databricks: 500–550 words |
| IIoT predictive maintenance | control.com (How IIoT is transforming predictive maintenance); endress.com (types of maintenance and IIoT); arXiv paper; element14; sap.com; splunk.com; telit.com; silabs.com; rockwellautomation.com; automation.com | control.com: 1,100–1,200 words, sections on PdM, IIoT and automation, data-driven decisions, ROI, alerts; no FAQ |

**Findings.** (1) The longest page in the original analysis (NetSuite, 4,500 to 5,000 words) still ranks; no longer page appeared. The article remains about three times longer. (2) Question headings on the ranking pages that were not yet answered as FAQ: how predictive maintenance works, the difference between predictive and condition-based maintenance, and the challenges of predictive maintenance. All three are covered in the body (sections 1, 5, 6, 15 and 16) and now also as FAQ entries. (3) "Use cases by industry" (IBM, AWS): our "Predictive maintenance examples by asset type" table covers the same need by asset, which suits plant readers better; no change. (4) The IIoT variant returns technical articles and vendor pages that are shorter than our IIoT architecture section. (5) Not re-checked: the live "People also ask" box (not visible to the search tool) and the SAP, Splunk, Tractian, Intel, MathWorks, ifm, Fluke and Endress+Hauser pages (identified, not fetched in this re-check).

---

# Predictive Maintenance and IIoT: Techniques, Architecture, ROI, and How to Start

*Updated: November 2026 · Reading time: about 50 minutes (quick start: short answer, "Key takeaways" box, the ROI worked example and the glossary)*

> **Short answer:** Predictive maintenance (PdM) means servicing a machine when measured data shows that a failure is developing, not on a fixed calendar and not after it breaks. It works by monitoring condition signals such as vibration, temperature, oil quality, ultrasound and motor current, comparing them with a baseline, and turning the trend into a work order early enough to plan the repair. The industrial internet of things (IIoT) is the plumbing that makes this affordable at scale: sensors, edge gateways, standard protocols such as OPC UA and MQTT, and analytics that connect to your maintenance system [1][2][3].

> **Key takeaways**
> - Predictive maintenance only pays where a failure gives a measurable warning (a P-F interval) that is longer than your inspection interval plus the time you need to plan and execute the repair.
> - The US Department of Energy's O&M guide estimates 8% to 12% savings of predictive over preventive maintenance and lists survey averages such as 25% to 30% lower maintenance cost and 35% to 45% less downtime; the guide does not name the surveys behind those figures, so treat them as orientation, not as a forecast [2].
> - A 2020 NIST survey analysis found that US plants in the top quarter for reactive maintenance reported about 3.3 times more downtime than those in the bottom quarter, but NIST itself calls many of these differences not statistically significant [4].
> - The five workhorse techniques are vibration analysis, infrared thermography, oil and wear particle analysis, airborne and structure-borne ultrasound, and motor current or electrical signature analysis, plus performance trending from process data you already have; most programs need two or three of them, not all.
> - An IIoT stack for maintenance has five layers: sensors, edge, connectivity, data platform, and the maintenance workflow (CMMS or EAM). Most pilots fail in the last layer, not in the sensor.
> - Machine learning is a tool for scale, not a starting point. Thresholds and trend rules on good data catch many developing failures; remaining useful life (RUL) models need labeled failure history most plants do not have yet.
> - In our worked example, a 12-asset pilot pays back in about six months if 60% of failures are caught, and does not pay back within three years if only 20% are caught. Detection rate and the cost of downtime decide the business case.
> - Every connected sensor and cloud link is also an attack path into the plant network; design security in from the first gateway (ISA/IEC 62443, NIST SP 800-82 Rev. 3).

## Table of contents

1. [What is predictive maintenance?](#what-is-predictive-maintenance)
2. [What is IIoT, and how does it enable predictive maintenance?](#what-is-iiot-and-how-does-it-enable-predictive-maintenance)
3. [Maintenance strategies compared: reactive, preventive, condition-based, predictive, prescriptive](#maintenance-strategies-compared-reactive-preventive-condition-based-predictive-prescriptive)
4. [How machines fail: the P-F curve and the six failure patterns](#how-machines-fail-the-p-f-curve-and-the-six-failure-patterns)
5. [Condition monitoring techniques](#condition-monitoring-techniques)
6. [IIoT architecture for predictive maintenance](#iiot-architecture-for-predictive-maintenance)
7. [Data requirements: what you need before any model](#data-requirements-what-you-need-before-any-model)
8. [Machine learning for predictive maintenance: anomaly detection and RUL](#machine-learning-for-predictive-maintenance-anomaly-detection-and-rul)
9. [Benefits and the evidence behind them](#benefits-and-the-evidence-behind-them)
10. [ROI of predictive maintenance: a worked example](#roi-of-predictive-maintenance-a-worked-example)
11. [How to choose the pilot assets](#how-to-choose-the-pilot-assets)
12. [Implementation roadmap: from pilot to program](#implementation-roadmap-from-pilot-to-program)
13. [Maintenance KPIs: MTBF, MTTR, PM compliance and PdM-specific metrics](#maintenance-kpis-mtbf-mttr-pm-compliance-and-pdm-specific-metrics)
14. [People, skills and safety](#people-skills-and-safety)
15. [Common mistakes](#common-mistakes)
16. [Limits: when predictive maintenance does not pay](#limits-when-predictive-maintenance-does-not-pay)
17. [Security note: IIoT and OT cybersecurity](#security-note-iiot-and-ot-cybersecurity)
18. [Where PdM fits: TPM, MES, digital twins and the cloud](#where-pdm-fits-tpm-mes-digital-twins-and-the-cloud)
19. [Glossary](#glossary)
20. [FAQ: predictive maintenance and IIoT](#faq-predictive-maintenance-and-iiot)
21. [Conclusion and first steps](#conclusion-and-first-steps)

## What is predictive maintenance?

Predictive maintenance is a maintenance strategy in which the timing of a task is decided by the measured condition of the asset and a forecast of how that condition will develop. Instead of replacing a bearing every 8,000 hours or waiting until it seizes, you measure the bearing, see the defect appear in the vibration spectrum, watch it grow, and schedule the replacement for the next planned stop.

ISO 17359, the general guideline for condition monitoring and diagnostics of machines, describes the steps of such a program for all machine types: deciding what to monitor, selecting measurement methods, setting alert criteria, diagnosing and acting on the results [1]. The US Department of Energy's Federal Energy Management Program (FEMP) describes predictive maintenance in its *Operations & Maintenance Best Practices* guide as measurements that detect the onset of degradation so that causal stressors can be eliminated or controlled before the equipment deteriorates significantly [2]. Both sources agree on the core idea: measure, compare with a reference, act before the functional failure.

### Predictive maintenance vs. condition-based maintenance

The two terms are often used as synonyms, and in many plants they describe the same work. A useful distinction for planning:

- **Condition-based maintenance (CBM)** triggers a task when a measured value crosses a limit. "Overall vibration above alert level: inspect within seven days."
- **Predictive maintenance (PdM)** adds a forecast. "At the current rate of increase, the bearing will reach the danger level in about five weeks: replace it during the shutdown in three weeks."

In practice, PdM is CBM plus trending plus a prognosis. ISO handles the forecast part separately in its prognostics guideline, ISO 13381-1, which describes how to estimate remaining useful life from trends and models [5]. The 2015 edition was withdrawn in December 2021; a third edition (ISO/DIS 13381-1) is at the Draft International Standard stage and will replace it [31]. Our sister guide on [Azure for manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/) uses the same split in its use-case table, which keeps the two articles consistent.

### What predictive maintenance is not

- **A sensor purchase alone.** A sensor without an agreed alert limit, an owner and a link to the work order system produces graphs nobody reads.
- **A replacement for basic care.** Cleaning, lubrication, tightening and inspection by operators, the autonomous maintenance pillar of [total productive maintenance](https://www.m365.fm/en/learn/tpm-oee/) (planned), remove many failure causes that no sensor needs to predict.
- **Necessarily AI.** A large share of value comes from simple trends on well-chosen signals. Machine learning becomes useful when the number of assets and signals outgrows what analysts can watch.

## What is IIoT, and how does it enable predictive maintenance?

The industrial internet of things (IIoT) is the network of sensors, controllers, gateways and software that collect data from industrial equipment and make it available to analytics and business systems. For maintenance, IIoT changed two economics.

**First, the cost of a measurement point fell.** Traditional condition monitoring meant either an analyst walking a route with a portable data collector once a month, or permanently wired protection systems on a few large turbines and compressors. Battery-powered wireless sensors that measure vibration and temperature and report several times per day now make continuous monitoring possible on mid-sized motors, pumps, fans and gearboxes that were previously checked monthly or not at all.

**Second, the data became connectable.** Standard protocols let a sensor reading, a PLC tag such as motor speed or product code, and a work order in the maintenance system meet in one data model. OPC UA provides an information model and secure transport for machine data [6]; MQTT, an OASIS standard, is a lightweight publish/subscribe protocol widely used to move that data from the edge to a broker or the cloud [7]. Without that context, an analytics tool sees a spike in vibration; with it, the tool sees that the spike only happens on product B at full speed, which is a process issue, not a failing bearing.

IIoT does not make the physics easier. A sensor sampling once per minute cannot see a bearing defect frequency at 106 Hz; a temperature probe on a motor housing will see a failing winding long after a current signature would have. Choosing the right measurement for the failure mode is still the engineer's job, and the next sections cover how.

## Maintenance strategies compared: reactive, preventive, condition-based, predictive, prescriptive

Most plants run a mix of strategies, and they should. The question is not "which strategy is best" but "which strategy fits which failure mode on which asset". The DOE guide puts the mix of an average facility at more than 55% reactive, 31% preventive, 12% predictive and 2% other, and uses this to argue that most facilities still rely on run-to-failure far more than they intend to [2]. That breakdown is about 25 years old and its survey basis is not stated, so use it as a picture of the starting point, not as a benchmark.

| Strategy | Trigger | Typical data needed | Fits when | Main risk |
|---|---|---|---|---|
| Reactive (run-to-failure) | Failure | None | Failure is cheap, safe and does not stop the bottleneck (light bulbs, small redundant pumps) | Unplanned downtime, collateral damage, safety incidents |
| Preventive (time- or usage-based) | Calendar, operating hours, cycles | Hours, counts | Wear is age-related and predictable (filters, belts, lubrication, some seals) | Over-maintenance, and failures induced by intrusive work |
| Condition-based | Measured value crosses a limit | Condition signal, alert limits | A measurable symptom precedes failure | Limits set badly: too many false alarms or late detection |
| Predictive | Forecast of when the condition will reach a limit | Condition trend, operating context, ideally failure history | Failure is expensive, the warning period is long enough, and a planned repair is much cheaper than an unplanned one | Investment without a working response process |
| Prescriptive | Recommended action with options and consequences | All of the above plus cause-and-action knowledge | Mature programs with a large, coded history | Black-box recommendations that technicians do not trust |
| Reliability-centered maintenance (RCM) | Structured analysis that selects one of the above per failure mode | Function, failure modes, consequences | Safety- or availability-critical systems; also as a method to set up any program | Analysis effort; paper exercises without follow-through |

### Predictive vs. preventive maintenance at a glance

| Question | Preventive maintenance | Predictive maintenance |
|---|---|---|
| When is work done? | At fixed intervals of time, hours or cycles | When measured condition shows a developing fault |
| What does it need? | A schedule and a task list | Measurements, alert limits, analysis and a response process |
| Strength | Simple to plan, works for age-related wear | Uses most of a component's life, finds faults that intervals miss |
| Weakness | Replaces good parts, misses random failures, can introduce faults through intrusive work | Investment in sensors, skills and data; useless where failures give no warning |
| Typical example | Changing a filter every 3 months | Replacing a bearing when its outer-race defect frequency starts to rise |

### What the DOE guide says about savings

The DOE O&M guide (Release 2.0, 2002, prepared by Pacific Northwest National Laboratory; Release 3.0 followed in August 2010) gives the most widely copied numbers in this field [2][3][8]:

- Preventive maintenance can save "as much as 12% to 18% on the average" compared with a purely reactive program.
- A functioning predictive maintenance program "can provide a savings of 8% to 12%" over preventive maintenance alone, and some organizations "could easily recognize savings opportunities exceeding 30% to 40%".
- "Independent surveys" are quoted for industrial averages: return on investment of 10 times, 25% to 30% lower maintenance cost, 70% to 75% fewer breakdowns, 35% to 45% less downtime, and 20% to 25% higher production.

Two cautions belong next to these numbers. The guide does not name the surveys, and its predictive-maintenance advantages list contains a wording slip ("savings over predictive maintenance program" where the text means preventive) [2]. When you see "25% to 30%", "70% to 75%" and "35% to 45%" on a vendor page today, they very often trace back to this one unsourced list. They are plausible orders of magnitude for a well-run program, not evidence for your plant.

### Choosing a strategy per failure mode

A simple decision sequence, adapted from RCM logic, works for most assets:

1. **Does the failure mode have safety or environmental consequences?** If yes, you need a task that reduces the risk to an acceptable level, or a redesign. Run-to-failure is not an option.
2. **Is there a detectable warning before functional failure (a potential failure, P)?** If yes, and the warning period is long and consistent enough, condition-based or predictive maintenance is the first choice.
3. **If not, is the failure age-related?** If the failure probability rises clearly with age or use, a time- or usage-based replacement can work.
4. **If neither applies, are the consequences acceptable?** Then run to failure deliberately, with spares and a fast repair procedure. Otherwise, redesign or add redundancy.

RCM as a formal method came out of US commercial aviation. F. Stanley Nowlan and Howard F. Heap of United Airlines wrote the 1978 report *Reliability-Centered Maintenance* for the US Department of Defense [9]; SAE JA1011 (1998) later set out minimum criteria a process must meet to be called RCM [10]. Aviation readers will recognize the same logic in maintenance program development; see our [aerospace production planning](https://www.m365.fm/en/learn/aerospace-production-planning/) guide for the planning side.

## How machines fail: the P-F curve and the six failure patterns

### The P-F curve

The P-F curve plots the condition of an asset over time. At some point a defect starts. A little later it becomes detectable with a given technique: this is the **potential failure point (P)**. The condition keeps falling until the asset can no longer perform its function: the **functional failure point (F)**. The time between P and F is the **P-F interval**.

Three properties of the P-F curve drive every predictive maintenance decision:

1. **Each technique has its own P point.** Vibration analysis or ultrasound typically sees a rolling-element bearing defect long before the bearing gets hot; a thermal camera sees it later; a technician hears and feels it last. The earlier the P point, the longer the warning, and the more planning freedom you have.
2. **The P-F interval varies.** The same failure mode can develop over months on a lightly loaded fan and over days on a heavily loaded, poorly lubricated gearbox. Plan with a conservative estimate, not with the average.
3. **The useful warning is shorter than the P-F interval.** You lose the time between inspections and the time needed to order parts, plan and execute the work.

### Worked example: is a monthly vibration route good enough?

A plant monitors a 75 kW (100 hp) fan motor bearing with a portable vibration data collector. Experience on similar fans suggests a P-F interval of about 8 weeks for outer-race bearing defects detected by vibration (an assumption for this example; collect your own evidence).

- Inspection interval: monthly route, about 4.3 weeks.
- Worst case: the defect becomes detectable the day after a measurement. It is found at the next route, 4.3 weeks later.
- Remaining warning: 8.0 − 4.3 = **3.7 weeks** (the "net P-F interval").
- Time needed to act: 2 weeks lead time for a bearing set and 1 week to fit the job into a planned stop = 3 weeks.
- Margin: 3.7 − 3.0 = **0.7 weeks**. The route works, but only just.

With a quarterly route (13 weeks), the defect could develop from P to F between two measurements. The monitoring would look busy on paper and catch the failure by luck. A common reliability rule of thumb is to inspect at no more than half the P-F interval, which here means every 4 weeks or more often [unverified as a formal standard; it is a practitioner convention]. A wireless sensor reporting several times a day removes the inspection-interval loss almost completely, which is the main operational argument for continuous IIoT monitoring on assets with short or uncertain P-F intervals.

> **Formula: net P-F interval = P-F interval − inspection interval.** The task is technically feasible only if the net P-F interval is longer than the time you need to plan and execute the repair.

### The six failure patterns

The Nowlan and Heap study analyzed failure data from commercial aircraft components and found that most items did not show the "bathtub" or wear-out behavior that time-based overhauls assume. RCM literature summarizes their findings as six age-reliability patterns, from wear-out (failure probability rising with age) to random failure (constant probability) and infant mortality (high probability right after installation or overhaul) [10].

| Pattern | Shape | What it means for strategy |
|---|---|---|
| A: bathtub | Infant mortality, then constant, then wear-out | Time-based replacement can help late in life, but beware of induced early failures |
| B: wear-out | Constant or slowly rising, then a clear wear-out zone | Classic case for time- or usage-based replacement |
| C: gradual aging | Slowly rising probability, no clear wear-out age | Condition monitoring better than fixed intervals |
| D: low when new, then constant | Quick rise to a constant level | Condition monitoring; time-based replacement adds little |
| E: random | Constant probability over life | Time-based replacement does not help; condition monitoring or run-to-failure |
| F: infant mortality, then constant | High after installation or overhaul, then constant | Avoid unnecessary intrusive maintenance; focus on installation quality |

The shares of each pattern in the original data (often quoted as 4%, 2%, 5%, 7%, 14% and 68% for A to F) are widely repeated in RCM training material. A reliability publication that cites Exhibit 2.13 of the report gives 4% for A, 6% for A and B together and 5% for C, with D, E and F making up the bulk [32]; that fits the report's own 89% [9]. The split between D, E and F (7%, 14%, 68%) is still [unverified against the original 1978 report]. The report itself (dated December 29, 1978, prepared by United Airlines for the Office of the Assistant Secretary of Defense) summarizes the result in its discussion of failure patterns: in the data analyzed, 89% of items "cannot benefit from a limit on operating age" [9]. The broader point is well established in reliability literature: for complex equipment, a majority of failure modes are not strongly age-related, so fixed-interval overhauls do not prevent them and can introduce new failures. This is the theoretical basis for condition monitoring, and also a warning: if a failure mode is random and gives no warning, neither preventive nor predictive maintenance will stop it.

## Condition monitoring techniques

The DOE O&M guide (Release 3.0) devotes a full chapter to predictive maintenance technologies and covers thermography, lubricant and wear particle analysis, ultrasonic analysis, vibration analysis, motor analysis and performance trending [3]. The same six families appear, with different emphasis, in every serious condition monitoring program. The table maps them to the failure modes they find best.

| Technique | What it measures | Finds best | Typical assets | Online (IIoT) or route-based |
|---|---|---|---|---|
| Vibration analysis | Acceleration, velocity, displacement; spectra and time waveforms | Imbalance, misalignment, looseness, rolling-element bearing defects, gear mesh problems | Motors, pumps, fans, gearboxes, compressors, spindles | Both; wireless sensors common for trend and alert, routes or permanent systems for detailed diagnosis |
| Infrared thermography | Surface temperature distribution | Loose or corroded electrical connections, overloaded circuits, insulation and refractory damage, blocked heat exchangers, overheating bearings (late) | Switchgear, MCCs, panels, motors, steam traps, kilns | Mostly route-based with a camera; fixed thermal cameras or spot sensors for critical points |
| Oil and wear particle analysis | Viscosity, contamination, water, oxidation, wear metals, particle counts | Lubricant degradation, contamination, internal wear of gearboxes, hydraulics, engines | Gearboxes, hydraulic systems, compressors, turbines, diesel engines | Mostly sampled and sent to a lab; inline particle and moisture sensors exist for critical systems |
| Ultrasound (airborne and structure-borne) | High-frequency sound above human hearing | Compressed air and gas leaks, steam trap failure, early bearing lubrication problems, electrical arcing, tracking and corona | Air systems, steam systems, slow-speed bearings, electrical equipment | Mostly route-based; online sensors for lubrication monitoring and critical bearings |
| Motor current and electrical signature analysis (MCSA/ESA) | Current and voltage spectra of the motor supply | Broken rotor bars, eccentricity, some stator and supply problems; also some driven-equipment faults | Induction motors, especially inaccessible ones (submersible pumps, motors behind guards) | Both; measured at the motor control center, which avoids work at the machine |
| Performance and process trending | Flow, pressure, power, efficiency, temperature differences | Fouling, internal leakage, impeller wear, efficiency loss | Pumps, compressors, heat exchangers, chillers | Online from PLC and SCADA data, often already available |

### Vibration analysis

Vibration analysis is the backbone of most programs for rotating equipment because it covers the largest number of common mechanical failure modes. Three levels of analysis are useful to distinguish:

1. **Overall level trending.** A single number, usually velocity RMS over a frequency band, is trended and compared with alert limits. ISO 20816-1 sets general conditions and procedures for measuring and evaluating vibration on non-rotating parts of complete machines and on rotating shafts, with evaluation criteria based on both the vibration magnitude and its change over time [11]. ISO 20816-3:2022 gives the criteria for industrial machines above 15 kW (about 20 hp) running between 120 and 30,000 r/min, such as motors with flexible couplings, fans, pumps and compressors [12]. ISO 20816-3:2022 revised ISO 10816-3:2009, which iso.org lists as withdrawn [13]. Many plant procedures still name ISO 10816; check that your alert limits reference the current documents.
2. **Spectrum analysis.** A fast Fourier transform (FFT) splits the signal into frequencies. Imbalance shows at 1× running speed, misalignment often at 1× and 2×, and bearing defects at characteristic frequencies that depend on the bearing geometry.
3. **Time waveform and envelope analysis.** Early bearing and gear defects create short impacts that the spectrum smears out. Envelope (demodulation) techniques make these repetitive impacts visible and are what lets vibration detect bearing problems early on the P-F curve.

**Worked example: bearing defect frequencies.** The characteristic frequencies follow from bearing kinematics (number of rolling elements n, rolling element diameter d, pitch diameter D, contact angle φ, shaft frequency f_r); these are the standard kinematic formulas found in bearing manufacturers' and vibration training literature (formulas as published in a condition monitoring vendor's glossary [35]; SKF's application note uses the same variables for BPFO [36]; for your bearing, use the supplier's defect frequency data):

- Ball pass frequency, outer race: BPFO = (n ÷ 2) × f_r × (1 − (d ÷ D) × cos φ)
- Ball pass frequency, inner race: BPFI = (n ÷ 2) × f_r × (1 + (d ÷ D) × cos φ)
- Fundamental train (cage) frequency: FTF = (f_r ÷ 2) × (1 − (d ÷ D) × cos φ)

For a motor running at 1,780 rpm (f_r = 29.67 Hz) with a deep-groove ball bearing of n = 9 balls, d = 7.94 mm, D = 39.04 mm and φ = 0° (illustrative geometry; use the manufacturer's data for your bearing):

- d ÷ D = 0.2034
- BPFO = 4.5 × 29.67 × 0.7966 = **106.3 Hz** (3.58 × running speed)
- BPFI = 4.5 × 29.67 × 1.2034 = **160.7 Hz** (5.42 × running speed)
- FTF = 14.83 × 0.7966 = **11.8 Hz**

Two practical consequences follow. A sensor that reports only an overall value every few hours cannot tell you which of these frequencies is rising; you need at least periodic spectra or envelope values to diagnose. And to see 160 Hz with its harmonics, the sampling rate must be well above twice the highest frequency of interest (the Nyquist criterion), so a wireless sensor that samples at a few hundred hertz is a trend device, not a diagnostic one.

### Infrared thermography

Thermography uses an infrared camera to show temperature differences. It is fast, non-contact and covers equipment that vibration cannot, especially electrical distribution. A hot spot on one phase of a breaker connection compared with the other two phases at similar load is a classic finding.

In the US, electrical maintenance programs are shaped by NFPA 70B, *Standard for Electrical Equipment Maintenance*, which the National Fire Protection Association converted from a recommended practice into a standard with its 2023 edition [14]. Facilities that adopt it, or whose insurers require it, will plan thermographic surveys of energized equipment as part of the electrical maintenance program. Thermography of energized equipment also falls under electrical safety rules for work near energized parts (in the US typically NFPA 70E, whose shock approach boundaries, arc flash boundary and PPE rules a thermography training provider applies to infrared surveys of energized equipment [33]), so the survey method (opening covers, infrared windows, approach boundaries, PPE) is a safety decision, not just a technical one.

Limits: thermography sees surfaces, needs load on the equipment to show problems, and is sensitive to emissivity, reflections and wind. Comparing like with like (phase to phase, motor to identical motor) is more reliable than absolute temperatures.

### Oil and wear particle analysis

For gearboxes, hydraulic systems, compressors and engines, the lubricant carries information about both its own condition and the machine's internal wear. A typical lab report covers viscosity, water content, acid number or oxidation, elemental analysis of wear metals (iron, copper, chrome and others) and contaminants (silicon from dirt), and particle counts. Particle cleanliness is commonly reported as an ISO 4406 code, three numbers that stand for particle counts per milliliter above three size thresholds (4 µm(c), 6 µm(c) and 14 µm(c) for automatic particle counters in the current fourth edition, ISO 4406:2021 [34]).

What makes oil analysis work in practice:

- **Consistent sampling.** Same point, same procedure, machine running and warm, clean sampling valves. A bad sample produces a confident wrong answer.
- **Trends, not single values.** Iron at 40 ppm means little alone; iron doubling between two samples at similar operating hours means a lot.
- **Acting on contamination.** Many lubricant-related failures start with dirt and water. Oil analysis pays twice when it drives better filtration, breathers and storage, which is proactive maintenance rather than prediction.

Inline oil sensors (particle counters, moisture, dielectric sensors) are available for critical systems, but for most plants a lab program with a sample every one to three months on the critical gearboxes and hydraulic units is the cost-effective baseline.

### Ultrasound

Ultrasound instruments convert high-frequency sound (above human hearing) into an audible signal and a decibel reading. Their strongest applications are:

- **Compressed air and gas leak detection,** which is as much an energy program as a maintenance one; the DOE O&M guide lists energy losses from steam, water and air leaks among the typical consequences of poor operations and maintenance [2].
- **Steam trap testing.**
- **Lubrication of bearings:** greasing until the ultrasound reading drops, instead of a fixed number of shots, avoids both under- and over-greasing.
- **Slow-speed bearings,** where vibration analysis struggles because impact energy is low.
- **Electrical inspection** for arcing, tracking and corona, often through closed panels.

Ultrasound is cheap to start, easy to teach and often the first technique a small plant adds after thermography.

### Motor current and electrical signature analysis (MCSA/ESA)

MCSA measures the current drawn by an induction motor, usually at the motor control center, and analyzes its spectrum. Broken rotor bars, for example, are commonly described as sidebands around the supply frequency spaced at twice the slip frequency, that is at (1 ± 2s) × f_s for slip s and supply frequency f_s [37]. Because the measurement is taken in the MCC, it suits motors that are hard or dangerous to reach: submersible pumps, motors on high platforms, equipment behind guarding. Electrical signature analysis adds voltage and can reveal power quality and some driven-load problems. Motor current signature analysis is listed alongside vibration, ultrasound, infrared and oil analysis among the established predictive maintenance techniques in general references [15].

MCSA complements vibration; it does not replace it. A bearing defect that is obvious in an envelope spectrum may be invisible in the current, and a rotor problem that is clear in the current may be ambiguous in vibration.

### Performance and process trending

The cheapest condition data is often already in the PLC or SCADA system: motor current, discharge pressure, flow, differential pressure across a filter, temperature rise across a heat exchanger. A centrifugal pump whose current rises while flow drops is telling you something about wear, recirculation or the system curve. A filter with steadily rising differential pressure can be changed at the right time instead of every month. IIoT connectivity makes this data usable for maintenance by pulling it into the same model as the dedicated condition sensors.

### Online sensors or route-based measurement?

| Criterion | Online (permanently installed, IIoT) | Route-based (portable collector, camera, sampling) |
|---|---|---|
| Cost structure | Cost per measurement point (sensor, gateway, subscription) | Cost per route hour (analyst time) |
| Inspection interval | Minutes to hours | Weeks to months |
| Best for | Critical assets, short or uncertain P-F intervals, hard-to-reach or hazardous locations | Large numbers of less critical assets, techniques that need a skilled person (thermography, detailed diagnosis) |
| Data quality | Same point, same mounting every time | Depends on the collector's discipline (location, mounting, operating state) |
| Weakness | Sensor and battery fleet to manage, limited bandwidth for raw data | Misses fast-developing faults between routes |

Most plants end up with both: online sensors on the top 10% to 20% of assets by criticality, routes on the rest.

### Which techniques to start with

| Plant profile | Sensible first techniques | Why |
|---|---|---|
| Discrete manufacturer with many motors, pumps, fans, conveyors | Vibration (wireless on critical assets, route on the rest), thermography for electrical | Covers the most frequent mechanical and electrical failure modes |
| Process plant with gearboxes, hydraulics, compressors | Oil analysis, vibration, performance trending | Internal wear and lubrication drive failures |
| Plant with large compressed air or steam systems | Ultrasound, thermography | Energy savings fund the program |
| Many inaccessible or submersible motors | MCSA plus vibration where reachable | Measurement from the MCC avoids access problems |

### Predictive maintenance examples by asset type

| Asset | Dominant failure mode | Precursor | Technique | Typical action |
|---|---|---|---|---|
| Fan or pump motor bearing | Rolling-element fatigue, lubrication failure | Rising envelope value, defect frequencies (BPFO, BPFI) | Vibration, ultrasound | Re-grease or replace bearing at the next planned stop |
| Gearbox | Gear wear, contamination | Iron and silicon rising in oil, gear mesh sidebands | Oil analysis, vibration | Change oil and breather, plan gear inspection |
| Switchgear connection | Loose or corroded joint | Hot spot on one phase compared with the others | Thermography | Re-torque or replace the connection during an outage |
| Compressed air system | Leaks | Ultrasonic signature at fittings and hoses | Ultrasound | Tag and repair leaks in a planned sweep |
| Submersible pump motor | Rotor or stator defects | Current spectrum changes | MCSA | Pull and repair before a winding failure |
| Heat exchanger | Fouling | Falling temperature difference at constant flow | Performance trending | Schedule cleaning |

## IIoT architecture for predictive maintenance

ISO 13374 sets out general guidelines for how condition monitoring and diagnostic information is processed, communicated and presented, so that software from different vendors can work together [16]. The standard defines six blocks of functionality in a condition monitoring system, and the MIMOSA OSA-CBM specification implements them with data structures and interfaces [17]. The blocks are usually labeled data acquisition, data manipulation (for example filtering and feature extraction), state detection, health assessment, prognostic assessment and advisory generation. That chain maps well onto a modern IIoT stack, which we describe here in five layers.

| Layer | What happens | Typical components | Design questions |
|---|---|---|---|
| 1. Sensing | Physical signal to digital value | Accelerometers, temperature probes, current transformers, ultrasonic sensors, oil sensors; existing PLC tags | Which failure mode, which signal, which sampling rate, which mounting? |
| 2. Edge | Collect, buffer, compute features, apply first rules | Wireless gateways, industrial PCs, edge runtimes, PLCs | What stays local, what is sent, what happens when the uplink fails? |
| 3. Connectivity | Move data with context and security | OPC UA, MQTT (often with Sparkplug B), Modbus TCP or vendor protocols at the machine, wireless (proprietary, Wi-Fi, cellular, LoRaWAN) | Which protocol per hop, who owns the broker, how are devices authenticated? |
| 4. Data platform | Store time series, join with context, run analytics and models | Historian, time-series database, data lake, cloud IoT and analytics services | One data model across plants? Retention? Who can query? |
| 5. Action | Turn a finding into planned work and feedback | CMMS or EAM, MES, mobile apps, dashboards, notification tools | Who gets the alert, how does it become a work order, how is the result fed back? |

### Layer 1: sensing

**Wired vs. wireless.** Permanently wired accelerometers connected to a monitoring system remain the choice for machine protection (trips) on large turbomachinery and for high-frequency diagnostic data. Battery-powered wireless sensors suit the large middle of the asset base: motors, pumps, fans and gearboxes where trend data several times a day is enough, and running cable would cost more than the sensor. Expect battery life to depend heavily on the reporting interval and on how often the sensor sends raw waveforms rather than summary values; ask the vendor for battery life at the configuration you will actually use.

**Mounting matters.** Accelerometer readings depend on how the sensor is attached. Stud mounting gives the best frequency response; adhesive mounting is close for many applications; magnets are convenient for routes but limit the usable frequency range. Mount on the bearing housing, in the load zone where possible, and record the exact location and orientation so that later readings are comparable.

**Use what is already there.** Drives (VFDs) know motor current, speed and torque; PLCs know states, recipes and counters; many newer machines expose condition data through OPC UA. Pulling these first often gives a useful picture before the first new sensor is mounted.

### Layer 2: edge

The edge layer exists because raw condition data is large and the network is not always available. A quick calculation shows why.

**Worked example: data volume.** A vibration channel sampled at 25.6 kHz with 16-bit resolution produces 25,600 × 2 bytes = 51.2 kB per second.

- Streamed continuously: 51.2 kB × 86,400 s = **4.4 GB per day per channel**. For 200 channels, about **885 GB per day**.
- One-second snapshot every hour: 51.2 kB × 24 = **1.2 MB per day per channel**.
- Ten features (RMS, peak, crest factor, kurtosis, band energies) every ten minutes as 4-byte values: 10 × 4 bytes × 144 = **5.8 kB per day per channel**, before protocol overhead.

Continuous raw streaming to the cloud is rarely justified. A common pattern is: compute features at the edge continuously, send features and alarms upstream, store short raw waveforms when a rule fires or on a schedule, and keep the ability to pull more raw data on demand for diagnosis.

Other edge functions: buffering during network outages (store and forward), time synchronization (use the source timestamp of each value and a plant time server rather than the arrival time in the cloud), protocol conversion from older fieldbuses to OPC UA or MQTT, and simple rules that must work without the cloud, such as a local alarm.

### Layer 3: connectivity and protocols

**OPC UA** is a platform-independent, service-oriented architecture released in 2008 that combines the functions of the older OPC Classic specifications in one extensible framework. Its information modeling turns raw values into structured, typed objects, and its security model includes encryption, message signing and X.509 certificate authentication [6]. OPC UA also defines a publish-subscribe (PubSub) mode in addition to the classic client-server mode [6]. For maintenance, the information model matters as much as the transport: a pump modeled with its nameplate data, its sensors and its states is far easier to analyze than 40 loose tags.

**MQTT** is an OASIS standard messaging protocol for the internet of things, described by its maintainers as an extremely lightweight publish/subscribe transport [7]. Devices publish to topics on a broker; applications subscribe. It is efficient over constrained networks and decouples producers from consumers. Plain MQTT does not define what a payload means. The Eclipse Sparkplug specification (version 3.0) adds industrial conventions on top of MQTT, including state management through "birth" and "death" certificates that tell subscribers whether data from a device is still valid [18].

**Unified namespace (UNS).** Many IIoT projects organize MQTT topics in an ISA-95-style hierarchy (enterprise, site, area, line, cell, asset) so that every system publishes and finds data in one structure. ISA-95 itself, also published as IEC 62264, defines the levels from the physical process (Level 0) and sensing and control (Levels 1 and 2) through manufacturing operations management (Level 3) to business planning (Level 4) [19]. The UNS is an architecture pattern, not a standard; its value depends on governance of names and data models. Our planned guide to [MES and ISA-95](https://www.m365.fm/en/learn/mes-isa-95/) (planned) covers the levels and the MOM functions, including maintenance operations management, in more depth.

| Hop | Common choice | Why |
|---|---|---|
| Sensor to gateway | Vendor wireless protocol, IO-Link, wired analog or digital | Optimized for battery life and the sensor type |
| Machine controller to edge | OPC UA client-server, Modbus TCP, native PLC drivers | Access to tags, states and context |
| Edge to broker or platform | MQTT (with Sparkplug B or a defined JSON schema), OPC UA PubSub | Lightweight, outbound connection, decoupled consumers |
| Platform to CMMS/EAM | REST API, integration platform, vendor connector | Work orders, asset master data, failure codes |

### Layer 4: data platform

Whether the platform is an on-premises historian, a cloud service or both, three properties decide whether it supports maintenance:

1. **Asset-centric data model.** Every time series belongs to an asset with a stable ID that matches the CMMS asset number. Without that mapping, you cannot join a vibration trend with the work order history.
2. **Context alongside condition.** Machine state (running, idle, changeover, stopped), speed, load, product and recipe are stored with the same timestamps. Most false alarms in PdM come from operating changes the model did not know about.
3. **Retention that matches failure cycles.** If the failure mode you care about occurs every 18 months, deleting raw history after 90 days throws away the training data you will want later. Keep features long, raw data selectively.

For a Microsoft-based platform (Azure IoT Operations, Microsoft Fabric, Azure Machine Learning), our guide to [Azure for manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/) maps each layer to the current services and their status. The architecture in this article is vendor-neutral on purpose: the same layers apply to AWS, Siemens, PTC, Rockwell, open-source stacks or a historian with an analytics add-on.

### Layer 5: action and the CMMS

This is where most predictive maintenance programs stall. A model can detect a developing fault, but the value only appears when someone plans and executes the right repair at the right time.

A minimum closed loop looks like this:

1. **Alert with context:** asset, measured value and trend, suspected failure mode, recommended check, urgency (for example "within 7 days").
2. **Triage by a person:** a reliability engineer or trained technician confirms or rejects the alert. Rejected alerts are coded (false alarm, process change, sensor fault) and fed back.
3. **Work order in the CMMS:** created with the right priority and failure mode, ideally automatically from the confirmed alert.
4. **Planning and scheduling:** parts, labor, permits, lockout, and a slot in a planned stop.
5. **Execution and as-found feedback:** what the technician found (photo, failure code, condition of the removed part).
6. **Closing the loop:** the as-found result labels the event for future analysis and confirms or corrects the alert limit.

Steps 2 and 6 are what turn a monitoring system into a learning system. They are also the steps most often skipped.

## Data requirements: what you need before any model

The sister guide on [Azure for manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/) puts it bluntly: many predictive maintenance pilots fail because the model comes before the data. Here is the checklist we use; each item has a test you can run in a day.

| Requirement | Why it matters | Quick test |
|---|---|---|
| Clean asset register | Sensor data must map to the CMMS asset | Pick 20 critical assets: does each have one unique ID used in CMMS, historian and on the nameplate tag? |
| Failure history with failure modes | Supervised models and threshold validation need examples | For the top 10 assets, how many work orders in the last 3 years have a usable failure code and a free-text description that says what broke? |
| Synchronized timestamps | Events in different systems must line up | Compare a known stop in the PLC log, the MES and the CMMS: are they within a minute? |
| Operating context | Separates process changes from degradation | Can you tell from data alone whether the machine was running, at what speed and on which product at any given minute? |
| Adequate sampling | The signal must contain the failure signature | Does the sampling rate cover the defect frequencies you calculated? Does the reporting interval fit the P-F interval? |
| Sensor health and calibration | A drifting, loose or dead sensor looks like a machine problem, or hides one | Is there a check for flat-lined, out-of-range or noisy signals, a record of mounting and calibration, and a rule for what happens after a sensor is replaced? |
| Baseline period | Defines "normal" | Do you have 2 to 4 weeks of data in all normal operating states (a range used in several practitioner guides in the current search results; adjust to your product mix)? |
| Defined response | Without an action, a prediction is trivia | Is there a named owner and a lead time for each alert type? |

### Failure codes: the hidden bottleneck

Most CMMS failure fields are either empty, filled with "other" or "repaired", or so fine-grained that no two technicians use them the same way. ISO 14224:2016 provides a common basis for collecting reliability and maintenance data in the petroleum, petrochemical and natural gas industries, with shared terminology and standardized failure modes [20]. Its structure is a useful template outside those industries too. You do not need to adopt all of it. A practical starting point:

- **Failure mode:** what the asset failed to do (fails to start, high vibration, leak, overheating, low output).
- **Failure mechanism:** the physical process (fatigue, wear, corrosion, overheating, contamination, looseness).
- **Component:** what part failed (drive-end bearing, mechanical seal, coupling, winding).
- **Cause category:** lubrication, installation, operation, design, material, unknown.

Keep each list short enough to fit on a tablet screen, make the field mandatory on corrective work orders, and review a sample of codes in the weekly maintenance meeting. Good codes are the training data of your future models and the basis of every Pareto chart in [root cause analysis](https://www.m365.fm/en/learn/six-sigma-root-cause-analysis/) (planned).

### How much failure data is enough?

There is no universal number. Two practical observations help set expectations:

- **Rare failures are the norm.** A well-maintained critical pump may fail once every few years. Ten identical pumps over five years may still produce only a handful of failures of one mode. That is too few to train a reliable supervised classifier for that one fleet.
- **Pooling helps.** Similar assets across lines and plants, the machine builder's fleet data, and published benchmark datasets (for example NASA's turbofan degradation simulation data, C-MAPSS) can support method development, but a model trained elsewhere must be validated on your machines and operating conditions [21].

When failure examples are scarce, start with methods that do not need them: physics-based limits from standards, rules from experience, and anomaly detection that learns "normal" instead of "failure".

## Machine learning for predictive maintenance: anomaly detection and RUL

Machine learning (ML) in predictive maintenance answers four different questions. Mixing them up is a frequent reason for disappointing pilots.

| Question | Method family | Needs failure labels? | Output |
|---|---|---|---|
| Is this asset behaving differently from normal? | Anomaly detection (statistical limits, PCA and Hotelling's T², isolation forest, one-class models, autoencoders) | No, only data from normal operation | Anomaly score, alert |
| What is wrong? | Diagnosis (classification) | Yes, examples per fault type, or expert rules | Fault class, for example "outer race defect" |
| Will it fail within the next N days? | Failure prediction (binary classification) | Yes, failures with timestamps | Probability of failure in a time window |
| How long until it reaches a limit? | Prognosis, remaining useful life (RUL) | Yes, degradation trajectories, or a physical model | Time or cycles remaining, ideally with an uncertainty range |

For an overview of the machine learning methods researchers have applied, see the systematic literature review of machine learning methods applied to predictive maintenance by Carvalho and colleagues (2019) [22]. A NIST review of diagnostic and prognostic capabilities in manufacturing describes prognostics and health management as an emerging field in which much prior work was exploratory or narrow, and concludes that such systems benefit from open architectures, cost-benefit analysis, verification and validation of methods, and industry standards [23].

### Step 1: rules and statistics

Before any model, set rule-based alerts on the signals you trust:

- **Absolute limits** from standards or the machine builder (for example, vibration zones per ISO 20816 for the machine class).
- **Relative limits** against the asset's own baseline. A common practice is to alert when a value exceeds the baseline mean by a multiple of its standard deviation, or when it doubles compared with the baseline, set per operating state.
- **Rate-of-change rules:** a slow, steady rise is often more informative than a single high reading.

These rules are transparent, cheap and easy for technicians to trust. They also create the first labeled events once triage and as-found feedback are in place.

### Step 2: anomaly detection

Anomaly detection learns what normal looks like across several signals at once and flags combinations that do not fit. It is the natural next step because it does not need failure examples. Its weaknesses are just as clear:

- **It detects change, not failure.** A new product, a new operator setting or a sensor that slipped will all trigger alarms.
- **"Normal" must be clean.** If the training period already contains a developing fault, the model learns the fault as normal.
- **It needs context.** Train separately per operating state, or include speed, load and product as inputs.

### Step 3: failure prediction and RUL

With enough labeled failures, you can train models that estimate the probability of failure in a window (for example, "will this pump fail in the next 14 days?") or the remaining useful life. RUL methods fall into three groups:

1. **Physics-based models** describe damage growth (for example, crack growth, wear rates). They extrapolate well but need engineering effort per failure mode.
2. **Data-driven models** learn degradation from history: regression on health indicators, survival models, Weibull analysis of failure times, recurrent neural networks such as LSTMs. They need many run-to-failure examples, which is why public benchmarks such as NASA's simulated turbofan dataset (C-MAPSS) are so popular in research: each engine in the training set runs from normal operation through a growing fault to failure [21].
3. **Hybrid models** combine a physical understanding of the degradation with data-driven calibration.

An RUL estimate without an uncertainty range is not useful for planning. "42 days" invites false confidence; "between 20 and 60 days with 80% probability" tells the planner to schedule the job in the next planned stop within three weeks.

### Weibull analysis: a statistical baseline everyone can use

The Weibull distribution is the standard tool for describing failure times. Its shape parameter β tells you what kind of failure behavior you face: with β < 1 the failure rate falls over time (early-life or infant mortality failures), with β = 1 it is constant (random failures; the Weibull reduces to the exponential model), and with β > 1 it rises (wear-out) [24]. That links directly back to the failure patterns: if bearing failures on a fleet of pumps show β ≈ 1, a fixed replacement interval will not reduce them, and condition monitoring is the better tool.

The reliability function is R(t) = exp(−(t ÷ η)^β), where η is the characteristic life: the time by which about 63.2% of units have failed, because F(η) = 1 − e^(−1). The NIST/SEMATECH e-Handbook of Statistical Methods writes the same function with γ for the shape and α for the characteristic life [24].

**Worked example.** For a fleet of gearbox bearings, a Weibull fit gives β = 2.0 and η = 30,000 operating hours (illustrative values).

- Probability of surviving 10,000 h: R = exp(−(10,000 ÷ 30,000)²) = exp(−0.111) = **0.895**, so about 10.5% fail before 10,000 h.
- Probability of surviving 20,000 h: R = exp(−(0.667)²) = exp(−0.444) = **0.641**, so about 36% fail before 20,000 h.

With β = 2, failures increase with age, so a time-based replacement could work, but replacing at 10,000 h means throwing away about 90% of bearings that would have run longer. Condition monitoring lets you run most of them longer and catch the 10% early. This is the typical economic argument for PdM on wear-out failures with a detectable P-F interval.

### Evaluating a model the way a plant manager would

Accuracy is the wrong metric. Failures are rare, so a model that always says "no failure" can be 99% accurate and useless. Use these instead:

- **Recall (detection rate):** share of actual failures that were flagged early enough to act.
- **Precision:** share of alerts that turned out to be real problems.
- **Lead time:** how many days before failure the alert came; compare with the time you need to act.
- **Cost-weighted result:** value of caught failures minus cost of false alarms and of missed failures.

**Worked example: precision, recall and cost.** A model monitors 50 pumps for 12 months. Six real failures occur. The model raises 14 alerts. Five of them precede real failures with at least 7 days of warning; nine are false alarms.

- Recall = 5 ÷ 6 = **83%**
- Precision = 5 ÷ 14 = **36%**

A precision of 36% sounds poor. But assume an unplanned pump failure costs $40,000 (downtime, collateral damage, expedited parts), a planned repair $6,000, and a false-alarm check (two hours of a technician plus a quick vibration reading) $300 (all assumptions for this example).

- Value of caught failures: 5 × ($40,000 − $6,000) = **$170,000**
- Cost of false alarms: 9 × $300 = **$2,700**
- Cost of the missed failure: it would have happened anyway, so it is not an added cost of the model, but it remains a loss of $40,000.

When checks are cheap and failures expensive, a lower alert threshold (more alerts, lower precision, higher recall) is economically right. When every alert means stopping a line, precision matters far more. Set thresholds with finance and operations, not by the data scientist alone.

### Model drift and maintenance of the models

Machines, products and sensors change. A model that worked last year can degrade without anyone noticing. Minimum practices:

- Log every alert and its triage result; track precision and recall per month.
- Retrain or recalibrate after major changes (overhaul, new product family, sensor replacement).
- Keep a simple fallback rule running in parallel, so that a broken model does not mean no monitoring.
- Version models and alert limits like any other controlled document; quality teams with AS9100 or IATF 16949 systems will expect this.

### Generative AI and copilots

Large language model assistants are increasingly offered for maintenance: summarizing work order history, suggesting likely causes, drafting procedures, answering questions about manuals. They can save time on documentation and search. They do not replace signal analysis, and their suggestions must be checked against the equipment documentation and your own procedures, especially where safety-relevant work such as lockout/tagout is involved. Treat AI-generated repair advice like advice from a new colleague: useful, but verified before it is acted on.

## Benefits and the evidence behind them

The benefits of predictive maintenance are real, but the numbers quoted for them vary widely and are often recycled without a source. This section separates what independent US sources show from what vendors and consultancies claim.

### What US government sources show

**NIST survey analysis (2020).** Douglas Thomas and Brian Weiss of NIST analyzed a survey of US manufacturing establishments and estimated that machinery maintenance spending in 2016 was $57.3 billion for the covered manufacturing industries (NAICS 321 to 339, excluding 324 and 325), and that losses due to preventable maintenance issues reached $119.1 billion, mostly from lost sales [4]. Comparing establishments:

- Plants in the top 25% for reliance on reactive maintenance reported about **3.3 times more downtime** (13.0% vs. 4.0% of planned production time), about **16 times more defects** (3.3% vs. 0.2%) and about **4.9 times larger inventory increases** due to maintenance issues than those in the bottom 25% [4].
- Among establishments with less than 50% reactive maintenance, those in the top half for predictive maintenance reported **15% less downtime, an 87% lower defect rate and 66% less inventory increase** [4].
- NIST notes that many of these differences are **not statistically significant** and should be treated as anecdotal evidence [4].

That caveat is rarely repeated when vendors cite "87% fewer defects". Read the NIST findings as a strong correlation between maintenance maturity and plant performance, not as a promise of what sensors will do.

**DOE O&M guide.** The DOE guide's figures (8% to 12% savings of predictive over preventive; survey averages of 25% to 30% lower maintenance cost, 70% to 75% fewer breakdowns, 35% to 45% less downtime, 20% to 25% more production, ROI of 10 times) are discussed above; they come from unnamed surveys [2].

### What vendors and consultancies claim

Many top-ranking pages quote ranges such as "18% to 31% lower maintenance cost", "10:1 ROI" or "500% to 1,000% ROI". In our review of the November 2026 search results, these figures were either unsourced, sourced to the vendor's own customer data without a method, or traced back to the DOE list. Deloitte's 2022 perspective on predictive maintenance, for example, presents benefit ranges as "internal Deloitte analysis derived from work with clients" [25]. Such figures can be honest, but they are selected from successful projects and describe a consultancy's clients, not the average plant. Label them as vendor or consultancy claims, and build your business case from your own data.

### The benefits that hold up in practice

| Benefit | Mechanism | How to measure it in your plant |
|---|---|---|
| Fewer unplanned stops | Developing failures are repaired in planned windows | Unplanned downtime hours on monitored assets, before vs. after |
| Lower repair cost per event | Planned repairs avoid collateral damage, overtime and expedited freight | Average cost of corrective vs. planned work orders for the same failure mode |
| Less unnecessary preventive work | Time-based tasks on condition-monitored assets can be extended or dropped | PM hours per asset, PM tasks retired or extended |
| Better spare parts planning | Lead time is known in advance | Emergency purchase orders, critical spares stock |
| Safety | Fewer catastrophic failures and less emergency work under time pressure | Incidents and near misses linked to equipment failure, emergency work orders |
| Energy | Leaks, misalignment, fouling and poor lubrication waste power | Compressed air leak survey results, kWh per unit on monitored systems |
| Quality | Worn spindles, bearings and tools affect product quality before they fail | Scrap and rework linked to equipment condition |

## ROI of predictive maintenance: a worked example

The ROI case for predictive maintenance is decided by four numbers: how many relevant failures you have, what each one costs, what share of them you can catch early enough, and what the program costs to run. Here is a complete example. All values are assumptions for illustration; replace them with your own.

### The situation

A packaging plant runs a bottleneck line. Twelve critical rotating assets on that line (motors, gearboxes, fans, vacuum pumps) are candidates for continuous monitoring.

| Baseline input | Value |
|---|---|
| Unplanned failures per year on the 12 assets (from CMMS, last 3 years average) | 9 |
| Average downtime of the bottleneck per unplanned failure | 6 hours |
| Contribution margin lost per bottleneck hour (finance) | $4,500 |
| Average cost of an unplanned repair (parts, expedited freight, overtime, collateral damage) | $12,000 |
| Average cost of the same repair when planned | $5,000 |
| Downtime when the repair is planned into a scheduled stop | 1.5 hours |

**Why contribution margin and not revenue:** an hour lost on the bottleneck loses the margin on the units not produced, provided they cannot be made up with overtime. If they can be made up, the cost is the overtime premium, not the margin. Agree this with the plant controller before the first presentation; it is the number most likely to be challenged.

### The program costs

| Cost item | Type | Value |
|---|---|---|
| 24 wireless vibration and temperature sensors at $800 (two per asset) | One-time | $19,200 |
| 3 gateways at $2,500 | One-time | $7,500 |
| Installation and commissioning, 120 hours at $120 | One-time | $14,400 |
| CMMS integration (alert to work order, feedback) | One-time | $10,000 |
| Training for technicians and the reliability engineer | One-time | $6,000 |
| **Total one-time** | | **$57,100** |
| Software subscription, 24 sensors at $25 per month | Annual | $7,200 |
| Analyst time, 0.15 FTE at $110,000 fully loaded | Annual | $16,500 |
| Batteries and replacement sensors | Annual | $1,500 |
| False-alarm checks, 20 per year at $300 | Annual | $6,000 |
| IT hosting and security operations share | Annual | $3,000 |
| **Total annual** | | **$34,200** |

Sensor and subscription prices vary widely by vendor, data volume and contract; the figures above are placeholders, not market prices.

### The benefit at a 60% detection rate

Assume the program detects 60% of the failures early enough to plan the repair.

- Failures caught: 9 × 0.6 = **5.4 per year**
- Downtime avoided: 5.4 × (6 − 1.5) h × $4,500 = **$109,350**
- Repair cost avoided: 5.4 × ($12,000 − $5,000) = **$37,800**
- Preventive tasks extended or dropped on monitored assets: **$8,000**
- **Gross annual benefit: $155,150**
- **Net annual benefit:** $155,150 − $34,200 = **$120,950**
- **Simple payback:** $57,100 ÷ $120,950 = 0.47 years, about **5.7 months**
- **Three-year NPV at 10%:** $120,950 × 2.487 (annuity factor) − $57,100 = **$243,685** (assumptions: benefits and running costs constant and at year end, no residual value of sensors, before tax, no ramp-up; a realistic first year with a ramp-up lowers the result)

### Sensitivity: when the case collapses

| Scenario | Detection rate | Margin per hour | Net annual benefit | Payback | 3-year NPV at 10% |
|---|---|---|---|---|---|
| Base case | 60% | $4,500 | $120,950 | 5.7 months | $243,685 |
| Lower detection | 30% | $4,500 | $47,375 | 14.5 months | $60,715 |
| Lower detection, lower margin | 30% | $2,000 | $17,000 | 40 months | −$14,824 |
| Break-even detection | about 20% | $4,500 | $22,850 | 30 months | about $0 |
| Poor detection | 10% | $4,500 | −$1,675 | never | −$61,265 |

Three lessons from the table:

1. **Detection rate is the critical variable.** It depends on choosing failure modes that give warning, on sensor and sampling choices, and on a response process that acts in time. Technology alone does not set it.
2. **The bottleneck decides the value of downtime.** The same program on a non-bottleneck line with spare capacity might be worth a fraction of this, because lost hours can be recovered. Our [theory of constraints](https://www.m365.fm/en/learn/theory-of-constraints/) (planned) guide explains why an hour lost at the bottleneck is an hour lost for the whole plant.
3. **Operating cost matters more than sensor price.** Analyst time and subscriptions recur every year. A program that adds sensors without adding people to triage alerts tends to drift into ignored dashboards.

### Capex, opex and how finance will see it

- **Capital vs. expense.** Sensors and gateways may be capitalized or expensed depending on your capitalization threshold and policy; software subscriptions are usually operating expense. A program sold as "no capex" can still carry a larger total cost over five years. Compare total cost of ownership over the expected life, not only the first-year budget line.
- **Avoided cost is not booked cost.** Finance will not see "$109,350 avoided downtime" in the P&L. They will see higher output on the bottleneck, lower overtime and lower expedited freight. Agree in advance which accounts should move and track them.
- **Spare parts.** Better warning can justify lower stock of some critical spares, but be careful: predictive maintenance reduces surprise, not lead time. Keep insurance spares for long-lead items whose failure gives little warning.
- **Baseline first.** Without 6 to 12 months of measured baseline (failures, downtime, repair costs), the after-picture cannot prove anything. Start measuring before the sensors arrive.

## How to choose the pilot assets

A good pilot is small enough to manage, important enough to matter and has failure modes that predictive maintenance can actually catch. Four tests filter the candidates:

1. **Consequence:** does a failure stop the bottleneck, create a safety or environmental risk, or cause expensive collateral damage?
2. **Frequency:** has the asset class failed often enough in the last few years that you will see results within 12 months? (Pooling similar assets helps.)
3. **Detectability:** does the dominant failure mode have a known precursor that your chosen technique measures, with a P-F interval longer than your response time?
4. **Actionability:** can you plan the repair? Are parts available, is there a planned stop, is there a person who owns the alert?

### Criticality scoring worked example

Score each candidate from 1 to 5 on consequence (C), likelihood of failure (L) and detectability with the planned technique (D), then multiply. Only assets that pass the actionability test are scored.

| Asset | Consequence C | Likelihood L | Detectability D | Score C × L × D | Decision |
|---|---|---|---|---|---|
| Main extruder gearbox | 5 | 3 | 5 (oil and vibration) | 75 | Pilot |
| Bottleneck vacuum pump | 5 | 4 | 4 (vibration, temperature) | 80 | Pilot |
| Cooling tower fan | 3 | 3 | 5 (vibration) | 45 | Pilot if budget allows |
| Conveyor drive motors (20 identical) | 2 | 4 | 4 (vibration, MCSA) | 32 | Route-based monitoring |
| Hydraulic power unit, press | 4 | 2 | 3 (oil, pressure trend) | 24 | Oil analysis program |
| Packaging robot | 4 | 2 | 2 (failures mostly electronic, little warning) | 16 | Spares and fast repair, not PdM |

The robot example matters. It is critical, but its dominant failures give little measurable warning, so predictive maintenance is the wrong tool. A good pilot list says "no" to some critical assets.

### Pilot scope that works

- **10 to 30 assets** of one or two types, on one line or area, with one owner.
- **One or two techniques** that match the failure modes (often vibration plus temperature, or vibration plus oil).
- **A fixed duration** of 6 to 12 months, with a baseline measured before the start.
- **Explicit success criteria** agreed with operations and finance: for example "at least three confirmed early detections with planned repairs, false-alarm rate below one per asset per quarter, and documented triage for every alert".

## Implementation roadmap: from pilot to program

The roadmap below assumes a midsize plant (here: one site, a few hundred employees, a CMMS in place) starting from mostly preventive and reactive work. Durations are typical ranges, not promises.

| Phase | Duration | Main activities | Gate to the next phase |
|---|---|---|---|
| 0. Foundations | 1 to 3 months | Asset register cleanup for critical assets, criticality ranking, failure code list, baseline KPIs (unplanned downtime, MTBF, MTTR, PM compliance, reactive share), define alert-to-work-order process | Baseline measured, pilot assets selected, owner named |
| 1. Pilot | 6 to 12 months | Install sensors or start routes, connect context data, set rule-based alerts, triage every alert, record as-found results | Success criteria met or clear lessons why not; finance agrees on benefit accounting |
| 2. Standardize | 3 to 6 months | Write the alert-response standard work, train technicians, integrate alerts into CMMS automatically, adjust PM tasks on monitored assets | Process works without the project team watching it |
| 3. Scale | 12 to 24 months | Extend to further asset classes and lines, add techniques (oil, ultrasound, MCSA), build a reliability team or contract a service, add anomaly detection where rules saturate | Coverage targets met, false-alarm rate stable, KPI trend positive |
| 4. Optimize | Ongoing | Failure prediction and RUL for asset types with enough history, link to production scheduling, fleet comparison across plants | Models validated against as-found results, retraining routine in place |

### Phase 0 in detail: the work nobody wants to do

- **Asset hierarchy:** site, area, line, asset, component, using the same IDs in CMMS, historian and IIoT platform. If you plan a unified namespace, the hierarchy is its backbone.
- **Criticality ranking:** a one-page method agreed by operations, maintenance, EHS and quality. Rank the top 10% to 20% of assets first.
- **Failure codes:** short lists for failure mode, mechanism, component and cause (see the data section).
- **Baseline:** pull the last 12 to 36 months of work orders and downtime events for the pilot candidates. If the data is poor, measure forward for at least a few months before starting.
- **Response process:** who receives alerts, by when they triage, how a confirmed alert becomes a scheduled job. Write it as [standard work](https://www.m365.fm/en/learn/shop-floor-management/standard-work/) (planned) for the maintenance team and review it in the daily maintenance meeting.

### Build, buy or service

| Option | Fits when | Watch out for |
|---|---|---|
| Vendor platform with sensors and analytics (subscription) | Fast start, limited in-house data skills, common rotating equipment | Data ownership and export, lock-in, per-sensor pricing at scale |
| Condition monitoring service (analysts from a provider) | Few in-house analysts, need certified diagnosis quickly | Response times, report quality, knowledge staying with the provider |
| Own platform on existing IT/OT stack (historian, cloud, open source) | Strong data team, many plants, need for one data model | Long build time, talent retention, maintaining the edge fleet |
| Machine builder's remote monitoring | New machines with OEM connectivity | Data access for your own analytics, cybersecurity terms in the contract |

Most plants combine options: vendor sensors and analytics for the pilot, an OEM service for a few complex machines, and their own data platform as the integration layer once several plants are involved.

## Maintenance KPIs: MTBF, MTTR, PM compliance and PdM-specific metrics

Measure the program by its effect on operations and maintenance work, not by model accuracy. The Society for Maintenance & Reliability Professionals (SMRP), a US-based not-for-profit society formed by practitioners, publishes best practices, metrics and guidelines for maintenance and reliability; if your company uses them, align your definitions with SMRP's wording [26]. Our [manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/) guide covers MTBF, MTTR and availability alongside OEE; the definitions here are kept consistent with it.

### Core reliability KPIs

> **MTBF (mean time between failures) = operating time ÷ number of failures**
> **MTTR (mean time to repair) = total repair time ÷ number of repairs**
> **Inherent availability = MTBF ÷ (MTBF + MTTR)**

**Worked example.** The 12 pilot assets ran a combined 96,000 operating hours in the baseline year with 9 failures and 72 hours of total repair time.

- MTBF = 96,000 ÷ 9 = **10,667 hours**
- MTTR = 72 ÷ 9 = **8.0 hours**
- Inherent availability = 10,667 ÷ (10,667 + 8.0) = **99.93%** per asset

In the first pilot year, 4 functional failures occur on the same operating time, and 5 developing faults are caught and repaired as planned work.

- MTBF (functional failures) = 96,000 ÷ 4 = **24,000 hours**

Be explicit about what counts as a failure. If planned repairs triggered by PdM were counted as failures, MTBF would look unchanged even though downtime fell sharply. Report both: functional failures, and PdM-detected interventions.

### Maintenance process KPIs

| KPI | Formula | Why it matters for PdM |
|---|---|---|
| PM compliance | PM work orders completed within the scheduled window ÷ PM work orders due, in the period | A PdM program on top of a broken PM program fails; get basic care under control first |
| Planned maintenance percentage | Planned maintenance hours ÷ total maintenance hours | Should rise as PdM turns breakdowns into planned work |
| Reactive (emergency) work share | Emergency work hours ÷ total maintenance hours | Direct link to the NIST finding on reactive-heavy plants [4] |
| Schedule compliance | Scheduled work hours completed as planned ÷ scheduled hours | Shows whether planned jobs triggered by PdM actually get done |
| Maintenance cost per unit or as a share of asset replacement value | Total maintenance cost ÷ output, or ÷ estimated replacement value of the assets | Prevents "savings" in downtime being offset by higher service costs |
| Unplanned downtime on monitored assets | Hours of unplanned stops caused by monitored assets | The main outcome metric |

**Worked example: PM compliance.** In March, 240 PM work orders were due on the line. 204 were completed within the agreed window (for example due date plus or minus 10% of the interval or a fixed number of days; define the window once and keep it). PM compliance = 204 ÷ 240 = **85%**. Many maintenance leaders target 90% or more before adding predictive layers [unverified as a published benchmark; use as an internal target only].

### PdM-specific KPIs

| KPI | Formula | Target direction |
|---|---|---|
| Coverage | Critical assets under condition monitoring ÷ critical assets | Up, to the planned scope |
| Detection lead time | Days between first alert and functional failure (or planned repair) | Longer than the time needed to plan |
| Alert precision | Confirmed alerts ÷ all alerts | Up, without losing recall |
| Detection rate (recall) | Failures preceded by a timely alert ÷ all failures of monitored failure modes | Up |
| Alert response time | Time from alert to triage decision | Within the agreed limit (for example 1 shift for high priority) |
| Work generated by PdM | Work orders originating from condition findings ÷ all corrective work orders | Up |
| As-found feedback rate | PdM work orders with recorded as-found condition ÷ PdM work orders | Close to 100% |

Put three to five of these on the maintenance team's daily or weekly board. For how such boards work, see [shop floor management](https://www.m365.fm/en/learn/shop-floor-management/).

## People, skills and safety

### Roles

| Role | Responsibility in a PdM program |
|---|---|
| Maintenance manager | Owns the program, the response process and the KPIs |
| Reliability engineer | Criticality, failure modes, technique selection, alert limits, root cause analysis of repeat failures |
| Condition monitoring analyst (in-house or service) | Data review, diagnosis, recommendations |
| Planner and scheduler | Converts confirmed findings into scheduled work with parts and permits |
| Technicians | Install and check sensors, execute repairs, record as-found condition |
| Operators | Report abnormal noise, heat, smell and leaks; basic care (autonomous maintenance) |
| OT/IT engineer | Connectivity, data platform, security, integration with CMMS |
| Data scientist (later phases) | Anomaly detection and prognostic models, validation, drift monitoring |

### Skills and certification

Vibration analysis has an international personnel certification framework in ISO 18436-2. In the US, the Vibration Institute certifies vibration analysts in four categories (I to IV) with a body of knowledge compliant with ISO 18436-2; its program was accredited by the American National Standards Institute in March 2010 and is now accredited by ANAB to ISO/IEC 17024 [27]. Comparable schemes exist for other techniques such as thermography, oil analysis and ultrasound. Certification does not replace experience on your machines, but it gives a common language and a way to check service providers. For a small plant, one certified analyst plus trained technicians who can collect good data and act on findings is a realistic first team.

### The operator and technician view

Predictive maintenance changes daily work. Technicians spend less time on emergency repairs and more on planned work and data checks; some experienced technicians worry that sensors replace their judgment. In practice, their knowledge of how a machine sounds, smells and behaves is what makes alerts credible. Involve them in sensor placement, alert triage and failure coding from the start. Where a union represents the maintenance workforce, discuss in advance how alert data will be used: for scheduling work, or also for evaluating individuals. Programs that use condition data to blame people lose the honest feedback they depend on.

Operators remain an important early warning. The autonomous maintenance step of [TPM](https://www.m365.fm/en/learn/tpm-oee/) (planned) trains them to detect abnormalities during daily checks; their observations are often the earliest available warning for failure modes that no installed sensor covers.

### Safety during installation and repairs

Mounting a sensor on a running machine, opening an electrical panel for a current transformer or taking an oil sample from a pressurized system are hazardous tasks. In the US, servicing and maintenance work that could expose workers to unexpected energization or start-up of machines falls under OSHA's lockout/tagout standard, 29 CFR 1910.147 [28]. Decide per task whether it can be done safely while the machine runs (with guards and procedures in place) or requires energy isolation, and write that into the installation work instructions. Wireless sensors, MCC-based current monitoring and remote data collection can reduce how often people need to approach running equipment, which is a safety benefit to count in the business case.

## Common mistakes

1. **Starting with the technology.** Buying sensors before defining failure modes, owners and the response process. The result is a dashboard nobody uses.
2. **Monitoring assets that do not need it.** Critical but warning-free failure modes, or cheap redundant assets. Use the four pilot tests.
3. **No baseline.** Without measured downtime, failures and costs before the start, the program cannot prove its value, and the next budget round becomes a debate about beliefs.
4. **Ignoring operating context.** Alerts on every product change or speed change destroy trust within weeks.
5. **Alert fatigue.** Too many low-value alerts, sent to too many people. Start with few, high-confidence alerts and a clear triage owner.
6. **No feedback loop.** As-found results not recorded, so limits and models never improve.
7. **Skipping basic care.** Lubrication, alignment, balancing and cleanliness problems detected again and again. Fix the causes (proactive maintenance) instead of predicting the same failure every quarter.
8. **Treating PdM as an IT project.** IT and OT build the pipeline; maintenance and operations own the outcome. Put the maintenance manager in charge.
9. **Pilot purgatory.** A pilot that succeeds technically but never gets a scaling plan, budget or standard. Define the scaling decision and its criteria before the pilot starts.
10. **Security as an afterthought.** Gateways with default passwords and direct internet connections on the plant network. See the security section.
11. **Overpromising ML.** Promising RUL predictions in the first year on assets with three recorded failures.
12. **Counting avoided costs that finance does not accept.** Agree the benefit accounting with the controller before the pilot.

## Limits: when predictive maintenance does not pay

Predictive maintenance is the right tool for a specific set of failure modes, not for every asset. It does not pay, or pays poorly, when:

- **The failure gives no warning.** Many electronic failures, some fatigue fractures and failures caused by sudden overloads have P-F intervals of seconds or none at all. Here, redundancy, spares and design changes help; prediction does not.
- **The P-F interval is shorter than your response time.** If you need three weeks to get a gearbox but the defect develops from detectable to failure in five days, you can only stop the machine earlier, not plan the repair. That still has value (avoiding collateral damage), but the economics are different.
- **Failures are cheap and non-critical.** Run-to-failure with spares on the shelf is cheaper.
- **The asset runs too intermittently or in too many states** for a stable baseline, and context data is not available.
- **The organization cannot act.** Without planning, scheduling and spare parts management, early warnings become late repairs.
- **Data is too sparse for the promised method.** Supervised failure prediction needs many examples of the failure mode; for rare events, physics and expert rules outperform data-driven models.

There are also limits to the evidence. Controlled studies that compare similar plants with and without predictive maintenance are rare; most published results are case studies, vendor reports or surveys with self-reported data. The NIST analysis is one of the few independent US data sets, and even it reports correlations, many of them not statistically significant [4].

## Security note: IIoT and OT cybersecurity

Every IIoT sensor gateway, edge device and cloud connection is a new path into the operational technology (OT) network. Predictive maintenance projects often add these paths quickly, under a maintenance budget, sometimes installed by a vendor with remote access. That is exactly the kind of change OT security frameworks warn about.

NIST SP 800-82 Rev. 3, *Guide to Operational Technology (OT) Security* (September 2023), describes typical OT system topologies, common threats and vulnerabilities, and recommended security countermeasures, while accounting for the performance, reliability and safety requirements of OT [29]. The ISA/IEC 62443 series defines requirements and processes for securing industrial automation and control systems throughout their lifecycle, based on shared responsibility among asset owners, automation product suppliers, integrators and service suppliers [30].

Minimum rules for a predictive maintenance project:

- **Segment.** Put IIoT gateways and edge devices in a defined zone, not on the flat control network. Data should leave the OT network through a controlled conduit (for example a DMZ or broker), with outbound-only connections where possible.
- **Read-only by default.** Condition monitoring needs to read data, rarely to write to controllers. Configure OPC UA and PLC access as read-only unless a documented use case requires more.
- **Authenticate devices and encrypt traffic.** Use OPC UA security modes with certificates and MQTT over TLS with per-device credentials; change default passwords.
- **Control vendor remote access.** No permanent VPNs or remote desktop tools installed by a sensor vendor on the plant network without review, logging and time limits.
- **Include IIoT in the asset inventory and patch process.** Gateways and sensors have firmware that needs updates.
- **Check contracts.** Who owns the data, where it is stored, how vulnerabilities are reported and fixed, and what happens to data and devices when the contract ends.

For a full treatment of zones, conduits, security levels and how to run an OT security program, see our planned guide to [OT cybersecurity and ISA/IEC 62443](https://www.m365.fm/en/learn/ot-cybersecurity-iec-62443/) (planned).

## Where PdM fits: TPM, MES, digital twins and the cloud

Predictive maintenance is one part of a larger maintenance and operations system. Four connections matter most.

- **TPM and OEE.** Total productive maintenance gives the organizational frame: autonomous maintenance by operators, planned maintenance by the maintenance team, focused improvement on chronic losses. PdM strengthens the planned maintenance pillar; OEE availability losses show where it pays. See [TPM and OEE](https://www.m365.fm/en/learn/tpm-oee/) (planned) and the [TPM entity page](https://www.m365.fm/entity/total-productive-maintenance/). The broader principles are in [lean manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/).
- **MES and ISA-95.** Machine states, downtime reasons and production context typically live in the MES. Linking condition data with MES states and orders removes many false alarms and lets you schedule repairs around production. See [MES and ISA-95](https://www.m365.fm/en/learn/mes-isa-95/) (planned).
- **Production scheduling.** A predicted failure is a capacity constraint with a date. Feeding planned maintenance windows into the production schedule avoids conflicts between maintenance and production. See [production scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/).
- **Digital twins.** Condition monitoring and prognostics work at the asset level; a production digital twin can take a predicted outage as a scenario and show which orders are affected and when a maintenance window does least harm. Our [digital twin in manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/) guide treats the two as separate disciplines that benefit from each other, and this article follows the same line.
- **Cloud platforms.** For a Microsoft-based stack, the [Azure for manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/) guide maps the IIoT layers to current services; the m365.fm episode [Predictive Maintenance on Azure: What You Actually Need Before the Model](https://www.m365.fm/show/episodes/predictive-maintenance-on-azure-for-manufacturers-what-you-actually-need-before-the-model/) goes deeper on data readiness.

Predictive maintenance also belongs in the plant's improvement system. Repeat findings (the same misalignment, the same contamination) are signals for [root cause analysis](https://www.m365.fm/en/learn/six-sigma-root-cause-analysis/) (planned), and maintenance performance is one of the pillars of [operational excellence](https://www.m365.fm/en/learn/operational-excellence/).

## Glossary

| Term | Meaning |
|---|---|
| Anomaly detection | Methods that learn normal behavior and flag deviations, without needing failure examples |
| As-found condition | What the technician actually finds when opening or removing a component; the ground truth for alerts |
| BPFO / BPFI / FTF / BSF | Characteristic bearing defect frequencies: ball pass frequency outer race, inner race, fundamental train (cage) frequency, ball spin frequency |
| CBM (condition-based maintenance) | Maintenance triggered when a measured condition crosses a limit |
| CMMS / EAM | Computerized maintenance management system / enterprise asset management; where work orders, assets and history live |
| Criticality ranking | Structured scoring of assets by the consequence and likelihood of failure |
| Edge computing | Processing data near the machine (gateway, industrial PC) before sending it on |
| Envelope analysis | Vibration technique that demodulates high-frequency impacts to reveal early bearing and gear defects |
| ESA / MCSA | Electrical signature analysis / motor current signature analysis; diagnosis from motor supply current and voltage |
| FFT | Fast Fourier transform; converts a time signal into its frequency spectrum |
| Functional failure (F) | The point at which an asset can no longer perform its required function |
| IIoT | Industrial internet of things: connected sensors, devices and software in industrial settings |
| ISO 13374 | ISO series on data processing, communication and presentation for condition monitoring and diagnostics |
| ISO 17359 | General guidelines for setting up a condition monitoring program |
| ISO 20816 | Measurement and evaluation of machine vibration (successor series to ISO 10816) |
| MQTT | Lightweight publish/subscribe messaging protocol, an OASIS standard |
| MTBF / MTTR | Mean time between failures / mean time to repair |
| Net P-F interval | P-F interval minus the inspection interval: the warning you can actually count on |
| OPC UA | Platform-independent, service-oriented architecture for secure industrial data exchange with information modeling |
| P-F curve / P-F interval | Curve of condition over time from detectable potential failure (P) to functional failure (F); the time between them |
| PdM (predictive maintenance) | Maintenance timed by measured condition plus a forecast of its development |
| PM compliance | Share of due preventive maintenance work orders completed within the agreed window |
| Precision / recall | Share of alerts that were real / share of real failures that were alerted in time |
| Prescriptive maintenance | Maintenance in which the system also recommends the action and its timing |
| RCM (reliability-centered maintenance) | Structured method for selecting the right maintenance task per failure mode based on its consequences |
| RUL (remaining useful life) | Estimated time or cycles until an asset reaches a defined failure limit |
| Sparkplug | Eclipse specification that adds industrial conventions, including device state management, on top of MQTT |
| Unified namespace (UNS) | Architecture pattern in which systems publish and consume data in one shared, hierarchical topic structure |
| Weibull distribution | Statistical distribution for failure times; its shape parameter shows early-life, random or wear-out behavior |

## FAQ: predictive maintenance and IIoT

### What is predictive maintenance in simple terms?

Predictive maintenance means fixing a machine when measurements show it is starting to fail, before it actually breaks. Sensors or regular inspections track signals such as vibration, temperature and oil condition; when the trend shows a developing problem, the repair is planned into the next convenient stop.

### How does predictive maintenance work?

In five steps. Sensors or route measurements capture a signal that changes as a failure develops, such as vibration, temperature, oil condition or motor current. An edge device or the data platform compares it with a baseline and alert limits, adds production context and trends it. When a trend crosses a limit, an analyst or a model diagnoses the likely failure mode and estimates how much time is left. The finding becomes a planned work order in the CMMS, scheduled into the next convenient stop. The as-found result is fed back to improve limits and models (sections 5 and 6).

### What is the difference between predictive and preventive maintenance?

Preventive maintenance is scheduled by time or usage (every 3 months, every 5,000 hours), whether the part needs it or not. Predictive maintenance is scheduled by the measured condition of the part. Preventive maintenance is simpler and fits age-related wear; predictive maintenance fits failure modes that give measurable warning and are expensive when they happen unplanned.

### What is the difference between predictive and condition-based maintenance?

Condition-based maintenance triggers a task when a measured value crosses a limit, for example "overall vibration above alert level: inspect within seven days." Predictive maintenance adds a forecast of how fast the condition will get worse, so the repair can be planned for a specific stop. Many plants use the two terms as synonyms; in practice predictive maintenance is condition-based maintenance plus trending plus a prognosis (section 1).

### What are the four types of maintenance?

The most common grouping is reactive (run to failure), preventive (time- or usage-based), predictive or condition-based (based on measured condition), and prescriptive (the system also recommends the action). Reliability-centered maintenance is not a fifth type but a method for choosing among them per failure mode.

### What is IIoT, and how does it relate to predictive maintenance?

The industrial internet of things is the network of connected sensors, machines, gateways and software in industrial operations. It makes predictive maintenance affordable at scale by reducing the cost of each measurement point, moving data with standard protocols such as OPC UA and MQTT, and linking condition data to production context and maintenance systems.

### What are examples of predictive maintenance?

Typical examples: vibration sensors that detect a developing bearing defect on a fan motor weeks before failure; thermographic surveys that find a loose connection in a switchgear panel; oil analysis that shows rising iron and silicon in a gearbox, pointing to wear from contamination; ultrasound that finds compressed air leaks and under-lubricated bearings; motor current analysis that detects broken rotor bars on a submersible pump.

### What techniques are used in predictive maintenance?

The main techniques are vibration analysis, infrared thermography, oil and wear particle analysis, ultrasound, motor current and electrical signature analysis, and performance trending from process data. The DOE's O&M best practices guide covers the same technique families [3].

### What is the P-F curve?

The P-F curve shows how an asset's condition declines from the point where a developing failure first becomes detectable (P, potential failure) to the point where it can no longer perform its function (F, functional failure). The time between the two is the P-F interval. Inspections must happen more often than the P-F interval, and the remaining warning must be long enough to plan the repair.

### How much does predictive maintenance save?

It depends on your failures, their cost and how many you catch. The DOE guide cites 8% to 12% savings of predictive over preventive maintenance and survey averages of 25% to 30% lower maintenance cost, but does not name the surveys [2]. A NIST analysis found that plants with more predictive maintenance reported less downtime and fewer defects, while warning that many differences were not statistically significant [4]. Build your own case with a worked ROI like the one in this guide.

### What is the ROI of predictive maintenance?

In the worked example in this guide, a 12-asset pilot costing $57,100 one-time and $34,200 a year pays back in about six months if it catches 60% of failures on a bottleneck line, and breaks even over three years at about a 20% detection rate. Vendor claims of 10:1 ROI or more describe selected successes, not the average.

### How do I start a predictive maintenance program?

Start with a criticality ranking and a baseline of failures and downtime, pick 10 to 30 assets with failure modes that give warning, choose one or two matching techniques, define who acts on alerts and how alerts become work orders, and run a 6- to 12-month pilot with success criteria agreed with operations and finance.

### What are the challenges of predictive maintenance?

The hard parts are rarely the sensors. Common problems are missing failure codes and maintenance history, no baseline to prove savings, alerts that ignore operating context and cause alert fatigue, no owner who acts on the alerts, pilots that never get a scaling plan, gateways added without security, and machine learning promised on assets with only a handful of recorded failures. Some failure modes also give too little warning to predict at all (sections 15 and 16).

### Do I need machine learning for predictive maintenance?

Not at the start. Rule-based limits and trends on well-chosen signals catch many developing failures. Anomaly detection helps when there are too many signals to watch manually. Failure prediction and remaining useful life models need labeled failure history, which most plants must first build up.

### What data do I need for predictive maintenance?

A clean asset register mapped across systems, condition signals at a sampling rate that fits the failure mode, synchronized timestamps, sensor health checks, operating context (state, speed, load, product), a baseline period of normal operation, and a failure history with usable failure codes. The last item is often the bottleneck.

### What is remaining useful life (RUL)?

RUL is the estimated time or number of cycles until an asset reaches a defined failure limit. It can be estimated from physical damage models, data-driven models trained on degradation histories, or a combination. A useful RUL estimate includes an uncertainty range.

### Which sensors are used for predictive maintenance?

Accelerometers for vibration, temperature sensors and thermal cameras, ultrasonic sensors, current transformers for motor current, oil quality and particle sensors, and process sensors such as pressure and flow. Many signals already exist in drives and PLCs.

### Is OPC UA or MQTT better for IIoT?

They solve different problems and are often combined. OPC UA offers rich information models and security for access to machine data, typically at the machine and edge. MQTT is a lightweight publish/subscribe transport suited to moving data from many edge devices to a broker or cloud. Many architectures read via OPC UA at the machine and publish via MQTT upstream.

### Can predictive maintenance work on older machines?

Yes. Retrofitting wireless vibration and temperature sensors, current transformers in the MCC or route-based measurements works on machines of any age. The limits are mounting access, safe installation, and the availability of context data from older controllers.

### Is predictive maintenance a cybersecurity risk?

It can be. Each gateway, sensor network and cloud connection adds a path into the plant network. Segment IIoT devices, keep access read-only, authenticate and encrypt connections, control vendor remote access and follow NIST SP 800-82 Rev. 3 and ISA/IEC 62443 [29][30].

### What is the difference between predictive maintenance and a digital twin?

Predictive maintenance monitors and forecasts the condition of individual assets. A digital twin is a broader virtual representation of an asset, process or plant. A production twin can use predicted outages as scenarios, but most predictive maintenance needs no twin.

## Conclusion and first steps

Predictive maintenance is a simple idea with demanding execution: measure the right signal on the right asset, notice the change early enough, and turn it into a planned repair. IIoT has made the measurement cheaper and the data easier to connect. It has not changed the physics of failure, the need for good failure data, or the fact that value appears only when a person plans and does the work.

The evidence supports the direction more than the headline numbers. The DOE guide and the NIST survey analysis both link mature maintenance with lower downtime and costs, but neither gives you a number to put in your budget without your own baseline. The worked ROI example shows what decides the business case: detection rate, the value of a bottleneck hour, and recurring program costs.

Start with fewer assets than you think, measure before you install, and invest as much in the alert-to-work-order process as in sensors and models.

**Your first steps in the next 30 days**

- [ ] Pull 24 to 36 months of corrective work orders and downtime events for your bottleneck line and make a Pareto of failures by asset and failure mode
- [ ] Rank the top assets by consequence, likelihood and detectability using the scoring table in this guide
- [ ] For the top five, write down the dominant failure mode, its likely precursor, the technique that detects it and your estimated P-F interval
- [ ] Calculate your current MTBF, MTTR, PM compliance and reactive work share as the baseline
- [ ] Agree with the plant controller how downtime and avoided repair costs will be valued
- [ ] Draft the alert response process: who triages, within what time, how alerts become CMMS work orders, how as-found results are recorded
- [ ] Ask OT/IT how sensor gateways would connect to the network under your security rules before you request vendor quotes
- [ ] Involve two experienced technicians in choosing sensor locations and alert priorities

---

## Further reading on m365.fm

**Episodes and posts**
- [Predictive Maintenance on Azure: What You Actually Need Before the Model](https://www.m365.fm/show/episodes/predictive-maintenance-on-azure-for-manufacturers-what-you-actually-need-before-the-model/) (episode)
- [Device Twin vs Azure Digital Twins: Choosing the Right Layer for Industrial IoT](https://www.m365.fm/community/u/mirko-p/blog/device-twin-vs-azure-digital-twins/)
- [Digital Twins on Azure](https://www.m365.fm/show/episodes/digital-twins-on-azure/) (episode)

**Glossary terms (entities)**
[Total productive maintenance](https://www.m365.fm/entity/total-productive-maintenance/) · [Key performance indicator](https://www.m365.fm/entity/key-performance-indicator/) · [Digital twin](https://www.m365.fm/entity/digital-twin/) · [Industry 4.0](https://www.m365.fm/entity/industry-4-0/) · [Theory of constraints](https://www.m365.fm/entity/theory-of-constraints/) · [Shop floor management](https://www.m365.fm/entity/shop-floor-management/)

**Sister guides (planned)**
- [TPM and OEE](https://www.m365.fm/en/learn/tpm-oee/) (planned)
- [Azure for Manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/) (planned)
- [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/) (planned)
- [MES and ISA-95](https://www.m365.fm/en/learn/mes-isa-95/) (planned)
- [OT Cybersecurity and ISA/IEC 62443](https://www.m365.fm/en/learn/ot-cybersecurity-iec-62443/) (planned)
- [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/) (planned)
- [Theory of Constraints](https://www.m365.fm/en/learn/theory-of-constraints/) (planned)
- [Six Sigma and Root Cause Analysis](https://www.m365.fm/en/learn/six-sigma-root-cause-analysis/) (planned)
- [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) (planned)
- [Production Scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/) (planned)
- [Shop Floor Management and Gemba Walks](https://www.m365.fm/en/learn/shop-floor-management/) (planned)
- [Standard Work](https://www.m365.fm/en/learn/shop-floor-management/standard-work/) (planned cluster)
- [Operational Excellence](https://www.m365.fm/en/learn/operational-excellence/) (planned)
- [Aerospace Production Planning](https://www.m365.fm/en/learn/aerospace-production-planning/) (planned)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** is the host of m365.fm and works at iFAKT GmbH. On m365.fm he writes about manufacturing operations, maintenance and the digital transformation of production, with a focus on how plants connect shop floor data, analytics and the Microsoft cloud in practice. [Editor: add role, short bio and photo.]

**Note: The author works at iFAKT GmbH.**

# Sources

All sources accessed November 20, 2026, and opened and checked on that date. Competitor pages from the competitive analysis are not listed unless cited in the text.

1. ISO 17359:2018, Condition monitoring and diagnostics of machines: General guidelines (edition 3, January 2018; reviewed and confirmed 2023). International Organization for Standardization. https://www.iso.org/standard/71194.html
2. Sullivan, G. P.; Pugh, R.; Melendez, A. P.; Hunt, W. D.: Operations & Maintenance Best Practices: A Guide to Achieving Operational Efficiency, Release 2.0 (December 2002), PNNL-13890, Chapter 5 (pp. 5.1 to 5.4) and Chapter 2 (p. 2.1). Pacific Northwest National Laboratory for the US Department of Energy, Federal Energy Management Program. https://www.pnnl.gov/main/publications/external/technical_reports/PNNL-13890.pdf
3. Sullivan, G. P. et al.: Operations & Maintenance Best Practices: A Guide to Achieving Operational Efficiency, Release 3.0 (August 2010), Chapter 6 "Predictive Maintenance Technologies" (table of contents). US Department of Energy, Federal Energy Management Program. https://www.energy.gov/sites/default/files/2020/04/f74/omguide_complete_w-eo-disclaimer.pdf (landing page: https://www.energy.gov/eere/femp/articles/operations-and-maintenance-best-practices-guide-achieving-operational-efficiency)
4. Thomas, D. S.; Weiss, B. A.: Economics of Manufacturing Machinery Maintenance: A Survey and Analysis of U.S. Costs and Benefits. NIST Advanced Manufacturing Series 100-34 (June 2020), p. 1 and Tables 7.2 and 7.3. National Institute of Standards and Technology. https://doi.org/10.6028/NIST.AMS.100-34
5. ISO 13381-1:2015, Condition monitoring and diagnostics of machines: Prognostics, Part 1: General guidelines (edition 2; shown as withdrawn, December 2021). International Organization for Standardization. https://www.iso.org/standard/51436.html
6. OPC Unified Architecture (OPC UA): overview. OPC Foundation. https://opcfoundation.org/about/opc-technologies/opc-ua/
7. MQTT: The Standard for IoT Messaging. mqtt.org. https://mqtt.org/
8. Operations & Maintenance Best Practices: A Guide to Achieving Operational Efficiency, Release 3.0, report PNNL-19634, OSTI ID 1220381. US DOE Office of Scientific and Technical Information. https://www.osti.gov/biblio/1220381
9. Nowlan, F. S.; Heap, H. F.: Reliability-Centered Maintenance (December 29, 1978), report AD-A066579, United Airlines for the Office of the Assistant Secretary of Defense (Manpower, Reserve Affairs and Logistics), Exhibit 2.13. Defense Technical Information Center. https://apps.dtic.mil/sti/pdfs/ADA066579.pdf
10. Reliability-centered maintenance (history, Nowlan and Heap 1978, SAE JA1011 1998, Moubray 1997). Wikipedia. https://en.wikipedia.org/wiki/Reliability-centered_maintenance
11. ISO 20816-1:2016, Mechanical vibration: Measurement and evaluation of machine vibration, Part 1: General guidelines (edition 1; confirmed 2021). International Organization for Standardization. https://www.iso.org/standard/63180.html
12. ISO 20816-3:2022, Mechanical vibration: Measurement and evaluation of machine vibration, Part 3: Industrial machinery with a power rating above 15 kW and operating speeds between 120 r/min and 30 000 r/min (edition 1, October 2022). International Organization for Standardization. https://www.iso.org/standard/78311.html
13. ISO 10816-3:2009 (withdrawn; revised by ISO 20816-3:2022). International Organization for Standardization. https://www.iso.org/standard/50528.html
14. NFPA 70B (Standard for Electrical Equipment Maintenance; changed from a recommended practice to a standard with the 2023 edition). Wikipedia. https://en.wikipedia.org/wiki/NFPA_70B
15. Predictive maintenance (techniques incl. vibration, ultrasonic, infrared, oil analysis, motor current signature analysis). Wikipedia. https://en.wikipedia.org/wiki/Predictive_maintenance
16. ISO 13374-1:2003, Condition monitoring and diagnostics of machines: Data processing, communication and presentation, Part 1: General guidelines (reviewed and confirmed 2025). International Organization for Standardization. https://www.iso.org/standard/21832.html
17. MIMOSA OSA-CBM (Open System Architecture for Condition-Based Maintenance). MIMOSA. https://www.mimosa.org/mimosa-osa-cbm/
18. Eclipse Sparkplug (specification version 3.0). Eclipse Foundation. https://sparkplug.eclipse.org/
19. ISA-95 Standard: Enterprise-Control System Integration (also ANSI/ISA-95, IEC 62264). International Society of Automation. https://www.isa.org/standards-and-publications/isa-standards/isa-95-standard
20. ISO 14224:2016, Petroleum, petrochemical and natural gas industries: Collection and exchange of reliability and maintenance data for equipment (edition 3; confirmed 2022). International Organization for Standardization. https://www.iso.org/standard/64076.html
21. CMAPSS Jet Engine Simulated Data (reference: Saxena, A.; Goebel, K.; Simon, D.; Eklund, N.: Damage Propagation Modeling for Aircraft Engine Run-to-Failure Simulation, PHM08, Denver, CO, October 2008). NASA Open Data Portal. https://data.nasa.gov/dataset/cmapss-jet-engine-simulated-data
22. Carvalho, T. P.; Soares, F. A. A. M. N.; Vita, R.; Francisco, R. da P.; Basto, J. P.; Alcalá, S. G. S.: A systematic literature review of machine learning methods applied to predictive maintenance. Computers & Industrial Engineering, Vol. 137 (2019), 106024. https://doi.org/10.1016/j.cie.2019.106024
23. Vogl, G. W.; Weiss, B. A.; Helu, M. M.: A review of diagnostic and prognostic capabilities and best practices for manufacturing. Journal of Intelligent Manufacturing (published online June 9, 2016). National Institute of Standards and Technology. https://doi.org/10.1007/s10845-016-1228-8 (record: https://www.nist.gov/publications/review-diagnostic-and-prognostic-capabilities-and-best-practices-manufacturing)
24. NIST/SEMATECH e-Handbook of Statistical Methods, section 8.1.6.2: Weibull. National Institute of Standards and Technology. https://www.itl.nist.gov/div898/handbook/apr/section1/apr162.htm
25. Predictive Maintenance: Deloitte's Perspective (2022). Deloitte. https://www.deloitte.com/content/dam/Deloitte/us/Documents/process-and-operations/us-predictive-maintenance.pdf
26. Society for Maintenance & Reliability Professionals (SMRP): home page (Best Practices, Metrics & Guidelines; SMRPCO certification). SMRP. https://smrp.org/
27. Certification (vibration analyst Categories I to IV; body of knowledge compliant with ISO 18436-2; ANSI accreditation March 2010, now ANAB to ISO/IEC 17024). Vibration Institute. https://www.vi-institute.org/certification/
28. 29 CFR 1910.147, The control of hazardous energy (lockout/tagout), paragraph (a)(1)(i). Occupational Safety and Health Administration, US Department of Labor. https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.147
29. Stouffer, K. et al.: Guide to Operational Technology (OT) Security. NIST Special Publication 800-82 Rev. 3 (September 2023). National Institute of Standards and Technology. https://doi.org/10.6028/NIST.SP.800-82r3 (https://csrc.nist.gov/pubs/sp/800/82/r3/final)
30. ISA/IEC 62443 Series of Standards. International Society of Automation. https://www.isa.org/standards-and-publications/isa-standards/isa-iec-62443-series-of-standards
31. ISO/DIS 13381-1, Condition monitoring and diagnostics of machines: Prognostics, Part 1: General guidelines (edition 3, stage 40.20 DIS ballot; will replace ISO 13381-1:2015). International Organization for Standardization. https://inen.isolutions.iso.org/standard/88029.html (accessed November 20, 2026)
32. The Six Failure Patterns: Nowlan and Heap Explained. Reliable (reliamag.com), September 1, 2026, modified October 13, 2026 (secondary source; cites Exhibit 2.13 of AD-A066579). https://reliamag.com/topics/guides/six-failure-patterns-nowlan-heap (accessed November 20, 2026)
33. Nelson, C.: Determining Shock and Arc Flash Boundaries When Performing Thermography on Energized Electrical Equipment. JM Test Systems, February 3, 2023, modified September 10, 2025 (secondary source on NFPA 70E). https://jmtest.com/keeping-your-distance-determining-shock-and-arc-flash-boundaries-when-performing-thermography-on-energized-electrical-equipment/ (accessed November 20, 2026)
34. ISO 4406:2021, Hydraulic fluid power: Fluids: Method for coding the level of contamination by solid particles (fourth edition, replaces ISO 4406:2017), sample pages. iTeh Standards. https://standards.iteh.ai/catalog/standards/iso/69d30c38-931a-4124-8779-f91ae1bda063/iso-4406-2021 (accessed November 20, 2026)
35. Bearing Fault Frequencies: BPFO, BPFI, BSF, and FTF (glossary; vendor source). Tractian. https://tractian.com/en/glossary/bearing-fault-frequencies (accessed November 20, 2026)
36. Jones, B.: Vibrations help find faulty components. SKF Evolution, September 15, 1999. https://evolution.skf.com/us/vibrations-help-find-faulty-components-3/ (accessed November 20, 2026)
37. Hajnayeb, S.; Hoseintabar Marzebali, M.; Abolghasemi, V.; Faiz, J.: Broken Rotor Bar Fault Detection of Induction Machine Based on Rectified Orthogonal Axes of Stator Current. Accepted manuscript (IEEE Transactions on Instrumentation and Measurement, per repository file name; year and DOI not shown), University of Essex repository. https://repository.essex.ac.uk/39130/1/Accepted-TIM.pdf (accessed November 20, 2026)

# Editorial notes

**1. Vendor and consultancy claims (labeled in the text)**

- Benefit ranges on competitor pages ("18% to 31% lower maintenance cost", "10:1 ROI", "500% to 1,000%+ ROI", "87.3% fewer defects") are not repeated as facts. The article names their likely origin (DOE survey list, NIST survey analysis) or labels them as vendor or consultancy claims.
- Deloitte's 2022 benefit ranges are cited only to show their basis ("internal Deloitte analysis derived from work with clients"); the extracted PDF text did not allow matching each range to its metric, so no Deloitte percentage appears in the article.
- All cost figures in the ROI example (sensor $800, gateway $2,500, $25 per sensor per month, $4,500 margin per hour, repair costs) are labeled assumptions, not market prices.

**2. Unverified items (marked [unverified] in the text or listed here; updated in the verification pass of November 20, 2026)**

1. Split of failure patterns D, E and F (7%, 14%, 68%): A (4%), A+B (6%) and C (5%) now confirmed via a secondary source citing Exhibit 2.13 [32]; check D to F in the DTIC scan by eye or cite Moubray's RCM II.
2. "Inspect at no more than half the P-F interval": practitioner convention, no standard found.
3. PM compliance target of 90%: marked as an internal target, not a published benchmark.
4. OPC UA as IEC 62541: removed from the text; add back with a source if the editor wants the IEC number.
5. DOE Release 3.0 wording of the Chapter 5 percentages (see source note; not re-read in round 4).
6. Practical figures stated as assumptions (sensor prices, battery life, P-F interval of 8 weeks for the example fan) are illustrative, not sourced.
7. ISO 20816 as "successor series to ISO 10816" (glossary): iso.org confirms only 20816-3:2022 revising 10816-3:2009 [13]; the ISO 20816-1 page (re-opened November 20, 2026) does not name 10816-1.

Closed in round 4: rotor bar sidebands [37], bearing defect frequency formulas [35][36], ISO 4406 thresholds [34], NFPA 70E for thermography [33], ISO 13381-1 successor edition [31].

**3. Source notes**

- The DOE O&M guide figures are quoted from Release 2.0 (PNNL-13890, December 2002), which was fetched and read in full for Chapter 5. Release 3.0 (August 2010) was fetched as well, but the tool could only read its front matter and part of Chapter 3, so the Chapter 5 percentages were not re-read in Release 3.0. Release 3.0 is cited only for its title, date, authors and the list of technologies in Chapter 6 (table of contents). Before publication, check that the Release 3.0 wording of the percentages matches; if it differs, cite Release 3.0's wording.
- ISO 13381-1:2015 (prognostics) is shown on iso.org as withdrawn (December 2021). Round 4 found the successor ISO/DIS 13381-1 (edition 3, DIS ballot) [31]; the text now says so. Update to the published edition once it appears.
- ISO 20816-1 and 20816-3 were verified on iso.org; the statement that they replaced the ISO 10816 series is stated in the text as general practice and is listed under unverified items because the iso.org pages fetched did not state the replacement.
- Wikipedia is cited for the RCM history (Nowlan and Heap 1978, SAE JA1011, Moubray) and NFPA 70B's change to a standard. Replace with the primary documents (DTIC report AD-A066579, SAE JA1011, NFPA) before publication if the editor prefers primary sources; the DTIC page could not be fetched in this session.
- The peer-reviewed reviews: Carvalho et al. (metadata verified via the Crossref record of the DOI) and Vogl, Weiss and Helu (NIST publication record) are cited for general statements only. Lei et al. (2018, Mechanical Systems and Signal Processing) was dropped because its record could not be fetched in this session.

**4. Internal links (body text, absolute URLs)**

Existing pillars linked in the body: manufacturing-it-azure (4×), digital-twin-manufacturing, manufacturing-kpis, production-scheduling-aps, shop-floor-management, lean-manufacturing, operational-excellence, aerospace-production-planning. New pillars linked in the body (planned): tpm-oee (4×), mes-isa-95 (2×), ot-cybersecurity-iec-62443, theory-of-constraints, six-sigma-root-cause-analysis (2×). Planned cluster: shop-floor-management/standard-work (URL scheme per the course brief, an assumption). Episode: predictive-maintenance-on-azure-for-manufacturers-what-you-actually-need-before-the-model. Entity: total-productive-maintenance. All "(planned)" markers to be activated after publication.

**5. Cannibalization notes**

- **manufacturing-it-azure:** That pillar has a "Use case 1: Predictive maintenance on Azure" section and ranks for "predictive maintenance Azure". This pillar owns the vendor-neutral, broad keywords ("predictive maintenance", "IIoT predictive maintenance", techniques, P-F curve, ROI) and links to the Azure pillar for the Microsoft service mapping. The strategy table here deliberately uses the same five-way split (reactive, preventive, condition-based, predictive, prescriptive) so the two pages do not contradict each other. Recommendation: in the final consistency check, add a link from the Azure pillar's PdM section ("Keep the terms apart") to this pillar with the anchor "predictive maintenance".
- **digital-twin-manufacturing:** Section 7.8 states that PdM and production twins are separate disciplines; this pillar repeats that line and links back. No overlap in target keywords.
- **tpm-oee (planned):** TPM, autonomous maintenance, the six big losses and OEE calculation belong there. This pillar mentions TPM only as the organizational frame and links four times. Avoid adding OEE formulas here.
- **manufacturing-kpis:** MTBF/MTTR formulas match that pillar's definitions (run time ÷ failures; repair time ÷ failures; inherent availability). This pillar adds maintenance-process and PdM-specific KPIs that the KPI pillar does not cover.
- **ot-cybersecurity-iec-62443 (planned):** This pillar keeps security to a short note with project rules; zones, conduits, security levels and program design belong to the OT security pillar.

**6. Schema (JSON-LD)**

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "Predictive Maintenance and IIoT: Techniques, Architecture, ROI, and How to Start",
      "description": "Predictive maintenance and IIoT explained: P-F curve, vibration, oil, thermography, sensor-to-CMMS architecture, ML and RUL, a worked ROI and KPIs.",
      "inLanguage": "en-US",
      "datePublished": "2026-11-20",
      "dateModified": "2026-11-20",
      "mainEntityOfPage": "https://www.m365.fm/en/learn/predictive-maintenance-iiot/",
      "author": {"@type": "Person", "name": "Mirko Peters", "url": "https://www.m365.fm/entity/mirko-peters/"},
      "publisher": {"@type": "Organization", "name": "m365.fm", "url": "https://www.m365.fm/"},
      "about": [
        {"@type": "Thing", "name": "Predictive maintenance"},
        {"@type": "Thing", "name": "Industrial internet of things"},
        {"@type": "Thing", "name": "Condition monitoring"}
      ]
    },
    {
      "@type": "FAQPage",
      "inLanguage": "en-US",
      "mainEntity": [
        {"@type": "Question", "name": "What is predictive maintenance in simple terms?", "acceptedAnswer": {"@type": "Answer", "text": "Predictive maintenance means fixing a machine when measurements show it is starting to fail, before it actually breaks. Sensors or regular inspections track signals such as vibration, temperature and oil condition; when the trend shows a developing problem, the repair is planned into the next convenient stop."}},
        {"@type": "Question", "name": "What is the difference between predictive and preventive maintenance?", "acceptedAnswer": {"@type": "Answer", "text": "Preventive maintenance is scheduled by time or usage, whether the part needs it or not. Predictive maintenance is scheduled by the measured condition of the part. Preventive maintenance fits age-related wear; predictive maintenance fits failure modes that give measurable warning and are expensive when they happen unplanned."}},
        {"@type": "Question", "name": "What is the P-F curve?", "acceptedAnswer": {"@type": "Answer", "text": "The P-F curve shows how an asset's condition declines from the point where a developing failure first becomes detectable (P, potential failure) to the point where it can no longer perform its function (F, functional failure). The time between the two is the P-F interval."}},
        {"@type": "Question", "name": "What is IIoT, and how does it relate to predictive maintenance?", "acceptedAnswer": {"@type": "Answer", "text": "The industrial internet of things is the network of connected sensors, machines, gateways and software in industrial operations. It makes predictive maintenance affordable at scale by lowering the cost of each measurement point, moving data with standard protocols such as OPC UA and MQTT, and linking condition data to production context and maintenance systems."}},
        {"@type": "Question", "name": "Do I need machine learning for predictive maintenance?", "acceptedAnswer": {"@type": "Answer", "text": "Not at the start. Rule-based limits and trends on well-chosen signals catch many developing failures. Anomaly detection helps when there are too many signals to watch manually. Failure prediction and remaining useful life models need labeled failure history."}},
        {"@type": "Question", "name": "How does predictive maintenance work?", "acceptedAnswer": {"@type": "Answer", "text": "In five steps. Sensors or route measurements capture a signal that changes as a failure develops, such as vibration, temperature, oil condition or motor current. An edge device or the data platform compares it with a baseline and alert limits, adds production context and trends it. When a trend crosses a limit, an analyst or a model diagnoses the likely failure mode and estimates how much time is left. The finding becomes a planned work order in the CMMS, scheduled into the next convenient stop. The as-found result is fed back to improve limits and models (sections 5 and 6)."}},
        {"@type": "Question", "name": "What is the difference between predictive and condition-based maintenance?", "acceptedAnswer": {"@type": "Answer", "text": "Condition-based maintenance triggers a task when a measured value crosses a limit, for example \"overall vibration above alert level: inspect within seven days.\" Predictive maintenance adds a forecast of how fast the condition will get worse, so the repair can be planned for a specific stop. Many plants use the two terms as synonyms; in practice predictive maintenance is condition-based maintenance plus trending plus a prognosis (section 1)."}},
        {"@type": "Question", "name": "What are the challenges of predictive maintenance?", "acceptedAnswer": {"@type": "Answer", "text": "The hard parts are rarely the sensors. Common problems are missing failure codes and maintenance history, no baseline to prove savings, alerts that ignore operating context and cause alert fatigue, no owner who acts on the alerts, pilots that never get a scaling plan, gateways added without security, and machine learning promised on assets with only a handful of recorded failures. Some failure modes also give too little warning to predict at all (sections 15 and 16)."}}
      ]
    }
  ]
}
```

Self-referencing canonical: `https://www.m365.fm/en/learn/predictive-maintenance-iiot/`. No hreflang (no German version). Breadcrumb suggestion: Home > Learn > Predictive Maintenance and IIoT.

**7. Recommended graphics**

1. P-F curve with P and F points for vibration, ultrasound, oil, thermography and audible noise, and the net P-F interval marked (section "How machines fail").
2. Five-layer IIoT architecture diagram from sensor to CMMS with protocol labels per hop (section "IIoT architecture").
3. Bearing spectrum sketch with BPFO and harmonics at 106.3 Hz, 212.7 Hz (illustrative).
4. ROI sensitivity chart: three-year NPV vs. detection rate (10% to 60%) for margins of $2,000 and $4,500 per hour.
5. Closed-loop diagram: alert, triage, work order, planning, execution, as-found feedback.
6. Criticality matrix (consequence × likelihood) with the six example assets.

**8. Disclosure and iFAKT**

No iFAKT product is mentioned in the article body; the topic offers no genuine fit for value stream software. The author box carries the required disclosure "Note: The author works at iFAKT GmbH." No sponsorship or paid-partnership label (iFAKT does not pay for publication). The disclosure satisfies the FTC's material-connection guidance.

**9. Course note**

Mirko builds the course structure himself; this article contains no course outline, only the content base.

## Review log

Expert-panel review per the course expansion brief, November 20, 2026, with nine roles: (1) practitioner (US plant manager / operations director, 20 years on the floor), (2) academic (industrial engineering / operations management professor), (3) IT/OT architect (MES, ISA-95, OT security), (4) quality lead (ASQ CQE, Six Sigma Black Belt, AS9100/IATF context), (5) finance (plant controller), (6) worker voice and lean coach, (7) SEO specialist (US), (8) fact checker (re-verifies every number, quote, standard and source online), (9) critic (fluff, AI tone, bias, iFAKT neutrality, padding). Starting point: complete first draft written directly in US English (no German source). Three full rounds, two optimization passes, plus a final check of the word count.

### Round 1: findings and verdicts

| Role | Verdict | Findings |
|---|---|---|
| 1. Practitioner | changes needed | Strategy table, P-F worked example and pilot tests match plant reality; the robot "no" example is exactly what vendors never say. Missing: guidance on when to use permanently installed sensors vs. walking routes, which is the first budget question in every plant. Wants concrete examples per asset type, not only per technique. |
| 2. Academic | changes needed | P-F and Weibull logic correct (recalculated: net P-F 3.7 weeks, margin 0.7 weeks; R(10,000 h) = 0.895, R(20,000 h) = 0.641; F(η) = 1 − e^(−1) = 0.632). Issues: (1) the "inspect at half the P-F interval" rule is presented as if standardized; (2) the six failure-pattern percentages need a primary source or a marker; (3) the Weibull notation should state that NIST writes γ/α; (4) the NIST review (Vogl et al.) was paraphrased more strongly than its abstract supports; (5) ISO 13374 block names should be attributed with care. |
| 3. IT/OT architect | changes needed | Five-layer model and the data-volume calculation (51.2 kB/s; 4.4 GB/day; 885 GB/day for 200 channels; 1.2 MB/day; 5.8 kB/day) are correct and useful. Missing: source timestamps and a plant time server at the edge; Sparkplug description overstated what the fetched page confirms; security bullets good but the NIST and ISA descriptions should match the documents' own scope statements. |
| 4. Quality lead | changes needed | Model versioning under AS9100/IATF is a good catch. Missing: the measurement system itself. A drifting or loose sensor creates false alerts or hides real ones; the data checklist needs a sensor-health and calibration line, comparable to MSA for gauges. |
| 5. Finance | changes needed | ROI model reconciles (recalculated: 5.4 failures caught; $109,350 + $37,800 + $8,000 = $155,150; net $120,950; payback 5.7 months; annuity factor 2.4869; NPV $243,685; break-even NPV near 20% detection: −$275). Contribution-margin note and "avoided cost is not booked cost" are right. Missing: explicit NPV assumptions (year-end flows, no residual value, pre-tax, no ramp-up). Keep capitalization language policy-neutral, no tax thresholds without a source. |
| 6. Worker voice and lean coach | changes needed | Union, data-use and LOTO paragraphs are the right tone. "Operators remain the first sensors" reads as reducing people to instruments; rephrase. Training cost is in the model, good. |
| 7. SEO specialist (US) | changes needed | Main keyword in H1, short answer, meta title, six H2s; IIoT in H1, meta and short answer. 18 FAQs mapped to PAA-style questions. Gaps: no dedicated block for "predictive vs preventive maintenance", the most frequent PAA and secondary query; "predictive maintenance examples" is answered only in the FAQ. Meta title 55 characters, description 147 (counted). |
| 8. Fact checker | changes needed | Re-verified online: DOE Release 2.0 Chapter 5 (12% to 18%, 8% to 12%, 30% to 40%, survey list, 55/31/12/2 mix, definition of PdM, wording slip "over predictive maintenance program", no named source); Release 3.0 title, date, authors, Chapter 6 technology list; OSTI record PNNL-19634; NIST AMS 100-34 ($57.3B, $119.1B, 3.3×/16×/4.9× with 13.0/4.0, 3.3/0.2, 6.7/1.4; 15%/87%/66%; "not statistically significant"); ISO 17359:2018, 13374-1:2003 (confirmed 2025), 20816-1:2016, 20816-3:2022 (>15 kW, 120 to 30,000 r/min), 13381-1:2015 (withdrawn 2021), 14224:2016; OPC Foundation (2008, PubSub, X.509); mqtt.org (OASIS, lightweight pub/sub); Sparkplug 3.0 birth/death certificates; ISA-95 levels and IEC 62264; ISA/IEC 62443 scope and stakeholders; NIST SP 800-82 Rev. 3 (September 2023, authors, DOI); OSHA 1910.147(a)(1)(i); NFPA 70B 2023 change to a standard; NASA C-MAPSS and Saxena et al. 2008; Vibration Institute categories and accreditation; SMRP self-description; NIST e-Handbook Weibull; Deloitte 2022 basis statement. Not yet verified at the end of round 1 (the shared web-fetch budget was exhausted for long stretches of the session): Nowlan and Heap percentages, the half-P-F rule, the PM compliance 90% target, the 2 to 4 weeks baseline, rotor bar sidebands, bearing formula source, ISO 20816 replacing ISO 10816, ISO 4406 particle sizes, IEC 62541 for OPC UA, NFPA 70E reference, the peer-reviewed reviews. During optimization 1, ISO 10816-3 withdrawal, the Nowlan and Heap 89% finding, Carvalho et al. metadata and the Vogl et al. record were verified; the 2 to 4 weeks baseline was re-attributed to the practitioner guides in the SERP (Tractian, Spartakus); the rest is marked. |
| 9. Critic | changes needed | No em-dash chains, no "delve" or "game-changer". Several "It is not X" openers in a row ("What predictive maintenance is not") read as a template. Two sentences carried claims without sources (DOE on compressed air leaks; SMRP "many US plants use"). No iFAKT mention in the body, which is correct for this topic; disclosure only in the author box. |

**Debates in round 1**

- *Benefit percentages in the key takeaways.* SEO wanted the headline ranges ("25% to 30% lower cost, 70% to 75% fewer breakdowns") in the short answer because competitors lead with them. The critic and fact checker objected that the DOE list cites unnamed surveys. Finance sided with the critic: a controller who sees these numbers in a business case will ask for the source. **Resolution:** keep the DOE figures in the key takeaways with the caveat in the same bullet; the short answer stays free of percentages.
- *NIST "87% lower defect rate".* The practitioner wanted it in the takeaways as the strongest US number. The academic insisted on NIST's own caveat. **Resolution:** the takeaways cite the 3.3× downtime finding with the "not statistically significant" caveat; the 87% figure appears only in the evidence section, next to the caveat.
- *Examples section.* SEO asked for a full H2 "Predictive maintenance examples" with company case studies; the critic called it padding unless the cases are documented, and the fact checker found no independent, sourced US case with figures in the reviewed pages. **Resolution:** an H3 table of examples by asset type (failure mode, precursor, technique, action), no unverified company stories.
- *ML depth.* The academic wanted LSTM and transformer architectures explained; the practitioner and worker voice said plant readers need "what question does the model answer" more than architectures. **Resolution:** keep the four-question table, the evaluation section and Weibull; architectures named, not explained.
- *Route vs. online.* The IT/OT architect proposed recommending online sensors as default "because the data model is cleaner"; the practitioner and finance pointed to cost per point on hundreds of small assets. **Resolution:** neutral comparison table plus the typical split (online on the top 10% to 20% by criticality, routes on the rest), stated as a common pattern, not a rule.

### Optimization 1: what changed (old -> new)

- Strategy section: no direct comparison block -> new H3 "Predictive vs. preventive maintenance at a glance" with a five-row comparison table.
- Techniques section: no guidance on deployment mode -> new H3 "Online sensors or route-based measurement?" with comparison table and the 10% to 20% pattern.
- Techniques section: examples only in FAQ -> new H3 "Predictive maintenance examples by asset type" (six assets).
- "What predictive maintenance is not": "It is not a sensor purchase. / It is not a replacement for basic care. / It is not always AI." -> "A sensor purchase alone. / A replacement for basic care. / Necessarily AI."
- P-F example: "A common reliability rule of thumb is to inspect at no more than half the P-F interval" -> same sentence plus "[unverified as a formal standard; it is a practitioner convention]".
- Failure patterns: percentages stated without marker -> "(often quoted as 4%, 2%, 5%, 7%, 14% and 68% for A to F) ... [unverified against the original 1978 report in this review]".
- Weibull: "β ≈ 1 a constant (random) failure rate" and "η is the characteristic life (the time by which about 63.2% of units have failed)" -> failure rate falling, constant (Weibull reduces to the exponential model) or rising by β, with F(η) = 1 − e^(−1) and the note that NIST writes γ for the shape and α for the characteristic life.
- ML section: "methods exist, but data, verification and validation practices, and standards lag behind [Vogl]" -> wording that follows the abstract (emerging field, exploratory or narrow prior work; benefits from open architectures, cost-benefit analysis, verification and validation, standards).
- ISO 13374: "often summarized as a chain of processing blocks" -> "defines six blocks of functionality ... MIMOSA OSA-CBM implements them ... The blocks are usually labeled ...".
- Sparkplug: "adds a topic structure, payload format and device state management" -> "(version 3.0) adds industrial conventions on top of MQTT, including state management through birth and death certificates".
- Edge: "time synchronization," -> "time synchronization (use the source timestamp of each value and a plant time server rather than the arrival time in the cloud),".
- Data checklist: new row "Sensor health and calibration" with a quick test.
- ROI: NPV line without assumptions -> NPV line with stated assumptions (year-end flows, no residual value, before tax, no ramp-up).
- Worker voice: "Operators remain the first sensors." -> "Operators remain an important early warning."
- Ultrasound: "the DOE has long pointed to compressed air leaks as a major source of wasted energy in industrial plants [DOE 3.0]" -> "the DOE O&M guide lists energy losses from steam, water and air leaks among the typical consequences of poor operations and maintenance [DOE 2.0]" (wording verified).
- KPIs: "SMRP publishes a body of standardized metrics that many US plants use as their definitions" -> "SMRP, a US-based not-for-profit society formed by practitioners, publishes best practices, metrics and guidelines ...; if your company uses them, align your definitions".
- Security: generic descriptions of NIST SP 800-82 and ISA/IEC 62443 -> descriptions that follow each document's own scope statement (topologies, threats, countermeasures; lifecycle requirements and shared responsibility of four stakeholder groups). "Zones and conduits" left to the planned OT security pillar.
- Skills: "certification schemes under the ISO 18436 series" -> Vibration Institute four categories, ISO 18436-2 body of knowledge, ANSI accreditation March 2010, now ANAB to ISO/IEC 17024 (US source added).
- MCSA: rotor bar sidebands stated as fact -> marked [unverified]; ESA sentence now cites only what the general reference supports.
- ISO 14224: "taxonomy ... that many other industries borrow" -> scope wording from iso.org plus "useful template outside those industries".
- Vibration: "These standards replaced the older ISO 10816 series" (unsourced) -> "ISO 20816-3:2022 revised ISO 10816-3:2009, which iso.org lists as withdrawn" (iso.org record fetched and cited).
- Failure patterns: added the verified finding from the 1978 report itself (Exhibit 2.13: 89% of items "cannot benefit from a limit on operating age"), with title-page details from the DTIC PDF; the six individual percentages stay [unverified].
- ML section: "Systematic reviews ... repeatedly point to data availability and validation ... as the limiting factors [Carvalho][Lei]" -> pointer to the Carvalho et al. review by title only (metadata verified via Crossref); Lei et al. (2018) removed because neither its record nor its abstract could be fetched.
- IIoT section: "OPC UA (IEC 62541)" -> "OPC UA" (the OPC Foundation page fetched does not name the IEC number; listed in editorial note 2).
- Bearing frequencies: citation to an unfetched source -> formulas labeled as standard kinematics with [source not verified in this review].
- Oil analysis: ISO 4406 particle sizes stated as fact -> marked [unverified]. Thermography: NFPA 70E reference marked [unverified].
- Competitive analysis: "Several pages ... quote NIST's 87%" -> the specific pages (Spartakus: DOE percentages as "reliability literature"; ifm: "87.3% fewer defects" without baseline) and the NIST caveat.

### Round 2: verdicts with spot fact check of the changes

| Role | Verdict | Findings |
|---|---|---|
| 1. Practitioner | satisfied | Route vs. online table answers the budget question; example table is what a maintenance manager would put on a slide. |
| 2. Academic | satisfied | Unverified markers are honest; Weibull notation and the Vogl paraphrase now match the sources. Suggests checking the ISO 13381-1 edition before publication (editorial note 3). |
| 3. IT/OT architect | satisfied | Time sync and Sparkplug corrected. Asks that the edge cost (gateways) stays in the ROI, which it does. |
| 4. Quality lead | changes needed | Sensor-health row good. The FAQ answer "What data do I need" does not mention sensor health, which the body now does; minor. |
| 5. Finance | satisfied | Assumptions stated; sensitivity table and break-even consistent with the text and the FAQ ($57,100 / $34,200, about six months, about 20%). |
| 6. Worker voice and lean coach | satisfied | Rephrasing accepted; technician involvement appears in the 30-day list. |
| 7. SEO specialist (US) | changes needed | New comparison table covers the top PAA. The H2 list in the table of contents is unchanged (new blocks are H3), fine. The key takeaways still say "five workhorse techniques" while the body lists six families including performance trending; align. |
| 8. Fact checker | changes needed | Spot-checked all changes against the fetched sources: DOE 2.0 leak wording (p. 2.1), Vibration Institute page, NIST e-Handbook, Vogl abstract, MIMOSA page, Sparkplug page, iso.org 14224. All match. One open issue: the meta description says "sensor-to-CMMS architecture", fine; but the FAQ "Which techniques" answer says DOE covers "this same set", while DOE lists "lubricant and wear particle analysis" and "motor analysis" under those names; acceptable, but say "the same families". |
| 9. Critic | satisfied | Template openers gone. Remaining "not" constructions are single and natural. No sponsorship language, no iFAKT in the body, disclosure exact in the author box. |

**Debate in round 2**

- *Five vs. six techniques.* SEO wanted "six" everywhere to match DOE's chapter. The practitioner argued that performance trending is not a dedicated technique with its own instrument and that readers search for the five named ones. **Resolution:** key takeaways keep "five workhorse techniques" for the instrument-based methods and add "plus performance trending from process data".

### Optimization 2: what changed (old -> new)

- Key takeaways: "The five workhorse techniques are vibration analysis, ... motor current or electrical signature analysis; most programs need two or three of them, not all five." -> "... motor current or electrical signature analysis, plus performance trending from process data you already have; most programs need two or three of them, not all."
- FAQ "What data do I need for predictive maintenance?": added "sensor health checks".
- FAQ "What techniques are used": "The DOE's O&M best practices guide covers this same set of technologies" -> "covers the same technique families".

### Round 3: final verdicts

| Role | Verdict |
|---|---|
| 1. Practitioner | satisfied |
| 2. Academic | satisfied |
| 3. IT/OT architect | satisfied |
| 4. Quality lead | satisfied |
| 5. Finance | satisfied |
| 6. Worker voice and lean coach | satisfied |
| 7. SEO specialist (US) | satisfied; word count and ratio rechecked after optimization 2 |
| 8. Fact checker | satisfied; every [n] in the text has a source entry, every source is cited; open [unverified] items listed in editorial note 2 |
| 9. Critic | satisfied |

**Consensus statement:** All nine roles release the article. Before publication: check the open [unverified] items in editorial note 2 (above all the Nowlan and Heap percentages and the Release 3.0 wording of the DOE figures), confirm the current edition of ISO 13381-1, replace Wikipedia citations with primary documents where the editor prefers, and activate the "(planned)" links once the target pages are live.

**Word count:** `wc -w` on H1 through the end of "Conclusion and first steps" (incl. tables, glossary and FAQ, excluding Further reading, author box, sources, notes and this log): **15,483 words**.

### Round 4: verification pass, November 20, 2026

Online checks by the fact checker (all accessed November 20, 2026):

- Failure pattern shares: [unverified] -> partly confirmed: A 4%, A+B 6%, C 5%, D to F "the bulk" (consistent with the report's 89%) via a secondary source citing Exhibit 2.13 [32]; D/E/F split (7/14/68) still unverified (DTIC scan not read by eye).
- NFPA 70E and thermography: [unverified] -> sourced to a thermography safety article that applies NFPA 70E approach boundaries, arc flash boundary and PPE to infrared work [33] (secondary source).
- ISO 4406 thresholds: [unverified] -> confirmed: 4 µm(c), 6 µm(c), 14 µm(c), fourth edition 2021 [34].
- Bearing defect frequency formulas: [source not verified] -> BPFO, BPFI and FTF match a vendor glossary [35]; SKF application note uses the same variables for BPFO [36]. Worked example values unchanged.
- MCSA rotor bar sidebands: [unverified] -> confirmed, (1 ± 2s) f_s, peer-reviewed accepted manuscript [37]; journal year and DOI still to add.
- ISO 13381-1: edition question -> corrected: 2015 edition withdrawn December 2021; ISO/DIS 13381-1 edition 3 under development [31]; sentence added.
- ISO 20816-1 vs. 10816-1: re-opened iso.org; page names no predecessor, so the glossary phrase stays listed as open (note 2, item 7).
- Half-P-F-interval rule, 90% PM compliance target, illustrative assumptions: still unverified (practitioner conventions by nature).
- DOE Release 3.0 wording and OPC UA = IEC 62541: not checked (fetch budget throttled at 1 call per 9 s); remain open.

Sign-off:
- **Fact checker:** satisfied; five items closed, one partly closed, one corrected; remaining items listed honestly in note 2.
- **Critic:** satisfied; new sentences are short and sourced, vendor glossary labeled as vendor source, no padding.
- **Subject expert (reliability engineer / academic):** satisfied; the (1 ± 2s) notation and the ISO 13381-1 status are the corrections that matter to practitioners.

**Word count after round 4:** 15,604 words (H1 to Conclusion, same method; +121).

### Round 5: SERP re-check and optimization, November 20, 2026

**Data source:** web (google.com US via web search; no NEURONwriter query exists for this article). Searches on November 20, 2026 for "predictive maintenance" and "IIoT predictive maintenance"; four ranking pages fetched (IBM, AWS, Databricks, control.com), completed November 23, 2026 after a tool quota pause. Details in the competitive analysis ("SERP re-check, November 20, 2026").

**SERP findings:** Wikipedia, IBM, SAP, NetSuite, Splunk, Databricks, Tractian and AWS lead the main query; control.com, Endress+Hauser, an arXiv paper and vendor pages lead the IIoT variant. IBM's page has grown to about 2,700 words; NetSuite (4,500 to 5,000) remains the longest. Recurring question headings not yet in our FAQ: how predictive maintenance works, predictive vs. condition-based maintenance, challenges. No new facts were needed.

**Changes (old -> new):**
1. FAQ: new "How does predictive maintenance work?" after "What is predictive maintenance in simple terms?" (restates the five-layer architecture and the CMMS feedback loop, sections 5 and 6).
2. FAQ: new "What is the difference between predictive and condition-based maintenance?" after the preventive question (restates section 1; same example limit).
3. FAQ: new "What are the challenges of predictive maintenance?" after "How do I start a predictive maintenance program?" (restates "Common mistakes" and "Limits", sections 15 and 16).
4. JSON-LD FAQPage in the editorial notes: the three new questions added.
5. Competitive analysis: "SERP re-check, November 20, 2026" table and findings added.
6. Metadata: word count 15,604 (recount with the same method today: 15,602) -> 15,871. Meta title and description unchanged (both lead with "predictive maintenance" and name IIoT).

**Sign-offs:**
- **SEO specialist (US):** satisfied; the three question headings that recur on IBM and AWS are now answered directly; headings and meta already carry both keywords.
- **Critic:** satisfied; short answers, no figures added, no vendor names.
- **Fact checker:** satisfied; each answer was checked against its body section; no new numbers or sources; SERP word counts are tool estimates.
- **Subject expert (reliability engineer):** satisfied; the CBM answer keeps the article's distinction (limit vs. forecast) and does not overstate it.

**Word count after round 5:** 15,871 words (H1 to Conclusion, `wc -w`, same method; +269 against the recount).
