---
title: "Dataverse Security Roles, Business Units and Teams Explained"
summary: "How Dataverse security fits together: security roles with access levels and table privileges, business units and record ownership, and team types, with role assignment steps. Based on four Microsoft Learn pages, with the gaps they leave."
status: review
publish: false
author: mirko-p
date: 2027-01-12
topics: [dataverse-security-roles, dataverse-business-units, dataverse-teams]
keypoints:
  - "Dataverse uses a role-based model. Security roles combine access levels with table privileges. Privileges are cumulative across a user's roles and team roles, and the broadest access applies."
  - "Access levels on the page are User, Business Unit, Parent: Child Business Unit and Organization, each including the levels below it. None means no access."
  - "Every database has one root business unit. Every user belongs to a business unit, and by default the user's business unit owns the records the user creates."
  - "Owner teams own records and hold roles. Access teams do not own records or hold roles. Entra group teams can own records and hold roles, with membership derived from the Entra group."
  - "Tenant-level admin roles do not automatically grant Dataverse data access. A tenant admin also needs System Administrator in the environment."
faq:
  - q: "What is a security role?"
    a: "A set of privileges and access levels. Microsoft Learn says Dataverse uses a role-based security model and that access depends on a combination of access levels and permissions in a security role."
  - q: "What are the access levels?"
    a: "User, Business Unit, Parent: Child Business Unit and Organization, plus None. Each level includes the levels below it. Organization access means all records in the organization."
  - q: "What are business units for?"
    a: "To divide users and data into smaller security boundaries. Every database has one root business unit, every user belongs to one, and records created by a user are by default owned by the user's business unit."
  - q: "What is the difference between owner and access teams?"
    a: "An owner team owns records and has security roles. An access team does not own records or have security roles. Records are shared with it and it is granted access rights such as Read, Write and Append."
  - q: "Do tenant admins see Dataverse data?"
    a: "Not automatically. Tenant-level roles do not grant Dataverse data access. A tenant admin also needs the System Administrator role in the specific environment."
---

Dataverse security rests on three ideas: security roles decide what a user can do, business units decide where, and teams decide who gets which role as a group. This guide combines four Microsoft Learn pages: the security overview, the page on security roles and access levels, the page on business units and teams, and the page on managing teams. The security overview page itself covers role types and predefined roles only, and the other pages fill in the rest.

## Role types

The overview lists four scopes: tenant-level admin roles such as Power Platform administrator, environment-level roles such as Environment Admin and Environment Maker, Dataverse security roles such as System Administrator, System Customizer and Basic User, and app-specific roles.

- Predefined security roles follow the minimum required access principle.
- Roles can be assigned to a user, an owner team and a group team.
- Tenant-level roles do not automatically grant Dataverse data access. A tenant admin also needs System Administrator in the environment.
- Environment Maker can create apps, connections, custom APIs and flows, but has no privileges to access data in an environment.

## Access levels

| Level on the page | Meaning |
| --- | --- |
| Organization | All records in the organization, regardless of business unit. Includes all other levels |
| Parent: Child Business Unit | Records in the user's business unit and all business units below it |
| Business Unit | Records in the user's business unit |
| User | Records the user owns, records shared with the organization, with the user, or with a team the user belongs to |
| None | No access |

The page does not use the names Basic, Local, Deep and Global. For organization-owned tables, miscellaneous and privacy-related privileges have only Organization or None.

## Table privileges

Create, Read, Write and Delete work as the names suggest. Append is needed to associate the current record with another record, and Append to to associate another record with it. Assign gives ownership to another user. Share gives access to a record to another user while keeping your own access.

## How roles combine

A user can have multiple roles, and privileges are cumulative. A user receives the broadest access from all roles and team memberships. The page describes no deny behavior. The setting Member's privilege inheritance has two options: Team privileges only, and Direct User (Basic) access level and Team privileges, which is the default for new roles.

## Business units

- Every Dataverse database has one root business unit. Child business units divide users and data into smaller security boundaries.
- Every user belongs to a business unit. When a user first accesses the environment, Dataverse creates the user in the root business unit.
- By default, the user's business unit owns the records the user creates. The security role decides which records the user can access in that business unit.
- With the feature Record ownership across business units, a user can hold roles from several business units and choose the owning business unit of a record.
- Example from the page: a user in Division A with business-unit-level Read on Contact can read Contact 1 and 2 but not Contact 3 in another division.

## Teams

| Team type | Owns records | Holds security roles |
| --- | --- | --- |
| Owner | Yes | Yes |
| Access | No | No |
| Microsoft Entra group (security or Office) | Yes | Yes |

- Each team belongs to a business unit but can include users from other business units. A user can belong to several teams.
- Dataverse creates a default team for every business unit. It always includes all users of that unit, and you cannot add or remove members by hand.
- Owner team members are added manually. Entra group team members are derived dynamically from Entra group membership when they access an environment, and managing members must be done by a Microsoft Entra admin.
- Access teams give access because a record is shared with the team. Access rights include Read, Write and Append.

## Create a team and assign roles

1. In the Power Platform admin center go to **Manage** > **Environments**, select the environment, then **Settings** > **Users + permissions** > **Teams** > **Create team**.
2. Enter a unique team name within the business unit, a description, the business unit, an administrator (for reference only) and the team type. For Entra types select the group name and membership type.
3. To assign roles, open the team list, select the team, then the ellipsis > **Manage security roles**, choose the roles and select **Save** twice.

## What the pages do not say

- A formal definition of user-owned versus organization-owned tables.
- The membership type values for Entra teams and the differences between security and Office group teams.
- Whether owner teams can span business units and how team access levels interact with business unit access.
- Whether Write implies Read at the same level.

## A design outline

This outline is practical advice built on the pages.

1. Model business units only where data needs a security boundary.
2. Give users the least access level that works, and use User level first.
3. Use Entra group teams where group membership is already managed in Entra.
4. Use access teams for sharing and owner or group teams for role-based access.
5. Test with a user whose roles you know, since privileges are cumulative.

## Typical mistakes

- Assuming a tenant admin role gives data access.
- Creating many business units that mirror an org chart without a security need.
- Expecting an access team to carry security roles.
- Forgetting that team roles add to the user's own roles.

## Related

- [Dataverse security roles](https://www.m365.fm/entity/dataverse-security-roles/)
- [Dataverse business units](https://www.m365.fm/entity/dataverse-business-units/)
- [Dataverse teams](https://www.m365.fm/entity/dataverse-teams/)
- [Dataverse](https://www.m365.fm/entity/dataverse/)

## Sources

- [Configure environment security in Dataverse (Microsoft Learn)](https://learn.microsoft.com/power-platform/admin/database-security)
- [Security roles and privileges (Microsoft Learn)](https://learn.microsoft.com/power-platform/admin/security-roles-privileges)
- [Security concepts in Dataverse (Microsoft Learn)](https://learn.microsoft.com/power-platform/admin/wp-security-cds)
- [Manage teams (Microsoft Learn)](https://learn.microsoft.com/power-platform/admin/manage-teams)
