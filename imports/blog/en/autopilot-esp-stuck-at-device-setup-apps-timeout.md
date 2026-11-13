---
title: "Windows Autopilot Stuck at Device Setup on 'Apps' Until the ESP Times Out: How to Find the Cause"
summary: "Autopilot registers the device, but the Enrollment Status Page hangs at Device setup on apps and then times out. Find the blocking app, check the ESP timeout and avoid the known app-type conflicts."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [intune, windows-autopilot, enrollment-status-page, windows-autopilot-device-preparation]
keypoints:
  - "First find which app blocks: read InstallationState in the ESPTrackingInfo registry area, or collect Autopilot logs and parse them."
  - "A value of 4 (Error) for any tracked Win32 app stops the ESP from installing further apps. The Intune Management Extension log has the reason."
  - "Microsoft Learn says not to mix line-of-business (LOB) and Win32 apps in the ESP, because the installs cannot run at the same time."
  - "Deploy Microsoft 365 Apps as the Win32 app type, and let Intune manage reboots instead of packaging reboots inside apps."
  - "The default ESP timeout is 60 minutes. A timeout that is too short for the number of apps also causes this symptom."
faq:
  - q: "What does error 0x800705b4 mean during Autopilot?"
    a: "The Microsoft Q&A thread reports it at the ESP timeout. The Microsoft Learn ESP pages that I checked do not explain this code. Learn does say that ESP timeouts come from app deployment failures or from a timeout value that is too low for the required apps."
  - q: "Can I mix LOB and Win32 apps in the Enrollment Status Page?"
    a: "Microsoft Learn says no. Both use TrustedInstaller, which does not allow installs at the same time, and a conflicting Win32 install returns 'Another installation is in progress, please try again later'. In that case the ESP fails."
  - q: "How many apps can I mark as blocking?"
    a: "Learn says that with the Selected option you can choose up to 100 apps in the blocking list."
  - q: "Is there an option that does not use the ESP?"
    a: "Yes. Windows Autopilot device preparation does not use the ESP. Learn also says that a device registered for Autopilot or with an Autopilot profile will show the ESP, because Autopilot profiles take precedence over device preparation policies."
---

A new laptop registers for Windows Autopilot. The hardware hash is in Microsoft Entra. Provisioning starts and then sits at the Device setup phase of the Enrollment Status Page (ESP). The status says the apps are installing, for example "0 of 5 installed," and after the timeout the device shows an error.

A Microsoft Q&A thread from June 2026 describes this with Win32 apps and the error code 0x800705b4. It has no accepted answer and the poster did not reply. A community volunteer (an independent advisor) answered with a likely cause and a list of checks. An AI-generated answer in the same thread is not a source for this article. This guide takes the scenario from the thread and builds the checks from Microsoft Learn. It is not an official Microsoft procedure.

## Symptoms

- The device is registered in Autopilot and starts provisioning.
- The ESP stays on Device setup, with the app count not moving or moving slowly.
- At the end the ESP shows a timeout or error. In the thread the code was 0x800705b4.

## Step 1: Find which app blocks

Do not guess from the app count. Get evidence from the device.

**Registry.** Learn describes the tracking data under `HKLM\SOFTWARE\Microsoft\Windows\Autopilot\EnrollmentStatusTracking`. For Win32 apps in the device phase, look at `Device\Setup\Apps\Tracking\Sidecar\Win32App_{AppID}` and the `InstallationState` value:

| Value | Meaning |
|---|---|
| 1 | NotInstalled |
| 2 | InProgress |
| 3 | Completed |
| 4 | Error |

Learn says that if the value is 4 for any app, the ESP stops installing apps. Then check the Intune Management Extension log for the cause. The thread answer named the folder `C:\ProgramData\Microsoft\IntuneManagementExtension\Logs`. Learn names the log but I did not find the folder path in the text of the pages that I read, so confirm it on your device.

Learn also says the ESP does not track PowerShell scripts as blocking workloads. LOB MSI apps are recorded under `ESPTrackingInfo\Diagnostics\ExpectedMSIAppPackages`.

**Logs from the ESP.** If you turned on **Turn on log collection and diagnostics page for end users**, the user can select **Collect logs** on the timeout screen and copy the files to a USB drive. You can also press Shift+F10 in the out-of-box experience (on devices that are not in S mode) and run the command Learn gives for user-driven mode:

```
mdmdiagnosticstool.exe -area Autopilot -cab <pathToOutputCabFile>
```

Learn lists other commands for self-deploying, pre-provisioning and runtime provisioning. Then parse the CAB on an admin machine:

```
Install-Script -Name Get-AutopilotDiagnostics -Force
Get-AutopilotDiagnostics -CABFile <pathToOutputCabFile>
```

## Step 2: Check the timeout and the number of apps

In the Intune admin center, go to **Devices**, expand **Device onboarding**, select **Enrollment**, open the **Windows** tab, and under **Windows Autopilot** select **Enrollment Status Page**. Open the profile that applies to the device.

Check **Show an error when installation takes longer than specified number of minutes**. Learn says the default is 60 minutes. It also says that an ESP timeout during app deployment usually happens because the timeout value is not enough for all required apps, and it gives an example of five minutes with more than 15 required apps. Timeouts can also come from wrong app configuration, network problems or device-specific issues, so a longer timeout alone may only delay the same failure.

## Step 3: Remove the LOB and Win32 mix

The thread answer blamed conflicts between LOB and Win32 apps. The asker had not mentioned any LOB apps, so this was an assumption that nobody checked on the device. Microsoft Learn supports the general point: do not mix LOB and Win32 apps. Both use TrustedInstaller, which does not allow installs at the same time. A Win32 install that collides returns the message "Another installation is in progress, please try again later," and the ESP fails.

What to do:

1. List all apps that are required for the device and for the user during provisioning.
2. Note which are LOB (including MSI) and which are Win32.
3. Move to one type. The device preparation FAQ says Microsoft always recommends Win32 applications.

## Step 4: Check Microsoft 365 Apps and reboots

- **Microsoft 365 Apps:** Learn says the ESP can hang when you add Microsoft 365 Apps with the *Microsoft 365 Apps (Windows 10 and later)* app type, the ESP tracks it, and it installs while another tracked Win32 app is installing. The recommendation is to deploy Microsoft 365 Apps with the Win32 app type.
- **Reboots:** Learn says reboots packaged inside an app might make the ESP hang and fail. Set the reboot behavior in Intune instead. Reboots during the device ESP must be managed by Intune. Learn also shows how to find what triggered a reboot with the reboot URI CSP data.

Also make sure each app installs silently with no user interface in the device context, and that it has no user-context applicability rules. Learn lists that the tracked apps are required, install in device context and have no user-context applicability rules.

## Step 5: Reduce what the ESP waits for

In the ESP profile, the option **Block device use until all apps and profiles are installed** makes users wait for everything. With **Block device use until these required apps are installed if they are assigned to the user/device** you can pick **Selected** and a list of up to 100 blocking apps.

Be careful with what this list does. Learn says the list filters which apps count as blocking. It does not decide which apps are installed. Example from Learn: if the list holds apps 1 to 3 and apps 3 and 4 are targeted, the ESP tracks only app 3.

Keep only the apps that users truly need before first sign-in in the list. Smaller sets finish faster and have fewer chances to conflict.

Learn also notes that on hybrid Microsoft Entra join, Win32 and UWP apps assigned to the device with user installation context are not tracked during provisioning.

## Step 6: Consider Autopilot device preparation

Windows Autopilot device preparation does not use the ESP. Learn's FAQ says the number of apps during the out-of-box experience was limited for stability, and that almost 90% of Autopilot deployments use 10 or fewer apps. Learn also says that with device preparation the providers are serialized, so LOB and Win32 apps in the same deployment should not affect each other.

If you still see the ESP during a device preparation test, Learn says the device is probably registered as an Autopilot device or has an Autopilot profile assigned. Autopilot profiles take precedence.

## Verify

- Run the same device through provisioning again, or a fresh one, and watch `InstallationState` change from 2 to 3 for each app.
- Check that no app reaches 4.
- Compare the total time with the ESP timeout.
- Use **Collect logs** on a failed device before you reset it, so that the evidence is not lost.

## Limits and open points

- The thread is unresolved. Its cause (LOB and Win32 conflict) is a possibility, not a diagnosis.
- Learn does not explain 0x800705b4 on the pages I read. Treat it as the symptom of the timeout and look at the logs for the real error.
- Learn says there are policies that conflict with the ESP and points to the Autopilot known issues list. Check that list for your Windows version.
- A December 2025 Q&A thread described the ESP failing with "Something went wrong" on new laptops, with an MVP suggesting to recreate the ESP and Autopilot profile. It had no accepted answer, and the asker linked it to a possible service change, so it is not part of this checklist.

## Related

- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Windows Autopilot](https://www.m365.fm/entity/windows-autopilot/)
- [Enrollment Status Page](https://www.m365.fm/entity/enrollment-status-page/)
- [Windows Autopilot device preparation](https://www.m365.fm/entity/windows-autopilot-device-preparation/)

## Sources

- [Microsoft Learn: Set up the Enrollment Status Page](https://learn.microsoft.com/en-us/intune/intune-service/enrollment/windows-enrollment-status)
- [Microsoft Learn: Troubleshooting the Enrollment Status Page](https://learn.microsoft.com/en-us/troubleshoot/mem/intune/device-enrollment/understand-troubleshoot-esp)
- [Microsoft Learn: Windows Autopilot device preparation FAQ](https://learn.microsoft.com/autopilot/device-preparation/faq)
- [Microsoft Q&A: Windows Autopilot deployment gets stuck on "Device Setup" phase during ESP (June 2026)](https://learn.microsoft.com/en-us/answers/questions/5912291/windows-autopilot-deployment-gets-stuck-on-device)
- [Microsoft Q&A: Autopilot's ESP page fails since last Friday (December 2025)](https://learn.microsoft.com/en-us/answers/questions/5665899/autopilots-esp-page-fails-since-last-friday-12-12)
