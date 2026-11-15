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
  - "A flow not triggered within 90 days might be turned off. Owners and co-owners are notified 30 days before. Premium-licensed owners and flows with Process or per-flow licenses are exempt."
  - "Run duration and run retention are both 30 days, and pending steps such as approvals time out after 30 days."
  - "Requests per 24 hours depend on the performance profile: Low 10,000, Medium 200,000, High 500,000, Unlimited Extended 10,000,000. The page calls these approximations."
  - "The page does not define fail continuously and gives no notice period for error or throttling shutoffs. It only says to monitor email."
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

Power Automate can turn a cloud flow off. The page lists three conditions for this: continuous errors, constant throttling and long inactivity. It also lists billing-related suspension reasons. This guide follows the Microsoft Learn page Limits of automated, scheduled, and instant flows. It covers the flow shutoff, duration and request limit sections and leaves out the many other limits on the page.

## Shutoff conditions

| Condition | Limit | What the page says |
| --- | --- | --- |
| Flows with errors | 14 days | A cloud flow that has a trigger or actions that fail continuously is turned off |
| Flows without trigger activity | 90 days | A cloud flow not triggered within 90 days might be turned off |
| Consistently throttled flows | 14 days | A cloud flow that is consistently throttled is turned off |

**Inactivity details.** Flows owned by users with premium licenses or assigned capacity licenses (Power Automate Process, per flow) are not subject to this suspension. Owners and co-owners are notified 30 days before suspension and can turn the flow back on.

**Throttling details.** Learn says to assign Power Automate Process licenses to the flow to dedicate capacity and avoid throttling. In the throughput section it says that if a flow consistently stays above the limits for 14 days, the system turns it off, and you should monitor email for notices. Until then, flow activity slows and resumes automatically when the sliding window is below the limit. Updating a flow resets these limits, because they apply to a single version of the flow. If a flow consistently exceeds them, revise it to stay below.

## Run duration and retention

- Run duration: 30 days, calculated from the start time. It includes flows with pending steps such as approvals. After 30 days, pending steps time out.
- Run retention in storage: 30 days.
- If you test a flow that runs longer than 10 minutes, you might see a timeout message in Power Automate even though the flow keeps running in the background. Reopen the view to get the current status.

## Request limits

- **Per 5 minutes (transition period):** 100,000 requests. Distribute the workload across more than one flow as necessary.
- **Per 24 hours by performance profile (transition period):**

| Performance profile | Requests per 24 hours |
| --- | --- |
| Low | 10,000 |
| Medium | 200,000 |
| High | 500,000 |
| Unlimited Extended | 10,000,000 |

The page calls these approximations of how many requests are allowed daily, not guarantees, and says actual amounts might be smaller. A flow's performance profile follows its owner's plan: Low covers Free, Microsoft 365 plans and Power Automate Plan 1, High covers the Process license and the per flow plan, and Unlimited Extended covers pay-as-you-go flows and Dynamics in context flows under a service principal. If the original owner leaves the organization, the flow reverts to the Low profile. The page says the transition period ends for cloud flows under user licenses in a phased rollout starting April 2027. After the transition period ends, a user's flows share the user's action limit, so splitting a workload across more flows does not add capacity. To give a flow its own capacity, assign a Process license to the flow or to a flow group that contains it.

- Concurrent outbound calls: 500 for Low, 2,500 for all others.
- Each additional Process license adds 250,000 actions per day. A flow group can share one Process license across up to 25 flows. Stacking is not available for flow groups.
- One action counts as one Power Platform request. Successful and failed actions count, and so do retries and pagination requests.

## Suspended state and reasons

The maker portal and the Power Platform admin center show suspended flows as suspended. APIs, PowerShell and the Power Automate Management connector action to list flows as admin return State=Suspended with FlowSuspensionReason and FlowSuspensionTime values. The page lists these reasons for runtime limits: AllActionsFailingDetected, AlwaysFailingDetected, ApiCallOverageDetected, BillingConsumption, BillingConsumptionMissingRPALicense and NeverTriggeringDetected. It does not map them to the three rows of the shutoff table.

## What the page does not say

- A notice period for error or throttling shutoffs. The 30-day warning is stated only for inactivity.
- What fail continuously means. For throttling the page only says consistently above the limits for 14 days.
- Whether manual runs, edits or turning the flow back on reset the 90-day clock.
- A post-transition value for the 24-hour request limit.
- The page is also inconsistent in certainty: inactivity says might be turned off, while errors and throttling say is turned off.

## A response outline

This outline is my advice, built on the page.

1. Open the flow's run history and look for the error that repeated for days.
2. Fix the failing trigger or action first, then turn the flow on again.
3. For throttling, check the owner's request volume and consider a Process license for the busy flow.
4. For inactivity, watch for the 30-day warning email and turn the flow back on or assign a covering license.
5. Do not rely on approximations for daily limits when you plan capacity.

## Typical mistakes (my advice)

- Turning a flow back on without fixing the fault that caused 14 days of errors.
- Splitting a heavy workload across several flows after the transition period and expecting more capacity.
- Missing the warning email sent to owners and co-owners.
- Ignoring that approvals can keep a run pending for up to 30 days.

## Related

- [Power Automate](https://www.m365.fm/entity/power-automate/)
- [Power Platform admin center](https://www.m365.fm/entity/power-platform-admin-center/)
- [Dataverse](https://www.m365.fm/entity/dataverse/)

## Sources

- [Limits of automated, scheduled, and instant flows (Microsoft Learn)](https://learn.microsoft.com/power-automate/limits-and-config)
