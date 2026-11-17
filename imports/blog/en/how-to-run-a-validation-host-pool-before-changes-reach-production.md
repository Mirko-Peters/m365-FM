---
title: "How to run a validation host pool before changes reach production"
summary: "Run the validation host pool as a routine: a small pool that mirrors production, a weekly comparison with the release notes, a written check after each new agent or stack version, and a rule for what you do when it fails. Learn supplies the setting and the principles; the routine around it is our suggestion."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-validation-environment, avd-host-pool]
keypoints:
  - "Azure Advisor flags a subscription with no validation host pool, and also flags one where too many pools are validation pools: Learn recommends fewer than half of your host pools be validation pools, so keep validation pools fewer than production pools. One small validation pool is a workable start."
  - "Keep scheduled agent updates off the validation pool. Learn says hosts with the feature receive the agent update after full flighting to production; our reading is that this removes the early view. Learn's powered-on rule for maintenance windows applies to pools that use the feature. Keeping validation hosts running is our suggestion."
  - "Compare the agent and stack versions on the validation hosts with the Validation row of the release notes every week. The WVDAgentHealthStatus table has AgentVersion, SxSStackVersion and UpgradeState columns; turn on the Agent Health Status diagnostic category and check that the table fills."
  - "After each new version run the same short check: host status, update state, a sign-in and a profile load by test users, and the key applications. Write down pass, hold or fail."
  - "A failed check gives you time and evidence, not a way to stop the service update. Collect the CorrelationID, drain affected hosts if needed, and use scheduled agent updates on production pools for non-critical updates."
faq:
  - q: "How many validation host pools do I need?"
    a: "At least one, according to the Azure Advisor recommendation page, which asks for one host pool with a validation environment. The same page recommends that fewer than half of your host pools be validation pools. Our suggestion: start with one small pool. A second one for another kind of production pool, for example personal next to pooled, only fits under Learn's limit while production pools outnumber validation pools. With one production and one validation pool, validation is exactly half, which is not fewer than half, so weigh the Advisor hint against the value of the test."
  - q: "Should the validation host pool be switched off outside working hours?"
    a: "Learn's validation environment and scheduled agent updates pages say nothing about powering off validation hosts. The scheduled agent updates page says an update fails if the host is shut down or deallocated during a maintenance window, but that applies to pools with the feature enabled, and a validation pool should not have it. Learn's guide to monitoring agent updates says more generally that an unsuccessful update might be because the host was turned off during the update. Per Learn's scheduled agent updates page, without that setting the agent can be updated at any time, so a working-day window is not safe. Our suggestion: do not power validation hosts off, or check the update state after turning them back on."
  - q: "Can a failed validation check stop the update from reaching production?"
    a: "Learn's pages on flighting and scheduled agent updates describe no such block. A validation result tells you about a problem early. For non-critical agent components, scheduled agent updates let you choose maintenance windows on production pools, but Learn says critical agent component updates are installed by force for security. Plan for the failure rather than relying on a block."
---

Treat the validation host pool as a standing routine, not a switch you flip once. Keep a small pool that mirrors production, compare its versions with the release notes every week, run the same short check after each new version, and decide in advance what a failed check means. This article covers how to operate the pool day to day.

The facts below come from Microsoft Learn and Nerdio's help pages. Where a step is our suggestion rather than something Learn states, it says so.

## What Learn asks of you

Learn's [validation environment article](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-validation-environment) gives the principles: make the validation [host pool](/entity/avd-host-pool/) as similar as possible to your standard host pools, have users connect as often as they connect to the standard pool, include any automated tests you already run, and use it only for testing, not in production. The [validation host pool](/entity/avd-validation-environment/) setting is a property of the pool. In Nerdio Manager for Enterprise, the help page "Host Pool AVD Configuration" lists a "Validation environment" option that designates the host pool as a validation host pool. A note there says validation host pools receive service updates at a faster cadence than non-validation host pools.

## Step 1: Size and place the pool

Azure Advisor has two recommendations about this. Per Learn's [Advisor recommendations page](https://learn.microsoft.com/en-us/azure/virtual-desktop/azure-advisor-recommendations), "No validation environment enabled" appears when no host pool has the setting on, and "Not enough production (non-validation) environments enabled" appears when you have too many validation pools or no production pool. The page recommends that fewer than half of your host pools be validation pools. By our arithmetic, one production and one validation pool is exactly half, which is not fewer than half; production pools must outnumber validation pools.

Our suggestion for a first build:

1. Create a separate pool for validation. Do not switch the flag on a pool that carries real production work, because Learn says validation pools should be used only for testing.
2. Match the production pool type, [pooled or personal](/entity/avd-pooled-host-pool/). If you run both and they behave differently, one validation pool of each type is easier to reason about than one pool that approximates both, but it needs enough production pools to stay under the limit above. In a small estate, weigh a known Advisor hint against mirroring only the larger production pool.
3. Use the same image source, applications, [FSLogix](/entity/fslogix/) profile setup, policies and network path as the production pool. Two or three session hosts are usually enough to show a regression (our judgement, not a Learn figure).
4. Assign the application group to a dedicated security group of test users, and keep the membership current.

## Step 2: Let the pool receive updates

Keep these settings out of the validation pool's way:

- **Do not enable scheduled agent updates on it.** Learn's [scheduled agent updates page](https://learn.microsoft.com/en-us/azure/virtual-desktop/scheduled-agent-updates) says hosts with the feature receive the agent update after the agent has been fully flighted to production. Our reading: on a validation pool that removes the early view.
- **Keep the hosts running.** This is our suggestion. Learn's guide to monitoring agent updates says an unsuccessful update might be because the session host was turned off during the update, and to turn it back on. Learn's [agent overview](https://learn.microsoft.com/en-us/azure/virtual-desktop/agent-overview) says agent versions go out in five-day flights, with 24 hours per broker region, and the scheduled agent updates page says that without that setting the agent can be updated at any time. Our reading: a host that is off at the wrong moment can miss an attempt, so avoid schedules, autoscale included, that shut validation hosts down, or check the update state after powering them on.
- **Turn on the diagnostics you will read.** Learn's [diagnostics article](https://learn.microsoft.com/en-us/azure/virtual-desktop/diagnostics-log-analytics) lists an Agent Health Status category among the diagnostic settings and says data may take a few hours to appear after first set-up. Enable it on the validation and production host pools and send it to a Log Analytics workspace. That article does not name the table for this category, but Learn's [guide to monitoring agent updates](https://learn.microsoft.com/en-us/azure/virtual-desktop/agent-updates-diagnostics) queries `WVDAgentHealthStatus` for agent versions and update state. Our reading is that the category fills this table, so check that it fills. Step 4 also reads `WVDErrors` and `WVDConnections`; our reading is that the Errors and Connections categories fill them, so enable those too.

## Step 3: Watch versions every week

Two Learn pages publish the release lines: the [agent release notes](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new-agent) and the [SxS Network Stack release notes](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new-sxs). Each has a latest-versions table with a Production and a Validation row. The agent page says validation updates are released more frequently than production ones, and that not all validation versions reach production because updates are repacked under a new version number. Learn states no lead time, so do not plan around one. The release notes say a rollout might take several weeks to reach all environments.

A weekly routine, our suggestion:

1. Open both release notes. Compare the Validation row of each latest-versions table with the versions on your validation hosts, and read the entries for any version newer than last week's.
2. List the versions on your hosts. The [REST reference for session hosts](https://learn.microsoft.com/en-us/rest/api/desktopvirtualization/session-hosts/get?view=rest-desktopvirtualization-2024-04-03) lists `agentVersion`, `sxSStackVersion`, `status`, `updateState` (`Initial`, `Pending`, `Started`, `Succeeded`, `Failed`), `lastUpdateTime` and `updateErrorMessage`. In PowerShell, `Get-AzWvdSessionHost` returns the session host object; piping it to `Format-List *` shows the properties your module version exposes.
3. For a view across pools, use the `WVDAgentHealthStatus` table. The [table reference](https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/wvdagenthealthstatus) lists `AgentVersion`, `SxSStackVersion`, `UpgradeState`, `LastUpgradeTimeStamp`, `UpgradeErrorMsg`, `Status` and `SessionHostName`. This query is our example, not a Learn query:

```kusto
WVDAgentHealthStatus
| where TimeGenerated > ago(7d)
| summarize arg_max(TimeGenerated, AgentVersion, SxSStackVersion, UpgradeState, Status)
    by _ResourceId, SessionHostName
| order by _ResourceId asc, SessionHostName asc
```

The table is associated with the host pool resource type, so `_ResourceId` should identify the pool; confirm that on your own data. Our reading: a validation host running a newer version than production is the expected picture, because Learn says validation updates are released more frequently. Learn also says several versions can be in circulation in both lines at once, so a difference alone is not a fault.

4. Set up [Azure Service Health](https://learn.microsoft.com/en-us/azure/virtual-desktop/set-up-service-alerts) alerts. Learn recommends the service issue and health advisory event types.

## Step 4: Run the same check after every new version

When the validation hosts show a new agent or stack version, or a release note describes a change that touches something you use, run one short check. Keep the list identical each time.

| Check | Where to look | Pass looks like |
|---|---|---|
| Host status | Session hosts tab in the Azure portal; Learn's [status and health check page](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-status-health-checks) | *Available* on every validation host |
| Update state | `updateState` (REST, PowerShell) or `UpgradeState` (log table) | `updateState` is `Succeeded` with no `updateErrorMessage`; Learn lists no values for `UpgradeState`, so see which values your own data shows |
| Health checks | Same page, for example domain joined, side-by-side stack listener, metadata service, Geneva Monitoring Agent, App Attach, domain trust | None failed |
| Sign-in | One test user per client type you support | The desktop or app opens |
| Profile | A test user with an existing profile | FSLogix profile loads for the test user, with no temporary profile |
| Applications | The five to ten applications users start first | Each opens and does its main task |
| Errors | `WVDErrors` and `WVDConnections` for the test window | No new error codes; connections reach Connected, and Completed once the session is disconnected |

A few notes on reading these results:

- Learn's status page and the REST reference describe *Upgrade Failed* differently. The status page says it does not affect new or existing user sessions, and the REST reference calls the host unavailable. Treat any host in that state as a failed check and test a connection to it.
- The [agent overview](https://learn.microsoft.com/en-us/azure/virtual-desktop/agent-overview) ties an Application event with ID 3277 to a failed agent update, and Learn's [agent troubleshooting page](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-desktop/troubleshoot-agent) lists 3277 with other descriptions, so read the event text, not only the ID.
- Learn's diagnostics article defines Started as the user selecting and connecting to an app or desktop, Connected as the successful connection to the VM, and Completed as the user or server disconnecting the session. It also says that `ServiceError` in `WVDErrors` should be `false` for issues an admin can resolve; if it is `true`, escalate to Microsoft. For escalations it asks you to include the CorrelationID.

Record the date, versions, result and who ran it.

## Step 5: Decide what a failure means

Write the rule before you need it. A simple version:

- **Pass:** all checks pass. Note the versions and move on. Learn says not every validation version reaches production, because updates are repacked under a new version number first.
- **Hold:** a check fails but the cause looks local, such as a host that was off or a test user with a stale profile. Fix the cause and repeat the check within a day.
- **Fail:** the same check fails on a clean host. Collect the CorrelationID from `WVDErrors`, the event text, the versions and the time, and open a support case. The [agent](/entity/avd-agent/) troubleshooting page linked in Step 4 covers causes of a failed agent update.

Our reading of the sources: the result gives you time, evidence and a chance to warn users. For non-critical agent components, [scheduled agent updates](/entity/avd-scheduled-agent-updates/) on the production pools let you choose when those updates install, and per Learn the update arrives only after full flighting to production. Learn also says critical agent component updates are installed by force for security. If a production host does fail an update, [drain mode](/entity/avd-drain-mode/) stops new sessions on that host while you investigate, and the agent overview warns against deleting the older agent and stack versions a VM keeps, because that can leave it unable to roll back and unavailable.

## Step 6: Keep the pool honest

A validation pool drifts when production changes and nobody updates it. Add three items to your change process:

1. Every production image update, new application or policy change is applied to the validation pool in the same change.
2. Test users are reviewed each quarter against the people who use production daily.
3. Someone owns the weekly routine and the log. A pool with no owner produces no early warning.

Remember what the pool does not cover. Learn describes validation host pools as a way to monitor service updates before they reach your standard pools. Our reading: that does not include your own images or Windows updates, which need a separate test pool or stage in your image process. If you use [Azure Virtual Desktop Insights](/entity/avd-insights/), our suggestion is to include the validation pool there.

## Sources

Retrieved 17 November 2026.

- [Configure a host pool as a validation environment](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-validation-environment) (Microsoft Learn)
- [Azure Advisor recommendations for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/azure-advisor-recommendations) (Microsoft Learn)
- [Scheduled Agent Updates](https://learn.microsoft.com/en-us/azure/virtual-desktop/scheduled-agent-updates) (Microsoft Learn)
- [Azure Virtual Desktop agent overview](https://learn.microsoft.com/en-us/azure/virtual-desktop/agent-overview) (Microsoft Learn)
- [What's new in the Azure Virtual Desktop Agent?](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new-agent) (Microsoft Learn)
- [What's new in the Azure Virtual Desktop SxS Network Stack?](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new-sxs) (Microsoft Learn)
- [Get-AzWvdSessionHost](https://learn.microsoft.com/en-us/powershell/module/az.desktopvirtualization/get-azwvdsessionhost) (Microsoft Learn PowerShell reference)
- [Session hosts - Get, API version 2024-04-03](https://learn.microsoft.com/en-us/rest/api/desktopvirtualization/session-hosts/get?view=rest-desktopvirtualization-2024-04-03) (Microsoft Learn REST reference)
- [WVDAgentHealthStatus table](https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/wvdagenthealthstatus) (Microsoft Learn, Azure Monitor reference)
- [Use Log Analytics for the diagnostics feature](https://learn.microsoft.com/en-us/azure/virtual-desktop/diagnostics-log-analytics) (Microsoft Learn)
- [Set up diagnostics for monitoring agent updates](https://learn.microsoft.com/en-us/azure/virtual-desktop/agent-updates-diagnostics) (Microsoft Learn)
- [Session host statuses and health checks](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-status-health-checks) (Microsoft Learn)
- [Troubleshoot the Azure Virtual Desktop agent](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-desktop/troubleshoot-agent) (Microsoft Learn)
- [Set up Azure Service Health alerts for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/set-up-service-alerts) (Microsoft Learn)
- [Host Pool AVD Configuration](https://nmehelp.getnerdio.com/hc/en-us/articles/26124330130445) (Nerdio Manager for Enterprise help)
