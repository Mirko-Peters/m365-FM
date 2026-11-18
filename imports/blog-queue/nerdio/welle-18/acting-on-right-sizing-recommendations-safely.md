---
title: "Acting on right-sizing recommendations safely"
summary: "Apply a Nerdio right-sizing recommendation to one host pool first, scheduled outside business hours and with a message to active users, because resizing restarts a running Azure VM. Includes a before, during and after checklist."
status: review
publish: false
author: mirko-p
date: 2026-11-18
render: v2
topics: [nerdio-right-sizing, nerdio-advisor]
keypoints:
  - "The Apply dialog offers Run now or a schedule and an optional message to active users. Nerdio says a change can be non-disruptive when scheduled outside business hours."
  - "Resizing a running VM restarts it. Windows VMs can only move between sizes that both have or both lack a temp disk. After a failed resize the portal shows the requested size; check the guest OS."
  - "Check the data before applying: 72 hours of power-on time is the reliable minimum, and Nerdio recommends 1 to 4 weeks before accepting changes. Data from before a resize is excluded."
  - "A size change can need new session limits: Nerdio's D4as_v5 to D8as_v5 example doubles the session limit from 4 to 8 to keep 1 user per CPU, raising the pool maximum to 304."
  - "The pages listed under Sources do not describe an undo, the per-VM sequence of an Advisor apply, or whether Apply changes session limits, so test on one pool and keep the previous size noted."
faq:
  - q: "Will users be disconnected when I apply a recommendation?"
    a: "They can be. Azure restarts a running VM when its size changes. The Apply dialog lets you schedule the change and send a message to active users, with a delay in minutes before the process starts. The section on what happens in Azure explains how Nerdio's non-disruptive claim fits with the restart. The pages listed under Sources do not say whether Apply drains hosts first."
  - q: "What does Hide for 7 days or Hide forever do?"
    a: "They are two entries in the action menu of a recommendation. Nerdio's Recommendations dashboard page names them but does not describe how a hidden recommendation can be restored, so treat Hide forever as something to use only after you have decided to keep the current size."
  - q: "Can I apply several recommendations at once?"
    a: "Nerdio's Recommendations page has a Bulk apply menu for recommendations you have selected, but it does not list which bulk actions the menu offers. Because each host pool differs in session limits and user behaviour, a sensible approach is to apply one pool, verify it, then bulk apply similar pools. That order is our suggestion, not a Nerdio requirement."
---

Apply a Nerdio right-sizing recommendation to one host pool first, on a schedule outside business hours and with a message to active users, because Azure restarts a running VM when its size changes. Then check session limits and user experience before repeating it elsewhere.

The checklist covers the AVD rules (pooled and personal), not the Right-sizing (Cloud PC) rule for Windows 365 that the Recommendations dashboard also lists. It assumes you can already read a recommendation: "VM right-sizing in Nerdio: reading the utilisation recommendations" covers rules, thresholds and data windows, and "Right-sizing host pools with Nerdio Advisor: a worked example" follows one pool. Confirm menu names in your own [Nerdio Manager for Enterprise](https://www.m365.fm/entity/nerdio-manager-for-enterprise/) tenant.

## Before you apply

1. **Check the data.** Nerdio recommends gathering 1 to 4 weeks of data before accepting changes and treats 72 hours of power-on time as the reliable minimum; the article on reading the recommendations has the thresholds. Data from before a resize is excluded, so a pool resized last week is judged on a short window. If month-end processing is outside the data, wait.
2. **Check the rule.** Confirm that **Respect quota** and **Allowed VM sizes** match your intent, and whether **Active sessions only** is on. The pooled rule needs a dynamic host pool with auto-scale on and CPU and RAM gathering enabled; the personal rule has its own prerequisites.
3. **Check the target size against Azure's limits.** From Microsoft Learn's resize article:
   - A Windows VM can only resize from a size with a temp disk to another with a temp disk, or from a size without one to another without one.
   - A SCSI-based VM cannot be resized to a remote NVMe-enabled size.
   - If the VM uses Premium Storage, pick an **s** size, for example Standard_E4s_v3 rather than Standard_E4_v3.
   - If the new size is not available on the hardware cluster hosting the VM, deallocation may be needed first, which releases dynamic IP addresses.
4. **Check the density.** For a pooled pool, compare the recommended size with Microsoft's [session host](https://www.m365.fm/entity/avd-session-host/) sizing guidance, whose vCPU and user-count ranges the reading article quotes. Then see the next section on session limits.
5. **Note the current state.** Write down the pool's current size, session limit and auto-scale settings. The pages listed under Sources describe no undo, so our reading is that the way back is another size change.

## Session limits and capacity change with the size

For [pooled](https://www.m365.fm/entity/avd-pooled-host-pool/) pools, a larger VM can go with a higher session limit, and a higher limit can multiply the pool's maximum capacity. Nerdio's help article on machine size and density shows the arithmetic for a manual size change in the auto-scale configuration, not the Advisor apply, for a pool that must regularly accommodate 120 user sessions:

- Current: D4as_v5, session limit per host 4, base host pool capacity 30, minimum active host capacity 2, burst beyond base capacity 8 (up to 150 users), 15 hosts pre-staged for the start of work hours.
- Target: D8as_v5, keeping the same density of 1 user per CPU. Change the VM size, set the session limit per host to 8 in **Host Pool Properties**, which raises the maximum host pool sessions to 304.
- Offset it in **Host Pool Sizing**: base capacity 15, minimum active host capacity 2, burst 4 (still up to 150 users). Under **Pre-stage Hosts**, set the hosts to be active by the start of work hours to 8.
- If the pool has several schedules, adjust the pre-stage value in each one. Nerdio's article says moving to a smaller size follows the same steps.

The [maximum session limit](https://www.m365.fm/entity/avd-maximum-session-limit/), the capacity values and the pre-stage count were tuned for the old size, so review them with the size change, not afterwards. [Nerdio auto-scaling](https://www.m365.fm/entity/nerdio-auto-scaling/) interacts here: the pages listed under Sources do not describe what happens if an auto-scale event coincides with an applied size change, so avoid scheduling the change in a ramp-up window (our suggestion). Nerdio documents **Exclude from auto-scale** for single hosts (scale in, or scale in and scale out, indefinitely or until a set time) but does not link it to Advisor, so treat it as an option to test.

## What the Apply dialog offers

On **Observability** > **Advisor** > **Recommendations**, the action menu of a recommendation has **Apply**, **Hide for 7 days** and **Hide forever**. The Apply dialog has these parts, according to the Recommendations dashboard page:

- **Run now** or a schedule, which runs the task in the time frames you select. Without a schedule, the task starts as soon as you confirm.
- A **Messaging** toggle that sends a message to active users, with a **Delay** drop-down (minutes to wait after the message before the process begins) and a **Message** text box.
- **Run now** to finish an unscheduled task, or **Save and Close** for a scheduled one.

Selected recommendations can go through the **Bulk apply** menu. The worked example shows the same dialog in one step.

What the pages listed under Sources do not say: the order in which hosts are processed, whether hosts are drained first, how many hosts change at once, what happens to a host with active sessions when the delay ends, and whether Apply also changes the session limit or auto-scale settings. Test it on a small pool.

### Draining hosts yourself

If you want certainty about who is signed in, [drain mode](https://www.m365.fm/entity/avd-drain-mode/) is the native tool. Microsoft Learn says a host in drain mode accepts no new sessions, existing connections stay active until the user signs out or an administrator ends the session, and you should wait until no sessions remain before maintenance. In the Azure portal, open the host pool, **Session hosts**, select the host and choose **Turn drain mode on** (role: Desktop Virtualization Session Host Operator).

### The Resize/Re-image alternative

Nerdio also has **Resize/Re-image**, opened from the more options menu of a host pool under **Hosts** > **Resize/Re-image**. The "Bulk Host Actions" page lists it as **Re-size/Re-image** under the **Manage Hosts** action menu. Its dialog includes **Run now** or a schedule, a **Desktop Image**, an optional **VM Size**, **Process Host in Groups Of**, **Number of failures before aborting**, an option to set the remaining hosts to drain mode after the first group is done, and **Force Users to Log Off**. Drain mode while waiting for users is on by default and can be cleared only when **Force Users to Log Off** is Never. You confirm by typing CONFIRM. Nerdio's page does not connect this dialog to recommendations, and it deploys an image, so it is a re-image and not only a resize. Use it when you were planning an image update anyway, and check first what it does to local data on a [personal](https://www.m365.fm/entity/avd-personal-host-pool/) desktop.

## What happens in Azure

Microsoft Learn calls resizing a running VM "a disruptive operation, especially for stateful workloads" and says that changing the size of a running VM causes a restart. Nerdio's announcement of version 6.0 says changes can be implemented non-disruptively directly from the recommendation by scheduling the size update outside business hours. Nerdio does not say how that avoids the restart. Our reading is that it holds only when nobody is signed in and nothing stateful is running at the scheduled time. Learn also says that if a resize fails, the VM model still shows the requested size while the VM keeps running at the previous one, in the Azure portal and all GET operations. So a size shown in the portal does not prove the resize worked. Checking vCPU count and RAM inside the guest OS is our suggestion, because the Nerdio pages do not describe the task result of an Apply.

## A rollout plan

1. Pick the smallest or least critical pool with a recommendation and note its current size and limits.
2. Work through the checklist above.
3. For personal pools, tell the owners; for pooled pools, check when users are normally signed in.
4. Schedule the apply outside business hours with a message and a delay of a few minutes.
5. After the task, check the vCPU count and RAM inside the guest OS of a host, then the session limit and the auto-scale values. Sign in with a test user.
6. Watch user experience for a few days. Nerdio's article on AVD user workload performance calls user input delay its north-star metric and, quoting Microsoft's AVD Insights documentation, says it should ideally stay below 100 ms per host. Microsoft's sizing guidance separately cites a 200 ms response time users expect for their actions, a different figure. [AVD Insights](https://www.m365.fm/entity/avd-insights/), a dashboard built on Azure Monitor Workbooks, is one place to look.
7. Wait for new data before judging the next recommendation. The rule needs power-on time on the new size, and with auto-scale shutting hosts down that takes more calendar days than hours.
8. Then repeat for similar pools, with **Bulk apply** if they share a configuration.

## Hide or apply later

**Hide for 7 days** hides a recommendation for a week, which suits a pool in a change freeze (our suggestion). **Hide forever** is permanent; the page does not say how to bring it back (the page mentions a **Filter by Status** drop-down without listing its values), so use it only when you have decided to keep the current size. If a GPU or licence ties you to one size, adjusting **Allowed VM sizes** on the rule is better than hiding rows one by one (our suggestion).

## Limits of this guidance

The Nerdio pages listed under Sources do not describe the internal sequence of a resize, rollback behaviour or interaction with auto-scale. Which edition includes the AVD right-sizing rules is open, because Nerdio's sources differ. Its entitlement and billing page lists "Advisor Recommendations for AVD" among the features that require a Premium entitlement (Windows Cloud Premium or AVD Premium) and are not included with Windows Cloud Core or AVD Core. Nerdio's current pricing page ticks "Nerdio Advisor and TCO analysis" for both Windows Cloud Premium and Windows Cloud Core, not for Physical Endpoints, and has no separate right-sizing row. A May 2024 Nerdio article describes right-sizing for pooled pools as a premium feature of version 6.0 and later. The names differ between these pages and they do not agree on Core. Our reading is that the more specific entitlement page is the better guide for the AVD rules, but confirm with Nerdio what your licence includes. The entitlement page also says each tenant is licensed under one model, Windows Cloud or AVD, in a Core or Premium edition. Nerdio's shared host pools article says requirements drift over time, so review right-sizing regularly.

## Sources

- [Nerdio Help: Recommendations dashboard](https://nmehelp.getnerdio.com/hc/en-us/articles/26124376554381)
- [Nerdio Help: Rules overview](https://nmehelp.getnerdio.com/hc/en-us/articles/48236028197261-Rules-overview)
- [Nerdio Help: Rules: Right-size AVD pooled desktops](https://nmehelp.getnerdio.com/hc/en-us/articles/48236074482957)
- [Nerdio Help: Rules: Right-size AVD personal desktops](https://nmehelp.getnerdio.com/hc/en-us/articles/26124376589965)
- [Nerdio Help: Auto-scale: Adjusting Machine Size/Density Considerations](https://nmehelp.getnerdio.com/hc/en-us/articles/30352409540109-Auto-scale-Adjusting-Machine-Size-Density-Considerations)
- [Nerdio Help: Resize/re-image a host pool](https://nmehelp.getnerdio.com/hc/en-us/articles/26124319282061)
- [Nerdio Help: Bulk Host Actions](https://nmehelp.getnerdio.com/hc/en-us/articles/26124350758669-Bulk-Host-Actions)
- [Nerdio: Unveiling Nerdio Manager for Enterprise 6 and Nerdio Manager for MSP 5 (2 April 2024)](https://getnerdio.com/blog/unveiling-nerdio-manager-for-enterprise-6-and-nerdio-manager-for-msp-5/)
- [Nerdio Help: Auto-scale Session Host Scale In-Out Restrictions](https://nmehelp.getnerdio.com/hc/en-us/articles/26124393705741-Auto-scale-Session-Host-Scale-In-Out-Restrictions)
- [Nerdio Help: NME entitlements, consumption and billing](https://nmehelp.getnerdio.com/hc/en-us/articles/26124388880397-NME-entitlements-consumption-and-billing)
- [Nerdio: Enterprise pricing and feature comparison](https://getnerdio.com/pricing/enterprise/)
- [Nerdio: How to right-size shared host pools (21 May 2024)](https://getnerdio.com/blog/how-to-right-size-shared-host-pools/)
- [Nerdio: How to analyze AVD user workload performance](https://getnerdio.com/blog/how-to-analyze-avd-user-workload-performance/)
- [Microsoft Learn: Change the size of a virtual machine](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/resize-vm)
- [Microsoft Learn: Configure drain mode in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/drain-mode)
- [Microsoft Learn: Session host virtual machine sizing guidelines](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/session-host-virtual-machine-sizing-guidelines)
- [Microsoft Learn: Enable Insights to monitor Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/insights)
