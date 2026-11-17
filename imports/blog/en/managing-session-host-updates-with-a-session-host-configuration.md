---
title: "Managing session host updates with a session host configuration"
summary: "With a session host configuration you change the configuration first, then schedule a session host update that replaces hosts in batches. This guide covers the preparation, the portal steps, the controls while it runs, and what to do when an update fails."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-session-host-configuration, avd-host-pool]
keypoints:
  - "Session host update replaces the VMs of a pooled pool that uses a session host configuration. It updates one host first, then batches of the size you set, and each host takes about 20 minutes."
  - "Before you start: disable autoscale, remove resource locks, check quota, and test on a pool that matches production. Once an update is scheduled you cannot edit it, only cancel it and schedule another."
  - "You can pause, resume, cancel or retry. A paused update is canceled automatically after two weeks, and a canceled update cannot be resumed."
  - "If a host fails to update, the service tries to roll that host back and finishes the current batch. Hosts already updated are not rolled back, so the pool can end up mixed."
  - "Enable at least the Checkpoint, Error and Session Host Management Activity Logs diagnostic categories. The WVDSessionHostManagement table appears only after the last one is on and an update has run."
faq:
  - q: "Can I change the schedule of an update that is already scheduled?"
    a: "No. Microsoft Learn says that once an update is scheduled you cannot edit the schedule or settings. Cancel the update and schedule a new one."
  - q: "What happens to autoscale during a session host update?"
    a: "Learn says to disable autoscale on the host pool before starting an update and to keep it disabled until the update finishes. An enabled scaling plan can cause a runtime failure."
  - q: "What is the batch size and what is the first host for?"
    a: "The batch size is the maximum number of hosts updated at a time. The first update always covers a single initial host to verify the process, and if that host fails the update stops."
---

Updating hosts in a pool that uses a session host configuration is a two-step job: edit the configuration, then schedule a session host update that rolls the change out in batches. This guide is the practical side. It lists what to prepare, walks through the portal procedure, explains how to pause, cancel or retry, and shows where to look when something fails. The concept, the objects and the preview labels are covered in the article "Session host configuration in Azure Virtual Desktop explained", and image handling in "The golden image lifecycle: build, test, release, retire".

Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, session host configuration and update, and ephemeral OS disks, in July 2026 (Tech Community). Some Learn pages, for example the troubleshooting page and the module version 5.4.2-preview, still carry preview wording; check the current page before relying on a limit.

## What an update does

According to Microsoft Learn, session host update changes the VM disk type, OS image and other configuration of all hosts in a pool that has a [session host configuration](/entity/avd-session-host-configuration/). It deallocates or deletes the existing VMs and creates new ones, which join the [host pool](/entity/avd-host-pool/). The changes you can make are the image, VM size, disk type, security type (Standard, Trusted launch or Confidential), Active Directory domain join credentials, Microsoft Intune enrollment, local administrator credentials and a custom configuration script. Availability configuration, network configuration and location persist. Learn says you must use the same directory as the existing VMs, and the troubleshooting page adds that region, subscription, resource group and domain join type cannot change either.

The flow per host: users receive your notification and are signed out after the configured time; the host goes into drain mode and leaves the pool; a replacement VM is created with the name format `SessionHostName-DateTime` while the OS hostname stays the same; the replacement joins the pool and drain mode is turned off; the original VM is deleted. Power state and drain mode are preserved, so a pool whose hosts are all deallocated can be updated to save cost.

## Before you schedule

1. **Check the pool.** It must be a pooled host pool with a configuration. All hosts must be in the same region and resource group.
2. **Prepare the image.** It must be supported for Azure Virtual Desktop and match the generation of virtual machine. Trusted launch and Confidential VMs need Generation 2. For a gallery image, Learn recommends at least two replicas, and a gallery image in a different subscription than the host pool is described as not currently supported. The What's new entry of September 2025 announces support for images in another subscription within the same tenant, so the pages disagree; test it before you rely on it. Session host update is only available in the global Azure cloud, not in Azure US Government or Azure operated by 21Vianet.
3. **Disable autoscale.** Turn the [scaling plan](/entity/avd-scaling-plan/) off for the pool until the update ends.
4. **Remove resource locks** from the hosts and their resource group.
5. **Check quota.** The update creates VMs, and Learn asks you to keep subscription quota limits in mind and to consider requesting an increase if an update would go over the limit.
6. **Check permissions, identity and key vault.** You need the RBAC permissions to update a session host configuration, listed in the deploy article's prerequisites. The host pool's managed identity needs the Desktop Virtualization Virtual Machine Contributor role on the resource group or subscription for the session hosts. For the key vault, it needs Key Vault Secrets User under Azure RBAC, or the Get secret permission in an access policy, which Learn says is not supported with a system-assigned identity chosen at pool creation. The update must use a managed identity to reach a key vault with private network access, otherwise the vault must allow public access from all networks. Learn's managed identity page says host pools with a session host configuration require a managed identity starting 1 November 2025 to add hosts, while What's new of September 2026 says "in a future service update". Check whether your pool has one.
7. **Move customizations into code.** Manual changes on hosts, such as files, registry keys and certificates, are lost, so put them in the image, Intune, Group Policy or the custom script. If you use Azure Virtual Desktop Insights, the Azure Monitor agent or Log Analytics agent is not installed automatically on updated hosts: use Azure Policy for the Azure Monitor agent, Azure Automation for the Log Analytics agent, or add the hosts manually in Insights.
8. **Test.** Run the same update on a test pool that matches production, including applications and hotfixes.
9. **Pick a quiet time.** Capacity drops and users must sign in again.

The configure page also has Azure PowerShell tabs for these tasks. Learn notes that these cmdlets require the preview Az.DesktopVirtualization module, 5.3.0 or later.

## Schedule the update in the portal

Go to Azure portal > **Azure Virtual Desktop** > **Host pools** > your pool > **Session hosts**. Select **Manage session host update** > **New update**, or **Manage session host configuration** > **Edit**.

1. **Basics.** *VM batch size authorized to be removed from the host pool during the update* is the number of hosts updated at once. *Session hosts available during the update* is read-only and shows the minimum that stays available.
2. **Session hosts.** Choose security type, image, VM size, OS disk type (Premium SSD recommended for production), the directory to join (Microsoft Entra or Active Directory, with the key vault holding the domain join account secrets), the Virtual Machine Administrator account with its key vault secrets, and an optional custom script URL.
3. **Schedule.** Select **Schedule update now**, or pick a date, time and time zone up to two weeks ahead.
4. **Notifications.** Set the minutes before users are signed out, from 0 to 60, and the sign-out message.
5. **Review.** Confirm validation passes and select **Update**.

On the first update your settings overwrite the defaults of the session host management policy; later updates are pre-populated and your changes are saved to the configuration.

### Choosing a batch size

The first host is always updated alone. With 10 hosts and a batch size of 3, the initial host goes first, then batches of 3, 3 and 3, and at least 7 hosts stay available once the initial one is done. With about 20 minutes per host and hosts in a batch running concurrently, that example is four rounds, roughly 80 minutes, as a rough estimate. Learn warns that large batch sizes can cause intermittent `AgentRegistrationFailureGeneric` errors and that retrying usually resolves them. Choose the batch size by what the pool can lose.

## While it runs

- Open **Session hosts** to see a blue banner with the status. It shows one point in time, so select **Refresh**. If you started the update immediately, the banner may still say scheduled until you refresh.
- Progress stays at 0.00% until the first host finishes.
- Do not remove VMs from the pool and do not change drain mode. A host that cannot be recovered stays in drain mode until the update completes.

### Pause, resume, cancel, retry

Select **Manage session host update** and choose the action, then **Refresh**; the banner can take about 20 seconds to change.

| Action | Behavior |
|---|---|
| Pause | The current activity, for example the running batch, finishes first. A paused update can only be resumed |
| Resume | Continues from where it stopped |
| Cancel | The current activity finishes first. A canceled update cannot be resumed |
| Retry | Offered after a failure; see the status table below |

An update paused for more than two weeks is canceled. Learn cautions that a canceled or partial update leaves mixed hosts, so schedule another update soon to restore parity. Only one update can run or be scheduled per pool, while different pools can update at the same time.

## When an update fails

Learn's troubleshooting page describes the failure handling. If a host fails, the service tries to roll that host back to the previous configuration to preserve capacity. Hosts that updated successfully are not rolled back, and hosts that had not started are not updated. The service finishes the current batch and marks the update failed, and then you can retry or cancel. A retry resumes with the failed hosts and those not yet attempted, using the existing batch size.

| Status | Meaning | Recovery |
|---|---|---|
| Update failed to initiate | The flow is invalid, for example an image incompatible with the VM SKU | Cannot retry. Cancel and schedule again |
| Update failed | Failed while in progress | Retry resumes at the last host |
| Session host rollback failed | The host failed to update and the rollback failed too | Retry resumes at the last host. Fix the cause first; capacity is lower and the host differs from the rest |

Typical causes: no hosts to update (`HostpoolHasNoSessionHosts`, which appears when the configuration was not changed first), insufficient capacity, or a mismatch of region, subscription, resource group or domain join type with existing hosts; remove hosts that are inconsistent with the configuration. Failures in the first single-host batch usually come from configuration parameters; later ones are often intermittent. If the image includes the PowerShell DSC extension, delete `C:\packages\plugin` from the image. Resource locks, blocking Azure Policy, or manual changes to power state and drain mode also cause failures. In Azure PowerShell, Learn lists `$updateProgress.PropertiesUpdateStatus`, `$updateProgress.UpdateProgressError` and `$updateProgress.UpdateProgressError.FaultText` as the properties that hold error details, and points to "Monitor the progress of an update" in the PowerShell tab of the configure page for the command that fills the variable. Also note that if an update fails, the host pool cannot be deleted until the update is canceled.

## Diagnostics in Log Analytics

Enable diagnostic settings on the pool, sending to a Log Analytics workspace, with at least the **Checkpoint**, **Error** and **Session Host Management Activity Logs** categories. Learn says the data is stored in `WVDSessionHostManagement` and `WVDCheckpoints`. The first table is created only once the Session Host Management Activity Logs category is on and an update has run, and the errors query also reads `WVDErrors`. A trimmed version of Learn's query for the latest status of every update is:

```kusto
WVDSessionHostManagement
| where TimeGenerated >= ago(30d) and ProvisioningType == "Update"
| summarize arg_max(TimeGenerated, ProvisioningStatus, ScheduledDateTime, UpdateMaxVmsRemoved) by CorrelationId
```

Related queries on the page cover successful updates with duration and median time per host, errors with the `CodeSymbolic` code, and cancellations. For error codes, use the troubleshooting page.

## After the update

Check that the **Current Version** column matches the target for every host, that users can sign in, and, with Insights, that the monitoring agent is present. Re-enable autoscale only after the update has finished. Active Directory computer objects are not deleted during an update, and the new VM inherits the original object, so there are temporarily orphaned objects. If you change the domain, Learn says to remove the orphaned computer objects from the previous domain.

## Sources

Retrieved 17 November 2026.

- [Microsoft Learn: Session host update](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update)
- [Microsoft Learn: Update session hosts using session host update](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update-configure)
- [Microsoft Learn: Troubleshoot session host configuration and session host update](https://learn.microsoft.com/en-us/azure/virtual-desktop/troubleshoot-session-host-update)
- [Microsoft Learn: Session host update diagnostics](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update-diagnostics)
- [Microsoft Learn: Host pool management approaches](https://learn.microsoft.com/en-us/azure/virtual-desktop/host-pool-management-approaches)
- [Microsoft Learn: Configure managed identity](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-managed-identity)
- [Microsoft Learn: Deploy Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Microsoft Tech Community: Enhanced host pool management for Azure Virtual Desktop is now generally available (9 July 2026)](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
