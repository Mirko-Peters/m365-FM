---
title: "How to Tag Azure Resources for Cost Allocation and Enforce Tags With Policy"
summary: "Azure resource tags explained: limits, disallowed characters, no inheritance from resource groups, tag access roles, cost reporting, the cm-resource-parent tag and where Azure Policy fits in."
status: review
publish: false
author: mirko-p
date: 2027-01-03
topics: [azure-resource-tags, azure-policy]
keypoints:
  - "Tags are key-value pairs you can apply to resources, resource groups and subscriptions. Management groups do not support them."
  - "Each resource, resource group or subscription can have up to 50 tag name-value pairs. Names allow 512 characters and values 256."
  - "Resources do not inherit tags from their resource group or subscription. Use Azure Policy to enforce or add tags."
  - "Tags are plain text. Do not store sensitive values, because they can show up in cost reports, deployment history and logs."
  - "Tags appear in the Tags column of the usage file for services that support tags with billing. The cm-resource-parent tag groups costs by a parent resource."
faq:
  - q: "How many tags can a resource have?"
    a: "According to Microsoft Learn, up to 50 tag name-value pairs per resource, resource group or subscription. For more, you can store several values in a JSON string as one tag value. Tag names can be 512 characters and values 256 characters, with shorter name limits for storage accounts."
  - q: "Do resources inherit tags from the resource group?"
    a: "No. Microsoft Learn says resources do not inherit tags from their resource group or subscription. To enforce tags from a subscription or resource group onto resources, use Azure Policy."
  - q: "Which characters are not allowed in tag names?"
    a: "Learn lists < > % & \\ ? and / as disallowed characters in tag names. Some services add rules. For example, Azure DNS tag names cannot contain spaces or start with a number."
  - q: "Can I use tags for cost reporting?"
    a: "Yes. Learn says tags group billing data, for example by cost center or environment, and appear in the Tags column of the usage file for services that support tags with billing."
  - q: "What permission do I need to tag a resource?"
    a: "Learn says write access to the resource, such as the Contributor role, allows tagging. The Tag Contributor role, which grants Microsoft.Resources/tags write access, tags any resource without access to the resource itself."
---

Tag Azure resources with consistent key-value pairs such as cost center and environment, check which of your resource types support tags, and use Azure Policy to apply or enforce them, because tags are not inherited. Tags then appear in billing data, which lets you allocate cost. This guide follows the Microsoft Learn article on tagging resources. That article links separate pages for the portal, CLI and PowerShell steps, which I did not read, so this guide does not give click paths or commands for applying tags.

## What tags are and where they apply

Tags are key-value pairs, for example `Environment = Production`. You can apply them to resources, resource groups and subscriptions. Management groups do not support tags.

Case matters in a specific way. Tag names are case-insensitive for operations, but the resource provider may keep the casing you supply, and that casing shows in cost reports. Tag values are case-sensitive. Pick one spelling and keep it.

## Limits

From Learn:

- A maximum of **50** tag name-value pairs per resource, resource group or subscription.
- If you need more, store multiple values in a JSON string as one tag value.
- Tag name: up to **512** characters. Tag value: up to **256** characters.
- Storage accounts: tag name up to **128** characters, value up to 256.
- A limit of **15** tags applies to Azure Automation, Azure Content Delivery Network, Azure Public DNS (zone and A records), Azure Private DNS (zone and A records) and Azure Log Analytics saved search.

Characters not allowed in tag names: `<`, `>`, `%`, `&`, `\`, `?` and `/`.

Service-specific name rules:

| Service | Rule |
| --- | --- |
| Azure DNS | No spaces or parentheses, cannot start with a number, no special or Unicode characters in names. Values can contain any characters |
| Traffic Manager | No spaces, `#` or `:`. Cannot start with a number |
| Azure Front Door | No `#` or `:` |

## Check which resources support tags

Not all resource types support tags. Learn points to a tag support reference. Classic resources such as Cloud Services do not support tags. Azure IP Groups and Azure Firewall policies do not support PATCH, so you use their own update commands. Some types have conditions, for example VM extension tags can be updated only while the VM is running.

## Tags are not inherited

Resources do not inherit tags from their resource group or subscription. If you tag a resource group with a cost center, its resources do not carry that tag. Learn says to use Azure Policy to enforce tags from a subscription or resource group onto resources, and that tag policies can also ensure cost-accruing services are provisioned with a tag. The policy article itself is separate, and I did not read it, so this guide does not describe specific built-in policy definitions.

## Who can tag

- Write access to the resource, for example the **Contributor** role, allows tagging. For VMs, Learn names **Virtual Machine Contributor**.
- The **Tag Contributor** role grants `Microsoft.Resources/tags` write access. It lets someone tag any resource without access to the resource itself. In the portal, that role cannot tag resources or resource groups, but can tag subscriptions. All tag operations work in PowerShell and REST.

## Use tags for cost allocation

Tags group billing data, for example by cost center or environment. Download the usage file from the portal, and tags appear in the **Tags** column for services that support tags with billing.

Learn also describes the special tag `cm-resource-parent`. The key is that exact string and the value is a resource ID. Cost Management then groups costs under that resource, for example an Azure Virtual Desktop host pool, without filters.

## Plan a tag scheme

Learn does not prescribe tag names, so choose your own and document them:

1. Pick a short list of required tags, such as cost center, owner and environment.
2. Fix the exact spelling and casing, since tag values are case-sensitive.
3. Decide which scope holds each tag. Remember that child resources do not inherit.
4. Use Azure Policy to add or require the tags at deployment.
5. Check cost reports after a billing cycle to confirm the tags appear.

## Cautions from Learn

- **Tags are plain text.** Do not store sensitive values. They can appear in cost reports, tag-definition commands, deployment histories, exported templates and monitoring logs.
- **Non-English characters** can break metadata decoding when a VM reads from the Instance Metadata Service.
- **Paginated results.** Unique tag API responses are paginated, so tools such as the portal may show the same tag key twice.

## Typical mistakes

- Expecting a resource group tag to reach the resources in it.
- Using different casings of the same value, which splits cost groups.
- Putting secrets or personal data in tags.
- Tagging a type that does not support tags, then wondering why costs do not group.

## Related

- [Azure resource tags](https://www.m365.fm/entity/azure-resource-tags/)
- [Azure Policy](https://www.m365.fm/entity/azure-policy/)
- [Azure RBAC](https://www.m365.fm/entity/azure-rbac/)

## Sources

- [Use tags to organize your Azure resources and management hierarchy (Microsoft Learn)](https://learn.microsoft.com/azure/azure-resource-manager/management/tag-resources)
