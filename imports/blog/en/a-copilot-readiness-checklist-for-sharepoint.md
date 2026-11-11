---
title: "A Copilot readiness checklist for SharePoint"
summary: "A practical Copilot readiness checklist for SharePoint: review permissions and sharing links, reduce oversharing, apply sensitivity labels, and set up ongoing oversight before a rollout."
status: review
publish: false
author: mirko-p
date: 2026-11-26
topics: [copilot-governance, oversharing, sensitivity-labels]
faq:
  - q: "Does Copilot bypass SharePoint permissions?"
    a: "Microsoft documents that Copilot works within the access a user already has. It does not grant new permissions. The practical risk is that existing permissions are often broader than intended, so content that was easy to overlook becomes easy to find. Check Microsoft Learn for the current details."
  - q: "Where should I start with a Copilot readiness review?"
    a: "Start with where content is shared too broadly: organization-wide links, anonymous links, and sites with large or unclear membership. Prioritize sites with sensitive content, fix the clearest problems first, and test every change on a pilot site before applying it widely."
  - q: "Are sensitivity labels enough to prepare for Copilot?"
    a: "Labels help, but they are one control among several. They classify and protect content, and can add encryption and access restrictions that travel with a file. They work best alongside permission reviews, sharing settings and ongoing monitoring, not as a replacement for them."
---

Many organizations start thinking about Copilot by looking at licences and prompts. For SharePoint owners, a more useful starting point is the content itself: who can reach it, how it was shared, and whether anyone still knows why.

Microsoft documents that Copilot works within the access a user already has. It does not hand out new permissions. The catch is that existing permissions are often wider than anyone intended, and an AI assistant makes broadly accessible content easier to find. This checklist walks through what to review before a rollout. Details change over time, so verify specifics on [Microsoft Learn](https://learn.microsoft.com/).

## Why readiness is mostly about permissions

[Copilot governance](https://www.m365.fm/entity/copilot-governance/) means the controls for permissions, data access and oversight around Copilot in a Microsoft 365 tenant. In SharePoint, that translates into a few plain questions:

- Who can access each site, and is that still appropriate?
- How has content been shared, and with whom?
- Is sensitive content identified and protected?
- Who will notice when things drift after go-live?

Imagine a team site created years ago for a project. The project ended, the owner left, and the site still has a broad group as a member. Nobody opens it anymore, so nobody noticed. With search and AI assistants in the picture, content like that can surface in answers for people who never knew it existed. The content did not change; its visibility did.

That is the core readiness problem. It is not a Copilot setting you toggle. It is an accumulation of past sharing decisions.

## Step 1: Take stock of your sites and owners

Before changing anything, get an overview. A simple inventory helps you prioritize:

- Which sites exist, and which are still active?
- Does each site have at least one accountable owner?
- Who are the members and visitors, and are large groups involved?
- Which sites hold sensitive material such as HR, finance, legal or customer data?

You can start with the SharePoint admin center, which provides site lists and settings. Microsoft also documents reporting and governance capabilities for SharePoint; check Microsoft Learn for what your licences include.

Ownerless sites deserve special attention. If nobody is responsible, nobody will answer an access review. Assign owners first, then ask them to confirm membership.

A practical way to prioritize is to sort sites into rough groups: sites with clearly sensitive content, sites with broad membership, and sites that look abandoned. Start with the overlap of the first two.

## Step 2: Look for oversharing

[Oversharing](https://www.m365.fm/entity/oversharing/) describes content that is shared more broadly than intended, for example through organization-wide or anonymous links. AI assistants like Copilot can surface such content to users who technically have access but were never meant to see it.

Typical places to check:

- **Organization-wide links.** A link that works for everyone in the tenant is convenient, but it can turn a single document into something many people can reach.
- **Anonymous links.** Links that work without sign-in extend access beyond your organization. Review whether your tenant and site settings allow them and whether that still fits your needs.
- **Broad group membership.** Large groups added to site permissions can expose a lot of content at once.
- **Unique permissions deep in a site.** Individually shared files and folders are easy to forget and can be harder to audit.

Microsoft documents sharing settings at tenant and site level, and describes options for reviewing and limiting sharing. Check Microsoft Learn for the current feature set and licensing requirements, since some capabilities depend on your subscription.

**Important:** cleanup actions can remove access that people rely on. Removing sharing links, changing group membership, or restoring inheritance can disrupt work or hide content people still need. Always try changes on a pilot site or a test tenant first, tell site owners before you act, and make sure you have a way back, such as a documented list of the previous settings or a backup of the permission structure. Do not run bulk changes across production before a pilot has gone well.

## Step 3: Classify and protect with sensitivity labels

[Sensitivity labels](https://www.m365.fm/entity/sensitivity-labels/) come from Microsoft Purview. They classify and protect documents, emails and meetings. A label can add encryption, visual markings and access restrictions that travel with the file wherever it goes.

That last point matters for readiness. Permissions on a site describe who can reach a location. A label can describe how the content itself should be treated, even after it leaves that location.

Questions to settle before you roll out or extend labels:

- Do you have a small, understandable label set? Too many labels tend to confuse users.
- Which labels apply to files, and which to sites or groups? Microsoft documents label scopes; check Microsoft Learn for what is currently supported.
- Will labels be applied by users, by default, or automatically? Each approach has trade-offs in effort and accuracy.
- Do your teams know what each label means in practice?

Labels are one control, not the whole answer. A label on a document does not fix a link that shares it with the entire organization, and a permission cleanup does not classify your content. Treat the two as complementary.

Labeling changes can also affect how people open and share files, especially when encryption is involved. Pilot with a small group, confirm that the experience works for them, and have a plan to adjust or roll back a label policy if it causes problems.

## Step 4: Set up oversight for after go-live

A one-time cleanup decays. People keep sharing, sites keep growing, and owners change roles. Readiness therefore includes a process, not just a project.

Consider:

- **Regular access reviews** for sites that hold sensitive content, with owners confirming who should still have access.
- **A clear request path** so employees know how to report content they can see but should not be able to see.
- **Lifecycle rules** for inactive sites, so abandoned content does not sit open indefinitely.
- **Monitoring and reporting** of sharing activity, using the tools included in your subscription.
- **Defined responsibilities.** Decide who in IT, who among site owners, and who in compliance handles which task.

Microsoft documents several admin and Purview capabilities that support these tasks, and the exact set depends on your licences. Some organizations also use third-party tools for inventory, reporting or governance workflows. That is one option among others; start by understanding what native features cover and where you see genuine gaps.

## Practical takeaways

- **Start with permissions, not Copilot settings.** Copilot works within existing access, so the main readiness work happens in SharePoint.
- **Inventory first.** Know your sites, owners and membership before changing anything.
- **Prioritize sensitive and broadly accessible sites.** Fix the biggest exposures first.
- **Review organization-wide and anonymous links.** These are common sources of oversharing.
- **Use sensitivity labels as an added layer.** They classify and protect content, but they do not replace permission cleanup.
- **Test every access-changing step on a pilot site or test tenant,** inform owners, and keep a way back.
- **Plan for the long term.** Schedule access reviews, define responsibilities and keep monitoring after go-live.
- **Check Microsoft Learn** for current capabilities and licence requirements before you commit to a plan.
