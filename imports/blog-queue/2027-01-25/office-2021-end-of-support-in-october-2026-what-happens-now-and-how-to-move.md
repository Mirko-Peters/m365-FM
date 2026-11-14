---
title: "Office 2021 End of Support in October 2026: What Happens Now and How to Move"
summary: "Office 2021 and Office LTSC 2021 are past end of support, listed as October 13 or 14, 2026 depending on the page. What Microsoft stopped providing, whether the apps still run, and the paths to Microsoft 365 Apps or Office LTSC 2024."
status: review
publish: false
author: mirko-p
date: 2027-01-25
topics: [microsoft-365-apps, configuration-manager]
keypoints:
  - "Support for Office 2021 has ended, with no extension and no extended security updates. Microsoft pages show October 13 or 14, 2026, because one uses a Pacific Time retirement time."
  - "After the end of support Microsoft no longer provides technical support, bug fixes or security fixes for newly found vulnerabilities."
  - "The apps may continue to work, but Microsoft warns of serious security risks, and the page says online help for them will be mostly retired."
  - "Learn names two targets: Microsoft 365 Apps (subscription, continuously updated) and Office LTSC 2024 (one-time volume purchase for special scenarios)."
  - "For planning, Learn lists system requirements, application compatibility with VBA and add-ins, infrastructure assessment, update channels, and removal of older versions."
faq:
  - q: "When did Office 2021 support end?"
    a: "The Microsoft Learn announcement and the Office Support page give October 13, 2026 for Office LTSC 2021 and Office 2021. The lifecycle page for Office 2021 lists a retirement date of October 14, 2026 at 6:59:59 AM Pacific Time, which is the same cutoff expressed in a different time zone and form. In either case the date has passed. The Support page says there is no extension and there are no extended security updates."
  - q: "Do my Office 2021 apps still work?"
    a: "The Support page says all of your Office 2021 apps may continue to function, but you could be exposed to serious security risks. Microsoft no longer provides technical support, bug fixes or security fixes for newly discovered vulnerabilities, and you no longer receive Office 2021 software updates."
  - q: "What should a company move to?"
    a: "Learn recommends Microsoft 365 Apps as the primary choice, the subscription version that comes with many Microsoft 365 enterprise and business plans. For organizations not ready for the cloud, it names Office LTSC 2024, sold as a one-time purchase through a volume license agreement, one device per license, for specific scenarios such as regulated devices, process control devices and systems that cannot connect to the internet."
  - q: "What should home users do?"
    a: "For Office Home and Student 2021 or Home and Business 2021, the Support page says you may keep using your current version, but Microsoft recommends upgrading to a newer version. It links the pages for buying or trying Microsoft 365 and for upgrading Office."
  - q: "How do I plan an upgrade to Microsoft 365 Apps?"
    a: "Learn lists these steps: review system requirements for clients and for Office server workloads, check that users have accounts and licenses, test business-critical VBA macros and add-ins, assess infrastructure, choose how to deploy and update, choose update channels, plan languages, review Group Policy templates and remove older versions."
---

Office 2021 has passed its end of support. If you still have it on devices, the question is not whether to move, but how fast and to what. This article collects what the Microsoft pages say about the end of support, what it means for the installed apps, and the upgrade paths and planning steps in Microsoft Learn. The date matters less now than the plan. Mixed dates appear on Microsoft pages, so I explain that first.

## The date

- The Learn announcement for Office LTSC 2021 says end of support is **October 13, 2026**.
- The Office Support page says support for Office 2021 ended on **October 13, 2026**, with no extension and no extended security updates.
- The Learn lifecycle page for Office 2021 shows a retirement date of **October 14, 2026, 6:59:59 AM PT**, in Pacific Time, and lists the editions Home and Business, Home and Business for Mac, Home and Student, Home and Student for Mac, and Professional. It gives the Modern Lifecycle Policy and shows no Mainstream or Extended phase.

The pages differ by a day because of how the cutoff is written. For planning, treat the end as mid-October 2026. It has passed.

## What changed

The Support page says Microsoft no longer provides:

- Technical support.
- Bug fixes.
- Security fixes for newly discovered vulnerabilities in Office 2021, including security updates that protect against malware and spyware.

You also no longer get Office 2021 software updates. Phone and chat support ended, support content is no longer updated, and most online help will be retired.

The Learn upgrade page gives the same list in general terms and adds that Microsoft strongly recommends upgrading to a supported version as soon as possible. The announcement warns that staying may increase your organization's exposure to security risks and could affect compliance requirements.

## Do the apps still run

The Support page says all of your Office 2021 apps may continue to function, but you could be exposed to serious security risks. So the apps do not stop on their own account. The risk grows with time, since new vulnerabilities do not get fixes.

## Your options

### Microsoft 365 Apps

Learn calls this the primary option. It is the subscription version of Office for desktop, web and mobile that comes with many Microsoft 365 enterprise and business plans. It is continuously updated, with new features as often as monthly. It uses user-based licensing, so users can install Office on several devices, for example Windows, Mac and mobile. Learn also names device-based licensing, shared computer activation and extended offline access for special cases.

### Office LTSC 2024

For organizations not ready to move to the cloud. It is sold as a one-time purchase through a volume license agreement, for one device per license. It only has the features available at its initial release in September 2024. Learn says it is designed for specific scenarios: regulated devices that cannot accept feature updates, process control devices on manufacturing floors, and specialty systems that cannot connect to the internet.

### Home users

For Home and Student 2021 or Home and Business 2021, the Support page says you may keep using your version, but Microsoft recommends a newer version. Work or school users depend on whether IT manages Office. The page I read does not mention Office 2024 for these users.

## Planning an upgrade to Microsoft 365 Apps

The Learn upgrade page lists these steps for IT teams:

1. **System requirements.** Check that client devices meet the requirements for Microsoft 365 Apps, and review the requirements of Office server workloads, such as Exchange Server, SharePoint Server and Skype for Business Server.
2. **Plan for Microsoft 365.** Review the capabilities of your plan and make sure users have accounts and licenses before deploying.
3. **Application compatibility.** Test business-critical VBA macros, non-Microsoft add-ins and complex documents and spreadsheets. With Configuration Manager you can use the Microsoft 365 Apps readiness dashboard, and App Assure is available.
4. **Assess infrastructure.** Number and distribution of clients and languages, IT infrastructure, network infrastructure and cloud infrastructure.
5. **Deployment method.** From the cloud, from a local source, or with Configuration Manager or another distribution tool. Cloud deployment lowers admin effort but could need more bandwidth. Local sources give more control over timing.
6. **Update channels.** Choose how often users get feature updates. Learn notes that to use Microsoft Copilot, customers must use the Monthly Enterprise Channel or Current Channel.
7. **Languages.** Install language accessory packs after the base language, by users or with the Office Deployment Tool.
8. **Group Policy.** Download the ADMX and ADML files. Cloud Policy can apply most user-based settings for Microsoft 365 Apps for enterprise.
9. **Remove older versions.** Uninstall earlier Office versions before installing Microsoft 365 Apps. MSI versions must be removed. For automation, use the Support and Recovery Assistant, or the `RemoveMSI` element in the Office Deployment Tool configuration.

Learn also points larger customers to Microsoft FastTrack. For the announcement it says organizations with over 150 licenses can use it.

One detail that matters here: the Learn page's detailed upgrade methods, such as the Group Policy setting that upgrades Office 2019 in place and the upgrade package, are written for Office 2016 and Office 2019. For Office LTSC 2021 the page gives the general plan, so check the current deployment guide for your exact scenario before you rely on the in-place method.

Project and Visio follow their own cycle. Learn says to upgrade them too, with subscription plans or with Project 2024 and Visio LTSC 2024 under volume licensing.

## Work order for an IT team (my advice)

This is my suggestion, not guidance from the page:

1. Inventory the devices that still run Office 2021 and Office LTSC 2021. Configuration Manager reports can help if you use it.
2. Split them into groups: managed laptops, shared or kiosk devices, offline or regulated systems, and home or small-office users.
3. Put the first group on Microsoft 365 Apps. Treat Office LTSC 2024 as the exception, for the offline and regulated group, as Learn describes.
4. Run the VBA and add-in tests early, since they decide the schedule for some teams.
5. Track the number of remaining Office 2021 devices each week, and give an end date to the exceptions.
6. Meanwhile, limit the exposure of the devices that cannot move yet, for example by restricting what they can reach. The pages do not give specific controls for that.

## Related

- [Microsoft 365 Apps](https://www.m365.fm/entity/microsoft-365-apps/)
- [Microsoft Configuration Manager](https://www.m365.fm/entity/configuration-manager/)

## Sources

- [Office 2021 lifecycle (Microsoft Learn)](https://learn.microsoft.com/lifecycle/products/office-2021)
- [Office LTSC 2021 end of support (Microsoft Learn)](https://learn.microsoft.com/lifecycle/announcements/office-ltsc-2021-end-of-support)
- [End of support for Office 2021 (Microsoft Support)](https://support.microsoft.com/office/system-requirements/end-of-support-for-office-2021)
- [Plan an upgrade from older versions of Office to Microsoft 365 Apps (Microsoft Learn)](https://learn.microsoft.com/microsoft-365-apps/end-of-support/plan-upgrade-older-versions-office)
