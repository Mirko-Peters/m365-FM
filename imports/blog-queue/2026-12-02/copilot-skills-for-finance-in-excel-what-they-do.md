---
title: "Copilot Skills for Finance in Microsoft 365: What They Do and How to Start in Excel"
summary: "What finance and accounting skills in Copilot in Excel are, which ones Microsoft lists, how to call them with @, how to create custom skills with SKILL.md, and what the documentation leaves open."
status: review
publish: false
author: mirko-p
date: 2026-12-02
topics: [copilot, excel, agent-skill]
keypoints:
  - "A skill gives Copilot in Excel instructions for a repeatable task. Call one by typing @ and the skill name, or via Add > Choose plugins and skills."
  - "Microsoft Support lists 20 finance skills, such as 3-statements, check-model, comps-analysis and model-update, plus a separate accounting group."
  - "Custom skills are folders with a SKILL.md file in OneDrive. The folder name must match the name in the frontmatter."
  - "Accounting skills were rolling out to Frontier in October 2026 and worldwide in November, per the Microsoft Copilot blog."
  - "Microsoft warns that Copilot does not provide accounting, tax, audit or financial advice. Review output against source records."
faq:
  - q: "What is a skill in Copilot in Excel?"
    a: "Microsoft Support describes a skill as a set of instructions for repeatable tasks, such as reconciling accounts, analyzing data and formatting workbooks. You can use built-in skills or create your own."
  - q: "How do I run a finance skill?"
    a: "Microsoft Support says to type @ followed by the skill name in your prompt to Copilot, or open Copilot in Excel, select the Add menu in the prompt field and choose Choose plugins and skills."
  - q: "How do I create a custom skill?"
    a: "According to Microsoft Support, you can use @skill-builder, record a task in your workbook, or set one up manually in Settings > Manage plugins & skills > Custom skills > Create OneDrive folder. Each skill needs its own folder with a SKILL.md file."
  - q: "Which licenses do I need?"
    a: "The Microsoft 365 blog says the generally available features are offered to Microsoft 365 Copilot customers. The Microsoft Support pages read here do not list license terms, usage limits or pricing."
  - q: "Can I rely on the numbers a finance skill produces?"
    a: "No. Microsoft Support states that Copilot does not provide accounting, tax, audit or financial advice or professional determinations, and that output may be inaccurate. Review it against source records and your organization's policies."
---

Copilot skills for finance are reusable instruction sets that tell Copilot in Excel how to carry out a common finance process, such as updating a model, building comparable-company analyses or closing the books. You start one by typing @ and the skill name in the Copilot pane. This guide covers what Microsoft documents: the skills it lists, how to call and manage them, how to write your own, and where the documentation stops.

## What a skill does

Microsoft's June 2026 post on Copilot in Excel says skills let teams define how Copilot should complete a common process, for example building a DCF, closing the books, refreshing a monthly reporting model or preparing a variance analysis. A skill guides Copilot through the steps and applies a set structure and formatting, so the output is easier to review and reuse.

Microsoft Support gives a shorter definition. A skill gives Copilot in Excel instructions for repeatable tasks, such as reconciling accounts, analyzing data and formatting workbooks.

## Which finance skills Microsoft lists

The Microsoft Support page on built-in skills groups them by area. The finance group contains these 20 skills:

3-statements, buyer-list, catalyst-calendar, check-model, comps-analysis, datapack-builder, dd-checklist, dd-meeting-prep, deal-sourcing, deal-tracker, idea-generation, lbo-model, merger-model, model-update, portfolio-monitoring, portfolio-rebalance, returns-analysis, tax-loss-harvesting, thesis-tracker and unit-economics.

Some examples of what Microsoft says they do:

- **check-model:** audits models for circular references, broken formulas, hardcoded overrides, and balance or cash flow mismatches.
- **comps-analysis:** creates comparable-company analyses with operating metrics, multiples and benchmarks.
- **model-update:** updates models for new results, guidance or revised assumptions.
- **unit-economics:** evaluates customer economics, such as cohorts, lifetime value versus acquisition cost, and payback periods.

A separate accounting group lists audit-support, budget-and-forecast, close-management, compliance-support, financial-statements, reconciliation, tax-preparation, variance-analysis and journal-entry. The page states that accounting skills are rolling out to the Microsoft Frontier program, so they may not be available to everyone. The Microsoft Copilot blog of October 2026 adds that accounting skills rolled out to Frontier in October and roll out worldwide in November, with a note that dates are tentative.

The page says the skills in its Microsoft section are created and managed by Microsoft, but it does not name individual skill authors and does not say whether the finance skills are enabled by default.

## How to start

1. Open Copilot in Excel on a workbook that holds your model or data.
2. Type **@** followed by the skill name, for example `@check-model`. Or select the **Add** menu in the prompt field, then **Choose plugins and skills**.
3. Describe the task in your prompt and review what Copilot proposes.

To control what Copilot uses by default, select **Settings** (**...** in the upper-right corner), then **Manage plugins & skills**, and toggle skills on or off. According to Microsoft Support, a disabled skill still runs if you @mention it directly.

The June 2026 post adds controls for review. With Plan with Copilot, Copilot can outline which ranges, worksheets, formulas and assumptions it intends to change before acting. Every edit links back to the affected cells, and the Show Changes pane attributes Copilot edits to Copilot.

## Create a custom finance skill

Custom skills are saved to a folder in your OneDrive. Microsoft Support names three ways to create one:

1. **@skill-builder:** create a skill from instructions, previous prompts, examples or a workflow. You can preview and refine it before it is saved. Microsoft notes this is rolling out and may not be available to all customers.
2. **Record a skill:** demonstrate a task in the workbook and Copilot turns your changes into a skill.
3. **Manual setup:** in **Settings**, **Manage plugins & skills**, select **Custom skills**, then **Create OneDrive folder**, then **Open skills folder**, and add your skill folders.

Format rules from Microsoft Support:

- Each skill needs its own folder containing a file named **SKILL.md**.
- The frontmatter between `---` lines is required. It has **name** and **description**. The folder name must match the name. The description tells Copilot when to use the skill.
- The body holds your step-by-step instructions, with no format restrictions.
- Optional folders are **scripts**, **references** and **assets**.
- The format follows the Agent Skills specification at agentskills.io.

After you add or rename a skill in OneDrive, select **Refresh** in the Custom skills dialog. To remove a skill from Copilot without deleting its folder, rename the folder so it no longer matches the name in SKILL.md.

The June 2026 post also mentions workbook rules, which store structure, naming and formula conventions in a sheet inside the workbook, and Personalization for preferences you set once.

## Data connectors and partners

The same post lists federated Copilot connectors for finance data. LSEG and Moody's came in May 2026. New ones named in June are CB Insights, Daloopa, FactSet (preview, general availability planned for July), Morningstar, PitchBook and S&P Global Deterministic Retrieval. Microsoft says third-party connectors and data providers may need separate licensing. Partner-built skills were planned for Q3 2026, with LSEG, Ramp, Rogo, Samaya AI, Velixo and Vena named in the first wave.

## What is not documented

- The Microsoft Support pages read do not list license terms, usage limits or pricing. The Microsoft 365 blog says generally available features are offered to Microsoft 365 Copilot customers.
- Platform availability varies by feature. The June post says custom skills were in the Insiders channel at that time.
- Check your own tenant before promising a skill to a finance team, because rollout is progressive.

Microsoft Support states, in an Important note in the accounting skills section, that Copilot does not provide accounting, tax, audit or financial advice or professional determinations and that AI-generated content might be inaccurate or incomplete. Treat every result as a draft and verify it against source records.

## Related

- [Microsoft 365 Copilot](https://www.m365.fm/entity/copilot/)
- [Microsoft Excel](https://www.m365.fm/entity/excel/)
- [Agent skill](https://www.m365.fm/entity/agent-skill/)

## Sources

- [Microsoft 365 Blog: Copilot in Excel, built for the era of frontier finance (June 25, 2026)](https://microsoft.com/en-us/microsoft-365/blog/2026/06/25/copilot-in-excel-built-for-the-era-of-frontier-finance)
- [Microsoft Support: Use skills with Copilot in Excel to complete repeatable tasks](https://support.microsoft.com/en-us/excel/copilot/copilot-in-excel-skills)
- [Microsoft Support: Use built-in skills and skills created by Microsoft with Copilot in Excel](https://support.microsoft.com/en-us/excel/copilot/copilot-in-excel-built-in-skills)
- [Microsoft Support: Microsoft skills in Copilot in Excel](https://support.microsoft.com/en-us/excel/copilot/copilot-in-excel-microsoft-skills)
- [Microsoft Tech Community: What's new in Microsoft Copilot, October 2026](https://techcommunity.microsoft.com/blog/microsoft-copilot-blog/what%E2%80%99s-new-in-microsoft-copilot--october-2026/4568528)
