---
title: "Azure Monitor Alert Fired but No Notification Arrived: Email, SMS, Voice and Webhook Checks"
summary: "A fired Azure Monitor alert with no email, SMS, voice call or webhook behind it has a short list of documented causes: alert processing rules, role scope, spam filters, unsubscribes, rate limits and webhook rules. Checks in the Learn order."
status: review
publish: false
author: mirko-p
date: 2027-01-21
topics: [azure-monitor, teams]
keypoints:
  - "Test the action group first. If the alert fires but notifications fail, Learn says to test the action group before anything else."
  - "Open the fired alert, look at its History tab and check whether an alert processing rule suppressed an action group."
  - "Email is rate limited to no more than 100 emails every hour per address. SMS and voice to no more than one notification every five minutes per number."
  - "Email Azure Resource Manager Role only looks at role assignments at the subscription scope, of type User or Group."
  - "Webhooks, logic apps, functions and runbooks are not rate limited. A failing webhook is retried up to five times, then paused for 15 minutes."
faq:
  - q: "What should I check first when an alert fired but I got no email?"
    a: "Learn lists, in order: whether an alert processing rule suppressed the action group (check the History tab of the fired alert), whether the action type is Email Azure Resource Manager Role with a role assigned below subscription scope, whether your mail server accepts the sender addresses, inbox rules and spam filters, an accidental unsubscribe from the action group, and the email rate limit."
  - q: "Which sender addresses should I allow?"
    a: "The troubleshooting page says to allow azure-noreply@microsoft.com, azureemail-noreply@microsoft.com and alerts-noreply@mail.windowsazure.com in email filtering and spam prevention services. It adds that internal mailing lists or distribution lists often block external senders, and suggests testing with a regular work address instead of a list."
  - q: "What are the notification rate limits?"
    a: "Per the page, email is limited to no more than 100 emails every hour to each email address. SMS and voice calls are limited to no more than one notification every five minutes per phone number, and notifications above that are dropped. Webhook, logic app, Azure function and automation runbook actions are not rate limited."
  - q: "Why did my webhook stop being called?"
    a: "Learn says that if the first call fails, it is retried at least once and up to five times with delays of 5, 20 and 40 seconds between attempts. After the retries fail, no action group calls the endpoint for 15 minutes. Status codes 408, 429, 503 and 504 allow a retry. It also notes webhooks support public networks only, so source IP addresses must be allowed."
  - q: "Can an alert processing rule hide notifications?"
    a: "Yes. A rule can suppress action groups, and the History tab of the fired alert shows the suppressed ones. Learn adds that service health alerts are not affected by alert processing rules, and that a disabled rule has no effect. If the suppression was unintentional, you can modify, disable or delete the rule."
---

If an Azure Monitor alert shows as fired in the portal but no email, SMS, voice call or webhook followed, the cause usually sits between the alert and the receiver. The Microsoft Learn troubleshooting page for alerts and notifications gives a numbered list of checks per notification type. This article reorders them into one path and keeps Learn's wording where it matters.

## Step 0: Test the action group

Learn says that if the alert fires as intended but the notifications do not behave as expected, test your action group first to make sure it is configured correctly. If the test notification arrives, the action group works, and the problem is in how the alert reaches it.

## Step 1: Was the action suppressed?

This check is the first item for email, SMS, voice, push and webhook problems. An alert processing rule can suppress action groups. Click the fired alert in the portal and look at the **History** tab for suppressed action groups. If the suppression was not intended, you can modify, disable or delete the rule.

Two details from the page that matter here:

- Service health alerts are not affected by alert processing rules, even when they are in scope.
- A disabled rule has no effect. The portal shows only enabled rules by default, so change the filter to see all of them.

## Email checks

If you see the fired alert but did not get the email, Learn lists these in order:

1. **Suppression** by an alert processing rule, as above.
2. **Email Azure Resource Manager Role.** This action only looks at Azure Resource Manager role assignments at the subscription scope and of type User or Group. A role assigned at the resource or resource group level is not picked up.
3. **Mail server and mailbox accepting external email.** Allow these sender addresses in filtering and spam services: `azure-noreply@microsoft.com`, `azureemail-noreply@microsoft.com` and `alerts-noreply@mail.windowsazure.com`. Distribution lists often block external senders, so test with a regular work address instead.
4. **Inbox rules or spam filters.** Check rules that delete or move the mail, the spam settings of the client, the sender limits and quarantine settings of the mail server, and any email security appliance.
5. **Accidental unsubscribe.** The alert emails carry an unsubscribe link. Learn warns that if you unsubscribe from an action group, all members of a distribution list are unsubscribed too. You can check the Status column of the action group in the portal, or search for the unsubscribe confirmation mail. To subscribe again, use the link in the confirmation or remove the address and add it again. The page suggests adding user addresses individually (one action group can hold up to 1000) so that one person's unsubscribe does not affect others.
6. **Rate limit.** Email is limited to no more than 100 emails every hour to each address. Past that, no more mail is sent, and a message about the temporary limit is sent.

## SMS, voice and push checks

1. Suppression by an alert processing rule.
2. For SMS and voice, a typo in the country code or phone number.
3. For SMS and voice, the rate limit: no more than one notification every five minutes per phone number, and above that they are dropped. For a voice call, check whether you had another call from Azure in the previous five minutes. For SMS, look for a message about rate limiting.
4. For SMS, an opt-out. Learn names the reply DISABLE with the action group short name for one group and STOP for all groups. To subscribe again send ENABLE with the short name or START, or remove the SMS action and add it again.
5. Notifications blocked on the phone, such as blocked numbers, short codes or push notifications from an app like the Azure mobile app. Learn suggests testing with a different phone and number.

## When a webhook or other action did not run

After suppression, Learn asks about the webhook:

- **Blocked source IP.** Webhooks only support public networks and firewalls, and the IP addresses for all regions need to be in the allow list.
- **Endpoint not working.** Check the webhook logs or log the incoming payload.
- **Wrong format for Slack or Microsoft Teams.** Each expects a specific JSON format. Learn says to configure a logic app action instead.
- **Unresponsive endpoint or errors.** If the first call fails, it is retried at least once and up to five times, with delays of 5, 20, 40 seconds in the pattern the page lists. After the failed retries, no action group calls the endpoint for 15 minutes. The status codes 408, 429, 503, 504 and the exceptions HttpRequestException, WebException and TaskCancellationException allow a retry.

For high-volume notifications without rate limits, Learn suggests webhook, logic app, Azure function or automation runbook actions, and states that none of them are rate limited.

## Duplicate or odd notifications

A few other symptoms from the same page, so you do not chase the wrong cause:

- **Duplicates.** Check whether it really is the same alert. Several similar alerts can fire close together, for example an activity log alert without a filter on the event status, or a log search alert with dimensions. Compare timestamps and the alert ID or correlation ID. Also, an action that appears in multiple triggered action groups is called once per group.
- **Different mail formatting.** Action groups use two email providers. During an outage of the primary one, a secondary provider sends the mail, and the page says it carries a note about the secondary notification provider and may differ in formatting.
- **Missing custom properties.** They are passed only to actions such as webhook, Azure Functions and Logic Apps, not to email, SMS or push.
- **Missing search results.** From log search alerts API version 2021-08-01, search results are no longer in the notification payload.

## Order of work (my advice)

This order is my suggestion, not Microsoft guidance:

1. Test the action group, then open the fired alert and read its History tab. That answers suppression and duplicate action groups in one look.
2. Match the symptom to the channel and walk its list from the top.
3. Before you touch mail filters, check the rate limits, since a busy alert rule can reach 100 emails an hour to one address.
4. For alerts that must not be missed, add a second channel, such as a webhook into a logic app, so one failure does not hide a fired alert.

## Rule create, update or delete errors

If creating or changing alert rules fails, Learn points to the Geneva Alert RP enterprise application, which must exist and not be disabled in the Microsoft Entra tenant. For alert processing rules, check that you have the Monitoring Contributor role or the specific permissions. A log search alert rule creation can also fail if its properties exceed 64 KB combined, for example with a large query or many dimensions.

## Related

- [Azure Monitor](https://www.m365.fm/entity/azure-monitor/)
- [Microsoft Teams](https://www.m365.fm/entity/teams/)

## Sources

- [Troubleshooting Azure Monitor alerts and notifications (Microsoft Learn)](https://learn.microsoft.com/azure/azure-monitor/alerts/alerts-troubleshoot)
