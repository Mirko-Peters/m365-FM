---
title: "Use Workspace Identity in Microsoft Fabric for Trusted Access to Storage"
summary: "Create and manage a Fabric workspace identity: prerequisites, steps, what it authenticates, trusted workspace access to firewall-enabled ADLS Gen2 accounts, roles, limitations and deletion behavior."
status: review
publish: false
author: mirko-p
date: 2026-12-23
topics: [fabric-workspace]
keypoints:
  - "A workspace identity is an automatically managed service principal tied to a workspace. Fabric creates a service principal and app registration in Entra ID, with the workspace's name."
  - "Create it as a workspace admin under Workspace settings > Workspace identity > + Workspace identity. My workspace is not supported."
  - "Trusted workspace access to firewall-enabled ADLS Gen2 accounts through OneLake shortcuts needs a purchased Fabric F SKU capacity."
  - "It supports connections for OneLake shortcuts, pipelines, semantic models and Dataflows Gen2 (CI/CD)."
  - "Deleted identities cannot be restored, and restoring a deleted workspace does not restore its identity."
faq:
  - q: "What is a Fabric workspace identity?"
    a: "Microsoft Learn describes it as an automatically managed service principal associated with a Fabric workspace. Items can use it to authenticate to resources that support Microsoft Entra authentication, and Fabric obtains the tokens so you do not manage credentials."
  - q: "Who can create one, and where?"
    a: "A workspace admin, in a workspace that is not My workspace. In the Fabric portal open Workspaces, select the workspace, open Workspace settings and the Workspace identity tab, then select + Workspace identity."
  - q: "Which capacity do I need?"
    a: "Learn says you can create and use an identity on any capacity SKU, but trusted workspace access to firewall-enabled storage accounts requires a purchased Microsoft Fabric capacity, meaning an F SKU."
  - q: "What happens if the workspace moves to a trial capacity?"
    a: "Learn says moving the workspace to a non-Fabric capacity, a non-F SKU or a trial capacity does not delete the identity, but trusted workspace access stops working."
  - q: "Can a deleted identity be restored?"
    a: "No. Learn says deleted identities can't be restored and deleting one breaks items that depend on it. Restoring a deleted workspace also does not restore its identity, so you create a new one."
---

A workspace identity gives a Fabric workspace its own managed credential. Instead of storing keys or tokens, items in the workspace authenticate as that identity to services that support Microsoft Entra authentication. One of its two documented uses is trusted workspace access to storage accounts that sit behind a firewall. This guide follows the Microsoft Learn article.

## What it is

A Fabric workspace identity is an automatically managed service principal associated with a workspace. Fabric obtains Microsoft Entra tokens for the identity, so there are no credentials to manage. When you create it, Fabric creates a service principal and an app registration in Microsoft Entra ID. The identity's name is always the same as the workspace's name.

Workspaces with an identity can use **trusted workspace access** to read and write firewall-enabled ADLS Gen2 accounts through OneLake shortcuts.

## Prerequisites

- **Workspace role:** workspace admin.
- **Workspace type:** not My workspace.
- **Capacity:** the identity can be created and used on any capacity SKU. Trusted workspace access to firewall-enabled storage requires a purchased Fabric capacity (F SKU).
- **Tenant limit:** the page describes a tenant-level maximum number of identities, default 10,000, set in tenant settings. It does not mention a separate setting that allows creation, so if creation is blocked, check your tenant settings in the admin portal.

## Create the identity

1. Sign in to the Microsoft Fabric portal.
2. Select **Workspaces**, then your workspace.
3. Select **Workspace settings** (the gear icon).
4. Open the **Workspace identity** tab.
5. Select **+ Workspace identity**.

The tab then shows the identity details and its authorized users.

## What it supports

- **Authentication:** connections for OneLake shortcuts, pipelines, semantic models and Dataflows Gen2 (CI/CD).
- **Trusted workspace access:** shortcuts in the workspace can reach firewall-enabled ADLS Gen2 accounts.

Learn's page does not walk through the storage account side, such as the resource instance rule on the storage firewall. Use the trusted workspace access article for that configuration, which I did not read.

## Roles

| Role | What it can do |
| --- | --- |
| Workspace admin | Create and delete the identity |
| Admin, member or contributor | Configure the identity for authentication in connections |
| Fabric admin | Manage identities under Govern > Configurations > Fabric identities in the OneLake catalog |
| Microsoft Entra Application Administrator | View, modify and delete the service principal and app registration |

Learn says modifying the service principal or app registration in Entra isn't recommended, though adding API permissions is supported.

## Limitations

- Not supported for B2B or cross-tenant scenarios.
- Moving the workspace to a non-Fabric capacity, a non-F SKU or a trial capacity doesn't delete the identity, but trusted workspace access stops working.
- Deleting a workspace doesn't delete its identity right away. Fabric deletes it when the workspace is permanently deleted.
- Renaming a workspace renames the identity, but the underlying service principal and app registration keep their original objects.

## Deletion rules

- Deleting an identity breaks items that depend on it, and deleted identities can't be restored.
- A deleted workspace stays in a Deleted state for the retention period. The identity remains until permanent deletion, which happens when the retention period ends or a Fabric admin deletes the workspace permanently.
- Restoring a deleted workspace doesn't restore its identity. Create a new one.
- To remove the identity earlier, delete it on the **Workspace identity** tab before deleting the workspace, or ask a Fabric admin to permanently delete the workspace.
- Don't delete the service principal or app registration directly in the Azure portal. That causes errors and can delay cleanup.

## Questions to ask before deleting an identity

Because deletion cannot be undone and breaks dependent items, check these first, based on the supported uses above:

- Do any OneLake shortcuts in the workspace use trusted workspace access?
- Do pipelines, semantic models or Dataflows Gen2 (CI/CD) connections use the identity for authentication?
- Is the workspace about to be deleted? Deleting the workspace leaves the identity in place until permanent deletion, so you may not need a separate delete.
- If you only want to stop access, would removing the access on the storage side be enough? That is a design choice, not a statement from the page.

## Practical order of work

1. Confirm the workspace is on a purchased F SKU if storage is behind a firewall.
2. Create the identity as a workspace admin.
3. Grant the identity access on the storage side, following the storage and trusted workspace access documentation.
4. Create the shortcut or connection and test it.
5. Document who owns the identity, since deletion cannot be undone.

## Related

- [Fabric workspace](https://www.m365.fm/entity/fabric-workspace/)

## Sources

- [Workspace identity - Microsoft Fabric (Microsoft Learn)](https://learn.microsoft.com/fabric/security/workspace-identity)
