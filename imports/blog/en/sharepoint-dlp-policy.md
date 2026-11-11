---
title: "Your first DLP policy for SharePoint: start in simulation mode"
summary: "Build your first SharePoint DLP policy in Microsoft Purview: pick locations and sensitive information types, run simulation mode, then tune and enforce it."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [dlp, dlp-simulation-mode, sensitive-information-types, sharepoint]
keypoints:
  - "Simulation mode shows which items a data loss prevention policy would match, without enforcing any action, so you see the impact before users do."
  - "A first SharePoint DLP policy needs a clear goal: one kind of sensitive data, one risky behavior, and a limited set of actions."
  - "Microsoft recommends three phases: simulation without policy tips, simulation with policy tips for a pilot group, and then full enforcement."
  - "Simulation results are kept for 30 days, and for SharePoint and OneDrive the Items for review tab shows up to 100 matches per site for each rule."
  - "Tuning is the main job: review matches, exclude known false positives, narrow the scope and only then switch the policy on."
faq:
  - q: "What is DLP simulation mode in Microsoft Purview?"
    a: "Simulation mode lets you see the impact of a data loss prevention policy in your production environment without enforcing it. You see all the items the policy would match if it were enforced, and no policy actions are applied. Events are audited, so you can review matches in the policy's simulation overview before you turn the policy on."
  - q: "How long should I run a DLP policy in simulation mode?"
    a: "Microsoft gives no fixed duration. Run it long enough to see typical business activity and tune the rule until the matches look right. Note that simulation results are saved for 30 days, and only the most recent 30-day period is displayed. You can also set the policy to turn on automatically if it is not edited within fifteen days."
  - q: "Which roles do I need to create a DLP policy?"
    a: "Microsoft lists the Compliance administrator, Compliance data administrator, Information Protection, Information Protection Admin and Security administrator role groups for creating and deploying DLP policies. For simulation mode, the account must be in the Information Protection admin role. Check the current permissions section of the Learn article before you assign roles."
---

A SharePoint DLP policy is a Microsoft Purview rule that finds sensitive data in [SharePoint](https://www.m365.fm/entity/sharepoint/) sites and OneDrive accounts and, once you enforce it, acts on it. It is one of the data loss prevention policies you can create to protect sensitive data. For a first policy, start in [simulation mode](https://www.m365.fm/entity/dlp-simulation-mode/), which shows what the policy would match without blocking anyone. This guide is for security admins who need a safe first procedure. It covers how to scope the policy, which options Microsoft offers for simulation and the steps from first test to enforcement.

## What a SharePoint DLP policy does

[Data loss prevention](https://www.m365.fm/entity/dlp/) (DLP) policies watch for sensitive items and apply actions when a rule matches. In Microsoft's planning guidance, [Plan for data loss prevention](https://learn.microsoft.com/en-us/purview/dlp-overview-plan-for-dlp), the locations include Exchange email, SharePoint sites, OneDrive accounts, Teams chat and channel messages and devices. This article covers the SharePoint Online and OneDrive locations. Other locations, such as Exchange Online and Microsoft Teams, can be part of a policy too, but a first policy is easier to read when it covers one workload.

A rule has conditions and actions. A typical condition looks for a [sensitive information type](https://www.m365.fm/entity/sensitive-information-types/), such as credit card numbers or social security numbers, or for a sensitivity label such as Confidential. A typical action is to audit the event, notify the user, send an alert to admins, or block access for people outside the organization.

Microsoft's page on [creating a policy to stop sharing with external users](https://learn.microsoft.com/en-us/purview/dlp-create-policy-spo-odb-external) uses exactly this pattern as an example. Its rule combines "content is shared from Microsoft 365 with people outside my organization" with a condition that content contains the Confidential label, and its action blocks only people outside the organization.

## Why start in simulation mode

The first DLP policy is risky because a mistake hits real work. A rule that blocks the wrong files stops a sales contract or a payroll export. Microsoft says [DLP simulation mode](https://learn.microsoft.com/en-us/purview/dlp-simulation-mode-get-started) lets you see the impact of a policy on your production environment without enforcement and all the items the policy would match if it were enforced.

The deployment guidance describes a gradual path. The create-and-deploy article advises that you set the policy to Keep it off while you build it. It then recommends simulation mode, tuning, simulation with policy tips for a pilot group, and finally full enforcement. Microsoft's planning page adds that in simulation mode, policies do not affect the productivity of people at work.

## Which sensitive information types to start with

Pick the data first, then the type. Microsoft's planning guidance groups sensitive items into four DLP categories: Financial, Medical and health information, Privacy and Custom. Its example template, U.K. Financial Data, includes sensitive information types such as Credit Card Number, EU Debit Card Number and SWIFT Code. The external sharing example on Learn uses U.S. Social Security Number and Credit Card Number, plus a sensitivity label.

For a first policy, choose one type that your business knows well, such as credit card numbers. Your security team and compliance officer can then judge the matches. The planning page also reminds you that zero leakage may cost the business too much, so audit-only mode or exceptions can be the right answer for some content. If no built-in type fits, plan custom types for a later policy.

## Step by step: your first policy

Use this order for a first SharePoint DLP policy. Substitute your own labels and types.

1. **Agree on the goal and the permission model.** Check that your account has one of the roles Microsoft lists for creating and deploying DLP policies, such as Compliance administrator or Security administrator. Microsoft says IT cannot build a broad plan alone, so name the data (for example, payment card numbers) and the behavior (for example, sharing with people outside).
2. **Create a policy.** In the Microsoft Purview portal, go to Data loss prevention, then Policies, then Create policy. Choose a template or a custom policy and a name. Microsoft notes that you cannot rename a policy later.
3. **Choose the locations.** Select SharePoint sites and OneDrive accounts and deselect the others for a first policy. By default, all instances of a location are in scope. You can include or exclude sites or accounts.
4. **Set conditions.** Pick the sensitive information types or labels that match your goal. Start with one.
5. **Set actions and policy tips.** For the first test, audit only is the gentlest choice. Microsoft describes it as letting the activity occur, so no business process is affected. Block with override and Block are stronger. A policy tip is a short message that you configure for end users. In the portal the option reads Notify users in Office 365 services with a policy tip. It is a way to teach people about data protection rules before you enforce them.
6. **Turn on notifications and alerts as needed.** Add the security team to the alert emails.
7. **Pick the state.** Select Run the policy in simulation mode. Choose Keep it off if you want a final review first, or Turn it on right away to start the simulation.
8. **Review the results.** Open the policy, choose View simulation, and read the Simulation overview, Items for review and Alerts tabs.

## How to read and tune simulation results

Matches are only useful if you judge them. For SharePoint and OneDrive, Microsoft says the policy scans content on upload and also scans existing content. The status shows In progress while the scan runs.

Keep the limits in mind. Simulation results are saved for 30 days, and only the most recent 30 days are shown. For SharePoint and OneDrive, Items for review shows up to 100 matched items per site for each policy rule, so it may not list every match. Simulation events also show up in activity explorer, where you can filter by policy mode.

Tuning is the main work. Ask these questions for each batch of matches:

- Is the match real sensitive data, or a test file, a template or a public document?
- Is one site responsible for most of the false positives? If yes, consider an exclusion or a separate rule.
- Is the condition too broad? Narrow it, for example to a specific type or to external sharing only.
- Would the action disturb a legitimate process? If yes, choose a softer action or add an exception.

## Example: reading a month of matches

This example uses invented numbers. A security admin runs a policy for payment card numbers on all SharePoint sites in simulation mode. After 30 days, the overview shows 620 matched items.

- 410 matches come from one site that holds training material with sample card numbers.
- 150 matches are real files in the finance and sales sites.
- 60 matches are in mixed locations that need a closer look.

The admin excludes the training site, which removes 410 of 620 matches, or about two thirds. The rest are 210 items, of which 150 are clearly valid. The admin then switches to simulation with policy tips for the finance pilot group and asks them to report mistakes. The 60 uncertain items are reviewed by site owners over two weeks. Only then does the admin plan enforcement with the Block action for people outside the organization.

Microsoft's rollout guidance suggests the same order: tune on behavior data, pilot with policy tips, gather feedback, then enforce and monitor alerts and activity explorer.

## A related setting to know

Microsoft documents a tenant setting called sensitive by default. When enabled with PowerShell, it blocks guest access to new files until they have been scanned for sensitive content and the DLP policies with content-based conditions have been applied. Microsoft says the setting can take up to 60 minutes to take effect and applies to newly added files, not to changed existing files. Microsoft Learn also documents a DLP location for Microsoft 365 Copilot, which a first policy does not need. Consider the sensitive by default setting only after your first DLP policies work, because anything not checked by a DLP policy is blocked from external access once it is on.

## Common mistakes

- **Starting with Block.** Use simulation first, then audit, then stronger actions.
- **Making the scope too wide too early.** A broad scope is fine in simulation, but narrow it to a pilot group before you show policy tips.
- **Ignoring the 30-day window.** Export or note the findings before older results drop out of view.
- **Skipping the business owners.** Without them you cannot tell real risk from normal work, and a policy to protect sensitive data needs their knowledge of how files are shared.
- **Forgetting the enforcement step.** A policy left in simulation protects nothing. You can set it to turn on automatically if it is not edited within fifteen days, or schedule a review.

## How software can help

Start with the Purview portal: simulation overview, activity explorer and alerts give you what you need for a first policy. PowerShell helps with tenant settings such as sensitive by default. A simple tracking sheet with policy name, scope, state, reviewer and next review date keeps the rollout visible. No extra product is needed to complete the steps in this article.

## Next step

Choose one type of sensitive data and write down the single behavior you want your SharePoint DLP policy to stop. Then create the policy, set it to simulation mode and plan a review of the matches in two weeks.
