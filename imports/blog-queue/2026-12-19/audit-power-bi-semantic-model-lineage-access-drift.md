---
title: "Audit Power BI Semantic Model Lineage and User Access Drift Across Workspaces"
summary: "Use lineage view, the metadata scanner APIs, dataset user APIs and the audit log to inventory semantic model lineage and detect access drift across Power BI workspaces, with the documented limits and gaps."
status: review
publish: false
author: mirko-p
date: 2026-12-19
topics: [power-bi, semantic-model, data-lineage, fabric-workspace]
keypoints:
  - "Lineage view in a workspace shows sources, gateways, semantic models, reports and dashboards, and cross-workspace sources. It needs a Pro license and the Admin, Member or Contributor role."
  - "For a tenant-wide inventory, the scanner APIs (PostWorkspaceInfo, GetScanStatus, GetScanResult) return item metadata, upstream dependencies and, with getArtifactUsers, user access rights."
  - "Limits on Learn: 100 workspaces per PostWorkspaceInfo request, 500 requests per hour, 16 simultaneous requests, and scan results available for 24 hours."
  - "Access drift is not a built-in report. Take scheduled snapshots of users and access rights, then compare them. The audit log helps explain changes, with one day per request."
  - "Fabric administrator rights or a service principal without admin-consent Power BI permissions are required for the admin APIs."
faq:
  - q: "Is there a tenant-wide lineage view in Power BI?"
    a: "Learn describes lineage view per workspace, opened from the workspace list view with View then Lineage. For tenant-wide inventory, the documented route is the metadata scanner APIs, whose results contain upstream dataflows, datamarts and datasets for items, and data source links."
  - q: "Who can use lineage view?"
    a: "Learn says a Power BI Pro license is required, and users need the Admin, Member or Contributor role in the workspace. Viewers cannot switch to lineage view."
  - q: "What limits apply to the scanner APIs?"
    a: "Learn lists up to 100 workspaces per PostWorkspaceInfo request, a maximum of 500 requests per hour and 16 simultaneous requests. GetScanResult is also limited to 500 requests per hour, and the scan result stays available for 24 hours."
  - q: "How do I list who has access to a semantic model?"
    a: "Use the admin API Datasets GetDatasetUsersAsAdmin, limited to 200 requests per hour, or the scanner with getArtifactUsers set to true. The Learn page for the dataset users API does not say whether users with access through workspace roles are included, so test it."
  - q: "How far back and how much audit data can I get?"
    a: "Learn says the ActivityEvents API supports one day of data per request and returns around 5,000 to 10,000 entries with a continuation token. Events can lag by up to 60 minutes. The page read does not state a retention period."
---

Power BI does not ship a single report for lineage and access drift across workspaces. The documented building blocks are the workspace lineage view for quick looks, the metadata scanner APIs for a tenant-wide inventory, the dataset users API for access lists, and the audit log for change history. Drift detection means taking a snapshot on a schedule and comparing it with the last one.

## Quick look: lineage view in a workspace

In the workspace list view, select the arrow next to **View**, then select **Lineage**. Learn describes what it shows:

- Data sources, with details such as the database name for Azure SQL.
- Gateway information on the data source card for on-premises gateways. Gateway admins and data source users see more detail.
- Semantic models and dataflows with the last refresh time and whether they are certified or promoted.
- Cross-workspace sources: a report that uses a semantic model in another workspace shows the source workspace name, which you can select to navigate.

Select the double arrows under an item to highlight everything related to it.

Requirements and limits: a Power BI Pro license, and the Admin, Member or Contributor role. Viewers cannot switch to lineage view. Semantic model to dataflow lineage is displayed correctly only if the connection was set up through the Get Data UI and the Dataflows connector.

Lineage view is per workspace and manual, so use it for investigations, not for a recurring audit.

## Tenant-wide inventory: the scanner APIs

The scanner APIs are admin REST APIs. Learn lists four calls: `GetModifiedWorkspaces`, `PostWorkspaceInfo`, `GetScanStatus` and `GetScanResult`.

**Who and how.** The caller must be a Fabric administrator or a service principal. With a service principal, the app must not have admin-consent-required Power BI permissions set in the Azure portal. For delegated tokens the scope is `Tenant.Read.All` or `Tenant.ReadWrite.All`. No special license is required, and scanning covers non-Premium workspaces too.

**Setup.** A Fabric administrator enables these tenant settings under the Admin API settings:

- **Enhance admin APIs responses with detailed metadata**
- **Enhance admin APIs responses with DAX and mashup expressions**, which needs the first setting

If you also use a service principal, enable service principal access for the read-only admin APIs. Learn describes this on a separate page.

**Workflow.**

1. `POST https://api.powerbi.com/v1.0/myorg/admin/workspaces/getInfo` with a body of 1 to 100 workspace IDs. Optional query flags are `lineage`, `datasourceDetails`, `datasetSchema`, `datasetExpressions` and `getArtifactUsers`. The call returns 202 Accepted with a scan ID.
2. `GET .../admin/workspaces/scanStatus/{scanId}` until the scan succeeds.
3. `GET .../admin/workspaces/scanResult/{scanId}`, within 24 hours.

**Limits.** Learn lists a maximum of 500 requests per hour and 16 simultaneous requests for `PostWorkspaceInfo`, and 500 requests per hour for `GetScanResult`. With 100 workspaces per call, plan batches for large tenants.

**What comes back.** For each workspace, the result has arrays for reports, dashboards, datasets, dataflows, datamarts and users. Dependencies appear as `upstreamDataflows`, `upstreamDatamarts` and `upstreamDatasets`, each with a group ID and a target ID. Data source links appear as `datasourceUsages`, which reference `datasourceInstanceId`, and `datasourceInstances` give the connection details. Dataset details include tables, expressions, roles with members and table permissions, `configuredBy` and endorsement details.

For lineage, join items to their upstream references and data source instances. For cross-workspace lineage, the `groupId` on an upstream entry tells you where the source lives.

## Access lists

Two documented sources:

- **Scanner with `getArtifactUsers=true`** returns users with type-specific access fields such as `reportUserAccessRight` and `datasetUserAccessRight`. Workspace users carry `groupUserAccessRight`. The `principalType` values are `None`, `User`, `Group` and `App`. Learn notes that several item-level `users` arrays are marked empty and will be removed, and recommends the Get Users as Admin APIs or `getArtifactUsers`.
- **`GET https://api.powerbi.com/v1.0/myorg/admin/datasets/{datasetId}/users`** returns the users with access to one dataset, with a maximum of 200 requests per hour. Access rights range from `Read` to `ReadWriteReshareExplore`. The page does not say whether users with access only through a workspace role are included, so verify this with a test model before you rely on it for completeness.

The `graphId` field is available only through admin APIs, which helps to join results to Microsoft Entra data.

## Detecting drift

Learn does not document a drift report, so build the comparison:

1. Take a baseline scan with lineage, data source details and `getArtifactUsers` for every workspace in scope.
2. Store the results with the scan date, for example as JSON files or tables.
3. Repeat on a schedule and diff by item ID: new or removed users, changed access rights, new upstream dependencies, changed data sources and a changed `configuredBy`.
4. Flag high-risk changes: access for `None` principal type (whole-organization access), new groups on certified models, a semantic model that now depends on an unexpected source.
5. Use the audit log to find out who made the change.

The audit log notes: you must be a Fabric administrator. The ActivityEvents API supports one day of data per request, where the start and end must be the same day. It returns around 5,000 to 10,000 entries and a continuation token that you follow until none is returned. `Get-PowerBIActivityEvent` handles the token and takes the same date restrictions. Learn says most events show up within 30 minutes, with a lag of up to 60 minutes for Power BI events. The page read does not state a retention period or list permission-change event names, so check the operation list for the activity names to filter on.

## Practical notes

- Start with one pilot group of workspaces to check call volumes against the hourly limits.
- Run scans for modified workspaces only after the baseline. `GetModifiedWorkspaces` is listed among the scanner calls. The page read gives no parameter details, so check the API reference.
- Keep the service principal's group scope and credentials under review, since it can read tenant metadata.
- Treat the stored scan data as sensitive. It contains user names, emails and connection details.

## What Learn does not cover

The pages read do not describe a built-in alert for access changes, a retention period for the audit log or a combined lineage and access report. The scanner's lineage output describes upstream dependencies, not downstream report usage in other workspaces, so confirm in a test whether your cross-workspace cases appear in the scan.

## Related

- [Power BI](https://www.m365.fm/entity/power-bi/)
- [Semantic model](https://www.m365.fm/entity/semantic-model/)
- [Data lineage](https://www.m365.fm/entity/data-lineage/)
- [Fabric workspace](https://www.m365.fm/entity/fabric-workspace/)

## Sources

- [Data lineage view in Power BI (Microsoft Learn)](https://learn.microsoft.com/en-us/power-bi/collaborate-share/service-data-lineage)
- [Metadata scanning overview (Microsoft Learn)](https://learn.microsoft.com/en-us/power-bi/enterprise/service-admin-metadata-scanning)
- [Set up metadata scanning (Microsoft Learn)](https://learn.microsoft.com/en-us/fabric/admin/metadata-scanning-setup)
- [Admin - WorkspaceInfo PostWorkspaceInfo (Microsoft Learn)](https://learn.microsoft.com/en-us/rest/api/power-bi/admin/workspace-info-post-workspace-info)
- [Admin - WorkspaceInfo GetScanResult (Microsoft Learn)](https://learn.microsoft.com/en-us/rest/api/power-bi/admin/workspace-info-get-scan-result)
- [Admin - Datasets GetDatasetUsersAsAdmin (Microsoft Learn)](https://learn.microsoft.com/en-us/rest/api/power-bi/admin/datasets-get-dataset-users-as-admin)
- [Track user activities in Power BI (Microsoft Learn)](https://learn.microsoft.com/en-us/power-bi/enterprise/service-admin-auditing)
