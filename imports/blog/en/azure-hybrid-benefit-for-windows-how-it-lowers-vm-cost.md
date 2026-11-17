---
title: "Azure Hybrid Benefit for Windows: how it lowers VM cost"
summary: "Azure Hybrid Benefit for Windows Server lets you apply on-premises Windows Server core licenses with active Software Assurance or a qualifying subscription to Azure VMs, so the VM is billed at the base compute rate, which equals the Linux rate. This article covers eligibility, the core-license arithmetic, how to switch it on and verify it, and how it combines with reservations and savings plans."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [azure-hybrid-benefit, azure-reservations]
keypoints:
  - "Learn says the Windows Server license is covered by the benefit, so you pay only the base compute rate of the VM, and that rate equals the Linux rate."
  - "Eligibility needs Windows Server Standard or Datacenter core licenses with active Software Assurance or qualifying subscription licenses. Each VM needs at least 8 core licenses, and a processor license counts as 16 core licenses."
  - "Switching the benefit on or off changes only a metadata licensing flag (LicenseType Windows_Server). It does not restart the VM, but billing is not applied in real time and can take several hours to show."
  - "A reservation covers infrastructure costs and a compute savings plan does not cover software, so the Windows software charge on a Windows Server VM is removed only if Azure Hybrid Benefit is enabled."
  - "Centrally managed Azure Hybrid Benefit is for SQL Server only. For Windows Server the benefit is managed on each resource, and workloads may run only during the Software Assurance or subscription term."
faq:
  - q: "Does Azure Hybrid Benefit make a Windows Server VM free?"
    a: "No. Microsoft Learn says the Windows Server license is covered, so you pay only the base compute rate of the VM, which equals the Linux rate. Storage, networking and any additional software, for example SQL Server, are still charged separately."
  - q: "Do I need to restart a VM to enable or disable the benefit?"
    a: "No. Learn says changing the license type does not restart the VM or interrupt service, because only a metadata licensing flag changes. Billing is not applied in real time, so expect a delay of several hours before the change shows on your bill."
  - q: "What happens when Software Assurance expires?"
    a: "Workloads that use the benefit can run only during the Software Assurance or subscription license term. Before it ends you must renew, disable the benefit on the resources, or deprovision the workloads, and Microsoft reserves the right to audit eligibility."
---

Azure Hybrid Benefit for Windows Server lets you bring on-premises Windows Server core licenses to Azure. For a Windows Server VM that uses the benefit, Microsoft Learn says the Windows Server license is covered and you pay only the base compute rate of the VM, which is equal to the Linux rate. The benefit does not create licenses: you need Software Assurance or qualifying subscription licenses first, and you must count cores correctly. This article explains what changes on the bill, the eligibility rules with worked arithmetic, how to enable and verify it, and where it meets reservations and savings plans. The Windows client side (Windows 11 multi-session on Azure Virtual Desktop) is a different mechanism and is covered in the companion article "Azure Hybrid Benefit and multi-session: what applies to AVD".

## What the benefit changes on the bill

An Azure VM that runs Windows has two cost parts: the compute (infrastructure) rate and a Windows software charge. [Azure Hybrid Benefit](/entity/azure-hybrid-benefit/) removes the second part for eligible Windows Server licenses. Learn's [Windows Server page](https://learn.microsoft.com/en-us/windows-server/get-started/azure-hybrid-benefit) puts it this way: the license for Windows Server is covered, so you only pay for the base compute rate, and that rate is equal to the Linux rate.

Three details from Learn matter when you plan:

- **Any Windows Server VM.** The benefit works with any VM running the Windows Server OS in all regions, including VMs that have additional software such as SQL Server or third-party Azure Marketplace software. The additional software is not covered. The reservation documentation says any additional software is charged separately.
- **Everything else stays.** Storage and networking charges are unaffected. The reservation page states that in all cases you are charged for storage and networking at the normal rates.
- **Billing lags.** Learn says billing is not applied in real time. After activating a Windows Server VM with the benefit, expect a delay of several hours before the VM shows on your bill.

The Azure pricing page for Hybrid Benefit also covers SQL Server and Linux subscriptions. This article is limited to Windows Server. The pricing page claims savings of up to 80% compared with pay-as-you-go for Windows Server VMs when the benefit is combined with Azure Reserved VM Instances, and the footnote to that figure says actual savings may vary based on region, instance type or usage. Treat that figure as a ceiling from Microsoft's marketing page, not as a planning number, and calculate with your own price sheet.

## Eligibility and the core-license arithmetic

To qualify you need on-premises core licenses for Windows Server from an applicable program with active Software Assurance, or qualifying subscription licenses. Learn adds that these are available only as part of certain commercial licensing agreements, and that the Microsoft Product Terms for your program take precedence over the documentation. Both Standard and Datacenter editions qualify.

The counting rules, from the Learn VM page and the Windows Server page:

- A minimum of 8 core licenses (Datacenter or Standard) per VM. Learn's example: a 4-core instance still needs 8 core licenses.
- For instances larger than 8 cores, allocate licenses equal to the core size of the instance. A 12-core instance needs 12 core licenses.
- Each processor license is equivalent to 16 core licenses.

Applied to a small fleet, the arithmetic looks like this. The inputs are the rules above; the totals are simple multiplication.

| Fleet | Core licenses needed |
|---|---|
| 10 VMs with 4 cores each | 10 × 8 = 80 |
| 10 VMs with 8 cores each | 10 × 8 = 80 |
| 5 VMs with 12 cores each | 5 × 12 = 60 |
| 4 VMs with 16 cores each | 4 × 16 = 64 |

Two processor licenses equal 32 core licenses, which would cover four 8-core VMs under the same rules. The first two rows show a practical point: a 4-core VM and an 8-core VM consume the same number of licenses, so very small VM sizes do not stretch your license pool.

### Standard versus Datacenter

The Windows Server page distinguishes the editions by how the licenses may be used at the same time on premises and in Azure:

- **Standard:** licenses must be used either on premises or in Azure, but not at the same time. The one exception is a one-time period of up to 180 days to migrate the same workloads. Unlimited virtualization rights are not available.
- **Datacenter, VM licensing:** when migrating workloads, licenses allow simultaneous usage on premises and in Azure indefinitely.
- **Datacenter, Dedicated Host licensing:** simultaneous usage is allowed for 180 days from when the licenses are allocated to Azure. With Datacenter licenses with active Software Assurance or subscription for all available physical cores of an Azure dedicated host, you can use any number of Windows Server VMs on that host.

## Turning it on and checking it

The `LicenseType` value for Windows Server is `Windows_Server`. Learn's [VM page](https://learn.microsoft.com/en-us/azure/virtual-machines/windows/hybrid-use-benefit-licensing) documents these paths.

**For a new VM**

1. In the Azure portal, open the **Basics** tab of the VM wizard and, under **Licensing**, select the checkbox to use an existing Windows Server license.
2. Alternatively, pass the license type when you create the VM. With Azure CLI: `az vm create --resource-group myResourceGroup --name myVM --location eastus --license-type Windows_Server`. With PowerShell, add `-LicenseType "Windows_Server"` to `New-AzVm`. In an Azure Resource Manager template, set `"licenseType": "Windows_Server"` in the VM properties.

**For an existing VM**

1. In the portal, open the VM, select **Operating system** on the service menu and set **Azure Hybrid Benefit** to **Enable**.
2. Or use PowerShell:

```powershell
$vm = Get-AzVM -ResourceGroup "rg-name" -Name "vm-name"
$vm.LicenseType = "Windows_Server"
Update-AzVM -ResourceGroupName rg-name -VM $vm
```

3. Or use Azure CLI: `az vm update --resource-group myResourceGroup --name myVM --set licenseType=Windows_Server`.
4. To go back to pay-as-you-go, set `$vm.LicenseType = "None"` in the same PowerShell pattern.

Learn says this process changes a metadata licensing flag only, so the VM does not restart and service is not interrupted.

**To verify**

1. Run `Get-AzVM -ResourceGroup "myResourceGroup" -Name "myVM"`. A VM with the benefit shows `LicenseType : Windows_Server`; without it the value is blank.
2. To list every VM that uses it, run `az vm list --query "[?licenseType=='Windows_Server']" -o table`, or in PowerShell `Get-AzVM | ?{$_.LicenseType -like "Windows_Server"} | select ResourceGroupName, Name, LicenseType`.
3. In the portal, add the column **OS licensing benefit** to the VM or scale set list. It shows **Azure Hybrid Benefit for Windows**, **Not enabled**, or **Windows client with multi-tenant hosting**. The third state belongs to the Windows client mechanism, not to this benefit.

Virtual machine scale sets use the same `licenseType` property inside `virtualMachineProfile`, and Learn gives `Get-AzVmss` and `az vmss list` queries for them. One limit to know: the Azure Image Builder overview says the service does not currently support the benefit for Windows Server, so set the flag on the VMs you deploy from an image rather than expecting the build to carry it.

## Combining it with reservations and savings plans

[Azure reservations](/entity/azure-reservations/) and [Azure savings plans](/entity/azure-savings-plans/) discount the infrastructure part of a VM. Neither removes the Windows software part. Learn's VM reservation page lays out the cases for Windows VMs:

| VM | What a Reserved VM Instance covers |
|---|---|
| Windows VM without additional software | Infrastructure costs. You are charged for Windows software. |
| Windows VM with additional software, for example SQL Server | Infrastructure costs. You are charged for Windows software and for the additional software. |
| Windows VM with Azure Hybrid Benefit | Infrastructure costs. The Windows software costs are covered by the benefit. Additional software is charged separately. |

For compute savings plans the rule is the same: Learn says compute savings plan discounts apply only to infrastructure costs, not software costs. If you use Windows VMs with a compute savings plan but do not have the benefit for those VMs, you are charged for the Windows software meters. The page lists 20 of them: sixteen "Reservation-Windows Svr" meters for core counts from 1 to 256 on non-burstable series, and four "Reservation-Windows Svr Burst" meters for B-series VMs.

The practical sequence is therefore: confirm which VMs are eligible, enable the benefit on those VMs, and then size the commitment on the infrastructure spend that remains. For help choosing between the two commitment types, see the article "Reservations or savings plans for AVD: which to buy". Remember that a reservation is use-it-or-lose-it, and Learn says stopped VMs are billed and continue to use reservation hours.

## Managing it across many VMs

For SQL Server, Microsoft offers centrally managed Azure Hybrid Benefit at subscription or billing-account scope. For Windows Server that option does not exist: Learn says the resource-level method is currently the only option for Windows Server, and the centrally managed option is not available to customers who work with a Cloud Solution Provider partner that manages Azure for them. In practice that means the flag lives on each VM, so you track it with the queries and the portal column described above.

Plan for these events:

- **Expiry.** If you do not renew Software Assurance or the subscription, you must remove the benefit from your resources in the Azure portal, or deprovision the workloads.
- **Shortfall.** If you have fewer licenses than the VMs you enabled, Learn gives three choices: buy more licenses covered by Software Assurance or a subscription, disable the benefit on some VMs and pay regular hourly rates, or deallocate some VMs.
- **Audit.** Microsoft reserves the right to audit customers at any time to verify eligibility.

## What the benefit does not do

- It does not cover client users or Windows client operating systems. Windows 11 multi-session hosts rely on user licenses and the `Windows_Client` setting.
- It does not replace client access licenses. For Azure Virtual Desktop session hosts that run Windows Server, Learn's RDS page says each user and device that connects needs a Remote Desktop Services client access license from a license server. The Hybrid Benefit pages describe core licenses for VMs and do not mention these CALs.
- It does not discount storage, networking or additional software.
- It does not apply to classic VMs unless they are migrated to the Azure Resource Manager model. Learn says VMs created through the classic deployment model were set to be retired on September 1, 2023.

## Sources

- [Microsoft Learn: Explore Azure Hybrid Benefit for Windows VMs](https://learn.microsoft.com/en-us/azure/virtual-machines/windows/hybrid-use-benefit-licensing)
- [Microsoft Learn: Azure Hybrid Benefit for Windows Server](https://learn.microsoft.com/en-us/windows-server/get-started/azure-hybrid-benefit)
- [Azure: Azure Hybrid Benefit](https://azure.microsoft.com/en-us/pricing/hybrid-benefit/)
- [Microsoft Learn: Understand how the Azure reservation discount is applied to virtual machines](https://learn.microsoft.com/en-us/azure/cost-management-billing/manage/understand-vm-reservation-charges)
- [Microsoft Learn: Software costs not included in a compute savings plan](https://learn.microsoft.com/en-us/azure/cost-management-billing/savings-plan/software-costs-not-included)
- [Microsoft Learn: What is centrally managed Azure Hybrid Benefit for SQL Server?](https://learn.microsoft.com/en-us/azure/cost-management-billing/scope-level/overview-azure-hybrid-benefit-scope)
- [Microsoft Learn: Remote Desktop Services client access licenses](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/rds-client-access-license)
- [Microsoft Learn: Azure Image Builder overview](https://learn.microsoft.com/en-us/azure/virtual-machines/image-builder-overview)
