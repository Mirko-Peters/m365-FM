---
title: "How to Use Sentinel Automation Rules to Triage and Assign Incidents"
summary: "Use Microsoft Sentinel automation rules to triage and assign incidents: triggers, conditions, actions, rule order, expiration, playbook permissions, where to create rules and the March 31, 2027 Defender portal change."
status: review
publish: false
author: mirko-p
date: 2027-01-07
topics: [microsoft-sentinel]
keypoints:
  - "Automation rules run on incident created, incident updated or alert created. Learn prefers incident triggers for most uses."
  - "Actions include add task, change status, change severity, assign owner, add tag and run playbook, and they run in the listed order."
  - "Rules in each trigger type run sequentially by order number. Create rules run before update rules, and duplicate order numbers run in random order."
  - "Playbooks run under a Microsoft Sentinel service account that needs permissions on the playbook's resource group. Granting them needs Owner."
  - "Learn says that after March 31, 2027 Microsoft Sentinel will be available only in the Defender portal."
faq:
  - q: "What triggers an automation rule?"
    a: "Per Microsoft Learn: when an incident is created, when an incident is updated, or when an alert is created. The trigger table lists alerts from Scheduled or NRT analytics rules, and a note on the page adds Microsoft security analytics rules. Simple Flows has its own case triggers in preview."
  - q: "How do I triage and assign with a rule?"
    a: "Learn's examples are to change new incidents from New to Active and assign an owner, add a task checklist for analysts, and assign incidents about a specific platform to the analyst who specializes in it."
  - q: "In what order do rules run?"
    a: "Each trigger type has its own queue and rules run one after another by order number. All applicable create rules run before update rules. Rules with the same order number run in random order."
  - q: "What permissions does running a playbook need?"
    a: "Playbooks run under a special Microsoft Sentinel service account that needs explicit permissions on the playbook's resource group. Granting those through the Manage playbook permissions link requires Owner on the resource groups."
  - q: "What changes after March 31, 2027?"
    a: "Learn says Microsoft Sentinel will be available only in the Defender portal after that date, and Azure portal customers will be redirected."
---

Automation rules take over the repetitive start of incident handling. A rule can move a new incident from New to Active, assign an owner, add a checklist and start a playbook, so analysts see work that is already sorted. This guide follows the Microsoft Learn page Automate threat response in Microsoft Sentinel with automation rules.

## Portal note

Automation rules apply in both the Defender portal and the Azure portal. Learn says that after March 31, 2027, Microsoft Sentinel will be available only in the Defender portal, and Azure portal customers will be redirected. It advises planning the transition now.

## Triggers

- **When incident is created.** In Defender portal workspaces, this is a new incident in the Defender portal. In workspaces not onboarded there, it is an incident created by an analytics rule, ingested from Microsoft Defender XDR or created manually.
- **When incident is updated.** For example a status change, a new owner, a severity change, added alerts, or added comments, tags or tactics.
- **When alert is created.** The trigger table names alerts from Scheduled or NRT analytics rules. A note on the page says alert-triggered automation is available only for alerts from Scheduled, NRT and Microsoft security analytics rules.
- **Simple Flows (preview, Defender-onboarded workspaces).** Case created and case updated triggers.

Learn prefers incident triggers for most cases. Alert triggers are mainly for alerts from analytics rules that have incident creation disabled. Alert-triggered automation for Defender XDR alerts is not available in the Defender portal, and the page points to the Enhanced Alert Trigger.

## Conditions

- Create-trigger operators compare current state: equals, contains, starts with, ends with, and their negations.
- Update triggers add an Updated by condition and state-change options such as changed, changed from or changed to a value. The Updated by values depend on onboarding. Onboarded workspaces: application, user, AIR, alert grouping, playbook, automation rule or other. Workspaces not onboarded: application, Microsoft Sentinel user, alert grouping done by analytics rules, playbook, automation rule or Microsoft Defender XDR.
- For tags, any-individual-tag operators are true if at least one tag matches. Collection-of-all-tags operators are true only if the whole collection matches. Learn's example: with tags 2024 and 2023, Tag does not contain 2024 is true under any-individual and false under the collection.
- For alert triggers, the only condition is the set of analytics rules.
- Actions run only if all conditions are met, and conditions use the state at the moment the rule runs, so earlier rules' changes count.

## Actions

- Add task, which gives analysts a checklist for triage, investigation and remediation.
- Change status. When you change to closed, you specify the closing reason and add a comment.
- Change severity.
- Assign owner.
- Add tag.
- Run playbook. Incident-trigger rules run incident-trigger playbooks, and alert-trigger rules run alert-trigger playbooks. Standard and Consumption Logic Apps are supported.

Actions run in the order listed in the rule.

## Triage and assignment examples from the page

- Triage new incidents by changing status from New to Active and assigning an owner.
- If an analyst specializes in a platform, assign incidents about that platform to them automatically.
- Escalate by assigning a new owner through an update-trigger rule.
- Suppress known benign incidents, such as penetration tests, with a time-limited rule that closes and tags them.

## Order and expiration

- Each trigger type has its own queue. Rules run one after another, never in parallel.
- All applicable create rules run before update rules.
- Rules created in the Azure portal get the next order number. Rules created through CLI or API need numbers set manually.
- Duplicate order numbers are not blocked, and those rules run in random order.
- A rule is disabled after its expiration date.
- Learn's order example: if rule 1 lowers severity from Medium to Low, rule 2 that needs Medium or higher does not run on that incident.

Playbook waits: if a playbook finishes in under a second, the rule continues right away. Under two minutes, it continues up to two minutes after the start, and no more than 10 seconds after completion. Over two minutes, it continues after two minutes regardless.

## Permissions

Playbooks run under a special Microsoft Sentinel service account, not the user's. That account needs explicit permissions on the playbook's resource group. Once granted, any automation rule can run any playbook in that group. Granting permissions through the **Manage playbook permissions** link needs **Owner** on those resource groups. Multitenant setups have additional rules: permissions for Sentinel to run a playbook must be defined in the tenant where the playbook resides. In one managed service provider scenario (a rule created in the customer workspace while signed in to the service provider tenant, running a playbook in the customer tenant), permissions are needed in both tenants, and the service provider tenant needs an extra Azure Lighthouse delegation to the Azure Security Insights app with the Microsoft Sentinel Automation Contributor role.

## Where to create rules

- The **Automation** page, for central management, reordering and enabling.
- The **Automated response** tab of the analytics rule wizard, for rules scoped to that rule.
- The **Incidents** page, which pre-fills a rule from an incident and defaults to a close action with a suggested expiration.
- Rules can be exported and imported as ARM or JSON files for CI/CD.

## What the page does not say

A maximum number of rules, conditions, actions or tasks, rate limits, what happens when a playbook fails, and the entity property list for conditions. The page says changes within 5-10 minutes after Defender onboarding are reduced to the latest update, which is a range.

## A triage design

This design is my advice, built on the examples.

1. Create rule: set status to Active, add the triage task checklist.
2. Create rule: assign incidents about a specialized platform to the matching analyst.
3. Update rule: escalate by assigning a new owner when severity rises.
4. Use expiring suppression rules for planned testing.
5. Check order numbers so that severity changes do not skip later rules.

## Typical mistakes (my advice)

- Choosing an alert trigger when an incident trigger fits.
- Duplicate order numbers that make behavior unpredictable.
- Forgetting playbook permissions on the resource group.
- Planning only for the Azure portal despite the March 31, 2027 change.

## Related

- [Microsoft Sentinel](https://www.m365.fm/entity/microsoft-sentinel/)
- [Azure Logic Apps](https://www.m365.fm/entity/azure-logic-apps/)
- [Microsoft Defender](https://www.m365.fm/entity/defender/)

## Sources

- [Automate threat response in Microsoft Sentinel with automation rules (Microsoft Learn)](https://learn.microsoft.com/azure/sentinel/automate-incident-handling-with-automation-rules)
