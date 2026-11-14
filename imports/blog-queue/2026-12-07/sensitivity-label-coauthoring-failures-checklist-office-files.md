---
title: "Sensitivity Label Coauthoring Failures and File Lockouts: A Checklist for Office Files"
summary: "Why labeled and encrypted Office files open in exclusive mode or block coauthoring and AutoSave, and what to check: tenant settings, app versions, label options, old clients and file limits."
status: review
publish: false
author: mirko-p
date: 2026-12-07
topics: [sensitivity-labels, purview, microsoft-365]
keypoints:
  - "Without the co-authoring setting, desktop apps open labeled and encrypted files in exclusive editing mode and users must check them out."
  - "The setting lives under Microsoft Purview portal > Settings > Solution settings > Information Protection > Co-authoring for files with sensitivity labels. Allow 24 hours."
  - "Minimum Microsoft 365 Apps builds include 2107 on Windows (Current Channel) and 16.51 on macOS. One old client can break coauthoring for everyone."
  - "Labels with a user-access expiry other than Never, or with Double Key Encryption, do not support coauthoring and AutoSave."
  - "Files labeled before SharePoint and OneDrive support was turned on must be downloaded and uploaded again to be recognized."
faq:
  - q: "Why does a labeled file open in exclusive mode and ask for a check-out?"
    a: "Microsoft Learn says that without the co-authoring setting, users must check out an encrypted document in SharePoint or OneDrive when using Office desktop apps and cannot collaborate in real time. Office for the web is the alternative."
  - q: "How long does the co-authoring setting take to apply?"
    a: "The Learn article says to wait 24 hours for the setting to replicate across the environment. The setting cannot be turned off again in the portal after it is enabled."
  - q: "Which labels do not support coauthoring?"
    a: "Per Microsoft Learn, labels where User access to content expires is set to anything other than Never, and labels with Double Key Encryption, do not support coauthoring and AutoSave. User-defined permissions are supported only with specific versions and limitations."
  - q: "Why does coauthoring fail if my own app is up to date?"
    a: "Learn states that coauthoring and AutoSave do not work for a labeled and encrypted document if another user has it open in an Office desktop app that does not support the new labeling metadata. This can also affect external users and guests."
  - q: "Do the Learn pages list the exact error messages?"
    a: "No. The co-authoring article describes behavior and limitations but does not give exact wording of lock or error messages. The Office known-issues page also has no entry for locked or read-only labeled files."
---

When a labeled and encrypted Office file will not coauthor, AutoSave stays off, or the file seems locked, the cause is usually one of five things: the co-authoring setting is not enabled, an app is below the minimum version, the label uses an unsupported option, another client still uses the old labeling metadata, or the file itself cannot be processed by SharePoint or OneDrive. Work through the checks in this order.

The Microsoft Learn pages read for this article do not quote exact lock or error messages. This checklist therefore names causes, not message texts.

## Step 1: Confirm the basic behavior

Learn describes the default. Without co-authoring for encrypted files, users must check out an encrypted document stored in SharePoint or OneDrive when they use Office desktop apps. Real-time collaboration is not possible. The article says Office desktop and mobile apps continue to open labeled and encrypted files in exclusive editing mode. Office for the web is the workaround.

If that matches the symptom, the setting is probably off.

## Step 2: Enable labels for SharePoint and OneDrive

Sensitivity labels must be enabled for Office files in SharePoint and OneDrive. Learn says the co-authoring setting enables this automatically if it is not on. To enable it on its own:

- In the Microsoft Purview portal, open **Solutions** > **Information Protection** > **Sensitivity labels** and select **Turn on now** if the banner appears. Global Administrator is required.
- Or run `Set-SPOTenant -EnableAIPIntegration $true` in SharePoint Online Management Shell (16.0.19418.12000 or later).

Learn says tenant-level SharePoint changes take about 15 minutes. It also lists no command to read the current state of this setting.

## Step 3: Enable co-authoring

1. Sign in with at least the DLP Compliance Management or Information Protection Admin role. Security Administrator and Compliance Administrator also work.
2. Open **Microsoft Purview portal** > **Settings** > **Solution settings** > **Information Protection** > **Co-authoring for files with sensitivity labels**.
3. Select **Turn on co-authoring for files with sensitivity labels** and **Apply**.
4. Wait 24 hours.

Read the warning first. Labeling metadata for unencrypted files is no longer saved in custom properties. Learn says not to enable the setting if an app, script or service reads or writes labeling metadata in the old place. Consequences it lists include documents appearing unlabeled, failing coauthoring and AutoSave, and Exchange mail flow rules not encrypting correctly. In the portal the setting cannot be turned off afterward. The documented way to disable it is `Set-PolicyConfig -EnableLabelCoauth:$false` in Security & Compliance PowerShell.

## Step 4: Check app versions

Learn lists minimum Microsoft 365 Apps versions:

| Platform | Minimum |
|---|---|
| Windows | 2107 (Current Channel or Monthly Enterprise Channel), 2202 (Semi-Annual Enterprise Channel) |
| macOS | 16.51 |
| iOS | 2.58 |
| Android | 16.0.14931 |

Other components also matter, including the OneDrive sync app (19.002.0121.0008 on Windows) and the Microsoft Purview Information Protection client (3.0). Endpoint DLP needs specific Windows updates on older Windows 10 builds.

Learn warns that one client without support is enough. Coauthoring and AutoSave fail if another user has the file open in a desktop app that lacks the new metadata support. External users and guests count too.

## Step 5: Check the label itself

These label settings do not support coauthoring and AutoSave:

- **User access to content expires** set to anything other than **Never**.
- **Double Key Encryption**.

Users still see such labels. If nobody else is editing, they get a warning that coauthoring and AutoSave will not be available. If someone else is editing, they see a message that the label cannot be applied. User-defined permissions work only with specific versions and limitations.

Office for the web does not display labels with an expiry other than **Never** or with Double Key Encryption. Documents with Double Key Encryption or HYOK cannot be opened there.

## Step 6: Check the file

The SharePoint and OneDrive article lists files that cannot be processed:

- Files with Power Query data, custom add-in data, custom XML parts or bibliographies, or a Document ID added on upload.
- Password-protected documents.
- A labeled and encrypted Office file larger than 12 MB that is copied or moved to a different site.
- Files uploaded by users without at least View usage rights, where the label is not recognized.

For a file that was labeled and encrypted before SharePoint and OneDrive support was enabled, Learn says the label is not recognized and the contents are not processed. Download the file and upload it again to its original location.

A checked-out file also behaves differently. The Sensitivity column does not show the label name until the file is checked in and opened again.

## Step 7: Check for stripped labels

The Office known-issues page lists one related case. When co-authoring of encrypted labeled files is off, Document Inspection can remove labels that do not apply encryption. Microsoft gives no workaround there, other than enabling the feature as described above.

## Quick triage

1. File asks for check-out: enable co-authoring and wait 24 hours.
2. Works for some users only: look for old Office builds, old sync clients and guest users.
3. One label fails, others work: check expiry and Double Key Encryption.
4. One file fails, others work: check size, password protection and embedded data.

## Related

- [Sensitivity labels](https://www.m365.fm/entity/sensitivity-labels/)
- [Microsoft Purview](https://www.m365.fm/entity/purview/)
- [Microsoft Information Protection (MIP)](https://www.m365.fm/entity/microsoft-information-protection/)
- [OneDrive](https://www.m365.fm/entity/onedrive/)

## Sources

- [Enable co-authoring for files encrypted with sensitivity labels (Microsoft Learn)](https://learn.microsoft.com/en-us/purview/sensitivity-labels-coauthoring)
- [Enable sensitivity labels for Office files in SharePoint and OneDrive (Microsoft Learn)](https://learn.microsoft.com/en-us/purview/sensitivity-labels-sharepoint-onedrive-files)
- [Known issues with sensitivity labels in Office (Microsoft Support)](https://support.microsoft.com/en-us/office/known-issues-with-sensitivity-labels-in-office-b169d687-2bbd-4e21-a440-7da1b2743edc)
