---
title: "Power Automate for governance alerts"
summary: "Governance policies only work if someone notices when they are broken. This article shows how Power Automate can turn SharePoint governance rules into alerts, reviews and approvals, and where the limits are."
status: review
publish: false
author: mirko-p
date: 2027-01-02
topics: [power-automate, sharepoint-governance]
faq:
  - q: "Can Power Automate help with SharePoint governance?"
    a: "Yes, in specific areas. Microsoft Learn's intranet governance guidance names Power Automate as one way to automate a review cycle. Flows can send reminders, collect approvals and notify owners. They support governance but do not replace policies, roles or the built-in SharePoint admin tools."
  - q: "Should a governance alert flow run on a production site right away?"
    a: "No. Build and test the flow on a pilot site or in a test tenant first. Alerts that notify people are low risk, but flows that change permissions, delete content or modify settings can cause damage. Always keep a backup or a way back before enabling anything like that."
  - q: "Who should own governance alerts?"
    a: "Microsoft Learn says the business is responsible for governance, not IT alone. A governance team with business and IT members should define who receives alerts and what they must do. Defining a primary and a secondary contact per site gives alerts a clear recipient."
---

A governance policy on paper does not change behaviour by itself. Someone has to notice when a site has no owner, when a review is due, or when a rule is not followed. In many organizations that "someone" is nobody in particular, so the checks do not happen.

[Power Automate](https://www.m365.fm/entity/power-automate/) can help close that gap. It connects apps and services, and cloud flows react to triggers such as a new SharePoint item or an email. This article looks at how that can support [SharePoint governance](https://www.m365.fm/entity/sharepoint-governance/) through alerts and review reminders, and where the limits are.

## Start with the governance, not the flow

Alerts are only useful if they point to a rule and a responsible person. Microsoft defines governance in general as "the set of policies, roles, responsibilities, and processes that control how an organization's business divisions and IT teams work together to achieve its goals." That sentence comes from the SharePoint Server documentation, which does not cover SharePoint in Microsoft 365, but the idea carries over.

For SharePoint in Microsoft 365, the [Microsoft Learn guide on intranet governance](https://learn.microsoft.com/en-us/sharepoint/intranet-governance) makes several points that matter before you build anything:

- Start governance planning early and review it regularly.
- A governance team should include business and IT and stay in place after launch.
- The business is responsible, not IT alone.
- Policies are requirements; guidelines are recommendations.
- Topics include external sharing, default sharing links and metadata.
- Ownership of sites should be defined, for example with a primary and a secondary contact per site.

If these points are not settled, a flow will only send messages that nobody knows how to act on. Decide first which rules are requirements, who owns each site, and who is the fallback when the owner does not respond.

## Where alerts fit

The same Microsoft guidance says that policies work best when site owners do not have to think about them, for example through site designs. One approach is to build the rule into how sites are created.

Alerts can be a complement. They cover what cannot be built in, such as recurring checks that need a human decision. The guidance explicitly says that a review cycle can be automated, for example with Power Automate. That is the use documented in the Microsoft guidance.

Imagine a team site that was created for a project. A year later the project is over, but the site still exists. A governance rule might say that every site owner confirms twice a year that the site is still needed and that its sharing settings are still appropriate. A scheduled flow can remind the owner, record the answer and notify the governance team if there is none.

Other situations where a notification can make sense, depending on your own policies:

- A site has no second contact.
- A review confirmation is overdue.
- A site request has been waiting for approval for longer than your policy allows.
- A site owner has answered that the site is no longer needed.

None of these require the flow to change anything. They only tell a person that something needs a decision.

## Building a review reminder flow

A simple pattern uses a SharePoint list as the register of sites. Each item holds the site address, the primary and secondary contact, the date of the last review and a status column. How you fill and maintain that list is your decision; it could be maintained by hand or populated from your site request process.

A flow can then work like this:

1. A scheduled trigger starts the flow at the interval your policy defines.
2. The flow reads items from the register where the last review is older than the policy allows.
3. For each item it sends the primary contact a message or an approval request: "Please confirm that this site is still needed and that its sharing settings are correct."
4. If there is no answer within a defined time, it notifies the secondary contact.
5. If there is still no answer, it notifies the governance team.
6. The answer and the date are written back to the register.

Power Automate includes approval and notification capabilities, and the available options and licensing depend on your tenant. Check the [Power Automate documentation on Microsoft Learn](https://learn.microsoft.com/power-automate/) for the connectors and limits that apply to you.

Keep the message short and specific. A reminder that says "please review your site" gets ignored. One that names the site, the question, the deadline and what happens next is easier to act on.

## Keep alerting flows low risk

There is a big difference between a flow that tells someone about a problem and a flow that fixes it. Notifications are generally low risk: a wrong message is annoying, but it does not change data or access. Flows that remove permissions, delete content, change sharing settings or archive sites can lose data or lock people out.

If you ever extend a governance flow beyond notifications, treat it as a risky admin action:

- **Test first.** Build and run the flow on a pilot site or in a test tenant, not on production sites.
- **Have a way back.** Make sure you have a backup or a documented way to restore the previous state before the flow can change anything.
- **Start small.** Limit the scope to a few sites and watch what happens before widening it.
- **Keep a human in the loop.** An approval step before any change gives owners and the governance team a chance to stop a mistake.

Also keep in mind that flows depend on the account or connection they run under. If that account loses access or leaves the organization, the flow may stop working; see Microsoft Learn for how connections and flow ownership are handled. Agree who owns each governance flow, document what it does, and check that it still runs.

## Know what flows do not replace

A reminder flow is custom work that you build and maintain. It is not a substitute for the controls Microsoft provides. For SharePoint in Microsoft 365, Microsoft offers [SharePoint Advanced Management](https://learn.microsoft.com/en-us/sharepoint/advanced-management), with tools in three areas: content sprawl, the content lifecycle and oversharing. Check the documentation for what is included in your licensing and which tasks it can handle natively before you build your own solution.

Third-party tools are another option for some organizations. Whether one is needed depends on your requirements, your licensing and the effort you want to spend on building and maintaining flows yourself.

Whatever mix you choose, the questions stay the same: what is the rule, who is responsible, how will they find out, and what happens if they do nothing?

## Practical takeaways

- Define policies, roles and responsibilities first. Alerts without an owner go nowhere.
- Assign a primary and a secondary contact per site, as the Microsoft Learn guidance suggests, and store them somewhere a flow can read.
- Build rules into site creation where possible, for example through site designs, and use flows for recurring checks that need a human decision.
- Start with notification-only flows: reminders, approvals and escalations.
- Make every message specific: site, question, deadline, next step.
- Test every flow on a pilot site or test tenant first, and have a way back before any flow is allowed to change permissions, content or settings.
- Assign an owner to each governance flow and review the flows regularly.
- Check Microsoft Learn for current native options, licensing and connector limits before you build.
