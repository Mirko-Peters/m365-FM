---
title: "Outlook Will Not Start or Opens the Wrong Profile: Admin Troubleshooting Steps"
summary: "Fix classic Outlook that will not start or opens the wrong profile: startup troubleshooter, safe mode, add-ins, new profile, profile picker and default profile settings, data file repair and resetnavpane."
status: review
publish: false
author: mirko-p
date: 2026-12-22
topics: [outlook]
keypoints:
  - "Microsoft's order of fixes for classic Outlook that will not start: startup troubleshooter, safe mode, disable add-ins, new profile, repair data files, then /resetnavpane."
  - "Start safe mode with Outlook /safe from Windows key + R. If it starts in safe mode, an add-in is the likely cause."
  - "Disable COM add-ins instead of removing them, then re-enable one at a time to find the culprit."
  - "Hold Shift while starting Outlook to open the profile picker. Options lets you set a default profile or prompt for a profile at each start."
  - "Removing a profile deletes offline cached content, and profile deletion is permanent. Back up data files first."
faq:
  - q: "How do I start Outlook in safe mode?"
    a: "Microsoft Support says to press the Windows key + R, type Outlook /safe in the Open box and choose OK. In the Choose Profile dialog accept the default profile and choose OK. If Outlook starts, an add-in is the likely cause."
  - q: "How do I get Outlook to ask which profile to open?"
    a: "Hold Shift while starting Outlook, or run Outlook.exe /profiles, to open the profile picker. Select Options and select the check box Prompt for a profile to be used. Microsoft Support describes this for being prompted at each startup."
  - q: "How do I set the default profile?"
    a: "In the Choose Profile dialog select the profile in the Profile Name list, select Options, then select the Set as default profile check box. Microsoft says the default profile runs automatically whenever Outlook starts."
  - q: "Will deleting a profile delete my email?"
    a: "Microsoft says profile deletion is permanent and that Remove deletes all offline cached content. If the mail is in a PST file or not available elsewhere, back it up first. Mailbox data on the server is not described on these pages."
  - q: "Can I switch profiles while Outlook is running?"
    a: "Microsoft's profile overview says you cannot switch from one profile to another while Outlook is running. File > Account Settings > Change Profile restarts Outlook so you can pick another."
---

When classic Outlook will not open, or opens with a profile nobody expected, the cause is usually an add-in, a damaged profile or a profile setting. Microsoft Support lists a fixed order of fixes. This guide follows it and adds the profile picker steps for the wrong-profile case. It covers classic Outlook for Windows, not the new Outlook.

## Fix order for Outlook that will not start

### 1. Run the startup troubleshooter

For Microsoft 365 business customers, Microsoft offers a classic Outlook startup troubleshooter. It runs on Windows 10 or higher and must be run on the same PC where classic Outlook is installed. If a pop-up says the site is trying to open Get Help, select **Open** and follow the prompts. If it does not fix the problem, continue.

### 2. Start Outlook in safe mode

1. Press the Windows key + R.
2. In the **Open** box, type `Outlook /safe` and choose **OK**.
3. In the **Choose Profile** dialog, accept the default profile and choose **OK**.
4. Enter the password and choose **Accept** if prompted.

If Outlook starts in safe mode, an add-in is likely the cause, so go to step 3. If it does not, go to step 4.

### 3. Disable add-ins

1. Choose **File** > **Options** > **Add-ins**.
2. Make sure **Manage** shows **COM Add-ins** and choose **Go**.
3. Write down the checked add-ins, then clear the check boxes and choose **OK**. Do not choose **Remove**. Microsoft says you want to disable, not delete, an add-in.
4. Choose **File** > **Exit**, then reopen Outlook normally.
5. Re-enable add-ins one at a time and restart after each. If Outlook fails after you enable one, that add-in is the cause. Repeat for all add-ins, because more than one can cause an error.

### 4. Create a new profile

Follow Microsoft's instructions for creating an Outlook profile, restart Outlook and select the new profile in the **Choose Profile** dialog. If Outlook starts normally, the original profile was corrupt. Before removing a profile, back up data files, because **Remove** deletes all offline cached content.

### 5. Repair data files

Exit Outlook and run the Inbox Repair Tool, `scanpst.exe`, using Microsoft's instructions for repairing .pst and .ost files.

### 6. Reset the navigation pane

Close Outlook, press the Windows key + R, type `Outlook.exe /resetnavpane` and choose **OK**. Run it on every computer you use, because navigation pane customizations are stored locally.

The article also notes that older versions may be out of support, and links to Microsoft's notice that Office 2016 and 2019 clients are no longer supported for connecting to Microsoft 365 services.

## When Outlook opens the wrong profile

An email profile is made up of email accounts, data files and information about where your email is stored. Profiles are stored in the Windows registry, and Outlook reads them at startup. Whenever Outlook starts, the default profile runs automatically.

### Open the profile picker

Use one of these:

- Hold **Shift** while starting Outlook.
- Right-click the Start button, select **Run** and enter `Outlook.exe /profiles`.
- In a running Outlook, go to **File** > **Account Settings** > **Change Profile**. Outlook restarts.

### Set the default profile

1. In the **Choose Profile** dialog, select the profile in **Profile Name**.
2. Select **Options**.
3. Select **Set as default profile**.

### Be asked every time

In the profile picker, select **Options** and select **Prompt for a profile to be used**. The Support page describes turning the prompt on this way. It does not state the steps for turning it off, though clearing the check box is the likely way, so confirm on a test machine.

### Create or delete a profile

In the picker, select **Options** and then **New**, enter a name and select **OK**, then add an email account. To delete, choose the profile in the **Profile Name** list and select **Delete**. Microsoft says profile deletion is permanent, so be careful with data that is not backed up.

The Mail applet in Control Panel only appears if Outlook is installed and has been run at least once, and Microsoft says it cannot add accounts or profiles for Microsoft 365 that require Modern Authentication.

## Admin checklist

1. Check whether the problem appears for one user or many. Many users points to an update or add-in deployed centrally.
2. Run safe mode on an affected machine.
3. Compare add-in lists between a working and a failing machine.
4. Use the profile picker to see which profiles exist and which is default.
5. Create a test profile before touching the original.
6. Keep PST and OST backups before any removal.

Steps 1, 3 and 5 are practical suggestions rather than Microsoft's instructions.

## What the pages do not cover

The Support pages I read do not describe registry or Group Policy settings that force a profile, and they do not cover the new Outlook. For managed profile settings, check Microsoft's Outlook deployment documentation.

## Related

- [Outlook](https://www.m365.fm/entity/outlook/)

## Sources

- [I can't start Microsoft Outlook (Microsoft Support)](https://support.microsoft.com/office/d1f69da6-b333-4650-97bf-4d77bd7abb85)
- [Turn Outlook profile prompt on or off (Microsoft Support)](https://support.microsoft.com/office/turn-outlook-profile-prompt-on-or-off-b6f08321-51ec-4c1d-8c25-3e26ea475d25)
- [Overview of Outlook email profiles (Microsoft Support)](https://support.microsoft.com/office/overview-of-outlook-e-mail-profiles-9073a8ac-c3d6-421d-b5b9-fcedff7642fc)
