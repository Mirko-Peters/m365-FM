---
title: "Migrate From Entra Connect Sync to Cloud Sync Without Breaking Hybrid Identity"
summary: "How to move from Microsoft Entra Connect Sync to Cloud Sync using the guided tool or the manual phased path, with the blockers, scope rules, validation checks and rollback limits that Microsoft Learn documents."
status: review
publish: false
author: mirko-p
date: 2026-12-15
topics: [entra-cloud-sync, entra-connect, hybrid-entra-join, entra-id]
keypoints:
  - "Check eligibility first. The guided tool allows one forest, up to 2,000 in-scope objects and at most 30 included containers per domain."
  - "Custom sync rules, group filtering, a custom UPN, directory extensions and device sync block the guided tool."
  - "The guided tool puts Connect Sync into staging mode on activation, so only one engine exports at a time."
  - "In a manual migration, keep every object and reference in Connect Sync scope until validation is done, or group memberships can disappear."
  - "Keep Connect Sync installed for the two-week validation period. Learn documents no formal rollback, only a configuration backup and a disabled server."
faq:
  - q: "Can I run Connect Sync and Cloud Sync side by side?"
    a: "Only with care. The Microsoft Learn migration FAQ says the two must not export normal changes for the same object and attribute set at the same time. In the manual process, the cloudNoFlow and JoinNoFlow rules stop Connect Sync from exporting adds, deletes and non-reference attribute updates for migrated objects."
  - q: "Why is the Transition to Cloud Sync option missing in the wizard?"
    a: "Learn lists three checks. Run the wizard on the active Connect Sync server, not one in staging mode. Make sure the installed version is supported. Your organization and installation must also be eligible for the current migration wave."
  - q: "Does the guided tool validate everything after activation?"
    a: "No. According to Microsoft Learn it compares the aggregate Total Objects count, checks Cloud Sync job health and confirms Connect Sync is in staging mode. It does not check individual users, groups, memberships or writeback, so you validate those manually."
  - q: "Is there a rollback procedure?"
    a: "The pages I read do not document a formal one. They say to back up the Connect configuration before a manual migration, keep Connect Sync installed (or the server disabled, not uninstalled) during validation, and follow the wizard's recovery instructions if activation fails."
  - q: "What happens to Pass-Through Authentication and seamless SSO?"
    a: "The Learn migration FAQ says both keep working after migration, because they are configured separately from the sync tool."
---

The short answer: check whether the guided migration tool accepts your environment, run it on the active Connect Sync server, verify with Provision on Demand, and keep Connect Sync installed through a two-week validation period. If the tool blocks you, a manual phased migration exists, but only for scenarios Microsoft documents. If neither path fits, Microsoft says to stay on Connect Sync.

## Decide whether to migrate now

Microsoft Learn's decision guide compares the two products. Cloud Sync supports multiple and disconnected forests, multiple active agents and on-demand provisioning. It has a scale limit of 150,000 objects per domain and groups of up to 50,000 members, against 250,000 members in Connect Sync.

These Connect Sync capabilities have no Cloud Sync equivalent according to the guide:

- Advanced sync rules (Cloud Sync uses the expression builder)
- Cross-forest references
- Merging attributes from multiple domains
- Reconciliation (out-of-band sync correction)
- Device writeback, replaced by Cloud Kerberos Trust

Attribute-based filtering is limited in Cloud Sync. OU-based filtering works in both.

Before you commit, inventory the following in Connect Sync: object counts per domain, your largest groups, custom rules in the Synchronization Rules Editor, filters, forest topology, device sync and writeback use, and your authentication method (PHS, PTA or AD FS).

Also note the dates. The Learn FAQ says deadlines are organization-specific and tied to the notification your tenant receives. If a confirmed blocker prevents migration by that date, you can ask Microsoft Support for more time. Exceptions are reviewed individually and are not guaranteed.

## Path 1: The guided migration tool

### Prerequisites

- Hybrid Identity Administrator role
- Domain Admin credentials for each selected forest
- A supported Connect Sync version, on the active server (the tool cannot run from a server in staging mode)
- One Active Directory forest, no more than 2,000 in-scope objects, and additive OU scoping with no more than 30 included containers per domain
- None of the blockers: custom sync rules, group filtering, a custom UPN, directory extensions, device synchronization or unsupported writeback

Learn adds that device sync is a blocker for the tool even though Cloud Sync supports it generally. Do not remove required device sync just to pass the readiness check.

### Steps

1. On the active server, open the Microsoft Entra Connect Sync wizard and select **Configure** > **Transition to Cloud Sync**.
2. Sign in with a Hybrid Identity Administrator account and enter Domain Admin credentials per forest.
3. Review readiness. Results are Supported, Attention required or Migration blocked. Do not bypass a block.
4. Enter the quarantine notification email, download the readiness report, accept the consent checkbox and select **Start Transition**.
5. The tool installs the provisioning agent and creates disabled Cloud Sync configurations. Connect Sync stays the active exporter.
6. For each domain, select **Open Entra Portal**, open the new configuration and use **Provision on demand** with the distinguished name of a test user or group. Read the detailed result, not only the final indicator.
7. If password writeback is on, confirm tenant-level SSPR writeback, then select **Complete transfer to Cloud Sync**.
8. Activation enables Cloud Sync, places Connect Sync in staging mode and starts the first sync.
9. Validate manually, then select **Complete Migration**.

If you must wait for the next staging cycle, close the wizard. That releases the configuration mutex and keeps the transition state.

## Path 2: Manual phased migration

Learn's manual guidance targets installations set up with Express settings and says to use the guided tool instead when you are eligible. The core rule is on the page itself: do not remove OUs, domains, groups, users, contacts or other referenced objects from Connect Sync scope until migration and reference validation are complete. Early removal can remove group memberships in Entra ID.

The sequence from the pilot tutorial:

1. Back up the Connect configuration with the import and export settings feature.
2. Pick a small pilot OU or group that stays in Connect Sync scope.
3. Stop the scheduler with `Stop-ADSyncSyncCycle` and `Set-ADSyncScheduler -SyncCycleEnabled $false`.
4. In the Synchronization Rules Editor, add an inbound rule that sets `cloudNoFlow` to `True` for the pilot objects, and an outbound rule with link type `JoinNoFlow` scoped on `cloudNoFlow` equal to `True`. Repeat for user, group and contact objects.
5. Install the provisioning agent and create a Cloud Sync configuration scoped to the same OU.
6. Re-enable the scheduler with `Set-ADSyncScheduler -SyncCycleEnabled $true`.

After that, Connect Sync stops exporting object adds, deletes and non-reference attribute updates for those objects. Reference attributes such as `member` and `manager` can still flow. The tutorial warns that `cloudNoFlow` is not a read-only mode.

Make sure pilot objects have `ms-ds-consistencyGUID` populated so Cloud Sync can hard match them. The tutorial notes that Connect Sync does not populate it for groups by default.

## Validate before you cut over

- Compare the `Get-ADUser -SearchBase` count for the OU with the count in Entra ID.
- Check group memberships and manager relationships, not only user counts.
- Confirm password hash sync and password writeback with test users.
- Create a new test user in the OU and confirm it provisions.

## What the pages do not give you

Learn does not describe a formal rollback. For a manual pilot, the general rollback is to disable the provisioning configuration and disable the custom cloud provisioning rules, which triggers a full sync on all connectors. If memberships were removed because of early scope removal, re-add the objects to Connect Sync scope and run a full synchronization. For the guided tool, keep Connect Sync installed, follow the wizard's recovery instructions and do not delete or disable the migration-owned Cloud Sync resources.

## Related

- [Entra Cloud Sync](https://www.m365.fm/entity/entra-cloud-sync/)
- [Entra Connect](https://www.m365.fm/entity/entra-connect/)
- [Hybrid Entra join](https://www.m365.fm/entity/hybrid-entra-join/)

## Sources

- [Migrate from Microsoft Entra Connect Sync to Cloud Sync with the migration tool](https://learn.microsoft.com/en-us/entra/identity/hybrid/cloud-sync/migrate-connect-sync-cloud-sync-tool)
- [Migrating from Microsoft Entra Connect to Cloud Sync](https://learn.microsoft.com/en-us/entra/identity/hybrid/cloud-sync/migrate-azure-ad-connect-to-cloud-sync)
- [Pilot migration to Cloud Sync with OU-based scoping](https://learn.microsoft.com/en-us/entra/identity/hybrid/cloud-sync/tutorial-pilot-aadc-aadccp)
- [Cloud Sync migration FAQ](https://learn.microsoft.com/en-us/entra/identity/hybrid/cloud-sync/cloud-sync-migration-faq)
- [Migration decision guide](https://learn.microsoft.com/en-us/entra/identity/hybrid/cloud-sync/connect-to-cloud-sync-decision-guide)
- [What is Cloud Sync](https://learn.microsoft.com/en-us/entra/identity/hybrid/cloud-sync/what-is-cloud-sync)
