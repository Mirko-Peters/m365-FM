---
title: "A simple approval process for external sharing in Microsoft 365"
summary: "Build an external sharing approval process in Microsoft 365 with sponsors, access packages and rules for who may invite guests. Steps and a worked example."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [guest-access, access-packages, entra-external-id, compliance]
keypoints:
  - "A good approval process has four parts: a request with a reason, a named internal sponsor who approves, a fixed end date and a record of the decision."
  - "Microsoft Entra entitlement management can run this flow through access packages, with requester justification, approver justification and an expiration date."
  - "Microsoft's tutorial requires approval for external users and sets the decision window to 14 days and the access to expire after 60 days."
  - "To keep invitations governed, set Guests can invite to No in B2B collaboration settings, so guests enter through the approved route."
  - "Keep the process small: one form, one sponsor, one SLA. Routine one-off shares through Specific people links can stay outside the formal flow."
faq:
  - q: "Do all external shares need an approval process?"
    a: "No. A one-off file shared with a named person through a Specific people link can often follow a simple rule without a ticket. Ongoing work with outsiders, such as a project team added as guests to a site or team, benefits from approval, a sponsor and an end date, because access then lasts for weeks or months."
  - q: "Who should approve a guest request?"
    a: "An internal sponsor who knows the business reason should approve it. Microsoft's tutorial uses the internal sponsor as approver and requires a justification from both the requester and the approver. IT sets the rules and the route, but the business owner decides whether the outside person really needs access."
  - q: "How long should guest access last?"
    a: "Set an end date from the purpose of the work. Microsoft's tutorial example uses 60 days with a renewal, and another page mentions 180 days as a sample expiration. There is no single right number, so choose the shortest period that fits the project, and let sponsors renew it with a fresh reason."
---

An external sharing approval process is a short, repeatable path in which a person asks for outside access, an internal sponsor approves it with a reason, and the access ends on a fixed date. This article is for IT managers who want that path without a heavy bureaucracy. You will learn what the process needs, how Microsoft Entra access packages can run it, which settings keep it from being bypassed, and see a worked example with invented numbers.

## What does an external sharing approval process need?

Start on paper, before you touch any tool. Four parts make a process that people follow:

1. **A request with a reason.** Who is the outside person, which site or team, what for, and until when?
2. **A named approver.** An internal sponsor who knows the business case, not an anonymous IT mailbox.
3. **A fixed end date.** Access that never ends becomes forgotten access.
4. **A record.** Who asked, who approved, when and why.

The record matters for audits and for [compliance](https://www.m365.fm/entity/compliance/) questions later. It lets you answer, "Why does this person have access?" with a name and a date. Without it, you rely on memory.

Also decide what does not need the process. A one-off file sent to one named person through a Specific people link can follow a simple rule: view only, short expiry, no ticket. Use the formal process for ongoing work, where the outsider gets [guest access](https://www.m365.fm/entity/guest-access/) to a site or team. If everything needs approval, people will find ways around it, and the process will fail.

## How can Microsoft Entra access packages run the process?

Microsoft's entitlement management feature is built for this. Its page on [governing access for external users](https://learn.microsoft.com/en-us/entra/id-governance/entitlement-management-external-users) explains that it uses Microsoft Entra B2B to share access. External users authenticate to their home directory and have a representation in your directory, which lets you assign them access.

The central object is the access package. A policy on the package decides who can request it, whether approval is required, whether access reviews are required and when access expires. For users not in your directory, the policy can allow specific connected organizations, all connected organizations, or all users. Using all users requires that you first enable email one-time passcode authentication.

Approval is typically required. For major partners, Microsoft suggests inviting one or more external users, naming them as sponsors, and making sponsors the approvers. When a request is approved and the person is not yet in your directory, entitlement management invites them through B2B. Microsoft Entra ID creates the guest account, and the user receives an email when access is delivered.

The result is the four parts from the previous section, in one tool. The [access packages](https://www.m365.fm/entity/access-packages/) hold the request, the approver, the end date and the history.

## What does Microsoft's tutorial set up?

The tutorial on [onboarding external users through an approval process](https://learn.microsoft.com/en-us/Office365/Enterprise/b2b-extranet) is a good starting model. It uses these settings:

- A package named External user package, with an External collaboration group as the resource.
- Requests from all users, meaning all connected organizations and any new external users.
- Approval set to Yes, which Microsoft calls mandatory for external users.
- Requestor justification set to Yes.
- One approval stage with the internal sponsor as approver.
- A decision window of 14 days, with approver justification set to Yes.
- Assignments that expire after 60 days, with renewal before then.

The external user opens the package link in the My Access portal, gives a reason, and waits for the sponsor's decision. After approval, access starts, and it ends after 60 days unless renewed. The tutorial also lists the prerequisites: a license of Microsoft Entra ID P2, Microsoft Entra ID Governance or Enterprise Mobility + Security E5, and the Identity Governance Administrator role or one of the lower-privilege alternatives. The internal sponsor scenario also needs a connected organization.

Treat these numbers as an example, not a rule. Choose your own decision window and expiry from the purpose of the work.

## Which settings keep the process from being bypassed?

A process only works if the side door is closed. Microsoft's page lists settings to check before external users can request access:

- **B2B collaboration:** set Guests can invite to No, to limit ungoverned invitations. Check that no partner domain is on a blocklist, because allow and blocklist settings take precedence.
- **Catalog:** the setting Enabled for external users must be Yes.
- **SharePoint Online:** the organization-level external sharing setting must allow guest access, and the site-level setting must enable it too.
- **Microsoft 365 groups:** Let users add new guests to the organization must be On, and external sharing must be on for group sites.
- **Teams:** Allow guest access in Microsoft Teams must be On.
- **Conditional Access:** exclude the Entitlement Management app from policies that would affect guests.

There is a trade-off between governance and speed. If Teams owners can still add guests directly, they will do it when the approval takes too long. So pick a response time you can keep, and publish it. A sponsor who answers in one working day makes the route more attractive than the side door. You can read more about the settings in the [Entra External ID](https://www.m365.fm/entity/entra-external-id/) topic and in Microsoft's page on [managing sharing settings](https://learn.microsoft.com/en-us/sharepoint/turn-external-sharing-on-or-off).

## What happens when access ends?

Plan the end at the start. According to Microsoft, an expiring assignment that is not extended loses the access of the package. By default, when an externally invited user has no other assignment after losing the last one, the guest account is blocked from signing in for 30 days and then removed.

The lifecycle settings give you three choices: remove the external user, block sign-in, and set the number of days before removal. Setting the days to 0 removes the account as soon as the last assignment is lost. The settings apply only to guest accounts invited through entitlement management or converted to governed lifecycle management, and they affect only users who lose their last assignment later. Guests who were in the directory before they got an assignment remain. Also note that users are notified when access expires, but not when the account is removed.

This is why legacy guests need a separate cleanup. The process covers new guests, and the old ones need a one-time review.

## Can you run the approval as a Power Automate workflow?

Yes, for requests that Microsoft Entra access packages do not cover, such as a request to share a single folder. Microsoft's page on [getting started with approvals](https://learn.microsoft.com/en-us/power-automate/get-started-approvals) describes an approval workflow in Power Automate with these approval types:

- **Everyone must approve:** each approver must respond before the flow completes.
- **First to respond:** one approval or rejection completes the request.
- **Custom responses:** you define the options, and the flow waits for all approvers or for one.
- **Sequential approval:** approvals are requested one at a time, in a set order. This fits a manager first and the data owner second.

Approvers respond from an Outlook email, a Microsoft Teams adaptive card or the Power Automate action center, if they hold a suitable license. You can assign approvals to guest users and Microsoft 365 groups. Guests who did not accept the B2B invitation are removed from the approver list and do not take part. Approval flows are saved in Dataverse.

Does an approval workflow secure the shared material? No. It records who decided, but the sharing settings, link type and expiry still come from your SharePoint and Entra configuration. Build the workflow so that the approved request leads to a named-people share, not an Anyone link.

## Example: a request flow for 40 requests a quarter

The numbers are invented to show the method. A company with 900 employees gets about 40 external collaboration requests per quarter. Before the process, 40 percent of the guests had no clear sponsor, and the guest list grew by about 60 accounts per quarter.

The IT manager sets up three things:

1. **One access package** for project collaboration, with a requester justification, one sponsor approval, a decision window of 5 working days and access that expires after 90 days.
2. **One rule for one-off shares:** Specific people link, view only, expiry in 14 days, no ticket.
3. **A setting change:** Guests can invite is set to No, so group owners must use the package.

After one quarter, the numbers look like this. Of the 40 requests, 28 are one-off shares that follow the simple rule. 12 go through the package. The sponsors approve 10 and decline 2, and the median decision time is 1.5 working days. The guest list grows by 10 accounts, not 60, and each of the 10 has a sponsor and an end date.

The lesson is the split. Most requests stay light, and the governed route is used where the risk is higher. That keeps sponsors from drowning in approvals.

## Common mistakes

- **Putting every share through the process.** People will avoid it. Keep one-off links simple.
- **Leaving the side door open.** If anyone can still invite guests, the process is optional.
- **Approving without a reason.** Require a justification from the requester and the approver.
- **No end date.** Access without an end becomes a stale guest list.
- **No promise on response time.** Slow approvals push people to workarounds.
- **Forgetting existing guests.** The process covers new guests, so review the old ones once.

## How software can help

Start with the tools in your tenant: the SharePoint sharing settings, the Microsoft Entra B2B settings and, if your licenses allow it, entitlement management. A simple form in Microsoft Forms or a ticket queue can carry the request until you automate it. For reporting, a script or a reporting tool can list guests, their sponsors and their end dates in one view. Compare any option with the built-in route first, and check licensing before you plan around it.

## Next step

Write the four parts of your external sharing approval process on one page this week: the request fields, the sponsor, the end date and the record. Then test it with one real project before you roll it out to everyone.
