---
title: "Require Multiple Administrative Approval for Intune Changes: Access Policies Step by Step"
summary: "Set up Intune Multi Admin Approval: which resource types it protects, how to create an access policy, approver and requestor requirements, the approval flow, expiry after 3 days without further processing and the limitations Learn lists."
status: review
publish: false
author: mirko-p
date: 2026-12-23
topics: [intune]
keypoints:
  - "Multi Admin Approval holds changes to protected resources until a different administrator approves. It covers interactive admin actions and app-auth calls through Microsoft Graph."
  - "Protected types include apps, compliance policies, settings catalog configuration policies, device actions (Wipe, Retire, Delete), RBAC, Windows scripts and device categories."
  - "Create a policy under Tenant administration > Multi Admin Approval > Access policies > Create. Changes to access policies always need a second admin."
  - "A request that is not processed further within 3 days expires and must be resubmitted. Each status change stays visible for up to 30 days."
  - "Admins cannot approve their own requests, only one request per object can be pending, and Intune sends no notifications for requests."
faq:
  - q: "What does Multi Admin Approval protect against?"
    a: "Microsoft Learn says it helps protect your tenant from a compromised administrator account. Changes to protected resources are not applied until a different administrator approves them, and approvers can also reject requests."
  - q: "Which changes can be protected?"
    a: "Each access policy supports one profile type: apps (deployments, not app protection policies), compliance policies, settings catalog configuration policies, device actions such as Wipe, Retire and Delete, role-based access control, Windows script deployments and tenant configuration for device categories."
  - q: "Who can approve a request?"
    a: "An approver must be a direct member of the approver group assigned to the policy, hold the Read permission for the resource, and the approver security group must be a member group on at least one Intune RBAC role assignment. Distribution lists, Microsoft 365 groups and mail-enabled security groups are not supported."
  - q: "What happens if nobody completes an approved request?"
    a: "Learn says a request that is not processed further within 3 days becomes Expired and must be resubmitted. My advice: the requestor should select Complete soon after approval."
  - q: "Does Intune notify approvers?"
    a: "No. Learn lists as a limitation that Intune sends no notifications for new requests or status changes, so contact approvers directly for urgent requests."
---

Multi Admin Approval (MAA) adds a second pair of eyes to risky Intune changes. A compromised admin account cannot wipe devices or push a script on its own if the change needs another administrator's approval. This guide follows the Microsoft Learn article and focuses on setup, roles and the traps in the limitations list.

## What it covers

Learn says changes to protected resources aren't applied until a different administrator approves them. It covers interactive admin actions and app-auth calls made through Microsoft Graph.

Each access policy supports one profile type:

- **Apps:** app deployments, not app protection policies
- **Compliance policies**
- **Configuration policies:** settings catalog
- **Device actions:** Wipe, Retire, Delete
- **Role-based access control:** role changes, permissions and admin or member group assignments
- **Scripts:** Windows script deployments
- **Tenant configuration:** device categories

Changes to access policies themselves always need a second administrator's approval.

## Create an access policy

1. Go to **Tenant administration** > **Multi Admin Approval** > **Access policies** > **Create**.
2. On **Basics**, enter a **Name**, an optional **Description** and the **Profile type**.
3. On **Approvers**, select **Add groups** and choose the approver group.
4. Optionally add **Exclusions** with **Add enterprise applications**.
5. On **Review + submit for approval**, enter a **Business justification** and select **Submit for approval**.
6. A separate admin with the approval permission approves the policy.
7. The original admin opens the policy and selects **Complete**.

## Roles and requirements

**Access policy manager:** a custom role with the permissions Create, Read, Update and Delete access policy (recommended), or the Intune Administrator role, which is privileged.

**Approver**, who must:

- be a direct member of the approver group assigned to the policy,
- hold the Read permission for the resource, for example ManagedDevices/Read for device deletes,
- belong to a security group that is a member group on at least one Intune RBAC role assignment. Distribution lists, Microsoft 365 groups and mail-enabled security groups aren't supported.

**Requestor:** needs the normal RBAC permission for the action, such as MobileApps/Create or RemoteTasks/Wipe. The same account submits the request and selects **Complete** after approval.

## The approval flow

1. The requestor submits a change with a business justification.
2. An approver opens **Received requests** (or **Admin tasks**), reviews the request, adds **Approver notes** and selects **Approve request** or **Reject request**.
3. The requestor selects **Complete** on the approved request. Intune applies the change and sets the status to Completed.

Statuses are Needs approval, Approved, Completed, Rejected and Canceled. A requestor can cancel before approval from **My requests** with **Cancel request**. Learn says a request that is not processed further within 3 days becomes Expired and must be resubmitted. Each status change stays visible for up to 30 days.

## Limitations

- Admins can't approve their own requests, even if they are in the approver group.
- Global Administrator and Intune Administrator submissions still need a different admin's approval.
- Only one pending request is allowed per object.
- Intune sends no notifications for new requests or status changes.
- Nested group memberships may behave unreliably.
- Exclusions apply only to app-auth calls, are limited to 50 applications per policy and bypass MAA for the affected resource type.
- The **Allow access to unlicensed admins** setting is irreversible.
- The **Role** policy type can deadlock RBAC changes. Configure other policies and RBAC assignments first.

## Example: protecting device wipes

Using the facts above, a policy for device actions would look like this:

1. Create an access policy with the profile type **Device actions** and an approver group of senior admins.
2. Make sure that group is a member group on an Intune RBAC role assignment and that approvers hold the ManagedDevices Read permission.
3. A helpdesk admin who has the RemoteTasks/Wipe permission requests a wipe and enters a business justification.
4. An approver reviews it under **Received requests**, adds notes and approves.
5. The helpdesk admin selects **Complete** within 3 days, and Intune applies the change.

Learn's rules still apply: the approver cannot be the requestor, only one request can be pending per object, and nobody gets a notification.

## Rollout plan

These are practical suggestions based on the limits:

1. Start with a narrow policy such as device actions, with a small approver group.
2. Make sure approvers know the process, since there are no notifications.
3. Set up the Role policy last, because it can lock RBAC changes.
4. Review exclusions, because they bypass MAA for the app-auth calls of that type.
5. My advice: agree on who completes approved requests, so they do not expire after 3 days.

## Related

- [Microsoft Intune](https://www.m365.fm/entity/intune/)

## Sources

- [Use Multi Admin Approval in Intune (Microsoft Learn)](https://learn.microsoft.com/intune/fundamentals/role-based-access-control/multi-admin-approval)
