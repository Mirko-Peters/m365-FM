---
title: "How to check who has access to a SharePoint site or folder"
summary: "Check who has access to SharePoint with four built-in views: site permissions, Check Permissions, Manage access and admin reports. Steps for each scope inside."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [sharepoint-permissions, sharepoint, sharepoint-site-owner, sharepoint-essentials-toolkit]
keypoints:
  - "No single screen shows every person with access to a SharePoint site and its content, so you use a different view for the site, for one user, and for a folder or file."
  - "The Site permissions panel shows the Owners, Members and Visitors of a site, and Check Permissions shows what one named person can do on that site."
  - "On a folder or file, the Manage access panel lists people, groups and sharing links that give access, including links that bypass the site groups."
  - "Group membership hides people: a security group or Microsoft 365 group counts as one entry, so you must open the group to see the individuals."
  - "Admins can get tenant-wide answers from the data access governance reports in the SharePoint admin center, which are point-in-time snapshots rather than live data."
faq:
  - q: "What is the difference between Check Permissions and Manage access?"
    a: "Check Permissions starts from a person: you enter one name on the Site permissions page and see what that person can do on the site. Manage access starts from an item: you open a folder or file and see the people, groups and links that give access to it. Use both, because they answer different questions."
  - q: "How do I see who has access to one SharePoint folder?"
    a: "Select the folder in the document library, choose Share, then open the Manage access panel from the group of circles at the bottom left. It lists people, groups and links that give access. The panel also lists any sharing links, so check the links part as well as the names."
  - q: "Does Check Permissions show access through groups?"
    a: "Yes. Enter a user's name in Check Permissions on the Site permissions page and select Check Now. The result shows the permissions the person holds on the site, and Microsoft advises checking the related security group where one applies. The documented steps cover one person at a time and the site level only."
---

To check who has access to SharePoint, use the view that matches what you need to know. The Site permissions panel lists the groups behind a site. Check Permissions tests one named person. The Manage access panel shows who can open a single folder or file. Admin reports cover the whole tenant. This article is for SharePoint admins who must answer the question "who can see this?" quickly and correctly. You will get the steps for each view, a worked example and the traps that make the answer look better than it is.

## What does "who has access" mean in SharePoint?

Access in SharePoint Online comes from several places at once. That is why one screen cannot show it all. A person can reach a document because of any of the following:

- They belong to the site's Owners, Members or Visitors group.
- They belong to a Microsoft 365 group or security group that sits inside one of those groups.
- Someone shared the folder or file with them directly.
- They opened a sharing link that gives access to the item.
- The site is public inside the organization, so "Everyone except external users" is in the Members group.

The [SharePoint permissions](https://www.m365.fm/entity/sharepoint-permissions/) model is therefore layered. Microsoft's page on [permission levels](https://learn.microsoft.com/en-us/sharepoint/understanding-permission-levels) explains the base permission levels: Owners hold Full Control, Members hold Edit, and Visitors hold Read. It also explains that when someone gets access to one specific item, SharePoint adds Limited Access on the containers so the page can load. Limited Access does not let that person see other content.

So start by deciding the scope of your question. Is it one site, one folder, the user permissions of one person, or all sites? The four views below follow that order.

## How to check the access of a whole site

Open the site, select **Settings**, then **Site permissions**. The panel shows the site's groups and their members. On a team site connected to a Microsoft 365 group, the group's owners are the site owners and its members are the site members. On a communication site, you manage the built-in SharePoint groups directly.

Use this short routine:

1. Open **Site permissions** and note how many people are in Owners, Members and Visitors.
2. Check the owner list first. Owners have [Full Control](https://www.m365.fm/entity/sharepoint-site-owner/), so every extra owner is a person who can change access for everyone else.
3. Look for groups inside the groups. A single line such as "Sales Team" can stand for dozens of people. Open it.
4. Look for "Everyone except external users". Microsoft states that it is added to the Members group automatically on public group-connected team sites. On private sites it gets no permissions unless someone adds it.
5. Open **Advanced permissions settings** to see the SharePoint groups on the site, including custom ones.

Microsoft's guidance on customizing site permissions adds two limits. You cannot change the default Owners, Members and Visitors groups on group-connected team sites from SharePoint, because the Microsoft 365 group controls them. And you should not delete the default groups.

## How to check what one person can do on a site

To test one person, use **Check Permissions**. The steps are on Microsoft's troubleshooting page for [Access Denied errors](https://learn.microsoft.com/en-us/troubleshoot/sharepoint/administration/access-denied-or-need-permission-error-sharepoint-online-or-onedrive-for-business):

1. Select **Settings**, then **Site permissions**.
2. In the ribbon, select **Check Permissions**.
3. Type the person's name in the **User/Group** field and select **Check Now**.
4. Review the person's permissions on the site, and check the related security group if one applies.

This is the fastest way to settle a support ticket such as "I cannot open the budget file". It answers one question about one person on one site. It does not list every site in the site collection or tenant that person can reach. For that you need a user access report, which a later section covers.

## How to check who can open a folder or a file

Folders and files can have their own permissions or share links. Use the Manage access panel:

1. In the document library, select the folder or file.
2. Select **Share** above the file list.
3. At the bottom left of the Share window, hover over the group of circles. Each circle is a person or group that has access.
4. Select it to open **Manage access**.

According to Microsoft's article on [seeing who a file is shared with](https://support.microsoft.com/en-us/sharepoint/sharepoint-sharing-and-permissions/see-who-a-file-is-shared-with-in-onedrive-or-sharepoint), the panel has three parts: people who have access, groups who have access, and links used to give access. Internal users appear by name. External users, meaning guests from outside your organization, appear by email address and carry an "External User" label. Select a name to open that person's access summary, which can include the groups that give them access to the site.

The links part is the one admins forget. A link set to "Anyone" or "People in your organization" gives access to people who are not on any list. If you only read the people tab, you will under-count.

## How admins check access across many sites

Site by site does not scale past a few dozen sites. For a tenant-wide view, use the **Data access governance** reports in the SharePoint admin center, under **Reports**. Microsoft documents [data access governance reports](https://learn.microsoft.com/en-us/sharepoint/data-access-governance-reports) as part of SharePoint Advanced Management. The licensing rules are on a separate prerequisites page, so check it before you plan around these reports. The page lists these reports:

- **Site permissions across your organization.** It highlights sites with the broadest access, such as sites open to thousands of users, to external guests, or to "Everyone except external users".
- **Site permissions for users.** It shows every site a chosen user can access, and whether the access is direct or through groups.
- **Sites and files shared via special SharePoint groups.** It lists items that are effectively open to everyone inside the organization.

These reports are snapshots. Microsoft's page on the per-user report says the data reflects up to 48 hours before generation, and a report can be run again every 30 days. Microsoft suggests running the site permission snapshots quarterly. Admins who prefer scripts can start these reports with the SharePoint Online PowerShell module and export the finished report as a CSV file. Treat the output as a baseline, not as live truth.

## Example: a 90-minute check of one team site

The numbers below are invented to show the method.

A team site for a project office has 3 owners, 12 members and 25 visitors on paper. You open Site permissions and find that one Visitors entry is a security group named "All Staff", which holds 140 people. The real reader count is 24 people plus 140, so up to 164, not 25.

Next you open the folder "Contracts" in the main library. Manage access shows two people with direct access and one link set to "People in your organization". The link was created for a single file but sits on the folder. So the folder is open to everyone in the company, even though the site looks small.

Your result for the site owner:

1. Owners: 3. Ask whether all three still work on the project.
2. Effective readers: up to 164 because of the "All Staff" group.
3. Contracts folder: one organization-wide link. Replace it with direct access for the 6 people who need it.
4. Next review date: in three months.

The whole check took five views and no scripts. That is the point: with a method, a site check is a matter of minutes.

## Common mistakes

- **Counting names instead of people.** A group counts as one line. Always open the group and read its members.
- **Reading the site groups only.** Direct shares and links to single files add people who are not in any site group.
- **Misreading Limited Access.** SharePoint assigns it automatically when someone gets access to a single item. It adds no other rights, so do not count it as access to the whole site.
- **Treating a report as live.** Snapshot reports can lag by up to 48 hours. Check the report date before you act.
- **Changing access without a record.** Write down who had access before you edit, so you can undo a mistake.

## How software can help

Start with what Microsoft 365 gives you: the Site permissions panel, Check Permissions, Manage access and, for admins with the right licenses, data access governance reports and the SharePoint Online PowerShell module. Together they cover most single-site questions. Their weak point is repetition: you have to open each site and item by hand. Reporting tools close that gap by listing permissions for sites, folders and items in one report. Cognillo's [SharePoint Essentials Toolkit](https://www.m365.fm/entity/sharepoint-essentials-toolkit/) is one example. According to its product page, it offers permission reports for sites, folders and items, and can show everything one person can access. These are the vendor's statements and M365.FM did not test them. Other tools and scripts do similar work. Compare them against the built-in views first.

Disclosure: Cognillo sponsors M365.FM.

## Next step

Pick your most visited team site today and walk through the steps above to check who has access to SharePoint there. Write the three numbers you find, owners, direct shares and links, and book a quarterly repeat.
