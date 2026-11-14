---
title: "Debug Microsoft Sentinel Playbooks and Automation Rules That Fail in Logic Apps"
summary: "Find out why a Sentinel playbook did not run or failed: enable health monitoring, read SentinelHealth errors, fix permissions and connections, and add Logic Apps diagnostics to see inside a run."
status: review
publish: false
author: mirko-p
date: 2026-12-11
topics: [microsoft-sentinel, azure-logic-apps]
keypoints:
  - "Two places hold the evidence: the SentinelHealth table (did the rule or trigger work) and Logic Apps diagnostics in AzureDiagnostics (what happened inside the run)."
  - "A Playbook was triggered status of Success does not say the playbook finished or what its actions returned. Query Logic Apps diagnostics for that."
  - "Many listed trigger failures are permission problems. Sentinel needs the Microsoft Sentinel Automation Contributor role on the playbook's resource group."
  - "Write actions such as updating an incident need Microsoft Sentinel Responder or Contributor on the connection identity. Reader only covers triggers and read actions."
  - "After March 31, 2027, Microsoft Sentinel will be available only in the Microsoft Defender portal. Plan the move."
faq:
  - q: "How do I see whether an automation rule ran a playbook?"
    a: "Turn on Microsoft Sentinel health monitoring, then query the SentinelHealth table for OperationName Automation rule run. Learn says these events include the playbooks the rule called, while Playbook was triggered is logged when a playbook is triggered on an incident manually from the portal or through the API. Learn also says the table is created at the first success or failure event for your automation rules and playbooks."
  - q: "SentinelHealth says Success but the playbook did nothing. Why?"
    a: "Learn states that Success for Playbook was triggered only means it was triggered. It does not indicate when the playbook started or ended, the results of its actions or its final result. Enable Logic Apps diagnostics to the Sentinel workspace and query AzureDiagnostics."
  - q: "What does Could not trigger playbook with missing permissions mean?"
    a: "The health page lists several variants. Edit the automation rule, reselect the playbook and save, and grant Sentinel permission to run playbooks. The playbooks page adds that the service account needs the Microsoft Sentinel Automation Contributor role on the resource group that contains the playbook, and you need Owner or User Access Administrator to grant it."
  - q: "Which roles does the playbook connection need?"
    a: "Learn's table says Microsoft Sentinel Reader allows triggers and read actions, while Microsoft Sentinel Responder or Contributor also allows write actions such as updating incidents or adding comments. Assign them to a managed identity, service principal or user."
  - q: "What if the failure is Invalid credentials in connection?"
    a: "Learn says to check the connection's credentials under API connections in the Azure portal. You can open the connection resource and select Edit API connection to change the authorization."
---

Debugging a Sentinel playbook means answering two separate questions. Did Sentinel start it? That is in the **SentinelHealth** table. What happened inside it? That is in Logic Apps diagnostics in **AzureDiagnostics**. The error table on the health page lists permissions, a disabled or moved playbook and an unsupported trigger type among the causes. Learn does not rank them by frequency.

One planning note from the Learn playbooks page: after March 31, 2027, Microsoft Sentinel will be available only in the Microsoft Defender portal, so teams still in the Azure portal should plan the transition and recheck where they manage automation.

## Step 1: Turn on health and diagnostics

1. Enable the Microsoft Sentinel health feature for the workspace. The SentinelHealth table is created at the first success or failure event for your automation rules and playbooks.
2. For each playbook, enable diagnostics with **Send to Log Analytics workspace** and choose your Sentinel workspace. The events `{Action name} started`, `{Action name} ended` and workflow started and ended are then ingested into AzureDiagnostics.

The **Automation health** workbook visualizes both sources, including per-run action details when playbook-level diagnostics are on.

## Step 2: Query SentinelHealth

```kusto
SentinelHealth
| where OperationName == "Automation rule run"
```

```kusto
SentinelHealth
| where OperationName == "Playbook was triggered"
```

Learn says Automation rule run events include the playbooks the rule called. Playbook was triggered events are logged when a playbook is triggered on an incident manually from the portal or through the API. Statuses per Learn:

- **Automation rule run**: Success (all actions triggered), Partial success (at least one failed), Failure (no action ran).
- **Playbook was triggered**: Success means it was triggered, nothing more. Failure means it could not be triggered.

## Step 3: Match the error to a fix

| Error ("Could not trigger playbook") | Fix from Learn |
|---|---|
| Playbook not found or Sentinel missing permissions | Edit the rule, reselect the playbook and save. Verify Sentinel's permission |
| Unsupported trigger type | Start the playbook with the Microsoft Sentinel Incident or Alert trigger |
| Subscription disabled and read-only | Re-enable the subscription |
| Playbook disabled | Enable in **Automation** > **Active Playbooks** or on the Logic Apps resource page |
| Invalid template definition | Fix in the Logic Apps designer and save |
| Access control restricts Sentinel | Remove the IP-based restriction that blocks Sentinel |
| Not migrated to the new permissions model | Grant Sentinel permission, then resave the rule |
| Workflow throttling | Increase `maximumWaitingRuns` in the trigger concurrency configuration |
| Managed identity missing configuration or network restriction | Confirm the identity's permissions and that no network restriction blocks Sentinel |
| Subscription or resource group locked | Remove the lock |
| Caller missing playbook-triggering permissions | The user needs Logic App Contributor on the playbook, and Sentinel needs permission too |
| Invalid credentials in connection | Check the connection under API connections |

Other automation rule errors include incident or alert not found, an incident that already holds the maximum number of tasks, and throttling on property changes.

## Step 4: Fix permissions properly

Sentinel uses a service account to run playbooks on incidents, including manual runs. It needs **Microsoft Sentinel Automation Contributor** on the resource group of the playbook. You need **Owner** or **User access administrator** to grant it, and **Logic App Contributor** on the resource group to run playbooks. By default a playbook works only within its own subscription unless you grant permissions on its resource group.

| Role | Purpose |
|---|---|
| Microsoft Sentinel Contributor | Attach a playbook to an analytics or automation rule |
| Microsoft Sentinel Responder | Access an incident to run a playbook manually, but cannot run it |
| Microsoft Sentinel Playbook Operator | Run a playbook manually |
| Microsoft Sentinel Automation Contributor | Allow automation rules to run playbooks |

For the playbook's own Sentinel connection, Learn lists three identity types: managed identity (preview at the time of the page), service principal (recommended over a user) and Entra user. Reader covers triggers and read actions, and Responder or Contributor covers write actions such as updating incidents or adding comments. Each new authentication creates an API connection resource in the playbook's resource group, which you can edit with **Edit API connection**.

## Step 5: Look inside the run

Correlate rule runs with playbook runs using the query from Learn, which expands `ExtendedProperties.TriggeredPlaybooks`, takes the `RunId` and joins to AzureDiagnostics rows where `OperationName == "Microsoft.Logic/workflows/workflowRunCompleted"` on `resource_runId_s`. The playbook status is in `status_s` and its name in `resource_workflowName_s`. Then, as my own next step, open the run in Logic Apps run history to see the failing action. The pages I read do not list Logic Apps action-level errors, so use the Logic Apps documentation for those.

## Typical mistakes (my own list, derived from the pages above)

- Reading Success in SentinelHealth as a successful playbook.
- Enabling diagnostics on the workspace but not on each playbook.
- Granting roles on the playbook instead of the resource group for the Sentinel service account.
- Using a playbook with a trigger other than the Sentinel incident or alert trigger in an automation rule.
- Leaving a playbook disabled after testing.

## What the pages do not say

The authentication page documents no common authentication errors. Some errors in the health table have no listed action, such as throttling on property changes and an invalid playbook ARM ID.

## Related

- [Microsoft Sentinel](https://www.m365.fm/entity/microsoft-sentinel/)
- [Azure Logic Apps](https://www.m365.fm/entity/azure-logic-apps/)

## Sources

- [Monitor the health of automation rules and playbooks](https://learn.microsoft.com/en-us/azure/sentinel/monitor-automation-health)
- [Automate threat response with playbooks in Microsoft Sentinel](https://learn.microsoft.com/en-us/azure/sentinel/automation/automate-responses-with-playbooks)
- [Authenticate playbooks to Microsoft Sentinel](https://learn.microsoft.com/en-us/azure/sentinel/automation/authenticate-playbooks-to-sentinel)
