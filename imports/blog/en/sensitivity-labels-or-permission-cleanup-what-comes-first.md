---
title: "Sensitivity labels or permission cleanup: what comes first"
summary: "Should you roll out sensitivity labels first or clean up permissions first? A practical look at how the two work together, where each falls short, and a sensible order for Copilot readiness."
status: review
publish: false
author: mirko-p
date: 2026-11-29
topics: [sensitivity-labels, oversharing, copilot-governance]
faq:
  - q: "Do sensitivity labels fix oversharing on their own?"
    a: "Not by themselves. A label can add encryption, markings and access restrictions to a file, but it only helps where files are actually labeled. Content that is unlabeled and shared too broadly stays exposed. Labels and permission cleanup address different layers, so most tenants need both."
  - q: "Should we clean up permissions before enabling Copilot?"
    a: "Copilot can surface content that users already have access to, so broad access can surface content to people who should not see it. Check Microsoft Learn for how Copilot respects existing permissions in your tenant. Reviewing the most exposed sites and sharing links first is a reasonable starting point. Always pilot changes on a test site and keep a way back."
  - q: "Where should a small team start with sensitivity labels?"
    a: "Start with a small, clear label set and a pilot group instead of a full taxonomy. Decide what each label should enforce, such as encryption or markings, and test how it behaves in Office apps and SharePoint. Check Microsoft Learn for current requirements and licensing before widening the rollout."
---

Teams preparing for Copilot often get stuck on one question: do we roll out sensitivity labels first, or clean up permissions first? Both are sensible, both take effort, and both are often presented as "the" answer.

The short version is that they address different problems. This article explains what each one does, where each one falls short, and how to sequence them without creating a long, risky project.

## What each approach actually does

[Sensitivity labels](https://www.m365.fm/entity/sensitivity-labels/) come from Microsoft Purview. They classify documents, emails and meetings, and a label can add encryption, visual markings and access restrictions. Those protections travel with the file wherever it goes. A label is a property of the content itself.

Permission cleanup works on a different layer. It is about who can reach a site, library, folder or file in the first place, and through which sharing links. It changes the access path, not the content.

A simple way to think about it:

- **Permissions** answer: who can get to this location or item?
- **Labels** answer: what rules apply to this content, wherever it ends up?

Neither replaces the other. A well-labeled file in a site that half the company can browse is still reachable by half the company, unless the label itself restricts access. And a perfectly tidy site does nothing for a file that is later copied somewhere else without protection.

## Why Copilot raises the stakes

[Oversharing](https://www.m365.fm/entity/oversharing/) means content is shared more broadly than intended, for example through organization-wide or anonymous links. In the past, that content was often protected by obscurity: nobody knew where it was, so nobody found it.

AI assistants change that. Copilot can surface content to users, and the practical effect is that material a person technically had access to, but never would have found, can now appear in an answer. According to Microsoft documentation, Copilot is designed to work within the access a user already has, so overly broad access can be enough for content to appear.

Imagine a team site where a HR spreadsheet was shared with "everyone in the organization" years ago because it was convenient. Nobody opened it for months. With search and AI summaries, the file may now show up for people who were never meant to see it. The permission was always the problem; the new tooling just makes it visible.

This is why [Copilot governance](https://www.m365.fm/entity/copilot-governance/) is not only a licensing or policy topic. It covers controls for permissions, data access and oversight in the tenant. The exact controls available change over time, so check Microsoft Learn for the current options rather than relying on a checklist from a blog post, including this one.

## Where labels fall short on their own

Labels are powerful, but they have limits that matter for sequencing.

**They only protect what is labeled.** If most of your content is unlabeled, a label policy protects very little on day one. Getting labels onto existing content takes time, decisions and sometimes tooling.

**They need a design.** A useful label set is small and clear. If a tenant starts with too many labels, users may not understand the difference between them and may pick whatever is quickest. A label only helps if people, or automation, apply it correctly.

**They do not remove broad links by themselves.** Depending on how a label is configured, it may restrict access or add encryption, but an anonymous or organization-wide link is a sharing setting that you still need to review. Check Microsoft Learn for how labels interact with sharing and with SharePoint sites in your configuration.

**They have prerequisites.** Licensing, tenant settings and client support affect what you can enforce. Verify these on Microsoft Learn before you plan a rollout around specific label behaviour.

None of this makes labels a bad first step. It means that labels alone will not close an oversharing gap that already exists.

## Where permission cleanup falls short on its own

Permission work has its own traps.

**It is never "finished".** Sites get new members, files get new links, and people leave. A one-time cleanup improves the current state but drifts back without a recurring review.

**It is risky if done in bulk.** Removing links, changing group membership or breaking inheritance can lock people out of content they need. It can also be hard to undo if you did not record the previous state.

**It does not travel with the file.** Once a document leaves its site, for example by download, email or copy, the site permissions no longer apply to that copy. That is the gap labels are designed to help with.

**It needs business input.** IT can see that a link is organization-wide. Only the content owner can say whether that was intended. Cleanup stalls when owners are not involved.

## A sensible order of work

If you have to pick a sequence, this one is easy to defend and easy to adapt.

**1. Find the most exposed content first.** Start with where oversharing is most likely and most harmful: sites with HR, finance, legal or customer data, and sites with many organization-wide or anonymous links. Use the reporting and review tools Microsoft documents for SharePoint and Purview, and check Microsoft Learn for what is available in your plan. Some organizations also use third-party tools for this; they are one option among others and not required.

**2. Fix the highest-risk access paths.** Replace broad links with targeted ones, review group membership, and give each important site a named owner. Before you change anything at scale, test on a pilot site, record the current state, and make sure you can reverse the change. Bulk changes and scripts that alter permissions should be tested on a pilot site first, with a backup or a way back, before any run in production.

**3. Introduce a small label set in a pilot.** Pick a handful of labels with clear rules, for example one for general content and one or two for confidential content. Decide what each label enforces, such as encryption, markings or access restrictions. Test with a pilot group and check how labeled files behave in Office apps, SharePoint and sharing scenarios before widening the rollout.

**4. Label what matters, then expand.** Apply labels to the content you identified in step 1. Consider default labels for libraries and, where your licensing and Microsoft documentation allow it, automatic labeling. Treat automation like any other change: test it first.

**5. Review again on a schedule.** Run the access review and the label coverage check regularly. Governance is a process, not a project with an end date.

Notice that steps 1 to 3 can overlap. You do not need a perfect cleanup before you pilot labels, and you do not need full label coverage before you fix a risky anonymous link. The point is to avoid doing only one layer and calling the job done.

## Practical takeaways

- Labels and permission cleanup solve different problems. Plan for both instead of choosing one.
- Copilot is designed to surface what users can already access, so broad access and oversharing deserve early attention in many tenants.
- Start with the most exposed sites and the riskiest sharing links, not with the whole tenant.
- Keep the first label set small, clear and tested with a pilot group.
- Test every access change on a pilot site first, record the previous state, and keep a way back. This applies especially to bulk changes, scripts and inheritance changes.
- Involve content owners; IT can find the exposure, but owners decide what is intended.
- Repeat the review regularly, and check Microsoft Learn for current features, licensing and prerequisites before you commit to a design.
