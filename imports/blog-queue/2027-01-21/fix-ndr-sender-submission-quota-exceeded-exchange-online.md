---
title: "Fix NDR Submission Quota Exceeded in Exchange Online: Recipient Rate Limit"
summary: "The NDR 'sender's submission quota was exceeded' means a mailbox hit the Exchange Online recipient rate limit of 10,000 recipients per day. What to do as sender and admin, how the limit counts, and when to suspect a compromised account."
status: review
publish: false
author: mirko-p
date: 2027-01-21
topics: [exchange-online, defender-for-office-365]
keypoints:
  - "Learn says the NDR appears because the mailbox exceeded the recipient rate limit of 10,000 recipients per day."
  - "The limit works on a 24-hour window. Sending resumes when the recipients counted in the past 24 hours drop below the limit."
  - "If you did not send the messages, treat the account as possibly compromised: reset the password, scan devices and follow the compromised account guidance."
  - "The attacker might have set Inbox rules to forward messages or added mailbox delegates, so check those settings too."
  - "Legitimate bulk email such as newsletters belongs with a specialized third-party provider, per the Exchange Online limits page."
faq:
  - q: "What does the submission quota exceeded NDR mean?"
    a: "According to Microsoft Learn, the message text is: The message can't be submitted because the sender's submission quota was exceeded. You received it because you exceeded the recipient rate limit of 10,000 recipients per day. The Learn page I read does not quote a status code such as 5.2.2 in its text."
  - q: "How long do I have to wait?"
    a: "Learn says that if you sent 10,000 messages in the last 24 hours, you need to wait one day before you can send email from your mailbox. The Exchange Online limits page gives an example: a user who reaches the limit by sending to 5,000, 2,500 and 2,500 recipients between 09:00 and 11:00 cannot send again until 09:00 the next day."
  - q: "How are recipients counted?"
    a: "The limits page says the recipient rate limit is the maximum number of recipients a user or mailbox can send to in a 24-hour period, applied per user to all outbound and internal messages. A distribution group stored in the organization's address book counts as one recipient, while members of a group stored in a mailbox Contacts folder are counted individually."
  - q: "What if I did not send those messages?"
    a: "Learn says to reset your password and scan your devices for malware if you suspect the account has been compromised. The attacker might also have configured Inbox rules to forward messages or added mailbox delegates, so follow the steps in the guide on responding to a compromised account."
  - q: "Where do I send newsletters or bulk email?"
    a: "The Exchange Online limits page says customers who need to send legitimate bulk commercial email, for example customer newsletters, should use third-party providers that specialize in these services. For high-volume mail to external recipients, it also names Azure Communication Services email."
---

The NDR "The message can't be submitted because the sender's submission quota was exceeded" means a mailbox reached the Exchange Online recipient rate limit of 10,000 recipients per day. If the user really sent that many messages, sending resumes after the 24-hour window moves on. If the user did not, suspect a compromised account.

## What the bounce says

Microsoft Learn gives the message as: *The message can't be submitted because the sender's submission quota was exceeded.* The cause it names is that you exceeded the recipient rate limit, 10,000 recipients per day.

The Learn page I read does not quote a status code such as 5.2.2 in its text. Use the message text to identify the case.

## If you are the sender

- If you sent 10,000 messages in the last 24 hours, wait one day before you can send email from your mailbox.
- If you did not send the messages and suspect your account is compromised, reset your password and scan your devices for malware.
- An attacker might have changed other settings, for example Inbox rules that forward messages or extra mailbox delegates. Learn says to follow the steps in the guide on responding to a compromised account.

## If you are the admin

Learn points to two things:

1. The sending limits in the Exchange Online limits page.
2. The possibility that the sending account is compromised. Follow the compromised account response guide, and to prevent future compromises follow the recommendations in the article on the top 10 ways to secure Microsoft 365 for business plans.

## How the limit works

The Exchange Online limits page defines the recipient rate limit as the maximum number of recipients that a user or mailbox can send to in a 24-hour period, applied per user to all outbound and internal messages. Details from that page:

- Exchange Online uses the limit to discourage the delivery of unsolicited bulk messages.
- A distribution group stored in the organization's address book counts as one recipient. For groups stored in the Contacts folder of a mailbox, the members are counted individually. In a personal distribution list, each recipient is counted separately.
- The table lists 10,000 recipients per day for the plans shown.
- After the limit is reached, messages cannot be sent from the mailbox until the number of recipients sent to in the past 24 hours drops below the limit. The page's example: 5,000 recipients at 09:00, 2,500 at 10:00 and 2,500 at 11:00 reach the limit, and the user cannot send again until 09:00 the next day.
- Sending from another mailbox through permissions counts for the delegate with rights, not for the mailbox that is sent from.

Related limits on the same page, so you do not confuse them:

| Limit | What it is |
| --- | --- |
| Recipient limit | Maximum recipients in the To, Cc and Bcc fields of one message. Customizable up to 1000 recipients in the table |
| Message rate limit | How many messages a user can send in a period. The table shows 30 messages per minute. Over this rate via SMTP client submission, messages are rejected and the client must retry |
| Tenant External Recipient Rate Limit | Maximum external recipients a tenant can send to per day, depending on the number of licenses. The limit for a trial tenant is capped at 5,000 external recipients per day |

The page also states that outbound mail from default onmicrosoft.com domains is limited to 100 external recipients per organization in a 24-hour rolling window, with NDRs carrying code 550 5.7.236 when throttled. That is a separate case from the submission quota.

## Legitimate bulk sending

The limits page says Exchange Online customers who need to send legitimate bulk commercial email, such as customer newsletters, should use third-party providers that specialize in these services. For organizations that need to send more email to external recipients than the tenant limits allow, it recommends Azure Communication Services email for bulk or high-volume mail to external recipients.

## Telling a compromise from a real campaign (my advice)

This section is my experience, not Microsoft text:

- A mailbox that normally sends a few dozen messages a day and suddenly hits 10,000 recipients is suspicious.
- Marketing or an application that sends from a normal user mailbox is a design problem. Move it to a mail service meant for bulk.
- Check forwarding rules and delegates before you reset anything, so you know what the attacker changed.

## A short order of work (my advice)

1. Ask the user whether they sent the volume.
2. If not, reset the password, sign out sessions, scan devices and review rules and delegates as in the Learn guide.
3. If yes, plan the send so each mailbox stays below 10,000 recipients per 24 hours, or use a bulk provider.
4. Document what happened so you can tell a repeat from a one-off.

## What the Learn pages leave open

The NDR article is short and gives no admin center path for reviewing sent volume. The limits page mentions a Tenant Outbound External Recipients report under EAC Reports > Mail flow, for the tenant limit. I do not describe a per-mailbox report here.

## Related

- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Microsoft Defender for Office 365](https://www.m365.fm/entity/defender-for-office-365/)

## Sources

- [Fix error "sender's submission quota exceeded" in Exchange Online (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/exchange/email-delivery/ndr/fix-error-for-submission-quota-exceeded-in-exchange-online)
- [Exchange Online limits (Microsoft Learn)](https://learn.microsoft.com/office365/servicedescriptions/exchange-online-service-description/exchange-online-limits)
