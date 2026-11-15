---
title: "Restricted SharePoint Search: a bridge, not a fix"
summary: "Restricted SharePoint Search can limit what Copilot and search surface while you clean up permissions, but it is a temporary measure. Learn what it does, what it does not do, and how to fix the root cause."
status: review
publish: false
author: mirko-p
date: 2026-11-27
topics: [restricted-sharepoint-search, oversharing, copilot-governance]
faq:
  - q: "Does Restricted SharePoint Search fix oversharing?"
    a: "No. It is designed to limit which SharePoint sites are included in organization-wide search and Copilot responses, which can buy time. The permissions themselves stay unchanged, so overshared content remains accessible by other routes. Review the current behaviour on Microsoft Learn and treat it as a temporary measure while you correct permissions."
  - q: "Is Restricted SharePoint Search meant to be permanent?"
    a: "No. Microsoft Learn describes it as a short-term solution that is not intended or scalable for long-term use, says it is retiring, and has blocked new enablement since July 31, 2026, pointing to Restricted Content Discovery instead. Treat any discoverability restriction as a stopgap during rollout or clean-up, not a long-term governance model. Lasting control comes from correct permissions, sensible sharing settings and ongoing review. Check Microsoft Learn for the current guidance, scope and limitations before relying on it."
  - q: "What should I do while Restricted SharePoint Search is in place?"
    a: "Use the time to find where content is shared too broadly, such as organization-wide or anonymous links, and fix permissions at the source. Pilot changes on a test site first and keep a way back. Then plan to retire the restriction once the underlying access is sound."
---

When Copilot arrives in a tenant, many teams discover that their search results show more than they expected. The cause is often not Copilot itself but loose permissions and broad sharing that went unnoticed because nobody searched that hard before.

[Restricted SharePoint Search](https://www.m365.fm/entity/restricted-sharepoint-search/) was one of the options Microsoft provided to reduce that exposure while you sort things out. Microsoft Learn now states that it is retiring: since July 31, 2026, new enablement is blocked, and Microsoft points to Restricted Content Discovery instead. Both work on what gets surfaced, not on who can access what, and that distinction decides how you should use them.

## What Restricted SharePoint Search is for

Restricted SharePoint Search is designed to limit which SharePoint sites are included in organization-wide search and in Copilot responses. Instead of everything a user can technically reach being discoverable, the scope is narrowed to an allow list of up to 100 sites, as described on Microsoft Learn. Microsoft calls it a short-term solution that is not intended or scalable for long-term use, and states that it is not a security boundary. The exact behaviour, configuration steps and limitations are described on Microsoft Learn, and they can change, so check the current documentation before you plan around it. The [Microsoft Learn start page for SharePoint](https://learn.microsoft.com/en-us/sharepoint/) is a good place to begin.

The practical idea is simple. If you are not yet confident about permissions across hundreds or thousands of sites, you can reduce the number of places that feed search and Copilot answers. That gives you a controlled starting point instead of an open one.

Think of it as a temporary filter in front of the problem, not a repair of the problem.

## What it does not do

The key point: a search restriction does not change permissions. If a document is accessible to everyone in the organization, it stays accessible to everyone in the organization. People can still open it through a link they received or through other routes that do not depend on organization-wide search. Microsoft also notes that the restriction does not guarantee that only sites on the allow list appear: a site that a user recently accessed, or that was shared with the user in Teams or Outlook, still shows up in that user's results and responses.

Imagine a team site where a project folder was shared with an organization-wide link some time ago. If that site is outside the restricted scope, it may no longer show up in broad search or Copilot answers. The permissions, however, are unchanged, and people who have the link or direct access may still be able to open the content. The risk moved out of sight. It did not go away.

That is why this feature is a bridge. It helps you cross a gap in time, but you still need to build the other side.

## What Microsoft points to now

Microsoft Learn names Restricted Content Discovery (RCD) as the replacement for content discoverability. It is a site-level setting that keeps content from the selected sites out of organization-wide search and Copilot responses, and it can be applied to up to 20,000 sites. Like Restricted SharePoint Search, it does not change permissions: users who already have access can still reach the content directly, and they can still discover content they own or recently interacted with. It does not remove content from the search index.

Some points from the documentation are worth planning for. Restricted Content Discovery needs the prerequisites of SharePoint Advanced Management and a Microsoft Copilot license. It also removes AI entry points such as the Copilot button from the affected sites. Microsoft cautions that excessive use can reduce the content available to search and Copilot, and that changes can take time to propagate, with more than a week possible for sites with more than 500,000 items. Microsoft describes it as a temporary governance control as well, so the logic of this article still applies.

## The real problem: oversharing

The thing a restriction cannot fix is [oversharing](https://www.m365.fm/entity/oversharing/): content shared more broadly than intended, for example through organization-wide or anonymous links. AI assistants like Copilot can surface that content to users who technically have access but were never meant to find it.

Typical sources of oversharing include:

- Sharing links that are open to the whole organization or to anyone
- Sites with broad membership, such as large groups added for convenience
- Folders or files with unique permissions that nobody reviews
- Old sites that were never archived or cleaned up

None of these is new. Copilot just makes them more visible, because it is good at finding and summarizing what a user can reach.

A restriction hides some of this. Only a permissions review removes it. For background on the available controls, the [Microsoft Learn documentation for Microsoft 365 Copilot](https://learn.microsoft.com/en-us/copilot/microsoft-365/) and the Microsoft Tech Community are the places to look for current guidance.

## Where it fits in Copilot governance

[Copilot governance](https://www.m365.fm/entity/copilot-governance/) covers the controls for permissions, data access and oversight when you use Copilot in a tenant. It is broader than any single feature. Restricted SharePoint Search was one possible control inside it, and a short-term one. Restricted Content Discovery is the control Microsoft points to now.

A sensible way to think about the layers:

1. **Permissions first.** Make sure access matches what people should actually see. This is the foundation, and everything else depends on it.
2. **Sharing settings.** Decide how broadly links can be created, and review existing organization-wide and anonymous links.
3. **Scoped exposure.** Use temporary measures such as Restricted Content Discovery to reduce the surface while you work on the first two.
4. **Ongoing review.** Governance is not a one-off project. Sites, teams and links keep changing.

A discoverability restriction belongs in step three. It is helpful when it supports steps one and two. It is risky when it replaces them.

## Using the time well

If you decide to use a restriction, the value lies in what you do while it is in place. A workable order of work might look like this:

- **Inventory.** Identify which sites matter most and which hold sensitive content. Start with the sites you would least want surfaced by accident.
- **Find broad links and groups.** Look for organization-wide and anonymous sharing links, and for sites with very broad membership.
- **Fix at the source.** Remove or narrow access where it is not needed, and correct site and group membership.
- **Restrict sites deliberately.** Microsoft cautions that excessive use of Restricted Content Discovery can reduce the content available to search and Copilot, so apply it selectively and based on a review.
- **Plan the exit.** Decide in advance what conditions must be met before you relax or remove the restriction, and who owns that decision.

Any change that removes access, changes link settings, breaks inheritance or touches many sites at once can disrupt users or lose access they legitimately need. Always test first on a pilot site or in a test tenant, and make sure you have a backup or a documented way back before you roll changes out more widely. Bulk changes, including scripted ones, deserve extra care.

Native Microsoft features are the starting point. Third-party tools are one option among others when you need additional visibility; Cognillo offers the SharePoint Essentials Toolkit, and [www.cognillo.com](https://www.cognillo.com) describes what it covers.

## Practical takeaways

- Restricted SharePoint Search limits what is surfaced in organization-wide search and Copilot responses. It does not change permissions, it is retiring, and new enablement has been blocked since July 31, 2026. Microsoft points to Restricted Content Discovery.
- Overshared content stays accessible through other routes even if it is out of the search scope.
- Treat the feature as a temporary bridge, not as a governance model.
- Use the time to find and fix oversharing at the source: broad links, broad groups and unreviewed unique permissions.
- Test permission and sharing changes on a pilot site or test tenant first, and keep a way back.
- Define the exit conditions before you switch the restriction on, and name an owner.
- Check Microsoft Learn for the current behaviour and limitations before you rely on any of this in production.

## Sources

- [Restricted SharePoint Search (Microsoft Learn)](https://learn.microsoft.com/sharepoint/restricted-sharepoint-search)
- [Restrict discovery of SharePoint sites and content (Microsoft Learn)](https://learn.microsoft.com/sharepoint/restricted-content-discovery)
- [Microsoft 365 Copilot data, privacy, and security (Microsoft Learn)](https://learn.microsoft.com/microsoft-365/copilot/microsoft-365-copilot-privacy)
