---
title: "How to run a validation host pool before changes reach production"
summary: "Run the validation host pool as a routine: a small pool that mirrors production, a weekly comparison with the release notes, a written check after each new agent or stack version, and a rule for what you do when it fails. Learn supplies the setting and the principles; the routine around it is our suggestion."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-validation-environment, avd-host-pool]
keypoints:
  - "Azure Advisor flags a subscription with no validation host pool, and also flags one where too many pools are validation pools: Learn recommends fewer than half. One small pool per kind of production pool is a workable start."
  - "Keep the pool on the default flighting behaviour and keep its hosts running. Scheduled agent updates would hold its non-critical agent updates until the agent is fully flighted to production, and Learn says hosts must be powered on during a maintenance window."
  - "Compare the agent and stack versions on the validation hosts with the Validation row of the release notes every week. The WVDAgentHealthStatus table records AgentVersion, SxSStackVersion and UpgradeState once the Agent Health Status diagnostic category is on."
  - "After each new version run the same short check: host status, update state, a sign-in and a profile load by test users, and the key applications. Write down pass, hold or fail."
  - "A failed check gives you time and evidence, not a way to stop the service update. Collect the CorrelationID, drain affected hosts if needed, and use scheduled agent updates on production pools for non-critical updates."
faq:
  - q: "How many validation host pools do I need?"
    a: "At least one, according to the Azure Advisor recommendation page, which asks for one host pool with a validation environment. The same page recommends that fewer than half of your host pools be validation pools. Our suggestion: one small pool for each kind of production pool you run, for example one pooled and one personal, if the two behave differently."
  - q: "Should the validation host pool be switched off outside working hours?"
    a: "Be careful. Learn's scheduled agent updates page says a session host that is shut down or deallocated during a maintenance window fails the update, and its agent overview describes flights that run over several days. Our reading: if the hosts are off when an update arrives, you may learn about it late, so keep them running at least through the working day."
  - q: "Can a failed validation check stop the update from reaching production?"
    a: "Learn's pages on flighting and scheduled agent updates describe no such block. A validation result tells you about a problem early. For non-critical agent components, scheduled agent updates let you choose maintenance windows on production pools, but Learn says critical agent component updates are installed by force for security. Plan for the failure rather than relying on a block."
---

Treat the validation host pool as a standing routine, not a switch you flip once. Keep a small pool that mirrors production, compare its versions with the release notes every week, run the same short check after each new version, and decide in advance what a failed check means. The setting itself and the evidence on how early updates arrive are in our earlier article on validation host pools; this one covers how to operate the pool day to day.

The facts below come from Microsoft Learn and Nerdio's help pages. Where a step is our suggestion rather than something Learn states, it says so.

## What Learn asks of you

Learn's [validation environment article](https://learn.microsoft.com/en-us/azure/virtual-desktop/create-validation-host-pool) gives the principles: make the validation [host pool](/entity/avd-host-pool/) as similar as possible to your standard host pools, have users connect as often as they connect to the standard pool, include any automated tests you already run, and use it only for testing, not in production. The [validation host pool](/entity/avd-validation-environment/) setting is a property of the pool. In Nerdio Manager for Enterprise, the help page "Host Pool AVD Configuration" lists a "Validation environment" option under the host pool's Properties and then AVD, so the same property can be set there.

The rest of this article turns those principles into steps.

## Step 1: Size and place the pool

Azure Advisor has two recommendations about this. Per Learn's [Advisor recommendations page](https://learn.microsoft.com/en-us/azure/virtual-desktop/azure-advisor-recommendations), "No validation environment enabled" appears when no host pool has the setting on, and "Not enough production (non-validation) environments enabled" appears when you have too many validation pools or no production pool. The page recommends that fewer than half of your host pools be validation pools, and says Advisor updates twice a day.

Our suggestion for a first build:

1. Create a separate pool for validation. Do not switch the flag on a pool that carries real production work, because Learn says validation pools should be used only for testing.
2. Match the production pool type, [pooled or personal](/entity/avd-pooled-host-pool/). If you run both and they behave differently, one small validation pool of each type is easier to reason about than one pool that approximates both.
3. Use the same image source, applications, [FSLogix](/entity/fslogix/) profile setup, policies and network path as the production pool. Two or three session hosts are usually enough to show a regression. That count is our judgement, not a Learn figure.
4. Assign the application group to a dedicated security group of test users, and keep the membership current.

## Step 2: Let the pool receive updates

Keep these settings out of the validation pool's way:

- **Do not enable scheduled agent updates on it.** Learn's [scheduled agent updates page](https://learn.microsoft.com/en-us/azure/virtual-desktop/scheduled-agent-updates) says hosts with the feature receive the agent update after the agent has been fully flighted to production. On a validation pool that removes the early view. The [feature](/entity/avd-scheduled-agent-updates/) fits the production pools.
- **Keep the hosts running during working hours.** The same page says session hosts must be powered on during a maintenance window or the update fails. Learn's [agent overview](https://learn.microsoft.com/en-us/azure/virtual-desktop/agent-overview) says new agent versions go out in five-day flights, and that all VMs in one broker region receive an update within 24 hours of the flight reaching them. It does not describe powered-off VMs, so our reading is to avoid deallocating validation hosts early. If you use autoscale, give this pool a schedule that keeps hosts on through the working day.
- **Turn on the diagnostics you will read.** Learn's [diagnostics article](https://learn.microsoft.com/en-us/azure/virtual-desktop/diagnostics-log-analytics) lists an Agent Health Status category among the diagnostic settings and says data may take a few hours to appear after first set-up. Enable it on the validation and production host pools and send it to a Log Analytics workspace.

## Step 3: Watch versions every week

Two Learn pages publish the release lines: the [agent release notes](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new-agent) and the [SxS Network Stack release notes](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new-sxs). Each has a latest-versions table with a Production and a Validation row. The agent page says validation updates are released more frequently than production ones, and that not all validation versions reach production because updates are repacked under a new version number. Learn states no lead time, so do not plan around one.

A weekly routine, our suggestion:

1. Open both release notes and read any entry marked Validation that is newer than last week.
2. List the versions on your hosts. The [REST reference for session hosts](https://learn.microsoft.com/en-us/rest/api/desktopvirtualization/session-hosts/get?view=rest-desktopvirtualization-2024-04-03) lists `agentVersion`, `sxSStackVersion`, `status`, `updateState` (`Initial`, `Pending`, `Started`, `Succeeded`, `Failed`), `lastUpdateTime` and `updateErrorMessage`. In PowerShell, `Get-AzWvdSessionHost` returns the session host object; piping it to `Format-List *` shows the properties your module version exposes.
3. For a view across pools, use the `WVDAgentHealthStatus` table. The [table reference](https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/wvdagenthealthstatus) lists `AgentVersion`, `SxSStackVersion`, `UpgradeState`, `LastUpgradeTimeStamp`, `UpgradeErrorMsg`, `Status` and `SessionHostName`. This query is our example, not a Learn query:

```kusto
WVDAgentHealthStatus
| where TimeGenerated > ago(7d)
| summarize arg_max(TimeGenerated, AgentVersion, SxSStackVersion, UpgradeState, Status)
    by _ResourceId, SessionHostName
| order by _ResourceId asc, SessionHostName asc
```

The table is associated with the host pool resource type, so `_ResourceId` should identify the pool; confirm that on your own data. A validation host running a newer version than production is the expected picture. Learn says several versions can be in circulation in both lines at once, so a difference alone is not a fault.

4. Set up [Azure Service Health](https://learn.microsoft.com/en-us/azure/virtual-desktop/set-up-service-alerts) alerts. Learn recommends two event types for Azure Virtual Desktop: service issue and health advisory. They cover service-side problems that no version comparison will show.

## Step 4: Run the same check after every new version

When the validation hosts show a new agent or stack version, or a release note describes a change that touches something you use, run one short check. Keep the list identical each time so results can be compared.

| Check | Where to look | Pass looks like |
|---|---|---|
| Host status | Session hosts tab in the Azure portal; Learn's [status and health check page](https://learn.microsoft.com/en-us/azure/virtual-desktop/troubleshoot-statuses-checks) | *Available* on every validation host |
| Update state | `updateState` or `UpgradeState` | `Succeeded`, with no `updateErrorMessage` |
| Health checks | Same page: side-by-side stack listener, metadata service, monitoring agent, App Attach, domain trust | None failed |
| Sign-in | One test user per client type you support | Connection completes |
| Profile | A test user with an existing profile | FSLogix profile loads; host status is not `FSLogixNotHealthy`, a value in the REST status list |
| Applications | The five to ten applications users start first | Each opens and does its main task |
| Errors | `WVDErrors` and `WVDConnections` for the test window | No new error codes, connections reach Completed |

A few notes on reading these results:

- Learn's status page and the REST reference describe *Upgrade Failed* differently. The status page says it does not affect new or existing user sessions, and the REST reference calls the host unavailable. Treat any host in that state as a failed check and test a connection to it.
- The [agent overview](https://learn.microsoft.com/en-us/azure/virtual-desktop/agent-overview) says an Application event labelled ID 3277 in Event Viewer means the agent update did not work. Learn's [agent troubleshooting page](https://learn.microsoft.com/en-us/azure/virtual-desktop/troubleshoot-agent) also lists 3277 with registration and install errors in the description, so read the text of the event, not only the ID.
- Learn's diagnostics article says connection events are logged as Started, Connected and Completed, and that the `ServiceError` column of `WVDErrors` shows whether an admin can fix the issue (`false`) or it needs escalating to Microsoft (`true`). For escalations it asks you to include the CorrelationID.

A check this size takes a test user and an admin about half an hour; that figure is our estimate. Record the date, the versions seen, the result and who ran it.

## Step 5: Decide what a failure means

Write the rule before you need it. A simple version:

- **Pass:** all checks pass. Note the versions and move on. Production will receive its update later.
- **Hold:** a check fails but the cause looks local, such as a host that was off or a test user with a stale profile. Fix the cause and repeat the check within a day.
- **Fail:** the same check fails on a clean host. Collect the CorrelationID from `WVDErrors`, the event text, the versions and the time, and open a support case. Learn's agent troubleshooting page covers the [agent](/entity/avd-agent/) side of this.

Be clear about what the result lets you do. Our reading of the sources: it gives you time, evidence and a chance to warn users. For non-critical agent components, [scheduled agent updates](/entity/avd-scheduled-agent-updates/) on the production pools let you choose when those updates install, and per Learn the update arrives only after full flighting to production. Learn also says critical agent component updates are installed by force for security. If a production host does fail an update, [drain mode](/entity/avd-drain-mode/) stops new sessions on that host while you investigate, and Learn's agent overview says a VM keeps three versions of the agent and of the stack for recovery. Do not delete those older versions by hand: Learn says doing so can leave the VM unable to roll back and therefore unavailable.

## Step 6: Keep the pool honest

A validation pool drifts when production changes and nobody updates it. Add three items to your change process:

1. Every production image update, new application or policy change is applied to the validation pool in the same change.
2. Test users are reviewed each quarter against the people who use production daily.
3. Someone owns the weekly routine and the log. A pool with no owner produces no early warning.

Remember what the pool does not cover. It shows Microsoft's service updates early, not your own images or Windows updates; those need a separate test pool or stage in your image process. If you also monitor with [Azure Virtual Desktop Insights](/entity/avd-insights/), add the validation pool to the same workbook so that its hosts are checked with the same views as production.

## Sources

Retrieved 17 November 2026.

- [Configure a host pool as a validation environment](https://learn.microsoft.com/en-us/azure/virtual-desktop/create-validation-host-pool) (Microsoft Learn)
- [Azure Advisor recommendations for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/azure-advisor-recommendations) (Microsoft Learn)
- [Scheduled Agent Updates](https://learn.microsoft.com/en-us/azure/virtual-desktop/scheduled-agent-updates) (Microsoft Learn)
- [Azure Virtual Desktop agent overview](https://learn.microsoft.com/en-us/azure/virtual-desktop/agent-overview) (Microsoft Learn)
- [What's new in the Azure Virtual Desktop Agent?](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new-agent) (Microsoft Learn)
- [What's new in the Azure Virtual Desktop SxS Network Stack?](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new-sxs) (Microsoft Learn)
- [Session hosts - Get, API version 2024-04-03](https://learn.microsoft.com/en-us/rest/api/desktopvirtualization/session-hosts/get?view=rest-desktopvirtualization-2024-04-03) (Microsoft Learn REST reference)
- [WVDAgentHealthStatus table](https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/wvdagenthealthstatus) (Microsoft Learn, Azure Monitor reference)
- [Use Log Analytics for the diagnostics feature](https://learn.microsoft.com/en-us/azure/virtual-desktop/diagnostics-log-analytics) (Microsoft Learn)
- [Session host statuses and health checks](https://learn.microsoft.com/en-us/azure/virtual-desktop/troubleshoot-statuses-checks) (Microsoft Learn)
- [Troubleshoot the Azure Virtual Desktop agent](https://learn.microsoft.com/en-us/azure/virtual-desktop/troubleshoot-agent) (Microsoft Learn)
- [Set up Azure Service Health alerts for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/set-up-service-alerts) (Microsoft Learn)
- [Host Pool AVD Configuration](https://nmehelp.getnerdio.com/hc/en-us/articles/26124330130445) (Nerdio Manager for Enterprise help)
