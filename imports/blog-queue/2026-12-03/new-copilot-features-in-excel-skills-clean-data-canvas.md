---
title: "New Copilot Features in Excel: Skills, Clean Data, Get Data and Interactive Canvas"
summary: "The newest Copilot features in Excel as Microsoft lists them for October 2026: the clean data, get data, skill builder and skill recorder skills, interactive canvas, and where each is available."
status: review
publish: false
author: mirko-p
date: 2026-12-03
topics: [copilot, excel, power-query]
keypoints:
  - "Copilot in Excel now has skills. Type @clean-data in a prompt or choose it from the Skills menu to find and fix data problems with your approval."
  - "The skill builder and skill recorder turn instructions, examples or a demonstrated task into a reusable skill, with different availability per platform."
  - "The get data skill connects to data from a description and loads it with Power Query. Microsoft lists it for Excel for the web only."
  - "Interactive canvas builds a live report from workbook data and is listed for Insiders on Windows, with web described as coming soon."
  - "Copilot works in three modes: Allow editing, Plan and Chat only. Edit mode is not yet available on every mobile platform."
faq:
  - q: "What is new in Copilot in Excel in October 2026?"
    a: "The Microsoft Excel blog post What's New in Excel (October 2026) lists the clean data skill, a skill recorder, a skill builder, the interactive canvas and a get data skill. The Microsoft Copilot update post adds accounting skills, listed for Frontier in October and worldwide in November."
  - q: "How do I use the clean data skill?"
    a: "According to the Excel blog, type @clean-data in a Copilot prompt or select it from the Skills menu. It checks for extra spaces, inconsistent text, number and date formats, duplicates and values stored as the wrong data type. It explains what it finds, proposes corrections and lets you choose which ones to apply."
  - q: "Is Copilot in Excel available on the web, Mac and mobile?"
    a: "Microsoft Support says all three modes work on Windows, Mac and the web. On iPad, chat and plan work and edit mode is rolling out. On iPhone, chat only works with edit mode rolling out. On Android, only chat is available."
  - q: "Do these features cost extra?"
    a: "The Excel blog post does not mention licensing or pricing. Microsoft Support says Copilot must be included in your Microsoft 365 subscription and enabled by your organization, and that it might not be included in every subscription."
  - q: "How is this different from the how-to guide for Copilot in Excel?"
    a: "A how-to guide covers opening Copilot, the modes and basic prompts. This article covers the newer skill-based features that Microsoft listed in autumn 2026, and the stage each is in, which can change from month to month."
---
The newest Copilot features in Excel are skills and a few new surfaces. Microsoft's Excel blog for October 2026 lists a clean data skill, a get data skill, a skill builder, a skill recorder and an interactive canvas. The Microsoft Copilot update post adds accounting skills. Availability differs by platform and channel, so the main task is to know which feature you can actually use today. This article states Microsoft's own stage for each item and what each one does.

## The base: how Copilot works in Excel

Microsoft Support describes the starting point. Select the Copilot icon in the lower-right corner of Excel. There are three modes:

- **Allow editing** (the default): Copilot edits the workbook directly, including multi-step tasks.
- **Plan**: Copilot proposes an approach for you to review and confirm before it acts.
- **Chat only**: Copilot analyzes data and gives insights without changing the workbook.

All three modes work on Windows, Mac and the web. iPad supports chat and plan, with edit mode rolling out. iPhone supports chat only, with edit mode rolling out. Android supports chat only. Copilot has to be part of your Microsoft 365 subscription and enabled by your organization.

[Copilot](https://www.m365.fm/entity/copilot/) uses Excel's built-in features, so the content stays editable, and you can stop it at any time with the Stop button. Support also lists importing data from other workbooks, web search with citations, and custom skills, which you can also record by demonstrating a task.

## New features in October 2026

| Feature | What it does | Availability stated by Microsoft |
|---|---|---|
| Clean data skill | Finds and fixes data issues that can break formulas, lookups, PivotTables and reports | Excel for Windows, Mac and web, rolling out to general availability |
| Skill recorder | Records a recurring task and turns it into a reusable skill, or you describe the task | Insiders on Windows and Mac, generally available on the web |
| Skill builder | Creates a reusable skill from instructions, a preferred workflow, earlier prompts or examples | Rolling out to general availability on all platforms |
| Interactive canvas | Turns workbook data into dynamic content such as executive reviews and status reports | Insiders on Windows, coming soon to web |
| Get data skill | Connects to and transforms data from a description, then loads it with Power Query | Excel for the web only |

Source for the table: What's New in Excel (October 2026), published 27 October 2026 and updated 29 October 2026 on the Microsoft Excel blog.

## Clean data skill

The skill checks for extra spaces, inconsistent text, number and date formats, duplicates and values stored as the wrong data type. It explains its findings, proposes corrections and lets you choose which to apply. To use it, type `@clean-data` in a Copilot prompt or select it from the **Skills** menu. The Copilot update post says it recommends fixes that you approve. Review the proposed changes before you accept them, especially for duplicates.

## Skill builder and skill recorder

Skills are reusable procedures. The skill builder creates one from your instructions, preferred workflow, earlier prompts or examples of finished work. The skill recorder watches you perform a recurring task and turns the steps into a skill, or you can describe the task instead of demonstrating it. Microsoft Support confirms that custom skills exist in Copilot in Excel and can be recorded. Because the recorder is still Insiders-only on Windows and Mac, check your channel before you plan a team workflow around it.

## Get data skill

The get data skill connects to data based on your description and loads the result with [Power Query](https://www.m365.fm/entity/power-query/). The resulting query can be inspected, edited and refreshed, which keeps the import auditable. The Excel blog lists it for Excel for the web only and says authentication may be required, depending on the data source.

## Interactive canvas

The canvas transforms workbook data into dynamic content such as executive reviews, project updates and status reports. The output stays linked to the workbook and updates when the data changes. You can revise it by conversation. The Excel blog lists it for Insiders on Windows and says it is coming soon to the web. The Copilot update post describes it as an auto-updating report of visuals, metrics and insights, listed for Insiders in October and worldwide in November.

## Accounting skills

The Copilot update post lists accounting skills for reconciliations, journal entries and financial analysis, with reversible changes. It lists Frontier in October and worldwide in November. Frontier is an early-access program that an admin enables per tenant, and Microsoft Learn says Frontier features are preview and can change.

## How to check what you have

1. Open Copilot with the icon in the lower-right corner of Excel.
2. Open the **Skills** menu and see which skills are listed.
3. Try `@clean-data` on a small copy of a worksheet.
4. If a feature is missing, check your platform and update channel against the table above.
5. Ask your admin whether Frontier is enabled for your account if a feature is listed for Frontier.

## Common mistakes

- Running a skill on the only copy of a workbook. Work on a copy first.
- Accepting every suggested fix. The clean data skill lets you choose, so use that.
- Planning around a feature that is Insiders-only or web-only.
- Assuming mobile can edit. Support says edit mode is not available on Android and is still rolling out on iPad and iPhone.

## What the Microsoft pages do not say

The Excel blog post gives no licensing or pricing for any Copilot item. It also does not say whether the new models mentioned in the post are available in Excel. I could not read the full text of the Excel blog posts on Agent Mode in Excel and on App Skills, so this article does not describe them.

## Related

- [Microsoft 365 Copilot](https://www.m365.fm/entity/copilot/)
- [Microsoft Excel](https://www.m365.fm/entity/excel/)
- [Power Query](https://www.m365.fm/entity/power-query/)
- [Microsoft Frontier program](https://www.m365.fm/entity/frontier-program/)

## Sources

- [What's New in Excel (October 2026) (Microsoft Excel Blog)](https://techcommunity.microsoft.com/blog/excelblog/whats-new-in-excel-october-2026/4549758)
- [What's new in Microsoft Copilot: October 2026 (Microsoft Tech Community)](https://techcommunity.microsoft.com/blog/microsoft-copilot-blog/what's-new-in-microsoft-copilot--october-2026/4568528)
- [Get started with Copilot in Excel (Microsoft Support)](https://support.microsoft.com/en-us/office/get-started-with-copilot-in-excel-d7110502-0334-4b4f-a175-a73abdfc118a)
- [Get started with the Microsoft Copilot Frontier program (Microsoft Learn)](https://learn.microsoft.com/microsoft-365/admin/manage/get-started-frontier)
