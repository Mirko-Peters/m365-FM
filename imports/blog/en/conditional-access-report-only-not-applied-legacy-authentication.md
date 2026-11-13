---
title: "Report-Only Shows 'Not Applied': How to Test a Block Legacy Authentication Policy with Sign-In Logs"
summary: "A report-only Conditional Access policy that only shows Not applied may be good news. Find real legacy authentication in the sign-in logs and read the results before you enable the block."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [conditional-access, conditional-access-report-only-mode, legacy-authentication, microsoft-entra-sign-in-logs]
keypoints:
  - "Report-only mode does not enforce anything and does not generate traffic. A policy only shows a result when a sign-in matches its conditions."
  - "Learn says to look for legacy authentication in both the Sign-in logs and the User sign-ins (non-interactive) tab, filtered by Client App."
  - "Report-only: Not applied means not all conditions were met. For a block-legacy policy, no Failure results suggests no legacy authentication in the period you checked."
  - "Exclude emergency access accounts, and at least one account that must keep legacy authentication, so you cannot lock yourself out."
faq:
  - q: "What does 'Report-only: Not applied' mean?"
    a: "Microsoft Learn defines it as a result where not all conditions of the policy were satisfied, for example the user is excluded or the sign-in did not use a client app the policy targets. For a policy that targets legacy clients, it simply means those sign-ins did not match."
  - q: "How do I find sign-ins that use legacy authentication?"
    a: "Learn says to open the Sign-in logs under Monitoring and health, add the Client App column, filter on the legacy protocols, and repeat on the User sign-ins (non-interactive) tab. A Microsoft moderator in a 2026 Q&A thread said legacy sign-ins show up under Other clients, mainly in the non-interactive logs."
  - q: "Can I generate test traffic to check a report-only policy?"
    a: "Report-only does not simulate anything. A result appears only when a real sign-in matches the policy. Test with a client that really uses legacy authentication, or use the Policy impact view and the Insights and Reporting workbook to review existing sign-ins."
  - q: "Do user-scoped policies block service principals?"
    a: "No. Learn says calls made by service principals are not blocked by Conditional Access policies scoped to users. Use Conditional Access for workload identities for those, and replace scripts that use service accounts with managed identities where you can."
---

A team creates a Conditional Access policy that blocks legacy authentication and leaves it in report-only mode. They open the Conditional Access insights and see only one result, `reportOnlyNotApplied`. Is the policy broken? Can it be turned on safely?

This question was asked in a Microsoft Q&A thread in March 2026. A Microsoft moderator answered, the answer was accepted, and the person who asked thanked them. The first reply used a filter name that did not exist in the asker's portal, and a later reply corrected it. I checked the steps against the current Microsoft Learn pages. This is not an official Microsoft procedure.

## What the symptom really tells you

Learn lists four report-only results:

| Result | Learn's meaning |
|---|---|
| **Report-only: Success** | All conditions were met, and the required grant and session controls were satisfied |
| **Report-only: Failure** | All conditions were met, but not all required grant or session controls were satisfied |
| **Report-only: User action required** | All conditions were met, but the user would have needed to act, for example to complete MFA. Users are not prompted in report-only mode |
| **Report-only: Not applied** | Not all conditions were met, for example the user is excluded |

The asker's value `reportOnlyNotApplied` corresponds to the last row. For a policy that targets legacy clients, "not applied" means the sign-ins in that view did not match the policy. The moderator in the thread said the same and added that report-only mode does not simulate traffic.

Learn also notes that report-only mode does not enforce grant or session controls. Nobody is blocked or prompted.

## Step 1: Check how the policy is set up

Learn describes the policy this way. You need at least the Conditional Access Administrator role.

1. In the Microsoft Entra admin center, go to **Entra ID** > **Conditional Access** > **Policies** > **New policy**.
2. Under **Users or workload identities**, include **All users**. Exclude your emergency access accounts.
3. Under **Target resources**, include **All resources (formerly 'All cloud apps')**.
4. Under **Conditions** > **Client apps**, set **Configure** to **Yes** and check only **Exchange ActiveSync clients** and **Other clients**.
5. Under **Grant**, select **Block access**.
6. Set **Enable policy** to **Report-only** and select **Create**.

Learn also tells you to exclude at least one account that must keep legacy authentication, so you do not lock yourself out, and to remember that service principals are not covered by user-scoped policies.

## Step 2: Look for real legacy sign-ins in the logs

Learn says to use at least the Reports Reader role and do this:

1. Go to **Entra ID** > **Monitoring & health** > **Sign-in logs**.
2. Add the **Client App** column through **Columns**.
3. Select **Add filters** > **Client App** and choose the legacy authentication protocols.
4. Repeat on the **User sign-ins (non-interactive)** tab.

The Learn page stresses checking both places. The sign-in log has four types: interactive user, non-interactive user, service principal and managed identity sign-ins. The older sign-in log experience shows only interactive sign-ins.

This is where the thread got stuck. The asker could not find a "Legacy authentication clients" option, because the portal listed **Other clients**. The moderator's corrected advice was to filter **Client app** on **Other clients** in the **User sign-ins (non-interactive)** logs. Learn names **Other clients** and **Exchange ActiveSync clients** as the legacy options in the policy, but it does not say in the pages I used that every legacy protocol appears as **Other clients**. So check both, and open a sample sign-in to read its **Client App** value under **Basic Info**.

Learn also points to the **Sign-ins using legacy authentication** workbook for triage.

## Step 3: Add the Conditional Access result to the view

In the thread, the accepted answer told the asker to add the **Conditional Access** column to the non-interactive view and read the result for the policy. To check one event in detail, open the sign-in and use the **Conditional Access** and **Report-only** tabs. Learn says they show which policies were enabled, in report-only mode, applied or not applied.

How to read what you see:

- **Report-only: Failure** on a sign-in that used a legacy client. For a policy with **Block access**, the grant control cannot be met, so this is what you would expect for sign-ins that would be blocked. The moderator in the thread described it the same way. Learn's general definition of Failure fits, but its pages do not spell out this exact case.
- **No entries, or only Not applied.** Legacy authentication was probably not in use in the period you checked. The moderator said that enabling the policy should then not affect users.

Check a long enough period. A monthly job or a rarely used scanner may appear only once a month. Learn does not state the log retention in the pages I used, so confirm your own retention.

## Step 4: Use the aggregated views

If you do not want to open events one by one, which the asker asked about, Learn describes two options:

- **Policy impact**, available to admins with at least the Security Reader role. It shows the impact for the past 24 hours, 7 days or 1 month, with links to sample sign-ins.
- The **Insights and Reporting** workbook. Learn says it can compare report-only and enforced results, and that it needs Microsoft Entra ID P1 and a Log Analytics workspace that receives sign-in logs.

A Conditional Access What If tool exists, and Learn links to it from its troubleshooting page, but I did not verify its steps for this article.

## Step 5: Fix what you find

For each legacy sign-in you find, identify the app or device and its owner. Move it to modern authentication, or replace a service account used in scripts with a managed identity, as Learn suggests. Learn's policy steps exclude accounts that must keep legacy authentication, so keep that exclusion list as short as you can.

## Step 6: Turn it on in stages

Learn says that once you are comfortable with the results, you can switch **Enable policy** from **Report-only** to **On**, or stage the rollout by adding specific groups and excluding others. Once the policy is on, Learn's list of Conditional Access error codes includes `AADSTS53003`, shown as `BlockedByConditionalAccess`, which is the code you would look for on blocked sign-ins. Keep the emergency access exclusion in place.

## One caution for other report-only policies

Learn warns that report-only policies that require a compliant device can show certificate prompts to users on macOS, iOS and Android, and those prompts can repeat until the device is compliant. To avoid this, exclude those device platforms from such policies. This does not apply to a block-legacy policy, but it matters if you test other policies the same way.

## Limits

- The thread explains the symptom, but it cannot tell you whether your tenant has legacy traffic. Your logs can.
- The statement that legacy sign-ins appear as **Other clients** in non-interactive logs comes from the moderator, and Learn's pages I used do not confirm it as a rule.
- Learn's pages show no retention period for the logs. Check your own.

## Related

- [Conditional Access](https://www.m365.fm/entity/conditional-access/)
- [Conditional Access report-only mode](https://www.m365.fm/entity/conditional-access-report-only-mode/)
- [Legacy authentication](https://www.m365.fm/entity/legacy-authentication/)
- [Microsoft Entra sign-in logs](https://www.m365.fm/entity/microsoft-entra-sign-in-logs/)

## Sources

- [Microsoft Learn: Block legacy authentication with Conditional Access](https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-block-legacy-authentication)
- [Microsoft Learn: Conditional Access report-only mode](https://learn.microsoft.com/en-us/entra/identity/conditional-access/concept-conditional-access-report-only)
- [Microsoft Learn: Troubleshoot Conditional Access with sign-in logs](https://learn.microsoft.com/en-us/entra/identity/conditional-access/troubleshoot-conditional-access)
- [Microsoft Learn: Sign-in logs in Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/identity/monitoring-health/concept-sign-ins)
- [Microsoft Q&A: How to evaluate the result of a Conditional Access policy (March 2026)](https://learn.microsoft.com/en-us/answers/questions/5794171/how-to-evaluate-the-result-of-a-conditional-access)
