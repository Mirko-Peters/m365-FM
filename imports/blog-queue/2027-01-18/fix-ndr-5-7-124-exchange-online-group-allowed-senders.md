---
title: "Fix NDR 5.7.124 in Exchange Online: Sender Not in the Group's Allowed List"
summary: "NDR 5.7.124 means the sender is not on the allowed senders list of the group they wrote to, even as a member. Learn gives a sender fix and two admin methods in the Exchange admin center, plus a note on groups above 5,000 members that restrict senders automatically."
status: review
publish: false
author: mirko-p
date: 2027-01-18
topics: [exchange-online, distribution-list]
keypoints:
  - "5.7.124 means the sender is not in the group's allowed senders list, either directly or as a member."
  - "Depending on how the group is configured, even the group owner may need to be on the list, according to Learn."
  - "Senders can try to join the group, which may need owner approval; if that is not possible, the owner must add them to the list."
  - "Admins use Delivery management in the Exchange admin center to add specified senders or to allow people inside and outside the organization."
  - "Groups with more than 5,000 members get automatic restrictions: senders must be members, messages need moderator approval, and large messages cannot be sent."
faq:
  - q: "What does NDR 5.7.124 mean?"
    a: "Learn says the sender is not in the allowed senders list of the group, either directly or as a member of a group on that list. Exchange Online rejected the message for that reason."
  - q: "I own the group. Why did my message bounce?"
    a: "Learn says that, depending on how the group is configured, even the group owner might need to be in the allowed senders list. My advice, not Learn's: if delivery is limited to specified senders, check whether the owner is on the list."
  - q: "How does a sender fix it without an admin?"
    a: "Learn says members can typically send to the group. If the group is in your organization, try to join it in Outlook or Outlook on the web, which may need the owner's approval. If the group is not in your organization or does not allow join requests, ask the group owner to add you to the allowed senders list."
  - q: "How do I let an external sender write to the group?"
    a: "Learn says an external sender needs a mail contact or mail user first, so they can be added to the list. Alternatively, an admin can choose to allow messages from people inside and outside the organization."
  - q: "Why do groups with over 5,000 members behave differently?"
    a: "Learn says groups with more than 5,000 members get automatic restrictions: senders must be members, messages need moderator approval, and large messages cannot be sent, which causes a different NDR."
---

NDR 5.7.124 means Exchange Online rejected a message because the sender is not on the allowed senders list of the group they wrote to. Microsoft Learn says the sender must be in that list either directly or as a member of a group on it, and that, depending on the group's configuration, even the group owner may need to be added. The fix is either on the sender's side, by joining the group or asking the owner, or on the admin side, by changing delivery management for the group.

## What the error means

The recipient is a group whose allowed senders list does not include the sender. Learn's wording is that the sender isn't in the group's allowed senders list, directly or as a member. The wording in the NDR points to the group's allowed senders setting, not to the content of the message. That reading is mine, not a statement from the page.

## If you are the sender

Learn says members of a group can typically send messages to it. Its two paths:

1. **Join the group.** If the group is in your Exchange Online organization, try to join it in Outlook or Outlook on the web. You might have to wait for the group owner to approve your request.
2. **Ask the owner.** If the group is not in your organization, or does not allow requests to join, ask the group owner to add you to the allowed senders list. Learn says the instructions for finding the group owner are in the NDR.

If you own the group yourself and still get the bounce, Learn says that depending on the group's configuration even the owner might need to be in the list. Use the owner steps below.

## If you are the owner or an admin

Learn describes two methods in the Exchange admin center. Both change the delivery management settings of the group.

### Method 1: add the sender to the allowed list

In the new Exchange admin center:

1. Go to **Recipients** > **Groups** and open the **Distribution list** tab.
2. Select the group, then **Settings** > **Delivery management** > **Edit delivery management**.
3. Choose **Only allow messages from people inside my organization**.
4. Add the senders under **Specified senders**, then **Save changes**.

In the classic Exchange admin center, the path is **Recipients** > **Groups** > **Edit** > **Delivery management**, where you use **Add**.

If the sender is outside the organization, Learn says you need a mail contact or a mail user first, so there is an object that can be added to the list.

### Method 2: open the group to everyone

If the group should accept mail from anyone, choose **Allow messages from people inside and outside my organization** in the new Exchange admin center. In the classic one, remove the entries from the list and select **Senders inside and outside of my organization**.

This is the right choice only if you want the group open. Learn presents it as an option, not as a recommendation.

## Large groups

Learn says groups with more than 5,000 members get automatic restrictions: senders must be members, messages need moderator approval, and large messages cannot be sent. The last point leads to a different NDR, so it is not the same problem as 5.7.124. My advice, not Learn's: if the group in question is that large, check these restrictions before you spend time on the allowed list.

## Choosing between the two methods

This section is my advice, not a Microsoft statement.

1. **Ask what the group is for.** A team alias that outside customers should reach is a candidate for Method 2. A group meant for internal announcements usually should keep a list.
2. **Prefer a short list of senders over opening the group.** Opening a group to everyone also lets spam reach it. If you open it, plan to watch for abuse.
3. **Add people through a group when the list grows.** Learn says the allowed list can hold the sender directly or a group the sender belongs to, and its classic Exchange admin center steps let you select the sender or such a group, so a small sender group can be easier to maintain than a long list of individuals.
4. **Handle external senders on purpose.** Create the mail contact, add it to the list and note why it exists, so it is not removed later by mistake.
5. **Tell the sender what happened.** A short reply that names the group, the setting and the fix saves a second ticket.

## A short checklist

This section is my advice, not a Microsoft statement.

- Read the NDR and confirm the code is 5.7.124, not another 5.7.x code.
- Identify the group and its delivery management setting.
- Check whether the sender is internal or external.
- Check whether the owner is on the list.
- Check the member count, in case the 5,000 member restrictions apply.
- Apply Method 1 or Method 2, then ask the sender to resend.

## What the page does not cover

The Learn page covers this NDR for groups in the Exchange admin center, and the steps above are the ones it gives. It does not describe PowerShell commands for delivery management in this article, so I do not give any, and it does not say how long a change takes to apply.

## Communicating the fix

This section is my advice, not a Microsoft statement. Most of the work after the technical change is communication. The sender saw a bounce message and may not know what a group delivery restriction is, so a short explanation helps: the group only accepts mail from certain people, you have now been added, please resend. For an owner who bounced from their own group, mention that the owner may also need to be on the list, which is the point Learn makes. For groups with a large audience, such as a company announcement address, agree on who is allowed to send and write it down, so the next request for access is a quick decision instead of a discussion.

## Related

- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Distribution list](https://www.m365.fm/entity/distribution-list/)

## Sources

- [Fix NDR error 5.7.124 in Exchange Online - Exchange (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/exchange/email-delivery/ndr/fix-error-code-5-7-124-in-exchange-online)
