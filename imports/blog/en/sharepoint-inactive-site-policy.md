---
title: "Inactive site policies in SharePoint: notify owners before you act"
summary: "Set up a SharePoint inactive site policy that emails owners first: scope, activity rules, simulation mode and the safe choice of read-only or archive."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [inactive-site-policy, sharepoint-site-lifecycle, sharepoint-site-owner, sharepoint-advanced-management]
keypoints:
  - "An inactive site policy finds sites without activity, emails the owners or admins and asks them to certify the site; it never deletes a site."
  - "Run the policy in simulation mode first, because it runs once and creates a report without notifying anyone."
  - "Owners get monthly notices for three months, and a certified site is not checked again for one year."
  - "If nobody answers, you choose: do nothing, set the site to read-only, or archive it after a read-only period of 3, 6, 9 or 12 months."
  - "Site owners cannot unlock a read-only site; only a tenant admin can, so prepare that process before you switch on enforcement."
faq:
  - q: "Does the inactive site policy delete SharePoint sites?"
    a: "No. Microsoft states that site lifecycle management policies do not delete sites directly. The policy notifies owners and admins, and after several unanswered notices it can do nothing, set the site to read-only or archive it after a read-only period. Archived sites can be reactivated by a tenant admin."
  - q: "What counts as activity for an inactive site?"
    a: "The policy looks at SharePoint activity such as viewed, edited, shared and synced files and visited pages, and at connected workloads: Teams messages and meetings, Viva Engage posts and Exchange mail. Activity through an app token is mostly ignored, and opening the site from the notification email does not count."
  - q: "What happens when an owner confirms that the site is still needed?"
    a: "The owner selects the Certify site button in the email. Microsoft states that after certification, site lifecycle management does not check the site's activity for one year. Edits to the site count as activity and reset the inactivity status, so a site that is used again drops out of the policy on its own."
---

A SharePoint inactive site policy finds sites without meaningful activity, emails their owners and asks them to confirm that the site is still needed, and only then, if nobody answers, can it set the site to read-only or archive it. This guide is for the SharePoint admin who wants to set up the policy so that owners hear from you first. It covers how to deal with inactive SharePoint sites in SharePoint Online: what the policy does, what it counts as activity, the licenses and roles you need, the setup steps and a safe order for the enforcement options.

## SharePoint inactive site policy: what it does and what it does not

The [inactive site policy](https://www.m365.fm/entity/inactive-site-policy/) is one of three policy types in Microsoft's [site lifecycle management](https://learn.microsoft.com/en-us/sharepoint/site-lifecycle-management). The others are a site ownership policy, which makes sure a site has enough owners, and a site attestation policy, which asks for regular confirmation that a site is still needed. Together they form the [site lifecycle](https://www.m365.fm/entity/sharepoint-site-lifecycle/) tooling in SharePoint Advanced Management.

Three facts shape how you use it:

- **It does not delete.** Microsoft states: "Site lifecycle management policies don't delete SharePoint sites directly." The strongest action is archiving.
- **It runs in two modes.** Simulation mode runs the policy once and creates a report without ongoing enforcement. Active mode runs on a schedule, creates reports and sends notifications.
- **It acts through people.** Notifications use Outlook actionable messages, so an owner can respond from the email without opening the admin center.

The policy therefore works as a conversation with the owners, not as a cleanup script. Your job is to make that conversation easy to answer.

## What counts as activity

If the policy flags a site that people use every day, owners lose trust in it. Know the rules for every SharePoint site from the [inactive site policy page](https://learn.microsoft.com/sharepoint/inactive-site-policy):

- **SharePoint:** viewed, edited, shared and synced files, and viewed or visited pages.
- **Teams:** channel and team messages, replies, mentions, reactions and meetings.
- **Viva Engage:** posted messages, read conversations and liked messages.
- **Exchange:** emails received in the connected mailbox.
- **Not counted:** activity through an app token, PnP PowerShell activity through a user token, and opening the site from the link in the notification email. Edits made after that visit do count and reset the inactivity status.

Some sites are out of scope: OneDrive sites, sites created by system users, app catalog sites, root sites, home sites, tenant admin sites and sites associated with shared and private Teams channels. Communication sites, classic sites and Teams-connected or group-connected sites are in scope.

## Before you start: Microsoft 365 licenses and roles

SharePoint Advanced Management features need a license, so check this before you plan. According to Microsoft's [prerequisites page](https://learn.microsoft.com/sharepoint/sharepoint-advanced-management-prerequisites), you need a base subscription such as Microsoft 365 E3 or E5, and at least one of these:

- At least one user in the organization has a Microsoft Copilot license. The user does not need to be a SharePoint administrator.
- Your subscription includes SharePoint K, P1 or P2 and you buy the SharePoint Advanced Management Plan 1 add-on.
- Your organization has Microsoft 365 E7.

With a Copilot license assigned to at least one user, SharePoint administrators automatically receive access to the SharePoint Advanced Management capabilities, according to the same page. For roles, you work as a SharePoint administrator. The page also describes a SharePoint Advanced Management Administrator role. Only a Global Administrator can configure the custom domain that you need for customized emails. Read the licensing details of [SharePoint Advanced Management](https://www.m365.fm/entity/sharepoint-advanced-management/) in your own tenant, because the prerequisites change over time.

## Set up the policy step by step

The steps below follow Microsoft's documentation. Menu names can change, so compare them with your admin center.

1. **Open the policy page.** Sign in to the SharePoint admin center, expand Policies, select Site lifecycle management, and under Inactive site policies select Open.
2. **Create the policy.** Select Create policy and read the information page.
3. **Set the scope.** You can upload a CSV file with a list of up to 10,000 site URLs, for example a list that you exported from the Active sites page. You can also choose whether sites with retention policies and retention holds are included.
4. **Configure the policy.** Specify the inactivity period, choose whether to email site owners, site admins or both, and choose the action after three notifications. The documentation does not list the available inactivity periods, so confirm them in the wizard.
5. **Customize the email.** The subject can have up to 100 characters and the message up to 500, with placeholders for the user name, site name and site URL.
6. **Name the policy and choose the mode.** Choose simulation mode first.
7. **Finish and review the report.** Results appear on the Inactive site policy dashboard, and the report can be downloaded as a CSV file.

For the customized email, Microsoft requires that you set up sending from your own domain in the Microsoft 365 admin center. Without it, the default emails come from the noreply@sharepoint.com address. Owners are more likely to read a mail from a known domain than from a generic address, so this is worth doing first.

## Notify the owners before you act

The policy is only as good as the list of owners behind it. A message to a person who left two years ago helps nobody. Before you switch to active mode, check that the [site owners](https://www.m365.fm/entity/sharepoint-site-owner/) of the sites in scope are real people, and use a site ownership policy or a manual review to fix the sites that have none.

What the owner experiences in active mode:

- **Three monthly notifications.** Microsoft's page states that enforcement happens for sites that are not certified after three monthly notifications.
- **A Certify site button.** One click confirms that the site is still needed. After certification, activity is not checked for one year.
- **No change for active sites.** An edit counts as activity and resets the inactivity status.

You can also exclude up to 100 entries, such as users, Microsoft 365 groups or security groups, from the notifications. The exclusion only changes who receives mail. It does not change permissions or ownership, and the site is still evaluated.

Write the email in plain words: say which site, why you contacted the owner, what the one-click answer is, and what happens in the next month if there is no answer. A short text of 500 characters or fewer is enough. Tell the owners in advance, in your regular channels, that the mails are coming and that they are real. This avoids reports of phishing.

## Choose the enforcement action

After three notifications without an answer, you choose one of three actions:

- **Do nothing.** The report lists the site as unactioned. Notifications pause for three months and resume after six months if the site remains unattested.
- **Read-only access.** The site goes into read-only mode. Site owners cannot remove read-only mode themselves, and a tenant admin has to unlock it from the Active sites page.
- **Archive after a mandatory read-only period.** The site stays read-only for 3, 6, 9 or 12 months and is then archived through Microsoft 365 Archive. Archiving requires Microsoft 365 Archive to be enabled in the Microsoft 365 admin center. Only a tenant admin can reactivate an archived site.

A safe order is to start with do nothing in the first cycle to learn how many owners answer, then move to read-only, and use archive after you have run the unlock process at least once. Disabling or deleting a policy stops future actions but does not reverse actions that were already taken, so test before you enforce.

## Example: 420 inactive sites

This example uses invented numbers. A tenant has 1,500 sites in scope, and the simulation report flags 420 of them as inactive, which is 28 percent.

- **Month 1:** 150 owners select Certify site, leaving 270 sites.
- **Month 2:** 90 more owners answer, leaving 180 sites.
- **Month 3:** 60 more owners answer, leaving 120 sites without an answer, which is about 29 percent of the 420.

The admin chose the read-only action with a later archive. The 120 sites go read-only. During the next weeks, 10 owners ask for an unlock, which the admin grants after checking the reason, so 110 sites stay read-only and move toward archive after the chosen period. In total, 300 of 420 owners answered, which is 71 percent. The result is a smaller site list, an audit trail of who confirmed what, and no deleted content. The numbers will differ in your tenant, but the shape is typical: most answers come after the first mail, and a stubborn remainder needs the enforcement step.

## Common mistakes

- **Skipping simulation mode.** You will mail hundreds of owners based on a first guess of the scope.
- **Not checking owners.** A notice that reaches nobody makes the policy look like a silent timer.
- **Overlapping policies.** Microsoft recommends that policies of the same type do not have overlapping scopes.
- **Forgetting the unlock process.** Owners cannot unlock a read-only site. Name the person and the form before the first site is locked, and automate the request with a simple flow or a ticket queue.
- **Judging by files only.** A site can be quiet in files and busy in Teams. The policy counts both, and your review should as well.

## How software can help

The SharePoint admin center shows the policy dashboard and the reports, and a spreadsheet with the CSV export is enough to track owner answers. If you use a separate reporting tool, judge it by whether it shows the last activity, the owners and the policy status per site in one list, so that you can see which sites are waiting for an answer.

## Next step

Create your first SharePoint inactive site policy in simulation mode for one department's sites and read the report. Then check the owners of the flagged sites before you switch to active mode.
