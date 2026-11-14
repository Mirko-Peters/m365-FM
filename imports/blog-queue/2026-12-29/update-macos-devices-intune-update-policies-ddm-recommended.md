---
title: "Update macOS Devices With Intune Update Policies: Install Actions, Schedules and the DDM Shift"
summary: "Configure legacy MDM-based macOS update policies in Intune using Microsoft Learn: policy steps, update types and install actions, deferrals, schedule windows, delay settings, limits and monitoring, plus the deprecation warning that points to declarative device management."
status: review
publish: false
author: mirko-p
date: 2026-12-29
topics: [intune]
keypoints:
  - "Learn says Apple deprecated MDM-based update workloads, Intune will soon end support and Microsoft recommends declarative device management (DDM). Applies to supervised macOS 12 to 15."
  - "Create a policy under Devices, Update policies for macOS, Create profile, then set an install action for Critical, Firmware, Configuration file and All other updates."
  - "Install later offers Max User Deferrals (macOS 12 and later) and Priority Low or High (macOS 12.3 and later) for minor OS updates."
  - "Learn lists limits: Apple MDM cannot force an install by a specific date or time, and Intune update policies cannot downgrade macOS. Apple silicon needs a bootstrap token."
  - "Devices check in about every 8 hours, and Devices, Monitor, Installation status for macOS devices shows installation failures only."
faq:
  - q: "Should I still build new macOS update policies this way?"
    a: "According to Microsoft Learn, Apple deprecated these workloads, Intune will soon end support for them and Microsoft recommends DDM. The page gives no end date and no DDM setup steps, so check Learn's Apple update articles for DDM."
  - q: "Where do I create the policy?"
    a: "In the Intune admin center select Devices, Update policies for macOS, Create profile."
  - q: "How often do devices check in?"
    a: "Learn says that by default devices check in with Intune about every 8 hours."
  - q: "What do Apple silicon Macs need?"
    a: "An MDM-issued bootstrap token to authenticate automated, non-interactive updates and upgrades, according to Learn."
  - q: "How do I hide an update for testing?"
    a: "Use settings catalog Restrictions settings such as Enforced Software Update Delay. Learn cautions that update policies still install on their schedule, so review them so they do not install before the delay ends."
---

Intune can control macOS software updates with an update policy. This guide follows the Microsoft Learn article on managing macOS software updates with MDM-based policies. Learn opens that article with a warning: Apple has deprecated these workloads, Intune will soon end support for them, and Microsoft recommends declarative device management (DDM) instead. The article applies to supervised devices running macOS 12 through macOS 15. It does not give an end date, and for DDM it links only to a blog post about the move.

## Create the policy

1. In the Intune admin center select **Devices**, **Update policies for macOS**, **Create profile**.
2. On **Basics** enter a name and an optional description.
3. On **Update policy settings** choose an install action for each update type.
4. Choose a schedule type and, if needed, a weekly schedule.
5. Optionally add scope tags, then add assignments.
6. Review and select **Create**.

## Update types and install actions

The update types are Critical, Firmware, Configuration file and All other updates (OS, built-in apps). Each offers these actions:

| Action | What Learn says it does |
| --- | --- |
| Download and install | Downloads or installs, depending on the current state |
| Download only | Downloads without installing |
| Install immediately | Downloads and triggers the restart countdown notification, recommended for userless devices |
| Notify only | Downloads and notifies the user through System Settings |
| Install later | Downloads and installs later, not available for major OS upgrades |
| Not configured | No action |

With All other updates set to Install later, two more settings appear. **Max User Deferrals** limits how often a user can postpone a minor OS update, with a prompt once a day, on macOS 12 and later. **Priority** is Low or High for downloading and preparing minor updates, on macOS 12.3 and later. Learn does not state defaults for either.

## Schedule types

- **Update at next check-in:** installs at the next check-in, with no further settings.
- **Update during scheduled time:** installs at check-in only inside the configured windows.
- **Update outside of scheduled time:** does not install at check-in during the configured windows.

For the last two, pick a time zone and add time windows with start and end day and time. Overnight windows are allowed. With no times configured there is no restriction. By default devices check in with Intune about every 8 hours.

## Requirements and limits

- Apple silicon devices need an MDM-issued bootstrap token for automated, non-interactive updates and upgrades.
- Apple MDM cannot force an install by a specific date or time.
- Intune update policies cannot downgrade a device's OS version.

## Delay the visibility of updates

To hide updates from supervised users while you test them, use the settings catalog under **Restrictions**. Examples are Enforced Software Update Delay, Enforced Software Update Major OS Deferred Install Delay and Enforced Software Update Non OS Deferred Install Delay. Force Delayed App Software Updates needs a supervised device. Learn cautions that update policies install on their schedule whether or not an update is hidden. The **System Updates**, **Software Update** category controls how users interact with updates, and a targeted update policy overrides it.

## Monitor

Open **Devices**, **Monitor**, **Installation status for macOS devices**. It lists supervised devices targeted by an update policy. Devices that are up to date are not listed, because macOS reports only installation failures. The Installation Status column shows the error returned.

## Planning suggestion

This section is a suggestion. Because support for MDM-based policies is ending, pilot a DDM-based approach before building elaborate schedules you would have to rebuild.

## Edit an existing policy

Select **Devices**, **Update policies for macOS**, then the policy. In **Properties** select **Edit** for the page to change, then **Review + save** and **Save**. Learn adds a note that if the start time and end time are both 12 AM, Intune does not check restrictions and updates can install at any time.

## More settings catalog options

Besides the delay settings, the settings catalog category **System Updates**, **Software Update** includes items such as Allow Pre Release Installation, Automatic Check Enabled, Automatic Download, Automatically Install macOS Updates, Critical Update Install and Restrict Software Update Require Admin To Install. For example, setting Automatic Check Enabled to false clears the Check for updates option and prevents the user from changing it. Create these under **Devices**, **By platform**, **macOS**, **Manage devices**, **Configuration**, **Create**, **New policy**, **Settings catalog**. Learn says updates from a targeted update policy override these settings.

## Not covered

The page does not state default values for deferrals and priority, the meaning of individual error values, the date support ends or DDM setup steps.

## Related

- [Intune](https://www.m365.fm/entity/intune/)

## Sources

- [Use Microsoft Intune policies to manage macOS software updates (Microsoft Learn)](https://learn.microsoft.com/intune/device-updates/apple/deprecated-mdm-policies-macos)
