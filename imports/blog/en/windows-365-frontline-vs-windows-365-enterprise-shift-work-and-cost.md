---
title: "Windows 365 Frontline vs Windows 365 Enterprise: shift work and cost"
summary: "Windows 365 Enterprise assigns one licensed Cloud PC to each user, while Frontline (renamed Windows 365 Flex in May 2026) licenses concurrent use, either as up to three dedicated Cloud PCs per license or as one shared Cloud PC per license. For shift work, the number of users per shift and the mode decide which model costs less."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [windows-365-frontline, windows-365]
keypoints:
  - "Enterprise is a 1:1 model: one license, one Cloud PC, one user. Frontline licenses concurrent sessions instead of named users."
  - "Dedicated mode gives each user a persistent Cloud PC, up to three per license, but only one of them can be active at a time."
  - "Shared mode provides one Cloud PC per license for a group, used one user at a time, and deletes user data at sign-out unless User Experience Sync is enabled."
  - "On the published list prices checked on 16 November 2026, a 2 vCPU, 8 GB, 128 GB plan costs $41 (Enterprise) or $62 (Frontline/Flex) per month (the pages show a dollar sign without naming a currency, so USD is assumed), so Frontline costs less once a license serves two or more shift users."
  - "Microsoft renamed Windows 365 Frontline to Windows 365 Flex in the week of 4 May 2026. Product, licensing and capabilities are unchanged."
faq:
  - q: "Is Windows 365 Frontline still called Frontline?"
    a: "Microsoft's What's new page says that in the week of 4 May 2026 Windows 365 Frontline was renamed Windows 365 Flex, with product, licensing and capabilities unchanged. Current Learn pages use Flex. Older articles and the entity page still say Frontline."
  - q: "How many users can one Frontline license serve?"
    a: "In Dedicated mode, one license provisions up to three Cloud PCs, each assigned to one user, and only one session can be active per license at a time. In Shared mode, one license provisions one Cloud PC that a group uses one user at a time."
  - q: "Can more users sign in than there are licenses?"
    a: "Only briefly, and only in Dedicated mode. The concurrency buffer lets a tenant exceed the maximum up to four times per day, for at most one hour each. It does not apply to GPU-enabled Cloud PCs or to Shared mode."
---

Windows 365 Enterprise gives every user a personal Cloud PC under one license per user. Windows 365 Frontline, which Microsoft has renamed Windows 365 Flex, licenses concurrent sessions instead, so one license can serve several people who work in different shifts. For a team where only part of the staff is online at any time, Frontline can be the cheaper model on paper. For people who work all day, one license per user avoids the concurrency rules.

This article compares the two for shift work, using Microsoft Learn and the Microsoft price pages retrieved on 16 November 2026.

## A note on the name

The What's new page for Windows 365 Enterprise says that in the week of 4 May 2026 Windows 365 Frontline was renamed Windows 365 Flex, and that product, licensing and capabilities are unchanged. Current Learn pages and the price page say Flex. This article uses "Frontline" where the older name helps searching, and otherwise "Flex". The M365.FM entity page is [Windows 365 Frontline](/entity/windows-365-frontline/).

## How the two models differ

[Windows 365](/entity/windows-365/) Enterprise creates Windows Cloud PCs for end users. Learn says it uses Microsoft Intune for management, Microsoft Entra ID for identity and Azure Virtual Desktop for remote connectivity. Each Cloud PC is assigned to one user and is that user's dedicated Windows device. Assigning a license to a user starts provisioning, and billing is per user per month.

Flex is the exception to the 1:1 relationship. Learn describes it as a version of Windows 365 in which several users share a Cloud PC under a single license, never at the same time. It has two modes, and the mode changes both the user experience and the cost.

| | Enterprise | Frontline/Flex Dedicated | Frontline/Flex Shared |
|---|---|---|---|
| Cloud PCs per license | 1 | Up to 3, each assigned to one user | 1, used by a group |
| Concurrent sessions per license | 1 (own user) | 1 | 1 |
| User data | Persistent | Persists between sessions | Deleted at sign-out, unless User Experience Sync (UES) is enabled |
| Concurrency buffer | Not applicable | Yes, limited use per day | No |
| Use cases named by Learn | 1:1 relationship between user and Cloud PC | On a rotation schedule, across time zones, part-time, contingent staff | Customer-facing workers, external contractors; short specialized tasks without data persistence |

## Dedicated mode in practice

In Dedicated mode, each license provisions up to three Cloud PCs. Each one is assigned to one user through a Microsoft Entra ID group, and the user's data and settings persist between sessions. Only one of the three users on a license can be signed in at a time. The maximum number of active sessions equals the number of licenses bought for the tenant, excluding licenses used for Shared mode.

Power behaviour affects shift change:

- Cloud PCs power off after sign-off and restart when a user connects. They stay on for two hours after sign-off.
- Intelligent prestart can start a Cloud PC before a predictable daily login. Learn says it needs connections on at least 3 of the past 30 days to predict usage. It does not consume a license until the user connects, and the Cloud PC shuts down again if the user does not connect within two hours. The What's new page lists it as generally available since the week of 30 March 2026.
- Session State Retention hibernates eligible Cloud PCs after two idle hours (the default), so the user returns to open apps. The What's new page lists it as generally available for eligible Dedicated Cloud PCs in the week of 21 September 2026. Learn adds that resizing to an unsupported size makes a Cloud PC ineligible, and that events that need a reboot, such as some Windows updates, start a fresh session.

If a Dedicated group has more users than Cloud PCs for the selected size, some users do not get a Cloud PC.

### The concurrency buffer

Shift changes overlap, and the concurrency buffer can absorb short overlaps. Learn describes these rules for Dedicated mode:

- The tenant can exceed the maximum concurrency limit up to four times per day.
- Each use lasts at most one hour, counted from the moment the limit was exceeded.
- If the buffer is used for more than one hour on four or more occasions within 24 hours, it is blocked for 48 hours. During the block, Cloud PCs still work up to the limit.
- If the tenant is blocked more than twice in seven days, the block becomes permanent. A support ticket from the Intune portal can lift it.
- The buffer does not apply to GPU-enabled Cloud PCs or to Shared mode.

The Learn page does not explain how the one-hour cap per use fits with the rule that counts uses of more than one hour, so confirm the exact behaviour with Microsoft before relying on it for a rota. Use the Windows 365 Flex connection hourly report to see usage and set up the concurrency alert to be notified each time the buffer activates.

## Shared mode in practice

In Shared mode, one license provisions one Cloud PC for a group of users, who use it one after another. All user data is deleted at sign-out, unless User Experience Sync is enabled. The What's new page lists UES as generally available since the week of 17 November 2025 and says it is designed for Shared and Cloud Apps scenarios. Shared mode can also offer Cloud Apps instead of the full desktop. Flex licenses entitle streaming Cloud Apps in Shared mode, and What's new lists Windows 365 Cloud Apps as preview in the week of 15 September 2025 and as generally available in the week of 17 November 2025.

Further points from Learn and the What's new page:

- Maximum active sessions equal the number of licenses allocated to the group, and there is no concurrency buffer.
- Shared mode is only available in the Azure Global Cloud.
- Shared mode reached general availability in the week of 31 March 2025. Shared provisioning policies support up to 5,000 Cloud PCs each since the week of 9 March 2026.
- Snapshot-based reset, which returns the Cloud PC to a known-good snapshot at each sign-in, is listed as preview since the week of 27 April 2026.

If the tenant has both modes and you add licenses, Learn says Dedicated Cloud PCs are provisioned first.

## What the licenses cost

The Microsoft price pages, retrieved on 16 November 2026, list monthly subscriptions that renew automatically. Both pages show a dollar sign without naming the currency, so USD is assumed. Flex prices are per license, and Enterprise prices are per user.

| Plan | Enterprise, per user and month | Frontline/Flex, per license and month |
|---|---|---|
| 2 vCPU, 4 GB, 128 GB | 31.00 | 47.00 |
| 2 vCPU, 8 GB, 128 GB | 41.00 | 62.00 |
| 2 vCPU, 8 GB, 256 GB | 50.00 | 75.00 |
| 4 vCPU, 16 GB, 128 GB | 66.00 | 99.00 |
| 8 vCPU, 32 GB, 128 GB | 123.00 | 185.00 |

On the Flex page, purchasing is listed as "Contact Sales". The Enterprise page lists "Buy now" for sizes up to 8 vCPU and "Contact Sales" for larger sizes. The pages state no taxes, regional prices or currency code, and neither page covers Microsoft 365 licenses or Azure networking costs.

### Worked example

A service desk has 30 agents on three shifts of 10, and each agent needs a 2 vCPU, 8 GB, 128 GB Cloud PC. These figures are arithmetic on the list prices above, not a quote.

1. **Enterprise:** 30 licenses x 41.00 = 1,230.00 per month. Every agent has a personal Cloud PC at any hour.
2. **Frontline/Flex Dedicated:** 10 concurrent users need 10 licenses, and each license can provision up to three Cloud PCs. 10 x 62.00 = 620.00 per month. All 30 agents have their own persistent Cloud PC. If shifts overlap at handover, plan for the concurrency buffer limits above, or buy more licenses.
3. **Frontline/Flex Shared:** 10 licenses for a pool of 10 Cloud PCs, again 620.00 per month, with data deleted at sign-out unless UES is enabled. The saving is the same, but the agents lose a persistent desktop.

The break-even point follows from the same numbers. For this size, a Flex license costs 62.00 and an Enterprise license costs 41.00, so Flex costs less as soon as one license serves two users (2 x 41.00 = 82.00). With one user per license, Enterprise costs less. If the peak is close to the headcount, the saving shrinks or disappears.

## How to choose

1. **Count concurrent users, not people.** Take the highest number of simultaneous sessions in a normal week, including handover, and add headroom. This drives the Flex license count.
2. **Decide whether the desktop must persist.** If a user needs installed apps, local files or settings, Dedicated mode or Enterprise fits. If sessions are short and generic, Shared mode may be enough, with UES for settings.
3. **Check the shift pattern.** This is the author's assessment, not a Learn statement: regular, predictable shifts fit intelligent prestart, while irregular shifts or full overlap point to Enterprise or more licenses.
4. **Check the region and cloud.** Shared mode is limited to the Azure Global Cloud and the regions on the requirements page.

## Limits of this comparison

- Enterprise agreements, partner pricing and regional prices can differ.
- The Flex introduction page lists the Resize Cloud PC remote action and cross-region disaster recovery as not yet supported. The What's new page lists resize for Dedicated Cloud PCs as generally available since the week of 2 March 2026, and cross-region disaster recovery for Flex Dedicated mode in the week of 8 September 2025. The dated What's new entries are newer and more specific, so the introduction page appears out of date on this point. Test either feature in your tenant before relying on it.
- The Flex license assignment page and the requirements page were not reviewed. The article "AVD or Windows 365: how to choose between them" covers the wider platform choice.

## Sources

All retrieved on 2026-11-16.

- [Microsoft Learn: What is Windows 365 Flex?](https://learn.microsoft.com/en-us/windows-365/enterprise/introduction-windows-365-flex)
- [Microsoft Learn: What is Windows 365 Enterprise?](https://learn.microsoft.com/en-us/windows-365/enterprise/overview)
- [Microsoft Learn: What's new in Windows 365 Enterprise and Windows 365 Flex](https://learn.microsoft.com/en-us/windows-365/whats-new)
- [Microsoft Learn: Concurrency buffer for Windows 365 Flex](https://learn.microsoft.com/en-us/windows-365/enterprise/concurrency-buffer)
- [Microsoft: Windows 365 Flex pricing](https://www.microsoft.com/windows-365/frontline/all-pricing)
- [Microsoft: Windows 365 Enterprise pricing](https://www.microsoft.com/en-us/windows-365/enterprise/all-pricing)
