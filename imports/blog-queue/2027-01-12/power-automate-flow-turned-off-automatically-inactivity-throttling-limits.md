---
title: "Power Automate Flow Turned Off Automatically: Inactivity, Throttling and Limits"
summary: "Why Power Automate turns cloud flows off: 14 days of continuous errors or throttling, 90 days without a trigger, plus run duration, request limits per 24 hours, Process licenses and the gaps in the Learn limits page."
status: review
publish: false
author: mirko-p
date: 2027-01-12
topics: [power-automate]
keypoints:
  - "A cloud flow whose trigger or actions fail continuously is turned off. Learn gives 14 days for flows with errors and for consistently throttled flows."
  - "A flow not triggered within 90 days might be turned off. Owners and co-owners are notified 30 days before. Flows of premium-licensed owners or with Process licenses are not subject to this."
  - "Run duration and run retention are both 30 days, and pending steps such as approvals time out after 30 days."
  - "Requests per 24 hours depend on the performance profile: Low 10,000, Medium 200,000, High 500,000, Unlimited Extended 10,000,000. The page calls these approximations."
  - "The page does not define fail continuously or consistently throttled, and gives no notice period for error or throttling shutoffs."
faq:
  - q: "When does Power Automate turn a flow off?"
    a: "Microsoft Learn lists three cases: a cloud flow whose trigger or actions fail continuously (14 days), a flow that is consistently throttled (14 days), and a flow that is not triggered within a 90-day period, which might be turned off."
  - q: "Do I get a warning?"
    a: "For the 90-day inactivity rule, flow owners and co-owners are notified 30 days before suspension and can turn the flow back on. For throughput violations the page only says to monitor email for notifications."
  - q: "Which flows are exempt from the inactivity rule?"
    a: "Flows owned by users with premium licenses or assigned capacity licenses (Power Automate Process, per flow) are not subject to the suspension."
  - q: "How do I avoid throttling?"
    a: "Learn says to assign Power Automate Process licenses to the flow to dedicate capacity. After the transition period, a user's flows share the user's action limit, so splitting a workload across more flows does not add capacity."
  - q: "How long can a run last?"
    a: "Run duration is 30 days, calculated from the run's start time, including flows with pending steps like approvals. After 30 days pending steps time out. Run retention in storage is also 30 days."
---

A flow that stops running without anyone turning it off is usually switched off by the service. The cause is one of three conditions: continuous errors, constant throttling or long inactivity. This guide follows the Microsoft Learn page on Power Automate limits and configuration. The page is long. This guide covers the first 100,000 of its roughly 117,500 characters, which includes the flow shutoff, duration and request limit sections.

## Shutoff conditions

| Condition | Limit | What the page says |
| --- | --- | --- |
| Flows with errors | 14 days | A cloud flow that has a trigger or actions that fail continuously is turned off |
| Flows without trigger activity | 90 days | A cloud flow not triggered within 90 days might be turned off |
| Consistently throttled flows | 14 days | A cloud flow that is consistently throttled is turned off |

**Inactivity details.** Flows owned by users with premium licenses or assigned capacity licenses (Power Automate Process, per flow) are not subject to this suspension. Owners and co-owners are notified 30 days before suspension and can turn the flow back on.

**Throttling details.** Learn says to assign Power Automate Process licenses to the flow to dedicate capacity and avoid throttling. In the throughput section it says that if a flow consistently stays above the limits for 14 days, the system turns it off, and you should monitor email for notices.

## Run duration and retention

- Run duration: 30 days, calculated from the start time. It includes flows with pending steps such as approvals. After 30 days, pending steps time out.
- Run retention in storage: 30 days.
- If you test a flow that runs longer than 10 minutes, you might see a timeout message in Power Automate even though the flow keeps running in the background.

## Request limits

- **Per 5 minutes (transition period):** 100,000 requests. Distribute the workload across more than one flow as necessary.
- **Per 24 hours by performance profile (transition period):**

| Performance profile | Requests per 24 hours |
| --- | --- |
| Low | 10,000 |
| Medium | 200,000 |
| High | 500,000 |
| Unlimited Extended | 10,000,000 |

The page calls these approximations of how many requests are allowed daily, not guarantees. After the transition period ends, a user's flows share the user's action limit, so splitting a workload across more flows does not add capacity. To give a flow its own capacity, assign a Process license to the flow or to a flow group that contains it.

- Concurrent outbound calls: 500 for Low, 2,500 for all others.
- Each additional Process license adds 250,000 actions per day. A flow group can share one Process license across up to 25 flows. Stacking is not available for flow groups.
- One action counts as one Power Platform request. Successful and failed actions count, and so do retries and pagination requests.

## What the page does not say

- A notice period for error or throttling shutoffs. The 30-day warning is stated only for inactivity.
- What fail continuously and consistently throttled mean in numbers.
- Whether manual runs, edits or turning the flow back on reset the 90-day clock.
- A post-transition value for the 24-hour request limit.
- The page is also inconsistent in certainty: inactivity says might be turned off, while errors and throttling say is turned off.

## A response outline

This outline is practical advice built on the page.

1. Open the flow's run history and look for the error that repeated for days.
2. Fix the failing trigger or action first, then turn the flow on again.
3. For throttling, check the owner's request volume and consider a Process license for the busy flow.
4. For inactivity, watch for the 30-day warning email and turn the flow back on or assign a covering license.
5. Do not rely on approximations for daily limits when you plan capacity.

## Typical mistakes

- Turning a flow back on without fixing the fault that caused 14 days of errors.
- Splitting a heavy workload across several flows after the transition period and expecting more capacity.
- Missing the warning email sent to owners and co-owners.
- Ignoring that approvals can keep a run pending for up to 30 days.

## Related

- [Power Automate](https://www.m365.fm/entity/power-automate/)
- [Power Platform admin center](https://www.m365.fm/entity/power-platform-admin-center/)
- [Dataverse](https://www.m365.fm/entity/dataverse/)

## Sources

- [Limits and configuration in Power Automate (Microsoft Learn)](https://learn.microsoft.com/power-automate/limits-and-config)
