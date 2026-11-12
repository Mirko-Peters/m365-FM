---
title: "How to Use Copilot in Excel: Prompts, Formulas, Charts and Fixes"
summary: "How to use Copilot in Excel: open it, pick a mode, ask for insights, formulas, charts and PivotTables, and fix the case where the Copilot button is missing."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [copilot, excel]
keypoints:
  - "Open Copilot in Excel from the Copilot icon in the lower-right corner of the workbook. On Windows, Alt+C also works, and F6 works on every platform."
  - "Copilot has three modes: Allow editing (the default), Plan, which shows a plan for you to confirm, and Chat only, which never changes the workbook."
  - "Name the columns and the output you want in your prompt, for example a PivotTable of sales by month. Specific prompts give more accurate results."
  - "Always review what Copilot creates. Microsoft says to review, edit and verify anything it produces."
  - "If the button is missing, check your license, update to the latest build, refresh the license, check the update channel and the privacy settings."
faq:
  - q: "How do I open Copilot in Excel?"
    a: "Select the Copilot icon in the lower-right corner of your workbook. On Windows you can press Alt+C, on Mac Cmd+Control+I, and F6 works on all platforms. The icon only appears if your account has Copilot access, through a Microsoft 365 Personal, Family or Premium subscription or a Microsoft Copilot license."
  - q: "Why is Copilot not showing in my Excel?"
    a: "The most common causes are no Copilot license, an old Office build, or a device on the Semi-Annual Enterprise Channel, which has no Copilot features. Also check File, Account, Account Privacy, Manage Settings, and turn on Experiences that analyze your content and All connected experiences. Then update the license and restart the apps."
  - q: "Can Copilot in Excel write formulas for me?"
    a: "Yes. Describe the result in plain words and Copilot can add a column or row that calculates it, such as a total or a profit margin, and explain how the formula works. It can also suggest a lookup such as XLOOKUP. Check the formula against a few rows you can verify by hand before you rely on it."
---
To use [Copilot](https://www.m365.fm/entity/copilot/) in Excel, open your workbook, select the **Copilot** icon in the lower-right corner, type what you want in plain words and review the result before you keep it. You can ask for summaries, trends, a formula, a chart or a PivotTable, and in the default mode Copilot makes the changes in the workbook for you. This article is for [Excel](https://www.m365.fm/entity/excel/) users who want to try it and for admins who get the question "why don't I see Copilot?". You'll learn what you need, how to use the three modes, which kinds of prompts work, and what to check when the button isn't there.

A word of caution first, in Microsoft's own wording: review, edit and verify anything Copilot creates. It's a fast assistant, not a source of truth. A wrong total in a report is still your wrong total.

## What you need before Copilot appears

Copilot is not part of every Microsoft 365 subscription. Microsoft's page [Get started with Copilot in Excel](https://support.microsoft.com/en-us/excel/copilot/get-started-with-copilot-in-excel) says that if you don't see it, it may not be included in your subscription, or your organization's settings may restrict it. Microsoft's page on the Copilot button adds that the button only appears for people with Copilot access. That comes from a Microsoft 365 Personal, Family or Premium subscription, or a Microsoft Copilot license. Without that access it doesn't show.

The platforms listed on the Get started page are Excel for Microsoft 365, Excel for Microsoft 365 for Mac, Excel for iPad and Excel Web App. What you can do depends on the platform, and the page lists it as follows at the time of writing:

- **Windows, Mac and web.** Edit, chat and plan modes.
- **iPad.** Chat and plan. Edit is described as rolling out.
- **iPhone.** Chat. Edit is described as rolling out.
- **Android.** Chat only.

Microsoft doesn't give numeric limits on that page, such as a maximum number of rows or a file size cap. It also links to a separate page for supported languages, which I didn't open. If you work in a language other than English, check that page before you plan a rollout.

Note that I'm describing Microsoft's pages as I read them. Copilot changes fast, and the details of licensing and rollout are the part most likely to be out of date by the time you read this.

## How to use Copilot in Excel step by step

1. **Open the workbook** you want to work on. Copilot works on the content in the open workbook.
2. **Select the Copilot icon** in the lower-right corner. Microsoft calls this the Copilot Dynamic Action Button, and it opens the Excel agent in a chat pane on the right. You can dock it to the side or move it to the ribbon. Keyboard shortcuts: **Alt+C** on Windows, **Cmd+Control+I** on Mac, and **F6** on all platforms.
3. **Choose a mode** (see below).
4. **Type your request** in the chat input field. Describe the outcome, name the columns you care about and say what form you want, such as a chart or a PivotTable.
5. **Watch and review.** In edit mode, Copilot builds a step-by-step plan, works in the workbook, checks the results against your request, and you can see its steps in the pane and the changes appearing live.
6. **Stop it if needed.** The **Stop** button on the right of the chat input field pauses or stops the work.
7. **Refine.** If the result isn't what you wanted, add more detail and ask again. Microsoft says Copilot may not get it right the first time.

### The three modes

- **Allow editing** is the default. Copilot edits the workbook directly, including multi-step jobs such as reshaping data, merging sheets or building a report with several parts.
- **Plan** generates a plan for you to review and confirm before it changes anything. Use it on files that matter, or when you aren't sure what a vague request will do.
- **Chat only** gives insights without touching the workbook. Use it when you only want an answer.

For a shared file or a workbook with formulas other people depend on, I'd start in Plan or Chat only, and save a copy first. In the default mode Copilot changes the workbook, and a copy gives you a way back.

## Ask for insights: summaries, trends and outliers

Microsoft's page on [data insights with Copilot in Excel](https://support.microsoft.com/en-us/excel/copilot/data-insights-with-copilot-in-excel) says you can ask a question in your own words to surface summaries, trends and outliers. The answer can come as a chart, a PivotTable or a text summary. If you want a specific format, say so in the prompt.

What makes a prompt work, based on that page:

- **Name the columns.** Naming the columns you want analyzed produces more accurate results.
- **State the output.** "Show a PivotTable of sales by region" beats "analyze my sales".
- **Say what to compare.** Months, categories, regions.

Examples that follow those rules:

- "Summarize revenue by month and point out the weakest month."
- "Which products in the Category column have the largest spread in the Price column?"
- "Show outliers in the Expenses column."

For text data, such as survey answers or reviews, Microsoft says Copilot can summarize it, identify themes and sentiment, and add the results as a new column. Hovering over a superscript number shows the source data. That's useful for checking whether a "theme" is real or invented.

## Formulas: add, explain and look up

"Copilot excel formulas" is the use many people start with, and Microsoft's insights page covers three things:

- **Calculated columns or rows.** Copilot can add a column or a row that calculates values from your data and explain how each formula works. Examples on the page include totals, profit margins and summary rows.
- **A single cell.** It can suggest a formula for one cell and explain it.
- **Lookups.** It can build cells that retrieve values from elsewhere in the workbook, recommend a formula such as XLOOKUP, and add a column for the results.

To understand a formula someone else wrote, select the cell and ask Copilot to explain it, or name the cell, for example D3.

How to stay safe with formulas that Copilot writes:

1. Look at the formula it inserted, not just the number.
2. Check two or three rows by hand.
3. Check the edges: the first row, the last row, and a row with an empty cell.
4. Make sure the formula refers to the right columns. If you have two columns with similar names, Copilot can pick the wrong one.

If you've never used XLOOKUP, learn it first so you can judge what Copilot gives you. A formula you can't read is a risk, even when it works today.

## Charts and PivotTables

Per Microsoft's page on [visualizing your data with Copilot in Excel](https://support.microsoft.com/en-us/excel/copilot/visualize-your-data-with-copilot-in-excel), you describe the chart you want and Copilot generates it. The examples include a chart with vendor budget on the X axis and headcount on the Y axis, and a line chart with data labels and gridlines. For a PivotTable, you can specify the layout, such as month in rows and category in columns with the sum of sales. If the result doesn't match, add more detail and ask again.

The page doesn't state data requirements. In practice, a clean list with one header row and no blank rows gives better results, because Copilot has to find the data. That advice is mine and not from Microsoft's page, but it follows from how any tool reads a range. If your data is messy, clean it first or ask Copilot to help reshape it in edit mode.

## What else Copilot can do in edit mode

The Get started page lists these capabilities for edit mode:

- Add, rename and delete sheets, change cell values and ranges, and manage layout.
- Apply conditional formatting, data validation, borders and styles.
- Generate data from prompts, calculate and apply formulas across several sheets, and summarize data.
- Create and edit charts, PivotTables and shapes with editable links to the source data, and build dashboards, planning tools and templates from scratch.
- Sort, filter and apply conditional formatting to focus on the key data.
- Fetch information from the web, with citations to the sources.
- Define custom skills, or record a skill by showing it a task, for repeatable jobs.

Microsoft also says Copilot can retrieve data from other Excel workbooks saved to OneDrive or SharePoint or on your computer. Copilot updates the workbook using Excel's built-in features, your content stays editable and you control what changes.

What the pages don't say matters too. Nothing there describes Copilot watching a form or an ad platform and writing new rows by itself. Some guides online suggest that. Automation like that is a job for tools such as Power Automate and Excel tables, not for the Copilot chat.

## Copilot in Excel not showing: a checklist

Microsoft's page [How to find and enable missing Copilot button](https://support.microsoft.com/en-us/office/how-to-find-and-enable-missing-copilot-button-in-microsoft-365-apps-c8482b93-4b96-4bb8-8ec9-5148f4d42441) gives the order. Work through it from the top.

1. **Look in the right place.** By default the button is in the lower-right corner of the workbook, and it can be moved next to the ribbon.
2. **Confirm your license.** Copilot may not be in your subscription or may be restricted by your organization. Your admin can verify which license you have.
3. **Install the latest Office updates.** Microsoft doesn't give version numbers on the page.
4. **Refresh the license.** Go to **File** > **Account**, select **Update License**, then close and restart all Microsoft 365 apps.
5. **Check the update channel (business users).** Semi-Annual Enterprise Channel doesn't provide Copilot features. Switch to Current Channel or Monthly Enterprise Channel, which your help desk does. To check, go to **File** > **Account** and read Product Information.
6. **Check the privacy settings.** Go to **File** > **Account**, then **Account Privacy** > **Manage Settings**. Turn on **Experiences that analyze your content** and **All connected experiences**. If your organization manages Microsoft 365, IT controls these.

A newly assigned license can take time to show up, so wait before you call it broken.

For admins: the Dynamic Action Button page states that the rollout of the new button ran worldwide from April to June 2026, and that GCC, GCC High and DoD environments get it starting in October 2026. It also says IT admins don't need to take any action. If users say the icon has "moved", that's the likely reason.

## Common mistakes

- Taking Copilot's numbers as final without checking a few rows.
- Writing a vague prompt, such as "make this better", and getting a vague result.
- Using edit mode on the only copy of an important file.
- Expecting Copilot to be there for everyone in the company. It depends on license, channel and privacy settings.
- Looking for the button on the Home tab. Microsoft's pages put it in the lower-right corner, though it can be moved to the ribbon.
- Hoping Copilot will keep a spreadsheet up to date from outside sources by itself.

## Related topics to explore

- **Write better prompts.** Name columns, state the output, and refine in small steps.
- **Copilot licensing and rollout.** Who gets Copilot and when, a question for admins before they promise it to teams.
- **Formulas Copilot suggests.** Learn XLOOKUP and basic functions so you can judge the answer.
- **Privacy settings and connected experiences.** What "Experiences that analyze your content" means for your organization.
- **Pivot tables and charts by hand.** Know how to build them yourself so you can fix what Copilot produces.

## Next step

Open a copy of a real workbook, switch Copilot to Chat only and ask for a summary that names two columns. Then switch to Plan mode and ask for a PivotTable. That is the safest way to learn how to use Copilot in Excel before you let it edit a file you care about.
