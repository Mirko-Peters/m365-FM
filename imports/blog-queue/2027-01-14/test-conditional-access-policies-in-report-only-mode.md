---
title: "How to Test Conditional Access Policies in Report-Only Mode Before You Enforce Them"
summary: "Use report-only mode to see what a Conditional Access policy would do, read the seven evaluation results, review sign-in logs, workbooks and policy impact, then switch the policy to On. Includes the macOS, iOS and Android prompt warning."
status: review
publish: false
author: mirko-p
date: 2027-01-14
topics: [conditional-access, conditional-access-report-only-mode, entra-id]
keypoints:
  - "Report-only mode evaluates a policy at sign-in without enforcing grant or session controls, and logs the result."
  - "Policies scoped to User Actions cannot be evaluated in report-only mode."
  - "Results appear on the Conditional Access and Report-only tabs of the sign-in log details."
  - "Report-only policies that require a compliant device can still prompt users on macOS, iOS and Android to pick a certificate; exclude those platforms."
  - "After checking the results, move the Enable policy toggle from Report-only to On."
faq:
  - q: "What does report-only mode do?"
    a: "According to Microsoft Learn it is a policy state that lets administrators test most Conditional Access policies before enabling them. During sign-in the system evaluates policies in report-only mode but does not enforce them, and results are logged in the Conditional Access and Report-only tabs of the sign-in log details."
  - q: "Which policies cannot be tested in report-only mode?"
    a: "Learn says administrators can evaluate policies in report-only mode except for items included in the User Actions scope. The note at the end adds that limitations apply, such as policies that use the User Actions scope."
  - q: "What do the report-only results mean?"
    a: "Learn lists four: Report-only: Success, Failure, User action required and Not applied. Success means all conditions and non-interactive controls were satisfied. Failure means conditions matched but required controls were not satisfied, for example a block control. User action required means a user would have to act, such as MFA, but is not prompted. Not applied means not all conditions matched."
  - q: "Do users get prompted in report-only mode?"
    a: "Not for MFA or terms of use. Learn says users are not prompted for multifactor authentication or blocked by report-only policies. A warning says policies that require a compliant device can prompt users on macOS, iOS and Android to select a device certificate, and the prompts can repeat until the device is compliant."
  - q: "How do I move from testing to enforcement?"
    a: "After confirming your settings with policy impact or report-only results, move the Enable policy toggle from Report-only to On. Learn also advises creating a report-only copy before changing an enforced policy and comparing results."
---

To test a Conditional Access policy safely, create it in **Report-only** state, let real sign-ins run through it, read the results in the sign-in logs, a workbook or the policy impact view, and then move the **Enable policy** toggle from **Report-only** to **On**. Microsoft Learn describes report-only mode as a state that lets you test most policies before enabling them. This guide follows its page on Conditional Access policy insights.

## What report-only does

- Administrators can evaluate policies in report-only mode, except for items in the **User Actions** scope.
- At sign-in the system evaluates the policy but does not enforce it.
- Results are logged on the **Conditional Access** and **Report-only** tabs of the sign-in log details.
- With an Azure Monitor subscription you can also use the Conditional Access insights workbook.

Learn's note at the end of the page repeats the key behavior: report-only mode evaluates policies but does not enforce grant or session controls. Users are not prompted for MFA or blocked by report-only policies.

## A warning about device compliance

Learn warns that report-only policies requiring a **compliant device** can prompt users on macOS, iOS and Android to select a device certificate during evaluation, even though compliance is not enforced. These prompts can repeat until the device is compliant. To avoid this, exclude the Mac, iOS and Android device platforms from report-only policies that perform device compliance checks.

## Read the evaluation results

| Result | Meaning per Learn |
| --- | --- |
| Report-only: Success | All conditions, required non-interactive grant controls and session controls were satisfied. |
| Report-only: Failure | Conditions were satisfied but not all required non-interactive grant or session controls were, for example a block control applies or a device fails a compliant device policy. |
| Report-only: User action required | Conditions were satisfied but a user would have to act to satisfy a control, such as MFA or terms of use. The user is not prompted. |
| Report-only: Not applied | Not all conditions were satisfied, for example the user is excluded or the policy applies only to certain trusted locations. |
| Success | The policy applied, requirements were met and it would allow sign-in. Another policy might still block it. |
| Failure | The policy applied, requirements were not met and it would block sign-in. |
| Not applied | The policy did not apply, for example the user was excluded. |

The last three rows are the results for policies that are enforced. They appear next to the report-only ones in the logs, so you can compare.

## Where to review results

Learn names three options:

1. **Sign-in logs.** Each event shows which policies were enabled, in report-only mode, applied or not applied. Open an event and use the **Report-only** tab.
2. **Workbooks.** The Conditional Access Insights and Reporting workbook lets you visualize policies and query the impact for a time range, set of applications and users. Learn says it requires Microsoft Entra ID P1 and a Log Analytics workspace that receives sign-in logs.
3. **Policy impact (preview).** Admins with at least the **Security Reader** role see a snapshot of potential or existing impact on interactive sign-ins over the past 24 hours, 7 days or 1 month, with a sampling of sign-in events.

## Practices Learn recommends for rollout

- **Test new policies alongside enforced policies.** Create the new policy in report-only mode and watch the results before enforcing.
- **Compare outcomes in the Insights workbook.** View report-only and enforced results side by side.
- **Validate changes to existing policies.** Copy the enforced policy into a report-only version with the proposed change, compare results, then update the enforced policy and remove the copy.
- **AI-assisted phased rollout, where available.** The Conditional Access Optimization Agent creates suggested policies in report-only mode. Learn says it needs Microsoft Security Copilot with provisioned security compute units and Entra ID P1, so it is not enabled in every tenant.
- **A/B testing.** Learn says Conditional Access does not support classical A/B testing that splits live traffic between two enforced variants.

## Switch to enforcement

After confirming the results, move **Enable policy** from **Report-only** to **On**.

## A simple test routine

This is my own routine built on the page.

1. Create the policy with a clear name and report-only state. Exclude your emergency access accounts.
2. Wait until it has seen the sign-ins that matter: all apps, all platforms, key user groups. Learn gives no minimum duration, so I do not either.
3. Filter sign-ins for **Report-only: Failure** and **User action required**. Check whether each affected sign-in belongs to a real person or to a service account.
4. Fix exclusions or conditions and repeat.
5. Switch to **On** for a pilot group first if your design allows it.

## Common mistakes to avoid

This section is my advice, not a Microsoft statement.

- **Judging a policy by one day of logs.** Learn gives no minimum duration, and a single day misses users who sign in only occasionally, such as travelers and part-time staff.
- **Ignoring the Not applied rows.** If a group you meant to cover shows Report-only: Not applied, check the conditions and exclusions before you decide that the policy works.
- **Forgetting that the other policies still apply.** Learn notes that a Success result means the policy would allow sign-in, while another policy might still block it. Read the full list of evaluated policies for the sign-in.
- **Switching on without a rollback plan.** Keep the policy name and settings documented, so that you can set it back to report-only quickly if the rollout causes unexpected blocks.

## Related

- [Conditional Access](https://www.m365.fm/entity/conditional-access/)
- [Conditional Access report-only mode](https://www.m365.fm/entity/conditional-access-report-only-mode/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)

## Sources

- [Conditional Access Policy Insights: Monitoring and Evaluation - Microsoft Entra ID (Microsoft Learn)](https://learn.microsoft.com/entra/identity/conditional-access/concept-conditional-access-report-only)
