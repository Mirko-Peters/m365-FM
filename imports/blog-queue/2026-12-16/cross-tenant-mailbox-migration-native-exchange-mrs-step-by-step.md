---
title: "Cross-Tenant Mailbox Migration With Native Exchange MRS, Step by Step"
summary: "Move Exchange Online mailboxes between Microsoft 365 tenants without third-party tools: licenses, app registration, endpoint, organization relationships, MailUser attributes, batches and known limits."
status: review
publish: false
author: mirko-p
date: 2026-12-16
topics: [tenant-to-tenant-migration, exchange-online-powershell, exchange-online]
keypoints:
  - "Microsoft supports mailbox moves between tenants natively. You start the move from the target tenant with New-MigrationBatch."
  - "Every moving user needs a Cross-Tenant User Data Migration license. Without it the move fails and Microsoft states it makes no exceptions."
  - "The target MailUser must carry the source ExchangeGUID, ArchiveGUID if any, and all x500 addresses. License it only after these are set."
  - "Mailboxes on any hold are not migrated. Keep batches at 2,000 mailboxes or fewer."
  - "Users must rebuild their Outlook profile after the move."
faq:
  - q: "Do I need third-party tools to move mailboxes between tenants?"
    a: "No. Microsoft Learn documents a native process that uses Exchange Online PowerShell and the Mailbox Replication Service. It moves email, contacts, calendar, tasks and notes. It does not move Microsoft 365 Groups, Teams chats or mailbox signatures."
  - q: "Where do I start the move, in the source or the target tenant?"
    a: "In the target tenant. Learn says moves are started as migration batches with New-MigrationBatch, which needs the Move Mailboxes role. The source tenant only publishes a scope group and consents to the migration app."
  - q: "Why does a move fail with a license error?"
    a: "Learn shows CrossTenantMigrationWithoutLicensePermanentException when neither the source nor the target recipient has a Cross-Tenant User Data Migration license. The page says to obtain the licenses before you start."
  - q: "What happens to the source mailbox after the move?"
    a: "Learn says the source mailbox is deleted after a successful move and is not available or discoverable in the source tenant. It is converted to a MailUser whose target address points to the new tenant, which supports mail routing during coexistence."
  - q: "How big can a batch be?"
    a: "Learn recommends no more than 2,000 mailboxes per batch and suggests submitting batches two weeks before cutover. For more than 50,000 mailboxes it tells you to contact your Microsoft account team or open a support request."
---

Microsoft Exchange Online can move mailboxes from one Microsoft 365 tenant to another without a third-party migration tool. The process uses Exchange Online PowerShell and the Mailbox Replication Service (MRS). You prepare both tenants, create a matching MailUser in the target for each person, and start a migration batch from the target. This article walks through the order of work, as described on Microsoft Learn, and lists the limits you should know before you plan a date.

## What the native process covers

- It is meant for mergers and divestitures between Microsoft 365 tenants.
- It moves user-visible content: email, contacts, calendar, tasks and notes.
- After a successful move the source mailbox is deleted. It is not available or discoverable in the source tenant afterwards.
- Hybrid, cloud-only and mixed tenants are supported.

This mailbox process does not move SharePoint sites, Teams chat folder content or Microsoft 365 Groups. Learn says the same license also covers OneDrive migration, but OneDrive has its own cross-tenant process that this article does not describe. Mailboxes on any type of hold are not migrated, and the move is blocked.

## Step 1: Buy and plan the licenses

Each migrating user needs a **Cross-Tenant User Data Migration** license, a one-time per-user fee. It can sit on the source or the target user object. Learn warns that migrations fail without it. The error looks like `CrossTenantMigrationWithoutLicensePermanentException`. Users in both organizations also need appropriate Exchange Online subscriptions.

## Step 2: Check roles and scope

- **Organization Administrator** is needed once to set `-MailboxMoveCapability` on the organization relationship.
- **Move Mailboxes** role is needed to start moves. You can delegate it.
- In the source tenant, create at least one mail-enabled security group that defines which mailboxes may move. Use several groups if you migrate more than 10,000 users.
- Get the partner's tenant ID as a GUID, not a domain name. Source and target domain names must be different.

## Step 3: Prepare the target tenant

1. In the Microsoft Entra admin center, create an app registration. Choose **Accounts in any organizational directory (Any Microsoft Entra directory - Multi-tenant)** and use `https://office.com` as a Web redirect URI.
2. Copy the Application (client) ID.
3. Under **API permissions**, add **Office 365 Exchange Online** > **Application permissions** > **Mailbox.Migration**. `User.Read` is not required.
4. Create a client secret and copy it immediately. It is shown once. Learn says to keep it in a password safe.
5. Grant admin consent in the target tenant.
6. Build the consent URL for the source administrator: `https://login.microsoftonline.com/<source>.onmicrosoft.com/adminconsent?client_id=<app id>&redirect_uri=https://office.com`.
7. In Exchange Online PowerShell, create the migration endpoint with `New-MigrationEndpoint -RemoteServer outlook.office.com -RemoteTenant <source>.onmicrosoft.com -ExchangeRemoteMove:$true -ApplicationId <app id> -Credentials <credential>`. It fails with an authentication error if the partner has not accepted the consent URL yet.
8. Create or update the organization relationship with `-MailboxMoveEnabled:$true -MailboxMoveCapability Inbound -DomainNames <source tenant ID>`.

## Step 4: Prepare the source tenant

1. The source administrator opens the consent URL and accepts the application.
2. In Exchange Online PowerShell, create the scope group if it does not exist.
3. Create or update the organization relationship with `-MailboxMoveCapability RemoteOutbound`, the target tenant ID in `-DomainNames`, the app ID in `-OAuthApplicationId` and the scope group in `-MailboxMovePublishedScopes`.

## Step 5: Create the target MailUsers

This step causes most failures. For each mailbox, the target needs a MailUser with these attributes:

| Attribute | Rule |
|---|---|
| ExchangeGUID | Must match the source mailbox. The move does not start without it |
| ArchiveGUID | Must match, only if the source mailbox has an archive |
| x500 proxy addresses | Add the source LegacyExchangeDN as `x500:` and copy all x500 addresses from the source. Without them, replies to old mail can end in a 5.1.1 NDR |
| UserPrincipalName | The new identity in the target |
| Primary SMTP address | The new company domain |
| ExternalEmailAddress | Points to the source mailbox, for example the `onmicrosoft.com` address. Set the primary SMTP address at the same time |

You cannot add source SMTP proxy addresses with domains that the target does not own. A proxy from a domain the target tenant does not own blocks the move, and applying an Exchange license scrubs non-verified SMTP proxy addresses.

License target users only after the ExchangeGUID and proxy addresses are in place. Licensing earlier creates a new mailbox instead of converting the MailUser. Learn suggests waiting until the migration finishes and using the 30-day grace period for licensing. If a target object was licensed before, clearing it with `Set-User -PermanentlyClearPreviousMailboxInfo` is irreversible.

## Step 6: Validate

Run `Test-MigrationServerAvailability -Endpoint <name> -TestMailbox <primary SMTP of a target MailUser>` from the target. Learn also points to a validation script at `https://aka.ms/crosstenantmailboxmigrationvalidationscript` that checks both tenants.

## Step 7: Start the batch

Run `New-MigrationBatch` in the target tenant with the migration endpoint as `-SourceEndpoint`, a CSV with an `EmailAddress` column and `-TargetDeliveryDomain` set to the target onmicrosoft domain. The CSV uses target addresses, not source addresses. You can also use the Exchange admin center. To see only cross-tenant moves, run `Get-MoveRequest -Flags "CrossTenant"`.

Learn recommends batches of at most 2,000 mailboxes and says to submit them about two weeks before cutover, because there is no end-user impact during the sync.

## Step 8: After the move

- The target MailUser becomes a mailbox and the source mailbox becomes a MailUser without manual action.
- Update the target addresses of on-premises MailUsers in both organizations. Mail routing can follow referrals, but free/busy lookups must target the mailbox location.
- Run `Remove-MigrationEndpoint` and `Remove-OrganizationRelationship` when you are done.
- Restamp Send on Behalf with `Set-Mailbox -GrantSendOnBehalfTo`, because it does not move.
- Plan for Outlook. Users must rebuild their profile with the new UPN and primary SMTP address and let the OST resync.
- Mailbox permissions move only if the principal and the delegate move in the same batch.

## Errors you may meet

Learn lists causes and fixes in a table. For example, `MailboxNotInCrossTenantMigrationScopeException` means the mailbox is not in the source scope group. `MissingExchangeGuidException` means the target MailUser lacks the right ExchangeGUID. `NotAcceptedDomainException` means a proxy address on the target user is invalid. Several quota exceptions mean the source mailbox is larger than the target allows, and the advice is to reduce size or enable archives.

## Known limits

Mailbox signatures, client-side outbox items and Teams chat folder content are not migrated. Teams meeting URLs are not updated. Sensitivity labels are not exported. Users with auto-expanding archives can move (Learn supports up to 12 auxiliary archive mailboxes), but if the source mailbox expands during the migration, a new auxiliary archive appears only in the source and the move fails. In that case remove the user from the batch and resubmit. Cross-cloud moves are not supported. Source eDiscovery against the migrated mailbox no longer works.

## Related

- [Tenant-to-tenant migration](https://www.m365.fm/entity/tenant-to-tenant-migration/)
- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Exchange Online PowerShell](https://www.m365.fm/entity/exchange-online-powershell/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)

## Sources

- [Cross-tenant mailbox migration (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-365/migration/cross-tenant-mailbox-migration)
