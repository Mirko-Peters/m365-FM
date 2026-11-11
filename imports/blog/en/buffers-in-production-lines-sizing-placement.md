---
title: "Buffers in Production Lines: How to Size Them and Where to Put Them"
summary: "Buffer management in production decides where work may wait between stations. Learn how to size buffers, where to place them and how to protect the constraint."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [buffer-management, factory-simulation, theory-of-constraints]
keypoints:
  - "A buffer between two stations lets one keep working when the other stops, so it prevents starvation (no work to process) and blocking (no space to pass work on)."
  - "Put the first and the largest buffer in front of the constraint, because time lost there is output lost for the whole line."
  - "Size a buffer to the stop you want to survive: downstream rate times stop duration, plus a margin, and check that the upstream station can refill it."
  - "The first buffer slots give most of the gain; throughput rises with total buffer capacity at a decreasing rate, so more buffer adds waiting time faster than output."
  - "Test buffer sizes with real stop data and, for complex lines, with a simulation, and review them when the product mix or the stops change."
faq:
  - q: "What is a buffer in a production line?"
    a: "A buffer is a place or a limit for work in process between two stations. It lets the upstream station keep working when the downstream station stops, and the downstream station keep working when the upstream one stops. It trades extra stock and waiting time for steadier output."
  - q: "How big should a production buffer be?"
    a: "Cover the typical stop you want to survive: multiply the downstream rate by the stop duration and add a margin. Check that the upstream station has spare capacity to refill the buffer between stops. Beyond the typical stop, a larger buffer adds stock and lead time without adding output."
  - q: "Where should buffers be placed in a production line?"
    a: "First in front of the constraint, because lost time there is lost output for the whole line. Then at points where one station stops often and independently, where processes run at different rates or in batches, and before shipping. Elsewhere, keep buffers small, because every slot adds waiting time."
---

[Buffer management](https://www.m365.fm/entity/buffer-management/) in production means deciding where work in process may wait between stations, and how much of it. As a rule, size each buffer to the stop it must absorb, put the largest one in front of the constraint, and keep the others small. This guide is for production managers who see lines stop because a neighbouring station stopped. You will learn what a buffer does, where to place it, how to size it, a worked example with numbers, and how to keep it working.

## Buffer management in production: what a buffer is for

A line is a chain of stations. When one stops, its neighbours soon feel it. The paper by Birkan Can, Andreas Beham and Cathal Heavey, presented at the [2008 Winter Simulation Conference](https://www.informs-sim.org/wsc08papers/225.pdf), describes the two failure modes. A machine is starved if there is no job to process in its upstream buffer. It is blocked if the job cannot be passed on because there is no space in the downstream buffer. A buffer between two stations is the cushion against both. It lets the upstream station keep working when the downstream one stops, and the downstream one keep working when the upstream one stops.

A buffer is not free. It is inventory in the process, so it adds waiting time and delay to every part that passes through it. It also takes space and can hide problems. The art is to hold enough to protect output and no more.

Buffers come in different forms. A time buffer is a planned amount of time or a planned lead in the schedule. A storage buffer holds goods. The warehouse equipment vendor Mecalux describes a [storage buffer](https://mecalux.com/blog/storage-buffer) as an area that temporarily houses goods, used when supply and demand rates do not coincide or as a handover between two processes. It distinguishes supply buffers, which hold raw materials or semi-finished parts near the line, from dispatch buffers, which sequence orders for shipment. That is a vendor source, so treat the benefits it lists as the vendor's view. At the plant door, a receiving buffer of raw materials can also protect the line from a delay somewhere in the supply chain. The idea fits a line equally well on a smaller scale: a few parts on a conveyor, a rack of trays, or a marked floor area between two machines.

## Where to put buffers

You cannot buffer everywhere, and you should not try. A buffering strategy picks a few places on purpose, and operations teams then manage them. These placement rules are our own planning aid, not a standard.

1. **In front of the constraint.** The [theory of constraints](https://www.m365.fm/entity/theory-of-constraints/) holds that the constraint sets the pace of the whole system. The [encyclopedia entry on the theory](https://www.encyclopedia.com/management/encyclopedias-almanacs-transcripts-and-maps/theory-constraints) describes the buffer as time or stock that protects throughput. If the constraint waits for parts, the line loses output that nobody can recover. A buffer here is the most valuable one.
2. **Behind stations that stop often and for long.** Place it so that its stops do not reach the constraint. A press that has a long tool change every shift is a candidate.
3. **At points where the rate or the batch changes.** An oven that takes a batch of 50 and releases it, or a station that runs faster than its neighbour, needs a place for the difference.
4. **Before shipping.** A small buffer lets you sequence orders and load a truck in the right order.
5. **Nowhere else, at first.** A station that is neither unreliable nor next to the constraint rarely needs a buffer. Start with the places above and add more only if the data shows a loss.

Behind the constraint, a buffer only needs to be big enough that a short stop downstream does not block the constraint.

## How to size a buffer

The size follows from the stop you want to survive, and the variability of the stops matters more than their average. The method has three questions.

- **How long are the stops?** Measure the typical duration of the stops of the upstream station, from the machine data or a few weeks of notes. Do not use the longest stop of the year. Pick the stop that happens often enough to cost real output.
- **How fast does the downstream station consume?** Multiply the consumption rate by the stop duration. That gives the number of parts the buffer must hold. Add a margin, for instance 20 per cent, to cover variation.
- **Can the buffer refill?** The upstream station needs spare capacity. If it runs at the same rate as the downstream one, the buffer never refills after a stop, and it stays empty from then on.

The size does not have to be exact, because the returns diminish. The Can, Beham and Heavey paper notes that throughput is a concave, increasing function of the total buffer capacity. Put simply, the first slots add the most, and each further slot adds less. In the 9-station test line of the paper, with a budget of eight buffer slots, the best allocation put one slot in each gap between stations. This is an academic benchmark, not a rule for your line, but it shows that a few small buffers in the right places beat a few large ones in the wrong place.

## Example: a feeder, a constraint and a packer

This is an illustrative calculation, not a measured case. Station A feeds station B, and B feeds the packer C. A can make 60 parts per hour, B can make 50 and C can make 55. B is the constraint. The shift is 8 hours.

A stops for 20 minutes about three times per shift for tool changes and small faults. Without a buffer between A and B, B starves during each stop. B consumes 50 parts per hour, so 20 minutes is 50 × 20 ÷ 60 = about 17 parts. Over three stops, B loses about 50 parts per shift. B's capacity is 50 × 8 = 400 parts, so the loss is 12.5 per cent of the output of the whole line.

**Size.** The buffer must hold about 17 parts to cover one stop. With a margin of 20 per cent, we set it at 20 parts.

**Refill check.** A has spare capacity of 60 − 50 = 10 parts per hour. To refill 17 parts takes about 1.7 hours. With three stops per shift, A runs about 7 hours, so it has 70 parts of spare capacity, which is more than the 50 parts it must refill. The buffer works. If the stops came every hour, it would not.

**Cost.** Twenty parts at 50 per hour is 24 minutes of waiting time, which is added to the lead time when the buffer is full. The gain is about 50 parts per shift, roughly 12.5 per cent more output at the constraint.

**Too big.** A buffer of 100 parts would add 2 hours of waiting, and it would not add output as long as stops last 20 minutes. It would only be useful for a rare 2-hour stop. Decide whether that stop deserves its own cover, or a repair plan.

**Behind B.** C is faster than B, so it takes what B makes. A buffer of a few parts is enough to keep B from being blocked if C stops for a short time.

## How to run the buffers

A buffer is a living part of the line, not a number on a drawing. The theory of constraints calls this buffer management: the contents of the buffers are used to set priorities for expediting, and the frequency of missing items shows where to improve.

1. **Mark the buffer.** Give it a fixed place and a visible size, for example three zones: full, half, nearly empty.
2. **Read the signal.** A buffer that is often empty means that the upstream station is too slow or too unreliable. A buffer that is always full means that the downstream station is the limit, or that the buffer is too big.
3. **Look for the cause.** Each time the buffer drops to the lowest zone, ask why. The answer is usually a repeat problem that can be fixed.
4. **Adjust the size.** Change it when the stops, the product mix or the rates change. Review it every few months.
5. **Test big changes.** If you consider changing the layout or adding a station, a simulation can test the buffer sizes on your own stop data before you build anything.

## Common mistakes

- **Buffers everywhere.** Each buffer adds waiting time. Most of them add nothing.
- **Sizing for the worst stop of the year.** The line then carries stock all year for one event.
- **No refill capacity.** If upstream is as slow as downstream, a buffer is a one-shot cushion.
- **Hiding a chronic problem.** A buffer that covers a machine that stops every hour only postpones the fix.
- **Never looking at the contents.** The state of the buffer shows where the line loses time. Ignoring it wastes the best signal you have.
- **Copying numbers from another line.** Rates, stops and mix are different, and so is the right size.

## How software can help

A manufacturing execution system records the duration and frequency of stops, which are the inputs for sizing. For lines with many stations, [factory simulation](https://www.m365.fm/entity/factory-simulation/) can run the line with different buffer sizes and placements, using real stop data, and show the effect on output and lead time. That is cheaper than trying it on the floor. The simulation shows what happens in the model. The decision about what to change remains with the team.

## Next step

Take the constraint of one line, measure the stops of the station in front of it for two weeks, and size a buffer with the three questions above. Then watch its contents for a month, and use that signal for buffer management in production on the rest of the line.
