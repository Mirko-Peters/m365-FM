---
title: "What MSPs get from Nerdio Manager for MSP: baselines, apps and Intune"
summary: "Nerdio Manager for MSP groups its day-to-day multi-customer tooling into Intune policy publishing, two kinds of baselines, Unified Application Management and Recovery Services. This guide maps each feature to its prerequisites, status labels and limits, and gives an order for trying them on one test customer."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [nerdio-manager-for-msp, nerdio]
keypoints:
  - "Nerdio Manager for MSP has two baseline types that share a name. Policy baselines group Intune policies. Solution baselines cover areas such as Intune, Entra ID, Defender, Exchange Online, Teams, SharePoint and OneDrive, and Purview, and each starts with a Prerequisites check."
  - "Both baseline types can run in a report-only way before you enforce. Nerdio's getting-started guide validates a policy baseline in Report-only mode first and enforces it afterwards, and drifted settings can be accepted for a set period."
  - "Unified Application Management assigns apps at the MSP level and deploys them at the account level, through policies or, except for Intune devices, one-time deployments. Nerdio documents per-device deployment only, and Intune targets support no maintenance window or drain mode."
  - "Recovery Services creates a restore point once a day after you enable it, and restores policies, policy baselines, FSLogix and RDP profiles, variables, group templates and assignment filters at the MSP level."
  - "Status labels differ by feature and release. Nerdio's release notes show the Purview solution baseline as a preview in v6.8.0 (17 March 2026) and GA in v6.8.1 (31 March), and Records Management support as a preview in v7.1 (17 June) and GA in v7.1.1 (24 June), so read the label in your own version."
faq:
  - q: "What is the difference between a policy baseline and a solution baseline in Nerdio Manager for MSP?"
    a: "A policy baseline is a group of Intune policies that you assign to customer accounts in report-only or enforced mode. A solution baseline is a predefined set of settings for an area such as Entra ID, Exchange Online, Teams or Purview. It runs a Prerequisites action first, and in Enforce mode Nerdio Manager tries to fix missing prerequisites."
  - q: "Does assigning an app in Unified Application Management install it?"
    a: "No. Nerdio's UAM pages say that assigning an app at the MSP level makes it available to customer accounts but does not deploy it to devices. The supported-configurations page says application deployment is achieved either through one-time deployments or through a policy. A deployment policy is created at the account level, with a deployment type and included and excluded groups as targets. Intune devices support policy-based deployment only; one-time deployments are not supported for them."
  - q: "Can I restore a single Intune policy that a customer changed or deleted?"
    a: "Nerdio's documentation points in two directions. The Recovery Services article restores global policies and policy baselines, the MSP-level objects, from a restore point; a partial restore returns individual policies, with soft and clean modes, and all restore actions run at the MSP level. You must first enable the service by creating a restore point with a schedule. The getting-started guide for policy baselines describes automatic daily backups at the customer account level, including policies not managed through Nerdio Manager. Check in your console which restore points exist for the customer. For a managed, assigned policy that drifted in a customer tenant, the advanced-management page describes Fix drift, Rollback to an earlier version and Accept drift."
---

Nerdio Manager for MSP gives a provider four multi-customer tools for day-to-day work: Intune policy publishing, baselines in two forms, Unified Application Management (UAM) for apps, and Recovery Services for restoring policies and related objects. This guide maps what each does, what it needs and where the documentation attaches limits or preview labels. It assumes you know the console's MSP level and account level, and covers [Nerdio Manager for MSP](/entity/nerdio-manager-for-msp/) only.

## The feature map

| Area | What it does | Defined at | Key prerequisite or limit from the docs |
|---|---|---|---|
| Intune policies | Imports, edits and clones policies, publishes them to accounts, tracks versions | MSP level | An account without the Intune feature can show as grayed out in the assignment list |
| Policy baselines | Groups Intune policies and assigns the group to accounts | MSP level | Processed top to bottom; a higher-priority baseline wins, so avoid overlapping baselines |
| Solution baselines | Predefined settings per Microsoft 365 area, with a Prerequisites check | MSP level | License, role, permission and service checks per account |
| UAM | Assigns apps from a catalog and deploys them by policy | Assigned at MSP level, deployed at account level | Per-device deployment only |
| Recovery Services | Daily restore points for policies, profiles and variables | MSP level | Must be enabled with a first restore point |

## Intune policies in short

Nerdio's MSP-level page lists the policy types Nerdio Manager handles: Conditional Access, configuration profiles, MAM policies, Autopilot profiles, enrollment status pages, security baselines, compliance policies, update rings, endpoint security policies and Defender for Office 365 policies. You import them from a source tenant or from a JSON or TXT file. Nerdio checks the source tenant for unimported changes every four hours. A sync type of Manual (the default) or Automatic decides how changes reach customers.

Two points matter when you plan. Microsoft-managed [Conditional Access](/entity/conditional-access/) policies cannot be edited or pushed, only their state and group assignments can change. And policy authoring mostly happens outside Nerdio: its general-management page says global compliance policies, configuration profiles and security policies are created in the Microsoft Intune admin center with an MSP-level tenant, and Nerdio Manager only views them. Within Nerdio you import, edit or clone policies and use the built-in ones.

The advanced-management page describes a drift check. Selecting Status on a policy opens the Configuration Drift window, which compares the customer's policy with the MSP source. Fix drift publishes the MSP version again, Rollback returns to a chosen version, and Accept drift records an accepted difference. For a policy outside a baseline, Fix drift only works when the assignment is Enforced. Nerdio's release notes add that v7.0 (preview, 4 May 2026) brought break-glass account management and customer-level Microsoft-managed Conditional Access policies, and that v7.1 (preview 17 June, GA with v7.1.1 on 24 June 2026) lets Recovery Services restore an item from a restore point whether or not it has changed.

## Two kinds of baseline

The name "baseline" covers two different things in the console.

**Policy baselines** sit under Baselines > Policy Baselines at the MSP level, while the policies they group are under Policies. Nerdio's older getting-started guide names the path Policy management > Policy baselines, so menu names can differ between versions. You add a baseline with a name, description and tags, add Intune policies to it, and assign accounts in Report-only or enforced mode. Nerdio says report-only shows which policies are already in place, which configurations are missing and where policies with the same name have different settings; its guide then enforces the baseline once it is validated. Several baselines can apply to one account. Nerdio's policy-baselines page says they are processed from top to bottom, that enforcement is skipped in lower-priority baselines for a policy a higher-priority baseline has already evaluated or published, and that you should avoid overlapping baselines. You change priority by dragging a baseline in the list. Drift from an intentional customer change can be accepted for 30, 60 or 90 days, or indefinitely, with notes. Cloning a baseline creates variants, for example per customer vertical. Nerdio's getting-started guide describes pre-built CIS Level 1 policy baselines. According to the advanced-management page they must be enabled first at the MSP level under System > System Settings > Integrations, in the Center for Internet Security area, by selecting Disabled next to CIS Intune Policies and then I Agree and Enable.

**[Solution baselines](/entity/nerdio-solution-baselines/)** are predefined and cover eight areas. For each, Nerdio's page lists what an account needs:

- Intune: an Intune license, the Intune feature, admin consent and the Intune permission set.
- Entra ID, Exchange Online, SharePoint and OneDrive, and Teams: the matching license and permission set.
- Defender for Endpoint and Defender for Office 365: license, feature and permission set.
- Purview: an Exchange Online license, the Purview Management feature and the Purview permission set.

Every solution baseline begins with a Prerequisites action showing Passed or Not Passed per account. If it fails, the remaining actions are skipped for that account. In Enforce mode, Nerdio Manager tries to fix the gap, for example by enabling a service or granting permissions. Individual settings then show as Valid, Mismatch (the current setting differs from the configured value), Excluded, Not Assigned or Unavailable. Unavailable has stated causes such as Loading Failed, API Check Error and API Apply Error. Drifted statuses are shown red when a baseline is enforced and amber when it is not. Only cloned baselines can be disabled, enabled or removed.

Release notes show that baseline content follows Microsoft's changes. A Purview baseline arrived in v6.8.0 (preview, 17 March 2026; GA with v6.8.1 on 31 March) and gained Records Management support in v7.1 (preview 17 June, GA with v7.1.1 on 24 June). Version 6.8 deprecated two Entra baseline settings and removed a Teams setting. Version 7.0.2 removed the "All Users" option from the Defender for Office 365 baseline, and v7.1.2 fixed Intune baseline settings that showed as Unavailable after a Graph API change.

## Apps with Unified Application Management

UAM works in two stages. At the MSP level you find an app in the Unified Catalog and assign it to all current and future accounts or to one account; app groups assign several at once. Assigning makes it available but does not deploy it. At the account level you deploy through a one-time deployment or a deployment policy; for Intune devices only a policy is supported. A deployment policy has a General tab (name), a Targets tab (deployment type, included and excluded groups) and an Applications tab (apps and versions, where "Latest" keeps software current).

What Nerdio's pages document:

- Repositories: the Winget community repository, Microsoft Store and an iOS store are built in, and the supported-configurations page also lists an Intune repository. You can add MSP-level or account-level repositories. A new private repository reuses the existing App Service Plan, and one in another region adds a plan that Nerdio says incurs additional cost.
- Formats: .exe, .msi and .msix, plus ZIP files holding a single installer. The Intune repository type supports only MSI (Line of Business) and EXE (Win32) apps in the device context.
- Targets: AVD hosts and host pools, Intune-enrolled Windows devices, Windows 365 Cloud PCs and physical devices.
- Behaviour: policies can use a maintenance window, which Nerdio recommends. A device that fails a policy task is skipped for re-assessment for 24 hours.
- Limits: per-device deployment only. For Intune targets there is no maintenance window or drain mode and no one-time deployment, and Winget apps are deployed as Intune scripts, so they do not appear on the Intune applications page.
- Shell Apps: PowerShell packages with Detection, Install and Uninstall scripts for large or complex apps. They need PowerShell remoting (WSMan) on the target.

Nerdio's announcement of NMM 5.0 labelled UAM generally available, and the supported-configurations page describes GA for that version. Nerdio's support scope page lists UAM as supported but excludes Winget package capture, custom scripted-action troubleshooting and OS-level application problems.

## Recovery Services

Recovery Services takes a restore point once a day automatically after you enable it. Enabling requires you to create a first restore point manually, with a schedule, and you set retention in days per restore point. It covers global policies, policy baselines, FSLogix profiles, RDP profiles, variables, group templates and assignment filters. A full restore returns selected categories. A partial restore returns individual policies or baselines, and for policies you can choose assignments, versions or tags. Soft mode keeps new data; clean mode erases it. Restore as Copy creates a copy of a policy without overwriting the existing one and without its assignments. Nerdio's pages differ on scope and retention. The Recovery Services article lists only global objects, says all restore actions run at the MSP level and sets Retention in days on each manual restore point. The getting-started guide for policy baselines (July 2025) instead describes daily automatic backups at the customer account level, kept for 30 days and covering policies that Nerdio Manager does not actively manage. We could not reconcile the two from the documentation, so check which restore points and retention your console shows.

## A rollout order for one test customer

The order is ours. The individual actions come from Nerdio's pages.

1. Pick a test account with the licenses a baseline needs. Check that its Intune feature is enabled, since an account without it can show as grayed out in the assignment list.
2. Assign one solution baseline without selecting Enforce, and read the Prerequisites result and each setting's status.
3. Create a small policy baseline under Baselines > Policy Baselines and assign it in Report-only mode. Check the same-name-different-settings results.
4. Switch the assignment to enforced for that account and confirm the policies reach the intended users or devices.
5. Assign one app at the MSP level, create an account-level deployment policy and check its first run. A maintenance window is optional for AVD targets; Nerdio says Intune devices do not support one.
6. Under Shared Settings > Microsoft 365 > Recovery Services, enable the service with a first restore point. Change a test policy, then run a partial restore.
7. Decide your drift rule: fix drift by default, and accept drift only with an expiry date and a note.

## Where Microsoft 365 Lighthouse fits

[Microsoft 365 Lighthouse](/entity/microsoft-365-lighthouse/) offers a default SMB security baseline and multi-tenant insights on device compliance, with tools to compare policies, at no additional cost. Learn limits it to CSP partners and to customer tenants with up to 2,500 licensed users in the partner's geographic region (Americas, European Union, or Asia plus Australia); other tenants get only a limited set of experiences. Nerdio's own baselines, drift tracking and Recovery Services are described in the sections above, and the Nerdio Manager for MSP explainer covers the overlap.

## Sources

- [Nerdio help center: Intune policy baselines](https://nmmhelp.getnerdio.com/hc/en-us/articles/26125608692493-Intune-Policy-baselines)
- [Nerdio help center: Get started with Intune policy baselines in Nerdio Manager](https://nmmhelp.getnerdio.com/hc/en-us/articles/35281572387853-Get-started-with-Intune-policy-baselines-in-Nerdio-Manager)
- [Nerdio help center: Solution Baselines, MSP-level management](https://nmmhelp.getnerdio.com/hc/en-us/articles/25498298095373)
- [Nerdio help center: Intune policy, MSP level general management](https://nmmhelp.getnerdio.com/hc/en-us/articles/26125624563085)
- [Nerdio help center: Intune policy, MSP-level advanced management](https://nmmhelp.getnerdio.com/hc/en-us/articles/26125615807629-Intune-Policy-MSP-level-Advanced-Management)
- [Nerdio help center: Get started with Unified Application Management](https://nmmhelp.getnerdio.com/hc/en-us/articles/35395876385933-Get-started-with-Unified-Application-Management-UAM-in-Nerdio-Manager)
- [Nerdio help center: Unified Application Management, Supported Configurations](https://nmmhelp.getnerdio.com/hc/en-us/articles/32816509080845-Unified-Application-Management-Supported-Configurations)
- [Nerdio help center: Unified Application Management, Configure Repositories](https://nmmhelp.getnerdio.com/hc/en-us/articles/26125608840333-Unified-Application-Management-Configure-Repositories)
- [Nerdio help center: Unified Application Management, Shell Apps Overview and Usage](https://nmmhelp.getnerdio.com/hc/en-us/articles/29488401830669-Unified-Application-Management-Shell-Apps-Overview-and-Usage)
- [Nerdio help center: Overview of Intune policies Recovery Services](https://nmmhelp.getnerdio.com/hc/en-us/articles/26734483498637)
- [Nerdio help center: Nerdio Manager for MSP Support Scope and Partner Responsibility](https://nmmhelp.getnerdio.com/hc/en-us/articles/4420813129101-Nerdio-Manager-for-MSP-Support-Scope-and-Partner-Responsibility)
- [Nerdio help center: NMM release notes](https://nmmhelp.getnerdio.com/hc/en-us/articles/360055385832)
- [Nerdio blog: Unveiling Nerdio Manager for Enterprise 6 and Nerdio Manager for MSP 5 (2 April 2024)](https://getnerdio.com/blog/unveiling-nerdio-manager-for-enterprise-6-and-nerdio-manager-for-msp-5/)
- [Microsoft Learn: Microsoft 365 Lighthouse overview](https://learn.microsoft.com/en-us/microsoft-365/lighthouse/m365-lighthouse-overview)
- [Microsoft Learn: Requirements for Microsoft 365 Lighthouse](https://learn.microsoft.com/en-us/microsoft-365/lighthouse/m365-lighthouse-requirements)
