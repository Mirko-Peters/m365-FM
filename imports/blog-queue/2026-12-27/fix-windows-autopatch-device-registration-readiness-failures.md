---
title: "Windows Autopatch Device Registration Fails Readiness Checks: What to Fix"
summary: "Fix Windows Autopatch registration problems using Microsoft Learn: how devices join through Autopatch groups, the prerequisite checks, the Registered and Not registered statuses, and remedies for stale records, dual state, co-management and hardware changes."
status: review
publish: false
author: mirko-p
date: 2026-12-27
topics: [windows-autopatch]
keypoints:
  - "Devices register by being members of the Microsoft Entra groups assigned to a Windows Autopatch group. Discovery runs hourly, and new customers can wait up to 48 hours."
  - "Prerequisites include Intune or co-managed enrollment, an Intune check-in within 28 days, a corporate-owned Windows device and a supported SKU such as Enterprise, Pro or Education."
  - "For co-managed devices the Windows Update policies and Device configuration workloads must be enabled."
  - "A stale Microsoft Entra device record or a dual state of hybrid joined plus Entra registered can make the device fail the Intune or Cloud-Attached check."
  - "The page documents statuses and remedies in text and links the post-registration readiness checks separately."
faq:
  - q: "How do devices get registered with Windows Autopatch?"
    a: "According to Microsoft Learn, by assigning the Microsoft Entra groups that contain them to a Windows Autopatch group. Autopatch scans device-based Entra groups on an ongoing basis. Discovery runs hourly, and for new customers devices can take up to 48 hours to appear as registered in the membership report."
  - q: "Which prerequisite checks can fail?"
    a: "Intune or cloud-attached management, an Intune check-in within the last 28 days, corporate-owned Windows device, a supported Windows SKU family (Enterprise, Pro, Pro Workstation, Education, Pro Education) and, for co-managed devices, the Windows Update policies and Device configuration workloads."
  - q: "Where do I see registration status?"
    a: "In the Intune admin center select Tenant administration, then under Windows Autopatch select Windows Autopatch groups, then the Windows Autopatch group membership tab."
  - q: "What do I do about a device that is not enrolled in Intune?"
    a: "Learn says to check why it is not enrolled. A common cause is a stale Microsoft Entra device record, which you clean up as described in the article on managing stale devices."
  - q: "What happens after a hardware replacement?"
    a: "For changes such as the motherboard, a nonremovable NIC or OS drive details, Microsoft Entra creates a new device ID. Add the new ID through direct membership or a nested group in the Autopatch group. After a reimage, rejoin and re-enroll, and the device ID stays the same."
---

When a device does not register with Windows Autopatch, the cause can be a failed prerequisite, a stale record or a group conflict. This article follows the Microsoft Learn page on registering devices with Windows Autopatch groups and keeps to the checks and remedies it names.

## How registration works

Devices are added to a Windows Autopatch group by assigning the Microsoft Entra groups that contain them. Autopatch scans device-based Entra groups on an ongoing basis for new devices. Discovery runs hourly, and for new Autopatch customers devices can take up to 48 hours to appear as registered in the membership report. Nested Entra groups synced from on-premises Active Directory groups and Configuration Manager collections are supported.

## Prerequisite checks

Failed devices show **Prerequisite failed**.

| Check | Requirement |
| --- | --- |
| Intune or cloud-attached | The device must be Intune-managed or co-managed. A device with no Intune device ID is not enrolled and fails. |
| Intune check-in | The device must have checked into Intune in the last 28 days. |
| Corporate-owned Windows device | Personal or non-Windows devices do not qualify. |
| Windows SKU family | Enterprise, Pro, Pro Workstation, Education or Pro Education |
| Co-management workloads | For co-managed devices, Windows Update policies and Device configuration must be enabled. |

Devices that are only Intune-managed are marked as passing all prerequisites.

## See the status

1. In the Intune admin center, select **Tenant administration**.
2. Under **Windows Autopatch**, select **Windows Autopatch groups**.
3. Select the **Windows Autopatch group membership** tab.

The report shows group membership, update status and the policies targeting each device. Viewing device properties requires **Manage Devices/Read**, and assigning a ring requires **Windows Autopatch Group/Read**. Scoped admins can only move devices between rings in the same group with the same scope tags.

## Statuses

- **Registered, Ready:** passed all prerequisites, registered, passed post-registration readiness checks and has no active alerts.
- **Registered, Not ready:** failed one or more post-registration checks, is not ready for one or more managed workloads, has not communicated with Intune in 28 days, or conflicts with policies or group membership.
- **Not registered, Windows Autopatch group conflict:** conflicts with group membership.
- **Not registered, Prerequisites failed:** the page words this as failing one or more post-registration readiness checks.
- **Not registered, Excluded:** removed from the service only. Microsoft assumes you manage the device yourself.

## Remedies the page gives

The page describes remediation in text:

- **Not enrolled in Intune:** find out why. A common cause is a stale Microsoft Entra device record. Detect and remove stale records as described in the article on managing stale devices in Microsoft Entra ID.
- **Dual state, hybrid joined and Entra registered:** the hybrid record takes precedence, so the registered record becomes stale. Clean up before registering, or the device may fail the **Intune or Cloud-Attached** check and appear in the Not ready view.
- **Co-management workload missing:** enable Windows Update policies and Device configuration.
- **Hardware replacement:** a new motherboard or SMBIOS UUID, nonremovable NIC MAC or OS drive details create a new Microsoft Entra device ID. Add the new ID through direct membership or a nested group in the Autopatch group.
- **Reimage:** rejoin and re-enroll. No action is needed because the device ID stays the same.

## Windows 365 and Azure Virtual Desktop

For Windows 365, select **Windows Autopatch** under **Microsoft managed services** when you create a provisioning policy in Intune, and Cloud PCs are enrolled automatically. For Azure Virtual Desktop, only personal persistent VMs are supported. Multi-session, pooled non-persistent and RemoteApp are not.

## Other notes

With fewer than 100 devices in a group, dynamic distribution may not match the selected percentages. The page also says support requests can be submitted only with E3 or higher or F3 licenses.

## A triage order

This order is my advice, built from the page, not a Microsoft procedure.

1. Confirm the device is in an Entra group assigned to an Autopatch group.
2. Check Intune enrollment and the last check-in date.
3. Look for stale or duplicate Entra records, especially for hybrid joined devices.
4. For co-managed devices, check the two workloads.
5. Wait for the hourly discovery before you retest.

## Not covered

The page does not list the post-registration readiness checks, which it links elsewhere. It also does not cover the Autopatch Client Broker, step-by-step group creation or device count limits beyond the 100-device note.

## Related

- [Windows Autopatch](https://www.m365.fm/entity/windows-autopatch/)

## Sources

- [Register devices with Windows Autopatch groups (Microsoft Learn)](https://learn.microsoft.com/windows/deployment/windows-autopatch/deploy/windows-autopatch-register-devices)
