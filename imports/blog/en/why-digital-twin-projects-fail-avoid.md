---
title: "Why Digital Twin Projects Fail and How to Avoid It"
summary: "Why digital twin projects fail: no decision to support, poor data, no owner and too wide a scope. See five fixes and a worked example for plant managers."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [digital-twin, polaris-designer, industry-4-0]
keypoints:
  - "Digital twin projects rarely fail because of the software; they fail because no decision depends on the twin, the data is not trusted, or nobody owns the model."
  - "Before you start, name the decision the twin will change, who takes it and by when. If you cannot, the project is not ready."
  - "Check the data first: for each item the twin needs, find the source, the owner, the update rhythm and whether two systems agree."
  - "A twin is a living model: without a process that updates it when the plant changes, it drifts away from reality and people stop using it."
  - "Start with one line and one decision, prove the value in weeks, and then widen the scope."
faq:
  - q: "Why do digital twin projects fail?"
    a: "Most fail for reasons outside the software: no clear decision that the twin supports, missing or conflicting data, no owner for the data and the model, a scope that is too wide, and no process to keep the twin up to date. A narrow pilot with a named decision avoids most of these."
  - q: "How do you avoid digital twin failure?"
    a: "Name the decision first, audit the data it needs, give each data item and the model an owner, start with one line, and plan the updates before the go-live. Review the pilot against the decision after a few weeks, and widen the scope only when the first result is trusted."
  - q: "How good must the data be for a digital twin?"
    a: "Good enough for the decision it supports. The data must be available, updated often enough, and consistent across systems, for example with the same identifiers and units. Test it on a small scope first, because a twin built on conflicting data gives confident but wrong answers."
---

Why digital twin projects fail is mostly a management question, not a software question. Typical causes are no decision that depends on the twin, data that nobody trusts, no owner for the model and a scope that is too wide for the first step. This guide is for plant managers who have been asked to sponsor a [digital twin](https://www.m365.fm/entity/digital-twin/) or who have seen one stall. You will learn the five most common failure points, a worked example with numbers, a routine to avoid them and the mistakes to watch for.

## Why digital twin projects fail: the short answer

A digital twin is a maintained digital representation of a physical resource that is kept up to date from observations, for example with live data from machines in near real-time. The important words are "maintained" and "kept up to date". A digital twin is not a one-time model, and it is not a 3D model or a set of CAD files of the plant. It is a system that has to stay true to the plant, and that is where projects break.

Several sources describe the same pattern. A paper at the [2023 Winter Simulation Conference](https://www.informs-sim.org/wsc23papers/167.pdf) by Siyuan Chen and co-authors reviews the challenges of digital twins in manufacturing maintenance. It groups them into organizational ones, such as company culture, high upfront costs and fear of job loss, methodological ones, such as unclear benefits and unclear business objectives, and technical ones, such as data acquisition from legacy machines and interoperability. The study is small, with six industry interviewees, so the authors say the findings may not represent all companies.

The software vendors say the same from their side. Simio, a simulation vendor, argues in a [blog post](https://www.simio.com/blog/the-3-data-headaches-killing-your-digital-twin-project-and-practical-fixes-that-actually-work) that projects more often stall on data problems than on technology. Informatica, a data management vendor, writes in its [article on data foundations](https://www.informatica.com/blogs/why-digital-twins-fail-without-the-right-data-foundation.html) that a twin without trusted data is limited and can mislead. Both sell tools for the data problem, so read them as one view.

From these sources and from common project practice, we group the failures into five. This grouping is our own summary, not a standard.

## Failure 1: no decision depends on the twin

The biggest challenge is that nobody can say what the digital twin is for. "We want to be an [Industry 4.0](https://www.m365.fm/entity/industry-4-0/) plant" is a direction, not a use case. The Chen paper lists unclear business objectives and unclear benefits as methodological challenges, and it lists identifying use cases and securing management commitment among the barriers.

A simple test helps. Ask the sponsor one direct question: which specific decision will be taken differently, by whom and by which date, because this twin exists? Good answers are concrete. "We will choose between a second shift and a new machine for line 3 in March." "We will set buffer sizes before the new layout is built." A weak answer is "we will have better visibility".

If the answer is vague, the project has no stop signal. It will run until the budget ends, and then nobody can show a result.

## Failure 2: poor data quality and a weak data foundation

The digital twin is only as good as its data. Simio names three data problems, and they match what plants find:

- **Missing data.** Process times, resource availability or quality records have gaps. Simio suggests starting with experience-based estimates for the critical parameters, recording the assumptions and collecting real data over time.
- **Quality problems.** The data looks complete but contains outliers, timing errors or values that conflict across systems. Simio suggests validation rules, automated outlier checks and review by process experts.
- **Integration problems.** The data sits in ERP, MES and quality systems that do not talk to each other. Simio suggests phasing the work, from scheduled file exports to database links and later interfaces.

Informatica adds master data and a data foundation. Without a trusted record of assets, their location, service history and criticality, a twin has numbers but little context, and any AI or predictive function on top of it works on a weak data layer. The article warns that wrong data can lead to missed maintenance alerts or wrong spare-part orders.

For a plant, the practical form of this problem is simple. Does the [manufacturing execution system](https://www.m365.fm/entity/manufacturing-execution-system/) record the same stop reasons as the maintenance system? Do both use the same machine identifier? Do the physical assets in the maintenance management system match the lines in the MES, and do cycle times in the ERP match what the line really runs? If two systems disagree, the digital twin will pick one, and people will find out later which one was wrong.

## Failure 3: nobody owns the data or the model

A digital twin has two kinds of owners, and both are often missing. Each data item needs an owner who can say whether it is correct. The model needs an owner who updates it when the plant changes.

The Chen paper is clear on this point. It says that organizational challenges require processes that ensure regular updates, and it recommends updating the model whenever the physical system changes. Interviewees also stressed the importance of human expertise in maintaining, understanding and verifying the results of the twin. A digital twin that nobody maintains is a snapshot. After the first layout change or the first new product, it no longer matches the plant, and the operators who notice stop trusting it.

The same paper notes that most respondents use digital twins only at the digital shadow stage. A fully connected, self-updating twin is a long-term goal, and the first useful version is often a simpler model with a clear owner.

## Failure 4: the scope is too wide for the first step

The next pitfall is ambition. A digital twin project that starts with "the whole plant" has to reconcile data from every line, every system and every team before it shows anything. The number of data items grows with every line, and so does the number of conflicts.

A narrow scope, a digital twin pilot on one line, puts the model in front of real users early. One line, one decision and one group of users are enough to find out whether the data holds and whether people use the answer. The Chen paper lists securing management commitment and building trust among the barriers, and a quick, correct first result helps with both.

## Failure 5: the project is treated as an IT project

If IT or an external team builds the model alone, the people who know the plant join late. They find that the model ignores a manual step, a shared tool or an informal rule. The Chen paper lists company culture, communication problems and fear of job loss as challenges. Treat the project as change management, with a measurable business case that the plant can check, and let operators, maintenance and planning help to define what the model shows.

## Example: audit one line before you scale

This is an illustrative calculation with assumed numbers, not a measured case. A plant plans a twin for 12 lines. It wants to decide on buffer sizes for the first line, so the sponsor asks for a data audit of that line first. The digital twin needs 30 data items per line, such as cycle times, stop reasons and durations, order mix, staffing and changeover times.

The audit result for line 1:

- 11 items are available and trusted.
- 9 items exist in two systems that disagree, for example stop reasons in the MES and in the maintenance system.
- 6 items are only on paper or in the heads of the shift leaders.
- 4 items do not exist at all.

So 19 of 30 items need work, and only 11 out of 30, which is about 37 per cent, are ready.

**Wide scope.** If the plant assumes similar numbers for all 12 lines, 12 × 19 = 228 items need work. Assume, as a planning figure of our own, that one analyst can fix 5 items per week. Then the data work takes 228 ÷ 5 = about 46 weeks, nearly a year, before the first result.

**Narrow scope.** The buffer decision needs only 12 of the 30 items, and the audit shows 5 of those 12 have problems. At 5 items per week, that is 1 week of data work. The first answer arrives in weeks, and the team learns which data problems hurt the most.

Your numbers will differ, but the audit shows which case you are in.

## How to avoid failure: a digital twin pilot in six steps

1. **Name the decision.** Write down which decision the digital twin changes, who takes it and by which date.
2. **Audit the data.** For each item the digital twin needs, find the source, the owner, the update rhythm and whether two systems agree. Count the gaps.
3. **Assign owners.** One person for each data domain and one person for the model. Put their names on the project plan.
4. **Start narrow.** One line or one process step, and only the data items the decision needs.
5. **Plan the updates.** Decide how the model changes when the plant changes, and who triggers it. Include this in the deployment, not after it, and write the workflow down.
6. **Review against the decision.** After a few weeks, check whether the decision was made differently. Widen the scope only when the answer is yes.

## Common mistakes

- **Buying the platform before naming the use case.** The tool does not tell you what to decide.
- **Trusting the data because it exists.** A value in a database is not the same as a value that is correct and current.
- **Letting two systems disagree.** The digital twin will choose one without telling you.
- **No owner after the go-live.** A digital twin without an owner is out of date after the first change.
- **Starting with the whole plant.** The data work grows faster than the benefit, and digital twin initiatives lose their sponsor.
- **Leaving out the shop floor.** If operators and maintenance staff do not trust the twin, they will not use it.

## How software can help

The data audit and the model both need a single, consistent description of products, process steps and resources. [iFAKT's Polaris Designer](https://www.m365.fm/entity/polaris-designer/) is a module of iFAKT Polaris that builds a product-process-resource (PPR) knowledge graph as the single source of truth for products, process steps and resources. A shared description like this addresses the problem of conflicting data, but it does not replace the decision, the owners or the update routine. Software helps once those are in place.

## Next step

Pick one line and one decision for the next quarter, and ask your team to audit the 10 to 20 data items that decision needs. If the audit shows that most items are not ready, you have found out why digital twin projects fail before spending the budget, and you know where to start.
