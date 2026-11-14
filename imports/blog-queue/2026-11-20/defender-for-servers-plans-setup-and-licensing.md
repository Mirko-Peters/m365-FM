---
title: "Microsoft Defender for Servers: Plans, Setup and Licensing"
summary: "Defender for Servers is a paid plan in Defender for Cloud with two tiers. This guide covers Plan 1 versus Plan 2, how to turn it on, how billing works and what happens with existing Defender for Endpoint licenses."
status: review
publish: false
author: mirko-p
date: 2026-11-20
topics: [microsoft-defender-for-cloud, microsoft-defender-for-endpoint, azure]
keypoints:
  - "Defender for Servers is a plan inside Microsoft Defender for Cloud. Plan 1 is entry-level and centers on endpoint detection and response (EDR) through Defender for Endpoint."
  - "Plan 2 includes everything in Plan 1 plus agentless scanning, file integrity monitoring, just-in-time VM access, OS baseline checks and a 500 MB daily data ingestion benefit."
  - "Turn it on under Defender for Cloud > Environment settings > your subscription > Servers. Plan 2 is the default, and Change plans switches to Plan 1."
  - "Enabling a plan starts a 30-day trial that cannot be stopped, paused or extended."
  - "Microsoft says Defender for Endpoint for Servers licenses are included with Defender for Servers. Existing standalone licenses need a support request to avoid double billing."
faq:
  - q: "What is the difference between Defender for Servers Plan 1 and Plan 2?"
    a: "According to Microsoft Learn, Plan 1 is entry-level and focuses on the EDR capabilities from the Defender for Endpoint integration. Plan 2 provides the same features and adds capabilities such as agentless vulnerability, malware and secrets scanning, file integrity monitoring, just-in-time VM access, OS baseline and update assessment, premium Defender Vulnerability Management features and free data ingestion of up to 500 MB per node per day."
  - q: "Do I need a separate Defender for Endpoint license for my servers?"
    a: "Microsoft Learn states that licenses for Defender for Endpoint for Servers are included with Defender for Servers. If you already own Defender for Endpoint for Servers licenses, you do not pay for that part of Plan 1 or Plan 2, but you must submit a support request in the Azure portal to get the adjustment. The discount starts on the approval date and is not retroactive."
  - q: "How is Defender for Servers billed?"
    a: "Per the Defender for Cloud FAQ, you are charged for all machines in the subscription based on their power state. Running and stopped VMs are billed, deallocated VMs are not. Arc-connected machines are billed while they send heartbeats and are not billed when offline for 15 to 30 minutes or more. The pages I read do not state a price, so check the Defender for Cloud pricing page."
  - q: "Can I enable Plan 2 for a single server?"
    a: "No. Microsoft Learn says Plan 1 can be enabled or disabled per resource, but Plan 2 cannot be enabled at the resource level. You can disable Plan 2 for a single resource. Microsoft recommends enabling the plan at subscription level."
  - q: "Does it cover servers outside Azure?"
    a: "Yes. Learn lists VMs on Azure, AWS and GCP, plus on-premises machines connected to Defender for Cloud. Microsoft recommends onboarding AWS, GCP and on-premises machines as Azure Arc-enabled machines for full functionality."
---

Microsoft Defender for Servers is a paid plan in Microsoft Defender for Cloud that protects server operating systems in Azure, AWS, GCP and on-premises environments. It comes in two tiers. Plan 1 is the entry-level tier built around endpoint detection and response (EDR). Plan 2 adds posture and scanning features on top. Licensing is mostly handled through Azure billing, not through a separate Defender for Endpoint purchase.

## What Defender for Servers does

Microsoft Learn describes the plan as reducing security risk and exposure for machines. It gives posture recommendations with remediation guidance and protects machines against real-time threats. Two integrations do much of the work: Microsoft Defender for Endpoint provides EDR, and Microsoft Defender Vulnerability Management provides vulnerability scanning and software inventory.

Learn also says the plan no longer uses the Log Analytics agent or Azure Monitor Agent for most features. Agentless machine scanning and the Defender for Endpoint integration replace them. The Azure Monitor Agent is still supported for the 500 MB data ingestion benefit.

## Plan 1 versus Plan 2

The Learn overview lists Plan 1 as entry-level, focused on the EDR capabilities delivered by the Defender for Endpoint integration. Plan 2 includes the same features and more.

| Capability | Plan 1 | Plan 2 |
|---|---|---|
| Defender for Endpoint automatic onboarding and EDR | Yes | Yes |
| Integrated alerts and incidents | Yes | Yes |
| Software inventory discovery | Yes | Yes |
| Regulatory compliance assessment | Yes | Yes |
| Agent-based vulnerability scanning | Yes | Yes |
| Agentless vulnerability, malware and secrets scanning | No | Yes |
| OS updates and OS baseline assessment | No | Yes |
| File integrity monitoring | No | Yes |
| Just-in-time VM access (Azure and AWS) | No | Yes |
| Network map (Azure) | No | Yes |
| Free data ingestion, 500 MB per node per day | No | Yes |

Some Plan 2 features have platform limits. For example, the overview table lists OS baseline checks for Azure Arc-onboarded machines only, and the premium Defender Vulnerability Management features are available in the Defender portal only. Check the full table on the Learn overview before you promise a feature for a specific cloud.

### How to choose

Learn gives no formal decision matrix. Its description supports a simple rule. Choose Plan 1 if EDR is the requirement. Choose Plan 2 if you need agentless scanning, file integrity monitoring, just-in-time access, OS configuration assessment or the data ingestion benefit.

Scope matters too. Plan 1 can be enabled or disabled per resource. Plan 2 can only be enabled on a subscription, although you can disable it on a single resource. Microsoft recommends subscription-level enablement.

## How to turn it on

Before you start, Learn recommends reviewing the planning guide, the roles article, the pricing page and the support matrix. For AWS or GCP machines, connect the account or project first. On-premises machines should be onboarded as Azure Arc VMs for full functionality. Installing only the Defender for Endpoint agent limits you to Plan 1 functionality, according to the tutorial.

1. Sign in to the Azure portal and open **Microsoft Defender for Cloud**.
2. Select **Environment settings**.
3. Select the Azure subscription, AWS account or GCP project.
4. On the Defender plans page, switch **Servers** to **On**. Plan 2 is the default.
5. To use Plan 1, select **Change plans**, choose **Plan 1** and select **Confirm**.
6. Select **Save**.

After that, the Defender for Endpoint extension is installed automatically on supported connected machines unless you disable automatic provisioning. Agentless scanning is on by default with Plan 2.

The roles article lists the built-in Azure roles Owner, Contributor and Reader and points to a separate permissions page for the Defender for Cloud roles. The pages I read do not state which single role is the minimum to enable a plan, so check that permissions page for your case.

### Trial and monitoring

Enabling a plan starts a 30-day trial that you cannot stop, pause or extend. To see which plans are active across subscriptions and resources, Learn points to the coverage workbook in Azure Workbooks.

## Licensing and billing

This is the part that causes most confusion. The Defender for Cloud FAQ makes four statements.

- Licenses for Defender for Endpoint for Servers are included with Defender for Servers. Plan 1 and Plan 2 provide the capabilities of Defender for Endpoint Plan 2, including EDR.
- If you already own Defender for Endpoint for Servers licenses, you do not pay for that part of Plan 1 or Plan 2. To get the adjustment, create a support request in the Azure portal under **Support and Troubleshooting** > **Help + support** > **Create a support request**. Include the tenant ID, the number of licenses and the expiration date. The discount starts on the approval date and is not retroactive.
- You are charged for all machines in the subscription by power state. Running and stopped VMs are billed. Deallocated VMs are not. Arc-connected machines are billed while they send heartbeats, not when they are offline or expired. Servers connected only through the Defender for Endpoint sensor are billed per hour.
- Plan 2 gives a free data ingestion allowance for specific data types. It needs Plan 2 enabled on the Log Analytics workspace the machines report to, and a supported collection method such as the Azure Monitor Agent. A data collection rule alone does not enable it.

The Learn pages I read do not list prices. They point to the Defender for Cloud pricing page and cost calculator.

## Common mistakes

- **Expecting Plan 2 per server.** Plan 2 cannot be enabled on one resource. Use Plan 1 per resource or Plan 2 per subscription.
- **Forgetting the workspace.** Disabling Plan 2 on the subscription does not disable it on a Log Analytics workspace. Switch it off in the workspace plan settings too.
- **Paying twice.** Existing Defender for Endpoint for Servers licenses do not reduce the bill automatically. Submit the support request.
- **Direct onboarding for Plan 2 features.** Onboarding on-premises machines only through Defender for Endpoint means you will not have full access to Plan 2 features. Use Azure Arc.
- **Assuming a trial can be paused.** It cannot.

## Related

- [Microsoft Defender for Cloud](https://www.m365.fm/entity/microsoft-defender-for-cloud/)
- [Microsoft Defender for Endpoint](https://www.m365.fm/entity/microsoft-defender-for-endpoint/)
- [Microsoft Azure](https://www.m365.fm/entity/azure/)

## Sources

- [Microsoft Learn: Defender for Servers overview](https://learn.microsoft.com/en-us/azure/defender-for-cloud/defender-for-servers-overview)
- [Microsoft Learn: Select a Defender for Servers plan](https://learn.microsoft.com/en-us/azure/defender-for-cloud/plan-defender-for-servers-select-plan)
- [Microsoft Learn: Enable the Defender for Servers plan](https://learn.microsoft.com/en-us/azure/defender-for-cloud/tutorial-enable-servers-plan)
- [Microsoft Learn: Defender for Servers introduction](https://learn.microsoft.com/en-us/azure/defender-for-cloud/defender-for-servers-introduction)
- [Microsoft Learn: Review Defender for Servers access roles](https://learn.microsoft.com/en-us/azure/defender-for-cloud/plan-defender-for-servers-roles)
- [Microsoft Learn: Common questions about Defender for Servers](https://learn.microsoft.com/en-us/azure/defender-for-cloud/faq-defender-for-servers)
