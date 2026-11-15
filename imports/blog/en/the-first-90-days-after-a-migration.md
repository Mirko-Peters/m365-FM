---
title: "The first 90 days after a migration"
summary: "A migration is not finished when the last file lands in SharePoint. This guide covers what to check in the first 90 days: source access, broken links, ownership and governance, so the new environment stays usable."
status: review
publish: false
author: mirko-p
date: 2027-01-13
topics: [sharepoint-migration, sharepoint-governance, sharepoint-broken-links]
faq:
  - q: "Are the source files deleted after a SharePoint migration?"
    a: "No. According to Microsoft Learn, migrating copies the content into SharePoint and OneDrive, and the source files are not deleted. That gives you a fallback while you validate the result, but you should still decide deliberately when and how the old source becomes read-only or is retired."
  - q: "Why do links break after a migration or a site address change?"
    a: "When a site address changes, SharePoint creates a redirect at the old address, so favorites and sharing links keep working. Embedded URLs in web parts are not updated and may break. If a redirect is later deleted, requests to the old address are no longer forwarded."
  - q: "Who should own governance after a migration?"
    a: "Microsoft Learn's intranet governance guidance says governance should reflect the goals of business stakeholders, not just the expectations of IT. A governance team with business and IT members should stay in place after launch and review policies regularly. Site ownership is a typical policy topic; Microsoft's example is a primary and a secondary contact per site."
---

Moving the last batch of files into SharePoint feels like the end of a project. For users it is the beginning. They open the new sites, look for their documents, click old links and find out whether the new structure makes sense.

The first 90 days decide whether the migration is remembered as a clean move or as a source of support tickets. This article walks through what to check, in roughly the order it matters. It is a planning aid, not a complete runbook. Verify details on Microsoft Learn before you act.

## Keep the safety net while you validate

[SharePoint migration](https://www.m365.fm/entity/sharepoint-migration/), as Microsoft Learn describes it, means moving content into Microsoft 365, meaning SharePoint and OneDrive. The important detail: migrating copies the files. As Microsoft puts it, "Your source files are not deleted."

That is your safety net in the early weeks. Do not rush to switch off or delete the source. Instead, decide on a clear rule: for example, the old file share becomes read-only on a set date, and is only retired once validation is finished and the business has signed off.

Validation can be simple and still useful:

- Pick a sample of sites or libraries from each business unit and compare them with the source.
- Ask owners to check that the folders and files they use daily are present and open correctly.
- Check that people who need access have it, and that people who should not have access do not.
- Note anything that did not come across, such as unsupported file types or content that needed manual work.

Document what you find. A short list of known gaps is far more useful to the helpdesk than a vague "migration complete" message.

If you find gaps and decide to re-run or correct content, treat that as a change with risk. Test on a pilot site first, and make sure you have a way back before you overwrite or delete anything in the destination.

## Rebuild what did not migrate

Some things do not simply arrive as they were. Microsoft Learn recommends moving classic SharePoint Server workflows to Power Automate flows, and SPMT can migrate certain SharePoint Server 2010 workflows. Classic pages are covered by a separate Microsoft guide on transforming them to modern pages. If your source was an older SharePoint Server version, make a list of workflows, custom forms and classic pages and decide for each one whether it is still needed.

Imagine a department that relied on an approval workflow for contracts. If the documents migrate but the approval step does not, nobody may notice until the first contract needs sign-off. A workflow inventory before go-live, and a check against it afterwards, catches this kind of gap early.

Also keep in mind who is doing the work. Microsoft describes a Migration Administrator role that gives a migration team access to Migration Manager in the Microsoft 365 admin center without the broader SharePoint administrator role. Once the project phase is over, review whether those role assignments are still needed, and remove them according to your own access policies. Test role changes on a pilot first and note the previous state so you can restore it.

## Look for broken links early

Links are where users feel a migration most directly. A document that mentions a path on the old file share, a page that links to a library on the old address, a bookmark in a browser: any of these can stop working.

[Broken links in SharePoint](https://www.m365.fm/entity/sharepoint-broken-links/) usually appear when an address changes. Microsoft Learn explains what happens when a site address is changed:

- SharePoint creates a redirect at the previous address.
- Favorites, selected links to the site and sharing links are sent to the new address.
- Embedded URLs in web parts, such as News or List web parts, are not updated and may break.
- Custom solutions keep their old address dependencies, Power Apps custom forms must be recreated, SharePoint 2013 workflows must be republished, and the site must be connected to its hub site again.

A redirect stays until someone deletes it. After deletion, requests to the old address are no longer forwarded, and bookmarks, links and "Shared With Me" references stop working. So a rule of thumb: do not clean up redirects early. Keep them while you work through your link inventory.

The Microsoft Learn pages on site address changes and redirects describe when links break, but they do not describe a general tool for finding broken links in SharePoint Online. Vendors such as [Cognillo](https://www.cognillo.com/) offer their own tools for that. If you consider one, evaluate it in a test environment against your own requirements, as you would any other tool.

A practical approach for the first weeks:

1. List your most visited pages: the intranet home, department start pages, key libraries.
2. Open every web part link and navigation entry on those pages and check that it works.
3. Check documents that people reference often, such as templates and policies, for links to old locations.
4. Ask users to report broken links through one simple channel, and fix them in batches.

## Put ownership in place

A migration often creates many sites at once. Without clear owners, they drift. Content gets outdated, sharing settings stay as they were on day one, and nobody feels responsible when something goes wrong.

Microsoft's intranet governance guidance gives site ownership as a policy example: every SharePoint site has a primary and a secondary contact responsible for the site and its content. In the first 90 days, this is a realistic goal: every migrated site has two named people, they know they are the owners, and they know where to turn with questions.

Imagine a team site for a project office with a long document history. If its only owner left the company during the migration project, nobody may be able to approve access requests or decide what to archive. A secondary owner prevents that situation.

Good starting steps:

- Export or list all migrated sites and check who is registered as owner.
- Assign a primary and a secondary contact where there is only one or none.
- Tell the owners what is expected of them, in a short and plain message.
- Decide how new sites are created, by request or by self-service, so the sprawl does not start again.

## Start governance now, not later

[SharePoint governance](https://www.m365.fm/entity/sharepoint-governance/) is easy to postpone because the migration project already took all the energy. Microsoft's guidance says the opposite: start governance planning early and review it regularly.

The [SharePoint governance overview on Microsoft Learn](https://learn.microsoft.com/en-us/sharepoint/governance-overview) describes governance as the set of policies, roles, responsibilities and processes that control how your organization's business divisions and IT teams work together to achieve its goals. For SharePoint in Microsoft 365, the intranet governance guide adds some useful points:

- A governance team should include business and IT, and stay in place after launch.
- Governance should reflect the goals of business stakeholders, not just the expectations of IT.
- Policies are requirements; guidelines are recommendations. Be clear about which is which.
- Topics to cover include external sharing, default sharing links and metadata.
- Policies work best when site owners do not have to think about them, for example through site designs.
- Power Automate flows are one way to trigger an intranet content review at a set interval.

You do not need a large framework in the first 90 days. Start with a few decisions: who may share externally and how, what the default sharing link should be, who approves new sites, and how often owners review their content. Write them down on one or two pages.

Microsoft also offers SharePoint Advanced Management, with tools in three areas: content sprawl, the content lifecycle and oversharing. Check Microsoft Learn for the [SharePoint Advanced Management documentation](https://learn.microsoft.com/en-us/sharepoint/advanced-management), including the licensing and feature details that apply to your tenant, before you plan around it.

Any policy change that affects access, such as tightening sharing settings, can lock people out of content they need. Pilot the change on a small set of sites first, tell the affected owners, and keep a record of the previous settings so you can revert.

## Practical takeaways

- **Keep the source until you are done validating.** Migration copies content, so you have a fallback. Set a clear date and rule for retiring the old source.
- **Validate with samples and owners.** Compare content and permissions, and write down known gaps.
- **Inventory what needs rebuilding.** Microsoft recommends moving classic workflows to Power Automate flows; custom forms and customizations need their own check.
- **Do not delete redirects early.** They keep old addresses working until you have fixed embedded links.
- **Check your most visited pages first.** Embedded URLs in web parts are not updated automatically after an address change.
- **Name a primary and a secondary owner for every site.** Tell them what is expected.
- **Start a small governance team with business and IT.** Decide sharing defaults, site creation and review cycles, and write them down.
- **Test before you change access or delete anything.** Use a pilot site or test tenant, and keep a backup or a way back.

Check the linked Microsoft Learn pages for the current state of tools and features: [Migrate to SharePoint in Microsoft 365](https://learn.microsoft.com/en-us/sharepointmigration/migrate-to-sharepoint-online) and the [intranet governance guide](https://learn.microsoft.com/en-us/sharepoint/intranet-governance).

## Sources

- [Migrate to Microsoft 365 (Microsoft Learn)](https://learn.microsoft.com/sharepointmigration/migrate-to-sharepoint-online)
- [Change a site address (Microsoft Learn)](https://learn.microsoft.com/sharepoint/change-site-address)
- [Manage site redirects (Microsoft Learn)](https://learn.microsoft.com/sharepoint/manage-site-redirects)
- [SharePoint governance overview (Microsoft Learn)](https://learn.microsoft.com/sharepoint/governance-overview)
- [Planning intranet governance (Microsoft Learn)](https://learn.microsoft.com/sharepoint/intranet-governance)
- [SharePoint Advanced Management overview (Microsoft Learn)](https://learn.microsoft.com/sharepoint/advanced-management)
