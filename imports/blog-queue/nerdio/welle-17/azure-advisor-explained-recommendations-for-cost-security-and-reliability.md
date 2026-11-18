---
title: "Azure Advisor explained: recommendations for cost, security and reliability"
summary: "Azure Advisor analyzes resource configuration and usage telemetry and returns recommendations in five categories. This article explains how to read them, how the Advisor score works and the limits for Azure Virtual Desktop."
status: review
publish: false
author: mirko-p
date: 2026-11-18
render: v2
topics: [azure-advisor, azure]
keypoints:
  - "Advisor has five recommendation categories: reliability, security, performance, cost and operational excellence. The overall Advisor score is usually the average of the five category scores."
  - "Reader can view recommendations. Postponing or dismissing needs Contributor on the resource; configuring Advisor needs Contributor or Owner on the subscription or resource group."
  - "Advisor includes Defender for Cloud recommendations, but security recommendations cannot be postponed or dismissed, and Advisor alerts do not support the security category."
  - "Cost savings and the cost score use pay-as-you-go retail rates, so Learn says listed savings may be higher than what you can achieve with discounts or commitments."
  - "Advisor is not specific to Azure Virtual Desktop. The reference pages list only a few recommendations that name it, so treat the rest as prompts to check against how your host pools are used."
faq:
  - q: "How often does Azure Advisor refresh its recommendations?"
    a: "Learn gives several timings rather than one interval. It can take up to 24 hours to produce recommendations for newly created resources and up to a day to recognize an action you took. Advisor checks every 24 hours whether a recommendation has been addressed (the exact cadence depends on the recommendation type), and the Advisor score refreshes at least once per day."
  - q: "Who can dismiss an Azure Advisor recommendation?"
    a: "Learn says you need Contributor or better on the resource that the recommendation is about. A Reader can view recommendations but cannot change their status. A dismissed recommendation stays hidden until someone reactivates it. Learn says this state management is in preview and does not apply to security recommendations, which support only the Active state."
  - q: "Does Azure Advisor have recommendations for Azure Virtual Desktop?"
    a: "A few. The performance reference lists two under an Azure Virtual Desktop heading, one about the maximum session limit on depth-first host pools and one about deploying VMs closer to users, and the reliability reference lists two: one about missing mandatory URLs and one about the retirement of Azure Virtual Desktop (classic). Most other recommendations apply to the underlying VMs, disks or networking."
---

Azure Advisor is the Azure service that looks at your resource configuration and usage telemetry and tells you what to change. It sorts its recommendations into five categories (reliability, security, performance, cost and operational excellence), gives each one an impact level, and rolls adoption up into the Advisor score. This article explains how that works, who may act on it and where an Azure Virtual Desktop (AVD) admin should be careful. The detailed right-sizing workflow for session hosts is in the companion article on using Advisor to right-size AVD session hosts.

## What Advisor analyzes and which categories it uses

Learn describes [Azure Advisor](https://www.m365.fm/entity/azure-advisor/) as a digital cloud assistant that analyzes resource configuration and usage telemetry and recommends solutions to improve cost effectiveness, performance, reliability and security. The overview lists more than 30 services and resource types it covers, among them Azure Virtual Machines, Azure Storage accounts and Azure SQL Server. It also includes recommendations from [Microsoft Defender for Cloud](https://www.m365.fm/entity/microsoft-defender-for-cloud/), which may cover other resource types.

| Category | What Learn says it addresses |
|---|---|
| Reliability | Continuity of business-critical applications |
| Security | Threats and vulnerabilities that might lead to breaches |
| Performance | Application speed |
| Cost | Optimizing and reducing overall Azure spending |
| Operational excellence | Process and workflow efficiency, resource manageability and deployment practices |

Learn's Advisor score training module says the five category scores each represent one of the five pillars of Azure Advisor and the [Azure Well-Architected Framework](https://www.m365.fm/entity/azure-well-architected-framework/). For security, the overview page says only that Advisor also includes recommendations from Defender for Cloud. Learn's Defender page on reviewing recommendations is Defender documentation, not Advisor documentation: it says resources are assessed against security policies and compliance frameworks across Azure, AWS and GCP, that individual recommendations in a new format are marked Preview and do not yet affect Secure Score, and that risk prioritization needs Defender Cloud Security Posture Management.

## Reading the dashboard

Open the Azure portal, select **Advisor** (or search for it), and the **Overview** page opens. Each category tile shows the category score, the number of recommendations by impact level and the number of impacted resources. You can narrow the view with filters:

- **Subscription**: all or specific subscriptions.
- **Recommendation Status**: Active (the default), Postponed, Complete or Dismissed.
- **Resource Group** and **Type**: all by default, or specific values.

Select a category, then **Description** or **Impacted resources**, and use the **Recommended actions** link to reach the Azure page where you act. **Download as CSV** or **Download as PDF** on the action bar exports the list, and the export respects your filters. In our reading, this is a convenient way to hand a cost or reliability list to a team that does not use the portal.

Advisor runs in the background, so a newly created resource can take up to 24 hours to produce recommendations. After you implement one, it can take up to a day for Advisor to recognize it. For status, you can postpone a recommendation (temporarily hide it and review it later), dismiss it (indicate it is not relevant) or mark it completed. You can switch states or reactivate a recommendation until Advisor's own verification marks it completed, which Learn says runs every 24 hours; recommendations you mark manually appear as "Marked completed". Learn says this state management is in preview. It is not supported for security recommendations: only Active applies, and their status is in Defender for Cloud.

## Impact levels in practice

Impact labels help with ordering, not with deciding. On the reference pages, "Right-size or shutdown underutilized virtual machines" and "Consider virtual machine reserved instance to save over the on-demand costs" are rated High, while "Provide access to mandatory URLs missing for your Azure Virtual Desktop environment" is Medium and "Convert Standard to Premium disk for higher uptime" is Low. Learn names cases where a High item does not apply: a machine provisioned for upcoming traffic, a size under test, or a VM kept as a disaster recovery target. For those, dismiss or postpone with a reason in your change record.

## The Advisor score

The score turns recommendations into percentages. Learn defines an overall score and five category scores. A category score of 100 percent means every resource Advisor assessed follows the assessed practices, and 0 percent means none does. The overall score is the sum of the applicable category scores divided by the sum of the highest possible scores, which in most cases means the sum of the five category scores divided by five. Learn's example uses scores of 73, 77, 100, 85 and 80, which gives (73 + 77 + 100 + 85 + 80) / 5 = 83 percent.

Categories are calculated differently:

- **Reliability, performance and operational excellence** use subcategories with fixed weights. For reliability, zone resiliency has weight 30, regional resiliency 25 and data protection and recovery 20. A subcategory score is healthy resources divided by total applicable resources. In Learn's worked example the category comes out at 76.76 percent, shown as 77 percent.
- **Cost** is weighted by subscription consumption. Advisor prices assessed resources at pay-as-you-go rates multiplied by the usage on the last day the resource was allocated, and it omits discounts. Recommendations with a larger effect weigh more, long-standing ones count more against you, and postponed or dismissed resources are removed from the calculation. Learn states that the score is not a reflection of how much you spend; unnecessary spending lowers it.
- **Security** is calculated with a secure score model, according to Learn.

Two practical consequences follow. First, dismissing a recommendation can raise the score, because Learn says dismissed and postponed resources are excluded at the next refresh, so a dismissal needs a reason and an owner, not just a click. Second, the score refreshes at least once per day and needs at least 24 hours to change after you fix something. The **Advisor score** page shows daily, weekly and monthly trends and the potential score increase of each recommendation.

## Who can do what

Learn splits permissions into viewing, managing status and configuring.

| Action | Roles |
|---|---|
| View recommendations | Reader, Contributor or Owner at subscription, resource group or resource scope |
| Postpone or dismiss | Contributor or better on the resource the recommendation is about; Advisor Recommendations Contributor (Assessments and Reviews) also manages status |
| Edit rules and subscription configuration | Subscription Contributor or Owner |
| Edit resource group configuration | Resource group or subscription Contributor or Owner |

You must have access to the resource behind a recommendation to see it. Without the right to dismiss, Learn says the portal allows the click but returns an error. One inconsistency is worth knowing: the portal basics page says changing subscriptions or Advisor compute rules requires a subscription owner, while the permissions page lists Subscription Contributor as well. If a setting is greyed out for a Contributor, ask for the Owner role, or have the owner make the change. A dismissed recommendation does not come back on its own; someone has to reactivate it. These status actions do not apply to security recommendations.

## Configuration and alerts

Under **Configuration** in the left pane, the **Resources** tab lets you include or exclude subscriptions from recommendations. The **VM/VMSS right sizing** tab sets a per-subscription filter on average CPU utilization. Learn says the filter does not change how recommendations are generated; it only limits which ones are shown, and changes can take up to 24 hours to appear.

For notifications, Advisor stores an event in the Azure activity log whenever it detects a new recommendation, and you can alert on it:

1. In **Advisor**, open **Alerts** under **Monitoring** and select **New Advisor Alert**.
2. Choose the subscription and, optionally, a resource group as scope.
3. Configure by **Category and impact level** or by **Recommendation type**.
4. Select an existing [Azure Monitor](https://www.m365.fm/entity/azure-monitor/) action group or create one.
5. Name the rule and keep **Enable rule upon creation** set to **Yes**.

The alerts page says these alerts support only High Availability, Performance and Cost recommendations, not Security. That page is older than most of the Advisor documentation, so confirm the options in the portal. For ticketing tools, the webhook payload identifies Advisor events by `eventSource` equal to `Recommendation` and `operationName` equal to `Microsoft.Advisor/recommendations/available/action`.

## What this means for Azure Virtual Desktop

Advisor evaluates Azure resources, so [session hosts](https://www.m365.fm/entity/avd-session-host/) show up as virtual machines. The cost reference page for the right-size recommendation does not mention [Azure Virtual Desktop](https://www.m365.fm/entity/azure-virtual-desktop/). A few recommendations do name it:

- **Performance**: "Set the max session limit setting for the depth first load balanced host pool" (High). With [depth-first load balancing](https://www.m365.fm/entity/avd-depth-first-load-balancing/), a [maximum session limit](https://www.m365.fm/entity/avd-maximum-session-limit/) that is too high sends all sessions to the same host. A second item advises deploying VMs to a region closer to users.
- **Reliability**: "Provide access to mandatory URLs missing for your Azure Virtual Desktop environment" (Medium, listed under Virtual Machines) and "Classic (Azure Virtual Desktop) is retiring" (High, listed under Subscriptions), which matters if classic resources remain.
- **GPU retirements**: the reliability reference lists "Resize or migrate NVv3-series virtual machines" and the NVv4 equivalent (both High), pointing to NVadsA10_v5 and NVads_V710_v5. Learn's size pages say both series retired on 30 September 2026, so these apply to a GPU host pool that has not yet been migrated.

In the same references, the operational excellence page has an **Azure Virtual Desktop** heading with no recommendations listed under it, and it recommends enabling VM Insights on virtual machines. AVD has its own dashboard, [Azure Virtual Desktop Insights](https://www.m365.fm/entity/avd-insights/), which Advisor does not replace.

Three limits matter for a pooled environment. Advisor sees VM metrics, not user sessions, so a size change can conflict with a host pool designed around a session limit. Cost savings use retail rates and, according to Learn, do not account for reservations or savings plans, which can overstate the saving; see [Azure Reservations](https://www.m365.fm/entity/azure-reservations/) and [Azure savings plans](https://www.m365.fm/entity/azure-savings-plans/). And [autoscale](https://www.m365.fm/entity/avd-power-management-autoscaling/) deallocates excess hosts during ramp-down, while the right-size page does not say how deallocated hours are treated. Use the dashboard to find candidates and your own host pool data to decide.

## A short routine for admins

1. Once a month, filter the Overview by subscription and download the cost and reliability lists as CSV.
2. Assign each High item to an owner with a due date. For a cost, reliability, performance or operational excellence item you decline, dismiss it with a reason.
3. Create an Advisor alert for High-impact cost and reliability recommendations, routed to the team's action group. In our reading, the "High Availability" alert type is the reliability category.
4. Check the score trend after the next daily refresh, not after the change window.

## Sources

Last checked 17 November 2026.

- [Microsoft Learn: Introduction to Azure Advisor](https://learn.microsoft.com/en-us/azure/advisor/advisor-overview)
- [Microsoft Learn: Azure Advisor portal basics](https://learn.microsoft.com/en-us/azure/advisor/advisor-get-started)
- [Microsoft Learn: Advisor score](https://learn.microsoft.com/en-us/azure/advisor/azure-advisor-score)
- [Microsoft Learn: Permissions in Azure Advisor](https://learn.microsoft.com/en-us/azure/advisor/permissions)
- [Microsoft Learn: Create Advisor alerts for new recommendations using Azure portal](https://learn.microsoft.com/en-us/azure/advisor/advisor-alerts-portal)
- [Microsoft Learn: Cost recommendations (Advisor reference)](https://learn.microsoft.com/en-us/azure/advisor/advisor-reference-cost-recommendations)
- [Microsoft Learn: Reliability recommendations (Advisor reference)](https://learn.microsoft.com/en-us/azure/advisor/advisor-reference-reliability-recommendations)
- [Microsoft Learn: Performance recommendations (Advisor reference)](https://learn.microsoft.com/en-us/azure/advisor/advisor-reference-performance-recommendations)
- [Microsoft Learn: Operational excellence recommendations (Advisor reference)](https://learn.microsoft.com/en-us/azure/advisor/advisor-reference-operational-excellence-recommendations)
- [Microsoft Learn: Right-size or shut down underutilized virtual machines](https://learn.microsoft.com/en-us/azure/advisor/advisor-cost-recommendations)
- [Microsoft Learn: Manage recommendation state](https://learn.microsoft.com/en-us/azure/advisor/advisor-azure-state-management)
- [Microsoft Learn: Understand your optimization posture with Advisor Score (training module)](https://learn.microsoft.com/en-us/training/modules/get-started-azure-advisor/4-optimization-posture-advisor-score)
- [Microsoft Learn: Review security recommendations in Microsoft Defender for Cloud](https://learn.microsoft.com/en-us/azure/defender-for-cloud/review-security-recommendations)
- [Microsoft Learn: NVv3 size series](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/gpu-accelerated/nvv3-series)
- [Microsoft Learn: NVv4 size series](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/gpu-accelerated/nvv4-series)
