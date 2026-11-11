---
title: "Which SharePoint sites to clean up first before a Copilot rollout"
summary: "Plan your SharePoint cleanup before a Copilot rollout: rank sites by exposure, sensitivity and neglect, and fix the riskiest first. Includes a scoring example."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [oversharing, copilot-governance, sharepoint-governance, sharepoint-essentials-toolkit]
keypoints:
  - "Rank sites by three things: how many people can open them, how sensitive the content is, and how neglected the site is, then fix the highest scores first."
  - "Microsoft's order is: tighten sharing defaults, find inactive sites, find overshared content with data access governance reports, then remediate and protect."
  - "Copilot only surfaces data a user can already open, so broad access on a sensitive site is the first thing to fix."
  - "Inactive and ownerless sites are cheap wins: Microsoft's lifecycle policies notify owners, set sites to read-only or archive them after repeated silence."
  - "Do not try to clean everything. Clean the top tier before the pilot, the second tier before wider rollout, and schedule the rest."
faq:
  - q: "Which SharePoint sites should I clean up first before Copilot?"
    a: "Start with sites that combine broad access and sensitive content, such as HR, finance, legal and executive sites open to Everyone except external users or to large groups. Then handle sites with company-wide or Anyone links, then inactive sites and sites without owners. Fixing exposure on sensitive sites reduces the most risk for the least work."
  - q: "Do I need to clean every site before a Copilot pilot?"
    a: "No. A pilot with a small group needs the highest-risk sites fixed and a plan for the rest. Microsoft's guidance is a sequence, not a one-time sweep. Fix the top tier before the pilot, extend the cleanup before wider rollout, and keep running the reports on a schedule so that new oversharing is caught."
  - q: "How do I find overshared SharePoint sites?"
    a: "Use the data access governance reports in the SharePoint admin center. Microsoft's guidance names reports for use of Everyone except external users, organization-wide People in your organization links and Anyone links over the last 28 days. The site permissions report highlights sites with the broadest access. These reports belong to SharePoint Advanced Management, so check licensing first."
---

Clean up the sites that combine broad access with sensitive content first, then the sites that nobody owns or uses, and leave the well-run sites for later. That is the order for a SharePoint cleanup before a Copilot rollout. This article is for IT managers who cannot fix thousands of sites before the pilot and must choose. You will learn a simple scoring method, the tools Microsoft names for each step, and see a worked example with invented numbers.

## Why does the order matter for a SharePoint cleanup before Copilot?

Microsoft's page on [SharePoint and Copilot best practices](https://learn.microsoft.com/en-us/sharepoint/sharepoint-copilot-best-practices) states that Copilot only surfaces organizational data to which users have at least view permission. It also says Copilot uses all data a user can access, which may include broadly shared files that the user does not know about.

That means [oversharing](https://www.m365.fm/entity/oversharing/) becomes visible fast. You cannot fix every site before the first users start. So the question is not "how do we clean everything?" The question is "which sites would hurt most if a curious user found them through Copilot?"

Three factors answer it:

1. **Exposure.** How many people can open the site? A site open to Everyone except external users, or to Anyone links, is more exposed than a site with 12 named members.
2. **Sensitivity.** What does the site hold? Pay, contracts, customer data, legal files and board papers are worse than a lunch menu.
3. **Neglect.** Does anyone own and use the site? A site without an owner or activity cannot be fixed by the people who know it, and its permissions only get older.

A site that scores high on all three goes to the top of the list.

## What does Microsoft recommend as the sequence?

The same Microsoft page gives a sequence. In short:

- **Review sharing controls.** Remove Everyone except external users from the people picker, make site owners the recipients of access requests, and change sharing link defaults from company-wide to specific people.
- **Identify inactive sites.** Use inactive site policies in SharePoint Advanced Management, then restrict access or delete the sites.
- **Identify overshared content.** Run the data access governance reports for the last 28 days on Everyone except external users, org-wide People in your organization links and Anyone links.
- **Remediate.** Use restricted access control for urgent cases, change history to see who shared what, and site owner reviews for the rest.
- **Protect important sites.** Use restricted access control, block download on selected sites and encryption on key documents.

Microsoft's guidance on getting ready for Copilot adds a frame: three pillars, which are to remediate oversharing, set up guardrails and meet regulations. It also states that SharePoint Advanced Management is included with the Microsoft Copilot license. Check the licensing page for your situation, because the page does not map each tool to each problem.

Use this sequence as your backbone in your [Copilot governance](https://www.m365.fm/entity/copilot-governance/) plan, and use scoring to decide the order of sites inside each step.

## How do you score and rank sites?

Keep the score simple, or nobody will use it. Give each site 0 to 3 points on each factor:

- **Exposure:** 0 for named members only, 1 for a large group, 2 for org-wide links or Everyone except external users, 3 for Anyone links or guests plus org-wide access.
- **Sensitivity:** 0 for public information, 1 for internal, 2 for confidential, 3 for regulated or highly confidential. Ask the site owner, or use the site's labels when they exist.
- **Neglect:** 0 for an active site with two owners, 1 for one owner, 2 for no active owner, 3 for no owner and no activity.

Multiply exposure by sensitivity, then add neglect. The product shows the real risk: a wide-open public site (3 times 0) is harmless, and a locked confidential site (0 times 3) is also fine. The sum with neglect lifts the sites that nobody can fix.

Then sort into tiers:

- **Tier 1, score 9 or more:** fix before the pilot.
- **Tier 2, score 4 to 8:** fix before wider rollout.
- **Tier 3, score 3 or less:** put on the quarterly review.

The numbers are a tool, not a law. Adjust the cutoffs so that Tier 1 has a size your team can finish in the time you have.

## How do you fix each kind of site?

The fix depends on why the site scored high.

**Broad access on a sensitive site.** Remove broad groups, replace links with named access, and if the site must be closed at once, use restricted access control to limit it to a named group. Microsoft states that content from such a site is then visible in Copilot only to that group.

**No owner.** Microsoft's lifecycle management includes a site ownership policy that helps ensure sites have the required number of owners. You can set the minimum, for example two owners, and choose who is notified when a site falls below it. See Microsoft's page on [site lifecycle management](https://learn.microsoft.com/en-us/sharepoint/site-lifecycle-management).

**Inactive site.** The [inactive site policy](https://learn.microsoft.com/en-us/sharepoint/inactive-site-policy) measures activity across SharePoint and connected workloads, notifies owners up to three times, and if nobody answers can set the site to read-only or archive it after a read-only period. Certifying a site suppresses activity checks for one year. Note that the policy does not delete sites directly.

**Old content with open access.** This is handled in the site's library. Move or delete what is outdated, or restrict the library, before you change anything wider.

Treat the owner as your partner, because [SharePoint governance](https://www.m365.fm/entity/sharepoint-governance/) only works when owners take part. The admin sets the rule and provides the list, and the owner decides what stays.

## Can you keep Microsoft 365 Copilot away from specific sites while you clean up?

Partly, and only for a while. Microsoft's page on [restricted content discovery](https://learn.microsoft.com/en-us/sharepoint/restricted-content-discovery) describes a site-level setting that limits the discovery of a site's content, including recently used files, in organization-wide search and in Microsoft 365 Copilot responses. It also removes some AI entry points on the site, such as the Copilot button. You turn it on per SharePoint site, not for the whole tenant. Microsoft intends it as a temporary governance control, for example during reviews or phased Copilot rollouts.

It does not change who can open the files. A person with permission or a link can still reach the content, so it belongs in the plan as a way to buy time for tier 1 sites, and not as a fix. The fix stays the same: remove broad groups, replace links with named access and close sites that must be closed with restricted access control. Use the setting for sites on your list that you cannot repair before the rollout date, and write down when it will be removed again.

## Example: ranking 300 sites for a pilot of 80 users

The numbers are invented to show the method. A company has 300 SharePoint sites and plans a Copilot pilot in six weeks. The data access governance reports show 45 sites open to Everyone except external users, 30 with org-wide links, 12 with Anyone links, and 70 sites with no active owner. Some sites appear in more than one list.

The IT manager scores the sites, using owners' answers for sensitivity. The result:

1. **Tier 1: 18 sites.** These include the HR site, two finance sites, the legal archive and an old M&A site. All have broad access, and all hold confidential content. The plan: fix in the first three weeks. Eight are closed with restricted access control. Ten get named groups and cleaned links.
2. **Tier 2: 62 sites.** These are active team sites with company-wide links and mixed content. Owners get a list and a review request, with a deadline in week five.
3. **Tier 3: 220 sites.** These are narrow, active or low-risk. They go on the quarterly review.

Also, 40 of the 70 ownerless sites are inactive. An inactive site policy sends owners and admins notices, and after repeated silence sets them to read-only.

Count the result before the pilot: 18 Tier 1 sites fixed, 40 inactive sites in the notice process, 62 Tier 2 sites with owners reviewing. The company did not clean 300 sites. It cleaned the 18 that matter most and put the rest into a routine. The pilot starts with a short, honest statement of what has been fixed and what has not.

## Common mistakes

- **Trying to clean everything first.** The rollout slips, and the cleanup never ends.
- **Ranking by file count.** A small HR site can matter more than a large archive.
- **Skipping the owners.** Admins cannot judge sensitivity or business need.
- **Ignoring inactive sites.** Old sites keep old permissions and still feed answers.
- **Fixing once.** New sites and links appear daily, so schedule the reports.
- **No record.** Without a list of what you fixed, you cannot explain the state of the rollout.

## How software can help

Start with the data access governance reports, inactive site policies, site ownership policies, site access reviews and restricted access control. For repeat work across many sites, a reporting tool can bring the lists together. Cognillo's [SharePoint Essentials Toolkit](https://www.m365.fm/entity/sharepoint-essentials-toolkit/) is one example. According to its product page, it offers an oversharing and Copilot readiness report on sharing links, sites and content open to everyone, heavily shared files that are not labeled, and outdated content with open access. These are the vendor's statements and M365.FM did not test them. Other tools and scripts can do similar work, so compare them with the built-in reports first.

## Next step

Score your top 50 sites by exposure, sensitivity and neglect this week, and mark the Tier 1 list. Then agree a date with the owners for the SharePoint cleanup before your Copilot rollout starts.
