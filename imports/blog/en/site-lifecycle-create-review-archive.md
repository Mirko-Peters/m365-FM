---
title: "Site lifecycle: create, review, archive"
summary: "SharePoint sites need a lifecycle: clear ownership, regular review and a controlled path to archive. Learn how SharePoint Advanced Management policies support this without deleting sites, and where manual governance still matters."
status: review
publish: false
author: mirko-p
date: 2026-12-21
topics: [sharepoint-site-lifecycle, content-lifecycle-management, orphaned-sites]
faq:
  - q: "Do SharePoint site lifecycle policies delete sites?"
    a: "No. Microsoft states that site lifecycle management policies do not delete SharePoint sites directly. Depending on configuration, a policy can take no action, set a site to read-only, or archive it after a read-only period with Microsoft 365 Archive. Check Microsoft Learn for the current options."
  - q: "What is the difference between an inactive site policy and a site attestation policy?"
    a: "An inactive site policy detects sites without meaningful activity across SharePoint and connected workloads such as Teams, Exchange and Viva Engage. A site attestation policy asks owners at regular intervals to confirm explicitly that the site is still needed. One looks at activity, the other asks for a decision."
  - q: "Can I test a site lifecycle policy before it sends notifications?"
    a: "Yes. Microsoft describes a simulation mode in which a policy runs once and creates a report. In active mode the policy runs regularly, creates reports and sends notifications. Microsoft describes simulation mode as a one-time run that creates a report; it is a sensible first step to review before moving to active mode, where notifications are sent."
---

Every SharePoint site starts with a reason. A project begins, a team forms, a department needs a place for its documents. The creation step is usually well organized. What happens afterwards often is not.

Sites keep existing long after the project ends. Owners change roles or leave. Permissions stay in place. This article walks through a simple way to think about the whole lifespan of a site, and how the [SharePoint site lifecycle](https://www.m365.fm/entity/sharepoint-site-lifecycle/) policies in SharePoint Advanced Management can support it.

## Why sites need a lifecycle

A site without a lifecycle tends to drift. Nobody decides when it is finished, so it stays. Over time a tenant collects sites that are inactive, unowned or simply forgotten, while their content and permissions remain.

This matters for reasons that are independent of any tool: people may still have access to content that no longer concerns them, outdated material can pile up, and administrators may not be able to tell which sites still matter.

A lifecycle gives each site three moments of decision: creation (who owns it and why it exists), review (is it still needed) and retirement (what happens when it is not). The rest of this article maps those moments to what Microsoft documents and to what remains a human decision.

## Creation: ownership from day one

The cheapest time to set up governance is when a site is created. Even a short list of questions helps. Who is responsible for this site? Who is the second owner? What is its purpose, and is there a rough idea of how long it will be needed?

Imagine a team site for a marketing campaign. If the creation process records two named owners and a purpose such as "campaign Q3 materials", the later review has something to work with. If the site was created with a single owner and no description, the reviewer has to guess.

Microsoft's site lifecycle management supports this idea with a site ownership policy. According to Microsoft Learn, it makes sure a site has a minimum number of owners or admins, for example at least two. This is a technical safety net, not a replacement for a clear creation process. It helps when owners leave or change roles, but it cannot tell you why a site exists.

## Review: activity and attestation

Once a site is running, two questions come up regularly: is anyone using it, and does anyone still want it?

Microsoft's documentation describes two policy types for these questions:

- **Inactive site policy:** detects sites without meaningful activity across SharePoint and connected workloads such as Teams, Exchange and Viva Engage.
- **Site attestation policy:** asks at regular intervals for an explicit confirmation that the site is still needed.

The two answer different things. Activity is a signal, but not proof. A site holding reference material may be quiet and still valuable. A busy site may be used out of habit and no longer serve its original purpose. Attestation asks a person to take responsibility for the decision. Using both gives you a signal and a confirmation.

### How policies run

Per Microsoft Learn, a policy can run in two modes. In simulation mode, it runs once and creates a report. In active mode, it runs regularly, creates reports and sends notifications. Recipients can respond from the e-mail, for example by confirming that the site is still in use.

Simulation mode is a sensible place to start. It lets you see which sites a policy would affect before any owner receives a message. Review the report, check whether the results match your expectations, and only then consider active mode. Details and current options are on [Microsoft Learn](https://learn.microsoft.com/en-us/sharepoint/site-lifecycle-management).

## Archive: what happens when nobody answers

Notifications only help if someone responds. Microsoft documents what a policy can do when nobody answers after several notices: take no action, set the site to read-only, or archive it after a configurable read-only period with Microsoft 365 Archive.

Two points from the documentation deserve emphasis. First, Microsoft states: "Site lifecycle management policies don't delete SharePoint sites directly." Second, disabling or deleting a policy stops future actions but does not undo actions already taken.

The second point has a practical consequence. If a policy has already set sites to read-only or archived them, switching the policy off will not reverse that. Plan for a way back before you activate anything that changes site state.

> **Test first.** Before you enable a policy that can set sites to read-only or archive them, run it in simulation mode and, where possible, try it on a pilot set of sites or in a test tenant. Make sure you know how to restore or reopen a site and who is allowed to do it. Check Microsoft Learn for how archived sites are handled in your setup.

A cautious ladder is easy to explain to stakeholders: start with reports only, then notifications, then read-only, and archive last. Each step gives owners another chance to respond, and gives you a chance to adjust.

## Orphaned sites and content lifecycle

Two related concepts help place site lifecycle in context.

[Orphaned sites](https://www.m365.fm/entity/orphaned-sites/) are SharePoint or Teams sites that no longer have an active owner, typically because the original owner left the organization. Their content and permissions remain in the tenant. The ownership policy is designed to help here: it makes sure a site has a minimum number of owners or admins, for example at least two. Check Microsoft Learn for how it handles sites that fall below the minimum.

Imagine a project site with one owner. The owner leaves the company, the account is removed, and nobody is left who can answer questions about the site. Months later, a request arrives to clean up storage or review access. Without an owner, nobody can say whether the content matters. An ownership policy and a second owner from the start reduce the chance of that situation.

[Content lifecycle management](https://www.m365.fm/entity/content-lifecycle-management/) looks at a different level. It manages documents through defined stages of creation, review, archiving and deletion, with owners, review dates and expiration rules so outdated content does not linger. Site lifecycle asks whether a whole site should continue; content lifecycle asks the same about individual documents.

The two work together. A site can remain valid while some of its documents are outdated. A site can also be retired while a few documents inside it still need to be kept for other reasons. Keeping the levels separate helps avoid decisions that are too broad, such as archiving a whole site because of a handful of old files.

## What stays a human decision

Policies can detect, notify and, in some configurations, change a site's state. They cannot decide your retention needs, your legal obligations or the business value of a site. Those decisions belong to people and to your own governance rules.

A few questions are worth settling before any policy goes live:

- Who receives the notifications, and what happens if that person is absent?
- Who may confirm that a site is still needed?
- Which sites should be excluded or handled differently?
- Which retention or compliance requirements apply before a site is set to read-only or archived?

Also check licensing and availability. Requirements for SharePoint Advanced Management and Microsoft 365 Archive can change, so confirm what applies to your tenant. Microsoft Learn, including the [SharePoint Advanced Management overview](https://learn.microsoft.com/en-us/sharepoint/advanced-management), is the place to confirm what applies to your tenant.

## Practical takeaways

- Treat every site as having three moments: creation, review and retirement. Decide in advance who owns each.
- Record at least two owners and a short purpose when a site is created.
- Use the site ownership policy as a safety net for orphaned sites, not as a substitute for a creation process.
- Combine activity signals (inactive site policy) with an explicit confirmation (site attestation policy).
- Start in simulation mode, read the report, and only then consider active mode.
- Pilot on a small set of sites or in a test tenant before enabling read-only or archive actions, and know how to reverse them. Disabling a policy does not undo actions already taken.
- Remember that these policies don't delete sites directly, and keep site-level and document-level lifecycle decisions separate.
- Confirm current features, licensing and settings on Microsoft Learn before you plan a rollout.
