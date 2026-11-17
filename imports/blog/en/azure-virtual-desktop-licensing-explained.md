---
title: "Azure Virtual Desktop licensing explained"
summary: "Azure Virtual Desktop costs come from two sources: the Azure resources you consume and the license that gives each user access rights. Internal users need an eligible Windows, Microsoft 365 or RDS license, and external customers need per-user access pricing on an enrolled Azure subscription."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [azure-virtual-desktop, microsoft-365-e3]
keypoints:
  - "Learn splits Azure Virtual Desktop costs into Azure resource consumption (VMs, storage, networking) and licensing. The license is a per-user access right; for eligible Windows, Microsoft 365 and RDS licenses it is billed through licensing channels."
  - "For Windows 10 and 11 session hosts, internal users are covered by Microsoft 365 E3, E5, A3, A5, F3 or Business Premium, Windows Enterprise E3 or E5, Windows Education A3 or A5, or Windows VDA per user. Windows Server session hosts need an RDS CAL with Software Assurance or an RDS User Subscription License."
  - "External users cannot use those licenses. They are covered by per-user access pricing, charged through an enrolled Azure subscription for each user who connects in the billing month. It is not available for Windows Server session hosts."
  - "Microsoft 365 E3 grants Azure Virtual Desktop access rights in your tenant, including for B2B collaborators who are assigned the license in your tenant. A license in one tenant does not carry over to another tenant of a multitenant organization."
  - "Per-user access pricing covers Azure Virtual Desktop and FSLogix access rights only. It does not include Microsoft Office, Microsoft Defender XDR or Universal Print."
faq:
  - q: "Does Microsoft 365 E3 include Azure Virtual Desktop?"
    a: "Microsoft 365 E3 grants the access rights for Windows 10 and Windows 11 Enterprise session hosts, including multi-session, for internal commercial purposes. It does not pay for the Azure VMs, storage or networking that run the session hosts, and it does not cover Windows Server session hosts, which need RDS licensing."
  - q: "Can a customer or partner who is not an employee use my Azure Virtual Desktop deployment under my Microsoft 365 licenses?"
    a: "Not for external commercial purposes. Microsoft Learn says the eligible Windows, Microsoft 365 or RDS licenses cover internal purposes only, even for identities created in your own tenant. External commercial use requires per-user access pricing, which you enable by enrolling an Azure subscription. B2B collaborators are a different case: Learn says to assign them a license in your tenant."
  - q: "Do I pay twice if a licensed internal user connects through a subscription that is enrolled in per-user access pricing?"
    a: "Learn warns that users with separate assigned licenses are also charged by Azure Virtual Desktop in an enrolled subscription. For internal users that you have already licensed, Microsoft recommends a separate subscription that is not enrolled in per-user access pricing."
---

Azure Virtual Desktop has two separate cost items: the Azure infrastructure you run, and the license that entitles each user to connect. For internal employees the license is usually one you already own, for example Microsoft 365 E3 or E5 for Windows 10 or 11 session hosts. For external customers the license is replaced by per-user access pricing, which you enable on an Azure subscription. This guide sets out which license covers which session host operating system, how external access works, and what the licenses do not pay for.

Licensing terms change, so use the Learn pages cited at the end for the current wording, and take prices only from the Azure pricing page. This article gives no price figures.

## Two sources of cost

Microsoft Learn's page [Understand and estimate costs for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/understand-estimate-costs) says Azure Virtual Desktop costs come from two sources: underlying Azure resource consumption and licensing. The Azure pricing page for the service says the same in other words: pricing includes user access rights and the Azure infrastructure costs.

- **Resource consumption** covers session host VM instances, managed disks for the operating system and data, and network bandwidth. Learn adds that VM instances usually cost the most. Related services add their own charges: Azure Monitor log data for Azure Virtual Desktop Insights, Azure Files or Azure NetApp Files for [FSLogix](/entity/fslogix/) profile containers and app attach, and an identity provider such as [Microsoft Entra ID](/entity/entra-id/) with or without domain controllers.
- **Licensing** gives the user the right to access Azure Virtual Desktop. For internal commercial purposes you must buy an eligible license for each user who accesses it. For external commercial purposes, per-user access pricing lets you pay for access rights on behalf of external users.

Learn says costs are charged to the organization that owns the deployment, not to the end users.

## Internal users: which license for which operating system

The [licensing page](https://learn.microsoft.com/en-us/azure/virtual-desktop/licensing) groups the 64-bit session host operating systems into two rows.

| Session host operating system | Licenses that cover internal users |
|---|---|
| Windows 11 Enterprise multi-session, Windows 11 Enterprise, Windows 10 Enterprise multi-session, Windows 10 Enterprise | Microsoft 365 E3, E5, A3, A5, F3, Business Premium or Student Use Benefit; Windows Enterprise E3 or E5; Windows Education A3 or A5; Windows VDA per user |
| Windows Server 2025, 2022, 2019, 2016 | Remote Desktop Services (RDS) Client Access License with Software Assurance, per user or per device; RDS User Subscription Licenses |

The practical consequences:

- A tenant on [Microsoft 365 E3](/entity/microsoft-365-e3/) or [E5](/entity/microsoft-365-e5/) already holds the access rights for Windows client session hosts, including [multi-session](/entity/windows-enterprise-multi-session/). So do tenants on [Microsoft 365 F3](/entity/microsoft-365-f3/) and [Business Premium](/entity/microsoft-365-business-premium/), according to the same table. Check the exact SKU of each user rather than assuming a plan name implies the right.
- Windows Server session hosts are licensed through RDS, not through Microsoft 365. A Microsoft 365 license does not appear in that row of the table.
- If your license entitles you to Azure Virtual Desktop, you do not install or apply a separate license for the access right itself.
- The Azure pricing page carries a footnote about access from non-Windows Pro endpoints. Read it before you plan Mac or thin-client fleets.
- Licenses and session hosts are independent: the license is for the user, and the VMs are bought as Azure resources.

### Applying the Windows license to session host VMs

Separate from the user's access right, the Azure VM itself must carry the Windows license setting. Learn's [apply Windows license](https://learn.microsoft.com/en-us/azure/virtual-desktop/apply-windows-license) page says that creating the host pool and VMs in the Azure portal, or from the GitHub Azure Resource Manager template, applies it automatically. For VMs you built another way, it gives this PowerShell for Windows client VMs:

```powershell
$vm = Get-AzVM -ResourceGroup <resourceGroupName> -Name <vmName>
$vm.LicenseType = "Windows_Client"
Update-AzVM -ResourceGroupName <resourceGroupName> -VM $vm
```

A licensed VM shows `LicenseType : Windows_Client` in the output of `Get-AzVM`, and an unlicensed one shows an empty value. Windows Server session hosts need a Remote Desktop Services license server reachable from the hosts, on-premises or in Azure. Learn also lists a known limitation: host pool creation might assign an incorrect license type to a Windows Server session host.

## External users: per-user access pricing

Learn says the Windows, Microsoft 365 and RDS licenses above cover internal purposes only, even for identities you create in your own tenant. For external commercial purposes, such as offering desktops or apps to your customers in a software-as-a-service scenario, you use **per-user access pricing**. It is not available for Windows Server session hosts.

How it works, according to Learn:

- You enroll an Azure subscription. In the Azure portal: search for **Azure Virtual Desktop**, open the overview page, select **Per-user access pricing**, check the subscription, select **Enroll**, review the terms and select **Enroll** again. Enrollment can take up to an hour, and the column changes from **Enrolling** to **Enrolled**. All subscription types are applicable, including Enterprise Agreement, Cloud Solution Provider and Microsoft Customer Agreement. External users cannot connect until the subscription is enrolled.
- You are billed through an Azure meter, on top of VM, storage and other Azure charges.
- Only users who connect at least once in the billing month are charged. Each gets a flat charge per billing cycle, regardless of the hours used.
- The tier is assigned automatically each cycle: **Apps** for a user who accesses at least one published [RemoteApp](/entity/avd-remoteapp/) but no published full desktop, and **Desktops + apps** for a user who accesses at least one published full desktop.
- At most one charge per user per billing period, even across several subscriptions in the same tenant.
- Per-user access pricing does not currently support Citrix DaaS or Omnissa Horizon Cloud.

The pricing figures are on the [Azure Virtual Desktop pricing](https://azure.microsoft.com/en-us/pricing/details/virtual-desktop/) page; check the live values in your currency.

### Do not mix the two models in one subscription

Learn's warning is specific: users who already have a separate assigned license are also charged by Azure Virtual Desktop in an enrolled subscription. For internal users you have already licensed, it recommends a separate subscription that is not enrolled. Per-user access pricing is for external commercial purposes only, and it is not a way to enable guest accounts for internal use.

### What per-user access pricing does not include

Learn says it is not a full replacement for a Windows or Microsoft 365 license. It includes access rights to Azure Virtual Desktop and FSLogix. It does not include Microsoft Office, Microsoft Defender XDR or Universal Print. Learn names three ways for external users to get Office: they sign in with their own Office account, you resell Office through a Cloud Solution Provider, or you distribute it through a Service Provider License Agreement.

## Contractors, partners and multiple tenants

Learn's rules for people from other organizations are short:

- Anyone accessing Azure Virtual Desktop or other online services must be licensed, including contractors, unless the online service terms say otherwise. Licenses in the collaborator's home tenant generally do not grant entitlements in your tenant.
- For B2B collaborators, buy the same kind of license as for internal users and assign it to the collaborator's identity in your Microsoft Entra ID tenant. Learn's example: Microsoft 365 E3 grants Azure Virtual Desktop access rights in your tenant, plus Entra ID P1, Microsoft 365 Apps, Intune Plan 1 and Defender for Endpoint Plan 1 entitlements.
- In a multitenant organization, a license assigned in tenant A does not grant Azure Virtual Desktop rights in tenant B. Buy a license per user, per tenant where access is needed. The exception Learn names is Microsoft Entra ID P1, where one license per employee per multitenant organization is required.

## FSLogix is licensed separately

Profile containers are not covered by the Azure Virtual Desktop license table alone. Learn's [FSLogix prerequisites](https://learn.microsoft.com/en-us/fslogix/overview-prerequisites) page lists the licenses that make a user eligible: Microsoft 365 E3 and E5, A3 and A5 or Student Use Benefits, F1 and F3, and Business; Windows 10 Enterprise E3 and E5; Windows 10 Education A3 and A5; RDS CAL; RDS SAL; and the Azure Virtual Desktop per-user access license. The lists differ in wording: the FSLogix page says "Microsoft 365 Business", the Azure Virtual Desktop page says "Business Premium", and the FSLogix page lists F1 and the Azure Virtual Desktop page does not. Compare the two pages for your exact SKUs before you rely on a plan name. The FSLogix page adds that FSLogix may be used in any public or private data center or cloud, as long as the user is properly licensed.

## Other cases on the licensing page

- **Dev/Test:** in an Azure Dev/Test subscription, Learn says end users may connect without separate license entitlement to perform acceptance tests or provide feedback.
- **Azure Local:** VMs must be licensed and activated before use, with Azure verification for VMs for the Windows client multi-session and Windows Server 2022 Datacenter: Azure Edition images.
- **Activation:** make sure the Windows license on session hosts is assigned correctly in Azure and the OS is activated.

## A short checklist

1. List who connects: employees, contractors, partners, customers.
2. For each internal user, record the license SKU and compare it with the table above for the session host operating system.
3. Windows client session hosts are covered by the Microsoft 365 and Windows licenses in the table; plan RDS licensing if you need Windows Server hosts.
4. For external users, decide whether a dedicated subscription will be enrolled in per-user access pricing, and keep internal users out of it.
5. For each B2B collaborator, assign a license in your tenant.
6. Estimate the Azure side with the Azure Pricing Calculator: Learn says to open it, select the **Compute** tab and select **Azure Virtual Desktop**, then enter users, hours, concurrency, storage and networking. Factor internal licensing into the total separately, as Learn says.
7. Track real costs with Microsoft Cost Management and Azure Virtual Desktop Insights, and review whether autoscale, savings plans or reserved VM instances apply.

## Sources

Retrieved on 17 November 2026.

- [Microsoft Learn: Licensing Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/licensing)
- [Microsoft Learn: Prerequisites for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/prerequisites)
- [Microsoft Learn: Enroll in per-user access pricing](https://learn.microsoft.com/en-us/azure/virtual-desktop/enroll-per-user-access-pricing)
- [Microsoft Learn: Understand and estimate costs for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/understand-estimate-costs)
- [Microsoft Learn: Apply Windows license to session host virtual machines](https://learn.microsoft.com/en-us/azure/virtual-desktop/apply-windows-license)
- [Microsoft Learn: FSLogix prerequisites and licensing](https://learn.microsoft.com/en-us/fslogix/overview-prerequisites)
- [Azure: Azure Virtual Desktop pricing](https://azure.microsoft.com/en-us/pricing/details/virtual-desktop/)
