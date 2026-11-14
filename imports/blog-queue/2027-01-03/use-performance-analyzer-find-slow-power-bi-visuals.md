---
title: "How to Use Performance Analyzer to Find Slow Power BI Visuals"
summary: "Use Performance Analyzer in Power BI Desktop to record report interactions, read DAX query, visual display and other durations, copy visual queries, run them in DAX query view and export results."
status: review
publish: false
author: mirko-p
date: 2027-01-03
topics: [power-bi-performance-analyzer, power-bi-desktop]
keypoints:
  - "Open Performance Analyzer from the Optimize ribbon in Power BI Desktop. In the service, edit a report and use the View menu."
  - "Select Start recording, interact with the report, then Stop. Each action is logged under a section such as Changed a slicer."
  - "Each visual log splits into DAX query, Direct query, Visual display and Other, so you can see where the time goes."
  - "Copy query and Run in DAX query view let you inspect and test the DAX behind a slow visual. Run in DAX query view is not available in the service."
  - "Clear erases results permanently. Export saves the pane's information as a .json file first."
faq:
  - q: "Where do I find Performance Analyzer?"
    a: "According to Microsoft Learn, in Power BI Desktop select the Optimize ribbon and then Performance Analyzer. In the Power BI service, open a report, select Edit, then the View menu and Performance Analyzer. The pane opens to the right of the report canvas."
  - q: "What do the log categories mean?"
    a: "Microsoft Learn says DAX query is the time from the visual sending the query until the model returns results. Direct query is the time for the external query in DirectQuery mode. Visual display is the time to draw the visual. Other is time spent preparing queries, waiting for other visuals or doing background work."
  - q: "How do I test one visual?"
    a: "Learn says you can select analyze this visual in the visual's top-right corner while recording, or select refresh visuals in the pane to capture timing for all visuals on the page."
  - q: "How can I look at the DAX query of a slow visual?"
    a: "Select Copy query, or Run in DAX query view in Power BI Desktop. Learn says Run in DAX query view is not available in the service. There, copy the query, select open data model, go to DAX query view and run it."
  - q: "Can I save the results?"
    a: "Yes. Learn says to select export to save the pane's information as a .json file. Selecting Clear erases results and the cleared information is not saved."
---

Performance Analyzer records how long each visual in a Power BI report takes to run its query and draw itself. You start recording, use the report the way a reader would, stop, and read the log to see which visuals are slow and whether the time is in the query, the display or elsewhere. This guide follows the Microsoft Learn article.

## Open it

- **Power BI Desktop:** select the **Optimize** ribbon, then **Performance Analyzer**. Learn notes that a screenshot caption refers to the View ribbon, so look in both if you do not see it.
- **Power BI service:** open a report, select **Edit**, open the **View** menu and select **Performance Analyzer**.

The pane opens to the right of the report canvas.

## Record a session

1. Select **Start recording**. The button turns gray and **Stop** becomes active.
2. Interact with the report, for example change a slicer or open another page. Each action appears under a section identifier such as Changed a slicer.
3. Select **Stop**. The results stay in the pane.
4. Select **Clear** to erase them. Cleared information is not saved.

To capture timing for every visual on the current page, select **refresh visuals** in the pane. To refresh a single visual while recording, select **analyze this visual** in the visual's top-right corner.

## Read the log

For each visual, the log breaks the duration into parts:

| Part | What it measures |
| --- | --- |
| DAX query | Time from the visual sending the query until the semantic model or Analysis Services model returns results |
| Direct query | For DirectQuery storage mode, time for the external query to return |
| Visual display | Time for the visual to draw on screen, including retrieving web images or geocoding |
| Other | Time spent preparing queries, waiting for other visuals or other background processing |
| Evaluated parameters (preview) | Time spent evaluating field parameters within a visual |

Learn explains that **Duration (ms)** is the difference between a start and end timestamp for each operation. Most canvas and visual operations run one after another on a single UI thread shared by many operations, so the reported duration includes time spent queued while other operations finish. The DAX query time depends on calculation complexity, the number of tables involved and the relationships between them.

## Work out what to fix

Use the split as a guide:

- **High DAX query time:** the model or the measure is the likely place to look. Copy the query and examine it.
- **High Direct query time:** the source database answered slowly.
- **High Visual display time:** the visual itself is heavy, for example it draws many marks or loads web images.
- **High Other time:** the visual waited for others. Look at how many visuals are on the page.

Because durations include waiting on the shared thread, a slow-looking visual may be waiting behind another. Record the page again with fewer visuals before drawing a conclusion. That is a practical suggestion, not a Microsoft statement beyond the queueing note above.

## Copy and run the query

- **Copy query:** copies the visual's DAX query. For DirectQuery tables it includes both the DAX query and the translated SQL or KQL query.
- **Run in DAX query view:** runs the query in DAX query view in Power BI Desktop. It is not available in the Power BI service. In the service, copy the query, select **open data model**, go to DAX query view and run it there.

Learn adds that visual DAX is more verbose than necessary and shows a Copilot prompt for DAX query view: "Remove the VARs and TOPN and simplify this DAX query". It warns that Copilot output is AI-generated and may contain errors, so check any simplified query before relying on it.

## Export

Select **export** to save the information in the pane as a **.json** file. Do this before you select **Clear** if you want to compare runs later. Learn mentions a Performance Analyzer sample on GitHub that includes a document describing the export file format.

## A repeatable routine

1. Open the report page that readers complain about.
2. Start recording and select **refresh visuals**.
3. Stop and export the log as the baseline.
4. Sort mentally by total duration. Take the slowest visual.
5. Copy its query, run it in DAX query view and adjust the measure or model.
6. Record again and compare to the baseline.

## What the page does not cover

The article does not include guidance for external tools such as DAX Studio. It mentions only DAX query view, Copilot and the GitHub sample, so this guide does not either.

## Typical mistakes

- Clearing the pane before exporting.
- Reading Duration as pure compute time when it includes queueing.
- Looking for Run in DAX query view in the service.
- Recording without interacting like a real reader, so no slicer or page change is logged.

## Related

- [Power BI Performance Analyzer](https://www.m365.fm/entity/power-bi-performance-analyzer/)
- [Power BI Desktop](https://www.m365.fm/entity/power-bi-desktop/)
- [Power BI](https://www.m365.fm/entity/power-bi/)

## Sources

- [Use Performance Analyzer to examine report element performance (Microsoft Learn)](https://learn.microsoft.com/power-bi/create-reports/desktop-performance-analyzer)
