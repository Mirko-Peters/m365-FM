---
title: "Use the Microsoft 365 Message Center to Track Changes: Filters, Digest and Planner"
summary: "How to use the Microsoft 365 Message center based on Microsoft Learn: where to open it, which roles can read it, relevance levels, tags and categories, email preferences, sharing, archiving and Planner sync. Roadmap content is not covered by the page."
status: review
publish: false
author: mirko-p
date: 2026-12-28
topics: [microsoft-365-message-center]
keypoints:
  - "Open the Microsoft 365 admin center, then Health, then Message center. The Message center reader role lets a user read and share posts without other admin privileges."
  - "Each new post gets a relevance of High, Medium or Low. Major updates are communicated at least 30 days in advance when action is required and carry the Major update tag."
  - "Preferences has a Custom View tab to choose services and an Email tab for the weekly digest, major update emails and data privacy emails."
  - "Archiving is per user, and restoring is done from the Archive tab. Messages can be synced to Microsoft Planner to track tasks."
  - "The page does not say how long messages are kept, and it does not describe sharing through Teams."
faq:
  - q: "Where do I find the Message center?"
    a: "According to Microsoft Learn, in the Microsoft 365 admin center under Health, then Message center. The Microsoft 365 Admin mobile app can also show it and send push notifications."
  - q: "Who can read it?"
    a: "Most users with any admin role, and users in the Message center reader role. Learn lists roles without access, including Compliance administrator, Conditional access administrator, Device administrators and Reports reader."
  - q: "What do the relevance levels mean?"
    a: "High needs immediate action to avoid service disruption or has high potential impact. Medium needs no immediate action, for example nonbreaking changes or retirements. Low needs monitoring and relates to low-impact or lightly used services."
  - q: "How do I stop the weekly email?"
    a: "Go to Preferences, then Email, clear Send a weekly digest of my messages, and clear the major update and data privacy options if you also want to stop those, then select Save."
  - q: "Can I send a post to Planner?"
    a: "Yes. Learn says you can sync Message center messages to Microsoft Planner to track required tasks, owners, deadlines and completion, and links a separate article for setup."
---

The Message center is where Microsoft announces new and changed features for Microsoft 365 services. This guide follows the Microsoft Learn article on tracking new and changed features and covers what an admin can configure.

## Open it

Go to the Microsoft 365 admin center, then **Health**, then **Message center**. The Microsoft 365 Admin app shows the Message center on a mobile device and sends push notifications.

## Who has access

Most users with any admin role can view posts. The **Message center reader** role can read and share posts without other admin privileges. Learn lists roles that do not have access: Compliance administrator, Conditional access administrator, Customer Lockbox access approver, Device administrators, Directory readers, Directory synchronization accounts, Directory writers, Intune service administrator, Privileged role administrator and Reports reader. Microsoft recommends roles with the fewest permissions and limiting Global Administrator to emergencies.

## Relevance, status and major updates

New posts get a relevance recommendation based on your usage of apps and services and the impact of the change.

| Level | Meaning |
| --- | --- |
| High | Needs immediate action to avoid service disruption, or has high potential impact |
| Medium | Needs no immediate action. Examples are nonbreaking changes, early notice of breaking changes and retirements |
| Low | Needs monitoring. Relates to low-impact or lightly used services |

Older posts have no relevance. Processing means the score is still being computed. The **Status for your org** field shows Scheduled, Rolling out or Launched, but only for limited feature announcements that also appear on the roadmap with general availability status.

Major updates are communicated at least 30 days in advance when action is required. They include user-impacting changes to daily productivity, changes to themes and web parts, changes to visible capacity, rebranding that could confuse users, new services with default settings turned on, and changes to where data is stored or accessed.

## Columns, tags and categories

Use **Choose columns** to show or hide columns. You can sort by any column except Service and Tag. Useful filters are Service, Message state, Timing of change (This week, This month, Next month or a custom range), Relevance and Status for your org.

- **Tags:** Admin impact, Data Privacy, Deferred feature, Feature update, Major update, New feature, Retirement and User impact. Data Privacy messages are limited to Global Administrator and the Message center Privacy reader role.
- **Categories:** Prevent or fix issues, Plan for change and Stay informed. Plan for change posts aim for at least 30 days of notice.

## Preferences and email

Under **Preferences**, the **Custom View** tab lets you select the services to monitor. The **Email** tab controls the weekly digest, which is turned on by default for your primary address, plus up to two more addresses separated by a semicolon. Major update emails and data privacy emails are separate controls, and data privacy messages are not in the digest. Emails are in English, while posts use machine translation based on your language.

## Share, archive and track

- To share, select a message, then **Share**, and enter addresses. To copy a link, use **More options** and **Copy link**. Recipients need Message center access.
- Archive a message with **Archive**. Archiving is per user. Restore it from the **Archive** tab.
- Each post can show the number of users of the service in the last 28 days, though not for all services.
- Sync messages to Microsoft Planner to track tasks, owners and deadlines.
- Feedback uses thumbs up or down and This change isn't relevant to my org. It is not available for GCC High or DoD.

## Programmatic access

Learn names the service communications API in Microsoft Graph for programmatic access to service health and Message center communications.

## A routine to try

This is a suggestion, not Microsoft guidance.

1. Set Custom View to the services you run.
2. Keep the weekly digest on and add a shared mailbox address.
3. Filter weekly for High relevance, Major update and Retirement.
4. Sync required-action posts to Planner with an owner.

## Not covered

The page does not state how long messages are retained, does not describe sharing through Teams, and does not describe the roadmap itself beyond the status field.

## Related

- [Microsoft 365 Message center](https://www.m365.fm/entity/microsoft-365-message-center/)
- [Microsoft 365 admin center](https://www.m365.fm/entity/microsoft-365-admin-center/)

## Sources

- [Track new and changed features in the Microsoft 365 Message center](https://learn.microsoft.com/microsoft-365/admin/manage/message-center)
