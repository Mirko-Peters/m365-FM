---
title: "Azure Virtual Desktop Device Redirection Not Working: USB, WebAuthn and Clipboard Fixes"
summary: "When redirection fails in Azure Virtual Desktop, check the redirection method first. Covers USB redirection with usbdevicestoredirect, the three places it must be configured, WebAuthn redirection, and clipboard or resize failures after the SxS Network Stack update."
status: review
publish: false
author: mirko-p
date: 2027-01-16
topics: [azure-virtual-desktop, intune, entra-id]
keypoints:
  - "USB redirection with opaque low-level redirection must be configured on the session host, in the host pool RDP property and on the local Windows device; the most restrictive setting wins."
  - "The host pool RDP property is usbdevicestoredirect:s:<value>, and the default in the portal is Don't redirect any USB devices."
  - "Learn says to use high-level redirection whenever possible; low-level USB redirection is a fallback with no guaranteed performance or feature set."
  - "Clipboard and window resizing can fail after SxS Network Stack 1.0.2501.05600 or later if rdpclipcdv.exe and rdpinputcdv.exe are blocked by application control."
  - "WebAuthn redirection needs supported operating systems, WebAuthn redirection enabled, and the FIDO2 security key method enabled for the user in Entra ID."
faq:
  - q: "Why is my USB device not available in the remote session?"
    a: "Learn says USB redirection with opaque low-level redirection must be configured at three points for Azure Virtual Desktop: the session host, the host pool RDP property and the local device. If any one is wrong it will not work, and the most restrictive setting is the result. The device also needs its driver in the remote session."
  - q: "What is the default for the host pool setting?"
    a: "In the Azure portal, the USB device redirection option defaults to Don't redirect any USB devices. The RDP property is usbdevicestoredirect:s:<value>. A value of * redirects all peripherals that do not use high-level redirection."
  - q: "Do printers use USB redirection?"
    a: "Learn lists a printer, locally attached or network, as high-level peripheral reflection, not low-level USB redirection. The all-in-one printer or scanner is listed as opaque low-level redirection. The USB configuration article says it covers only devices that use opaque low-level redirection."
  - q: "Why do clipboard and window resizing stop working after an update?"
    a: "Learn says SxS Network Stack 1.0.2501.05600 and later added rdpclipcdv.exe and rdpinputcdv.exe. If application control such as AppLocker or antivirus allowlists blocks them, clipboard redirection and resizing fail. Allow-list the listed executables under C:\\Program Files\\Microsoft RDInfra."
  - q: "What if Windows Hello for Business is not offered in the session?"
    a: "Check supported operating systems, that WebAuthn redirection is enabled, and that the FIDO2 security key method is enabled for the user in Microsoft Entra ID. If the user signed in with a single-factor credential, they should sign out and use Sign-in options to choose Windows Hello or a security key."
---

Redirection problems in Azure Virtual Desktop usually trace back to one of three things: the redirection method does not match the device, a setting is missing at one of the places where it must be configured, or an application control policy blocks a component. Microsoft Learn gives specific guidance for USB redirection, WebAuthn redirection, and clipboard and window resizing after an SxS Network Stack update. This article follows three Learn pages. Printers appear here only through the redirection method table.

## Start with the redirection method

Learn explains that RDP uses two methods. **High-level redirection** intercepts and optimizes communication for a class of peripherals or an experience. **Opaque low-level redirection** carries the raw communication of a peripheral, mostly USB, and also serial and COM ports. Learn says to use high-level redirection wherever possible, because it gives the best performance and experience. Low-level redirection is a fallback, so its performance, reliability and feature set are not guaranteed by default.

Some examples from Learn's table of supported peripherals:

| Peripheral | Method |
| --- | --- |
| Camera, microphone, speaker, keyboard, mouse | High-level, peripheral reflection |
| Printer, locally attached or network | High-level, peripheral reflection |
| Clipboard | High-level, data sharing |
| Smart card reader, WebAuthN | High-level, peripheral reflection |
| All-in-one printer/scanner, serial/COM port, USB to serial adapter, VoIP phone or headset, biometric reader | Opaque low-level |

USB network adapters and USB displays are blocked from redirection, and Learn says some peripherals, such as encrypted USB storage, cannot be redirected.

## USB redirection with low-level redirection

For Azure Virtual Desktop, Learn says USB redirection must be configured at three points, and that if any is wrong it will not work as expected:

1. **The session host.** Enable Plug and Play redirection. In Intune, use a Settings catalog profile under **Administrative templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Device and Resource Redirection**, and set **Do not allow supported Plug and Play device redirection** to **Disabled**. In Group Policy the path is the same under Computer Configuration. Restart the session hosts afterwards. The default is that USB redirection is not allowed.
2. **The host pool RDP property.** In the Azure portal open the host pool, then **RDP Properties** > **Device redirection** and set **USB device redirection**. The default is **Don't redirect any USB devices**. The property is `usbdevicestoredirect:s:<value>`.
3. **The local Windows device.** Use Group Policy to enable **Allow RDP redirection of other supported RemoteFX USB devices from this computer** under **Remote Desktop Connection Client** > **RemoteFX USB Device Redirection**, with access rights **Administrators and Users**, then restart the device. Learn says the same setting in Intune does not currently work as expected, so Group Policy is required.

The most restrictive setting wins. USB redirection is available only from a local Windows device.

### The usbdevicestoredirect values

| Order | Value | Effect |
| --- | --- | --- |
| none | no value | Redirect no supported USB peripherals with low-level redirection |
| 1 | `*` | Redirect all peripherals not using high-level redirection |
| 2 | `{<DeviceClassGUID>}` | Redirect all peripherals in that device setup class |
| 3 | `<USBInstanceID>` | Redirect one device by instance path |
| 4 | `<-USBInstanceID>` | Do not redirect that device |

In host pool properties, Learn says the characters `\`, `:` and `;` must be escaped with a backslash, so an instance path is entered like `USB\\VID_045E&PID_0779\\5&21F6DCD1&0&5`. A device instance path is tied to the port, so the device is redirected only on the same port. Find instance IDs in Device Manager or with `Get-PnpDevice`.

### Checks when a USB device still does not show up

- The driver must be installed in the remote session. Learn says drivers install the same way as on a physical computer, so Windows Update should be enabled in the session or drivers should be available.
- Low-level redirection is designed for LAN connections under 20 ms latency, so some devices can fail at higher latency.
- A device cannot be used locally while redirected, and only in one remote session at a time.
- To check in the session, run `Get-PnPDevice | Where-Object {$_.InstanceId -like "*TSUSB*" -and $_.Present -eq "true"} | FT -AutoSize` and look for Error in the status.
- For USB audio with low-level redirection, the audio output location must be set to play sounds on the local computer.
- Teams and multimedia redirection have their own optimizations, independent of this configuration.

## WebAuthn redirection

If WebAuthn requests are not redirected to the local PC, Learn asks whether you use supported operating systems for in-session passwordless authentication on both the local PC and the session host, and whether WebAuthn redirection is enabled as a device redirection. If both are yes but Windows Hello for Business or security keys still do not appear for Entra resources, enable the FIDO2 security key method for the user in Microsoft Entra ID.

If a user signed in to the session host with a single-factor credential and then needs MFA for an Entra resource, Windows Hello for Business might not work. The user should sign out if not prompted for an account, select **Use another account** on the account selection page, choose **Sign-in options**, and then **Sign in with Windows Hello or a security key**.

## Clipboard and window resizing after an SxS Network Stack update

Learn describes this for SxS Network Stack version 1.0.2501.05600 and later. The symptoms: clipboard redirection fails, the remote window cannot be resized, and the issues begin after the update in environments with restrictive application control. The cause is two new executables, `rdpclipcdv.exe` and `rdpinputcdv.exe`, which handle clipboard and window resizing. If blocked, those functions fail to initialize. This affects Software Restriction Policies, AppLocker and third-party endpoint protection.

The fix is to allow these executables when run from subfolders of `C:\Program Files\Microsoft RDInfra`: rdpinit.exe, rdpshell.exe, rdpstartup.exe, rdpstartuplauncher.exe, rdpvchost.exe, rdpclipcdv.exe and rdpinputcdv.exe.

## A working order

This section is my advice, not a Microsoft statement.

1. Name the device class, then look up its method in Learn's table. That tells you which page and setting apply.
2. For USB, check all three configuration points before touching drivers.
3. Test with the wildcard value `*` on a test host pool first, then narrow to class GUIDs or instance paths.
4. For clipboard or resize problems, check what changed in application control policies around the time the agent stack updated.
5. Record the exact RDP property string you set, since escaping errors are easy to make.

## Related

- [Azure Virtual Desktop](https://www.m365.fm/entity/azure-virtual-desktop/)
- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)

## Sources

- [Device redirections in Azure Virtual Desktop - Azure Virtual Desktop (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/azure/virtual-desktop/troubleshoot-device-redirections)
- [Peripheral and resource redirection over the Remote Desktop Protocol - Azure Virtual Desktop (Microsoft Learn)](https://learn.microsoft.com/azure/virtual-desktop/redirection-remote-desktop-protocol)
- [Configure USB redirection on Windows over the Remote Desktop Protocol - Azure Virtual Desktop (Microsoft Learn)](https://learn.microsoft.com/azure/virtual-desktop/redirection-configure-usb)
