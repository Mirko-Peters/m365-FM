---
title: "How to Schedule an Email in Outlook: Every Version Explained"
summary: "How to schedule an email in Outlook: Schedule send in new Outlook, web and Mac, Delay Delivery in classic Outlook, where drafts wait, and when scheduling fails."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [outlook, exchange-online, power-automate]
keypoints:
  - "In new Outlook and Outlook on the web, open the dropdown next to Send, choose Schedule send, pick a time and select Send."
  - "Classic Outlook uses Delay Delivery on the Options tab, and the message waits in the Outbox, so Outlook has to be running."
  - "Scheduled messages in new Outlook, the web and Outlook for Mac stay in the Drafts folder until their delivery time."
  - "Scheduling isn't available for IMAP or POP accounts, and classic Delay Delivery for a single message needs an Exchange account."
  - "Outlook has no built-in recurring send. A scheduled cloud flow in Power Automate with the Send an email action covers weekly or monthly emails."
faq:
  - q: "Does Outlook need to be open for a scheduled email to send?"
    a: "It depends on the version. Microsoft says scheduled messages from Outlook for Mac send even if Outlook isn't open, and new Outlook and the web keep them in Drafts until delivery. Classic Outlook holds delayed mail in the Outbox, and the rule that delays all messages runs on your computer, so Outlook must be running."
  - q: "Where do scheduled emails go in Outlook?"
    a: "In new Outlook, Outlook on the web and Outlook for Mac, a scheduled message stays in the Drafts folder until its delivery time. In classic Outlook, a message delayed with Delay Delivery waits in the Outbox. If you can't find a scheduled email, check Drafts first and the Outbox second."
  - q: "How do I cancel or change a scheduled email?"
    a: "Open the message from Drafts. In new Outlook select Cancel send, which also lets you send it right away. On the web Microsoft documents the Edit pencil and Send Now. On Mac, Cancel Send asks you to confirm, then reopens the message so you can send or reschedule. In classic Outlook, open it from the Outbox."
---
To schedule an email in Outlook, write your message, open the dropdown arrow next to Send, choose Schedule send, pick a date and time and select Send. That's the path in new Outlook, Outlook on the web and Outlook for Mac. Classic Outlook for Windows calls it Delay Delivery and hides it on the Options tab. This article is for [Outlook](https://www.m365.fm/entity/outlook/) users who want to write an email now and have it arrive later, and it covers where the waiting message sits, how to cancel it, why the option goes missing and what to use for weekly or monthly emails.

## Which Outlook do you have?

The wording and the button location depend on the version, and Microsoft's own pages are split the same way. New Outlook for Windows and Outlook on the web use **Schedule send**. Outlook for Mac also uses **Schedule send**, and Microsoft notes that earlier Mac versions called it Send Later. Classic Outlook for Windows (Microsoft 365, 2024, 2021, 2019 and 2016) uses **Delay Delivery**.

If you see a File menu at the top left of the window, you're on classic Outlook. If you see a Settings gear and a simplified ribbon, you're on new Outlook or the web. When the steps for new Outlook don't match your screen, Microsoft says you probably aren't on new Outlook yet and should use the classic steps.

One rule applies to all of them: scheduling isn't available for IMAP or POP accounts. If your mailbox is Gmail, Yahoo or iCloud connected over IMAP, the option won't be there.

## Schedule send in new Outlook and Outlook on the web

These are the steps from Microsoft's page on [delaying or scheduling email messages](https://support.microsoft.com/en-us/outlook/mail/delay-or-schedule-sending-email-messages-in-outlook) and its [schedule send page for the web](https://support.microsoft.com/en-us/outlook/schedule-send-for-outlook-on-the-web).

1. Start a new message and write it as usual, with at least one recipient.
2. Select the dropdown arrow next to **Send**, then select **Schedule send**.
3. Choose one of the default times, or set a custom date and time.
4. Select **Send**.

That last click is easy to mistake for "send now". It isn't. The message goes to your **Drafts** folder and stays there until the delivery time. Look for it there if you want to check that it was queued.

To send a scheduled message earlier in new Outlook, switch to **Drafts**, open the message, select **Cancel send** and then **Send**. On the web, Microsoft's documented path is the same folder: open the scheduled message, select the **Edit** pencil icon and then **Send now**. The page doesn't say how to change the delivery time on the web, so open the message from Drafts and look at what the editor offers, and test with a throwaway email first.

## Delay Delivery in classic Outlook

Microsoft's [classic Outlook instructions](https://support.microsoft.com/en-us/outlook/customize-your-email-message) describe two ways to hold mail back.

### Delay one message

1. Write the message.
2. On the **Options** tab, in the **More Options** group, choose **Delay Delivery**. The Properties dialog opens.
3. Under Delivery options, tick **Do not deliver before** and enter the date and time.
4. Close the dialog and select **Send**.

Microsoft says this per-message delay is for Exchange accounts only, and you have to repeat it for every message. After you select Send, the message waits in the **Outbox**. Check there if you want proof that it's queued.

Does Outlook have to stay open? Microsoft states it outright for the rule below. For a single delayed message, the page only says the message is held in the Outbox. Treat the Outbox as a client-side queue: leave Outlook running and online until the delivery time, and don't count on it going out if you shut the laptop. You'd want to test this with your own account before an important send.

### Delay every message with a rule

If you want a short safety margin on everything you send, a rule does it for any account type.

1. Select **File**, then **Manage Rules & Alerts**, then **New Rule**.
2. Under **Start from a blank rule**, choose **Apply rule on messages I send** and select **Next**.
3. Select **Next** again and confirm **Yes** when Outlook warns that the rule applies to every message you send.
4. Check **defer delivery by a number of minutes**.
5. Click the underlined **a number of** and enter a value from 1 to 120, then select **OK**.
6. Select **Finish**, then **OK**.

Microsoft says this rule is client-side, so Outlook must be running for the delay to apply. A two-minute delay is a cheap safety net: you get a window to catch the missing attachment without recalling anything. It isn't the same as scheduling for tomorrow morning, because the maximum is 120 minutes.

## Schedule send in Outlook for Mac

Microsoft's article on [Schedule send in Outlook for Mac](https://support.microsoft.com/en-us/outlook/use-schedule-send-in-outlook-for-mac) gives these steps.

1. Compose your message and add at least one recipient on the **To:** line.
2. Click the dropdown arrow on the **Send** button and choose **Schedule send**.
3. Enter the date and time for delivery.
4. Click **OK**.

The message stays in **Drafts** until the scheduled time, and Microsoft says it sends even if Outlook isn't open. That's a real difference from classic Windows Outlook. To cancel, open the message in Drafts, click **Cancel Send** and confirm with **Yes**. The message reopens so you can send it now or reschedule it.

There are requirements. The article lists a Microsoft 365 subscription, Outlook 2019 for Mac or Outlook 2021 for Mac, and an Exchange account, such as Outlook.com hosted on Microsoft 365, or Exchange 2016 CU5 or later. To check your version, go to **Outlook > About Outlook**. Rules for delaying delivery of all messages aren't available on the Mac. Scheduling works only on individual messages and doesn't work with IMAP or POP accounts such as Gmail, Yahoo or iCloud.

## What about Outlook on a phone?

Here I have to be careful. The Microsoft pages I opened for this article don't contain steps for scheduling a send from Outlook for iOS or Android. They don't say it's missing either, so check the app itself: open a new message, look at the options next to the send arrow and see what your version offers.

Don't confuse it with the other "schedule" feature on mobile. Microsoft's page "What does it mean to schedule an email?" is about something different: in Outlook for Android and iOS you swipe a message in the inbox and choose when it should reappear (in a few hours, this evening, tomorrow morning or a custom time). That is snoozing mail you received, not delaying mail you write. The swipe option has to be enabled first.

If you need a guaranteed send time from your phone, write the message in Outlook on the web in a mobile browser or use another device.

## Finding, changing and canceling scheduled emails

Where a scheduled email sits depends on how you scheduled it.

- **New Outlook, web and Mac:** the **Drafts** folder.
- **Classic Outlook with Delay Delivery or the rule:** the **Outbox**.

In new Outlook, **Cancel send** pulls the message back so you can edit or send it. On Mac, **Cancel Send** and **Yes** reopen it. In classic Outlook you can open the message in the Outbox, go back to Delay Delivery on the Options tab and set a new time, or delete the message to cancel.

If a scheduled message bounces, it behaves like any other undeliverable email. You get a non-delivery report from the mail system in your inbox, and the time you picked has no effect on how the bounce is handled. Check the recipient address, fix it and send again.

## Why the Schedule send option is missing

When the button isn't there, work through these causes in order.

1. **Your account is IMAP or POP.** Microsoft says scheduling isn't available for those account types, and Mac scheduling needs an Exchange account.
2. **You're on classic Outlook and looking for the dropdown.** Classic uses Delay Delivery on the Options tab, not a dropdown next to Send.
3. **You're on an older Mac build.** Microsoft's article lists Outlook for Microsoft 365 for Mac, Outlook 2024 for Mac, Outlook 2021 for Mac and mentions Outlook 2019 for Mac. Earlier versions called it Send Later.
4. **You're on a different Outlook than you think.** Switch between new and classic and look again.
5. **Your admin changed something.** If the first four don't explain it, ask IT. The Microsoft pages I read don't describe an admin setting that turns off scheduling, so treat this as a question for IT, not a known switch.

## Recurring emails: Outlook can't do it alone

Outlook doesn't have a built-in recurring send. For a weekly report or a monthly reminder, the clean answer from the Microsoft side is [Power Automate](https://www.m365.fm/entity/power-automate/).

Microsoft's [cloud flow tutorial](https://learn.microsoft.com/en-us/power-automate/get-started-with-cloud-flows) builds a scheduled flow that sends an email on a schedule. Its example runs on the first of every month at a set time. The flow starts with a **Recurrence** trigger and uses the **Send an email** action through an **Office 365 Outlook** connection. You can send to several people by entering more addresses in the **To** field.

The tutorial's steps, in short:

1. Sign in to Power Automate and describe the flow, or build it from a Recurrence trigger.
2. Set the schedule, recipient, subject and body.
3. Confirm the Office 365 Outlook connection and sign in if asked.
4. Select **Create flow**, then **Save**.

Test it with your own address first. If Copilot generated the flow, Microsoft's tutorial says a person should review the result for accuracy before it runs for real. I haven't seen a Microsoft page that describes a safe way to do recurring sends with Outlook rules, so don't build that on rules.

## Scheduling and risk

Scheduled mail carries a quiet risk: you can't see it the way you see sent mail. A message sits in Drafts or the Outbox for hours or days, and the world can change in between. Two habits help.

- Read any message that sits for more than a day before the time arrives, especially if it mentions people, prices or dates.
- Keep sensitive attachments out of messages that wait in Drafts longer than you need.

If your organization has retention or compliance rules, ask your admin how drafts are treated. I can't tell you from the pages I opened, so I won't guess.

## Common mistakes

- **Treating the last Send click as a send.** In Schedule send you select **Send** to queue the message. It leaves later.
- **Closing Outlook on a classic delay.** The Outbox needs a running Outlook, and Microsoft says the delay rule runs on your computer.
- **Looking in Sent Items.** The message isn't there yet. Check Drafts or the Outbox.
- **Scheduling from an IMAP or POP account.** The option isn't available there. Use a Microsoft 365 or Exchange mailbox.
- **Expecting a rule to schedule for tomorrow.** The classic rule defers by 1 to 120 minutes at most.
- **Forgetting the recipient's time.** Check the recipient's time zone before you pick the time. A 9:00 delivery for you can be the middle of the night for someone else.

## Related topics to explore

- **Recalling a message that went out too soon.** Delay Delivery buys you minutes. If the message already left, the recall rules in [Exchange Online](https://www.m365.fm/entity/exchange-online/) depend on the accounts and on whether the recipient opened it.
- **Out-of-office replies.** If you're scheduling because you'll be away, set automatic replies for the same period.
- **Recurring emails with Power Automate.** Learn how triggers and connections work before you let a flow send mail to a distribution list.
- **Sending at the recipient's best time.** Check time zones and working hours before you pick a time.

## Next step

Open a draft in the version of Outlook you actually use, find the Schedule send or Delay Delivery command and queue a test email to yourself for five minutes from now. That tells you where scheduled messages sit in your setup and whether the message leaves on time before you rely on how to schedule an email in Outlook for something important.
