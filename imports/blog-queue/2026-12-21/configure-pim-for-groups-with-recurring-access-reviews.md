---
title: "Configure PIM for Groups With Recurring Access Reviews to Reduce Standing Admin Access"
summary: "How to bring a group into Microsoft Entra PIM for Groups, set approval and MFA role settings, and add recurring access reviews for active and eligible members, with the limits and the missing 'mandatory review' setting Microsoft Learn does not document."
status: review
publish: false
author: mirko-p
date: 2026-12-21
topics: [privileged-identity-management, access-reviews, entra-id-governance]
keypoints:
  - "PIM for Groups gives just-in-time membership or ownership of a security or Microsoft 365 group. Dynamic groups and groups synchronized from on-premises cannot be managed in it."
  - "Once a group is brought under PIM management, it cannot be taken out of management. Role settings are defined per group and separately for Member and Owner."
  - "For groups that elevate into Microsoft Entra roles, Learn recommends requiring approval for eligible assignments and creating the group as role-assignable."
  - "Access reviews of PIM for Groups, a preview feature, can cover active and eligible members. With group owners as reviewers, at least one fallback reviewer is mandatory."
  - "The pages read do not describe a setting that forces an access review on every PIM group. Reviews are created in ID Governance and must be scheduled as recurring."
faq:
  - q: "Which groups can I use with PIM for Groups?"
    a: "Learn says any Microsoft Entra security group and any Microsoft 365 group can be enabled, except dynamic membership groups and groups synchronized from on-premises. The group does not have to be role-assignable, but it must be role-assignable to be assigned a Microsoft Entra role."
  - q: "Can I remove a group from PIM later?"
    a: "No. Learn says that once a group is managed it cannot be taken out of management, which prevents another administrator from removing PIM settings. A deleted group can take up to 24 hours to disappear from PIM for Groups."
  - q: "Does PIM for Groups include a built-in access review requirement?"
    a: "The Learn pages read do not describe one. Access reviews of PIM for Groups, currently a preview feature, are created separately under ID Governance, Access Reviews, and they review active and eligible members."
  - q: "Who reviews if I pick group owners as reviewers of a PIM group?"
    a: "Learn says you must assign at least one fallback reviewer. The review assigns only active owners as reviewers, not eligible owners. If there are no active owners when the review starts, the fallback reviewers are assigned."
  - q: "Should I use PIM for Groups for Exchange or SharePoint admin roles?"
    a: "Learn advises against it when activation delays matter. For just-in-time access to roles with permissions in SharePoint, Exchange or the Microsoft Purview portal, it recommends PIM for Microsoft Entra roles, or assigning the group to the role as eligible after making users active members."
---

Permanent admin access shrinks in two steps. PIM for Groups turns standing membership of a group into eligible membership that users must activate. Access reviews then check on a schedule whether the active and eligible members still need it. Microsoft Learn documents both, but not a setting that makes a review mandatory for every PIM group, so the review has to be created and scheduled on purpose. This article lists the documented steps and limits.

## Step 1: Bring the group into PIM

From the Learn page on bringing groups into PIM:

- You need a security group or Microsoft 365 group. Dynamic groups and groups synchronized from on-premises cannot be managed in PIM for Groups, and neither can groups in Restricted Management Administrative Units.
- For role-assignable groups you need a Microsoft Entra role with the `groupsAssignableToRoles` owner and member update permissions, such as Privileged Role Administrator or Global Administrator, or be an active owner. For other groups, a role such as Groups Administrator or Identity Governance Administrator, or active ownership, is enough.
- In the Microsoft Entra admin center, go to **ID Governance** > **Privileged Identity Management** > **Groups**, select **Discover groups**, select the group, then select **Manage groups** and **OK**.
- Once a group is managed, it cannot be taken out of management.
- Learn notes that administrators and group owners can manage groups through the Groups experience and other interfaces, overriding changes made in PIM.

Role-assignable matters for sensitive groups. Learn explains that only the Global Administrator, Privileged Role Administrator or the group owner can manage a role-assignable group, and other roles cannot change the credentials of its members and owners. For groups used to elevate into Microsoft Entra roles, Learn recommends requiring approval for eligible member assignments. It also says it is now possible to enable more than 500 groups per tenant in PIM, but only up to 500 groups can be role-assignable.

## Step 2: Set the role settings

Role settings are defined per group and per role (Member or Owner), and they are independent of each other. In the portal, open the group under PIM for Groups, select **Settings**, choose **Member** or **Owner**, and select **Edit**.

Settings documented on the page:

| Setting | What Learn says |
|---|---|
| Activation maximum duration | From one to 24 hours. |
| On activation, require multifactor authentication | Users might not be prompted if they already authenticated with strong credentials or MFA in the session. |
| On activation, require Conditional Access authentication context | Create and enable the Conditional Access policy first. Do not scope the policy to the authentication context and the group at the same time, because the user has no group membership during activation. |
| Require justification | Business justification at activation. |
| Require ticket information | Information-only field, not correlated with a ticketing system. |
| Require approval to activate | At least one approver is required, and Learn says to select at least two for redundancy. There are no default approvers. |
| Assignment duration | Choose to allow permanent eligible or active assignments, or require an expiry. |
| MFA and justification on active assignment | Applies when an administrator or owner creates an active assignment. |

If you use the authentication context option and no Conditional Access policy targets it, Learn says the MFA requirement is applied as a backup. That backup does not apply if the policy is turned off, is in report-only mode, or has eligible users excluded.

The expiry options for assignment duration are the building block for review-free cleanup, because assignments with an end date lapse unless they are renewed. That reading is the author's suggestion, not a Learn statement.

## Step 3: Create a recurring access review

From the Learn page on access reviews of PIM for Groups, which is marked as a preview:

- This feature requires Microsoft Entra ID Governance or Microsoft Entra Suite licenses.
- You review active members (active when the review is created) and eligible members. When a PIM group is selected, the users under review include all eligible and active users in that group.
- Sign in as at least an Identity Governance Administrator and go to **ID Governance** > **Access Reviews** > **New access review**.
- Select **Review access to a resource type**, then **Teams + Groups**, then **Select Teams + groups** and choose the group.
- Choose the scope, **Guest users only** or **Everyone**. For group membership reviews you can also review only inactive users, up to 730 days.
- On the **Reviews** tab, specify reviewers and recurrence as in the general guide for groups and applications.

Reviewer rules documented there:

- Options include group owners, selected users or groups, users reviewing their own access, and managers.
- For PIM for Groups, if you select group owners as reviewers, at least one fallback reviewer is mandatory. Only active owners are assigned, not eligible owners.
- Recurrence settings are duration in days, start date and end date, which can be never, a specific date, or after a number of occurrences.

Completion settings from the general page: **Auto apply results to resource**, and **If reviewers don't respond** with No change, Remove access, Approve access or Take recommendations. Learn warns that combining Remove access or Take recommendations with auto apply can revoke all access if reviewers do not respond. Decision helpers can recommend based on no sign-in within 30 days or user-to-group affiliation.

## Things that surprise people

- Ownership deactivation: Microsoft Entra ID does not let you remove the last active owner of a group. If an eligible owner activates and the active owner is later removed, deactivation can fail. PIM retries for up to 30 days and then leaves the user as an active owner.
- Nesting: role-assignable groups cannot have groups nested inside them for active membership. One group can be an eligible member of another group.
- Entra roles through groups: to provide a group of users with just-in-time access to roles that carry permissions in SharePoint, Exchange or the Microsoft Purview portal, Learn recommends making active assignments of users to the group and assigning the group to the role as eligible. Otherwise it can take significant time before all permissions of the role are active. It also recommends PIM for Microsoft Entra roles to avoid activation delays there.
- App provisioning: when membership activation triggers SCIM provisioning, Learn says it takes 2 to 10 minutes, and requests are throttled at five per 10 seconds per enterprise application. Beyond that, provisioning waits for the 40-minute sync cycle.
- Stricter reauthentication: Learn says a sign-in frequency of **Every time** on the Conditional Access policy for the authentication context forces reauthentication at each activation, with a 10-minute window across Microsoft Entra roles, Azure resource roles and PIM for Groups.

## What the documentation does not say

The pages read do not describe an option to require that every PIM group has an access review, a report that lists PIM groups without reviews, or a way to create the reviews for all PIM groups at once. They also describe the PIM for Groups review feature as a preview, so check its status before you depend on it for compliance. Treat the combination of expiring eligible assignments and recurring reviews as a design choice you document yourself.

## Related

- [Privileged Identity Management](https://www.m365.fm/entity/privileged-identity-management/)
- [Access reviews](https://www.m365.fm/entity/access-reviews/)
- [Entra ID Governance](https://www.m365.fm/entity/entra-id-governance/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)

## Sources

- [Privileged Identity Management (PIM) for Groups (Microsoft Learn)](https://learn.microsoft.com/en-us/entra/id-governance/privileged-identity-management/concept-pim-for-groups)
- [Bring groups into Privileged Identity Management (Microsoft Learn)](https://learn.microsoft.com/en-us/entra/id-governance/privileged-identity-management/groups-discover-groups)
- [Configure PIM for Groups settings (Microsoft Learn)](https://learn.microsoft.com/en-us/entra/id-governance/privileged-identity-management/groups-role-settings)
- [Create an access review of PIM for Groups, preview (Microsoft Learn)](https://learn.microsoft.com/en-us/entra/id-governance/create-access-review-pim-for-groups)
- [Create an access review of groups and applications (Microsoft Learn)](https://learn.microsoft.com/en-us/entra/id-governance/create-access-review)
