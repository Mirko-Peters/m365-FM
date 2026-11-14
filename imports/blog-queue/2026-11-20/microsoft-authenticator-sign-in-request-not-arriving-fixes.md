---
title: "Microsoft Authenticator Problems: Sign-in Request Not Arriving, Loops and Resets"
summary: "Why a Microsoft Authenticator sign-in request does not arrive, what to check first, what number matching changes, how to read common error messages and what admins can reset, based on Microsoft Support and Learn."
status: review
publish: false
author: mirko-p
date: 2026-11-20
topics: [mfa, entra-id, microsoft-entra]
keypoints:
  - "Start with the basics Microsoft lists: switch between mobile data and Wi-Fi, update the app, check battery optimization and make sure Show notifications is on."
  - "If no request arrives, open Authenticator and pull down to refresh. Anomalous sign-ins do not generate notifications, and users must approve from inside the app."
  - "Number matching is on for all Authenticator push notifications. Users see a number and must enter it in the app, and they cannot opt out."
  - "An always-expired request points to the device clock. Set date and time from manual to automatic and restart."
  - "Admins can use Require re-register MFA in the Entra admin center to delete a user's phone, Authenticator and software OATH methods, and Revoke sessions to force reauthentication."
faq:
  - q: "Why is my Microsoft Authenticator sign-in request not arriving?"
    a: "Microsoft Support lists these checks. Switch between mobile data and Wi-Fi and confirm airplane mode is off, update the app, turn off battery optimization, confirm Show notifications is on, check Do Not Disturb or Quiet mode and see whether other apps receive notifications. If only some accounts fail, remove the affected account and add it again with notifications allowed."
  - q: "What do I do if there is no notification at all?"
    a: "Microsoft Learn says that anomalous sign-ins do not generate notifications. Open Microsoft Authenticator, pull down to refresh or tap Refresh and approve the request. On the sign-in page, Microsoft Support says that if Send notification is not offered you can choose Other ways to sign in and pick the option to approve a request in the Authenticator app."
  - q: "Why am I asked to enter a number instead of tapping Approve?"
    a: "Microsoft Learn says number matching is enabled for all Authenticator push notifications. The sign-in screen shows a number that the user must enter in the app. Users cannot opt out of it. Microsoft says users need the latest version of Authenticator, and older versions will not work for sign-in."
  - q: "Why does my approval request always show as expired?"
    a: "Microsoft Support says to set the device clock from manual to automatic, then restart the device and confirm the time."
  - q: "Will my work account move to a new phone with Cloud Backup?"
    a: "No. Microsoft Support says work or school account credentials are not backed up. Only the account name is saved, and you must sign in and register the account again on the new device. Backup and restore also work only on the same device type, so iOS to Android is not supported."
---

When a Microsoft Authenticator request does not arrive, the cause is usually on the phone: network, battery optimization, notification settings, Do Not Disturb or a wrong device clock. Start with those. If nothing arrives, open the app and refresh, because some sign-ins never generate a notification. If the account itself is broken, an admin can clear the registered methods so the user can register again.

## How approval is meant to work

Microsoft Support describes the flow. At the sign-in prompt, enter the username, select **Next**, then **Send notification**. On the phone, open Authenticator or tap the **New sign-in request** notification, then enter or tap the number shown on the sign-in screen and select **Approve**.

If **Send notification** is not offered, the page says to choose **Other ways to sign in** and pick the option to approve a request in the Authenticator app. For work or school accounts, the app may need to be unlocked first.

## Number matching explained

Microsoft Learn says number matching is enabled for all Authenticator push notifications and that users cannot opt out. In a browser, the user sees a notification with the number request and taps it to enter the number. In Microsoft mobile apps such as Outlook or Teams, they can tap the notification and select **Approve** or **Deny**. Wearables do not help here. Learn says wearable users need their phone to approve.

Users still see Approve and Deny in a few cases that Learn lists. These include unpatched AD FS servers and NPS extension versions earlier than 1.2.2216.1, where users without a registered TOTP method keep seeing Approve and Deny. A user whose default method is not Authenticator push keeps that default, but number matching applies whenever Authenticator push is prompted. The page also says users on older Authenticator versions cannot authenticate and must upgrade.

## No notification: the check order

Work through this list in order. It follows Microsoft Support's general tips and notification section.

1. **Network.** Switch between mobile data and Wi-Fi. Confirm Airplane mode is off. Disconnect any VPN to see if the problem persists.
2. **App version.** Update the app. Microsoft does not support versions older than 12 months. In **Settings**, confirm **App updates** is on.
3. **Battery.** In **Settings**, select **Turn off battery optimization**.
4. **Notifications.** In **Settings** > **Notification Settings**, confirm **Show notifications** is on.
5. **Phone modes.** Check Do Not Disturb or Quiet mode.
6. **Other apps.** Test whether other apps can send notifications.
7. **One account only.** Remove the affected account and add it again with notifications allowed.
8. **Date and time.** Keep the device, Microsoft Defender and Intune Company Portal updated and make sure the date and time are correct. If requests always show as expired, set the clock to automatic and restart.
9. **Refresh in the app.** Open Authenticator, pull down to refresh or tap **Refresh** and approve there.

Microsoft Learn notes that on Android in China, the Notification through mobile app method does not work because Google Play services are blocked there, so alternative methods should be offered. iOS notifications do work.

## Error messages

| Message | What Microsoft Support says |
|---|---|
| Enable push notifications to receive alerts | Enable push notifications in device settings, confirm connectivity, remove the account and retry. If it still fails, contact Support or your IT admin. |
| We could not complete the sign-in at this time | Enable push notifications, confirm connectivity, remove the account and retry. |
| Google Play services are currently unavailable | On Android, require a PIN or biometric lock, enable hardware encryption, check the work profile lock, confirm device registration and scan for malware. If it still fails, contact Support or your IT admin. |
| Something went wrong [4s8qz] | Wait and retry, open the app, update Authenticator and, on work devices, Company Portal, and restart. If maintenance was underway, retry after a few minutes. |
| Your device is jailbroken or rooted | Microsoft says that starting February 2026, work or school Entra credentials stop working on jailbroken or rooted devices. |
| Sign-in denied | Authenticator denies sign-ins when GPS-reported locations do not match. |

The location shown in a request comes from the phone's operating system, so it may be wrong or approximate.

## Loops and resets

The pages I read do not describe a specific sign-in loop, so the following covers what they do document about resets.

- **Gray inactive tile.** Inactive accounts created by other apps using single sign-on are harmless.
- **New phone.** Work or school credentials are not part of Cloud Backup. Register the account again. Backup also only restores to the same device type. On Android, Microsoft says that from January 2027 Microsoft personal accounts will no longer enable backup directly and will use Google One backup instead.
- **Fallback code.** Authenticator can generate an OATH verification code. A user can have up to five OATH hardware tokens or authenticator apps configured.

### What admins can reset

Learn says to sign in to the Microsoft Entra admin center as at least an Authentication Administrator, then go to **Entra ID** > **Users**, select the user and open **Authentication methods**.

- **Require re-register MFA** deactivates hardware OATH tokens and deletes phone numbers, Authenticator apps and software OATH tokens. The user sets up a new method at the next sign-in.
- **Revoke sessions** invalidates refresh tokens and forces reauthentication.
- **Reset password** assigns a temporary password that must be changed at next sign-in.

Users cannot run these actions on their own account. They manage their methods at the Security info page.

## When to contact support

Open the app menu and select **Send feedback** to submit logs, then contact Support for personal accounts or your IT admin for work or school accounts.

## Related

- [Multifactor authentication (MFA)](https://www.m365.fm/entity/mfa/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Microsoft Entra](https://www.m365.fm/entity/microsoft-entra/)

## Sources

- [Microsoft Support: Troubleshoot problems with Microsoft Authenticator](https://support.microsoft.com/account-billing/troubleshoot-problems-with-microsoft-authenticator-a3a74493-566b-4c2e-b949-a2789bac0fd3)
- [Microsoft Support: Sign in using Microsoft Authenticator](https://support.microsoft.com/en-us/topic/582bdc07-4566-4c97-a7aa-56058122714c)
- [Microsoft Support: Back up your accounts in Microsoft Authenticator](https://support.microsoft.com/en-us/account-billing/bb939936-7a8d-4e88-bc43-49bc1a700a40)
- [Microsoft Learn: Authentication methods in Microsoft Entra ID, Microsoft Authenticator](https://learn.microsoft.com/en-us/entra/identity/authentication/concept-authentication-authenticator-app)
- [Microsoft Learn: Number matching in Authenticator push notifications](https://learn.microsoft.com/en-us/entra/identity/authentication/how-to-mfa-number-match)
- [Microsoft Learn: Manage user authentication methods](https://learn.microsoft.com/en-us/entra/identity/authentication/howto-mfa-userdevicesettings)
