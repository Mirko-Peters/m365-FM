---
title: "Scrap Rate in Manufacturing: How to Calculate and Reduce It"
summary: "Scrap rate in manufacturing is the share of units you throw away. Learn the formula, how scrap differs from rework, what it costs and how to reduce scrap."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [scrap-rate, poka-yoke, oee]
keypoints:
  - "Scrap rate is the share of produced units that cannot be sold or reworked and are discarded: scrapped units divided by total units produced, times 100."
  - "Scrap and rework are different losses, so count them in separate columns and apply the same line between them on every shift."
  - "A scrap rate in per cent hides the cost, so also record the cost per scrapped unit, which includes material, labour and machine time up to the point of scrapping."
  - "Rank scrap by cause, machine, shift, product and material batch before you act, and fix the largest cause with a root cause method."
  - "Prevention beats sorting: poka-yoke, stable maintenance and clear standard work remove causes, while extra inspection only finds the damage."
faq:
  - q: "What is a good scrap rate in manufacturing?"
    a: "There is no single good figure, because it depends on the process, material and product. Many sources quote targets of a few per cent, but they are not comparable across industries. Use your own history and your best line as the benchmark, then lower it step by step by removing the largest causes."
  - q: "What is the difference between scrap and rework?"
    a: "Scrap is output that cannot be salvaged and is thrown away or recycled. Rework is output that needs extra processing and can then be sold. Rework still costs time and material, and OEE counts it as a quality loss, but it is a different problem with different fixes."
  - q: "How do you calculate the cost of scrap?"
    a: "Multiply the number of scrapped units by the cost each one had collected when it was discarded, which is material plus labour and machine time up to that step. Add disposal costs and subtract any scrap or recycling value. A part scrapped at the last step costs more than one scrapped at the first."
---

Scrap rate in manufacturing is the share of the units you make that you cannot sell or rework and have to throw away. You calculate it by dividing scrapped units by total units produced and multiplying by 100. This guide is for plant managers who see scrap in the monthly report and want to know what it costs and how to bring it down. You will get the formula, a worked example with cost, the main causes and a five-step route to reduce scrap.

## What scrap is, and how it differs from rework

Scrap is output that is unusable and cannot be salvaged. Rework is output that needs further processing before it can ship. The [glossary of the maintenance software vendor Tractian](https://tractian.com/en/glossary/scrap-rate) puts it this way: if a part cannot be salvaged or safely used, it belongs in the scrap column. It also stresses that you must draw a clear line between scrapped, reworkable and in-spec units, and apply it the same way on every shift. That is a vendor source, but the advice is sound and easy to check in your own plant.

The two losses look similar in a report and behave differently on the floor. Rework costs time, labour and sometimes a second machine pass. Scrap costs the material and everything done to it so far. The quality control view and the cost view differ: inspection counts the defects, and finance counts the money. In OEE, both reduce the quality factor. The [OEE.com page on the quality factor](https://oee.com/oee-factors/) defines good parts as those that pass through the process the first time without rework, so quality in OEE works like first pass yield. Rework parts count as a loss even if they are fixed later.

The [scrap rate](https://www.m365.fm/entity/scrap-rate/) is therefore one of the basic quality measures in a plant. It also feeds directly into [OEE](https://www.m365.fm/entity/oee/).

## Scrap rate in manufacturing: the formula and its variants

The basic formula is:

**Scrap rate (%) = scrapped units ÷ total units produced × 100**

Tractian gives a simple calculation: a shop produces 2,000 units in a week and scraps 100, so the scrap rate is 5 per cent. The related quality rate is the good share, which is (total produced minus total scrap) ÷ total produced × 100. In that example, it is 95 per cent.

Three choices change the number, so write them down before you compare periods or lines:

- **Denominator.** Some plants divide by units started, others by units finished. Pick one.
- **Unit.** Count pieces for discrete parts, kilograms or metres for bulk and continuous material. Offcuts from cutting or punching may be reported separately from defective parts.
- **Point of count.** Include scrap found at every stage, not only at final inspection. Otherwise early scrap vanishes from the metric.

A rate in per cent does not show money. A part scrapped at the last step carries all the material and labour that went into it. A part scrapped at the first step carries almost none. So track the scrap cost too, as described next.

## Example: calculate scrap rate and scrap cost for one week

This is an illustrative calculation, not a measured result. A line makes 12,000 units in one week. The line records 360 units as scrap and 480 units as rework.

- **Scrap rate:** 360 ÷ 12,000 × 100 = 3.0 per cent.
- **Rework rate:** 480 ÷ 12,000 × 100 = 4.0 per cent.
- **First pass quality:** (12,000 − 360 − 480) ÷ 12,000 = 93.0 per cent. This is what the OEE quality factor would show.

Now the cost. Assume the raw material is 6.00 per unit. Assume the labour and machine time up to the point of scrapping is 4.00 per unit on average. Assume disposal costs 0.20 per unit and recycling returns 0.50 per unit.

- Cost per scrapped unit: 6.00 + 4.00 + 0.20 − 0.50 = 9.70.
- Weekly scrap cost: 360 × 9.70 = 3,492.
- Over 50 weeks: about 174,600.

If the team removes one third of the scrap, the saving is about 58,000 per year before the cost of the fix. The quality magazine article on the [cost of quality](https://www.qualitymag.com/articles/94524-cost-quality-and-cost-of-quality) lists rework and scrap under internal failure costs, the costs of products that fail before they leave the plant. Use the same logic: put a money figure on scrap, so that management sees it next to other costs and can judge the savings.

## How to measure scrap and find the root causes

Tractian lists the common causes: errors in process steps, poor or inconsistent material quality, unplanned equipment deviations, human error during set-up or operation, and inadequate preventive maintenance. Worn tooling, misaligned fixtures and drifting motors can all push a process out of specification.

You cannot tell which cause matters in your plant without data. Break the scrap down by:

1. **Cause code**, from a short list that operators can use at the line.
2. **Machine or station**, to find where it happens.
3. **Shift and day**, to see whether people or routines differ.
4. **Product and material batch**, to link scrap to a supplier lot or a recipe.

Then rank the causes in a Pareto chart. In many plants a few causes explain most of the loss. That ranking is your work list. To measure scrap well, weigh or count at the station, record the reason on the spot and keep the manufacturing process step in the record.

## What is an acceptable scrap rate?

There is no universal answer. Tractian's glossary says most operations aim for scrap rates under 5 per cent and that top plants in precision industries often get below 2 per cent. It gives no source for these figures, so treat them as a rough orientation from one vendor, not as a standard. A process that cuts sheet metal, one that moulds plastic and one that assembles electronics have different material yields and different tolerances. Compare each line with its own history and with your best comparable line. Then set a target that you can reach by removing named causes, not by wishing.

## How to reduce scrap in five steps

1. **Measure honestly.** Record every scrapped unit with a reason, where it happens, not later in the office. If you only count at the end of the shift, the details are gone.
2. **Rank the causes.** Use the breakdown above. Pick the one with the highest cost, not only the highest count.
3. **Go and see.** Visit the station and watch the scrap being made. Ask why five times to reach the root cause.
4. **Remove the cause.** Prevention is better than sorting. Corrective actions fall into a few groups. Typical measures are [poka-yoke](https://www.m365.fm/entity/poka-yoke/) devices that stop the wrong part or setting, clear work instructions, tool and fixture maintenance, predictive or preventive maintenance of the equipment, and better incoming control of raw material with the supplier. Statistical process control can warn you when a process drifts, before it produces scrap.
5. **Check and hold the gain.** Track the weekly rate for the cause. If it falls, update the standard work. If it does not, the root cause was wrong, and you go back to step 3.

Operators know the places where the process is fragile. Ask them first.

## Common mistakes

- **Mixing scrap and rework.** One column for both makes the number meaningless. Keep them apart.
- **Comparing rates across different processes.** A scrap rate for machined parts and one for food or textiles measure different things. Compare a line with its own past.
- **Looking only at the percentage.** A small rate on an expensive part can cost more than a large rate on a cheap one. Add the cost per unit.
- **Counting only final inspection.** Scrap found early, or scrap that is quietly recycled, never reaches the report.
- **Adding inspection instead of removing the cause.** More checking finds more scrap and does not make less.
- **Blaming operators.** If a process produces scrap on all shifts, the process is the problem.

## How software can help

An ERP or manufacturing execution system can record scrap against the work order, with a reason code, machine, shift and material batch, as soon as it happens. It can show the rate and the cost per cause on a dashboard in real-time, and it keeps the history that you need for a before-and-after comparison. The software does not find the root cause, but it shows you where to look first.

## Next step

Take last month's scrap, split it into scrap and rework, and put a cost on each cause. Then pick the biggest one and visit the station this week. That is the practical start for any scrap rate in manufacturing programme.
