---
title: "OneDrive Files On-Demand Shows Red X or Sync Pending: What Learn Documents"
summary: "What Microsoft Learn documents for OneDrive Files On-Demand red X and sync pending problems: the three file states and attrib commands, the cloud files filter driver fix, sync reports for admins, and what the pages read do not explain."
status: review
publish: false
author: mirko-p
date: 2027-01-06
topics: [onedrive-files-on-demand, onedrive]
keypoints:
  - "The Learn pages read do not explain the meaning of the red X or sync pending icons or give a list of causes. That content sits on a support page that could not be read."
  - "Files On-Demand has three states mapped to file attributes: Always available (pinned), Locally available (clearpin) and Online-only (unpinned). The attrib command shows and sets them."
  - "If the Files On-Demand option does not appear, Learn says to set the Windows Cloud Files Filter Driver service start type to 2 (AUTO_START)."
  - "Admins can use OneDrive sync reports in the Microsoft 365 Apps admin center to find devices with sync errors. They need sync app 22.232 or later."
  - "A Learn article on files that cannot sync describes only a folder named _private and applies to the old sync client."
faq:
  - q: "What does a red X on a OneDrive file mean?"
    a: "The Learn pages read for this guide do not define the red X or sync pending icons. The icon meanings are documented on a Microsoft support page that could not be read here, so check it directly."
  - q: "How do I see a file's Files On-Demand state?"
    a: "Per Microsoft Learn, run attrib with the path to the file or folder. The three states map to attributes: Always available is Pinned (attrib +p), Locally available is Clearpin (attrib -p) and Online-only is Unpinned (attrib +u)."
  - q: "Why is the Files On-Demand option missing?"
    a: "Learn says that if the option does not appear in Settings even when the sync app requirements are met, set the Windows Cloud Files Filter Driver service start type to 2 (AUTO_START). This corresponds to the CldFlt registry value Start set to dword 2."
  - q: "How can an admin find devices with sync errors?"
    a: "Use the OneDrive sync reports dashboard in the Microsoft 365 Apps admin center. After setup with a Tenant Association Key, Global Reader is enough to view reports. Devices need sync app 22.232 or later."
  - q: "Do the reports update in real time?"
    a: "No. Learn says last status reported updates about every 36 hours, or about an hour after the client starts. Devices must be on for at least 5 hours to be eligible."
---

The Microsoft Learn pages read for this guide do not explain what the red X or the sync pending icon means, and they give no list of causes for either. This guide therefore covers only what Learn does document: how Files On-Demand states work, one documented fix for a missing Files On-Demand option, and the admin dashboard that shows which devices have sync errors. It is not a complete troubleshooting guide for red X and sync pending.

## What could not be confirmed

- The meaning of the red X, sync pending, cloud and green check icons. Learn's Files On-Demand command-line page does not mention icons. The icon reference is on a Microsoft support article that could not be read here.
- Causes and fixes for a red X or sync pending. A search of Learn returned mostly Microsoft Q&A threads, which are community answers and not Microsoft statements, so they were not used.
- Path length limits, invalid characters and file size limits. The Learn pages read do not state them.
- Reset steps for the sync app.

## Files On-Demand states

Learn says files can be in one of three states, each corresponding to a file attribute state.

| Files On-Demand state | Attribute state | Command |
| --- | --- | --- |
| Always available | Pinned | `attrib +p <path>` |
| Locally available | Clearpin | `attrib -p <path>` |
| Online-only | Unpinned | `attrib +u <path>` |

To query a file or folder, run `attrib <path to file or folder>`. Learn's notes:

- Pinning an online-only file makes the sync app download the contents. Unpinning a downloaded file frees up space by not storing the contents locally.
- To set an online-only file or folder to locally available, you must first set it to always available.

These commands help you check whether a file is meant to be local or online-only. They do not explain an error icon.

## Files On-Demand option missing

The page links the sync app requirements and does not list them. If the Files On-Demand option does not appear under Settings even when those requirements are met, Learn says to set the **Windows Cloud Files Filter Driver** service start type to `2` (AUTO_START). That corresponds to this registry value:

```text
[HKLM\SYSTEM\CurrentControlSet\Services\CldFlt]"Start"="dword:00000002"
```

Change registry values only as your organization's standard allows, and test on one device first.

## A legacy issue that does not apply to most cases

A Learn troubleshooting article describes files that cannot sync because a folder is named `_private`, which is not supported in SharePoint Online. Symptoms include the error that the file name contains invalid characters. The article applies to the previous OneDrive for Business sync client (groove.exe), so it is unlikely to explain a red X in the current client.

## OneDrive sync reports for admins

If you need to find which devices have sync errors, the OneDrive sync reports dashboard helps.

- **Where:** the Microsoft 365 Apps admin center at `config.office.com`. Setup is under **Setup**, where the Tenant Association Key is shown or generated.
- **Roles:** Office Apps Administrator or Microsoft 365 Administrator to set up. Global Reader, Security Administrator, Office Apps Administrator or Reports Reader to view.
- **Requirements:** OneDrive sync app 22.232 or later on Windows and macOS, on the Insiders, Production or Deferred update ring. Devices must reach `https://clients.config.office.net`. Not available for Office 365 operated by 21Vianet.
- **Policy:** in Intune, a Settings catalog policy with **Enable sync health reporting for OneDrive** and **Sync Admin Reports**, plus the key. GCC, GCC High and DoD do not need the key.
- **Sections:** Overview with cards for sync errors, known folders and sync app version, Devices with one row per user and device, and Issues with error messages and affected device counts.
- **Timing:** last status reported updates about every 36 hours or about one hour after the client starts. Devices stay in inventory for 30 days by default. Devices must be on for at least 5 hours to be eligible.
- **Not defined:** the Errors column shows an icon and status, but the page does not say what each means. The full error message list is in a linked article.

If reports do not appear after three days, confirm the setting is applied, wait 36 hours with the device on and signed in, and then open a support ticket.

## A cautious approach

The steps are practical advice, within what Learn documents.

1. Check the state of an affected file with `attrib`.
2. If it is meant to be online-only, check whether the app opening it expects a local copy.
3. As an admin, use the sync reports to see whether the problem is isolated or widespread.
4. Read the support icon reference and the error message list for the exact meaning before you change settings.
5. Open a support ticket with the device ID if the device does not appear in the reports.

## Typical mistakes

- Treating Q&A forum answers as Microsoft guidance.
- Changing the registry value without confirming the requirements first.
- Expecting the reports to update immediately.

## Related

- [OneDrive Files On-Demand](https://www.m365.fm/entity/onedrive-files-on-demand/)
- [OneDrive](https://www.m365.fm/entity/onedrive/)
- [OneDrive sync engine](https://www.m365.fm/entity/onedrive-sync-engine/)

## Sources

- [Use OneDrive Files On-Demand with the command line (Microsoft Learn)](https://learn.microsoft.com/sharepoint/files-on-demand-windows)
- [OneDrive sync reports in the Apps Admin Center (Microsoft Learn)](https://learn.microsoft.com/sharepoint/sync-health)
- [You can't sync files or folders (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/sharepoint/lists-and-libraries/cannot-sync-files-folders)
