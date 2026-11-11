---
title: "Access reviews for guests"
summary: "Guest accounts tend to outlive the projects they were created for. Here is how Microsoft Entra access reviews help you ask the right people whether external users still need access to groups and Teams."
status: review
publish: false
author: mirko-p
date: 2026-12-22
topics: [access-reviews, guest-access]
faq:
  - q: "Can access reviews remove guests automatically?"
    a: "Yes, access reviews can optionally be configured to apply results automatically, so that removals are carried out when the review ends. Because this changes access, set it up on a test group first and check the behaviour on Microsoft Learn before rolling it out widely."
  - q: "Who should review guest access?"
    a: "Reviewers are designated when you create the review. Microsoft documents several reviewer options, for example group owners or specific people; check Microsoft Learn for the current list. Group owners may know why an external person was invited, but the right model depends on your organisation."
  - q: "Do access reviews replace guest access settings?"
    a: "No. Guest access settings control whether and how external people can be added at tenant, team and sensitivity-label level. Access reviews work afterwards: they recur and ask whether existing guests still need access. The two complement each other."
---

Guest accounts are easy to create and easy to forget. An external consultant joins a team for a project, a partner is added to a document library, and months later nobody remembers why those accounts still exist. The access may still be there, and so may the risk that comes with it.

This article looks at how [access reviews](https://www.m365.fm/entity/access-reviews/) in Microsoft Entra can help you keep [guest access](https://www.m365.fm/entity/guest-access/) under control after the invitation has been sent. It covers what access reviews are, how they fit with the guest settings you already have, and how to introduce them without causing damage.

## Guest access and the gap that follows it

[Guest access](https://www.m365.fm/entity/guest-access/) is the ability to add people from outside your organisation to Microsoft 365 groups and Teams as guest objects in Microsoft Entra ID. You control it at several levels: for the whole tenant, for individual teams, and through sensitivity labels. These settings answer the question "who may invite guests, and into what?"

What they do not answer by themselves is the question that comes later: "Does this guest still need to be here?" A guest invited for a three-month project remains in the directory later unless someone acts.

That gap is where access reviews come in. Guest settings are the front door policy. Access reviews are the periodic check on who is still inside.

## What access reviews do

According to Microsoft, [access reviews](https://learn.microsoft.com/en-us/entra/id-governance/access-reviews-overview) are recurring reviews in Microsoft Entra that ask designated reviewers whether a person still needs access to a group, application, access package or privileged role. They can optionally apply removals automatically once the review ends.

A few points matter for guests:

- **Recurring, not one-off.** You can set a review to repeat, so the question is asked on a regular rhythm instead of only when someone remembers.
- **Designated reviewers.** You decide who answers. That is the central design decision, covered in the next section.
- **Scope.** Reviews can target groups, applications, access packages and privileged roles. For guests in Teams and Microsoft 365 groups, the group is the relevant scope; check Microsoft Learn for details.
- **Optional automation.** Results can be applied automatically, or left for an administrator to apply.

Check Microsoft Learn for the current licensing requirements and the exact options available, as these can change and depend on your tenant.

## Choosing who reviews

The most important decision is who answers the question "should this person keep access?" Microsoft documents several reviewer options, and the right one depends on your organisation. Verify the current list on Microsoft Learn.

**Group owners.** Imagine a team site connected to a project group. The owner invited the external designer and knows whether the project is finished. Owners often have the context that central IT lacks. The risk is that owners are busy, or have left the company, and the review goes unanswered.

**Specific people.** A designated person or small group, for example a security or compliance contact, can make consistent decisions across many groups. The trade-off is that they may not know the business reason behind each guest.

**The users themselves.** Microsoft documents self-review as an option in some scenarios, where people confirm whether they still need access. Consider whether self-review fits the sensitivity of the content.

Whichever model you choose, think about what happens when nobody responds. Microsoft documents settings for how unanswered reviews are handled. Read the documentation on this carefully before you decide, because it can determine whether silence leads to access being kept or removed.

## How to introduce reviews safely

Reviews are designed to remove access. Removing access can interrupt work, and it can affect content ownership if a guest was the only person connected to a resource. Treat the rollout like any change that can alter access.

**Test first.** Start with a pilot group or a test tenant. Create a group with a few test guests, run a review against it, and watch what happens at each stage: the notification, the decision, and the result.

**Start without automatic removal.** When you first set up a review, consider leaving the automatic application of results switched off. That lets you see what the review would have changed before it changes anything. Once the results look right, you can enable automatic application for the groups where it makes sense.

**Have a way back.** Before enabling automatic removal on real groups, be sure you have a way back, for example knowing how to re-invite a guest and restore their access to the group or team if a decision turns out to be wrong. Check Microsoft Learn for the current options. Note down which groups a guest belonged to before the review runs, so you can rebuild access if needed.

**Tell people.** Reviewers and guests who receive an unexpected email may ignore it or mistrust it. A short message explaining that reviews are a regular part of how you manage external access may help reviewers and guests recognise the email as legitimate.

A simple pilot might look like this:

1. Pick one low-risk group with a handful of guests.
2. Create a review with group owners as reviewers and automatic application turned off.
3. Run it, collect the answers, and compare them with what you expected.
4. Adjust the settings, then extend to further groups step by step.

## Reviews alongside your other controls

Access reviews work best as one layer among several. Guest settings at tenant, team and sensitivity-label level determine who can be invited and what they can reach. Reviews then keep the resulting population honest over time.

It is also worth remembering what reviews do not show you. A review answers "should this guest keep membership of this group?" It does not, on its own, tell you which sites, libraries or files the guest can reach through other routes, such as direct sharing. If you need that wider picture, look at how sharing is configured in SharePoint and OneDrive and at the reports Microsoft provides. Some organisations also use third-party tools for reporting and clean-up. [Cognillo](https://www.cognillo.com) offers the SharePoint Essentials Toolkit, which is one option among several. Evaluate any such tool against your own requirements, and start with what Microsoft 365 already provides.

For the technical details of access reviews, including prerequisites and configuration, start with the [Microsoft Entra access reviews overview](https://learn.microsoft.com/en-us/entra/id-governance/access-reviews-overview) on Microsoft Learn.

## Practical takeaways

- **Treat guest settings and access reviews as a pair.** Settings control who gets in; reviews check who should still be there.
- **Pick reviewers deliberately.** Group owners often know the context best, but decide what happens if they do not respond.
- **Pilot first.** Use a test group or tenant, and consider running your first reviews without automatic removal.
- **Have a way back.** Know how to re-invite a guest and restore group or team access before you let a review remove anyone.
- **Make it recurring.** A review that runs on a schedule is more useful than a clean-up that happens once.
- **Check Microsoft Learn.** Licensing, options and behaviour can change, so confirm the current details before you build your process.
