---
title: "Native Azure tooling or a management platform for AVD: what each covers"
summary: "Azure Virtual Desktop has native features for host pool creation, autoscale, session host updates, image building and monitoring. A management platform such as Nerdio Manager for Enterprise offers one console, more scaling triggers and image staging, at the price of another application, permissions and a per-user licence."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [azure-virtual-desktop, nerdio-manager-for-enterprise]
keypoints:
  - "Native Azure Virtual Desktop covers a lot: scaling plans (power management and dynamic autoscaling), session host configuration with session host update, custom image templates on Azure Image Builder, and Insights on Azure Monitor."
  - "Nerdio Manager for Enterprise runs as an Azure application in your own subscription and, per Nerdio, offers auto-scale triggers beyond session count (CPU, RAM), image staging, scripted actions and one console. Several features, such as multiple triggers and Global Pools, are Premium-only."
  - "Vendor comparisons age quickly: a Nerdio comparison page says native scaling cannot create hosts, while Learn documents dynamic autoscaling that creates and deletes session hosts for pooled pools with a session host configuration."
  - "Both routes have limits. The native session host configuration approach is chosen at creation and cannot be changed, and existing standard-management tooling does not work with it. Nerdio bills per unique Entra ID user per month and needs an installer with Global Admin and Subscription Owner rights, or a pre-created enterprise app."
  - "Decide per task, not per product: run the native tools where they meet your requirements, and test the platform on a pilot host pool where a documented gap costs you money or admin time."
faq:
  - q: "Do I need a management platform to run Azure Virtual Desktop?"
    a: "No. Microsoft Learn documents native features for creating host pools, scaling session hosts, updating them and building images, and it lists 14 built-in RBAC roles for Azure Virtual Desktop. Whether they are enough depends on your size and requirements; the decision steps below show how to test that."
  - q: "Can I mix native autoscale and a third-party scaling tool on the same host pool?"
    a: "Not according to Learn, which says not to use autoscale in combination with other scaling Microsoft or third-party scaling tools. In our reading, that means one scaling owner per host pool: either a native scaling plan or the third-party tool."
  - q: "What does Nerdio Manager for Enterprise cost?"
    a: "Nerdio's billing page says charges are per calendar month and per unique Entra ID user, under either the Windows Cloud or the AVD entitlement model, in Core or Premium edition. The page lists no prices; ask Nerdio or your partner for a quote."
---

Azure Virtual Desktop has native features for host pool creation, autoscale, session host updates, image building and monitoring. Whether they are enough depends on your environment. A management platform such as [Nerdio Manager for Enterprise](/entity/nerdio-manager-for-enterprise/) offers these tasks in one console, with CPU- and RAM-based scaling triggers and image staging. Whether that is worth another application and licence depends on the gaps you actually have.

This guide compares the two routes task by task. It uses Microsoft Learn for the native side and Nerdio's own help pages for the platform. Nerdio marketing statements are marked as vendor claims. Nerdio's billing page lists no prices, so costs are not compared here.

## The scope of the comparison

[Azure Virtual Desktop](/entity/azure-virtual-desktop/) is the service. "Native" means features Microsoft ships with it and Azure; a "management platform" is a separate application that orchestrates Azure resources for you. Nerdio describes its product as "a deployment, management, and auto-scaling platform for Azure Virtual Desktop (AVD) and Windows 365 Cloud PC." It runs as an Azure application in the customer's own subscription.

Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, session host configuration and update, and ephemeral OS disks, on 9 July 2026 (Tech Community). Some Learn pages, for example the autoscale scenarios page and module version 5.4.2-preview, still carry preview wording; check the current page before relying on a limit.

## Task by task

| Task | Native Azure (Learn) | Nerdio Manager for Enterprise (Nerdio help pages) |
|---|---|---|
| Create host pools | Azure portal, Azure CLI or Azure PowerShell. Adding hosts to a pool with a session host configuration is done in the portal; Learn says PowerShell can't be used for that | Create host pools from desktop images; static or auto-scaled; session hosts in Azure or AVD Hybrid (Azure Local or Nutanix AHV) |
| Scale session hosts | Scaling plans: power management and dynamic autoscaling | Auto-scale with triggers for CPU or RAM usage, average active sessions, available sessions and user-driven scaling (multiple triggers: Premium) |
| Update session hosts | Session host update replaces VMs in batches (host pools with a session host configuration only) | Desktop images with optional staging; scheduled Marketplace refresh, deployed to the session hosts that use the image |
| Build images | Custom image templates on Azure Image Builder | Create or import desktop images; optional Azure Compute Gallery with chosen replication regions |
| Automate tasks | Custom PowerShell script in the session host configuration; scripts in image templates | Scripted actions: PowerShell on a VM or in an Azure Automation account |
| Monitor | Insights on Azure Monitor Workbooks | Nerdio's product description lists performance monitoring; this article does not compare it |

## Scaling: where the two differ most

Native scaling plans for pooled host pools work on a percentage; personal pools use time-based actions after disconnect or sign-out. Learn explains that autoscale compares the used host pool capacity (user sessions divided by available host pool capacity) with a capacity threshold, and turns a host on only when usage is above the threshold. With two available hosts and a maximum session limit of five, available capacity is 10; three sessions make 30%. On pooled pools this needs a custom maximum session limit, because Learn says not to use the default. See [capacity threshold](/entity/avd-capacity-threshold/). Start VM on Connect, available with both management approaches, lets users power on a deallocated host when they connect.

Native scaling comes in two methods. [Power management autoscaling](/entity/avd-power-management-autoscaling/) starts and deallocates existing hosts and is generally available. [Dynamic autoscaling](/entity/avd-dynamic-autoscaling/) can also create and delete session hosts, but only for pooled host pools with a session host configuration, and Learn says it is not supported in Azure Government.

[Nerdio auto-scale](/entity/nerdio-auto-scaling/) adds more inputs. Per its help page, a scale-out trigger can be CPU or RAM usage, average active sessions, available sessions or user-driven, and you can select up to 3 triggers. It also offers scale-in aggressiveness (High, Medium, Low), rolling drain mode and pre-staged hosts. The same page says that "the multiple auto-scale triggers feature is available only in the Nerdio Manager Premium edition." Nerdio's billing page lists multiple triggers, intelligent pre-stage and rolling drain mode under advanced auto-scale, which needs a Premium entitlement and is not in Core.

Two cautions for a fair reading:

- A Nerdio comparison page (last modified 16 June 2026) states that the session count threshold is the only native autoscale trigger, and that native scaling "can only power on hosts that already exist in your pool." The first fits Learn only in part: native scaling reacts to session load, but Learn's capacity threshold is a percentage of host pool capacity, not a session count per host. The second describes power management; dynamic autoscaling creates and deletes hosts. Treat the page as vendor material: its cost figures and customer savings are Nerdio's own claims. The same page concedes that native autoscale "works reasonably well" for small deployments with predictable usage.
- Learn's autoscale scenarios page says: "Don't use autoscale in combination with other scaling Microsoft or third-party scaling tools," and to disable those on the host pools a scaling plan applies to. The scaling plan page adds that autoscale and Azure Automation or Azure Logic Apps scaling can't run on the same host pool, and that dynamic scaling can't be used with any other scaling script. Our reading: per host pool, use either a native scaling plan or Nerdio auto-scale, and disable the other.

## Images and updates

The native route has two parts. [Custom image templates](/entity/avd-custom-image-templates/) use [Azure Image Builder](/entity/azure-image-builder/): you define what should be in the image, then submit it for a build. The build uses a user-assigned managed identity, needs internet access for scripts, and expects custom scripts at a publicly available location such as GitHub. The finished image can be used when creating or updating a host pool. With the [session host configuration](/entity/avd-session-host-configuration/) approach, session host update replaces VMs in batches. The session host update page lists limits worth knowing:

- Only one update operation can run or be scheduled per host pool, and individual session hosts cannot be updated.
- Autoscale must be disabled on the host pool before the update starts and until it finishes, because a scaling plan enabled during an update can fail it.
- The Azure Monitor agent is not installed automatically on updated hosts, which affects Insights, and the feature is available only in the global Azure cloud, not Azure Government.

On the platform side, Nerdio's [desktop image](/entity/nerdio-desktop-image/) pages say that images can be created or imported, and that custom Azure images in your subscription can also be used to build and re-image host pools. Image Staging deploys an image to a test or "staging" pool before activation; per Nerdio, it is available only for images recently refreshed from the Azure Marketplace. You pick an Azure Compute Gallery and replication regions, and can keep the new version inactive or activate it automatically after a number of days. A Marketplace refresh can be scheduled, and Nerdio says the refreshed image is automatically deployed to all session hosts that use it. See also [golden image](/entity/golden-image/).

## Automation and monitoring

Nerdio [scripted actions](/entity/nerdio-scripted-actions/) are PowerShell scripts that run "in the context of a Windows VM or an Azure Automation Account." Nerdio ships default scripts, for example installing Teams or Microsoft 365 apps and enabling RDP Shortpath. Natively you would use the custom script in the session host configuration or in an image template; pipelines you write yourself need the standard management approach, per Learn.

For monitoring, [AVD Insights](/entity/avd-insights/) is a dashboard on Azure Monitor Workbooks. It needs diagnostic settings on host pools and workspaces, the Azure Monitor Agent with a data collection rule on session hosts, and a Log Analytics workspace; Learn states standard Log Analytics storage charges apply and that Azure Monitor alerts must be set up separately.

## Costs, permissions and constraints

**Architecture.** Nerdio's reference architecture lists what a Marketplace deployment creates in your subscription: an automation account, SQL Server and database, Key Vault, App Service and plan, Application Insights and a storage account for encryption keys. The application's service principal receives Contributor permissions on the resource groups it manages, plus Reader and Backup Reader on the subscription. The installer needs Entra ID Global Admin and Azure subscription Owner rights, or an enterprise app created in advance. Native features instead need specific RBAC roles, for example Desktop Virtualization Power On Off Contributor at subscription scope for autoscale.

**Licensing.** Nerdio bills per calendar month and per unique Entra ID user, in Core or Premium edition. Premium-only features named on the billing page include multiple Entra ID tenant support, Azure Government support, advanced auto-scale and Global Pools. Downgrading from Premium to Core "could result in loss of functionality," and the edition can be changed at any time.

**Native constraints.** Learn says the management approach is set at creation and cannot be changed. The session host configuration approach is for pooled host pools only, and "existing tooling designed for standard management won't work with a session host configuration." Pipelines or scripts that add and replace VMs stay on standard management. Before running a third-party platform against a pool with a session host configuration, ask the vendor how the two interact.

## Alternatives to both

- **Native plus your own automation.** Standard management with your own pipelines and scripts keeps full control, at the cost of engineering time.
- **Windows 365.** Learn describes Windows 365 as a cloud-based software-as-a-service that creates Cloud PCs for users. Choosing between Cloud PCs and Azure Virtual Desktop is a separate decision from native tooling versus a platform, and Nerdio says its platform covers Windows 365 too.

## How to decide

1. List the tasks you perform on host pools each month: scaling, patching, imaging, reporting.
2. Mark each as "native is enough" or "gap", with a measurable reason such as users hitting full hosts or hours spent rebuilding images.
3. Check which features are Premium-only: they may be the ones you need.
4. Check that your operating model fits: standard management or session host configuration, one scaling owner per pool (native plan or Nerdio, not both), and the permissions each route needs.
5. Run a pilot host pool for a few weeks and compare user experience, VM running hours and admin time against a native baseline.
6. Re-check the comparison when either side ships changes. Microsoft announced general availability of enhanced host pool management in July 2026, so older comparisons may describe the native side incompletely.

## Sources

Retrieved on 17 November 2026.

- [Microsoft Learn: Host pool management approaches](https://learn.microsoft.com/en-us/azure/virtual-desktop/host-pool-management-approaches)
- [Microsoft Learn: Deploy Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop)
- [Microsoft Learn: Add session hosts to a host pool](https://learn.microsoft.com/en-us/azure/virtual-desktop/add-session-hosts-host-pool)
- [Microsoft Learn: Create and assign an autoscale scaling plan for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: Autoscale scaling plans and example scenarios](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
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
- [Nerdio help: Scripted actions overview](https://nmehelp.getnerdio.com/hc/en-us/articles/26124327585421)
- [Nerdio help: Default scripts for Nerdio Manager](https://nmehelp.getnerdio.com/hc/en-us/articles/26124382667021-Default-Scripts-for-Nerdio-Manager)
- [Nerdio help: NME entitlements, consumption and billing](https://nmehelp.getnerdio.com/hc/en-us/articles/26124388880397-NME-entitlements-consumption-and-billing)
- [Nerdio help: Nerdio Manager edition management](https://nmehelp.getnerdio.com/hc/en-us/articles/25499386018701-Nerdio-Manager-Edition-Management)
- [Nerdio blog (vendor material): Nerdio vs. native Azure Virtual Desktop management](https://getnerdio.com/blog/nerdio-vs-native-azure-virtual-desktop-comparison-series-auto-scaling)
