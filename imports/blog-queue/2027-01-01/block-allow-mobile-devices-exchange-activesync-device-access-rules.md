---
title: "Block or Allow Mobile Devices With Exchange ActiveSync Device Access Rules"
summary: "How to block or allow mobile devices in Exchange Online with device access rules and the default access level, using Microsoft documentation: admin center paths, New-ActiveSyncDeviceAccessRule characteristics, Set-ActiveSyncOrganizationSettings and a quarantine caveat."
status: review
publish: false
author: mirko-p
date: 2027-01-01
topics: [exchange-online]
keypoints:
  - "The Learn page on mobile device mailbox policies could not be read, so this guide uses a Microsoft support article and the Exchange PowerShell references."
  - "Device access rules are in the Exchange admin center under mobile, mobile device access, Device Access Rules. The access level can be Allow, Block or Quarantine."
  - "New-ActiveSyncDeviceAccessRule needs a Characteristic (DeviceModel, DeviceType, DeviceOS, UserAgent or XMSWLHeader), a QueryString and an AccessLevel. Wildcards and partial matches are not allowed."
  - "Set-ActiveSyncOrganizationSettings sets DefaultAccessLevel to Allow, Block or Quarantine. Changing from Allow to Block or Quarantine affects existing devices not governed by rules or lists."
  - "After removing a device, the allowed and blocked device ID lists on the mailbox are not cleared, so the device may be allowed instead of quarantined."
faq:
  - q: "Where do I create a device access rule?"
    a: "The Microsoft support article names the Exchange admin center, then mobile, mobile device access, Device Access Rules, for rules by device family and model. You can also use New-ActiveSyncDeviceAccessRule in PowerShell."
  - q: "Which access levels exist?"
    a: "According to the Microsoft Learn cmdlet reference, Allow, Block and Quarantine."
  - q: "Can I use wildcards in a rule?"
    a: "According to the Microsoft Learn cmdlet reference, wildcards or partial matches are not allowed in the QueryString parameter."
  - q: "How do I find the values for a rule?"
    a: "The cmdlet reference suggests the Get-MobileDevice cmdlet, for example Get-MobileDevice piped to Format-List DeviceOS, DeviceModel, DeviceType."
  - q: "How do I set the default for unknown devices?"
    a: "According to the Microsoft Learn reference, use Set-ActiveSyncOrganizationSettings with the DefaultAccessLevel parameter set to Allow, Block or Quarantine."
---

To block or allow mobile devices in Exchange Online, you combine a default access level for all devices with device access rules for specific devices. Rules match by a device characteristic and set the access level to Allow, Block or Quarantine. The Learn page on mobile device mailbox policies could not be read when this guide was written. It uses a Microsoft support article on Exchange ActiveSync policies and the Learn PowerShell references for the two cmdlets. A separate guide covers why a device is quarantined and how to release it.

## Where the settings are

The support article lists these locations in the Exchange admin center:

- **Block, allow, wipe or delete a device:** recipients, mailboxes, select the user, then **View details** under **Mobile Devices**.
- **Device access rules by device family and model:** mobile, mobile device access, **Device Access Rules**.
- **Access settings with Allow, Block or Quarantine:** mobile, mobile device access, **Exchange ActiveSync Access Settings**, edit.
- **Mailbox policies for password and security settings:** mobile, mobile device mailbox policies.

The paths follow the classic Exchange admin center layout (my observation, not a statement on the page), so the labels in your tenant may differ. It does not describe the default access level, how quarantine works, personal exemptions, or the order in which rules and lists are evaluated. Its mention of device rules covers device families and models only.

## Create a rule with PowerShell

The `New-ActiveSyncDeviceAccessRule` reference says you can create multiple rules that define groups of devices: allowed, blocked and quarantined. Three parameters are required:

- **AccessLevel:** `Allow`, `Block` or `Quarantine`.
- **Characteristic:** `DeviceModel`, `DeviceType`, `DeviceOS`, `UserAgent` or `XMSWLHeader`.
- **QueryString:** the device identifier used by the rule. It is used with the characteristic. Wildcards and partial matches are not allowed.

The page gives two examples:

```powershell
New-ActiveSyncDeviceAccessRule -Characteristic DeviceOS -QueryString "iOS 6.1 10B145" -AccessLevel Block
New-ActiveSyncDeviceAccessRule -Characteristic UserAgent -QueryString NokiaE521/2.00()MailforExchange -AccessLevel Allow
```

The first example is described as blocking iPhones running iOS 6.1.1, but the query string says 6.1 10B145, so the text is inconsistent. To find the exact values, the page suggests this command:

```powershell
Get-MobileDevice | Format-List DeviceOS,DeviceModel,DeviceType
```

Because partial matches are not allowed, copy the value exactly as the device reports it. The page does not say how overlapping rules are evaluated or whether a rule takes effect immediately.

## Set the default access level

The `Set-ActiveSyncOrganizationSettings` reference documents `DefaultAccessLevel` with the values `Allow` (default), `Block` and `Quarantine`. It sets the access level for new and existing device partnerships. The page warns that changing from Allow to Block or Quarantine immediately affects all existing connected devices, unless they are governed by device access rules or individual allow or block list entries.

The page's only example is:

```powershell
Set-ActiveSyncOrganizationSettings -DefaultAccessLevel Quarantine -AdminMailRecipients will@contoso.com,roger@contoso.com
```

`AdminMailRecipients` sets the administrator addresses used for reporting. `UserMailInsert` sets a footer, up to 256 characters, in the email that users receive when their device is quarantined.

## A quarantine caveat after removing a device

The Learn troubleshooting article Mobile devices not quarantined as expected describes this case. The organization setting is **Quarantine - Let me decide to block or allow later**, and a quarantined device was allowed. The admin removes the device in the Exchange admin center or with `Remove-MobileDevice`. When the user adds the device again it is not quarantined and shows Access granted. The cause is that removing the device does not clear the `ActiveSyncAllowedDeviceIDs` and `ActiveSyncBlockedDeviceIDs` parameters on the mailbox. The workaround is to set them to null after removal. The page's example clears only the allowed list:

```powershell
Set-CASMailbox joe@contoso.com -ActiveSyncAllowedDeviceIDs $null
```

The text says both parameters should be set to null, while the example shows one, so check both lists.

## Suggestion: a safe order of changes

This section is a practical suggestion and not a Microsoft statement.

1. List current devices with `Get-MobileDevice` and note their values.
2. Create rules for the devices you want to treat differently, using exact values.
3. Test with one mailbox and one device.
4. Only then change the default access level, because it affects existing devices that no rule covers.
5. Tell users what to expect when a device is quarantined, for example with the user mail insert.

## Not covered

The pages I read do not describe the following:

- The Learn page on mobile device mailbox policies, which could not be read.
- The evaluation order of rules, lists and the default access level.
- How a quarantined device is released.
- Personal exemptions.
- Rule types beyond the characteristics in the cmdlet reference.

## Related

- [Exchange Online](https://www.m365.fm/entity/exchange-online/)

## Sources

- [Exchange ActiveSync policies for managing devices in Office 365 (Microsoft Support)](https://support.microsoft.com/topic/exchange-activesync-policies-for-managing-devices-in-office-365-b6b17f00-6997-450d-9992-22f84a18c9e5)
- [New-ActiveSyncDeviceAccessRule (Microsoft Learn)](https://learn.microsoft.com/powershell/module/exchangepowershell/new-activesyncdeviceaccessrule)
- [Set-ActiveSyncOrganizationSettings (Microsoft Learn)](https://learn.microsoft.com/powershell/module/exchangepowershell/set-activesyncorganizationsettings)
- [Mobile devices not quarantined as expected (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/exchange/mobile-devices/mobile-devices-not-quarantined-as-expected)
