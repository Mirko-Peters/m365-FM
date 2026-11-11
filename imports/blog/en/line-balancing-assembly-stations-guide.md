---
title: "Line Balancing in Assembly: How to Balance Work Across Stations"
summary: "Line balancing spreads assembly work over stations so each takes about the same time, just under takt. Learn the formulas, the steps and a worked example."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [line-balancing, takt-time, cycle-time]
keypoints:
  - "Line balancing distributes the work of an assembly line over its stations so that each station needs about the same time, close to but under the takt time."
  - "The minimum number of stations is the total task time divided by the takt time, rounded up to a whole number."
  - "Balance efficiency is total task time divided by the number of stations times the takt time, and it shows how much paid station time is used for work."
  - "A yamazumi chart stacks the work elements of each operator against the takt time, so unbalanced stations and waiting time become visible at once."
  - "A balance on paper must be tested on the line, because skills, ergonomics, variants and variation can move the real loads."
faq:
  - q: "What is line balancing in simple terms?"
    a: "Line balancing is dividing the work of an assembly line among its stations so that each station has about the same amount of work, close to the takt time. No station then holds up the others, and no operator waits for long. It lets the line meet demand with the fewest stations and operators."
  - q: "How do you calculate line balancing efficiency?"
    a: "Divide the total task time by the number of stations multiplied by the takt time, and write the result as a percentage. For example, 240 seconds of work on 5 stations with a 60-second takt gives 240 divided by 300, which is 80 per cent. The rest is idle time you can try to remove."
  - q: "What is the difference between takt time and cycle time in line balancing?"
    a: "Takt time is the pace set by customer demand: available production time divided by demand. Cycle time is the time a station actually needs for its work on one unit. A balanced line has every station cycle time slightly below the takt time, so the line meets demand without large idle times."
---

Line balancing means spreading the work of an assembly line over its workstations so that each one needs about the same time, close to but not above the takt time. This guide is for production managers who see operators waiting at some workstations while others run behind on the production line. You will learn the three numbers you need, a step-by-step method, a worked example with a small station count, and how to avoid the common traps.

## Line balancing in assembly: what it is and why it matters

Takt time is the pace set by your customers. The Lean Enterprise Institute (LEI) defines [takt time](https://www.lean.org/lexicon-terms/takt-time/) as the available production time divided by customer demand. In its example, a factory that works 480 minutes per day and needs 240 widgets per day has a takt time of two minutes. Each station on the line also has a cycle time, which is the time it needs to finish its work on one unit.

If one workstation needs 75 seconds and the takt is 60 seconds, that station is the bottleneck, and the production line cannot meet the required production rate. If another station needs only 30 seconds, its operator waits for half of every cycle. Both are signs of an unbalanced line. [Line balancing](https://www.m365.fm/entity/line-balancing/) moves work elements between stations until all of them are close to the takt time, and none is above it. A balanced line is the result; the line balance is the way the work is split.

The benefit is simple. A balanced line meets demand with fewer operators or with less overtime, and the idle time and waiting shrink. It also supports flow and production efficiency: work moves from station to station at an even pace, so there is less piling up between stations, and the production process is easier to control. This is why line balancing belongs to lean manufacturing, and why it is often paired with [takt time](https://www.m365.fm/entity/takt-time/) and [cycle time](https://www.m365.fm/entity/cycle-time/) analysis.

## The three numbers you need

An [open operations management textbook from eCampusOntario](https://ecampusontario.pressbooks.pub/opsmgmt/?p=1689) gives the basic formulas for balancing a line.

1. **Takt time** = available production time ÷ required output.
2. **Minimum number of stations** = total task time ÷ takt time, rounded up to a whole number.
3. **Balance efficiency** = total task time ÷ (number of stations × takt time).

The idle time per cycle is the number of stations times the takt time, minus the total task time. The textbook example shows the effect: 68 minutes of work at a 15-minute takt needs at least 5 stations, and with 5 stations the efficiency is 90.7 per cent. With 6 stations it falls to 75.5 per cent, because the sixth station adds idle time without adding output. The numbers show a trade-off. More stations make it easier to stay under the takt time, but each extra station costs idle time.

The formulas give the theoretical minimum. In practice, tasks cannot be split at will, and some tasks must come before others. So the real number of stations is often higher than the minimum. Check the bottleneck first: the longest single task sets a floor for the cycle time of any station that carries it.

## How to balance an assembly line: six steps to a better line balance

1. **List the tasks and their times.** Break the assembly into work elements, such as "fit bracket" or "tighten four screws". Measure the time of each at the line. Use observed times, not the times from the routing, if they differ.
2. **Record the precedence.** Write which task must come before which. Screws cannot be tightened before the bracket is fitted.
3. **Calculate the takt time** from demand and available time. Subtract breaks and planned stops from the available time.
4. **Calculate the minimum number of stations.** Divide the total task time by the takt time and round up.
5. **Assign tasks to workstations.** Start at the first workstation and add tasks in precedence order until the next task would push it above the takt time. Then open the next workstation. Try a few alternatives, because the first assignment is rarely the best.
6. **Check the balance.** Calculate the efficiency, and draw the loads in a chart.

The chart helps. LEI describes the [operator balance chart](https://www.lean.org/lexicon-terms/operator-balance-chart/), also called a yamazumi board, as a graphic tool where each operator gets a vertical bar built from the stacked work elements. The bars show each operator's workload compared with the takt time. The aim, in LEI's words, is a workload very nearly equal to, but slightly less than, the takt time. With the chart on a wall, the team can move blocks of work between operators and see the effect at once.

## Example: nine tasks, a 60-second takt

This is an illustrative example, not a measured case. Assume the production line must make 450 units in a 450-minute shift. The available time is 27,000 seconds, so the takt time is 60 seconds.

The assembly has nine tasks (times in seconds, with the tasks that must come first):

- A 20 (none), B 35 (after A), C 25 (after A), D 40 (after B), E 30 (after C)
- F 15 (after D and E), G 45 (after F), H 20 (after G), I 10 (after H)

The total task time is 240 seconds. The minimum number of stations is 240 ÷ 60 = 4. Now assign the tasks in precedence order:

- Station 1: A + B = 55 seconds
- Station 2: C + E = 55 seconds
- Station 3: D + F = 55 seconds
- Station 4: G = 45 seconds (adding H would give 65, above the takt)
- Station 5: H + I = 30 seconds

This needs five stations, not four. The efficiency is 240 ÷ (5 × 60) = 80 per cent. The line can meet the 60-second takt, since no station is above 55 seconds. But stations 4 and 5 have a lot of idle time.

Now the team works on task G, the longest one, with a fixture that shortens it from 45 to 30 seconds. The total is now 225 seconds, and the assignment becomes:

- Stations 1 to 3 as before (55 seconds each)
- Station 4: G + H + I = 30 + 20 + 10 = 60 seconds

Four stations now carry the work, and the efficiency is 225 ÷ (4 × 60) = 93.75 per cent. The line saves one station and its operator. A load of exactly 60 seconds leaves no safety margin, so in a real line the team would check whether the operator at station 4 can keep the pace. This shows the typical result: balancing finds the question, and improving the longest task gives the answer.

## What the balance on paper does not show

A balance calculation uses average times. Real lines are more complicated, and the workload of an operator is more than the sum of task times.

- **Variation.** Task times vary from unit to unit and from person to person. A station planned at 60 of 60 seconds will stall often. Plan a small margin below the takt time.
- **Skills and ergonomics.** Tasks must suit the person. A balance that puts all the heavy lifting on one station will not last.
- **Product variants.** On a mixed-model line, the load changes with the model. Balance for the product mix, not for one product.
- **Changing demand.** When demand changes, the takt changes, and the balance must be redone.

Trial the new balance on the line for a few shifts, and ask the operators where it feels wrong.

## Common mistakes

- **Using standard times from the routing without checking.** Observed times often differ, and the balance will be wrong.
- **Ignoring precedence.** An assignment that breaks the order of tasks cannot work.
- **Aiming for 100 per cent.** A line with no margin has no room for variation, so it stops and starts.
- **Balancing for the wrong takt.** If the takt is based on old demand, the balance will be off.
- **Forgetting the people.** Moving work between stations needs training time and a trial period.
- **Letting excess capacity hide the problem.** A spare operator or a buffer can cover a weak balance for months. Look at the idle time at each workstation.
- **Treating it as a one-off.** Product changes, new tools and kaizen improvements all change task times. Check the balance regularly.

## How software can help

For a few workstations, a spreadsheet and a yamazumi chart on the wall are enough to optimize the line balance. For many tasks, variants and precedence rules, software can search through assignments faster than a person can, and it can show the load of every station for each product mix. Simulation can also test how variation affects the line before you move any work.

## Next step

Take one assembly line this week, measure the time of each task at the station, and draw the yamazumi chart against the takt time. Then move one block of work and see what happens. That is a practical start for line balancing on your own line.
