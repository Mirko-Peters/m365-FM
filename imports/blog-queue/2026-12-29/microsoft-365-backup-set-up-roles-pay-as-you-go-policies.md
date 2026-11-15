---
title: "Microsoft 365 Backup: Set Up Roles, Pay-As-You-Go Billing and Backup Policies"
summary: "Set up Microsoft 365 Backup using Microsoft Learn: the roles and what they cover, the Azure subscription needed for pay-as-you-go billing, billing migration after April 2026, creating backup policies, and email notifications for harmful and routine events."
status: review
publish: false
author: mirko-p
date: 2026-12-29
topics: [microsoft-365]
keypoints:
  - "The setup page says you must be a SharePoint Administrator or Global Administrator to set up the service. Exchange Administrator and Microsoft 365 Backup Administrator appear in its role table."
  - "Pay-as-you-go billing needs an Azure subscription, a resource group, a region and the name of an Owner or Contributor on the subscription."
  - "Tenants onboarding after April 1, 2026 use the new Billing node. Earlier tenants can migrate from Billing and licenses, Activate pay-as-you-go services."
  - "Create backup policies under Settings, Microsoft 365 Backup. Protection units are SharePoint sites, OneDrive accounts and Exchange mailboxes."
  - "Notifications support up to 20 individual recipients, plus email-enabled groups, in a daily digest. Harmful events are on by default and routine events are opt-in."
faq:
  - q: "Which roles can use Microsoft 365 Backup?"
    a: "According to Microsoft Learn, SharePoint Administrator or Global Administrator can set it up. The role table covers OneDrive, SharePoint and Exchange for Global Administrator and Microsoft 365 Backup Administrator, SharePoint and OneDrive for SharePoint Administrator, and Exchange only for Exchange Administrator."
  - q: "What do I need for billing?"
    a: "A valid Azure subscription, a resource group, a region and the name of an Owner or Contributor on the subscription. Learn recommends the least privileged role and limiting Global Administrator to emergencies."
  - q: "Can end users enable backup for themselves?"
    a: "No. Learn says only tenant-level admins can create and manage backups, and end users cannot enable backup or restores for their own accounts, mailboxes or sites."
  - q: "What events trigger notifications?"
    a: "Potentially harmful events such as disabling the service, pausing a policy, removing protection units or offboarding them. Routine events are policy changes and restore starts or completions, which you must opt into."
  - q: "What are the policy limits?"
    a: "According to Microsoft Learn, 100 policies per product and 100,000 items per policy, and each site, mailbox or account can belong to only one policy."
---

Microsoft 365 Backup protects SharePoint sites, OneDrive accounts and Exchange Online mailboxes, which Learn calls protection units. This guide follows the Learn setup article. I did not use the Learn overview page for claims.

## Roles and permissions

The setup page says that to open the Microsoft 365 admin center and set up the service, you must be a SharePoint Administrator or Global Administrator. It recommends the role with the fewest permissions and limiting Global Administrator to emergencies. Only tenant-level admins can create and manage backups.

| Admin role | OneDrive | SharePoint | Exchange |
| --- | --- | --- | --- |
| Global Administrator | Yes | Yes | Yes |
| SharePoint Administrator | Yes | Yes | No |
| Exchange Administrator | No | No | Yes |
| Microsoft 365 Backup Administrator | Yes | Yes | Yes |

The page says the Backup Administrator role can control the entire tool, although its permissions text does not list it as a setup role.

## Prerequisites

For pay-as-you-go billing you need a valid Azure subscription, a resource group, the region in which to register the service and the name of an Owner or Contributor on the subscription. If you already have a subscription, you need Owner or Contributor access.

## Step 1: pay-as-you-go billing

New customers onboarding after April 1, 2026 use the new pay-as-you-go setup under the **Billing** node in the admin center. Customers who onboarded earlier can migrate:

1. In the Microsoft 365 admin center select **Setup**, then **Billing and licenses**.
2. Select **Activate pay-as-you-go services**.
3. On the **Settings** tab select **Storage**, then **Backup**.
4. Select **Migrate** and confirm.

Migration moves the existing subscription, resource group and region to a billing policy temporarily named Service migration, which you can rename. Learn says existing backups are not disrupted. If Migrate is missing, the feature is still rolling out to your tenant. Multiple billing policies can be connected on the Billing Policies tab to split costs.

## Step 2: create backup policies

A policy is the backup plan an admin defines, and you need at least one per product: SharePoint, Exchange and OneDrive. Learn's page on creating, viewing and editing policies gives these steps:

1. In the Microsoft 365 admin center select **Settings**, then **Microsoft 365 Backup**.
2. In the product's section select **Set up policy**, review the **Overview** and select **Next**.
3. On **Choose selection method** add protection units with one or more methods.
4. On **Backup Settings** enter a policy name and, for SharePoint and OneDrive, the recovery window.
5. On **Review** select **Create policy**.

Selection methods include uploading a CSV file (up to 50,000 entries) and selecting items individually. SharePoint also offers site filters (name or URL contains, last modified; preview). Exchange and OneDrive offer filters based on distribution lists or security groups, which are flattened once when added, and dynamic rules on the same groups that are reevaluated daily (preview). Full Workload Backup (preview) can be enabled for SharePoint, OneDrive and Exchange to protect everything not already in another policy. Exchange policies cover shared and user mailboxes only, not room or group mailboxes. Restore points can take time to appear: up to 15 minutes per 1,000 sites or mailboxes for SharePoint and Exchange, and 15 to 25 minutes per 1,000 for OneDrive.

## Recovery window and limits

Learn lists recovery windows of 3 months, 6 months and 1 to 10 years for SharePoint and OneDrive, and 3 months, 6 months, 1 year or 2 years for Exchange. Existing policies default to one year. Increasing the window applies immediately. Decreasing it deletes older recovery points only after a 30-day grace period. Other documented limits are 100 policies per product, 100,000 items per policy, and each site, mailbox or account in only one policy. Backup frequency is not modifiable.

Removing a protection unit stops future backups only. Existing backups are not deleted and, according to the page, will be charged.

## Email notifications

On the Microsoft 365 Backup home page choose **Email notifications**, turn them on, add recipients to the Backup Notification List, optionally select routine events and save. You can add up to 20 individual recipients and email-enabled distribution lists and security groups. Notifications arrive as a daily digest, only when a relevant event occurred, and harmful and routine events arrive as separate emails.

Potentially harmful events include disabling the service, pausing billing, removing or offboarding protection units, pausing a policy, changing the notification list and revoking the Controller app. Routine events are creating or modifying policies and starting or completing restores. Jobs with a 10-minute RPO are not part of the notification events.

## Suggested first steps

This is a suggestion, not Microsoft guidance. Add an email-enabled distribution list to the notification list so it survives staff changes, and start with one policy for a few important sites.

## Not covered

The pages I read do not give restore procedures, prices, supported regions, RPO and RTO values or the CSV file format. The policy page does not explain how to pause or delete a policy. The setup page notes availability for GCC customers without further detail. There is no separate entity for this service on m365.fm.

## Related

- [Microsoft 365](https://www.m365.fm/entity/microsoft-365/)

## Sources

- [Set up Microsoft 365 Backup (Microsoft Learn)](https://learn.microsoft.com/microsoft-365/backup/backup-setup)
- [Create, view, and edit backup policies in Microsoft 365 Backup (Microsoft Learn)](https://learn.microsoft.com/microsoft-365/backup/backup-view-edit-policies)
