---
title: "How to Control Access to a Power Platform Environment With Security Groups"
summary: "Associate a Microsoft Entra security group with a Power Platform environment: admin center steps, roles, effect on existing and new users, nested groups, security roles that still apply, unsupported environment types and gaps."
status: review
publish: false
author: mirko-p
date: 2027-01-07
topics: [power-platform-admin-center, dataverse-security-roles]
keypoints:
  - "In the Power Platform admin center, open the environment, select Edit, then the Edit icon in the Security group area, choose a group, and select Done and Save."
  - "When you associate a group with an environment that already has users, all users who are not group members are disabled in that environment."
  - "New users are created only if they have an eligible license and are group members. Removing a user from the group disables them in the environment."
  - "Group membership does not replace security roles. Users still need a Dataverse security role to access data."
  - "Default and developer environment types cannot have a security group. Nested group members are not added automatically."
faq:
  - q: "How do I associate a security group with an environment?"
    a: "Sign in to the Power Platform admin center as a Dynamics 365 administrator or Power Platform administrator, go to Manage > Environments, select the environment, select Edit, select the Edit icon in the Security group area, pick the group and select Done and Save."
  - q: "What happens to existing users?"
    a: "Learn says that when you associate a group with an environment that already has users, all users who are not members of the group are disabled in that environment."
  - q: "Are security roles still needed?"
    a: "Yes. All licensed users, whether or not in the group, need a security role to access data. Without one they get a data access denied error."
  - q: "Do nested groups work?"
    a: "Members of a group nested under the environment group are not pre-provisioned or added automatically. Learn suggests a Dataverse group team for the nested group with a security role, or letting a member access the environment for the first time."
  - q: "Which environments cannot use a security group?"
    a: "Learn says default and developer environment types cannot have a security group. Trial environments do not support automatic user assignment."
---

A security group turns an environment into a members-only space. Only licensed members of the group are created as users there. This does not replace Dataverse security roles, which still decide what a user can do. This guide follows the Microsoft Learn page on controlling user access to environments with security groups and Microsoft 365 groups.

## Steps

1. Sign in to the Power Platform admin center as a Dynamics 365 administrator or Power Platform administrator.
2. In the navigation pane select **Manage**, then **Environments**, and choose the environment.
3. Select **Edit**.
4. In the **Edit details** pane, select the **Edit** icon in the **Security group** area.
5. Select a security group, then **Done**, then **Save**.

The picker returns the first 200 groups. Use **Search** to find a specific group. Supported group types are Security and Microsoft 365. On-premises Windows Active Directory security groups are not supported, so choose a Microsoft Entra security group.

## Create the group

Learn describes creating the group in the Microsoft 365 admin center: **Teams & groups** > **Active teams & groups** > **Add a group**, change the type to **Security group**, enter a name and description, and add members.

## Roles involved

- Associating a group: Power Platform Administrator or Dynamics 365 Administrator.
- Creating users: User Administrator. Managing Entra groups: Groups Administrator, and User Administrator also works. Assigning licenses: License Administrator, and User Administrator also works.
- Assigning Dataverse security roles: the System Administrator security role, or a custom role with at least Read and Assign privileges on the Security Role table.
- A Dynamics 365 Administrator must be a member of the environment's security group. This does not apply to Global Administrators or Power Platform Administrators.
- Power Platform, Dynamics 365 and Global Administrators are no longer assigned the Dataverse System Administrator role automatically and must self-elevate.

## Effect on existing users

When you associate a group with an environment that already has users, all users who are not members of the group are disabled in that environment. Check membership before you save.

## Effect on new users

- Only users with an eligible Power Platform or Dynamics 365 license, or a per-app plan, who are group members are created as users in the environment.
- Adding a user to the group adds them to the environment.
- A Power Platform Administrator who is not in the group still shows as active and can sign in.
- A Dynamics 365 administrator must be in the group to be enabled and cannot access the environment until added.
- Application users can run in group-secured environments without being members.

Removing a user from the group disables them in the environment.

## Security roles still apply

All licensed users, in the group or not, need a security role to access data. Without one they see a data access denied error when running an app. A user cannot access an environment until they have at least one security role there.

## Nested groups

Members of a group nested under the environment group are not pre-provisioned or added automatically. Learn gives two options:

- Create a Dataverse group team for the nested group and assign it a security role.
- Let a member open the environment for the first time, which adds them at run time. They still cannot run model-driven apps or reach Dataverse data until they have a security role.

The page's example adds a Managers group as a child of the environment group and creates a group team for it with a security role.

## Other caveats

- Canvas apps can be shared with people outside the group, but those users must be members to run them. Non-members see a message that they are not a member of the environment's security group.
- If an environment has a Power Apps per-app plan allocated, all users are treated as licensed there, even without individual licenses.
- Default and developer environment types cannot have a security group. Trial environments do not support automatic user assignment.
- The page says Dataverse for Teams has separate user access behavior, documented elsewhere.

## What the page does not say

- An explicit limit of one group per environment. The 200-group limit applies only to the picker.
- A comparison of Dataverse and non-Dataverse behavior.
- What happens when a group is replaced or removed from an environment later.
- PowerShell examples.

## A rollout outline

This outline is practical advice built on the page.

1. Create the group and add the right members first.
2. Confirm that every current user who should keep access is in it, because others are disabled when you save.
3. Create group teams and security roles for nested groups.
4. Associate the group with the environment.
5. Test with a member, a non-member and a user without a security role.

## Typical mistakes

- Associating the group before adding existing users.
- Assuming nested group members are provisioned.
- Treating group membership as access to data.
- Trying to use a default or developer environment.

## Related

- [Power Platform admin center](https://www.m365.fm/entity/power-platform-admin-center/)
- [Dataverse security roles](https://www.m365.fm/entity/dataverse-security-roles/)
- [Power Platform environments](https://www.m365.fm/entity/power-platform-environment/)

## Sources

- [Control user access to environments: security groups and licenses (Microsoft Learn)](https://learn.microsoft.com/power-platform/admin/control-user-access)
