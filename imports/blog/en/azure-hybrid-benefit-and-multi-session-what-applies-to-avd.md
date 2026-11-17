---
title: "Azure Hybrid Benefit and multi-session: what applies to AVD"
summary: "On Azure Virtual Desktop, Windows 11 Enterprise multi-session hosts get their Windows license through the user's eligible license and the Windows_Client license type, not through Azure Hybrid Benefit for Windows Server. The Windows Server benefit is relevant only for session hosts that run Windows Server, which also need Remote Desktop Services client access licenses."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [azure-hybrid-benefit, azure-reservations]
keypoints:
  - "Three layers are separate: the user's access right, the Windows license on the session host VM (LicenseType), and for Windows Server hosts the RDS client access license."
  - "For Windows 11 and Windows 10 Enterprise multi-session, an eligible license such as Microsoft 365 E3 or Windows VDA per user entitles the user, and the VM carries LicenseType Windows_Client. Learn documents the Windows_Server license type on its Azure Hybrid Benefit for Windows VMs page, and Windows_Client on the apply-license page."
  - "Creating session hosts through the Azure Virtual Desktop service applies the license automatically. VMs built outside it, for example when created with PowerShell or the Azure CLI, may need the license applied by hand."
  - "Windows Server session hosts need an RDS CAL with Software Assurance or an RDS User Subscription License, and a reachable RDS license server. Per-user access pricing is not available for Windows Server."
  - "Reservations and savings plans do not cover software. Learn says the Windows software meters are charged for Windows VMs unless Azure Hybrid Benefit covers them; for multi-session hosts with Windows_Client the Learn pages cited under Sources do not say whether such a meter appears, so check cost analysis."
faq:
  - q: "Can I use my Windows Server core licenses to cover Windows 11 multi-session session hosts?"
    a: "Learn's Azure Hybrid Benefit for Windows Server pages describe Windows Server core licenses for VMs running Windows Server. For Windows 11 multi-session, Learn's licensing table lists user licenses such as Microsoft 365 E3 or Windows VDA per user, and the VM license type is Windows_Client. Neither Learn's Azure Hybrid Benefit for Windows Server page nor its Azure Hybrid Benefit for Windows VMs page describes Windows Server core licenses as the entitlement for multi-session hosts."
  - q: "Do I need an RDS CAL for Windows 11 multi-session?"
    a: "Learn's licensing table lists RDS client access licenses only in the row for Windows Server 2025, 2022, 2019 and 2016 session hosts. The row for Windows 10 and 11 Enterprise and multi-session lists Microsoft 365, Windows Enterprise, Windows Education and Windows VDA per user licenses instead."
  - q: "How do I check which license type a session host VM has?"
    a: "Run Get-AzVM for the VM and read the LicenseType field. Learn shows Windows_Client for a licensed Windows client session host, and a blank field means no license type is set. For Windows Server VMs with Azure Hybrid Benefit the value is Windows_Server."
---

On Azure Virtual Desktop, Windows 11 Enterprise multi-session session hosts are licensed through the user's eligible license, and the VM carries the license type `Windows_Client`. Azure Hybrid Benefit for Windows Server, which uses on-premises core licenses and the `Windows_Server` license type, matters only if your session hosts run Windows Server. This article separates the licensing layers, shows how to check and fix the setting on each host, and lists the points that the Learn pages cited under Sources leave open, so you know where to confirm your own agreement.

## Three licensing layers, not one

A session host involves three licensing questions that are easy to blur together:

| Layer | Question | Where Learn answers it |
|---|---|---|
| User access right | Is each user entitled to use Azure Virtual Desktop? | Licensing Azure Virtual Desktop |
| Windows license on the VM | Is the VM's Windows license applied correctly in Azure? | Apply Windows license to session host VMs |
| Client access license | For Windows Server hosts: does each user or device have an RDS CAL? | RDS client access licenses |

[Azure Hybrid Benefit](/entity/azure-hybrid-benefit/) touches the second layer, and only for Windows Server. Learn's [Windows Server benefit page](https://learn.microsoft.com/en-us/windows-server/get-started/azure-hybrid-benefit) is about on-premises Windows Server core licenses with active Software Assurance or qualifying subscription licenses. For what the benefit does on the bill, see the companion article "Azure Hybrid Benefit for Windows: how it lowers VM cost".

## Windows 11 multi-session session hosts

Start with the user. The [licensing page](https://learn.microsoft.com/en-us/azure/virtual-desktop/licensing) lists, in one row, Windows 11 Enterprise multi-session, Windows 11 Enterprise, Windows 10 Enterprise multi-session and Windows 10 Enterprise. For internal commercial purposes the eligible licenses are Microsoft 365 E3, E5, A3, A5, F3, Business Premium or Student Use Benefit, Windows Enterprise E3 or E5, Windows Education A3 or A5, and Windows VDA per user. For external commercial purposes the row lists per-user access pricing by enrolling an Azure subscription. In that table multi-session is listed in the same row as single-session, with the same eligible licenses.

Then the VM. Learn's apply-license page says customers who are properly licensed to run Azure Virtual Desktop workloads can apply a Windows license to their session host VMs and run them without paying for another license. The license type that page shows for Windows client VMs is `Windows_Client`. The related Learn page on Windows 11 multitenant hosting rights says that, for customers with Windows 11 Enterprise E3 or E5 per user or Azure Virtual Desktop access per user, the rights allow you to bring your Windows 11 licenses to the cloud and run Windows 11 VMs on Azure without paying for another license. It lists Windows 11 Enterprise multi-session among the operating systems and says users must hold one of the listed subscription licenses for any production workload.

Where the license is applied automatically:

- Creating a host pool and its session hosts in the Azure portal applies the license automatically.
- The Azure Resource Manager template on GitHub for creating a host pool also applies it.
- The host pool creation article says the license is applied automatically when you create session hosts by using the Azure Virtual Desktop service, but that you might have to apply it separately if you create session hosts outside the service.

The license applies to any Windows or Windows Server VM that is registered as a session host in a host pool and receives user connections. Learn says it does not apply to VMs that run as file share servers, domain controllers and so on.

### Check and fix the setting

1. Check one VM with `Get-AzVM -ResourceGroupName <resourceGroupName> -Name <vmName>`. A licensed Windows client VM shows `LicenseType : Windows_Client`. An unlicensed one shows a blank `LicenseType`.
2. If it is blank on a Windows client session host, Learn's commands apply the license:

```powershell
$vm = Get-AzVM -ResourceGroup <resourceGroupName> -Name <vmName>
$vm.LicenseType = "Windows_Client"
Update-AzVM -ResourceGroupName <resourceGroupName> -VM $vm
```

3. List the licensed hosts in a subscription with `Get-AzVM | Where-Object {$_.LicenseType -like "Windows_Client"} | Select-Object ResourceGroupName, Name, LicenseType`. Compare the output with your host pool inventory to find hosts that are missing.

Learn says these directions apply to Windows client VMs, not Windows Server VMs. In the portal VM list, the **OS licensing benefit** column shows **Azure Hybrid Benefit for Windows**, **Not enabled** or **Windows client with multi-tenant hosting**. The third state belongs to the Windows client mechanism. The `Windows_Server` value and this column are documented on Learn's [VM page for Azure Hybrid Benefit](https://learn.microsoft.com/en-us/azure/virtual-machines/windows/hybrid-use-benefit-licensing), while `Windows_Client` is documented on the apply-license page; the Windows Server benefit page itself is about core licenses.

### What this means for cost

Three pages frame the cost side, and they leave one question to your own billing data: the Azure Virtual Desktop pricing page on azure.microsoft.com and two Learn pages.

- The [Azure Virtual Desktop pricing page](https://azure.microsoft.com/en-us/pricing/details/virtual-desktop/) carries a footnote that Azure Virtual Desktop VMs for Windows 11 and Windows 10, single-session and multi-session, are charged at Linux compute rates. That footnote sits in the page's section for external users (Remote App Streaming), so confirm in your own price sheet how it applies to internal deployments.
- Learn's reservation page says that for Windows VMs without Azure Hybrid Benefit you are charged for Windows software, and the compute savings plan page says savings plans do not cover software costs. Neither page says whether a multi-session host with `Windows_Client` shows a Windows software meter.

So the rule for multi-session hosts is to read the meters. Open cost analysis in [Microsoft Cost Management](/entity/microsoft-cost-management/), filter to one multi-session host, and check whether a Windows software meter appears next to the compute meter. If it does and the license type is `Windows_Client`, ask your licensing partner or Microsoft support before buying anything, because the Learn pages cited under Sources do not describe Windows Server core licenses as the entitlement for client hosts. See also [Windows Enterprise multi-session](/entity/windows-enterprise-multi-session/) for the operating system itself.

## Windows Server session hosts

For Windows Server 2025, 2022, 2019 and 2016 session hosts the user-side licenses are different: an RDS client access license with Software Assurance (per user or per device) or RDS User Subscription Licenses. Per-user access pricing for external users is not supported for Windows Server operating systems. Learn's [RDS CAL page](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/rds-client-access-license) says each user and device that connects to a session host or Azure Virtual Desktop session host running Windows Server needs an RDS CAL, and the session host requests it from a Remote Desktop Licensing server. There is a licensing grace period of 120 days during which no license server is required. The apply-license page adds that a license server must be reachable from the hosts, on premises or in Azure. The host pool creation article repeats the point: Windows Server session hosts need an RDS CAL issued from an RDS license server.

Where Azure Hybrid Benefit for Windows Server enters:

- For a VM running Windows Server, the benefit makes the Windows Server license covered, so you pay the base compute rate. Eligibility requires Windows Server Standard or Datacenter core licenses with active Software Assurance or qualifying subscription licenses, with at least 8 core licenses per VM. A 4-core session host still needs 8, and a 16-core host needs 16.
- Learn's known-limitation note on the apply-license page says host pool creation might automatically assign an incorrect license type to a Windows Server session host, and points to the Azure Hybrid Benefit conversion steps to change it. That is the practical reason to check `LicenseType` on Server hosts. With the benefit in place the value is `Windows_Server`, set with `az vm update --resource-group myResourceGroup --name myVM --set licenseType=Windows_Server` or the PowerShell pattern shown above with `Windows_Server`.
- Plan for CALs as well: Learn lists the RDS CAL as the user license for Windows Server session hosts, and each connecting user or device needs one. The benefit pages describe core licenses for VMs and do not mention CALs.

What the apply-license page, the host pool deployment article and the Windows Server benefit page do not state, and you should confirm: whether a Windows Server session host that is already licensed through its RDS CAL entitlement still needs separate core licenses to avoid the Windows software charge. The apply-license page says properly licensed customers can apply a Windows license to session hosts without paying for another, the host pool deployment article says you can apply a Windows or Windows Server license to your session hosts as part of Azure Virtual Desktop and run them without paying for a separate license, and the Windows Server benefit page speaks in terms of core licenses. Read your agreement and the Microsoft Product Terms, which Learn says take precedence, before you rely on either reading.

## Quick reference

| Session host OS | User-side entitlement | VM license type shown on Learn | Extra |
|---|---|---|---|
| Windows 11 or 10 Enterprise multi-session | Eligible license from the licensing table, or per-user access pricing for external users | `Windows_Client` | None listed |
| Windows 11 or 10 Enterprise single-session | Same row as above | `Windows_Client` | None listed |
| Windows Server 2025, 2022, 2019, 2016 | RDS CAL with Software Assurance or RDS User Subscription License | `Windows_Server` when the benefit is used | RDS license server; 8-core minimum if core licenses are used |

## Stumbling blocks

- **Hosts created outside the service.** Learn says you might have to apply the license separately. The apply-license page lists host pool creation with PowerShell or the Azure CLI as the route where you apply the license afterwards, so check `LicenseType` after any build outside the Azure Virtual Desktop service.
- **Azure Image Builder.** The Image Builder overview lists, under Costs, no current support for Azure Hybrid Benefit for Windows Server. It does not say what that means for hosts deployed from the image, so check `LicenseType` on each host.
- **Enrolled subscriptions and licensed users.** The licensing page says Azure Virtual Desktop also charges users with separate assigned licenses in a subscription enrolled in per-user access pricing. For internal users you license, it recommends a separate subscription that is not enrolled, to avoid effectively paying twice.
- **Commitments.** A reservation covers infrastructure only and Learn says stopped VMs continue to use reservation hours. Check [Azure reservations](/entity/azure-reservations/) coverage against the autoscale pattern of your host pool before buying.
- **Expiry.** Windows Server benefit workloads may run only during the Software Assurance or subscription term.

## Checklist

1. For each host pool, note the session host OS and the license row that applies.
2. Confirm each user holds an eligible license, or that external users are covered by per-user access pricing.
3. Run `Get-AzVM` over the session hosts and compare `LicenseType` with the quick reference.
4. For Windows Server hosts, confirm CALs, the license server and any core licenses used.
5. Review meters in cost analysis for one host of each type before sizing reservations.

## Sources

- [Microsoft Learn: Licensing Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/licensing)
- [Microsoft Learn: Apply Windows license to session host virtual machines](https://learn.microsoft.com/en-us/azure/virtual-desktop/apply-windows-license)
- [Microsoft Learn: Deploy Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop)
- [Microsoft Learn: Prerequisites for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/prerequisites)
- [Microsoft Learn: How to deploy Windows 11 on Azure (multitenant hosting rights)](https://learn.microsoft.com/en-us/azure/virtual-machines/windows/windows-desktop-multitenant-hosting-deployment)
- [Microsoft Learn: Explore Azure Hybrid Benefit for Windows VMs](https://learn.microsoft.com/en-us/azure/virtual-machines/windows/hybrid-use-benefit-licensing)
- [Microsoft Learn: Azure Hybrid Benefit for Windows Server](https://learn.microsoft.com/en-us/windows-server/get-started/azure-hybrid-benefit)
- [Microsoft Learn: Remote Desktop Services client access licenses](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/rds-client-access-license)
- [Microsoft Learn: Understand how the Azure reservation discount is applied to virtual machines](https://learn.microsoft.com/en-us/azure/cost-management-billing/manage/understand-vm-reservation-charges)
- [Microsoft Learn: Software costs not included in a compute savings plan](https://learn.microsoft.com/en-us/azure/cost-management-billing/savings-plan/software-costs-not-included)
- [Microsoft Learn: Azure Image Builder overview](https://learn.microsoft.com/en-us/azure/virtual-machines/image-builder-overview)
- [Microsoft Learn: Understand and estimate costs for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/understand-estimate-costs)
- [Azure: Azure Virtual Desktop pricing](https://azure.microsoft.com/en-us/pricing/details/virtual-desktop/)
