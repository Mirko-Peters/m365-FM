---
title: "Act on Azure Advisor Recommendations for Cost and Security"
summary: "How to open Azure Advisor, filter and download recommendations, understand the VM cost rules for shutdown, resize and burstable, and where security recommendations are actioned."
status: review
publish: false
author: mirko-p
date: 2027-01-02
topics: [azure-advisor]
keypoints:
  - "Open Advisor in the Azure portal. The Overview page shows a tile per category, with a score and recommendation counts."
  - "New resources can take up to 24 hours to produce recommendations. Configuration changes can also take up to 24 hours to show."
  - "VM cost recommendations are shutdown, resize SKU and burstable, with a default 7-day lookback that you can set from 7 to 90 days."
  - "Cost savings use retail rates and ignore reservations and savings plans, so real savings can differ."
  - "Security recommendations are actioned in Microsoft Defender for Cloud, where you remediate, assign an owner, exempt or automate."
faq:
  - q: "How do I open Azure Advisor?"
    a: "According to Microsoft Learn, sign in to the Azure portal and select Advisor, either from the top search bar or the left pane. The Overview page opens by default."
  - q: "How does Advisor decide a VM is unused?"
    a: "Microsoft Learn says a shutdown recommendation targets VMs with no use over the last 7 days, based on CPU and outbound network. It is created if the P95 of maximum CPU is below 3 percent, the P100 of average CPU over the last 3 days is 2 percent or less, and outbound network is below 2 percent over seven days. Memory is not considered."
  - q: "Can I change the lookback period?"
    a: "Yes. Learn says the default is 7 days and can be set to 7, 14, 21, 30, 60 or 90 days. After a change, recommendations can take up to 48 hours to update."
  - q: "Where do I act on a security recommendation?"
    a: "Microsoft Learn explains that security recommendations come from Microsoft Defender for Cloud. In the Azure portal, open Defender for Cloud, select Recommendations, choose one and use Take action to remediate, change owner and due date, exempt or trigger workflow automation."
  - q: "Are Advisor savings figures exact?"
    a: "No. Learn says savings use retail rates and ignore temporary or long-term discounts, and they ignore Reserved Instances and Savings Plans, so listed savings may be higher than achievable."
---

Azure Advisor gives recommendations per category. You open it in the Azure portal, filter to the subscription and status you care about, open a recommendation, and then either act on it, postpone it or dismiss it. For cost, the VM rules are the most concrete part. For security, the actions happen in Microsoft Defender for Cloud. This guide follows Microsoft Learn.

## Open Advisor and read the Overview

1. Sign in to the Azure portal.
2. Select **Advisor** from the top search bar or the left pane.
3. The **Overview** page opens with one tile per category. Each tile shows your score and the number of recommendations.

Learn says Advisor runs in the background to find newly created resources, and recommendations for them can take up to 24 hours.

## Filter, open and download

The Overview has filter buttons:

- **Subscription:** all, or specific subscriptions.
- **Recommendation Status:** Active (default), Postponed, Complete or Dismissed.
- **Resource Group** and **Type:** all by default.
- **Add filter** for more advanced filtering.

Select a category tile to see its list. Open a recommendation and use **Description** or **Impacted resources**. A **Recommended actions** link opens the Azure page where you can act, and **Learn more** gives background. Use **Download as CSV** or **Download as PDF** on the action bar. Downloads respect your filters.

Learn says dismissing a recommendation needs certain privileges, and that changing subscriptions or Advisor compute rules needs the subscription owner role. Otherwise the option is disabled. The page does not give step-by-step instructions for postponing or dismissing.

## Cost: VM and VMSS rules

Learn covers three VM and VM scale set cost recommendation types:

| Type | What it recommends |
| --- | --- |
| Shutdown | Shut down VMs that were not used at all |
| Resize SKU | Move to a less expensive SKU, or fewer instances on a scale set |
| Burstable | Move to a B-series SKU with the same number of cores |

### Shutdown

Targets resources with no use over the last 7 days, judged by CPU and outbound network. Memory is not considered. A recommendation appears if the P95 of maximum CPU across cores is below 3 percent, the P100 of average CPU over the last 3 days is 2 percent or less, and outbound network is below 2 percent over seven days.

### Resize SKU

The proposed SKU must be cheaper at retail rates and meet utilization targets on the new size. For user-facing workloads, P95 of CPU and outbound network must be at or below 40 percent and P99 of memory at or below 60 percent. For non-user-facing workloads, those limits are 80 percent. The new SKU must keep the same Accelerated Networking and Premium Storage capabilities and be available in the VM's region. For scale sets, instance count changes are prioritized over SKU changes.

### Burstable

A B-series SKU is suggested when average CPU is below the burstable baseline, P95 CPU is less than two times that baseline, Accelerated Networking is not enabled, and burstable credits can support the 7-day average CPU.

### Lookback and filtering

The default lookback is 7 days. You can set 7, 14, 21, 30, 60 or 90 days, and updates can take up to 48 hours. To filter VM recommendations by average CPU, select **Configuration** > **Resources** tab > **VM/Virtual Machine Scale Sets right sizing**, pick subscriptions, select **Edit**, choose a CPU value and select **Apply**. This filters which recommendations appear and does not change how they are generated. It can take up to 24 hours.

### Read the savings carefully

Learn states that savings use retail rates and ignore discounts, so they may be higher than achievable. They also ignore Reserved Instances and Savings Plans. A cross-series change can raise costs depending on existing reservations. The cost page I read does not list reservation or Savings Plan recommendations.

### When not to act

Learn says recommendations may not fit when a VM is provisioned for upcoming traffic, relies on resources other than CPU, memory and network, is under test, must stay SKU-homogeneous or serves disaster recovery. Use **Dismiss** or **Postpone** in those cases.

## Security: act in Defender for Cloud

The security page I read describes Defender for Cloud and not Advisor itself, so this section describes where the work happens. Defender for Cloud assesses resources against built-in and custom policies and compliance frameworks and produces recommendations. In the Azure portal:

1. Open **Defender for Cloud** > **Recommendations**.
2. Select a recommendation and choose **Take action**.
3. Pick **Remediate**, **Change owner & due date** (needs a governance rule), **Exempt** or **Workflow automation**.

Learn says to use exemptions rather than disabling rules, and that disable rules are being deprecated. Risk prioritization requires Microsoft Defender CSPM.

## A practical routine

1. Filter to one subscription and the Active status.
2. Start with cost items that Learn defines clearly, such as shutdown candidates, and confirm the VM is not for disaster recovery or planned traffic.
3. Check owners before resizing. My advice: confirm the metrics reflect normal load, because the rules only see CPU, memory and network.
4. Hand security items to the team that owns Defender for Cloud.
5. Download a CSV before and after, so you can show what changed.

## Related

- [Azure Advisor](https://www.m365.fm/entity/azure-advisor/)
- [Microsoft Defender for Cloud](https://www.m365.fm/entity/microsoft-defender-for-cloud/)
- [Azure Reservations](https://www.m365.fm/entity/azure-reservations/)
- [Azure Savings Plans](https://www.m365.fm/entity/azure-savings-plans/)

## Sources

- [Azure Advisor portal basics (Microsoft Learn)](https://learn.microsoft.com/azure/advisor/advisor-get-started)
- [Optimize virtual machine (VM) or virtual machine scale set (VMSS) spend by resizing or shutting down underutilized instances (Microsoft Learn)](https://learn.microsoft.com/azure/advisor/advisor-cost-recommendations)
- [Review Security Recommendations in Microsoft Defender for Cloud (Microsoft Learn)](https://learn.microsoft.com/azure/defender-for-cloud/review-security-recommendations)
