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
  - "The policy Manage user setting for new Outlook automatic migration enforces or blocks automatic migration, or leaves it to the user. It does not apply to Admin-Controlled Migration."
  - "Mail and Calendar support ended on December 31, 2024. The page notes that users are switched automatically and describes how to block that."
faq:
  - q: "How do I hide the Try the new Outlook toggle?"
    a: "Use Cloud Policy in the Microsoft 365 Apps admin center, under Customization > Policy Management, with the policy Hide the Try the new Outlook toggle in Outlook. A registry value, HideNewOutlookToggle, is also documented."
  - q: "Can I block new Outlook on Windows 11?"
    a: "Learn says on Windows 11 builds later than 23H2 it is preinstalled and cannot be blocked. You can remove the provisioned package with Remove-AppxProvisionedPackage."
  - q: "How do I block it on Windows 10?"
    a: "Create a REG_SZ value BlockedOobeUpdaters with the data [\"MS_Outlook\"] under HKLM\\SOFTWARE\\Microsoft\\WindowsUpdate\\Orchestrator\\UScheduler_Oobe."
  - q: "What controls automatic migration?"
    a: "The policy Manage user setting for new Outlook automatic migration, with the registry value NewOutlookMigrationUserSetting. Not set means users can manage the setting themselves. 1 enforces automatic migration and 0 blocks it, and in both cases users cannot change the setting."
  - q: "Can Exchange Online block the new Outlook?"
    a: "Learn says a mailbox policy in Exchange Online can block work or school mailboxes from using the new Outlook. Conditional Access also applies."
---

New Outlook for Windows is rolling out next to classic Outlook. Admins have several controls: the toggle in classic Outlook, install blocks on Windows, a migration policy and Exchange Online policy. This guide follows the Microsoft Learn page Control Installing and Using New Outlook.

## Hide the toggle in classic Outlook

- **Cloud Policy.** In the Microsoft 365 Apps admin center go to **Customization** > **Policy Management**, select **Create**, and choose the policy **Hide the Try the new Outlook toggle in Outlook**.
- **Registry.** Set `HideNewOutlookToggle` under `HKCU\Software\Microsoft\Office\16.0\Outlook\Options\General`. The page's description of the 0 and 1 values is ambiguous, so check the page before you set a value.

## Windows 11

On Windows 11 builds later than 23H2, new Outlook is preinstalled and cannot be blocked. To remove it, the page gives:

```powershell
Remove-AppxProvisionedPackage -AllUsers -Online -PackageName (Get-AppxPackage Microsoft.OutlookForWindows).PackageFullName
```

Learn says that after the package is removed, Windows updates will not reinstall new Outlook. The page also says to remove the orchestrator registry value `HKLM\SOFTWARE\Microsoft\WindowsUpdate\Orchestrator\UScheduler_Oobe\OutlookUpdate`. That is not necessary on devices that installed the March 2024 Non-Security Preview release (or a later cumulative update) for Windows 11, version 23H2, because the orchestrator then respects the deprovisioning cmdlet.

## Windows 10

New Outlook was installed through the optional release of January 28, 2025 and the security update of February 11, 2025. To block it, create a REG_SZ value named `BlockedOobeUpdaters` with the data `["MS_Outlook"]` under `HKLM\SOFTWARE\Microsoft\WindowsUpdate\Orchestrator\UScheduler_Oobe`.

## Mail and Calendar

Support for Mail and Calendar ended on December 31, 2024. Users are switched to new Outlook automatically. To block this, remove the `microsoft.windowscommunicationsapps` package.

## Automatic migration policy

Admins can use the policy **Manage user setting for new Outlook automatic migration** to prevent users from being switched to new Outlook. The registry value is `NewOutlookMigrationUserSetting` under `HKCU\Software\Policies\Microsoft\office\16.0\outlook\preferences`:

- Not set (default): the setting is not controlled and users can manage it themselves. The page says the setting is enabled by default.
- 1 (Enable): automatic migration to new Outlook is allowed and users cannot change the setting.
- 0 (Disable): automatic migration is blocked and users cannot change the setting.

You can set it through Group Policy ADMX, Cloud Policy or Intune ADMX. It does not apply to the Admin-Controlled Migration policy, which is documented on a separate page.

## Exchange Online and Conditional Access

An Exchange mailbox policy can block work or school mailboxes from being added to the new Outlook, regardless of how users got the app. Learn calls this the final block. Mailbox policies apply to the work or school account, not to the device or app, so to stop users from using the app with other accounts the page recommends blocking access to the app itself. Conditional Access policies also apply, and the page says OWA mailbox policies with the ConditionalAccessPolicy parameter can add more granular control, for example for noncompliant devices.

## Microsoft Store and user installs

The new Outlook is also available in the Microsoft Store. To stop users from downloading it there, the page points to configuring access to the Microsoft Store app. For user installations, for example when users install through the toggle, the page says to run `Remove-AppxPackage -AllUsers -Package (Get-AppxPackage Microsoft.OutlookForWindows).PackageFullName`. It also notes that users may still see a pinned Start menu icon that installs the app when selected.

## GCC High and DoD (preview)

Set `NewOutlookForWindowsCloudType` under `HKCU\Software\Microsoft\office\16.0\outlook` to 3 for GCC High or 4 for DoD. Without it, new Outlook defaults to the Worldwide endpoint and will not find your accounts. The page prefers Cloud Policy, with Group Policy as an alternative. New Outlook stays off by default in these clouds and does not automatically switch users from classic Outlook. The page expected the toggle rollout in August 2026, which has passed. Check the page for the current status.

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

## Typical mistakes (my advice)

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

This section is my explanation, not text from the page. The controls act at different points. The toggle setting only changes what users see inside classic Outlook. The Windows install blocks act on the operating system and decide whether the app is installed at all. The migration policy decides whether users can manage the automatic move for themselves. The Exchange Online mailbox policy acts on the service side and decides whether work or school mailboxes may connect from the new Outlook. Conditional Access applies on top of that. Because the layers are separate, a change in one layer does not replace the others.

## Where to set the policies

The page says the automatic migration policy can be set through Group Policy with ADMX, through Cloud Policy, or through Intune with ADMX. The toggle policy is shown in the Microsoft 365 Apps admin center. My advice: pick the tool you already use to manage Office settings, so that the values do not conflict.

## Related

- [Outlook](https://www.m365.fm/entity/outlook/)
- [Microsoft 365 Apps](https://www.m365.fm/entity/microsoft-365-apps/)
- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)

## Sources

- [Control Installing and Using New Outlook (Microsoft Learn)](https://learn.microsoft.com/microsoft-365-apps/outlook/get-started/control-install)
