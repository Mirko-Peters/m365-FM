---
title: "Power Automate SharePoint Trigger Not Firing and No Run History: A Checklist"
summary: "A flow with a SharePoint trigger is on, the list item exists, but no run appears. Check skipped runs, trigger conditions, connections, DLP, licenses and trigger registration in this order."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [power-automate, power-automate-trigger, power-automate-run-history, sharepoint, premium-connectors]
keypoints:
  - "A flow that never starts can still leave traces. Open the 28-day run history and select All runs, because a skipped check means the trigger condition was not met."
  - "Microsoft Learn lists the causes in a fixed order: DLP policy, failing trigger registration, broken connection, premium trigger without a license, skipped check, trigger conditions, permissions."
  - "The banner 'There's a problem with the flow's trigger. Fix the trigger.' means Power Automate could not register the trigger. Learn describes editing and saving the flow to re-register it."
  - "Two 2026 community threads about the same symptom had no accepted answer, so this checklist rests on Learn, not on a confirmed community fix."
faq:
  - q: "Why does my SharePoint flow not start when I add an item?"
    a: "Microsoft Learn names these checks: a data loss prevention policy that suspended the flow, a trigger that failed to register, a broken connection, a premium connector trigger without a suitable license, a skipped trigger check because of a condition, and missing permissions on the site or list. Start with the run history under All runs, then work down the list."
  - q: "Does 'When an item is created' fire when I edit an existing item?"
    a: "No. The trigger name says it fires for new items. Learn says the card title shows when the trigger fires. An independent advisor in a November 2026 Q&A thread also pointed out that editing an existing item does not start this trigger, so test with a new item."
  - q: "How long can a SharePoint trigger take to fire?"
    a: "Learn describes delays that depend on the plan. On the free plan, a flow runs every 15 minutes, and a trigger inside that window is queued. For Flow for Office 365 or Flow for Dynamics 365 plans, the flow does not run again until five minutes have passed. Learn also says to test manually to see whether throttling is the cause."
  - q: "What does 'Fix the trigger' do?"
    a: "The banner says Power Automate retried to register the trigger and failed, so the flow will not start until this is fixed. Learn names blocked Power Automate endpoints as a common cause and asks you to have IT allow the listed addresses and domains. After that, edit the flow and save it, edit it back to its original state and save again, so that the trigger is registered again."
---

You added a new item to a SharePoint list. The item is there. The flow is switched on. But the run history stays empty, and no email goes out.

This symptom appeared in two Microsoft Q&A threads in autumn 2026. In one, a simple flow with the **When an item is created** trigger did not run after several test items. In the other, a flow with a form trigger and an item trigger stopped firing without any failed runs, while a new test flow on the same list still worked. Neither thread has an accepted answer, and neither person came back with a result. So this article does not claim a community fix. It follows the structure of the current Microsoft Learn troubleshooting page for triggers and adds what the threads suggest. It is a troubleshooting guide, not an official Microsoft procedure.

## What the symptoms look like

- The flow is on, but there are no new runs, not even failed ones.
- The source event is real. The list item exists or the form was submitted.
- Sometimes a freshly built test flow with the same trigger and the same list works, while the original flow does not.
- Sometimes the flow worked for weeks and stopped without any change.

## Step 1: Look at the flow Details page

1. Sign in to [Power Automate](https://make.powerautomate.com).
2. Select **My flows** and open the flow.
3. On the **Details** page, check whether this message is shown: `There's a problem with the flow's trigger. Fix the trigger.`

If you see it, jump to Step 8. If not, continue.

## Step 2: Check whether the trigger ran and was skipped

On the same page, open the **28-day run history** and select **All runs**. Learn explains the meaning of a skipped check: the trigger condition was not met, so the flow did not start.

If you see skipped checks, the trigger did notice the event. Your conditions blocked it. Go to Step 3.

If you see nothing at all, the event may not have reached the flow, so keep going down the list.

## Step 3: Review the trigger conditions

Learn gives these steps for the new designer:

1. Select **Edit** on the command bar.
2. Select the first card, which is the trigger.
3. Open the **Settings** tab.
4. Find **Trigger conditions**.

If **Trigger conditions** is empty, you have no extra customizations. The card title, for example **When an item is created or modified**, tells you when the trigger fires.

Remove the conditions for a test and save. If the flow now starts, rebuild the expression and check the values it compares. Learn also warns that expressions in triggers are evaluated only when you save. A value such as `utcNow()` is stored as a fixed value and is not recalculated per run.

## Step 4: Check that your test matches the trigger

This step sounds simple, but it removes false alarms:

- **When an item is created** starts for new items only. In the November 2026 thread, an independent advisor advised testing with a new item, because editing an old one does not fire it.
- Learn says that the trigger **When a file is created or modified** does not fire for files added or changed in subfolders. If your flow watches a library with subfolders, you may need more than one flow.
- Check the **Site Address** and **List Name** on the trigger card. This check comes from an independent advisor's answer in the thread, not from Learn.

## Step 5: Check the connection

Learn says that a connection can break when its password expires, or when an organization policy makes the authentication token expire after a set time.

1. In Power Automate, select **More** and then **Connections**.
2. Find the SharePoint connection that the flow uses.
3. If it shows a problem, select the link next to the **Status** column and follow the steps, or select **Fix connection**.

Also confirm that the account behind the connection still has access to the site and list. Learn lists permissions as a separate check: you need access to the folders, sites or mailboxes that the trigger uses.

## Step 6: Check for a DLP suspension

Learn says that if a data loss prevention policy blocks the flow, the service suspends it, and the trigger does not fire. To confirm, edit the flow and save it. The flow checker reports a violation if there is one.

The fix is not in the flow. An administrator has to find the blocking policy, at tenant or environment level, and change it. If you suspect this, see the separate article on suspended flows and DLP violations.

## Step 7: Check whether the trigger is a premium connector

1. Edit the flow and note the connector name of the trigger.
2. Open the [connectors list](https://make.powerautomate.com/connectors) and search for that connector.
3. If the label **PREMIUM** appears under its name, the flow needs a suitable license.

Learn says premium, on-premises and custom connectors need a standalone Power Apps or Power Automate license. To see the plan in use, select any flow and look at **Plan** in the **Details** section. Check the connectors of the other actions in the flow in the same way, if someone else built it. For shared flows, Learn also notes that users need a Power Automate license, and that Power Apps, Dynamics 365 or Microsoft 365 licenses alone are not enough for premium connectors.

## Step 8: Fix a failed trigger registration

The message `There's a problem with the flow's trigger. Fix the trigger.` means that Power Automate tried to register the trigger again and failed. The flow will not start until this is fixed.

Learn gives this order:

1. Select **Fix the trigger** and select the failed trigger to read the real error. A separate Learn page uses the example of a SharePoint folder that was not found, solved by correcting the folder name. That page is from 2024, but the steps are still the same in the current trigger page.
2. If the cause is a blocked network, ask IT to allow the [Power Automate IP addresses and domains](https://learn.microsoft.com/en-us/power-automate/ip-address-configuration). Learn names missing allowlist entries as a common cause.
3. Edit the flow and save it. Then edit it back to its original state and save again. Learn says the flow detects the setup change and registers the trigger again.

One more point from Learn: the banner can stay visible even after the next trigger event ran fine. If runs are working and the banner remains, you may have hit this known issue.

## Step 9: Work through the generic repair list

If nothing above explains it, Learn lists these steps in this order:

1. Test the flow manually.
2. Remove the trigger and add it again.
3. Switch the connection.
4. Turn the flow off, then on.
5. Export and import the flow.
6. Create a copy of the flow.
7. If the trigger uses special conditions, such as a specific folder, remove the folder and restore it.

The second thread fits step 2 and step 6. The person had already rebuilt the flow and the trigger, and a separate test flow worked. An independent advisor in that thread said that this looks like a trigger registration or flow-specific problem and suggested comparing the failing flow with the working one. That was a hypothesis. The thread does not show it was confirmed.

## Step 10: Account for delays and old events

Do not mistake a delay for a failure.

- On the free plan, Learn says a flow runs every 15 minutes. For Flow for Office 365 and Flow for Dynamics 365 plans, a flow does not run again until five minutes have passed.
- To check for throttling, test the flow manually. If it triggers immediately, throttling is not the cause.
- Learn also says to check **Help + support** in the Power Platform admin center for communication problems.
- When you turn a flow back on, polling triggers can process events that piled up while it was off. If you do not want that, Learn says to delete and recreate the flow.

## How to verify the fix

1. Add a new item to the list. Do not edit an old one.
2. Wait several minutes, then open the run history.
3. Look at **All runs**. A successful run or a skipped check tells you the trigger is alive again.
4. If you removed trigger conditions for testing, add them back and test both a matching and a non-matching item.

## Limits and open points

- Both community threads about this exact symptom are unresolved. The advice here is documented behavior, not a confirmed fix for those two cases.
- One answer in each thread was written by an AI and labeled that way. It is not used as a source here.
- Learn's page has more topics, such as the admin mode setting that stops Dataverse triggers, and URL changes for HTTP triggers. They do not apply to a SharePoint list trigger, so they are left out.
- If every step passes and the trigger still stays silent, collect the flow ID, the time of the test and a screenshot of **Details**, then open a support case.

## Related

- [Power Automate](https://www.m365.fm/entity/power-automate/)
- [Power Automate trigger](https://www.m365.fm/entity/power-automate-trigger/)
- [Power Automate run history](https://www.m365.fm/entity/power-automate-run-history/)
- [Premium connectors](https://www.m365.fm/entity/premium-connectors/)
- [SharePoint](https://www.m365.fm/entity/sharepoint/)

## Sources

- [Microsoft Learn: Troubleshoot common problems with Power Automate triggers](https://learn.microsoft.com/en-us/troubleshoot/power-platform/power-automate/flow-run-issues/triggers-troubleshoot)
- [Microsoft Learn: There is a problem with the flow's trigger](https://learn.microsoft.com/en-us/troubleshoot/power-platform/power-automate/flow-run-issues/there-is-a-problem-with-the-flows-trigger)
- [Microsoft Learn: Fix connection failures in cloud flows](https://learn.microsoft.com/en-us/power-automate/fix-connection-failures)
- [Microsoft Q&A: Power automate flow not triggering when a sharepoint item is created (November 2026)](https://learn.microsoft.com/en-us/answers/questions/6067085/power-automate-flow-not-triggering-when-a-sharepoi)
- [Microsoft Q&A: Power Automate SharePoint Trigger Intermittently Stops Firing with No Run History (October 2026)](https://learn.microsoft.com/en-us/answers/questions/6038408/power-automate-sharepoint-trigger-intermittently-s)
