---
title: "Custom RBAC roles in Nerdio Manager for Enterprise"
summary: "Nerdio Manager for Enterprise has five built-in roles and lets you define custom roles from a list of modules and access modes, under System > RBAC > Definitions. This guide compares built-in and custom roles, shows three example designs, and explains how Entra ID, cumulative RBAC and Azure RBAC fit in."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [nerdio-manager-for-enterprise]
keypoints:
  - "Nerdio Manager for Enterprise has five built-in roles (AVD Admin, Desktop Admin, Help Desk, Reviewer, End User). Only AVD Admins can manage users and roles. A custom role is defined under System > RBAC > Definitions by choosing modules and access modes such as Read Only or Manage."
  - "Custom roles do not exist in Entra ID. Nerdio Manager assigns the built-in End User role on its enterprise application and enforces the custom role's permissions at sign-in, so the End User assignment must exist before the custom role works."
  - "Since v6.4, cumulative RBAC combines permissions from several custom role assignments and is the default for new installations. Built-in roles are excluded, nested groups are ignored, and Nerdio documents a maximum of 10 assignments."
  - "Nerdio roles control what a person can do inside Nerdio Manager. Azure RBAC roles, such as the Desktop Virtualization roles, control what an identity can do on Azure resources. They are separate layers and need separate design."
  - "Nerdio's release notes label v8.0, v8.1.0 and v8.2.0 as public preview builds, each followed by GA builds (latest v8.2.3 GA, 13 November 2026). Individual entries such as least-privilege custom Azure role support (v8.1.0) carry their own preview label. Check the release notes for the version you run."
faq:
  - q: "Can I scope a custom role in Nerdio Manager to certain workspaces or host pools?"
    a: "By workspace, yes, according to Nerdio's documentation. Its multiple group assignments page describes assigning groups to a workspace with a custom role, and the assignment dialog under System > RBAC > Assignments has Workspace, Images and Host Pools fields, each labelled for the matching role type. The custom roles page describes the Workspaces sub-permissions, such as manage hosts, sessions, power state and drain mode, as applying within assigned host pools. The documentation does not say whether the Images and Host Pools fields work the same way for custom roles, so test the result with a non-admin account before you roll a role out."
  - q: "Why does a new custom role not work for the person I assigned it to?"
    a: "Nerdio documents one common cause. Custom roles do not exist in Entra ID, so Nerdio Manager assigns the built-in End User role on its enterprise application. If the app registration lacks the Application.ReadWrite.All and AppRoleAssignment.ReadWrite.All permissions, that assignment does not happen automatically, and you must assign End User to the user manually in Enterprise applications > Users and groups. Nerdio describes this step for users only, so test the group case first."
  - q: "Do Nerdio roles replace Azure RBAC for my administrators?"
    a: "No. Nerdio's roles govern what people can do in Nerdio Manager. Azure RBAC roles, built-in or custom, govern access to Azure resources and are managed in Azure. Treat them as two layers and review both."
---

Custom roles in [Nerdio Manager for Enterprise](/entity/nerdio-manager-for-enterprise/) let you give each admin group exactly the modules and access modes it needs, instead of choosing between the five built-in roles. You create them under **System > RBAC > Definitions**, assign them to users or security groups, and Nerdio Manager enforces them at sign-in. This guide compares the built-in and custom options, walks through three example designs, and covers the points where role design usually goes wrong: Entra ID, role combining and Azure RBAC.

Module names depend on your Nerdio Manager version, so compare labels with your console.

## What Nerdio roles control, and what they do not

Nerdio's RBAC page says its purpose is to control who can sign in to Nerdio Manager and what they can do after signing in. That is a different layer from [Azure RBAC](/entity/azure-rbac/), which controls access to Azure resources, and from the Azure Virtual Desktop roles Microsoft documents on Learn.

| Layer | What it decides | Where you manage it |
|---|---|---|
| Nerdio Manager roles | Which Nerdio Manager areas a person sees and changes | System > RBAC in Nerdio Manager |
| Azure RBAC (including Desktop Virtualization roles) | Access to Azure and AVD resources for an identity | Azure portal, scopes such as resource group or host pool |
| Entra ID enterprise application | Who may sign in to the Nerdio Manager application | Microsoft Entra admin center |

Nerdio's page on Azure permissions adds that, after installation, no Azure user permissions are required to manage the configured AVD environment in Nerdio and that most actions run on behalf of the signed-in user. Nerdio's security FAQ states that the Global Administrator role is needed only once, at the end of installation, and that day-to-day management relies on Nerdio's built-in RBAC roles and on Azure RBAC where applicable.

## The built-in roles first

Nerdio documents five built-in roles. Check whether one already fits, because a custom role must be maintained.

| Role | What Nerdio says it can do |
|---|---|
| AVD Admin | Full access to all areas. Only AVD Admins can manage users and roles |
| Desktop Admin | Full access to user sessions, Desktop Images and Scripted Actions. Can view host pools and power session hosts on, off or restart them. Cannot add or remove hosts or change host pool settings |
| Help Desk | Manage user sessions only |
| Reviewer | View-only access to all areas |
| End User | View and manage their own sessions; personal desktop users can also restart, power off and power on their desktop |

Built-in role assignments are made under **System > RBAC > Assignments** with **New Assignment**. The dialog asks for the role, the users or groups, one or more AVD tenants, and, depending on the role, a workspace, images or host pools. Changes are logged as a task.

## What a custom role can contain

A custom role is a named set of modules, each with an access mode. Most modules offer **Read Only** or **Manage**; a few add finer permissions. According to Nerdio's custom roles page, the modules are:

- **Observability:** Insights, and Advisor's Modeler, Recommendations and Rules.
- **AVD & Sessions:** Workspaces (with sub-permissions for hosts, assignments, sessions, power state, drain mode, scripted actions and Console Connect Operator), Desktop images, App attach, and Portal (Manage only).
- **Endpoint Management:** Intune global roles, a longer list of individual Intune read and manage permissions, and Intune > Windows 365.
- **App Management:** Deployment policies, app groups, and the unified catalog (Read Catalog, Manage Catalog, Manage Shell App Parameters).
- **Automation:** Scripted actions, scripted sequences, executions and task worker analytics.
- **Storage:** Azure Files (including Manage Profiles), Azure NetApp Files and Log Analytics.
- **Operations:** Monitoring and Logs (Read Only), Migrate, and Secure variables (Read Only, Manage, Show Secret).

Release notes show how this list grows. Version 8.0 (a public preview build of 2 June 2026) added Read Only and Full Access definitions for migration; v8.1.0 (public preview build, 21 July 2026) gave secure variables their own RBAC module; and v8.2.0 (public preview build, 17 September 2026) added dedicated Automation scopes for scripted sequences and task worker analytics. GA builds follow each of these preview builds, the latest being v8.2.3 (13 November 2026). If your console differs from this list, check the version first.

## Create a custom role

1. In Nerdio Manager, go to **System > RBAC > Definitions**.
2. Select **New Definition**.
3. Enter a name and description.
4. Select the modules and the access mode for each.
5. Select **OK**. You can edit or delete the role later from the definitions list.
6. Check the Entra ID side, described next. If the Nerdio Manager app registration lacks the required Graph permissions, assign the End User role to the user manually first. Nerdio describes this step for users only, not groups.
7. Assign the role to a user or security group under **System > RBAC > Assignments** with **New Assignment**. Nerdio's multiple group assignments page describes custom roles assigned together with a workspace, so select the workspace the role should apply to. Nerdio does not walk through a custom-role assignment separately, so verify the result with a non-admin account.

### The Entra ID side

Nerdio states that custom roles have no counterpart in Entra ID. Nerdio Manager assigns the built-in End User role to the user on its enterprise application and enforces the custom role's permissions when the user signs in.

Automatic assignment needs the Nerdio Manager app registration to hold the Application.ReadWrite.All and AppRoleAssignment.ReadWrite.All permissions. Nerdio's security FAQ marks these two as optional: if you leave them out, REST APIs for automated user assignment do not work. In that case, assign End User by hand before assigning the custom role: in the Microsoft Entra admin center open **Enterprise applications**, select the Nerdio Manager app, choose **Users and groups > Add user/group**, select the user and the **End User** role, and select **Assign**. Until then, the custom role does not work. A separate Nerdio note says the Owner role on the enterprise application is assigned automatically only to individual users, not groups, so Nerdio Manager admins must be assigned directly for that to happen.

## Three example role designs

These illustrations are built from the modules above, not Nerdio templates. Test each with a non-admin account.

**1. Session operator for a service desk that also needs to drain hosts.** The built-in Help Desk role covers sessions only. A custom role could combine the Workspaces sub-permissions for managing sessions, power state and drain mode with Insights set to Read Only, leaving out host creation, images and scripts.

**2. Image owner.** A team that maintains images can get Desktop images set to Manage, Scripted actions set to Read Only and Insights set to Read Only. The custom roles page lists only Read Only and Manage for images and does not mention limiting a role to one image, so test that before promising it.

**3. Profile operator.** Azure Files offers Read Only, Manage and Manage Profiles. Nerdio describes Manage Profiles as handling FSLogix profiles without an active user session or full control of the file share. A role with Azure Files set to Manage Profiles, rather than Manage, fits an operator who works on [FSLogix](/entity/fslogix/) profiles but should not control the whole share.

## When people hold more than one role

Role combining depends on the Nerdio Manager version, and Nerdio's multiple group assignments page is explicit about it.

From v6.4, cumulative RBAC applies to custom roles and is the default for new installations. Existing installations enable it by setting the app service setting `Features:CumulativeRbac` to `True`. Permissions from several custom role assignments are applied cumulatively, and where permissions conflict the higher one applies, within the limits listed below. The rules Nerdio lists:

- A user can be assigned directly, through direct group membership, or both. Multiple direct assignments are not supported, but one direct assignment can be combined with several group assignments.
- Nested group memberships are ignored because of an Entra ID limitation.
- Built-in roles are excluded from cumulative behaviour. Nerdio calls multiple group memberships not a supported configuration when built-in accounts, or a mix of built-in accounts and custom roles, are involved.
- Nerdio lists these limits for the initial release of the feature, and its page does not say they have been lifted: different access levels for the workspaces module cannot be mixed across assignments, and limited permissions cannot be mixed with Full Access or Read Only. A maximum of 10 assignments is supported, and additional ones are filtered out.

Before v6.4, Entra ID treats all custom roles as the same tier and Nerdio Manager cannot merge them. A user in several groups with custom roles may then see different workspaces or host pools from one sign-in to the next. Nerdio recommends one group with one custom role that covers every needed workspace, or a single direct assignment.

The v8.2.0 release notes also list assigning Nerdio Manager roles through groups enabled for [Privileged Identity Management](/entity/privileged-identity-management/), which requires cumulative RBAC and specific Graph permissions. The entry has no preview label of its own, and the notes for GA builds v8.2.1 to v8.2.3 do not mention it again. Check Nerdio's documentation for the version you run before building an access process around it.

## Related permission layers you may need to change too

A custom Nerdio role does not reach everything. Three neighbouring settings deserve a check when you design delegation:

- **Intune integration:** Nerdio's granular permissions page, introduced in v6.0, sets each Intune function to Manage, Read or Disabled and states that Cloud PC restarts need the Privileged Operations permission. Group and group-member permissions can be limited to specific groups by giving the Nerdio application ownership of them and setting the function to Read or Disabled. See [Intune](/entity/intune/) and [Windows 365](/entity/windows-365/).
- **Azure resources:** Microsoft documents built-in AVD roles such as Desktop Virtualization User Session Operator, Session Host Operator and Host Pool Contributor. Learn recommends assigning User Session Operator to specific host pools, because at resource group scope it grants read access to all host pools in the group. If you need something narrower, Azure custom roles allow up to 5,000 per tenant and cannot use wildcards in assignable scopes.
- **Nerdio's own Azure access:** v8.1.0 lists least-privilege custom Azure role support as a preview feature that lets Nerdio Manager run without Contributor access. This concerns the application's rights, not your administrators'.

## Limits and alternatives

- Scoping a custom role to a workspace is documented. Scoping to an image or host pool is not described for custom roles, beyond the Workspaces sub-permissions applying within assigned host pools. Verify any such scope in your console first.
- Only AVD Admins can manage users and roles, so keep that group small.
- In [Nerdio Manager for MSP](/entity/nerdio-manager-for-msp/), roles exist at two levels. MSP-level roles can span several customer accounts, account-level roles apply to one account, and Nerdio says deny permissions override allow permissions there.
- If your needs are limited to AVD resource access, Azure RBAC with Microsoft's Desktop Virtualization roles works without any Nerdio role design.

## Sources

Retrieved on 17 November 2026.

- [Nerdio help center (Enterprise): Role-based access control (RBAC): Custom roles](https://nmehelp.getnerdio.com/hc/en-us/articles/26124328221709)
- [Nerdio help center (Enterprise): Role-based access control (RBAC) in Nerdio Manager](https://nmehelp.getnerdio.com/hc/en-us/articles/26124313324173)
- [Nerdio help center (Enterprise): Role-based Access Control (RBAC): Multiple Group Assignments](https://nmehelp.getnerdio.com/hc/en-us/articles/26124385542797)
- [Nerdio help center (Enterprise): Security and Permissions FAQs](https://nmehelp.getnerdio.com/hc/en-us/articles/43762191552909-Security-and-Permissions-FAQs)
- [Nerdio help center (Enterprise): Azure Permissions and Nerdio Manager](https://nmehelp.getnerdio.com/hc/en-us/articles/25499388177421)
- [Nerdio help center (Enterprise): Intune: Granular permissions](https://nmehelp.getnerdio.com/hc/en-us/articles/25499415695501)
- [Nerdio help center (Enterprise): Direct Group Ownership Permissions for Nerdio Manager](https://nmehelp.getnerdio.com/hc/en-us/articles/25499377856013-Direct-Group-Ownership-Permissions-for-Nerdio-Manager)
- [Nerdio help center (Enterprise): Release Notes](https://nmehelp.getnerdio.com/hc/en-us/articles/19837802929677-Release-Notes)
- [Nerdio help center (MSP): Users and roles at the MSP level](https://nmmhelp.getnerdio.com/hc/en-us/articles/26125600554765)
- [Microsoft Learn: Built-in roles for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/rbac)
- [Microsoft Learn: Azure custom roles](https://learn.microsoft.com/en-us/azure/role-based-access-control/custom-roles)
