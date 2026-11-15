---
title: "What can Microsoft 365 Copilot actually see in SharePoint?"
summary: "What can Copilot access in SharePoint? Only content the signed-in user can already open. See why oversharing becomes visible, and what to check before rollout."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [copilot, sharepoint-permissions, copilot-grounding, oversharing]
keypoints:
  - "Copilot only surfaces organizational data to which the individual user has at least view permission, so it follows the permissions you already have."
  - "Copilot uses all data a user can reach, including broadly shared files that the user does not know about, which is why oversharing suddenly becomes visible."
  - "Copilot does not create new access. It makes existing access easy to find, so a clean permission model is the real control."
  - "Microsoft's SharePoint guidance starts with sharing defaults, inactive sites and data access governance reports for Everyone except external users, org-wide and Anyone links."
  - "Plan the work in order: find broad access, fix the worst sites, protect business-critical sites, then repeat the review on a schedule."
faq:
  - q: "Can Copilot see files I do not have permission to open?"
    a: "No. Microsoft states that Copilot only surfaces organizational data to which individual users have at least view permission. If you cannot open a file in SharePoint, Copilot should not show it to you either. The risk is the opposite case: files that you can open, but should not, because they were shared too broadly."
  - q: "Why does Copilot show content that people did not expect?"
    a: "Because Copilot uses all the data a user can reach, including broadly shared files the user did not know existed. Users often save files in places with wide permissions or share with large groups. Copilot makes that existing access easy to find, so oversharing that was hidden by obscurity becomes visible."
  - q: "What should I check first before turning Copilot on?"
    a: "Start with sharing defaults and broad access. Microsoft suggests removing Everyone except external users from the people picker, changing default links to specific people, finding inactive sites and running data access governance reports on org-wide links and Anyone links. Then fix the worst sites and protect the most sensitive ones."
---

Copilot can only see what the signed-in user can already open. That is the short answer to what Copilot can access in SharePoint, and it is both reassuring and uncomfortable. It is reassuring because Copilot does not break permissions. It is uncomfortable because most tenants hold files that many people can open and should not. This article is for IT managers who must explain this to their leaders. You will learn the rule, why oversharing surfaces, what to check first, and see a worked example with invented numbers.

## What can Copilot access in SharePoint?

Microsoft's page on [SharePoint and Copilot best practices](https://learn.microsoft.com/en-us/sharepoint/sharepoint-copilot-best-practices) states the core rule: Copilot only surfaces organizational data to which individual users have at least view permissions. It connects language models to data through Microsoft Graph. The data sources include documents in SharePoint and OneDrive, emails, calendars, chats, meetings and contacts.

Microsoft's article on [Copilot security](https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-ai-security) says the same in other words: Copilot operates within existing permissions and access controls, and it only accesses data that users are authorized to access. The same page warns that overshared or poorly governed content can affect Copilot results and increase risk.

So the practical answer has three parts:

1. **Copilot sees what the user can see.** It follows the user's identity and permissions.
2. **Copilot does not create access.** A person without access gets no answer from that file.
3. **Copilot finds access that people forgot.** The user may not know that a file is open to the whole company.

The [Copilot](https://www.m365.fm/entity/copilot/) rule is therefore less a feature than a mirror. It shows your current [SharePoint permissions](https://www.m365.fm/entity/sharepoint-permissions/) in a way that nobody could use before: with one question in plain language.

## Why does oversharing become visible?

Before Copilot, a broadly shared file was hidden by obscurity. Nobody knew the folder, the search was clumsy, and the file stayed unseen. Microsoft describes the effect: Copilot uses all data a user has access to, which may include broadly shared files that the user is unaware of.

Microsoft also explains how this happens. Users may not notice the permissions of the site, library or folder where they upload files, and may save business-critical content where other users, including external users, can access it. Users also often share with large groups rather than with individuals. Because of this, users may see Copilot as exposing content that was overshared.

The word "exposing" is worth a pause. The content was already open. What changed is how easily people find it. A question such as "What is our salary band for senior engineers?" can bring a file to the top if its permissions allow it, even if the file was meant for HR only.

This is why the topic belongs in a [Copilot grounding](https://www.m365.fm/entity/copilot-grounding/) discussion: grounding means that Copilot answers from your content, so the quality and the access of that content decide the answer.

## What should you check first?

Microsoft's SharePoint guidance gives a sequence. Use it as a first plan:

1. **Review site-level sharing controls.** Remove Everyone except external users from the people picker, make site owners the recipients of access requests, and change sharing link defaults from company-wide to specific people.
2. **Find inactive sites.** Use inactive site policies in SharePoint Advanced Management, then restrict access to them or delete them.
3. **Find potentially overshared content.** Run the data access governance reports in the SharePoint admin center. Microsoft's page names three for the last 28 days: use of Everyone except external users, use of org-wide People in your organization links, and use of Anyone links.
4. **Fix the worst cases.** For urgent sites, configure restricted access control, so that existing access is limited to a group you name, and the content of that site is visible in Copilot only to that group. For high-profile cases, use change history to see who shared what and when. For the rest, ask site owners to remove access they cannot justify.
5. **Protect business-critical sites in advance.** Apply restricted access control, block downloads from selected sites, and apply encryption with extract rights on critical Office documents.

Note that the page is dated and mentions features as planned or in preview at the time. Check each feature's current status and licensing before you plan around it. Microsoft's pages on data access governance describe the reports and say they belong to SharePoint Advanced Management.

## How do you explain this to leaders and users?

Your leaders will ask whether it is safe to turn Copilot on. A short, honest answer helps: Copilot follows permissions, so the safety of Copilot depends on the safety of your permissions. That frames the project correctly. It is not an AI project first. It is a permission and ownership project that Copilot makes urgent.

Users need a simpler message. Tell them that Copilot can find files that they can open, so they should think about where they save files and whom they share with. Three habits cover most of the risk:

- Save business files in a site whose members you know, not in a company-wide site.
- Share with named people instead of large groups when the content is sensitive.
- Tell the site owner when you find a file that you should not be able to open.

The third habit is the one that works best in practice. Every report from a user is a free finding, and it builds the culture that keeps permissions clean after the first cleanup.

## What does Copilot not change?

It helps to be exact about what Copilot does not do. Based on Microsoft's pages:

- It does not give a user rights that the user lacks.
- It does not turn private files into shared files.
- It does not decide who owns a site, so ownership problems remain yours.

And it does not fix the underlying data problems. If a site has been open to the whole company for years, Copilot will treat it as open. The fix is in the permission model, not in the prompt.

Microsoft's security page also points to the Copilot security dashboard in the Microsoft 365 admin center, which provides insights and controls for DLP, oversharing and compliance. Viewing the Security section requires the Global Reader role, and making changes requires the AI Administrator role. Use it as one input, next to the SharePoint reports.

## What about Restricted SharePoint Search?

Microsoft's page on [Restricted SharePoint Search](https://learn.microsoft.com/en-us/sharepoint/restricted-sharepoint-search) describes a tenant setting that uses an allow list of sites to limit which sites appear in organization-wide search and in Microsoft Copilot responses. The page opens with a notice that the feature is retiring: starting July 31, 2026, new enablement is blocked, and Microsoft points to Restricted Content Discovery for discoverability control. So treat it as history for tenants that already use it.

The page is clear about the limits. The allow list holds up to 100 sites. The feature is not a security boundary and does not change permissions. Copilot can still use a person's own OneDrive files, chats, emails and calendars, and recently accessed sites or sites shared in Teams or Outlook can still appear. Microsoft calls it a short-term solution that gives administrators time to review and audit permissions, not a long-term one. The recommended path is to fix oversharing, then disable it so that Copilot relies on standard permission-based access.

## Example: a pilot that finds a salary file

The numbers are invented to show the method. A company with 1,500 employees starts a Copilot pilot with 50 users. In the first week, a pilot user in sales asks Copilot to summarize "compensation bands." The answer cites a spreadsheet from an old HR project site.

The admin checks and finds the facts:

1. The site has 1,500 members through Everyone except external users.
2. The site has had no owner since a reorganization two years ago.
3. The spreadsheet has been open for 26 months, and nobody noticed.

The admin acts in three steps. First, remove Everyone except external users from the site and give access to a named HR group of 12 people. Second, assign two owners. Third, run the data access governance reports for the tenant, which show 38 more sites with the same pattern.

Count the effect. Instead of a rumor that "Copilot leaks data", the company has a clear story: one site was open for 26 months, 38 similar sites are on a list, and the first one is fixed. The list becomes the work plan for the rollout, ordered by sensitivity. Copilot did not cause the problem. It revealed it, early and in a small pilot.

## Common mistakes

- **Saying Copilot respects permissions, so there is no risk.** It does, and that is exactly why broad permissions are the risk.
- **Starting with files.** Start with sites, groups and links, because one site change affects thousands of files.
- **Ignoring inactive sites.** Old sites keep their old permissions and still feed answers.
- **Forgetting ownership.** Sites without owners cannot be fixed by the people who know them.
- **Treating the cleanup as a one-off.** New sites and new links appear every day, so schedule the reports.
- **Skipping the pilot.** A small pilot finds the worst files before everyone can ask about them.

## How software can help

Start with what Microsoft provides: data access governance reports, site access reviews, inactive site policies, restricted access control and the Copilot security dashboard. Check the licensing page first, because several of these belong to SharePoint Advanced Management. For a large tenant, a script or reporting tool can list sites by number of users, sharing links and last activity in one table. Compare any such output with the admin center reports on a few sites before you trust it.

## Next step

Pick ten sites with the most users or the most sensitive content, and check who can open them. Then write one sentence for your leaders that answers what Copilot can access in SharePoint: exactly what each user can already open.
