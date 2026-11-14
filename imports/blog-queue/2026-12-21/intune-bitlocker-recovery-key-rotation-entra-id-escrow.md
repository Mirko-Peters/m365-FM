---
title: "Rotate BitLocker Recovery Keys With Intune and Keep Them Backed Up in Microsoft Entra ID"
summary: "How Intune rotates BitLocker recovery keys on demand and through policy, the prerequisites for Entra joined and hybrid joined devices, recovery key backup to Microsoft Entra ID, the 200-key limit, and what Microsoft Learn does not say about silent re-escrow."
status: review
publish: false
author: mirko-p
date: 2026-12-21
topics: [bitlocker, intune, microsoft-entra]
keypoints:
  - "The Intune BitLocker key rotation remote action works on Windows 10 version 1909 or later and Windows 11. Entra joined and hybrid joined devices need rotation enabled in the BitLocker policy first."
  - "The policy needs client-driven recovery password rotation, saving recovery information to Entra ID enabled, and storing it in Entra ID before enabling BitLocker set to Required."
  - "Admins need an Intune role with Remote tasks and the Rotate BitLockerKeys (preview) right. Help Desk Operator and Endpoint Security Administrator include it."
  - "Microsoft Entra ID supports a maximum of 200 BitLocker recovery keys per device. Reaching the limit makes silent encryption fail because the key backup fails."
  - "The pages read do not describe a separate re-escrow action or say whether rotation needs user interaction. Test on a pilot device and check the recovery keys view."
faq:
  - q: "How do I rotate a BitLocker recovery key from Intune?"
    a: "In the Microsoft Intune admin center, select Devices, All devices, pick the device and use the BitLocker key rotation remote action, which can be under the ellipsis. Learn says the device must run Windows 10 version 1909 or later or Windows 11."
  - q: "What must be configured before the remote rotation works?"
    a: "For Entra joined and hybrid joined devices, Learn lists three BitLocker policy settings: client-driven recovery password rotation enabled for the join type, Save BitLocker recovery information to Microsoft Entra ID enabled, and Store recovery information in Microsoft Entra ID before enabling BitLocker set to Required."
  - q: "Which permissions do admins need?"
    a: "An Intune RBAC role with the Remote tasks permission and the Rotate BitLockerKeys (preview) right set to Yes. Learn names Help Desk Operator and Endpoint Security Administrator. Viewing keys also needs the microsoft.directory/bitlockerKeys/key/read permission, for example in Cloud Device Administrator or Helpdesk Administrator."
  - q: "Is there a limit on recovery keys per device?"
    a: "Yes. Learn says Microsoft Entra ID supports a maximum of 200 BitLocker recovery keys per device, and that when the limit is reached, silent encryption fails because the backup of recovery keys before encryption fails."
  - q: "What happens to BitLocker if I delete the device object in Intune?"
    a: "Learn says deleting the Intune object of a Microsoft Entra joined device protected by BitLocker triggers a device sync and removes the key protectors for the operating system volume. That leaves BitLocker in a suspended state on that volume."
---

Rotating a BitLocker recovery key in Intune takes two parts: a policy that enables rotation and backup to Microsoft Entra ID, and a remote action that rotates the key on a device. Microsoft Learn documents both, plus where to view the keys and who may. It does not describe a separate "re-escrow" action or say whether rotation needs user interaction, so those points are marked below as untested.

## Prerequisites

From the Learn page on encrypting Windows devices with BitLocker:

- The device runs Windows 10 version 1909 or later, or Windows 11.
- For Microsoft Entra joined and hybrid joined devices, rotation is enabled through BitLocker policy with these settings:
  - **Client-driven recovery password rotation** set to **Enable rotation on Microsoft Entra joined devices**, or **Enable rotation on Microsoft Entra ID and hybrid joined devices**.
  - **Save BitLocker recovery information to Microsoft Entra ID** set to **Enabled**.
  - **Store recovery information in Microsoft Entra ID before enabling BitLocker** set to **Required**.
- Admins need an Intune role-based access control role with the **Remote tasks** permission and the **Rotate BitLockerKeys (preview)** right set to **Yes**. Built-in roles that include it are Help Desk Operator and Endpoint Security Administrator.

Learn adds, for silent encryption policies, that you should consider configuring the Configure Recovery Password Rotation setting to enable automatic rotation of recovery passwords.

## Create the policy

Learn recommends the endpoint security policy type:

1. In the Microsoft Intune admin center, select **Endpoint security** > **Disk encryption** > **Create Policy**.
2. Set **Platform** to Windows and **Profile** to BitLocker.
3. On **Configuration settings**, set the encryption methods, recovery options and TPM startup authentication, including the rotation settings above.
4. Add scope tags, assign the groups and select **Create**.

Learn notes that the Settings Catalog does not include the TPM startup authentication controls required for reliable silent BitLocker enablement, so use endpoint security or device configuration policies for those scenarios. If Windows devices use a device configuration Endpoint protection template, the settings are under **Windows Encryption**, and the page does not map the rotation settings to that template.

## Rotate the key on a device

1. Sign in to the Microsoft Intune admin center.
2. Select **Devices** > **All devices** and open the device.
3. Select the **BitLocker key rotation** remote action. If it is not visible, select the ellipsis (...) and then **BitLocker key rotation**.

## View the keys

1. Select **Devices** > **All devices**, open a device, and under **Monitor** select **Recovery keys**.
2. Select **Show Recovery Key**. This creates an audit log entry under the KeyManagement activity.

When keys are in Microsoft Entra ID, the page shows the BitLocker Key ID, the recovery key and the drive type. Otherwise it shows "No BitLocker key found for this device". To view keys, admins need `microsoft.directory/bitlockerKeys/key/read`, included in Cloud Device Administrator, Helpdesk Administrator and Global Administrator.

The Intune encryption report (**Devices** > **Monitor** > **Encryption report**) shows encryption status and gives access to recovery keys and device compliance information.

## Backup and troubleshooting facts

- For silent BitLocker enablement, Learn says recovery keys are backed up to Microsoft Entra ID automatically when encryption occurs. It lists checks: devices are successfully Entra joined, no policy conflicts block the automatic backup, and recovery key escrow works in the encryption report.
- Microsoft Entra ID supports a maximum of 200 BitLocker recovery keys per device. When the limit is reached, silent encryption fails because the backup fails before encryption starts.
- Deleting the Intune object of an Entra joined device protected by BitLocker triggers a device sync and removes the key protectors for the OS volume, leaving BitLocker suspended on that volume.
- Policy conflicts can be found with the policy conflict detection in Intune, according to the troubleshooting section.

## Self-service access and its controls

Learn lists the Company Portal app, the My Account portal and Microsoft Entra ID as self-service options. A tenant-wide setting in Microsoft Entra device settings decides whether non-admin users can recover keys. The page says the default is **No**, which allows all users to recover their keys, and **Yes** restricts them. Conditional Access can require a compliant device for key access. Access by users is logged in the Microsoft Entra audit logs under Key Management as **Read BitLocker key**.

## What the documentation does not say

The pages read do not describe:

- a separate re-escrow action. The documented mechanisms are the backup settings in policy, automatic backup at silent encryption, and the rotation action;
- whether rotation needs user interaction or a signed-in user. The page says it is a remote action and lists the prerequisites above, nothing more;
- how to find devices that have exceeded 200 recovery keys.

A practical check, as the author's suggestion: rotate on a pilot device, then compare the Key ID in **Recovery keys** before and after, and confirm the audit entries. That suggestion is not a Learn procedure.

## Related

- [BitLocker](https://www.m365.fm/entity/bitlocker/)
- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Microsoft Entra](https://www.m365.fm/entity/microsoft-entra/)

## Sources

- [Encrypt Windows devices with BitLocker using Intune (Microsoft Learn)](https://learn.microsoft.com/en-us/intune/device-configuration/endpoint-security/encrypt-bitlocker-windows)
