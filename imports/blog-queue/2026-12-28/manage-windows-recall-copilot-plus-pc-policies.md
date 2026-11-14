---
title: "Manage Windows Recall on Copilot+ PCs: Policies, Defaults and Filtering"
summary: "Manage Windows Recall for managed Copilot+ PCs using Microsoft Learn: default removal, the two policies that make it available, storage and retention limits, app and website filters, DLP provider, export for the EEA and the system requirements. The page lists CSP and Group Policy paths."
status: review
publish: false
author: mirko-p
date: 2026-12-28
topics: [windows-recall, copilot-plus-pc, intune]
keypoints:
  - "By default Recall is disabled and removed on managed devices. IT admins can make it available but cannot turn on snapshot saving for users, because saving is opt-in per user."
  - "To make Recall available, configure both Allow Recall to be enabled and Turn off saving snapshots for Recall. Setting the first to Disabled removes the component and deletes saved snapshots."
  - "Storage options are 10, 25, 50, 75, 100 or 150 GB and retention options are 30, 60, 90 or 180 days, for Enterprise and Education editions."
  - "Requirements include a Copilot+ PC meeting Secured-core, a 40 TOPS NPU, 16 GB RAM, 256 GB storage, Windows Hello Enhanced Sign-in Security and BitLocker or Device Encryption."
  - "The page lists CSP and Group Policy paths for each setting and does not give an Intune menu path. It labels Recall as preview and was last updated on 2025-12-10."
faq:
  - q: "Is Recall on by default for managed devices?"
    a: "According to Microsoft Learn, no. Recall is disabled and removed on managed devices by default. IT admins can allow it, but users must individually opt in to saving snapshots."
  - q: "Which policies make Recall available?"
    a: "Allow Recall to be enabled and Turn off saving snapshots for Recall. The CSP for the first is AllowRecallEnablement under WindowsAI, and for the second DisableAIDataAnalysis."
  - q: "Can IT see users snapshots?"
    a: "Learn says IT admins and Microsoft cannot access or view snapshots on end-user devices, and users authenticate with Windows Hello before Recall launches and before snapshots are accessed."
  - q: "How do I exclude apps or websites?"
    a: "Use the policies that set a list of apps or URIs to be filtered from snapshots. Apps are semicolon-separated AUMIDs or executable names and websites are semicolon-separated URIs with the scheme. Changes take effect after a restart. These apply to Enterprise and Education."
  - q: "What are the hardware requirements?"
    a: "A Copilot+ PC that meets the Secured-core standard, 40 TOPS NPU, 16 GB RAM, 8 logical processors and 256 GB storage, with at least 50 GB free to enable Recall. Snapshot saving pauses below 25 GB free."
---

Recall lets users search locally saved snapshots of their screen in natural language. On managed devices, Microsoft Learn says Recall is disabled and removed by default. This guide follows the Learn page on managing Recall, which labels the feature as preview and shows a last update of 2025-12-10.

## Defaults and privacy points

- IT admins can allow Recall but cannot turn on snapshot saving for users. Saving is opt-in and each user consents.
- Processing is local, snapshots are not sent to Microsoft, and IT admins and Microsoft cannot view snapshots on user devices.
- Users authenticate with Windows Hello before Recall launches. Snapshots and the vector database are encrypted with keys protected by the TPM.
- Sensitive information filtering is on by default and runs on the device.

## Requirements

A Copilot+ PC that meets the Secured-core standard, 40 TOPS NPU, 16 GB RAM, 8 logical processors and 256 GB storage. Enabling Recall needs at least 50 GB free, and saving pauses when free space drops below 25 GB. Users need Device Encryption or BitLocker and Windows Hello Enhanced Sign-in Security with at least one biometric option. The page names no minimum Windows build.

## Make Recall available

Configure both policies:

| Policy | CSP and Group Policy | Behavior |
| --- | --- | --- |
| Allow Recall to be enabled | WindowsAI AllowRecallEnablement. Computer Configuration, Administrative Templates, Windows Components, Windows AI | Default disabled. Enabled makes Recall available. Disabled removes the component and deletes saved snapshots, with a restart |
| Turn off saving snapshots for Recall | WindowsAI DisableAIDataAnalysis, device and user scope | Default is that snapshots are not saved. Enabled turns saving off and deletes snapshots. Disabled lets users choose to save |

In some commercial environments the package does not deploy automatically. Learn gives `Enable-WindowsOptionalFeature -Online -FeatureName "Recall"` and says this will be fixed in a future update. A user can remove it with `Disable-WindowsOptionalFeature -Online -FeatureName "Recall" -Remove`.

## Storage and retention (Enterprise and Education)

- Maximum storage: 10, 25, 50, 75, 100 or 150 GB. If not configured, the OS allocates 25 GB on 256 GB devices, 75 GB on 512 GB and 150 GB on 1 TB or more. The oldest snapshots are deleted first.
- Maximum duration: 30, 60, 90 or 180 days. If not configured, snapshots are kept until the storage limit is reached.

## Filtering (Enterprise and Education)

- Websites: semicolon-separated URIs that include the scheme, for example https://www.Contoso.com. Filtering applies to the foreground site in supported browsers, and parts of a filtered site can still appear, such as embedded content or history.
- Apps: semicolon-separated AUMIDs or executable names, for example code.exe.
- Some remote desktop clients, including mstsc.exe, VMConnect.exe and Azure Virtual Desktop (MSI), are filtered by default.
- Changes take effect after a restart. Recall does not store DRM content or record audio.

## Browsers and languages

Learn lists Microsoft Edge, Firefox, Opera and Google Chrome as supported browsers that filter specified websites and private browsing, and Chromium-based browsers from version 124 that filter private browsing only. Recall is optimized for English, Chinese (Simplified), French, German, Japanese and Spanish.

## Unmanaged devices

On unmanaged Copilot+ PCs Recall is available by default and users opt in to saving snapshots, and each person signed in makes their own choice. For virtual desktops the page says to test that supported clients honor screen capture protection, and notes that Azure Virtual Desktop and Windows 365 have policies to keep content out of screenshots.

## DLP and export

A Data Loss Prevention policy lets Recall use a provider to keep blocked windows out of snapshots. Microsoft Purview is currently the only supported provider. Export applies to devices in the EEA only, is disabled by default for managed devices and is user-initiated.

## Inconsistencies to verify

The page lists the Computer Configuration path for the maximum duration policy under the storage-limit name, and its example AUMID contains a space in Microsoft. WindowsNotepad. Verify both in your ADMX templates before deploying.

## Not covered

The page gives CSP and Group Policy paths and no Intune menu path. It says no built-in Conditional Access policies in Intune or Entra currently address Recall on unmanaged devices.

## Related

- [Windows Recall](https://www.m365.fm/entity/windows-recall/)
- [Copilot+ PC](https://www.m365.fm/entity/copilot-plus-pc/)
- [Intune](https://www.m365.fm/entity/intune/)

## Sources

- [Manage Recall](https://learn.microsoft.com/windows/client-management/manage-recall)
