---
title: "How to Set Automatic Replies for a User as an Admin in Exchange Online PowerShell"
summary: "Use Set-MailboxAutoReplyConfiguration to turn on, schedule or clear out-of-office replies for another user. Covers AutoReplyState, internal and external messages, ExternalAudience, the time format and the cloud-only calendar parameters."
status: review
publish: false
author: mirko-p
date: 2027-01-15
topics: [exchange-online, exchange-online-powershell, powershell]
keypoints:
  - "Set-MailboxAutoReplyConfiguration configures Automatic Replies for a specific mailbox, with AutoReplyState values Enabled, Disabled (default) or Scheduled."
  - "Enabled and Scheduled need an InternalMessage, and also an ExternalMessage if ExternalAudience is Known or All (All is the default)."
  - "StartTime and EndTime use the short date format of the machine where you run the command; wrap a date with a time in quotation marks."
  - "Several calendar parameters work only in the cloud service, and DeclineAllEventsForScheduledOOF cancels meetings you organize for the other attendees."
  - "The page says you need assigned permissions to run the cmdlet and links to a page for finding them; it names no role."
faq:
  - q: "Which cmdlet sets automatic replies for another user?"
    a: "Set-MailboxAutoReplyConfiguration, with the mailbox in the Identity parameter. Microsoft Learn says it configures Automatic Replies settings for a specific mailbox and is available in on-premises Exchange and in the cloud service, with some parameters exclusive to one or the other."
  - q: "What are the AutoReplyState values?"
    a: "Enabled sends automatic replies, Disabled does not and is the default, and Scheduled sends them during the period set by StartTime and EndTime. Enabled and Scheduled both require an internal message, and an external message if ExternalAudience is Known or All."
  - q: "Who gets the external reply?"
    a: "ExternalAudience decides. None sends no external replies, Known sends only to external senders in the mailbox's Contact list, and All, the default, sends to all external senders."
  - q: "How do I clear a message?"
    a: "Use the value $null for InternalMessage, ExternalMessage, DeclineMeetingMessage or OOFEventSubject. Learn says HTML tags are added automatically to InternalMessage and ExternalMessage text, so plain text works."
  - q: "How do I enter the start and end time?"
    a: "Use the short date format from the Regional Options of the computer where you run the command. If it uses MM/dd/yyyy, 09/01/2018 means September 1, 2018. If you add a time of day, enclose the value in quotation marks, for example 09/01/2018 5:00 PM."
---

To set automatic replies for another user as an admin, run Set-MailboxAutoReplyConfiguration with the user's mailbox as Identity. Set AutoReplyState to Enabled to start replies now, or to Scheduled with StartTime and EndTime for a period. Provide an InternalMessage, and an ExternalMessage unless you set ExternalAudience to None. This guide follows the Microsoft Learn reference page for the cmdlet.

## Before you run it

Learn says you need to be assigned permissions before you can run the cmdlet, and that you might not have access to some parameters if they are not part of your assigned permissions. It links a page on finding the permissions required for any Exchange cmdlet. The reference page names no role, so check that page for your organization. The reference page also does not cover how to connect to Exchange Online PowerShell, so use the Exchange Online PowerShell documentation for that.

The cmdlet is available in on-premises Exchange and in the cloud service. Learn notes that some parameters and settings might be exclusive to one environment or the other.

## Identity

Identity is mandatory and takes the first position. Learn says you can use any value that uniquely identifies the mailbox, and lists name, alias, distinguished name, canonical DN, Domain\Username, email address, GUID, LegacyExchangeDN, SamAccountName, and user ID or user principal name.

## AutoReplyState

- **Enabled.** Automatic Replies are sent for the mailbox.
- **Disabled.** They are not sent. This is the default.
- **Scheduled.** They are sent during the period set by StartTime and EndTime.

For Enabled and Scheduled, Learn requires an InternalMessage, and an ExternalMessage if ExternalAudience is Known or All.

## ExternalAudience

- **None.** No automatic replies to external senders.
- **Known.** Replies go only to external senders who are specified in the Contact list of the mailbox.
- **All.** Replies go to all external senders. This is the default.

The value matters only when AutoReplyState is Enabled or Scheduled. Because All is the default, Learn's rule means an ExternalMessage is required as well when you enable or schedule replies. Write the external text, or set ExternalAudience to None.

## Messages

Learn says HTML tags are added automatically to InternalMessage and ExternalMessage. Entering I'm on vacation becomes a value wrapped in html and body tags. If the text has spaces, put it in quotation marks, and you can supply your own HTML in quotation marks as well. Use $null to clear a message when it is no longer needed, for example when you change the state to Disabled or the audience to None.

## Start and end time

StartTime and EndTime apply only when AutoReplyState is Scheduled. Use the short date format that is defined in Regional Options on the computer where you run the command. If it is MM/dd/yyyy, 09/01/2018 means September 1, 2018. You can enter a date alone, or a date and time. For a date and time, enclose the value in quotation marks, for example "09/01/2018 5:00 PM".

## The two examples on the page

**Scheduled reply with an internal message.**

```powershell
Set-MailboxAutoReplyConfiguration -Identity tony@contoso.com -AutoReplyState Scheduled -StartTime "7/10/2018 08:00:00" -EndTime "7/15/2018 17:00:00" -InternalMessage "Internal auto-reply message"
```

Learn says this configures Automatic Replies for Tony's mailbox to be sent between the start and end dates, with an internal reply.

**Enabled reply with internal and external text.**

```powershell
Set-MailboxAutoReplyConfiguration -Identity tony@contoso.com -AutoReplyState Enabled -InternalMessage "Internal auto-reply message." -ExternalMessage "External auto-reply message." -ExternalAudience All
```

This sends the internal and external replies, and sends the external reply to any external address. Use your own mailbox, dates and text.

## Cloud-only calendar parameters

Learn marks these as functional only in the cloud service.

- **CreateOOFEvent** creates a calendar event for the scheduled period when set to $true. The default is $false. **OOFEventSubject** sets the subject of that event.
- **AutoDeclineFutureRequestsWhenOOF** automatically declines new meeting requests received during the scheduled period. Default $false. Only usable when AutoReplyState is Scheduled.
- **DeclineEventsForScheduledOOF** controls whether existing calendar events in the period can be declined and removed. Default $false. Only usable with Scheduled. To decline specific events, use EventsToDeleteIDs. To decline all, use DeclineAllEventsForScheduledOOF.
- **DeclineAllEventsForScheduledOOF** declines all existing events in the period. It needs DeclineEventsForScheduledOOF set to $true and cannot be combined with EventsToDeleteIDs.
- **EventsToDeleteIDs** names calendar events to delete, separated by commas, when DeclineEventsForScheduledOOF is $true.
- **DeclineMeetingMessage** is the text sent when meeting requests are declined. Unlike the reply messages, HTML tags are not added automatically.

Note what Learn says about declining: if the mailbox is the meeting organizer, the events are cancelled for all other attendees. That has effects beyond the user's own calendar.

## Other switches

Learn lists the usual Confirm and WhatIf switches. WhatIf shows what the command does without making changes.

## How I would run this

This section is my advice, not a Microsoft statement.

1. **Read the current settings first** with Get-MailboxAutoReplyConfiguration for the same mailbox, so you can restore them.
2. **Try the command with WhatIf** before the real run.
3. **Use Scheduled for planned leave.** Enabled has no end date, so someone has to remember to switch it off.
4. **Choose the external audience on purpose.** For some roles, replying to every external sender is the wrong default.
5. **Agree the text with the user.** An admin should not write words for the person without asking.
6. **Be careful with the decline parameters.** Cancelling meetings the user organizes affects other people. I would only use them when the user asked for it.
7. **Verify afterwards** by reading the configuration back.

## Common problems

- **A message is missing.** Learn requires an InternalMessage for Enabled and Scheduled, and an ExternalMessage if ExternalAudience is Known or All. Check that you supplied both.
- **The dates look wrong.** Learn says the format is the short date format from the Regional Options of the computer you run from.
- **A calendar parameter does nothing on-premises.** Learn says those work only in the cloud service.
- **A parameter is not available to you.** Your assigned permissions may not include it.

## Related

- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Exchange Online PowerShell](https://www.m365.fm/entity/exchange-online-powershell/)
- [PowerShell](https://www.m365.fm/entity/powershell/)

## Sources

- [Set-MailboxAutoReplyConfiguration (ExchangePowerShell) (Microsoft Learn)](https://learn.microsoft.com/powershell/module/exchangepowershell/set-mailboxautoreplyconfiguration)
