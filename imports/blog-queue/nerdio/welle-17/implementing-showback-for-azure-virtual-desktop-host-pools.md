---
title: "Implementing showback for Azure Virtual Desktop host pools"
summary: "Tag the VMs and shared resources behind each host pool, save one Cost Management view per owner, write down how shared cost is split, and send the view on a schedule. Splitting a pooled host pool between users needs connection data from Log Analytics or a tool built for it."
status: review
publish: false
author: mirko-p
date: 2026-11-18
render: v2
topics: [showback, chargeback, finops]
keypoints:
  - "Session host VMs usually cost the most, but Learn also lists profile and app attach storage, Insights data, image templates and identity. Tags report only where assigned, so tag these too."
  - "A personal host pool maps each host to one user, so VM cost is directly attributable. In pooled pools users are not assigned to hosts, so splitting cost needs usage data such as session hours."
  - "Cost analysis can group by tag, and the cm-resource-parent tag groups child resources under a host pool. A resource links to one parent; cost analysis supports one grouping level."
  - "Cost allocation rules (EA and MCA only) redistribute shared cost between subscriptions, resource groups or tags, but do not change the invoice or support reservations and savings plans."
  - "Saved views can be emailed on a schedule to up to 20 recipients, and exports give raw data. Nerdio Manager's user cost attribution (Premium) is one tool that attributes cost to users."
faq:
  - q: "Do I need Nerdio to run showback for host pools?"
    a: "No. Cost Management, tags and exports are enough for per-host-pool showback. Splitting a shared pooled pool by user needs session data, which you can query from Log Analytics or get from a tool. Nerdio Manager's user cost attribution is one such tool; its documentation says it is available only in the Premium edition."
  - q: "Why does a host pool's cost look incomplete in cost analysis?"
    a: "Learn says tags report only for resources they are directly assigned to, new tags do not show until the resource reports activity, and it is unlikely you will get a complete cost report of every supporting Azure service. Check the Untagged group and tag the shared resources too."
  - q: "Can a team without access to the subscription see its view?"
    a: "Yes, by email or download. Learn says a scheduled email can include a CSV download link, but anyone who receives the email can access the data in it. Otherwise grant Cost Management Reader at the resource group scope; on Enterprise Agreements the account owner view charges setting must be on."
---

To implement showback for Azure Virtual Desktop host pools, tag the resources behind each pool, save one Cost Management view per owner, agree a written rule for shared cost, and send the view on a schedule. Cost per host pool comes from Azure; cost per user inside a shared pool needs session data from Log Analytics or a tool.

The concept and the choice between showback and chargeback are covered in "Showback vs chargeback: allocating cloud cost to teams". Tag design is covered in "A tagging strategy for AVD cost allocation". This article starts after the tags exist and covers the reports.

## What you are allocating

Microsoft Learn says Azure Virtual Desktop cost comes from two sources, Azure resource consumption and licensing, and is charged to the organisation that owns the deployment, not to end users. For [session hosts](https://www.m365.fm/entity/avd-session-host/), Learn lists the VM instance, managed disks and network bandwidth, and says the VM instances usually cost the most. Other cost sources sit outside the host pool:

| Cost source | Learn's description | Direct or shared (our reading) |
|---|---|---|
| Session host VMs and disks | Compute, OS and data disks, bandwidth | Direct to one host pool |
| [FSLogix](https://www.m365.fm/entity/fslogix/) profile storage | User profile storage, such as Azure Files or Azure NetApp Files | Direct if one share per pool, otherwise shared |
| App attach storage | Application storage | Usually shared |
| [AVD Insights](https://www.m365.fm/entity/avd-insights/) | Log data in Azure Monitor | Shared |
| Custom image templates | Storage and network for managed disks and bandwidth | Shared |
| Identity | Domain controller VMs, or Microsoft Entra Domain Services | Shared |

Licensing for internal users is bought per user; Learn says to factor the license into your total cost estimate separately.

## Choose the unit and the owner

The allocation unit decides how much work follows. Learn's terminology page says that in a personal host pool each session host is assigned to an individual user, and that in a pooled host pool users are not assigned to session hosts and several users can be on one host at the same time.

- **One host pool per team:** the tag on the pool's resources is enough. Host pool cost is the team's cost.
- **One pooled host pool shared by several teams:** you need a usage measure, such as session hours, to split the pool.
- **Personal host pool:** the VM belongs to one user, so its cost can follow the user's team.

## Steps

1. **Write the rule.** Record the unit (host pool or team), the owner for each tag value, which shared costs are split and how, and which stay central. Learn's allocation guidance recommends rules for dividing shared cost fairly, and says not every shared cost needs to be redistributed.
2. **Tag the pool and its shared resources.** Use the schema from the tagging article on the session host VMs, storage accounts, Log Analytics workspace and any domain controller VMs. Learn warns that tags report only for resources they are directly assigned to, and that even a small typo affects reporting.
3. **Give owners access.** Learn lists Cost Management Reader (or Contributor) at management group, subscription or resource group scope. You need User Access Administrator or Owner on the resource group to assign it. On Enterprise Agreements the Account owners can view charges setting must be on, and department scope needs Department admins can view charges; for Microsoft Customer Agreement subscriptions, the Azure charges setting must be Yes. Our reading: a resource group per host pool lets you grant exactly one team's cost view.
4. **Build the view.** In the Azure portal open Cost Management, then cost analysis, group by Tag and filter on your owner key. Save it with Save as. Learn says shared views are visible to anyone with Cost Management Reader or greater on the scope, and allows up to 100 private views across all your scopes and up to 100 shared views per scope. Cost analysis shows special values: Tags not supported (purchases and similar), Tags not available (services whose usage data has no tags) and Untagged. Untagged is your audit list.
5. **Group the children under the pool, if you want one line per pool.** Add the `cm-resource-parent` tag to the child resources, with the host pool's resource ID as the value. Learn says it does not affect billing and that tags can take 24 hours to arrive; a resource can link to only one parent, cost analysis supports one level of grouping, and resources must be actively running with charges.
6. **Apply the shared-cost rule.** See the next section.
7. **Distribute.** In cost analysis choose Subscribe on a saved view, then Add, and set recipients (up to 20), start and end date and frequency. After invoice finalized is an option; Learn advises using a last-month view for it. Built-in views cannot be changed and show USD in email, so save a view for any other currency or date range. For raw data, use Exports (below).
8. **Review monthly.** Check Untagged, the share of cost you could not allocate, and how much VM running time had no session.

## Splitting shared cost

You have three options.

**Cost allocation rules in Cost Management.** On Enterprise Agreement and Microsoft Customer Agreement accounts, a rule moves cost from source subscriptions, resource groups or tags to targets, split evenly, by total, compute, storage or network cost, or by custom percentages totalling 100%. Learn's path is Cost Management, Settings, Configuration, Cost allocation, then Add. It needs Enterprise Administrator (EA) or Billing account owner (MCA). Rules take up to 24 hours to take effect, appear under Group by Cost allocation, and do not support purchases or change the invoice. The article "Showback vs chargeback" lists the other conditions.

**A spreadsheet or data model on exported cost.** Learn's exports page lets you export cost and usage details (actual, amortized, or FOCUS, which combines actual and amortized) to a storage account as CSV or Parquet, daily or monthly. Exports can take up to 24 hours to be ready and are scheduled in UTC. Exports are available at subscription, resource group, management group, department and enrollment scopes; management group exports support usage charges only.

**Leave it central.** For a small item, such as Insights log data, this can be the cheaper choice.

## Splitting a pooled host pool between users

Learn's AVD diagnostics page shows how to get connection data. Enable diagnostic settings on each host pool, application group or workspace you want to monitor; data appears only for activity after you enable them, and can take a few hours at first. The `WVDConnections` table records a connection's `State` as Started, Connected or Completed, with `CorrelationId`, `UserName` and `SessionHostName`. Learn's example computes session duration by joining Connected and Completed events for one user. Our adaptation, to sum hours per user (test it in your workspace before relying on it):

```kusto
let Events = WVDConnections | where TimeGenerated >= startofmonth(now());
Events
| where State == "Connected"
| project CorrelationId, UserName, StartTime = TimeGenerated
| join kind=inner (Events | where State == "Completed" | project EndTime = TimeGenerated, CorrelationId) on CorrelationId
| summarize SessionHours = sum((EndTime - StartTime) / 1h) by UserName
```

Mapping a user to a team is your job, for example from a directory export. Caveats from Learn: connections that never reach Azure Virtual Desktop do not appear, and the table page documents a `SessionHostPoolType` column (SharedDesktop or PersonalDesktop) but no host pool name column. Learn lists the table's resource type as host pools and describes `_ResourceId` only as a unique identifier of the associated resource, so check a sample record and, if it carries the host pool ID, filter or group by it. Sessions without a Completed row, such as running sessions or those spanning a month boundary, are not counted.

**Illustration with invented numbers.** One pooled host pool costs 7,000 in a month: 6,000 for VMs and disks, 800 for profile storage and 200 for log data. Session hours are 1,500 for finance and 500 for sales. Splitting all 7,000 by session hours gives finance 5,250 (75%) and sales 1,750 (25%). The method carries a decision you must make explicitly: a VM can run while no session is active, and splitting everything by session hours spreads that idle cost in proportion to usage. Alternatively, keep idle cost central and show it as its own line.

## A tool option: Nerdio Manager

Nerdio's user cost attribution assigns the cost of an Azure Virtual Desktop deployment to users, based on how long each user used desktops in the selected period. Its documentation says it is available only in the Premium edition, only for subscriptions that support Azure Cost Management, and not with the Split Identity install method. It treats personal VM cost as belonging to the assigned user, allocated session cost by minutes used, and splits unallocated and shared cost in one of three ways: Uniform (equal per active user), Proportional (by relative usage duration) or Unallocated (not assigned). The analytics view is under Observability, Insights, Costs & Efficiency, with per-user and per-host-pool areas, CSV export and Power BI. Its page lists conditions: all host pools must send diagnostics to the Log Analytics workspace, tags must be on all AVD resources, including the virtual networks with session hosts and the Log Analytics workspaces that receive AVD diagnostics, and a new month can take from a few minutes to an hour to build. Its analytics show the share of VM and disk cost that did not support at least one session ("% unused"), and the ratio of running hours of VMs that had a session to session hours. Nerdio expects that ratio below 100% in pooled environments because users share a VM, and says a value above 100% leaves room for optimization. See the entity page on [Nerdio FinOps user cost attribution](https://www.m365.fm/entity/nerdio-finops-user-cost-attribution/); the Azure-native route above covers per-pool cost without it, and the per-user split is then your own query.

## Limits to accept

- A new tag is not visible until the resource reports activity. Learn's Cost Management data page says tags are included in usage data only while they are applied, so a new tag is not applied to historical data, and tags are not inherited from the resource group unless you enable tag inheritance.
- Learn says it is unlikely you will get a complete cost report of every supporting service, and sharing a subscription may inflate the report because usage data for shared resources is less accurate.
- Reservations and savings plans are purchases, so allocation rules skip them; see the amortized versus actual guidance in the sibling article.
- Per Learn's showback page, a stopped VM keeps charging unless it is deallocated, so an idle pool may still show cost.

## Sources

- [Microsoft Learn: Understand and estimate costs for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/understand-estimate-costs)
- [Microsoft Learn: Tag Azure Virtual Desktop resources to manage costs](https://learn.microsoft.com/en-us/azure/virtual-desktop/tag-virtual-desktop-resources)
- [Microsoft Learn: Azure Virtual Desktop terminology](https://learn.microsoft.com/en-us/azure/virtual-desktop/terminology)
- [Microsoft Learn: Use Log Analytics for the diagnostics feature](https://learn.microsoft.com/en-us/azure/virtual-desktop/diagnostics-log-analytics)
- [Microsoft Learn: WVDConnections table reference](https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/wvdconnections)
- [Microsoft Learn: Understand Cost Management data](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/understand-cost-mgt-data)
- [Microsoft Learn: Group and filter options in cost analysis](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/group-filter)
- [Microsoft Learn: Save, share, and schedule views in Cost Management](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/save-share-views)
- [Microsoft Learn: Assign access to Cost Management data](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/assign-access-acm-data)
- [Microsoft Learn: Create and manage exports](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/tutorial-export-acm-data)
- [Microsoft Learn: Create and manage Azure cost allocation rules](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/allocate-costs)
- [Microsoft Learn: Allocation (FinOps Framework)](https://learn.microsoft.com/en-us/cloud-computing/finops/framework/understand/allocation)
- [Microsoft Learn: Data analysis and showback](https://learn.microsoft.com/en-us/cloud-computing/finops/capabilities-analysis-showback)
- [Nerdio: User cost attribution overview](https://nmehelp.getnerdio.com/hc/en-us/articles/26124340517133-User-cost-attribution-overview)
- [Nerdio: User cost attribution cost types](https://nmehelp.getnerdio.com/hc/en-us/articles/26734007748621-User-cost-attribution-cost-types)
- [Nerdio: User cost attribution analytics](https://nmehelp.getnerdio.com/hc/en-us/articles/25499395894029-User-cost-attribution-analytics)
