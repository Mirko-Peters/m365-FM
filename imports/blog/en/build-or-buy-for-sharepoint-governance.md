---
title: "Build or buy for SharePoint governance"
summary: "Build or buy for SharePoint governance: start with native Microsoft features and a clear ownership model, then decide where scripts or a third-party tool fill real gaps. A practical way to weigh effort, risk and upkeep."
status: review
publish: false
author: mirko-p
date: 2027-01-04
topics: [sharepoint-governance, sharegate, sharepoint-essentials-toolkit]
faq:
  - q: "Should SharePoint governance start with a tool or with a policy?"
    a: "Start with policy and ownership. Microsoft's intranet governance guidance says to plan early, involve business and IT, and define who owns each site. Tools help enforce and report on those decisions, but without agreed rules they only show you the problems faster."
  - q: "When does building your own governance scripts make sense?"
    a: "It can make sense when the requirement is narrow, stable and well understood, and someone is clearly responsible for maintaining the script. Scripts that change permissions or delete content need a pilot site or test tenant first and a way back."
  - q: "What should we compare when evaluating a third-party SharePoint tool?"
    a: "Compare it against what Microsoft already provides, including SharePoint Advanced Management. Then check the exact functions you need, supported SharePoint versions, pricing model, and how reports are exported. Vendor claims should be verified in your own test tenant before you decide."
---

Every SharePoint environment eventually asks the same question: do we build our own governance controls, or do we buy something? The honest answer is that it depends on what you are trying to control, who will maintain it, and what Microsoft already gives you.

This article does not pick a winner. It lays out a way to compare the options so the decision follows your requirements rather than a sales deck or a weekend scripting project.

## Start with the policy, not the tool

[SharePoint governance](https://www.m365.fm/entity/sharepoint-governance/) is not a product. Microsoft describes governance in general as the set of policies, roles, responsibilities and processes that control how an organization's business divisions and IT teams work together to achieve its goals. That definition comes from the SharePoint Server documentation, but the idea carries over.

For SharePoint in Microsoft 365, the [Microsoft Learn guide on intranet governance](https://learn.microsoft.com/en-us/sharepoint/intranet-governance) makes several points that matter before any build-or-buy discussion:

- Start governance planning early and review it regularly.
- Include business and IT in the governance team, and keep it in place after launch.
- The business is responsible, not IT alone.
- Policies are requirements; guidelines are recommendations.
- Define site ownership, for example a primary and a secondary contact per site.

Imagine a tenant where nobody has agreed who owns a team site once its creator leaves. No tool can answer that for you. It can report orphaned sites, but someone still has to decide what happens to them.

If your rules are unwritten, buying a tool will mostly document the mess. Building a script will automate an unclear decision. Write down the policies first: external sharing, default sharing links, metadata, site creation, and review cycles.

## What native Microsoft features already cover

Native features come first because they do not add another vendor or another integration to evaluate. Some features may still depend on licensing, so check Microsoft Learn. Microsoft's guidance points to policies that work best when site owners do not have to think about them, for example through site designs. It also mentions that a review cycle can be automated, for example with Power Automate.

For larger tenants, Microsoft offers [SharePoint Advanced Management](https://learn.microsoft.com/en-us/sharepoint/advanced-management), with tools in three areas: content sprawl, the content lifecycle and oversharing. Licensing and availability can change, so check Microsoft Learn for the current requirements before you plan around it.

A sensible first step is a gap list. For each governance requirement, write down whether a native feature covers it fully, partly or not at all. "Partly" is where the build-or-buy question becomes real.

## When building makes sense

Building means scripts, flows or small internal tools, often with PowerShell, Power Automate or the Microsoft Graph. It can be the right choice in some situations:

- The requirement is narrow and stable, such as a monthly report for one specific policy.
- You already have people who write and maintain this kind of automation.
- Your needs are unusual enough that no packaged tool fits them.
- You want full control over what the automation does and where data goes.

The costs are easy to underestimate. A script is not finished when it runs once. It needs an owner, documentation, error handling, credentials management and updates when Microsoft changes behaviour. If the person who wrote it leaves, the script becomes a risk of its own.

Be careful with anything that changes things. Scripts that delete content, remove permissions, break inheritance, restore items or make bulk changes can cause real damage if they are wrong. Always run them first on a pilot site or in a test tenant, and make sure you have a backup or another way back before touching production. A reporting script that only reads data is far lower risk than one that writes.

## When buying makes sense

Buying makes sense when the requirement is broad, recurring and not worth your own maintenance effort, or when you need functions that native tools do not offer in the form you need.

Third-party tools are one option among others. [ShareGate](https://www.m365.fm/entity/sharegate/), for example, is a vendor of Microsoft 365 migration, consolidation and governance tools. The [SharePoint Essentials Toolkit](https://www.m365.fm/entity/sharepoint-essentials-toolkit/) from [Cognillo](https://www.m365.fm/entity/cognillo/) is another. This section is sponsored content: Cognillo sponsors M365.FM, and the following points are the vendor's own statements from its product page, not tested by M365.FM.

According to Cognillo, the toolkit is aimed at SharePoint site owners and Microsoft 365 administrators. The functions it names include:

- Permission reports for sites, folders and items, and showing everything one person can access.
- Reports on sharing links, content open to everyone and outdated content with open access.
- A broken link inventory and monitor.
- Governance monitors, including permission changes and storage growth, with e-mail notifications.
- SharePoint-to-SharePoint migration. Migration changes content, so pilot it first and keep the source until the results are verified.
- Metadata reports and scheduled exports to SharePoint, e-mail, Excel or CSV.

The vendor lists a free Community Edition limited to 20 SharePoint sites, which may be one way to look at the reports; check the current terms with the vendor. Prices and licence terms are the vendor's statements as of November 2026 and can change, so confirm them with the vendor.

Whichever tool you consider, test it the same way. Run it in a test tenant or on a pilot site, compare its reports with what you already see in the admin centers, and treat any fix-from-report function as a change action. Fixing permissions or sharing links in bulk modifies access, so try it on a small, non-critical site first and know how you would reverse it.

## A simple way to decide

Use the same questions for every requirement on your gap list:

1. **Is it covered natively?** If yes, use it and document how.
2. **How often does it recur?** A one-off cleanup rarely justifies a tool or a permanent script.
3. **Who maintains it?** If you cannot name a person or team, do not build it.
4. **What can go wrong?** Read-only reports are low risk. Changes to access or content need testing and a way back.
5. **What does it cost over time?** Count licences, but also the hours for upkeep, reviews and training.
6. **Does it fit your environment?** Check supported SharePoint versions, Microsoft 365 setup and export options against your needs.

You will probably end up with a mix: native features for the baseline, a few small scripts for narrow needs, and possibly one tool for broad reporting or migration. That is a normal outcome, not a failure to decide.

## Practical takeaways

- Write policies and assign site owners before you evaluate any tool.
- Map each requirement against native features, including SharePoint Advanced Management, and list the real gaps.
- Build only what is narrow, stable and has a named maintainer.
- Buy where the need is broad and recurring, and compare more than one option on the exact functions you need.
- Treat vendor feature, speed and price statements as claims to verify in your own test tenant.
- Test every change action on a pilot site first, and keep a backup or a way back.
- Review the setup regularly, as Microsoft's governance guidance recommends.
