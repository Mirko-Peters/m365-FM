---
title: "Nerdio Manager for MSP explained: multi-tenant management for service providers"
summary: "Nerdio Manager for MSP is a web application a service provider installs from the Azure Marketplace in its own tenant to manage many customer tenants. Covers architecture, access, billing and Lighthouse overlap."
status: review
publish: false
author: mirko-p
date: 2026-11-18
render: v2
topics: [nerdio-manager-for-msp, nerdio]
keypoints:
  - "Nerdio Manager for MSP (NMM) is an Azure web app installed from the Azure Marketplace in the MSP's subscription. Nerdio says installation takes five to 10 minutes, then licence registration."
  - "The console has two levels: the MSP level for global settings, RBAC, templates and shared objects, and the account level for one customer, with an account selector."
  - "Customer access runs through an app registration per customer tenant. API permission model and directory privilege model form the Access Model; Least Privilege is Public Preview."
  - "Per-user billing is the default. Per-tenant billing is enabled by contacting Nerdio, and Intune-only users are not billed under the per-tenant model."
  - "Microsoft 365 Lighthouse and Azure Lighthouse cost nothing extra and overlap in part. NMM adds Nerdio's deployment, policy, app and baseline features as a paid product."
faq:
  - q: "Where does Nerdio Manager for MSP run, and who maintains it?"
    a: "It runs as an Azure App Service in the MSP's own subscription, installed from the Azure Marketplace by a user with Global Administrator in Entra ID and Owner on the subscription. Nerdio does not update it automatically. The MSP chooses when to redeploy from the Updates page, using a user with the same two roles, which changes only the MSP installation, and Nerdio says the process usually takes about five minutes."
  - q: "Is Nerdio Manager for MSP the same product as Nerdio Manager for Enterprise?"
    a: "No. Nerdio's April 2024 announcement covers NMM 5.0 and Nerdio Manager for Enterprise 6.0 as separate products. The MSP console can hold a linked account that points to a customer's stand-alone Enterprise installation, but Nerdio's page says a linked account is only a shortcut: it gives no Nerdio Manager functionality and is excluded from global features such as policy assignment."
  - q: "Do I still need Microsoft 365 Lighthouse or Azure Lighthouse?"
    a: "They are separate Microsoft services. Learn lists no additional cost for either. Microsoft 365 Lighthouse needs a partner enrolled in CSP and customer tenants of at most 2,500 licensed users in the partner's geographic region. Azure Lighthouse delegates subscriptions and resource groups. Whether NMM replaces them depends on which tasks you run and how many customers fall outside those limits."
---

Nerdio Manager for MSP, usually shortened to NMM, is a web application that a managed service provider installs in its own Azure subscription and uses to manage many customer tenants from one console. It started as an Azure Virtual Desktop product and now also covers Windows 365, Intune and other Microsoft 365 services. The sections below cover the architecture and the decisions that follow from it, not onboarding steps.

## What it is and how it grew

In a post dated 2 February 2021, Nerdio announced a public preview of NMM as a multi-tenant management product for [Azure Virtual Desktop](https://www.m365.fm/entity/azure-virtual-desktop/) and Azure IaaS, designed from the ground up and deployed through the [Azure Marketplace](https://www.m365.fm/entity/azure-marketplace/). Nerdio's announcement of NMM 5.0, dated 2 April 2024, describes it as a multi-tenant, workflow-powered platform covering Azure, Intune, Entra ID, Defender and Microsoft 365.

The scope moves quickly. Nerdio's release notes list preview releases ahead of GA ones, for example v7.0 as a preview on 4 May 2026 and v7.0.1 as GA on 13 May, and v7.3.0 on 8 September with the Granular Permission Model generally available and Least Privilege offered as a public preview. v7.4.2 (13 November 2026) is the latest release listed as GA. Items carry their own labels: v7.0 marked the Reporting Engine and User Flows GA, and PSA integration and the Tenant Assessment Wizard Public Preview. Check the label of a feature in your own version before you sell it to a customer.

[Nerdio](https://www.m365.fm/entity/nerdio/) announced [Nerdio Manager for MSP](https://www.m365.fm/entity/nerdio-manager-for-msp/) 5.0 together with [Nerdio Manager for Enterprise](https://www.m365.fm/entity/nerdio-manager-for-enterprise/) 6.0 as separate products. This article covers only the MSP product.

## Architecture: one installation, many tenants

Nerdio's installation guide names two components: the NMM web application, a hosted Azure web app that manages all MSP accounts, and the client accounts, the customer tenants managed in it. Installation runs in three phases: the Marketplace listing, an Azure Cloud Shell script, and registration with Nerdio's licensing server. Nerdio says it takes about five to 10 minutes and that the product is installed and billed through the Marketplace.

The installing user needs Global Administrator in Entra ID and Owner on the Azure subscription, and Nerdio's Azure permissions page lists the same two roles for running an update. For ongoing use, the page says any authorized Entra ID user can use the console without Entra ID or subscription roles, and that no user permissions in the customer tenant are needed. Most actions run in Nerdio Manager on behalf of the app registration.

Each customer is connected through the Nerdio Manager service principal in the customer's tenant, which needs API permissions and Microsoft Entra directory roles. For each kind of access, Nerdio offers a maximalist model and one that follows the principle of least privilege. These are two independent settings, not three models to choose from:

| Setting | Options | Status according to Nerdio |
|---|---|---|
| API permission model | Classic grants every API permission any feature could need, up front. Granular grants only the permission sets that an administrator enables per product area | Classic is legacy but still supported. Granular is generally available and the default for new accounts from version 7.3 |
| Directory privilege model | Global Admin gives the service principal the Global Administrator role. Least Privilege replaces it with six scoped Entra roles | Global Admin is the current default. Least Privilege is an opt-in Public Preview and requires Granular |

Together the two settings form the Access Model property of an account, shown as the Access Model column of the MSP-level Accounts table. Nerdio lists three supported combinations. **Classic** is Classic plus Global Admin, which is how accounts created before v7.3 started. **In Transition** is Granular plus Global Admin, the default for new accounts from v7.3. **Modern** is Granular plus Least Privilege. A new account can use Classic only if you clear the Granular option when you add or import it, and existing accounts keep their model until you migrate them. For Granular accounts, Nerdio describes the permission sets at the account level under Settings > Integrations, in the Prerequisite Model area, by selecting Configure sets under the Permission sets heading, where you switch a feature on or off and save.

Nerdio's Azure permissions page also describes a Limited Access mode, in which the account app has no Global Administrator role. At the account level the page marks it as deprecated from v7.3 in favor of the Granular and Least Privilege models. Nerdio's account management page calls the Enable limited access action irreversible, which matters for accounts that still use it. The separate MSP-level setting, for which Nerdio suggests replacing Directory.ReadWrite.All with Directory.Read.All plus User.Invite.All on the app in the MSP tenant, is not marked deprecated. Our reading: Nerdio's permissions page calls Granular combined with Global Admin the recommended starting point from v7.3, and Least Privilege should be weighed against its Public Preview status before it goes onto production accounts.

## Two levels in one console

Signing in places you at the MSP level, where you manage global settings for accounts, servers, session hosts, RBAC, templates, logs and reports. To work inside a customer, you open that account from the Accounts page and use the account selector to move between customers. Nerdio's help articles state which level a procedure starts at. Global views can combine resources such as host pools, session hosts and user sessions on one page.

Roles follow the same split. The built-in MSP-level roles are Super Admin, MSP Admin, MSP IT Admin, MSP Help Desk, MSP Billing Admin and MSP Sales. Customer-level roles are Account Admin, Account Help Desk and End User. Built-in roles cannot be changed; custom roles can be built, deny permissions override allow permissions, and access can expire.

## What the Accounts list can hold

Nerdio's account management page lists several kinds of entry:

- **Partner Center customers**, imported through a GDAP request. A pending request appears as a row until the customer's global admin approves it.
- **Accounts added directly** with the Add account action.
- **Linked Nerdio Manager for Enterprise accounts**, which are shortcuts to a customer's own installation and are excluded from billing and from global features including scripted actions, policy assignment and the Reporting Engine.

The page also lists actions such as Set IUL, which flags an Internal Use License, and Destroy, which removes only the account record; Nerdio says Azure resources must be removed manually.

## What you manage per customer

Nerdio's blog post of 5 November 2024 separates two plans. The Modern Work plan covers Microsoft 365 management and "does not include AVD management". The AVD plan covers both. Nerdio's billing page counts AVD and [Windows 365](https://www.m365.fm/entity/windows-365/) Cloud PC users, and its permissions page lists permission sets such as [Intune](https://www.m365.fm/entity/intune/), Windows 365 Business and Windows 365 Enterprise that you enable per account under the Granular model. In that model all features appear in the account's left-hand navigation pane. A feature that is enabled shows its normal screens; a feature that is not enabled shows a list of the missing prerequisites (deployment model, licenses, permissions, account features and enterprise applications), marked with a green check or a red exclamation mark.

Shared objects are a main reason to run a multi-tenant console: global images, policies and baselines assigned from the MSP level, and apps from a unified catalog. These features are a topic of their own. See [Nerdio Solution Baselines](https://www.m365.fm/entity/nerdio-solution-baselines/) and the [Unified App Catalog](https://www.m365.fm/entity/nerdio-unified-app-catalog/) for the entities.

## Billing in one paragraph

Nerdio's billing page calls per-user billing the default and says per-tenant billing is enabled by contacting a Nerdio sales representative or partner success manager. Per-tenant charges are calculated monthly on the first for the previous month, from the number of tenants and the average number of AVD and Cloud PC users. Nerdio says the tenant count currently comes from self-reporting to your Nerdio representative. A user assigned an AVD desktop or RemoteApp is billed whether or not they sign in. Intune-only users are not billed under the per-tenant model. Direct partners are billed through the Azure Marketplace; distributor partners are invoiced by their distributor. Your installation must also reach Nerdio's licensing system at IP address 52.146.28.219, so check outbound firewall rules.

## Updates and support scope

Nerdio does not update the installation for you. Its update page says releases are regular, updates are cumulative, and you can move straight to the latest GA release. The update, run by a user with the same two roles as the installation, changes only the Nerdio App Service in your tenant. Active user sessions are not interrupted, but the console is unavailable and auto-scale automation cannot act while it runs.

Nerdio's support scope page is worth reading before you take on customers. In scope are items such as host pool creation, auto-scaling, desktop images, Unified Application Management, policy and baseline deployment, and Intune device management. Out of scope are architecture guidance, VM sizing recommendations, performance troubleshooting, custom policy creation, policy troubleshooting and Winget package capture. Nerdio lists a paid Enhanced Support add-on and one free escalation of an out-of-scope ticket per partner.

## Where Microsoft's own tools overlap

- **Azure Lighthouse** is a separate service in which customers delegate subscriptions and resource groups to users in the provider's tenant. Learn says it has no extra cost, works across regions and cannot delegate between a national cloud and the public cloud.
- **Microsoft 365 Lighthouse** is a portal for CSP partners with no additional cost. Learn lists customer-tenant requirements including GDAP or DAP, at most 2,500 licensed users and the same geographic region as the partner. Tenants outside these get only a limited feature set.
- **The Intune admin center** works per tenant. A Nerdio blog post from April 2023 says native Intune has no single interface for several customer tenants, which is a vendor statement.

NMM is a paid product with its own billing, so a fair test is whether its deployment, policy, app and image features replace work you do today. If your customers are small Microsoft 365 tenants that Lighthouse already covers, the case rests on those extra features. If you run Azure Virtual Desktop or Windows 365 for the same customers, one console for both is the main argument. For an in-house team running one environment, Nerdio Manager for Enterprise is the Nerdio product to compare.

## Sources

- [Nerdio blog: Introducing Nerdio Manager for MSP (2 February 2021)](https://getnerdio.com/blog/introducing-nerdio-manager-for-msp/)
- [Nerdio blog: Unveiling Nerdio Manager for Enterprise 6 and Nerdio Manager for MSP 5 (2 April 2024)](https://getnerdio.com/blog/unveiling-nerdio-manager-for-enterprise-6-and-nerdio-manager-for-msp-5/)
- [Nerdio blog: Modern Work plans, AVD vs infrastructure management for MSPs](https://getnerdio.com/blog/modern-work-plans-avd-vs-infrastructure-management-for-msps/)
- [Nerdio help center: NMM release notes](https://nmmhelp.getnerdio.com/hc/en-us/articles/360055385832)
- [Nerdio help center: Prerequisites for installing Nerdio Manager for MSP](https://nmmhelp.getnerdio.com/hc/en-us/articles/360057684211-Prerequisites-for-installing-Nerdio-Manager-for-MSP)
- [Nerdio help center: Azure Permissions and Nerdio Manager](https://nmmhelp.getnerdio.com/hc/en-us/articles/26125608873229-Azure-Permissions-and-Nerdio-Manager)
- [Nerdio help center: Account-level Nerdio Manager service principal permissions](https://nmmhelp.getnerdio.com/hc/en-us/articles/49570059973517-Account-level-Nerdio-Manager-service-principal-permissions)
- [Nerdio help center: Manage customer account-level features and permissions](https://nmmhelp.getnerdio.com/hc/en-us/articles/39828325981709-Manage-customer-account-level-features-and-permissions)
- [Nerdio help center: Overview of User Interface](https://nmmhelp.getnerdio.com/hc/en-us/articles/26125607025293-Overview-of-User-Interface)
- [Nerdio help center: Users and roles at the MSP level](https://nmmhelp.getnerdio.com/hc/en-us/articles/26125600554765-Users-and-roles-at-the-MSP-level)
- [Nerdio help center: Overview of account management](https://nmmhelp.getnerdio.com/hc/en-us/articles/26125608568845-Overview-of-account-management)
- [Nerdio help center: Overview of Nerdio Manager Billing, Per-tenant Model](https://nmmhelp.getnerdio.com/hc/en-us/articles/32816477416717-Overview-of-Nerdio-Manager-Billing-Per-tenant-Model)
- [Nerdio help center: Update the Nerdio Manager application](https://nmmhelp.getnerdio.com/hc/en-us/articles/26125624288269-Update-the-Nerdio-Manager-application)
- [Nerdio help center: Nerdio Manager for MSP Support Scope and Partner Responsibility](https://nmmhelp.getnerdio.com/hc/en-us/articles/4420813129101-Nerdio-Manager-for-MSP-Support-Scope-and-Partner-Responsibility)
- [Nerdio: Nerdio Manager for MSP product page](https://getnerdio.com/nerdio-msp-manager/)
- [Nerdio blog: Intune for MSPs (10 April 2023)](https://getnerdio.com/blog/intune-for-msps/)
- [Nerdio help center: Overview of global images](https://nmmhelp.getnerdio.com/hc/en-us/articles/26125624483469-Overview-of-global-images)
- [Nerdio help center: Get started with Unified Application Management](https://nmmhelp.getnerdio.com/hc/en-us/articles/35395876385933-Get-started-with-Unified-Application-Management-UAM-in-Nerdio-Manager)
- [Microsoft Learn: What is Azure Lighthouse?](https://learn.microsoft.com/en-us/azure/lighthouse/overview)
- [Microsoft Learn: Microsoft 365 Lighthouse overview](https://learn.microsoft.com/en-us/microsoft-365/lighthouse/m365-lighthouse-overview)
- [Microsoft Learn: Requirements for Microsoft 365 Lighthouse](https://learn.microsoft.com/en-us/microsoft-365/lighthouse/m365-lighthouse-requirements)
