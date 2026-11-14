---
title: "Microsoft 365 Admin Roles Compared: Which Role to Assign for Least Privilege"
summary: "Compare common Microsoft 365 admin roles as described on Microsoft Learn: Global Administrator, User, Helpdesk, Billing, Exchange, SharePoint, Teams, Security and Global Reader, with the least privilege guidance and how to assign roles."
status: review
publish: false
author: mirko-p
date: 2026-12-26
topics: [microsoft-365-admin-center, microsoft-365-administrator]
keypoints:
  - "Learn recommends roles with the fewest permissions and limiting the number of users with administrative permissions."
  - "For password resets, assign Password Administrator or Helpdesk Administrator instead of Global Administrator."
  - "The page gives no specific number of Global Administrators. It says to have as few as possible and to avoid lockout."
  - "Assign roles in the Microsoft 365 admin center under Role assignments, using the Assigned or Assigned admins tab."
  - "Global Reader can view what a Global Administrator can view but cannot edit settings, and is not available for subscriptions bought through a partner."
faq:
  - q: "Which role should I give for password resets?"
    a: "According to Microsoft Learn, Password Administrator or Helpdesk Administrator rather than Global Administrator. Helpdesk Administrator can only help users who are not administrators and are not assigned certain listed roles."
  - q: "How many Global Administrators should I have?"
    a: "The page gives no number. It says there can be more than one, to have as few as possible, and to limit them as much as possible. To avoid lockout it says to have at least a Privileged Authentication Administrator."
  - q: "Where do I assign roles?"
    a: "In the Microsoft 365 admin center go to Role assignments, select a role, and use the Assigned or Assigned admins tab to add users. The Permissions tab shows what the role allows."
  - q: "What can Global Reader do?"
    a: "It can view admin features and settings that a Global Administrator can view but cannot edit any settings. It is not available for subscriptions purchased through a partner."
  - q: "Does the page cover Privileged Identity Management?"
    a: "Not as a topic. The page names Privileged Identity Management only in the Security Reader description, as one of the Microsoft Entra areas that role can access, and gives no guidance on using it. It links to the least privileged roles by task in Microsoft Entra ID."
---

The safest way to pick an admin role is to match the task to the narrowest role that covers it. Microsoft Learn says to use roles with the fewest permissions and to limit the number of users who have administrative permissions. This article compares the common roles as that page describes them.

## Least privilege in Microsoft's words

Assigning the least permissive role means giving administrators only the access they need to do the job. The page's example is password resets: assign Password Administrator or Helpdesk Administrator, not Global Administrator. The same security table also recommends requiring multifactor authentication for administrators.

## Common roles

| Role | What the page says it can do |
| --- | --- |
| Global Administrator | A privileged role. Resets passwords for any user and all other administrators, and manages purchasing. The purchaser of a subscription is automatically a Global Administrator. Cannot remove their own assignment. |
| User Administrator | Creates, disables or enables user accounts, adds users and groups, assigns licenses, manages most user properties and updates password expiration policies. |
| Helpdesk Administrator | Resets passwords, forces users to sign out, manages service requests and monitors service health. Only helps users who are not administrators and not in certain listed roles. |
| Billing Administrator | Makes purchases, manages subscriptions and service requests, monitors service health and manages all aspects of billing. |
| Exchange Administrator | Manages mailboxes, Microsoft 365 Groups and Exchange Online. Recovers deleted items and sets up Send As and Send on behalf delegates. |
| SharePoint Administrator | Accesses the SharePoint admin center, creates and deletes sites and manages site collections and global SharePoint settings. |
| Teams Administrator | Accesses the Teams admin center, manages meetings and conference bridges and org-wide settings such as federation, Teams upgrade and client settings. |
| Security Administrator | Manages security controls and monitoring across Microsoft 365. A privileged role with access to security and compliance portals. Read visibility into agents in the admin center for investigation and risk assessment, without agent publishing or lifecycle management. |
| Global Reader | Views admin features and settings that a Global Administrator can view but cannot edit any settings. Not available for subscriptions purchased through a partner. |

## How many Global Administrators

The page gives no number. It says there can be more than one, and to have as few as possible. To avoid lockout it says to have at least a Privileged Authentication Administrator, because a Global Administrator or Privileged Authentication Administrator can reset a Global Administrator's password. The page mentions that role without describing it in the table.

## Assign a role

1. In the Microsoft 365 admin center, go to **Role assignments**.
2. Select a role to open its detail pane.
3. Use the **Permissions** tab to see what the role allows.
4. Use the **Assigned** or **Assigned admins** tab to add users.

To find a user first, go to **Users** > **Active users** and select the account. The page refers to a separate article, Assign admin roles, for the full procedure.

## Notes on specific roles

- The Helpdesk Administrator can only help users who are not administrators and users assigned these roles: Directory reader, Guest inviter, Helpdesk admin, Message Center reader and Reports reader. My reading: it is therefore not the role for resetting the passwords of most other admins.
- The Global Administrator role is described as privileged, and the purchaser of a subscription becomes one automatically, so it is worth checking who bought your subscription (my advice).
- The Security Administrator is also described as privileged, and has read visibility into agents in the admin center, without agent publishing or lifecycle management.
- Global Reader is not available for subscriptions purchased through a partner.

## Choosing a role

This approach is my advice, built from the table above, not a Microsoft procedure.

1. Write down the task, such as resetting passwords for staff, managing mailboxes or reviewing settings.
2. Pick the role whose description matches only that task.
3. Prefer Global Reader for people who only need to view.
4. Keep Global Administrator for the few accounts that must manage purchasing or reset administrator passwords.
5. Review the list of assigned admins on a schedule.

## Not covered

The page gives no numeric limits, gives no guidance on Privileged Identity Management (it only names it in the Security Reader description), and does not list full permissions per role. It refers to the Microsoft Entra built-in roles for that, and only summarizes partner roles and volume licensing roles.

## Related

- [Microsoft 365 admin center](https://www.m365.fm/entity/microsoft-365-admin-center/)
- [Microsoft 365 administrator](https://www.m365.fm/entity/microsoft-365-administrator/)

## Sources

- [About administrator roles in the Microsoft 365 admin center (Microsoft Learn)](https://learn.microsoft.com/microsoft-365/admin/add-users/about-admin-roles)
