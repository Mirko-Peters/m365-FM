---
title: "Audio Renderer Error in Windows 11: How to Fix It"
summary: "Fix the audio renderer error in Windows 11, the YouTube message to restart your computer: replug the device, restart audio services, update the audio driver."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [windows-update-for-business]
keypoints:
  - "The message appears in a browser, most often on YouTube. Microsoft doesn't document it, so the fixes come from its general audio guides and community reports."
  - "The quickest fixes are to unplug and replug the headphones or the USB audio device and to restart the Windows Audio and Windows Audio Endpoint Builder services."
  - "Check the output device and the Volume mixer: an app can play to a different device than the one you are listening to."
  - "Update the audio driver in Device Manager, or use Roll Back Driver if the problem started after an update."
  - "If a Windows update broke audio on many PCs, admins can pause the update with Windows Update client policies for up to 35 days."
faq:
  - q: "What does 'Audio renderer error. Please restart your computer' mean?"
    a: "It's a browser message, most often seen on YouTube, that says the browser can't play sound through the audio device. Microsoft doesn't document it. In practice it points to the Windows audio layer: the device, the driver or the Windows Audio service. A reboot sometimes clears it, but it often comes back if the cause is a driver."
  - q: "Do I really have to restart my computer?"
    a: "Not always. Unplug and replug your headphones or USB audio device, then restart the Windows Audio and Windows Audio Endpoint Builder services from services.msc. Community answers on Microsoft Q&A report that both worked for some people. If the error returns, update the audio driver or roll it back if it began after an update."
  - q: "How do I restart the Windows Audio service?"
    a: "Press Start, type services.msc and press Enter. Right-click Windows Audio and select Restart, then do the same for Windows Audio Endpoint Builder. Microsoft's general audio guide also lists Remote Procedure Call (RPC) among the services to restart, but be careful with that one, because many other things depend on it. Then test the audio again."
---
The audio renderer error is the browser message "Audio renderer error. Please restart your computer." that appears when sound can't be played, usually on YouTube. To fix it in Windows 11, unplug and replug the headphones or USB audio device, restart the **Windows Audio** and **Windows Audio Endpoint Builder** services, check the output device in the volume mixer and update the audio driver. This article is for Windows users and help desk staff who want to avoid the full reboot. It goes from the quick checks to the driver fixes, and says clearly what Microsoft documents and what comes from user reports.

## What the audio renderer error is

Microsoft doesn't have a support page for this message. It shows up in the Microsoft Q&A forum in long threads, with people reporting it in Chrome and in Microsoft Edge, mostly on YouTube. So what follows is a mix: Microsoft's own audio troubleshooting guides, which cover the same layers of Windows, and the fixes users in those threads say worked.

The message means the browser's media player couldn't get a working path to the sound device. That path runs through the audio device, its driver and the Windows audio services. The threads show no single confirmed cause. Posters name a driver problem after an upgrade, a recent app launch, an ad blocker and, in several cases, no trigger at all. Treat any one theory with suspicion, and work through the layers instead.

## Quick fixes to try first

Start with what takes under a minute.

1. Unplug and replug your headphones, or move a USB audio device to another port. In the Q&A thread, a user reported that replugging headphones cleared the problem, and many people marked the answer as helpful. Microsoft's general audio guide gives a similar hint: try a different USB port, and unplug the headphones if your speakers aren't working while they're connected.
2. Reload the page. If sound is back, you can move on. If the error returns every few minutes, keep reading.
3. Play something else, like a local file or another site. If only one site fails, the problem is likely in the browser and not in Windows.
4. Restart the browser completely, not just the tab.

If the error comes back, move to the Windows audio layer.

## Work out which layer is broken

Before you change anything, spend two minutes on a short test. Play a system sound or a local audio file. If that works while the browser fails, the problem sits between the browser and the audio device, so the volume mixer, the output device setting and the audio services are your first stops. If nothing plays anywhere, look at the device and the driver. If the error appears only after the PC has been asleep or after you docked a laptop, write that down too. Keeping these notes makes the next case faster, since you'll know which of the steps below fixed it.

## Check the output device and the volume mixer

An app can send sound to a device other than the one you're listening on. Microsoft's guide on [app audio not working while system sounds work](https://support.microsoft.com/en-US/Windows/Hardware/Audio/fix-app-audio-not-working-while-system-sounds-work-in-windows) covers this.

1. Go to **Start**, **Settings**, **System**, **Sound**, then open **Volume mixer**.
2. Under **Apps**, make sure the browser isn't muted and its slider is up.
3. On the same page, check the **Output device** for the browser and choose the right one.

Then check the default device. In **Settings**, **System**, **Sound**, under **Output**, select the device you want to use. Microsoft notes that for devices connected by USB or HDMI this step is often required, and that you should make sure an external monitor without speakers isn't the default output.

If none of that helps, turn off audio enhancements. In the same Sound settings, select your output device, scroll to **Advanced settings** and set **Audio enhancements** to **Off**. Then test again. Microsoft's guide doesn't cover Exclusive mode, so I'm not giving steps for it here.

## Restart the Windows audio services

Microsoft documents the service restart in several audio guides, and a user in the Q&A thread says restarting the audio service fixed the error.

1. Press **Start**, type `services.msc` and press Enter.
2. Right-click **Windows Audio** and select **Restart**.
3. Right-click **Windows Audio Endpoint Builder** and select **Restart**.
4. Test the audio.

Microsoft's general sound guide also lists **Remote Procedure Call (RPC)** among the services to restart. I would not restart RPC on a working PC unless you've run out of other options, because many other Windows components depend on it, and a restart of the PC does the same job more safely.

For a faster path to the same thing, the Q&A user suggests opening Task Manager, going to the Services tab, right-clicking Audiosrv and choosing Restart.

## Update, reinstall or roll back the audio driver

Drivers are the most common suspect, especially when the error began after an upgrade or an update. Microsoft's page on [audio that stops working after a Windows update](https://support.microsoft.com/en-us/windows/fix-audio-stops-working-after-a-windows-update-in-windows-b0dadfe1-051e-4e3f-a971-486ab4f7e6d6) gives this order:

1. Install pending updates. Go to **Settings**, **Windows Update**, select **Check for updates**, install everything and restart.
2. Update the audio driver. Open Device Manager, expand **Sound, video and game controllers**, right-click your audio device, select **Update driver** and follow the prompts. Restart afterward.
3. Roll back the driver if the problem started after a recent update. In Device Manager, right-click the audio device, select **Properties**, open the **Driver** tab and select **Roll Back Driver**. The button appears only if a previous driver version exists.
4. Restart the Windows audio services as shown above.

Microsoft's general guide adds two more options. You can uninstall and reinstall the driver: right-click the device, select **Uninstall device**, tick **Attempt to remove the driver for this device**, select **Uninstall** and restart, and Windows reinstalls the driver on startup. Or you can pick the generic audio driver: **Update driver**, **Browse my computer for drivers**, **Let me pick from a list of available drivers on my computer**, then choose the generic one.

Also try the PC maker's own driver, downloaded from the maker's support page, if Windows Update doesn't offer a newer one. A forum answer made the same suggestion.

## Run the troubleshooter

Microsoft's guide starts with the Get Help audio troubleshooter. Open the Get Help app and run the automated audio troubleshooter. A Q&A user also suggests the Playing Audio troubleshooter and a restart afterward. It won't always find the issue, but it costs nothing and sometimes restarts the right services for you.

## For admins: when an update breaks audio on many PCs

If several PCs lose audio after the same update, treat it as an update problem and not as a user problem. Use the driver rollback above for individual machines. To stop the spread, Microsoft's page on Windows Update client policies, formerly Windows Update for Business, says an admin can pause an update for up to 35 days from a chosen start date, which stops other devices from installing it. [Windows Update for Business](https://www.m365.fm/entity/windows-update-for-business/) policies also let you defer quality updates by up to 30 days, so you can test on a pilot group first. They're configured through Group Policy or MDM such as Intune.

## Common mistakes

- Restarting only the browser tab, again and again, when the audio device is the problem.
- Updating the driver without trying a rollback when the error began right after an update.
- Restarting RPC when the two audio services would have done the job.
- Leaving a monitor without speakers as the default output device.
- Treating a single forum report as a fix. Replugging worked for some users and not for others.

## Related topics to explore

- What if there is no sound at all? Microsoft's guide on fixing sound problems starts with the Get Help troubleshooter and checks the speakers, volume and device in Device Manager.
- Why does sound work in system sounds but not in my app? The volume mixer and per-app output device are the first things to check.
- How do I see what changed? Windows Update history and Device Manager show recent driver updates, which helps with rollbacks.
- How do I keep updates from surprising users? Deferrals and pauses are covered by Windows Update client policies.

## Next step

Unplug and replug the device, restart the two Windows audio services and check the browser's output device in the volume mixer. If the audio renderer error in Windows 11 still comes back, update or roll back the audio driver and note which change fixed it, so you can repeat it on the next PC.
