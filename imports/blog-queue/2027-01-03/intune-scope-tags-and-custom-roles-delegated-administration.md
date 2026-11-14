---
title: "Intune Scope Tags and Roles: How to Delegate Administration by Scope"
summary: "How Intune scope tags and role assignments work together: roles define what admins can do, tags define what they can see. Steps to create tags, assign them and avoid common merge surprises."
status: review
publish: false
author: mirko-p
date: 2027-01-03
topics: [intune]
keypoints:
  - "Roles determine what access an admin has to objects. Scope tags determine which objects an admin can see."
  - "Create a scope tag under Tenant administration > Roles > Scope (Tags) > Create. The Intune Administrator role is required."
  - "A role assignment has Members, Scope (Groups) and Scope (Tags). A maximum of 100 tags can be applied per role assignment or per object."
  - "By default, permissions from multiple role assignments in the same category are merged, which can grant broader access than intended."
  - "Scoped permissions is an opt-in public preview. Learn says enabling it is a one-time, irreversible action."
faq:
  - q: "What is the difference between a role and a scope tag in Intune?"
    a: "According to Microsoft Learn, roles determine what access an admin has to objects, while scope tags determine which objects an admin can see. For example, an admin with the Policy and Profile Manager role and the Seattle tag sees only objects tagged Seattle."
  - q: "How do I create a scope tag?"
    a: "Learn says to go to Tenant administration > Roles > Scope (Tags) > Create, enter a name and optional description, choose the groups of devices that should receive the tag on the Assignments page and then create it. It requires the Intune Administrator Microsoft Entra role."
  - q: "How many scope tags can I assign?"
    a: "Microsoft Learn states a maximum of 100 scope tags per role assignment and 100 per object, such as a configuration profile."
  - q: "What happens to objects with no custom scope tag?"
    a: "Learn says the Default scope tag is automatically added to all untagged objects that support scope tags. Some policy types do not show the Scope Tags page unless at least one custom tag exists besides Default."
  - q: "Why does an admin have more access than expected?"
    a: "Learn explains that when an admin is in several role assignments with different scope tags and the same permission category, Intune merges the permissions by default. An opt-in preview called Scoped permissions applies each assignment's permissions only within its own tags."
---

In Intune, a role says what an admin may do, and a scope tag says which objects the admin can see. To delegate administration, create scope tags, attach them to objects such as profiles and apps, and then include the tags in the admin's role assignment. This guide follows the Microsoft Learn page on scope tags and RBAC.

## The model in one sentence

Learn gives this example: a Seattle admin with the **Policy and Profile Manager** role sees only objects tagged **Seattle**. The role provides permissions, and the tag limits visibility.

A role assignment has three parts:

- **Members (Groups):** admin groups whose members get the role's permissions.
- **Scope (Groups):** the users and devices the admins can manage.
- **Scope (Tags):** admins see only Intune objects that carry these tags.

## The default scope tag

The **Default** tag is added automatically to all untagged objects that support scope tags. Learn compares it to security scopes in Configuration Manager. Some policy types do not show the **Scope Tags** page unless at least one custom tag exists besides Default.

## Step 1: Create a scope tag

This needs the Intune Administrator Microsoft Entra role. Learn marks it as privileged, to be used only when necessary.

1. In the Intune admin center, select **Tenant administration** > **Roles** > **Scope (Tags)** > **Create**.
2. On **Basics**, enter a **Name** and an optional **Description**.
3. On **Assignments**, choose the groups that contain the devices to receive the tag.
4. Select **Review + create** > **Create**.

## Step 2: Put the tag into a role assignment

1. Select **Tenant administration** > **Roles** > **All roles**, choose a role and select **Assignments** > **Assign**.
2. On **Basics**, enter an **Assignment name** and a description.
3. On **Admin Groups**, select **Add groups**.
4. On **Scope Groups**, under **Included groups**, choose **Add groups**, **Add All users** or **Add All devices**.
5. On **Scope tags**, select the tags. The maximum is 100 per role.
6. Select **Review + create** > **Create**.

## Step 3: Tag objects

For a configuration profile as the example:

1. Select **Devices** > **Manage devices** > **Configuration** and choose a profile.
2. Select **Properties** > **Scope (Tags)** > **Edit** > **Select scope tags**.
3. Choose the tags, select **Select** and then **Review + save**. The maximum is 100 per object.

## Behavior to know before you roll out

From the Learn page:

- Scope tags apply to object types that can have multiple versions, such as role assignments and apps.
- Not supported: Corp Device Identifiers, Windows Autopilot Devices, Device compliance locations and Jamf devices.
- VPP apps and ebooks inherit the scope tags of their VPP token.
- New objects automatically get all scope tags of the creating admin.
- Intune RBAC does not apply to Microsoft Entra roles. Intune Service Administrator has full access regardless of scope tags.
- A role assignment with no scope tag gives access to all objects allowed by its permissions. Admins with no scope tags effectively have all scope tags.
- You can assign only scope tags that appear in your own role assignments, and target only groups listed in the Scope (Groups) of your assignment.
- Admins with a scope tag in their assignment cannot update or delete that tag in the master list.
- An object must keep at least one scope tag.
- Auto scope tag assignments overwrite manually assigned tags. If several auto tags apply through group assignment, all apply.
- Exclude groups in policy or app assignments must be nested in an RBAC scope group or listed separately as a scope group.

## The merge problem and Scoped permissions

By default, when an admin is in multiple role assignments with different scope tags and the same permission category, for example Mobile Apps, Intune merges the permissions. That can grant broader access than intended.

Learn describes an opt-in public preview, introduced in March 2026, called **Scoped permissions**. With it, each assignment's permissions apply only within its own scope tag. Important points:

- Enabling is a one-time, irreversible action.
- The toggle is under **Tenant administration** > **Roles** > **Settings** > **Scoped permissions**.
- The required role is a custom Intune role with the **Update** action for **Organization** (recommended), or Intune Administrator.
- Before enabling, run **Generate Report** under **Tenant administration** > **Roles** > **Settings**. The **Permissions Assessment Report** shows, per group, the roles, scope tag, resource, old (merged) permissions and new (scoped) permissions, and can be exported to Excel.

Because it is a preview and irreversible, test the report first and decide with your change process.

## A rollout pattern

1. Define the boundaries, for example by site or business unit.
2. Create one scope tag per boundary and assign it to the device groups.
3. Create one role assignment per boundary, with its own admin group, scope group and tag.
4. Tag existing profiles, apps and policies. Check that each object has the intended tags.
5. Test with an admin account that holds only the delegated role.

## Typical mistakes

- Leaving an admin in a role assignment with no scope tag, which grants all tags.
- Putting the same admin into several assignments and getting merged permissions.
- Forgetting that new objects inherit all tags of the creating admin.
- Using the Intune Administrator role more often than needed. Learn marks it as privileged and says to use it only when necessary.

## Related

- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Microsoft 365 admin center](https://www.m365.fm/entity/microsoft-365-admin-center/)

## Sources

- [Use role-based access control (RBAC) and scope tags for distributed IT (Microsoft Learn)](https://learn.microsoft.com/intune/intune-service/fundamentals/scope-tags)
