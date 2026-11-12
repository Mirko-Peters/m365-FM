---
title: "How to BCC in Outlook: Show the Bcc Field and Send Privately"
summary: "How to BCC in Outlook: show the Bcc field in new Outlook, classic and Mac, check Bcc in Sent Items, and avoid recipient limits, spam flags and reply-all slips."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [outlook, exchange-online, distribution-list]
keypoints:
  - "In new Outlook, open a message, select Options, then Show fields, then Show Bcc, and add the addresses on the Bcc line."
  - "On a Mac, click Bcc at the right end of the To line, or turn on Show BCC field by default under Outlook, Settings, Composing."
  - "Bcc recipients get a copy, but other recipients can't see their addresses, and a Bcc recipient can't tell whether the sender used Bcc."
  - "Many junk filters flag messages that use Bcc, so recipients may need to add you to their Safe Senders list."
  - "Exchange Online counts Bcc toward the per-message limit of 1,000 recipients and the 10,000 recipients per day limit."
faq:
  - q: "How do I show the Bcc field in Outlook?"
    a: "In new Outlook, open a new message, select Options, then Show fields, then Show Bcc. In Outlook for Mac, click Bcc at the right end of the To line. Classic Outlook has a Bcc command on the Options tab. Add the addresses to the Bcc line and send."
  - q: "Can the other recipients see who is in Bcc?"
    a: "No. Microsoft says a Bcc recipient gets a copy without their name being visible to the other recipients. Only the sender can see the Bcc names, and only in the copy in Sent Items. A person who receives the message as a Bcc recipient also can't tell whether the sender used Bcc for other people."
  - q: "Is there a limit to how many people I can Bcc?"
    a: "Yes. In Exchange Online, the To, Cc and Bcc fields together are limited to 1,000 recipients per message by default, and each user can send to 10,000 recipients per day. Bcc addresses count toward both limits. A distribution group in the shared address book counts as one recipient, but members of a personal contact group count individually."
---
To BCC in Outlook, open a new message, show the Bcc field and put the addresses you want to keep private on that line. In new Outlook that's Options, Show fields, Show Bcc. On a Mac you click Bcc at the right end of the To line. Everyone on the Bcc line gets a copy, and nobody else on the message sees their addresses. This article is for [Outlook](https://www.m365.fm/entity/outlook/) users who send group messages, announcements or anything where the recipients shouldn't see each other, and it explains the limits, the spam side effect and the mistakes that cause real leaks.

## What Bcc does and doesn't do

Bcc stands for blind carbon copy. Microsoft's page on [showing and viewing the Bcc field](https://support.microsoft.com/en-us/outlook/mail/show-hide-and-view-the-bcc-blind-carbon-copy-field-in-outlook-for-windows) describes it as a way to send a copy of an email to people without showing their names to the other recipients. Microsoft's Mac article adds two details: as a recipient, you can't tell whether the sender used Bcc, and only the sender can see the Bcc names, and only in Sent Items.

That gives you a clear picture of what Bcc is good for:

- Keeping recipients' identities private when you write to a group of people who don't know each other.
- Protecting addresses from being copied and abused for spam.
- Moving people off a runaway reply-all thread. Microsoft names this use itself.

It doesn't hide anything from the sender's mail system, it doesn't encrypt anything and it doesn't stop a recipient from forwarding what they got. If the content is sensitive, Bcc is not the control you need. Look at encryption and sensitivity labels instead.

One more thing worth knowing: the To and Cc recipients can see each other. So if you put your own address in To and everyone else in Bcc, that works fine for a mailing, but a Bcc recipient who hits Reply All answers the people on To and Cc, which here is just you. That's standard email behavior rather than something Microsoft's pages spell out, so test it with two of your own addresses before you rely on it.

## How to show and use the Bcc field

### New Outlook for Windows

1. Open a new message, or reply to one.
2. Go to **Options**, then **Show fields**, then select **Show Bcc**.
3. Add the names or addresses of the people you want on the Bcc line.

Microsoft's page on [creating an email message in Outlook](https://support.microsoft.com/en-us/outlook/mail/create-an-email-message-in-outlook) adds a shortcut: if you don't see a Bcc button on the message, select **Bcc** to the right of the **To** button. You can also select the **To**, **Cc** or **Bcc** button to open the Add recipients window, pick names with the plus sign and select **Save**.

If these steps don't match your screen, you may not be on new Outlook yet. Microsoft points you to the Classic Outlook steps in that case.

### Classic Outlook for Windows

In classic Outlook, look for a **Bcc** command on the **Options** tab of the message window. Turning it on adds a **Bcc** line below **Cc**. Microsoft documents the classic steps on a separate tab of its page, which I couldn't open, so if the button isn't where you expect it, check the Classic Outlook tab there. Then send a test to find out whether the field stays on for your next new message.

### Outlook on the web

Microsoft's pages I opened don't document the web steps. The web app is close to new Outlook, so look for **Bcc** next to the **To** line in a new message, or try **Options** and the Show fields menu.

### Outlook for Mac

Microsoft's [Mac article on the Bcc field](https://support.microsoft.com/en-us/office/show-hide-and-view-the-bcc-field-in-outlook-for-mac-275f57a6-9d6e-4b00-b8c8-3b06b20d71ec) gives these steps:

1. Create a new email message.
2. At the right end of the **To** line, click **Bcc**.
3. Add recipients in the **Bcc** box, write the message and click **Send**.

To always see the field, select the **Outlook** menu, then **Settings**, then **Composing**, and enable **Show BCC field by default**. The steps cover Outlook for Microsoft 365 for Mac, Outlook 2021 for Mac and Outlook 2019 for Mac.

## How to check who you put in Bcc

You can't see Bcc names in a received copy, but you can see them in your own sent message. On the Mac, Microsoft's steps are:

1. Open the **Sent Items** folder.
2. Open the message you sent.
3. Check the message header for the **Bcc** recipients. In the Reading Pane, select **more** to expand a long list, since a count such as "11 more" means additional Bcc recipients are listed.

This is also your best check after a mistake. If you realize a name went on the To line instead of Bcc, the sent copy tells you exactly what the other recipients saw.

## Sending to a large group

Bcc is the usual way to write to a group without exposing addresses. Do it in this order:

1. Put your own address (or a neutral one) in **To**. Many senders do this so the message doesn't look like it has no recipient.
2. Put everyone else in **Bcc**. You can paste a list of addresses separated by semicolons.
3. Write the message without mentioning individual recipients.
4. Before you send, read the To and Cc lines one more time to make sure no outside address ended up there.

A [distribution list](https://www.m365.fm/entity/distribution-list/) or contact group can sit in the Bcc line too, which saves you from pasting addresses. Microsoft warns about one effect: putting a distribution list in Bcc can break recipients' rules that sort mail by the list name in To or Cc. If people say their folders stopped filling, that's a likely cause.

### The limits that apply

[Exchange Online](https://www.m365.fm/entity/exchange-online/) has hard limits, and Bcc doesn't get around them. From Microsoft's [Exchange Online limits page](https://learn.microsoft.com/en-us/office365/servicedescriptions/exchange-online-service-description/exchange-online-limits):

- The To, Cc and Bcc fields together can hold up to 1,000 recipients per message by default. Admins can set the limit between 1 and 1,000.
- Each user can send to 10,000 recipients per day, over a rolling 24-hour period. Bcc recipients count.
- A distribution group in the shared address book counts as one recipient. Members of a group in your personal Contacts folder count individually.
- Messages to groups with 5,000 or more members need delivery management or message approval to be configured.
- Outbound mail from onmicrosoft.com domains is limited to 100 external recipients per organization in 24 hours.

Microsoft's own page says that for high-volume external sending, you should use a third-party bulk email provider or Azure Communication Services email. A newsletter to hundreds of readers shouldn't be built on Outlook Bcc.

## Bcc and spam filters

Microsoft says many junk filters flag messages that use Bcc, so recipients may need to add your name to their Safe Senders list. That fits what you'd expect: a message that doesn't carry the recipient's address in To looks like bulk mail to a filter.

What helps, in practical terms:

- Keep the group small enough to be personal.
- Use a clear subject line that says why you're writing.
- Ask the first recipients to add your address to their safe senders if the message matters.
- Send a test to an address you control on another provider and see where it lands.

## When a Bcc message doesn't arrive

If someone says they never got your message, work through the likely causes in this order.

1. **Junk folder.** Per Microsoft, many junk filters flag messages that use Bcc. Ask the person to look in Junk and to add your address to their Safe Senders list.
2. **A typo in one address.** One bad address in a long Bcc list bounces back to you as a non-delivery report. Check the report for the address that failed.
3. **Recipient limits.** A message over the per-message recipient limit, or a day of sending that crossed 10,000 recipients, won't go through. Messages sent from an onmicrosoft.com domain to more than 100 external recipients in 24 hours return NDRs with the code 550 5.7.236, according to Microsoft's limits page.
4. **Rules on the other side.** If you put a distribution list in Bcc, recipients' rules that expect the list name in To or Cc won't fire, and the mail lands in the inbox instead of their folder.

Can you add a Bcc recipient after you've sent? No. The message is out with the recipients it had. Forward the sent copy to the missing person, and say in a line that you're forwarding it. If you Bcc'd the wrong person, a recall may work inside a Microsoft 365 organization, but it depends on the conditions in Microsoft's recall rules and you shouldn't count on it.

## Bcc in regulated workplaces

In some companies, hidden recipients clash with transparency or audit rules. Sending a copy to someone who shouldn't be on a thread is a data-handling question as much as a courtesy question. The sent copy shows the Bcc names to you, and your organization's mail system keeps its own records. If your job involves personal data, contracts or legal matters, ask your compliance or IT team what the rule is for Bcc and whether data loss prevention policies apply to your messages.

## Is Bcc rude?

It depends on what you use it for. Using Bcc to protect a group's addresses is normal and expected. Using it to quietly bring a boss into a one-on-one thread is another matter. If the person on the other side finds out, you lose trust fast, and as a Bcc recipient you also can't be sure the other side knows you're there.

My advice: use **Cc** when the conversation should be open, and **Bcc** when privacy is the point. If you need someone to see a thread for the record, forward it afterwards and say you did.

## Common mistakes

- **Typing the group into To.** It's the classic leak. Check the To and Cc lines before every group send.
- **Forgetting the Bcc field is hidden.** In some views you only see the fields you turned on. Show Bcc first, then add people.
- **Assuming Bcc protects sensitive content.** It hides recipient names only. The message can still be forwarded or read by anyone who gets it.
- **Replying all from a Bcc position.** Your answer goes to the visible recipients. If you don't want them to see it, reply only to the sender.
- **Ignoring limits.** Large lists hit the 1,000-recipient cap or the daily 10,000-recipient limit and end in a bounce.
- **Using a distribution list in Bcc and breaking rules.** Recipients who sort by the list name in To or Cc stop seeing the mail in their folder.
- **Skipping the Sent Items check.** After a mistake, open the sent copy and look at the header.

## Related topics to explore

- **Hiding recipients in a more controlled way.** For regular mailings, a distribution list in the shared address book counts as one recipient, which also helps with limits.
- **Bcc in a compliance setting.** Admins in regulated companies should ask how the organization treats hidden recipients in audits and retention. Ask your compliance team rather than assuming.
- **Spam filtering and safe senders.** If your group mailings keep landing in junk, ask the recipients' admins to allow your sender.
- **Meeting invitations.** Bcc works differently for meetings, and Microsoft documents a separate article on adding Bcc recipients to a meeting request.

## Next step

Open a new message in your Outlook, show the Bcc field and send a test to two of your own addresses, one in To and one in Bcc. Look at both copies and at the Sent Items header, and you'll know exactly how to BCC in Outlook without leaking an address.
