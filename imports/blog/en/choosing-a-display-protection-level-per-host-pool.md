---
title: "Choosing a Display Protection level per host pool"
summary: "Pick level 0, 1 or 2 per host pool by asking which endpoints connect to it and what you do when an endpoint cannot meet the level. Level 1 allows a software fallback, level 2 blocks every endpoint without hardware DRM, and the setting applies to the whole pool."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-display-protection, azure-virtual-desktop]
keypoints:
  - "The level is one RDP property on the host pool: enableWindowsCloudIODisplayProtection:i:0, 1 or 2. Learn sets the value on the host pool, so we read it as applying to every user of the pool; pools with different endpoint classes then need separate pools."
  - "Level 1 uses hardware DRM (SL3000) when available and allows software DRM (SL2000) as a fallback. Level 2 requires SL3000 and blocks the connection if the endpoint cannot provide it."
  - "Learn's what's new lists Display Protection as Public Preview in its September 2026 section; it works only with Windows App 2.0.1236.0 or newer on a physical Windows 11 device."
  - "A change can take up to 8 hours to reach an endpoint. Selecting Refresh in Windows App applies it immediately, so pilot with a small group first."
  - "HDCP is not enforced at any level, so a docks-and-adapters check is part of the pilot rather than something the level decides for you."
faq:
  - q: "Which level should a host pool start with?"
    a: "Start with level 1 on a pilot pool if the goal is to learn which endpoints qualify, because it permits a software DRM fallback. Move to level 2 only for pools where every endpoint is a managed physical Windows 11 device with a compatible GPU, since level 2 blocks any endpoint that cannot provide hardware DRM. This is our reading of the Learn level descriptions, not a Microsoft rule."
  - q: "Can two users of the same host pool have different levels?"
    a: "Learn sets the level as an RDP property on the host pool, so we read it as applying to every user of that pool. If two groups need different levels, use two host pools. Learn does not describe a per-user override."
  - q: "How do I switch Display Protection off again for a pool?"
    a: "Learn defines value 0 as not configured, meaning Display Protection is not enabled. Set the property to 0 on the host pool and save. Learn says changes reach endpoints through the connection properties and can take up to 8 hours, or immediately after a Refresh in Windows App."
---

Choose the Display Protection level by looking at the endpoints that connect to the host pool: level 0 where it is not needed, level 1 where capable devices should be protected but others must still connect, and level 2 only where every connecting device is a physical Windows 11 PC that can provide hardware DRM. The level is a single RDP property on the [host pool](/entity/avd-host-pool/), so the decision is one value per pool. This guide covers the decision, the steps to set and test it, and the problems an administrator should expect.

The feature itself is explained in the article on Display Protection in Azure Virtual Desktop. In short: it uses Microsoft PlayReady to encrypt the session video and, in Learn's words, helps protect it from screen capture malware on the user's local Windows device. [Display Protection](/entity/avd-display-protection/) is listed as Public Preview in the September 2026 section of Learn's [What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new). The Learn page on the feature (updated 13 November 2026) carries no preview label for Display Protection itself, so check the current status before you commit a production pool to it.

## What the three values do

From the Learn page [Display Protection for Windows 365 and Azure Virtual Desktop](https://learn.microsoft.com/en-us/windows-365/enterprise/display-protection):

| Value | Level | What happens on an endpoint that cannot provide hardware DRM |
|---|---|---|
| 0 | Not configured | Display Protection is not enabled. |
| 1 | Hardware or software enforcement | Hardware DRM (SL3000) is used when available; software DRM (SL2000) is allowed. |
| 2 | Hardware enforcement required | The connection is blocked and the user sees an error. No software fallback. |

Software DRM can increase the time needed to establish a session, according to Learn. Hardware DRM needs a compatible GPU on the endpoint, discrete or integrated. Learn says Display Protection doesn't require a GPU-enabled Cloud PC.

## Questions that decide the level

Answer these for every host pool, in this order.

1. **Who connects, and from what?** Learn supports only [Windows App](/entity/windows-app/) on a physical Windows 11 device, version 2.0.1236.0 or newer. VMs as endpoints, macOS, iOS, Android, web browsers and Windows 365 Link devices are listed as not supported. If any group of users in the pool uses one of those, a pool-wide level above 0 is a problem for them. Learn's general rule is that a connection is allowed only when Windows App can establish the configured PlayReady protection level; otherwise the connection is blocked and an error appears on the endpoint. Learn names no specific behavior for the unsupported client types, so test them.
2. **Can you control the endpoints?** Learn says managed and bring-your-own-device endpoints are both supported, as long as they meet the requirements. Level 2 needs you to know that each device has a compatible GPU. For devices you do not manage, that knowledge is hard to get.
3. **What should happen when an endpoint falls short?** Level 1 lets the user in with software DRM. Level 2 turns the user away. Which outcome is acceptable depends on the data in the pool, and that is a policy decision, not a technical one.
4. **How much do session start times matter?** Software DRM can slow session setup, so a pool where many endpoints fall back to software can take longer to establish sessions.
5. **What else is in the display path?** Learn says Display Protection does not enforce HDCP at any level, does not authenticate external displays or capture devices, and supports up to 4K (3840 x 2160); 5K monitors are not supported.

## A decision table

The rows are scenarios, not Microsoft recommendations; the mapping is our reading of the level descriptions.

| Pool scenario | Suggested level | Reason | Trade-off |
|---|---|---|---|
| General office users on mixed endpoints, including Macs and browsers | 0 on this pool | Unsupported clients are in the pool; at level 1 or 2 they would likely fail the protection-level check, though Learn does not describe their behavior explicitly | Add other controls, for example screen capture protection, which supports more clients |
| Pilot group on managed Windows 11 laptops | 1 | Lets capable devices use hardware DRM while devices that cannot still connect with software DRM | In our reading, a software fallback is a weaker guarantee; Learn does not say how to see which DRM level a connection used |
| Sensitive data, managed physical Windows 11 devices with known GPUs | 2 | Blocks any device that cannot provide hardware DRM | Users on weaker devices cannot connect until the device changes |
| Sensitive data, but some users on Macs or tablets | Separate pools | A pool-wide value cannot suit both groups | More host pools to manage |

Learn describes the level only as a host pool RDP property and describes no per-user setting, so the documented way to give two groups different levels is two host pools with their own RDP properties.

## Steps: set the level on a host pool

Learn's Azure portal path for host pool RDP properties is described on [Set custom RDP properties on a host pool in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/customize-rdp-properties), and the property itself on the Display Protection page.

1. Sign in to the Azure portal, search for **Azure Virtual Desktop** and select **Host pools**, then the pool you want to change.
2. Select **RDP Properties**, then the **Advanced** tab.
3. Add `enableWindowsCloudIODisplayProtection:i:1` (or `:i:2`, or `:i:0`) in the semicolon-separated format shown in the existing values.
4. Select **Save**. Learn says users need to refresh their resources to receive the changes.
5. On a test endpoint, select **Refresh** in Windows App to retrieve the new configuration immediately. Without it, Learn says a change can take up to 8 hours to reach an endpoint.

The property is not in Learn's supported RDP properties list (last updated 11 August 2026), so the Display Protection page is the reference for its name and values.

## Steps: pilot before you widen

1. Create or pick a small pool, or a pilot user group in a dedicated pool, and set level 1.
2. From a physical Windows 11 endpoint with Windows App 2.0.1236.0 or newer, connect, and confirm that the connection succeeds. At level 1 a software fallback also connects without an error, so a successful connection does not by itself show which DRM type was used.
3. Run a screen capture tool during the session. Learn says the captured remote content should be blocked or blank.
4. Repeat from each endpoint model you own, including docks and adapters. Learn's capture test checks only the endpoint behavior. It does not validate HDCP or show that an external capture device is blocked.
5. Check [Intune](/entity/intune/) Cloud PC monitoring (preview) under **Reports** > **Cloud PC monitoring (preview)** > **Connection health**, open **View data**, then the **Events** table, and look for the `DisplayProtectionState` event. Learn says the event confirms whether protection was negotiated for a connection and that event names and values might change before general availability. Check in your tenant that your Azure Virtual Desktop connections appear there and whether the event shows the DRM type; Learn does not describe that detail.
6. Only when the pilot shows that all intended devices connect, consider level 2 on the same or a new pool.

## Problems to expect

- **Incompatible-client error after a change.** Learn says a connection can be blocked with an incompatible-client error shortly after you enable or change the setting. Select **Refresh** in Windows App or wait, up to 8 hours, and try again.
- **Old Windows App versions.** The minimum is 2.0.1236.0. The Windows App release notes record a fix in version 2.0.1315.0 for an issue where Display Protection was initialized for all connections regardless of the admin policy setting, so keep the client current.
- **Hardware enforcement and the display.** Learn says the hardware DRM requirement is separate from the HDCP capability of the attached display, and not to assume that display protection blocks a non-HDCP monitor, a DisplayLink dock or a USB display adapter; validate the endpoint and display setup against your selected level. The explainer article covers the HDCP details.
- **Resolution.** A 5K monitor is not supported. Learn advises a 4K or lower monitor for protected sessions.
- **Troubleshooting data.** If the connection fails and the cause is unclear, Learn asks for the activity ID, the timestamp of the failure and the reproduction steps when you contact Microsoft support. For connection errors it links to its connection error troubleshooting page.

## Rolling back

Set the property to 0 on the host pool and save. Learn defines 0 as not configured, which means Display Protection is not enabled. Learn describes the delivery delay for enabling or changing the level; assume the same applies to a rollback and have users select **Refresh** in Windows App.

## What the level does not replace

Display Protection is one control. It does not stop someone from photographing the screen or from disclosing content on purpose. [Watermarking](/entity/avd-watermarking/) discourages photographing the screen and, through a QR code with the Connection ID or Device ID, lets admins trace the session, and [screen capture protection](/entity/avd-screen-capture-protection/) covers more client types through standard operating system features. Input protection, which needs an MSI on the endpoint and its own RDP property, is configured independently of Display Protection. Decide the level per pool, then decide which of these other controls the same pool needs.

## Sources

Retrieved on 17 November 2026.

- [Microsoft Learn: Display Protection for Windows 365 and Azure Virtual Desktop](https://learn.microsoft.com/en-us/windows-365/enterprise/display-protection)
- [Microsoft Learn: Input and Output Protection for Windows 365 and Azure Virtual Desktop](https://learn.microsoft.com/en-us/windows-365/enterprise/windows-cloud-io-protection)
- [Microsoft Learn: Input Protection (preview)](https://learn.microsoft.com/en-us/windows-365/enterprise/input-protection)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Microsoft Learn: What's new in Windows 365 Enterprise](https://learn.microsoft.com/en-us/windows-365/enterprise/whats-new)
- [Microsoft Learn: What's new in Windows App](https://learn.microsoft.com/en-us/windows-app/whats-new?tabs=windows)
- [Microsoft Learn: Set custom RDP properties on a host pool in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/customize-rdp-properties)
- [Microsoft Learn: Supported RDP properties with Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/rdp-properties)
- [Microsoft Learn: Enable screen capture protection in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/screen-capture-protection)
- [Microsoft Learn: Watermarking in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/watermarking)
