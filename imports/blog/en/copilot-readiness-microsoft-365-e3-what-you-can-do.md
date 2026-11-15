---
title: "Copilot readiness on Microsoft 365 E3: what you can already do"
summary: "Copilot readiness on Microsoft 365 E3 starts with oversharing checks you can run today. See which tools E3 and a Copilot license give you, and a phased plan."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [copilot, microsoft-365-e3, oversharing, copilot-governance]
keypoints:
  - "Microsoft lists Copilot as an add-on for E3 and E5, and says SharePoint Advanced Management for E3 requires the Copilot add-on."
  - "The SharePoint Advanced Management features page says admins get them when at least one Microsoft Copilot license is assigned to a user."
  - "On E3, Microsoft lists manual sensitivity labeling, core DLP and standard audit, while automatic labeling and advanced audit are E5 items."
  - "A Microsoft community blog suggests three phases for E3: a pilot of 2 to 4 days, a deploy phase of 2 to 4 weeks and an operate phase of one month or more."
  - "You can start before buying anything: check Everyone except external users, sites without owners and the top 100 sites by usage."
faq:
  - q: "Can you deploy Microsoft 365 Copilot on E3?"
    a: "Yes. Microsoft's license overview lists Microsoft Copilot as an add-on for E3 and E5. Deployment is a licensing matter first and a content matter second. Before you assign licenses, check what each pilot user can already open, because Copilot works with the data a user can access."
  - q: "Do you need E5 to reduce Copilot oversharing risk?"
    a: "Not to start. Microsoft's E3 guidance describes foundational controls such as permission reports, site access reviews, restricted access control, manual sensitivity labels and DLP. Some features, such as automatic labeling and advanced audit, are listed under E5. Check Microsoft's current license pages before you plan around a feature."
  - q: "Is SharePoint Advanced Management included with Copilot?"
    a: "Microsoft's features page says SharePoint admins get SharePoint Advanced Management features when at least one Microsoft Copilot license is assigned to a user. The license overview states that for E3 and E5 the feature requires the Copilot add-on. The pages do not say whether every admin needs a license."
---

An IT manager can start Copilot readiness on Microsoft 365 E3 today, because the first work is about content and permissions, not about new licenses. You can find overshared sites, close the riskiest ones, run a small pilot and set a rhythm for checks with the tools that come with your plan and your first Copilot licenses. This article shows what Microsoft says E3 includes, where the licensing lines fall, a phased plan, and a worked example with invented numbers.

## What do you get with E3 and a Copilot license?

Start with Microsoft's [license feature overview for Copilot](https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-license-feature-overview). It lists Microsoft Copilot as an add-on for E3 and E5. For [Microsoft 365 E3](https://www.m365.fm/entity/microsoft-365-e3/), it says you get SharePoint administration and foundational governance controls, and that SharePoint Advanced Management, often called SAM, requires the Copilot add-on.

The same page describes Purview features by plan. For E3 it lists manual sensitivity labeling, core data loss prevention, standard audit, core eDiscovery and records management. For E5 it lists automatic labeling, broader DLP and advanced audit with 10-year retention. The page does not define what "core" or "advanced" means in detail, and it warns that licensing and product terms can change. So treat it as a map, and check the current terms before you buy.

Microsoft's page on [SharePoint Advanced Management features with a Copilot license](https://learn.microsoft.com/en-my/sharePoint/sharepoint-advanced-management-features-copilot-license) adds the condition: SharePoint admins get SAM features if the organization assigns at least one Microsoft Copilot license to a user. It lists 22 features. Among them are the content management assessment, block download policy, restricted access control, restricted content discovery, permission state reports, site access review and the site ownership, inactive site and site attestation policies.

Note three gaps in the text. The page does not say whether every admin must hold a license. It lists the sensitivity labels feature as requiring E5 or G5. And it says restricted site creation by apps needs the SAM Plan 1 add-on. Read the table for the features you plan to use, not only the headline.

## Why oversharing comes first

[Copilot](https://www.m365.fm/entity/copilot/) works with the data a user can already open. So the main readiness question is not "is Copilot safe?" but "what can our people open today?" That is the problem of [oversharing](https://www.m365.fm/entity/oversharing/): files and sites that are open to far more people than their owners think.

Typical sources are the built-in group Everyone except external users, old project sites with broad membership, sharing links that were never removed, and sites with no active owner. None of these needs E5 to find. The SAM reports and the data access governance reports in the SharePoint admin center are the main tools, and they come with the Copilot license condition above.

Put this first on your plan, before training and before communication. A pilot that surprises a manager with a file she should not see ends faster than any technical problem.

## What does Copilot readiness on Microsoft 365 E3 look like in phases?

A [post on the Microsoft Community Hub for E3 customers](https://techcommunity.microsoft.com/t5/healthcare-and-life-sciences/microsoft-deployment-blueprint-address-oversharing-concerns-for/ba-p/4434591), dated 2025, gives a foundational plan with three phases. It is a community blog, not product documentation, so use it as a pattern and not as a rule. The post says the foundational approach uses native E3 capabilities with manual controls, visibility and basic automation.

1. **Pilot, about 2 to 4 days.** Export the top 100 most-visited sites from the SharePoint admin center usage report. Run the SAM permission state reports and use Purview Content Explorer to look for sensitive information types. Cross-check them and choose up to 100 low-risk sites for Copilot. The post also mentions Restricted SharePoint Search as an option and suggests turning off Everyone except external users, plus turning on Purview audit and DLP policies in simulation mode.
2. **Deploy, about 2 to 4 weeks.** Use the data access governance reports to flag overshared sites. Start site access reviews and apply restricted access control to critical sites. Create sensitivity labels and policies, and move DLP to enforce mode.
3. **Operate, one month or more.** Automate SAM reports and lifecycle policies for permissions and ownerless sites. Handle DLP alerts. Add retention and deletion policies, and deal with inactive sites.

The durations are the post's, not a promise. Your tenant size and the state of your sites decide the real time. The post does not say how long DLP simulation should run before enforcement, so decide that with your compliance team.

Microsoft's own setup page uses a similar frame of Pilot, Deploy and Operate, which helps when you explain the plan to your sponsor.

## Which controls can you use on E3?

Map the controls to the plan, and check each against the licensing pages.

- **Permission state and sharing reports.** They show where access is broad. They fall under SAM, so the Copilot license condition applies.
- **Site access reviews.** They send owners a task to confirm who should have access. Owners know why access exists, and you do not.
- **Restricted access control.** It limits a site to a named group, and it is meant for the few sites that must not be open.
- **Restricted content discovery.** It hides a site's content from Copilot and organization-wide search without changing permissions. Use it as a temporary shield while you fix permissions.
- **Manual sensitivity labels and core DLP.** Microsoft lists these under E3. They need people to label files, so they work best for a defined set of sensitive content.
- **Audit.** Standard audit is listed for E3. Turn it on early so that you can see what happens during the pilot.

What E3 does not list is automatic labeling, which Microsoft places under E5. If you have thousands of unlabeled files, plan for either manual effort in the first phase or a later license decision. That is a choice for the business, not a technical gap that stops the pilot.

For your wider rules on who may build and run Copilot features, see [Copilot governance](https://www.m365.fm/entity/copilot-governance/).

## What are the technical prerequisites besides the license?

Microsoft 365 Copilot readiness is more than licenses and permissions. Microsoft's [setup page for Copilot](https://learn.microsoft.com/en-us/microsoft-365/copilot/microsoft-365-copilot-setup) lists what must be in place before you assign Copilot licenses.

- **A base license first.** Users must be provisioned and hold a Microsoft 365 license in your tenant. Microsoft says Microsoft Copilot is included in the Microsoft 365 E7 plan and is available as an add-on to other plans, which covers E3.
- **No guests.** It is not supported to assign Copilot licenses to cross-tenant users, including guests.
- **The right app channel.** Copilot is available in all Microsoft 365 apps update channels except Semi-Annual Enterprise Channel.
- **A work or school account and an editable file.** Users sign in to the app with their work or school account, and the file must not be read-only.
- **A short wait.** For some apps, users may wait up to 24 hours before Copilot appears.

For rollout, Microsoft describes three phases: Pilot with a small group, Deploy to a larger group and Operate, where you monitor usage with the Copilot Dashboard in Viva Insights and the Microsoft 365 usage reports. Write these checks into your readiness list next to the permission work.

## Example: 2,000 users, 40 pilot users and 120 sites to check

The numbers are invented to show the method. A company has 2,000 users on E3, 400 SharePoint sites and a plan for 40 pilot users. Before it buys any licenses, the IT manager checks the licensing pages and decides to start with the readiness work.

1. **Top 100 sites.** The usage report lists the 100 most-visited sites. The manager adds the 20 sites that hold HR, finance and legal material, for 120 sites to check.
2. **Reports.** After the first Copilot licenses are assigned, the SAM reports show 30 of the 120 sites open to Everyone except external users. 11 of the 30 hold confidential content.
3. **Fixes.** The 11 sites get a site access review. 4 of them also get restricted access control, because their owners cannot review in time. The other 19 are low risk and stay open.
4. **Ownership.** 9 of the 120 sites have no active owner. The manager assigns owners before the pilot starts.
5. **Pilot.** 40 users from five teams get licenses. Standard audit is on, and DLP runs in simulation mode.

Count the result. Of 120 sites, 30 were broad and 11 were sensitive. After two weeks, 7 reviews are complete and 4 sites are restricted, so all 11 are covered or in progress. The manager adds the 4 open reviews to the weekly list and writes down the decision on labels: manual labeling for the finance site, with a note to revisit automatic labeling later.

## Common mistakes

- **Waiting for E5.** Many oversharing checks can start now. Check the licensing pages for each feature.
- **Reading a headline instead of the table.** A feature may need E5 or an add-on, even if SAM is included.
- **Training first, access second.** Fix access before the first user sees a surprise.
- **Skipping owners.** Access reviews work only when site owners answer.
- **Treating a blog plan as a rule.** Use the phases as a pattern and set your own timings.
- **Switching on DLP in enforce mode on day one.** Use simulation first, as the E3 blog suggests.

## How software can help

Start with the built-in tools: the SAM reports, the data access governance reports, site access reviews and the Purview audit log. For a recurring view across hundreds of sites, a script or a reporting tool can add permission and sharing exports. Compare any tool with the built-in reports on a few sites first, and check what data it reads and where it stores it.

## Next step

Open the SharePoint admin center and list your top 100 sites by usage next to the sites that hold HR, finance and legal files. Then check which of them are open to Everyone except external users, and take that list into your next Copilot readiness meeting.
