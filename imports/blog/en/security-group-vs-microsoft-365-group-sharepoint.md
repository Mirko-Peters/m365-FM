---
title: "Security groups or Microsoft 365 groups for SharePoint access?"
summary: "Security group vs Microsoft 365 group for SharePoint: what each one does, when to use which, how nesting and dynamic membership work, with a worked example."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [sharepoint-permissions, microsoft-365-groups, entra-id, least-privilege]
keypoints:
  - "A Microsoft 365 group is for collaboration and brings a shared workspace with it. A security group only grants access, with no mailbox, calendar or workspace."
  - "For a team site, use the Microsoft 365 group, because group owners become site owners and group members become site members."
  - "For a large audience on a communication site or a library, use a security group inside the Visitors group, so one entry stands for the whole audience."
  - "Microsoft 365 groups cannot be members of security groups, and Microsoft does not recommend nested security groups inside SharePoint groups."
  - "Dynamic membership, driven by attributes such as department, adds and removes people automatically and keeps access in line with the directory."
faq:
  - q: "Can I use a security group to give access to a SharePoint site?"
    a: "Yes. Microsoft states that security groups are used to grant access to Microsoft 365 resources such as SharePoint sites. Add the security group to the Owners, Members or Visitors group of the site. One entry then stands for all of its members, which makes later changes much easier."
  - q: "Should I use a Microsoft 365 group or a security group for a team site?"
    a: "Use the Microsoft 365 group. Microsoft says team site permissions are best managed through the connected group, where group owners become site owners and group members become site members. A security group fits better as the audience of a communication site or as read access for many people."
  - q: "Can a Microsoft 365 group be a member of a security group?"
    a: "No. Microsoft states that Microsoft 365 groups cannot be members of security groups. A security group can hold users, devices and other groups. If you need to combine both, add each group separately to the SharePoint group on the site instead of nesting one inside the other."
---

A Microsoft 365 group is a collaboration unit, and a security group only grants access. For a team site, use the Microsoft 365 group. For a large audience that only reads, use a security group inside the Visitors group. That is the short answer to security group vs Microsoft 365 group for SharePoint. This article is for SharePoint admins who must pick a group type for a new site or clean up an old one. You will see what each type does, the rules Microsoft documents, a decision list, and a worked example.

## What is the difference between the two group types?

Microsoft compares the types on its page [Compare types of groups in Microsoft 365](https://learn.microsoft.com/en-us/microsoft-365/admin/create-groups/compare-groups?view=o365-worldwide). The core facts are these.

**Microsoft 365 groups** are used for collaboration, both inside and outside the company. Members get a group email and a shared workspace for conversations, files and calendar events, and the group can be connected to Teams. The group can include people from outside the organization if an admin allows it. Only users can be members.

**Security groups** are used to grant access to Microsoft 365 resources, such as SharePoint sites. Microsoft says they make administration easier, because you manage the group instead of adding users to each resource one by one. Security groups can contain users or devices. They are not mail-enabled.

Both types support dynamic membership in Microsoft Entra ID. That means rules, for example based on department or location, add and remove members automatically. One more rule matters for design: Microsoft 365 groups cannot be members of security groups.

The [Microsoft 365 group](https://www.m365.fm/entity/microsoft-365-groups/) is also the membership object behind every team and its SharePoint site. A security group has no site and no workspace. It is a list of identities, nothing more.

## How does each group type connect to SharePoint?

Microsoft's article on [sharing and permissions in the modern experience](https://learn.microsoft.com/en-us/sharepoint/modern-experience-sharing-permissions) describes the two paths.

On a **team site**, the connected Microsoft 365 group controls the site. Group owners become site owners, and group members become site members. Microsoft says team site permissions are best managed through that group or the Teams team.

On a **communication site**, you manage the three SharePoint groups: Owners, Members and Visitors. You can add individual users, security groups or Microsoft 365 groups to any of them. Microsoft calls the Visitors group a good place for security groups, because it is often the easiest way to add large numbers of users.

There is one trap. Microsoft 365 groups have no view-only role. If a group-connected site is managed separately from its group and you want people to read only, you must add them directly to the Visitors group on the site, not to the Microsoft 365 group.

The permissions themselves come from the three groups. This is how [SharePoint permissions](https://www.m365.fm/entity/sharepoint-permissions/) work for most sites: you decide who is in which group, and the group decides the level.

## When should you use a security group, and when a Microsoft 365 group?

Use this short decision list.

1. **New project or team that works together:** create a Microsoft 365 group, with or without Teams. You get the site, the mailbox and the calendar in one step.
2. **Large read-only audience, such as all employees:** use a security group in the Visitors group of the site. You manage one list.
3. **Access to a single library or folder for a fixed set of people:** use a security group, so you do not create a whole workspace to share files.
4. **People from outside your organization who must collaborate:** a Microsoft 365 group can include them if the admin has enabled this. Check your guest settings first.
5. **Access that follows a rule, such as everyone in the finance department:** use a dynamic group, either type. Microsoft's Entra documentation says dynamic groups use rules to add and remove members automatically. Devices need their own device group, because a dynamic group can be for users or for devices, not both.

A sound habit: put people into a group that matches a business role, then give the group access. Do not give each person access one by one. That keeps reviews short and matches the idea of [least privilege](https://www.m365.fm/entity/least-privilege/), where each identity has the smallest role it needs.

## Where do distribution groups and mail-enabled security groups fit?

Two more group types often appear in the picker. Microsoft's [group type comparison](https://learn.microsoft.com/en-us/microsoft-365/admin/create-groups/compare-groups?view=o365-worldwide) describes them.

- **Distribution groups** are used for sending notifications to a group of people, such as everyone in one building. The page does not describe them as a way to grant access, and they have no dynamic membership. Use them for mail only.
- **Mail-enabled security groups** work like regular security groups, with two differences: they cannot be managed dynamically through Microsoft Entra ID and they cannot contain devices. They can grant access to resources such as SharePoint and can also send mail to all members.

So a mail-enabled security group is a fair fit when one list must both receive messages and hold site permissions, and when you accept manual membership. If you want rules-based membership, choose a regular security group or a Microsoft 365 group, and keep a separate distribution list for mail. Test any mail-enabled group on a site before you rely on it for access request emails.

## What about nesting groups?

Nesting means putting a group inside another group. Microsoft Entra allows security groups to be members of other groups. Its documentation notes that when you nest an existing security group in another, only members of the parent group have access to the shared resources.

For SharePoint, take care. The communication-site guidance says that nested security groups can cause performance issues and are not recommended. A flat design is easier to read. If you must combine audiences, add each group directly to the SharePoint group.

Two further limits apply. Microsoft 365 groups cannot be members of security groups. Groups live in [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/), so check the group type there before you add it to a site. If the type is wrong for the job, create the right group and move the members. Always write down which group is used where.

## How do you review group-based access?

Groups hide people, so a review needs a routine. Microsoft Entra offers three membership types. In an **assigned** group, you add specific users by hand. In a **dynamic user** group, rules add and remove users automatically. In a **dynamic device** group, rules do the same for devices. Use this routine every quarter:

1. List the groups that sit in the Owners, Members and Visitors groups of each important site.
2. Open each group and check its owner. A group with no owner has nobody who can answer for it.
3. For assigned groups, ask the owner to confirm the member list. Remove people who changed roles.
4. For dynamic groups, read the rule. A rule such as "department equals Finance" is clear. A rule nobody can explain is a risk.
5. Record the date and the result in one shared sheet.

This takes minutes per site and catches the slow drift that creates oversharing.

## Example: the finance site with three audiences

The numbers are invented to show the method. The finance department of a company with 900 employees has 40 people. The site must serve three audiences.

1. **Finance team, 40 people, daily work:** a Microsoft 365 group named "Finance". It makes the team site. The group owners, 2 people, become site owners. The other 38 are site members.
2. **Internal auditors, 4 people, read-only for 6 weeks a year:** a security group "Finance Auditors", added to the Visitors group of the site. Before the audit you add the 4 people, afterward you remove them. The site itself stays untouched.
3. **Management, 25 people, read-only on the report library:** a security group "Management" with dynamic membership based on a job-level attribute. When a manager changes role, the group updates itself. You add the group to the Visitors group of the site.

Result: three groups, no individual access entries, and one place per audience to review. If someone asks "who can read the finance reports?", you answer with three group names.

## Common mistakes

- **Adding readers to the Microsoft 365 group.** It makes them members of the team with edit rights. Use Visitors for read-only access.
- **Creating a Microsoft 365 group when you only need a list of people.** It also creates a mailbox, a calendar and a site that nobody maintains.
- **Nesting groups deeply.** It is hard to read and Microsoft does not recommend nested security groups inside SharePoint groups.
- **Mixing both types in one design with no naming rule.** Name groups so that the type and the purpose are visible, for example "SEC-Finance-Readers".
- **Forgetting an owner for each group.** A group without an owner will not be reviewed.

## How software can help

Microsoft gives you the tools to start: the Microsoft Entra admin center and the Microsoft 365 admin center show group type and members, and SharePoint's Site permissions page shows which groups sit in which SharePoint group. PowerShell can export all groups and owners into one table. For tenants with many sites, a report that joins group membership with site access is the missing piece, so ask whether your reporting shows people through groups and not only direct entries.

## Next step

Pick one site today and write down which group, security or Microsoft 365, gives each audience access. If a read-only audience sits in a Microsoft 365 group, move it to a security group in Visitors. That is the quickest way to apply the right security group vs Microsoft 365 group choice.
