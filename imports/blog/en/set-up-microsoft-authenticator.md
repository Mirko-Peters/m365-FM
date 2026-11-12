---
title: "How to Set Up Microsoft Authenticator (Personal and Work Accounts)"
summary: "Set up Microsoft Authenticator for a personal or work account: QR code steps, what to do if scanning fails, and how backup and a new phone work, step by step."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [microsoft-authenticator, mfa]
keypoints:
  - "For a personal Microsoft account, sign in at account.microsoft.com/security, choose Manage how I sign in, add a way to sign in or verify, and scan the QR code with the app."
  - "For a work or school account, the setup runs from a Keep your account secure wizard at sign-in, where you add a Work or school account in the app and scan a QR code."
  - "If the QR code won't scan, use the manual option on the computer and enter the code and URL in the app."
  - "Back up before you change phones. Work or school accounts are not backed up, so you must register them again on the new phone."
  - "A backup restores only to the same type of device, so an iOS backup can't be restored on Android."
faq:
  - q: "How do I set up Microsoft Authenticator?"
    a: "Install the app, then add your account. For a personal Microsoft account, go to account.microsoft.com/security, choose Manage how I sign in, add a new way to sign in or verify, pick Use an app, and scan the QR code in the app. For a work account, follow the Keep your account secure wizard at sign-in."
  - q: "What if I can't scan the QR code?"
    a: "On the computer, select the option that says you can't scan the QR image, then enter the code and URL in the app by hand. On a personal account setup, the equivalent link says you can't scan the bar code, and the app then offers Enter code manually. Also check that the app is allowed to use the camera."
  - q: "Do my accounts move to a new phone automatically?"
    a: "Only if you turned on backup, and not completely. Microsoft says work or school accounts aren't backed up. Only the account name is restored, and you must sign in and register the account again. Personal and third-party codes can be restored from backup, but only onto the same type of device."
---
To set up [Microsoft Authenticator](https://www.m365.fm/entity/microsoft-authenticator/), install the app on your phone, then add your account by scanning a QR code. For a personal Microsoft account, you start at `account.microsoft.com/security`, select **Manage how I sign in** and add the app as a way to verify. For a work or school account, the setup starts from a **Keep your account secure** wizard that appears when you sign in. This article is for end users who need to do it once, and for helpdesk staff who walk others through it. It gives the steps for both account types, a fix for QR code problems, and the backup rules that decide whether a new phone is a ten-minute job or a long afternoon.

## What the app does and what to know first

Microsoft describes Authenticator as a free app that helps you sign in without a password. It works with personal, work, school and other accounts. It has three main jobs: confirming your sign-in when you forget your password, producing one-time codes for [multifactor authentication](https://www.m365.fm/entity/mfa/) (two-step verification), and passwordless sign-in, where you approve a notification on your phone instead of typing a password.

Two things to know before you start:

- You need the latest version of the app to add an account. Microsoft's instructions say so explicitly, so update the app first if you already have it.
- The steps differ by account type. A personal account is set up in your account security settings. A work or school account follows a wizard set by your organization, and your admin decides which methods are required.

If you're helping someone else, ask first which account they mean. "My Microsoft login" can be a personal account, a work account, or both, and the screens look different.

## How to set up Microsoft Authenticator for a personal account

Microsoft's article on adding accounts describes three methods for a personal account. The first, adding the app as a way to verify your sign-in, is the one most people want.

1. On a computer, sign in at `account.microsoft.com/security` and open the **Security** tab.
2. Select **Manage how I sign in**.
3. Select **Add a new way to sign in or verify**.
4. Choose **Use an app**. If Authenticator isn't installed yet, select **Get it now**. If it's installed, select **Set up a different Authenticator app**, then **Next** to show the QR code.
5. On your phone, open the app and tap the plus icon.
6. Select **Personal account**, then **Scan a QR Code**, and point the camera at the code on your screen.

The other two methods work from the same **Manage how I sign in** page. For two-step verification, scroll to the **Two-step verification** section and turn it **On**. You then follow the on-screen instructions, including a QR code scan, and you get one-time codes at every sign-in. For passwordless sign-in, scroll to the **Passwordless account** section and turn it **On**, verify your account, and approve the request that arrives in the app.

If your phone camera can't read the code, click **I can't scan the bar code** on the computer, then tap **Enter code manually** on your phone.

## Set up Microsoft Authenticator for a work or school account

For work or school accounts, Microsoft's article on [setting up security info from a sign-in page](https://support.microsoft.com/en-us/accounts-billing/work-school/set-up-security-info-from-a-sign-in-page) describes a wizard. You see it when you sign in and your organization requires security info that you haven't set up yet. If your screen doesn't match the steps below, your admin may not have enabled this experience, so ask them.

1. Select **Next** at the prompt. The **Keep your account secure** wizard shows the first required method.
2. Select **Download now**, install Microsoft Authenticator on your phone, then select **Next**.
3. Stay on the **Set up your account** page on the computer.
4. In the app, allow notifications if asked. Tap the **Customize and control** icon at the upper right, select **Add account**, then choose **Work or school account**. Allow camera access so the app can scan.
5. Back on the computer, select **Next**. The **Scan the QR code** page appears.
6. Scan the code with the app. If that fails, select **Can't scan the QR image** and enter the code and URL by hand.
7. Select **Next**. The app receives a test notification. Approve it, then select **Next**. The app becomes your default verification method.
8. In Microsoft's example, the wizard then asks for a phone number as a second method. Choose a text message or a phone call, enter the code you receive, and select **Next**, then **Done**.

Your organization decides the exact list of methods. The example in Microsoft's article requires an authenticator app and a phone number, and yours may require something else. Microsoft also notes that email and security questions work only for password reset, not for two-factor verification, so you need a different method for the second factor.

If the camera isn't allowed, you can still finish by entering the code by hand, as in step 6. The article mentions a separate section for adding an account manually without giving the details, so use the on-screen prompts.

## What to do when the setup doesn't work

Most failed setups are one of a few things. Work through them in this order.

- **The app is out of date.** Update it, because adding an account needs the latest version.
- **The QR code won't scan.** Use the manual option on the computer. On a personal account setup it's the **I can't scan the bar code** link, then **Enter code manually** on the phone. On a work account setup it's **Can't scan the QR image**.
- **The camera isn't allowed.** Allow camera access in the phone settings, or enter the code by hand.
- **The screens don't match the instructions.** For a work account, your admin may not have enabled the wizard. Ask which method they require.
- **A notification never arrives.** Check that the app is allowed to send notifications, since the app asks for that permission during setup.

For deeper problems, Microsoft links its FAQ and troubleshooting pages for Authenticator from the main support page. The pages I checked don't cover how an admin resets a user's methods, so a helpdesk should follow its own admin documentation for that case.

## Back up your accounts before you change phones

A new phone is the moment people find out how Authenticator handles backup. Read this section before you wipe or hand in the old one.

Microsoft's backup article says what is and isn't covered:

- **Personal Microsoft accounts.** The one-time codes that refresh every 30 seconds are backed up. Passwordless sign-in credentials aren't, so you sign in again.
- **Third-party accounts**, such as LinkedIn and Facebook, back up their 30-second codes.
- **Work or school accounts aren't backed up.** Only the account name is saved. After a restore, you sign in and register the account again on the new device.

To turn on backup on Android, open the app, tap the three-dot icon, open **Settings** and turn on the **Cloud Backup** toggle. You then choose the personal Microsoft account where the backup is stored. Microsoft's article also states that starting January 2027, Android backup will no longer use a Microsoft personal account, and you'll use Google One backup instead. That date is in Microsoft's article as I read it, so check the current page before you tell users.

On iOS, Microsoft's restore article lists three prerequisites: iCloud Drive, iCloud Keychain and iCloud Backup must be turned on. Then install the app on the new phone and open it. The backed-up codes and account names appear, and for accounts that show **Sign in to restore your account**, tap **Sign in**, enter your password and confirm your email or phone number.

Two rules apply to both systems. A backup restores only onto the same device type, so an iOS backup can't be restored on Android. And keep the old phone until you've registered every work or school account on the new one. IT admins can also block third-party codes in Entra ID, which prevents credential backup for those accounts.

## Common mistakes

- **Wiping the old phone first.** Work or school accounts aren't restored from a backup, and Microsoft says to keep the old device until they're registered on the new one.
- **Assuming backup covers everything.** Passwordless credentials and work accounts need a new sign-in.
- **Switching platforms and expecting a restore.** iOS to Android, or the other way, can't use the backup.
- **Not updating the app.** An old version can't add an account.
- **Adding the wrong account type in the app.** Pick **Personal account** or **Work or school account** to match the QR code you're scanning.
- **Skipping a second method.** A phone can be lost or broken. Register a second verification method while you still have the first one.

## Related topics to explore

- Add Authenticator as a verification method: [How to add your accounts to Microsoft Authenticator](https://support.microsoft.com/en-us/authenticator/how-to-add-your-accounts-to-microsoft-authenticator) covers the personal account methods.
- Multifactor authentication for organizations: admins decide which methods users must register, and the choice shapes the wizard that users see.
- Move Authenticator to a new phone: the [restore article](https://support.microsoft.com/en-us/authenticator/restore-account-credentials-from-microsoft-authenticator) lists the iOS prerequisites and the account types that come back.
- Back up your accounts: the [backup article](https://support.microsoft.com/en-us/authenticator/back-up-your-accounts-in-microsoft-authenticator) explains Cloud Backup on Android.
- What to do after losing a phone: plan a second method for every important account.

## Next step

To set up Microsoft Authenticator, update the app, add your account with the QR code for your account type, and approve the test sign-in. Then turn on backup right away and register a second method, so the next new phone costs you minutes and not a support ticket.
