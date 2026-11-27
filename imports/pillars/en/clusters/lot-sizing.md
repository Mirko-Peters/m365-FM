# SEO metadata

| Field | Value |
|---|---|
| Meta title | Lot Sizing in Manufacturing: EOQ, EPQ and MRP Rules (51 characters) |
| Meta description | Lot sizing explained with worked numbers: EOQ, EPQ, quantity discounts, lot-for-lot, Silver-Meal, Wagner-Whitin, capacity limits and a decision template. (153 characters) |
| Slug | `/en/learn/production-scheduling-aps/lot-sizing/` |
| Parent pillar | [Production Scheduling Software and APS](https://www.m365.fm/en/learn/production-scheduling-aps/) |
| Main keyword | lot sizing |
| Secondary keywords | lot sizing in manufacturing, lot sizing techniques, lot sizing methods in MRP, economic order quantity, economic production quantity, EPQ formula, EOQ vs EPQ, lot-for-lot, fixed order quantity, period order quantity, part period balancing, least unit cost, Silver-Meal heuristic, Wagner-Whitin algorithm, dynamic lot sizing, capacitated lot sizing, quantity discount EOQ, EPEI, batch size reduction |
| Search intent | Informational with a practical "how do I calculate it" layer. The google.com results for "lot sizing" mix MRP lessons, vendor glossaries and (off-topic) forex lot-size pages; "economic production quantity" is dominated by textbook pages. Readers want formulas, a worked comparison of methods and guidance on which rule to set in the ERP. |
| Target word count | 3,000 to 5,000 words (cluster rule; longest competitor read: approx. 1,900 words). Actual: **5,030 words** (`wc -w`, H1 through Conclusion, after the SERP re-check; 4,961 before) |
| Language version | `en-US`. New article, no German version, no hreflang pair. Self-referencing canonical only. |

# Competitive analysis (google.com SERP, November 2026)

Basis: US web searches on November 20, 2026 for "lot sizing", "lot sizing techniques manufacturing EOQ EPQ Wagner-Whitin Silver-Meal", "economic production quantity formula example", "economic order quantity EOQ formula" and "what is lot sizing in MRP lot for lot fixed order period". The ranking English pages below were opened and read; word counts are rounded estimates of the main content without navigation and footers. Note: several top-10 results for the bare term "lot sizing" are forex position-sizing pages (CMC Markets, Switch Markets), which signals mixed intent; the manufacturing qualifier is needed in title and H1.

| Page (URL) | Query / position (approx.) | approx. words | Strengths | Gaps |
|---|---|---|---|---|
| decisionbrain.com/lot-sizing/ | lot sizing, top 5 | 1,400 | real-world scenarios (perishability, priority orders, lead times) | no formula, no numbers, no named method (no EPQ, Wagner-Whitin, Silver-Meal), no FAQ |
| study.com/academy/lesson/lot-sizing-in-material-requirements-planning-systems.html | lot sizing, top 5 | 1,500 | clear MRP framing, FOQ, EOQ, lot-for-lot, POQ | no calculations, no method comparison, partly paywalled, capacity issue raised but not solved |
| mrpeasy.com/blog/economic-order-quantity-eoq/ | economic order quantity, top 10 | 1,900 | EOQ formula with example, holding cost rate, FAQ | no EPQ, no dynamic lot sizing, reorder point formula missing, discount logic not calculated |
| fabrico.io/blog/lot-for-lot-vs-fixed-order-quantity/ | lot for lot vs fixed order quantity, top 10 | 1,750 | worked net requirements example, mistakes, FAQ | cost comparison never finished, no EOQ formula, only two rules in depth, product pitches |
| usersolutions.com/blog/glossary/lot-sizing | lot sizing, top 10 | short glossary entry | quick definition | no depth |

"People also ask" style questions collected from the SERP and from FAQ blocks of the ranking pages: What is lot sizing in MRP? What is the difference between lot-for-lot and fixed order quantity? When should I use lot-for-lot? Is fixed order quantity the same as EOQ? What is the difference between EOQ and EPQ? What is the Wagner-Whitin algorithm? How does lot size affect OEE and changeovers? Which lot sizing method is best?

**How this article beats the competition:** None of the ranking pages runs the same demand through all common lot sizing rules and shows the cost of each. This article does that (lot-for-lot, fixed order quantity, period order quantity, least unit cost, part period balancing, Silver-Meal, Wagner-Whitin) on one eight-week example, adds the EPQ formula with run and cycle length, a quantity discount calculation, the capacity view (bottleneck setups, capacitated lot sizing, EPEI) and a decision template for ERP settings. All primary sources (Harris 1913, Taft 1918, Wagner and Whitin 1958, Silver and Meal 1973) are cited with verified bibliographic data.

### SERP re-check, November 20, 2026

Method: US web searches for "lot sizing" (main keyword) and "lot sizing techniques in MRP" (variant). Positions are the order returned by the search tool and approximate the google.com SERP; no live "People also ask" box is available through the tool. Searches ran on November 20; pages were opened on November 23, 2026 after the fetch quota reset. Word counts are estimates of the main text.

| Position (approx.) | Page | approx. words | Findings |
|---|---|---|---|
| 1 | technav.ieee.org/topic/lot-sizing/ | approx. 550 | IEEE topic overview (EOQ, dynamic lot sizing, MRP) with links to papers; no worked numbers |
| 2 | arxiv.org/pdf/2502.06856 ("A physical model approach to order lot sizing") | research paper | academic |
| 3 | taylorfrancis.com (book chapter) | not opened | textbook chapter |
| 4 | fiveable.me/introduction-industrial-engineering/key-terms/lot-sizing | 1,100–1,200 | student glossary; names EOQ, fixed order quantity, fixed order interval, lot-for-lot, dynamic lot sizing; FAQ: "How is lot sizing different from EOQ?", "Why does lot sizing matter in MRP?", "What is a common mistake with lot sizing problems?" |
| 5 | oreilly.com (Operations Management textbook, "Lot-Sizing Techniques") | not opened (paywalled) | textbook excerpt |
| 6 | USPTO patent (adaptive lot sizing in cellular manufacturing) | not opened | patent |
| 7–10 | Infor CSI documentation, SAP Help ("Lot-Sizing Procedures", approx. 90 words on the page opened), City, University of London tertiary study PDF, arXiv | see notes | ERP documentation and research |
| later | strategosinc.com lean lot sizing | 450–500 | lots of 20 vs. 200 on one work center; average inventory 15 vs. 93 units |

Variant "lot sizing techniques in MRP": a SlideShare deck, IEEE TechNav, Scribd documents, arXiv, the O'Reilly excerpt, a University of Houston course PDF, a Wiley "Comparison of lot size rules" excerpt and an IJOPM paper comparing dynamic lot sizing rules.

**Result:** the SERP has shifted further toward textbook, research and ERP documentation pages; the practitioner pages from the first analysis (DecisionBrain, Study.com, MRPeasy, Fabrico) and the forex pages did not appear in this check's top results. No page in the top results runs one demand series through all common rules or adds capacity. The intent is "learn the methods and their differences", which this article serves; one question ("How is lot sizing different from EOQ?") was missing from our FAQ and is now added.

---

# Lot Sizing in Manufacturing: EOQ, EPQ and Dynamic Methods with Worked Examples

*Updated November 20, 2026 · Part of the guide [Production Scheduling Software and APS](https://www.m365.fm/en/learn/production-scheduling-aps/)*

> **Short answer:** Lot sizing decides how many units to make or buy per order. Static rules such as the economic order quantity (EOQ) and economic production quantity (EPQ) assume steady demand. Dynamic rules such as Silver-Meal, part period balancing and the Wagner-Whitin algorithm handle demand that changes week to week. All of them trade setup or ordering cost against holding cost. None of them sees capacity, which is why bottleneck work centers need a separate check.

Lot sizing sits between material planning and the shop floor. The MRP run nets requirements; the lot sizing rule then turns net requirements into planned orders. The parent guide on [production scheduling software and APS](https://www.m365.fm/en/learn/production-scheduling-aps/) introduces the EOQ formula and its limits in one section. This deep dive goes further: the finite production rate (EPQ), price breaks, the full family of MRP lot sizing rules on one dataset, and what changes when setups consume bottleneck capacity.

### Key takeaways

- **Pick the rule by demand pattern.** Use EOQ or EPQ for steady demand. For lumpy, time-phased demand from MRP, use a dynamic rule. Lot-for-lot is the default only when setups are cheap.
- **EPQ gives larger lots than EOQ** when production is not instantaneous. In the example below, the lot grows from 949 to 1,095 units, and annual cost falls from $7,589 to $6,573.
- **Heuristics are close, not exact.** On an eight-week example, Silver-Meal costs 13% more than the Wagner-Whitin optimum, and part period balancing 25% more. Lot-for-lot costs 72% more.
- **Cost curves are flat, capacity is not.** A 20% deviation from the "optimal" lot barely changes cost. The same change can add or remove hours of setup at the bottleneck.
- **Setup time is the real lever.** Cut changeover time and every rule produces smaller lots, shorter lead times and less inventory.

## Table of contents

1. [What lot sizing decides](#1-what-lot-sizing-decides)
2. [The cost model behind every rule](#2-the-cost-model-behind-every-rule)
3. [Static lot sizing: EOQ, EPQ and quantity discounts](#3-static-lot-sizing-eoq-epq-and-quantity-discounts)
4. [Dynamic lot sizing: seven rules on one dataset](#4-dynamic-lot-sizing-seven-rules-on-one-dataset)
5. [Capacity: when the formula meets the bottleneck](#5-capacity-when-the-formula-meets-the-bottleneck)
6. [Lot sizing in ERP and MRP settings](#6-lot-sizing-in-erp-and-mrp-settings)
7. [The lean view: smaller lots through shorter setups](#7-the-lean-view-smaller-lots-through-shorter-setups)
8. [Template: lot sizing decision table](#8-template-lot-sizing-decision-table)
9. [Common mistakes](#9-common-mistakes)
10. [FAQ: lot sizing](#10-faq-lot-sizing)
11. [Conclusion](#11-conclusion)

## 1. What lot sizing decides

A **lot** (or batch) is the quantity produced after one setup or bought with one order. Lot sizing answers two linked questions: *how much* per order, and therefore *how often* to order or set up. The ASCM Supply Chain Dictionary, now in its 20th edition, is the standard US reference for the terms used here (lot-for-lot, period order quantity, fixed order quantity) [13].

Lot sizing is different from three neighboring decisions:

| Decision | Question | Covered in |
|---|---|---|
| Lot sizing | How many units per order or production run? | This article |
| Safety stock | How much buffer against demand and supply variation? | [Manufacturing inventory management](https://www.m365.fm/en/learn/production-scheduling-aps/manufacturing-inventory-management/) |
| Sequencing | In which order do lots run on a machine? | [Production scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/) |
| Master planning | How much to produce per month or week at all? | [S&OP, MRP and production planning](https://www.m365.fm/en/learn/sop-mrp-production-planning/) |

The lot size feeds directly into the other three. It sets **cycle stock** (on average half a lot for purchased items), it determines how many changeovers a machine must absorb, and it changes the lead time of every order that waits behind a big lot.

## 2. The cost model behind every rule

Every lot sizing rule in this article minimizes the same two cost components:

- **Setup or ordering cost S** per lot: changeover labor, scrap during first-off inspection, purchase order handling, receiving and incoming inspection. It is fixed per lot, no matter how many units the lot contains.
- **Holding cost H** per unit and period: cost of capital, storage, insurance, handling, obsolescence and shrinkage. In practice H = unit cost × carrying cost rate.

Both are partly imputed. If the setup crew is paid whether it changes over or not, a setup at a non-bottleneck costs little extra cash; at the bottleneck it costs lost output. Agree both values with the plant controller and record the date. Quality adds one more consideration: in regulated supply chains (AS9100, IATF 16949), the production lot is often also the traceability lot, so a larger lot widens the scope of any containment or recall.

Large lots spread S over many units but raise average inventory. Small lots cut inventory but multiply setups. The rules differ only in their assumptions about demand:

| Family | Demand assumption | Typical rules | Optimal? |
|---|---|---|---|
| Static, continuous | Constant rate, infinite horizon | EOQ, EPQ, EOQ with quantity discounts | Optimal under its assumptions |
| Static, periodic | Constant, expressed as coverage | Period order quantity (POQ), fixed period | Approximation |
| Dynamic, heuristic | Known, time-varying, finite horizon | Least unit cost, part period balancing, Silver-Meal | Approximation |
| Dynamic, exact | Known, time-varying, finite horizon | Wagner-Whitin | Optimal for one item without capacity limits |
| Capacitated | Several items share limited capacity | Capacitated lot sizing models, APS | NP-hard in general |

Two costs are missing from all of these models, and they often matter more than S and H: **capacity lost to setups at a bottleneck** and **lead time added by large lots**. Section 5 returns to both.

## 3. Static lot sizing: EOQ, EPQ and quantity discounts

### 3.1 EOQ in one paragraph

Ford Whitman Harris published the square-root formula in 1913 in *Factory, The Magazine of Management*; Donald Erlenkotter's 1990 paper in *Operations Research* traced its history after it had gone uncited for decades [1]. The formula is Q* = √(2DS ÷ H). The parent guide works through it with a lathe part: D = 12,000 units per year, S = $300 per setup, H = $8 per unit per year, giving Q* ≈ 949 units and a total annual cost of about $7,589 ([Section 9 of the pillar](https://www.m365.fm/en/learn/production-scheduling-aps/#9-lot-sizing-eoq-worked-example-and-limits)). This article uses the same part, so the numbers connect.

EOQ assumes the whole lot arrives at once. That is true for a purchase order delivered on one truck. It is not true for a production run, where parts trickle off the machine while downstream consumption continues.

### 3.2 EPQ: the economic production quantity

E. W. Taft, a statistical engineer at the Winchester Repeating Arms Company, published the finite-production-rate version in *The Iron Age* in 1918 [2]. With production rate P and demand rate D (same time unit, P > D), inventory builds up only at the rate P − D during the run. Maximum inventory is therefore Q × (1 − D/P), not Q, and the formula becomes:

> **Q*_EPQ = √(2 × D × S ÷ (H × (1 − D/P)))**
>
> D = demand per year, P = production rate per year, S = setup cost per run, H = holding cost per unit per year

**Worked example.** The lathe part from the pillar runs at 200 units per day; the assembly line consumes 50 per day. With 240 working days, P = 48,000 and D = 12,000 units per year, so D/P = 0.25.

| Step | Calculation | Result |
|---|---|---|
| EPQ | √(2 × 12,000 × 300 ÷ (8 × 0.75)) = √1,200,000 | **1,095 units** |
| Maximum inventory | 1,095 × (1 − 0.25) | 822 units |
| Average inventory | 822 ÷ 2 | 411 units |
| Annual holding cost | 411 × $8 | $3,286 |
| Annual setup cost | 12,000 ÷ 1,095 × $300 | $3,286 |
| Total annual cost | | **$6,573** |
| Run length | 1,095 ÷ 200 per day | 5.5 days |
| Cycle length | 1,095 ÷ 50 per day | 21.9 days |

The EPQ lot is about 15% larger than the EOQ lot (1,095 vs. 949) and its total cost is about 13% lower ($6,573 vs. $7,589), because the plain EOQ overstates average inventory for a part that is consumed while it is being made.

How much does it matter if a plant uses EOQ anyway? If you run lots of 949 units but cost them with the correct finite-rate inventory, the annual cost is $6,640 (holding $2,847, setup $3,793). That is only 1% above the EPQ optimum. The flat cost curve from the pillar applies again: choosing the "wrong" formula costs little. Choosing a lot that the bottleneck cannot absorb costs a lot, as Section 5 shows.

The cycle length matters for scheduling. The machine is busy with this part for 5.5 of every 21.9 days. If several parts share it, their individual EPQs may not fit together (the economic lot scheduling problem, which the single-item formula ignores).

### 3.3 Quantity discounts: when a bigger lot beats the EOQ

For purchased parts, suppliers often quote price breaks. The EOQ formula alone cannot handle them, because the unit price changes the holding cost and adds a purchase cost term. The standard procedure is to compute the EOQ for each price, push it up to the break quantity if it falls below, and compare total annual cost including purchase cost [10].

**Worked example.** A purchased bracket: D = 6,000 units per year, S = $80 per order, carrying cost rate 25% per year. The supplier quotes $10.00 per unit below 1,000 units and $9.70 per unit from 1,000 units.

| Price | EOQ at this price | Feasible order quantity | Purchase cost | Ordering cost | Holding cost | Total |
|---|---|---|---|---|---|---|
| $10.00 | √(2 × 6,000 × 80 ÷ 2.50) ≈ 620 | 620 | $60,000 | $775 | $775 | **$61,549** |
| $9.70 | √(2 × 6,000 × 80 ÷ 2.425) ≈ 629 | 629 is below the break, so 1,000 | $58,200 | $480 | $1,213 | **$59,893** |

The discount wins by about $1,657 per year, even though the order is 61% larger than the EOQ. Before you accept it, check what the formula does not see: storage space for the extra 380 units, shelf life, the risk of engineering changes, and the cash tied up. The finance view on inventory valuation is in the sibling article on [manufacturing inventory management](https://www.m365.fm/en/learn/production-scheduling-aps/manufacturing-inventory-management/).

## 4. Dynamic lot sizing: seven rules on one dataset

MRP does not produce a steady demand rate. It produces **time-phased net requirements** that jump from week to week. Static formulas misfire here: an EOQ of 170 units ordered into a week that needs 20 creates leftover stock. Dynamic rules decide which future periods each lot covers.

### 4.1 The dataset

One finished part, eight weeks of net requirements from MRP. Setup cost S = $200 per lot. Holding cost h = $1 per unit per week, charged on inventory left at the end of each week. Units consumed in the week they are produced carry no holding cost.

| Week | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | Total |
|---|---|---|---|---|---|---|---|---|---|
| Net requirement | 80 | 40 | 150 | 150 | 80 | 40 | 20 | 20 | 580 |

Average demand is 72.5 units per week. The EOQ on that average is √(2 × 72.5 × 200 ÷ 1) ≈ 170 units, about 2.3 weeks of demand.

### 4.2 The rules

- **Lot-for-lot (L4L):** order exactly the net requirement of each week. No holding cost, maximum setups.
- **Fixed order quantity (FOQ):** always order the same quantity, here the EOQ of 170 (or a multiple if one lot is not enough).
- **Period order quantity (POQ):** convert the EOQ into a coverage time, here round(170 ÷ 72.5) = 2 weeks, and order two weeks of requirements at a time.
- **Least unit cost (LUC):** extend the lot one period at a time while the cost per *unit* (setup plus holding, divided by lot quantity) keeps falling. SAP ERP offers it as an optimum lot-sizing procedure [12].
- **Part period balancing (PPB):** extend the lot until the accumulated holding cost comes closest to the setup cost (some systems use "does not exceed" instead of "closest", which can give slightly different lots). In "part periods", the threshold is S/h = 200 unit-weeks. The method goes back to DeMatteis's part-period algorithm published in the *IBM Systems Journal* in 1968 [5]; SAP describes its procedure as grouping requirements "until the sum of the storage costs equals lot size independent costs" [11].
- **Silver-Meal (SM):** extend the lot while the average cost per *period* covered falls; stop when it rises [4].
- **Wagner-Whitin (WW):** dynamic programming that finds the cost-minimal plan for a single item with known demand and no capacity limit [3]. It relies on the property that an optimal plan only places an order when inventory has run to zero.

### 4.3 Results

All plans were recalculated by script; total cost = setups × $200 + unit-weeks held × $1.

| Rule | Planned orders (weeks 1 to 8) | Setups | Setup cost | Holding cost | Total cost | vs. optimum |
|---|---|---|---|---|---|---|
| Lot-for-lot | 80, 40, 150, 150, 80, 40, 20, 20 | 8 | $1,600 | $0 | $1,600 | +72% |
| FOQ (170) | 170, 0, 170, 170, 0, 170, 0, 0 | 4 | $800 | $670 | $1,470 | +58% |
| POQ (2 weeks) | 120, 0, 300, 0, 120, 0, 40, 0 | 4 | $800 | $250 | $1,050 | +13% |
| Least unit cost | 270, 0, 0, 230, 0, 80, 0, 0 | 3 | $600 | $480 | $1,080 | +16% |
| Part period balancing | 270, 0, 0, 290, 0, 0, 0, 20 | 3 | $600 | $560 | $1,160 | +25% |
| Silver-Meal | 120, 0, 460, 0, 0, 0, 0, 0 | 2 | $400 | $650 | $1,050 | +13% |
| **Wagner-Whitin** | **120, 0, 300, 0, 160, 0, 0, 0** | **3** | **$600** | **$330** | **$930** | **optimum** |

### 4.4 Reading the results

**Silver-Meal step by step.** Starting in week 1, covering one week costs $200 per period; covering weeks 1 and 2 costs (200 + 40) ÷ 2 = $120 per period; adding week 3 raises it to (200 + 40 + 300) ÷ 3 = $180. So the first lot covers weeks 1 and 2 (120 units). Starting in week 3, the average cost per period keeps falling all the way to the end of the horizon ($200, $175, $170, $157.50, $142, $135). The heuristic therefore puts weeks 3 to 8 into one lot of 460 units and carries 80 units of week 5 demand for two weeks. Wagner-Whitin sees that a third setup in week 5 is cheaper than that holding cost.

**Why heuristics miss.** Each heuristic looks forward from the current lot and never revisits a decision. The horizon end distorts them too: Silver-Meal's average keeps falling because the small demands in weeks 7 and 8 add little holding cost. In a rolling MRP plan, those weeks are replanned anyway.

**Why lot-for-lot still has its place.** L4L is 72% more expensive here only because a setup costs $200. If a changeover costs $20, L4L is close to optimal and gives the shortest lead times and the least inventory. L4L is also the usual choice for expensive, customer-specific or shelf-life-limited items and for the upper levels of a deep bill of materials, where lot sizing at every level would compound inventory.

**How good is "good enough"?** The Wagner-Whitin algorithm was long considered too complex for routine use, which motivated heuristics such as Silver-Meal [9]. Later work reduced its effort to O(n log n), and to linear time in the Wagner-Whitin cost case (Federgruen and Tzur 1991; Wagelmans, van Hoesel and Kolen 1992) [9]. Computation time is no longer a reason to avoid it for a single item. The real limitation is its assumption of unlimited capacity, which it shares with every rule in the table.

## 5. Capacity: when the formula meets the bottleneck

### 5.1 Setup hours are the hidden cost

Assume the lathe from Section 3 is the plant's bottleneck and every changeover takes four hours. The number of setups per year follows directly from the lot size:

| Lot size | Setups per year (12,000 ÷ lot) | Setup hours per year (× 4 h) |
|---|---|---|
| 600 | 20.0 | 80 |
| 949 (EOQ) | 12.6 | 51 |
| 1,095 (EPQ) | 11.0 | 44 |

At a bottleneck, each of these hours is an hour of lost plant output, not just $300 of setup cost. The pillar's section on the theory of constraints explains the rule that follows: lots tend to be larger at the bottleneck and smaller at non-bottlenecks, where idle time absorbs extra setups at almost no cost. More on bottleneck logic in the planned pillar [Theory of Constraints](https://www.m365.fm/en/learn/theory-of-constraints/).

A related lever is to split the **transfer batch** from the **process batch**. The lathe can run 1,095 parts in one setup but pass them to the next operation in containers of 100. Downstream work starts after the first container, not after 5.5 days.

### 5.2 Capacitated lot sizing

When several items share one machine, lot sizes interact: a big lot of part A delays part B, which then needs a bigger lot to cover the longer wait. Operations research calls this the capacitated lot sizing problem. Florian, Lenstra and Rinnooy Kan showed in 1980 that special cases of capacity-constrained production planning are NP-hard [6]. Bitran and Yanasse showed in 1982 that even the problem with two items and independent setups is NP-hard under conditions where the single-item problem is easy [7]. Karimi, Fatemi Ghomi and Wilson's 2003 review calls lot sizing "one of the most important and also one of the most difficult problems in production planning" [8].

In practice, that means:

- An ERP lot sizing rule decides each item in isolation. It cannot tell whether the resulting lots fit the machine.
- An APS can evaluate lot size and sequence together, including sequence-dependent changeover times. The pillar describes how APS solvers handle this ([Section 5](https://www.m365.fm/en/learn/production-scheduling-aps/#5-what-an-aps-system-is-and-how-it-calculates)).
- For a quick check without software, add up run time plus setup time per week for each shared work center. If the load exceeds available hours, the lot sizes are not feasible, however "economic" they are.

### 5.3 Lot size and lead time

Hopp and Spearman describe in *Factory Physics* how batching adds waiting time: a part in a lot of Q waits for the other Q − 1 units to be processed before the lot moves on, and large lots also raise the variability of arrivals at the next station [14]. Neither effect appears in S or H. If your customer-facing problem is lead time rather than cost, start from the lead time you need and size lots to fit it.

## 6. Lot sizing in ERP and MRP settings

In an ERP system, lot sizing is a master data field per item and plant, applied after netting in every MRP run. The [S&OP, MRP and production planning](https://www.m365.fm/en/learn/sop-mrp-production-planning/) pillar (planned) covers the MRP logic itself; here is what matters for the lot sizing setting.

**Rule keys.** SAP ERP, for example, uses keys such as EX (exact lot size, that is lot-for-lot), FX (fixed lot size), TB, WB and MB (daily, weekly and monthly period lot sizes) [12], plus optimum procedures such as part period balancing [11] and least unit cost [12]. Other ERP systems use similar options under different names.

**Order modifiers.** Most systems apply modifiers after the rule: minimum lot, maximum lot, rounding value (for example, a full container or pallet) and scrap allowance. Modifiers often dominate the result. A rounding value of 500 turns every "optimal" lot of 170 into 500.

**Nervousness.** Dynamic rules recalculate lots every run. A small change in week 6 demand can move a lot from week 3 to week 5 and trigger reschedule messages down the bill of materials. Common countermeasures are a firm planning time fence, lot-for-lot or fixed lots inside the frozen zone, and dynamic rules only beyond it.

**Multi-level effect.** Lot sizing at every level of a deep bill of materials multiplies inventory and lead time, because each level batches the already batched demand of the level above. Many plants use lot-for-lot on intermediate levels and size lots only where setups are expensive.

**Safety stock interaction.** Lot size covers predictable demand; safety stock covers the unpredictable part. Raising lot sizes to "be safe" double-buffers. The sizing of safety stock is covered in the sibling article on [manufacturing inventory management](https://www.m365.fm/en/learn/production-scheduling-aps/manufacturing-inventory-management/).

## 7. The lean view: smaller lots through shorter setups

Lean manufacturing treats large lots as a symptom: they exist because changeovers are long. The goal is not to compute the optimal lot but to change the inputs so that the optimal lot becomes small. The pillar shows that halving setup cost lowers the EOQ from 949 to 671 units and total cost by about 29% [pillar, Section 9.3].

A practical planning measure is **EPEI** ("every part every interval"): how often a machine can cycle through all its part numbers. It is calculated from the time left for changeovers.

**Worked example.** A press makes six part numbers. It runs two shifts of 450 minutes, five days a week, so it has 4,500 minutes per week. Customer demand needs 3,600 minutes of run time. That leaves 900 minutes for changeovers.

| | Before SMED | After SMED |
|---|---|---|
| Changeover time per part | 60 min | 20 min |
| Time for one full cycle of six changeovers | 360 min | 120 min |
| Possible cycles per week (900 ÷ cycle) | 2.5 | 7.5 |
| EPEI (5 days ÷ cycles) | 2 days | about 0.7 days |
| Lot size per part | 2 days of demand | less than 1 day of demand |

After the changeover reduction, the press can make every part every day with room to spare. That is the precondition for a stable [kanban pull system](https://www.m365.fm/en/learn/kanban-pull-system/) with small containers. The method is covered in the planned pillar on [SMED and changeover reduction](https://www.m365.fm/en/learn/smed-changeover-reduction/). Plants that map their flow first usually find the long-changeover machines quickly; see [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/).

More changeovers also mean more work for operators and setup technicians. SMED projects work when the people who do the changeover design the new standard, and when the time saved is not simply filled with more changeovers without adjusting staffing. Use all 900 minutes for changeovers only on paper. In practice, keep part of the time as a buffer for breakdowns and quality problems, or the EPEI will not hold.

## 8. Template: lot sizing decision table

Use one row per item class. Fill it in with planners, the scheduler of the bottleneck and the controller.

| Item class | Demand pattern | Setup or order cost | Bottleneck involved? | Recommended rule | Modifiers | Review cycle |
|---|---|---|---|---|---|---|
| Purchased C-parts, steady demand | Steady | Low per order, but many orders | No | FOQ from EOQ, rounded to pack size, or kanban | Pack size, MOQ | Yearly |
| Purchased A-parts with price breaks | Steady | Medium | No | EOQ with quantity discount check | Break quantities | At each price change |
| Make parts on a dedicated line | Steady | Medium | No | EPQ, rounded to container | Container quantity | Twice a year |
| Make parts on a shared bottleneck | Lumpy (MRP) | High in capacity terms | Yes | Fixed cycle (EPEI) or APS-optimized lots | Min lot from changeover time | Monthly with capacity review |
| Make parts, non-bottleneck | Lumpy (MRP) | Low to medium | No | Lot-for-lot or POQ (1 to 2 weeks) | Max lot | Quarterly |
| Customer-specific or shelf-life items | Lumpy | Any | Any | Lot-for-lot | Shelf-life limit | Per order |
| Intermediate BOM levels | Dependent | Low | No | Lot-for-lot | None | Yearly |

And a short checklist before you change a rule in the ERP:

| Check | Yes / No |
|---|---|
| Setup cost and carrying cost rate agreed with controlling, with the date of the last update | |
| Setup time per work center known (measured, not the routing default) | |
| Bottleneck work centers identified and lot sizes checked against their weekly capacity | |
| Order modifiers (MOQ, rounding, max lot) reviewed, because they override the rule | |
| Time fence defined to limit nervousness | |
| Effect on safety stock and lead time reviewed | |

## 9. Common mistakes

1. **Using EOQ for lumpy MRP demand.** The fixed order quantity creates leftovers in low-demand weeks. In the dataset, FOQ costs 58% more than the optimum.
2. **Treating the carrying cost rate as a constant nobody owns.** A rate set years ago drives every lot in the system. Agree it with finance and review it when interest rates or storage costs change.
3. **Ignoring setup hours at the bottleneck.** The cost formula prices a setup at $300. The plant loses four hours of output. Check bottleneck load before you shrink lots there.
4. **Letting order modifiers override the logic unnoticed.** A pallet rounding value or a supplier MOQ can turn any rule into a fixed lot.
5. **Lot sizing at every BOM level.** Each level batches the batches of the level above; inventory and lead time multiply.
6. **Buying the discount without the full cost.** The quantity discount calculation leaves out storage space, obsolescence risk and engineering changes. Add them before you sign.
7. **Optimizing lots instead of setups.** A better formula moves cost by a few percent. Halving changeover time moves it by about 29%.

## 10. FAQ: lot sizing

### What is lot sizing in MRP?

Lot sizing in MRP is the step that converts time-phased net requirements into planned orders. After the MRP run nets gross requirements against stock and open orders, the item's lot sizing rule (for example lot-for-lot, fixed order quantity or period order quantity) and its order modifiers decide the quantity and timing of each planned order.

### How is lot sizing different from EOQ?

Lot sizing is the decision itself: how many units to make or buy per order. EOQ is one rule for making that decision, and it assumes steady demand and a lot that arrives all at once. MRP items with changing weekly requirements need dynamic rules such as period order quantity, Silver-Meal or Wagner-Whitin, and production at a finite rate needs EPQ.

### What is the difference between EOQ and EPQ?

EOQ assumes the whole lot arrives at once, as with a purchase order. EPQ assumes the lot is produced at a finite rate while demand continues, so maximum inventory is only Q × (1 − D/P). EPQ therefore gives larger lots: in the example, 1,095 instead of 949 units at the same setup and holding cost.

### What is the difference between lot-for-lot and fixed order quantity?

Lot-for-lot orders exactly the net requirement of each period, so it holds no cycle stock but needs a setup every period with demand. Fixed order quantity always orders the same amount, often derived from EOQ, a pack size or a supplier minimum, and carries leftovers into later periods.

### When should I use lot-for-lot?

Use lot-for-lot when setups or orders are cheap, when items are expensive, customer-specific or shelf-life-limited, and on intermediate levels of a deep bill of materials. It gives the lowest inventory and shortest lead time. Avoid it on bottleneck machines with long changeovers.

### Is fixed order quantity the same as EOQ?

Not necessarily. EOQ is one way to set a fixed order quantity; container sizes, pallets, supplier minimums and machine constraints are others. Once entered in MRP, an EOQ behaves like any other FOQ.

### What is the Wagner-Whitin algorithm?

The Wagner-Whitin algorithm, published by Harvey Wagner and Thomson Whitin in *Management Science* in 1958, finds the minimum-cost lot sizes for one item with known, time-varying demand over a finite horizon and no capacity limit. It uses dynamic programming and the property that an optimal plan orders only when inventory reaches zero.

### What is the Silver-Meal heuristic?

Silver-Meal, published by Edward Silver and Harlan Meal in 1973, extends each lot one period at a time as long as the average setup plus holding cost per period covered keeps falling. It is simple and usually close to optimal; in the example it costs 13% more than Wagner-Whitin.

### Which lot sizing method is best?

For a single item with known demand and no capacity limit, Wagner-Whitin gives the lowest cost. In practice, choose by context: EOQ or EPQ for steady demand, POQ or Silver-Meal for lumpy MRP demand, lot-for-lot for cheap setups, and capacity-aware scheduling (an APS) where several items compete for a bottleneck.

### How does lot size affect OEE and changeovers?

Smaller lots mean more changeovers. If changeovers are long, availability and therefore OEE drop, which is why lot size reduction and setup reduction (SMED) belong together. At the bottleneck, extra changeovers cost output.

## 11. Conclusion

Lot sizing looks like a formula problem and turns out to be a capacity and setup problem. The formulas are worth knowing: EOQ and EPQ for steady demand, a discount check for purchased parts, and a dynamic rule for lumpy MRP requirements. On the eight-week example, the difference between the worst and the best rule was 72%. Between the good heuristics and the optimum, it was 13 to 25%.

The bigger gains sit outside the formula. Check every lot size against bottleneck capacity, keep lot-for-lot where setups are cheap, control order modifiers, and work on changeover time. When the setup drops, every rule produces smaller lots and the plant gets shorter lead times without extra planning effort. Where several items compete for the same machine, an APS that plans lots and sequence together is the logical next step; the parent guide explains how.

## Further reading on m365.fm

**Parent guide**

- [Production Scheduling Software and APS: The Complete Guide](https://www.m365.fm/en/learn/production-scheduling-aps/) (planned)

**Sibling clusters (planned)**

- [Manufacturing Inventory Management: Safety Stock, ABC/XYZ and Inventory Accounting](https://www.m365.fm/en/learn/production-scheduling-aps/manufacturing-inventory-management/) (planned)
- [Intralogistics: In-Plant Material Flow, Milk Runs and AMRs](https://www.m365.fm/en/learn/production-scheduling-aps/intralogistics/) (planned)

**Related pillars (planned)**

- [S&OP, MRP and Production Planning](https://www.m365.fm/en/learn/sop-mrp-production-planning/) (planned)
- [SMED and Changeover Reduction](https://www.m365.fm/en/learn/smed-changeover-reduction/) (planned)
- [Kanban and Pull Systems](https://www.m365.fm/en/learn/kanban-pull-system/) (planned)
- [Theory of Constraints](https://www.m365.fm/en/learn/theory-of-constraints/) (planned)
- [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) (planned)
- [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/) (planned)
- [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/) (planned)

**Entity pages**

[Batch Size](https://www.m365.fm/entity/batch-size/) · [Setup Time](https://www.m365.fm/entity/setup-time/) · [Safety Stock](https://www.m365.fm/entity/safety-stock/) · [Lead Time](https://www.m365.fm/entity/lead-time/) · [Advanced Planning and Scheduling](https://www.m365.fm/entity/advanced-planning-and-scheduling/) · [Theory of Constraints](https://www.m365.fm/entity/theory-of-constraints/) · [Kanban](https://www.m365.fm/entity/kanban/)

---

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** is the host of m365.fm and works at iFAKT GmbH. On m365.fm he writes about production planning and scheduling, lean manufacturing and the digital transformation of manufacturing.

**Note: The author works at iFAKT GmbH.**

*[Editor: add the author's role, background and profile photo.]*

---

# Sources

All online sources accessed November 20, 2026.

1. Harris, Ford W.: How Many Parts to Make at Once. Factory, The Magazine of Management 10 (1913) 2 (February 1913), pp. 135–136; and Erlenkotter, Donald: Ford Whitman Harris and the Economic Order Quantity Model. Operations Research 38 (1990) 6, pp. 937–946. DOI: 10.1287/opre.38.6.937. Record: https://ideas.repec.org/a/inm/oropre/v38y1990i6p937-946.html (page numbers of the Harris original as in the parent pillar; volume/issue confirmed via https://en.wikipedia.org/wiki/Ford_Whitman_Harris)
2. Taft, E. W.: The most economical production lot. The Iron Age 101 (1918) 18, pp. 1410–1412. Cited via https://en.wikipedia.org/wiki/Economic_production_quantity [original not consulted].
3. Wagner, Harvey M.; Whitin, Thomson M.: Dynamic Version of the Economic Lot Size Model. Management Science 5 (1958) 1, pp. 89–96. DOI: 10.1287/mnsc.5.1.89. Record: https://econpapers.repec.org/RePEc:inm:ormnsc:v:5:y:1958:i:1:p:89-96
4. Silver, Edward A.; Meal, Harlan C.: A Heuristic for Selecting Lot Size Quantities for the Case of a Deterministic Time-Varying Demand Rate and Discrete Opportunities for Replenishment. Production and Inventory Management (1973), pp. 64–74. Record: https://cir.nii.ac.jp/crid/1570291226041264256 [volume/issue not confirmed]
5. DeMatteis, J. J.: An economic lot-sizing technique, I: The part-period algorithm. IBM Systems Journal 7 (1968) 1, pp. 30–38. DOI: 10.1147/sj.71.0030 (bibliographic data confirmed via Crossref, November 20, 2026).
6. Florian, M.; Lenstra, J. K.; Rinnooy Kan, A. H. G.: Deterministic Production Planning: Algorithms and Complexity. Management Science 26 (1980) 7, pp. 669–679. DOI: 10.1287/mnsc.26.7.669. Record: https://ideas.repec.org/a/inm/ormnsc/v26y1980i7p669-679.html
7. Bitran, Gabriel R.; Yanasse, Horacio H.: Computational Complexity of the Capacitated Lot Size Problem. Management Science 28 (1982) 10, pp. 1174–1186. DOI: 10.1287/mnsc.28.10.1174. Record: https://ideas.repec.org/a/inm/ormnsc/v28y1982i10p1174-1186.html
8. Karimi, B.; Fatemi Ghomi, S. M. T.; Wilson, J. M.: The capacitated lot sizing problem: a review of models and algorithms. Omega 31 (2003) 5, pp. 365–378. PII S0305-0483(03)00059-8. Record: https://ideas.repec.org/a/eee/jomega/v31y2003i5p365-378.html
9. Federgruen, Awi; Tzur, Michal: A simple forward algorithm to solve general dynamic lot sizing models with n periods in O(n log n) or O(n) time. Management Science 37 (1991) 8, pp. 909–925, DOI: 10.1287/mnsc.37.8.909; Wagelmans, Albert; van Hoesel, Stan; Kolen, Antoon: Economic lot sizing: an O(n log n) algorithm that runs in linear time in the Wagner-Whitin case. Operations Research 40 (1992) Supplement 1, pp. S145–S156, DOI: 10.1287/opre.40.1.S145. Both cited via https://en.wikipedia.org/wiki/Dynamic_lot-size_model; bibliographic data of both confirmed via Crossref, November 20, 2026 (full texts not opened)
10. Silver, Edward A.; Pyke, David F.; Thomas, Douglas J.: Inventory and Production Management in Supply Chains. 4th ed., CRC Press, Boca Raton 2017, ISBN 978-1-4665-5861-8.
11. SAP Help Portal: Part Period Balancing (SAP R/3 4.6C documentation). https://help.sap.com/SAPHelp_46c/helpdata/EN/f4/7d288744af11d182b40000e829fbfe/content.htm
12. SAP Help Portal: lot-sizing procedures supported in SAP AFS (EX, FX, TB, WB, MB and others). https://help.sap.com/saphelp_afs60/helpdata/en/23/9671f6d32f11d2aca80000e829fbfe/content.htm ; SAP Community blog: Optimum lot size "WI" – least unit cost procedure. https://blogs.sap.com/t5/enterprise-resource-planning-blogs-by-sap/optimum-lot-size-quot-wi-quot-least-unit-cost-procedure/ba-p/13141473
13. ASCM (Association for Supply Chain Management): ASCM Supply Chain Dictionary, 20th Edition. https://learn.ascm.org/s/ascm-dictionary
14. Hopp, Wallace J.; Spearman, Mark L.: Factory Physics. 3rd ed., Waveland Press, Long Grove (IL) 2008, ISBN 978-1-57766-739-1.

---

# Editorial notes

## URL and structure assumptions

- Cluster URL `https://www.m365.fm/en/learn/production-scheduling-aps/lot-sizing/` follows the nested scheme in the course expansion brief; that scheme is an assumption until the CMS confirms it.
- Anchor links into the parent pillar (`#9-lot-sizing-eoq-worked-example-and-limits`, `#5-what-an-aps-system-is-and-how-it-calculates`) use GitHub-style slugs of the pillar's headings; verify after the pillar is published.

## Unverified items and points to check

1. ~~DeMatteis 1968 [5]~~ closed in round 4: volume 7, issue 1, pp. 30–38, author J. J. DeMatteis and DOI confirmed via Crossref.
2. Silver and Meal 1973 [4]: volume and issue not confirmed.
3. Taft 1918 [2] and Federgruen/Tzur, Wagelmans et al. [9] cited via Wikipedia; originals not consulted.
4. Harris 1913 page numbers carried over from the parent pillar.
5. Hopp/Spearman [14]: paraphrase without page number.
6. Anchor slugs into the parent pillar to be checked after publication.
7. All worked examples are constructed illustrative numbers, not plant data.

## Vendor-only claims

- None. SAP is named only as an example of ERP lot-sizing keys from SAP's own documentation [11][12]; no performance claims.

## iFAKT facts and disclosure

- iFAKT is not mentioned in the article body (no genuine fit). The author box carries the disclosure exactly as "**Note: The author works at iFAKT GmbH.**" (FTC material-connection disclosure, not a sponsorship label).

## Internal links

- Parent pillar: first 150 words (paragraph after the short answer), Sections 3.1, 5.1, 5.2, 7, Conclusion and Further reading.
- Siblings: manufacturing-inventory-management (Sections 1, 3.3, 6), intralogistics (Further reading).
- New pillars: sop-mrp-production-planning (Sections 1, 6), smed-changeover-reduction (Section 7), kanban-pull-system (Section 7), theory-of-constraints (Section 5.1); existing pillars: value-stream-mapping (Section 7).

## Cannibalization

- The parent pillar ranks for "economic order quantity" and "safety stock formula" with one worked example each. This cluster deliberately reuses the pillar's EOQ example without repeating its sensitivity table and targets "lot sizing", "EPQ" and the dynamic rules. Recommend the pillar's Section 9 link to this cluster with the anchor "lot sizing methods compared".
- No overlap with the inventory cluster: safety stock lives there; lot size only interacts.

## Recommended graphics

- EPQ saw-tooth diagram (inventory builds at P − D during the run, falls at D afterwards) with Imax = 822 marked
- Bar chart: total cost per rule from Section 4.3 (seven bars, optimum highlighted)
- EPEI before and after SMED as a weekly time bar (run time, changeover time, buffer)

## Schema suggestion (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://www.m365.fm/en/learn/production-scheduling-aps/lot-sizing/#article",
      "headline": "Lot Sizing in Manufacturing: EOQ, EPQ and Dynamic Methods with Worked Examples",
      "description": "Lot sizing explained with worked numbers: EOQ, EPQ, quantity discounts, lot-for-lot, Silver-Meal, Wagner-Whitin, capacity limits and a decision template.",
      "inLanguage": "en-US",
      "datePublished": "2026-11-20",
      "dateModified": "2026-11-20",
      "mainEntityOfPage": "https://www.m365.fm/en/learn/production-scheduling-aps/lot-sizing/",
      "isPartOf": { "@type": "Article", "@id": "https://www.m365.fm/en/learn/production-scheduling-aps/#article" },
      "author": {
        "@type": "Person",
        "name": "Mirko Peters",
        "url": "https://www.m365.fm/entity/mirko-peters/",
        "worksFor": { "@type": "Organization", "name": "iFAKT GmbH", "url": "https://www.m365.fm/entity/ifakt/" }
      },
      "publisher": { "@type": "Organization", "name": "m365.fm", "url": "https://www.m365.fm/" },
      "about": [
        { "@type": "Thing", "name": "Lot sizing" },
        { "@type": "Thing", "name": "Batch Size", "sameAs": "https://www.m365.fm/entity/batch-size/" }
      ],
      "keywords": "lot sizing, economic order quantity, economic production quantity, lot-for-lot, Silver-Meal, Wagner-Whitin, part period balancing, EPEI"
    },
    {
      "@type": "FAQPage",
      "@id": "https://www.m365.fm/en/learn/production-scheduling-aps/lot-sizing/#faq",
      "mainEntity": [
        { "@type": "Question", "name": "What is lot sizing in MRP?", "acceptedAnswer": { "@type": "Answer", "text": "Lot sizing in MRP is the step that converts time-phased net requirements into planned orders. After the MRP run nets gross requirements against stock and open orders, the item's lot sizing rule (for example lot-for-lot, fixed order quantity or period order quantity) and its order modifiers decide the quantity and timing of each planned order." } },
        { "@type": "Question", "name": "How is lot sizing different from EOQ?", "acceptedAnswer": { "@type": "Answer", "text": "Lot sizing is the decision itself: how many units to make or buy per order. EOQ is one rule for making that decision, and it assumes steady demand and a lot that arrives all at once. MRP items with changing weekly requirements need dynamic rules such as period order quantity, Silver-Meal or Wagner-Whitin, and production at a finite rate needs EPQ." } },
        { "@type": "Question", "name": "What is the difference between EOQ and EPQ?", "acceptedAnswer": { "@type": "Answer", "text": "EOQ assumes the whole lot arrives at once, as with a purchase order. EPQ assumes the lot is produced at a finite rate while demand continues, so maximum inventory is only Q × (1 − D/P). EPQ therefore gives larger lots: in the example, 1,095 instead of 949 units at the same setup and holding cost." } },
        { "@type": "Question", "name": "What is the Wagner-Whitin algorithm?", "acceptedAnswer": { "@type": "Answer", "text": "The Wagner-Whitin algorithm, published by Harvey Wagner and Thomson Whitin in Management Science in 1958, finds the minimum-cost lot sizes for one item with known, time-varying demand over a finite horizon and no capacity limit. It uses dynamic programming and the property that an optimal plan orders only when inventory reaches zero." } },
        { "@type": "Question", "name": "Which lot sizing method is best?", "acceptedAnswer": { "@type": "Answer", "text": "For a single item with known demand and no capacity limit, Wagner-Whitin gives the lowest cost. In practice, choose by context: EOQ or EPQ for steady demand, POQ or Silver-Meal for lumpy MRP demand, lot-for-lot for cheap setups, and capacity-aware scheduling (an APS) where several items compete for a bottleneck." } }
      ]
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Learn", "item": "https://www.m365.fm/en/learn/" },
        { "@type": "ListItem", "position": 2, "name": "Production Scheduling Software and APS", "item": "https://www.m365.fm/en/learn/production-scheduling-aps/" },
        { "@type": "ListItem", "position": 3, "name": "Lot Sizing", "item": "https://www.m365.fm/en/learn/production-scheduling-aps/lot-sizing/" }
      ]
    }
  ]
}
```

Note: five of ten FAQs are written out in the markup; add the other five in the same way. Markup text must match the visible answers.

---

## Review log

New cluster article, written directly in US English, November 20, 2026. Nine-role expert panel per the course expansion brief, three full rounds (Mirko's update of November 20, 2026). All worked examples recalculated by script (EPQ, quantity discount, the seven dynamic rules, setup hours, EPEI).

**Verified online for this article (November 20, 2026):** Erlenkotter 1990 record and abstract incl. DOI 10.1287/opre.38.6.937 [1]; Harris 1913 title, journal, volume 10, no. 2, February 1913 (Wikipedia biography) [1]; Taft 1918 citation and Winchester affiliation (Wikipedia EPQ page, secondary) [2]; Wagner and Whitin 1958, Management Science 5(1), 89–96, DOI 10.1287/mnsc.5.1.89 [3]; Silver and Meal 1973, pages 64–74 (CiNii record) [4]; Florian, Lenstra and Rinnooy Kan 1980, DOI and abstract ("some special cases are NP-hard") [6]; Bitran and Yanasse 1982, DOI and abstract ("the problem with two items and independent setups is NP-hard") [7]; Karimi et al. 2003 record and abstract quote [8]; Federgruen/Tzur and Wagelmans et al. citations via the Wikipedia dynamic lot-size page [9]; SAP Part Period Balancing rule quote [11]; SAP AFS list of keys EX, FX, TB, WB, MB and SAP blog on WI least unit cost [12]; ASCM Supply Chain Dictionary, 20th edition [13]. Competitor pages: decisionbrain.com, study.com, mrpeasy.com (EOQ), fabrico.io (L4L vs FOQ).

### Round 1

| Role | Verdict | Findings |
|---|---|---|
| Practitioner (US plant manager) | changes needed | Strong on the method comparison. Wants the point made that the "cost" of a setup is mostly crew time already on the payroll, except at the bottleneck. Asks that container rounding stays visible (it is in the template). |
| Academic (IE/OM professor) | changes needed | Holding cost convention correctly stated. Part period balancing exists in "closest" and "does not exceed" variants; state which one is used. The claim that Wagner-Whitin was "computationally heavy when published" is attributed to [3][4], but neither source was read for that statement. |
| IT/OT architect | satisfied | ERP keys, order modifiers, time fences and multi-level effects are correct and vendor-neutral; SAP named only as an example from its own documentation. |
| Quality lead (CQE, AS9100/IATF) | changes needed | Lot size is also a traceability scope: in AS9100/IATF supply chains a bigger lot widens containment and recall. One sentence is enough. |
| Finance (plant controller) | changes needed | S and H are imputed values; the article should say so and ask for controller sign-off. Discount example is fine because it includes purchase cost. |
| Worker voice and lean coach | changes needed | Section 7 treats changeovers as minutes only. More changeovers mean more operator workload; SMED must be designed with the people who do it. |
| SEO specialist (US) | changes needed | Meta title is 51 characters, not 55; description 153, not 154. Bare "lot sizing" SERP is polluted by forex pages, so "in manufacturing" in title and H1 is right. Parent link appears in the subtitle and in the first paragraph (within 150 words). Word count 4,877 is close to the 5,000 cap; any additions must be offset. |
| Fact checker | changes needed | (a) Wagner-Whitin complexity statement: cite the source that actually says it [9]. (b) Hopp/Spearman: "show" overstates a paraphrase without page reference. (c) DeMatteis 1968: volume, issue, pages not confirmed (index access blocked) -> keep [unverified]. (d) Silver-Meal: volume/issue unclear in CiNii -> keep [unverified]. (e) All numbers recalculated: EPQ 1,095.4, Imax 821.6, total $6,572.67; EOQ-under-EPQ cost $6,640.47; discount $61,549.19 vs. $59,892.50; WW $930, SM $1,050, POQ $1,050, LUC $1,080, PPB $1,160, FOQ $1,470, L4L $1,600; EPEI 2.0 and 0.67 days. All match the text. |
| Critic | changes needed | No em-dash chains, no clichés. Some sentences can be tightened (EPQ cycle paragraph, heuristics paragraph, two FAQs) to make room for the additions. iFAKT not mentioned in the body, which is right for this topic. |

### Debate (Round 1)

- **What a setup "costs" (Finance and Practitioner vs. Academic).** Finance and the practitioner argued that S at a non-bottleneck is mostly not incremental cash and that the article should say so. The academic warned that this undermines the formulas the article teaches. Resolution: the formulas stay; Section 2 adds that S and H are partly imputed, that a bottleneck setup costs lost output, and that both values need controller sign-off. Section 5 already quantifies setup hours.
- **Length (SEO vs. Quality, Finance, Worker voice).** SEO warned that three additions would push the article over 5,000 words. Resolution: the additions are kept short and offset by tightening five passages the critic named (net result 4,957 words).
- **FAQ overlap (Critic vs. SEO).** The critic saw FAQ answers repeating the body. SEO wanted all nine questions for PAA coverage. Resolution: keep nine, shorten two answers.

### Changes after Round 1 (old -> new)

- Meta title count "(55 characters)" -> "(51 characters)"; description "(154 characters)" -> "(153 characters)".
- Section 2: new paragraph after the holding cost bullet: "Both are partly imputed. If the setup crew is paid whether it changes over or not … Agree both values with the plant controller … in regulated supply chains (AS9100, IATF 16949), the production lot is often also the traceability lot …".
- Section 4.4: "The Wagner-Whitin algorithm was considered computationally heavy when it was published, which motivated heuristics such as Silver-Meal [3][4]." -> "The Wagner-Whitin algorithm was long considered too complex for routine use, which motivated heuristics such as Silver-Meal [9]."
- Section 5.3: "Hopp and Spearman show in *Factory Physics* that batching adds waiting time" -> "Hopp and Spearman describe in *Factory Physics* how batching adds waiting time".
- Section 4.2: PPB bullet adds "(some systems use 'does not exceed' instead of 'closest', which can give slightly different lots)".
- Section 7: new sentences before the final caution: "More changeovers also mean more work for operators and setup technicians. SMED projects work when the people who do the changeover design the new standard …".
- Tightened: EPQ cycle-length paragraph (60 -> 40 words), "Why heuristics miss" paragraph, FAQ "Is fixed order quantity the same as EOQ?", FAQ "How does lot size affect OEE", first sentence of the Conclusion, opening of Section 4.

### Round 2

| Role | Verdict | Findings |
|---|---|---|
| Practitioner | satisfied | Setup cost caveat and bottleneck hours are what he would show his planners. |
| Academic | satisfied | PPB variant stated; complexity statements attributed correctly; NP-hardness worded as in the abstracts. |
| IT/OT architect | satisfied | No change. |
| Quality lead | satisfied | Traceability sentence is accurate without overclaiming a specific clause. |
| Finance | satisfied | Controller sign-off requested; discount example complete. |
| Worker voice and lean coach | satisfied | Operator workload and SMED co-design now explicit. |
| SEO specialist (US) | changes needed | FAQ heading should carry the keyword ("FAQ: lot sizing") and the TOC anchor must follow. |
| Fact checker | satisfied | Re-checked after edits: no numbers changed by the edits; sources [3], [6], [7], [8], [11], [12] re-opened or confirmed from this session's fetches; [5] and part of [4] remain [unverified] because index access (dblp, crossref, econbiz) was blocked or rate-limited. |
| Critic | satisfied | Additions are plain and short. |

### Changes after Round 2 (old -> new)

- H2 "## 10. FAQ" -> "## 10. FAQ: lot sizing"; TOC entry "[FAQ](#10-faq)" -> "[FAQ: lot sizing](#10-faq-lot-sizing)".

### Round 3

| Role | Verdict |
|---|---|
| Practitioner | satisfied |
| Academic | satisfied: models, assumptions and the heuristic-vs-optimum comparison are correct; no contradiction with the parent pillar's EOQ numbers (949 units, $7,589, 671 units at half setup cost) |
| IT/OT architect | satisfied |
| Quality lead | satisfied |
| Finance | satisfied |
| Worker voice and lean coach | satisfied |
| SEO specialist (US) | satisfied: keyword in title, description, H1, short answer, first paragraph and FAQ heading; parent pillar linked in the first 150 words and in Further reading; both siblings and five new pillars (sop-mrp, smed, kanban, theory-of-constraints, plus existing value-stream-mapping) linked in the body |
| Fact checker | satisfied with the open items listed below |
| Critic | satisfied: no em-dash chains, no AI clichés, no padding, no iFAKT promotion; disclosure exactly "Note: The author works at iFAKT GmbH." in the author box; no sponsorship label |

**Open [unverified] items for the editor (updated in round 4):** (1) closed: DeMatteis 1968 [5] confirmed via Crossref. (2) Silver and Meal 1973 [4]: volume and issue not confirmed (CiNii shows "2", pp. 64–74; no Crossref record). (3) Taft 1918 [2] cited via Wikipedia, original not consulted; Federgruen/Tzur and Wagelmans et al. [9] now with Crossref-confirmed bibliographic data and DOIs, full texts not opened. (4) Harris 1913 page numbers 135–136 carried over from the parent pillar. (5) Hopp/Spearman [14] statement paraphrased without page number. (6) Pillar anchor slugs to be checked after publication.

### Consensus

All nine roles sign off after Round 3. The article answers "lot sizing" with a complete, calculated comparison that none of the ranking pages offers, stays consistent with the parent pillar and leaves MRP mechanics to the planned S&OP/MRP pillar. Final word count H1 through Conclusion: **4,961 words** (`wc -w`, measured November 20, 2026; table separators count as tokens).

### Round 4: verification pass, November 20, 2026

Online checks by the fact checker (Crossref API). All access dates November 20, 2026. The shared WebFetch budget ran out during this pass.

| # | Item | Old -> new |
|---|---|---|
| 1 | [5] DeMatteis 1968 | "[title confirmed in an index listing; volume, issue, pages and author initials not confirmed online]" -> confirmed: J. J. DeMatteis, IBM Systems Journal 7 (1968) 1, pp. 30–38, DOI 10.1147/sj.71.0030 |
| 2 | [9] Federgruen/Tzur 1991, Wagelmans et al. 1992 | bibliographic data confirmed; DOIs 10.1287/mnsc.37.8.909 and 10.1287/opre.40.1.S145 added |
| 3 | [4] Silver and Meal 1973 | still unverified: no Crossref record (the journal predates DOIs); CiNii could not be re-opened (budget) |
| 4 | [1] Harris 1913 pages 135–136 | still unverified (budget) |
| 5 | [2] Taft 1918, [14] Hopp/Spearman page | still open (originals not openly accessible) |

No body text changed (sources and notes only); `wc -w` H1 through Conclusion stays 4,961 words.

- **Fact checker:** satisfied with the two closed items; remaining items are bibliographic details, not claims in the body.
- **Critic:** satisfied; nothing added to the article.
- **Subject expert (production planner):** satisfied; the lot-sizing rules and calculations do not depend on the open items.

### Round 5: SERP re-check and optimization, November 20, 2026

**Data source:** web (no NEURONwriter analysis exists for this keyword). US web searches for "lot sizing" and "lot sizing techniques in MRP" on November 20; ranking pages opened on November 23, 2026 after the fetch quota reset. Search-tool order used as an approximation of the google.com SERP; no live PAA box available.

**SERP findings:** the top results are now reference and research pages (IEEE TechNav approx. 550 words, arXiv, Taylor & Francis, Fiveable 1,100–1,200 words, O'Reilly, Infor and SAP documentation). The vendor pages and the forex lot-size pages from the first analysis were not in this check's top results. No page in the top results compares the rules on one dataset. Question not yet answered by us: "How is lot sizing different from EOQ?".

**Changes (old -> new):**
1. FAQ: 9 questions -> 10; new "How is lot sizing different from EOQ?" placed after "What is lot sizing in MRP?" (no new facts; summarizes sections 3 and 4).
2. JSON-LD: the new question added to the FAQPage markup; note "four of nine" -> "five of ten".
3. Competitive analysis: added the SERP re-check table.
4. Metadata: word count 4,961 -> 5,030 (inside the 5,300 tolerance).
Meta title, description and H1 unchanged: "lot sizing" plus "manufacturing", EOQ and EPQ already match the SERP. The manufacturing qualifier stays even though the forex results were not seen this time.

**Sign-off:**
- **SEO specialist:** satisfied; the textbook-style SERP fits the article's methods-and-examples structure; the new FAQ covers the one missing question.
- **Critic:** satisfied; the answer is short and does not repeat the EOQ/EPQ FAQ.
- **Fact checker:** satisfied; no new facts; statements match sections 3 and 4.
- **Subject expert (production planner / APS):** satisfied; the distinction between the decision and the rule is the one planners need when they set the ERP field.

**Word count after round 5:** 5,030 words (+69).
