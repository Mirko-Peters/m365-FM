---
title: "How to Start and Stop Azure VMs on a Schedule With Start/Stop VMs v2"
summary: "How Start/Stop VMs v2 schedules Azure VM start and stop with Functions and Logic Apps: scenarios, scoping, sequence tags, permissions, the no further development notice and a short test plan."
status: review
publish: false
author: mirko-p
date: 2027-01-05
topics: [azure-automation, azure-virtual-machines]
keypoints:
  - "Learn marks the Start/Stop VMs v2 article as archived and says no further development or updates will be available except to remain on supported component versions."
  - "The feature uses Azure Functions, Logic Apps, a storage account and Application Insights. It does not depend on Azure Automation or Azure Monitor Logs."
  - "Deploying needs the Owner permission in the subscription. The overview page itself does not describe deployment options."
  - "Scenarios are Scheduled, Sequenced and AutoStop. Sequenced works only with Azure Resource Manager VMs and uses the tags sequencestart and sequencestop."
  - "Scope can be subscription, resource group or VM list. VM list does not support exclusions."
faq:
  - q: "Is Start/Stop VMs v2 still developed?"
    a: "Learn says no further development, enhancements or updates will be available except when required to remain on supported versions of components and Azure services. The article is marked as archived."
  - q: "What does it need to run?"
    a: "Azure Functions for execution, Logic Apps for the schedules, an Azure Storage account required by Functions, and Application Insights for trace logging. A managed identity is created for the function app."
  - q: "Which permission is needed to deploy?"
    a: "Learn says your account must have the Owner permission in the subscription."
  - q: "How does the Sequenced scenario work?"
    a: "VMs carry the tags sequencestart and sequencestop with integer values from 1 to N. Actions run in ascending order, VMs with the same value act together, and both tags are needed for both start and stop. It supports only Azure Resource Manager VMs."
  - q: "Can I exclude VMs?"
    a: "For subscription and resource group scope, yes, and wildcards are supported for exclusions. Learn says exclusion is not supported for the VMList scope."
---

Start/Stop VMs v2 starts and stops Azure virtual machines on schedules you define, across subscriptions. Before you build on it, read the status note: Learn marks the overview as archived and says no further development is planned. This guide follows the Microsoft Learn overview and states what the page does not cover, such as deployment steps and pricing.

## Status first

The Learn article sits under previous versions and is flagged as archived. It states: no further development, enhancements or updates will be available for Start/Stop v2 except when required to remain on supported versions of components and Azure services. It does not give a removal date.

Learn also describes the feature as a decentralized, low-cost automation option with the functionality of the original Azure Automation version. It does not depend on Azure Automation or Azure Monitor Logs.

The page names no successor or alternative. My advice: if you start a new rollout, check other scheduling options for your case before you commit.

## What it is made of

| Component | Role on the page |
| --- | --- |
| Azure Functions | Runs the start and stop work through an HTTP trigger, queue triggers and timer triggers |
| Managed identity | Created in Microsoft Entra ID for the function app to reach Logic Apps and VMs |
| Azure Logic Apps | Hold the schedules and call the function with a JSON payload |
| Storage account | Required by Functions. Table Storage keeps execution metadata and Queue Storage serves queue triggers |
| Application Insights | Receives all trace logging from the function app |
| Action groups | Optional notifications by email for actions on VMs |

Five Logic Apps are created by default: `ststv2_vms_Scheduled_start`, `ststv2_vms_Scheduled_stop`, `ststv2_vms_Sequenced_start`, `ststv2_vms_Sequenced_stop` and `ststv2_vms_AutoStop`.

## Requirements and permissions

- An Azure account with an active subscription.
- The **Owner** permission in the subscription to deploy.
- Availability in the Azure global and US Government regions that offer Azure Functions.

## Scenarios

**Scheduled.** Start and stop actions run on a schedule you set. They cover Azure Resource Manager VMs and classic VMs. Learn describes classic VMs as deprecated.

**Sequenced.** Start and stop run on a schedule against VMs with sequencing tags.

- Only two tag names are supported: `sequencestart` and `sequencestop`.
- Values are integers from 1 to N within the scope.
- Tags are optional. A VM without them does not take part.
- Set both tags on a VM to get both actions.
- Actions run in ascending order of the tag value, and VMs with the same value act at the same time.
- Only Azure Resource Manager VMs are supported.

**AutoStop.** It stops VMs based on CPU utilization. It can also run as a scheduled action that creates alerts on VMs. When the alert condition is true, the alert triggers the stop action. On the page, the AutoStopVM function is the one triggered by the VM alert.

## Scoping

| Scope | Meaning | Exclusions |
| --- | --- | --- |
| Subscription | All VMs in one or more subscriptions | Supported, with wildcards |
| Resource group | All VMs in named resource groups across subscriptions | Supported, with wildcards |
| VMList | A specific set of VMs across subscriptions | Not supported |

## Costs and limits

Learn says you are charged for the services that are deployed and consumed. It gives no price figures and lists no quotas, throughput limits or VM count limits.

## Updates

The page gives two different pictures of updating. The New releases section says an instance is auto-updated when a new version is released. The important updates section says the `TriggerAutoUpdate` and `UpdateStartStopV2` functions are deprecated and will be removed. It recommends stopping the site, installing the latest version from the GitHub repository and starting the site again. To disable auto-update, set the function app setting `AzureClientOptions:EnableAutoUpdate` to `false`. Learn also says that as of 19 August 2024 the feature uses the .NET 8 isolated worker model, and that no built-in update notifications exist.

## What the page does not cover

Deployment options, configuration steps, code samples, pricing, and how failed starts or stops are handled. For updates, it points to the GitHub repository of the project.

## A short plan (my advice)

The plan below is practical advice.

1. Decide whether an archived feature fits your lifecycle.
2. Tag a small test group of VMs. Use Scheduled first, because it has the widest support.
3. Choose scope and exclusions, and remember that VMList has no exclusions.
4. Check Application Insights after the first runs.
5. Decide whether to keep or disable auto-update, and write down your update procedure.

## Typical mistakes (my advice)

- Using Sequenced with classic VMs.
- Setting only one of the two sequence tags.
- Assuming VMList can exclude machines.
- Ignoring the archived status and the update note.

## Related

- [Azure Automation](https://www.m365.fm/entity/azure-automation/)
- [Azure virtual machines](https://www.m365.fm/entity/azure-virtual-machines/)
- [Managed identity](https://www.m365.fm/entity/managed-identity/)

## Sources

- [Start/Stop VMs v2 overview (Microsoft Learn)](https://learn.microsoft.com/previous-versions/azure/functions/start-stop-vms/overview)
