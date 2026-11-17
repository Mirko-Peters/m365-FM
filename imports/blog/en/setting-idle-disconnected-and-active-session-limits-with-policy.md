---
title: "Setting idle, disconnected and active session limits with policy"
summary: "Set the three session limits as policies on the session hosts, through Group Policy or an Intune profile, then restart the hosts. This guide covers the four policies, which values Learn gives, how to apply them, and the mistakes that make a limit appear not to work."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [azure-virtual-desktop]
keypoints:
  - "Four policies sit under Session Time Limits: disconnected sessions, active but idle sessions, active sessions, and End session when time limits are reached. Without the last one, the idle and active limits disconnect the user instead of signing them out."
  - "Learn's examples for the disconnected-session limit are 15 to 30 minutes, finishing before the end of the autoscale ramp-down phase. Keep it above five minutes, or a short network loss can end a session."
  - "Intune: a Settings catalog profile for Windows 10 and later, the settings picker path Administrative templates, Windows Components, Remote Desktop Services, Remote Desktop Session Host, Session Time Limits. Domain-joined hosts can use a Group Policy object instead. Learn ends both procedures with a restart of the hosts."
  - "Where the same policy is set for both Computer Configuration and User Configuration, the computer setting wins. Device-scope Intune policies go to device groups, not to users."
  - "A time limit ends or disconnects sessions but does not deallocate VMs. Autoscale or another automation does that, and autoscale counts disconnected sessions as active until they are gone."
faq:
  - q: "Do I need to restart the session hosts after setting a limit?"
    a: "Yes, on both routes. Learn's scaling plan article ends its Intune procedure and its Group Policy procedure for the disconnected-session limit with restarting the computers that provide the remote session, so the settings take effect. Applying the same step to the idle and active limits is our reading."
  - q: "Why do my idle sessions disconnect instead of signing out?"
    a: "By default Remote Desktop Services disconnects a session that reaches an idle or active limit. To end it instead, enable End session when time limits are reached. Per the Policy CSP page, that setting applies only to limits an administrator set explicitly, not to timeouts caused by network conditions."
  - q: "Does a time limit stop the VM and its cost?"
    a: "No. The Start VM on Connect FAQ says signing users out does not deallocate their VMs. Deallocation needs autoscale or an automation script. The autoscale FAQ pairs the disconnected-session limit with a minimum active host percentage of 0 in off-peak to reach zero running hosts."
---

Set the limits as Remote Desktop Services policies on the session hosts, either in a Group Policy object or in an Intune profile, and restart the hosts. This article covers the policy side: which setting does what, which values Microsoft documents, and why a limit sometimes seems to be ignored. For the concepts behind disconnect and sign-out, see the companion article "Disconnect and sign-out time limits in Azure Virtual Desktop explained".

These are inbox Windows policies from the TerminalServer administrative template (TerminalServer.admx), applied to [session hosts](/entity/avd-session-host/) in [Azure Virtual Desktop](/entity/azure-virtual-desktop/). They are not a separate Azure Virtual Desktop feature.

## The four policies

All four live under **Computer Configuration > Administrative Templates > Windows Components > Remote Desktop Services > Remote Desktop Session Host > Session Time Limits**. The Windows Policy CSP reference for the TerminalServer template describes them as follows.

| Policy | What it does when enabled | Default if not configured |
|---|---|---|
| Set time limit for active but idle Remote Desktop Services sessions | Disconnects an active session that has had no user input for the chosen time. The user gets a warning two minutes before. | Idle sessions stay for an unlimited time |
| Set time limit for disconnected sessions | Deletes a disconnected session from the server after the chosen time. Selecting Never keeps the unlimited default. | Disconnected sessions are kept for an unlimited time |
| Set time limit for active Remote Desktop Services sessions | Disconnects a session after the chosen total active time. The user gets a warning two minutes before, to save files. | Active sessions can run for an unlimited time |
| End session when time limits are reached | Ends (logs off and deletes) a session that hits a limit instead of disconnecting it | Timed-out sessions are disconnected |

Four details from the same reference decide how you combine them:

- **Idle and active limits disconnect; they do not sign out.** To sign out instead, enable End session when time limits are reached. Its registry value is `fResetBroken` under `SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services`.
- **The end-session setting covers only explicit limits.** The reference says it does not apply to timeouts caused by connectivity or network conditions.
- **A console session is exempt.** Each limit states that time limits do not apply to a console session.
- **Computer wins over user.** The first three policies each exist under both Computer Configuration and User Configuration (the end-session policy too). If both are set, the Computer Configuration setting takes precedence.

## Choosing the combination

Pick the policy from the problem you are solving. The examples are ours, not Microsoft recommendations; the pages cited here give values for AVD host pools only in the next section.

| Problem | Policies | Effect |
|---|---|---|
| Users close the client without signing out and the sessions pile up | Disconnected limit | The session is deleted after the limit, which frees capacity |
| Users stay signed in but leave the desk | Idle limit, plus either the disconnected limit or End session when time limits are reached | Idle limit disconnects. The disconnected limit then removes the session, or the end-session policy signs the user out at the idle limit directly |
| A shared pooled desktop must not be held for a whole day | Active limit | The user is disconnected after the total time, even while working, so use it deliberately |

If you chain an idle limit and a disconnected limit, the user is signed out after roughly the sum of the two, assuming the timers run one after the other. That sum is our reading of the behaviour; confirm it on a test host.

## Which values Learn gives

The cited pages give few numbers for AVD, and none sets a required value.

- **Disconnected sessions on pooled hosts with autoscale.** The autoscale FAQ says to set an appropriate timeout, for example 15 to 30 minutes, and to make sure it completes before the end of the ramp-down phase. It lists this as one part of a recommended configuration, next to stopping VMs when they have no active sessions, optional force sign-out, and a minimum percentage of active hosts of 0 in off-peak.
- **A lower bound.** The Start VM on Connect FAQ says to set the End a disconnected session limit to more than five minutes, because a low value can end sessions when a network connection drops for too long, which costs users unsaved work.
- **Windows 365 Flex defaults, for comparison.** Learn lists defaults for [Windows 365](/entity/windows-365/) Flex Cloud PCs, the product that Learn's what's-new pages say was named Windows 365 Frontline until May 2026. Dedicated mode disconnects idle sessions after 30 minutes with a dialog two minutes earlier. Shared mode uses 15 minutes idle and 30 minutes disconnected. These defaults belong to that service and are not defaults for an AVD host pool.

For an AVD pool you therefore choose the number yourself. A starting point to test with a pilot group, our suggestion only: 15 to 30 minutes for the disconnected limit as in the FAQ, an idle limit your security team can justify, and no active limit unless a policy requires one.

## Setting the limits with Group Policy

1. Decide the scope. Learn's troubleshooting page says that in domain-joined environments you apply the setting through a GPO linked to the OU that contains the session hosts, not through Local Computer Policy on single hosts.
2. Check access. The scaling plan article lists the needs for the Group Policy route: a domain account that can create or edit Group Policy objects, and a security group or OU containing the devices.
3. In the Group Policy editor open the Session Time Limits folder under Computer Configuration, using the path above.
4. Open **Set time limit for disconnected sessions**, select **Enabled**, and choose the time. The Start VM on Connect FAQ words the local-policy variant as enabling the policy and then selecting **End a disconnected session**.
5. Repeat for the idle or active limit if you need them, and enable **End session when time limits are reached** if idle and active timeouts should sign users out.
6. Refresh the policy. Learn's training module on session timeouts uses `gpupdate` at a command prompt to force a refresh. As the Intune route requires a restart, plan one for the hosts as well and test on a single host first.

## Setting the limits with Intune

The scaling plan article gives this procedure for the disconnected limit:

1. Sign in to the Microsoft Intune admin center.
2. Create or edit a configuration profile for **Windows 10 and later** devices. The scaling plan article words this as the Session Time Limits profile type, while the Windows 365 article says Settings catalog; both lead to the same settings picker, so use whichever your admin center offers.
3. In the settings picker, browse to **Administrative templates > Windows Components > Remote Desktop Services > Remote Desktop Session Host > Session Time Limits**. The Windows 365 article suggests searching for "session time limits".
4. Tick **Set time limit for disconnected sessions** and close the picker.
5. Expand **Administrative templates**, switch the setting to **Enabled** and select a time from the list.
6. Optionally add a scope tag, then on **Assignments** select the group that contains the session hosts.
7. Review, select **Create**, and once the policy has applied, restart the session hosts.

For the idle limit, the Windows 365 article uses the setting **Set time limit for active but idle Remote Desktop Services sessions** with the field **Idle session limit: (Device)**, and for the disconnected limit the field **End a disconnected session (Device)**. The Windows 365 article gives no allowed range or unit for either field, so read the drop-down in your tenant.

The prerequisites are the Policy and Profile manager built-in role and a group of devices. [Intune](/entity/intune/) needs two further things on multi-session hosts. The hosts must be Microsoft Entra joined or hybrid joined and enrolled with device credentials; Learn says enrolment with user credentials is not supported for Windows Enterprise multi-session. And the policy scope must match the assignment: Learn says device-based configuration cannot be assigned to users, and a mismatch is reported as Error or Not applicable. The (Device) fields above are device scope, so target a group of devices.

## Where the limits fail to take effect

- **No restart.** The Intune procedure says the hosts must restart after the policy applies. Check this first.
- **Local policy on a domain host.** A setting made in Local Computer Policy on one host is not what a domain fleet should rely on. Link a GPO to the OU, as Learn advises.
- **Conflicting scopes.** A user-scope value is overridden by a computer-scope value. If behaviour differs from what you set, look for the other scope.
- **Console sessions.** The limits do not apply to them.
- **Expecting a sign-out from an idle limit.** Idle and active limits disconnect, unless End session when time limits are reached is enabled.
- **A very short disconnected limit.** Under five minutes, a network drop can end the session and the user loses unsaved work, per the FAQ.
- **Expecting the VM to stop.** A time limit removes the session, not the VM. The Start VM on Connect FAQ says signing users out does not deallocate VMs, and tells you to use autoscale or automation scripts.
- **Autoscale that never reaches zero hosts.** The troubleshooting page explains that autoscale treats disconnected sessions as active, so hosts stay up until the sessions are gone. It lists three steps: a GPO that signs out disconnected sessions, a minimum active host percentage of 0 in off-peak, and a timeout that finishes before ramp-down or off-peak ends. See [autoscale schedule phases](/entity/avd-autoscale-schedule-phases/) and [power management autoscaling](/entity/avd-power-management-autoscaling/).

A related setting is session lock behaviour. Learn says that with single sign-on through Microsoft Entra ID the default is to disconnect the session when it is locked, while legacy authentication shows the remote lock screen. Our reading: a locked, disconnected session then falls under your disconnected-session limit, so check that the value suits users who lock their screen and step away.

## A short rollout order

1. Pick the limits and write the values down with the reason for each.
2. Apply them to one pilot host through the route you will use in production.
3. Restart that host, connect, disconnect, and time the result against the policy.
4. Widen the assignment to a pilot group, then to the pool.
5. With autoscale, finish by confirming how many hosts still run after ramp-down, as the troubleshooting page suggests.

Learn does not document a rollback procedure for these policies. Our reading is that setting them to disabled or not configured and restarting the hosts reverses them, which is another reason to start with one host.

## Sources

Retrieved on 17 November 2026.

- [Microsoft Learn: Azure Virtual Desktop autoscale FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq)
- [Microsoft Learn: Create and assign an autoscale scaling plan for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: Start VM on Connect FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/start-virtual-machine-connect-faq)
- [Microsoft Learn: Troubleshoot autoscale issues in Azure Virtual Desktop](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-desktop/troubleshoot-autoscale)
- [Microsoft Learn: Policy CSP, ADMX_TerminalServer](https://learn.microsoft.com/en-us/windows/client-management/mdm/policy-csp-admx-terminalserver)
- [Microsoft Learn: Windows 365 Flex Cloud PC session time limits](https://learn.microsoft.com/windows-365/enterprise/frontline-cloud-pc-session-time-limits)
- [Microsoft Learn: Using Azure Virtual Desktop multi-session with Microsoft Intune](https://learn.microsoft.com/en-us/intune/solutions/azure-virtual-desktop-multi-session)
- [Microsoft Learn: Configure the session lock behavior for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-session-lock-behavior)
- [Microsoft Learn: Configure session timeout properties (training module)](https://learn.microsoft.com/en-us/training/modules/configure-user-experience-settings/6-configure-session-timeout-properties)
