---
title: "Outlook Delegate and Shared Calendar Sync Problems Between New and Classic Outlook: Fixes"
summary: "Delegate calendars that look different or sync badly in new and classic Outlook often trace back to the MAPI versus REST sharing model. Check the calendar type, the shared calendar improvements setting, permissions and known issues."
status: review
publish: false
author: mirko-p
date: 2026-12-09
topics: [outlook, exchange-online]
keypoints:
  - "Shared calendars are moving from the legacy MAPI model to REST. New Outlook uses REST, while classic Outlook follows the Turn on shared calendar improvements setting."
  - "In classic Outlook, open the calendar's Properties. Type should read Folder containing Calendar items (REST) for an upgraded calendar."
  - "If a calendar is not upgraded, delete it and re-add it with Add Calendar > Open Shared Calendar. Do not use Add from address list, which creates a MAPI calendar."
  - "Delegate permission is set on the primary calendar only. Full mailbox access does not count as sharing a calendar with a delegate."
  - "In new Outlook, shared calendars are hidden by default. Use Show all and look under People's calendars."
faq:
  - q: "Why do shared calendars behave differently in classic and new Outlook?"
    a: "Microsoft's message center post MC1287370 says shared calendars are being upgraded from the MAPI model to REST. New Outlook, Outlook on the web, mobile and Mac use REST. Classic Outlook follows the Turn on shared calendar improvements setting, and keeps using MAPI when it is off."
  - q: "How can I check whether a shared calendar uses the new model?"
    a: "In classic Outlook for Windows, open the calendar's Properties. An upgraded calendar shows Type: Folder containing Calendar items (REST). You need Editor or Delegate permission to see the label. Admins can also run Get-MailboxCalendarFolder and check ExtendedFolderFlags."
  - q: "Does full mailbox access make someone a calendar delegate?"
    a: "No. Microsoft Support says granting full mailbox access does not count as sharing a calendar with a delegate. The owner must share the calendar with the Delegate permission, and delegates can only be assigned on the primary calendar."
  - q: "Is delegate access fully supported in new Outlook?"
    a: "Microsoft's feature comparison lists calendar delegate access as available in both. It lists shared mailbox delegate access as available in classic Outlook and partially available in new Outlook. Check the live comparison page for the current status."
---

When a delegate sees a different calendar in new Outlook than in classic Outlook, or changes do not sync, the first thing to check is which sharing model the calendar uses. Microsoft is moving shared calendars in Exchange Online from the legacy MAPI model to REST. New Outlook always uses REST, while classic Outlook only does when the shared calendar improvements setting is on. The checks below follow Microsoft's documentation, starting with that setting.

## Step 1: Understand the model difference

According to Microsoft message center post MC1287370, the server-side upgrade moves shared calendars in Exchange Online from MAPI to REST. It affects users with Editor or higher permissions on shared calendars in user or shared mailboxes, and delegates. Key points from the post:

- A new calendar folder is created in a hidden state and becomes visible after the full sync is validated.
- Events older than one year are excluded from the initial sync, though recurring events with instances in or after that window are included.
- Existing permissions and sharing are preserved.
- Auto-upgrade initially covers up to four shared calendars per delegate or principal, scaling to six. People managing more than six are excluded and see no change.
- Classic Outlook follows the **Turn on shared calendar improvements** setting. If it is off, classic Outlook keeps using MAPI even though the service-side calendars are upgraded. All other clients, including Outlook on the web, mobile, Mac and new Outlook, use REST.

That mismatch is a likely source of "works in one app, not the other" reports.

## Step 2: Check the calendar type in classic Outlook

In classic Outlook for Windows, open the calendar's **Properties**. An upgraded calendar shows **Type: Folder containing Calendar items (REST)**. Otherwise it shows MAPI. You need Editor or Delegate permission to see this label. Admins can run `Get-MailboxCalendarFolder` and check `ExtendedFolderFlags`: the owner should show `SharedOut` and the recipient `SharedIn`.

## Step 3: Check the setting and the requirements

Microsoft Support lists these requirements for the calendar sharing updates: Outlook for Microsoft 365 on Current Channel, Monthly Enterprise Channel or Semi-Annual Enterprise Channel, and Exchange Online for both the sharer and the person opening the calendar. On-premises calendars see no change. The setting is on by default in the latest versions.

To check or change it in classic Outlook:

1. Select **File** > **Account Settings** > **Account Settings**.
2. Select the Exchange account and choose **Change**.
3. Select **More Settings**, then the **Advanced** tab.
4. Check or clear **Turn on shared calendar improvements**.
5. Close and restart Outlook.

Admins can control this with the Group Policy **REST updates for calendars**, which uses the `RestUpdatesForCalendar` DWORD under `HKEY_CURRENT_USER\Software\Policies\Microsoft\Office\16.0\Outlook\Options\Calendar`. When the policy is set, the checkbox is locked for users.

## Step 4: Re-add a calendar that was not upgraded

Microsoft Support describes these steps, which require the owner to be on Exchange Online and to have granted you permission:

1. In the Calendar module, right-click the shared calendar and choose **Delete Calendar**.
2. Close and restart Outlook.
3. On the **Home** ribbon, choose **Add Calendar** > **Open Shared Calendar**.
4. Enter the sharer's name and select **OK**. Do not use **Add from address list**, because that creates a MAPI calendar.

The calendar may look empty for a few minutes, or hours for very large calendars, while it syncs.

## Step 5: Verify delegate permissions

Microsoft Support describes the permission levels as:

- **Can edit**: view and change the calendar.
- **Delegate**: the same as editing, plus receiving and responding to meeting requests on the owner's behalf. Delegates can be assigned only to the primary calendar.

In new Outlook, the owner selects **Calendar** > **Home** > **Share Calendar**, enters the person, selects **Delegate** from the drop-down and optionally allows private events or category management. Under **Delegates**, the owner also chooses where invitations and responses go: delegate only, delegate and a copy to the owner, or both. Delegate access needs a work or school account with Exchange Online and cannot be given to people outside the organization.

Granting full mailbox access does not count as sharing a calendar with a delegate.

## Step 6: Know the new Outlook differences

- Shared calendars are not visible by default in new Outlook. Select **Show all** in the calendar list and look under **People's calendars**.
- To add a calendar, select **Add calendar** > **Add from directory**.
- Microsoft's feature comparison lists calendar delegate access as available in both versions. **Shared mailbox - Delegate access** is listed as available in classic Outlook and partially available in new Outlook, as of the page's April 2026 entry. Check the live page for current status.

## Step 7: Compare against known issues

Microsoft's known issues article for classic Outlook shared calendar improvements includes items relevant to delegates:

- A delegate without permission to view private items cannot send meetings with a sensitivity label other than Normal. The meeting disappears and is not sent. Options are granting view-private permission, setting the label to Normal, or turning the feature off, which Microsoft does not recommend.
- Attendees may not receive attachment changes made by a delegate, and delegates may see sync errors in the Sync Issues folder. Microsoft lists no workaround and suggests sharing attachments by SharePoint or OneDrive links.
- The same shared calendar cannot be added more than once.
- Duplicate calendar entries were fixed. If duplicates persist, remove and re-add the manager's calendar.

A separate known issue, marked resolved with a fix released on August 11, 2026, covered blank calendar previews in new Outlook for meetings received on behalf of another person. One related case remained under investigation: a delegate with mailbox access who has not added the other person's calendar to the calendar list may still see no meetings in the preview.

## What to collect for support

Note the calendar type from Properties, the Outlook build and channel, whether the improvements setting is on, the permission level, and the exact symptom and time. Microsoft's guidance for the migration is to contact support for issues such as missing meetings or duplicate calendar folders.

## Related

- [Outlook](https://www.m365.fm/entity/outlook/)
- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Outlook on the web](https://www.m365.fm/entity/outlook-web/)

## Sources

- [Microsoft Support: How to enable and disable the Outlook calendar sharing updates](https://support.microsoft.com/en-us/Outlook/how-to-enable-and-disable-the-outlook-calendar-sharing-updates)
- [Microsoft message center MC1287370: Auto upgrade of shared calendars from MAPI to REST](https://mc.merill.net/message/MC1287370)
- [Microsoft Support: Known issues with classic Outlook Desktop Shared Calendar Improvements](https://support.microsoft.com/en-us/topic/196779d0-4d42-4760-b9f9-104631dbfa0d)
- [Microsoft Support: Share and access a calendar with edit or delegate permissions in Outlook](https://support.microsoft.com/office/share-and-access-a-calendar-with-edit-or-delegate-permissions-in-outlook-532e6410-ee80-42b5-9b1b-a09345ccef1b)
- [Microsoft Support: Feature comparison between new Outlook and classic Outlook](https://support.microsoft.com/en-us/office/new-and-classic-outlook-for-windows-feature-comparison-de453583-1e76-48bf-975a-2e9cd2ee16dd)
- [Microsoft Support: Calendar preview appears blank for meetings received on behalf of another person in new Outlook](https://support.microsoft.com/Support/known-issues/calendar-preview-appears-blank-new-outlook)
- [Microsoft Tech Community: New Outlook for Windows, a guide for delegates, part 1](https://techcommunity.microsoft.com/t5/outlook-blog/new-outlook-for-windows-a-guide-for-delegates-part-1/ba-p/4208700)
