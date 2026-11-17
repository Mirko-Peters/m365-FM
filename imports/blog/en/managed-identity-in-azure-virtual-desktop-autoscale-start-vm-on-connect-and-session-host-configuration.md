---
title: "Managed identity in Azure Virtual Desktop: autoscale, Start VM on Connect and session host configuration"
summary: "A managed identity assigned to an Azure Virtual Desktop host pool lets autoscale, session host update, Start VM on Connect and Azure Virtual Desktop for Azure Local act on Azure resources without the Azure Virtual Desktop service principal. Learn announced general availability in September 2026 and says host pools with a session host configuration will require one in a future service update."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-managed-identity, azure-virtual-desktop]
keypoints:
  - "Learn lists four features that can use a host pool managed identity: autoscale, session host update, Start VM on Connect and Azure Virtual Desktop for Azure Local. App Attach with Azure Files and Entra-joined session hosts is the named exception and keeps the service principal."
  - "You can use a system-assigned identity, tied to one host pool and deleted with it, or a user-assigned identity, an independent resource that several host pools can share."
  - "Each feature has its own role: Power On Off Contributor for power management autoscale, Power On Contributor for Start VM on Connect, Virtual Machine Contributor for session host creation and update. Autoscale wants the subscription as scope; the Start VM on Connect page allows lower scopes."
  - "Learn's What's new announces managed identity support as generally available (September 2026) and says that in a future service update, host pools with a session host configuration will require one to add session hosts. Learn gives no date."
  - "Session host update needs a managed identity if the key vault uses private network access."
faq:
  - q: "Do I have to use a managed identity for autoscale today?"
    a: "Not according to Learn's scaling plan page, which names the Azure Virtual Desktop service principal or a managed identity assigned to the host pool for power management autoscale. The managed identity requirement that Learn announces applies to host pools with a session host configuration, and only 'in a future service update'."
  - q: "Should I choose a system-assigned or a user-assigned managed identity?"
    a: "Learn's Azure Virtual Desktop pages describe both options without recommending one; Entra's general overview calls user-assigned identities the recommended type for Microsoft services. A system-assigned identity is tied to one host pool and disappears with it. A user-assigned identity is an independent resource that can serve several host pools, and removing it from a pool leaves its role assignments untouched."
  - q: "Which Azure Virtual Desktop feature cannot use a managed identity?"
    a: "Learn names App Attach when you use Azure Files and your session hosts are joined to Microsoft Entra ID. It still requires roles assigned to the Azure Virtual Desktop service principal."
---

A managed identity in Azure Virtual Desktop is an identity assigned to a host pool so that features such as autoscale, session host update and Start VM on Connect can perform Azure Resource Manager operations without using the Azure Virtual Desktop service principal. Microsoft Learn's What's new announced general availability of managed identity support for host pools in September 2026, and App Attach is the feature that Learn says cannot use one.

This article explains what the identity does, which features use it, which role each feature needs and how to choose between the two identity types. The step-by-step move from the service principal is in the companion article "Moving from the service principal to a managed identity for AVD features".

## What a managed identity changes

Learn describes the problem this way: some Azure Virtual Desktop features need to perform Azure Resource Manager operations on virtual machines, key vault and virtual networks in your subscription. Those operations need permissions, and there are two places to give them.

- **The Azure Virtual Desktop service principal.** Learn calls it the single-tenant identity that is created to represent the multi-tenant service in your tenant. Its name starts with either *Azure Virtual Desktop* or *Windows Virtual Desktop*, depending on when you registered the *Microsoft.DesktopVirtualization* resource provider, and its application ID is 9cdead84-a844-4324-93f2-b2e6bb768d07. Learn says a subscription-level assignment lets Azure Virtual Desktop manage the power state of any session hosts in that subscription.
- **A managed identity assigned to the host pool.** Learn describes it as a service principal that exists only in your Entra tenant, with permissions you grant per host pool.

Microsoft's September 2025 What's new entry listed what the host pool identity adds for pools that use a [session host configuration](/entity/avd-session-host-configuration/): per-host-pool control of the permissions needed to create and update session hosts, permissions that are assigned automatically from the session host configuration parameters, support for key vaults with public access disabled that allow trusted Microsoft services, and access to images in another Azure subscription of the same tenant. The deployment page adds that the identity performs the create, delete and update operations for session hosts in place of the service principal. Entra's overview of [managed identities](/entity/managed-identity/) adds the general benefit: you do not manage the credentials, and they are not even accessible to you.

## Which features can use it

Learn's "Configure managed identity in Azure Virtual Desktop" page (ms.date 25 September 2026, updated 4 November 2026) gives the list, and the service principal page repeats it.

| Feature | Managed identity | Service principal |
|---|---|---|
| [Autoscale](/entity/avd-scaling-plan/) | Yes | Yes |
| Session host update | Yes | Yes |
| [Start VM on Connect](/entity/avd-start-vm-on-connect/) | Yes | Yes |
| Azure Virtual Desktop for [Azure Local](/entity/azure-local/) | Yes | Learn says the service principal is available for host pools in Azure and Azure Local |
| App Attach (Azure Files, session hosts joined to Microsoft Entra ID) | No | Required |

The What's new entry of September 2026 words the same scope as "session host configuration, autoscale, Start VM on Connect, and Azure Virtual Desktop for Azure local".

Two scoping notes. The identity is assigned to a host pool, so a plan with many pools needs the identity on each pool; a user-assigned identity can be reused. And the service principal page says managed identity is "available for host pools on Azure", while the configuration page lists Azure Local among the features that can use one. For Azure Local session hosts the configuration page adds a specific step: the host pool's identity needs the Reader role on the resource group that holds the session hosts.

## System-assigned or user-assigned

Learn's configuration page offers both types and compares them in a few lines.

| | System-assigned | User-assigned |
|---|---|---|
| What it is | Tied directly to the host pool | An independent Azure resource |
| Reuse | One host pool | One or more host pools |
| Removing it from the pool | Azure deletes the identity and its metadata | Azure removes only the association; permissions assigned to the identity stay |
| Who needs which role to assign it | Desktop Virtualization Host Pool Contributor at the host pool scope or higher | The same, plus Managed Identity Operator at the identity's scope or higher |

The deployment page adds one portal convenience: if you choose a system-assigned identity while creating a host pool in the Azure portal, the relevant permissions are assigned automatically from your session host configuration, provided your account can assign Azure RBAC over the relevant scope.

How to choose follows from that table. A user-assigned identity suits an environment with several host pools that need the same permissions, because you grant roles once and attach the identity to each pool; it also keeps its role assignments if you delete and rebuild a pool. A system-assigned identity suits a single pool that you want to keep separate, and it cleans up after itself. Entra's general overview makes the same distinction (shared versus independent life cycle) and says user-assigned managed identities are the recommended type for Microsoft services; the Azure Virtual Desktop pages themselves do not recommend either type.

## Which role each feature needs

The role names and scopes come from three Learn pages. Roles are assigned with Azure RBAC; Learn's role reference gives each built-in role's description.

| Feature | Role | Scope named by Learn |
|---|---|---|
| Power management autoscale | Desktop Virtualization Power On Off Contributor | The Azure subscription. Learn says a lower scope, such as resource group, host pool or VM, "prevents autoscale from working properly" |
| Dynamic autoscale | Power On Off Contributor and Desktop Virtualization Virtual Machine Contributor | The dynamic scaling section names the Azure Virtual Desktop service principal with the subscription as assignable scope |
| Start VM on Connect | Desktop Virtualization Power On Contributor | A scope that contains the host pool and its session host VMs; Learn's tip says lower scopes than the subscription work if they contain the target VMs |
| Session host creation and update | Desktop Virtualization Virtual Machine Contributor | The resource group or subscription you use for session hosts |

Three details deserve attention.

First, the autoscale and Start VM on Connect pages disagree about scope. The autoscale page says anything below the subscription breaks autoscale. The Start VM on Connect page says earlier guidance making the same claim for that feature was "technically incorrect". It recommends the subscription scope for environments with several host pools or a dedicated subscription because one assignment is simpler to manage, and allows lower scopes that contain the target VMs. Follow each page for its own feature.

Second, the dynamic scaling section of the scaling plan page names the service principal for both roles, while the power management section names either identity. Learn's configuration page lists autoscale as a feature that can use a managed identity without separating the two methods. If you run dynamic autoscale, confirm on the live page which identity you can grant.

Third, a pool that uses a key vault for the local administrator and domain join secrets needs the identity to read them. The deployment page says to give the identity the Key Vault Secrets User role under Azure RBAC, or the Get secret permission in an access policy. The access policy route is not supported if you chose a system-assigned identity during host pool creation.

The person who assigns roles needs permission to write role assignments: Learn names `Microsoft.Authorization/roleAssignments/write`, which is part of Owner and User Access Administrator.

## Status: generally available, requirement still to come

Learn's What's new gives three entries, in time order:

- **August 2025.** Managed identity support for validation host pools using session host configuration, in the Azure preview portal.
- **September 2025.** Support extended to all host pools using a session host configuration, in the production portal. The entry says creating a new such host pool in the portal "with require assigning a managed identity" (the wording as published) and lists an estimated progression of dates in 2025.
- **September 2026.** "Managed identity support is now generally available." It adds: "In a future service update, host pools configured with a session host configuration will **require a managed identity** in order to add session hosts to the host pool."

The configuration page's Important note uses the same "future service update" wording and says the change replaces reliance on the service principal and allows a more secure configuration. The 2025 dates are not repeated in the 2026 text, and the deployment page still says you can choose whether to assign an identity at creation. So Learn's pages are not fully aligned; treat the requirement as announced and without a date, and check What's new before building a new pool. Enhanced host pool management, which covers session host configuration and dynamic autoscale, was announced as generally available in July 2026 (Tech Community). Some Learn pages, for example the scenarios and glossary pages and the module version 5.4.2-preview, still carry preview wording; check the current page before relying on a limit.

## Limits worth knowing

- **App Attach** with Azure Files and Entra-joined session hosts needs the service principal approach.
- **Session host update and key vaults.** Learn's known issues say update must use a managed identity to reach a key vault with private network access; pools without an identity must allow public access from all networks. Session host update is available only in the global Azure cloud, not in Azure US Government or Azure operated by 21Vianet.
- **Both identities can coexist.** The service principal page lists both options side by side, and nothing in the pages says you must remove service principal assignments when you add an identity. Whether to remove them is your decision, and the practice article covers how to test before you do.

## A short decision guide

1. List which features each host pool uses: autoscale, Start VM on Connect, session host configuration, App Attach.
2. If a pool uses a session host configuration, plan for a managed identity, since Learn announces it as required.
3. If App Attach with Azure Files on Entra-joined hosts is in use, keep the service principal assignment for that feature.
4. Pick the type: user-assigned for several pools sharing permissions, system-assigned for a single pool.
5. Map roles to features from the table above and choose the scope each page names.

## Sources

Retrieved 17 November 2026.

- [Microsoft Learn: Configure managed identity in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-managed-identity)
- [Microsoft Learn: Assign Azure RBAC roles or Microsoft Entra roles to the Azure Virtual Desktop service principals](https://learn.microsoft.com/en-us/azure/virtual-desktop/service-principal-assign-roles)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Microsoft Learn: Create and assign an autoscale scaling plan](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: Configure Start VM on Connect](https://learn.microsoft.com/en-us/azure/virtual-desktop/start-virtual-machine-connect)
- [Microsoft Learn: Session host update](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update)
- [Microsoft Learn: Deploy Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop)
- [Microsoft Learn: Built-in Azure RBAC roles for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/rbac)
- [Microsoft Learn: Managed identities for Azure resources](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/overview)
- [Tech Community: Enhanced host pool management for Azure Virtual Desktop is now generally available](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
