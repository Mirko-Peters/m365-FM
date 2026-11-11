---
title: "How Many AGVs Do You Need? Sizing a Driverless Fleet"
summary: "How many AGVs do I need? Size a driverless fleet from moves per hour, trip time and utilisation, then check congestion with a simulation before you buy."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [automated-guided-vehicle, factory-simulation, bottleneck]
keypoints:
  - "Start with the transport workload: moves per hour times the time of one move gives the vehicle-hours needed per hour."
  - "A move includes loaded travel, empty travel, loading and unloading, and the vehicle also loses time to waiting, blocking and charging."
  - "Divide the workload by a target utilisation well below 100 per cent, round up, add a reserve, and then test the result in a simulation."
  - "Simple estimates tend to be too small: in a published teaching case, an analytic estimate of two vehicles gave poor move times, and a simulation led to three."
  - "More vehicles are not always better, because contention for track segments, intersections and stations can slow everything down."
faq:
  - q: "How do you calculate the number of AGVs?"
    a: "Multiply moves per hour by the time one move takes, including loaded travel, empty travel, loading and unloading, to get vehicle-hours per hour. Divide by a target utilisation below 100 per cent, round up, and add a reserve. Then test the result in a simulation, because congestion adds time."
  - q: "Why can a formula give too few AGVs?"
    a: "A formula averages the work and ignores waiting. Vehicles queue at stations, block each other at intersections and wait for loads. In a published teaching case, a simple estimate gave two vehicles, while a simulation showed long move times and led management to choose three."
  - q: "Can too many AGVs be a problem?"
    a: "Yes. More vehicles reduce the wait for a vehicle but increase contention for track segments, intersections and stations. One simulation case notes this can be counterproductive, and another model showed blocking rising from about 1 per cent with three vehicles to about 47 per cent with four. Look for the smallest number of vehicles that meets your targets."
---

How many AGVs do I need? Calculate the transport work in vehicle-hours per hour, divide it by a target utilisation well below 100 per cent, round up, and then test the result in a simulation, because queues and congestion add more time than a formula shows. This guide is for production managers who must justify the number of vehicles before buying an [automated guided vehicle](https://www.m365.fm/entity/automated-guided-vehicle/) system. You will learn the workload method, why simple estimates come out too small, a worked example with numbers, a five-step routine and the mistakes that cost the most.

## How many AGVs do I need? Start with the workload

Sizing begins with the work, not with the vehicle. The work is the number of moves per hour, and each move takes a certain time. A move is not only the drive with a load. In a teaching case in the book *Beyond Lean: Simulation in Practice* by Charles Standridge, published on [Engineering LibreTexts](https://eng.libretexts.org/Bookshelves/Industrial_and_Systems_Engineering/Beyond_Lean_-_Simulation_in_Practice_%28Standridge%29/17%3A_Automated_Guided_Vehicle_Systems/17.03%3A_Section_3-), vehicle utilisation is the sum of five parts: loaded travel, empty travel, blocked time, load time and unload time. The same case computes travel time from distance and vehicle speed, and it sets 30 seconds for each pickup and each drop-off.

From these parts, a first estimate follows. This is our own planning aid, not a standard:

1. **Time per move** = loaded travel + empty travel + load + unload.
2. **Workload** in vehicle-hours per hour = moves per hour × time per move in hours.
3. **Fleet size** = workload ÷ target utilisation, rounded up, plus a reserve for failures and maintenance.

The target utilisation must be well below 100 per cent. A single AGV that works all the time has no room for waiting at a station, for giving way at a crossing, or for charging at one of the charging stations. Which value is right depends on the layout and the traffic, and a simulation is the way to check it.


## Why the simple answer is often too small

A formula treats the work as an average and the AGVs as independent. In a plant, AGVs wait for each other.

The Standridge case shows the gap. The analytic estimate suggested two AGVs. The simulation then tested two and three AGVs over a 16-hour day, with 20 replications. With two AGVs, the average time to complete a move was 9.4 minutes, and the maximum time averaged about 81.5 minutes. With three, the average fell to about 3.1 minutes, utilisation was roughly 80 per cent, and about 11.8 per cent of the time was lost to congestion. Management chose three. The author concludes that simulation was needed to find the trade-off between responsiveness and contention.

An older [paper by Onur Ulgen and Pankaj Kedia](https://pmcorp.com/wp-content/uploads/2020/06/Using-Simulation-in-Design-of-a-Cellular-Assembly-Plant-with-AGV.pdf) from the modelling firm Production Modeling Corporation, without a stated year, compares an analytic method with simulation for a cellular assembly plant. The authors' model reached its best throughput with three AGVs, while the analytic method gave two. When they cut all cycle times to a tenth, the analytic method gave five AGVs and the simulation 11. Their model also showed blocking rising from about 1 per cent with three AGVs to about 47 per cent with four. These are results of simplified models, and the authors have an interest in simulation tools, so treat them as an illustration of the pattern, not as a rule.

Both sources agree on two points. A first formula is a useful start, and congestion makes the real answer different. The Standridge case adds that adding AGVs reduces move times but increases contention for control points and track segments, which can be counterproductive.

That last point has a practical consequence. If the real limit is a [bottleneck](https://www.m365.fm/entity/bottleneck/) such as one pickup station, a narrow aisle or a shared crossing, more AGVs will not help. They only queue at the same place. Find the bottleneck before you add AGVs.

## Different types of AGVs and AGV navigation: what changes for sizing

AGVs come in several types, for example towing AGVs that pull carts, unit load AGVs that carry a pallet or a tote, and automated forklifts. The type decides which loads can be moved and how long loading and unloading take, so it changes the load and unload values in the workload method. Navigation is the second difference. Classic AGVs follow a fixed guide, such as magnetic tape or an optical line, or they use laser navigation with reflectors. Autonomous mobile robots (AMRs) find their own way around obstacles. More flexible navigation changes the routes you can offer, but it does not change the logic of the workload. Classic AGVs and AMRs both queue at stations and share aisles, so the guide to sizing stays the same. Ask the supplier which navigation technology suits your floor, and what speed the vehicle really keeps in curves and near people.

## AGV integration: what the AGV system adds to the vehicles

The vehicles are only one part of an AGV system. The control system gives each vehicle its next transport order, for example from a warehouse management system (WMS) or from the line's call signals, and it manages the traffic on the routes. A safety sensor on each AGV lets it stop before a collision with a person or an obstacle, and every such stop adds waiting time that the workload method does not see. Where the AGVs hand over loads to a conveyor, a lift or a forklift, the interface decides how long a vehicle waits. In material handling projects, these details can decide whether the productivity target is met. For sizing, ask the supplier for the real-time behaviour of the traffic control, because it determines how much time the AGVs lose at crossings.

## Warehouse automation and production: where AGVs run

AGVs appear in warehouses, in production and between the two, and the benefits of AGVs are the same in both: steady transport at a known cost per move, without a driver for every route. In a warehouse, they can take over routes that a forklift drives today, and the transport orders come from the warehouse management system. In production, they feed lines, collect finished goods and link cells that a conveyor cannot reach. The type of route changes the sizing. A warehouse loop with many short moves is limited by the stations and the aisles. A production loop with fewer, longer moves is limited by travel time. Automate the routes with the highest and most regular volume first, because their workload is predictable and the productivity gain is easy to measure. An operator who loads and unloads at a station adds variation, so include the handling time in the load and unload values. Treat the project as the automation of a workflow, not only as a purchase of vehicles, and let multiple AGVs share one traffic control that is integrated with the systems that create the orders.

## Example: a line-feeding loop

This is an illustrative calculation, not a measured case. A plant moves material from a warehouse to a line. The peak demand is 120 moves per hour.

- Loaded travel: 150 metres at an effective speed of 1.2 metres per second, which includes slow zones, is 125 seconds.
- Empty travel back to the next pickup: on average 90 metres, which is 75 seconds.
- Loading 20 seconds and unloading 20 seconds.

The time per move is 125 + 75 + 20 + 20 = 240 seconds, or 4 minutes.

The workload is 120 moves × 4 minutes = 480 vehicle-minutes per hour, which is 8 vehicle-hours per hour. At a target utilisation of 75 per cent, a planning figure that allows for waiting, charging and congestion, the number of AGVs is 8 ÷ 0.75 = 10.7, so 11 AGVs. With one vehicle in reserve for a failure, the first estimate is 12.

Now test the sensitivity. If peak demand grows by 20 per cent to 144 moves per hour, the workload is 9.6 vehicle-hours, the number is 12.8, so 13 AGVs, and 14 with the reserve. Each 10 per cent of volume costs about one vehicle. Check also what happens with a longer route: if the loaded route grows from 150 to 200 metres, the loaded travel rises from 125 to about 167 seconds, and the time per move to about 282 seconds, which raises the need to 13 AGVs without reserve.

The estimate is a starting point. The team then models 10, 11, 12 and 13 AGVs in a simulation with the real layout, the crossings, charging and the peak hours. The decision rule is its own choice, for example: the smallest number of AGVs where the longest move times and the congestion share stay within the limits the production line can tolerate. The simulation may show that 12 is enough, or that a crossing needs a rule change before the fleet can grow.

## How to run the sizing in five steps

1. **Collect the moves.** Count moves per hour by route and by hour of the day, not just the average. The peak sets the fleet.
2. **Measure the route.** Take the distances, the real speeds including slow zones and doors, and the load and unload times, from a test drive or the layout.
3. **Compute the first estimate** with the workload method, and note the assumptions for utilisation, charging and reserve.
4. **Simulate.** Model the AGVs, the crossings, the stations, the charging and the failures. Run the peak hours and the growth case.
5. **Decide with criteria and a review date.** Choose the smallest number of AGVs that meets your targets with a margin, and plan to check the numbers after the first months of operation.

## Common mistakes

- **Sizing for the average hour.** The peak hour decides whether the line gets its material on time.
- **Forgetting empty travel.** The vehicle must drive to the next pickup, and that time counts as work.
- **Ignoring charging, breakdowns and maintenance.** A vehicle on a charger or in repair does not carry loads. Plan the availability, not the nameplate.
- **Assuming that more AGVs always help.** Contention can raise the waiting time again, as the sources show.
- **Overlooking the stations.** If a pickup point serves only a few loads per hour, it limits the system, whatever the fleet.
- **Trusting a single number.** A formula gives a start. The decision needs a test with the real layout and the peak.

## How software can help

[Factory simulation](https://www.m365.fm/entity/factory-simulation/) is a controlled model of how work moves through part of a factory, using current operating rules, resources, orders and normal variation, so that a change can be tested before it is made. For a fleet, a model can test the number of AGVs, the traffic rules, the charging and the peak hours. In operation, fleet management software takes over the dispatching and the traffic control of the AGVs. The simulation supports the decision. People still choose the targets.

## Next step

Take the peak hour of one transport route, measure the time of a move from pickup to the next pickup, and run the workload method. Then ask a simulation to answer the question how many AGVs do I need when the AGVs queue, charge and share the aisles.
