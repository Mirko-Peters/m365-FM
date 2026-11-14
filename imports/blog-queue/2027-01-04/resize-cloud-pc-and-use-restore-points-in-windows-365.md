---
title: "How to Resize a Cloud PC and Use Restore Points in Windows 365"
summary: "Resize a Windows 365 Enterprise Cloud PC in the Intune admin center and use point-in-time restore: roles, license behavior, 48-hour group license window, restore point types, retention and risks."
status: review
publish: false
author: mirko-p
date: 2027-01-04
topics: [windows-365]
keypoints:
  - "Resize keeps user and disk data, upgrades RAM, vCPU and storage, and downgrades only RAM and vCPU. Disk space cannot be reduced."
  - "Single resize path: Intune admin center > Devices > All Devices > select the device > Resize. The Cloud PC must be Provisioned."
  - "With group-based licenses the Cloud PC enters Resize pending license, and you have 48 hours to remove the old license and assign the new one."
  - "Learn lists short-term restore points every 4, 6, 12, 16 or 24 hours (10 per Cloud PC), 4 long-term points and one manual point."
  - "Restore settings are created in Devices > Cloud PC Settings > Add. The restore procedure steps were not on the pages read."
faq:
  - q: "Does resizing delete user data?"
    a: "No. Learn says the Resize remote action preserves user and disk data. It does disconnect the user automatically, and unsaved work might be lost, so users should save and sign out first."
  - q: "Can I shrink the disk?"
    a: "No. Learn says disk space cannot be reduced. You can downgrade RAM and vCPU, and in the single resize flow lower-storage options are grayed out when downsizing."
  - q: "How long does a resize take?"
    a: "Learn says resizing can take 15 to 20 minutes before the user can access the Cloud PC again. You can monitor it in the Windows 365 provisioning blade."
  - q: "What are the restore point types?"
    a: "Short-term points are created every 4, 6, 12, 16 or 24 hours, with 10 per Cloud PC. Long-term points are 4 per Cloud PC, every 7 days, and not configurable. An admin can add one manual restore point per Cloud PC."
  - q: "Can users restore their own Cloud PC?"
    a: "Only if an admin allows it. In the user setting, the option is Allow user to initiate restore service."
---

To resize a Cloud PC, open the device in the Intune admin center and select Resize, then pick a size. For restore points, create a Cloud PC user setting that sets the restore point frequency. This guide follows three Microsoft Learn pages: the resize overview, the single resize article and the restore overview, plus the restore configuration page. It says where the pages stop.

## What resize does

Learn describes the **Resize** remote action as follows:

- It preserves user and disk data and does not require reprovisioning.
- It upgrades RAM, vCPU and storage.
- It downgrades RAM and vCPU only. Disk space cannot be reduced.
- It supports single and bulk operations, direct and group-based licenses, and paid, preview and trial licenses.
- It automatically disconnects the user, and unsaved work might be lost. Have users save and sign out first.
- It can take 15 to 20 minutes before the user can access the Cloud PC again.

## Requirements

- Windows 365 Enterprise. The Cloud PC size is tied to the license assigned to its user.
- Licenses for the target size in inventory. If none are available, the resize fails. Buy licenses, add them in the Microsoft 365 admin center and retry.
- The Cloud PC must have the status **Provisioned** in the Windows 365 provisioning node.
- For bring-your-own-network with Microsoft Entra hybrid join, a second IP address must be free in the subnet. Insufficient addresses can cause failures, so ensure enough or stagger resizes.
- GPU Cloud PCs are not supported. They may appear in the flow but return an error.
- Downsizing may affect nested virtualization support.

**Roles.** For direct-assigned licenses, Learn lists Intune Service Administrator, or Intune Reader plus Cloud PC Admin or Windows 365 Administrator. For group-based licenses, Intune Service Administrator or Intune Reader plus Windows 365 Administrator, plus a role with Entra group membership and licensing permissions.

## Resize one Cloud PC: direct license

1. Sign in to the Microsoft Intune admin center.
2. Select **Devices** > **All Devices**, choose the device, then **Resize**.
3. Under **Resize**, pick a size. Options depend on available licenses. Lower-storage options are grayed out when downsizing.
4. Select **Resize**.

The service unassigns the original license and assigns the new one for you.

## Resize one Cloud PC: group-based license

1. Create a target Entra group with the users to resize, or use existing groups that map to license types.
2. If you lack discrete groups for provisioning policy assignment, assign the existing provisioning policy to the target group.
3. In the Intune admin center, select **Devices** > **All Devices**, choose the device, add it to the target group and select **Resize**.
4. Pick a size and select **Resize**. The Cloud PC enters **Resize pending license**.
5. Complete both licensing actions, in either order:
   - Remove the original license from the group (**Licenses** > the old license > **Remove license** > **Yes** > **Save**).
   - Assign the new license (**Assignments** > the target license > **Save**).
6. Monitor progress in the Windows 365 provisioning blade.

Resizing starts only when both actions are done.

| Situation within 48 hours | Result on Learn |
| --- | --- |
| Source removed, target not assigned | The Cloud PC enters a grace period |
| Neither done | The device returns to Provisioned |
| Wrong target assigned | The Cloud PC is provisioned to match that license |

Learn recommends discrete Entra groups for licensing, separate from provisioning policy groups. For bulk resizing and step-up license migration, Learn links to its bulk resize article. The page says full step-up users have 90 days to migrate.

## Restore points

Point-in-time restore returns a Cloud PC to the state it had at an earlier point.

| Type | Frequency and count | Created by |
| --- | --- | --- |
| Short-term | Every 4, 6, 12, 16 or 24 hours. 10 per Cloud PC | Automatic, by policy |
| Long-term | 4 per Cloud PC, every 7 days. Not configurable | Automatic |
| Manual | 1 per Cloud PC | Admins, single or bulk |

A 4-hour interval gives 10 restore points covering the last 40 hours. When a new short-term or long-term point is added, the oldest is removed. A new manual point overwrites the old one, and an unreplaced manual point expires after about 28 days.

### Configure restore points

Path from Learn: Intune admin center > **Devices** > **Cloud PC Settings** > **Add**. On the page:

1. Enter a **Name**.
2. Optionally select **Enable Local admin**.
3. Select **Allow user to initiate restore service** if users may restore their own Cloud PCs.
4. Choose a value for **Frequency of restore-point service**.
5. Select **Next**, assign groups, then **Review + Create** > **Finish**.

### Restore and risks

Learn says changes after the restore point are lost, including data, documents, installed apps and configurations. Data in cloud services such as OneDrive is not lost. Rolling passwords, secrets, certificates and keys updated after the point can break services. Choose the point closest to the present, and have the user sign in right after the restore. Restore points with a triangle warning icon are unhealthy and have a low probability of success, although restore is still allowed.

For Cloud PCs deprovisioned by license expiration, retention snapshots are available for 28 days. Restore from them needs a renewed license of the same SKU, the existing provisioning policy, and a new Cloud PC in the same region.

## Gaps in the pages read

The restore pages read do not give the click-by-click steps for restoring one Cloud PC or in bulk. They link to separate articles for that. They also state no roles for restore.

## Typical mistakes

- Resizing during working hours without telling the user.
- Expecting to shrink the disk.
- Removing the old license but never assigning the new one before the window closes.
- Restoring to an old point and breaking rolled secrets.

## Related

- [Windows 365](https://www.m365.fm/entity/windows-365/)
- [Windows 365 Frontline](https://www.m365.fm/entity/windows-365-frontline/)
- [Microsoft Intune](https://www.m365.fm/entity/intune/)

## Sources

- [Resize a Cloud PC (Microsoft Learn)](https://learn.microsoft.com/windows-365/enterprise/resize-cloud-pc)
- [Resize a single Cloud PC (Microsoft Learn)](https://learn.microsoft.com/windows-365/enterprise/resize-cloud-pc-single)
- [Restore a Cloud PC to a previous state: overview (Microsoft Learn)](https://learn.microsoft.com/windows-365/enterprise/restore-overview)
- [Configure Windows 365 for point-in-time restore (Microsoft Learn)](https://learn.microsoft.com/windows-365/enterprise/restore-configure)
