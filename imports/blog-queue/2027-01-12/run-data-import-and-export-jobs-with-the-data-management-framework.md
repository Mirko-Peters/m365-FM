---
title: "How to Run Data Import and Export Jobs With the Data Management Framework"
summary: "Create and run data import and export jobs in Dynamics 365 finance and operations apps: project setup, data formats, entity sequencing, mapping, security, running, job history, parallel import settings, cleanup and cautions, with gaps in the Learn page."
status: review
publish: false
author: mirko-p
date: 2027-01-12
topics: [dynamics-365]
keypoints:
  - "The Learn page describes six steps: create the job, validate mapping, verify security, run the job, review job history and clean up staging tables."
  - "Run once with Import or Export as a batch job, run immediately with Import now or Export now, or select Create recurring data job. Use the form refresh icon, not the browser refresh."
  - "Parallel import is set under Framework parameters > Entity settings > Configure entity execution parameters, with an import threshold record count and an import task count."
  - "Entities with custom import-sequence processing, such as Vendors V2, must use an import task count of 1. Execution history older than 90 days is deleted automatically without cleanup."
  - "The page has no Import/Export tile start, no add file or upload step, no execution summary or copy-to-target step and no separate export procedure."
faq:
  - q: "What are the steps of an import or export job?"
    a: "Create the job with project category, entities, data format, sequencing and staging decision. Validate the mapping with View map. Verify security. Run the job. Review job history. Clean up staging tables with Job history cleanup."
  - q: "How do I run a job?"
    a: "Select Import or Export to schedule a one-time batch job, Import now or Export now to run immediately, or Create recurring data job for recurring runs."
  - q: "How do I speed up large imports?"
    a: "Set parallel import under Data management workspace > Import / Export > Framework parameters > Entity settings > Configure entity execution parameters. Set Import threshold record count and Import task count. Too many parallel tasks can drive resource use to 100 percent."
  - q: "How long is job history kept?"
    a: "With the cleanup feature you set the number of days to retain history, with a default of seven days. Without it, execution history older than 90 days is deleted automatically."
  - q: "Which file formats can I use?"
    a: "Formats are defined in the Data sources setup tile, combining type, file format, row delimiter and column delimiter. Valid types are Excel, XML and delimited or fixed width files."
---

The Data management framework moves data in and out of Dynamics 365 finance and operations apps through data entities. This guide follows the Microsoft Learn page on creating import and export jobs. The page describes a six-step process and key settings. It does not give click-by-click screens for every step.

## The six steps

1. **Create the job.**
   - Define the project category.
   - Identify the entities. Use **Apply template** after you name and save the job, or add entities one by one.
   - Set the data format in the **Data sources setup** tile. A format combines type, file format, row delimiter and column delimiter. Valid types are Excel, XML (element or attribute style) and delimited or fixed width with a comma, semicolon, tab, vertical bar or colon.
   - Sequence the entities with **Resequencing**, available when several entities are selected, and **Sort by**.
   - Decide whether to use staging tables. For import, **Truncating** is off by default.
2. **Validate mapping** with **View map**. Choose **Mapping visualization** (default) or **Mapping details**. Required fields show a red asterisk. **Generate source mapping** maps automatically, and you map the remaining fields by hand. **Delete selection** unmaps a field. Then **Save**.
3. **Verify security.** Use **Applicable roles** or user assignment, and **Applicable legal entities** for legal-entity-based access.
4. **Run the job.**
   - **Import** or **Export** schedules a one-time batch job.
   - **Import now** or **Export now** runs it immediately.
   - **Create recurring data job** sets up recurring runs.
5. **Review job history.** Check **Execution details** (processed entities, success and failure counts, staged records) and the **Execution log**. Download staging data for export jobs, or the package for import and export jobs.
6. **Clean up staging tables** with **Job history cleanup**.

Use the form refresh icon, not the browser refresh, to see progress. A browser refresh interrupts jobs that do not run in batch.

## Export

The page has no separate export procedure. Export follows the same process, with mapping from staging table columns to target file columns. Use **Export** or **Export now**, then review the job history and download the staging data.

## Key settings

- **Parallel import.** Data management workspace > **Import / Export** > **Framework parameters** > **Entity settings** > **Configure entity execution parameters**. Set **Import threshold record count** and **Import task count**. Example from the page: 10,000 records with a threshold of 2,500 and four tasks means each thread processes 2,500 records.
- **Job history cleanup.** **Number of days to retain history** (default seven days) and **Number of hours to execute the job** (default and minimum two hours). Set **Recurring batch** to schedule it.
- **Automatic deletion.** Execution history older than 90 days is deleted automatically if you do not use the cleanup feature.
- **Archival (preview).** Needs the flight DMFEnableExecutionHistoryCleanupSystemJob and the staging cleanup feature. Days to retain package in blob accepts 7 to 90. The page also says the feature has been always on since version 10.0.20, so verify which applies.

## Cautions

- Entities with custom import-sequence processing, such as Vendors V2, must use an import task count of 1. Higher values are rejected.
- Too many parallel tasks can drive resource use to 100 percent and affect other operations.
- In delimited formats the delimiter or text qualifier must not appear in the data.
- In XML formats use only legal XML 1.0 characters. Square brackets, curly brackets and backslashes are illegal.
- Use Unicode code pages such as 65001 UTF-8 to avoid failures.
- Batch jobs are subject to throttling and may not start immediately. Batch is recommended for large volumes.
- From version 10.0.42, DMFBatchImporter and DMFBatchExporter create a child job. To track completion, monitor the end time of the last DMFImportTaskScheduler or DMFExportTaskScheduler task.

## What the page does not say

- An Import/Export tile as a starting point, and an add file or upload step.
- An execution summary screen, a view staging data action or a copy data to target action.
- A separate export procedure.
- Recurring job details beyond the button.

## A job outline

This outline is practical advice built on the page.

1. Start with one entity and a small file to test the format and mapping.
2. Generate the source mapping, fix required fields and save.
3. Run with Import now for the test, then use batch for large volumes.
4. Read the execution log for failed records.
5. Schedule job history cleanup so staging tables do not grow.

## Typical mistakes

- Refreshing the browser during a job that does not run in batch.
- Setting the import task count above 1 for entities such as Vendors V2.
- Using a delimiter that also appears in the data.
- Forgetting cleanup and relying on the 90-day automatic deletion.

## Related

- [Dynamics 365](https://www.m365.fm/entity/dynamics-365/)
- [Dataverse](https://www.m365.fm/entity/dataverse/)
- [Power Automate](https://www.m365.fm/entity/power-automate/)

## Sources

- [Data import and export jobs overview (Microsoft Learn)](https://learn.microsoft.com/dynamics365/fin-ops-core/dev-itpro/data-entities/data-import-export-job)
