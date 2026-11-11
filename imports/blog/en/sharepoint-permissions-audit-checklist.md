---
title: "SharePoint permissions audit: a step-by-step checklist"
summary: "SharePoint permissions audit in ten steps: scope, inventory, broad access, owners, groups, links, leavers and reviews. With a worked example and a repeat date."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [sharepoint-permissions, access-reviews, sharepoint-governance, sharepoint-essentials-toolkit]
keypoints:
  - "A SharePoint permissions audit answers three questions: who can reach which content, whether they still need it, and who is accountable for each site."
  - "Start with an organization-wide inventory, then look first at the broadest exposure: content open to everyone in the company, guests and anyone links."
  - "Site owners know why access exists, so delegate the review to them. Microsoft's site access reviews send owners a task from the admin center."
  - "Microsoft suggests running the site permission snapshot reports quarterly and the activity reports monthly, which gives you a natural audit rhythm."
  - "An audit is only done when you record what you changed, who signed off and when the next one is due."
faq:
  - q: "How often should you run a SharePoint permissions audit?"
    a: "Microsoft recommends running the site permissions snapshot reports quarterly for a baseline and the sharing activity reports monthly to catch ongoing sharing. A full review with site owners fits the quarterly rhythm. Run extra checks after reorganizations, mergers, large projects or before a Copilot rollout."
  - q: "What should a SharePoint permissions audit check first?"
    a: "Start with the broadest exposure. That means sites and files open to everyone in the organization, guest access, and sharing links that anyone can use. These carry the highest risk for the least effort to fix. After that, check ownership, groups and items with unique permissions."
  - q: "Who should perform a SharePoint permissions audit?"
    a: "The IT or SharePoint admin team runs the inventory and reports, and site owners review their own sites. Admins see the pattern across the tenant, but owners know why people have access. Microsoft's site access reviews are built for this split, sending each owner a review request by email."
---

A SharePoint permissions audit checks who can reach which content, whether they still need it, and who is accountable for each site. This checklist is for IT managers who must run a first audit or turn an irregular one into a routine. It has ten steps in a fixed order: scope, inventory, broad access, owners, groups, unique permissions, links, leavers, owner reviews and a repeat date. You will also see a worked example, the usual mistakes and the point where software helps.

## What is a SharePoint permissions audit, and what does it deliver?

An audit is not a one-off cleanup. It is a repeatable check with a result you can show, and it is a core routine of [SharePoint governance](https://www.m365.fm/entity/sharepoint-governance/). The result has four parts: a list of sites in scope, a list of findings, a record of the changes you made, and a date for the next round.

Keep the goal narrow. You are not trying to fix every file. You want to remove the access that carries risk for little business value. That usually means a short list of sites with too many people, too many guests or too many exceptions.

Plan for people as well as settings. Admins can see numbers, but they cannot know whether the finance group still needs the old project site. Site owners can. So the audit works best when the admin team prepares the evidence and the owners decide.

## Step 1 to 3: scope, inventory and broad access

- **Step 1: Set the scope.** Decide which sites you audit first. Start with sites that hold sensitive content, sites with many users, and sites with guests. Write the list down.
- **Step 2: Build the inventory.** In the SharePoint admin center, go to **Reports**, then **Data access governance**. Microsoft's page on [data access governance reports](https://learn.microsoft.com/en-us/sharepoint/data-access-governance-reports) describes the report **Site permissions across your organization**. It highlights sites with the broadest access, such as thousands of users, external guests or "Everyone except external users". Check the licensing page first, because the reports belong to SharePoint Advanced Management.
- **Step 3: Check broad access.** Look at the report on sites and files shared with "Everyone except external users" and the sharing link activity. Microsoft describes "Everyone except external users" as a built-in group that includes all internal users and excludes guests. Content shared with it is open to the whole company.

These three steps produce your first findings. Sort them by exposure: guests first, whole-company access second, large groups third.

## Step 4 to 6: owners, groups and unique permissions

- **Step 4: Check ownership.** Every site needs at least two named owners who still work for the company. A site with no active owner has nobody to approve access. List these sites and assign owners before you do anything else.
- **Step 5: Check groups.** Open the groups behind each site: Owners, Members and Visitors, plus any Microsoft 365 or security groups inside. Look for groups with no owner, groups that nobody can explain, and large groups with edit rights.
- **Step 6: Check unique permissions.** Items with their own permissions are exceptions that audits often miss. Microsoft's page on [permission scopes](https://learn.microsoft.com/en-us/sharepoint/manage-permission-scope) recommends staying under 5,000 unique scopes per library, with 50,000 as the supported limit. A library near that number needs a closer look.

The [SharePoint permissions](https://www.m365.fm/entity/sharepoint-permissions/) model has three layers: site groups, library or folder settings, and single items. A good audit touches all three, but it starts with the site level, because one change there affects the most people.

## Step 7 to 8: links and leavers

- **Step 7: Check sharing links and external access.** List the sites where people created many sharing links, and check which link types are in use. Microsoft's activity reports cover the last 28 days of link creation for "Anyone", "People in the organization" and "Specific people" links. Guest accounts need their own review: who invited them, which site, and is the project still running?
- **Step 8: Check leavers and role changes.** Compare the access lists with a current list of employees and contractors. People who left must lose access. People who changed roles should lose the access of the old role.

Treat these two steps as the most useful for the effort. Old links and old accounts are the quiet part of oversharing: nobody uses them, yet they still work.

## Step 9 to 10: owner reviews and the repeat date

- **Step 9: Delegate reviews to site owners.** Microsoft's [site access reviews](https://learn.microsoft.com/en-us/sharepoint/site-access-review) let you start from a data access governance report and send owners a review request. You can select up to 100 sites in the admin center and start the review there. For more than 100 sites, use PowerShell. Microsoft states a limit of 1,000 site access reviews per calendar month for reviews started from the organization-wide site permissions report. Owners get an email with a link to a review page, make changes through **Manage access**, and select **Complete review**. You see the status on the **My review requests** tab.
- **Step 10: Record and repeat.** Write down findings, changes, owners who signed off, and the date of the next audit. Microsoft suggests the quarterly snapshot and monthly activity rhythm, so a quarterly audit with a monthly quick check is a sound default.

Audits turn into [access reviews](https://www.m365.fm/entity/access-reviews/) when you repeat them on a schedule with named owners. That repeat is what separates a routine from a one-time cleanup.

## Example: auditing 220 sites in six weeks

The numbers are invented to show the method. A company has 220 SharePoint sites. The admin team runs the organization-wide report and finds 14 sites open to "Everyone except external users", 9 sites with guests, and 31 sites with no active owner. Some sites appear in more than one list, so the unique total is 48 sites.

Week 1: assign owners to the 31 sites that have none. Week 2: remove the whole-company access from the 14 sites after owners confirm. Weeks 3 and 4: start site access reviews for the 9 guest sites plus 25 more sites from the top of the report, 34 sites in total, so one batch fits under the 100-site limit of the admin center. Week 5: collect results and chase the owners who did not respond. Week 6: write the summary and book the next audit for three months later.

The team did not touch the other 172 sites. They sit on the quarterly list for a later round. That is a realistic scope for a first audit, and it fixes the highest exposure first.

## What should the audit report contain?

Keep the report to one page, so people read it. It needs five blocks:

1. **Scope:** which sites you checked and why you chose them.
2. **Findings:** the number of sites with whole-company access, guest access, no active owner and unusual group setups.
3. **Changes:** what you removed or restricted, with dates.
4. **Open items:** sites where the owner has not answered, with a follow-up date.
5. **Next audit:** the date and the sites you will add.

Send the report to the people who can act on it: the head of IT, the data protection officer and, where relevant, the department heads whose sites were flagged. A short, regular report builds trust. A long one that arrives once a year does not.

## Common mistakes

- **Starting with files.** File-level checks take too long. Start with sites, groups and links.
- **Doing the audit without owners.** Admins cannot judge business need. Delegate the review.
- **Fixing without recording.** Without a record, the next audit starts from zero.
- **Treating reports as live.** Reports are snapshots, so check the date before you act.
- **Skipping the repeat.** An audit without a schedule is a cleanup that decays within months.

## How software can help

Start with what Microsoft provides: data access governance reports, site access reviews, Check Permissions and PowerShell exports. Together they cover a first audit for many organizations. When audits repeat across many sites, a reporting tool saves time. Cognillo's [SharePoint Essentials Toolkit](https://www.m365.fm/entity/sharepoint-essentials-toolkit/) is one example. According to its product page, it offers permission reports for sites, folders and items, a monitor for permission changes, and scheduled reports that can be exported to Excel or CSV. These are the vendor's statements and M365.FM did not test them. Other tools and scripts can do similar work, so compare them with the built-in reports first.

## Next step

Open the SharePoint admin center today, run the organization-wide site permissions report, and take the top ten sites as the scope of your first SharePoint permissions audit. Send those ten owners a review request and put the next audit in the calendar.
