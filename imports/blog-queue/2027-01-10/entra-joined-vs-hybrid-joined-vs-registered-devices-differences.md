---
title: "Microsoft Entra Joined vs Hybrid Joined vs Registered Devices: Differences and Use Cases"
summary: "Compare Microsoft Entra registered, joined and hybrid joined devices: definition, ownership, supported operating systems, sign-in methods, management tools and typical scenarios, based on four Microsoft Learn device identity pages."
status: review
publish: false
author: mirko-p
date: 2027-01-10
topics: [entra-id, windows-autopilot]
keypoints:
  - "Registered devices are for BYOD and mobile scenarios and do not require an organizational account to sign in. Ownership is user or organization."
  - "Joined devices need an organizational account to sign in, are organization-owned and suit cloud-only and hybrid organizations."
  - "Hybrid joined devices are joined to on-premises Active Directory and registered with Entra ID. They need periodic line of sight to domain controllers."
  - "Hybrid join supports Windows 11 and 10 except Home, and Windows Server 2016, 2019 and 2022. Entra join also lists macOS 13 or newer and some Linux versions."
  - "Learn calls hybrid join an interim step on the road to Entra join. All three can coexist in one organization."
faq:
  - q: "What is a device identity?"
    a: "A device identity is an object in Microsoft Entra ID, similar to users, groups or applications. It gives administrators information for access or configuration decisions."
  - q: "Which option fits BYOD?"
    a: "Microsoft Entra registered. It is meant for bring your own device and mobile scenarios, and the user signs in with local credentials."
  - q: "Which option fits organization-owned Windows devices without on-premises AD?"
    a: "Microsoft Entra join. It is suitable for cloud-only and hybrid organizations and requires an organizational account to sign in."
  - q: "When do I need hybrid join?"
    a: "The page lists continuing to use Group Policy, existing imaging solutions, and Win32 apps that rely on Active Directory machine authentication. Devices need network line of sight to domain controllers periodically."
  - q: "Can the three types coexist?"
    a: "Yes. Learn says all three scenarios can coexist in a single organization."
---

Microsoft Entra ID gives a device an identity in three ways: registration, join and hybrid join. The choice depends on who owns the device, how users sign in and whether on-premises Active Directory is involved. This guide compares them using the Microsoft Learn overview and the three concept pages. The overview page itself has no comparison table.

## The three types in short

| | Registered | Joined | Hybrid joined |
| --- | --- | --- | --- |
| Definition | Registered to Entra ID without requiring an organizational account to sign in | Joined only to Entra ID, requiring an organizational account to sign in | Joined to on-premises Active Directory and Entra ID, requiring an organizational account to sign in |
| Audience | BYOD and mobile devices | Cloud-only and hybrid organizations | Hybrid organizations with existing Windows Server Active Directory |
| Ownership | User or organization | Organization | Organization |

## Operating systems

- **Registered:** Windows 10 or newer, macOS 10.15 or newer, iOS 15 or newer, Android with no version stated, Ubuntu 22.04 and 24.04 LTS, and Red Hat Enterprise Linux 8 and 9 LTS.
- **Joined:** Windows 11 and Windows 10 except Home editions, Windows Enterprise multi-session VMs in Azure, Windows Server 2019 and newer VMs in Azure (Server Core is not supported), macOS 13 or newer, Ubuntu 22.04, 24.04 and 26.04 LTS, and Red Hat Enterprise Linux 9 and 10 LTS.
- **Hybrid joined:** Windows 11 or Windows 10 except Home editions, and Windows Server 2016, 2019 and 2022.

## Sign-in

- **Registered:** local credentials, such as a local account or a Microsoft account on Windows, with password, Windows Hello, PIN or biometrics. The user has an Entra account for access to organizational resources.
- **Joined:** organizational account. Windows supports password, smart card, Authenticator phone sign-in, Windows Hello for Business, web sign-in and FIDO2. The page's table shows fewer methods on macOS and Linux, and RHEL smart card sign-in is in preview.
- **Hybrid joined:** organizational account with password or passwordless options such as Windows Hello for Business and FIDO2 security keys.

## Management

- **Registered:** mobile device management such as Intune, and mobile application management. Learn states that Entra registration is not the same as device enrollment.
- **Joined:** mobile device management such as Intune, or Configuration Manager standalone or in co-management with Intune.
- **Hybrid joined:** Group Policy, or Configuration Manager standalone or in co-management with Intune.

## Typical scenarios from the pages

- **Registered:** a home PC that is registered and enrolled to access a tool that needs a compliant device. A rooted personal Android phone blocked from email by a compliance policy.
- **Joined:** moving to cloud-based infrastructure, devices where on-premises domain join is not possible such as tablets and phones, users who mainly use Microsoft 365 or SaaS apps, and seasonal workers, contractors or students.
- **Hybrid joined:** keeping Group Policy and existing imaging, and running Win32 apps that rely on Active Directory machine authentication.

## Points to watch

- Hybrid joined devices need network line of sight to on-premises domain controllers periodically. Without the connection, devices become unusable. The page does not say how often.
- Entra registered devices do not support the Unified Write Filter feature.
- Learn describes hybrid join as an interim step on the road to Entra join.
- Device identities are required for device-based Conditional Access and for Intune management.

## What the pages do not say

- A side-by-side table in the overview.
- Hybrid join prerequisites such as licensing and functional levels. The hybrid join page links to Cloud Sync device sync configuration for computer object sync, not to a planning guide.
- The definition of how often periodically is.
- Management tools for the Linux devices listed under Entra join.

## A decision outline

This outline is practical advice built on the pages.

1. Personal or mobile device without organizational sign-in: registered.
2. Organization-owned device, cloud-first: joined.
3. Organization-owned device that still needs Active Directory and Group Policy: hybrid joined.
4. Plan to move hybrid devices to Entra join over time.

## Typical mistakes (my advice)

- Treating registration as enrollment.
- Choosing hybrid join for devices that rarely reach a domain controller.
- Using Entra join for Windows Home devices, which are not supported.
- Expecting Server Core to be supported for Entra join.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Windows Autopilot](https://www.m365.fm/entity/windows-autopilot/)
- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)

## Sources

- [What is device identity in Microsoft Entra ID? (Microsoft Learn)](https://learn.microsoft.com/entra/identity/devices/overview)
- [What is a Microsoft Entra joined device? (Microsoft Learn)](https://learn.microsoft.com/entra/identity/devices/concept-directory-join)
- [What is a Microsoft Entra hybrid joined device? (Microsoft Learn)](https://learn.microsoft.com/entra/identity/devices/concept-hybrid-join)
- [What are Microsoft Entra registered devices? (Microsoft Learn)](https://learn.microsoft.com/entra/identity/devices/concept-device-registration)
