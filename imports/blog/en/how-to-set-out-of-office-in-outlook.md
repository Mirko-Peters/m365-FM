---
title: "How to Set Out of Office in Outlook: Steps for Every Version"
summary: "How to set out of office in Outlook with automatic replies: steps for Windows, web, Mac and mobile, plus shared mailboxes and fixes when replies don't send."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [outlook, exchange-online, shared-mailbox, message-trace, exchange-online-powershell]
keypoints:
  - "In classic Outlook, choose File, Automatic Replies, Send automatic replies, set a date range, write separate inside and outside messages and select OK."
  - "In new Outlook, go to View settings, Accounts, Automatic Replies, turn the toggle on, set the time period and save."
  - "Automatic replies need an Exchange or Microsoft 365 account. Gmail, Yahoo and other POP or IMAP accounts aren't supported."
  - "Each sender gets only one reply while you're away, and spam that lands in Junk gets no reply at all."
  - "Out-of-office replies are server-side rules, so they keep working when your laptop is closed. Admins can set them for a user or shared mailbox in the admin centers."
faq:
  - q: "How do I set out of office in Outlook for a specific date range?"
    a: "Turn on automatic replies, then tick the option to send replies only during a time period and enter the start and end date and time. Classic Outlook calls it Only send during this time range. Without an end time you have to turn replies off yourself, so always set the dates."
  - q: "Why is my Outlook out of office not working?"
    a: "Check the account type first, because POP and IMAP accounts aren't supported. Then confirm the time period, make sure no junk filter moved the message to Junk, and ask your admin about remote domain settings, transport rules and forwarding. Each sender only gets one reply, so test with an address that hasn't written to you."
  - q: "Can an admin set out of office for someone else?"
    a: "Yes. In the Microsoft 365 admin center, open Users, Active users, select the person with an Exchange mailbox and choose Mail settings, then Automatic replies. For a shared mailbox, go to Groups, Shared mailboxes. The Exchange admin center and the Set-MailboxAutoReplyConfiguration cmdlet do the same job."
---
To set out of office in Outlook, open the automatic replies settings, turn them on, pick the dates you'll be away and type your message. In classic Outlook that's File, then Automatic Replies. In new Outlook it's View settings, Accounts, Automatic Replies. On the web and on a phone it's under Settings. This article is for [Outlook](https://www.m365.fm/entity/outlook/) users who are about to leave for a few days or weeks and want the exact steps for their version, and it has a section for admins who need to set replies on someone else's mailbox or a shared one.

## Check your account first

Automatic replies run on the mailbox server, so they depend on an [Exchange Online](https://www.m365.fm/entity/exchange-online/) or Exchange account. Microsoft's page on [automatic out-of-office replies](https://support.microsoft.com/en-us/office/send-automatic-out-of-office-replies-from-outlook-9742f476-5348-4f9f-997f-5e208513bd67) says the built-in feature requires an Exchange or Microsoft 365 work or school account, and it states that automatic replies aren't supported for Gmail, Yahoo or other POP or IMAP accounts. Outlook for Mac works with Exchange, Outlook.com, Hotmail and Office 365 accounts. The mobile apps work with Microsoft 365, Exchange, Exchange hybrid and Outlook.com accounts.

If you only have an IMAP or POP account, Microsoft's workaround is a rule. The catch, per the same page: Outlook has to stay running while you're away, so it's a poor choice for a long trip.

Which Outlook do you have? If you see a File menu at the top left, you're on classic Outlook. If you see a Settings gear and no File menu, you're on new Outlook or the web. The steps below follow that split.

## How to set out of office in classic Outlook for Windows

1. Select **File**, then **Automatic Replies**.
2. Select **Send automatic replies**.
3. Tick **Only send during this time range** and set the start and end date and time. If you skip this, you have to turn replies off by hand.
4. Type your message. With a work or school account you get two tabs, **Inside My Organization** and **Outside My Organization**. Fill in both.
5. Select **OK**.

To turn replies off early, select **Turn off** in the message bar under the ribbon. The Automatic Replies window also has a **Rules** button for advanced cases, such as different handling for certain senders. Check that no old out-of-office rule is left in there.

## How to set out of office in new Outlook for Windows

1. On the **View** tab, select **View settings**.
2. Go to **Accounts**, then **Automatic Replies**.
3. Turn on the **Automatic replies** toggle.
4. If you know your dates, choose the time period option and enter start and end times.
5. If you only want to answer external people you know, choose **Send replies only to contacts**.
6. Select **Save**.

The "contacts only" choice is worth knowing about. Microsoft warns that if you send replies to everyone outside your organization, every incoming email gets a reply, including newsletters, advertisements and possibly junk. The page recommends limiting replies to contacts.

## Outlook on the web, Mac and mobile

### Outlook on the web and Outlook.com

Microsoft's [web steps](https://support.microsoft.com/en-us/outlook/send-automatic-out-of-office-replies-from-outlook-com-or-outlook-on-the-web) for the new experience are:

1. Select **Settings** (the gear), then **Accounts**, then **Automatic replies**.
2. Turn on **Turn on automatic replies**.
3. Optionally check **Send replies only during a time period** and enter start and end times. Without it, replies stay on until you turn them off.
4. Optionally use the calendar options: **Block my calendar for this period**, **Automatically decline new invitations for events that occur during this period**, and **Decline and cancel my meetings during this period**.
5. Type the message. You can format it.
6. Check **Send replies outside your organization** if you want external senders included.
7. Select **Save**.

On the older web layout, the path is Settings, Account, Automatic replies, then **Send automatic replies**. To turn replies off in the new layout, switch off the toggle. In the older layout, choose **Don't send automatic replies**.

### Outlook for Mac

Microsoft documents this in its Mac article on [automatic out-of-office replies](https://support.microsoft.com/en-us/outlook/send-automatic-out-of-office-replies-from-outlook-for-mac).

1. In the navigation pane, click **Mail**.
2. From the **Tools** menu, choose **Automatic Replies**.
3. Pick the account in the drop-down and switch on **Send Automatic Replies**.
4. Under **Message for inside your organization**, type your reply.
5. To use a date range, turn on the **Set** toggle for the time period, check **Time Period** and choose a start and end.
6. To answer outside senders, check **Message for outside your organization**, choose **Send only to my contacts** or **Send to everyone** and type the text. This option only appears if your Exchange administrator has enabled it.
7. Close the **Automatic Replies** window.

If you set an end time, replies stop on their own when it passes. To turn them off earlier, go back to Tools, Automatic Replies and switch off **Send Automatic Replies**. Microsoft also notes that support for legacy Outlook for Mac ends in October 2026.

### Outlook for iOS and Android

On the phone, you set automatic replies per account. Open **Settings**, select the account, select **Automatic Replies** and turn on the switch. Microsoft's mobile article lists these options: a time window with start and end times, a calendar block that shows you as out of office, the choice to clear or decline meetings in that window, replies to everyone or only to people in your organization, and separate messages for internal and external senders.

Microsoft describes out-of-office replies as server-side rules, so a reply set on the phone runs on the server like any other. Open the setting in another client once after you save it to confirm.

## What to write

The message does the real work, so give it a minute.

- Say that you're away and for how long, with real dates.
- Name a person who can help, with an email address or phone number, for anything urgent.
- Say when you'll start answering again.
- Keep the external message short. A client doesn't need your vacation plans or the name of your internal project.

A simple template: "Thank you for your message. I'm out of the office from [date] to [date] and will answer when I return on [date]. For urgent matters, please contact [name] at [email]."

Write the inside message differently. Your team can get more detail: who covers which project, where the files are, which meetings are moved. With two tabs or two fields available, use both on purpose.

## Where to find the on and off switch

Every version has one. In classic Outlook the message bar under the ribbon shows the state and a **Turn off** button. On the web you switch the toggle. On the Mac you switch off **Send Automatic Replies** in the Tools menu. The easiest way to keep it from running after your return is to always set an end date. If you didn't, put a reminder in your calendar for the day you're back.

## Why your out-of-office isn't working

Microsoft's [article on troubleshooting OOF replies](https://learn.microsoft.com/en-us/troubleshoot/exchange/email-delivery/understand-troubleshoot-oof-replies) explains the mechanics. Out-of-office replies are server-side rules, so they work whether or not your Outlook is open. They are sent once per sender. The sender history is cleared when you turn the setting on or off or edit the rule.

That "once per sender" rule fools many testers. If you test with your own second address and send two emails, you only get one reply. Test with a fresh address.

These are the usual reasons a reply doesn't come:

1. **Spam.** If a message is marked as spam and goes to Junk, no automatic reply is generated.
2. **The account type.** Gmail, Yahoo and other POP or IMAP accounts aren't supported.
3. **Time period.** The start or end date is wrong, or already past. Check the dates and the time zone.
4. **Forwarding.** If SMTP forwarding is on for the mailbox, replies aren't generated.
5. **Remote domain settings.** An admin setting called `AutoReplyEnabled` on a remote domain blocks replies to that domain, and it overrides mailbox settings. In Exchange Online it defaults to true for new remote domains and the built-in Default domain.
6. **Transport rules.** Out-of-office messages use an empty return path. A rule that matches "Outside the organization" by envelope sender can block them.
7. **Duplicate rules.** Check for another out-of-office rule in the client under File, Automatic Replies, Rules.
8. **Replies sent despite being off.** Microsoft says replies can still go out if someone created the rule manually from the out-of-office template.

Admins can run a [message trace](https://www.m365.fm/entity/message-trace/) to follow an out-of-office reply. In the trace, the original sender shows up as the recipient. A drop event with the text "RESOLVER.OOF.IntToExt" is normal: Exchange generates both internal and external replies and drops the one that doesn't apply.

If you want a reply on every message instead of one per sender, Microsoft points to a mailbox server-side rule that has the server reply using a specific message. That's a different tool from the out-of-office setting, so build it with care.

## Admins: setting it for a user or a shared mailbox

Sometimes the person who needs the reply can't set it, because they're already gone or because the mailbox is shared. Microsoft's article on [setting automatic replies for a user or shared mailbox](https://learn.microsoft.com/en-us/troubleshoot/exchange/user-and-shared-mailboxes/set-automatic-replies) lists these methods.

1. **Microsoft 365 admin center.** Go to **Users**, then **Active users**, select a user who has an Exchange mailbox, and in the flyout choose **Mail settings** and **Automatic replies**. For a [shared mailbox](https://www.m365.fm/entity/shared-mailbox/), go to **Groups**, then **Shared mailboxes**, and select **Automatic replies** in the flyout.
2. **Exchange admin center.** Under **Recipients**, then **Mailboxes**, select the mailbox, then **Others**, then **Manage automatic replies**.
3. **Exchange Online PowerShell.** Use `Set-MailboxAutoReplyConfiguration` with the identity, `-AutoReplyState` (Disabled, Enabled or Scheduled) and start and end times for scheduled replies. See the cmdlet reference for the full parameter list, and run it through [Exchange Online PowerShell](https://www.m365.fm/entity/exchange-online-powershell/).

The `ExternalAudience` setting controls who outside gets a reply. The value `Known` sends external replies only to people in the user's contacts.

For a shared mailbox that should answer outsiders all the time, think about whether an out-of-office is the right tool. It's meant for absences, with start and end dates. A permanent acknowledgment is usually better built in another way.

## Common mistakes

- **Forgetting the end date.** Without a time period, replies run until someone turns them off.
- **Filling in only one message.** Work and school accounts have separate inside and outside messages. An empty outside tab means external senders get nothing.
- **Replying to everyone outside.** That includes newsletters and junk. Contacts only is safer.
- **Testing with a sender who already got a reply.** Each sender gets one, so use a new address.
- **Giving away too much.** An external message with your travel plans or your colleague's private number doesn't help anyone.
- **Assuming a POP or IMAP mailbox works.** It doesn't. Use a rule and keep Outlook running, or move to a supported account.

## Related topics to explore

- **Scheduling mail while you're away.** If you want messages to go out on a given day, learn how to schedule an email in Outlook.
- **Shared mailbox replies.** Decide who sets the reply for a team address and who removes it.
- **Admin settings that block replies.** Remote domain, transport rule and forwarding settings are the usual suspects when external replies fail.
- **Calendar blocking.** The web and mobile apps can block your calendar and decline meetings during the same period.

## Next step

Open your automatic replies settings today, even if the trip is weeks away, and check that the dates and both messages are right. Then send a test from an address that has never written to you, so you know how to set out of office in Outlook in a way that works for outside senders too.
