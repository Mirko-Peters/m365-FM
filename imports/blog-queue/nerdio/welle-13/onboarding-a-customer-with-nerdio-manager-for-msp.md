---
title: "Onboarding a customer with Nerdio Manager for MSP"
summary: "In Nerdio Manager for MSP you onboard a customer under Accounts > Add account after a Global Administrator and Subscription Owner of the customer tenant consents. Covers the wizard, choices and billing."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [nerdio-manager-for-msp]
keypoints:
  - "Onboarding starts under Accounts > Add account. A Global Administrator and Subscription Owner in the customer tenant consents, and Nerdio Manager creates a service principal there."
  - "You choose one or two deployment models (AVD, Windows 365 Enterprise or Business, Intune) and an identity setup; Entra ID is the only option for Intune-only accounts."
  - "An AVD account adds region, resource group and network, optional Entra Domain Services (60 to 90 minutes per Nerdio) and FSLogix storage. Intune-only accounts finish after step one."
  - "Linking Partner Center is a separate step under System > System Settings > Integrations. It does not by itself switch an installation to per-tenant billing."
  - "A Modern Work account can enable Azure Virtual Desktop later, after a subscription, resource group and network are linked. Nerdio says per-user billing then starts for users assigned to a host pool."
faq:
  - q: "Which permissions do I need in the customer's tenant to add an account?"
    a: "Nerdio's help center lists an Entra ID login in the customer's tenant with the Global Administrator and Subscription Owner roles. For an existing Active Directory you also need the domain name and an admin username and password. The user who signs in with Connect also decides which Azure subscriptions are offered, because only subscriptions accessible to that user are listed."
  - q: "How long does onboarding an AVD customer take?"
    a: "It depends on the identity setup. Nerdio's help center says setting up new Entra Domain Services typically takes 60 to 90 minutes, and the network step can take a few minutes. A 2021 Nerdio blog post gives vendor estimates of 60, 30 and 10 minutes for different starting points. Treat both as guides, not commitments to a customer."
  - q: "Can I onboard a customer without deploying virtual desktops?"
    a: "Yes. The wizard offers Endpoint Management with Intune, which manages Entra ID-joined physical or virtual endpoints. Leave the subscription as no subscription (an Intune subscription is still required) and finish with Save & done. Nerdio also describes a Modern Work plan for Microsoft 365 management without AVD management; AVD can be enabled later."
---

To onboard a customer in [Nerdio Manager for MSP](https://www.m365.fm/entity/nerdio-manager-for-msp/), sign in at the MSP level, open **Accounts**, select **Add account**, and have a user with the Global Administrator and Subscription Owner roles in the customer's Microsoft Entra ID tenant consent to the connection. The wizard then asks for the deployment model, the identity setup, an Azure region, resource group and network, and for AVD a location for FSLogix profiles.

This guide follows Nerdio's help center. Labels can differ between product versions, so compare them with your own console.

## Before you start

Nerdio's Add an Account page lists two prerequisites:

- An Entra ID login to the customer's tenant with the **Global Administrator** and **Subscription Owner** roles.
- For an existing Active Directory: the domain name and an admin username and password.

Nerdio's separate page on installing Nerdio Manager for MSP adds context for the MSP side. It says the product is installed and billed through the Azure Marketplace, generally takes five to 10 minutes, and has three phases: the Marketplace listing, an Azure CloudShell script, and registration with the Nerdio licensing server. It also says the project manager has the **super admin** role in Nerdio Manager and can grant access to the Go Live Engineer.

## Choose the deployment model and identity setup first

The first step of the wizard asks for two choices that decide which later steps you see. You can select one or two desktop deployment models:

| Model (Nerdio's label) | What Nerdio says it does |
|---|---|
| [Azure Virtual Desktop](https://www.m365.fm/entity/azure-virtual-desktop/) | Deploys personal and pooled AVD desktops |
| Windows 365 Enterprise Cloud PC (MEM-managed) | Deploys AD-joined Cloud PCs managed from the endpoint manager |
| Windows 365 Business Cloud PC (Self-managed) | Deploys Cloud PCs that are not AD-joined |
| Endpoint Management with Intune | Manages Entra ID-joined physical or virtual endpoints with [Intune](https://www.m365.fm/entity/intune/) |

Then you indicate the Active Directory setup:

| Option | When Nerdio describes it as the fit |
|---|---|
| Entra ID | No traditional AD, accepting Entra ID limitations including limited FSLogix support. The only option for Intune endpoint management |
| Use existing Active Directory | An existing domain controller; a DC VM should exist in Azure and the network's DNS servers must point to it |
| Create new Entra Domain Services | Greenfield environments that need AD DS; Nerdio Manager creates [Entra Domain Services](https://www.m365.fm/entity/entra-domain-services/) in the subscription, and Nerdio links to cost information for it |
| Use existing Entra Domain Services | Reusing a service already configured in the customer's environment; all prerequisites apply |

For the Entra ID option, Nerdio's article on Entra ID accounts adds that you cannot name a particular Entra ID: VMs join the Entra ID that the Azure subscription is connected to. You must also tick a checkbox in a warning message to confirm you understand the limitations. Nerdio's separate Add an Entra ID account page still describes the Entra ID joined feature's limitations with "while it's in preview" wording. It says FSLogix support is offered in limited scenarios and that legacy per-user MFA must be disabled. Check Microsoft's current documentation before promising a customer a specific feature set. Background on the join type is on the [Entra joined session hosts](https://www.m365.fm/entity/avd-entra-join/) page.

## Add an AVD account step by step

1. At the MSP level, go to **Accounts** and select **Add account**.
2. Under **Grant access to Entra ID Tenant**, select **Connect**. Review the permissions, select **Consent on behalf of your organization**, then **Accept**.
3. Enter an **Account Name**, usually the customer's organization name. It can be changed later.
4. Choose the **Desktop deployment models**.
5. Under **Select subscription**, pick from the subscriptions accessible to the user who signed in with **Connect**. Further subscriptions can be linked after the account exists. For Intune-only management leave **<no subscription>**; an Intune subscription is still required.
6. Choose the Active Directory setup, then select **Save & next**. Nerdio Manager creates a service principal in the customer's tenant, which can take a few minutes. For Intune-only accounts select **Save & done** instead; no further steps are needed.
7. On the Azure step, select the **Azure region** for the initial deployment, ideally closest to most users, then a resource group (existing or **Create new**) and a network. For a new network enter its name, address space, subnet name and subnet address prefix. Select **Save & next** and follow progress in **Account Provisioning Tasks** at the bottom of the page.
8. Only if you chose new Entra Domain Services: enter the domain name and a domain admin username and password, then **Save & next**. Nerdio states that setup typically takes 60 to 90 minutes.
9. Choose FSLogix profile storage: an existing Azure Files share (AD integrated), a new share, or an existing UNC path. For a new share you enter the storage account name (globally unique, lowercase, no spaces), the location (same region as the vNet and hosts), performance (Nerdio recommends Premium to avoid profile-loading bottlenecks at sign-in), provisioned capacity in GiB, and the user groups with access. Nerdio says to use a group containing all AVD users. See [FSLogix](https://www.m365.fm/entity/fslogix/) and [Azure Files](https://www.m365.fm/entity/azure-files/).
10. Select **Save & done**. The account is fully provisioned and appears on the **Accounts** page.

For a new Entra Domain Services domain name the help center sets rules (letters, numbers, periods and hyphens only; at least two segments; a prefix of 15 characters or fewer). Non-routable domains are allowed but not recommended and may cause DNS resolution problems. Nerdio Manager does not check for DNS conflicts with custom domain names.

### A worked example

A fictional customer, Contoso Dental, has 25 users and no domain controller. You pick **Azure Virtual Desktop**, **Entra ID** and tick the warning checkbox, choose West Europe because the users sit there, and name the resource group `Contoso-RG` and the network `Contoso-VNet`. Nerdio's AADJ join script article suggests this customer-name pattern with "-RG" and "-VNet". Region, names and user count are illustrative. Because Nerdio describes FSLogix support for the Entra ID option as limited, and requires legacy per-user MFA to be disabled, confirm the profile design and MFA setup with the customer before promising a user experience.

## Cloud PC accounts differ in a few places

For Windows 365, Nerdio documents a separate article. The prerequisites add an existing Active Directory. In step 1 you select **Windows 365 Enterprise Cloud PC (MEM-managed)** and **Use existing Active Directory**. The next step is called Networking and has region, resource group and network fields. The last step asks for the AD admin username and password. Nerdio says it stores these credentials securely and uses them to AD-join Cloud PCs when they are assigned to users. See [Windows 365](https://www.m365.fm/entity/windows-365/).

## Four starting points and their time estimates

A Nerdio blog post from February 2021 (page last modified January 2026) groups customers into four deployment scenarios, with vendor-stated times:

- **Greenfield**, 60 minutes or less: no Azure footprint. Nerdio creates the identity service, VNet, the domain on top of it, Azure Files share and a full AVD deployment.
- **Landing zone**, 30 minutes or less: an existing landing zone with AD or Entra Domain Services; a new Azure Files share is provisioned.
- **Existing IaaS**, 10 minutes or less: identity, VNet and file storage exist.
- **Existing AVD deployment**, 10 minutes or less: Nerdio Manager is layered on an existing environment.

These are vendor estimates. The help center's 60 to 90 minutes for new Entra Domain Services alone is a reminder not to quote 60 minutes to a customer for a greenfield build.

## After the account exists

The Azure step links the first resource group and network. More can be added later on the **Settings** page. At the MSP level, **System > System Settings > Environment > Linked Resource Groups** lets you link or create a resource group for use across customer accounts; this requires a resource group with at least one VNet in the MSP Azure tenant.

For an Entra ID account, Nerdio's AADJ join script article gives this order: configure FSLogix profile storage before adding a host pool, because the host pool creation uses the storage definition; add a desktop image; create a security group; create the host pool; configure auto-scaling and host pool properties. It also has the host pool run the scripted action `AADJWindowsCredentialManager` when hosts are created and started; see [scripted actions](https://www.m365.fm/entity/nerdio-scripted-actions/). Backups, monitoring, multifactor authentication through Conditional Access and a sign-in test follow.

A customer who starts on Microsoft 365 management can add AVD later. Nerdio's Modern Work plan is described as not including AVD management; the AVD plan covers both. For an existing Modern Work account, link a subscription, a resource group and a network, then at the account level go to **Settings > Integrations**, find **Desktop deployment model**, select **Azure Virtual Desktop** and confirm. Nerdio notes that this automatically starts per-user billing for any user assigned to a host pool and refers readers to their Partner Success Manager for AVD billing details.

## Partner Center and billing

Linking [Partner Center](https://www.m365.fm/entity/microsoft-partner-center/) is separate from onboarding a customer, and Nerdio says it is not available in Nerdio Manager for MSP: Gov Edition. You use an Azure account associated with Partner Center. At the MSP level go to **System > System Settings > Integrations**, select **Connect to Partner Center**, sign in, review the permissions, select **Consent on behalf of your organization** and **Accept**. A dialog then offers **Switch to the per-tenant model**, but the help center says linking does not enable per-tenant billing automatically. If the account fails to connect after approval, check the redirect URL, for example when you use a custom domain.

On billing, Nerdio says an installation is on per-user billing by default and that switching to per-tenant billing goes through your Nerdio sales representative or partner success manager. Per-tenant charges are calculated monthly from the number of accounts and the average number of AVD and Windows 365 users. An AVD user is anyone assigned a desktop or RemoteApp, counted once however many assignments they have. Intune-only users are not billed. The installation must be able to reach the licensing system at IP address 52.146.28.219.

## Limits and alternatives

- [Azure Lighthouse](https://www.m365.fm/entity/azure-lighthouse/) is a separate Microsoft service for delegated resource management at subscription or resource group level, with no extra cost according to Learn.
- [Nerdio Manager for Enterprise](https://www.m365.fm/entity/nerdio-manager-for-enterprise/) has a different model for several tenants: a registered app in each target tenant and role assignments such as Reader, Backup Reader and Contributor. Its documentation lists limitations, including no User Cost Attribution.
- Nerdio's help center says the subscription list shows only subscriptions the signed-in user can access, based on the user chosen when you selected **Connect**. If one is missing, check that user first. For Entra ID accounts, Nerdio's AADJ join script article also says to ensure you have the Owner role for any in-scope Azure subscriptions.

## Sources

- [Nerdio help center: Add an Account](https://nmmhelp.getnerdio.com/hc/en-us/articles/26125624156173)
- [Nerdio help center: Add a Cloud PC Account](https://nmmhelp.getnerdio.com/hc/en-us/articles/26125586381965-Add-a-Cloud-PC-Account)
- [Nerdio help center: Installing NMM Prerequisites](https://nmmhelp.getnerdio.com/hc/en-us/articles/360057684211-Installing-NMM-Prerequisites)
- [Nerdio help center: Add accounts in Nerdio Manager for MSP](https://nmmhelp.getnerdio.com/hc/en-us/articles/360057688771-NMM-Adding-Accounts)
- [Nerdio help center: Add an Entra ID account](https://nmmhelp.getnerdio.com/hc/en-us/articles/26125624127373-Add-an-Entra-ID-account)
- [Nerdio help center: Setting up an Entra ID account using Azure Files with the AADJ join script](https://nmmhelp.getnerdio.com/hc/en-us/articles/32816528823053-How-can-I-set-up-an-Entra-ID-account-using-Azure-Files-with-AADJ-join-script)
- [Nerdio help center: Overview of linked resource groups](https://nmmhelp.getnerdio.com/hc/en-us/articles/26125616250893-Overview-of-Linked-Resource-Groups)
- [Nerdio help center: Enable Azure Virtual Desktop for a Modern Work account](https://nmmhelp.getnerdio.com/hc/en-us/articles/34722321710093-Enable-Azure-Virtual-Desktop-for-a-Modern-Work-account)
- [Nerdio help center: Link a Partner Center account](https://nmmhelp.getnerdio.com/hc/en-us/articles/35074398002701-Link-a-Partner-Center-account)
- [Nerdio help center: Overview of Nerdio Manager Billing, Per-tenant Model](https://nmmhelp.getnerdio.com/hc/en-us/articles/32816477416717-Overview-of-Nerdio-Manager-Billing-Per-tenant-Model)
- [Nerdio help center (Enterprise): Multi Entra ID Support](https://nmehelp.getnerdio.com/hc/en-us/articles/29088970872333)
- [Nerdio blog: 4 customer deployment scenarios in Nerdio Manager for MSP](https://getnerdio.com/blog/4-customer-deployment-scenarios-in-nerdio-manager-for-msp/)
- [Nerdio blog: Modern Work plans, AVD vs infrastructure management for MSPs](https://getnerdio.com/blog/modern-work-plans-avd-vs-infrastructure-management-for-msps/)
- [Microsoft Learn: What is Azure Lighthouse?](https://learn.microsoft.com/en-us/azure/lighthouse/overview)
