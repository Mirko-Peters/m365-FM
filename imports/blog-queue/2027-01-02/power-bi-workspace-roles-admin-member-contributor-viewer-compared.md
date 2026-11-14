---
title: "Power BI Workspace Roles Compared: Admin, Member, Contributor and Viewer"
summary: "Power BI workspace roles compared: what Admin, Member, Contributor and Viewer can do, how licensing affects them, and how Fabric adds capabilities to the same four roles."
status: review
publish: false
author: mirko-p
date: 2027-01-02
topics: [power-bi-service, fabric-workspace]
keypoints:
  - "Power BI and Fabric use the same four workspace roles: Admin, Member, Contributor and Viewer. Fabric extends them with new capabilities."
  - "Only Admin can update or delete the workspace and add or remove any user. Members can add users with lower permissions only."
  - "Contributors can create, edit and delete content but cannot publish or change who can edit an app unless the Admin delegates updates."
  - "Viewers can view and interact with items. In a Premium capacity workspace they need no Pro license, if they hold no other workspace role."
  - "A user in several groups gets the highest permission of all assigned roles. Members cannot upgrade or remove existing roles."
faq:
  - q: "What is the difference between Member and Contributor in a Power BI workspace?"
    a: "According to Microsoft Learn, both can create, edit and delete content. Members can also add users with lower permissions, publish and unpublish the workspace app, change app permissions and manage semantic model permissions. Contributors can update the app only if the Admin allows it."
  - q: "Can a Viewer use Analyze in Excel?"
    a: "Not by role alone. Microsoft Learn says that to let Viewers use Analyze in Excel or export underlying data, they need Build permission on the semantic model."
  - q: "Do Viewers need a Power BI Pro license?"
    a: "Microsoft Learn says that in a workspace on a Premium capacity, users with the Viewer role can access it without a Pro or PPU license. In a shared capacity, everyone added needs a Pro or PPU license."
  - q: "Can a Member change another user's role?"
    a: "Learn says Members can add users with lower permissions but cannot remove users from roles. To upgrade a user, for example from Viewer to Contributor, an Admin removes the user and a Member can then add them again with the new role."
  - q: "Do Fabric workspaces use different roles from Power BI?"
    a: "No. Microsoft Learn says Fabric workspace roles extend the Power BI workspace roles by associating new Fabric capabilities with the existing roles."
---

A Power BI workspace has four roles: Admin, Member, Contributor and Viewer. Admin controls the workspace and its people. Member can manage apps and add people with lower permissions. Contributor can create and edit content. Viewer can only view and interact. Microsoft Fabric uses the same four roles and adds Fabric capabilities to them.

This article summarizes what Microsoft Learn documents for the roles, the licensing rules, and the cautions that cause the most confusion. It covers Power BI first and then the Fabric additions.

## The four roles in Power BI

Microsoft Learn describes the roles in a capability table. The practical split looks like this:

| Capability | Admin | Member | Contributor | Viewer |
| --- | --- | --- | --- | --- |
| Update and delete the workspace | Yes | No | No | No |
| Add or remove any user in a role | Yes | No | No | No |
| Add members or others with lower permissions | Yes | Yes | No | No |
| Publish, unpublish and change permissions for an app | Yes | Yes | No | No |
| Update an app | Yes | Yes | If allowed | No |
| Manage semantic model permissions | Yes | Yes | No | No |
| Create, edit and delete content | Yes | Yes | Yes | No |
| Copy a report | Yes | Yes | Yes | No |
| Download a PBIX file | Yes | Yes | Yes | No |
| View and interact with an item | Yes | Yes | Yes | Yes |
| Create subscriptions to reports for yourself | Yes | Yes | Yes | Yes |

"If allowed" means the Admin delegates the permission. Learn says Contributors can then update the workspace app, but they cannot publish a new app or change who can edit it.

The full table on Learn has more rows, such as scheduling refreshes through the on-premises gateway (Admin, Member, Contributor) and managing subscriptions created by others (Admin only). Gateway refresh also needs gateway permissions, which are managed separately from workspace roles.

## What Fabric adds

Fabric workspaces sit on top of OneLake. Learn says the Fabric roles extend the Power BI roles by tying Fabric capabilities, such as data integration and data exploration, to the same four roles. Examples from the Fabric table:

- Only Admin can update and delete the workspace, add or remove people including other admins, create a workspace identity and connect the workspace to a Git repository.
- Admin, Member and Contributor can create or modify warehouse and database items and write or delete pipelines, notebooks and eventstreams.
- All four roles can view pipelines and notebooks, connect to the SQL analytics endpoint and read data with T-SQL through the TDS endpoint.
- Reading Lakehouse and warehouse data through OneLake APIs and Spark needs Admin, Member or Contributor.

You can assign roles to individuals, security groups, Microsoft 365 groups and distribution lists. Learn adds that Microsoft Entra service principals can also hold workspace roles for API-based operations. If someone sits in several groups, they get the highest level of permission among the roles assigned.

## Licensing rules to check first

Roles do not replace licensing. Learn states:

- In a shared capacity, everyone added needs a Power BI Pro or Premium Per User license.
- To distribute content inside the organization, either assign Pro licenses or place the workspace in a Premium capacity.
- In a Premium workspace, Viewers can access content without a Pro or PPU license. Admin, Member and Contributor are not prompted to upgrade while browsing, only when they try to create something.
- To keep an unlicensed user as a Viewer, make sure they hold no other role, individually or through a group.
- Assigning a role to a user without the required license is allowed, but that user cannot use the role's features until licensed.

## Viewer role, Build permission and row-level security

Viewers need Build permission on a semantic model to use Analyze in Excel or export underlying data. Learn also recommends the Viewer role when you want row-level security to apply to people who browse workspace content. RLS can also be enforced without workspace access, by publishing an app or by sharing.

## How to choose a role

Use this as a decision aid based on the documented capabilities:

1. **Report consumers:** Viewer. Add Build permission only if they must analyze in Excel.
2. **Report authors:** Contributor. They can edit content but cannot manage the app or its audience.
3. **Team leads who run the app:** Member. They can publish the app and add people with lower permissions.
4. **Workspace owners:** Admin. Keep this group small, because Admin can delete the workspace.

Prefer groups over individual assignments so that access changes happen in one place.

## Cautions from Microsoft Learn

- **Members cannot change existing roles.** An Admin must remove a user before a Member can re-add them at a higher role.
- **Guest users keep their roles** even if the tenant setting that lets Microsoft Entra guest users edit and manage content is disabled.
- **Disabling a user in Microsoft Entra ID does not remove workspace access records.** The user cannot reach items while disabled, but the records remain until the user is permanently deleted.
- **A Pro user can be a member of at most 1,000 workspaces.**

## Typical mistakes

- Giving Contributor to people who need to publish the app. They need Member.
- Expecting Viewers to export data. Without Build permission they cannot.
- Adding an unlicensed user to a shared-capacity workspace and wondering why features fail.
- Placing a Viewer in a second group with a higher role, which silently raises their permission.

## Related

- [Power BI Service](https://www.m365.fm/entity/power-bi-service/)
- [Fabric workspace](https://www.m365.fm/entity/fabric-workspace/)
- [Power BI](https://www.m365.fm/entity/power-bi/)

## Sources

- [Roles in workspaces in Power BI (Microsoft Learn)](https://learn.microsoft.com/power-bi/collaborate-share/service-roles-new-workspaces)
- [Roles in workspaces in Microsoft Fabric (Microsoft Learn)](https://learn.microsoft.com/fabric/fundamentals/roles-workspaces)
- [Workspaces in Power BI (Microsoft Learn)](https://learn.microsoft.com/power-bi/collaborate-share/service-new-workspaces)
