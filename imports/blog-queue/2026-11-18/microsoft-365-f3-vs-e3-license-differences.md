---
title: "Microsoft 365 F3 vs E3 License: Differences and Which One to Choose"
summary: "A comparison of Microsoft 365 F3 and E3 based on Microsoft Learn: desktop apps, mailbox and OneDrive size, Teams features, what you lose when switching, and how to decide per user group."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [microsoft-365-f3, microsoft-365-e3, microsoft-365-admin-center, teams]
keypoints:
  - "F3 has no Microsoft 365 desktop apps. Users get Microsoft 365 for the web and mobile apps, and mobile use is limited to devices with screens under 10.9 inches."
  - "F3 includes a 2 GB mailbox and 2 GB of OneDrive storage. E plans include a 100 GB mailbox and at least 1 TB of OneDrive."
  - "F3 has no archive mailbox, delegate access, personal site, town halls or webinars. Teams Phone Standard for Frontline Workers can be added."
  - "Microsoft says you can mix licenses: Enterprise licenses for information workers and Frontline licenses for mobile workers."
  - "Switching from E to F reduces functionality. Change the license in one operation and check mailbox and OneDrive size first, because OneDrive turns read-only above 2 GB."
faq:
  - q: "Does Microsoft 365 F3 include the desktop Office apps?"
    a: "No. Microsoft Learn states that F plans do not include Microsoft 365 desktop apps. F3 users get Microsoft 365 for the web and mobile apps, and the mobile apps are limited to devices with integrated screens smaller than 10.9 inches."
  - q: "How big are the mailbox and OneDrive on F3 compared with E3?"
    a: "Microsoft Learn lists a 2 GB mailbox and 2 GB OneDrive storage for F3, against a 100 GB mailbox and 1 TB or more of OneDrive for E3 and E5. The OneDrive note adds that initial storage can be up to 5 TB per user depending on the tenant default."
  - q: "Can I mix F3 and E3 licenses in one tenant?"
    a: "Yes. Microsoft Learn says that if it makes sense for your organization, you can assign different licenses to different types of users, for example Enterprise licenses for headquarters staff and Frontline licenses for mobile workers."
  - q: "What happens to a user's data when I switch from E3 to F3?"
    a: "Microsoft Learn warns that desktop apps go into reduced functionality mode, mailboxes over 2 GB need to be reduced, archive mailbox content should be moved back, and OneDrive becomes read-only for users over the 2 GB limit. It also says to remove the E license and assign the F license in one operation."
  - q: "Is Teams included in F3?"
    a: "It depends on how the plan is bought. Microsoft's E versus F comparison table shows F3 as two separate columns, with Teams and without Teams, and labels the E3/E5 column no Teams. Teams-related items for E plans are shown as available by adding Teams Enterprise or Teams EEA. Check which offer applies to your purchase."
---

Microsoft 365 F3 is built for frontline workers who use phones, tablets or shared devices. Microsoft 365 E3 is the full desktop suite. The main differences are the missing desktop apps, small mailbox and OneDrive quotas on F3, and the lack of several Teams and Exchange features. The right choice depends on what each user group actually does all day, not on their job title.

## What Microsoft says F3 is for

Microsoft's licensing options page describes frontline workers as people who typically use phones or tablets and work directly with customers, such as retail associates or clinicians. Information workers, such as headquarters staff, typically use desktop or laptop computers.

Microsoft 365 for frontline workers refers to the F3 and F1 licenses. You can also use an Enterprise license (E3 or E5) for any frontline scenario.

## F3 vs E3 side by side

The figures below come from Microsoft's comparison of E and F plans. In that table, E3 and E5 appear as "no Teams", and Teams-dependent items show as available by adding Teams Enterprise or Teams EEA. Check which Teams offer applies to your purchase.

| Area | F3 | E3 |
|---|---|---|
| Desktop apps (Word, Excel, PowerPoint, Outlook) | No | Yes |
| Microsoft 365 for the web | Yes | Yes |
| Mobile apps | Yes, devices under 10.9 inches | Yes |
| Exchange mailbox | 2 GB | 100 GB |
| Archive mailbox, delegate access | No | Yes |
| OneDrive storage | 2 GB | 1 TB or more |
| Personal site, site mailbox | No | Yes |
| Town hall, webinars | No | By adding Teams Enterprise or Teams EEA |
| Teams Phone | Teams Phone Standard for Frontline Workers can be added | Not in E3 |
| Power Apps and Power Automate for Microsoft 365 | Yes | Yes |
| Windows 11 Enterprise | VDI only, for licensed users of a shared device | Yes |




For OneDrive, Microsoft adds that E plans can start with up to 5 TB per user depending on the tenant default, and that subscriptions for fewer than five users get 1 TB that cannot be expanded.

## How to decide

Use these questions per group of users:

1. **Do they need the desktop apps?** If someone relies on Outlook desktop, Excel macros or heavy PowerPoint work, F3 does not fit. There is no desktop client on F plans.
2. **Do they need a large mailbox or an archive?** A 2 GB mailbox with no archive suits short messages and shift notices, not long mail histories.
3. **Do they store many files?** 2 GB of OneDrive fills quickly. Shared SharePoint libraries and Teams files are the alternative for team content, but check that the user can reach them from their device.
4. **Do they host events?** Town halls and webinars are not available with F3.
5. **Do they need a phone number?** Teams Phone Standard for Frontline Workers can be added to F3.

Microsoft's own example is to mix: Enterprise licenses for headquarters staff and Frontline licenses for mobile workers. The pages read for this article do not state a cap on the number of F3 users, so confirm limits with your licensing partner before large deployments.

## If you switch from E3 to F3

Microsoft's switching guidance gives this order.

**Before the switch**

1. Move local files to OneDrive. Desktop apps go into reduced functionality mode after the switch, so be ready to uninstall them.
2. Find mailboxes over 2 GB with `Get-MailboxStatistics` and reduce them. Move archive mailbox content back into the primary mailbox and check for archive policies that move mail by age.
3. Check who uses Outlook data (.pst) files, client-only rules and signatures.
4. Identify users of town halls, webinars and Teams Phone.
5. Find users near or over 2 GB in OneDrive. OneDrive becomes read-only for users over the limit after the switch.

**During the switch**

Use the Microsoft 365 admin center or PowerShell. Remove the E license and assign the F license at the same time. Microsoft warns that removing a license and reassigning later can affect user data.

**After the switch**

Users sign in to microsoft365.com for the web apps. Admins uninstall desktop apps and, for F1 users, disable Outlook on the web.

## Common mistakes

- Assuming F3 includes the desktop apps because Teams and Exchange are included.
- Forgetting that mailbox and OneDrive quotas are 2 GB each.
- Switching licenses in two separate steps.
- Putting heavy Excel or Outlook users on F3 to save cost.

## Related

- [Microsoft 365 F3](https://www.m365.fm/entity/microsoft-365-f3/)
- [Microsoft 365 E3](https://www.m365.fm/entity/microsoft-365-e3/)
- [Microsoft 365 admin center](https://www.m365.fm/entity/microsoft-365-admin-center/)
- [Microsoft Teams](https://www.m365.fm/entity/teams/)

## Sources

- [Changing from a Microsoft 365 E plan to a Microsoft 365 F plan](https://learn.microsoft.com/en-us/microsoft-365/frontline/switch-from-enterprise-to-frontline)
- [Microsoft 365 for frontline workers](https://learn.microsoft.com/en-us/microsoft-365/frontline/flw-overview)
- [Frontline worker licensing options](https://learn.microsoft.com/en-us/microsoft-365/frontline/flw-licensing-options)

