---
title: "Intune iOS and iPadOS Enrollment Errors: Troubleshoot and Fix"
summary: "Enrollment errors users see on iPhone and iPad, token sync errors with Apple Business Manager and Apple School Manager, and eight other issues from Microsoft Learn, each with cause and fix: APNs certificate, device cap, licenses, WS-Trust 1.3, device type restriction, MFA in Setup Assistant."
status: review
publish: false
author: mirko-p
date: 2027-01-24
topics: [intune]
keypoints:
  - "NoEnrollmentPolicy, APNSCertificateNotValid and AccountNotOnboarded point to a missing, invalid or expired Apple push certificate. Renew it, do not replace it."
  - "Replacing the APNs certificate instead of renewing it means all iOS and iPadOS devices must be re-enrolled in Intune."
  - "ADE token sync errors such as Access denied or Terms and conditions not accepted usually need action in Apple Business Manager or Apple School Manager."
  - "ADE enrollment with user affinity needs the WS-Trust 1.3 Username/Mixed endpoint enabled, which you can check with Get-AdfsEndpoint."
  - "ADE enrollment that sticks after the credentials can be caused by MFA with the legacy Setup Assistant method. Use Setup Assistant with modern authentication."
faq:
  - q: "What does NoEnrollmentPolicy mean on an iPhone?"
    a: "Microsoft Learn lists it as no enrollment policy found. The Apple Push Notification Service certificate is missing, invalid or expired. Check that enrollment is set up correctly and that iOS/iPadOS is enabled as a platform, then get or renew the Apple MDM push certificate."
  - q: "Should I replace an expired APNs certificate?"
    a: "No. Learn says to renew it and not replace it. If you replace the certificate, you have to re-enroll all iOS and iPadOS devices in Intune."
  - q: "A user gets User Name Not Recognized. What is wrong?"
    a: "The user does not have a valid Intune license. In the Microsoft 365 admin center go to Users, Active users, select the user, open Product licenses and Edit, verify that a valid Intune license is assigned, and re-enroll the device."
  - q: "Why does ADE enrollment never start after I turn on the device?"
    a: "Learn gives one cause: the enrollment profile was created before the ADE token was uploaded to Intune. Edit the profile with any change to update its modification time, then sync the token with Sync now so a request goes to Apple."
  - q: "Setup stops after the user enters credentials on an ADE device. Why?"
    a: "The page names multifactor authentication as the cause, because MFA does not work during enrollment on ADE devices when the authentication method is Setup Assistant legacy. Disable MFA and re-enroll, or change the method to Setup Assistant with modern authentication."
---

Enrollment of iPhones and iPads in Intune can fail in two places: on the device, where the user sees an error, and in the admin center, where the sync with Apple Automated Device Enrollment (ADE) reports a token error. The Microsoft Learn page on troubleshooting iOS and iPadOS enrollment errors covers both, plus eight further scenarios. This article walks through them in that order, with the wording from the page.

## Part 1: Errors users see during enrollment

| Error message | Issue | Resolution |
| --- | --- | --- |
| NoEnrollmentPolicy | No enrollment policy found | The APNs certificate is missing, invalid or expired. Check that enrollment is set up correctly and that iOS/iPadOS is enabled as a platform. Get or renew the Apple MDM push certificate |
| DeviceCapReached | Too many mobile devices are enrolled already | The user removes one of their enrolled mobile devices from the Company Portal before enrolling another |
| Company Portal Temporarily Unavailable | The Company Portal app is out of date or corrupted | Remove the app, validate user credentials, then reinstall the app |
| APNSCertificateNotValid | Problem with the certificate that lets the device communicate with your company's network | Fails if the APNs steps were not completed or the certificate expired. Renew the certificate, then re-enroll the device |
| AccountNotOnboarded | Same certificate problem | Same two causes. Review how to create an APNs certificate for iOS devices |
| DeviceTypeNotSupported | The device type is not supported, possibly a non-iOS device | Make sure the device runs iOS/iPadOS version 8.0 or later |
| UserLicenseTypeInvalid | The user is not yet in a required group, or lacks the correct license | The license type must match the MDM authority. Review the iOS/iPadOS enrollment setup and how to sync users and organize groups |
| MdmAuthorityNotDefined | The mobile device management authority is not defined | Set the MDM authority in Intune |

The important warning in this table: **renew** the APNs certificate and do not **replace** it. Replacing it means all iOS and iPadOS devices must be re-enrolled. For Intune standalone use the page Renew Apple MDM push certificate. For Microsoft 365 use Create an APNs certificate for iOS devices.

The same Apple push channel sits behind three of these errors (NoEnrollmentPolicy, APNSCertificateNotValid, AccountNotOnboarded), so check the certificate first when you see any of them.

## Part 2: Sync token errors between Intune and ADE

These errors relate to Apple Business Manager (ABM) and Apple School Manager (ASM).

| Error message | Cause | Solution |
| --- | --- | --- |
| Expired or invalid token | Token may be expired, revoked or malformed | Renew the token. If renewal fails, contact Intune support, since you may need a new public key on the existing MDM server in ABM or ASM under Preferences, MDM Server Settings, Upload Public Key |
| Access denied | Intune can no longer talk to Apple, for example Intune was removed from the MDM server list, or the token expired | Verify whether the token expired and whether a new one was created. Check that Intune is in the MDM server list |
| Terms and conditions not accepted | New terms must be accepted in ABM or ASM | Accept them in the portal. A user with the Administrator role in ABM or ASM must do this |
| Internal server error | Needs further investigation | Contact Intune support, since additional logs are needed |
| Invalid support phone number | The number is invalid | Edit the support phone number in your profiles |
| Invalid configuration profile name | The name is invalid, empty or too long | Edit the profile name |
| Invalid cursor | Rejected by Apple or not found | Contact Intune support, who can retry the sync |
| Cursor expired | Expired on Intune's side | Contact Intune support, who can retry the sync |
| Required cursor | Not set by Intune during the sync | Contact Intune support to fix the sync and return the cursor |
| Apple profile not found | Multiple possible causes | Create a new profile and assign it to devices |
| Invalid department entry | The department field is invalid | Edit the department field in your profiles |

### Error while uploading the Enrollment Program token

If the token upload fails with a message that begins An error occurred while uploading the Enrollment Program token, the page describes a way to create a new token with Graph Explorer:

1. Sign in to Graph Explorer as an Intune administrator.
2. Run a GET request on `https://graph.microsoft.com/beta/deviceManagement/depOnboardingSettings` to list the tokens in the tenant. Grant consent if needed and run it again.
3. Find the GUID of the token that needs renewing.
4. Run a GET request on `https://graph.microsoft.com/beta/deviceManagement/depOnboardingSettings/<TokenGuid>/getEncryptionPublicKey` to get the public encryption key.
5. Copy the value from the response into a text file and save it as a .pem file, for example token.pem. The file has three lines (BEGIN CERTIFICATE, the base64 string, END CERTIFICATE), and there must be no line breaks inside the base64 string.
6. Sign in to ABM or ASM, find the token server to update, and select **Edit**.
7. In **MDM Server Settings** upload the .pem file and select **Save**. If the file format is reported as incorrect, check step 5, close the page and select **Edit** again.
8. Select **Download Token**.
9. In Intune, refresh with the downloaded token.

## Part 3: Other errors and issues

### WS-Trust 1.3 must be enabled

ADE enrollment with user affinity needs the WS-Trust 1.3 Username/Mixed endpoint to request user tokens. Learn says Active Directory enables it by default, and that without it ADE iOS and iPadOS devices cannot be enrolled. To list enabled endpoints on AD FS use:

```powershell
Get-AdfsEndpoint -AddressPath "/adfs/services/trust/13/UsernameMixed"
```

If you use AD FS and need help, contact Microsoft Support. With a third-party identity provider, contact that vendor.

### Workplace Join failed

The Company Portal app is out of date or corrupted. Remove it from the device, install **Microsoft Intune Company Portal** from the App Store and re-enroll.

### User Name Not Recognized

The message says the user account is not authorized to use Microsoft Intune. Learn says the user does not have a valid Intune license. In the Microsoft 365 admin center go to **Users** > **Active Users**, select the user, choose **Product licenses** > **Edit**, verify a valid Intune license, and re-enroll.

### XPC_TYPE_ERROR Connection invalid

Enrollment fails when an ADE-managed device with an enrollment profile is turned on, and the device log shows a Connection invalid entry. Cause: a connection issue between the device and the Apple ADE service. Fix the connection problem, or use a different network. The page adds that you may have to contact Apple if it persists.

### Configuration could not be downloaded: Invalid Profile

Cause: a device type restriction blocks enrollment. In the Microsoft Intune admin center go to **Devices** > **Enroll devices** > **Enrollment restrictions**. Under **Device type restrictions** select **All Users** > **Properties**, select **Edit** next to **Platform settings**, set **Allow** for iOS/iPadOS, then go to **Review + save** and select **Save**.

### ADE enrollment does not start

Cause: the enrollment profile was created before the ADE token was uploaded. Edit the profile, with any change, to update its modification time. Then sync: **Devices** > **iOS** > **iOS enrollment** > **Enrollment program tokens**, choose the token and select **Sync now**. A sync request goes to Apple.

### ADE enrollment stuck at user login

Cause: MFA is enabled. Per Learn, MFA currently does not work during enrollment on ADE devices if the authentication method is **Setup Assistant (legacy)**. Disable MFA and re-enroll, or change the method to **Setup Assistant with modern authentication**.

### Authentication does not redirect to the government cloud

Government users who sign in from another device are redirected to the public cloud, because Microsoft Entra ID does not yet support redirecting to the government cloud in that case. Use the Company Portal **Cloud** setting in the iOS **Settings** app. It defaults to **Automatic**. Open Settings, select Company Portal, select **Cloud** and set it to Government.

## A check order (my advice)

This is my suggestion, not an order from the page:

1. If many devices fail at once, look at the APNs certificate and the ADE token first. One expired item explains many tickets.
2. If one user fails, check the license, the device cap and the enrollment restrictions.
3. If the device fails only during Setup Assistant, check the profile creation order, the sync, and MFA.
4. Put the APNs and ADE token renewal dates in a shared calendar. Learn's warning about replacing the certificate shows how costly a mistake is.
5. After any fix, test with one device before you tell all users to try again.

## Related

- [Microsoft Intune](https://www.m365.fm/entity/intune/)

## Sources

- [Troubleshooting iOS/iPadOS device enrollment errors in Microsoft Intune (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/mem/intune/device-enrollment/troubleshoot-ios-enrollment-errors)
