---
title: "Microsoft 365 Apps Admin Center: Inventory and Cloud Update Profiles Explained"
summary: "What the Microsoft 365 Apps admin center offers: roles, network and group requirements, the Inventory page and its export, and cloud update profiles with rollout waves, pause and rollback."
status: review
publish: false
author: mirko-p
date: 2026-12-22
topics: [microsoft-365-apps]
keypoints:
  - "The Microsoft 365 Apps admin center is at config.office.com. Learn recommends the Office Apps Administrator role and warns against using Global Administrator day to day."
  - "Inventory shows build, channel, architecture, add-ins, macro use and last signed-in user. Devices appear automatically once a user starts an Office app."
  - "Inventory export is a CSV, available once per day, and always contains all data points regardless of filters."
  - "Cloud update profiles define update settings and a rollout plan. Rollout waves, exclusion windows, pause and rollback are listed for Monthly Enterprise Channel only."
  - "Learn says the new profile assignment experience is rolling out gradually and may not be in your tenant yet."
faq:
  - q: "Which role should I use for the Microsoft 365 Apps admin center?"
    a: "Microsoft Learn lists Office Apps Administrator as the recommended role, with Security Administrator and Global Administrator also supported. Global Reader is supported but does not cover some features such as cloud update or the Modern App Settings page."
  - q: "Do I have to onboard devices to Inventory?"
    a: "Learn says no manual onboarding is needed. Once a user launches Office apps on a supported device, that device is included automatically. New users complete a one-step setup on the Inventory page, and the page suggests the Office Deployment Tool with the TenantAssociationKey property to include all managed devices."
  - q: "Which licenses support Inventory?"
    a: "Learn lists Microsoft 365 A3 and A5, Microsoft 365 Business Standard and Premium, Office 365 E3 and E5, and Microsoft 365 E3 and E5. It lists 21Vianet, GCC, GCC High and DoD as not supported."
  - q: "How long are devices kept in Inventory?"
    a: "A device with no heartbeat for 30 days is removed and is added again when it sends a heartbeat. Learn says you can extend the 30 days under Settings in the navigation pane."
  - q: "Which update channels can use profiles?"
    a: "Learn's feature table lists profiles, channel management, update progress, update health and exclusions for Current Channel and Monthly Enterprise Channel. Rollout waves, exclusion windows, pause and rollback are listed for Monthly Enterprise Channel only."
---

The Microsoft 365 Apps admin center is Microsoft's cloud console for deploying and managing Microsoft 365 Apps in an organization. Two parts matter most for day-to-day work: **Inventory**, which shows what Office builds and add-ins are on devices, and **cloud update**, which delivers monthly updates through profiles. This guide summarizes what Microsoft Learn documents for both, and flags what the pages do not describe.

## Access and requirements

The admin center is at config.office.com. Learn lists these supported built-in roles:

- **Office Apps Administrator** (recommended)
- **Security Administrator**
- **Global Administrator**, which Learn says should be limited to emergency scenarios

Global Reader is also supported, but it does not support some features such as cloud update or the Modern App Settings page.

Other requirements from the overview:

- A supported version of Microsoft 365 Apps, Windows 10 or 11, or Windows Server that supports Microsoft 365 Apps.
- Network access to `login.live.com`, `*.office.com`, `*.office.net`, `*.config.office.com` and `*.config.office.net` for commercial and GCC. GCC High needs `*.office365.us`. DoD needs `*.apps.mil` and `*.office365.us`.
- For Microsoft Entra groups, device objects must be Entra joined or hybrid joined, and user objects need a supported license. One group should hold no more than 20,000 objects, and nested groups are supported up to three levels.

## Features at a glance

The overview lists several features. Besides Inventory and cloud update, it names the Cloud Policy service for Microsoft 365, the Office Customization Tool, security update status and OneDrive sync health. Cloud Policy supports only user objects, since policies apply at the user level.

## Inventory

### What it shows

Learn says Inventory gives insights into Office installations, such as devices running an older, unsupported build, and into the add-ins installed. The dashboard shows build spread, channels, 32-bit versus 64-bit devices, top COM add-ins and add-ins. The devices table has columns for name, version, build, architecture, update channel, add-ins present, macros used, last contact, last user and last email.

### Requirements and setup

Licensing: Microsoft 365 A3 and A5, Business Standard and Premium, Office 365 E3 and E5, and Microsoft 365 E3 and E5. 21Vianet, GCC, GCC High and DoD are listed as not supported.

Open **Inventory** in the navigation pane. If you are new to it, complete the one-step setup. Learn does not describe the setup screen. Devices need no manual onboarding, because a device is included once a user launches Office apps on it. Learn says insights appear on the page within an hour, and devices send a heartbeat once a day.

### Export

Select **Export** in the Devices view. The service prepares the data in the background, and a **Download now** link appears when it is ready. Learn says the export always includes all data points regardless of filters, has no size limit, is a .csv file and can be run once per day, with unlimited downloads. Cloud update status, update status and wave are not exported.

### Limits

- A device with no heartbeat for 30 days is removed until it reports again.
- Add-ins that are part of Microsoft 365 Apps for enterprise do not appear in the add-in table.
- Switching a device's update channel from Inventory was in public preview, can take up to 24 hours, and Learn says that starting July 2026 profile assignment replaces the **Switch device update channel** control in Inventory.

## Cloud update profiles

Learn describes profiles as defining update settings and the rollout plan for Microsoft 365 Apps updates. Update channels are assigned by the cloud update profile, which simplifies channel management. Devices receive updates from the cloud as long as they can reach the required Microsoft endpoints, and they can be managed when signed in by a Microsoft Entra user from your tenant.

Learn lists these controls:

| Control | What the page says |
| --- | --- |
| Rollout waves | Control the order in which devices receive updates |
| Exclusion windows | Stop update activity during defined periods |
| Exclusions | Block cloud update management for select devices |
| Pause | Stops update actions for a profile until an admin resumes |
| Rollback | Returns a device to a previous version |

According to the feature table, profiles, channel management, update progress, update health and exclusions are available for Current Channel and Monthly Enterprise Channel. Rollout waves, exclusion windows, pause and rollback are listed for Monthly Enterprise Channel only. The new profile experience is rolling out gradually.

## What the pages do not describe

The overview and cloud update pages I read do not give step-by-step profile creation with screen labels, schedule options, or the data collected by Inventory. For those, use the linked data-sent-to-Microsoft article and the cloud update pages before you roll out to production.

## Related

- [Microsoft 365 Apps](https://www.m365.fm/entity/microsoft-365-apps/)

## Sources

- [Overview of the Microsoft 365 Apps admin center](https://learn.microsoft.com/microsoft-365-apps/admin-center/overview)
- [Inventory in the Microsoft 365 Apps admin center](https://learn.microsoft.com/microsoft-365-apps/admin-center/inventory)
- [Cloud update overview](https://learn.microsoft.com/microsoft-365-apps/admin-center/cloud-update)
