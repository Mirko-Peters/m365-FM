---
title: "Troubleshoot Wi-Fi Profiles That Fail to Deploy in Intune"
summary: "Check a Wi-Fi profile in Intune the way Microsoft Learn does: assignments, check-in, dependent Trusted Root and SCEP profiles, logs on Android, iOS/iPadOS and Windows, the Any Purpose EKU mismatch on Android, and what to do when devices get the profile but cannot connect."
status: review
publish: false
author: mirko-p
date: 2027-01-25
topics: [intune]
keypoints:
  - "A Wi-Fi profile that uses certificate authentication depends on the Trusted Root and SCEP profiles, so confirm both reached the device first."
  - "Check the profile assignment under Devices, Configuration profiles, then Troubleshooting and Support to see the device assignments and its Last check in time."
  - "On Android, search Omadmlog.log for wifimgr. The entry Skipping Wifi profile because it is pending certificates means a required certificate is missing."
  - "A mismatch between the Any Purpose EKU in the SCEP profile and the certificate template makes Android exclude the certificates. Add it to the template or remove it from the profile."
  - "If the profile is deployed but the device cannot connect, the cause is usually outside Intune. Check with a manual connection and the RADIUS server log."
faq:
  - q: "Why is my Wi-Fi profile not on the device?"
    a: "Microsoft Learn lists these checks: the profile is assigned to the right group, the device can sync with Intune and has a recent Last check in time, and the Trusted Root and SCEP profiles that the Wi-Fi profile depends on were deployed to the device. On Windows 10 and later you can also create an MDM Diagnostic report from Access work or school."
  - q: "What does pending certificates mean in the Android log?"
    a: "The Company Portal app log Omadmlog contains Skipping Wifi profile because it is pending certificates when the Trusted Root and SCEP profiles are not installed, or when no certificate matches the criteria. Learn shows one example where the SCEP profile requires the Any Purpose EKU but the certificate template on the certificate authority does not have it."
  - q: "Where are Wi-Fi profile logs on each platform?"
    a: "Android: Omadmlog.log in the Company Portal app logs, filtered with wifimgr. iOS and iPadOS: the Console app on a connected Mac with Include Info Messages and Include Debug Messages turned on, because the Company Portal log has no Wi-Fi details. Windows: Event Viewer, Applications and Services Logs, Microsoft, Windows, DeviceManagement-Enterprise-Diagnostic-Provider, Admin."
  - q: "The profile is on the device but it does not connect. Is that an Intune problem?"
    a: "Learn says this is typically caused by something outside Intune. Connect manually with a certificate that has the same criteria as the profile and compare properties, and check the RADIUS server log, which usually shows whether the device tried to connect with the profile."
  - q: "Why do some users not get the new profile after a password change?"
    a: "Learn describes this for a corporate Wi-Fi profile whose password was changed and saved. To mitigate, set up guest Wi-Fi with automatic connect settings and deploy it to all users, and roll out the changed profile to a small test group first, then to larger groups."
---

A Wi-Fi profile in Intune can fail in two different places: the profile does not reach the device, or it reaches the device but the device cannot connect. The Microsoft Learn page on troubleshooting Wi-Fi device configuration profiles separates the two and shows what success looks like on Android, iOS and iPadOS, and Windows. This article groups its content by symptom. The examples on the page use SCEP certificate authentication and assume the Trusted Root and SCEP profiles work, so the same assumption applies here.

## First: which of the two problems do you have

| Situation | Go to |
| --- | --- |
| The profile is not on the device | Section 1 |
| The profile is on the device, but there is no connection | Section 2 |
| Users do not get a changed profile | Section 3 |
| All Wi-Fi profiles show as failed (Android Enterprise) | Section 4 |
| A profile shows as failed but works (Android) | Section 5 |

## What success looks like

- **Android.** Users get notifications to install the Trusted Root certificate profile, then the SCEP certificate profile, then the Wi-Fi profile. After that the Wi-Fi connection shows as a saved network. On device administrator-managed Android devices there may be several certificates listed, because a revoked or removed certificate profile leaves the certificate on the device. Choose the newest, usually the last one. Learn says this does not happen on Android Enterprise and Samsung Knox devices.
- **iOS and iPadOS.** The profile appears in the **Management Profile**, and the connection shows as a Wi-Fi network.
- **Windows.** Under **Settings** > **Accounts** > **Access work or school**, select your account and **Info**. **WiFi** is listed under **Areas managed by Microsoft**. The connection shows in **Settings** > **Network & Internet** > **Wi-Fi** as a known network.

## Where the logs are

**Android.** The **Omadmlog.log** file in the Company Portal app records the Wi-Fi profile activity. There can be up to five Omadmlog files, so note the time of the last sync. Read them with CMTrace and search for `wifimgr`. A good result ends with an entry that the Wi-Fi profile was successfully applied, enabled and saved.

**iOS and iPadOS.** The Company Portal log has no Wi-Fi information. Use the Console app:

1. Connect the device to a Mac and open **Applications** > **Utilities** > **Console**.
2. Under **Action** select **Include Info Messages** and **Include Debug Messages**.
3. Reproduce the problem, then select all (**Edit** > **Select All**), copy and save the messages to a text file.
4. Search the file. On success you find a line that the profile (named like www.windowsintune.com.wifi.Contoso) was installed.

**Windows.** Open **Event Viewer**, choose **Show Analytic and Debug Logs** in the **View** menu, and expand **Applications and Services Logs** > **Microsoft** > **Windows** > **DeviceManagement-Enterprise-Diagnostic-Provider** > **Admin**. Learn's example is Event ID 1506 from the WiFiConfigurationServiceProvider with the result that the operation completed successfully.

## Section 1: The profile is not on the device

1. **Check the assignment.** In the Microsoft Intune admin center go to **Devices** > **Configuration profiles**, select the profile, open **Assignments** and confirm the groups. Then open **Troubleshooting + Support** and review the **Assignments** information.
2. **Check the sync.** In **Troubleshooting + Support** check the **Last check in** time.
3. **Check the dependencies.** If the Wi-Fi profile is linked to Trusted Root and SCEP profiles, both must be on the device. The Wi-Fi profile depends on them.
4. **Windows 10 and later: MDM diagnostic report.** Go to **Settings** > **Accounts** > **Access work or school**, select the account and **Info**, then at the bottom select **Create report**. Select **Export** in the window that shows the path, then open `\Users\Public\Documents\MDMDiagnostics`.
5. **Android: read the log.** If the Trusted Root and SCEP profiles are not installed, Omadmlog has an entry that the Wi-Fi profile is skipped because it is pending certificates.

### Android: certificates present but profile still missing

When the Trusted Root and SCEP profiles are on the device and compliant but the Wi-Fi profile is not, the **CertificateSelector** in the Company Portal app may not have found a certificate that matches the criteria in the certificate template or SCEP profile. The log again says the profile is skipped because it is pending certificates.

Learn's sample log shows certificates excluded because the **Any Purpose** Extended Key Usage was specified, while the device certificates did not have that EKU. The fix is to add **Any Purpose** to the certificate template on the certificate authority, or remove it from the SCEP profile in Intune.

Also confirm that all certificates of the complete chain are on the Android device. Without them the Wi-Fi profile cannot be installed. Learn links Android's page on missing intermediate certificate authorities. In the log, if you find an error, copy its time stamp, unfilter the log and search for the time stamp to see what happened right before.

## Section 2: Deployed, but the device cannot connect

Learn says this is typically caused by something outside Intune:

- Connect manually to the network with a certificate that has the same criteria as in the Wi-Fi profile. If it connects, look at the certificate properties of the manual connection and update the Intune profile to match.
- Look at the RADIUS server log. Connection errors are usually logged there, for example whether the device tried to connect with the profile.

## Section 3: No new profile after a password change

For a corporate profile where you changed the password and saved it, some users may not get the new profile. Learn suggests:

- Set up guest Wi-Fi with automatic connect settings, deployed to all users, so users can connect if the corporate Wi-Fi fails.
- For a password or passphrase network, first connect to the router directly, for example with an iOS or iPadOS device, note the SSID and the credential, and enter the SSID and credential in the **Pre-Shared Key** field.
- Deploy to a small test group, preferably the IT team, sync the device and test the connection again.
- Then roll out to larger groups and finally to all expected users.

## Section 4: All Wi-Fi profiles show as failed

On Android Enterprise fully managed, dedicated and corporate-owned work profile devices, you may get a report that all profiles failed. This can happen when you deploy more than one Wi-Fi profile. If one fails, all the deployed profiles report as failed, even if they still work.

## Section 5: A profile shows failed but seems to work

If a Wi-Fi profile works on an Android device but reports as failing, it may be a reporting error. Learn says to update the Intune app to version 2021.05.02 or later.

## Working method (my advice)

This is my suggestion, not guidance from the page:

1. Test on one device per platform before you assign to a whole group, and keep the certificate profiles and the Wi-Fi profile in the same assignment plan.
2. When a Wi-Fi profile is missing, always check the certificate profiles first, because the page ties the Wi-Fi profile to them.
3. Keep the EKU settings of the certificate template and the SCEP profile in one document, so a mismatch is easy to spot.
4. Ask the network team for RADIUS log access during rollouts. It saves time when the profile is deployed but connections fail.
5. Plan password changes on pre-shared key networks, and use the guest network approach from the page as a fallback.

## Related

- [Microsoft Intune](https://www.m365.fm/entity/intune/)

## Sources

- [Troubleshoot and review Wi-Fi device configuration profiles in Intune (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/mem/intune/device-configuration/troubleshoot-wi-fi-profiles)
