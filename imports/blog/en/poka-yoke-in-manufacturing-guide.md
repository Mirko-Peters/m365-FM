---
title: "Poka-Yoke in Manufacturing: Types, Examples and How to Start"
summary: "Poka-yoke in manufacturing makes mistakes impossible or visible at once. See the three methods, shop floor examples and five steps to start on one process."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [poka-yoke, scrap-rate, standard-work]
keypoints:
  - "Poka-yoke is a device or process design that makes a mistake impossible, or makes it visible at once, so a defect does not reach the next step."
  - "Prevention is stronger than detection: a part that only fits one way round beats a buzzer that sounds after the wrong part is fitted."
  - "Three classic methods are the contact method, the fixed-value method and the motion-step method; each answers a different kind of error."
  - "Start with one recurring error, trace it to its source, remove the cause if you can, and add a detection device only where you cannot."
  - "A poka-yoke needs a daily check with a known-bad case, otherwise nobody knows whether it still works."
faq:
  - q: "What does poka-yoke mean?"
    a: "Poka-yoke is a Japanese term for mistake-proofing. Poka means an inadvertent error and yoke means prevention. In practice it is a simple, cheap device or design feature that stops a worker from making a mistake, or shows the mistake immediately, such as a part shape that fits only one way."
  - q: "Is a warning light a poka-yoke?"
    a: "It is a weaker form. A warning light or buzzer alerts the operator but does not prevent the error, so the operator can still ignore it. A shutdown device, which stops the machine until the problem is fixed, is stronger. Where mistakes are costly, prefer shutdown or prevention over warning."
  - q: "How is poka-yoke different from inspection?"
    a: "Inspection finds a defect after it has happened, often at the end of the process. Poka-yoke works at the source: it blocks the error or flags it at the moment it occurs. That makes the root cause easier to find, because the evidence is still on the station and the operator remembers what happened."
---

Poka-yoke in manufacturing means designing a task, a fixture or a machine so that a mistake cannot happen, or shows up the moment it does. This guide is for lean managers who need to apply [poka-yoke](https://www.m365.fm/entity/poka-yoke/), a core lean manufacturing tool from the Toyota Production System toolbox, correctly and teach it to others. You will learn the three classic methods, see examples from the shop floor, and get five steps to start on one process this week. No special software is needed. A good poka-yoke is often a simple pin, sensor or colour mark.

## What poka-yoke is and how it helps prevent errors

Poka-yoke is a Japanese term. "Poka" refers to an inadvertent error and "yoke" to prevention. The Lean Enterprise Institute (LEI) describes it as [simple and inexpensive devices that help operators avoid mistakes](https://www.lean.org/lexicon-terms/poka-yoke/), such as wrong parts, missing parts or parts installed backwards. The goal is to build quality into the process and catch the defect at its source, with zero defects as the aim. People can then solve the problem instead of sorting bad parts later. The best devices stop errors before they happen and make the wrong action physically impossible.

An [encyclopedia entry on poka-yoke](https://encyclopedia.com/management/encyclopedias-almanacs-transcripts-and-maps/poka-yoke) credits quality engineer Shigeo Shingo with developing the idea and formalising it in Japanese manufacturing. Many English texts also use the terms "mistake proofing" and "error-proofing". The American Society for Quality (ASQ) treats them as the same tool. In lean manufacturing it sits next to quality control: control finds defective units, poka-yoke stops them from being made.

Popular lore, repeated on the [Shingo Institute website](https://shingo.org/?p=499), says the idea was first called "baka-yoke", or fool-proofing. Shingo objected because the term implied that workers are fools, and he changed it to "mistake". The same page quotes him: mistakes are inevitable, but the defects that arise from them are not. That sentence is a good way to explain poka-yoke to a team.

Poka-yoke is not blame. It starts from the view that people make mistakes now and then, and that the process should not depend on perfect attention. It is also not a replacement for training or [standard work](https://www.m365.fm/entity/standard-work/). Standard work defines the correct way to do the job. Poka-yoke protects that way from slips.

It also changes the role of inspection. LEI points out that sampling inspection can miss defects that exist in total production. A 100 per cent inspection is costly and finds defects only after they have occurred, which makes the root cause harder to remove. Error proofing at the station avoids both problems: every unit is checked, and the check happens when the mistake is still easy to trace.

## Prevention and detection: two levels of error prevention

ASQ's description of [mistake proofing](https://www.asq.org/quality-resources/mistake-proofing) separates two levels.

**Prevention** makes the error impossible. ASQ names three routes:

- **Elimination:** remove the step that causes the error.
- **Replacement:** swap in a step that cannot go wrong.
- **Facilitation:** make the correct action much easier than the wrong one.

**Detection** catches the error and limits its effects when prevention is not practical. Detection can be an inspection by the next station, a self-check by the worker right after the task, or a check of conditions before the step starts. It can also be a signal, or a control that halts the process.

LEI uses a similar split for devices: a **shutdown** type, which LEI calls the most powerful, and a **warning** type, which alerts the operator with a buzzer or light. A warning does not prevent the error, and a plain checklist is weaker still, because it relies on memory and attention. If a defective unit is expensive or unsafe, aim for prevention first, shutdown second and warning last.

## Poka-yoke in manufacturing: three classic methods

Shingo's work is often summarised as three methods. The encyclopedia entry cited above describes them as follows.

1. **Contact method.** A sensing device or physical shape checks the form, size or position of the part. Examples are a pin that stops a misplaced part from fitting, a limit switch or a proximity switch.
2. **Fixed-value method.** The same action must happen a set number of times. A counter or a pre-counted set of parts shows when the count is wrong. The entry's example is tightening six bolts with a wrench dipped in diluted paint, so an unpainted bolt shows unfinished work.
3. **Motion-step method.** One person does several different actions in sequence. Sensors or a sequence check confirm that each step happened and alert the operator when one is skipped.

Pick the method by the type of error. Wrong part or wrong position points to the contact method. A miscount points to the fixed-value method. A skipped step points to the motion-step method.

## Poka yoke examples from the shop floor

The following poka yoke examples come from the LEI lexicon and the encyclopedia entry, plus common practice on assembly lines.

- **Part shape.** A part has a notch or an off-centre hole, so it fits only in the correct orientation. This is prevention by design.
- **Fixture pin.** A steel pin on a fixture blocks a misplaced part. This is the contact method.
- **Drill counter.** A counter on a drill sounds a buzzer if the worker removes the workpiece before the correct number of holes is made. This is the fixed-value method, with a warning.
- **Sensor on the pick.** A photocell stops the product from advancing until the needed parts have been picked up. LEI lists this as a workplace example.
- **Interlock.** A proximity switch blocks an air wrench until the gearbox is filled with oil. This is a shutdown device that enforces a sequence.
- **Colour and shadow boards.** Torque tools or fasteners are colour-coded to the product variant, and each tool has an outline on the board. Anyone can see at a glance what is missing. This is detection, and it is simple.

Notice that none of these needs a computer. Most are made by the team in a few hours. Everyday life is full of the same logic: LEI lists a washing machine that will not start with the door open, a mower that stops when the safety bar is released and spell-check in a text editor. Use such examples when you teach the idea, because people see the principle before they see it at their own station.

## How to implement poka-yoke: five steps

ASQ lists a short route to implement mistake proofing. This version is adapted for a first pilot.

1. **Pick one recurring error.** Use your defect log, customer complaints or the [scrap rate](https://www.m365.fm/entity/scrap-rate/) by cause. Choose an error that happens often and costs real money or safety.
2. **Flowchart the process** at the station and mark where the human error can happen.
3. **Trace the error to its source.** Ask why five times, and go to the station to see it. Do not guess from the office.
4. **Try prevention first.** Can you remove the step, replace it or make the right action easier? Only if not, design detection.
5. **Test, then standardise.** Try the device with real parts and real operators, adjust it, and add it to the work instruction.

Involve the operators from step 2 onwards. They know the awkward moments in the task. They will also be the ones to switch the device off if it slows them down.

## Example: a connector fitted the wrong way round

This is an illustrative calculation, not a measured result. A station fits a two-pin connector. The connector can be pushed in rotated by 180 degrees. Assume 1 in 200 units gets it wrong, and the fault is only found at end-of-line test. The station builds 800 units per shift.

- Errors per shift: 800 divided by 200 equals 4 units.
- Cost per error: assume 12 minutes of rework at an internal rate of 45 currency units per hour, which is 9 per unit, plus 6 in lost test capacity. That is 15 per unit.
- Cost per shift: 4 times 15 equals 60. For 220 shifts a year, that is 13,200.

The team changes the connector housing with a small key so it cannot enter rotated. That is prevention by design. If the housing cannot be changed, the team adds a fixture with a pin that blocks the wrong orientation, which is the contact method. Either way, the error rate for this cause drops towards zero. The saving is the 13,200 per year minus the cost of the change. Use your own numbers: rate, minutes and error frequency from your plant.

## Common mistakes

- **Choosing a warning where prevention is possible.** A buzzer is easy to add and easy to ignore. LEI notes that warning devices alert people but do not prevent the error.
- **Over-engineering.** LEI says a good poka-yoke is simple, reliable, low-maintenance and inexpensive. A complex sensor system that fails weekly will be bypassed.
- **Skipping the operators.** A device that makes the job slower or harder will be switched off. Test it with the people who use it.
- **Fixing the symptom, not the cause.** If the error comes from unclear drawings or poor lighting, a device at the station treats only part of the problem.
- **No daily check.** Test the device with a known-bad part at the start of each shift. A poka-yoke that stopped working silently is worse than none, because people trust it.
- **Stopping after one.** Record each poka-yoke in the standard work, and review them in your regular improvement meetings.

## Next step

Choose one error from your defect log and walk to the station today. Trace it to its source and try to design out the mistake before you reach for a sensor. That is the first, practical step of poka-yoke in manufacturing.
