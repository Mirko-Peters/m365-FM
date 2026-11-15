---
title: "Power Automate Flow Suspended for a DLP Violation: How to Find the Policy and Fix It"
summary: "A flow was suspended for violating data loss prevention policies, and nobody knows which policy or connector is to blame. Check the flow checker, the policy list and the connector groups in order."
status: approved
publish: false
author: mirko-p
date: 2026-11-13
topics: [power-automate, dlp, power-platform-admin-center, dataverse, advanced-connector-policies]
keypoints:
  - "A suspended flow stays off until the violation is resolved. Learn says a background job suspends flows after a policy is created or changed, so a flow that worked yesterday can be suspended today."
  - "The Learn pages used here do not describe how to see which policy hit a flow. Admins have to compare the connectors in the flow with every policy that applies to the environment."
  - "Business connectors can only be combined with other Business connectors, and Blocked connectors cannot be used. Some policies also block single actions or triggers."
  - "Most policy changes take effect within an hour and the worst case is 24 hours, so wait before you conclude that your fix did not work."
faq:
  - q: "Why was my flow suspended even though I did not change anything?"
    a: "Microsoft Learn says that when a DLP policy is created or changed, a background job scans active flows and suspends violators, within 24 hours. A weekly background check also confirms no check was missed. So a policy change by an administrator can suspend a flow that was working before."
  - q: "Where do I see which policy my flow violated?"
    a: "As a maker, edit and save the flow and read the flow checker panel. Learn says the checker reports a DLP violation. None of the Learn pages used for this article describes a maker-side way to see which policy applies to a given flow, so an admin has to review the data policies that apply to the environment, using the Scope and Applied to columns in the policy list."
  - q: "Do I need an admin to fix it?"
    a: "In most cases, yes. Learn says that if a DLP policy blocks your flow, you should contact your administrator. A maker can remove or replace the offending connector or action in the flow. Changing the policy needs the Power Platform administrator role for tenant policies, or environment admin permissions for environment policies."
  - q: "How long until the flow works again after the policy is fixed?"
    a: "Learn says most data policy changes take effect within an hour, with a worst case of 24 hours. It also says cloud flows suspended in the previous seven days are reactivated automatically if they no longer violate any policy. For older suspended flows, Learn's DLP pages do not describe the steps. Check the flow status and turn it on if needed."
---

You get an email or see a banner: your flow was suspended because it violates your organization's data loss prevention (DLP) policies. It does not say which policy. It does not say which connector.

Three Microsoft Q&A threads from 2026 show this problem. In one, a person received a suspension email for a desk reservation flow and asked which policy was violated. In another, a flow that ran a query and passed the result to an AI Builder prompt was suspended, and the error named a policy and a connector action. In the third, a person asked how to fix a DLP error when automating a web page. None of the three has an accepted answer, so this article uses them only as scenarios and takes the solution from current Microsoft Learn pages. It is a troubleshooting guide, not an official Microsoft procedure.

## What the symptoms look like

- The flow shows as **Suspended** in the maker portal and in the Power Platform admin center.
- Saving the flow shows errors in the flow checker panel.
- Learn says that if the flow violates a DLP policy, the service suspends it and the trigger does not fire. On flow details, under **Properties**, you may see a DLP violation message.
- When a policy blocks certain connectors, Learn says you might see "Looks like this workflow is disabled by your organization" while creating a flow in the portal.
- In one thread, the error text named an admin data policy and said the policy restricted a connector from using a specific connector action.

## What a suspension means

Learn explains the rules in its pages about data policies:

- Connectors are placed in groups: **Business**, **Non-business**, and **Blocked**. Connectors in **Business** can only be used with other **Business** connectors. Blocked connectors cannot be used where the policy applies.
- At design time, a flow with a conflict still saves, but it is marked **Suspended** and does not run until the maker resolves the violation.
- At run time, a background process checks for policy changes. Violating flows are marked as suspended. Running resources that use a blocked connection, action, trigger or MCP server fail.
- For flows with child flows, Learn says a violation anywhere in the flow tree suspends the parent flow.

Learn also lists these three triggers for a check: when a flow is created or edited (real time for flows without child flows), when a policy is created or changed (a background job within 24 hours), and weekly (a consistency check).

## Step 1: Confirm it is a DLP suspension

1. Open [Power Automate](https://make.powerautomate.com) and select the flow.
2. Select **Edit** and then save the flow.
3. Read the flow checker panel. If it reports a DLP violation, you have the cause.

Learn describes this check in its trigger troubleshooting page. If the flow turns off again right after you switch it on, the Learn page on connection failures also points to DLP violations and suggests looking at **flow details** > **Properties** for a DLP violation message.

## Step 2: List what the flow uses

Write down every trigger and action in the flow, and the connector behind each. Include:

- The trigger connector. Learn says some policies block specific triggers.
- Every action connector, including Dataverse actions. Learn says Power Automate uses the **Microsoft Dataverse** connector, and that Power Apps native Dataverse connections are treated like the legacy Dataverse connector for policy purposes.
- Child flows. A violation in a child flow suspends the parent.
- For desktop flows, the modules and actions, which can also be classified as **Business**, **Non-business** or **Blocked**.

## Step 3: Find the policies that apply

This is the step that the Learn pages used here do not cover: none of them describes how to identify which policy applies to a flow. An admin has to look.

Learn's page on managing data policies gives the path:

1. Sign in to the [Power Platform admin center](https://admin.powerplatform.microsoft.com).
2. Select **Security** in the navigation pane.
3. Under Settings, select **Data and privacy**.
4. Select the **Data policy** section.

The policy list has columns for **Name**, **Scope** (environment-level or tenant-level) and **Applied to**, which shows all environments, all environments except some, or specific environments. Learn gives the roles: the **Power Platform Administrator** role for tenant-level policies. For environment-level policies you need Power Apps Environment Admin permissions, or the System Administrator role if the environment has a Dataverse database.

Check every policy whose **Applied to** value includes the environment of the flow. More than one policy can apply. Learn says environment-level policies cannot override tenant-wide policies.

## Step 4: Compare the connector groups

Open each applicable policy and look at the connector groups. Learn says connectors can be in only one group at a time.

Ask these questions:

1. Is any connector of the flow in **Blocked**?
2. Are the connectors of the flow spread across **Business** and **Non-business**?
3. Does the policy use connector action control, which can block single actions or triggers? Learn says this is part of advanced connector policies and describes it as a strict allow list that blocks all connectors by default. The Learn page does not say how existing flows behave after such a policy is applied, so treat an action-level error as a sign to check this feature.

The second thread's error mentioned a policy and an action name together. That fits action-level rules, but the thread did not confirm the cause. One AI-labeled answer there guessed that the Dataverse and AI Builder connectors sit in different groups. Nothing on that page verified it. Check the real policy before you accept any guess.

## Step 5: Choose a fix

Pick one, with the owner of your data governance in the loop:

- **Change the flow.** Remove or replace the connector or action that conflicts, so the flow only uses connectors that the policy allows together. This is the safest option for a maker.
- **Change the policy.** An admin can move connectors so the needed ones share a group, or unblock a connector. Because Learn says a background job suspends violating flows after a policy is created or changed, review what else uses those connectors before you save.
- **Change the scope.** Learn lists an option to exclude certain environments from a policy. This is a governance decision, not a quick fix.
- **Get a business justification ready.** A moderator in the web-automation thread suggested documenting the business need and the data movement before escalating to the security or admin team. This is a process tip from the thread, not a Learn step.

For desktop flows, Learn says background jobs periodically scan them and suspend violators. Learn also says that the tenant setting **Show desktop flow actions in DLP policies** cannot be changed once it is enabled, so check it with care.

## Step 6: Wait for the policy change to apply and reactivate the flow

Learn gives these timings:

- Most data policy changes take effect within an hour. The worst case is 24 hours.
- Cloud flows suspended in the previous seven days are reactivated automatically if they no longer violate any policy.
- Desktop flows that no longer violate a policy are unsuspended by the background job.

For a cloud flow suspended longer than seven days, the Learn DLP pages do not describe the steps. Open the flow, save it, check the flow checker, and turn the flow on. Treat this as something to verify.

## Step 7: For admins, list all suspended flows

Learn's page on DLP policy creation says that suspended flows can be found through the API, PowerShell, or the **List flows as Admin** action of the Power Automate Management connector. Look for:

- `State = Suspended`
- `FlowSuspensionReason = CompanyDlpViolation`
- `FlowSuspensionTime`

Learn does not give a full cmdlet example for this. If you use `Get-AdminFlow` from the `Microsoft.PowerApps.Administration.PowerShell` module, check in your own output that the properties above are present before you build a report on them.

## How to verify the fix

1. Edit and save the flow again. The flow checker should show no DLP violation.
2. Confirm the flow state is no longer **Suspended**.
3. Run the flow and check the run history.
4. If you changed a policy, wait up to the times above before testing again.

## Limits and open points

- The three threads have no accepted answer. None confirms what fixed the case.
- Learn does not give a maker-side way to see the exact policy name. Policy review is an admin task.
- The Learn page on advanced connector policies says it does not describe how existing flows behave after a policy is applied, and it gives no exact error text.
- Learn pages disagree on timing. The data policy overview says full enforcement takes at most 24 hours and usually less than an hour, while the connection failures page says DLP policy changes take effect immediately. Plan for the longer window and check the current text before you change a production policy.

## Related

- [Power Automate](https://www.m365.fm/entity/power-automate/)
- [Data loss prevention](https://www.m365.fm/entity/dlp/)
- [Power Platform admin center](https://www.m365.fm/entity/power-platform-admin-center/)
- [Dataverse](https://www.m365.fm/entity/dataverse/)
- [Advanced connector policies](https://www.m365.fm/entity/advanced-connector-policies/)

## Sources

- [Microsoft Learn: Data loss prevention (DLP) policy creation for Power Automate](https://learn.microsoft.com/en-us/power-automate/prevent-data-loss)
- [Microsoft Learn: Impact of data policies on apps and flows](https://learn.microsoft.com/en-us/power-platform/admin/dlp-impact-policies-apps-flows)
- [Microsoft Learn: Data policies overview](https://learn.microsoft.com/en-us/power-platform/admin/wp-data-loss-prevention)
- [Microsoft Learn: Manage data policies](https://learn.microsoft.com/en-us/power-platform/admin/prevent-data-loss)
- [Microsoft Learn: Advanced connector policies](https://learn.microsoft.com/en-us/power-platform/admin/advanced-connector-policies)
- [Microsoft Learn: Fix connection failures in cloud flows](https://learn.microsoft.com/en-us/power-automate/fix-connection-failures)
- [Microsoft Learn: Troubleshoot common problems with Power Automate triggers](https://learn.microsoft.com/en-us/troubleshoot/power-platform/power-automate/flow-run-issues/triggers-troubleshoot)
- [Microsoft Q&A: Why my flow has been suspended (August 2026)](https://learn.microsoft.com/en-us/answers/questions/5971330/why-my-flow-create-event-snow-desk-reservation-has)
- [Microsoft Q&A: Flow suspended due to DLP violation when using AI Builder (January 2026)](https://learn.microsoft.com/en-us/answers/questions/5707651/power-automate-flow-suspended-due-to-dlp-violation)
- [Microsoft Q&A: DLP Error resolve (May 2026)](https://learn.microsoft.com/en-us/answers/questions/5903079/dlp-error-resolve)
