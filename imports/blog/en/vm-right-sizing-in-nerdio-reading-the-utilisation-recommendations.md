---
title: "VM right-sizing in Nerdio: reading the utilisation recommendations"
summary: "Nerdio Advisor's right-sizing rules work from the 90th-percentile CPU and memory use of a host pool's VMs over the last 30 days and from triggers set by default at 80 percent (increase) and 60 percent (decrease), and they offer up to three sizes. This article explains the data they need, how the verdict is derived and what the recommendation cannot see."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [nerdio-right-sizing, nerdio-advisor]
keypoints:
  - "By default the rules use the 90th percentile of CPU and memory use over the last 30 days, with triggers at 80 percent (increase) and 60 percent (decrease). Check the Active sessions only flag in your own rule, because the pooled page states its default two ways."
  - "Data volume decides how far to trust a result: under 1 hour nothing is shown, under 24 hours the sizes are hidden, under 72 hours of power-on time the recommendation carries a warning. Nerdio suggests 1 to 4 weeks of data before accepting changes."
  - "The pooled rule needs a dynamic host pool with auto-scale on and CPU and RAM gathering enabled. The personal rule reads performance counters from the host pool's Log Analytics workspace."
  - "Candidate sizes are filtered (A- and B-series, exhausted quota, missing benchmarks or prices, GPU or feature mismatch) and the top three are shown. A resize shortens the analysis window, because earlier data is excluded."
  - "The rule works from utilisation. Session limits, user input delay, logon peaks and storage are outside its inputs, so the recommendation is a starting point for a decision, not the decision."
faq:
  - q: "Why does a host pool show no recommendation although the VMs look busy or idle?"
    a: "Nerdio's help documents several conditions. A VM needs at least 72 hours of power-on time for a reliable result, and below 24 hours the sizes are hidden. In a pooled host pool with several VM sizes the rule analyses the most-used size, and if a most-used size cannot be chosen no recommendation is generated. The pooled rule also needs a dynamic host pool, auto-scale turned on and CPU and RAM gathering enabled. Our reading: a recommendation can also stay empty when every candidate size is rejected, for example for quota, missing benchmarks or prices, or a GPU mismatch."
  - q: "Is a recommendation based on average or peak usage?"
    a: "Neither exactly, and Nerdio's pages are not fully consistent. The rule dialog describes the triggers as thresholds for average utilisation, while the data sections use the 90th percentile of the last 30 days, which means the VM ran below that load about 90 percent of the time. Our reading is that the percentile is the value the triggers are applied to, but the pages do not say so in words. The percentile is configurable in the service settings. Whether only intervals with active sessions count depends on the Active sessions only flag."
  - q: "Does the recommendation cost me extra?"
    a: "Nerdio's current pages disagree. Its entitlement and billing page lists Advisor Recommendations for AVD among the Premium-only features that Core does not include, while the pricing page ticks Nerdio Advisor and TCO analysis for both Premium and Core. Neither names right-sizing, and the 2024 Nerdio articles name no edition for it either (the May one calls pooled right-sizing \"a premium feature\"). Confirm what your licence includes with Nerdio."
---

A right-sizing recommendation in Nerdio Advisor says whether the VMs in a host pool run below or above the load you want and, if so, which sizes would move them toward it. By default the rule works from the 90th percentile of CPU and memory use over the last 30 days, with triggers at 80 percent (increase) and 60 percent (decrease), and shows up to three candidate sizes. This article explains how to read that output. The companion article, "Acting on right-sizing recommendations safely", covers what to do next.

Menu names and defaults can change between releases, so check them in your own [Nerdio Manager for Enterprise](/entity/nerdio-manager-for-enterprise/) tenant.

## Where the feature sits

Host pool and VM right-sizing is part of [Nerdio Advisor](/entity/nerdio-advisor/), described by Nerdio as a suite of capabilities introduced in 2023. Nerdio's announcement of version 6.0 (2 April 2024) lists [host pool and VM right-sizing](/entity/nerdio-right-sizing/) as generally available, with monitoring of utilisation, flagging of oversized or undersized VMs, and recommendations with an impact analysis.

In the portal the pieces are under **Observability** > **Advisor**: **Rules** define how an analyzer assesses usage, and **Recommendations** lists the results. Nerdio's rules overview lists the two AVD right-sizing rules covered here, plus rules for Cloud PC right-sizing, platform TCO and license suitability. Nerdio's version 7 article says Advisor right-sizing uses AI, while the rule pages describe fixed thresholds, percentiles and a scale factor and mention no model. Judge the output by the documented rules.

On editions, Nerdio's current pages do not agree. The [entitlement and billing page](https://nmehelp.getnerdio.com/hc/en-us/articles/26124388880397-NME-entitlements-consumption-and-billing) lists "Advisor Recommendations for AVD" among the features that require a Premium entitlement and are not included with Windows Cloud Core or AVD Core, while the pricing page ticks "Nerdio Advisor and TCO analysis" for both Windows Cloud Premium and Core. Neither names right-sizing. Neither 2024 article assigns it to an edition: the April announcement lists "continuous cost optimization recommendations" among the advanced Premium features, and the May article calls pooled right-sizing "a premium feature" without naming an edition. Our reading: the two rules are Advisor recommendations for AVD, so the entitlement page would cover them, but it does not say so. Confirm with Nerdio what your licence includes.

## What data the rule needs

| | Pooled rule | Personal rule |
|---|---|---|
| Host pool | Type must be dynamic; auto-scale must be on | Host pool configured for a Log Analytics workspace |
| Collection | CPU and RAM gathering enabled in auto-scale settings, host pool properties, or both | Counters enabled in the workspace at an interval of 10 minutes or less, 1 minute recommended; the page names the Log Analytics agent as running on the VMs |
| Counters | Processor Information/% Processor Time, Memory/Available MBytes | The same two counters |
| Window | Last 30 days | Last 30 days |

For the personal rule, memory use is a percentage derived from Available MBytes. Nerdio's personal rule page says the Log Analytics agent should be running. Microsoft Learn states that this legacy agent has been deprecated since 31 August 2024 in favour of the Azure Monitor Agent, which Microsoft's [AVD Insights](/entity/avd-insights/) page describes with a data collection rule. Nerdio's host pool monitoring settings offer **Use Azure Monitor Agent (AMA)** and call the legacy Microsoft Monitoring Agent "not recommended". The personal rule page does not say whether it reads counters sent through the Azure Monitor Agent, so confirm with Nerdio if your VMs use it. The personal rule reads from a [Log Analytics](/entity/log-analytics/) workspace; the pooled page names none.

## How the verdict is derived

The documented pooled sequence, with the same logic described for the personal rule:

1. **Collect** the last 30 days of counters. If a VM changed size inside the window, the data from before the resize is excluded, so the window can be shorter.
2. **Reduce** them to the 90th percentile. A value of 28 percent means the VM ran below that load about 90 percent of the time. The pooled page lists one percentile for intervals with any user session and one for intervals with active sessions; the personal page lists one without a session filter and one for intervals with active sessions. Which one a rule uses depends on **Active sessions only**. The pooled page states the default two ways: its percentile section says the any-session values are used by default, while its rule settings and rule dialog say active sessions only is enabled. Check your own rule. The personal page says enabled. The pooled page also says that below 72 hours of active period the any-session values are always used.
3. **Compare** with four triggers, by default CPU and RAM increase at 80 percent and CPU and RAM decrease at 60 percent. The rule dialog describes them as thresholds for average utilisation, while the settings sections say they are used to calculate the scale factor. Our reading: the percentile is the value compared, and usage between 60 and 80 percent leaves neither trigger firing. The pages do not say how opposing CPU and RAM results combine.
4. **Scale**. For an increase the factor is usage divided by the decrease trigger. For a decrease it is usage divided by the increase trigger. Factors are limited to 0.3 to 3.0, the defaults of the MinScale and MaxScale settings on the pooled page.
5. **Pick sizes** that deliver roughly that factor, as described in the next section.

A worked example of steps 3 and 4 with the default triggers (our own arithmetic, not Nerdio's):

- 90th-percentile CPU of 92 percent exceeds 80 percent. The factor is 92 / 60, about 1.53, so the rule looks for a size with roughly 1.5 times the CPU performance.
- 90th-percentile CPU of 30 percent is below 60 percent. The factor is 30 / 80 = 0.375, so it looks for a size with a little over a third of the current CPU performance.
- 20 percent would give 0.25, which the limit raises to 0.3.

Our reading of the formula: dividing usage by the factor gives the usage the VM would have if its performance changed by exactly that factor. After an increase that is the decrease trigger (60 percent), after a decrease the increase trigger (80 percent). The target is therefore the edge of the 60 to 80 percent band, with no headroom after a decrease. Size steps and factor limits make real results differ, and the help pages do not state this intent.

Mixed pools matter for pooled host pools: if hosts have different sizes, the rule analyses the most-used size (greatest percentage), and if a most-used size cannot be chosen it cannot generate a recommendation. The settings **Respect quota** (recommend a size only if enough quota exists) and **Allowed VM sizes** (limit candidates to your list, with subscription, region and compatibility restrictions still applying) narrow the candidates.

## How candidate sizes are chosen

The pages list the reasons a size is dropped: exhausted quota, missing benchmarks or prices, a GPU or required-feature mismatch, and the A and B families. The rest are ordered by price when CPU drives the change, or by a combined CPU and RAM coverage score for optimal RAM and RAM increase. The pages do not say how a RAM decrease is sorted. The top three are saved and shown.

The personal rule page adds that benchmarks are retrieved periodically and cached, that several benchmarks for one size are averaged, and that a Linux benchmark with a factor of 0.967 stands in when no Windows benchmark exists. Both pages list ratios (CPU 1.10, RAM 1.05, price 1.02) within which two values count as equal. Our reading: CPU performance within about 10 percent counts as equal, so the order of the three sizes is not a precise ranking.

## How much data is enough

| Power-on time | What Nerdio shows |
|---|---|
| Under 1 hour | Statistics hidden |
| 1 to 24 hours | Statistics, but no size options |
| 24 to 72 hours | Recommendation with a reliability warning |
| 72 hours or more | Reliable; hours may add up non-continuously |

These are defaults of service settings (HideDataBelowDuration 1 hour, HideOptionsBelowDuration 24 hours, ReliableStatisticsDuration 72 hours, MaxStatisticsPeriod 30 days). The pooled page lists them under the prefix Advisor:HostPoolRightSize; the personal page uses Advisor:PersonalRightSize without MaxStatisticsPeriod. The rules overview adds that a VM can take up to 72 hours to be assessed and recommends 1 to 4 weeks of data before accepting changes. Power-on time counts, not calendar time. Our reading: a host that auto-scale keeps stopped most of the day collects data slowly, and a just-resized [pooled](/entity/avd-pooled-host-pool/) pool gives a thinner picture than the 30-day label suggests.

## Reading the Recommendations page

Under **Observability** > **Advisor** > **Recommendations**, filter by **Rule**, **Status** and **Scope** (limiting results to specific host pools). Nerdio's May 2024 article describes a **more** option under **Usage Report** that shows the details behind a recommendation, including a utilisation graph for the data collection period, and says Advisor keeps a usage history that can be exported for trending.

Questions to ask of each row:

- Is the percentile close to a trigger (82 percent against 80) or far beyond it (97 percent)?
- Is the data window short, or does it include a resize? Look for the reliability warning.
- Was **Active sessions only** on, and did the VM have at least 72 hours of active period? The pooled page says that below 72 hours the any-session values are used regardless.
- Does the host pool have mixed sizes, and which was analysed?

## What the recommendation does not see

The inputs are CPU and memory percentages, session presence, benchmarks and prices. The two rule pages do not list session limits, user input delay, logon peaks, storage latency or application licensing among them. Microsoft's [session host sizing guidance](/entity/avd-session-host/), which covers both Azure Virtual Desktop and Remote Desktop Services, offers context a reviewer can add by hand:

- For multi-session VMs it says to limit VM size to between 6 and 24 vCPUs, although the same page also recommends a range of 4 to 24 cores and calls four cores the lowest recommended number. It says that with 20 or more users on one VM, several smaller VMs would perform better.
- Its table gives maximum users per vCPU of 6 for light and 4 for medium workloads (2 for heavy, 1 for power), with a response time under 200 milliseconds expected.
- User logon is CPU-intensive, so plan for logon patterns such as many users signing in at the start of a work day.

If a recommended size lands outside these ranges, or a pool's [maximum session limit](/entity/avd-maximum-session-limit/) was set for the old size, review it. [Nerdio's article on analysing AVD user workload performance](https://getnerdio.com/blog/how-to-analyze-avd-user-workload-performance/) warns that Azure Advisor may flag an underutilised VM for shutdown and deallocation without recognising it as a session host. The Nerdio rules work from the thresholds above and can be scoped to chosen host pools.

## Sources

- [Nerdio Help: Rules overview](https://nmehelp.getnerdio.com/hc/en-us/articles/48236028197261-Rules-overview)
- [Nerdio Help: Rules: Right-size AVD pooled desktops](https://nmehelp.getnerdio.com/hc/en-us/articles/48236074482957)
- [Nerdio Help: Rules: Right-size AVD personal desktops](https://nmehelp.getnerdio.com/hc/en-us/articles/26124376589965)
- [Nerdio Help: Recommendations dashboard](https://nmehelp.getnerdio.com/hc/en-us/articles/26124376554381)
- [Nerdio: Unveiling Nerdio Manager for Enterprise 6 and Nerdio Manager for MSP 5 (2 April 2024)](https://getnerdio.com/blog/unveiling-nerdio-manager-for-enterprise-6-and-nerdio-manager-for-msp-5/)
- [Nerdio: How to right-size shared host pools (21 May 2024)](https://getnerdio.com/blog/how-to-right-size-shared-host-pools/)
- [Nerdio: Smarter cloud desktop management in Nerdio Manager for Enterprise 7 (8 April 2025)](https://getnerdio.com/blog/smarter-cloud-desktop-management-in-nerdio-manager-for-enterprise-7/)
- [Nerdio: How to analyze AVD user workload performance](https://getnerdio.com/blog/how-to-analyze-avd-user-workload-performance/)
- [Nerdio Help: NME entitlements consumption and billing](https://nmehelp.getnerdio.com/hc/en-us/articles/26124388880397-NME-entitlements-consumption-and-billing)
- [Nerdio: Enterprise pricing and feature comparison](https://getnerdio.com/pricing/enterprise/)
- [Nerdio Help: Host Pool Azure Monitor Configuration](https://nmehelp.getnerdio.com/hc/en-us/articles/26124387428621-Host-Pool-Azure-Monitor-Configuration)
- [Microsoft Learn: Session host virtual machine sizing guidelines](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/session-host-virtual-machine-sizing-guidelines)
- [Microsoft Learn: Use Azure Virtual Desktop Insights](https://learn.microsoft.com/en-us/azure/virtual-desktop/insights)
- [Microsoft Learn: Log Analytics agent overview](https://learn.microsoft.com/en-us/azure/azure-monitor/agents/log-analytics-agent)
