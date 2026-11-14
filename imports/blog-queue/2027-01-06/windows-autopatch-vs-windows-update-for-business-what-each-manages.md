---
title: "Windows Autopatch vs Windows Update for Business: What Each Manages"
summary: "Compare Windows Autopatch and Windows Update for Business: what Autopatch automates, license tiers, rings and Autopatch groups, targets stated as aims, and what Learn does not say about a direct comparison."
status: review
publish: false
author: mirko-p
date: 2027-01-06
topics: [windows-autopatch, windows-update-for-business]
keypoints:
  - "Learn describes Autopatch as a cloud service that automates Windows, Microsoft 365 Apps for enterprise, Microsoft Edge and Microsoft Teams updates for registered devices."
  - "You manage Autopatch through the Intune admin center, using update policies, Autopatch groups, driver and firmware controls, and reports."
  - "Update coverage targets are aims: at least 95% of Up to Date devices on the latest quality update and at least 90% of eligible devices on a supported Monthly Enterprise Channel version."
  - "Feature access depends on license tier. Business Premium, A3+, E3+ and F3 get the main feature set, and support requests are limited to E3+ and F3."
  - "The overview page never names Windows Update for Business or compares it directly, so this guide marks inferred points as inferences."
faq:
  - q: "What does Windows Autopatch manage?"
    a: "Microsoft Learn lists Windows quality updates, Windows feature updates, driver and firmware updates, Microsoft 365 Apps for enterprise, Microsoft Edge and Microsoft Teams. It also offers update rings, Autopatch groups, Hotpatch and reports."
  - q: "Which licenses does it need?"
    a: "The main feature set is available with Business Premium, A3+, E3+ and F3 licenses. Submitting support requests to the Windows Autopatch Service Engineering Team is limited to E3+ and F3."
  - q: "Does Autopatch guarantee update coverage?"
    a: "No. Learn states 95% for Up to Date devices on the latest quality update and 90% for eligible devices on a supported Monthly Enterprise Channel version as aims, not guarantees."
  - q: "Is Autopatch the same as Windows Update for Business?"
    a: "The overview page does not say. It never mentions Windows Update for Business by name. It references Intune update ring and feature update policies, which suggests it builds on Intune update management, but the page does not state that relationship."
  - q: "Where do I manage it?"
    a: "Once a device is registered, you manage the service through the Microsoft Intune admin center."
---

Learn describes Windows Autopatch as a managed service that automates updates for Windows, Microsoft 365 Apps for enterprise, Edge and Teams across registered devices. Windows Update for Business is the update management layer that Intune policies target. The Autopatch overview does not compare the two or even name Windows Update for Business, so this guide sticks to what Autopatch does and marks the rest as open.

## What Autopatch is

The Learn overview calls Windows Autopatch a cloud service that automates Windows, Microsoft 365 Apps for enterprise, Microsoft Edge and Microsoft Teams updates to improve security and productivity. The stated goal is to deliver software updates to registered devices, free IT staff and minimize end-user disruption. After a device is registered, you manage the service in the Microsoft Intune admin center.

## What it manages

| Area | What Learn says |
| --- | --- |
| Windows quality updates | Quality update profiles for Windows 10 and later, and targeted policies to expedite a specific update. The service aims to keep at least 95% of Up to Date devices on the latest quality update |
| Windows feature updates | Controlled rollout of annual feature updates, including multi-phase release policies over existing Autopatch groups |
| Drivers and firmware | Receive automatically or self-manage. Control flow to an Autopatch group or its rings, or approve a specific driver or firmware across the tenant |
| Microsoft 365 Apps for enterprise | Aims to keep at least 90% of eligible devices on a supported version of the Monthly Enterprise Channel |
| Microsoft Edge | Eligible devices get progressive rollouts on the Stable channel |
| Microsoft Teams | Eligible devices get the standard automatic update channel |

Other items listed: update rings for Windows 10 and later, Autopatch groups (logical containers that group Microsoft Entra groups and software update policies), Hotpatch (Monthly B security updates installed without a restart), and Intune reports including the Hotpatch quality update report and enhanced quality and feature update reports with device alerts.

## Licensing

- **Business Premium, A3+, E3+ and F3:** the main feature set.
- **E3+ and F3 only:** submitting support requests with the Windows Autopatch Service Engineering Team.

Learn adds a note that in April 2025 Windows Autopatch removed feature activation and made its features available to Business Premium and A3+ licenses, rolling out over several weeks. If your experience differs from the documentation, you may not have received the changes yet.

## How Autopatch is meant to differ from doing it yourself

The page makes no direct comparison with managing updates on your own. It claims these benefits:

- Less IT effort in planning and deploying updates.
- Careful rollout sequences, with communication to admins during releases.
- Updates released in sequential deployment rings in response to reliability and compatibility signals.
- Cloud delivery that reduces investment in on-premises hardware.
- Easier onboarding with minimal time from IT admins.

## What stays open

- **Relationship to Windows Update for Business.** The overview never mentions it. It does reference the Intune update rings and feature updates policies, which suggests Autopatch builds on Intune update management. That is an inference. Check the Learn pages on Windows Update for Business and the Autopatch prerequisites before you decide.
- **Prerequisites and registration.** The overview lists none and links a separate prerequisites article.
- **Migration from a self-managed setup.** Not covered.
- **Pricing.** Not covered.
- **Rings.** The page does not explain how rings are defined or how reliability and compatibility signals work.

## Caveats

- Coverage figures are aims, not guarantees.
- Feature access depends on license tier and on whether the April 2025 changes reached your tenant.
- Support requests are limited to E3+ and F3.
- Service announcements go to the Message center in the Microsoft 365 admin center.

## A decision aid

The questions below are practical advice, not a Microsoft decision table.

| Question | If yes |
| --- | --- |
| Do you want Microsoft to run the rings and rollout sequence? | Look at Autopatch |
| Do you need to define every ring and deferral yourself? | Look at Intune update policies directly |
| Are your devices outside the license tiers listed? | Check feature entitlement first |
| Do you need support requests with the Service Engineering Team? | You need E3+ or F3 |

## Typical mistakes

- Treating the 95% and 90% aims as service-level guarantees.
- Assuming your tenant already has the April 2025 licensing changes.
- Comparing the two products without checking what each page actually says.

## Related

- [Windows Autopatch](https://www.m365.fm/entity/windows-autopatch/)
- [Windows Update for Business](https://www.m365.fm/entity/windows-update-for-business/)
- [Intune update rings](https://www.m365.fm/entity/intune-update-rings/)
- [Microsoft Intune](https://www.m365.fm/entity/intune/)

## Sources

- [What is Windows Autopatch (Microsoft Learn)](https://learn.microsoft.com/windows/deployment/windows-autopatch/overview/windows-autopatch-overview)
