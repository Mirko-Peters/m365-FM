---
title: "Simulation vs Emulation in Automation: What Is the Difference?"
summary: "Simulation vs emulation in automation: simulation models how a system behaves, emulation stands in for a real part and runs in real time. See when to use each."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [virtual-commissioning, factory-simulation, digital-twin]
keypoints:
  - "A simulation models how a system behaves and can run faster than real time; an emulation replaces a part of the real system with a model, or imitates a device, and runs in real time."
  - "Use simulation to explore design options, layouts, capacity and control strategies; use emulation to test control logic against a plant model and to train people."
  - "Emulation cannot be sped up, because control timers and communication depend on real time, so it is a poor tool for running many scenarios."
  - "Software in the loop and hardware in the loop are emulation set-ups: the real control code or a real controller works with a simulated plant."
  - "The words are often used loosely, so ask what runs in real time, what is real and what is modelled before you accept a quote or a specification."
faq:
  - q: "What is the difference between simulation and emulation?"
    a: "A simulation mimics how a system behaves by modelling it, and it can run faster than real time to explore options. An emulation reproduces the behaviour of a component, or replaces part of the real system with a model, so the real counterpart works with it as if connected to the real thing, usually in real time."
  - q: "What is the difference between a PLC simulator and a PLC emulator?"
    a: "As a rule of thumb, a simulator runs a PLC program in a software model to check basic logic, while an emulator imitates the controller closely enough to run the real code and interact with a plant model in real time. Vendors use the words loosely, so read the specification and not the label."
  - q: "When should you use hardware in the loop?"
    a: "Use it when timing, interfaces or the behaviour of the real controller matter, for example before shipment or start-up. It is closer to the final system than software in the loop but needs hardware and set-up effort. Start with software tests and add real hardware where the risk justifies it."
---

In automation, a simulation is a model that mimics how a system behaves, often faster than real time, to explore options. An emulation replaces a part of the real system with a model, or imitates a device, so that the real counterpart works with it as if connected to the real thing, and it runs in real time. This guide is for operational excellence managers who read quotes and project plans that mix the two words, for example in [virtual commissioning](https://www.m365.fm/entity/virtual-commissioning/). You will learn the definitions, what each is used for, how software and hardware in the loop fit in, and a worked example with run times.

## Simulation vs emulation: the short answer

The terms overlap, and the literature admits it. Emulation and simulation both create a virtual environment in which you can debug and test before touching physical hardware. A field report on industrial network simulation by Duque Anton and co-authors, available on [arXiv](https://arxiv.org/pdf/1905.11751), says that simulation aims at mimicking the states of a system and emulation aims at reproducing its behaviour. The authors note that the two words are often used interchangeably, and that they use "simulation" in general because many tools can do both.

A more practical definition comes from Ian McGregor in a paper for the [2002 Winter Simulation Conference](https://www.informs-sim.org/wsc02papers/230.pdf). He defines an emulation model as one where some functional part of the model is carried out by a part of the real system, and the reverse also holds: part of the real system is replaced by a model. McGregor worked for a company that sells emulation tools, so read his claims with that in mind. The definition itself is easy to check against any project.

In plain terms, the working distinction in automation is this:

- **Simulation** is a model of the whole system that you run on its own. You change inputs and see what happens, and you can run it fast. You can simulate demand, stops and staffing, and you can build a prototype of a layout in the model before anything is built.
- **Emulation** connects something real to a model. The real thing might be a control program, a controller or an operator panel, and the model plays the machine or plant around it. Because something real is involved, the run takes real time.

The same difference shows in the tools, where the difference between emulator and simulator is a matter of what they replicate. A simulator can simulate the plant or the controller's program logic in a model. An emulator tries to emulate the functionality of the real controller, down to its CPU behaviour and communication, so that the real code can run on it and reproduce what it would do on the target hardware. In practice, vendors often call a PLC emulator and simulator by either name, so check what is behind the label. Simulators and emulators for the same controller can differ a lot in how well they reproduce the target system.

## Use cases: what each is used for in automation

McGregor describes the typical use cases. Simulation models are used to test and develop different solutions in order to find the best one. They explore design options, layout, operating limits and control strategy. They run fast, often faster than real time, and they are repeatable when the parameters do not change. That makes them suitable for many experiments and for automated optimisation.

Emulation models are used to test control-system logic under different loading conditions, to verify control behaviour before commissioning, and to train operators and maintenance staff. They run in real time with the control system connected from the outside.

McGregor also lists the limits. Emulation models are poorly suited to experiments because they often run only in real time. Running them faster than real time causes errors, because control-system timers cannot adapt. The results are also less repeatable, since the communication between the model and the controller is asynchronous and depends on the network and the operating system.

Duque Anton and co-authors make a similar point from the other side. Simulation is cost-, resource- and time-efficient, but every physical characteristic has to be modelled, which sometimes needs a lot of effort. Emulation is by design as accurate as the productive system where the environment is real, but it needs more devices and more space, and it costs more. Their conclusion is that there is no general solution meeting all requirements.

## Software in the loop, hardware in the loop and the digital twin

In automation projects, the two ideas meet in the "in the loop" tests. The vendor page of [realvirtual](https://realvirtual.io/en/virtuelle-inbetriebnahme/) describes them:

- **Software in the loop:** the control program runs as software on a PC, for example in a PLC emulator, and works with the machine model. No hardware is needed.
- **Hardware in the loop:** a real PLC connects to the machine model over a network. The real hardware drives a virtual machine.

Both are emulations in McGregor's sense, because a real part, the control code or the controller, works with a model of the rest. They are the core of virtual commissioning. The page is a vendor source, and its descriptions are consistent with the academic definitions above.

A production flow model is a different case. [Factory simulation](https://www.m365.fm/entity/factory-simulation/) is a controlled model of how work moves through part of a factory, using current operating rules, resources, orders and normal variation, so a change such as an extra shift, a new machine or a smaller buffer can be tested before it is made. No controller is in the loop. It is a simulation in the pure sense, and it runs far faster than real time.

A [digital twin](https://www.m365.fm/entity/digital-twin/), a maintained digital representation of a physical resource that is kept up to date from observations, can serve as the model in either case. What matters is not the model but how you use it: as a standalone experiment, which is a simulation, or connected to something real in real time, which is an emulation.

## Emulator or simulator: which one to use

Use this as a quick guide. It is our own summary, not a standard.

- **How much capacity do we need, and where is the bottleneck?** Simulation. You want many scenarios, fast.
- **Does the control program handle a jam, a missing part or a sensor fault?** Emulation, in software first.
- **Does the real controller meet its timing and interface requirements?** Hardware in the loop, or a test on the real equipment. Duque Anton and co-authors say real hardware gives the most realistic results but is the hardest to set up.
- **Can we train operators before start-up?** Emulation. A model connected to the real control panel behaves as the machine would.
- **Which of two layouts is better?** Simulation.

A single project often needs both. First a simulation sizes the line. Later an emulation tests the control program for that line.

## Example: one packing line, two questions

This is an illustrative example, not a measured case. A packing line makes 3,000 cartons per hour. The plant asks two questions.

**Question 1: will a second labeller lift output to 3,600 cartons per hour?** This is a simulation question. A production model runs one 8-hour shift in about 2 minutes, which is 240 times faster than real time. The team tests 30 scenarios, such as different batch sizes, buffer sizes and stop patterns. The 30 runs take about 60 minutes. The same 30 scenarios in real time would take 30 × 8 hours = 240 hours, or 30 working days. Real-time tests are not an option for this question.

**Question 2: does the control program handle a carton jam at the labeller?** This is an emulation question. The control program runs in a PLC emulator, and the model plays the line. Each fault case takes about 5 minutes in real time, and it cannot be sped up, because the timers of the program depend on real time. Twelve fault cases take about 60 minutes. That is cheap compared with finding the jam handling error during start-up on the real line.

Both tests take about an hour, and they answer different questions. A fast simulation cannot show whether the control timers work, and a real-time emulation cannot test 30 scenarios in a day.

## Common mistakes

- **Using the words as synonyms in a specification.** A supplier who offers "simulation" may deliver a pure model, and you needed control tests.
- **Judging control timing from a simulation.** A model that runs faster than real time says nothing about timers and communication.
- **Speeding up an emulation.** The results are wrong when control timers cannot follow.
- **Over-detailed models.** A model with every cable and bolt costs effort that the question does not need.
- **Trusting the emulator as the real controller.** The emulation of the controller is not the PLC. Plan a check on the real hardware for timing and interfaces.
- **No acceptance test on the real line.** A passed virtual test lowers the risk. It does not remove it.

## How software can help

Tools for both purposes exist. Production flow models run in simulation software, and control tests use PLC emulation and machine models. Ask a supplier what runs in real time, what is real, and what is modelled. For software testing of control code, ask how tests are automated and recorded, so that a test run can be repeated after each change to the program. Ask for the interface to your PLC platform and for the effort to build the model. Software does not decide for you which question to ask, and a clear question is the best way to choose between the two.

## Next step

For your next automation project, write down each test you want as a question, and mark each one as "many scenarios, fast" or "real control, real time". Then use that list to decide on simulation vs emulation before you ask for quotes.
