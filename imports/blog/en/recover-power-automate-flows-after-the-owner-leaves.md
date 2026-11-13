---
title: "Recover Power Automate Flows After the Owner Leaves: Orphaned Flow Checklist"
summary: "A colleague left and their flows are invisible or failing. Find orphaned flows in the Power Platform admin center, add a co-owner, repair connections and restore deleted flows within 21 days."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [power-automate, orphaned-flows, power-platform-admin-center, power-platform-solution, cloud-flow]
keypoints:
  - "Microsoft Learn says an admin with the right privileges can see flows without a valid owner in the Power Platform admin center and add a co-owner with Share. No password of the former employee is needed."
  - "Orphaned flows can fail because their connections belong to the former owner. Adding a co-owner does not repair connections by itself."
  - "A flow that was deleted can be restored for 21 days with the Power Automate Management connector or PowerShell, and it comes back turned off."
  - "An April 2026 Q&A thread had no accepted answer and one reply claimed admins cannot see such flows. Learn says the opposite, so follow Learn."
faq:
  - q: "Can I see a flow of a person who left the company?"
    a: "According to Microsoft Learn, yes if you have appropriate privileges. In the Power Platform admin center, select the environment, open Resources, select Flows and look for flows with no owner in the Owners column. Learn does not name the exact admin role for this view. A community answer in an April 2026 Q&A thread said admins cannot see such flows unless ownership was transferred or the flow sits in a solution. That statement conflicts with Learn."
  - q: "Do I need the former employee's account to take over a flow?"
    a: "Not for the admin center method that Learn describes. An admin selects the flow, selects Share, adds a new owner and saves. The PowerShell method uses Set-AdminFlowOwnerRole with the object ID of the new owner. Both methods assign access to a new person and do not require signing in as the former owner."
  - q: "Why does the flow still fail after I added myself as co-owner?"
    a: "Learn says orphaned flows can fail if they use connections tied to the former user's account. The Learn page on connection failures says that for shared connections, the owner must re-authenticate, or you create your own connection and update the flow. Open the flow, check each connection, and fix or replace it."
  - q: "How can I avoid this problem next time?"
    a: "Learn describes a service principal application user as a non-interactive user, with no user license and subject to non-licensed user limits, so it is not tied to a person who might leave. It cannot be a co-owner and must be set through Details, Edit and Owner. The flow also has to be solution-aware for an in-place owner change, and the connections must be shared with the application user."
---

A person left the company, and an important flow still sits under their name. Maybe it stopped sending emails. Maybe nobody can find it at all.

A Microsoft Q&A thread from April 2026 described this: a team member could not find a flow created by a former colleague and wanted to open it through that colleague's email account. This article collects what the current Microsoft Learn pages say about orphaned flows, and marks where the thread disagrees with Learn. It is a troubleshooting guide, not an official Microsoft procedure.

## What the symptoms look like

- A flow created by a former employee does not show up in your **My flows** list.
- The flow runs, but runs fail after the account was disabled or removed.
- In the admin center, a flow has an empty **Owners** column.
- Nobody on the team knows which connections or licenses the flow uses.

## What the thread said and what Learn says

The April 2026 thread has two replies and no accepted answer. The person who asked never confirmed anything.

- A human answer from an independent advisor said that flows belong to their creator unless co-owners were added, that signing in as the former employee only works while the account still exists, and that admins will not see the flow unless it was transferred or stored in a solution. It also said Power Automate has no built-in way to reassign personal flows.
- An AI-labeled answer listed admin center steps and PowerShell. It is not used as a source here.

Microsoft Learn describes the case differently. The page about orphaned flows says that users with appropriate privileges can view flows that have no valid owner, and it gives an admin center procedure and PowerShell commands to add a co-owner. So the thread's claim that admins cannot see these flows is contradicted by the documentation. Where the two disagree, this article follows Learn. The thread's point about restoring accounts and solutions is still useful as a preventive idea.

## Step 1: Find the flow in the admin center

Learn describes this procedure:

1. Open the [Power Platform admin center environments page](https://admin.powerplatform.microsoft.com/environments) and select the environment that holds the flow.
2. Open the **Resources** tab and select **Flows**.
3. Look for flows with no owner in the **Owners** column.
4. If the list is long, select **Load more** until you have seen all flows.

Learn says only users with appropriate privileges can see flows without a valid owner. It does not name the role. In another Learn page, a Power Platform admin or environment admin can display and manage all flows in an environment. If you cannot see the flow, ask someone with those roles.

## Step 2: Add a new co-owner

Still in the admin center:

1. Select the orphaned flow in the list.
2. Select **Share** at the top of the page.
3. Enter the name of the new owner and select the account.
4. Select **Save**.

A co-owner has almost the same rights as the creator, according to the Learn page on sharing and permissions. A co-owner can view run history, edit the flow, turn it on and off, manage connections, and add or remove other owners. The original creator cannot be removed.

## Step 3: Use PowerShell for one flow or for many

If you have to fix many flows, use the `Microsoft.PowerApps.Administration.PowerShell` module. Learn gives these steps for a single flow:

```powershell
Get-AdminFlowOwnerRole -EnvironmentName <env name> -FlowName <flow name>

Set-AdminFlowOwnerRole -EnvironmentName <env name> -FlowName <flow name> -PrincipalType User -RoleName CanEdit -PrincipalObjectId <new owner object id>
```

Run the first command again afterward to verify the new role. To find all flows created by one person, Learn uses:

```powershell
Get-AdminFlow -EnvironmentName <env name> -CreatedBy <user-object-id>
```

Learn says to apply the single-flow steps to each flow in the result. Its longer script loops through all flows in an environment and flags those without a valid `Owner` or `CanEdit` principal.

One caution. Learn's examples use `Get-AzureADUser` to look up object IDs. The same page says the AzureAD and MSOnline modules were deprecated and recommends moving to Microsoft Graph PowerShell. Check that the script still works in your tenant before you rely on it, or look up the object ID some other way. The lookup method is not described on the Learn page beyond the deprecated cmdlet.

## Step 4: Repair the connections

This step is often forgotten. Learn says orphaned flows can fail if they use connections tied to the former user. A new co-owner does not change that.

The Learn page on connection failures gives these actions:

1. Open the flow in edit mode and check the connections panel. A warning icon means that a connection needs attention.
2. Select **Fix connection** or **Re-authenticate**. You can also go to **Connections**, select the three dots next to the broken one and choose **Fix connection** or **Edit**.
3. For shared connections, the owner must re-authenticate, or you create your own connection and update the flow.
4. Confirm that the action shows a green checkmark.

If a flow used a service connection tied to a named person's mailbox or site access, check that the new connection account also has that access.

## Step 5: Change the primary owner if the flow is in a solution

If the flow is solution-aware, Learn describes an in-place owner change. The person doing it must be an owner or co-owner who is an admin, or have a role that includes the `prvChangeOwnerIdOfWorkflow` privilege. Admins first have to make themselves an owner or co-owner.

1. In Power Automate, select **My flows**, or select **Solutions** and find the flow.
2. Select the flow, then **Edit** in the **Details** section.
3. In **Primary owner**, remove the current owner and enter the email address of the new owner.

After the change, the old and new owners are both co-owners. The new owner can see run history and connection references.

Two licensing notes from the same page:

- For scheduled or automated flows, the flow runs under the new owner's license and request limits after the change. This can take up to seven days. Editing and saving the flow applies it right away.
- If the flow uses premium features and the new owner has no premium license, a warning appears. The flow transfers and runs for a 30-day grace period, and then Power Automate turns it off.

A non-solution flow cannot change its owner in place. With Dataverse, add the flow to a solution first. Without Dataverse, create a new flow by export and import, **Save as** or **Send a copy**.

## Step 6: If the flow was deleted, restore it quickly

An orphaned flow is not the same as a deleted one. If the flow was deleted, Learn says you can restore it within 21 days. After 21 days, neither the connector, PowerShell nor Microsoft Support can restore it.

With the **Power Automate Management** connector, build a manual flow with a button trigger, add **Restore Deleted Flow as Admin**, select the environment and the flow, and run it. With PowerShell, you must be an environment admin:

```powershell
Add-PowerAppsAccount
Get-AdminFlow -EnvironmentName <EnvironmentName> -IncludeDeleted $true
Restore-AdminFlow -EnvironmentName <EnvironmentName> -FlowName <FlowName>
```

A restored flow is disabled. Turn it on manually, then add a co-owner and check the connections as above.

## How to verify the fix

1. Run `Get-AdminFlowOwnerRole` or open the flow in the admin center and check that a current person is listed as owner.
2. Open the flow and confirm that all connections show no warning.
3. Test the flow manually and check the run history.
4. For a scheduled flow, wait for the next scheduled run and confirm it succeeds.

## Prevent the next orphaned flow

- Add at least one co-owner to every business-critical flow.
- Build important flows in solutions.
- Consider a service principal application user as owner for critical flows. Learn describes it as a non-interactive user that is not tied to a person who may leave. It cannot be a co-owner, and it appears only through **Details**, **Edit** and **Owner**. Share the flow's connections with that application user first.
- Add the departing employee's flows to your offboarding checklist, before the account is removed.

## Limits and open points

- Learn does not name the exact admin role that can see ownerless flows in the admin center.
- Learn's orphaned-flow script depends on a deprecated module. Test it first.
- The thread had no confirmed result. The person who asked did not say what worked.
- Learn does not say whether connections must be re-authenticated after every owner change. Test the flow after each change.

## Related

- [Power Automate](https://www.m365.fm/entity/power-automate/)
- [Orphaned flows](https://www.m365.fm/entity/orphaned-flows/)
- [Power Platform admin center](https://www.m365.fm/entity/power-platform-admin-center/)
- [Power Platform solution](https://www.m365.fm/entity/power-platform-solution/)
- [Cloud flow](https://www.m365.fm/entity/cloud-flow/)

## Sources

- [Microsoft Learn: Manage orphaned flows when the owner leaves the organization](https://learn.microsoft.com/en-us/troubleshoot/power-platform/power-automate/flow-management/manage-orphan-flow-when-owner-leaves-org)
- [Microsoft Learn: Change the owner of a cloud flow](https://learn.microsoft.com/en-us/power-automate/change-cloud-flow-owner)
- [Microsoft Learn: Guide to cloud flow sharing and permissions](https://learn.microsoft.com/en-us/power-automate/guide-to-cloud-flow-sharing-permissions)
- [Microsoft Learn: Restore deleted flows](https://learn.microsoft.com/en-us/power-automate/how-tos-restore-deleted-flow)
- [Microsoft Learn: Fix connection failures in cloud flows](https://learn.microsoft.com/en-us/power-automate/fix-connection-failures)
- [Microsoft Q&A: Find an old flow created by another team member (April 2026)](https://learn.microsoft.com/en-us/answers/questions/5858543/find-an-old-flow-created-by-another-team-member)
