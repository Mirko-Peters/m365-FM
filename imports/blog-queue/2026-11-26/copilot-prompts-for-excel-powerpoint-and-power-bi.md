---
title: "Copilot Prompts for Excel, PowerPoint and Power BI: Examples That Work"
summary: "Prompt examples quoted from Microsoft's own pages for Copilot in Excel, PowerPoint and Power BI, plus what each app needs from you: named columns, audience and length, report scope. Includes limits."
status: review
publish: false
author: mirko-p
date: 2026-11-26
topics: [copilot, excel, powerpoint, copilot-in-power-bi]
keypoints:
  - "Microsoft's Excel tip is to be specific and name the columns Copilot should analyze. Hovering over the superscript number in an answer shows the source data."
  - "For PowerPoint, Copilot asks about audience, deck length, template or design direction and imagery. Putting those in the first prompt saves a round trip."
  - "Power BI page prompts follow a pattern in Microsoft's examples: 'Create a page to' plus an action, the metrics and the dimensions."
  - "By default Copilot in Power BI summarizes visuals across the whole report. Say in the prompt if you want one page or one region."
  - "Each app has limits: Excel needs table-like data for analysis, PowerPoint works best with Word files under 24 MB, Power BI needs a paid Fabric capacity."
faq:
  - q: "What are good Copilot prompts for Excel?"
    a: "Microsoft Support lists examples such as 'Which region had the highest and lowest sales?', 'Add a column that calculates the profit margin for each product.' and 'Explain the formula in the selected cell.' Its tip is to name the columns you want analyzed, because specific prompts give more accurate results."
  - q: "What are good Copilot prompts for PowerPoint?"
    a: "Microsoft's page on creating a presentation gives only basic example prompts. It says Copilot may ask about audience, deck length, template or design direction and imagery, and that answering these helps the result match your needs. For a deck from a document, it recommends Word Styles and relevant images in the Word file."
  - q: "What prompts work in Copilot for Power BI?"
    a: "Microsoft Learn quotes page-creation prompts that begin 'Create a page to' and name metrics and dimensions, and summary prompts such as 'What is this report page about?' and 'Prep a summary for my team.' It says prompts are a starting point and you should modify the page Copilot creates."
  - q: "Does Copilot in Excel change my workbook?"
    a: "It depends on the mode. Microsoft Support describes Edit as the default, where Copilot changes the workbook directly. Plan proposes steps and waits for confirmation. Chat only answers questions without changes. Edits can be undone or reverted through previous versions. A separate analysis feature does not alter the workbook."
  - q: "Why is Copilot in Power BI not available for me?"
    a: "Microsoft Learn says an administrator must enable Copilot in Microsoft Fabric and the tenant switch, the capacity must be in a supported region, and only paid SKUs are supported, not trial SKUs. Outside the US or EU data boundary Copilot is disabled by default unless a tenant setting is turned on."
---

Copilot answers better when the prompt names the data, the goal and the audience. Microsoft's own pages for Excel, PowerPoint and Power BI say the same thing in different words. This article collects the prompts those pages quote, groups them by task and notes what each app needs.

Where I add a prompt pattern of my own, it is labeled as a pattern and not as a Microsoft quote. The Microsoft pages vary in how many examples they give, and PowerPoint has the fewest.

## Excel

Open Copilot from the icon in the lower-right corner of Excel. Microsoft Support describes these modes: **Edit** (the default, changes the workbook directly), **Plan** (proposes steps and waits for your confirmation) and **Chat only** (answers without changing anything). The tip repeated across the pages: be specific, and name the columns you want analyzed.

### Analysis questions

- "Which region had the highest and lowest sales?"
- "Are there any outliers or anomalies in this data?"
- "What are the mean and median of revenue by region?"
- "Compare product sales trends across regions."
- "List all unique job titles in the dataset."

### Text in cells

- "Review the customer feedback on this sheet and identify major themes."
- "Summarize the comments."

### Formulas

- "Add a column that calculates the profit margin for each product."
- "Add a column that shows each region's percentage of total sales."
- "Create a column that looks up the quantity in stock for each item from the inventory sheet."
- "Explain the formula in cell D3."

Microsoft says to name the format if you want a PivotTable. Hovering over the superscript number in an analysis shows the source data Copilot used.

### Excel limits

The advanced analysis feature works with single tables, table-like ranges or several such ranges, does not support unstructured data and does not alter the workbook. The pages give no data size limits. Editing needs Calculation Options set to Automatic. Review everything, because Microsoft says AI output can be wrong.

## PowerPoint

Start a new presentation, select the **Copilot** icon at the bottom-right and describe what you want. Copilot may ask clarifying questions. The Microsoft page lists what it asks about: audience, deck length, template or design direction, and imagery. You can answer or skip them.

Microsoft's quoted examples are plain requests such as "Help me create a new presentation with Copilot." The page gives few content prompts, so here is a pattern built from the questions Copilot asks:

> Create a 10-slide deck for [audience] about [topic]. Use our company template. Keep slides short, with one image per section.

### Starting from a document

Copilot can build slides from a Word document, using its structure and images. Microsoft's tips: organize the Word file with Word Styles so Copilot can split it into slides, include relevant images, and start from your organization's template so the theme is kept. Copilot works best with Word documents smaller than 24 MB. A separate PowerPoint page says Copilot Pro (home) supports one Word file, while Microsoft Copilot (work) also supports PDF and encrypted files.

### PowerPoint limits

- Works with .ppt and .pptx files and needs an internet connection.
- Rewrite works only on entire text boxes, one response at a time.
- Adding a slide, organizing and adding images need a Microsoft Designer license.
- Using your organization's branding needs a Microsoft Copilot license.
- Review the output, because generated content can be inaccurate.

## Power BI

### Create a report page

Microsoft Learn quotes prompts that start the same way: "Create a page to" followed by an action. Examples:

- "Create a page to analyze the sales amount, revenue, and profit margin of different products, categories, and subcategories over time and across regions."
- "Create a page to evaluate the impact and return on investment of various promotions on sales, revenue, and customer acquisition and retention."
- "Make a table of contents for this report that contains a brief description of what each page is about."

Each page prompt lists the metrics and the dimensions. Learn does not state this as a rule, so treat it as an observed pattern. It also says prompts are a starting point and you should modify the page afterward.

### Summarize and ask

In the report, select **Copilot** in the ribbon, pick a suggested prompt or one from the prompt guide, and press Enter. Microsoft's examples:

- "What is this report page about?"
- "Prep a summary for my team."
- "Give me a summary of my revenue over the last fiscal year and describe any significant outliers."
- "Summarize the data specific to Seattle, WA."

By default Copilot summarizes visuals across the entire report, not only the current page, so narrow the scope in the prompt when needed.

### Power BI limits

- An administrator must enable Copilot in Microsoft Fabric and the tenant switch.
- The Fabric capacity must be in a supported region and be a paid SKU. Trial SKUs are not supported.
- Outside the US or EU data boundary, Copilot is disabled by default unless a tenant setting is enabled.
- Summaries consider only visuals with fewer than 30,000 rows and identify up to 20 relevant visuals to summarize from. Text over 500 characters is truncated.
- Copilot applies page and report-level filters but not visual-level filters.

## A reusable prompt shape

1. Name the data: the table, columns, page or file.
2. State the task: analyze, add a column, summarize, create a page.
3. State the audience or output: for my team, for leadership, as an email.
4. Add one constraint: scope, length or template.
5. Follow up instead of rewriting. Microsoft recommends starting broad, then adding detail.

## Related

- [Microsoft 365 Copilot](https://www.m365.fm/entity/copilot/)
- [Microsoft Excel](https://www.m365.fm/entity/excel/)
- [Microsoft PowerPoint](https://www.m365.fm/entity/powerpoint/)
- [Copilot in Power BI](https://www.m365.fm/entity/copilot-in-power-bi/)

## Sources

- [Microsoft Support: Get started with Copilot in Excel](https://support.microsoft.com/office/d7110502-0334-4b4f-a175-a73abdfc118a)
- [Microsoft Support: Copilot in Excel, prompt tips and model selection](https://support.microsoft.com/article/1604c8eb-57f1-4db1-8363-d53336228c65)
- [Microsoft Support: Frequently asked questions about Copilot in Excel](https://support.microsoft.com/office/7a13758f-d61e-4a56-8440-f2c9a07802ec)
- [Microsoft Support: Get data insights with Copilot in Excel](https://support.microsoft.com/en-US/Excel/copilot/data-insights-with-copilot-in-excel)
- [Microsoft Support: Get direct answers to your data analysis questions](https://support.microsoft.com/en-US/Excel/get-direct-answers-to-your-data-analysis-questions)
- [Microsoft Support: Create a new presentation with Copilot in PowerPoint](https://support.microsoft.com/copilot-powerpoint)
- [Microsoft Support: Copilot in PowerPoint, requirements and limitations](https://support.microsoft.com/office/3e229188-9086-4f4c-9f9f-824cd25ae84f)
- [Microsoft Learn: Prompts for creating report pages with Copilot in Power BI](https://learn.microsoft.com/en-us/power-bi/create-reports/copilot-prompts-report-pages)
- [Microsoft Learn: Summarize a report page in the Copilot pane](https://learn.microsoft.com/en-us/power-bi/create-reports/copilot-pane-summarize-content)
