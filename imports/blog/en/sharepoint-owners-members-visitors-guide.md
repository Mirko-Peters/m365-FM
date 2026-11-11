---
title: "SharePoint owners, members and visitors: who belongs in which group?"
summary: "SharePoint owners, members and visitors explained: what each group can do, who belongs in which one, and how team sites and communication sites differ."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [sharepoint-permissions, microsoft-365-groups, sharepoint-site-owner]
keypoints:
  - "Owners manage the site and its access, members create and edit content, and visitors only read. Match the group to the job, not to a person's job title."
  - "On a team site, Microsoft says to manage permissions through the connected Microsoft 365 group, because group owners become site owners and group members become site members."
  - "Microsoft 365 groups have no view-only role, so on a group-connected site you add readers directly to the Visitors group on the site."
  - "The default Share option, Can edit, puts people in the Members group, so a quick share can give edit rights to more people than intended."
  - "Keep owners few, keep members to the people who create content, and use a security group in Visitors for large audiences."
faq:
  - q: "What is the difference between members and visitors in SharePoint?"
    a: "Members can create and edit content on the site. By default the Members group holds the Edit permission level. Visitors can only read. By default the Visitors group holds Read. If someone only needs to view pages and documents, put them in Visitors, not Members, so they cannot change anything."
  - q: "Who should be a site owner in SharePoint?"
    a: "Owners are the people who manage site permissions, settings and appearance, so choose people who are accountable for the site and who know its audience. Two or three named owners are a sensible target, so that access never depends on one person. Do not make every content editor an owner."
  - q: "Can a Microsoft 365 group give read-only access to a team site?"
    a: "No. Microsoft states that Microsoft 365 groups have no view-only access. Group owners become site owners and group members become site members. To give people read-only access to a group-connected site, you add them directly to the Visitors group on the SharePoint site."
---

SharePoint owners, members and visitors are the three default groups of a site. Owners manage the site and who can access it. Members create and edit content. Visitors read it. This guide is for site owners who must decide who belongs in which group, and who want to avoid giving more access than people need. You will see what each group can do, how team sites and communication sites handle the groups differently, and how to place people with a short example and a checklist.

## What can SharePoint owners, members and visitors do?

The three groups map to three permission levels. Microsoft describes them on its page about [understanding permission levels](https://learn.microsoft.com/en-us/sharepoint/understanding-permission-levels):

- **Owners** hold Full Control. They manage site permissions, settings and appearance.
- **Members** hold Edit by default. They can add, edit and delete lists and work with items and documents. Microsoft's group page notes that the exact level for Members depends on the site template, so check yours.
- **Visitors** hold Read. They can view pages and items and download documents, but they cannot change content.

The right way to think about this is by job. Ask what a person must do on the site. If the answer is "manage who can access it", that person is an owner. If it is "write and update pages and files", that person is a member. If it is "read what the team publishes", that person is a visitor. Job titles do not matter here. A director may be a visitor. An assistant who updates the news page may be a member.

This is the base of [SharePoint permissions](https://www.m365.fm/entity/sharepoint-permissions/) on every modern site. Direct shares and links come on top of it, but the three groups decide who has standing access.

## How do team sites and communication sites differ?

The groups work differently depending on the site type. Microsoft's article on [sharing and permissions in the modern experience](https://learn.microsoft.com/en-us/sharepoint/modern-experience-sharing-permissions) explains both.

**Team sites** are part of a Microsoft 365 group by default. Microsoft says permissions for team sites are best managed through the associated group or the Teams team. Group owners become site owners, and group members become site members. When you add a person to the [Microsoft 365 group](https://www.m365.fm/entity/microsoft-365-groups/), they also get access to the other group services, such as the shared mailbox and calendar. Microsoft advises against managing team site permissions separately with SharePoint groups, because it makes administration harder.

**Communication sites** are not connected to Microsoft 365 groups. You manage them with the three SharePoint groups. Microsoft describes the normal shape: one or more owners, a relatively small number of members who create content, and a large number of visitors who are the audience. You can add individual users, security groups or Microsoft 365 groups to any of the three groups. Microsoft warns that nested security groups can cause performance issues and does not recommend them.

One more case: sites that belong to private or shared channels in Teams. For these, Microsoft says permission management must be done in Teams, and the SharePoint view is read-only.

## Who belongs in which group? A placement guide

Use these rules. They follow Microsoft's guidance and basic least-privilege thinking.

1. **Owners: few and named.** Choose people who will act as [site owners](https://www.m365.fm/entity/sharepoint-site-owner/) and who are accountable for the site. Two or three is a sensible target, so access does not depend on a single person. Owners hold Full Control, so each additional owner is another person who can change access for everyone.
2. **Members: people who create content.** Microsoft expects a relatively small number of them on a communication site. If a Teams team should create content on a communication site, add the team's Microsoft 365 group to the Members group of the site.
3. **Visitors: the audience.** Microsoft calls the Visitors group a good place for security groups, because it is often the easiest way to add large numbers of users to a site.
4. **Readers on a group-connected team site: add them to Visitors on the site.** Microsoft states that Microsoft 365 groups have no view-only access. Any user who should only view the site must be added directly to the Visitors group.
5. **Ask before you add anyone to Members.** Members can change content. If the person only reads, Visitors is enough.

## Why does a quick share put people in Members?

The Share dialog is where many sites drift. Microsoft's page on [customizing site permissions](https://learn.microsoft.com/en-us/sharepoint/customize-sharepoint-site-permissions) says that the default Can edit option grants permissions in the SharePoint Members group. So when someone invites a colleague with the default settings, that colleague becomes a member and can edit site content.

There is a second path to watch. Microsoft's permission levels page states that "Everyone except external users" is added to the Members group automatically on modern team sites with Public privacy. On a private team site, it gets no permissions unless someone adds it. If the site holds sensitive material, check the privacy setting first.

Also remember that, by default, site owners and members can add new users to the site. A member who invites a colleague can therefore widen access without asking an owner, which is one more reason to keep the Members group small.

## How do you move a person between the groups?

The steps differ by site type. Microsoft's page on customizing site permissions describes where to look:

1. Open the site and select **Settings**, then **Site permissions**.
2. On a communication site, use **Site access** to see and change the three groups.
3. On a team site, select the members entry to open the **Group membership** dialog. Changes there change the Microsoft 365 group.
4. To make someone an owner, add them as a member first. Then use the drop-down arrow in the member profile to make them an owner.
5. For a classic path, go to **Site settings**, then **Users and Permissions**, then **People and Groups**.

Write down the change and the reason, even if it is one line. A short log of who was moved and why makes the next review much faster.

## Example: a company news site with 600 readers

The numbers are invented to show the method. A communication site publishes company news. Two people from corporate communications run it. Eight people from five departments write articles. All 600 employees should read it.

1. **Owners (2):** the head of communications and a deputy. Both are accountable. If one is away, the other can still manage access.
2. **Members (8):** the eight writers. Add them as individuals, or put them into one security group named "News writers" and add that group to Members. The second option makes departures easier: you remove one name from one group.
3. **Visitors (1 security group, 600 people):** a security group that contains all employees. You add one entry, not 600.

Result: ten people can change the site and one audience group reads it. Anyone can see at a glance who can change the site. When a writer leaves, you remove one name. When the company hires a new employee, the security group updates and the news site needs no change. Compare that with a site where 600 people were added as members, each one able to edit.

## Common mistakes

- **Making everyone a member.** It is the easy answer and it gives edit rights to people who only read.
- **Making many owners.** Every owner can change access. Keep the list short and named.
- **Adding readers to the Microsoft 365 group.** On a team site this turns them into site members. Use Visitors on the site for read-only access, as Microsoft describes.
- **Nesting security groups inside the groups.** Microsoft does not recommend nested security groups because of performance issues.
- **Skipping a regular review.** People change roles. A group that was right last year may now hold people who no longer need access.

## How software can help

Start with the built-in views. **Site permissions** lists the owners, members and visitors of a site, and the Microsoft 365 admin center shows group membership for team sites. For a few sites that is enough. For dozens of sites, a list of owners and members from PowerShell or a report export saves time, because you can sort for sites with too many owners or with no owner at all. Whatever tool you use, keep one rule: the people who can change a site must be easy to name.

## Next step

Open one important site today and write down who is in SharePoint owners, members and visitors. Move anyone who only reads from Members to Visitors, and reduce the owner list to the people who are accountable.
