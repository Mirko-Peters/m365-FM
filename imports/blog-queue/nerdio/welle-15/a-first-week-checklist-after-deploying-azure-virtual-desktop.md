---
title: "A first-week checklist after deploying Azure Virtual Desktop"
summary: "Once a host pool is deployed, spend the first week on five things in order: session host health and network access, a profile test, power and scaling settings, monitoring data, and cost guardrails. Each step below names where to look and what a pass looks like."
status: review
publish: false
author: mirko-p
date: 2026-11-18
render: v2
topics: [azure-virtual-desktop]
keypoints:
  - "Day 1: check that every powered-on session host shows Available and run the Agent URL Tool on session hosts. The tool does not verify wildcard entries, so allow those first."
  - "Day 2: sign in as a standard test user, run frx list-redirects and look for the user's VHDX in the VHDLocations folder. On AD-integrated SMB shares, check the Kerberos RC4 to AES-SHA1 notice."
  - "Day 3: check prerequisites first. Autoscaling needs the Power On Off Contributor role (and a custom maximum session limit for pooled pools); Start VM on Connect needs Power On Contributor."
  - "Day 4: Insights needs diagnostic settings and session host data collection. If items do not display, run Check Configuration to see which counters and event logs are missing."
  - "Day 5: create a budget. Learn says budgets send notifications but do not stop resources, and that they are evaluated every 24 hours."
faq:
  - q: "What does the status Needs Assistance mean for a session host?"
    a: "Learn says the session host failed one or more non-fatal health checks: the Geneva Monitoring Agent, the Azure Instance Metadata Service or the URL health check. Users can still connect and new sessions are still load balanced to the host, but the experience may degrade. Open the host on the Session hosts tab to see which check failed."
  - q: "Do I need to open inbound ports for Azure Virtual Desktop?"
    a: "Learn says all listed entries are outbound and you do not need to open inbound ports. It also says Microsoft does not support deployments where the listed FQDNs and endpoints are blocked, and that traffic to the Azure fabric addresses 169.254.169.254 and 168.63.129.16 must not be intercepted, proxied or redirected."
  - q: "Does an Azure budget stop session hosts when the limit is reached?"
    a: "No. Learn says notifications are triggered when thresholds are exceeded, but resources are not affected and consumption is not stopped. To automate a response, a budget for a subscription or resource group scope can call an action group."
---

A new Azure Virtual Desktop deployment can be checked in the first week in this order (our suggestion): session host health and network access, profile behaviour, power and scaling settings, monitoring data, and cost guardrails. Each check below names the place to look and what a pass looks like. It does not repeat "An Azure Virtual Desktop security checklist" or "Troubleshooting Azure Virtual Desktop connection failures: a checklist", and leaves design questions to "Common AVD design mistakes and how to avoid them".

## The week at a glance

| Day | Area | Pass criterion |
|---|---|---|
| 1 | Session host health, network access | Every powered-on host shows Available; shut-down hosts show Shutdown or Unavailable (check VM power state); URL tool reports no inaccessible entries |
| 2 | Profiles and sign-in test | Test user signs in; profile VHDX exists |
| 3 | Power and scaling | Prerequisites met; scaling plan assigned with autoscale enabled; Start VM on Connect tested |
| 4 | Monitoring | Check Configuration shows no missing counters or event logs; Insights shows data |
| 5 | Cost | Budget with alert thresholds exists |
| 6-7 | Review | Compare Insights, autoscale events and user feedback with expectations |

## Day 1: session host health and network access

**Check the status of every session host.** In the Azure portal, open the host pool, go to the **Session hosts** tab and select a host name to see failed health checks. Learn calls Available the ideal status: the host passed all health checks and accepts connections. Other states:

- **Needs Assistance**: a non-fatal check failed (Geneva Monitoring Agent, Azure Instance Metadata Service or URL health check). Users can connect and new sessions are still load balanced here, but the experience may degrade.
- **Shutdown**: the session host has been shut down and is not available for load balancing. Learn's resolution is to turn the host on.
- **Unavailable**: the host is turned off or failed a fatal check, so sessions cannot connect and it is not used for load balancing. Fatal checks include domain join, side-by-side stack listener and domain trust. Learn adds that a host shut down before it could update its status can show Unavailable instead of Shutdown, which does not indicate an issue.
- **Upgrade Failed** and **Upgrading**: the agent could not update or is updating. Learn says Upgrade Failed does not affect sessions.

For the full diagnosis of an Unavailable host, see "Azure Virtual Desktop Session Host Shows Unavailable: A Step-by-Step Checklist" on this site.

**Test access to required endpoints.** Learn's endpoint page says all entries are outbound, blocking them is unsupported, and the Azure fabric addresses `169.254.169.254` and `168.63.129.16` must not be intercepted, proxied or redirected. The page has separate tabs for the Azure cloud and Azure for US Government, with different entries. Examples from the Azure cloud tab: TCP 443 to `login.microsoftonline.com` and `*.wvd.microsoft.com`, UDP 3478 to `51.5.0.0/16`, and TCP 1688 to `azkms.core.windows.net`.

To test from a session host, run the Azure Virtual Desktop Agent URL Tool:

1. Open PowerShell as administrator on a session host.
2. Change to the installed RDAgent folder; Learn gives a snippet that finds it.
3. Run `.\WVDAgentUrlTool.exe`.
4. Review the entries, and repeat on hosts in other regions or virtual networks.

The tool needs .NET Framework 4.6.2 and RDAgent 1.0.2944.400 or higher. It does not verify wildcard entries, so make sure the wildcards are allowed first. To find the regional agent FQDNs, Learn points to event ID 3701 in **Windows logs > Application > WVD-Agent** on a session host.

## Day 2: sign in as a real user and check the profile

Use a standard test user assigned to a desktop in an application group and connect with Windows App or the Remote Desktop app. If the pool uses FSLogix, follow the verification steps on Learn's Configure profile containers page:

1. Open a terminal as that user and go to `C:\Program Files\FSLogix\Apps`.
2. Run `.\frx.exe list-redirects`. The output begins with `Active redirections` and maps the profile path to a redirect target, for example `\Device\HarddiskVolume4\Users\contoso => \Device\HarddiskVolume9\Profile`.
3. Open the folder set in `VHDLocations` and find the user's folder with the new VHDX file.

If the user receives a local profile instead, see "FSLogix Users Get a Local or Temporary Profile: Why the Container Does Not Attach" on this site.

**Check the storage encryption type.** The same Learn page carries an Important notice: with the April 2026 Windows Server update the default Kerberos encryption type changes from RC4 to AES-SHA1, and file shares hosting FSLogix containers that are not upgraded to AES-SHA1 might have access issues. Learn words this as upcoming and says to complete the upgrade before installing the update. A Microsoft FSLogix blog post of 27 March 2026 narrows the scope to profile storage on SMB shares integrated with Active Directory where the AD objects or service accounts are RC4-only or have no encryption type set, and says the Azure Virtual Desktop service itself is not modified. It gives a schedule: from April 2026 enforcement mode is the default on domain controllers, with audit mode as a manual rollback; from July 2026 audit mode is removed. For Azure Files with AD DS it recommends remediation by the end of June 2026. As our reading of a practical check: look up the encryption type on the share's AD object or service account, make sure AES-SHA1 is supported, then repeat the sign-in test above.

## Day 3: power and scaling

Do not assign a scaling plan until the prerequisites are met. For power management autoscaling, the page "Create and assign an autoscale scaling plan for Azure Virtual Desktop" lists:

- Pooled host pools need a configured maximum session limit; do not use the default value.
- Assign the **Desktop Virtualization Power On Off Contributor** role to the Azure Virtual Desktop service principal, or a managed identity assigned to the host pool, with the subscription as assignable scope. Learn says a lower scope such as the resource group, host pool or VM prevents autoscale from working properly.
- The scaling plan configuration data and the host pool configuration must be in the same region, and the plan type (pooled or personal) must match.
- Do not combine autoscale with Azure Automation or Logic Apps scaling on the same host pool; changes to an assigned plan apply immediately.
- Add the exclusion tag to any host that autoscale should not start, stop or change the drain mode of.

Dynamic autoscaling differs. Learn says it is only for pooled host pools with session host configuration. It adds the **Desktop Virtualization Virtual Machine Contributor** role for the service principal, access to the endpoint `wvdhpustgr0prod.blob.core.windows.net` (hosts that cannot reach it fail with `CustomerVmNoAccessToDeploymentPackageException`), and, for PowerShell, Az.DesktopVirtualization 5.4.2-preview or later. Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, session host configuration and update, and ephemeral OS disks, in July 2026 (Tech Community). Some Learn pages, for example the scenarios and glossary pages and the module version 5.4.2-preview, still carry preview wording; check the current page before relying on a limit.

**Check that the plan is assigned.** In the portal, open the plan and select **Host pool assignments** under **Manage**; the host pool should be listed. For plans enabled during deployment, Learn also mentions an **Enable autoscale** checkbox in the **Scaling plan** menu. In PowerShell, Learn gives `(Get-AzWvdScalingPlan -ResourceGroupName <rg> -Name <plan>).HostPoolReference | FL HostPoolArmPath,ScalingPlanEnabled`. A pass is the host pool listed with `ScalingPlanEnabled` true.

**Start VM on Connect.** It cannot be enabled while creating a host pool, Learn says. Enable it under **Azure Virtual Desktop > Host pools > your pool > Properties > Start VM on connect**, and assign **Desktop Virtualization Power On Contributor** to the managed identity or service principal at a scope containing the hosts. For pooled pools Learn says it powers on a VM only when none are turned on, turns on more only when the first reaches the session limit, and starts a VM at most every five minutes, so some users may see "No resources available" and should retry. Connecting directly to a powered-off VM by IP address or name does not start it. Our suggestion for the test: with all hosts of the pool deallocated, connect with a test user through Windows App or the Remote Desktop app.

Background: "How to create and assign an AVD scaling plan step by step" and "How to configure Start VM on Connect for personal and pooled host pools".

## Day 4: monitoring

[Azure Virtual Desktop Insights](https://www.m365.fm/entity/avd-insights/) is a dashboard built on Azure Monitor Workbooks. Learn lists a Log Analytics workspace, diagnostics from the environment, the recommended performance counters and the recommended Windows event logs as prerequisites. The [Azure Monitor Agent](https://www.m365.fm/entity/azure-monitor-agent/) collects session host data through a data collection rule. Tables and roles are covered in "Setting up AVD Insights with Azure Monitor and Log Analytics".

To check the setup, open Insights at `aka.ms/avdi`, select **Workbooks**, then **Check Configuration**. Learn says to check the configuration if dashboard items are not displaying correctly. The workbook shows configured and missing counters and event logs. Learn says automated deployment of session host data settings in the workbook is limited to 1,000 session hosts or fewer, and standard Log Analytics storage charges apply.

For autoscale, Insights monitors pooled host pools only, Learn says: on the host pool, open **Insights** and select **Autoscale**, which needs Autoscale logs in the host pool's diagnostic settings. The data lands in `WVDAutoscaleEvaluationPooled`, where `ScalingReasonMessage` explains what autoscale did and why; for failed evaluations, join to `WVDErrors` on `CorrelationId`. For personal pools, enable **Autoscale logs** under the scaling plan's **Diagnostic Settings** and send them to a storage account or event hub.

Alert rules and queries are covered in "Key metrics and alerts for Azure Virtual Desktop" and "Useful KQL queries for Azure Virtual Desktop diagnostics".

## Day 5: cost guardrails

Create a budget. In the portal, open **Subscriptions**, select the subscription and choose **Budgets**, or use the resource group's **Budgets** page. Choose a monthly, quarterly or annual reset period, an amount and at least one alert threshold with an email address (up to five of each). Learn says cost data is typically available within 8 to 24 hours, budgets are evaluated every 24 hours, and emails normally follow within an hour. A budget does not stop resources. Learn also asks for an expiration date; an expired budget is deleted automatically.

## Days 6 and 7: review

Compare the data with expectations: powered-on hosts that did not show Available, failed autoscale evaluations (Day 4), slow sign-ins. Ask pilot users what they noticed. Our suggestion: change one thing at a time, since scaling plan changes apply immediately. For week two: a security review ("An Azure Virtual Desktop security checklist"), backup and disaster recovery, patching, and tagging ("A tagging strategy for AVD cost allocation").

## Sources

- [Microsoft Learn: Session host statuses and health checks](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-status-health-checks)
- [Microsoft Learn: Required FQDNs and endpoints for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/required-fqdn-endpoint)
- [Microsoft Learn: Check access to required FQDNs and endpoints](https://learn.microsoft.com/en-us/azure/virtual-desktop/check-access-validate-required-fqdn-endpoint)
- [Microsoft Learn: Configure profile containers](https://learn.microsoft.com/en-us/fslogix/how-to-configure-profile-containers)
- [Microsoft Tech Community, FSLogix Blog: Action required: Windows Kerberos hardening (RC4) may affect FSLogix profiles on SMB storage](https://techcommunity.microsoft.com/blog/fslogix-blog/action-required-windows-kerberos-hardening-rc4-may-affect-fslogix-profiles-on-sm/4506378)
- [Microsoft Learn: Create and assign an autoscale scaling plan for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Tech Community: Enhanced host pool management for Azure Virtual Desktop is now generally available](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
- [Microsoft Learn: Start VM on Connect](https://learn.microsoft.com/en-us/azure/virtual-desktop/start-virtual-machine-connect)
- [Microsoft Learn: Enable Insights to monitor Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/insights)
- [Microsoft Learn: Set up diagnostics for Autoscale in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-diagnostics)
- [Microsoft Learn: Monitor Autoscale operations with Insights](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-monitor-operations-insights)
- [Microsoft Learn: Create and manage budgets](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/tutorial-acm-create-budgets)
