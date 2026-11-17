---
title: "Display Protection in Azure Virtual Desktop explained"
summary: "Display Protection uses Microsoft PlayReady to encrypt the video of a remote session and helps protect it from screen capture malware on the user's Windows device. Learn's what's new lists it as public preview; it has strict client requirements and does not stop photographs of the screen or intentional disclosure."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-display-protection, azure-virtual-desktop]
keypoints:
  - "Display Protection helps protect session video from screen capture malware on the endpoint that runs Windows App. It encrypts the video with Microsoft PlayReady and uses hardware DRM (SL3000) or software DRM (SL2000), depending on the configured level."
  - "It supports only Windows App on a physical Windows 11 device, version 2.0.1236.0 or newer. VMs as endpoints, macOS, iOS, Android, web browsers and Windows 365 Link devices are not supported."
  - "Learn's what's new lists it as Public Preview from September 2026. Display output is limited to 4K (3840 x 2160); 5K monitors are not supported."
  - "It does not enforce HDCP, does not authenticate external displays or capture devices, and does not prevent photographing the screen or intentional disclosure."
  - "It is separate from screen capture protection, watermarking and input protection. Each is configured on its own and covers a different risk."
faq:
  - q: "Is Display Protection the same as screen capture protection?"
    a: "No. Microsoft Learn presents them as separate features. Screen capture protection blocks capture through standard operating system features and APIs, is configured with Intune or Group Policy, and Learn says it is not a substitute for DRM solutions. Display Protection uses PlayReady DRM and is set per host pool with an RDP property."
  - q: "Which devices can connect to a host pool that requires Display Protection?"
    a: "Learn lists Windows App on Windows, running on a physical Windows 11 device with version 2.0.1236.0 or newer, as the only supported client. VMs as endpoints, macOS, iOS, Android, web browsers and Windows 365 Link devices are listed as not supported."
  - q: "Does Display Protection stop someone from photographing the screen?"
    a: "No. Learn says the feature is meant to protect against malware on the device running Windows App. It does not prevent someone from photographing the screen, does not authenticate external displays or capture devices, and does not currently enforce HDCP."
---

Display Protection is a feature of [Azure Virtual Desktop](/entity/azure-virtual-desktop/) that uses Microsoft PlayReady to encrypt the video of a remote session and, in Learn's words, helps protect that video from screen capture malware on the user's local Windows device. It works only with Windows App on a physical Windows 11 endpoint, and Microsoft's what's new page lists it as a public preview feature. This article explains what it protects, how its two enforcement modes work, which clients and limits apply, and how it differs from screen capture protection and watermarking.

## Status: public preview

Microsoft Learn's [What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new) lists "Display Protection for Azure Virtual Desktop (Public Preview)" in the September 2026 section. The entry says administrators can configure the required level of display protection for their host pools in the Azure portal. The Windows App release notes also describe it as available in public preview (entry of 24 August 2026) and name Windows App on Windows version 2.0.1236.0 or later as the requirement. The Learn page [Display Protection for Windows 365 and Azure Virtual Desktop](https://learn.microsoft.com/en-us/windows-365/enterprise/display-protection) was last updated on 13 November 2026. It carries no preview label for Display Protection itself; it marks only input protection and Cloud PC monitoring as preview. Because the what's new entry and the feature page differ in labelling, confirm the current status before you plan a production rollout.

The feature is documented for both [Windows 365](/entity/windows-365/) Cloud PCs and Azure Virtual Desktop session hosts. This article covers the Azure Virtual Desktop side.

## The problem it addresses

Learn's overview of [Input and Output Protection](https://learn.microsoft.com/en-us/windows-365/enterprise/windows-cloud-io-protection) (last updated 9 September 2026) describes a gap. Session encryption and multifactor authentication protect against network interception and unauthorized access, but not against threats that already run on the endpoint, such as keylogger malware and screen capture malware that records the rendered output. Display Protection addresses the second case. The same page says the feature set "isn't antivirus software": it does not detect or remove malware, it secures the display channel.

Input and Output Protection has two components that are configured independently:

- **Input protection** routes keystrokes from a kernel-level driver on the endpoint to the session host. It needs an MSI installed on the endpoint, and connections from endpoints without it are blocked. Learn labels it public preview.
- **Display protection**, a component of output protection, covers what the user sees. It needs an updated Windows App and no MSI.

## How it works

According to the current Learn page, Display Protection uses Microsoft PlayReady to encrypt the remote-session video and to protect its decryption on the endpoint. Depending on the configured level and the endpoint's capabilities, it uses one of two kinds of digital rights management (DRM):

- **Hardware DRM (SL3000)**: hardware-backed PlayReady protection that needs a compatible GPU on the endpoint, either discrete or integrated.
- **Software DRM (SL2000)**: software-based PlayReady protection, used only when the configured level permits a fallback.

The session host does not need a GPU: Learn says Display Protection doesn't require a GPU-enabled Cloud PC, and that hardware protection depends on the GPU of the endpoint. Our reading: the feature concerns the video path to the client, not graphics performance on the host; what's new describes it as securing the display path between the session host and supported endpoint devices. Protection applies to remote-session video, not to other applications running locally on the endpoint. Managed and unmanaged (bring-your-own-device) endpoints are both supported, as long as they meet the client requirements.

## The three levels

The level is set by one value per host pool:

| Value | Level | Behavior |
|---|---|---|
| 0 | Not configured | Display Protection is not enabled. |
| 1 | Hardware or software enforcement | Uses hardware DRM (SL3000) when available. If the endpoint cannot provide it, software DRM (SL2000) is allowed. |
| 2 | Hardware enforcement required | Requires SL3000. If the endpoint cannot provide it, the connection is blocked and the user sees an error. There is no software fallback. |

The trade-off is plain. Level 1 keeps more endpoints able to connect. In our reading, a software fallback (SL2000) is a weaker guarantee than hardware DRM (SL3000), though Learn does not rank them in those words. Level 2 requires hardware DRM and blocks every endpoint that cannot meet it. Learn also says software DRM can increase the time needed to establish a session. Which level fits which pool is a separate decision; the companion article on choosing a Display Protection level per host pool works through it.

## Where you configure it

For Azure Virtual Desktop the level is an RDP property on the [host pool](/entity/avd-host-pool/). In the Azure portal you open the host pool, select **RDP properties**, open the **Advanced** tab and add the property:

`enableWindowsCloudIODisplayProtection:i:<value>`

with the value 0, 1 or 2. Learn says this property enables server-side verification that Display Protection is enforced on the endpoint. The setting reaches the endpoint through the connection properties and is cached there. Selecting **Refresh** in Windows App applies a change immediately; otherwise a change can take up to 8 hours. For Windows 365 the equivalent setting sits under **IO Protection** in the Microsoft Intune admin center. The supported RDP properties reference page of Learn (last updated 11 August 2026) does not list this property, so use the Display Protection page as the source for the name and values.

## Client requirements

| Requirement | Detail (from Learn) |
|---|---|
| Client | [Windows App](/entity/windows-app/) on Windows, the only supported client |
| Windows App version | 2.0.1236.0 or newer, updated from the Microsoft Store |
| Endpoint | A physical Windows 11 device |
| Session host | A supported Windows client operating system or Windows Server |
| Hardware DRM | A compatible GPU on the endpoint, discrete or integrated |

Not supported: virtual endpoint devices, macOS, iOS, Android, web browsers, other clients than Windows App on Windows, and Windows 365 Link devices. Learn does not say how an unsupported client behaves at level 1, so test every client class that your users own before you set the property on a shared pool. The Windows App release notes also record a fix, in version 2.0.1315.0, for an issue where Display Protection was initialized for all connections regardless of the admin policy setting, so keep the client current.

## What it does not do

The Learn page has a section on protection boundaries. It says the feature is designed to help protect against malware on the device running Windows App, not to prevent a user from intentionally disclosing content they can view. It also says Display Protection:

- does not authenticate external displays or capture devices,
- does not guarantee that external capture hardware cannot record the output,
- does not prevent someone from photographing the screen,
- does not currently enforce HDCP, including at level 2, and non-HDCP equipment is not automatically rejected.

Learn adds that a successful hardware DRM connection is not proof that the external display path is protected. Other limits: resolutions up to 4K (3840 x 2160) are supported and 5K monitors are not, and the capture test Learn describes evaluates only the endpoint, it does not validate HDCP or external capture devices. On external displays, docks and adapters, Learn says HDCP support alone does not determine whether an endpoint meets the configured PlayReady protection level, and that you should not assume Display Protection blocks a non-HDCP monitor, a DisplayLink dock or a USB display adapter. It says to validate the endpoint and display setup against your selected protection level, and that this does not establish protection against external capture devices. Learn also says HDCP enforcement for external display connections is planned as a separate configuration option in a future update and is not available in the current release.

## How it differs from related features

Learn describes several controls that each cover a different risk. They are configured separately and can be combined.

| Feature | What it addresses | How it works (per Learn) | Configured with |
|---|---|---|---|
| Display Protection | Screen capture malware on the Windows endpoint | PlayReady encryption of session video, hardware or software DRM | Host pool RDP property |
| [Screen capture protection](/entity/avd-screen-capture-protection/) | Screenshots and screen sharing on clients | Blocks capture through standard OS features and APIs; Learn says it is not a substitute for DRM solutions | Intune or Group Policy on the session hosts for native clients; Learn describes other patterns for web and mobile endpoints |
| [Watermarking](/entity/avd-watermarking/) | Photographs of the screen, and tracing a leak | QR code containing the Connection ID or Device ID | Intune or Group Policy on the session hosts |
| Input protection | Keylogger malware | Kernel-level driver on the endpoint; MSI required | Host pool RDP property plus MSI on the endpoint |

Screen capture protection has a wider client list than Display Protection: its Learn page lists Windows App on Windows, macOS, iOS, iPadOS and Android, among others, with minimum versions for some. Display Protection is limited to physical Windows 11 devices. A deployment that needs controls on phones, Macs and browsers therefore cannot rely on Display Protection alone. The screen capture protection page also recommends pairing it with watermarking and with disabling clipboard, drive and printer redirection where that fits your risk model.

## Checking that it works

Learn's validation steps are short. From a physical Windows 11 endpoint with Windows App 2.0.1236.0 or newer, connect to a session host in a pool where Display Protection is enabled, confirm that the connection succeeds without an error, then try a screen capture tool during the session. The remote content should be blocked or blank. For tenant-wide monitoring Learn points to Cloud PC monitoring (preview) in the Intune admin center, under **Reports** > **Cloud PC monitoring (preview)** > **Connection health**, where the `DisplayProtectionState` connection event shows whether protection was negotiated. Learn notes that event names and values might change before general availability. Learn describes the report as tenant-wide monitoring for both Windows 365 and Azure Virtual Desktop; verify in your own tenant that connections to your Azure Virtual Desktop pools appear.

## When it fits

Display Protection suits pools where you control the endpoints, or can require a physical Windows 11 device and a current Windows App, and where capture malware on the client is a realistic concern. Learn's Input and Output Protection overview names financial records, health data and confidential information, and bring-your-own-device scenarios. It is a poor fit where users connect from browsers, Macs or mobile devices, where the displays are 5K, or where you need protection against cameras. Learn presents it as one layer next to controls such as session encryption, multifactor authentication and Conditional Access; screen capture protection and endpoint management are covered on other Learn pages.

## Sources

Retrieved on 17 November 2026.

- [Microsoft Learn: Display Protection for Windows 365 and Azure Virtual Desktop](https://learn.microsoft.com/en-us/windows-365/enterprise/display-protection)
- [Microsoft Learn: Input and Output Protection for Windows 365 and Azure Virtual Desktop](https://learn.microsoft.com/en-us/windows-365/enterprise/windows-cloud-io-protection)
- [Microsoft Learn: Windows Cloud Input Protection](https://learn.microsoft.com/en-us/windows-365/enterprise/windows-cloud-input-protection)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Microsoft Learn: What's new in Windows App](https://learn.microsoft.com/en-us/windows-app/whats-new?tabs=windows)
- [Microsoft Learn: Enable screen capture protection in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/screen-capture-protection)
- [Microsoft Learn: Watermarking in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/watermarking)
- [Microsoft Learn: Supported RDP properties with Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/rdp-properties)
