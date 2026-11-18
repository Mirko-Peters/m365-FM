---
title: "User cost attribution in Nerdio: showback and chargeback per host pool"
summary: "Nerdio Manager's user cost attribution spreads the Azure cost of an Azure Virtual Desktop deployment across users by session time and per host pool. Covers cost types, shared-cost methods, setup and validation."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [nerdio-finops-user-cost-attribution, nerdio-manager-for-enterprise]
keypoints:
  - "User cost attribution is Premium only. It reads cost from Cost Management and sessions from Log Analytics, and allocates cost by each user's share of session time."
  - "Four cost types: personal VM, allocated session, unallocated session and shared cost. Uniform, Proportional and Unallocated decide how the last two are spread."
  - "A resource enters the report if it is in a selected subscription with a selected tag, unless Include All Costs is on. Tags apply at processing, so a newly tagged resource counts all month."
  - "Nerdio says a report total matches Cost Management for the nominated subscriptions (with tag filters, tagged resources only) but calls its figures estimates. Check with its validation tool."
  - "Nerdio's heartbeat migration page names March 2025 and v6.8; the current release is v8.2.3. Setup needs Monitoring Reader per subscription, then Is_Using_Heartbeat_Fetching."
faq:
  - q: "Do I need the Premium edition for user cost attribution?"
    a: "Yes. Nerdio's overview says the feature is only available in the Nerdio Manager Premium edition. It also requires subscriptions that support Azure Cost Management and is not supported when Nerdio Manager was installed with the Split Identity method. The Azure-native route without Nerdio is covered in the article on implementing showback for Azure Virtual Desktop host pools."
  - q: "Does the report replace Azure Cost Management?"
    a: "No. The report is built from Azure Cost Management data. Nerdio's pages say the total of a report equals the cost of the nominated subscriptions in Azure Cost Management, unless tag filters are set (then only tagged resources count), and also say the figures are estimates that may differ from reconciled Azure billing. The tag filter in Cost Management cannot pick up SaaS and gallery image costs, so add a resource type filter when you compare, and check the total yourself before you send a bill."
  - q: "What changes because the Consumption Usage Details API is going away?"
    a: "Nerdio says user cost attribution uses Log Analytics heartbeat data instead. Its migration page lists two changes: grant Monitoring Reader to the user cost attribution service principal on every in-scope subscription, then add the App Service setting Is_Using_Heartbeat_Fetching with the value True and restart the web app. The page's dates, March 2025 and v6.8, are in the past, so check whether your installation still shows the banner."
---

Nerdio Manager's user cost attribution takes the Azure cost of an [Azure Virtual Desktop](https://www.m365.fm/entity/azure-virtual-desktop/) deployment, splits it across users by how long each user worked in a desktop, and rolls the result up per user and per [host pool](https://www.m365.fm/entity/avd-host-pool/). It needs the Premium edition and is only as good as your tagging and diagnostics.

This article goes deeper into the Nerdio mechanism than [Implementing showback for Azure Virtual Desktop host pools](https://www.m365.fm/community/u/mirko-p/blog/implementing-showback-for-azure-virtual-desktop-host-pools/), which covers the Azure-native route. Tag design is in [A tagging strategy for AVD cost allocation](https://www.m365.fm/community/u/mirko-p/blog/a-tagging-strategy-for-avd-cost-allocation/), and Power BI in [Connecting Nerdio cost data to Power BI](https://www.m365.fm/community/u/mirko-p/blog/connecting-nerdio-cost-data-to-power-bi/). For the two models, see [showback and chargeback](https://www.m365.fm/entity/showback-chargeback/).

## What it is and what it needs

[Nerdio FinOps user cost attribution](https://www.m365.fm/entity/nerdio-finops-user-cost-attribution/) is a feature of [Nerdio Manager for Enterprise](https://www.m365.fm/entity/nerdio-manager-for-enterprise/). Nerdio lists these prerequisites: the Premium edition, subscriptions that support Azure Cost Management, no Split Identity installation, and, to enable it, a tenant-level role such as Global Administrator plus a subscription-level role such as Owner.

Enabling it (System, Settings, Nerdio, User cost attribution) creates resources in your tenant: Nerdio's resources page lists an App Service, a storage account and a key vault, and the Enable page also lists Application Insights, a Log Analytics workspace and an app registration. Nerdio says all data stays in your tenant. By default the App Service plan reuses the core Nerdio Manager plan, and the feature needs its own key vault, not the main Nerdio one. The service principal receives Cost Management Reader, Desktop Virtualization Reader and Monitoring Reader on each subscription. The resources page also lists Log Analytics Reader at subscription scope, so compare the pages with your security team.

## The four cost types

Nerdio's cost types page divides the cost like this:

| Cost type | What it contains | Who pays in the report |
|---|---|---|
| Personal VM cost | All cost of a VM assigned to one user, regardless of sessions | The assigned user |
| Allocated session cost | Session cost that can be allocated, based on each user's minutes and the cost of the actual VM SKU | The users who had sessions |
| Unallocated session cost | VM minutes without sessions, calculated for each VM individually | Depends on report type |
| Shared cost | Storage, network, SaaS subscriptions such as Nerdio, other items, infrastructure VMs and VMs with no sessions | Depends on report type |

Nerdio's cost data FAQ describes the principle. Personal VMs and disks go in full to the assigned user. Pooled VMs and disks are split between the users who recorded sessions on that VM, in proportion to each user's share of the session time on it: if user A accounted for 50% of the session time on VM 1, user A receives 50% of VM 1's cost. A VM with no sessions is treated as a non-AVD resource and counted as "other" cost. The rest is spread by the report type. Our reading: this is a principle, not a formula you can recompute by hand, so validate with the checks below.

## Three report types

The report type decides what happens to unallocated and shared cost:

- **Uniform:** an equal amount of shared cost for each active user.
- **Proportional:** shared cost by the relative duration of each user's AVD usage.
- **Unallocated:** nothing is spread across users. The report shows only cost that results directly from sessions, and lists shared cost with resource information from Azure Cost Management.

Invented numbers: shared and unallocated cost for one month is 1,200, and three users worked 120, 60 and 20 hours.

| Method | User A (120 h) | User B (60 h) | User C (20 h) | Left unassigned |
|---|---|---|---|---|
| Uniform | 400 | 400 | 400 | 0 |
| Proportional (by hours, our simplification) | 720 | 360 | 120 | 0 |
| Unallocated | 0 | 0 | 0 | 1,200 |

The same pool gives user C 120 or 400, depending on the method, so decide it with finance before the first bill. Our reading: Unallocated suits a first showback round, because it shows the shared items with their resource names; Uniform and Proportional suit chargeback once the rule is agreed.

## Per host pool and per user

In the analytics view (Observability, Insights, Costs & Efficiency) you choose month, report and shared cost allocation method. It shows total AVD cost, per-user cost (the total divided by monthly active users), cost buckets and session details. The Per-user costs and Per-host pool costs areas let you search by user name or filter by host pool, and export to CSV or Power BI.

Two different measures are easy to mix up. "% unused" belongs to the VMs and disks bucket: the share of cost from VMs and disks that did not support at least one session, where a high value points to unused VMs. "% of Session Hours" belongs to the session details: Total VM Running Hours divided by Total Session Hours. For [personal](https://www.m365.fm/entity/avd-personal-host-pool/) desktops Nerdio says a perfectly efficient environment would show 100%. For [pooled](https://www.m365.fm/entity/avd-pooled-host-pool/) pools it should be below 100%, because users share VMs, and a value above 100% leaves room for optimisation.

For a per-pool bill, Nerdio documents the filter in the Per-host pool costs area and the exports. It also states conditions: the virtual networks holding session hosts and the Log Analytics workspaces receiving diagnostics must carry the reporting tag, and all host pools must send diagnostics to the selected workspaces. Nerdio does not describe how shared cost is divided between pools. Our reading: one design is a configuration per pool with pool-specific [Azure resource tags](https://www.m365.fm/entity/azure-resource-tags/); Nerdio does not document it, so test it first.

For chargeback to departments, Nerdio's release notes for the 8.0 line (June 2026) list Custom Cost Groups: within user cost attribution you can create custom groups of users, and specific sets of users can be grouped and charged back. The notes describe it in one line, so check it in your version. The v8.2 notes add that the Other costs value opens a per-service breakdown.

## Report configuration

Under System, Settings, Nerdio, User cost attribution, a configuration holds the report name, default report type, subscriptions, the [Log Analytics](https://www.m365.fm/entity/log-analytics/) workspaces with AVD session data, Include All Costs, and default and custom tags. Include All Costs adds every supported resource in the nominated subscriptions. Otherwise a resource must sit in a selected subscription and carry one of the selected tags. Nerdio adds two points: SaaS costs such as Nerdio licensing within the nominated subscriptions are included automatically, and tag filters are applied during processing, so the report counts the full month of any resource that carries the tag when the report is generated, even for days before it was tagged. Nerdio's Power BI combination page says editing an existing configuration is not supported, while the configuration page describes edit controls.

Costs outside Azure, such as a software licence, can be added as custom costs. Nerdio says they count as shared cost, must be in US dollars without formatting, and only appear after a report rebuild (package version 1.02.xx or later).

## Validate before you send a bill

Reports refresh once daily by default, and repeated refreshes in a day have diminishing returns, Nerdio says. Its two size guides differ. The overview lists a test for Nerdio Manager 5.5 and later: 6,000 users and 300,000 sessions took 45 minutes on a B1 App Service SKU and 10 minutes on P3V3, and larger environments are untested. The build page recommends B1 for small environments (1,000 users, 50,000 sessions), B3 for medium (5,000 users, 100,000 sessions) and B3 or higher for large ones (10,000+ users, 300,000+ sessions).

To verify a total by hand, open Cost analysis in Azure Cost Management with the same subscriptions, the Cost by resource view, the month and the configuration's tags as a filter. SaaS and gallery image costs do not appear under a tag filter, Nerdio says; filter for the resource types microsoft.compute/galleries/images and Microsoft.SaaS/resources instead. Expect differences for recently tagged resources: Cost Management shows tagged cost only from the tagging date, while the report counts the full month.

Nerdio's pages disagree on the report validation tool. The tool page says it exists from Nerdio Manager 6.0.1, under System, Settings, Nerdio, User cost attribution, next to Logs, Download, with the file under Tasks, Details. The cost validation FAQ says 6.1.1 and System, Settings, Integrations, User cost attribution, Report validation. Check which matches your version. Three values matter. Unfiltered Raw Cost should always equal the unfiltered cost of the same subscriptions and month in Cost Management, which shows everything was fetched. Filtered Raw Cost should equal Calculated Cost, which shows nothing was dropped. The FAQ calls them Raw-Unfiltered, Raw-Filtered and Calculated-Total; remember custom costs.

Nerdio makes two statements about reconciliation. A report's total equals the cost of the nominated subscriptions in Cost Management, unless tag filters are configured, when only tagged resources count. Its cost data page also calls user cost attribution figures estimates and projections that may differ from reconciled Azure billing. Our reading: with tag filters set, compare against Cost Analysis filtered by the same tags, not the unfiltered subscription total, and treat the split between users as a model.

## The data source change

Nerdio's overview says Microsoft will soon deprecate the Azure consumption details API, so the feature will use Log Analytics heartbeat data only. Microsoft Learn's automation FAQ calls the Consumption Usage Details API deprecated and says the turn-off date is still being determined. Nerdio's migration page says usage-based fetching ends as of March 2025 and v6.8 disables it completely. Both dates have passed: the current release is v8.2.3 (13 November 2026), so the page mostly matters for older installations.

The two required changes are the Monitoring Reader role for the service principal (generally named NMW-CCL-APP followed by a random string) on every in-scope subscription, and the App Service setting Is_Using_Heartbeat_Fetching set to True, followed by a restart of the web app. Nerdio says not to add the setting until Monitoring Reader exists on all in-scope subscriptions. An owner can grant the role from the banner; after a manual grant the banner stays until an owner re-saves the configuration.

Nerdio's cost data page names the sources. Sessions come from the WVDConnections table of the connected Log Analytics workspaces. VM uptime comes from the Heartbeat table of all workspaces in the subscription, which needs read permission and depends on retention (30 days by default). Learn describes the Heartbeat table as records logged by Log Analytics agents once per minute to report on agent health. Nerdio does not document how heartbeat records become VM minutes. Our reading: a record per minute while a VM is up gives a running-time signal.

## Limits to accept

- Results depend on tags and diagnostics, and older months on Log Analytics retention.
- Figures are estimates, and the per-user split is a model based on session time.
- Nerdio's pages differ on editing a configuration, the roles list and the validation tool, so test in a small configuration first.

## Sources

- [Nerdio: UCA overview](https://nmehelp.getnerdio.com/hc/en-us/articles/26124340517133-User-cost-attribution-overview)
- [Nerdio: UCA cost types](https://nmehelp.getnerdio.com/hc/en-us/articles/26734007748621-User-cost-attribution-cost-types)
- [Nerdio: UCA analytics](https://nmehelp.getnerdio.com/hc/en-us/articles/25499395894029-User-cost-attribution-analytics)
- [Nerdio: UCA report configuration](https://nmehelp.getnerdio.com/hc/en-us/articles/25499405554189-User-cost-attribution-report-configuration)
- [Nerdio: Enable UCA](https://nmehelp.getnerdio.com/hc/en-us/articles/26124354235533-Enable-user-cost-attribution)
- [Nerdio: UCA (UCA) Azure resources and permissions](https://nmehelp.getnerdio.com/hc/en-us/articles/49560126573453-User-cost-attribution-UCA-Azure-resources-and-permissions)
- [Nerdio: UCA add custom costs](https://nmehelp.getnerdio.com/hc/en-us/articles/31771461415181-User-cost-attribution-Add-custom-costs)
- [Nerdio: UCA cost validation FAQs](https://nmehelp.getnerdio.com/hc/en-us/articles/27226128388493-User-cost-attribution-cost-validation-FAQs)
- [Nerdio: UCA report validation tool](https://nmehelp.getnerdio.com/hc/en-us/articles/28591717475213-User-cost-attribution-report-validation-tool)
- [Nerdio: UCA verify cost in Azure Cost Management](https://nmehelp.getnerdio.com/hc/en-us/articles/26733973528205-User-cost-attribution-verify-cost-in-Azure-Cost-Management)
- [Nerdio: UCA build reports and performance](https://nmehelp.getnerdio.com/hc/en-us/articles/26734000753549-User-cost-attribution-build-reports-and-performance)
- [Nerdio: UCA migrate to heartbeat-based data](https://nmehelp.getnerdio.com/hc/en-us/articles/26999661853581-User-cost-attribution-migrate-to-heartbeat-based-data)
- [Nerdio: UCA combine reports using Power BI](https://nmehelp.getnerdio.com/hc/en-us/articles/29123294304013-User-cost-attribution-combine-reports-using-Power-BI)
- [Nerdio: Where does NME show me Azure cost data?](https://nmehelp.getnerdio.com/hc/en-us/articles/48618389927565-Where-does-NME-show-me-Azure-cost-data)
- [Nerdio: Release notes](https://nmehelp.getnerdio.com/hc/en-us/articles/19837802929677-Release-Notes)
- [Learn: Cost Management automation FAQ](https://learn.microsoft.com/en-us/azure/cost-management-billing/automate/automation-faq)
- [Learn: Migrate from Consumption Usage Details API](https://learn.microsoft.com/en-us/azure/cost-management-billing/automate/migrate-consumption-usage-details-api)
- [Learn: Heartbeat table](https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/heartbeat)
