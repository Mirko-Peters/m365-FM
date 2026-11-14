---
title: "Entra ID Lifecycle Workflows for Hybrid Worker Accounts: Onboarding and Offboarding Setup"
summary: "How to set up Microsoft Entra Lifecycle Workflows for accounts synced from on-premises Active Directory: sync hire and leave dates, build a workflow from a template, and handle the documented limits of on-premises tasks."
status: review
publish: false
author: mirko-p
date: 2026-12-18
topics: [entra-id-governance, entra-id, entra-connect, entra-cloud-sync]
keypoints:
  - "Lifecycle Workflows need a Microsoft Entra ID Governance or Microsoft Entra Suite license."
  - "Active Directory has no hire or leave date attribute, so map a string attribute to employeeHireDate and employeeLeaveDateTime during sync."
  - "Workflows are evaluated on a default schedule of three hours, so set trigger times earlier than the real start time."
  - "Enable, disable and delete tasks can include synced on-premises users, but not users with Entra role assignments or role-assignable group membership."
  - "Test a new workflow on a small audience first, and note that Run on demand ignores the execution conditions."
faq:
  - q: "Which license do Lifecycle Workflows need?"
    a: "According to Microsoft Learn, using Lifecycle Workflows requires Microsoft Entra ID Governance or Microsoft Entra Suite licenses. The role needed to create a workflow is at least Lifecycle Workflows Administrator."
  - q: "How do hire and leave dates get from Active Directory into Entra ID?"
    a: "Microsoft Learn says Active Directory has no corresponding EmployeeHireDate or EmployeeLeaveDateTime attribute, so you identify a string attribute in AD and map it. Cloud sync and Entra Connect Sync both support the mapping. The date format for a custom import into an AD string attribute is yyyyMMddHHmmss.fZ."
  - q: "How often does a workflow run?"
    a: "Microsoft Learn says that once scheduling is enabled, the workflow is evaluated at the configured interval, with a default of three hours. Learn advises setting the hire date time early and the leave time late, and subtracting the tenant schedule from the start time."
  - q: "Can a workflow disable the on-premises account of a leaver?"
    a: "Yes, for synced users. Microsoft Learn describes the optional disableOnPremisesAccount argument for the Disable user account task, and deleteOnPremisesAccount for Delete user. Users with Microsoft Entra role assignments and members or owners of role-assignable groups are not supported."
  - q: "Why did my on-demand run process a user who was not in scope?"
    a: "Microsoft Learn states that an on-demand run does not take into account whether a user meets the workflow's execution conditions. It applies the tasks regardless, so choose the users carefully before running."
---

For accounts synced from on-premises Active Directory, Lifecycle Workflows depend on two dates that AD does not store: a hire date and a leave date. The setup is therefore three steps: get the dates into Microsoft Entra ID, build joiner and leaver workflows from templates, and check which tasks work for synced users. Microsoft Learn documents each part, and a few limits matter for hybrid accounts.

## Prerequisites

- A Microsoft Entra ID Governance or Microsoft Entra Suite license.
- At least the Lifecycle Workflows Administrator role to create workflows.
- Limits stated on the overview page: up to 100 workflows and up to 100 custom task extensions.

## Step 1: Sync the hire and leave dates

Workflows trigger from `employeeHireDate` and `employeeLeaveDateTime`, both DateTimeOffset attributes. Both are supported in HR inbound provisioning, Entra Connect cloud sync and Entra Connect Sync. Learn says there is no matching attribute in AD, so you pick a string attribute and map it.

### Cloud sync

1. In the Entra admin center, go to **Hybrid management** > **Microsoft Entra Connect**.
2. Select **Manage Microsoft Entra Connect cloud sync** and open your configuration.
3. Select **Click to edit mappings** and then **Add attribute**.
4. Use mapping type Direct, your AD source attribute (Learn uses `msDS-cloudExtensionAttribute1` as an example), and target `employeeHireDate`. Repeat for `employeeLeaveDateTime`.
5. Apply the mapping and select **Save schema**.

### Entra Connect Sync

Disable the scheduler with `Set-ADSyncScheduler -SyncCycleEnabled $false`. In the Synchronization Rules Editor, add an inbound rule such as `In from AD - EmployeeHireDate`, with a direct flow from your source attribute to `employeeHireDate`. Learn says an outbound rule is not needed on Entra Connect 2.0.3.0 or later, where the attribute is in the default rule. Re-enable the scheduler afterward. For `employeeLeaveDateTime`, the default outbound rule includes it starting with version 2.1.19.0, but you still map the inbound side.

### Date format and timing

A custom import into an AD string attribute must use `yyyyMMddHHmmss.fZ`. The Graph API uses `YYYY-MM-DDThh:mm:ssZ`. Learn adds three timing rules:

- A workflow does not run before the time stored in the attribute.
- Use an early time for hire dates (for example 1 AM) and a late time for leave dates (for example 9 PM).
- Subtract the tenant schedule, three hours by default, from the start time so the workflow finishes before the person starts.

For a Temporary Access Pass, Learn recommends a maximum lifetime of 24 hours to cover time zone differences.

## Step 2: Build the workflows

1. Go to **ID Governance** > **Lifecycle workflows** > **Create a workflow**.
2. Choose a template, for example the pre-hire onboarding template.
3. On **Basics**, enter a name, description and administrative scope.
4. On **Configure scope**, choose the trigger type and the rule with property, operator and value, such as a department.
5. On **Review tasks**, add, enable, disable or remove tasks.
6. On **Review and create**, decide whether to enable the schedule, then select **Create**.

Supported triggers are time based attributes, attribute changes, group membership changes and sign-in inactivity. Learn says workflows are evaluated at the configured interval once scheduling is enabled. The pages disagree slightly on defaults. One says new workflows are enabled by default, with scheduling an option you enable manually, and another says a new workflow is disabled so you can test it on smaller audiences. Check the **Scheduled** column after creation.

Typical joiner tasks include sending a welcome email, generating a Temporary Access Pass for the manager, adding the user to groups or teams, assigning licenses and requesting an access package. Typical leaver tasks include disabling the account, removing the user from groups, teams and licenses, cancelling access package requests, and deleting the user.

## Step 3: Check the hybrid limits

Learn documents these behaviors for synced users:

| Task | Hybrid behavior |
|---|---|
| Enable or disable user account | Use the optional `enableOnPremisesAccount` or `disableOnPremisesAccount` argument to include synced users |
| Delete user | Use `deleteOnPremisesAccount` for synced users |
| Update user attributes | For synced users, directory extension attributes only |
| Add or remove groups | Mail-enabled, distribution, dynamic and role-assignable groups are not supported |
| Group access to on-premises resources | Enable group writeback |

Users with Entra role assignments, and members or owners of role-assignable groups, are not supported for the enable, disable and delete tasks. The Temporary Access Pass task needs a populated manager and manager mail attribute and an enabled TAP policy. It does not work for a user with other authentication methods, sign-ins or Entra role assignments. The Send welcome email task needs a populated mail attribute.

As an alternative for account disabling, Learn mentions HR-driven provisioning to on-premises AD with an `accountDisabled` mapping.

## Step 4: Test and run

- Use **Run on demand** to test. The workflow must be enabled first, and Learn says an on-demand run ignores the execution conditions.
- If a user is configured after the intended processing time, for example because of an HR delay, Lifecycle Workflows still attempts processing provided setup completes within three days of the original processing time. This does not apply to the Time based attribute V2 preview trigger.
- Review run history by users, runs and tasks.

To verify synced values, use Microsoft Graph PowerShell with `Get-MgUser -Property EmployeeLeaveDateTime` and the `User-LifeCycleInfo.Read.All` scope.

## Typical mistakes

- Expecting AD to hold the dates without mapping a string attribute.
- Setting the hire time at the real start time, so the three hour schedule makes the account late.
- Using a wrong date format in the AD attribute.
- Targeting admin accounts with disable or delete tasks.
- Running on demand against users who should be out of scope.

## What the sources do not say

The pages read do not label tasks as on-premises tasks in the compatibility column, and the create page does not describe trigger offsets. The sync page gives full steps only for `employeeHireDate`.

## Related

- [Entra ID Governance](https://www.m365.fm/entity/entra-id-governance/)
- [Entra ID](https://www.m365.fm/entity/entra-id/)
- [Entra Connect](https://www.m365.fm/entity/entra-connect/)
- [Entra Cloud Sync](https://www.m365.fm/entity/entra-cloud-sync/)

## Sources

- [What are Lifecycle Workflows](https://learn.microsoft.com/en-us/entra/id-governance/what-are-lifecycle-workflows)
- [Understanding Lifecycle Workflows](https://learn.microsoft.com/en-us/entra/id-governance/understanding-lifecycle-workflows)
- [Create a Lifecycle Workflow](https://learn.microsoft.com/en-us/entra/id-governance/create-lifecycle-workflow)
- [Synchronize attributes for Lifecycle Workflows](https://learn.microsoft.com/en-us/entra/id-governance/how-to-lifecycle-workflow-sync-attributes)
- [Lifecycle Workflow tasks](https://learn.microsoft.com/en-us/entra/id-governance/lifecycle-workflow-tasks)
