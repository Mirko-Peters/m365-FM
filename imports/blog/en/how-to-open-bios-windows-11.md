---
title: "How to Open BIOS in Windows 11 (UEFI Firmware Settings)"
summary: "How to open BIOS in Windows 11: use Settings and Advanced startup, the boot key at power-on or Surface buttons, and what to do if Windows won't start."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [windows-autopilot]
keypoints:
  - "The most reliable way to open the BIOS in Windows 11 is Settings, System, Recovery, Advanced startup, Restart now, then Troubleshoot, Advanced options, UEFI Firmware Settings."
  - "Modern PCs use UEFI firmware, which many people still call the BIOS. The menus look different on every manufacturer's PC."
  - "At power-on, boot menu keys are commonly F2, F12, Delete or Esc, but the exact key depends on the maker. A Surface opens its UEFI with volume-up and power."
  - "If Windows won't start, interrupting startup twice brings up the recovery environment on the third start, where UEFI Firmware Settings is available."
  - "Change only the settings you came for. Wrong firmware settings can affect security or stop the PC from starting."
faq:
  - q: "What key opens the BIOS on Windows 11?"
    a: "It depends on the manufacturer. Microsoft names F2, F12, Delete and Esc as common keys for the boot menu, and its manufacturer guide mentions F10 as well. Press the key right after power-on. If you miss the moment or don't know the key, use Settings, System, Recovery, Advanced startup instead. That works on any Windows 11 PC that starts."
  - q: "Is UEFI the same as BIOS?"
    a: "In daily talk, yes. Microsoft describes UEFI as the firmware that runs before Windows and says it is sometimes called BIOS. UEFI replaced the older BIOS design. Windows 11 requires UEFI firmware that is Secure Boot capable, so on a Windows 11 PC the thing you open is almost always UEFI."
  - q: "How do I open the BIOS on a Surface?"
    a: "Shut the Surface down and wait about 10 seconds. Hold the volume-up button, press and release the power button, and keep holding volume-up through the logo until the UEFI screen appears. Or open Settings, System, Recovery, choose Restart now next to Advanced startup, then Troubleshoot, Advanced options, UEFI Firmware Settings and Restart."
---
To open the BIOS in Windows 11, go to **Settings**, **System**, **Recovery**, select **Restart now** next to **Advanced startup**, then choose **Troubleshoot**, **Advanced options**, **UEFI Firmware Settings** and **Restart**. The PC reboots straight into its firmware setup. That's the route Microsoft documents, and it saves you from guessing a function key. This article is for Windows users and IT admins who need firmware settings to change the boot order, check Secure Boot or enable a TPM. It also covers the key-at-power-on method, Surface devices and the case where Windows no longer starts.

## BIOS or UEFI: what are you actually opening?

On a Windows 11 PC you are opening UEFI, even if everybody calls it the BIOS. Microsoft's page on [Secure Boot in Windows 11](https://support.microsoft.com/en-us/windows/security/devicesecurity/windows-11-and-secure-boot) describes it this way: the firmware (UEFI, sometimes called BIOS) runs before Windows and controls the Secure Boot setting. Windows 11 also requires UEFI firmware that is Secure Boot capable, so a legacy-only BIOS is not a Windows 11 target.

The look of the setup screen is the manufacturer's choice. Menus and setting names vary by maker and model, which is why Microsoft sends you to the manufacturer's guide for anything beyond the common settings. You might see a graphical screen with mouse support or a plain text menu you navigate with the arrow keys.

## The reliable way: open it from Windows

This works on any Windows 11 PC that still starts, and it needs no key timing. Save your work first, because the PC restarts.

1. Open **Settings**, then **System**, then **Recovery**.
2. Next to **Advanced startup**, select **Restart now**.
3. On the **Choose an option** screen, select **Troubleshoot**.
4. Select **Advanced options**, then **UEFI Firmware Settings**.
5. Select **Restart**. The PC boots into the firmware setup.

You can also reach the same menu with a shortcut. Microsoft's [Windows recovery environment](https://support.microsoft.com/en-us/windows/experience/backup-recovery/windows-recovery-environment) page says you can hold **Shift** while you select **Power**, then **Restart**. You land on the same blue menu, and the next steps are identical.

If you don't see **UEFI Firmware Settings** on that menu, don't spend long hunting for it. Use the power-on key for your model or the manufacturer's support page for the exact method.

## The key at power-on

Before Windows loads, most PCs show a brief logo or message that names a key. Press it repeatedly right after you power on. Which key it is depends on the maker. Microsoft's download page for Windows 11 names F2, F12, Delete and Esc as common keys for opening the boot menu, and Microsoft Learn's USB install article gives Esc, F10 and F12 as examples. These keys are mostly for the one-time boot menu, where you choose a device to start from. The key for the full setup screen is often a different one, and it's printed on the first screen or in the manual. If you have the model name, a search for "<model> BIOS key" on the manufacturer's support site settles it.

If the key doesn't work after a couple of tries, stop guessing and use the Settings route above. It doesn't depend on timing.

### Surface devices

Microsoft's page [How to use Surface UEFI](https://support.microsoft.com/en-us/surface/drivers-firmware/how-to-use-surface-uefi) gives the button method:

1. Shut the Surface down and wait about 10 seconds to make sure it's off.
2. Press and hold the **volume-up** button. While holding it, press and release the **power** button.
3. When the Microsoft or Surface logo appears, keep holding volume-up. Release it when the UEFI screen appears.

The page lists these menus: PC information, Security, Boot configuration, Date and time, About and Exit. Security is where you set a UEFI password and turn Secure Boot on or off. On enterprise devices, boot configuration settings may be locked, and the page tells you to contact the IT administrator in that case. Select **Exit**, then **Restart now** to save changes and restart.

One warning from that page is worth repeating. You can't reset a Surface UEFI password, and Microsoft can't retrieve it. If you set one, write it down somewhere safe.

## When Windows won't start

If Windows no longer boots, you can't use Settings, but you can still reach the firmware. Microsoft's recovery environment page says that if Windows fails to start correctly several times, it enters the recovery environment on its own. You can also force it. Turn on the PC and, when the Windows or manufacturer logo appears, hold the power button to shut it down. Repeat this once more. On the third start, Windows should show the **Automatic Repair** screen. Select **Advanced options**, and you reach the same menu as before, including **UEFI Firmware Settings**.

If that doesn't work, create installation media on a working PC with the Media Creation Tool, boot from it and select **Repair my PC**, then **Next** to reach the recovery environment. The tools listed there include Startup Repair, Uninstall Updates, System Restore, Reset this PC and UEFI Firmware Settings. If the drive is encrypted, some of them ask for your BitLocker recovery key, so find it before you need it.

## What to do once you're inside

Most visits to the firmware have one of four goals.

- Change the boot order or pick a one-time boot device, for example to install from a USB stick.
- Check or change Secure Boot. Microsoft says that to enable Secure Boot you switch the boot mode from Legacy (also called CSM) to UEFI, and that if the firmware offers both, UEFI should be the first or only option.
- Enable the TPM. Microsoft's page on enabling TPM 2.0 says to look in a submenu labeled Advanced, Security or Trusted Computing. The option may be called Security Device or Security Device Support, TPM State, AMD fTPM or Intel PTT.
- Set a firmware password, if your policy asks for one.

Microsoft's advice for all of this is the same: change only the settings your manufacturer describes. The Secure Boot enablement guide warns that changing firmware settings incorrectly can affect your PC's security or prevent it from starting properly. Take a photo of the screen before you change anything, so you can put it back.

For admins preparing devices for deployment, firmware is where TPM problems show up. Microsoft's page for [Windows Autopilot](https://www.m365.fm/entity/windows-autopilot/) self-deploying mode requires TPM 2.0 and TPM device attestation, and a device without TPM 2.0 can't use that mode. If a PC fails there, a look at its firmware settings is a sensible first check.

## A note on Secure Boot certificates

Admins who open the firmware these days often do so because of Secure Boot. Microsoft's Secure Boot page explains that the Secure Boot certificates first issued in 2011 begin expiring in June 2026, and that Microsoft is updating them. On supported Windows versions this update happens automatically, and the page links to separate guidance on the Microsoft-managed update. Microsoft's Surface UEFI page carries the same notice.

What does that mean for your visit to the firmware? Mostly that you don't need to change anything by hand just because of the date. If Secure Boot is on and the device is on a supported Windows version, the certificate update is meant to arrive through Windows. If a device has Secure Boot switched off, check why before you switch it on, because someone may have turned it off to boot something specific. The page also says you may need to turn Secure Boot off temporarily to fix a problem and that you should turn it back on once the issue is resolved.

On managed devices, don't be surprised if firmware options are locked or protected by a password that IT holds. That is normal for enterprise devices, and the right move is to ask your administrator instead of looking for a way around it.

## Common mistakes

- Pressing the key too late. Press it repeatedly from the moment you power on, not once after the logo.
- Hammering keys without knowing which one the maker uses. Look it up for the model, or use the Settings route.
- Changing settings you don't understand. Change one thing, save and test.
- Forgetting to leave the boot order alone. After a USB install, put the internal drive first again.
- Setting a UEFI password and not writing it down. On a Surface, nobody can recover it.
- Assuming your colleague's PC has the same menus. Names and layouts differ by manufacturer.

## Related topics to explore

- How do I check whether Secure Boot is on? That is a short check in Windows, and the article on how to enable Secure Boot in Windows 11 covers it with the firmware steps.
- How do I boot from a USB stick? Build the drive first, then open the boot menu. See the article on a Windows 11 bootable USB.
- What if I only need to repair startup? Startup Repair in the recovery environment fixes certain startup problems without a reinstall.
- Where is the TPM setting? Usually in a submenu called Advanced, Security or Trusted Computing, and the name depends on the maker.

## Next step

Open the firmware once on a PC that works, using the Settings route, and note where the boot order, Secure Boot and TPM entries are. Then, the day you have to open the BIOS in Windows 11 on a machine that is giving you trouble, you know exactly where to look.
