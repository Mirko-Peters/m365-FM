---
title: "Who should own SharePoint governance? A role split for small IT teams"
summary: "SharePoint governance roles for small IT teams: who decides, who does the work and who signs off. A simple RACI split for admins, owners and the IT manager."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [sharepoint-governance, microsoft-365-administrator, sharepoint-site-owner, decision-rights]
keypoints:
  - "Small IT teams do not need a governance committee, but every governance task needs one named person who is accountable for the outcome."
  - "Microsoft recommends using the admin role with the fewest permissions, so day-to-day SharePoint work should not run on Global Administrator accounts."
  - "Site owners handle everyday decisions such as membership and content, while the SharePoint administrator handles tenant-wide settings, site creation and sharing limits."
  - "A RACI chart works when each task has one accountable person, at least one responsible person, and few people in the consulted and informed columns."
  - "Write decision rights down for the choices that stall work, such as external sharing, ownership changes, archiving and policy exceptions."
faq:
  - q: "Who is responsible for SharePoint governance?"
    a: "Responsibility is shared, but accountability should sit with one person, usually the IT manager or a designated governance owner. Administrators run tenant-wide settings, site owners manage their own sites, and business leaders decide what content matters. Write the split down so every task has one accountable owner."
  - q: "What does a SharePoint administrator do in governance?"
    a: "According to Microsoft, the SharePoint Administrator role can create and delete sites, manage storage limits, set organization-level sharing, manage Microsoft 365 groups and designate site admins. It does not get automatic access to all content, although it can grant itself access. Use it instead of Global Administrator for daily work."
  - q: "Do small teams need a SharePoint governance committee?"
    a: "Not necessarily. A small team can start with a one-page role split and a short list of decision rights, reviewed a few times a year. A committee becomes useful when decisions affect many departments, but without named owners even a committee will not get the work done."
---

SharePoint governance roles answer a plain question: who decides, who does the work and who answers for the result? This guide is for IT managers of small teams, often three to six people who run Microsoft 365 along with everything else. You will see which roles exist, what Microsoft says each one can do, how to split tasks with a simple RACI chart, and how to write down decision rights. A worked example with made-up numbers shows a four-person team doing it in one afternoon.

## Why a role split matters for small teams

[SharePoint governance](https://www.m365.fm/entity/sharepoint-governance/) means the policies, roles, responsibilities and processes that control how your organization uses SharePoint: who owns sites, how sites are created and shared, and how content is reviewed. Governance policies are only as good as the people who carry them out, and small teams often skip that part. The result is a familiar pattern: one administrator makes every change because nobody else may, or owners change settings because nobody told them not to.

Microsoft's own guidance for SharePoint site owners points the same way. The support article on [site governance, permissions and sharing](https://support.microsoft.com/office/overview-site-governance-permission-and-sharing-for-site-owners-95e83c3d-e1b0-4aae-9d08-e94dcaa4942e) tells owners to create a governance model that covers policies, processes, roles and responsibilities, and to work with the SharePoint administrator, because many sharing and permission rules are set there. It also suggests owner training, a named site expert as liaison to the administrators, and links to your organization's guidelines for site creation and use.

A role split is the cheapest part of a governance framework. It needs no tool and no budget, only a few agreed sentences. It also supports compliance work later, because every audit asks who was responsible for a decision. You do not need a governance committee or a long governance plan to start. A one-page governance strategy for your SharePoint environment, owned by a named person, is enough, and you can add a committee later if decisions start to affect many departments.

## Who does what: from tenant to document library

Think in layers, from the tenant down to a single document library.

- **Microsoft 365 or Global administrator.** The top of the tenant. Microsoft says it already includes all SharePoint Administrator permissions, but it is highly privileged and should be limited to emergencies when no other option works.
- **SharePoint administrator.** The [Microsoft 365 administrator](https://www.m365.fm/entity/microsoft-365-administrator/) for SharePoint. Microsoft's page on the [SharePoint Administrator role](https://learn.microsoft.com/sharepoint/sharepoint-admin-role) lists what it can do: use the SharePoint admin center, create and delete sites, manage storage limits, designate and remove site administrators, manage organization-level sharing, manage Microsoft 365 groups and use PowerShell. It gets no automatic access to all sites, although it can grant itself access, and term store changes need a separate permission.
- **Site owner.** A [site owner](https://www.m365.fm/entity/sharepoint-site-owner/) manages one site: members, permissions and settings, within what the administrator allows. Microsoft says site-level administrators can manage their sites without a tenant-wide admin permission, and that they do not use the admin center.
- **Content owner.** The support article suggests assigning owners for large lists and libraries and auditing site and page content on a schedule.
- **Members and visitors.** They create and read content, and they follow your rules on sharing and storage.
- **Group and team owners.** Microsoft 365 groups and Microsoft Teams bring their own owners, so ask who owns each one and who covers when that person leaves.

One more job is not on Microsoft's list but matters in practice: the person who is accountable for governance as a whole. In a small team, that is usually the IT manager.

## SharePoint governance roles in a simple RACI

A RACI chart assigns each task to people in four ways. The project-management.com guide to the [responsibility assignment matrix](https://project-management.com/understanding-responsibility-assignment-matrix-raci-matrix/) defines them:

- **Responsible:** does the work. Several people can share this.
- **Accountable:** owns the outcome and gives final sign-off.
- **Consulted:** gives input, but is not required to be followed.
- **Informed:** receives updates and takes no part in the decision.

The same guide offers rules that suit small teams. Each task should have one accountable owner. Every row needs at least one responsible person and one accountable person. Limit the consulted and informed columns, because too many names slow everything down. Leave a cell empty when someone has no real part. Avoid stacking many responsible and accountable assignments on one person, and give the accountable person real authority to approve or escalate.

The last rule is the hard one in a small team. When there are only four people, the same name appears in many cells. That is acceptable if you can see it, and it tells you where you depend on one person.

## Write down decision rights

A RACI chart covers tasks. [Decision rights](https://www.m365.fm/entity/decision-rights/) cover choices: who may decide, who may approve and who may override. Capture them for the decisions that usually stall work:

1. **Who may create sites or workspaces, and with which template.**
2. **Who may turn on external sharing for a site.**
3. **Who may change a site's owners, and what happens when the owner leaves.**
4. **Who approves archiving or deleting a site.**
5. **Who grants a policy exception, and for how long.**

Keep each answer to one line. Microsoft's guidance on permissions gives a useful default for owners: grant only the minimum access each person needs, use the default owner, member and visitor groups instead of one-off grants, and keep sensitive material in its own site or library. Make that the standard answer, and let exceptions go through the named approver.

If you are preparing a Microsoft Copilot rollout, clear ownership matters even more, because someone has to act on oversharing findings. A split of duties will not fix oversharing by itself, but it tells you who acts when you find it.

## Routines that keep the split alive

Duties on paper do not run themselves. Tie each responsibility to a routine, and give the routine a rhythm.

- **Provisioning.** Decide who may provision a new site, with which template and metadata, and who records the owner.
- **Lifecycle management.** Review sites on a schedule: who confirms that a site is still needed, who handles inactive sites, and who archives them.
- **Access reviews.** Ask owners to confirm membership, and keep sharing and access control under the administrator's limits.
- **Content audits and content management.** Microsoft's support article advises auditing site and page content on a schedule, so name the content owner who does it.
- **Retention and sensitive data.** Agree who decides which sites hold sensitive data and which retention policies apply, together with your compliance contact.

A simple workflow with reminders can help. For example, a scheduled automation can ask owners to confirm their sites each quarter and list the sites that stay unanswered. Keep the owner list somewhere you can report on it, because a split of duties is only as good as your record of who holds each part.

## Example: a four-person team

The numbers are made up.

A company with 600 employees runs 380 SharePoint sites. The IT team has four people: an IT manager, two administrators and a service desk specialist. Until now, the two administrators handle every request, and 90 sites have owners who have left.

The IT manager spends one afternoon on a one-page split:

- **Accountable for governance overall:** the IT manager.
- **Tenant-wide settings, site creation and sharing limits:** administrator A is responsible, the IT manager is accountable, administrator B is consulted.
- **Site lifecycle and ownership reassignment:** administrator B is responsible, the IT manager is accountable, the service desk is informed.
- **Membership and content in a site:** the site owner is responsible and accountable, the service desk is consulted.
- **Policy exceptions:** the IT manager is accountable, a department head is consulted, and the owner is informed.

The manager also names a deputy for each admin task, so that no row depends on one person. Then the team agrees to review the page every quarter. Within a month, the 90 orphaned sites each get a new owner or a decision to archive, and the administrators stop receiving requests that belong to owners.

## Common mistakes

- **Making everyone accountable.** If three people sign off, nobody does.
- **Running daily work on Global Administrator accounts.** Microsoft recommends the least-privileged option.
- **Leaving owners out.** They know the content and make most day-to-day access decisions.
- **Writing a long policy no one reads.** A one-page split that people can find is more useful.
- **Naming people but not decision rights.** The first question in a dispute is who may decide.
- **Never reviewing the split.** People change jobs and sites change owners.

## How software can help

Start with what Microsoft 365 already offers: the SharePoint admin center for sites and sharing, Microsoft Entra ID for administrator access, and group ownership for team sites. Add a shared page or list for the RACI chart and decision rights, and keep the owner list as a report you can check. Reports and alerts from your own scripts or a third-party governance tool can show sites without owners. Treat tools as support for the split, not as a substitute for it.

## Next step

Open a blank page and list your top ten governance tasks, then give each one a single accountable name. Share the page with your administrators and a few owners, and use it to settle your SharePoint governance roles before the next request lands.
