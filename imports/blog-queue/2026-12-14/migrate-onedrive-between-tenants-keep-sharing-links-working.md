---
title: "Migrate OneDrive Between Microsoft 365 Tenants Without Breaking Sharing Links"
summary: "How Microsoft's cross-tenant OneDrive migration keeps existing sharing links working through redirects, what the identity mapping file controls, and which limits and blockers to check before you schedule a move."
status: review
publish: false
author: mirko-p
date: 2026-12-14
topics: [onedrive, microsoft-365, sharepoint-migration, powershell]
keypoints:
  - "Microsoft's cross-tenant OneDrive migration moves content and leaves a redirect at the old location, so existing links to files and folders keep working."
  - "Redirected links only work for people who still have access at the destination, so the identity mapping file and guest accounts decide what survives."
  - "The move is one-and-done. Learn states that incremental or delta passes cannot be performed, so test with a pilot batch first."
  - "Hard limits: 4,000 accounts queued per batch, 5 TB or 1 million items per OneDrive, 400 characters per path, and no target OneDrive may exist beforehand."
  - "Remove the cross-tenant trust before the source licenses expire, and remove redirect sites only after the whole migration is complete."
faq:
  - q: "Do sharing links keep working after a cross-tenant OneDrive migration?"
    a: "According to Microsoft Learn, existing shared links for migrated files automatically redirect to the new target location. The redirect is a placeholder site at the old OneDrive location. A person who follows the link still needs access to the destination, which depends on the identity mapping file."
  - q: "Can I run the migration more than once to catch new files?"
    a: "No. Microsoft Learn describes the move as one-and-done: content is moved, not copied, and incremental or delta migration passes cannot be performed. Each OneDrive is read-only for a few minutes during the move, so schedule it for a quiet window."
  - q: "What happens to people who stay in the source tenant?"
    a: "The Learn step for precreating users says that anyone who remains in the source tenant but needs access to migrated resources should get a new guest identity in the target tenant. Without it, they are not part of the identity mapping and lose access."
  - q: "Does the migration need a license?"
    a: "Learn says the Cross Tenant User Data Migration add-on is required, as a per-migration one-time fee that can be assigned to the source or target user. It also states that migrations fail if the licenses are not purchased or verified beforehand."
---

Cross-tenant OneDrive migration is the one Microsoft-native way to move a user's OneDrive from one Microsoft 365 tenant to another without copying files by hand. Links to the moved files keep working because Microsoft leaves a redirect at the old location. That redirect only helps people who still have access in the target tenant, so the identity mapping you upload before the move is what decides whether internal sharing survives.

This article follows Microsoft Learn's seven-step guide and focuses on the parts that protect links and permissions. It does not replace the guide. Read the full procedure on Learn before you schedule anything.

## What the migration does and does not do

An administrator in each tenant uses SharePoint Online PowerShell. `Set-SPOCrossTenantRelationship` establishes the trust between the tenants. `Start-SPOCrossTenantUserContentMove` starts the move for each user.

Learn describes these behaviors:

- Content stays inside the Microsoft 365 cloud.
- Each OneDrive is read-only for only a few minutes during the move.
- A redirect is left at the original location, so existing links to files and folders keep working.
- The move is one-and-done. Content is moved, not copied, and incremental or delta passes cannot be performed.

The overview page does not describe version history, Teams content or links that are written inside file contents, such as a URL typed into a Word document. Treat those as open questions and check them in a pilot.

## Limits and blockers to check first

Learn lists these constraints. Check them before you build the batch.

| Item | What Learn states |
|---|---|
| Queue size | Up to 4,000 OneDrive accounts can be scheduled at a time. Create separate batches above that. |
| Size per account | 5 TB of content or 1 million items. The item count includes files, versions, folders and list entries. |
| Path length | No more than 400 characters, including the target OneDrive URL. |
| Licensing | Cross Tenant User Data Migration add-on, a one-time fee per migration. |
| Customer Key | The migration fails if the source tenant uses Service encryption with Microsoft Purview Customer Key. |
| Holds | Accounts with a hold policy are blocked. Remove the hold, migrate, and reapply the hold on the target. |
| Source state | Source OneDrive accounts must be Read/Write. |
| Clouds | GCC, GCC High, DoD and consumer accounts are not supported. |
| Characters | User names or URLs with an apostrophe fail with an invalid character error. |

Two more rules matter for links. The target OneDrive must not exist before the move, because an existing site cannot be overwritten. Learn therefore recommends restricting OneDrive creation in the target tenant, and in the source tenant too if people still use it.

## Step 1: Precreate identities in the target tenant

Learn's precreate step sets the rules for who can open migrated content later:

1. Every user whose OneDrive moves needs a new user identity in the target tenant and the appropriate OneDrive license.
2. Anyone who stays in the source tenant but needs access to migrated resources gets a new guest identity in the target tenant.
3. Precreated users must be added to any security groups or Microsoft 365 groups before the migration starts.
4. If a user or group name already exists in the target, create it under a different name and note it for the mapping.

In a Multi-Geo tenant, set the group's geo with the `MailboxRegion` parameter so the site lands in the intended instance.

## Step 2: Build the identity mapping file

The mapping file is the link protection mechanism. Learn says users and groups in the file keep their permissions on the migrated OneDrive in the target tenant. People who are not in the file do not.

Upload the file on the target tenant with:

```powershell
Add-SPOTenantIdentityMap -IdentityMapPath <identitymap.csv>
```

Learn adds several practical warnings:

- Close the CSV file before you run the command, or it fails because another process is using the file.
- Every upload overwrites the current map, so each upload must contain all users and groups for the whole migration.
- The mapping is one-to-one. If an admin owns several source OneDrive accounts, change ownership to the matching user first, or those files do not migrate.
- Verify mappings before you start. A user's entry can be checked with `Get-SPOTenantIdentityMappingUser -Field SourceUserKey -Value <UPN>`.

## Step 3: Check compatibility, then schedule

Run the compatibility check on the source tenant before any migration instance:

```powershell
Get-SPOCrossTenantCompatibilityStatus -PartnerCrossTenantHostURL <target host URL>
```

Compatible and Warning allow you to proceed. Incompatible does not. Learn suggests waiting 48 hours and contacting support if the status stays Incompatible.

Start the move with `Start-SPOCrossTenantUserContentMove`, giving the source UPN, target UPN and the target cross-tenant host URL. `PreferredMoveBeginDate` and `PreferredMoveEndDate` must be in UTC, and the end date is best effort.

Track progress with `Get-SPOCrossTenantUserContentMoveState`. The states are NotStarted, Scheduled, ReadytoTrigger, InProgress, Success, Rescheduled and Failed. `Stop-SPOCrossTenantUserContentMove` works only while the status is not InProgress, Rescheduled or Success.

## Step 4: Verify links after the move

Learn's post-migration page makes these points:

- Existing shared links for migrated files redirect to the new target location.
- People are redirected only if they still have access to the destination.
- Users must sign in with their new identity and resync files in the OneDrive sync client.
- Redirects stay in place until the source tenant is deprovisioned.

A simple check after the pilot batch:

1. Open an old sharing link as a user who is in the identity mapping. It should land on the new location.
2. Open the same link as a user who is not in the mapping. Expect no access.
3. Open the same link as a guest account you created in the target. It should work if the guest is mapped.
4. Search a few migrated documents for hard-coded old URLs. The pages read do not describe how those behave.

## Step 5: Clean up in the right order

Learn gives two cleanup tasks with a deadline attached to one of them.

First, remove the cross-tenant relationship on both tenants before the source tenant's licenses expire. After expiry the removal command no longer works on the source. The command is `Remove-SPOCrossTenantRelationship` with `-Scenario MnA`, `-PartnerRole` and the partner's cross-tenant host URL. Learn's example repeats the same values for both tenants, so confirm the role value for each side before you run it.

Second, remove redirect sites only after the full migration is complete. `Get-SPOSite -Template RedirectSite#0` lists redirect sites, and `Remove-SPOSite` removes them. If you ever migrate a user back to the source, remove the target redirect first. Site URLs must be unique, and a leftover redirect with the original URL makes the move back fail.

## Common mistakes

- Uploading a partial identity map and overwriting a complete one.
- Letting users create OneDrive in the target before the move.
- Forgetting guest identities for people who remain in the source tenant.
- Removing redirects early to tidy up, then breaking links that people still use.
- Treating the move as repeatable. It is not.

## Related

- [OneDrive](https://www.m365.fm/entity/onedrive/)
- [Microsoft 365](https://www.m365.fm/entity/microsoft-365/)
- [SharePoint migration](https://www.m365.fm/entity/sharepoint-migration/)
- [PowerShell](https://www.m365.fm/entity/powershell/)

## Sources

- [Microsoft Learn: Cross-tenant OneDrive migration overview](https://learn.microsoft.com/en-us/microsoft-365/enterprise/cross-tenant-onedrive-migration)
- [Microsoft Learn: Step 4, precreate users and groups](https://learn.microsoft.com/en-us/microsoft-365/enterprise/cross-tenant-onedrive-migration-step4)
- [Microsoft Learn: Step 5, prepare the identity mapping](https://learn.microsoft.com/en-us/microsoft-365/enterprise/cross-tenant-onedrive-migration-step5)
- [Microsoft Learn: Step 6, start a cross-tenant OneDrive migration](https://learn.microsoft.com/en-us/microsoft-365/enterprise/cross-tenant-onedrive-migration-step6)
- [Microsoft Learn: Step 7, post-migration steps](https://learn.microsoft.com/en-us/microsoft-365/migration/cross-tenant-onedrive-migration-step7)
