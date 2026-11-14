---
title: "Enable Managed Environments in Power Platform and What Changes for Makers"
summary: "How to enable Managed Environments in the Power Platform admin center: required roles, licensing statement, the features it unlocks, the 15 December 2026 developer environment deadline, and how to disable it."
status: review
publish: false
author: mirko-p
date: 2026-12-22
topics: [power-platform-admin-center, power-platform-environment]
keypoints:
  - "Enable it under Manage > Environments: select the ellipsis for the environment, then Enable Managed Environments, configure settings and select Enable."
  - "You need the Power Platform Administrator or Dynamics 365 Administrator role. Environment Admin and Delegated Admin cannot change the managed environments property."
  - "Learn says unmanaged developer environments are deprecated. Enable Managed Environments on an existing developer environment before December 15, 2026 to keep it."
  - "Managed Environments are included as an entitlement with standalone Power Apps, Power Automate, Copilot Studio, Power Pages and Dynamics 365 licenses."
  - "Disabling is done with PowerShell, and Learn says to make sure none of the capabilities are in use first."
faq:
  - q: "Who can enable Managed Environments?"
    a: "Microsoft Learn says you need the Power Platform Administrator or Dynamics 365 Administrator role in Microsoft Entra ID. Users with the Delegated Admin role or the Environment Admin security role cannot change the managed environments property."
  - q: "Does Managed Environments need a separate license?"
    a: "Learn says it is included as an entitlement with standalone Power Apps, Power Automate, Microsoft Copilot Studio, Power Pages and Dynamics 365 licenses. It is not included as an entitlement in the Developer Plan when users run their assets."
  - q: "What happens to developer environments?"
    a: "Learn says unmanaged developer environments are deprecated, and that to keep an existing developer environment you must enable Managed Environments on it before December 15, 2026."
  - q: "What changes for makers?"
    a: "The overview page I read does not describe maker-facing changes in detail. It lists features such as limit sharing, maker welcome content, solution checker and data policies, which are the areas makers may notice, so check each feature page."
  - q: "Can I turn Managed Environments off?"
    a: "Yes, with PowerShell. Learn gives a script that sets the protection level to Basic and says to make sure none of the managed environments capabilities are in use first. The admin center steps on the page cover enabling and editing only."
---

Managed Environments is a set of premium governance features for Power Platform. Turning it on is simple. The decisions are about licensing, roles and which features you configure. There is also a dated change: unmanaged developer environments are deprecated, with a deadline in December 2026. This guide covers the steps and the facts Microsoft Learn states.

## What it is

Learn describes managed environments as a suite of premium capabilities that let admins manage Power Platform at scale, with more control, less effort and more insights. They can be used with any type of environment, and once an environment is managed it unlocks more features across the platform.

## Licensing

Managed environments are included as an entitlement with standalone Power Apps, Power Automate, Microsoft Copilot Studio, Power Pages and Dynamics 365 licenses. Trial licenses can license users in managed environments, with the restrictions of those licenses. They are not included as an entitlement in the Developer Plan when users run their assets.

## Deadline for developer environments

Learn says unmanaged developer environments are deprecated. To keep an existing developer environment, enable Managed Environments on it before **December 15, 2026**. Check your developer environments in the admin center now.

## Roles and prerequisites

- To enable or edit, you need the **Power Platform Administrator** or **Dynamics 365 Administrator** role in Microsoft Entra ID.
- Users with the Delegated Admin role or the Environment Admin security role can't change the managed environments property.
- Any user who can view environment details can see the property.
- The managed environments property must be the same in the source and destination before copy and restore lifecycle operations.
- Dataverse is required to use managed environments for production, sandbox or trial environments. Developer environments do not require Dataverse.

## Enable it in the admin center

1. Sign in to the Power Platform admin center.
2. Select **Manage**, then **Environments**.
3. Select the ellipsis next to an environment and choose **Enable Managed Environments**. If it is already managed, choose **Edit Managed Environments**.
4. Configure the settings and select **Enable** or **Save**.

## Enable with PowerShell

Learn gives a script that builds a governance configuration with `protectionLevel = "Standard"` and applies it with `Set-AdminPowerAppEnvironmentGovernanceConfiguration`:

```powershell
$GovernanceConfiguration = [pscustomobject] @{
    protectionLevel = "Standard"
    settings = [pscustomobject]@{ extendedSettings = @{} }
}
Set-AdminPowerAppEnvironmentGovernanceConfiguration -EnvironmentName <EnvironmentID> -UpdatedGovernanceConfiguration $GovernanceConfiguration
```

To copy settings from one managed environment to another, read the source environment's governance configuration and apply it to the target. Learn says that if the target is not managed, copying the settings also enables it.

## Features it unlocks

The overview says the list is not exhaustive. It names, among others:

- Environment groups
- Limit sharing
- Weekly usage insights
- Data policies and data policies for desktop flow
- Pipelines in Power Platform
- Maker welcome content
- Solution checker
- IP Firewall and IP cookie binding
- Customer Managed Key and Lockbox
- Extended backup
- Export data to Azure Application Insights
- Default environment routing
- Virtual Network support for Power Platform
- Conditional access on individual apps
- Control which apps are allowed in your environment
- Masking rules

## What changes for makers

The overview does not say what makers see. It only lists the features, and several of them touch makers directly: sharing limits, a welcome message, solution checks, and pipelines for deployment. Learn links to separate pages for limit sharing and usage insights, which I did not read. Before enabling, read the pages for the features you plan to configure and tell makers what is changing.

## Disable Managed Environments

Disabling is done through PowerShell, with `protectionLevel = "Basic"`. Learn says to make sure none of the managed environments capabilities are in use before you disable it. The page does not describe other effects of disabling.

## Rollout checklist

1. List all environments and note which are developer environments.
2. Confirm that someone with the Power Platform Administrator or Dynamics 365 Administrator role does the change.
3. Check licensing for the people who use each environment.
4. Enable it on developer environments before December 15, 2026 if you want to keep them.
5. Configure settings, then document them so the source and destination match for copy and restore.
6. Tell makers about any sharing limits or checks you turn on.

## Related

- [Power Platform admin center](https://www.m365.fm/entity/power-platform-admin-center/)
- [Power Platform environment](https://www.m365.fm/entity/power-platform-environment/)

## Sources

- [Managed Environments overview](https://learn.microsoft.com/power-platform/admin/managed-environment-overview)
- [Enable Managed Environments](https://learn.microsoft.com/power-platform/admin/managed-environment-enable)
