---
title: "Native Azure tooling or a management platform for AVD: what each covers"
summary: "Azure Virtual Desktop has native features for host pools, autoscale, session host updates, images and monitoring. Nerdio Manager for Enterprise adds scaling triggers and image staging, at the cost of another app and a licence."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [azure-virtual-desktop, nerdio-manager-for-enterprise]
keypoints:
  - "Native AVD covers a lot: scaling plans (power management and dynamic), session host configuration with update, custom image templates on Image Builder, and Insights on Azure Monitor."
  - "Nerdio Manager for Enterprise runs in your own subscription and, per Nerdio, adds auto-scale triggers beyond sessions (CPU, RAM), image staging and scripted actions. Several features are Premium-only."
  - "Vendor comparisons age quickly: a Nerdio page says native scaling cannot create hosts, while Learn documents dynamic autoscaling that creates and deletes hosts with a session host configuration."
  - "Native session host configuration is chosen at creation and cannot be changed. Nerdio bills per unique Entra ID user per month and needs Global Admin and Subscription Owner rights to install."
  - "Decide per task, not per product: run the native tools where they meet your requirements, and test the platform on a pilot host pool where a documented gap costs you money or admin time."
faq:
  - q: "Do I need a management platform to run Azure Virtual Desktop?"
    a: "No. Microsoft Learn documents native features for creating host pools, scaling session hosts, updating them and building images, and it lists 14 built-in RBAC roles for Azure Virtual Desktop. Whether they are enough depends on your size and requirements; the decision steps below show how to test that."
  - q: "Can I mix native autoscale and a third-party scaling tool on the same host pool?"
    a: "Not according to Learn, which says not to use autoscale in combination with other scaling Microsoft or third-party scaling tools. In our reading, that means one scaling owner per host pool: either a native scaling plan or the third-party tool."
  - q: "What does Nerdio Manager for Enterprise cost?"
    a: "Nerdio's billing page says charges are per calendar month and per unique Entra ID user, under either the Windows Cloud or the AVD entitlement model, in Core or Premium edition. The page lists no prices; ask Nerdio or your partner for a quote."
---

Azure Virtual Desktop has native features for host pool creation, autoscale, session host updates, image building and monitoring. Whether they are enough depends on your environment. A management platform such as [Nerdio Manager for Enterprise](https://www.m365.fm/entity/nerdio-manager-for-enterprise/) covers these tasks in one product, with CPU- and RAM-based scaling triggers and image staging. Whether that is worth another application and licence depends on your gaps.

This guide compares the two routes task by task, using Microsoft Learn for the native side and Nerdio's help pages for the platform. Nerdio's billing page lists no prices, so costs are not compared.

## The scope of the comparison

[Azure Virtual Desktop](https://www.m365.fm/entity/azure-virtual-desktop/) is the service. "Native" means features Microsoft ships with it and Azure; a "management platform" is a separate application that orchestrates Azure resources for you. Nerdio describes its product as "a deployment, management, and auto-scaling platform for Azure Virtual Desktop (AVD) and Windows 365 Cloud PC." It runs as an Azure application in the customer's own subscription.

Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, session host configuration and update, and ephemeral OS disks, on 9 July 2026 (Tech Community). Some Learn pages, for example the autoscale scenarios page and module version 5.4.2-preview, still carry preview wording; check the current page before relying on a limit.

## Task by task

| Task | Native Azure (Learn) | Nerdio Manager for Enterprise (Nerdio help pages) |
|---|---|---|
| Create host pools | Standard management: Azure portal, Azure CLI or Azure PowerShell; hosts on Azure or Azure Local. Session host configuration: pooled only, on Azure only (not Azure Local); portal or PowerShell, with the PowerShell cmdlets in preview. Learn's comparison table lists PowerShell for adding hosts to such a pool, but its add-session-hosts page says PowerShell cannot be used | Create host pools from desktop images; static or auto-scaled; session hosts in Azure or AVD Hybrid (Azure Local or Nutanix AHV) |
| Scale session hosts | Scaling plans: power management and dynamic autoscaling | Auto-scale with triggers for CPU or RAM usage, average active sessions, available sessions and user-driven scaling (multiple triggers: Premium) |
| Update session hosts | Session host update replaces VMs in batches (host pools with a session host configuration only) | Desktop images with optional staging; scheduled Marketplace refresh, deployed to the session hosts that use the image |
| Build images | Custom image templates on Azure Image Builder | Create or import desktop images; when setting an image, optional Azure Compute Gallery and replication to chosen regions |
| Automate tasks | Custom PowerShell script in the session host configuration; scripts in image templates | Scripted actions: PowerShell on a VM or in an Azure Automation account |
| Monitor | Insights on Azure Monitor Workbooks | Insights for Azure Virtual Desktop in Nerdio Manager, based on Log Analytics data; can link an Azure Monitor Insights workbook; some analytics and reporting features are Premium-only |

## Scaling

Native scaling plans for pooled host pools work on a percentage; personal pools use schedule phases with an action based on session state (disconnected or signed out). Learn explains that autoscale compares the used host pool capacity (user sessions divided by available host pool capacity) with a capacity threshold, and turns a host on only when usage is above the threshold. With two available hosts and a maximum session limit of five, available capacity is 10; three sessions make 30%. On pooled pools this needs a custom maximum session limit, because Learn says not to use the default. See [capacity threshold](https://www.m365.fm/entity/avd-capacity-threshold/). Start VM on Connect, available with both management approaches, lets users power on a deallocated host when they connect.

Native scaling comes in two methods. [Power management autoscaling](https://www.m365.fm/entity/avd-power-management-autoscaling/) starts and deallocates existing hosts and is generally available. [Dynamic autoscaling](https://www.m365.fm/entity/avd-dynamic-autoscaling/) can also create and delete session hosts, but only for pooled host pools with a session host configuration, and Learn says it is not supported in Azure Government.

[Nerdio auto-scale](https://www.m365.fm/entity/nerdio-auto-scaling/) adds more inputs. Per its help page, a scale-out trigger can be CPU or RAM usage, average active sessions, available sessions or user-driven, with up to 3 triggers. It also offers scale-in aggressiveness, rolling drain mode and pre-staged hosts. The same page says that "the multiple auto-scale triggers feature is available only in the Nerdio Manager Premium edition." Nerdio's billing page lists advanced auto-scale, multiple auto-scale triggers, intelligent pre-stage and rolling drain mode among its Premium features, which are not included in Core.

Two cautions for a fair reading:

- A Nerdio comparison page (last modified 16 June 2026) states that the session count threshold is the only native autoscale trigger, and that native scaling "can only power on hosts that already exist in your pool." The first fits Learn only in part: Learn's capacity threshold is a percentage of host pool capacity, not a session count per host. The second describes power management; dynamic autoscaling creates and deletes hosts. Treat the page as vendor material; it also concedes that for small deployments with predictable usage, native autoscale "works reasonably well."
- Learn's autoscale scenarios page says: "Don't use autoscale in combination with other scaling Microsoft or third-party scaling tools," and to disable those on the host pools a scaling plan applies to. The scaling plan page adds that autoscale and Azure Automation or Azure Logic Apps scaling can't run on the same host pool, and that dynamic scaling can't be used with any other scaling script. Our reading: per host pool, use either a native scaling plan or Nerdio auto-scale, and disable the other.

## Images and updates

The native route has two parts. [Custom image templates](https://www.m365.fm/entity/avd-custom-image-templates/) use [Azure Image Builder](https://www.m365.fm/entity/azure-image-builder/): you define what should be in the image, then submit it for a build. The build uses a user-assigned managed identity, needs internet access for scripts, and expects custom scripts at a publicly available location such as GitHub. The finished image can be used when creating or updating a host pool. With the [session host configuration](https://www.m365.fm/entity/avd-session-host-configuration/) approach, session host update replaces VMs in batches. The session host update page lists limits worth knowing:

- Only one update operation can run or be scheduled per host pool, and individual session hosts cannot be updated.
- Autoscale must be disabled on the host pool before the update starts and until it finishes, because a scaling plan enabled during an update can fail it.
- The Azure Monitor agent is not installed automatically on updated hosts, and the feature is available only in the global Azure cloud.

On the platform side, Nerdio's [desktop image](https://www.m365.fm/entity/nerdio-desktop-image/) pages say that images can be created or imported. Image Staging deploys an image to a test or "staging" pool before activation; per Nerdio, it is available only for images recently refreshed from the Azure Marketplace. You pick an Azure Compute Gallery and replication regions, and the new version can stay inactive or activate after a number of days. A Marketplace refresh can be scheduled, and Nerdio says the refreshed image is automatically deployed to all session hosts that use it.

## Automation and monitoring

Nerdio [scripted actions](https://www.m365.fm/entity/nerdio-scripted-actions/) are PowerShell scripts that run "in the context of a Windows VM or an Azure Automation Account." Nerdio ships default scripts, for example for installing Teams or enabling RDP Shortpath. Natively, use the custom script in the session host configuration or in an image template.

For monitoring, native [AVD Insights](https://www.m365.fm/entity/avd-insights/) is a dashboard on Azure Monitor Workbooks. It needs diagnostic settings on host pools and workspaces, the Azure Monitor Agent with a data collection rule on session hosts, and a Log Analytics workspace; Learn states standard Log Analytics storage charges apply and that Azure Monitor alerts must be set up separately. Nerdio's help pages describe Insights for Azure Virtual Desktop in Nerdio Manager (Usage, FSLogix, Storage, Workspaces, Tenants) built on Log Analytics data, with no additional agents. Nerdio Manager can also link an Azure Monitor Insights workbook under System > Settings > Integrations. The billing page lists Executive Insights, User Cost Attribution, Auto-scale Analytics and Advisor Recommendations for AVD as Premium features.

## Licensing, permissions and constraints

**Architecture.** Nerdio's reference architecture lists what a Marketplace deployment creates in your subscription, including an automation account, SQL Server and database, Key Vault and App Service. The application's service principal receives Contributor permissions on the resource groups it manages, plus Reader and Backup Reader on the subscription. The installer needs Entra ID Global Admin and Azure subscription Owner rights, or an enterprise app created in advance. Native features instead need specific RBAC roles, for example Desktop Virtualization Power On Off Contributor at subscription scope for autoscale.

**Licensing.** Nerdio bills per calendar month and per unique Entra ID user, in Core or Premium edition. Premium-only features on the billing page include multiple Entra ID tenant support, Azure Government support and Global Pools. Nerdio's edition management page warns that downgrading from Premium to Core "could result in loss of functionality."

**Native constraints.** Learn says the management approach is set at creation and cannot be changed. The session host configuration approach is for pooled host pools only, and "existing tooling designed for standard management won't work with a session host configuration." Before running a third-party platform against a pool with a session host configuration, ask the vendor how the two interact.

## Alternatives to both

- **Native plus your own automation.** Learn says standard management lets you keep existing tools such as automated pipelines and custom scripts; a pool with a session host configuration does not.
- **Windows 365.** Learn describes Windows 365 as a cloud-based software-as-a-service that creates Cloud PCs for users. Choosing between Cloud PCs and Azure Virtual Desktop is a separate decision.

## How to decide

1. List the tasks you perform on host pools each month: scaling, patching, imaging, reporting.
2. Mark each as "native is enough" or "gap", with a measurable reason such as users hitting full hosts or hours spent rebuilding images.
3. Check which features are Premium-only: they may be the ones you need.
4. Check that your operating model fits: standard management or session host configuration, one scaling owner per pool (native plan or Nerdio, not both), and the permissions each route needs.
5. Run a pilot host pool for a few weeks and compare user experience, VM running hours and admin time against a native baseline.
6. Re-check the comparison when either side ships changes; older comparisons may describe the native side incompletely.

## Sources

- [Microsoft Learn: Host pool management approaches](https://learn.microsoft.com/en-us/azure/virtual-desktop/host-pool-management-approaches)
- [Microsoft Learn: Deploy Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop)
- [Microsoft Learn: Add session hosts to a host pool](https://learn.microsoft.com/en-us/azure/virtual-desktop/add-session-hosts-host-pool)
- [Microsoft Learn: Create and assign an autoscale scaling plan for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: Autoscale scaling plans and example scenarios](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Microsoft Learn: Autoscale glossary](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-glossary)
- [Microsoft Learn: Start VM on Connect](https://learn.microsoft.com/en-us/azure/virtual-desktop/start-virtual-machine-connect)
- [Microsoft Learn: Session host update](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update)
- [Microsoft Learn: Custom image templates](https://learn.microsoft.com/en-us/azure/virtual-desktop/custom-image-templates)
- [Microsoft Learn: Azure Virtual Desktop Insights](https://learn.microsoft.com/en-us/azure/virtual-desktop/insights)
- [Microsoft Learn: Built-in Azure RBAC roles for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/rbac)
- [Microsoft Learn: What is Windows 365?](https://learn.microsoft.com/en-us/windows-365/overview)
- [Microsoft Tech Community: Enhanced host pool management for Azure Virtual Desktop is now generally available](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
- [Nerdio help: About Nerdio Manager](https://nmehelp.getnerdio.com/hc/en-us/articles/26124301747213-About-Nerdio-Manager)
- [Nerdio help: Nerdio Manager for Enterprise reference architecture](https://nmehelp.getnerdio.com/hc/en-us/articles/26124355756941-Nerdio-Manager-for-Enterprise-Reference-Architecture)
- [Nerdio help: Overview of host pools](https://nmehelp.getnerdio.com/hc/en-us/articles/26124329605517-Host-Pools)
- [Nerdio help: Enable dynamic host pool auto-scaling](https://nmehelp.getnerdio.com/hc/en-us/articles/26124304193037-Enable-Dynamic-Host-Pool-Auto-scaling)
- [Nerdio help: Desktop images](https://nmehelp.getnerdio.com/hc/en-us/articles/48283774944141-Desktop-Images)
- [Nerdio help: Stage desktop images](https://nmehelp.getnerdio.com/hc/en-us/articles/48283805464077-Stage-Desktop-Images)
- [Nerdio help: Refresh desktop images from the Azure Marketplace](https://nmehelp.getnerdio.com/hc/en-us/articles/48283781457677)
- [Nerdio help: Insights for Azure Virtual Desktop](https://nmehelp.getnerdio.com/hc/en-us/articles/35702684120589)
- [Nerdio help: Configure Azure Monitor Insights](https://nmehelp.getnerdio.com/hc/en-us/articles/26124311026957)
- [Nerdio help: Scripted actions overview](https://nmehelp.getnerdio.com/hc/en-us/articles/26124327585421)
- [Nerdio help: Default scripts for Nerdio Manager](https://nmehelp.getnerdio.com/hc/en-us/articles/26124382667021-Default-Scripts-for-Nerdio-Manager)
- [Nerdio help: NME entitlements, consumption and billing](https://nmehelp.getnerdio.com/hc/en-us/articles/26124388880397-NME-entitlements-consumption-and-billing)
- [Nerdio help: Nerdio Manager edition management](https://nmehelp.getnerdio.com/hc/en-us/articles/25499386018701-Nerdio-Manager-Edition-Management)
- [Nerdio blog (vendor material): Nerdio vs. native Azure Virtual Desktop management](https://getnerdio.com/blog/nerdio-vs-native-azure-virtual-desktop-comparison-series-auto-scaling)
