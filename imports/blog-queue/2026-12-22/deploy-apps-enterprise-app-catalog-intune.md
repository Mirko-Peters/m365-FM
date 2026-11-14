---
title: "Deploy Apps With the Enterprise App Catalog in Intune: Step by Step"
summary: "How to add a Win32 app from the Intune Enterprise App Catalog: licensing, the tabs of the wizard, what Intune prefills, assignments, auto-update, and the limits Microsoft documents."
status: review
publish: false
author: mirko-p
date: 2026-12-22
topics: [intune]
keypoints:
  - "The Enterprise App Catalog is a collection of prepared Win32 apps hosted by Microsoft. It needs a subscription in addition to Intune Plan 1 or Plan 2."
  - "Add an app under Apps > All Apps > Create > Windows > Enterprise App Catalog app, then search the catalog and pick name, language, architecture and version."
  - "Intune prefills install and uninstall commands, return codes, detection rules and requirements. Microsoft recommends keeping the prefilled values."
  - "Auto-update works only for apps with a Required assignment. It has no rollback, no rollout rings and cannot be a blocking app in ESP or device preparation."
  - "The catalog covers Windows apps only. Devices download content from Microsoft storage reachable through *.manage.microsoft.com."
faq:
  - q: "Does the Enterprise App Catalog need an extra license?"
    a: "Yes. Microsoft Learn says the feature requires a subscription in addition to Microsoft Intune Plan 1 or Plan 2. It can be bought as a standalone SKU or as part of the Microsoft Intune Suite."
  - q: "Which platforms and installer types are supported?"
    a: "Learn says the catalog is available for Windows apps, and that the apps currently provided are Win32 applications (exe and msi). Enterprise App Management supports only managed Windows devices running 64-bit Windows."
  - q: "How are catalog apps updated?"
    a: "Either with auto-update, which applies to Required assignments on Windows 10 and Windows 11, or by creating a new app with a supersedence relationship. Updates that are available show under Apps > Enterprise App Catalog apps with updates."
  - q: "Does Microsoft vouch for the security of catalog apps?"
    a: "No. Learn states that Microsoft does not assert compliance, authorization, authenticity or integrity for apps distributed through Intune, and that customers must make sure apps meet their requirements."
  - q: "Does the catalog use Winget?"
    a: "No. Learn says Enterprise App Catalog apps are installed directly by the Intune management extension."
---

The Enterprise App Catalog lets Intune admins add common Windows apps without packaging them first. You pick an app from a Microsoft-hosted catalog, Intune prefills the install commands and detection rules, and you assign it like any other Win32 app. This guide covers the steps, the options on each tab and the limits that matter in production.

## What the catalog is

According to Microsoft Learn, Intune Enterprise App Management helps you discover and deploy applications and keep them up to date from the Enterprise App Catalog. The catalog is a collection of prepared Microsoft and non-Microsoft applications. They are Win32 apps, prepared as Win32 packages and hosted by Microsoft.

Requirements from the Learn page:

- Public cloud, plus the sovereign environments U.S. Government Community Cloud High and U.S. Department of Defense.
- A subscription in addition to Intune Plan 1 or Plan 2. Learn says it can be bought standalone or as part of the Microsoft Intune Suite.
- Windows devices. Learn notes Windows 10 is an allowed version in Intune but functionality is not guaranteed after end of support on October 14, 2025.

The catalog does not work with Configuration Manager directly, although co-managed clients can receive catalog apps when they are targeted from Intune.

## Add an app from the catalog

1. Sign in to the Microsoft Intune admin center.
2. Select **Apps** > **All Apps** > **Create**.
3. In **Select app type**, choose the **Windows** platform and then **Enterprise App Catalog app**. Select **Select**.
4. On **App information**, select **Search the Enterprise App Catalog**, choose the app, and select **Next**.
5. Pick the package by name, language, architecture and version, then select **Select**.
6. Review the prefilled **Name**, **Description**, **Publisher** and other fields, then select **Next**.

### Program tab

Intune prefills the install and uninstall commands. You can keep **Command line** as the installer type or switch to a **PowerShell script** (maximum 50 KB). The tab also holds **Installation time required (mins)**, where the default is 60 and the maximum is 1440, **Allow available uninstall**, **Device restart behavior** and the return codes. Install behavior is chosen by Enterprise App Management and can't be changed.

Microsoft recommends using the prepopulated commands and rules. The page warns that changing install commands or using custom scripts might make installation fail. With Multi-Admin Approval enabled, you can't upload PowerShell scripts during app creation.

### Requirements and detection rules

Intune prefills **Operating system architecture** and **Minimum operating system**. You can add disk space, memory, processor and CPU speed requirements, and extra rules of type File, Registry or Script.

For detection, Intune prefills rules. You can switch to **Manually configure detection rules** (MSI, File or Registry) or **Use a custom detection script**. You can add up to 25 rules, and all must be met. If an app is targeted as **Required** and is not detected, Intune offers it again in about 24 hours.

### Assignments

Assignment types are **Required**, **Available for enrolled devices** and **Uninstall**. For Required assignments you can enable auto-update. You can also set end user notifications, availability, an installation deadline, exclusions and the delivery optimization priority. Finish with **Review + create** and **Create**.

## Keep apps current

You have two options.

**Auto-update.** When enabled on an app with a Required assignment, Intune detects a newer catalog version and updates targeted devices. No new app or supersedence relationship is needed. It is supported on Windows 10 and 11.

**Guided update supersedence.** Without auto-update, available updates show under **Apps** > **Enterprise App Catalog apps with updates**, and you create a new app with a supersedence relationship. Learn recommends this if you want to review updates first.

Some catalog apps update themselves. Intune then only ensures a minimum version, and treats the app as installed if the detected version is at or above it. Learn adds that self-updating apps might need network rules that allow updates from the vendor.

## Limits of auto-update

Learn lists several limitations to weigh before switching it on:

- No rollback and no automatic uninstall remediation. Removing a bad version is manual, for example with an Uninstall assignment or a remediation script.
- No rollout rings or phased deployment. A new version goes to all targeted devices at once.
- Catalog data is cached for up to one hour. If Microsoft revokes a malicious version, devices can stay exposed for up to an hour, and you must find and fix affected devices.
- Reporting keeps only the latest state per device.
- An auto-update app can't be a blocking app in the Enrollment Status Page or Autopilot device preparation.
- Mixing deployment types for the same app, such as a line-of-business app and an auto-update app, can cause a race between versions. Manage each app through one deployment type.

## Other facts worth knowing

- **Content source.** Microsoft hosts the apps in Microsoft storage reachable through `*.manage.microsoft.com`.
- **Update timing.** Learn gives service level objectives, not guarantees: a target of 80 to 90 percent of updates within 24 hours for automated validation, and manual validation completed within seven days.
- **Licensed software.** You can deploy licensed apps from the catalog, but you buy and distribute the license. Intune does not check it.
- **Removed apps.** If a vendor asks for removal, existing deployments keep working, but you can't deploy new instances from the catalog.
- **Missing apps.** Requests go through the Microsoft Feedback Portal with publisher, app name and download URL. Apps behind a paywall or sign-in are not supported, and there is no timeline.
- **Stuck content.** If an app still shows that content is being prepared after several hours, Learn says to delete the app and try again.

## Related

- [Microsoft Intune](https://www.m365.fm/entity/intune/)

## Sources

- [Microsoft Intune Enterprise Application Management](https://learn.microsoft.com/intune/app-management/deployment/enterprise-app-management)
- [Add a Windows catalog app (Win32) to Intune](https://learn.microsoft.com/intune/app-management/deployment/add-enterprise-catalog-app)
