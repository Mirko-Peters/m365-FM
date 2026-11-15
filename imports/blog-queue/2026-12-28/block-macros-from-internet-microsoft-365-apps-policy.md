---
title: "Block Macros From the Internet in Microsoft 365 Apps: Policy, Mark of the Web and Exceptions"
summary: "How Office blocks VBA macros in files from the internet, which apps and versions are affected, the policy names and paths, and the documented ways to allow trusted macros: Unblock, Trusted sites, trusted publishers and Trusted Locations."
status: review
publish: false
author: mirko-p
date: 2026-12-28
topics: [microsoft-365-apps]
keypoints:
  - "Office on Windows blocks VBA macros in files with Mark of the Web. Affected apps are Access, Excel, PowerPoint, Project, Publisher, Visio and Word."
  - "Mac, Android, iOS and Office on the web are not affected. Policies are available only with Microsoft 365 Apps for enterprise, not for business."
  - "Microsoft recommends the policy Block macros from running in Office files from the Internet as part of the security baseline for Microsoft 365 Apps for enterprise."
  - "Documented exceptions are Unblock on the file, Trusted sites or Local intranet zone, trusted publishers with signed macros, and Trusted Locations."
  - "A digital signature with a trusted publisher does not work for Excel add-in files that have Mark of the Web."
faq:
  - q: "Which apps and platforms are affected?"
    a: "According to Microsoft Learn, only Office on Windows, and only Access, Excel, PowerPoint, Project, Publisher, Visio and Word. Office on Mac, on Android and iOS and on the web are not affected."
  - q: "What is the difference between Not configured and Disabled for the block policy?"
    a: "Learn says that after the change in default behavior, Not Configured blocks macros from the internet and users see a Security Risk banner. Disabled shows the older security warning with an Enable content button and Learn does not recommend keeping it Disabled permanently."
  - q: "How does a user allow one trusted file?"
    a: "Right-click the file, choose Properties and select Unblock on the General tab, or run Unblock-File in PowerShell. Learn notes that if the share is in the Internet zone, Unblock has no effect."
  - q: "Do files in OneDrive or SharePoint have Mark of the Web?"
    a: "Learn says files opened with Open in Desktop App, files downloaded by the running OneDrive sync client and files in synced Windows known folders do not have it. A browser download can, depending on the Internet zone configuration."
  - q: "Where do I configure the policy centrally?"
    a: "Learn names Cloud Policy in the Microsoft 365 Apps admin center, the Intune settings catalog or Administrative Templates, and the Group Policy Management Console with the Office ADMX files."
---

Office blocks VBA macros in files that come from the internet. The block is based on Mark of the Web (MOTW), a marker Windows adds to files from an untrusted location such as a browser download or email attachment. Users see a Security Risk banner and no Enable content button. This guide follows the Microsoft Learn article on this default and lists the documented exceptions.

## What is affected

- Only Office on devices running Windows is affected, and only Access, Excel, PowerPoint, Project, Publisher, Visio and Word.
- Office on Mac, Android, iOS and the web is not affected.
- Learn lists rollout versions per channel. For Access, Excel, PowerPoint, Visio and Word these include version 2203 in Current Channel (Preview) from April 12, 2022 and version 2208 in Semi-Annual Enterprise Channel from January 10, 2023. Publisher and Project have later dates.
- MOTW only applies to files on an NTFS file system, not FAT32.
- Users may also see the banner for intranet files that are not in a trusted location, for example a network share reached by IP address.

## How Office decides

The page gives a flowchart. In order: a file with MOTW is checked against Trusted Locations (macros enabled if it is in one), then against a valid digital signature with the publisher's certificate trusted, then against policy. A policy that blocks or enables macros decides the outcome. If policies are Not Configured, a file the user opened before the change and trusted with Enable content stays trusted (for perpetual versions such as Office LTSC 2021 or Office 2019 this check comes before the policy step). Otherwise macros are blocked and the Security Risk banner appears.

## Policies

Learn names two policies, both under User Configuration in Administrative Templates and available only with Microsoft 365 Apps for enterprise:

| Policy | Notes |
| --- | --- |
| Block macros from running in Office files from the Internet | Recommended. Enabled blocks. Disabled or Not Configured respects the Trust Center macro settings, although after the default change Not Configured also blocks. |
| VBA Macro Notification Settings | Use it if you do not use the block policy. The recommended value is Disable all except digitally signed macros, with Require macros to be signed by a trusted publisher. |

Each app has its own policy, for example Microsoft Word 2016, Word Options, Security, Trust Center. Excel's policy is named Macro Notification Settings.

Tools: Cloud Policy at config.office.com, the Intune admin center (Devices, Configuration profiles, Create profile, Windows 10 and later, with Settings catalog or Administrative Templates), or the Group Policy Management Console with the Office ADMX and ADML files.

## Allowing trusted macros

| Scenario | Documented approach |
| --- | --- |
| Single file | Select Unblock in Properties, or run Unblock-File. |
| Network share or trusted website | Add it as a Trusted site or to the Local intranet zone. The Site to Zone Assignment List policy can do this centrally. |
| OneDrive or SharePoint | Use Open in Desktop App, download to a Trusted Location, or place the SharePoint or OneDrive domain in Trusted Sites. |
| Templates (.dot, .dotm, .pot, .potm, .xlt, .xltm) | Remove MOTW, save to a Trusted Location, or sign and trust the publisher. |
| PowerPoint add-ins (.ppa, .ppam) | Remove MOTW, sign and trust, or Trusted Location. |
| Excel add-ins (.xla, .xlam) | Remove MOTW or Trusted Location. A signature does not work for them. |
| Signed macros | Recommended: deploy the public certificate to users and prevent users from adding trusted publishers. |
| Folders on a device | Designate a Trusted Location. |

## Cautions from the page

- Adding a Trusted site gives the whole site elevated permissions beyond Office. Adding SharePoint or OneDrive domains does not change SharePoint permissions or OneDrive sharing, but anyone who can add files there could add files with macros.
- All macros validly signed with one certificate run once that publisher is trusted, and a trusted publisher is a Windows-wide setting.
- Network locations can be Trusted Locations, but Learn does not recommend it.
- To add http:// URLs as trusted sites, clear Require server verification (https:) for all sites in this zone.

## Check a file's zone

Run notepad with the file name followed by :Zone.Identifier. A ZoneId of 3 is Internet and macros are blocked. A ZoneId of 2 is Trusted sites.

## Not covered

The page advises working with business units and software vendors to identify the macros you depend on, but it gives no rollout plan for large organizations and no tool to inventory those macros.

## Related

- [Microsoft 365 Apps](https://www.m365.fm/entity/microsoft-365-apps/)
- [Intune](https://www.m365.fm/entity/intune/)
- [OneDrive](https://www.m365.fm/entity/onedrive/)

## Sources

- [Macros from the internet are blocked by default in Office (Microsoft Learn)](https://learn.microsoft.com/microsoft-365-apps/security/internet-macros-blocked)
