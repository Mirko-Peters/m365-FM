---
title: "Microsoft 365 Groups vs Shared Mailbox vs Distribution List vs Security Group"
summary: "Compare the six group types in the Microsoft 365 admin center using Learn's table: mail enabled or not, dynamic membership in Entra ID or not, what each can contain, nesting and Teams rules. Includes my own decision guide for choosing between them."
status: review
publish: false
author: mirko-p
date: 2027-01-15
topics: [microsoft-365-groups, shared-mailbox, distribution-list, exchange-online]
keypoints:
  - "Learn lists six types: Microsoft 365 Groups, distribution groups, security groups, mail-enabled security groups, shared mailboxes and dynamic distribution groups."
  - "Only Microsoft 365 Groups and security groups support dynamic membership in Microsoft Entra ID; security groups are the only type that is not mail enabled."
  - "Microsoft 365 Groups cannot be members of distribution groups or security groups, and a shared mailbox cannot be migrated to a Microsoft 365 Group."
  - "Security groups can contain users or devices; mail-enabled security groups cannot contain devices and cannot be managed dynamically through Entra ID."
  - "Dynamic distribution groups work from filters defined in the Exchange admin center and are evaluated each time a message is sent."
faq:
  - q: "Which group types are mail enabled?"
    a: "Per the Microsoft Learn comparison table, Microsoft 365 Groups, distribution groups, mail-enabled security groups, shared mailboxes and dynamic distribution groups are mail enabled. Security groups are not."
  - q: "Which group types support dynamic membership?"
    a: "The Learn table has a column for dynamic membership in Microsoft Entra ID. It marks Microsoft 365 Groups and security groups as Yes and the other four types as No. Dynamic distribution groups are a separate mechanism: their attributes are defined in the Exchange admin center, and membership is worked out each time a message is sent."
  - q: "Can I put a Microsoft 365 Group inside a distribution or security group?"
    a: "Learn says no. Microsoft 365 Groups cannot be members of distribution groups or of security groups. It does say Microsoft 365 Groups support nesting through dynamic groups in Microsoft Entra ID."
  - q: "Can I turn a shared mailbox into a Microsoft 365 Group?"
    a: "Learn says it is not possible to migrate a shared mailbox to Microsoft 365 Groups."
  - q: "Which type can contain devices?"
    a: "Learn says security groups can contain users or devices, for example for use with mobile device management such as Intune. Mail-enabled security groups cannot contain devices."
---

Learn compares six group types that you can create and manage in the Microsoft 365 admin center. They differ in whether they are mail enabled, whether membership can be dynamic in Microsoft Entra ID, what they can contain, and how they work with Teams and with each other. Microsoft 365 Groups and security groups are the two that support dynamic membership. Security groups are the only one without an email address. A shared mailbox is a mailbox, and Learn says it cannot be migrated to a Microsoft 365 Group. This article follows the Learn comparison page and then adds my own guidance.

## The comparison table

| Group type | Mail enabled | Dynamic membership (in Microsoft Entra ID) |
| --- | --- | --- |
| Microsoft 365 Groups | Yes | Yes |
| Distribution groups | Yes | No |
| Security groups | No | Yes |
| Mail-enabled security groups | Yes | No |
| Shared mailboxes | Yes | No |
| Dynamic distribution groups | Yes | No |

The last column is about Entra ID. Dynamic distribution groups are marked No there. The page says their attributes are defined in the Exchange admin center rather than in Entra ID, as described below.

## What Learn says about each type

**Microsoft 365 Groups** are for collaboration between users, both inside and outside your company. Members get a group email and a shared workspace for conversations, files and calendar events, plus Stream and a Planner. A group can also be connected to Teams or Viva Engage. People from outside the organization can be added if an administrator enabled that, and external senders can be allowed to email the group. They can be configured for dynamic membership in Entra ID, based on attributes such as department, location or title. A Microsoft 365 group can be added to one of the three SharePoint groups (Owners, Members or Visitors) to give people permissions to a site, and it can be used with Power Automate.

**Distribution groups** send notifications to a group of people, and can receive external email if enabled by the administrator. Learn says they suit broadcasts to a set group, such as everyone in a building. They can be added to a team, though only the members are added, not the group itself. Microsoft 365 Groups cannot be members of distribution groups.

**Dynamic distribution groups** are mail-enabled groups for sending mail to people with specific attributes, such as department or location. The attributes are defined in the Exchange admin center, not in Entra ID. Unlike regular distribution groups, the membership list is determined each time a message is sent, based on the filters and conditions you define.

**Security groups** grant access to Microsoft 365 resources such as SharePoint sites, so you administer the group instead of adding users to each resource. They can contain users or devices, and a device group can be used with mobile device management such as Intune. They can be configured for dynamic membership in Entra ID, using user attributes or device attributes such as operating system version. They can be added to a team. Microsoft 365 Groups cannot be members of security groups.

**Mail-enabled security groups** work like security groups except that they cannot be dynamically managed through Entra ID and cannot contain devices. They can send mail to all members, and can be added to a team.

**Shared mailboxes** are for situations where several people need the same mailbox, such as an information or support address or a reception desk. They can receive external email if the administrator enabled it, and they include a calendar for collaboration. Users with permission can send as or on behalf of the mailbox address if the administrator granted it. It is not possible to migrate a shared mailbox to Microsoft 365 Groups.

## Rules that limit your choices

- Microsoft 365 Groups cannot be members of distribution groups or security groups.
- Shared mailboxes cannot be migrated to Microsoft 365 Groups.
- Learn says security groups can contain devices and that mail-enabled security groups cannot. It does not describe devices as members of the other types.
- Mail-enabled security groups give up dynamic management and devices in return for email.
- Distribution groups, security groups and mail-enabled security groups can be added to a team, but a distribution group adds only its members.

## How I would choose

This section is my advice, not a Microsoft statement.

1. **Several people answer one address.** Use a shared mailbox. This is the case Learn itself gives, a support or information address.
2. **You only broadcast to a list.** A distribution group does that. If the list follows an attribute such as department or location, a dynamic distribution group saves you from maintaining the list, at the cost of defining filters in Exchange.
3. **You grant access or target devices.** Use a security group. If membership should follow attributes, configure dynamic membership in Entra ID. Choose a mail-enabled security group only if you need email to the same list and can live without devices and dynamic membership.
4. **You want a team workspace.** Use a Microsoft 365 Group, which Learn describes with a group email and a shared workspace for conversations, files and calendar.
5. **You plan nesting.** Decide before you create objects, because a Microsoft 365 Group cannot sit inside a distribution or security group.

## Mistakes to avoid

These are patterns I would check for, based on the rules above, not Microsoft statements.

- Creating a shared mailbox when the team needs a workspace. Learn gives no migration path from shared mailbox to Microsoft 365 Group, so you would create a new group and move content yourself.
- Expecting a mail-enabled security group to follow attributes. The table marks it as not dynamic through Entra ID.
- Planning to nest a Microsoft 365 Group in a distribution or security group. Learn says it cannot be a member.
- Using a security group when people also need to send mail to it. The table marks security groups as not mail enabled.

## A short checklist before you create

1. Write down who sends, who receives and who needs access.
2. Decide whether membership is a fixed list or follows attributes.
3. Check whether devices are involved.
4. Check whether the object must sit inside another group or in a team.
5. Name the object so the type is obvious to the next administrator.

## Related

- [Microsoft 365 Groups](https://www.m365.fm/entity/microsoft-365-groups/)
- [Shared mailbox](https://www.m365.fm/entity/shared-mailbox/)
- [Distribution list](https://www.m365.fm/entity/distribution-list/)
- [Exchange Online](https://www.m365.fm/entity/exchange-online/)

## Sources

- [Compare types of groups in Microsoft 365 - Microsoft 365 admin (Microsoft Learn)](https://learn.microsoft.com/microsoft-365/admin/create-groups/compare-groups)
