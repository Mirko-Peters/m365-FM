---
title: "Fix ReservedResourceName: A Trademarked or Reserved Word in an Azure Resource Name"
summary: "ReservedResourceName means the name of a resource with an accessible endpoint contains a reserved word or trademark. The full word list from Microsoft Learn, the three matching rules, why disabled endpoints are checked too, and how to fix templates."
status: review
publish: false
author: mirko-p
date: 2027-01-23
topics: [arm-template, bicep, azure-resource-manager]
keypoints:
  - "The error text says the resource name or a part of the name is a trademarked or reserved word. The code is ReservedResourceName."
  - "It applies to resources with an accessible endpoint, such as a fully qualified domain name. The name is checked at creation even if the endpoint is not currently enabled."
  - "Microsoft and Windows cannot be used as a whole word or as a substring. LOGIN cannot be used at the start of a name, but can appear later."
  - "The fix is a name without any of the listed words. Check name parts you build with parameters or variables."
  - "The naming rules page adds that names are case-insensitive unless noted, and that # should not be used in a resource name."
faq:
  - q: "What does ReservedResourceName mean?"
    a: "Microsoft Learn shows the error as Code=ReservedResourceName with the message that the resource name or a part of the name is a trademarked or reserved word. It happens when you deploy a resource whose name includes a reserved word. Reserved words cannot be used in resource names."
  - q: "Which resources are affected?"
    a: "Resources with an accessible endpoint, such as a fully qualified domain name. Learn says the name is checked when the resource is created, even if the endpoint is not currently enabled. The naming rules page repeats that resources with a public endpoint cannot include reserved words or trademarks."
  - q: "Are all the words blocked in the same way?"
    a: "No. Most listed words, such as AZURE, OFFICE, EXCEL or OUTLOOK, are reserved. MICROSOFT and WINDOWS cannot be used as either a whole word or a substring. LOGIN cannot be used at the start of a resource name, but can be used later in the name."
  - q: "How do I fix the deployment?"
    a: "Provide a name that does not use one of the reserved words. In a template, check which parameter, variable or expression builds the name, and change the part that contains the word. Check the whole built name, since a part of the name is enough to trigger the error."
  - q: "Where do I find other naming limits?"
    a: "The Azure naming rules and restrictions page lists the rules by resource provider, with length and valid characters per resource type. It says names are case-insensitive unless noted, that you should always compare names case-insensitively, and not to use the hash character in a name because it interferes with URL parsing in Azure Resource Manager requests."
---

Deployments that fail with ReservedResourceName have a short explanation on Microsoft Learn. A resource name contains a word that Azure does not allow in names, either as a reserved word or as a trademark. This article gives the exact error text, the three kinds of rules in the word list, and a way to find the offending part of a name in an ARM template or Bicep file.

## The error

```
Code=ReservedResourceName;
Message=The resource name <resource-name> or a part of the name is a trademarked or reserved word.
```

The phrase "a part of the name" matters. A name like `myofficeapp01` is not the word OFFICE alone, but it contains it.

## When the check applies

Learn says resources with an accessible endpoint, such as a fully qualified domain name, cannot use reserved words or trademarks in the name. The name is checked when the resource is created, even if the endpoint is not currently enabled. So you cannot avoid the check by leaving public access off.

The naming rules page says the same in a note, for resources with a public endpoint. Some resource types in that page also carry the rule in their own row. For example, Synapse workspaces and SQL pools list that they cannot contain reserved words.

## The three kinds of rule

### Reserved words

These words are reserved, according to the page:

| Group | Words |
| --- | --- |
| Web and ASP.NET names | ACCESS, APP_CODE, APP_THEMES, APP_DATA, APP_GLOBALRESOURCES, APP_LOCALRESOURCES, APP_WEBREFERENCES, APP_BROWSERS, WEB.CONFIG |
| Azure and developer names | AZURE, BIZSPARK, BIZTALK, DIRECTX, DOTNET, HYPERV, VISUALSTUDIO, MSDN |
| Microsoft products and brands | BING, CORTANA, DYNAMICS, EXCEL, EXCHANGE, FOREFRONT, GROOVE, HOLOLENS, KINECT, LYNC, O365, OFFICE, OFFICE365, ONEDRIVE, ONENOTE, OUTLOOK, POWERPOINT, SHAREPOINT, SKYPE, VISIO, XBOX |

The grouping is mine, for readability. The page gives one flat list.

### Whole word or substring

MICROSOFT and WINDOWS cannot be used as either a whole word or a substring in the name. So `windowsapp`, `mywindows1` and `microsoft-test` all fail by the page's rule.

### Not at the start

LOGIN cannot be used at the start of a resource name, but can be used later in the name.

## Fix

Provide a name that does not use one of the reserved words. That is the whole solution on the page.

In an ARM template or Bicep file, the name often comes from parameters and variables, so the word can hide in a prefix. Work through this list:

1. Copy the name from the error message. It shows the resource name that failed.
2. Find which `name` property in the template produced it, and which parameters, variables or functions feed it.
3. Replace the part that contains the word. If a standard prefix such as the team or product name contains one of the words, change the prefix for all resources that have an endpoint.
4. Redeploy.

## Related naming facts

From the naming rules and restrictions page:

- Resource and resource group names are case-insensitive unless the Valid Characters column says otherwise. APIs can return a different casing than you set, so always compare names case-insensitively.
- Do not use `#` in a resource name, because it interferes with URL parsing in Azure Resource Manager requests.
- Each resource type has its own length and character rules. Web apps (`Microsoft.Web/sites`) are listed with 2 to 60 characters, alphanumerics, hyphens and Unicode characters that can be mapped to Punycode, not starting or ending with a hyphen. Check the row for your resource type before you pick a naming pattern.

## Prevent it (my advice)

This is my suggestion, not a Microsoft procedure:

1. Keep a naming convention that avoids the listed words from the start. Put the word list into your review checklist for template changes.
2. Add a simple check in your pipeline that compares generated names against the list, ignoring case, before deployment.
3. Remember that the error text includes "a part of the name", so test the built name and not only the parameter value.
4. If a company or product name contains one of the words, use an abbreviation in resource names, and keep the full name in tags.

## Related

- [ARM template](https://www.m365.fm/entity/arm-template/)
- [Bicep](https://www.m365.fm/entity/bicep/)
- [Azure Resource Manager](https://www.m365.fm/entity/azure-resource-manager/)

## Sources

- [Reserved resource name errors (Microsoft Learn)](https://learn.microsoft.com/azure/azure-resource-manager/troubleshooting/error-reserved-resource-name)
- [Naming rules and restrictions for Azure resources (Microsoft Learn)](https://learn.microsoft.com/azure/azure-resource-manager/management/resource-name-rules)
