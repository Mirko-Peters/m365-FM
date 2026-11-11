---
title: "OEE Explained: Formula, Benchmarks and How to Improve It"
summary: "OEE shows how much planned production time is truly productive. Learn the OEE formula, six big losses, benchmarks and how to improve it, with an example."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [oee, polaris-analyzer]
keypoints:
  - "OEE measures fully productive time, making only good parts as fast as possible with no stops, as a share of planned production time."
  - "OEE equals availability times performance times quality. Availability is run time divided by planned production time."
  - "The six big losses sort into three groups: stops, slow running and defects. Each loss belongs to one OEE factor."
  - "An OEE of 85% is often called world class, but Vorne says most manufacturers are closer to 60%. Compare against your own past, not others."
  - "Improve the biggest loss first. Both planned and unplanned stops are improvement opportunities."
faq:
  - q: "What is OEE?"
    a: "OEE, or overall equipment effectiveness, shows how much of your planned production time is truly productive. It multiplies three factors: availability, performance and quality. A score of 100% means you make only good parts, as fast as possible, with no stops. The number is useful mainly because it points to the biggest loss."
  - q: "How do you calculate OEE?"
    a: "Calculate OEE as availability times performance times quality. Availability is run time divided by planned production time. Performance is ideal cycle time times total count divided by run time. Quality is good count divided by total count. A simple alternative is good count times ideal cycle time, divided by planned production time."
  - q: "What is a good OEE score?"
    a: "An OEE of 85% is often thought of as world class, based on 90% availability, 95% performance and 99% quality in discrete manufacturing. Most plants are lower, and the right target depends on the process. Set a stretch goal that you can reach within a few months, and compare your line with its own history."
---

OEE, short for overall equipment effectiveness, shows how much of your planned production time is truly productive. This article is for production planners and plant managers who want to understand the OEE formula, read the score correctly and improve it. It explains the three factors, the six big losses, what benchmarks mean, a worked example with numbers and the mistakes that make the score misleading.

## What is OEE, or overall equipment effectiveness?

[Vorne Industries](https://www.oee.com/calculating-oee/), the company behind the OEE.com site, describes the score as the share of planned production time that is fully productive. Fully productive time means making only good parts, as fast as possible, with no stops. A score of 100% is that ideal. Everything below it is a loss.

The idea has three OEE components. Each one answers one question.

- **Availability:** was the line running when it should have been?
- **Performance:** did it run at full speed while it was running?
- **Quality:** were the parts good?

The score is the product of the three. That is why a line can look busy and still have a low [overall equipment effectiveness](https://www.m365.fm/entity/oee/) result. Machine performance and the manufacturing process both matter here. Each factor takes a bite out of the planned time.

[MachineMetrics](https://machinemetrics.com/blog/manufacturing-kpis) describes the measure in the same way. It says the score tells manufacturers how well their machine assets are running, and that it should ideally be used alongside other metrics.

## How do you calculate availability, performance and quality?

The OEE formula is short, and the OEE calculation needs only a few counts from the shift. Start with the time. Vorne defines planned production time as the shift length minus breaks. Stop time then includes both unplanned stops, such as breakdowns, and planned stops, such as changeovers.

1. **Availability = run time ÷ planned production time.** Run time is planned production time minus stop time. Availability captures stops long enough to record a reason, typically several minutes.
2. **Performance = (ideal cycle time × total count) ÷ run time.** It captures running below maximum speed, including slow cycles and small stops. Performance should not exceed 100%. If it does, the ideal cycle time is probably set too high.
3. **Quality = good count ÷ total count.** It captures parts that fail quality standards, including parts that need rework. It resembles first pass yield.
4. **OEE = availability × performance × quality.**

There is a simple alternative: good count × ideal cycle time, divided by planned production time. It gives the same result. It does not show which of the three factors causes the loss, so the standard OEE calculation stays the main view, and the simple form serves as a check.

Vorne gives a worked example for one shift. The shift is 480 minutes with 60 minutes of breaks and 47 minutes of downtime. The ideal time per widget is 1.0 second. The line makes 19,271 widgets, and 423 are rejects.

- Planned time: 480 − 60 = 420 minutes.
- Running time: 420 − 47 = 373 minutes.
- Availability: 373 ÷ 420 = 88.81%.
- Performance: 19,271 seconds ÷ (373 × 60 seconds) = 86.11%.
- Quality: (19,271 − 423) ÷ 19,271 = 97.80%.
- OEE: 0.8881 × 0.8611 × 0.9780 = 74.79%.

If you do the OEE calculation by hand for the first time, check it with the simple formula. Both results must match.

## What are the six big losses?

Vorne links the three factors to [six big losses](https://www.oee.com/oee-six-big-losses/). Each loss belongs to one factor, and the list tells you where to look.

- **Equipment failure** (availability): unplanned stops while the equipment is scheduled to run, such as tooling failure and breakdowns. Equipment failures like these are the first loss to check.
- **Setup and adjustments** (availability): planned stops for changeovers, adjustments, cleaning and warm-up.
- **Idling and minor stops** (performance): brief stops, usually a minute or two, cleared by an operator, such as jams and misfeeds.
- **Reduced speed** (performance): running slower than the ideal cycle time, for example because of worn equipment or poor lubrication.
- **Process defects** (quality): defective parts, including scrap and rework, during steady production.
- **Reduced yield** (quality): defective parts from startup until production is steady.

Idling and minor stops and reduced speed are the performance losses. This list is the main value of the method, because it helps you improve your OEE where it counts. A single percentage cannot tell a planner what to do. The loss behind it can.

## What is a good score for equipment effectiveness?

You will often hear that 85% is world class. Vorne says on its [world-class page](https://oee.com/world-class-oee) that it is often thought that a world-class score is 85%, and that this figure rests on 90% availability, 95% performance and 99% quality. It adds that these goals apply to discrete manufacturing, not to process industries.

The source also gives context that is easy to miss:

- The figures date back to Seiichi Nakajima in the early 1970s, in Japan, in the automotive industry.
- Most manufacturers still have scores closer to 60%.
- Vorne says it sees more plants below 45% than above 85%.

These OEE benchmarks are a reference, not a rule. So do not treat 85% as a pass mark. Vorne advises against fixating on the absolute value, and against comparing dissimilar processes or relying on external benchmarks. It recommends setting a stretch goal that is truly achievable, preferably within three or four months. The only target that really matters is the one that improves your own process.

## How do you implement and improve it step by step?

Work on the biggest loss, not on the percentage. To improve OEE, find the loss first, then the cause.

1. **Measure for a few weeks.** Record stop reasons, counts and rejects for each shift. Do not guess.
2. **Split the loss.** Which of the three factors is lowest? Which of the six losses sits behind it?
3. **Pick one loss.** Work on the largest one with the team that runs the line.
4. **Attack the cause.** Both planned and unplanned stops are improvement opportunities, according to Vorne. Short changeovers, better maintenance routines and clear material supply are typical actions. Quality problems call for a root cause analysis.
5. **Fix the standard.** Once a change works, write it into the standard work and train all shifts.
6. **Review weekly.** Show the factors on a board, and discuss them in the daily meeting.

For a planner, there is one more lever: the schedule. Frequent changeovers, small batches and missing material show up as stops. A realistic plan prevents some of these stops before they happen, which lifts productivity on the whole production line.

## Example: overall equipment effectiveness from 66.7% to 77.1%

This is an illustration with made-up numbers.

A line has 420 minutes of planned time. The ideal time per unit is 0.5 minutes, which is 2 units per minute. Stops take 70 minutes. The line makes 595 units, and 560 are good.

- Running time: 420 − 70 = 350 minutes.
- Availability: 350 ÷ 420 = 83.3%.
- Performance: (0.5 × 595) ÷ 350 = 85.0%.
- Quality: 560 ÷ 595 = 94.1%.
- OEE: 0.833 × 0.85 × 0.941 = 66.7%.

Check: 560 × 0.5 ÷ 420 = 280 ÷ 420 = 66.7%.

The team sorts the losses. Stops are the largest. It shortens a changeover and fixes a recurring feeder jam, so stop time falls by 25 minutes to 45. It also clears minor stops, and performance rises to 90%. A new inspection step lifts quality to 96%.

- Running time: 420 − 45 = 375 minutes.
- Availability: 375 ÷ 420 = 89.3%.
- Total count: 0.90 × 375 ÷ 0.5 = 675 units.
- Good count: 675 × 0.96 = 648 units.
- OEE: 0.893 × 0.90 × 0.96 = 77.1%.

Check: 648 × 0.5 ÷ 420 = 324 ÷ 420 = 77.1%.

The line now makes 648 − 560 = 88 more good units per shift in the same planned time. The numbers are assumptions. Use your own data, and check the ideal speed first.

## Common mistakes

- **Chasing 85%.** The figure comes from a particular time, place and industry. Compare your line with its own history.
- **Comparing dissimilar machines.** A score for a slow batch process and a fast packaging line cannot be compared.
- **A wrong ideal speed.** If the ideal time per unit is set too high, performance goes above 100%. If it is set too low, the loss hides.
- **Leaving out stops.** If planned stops are removed from the stop time, the score looks better, but the loss stays.
- **Looking at the percentage only.** The three factors and six losses show where to act.
- **Making products nobody needs.** The score rises when the line runs fast, even if the output is not needed. Check it together with delivery and stock.
- **Collecting data by hand without checks.** Small stops are easy to miss. Check the numbers against what you see at the line.

## How software can help

Manual OEE tracking on paper works for a pilot. It gets hard with many lines and shifts, where OEE software or a manufacturing execution system can record stops automatically. iFAKT's [Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/) provides KPI dashboards across all modules that compare planned and actual values in production. Use such a dashboard to show losses next to the plan, and make sure the definitions match what the team uses at the line.

## Next step

Pick one line and calculate your OEE score for one shift by hand, with availability, performance and quality shown separately. Then list the three biggest losses and choose one to work on this month.
