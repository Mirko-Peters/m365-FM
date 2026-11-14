---
title: "Record-Level Security for Canvas Apps in Dataverse: Options Beyond Standard Security Roles"
summary: "Enforce record-level access for canvas apps at the Dataverse layer: business units, owner and access teams, hierarchy security, record sharing and column security, with the limits Microsoft documents."
status: review
publish: false
author: mirko-p
date: 2026-12-12
topics: [power-apps, dataverse, dataverse-security-roles, dataverse-hierarchy-security]
keypoints:
  - "Sharing a canvas app does not share its data. Users need a Dataverse security role with privileges on each table the app uses."
  - "Access is cumulative: a user gets the broadest access from all roles and teams, and one role cannot hide a record that another role grants."
  - "Business units set the security boundary, and access levels are User, Business Unit, Parent-Child Business Units and Organization."
  - "Manager or position hierarchy security extends access to reports' data. A manager needs at least user-level Read on the table."
  - "Use record sharing only for exceptions and column-level security only where needed, because both have performance and maintenance costs."
faq:
  - q: "Does sharing a canvas app give users access to the data?"
    a: "No. Microsoft Learn says that for a shared app to work, you must also manage permissions for the data source. For Dataverse, users must belong to a security role that can read, write, create or delete the relevant records."
  - q: "Can one security role hide a record that another role grants?"
    a: "No. Microsoft Learn says that if one role grants organization-level read access to all contact records, another role cannot hide a specific contact from the user. Access is cumulative, and the broadest grant wins."
  - q: "When should I use hierarchy security?"
    a: "Microsoft Learn describes it as a more granular access extension that works with business units, security roles, sharing and teams. It suits cases where managers need to see their reports' data. Microsoft advises keeping the effective hierarchy to 50 users or fewer under a manager or position."
  - q: "Does column-level security grant access to a record?"
    a: "No. Microsoft Learn states that column-level security does not grant access to a record. A user must already have record access before a column security profile can grant access to secured columns."
---

For canvas apps, record-level security belongs in the data layer. If the app uses Dataverse, the model of business units, security roles, teams, hierarchy and sharing decides which rows each user can read or change, no matter how the app screens are built. The sections below follow Microsoft Learn's Dataverse security documentation and the canvas app sharing article.

## Start with how access works

Microsoft's sharing article says a shared app needs more than the share: you must manage permissions for the data source. For Dataverse, users must belong to a security role that can create, read, write and delete the records the app uses, and in many cases you create custom roles for this. For other sources, such as an Excel file on OneDrive, share the file with app users yourself.

If you enable app-level security roles when sharing, Microsoft lists four: App reader, App user, App maker and App admin, each with different rights on user or team owned tables and organization owned tables. App user gives full access only to the user's own records in user or team owned tables, and read access to organization owned tables.

The pages read do not say whether filtering or hiding data inside the app counts as security. Treat in-app filters as presentation, and enforce access in Dataverse.

## The building blocks

Microsoft's security concepts article gives the pieces:

- **Business units** define security boundaries. Every database has one root business unit, and every user belongs to one. By default the user's business unit owns the records the user creates.
- **Security roles** grant privileges: Create, Read, Write, Delete, Append, Append To, Assign and Share. Each privilege has an access level of User, Business Unit, Parent-Child Business Units or Organization.
- **Ownership** is chosen when the table is created and cannot be changed later. Organization-owned tables allow all or no records. User or team owned tables support the four levels.
- **Teams** belong to a business unit. Owner teams can own records and give every member access. Access teams own nothing and have no roles, but provide access to shared records.
- **Sharing** handles single-record exceptions.

Access is cumulative across roles, team roles, business units and shared records, and the broadest permission wins. One role cannot narrow another.

## Pattern 1: Business unit boundaries

Use business units when users in one division must see only that division's rows. Microsoft's example: a user with business unit-level Read on Contact reads the contacts in the division but not those in another division. A hierarchical structure separates data in a tree. Microsoft also describes a matrix structure for modernized business units, where a user can access data in several business units by holding a role from each.

## Pattern 2: Teams for groups of users

Create an owner team when a group should own and see the same records, and assign the team a security role. The default team of a business unit always contains all users of the unit, and you cannot add or remove its members manually. Use an access team when records need to be shared with a changing group but the group does not need to own anything.

## Pattern 3: Hierarchy security

Hierarchy security extends the other models. Microsoft describes two:

- **Manager hierarchy:** based on the Manager field of the system user table. Managers access the data their reports can access.
- **Position hierarchy:** based on positions arranged in a tree, with users tagged with one position per hierarchy. It allows data access across business units.

To enable it, open the environment in the Power Platform admin center, then **Settings** > **Users + Permissions** > **Hierarchy security**, and select a model. In **Hierarchy Table Management** you can exclude tables, and **Depth** limits how many levels a manager can see. A manager needs at least user-level Read on the table. Access to nondirect reports is read-only, while direct reports allow Read, Write, Append and Append To. Microsoft advises keeping effective hierarchy security to 50 users or fewer per manager or position, and creating fewer business units instead of many.

Hierarchy security is disabled by default and changing it requires the Change Hierarchy Security Settings privilege.

## Pattern 4: Share individual records

Microsoft says to use record sharing only for exceptions. It performs less efficiently and can be harder to troubleshoot than role-based access. Sharing with a team is more efficient than sharing with each user.

## Pattern 5: Column-level security

When record access is not enough, secure specific columns. Enable column security on the column, then create a column security profile that grants Create, Update and Read, and assign it to users or teams. It does not grant record access. Microsoft cautions that excessive use can reduce performance.

## Build and test

1. Decide the boundary: division, team or manager chain.
2. Create custom security roles with the minimum privileges and access levels the app needs.
3. Assign users through teams where possible.
4. Add hierarchy or sharing only for exceptions.
5. Test with a test account in each role. Use a separate browser profile, then open the app and check which rows show.

The pages read do not describe canvas-specific patterns, such as delegation behavior with security filters. Check the delegation guidance if your app queries large tables, and see the related guide on this site.

## Related

- [Power Apps](https://www.m365.fm/entity/power-apps/)
- [Dataverse](https://www.m365.fm/entity/dataverse/)
- [Dataverse security roles](https://www.m365.fm/entity/dataverse-security-roles/)
- [Dataverse hierarchy security](https://www.m365.fm/entity/dataverse-hierarchy-security/)

## Sources

- [Microsoft Learn: Security concepts in Microsoft Dataverse](https://learn.microsoft.com/en-us/power-platform/admin/wp-security-cds)
- [Microsoft Learn: Hierarchy security](https://learn.microsoft.com/en-us/power-platform/admin/hierarchy-security)
- [Microsoft Learn: Share a canvas app](https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/share-app)
