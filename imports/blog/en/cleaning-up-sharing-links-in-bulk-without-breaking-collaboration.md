---
title: "Cleaning up sharing links in bulk without breaking collaboration"
summary: "Sharing links pile up over time and can expose content more broadly than intended. Here is how to review them, prioritize by risk, and clean up in bulk with a pilot and a way back, so collaboration keeps working."
status: review
publish: false
author: mirko-p
date: 2026-11-19
topics: [sharepoint-sharing-links, oversharing, sharepoint-essentials-toolkit, cognillo]
faq:
  - q: "Can I remove all organization-wide sharing links at once?"
    a: "Technically you can often act in bulk, but removing links stops access for everyone who relied on them. Start with a pilot site, review which links are still used, keep a record of what you remove, and communicate with owners before wider cleanup. Check Microsoft Learn for current options."
  - q: "Do I need a third-party tool to clean up sharing links?"
    a: "No. Microsoft 365 offers native options such as site-level sharing settings, the Manage access pane, and PowerShell for admins. Third-party tools are one option when you need cross-site reporting or bulk actions from reports. Evaluate them against your own requirements and test them first."
  - q: "Why do sharing links matter for Copilot?"
    a: "Copilot surfaces content a user can already access. If files are reachable through broad links, such as organization-wide ones, they may appear in answers for more people than intended. Cleaning up overly broad links reduces that exposure but does not replace good permission design. Check Microsoft Learn for details."
---

Sharing links are a convenient feature in SharePoint and OneDrive. They can also let access drift away from what anyone intended. A link created for a one-time review can keep working long after the project ends.

Cleaning this up in bulk is possible, but it is a change to access. Done carelessly, it breaks collaboration: people lose access to files they still need, and the help desk fills up. This article describes a practical order of work that reduces exposure while keeping teams productive.

## What you are actually cleaning up

[SharePoint sharing links](https://www.m365.fm/entity/sharepoint-sharing-links/) are created with the Share option and grant access to a file or folder. They come with different scopes, for example:

- **Anyone:** anyone with the link, typically without sign-in (if your tenant allows it; check Microsoft Learn for current behaviour).
- **People in the organization:** anyone in your tenant who has the link.
- **People with existing access:** a link that does not grant new access.
- **Specific people:** only the named recipients.

Scope is a key factor, alongside age and content sensitivity. A specific-people link is a targeted grant. An organization-wide or anonymous link is a broad one, and it is the broad ones that usually cause [oversharing](https://www.m365.fm/entity/oversharing/): content shared more widely than intended.

This matters beyond classic data protection. AI assistants such as Copilot surface content that a user can already access. If a file is reachable through a broad link, it can show up for more people than the owner expected. Reviewing links can therefore be one part of preparing for Copilot, though it does not replace sound permission design. Check Microsoft Learn for current guidance on how Copilot respects permissions.

## Decide what "broken collaboration" means before you start

The main risk of bulk cleanup is removing a link that someone depends on. Before touching anything, agree on what you must protect.

Imagine a marketing team site where a campaign folder was shared with the whole organization during a launch. Two years later, the launch is over, and the link is still active. Removing it is almost certainly fine. Now imagine an HR policy folder shared the same way, intentionally, so every employee can read it. Removing that link would cause real disruption, even though the scope looks identical.

Scope alone does not tell you whether a link is a problem. You need context: who owns the content, whether it is sensitive, and whether the link is still in use. That is why a purely automated purge is rarely a good idea. A better approach combines reporting with owner input.

## Native options first

Microsoft 365 already gives you several ways to see and control sharing. The exact features and licensing requirements change, so verify the current state on [Microsoft Learn](https://learn.microsoft.com/) before you plan.

- **Tenant and site sharing settings.** Limit the most permissive link types at the tenant level and tighten them further per site. This prevents new broad links but does not remove existing ones.
- **Manage access on the item.** Site owners and file owners can see who has access and delete individual links. This works well for small clean-ups and for training owners.
- **Admin tools and PowerShell.** Administrators can report on and change sharing at scale. Scripts that remove links or change permissions are risky: **test them on a pilot site or in a test tenant first, and make sure you have a record of the previous state or a backup so you can restore access.**
- **Governance and review features in Microsoft 365.** Some Microsoft 365 licensing tiers may include access reviews or sharing reports. Availability depends on your plan, so check Microsoft Learn for what applies to you.

Changing settings is the cheapest control because it stops the problem from growing. Removing existing links is the part that needs care.

## A cleanup order that protects collaboration

One possible sequence looks like this. Adapt it to your environment.

**1. Set the guardrails for new links.** Restrict anonymous links where you do not need them, and set sensible defaults for link type. Otherwise you clean up while new broad links keep arriving.

**2. Build an inventory.** List links by scope, site and content. Start with the broadest scopes. Note which sites hold sensitive or business-critical content, since these deserve attention first.

**3. Pilot on one site.** Pick a low-risk or test site. Remove or narrow links there, and observe what breaks. **Keep a record of every link you remove, including its target and scope, so you can re-grant access if someone reports a problem.** If your method cannot be reversed, do not scale it.

**4. Tell the owners.** Before a wider run, message site owners with a clear date and a way to object. A short notice such as "organization-wide links on this site will be removed on this date; contact us if you need an exception" prevents most surprises.

**5. Replace instead of only delete.** Where a team genuinely needs access, replace a broad link with a narrower one, such as specific people or a group. This keeps collaboration working while shrinking exposure.

**6. Run in waves and monitor.** Work site by site or scope by scope, check support requests after each wave, and adjust.

**7. Repeat on a schedule.** Links accumulate again. A recurring review is more sustainable than a one-off project.

## Where a dedicated tool can fit

Native options cover a lot, but cross-site reporting and bulk actions can take effort to assemble. Some teams therefore look at dedicated tools. This is one option, not a requirement.

[Cognillo](https://www.m365.fm/entity/cognillo/) offers the [SharePoint Essentials Toolkit](https://www.m365.fm/entity/sharepoint-essentials-toolkit/), a tool for SharePoint administrators and site owners. According to the vendor's product page, it includes a report on sharing links, sites and content open to everyone, heavily shared files that are not labelled, and outdated content with open access. The product page also lists permission reports for sites, folders and items, and fixing permissions and sharing links from reports. Any fix or bulk change of this kind should be tested on a pilot site first, with a way back. Reports and tasks can be scheduled and exported to SharePoint, by e-mail, or to Excel or CSV. The vendor's video page lists demos, for example on cleaning up sharing links in bulk.

These are the vendor's own statements and were not tested by M365.FM. Cognillo sponsors M365.FM. The review site TrustRadius names other tools, such as ShareGate and LinkFixer Advanced, as common alternatives. Whichever route you take, evaluate it against your own requirements, check licensing and pricing on the vendor's site, and apply the same rule as for scripts: **pilot first and keep a way back before any bulk change.**

## Practical takeaways

- Prioritize by scope and sensitivity: anonymous and organization-wide links first, on sites with sensitive content.
- Set guardrails for new links before cleaning old ones, or the backlog refills.
- Scope alone does not show whether a link is a problem; use owner input and context.
- Pilot every bulk action on a test or low-risk site, and keep a record or backup so you can restore access.
- Announce changes to site owners with a date and a way to request exceptions.
- Replace broad links with narrower ones where collaboration still needs access.
- Treat cleanup as a recurring process, not a one-time project.
- Check [Microsoft Learn](https://learn.microsoft.com/) for the current state of sharing controls and licensing before you plan.
