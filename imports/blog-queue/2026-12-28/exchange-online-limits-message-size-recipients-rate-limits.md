---
title: "Exchange Online Limits Admins Hit: Message Size, Recipients and Rate Limits"
summary: "The Exchange Online limits admins meet most: message size, recipient and rate limits, mailbox sizes, attachments, transport rules and distribution groups, as stated on the Microsoft Learn service description for Microsoft 365 Enterprise E3 and E5 plans."
status: review
publish: false
author: mirko-p
date: 2026-12-28
topics: [exchange-online]
keypoints:
  - "The default maximum message size is 35 MB for sending and 36 MB for receiving. Admins can set a custom limit between 1 MB and 150 MB."
  - "Sending limits include 10,000 recipients per day, 30 messages per minute and a recipient limit customizable up to 1000 per message. Receiving is limited to 3,600 messages per hour."
  - "User mailboxes are 100 GB on E3 and E5, with warning at 98 GB, prohibit send at 99 GB and prohibit send and receive at 100 GB."
  - "Transport rules are limited to 300 rules, 8 KB per rule and 100 recipients added by all rules. Distribution groups hold up to 100,000 members."
  - "Learn says Exchange Online is not suited for bulk mailing and that most of these limits cannot be modified."
faq:
  - q: "What is the default message size limit?"
    a: "According to Microsoft Learn, 35 MB for sending and 36 MB for receiving. Administrators can set a custom limit between 1 MB and 150 MB, and larger messages are not delivered and the sender receives a non-delivery report."
  - q: "How many recipients can a user send to?"
    a: "The recipient rate limit is 10,000 recipients per day, and the per-message recipient limit is customizable up to 1000 for To, Cc and Bcc. A distribution group in the address book counts as one recipient for the daily limit."
  - q: "What is the message rate limit?"
    a: "30 messages per minute. Learn says that messages submitted via SMTP client above the limit are rejected and the client must retry."
  - q: "How large can a mailbox be?"
    a: "On the page's E3 and E5 values, user mailboxes are 100 GB and archive mailboxes 1.5 TB. Business Basic and Standard archives and E1 differ. The page lists other plans in its tables."
  - q: "Can I change these limits?"
    a: "Learn says you cannot modify most of these limits, but you and your users should be aware of them. Message size and per-message recipient limits are among those that can be customized."
---

Most Exchange Online limits are fixed, and the few that can be changed have caps. This article lists the limits admins hit most often, using the values the Microsoft Learn service description gives for Microsoft 365 Enterprise E3 and E5. The page has separate columns for other plans, so check them if you use another plan.

## Message size

| Item | Limit |
| --- | --- |
| Default maximum message size | 35 MB sending, 36 MB receiving |
| Custom limit range | 1 MB to 150 MB |
| Outlook, Outlook for Mac, migration | 150 MB |
| Outlook on the web | 112 MB |
| Outlook for iOS and Android | 33 MB |
| Encrypted messages (Microsoft Purview Message Encryption) | 100 MB |

Messages larger than the limit are not delivered and the sender receives a non-delivery report. Messages routed outside Microsoft datacenters grow by about 33 percent through encoding, so the effective maximum is 112 MB. Outlook on the web restricts sent messages to 25 percent less than the configured setting. The header size limit is 256 KB, with 32 KB per header, and the subject limit is 255 characters.

## Attachments

250 attachments per message, 250 parts in a multipart message and embedded message depth of 30. File attachment size is 150 MB in Outlook and 112 MB in Outlook on the web, where OneDrive file attachments can be up to 2 GB.

## Sending and receiving

| Limit | Value |
| --- | --- |
| Recipient rate | 10,000 recipients per day |
| Recipients per message | Customizable up to 1000 |
| Message rate | 30 messages per minute |
| Receiving | 3,600 messages per hour from all sources |
| From a single sender | 33 percent of the receiving limit |
| Meeting invitations | 5,000 recipients |
| Encrypted messages | About 200 recipients |
| onmicrosoft.com domain sending | 100 external recipients per organization in a 24 hour rolling window |

After the recipient rate limit is reached, messages cannot be sent until the number of recipients in the past 24 hours drops below it. The tenant external recipient rate limit depends on the license count. The page gives 5,000 per day for trial tenants and no paid-tenant number.

## Mailbox storage

User mailboxes are 100 GB, archive mailboxes 1.5 TB with auto-expanding archiving, shared and resource mailboxes 50 GB without a license and 100 GB with an E3 or E5 license, public folder mailboxes 100 GB each and group mailboxes 50 GB. Alerts: warning at 98 GB, prohibit send at 99 GB, prohibit send and receive at 100 GB. At the last stage Exchange Online rejects incoming mail and sends a non-delivery report.

## Rules and groups

- Transport rules: 300 rules, 8 KB per rule, 20 KB for all regular expressions and simple expressions, 100 recipients added by all rules and 10 forwardees.
- Journal rules: 300.
- Distribution groups: 100,000 members. Groups of 5,000 or more members need delivery management or message approval. Maximum message size is 25 MB for groups with 5,000 to 99,999 members and 5 MB for 100,000 members.
- Holds: the recommended maximum is 25 per mailbox and the supported limit is 50.

## Inconsistencies on the page

The attachment scanning limit appears as 1 MB in a table, while the text says the first 2 MB of extracted text is inspected. Check the page for the current value.

## Practical notes

This section is a suggestion. When a user reports a bounce, compare the message size with the client limit and remember the 33 percent encoding growth. For senders reaching the daily recipient limit, the page recommends third-party providers or Azure Communication Services email for bulk scenarios, because Exchange Online is not suited to bulk mailing. Using journaling, transport rules or auto-forwarding to copy mail into an Exchange Online mailbox for archiving is not permitted.

## Not covered

The values above are for E3 and E5. Other plans and the tenant external recipient limit for paid tenants are not given here.

## Related

- [Exchange Online](https://www.m365.fm/entity/exchange-online/)

## Sources

- [Exchange Online limits](https://learn.microsoft.com/office365/servicedescriptions/exchange-online-service-description/exchange-online-limits)
