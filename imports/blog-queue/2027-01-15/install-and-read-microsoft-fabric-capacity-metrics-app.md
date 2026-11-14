---
title: "How to Install and Read the Microsoft Fabric Capacity Metrics App"
summary: "Install the Fabric Capacity Metrics app as a capacity admin, run it the first time with UTC offset and capacity settings, then read the Health, Compute, Storage and Timepoint pages. Includes data latency, sharing and the limits of the app."
status: review
publish: false
author: mirko-p
date: 2027-01-15
topics: [fabric, fabric-capacity, power-bi]
keypoints:
  - "You must be a capacity admin and have a Power BI license (Pro, Premium Per User or an individual trial) to install and use the app."
  - "Install it in a workspace with a Pro license to avoid throttling from capacity overutilization; the app is also found in Power BI service under Apps."
  - "First run needs the UTC_offset value and, depending on version, RegionName and capacity settings, then OAuth2 and the Organizational privacy level."
  - "Usage data usually appears within 10 to 15 minutes, while capacities, workspaces and items refresh at midnight local time."
  - "The app has no alerts; Learn points to Fabric capacity overview events and operation events for notifications."
faq:
  - q: "Who can install the metrics app?"
    a: "Microsoft Learn says you need to be a capacity admin and have a Power BI license, either Pro, Premium Per User or a Power BI individual trial, to access and use the app. To avoid throttling due to capacity overutilization, install it in a workspace with a Pro license."
  - q: "Where do I get it?"
    a: "From AppSource, search for Microsoft Fabric Capacity Metrics and select Get it now, or in Power BI service select Apps, Get apps, search for Microsoft Fabric and select the app. Government cloud installs use dedicated links for GCC, GCC High, DoD and the China cloud."
  - q: "What do I enter on the first run?"
    a: "UTC_offset is required, a number from 14 to -12 with .5 for half-hour zones, for example 5.5 for India. RegionName applies to version 2.0 and below, and capacity ID fields apply to older versions. Then choose OAuth2 as the authentication method and Organizational as the privacy level, and select a capacity."
  - q: "Why does the app show no data?"
    a: "After configuration, it can take a few minutes to get data, and Learn says to refresh if nothing shows on the first open. If an installed app does not show data or cannot refresh, Learn's steps are to delete the old app, reinstall the latest version and update the semantic model credentials."
  - q: "Does the app send alerts?"
    a: "No. Learn says it does not support alerts or notifications. For alerts on capacity health use Fabric capacity overview events, and for individual operations use Fabric capacity operation events."
---

To install the Microsoft Fabric Capacity Metrics app you must be a capacity admin and have a Power BI license. Get the app from AppSource or from **Apps** in Power BI service, install it, then connect it to your capacity on first run. Once data appears, the Health page shows which capacities are under pressure, and the Compute, Storage and Timepoint pages explain why. This guide follows two Microsoft Learn pages: the install guide and the overview of the app.

## What the app is for

Fabric runs on a capacity, a pool of resources measured in capacity units (CUs). Learn says the app monitors capacity consumption so you can decide, for example, when to scale up or turn on autoscale. It supports both EM/A and P SKUs.

## Prerequisites

- Capacity admin rights.
- A Power BI license: Pro, Premium Per User, or a Power BI individual trial.

Learn advises installing the app in a workspace with a Pro license to avoid throttling due to capacity overutilization.

## Install the app

**First installation.**

1. Open AppSource and find Microsoft Fabric Capacity Metrics, then select **Get it now**. Or in Power BI service select **Apps** > **Get apps**, search for Microsoft Fabric, select the app and **Get it now**.
2. Sign in to AppSource with your Microsoft account and complete the registration screen. The app takes you to Microsoft Fabric. Select **Install**.
3. In the **Install this Power BI app** window, select **Install** and wait a few seconds.

**Upgrade.** Use the same entry points. In the **Update app** window choose one of three options. **Update the workspace and the app** is the default and replaces the current version and its workspace. **Update only workspace content without updating the app** updates the workspace only. **Install another copy of the app into a new workspace** keeps the old version beside the new one and needs a workspace name.

Starting with version 3.0, the navigation pane has two reports: the default **Microsoft Fabric Capacity Metrics** report and a **Fabric Capacity Metrics Preview** report with a redesigned layout. The default stays the one that opens first.

**Government clouds.** Learn gives separate links for GCC, GCC High, DoD and the China cloud. You do not need to delete the old app when upgrading with them. It notes that OneLake is not supported in GCC.

## Run the app for the first time

1. In the Power BI experience, select **Apps** and open **Microsoft Fabric Capacity Metrics**. To see **Apps**, switch the experience selector at the bottom left from Fabric to Power BI.
2. When you see the message about connecting to your own data, select **Connect**.
3. Fill in the first window:
   - **UTC_offset** (required): a number from `14` to `-12`, using `.5` for half-hour time zones, for example `5.5` for India. Enter your organization's standard time relative to UTC.
   - **RegionName** (version 2.0 and below): `Default` for a capacity admin. A tenant admin with admin rights on a capacity in the home region, or with no capacities in the home region, also uses `Default`. Otherwise use a region where you have admin permission on a capacity, such as West Europe.
   - **DefaultCapacityID** (versions 1.9.2 to 2.0) or **CapacityID** (1.8 and below): the ID of a capacity you administer, found in the URL after `/capacities/` when you select a capacity under **OneLake catalog** > **Govern** > **Capacities**.
   - **Advanced** (optional): the app refreshes data at midnight, which you can turn off here.
4. Select **Next**. In the second window choose **OAuth2**, which Learn says is the only supported method, and set the privacy level to **Organizational**.
5. Select **Sign in and continue**, then choose a capacity from **Capacity Name**.
6. Wait a few minutes. If nothing shows on first open, refresh.

Learn says other parameters are not meant to be changed, and changing them can break the semantic model or the report.

## Read the report

The default report has these pages:

| Page | What it shows |
| --- | --- |
| Health | High-level overview for capacities you administer, including those consuming the most compute or showing throttling or query rejections |
| Compute | A 14-day view of compute: ribbon charts, utilization trends and a matrix of operations |
| Storage | Storage over the past 30 days, current and billable storage by workspace, and soft-deleted data |
| Timepoint | A 30-second timepoint with the interactive and background operations that used the most compute |
| Timepoint summary | Operation types that contributed to usage in the selected timepoint |
| Timepoint item detail | Operations within one item at a timepoint, with filters for operation ID, user and CU thresholds |
| Autoscale compute for Spark and detail | How Spark autoscale behaved and which workloads triggered it |
| Plan capacity | Estimating the right SKU with the app and the Fabric SKU Estimator |
| Monitor paused capacity | When a capacity was paused or resumed, and how to read carryforward operations |
| Calculations | How the app computes CU usage, throttling and autoscale impact |

A natural order for an investigation, based on Learn's page descriptions: start at Health to find the capacity, go to Compute to see the pattern, then pick a moment on Timepoint to see which operations caused it, and drill to Timepoint item detail for the item and user.

The preview report has Health, Compute, Storage, Autoscale for Spark and Help pages, with item-level drill-through from Compute to an Item details page.

## Data latency

Learn says usage data generally becomes available within 10 to 15 minutes. At 5:15 PM local time, the utilization chart might show data to about 5:00 PM. Dimensions such as capacities, workspaces and items refresh with the scheduled semantic model refresh at midnight local time. A new capacity, workspace or item, or a moved workspace, appears after the next refresh, and you can start a manual refresh of the semantic model.

## Limits to keep in mind

- No alerts or notifications. Use Fabric capacity overview events and operation events instead.
- Update the parameters and refresh the semantic model when your available capacities change, such as after just-in-time tenant admin access.
- To hide user emails, turn off the setting to show user data in the Fabric Capacity Metrics app and reports in the Admin portal.
- Non-billable items and operations are preview features that do not count toward your capacity limit and are not paid for. They show possible future impact.
- The semantic model is supported only for use by the reports in the app.
- Threshold values on throttling visuals do not reflect applied surge protection settings. Check the Admin portal for the actual thresholds.
- The Throttling(s) column shows zero when throttling is disabled, even when the capacity is overloaded.
- Workspace-level private links are not supported on workspaces where the app is installed.

If the installed app shows no data or cannot refresh, Learn's steps are to delete the old app, reinstall the latest version and update the semantic model credentials.

## Share the report

The app creates a workspace in your tenant. As capacity admin, open the app, go to that workspace and select **Share**. You can share with users in your organization or with B2B guests, for example a consultant. Learn says that without sharing, even a B2B user added to the tenant cannot access the report.

## A routine I would use

This section is my advice, not a Microsoft statement.

1. After install, open Health once a week and note the capacity with the most compute or throttling.
2. When users report slowness, note the time, find the matching timepoint and check the operations table for the top consumer.
3. Set up capacity events for alerts, since the app itself cannot notify you.
4. Re-check the RegionName and capacity parameters after any admin access change.

## Related

- [Microsoft Fabric](https://www.m365.fm/entity/fabric/)
- [Fabric capacity](https://www.m365.fm/entity/fabric-capacity/)
- [Power BI](https://www.m365.fm/entity/power-bi/)

## Sources

- [Install the Microsoft Fabric capacity metrics app - Microsoft Fabric (Microsoft Learn)](https://learn.microsoft.com/fabric/enterprise/metrics-app-install)
- [What is the Microsoft Fabric Capacity Metrics app? - Microsoft Fabric (Microsoft Learn)](https://learn.microsoft.com/fabric/enterprise/metrics-app)
