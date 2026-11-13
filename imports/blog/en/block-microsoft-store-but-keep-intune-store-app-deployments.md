---
title: "Block the Microsoft Store for Users but Keep Intune 'Microsoft Store app (new)' Deployments Working"
summary: "You want users locked out of the Microsoft Store while Intune Store app deployments keep working. Microsoft Learn names one policy for this. Here are the setup, the checks and where a thread disagrees."
status: approved
publish: false
author: mirko-p
date: 2026-11-13
topics: [intune, windows-autopilot, enrollment-status-page]
keypoints:
  - "Microsoft Learn says that 'Turn off the Store application' set to Enabled blocks users from installing apps and updates in the Store, and it does not affect Intune's ability to install Store apps."
  - "A community reply in a January 2026 thread said turning off the Store app may break Store app installs. Learn says the opposite, so the documentation wins, but test on a pilot device."
  - "Do not use RequirePrivateStoreOnly to block users. Learn says it still allows winget access to the Store and prefers 'Turn off the Store application'."
  - "Keep the install context the same across your Store app deployments. Learn recommends not mixing contexts."
  - "A status that flips from success to failed can come from error 0x87D1041C, which Learn says appears even though the app installs correctly."
faq:
  - q: "Will 'Turn off the Store application' stop Intune from installing Store apps?"
    a: "Microsoft Learn says no. It states that the policy does not affect Intune's ability to install Microsoft Store apps and that the new Intune integration with the Microsoft Store is allowed in all cases."
  - q: "Does that policy stop winget?"
    a: "Learn notes that the winget.exe command-line tool is not affected by this policy."
  - q: "Why did the same Store apps install on Cloud PCs but fail on physical devices?"
    a: "The January 2026 thread does not answer this. No reply was accepted and the poster did not confirm a fix. Use Learn's list of requirements and troubleshooting notes to compare the two device types."
  - q: "Are Store apps tracked by the Autopilot Enrollment Status Page?"
    a: "Learn says the device setup phase tracks line-of-business store apps with device installation context, Win32 apps and WinGet apps. A community expert in the thread said only Win32 apps are listed in the ESP. The documentation is the better source."
---

Many admins want two things at once. Users should not open the Microsoft Store and install what they like. Intune should still push apps that come from the Store, such as the "Microsoft Store app (new)" type.

A Microsoft Q&A thread from January 2026 shows how this goes wrong. An administrator deployed new Store apps to physical devices. They failed, while the same apps worked on Cloud PCs. The administrator had enabled "Turn off the Microsoft Store app" to keep users out of the Store. A community contributor said that turning off the Store app may break Store app installs, and suggested hiding it instead. A community expert replied that Store installs can be unreliable and that they do not install them during Autopilot. The thread has no accepted answer. Later the administrator reported that the status of some apps changed from success to failed even though the app was installed. This article compares those replies with Microsoft Learn. It is not an official Microsoft procedure.

## Symptoms

- "Microsoft Store app (new)" deployments fail on some devices, with a generic error.
- Some devices first report success and later report failed, although the app is on the device.
- You blocked the Store for users and are not sure if that is the cause.

## Step 1: Use the documented policy to block the Store

Microsoft Learn describes the **Turn off the Store application** policy. It has three states:

- **Not configured:** nothing changes. Learn says the OS might then allow users to install arbitrary Store apps outside of Intune.
- **Enabled:** blocks users from installing arbitrary apps from the Store app, and from using the Store to install app updates by hand.
- **Disabled:** allows both.

The key sentence for this problem: Learn says the policy "doesn't affect Intune's ability to install Microsoft Store apps," and that in all cases the new Intune integration with the Microsoft Store is allowed. It also says `winget.exe` is not affected.

So the thread reply that turning off the Store app breaks Store installs does not match Learn. Learn is the official source, so start there. The thread does not show the reply being tested, so I cannot say it is wrong for every setup. Test on one pilot device that has the policy.

In the Intune admin center, create the setting in a Settings catalog policy. Learn lists the CSP as `ADMX_WindowsStore/RemoveWindowsStore_1` and `RemoveWindowsStore_2`, and the Group Policy path as **Windows Components**, **Store**, **Turn off the Store Application**. Learn does not give a Settings catalog menu path for this one.

One more point on wording. The thread asked how to "hide" the Store. Learn describes the effect as blocking installs and updates by users. It does not say that the Store icon disappears, so check what your users see.

## Step 2: Do not use the private-store-only setting for this

Learn has a tip for `RequirePrivateStoreOnly`. It blocks user access to the Store, but it allows winget access to the Store. Learn says it is not the preferred choice for preventing user access and recommends **Turn off the Store application** instead.

## Step 3: Check the other Store settings that Learn lists

Learn lists settings that can affect Store app deployments. Compare them with the policy on your device:

| Setting | Learn's recommended value | Where |
|---|---|---|
| Disable all apps from the Microsoft Store | Not configured or Enabled | Settings catalog, Microsoft App Store, Disable Store Originated Apps |
| Turn off Automatic Download and Install of updates | Not configured or Disabled | Settings catalog, Microsoft App Store, Allow apps from the Microsoft app store to auto update |
| Enable App Installer | Not configured or Enabled | Not built in, custom configuration profile |
| Enable App Installer Microsoft Store Source | Not configured or Enabled | Not built in, custom configuration profile |

The labels of the first two are easy to misread, so read the description in the portal before you change anything. In the thread, the administrator listed "Disable Store-originated apps" as **Disabled**. Learn's recommended values for that setting are Not configured or Enabled. I cannot tell from the thread whether this setting caused the failures, so treat it as a difference to check, not as a diagnosis.

## Step 4: Check the install context

Learn says that system context and user context are supported for UWP apps, and that a device enrolled by Microsoft Entra registration must use system context. It recommends not mixing install contexts when you deploy apps. For Win32 apps from the Store, each app supports either user or system context, based on its installer definition.

Two failure modes that Learn names:

- An app set to the **User** install behavior and assigned as **Available** gives "Requirements Not Met" in the Company Portal if the device is not joined to Azure. Join the device or use system context.
- If a Store Win32 app is **Required** but is not detected, because the installed version or context does not match, Intune reinstalls it in the target context.

## Step 5: Check the success-then-failed pattern

If your report shows error 0x87D1041C, Learn has an explanation. Assigning a UWP app of the "Microsoft Store app (new)" type, with system install behavior, to a device that already has that app produces "The application was not detected after installation completed successfully (0x87D1041C)." Learn adds that the app still installs correctly. This matches the thread's report of an app that is installed but flagged as failed, but the thread does not show the error code, so confirm it first.

## Step 6: Compare the physical devices with the Cloud PCs

The thread does not explain why Cloud PCs worked. Use Learn's requirements as a checklist for the physical devices:

- At least two processor cores.
- The Intune Management Extension is supported on the device.
- Access to both the Microsoft Store and the destination content.
- The app is available in the device's region. Learn says an app assigned to a device in an unsupported region does not install, and installs if the device moves to a supported region.
- The app is not a paid app. Learn says paid apps are not supported.

## Step 7: Decide what to do during Autopilot

The expert in the thread skips Store apps during the ESP and says only Win32 apps are listed there. Learn's ESP page says something different. For the device setup phase it lists per-machine LOB MSI apps, LOB store apps where the install context is device, Win32 apps, and WinGet apps. So Store apps can be tracked in the device phase, but a practical choice to install them after provisioning is still valid if they cause trouble. The administrator in the thread said the failures also happen on devices that are not in provisioning, so this will not fix everything.

## Verify

- On a pilot device with the block policy, confirm that a user cannot install a random app from the Store.
- Assign one Store app to the device and check that it installs.
- Check the app's install status in Intune after a day, to see if the status stays stable.

## Limits and open points

- The thread is unresolved. No reply was accepted, and the poster did not confirm any fix.
- Learn says the block policy does not affect Intune installs. The community reply says it may. I could not test it.
- Learn has no section on why some physical devices fail while Cloud PCs succeed.
- The page that I used for the Store policies was updated in June 2026. Check the live page, because Store policies change.

## Related

- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Windows Autopilot](https://www.m365.fm/entity/windows-autopilot/)
- [Enrollment Status Page](https://www.m365.fm/entity/enrollment-status-page/)

## Sources

- [Microsoft Learn: Add Microsoft Store apps to Microsoft Intune](https://learn.microsoft.com/en-us/intune/app-management/deployment/add-microsoft-store)
- [Microsoft Learn: Set up the Enrollment Status Page](https://learn.microsoft.com/en-us/intune/intune-service/enrollment/windows-enrollment-status)
- [Microsoft Q&A: Microsoft Store Apps Failing to Install via Intune on Autopilot Devices (January 2026)](https://learn.microsoft.com/en-us/answers/questions/5701698/microsoft-store-apps-failing-to-install-via-intune)
