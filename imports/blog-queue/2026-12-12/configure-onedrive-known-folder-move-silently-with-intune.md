---
title: "OneDrive Known Folder Move With Intune: Configure It Silently Without User Prompts"
summary: "Set up silent OneDrive Known Folder Move with an Intune settings catalog profile: required settings, tenant ID, silent sign-in, rollout limits and the Folder Redirection conflicts Microsoft documents."
status: review
publish: false
author: mirko-p
date: 2026-12-12
topics: [onedrive, intune, microsoft-365]
keypoints:
  - "Create a Windows 10 and later settings catalog profile, add settings from the OneDrive category and enable Silently move Windows known folders to OneDrive with your tenant ID."
  - "Silent sign-in with Windows credentials works on Microsoft Entra joined PCs. Learn recommends it but does not call it a prerequisite for the silent move."
  - "Microsoft recommends limiting silent deployment to existing devices to 1,000 devices a day and no more than 4,000 a week."
  - "Pair the silent policy with the prompt policy, so users are asked to fix errors if the silent move fails."
  - "Known Folder Move policies do not work when Documents, Pictures or Desktop are redirected by Windows Folder Redirection to a non-OneDrive location."
faq:
  - q: "Which Intune setting moves known folders without asking the user?"
    a: "Per Microsoft Learn, the setting is named Silently move Windows known folders to OneDrive. It redirects Documents, Pictures and Desktop without user interaction when you enable it and provide your tenant ID. By default it moves all three folders unless you choose specific ones."
  - q: "Can I show users a notification after the move?"
    a: "Yes. Microsoft Learn says that if you enable the setting and provide your tenant ID, you can choose whether a notification appears after the folders have been redirected. In the registry this is the KFMSilentOptInWithNotification value, where 1 shows a notification."
  - q: "Why did my known folders not move?"
    a: "Microsoft documents several blockers. The Group Policy setting Prohibit User from manually redirecting Profile Folders must be Disabled or Not configured. Folders redirected by Windows Folder Redirection to a location other than OneDrive also stop Known Folder Move. Syncing OneDrive files in SharePoint Server is not supported either."
  - q: "How many devices should I target per day?"
    a: "Microsoft recommends deploying the silent policy to existing devices at no more than 1,000 devices a day and 4,000 a week, counted across macOS and Windows. For the prompt policy the figures are 5,000 a day and 20,000 a week."
---

To move Documents, Pictures and Desktop to OneDrive without any user prompt, create an Intune settings catalog profile with the OneDrive setting Silently move Windows known folders to OneDrive, enter your tenant ID, enable silent sign-in to the sync app, and assign the profile in stages. The details below come from Microsoft Learn pages on Known Folder Move, OneDrive policies and Intune configuration.

## What the silent policy does

Microsoft describes the policy as one that redirects and moves the Documents, Pictures and Desktop folders to OneDrive without user interaction. If you enable it and provide your tenant ID, you can choose to show a notification after the redirect. If you disable it or leave it unconfigured, folders are not moved silently.

Once a folder has been moved, the policy does not touch it again, even if you later change the folder selection. By default all three folders move. To select folders, set any combination of the Desktop, Documents and Pictures sub-settings.

## Silent sign-in (a practical prerequisite, my own inference)

A silent move practically needs a signed-in sync app. That is my own inference, because the Learn pages read do not name it as a prerequisite. Microsoft's setting Silently sign in users to the OneDrive sync app with their Windows credentials works for computers joined to Microsoft Entra ID. When enabled, users who are signed in on such a PC can set up the sync app without entering credentials. They still see OneDrive Setup, where they can select folders to sync and change the location of their OneDrive folder. The registry value behind it is `SilentAccountConfig`. Microsoft notes that the Microsoft Authentication Library is enabled automatically when the sync user is provisioned this way.

## Create the Intune profile

Microsoft's Intune procedure for OneDrive settings uses the settings catalog:

1. In the Microsoft Intune admin center, select **Devices** > **Configuration** > **Create**.
2. Set **Platform** to **Windows 10 and later** and **Profile type** to **Settings catalog**, then select **Create**.
3. On **Basics**, enter a name such as `Windows: OneDrive` and an optional description.
4. On **Configuration settings**, select **Add settings** and pick the **OneDrive** category.
5. Select the settings you need. For this task these are the silent move policy, the silent sign-in policy and, optionally, the prompt policy.
6. Configure each setting. Some require your tenant ID. Microsoft links a separate article, Find your Office 365 tenant ID, for the value.
7. Add scope tags if you use them, then assign the profile on **Assignments**.
8. Review and select **Create**.

The Intune page notes how assignment behaves. ADMX settings assigned to user groups apply to any device the user enrolls in and signs in to. Settings assigned to device groups apply to any user who signs in on that device. A computer-scope setting assigned to a user can also affect other users of the device. Microsoft's registry examples for the Known Folder Move values use the machine policy key, so check how your assignment scope applies them.

## Policy names and registry values

Microsoft's OneDrive policy reference lists the Known Folder Move policies as follows:

| Policy | Purpose | Registry value |
|---|---|---|
| Silently move Windows known folders to OneDrive | Moves folders without interaction | `KFMSilentOptIn` (tenant ID string) |
| Notification option of the silent policy | Notification after success | `KFMSilentOptInWithNotification` = 1 |
| Prompt users to move Windows known folders to OneDrive | Shows a window and reminders | `KFMOptInWithWizard` (tenant ID) |
| Prevent users from moving their Windows known folders to OneDrive | Blocks the move to any OneDrive account | `KFMBlockOptIn` |
| Prevent users from redirecting their Windows known folders to their PC | Disables the Stop protecting button | `KFMBlockOptOut` |

The folder sub-settings are `KFMSilentOptInDesktop`, `KFMSilentOptInDocuments` and `KFMSilentOptInPictures`. The page notes that the policy name for the block setting differs from its registry value name, so look for `KFMBlockOptIn` when verifying.

## Roll out in stages

Microsoft recommends deploying the silent policy to existing and new devices, while limiting existing devices to 1,000 a day and no more than 4,000 a week, across macOS and Windows. It also recommends using the silent policy together with the prompt policy. If the silent move fails, users are then prompted to correct the error and continue. For the prompt policy alone, Microsoft suggests existing devices only, at 5,000 a day and 20,000 a week.

For users with many files, the page suggests temporarily applying Limit the sync app upload rate to a percentage of throughput, then turning it off when uploads finish.

## Conflicts that stop the move

These items from Microsoft's documentation commonly explain why folders stay put:

- **Group Policy block.** The setting User Configuration > Administrative Templates > Desktop > Prohibit User from manually redirecting Profile Folders must be Disabled or Not configured. If it is Enabled, folders do not move.
- **Windows Folder Redirection.** Known Folder Move policies do not work if Documents, Pictures or Desktop were redirected to a location other than OneDrive. Music and Videos are unaffected. Microsoft's steps depend on where the folders point:
  - Pointing at OneDrive: disable Folder Redirection, leave the contents on OneDrive, then enable Known Folder Move.
  - Pointing at the local PC: disable Folder Redirection, leave the contents in place, then enable Known Folder Move.
  - Pointing at a network share: use Migration Manager to copy the contents into the user's OneDrive, disable Folder Redirection, then enable Known Folder Move. Learn says all contents must go into the existing Documents, Pictures or Desktop folders, and if Migration Manager creates those folders, **Preserve file share permissions** must not be selected.
- **Folders already redirected to another organization.** Redirecting to your organization's OneDrive creates new folders and the user sees empty folders. Files must be migrated manually. Microsoft advises disabling the other redirect first if possible.
- **SharePoint Server.** Known Folder Move does not work for users syncing OneDrive files in SharePoint Server.

The pages read do not state a minimum OneDrive or Windows build. Microsoft only recommends upgrading to the latest available build before deployment.

## After deployment

Learn notes that users can direct their known folders in the sync app settings under the **Backup** tab and **Manage backup**. The policy that prevents users from moving known folders disables the Manage backup command (it has no effect if the prompt or silent policy is enabled), and the policy that prevents users from turning off Known Folder Move disables the **Stop protecting** button. If a folder protection problem blocks a move, Microsoft points to its Fix problems with folder protection article.

## Related

- [OneDrive](https://www.m365.fm/entity/onedrive/)
- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Microsoft 365](https://www.m365.fm/entity/microsoft-365/)

## Sources

- [Microsoft Learn: Redirect and move Windows known folders to OneDrive](https://learn.microsoft.com/en-us/sharepoint/redirect-known-folders)
- [Microsoft Learn: Use OneDrive policies to control sync settings](https://learn.microsoft.com/en-us/sharepoint/use-group-policy)
- [Microsoft Learn: Configure settings with Intune](https://learn.microsoft.com/en-us/sharepoint/configure-sync-intune)
