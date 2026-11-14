---
title: "How to Configure Windows Hello for Business With Intune for Cloud-Only Devices"
summary: "Configure Windows Hello for Business for Entra joined devices with Intune: cloud-only deployment model, tenant-wide enrollment policy, device configuration policy types, disabling automatic enrollment, policy precedence and the setting names the Learn pages do not list."
status: review
publish: false
author: mirko-p
date: 2027-01-11
topics: [windows-hello-for-business, intune]
keypoints:
  - "The cloud-only model is for organizations with only cloud identities. Trust types do not apply to it. Learn says you can deploy it with the Microsoft Entra ID Free tier."
  - "Intune applies it through a tenant-wide enrollment policy or device configuration policies such as settings catalog, account protection and custom PassportForWork CSP."
  - "The tenant-wide policy applies only at enrollment and does not change devices already enrolled. It is usually disabled, with a policy targeted to a security group used instead."
  - "Windows Hello for Business is on by default for Entra joined devices. Precedence ranks user GPO above computer GPO above user CSP above device CSP."
  - "Only the setting Use Windows Hello for Business is named. PIN complexity, biometrics and hardware key settings are on pages not read here."
faq:
  - q: "What is the cloud-only deployment model?"
    a: "It is for organizations that only have cloud identities and do not access on-premises resources. They typically join devices to the cloud and use cloud resources such as SharePoint Online and OneDrive. The trust type does not apply to it."
  - q: "Is a license required?"
    a: "The deployment planning page says Windows Hello for Business does not need Microsoft Entra ID P1 or P2 and can be deployed with the Free tier, but dependencies such as MDM automatic enrollment and Conditional Access do need one."
  - q: "How does Intune apply the settings?"
    a: "Through a tenant-wide policy at enrollment (Devices > Windows > Windows Enrollment > Windows Hello for Business), or through device configuration policy such as settings catalog, security baselines, a custom policy using the PassportForWork CSP, account protection or the identity protection template."
  - q: "Is Windows Hello for Business on by default?"
    a: "Yes, for Microsoft Entra joined devices. To disable automatic enrollment you can use the tenant-wide policy, a device configuration policy with the Enrollment Status Page, a provisioning package or scripted registry changes."
  - q: "What wins if policies conflict?"
    a: "The page ranks user GPO first, then computer GPO, user PassportForWork CSP, device PassportForWork CSP and Exchange ActiveSync. It advises not to mix GPO and CSP for Windows Hello for Business."
---

Windows Hello for Business replaces passwords with a PIN or biometric sign-in bound to the device. For a cloud-only organization with Entra joined devices, Intune is the usual place to manage it. This guide follows two Microsoft Learn pages: the planning page on deployment models and the page on configuring Windows Hello for Business with Intune.

## The cloud-only model

Learn describes cloud-only for organizations that only have cloud identities and do not access on-premises resources. They typically join devices to the cloud and use resources such as SharePoint Online and OneDrive. They need no certificates for things like VPN, because everything is hosted in cloud services.

- The trust type (cloud Kerberos, key or certificate) does not apply to a cloud-only deployment.
- Supported join types are Microsoft Entra joined and Microsoft Entra registered.
- A PKI is not required.
- MFA is Microsoft Entra MFA or non-Microsoft MFA.
- Device configuration is by CSP or by local GPO.
- Windows Hello for Business needs no Microsoft Entra ID P1 or P2 subscription, and you can deploy with the Microsoft Entra ID Free tier. Dependencies such as MDM automatic enrollment and Conditional Access do need one. Without a subscription, users must enroll devices in the MDM manually.
- Intune appears only as an example MDM. It is not stated as a requirement.

## Ways to apply it with Intune

The configuration page covers Entra joined and Entra hybrid joined devices enrolled in Intune.

1. **Tenant-wide policy at enrollment.** Go to **Devices** > **Windows** > **Windows Enrollment** > **Windows Hello for Business**, The page gives this path for verifying the status of **Configure Windows Hello for Business** and any configured settings. It applies to all devices that enroll, and changes do not affect devices that are already enrolled. The page says the policy is therefore usually disabled and a policy targeted to a security group is used instead.
2. **Device configuration policy after enrollment.** Named types: settings catalog, security baselines, a custom policy using the PassportForWork CSP, an account protection policy and the identity protection template. These are refreshed at regular intervals.
3. **Disabling automatic enrollment.** Windows Hello for Business is on by default for Entra joined devices. Options: the tenant-wide policy, a device configuration policy combined with the Enrollment Status Page, a provisioning package or scripted registry changes.

## Custom policy

A custom policy uses the PassportForWork CSP with this base path, where you replace the placeholder with your Entra tenant ID:

```
./Device/Vendor/MSFT/PassportForWork/{TenantId}
```

## Registry values

The value is REG_DWORD, 1 to enable and 0 to disable. For CSP the key name is `UsePassportForWork`, for GPO it is `Enabled`. The page lists device and user locations for both CSP and GPO. It prints one GPO path with a typo in the root key, so check the full path before you use it.

## Precedence

From highest to lowest: user GPO, computer GPO, user PassportForWork CSP, device PassportForWork CSP, Exchange ActiveSync (DeviceLock CSP). If a password or PIN policy is set in both DeviceLock and PassportForWork, Windows enforces the strictest. Do not mix GPO and CSP for Windows Hello for Business. MDMWinsOverGP does not apply to these policies.

## What the pages do not say

- Setting names beyond Use Windows Hello for Business. Settings such as PIN complexity, biometrics or hardware security devices are not named on the pages read.
- Exact portal paths for the settings catalog, account protection or identity protection profiles.
- A step-by-step checklist of cloud-only prerequisites.
- Details on PIN reset, dual enrollment and Dynamic Lock.

## A rollout outline (my advice)

This outline is my own advice, built on the pages.

1. Confirm that your devices are Entra joined and enrolled in Intune.
2. Decide whether to use the tenant-wide policy or a targeted device configuration policy. The page notes that the tenant policy is usually disabled in favor of a targeted one.
3. Pilot with a small group and check sign-in.
4. Avoid setting the same option through both GPO and CSP.
5. Read the linked policy settings page for the exact setting names before you build the profile.

## Typical mistakes (my advice)

- Expecting the tenant-wide policy to change already enrolled devices.
- Mixing GPO and CSP settings.
- Assuming licensing never matters. Learn says Windows Hello for Business itself needs no P1 or P2, but dependencies such as MDM automatic enrollment and Conditional Access do.
- Forgetting that Windows Hello for Business is on by default for Entra joined devices.

## Related

- [Windows Hello for Business](https://www.m365.fm/entity/windows-hello-for-business/)
- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Windows Autopilot](https://www.m365.fm/entity/windows-autopilot/)

## Sources

- [Configure Windows Hello for Business (Microsoft Learn)](https://learn.microsoft.com/windows/security/identity-protection/hello-for-business/configure)
- [Plan a Windows Hello for Business Deployment (Microsoft Learn)](https://learn.microsoft.com/windows/security/identity-protection/hello-for-business/deploy/)
