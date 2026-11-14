---
title: "Troubleshoot Windows Intune Enrollment Errors Such as 0x80180014 and 0x8018000a"
summary: "Fix Windows enrollment errors in Intune: 0x80180014 (Windows MDM enrollment disabled), 8018000a (device already enrolled), 0x8007064c, MDM user scope errors and a table of other documented codes, with portal paths from Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2027-01-09
topics: [intune]
keypoints:
  - "0x80180014 means Windows MDM enrollment is disabled in the tenant. In Enrollment restrictions, set Windows (MDM) to Allow in the device type restriction."
  - "8018000a means a different user already enrolled the device or joined it to Entra ID. Remove that work account under Settings > Accounts > Work Access and enroll again."
  - "0x8007064c, The machine is already enrolled, can come from a previous enrollment, a cloned image or a leftover certificate from the previous account."
  - "Event 76 Auto MDM Enroll Failed can come from MDM user scope set to None. Set it to All or Some under Mobility (MDM and MAM)."
  - "The article contains no device limit content, and it has several inconsistencies in codes and paths that the guide notes."
faq:
  - q: "What causes 0x80180014?"
    a: "Microsoft Learn says Windows MDM enrollment is disabled in your Intune tenant. The message is Your organization does not support this version of Windows."
  - q: "How do I fix 0x80180014?"
    a: "In the Intune admin center go to Devices > Enrollment restrictions, choose a device type restriction, select Properties > Edit next to Platform settings, set Windows (MDM) to Allow and select Review + Save."
  - q: "What does 8018000a mean?"
    a: "The device is already enrolled. A different user has already enrolled it in Intune or joined it to Microsoft Entra ID. Settings > Accounts > Work Access may show that another user is already connected."
  - q: "How do I fix 8018000a?"
    a: "Sign in as the other account that enrolled or joined the device, remove the work or school account under Settings > Accounts > Work Access, sign out, sign in with your own account and enroll or join again."
  - q: "What if MDM user scope is the problem?"
    a: "Go to Microsoft Entra ID > Mobility (MDM and MAM) > Microsoft Intune. Set MDM user scope to All, or Some with groups, and set MAM user scope to None."
---

Two codes cover many failed Windows enrollments: 0x80180014, where the tenant does not allow Windows MDM enrollment, and 8018000a, where the device is already enrolled by another account. This guide follows the Microsoft Learn troubleshooting article for Windows enrollment errors in Intune, last updated 2026-03-30.

## Error 0x80180014

- **Message:** There was a problem. Your organization does not support this version of Windows. (0x80180014)
- **Cause:** Windows MDM enrollment is disabled in your Intune tenant.
- **Fix for stand-alone Intune:**
  1. In the Intune admin center go to **Devices** > **Enrollment restrictions** and choose a device type restriction.
  2. Select **Properties**, then **Edit** next to **Platform settings**, and set **Windows (MDM)** to **Allow**.
  3. Select **Review + Save**.

The page does not say which restriction to choose beyond a device type restriction.

## Error 8018000a

- **Message:** Something went wrong. The device is already enrolled. You can contact your system administrator with the error code 8018000a.
- **Cause:** a different user has already enrolled the device in Intune or joined it to Microsoft Entra ID. To check, look under **Settings** > **Accounts** > **Work Access** for the message that another user on the system is already connected to a work or school account.
- **Fix:**
  1. Sign out and sign in as the other account that enrolled or joined the device.
  2. Under **Settings** > **Accounts** > **Work Access**, remove the work or school account.
  3. Sign out and sign in with your own account.
  4. Enroll in Intune or join Microsoft Entra ID again.

## Related error hr 0x8007064c

The message is that the machine is already enrolled, and it appears in the enrollment log. Causes: the computer was enrolled before, it has a cloned image of an enrolled computer, or a certificate from the previous account remains. The fix is to remove the Intune certificate issued by Sc_Online_Issuing from the Local Computer Personal store, delete the `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\OnlineManagement` key and subkeys if present, and enroll again. If that fails, the page describes deleting an Installer Products key. It warns to back up the registry first. The page writes one registry path without the HKEY_ prefix, so confirm the full path before deleting anything.

## MDM user scope

Event 76 in Task Scheduler under **Microsoft** > **Windows** > **EnterpriseMgmt** can read Auto MDM Enroll: Failed with Win32 error 0x8018002b. The cause is MDM user scope set to None, or a UPN with an unverified or non-routable domain such as `.local`. The fix:

1. Go to **Microsoft Entra ID** > **Mobility (MDM and MAM)** > **Microsoft Intune**.
2. Set **MDM user scope** to **All**, or to **Some** and select groups.
3. Set **MAM user scope** to **None**.

The page also prints the code as 0x80180002b in one place. Treat the value 0x8018002b as the likely one.

## Other documented errors

| Error | Cause | Fix |
| --- | --- | --- |
| 0x80cf4017 | Client software is out of date | Admin > Client Software Download |
| 80180026 | Hybrid join with MDM auto-enrollment and the Intune PC agent installed | Set MDM user scope to None, or uninstall the Intune PC agent |
| Account not allowed on this phone | User lacks a valid Intune license | Assign an Intune license |
| Autopilot profile error | Device name template does not meet requirements | Use `%SERIAL%` in uppercase, up to 15 characters, not all numbers, no spaces |
| 80070774 | Assign user used in hybrid Autopilot, or the Autopilot object's Entra device was deleted | Unassign the user, or delete and reimport the hash |
| 0x80180022 | Windows Home edition | Upgrade to Pro or higher |
| 0x801C03EA | TPM 2.0 present but not upgraded, or two groups with different Autopilot profiles | Upgrade TPM, remove the duplicate profile assignment |
| 0x800705b4 | No physical TPM 2.0, or unsupported Windows version | Meet TPM 2.0 and build requirements |

## What the page does not cover

- Device limits. The article has no device limit content.
- A consistent code format. Some headings use 80070774 and the body uses 0x80070774.
- Duplicate entries. The two 0x80cf4017 rows share the same cause and steps.

## A troubleshooting order

This order is practical advice built on the page.

1. Read the exact code and message on the device.
2. For 0x80180014, check the enrollment restriction for Windows (MDM).
3. For 8018000a, look under Work Access for another user's account.
4. If the user scope may be wrong, read Event 76 and check MDM user scope.
5. Check the license and the device edition.

## Typical mistakes

- Editing the registry without a backup.
- Enrolling again before removing the previous work account.
- Setting MDM user scope without checking MAM user scope.
- Using a Home edition device.

## Related

- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Windows Autopatch](https://www.m365.fm/entity/windows-autopatch/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)

## Sources

- [Troubleshoot Windows device enrollment problems in Intune (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/mem/intune/device-enrollment/troubleshoot-windows-enrollment-errors)
