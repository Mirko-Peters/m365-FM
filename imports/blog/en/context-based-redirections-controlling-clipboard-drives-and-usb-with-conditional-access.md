---
title: "Context-based redirections: controlling clipboard, drives and USB with Conditional Access"
summary: "Context-based redirections let Azure Virtual Desktop allow or restrict clipboard, drive and storage, printer and USB redirection depending on whether a connection meets a Conditional Access requirement, such as a compliant device. The feature is in preview as of 17 November 2026."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-context-based-redirections, azure-virtual-desktop]
keypoints:
  - "Context-based redirection links a Microsoft Entra Conditional Access authentication context to the host pool's device redirection settings. A connection that meets the policy behind the context gets the configured redirections; a connection that does not gets them restricted."
  - "Four redirections are in scope: clipboard, drive and storage, printer and USB. The setting applies to every session host in the host pool, for desktop sessions and, in preview since October 2026, RemoteApp sessions."
  - "The authentication context is only a label shared between Conditional Access and the redirection setting. It does not grant or block anything itself."
  - "Other layers still apply and the most restrictive setting wins. A redirection disabled by an Intune or Group Policy setting on the session host stays disabled."
  - "Status: public preview announced in June 2026. Learn's configuration article still carries 'Preview' in its title, and Microsoft says a Resultant Set of Policy view is still in development."
faq:
  - q: "Is context-based redirection generally available?"
    a: "No. Microsoft announced the public preview for Azure Virtual Desktop in June 2026, and the October 2026 Azure Virtual Desktop what's new entry adds RemoteApp support, also in preview. Learn's configuration article is titled 'Configure context-based redirections (Preview)'. Check the current page before using it for a production control."
  - q: "Does the authentication context decide who may use a redirection?"
    a: "Indirectly. Learn says an authentication context does not grant or block redirections. It lets Azure Virtual Desktop evaluate whether the Conditional Access requirements tied to that context are met, and the configured redirections depend on the result."
  - q: "Which clients and session types does it cover?"
    a: "For Azure Virtual Desktop, Learn lists full desktop sessions in Windows App on Windows, web browsers, Android, iOS/iPadOS and macOS. RemoteApp sessions are also supported, in preview since October 2026."
---

Context-based redirections let you decide, per connection, whether clipboard, drive and storage, printer and USB redirection works in an Azure Virtual Desktop session. The decision depends on whether the connection meets a Microsoft Entra Conditional Access requirement that you attach through an authentication context. As of 17 November 2026 the feature is in preview.

This article explains the model and the design choices. The click-by-click configuration is a separate article in this series.

## Status in one paragraph

Microsoft announced the public preview of context-based redirections in the Windows IT Pro blog on 2 June 2026, covering Windows 365 and Azure Virtual Desktop. The Azure Virtual Desktop what's new page lists "Context-based redirections (Public Preview)" under June 2026 and "RemoteApp support for context-based redirections (Preview)" under October 2026. Learn's [configuration article](https://learn.microsoft.com/en-us/windows-365/enterprise/context-based-redirections) (dated 21 October 2026) carries "Preview" in its title. Behavior and limits can change before general availability.

## The problem it addresses

A host pool's RDP properties are static. Learn's custom RDP properties article lists these defaults, among others: `redirectclipboard:i:1`, `drivestoredirect:s:*`, `redirectprinters:i:1` and `usbdevicestoredirect:s:*`. With those values, every user from every device gets clipboard, drive, printer and USB redirection. Setting them to `0` closes the data path for everyone, including users on managed devices.

The Microsoft blog post frames this around bring-your-own-device (BYOD) scenarios: an unmanaged or noncompliant device may not meet the standard of a corporate-managed one. Context-based redirection lets you keep a redirection for sessions you trust and restrict it for the rest.

## The three pieces

Learn describes the same three steps for Azure Virtual Desktop and Windows 365, with a different final step.

| Piece | Where it lives | What it does |
|---|---|---|
| Authentication context | Microsoft Entra, Conditional Access | A named identifier shared between Conditional Access and the redirection setting |
| Conditional Access policy | Microsoft Entra, Conditional Access | Targets the authentication context and sets the requirement, for example a compliant device |
| Redirection mapping | Host pool RDP properties (Azure Virtual Desktop) | Maps the authentication context to each redirection you want to control |

Learn's wording on the first piece is worth keeping: an authentication context "doesn't grant or block redirections". It is a label that lets the service ask whether the policy tied to it is satisfied. Microsoft Entra allows up to 99 authentication context definitions (c1 to c99), and Entra's documentation recommends names that work across resources, such as *trusted devices*, because a smaller set limits the number of redirects and gives a better user experience.

The example on Learn uses a context named "All Managed, Compliant Devices" with ID c8, and a policy that grants access when the device is marked compliant. For Azure Virtual Desktop the mapping is made under the host pool's **RDP Properties** in **Device redirection**, where each redirection can be set to **Dynamically configure using authentication context**.

## What happens at connection time

Learn's validation steps describe the expected result. From a managed, compliant device that satisfies the policy, the configured redirections are available in the desktop or RemoteApp session. From a BYOD or noncompliant device that does not satisfy it, the same redirections are restricted or unavailable. The policy is therefore evaluated per connection, not once per user.

## What you can control, and where

- **Redirections:** clipboard, drive and storage, printer, and USB. Learn's what's new entry calls USB "low-level USB redirection", matching the opaque redirection of the `usbdevicestoredirect` property.
- **Scope:** the host pool. Learn states the settings apply to all session hosts in the host pool, so different trust rules for different user groups need either different contexts in the policy design or different host pools. Which of the two fits is your design call; Learn does not prescribe one.
- **Session types:** full desktop sessions in Windows App on Windows, web browsers, Android, iOS/iPadOS and macOS. RemoteApp sessions are also supported on Azure Virtual Desktop, in preview since October 2026.
- **Windows 365:** the same idea, but configured through an Intune Remote Connection Experience policy assigned to device groups of Cloud PCs. Learn limits Windows 365 support to Windows 365 Enterprise and Windows 365 Flex dedicated mode. Windows 365 Flex is the name Microsoft now uses for what was Windows 365 Frontline.

## How it combines with other controls

Context-based redirection does not replace session host settings. The Microsoft blog post says the feature builds on the existing Windows App and RDP security model, where the more restrictive setting takes precedence. If one policy allows a redirection but another layer disables it, it stays disabled.

Two practical consequences follow from the blog post and Learn:

1. For testing, the redirections you want to gate should be "Not Configured" or "Enabled" in other policies, because an existing policy that disables a redirection wins. The post names recent gallery images as one place where such settings may already exist.
2. When a result is not what you expect, Learn's troubleshooting list includes "existing redirection policies that might override the configuration" next to the Conditional Access assignment, device compliance status and the host pool RDP properties.

Learn's clipboard article describes the usual pattern for Azure Virtual Desktop: enable clipboard redirection on the session hosts with Intune or Group Policy, then control it with the host pool RDP properties. Context-based redirection adds a conditional layer on top of that pattern. Our reading, not a Learn statement: treat the session host policy as the ceiling and the authentication context as the switch below it.

## Design decisions before you configure

**Pick the trust signal first.** The Learn example uses device compliance. The Microsoft blog post lists device management state, compliance posture, user or group membership and network conditions as the kinds of signals, and Learn's overview names user role, device compliance and network location. Every signal needs a Conditional Access condition or grant control behind it, so start from the policy you can already enforce.

**Gate only what carries risk.** Clipboard and drive redirection move data out of the session directly. Printer and USB redirection are different paths with different business uses. Mapping all four to one context is simple; mapping them separately lets you keep, say, printing available while restricting drives. That split is an organizational choice, not a recommendation from Microsoft.

**Keep the number of contexts small.** Entra's guidance on reusable names points the same way.

**Plan licensing.** Entra's developer guidance says Conditional Access requires Microsoft Entra ID P1 and that authentication context values are not available in the Free edition.

## Limits and open points

- It is a preview, with the status above.
- Microsoft says it is developing a Resultant Set of Policy (RSOP) capability so admins can see which redirection settings applied to a connection and which policy produced them. Until then, troubleshooting means checking each layer by hand.
- Before deleting an authentication context, Entra's documentation says to confirm that nothing uses it, for example by checking sign-in logs for authentication context policy hits, and that it must have no assigned Conditional Access policies and not be published to apps.
- Authentication context works with users or workload identities, but not in the same Conditional Access policy.
- Learn's configuration article documents the mapping through the Azure portal RDP properties page and shows no scripted equivalent.

## When it is the wrong tool

If every user connects from managed, compliant devices, a plain RDP property set to `0` or `1` is simpler and has no preview status. If the concern is capture of the screen rather than data transfer, redirection control does not help; that is a different control such as screen capture protection or watermarking. Context-based redirection fits when the same host pool serves both trusted and untrusted devices and you want one set of desktops.

## Sources

Retrieved 17 November 2026.

- Microsoft Learn, Configure context-based redirections (Preview), Azure Virtual Desktop and Windows 365 tabs: https://learn.microsoft.com/en-us/windows-365/enterprise/context-based-redirections
- Microsoft Learn, What's new in Azure Virtual Desktop: https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new
- Windows IT Pro Blog, Adaptive data protection with context-based redirections in Windows 365, now in public preview (2 June 2026, updated 19 October 2026): https://techcommunity.microsoft.com/blog/windows-itpro-blog/adaptive-data-protection-with-context-based-redirections-in-windows-365-now-in-p/4521366
- Microsoft Learn, Set custom RDP properties on a host pool in Azure Virtual Desktop: https://learn.microsoft.com/en-us/azure/virtual-desktop/customize-rdp-properties
- Microsoft Learn, Configure clipboard redirection over the Remote Desktop Protocol: https://learn.microsoft.com/en-us/azure/virtual-desktop/redirection-configure-clipboard
- Microsoft Learn, Conditional Access: Target resources (Authentication context): https://learn.microsoft.com/en-us/entra/identity/conditional-access/concept-conditional-access-cloud-apps
- Microsoft Learn, Developer guidance for Microsoft Entra Conditional Access authentication context: https://learn.microsoft.com/en-us/entra/identity-platform/developer-guide-conditional-access-authentication-context
