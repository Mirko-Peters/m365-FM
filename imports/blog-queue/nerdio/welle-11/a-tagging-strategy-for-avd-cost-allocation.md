---
title: "A tagging strategy for AVD cost allocation"
summary: "Tag every cost-bearing Azure Virtual Desktop resource with a small fixed schema and enforce it, because Azure does not copy resource group tags to resources. Compared here: creation-time tags, Azure Policy and tag inheritance."
status: review
publish: false
author: mirko-p
date: 2026-11-18
render: v2
topics: [azure-virtual-desktop, showback, chargeback]
keypoints:
  - "Resources do not inherit tags from a resource group or subscription. Host pool tags reach session hosts only in the portal workflow, so enforce tags with policy for hosts created by automation."
  - "Session host entries under a host pool cannot be tagged. The tag belongs on the VM, and on the shared storage and monitoring resources that exist once per deployment, not once per host."
  - "Three mechanisms put a tag on cost data: tags set at creation, an Azure Policy Modify definition and Cost Management tag inheritance. They differ in what they change, scope and speed."
  - "A tag reaches cost data only while applied and after the resource reports usage: typically 8 to 24 hours on EA and MCA, up to 72 hours on pay-as-you-go. Tag inheritance updates the current month."
  - "Keep keys lowercase and values from a fixed list: tag names are case-insensitive, but Production and production are different values and appear as separate rows."
faq:
  - q: "Do I tag the host pool or the virtual machines?"
    a: "Both, but the VMs matter most for cost. Learn says host pool VMs are typically the main source of cost and that host pool tags follow the cost-generating components of the session hosts. It describes this for the portal workflow, where tags must be entered again for each host added later. The session host entry itself does not support tags, so check that the VM carries the tag."
  - q: "Can I tag only the resource group and let Azure sort out the rest?"
    a: "Not by default. Learn says resources do not inherit tags from a resource group or subscription. You can enforce inheritance with an Azure Policy Modify definition, or, on Enterprise Agreement, Microsoft Customer Agreement and Microsoft Partner Agreement billing accounts, turn on tag inheritance in Cost Management."
  - q: "Will a new tag show up on last month's cost?"
    a: "Not for resource tags: Learn says they are included in usage data only while applied and are not applied to historical data. Tag inheritance updates usage records for the current month; Learn describes nothing for earlier months. Plan the schema before the month you want to report on."
---

Tag every cost-bearing resource of an Azure Virtual Desktop deployment with a small fixed set of tags, and enforce them with Azure Policy, because Azure does not copy tags down from a resource group or subscription on its own. Cost Management can then group spend by tag once a tagged resource has reported usage. This article is about designing and enforcing the tags; turning the result into reports for teams is a separate step.

## What a tag can and cannot do here

[Azure resource tags](https://www.m365.fm/entity/azure-resource-tags/) are name-value pairs on resources, resource groups and subscriptions, but not on management groups. Learn gives these limits: 50 name-value pairs per entity, a name of up to 512 characters and a value of up to 256 characters (storage accounts allow 128 characters for the name), and the characters `<`, `>`, `%`, `&`, `\`, `?` and `/` are not allowed in names. Tags are stored as plain text, so keep sensitive values out.

Two rules shape the whole strategy. First, "Resources don't inherit the tags you apply to a resource group or a subscription." Second, Cost Management reads tags from usage records: tags are included in usage data only while the tag is applied to the resource, they are not applied to historical data, and a resource must be active and producing usage records for the tag to appear.

## Where to put the tags

The Azure Virtual Desktop resource types differ in what they accept. From Learn's tag support table, host pools, application groups, workspaces, scaling plans and app attach packages support tags and carry them in the cost report. The `sessionhosts` entry under a host pool, and user sessions, do not support tags. The cost sits on the virtual machine behind the session host, and VMs and disks both support tags and appear in the cost report.

Learn suggests starting with the host pools, because their VMs are typically the main source of cost. The tagging article says tags entered in the portal creation workflow are passed to all resources created during host pool creation, and that host pool tags follow the cost-generating components of the session hosts. Tags are also applied to session hosts you add to an existing host pool in the portal, but you must enter the tags manually every time. The tagging article does not describe hosts created by automation or by dynamic autoscale. For a host pool with a session host configuration, the ARM reference lists a `vmTags` property, "Hashtable that lists key/value pair tags to apply to the VMs"; every API version on that page is a preview version, and Learn does not say how it applies on a session host update. Check that the tag arrives on the VM, or enforce it with policy as described below.

Host pool tags do not reach everything that bills against the deployment. The cost article lists, as examples, application storage for app attach, user profile storage for FSLogix, Insights log data in Azure Monitor, storage and network costs of custom image templates, and identity provider costs such as domain controller VMs or Microsoft Entra Domain Services. Tag the taggable resources among them yourself, in the same schema.

## A minimal schema

The Cloud Adoption Framework groups tags into functional, classification, accounting, purpose and ownership types, and gives examples such as `department`, `costcenter`, `env` and `opsteam`. Our reading: allocation needs mainly the accounting and functional types. A starting set, with illustrative values:

| Key | Example value | Question it answers |
|---|---|---|
| `costcenter` | `55332` | Who is charged? |
| `department` | `finance` | Which business owner? |
| `env` | `prod`, `dev` | Production or test spend? |
| `workload` | `avd-finance-pooled` | Which host pool or service? |

The Framework treats tag names as case-insensitive and values as case-sensitive, so `env: Production` and `env: production` appear separately in cost reports. The Framework recommends lowercase for tag names and consistent capitalization for values, so we use lowercase keys. Write the allowed values down; Learn warns that even the smallest typo can affect data reporting.

## Three ways to get the tag onto cost data

| Mechanism | What it changes | Existing resources | Scope and limits |
|---|---|---|---|
| Tags set at creation | The resources, once, in the portal workflow | Not changed | Manual again for each host added later |
| Azure Policy Modify definition | The resource's own tags when it is created or updated | Can be fixed by a remediation task | Needs a managed identity for remediation |
| Cost Management tag inheritance | Usage records only, not the resources | Current month only | EA, MCA and MPA billing accounts listed |

**Azure Policy.** [Azure Policy](https://www.m365.fm/entity/azure-policy/) has built-in tag definitions. Modify definitions such as "Inherit a tag from the resource group if missing" add the tag from the parent resource group when a resource is created or updated, and do not change a tag that already has a different value. "Inherit a tag from the resource group" adds or replaces it. Append definitions only act on resources created or changed after assignment. Deny definitions such as "Require a tag on resources" enforce that the tag exists, and "Require a tag and its value on resources" enforces the value too; both exclude resource groups. Learn says existing resources can be remediated by triggering a remediation task, and that policy assignments use a managed identity for remediation (system-assigned or user-assigned). Built-in definitions come with their roles pre-populated.

**Cost Management tag inheritance.** It applies billing, subscription and resource group tags to the usage records of child resources, so you do not need to tag every resource. Learn lists Enterprise Agreement, Microsoft Customer Agreement and Microsoft Partner Agreement billing accounts with Azure plan subscriptions; the page does not mention pay-as-you-go. Updates take about 8 to 24 hours and apply to the current month; the page's example is a setting enabled on 20 October that updates usage from 1 October with the tags that existed on 20 October. By default a matching resource tag wins over the inherited one. Learn says inherited tags go to the usage records, not to the resources themselves; our reading is that a resource query will not show them as resource tags.

Which to choose is a trade-off. Policy gives the resource a real tag and prevents gaps from hosts added later, at the price of assignments, remediation and a Deny effect that can block deployments, so test it first in a non-production subscription. Cost Management inheritance is quick to enable and needs no change to resources, but it only reports; it does not govern.

## Setting it up

1. **Choose the allocation unit.** Decide whether you report by host pool, by department or by cost center.
2. **Fix the schema and value lists.** Use the four keys above or your own, in lowercase, and record the allowed values.
3. **Tag the containers.** Put the schema on the resource group and subscription. In the host pool creation flow, use the optional Tags tab to enter the pairs, which are passed to the resources created in that workflow.
4. **Enforce.** Assign "Inherit a tag from the resource group if missing" for each key, then create a remediation task for existing resources: in the portal, Policy, Remediation, select the assignment, set scope and locations, and Remediate. Add a Require definition for the key you cannot do without.
5. **Optionally enable tag inheritance.** In the Azure portal open Cost Management (not Cost Management + Billing). For an EA billing account, select the billing account scope, then Settings, Configuration, Tag inheritance, Edit, and "Automatically apply subscription and resource group tags to new data"; editing needs the Enterprise Administrator role. For an MCA billing profile, select the billing profile scope, then Settings, Manage billing profile, Tag inheritance, Edit, and "Automatically apply billing, subscription and resource group tags to new usage data"; editing needs Billing profile contributor. A subscription uses Manage subscription and Cost Management Contributor. A matching resource tag wins by default; "Use the subscription or resource group tag" (EA) or "Use the inherited tag" (MCA) reverses that. Purchases and resources that do not emit usage at subscription scope do not get the subscription tags.
6. **Tag shared resources.** Storage accounts for profiles and app attach, Log Analytics workspaces and domain controller VMs get the same keys.
7. **Optionally group by host pool.** Add the `cm-resource-parent` tag to the child resources you want grouped, with the host pool's resource ID as the value. The tagging page says it does not affect billing and labels the linked cost-analysis article "preview"; the Cost Management page carries no preview label and says grouping related resources is available by default in the Resources view; the two pages differ. That page limits each resource to one parent and cost analysis to one level of grouping, and says resources must be actively running with charges.
8. **Check once the data has arrived.** In cost analysis, group by tag and look at the special groups before trusting the totals.

To change tags on existing resources, the PowerShell command `Update-AzTag -ResourceId $id -Tag $tags -Operation Merge` adds tags and keeps existing ones. `New-AzTag` replaces all tags, and `-Operation Replace` also discards the others, so use Merge on live resources. In Azure CLI the equivalent is `az tag update --resource-id $id --operation Merge --tags costcenter=55332`. Even with Merge, a new value for an existing key overwrites the old value. To list resources that already carry a key, use `az resource list --tag costcenter` or `Get-AzResource -TagName "costcenter"`.

## Reading the gaps

Cost analysis shows three special tag values. **Tags not supported** covers purchases, tenant resources not tied to subscriptions, subscription resources not in a resource group, and classic resources. **Tags not available** covers services whose usage data does not include tags. **Untagged** means a taggable resource without the tag. Purchases fall into the first group, so they need a separate allocation rule rather than a tag. Whatever remains in Untagged after the policy has run is your audit list.

A new tag is not visible until the resource reports activity. For EA and MCA subscriptions, Learn says cost data is typically available in 8 to 24 hours; for pay-as-you-go it can take up to 72 hours. If a tag does not show yet, check that it sits directly on the resource and that the resource is running.

## Limits to accept

The tagging page says a complete cost report of every supporting Azure service is unlikely. A shared subscription is cheaper to run but can inflate the cost report because shared usage is less accurate; separate subscriptions give clearer per-service costs but may end up more expensive and may need extra storage. A tag cannot split one shared resource between several teams: a profile storage account used by two departments still carries one value per key, so decide on and document an allocation rule.

## Sources

- [Microsoft Learn: Tag Azure Virtual Desktop resources to manage costs](https://learn.microsoft.com/en-us/azure/virtual-desktop/tag-virtual-desktop-resources)
- [Microsoft Learn: Understand and estimate costs for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/understand-estimate-costs)
- [Microsoft Learn: Microsoft.DesktopVirtualization/hostPools/sessionHostConfigurations (ARM template reference)](https://learn.microsoft.com/en-us/azure/templates/microsoft.desktopvirtualization/hostpools/sessionhostconfigurations)
- [Microsoft Learn: Use tags to organize your Azure resources and management hierarchy](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/tag-resources)
- [Microsoft Learn: Tag support for Azure resources](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/tag-support)
- [Microsoft Learn: Define your tagging strategy (Cloud Adoption Framework)](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/resource-tagging)
- [Microsoft Learn: Assign policy definitions for tag compliance](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/tag-policies)
- [Microsoft Learn: Remediate non-compliant resources with Azure Policy](https://learn.microsoft.com/en-us/azure/governance/policy/how-to/remediate-resources)
- [Microsoft Learn: Group and allocate costs using tag inheritance](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/enable-tag-inheritance)
- [Microsoft Learn: Group and filter options in cost analysis](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/group-filter)
- [Microsoft Learn: Understand Cost Management data](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/understand-cost-mgt-data)
- [Microsoft Learn: Apply tags with Azure PowerShell](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/tag-resources-powershell)
- [Microsoft Learn: Apply tags with Azure CLI](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/tag-resources-cli)
- [Microsoft Learn: Create a host pool with the Azure portal](https://learn.microsoft.com/en-us/azure/virtual-desktop/create-host-pools-azure-marketplace)
