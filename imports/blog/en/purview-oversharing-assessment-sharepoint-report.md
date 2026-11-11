---
title: "Purview oversharing assessment: what the SharePoint report shows"
summary: "The Purview oversharing assessment scans your top 100 SharePoint sites weekly and flags links, labels and risk. See what the report shows and how to act on it."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [purview, oversharing, copilot-governance, data-classification]
keypoints:
  - "The default data risk assessment in Microsoft Purview runs weekly for the top 100 SharePoint sites by usage, and the first run shows results only after a delay of about 4 days."
  - "The summary counts the items found, the sensitive data detected and the links that share data with anyone, and each site has Overview, Identify, Protect and Monitor tabs."
  - "Microsoft lists four fixes on the Protect tab: a DLP policy by label, restricted content discovery, an auto-labeling policy and a retention policy for content not accessed for 3 years."
  - "Custom assessments can scan at item level, but only for up to 10 SharePoint sites, up to 200,000 items per location, and OneDrive is not supported."
  - "The report finds and ranks risk, but you still need owners to confirm each fix, because removing a sharing link can block legitimate access."
faq:
  - q: "What does the Purview oversharing assessment cover?"
    a: "The default data risk assessment covers the top 100 SharePoint sites based on usage and runs weekly without setup. Its summary shows the total items found, the sensitive data detected and the links that share data with anyone. Custom assessments let you choose users, data sources and scan level, including item-level scanning for selected sites."
  - q: "How long does the first assessment take?"
    a: "Microsoft states that the first default assessment has a delay of about 4 days before results display. A custom assessment needs at least 48 hours before results appear, and its results do not update afterward. Results expire after 30 days, so you duplicate the assessment to run it again with the same selections."
  - q: "Can the assessment fix oversharing for me?"
    a: "It offers guided fixes, but people must confirm them. The Protect tab links to a DLP policy by sensitivity label, restricted content discovery, an auto-labeling policy and a retention policy. Item-level results let you notify owners, apply a label or remove a sharing link. Microsoft advises using link removal sparingly, because it can block legitimate access."
---

The Purview oversharing assessment is a report that scans your busiest SharePoint sites each week and shows where content is open too widely, where sensitive data sits, and which fixes Microsoft suggests. It does not change anything by itself. This article is for security admins who open the report for the first time and ask what the numbers mean and what to do next. You will learn what the default assessment covers, how to read a site, what the limits are, and see a worked example with invented numbers.

## What does the Purview oversharing assessment cover?

Microsoft describes the feature on its page about [data risk assessments in Purview](https://learn.microsoft.com/purview/data-security-posture-management-oversharing). The assessments belong to Data Security Posture Management, called DSPM, in the [Microsoft Purview](https://www.m365.fm/entity/purview/) portal. You find them under DSPM, then Discover, then Data risk assessments. The insights come from the security objective named Prevent oversharing of sensitive data.

The page explains the reason for the feature. Generative AI amplifies oversharing, because AI can surface content that is obsolete, over-permissioned or without governance controls. That ties the report to [oversharing](https://www.m365.fm/entity/oversharing/) in general, and to the question of how safe your content is before you roll out Copilot.

The default assessment covers SharePoint and OneDrive on the Microsoft 365 tab. Microsoft says it runs automatically each week for the top 100 SharePoint sites, ranked by usage in your organization. It needs no activation. That is a useful start, and also a limit: a site with little traffic may never appear in it, even if it holds sensitive files.

The page does not state licensing or role requirements. It links to a separate prerequisites page for item-level scanning. Check licensing and roles on Microsoft's current pages before you promise the report to your team.

## How do you read the summary and a single site?

Open the Default assessment and start with the summary. It shows three numbers: the total number of items found, the number of sensitive data detected, and the number of links that share data with anyone. Treat them as a first screen, not a verdict. A high link count says that sharing is open, but not whether it is a problem. A high sensitive count says that content needs protection, not that it is exposed.

Select View details for a site. Microsoft describes a flyout with four tabs:

1. **Overview.** The basic picture of the site.
2. **Identify.** It shows how much data has been scanned for sensitive information types, the base of [data classification](https://www.m365.fm/entity/data-classification/), and how much has not. You can start an on-demand classification scan from here.
3. **Protect.** The remediation options, described in the next section.
4. **Monitor.** The item counts shared with anyone, with everyone in the organization, with specific people and externally. A button starts a SharePoint site access review, which uses the data access governance reports.

The Monitor tab is the most useful for owners. It turns a vague question, "is this site open?", into four counts they can understand. If the number for "everyone in the organization" is large on a site that holds confidential material, that site goes to the top of your list.

Remember the first-run delay. Microsoft states that the first default assessment has a delay of about 4 days before results display. Do not judge the feature on day one.

## Which fixes does the report offer?

The Protect tab lists four options. Each one belongs to a different tool, so choose by the kind of problem.

- **Restrict access by label.** Create a Microsoft Purview DLP policy that prevents Microsoft 365 Copilot and agents from summarizing data with selected sensitivity labels. Use it where labels already exist.
- **Restrict all items.** Use SharePoint Restricted Content Discovery to exempt sites from Microsoft 365 Copilot. Use it as a quick shield while you clean up permissions.
- **Create an auto-labeling policy.** It applies a sensitivity label automatically to unlabeled files where sensitive information is found. This helps when your labels have gaps.
- **Create retention policies.** For content that has not been accessed for at least 3 years, Microsoft Purview Data Lifecycle Management can delete it automatically. Check legal holds before you use this.

These fixes do not touch the root cause, which is permissions. Restricted content discovery hides content from Copilot, and a DLP policy limits summarizing. Neither one removes a sharing link or closes a group. For that, use the Monitor tab to start a site access review, and let the owner decide. This split is what [Copilot governance](https://www.m365.fm/entity/copilot-governance/) means in daily work: shield quickly, fix properly, and keep a record of both.

Microsoft's page does not describe SharePoint admin center actions in the report. Plan those steps outside it.

## What do custom assessments and item-level scanning add?

You can select Create custom assessment to choose the users, data sources and scan level. That is the route when the top 100 is not enough or when you want to focus on a department. Microsoft's page on [DSPM for AI](https://learn.microsoft.com/purview/dspm-for-ai) calls custom assessments currently in preview, so check the status before you build a process on them.

Item-level scanning goes deeper. It applies to Microsoft 365 only and is currently restricted to SharePoint sites. Microsoft says it flags items as potentially overshared if they have a sharing link for external or anonymous users. It also shows any applied sensitivity label and the item owner. You need a registered Entra application and a one-time authentication to use it.

For flagged items, the page lists four actions:

- **Resolve**, to close the finding.
- **Apply sensitivity label**, to protect the item.
- **Notify** the site owner. The email is sent by the system and cannot be customized.
- **Remove sharing link**, which Microsoft says to use sparingly, because it can block legitimate access.

The notification email links to the SharePoint site to manage access, or to a read-only view in the Purview portal that shows only the items and sites the recipient owns. That is good design for delegation: the owner sees their own items and nobody else's.

You can export both default and custom assessments to Excel, CSV, JSON or TSV. Use the export for your record of what was found and decided.

## What are the limits you should plan around?

The limits decide what you can promise. Microsoft's pages state these for Microsoft 365:

- A maximum of 200,000 items per location, for both default and custom assessments.
- File counts might be inaccurate when there are more than 100,000 files per location.
- OneDrive is not supported for item-level scanning.
- A maximum of 10 SharePoint sites for item-level scanning.
- Custom assessment results need at least 48 hours, do not update again, and expire after 30 days. To see results after that, duplicate the assessment.

Two practical points follow. First, the report is a snapshot, so rerun it after you make changes, and compare the numbers. Second, a very large location can give an incomplete picture, so do not read a low count on a huge site as proof that it is safe.

Also note that the classic version of the feature still exists. The DSPM for AI (classic) page says that it has been replaced by a new DSPM and that improvements will not be added to the classic version. If your team follows older guides, check which version they describe.

## Example: reading a report for a 300-site tenant

The numbers are invented to show the method. A company has 300 SharePoint sites. The default assessment covers the top 100 by usage. The summary shows 180,000 items, 12,400 items with sensitive data and 2,100 links that share data with anyone.

The security admin takes the following steps:

1. Sorts the 100 sites by the Monitor tab. 8 sites have large counts of items shared with everyone in the organization.
2. Checks the 8 sites with their owners. 5 hold confidential content, 3 hold public marketing material and are fine.
3. For the 5 sites, applies restricted content discovery at once, so Copilot stops using them, and starts a site access review for each owner.
4. Creates one auto-labeling policy for the finance and HR sites, where the Identify tab shows many unscanned items.
5. Starts a custom assessment with item-level scanning on 10 sites that fall outside the top 100 but hold contracts.

After three weeks, the owners fix permissions on 4 of the 5 sites and the admin lifts restricted content discovery on those. One site stays shielded because its owner has left, and the admin assigns a new owner. The second weekly run shows the anyone-link count on the 5 sites falling from 640 to 90.

Count the effect: 5 risky sites found, 4 repaired, 1 shielded and awaiting an owner, and a record of what was done. The 200 sites outside the top 100 are still unchecked, and the admin writes that gap into the report so that nobody assumes full coverage.

## Common mistakes

- **Treating the top 100 as the whole tenant.** Sites with little traffic can hold sensitive files and never appear.
- **Reading counts as verdicts.** A link count shows openness, not necessarily a problem.
- **Using restricted content discovery as the fix.** It hides content from Copilot and does not change permissions.
- **Removing sharing links in bulk.** Microsoft advises using it sparingly, because legitimate access can break.
- **Skipping the owner.** Owners know why a link exists. Use the notify action or a site access review.
- **Running it once.** The report is a snapshot. Rerun it after fixes and compare.

## How software can help

Start with the built-in options: the DSPM reports, the SharePoint data access governance reports and site access reviews. When you need a recurring list across all sites, including those outside the top 100, a script or a reporting tool can export permissions and sharing links per site. Compare any tool with the Purview results on a few known sites first, and check what data it reads and where it stores it.

## Next step

Open the default assessment in the Purview portal and write down the three summary numbers. Then take the five sites with the largest "shared with everyone" counts to their owners and agree on one fix for each, so that your Purview oversharing assessment leads to action.
