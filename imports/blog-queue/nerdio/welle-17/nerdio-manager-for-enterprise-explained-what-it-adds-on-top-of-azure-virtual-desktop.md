---
title: "Nerdio Manager for Enterprise explained: what it adds on top of Azure Virtual Desktop"
summary: "Nerdio Manager for Enterprise is a management application that you deploy into your own Azure subscription. It does not replace Azure Virtual Desktop; it drives it through API calls and adds image, scaling, app, script, role and cost tooling in one console."
status: review
publish: false
author: mirko-p
date: 2026-11-18
render: v2
topics: [nerdio-manager-for-enterprise, nerdio]
keypoints:
  - "Nerdio Manager for Enterprise runs as a set of Azure services in your own subscription and orchestrates Azure Virtual Desktop through API integration. Microsoft still runs the AVD service itself."
  - "Native AVD covers host pools, autoscale, image templates, app attach and Insights. Nerdio puts image lifecycle, auto-scale, app deployment, scripts, roles and cost views in one console."
  - "Nerdio documents auto-scale triggers on CPU, RAM, active and available sessions. Multiple triggers, intelligent pre-stage and rolling drain mode are Premium only per its entitlement page."
  - "You take on one more application to run: its own web app, SQL database, Key Vault and Automation account, with documented sizing limits such as a maximum of 2,500 VMs per subscription per region."
  - "Savings figures such as up to 75% on Azure compute and storage are Nerdio's own claims. Model your own environment before you rely on them."
faq:
  - q: "Is Nerdio Manager for Enterprise a replacement for Azure Virtual Desktop?"
    a: "No. Nerdio describes it as a deployment, management and auto-scaling platform for Azure Virtual Desktop and Windows 365 Cloud PCs. It can connect to an existing environment or configure a new one, and it works through API calls to your tenant and subscriptions. The AVD service, the Azure VMs and the bills for them stay with Microsoft and your subscription."
  - q: "Does Nerdio Manager for Enterprise see my users' data?"
    a: "Nerdio states that it is deployed as an all-PaaS application inside your own Azure subscription, that no user data leaves the Azure environment and that there is no third-party access to the deployment. For Azure Government deployments, Nerdio's guidance adds that the billing subscription receives only aggregated user counts and usage data, with no personally identifiable information. These are vendor statements, so confirm them in your own security review."
  - q: "Can I try it before I buy it?"
    a: "Nerdio's help center says installing from the Azure Marketplace starts a fully functional 30-day trial. A separate Community Edition exists for private Azure labs, capped at 25 end users and without standard support, and Nerdio says to use trial mode for company evaluation."
---

[Nerdio Manager for Enterprise](https://www.m365.fm/entity/nerdio-manager-for-enterprise/) is a management application that runs in your own Azure subscription and drives [Azure Virtual Desktop](https://www.m365.fm/entity/azure-virtual-desktop/) (AVD) and Windows 365 through API calls. It adds image lifecycle, scaling, app deployment, scripted actions, delegated roles and cost views in one console, while Microsoft keeps running the AVD service. This article explains what that means in practice, what native AVD already does, and what you take on by adding the layer.

## What native AVD already gives you

Microsoft Learn describes AVD as a desktop and app virtualization service that runs on Azure. You manage the image and the virtual machines in your subscription, but not supporting roles such as the gateway and broker. Tools include the Azure portal, Azure CLI, Azure PowerShell, the REST API, built-in delegated access and AVD Insights.

Several things people associate with third-party tools are therefore native:

- **Autoscale.** Learn names two scaling methods. Power management autoscaling is available in Azure and Azure Government. Dynamic autoscaling is Azure only and works only on pooled host pools with session host configuration. Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, session host configuration and update, and ephemeral OS disks, in July 2026 (Tech Community). Some Learn pages, for example the scenarios and glossary pages and the module version 5.4.2-preview, still carry preview wording; check the current page before relying on a limit.
- **Images.** Custom image templates are built on Azure Image Builder: a JSON template defines source image, build properties and customizations, and the output can go to an Azure Compute Gallery.
- **Apps.** App attach attaches MSIX, Appx and App-V packages to a session instead of installing them on the host.
- **Monitoring.** AVD Insights is a workbook-based dashboard that needs a Log Analytics workspace, the Azure Monitor Agent and a data collection rule.

If your environment is one or two host pools with stable demand, this toolset may be enough. The case for an added layer is about how much of this you want to assemble and operate yourself.

## What Nerdio Manager for Enterprise is, and where it runs

Nerdio's help center calls it a deployment, management and auto-scaling platform for AVD and Windows 365 Cloud PCs. It can connect to an existing environment or configure a new deployment with a guided wizard. Nerdio states that it is an all-PaaS application inside your own Azure subscription.

The reference architecture lists the pieces you end up owning:

| Component | Role according to Nerdio |
|---|---|
| App Service plan and web app | Runs the management application |
| Entra ID enterprise app registration | Carries the API permissions |
| Azure SQL database | A new, dedicated PaaS instance |
| Azure Key Vault | Listed among the components; no purpose is given there |
| Storage accounts | Transient scripts, temporary VHDs, boot diagnostics and database encryption keys |
| Azure Automation account | Update runs and runbook-based scripted actions |
| Log Analytics workspaces | Listed among the components; no purpose is given there |
| Application Insights | Logging exceptions and API utilization statistics |

Nerdio says the core infrastructure is a self-contained Azure application (a web app) with supporting components, and that in multi-subscription deployments it orchestrates activities through API integration with the tenant and subscriptions. It manages VM lifecycle, auto-scaling, scripted actions, image creation and versioning, application deployment, [FSLogix](https://www.m365.fm/entity/fslogix/) profiles and Azure Files or Azure NetApp Files.

Permissions matter for security review. Nerdio documents Reader and Backup Reader at subscription level and Contributor on each resource group it manages. For installation, the preparation page recommends subscription Owner plus either Global Administrator or Privileged Role Administrator combined with Cloud Application Administrator. It adds that Global Administrator is not required if another Global Administrator can grant consent to the permissions, while subscription Owner is. The reference architecture names Global Administrator and subscription Owner for the install script, or a split installation with Global Administrator for Entra ID and Owner for the subscription. Nerdio's permissions page says these elevated roles are needed only for installation and initial configuration, but some configuration actions still need the signed-in user to hold Azure roles, for example Owner on a resource group that is being linked or Contributor on the resource group for a new host pool. For ongoing use, Nerdio says no user permissions in Azure are required to manage the configured AVD environment via Nerdio Manager. The page adds that most actions in Nerdio Manager run on Nerdio Manager on behalf of the signed-in user. The preparation page also requires a funded subscription and a pre-created VNet and subnet, and lists seven resource providers (Microsoft.DesktopVirtualization, Compute, Storage, Automation, RecoveryServices, SQL and Insights).

## What it adds, area by area

The table compares native AVD with what Nerdio documents. Rows that read "claims" rest on Nerdio's own product page; the other statements come from its help center.

| Area | Native AVD | Nerdio Manager for Enterprise |
|---|---|---|
| Scaling | Power management and dynamic autoscaling with scaling plans | Auto-scale on CPU or RAM usage, average active sessions, available sessions or user-driven start, with scale-in aggressiveness (High, Medium, Low). Nerdio's entitlement page lists multiple triggers (up to three combined), intelligent pre-stage and rolling drain mode as Premium only |
| Images | Custom image templates, Azure Image Builder, Compute Gallery | Create or import desktop images and manage lifecycle in one portal; custom Azure images in your subscription can build new host pools or re-image existing ones |
| Scripts | Your own PowerShell, runbooks or Azure CLI | Scripted actions: Windows scripts run on a VM through the Custom Script Extension, Azure runbooks run in the Automation account; triggers include provisioning, re-image, start, stop and removal of hosts, plus bulk runs with a failure threshold |
| Apps | App attach packages, images | Claims policy-driven installation and updates of modern and legacy applications from any repository to images, session hosts, personal desktops and Intune-managed devices. The reference architecture names WinGet as a package repository for scripted actions; the SCCM integration page says that feature is Premium only |
| Roles | Azure RBAC with Desktop Virtualization roles | Nerdio roles on top, including custom roles |
| Visibility | AVD Insights | Claims agentless real-time insights across AVD, Windows 365 and Intune. The product page also lists a cost modeler and Nerdio Advisor as separate features |

Two points deserve emphasis. First, native autoscale also reacts to load: Learn's scenarios page describes a capacity threshold per schedule phase, the share of used host pool capacity above which autoscale turns on more session hosts, together with a minimum percentage of hosts. Nerdio documents further triggers (CPU, RAM, average active sessions, available sessions and user-driven start) and, in the Premium edition, combinations of them. The [comparison article](https://www.m365.fm/community/u/mirko-p/blog/nerdio-auto-scaling-vs-native-avd-autoscale-a-fair-comparison/) goes through the differences. Second, the edition decides what you get: Nerdio's entitlement page lists Advanced Auto-scale and several related items as Premium only, and Azure Government support appears there as Premium only too, although the pricing page ticks it for both editions. [The Core vs Premium article](https://www.m365.fm/community/u/mirko-p/blog/nerdio-manager-for-enterprise-editions-core-vs-premium/) lists the items and the places where Nerdio's pages disagree.

## Windows 365, Intune and hybrid hosting

Nerdio also manages [Windows 365](https://www.m365.fm/entity/windows-365/) Cloud PCs. Its help page says the user who enables Windows 365 must be a Global Administrator, the tenant needs an Intune license and a Windows 365 license, and the switch is found under **System > Settings > Integrations** by configuring Intune. A **Cloud Desktops > Windows 365** menu then appears with Enterprise, Flex Dedicated, Flex Shared and Cloud Apps. Learn's what's new in Windows 365 Enterprise page records that Windows 365 Frontline was renamed Windows 365 Flex in the week of 4 May 2026, so older material may still say Frontline.

For session hosts outside Azure, Nerdio's host pool page lists an AVD Hybrid hosting location on Azure Local or Nutanix AHV. Microsoft's own options for running session hosts outside Azure datacenters include Azure Virtual Desktop Hybrid, which Learn's what's new in Azure Virtual Desktop page lists as generally available in September 2026, and Azure Virtual Desktop on Azure Local.

## What you take on

- **Another application to run.** It has its own web app, database and update path. Nerdio's reference architecture sets the SQL database collation to Latin1_General_CP1_CI_AS, with S1 as the default tier, and suggests a 100 DTU database and at least an S3 or P2V2 App Service plan from 200 session hosts.
- **Documented limits.** The reference architecture says Nerdio Manager supports a maximum of 2,500 VMs per subscription per region, in line with Microsoft guidance. A separate recommendation in the same page says Microsoft recommends no more than 2,500 VMs per Azure subscription when auto-scaling is enabled. Nerdio also advises 100 or fewer session hosts per resource group. It calls multi-tenant deployments advanced and recommends talking to its support team first.
- **Cloud differences.** Nerdio can be deployed in an Azure Government tenant, but billing must go through a commercial or partner tenant and User Cost Attribution is not available there.
- **A second charge.** Nerdio bills each unique Entra ID user once per calendar month, on top of Azure costs. Charges for Marketplace customers appear on the Microsoft invoice.
- **Vendor figures.** Nerdio's help center says Azure compute and storage costs can be reduced by up to 75%, and its comparison page cites about 55% from auto-scale. Neither is independently verified. Autoscale is native too, so the relevant comparison is Nerdio against a well-configured scaling plan, not against always-on hosts.

## When it fits, and when native may be enough

Nerdio's pricing and product pages name no minimum environment size at which the layer pays off. Our reading: it is easier to justify where several admins share many host pools, images are rebuilt regularly, app delivery is a real workload, or finance wants cost per user, because those are the areas where Nerdio documents image lifecycle, Unified Application Management and user cost attribution. It is harder to justify where there are few host pools, a team already comfortable with scaling plans and image templates, and no need for the Premium-only functions. The article [Native Azure tooling or a management platform for AVD](https://www.m365.fm/community/u/mirko-p/blog/native-azure-tooling-or-a-management-platform-for-avd-what-each-covers/) compares the two approaches in more detail. Nerdio's trial allows a test: Marketplace installation starts a 30-day trial, and the Community Edition is limited to private labs.

## Sources

- [Nerdio help center (Enterprise): About Nerdio Manager](https://nmehelp.getnerdio.com/hc/en-us/articles/26124301747213-About-Nerdio-Manager)
- [Nerdio help center (Enterprise): Nerdio Manager for Enterprise reference architecture](https://nmehelp.getnerdio.com/hc/en-us/articles/26124355756941-Nerdio-Manager-for-Enterprise-reference-architecture)
- [Nerdio help center (Enterprise): Preparation and Prerequisites](https://nmehelp.getnerdio.com/hc/en-us/articles/28419295581709-Preparation-and-Prerequisites)
- [Nerdio help center (Enterprise): Azure Permissions and Nerdio Manager](https://nmehelp.getnerdio.com/hc/en-us/articles/25499388177421)
- [Nerdio help center (Enterprise): Enable dynamic host pool Auto-scaling](https://nmehelp.getnerdio.com/hc/en-us/articles/26124304193037-Enable-Dynamic-Host-Pool-Auto-scaling)
- [Nerdio help center (Enterprise): Host Pools](https://nmehelp.getnerdio.com/hc/en-us/articles/26124329605517-Host-Pools)
- [Nerdio help center (Enterprise): Desktop Images](https://nmehelp.getnerdio.com/hc/en-us/articles/48283774944141-Desktop-Images)
- [Nerdio help center (Enterprise): Scripted actions overview](https://nmehelp.getnerdio.com/hc/en-us/articles/26124327585421)
- [Nerdio help center (Enterprise): Enable and configure Cloud PCs](https://nmehelp.getnerdio.com/hc/en-us/articles/25499404997901)
- [Nerdio help center (Enterprise): Subscribe to a License of Nerdio Manager](https://nmehelp.getnerdio.com/hc/en-us/articles/25499377095053-Subscribe-to-a-License-of-Nerdio-Manager)
- [Nerdio help center (Enterprise): NME entitlements consumption and billing](https://nmehelp.getnerdio.com/hc/en-us/articles/26124388880397-NME-entitlements-consumption-and-billing)
- [Nerdio help center (Enterprise): Nerdio Manager in Azure Government: What to know](https://nmehelp.getnerdio.com/hc/en-us/articles/40495096260493-Nerdio-Manager-in-Azure-Government-What-to-know)
- [Nerdio help center (Enterprise): UAM: SCCM integration](https://nmehelp.getnerdio.com/hc/en-us/articles/26124368428045-Unified-Application-Management-SCCM-Integration)
- [Nerdio help center (Enterprise): Nerdio Manager Community Edition](https://nmehelp.getnerdio.com/hc/en-us/articles/26124393943949-Nerdio-Manager-Community-Edition)
- [Nerdio: Nerdio Manager for Enterprise](https://getnerdio.com/nerdio-manager-for-enterprise)
- [Nerdio: Nerdio Manager for Enterprise vs. AVD through portal](https://getnerdio.com/guide/nerdio-manager-for-enterprise-vs-avd-through-portal/)
- [Microsoft Learn: What is Azure Virtual Desktop?](https://learn.microsoft.com/en-us/azure/virtual-desktop/overview)
- [Microsoft Learn: Autoscale scaling plans and example scenarios in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Microsoft Learn: Azure Virtual Desktop on Azure Local](https://learn.microsoft.com/en-us/azure/virtual-desktop/azure-local-overview)
- [Microsoft Learn: Custom image templates](https://learn.microsoft.com/en-us/azure/virtual-desktop/custom-image-templates)
- [Microsoft Learn: App attach overview](https://learn.microsoft.com/en-us/azure/virtual-desktop/app-attach-overview)
- [Microsoft Learn: Enable Insights to monitor Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/insights)
- [Microsoft Learn: What's new in Windows 365 Enterprise](https://learn.microsoft.com/en-us/windows-365/enterprise/whats-new)
- [Microsoft Learn: What is Windows 365 Flex?](https://learn.microsoft.com/en-us/windows-365/enterprise/introduction-windows-365-flex)
- [Microsoft Tech Community: Enhanced host pool management for Azure Virtual Desktop is now generally available](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
