---
title: "Virtual Commissioning: How It Works and When It Pays Off"
summary: "Virtual commissioning tests control software on a virtual model before start-up. See how it works, what the evidence says and when it pays off for a plant."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [virtual-commissioning, digital-twin, polaris-simulator]
keypoints:
  - "Virtual commissioning connects the real control software, such as a PLC program, to a simulated model of the machine, so logic, signals and sequences are tested before the equipment runs."
  - "The model needs both geometry and kinematics and the electrical interface to the controller, and its value depends on how closely it matches the real behaviour."
  - "Reported time savings are large but come from small experiments and vendor pages, so plan with a conservative figure and do not treat it as guaranteed."
  - "It pays off when a day of start-up delay is expensive, the control logic is complex, or the model can be reused for training and later changes."
  - "It answers a different question from a production simulation: whether the control works, not how much the system can deliver."
faq:
  - q: "What is virtual commissioning?"
    a: "Virtual commissioning tests the real control software, such as a PLC program, against a simulated model of the machine or plant before the equipment exists or runs. Errors in logic, signals and sequences are found at a desk, not on site, which shortens start-up. Its value depends on how closely the model matches real behaviour."
  - q: "What is the difference between virtual commissioning and simulation?"
    a: "Simulation studies how a system behaves and what it can deliver, such as capacity or flow. Virtual commissioning connects the real control software to a simulated machine to check that the logic, signals and sequences work. Both use models, but they answer different questions and often need different levels of detail."
  - q: "When does virtual commissioning pay off?"
    a: "It pays off when a day of delay at start-up is expensive, the control logic is complex or new, or the model can be reused for training and later changes. For a simple, repeated machine, the effort to build the model may exceed the days saved. Compare the model cost with the cost of a day of delay."
---

[Virtual commissioning](https://www.m365.fm/entity/virtual-commissioning/) means testing the real control software of a machine or plant against a virtual model before the equipment is built or running. It pays off when a day of delay at start-up is expensive or the control logic is complex, and it does not pay off for every project. This guide is for plant managers who must decide whether to ask for it. You will learn how it works, the three test levels, what the evidence says about time savings, a break-even example with numbers, and the mistakes to avoid.

## Virtual commissioning: what it is and how it works

In traditional commissioning, the control software meets the machine for the first time on site. Errors in logic, signals and sequences then cost time on the floor, where every hour of delay is expensive. Virtual commissioning moves that first meeting to a desk, into a virtual environment where the model can simulate sensors, drives and parts. For an automation project, that means troubleshooting at an early stage, when a fix is cheap. A paper by Matthias Schamp and colleagues at Ghent University and Flanders Make, published in [Procedia Manufacturing](https://core.ac.uk/download/275704512.pdf) in 2019, describes it as replicating the behaviour of hardware in a software environment, in order to validate the control logic before real implementation. The virtual components need a mechanical model, with geometry and kinematics, and an electrical model that covers the interaction with the PLC.

In practice, the steps look like this:

1. **Build the model** of the machine or plant: the parts that move, the sensors and the actuators.
2. **Name the signals** in the model the same as in the control program, so that the controller sees the model as it would see the real equipment.
3. **Connect the control software** to the model. The real PLC program runs, and the model reacts.
4. **Test sequences and faults.** Run normal cycles, then trigger faults such as a missing part, a sensor failure or a jam, which are risky or slow to test on real equipment.
5. **Fix the errors at the desk,** and carry the corrected program to the site.

The quality of the result depends on how closely the model matches the real behaviour. The Schamp paper says the digital model should behave like the real production system, and it lists the modelling effort and the dependence on expertise as open challenges.

## Three test levels: model, software and hardware in the loop

The test can be done at different levels, depending on the stage of the project. The [vendor page of realvirtual](https://realvirtual.io/en/virtuelle-inbetriebnahme/), which sells virtual commissioning software, describes three loops:

- **Model-in-the-loop** couples behaviour models, for example from a simulation tool, to the machine model. It suits drives and processes before any PLC code exists.
- **Software-in-the-loop** runs the controller as software on a PC, so the whole test needs no cabling or hardware. It suits early tests and scales easily.
- **Hardware-in-the-loop** connects a real PLC to the model over a network. It is closer to the final system, and it checks the real hardware's behaviour and timing.

A [blog post by Siemens](https://blogs.sw.siemens.com/tecnomatix/how-to-reduce-week-long-commissioning-times/), a vendor, describes the same two modes of software and hardware in the loop for its plant simulation tool. The difference between simulation and emulation, which matters here, deserves its own treatment. For a plant manager, the practical point is this: start with software, add real hardware when the project reaches the stage where timing and interfaces matter.

## What the evidence says about time savings

The reported savings are large, but the quality of the evidence varies, so read the numbers with care.

- The Schamp paper cites an earlier small-scale experiment that reported a 73 per cent reduction in real commissioning time and a 31 per cent improvement in the requirements fulfilled before real commissioning with a digital-model approach. The authors note that comparing approaches is hard, because a commissioning can only happen once.
- The realvirtual page says on-site commissioning time can be up to 75 per cent shorter and the share of control functions that worked on the first attempt rose from 37 to 84 per cent, citing a field study of the Technical University of Munich. It also says the 75 per cent is not a guaranteed result for every project. That is a vendor source quoting a third party.
- The Siemens blog post claims large savings as well, but it gives few figures that can be checked.

So the direction is consistent, and the size is uncertain. For planning, use a conservative assumption, such as a quarter of the on-site time, and check it against your first project.

A related term is the [digital twin](https://www.m365.fm/entity/digital-twin/): a maintained digital representation of a physical resource, kept up to date from observations. In Industry 4.0 projects, the twin and the commissioning model are often discussed together, but they are not the same thing. A model built for virtual commissioning is often a one-time test model, for instance for one assembly line. If you keep it current, it can grow into a twin, and it can then be used for training and for testing later changes. That reuse is one of the main ways the investment pays back.

## Example: when does it pay off?

This is an illustrative calculation, not a measured case. A new line needs 30 days of on-site commissioning. Building the virtual model costs 25 engineering days at 800, which is 20,000, plus 15,000 for software and licences, which makes 35,000 in total. A day of delay at start-up costs 8,000, from the crew on site and the lost margin.

Assume the team plans conservatively and expects to save 25 per cent of the on-site time, which is 7.5 days.

- Saving: 7.5 × 8,000 = 60,000.
- Cost: 35,000.
- Net gain: about 25,000.

The break-even point is 35,000 ÷ 8,000 = 4.4 days, which is about 15 per cent of the 30 days. If the time saved is below that, the model does not pay for itself on this line alone.

Now change one assumption. If a day of delay costs only 3,000, the same 7.5 days are worth 22,500, which is less than the 35,000. The project does not pay off on the first line, unless the model is reused. If the same model also serves for operator training and for two later changes that would each have cost two days of testing at 3,000, the reuse adds 12,000. The total benefit is then about 34,500, which is close to break-even.

The point is that the decision depends on three numbers: the cost of a day of delay, the share of days you expect to save, and the reuse of the model. Compare them before the project starts.

## Control tests and output tests: two kinds of simulation

Virtual commissioning is sometimes confused with production simulation, because both use a model. They answer different questions. The usual distinction is this: simulation studies how a system behaves and what it can deliver, while here the focus is on checking that the control works.

A production system simulation asks whether the plant will deliver the output. [iFAKT's Polaris Simulator](https://www.m365.fm/entity/polaris-simulator/), for example, is a module of iFAKT Polaris that tests the production system virtually, for example capacity, staffing and buffer scenarios, and reveals bottlenecks before changes are made. That is a question about flow and capacity. It is not a test of PLC code, and the two do not replace each other. A line can have a well-tested control program and still be a poor design, or the other way round. The two tests answer different questions, so they belong at different points of a project.

## How to start an automation project in five steps

This sequence is our own planning aid, not a standard.

1. **Choose a project with a high cost of delay** or with complex, new control logic. A simple machine that you have built many times is a poor first case.
2. **Define the questions.** Which sequences, interlocks and fault cases must be tested? The scope sets the model effort.
3. **Agree the level of detail.** The model should be as simple as the questions allow. A model that is too fine costs time. One that is too coarse misses the errors.
4. **Pick the test level.** Start with software in the loop. Add hardware where timing or interfaces matter.
5. **Test, document and keep the model.** Record the errors found, take the corrected program to the site, and assign an owner for the model afterwards.

## Common mistakes

- **Starting too late.** If the control code is finished and shipped, there is little left to test.
- **Wrong level of detail.** Too coarse a model misses the errors, and too fine a model delays the project.
- **Signals that do not match.** If the model names differ from the real ones, you test a different program.
- **Treating a passed test as proof.** The model is not the machine. Plan time for the on-site check.
- **Counting on the headline percentage.** Even the vendor says its figure is not guaranteed for every project.
- **No owner after the project.** A model that nobody maintains is out of date after the first change.

## How software can help

Simulation software for this work ranges from plant simulation suites to game-engine plugins, and many connect to common PLC platforms. Look at the interfaces to your controller, the effort to build and name the signals, and whether the model can be reused later. A tool is only as useful as the model that you build with it, and building that model is the larger part of the cost.

## Next step

List your next three investment projects, estimate the cost of a day of start-up delay for each, and compare it with the cost of a model. Pick the project where virtual commissioning has the highest chance to pay back as the pilot.
