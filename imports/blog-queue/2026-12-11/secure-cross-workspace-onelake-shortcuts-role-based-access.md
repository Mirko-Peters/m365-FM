---
title: "Secure Cross-Workspace OneLake Shortcuts with OneLake Security Roles and Access Rules"
summary: "How access works for a OneLake shortcut across workspaces: passthrough vs delegated identity, which permissions each side needs, how OneLake security roles, RLS and CLS apply, and the limits to plan for."
status: review
publish: false
author: mirko-p
date: 2026-12-11
topics: [onelake-shortcuts, onelake-security, onelake, fabric]
keypoints:
  - "For a shortcut, the most restrictive permission across the shortcut path and the target path applies."
  - "Same-tenant OneLake shortcuts use passthrough by default. Choose Delegated identity at creation if a team should manage access separately."
  - "Switching between passthrough and delegated means deleting and recreating the shortcut."
  - "Admin, Member and Contributor workspace roles are not restricted by OneLake security roles. Roles apply to Viewer or item Read users."
  - "CLS works on both sides of a delegated shortcut. RLS can be set only on the producer side."
faq:
  - q: "Which permissions do I need to create a shortcut to another workspace?"
    a: "According to Microsoft Learn, you need item Write permission or OneLake security ReadWrite on the shortcut path, and OneLake security Read on the target path. For target items that do not support OneLake security yet, the target permission is item ReadAll. Users in the Viewer role also need Fabric Read on the shortcut path."
  - q: "What is the difference between passthrough and delegated shortcuts?"
    a: "Passthrough passes the caller's identity to the target, so users see only what they can access there. Delegated uses an intermediate credential such as another user, a service principal or an account key. Learn says the caller then gets the intersection of their own security and the delegated identity's security."
  - q: "Can I put row-level security on the consumer side of a shortcut?"
    a: "No. Microsoft Learn states that RLS is supported only on the producer side of a delegated shortcut, while column-level security is supported on both sides. A user can hold only one OneLake security role with CLS on the consumer side if the producer side also has RLS."
  - q: "Do OneLake security roles restrict workspace Admins and Members?"
    a: "No. Learn says Admin, Member and Contributor workspace roles are not restricted by OneLake security roles. Roles apply to users with the Viewer role or item Read permission."
  - q: "How do I audit changes to shortcuts and roles?"
    a: "The OneLake security overview says the Fabric audit log records control-plane changes such as security roles, shortcuts and sharing. OneLake diagnostics records data access through OneLake APIs, with events stored in a lakehouse you select."
---

A cross-workspace shortcut is secured on two sides: the workspace where the shortcut lives and the workspace where the data lives. The most restrictive permission wins. Decide first whether the shortcut should pass the caller's identity through to the source or use a delegated identity, then define OneLake security roles for the users who should see the data.

## Terms

- **Target path**: the location the shortcut points to.
- **Shortcut path**: the location where the shortcut appears.

## Step 1: Choose passthrough or delegated

| Shortcut type | Authentication model |
|---|---|
| Same-tenant OneLake to OneLake | Passthrough (default) or delegated |
| Cross-tenant OneLake to OneLake | Delegated only |
| External, such as Amazon S3 or Google Cloud Storage | Delegated only |

**Passthrough** passes the caller's identity to the target. Users see only what they can access there, and the source keeps full control. Access controls do not need to be copied to the consumer.

**Delegated** uses another identity: a user, a service principal or an account key. A business unit can then manage OneLake security for its own users, who need no direct source access. The caller receives the intersection of their own security and the delegated identity's security. If the consumer has full access but the producer allows only columns C1 and C2, the result is C1 and C2.

Choose **Delegated identity** when you create the shortcut. Switching later means deleting and recreating it.

## Step 2: Grant the permissions each side needs

Learn lists these permissions for shortcut operations:

| Action | On the shortcut path | On the target path |
|---|---|---|
| Create a shortcut | Item Write, or OneLake security ReadWrite | OneLake security Read (item ReadAll for items without OneLake security) |
| Delete a shortcut | Item Write, or OneLake security ReadWrite | Not applicable |
| Read data | OneLake security Read (item ReadAll without it) | Same |
| Write to the target | Item Write or ReadWrite | Item Write or ReadWrite |

A user with write access in the lakehouse but only read on the target cannot write to the target, and the reverse is also true.

For users in the Viewer role or with item Read permission, Learn lists a combined requirement. Create and update need Fabric Read plus OneLake security ReadWrite on the shortcut path and OneLake security Read on the new target. Delete needs Fabric Read plus OneLake security ReadWrite on the shortcut path. Listing or getting shortcuts needs Fabric Read plus OneLake security Read.

## Step 3: Understand who the roles affect

OneLake enforces security on two planes. The control plane, set with workspace roles and item permissions, governs what you can do to an item. The data plane, which is OneLake security, governs which data you can see or change, down to rows and columns. OneLake security is role-based access control for data in OneLake, enforced across Fabric engines. Each role has permissions (Read or ReadWrite), a type (only Grant roles exist), data in the role and members. Admin or Member workspace roles can create roles.

- **Admin, Member and Contributor** users are not restricted by OneLake security roles. They need access to both paths, and Read on the target to create or update a shortcut.
- **Viewer** users and users with item Read permission are governed by their OneLake security roles. For shortcut operations they need the matching OneLake security permission plus Fabric Read.

Every lakehouse has a **DefaultReader** role that gives data access to users with the ReadAll item permission. You can edit or delete it to remove that access.

## Step 4: Apply row and column security correctly

- **CLS** is supported on both producer and consumer sides of a delegated shortcut.
- **RLS** is supported only on the producer side.
- A user can hold only one OneLake security role with CLS on the consumer side if the producer side also has RLS.

OneLake folder security applies to shortcuts based on the roles defined in the lakehouse where the data is stored.

## Step 5: Check the tenant settings

To use shortcuts with OneLake security, the tenant setting **Users can access data stored in OneLake with apps external to Fabric** must be enabled. For service principals, a tenant admin must enable service principal access under developer settings.

## Exceptions that surprise people

When data is read through a Power BI semantic model using DirectLake over SQL, or through T-SQL engines in Delegated identity mode, the engine uses the item owner's identity to reach the target. OneLake security roles still filter what the end user sees, but permissions set directly on the target path for the end user are bypassed.

Accessing external shortcuts through Spark or direct API calls also needs read permission on the item that contains the external shortcut path, in addition to OneLake security access to the producer path.

## Which model fits which situation

| Situation | Better fit | Reason from Learn |
|---|---|---|
| Source team wants full control and users already have source access | Passthrough | The source keeps control, no access rules are copied |
| A business unit should serve users who have no direct source access | Delegated | A fixed connection identity serves them, and the unit manages roles for its users |
| Source is in another tenant or in S3 or Google Cloud Storage | Delegated (only option) | Users do not need direct access to the external system |
| You need row-level filtering for consumers | Define RLS on the producer side | RLS cannot be set on the consumer side |

Before rollout, test with a Viewer account, not an Admin. Admin, Member and Contributor users bypass OneLake security roles, so a test with those roles proves nothing about your restrictions.

## Audit

Use the **Fabric audit log** for changes to security roles, shortcuts and sharing. Use **OneLake diagnostics** for data access through OneLake APIs.

## What the pages do not describe

The overview page I read does not give portal steps for creating roles or the exact menu path, so follow the linked role management article for that. It also does not describe the SQL analytics endpoint identity mode in detail.

## Related

- [OneLake shortcuts](https://www.m365.fm/entity/onelake-shortcuts/)
- [OneLake security](https://www.m365.fm/entity/onelake-security/)
- [OneLake](https://www.m365.fm/entity/onelake/)
- [Microsoft Fabric](https://www.m365.fm/entity/fabric/)

## Sources

- [OneLake shortcut security](https://learn.microsoft.com/en-us/fabric/onelake/onelake-shortcut-security)
- [OneLake security overview](https://learn.microsoft.com/en-us/fabric/onelake/security/get-started-security)
