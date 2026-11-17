---
title: "Nerdio Unified App Catalog explained: one catalog, many delivery methods"
summary: "Nerdio's Unified App Catalog, documented as Unified Application Management (UAM), is one searchable list of apps from several linked repositories, deployed to Azure Virtual Desktop hosts or Intune-enrolled Windows devices once (AVD only) or by policy. This article explains the parts, what each repository type can do, and where Nerdio's own pages set limits."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [nerdio-unified-app-catalog, nerdio-manager-for-enterprise]
keypoints:
  - "The catalog is the search view of Nerdio's Unified Application Management (UAM). It lists apps from linked repositories: the Winget community repository, private Winget repositories, Intune and Shell Apps. SCCM is an import source, not a repository type."
  - "Deployment targets are Azure Virtual Desktop (workspaces, host pools and global pools, which are Premium only and in public preview) and Intune-enrolled Windows devices. A deployment is either a one-time event or a policy that keeps assessing devices."
  - "Winget apps are installed in an administrative context through a service account. Shell Apps run PowerShell detect, install and uninstall scripts in the device system context; Nerdio's overview page still calls the feature a preview, and Nerdio recommends fully testing packages before they are assigned to production desktops."
  - "The AVD and Intune targets differ: maintenance windows, drain mode and one-time deployment apply to AVD only. Intune app import and the Task Worker option are labelled public preview, and the SCCM integration is Premium edition only."
  - "The catalog is not the only way to get apps onto session hosts. Golden images and MSIX app attach stay valid, and Microsoft Learn describes app attach as not installing apps on hosts or images."
faq:
  - q: "Is the Unified App Catalog the same thing as Unified Application Management?"
    a: "In practice yes. Nerdio's help pages and release notes use Unified Application Management (UAM) for the feature and Unified catalog for the page where you search apps. Nerdio's NME 6 announcement and its functional overview use the names Unified App Catalog and Unified Application Catalog for the same idea."
  - q: "Does the catalog only deliver Winget packages?"
    a: "No. Winget is one repository type. The help pages also describe Intune apps, Shell Apps that run PowerShell scripts, and an SCCM integration that imports existing applications into a private Winget repository or into Shell Apps. Which route fits depends on the installer, as the repository table below shows."
  - q: "Can I use the catalog for Windows 365 Cloud PCs?"
    a: "Nerdio's supported-configurations page lists Intune-enrolled Windows devices as a target, including Windows 365 Cloud PCs, physical desktops and laptops. Intune targets have fewer options than AVD targets, because maintenance windows and drain mode are not supported there."
---

The Unified App Catalog is the part of [Nerdio Manager for Enterprise](/entity/nerdio-manager-for-enterprise/) where you search apps across several linked repositories in one list and deploy them, once or by policy, to Azure Virtual Desktop session hosts or Intune-enrolled Windows devices. It does not replace the sources the apps come from. It puts one search view and one deployment entry point in front of them.

This article explains the concept and the decisions behind it. For the Winget route in detail, see our article "Delivering apps with Winget through Nerdio". The SCCM connector and policy settings follow in "Delivering apps with Nerdio: Winget, SCCM connector and policies".

## One feature, several names

You will meet three names for the same feature. Nerdio's help pages call it Unified Application Management (UAM), and the page where you search apps is the Unified catalog under **Applications > Catalog > All Apps**. Nerdio's announcement of Nerdio Manager for Enterprise 6 (2 April 2024) says Unified App Catalog and describes consolidating application delivery "from a single catalog using existing app repositories". Nerdio's functional overview uses Unified Application Catalog. The entity page for the [Nerdio Unified App Catalog](/entity/nerdio-unified-app-catalog/) covers the same feature.

## The original concept

Nerdio's functional overview, published in May 2023 while the feature was in beta, describes two parts: a catalog that lets admins search all linked repositories at once, and deployment policies for ongoing deployment to new and reimaged devices in a policy's scope. It says regular audits assess compliance and a Detailed info page shows the status of each targeted host. Check the current help pages for present behaviour.

## What feeds the catalog

Across the help pages, five kinds of source appear. Their capabilities differ, which is the main reason to know them before you design anything.

| Source | Role in UAM | What the help pages say |
|---|---|---|
| Winget community repository | Read-only repository | Apps can be deployed to supported devices. Installation properties cannot be changed. |
| Private Winget repository | Read/write repository | Created in your Azure subscription. You can import apps, write custom install commands and keep several versions. |
| Intune | Read-only repository | Apps can be deployed from Intune to supported UAM devices. Importing Intune apps into UAM is labelled public preview and covers Win32 and line-of-business apps only. |
| Shell Apps | Repository type | Apps defined by PowerShell scripts for detection, installation and removal, with an optional file. Added under **Applications > Catalog > Shell Apps**. |
| SCCM | Import source only | Existing Configuration Manager applications are imported into a private Winget repository or into Shell Apps. The page says the feature is only available in the Premium edition. |

Private Winget repositories can also be filled from a local desktop or network share, an internet URL, or the Winget community repository, according to the supported-configurations page. The SCCM integration is built around [Microsoft Configuration Manager](/entity/configuration-manager/), which Nerdio documents as a connector that queries SCCM applications and imports them.

## Two kinds of target

A deployment goes to one of two target types, and the options change with the choice.

| | Azure Virtual Desktop | Intune-enrolled Windows devices |
|---|---|---|
| Targets | AVD workspaces, global pools and pool groups (Premium edition; Nerdio's Global Pools Overview page says the feature is in Public Preview), multi-session and single-session [host pools](/entity/avd-host-pool/) | User groups and device groups; includes Windows 365 Cloud PCs, physical desktops and laptops |
| Maintenance window | Supported | Not supported; tasks follow the Intune agent's schedule |
| [Drain mode](/entity/avd-drain-mode/) | Supported | Not supported |
| One-time deployment | Supported | Not supported; policy-based only |
| Winget apps | Installed through the UAM task | Deployed through Intune scripts, so they do not appear on the Intune applications page |
| Status | Policy details page | Policy details page |

Global pools came with the 8.1.0 release notes (21 July 2026, marked [Preview] and Premium-only), and the 8.2.0 notes (17 September 2026) added global pools and their pool groups as options in application deployment policies. For [Microsoft Intune](/entity/intune/) targets, the supported app types for Intune-sourced apps are MSI line-of-business and EXE Win32 apps in the Device/System context, and Nerdio says other types will follow.

## One-time or policy

Every deployment is one of two things. The catalog's **Deploy** action creates a one-time event unless you select **Create policy using this configuration**. A deployment policy under **Applications > Deployment > Deployment Policies** keeps evaluating devices in its scope. Nerdio's supported-configurations and deployment-policy pages give these details for AVD:

- Policy assessment runs on new AVD devices every 15 minutes.
- A device that fails one or more tasks is skipped for 24 hours before the next assessment. **Run now** forces a re-evaluation, and **Ignore current device status** makes failed devices retry.
- If an in-scope desktop is stopped, UAM starts it for the task and returns it to its original state afterwards.

A policy can hold several apps, and Nerdio advises against mixing install and uninstall actions in one policy. Nerdio also says that if another tool adds or removes an app, the UAM console will not reflect it.

## How an app actually gets installed

The delivery mechanism depends on the source.

**Winget apps** run in an administrative user context, so UAM needs a service account. Nerdio's service-account page says the default is a local account that Nerdio Manager creates during deployment. From Nerdio Manager 6.5, the account is enabled for the task, given a randomly generated 30-character password that is unique per desktop, added to the local Administrators group, and then disabled, removed from the group and given a new password afterwards. An Active Directory service account is an option that the page calls rarely needed and hides behind the feature flag `Features:UamServiceAccounts`.

**Shell Apps** run your scripts. The help page lists detect, install and uninstall scripts, an optional file that can be unzipped, and a **Public** switch. A public Shell App cannot be moved back to Hidden while a policy assignment exists, and Nerdio recommends testing packages fully before assigning them to production desktops. The same page lets you flag a Shell App version as Preview. Such a version is not seen as "latest" by any UAM policy and is applied to in-scope pools only when selected explicitly. That flag is separate from the product's status: Nerdio's Shell Apps overview page still describes Shell Apps as "a preview feature" and lists secure variable support and SCCM integration (ingesting scripted installations with their binaries) as not currently available. Other Nerdio pages disagree on both points. The SCCM integration page describes importing scripted applications into Shell Apps. The pages "UAM: Shell apps secure variables" and "UAM: Shell apps technical reference guide" document secure variables for Shell Apps; the reference guide says this applies starting with Nerdio Manager v6.1 and that secure variables are not supported for Intune devices and cause a deployment error. The overview's own limitations section also mentions secure variables. Check these pages before you rely on either feature in production.

**Intune apps** are assigned through Intune. The manage-applications page lists an assignment type of Required (default) or Available for Intune targets, with Available limited to Win32 apps. The 8.2.0 public preview release notes introduced Available.

## Where the catalog is not the tool

Nerdio's own content treats the catalog as one of several strategies. A Nerdio Office Hours session description from September 2025 lists UAM with public and private repositories, MSIX app attach, Shell Apps and scripted actions, installation into the golden image or on session hosts, and app masking as separate topics. Two alternatives matter most for AVD admins.

| Method | Where the app lives | Note |
|---|---|---|
| Catalog deployment (UAM) | Installed on the session host or device by a task | Policy keeps assessing the scope; you need a silent install |
| [Golden image](/entity/golden-image/) | Installed in the image | See [Nerdio desktop image management](/entity/nerdio-desktop-image/) for the image workflow |
| [MSIX app attach](/entity/msix-app-attach/) | Mounted from an SMB file share at sign-in | Learn says apps are not installed locally on session hosts or images, and that apps can be assigned per user |

These methods are not exclusive. Our reading, not a Nerdio or Microsoft rule: the catalog suits apps that must be installed on the host and that change often enough to justify a policy, while an image suits the common base set. Test with a pilot host pool before you decide.

## Limits to check before you start

- **Silent installs.** Apps without a fully silent install or removal fail. Nerdio suggests testing with `winget [install/remove] --id [Application.ID] --silent` and contacting the vendor if no silent operation exists.
- **Scope.** Only Machine scope can be deployed. User-scope packages can be imported, but the console disables deployment of them.
- **Preview features.** Intune app import and the **Use Task Worker** option are labelled public preview. Task Worker applies to non-Intune applications, and during the preview UAM picks only the first 1,000 devices.
- **Shell Apps.** They run only in the device system context, so they need no service account, but PowerShell remoting (WSMan) must be enabled on the target devices. Nerdio's overview says a Shell App with secure variables cannot be assigned to Intune devices, and the reference guide says secure variables are not supported there. Our reading: a Shell App that uses secure variables fits AVD targets only, and the pages disagree on whether the feature is available at all (see above).
- **Scale.** Nerdio's 8.2.2 release notes (8 October 2026) fix a SQL timeout that stopped deployment policies from deploying to more than 2,000 session hosts. As of 17 November 2026 the release notes list 8.2.3 (13 November 2026) as the current release.
- **Edition.** The SCCM integration is Premium only, per Nerdio's help page.
- **Changes outside UAM.** Apps added or removed by another tool are not reflected in the policy console, so decide which tool owns which apps.

## Sources

- [UAM: Supported configurations](https://nmehelp.getnerdio.com/hc/en-us/articles/26124323091981-UAM-Supported-configurations)
- [UAM: Manage deployment policies](https://nmehelp.getnerdio.com/hc/en-us/articles/26124385135245)
- [UAM: Manage applications](https://nmehelp.getnerdio.com/hc/en-us/articles/25499402166285)
- [UAM: SCCM integration](https://nmehelp.getnerdio.com/hc/en-us/articles/26124368428045)
- [UAM: Manage shell apps](https://nmehelp.getnerdio.com/hc/en-us/articles/25499415545997)
- [UAM: Import Intune applications](https://nmehelp.getnerdio.com/hc/en-us/articles/29088970914701)
- [UAM: Service accounts](https://nmehelp.getnerdio.com/hc/en-us/articles/26124340699021)
- [UAM: Shell apps overview and usage](https://nmehelp.getnerdio.com/hc/en-us/articles/25499430784909-UAM-Shell-apps-overview-and-usage)
- [UAM: Shell apps secure variables](https://nmehelp.getnerdio.com/hc/en-us/articles/26733998315277-UAM-Shell-apps-secure-variables)
- [UAM: Shell apps technical reference guide](https://nmehelp.getnerdio.com/hc/en-us/articles/32612189461261-UAM-Shell-apps-technical-reference-guide)
- [Global Pools Overview](https://nmehelp.getnerdio.com/hc/en-us/articles/47890093534477-Global-Pools-Overview)
- [Nerdio Manager for Enterprise release notes](https://nmehelp.getnerdio.com/hc/en-us/articles/19837802929677-Release-Notes)
- [Office Hours: September 2025 - Application management strategies in Nerdio Manager](https://nmehelp.getnerdio.com/hc/en-us/articles/39603020930317-Office-Hours-September-2025-Application-management-strategies-in-Nerdio-Manager)
- [Unveiling Nerdio Manager for Enterprise 6 and Nerdio Manager for MSP 5 (Nerdio, 2 April 2024)](https://getnerdio.com/blog/unveiling-nerdio-manager-for-enterprise-6-and-nerdio-manager-for-msp-5/)
- [UAM NME functional overview (Nerdio, May 2023)](https://getnerdio.com/blog/uam-nme-functional-overview/)
- [App attach overview for Azure Virtual Desktop (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/virtual-desktop/app-attach-overview)
