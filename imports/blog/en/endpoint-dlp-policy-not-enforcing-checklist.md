---
title: "Endpoint DLP Policy Not Enforcing? A Checklist From Device Join State to Network Shares"
summary: "A Purview Endpoint DLP rule works on some devices or files and silently does nothing on others? Check the join state, onboarding health, policy sync, scope, network share coverage and service domains."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [endpoint-dlp, dlp, purview, activity-explorer, hybrid-entra-join]
keypoints:
  - "Every device must be Microsoft Entra joined, hybrid joined or registered. A device that is joined only to on-premises Active Directory is not on the supported list."
  - "In the Purview portal, Settings, Device onboarding, Devices shows Configuration status and Policy sync status. Both should read Updated. After a policy change, allow up to two hours."
  - "Network shares and mapped drives are covered only when Network share coverage and exclusions is turned on in the Endpoint DLP settings."
  - "Browser upload rules apply to Edge, or to Chrome and Firefox with the Purview extension. They do not apply to paste."
  - "The threads behind this checklist did not end with a confirmed fix. If every check passes, collect the data Microsoft lists and open a support case."
faq:
  - q: "Does Endpoint DLP work on devices joined only to the local domain?"
    a: "Microsoft Learn says devices must be Entra joined, Entra hybrid joined or Entra registered. A Microsoft reply in a 2026 community thread said that a device joined only to on-premises Active Directory and not registered with Entra may not work as expected. Hybrid join is the Entra state for domain-joined devices that also register in the cloud."
  - q: "How long does a new or changed Endpoint DLP policy take to reach devices?"
    a: "Learn says the devices list can take up to two hours to show the new policy sync status after a change, and that devices must be online to receive the update. A Microsoft reply in a 2025 thread mentioned a window of two to 24 hours. Treat the 24 hours as a community statement."
  - q: "Why are files on a mapped network drive not blocked?"
    a: "Endpoint DLP covers new and edited files on network shares and mapped drives only when Network share coverage and exclusions is enabled in the Endpoint DLP settings. The Learn page also lists minimum Windows and Defender updates for this feature. One 2025 thread reported that blocking still failed after the setting was turned on, with no confirmed fix."
  - q: "Do I have to relabel files after I edit an Endpoint DLP policy?"
    a: "A reply in a November 2026 thread says this is not documented behavior. When a classified file is used again, Endpoint DLP checks for changed policies and re-evaluates. If enforcement only returns after rewriting files, collect the reproduction steps and open a support case instead of modifying files in bulk."
---

An Endpoint DLP policy blocks the copy to USB on one laptop and does nothing on the next. Or it blocks a file on the desktop but lets the same file go when it is opened from a mapped drive. Nothing shows in the policy view that explains it.

This article builds a checklist from four community threads started between October 2024 and November 2026 and from the current Microsoft Learn pages. None of the threads ended with a confirmed fix, so this is a way to find the cause in your tenant, not a guaranteed cure. It is not an official Microsoft procedure.

## The four situations

- A rule blocked copying files with a sensitivity label to USB, and stopped working once the devices were joined to the local domain.
- A rule that blocked uploads of labeled files to untrusted domains worked for a single user and stopped working for a user group. Later, local files were blocked but files from a file share still went through.
- A rule that blocked files of 10 KB or more everywhere except allowed apps worked at first and stopped after one policy edit.
- Policies did not trigger on Azure Virtual Desktop hosts. The thread ended with a request to open a support case.

## Step 1: Check the device join state

Microsoft Learn's page on onboarding Windows devices says that every device must be Microsoft Entra joined, Microsoft Entra hybrid joined or Microsoft Entra registered. It does not mention devices that are joined only to on-premises Active Directory.

In the first thread, a Microsoft reply stated that Endpoint DLP may not work as expected on a device that is only domain joined and not registered with Entra. That fits the Learn list. The thread had no accepted answer, and the original poster did not confirm the result. Still, it is the cheapest check.

Run `dsregcmd /status` on an affected device. If `DomainJoined` is YES and `AzureAdJoined` is NO, the device is not hybrid joined yet. The article on hybrid joined devices stuck in Pending state covers that case.

## Step 2: Check onboarding and device health

1. In the Microsoft Purview portal, go to **Settings**, then **Device onboarding**, then **Devices**.
2. Find the affected device. It should be listed. Onboarded devices stay in the list for 180 days after they go offline.
3. Learn lists these requirements for Windows: a supported Windows build, a supported Microsoft 365 Apps version, and Microsoft Defender Antivirus client version 4.18.2110 or later, with **Real-time protection** and **Behavior monitor** turned on.
4. If a device proxy is used, the cloud DLP service must be reachable. Learn also says to allow `MpDlpService.exe` through firewalls, third-party antivirus and application control.

After you turn on onboarding, Learn says it takes about 60 seconds to take effect, and recommends waiting up to 30 minutes before you contact support.

## Step 3: Read Configuration status and Policy sync status

On the same **Devices** page, two columns matter. Learn's sync troubleshooting page defines three values for both:

| Value | Meaning |
|---|---|
| **Updated** | Health settings match the recommended ones, and the device has the current policy versions. |
| **Not updated** | Some settings need attention, or the latest policy has not arrived yet. |
| **Not available** | Often an unsupported OS, a device that was just onboarded, or no Endpoint DLP policy at all. |

Select the device to see the remediation steps and the device details, such as last seen time, last policy sync time, operating system and Defender versions. Two timing facts from Learn: after a policy change, the devices list can take up to two hours to update, and a device must be online to receive the update.

A Microsoft reply in the 2025 thread named a longer window of two to 24 hours. Learn does not say that, so plan for the longer window only when the status stays on **Not updated** and the device is online.

For many devices at once, Learn shows an advanced hunting query on the `DeviceInfo` table in the Defender portal. The `DlpInfo` field contains values such as `IsDlpConfigurationValid`, `IsDlpEnabled`, the Defender real-time protection flag and `HasDlpValidUpn`. A false value for the valid user principal name means that the signed-in user has no Entra account or is out of scope for a device-targeted policy. That is a quick way to find the odd devices in a large group.

## Step 4: Check the policy scope

Learn notes that policies can target users and devices together. If a policy is scoped to devices whose signed-in users do not meet the criteria, you should exclude those users or devices on purpose. Otherwise the enforcement may not be what you expect.

The user versus group difference in the second thread is worth testing. A Microsoft reply asked the poster to confirm that the intended users and devices were part of both the old and the new policy, and to check the per-policy sync status under the DLP policies. The poster reported that local files were blocked afterward.

For shared hosts, such as Azure Virtual Desktop multi-session machines, confirm that each host appears under **Devices**. The fourth thread's author saw no shared hosts in the list, and a personal host that did appear still did not trigger the policy. A moderator could not reproduce it and asked for a support case. Learn lists known limits for virtual environments: Copy to Clipboard and Endpoint DLP enforcement cannot be monitored on Azure Virtual Desktop through browsers (the same egress is monitored through Remote Desktop sessions), and USB storage is treated as a network share.

## Step 5: Turn on network share coverage when you need it

In the Endpoint DLP settings, Learn describes the setting **Network share coverage and exclusions**. When it is on, endpoint DLP policies and actions also apply to new and edited files on network shares and mapped network drives. When it is off, files there are not covered.

In the second thread, a Microsoft reply pointed to this setting after the poster reported that files from a file server bypassed the block. The poster said the setting was already enabled and still saw that a file on a mapped drive was not blocked, while the same file on the desktop was. No fix was reported. If you are in the same spot, check the Learn prerequisites for this feature, which list minimum Windows cumulative updates and a minimum Defender platform and engine version, and then open a support case.

## Step 6: Check browser and domain restrictions

For upload rules, look at **Browser and domain restrictions to sensitive data** in the Endpoint DLP settings. Learn describes these limits:

- The restrictions apply to uploads in Microsoft Edge, and in Chrome or Firefox only with the Microsoft Purview browser extension. They do not apply to paste actions.
- In block mode, only the listed domains are restricted. In allow mode, at least one domain must be listed, or nothing is enforced.
- The list holds up to 50 domains. `contoso.com` does not match `www.contoso.com`, while `*.contoso.com` matches the domain and all subdomains.

A wrong entry here can make a policy look dead for upload scenarios while copy-to-USB still works.

## Step 7: Compare with Activity explorer after a policy edit

The third thread asks whether Endpoint DLP keeps an old scan result, so that files must be relabeled before an edited policy applies. A reply says that manual relabeling after each edit is not documented behavior. When a file that was classified earlier is used again, Endpoint DLP checks whether policies, rules or sensitive information types have changed and evaluates again. A reused classification result is not the same as skipped enforcement.

The reply suggests this test:

1. Confirm that **Configuration status** and **Policy sync status** are both **Updated**.
2. Repeat the blocked action with an unchanged, supported file.
3. Open **Activity explorer** and compare the policy, rule and action recorded for that event.
4. Recheck the policy mode, the scope, the app and browser exclusions and the supported file types. A 10 KB condition does not mean every file type is covered.

If enforcement only returns after the files were rewritten, avoid bulk file changes. Collect the reproduction steps, policy versions and the OS and Defender versions, and open a case.

## What to give Microsoft Support

Learn's sync page lists the data to note: operating system, Defender engine version, Defender client version, the MDATP device ID and the valid user. It also points to the client analyzer for Windows and for macOS and Linux.

## Limits of this guide

- The checklist is built from threads without a confirmed fix. Each step is documented by Learn, but no thread proves that one of them was the cause.
- Learn does not describe domain-joined-only devices. The statement that they may not work comes from a Microsoft reply and from the absence of that state on the supported list.
- Windows, Defender and macOS requirements change. Compare with the live pages. The Learn pages used here show updates between June and August 2026.

## Related

- [Endpoint DLP](https://www.m365.fm/entity/endpoint-dlp/)
- [Data loss prevention (DLP)](https://www.m365.fm/entity/dlp/)
- [Microsoft Purview](https://www.m365.fm/entity/purview/)
- [Activity explorer](https://www.m365.fm/entity/activity-explorer/)
- [Microsoft Entra hybrid join](https://www.m365.fm/entity/hybrid-entra-join/)

## Sources

- [Microsoft Learn: Onboard Windows devices into Microsoft 365](https://learn.microsoft.com/en-us/purview/device-onboarding-overview)
- [Microsoft Learn: Get started with Endpoint DLP](https://learn.microsoft.com/en-us/purview/endpoint-dlp-getting-started)
- [Microsoft Learn: Troubleshoot Endpoint DLP configuration and policy sync](https://learn.microsoft.com/purview/dlp-edlp-tshoot-sync)
- [Microsoft Learn: Configure Endpoint DLP settings](https://learn.microsoft.com/en-us/purview/dlp-configure-endpoint-settings)
- [Microsoft Community Hub: DLP policy stops working when device is joined to the local domain (reply April 2026)](https://techcommunity.microsoft.com/discussions/azurepurview/dlp-policy-stops-working-when-device-is-joined-to-the-local-domain/4277834/replies/4509734)
- [Microsoft Community Hub: MS Purview for DLP Endpoint not working (August 2025)](https://techcommunity.microsoft.com/discussions/azurepurview/ms-purview-for-dlp-endpoint-not-working-/4439987)
- [Microsoft Community Hub: purview EDLP (November 2026)](https://techcommunity.microsoft.com/discussions/azurepurview/purview-edlp/4572246)
- [Microsoft Q&A: Purview DLP policies not triggering on shared AVD hosts (April 2026)](https://learn.microsoft.com/en-us/answers/questions/5853894/the-ms-purview-dlp-policies-are-currently-not-trig)
