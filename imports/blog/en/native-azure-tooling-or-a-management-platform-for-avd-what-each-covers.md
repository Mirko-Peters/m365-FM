---
title: "Native Azure tooling or a management platform for AVD: what each covers"
summary: "Azure Virtual Desktop has native features for host pool creation, autoscale, session host updates, image building and monitoring. A management platform such as Nerdio Manager for Enterprise adds one console, more scaling triggers and image staging, at the price of another application, permissions and a per-user licence."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [azure-virtual-desktop, nerdio-manager-for-enterprise]
keypoints:
  - "Native Azure Virtual Desktop covers a lot: scaling plans (power management and dynamic autoscaling), session host configuration with session host update, custom image templates on Azure Image Builder, and Insights on Azure Monitor."
  - "Nerdio Manager for Enterprise runs as an Azure application in your own subscription and, per Nerdio, adds auto-scale triggers beyond session count (CPU, RAM), image staging, scripted actions and one console. Several features, such as multiple triggers and Global Pools, are Premium-only."
  - "Vendor comparisons age quickly: a Nerdio comparison page says native scaling cannot create hosts, while Learn documents dynamic autoscaling that creates and deletes session hosts for pooled pools with a session host configuration."
  - "Both routes have limits. The native session host configuration approach is chosen at creation and cannot be changed, and existing standard-management tooling does not work with it. Nerdio bills per unique Entra ID user per month and needs an installer with Global Admin and Subscription Owner rights, or a pre-created enterprise app."
  - "Decide per task, not per product: run the native tools where they meet your requirements, and test the platform on a pilot host pool where a documented gap costs you money or admin time."
faq:
  - q: "Do I need a management platform to run Azure Virtual Desktop?"
    a: "No. Microsoft Learn documents native features for creating host pools, scaling session hosts, updating them and building images, and it lists 14 built-in RBAC roles for administration. Whether they are enough depends on your size and requirements; the decision steps below show how to test that."
  - q: "Can I mix native autoscale and a third-party scaling tool on the same host pool?"
    a: "Learn says autoscale cannot be combined with Azure Automation and Logic Apps scaling on the same host pool, and that dynamic scaling cannot be used with any other scaling script on the same host pool. Whether a given third-party tool counts as another scaling script is a question for that vendor, so plan one scaling owner per host pool."
  - q: "What does Nerdio Manager for Enterprise cost?"
    a: "Nerdio's billing page says charges are per calendar month and per unique Entra ID user, under either the Windows Cloud or the AVD entitlement model, in Core or Premium edition. The page lists no prices; ask Nerdio or your partner for a quote."
---

For many environments the native Azure Virtual Desktop features cover host pool creation, autoscale, session host updates, image building and monitoring. A management platform such as [Nerdio Manager for Enterprise](/entity/nerdio-manager-for-enterprise/) puts these tasks into one console and adds features such as CPU- and RAM-based scaling triggers and image staging. Whether that is worth another application and licence depends on the gaps you actually have.

This guide compares the two routes task by task. It uses Microsoft Learn for the native side and Nerdio's own help pages for the platform. Where a statement comes from Nerdio's marketing material, it is marked as a vendor claim. Prices are outside the scope because the sources list none.

## The scope of the comparison

[Azure Virtual Desktop](/entity/azure-virtual-desktop/) is the service. "Native" here means the features Microsoft ships with it and with Azure. "Management platform" means a separate application that orchestrates Azure resources on your behalf. Nerdio describes its product as "a deployment, management, and auto-scaling platform for Azure Virtual Desktop (AVD) and Windows 365 Cloud PC." It runs as an all-PaaS Azure application inside the customer's own subscription.

Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, session host configuration and update, and ephemeral OS disks, on 9 July 2026 (Tech Community). Some Learn pages, for example the autoscale scenarios page and the module version 5.4.2-preview, still carry preview wording; check the current page before relying on a limit.

## Task by task

| Task | Native Azure (Learn) | Nerdio Manager for Enterprise (Nerdio help pages) |
|---|---|---|
| Create host pools | Portal, ARM template or PowerShell; with a session host configuration, add hosts by increasing the host pool size | Create host pools from desktop images; static or auto-scaled; session hosts in Azure or AVD Hybrid (Azure Local or Nutanix AHV) |
| Scale session hosts | Scaling plans: power management and dynamic autoscaling | Auto-scale with triggers for CPU or RAM usage, average active sessions, available sessions and user-driven scaling |
| Update session hosts | Session host update replaces VMs in batches | Desktop images with staging; Marketplace refresh deploys the updated image to the session hosts that use it |
| Build images | Custom image templates on Azure Image Builder | Import images, stage them, store them in an Azure Compute Gallery |
| Automate tasks | Custom PowerShell script in the session host configuration; scripts in image templates | Scripted actions: PowerShell on a VM or in an Azure Automation account |
| Monitor | Insights on Azure Monitor Workbooks | Performance monitoring listed among its functions |

## Scaling: where the two differ most

Native scaling plans work on a percentage. Learn explains that autoscale compares the used host pool capacity (user sessions divided by available host pool capacity) with a capacity threshold, and turns a host on only when usage is above the threshold. With two available hosts and a maximum session limit of five, available capacity is 10; three sessions make 30%. That gives predictable behaviour and needs a custom maximum session limit on pooled pools, because Learn says not to use the default. The detail is in our article on the [capacity threshold](/entity/avd-capacity-threshold/).

Native scaling comes in two methods. [Power management autoscaling](/entity/avd-power-management-autoscaling/) starts and deallocates existing hosts and is generally available. [Dynamic autoscaling](/entity/avd-dynamic-autoscaling/) can also create and delete session hosts, but only for pooled host pools with a session host configuration, and Learn says it is not supported in Azure Government.

[Nerdio auto-scale](/entity/nerdio-auto-scaling/) adds more inputs. Per its help page, a scale-out trigger can be CPU or RAM usage, average active sessions, available sessions or user-driven, and you can select up to 3 triggers. It also offers scale-in aggressiveness (High, Medium, Low), rolling drain mode and pre-staging of hosts before the workday. The same page says that "the multiple auto-scale triggers feature is available only in the Nerdio Manager Premium edition." Nerdio's billing page also lists advanced auto-scale as Premium-only.

Two cautions for a fair reading:

- A Nerdio comparison page (page metadata shows it last modified on 16 June 2026) states that the native session count threshold is the only trigger native autoscale uses, and that native scaling "can only power on hosts that already exist in your pool." The first statement matches the capacity-threshold logic on Learn. The second describes power management; dynamic autoscaling, documented on Learn, creates and deletes hosts. Treat the page as vendor material, and note that its figures, such as "approximately $900 to $1,200 per month per 100 machines" for disk swapping and the customer savings it cites, are Nerdio's own claims. The same page concedes that native autoscale "works reasonably well" for small deployments with predictable usage.
- Learn says autoscale cannot be combined with Azure Automation and Logic Apps scaling on the same host pool, and dynamic scaling cannot be used with any other scaling script. Pick one scaling owner per host pool.

## Images and updates

The native route has two parts. [Custom image templates](/entity/avd-custom-image-templates/) use [Azure Image Builder](/entity/azure-image-builder/): you define what should be in the image, then submit it for a build. Learn notes that the build uses a user-assigned managed identity, needs internet access for scripts, requires a build duration, and expects custom scripts at a publicly available location such as GitHub. The finished image can be used with the [session host configuration](/entity/avd-session-host-configuration/) approach, where session host update replaces VMs in batches. The management-approaches page lists defaults of batch size 1 and logoff delay 2 minutes in the portal. The session host update page adds limits worth knowing:

- Only one update operation can run or be scheduled per host pool.
- Autoscale must be disabled on the host pool before the update starts and until it finishes, because a scaling plan enabled during an update can fail it.
- Individual session hosts cannot be updated; the page names the image, a configuration management tool or the custom PowerShell script for customisation.
- The Azure Monitor agent is not installed automatically on updated hosts, which affects Insights.
- It is available only in the global Azure cloud, not Azure Government.

On the platform side, Nerdio's [desktop image](/entity/nerdio-desktop-image/) module offers Image Staging, which "allows you to test newly created desktop images before they are used by session hosts." A staged image can be used when creating a host pool for acceptance testing with test users, and a Marketplace refresh can be scheduled. Images are stored in an Azure Compute Gallery with chosen replication regions. For image lifecycle thinking independent of the tool, see [golden image](/entity/golden-image/) practice.

## Automation and monitoring

Nerdio [scripted actions](/entity/nerdio-scripted-actions/) are PowerShell scripts that run "in the context of a Windows VM or an Azure Automation Account." Windows scripts run through the Azure Custom Script Extension. Nerdio ships default scripts, for example installing Teams or Microsoft 365 apps and enabling RDP Shortpath. Natively you would use the custom script in the session host configuration or in an image template, or your own pipelines, which Learn says require the standard management approach.

For monitoring, [AVD Insights](/entity/avd-insights/) is a dashboard on Azure Monitor Workbooks. It needs diagnostic settings on host pools and workspaces, the Azure Monitor Agent with a data collection rule on session hosts, and a Log Analytics workspace; Learn states standard Log Analytics storage charges apply and that Azure Monitor alerts must be set up separately.

## Costs, permissions and constraints

**Architecture.** Nerdio's reference architecture lists what a Marketplace deployment creates in your subscription: an automation account, SQL Server and database, Key Vault, App Service and plan, Application Insights and a storage account for encryption keys. These are Azure resources you run. The application's service principal receives Contributor permissions on the resource groups it manages, plus Reader and Backup Reader on the subscription. The installer needs Entra ID Global Admin and Azure subscription Owner rights, or an enterprise app created in advance. Native features instead need specific RBAC roles, for example Desktop Virtualization Power On Off Contributor at subscription scope for autoscale.

**Licensing.** Nerdio bills per calendar month and per unique Entra ID user, in Core or Premium edition. Premium-only features named on the billing page include multiple Entra ID tenant support, Azure Government support, advanced auto-scale, Global Pools, Executive Insights and advanced end-user self-service actions. Downgrading from Premium to Core "could result in loss of functionality," and the edition can be changed at any time.

**Native constraints.** Learn says the management approach is set at creation and cannot be changed. The session host configuration approach is for pooled host pools only, and "existing tooling designed for standard management won't work with a session host configuration." If you already use pipelines or scripts that add and replace VMs, they stay on standard management. Before running a third-party platform against a host pool that has a session host configuration, ask the vendor how the two interact; none of the sources used here states it.

## Alternatives to both

- **Native plus your own automation.** Standard management with your own pipelines and scripts keeps full control, at the cost of engineering time.
- **Windows 365.** If you need Cloud PCs rather than pooled sessions, Windows 365 is the Microsoft alternative to host pools. Nerdio's help pages say its platform covers Windows 365 as well.
- **Other management tools.** Compare any other management tool on the same task list above.

## How to decide

1. List the tasks you perform on host pools each month: scaling, patching, imaging, reporting.
2. Mark each as "native is enough" or "gap", with a measurable reason such as users hitting full hosts or hours spent rebuilding images.
3. Check the licence column: Premium-only features may be the ones you need.
4. Check that your operating model fits: standard management or session host configuration, one scaling owner per pool, and the permissions each route needs.
5. Run a pilot host pool for a few weeks and compare user experience, VM running hours and admin time against a native baseline.
6. Re-check the comparison when either side ships changes. Microsoft announced general availability of enhanced host pool management in July 2026, so comparisons written before then may describe the native side incompletely.

## Sources

Retrieved on 17 November 2026.

- [Microsoft Learn: Host pool management approaches](https://learn.microsoft.com/en-us/azure/virtual-desktop/host-pool-management-approaches)
- [Microsoft Learn: Autoscale scaling plans for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scaling-plan)
- [Microsoft Learn: Autoscale scaling plans and example scenarios](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Microsoft Learn: Session host update](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update)
- [Microsoft Learn: Custom image templates](https://learn.microsoft.com/en-us/azure/virtual-desktop/custom-image-templates)
- [Microsoft Learn: Azure Virtual Desktop Insights](https://learn.microsoft.com/en-us/azure/virtual-desktop/insights)
- [Microsoft Learn: Built-in Azure RBAC roles for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/rbac)
- [Microsoft Tech Community: Enhanced host pool management for Azure Virtual Desktop is now generally available](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
- [Nerdio help: About Nerdio Manager](https://nmehelp.getnerdio.com/hc/en-us/articles/26124301747213-About-Nerdio-Manager)
- [Nerdio help: Nerdio Manager for Enterprise reference architecture](https://nmehelp.getnerdio.com/hc/en-us/articles/26124355756941-Nerdio-Manager-for-Enterprise-Reference-Architecture)
- [Nerdio help: Overview of host pools](https://nmehelp.getnerdio.com/hc/en-us/articles/26124329605517-Host-Pools)
- [Nerdio help: Enable dynamic host pool auto-scaling](https://nmehelp.getnerdio.com/hc/en-us/articles/26124304193037-Enable-Dynamic-Host-Pool-Auto-scaling)
- [Nerdio help: Overview of desktop images](https://nmmhelp.getnerdio.com/hc/en-us/articles/26125609362573)
- [Nerdio help: Scripted actions overview](https://nmehelp.getnerdio.com/hc/en-us/articles/26124327585421)
- [Nerdio help: Default scripts for Nerdio Manager](https://nmehelp.getnerdio.com/hc/en-us/articles/26124382667021-Default-Scripts-for-Nerdio-Manager)
- [Nerdio help: NME entitlements, consumption and billing](https://nmehelp.getnerdio.com/hc/en-us/articles/26124388880397-NME-entitlements-consumption-and-billing)
- [Nerdio help: Nerdio Manager edition management](https://nmehelp.getnerdio.com/hc/en-us/articles/25499386018701-Nerdio-Manager-Edition-Management)
- [Nerdio blog (vendor material): Nerdio vs. native Azure Virtual Desktop management](https://getnerdio.com/blog/nerdio-vs-native-azure-virtual-desktop-comparison-series-auto-scaling)
