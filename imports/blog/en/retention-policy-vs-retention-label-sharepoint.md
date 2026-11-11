---
title: "Retention policy or retention label in SharePoint: how to choose"
summary: "Retention policy vs retention label in SharePoint: use a policy for a whole site, a label for single items. See what happens when both apply to the same file."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [retention-policies, retention-labels, microsoft-purview-data-lifecycle-management, sharepoint]
keypoints:
  - "A retention policy sets the same retention rules for a whole location such as a SharePoint site. A retention label sets rules for one item such as a document."
  - "Labels can be applied manually, automatically by conditions, or as a default for a library, folder or document set. Policies cannot select content by conditions."
  - "When rules overlap, retention beats deletion and the longest retention period wins. A delete action from a label wins over a delete action from a policy."
  - "A label travels with the content inside the tenant, while a policy setting stays with the location. An item can have only one retention label at a time."
  - "Most tenants combine both: a broad policy as a safety net and a few labels for content with its own rules, such as contracts and records."
faq:
  - q: "What is the difference between a retention policy and a retention label?"
    a: "A retention policy applies the same retention settings to everything in a location, for example all files on selected SharePoint sites. A retention label applies settings to an individual item, such as one document or folder. Policies work at location level, labels work at item level, and labels can also mark items as records."
  - q: "Can a file have both a retention policy and a retention label?"
    a: "Yes. The file follows both, and Microsoft resolves conflicts with fixed principles. Retention takes precedence over permanent deletion, and the longest retention period wins. If a label and a policy both delete, the label's delete action takes precedence. An item can have only one retention label at a time."
  - q: "Do retention labels move with a file?"
    a: "Within your Microsoft 365 tenant, yes. Retention settings from a label travel with the content when it moves to another location. A policy's settings do not, because they belong to the location. Retention labels do not persist if the content is moved outside Microsoft 365."
---
For a retention policy vs retention label decision in SharePoint, the rule of thumb is simple. Use a policy when the same rule should cover a whole site. Use a label when a single document, folder or email needs its own rule. This article is for compliance officers who must decide which tool fits which content in Microsoft Purview, and who want to know what happens when both apply to the same file. It follows the way Microsoft documents both in [Microsoft Purview Data Lifecycle Management](https://www.m365.fm/entity/microsoft-purview-data-lifecycle-management/).

## What a retention policy does

A [retention policy](https://www.m365.fm/entity/retention-policies/) works at the level of a location. You choose locations, such as [SharePoint](https://www.m365.fm/entity/sharepoint/) sites, and set what happens to the content there. You can keep it for a period, delete it after a period, or both. Microsoft describes the three options in its article on [creating retention policies](https://learn.microsoft.com/en-us/purview/create-retention-policies): retain without deleting, retain and then delete, or just delete after a specified time. According to Microsoft's overview, [Learn about retention policies and labels](https://learn.microsoft.com/en-us/purview/retention), items inherit the retention settings from the container that the policy specifies.

Policies are the right tool when the rule is the same for everything. Typical cases are "keep all site files for seven years" or "delete everything in these project sites three years after the last change." You set it once, and new content is covered as it arrives.

A policy has limits:

- **No conditions on content.** Microsoft's comparison marks retention based on conditions, such as sensitive information types, keywords or trainable classifiers, as available for labels and not for policies.
- **No list items.** Microsoft's page on [retention for SharePoint and OneDrive](https://learn.microsoft.com/en-us/purview/retention-policies-sharepoint) says list items are not supported by retention policies but are supported by retention labels.
- **Slow to apply.** Microsoft says it can take up to seven days for a new policy to be applied.
- **Hard to change later.** The name, the scope type (adaptive or static) and the retention settings, except the retention period, cannot be changed after the policy is saved.

## What a retention label does

A [retention label](https://www.m365.fm/entity/retention-labels/) is attached to an item: a document, a folder or an email. It defines when the retention period starts, how long the item is kept and what happens at the end. Microsoft says to use labels whenever you need to specify retention settings at the item level. It adds that you typically use labels to retain specific items longer than an applied policy does, or to override automatic deletion or apply a different deletion period.

A label gets onto content in three ways:

- **Manually.** People choose a label in Outlook, OneDrive, SharePoint or Microsoft 365 groups.
- **Automatically.** A policy applies the label when content matches conditions, such as sensitive information types, keywords from a query you define, or a trainable classifier.
- **By default.** You set a default label on a SharePoint document library, folder or document set, and every document stored there inherits it.

Labels can also mark an item as a record. Microsoft says a record is never automatically changed during its configured retention period, which makes records the strictest form of retention. An item can have only a single retention label at a time. Label names cannot be changed after you save the label, so choose them with care. For event-based retention or disposition review, Microsoft says to create labels in the Records management solution instead, and to assign them from there.

## Retention policy vs retention label: how to choose

Ask three questions in this order.

1. **Is the rule the same for everything in the location?** If yes, use a policy. It takes the least effort and leaves no gaps for new content.
2. **Does one kind of content need a different rule?** If yes, use a label. Contracts, HR files or invoices often follow their own period.
3. **Can you tell the content by what it contains or where it sits?** If it sits in one library, use a default label. If it contains something detectable, such as a type of sensitive information, use an auto-apply label. If neither works, you need manual labeling, and manual labeling depends on people.

One more difference matters for long-lived content. Microsoft states that retention settings from labels travel with the content when it moves to another location within your tenant, unlike settings from policies. If people move a contract from one team site to another, the label moves with it. The policy of the first site does not. Labels do not persist if the content moves outside Microsoft 365.

A third point is where the rule is easiest to check. A policy is visible in one place, so an auditor can read it quickly. Labels spread over many libraries and need an inventory. Plan to review both. For governance, a short register helps: one line per rule with its scope, period, action and owner.

## What happens when both apply

Many tenants run a broad policy and a few labels, so overlaps are normal. Microsoft documents the principles that resolve them:

- **Retention wins over deletion.** Content is not permanently deleted while another setting still retains it.
- **The longest retention period wins.** If several settings retain content for different periods, it is kept until the longest one ends.
- **An explicit delete wins.** A delete action from a retention label takes precedence over a delete action from any retention policy.
- **The shortest deletion period wins** when only policies are left to decide.

The same page lists the exceptions, so read it before you finalize the design. When a retention period expires and the setting says delete, Microsoft says the content moves to the recycle bin, and a 93-day period spans both recycle bin stages before it is permanently deleted. Remember also what happens in the background. When a file under retention is edited or deleted, SharePoint keeps a copy in the Preservation Hold library, which is a hidden system location. The library is not for daily use, and Microsoft says it is not supported to edit, delete or move the files in it.

## Example: a contract library under a site policy

This example uses invented numbers. A legal team works on a SharePoint site. A policy keeps all files on the site for seven years after creation. The team stores signed contracts in one document library. The company rule says contracts must be kept for ten years.

- **Option A:** do nothing. Contracts are kept seven years, which breaks the rule.
- **Option B:** set a default retention label on the contract library with a ten-year retention period. Each contract inherits the label. The policy says seven years and the label says ten, so the longest period wins and contracts are kept ten years.

The dates make the difference concrete. A contract signed on 1 March 2027 is kept until 1 March 2034 under the policy alone and until 1 March 2037 under the label. The label adds three more years of retention for that library, and the storage cost of those three years is the price of meeting the company rule. Only the contract library pays it. Every other library stays on the seven-year policy.

Now change the label to "delete after three years" while the policy still says to retain for seven years. The label asks for deletion, the policy asks for retention, and retention wins over deletion. The files stay for seven years. If you really want deletion after three years, you must change the policy for that content. Test such conflicts on one sample site first, because a policy needs up to seven days to apply, and you do not want to learn the outcome in production.

## Common mistakes

- **Using only manual labels for mandatory rules.** People forget. Use a policy, a default label or an auto-apply label for anything that must happen every time.
- **Expecting a policy to find content by keyword.** Policies work on locations. Content conditions belong to labels.
- **Stacking rules without checking the outcome.** Remember that retention wins over deletion and the longest period wins. A short delete label under a long policy does nothing visible.
- **Forgetting that an item has one label.** If two teams both want to label the same file, only one label can apply at a time.
- **Not telling site owners.** Retained content behaves differently from what users expect after they delete or edit a file.
- **Choosing names in a hurry.** A label name cannot be changed once the label is saved.

## How software can help

Microsoft Purview gives you the tools to create policies and labels and to review them in one place. Beyond that, a simple retention register helps: one line per rule with the location, policy or label, period, action and owner. A spreadsheet that your compliance team reviews every quarter is enough. If you manage many sites, PowerShell can export the settings so that the register stays accurate.

## Next step

List the three kinds of content on your SharePoint sites that need a retention rule different from your general policy. Then use the three questions in this article to decide, for each one, whether the retention policy vs retention label choice points to a default label, an auto-apply label or a policy.
