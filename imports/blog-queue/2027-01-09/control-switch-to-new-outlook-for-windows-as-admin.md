---
title: "How to Control the Switch to New Outlook for Windows as an Admin"
summary: "Admin controls for new Outlook for Windows: hide the Try the new Outlook toggle, handle Windows 11 and Windows 10 installs, Mail and Calendar end of support, the automatic migration policy, Exchange Online mailbox policy and GCC High or DoD settings."
status: review
publish: false
author: mirko-p
date: 2027-01-09
topics: [outlook, microsoft-365-apps]
keypoints:
  - "Hide the Try the new Outlook toggle with Cloud Policy in the Microsoft 365 Apps admin center or with the HideNewOutlookToggle registry value."
  - "On Windows 11 builds later than 23H2, new Outlook is preinstalled and cannot be blocked. You can remove it with Remove-AppxProvisionedPackage."
  - "On Windows 10, block the install with a BlockedOobeUpdaters registry value set to MS_Outlook under the Orchestrator UScheduler_Oobe key."
  - "The policy Manage user setting for new Outlook automatic migration controls whether users can manage automatic migration. It does not apply to Admin-Controlled Migration."
  - "Mail and Calendar support ended on December 31, 2024. The page notes that users are switched automatically and describes how to block that."
faq:
  - q: "How do I hide the Try the new Outlook toggle?"
    a: "Use Cloud Policy in the Microsoft 365 Apps admin center, under Customization > Policy Management, with the policy Hide the Try the new Outlook toggle in Outlook. A registry value, HideNewOutlookToggle, is also documented."
  - q: "Can I block new Outlook on Windows 11?"
    a: "Learn says on Windows 11 builds later than 23H2 it is preinstalled and cannot be blocked. You can remove the provisioned package with Remove-AppxProvisionedPackage."
  - q: "How do I block it on Windows 10?"
    a: "Create a REG_SZ value BlockedOobeUpdaters with the data [MS_Outlook] under HKLM\\SOFTWARE\\Microsoft\\WindowsUpdate\\Orchestrator\\UScheduler_Oobe."
  - q: "What controls automatic migration?"
    a: "The policy Manage user setting for new Outlook automatic migration, with the registry value NewOutlookMigrationUserSetting. Not set means the user can manage it, 1 enables it and 0 disables it."
  - q: "Can Exchange Online block the new Outlook?"
    a: "Learn says a mailbox policy in Exchange Online can block work or school mailboxes from using the new Outlook. Conditional Access also applies."
---

New Outlook for Windows is rolling out next to classic Outlook. Admins have several controls: the toggle in classic Outlook, install blocks on Windows, a migration policy and Exchange Online policy. This guide follows the Microsoft Learn page on controlling the install of new Outlook, last updated 2026-07-15.

## Hide the toggle in classic Outlook

- **Cloud Policy.** In the Microsoft 365 Apps admin center go to **Customization** > **Policy Management**, select **Create**, and choose the policy **Hide the Try the new Outlook toggle in Outlook**.
- **Registry.** Set `HideNewOutlookToggle` under `HKCU\Software\Microsoft\Office\16.0\Outlook\Options\General`. The page's description of the 0 and 1 values is ambiguous, so check the page before you set a value.

## Windows 11

On Windows 11 builds later than 23H2, new Outlook is preinstalled and cannot be blocked. To remove it, the page gives:

```powershell
Remove-AppxProvisionedPackage -AllUsers -Online -PackageName (Get-AppxPackage Microsoft.OutlookForWindows).PackageFullName
```

## Windows 10

New Outlook was installed through the optional release of January 28, 2025 and the security update of February 11, 2025. To block it, create a REG_SZ value named `BlockedOobeUpdaters` with the data `["MS_Outlook"]` under `HKLM\SOFTWARE\Microsoft\WindowsUpdate\Orchestrator\UScheduler_Oobe`.

## Mail and Calendar

Support for Mail and Calendar ended on December 31, 2024. Users are switched to new Outlook automatically. To block this, remove the `microsoft.windowscommunicationsapps` package.

## Automatic migration policy

The policy **Manage user setting for new Outlook automatic migration** controls whether users can manage automatic migration. The registry value is `NewOutlookMigrationUserSetting` under `HKCU\Software\Policies\Microsoft\office\16.0\outlook\preferences`:

- Not set: the user can manage the setting.
- 1: enabled.
- 0: disabled.

You can set it through Group Policy ADMX, Cloud Policy or Intune ADMX. It does not apply to the Admin-Controlled Migration policy, which is documented on a separate page.

## Exchange Online and Conditional Access

A mailbox policy in Exchange Online can block work or school mailboxes from using the new Outlook. Conditional Access policies also apply to it.

## GCC High and DoD (preview)

Set `NewOutlookForWindowsCloudType` to 3 for GCC High or 4 for DoD. The page expected the toggle rollout in August 2026, which has passed. Check the page for the current status.

## What the page does not say

- A `UseNewOutlook` setting. The page has no such value.
- A clear meaning for the 0 and 1 values of HideNewOutlookToggle.
- Details of the Admin-Controlled Migration policy. See its own page.
- A way to block the Windows 11 preinstall, because the page says it cannot be blocked.

## A control outline

This outline is practical advice built on the page.

1. Decide whether users may try the new Outlook at all.
2. Hide the toggle with Cloud Policy if not.
3. Set the migration policy to match the decision.
4. Check the Windows 10 and Windows 11 situation separately.
5. Review the Exchange Online mailbox policy for work or school mailboxes.

## Typical mistakes

- Expecting a registry block to work on Windows 11.
- Editing the registry value without checking the 0 and 1 semantics.
- Mixing up the automatic migration policy and Admin-Controlled Migration.
- Forgetting Mail and Calendar users, who are switched automatically.

## Quick reference

| Scenario | Control on the page |
| --- | --- |
| Hide the toggle in classic Outlook | Cloud Policy or HideNewOutlookToggle |
| Windows 11 later than 23H2 | Cannot be blocked, can be removed with Remove-AppxProvisionedPackage |
| Windows 10 | BlockedOobeUpdaters with MS_Outlook |
| Mail and Calendar users | Remove the microsoft.windowscommunicationsapps package to block the switch |
| Automatic migration | NewOutlookMigrationUserSetting (not set, 1 or 0) |
| Work or school mailboxes | Exchange Online mailbox policy and Conditional Access |
| GCC High or DoD | NewOutlookForWindowsCloudType 3 or 4 |

## How the controls differ

The controls act at different points. The toggle setting only changes what users see inside classic Outlook. The Windows install blocks act on the operating system and decide whether the app is installed at all. The migration policy decides whether users can manage the automatic move for themselves. The Exchange Online mailbox policy acts on the service side and decides whether work or school mailboxes may connect from the new Outlook. Conditional Access applies on top of that. Because the layers are separate, a change in one layer does not replace the others.

## Where to set the policies

The page says the automatic migration policy can be set through Group Policy with ADMX, through Cloud Policy, or through Intune with ADMX. The toggle policy is shown in the Microsoft 365 Apps admin center. Pick the tool you already use to manage Office settings, so that the values do not conflict.

## Related

- [Outlook](https://www.m365.fm/entity/outlook/)
- [Microsoft 365 Apps](https://www.m365.fm/entity/microsoft-365-apps/)
- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)

## Sources

- [Control the installation of new Outlook for Windows (Microsoft Learn)](https://learn.microsoft.com/microsoft-365-apps/outlook/get-started/control-install)
