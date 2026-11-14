---
title: "Set Up Cross-Tenant Synchronization Between Microsoft Entra Tenants: Step by Step"
summary: "Configure Microsoft Entra cross-tenant synchronization using Microsoft Learn: licensing and roles, inbound settings, automatic redemption in both tenants, the source configuration, scope, mappings, on-demand provisioning, monitoring and common errors."
status: review
publish: false
author: mirko-p
date: 2026-12-30
topics: [entra-id, entra-external-id]
keypoints:
  - "Cross-tenant user sync needs Entra ID P1 or P2 in the source tenant. Group sync needs Entra ID Governance or the Entra Suite."
  - "In the target tenant add the source under Cross-tenant access settings, allow user synchronization and check Automatically redeem invitations. Do the same outbound in the source tenant."
  - "Create the configuration in the source tenant under Cross-tenant synchronization, test the connection, assign users, then use Provision on demand before you start provisioning."
  - "Later sync cycles run about every 40 minutes. Users with SMS sign-in enabled are skipped, and role assignments are not synchronized."
  - "Prefer Sync only assigned users. The matching attribute alternativeSecurityIds cannot be changed."
faq:
  - q: "What do I need before starting?"
    a: "According to Microsoft Learn, Entra ID P1 or P2 in the source tenant for user sync, Entra ID Governance or the Entra Suite for group sync, Security Administrator for cross-tenant access settings, Hybrid Identity Administrator for the sync configuration, and Cloud Application Administrator or Application Administrator to assign users."
  - q: "Where do I allow sync in the target tenant?"
    a: "Under Entra ID, External Identities, Cross-tenant access settings, Organization settings, add the source tenant, then on the Cross-tenant sync tab select Allow user synchronization into this tenant."
  - q: "Why does test connection fail with AzureActiveDirectoryCrossTenantSyncPolicyCheckFailure?"
    a: "Learn says automatic redemption is not set up in the source tenant, the target tenant or both. Complete the automatic redemption steps in both."
  - q: "How often does sync run?"
    a: "After the initial cycle, approximately every 40 minutes while the service is running."
  - q: "Do role assignments sync?"
    a: "No. Role-enabled group sync creates role-assignable groups in the target, but does not copy role assignments."
---

Cross-tenant synchronization automatically creates and removes B2B users in a target tenant from a source tenant, and can sync security groups in same-cloud setups. This guide follows the Microsoft Learn configuration article, which has a same-cloud and a cross-cloud variant. Role assignments and role-enabled groups are covered on the Learn overview page, not on the configuration page.

## Prerequisites

- **Source tenant:** Entra ID P1 or P2 for user sync. Entra ID Governance or the Entra Suite for group sync.
- **Roles in the source:** Security Administrator for cross-tenant access settings, Hybrid Identity Administrator for the synchronization configuration, and Cloud Application Administrator or Application Administrator to assign users and delete a configuration.
- **Target tenant:** Security Administrator for cross-tenant access settings.

Plan first: how your tenants are structured, who is in scope and what data to map.

## Target tenant: allow inbound sync

1. In the Entra admin center go to **Entra ID**, **External Identities**, **Cross-tenant access settings**.
2. On **Organization settings** select **Add organization** and enter the source tenant ID or domain.
3. Under **Inbound access** select **Inherited from default**, then the **Cross-tenant sync** tab.
4. Select **Allow user synchronization into this tenant**, optionally allow group synchronization, and save.
5. If the dialog about enabling cross-tenant sync and auto-redemption appears, select **Yes**.
6. On the **Trust settings** tab check **Automatically redeem invitations with the tenant** and save.

## Source tenant: redeem outbound

In the source tenant add the target organization the same way, select **Inherited from default** under **Outbound access**, open **Trust settings** and check **Automatically redeem invitations**.

## Create the configuration

1. In the source tenant go to **Entra ID**, **Cross-tenant synchronization**, **Configurations**, **New configuration**, and name it.
2. Open it, create the provisioning configuration, enter the target **Tenant Id** under **Admin credentials** and select **Test connection**.
3. Select **Create**.

## Scope and mappings

In **Properties**, **Basics** choose a scope: Sync all users (Learn recommends Sync only assigned users instead), Sync only assigned users (recommended) or Sync only assigned users and groups (required for groups). Then assign at least one internal user under **Users and groups**. Group assignment includes only direct members and does not cascade to nested groups.

Review **Attribute mapping**. AltSecIdFromNetId([netId]) maps to alternativeSecurityIds, which identifies users across tenants. This matching attribute cannot be changed, and changing it causes a schemaInvalid error. The userType mapping defaults to Member, an external member with internal-like functionality, and can be Guest. For an existing B2B user it changes only if Apply this mapping is set to Always. Under **Properties** you can set a notification email and Prevent accidental deletion, whose default threshold is 500.

## Test, start and monitor

1. Use **Provision on demand** with a test user and check the target tenant.
2. Select **Start provisioning**. The initial cycle takes longer than later ones, which run about every 40 minutes.
3. Monitor through the Overview progress bar, Provisioning logs and Audit logs. In the target, actions show the actor Microsoft.Azure.SyncFabric.
4. In the target tenant, **External collaboration settings** under **External user leave settings** controls whether external users can leave.

## Limitations stated on the page

- Role assignments are not synchronized (stated on the overview page).
- Restoring a previously soft-deleted user in the target tenant is not supported.
- Users with SMS sign-in enabled are skipped.
- On-demand provisioning through Graph is limited to 5 requests per 10 seconds.
- Users created as Member may not work with some services, with limitations documented for Azure Virtual Desktop and Teams.

## Troubleshooting test connection

| Error | Cause |
| --- | --- |
| AzureActiveDirectoryCrossTenantSyncPolicyCheckFailure | Automatic redemption missing in source, target or both |
| AzureActiveDirectoryForbidden | The target guest invite setting is the most restrictive option |
| Automatic redemption checkbox disabled | No Entra ID P1 or P2 license |
| EntityTypeNotSupported for a group | Group provisioning is not enabled in the source |

## Cross-cloud and group sync

The page also covers cross-cloud synchronization, which syncs users only, from Azure commercial to Azure Government, from Azure Government to commercial, and from commercial to Azure operated by 21Vianet. It requires an Entra ID Governance or Entra Suite license in the source tenant. For these you enable the cross-cloud setting on the Microsoft cloud settings tab in both tenants and select Setup cross-tenant synchronization across Microsoft clouds when creating the configuration. Same-cloud group sync is optional and needs group provisioning set to Enabled under Provision Microsoft Entra ID Groups. According to the overview page, role-enabled group sync needs a direct isAssignableToRole mapping applied only during object creation, and existing target groups are not converted.

## Soft delete and duplicates

Learn says restoring a previously soft-deleted user in the target tenant is not supported and must be done manually. Soft-deleting and then restoring through on-demand provisioning can create duplicates, so avoid that approach.

## Not covered

The page does not describe deleting a configuration in detail, scale limits, pricing beyond the license link or the duration of the initial sync. In its ExternalTenantNotFound section it says to delete the configuration in the source tenant but create the new one in the target tenant, which conflicts with Step 5, where the configuration is created in the source tenant.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Entra External ID](https://www.m365.fm/entity/entra-external-id/)

## Sources

- [Configure cross-tenant synchronization (Microsoft Learn)](https://learn.microsoft.com/entra/identity/multi-tenant-organizations/cross-tenant-synchronization-configure)
- [What is cross-tenant synchronization in Microsoft Entra ID? (Microsoft Learn)](https://learn.microsoft.com/entra/identity/multi-tenant-organizations/cross-tenant-synchronization-overview)
