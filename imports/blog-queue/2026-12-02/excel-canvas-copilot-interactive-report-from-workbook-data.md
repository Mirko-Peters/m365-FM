---
title: "Excel Canvas with Copilot: Turn Workbook Data into an Interactive Report"
summary: "What Excel canvas (interactive canvas) is, how Copilot builds it from workbook data, where it is available, and why Microsoft's pages do not use the name Dashboard mode. Includes conflicting rollout statements."
status: review
publish: false
author: mirko-p
date: 2026-12-02
topics: [excel, copilot, agent-skill]
keypoints:
  - "Excel canvas turns workbook data into a report with visualizations, metrics and insights in one view. It updates as the data changes."
  - "Microsoft pages read here use the names Excel canvas and interactive canvas. None of them uses the term Dashboard mode."
  - "You refine the canvas by asking Copilot to change the layout, highlight different insights or adjust the story for an audience."
  - "Microsoft's rollout statements differ: Insiders only, worldwide in October, or worldwide in November. Check your own Excel."
  - "Support lists interactive-canvas as a Visualization skill that is enabled by default and rolling out to production."
faq:
  - q: "What is Excel canvas?"
    a: "Message Center post MC1485411 describes Excel canvas as a Copilot capability that turns workbook data into a report with visualizations, metrics and insights in a single view. The report refreshes automatically as the underlying data changes."
  - q: "Is Dashboard mode an official Excel feature?"
    a: "The Microsoft pages read for this guide do not use the term Dashboard mode. Microsoft Support describes an interactive-canvas skill that creates interactive dashboards and reports from workbook data. The feature is named Excel canvas or interactive canvas."
  - q: "How do I build a canvas?"
    a: "According to MC1485411 and the Excel blog on Tech Community, you ask Copilot with a prompt to generate an interactive report from your workbook data, then refine it with natural language instructions. Neither page gives a menu path."
  - q: "Where is Excel canvas available?"
    a: "Microsoft's statements differ. MC1485411 lists Excel for Windows, Excel Online and Microsoft 365 Copilot with a worldwide rollout in October 2026. The Excel what's new post of October 2026 says Insiders of Excel for Windows, coming soon to web, and not on Mac."
  - q: "Do admins need to do anything?"
    a: "MC1485411 says no action is required to prepare and describes no admin controls. It recommends notifying users and updating training or adoption material for Copilot in Excel."
---

Excel canvas is a Copilot capability that builds a report from your workbook data: visualizations, key metrics and insights in a single view. The canvas stays linked to the workbook and updates when the data changes. You ask for it in a prompt and refine it by chatting with Copilot. One naming note up front: the Microsoft pages read for this guide say Excel canvas or interactive canvas, and none of them uses the term "Dashboard mode".

## What Microsoft says it is

Message Center post MC1485411 describes Excel canvas as a new Copilot capability that turns workbook data into a report with visualizations, metrics and insights in a single view. Reports refresh automatically as the underlying data changes.

The Excel blog on Tech Community says that with a simple prompt, Copilot can transform workbook data into a polished, interactive canvas. The canvas stays linked to the workbook. You can revise the layout, highlight different insights or change the story by asking Copilot.

Microsoft Support lists **interactive-canvas** among the built-in skills, in the Visualization group. It says the skill can create interactive dashboards and reports from your workbook data. It is enabled by default in Copilot in Excel and is described as rolling out to production, so it may not be available for all customers.

## About the name "Dashboard mode"

Some videos and news sites use other labels for this feature. The Microsoft pages read here do not. The Tech Community blog does not mention a Dashboard mode, and the Excel what's new post of October 2026 contains neither the term nor the word dashboard. Only the Support skills page uses the word dashboards, in its description of what the interactive-canvas skill can create.

If you want to know whether a separate mode exists, check the Copilot pane in your own Excel build. This guide cannot confirm one from Microsoft documentation.

## How to use it

The pages read give no step-by-step procedure or menu path. The workflow they describe is:

1. Open the workbook that holds your data in Excel with Copilot.
2. Ask Copilot in a prompt to generate an interactive report from the workbook data.
3. Refine it with natural language instructions. Microsoft's examples are changing the layout, highlighting different insights, or tailoring the content for an audience.

Because Support lists interactive-canvas as a skill, you can also manage it in Copilot. Open the Copilot pane, select **Settings** (**...**), then **Manage plugins & skills**, and toggle skills on or off. According to Microsoft Support, a disabled skill still runs if you mention it directly with @.

Preparing the data helps any report. Microsoft's Excel blog and what's new post also describe related Copilot features: a clean data skill invoked with @clean-data, which flags issues such as inconsistent labels, wrong data types and duplicates, and a get data skill that builds a query for you. These are separate features, but they sit in the same workflow.

## Where and when it is available

Microsoft's own pages do not agree, so treat availability as something to verify.

| Source | Statement |
|---|---|
| Message Center MC1485411 | Worldwide rollout starting mid-October 2026 and expected to finish by the end of October 2026, for Excel for Windows, Excel Online and Microsoft 365 Copilot. |
| Excel blog on Tech Community | "Interactive canvas is currently available in Insiders." |
| What's new in Excel, October 2026 | Insiders of Excel for Windows, coming soon to web. Not on Excel for Mac. |
| What's new in Microsoft Copilot, October 2026 | Rolled out to Insiders in October and rolls out worldwide in November. The post says dates are tentative. |
| Microsoft Support skills page | Rolling out to production and may not be available for all customers. |

The practical reading is that the rollout was staged and still in progress as of mid-November 2026. If you do not see it, check your update channel and whether the interactive-canvas skill is on.

## Licensing and limits

- MC1485411 does not name a license. It says affected users are those with access to Copilot in Microsoft Excel.
- The Excel blog does not state license or plan requirements. It notes that the feature is subject to service capacity and usage limits, which may vary over time.
- The Support skills page lists no explicit limits for the canvas.

## For admins

MC1485411 says no action is required before rollout and describes no admin settings. It recommends telling users about the capability and updating internal training and adoption material for Copilot in Excel. It also states that no compliance considerations were identified. The Support page for managing skills describes per-user toggles in the Copilot pane, not tenant-wide controls.

## Practical tips

- Start with a clean, structured table. The canvas reads workbook data, so inconsistent headers and mixed data types will show up in the report.
- State the audience in your prompt. Microsoft lists tailoring content for an audience as a refinement option.
- Review the result against the source cells before you share it. Copilot output can be wrong, and the canvas updates as the data changes.
- Check availability on each platform you use, because Windows, web and Mac were described differently.

## Related

- [Microsoft Excel](https://www.m365.fm/entity/excel/)
- [Microsoft 365 Copilot](https://www.m365.fm/entity/copilot/)
- [Agent skill](https://www.m365.fm/entity/agent-skill/)

## Sources

- [Message Center MC1485411: Microsoft Excel, Excel canvas (mirror)](https://mc.merill.net/message/MC1485411)
- [Microsoft Tech Community: Beyond Analysis, Copilot Gets to Work in Excel](https://techcommunity.microsoft.com/blog/ExcelBlog/beyond-analysis-copilot-gets-to-work-in-excel/4517581)
- [Microsoft Tech Community: What's New in Excel (October 2026)](https://techcommunity.microsoft.com/blog/excelblog/whats-new-in-excel-october-2026/4549758)
- [Microsoft Tech Community: What's New in Microsoft Copilot, October 2026](https://techcommunity.microsoft.com/blog/microsoft-copilot-blog/what%E2%80%99s-new-in-microsoft-copilot--october-2026/4568528)
- [Microsoft Support: Use built-in skills and skills created by Microsoft with Copilot in Excel](https://support.microsoft.com/en-us/excel/copilot/copilot-in-excel-built-in-skills)
- [Microsoft Support: Use skills with Copilot in Excel to complete repeatable tasks](https://support.microsoft.com/en-us/excel/copilot/copilot-in-excel-skills)
