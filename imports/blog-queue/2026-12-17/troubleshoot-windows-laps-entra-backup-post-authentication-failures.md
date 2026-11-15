---
title: "Troubleshoot Windows LAPS Backup to Entra ID and Post-Authentication Action Failures"
summary: "Use the Windows LAPS event log, tenant setting, policy values and Intune checks to find why a password is not backed up to Microsoft Entra ID or why post-authentication actions do not run."
status: review
publish: false
author: mirko-p
date: 2026-12-17
topics: [windows-laps, intune, entra-id, hybrid-entra-join]
keypoints:
  - "Entra ID does not accept new Windows LAPS passwords until the feature is enabled at tenant level, and BackupDirectory must be set to 1."
  - "Run Invoke-LapsPolicyProcessing and look for event 10029 in Microsoft-Windows-LAPS/Operational to confirm a successful backup to Entra ID."
  - "Events 10025, 10026, 10028, 10032 and 10059 point to endpoint reachability, device identity or tenant problems."
  - "Post-authentication actions follow the flow 10041, 10042, then 10044 for success or 10043 for a failed reset."
  - "A PostAuthenticationResetDelay of 0 disables all post-authentication actions."
faq:
  - q: "Why does Windows LAPS not back up passwords to Microsoft Entra ID?"
    a: "According to Microsoft Learn, Entra ID does not allow managed devices to post new Windows LAPS passwords by default. An administrator must enable the feature at tenant level, and the device policy needs BackupDirectory set to 1. Then run Invoke-LapsPolicyProcessing and check for event ID 10029."
  - q: "Which event proves the password reached Entra ID?"
    a: "Microsoft Learn lists event ID 10029, 'LAPS successfully updated Azure Active Directory with the new password', in the Microsoft-Windows-LAPS/Operational log. Event 10020 then confirms the local account update."
  - q: "Why does a post-authentication action not run?"
    a: "Microsoft Learn says PostAuthenticationResetDelay of 0 disables all post-authentication actions. Otherwise the actions run after the grace period, which defaults to 24 hours. If the reset fails, event 10043 logs it and LAPS keeps retrying. Event 10048 appears after the retry maximum of 100 on a boot."
  - q: "Can Entra Connect sync Windows LAPS passwords?"
    a: "Not as a tested path. Microsoft Learn says Windows LAPS devices back up to Entra ID directly over https with no dependency on Entra Connect, and that the Entra and Intune portals show only passwords backed up directly by a Windows LAPS device. Syncing the on-premises AD Windows LAPS attributes with Entra Connect is not a tested scenario, and a manual sync will not make them appear in the portals."
  - q: "Does the Intune policy create the local admin account?"
    a: "No. Microsoft Learn says Windows LAPS does not create a custom account on older builds and that Intune manages an existing account. If the named account does not exist, no account is managed. Windows 11 24H2 and Windows Server 2025 and later can create the managed account through automatic account management."
---

When Windows LAPS does not back up a password to Microsoft Entra ID, start with three checks: the tenant setting, the device policy and the Windows LAPS event log. When a post-authentication action does not run, check the grace period and the event sequence 10041 to 10044. This article follows Microsoft Learn in that order.

## Step 1: Check the prerequisites

The Learn pages read for this article do not list the supported Windows versions, so check the Windows LAPS overview for that. The troubleshooting page says the Entra scenario applies to devices that are Microsoft Entra joined or hybrid joined. For policy deployment, Learn calls Microsoft Intune with the Windows LAPS CSP the preferred option for Microsoft Entra joined devices. For devices hybrid joined to on-premises Active Directory, Learn says you can deploy policy with Windows LAPS Group Policy.

By default, Microsoft Entra ID does not allow managed devices to post new Windows LAPS passwords. An administrator must enable the feature at tenant level. The Learn pages read for this article do not name the exact toggle and link to the Entra article on enabling Windows LAPS, so confirm the setting there.

## Step 2: Check the device policy

Set the policy through the Windows LAPS CSP, which is preferred with Intune, or through registry or local Group Policy. The settings that apply in Entra mode are `BackupDirectory`, `PasswordAgeDays`, `PasswordComplexity`, `PasswordLength`, `AdministratorAccountName`, `PostAuthenticationResetDelay` and `PostAuthenticationActions`. Active Directory settings are not supported in Entra mode.

Key values from the policy reference:

| Setting | Value or range | Default |
|---|---|---|
| `BackupDirectory` | 0 disabled, 1 Entra ID, 2 Active Directory | 0 |
| `PasswordAgeDays` | 1 to 365, minimum 7 for Entra ID | 30 |
| `PasswordLength` | 8 to 64 (ignored if PasswordComplexity is a passphrase option) | 14 |
| `PasswordComplexity` | 1 to 8 (4 recommended; 5 to 8 need Windows 11 24H2 or Windows Server 2025 or later) | 4 |
| `PostAuthenticationResetDelay` | 0 to 24 hours | 24 |
| `PostAuthenticationActions` | 1, 3, 5 or 11 | 3 |

If `BackupDirectory` is 0, all other settings are ignored. If the directory does not match the device join type, the Intune page says the policy applies without error but cannot back up the account. The scenario page lists seven settings as applicable in Entra mode. The policy settings page also marks PassphraseLength and the AutomaticAccountManagement settings as applicable in Entra mode, which the scenario page does not mention. Learn also says an unsupported value falls back to the default, so a newer value such as a passphrase complexity on an older Windows build ends up as 4.

If `AdministratorAccountName` is empty, Windows LAPS manages the built-in administrator by its well-known RID. For a custom account, Learn says Windows LAPS does not create it on earlier builds, and Intune does not create accounts either. The scenario page recommends the Accounts CSP for creating the account. Windows 11 24H2 and Windows Server 2025 and later offer automatic account management for that case, and in that mode AdministratorAccountName is ignored.

In Intune, the policy lives under **Endpoint security** > **Account protection** > **Create Policy**, with the profile **Local admin password solution (Windows LAPS)**. Assign it to device groups. Learn advises against user groups because a user policy follows the user between devices. If a device that already has a working policy gets conflicting policies, it keeps the values it last applied and both policies report a conflict. If a device without a LAPS policy gets two conflicting policies at once, no settings are sent and both report conflicts. Learn's remedy is to remove assignments or make the policies set the same values.

## Step 3: Force processing and read the log

Windows LAPS processes policy hourly. To apply it now, run `Invoke-LapsPolicyProcessing` in an elevated PowerShell prompt. Then open **Event Viewer** > **Applications and Services Logs** > **Microsoft** > **Windows** > **LAPS** > **Operational**.

Read the log as a cycle:

1. Event 10003 starts policy processing. 10004 means success. 10005 means failure and includes an error code.
2. Event 10022 shows the policy in effect for Entra ID, with the policy source and backup directory.
3. Event 10029 confirms the password update in Entra ID. Event 10020 confirms the local account update.

## Step 4: Match the failing event

Learn's troubleshooting page maps events to Entra scenarios:

| Event | Message in short | What to check |
|---|---|---|
| 10013 | Local administrator account not found | The account exists, with no leading or trailing spaces in the name |
| 10019 | Failed to update local account password | Resource problems, or a third-party tool managing the same account |
| 10025 | Azure discovery failed | Access to `https://enterpriseregistration.windows.net`, and the system-context proxy with `netsh winhttp show proxy` |
| 10026 and 10032 | Unable to authenticate with the device identity | Tenant setting, device not deleted or disabled, `dsregcmd /status` sections Device status, SSO data and Diagnostic data |
| 10027 | Unable to create an acceptable new password | `net accounts` and the Intune, local GPO or third-party policy that conflicts with length and complexity |
| 10028 | Failed to update Entra ID with the new password | Same checks as 10026 |
| 10059 | Azure returned a failure code | Endpoint access, tenant setting, device state, `dsregcmd /status` and the Entra error codes |

For 10025, Learn says that opening the endpoint in a browser should return "Unsupported method or endpoint", which confirms it is reachable. Learn lists event 10017 only for the Active Directory scenario and calls it a status event at the end of a processing cycle with no root cause of its own, so look at the events before it. In the Entra table above, 10028 is the matching failure to update the directory (my reading).

If the portals show nothing, remember that the Intune policy data only appears after the device checks in and processes its policy.

## Step 5: Troubleshoot post-authentication actions

After someone signs in with the managed account, Windows LAPS waits for the grace period and then acts. `PostAuthenticationResetDelay` runs from 0 to 24 hours, and 0 disables all post-authentication actions.

| Value | Action |
|---|---|
| 1 | Reset password |
| 3 | Reset password and sign out, with a 2 minute warning |
| 5 | Reset password and reboot after a 1 minute delay |
| 11 | Like 3, plus end remaining processes; needs Windows 11 24H2 or Windows Server 2025 or later |

Learn warns that abrupt session termination or a restart can cause data loss.

The event flow is 10041 for a detected sign-in, 10042 when the grace period expires, then 10044 for success or 10043 for a failed reset. LAPS keeps retrying after 10043. Event 10048 means the retry maximum of 100 on a boot was exceeded and the timer is no longer scheduled, so check connectivity to the directory. Event 10049 means a reboot action failed, so check for applications that block shutdown and for the privileges needed to shut down. Event 10031 means LAPS blocked an outside change to the managed account password.

## Step 6: Test rotation and retrieval

Use `Reset-LapsPassword` to rotate on the device. Learn says to avoid frequent use because calls can be throttled, and that Entra ID does not support expiring a stored password by changing its expiration timestamp. In Intune, go to **Devices** > **All devices**, select the device, open the ellipsis menu in the menu bar and choose **Rotate local admin password**. Your account needs the Intune permissions Managed devices Read, Organization Read and Remote tasks Rotate Local Admin Password. The device must be online for Entra joined devices, and rotation works on one device at a time. It fails on a device that has not backed up its account yet.

Reading passwords needs the permissions `microsoft.directory/deviceLocalCredentials/password/read` or `.../standard/read`, which Learn says you can grant with the built-in Cloud Device Administrator role or a custom Entra role. For `Get-LapsAADPassword`, the app needs `Device.Read.All` plus `DeviceLocalCredential.ReadBasic.All` (metadata such as backup time and expected expiration) or `DeviceLocalCredential.Read.All` (everything, including the clear-text password).

## Typical mistakes

- Setting `BackupDirectory` to 2 on an Entra joined device.
- Assigning the policy to users instead of devices.
- Expecting Entra Connect to sync LAPS passwords.
- Setting `PostAuthenticationResetDelay` to 0 and expecting a reset.
- Naming a custom account that does not exist.

## What the sources do not say

The pages read do not list the exact tenant toggle name, and the event log page does not document a dedicated configuration error event for Entra mode. The Intune page does not describe the post-authentication settings; the policy settings page does.

## Related

- [Windows LAPS](https://www.m365.fm/entity/windows-laps/)
- [Intune](https://www.m365.fm/entity/intune/)
- [Entra ID](https://www.m365.fm/entity/entra-id/)
- [Hybrid Entra join](https://www.m365.fm/entity/hybrid-entra-join/)

## Sources

- [Get started with Windows LAPS and Microsoft Entra ID](https://learn.microsoft.com/en-us/windows-server/identity/laps/laps-scenarios-azure-active-directory)
- [Configure Policy Settings for Windows LAPS](https://learn.microsoft.com/en-us/windows-server/identity/laps/laps-management-policy-settings)
- [Use Windows LAPS event logs](https://learn.microsoft.com/en-us/windows-server/identity/laps/laps-management-event-log)
- [Windows LAPS troubleshooting guidance](https://learn.microsoft.com/en-us/troubleshoot/windows-server/windows-security/windows-laps-troubleshooting-guidance)
- [Deploy Intune policies to manage Windows LAPS](https://learn.microsoft.com/en-us/intune/device-security/laps/deploy-policy)
