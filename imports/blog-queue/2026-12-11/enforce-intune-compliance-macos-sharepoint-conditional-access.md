---
title: "Enforce Intune Compliance on macOS for SharePoint with Entra Conditional Access"
summary: "Set up macOS compliance in Intune and a Conditional Access policy that requires compliant devices, including macOS browser requirements, the SSO plug-in, report-only testing and common sign-in failures."
status: review
publish: false
author: mirko-p
date: 2026-12-11
topics: [conditional-access, intune, device-compliance, sharepoint]
keypoints:
  - "Create the Intune macOS compliance policy first and make sure at least one device is compliant. Without it the Conditional Access policy will not work as intended."
  - "Create the Conditional Access policy under Entra ID > Conditional Access > Policies with Require device to be marked as compliant, and start in Report-only."
  - "On macOS, devices are identified by a client certificate. Users are prompted to select it on first browser sign-in."
  - "Safari needs the Microsoft Enterprise SSO plug-in. Chrome needs the Microsoft Single Sign On extension when the plug-in is used. Edge 85+ needs the user signed in to the browser."
  - "The Learn pages I read do not show how to scope the policy to SharePoint Online alone, so check the target resources choice in your tenant."
faq:
  - q: "What do I create first, the compliance policy or the Conditional Access policy?"
    a: "The compliance policy. Microsoft Learn says to create an Intune compliance policy first and make sure at least one device is compliant, otherwise the Conditional Access policy that requires compliance will not work as intended."
  - q: "Which macOS settings can a compliance policy check?"
    a: "The macOS settings reference lists System Integrity Protection, minimum and maximum OS version and build, password settings, encryption of data storage, firewall settings and Gatekeeper. Device compliance evaluation is not supported for userless macOS devices."
  - q: "Why are devices without a compliance policy allowed in?"
    a: "The Intune setting Mark devices with no compliance policy assigned as defaults to Compliant. Learn says to change it to Not compliant if you use Conditional Access and want only confirmed-compliant devices to reach resources. It is under Endpoint security, Device compliance, Compliance policy settings."
  - q: "Which browsers work for device-based Conditional Access on macOS?"
    a: "Microsoft Learn lists Microsoft Edge, Chrome, Firefox 133 or later and Safari. Chrome needs the Microsoft Single Sign On extension with the Enterprise SSO plug-in, Firefox needs macOS 10.15 or newer with the plug-in configured, and the check fails in private mode or with cookies disabled."
  - q: "Why does a user get a certificate prompt on a Mac?"
    a: "Learn explains that on macOS, iOS and Android, Entra ID identifies the device with a client certificate provisioned at registration. On first browser sign-in the user is prompted to select it and must select it to continue."
---

Enforcement has two halves. In Intune, a macOS compliance policy defines what a compliant Mac is. In Microsoft Entra, a Conditional Access policy with **Require device to be marked as compliant** blocks everything that is not. Build and verify the Intune half first, then add the Conditional Access policy in report-only mode and check sign-in results before you switch it on.

## Step 1: Create the macOS compliance policy in Intune

Settings available for macOS compliance, from the Intune reference:

| Category | Settings |
|---|---|
| Device health | **Require a system integrity protection** |
| Device properties | Minimum and maximum OS version, minimum and maximum OS build version |
| Password | Require a password, simple passwords, minimum length, type, inactivity minutes, expiration, reuse |
| Encryption | **Require encryption of data storage on device** |
| Firewall | Firewall, Incoming connections, Stealth Mode |
| Gatekeeper | **Allow apps downloaded from these locations** |

Two cautions from the page: requiring a password in a compliance policy automatically expires the existing password for all accounts on the device, including those created by LAPS and Platform SSO, and password changes take effect only the next time the user changes the password. Microsoft recommends managing device passwords with a settings catalog policy with Change At Next Auth set to False. Compliance evaluation is not supported for userless macOS devices.

Learn's table of Conditional Access behavior for macOS marks encryption, OS version limits and email profile as quarantined, which means the OS does not enforce them and Conditional Access blocks the device if it fails. Password configuration is remediated, because the OS enforces it.

## Step 2: Review the tenant-wide compliance settings

Go to **Endpoint security** > **Device compliance** > **Compliance policy settings**.

- **Mark devices with no compliance policy assigned as**: default is **Compliant**. Change to **Not compliant** if only confirmed-compliant devices should get access.
- **Compliance status validity period (days)**: default 30, range 1 to 120. A device that does not report within the period is treated as noncompliant.

Remember that noncompliance can also trigger actions such as email to users, remote lock or retire after a period.

## Step 3: Create the Conditional Access policy

Learn's steps, with the Conditional Access Administrator role as the minimum:

1. Sign in to the Microsoft Entra admin center.
2. Go to **Entra ID** > **Conditional Access** > **Policies** and select **New policy**.
3. Name the policy.
4. Under **Users or workload identities**, include **All users** and exclude your emergency access accounts. If you use Entra Connect or Cloud Sync, also exclude **Directory Synchronization Accounts**.
5. Under **Target resources**, the Learn page selects **All resources**.
6. Under **Grant**, select **Require device to be marked as compliant**.
7. Set **Enable policy** to **Report-only**, then select **Create**.

After reviewing report-only results, set the policy to **On**.

For the SharePoint scenario, the page I read uses all resources and does not describe choosing SharePoint Online alone. If you want a narrower scope, pick the SharePoint Online app in target resources and test it. Note that Intune enrollment itself is not blocked by this policy, so new devices can still enroll.

## Step 4: Make the Mac identifiable in browsers

Conditional Access device checks need the device identity. From the conditions article for macOS:

- Supported browsers: Microsoft Edge, Chrome, Firefox 133 or later and Safari.
- The device is identified by a client certificate provisioned at registration. Users are prompted to select it on first browser sign-in.
- The device check fails if the browser is in private mode or cookies are disabled.
- **Safari** works for device-based Conditional Access on a managed device.
- **Edge** 85 or later requires the user to be signed in to the browser.
- **Chrome** needs the **Microsoft Single Sign On** extension on Macs that use the Enterprise SSO plug-in.
- **Firefox** needs macOS 10.15 or newer with the Microsoft Enterprise SSO plug-in installed.
- For Apple devices, the **Microsoft Enterprise SSO plug-in** must be enabled for applications that do not use MSAL, including Safari, so they can take part in device-based authentication for policies such as **Require device to be marked as compliant**.

## Step 5: Test in report-only mode

Check sign-in logs for the report-only result of the policy. My own test plan: a compliant Mac, a noncompliant Mac and a Mac in each browser. Learn recommends excluding emergency access accounts and service accounts from such policies, and notes that calls made by service principals are not blocked by policies scoped to users, so they need Conditional Access for workload identities.

## Typical failures (my own list)

- The Mac is compliant in Intune but the browser sign-in is blocked: check the SSO plug-in, the Chrome extension and the certificate prompt.
- Everything is blocked at once: no compliance policy is assigned while the no-policy setting is **Not compliant**, or the validity period elapsed because the device stopped reporting.
- Everything is allowed: the setting for devices with no compliance policy is still **Compliant**.
- Users in private browsing windows fail the device check.

## What the pages do not say

The Intune pages I read do not describe a macOS-specific Company Portal flow and give no concrete evaluation timing. The overview only says evaluation depends on device check-in and policy refresh cycles. The page on requiring a compliant device does not mention the SSO plug-in, while the conditions page does. Verify enrollment and plug-in deployment with your Intune administrator.

## Related

- [Conditional Access](https://www.m365.fm/entity/conditional-access/)
- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Device compliance](https://www.m365.fm/entity/device-compliance/)
- [SharePoint](https://www.m365.fm/entity/sharepoint/)

## Sources

- [Require a compliant device with Conditional Access](https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-all-users-device-compliance)
- [Conditional Access conditions](https://learn.microsoft.com/en-us/entra/identity/conditional-access/concept-conditional-access-conditions)
- [Intune device compliance overview](https://learn.microsoft.com/en-us/intune/device-security/compliance/overview)
- [macOS compliance settings reference](https://learn.microsoft.com/en-us/intune/device-security/compliance/ref-macos-settings)
