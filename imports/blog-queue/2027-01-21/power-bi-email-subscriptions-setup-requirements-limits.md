---
title: "Power BI Email Subscriptions: Set Up, Requirements, Recipient Rules and Limits"
summary: "How to subscribe yourself and others to emailed Power BI reports and dashboards: licenses and tenant settings, frequency options, group aliases, external recipient limits, row-level security, Run now limits and the unsupported visuals, per Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2027-01-21
topics: [power-bi, power-bi-service]
keypoints:
  - "Subscribing yourself needs access to the content plus a Pro or PPU license, or a workspace on a paid Premium capacity. A Fabric admin must enable subscriptions."
  - "You can set up to 24 subscriptions per report or dashboard, each with its own recipients, times and frequencies."
  - "Distribution groups, dynamic distribution groups and mail-enabled security groups work as recipients. Microsoft 365 groups and plain security groups do not."
  - "External recipients need a workspace on a paid, non-PPU capacity. Trial capacity and PPU workspaces do not deliver to external addresses."
  - "With row-level security, the static image in the email shows data based on the subscription owner, so check what the image reveals."
faq:
  - q: "Which license do I need for email subscriptions?"
    a: "Learn says that to create a subscription for yourself you need access to the report or dashboard and either a Power BI Pro or Premium Per User license, or access to a workspace backed by a paid Premium capacity. Subscribing others requires a paid license (Pro or PPU) and a Contributor, Member or Admin role in the workspace. Your Fabric admin must also enable subscriptions in the tenant."
  - q: "What frequency options exist?"
    a: "The Repeat dropdown offers hourly, daily, weekly, monthly or after data refresh, which sends once daily after the first scheduled refresh that day. Most options need a time zone. Monthly lets you pick days of the month or the last day. The default end date is one year after the start, and subscriptions expire at 12:00 AM UTC on the end date."
  - q: "Can I send a subscription to a Microsoft 365 group?"
    a: "No. Learn's table lists Microsoft 365 groups and security groups as not supported, and distribution groups, dynamic distribution groups and mail-enabled security groups as supported. Group aliases need a report hosted in a Premium capacity, and workspaces backed by Premium Per User do not support them."
  - q: "Why did my subscription email not reach an external recipient?"
    a: "Learn says external recipients are supported only for workspaces backed by a paid, non-PPU Premium capacity. Subscriptions in trial capacity workspaces cannot go to external addresses, and PPU workspaces do not support external recipients. Power BI suppresses delivery when the workspace does not meet this, and tenant settings cannot override it."
  - q: "How do I keep subscription emails out of spam?"
    a: "The page advises adding the Power BI email alias no-reply-powerbi@microsoft.com to your contacts, and in Outlook choosing Add to Outlook contacts. For a mail-enabled security group as the recipient, add the alias to the group's approved sender list."
---

A Power BI email subscription sends a snapshot of a report page or dashboard, with a link or an attachment, on a schedule you set. The Microsoft Learn page covers the requirements, the options in the Subscribe pane and a long list of limits. This article reorganizes it into a setup path and a list of things that trip people up.

## What you need

Learn says the requirements apply to users in the organization and to Microsoft Entra B2B guest users. To create a subscription for yourself you need permission to access the report or dashboard and either:

- a Power BI Pro or Premium Per User (PPU) license, or
- access to a workspace backed by a paid Power BI Premium capacity.

A Fabric admin must enable subscriptions in the tenant. To subscribe others you also need a Pro or PPU license and the Contributor, Member or Admin role in the workspace. B2B guests can only subscribe themselves.

## Create a subscription

1. Open the report and select **Subscribe** on the top menu bar.
2. Select **Create a subscription** and name it. The default name is the report page or dashboard name.
3. Add at least one recipient by email address.
4. For a report in a Premium capacity or PPU workspace, you can attach the full report instead of one page, as PDF or PowerPoint. The attachment is limited to no more than 20 pages and less than 25 MB.
5. Pick a **Start date** and optionally an **End date**. By default the subscription ends one year after it starts. Subscriptions expire at 12:00 AM UTC on the end date, so choose the following day to receive deliveries through a particular day. You get notifications before the end date asking whether to extend.
6. Choose the **Repeat** frequency: hourly, daily, weekly, monthly or after data refresh (once daily). For weekdays, use Hourly or Weekly with the weekday checkboxes. Monthly takes days of the month or **Last day of month**.
7. Optionally add a subject and message. In reports the message appears above the preview, in dashboards below it.
8. Choose the report page for the preview and the extra items: permission to view the content, a link, and a page preview.
9. Select **Save**.

You can set up to 24 subscriptions per report or dashboard, each with its own recipients, times and frequencies.

### After data refresh

Subscriptions set to **After data refresh** only send an email after the first scheduled refresh on that day. Dates and times are normalized to UTC when Power BI checks for the first refresh of the day.

## Recipients and groups

Within your domain you can add addresses directly. If the content is in a Premium capacity, you can subscribe group aliases in or outside your domain.

| Group type | Supported |
| --- | --- |
| Microsoft 365 groups | No |
| Distribution groups | Yes |
| Dynamic distribution groups | Yes |
| Security groups | No |
| Mail-enabled security groups | Yes |

Learn adds that the Microsoft 365 distribution group for Teams does not work for mail enablement, so it is not usable for email subscriptions. Workspaces backed by PPU do not support group aliases.

## External recipients

This is where many subscriptions fail silently. Learn states that external recipients are supported only for workspaces backed by a paid, non-PPU capacity:

- Trial capacity workspaces cannot send to external addresses.
- PPU workspaces do not support external recipients.

Power BI suppresses delivery when the workspace does not qualify, and tenant settings cannot override that. Users with subdomain email addresses are treated as external, and can set up or receive subscriptions only when the tenant setting for B2B guests is enabled. Internal guests, who have an account in your directory but guest-level access, cannot create subscriptions.

## Data protection points

- Sensitivity labels apply to attachments but not to the email text or the preview image. To get a label on the subscription, turn off **Preview image**.
- With row-level security, the static image in the email displays data based on the owner of the subscription. Learn warns that users often scroll past the RLS warning, so check that the image holds no confidential data. The report itself opens based on the viewer's permissions.
- If you use a bookmark to open a report, the subscription runs against that bookmark, not the filters you applied when you created it.

## Test and manage

Select **Run now** to send the email to you right away. It does not refresh the underlying semantic model. Instant emails are limited per user per hour:

| License or capacity tier | Instant emails per user per hour |
| --- | --- |
| Trial capacity | 10 |
| Default | 15 |
| Premium Per User | 20 |
| Premium or Fabric capacity | 25 |

Subscriptions are managed per workspace. Creators see theirs through **Manage all**, and across workspaces under the gear icon, **Power BI settings**, **General**, **Notifications**. Workspace Admins can view, edit and take over subscriptions of others, and the original owner gets an email. Fabric admins can see subscription details in the audit and activity logs.

## Limits and unsupported items

- Email subscriptions are not supported when the admin setting **Azure private link** > **Block public internet access** is on. All subscriptions fail then.
- These visuals show an error symbol: uncertified custom visuals, ESRI ArcGIS, Power Apps, Power Automate, the paginated report visual and Visio visuals.
- A report page subscription is tied to the page name. If the page is renamed, recreate it. If the page is deleted, the subscription is gone.
- On the day of a daylight saving change, Learn says you receive your emails, and the day after you receive two emails per subscription.
- Paginated report subscriptions have a 25 MB attachment maximum, no After data refresh option, and a 60-minute execution limit.

## Troubleshooting order (my advice)

This is my experience, not a Microsoft procedure:

1. Check license and workspace type first, since both decide who can be a recipient.
2. If one recipient gets nothing, check the sender alias against spam rules and any approved sender list.
3. If a group gets nothing, compare its type with the table above.
4. If the subscription stopped, look at the end date, which defaults to one year.
5. Before you subscribe a wider audience to an RLS report, send a Run now to yourself and read what the image shows.

Learn links a separate page on troubleshooting Power BI subscriptions, which I did not read for this article.

## Related

- [Power BI](https://www.m365.fm/entity/power-bi/)
- [Power BI service](https://www.m365.fm/entity/power-bi-service/)

## Sources

- [Email Subscriptions for Reports and Dashboards in the Power BI Service (Microsoft Learn)](https://learn.microsoft.com/power-bi/collaborate-share/end-user-subscribe)
