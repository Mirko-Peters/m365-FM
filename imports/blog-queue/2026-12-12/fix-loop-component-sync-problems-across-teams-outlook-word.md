---
title: "Loop Component Sync Problems in Teams, Outlook and Word: Causes and Checks"
summary: "Troubleshoot Loop components that do not sync or open across Teams, Outlook and Word: licensing, WebSocket network access, admin policies, storage, sharing and the Word for the web retirement, with an isolation test."
status: review
publish: false
author: mirko-p
date: 2026-12-12
topics: [microsoft-loop, teams, outlook]
keypoints:
  - "Loop components need a OneDrive or SharePoint license, and live editing needs WebSocket traffic to *.svc.ms and *.office.com to be allowed."
  - "Inserting Loop components in Word for the web was retired on September 1, 2025, and existing components were replaced with links to Loop pages."
  - "In Outlook, the email must be HTML and classic Outlook needs a Microsoft 365 business mailbox with OneDrive for Business connected."
  - "Teams components are controlled by Set-SPOTenant -IsLoopEnabled. Cloud Policy alone does not control Teams experiences."
  - "If a fresh test page fails the same way, Microsoft Q&A moderators recommend a support request, because the cause may be tenant configuration or a service issue."
faq:
  - q: "What network access do Loop components need?"
    a: "Microsoft Learn says to allow connections per the Office 365 URLs and IP address ranges, and to allow WebSocket traffic to *.svc.ms and *.office.com. These connections enable live editing, presence indicators and shared cursors."
  - q: "Why does a Loop component appear as a link in Outlook?"
    a: "Microsoft Support says the email must be in HTML format to render a component. Plain text and rich text emails display only a link. External recipients are not supported, because components are available only to people in your organization."
  - q: "Can I still insert Loop components in Word for the web?"
    a: "No. Microsoft Learn states that inserting Loop components in Word for the web was retired on September 1, 2025. Existing components were not removed or lost, and were replaced with links to the corresponding Loop pages."
  - q: "How do admins turn off Loop components in Teams?"
    a: "Per Microsoft Learn, run Set-SPOTenant -IsLoopEnabled $false, once for every region in a multi-region tenant. Cloud Policy alone does not control Teams experiences, and these controls govern creation, not access to existing content."
---

A Loop component that stops updating, shows an error or appears as a plain link usually points to one of five things: licensing, network access for live editing, an admin policy, the client or email format, or the sharing and storage of the underlying file. This article lists the checks in the order the Microsoft documentation makes them practical. Microsoft's pages read do not describe a specific fix for a sync error, so the last section covers an isolation test and escalation.

## Check 1: Licensing and prerequisites

Microsoft Learn says users need a OneDrive or SharePoint license for Loop components. Loop workspaces need the Loop with workspaces service plan. Users with Exchange on-premises mailboxes have limited capabilities, and an Exchange Online mailbox is required for @mentions and workspace sharing.

Loop components create `.loop` files, and earlier releases created `.fluid` files. They are stored in OneDrive, SharePoint or SharePoint Embedded, depending on where they were created. Components from Teams private chats, Outlook email and OneNote go to the creator's OneDrive. Teams channel content goes to a SharePoint site. Storage counts against the organization's SharePoint quota. The storage page does not describe what happens when the quota is exceeded.

## Check 2: Network and WebSockets

Real-time collaboration depends on the network. Microsoft says to allow connections per the Office 365 URLs and IP address ranges, and to allow WebSocket traffic to `*.svc.ms` and `*.office.com`. These connections enable live editing, presence and shared cursors. My own inference, not stated by Learn: if a proxy or firewall blocks WebSockets, a component may open but not update live. Testing from a network without the proxy is a simple way to compare.

## Check 3: Admin settings

Microsoft's admin policy page lists the controls:

| Control | Where | Affects |
|---|---|---|
| Create and view Loop files in Microsoft apps that support Loop | Cloud Policy | Outlook, Teams New Calendar, OneNote, Whiteboard |
| Create and view Loop files in Outlook | Cloud Policy | Outlook and Teams New Calendar only |
| `IsLoopEnabled` | `Set-SPOTenant` | Loop components in Teams chats and channels |
| `IsCollabMeetingNotesFluidEnabled` | `Set-SPOTenant` | Collaborative meeting notes in Teams |

The page is not fully consistent for Teams channels: its overview table assigns chats and channels to `IsLoopEnabled`, while its creation-path table lists `IsCollabMeetingNotesFluidEnabled` for the Teams channel path, so check both properties. Cloud Policy changes take up to 90 minutes if policy configurations already existed, and up to 24 hours if none did. Teams components default to on. Disabling these controls stops creation only. To block access to existing Loop content, Microsoft says to use Conditional Access. To verify Teams, run `Get-SPOTenant` and confirm `IsLoopEnabled` is `True`.

## Check 4: Client and format

For Outlook, Microsoft Support lists these requirements and limits:

- The email must be HTML. Other formats show a link.
- Classic Outlook needs a Microsoft 365 business mailbox, with OneDrive for Business shown under **File** > **Account** > **Connected Services**.
- Some component types appear as images or are disabled when the file is in Viewing mode, when opened in Safari or in Teams on Mac, or when an admin turned the feature off.
- Paste the link with the **Copy link** icon. Copying a URL from the browser address bar fails.
- Changing access to the Outlook item does not change access to the Loop component.
- On the admin policy page, Outlook on the web and new Outlook for Windows also need certain OWAMailbox policies set to true: `DirectFileAccessOnPrivateComputersEnabled` and `WacViewingOnPrivateComputersEnabled` for private sessions, and the matching `...OnPublicComputersEnabled` policies for public sessions. User sessions that meet Conditional Access criteria have limited functionality and cannot use Loop components.

For Word, Microsoft Learn states inserting Loop components in Word for the web was retired on September 1, 2025. Existing components became links to Loop pages. Learn says inserting components in OneNote for the web is scheduled to be retired beginning in mid-September 2026, so check the current status. My own suggestion: if the problem report mentions Word Online, check whether the component was created before the retirement.

## Check 5: Sharing and ownership

The admin policy page says, in its Teams section, that Loop components are always shared as editable by others, even if the organization's default file link for other file types is view-only. I did not find on the Learn pages read that Teams components ignore the Outlook permission setting, or that a person without access to the underlying file cannot open a component, so treat those as unverified. The Outlook support page says changing who has access to the Outlook item does not change who has access to the component. Guests need an explicit Share with specific people link, and they cannot be added to company-wide links. Guest sharing also depends on organization-level external sharing, a guest account in your tenant or the B2B invitation manager being enabled, and sensitivity labels and Conditional Access settings that do not restrict it. The Outlook support page, however, says components are currently available only to people in your organization, so test guest scenarios in Outlook separately.

Ownership matters for lifetime. The personal My workspace container is scheduled for deletion when its owner's account is deleted, and OneDrive-stored content follows the OneDrive policy when a user leaves. If a component stops opening after someone leaves, check this.

## Isolation test and escalation

A Microsoft Q&A moderator suggested this approach for a Loop page that would not sync:

1. Create a new Loop page in the same workspace with the same template.
2. Add content one item at a time, pausing 5 to 10 seconds between items: short paragraphs, a checklist, a small table, a common component such as a task board, and an external element under 5 MB.
3. Open the page in a second browser profile or device and confirm updates appear within 30 seconds.
4. If the new page fails with the same errors, an administrator should open a support request through the Microsoft 365 admin center. Include tenant details, reproduction steps, full screenshots of error banners, and browser, OS and app versions.

In that thread, the root cause was not identified and no answer was marked accepted, so treat it as a method, not a fix.

## Related

- [Microsoft Loop](https://www.m365.fm/entity/microsoft-loop/)
- [Loop workspaces](https://www.m365.fm/entity/loop-workspaces/)
- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Outlook](https://www.m365.fm/entity/outlook/)

## Sources

- [Microsoft Learn: Loop requirements](https://learn.microsoft.com/en-us/microsoft-365/loop/loop-requirements)
- [Microsoft Learn: Admin policies for Loop](https://learn.microsoft.com/en-us/microsoft-365/loop/loop-admin-configuration)
- [Microsoft Learn: Loop permissions](https://learn.microsoft.com/en-us/microsoft-365/loop/loop-permission)
- [Microsoft Learn: Loop storage](https://learn.microsoft.com/en-us/microsoft-365/loop/loop-storage)
- [Microsoft Support: Use Loop components in Outlook](https://support.microsoft.com/en-au/loop/use-loop-components-in-outlook)
- [Microsoft Q&A: Loop synchronization error](https://learn.microsoft.com/en-us/answers/questions/5700563/loop-synchronization-error)
