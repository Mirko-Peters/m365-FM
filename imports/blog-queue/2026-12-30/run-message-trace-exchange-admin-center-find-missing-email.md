---
title: "Run a Message Trace in the Exchange Admin Center to Find a Missing Email"
summary: "Find a missing email with message trace in the new Exchange admin center using Microsoft Learn: permissions, the Message trace path, search criteria, the 10-day and 90-day limits, delivery status values, Summary versus Enhanced summary and Extended reports, and the PowerShell alternative."
status: review
publish: false
author: mirko-p
date: 2026-12-30
topics: [exchange-online, message-trace]
keypoints:
  - "Go to admin.exchange.microsoft.com, then Mail flow, Message trace, and select Start a trace. The default searches all senders and recipients for the last two days."
  - "You can search up to 90 days of history, but only up to 10 days at a time. Longer ranges produce only a downloadable CSV report."
  - "The Summary report loads on screen for ranges under 10 days. Enhanced summary and Extended reports are CSV downloads that need a sender, recipient or message ID."
  - "The statuses Pending, Quarantined and Filtered as spam are available only for searches under 10 days, and status can lag by 5 to 10 minutes."
  - "Get-MessageTraceV2 requires Exchange Online PowerShell V3 module 3.7.0 or later and returns 1,000 results by default and 5,000 at most."
faq:
  - q: "Which roles do I need?"
    a: "According to Microsoft Learn, membership in the Organization Management role group in Exchange Online, and in Microsoft Entra the Global Administrator or Exchange Administrator role. Learn recommends the role with the fewest permissions."
  - q: "How far back can I search?"
    a: "Up to 90 days, with the default at two days. Only up to 10 days can be queried at a time."
  - q: "What do I do for a range longer than 10 days?"
    a: "Run a downloadable Enhanced summary or Extended report, which requires a sender, recipient or message ID. Preparation can take several hours."
  - q: "Which delivery statuses exist?"
    a: "All, Delivered, Expanded, Failed, Pending, Recalled, Quarantined, Filtered as spam and Getting status. Pending, Quarantined and Filtered as spam are only for searches under 10 days."
  - q: "Can I see message content?"
    a: "No. Learn describes metadata only, not message bodies."
---

A message trace shows what Exchange Online did with a message. This guide follows the Microsoft Learn article on message trace in the new Exchange admin center.

## Permissions

Learn lists membership in the Organization Management role group in Exchange Online, plus the Global Administrator or Exchange Administrator role in Microsoft Entra. It recommends the role with the fewest permissions and reserves Global Administrator for emergencies.

## Start a trace

1. Go to `https://admin.exchange.microsoft.com`, then **Mail flow**, **Message trace**. The direct link is `https://admin.exchange.microsoft.com/#/messagetrace`.
2. Select **Start a trace**. The **New message trace** flyout defaults to all senders and recipients for the last two days.
3. Enter the sender and recipient addresses. Wildcards such as `*@contoso.com` work, with one wildcard per value. Separate several values with semicolons, spaces or new lines.
4. Choose the time range. The default is two days, and up to 90 days is possible.
5. Open **Detailed search options** if needed.

The page shows tabs for Default queries, Custom queries, Autosaved queries (the last 10 run) and Downloadable reports.

## Search options

- **Subject:** starts with, ends with or contains.
- **Delivery status:** see below.
- **Message ID:** the internet Message-ID with angle brackets, constant for the life of the message.
- **Network Message ID:** per instance, found in headers such as X-MS-Exchange-Organization-Network-Message-Id.
- **Direction:** All, Inbound or Outbound.
- **Original client IP address:** only for 10 days, and only in the Enhanced summary or Extended report.

## Delivery status

| Status | Meaning |
| --- | --- |
| Delivered | Delivered to the intended destination |
| Expanded | A distribution group was expanded before delivery |
| Failed | Not delivered |
| Pending | Delivery attempted or being reattempted |
| Recalled | Recalled |
| Quarantined | Quarantined as spam, bulk or phishing |
| Filtered as spam | Identified as spam and rejected or blocked, not quarantined |
| Getting status | Received recently, check again in a few minutes |

Pending, Quarantined and Filtered as spam are available only for searches under 10 days. Older data needs `Start-HistoricalSearch`.

## Report types

| Report | When | Limit | Format |
| --- | --- | --- | --- |
| Summary | Under 10 days, no extra filter | Up to 20,000 results | On screen |
| Enhanced summary | Needs sender, recipient or message ID | Up to 100,000 | CSV |
| Extended | Needs sender, recipient or message ID | Up to 1,000 | CSV |

For downloadable reports enter a title and a notification email in an accepted domain, select **Prepare report** and follow progress on **Downloadable reports**. The maximum CSV size is 800 MB. The last 24 hours of archived data is typically not available for Enhanced or Extended reports. The page is inconsistent on the Summary limit, giving 20,000 in one place and 10,000 in the scroll-loading section.

## Read the results

Select a row to see message events such as Receive, Send, Fail, Deliver, Expand, Transfer, Defer, Resolved, DLP rule and Sensitivity label, plus message ID, size and IPs. The Extended report adds routing detail, and its custom_data field holds agent logs such as S:SFA for spam, S:AMA for malware and S:TRA for transport rules.

## PowerShell

`Get-MessageTraceV2` needs Exchange Online PowerShell V3 module 3.7.0 or later. It returns 1,000 results by default and up to 5,000, with no pagination, and is limited to 100 requests per 5 minutes per tenant. Learn's example pipes it to `Get-MessageTraceDetailV2`.

## Troubleshooting a missing email

This section is a suggestion. Search by sender and recipient for a narrow window first. A status of Quarantined or Filtered as spam points to the protection stack, Failed to the delivery path. If the trace finds nothing, widen the window or check the sender's address spelling.

## Summary report output

The Summary report shows Date, Sender, Recipient, Subject (first 256 characters) and Status, sorted newest first. The first 250 results load and more load as you scroll. You can sort columns, use the Search box without wildcards, and filter on Sender, Recipient, Subject or Status with the operators starts with or is. Export results creates a CSV, and Edit message trace lets you change the criteria. Selecting a row's checkbox enables View in Explorer, Go Hunting for Defender for Office 365 Plan 2, and Find related, which finds records with the same Message ID.

## Enhanced summary columns

The Enhanced summary CSV includes origin_timestamp, sender_address, Recipient_status in the form address##status, message_subject, total_bytes, message_id, network_message_id, original_client_ip and directionality. The columns connector_id and delivery_priority appear only in this report.

## Not covered

The page does not show message bodies, and Outlook-applied labels do not appear in sensitivity label events.

## Related

- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Message trace](https://www.m365.fm/entity/message-trace/)

## Sources

- [New Message trace in the Exchange admin center](https://learn.microsoft.com/exchange/monitoring/trace-an-email-message/message-trace-modern-eac)
