---
title: "Who should be allowed to create SharePoint sites?"
summary: "Who can create SharePoint sites? By default, all users. Learn the three controls to restrict site creation and how to decide who gets the right to create sites."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [sharepoint-site-provisioning, sharepoint-governance, microsoft-365-groups, decision-rights]
keypoints:
  - "By default, users can create communication sites and Microsoft 365 group-connected team sites, so site creation starts open."
  - "Switching off site creation in SharePoint does not stop people from creating Microsoft 365 groups or Teams, and every group comes with a team site."
  - "Restricting group creation to one group affects Outlook, SharePoint, Viva Engage, Teams and Planner, and it needs Microsoft Entra ID P1 or P2 licenses for the people involved."
  - "Restricted site creation is a SharePoint Advanced Management feature that Microsoft says needs the Plan 1 add-on."
  - "Decide who may create sites as a governance choice: name the approver, set a request path with purpose and owner, and write down the exceptions."
faq:
  - q: "Who can create SharePoint sites by default?"
    a: "Microsoft states that by default, users can create communication sites and Microsoft 365 group-connected team sites. The setting Users can create SharePoint sites controls creation from SharePoint, OneDrive, PnP PowerShell and the REST API. Because every Microsoft 365 group comes with a team site, creating a team also creates a site."
  - q: "How do I stop users from creating SharePoint sites?"
    a: "Clear the Users can create SharePoint sites setting in the SharePoint admin center under Settings, Site creation. That alone is not enough, because Microsoft states it does not remove the ability to create Microsoft 365 groups or Teams, which create sites too. You also need to restrict group creation, for example to one security group."
  - q: "Do I need a special license to restrict site creation?"
    a: "It depends on the control. Restricting who can create Microsoft 365 groups requires Microsoft Entra ID P1 or P2 for the admin and the allowed members. Microsoft states that some SharePoint Advanced Management features, such as restricted site creation, require the SharePoint Advanced Management Plan 1 add-on. Check the prerequisites page for your tenant."
---

By default, all users can create SharePoint sites, so the question is not whether people can, but who should. This guide is for the IT manager who has to decide how much freedom to give and how to enforce it. It explains the default behavior, the three controls Microsoft provides, why switching off only one of them does not work, and how to decide who gets the right to create sites without turning every request into a ticket queue.

## Who can create SharePoint sites by default?

According to Microsoft's article on [managing site creation](https://learn.microsoft.com/sharepoint/manage-site-creation), users can create communication sites and Microsoft 365 group-connected team sites by default. The setting Users can create SharePoint sites in the SharePoint admin center, under Settings and Site creation, controls whether users can create sites from SharePoint, from OneDrive, with PnP PowerShell and with the REST API.

There is a second path that many admins overlook. Each [Microsoft 365 group](https://www.m365.fm/entity/microsoft-365-groups/) comes with a team site, so every team, every Outlook group and every Planner plan that creates a group also creates a site. The same Microsoft article says that disabling site creation for users does not remove their ability to create Microsoft 365 groups or resources such as Microsoft Teams that rely on a group. The practical answer to who can create sites in SharePoint Online is therefore: everyone, through at least two doors, and each new site brings its own owners and permissions to manage.

## Restrict site creation: the three controls you have

Site creation permission is not one switch. You have three levers, and each one closes a different door.

### 1. The SharePoint site creation setting

This is the setting described above. Clearing it stops users from creating sites through SharePoint, OneDrive, PnP PowerShell and the REST API. It is the simplest control and the one most people try first. It also has a classic counterpart for subsites: in the classic settings, you can disable subsite creation for all sites, enable it for classic sites only, or enable it for all sites. Microsoft recommends hub sites instead of subsites.

### 2. Group creation

Microsoft's article on [restricting who can create Microsoft 365 groups](https://learn.microsoft.com/en-us/office365/admin/create-groups/manage-creation-of-groups) says that by default all users can create groups. If you need to restrict this, you can limit it to the members of one Microsoft 365 group or security group. Key points from that page:

- The restriction affects every service that relies on groups: Outlook, SharePoint, Viva Engage, Microsoft Teams, Planner and others.
- You configure it with the Microsoft Graph PowerShell module, through the directory setting `Group.Unified` with the values `EnableGroupCreation` and `GroupCreationAllowedGroupId`.
- Admins in certain roles keep their ability to create groups. The page says the steps cannot prevent members of certain roles from creating groups.
- Microsoft Entra ID P1 or P2 licenses are required for the admin who configures the setting and for the members who are allowed to create groups.
- You first create the group of allowed creators in the Microsoft 365 admin center, on the Groups page, and add the people as members, not as owners. Only these members keep the permission to create new groups.
- Changes can take 30 minutes or more to apply.

The page carries a note that it is archived, so check the current documentation before you rely on the details.

### 3. SharePoint Advanced Management controls

Microsoft's [SharePoint Advanced Management overview](https://learn.microsoft.com/en-us/sharepoint/advanced-management) lists two relevant tools. You can specify which non-Microsoft applications can create sites, and you can use PowerShell to designate who can create OneDrive and SharePoint sites with Microsoft Entra ID security groups. The [prerequisites page](https://learn.microsoft.com/sharepoint/sharepoint-advanced-management-prerequisites) states that some features, such as restricted site creation, require the SharePoint Advanced Management Plan 1 add-on. Read it before you plan around this control.

## Why switching off one control is not enough

The most common failure is a half-closed door. An admin clears the site creation setting, the number of new sites barely changes, and the admin concludes that the setting is broken. It is not broken. People now create sites through Teams or Outlook, because group creation is still open.

The reverse also happens. If you restrict group creation but leave the SharePoint setting on, people can still create communication sites and standalone sites. So decide which doors you want to close, and close them together:

- To control team sites and Teams, restrict group creation.
- To control communication sites and sites created from SharePoint or OneDrive, restrict the site creation setting or use the Advanced Management control.
- To control apps that create sites on behalf of users, use the application control.

Test the result with a normal user and an allowed user, and give the changes time to apply.

## Check what is open today

Before you change anything, find out which doors are open in your tenant. Open the Site creation page in the SharePoint admin center and note whether users can create SharePoint sites, and which defaults (time zone, storage limit) apply to new sites. Then test group creation with an ordinary account. Microsoft's own verification step is to open Planner and select New Plan with a user who is not in the allowed group: the page should show that plan and group creation is disabled. Repeat the test with an allowed member. Write the result down with the date, because the answer changes whenever someone edits the tenant settings.

## Decide who should be allowed

The technical part is easy to describe. The harder part is the decision. A good decision balances speed and control, and it is a governance choice, not an IT preference. Three models cover most organizations:

- **Open.** Everyone creates sites. This is fast and invites sprawl unless your [SharePoint governance](https://www.m365.fm/entity/sharepoint-governance/) adds lifecycle policies and owner rules.
- **Trained creators.** A named group of people, such as site owners who completed a short training, can create sites. Everyone else asks them. This is a good middle path, because the group is large enough to be fast.
- **Request and approval.** Everyone requests, and an approver creates or approves the site. This gives the most control and the slowest start, so use it for sensitive or external sites.

Many organizations combine them: open creation for small team workspaces, creator groups for communication sites, and approval for anything with external sharing or sensitive data.

Write down the decision as a matrix of who may approve, who may override, and who owns exceptions. This is what [decision rights](https://www.m365.fm/entity/decision-rights/) means in practice: no one needs to guess who answers when a team asks for an exception. Assign the right to approve exceptions to a named role, not to the admin who happens to receive the email.

## Build the request path

If you restrict creation, you owe people a fast path. A controlled [site provisioning](https://www.m365.fm/entity/sharepoint-site-provisioning/) process asks for the same few things each time:

1. **Purpose.** What is this site for, and is there an existing site that fits?
2. **Owners.** Name at least two people.
3. **Type and template.** Team site, communication site or a Microsoft 365 group with a team.
4. **Sensitivity and sharing.** Will external users get access?
5. **Review date.** When will the owners confirm the site is still needed?

Use a form, a Power Automate flow or a ticket, but keep the response time short and publish it. A request path that takes a week will lead to shadow tools, and the control will have created a worse problem than it solved.

## Example: 12,000 users and 3,100 sites

This example uses invented numbers. A company with 12,000 users has 3,100 sites and about 45 new sites per month. The IT manager decides on the combined model.

- Group creation is limited to a security group of 120 trained site owners, which is 1 percent of the users.
- Everyone else submits a request form for a team or a site. The target answer time is two business days.
- Communication sites for the intranet are created by the web team only.

After three months, the company counts 60 requests per month. Of these, 30 are approved at once, 18 are redirected to an existing site and 12 need changes before approval. New sites fall from 45 to 42 per month, and 18 requests per month end at an existing site instead of a duplicate, which is the main benefit. The manager also tracks the average answer time. If it grows beyond two business days, the creator group grows.

## Common mistakes

- **Closing one door only.** Site creation, group creation and app creation are separate controls.
- **No fast path.** A restriction without a request process pushes people to unmanaged tools.
- **Ignoring the licenses.** Group creation limits need Microsoft Entra ID P1 or P2, and restricted site creation needs the Advanced Management add-on according to Microsoft.
- **Forgetting the exempt roles.** Admins in certain roles can still create groups, so review who holds those roles.
- **No owner rule.** Controlling creation without requiring owners just moves the sprawl problem to later.

## How software can help

The SharePoint admin center settings and a request form cover the basics. Microsoft's PowerShell cmdlets let you script creator groups, and a Power Automate flow can route requests to approvers. Judge any provisioning tool by whether it applies the same template, owners and review date every time, and whether it gives requesters a status they can see.

## Next step

List the three doors in your tenant today, and check for each one whether it is open, restricted or untested. Then write down who can create SharePoint sites in your organization, and who approves the exceptions.
