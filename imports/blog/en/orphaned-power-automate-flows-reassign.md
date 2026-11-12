---
title: "Orphaned Power Automate flows: find them and reassign ownership"
summary: "Orphaned Power Automate flows keep running or fail when their owner leaves. Find them in the admin center or PowerShell, then reassign ownership step by step."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [orphaned-flows, power-automate, power-platform-admin-center, user-offboarding]
keypoints:
  - "A flow is orphaned when its owner has left and no valid owner remains, and it can fail if it uses connections tied to that person's account."
  - "In the Power Platform admin center, open the environment, then Resources, then Flows, and look for rows with an empty Owners column."
  - "For flows outside a solution, you add a co-owner, because the owner is part of the flow's identity and cannot be changed in place."
  - "Scheduled flows run under the new owner's license and request limits, and a premium flow without a premium license is switched off after a 30-day grace period."
  - "Prevent the next orphan by making offboarding check for flows, and by giving critical flows a service account as owner plus human co-owners."
faq:
  - q: "What is an orphaned flow in Power Automate?"
    a: "An orphaned flow is a cloud flow whose owner has left the organization and which has no other valid owner or co-owner. Nobody is accountable for it. If it relies on connections tied to the departed person's account, it can start to fail, and nobody receives the failure alerts."
  - q: "How do I find orphaned flows as an admin?"
    a: "Open the Power Platform admin center, select the environment, go to Resources and Flows, and look for flows with no name in the Owners column. Use Load more so you do not miss any. For many flows, Microsoft publishes a PowerShell script that lists flows without a valid owner or co-owner."
  - q: "Can an admin change the owner of any flow?"
    a: "Not directly. Microsoft says admins cannot change a flow they do not own, so they first make themselves an owner or co-owner. A primary owner can be changed only for solution-aware flows. For flows outside a solution, add a co-owner or move the flow into a solution first."
---

Orphaned Power Automate flows are cloud flows whose owner has left the company and which have no other valid owner. They may keep running, or they may fail quietly because their connections belonged to the person who left. This guide is for Power Platform admins who need to find them, move them to a new owner and stop the problem from coming back. It covers the admin center method, the PowerShell method, what changes for licenses and connections, and an offboarding habit that prevents most orphans.

## What makes a flow orphaned, and why it matters

Microsoft's article on [managing orphaned flows](https://learn.microsoft.com/en-us/troubleshoot/power-platform/power-automate/flow-management/manage-orphan-flow-when-owner-leaves-org) says a flow becomes orphaned when its owner leaves the organization and no valid owner remains. It adds that orphaned flows can fail if they use connections tied to that user's account.

The risk has two parts. The first is the flow itself: a nightly job that moves files, sends reminders or syncs data may stop. The second is accountability. Nobody gets the failure emails, and nobody can edit the flow when the business process changes. The entity notes on [orphaned flows](https://www.m365.fm/entity/orphaned-flows/) describe the same problem: nobody is accountable for them while they may keep running or silently fail.

Orphans are an offboarding side effect. When IT disables an account, the checklist usually covers mail, files and licenses. Flows often get forgotten. Treat this guide as a missing line on your [user offboarding](https://www.m365.fm/entity/user-offboarding/) list.

## How to find orphaned Power Automate flows

There are two ways, and they suit different sizes of tenant.

### In the admin center

The [Power Platform admin center](https://www.m365.fm/entity/power-platform-admin-center/) shows flows per environment. Microsoft's steps are:

1. Open the admin center and go to the list of environments.
2. Select the environment.
3. Open the **Resources** tab and select **Flows**.
4. Look for flows with no owner listed in the **Owners** column.
5. Select **Load more** until the list is complete, so you do not miss any.

Only users with the right privileges can see flows that have no valid owner. If you cannot see them, ask for the proper admin role instead of working around it.

### With PowerShell

For a whole environment, Microsoft publishes a script on the same troubleshooting page. Its logic is simple: get every flow with `Get-AdminFlow`, read each flow's owners with `Get-AdminFlowOwnerRole`, check whether an Owner or CanEdit role belongs to a user who still exists, and print the flows where none does.

One warning. The published script looks up users with the AzureAD module. The same page says the AzureAD and MSOnline modules are deprecated and recommends Microsoft Graph PowerShell. The page says the AzureAD commands may no longer work, so check the current guidance. Keep the flow logic from the script and replace the user lookup with a current method.

To see everything one person created, use `Get-AdminFlow -EnvironmentName <env name> -CreatedBy <user-object-id>`. This is the fastest check when you disable an account.

## How to reassign ownership of orphaned flows

The method depends on whether the flow is in a solution. Microsoft's page on [changing a cloud flow owner](https://learn.microsoft.com/en-us/power-automate/change-cloud-flow-owner) draws that line.

**Solution-aware flows.** The primary owner can be changed.

1. Sign in to Power Automate and open the flow, either under **My flows** or through its solution.
2. In the **Details** section, select **Edit**.
3. Remove the current owner in **Primary owner** and enter the new owner's email address.

The person doing this must be an owner or co-owner who is an admin, or have a role with the `prvChangeOwnerIdOfWorkflow` privilege. The page says admins cannot change a flow they do not own, so make yourself an owner or co-owner first. After the change, the original owner and the new owner become co-owners. The new owner must be an individual or a service account user, not a distribution list.

**Flows outside a solution.** The page says ownership cannot be changed in place, because the owner is part of the flow's identity. With Dataverse, add the flow to a solution first. Without Dataverse, create a new flow with export and import, **Save as**, or **Send a copy**. As a first step, you can still add a co-owner so someone can open and fix the flow now.

**Adding a co-owner in the admin center.** The troubleshooting article lists this for one flow: select the flow, select **Share**, enter the new owner's name, and select **Save**.

**Adding a co-owner with PowerShell.** Check the current permissions with `Get-AdminFlowOwnerRole`. Then run `Set-AdminFlowOwnerRole` with the environment name, the flow name, `-PrincipalType User`, `-RoleName CanEdit` and the new owner's Entra object ID. Run `Get-AdminFlowOwnerRole` again to verify.

## What changes after the move: licenses and connections

Moving a flow has side effects that surprise people. Microsoft's page on changing the owner states:

- **Scheduled and automated flows** run under the new owner's license and Power Platform request limits. This can take up to 7 days to take effect. Editing and saving the flow applies it at once.
- **Manual flows** run under the license of whoever runs them.
- **Premium features without a premium license** trigger a warning. The flow still transfers and runs for a 30-day grace period. After that, Power Automate turns it off until the new owner has a license.

Connections matter as well. A flow that sent mail as the departed user needs a new connection under the new owner's account, or a shared mailbox where that is allowed. After the move, open the flow, repair any broken connection, turn it on, and run a test.

## Example: three flows from one departed employee

The names and numbers are made up.

An account is disabled on Friday. On Monday, an admin runs `Get-AdminFlow -EnvironmentName <env> -CreatedBy <object-id>`. It returns three flows.

1. **Weekly report email.** Solution-aware. The admin sets the team lead as primary owner. The flow is scheduled, so it uses the lead's license. The admin edits and saves it to apply the change at once.
2. **File archive on a SharePoint trigger.** Not in a solution. The admin adds two co-owners from the team, then plans to move it into a solution next sprint.
3. **A test flow from last year.** Nobody uses it. The admin turns it off, records the decision in a ticket and deletes it after a short wait.

Result: two of three flows have a new accountable owner on day one, and one is retired on purpose. The admin also records the date and the new owner for each flow in the offboarding ticket.

## How to keep cloud flows from becoming orphaned

Prevention is cheaper than clean-up. Four habits help:

1. **Put business-critical flows in solutions.** Solution-aware flows can change their primary owner, and the new owner can reach the connection references.
2. **Use a service account for critical flows.** Microsoft's sharing guide suggests it, with human co-owners for maintenance. A service account does not leave the company.
3. **Add a co-owner to every important cloud flow.** Microsoft advises adding co-owners only for collaboration, so keep the list short: two or three named people.
4. **Check at offboarding.** Run the `-CreatedBy` query for the leaver and move the results before the account is deleted.

The CoE Starter Kit adds an automated route. Its governance components include two clean-up flows that ask managers to take over objects from a former employee, and they post adaptive cards through the Microsoft Teams connector. Desktop flows and apps need the same care, so ask who owns them in your inventory as well.

## Common mistakes

- **Waiting until a flow fails.** Check at offboarding, not after the first complaint.
- **Trying to change the owner of a flow outside a solution.** It cannot be done in place. Add a co-owner or move the flow into a solution.
- **Ignoring licenses.** A scheduled flow moves to the new owner's license, and a premium flow with no premium license stops after 30 days.
- **Assigning a distribution list.** The new owner must be an individual or a service account user.
- **Running old AzureAD-based scripts unchanged.** The modules are deprecated. Test in a small environment and update the user lookup.
- **Leaving critical flows with one personal owner.** Microsoft's [guide to flow sharing and permissions](https://learn.microsoft.com/en-us/power-automate/guide-to-cloud-flow-sharing-permissions) suggests, for critical flows, a service account or service principal as primary owner with human co-owners for maintenance.

## How software can help

Begin with the Power Platform admin center and PowerShell, as above. A monthly scheduled script that lists flows without a valid owner and mails the result to the admin team is cheap and effective. Microsoft's Center of Excellence Starter Kit includes clean-up flows for orphaned objects, which ask managers to take over a former employee's objects, but Microsoft notes the kit is no longer actively maintained and that its core capabilities are now in the Power Platform admin center. Review it before you rely on it.

Whatever you use, keep a simple register of critical flows with a named owner and a backup.

## Next step

Run the list of flows created by your most recent leaver today, and fix each one using the steps above. Then add a line about orphaned Power Automate flows to your offboarding checklist so the check happens every time.
