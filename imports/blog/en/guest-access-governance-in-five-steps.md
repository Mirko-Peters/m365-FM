---
title: "Guest access governance in five steps"
summary: "Guest access is easy to open and hard to keep tidy. Five practical steps cover policy, ownership, sharing settings, regular reviews and clean-up, using native Microsoft 365 and Microsoft Entra features first."
status: review
publish: false
author: mirko-p
date: 2026-12-19
topics: [guest-access, access-reviews, sharepoint-governance]
faq:
  - q: "What is a guest in Microsoft 365?"
    a: "A guest is a person from outside your organization who is added to a Microsoft 365 group or team as a guest object in Microsoft Entra ID. Guest access can be controlled at tenant, team and sensitivity-label level, so settings at one level do not have to match the others."
  - q: "Who should decide which guests may stay?"
    a: "The people closest to the work usually know best, such as group owners or business sponsors, not IT alone. Microsoft Entra access reviews are designed to ask designated reviewers whether someone still needs access. IT sets the rules and the schedule; the business answers the question."
  - q: "Can I just turn guest access off to be safe?"
    a: "You can restrict it at tenant, team or label level, but that also blocks legitimate collaboration with partners or suppliers. A better approach is to define who may invite guests, label sensitive sites, and review access regularly. Check Microsoft Learn for the settings that apply to your tenant."
---

Opening a team or site to an external partner takes a few clicks. Finding out a year later who those guests are, who invited them and whether they still need access takes much longer. Without a plan, guest accounts can accumulate unnoticed.

[Guest access](https://www.m365.fm/entity/guest-access/) lets you add people from outside the organization to Microsoft 365 groups and Teams as guest objects in Microsoft Entra ID. It is controlled at tenant, team and sensitivity-label level. This article describes five steps to keep it manageable, starting with native Microsoft features.

## Step 1: Agree policy and roles before you tune settings

Technical settings follow decisions, not the other way round. Before changing anything, answer a few questions in writing:

- Who may invite guests: any member, only owners, or only a defined group?
- Which kinds of content may be shared with guests, and which not?
- Who decides when a guest is no longer needed?

This is the core of [SharePoint governance](https://www.m365.fm/entity/sharepoint-governance/): the policies, roles, responsibilities and processes that control how an organization uses SharePoint, including who owns sites, how sites are created and shared, and how content is reviewed.

The Microsoft Learn guidance on [intranet governance](https://learn.microsoft.com/en-us/sharepoint/intranet-governance) makes a few points that apply here. Governance planning should start early and be reviewed regularly. The governance team should include business and IT and stay in place after launch. The business is responsible, not IT alone. The guide also names external sharing as a topic a governance plan should cover.

It also separates policies from guidelines. Policies are requirements; guidelines are recommendations. Decide which of your guest rules are which. "Guests must not be invited to sites labeled confidential" is a policy. "Prefer expiring access for short projects" may be a guideline.

## Step 2: Name owners for every place guests can enter

A guest review is only as good as the person answering it. If a team has no active owner, nobody can say whether the external consultant still works on the project.

The same guide suggests defining site ownership, for example with a primary and a secondary contact per site. Apply that to every Microsoft 365 group and team that can contain guests.

Imagine a team created for a joint project with an agency. The project manager left the company, and the team now has a single owner account that is no longer active. The agency's guests still have access, and no one is in a position to say whether they should. A secondary owner, assigned from the start, is designed to help avoid this situation.

Practical points:

- Require at least two owners for groups and teams that may contain guests.
- Decide who takes over when an owner leaves.
- Keep a simple, accessible list of owners and the sites they are responsible for.

## Step 3: Set sharing defaults at the right layer

Because guest access is controlled at tenant, team and sensitivity-label level, you have choices about where a rule belongs. A rough way to think about it:

- **Tenant level:** the outer boundary. What is the most permissive setting you are willing to allow anywhere?
- **Team or site level:** the setting for a specific collaboration space.
- **Sensitivity-label level:** a rule that follows the label, so a "confidential" label can restrict guests while a "partner project" label allows them.

Which settings are available, and how the layers interact, depends on your tenant configuration and licensing. Check Microsoft Learn for the current options before relying on any particular combination. How the layers interact depends on the specific settings, so verify the effective behavior on a test site and check Microsoft Learn.

The intranet governance guidance also observes that policies work best when site owners do not have to think about them, for example through site designs. The idea carries over: apply guest rules through labels, templates and defaults rather than expecting every owner to configure sharing correctly by hand.

If you plan to tighten settings that already apply to existing teams or sites, test the change first on a pilot site or in a test tenant. Tighter rules can interrupt ongoing collaboration with external partners, so communicate before you change anything, and note the previous settings so you have a way back.

## Step 4: Review guest access on a schedule

Policy and defaults set the starting point. Over time, projects end, people move on and guests stay. This is what [access reviews](https://www.m365.fm/entity/access-reviews/) are for.

Access reviews in Microsoft Entra are recurring reviews that ask designated reviewers whether a person still needs access to a group, application, access package or privileged role. They can optionally apply removals automatically. The [Microsoft Learn overview of access reviews](https://learn.microsoft.com/en-us/entra/id-governance/access-reviews-overview) describes the scenarios and the requirements.

For guest access, a typical design looks like this:

1. Choose which groups or teams are in scope, for example all those that contain guests.
2. Choose the reviewers. Group owners can be a sensible choice, which is why Step 2 matters.
3. Set a recurrence that fits how quickly your projects change.
4. Decide what happens if a reviewer does not respond.
5. Decide whether the outcome is applied automatically or checked by an administrator first.

Two cautions. First, automatic removal changes access and can remove people who still need it, for example if a busy reviewer does not answer. Start with a pilot group or a test tenant, begin without automatic application where the option allows it, and confirm what happens to the guest account and to the content they created before you widen the scope. Second, make sure you can restore access if a removal turns out to be wrong, for example by knowing who to ask and how a guest is re-invited. Check Microsoft Learn for the licensing requirements of access reviews in your tenant, as they can affect which features you can use.

A review is also a communication task. Tell owners in advance that review requests are coming, what they mean and what to do. Reviews that owners do not recognize may be overlooked.

## Step 5: Clean up and keep a lightweight routine

Reviews show what should change. The clean-up is where the change happens, and then the cycle starts again. Test any clean-up on a pilot site or test tenant first and keep a way back.

A routine that is small enough to survive:

- **Respond to review results.** Act on outcomes, and follow up on owners who did not respond.
- **Look for sites without owners.** These are the places where reviews are most likely to stall.
- **Check the oversharing and lifecycle side.** For SharePoint in Microsoft 365, Microsoft offers SharePoint Advanced Management, with tools in three areas: content sprawl, the content lifecycle and oversharing. Check Microsoft Learn for what it includes and whether it applies to your licensing.
- **Automate the reminder, not the judgement.** The intranet governance guide mentions that a review cycle can be automated, for example with Power Automate. A scheduled reminder to owners is a sensible use; deciding who stays should remain with people.
- **Review the governance plan itself.** The guidance recommends reviewing governance regularly, not only the guests.

Any bulk removal of guests, or any script that changes permissions in many places, deserves the same care as before: run it first on a pilot site or test tenant, and have a backup or a documented way back.

Some organizations also use third-party tools for reporting or administration across many sites. Those are one option among several; the native features above are the place to start, and what you need depends on the size and complexity of your tenant.

## Practical takeaways

- Treat guest access as a governance topic: write down who may invite, what may be shared and who decides when access ends.
- Involve the business. IT sets the framework; owners and sponsors know who still needs access.
- Require at least two owners for groups and teams that can contain guests, and plan for owner changes.
- Decide at which layer each rule belongs: tenant, team or sensitivity label. Verify the effective behavior on a test site.
- Use Microsoft Entra access reviews on a recurring schedule, with reviewers who know the work.
- Be careful with automatic removal. Pilot first, and know how you would restore access.
- Keep the routine small enough that it actually happens, and review the plan itself regularly.
- Check Microsoft Learn for current settings, limits and licensing, because they can change.
