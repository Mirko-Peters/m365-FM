---
title: "Find and replace text across sites safely"
summary: "Bulk text replacement in SharePoint can fix outdated names and wording quickly, but it can also overwrite content you meant to keep. Here is how to scope, test and roll back a find and replace across sites."
status: review
publish: false
author: mirko-p
date: 2026-12-13
topics: [sharepoint, sharepoint-essentials-toolkit, pnp-powershell]
faq:
  - q: "Does SharePoint have a built-in find and replace across multiple sites?"
    a: "I am not aware of a single tenant-wide feature for this in Microsoft documentation. SharePoint search can help you locate where text appears, but replacing it across many sites usually means editing pages by hand, scripting with a module such as PnP PowerShell, or using a third-party tool. Check Microsoft Learn for current capabilities."
  - q: "How do I reduce the risk of a bulk text replacement?"
    a: "Define an exact scope, export a list of every match first, and run the change on a pilot site or test tenant before touching production. Keep a backup or a documented way back, such as page version history or a copy of the content, and review the results on a sample of pages afterwards."
  - q: "Can I undo a find and replace after it ran?"
    a: "It depends on how the change was made. SharePoint keeps version history for many pages and files, which can let you restore earlier versions, but this depends on your settings and content type. Do not rely on undo alone. Plan a backup and a rollback path before you start, and verify it works in a test."
---

Imagine a company renames a product. The old name appears on dozens of [SharePoint](https://www.m365.fm/entity/sharepoint/) pages, in web parts, in navigation links and in document text. Someone says, "Just run a find and replace." That sentence is where most of the risk starts.

A bulk text change is simple in concept and easy to get wrong in practice. This article covers how to scope it, which options exist, and how to test and reverse a change so a wording fix does not become a clean-up project.

## Why bulk text changes are riskier than they look

Text in SharePoint lives in more places than most people expect. Modern pages hold text in text web parts. Navigation has its own labels. Documents in libraries carry their own content, and metadata fields hold values that other processes may depend on.

A replace that works in one place can break another. A few examples of hypothetical problems:

- A short old term also appears inside longer, unrelated words or names, so a plain replace changes text you never meant to touch.
- A legal notice, contract reference or archived page should keep the old wording for good reasons.
- A metadata value is used in a filter, view or flow. Changing it quietly can make items disappear from views or stop an automation from matching.
- A link label and its target URL both contain the old term. Changing the label is fine, while changing the URL may break the link.

So the first question is not "How do we replace this?" It is "Where does this text appear, and which matches should change?"

## Step one: find and list every match

Start with a report. SharePoint search can help you see where terms appear, but search results are not a complete inventory of everything, since indexing depends on content type, permissions and timing. Check [Microsoft Learn](https://learn.microsoft.com/sharepoint/) for how search behaves in your environment, and treat search as a starting point rather than proof of completeness.

A useful match list records:

- the site, page or file
- where in the item the text appears (title, web part, navigation, document body, metadata)
- the surrounding text, so you can judge context
- whether the match should change, stay, or be reviewed by the content owner

Review the list with site owners. They know which pages are legal, archived or tied to a process. This step takes time, but it is a low-cost safeguard.

## Step two: choose your method

Microsoft documentation does not describe a single built-in tool for replacing text across many sites in one run (check Microsoft Learn for current capabilities), so the realistic options are these.

**Manual edits.** For a small number of pages, editing by hand is often the safest approach. Each change is visible, and the editor reads the context. It does not scale, but it fits a short match list.

**Scripting with PnP PowerShell.** [PnP PowerShell](https://www.m365.fm/entity/pnp-powershell/) is an open-source, community-maintained PowerShell module for managing SharePoint, Teams and Microsoft 365. Admins can use it to read page content and write changes in a repeatable way. Scripts can give you control and a record of what ran if you log it, but they also put the responsibility on you: a mistake in a pattern runs against every item in scope. Any script that changes content must be tested first on a pilot site or in a test tenant, and you need a backup or a way back before it runs in production.

**Third-party tools.** Several vendors offer tools for this kind of work. One example is the [SharePoint Essentials Toolkit](https://www.m365.fm/entity/sharepoint-essentials-toolkit/) from [Cognillo](https://www.m365.fm/entity/cognillo/), a sponsor of M365.FM. According to the vendor's product page, its content tools include search in pages and web parts and find and replace text, and it also lists reports and bulk actions from reports. These statements are the vendor's own and were not tested by M365.FM. Other products exist, and what fits depends on your scope, budget and how much control you want. Check the vendor's current documentation and try any tool on a pilot site before you use it widely.

Whichever method you choose, the same safety rules apply. The method changes how you make the edit, not how carefully you need to prepare.

## Step three: test and keep a way back

A bulk change should never run for the first time in production. Use a pilot site or a test tenant that mirrors the real content as closely as you can.

Before the real run:

1. **Back up or copy the content.** Know exactly how you would restore the previous state. Do not assume undo will be available.
2. **Check version history.** SharePoint keeps versions for many pages and files, which can let you restore an earlier version. Whether this works for your content depends on your library settings and the type of item, so confirm it on your own test content rather than trusting it. See Microsoft Learn for how versioning works in your environment.
3. **Run on the pilot first.** Compare before and after on a sample of pages. Look at rendering, links, navigation and any views or flows that use the changed values.
4. **Start small in production.** Run the change on a limited set of sites, review, then widen the scope.

Restoring is itself a change that can overwrite newer edits made after your run. If people keep editing while you replace text, restoring an old version may remove their work. Pick a quiet time and tell site owners what is happening.

## Step four: verify and communicate

After the run, check the result against your match list. Confirm that items marked "stay" were not touched and that items marked "change" were. Spot-check pages that mix old and new wording.

Then tell the people affected. Site owners should know what changed, when, and who to contact if something looks wrong. A short note prevents a flood of "why does this page look different?" questions and surfaces real problems faster.

Keep the match list and the record of what was changed. If a question comes up in a few months, you can answer it without guessing.

## Practical takeaways

- Build a match list before you replace anything, and have site owners decide which matches stay.
- Do not treat search results as a complete inventory of where text appears.
- Choose the method that fits the scope: manual edits for a short list, PnP PowerShell for repeatable scripted changes, a third-party tool if you want one, and check its current documentation.
- Test on a pilot site or in a test tenant first, and have a backup or a documented way back before any production run.
- Confirm version history behaviour on your own content instead of assuming it will save you.
- Roll out in small steps, verify against your list, and tell site owners what changed.
