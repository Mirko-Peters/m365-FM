---
title: "Mobile Device Quarantined in Exchange Online: Why It Happens and What the Docs Say About Allowing It"
summary: "Why Exchange ActiveSync devices end up quarantined in Exchange Online: default access level, device access rules, new device IDs after a reset, the stale allowed-ID problem after removing a device, and what Microsoft Learn documents about releasing a device."
status: review
publish: false
author: mirko-p
date: 2026-12-29
topics: [exchange-online]
keypoints:
  - "A device can be quarantined when the default access level is Quarantine or Block, when a device access rule says so, or when the mailbox has allowed device IDs configured."
  - "After a remote wipe, factory reset or restore, the device generates a new Device ID, so the server treats it as unknown and the ABQ rules apply again."
  - "Removing a device in the admin center or with Remove-MobileDevice does not clear ActiveSyncAllowedDeviceIDs, so the old ID can let the same device in instead of quarantining it."
  - "Changing the default access level from Allow to Block or Quarantine affects all existing devices immediately, unless rules or individual allow or block entries cover them."
  - "The pages I read do not give a release procedure. Release steps below are marked as a suggestion to verify against the cmdlet reference."
faq:
  - q: "Why was a device quarantined after a reset?"
    a: "According to Microsoft Learn, a remote wipe, factory reset or restore from backup makes the device generate a new Device ID. The server sees an unknown device, so the default access level, access rules and allowed device list apply again. Learn calls this by design."
  - q: "What does the user receive?"
    a: "A quarantine notification email that includes device model, type and ID, and states Device access state Quarantined with reason Global."
  - q: "Where is the default access level set?"
    a: "With Set-ActiveSyncOrganizationSettings and its DefaultAccessLevel parameter, whose values are Allow (default), Block and Quarantine. AdminMailRecipients sets the administrator addresses for reports."
  - q: "How do device access rules work?"
    a: "New-ActiveSyncDeviceAccessRule takes a Characteristic (DeviceModel, DeviceType, DeviceOS, UserAgent or XMSWLHeader), a QueryString with no wildcards and an AccessLevel of Allow, Block or Quarantine."
  - q: "Why is a removed device allowed to connect again?"
    a: "Learn says removing the device does not clear ActiveSyncAllowedDeviceIDs and ActiveSyncBlockedDeviceIDs. Setting the parameters to null with Set-CASMailbox makes the device quarantine when it connects, but it clears the whole list for that mailbox."
---

Quarantine in Exchange Online holds an Exchange ActiveSync device until an administrator decides to allow or block it. The Microsoft Learn page I intended to use as the main source, on mobile device mailbox policies, could not be fetched. This article therefore relies on four other Learn pages and states plainly what they do not cover.

## Why a device is quarantined

A device can be blocked or quarantined when any of the following is true:

- The organization's default access level is Block or Quarantine.
- A device access rule has an access level of Block or Quarantine.
- The mailbox has the ActiveSyncAllowedDeviceIDs setting configured.

After a remote wipe, factory reset or restore from backup, the device generates a new Device ID, because a reset removes the existing profiles. The server sees an unknown device, and the access rules for unknown devices take effect. The user typically receives a quarantine email with the device model, type and ID and the text Device access state: Quarantined, reason Global. Learn describes this as by design.

## Default access level

`Set-ActiveSyncOrganizationSettings -DefaultAccessLevel` accepts Allow (the default), Block and Quarantine. Learn says that changing it from Allow to Block or Quarantine immediately affects all existing connected devices, unless they are covered by device access rules or individual allow or block list entries. `AdminMailRecipients` sets administrator addresses for reporting, and `UserMailInsert` adds a footer of up to 256 characters to the message users get when a device is quarantined. The example on the page is `Set-ActiveSyncOrganizationSettings -DefaultAccessLevel Quarantine -AdminMailRecipients will@contoso.com,roger@contoso.com`.

## Device access rules

`New-ActiveSyncDeviceAccessRule` needs three parameters. Characteristic is one of DeviceModel, DeviceType, DeviceOS, UserAgent or XMSWLHeader. QueryString is the identifier used with it, and wildcards or partial matches are not allowed. AccessLevel is Allow, Block or Quarantine. The page suggests `Get-MobileDevice | Format-List DeviceOS,DeviceModel,DeviceType` to find valid values. It does not explain how quarantine is handled beyond naming the level.

## The stale allowed-ID problem

Learn describes a case where a quarantined device is allowed, the device is removed and the user later adds it again. Removing a device in the Exchange admin center or with `Remove-MobileDevice` does not clear ActiveSyncAllowedDeviceIDs and ActiveSyncBlockedDeviceIDs. The old ID remains in the allowed list, so the device is allowed instead of quarantined. The workaround is to set the parameters to null:

```powershell
Set-CASMailbox joe@contoso.com -ActiveSyncAllowedDeviceIDs $null
```

The page says to clear both parameters. This clears the whole list for the mailbox, not only the removed device, so review the lists first if other devices are allowed or blocked.

## Allowing a device

The pages I read do not document how to release a quarantined device. This outline is a suggestion based on the parameter names above, not a Microsoft procedure, so check the cmdlet reference before using it:

1. Read the device ID from the quarantine email, or run `Get-MobileDevice -Mailbox <user>`.
2. Add the ID to the mailbox's allowed list with `Set-CASMailbox` and the ActiveSyncAllowedDeviceIDs parameter.
3. Ask the user to sync again and check the device access state.

## Reducing surprise quarantines

This list is a suggestion. If the default is Quarantine, expect a quarantine after every reset. Decide whether device access rules for known models are acceptable, and make sure someone reads the administrator mail recipients.

## Checking what is configured

This section is a suggestion, because the pages I read do not give a diagnostic order. Start with the organization level. Run `Get-ActiveSyncOrganizationSettings` to see the default access level. Then list device access rules with `Get-ActiveSyncDeviceAccessRule`. Finally, check the mailbox with `Get-CASMailbox` for the allowed and blocked device ID lists. These cmdlets are named in the Exchange PowerShell reference, so confirm their output fields there before relying on them.

## Reading the quarantine email

Learn shows the notification a user receives. It includes the device model, the device type and the device ID, and it states Device access state: Quarantined. The device ID is the value you need if you decide to act on a single device, so ask users to forward the message instead of describing the problem.

## When the behavior is by design

Learn describes the new Device ID after a reset as expected. If your default level is Quarantine, every wiped phone will be held again. The page does not offer a setting to avoid this, so plan the approval process rather than looking for a fix.

## Not covered

The pages do not describe the Exchange admin center screens for quarantine, a release procedure, or the order in which individual lists, rules and the default level are evaluated.

## Related

- [Exchange Online](https://www.m365.fm/entity/exchange-online/)

## Sources

- [Mobile devices not quarantined as expected after removal](https://learn.microsoft.com/troubleshoot/exchange/mobile-devices/mobile-devices-not-quarantined-as-expected)
- [EAS device is blocked by the ABQ list](https://learn.microsoft.com/exchange/troubleshoot/client-connectivity/eas-device-is-blocked-by-abq-list)
- [Set-ActiveSyncOrganizationSettings](https://learn.microsoft.com/powershell/module/exchangepowershell/set-activesyncorganizationsettings)
- [New-ActiveSyncDeviceAccessRule](https://learn.microsoft.com/powershell/module/exchangepowershell/new-activesyncdeviceaccessrule)
