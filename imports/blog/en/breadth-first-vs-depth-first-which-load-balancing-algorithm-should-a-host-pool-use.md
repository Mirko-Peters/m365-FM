---
title: "Breadth-first vs depth-first: which load balancing algorithm should a host pool use"
summary: "Use breadth-first when user experience comes first and depth-first when you want sessions packed onto as few session hosts as possible so the rest can be switched off. This guide gives the decision criteria, a worked example for both algorithms and the steps to change the setting."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-breadth-first-load-balancing, avd-depth-first-load-balancing, avd-host-pool]
keypoints:
  - "Microsoft Learn describes breadth-first as the choice when user experience matters most, and depth-first as the choice for cost-conscious organizations that want granular control over how many session hosts are powered on."
  - "Depth-first requires a maximum session limit. Breadth-first does not, and its default limit of 999999 is also the highest value you can set."
  - "Breadth-first picks randomly among the half of eligible hosts with the fewest sessions, so the spread is close to even but not exact. Depth-first is deterministic: the eligible host with the most sessions wins."
  - "Both algorithms send a returning user with an active or disconnected session back to that host, even if it is in drain mode. Load balancing does not apply to personal host pools."
  - "You can change the algorithm at any time. If a scaling plan is assigned, the algorithm in the schedule overrides the host pool setting in the ramp-up phase, according to Learn."
faq:
  - q: "Can I switch between breadth-first and depth-first later?"
    a: "Yes. Microsoft Learn says you can configure only one algorithm per pooled host pool at a time, but you can change it at any time. The sources used here do not say what happens to sessions already running, so test the change on a pilot pool first."
  - q: "Why does depth-first need a maximum session limit?"
    a: "Depth-first fills one host until it reaches its limit and then moves to the next, so without a limit it has no point at which to move on. Learn says the limit is required, and that once all hosts reach it you must raise the limit or add hosts."
  - q: "Does the algorithm apply to personal host pools?"
    a: "No. Learn says load balancing does not apply to personal host pools, because each user has a 1:1 mapping to a session host. Personal pools use automatic or direct assignment instead."
---

Choose breadth-first when the priority is a responsive desktop for every user, and choose depth-first when the priority is running as few session hosts as possible. Microsoft Learn states the same split: breadth-first suits organizations that prioritize user experience, depth-first suits cost-conscious organizations that want granular control over how many hosts are powered on. This guide turns that split into criteria, a worked example and the steps to change the setting.

It covers pooled [host pools](/entity/avd-host-pool/) only. Learn says load balancing does not apply to personal host pools. The mechanics of each algorithm have their own articles; this one compares them. Sources are listed at the end and were retrieved on 17 November 2026.

## How the two algorithms choose a host

Both algorithms run when a user with no existing session starts a connection. They differ in which host they pick.

| | [Breadth-first](/entity/avd-breadth-first-load-balancing/) | [Depth-first](/entity/avd-depth-first-load-balancing/) |
|---|---|---|
| Aim | Spread new sessions evenly | Keep filling one host until its limit |
| Selection rule | Query hosts that allow new connections, then choose at random from the half with the fewest sessions | Query hosts that allow new connections and have not reached the limit, then choose the host with the most sessions; on a tie, the first host from the query |
| [Maximum session limit](/entity/avd-maximum-session-limit/) | Not required | Required |
| Learn's stated fit | User experience, because CPU, memory and disk are generally less contended | Cost, because fewer hosts need to stay powered on |

Learn's own breadth-first example: with nine hosts holding 11 to 19 sessions, a new session can go to any of the five hosts with the fewest sessions. It does not always go to the single emptiest host, so the distribution is not strictly even.

## Rules that apply to both

- A user who already has an active or disconnected session in the pool is sent back to that host, even if [drain mode](/entity/avd-drain-mode/) is on for it.
- A user without a session is never sent to a host in drain mode.
- Lowering the maximum session limit on a host with active sessions does not affect those sessions.
- Under high concurrent connection load the number of sessions on a host can exceed the limit. Learn's terminology page explains that pending sessions reserve a place while a user signs in, a process it says can take from 30 seconds to five minutes depending on the profile.

## Worked example: 4 hosts, limit of 10, 25 users

The numbers below are an illustration built from the selection rules above, not a Learn example.

**Depth-first.** All four hosts start empty, so the first user is a tie and goes to the first host returned by the query, call it H1. From then on H1 has the most sessions among hosts below the limit, so sessions 2 to 10 also land on H1. H2 takes the next 10, and H3 takes the last 5. H4 stays empty. If H1 and H2 are full at 10 and a 26th user arrives, H3 receives it.

**Breadth-first.** Each new session goes to a random host among the two with the fewest sessions. After 25 users the hosts hold roughly 6 or 7 sessions each. The exact split varies from day to day because of the random choice.

What this means in practice:

- With depth-first, H4 has no sessions and is a candidate to be turned off. That is the cost argument Learn makes.
- With breadth-first, all four hosts carry load, so none is a candidate for shutdown until sessions end.
- With depth-first, the first host is the busiest. Learn's sizing guidance says sign-in is CPU-intensive and that capacity should be planned for peak logon times such as the start of a shift. A burst of sign-ins on a depth-first pool is therefore directed at the host that is already fullest. This is an inference from the two statements, so check it in a pilot.

## Decision criteria

| Question | Points to breadth-first | Points to depth-first |
|---|---|---|
| What matters more, response time or running cost? | Response time | Running cost |
| Are session hosts switched off outside working hours? | Hosts stay on anyway | Idle hosts can be switched off |
| Can you set and maintain a realistic session limit? | Limit is optional | Limit is mandatory and must fit the workload |
| Is the workload heavy per user? | Spreading keeps contention lower, which is Learn's stated reason | A low limit is needed so a packed host is not overloaded (inference) |
| Do users sign in in a short burst? | Burst is spread over hosts | Burst hits one host first |

Learn's sizing guidance gives starting points for the limit. For multi-session hosts it lists maximum users per vCPU of 6 for light, 4 for medium, 2 for heavy and 1 for power workloads. An 8-vCPU host at the light level supports about 48 users. Learn calls these generic estimates to be validated with a pilot or simulation. The same page says that for 20 or more users per VM, several smaller VMs perform better than one or two large ones, and that many smaller VMs are easier to patch and to shut down when idle.

## Steps to change the algorithm

You need the Desktop Virtualization Host Pool Contributor role.

1. Sign in to the Azure portal and open **Azure Virtual Desktop**.
2. Select **Host pools**, then select the pooled host pool.
3. Select **Properties**.
4. Choose the algorithm in **Load balancing algorithm**. Enter a value in **Max session limit**.
5. Select **Save**.

Learn also provides Azure PowerShell and Azure CLI tabs for this setting, which need the `Az.DesktopVirtualization` module or the `desktopvirtualization` CLI extension. The commands are on the Learn page and are not reproduced here.

If you pick breadth-first when you create a host pool, the default limit is 999999, which is also the highest value allowed. For depth-first, set a number that fits your workload.

## What to do when depth-first runs out of room

Learn marks this as important: when all hosts reach the maximum session limit, you must either increase the limit or add session hosts. New users cannot be placed otherwise. Use [Azure Virtual Desktop Insights](/entity/avd-insights/) to watch sessions per host and host performance, which is the monitoring Learn recommends when choosing the limit.

## Interaction with autoscale

If you use a [scaling plan](/entity/avd-scaling-plan/), the algorithm is set per phase in the schedule. Learn's scaling plan article says of the ramp-up setting that the preference selected there overrides the one selected for the original host pool settings. It recommends breadth-first for ramp-up and depth-first for off-peak. Peak offers either algorithm, and the ramp-down tab has a load balancing field without a recommendation. Learn's autoscale FAQ gives the reason: breadth-first gives an even distribution early in the day, while depth-first lets autoscale consolidate sessions until it reaches the minimum possible number of hosts. For a pool with a scaling plan, the schedule is therefore where the choice is made in practice. Learn also says the capacity threshold and minimum percentage are respected during consolidation.

For autoscale on a pooled host pool, Learn says to configure a custom maximum session limit and not to use the default.

## A short selection procedure

1. State the priority in one sentence: user experience or cost.
2. List how many hosts you could switch off in the quietest period if sessions were packed.
3. Pick a limit from Learn's per-vCPU starting points and your own workload.
4. Start with the algorithm that matches the priority, and run a pilot group.
5. Compare sessions per host and user-reported performance in Insights.
6. Change the algorithm if the pilot disagrees. Learn says you can do this at any time.

## Sources

Retrieved 17 November 2026.

- [Microsoft Learn: Configure host pool load balancing in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-host-pool-load-balancing)
- [Microsoft Learn: Azure Virtual Desktop terminology](https://learn.microsoft.com/en-us/azure/virtual-desktop/terminology)
- [Microsoft Learn: Session host virtual machine sizing guidelines](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/virtual-machine-recs)
- [Microsoft Learn: Create and assign an autoscale scaling plan for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: Azure Virtual Desktop autoscale FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq)
