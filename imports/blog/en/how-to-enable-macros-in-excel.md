---
title: "How to Enable Macros in Excel (Windows, Mac and Blocked Files)"
summary: "How to enable macros in Excel: use Enable Content for one file, Unblock for downloaded files, or the Trust Center for all. Includes Mac, web and policy limits."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [excel, office-scripts]
keypoints:
  - "To enable macros in one file, select Enable Content in the yellow security bar. Excel then treats that file as a trusted document."
  - "A red Security Risk banner without an Enable Content button means the file came from the internet. Right-click the file, open Properties and tick Unblock."
  - "For all files, go to File, Options, Trust Center, Trust Center Settings, Macro Settings. The default is to disable macros with notification."
  - "Trusted locations let macro files from one folder run without prompts, so only add folders you control."
  - "Excel for the web can open and edit a macro workbook but can't create, run or edit VBA macros."
faq:
  - q: "How do I enable macros in Excel for one workbook?"
    a: "Open the workbook and select Enable Content in the yellow Security Warning bar under the ribbon. Excel then marks the file as a trusted document, so it won't ask again for that file. If the banner is red and has no Enable Content button, unblock the file in its Properties first."
  - q: "Why does Excel say Microsoft blocked macros from running?"
    a: "The file came from an untrusted place, such as an email attachment or a browser download, and Windows marked it with the Mark of the Web. Office on Windows blocks macros in these files by default. Right-click the file, choose Properties and tick Unblock, but only if you trust the sender."
  - q: "Is it safe to enable all macros in Excel?"
    a: "No. Microsoft labels Enable all macros as not recommended, because every macro then runs without any confirmation and your computer is open to malicious code. A safer choice is to keep the default, Disable all macros with notification, and enable macros one trusted file at a time."
---
To enable macros in Excel, open the workbook and select **Enable Content** in the yellow security bar under the ribbon. That turns macros on for this one file. If you want a different default for every file, go to **File** > **Options** > **Trust Center** > **Trust Center Settings** > **Macro Settings** and pick a level there. This article is for Excel users who got a workbook that won't run its macros, and for admins who need to explain why. You'll see the quick route for one file, the fix for the red "Security Risk" banner, the Trust Center settings in plain words, trusted locations, and what changes on Mac and in the browser.

One rule before any click: Microsoft's own advice is to never enable macros in a file unless you know what those macros do. You don't need macros to open, read or edit a workbook. Macros are only needed when you want the automation to run.

## What macros are and why Excel blocks them

A macro is a small program, written in VBA (Visual Basic for Applications) or recorded with the macro recorder, that repeats steps for you. Cleaning up a weekly export, formatting a report, copying data between sheets: that kind of work. [Excel](https://www.m365.fm/entity/excel/) stores macros in files with the `.xlsm` extension (or in older `.xls` files), which is why a plain `.xlsx` file never asks about macros at all.

The reason for the warnings is simple. A macro is code, and code can do harm. Attackers have used VBA macros for years to deliver malware and ransomware, usually inside an attachment that looks like an invoice or a shipping note. That's why Excel disables macros until you decide. It's also why the rest of this article keeps coming back to the same question: do you trust where this file came from?

## Enable macros in one file with Enable Content

This is the route most people need, and it's the safest one because it leaves your global settings alone.

1. Open the workbook. If it contains macros and your setting is the default, a yellow bar appears under the ribbon saying macros have been disabled.
2. Select **Enable Content**.
3. If Excel shows a Security Warning dialog, choose **Yes** to trust the document.

Microsoft's page on [enabling or disabling macros in Microsoft 365 files](https://support.microsoft.com/en-us/office/enable-or-disable-macros-in-microsoft-365-files-12b036fd-d140-4e74-b45e-16fed1a7e5c6) describes this as marking the document as trusted. That wording matters. Many guides claim that macros are switched off again as soon as you close the file. Microsoft's description is different: once you've trusted a document, Excel stops asking about it. Microsoft adds that you can't revoke trust for a single file. To take it back you clear all trusted documents in the Trust Center, and then every file asks again.

If you only want to run a macro once and not trust the file for good, there's no good middle path in the banner. In that case open the file, check what the macro does if you can read VBA, and decide.

## When the banner is red: unblock a file from the internet

Since 2022, Office on Windows has blocked macros in files that come from the internet. You'll see it with email attachments and browser downloads. The banner says **Security Risk**, mentions that Microsoft blocked the macros because the source of the file is untrusted, and has a **Learn More** button. There's no **Enable Content** button. You can click around the banner all day and nothing will happen.

What's going on: Windows tags files from untrusted places with a hidden marker called the Mark of the Web. Office looks for that marker, and when it finds one, it blocks macros before any of your own settings come into play. Microsoft's article on [macros from the internet being blocked by default](https://learn.microsoft.com/en-us/microsoft-365-apps/security/internet-macros-blocked) lists the order Office uses to decide, and the block is the last step, reached only when nothing earlier allows the macro.

To unblock a file you trust:

1. Close the workbook if it's open.
2. In File Explorer, right-click the file and choose **Properties**.
3. On the **General** tab, tick the **Unblock** checkbox, then confirm the dialog.
4. Open the file again. The usual yellow bar with **Enable Content** should appear.

Microsoft also documents a PowerShell route, `Unblock-File -Path "C:\Path\To\File.xlsm"`, which removes the marker with the same effect. The Unblock checkbox can be missing for files on a network share. In that case a trusted site, the local intranet zone or a trusted location is the way to go, and that's usually a job for IT.

A few details from the same page that save time:

- The marker only applies to files on NTFS drives. A file on a FAT32 USB stick doesn't get one.
- Files you download with the OneDrive sync client, files you open with **Open in Desktop App** from SharePoint or OneDrive, and files in synced known folders such as Desktop and Documents don't get the marker.
- The block is a Windows-only behavior. Office on Mac, Office on Android and iOS, and Office on the web aren't affected.

## How to enable macros in Excel for every file through the Trust Center

The Trust Center holds the global switch. Use it when you open macro files all day and the yellow bar is wearing you out, or when you want to tighten things instead.

1. Select **File** > **Options**.
2. Select **Trust Center**, then **Trust Center Settings**.
3. Select **Macro Settings**, choose an option and select **OK**.

There's a shortcut: if the Developer tab is on your ribbon, select **Developer**, then **Macro Security** in the Code group. Both routes lead to the same dialog.

Here are the options as Excel names them, based on Microsoft's macro security settings page for Excel and the Microsoft 365 page above. In some Microsoft 365 versions the labels read "Disable VBA macros" instead of "Disable all macros", and the meaning is the same.

- **Disable all macros without notification.** Macros are off and so are the alerts. Pick this if you never need macros, or if you want unsigned macros to run only from trusted locations.
- **Disable all macros with notification.** The default. Macros stay off, you get the alert, and you decide file by file.
- **Disable all macros except digitally signed macros.** Signed macros from a publisher you trust run. Unsigned ones are blocked. For a signed macro from a publisher you haven't trusted yet, Excel lets you enable it and trust the publisher.
- **Enable all macros (not recommended, potentially dangerous code can run).** Every macro runs without asking. Microsoft says this leaves the computer vulnerable to malicious code. Don't use it as a convenience setting.
- **Enable Excel 4.0 macros when VBA macros are enabled.** An Excel-only checkbox. Ticked, your VBA choice also applies to old XLM macros. Unticked, XLM macros are disabled without notification.
- **Trust access to the VBA project object model.** A developer setting that controls whether other programs can read and change VBA code in your workbooks. It's off by default and per user. Leave it off unless a tool you trust asks for it.

Two limits apply. First, a setting in Excel applies to Excel only, not to Word or PowerPoint. Second, on a work or school device your administrator may have locked these options, and then the buttons are grayed out or your choice doesn't stick.

For most people the best setting is the default, **Disable all macros with notification**. It costs one click per new file and keeps you in control.

## Use trusted locations and trusted publishers

If you work with the same macro files every day, say a team template on a shared drive, trusting each file gets old. Trusted locations are the alternative.

To add one, go to **File** > **Options** > **Trust Center** > **Trust Center Settings** > **Trusted Locations**, select **Add new location**, select **Browse**, pick the folder and select **OK** until the dialogs close. The same page has **Modify** and **Remove** for changing or deleting a location. Microsoft's article on [adding, removing or changing a trusted location](https://support.microsoft.com/en-us/office/security-privacy/add-remove-or-change-a-trusted-location-in-microsoft-office) explains that files in these folders are considered safe and skip some security checks. That includes the internet block: a file saved from the internet into a trusted location opens with macros enabled.

So pick the folder carefully. A folder only you can write to is fine. A shared folder where many people drop files is a risk, and a folder like Downloads is a bad idea because it takes everything. Microsoft also says network locations can be trusted but advises against it.

The other option is a trusted publisher. A developer signs the macro with a code-signing certificate, and your device trusts that certificate. With the setting **Disable all macros except digitally signed macros**, signed macros from trusted publishers then run without a prompt. Microsoft points out two catches: everything signed with the same certificate is trusted, and trusted publishers are a Windows-wide setting. For companies, the recommended way is to deploy the publisher's certificate through policy and stop users from adding publishers on their own.

## Mac, Excel for the web and mobile

**Excel for Mac.** The red internet-macro block doesn't apply on Mac. To show the Developer tab, go to **Excel** > **Preferences** > **Ribbon & Toolbar**, select **Main Tabs** and tick **Developer**. I couldn't confirm the exact Mac menu path for macro security on a Microsoft page, so I won't give click-by-click steps for it here. Look in the Excel preferences for the security options, and test with a copy of the file. Also remember that VBA written for Windows can use features that don't exist on Mac, so a macro may fail on Mac for reasons that have nothing to do with security settings.

**Excel for the web.** Here the answer is no, with a twist. Microsoft's page on [VBA macros in Excel for the web](https://support.microsoft.com/en-us/office/work-with-vba-macros-in-excel-for-the-web-98784ad0-898c-43aa-a1da-4f0fb5014343) says you can open and edit a workbook that contains macros, and you won't see any messages about them, but you can't create, run or edit VBA macros. Removing macros has to be done in the desktop app too. If you need a macro to run, select **Open in Desktop App** above the ribbon.

**Mobile.** Microsoft's pages I read don't describe macro behavior on phones, so I'm not making a claim here. Plan on using the desktop app for anything that depends on a macro.

**If you want automation that works in the browser.** Office Scripts is a separate Microsoft feature. Microsoft's platform requirements for Office Scripts list Excel on the web, Excel for Windows (version 2210 or higher) and Excel for Mac, with the workbook stored in OneDrive for Business and a supported business or education license. It's not a way to run your old VBA. It's a different system, so an existing macro would have to be rebuilt. If you're curious, start with the [Office Scripts](https://www.m365.fm/entity/office-scripts/) page.

## Why macros still don't run after you enabled them

Work through these in order. The first two cause most of the cases.

- **The file is still blocked.** The red banner means the Mark of the Web is still on the file. Unblock it in Properties.
- **Your setting is stricter than you think.** Check **Macro Settings**. If it says **Disable all macros without notification**, no banner shows and nothing runs, and it can look as if the feature is broken.
- **Policy overrides you.** On managed devices IT can set the macro behavior. Microsoft's internet-macros page describes a policy named "Block macros from running in Office files from the Internet" and a separate "VBA Macro Notification Settings" policy, delivered through Group Policy, Intune or Cloud Policy. If your options are locked or a message says policy blocks macros, ask your IT team. Note that the policies for the internet block are available for Microsoft 365 Apps for enterprise, not for Microsoft 365 Apps for business.
- **The file isn't macro-enabled.** An `.xlsx` file can't hold macros. If the macros were lost, someone saved the file in the wrong format. Use **File** > **Save As** and choose Excel Macro-Enabled Workbook (`.xlsm`).
- **There is no Developer tab.** On Windows go to **File** > **Options** > **Customize Ribbon**, tick **Developer** under Main Tabs and select **OK**. The tab only gives you shortcuts. You can still reach the Trust Center without it.
- **The file is an add-in.** Microsoft notes that signatures don't work for Excel add-in files (`.xla`, `.xlam`) that carry the internet marker. Remove the marker or use a trusted location.

After the settings are right, run a macro from the Developer tab: select **Macros**, pick the macro in the Macro name box and select **Run**.

## Common mistakes

- Choosing **Enable all macros** because the yellow bar is annoying. Use a trusted location for the files you really use every day.
- Clicking **Enable Content** on an attachment you didn't expect. If you don't know why a file needs macros, don't switch them on.
- Looking for **Enable Content** on a red banner. Unblock the file in Properties instead.
- Trusting a whole shared folder or the Downloads folder as a trusted location.
- Assuming that a change in Excel also changes Word or PowerPoint. Each app has its own macro settings.
- Expecting macros to run in Excel for the web. They won't, and the browser doesn't warn you.

## Related topics to explore

- **Sign your macros.** A digital signature lets Excel trust your own macros without lowering any setting.
- **Group Policy and Intune for macro settings.** Read how the internet block and the notification policy are rolled out if you manage many devices.
- **Office Scripts as an alternative.** Look at the requirements and decide whether a browser-based script fits your task. The [Office Scripts](https://www.m365.fm/entity/office-scripts/) page is a starting point.
- **Edit and run a macro.** The Developer tab, the Macros dialog and the Visual Basic Editor are the next things to learn once macros run.
- **Protected View.** A separate Office safeguard for files from risky places. Look up what it blocks, because it's a different thing from the macro bar.

## Next step

Open the file that gave you trouble and look at the banner color. Yellow means select Enable Content, red means unblock the file in Properties first. If you need to enable macros in Excel for many people, set it up with a trusted location or signed macros and let your IT team deploy it, instead of asking everyone to lower their security level.
