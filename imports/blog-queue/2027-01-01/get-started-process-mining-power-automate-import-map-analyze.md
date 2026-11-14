---
title: "Get Started With Process Mining in Power Automate: Import, Map and Analyze an Event Log"
summary: "How to get started with process mining in Power Automate using Microsoft Learn: required event log fields, creating a process, importing CSV, transforming and mapping data, refresh options, and what the overview does not say about licensing and limits."
status: review
publish: false
author: mirko-p
date: 2027-01-01
topics: [process-mining, power-automate]
keypoints:
  - "A process needs an event log with Case ID, Activity Name and timestamps. Case ID, Activity and Start timestamp are mandatory when you map the data."
  - "In Power Automate select Process mining, then Start here in Create new process, enter a name, pick a data source and finish with Save and analyze."
  - "Learn recommends a small Text/CSV export for a first trial. The Text/CSV connector needs OneDrive for Business, otherwise use Blank table with fewer records."
  - "The Dataverse connector is not supported. Learn describes connecting through the OData connector with the environment URL plus api/data/v9.2."
  - "Scheduled refresh runs at most every 1 day according to Learn, and the pages I read state no license requirements or data volume limits."
faq:
  - q: "What data does process mining need?"
    a: "According to Microsoft Learn, an event log with a case ID on all activities, an activity name, and timestamps. Event logs have one timestamp and activity logs have a start and an end timestamp."
  - q: "Which fields are mandatory when mapping?"
    a: "According to Microsoft Learn, Case ID, Activity and Start timestamp are mandatory, and you cannot continue the analysis without them."
  - q: "How do I connect to Dataverse?"
    a: "According to Microsoft Learn, the Dataverse connector is not supported. Use the OData connector, append api/data/v9.2 to the environment URL, and use an organizational account."
  - q: "How often can a process refresh?"
    a: "According to Microsoft Learn, the highest refresh frequency is currently every 1 day."
  - q: "Does the overview state licenses or limits?"
    a: "No. The Microsoft Learn overview and the data preparation page state no license requirements and no data volume limits."
---

To start with process mining in Power Automate, prepare an event log with a case ID, activity names and timestamps, create a process under **Process mining**, import the log, map the columns and select **Save and analyze**. The Microsoft Learn overview is short, so this guide also uses the data preparation, transform and map, tutorial and refresh pages.

## What process mining is

Learn defines process mining as a technology that helps businesses understand their real processes and find opportunities for improvement, automation and digitalization. In Power Automate it extracts event data from your system of record and visualizes the processes. Users can customize reports, compare processes, find root causes of inefficiencies and monitor KPIs. The overview lists these components: data requirements, transform and map data, troubleshoot issues, KPIs and visualizations, edit and refresh processes, and share processes.

## Prepare the event log

The data preparation page says the required fields are:

- **Case ID:** an instance of your process, such as an order ID or request ID. It must be present for all activities.
- **Activity Name:** the steps of the process, such as submit request or request approved.
- **Timestamps:** event logs have one timestamp, and activity logs have a start and an end timestamp.

Optional attributes include a resource, event-level and case-level attributes, and financial values per event or per case. Many database tables hold current state and not history, so you often need a history table. For Dynamics applications the page names the Activities table. Log tables can be complex, may need joins, and may not log all relevant events.

## Create a process

The tutorial describes these steps:

1. Sign in to Power Automate and select your environment.
2. In the navigation pane, select **Process mining**.
3. In **Create new process**, select **Start here**.
4. Enter a process name and select **Import data**. Optionally add a description, select **Continue**, optionally attach a Power BI workspace and report name, and select **Continue**.
5. On **Choose a data source** select a source, for example **Text/CSV**.

If you get an error while creating or analyzing a process, the tutorial says to ask your environment administrator for the **Environment Maker** security role. If you do not see all features in the default environment, create a new environment.

## Choose and connect a data source

The page recommends a quick trial with a small CSV export. The Text/CSV connector needs OneDrive for Business. Without it use **Blank table**, which cannot import as many records. Connecting directly to a database through Power Query keeps the report current. Common connectors named on the page are Text/CSV, Microsoft Dataverse and SQL Server.

The page lists two limits. The Dataflow connector is not supported and you cannot use an existing dataflow as a source. The Dataverse connector is not supported either, so connect with the OData connector:

1. Get the environment URL and append `api/data/v9.2`.
2. Under connection credentials set the authentication kind to **Organizational account** and sign in.
3. Expand the **OData** folder. Tables appear with logical names, for example Activities as `activitypointers`.

## Transform and map

After you choose a source, the **Power Query Editor** opens. Learn suggests filtering activity names, renaming activities with **Replace values**, keeping a date range, and merging columns to build a case ID. As an example it keeps the top 150,000 rows after sorting by start timestamp. The page presents this as a strategy and not a stated platform limit.

On the mapping screen choose the attribute type for each column. **Case ID**, **Activity** and **Start timestamp** are mandatory. Select **Save and analyze**. The analysis can take a few minutes.

## Read the results

The tutorial describes a process map, a dashboard with KPIs, a customize panel with frequency, performance and finance views, filters that can be saved as views, and a compare feature that colors steps that are common or exclusive to a view. A Process Mining desktop app is available for deeper analysis. The tutorial uses fictitious sample accounts payable refund data.

## Refresh

For transactional sources such as Dataverse or SQL, select **Refresh data**. **Schedule refresh** is on the Data Source card. The default is every day starting tomorrow, and the highest frequency is currently every 1 day. For very large data the page mentions incremental refresh from Azure Data Lake Storage Gen2 or Fabric OneLake without describing the setup. A custom trigger flow can start an analysis after an external event.

## Suggestion: a first week plan

This section is a practical suggestion and not a Microsoft statement.

1. Pick one process with a clear case ID, such as purchase requests.
2. Export a small sample as CSV and run the whole flow once.
3. Check the activity names and rename them before you share the map.
4. Move to a live source and schedule the refresh only when the map answers a real question.

## Not covered

The pages I read do not describe the following:

- License and plan requirements.
- Data volume and size limits.
- Where ingested data is stored.
- Preview or general availability status of process mining.
- Failure handling for refresh.

## Related

- [Process mining](https://www.m365.fm/entity/process-mining/)
- [Power Automate](https://www.m365.fm/entity/power-automate/)

## Sources

- [Overview of process mining in Power Automate (Microsoft Learn)](https://learn.microsoft.com/power-automate/process-mining-overview)
- [Prepare processes and data (Microsoft Learn)](https://learn.microsoft.com/power-automate/process-mining-processes-and-data)
- [Transform and map data (Microsoft Learn)](https://learn.microsoft.com/power-automate/process-mining-transform)
- [Get started with the process mining capability (Microsoft Learn)](https://learn.microsoft.com/power-automate/process-mining-tutorial)
- [Edit and refresh processes (Microsoft Learn)](https://learn.microsoft.com/power-automate/process-mining-data-source)
