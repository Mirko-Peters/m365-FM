---
title: "How to Choose and Change Microsoft 365 Apps Update Channels"
summary: "Compare Current Channel, Monthly Enterprise Channel and Semi-Annual Enterprise Channel for Microsoft 365 Apps: release cadence, support and rollback periods, recommendations, how to change the channel and what happens on a change."
status: review
publish: false
author: mirko-p
date: 2027-01-11
topics: [microsoft-365-apps]
keypoints:
  - "Current Channel gets features as soon as they are ready with no set schedule. Monthly Enterprise Channel gets them once a month on the second Tuesday."
  - "Semi-Annual Enterprise Channel gets feature updates in January and July for non-interactive and business-critical devices. The page announces a July 2026 change that has now passed."
  - "Support is about one month for Current Channel, three months for Monthly Enterprise and eight months for Semi-Annual, with rollback support of three and two months."
  - "Channels are set per Windows device. A device can use only one channel, and changing channels can remove features. The default is Current Channel."
  - "The page documents the Office Deployment Tool, Group Policy and Microsoft 365 admin center installation options. It does not mention Intune or Cloud Update."
faq:
  - q: "What channels exist?"
    a: "Current Channel, Monthly Enterprise Channel and Semi-Annual Enterprise Channel, plus Current Channel (Preview) and Beta Channel for testing. Beta Channel is not supported and is for test environments only."
  - q: "How often do features arrive?"
    a: "Current Channel as soon as they are ready, Monthly Enterprise once a month on the second Tuesday, Semi-Annual in January and July on the second Tuesday, according to the table on the page."
  - q: "Which channel is the default?"
    a: "Current Channel for Microsoft 365 Apps for enterprise and for business. Project and Visio subscription apps also default to Current Channel."
  - q: "How do I change the channel?"
    a: "The page names the Office Deployment Tool with the Channel attribute, the Update Channel Group Policy setting, and for self-installing users the Microsoft 365 admin center installation options. Details for installed devices are on a separate page."
  - q: "What happens when I change channels?"
    a: "Features can be removed. For example, moving from Current Channel to Semi-Annual Enterprise Channel can cause users to lose features that are not yet in Semi-Annual."
---

Update channels decide how fast Microsoft 365 Apps get new features. The page names factors such as network bandwidth, end-user training and support, and line-of-business applications. This guide follows the Microsoft Learn page Overview of update channels for Microsoft 365 Apps. The page was last updated on 2026-05-27 and announces a change for July 2026, so confirm the current state before you plan.

## The channels

| Channel | What it does |
| --- | --- |
| Current Channel | New features as soon as they are ready, with no set schedule |
| Monthly Enterprise Channel | New features once a month on the second Tuesday |
| Semi-Annual Enterprise Channel | Feature updates twice a year, in January and July. Intended for non-interactive and business-critical devices |
| Current Channel (Preview) | Preview of upcoming Current Channel features, released at least a week before the version reaches Current Channel |
| Beta Channel | Insider channel for test environments only, not supported |

Semi-Annual Enterprise Channel (Preview) is mentioned for testing, with no cadence or support details. The page also says that volume licensed Office LTSC 2021 uses a different channel (PerpetualVL2021) and that Office 2019 has its own channel. Neither is a Microsoft 365 Apps channel.

## Cadence and support

| | Current | Monthly Enterprise | Semi-Annual Enterprise |
| --- | --- | --- | --- |
| Feature updates | As soon as ready | Second Tuesday monthly | January and July |
| Security updates | Second Tuesday monthly | Second Tuesday monthly | Second Tuesday monthly |
| Support for a version | Until the next version, about one month | Three months | Eight months (from July 2025, before it was fourteen) |
| Rollback support | Not applicable | Three months | Two months |

The page announces that in July 2026 Semi-Annual Enterprise Channel receives feature and security updates monthly, on the same basis as Monthly Enterprise Channel, with one month of support for feature releases and a two-month rollback period, an effective three-month support window. Since that date has passed, check the current page.

## Recommendations on the page

- Current Channel for new features as soon as they are ready.
- Monthly Enterprise Channel for new features monthly on a predictable schedule.
- Semi-Annual Enterprise Channel for non-interactive devices and specialized or business-critical workloads that need extensive testing.
- Use Current Channel (Preview) with a small, representative group to find issues early.
- Always update to the most current version and build for your channel.

## How to change the channel

1. **Office Deployment Tool.** Set the `Channel` attribute in the configuration file, on the Add and Updates elements. The page does not list the values.
2. **Group Policy.** Download the ADMX and ADML templates and enable the **Update Channel** policy under `Computer Configuration\Policies\Administrative Templates\Microsoft Office 2016 (Machine)\Updates`.
3. **Microsoft 365 admin center.** Go to **Show all** > **Settings** > **Org settings** > **Services** > **Microsoft 365 installation options**. This applies tenant-wide, only to users who install Apps themselves from Office.com.

For devices that are already installed, the page links to a separate article.

## What happens on a change

- Channels are per device, not per user.
- Each device can use only one channel. Microsoft 365 Apps, Project and Visio on the same device share a channel.
- Different devices in one organization can use different channels.
- Changing channels can remove features.
- Home subscriptions have access to specific channels, including Current Channel and the channels of the Microsoft 365 Insider program.

## Other points from the page

- Monthly Enterprise Channel only contains features that are already rolled out in Current Channel, so a feature can reach Current Channel several months before it reaches Monthly Enterprise Channel.
- Copilot updates can reach Monthly Enterprise Channel ahead of the usual timeline, but only after a full rollout in Current Channel.
- The page recommends getting updates directly from the Office CDN, and mentions Delivery Optimization and Microsoft Configuration Manager for managing updates.
- OneDrive and Microsoft Teams have their own update cadences, separate from these channels.
- The page recommends Semi-Annual Enterprise Channel (Preview) to find issues, which Microsoft can then address in the four months before the version reaches Semi-Annual Enterprise Channel.

## What the page does not say

- Intune, Cloud Update or the Microsoft 365 Apps admin center as ways to set the channel.
- The accepted values for the ODT attribute or the Group Policy drop-down.
- Cadence and support for the Semi-Annual preview channel.

## A selection outline

This outline is my advice, built on the page.

1. Sort devices into groups: general users, specialized devices and a pilot group.
2. Put the pilot group on Current Channel (Preview).
3. Choose Monthly Enterprise for predictable updates, or Current for the fastest features.
4. Keep Semi-Annual for devices that need long testing, after checking the current page.
5. Before moving devices to a slower channel, check which features users would lose.

## Typical mistakes (my advice)

- Planning from the old eight-month or fourteen-month Semi-Annual support figures.
- Putting Microsoft 365 Apps and Visio on the same device in different channels.
- Moving users to a slower channel without checking lost features.
- Using the admin center installation option and expecting it to change managed devices.

## Related

- [Microsoft 365 Apps](https://www.m365.fm/entity/microsoft-365-apps/)
- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Outlook](https://www.m365.fm/entity/outlook/)

## Sources

- [Overview of update channels for Microsoft 365 Apps (Microsoft Learn)](https://learn.microsoft.com/microsoft-365-apps/updates/overview-update-channels)
