---
title: "Microsoft 365 Apps Activation Errors: Too Many Devices and License Verification"
summary: "Fix Microsoft 365 Apps activation problems: the five-device limit and how users or admins remove devices, and shared computer activation checks and messages such as unlicensed product, cannot verify license and expired shared license."
status: review
publish: false
author: mirko-p
date: 2027-01-09
topics: [microsoft-365-apps]
keypoints:
  - "Learn says each license allows installs on up to 5 devices. Remove unused devices at myaccount.microsoft.com/device-list, or as an admin under Microsoft Entra ID > Users > Devices."
  - "The activation limits page is archived content, last updated 2025-02-11. Other options are only linked from it."
  - "For shared computer activation, check File > Account > About, the SharedComputerLicensing registry value and the licensing text files."
  - "The shared computer page lists messages for unlicensed product, unverified license and expiring shared license, each with a short action."
  - "The Learn overview page on licensing and activation was not read. The exact phrase subscription cannot be verified is not on the pages read."
faq:
  - q: "Why do I get an activation limit error?"
    a: "Microsoft Learn says you can install on up to 5 devices per license. If the limit is reached, remove devices you no longer use, then try again."
  - q: "How does a user remove a device?"
    a: "Go to https://myaccount.microsoft.com/device-list and remove the devices that are no longer used."
  - q: "How does an admin remove a device?"
    a: "Go to admin.microsoft.com, then Microsoft Entra ID > Users, select the user, open Devices, remove the unused devices and retry activation."
  - q: "How do I check shared computer activation?"
    a: "Open File > Account > About and look for Shared Computer Activation. The registry value SharedComputerLicensing under HKLM\\SOFTWARE\\Microsoft\\Office\\ClickToRun\\Configuration should be 1."
  - q: "What does Sorry, we cannot verify the license mean?"
    a: "The shared computer page says to sign in to obtain a new token. It lists the message among several shared computer activation messages."
---

Two groups of problems show up often when Microsoft 365 Apps will not activate: a user has reached the device limit, or a shared computer cannot get or verify its license. This guide follows two Microsoft Learn pages: the activation limits page and the troubleshooting page for shared computer activation. The Learn overview page on licensing and activation, which the activation limits page links to, was not read, so this guide does not cover it.

## Too many devices

The activation limits page is archived content. Its last update is 2025-02-11, and it applies to Microsoft 365. Treat it as a reference that may have changed.

Learn says you can install on up to 5 devices per license. If you reach the limit, remove devices you no longer use and retry activation.

- **User:** go to `https://myaccount.microsoft.com/device-list` and remove unused devices.
- **Admin:** go to `admin.microsoft.com`, then **Microsoft Entra ID** > **Users**, select the user, open **Devices**, remove unused devices, and retry.

Other options, such as resetting the activation state and shared computer activation, are only linked on that page.

## Shared computer activation checks

Shared computer activation needs a plan that supports it. To check on a device:

1. Open **File** > **Account** > **About**. It should show Shared Computer Activation.
2. Check the registry value `SharedComputerLicensing` under `HKLM\SOFTWARE\Microsoft\Office\ClickToRun\Configuration`. It should be 1.
3. Look at the text files in `%localappdata%\Microsoft\Office\16.0\Licensing`.

## Messages and actions

| Message | Action on the page |
| --- | --- |
| The products we found in your account cannot be used to activate Office in shared computer scenarios | Check that the account has a plan that supports it |
| UNLICENSED PRODUCT Most features are turned off because a shared computer license isn't available | Check the license assignment, sign in and check the internet connection |
| Sorry, we cannot verify the license currently installed for this product | Sign in to obtain a new token |
| PRODUCT NOTICE Your shared computer license expires on a date | Select Renew |
| Sorry, this Office 365 account has recently been used to activate too many computers | The page gives no fix |

## What the pages do not say

- The exact phrase subscription cannot be verified. It is not on the pages read.
- Timings such as how often a license is renewed.
- The limit for the given period in the too many computers message.
- A full list of plans that support shared computer activation.

## A troubleshooting order (my advice)

This order is my own advice, built on the pages.

1. Read the exact message.
2. For a device limit message, remove unused devices and retry.
3. For shared computers, check About and the registry value.
4. Confirm the license assignment for the user.
5. Sign in again to obtain a new token.

## Typical mistakes (my advice)

- Reinstalling Office when the problem is the device limit.
- Treating an archived page as current without a check.
- Forgetting the registry value on shared computers.
- Looking for a fix for the too many computers message where the page gives none.

## Quick reference

| Question | Answer on the pages |
| --- | --- |
| Device limit | Up to 5 devices per license |
| User removal page | myaccount.microsoft.com/device-list |
| Admin removal path | Microsoft Entra ID > Users > the user > Devices |
| Shared computer check | File > Account > About |
| Registry value | SharedComputerLicensing = 1 under ClickToRun\Configuration |
| Licensing files | %localappdata%\Microsoft\Office\16.0\Licensing |

## Why the source situation matters

The Learn overview page on licensing and activation, which the activation limits page links to, was not read. The activation limits page is archived and may not reflect the current product. The shared computer page is a troubleshooting page for one scenario. Together they cover the device limit and shared computer messages, but not every activation error. If your error text is not in the table above, search for the exact message on Microsoft Learn before you act.

## Reading the shared computer files

The page tells you where the licensing text files are stored. It does not describe their contents in detail. Learn says not to change these files. My advice: use them as evidence when you work with support.

## Admin and user paths (my advice)

Users can fix a device limit themselves on the device list page. Admins reach the same devices from the Entra user page. The result is the same: unused devices are removed, then activation is retried. Choose the user path when the person can sign in, and the admin path when you manage the account for them.

## Related

- [Microsoft 365 Apps](https://www.m365.fm/entity/microsoft-365-apps/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Outlook](https://www.m365.fm/entity/outlook/)

## Sources

- [Microsoft 365 Apps activation limits (Microsoft Learn)](https://learn.microsoft.com/previous-versions/troubleshoot/microsoft-365/microsoft-365-apps/activation/activation-limits)
- [Troubleshoot issues with shared computer activation for Microsoft 365 Apps (Microsoft Learn)](https://learn.microsoft.com/microsoft-365-apps/licensing-activation/troubleshoot-shared-computer-activation)
