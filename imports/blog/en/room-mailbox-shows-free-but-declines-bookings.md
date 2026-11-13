---
title: "Room Mailbox Looks Free but Declines Bookings: A Settings Checklist for Exchange Online"
summary: "A room looks free in Outlook, yet bookings get declined or the room never answers. Check calendar processing, booking limits, working hours with time zone, and external-message handling in this order."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [exchange-online, exchange-online-powershell, outlook]
keypoints:
  - "A room that looks free but declines or ignores invites is usually a settings problem, not a corrupt calendar. Start with Get-CalendarProcessing."
  - "Learn documents the defaults: AutoAccept needs to be on, a series with any conflict is declined by default, the booking window is 180 days and the maximum duration is 1440 minutes."
  - "Working hours only matter if the room rejects out-of-hours requests, but then the working-hours time zone decides what counts as out of hours. One thread was fixed by changing the room time zone."
  - "If a third-party mail service routes invites through connectors, the room may treat them as external and skip them. Learn describes ProcessExternalMeetingMessages for that case."
faq:
  - q: "Why does a room mailbox decline a meeting when the calendar looks empty?"
    a: "The room decides by policy, not only by free/busy. Microsoft Learn lists the policy settings that can cause a decline: conflicts in a recurring series, the booking window, the maximum meeting duration, and the option to reject requests outside working hours. Check these with Get-CalendarProcessing and Get-MailboxCalendarConfiguration before you look for hidden calendar items."
  - q: "What does AutomateProcessing AutoAccept do on a room?"
    a: "According to Microsoft Learn, AutoAccept turns on both the Calendar Attendant and the resource booking attendant. The room then accepts a request when it is in policy and the slot is free, and declines it when the slot is busy. AutoUpdate on a room means delegates do not get requests."
  - q: "Can the room time zone really break bookings?"
    a: "In one Microsoft Q&A thread from February 2026, the person who asked reported that the cause was a time zone issue on all rooms, and that changing it from Pacific Standard Time to the local zone fixed it. Learn explains that the working-hours time zone is used for the start and end times, and that out-of-hours requests are rejected only when ScheduleOnlyDuringWorkHours is true. How exactly the wrong zone caused the problem in that tenant was not described."
  - q: "My room receives invites but never replies. What should I check?"
    a: "Check the calendar processing settings first. If the tenant sends mail through a third-party service with connectors, Learn says the invite can come back as an external message, which a room skips by default. The fix on that page is ProcessExternalMeetingMessages set to true, after reading the room's diagnostic log."
---

A room shows as free in the scheduling view. A user invites it, and the room answers with "busy" or does not answer at all. Help desk tickets pile up, and the calendar itself looks empty.

This guide is built from three Microsoft Q&A threads in 2026 and the current Microsoft Learn pages for room mailboxes. It is a troubleshooting checklist, not an official Microsoft procedure. Where the threads and Learn say different things, I say so.

## What the threads reported

- **February 2026.** A room looked available when scheduling, but after booking it showed as in use for all users. A moderator pointed to working hours, time zone and the room's calendar processing settings. The person who asked wrote back that it was a time zone issue on the side of all rooms and that they changed it from Pacific Standard Time to their own time zone. The thread was closed. It has no formal accepted-answer label, but the fix was confirmed by the person who asked.
- **April 2026.** Users could not book the main conference room. It looked free, yet invites came back as declined because the room was busy. Two answers were posted, one anonymous and one AI-generated. The person who asked did not confirm a fix, so I did not use them as proof. I also skipped their suggestion to delete calendar items, because it is destructive and nobody confirmed it.
- **August 2026.** A new room received invites (message trace showed them as delivered) but never accepted or declined. The administrator had already checked that the mailbox type was a room, that AutomateProcessing was AutoAccept, that AllBookInPolicy was true and that conflicts were not allowed. Recreating the mailbox changed nothing. An independent advisor suggested reviewing the full calendar processing output, testing a second room and opening a support case. No fix was confirmed.

Only the first thread has a confirmed cause. The others are useful as symptoms.

## Symptoms

- The room shows free in Outlook or Outlook on the web, but meeting requests are declined with a busy message.
- The room shows busy after booking, for every user.
- The room receives requests but never sends an accept or decline.
- Recurring series are declined while single meetings work.

## Step 1: Narrow the problem

Before you change settings, find the scope.

1. Does it affect one room, a group of rooms, or all rooms? Did anything change recently?
2. Does it affect one user or everyone? Test the same booking from two accounts.
3. Run a message trace to confirm the invite reaches the room. If it does not arrive, this is a mail flow problem, not a room problem.
4. Confirm the mailbox type:

```powershell
Get-Mailbox -Identity <room> | Format-List Name,RecipientTypeDetails,PrimarySmtpAddress
```

The type should be a room mailbox. These commands need [Exchange Online PowerShell](https://www.m365.fm/entity/exchange-online-powershell/).

## Step 2: Read the calendar processing settings

```powershell
Get-CalendarProcessing -Identity <room> | Format-List AutomateProcessing,AllowConflicts,AllBookInPolicy,AllRequestInPolicy,BookInPolicy,ResourceDelegates,ForwardRequestsToDelegates,ProcessExternalMeetingMessages
```

Microsoft Learn describes these values on the `Set-CalendarProcessing` page:

- **AutomateProcessing.** `AutoAccept` enables both the Calendar Attendant and the resource booking attendant. A request in policy is then accepted if the slot is free and declined if it is busy. `AutoUpdate` only updates the calendar, and Learn notes that on a room mailbox delegates do not get requests with that value. In Exchange Online, rooms created in the admin center, or in PowerShell after November 15, 2018, default to `AutoAccept`. Older PowerShell-created rooms default to `AutoUpdate`.
- **AllBookInPolicy.** Default `$true`: in-policy requests from all users are approved automatically.
- **AllRequestInPolicy.** Default `$false`. When `AllBookInPolicy` is `$false`, requests need approval by a delegate.
- **BookInPolicy.** Users or groups whose in-policy requests are approved automatically. Dynamic distribution groups are not supported.

If you want delegate approval, Learn lists the combination: `AutomateProcessing` `AutoAccept`, `ForwardRequestsToDelegates` `True`, `AllBookInPolicy` `False`, `AllRequestInPolicy` `True`, and `ResourceDelegates` set. If you want only certain people to book and everyone else declined, Learn's scoped auto-approval sets both `AllBookInPolicy` and `AllRequestInPolicy` to `False` and fills `BookInPolicy`. Free/busy does not show these rules, so a room set up this way can look free while it still refuses or holds requests from people who are not on the list. Check that one of these patterns was not left on by accident.

## Step 3: Check booking limits

The same cmdlet holds the limits that cause declines:

```powershell
Get-CalendarProcessing -Identity <room> | Format-List BookingWindowInDays,MaximumDurationInMinutes,AllowRecurringMeetings,ConflictPercentageAllowed,MaximumConflictInstances,EnforceSchedulingHorizon
```

According to Learn:

- `BookingWindowInDays` defaults to 180. The value 0 means today.
- `MaximumDurationInMinutes` defaults to 1440 (24 hours). For recurring meetings it applies to each instance.
- `AllowRecurringMeetings` defaults to `$true`.
- With `AllowConflicts` at its default `$false`, a recurring series is declined if the number or percentage of conflicts is higher than `MaximumConflictInstances` or `ConflictPercentageAllowed`. Both default to 0, so one conflict in a long series is enough to decline the whole series.
- `EnforceSchedulingHorizon` defaults to `$true`: a series that starts inside the booking window but runs past it is declined.

In the admin center the same limits appear on the room's **Booking** tab, under the booking settings. Learn lists the defaults there as a booking window of 180 days and a maximum duration of 24 hours.

## Step 4: Check working hours and the time zone

This is the check that solved the February thread. Learn explains the pieces:

- `ScheduleOnlyDuringWorkHours` on `Set-CalendarProcessing` controls whether requests outside working hours are rejected. Learn says that with `$true` they are automatically rejected, and that the default is `$false`. In the admin center this is the option **Allow scheduling only during working hours**, which is not selected by default.
- The working hours themselves are set with `Set-MailboxCalendarConfiguration` through `WorkDays`, `WorkingHoursStartTime`, `WorkingHoursEndTime` and `WorkingHoursTimeZone`. The defaults for start and end are 8:00 and 17:00.
- `WorkingHoursTimeZone` takes a time zone key name such as "Pacific Standard Time". Learn shows a command to list valid names.

Read the room's values:

```powershell
Get-MailboxCalendarConfiguration -Identity <room> | Format-List WorkDays,WorkingHoursStartTime,WorkingHoursEndTime,WorkingHoursTimeZone
Get-CalendarProcessing -Identity <room> | Format-List ScheduleOnlyDuringWorkHours
```

If the time zone is not your local zone, set it:

```powershell
Set-MailboxCalendarConfiguration -Identity <room> -WorkingHoursTimeZone "<time zone key name>"
```

If you have many rooms, run the check in a loop over all room mailboxes. Learn shows a similar pattern with `Get-Mailbox -Filter "RecipientTypeDetails -eq 'RoomMailbox'"`.

My reading, not stated by the thread: if `ScheduleOnlyDuringWorkHours` is on and the time zone is wrong, "outside working hours" lands at the wrong time of day, so the room can decline in the middle of your day. The thread reports the time zone fix but does not say whether that option was on. The moderator in that thread also asked the user to check their own Outlook work hours and time zone, so check both sides.

## Step 5: Check how invites reach the room

If the room receives the invite but never replies, and Steps 2 to 4 look right, ask how the invite travels. Microsoft Learn describes a case where a third-party mail service routes mail through inbound and outbound connectors. The invitation comes back through the inbound connector and is treated as external. A room does not process external meeting messages by default (`ProcessExternalMeetingMessages` defaults to `$false`).

Learn's checks and fixes:

1. Read the room's resource booking log:

```powershell
Export-MailboxDiagnosticLogs <room> -ComponentName RBA > RoomMBXLogs.txt
```

Look for an entry near the time of the request saying that processing was skipped because the setting for external items is false.

2. Recommended fix: allow external meeting messages on the room.

```powershell
Set-CalendarProcessing -Identity <room> -ProcessExternalMeetingMessages $True
```

Learn says the risk is low, because external people are unlikely to know the room address.

3. Higher-risk fix: set `TreatMessagesAsInternal` on the inbound connector. Learn warns that internal messages bypass anti-spam filtering, so use this only when the service carries strictly internal mail. It also says the connector type must be `OnPremises`.

The August 2026 thread did not mention a third-party service, so I cannot say this was the cause there. It is the documented cause of that exact symptom.

## Step 6: Test

1. Create a test meeting in a free slot with one attendee and the room.
2. Check that the room answers within a short time and that the entry appears on the room calendar.
3. Repeat with a recurring meeting, one that is outside working hours, and one from a second user.
4. Compare any decline text with the settings you read in Steps 2 to 4.

## Limits and open points

- The April and August threads did not end with a confirmed fix. Treat them as symptom examples.
- Learn's room mailbox page was last updated in February 2025, and the calendar configuration page carries an old original date. Check the pages again before you script changes at scale.
- If a new room still does not respond after all of this, the advisor's last suggestion is reasonable: collect the settings output, the message trace and the RBA log, then open a support case.

## Related

- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Exchange Online PowerShell](https://www.m365.fm/entity/exchange-online-powershell/)
- [Microsoft Outlook](https://www.m365.fm/entity/outlook/)

## Sources

- [Microsoft Learn: Manage resource mailboxes in Exchange Online](https://learn.microsoft.com/en-us/exchange/recipients-in-exchange-online/manage-resource-mailboxes)
- [Microsoft Learn: Set-CalendarProcessing](https://learn.microsoft.com/en-us/powershell/module/exchangepowershell/set-calendarprocessing?view=exchange-ps)
- [Microsoft Learn: Set-MailboxCalendarConfiguration](https://learn.microsoft.com/en-us/powershell/module/exchangepowershell/set-mailboxcalendarconfiguration?view=exchange-ps)
- [Microsoft Learn: Get-MailboxCalendarConfiguration](https://learn.microsoft.com/en-us/powershell/module/exchangepowershell/get-mailboxcalendarconfiguration?view=exchange-ps)
- [Microsoft Learn: Room mailbox can't automatically accept or decline meeting requests](https://learn.microsoft.com/en-us/troubleshoot/exchange/calendars/meeting-requests-routed-through-third-party-service-not-auto-processed)
- [Microsoft Q&A: Exchange Online room resource available but booking fails (February 2026)](https://learn.microsoft.com/en-ca/answers/questions/5786470/exchange-online-room-resource-available-but-bookin)
- [Microsoft Q&A: Room declined meeting (April 2026)](https://learn.microsoft.com/en-us/answers/questions/5861625/room-declined-meeting)
- [Microsoft Q&A: Exchange Online room mailbox not processing meeting requests (August 2026)](https://learn.microsoft.com/en-us/answers/questions/5966869/exchange-online-room-mailbox-not-processing-meetin)
