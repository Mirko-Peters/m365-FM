---
title: "FSLogix App Masking: showing the right apps to the right users"
summary: "FSLogix App Masking lets one shared image hold many applications and hides the ones a user or group should not see. Rule files and assignment files, created in the FSLogix Rules Editor and copied to each session host, decide what is hidden and for whom."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [fslogix-app-masking, fslogix]
keypoints:
  - "App Masking uses hiding rules in Rule Sets that hide files, folders, registry items, printers or fonts from a user or group, so an app can stay in the image but not appear for some users."
  - "A Rule Set is two files, .fxr rules and .fxa assignments. Copied to C:\\Program Files\\FSLogix\\Apps\\Rules on a host, they are used immediately by the FSLogix Apps Services."
  - "Assignments can target users, groups, processes, network locations, computers, directory containers and environment variables. New rules start with Everyone assigned and Applies set to No."
  - "Assignments do not support Microsoft Entra ID cloud-only accounts. Users and groups must be synced from Active Directory, and the VMs need line of sight to a domain controller to resolve SIDs."
  - "Nerdio Manager can discover apps on a host pool, build rule sets and push them. Its help says App Masking is not supported in AAD joined (now Microsoft Entra joined) host pools."
faq:
  - q: "Does App Masking remove an application from the image?"
    a: "No. Hiding rules hide specified items, such as an application's files, folders and registry entries, from the users or groups the assignment names. The application itself stays installed on the session host."
  - q: "Do I need a special license for App Masking?"
    a: "Learn's FSLogix prerequisites page lists licenses that make you eligible for FSLogix and names no separate license for App Masking: Microsoft 365 E3/E5, A3/A5 and Student Use Benefits, F1/F3 and Business, Windows 10 Enterprise E3/E5, Windows 10 Education A3/A5, an RDS CAL or SAL, or an Azure Virtual Desktop per-user access license."
  - q: "Can I assign a Rule Set to Entra ID cloud-only users?"
    a: "Not directly. Learn says Rule Set assignments don't support Microsoft Entra ID cloud-only accounts, and that users and groups must be synced from an Active Directory domain controller, with the VMs able to reach a domain controller to resolve SIDs."
---

FSLogix App Masking hides applications and other items from selected users or groups on a session host, so one shared image can serve several user populations. The app stays installed; the Rule Sets you deploy decide who can see and open it. This article explains what App Masking is, how its rules and assignments work, what it needs, and where it stops. The step-by-step build is in the companion article on the Rules Editor.

## What App Masking does

App Masking works through Rule Sets. You describe the item in the FSLogix Rules Editor, assign the Rule Set to users or groups, and the FSLogix Apps Services process the resulting files on the session host. Learn describes a hiding rule as one that hides specific items from a user or group of users. See also the entity page for [FSLogix App Masking](https://www.m365.fm/entity/fslogix-app-masking/).

A pooled image tends to collect applications for several departments. Nerdio's MSP blog (published 23 May 2023) says a shared AVD environment can amount to upwards of 80-100 applications, and that a user who launches an app they should not have could trigger a license issue or take a license out of the available pool. Treat this as the vendor's framing for MSPs, not a benchmark. Our reading: the alternatives are separate images or host pools per group, or delivering apps with [App Attach](https://www.m365.fm/entity/msix-app-attach/), which Learn describes as dynamically attaching applications from an application package to a user session, without installing them on session hosts or images. Which option takes less effort depends on how many groups and applications you have.

## Rule Sets and rule types

The FSLogix Apps Rules Editor is a standalone application that creates Rule Set files. The FSLogix Apps Services process the files, and Learn says Rule Set files can show, hide, redirect or customize aspects of the registry, file system, applications or printers. Learn lists these rule types:

| Rule type | What it does |
|---|---|
| Hiding | Hides specific items from a user or group: files, folders, registry keys, registry values, printers or fonts |
| Redirection | Redirects non-profile or other specific data into the user's profile container |
| Specify value | Sets a registry value at sign-in for a user or group, most often HKLM values that vary by user |
| App container (VHD) | Retired on 11 February 2025 and no longer supported |

For masking you use hiding rules. Learn suggests keeping each Rule Set to one type of customization, since that is easier to maintain and troubleshoot. When you create a rule from an installed program, the Rules Editor scans the system for the items that belong to the application and adds them as hiding rules. Learn's tutorial uses Google Chrome as the example.

Learn also warns that hiding and redirection rules manipulate the file system at a very fundamental level, so always test and validate Rule Sets before deploying them in production.

## Two files, one folder

A Rule Set is saved as two files: a rule file with the extension `.fxr` and an assignment file with the extension `.fxa`. You copy both to this folder on the session host:

`C:\Program Files\FSLogix\Apps\Rules`

Learn says the FSLogix Apps Services use the files immediately after they are copied. For pooled host pools, put the files in the image or push them with the same tool that updates your hosts, so new session hosts start with the same rules.

## Assignments: who sees what

Assignments say how and to whom a Rule Set applies. Learn lists these assignment types: user, group, process, network location (IP address), computer, directory container (distinguished name) and environment variable (any variable present at sign-in can be used). The companion article on the Rules Editor goes through creating them.

The key reading rule is what **Applies** means. In Learn's tutorial, the Rule Set hides Google Chrome "for specific users", and the assignments show Everyone with Applies **No** and `CONTOSO\Domain Users` with Applies **Yes**. Our reading of those two lines: Applies = Yes means the Rule Set's hiding rules take effect for that user or group, so the app is hidden; Applies = No means they do not. For masking, "apply" means "hide".

Two more behaviors matter for planning. First, a new rule automatically gets the **Everyone** group with **Applies** set to **No**. Second, order matters: Learn says the Rule Set is applied from top to bottom, and you reorder entries with **Move Up** and **Move Down**. Learn's two examples show the effect. With Everyone at the top and `CONTOSO\Domain Users` below it set to apply, the Rule Set applies to Domain Users only. With Everyone at the bottom, the Rule Set does not apply to any user or group. Learn does not state the evaluation logic beyond these figures, so test your own ordering with real accounts before rollout.

You can save assignments and their order with **Save as Template**; the template becomes the default for new Rule Sets on that machine. Learn also notes that Active Directory reporting in the Rules Editor, which showed which user accounts an assignment affects, has been deprecated since 22 August 2023, so verify assignments with test accounts.

### Identity requirement

Learn states that Rule Set assignments don't support Microsoft Entra ID cloud-only accounts. You must sync users and groups from an Active Directory domain controller, and the VMs need line of sight to a domain controller to resolve SIDs. Learn's FSLogix FAQ says the same: application rule sets only work with traditional Active Directory SIDs, and hybrid (synced) identities work as long as the virtual machine has line of sight to a domain controller. For cloud-only users this is a hard limit. If your users are cloud-only, consider another method, such as App Attach or separate host pools.

## What it requires

- **Two places need FSLogix.** The machine where you build the rules needs FSLogix Apps (core product), the Rules Editor and the application you want to mask; Learn's tutorial lists these as prerequisites. Learn describes the editor as intended for administrator workstations, installed from `FSLogixAppsRuleEditorSetup.exe` in the download's `x64 (64-bit)` > `Release` folder. The session hosts need FSLogix too, because the FSLogix Apps Services (`frxsvc`) process the copied Rule Set files.
- **A license that makes you eligible for FSLogix.** Learn lists Microsoft 365 E3/E5, A3/A5, Student Use Benefits, F1/F3 and Business, Windows 10 Enterprise E3/E5, Windows 10 Education A3/A5, an RDS CAL or SAL, and an Azure Virtual Desktop per-user access license.
- **A supported operating system.** Learn lists Windows 10, Windows 11 and Windows Server 2016, 2019, 2022 and 2025 and says the list is not limited to these.

## What App Masking is not

Learn calls these hiding rules and describes them as hiding items from users; it does not describe them as a security control. Our suggestion: if a policy requires that a user cannot run a tool at all, do not rely on masking alone. Add a control built for that purpose and test whether the user can still start the tool. Masking only hides items; it does not install, update or remove the application. Our reading: rules are written against the items the scan found, so a new application version that installs to different paths may need its rules rebuilt. Verify the masking after each image update.

## Nerdio Manager and App Masking

Nerdio's help describes a managed workflow for the same technique. Nerdio Manager discovers installed apps on a host pool, lets you group them into rule sets and applies the rules to hosts. Points from the help article:

- Install the apps on the desktop image and update the session hosts first. Discovery runs when a host pool is created or re-imaged, also every few days according to the help, and can be started manually with **Discover apps**; a new host pool may need up to 48 hours or a manual discovery.
- The path is **Applications > Installed apps**, then add a rule set with a name, an **Enabled** option (only enabled rule sets are applied to hosts), the applications, and a rule type: App Masking, Redirection or App Container. Nerdio says masking hides all components of an application, not only its shortcuts.
- The user fields are easy to read backwards. With **Apply to all users** on (the default), the applications are hidden from everyone except the users listed under **Exclude users and groups**, who still see them. Turn **Apply to all users** off to reveal the field **Apply only the following users and groups**, which limits the hiding to those users or groups. **Exclude local administrators** keeps the rule from applying to the local administrators group. In short, "apply" means "hide" and "exclude" means "stays visible".
- **Save & apply** applies the rule at once to all session hosts; **Save & close** saves it for later application, for example when hosts are created or re-imaged.
- Applying offers three clearing modes: clear all existing FSLogix rule sets on hosts, clear only Nerdio-created ones, or overwrite only the rule sets being applied.
- Rule sets can be exported to JSON or to another host pool and imported again.
- The help states that FSLogix App Masking is currently not supported in AAD joined host pool scenarios (Nerdio's wording; Microsoft now calls this Microsoft Entra joined). This is a different limit from Learn's: Learn restricts by identity source (cloud-only accounts), while Nerdio's help names the join type of the host pool. Check both for your design. See [Nerdio](https://www.m365.fm/entity/nerdio/) for the platform.

The Nerdio page lists App Container among its rule types while Learn says that type was retired in February 2025, so check the Nerdio console before relying on that type.

## When App Masking fits

1. Many users share one image and each group needs a different subset of apps.
2. Users are synced from Active Directory and the VMs can reach a domain controller.
3. You can maintain the rules whenever an application changes.

It fits poorly when users are cloud-only, when masking would be your only control for a sensitive tool, or, in our reading, when two groups differ so much that separate images are easier to reason about.

## Sources

- [Microsoft Learn: Rule Sets and the Rules Editor (concepts)](https://learn.microsoft.com/en-us/fslogix/concepts-fslogix-apps-rule-editor-rule-sets)
- [Microsoft Learn: FSLogix FAQ](https://learn.microsoft.com/en-us/fslogix/overview-faq)
- [Microsoft Learn: App Attach in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/app-attach-overview)
- [Microsoft Learn: Tutorial: Create and implement Rule Sets (Application Masking)](https://learn.microsoft.com/en-us/fslogix/tutorial-application-rule-sets)
- [Microsoft Learn: Install FSLogix](https://learn.microsoft.com/en-us/fslogix/how-to-install-fslogix)
- [Microsoft Learn: FSLogix prerequisites, licensing and requirements](https://learn.microsoft.com/en-us/fslogix/overview-prerequisites)
- [Nerdio: Manage installed applications on host pools](https://nmehelp.getnerdio.com/hc/en-us/articles/25499394422157-Manage-Installed-Applications-on-Host-Pools)
- [Nerdio blog: FSLogix application masking](https://getnerdio.com/blog/fslogix-application-masking/)
