---
title: "Set Up Windows 365 Link as a Secure Thin Client: Requirements, Intune and First Sign-In"
summary: "How to prepare and set up Windows 365 Link devices using Microsoft Learn: license and Entra requirements, Intune enrollment, single sign-on and consent prompts, Conditional Access, the six deployment steps, first-time setup and security features."
status: review
publish: false
author: mirko-p
date: 2027-01-01
topics: [windows-365-link, windows-365, intune]
keypoints:
  - "Windows 365 Link works with Windows 365 Enterprise, Flex and Business, and requires Intune. Devices must be Microsoft Entra joined and enroll automatically in Intune during OOBE."
  - "Link devices can connect only to Cloud PCs with Microsoft Entra ID single sign-on enabled. Otherwise users get an error and cannot connect."
  - "Learn says the Link connection does not currently support the SSO consent prompt, so it fails if consent is needed. A note says update 26100.7462 can present prompts."
  - "The deployment overview lists six steps, from requirements through Entra device and mobility settings, an optional Intune filter, enrollment restrictions and Conditional Access validation."
  - "Learn strongly recommends the Auto Detect Local Time Zone policy and FIDO2 Security Key as a sign-in method for Link devices."
faq:
  - q: "Which Windows 365 editions work with Windows 365 Link?"
    a: "According to Microsoft Learn, Windows 365 Enterprise, Windows 365 Flex and Windows 365 Business, with GCC support described for Government Cloud PCs. Windows 365 Link requires Intune."
  - q: "Does the device need to be Entra joined?"
    a: "Yes. According to Microsoft Learn, Windows 365 Link devices must be Microsoft Entra joined. They can connect to Cloud PCs that are Entra joined or Entra hybrid joined."
  - q: "Why does a Link device fail to connect to a Cloud PC?"
    a: "One documented cause is that single sign-on is not enabled on the Cloud PC. According to Microsoft Learn, users then get an error that the Cloud PC does not support Microsoft Entra ID single sign-on."
  - q: "What happens at first sign-in?"
    a: "According to Microsoft Learn, the device joins Microsoft Entra ID and enrolls in the Intune tenant associated with the sign-in account."
---

To set up Windows 365 Link as a secure thin client, prepare your Microsoft Entra and Intune settings first, enable single sign-on on the Cloud PCs, and then let users sign in on the device. This guide combines four Microsoft Learn pages: What is Windows 365 Link?, Requirements for Windows 365 Link, Overview of deploying Windows 365 Link devices and Set up Windows 365 Link.

## What the device is

Learn describes Windows 365 Link as the first Cloud PC device that lets users connect directly to their Cloud PC, a full-stack purpose-built solution by Microsoft. Admins use Microsoft Intune to manage Link devices alongside other devices. The overview lists these security features: discrete TPM 2.0, secure boot, virtualization-based security, hypervisor-protected code integrity, BitLocker, a strict application control policy, no local user with administrative rights, no local data storage, no local apps, security baseline policies enabled by default, and the Microsoft Defender EDR sensor. The page also says Link supports local redirection of web multimedia content. Its dimensions are 120 by 120 by 30 mm and it weighs 418 g.

## Requirements

- **Licenses:** Link works with Windows 365 Enterprise, Windows 365 Flex and Windows 365 Business. It requires Intune. For GCC, the page describes connectivity to Windows 365 Government Cloud PCs in GCC and GCCH.
- **Microsoft Entra ID:** devices must be Entra joined. The user who joins the device must have permission to join devices. Link devices can connect to Cloud PCs that are Entra joined or hybrid joined. Automatic Intune enrollment needs the joining user to have a Microsoft Entra ID Premium license.
- **Intune:** devices enroll during OOBE. The user needs permission to enroll and must comply with enrollment restrictions. You can use corporate identifiers to preupload the serial number, manufacturer and model so that only trusted devices enroll.
- **Single sign-on:** Link devices can connect only to Cloud PCs with Entra ID single sign-on enabled. Edit the provisioning policy to enable it and apply the change to existing Cloud PCs, or provision new Cloud PCs with a profile that has SSO enabled.
- **Conditional Access:** if Conditional Access protects Cloud PC access, include the SSO cloud app resource in the target resources.
- **Teams:** Link devices can use only the VDI solution for Teams (VDI 2.0). Optimizations are preinstalled. Check the Teams PowerShell policy for optimization.
- **Network:** the same requirements as Azure Virtual Desktop end user devices. The page links to the required endpoints article and does not list them.

## SSO consent prompts

The Link connection does not currently support interacting with the SSO consent prompt. Without suppression, users are prompted on the first connection after SSO is enabled, every 30 days, and after a Cloud PC is reprovisioned. If consent is required, the Link connection fails, and the user must first connect from another device or a browser to grant consent. The page lists three steps to suppress the prompt: create a dynamic device group for all Cloud PCs, enable Entra authentication for RDP on the SSO service principal, and add the Cloud PC group to the service principal target. It notes that the December quality update, version 26100.7462, can present consent prompts and that the steps can still suppress the prompt after that.

## Deployment steps for admins

The deployment overview lists:

1. Meet all requirements.
2. Configure Microsoft Entra device settings so users can join Link devices to Entra.
3. Configure Microsoft Entra mobility settings to enroll Link devices in Intune automatically.
4. Create an Intune filter for Windows 365 Link devices. This step is optional.
5. Configure enrollment restrictions so Link devices can enroll.
6. Validate Conditional Access policies.

It recommends the Auto Detect Local Time Zone policy (strongly recommended), FIDO2 Security Key as a sign-in method (strongly recommended), and a screen timeout change (optional). The page gives no portal menu paths for these steps.

## First-time setup for users

Learn lists these steps:

1. Connect a monitor, a USB keyboard and, recommended, a USB mouse. Connect power and turn the device on.
2. On **Let's connect you to a network**, select a network and **Next**.
3. Accept the EULA.
4. On **Let's set things up for your work or school**, enter your work or school email and select **Next**.
5. Authenticate as your organization requires. Examples are a FIDO2 security key, a passkey and the Microsoft Authenticator app.
6. You are connected to your Cloud PC.

**Quick settings** in the bottom-right corner lets users adjust settings before sign-in. At first sign-in the device joins Entra ID and enrolls in the Intune tenant of the sign-in account.

## Suggestion: a pilot checklist

This section is a practical suggestion and not a Microsoft statement.

1. Confirm SSO is enabled on the Cloud PC provisioning policy before the first device is unboxed.
2. Apply the consent prompt suppression steps before rollout.
3. Test with one user and one device using the sign-in method you plan to require.
4. Check Conditional Access policies against the SSO cloud app.

## Not covered

The pages I read do not describe the following:

- Ports and peripherals of the device.
- Specific network endpoints.
- Intune menu paths and the settings available for Link devices.
- Timing and failure handling during first setup.
- Supported regions.

## Related

- [Windows 365 Link](https://www.m365.fm/entity/windows-365-link/)
- [Windows 365](https://www.m365.fm/entity/windows-365/)
- [Intune](https://www.m365.fm/entity/intune/)

## Sources

- [What is Windows 365 Link? (Microsoft Learn)](https://learn.microsoft.com/windows-365/link/overview)
- [Requirements for Windows 365 Link (Microsoft Learn)](https://learn.microsoft.com/windows-365/link/requirements)
- [Overview of deploying Windows 365 Link devices (Microsoft Learn)](https://learn.microsoft.com/windows-365/link/deployment-overview)
- [Set up Windows 365 Link (Microsoft Learn)](https://learn.microsoft.com/windows-365/link/setup)
