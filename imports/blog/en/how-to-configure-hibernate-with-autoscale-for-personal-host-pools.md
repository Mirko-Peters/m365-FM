---
title: "How to configure hibernate with autoscale for personal host pools"
summary: "Enable hibernation on the session hosts first, then give Azure Virtual Desktop the Power On Off Contributor role and create a personal scaling plan whose timers use the Hibernate action. If the hosts lack hibernation, autoscale does nothing to them, so verify one host by hand before you assign the plan."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-hibernation, avd-personal-host-pool]
keypoints:
  - "The order matters: enable hibernation on the VMs, verify a manual hibernate and resume, assign the Desktop Virtualization Power On Off Contributor role at subscription scope, then create the scaling plan."
  - "In the portal the host option is the Hibernate checkbox on the Virtual machines tab of the host pool creation flow. For existing VMs, Learn documents deallocating the VM, setting supportsHibernation on the OS disk and enabling hibernation on the VM."
  - "In the personal schedule, Disconnect settings and Sign out settings each take 0 to 360 minutes and an action of deallocate, hibernate or do nothing. The PowerShell module must be Az.DesktopVirtualization 4.2.0 or later."
  - "If a plan says hibernate but the desktops do not have hibernation enabled, autoscale neither hibernates nor deallocates them."
  - "Insights supports autoscale monitoring for pooled host pools only. For personal pools Learn describes sending Autoscale logs to a storage account or an event hub."
faq:
  - q: "Which role does autoscale need for hibernating personal desktops?"
    a: "Learn says to assign the Desktop Virtualization Power On Off Contributor role to the Azure Virtual Desktop service principal or to a managed identity assigned to the host pool, with the Azure subscription as the assignable scope. Assigning it at a lower level, such as the resource group, host pool or VM, prevents autoscale from working properly. You need the Microsoft.Authorization/roleAssignments/write permission, which Owner and User Access Administrator include."
  - q: "How do I check that a desktop can really hibernate before autoscale uses it?"
    a: "Hibernate it manually from the VM's Overview page in the Azure portal, or with az vm deallocate --hibernate true or Stop-AzVM -Hibernate. Then check that the status reads Hibernated (deallocated), start it, and read the VM instance view: a substatus ending in Resume/succeeded means the guest resumed, while Start/succeeded with the message VM booted means it cold-booted."
  - q: "Can I enable hibernation on a session host that already exists?"
    a: "Learn says yes. Deallocate the VM, set supportsHibernation to true on the OS disk, enable hibernation on the VM, then start it and check the guest. The page file must be on the C: drive, which Learn also requires for specialized images."
---

To use hibernate with autoscale on a personal host pool, enable hibernation on every session host, confirm that one host hibernates and resumes by hand, assign the Power On Off Contributor role, and then create a personal scaling plan whose disconnect or sign-out timers use the **Hibernate** action. Learn's autoscale FAQ says that if the plan asks for hibernation but the desktops do not have it enabled, autoscale does nothing to them. This article is the procedure and the list of known failure points. For the concept and the cost model, see "Hibernation for AVD personal desktops: saving cost without losing the session". For the general plan walkthrough, see "How to create and assign an AVD scaling plan step by step".

## Before you start

From Learn's [scaling plan article](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan) and the [hibernation overview](https://learn.microsoft.com/en-us/azure/virtual-machines/hibernate-resume):

- A [personal host pool](/entity/avd-personal-host-pool/). Do not enable hibernate if you use FSLogix or App Attach for it.
- A VM size in a series that Learn lists for hibernation, an OS that supports it, and an OS disk large enough for memory, OS and applications.
- The scaling plan's configuration data must be in the same Azure region as the host pool configuration. The session hosts can be in any supported region.
- For PowerShell, the Az.DesktopVirtualization module version 4.2.0 or later.
- The `Microsoft.Authorization/roleAssignments/write` permission on the subscription for the role assignment (part of Owner and User Access Administrator).

Autoscale for personal host pools falls under [power management autoscaling](/entity/avd-power-management-autoscaling/), which is generally available. Hibernate support for personal session hosts and for autoscale is listed as generally available in May 2024 on Learn's What's new page.

## Step 1: enable hibernation on the session hosts

**New session hosts in the portal.** Learn's [deployment article](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop) describes the flow:

1. In the Azure portal, search for **Azure Virtual Desktop**, select **Host pools**, then **Create**.
2. On **Basics**, set **Host pool type** to **Personal**.
3. On the **Virtual machines** tab, set **Add virtual machines** to **Yes** and choose the image and VM size.
4. Select the **Hibernate** box. Learn notes hibernation is available only for personal host pools, and that with Microsoft Teams media optimizations you should update the WebRTC redirector service to 1.45.2310.13001.
5. Set **OS disk size** so the disk can store the memory contents in addition to the OS and applications. Learn recommends Premium SSD for production workloads.

**Existing VMs.** Learn's [Windows hibernation page](https://learn.microsoft.com/en-us/azure/virtual-machines/windows/hibernate-resume-windows) documents these Azure CLI steps. Deallocate the VM first, and make sure the page file is on the C: drive.

```azurecli
az disk update --resource-group myResourceGroup --name MyOSDisk --set supportsHibernation=true
az vm update --resource-group myResourceGroup --name myVM --enable-hibernation true
az vm start --resource-group myResourceGroup --name myVM
```

The page gives equivalent Azure PowerShell steps (`$disk.SupportsHibernation = $True`, then `Update-AzVM ... -HibernationEnabled`). It also says that creating a VM with hibernation enabled installs the `Microsoft.CPlat.Core.WindowsHibernateExtension` extension automatically. It does not state this for existing VMs, so run the checks in step 2.

**Images.** To create hosts from an [Azure Compute Gallery](/entity/azure-compute-gallery/) image, Learn says the image definition needs the hibernation property (portal: **Enable hibernation**; CLI: `--features IsHibernateSupported=true`).

## Step 2: verify one host by hand

1. Open the VM instance view. The extension `AzureHibernateExtension` should show `ProvisioningState/succeeded` with the message "Enabling hibernate succeeded". If it failed, Learn says you cannot hibernate the VM.
2. In the guest, run `powercfg /a`. **Hibernate** should appear under the available sleep states.
3. Hibernate the VM: the **Hibernate** button on the VM **Overview** page, `az vm deallocate --resource-group TestRG --name TestVM --hibernate true`, or `Stop-AzVM -ResourceGroupName "TestRG" -Name "TestVM" -Hibernate`.
4. Confirm the status **Hibernated (deallocated)**, or `HibernationState/Hibernated` in the instance view.
5. Start the VM and read the instance view again. A substatus code of `ComponentStatus/VMBootState/Resume/succeeded` means the guest resumed. `Start/succeeded` with "VM booted." means it cold-booted instead, and Learn's page then asks for the guest's Kernel-Power, Kernel-General and Kernel-Boot logs.

Hibernate from the guest does not count: Learn says that does not move the VM to the hibernated state and billing continues.

## Step 3: assign the role

Assign **Desktop Virtualization Power On Off Contributor** to the Azure Virtual Desktop service principal or to a managed identity assigned to the host pool, with your subscription as the assignable scope. Learn warns that any lower level, such as resource group, host pool or VM, prevents autoscale from working properly. Do not copy the scope advice for Start VM on Connect, whose Power On Contributor role Learn allows at lower scopes; the companion article on that feature covers it.

## Step 4: create the personal scaling plan

1. In the Azure portal, search for **Azure Virtual Desktop**, select **Scaling Plans**, then **Create**.
2. On **Basics**, choose subscription, resource group, name, **Location**, **Time zone** and set **Host pool type** to **Personal**. Optionally enter an **Exclusion tag** for hosts autoscale must leave alone.
3. On **Schedules**, select **Add schedule**, name it and choose the days under **Repeat on**.
4. On **Ramp up**, set the **Start time**, **Start VM on Connect**, and **VMs to start**: **Assigned VMs only**, **Assigned and unassigned VMs**, or **Don't turn VMs on at start time**. Learn highly recommends Start VM on Connect if you do not start hosts during ramp-up.
5. Under **Disconnect settings** set **When disconnected for (min)** and **Perform**. Under **Sign out settings** set **When logged off for (min)** and **Perform**. Minutes run from 0 to 360, and the actions are deallocate, hibernate or do nothing.
6. Repeat the same fields on **Peak hours**, **Ramp-down** and **Off-peak hours** (these tabs have no **VMs to start**).
7. On **Host pool assignments**, tick the pool. You can only assign a plan to host pools of the type chosen in the plan. Add tags, then **Review + create** and **Create**.

Example values of our own, not from Learn: ramp-up 06:00, peak 08:15, ramp-down 16:30, off-peak 18:45; in each phase hibernate after 30 minutes disconnected and deallocate after 15 minutes signed out. Learn notes that changes to a plan already assigned to host pools apply immediately, and that unselected days carry over the last off-peak parameters.

**PowerShell.** Learn's example uses `New-AzWvdScalingPlanPersonalSchedule` with parameters such as these:

```azurepowershell
PeakMinutesToWaitOnDisconnect = '10'
PeakActionOnDisconnect = 'Hibernate'
RampDownMinutesToWaitOnLogoff = '15'
RampDownActionOnLogoff = 'Hibernate'
```

Check the assignment afterwards with `(Get-AzWvdScalingPlan @params).HostPoolReference | FL HostPoolArmPath,ScalingPlanEnabled`.

## Step 5: monitor what autoscale did

Learn's [Insights article](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-monitor-operations-insights) says autoscale monitoring in Insights supports pooled host pools only. For personal pools, the [autoscale diagnostics article](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-diagnostics) says to open the scaling plan, select **Diagnostic Settings**, **Add diagnostic setting**, tick **Autoscale logs** and archive to a storage account or stream to an event hub. Logs land in the `insight-logs-autoscaling` container. That page was last dated 2023 and its sample shows a load-balancer event, so check what your logs contain for hibernate actions.

## Known failure points

| Symptom | Cause and action (source: Learn) |
|---|---|
| Plan assigned, VMs never hibernate or deallocate | Hibernation not enabled on the desktops; autoscale does nothing. Enable it and retest. |
| Creation fails: OS disk size | The OS disk must be larger than the VM memory. Use a larger disk. |
| Creation fails: image or setup | The platform or gallery image must support hibernation. Spot VMs, availability sets, dedicated hosts, capacity reservation groups and user VM images are rejected. |
| Extension in failed state | Page file on the temp disk: move it to C: and run Reapply. Not enough space for the hiberfile: expand the OS disk and C: partition, then Reapply. |
| Hibernate blocked after enabling virtualization-based security | Enable virtualization in the guest. |
| `VMHibernateNotSupported` | Hibernating right after boot is not supported; retry after a few minutes. |
| `InternalOperationError` | Usually transient; retry after 5 minutes. |
| Guest never hibernates | Check `sc query vmicshutdown` and `sc query power` for disabled services, and the minimum OS build when memory integrity (HVCI) is on. |
| Resume fails with `AllocationFailed` or `OverconstrainedResumeFromHibernatedStateAllocationRequest` | Retry later, or stop-deallocate and start (this discards the saved memory). |
| User sees "No resources available" | Autoscale does not set drain mode before deallocating a personal desktop, so a connection during deallocation fails. |

One more caution from the FAQ: it says autoscale for personal desktops deallocates only after sign-out, while the scaling plan page documents actions for disconnected sessions. Pilot your timers before you assign the plan broadly.

## Sources

Accessed 17 November 2026.

- [Microsoft Learn: Create and assign an autoscale scaling plan for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: Azure Virtual Desktop autoscale FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq)
- [Microsoft Learn: Deploy Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop)
- [Microsoft Learn: Hibernation overview, Azure Virtual Machines](https://learn.microsoft.com/en-us/azure/virtual-machines/hibernate-resume)
- [Microsoft Learn: Learn about hibernating your Windows virtual machine](https://learn.microsoft.com/en-us/azure/virtual-machines/windows/hibernate-resume-windows)
- [Microsoft Learn: Troubleshoot hibernation in Azure](https://learn.microsoft.com/en-us/azure/virtual-machines/hibernate-resume-troubleshooting)
- [Microsoft Learn: Troubleshoot hibernation on Windows virtual machines](https://learn.microsoft.com/en-us/azure/virtual-machines/windows/hibernate-resume-troubleshooting-windows)
- [Microsoft Learn: Set up diagnostics for Autoscale in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-diagnostics)
- [Microsoft Learn: Monitor Autoscale operations with Insights](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-monitor-operations-insights)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
