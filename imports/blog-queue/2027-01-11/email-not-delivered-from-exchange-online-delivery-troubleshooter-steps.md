---
title: "Email Not Delivered From Exchange Online: Work Through the Email Delivery Troubleshooter"
summary: "Troubleshoot email delivery in Microsoft 365: check Outlook on the web, run Support and Recovery Assistant, check service health, run the email delivery troubleshooter and use message trace, with the page's timing, retention notes and gaps."
status: review
publish: false
author: mirko-p
date: 2027-01-11
topics: [exchange-online]
keypoints:
  - "The Learn page works in order: check Outlook on the web, run Support and Recovery Assistant, check service health, run the email delivery troubleshooter, then use message trace."
  - "The email delivery troubleshooter needs a Microsoft 365 administrator account. Enter sender and recipient addresses and select Run Tests. It is not available in Government, 21Vianet or Germany clouds."
  - "Message trace is under Admin > Exchange > Mail flow > Message trace. The default scope is the past 48 hours. Data can appear 10 minutes to an hour after sending."
  - "Traces older than seven days are available only as a downloadable CSV file that can take up to an hour to generate. Message traces with data older than seven days are deleted automatically."
  - "The page has no NDR or error code reference, no DNS, SPF, DKIM or DMARC guidance and no guidance on quarantine or mail flow rules."
faq:
  - q: "In what order should I troubleshoot?"
    a: "The page starts with Outlook on the web to look for missing messages, then Support and Recovery Assistant, then the admin tools: Microsoft 365 service health, the email delivery troubleshooter and message trace."
  - q: "How do I run the email delivery troubleshooter?"
    a: "Sign in as a Microsoft 365 administrator, select Diag: Troubleshoot Email Delivery, enter the sender and recipient addresses and other relevant information, and select Run Tests."
  - q: "How do I run a message trace?"
    a: "Open Exchange admin center > Mail flow > Message trace, select a date range, use Add sender and Add recipient, select Search, check the STATUS column, then select the message and Details and follow How to fix it."
  - q: "How far back can I trace?"
    a: "The default is the past 48 hours and traces cover messages from the past week. Older data is available only as a downloadable CSV file that can take up to an hour to generate. Message traces that contain data older than seven days are deleted automatically."
  - q: "What delays delivery?"
    a: "The page names an unresponsive destination as the most likely case, a large message, service latency and filtering service blocks."
---

When a message does not arrive, the cause can sit on the sender side, the recipient side or the service. The Microsoft Learn page on email delivery issues gives an order for finding it. This guide follows that page. It is a procedural guide and not an error code reference.

## Step 1: check the client

- **Outlook on the web.** Look for missing messages there. The page rates it at about 5 minutes.
- **Support and Recovery Assistant.** Run it to fix Outlook problems or account issues. About 10 minutes. The page notes that the Get Help troubleshooters are not available for new Outlook for Windows.

## Step 2: admin tools

If the assistant does not fix the issue, the page offers three tools.

1. **Microsoft 365 service health.** Check for Exchange Online issues. About 5 minutes. If Exchange Online is degraded, delivery might be delayed, and the page says you do not need to open a service request because engineers are already working on it.
2. **Email delivery troubleshooter.**
3. **Message trace** for in-depth troubleshooting. About 15 minutes.

## The email delivery troubleshooter

It requires a Microsoft 365 administrator account. It is not available for Microsoft 365 Government, Microsoft 365 operated by 21Vianet or Microsoft 365 Germany.

1. Select **Diag: Troubleshoot Email Delivery**.
2. Enter the sender and recipient email addresses and other relevant information.
3. Select **Run Tests**.

The page does not describe the output of the tests.

## Message trace

- **Access.** In the Exchange admin center go to Mail flow > Message trace. For small business the page also names Service settings > Email, calendar, and contacts > Email troubleshooting > Troubleshoot message delivery.
- **Default scope.** Messages sent or received in the past 48 hours.
- **Steps for a specific user.**
  1. Select a date range close to when the message was sent.
  2. Use **Add sender** and **Add recipient**.
  3. Select **Search**.
  4. Check the **STATUS** column. A typical message shows Delivered.
  5. Select the message, then **Details**, and follow **How to fix it**.
- **Timing.** Trace data can appear 10 minutes to one hour after sending.
- **Timeouts.** Simplify the search criteria.
- **Older messages.** Traces older than seven days are available only as a downloadable CSV file that can take up to an hour to generate. Message traces that contain data older than seven days are deleted automatically and cannot be deleted manually. Download the CSV from the link in the email notification sent when the trace completes, or open **View pending or completed traces** in the message trace tool.

## Common causes of delay

- The destination is not responsive. The page calls this the most likely case.
- A large message takes a long time to process.
- Latency in the service.
- The filtering service blocked the message.

The introduction also names Outlook problems, service outages, mail flow and spam filter settings and a sender on a global block list. It gives no steps for those.

## What the page does not say

- Any NDR or bounce error code reference.
- Guidance on quarantine, mail flow rules, spam filter policies or block lists.
- DNS, SPF, DKIM or DMARC guidance.
- What results the troubleshooter and the assistant produce.
- A current date. The page's ms.date is 2024-03-14 and it contains at least one typo, so check the live portal navigation before you follow the steps.

## A troubleshooting routine

This routine is my advice, built on the page.

1. Ask the recipient to check Outlook on the web, so you rule out a client problem.
2. Check service health.
3. Run the troubleshooter with the exact sender and recipient addresses.
4. Run a message trace with a narrow date range and read the Details.
5. For messages older than seven days, request the CSV early, because it can take up to an hour.

## Typical mistakes (my advice)

- Starting with message trace before checking the client and service health.
- Searching too wide a date range and getting a timeout.
- Expecting trace data a few seconds after sending.
- Waiting more than seven days, after which the trace is only available as a CSV download.

## Quick reference

| Step | Tool | Time on the page |
| --- | --- | --- |
| 1 | Outlook on the web | 5 minutes |
| 2 | Support and Recovery Assistant | 10 minutes |
| 3 | Microsoft 365 service health | 5 minutes |
| 4 | Email delivery troubleshooter | Not stated |
| 5 | Message trace | 15 minutes |

## Reading the message trace status (my reading)

The STATUS column of a trace shows what happened to each message. A typical message shows Delivered. For other statuses, select the message and then Details, and follow the How to fix it guidance that the page names. The page does not list all status values, so use the Details view for the exact meaning and the recommended action.

## When a trace shows nothing (my advice)

If a search returns nothing, check the date range first. The default scope is the past 48 hours. Trace data can appear 10 minutes to one hour after a message is sent, so a very recent message may not be listed yet. If the search times out, simplify the criteria.

## Related

- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Exchange Online Protection](https://www.m365.fm/entity/exchange-online-protection/)
- [Outlook](https://www.m365.fm/entity/outlook/)

## Sources

- [Find and fix email delivery issues as a Microsoft 365 for business admin (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/exchange/email-delivery/email-delivery-issues)
