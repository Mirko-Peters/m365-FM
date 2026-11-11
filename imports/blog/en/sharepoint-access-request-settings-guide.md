---
title: "Access requests in SharePoint: who gets the email and who approves?"
summary: "SharePoint access request settings decide who gets the email and who can approve. See the defaults by site type, how to change them and how to run requests."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [sharepoint-site-owner, sharepoint-permissions, sharepoint-governance]
keypoints:
  - "By default the request goes to the Owners group on most sites, to group administrators on group-connected sites, and to the primary administrator on OneDrive and project sites."
  - "In the Site permissions panel you can switch access requests on or off, send them to a specific email address or distribution list, and add a custom message for the requester."
  - "Only site collection administrators, SharePoint admins and default Owners group members can use the Access requests page, so people with Full Control by other means may be refused."
  - "Sites that use mail-enabled security groups may not receive the request email, so test the route before you rely on it."
  - "Treat access requests as a process: name who answers, set a response time and always grant the smallest permission level that fits."
faq:
  - q: "Who gets the SharePoint access request email by default?"
    a: "It depends on the site type. On classic sites, communication sites and modern sites without a group, users in the Owners group get it. On group-connected sites, including Teams, the group administrators get it. On OneDrive and project sites, the primary site administrator gets it. You can change the recipient in the site's sharing settings."
  - q: "How do I change who receives access requests in SharePoint?"
    a: "Open Settings, then Site permissions. Under Site Sharing, select Change how members can share. Under Access requests, set Allow access requests to On, then choose the site owners or a specific email address, which can be a user or a distribution list. Add a custom message if you like and select Save."
  - q: "Why can a site owner not approve an access request?"
    a: "Only site collection administrators, SharePoint admins and members of the default Owners group can use the Access requests page. A person who has Full Control through another route is refused. Sites that use mail-enabled security groups may also not receive the request emails. Check the owner's group membership first."
---

SharePoint access request settings decide who receives the email when a person asks for access, and who can approve it. By default, the Owners group gets the request on most sites, the group administrators get it on group-connected sites, and the primary site administrator gets it on OneDrive and project sites. This article is for site owners who want those requests to reach the right person and be answered fast. You will see the defaults, the exact steps to change them, how to approve a request safely and a short example.

## Who gets the access request email by default?

Microsoft lists the defaults in its article on [setting up and managing access requests](https://support.microsoft.com/en-us/office/set-up-and-manage-access-requests-94b26e0b-2822-49d4-929a-8455698654b3). They depend on the site type:

- **Classic sites, communication sites and modern sites without a group:** the users in the Owners group.
- **Group-connected sites, including Microsoft Teams sites:** the group administrators.
- **OneDrive and project sites:** the primary site administrator.

Many problems start here. A team in Teams assumes that "the site owner" receives the mail. In fact, the group administrators receive it. If an administrator left the company or changed roles, the mail may go to nobody who reads it.

So the first check is simple. Open your site, look at the access request settings, and write down who gets the email today. This is a basic task for a [site owner](https://www.m365.fm/entity/sharepoint-site-owner/), and it takes two minutes.

## How do you change the SharePoint access request settings?

Microsoft describes the steps in the same article:

1. Select **Settings**, then **Site permissions**.
2. Under **Site Sharing**, select **Change how members can share**.
3. Under **Access requests**, set **Allow access requests** to **On**.
4. Choose the recipients: the site owners, or **Specific email**. A specific email can be one user or a distribution list.
5. Optionally, add a custom message that appears on the access request page.
6. Select **Save**.

On the same page you can decide who may share at all. The options are owners and members, only owners for the site itself, or only owners. You can also disable sharing by members. Microsoft notes that the Share menu then stays visible but shows an error when a member tries to share.

The custom message is worth using. Tell people what to include: the business reason, the project name and how long they need access. A good request lets the approver decide in a minute.

## How do you approve or decline a request?

Approvers use the Access requests page. The steps are:

1. Go to **Settings**, then **Site contents**.
2. Select **Access requests**. The button appears only when requests are pending.
3. Under **Pending Requests**, open the menu for the request.
4. Choose a permission level, add a message if needed, then select **Approve** or **Decline**.
5. Use **Show History** to see past requests.

The permission level in step 4 is the part that matters most. Do not accept the default without thought. For a person who only needs to read, choose Read. Microsoft's page on [permission levels](https://learn.microsoft.com/en-us/sharepoint/understanding-permission-levels) explains that Read lets people view pages and items and download documents, while Edit and Full Control allow far more. The smallest level that fits is the right one. Every approval you give becomes part of your [SharePoint permissions](https://www.m365.fm/entity/sharepoint-permissions/), so it should be easy to explain later.

For guest invitations, Microsoft adds some rules. Before a guest accepts, you can withdraw an invitation. You can resend an invitation within 90 days, but resending does not extend the deadline. An expired invitation needs a new one. After acceptance, you remove the guest from the permission group.

## What should the request message ask for?

A request page that only says "Request access" produces vague requests. The custom message turns it into a short form. Ask for four things:

1. **The reason.** What task or project needs the access?
2. **The role.** Does the person need to read, or to change content?
3. **The duration.** Is it permanent, or until a project ends?
4. **The approver's name.** Who in the business knows the requester?

With these four answers, an owner can decide without a follow-up mail. Keep a short note of each approval, even in a shared sheet, so the next review can see why access exists.

## Why do some owners not receive or approve requests?

Microsoft lists three limits you should know:

- Sites that use mail-enabled security groups may not receive the request emails.
- Only site collection administrators, SharePoint admins and members of the default Owners group can use the Access requests page. A person who left the Owners group and later got Full Control is denied access to the page.
- On project sites, requests from the Owners group go to the primary administrator of the site collection.

These explain the typical support case: "I am an owner, but I cannot approve." Check how the person got their rights. If they are not in the default Owners group, add them there or send the request to a shared address that a member of the group monitors.

A second common case is the request that nobody answers. People wait, then ask a colleague to share the file by a link, which creates exactly the kind of untracked access that audits find later. A working request process is a security control, not only a convenience.

## Should you turn access requests on or off?

Think about what you want people to do when they hit a closed door. If requests are on and answered within a day, people ask the owner and get a decision. That keeps access visible. If requests are off or ignored, people look for other ways: they ask a member to share the file, or they ask for a copy. Both routes weaken your control.

A practical rule: keep requests on for sites with a living owner team, and send them to a shared mailbox or distribution list so that one absence does not block work. For sensitive sites, keep requests on but limit who may share, so that members cannot invite others without an owner's decision. This ties into [SharePoint governance](https://www.m365.fm/entity/sharepoint-governance/): a named owner, a named route and a time limit for answers.

## Example: a project site with a response promise

The numbers are invented to show the method. A project site has three owners. One owner left in spring. Access requests went to the Owners group, and the remaining two owners rarely checked their mail. In one quarter, 18 requests arrived. Only 7 were approved on the same day. The other 11 waited between 3 and 9 days, and in 4 of those cases the requester got a link from a colleague.

The site owner makes three changes:

1. Set **Specific email** to a shared distribution list called "Project office", with three members.
2. Add a custom message: "Tell us your project, your role and for how long you need access."
3. Agree a rule: answer within one working day, and use Read unless the request states a reason for more.

The next quarter, 15 requests arrive. 13 are answered the same day and the other 2 the next day. No one needs a link from a colleague. The shared list also keeps working when one person is on leave.

## Common mistakes

- **Assuming the owner gets the mail.** On group-connected sites the group administrators do.
- **Sending requests to a single person.** One absence blocks everything. Use a list.
- **Approving with the default level.** Pick the smallest level that fits the reason.
- **Using a mail-enabled security group as recipient.** Microsoft warns that such sites may not receive the email. Test it.
- **Ignoring requests.** Slow answers push people to untracked sharing.

## How software can help

The built-in route is enough for most sites: the access request settings, the Access requests page and its history. For a tenant with many sites, add a simple check. A short script or report can list the sites where access requests are off or where the recipient is a person who has left. Whatever method you choose, review the list once a quarter, and fix the recipients first.

## Next step

Open one important site today and check the SharePoint access request settings: who gets the email, who can approve, and what the custom message says. Change the recipient to a shared list if only one person is named.
