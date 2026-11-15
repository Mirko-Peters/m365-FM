---
title: "Dynamics 365 Server-Side Sync Mailbox Errors: Find and Fix Mailbox Alerts"
summary: "Find mailbox alerts for server-side synchronization in Dynamics 365 and Dataverse, fix the common ones (approval, credentials, auto discover, organizer field) and understand when a mailbox is disabled automatically."
status: review
publish: false
author: mirko-p
date: 2026-12-24
topics: [dynamics-365-sales, dynamics-365-customer-service]
keypoints:
  - "Find mailbox records in the Power Platform admin center: select the environment, then Settings > Email > Mailboxes."
  - "Permanent errors such as 401 Unauthorized disable the mailbox immediately. Transient errors are retried up to 10 times with a five-minute gap before being treated as permanent."
  - "After fixing the cause, re-enable the mailbox with Test & Enable Mailboxes. For approval alerts, select the mailboxes and Approve Email first."
  - "Credentials alerts mean the email server profile credentials are wrong or lack permissions. Check impersonation rights and mailbox access."
  - "The Server-Side Synchronization Monitoring dashboard is deprecated as of 9.2.2403.4. The Item Monitoring dashboard shows why items did not synchronize."
faq:
  - q: "Where do I find mailbox alerts?"
    a: "Microsoft Learn says to select the environment in the Power Platform admin center and go to Settings > Email > Mailboxes. The Item Monitoring dashboard shows why emails, appointments, contacts and tasks did not synchronize, and the older Server-Side Synchronization Monitoring dashboard is deprecated as of 9.2.2403.4."
  - q: "When does Dynamics 365 disable a mailbox automatically?"
    a: "Learn says permanent errors, for example 401 Unauthorized, disable the mailbox as soon as they are detected. Transient errors such as network issues are retried up to 10 times with a five-minute gap, and if all 10 fail the error is treated as permanent and the mailbox is disabled."
  - q: "How do I fix the alert that an email address requires approval?"
    a: "Select the mailboxes, choose Approve Email, choose OK, then choose Test & Enable Mailboxes. Learn says approval can be removed as a requirement, in a section on removing the requirement to approve mailboxes."
  - q: "What fixes a credentials alert?"
    a: "Learn says to verify the credentials in the email server profile and confirm the user has impersonation rights and mailbox access to each associated mailbox."
  - q: "Why are appointments not synchronizing?"
    a: "One listed cause is a missing Organizer field. Add the Organizer field to the Appointment form and publish. Another is a mailbox configured with another organization, where you test and enable it in the primary organization or set synchronization to None in nonprimary ones."
---

Server-side synchronization connects Dynamics 365 and Dataverse mailboxes to Exchange. When a mailbox stops syncing, the platform often disables it and raises an alert. This guide follows Microsoft Learn's troubleshooting and monitoring article and lists the alerts it documents, with the fixes it gives.

## Where to look

- **Mailbox records.** In the Power Platform admin center, select the environment, then **Settings** > **Email** > **Mailboxes**. The Test Run Status column does not appear yet on the My Active Mailboxes view.
- **Item Monitoring dashboard.** Shows why emails, appointments, contacts and tasks did not synchronize. The **Sync Error** column links to a Learn article when one exists. Users see only items they own, and system administrators see redacted subjects for other users' items. Data is kept for up to three days, controlled by the `ExchangeSyncIdMappingPersistenceTimeInDays` setting. It doesn't work in the Unified Client.
- **Server-Side Synchronization Monitoring dashboard.** Deprecated as of 9.2.2403.4. It can still be opened from any dashboard through the dropdown next to the title.

## How automatic disabling works

Learn gives these rules:

- **Permanent errors**, for example 401 Unauthorized on the server or mailbox, disable the mailbox as soon as they are detected.
- **Transient errors**, for example network issues, are retried up to 10 times with a five-minute gap. If all 10 fail, the error is treated as permanent and the mailbox is disabled.

After you fix the cause, re-enable the mailbox with **Test & Enable Mailboxes**.

## Common alerts and fixes

### Email message has Pending Send status

Email integration isn't configured or enabled for the sender. Confirm the sender's mailbox is enabled for sending. If it uses server-side sync for outgoing email, verify the address is approved, tested and enabled.

### Email address requires approval

Alerts say the address of the mailbox requires approval by a Microsoft 365 administrator, or that email addresses must be approved, and that the mailbox was disabled. The owner of the email server profile is notified.

Fix: select the mailboxes, choose **Approve Email**, choose **OK**, then choose **Test & Enable Mailboxes**. Learn says approval can be removed as a requirement.

### Mailbox location could not be determined

The cause is **Auto Discover Server Location** being enabled while the mailbox location can't be detected. Ask the Exchange administrator to verify auto discover, or set **Auto Discover Server Location** to **No** and enter the Exchange web services URL, for example `https://ExchangeServerName/EWS/Exchange.asmx`.

### Credentials incorrect or insufficient permissions

The credentials in the email server profile are wrong or lack permission to send or receive. Verify the credentials and confirm the user has impersonation rights and mailbox access to each associated mailbox.

### Appointments can't be synchronized

If the alert says the Organizer field isn't present, add the **Organizer** field to the Appointment form and publish.

### Mailbox configured with another organization

For appointments, contacts and tasks, test and enable the mailbox in the primary organization with the option to sync only from this organization, or set the synchronization method to **None** in nonprimary organizations.

### The mailbox user doesn't have sufficient permissions

When you select **Test & Enable Mailbox**, you may see an alert that appointments, contacts and tasks can't be synchronized because the mailbox user doesn't have sufficient permissions. The error code shown is `Crm.80048306`, with a `CrmSecurityException` and `AccessRights: WriteAccess` in the details.

Per Microsoft's troubleshooting article, the Dynamics 365 user linked to the mailbox lacks privileges. This usually means the user has no security role, or the role lacks user-level read or write access to the `Mailbox` entity. The **Owner** of the mailbox record must also match the mailbox user.

1. Open the mailbox record as a System Administrator. The alert has a link.
2. Check that **Owner** shows the mailbox user, and change it if not.
3. Open the owner's user record and select **Manage Roles**.
4. Go to **Settings** > **Security** > **Security roles** and open each assigned role.
5. Verify each role has the privileges listed in the linked PrivilegeDenied article.
6. Select **Test & Enable Mailbox** again and review the **Alerts** section if the result isn't Success.

## Triage order

1. Open the mailbox record and read the alert text.
2. Match it to the list above. Note whether the cause is permanent or transient.
3. Fix credentials, approval or configuration.
4. Use **Test & Enable Mailboxes**.
5. Check the Item Monitoring dashboard for items that still fail.

## What the article does not cover

The page does not define mailbox status values, and it does not list alerts such as An unknown error occurred or Mailbox test failed. It also does not say whether admins, as opposed to the email server profile owner, are notified. Use the page for the alerts it lists and check other messages separately.

## Related

- [Dynamics 365 Sales](https://www.m365.fm/entity/dynamics-365-sales/)
- [Dynamics 365 Customer Service](https://www.m365.fm/entity/dynamics-365-customer-service/)

## Sources

- [Troubleshooting and monitoring server-side synchronization - Microsoft Dataverse (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/power-platform/dataverse/email-exchange-synchronization/troubleshooting-monitoring-server-side-synchronization)
- [Mailbox user doesn't have sufficient permissions error - Microsoft Dataverse (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/power-platform/dataverse/email-exchange-synchronization/error-when-you-test-enable-a-mailbox)
