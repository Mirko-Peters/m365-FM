---
title: "Solution Baselines in Nerdio Manager for MSP: standard configuration at scale"
summary: "A solution baseline in Nerdio Manager for MSP is a configuration defined once at MSP level and assigned to many customer accounts, covering Microsoft 365 services such as Entra ID, Intune, Exchange Online and Teams."
status: review
publish: false
author: mirko-p
date: 2026-11-18
render: v2
topics: [nerdio-solution-baselines, nerdio-manager-for-msp]
keypoints:
  - "A solution baseline is defined at MSP level under Solution Baselines and assigned to customer accounts. Changes flow to every assigned account instead of tenant-by-tenant edits."
  - "Nerdio covers Defender for Endpoint and Office 365, Entra ID, Exchange Online, Intune, SharePoint and OneDrive, Teams and Purview. Each baseline's Prerequisites action must show Passed."
  - "Settings can be Enforce, Report-only or Exclude. Nerdio advises assigning in Report-only first and switching to Enforce after checking results against customer requirements."
  - "The settings Nerdio ships are suggestions, not a mandate. Nerdio tells MSPs to review them with their security and operations teams and to clone a baseline before changing it."
  - "Nerdio documents solution baselines separately from Intune policy baselines, though assignments can pass between them as Inherited. Microsoft 365 Lighthouse is a different tool."
faq:
  - q: "What is the difference between a solution baseline and an Intune policy baseline in Nerdio Manager?"
    a: "A solution baseline configures a Microsoft 365 service such as Entra ID, Exchange Online or Teams through a wizard of settings (Solution Baselines at the MSP level). An Intune policy baseline groups existing Intune policies under a desired state. Nerdio's help pages name two menu paths for it, Baselines > Policy Baselines and Policy management > Policy baselines, so use the one your console shows. Nerdio documents the two kinds of baseline on separate help pages."
  - q: "What do I need before I can use solution baselines?"
    a: "Nerdio lists at least one Intune license in the MSP account, Super Admin permissions in Nerdio Manager, and Microsoft 365 enabled in each customer account. Each baseline also has its own license, feature and permission requirements, which the Prerequisites action checks per account."
  - q: "Can I test a baseline without changing a customer tenant?"
    a: "Yes, Nerdio describes assigning the baseline with Mode set to Report-only, which evaluates it without enforcing it. Leave the option to process the baseline after saving cleared, because that option applies the baseline to assigned accounts immediately."
---

A solution baseline in [Nerdio Manager for MSP](https://www.m365.fm/entity/nerdio-manager-for-msp/) is a configuration you define once at the MSP level and assign to customer accounts, so the same Microsoft 365 settings apply across tenants and later changes reach every assigned account. [Nerdio Solution Baselines](https://www.m365.fm/entity/nerdio-solution-baselines/) cover services such as Entra ID, Intune, Exchange Online, Teams and Defender, and each setting can be enforced, reported on or left out.

This article explains the concept and the decisions it involves. Step-by-step handling of status and drift is in the companion article on drift monitoring. Menu labels come from Nerdio's help center and can differ between versions.

## What a solution baseline is

Nerdio's help center describes solution baselines as MSP-level definitions that simplify initial deployments and keep policy states consistent across customer accounts. Its getting-started article calls them predefined configurations: once a baseline is assigned, its settings are applied to each linked account, and later changes to the baseline flow to all of them without manual edits per account.

The idea was announced with Nerdio Manager for MSP version 5 on 2 April 2024. Nerdio said then that, starting with Defender for Endpoint policies, MSPs could customize baselines, apply them to all or selected customers and monitor drift from the desired configuration state. In a separate sentence, the announcement says solution baselines can also be configured to auto-remediate configuration drift by forcing the correct setting. The set has grown since; the current help center lists several more services.

Two terms are easy to confuse:

- A **solution baseline** configures a Microsoft 365 service through a wizard with tabs and settings, found under **Solution Baselines** at the MSP level.
- An **Intune policy baseline** groups Intune policies under a desired state. Nerdio's current policy-baselines page opens it with **Baselines > Policy Baselines**, while the older getting-started guide for policy baselines (July 2025) says **Policy management > Policy baselines**; use the path your console shows. Nerdio documents it separately, and the article on managing [Intune](https://www.m365.fm/entity/intune/) for MSP clients with Nerdio covers it. The policy-baselines page also says that account assignments that come from a solution baseline are listed as Inherited, read-only and traceable to their source, so the two overlap in places.

## Which services are covered

Nerdio's baseline-management page lists these baselines, with the requirements each needs per account:

| Baseline | Nerdio's stated requirements |
|---|---|
| [Intune](https://www.m365.fm/entity/intune/) | Intune license, Intune feature, Intune admin consent, Intune permission set |
| [Entra ID](https://www.m365.fm/entity/entra-id/) | Entra license and permission set; no account feature needed |
| [Defender for Endpoint](https://www.m365.fm/entity/microsoft-defender-for-endpoint/) | Defender for Endpoint license, feature and permission set |
| [Defender for Office 365](https://www.m365.fm/entity/defender-for-office-365/) | Defender for Office 365 license, feature and permission set |
| [Exchange Online](https://www.m365.fm/entity/exchange-online/) | Exchange Online license and permission set |
| [SharePoint](https://www.m365.fm/entity/sharepoint/) and [OneDrive](https://www.m365.fm/entity/onedrive/) | SharePoint Online license and permission set |
| [Teams](https://www.m365.fm/entity/teams/) | Teams license and permission set |
| [Purview](https://www.m365.fm/entity/purview/) | Exchange Online license, Purview Management feature, Purview permission set |

Nerdio's getting-started article for Microsoft 365 baselines names six of these (Defender for Endpoint, Entra ID, Exchange Online, Intune, SharePoint and OneDrive, Teams) and does not list Defender for Office 365 or Purview. Release notes say a Purview baseline was added in version 6.8.0 (a preview release of 17 March 2026, with GA in 6.8.1 on 31 March 2026), which may explain part of the gap. The getting-started article also sets three requirements: at least one Intune license in the MSP account, Super Admin permissions in Nerdio Manager, and Microsoft 365 enabled in each customer account. Features are switched per account under **Settings > Integrations** in the Modern Work area; the help article notes that the toggle labels are reversed, so you select Disabled to enable a component.

## Modes: Enforce, Report-only and Exclude

The baseline wizards offer a per-setting selector with three modes. Nerdio's configuration pages for Entra ID, Intune and Defender for Office 365 name them Enforce, Report-only and Exclude, and the recommended-settings article says each wizard includes details for all three modes. Our reading of what they mean, based on Nerdio's wording elsewhere:

- **Enforce** applies the setting.
- **Report-only** evaluates it without applying it.
- **Exclude** leaves it out of the baseline; on the status page, an excluded action is not checked or enforced.

Assignment has its own mode. Nerdio's getting-started article assigns with **Mode** set to **Report-only** first, then switches the same assignment to **Enforce** after testing; Enforce applies the baseline to all assigned accounts. Nerdio's pages do not spell out how a per-setting mode and the assignment mode combine, so confirm the behaviour on one account before rolling out.

Our reading of the options as decisions: Report-only suits settings where customers differ or where you are unsure of the impact. Exclude fits settings that do not apply to your customer base at all. Enforce suits settings you would otherwise reapply by hand in every tenant.

## The Prerequisites action

Every baseline starts with a **Prerequisites** action that replaces the older separate checks for licenses, permissions and services. Per account it shows Passed or Not Passed, and hovering over Not Passed shows what is missing: licenses, roles, permissions or enabled services. If the prerequisites are not met, the baseline's other actions are skipped for that account. In Enforce mode, Nerdio Manager first tries to fix missing prerequisites, for example by enabling a service or granting permissions, before it continues.

The Nerdio Manager documentation on account features adds that, with the granular prerequisite model, disabled features show a checklist of unmet prerequisites, and that permission sets (groups of Microsoft Graph permissions) are requested in the customer tenant when a feature is enabled. Nerdio says the granular model is generally available and the default for new accounts, while accounts created earlier keep the Classic model until you change them; the Least Privilege directory privilege model that can be combined with it is in Public Preview. Nerdio notes that a baseline may need reprocessing after an upgrade before the Prerequisites action appears.

## Starting settings, and why to clone first

Nerdio supplies recommended settings and tells MSPs to review them, adjust them to their organization's requirements and consult their security and operations teams first. Examples from Nerdio's recommended-settings article:

- **Intune:** enrollment limit of five devices per user, 90-day device cleanup, and non-compliance for devices without a compliance policy after seven days. The 90-day period can be changed to match a customer's policy.
- **Entra ID:** a registration campaign for MFA and self-service password reset with a three-day snooze limit.
- **Exchange Online:** SPF, DKIM and DMARC checks in Report-only mode, and a 30-day deleted-items retention.

The Entra ID and Intune wizards also offer a template drop-down. Release notes list CIS Level 1 templates for solution baselines in version 6.7.0 (a preview release of 3 February 2026, with GA in 6.7.1 on 11 February 2026), and version 6.8.0 (a preview release of 17 March 2026, with GA in 6.8.1) corrected CIS templates that had set some settings to Enforce where CIS recommends monitoring.

Clone before editing. A clone gives a clean starting point and lets you keep variants per customer type; only clones can be disabled, enabled or removed. The same recommended-settings article warns that some Enforce settings have side effects: enforcing Nerdio Manager's Modern Work management in Intune enables it for all accounts assigned the baseline. For the Defender for Endpoint setting, Nerdio recommends Report only and gives as its justification that, when enabled, the setting automatically enables Defender for Endpoint at the customer-account level. Nerdio's page does not say how that interacts with the mode, so check on one account first. Some items are marked "coming soon", among them Defender device onboarding, Defender service notifications and Teams voice and messaging.

## A worked example

A fictional MSP supports 14 small customers and wants the same Entra ID sign-in and guest settings everywhere. It clones the Entra ID baseline as "SMB standard" and keeps Nerdio's registration campaign setting. It leaves **Security Defaults** on Exclude, because Nerdio notes that Microsoft does not turn security defaults on in tenants that have Conditional Access policies, which can show up as a Mismatch. It then assigns the clone to three pilot accounts in Report-only mode, reads the status page, and switches those three to Enforce after review. The remaining 11 accounts follow in two batches. Names, counts and batching are illustrative.

## Limits and alternatives

- **Scope.** Nerdio's baseline pages state no numeric limits, such as a maximum number of baselines or accounts, and give no preview or GA label for the baseline feature itself. The release-notes entry for 6.8.0 (a preview release, with GA in 6.8.1) does mention a fix for cancelling long-running operations when a baseline is applied to 100 or more accounts.
- **Tenant Assessment Wizard.** Nerdio's overview presents it as a check to run before baselines are applied, and says it is in Public Preview as of version 7.0. Treat it as optional and check its status before depending on it.
- **Microsoft 365 Lighthouse.** Microsoft's [Lighthouse](https://www.m365.fm/entity/microsoft-365-lighthouse/) overview describes a portal for managing multiple customer tenants, with a default SMB security baseline. It requires enrollment in the Cloud Solution Provider program and carries no additional charge. It is a Microsoft tool, not a Nerdio feature, so the choice depends on which tool your team already uses for [security baselines](https://www.m365.fm/entity/security-baselines/).
- **Customer fit.** Nerdio's recommendations are not mandatory. Customers with Conditional Access, strict retention or regulated data may need Exclude or Report-only on several settings.

## Sources

- [Nerdio help center: Solution Baselines, MSP-level management](https://nmmhelp.getnerdio.com/hc/en-us/articles/25498298095373)
- [Nerdio help center: Get started with Microsoft 365 solution baselines](https://nmmhelp.getnerdio.com/hc/en-us/articles/37958534716941-Get-started-with-Microsoft-365-solution-baselines-in-Nerdio-Manager)
- [Nerdio help center: What Microsoft 365 solution baseline settings are recommended?](https://nmmhelp.getnerdio.com/hc/en-us/articles/35388344800013-What-Microsoft-365-solution-baseline-settings-are-recommended)
- [Nerdio help center: Configure a solution baseline for Entra ID](https://nmmhelp.getnerdio.com/hc/en-us/articles/30575084912269)
- [Nerdio help center: Configure a solution baseline for Intune](https://nmmhelp.getnerdio.com/hc/en-us/articles/29866852207501)
- [Nerdio help center: Configure and assign solution baselines for Defender for Office 365](https://nmmhelp.getnerdio.com/hc/en-us/articles/30575119062669)
- [Nerdio help center: Enable and Disable Modern Work Components](https://nmmhelp.getnerdio.com/hc/en-us/articles/31771004002701)
- [Nerdio help center: Manage customer account-level features and permissions](https://nmmhelp.getnerdio.com/hc/en-us/articles/39828325981709-Manage-customer-account-level-features-and-permissions)
- [Nerdio help center: Intune policy baselines](https://nmmhelp.getnerdio.com/hc/en-us/articles/26125608692493-Intune-Policy-Baselines)
- [Nerdio help center: Get started with Intune policy baselines in Nerdio Manager](https://nmmhelp.getnerdio.com/hc/en-us/articles/35281572387853-Get-started-with-Intune-policy-baselines-in-Nerdio-Manager)
- [Nerdio help center: Tenant Assessment Wizard Overview](https://nmmhelp.getnerdio.com/hc/en-us/articles/47405622370317-Tenant-Assessment-Wizard-Overview)
- [Nerdio help center: NMM Release Notes](https://nmmhelp.getnerdio.com/hc/en-us/articles/360055385832)
- [Nerdio blog: Unveiling Nerdio Manager for Enterprise 6 and Nerdio Manager for MSP 5](https://getnerdio.com/blog/unveiling-nerdio-manager-for-enterprise-6-and-nerdio-manager-for-msp-5/)
- [Microsoft Learn: Microsoft 365 Lighthouse overview](https://learn.microsoft.com/en-us/microsoft-365/lighthouse/m365-lighthouse-overview)
- [Microsoft Learn: Security defaults in Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/fundamentals/security-defaults)
