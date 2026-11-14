---
title: "SMTP Domain Cutover in a Tenant-to-Tenant Migration: What Microsoft Documents"
summary: "How a custom SMTP domain moves between Microsoft 365 tenants: remove it from the source, verify it in the target, switch MX, and why Microsoft's cutover guidance accepts queued mail rather than promising zero downtime."
status: review
publish: false
author: mirko-p
date: 2026-12-15
topics: [tenant-to-tenant-migration, exchange-online, microsoft-365]
keypoints:
  - "A domain belongs to one tenant only. It must be removed from the source before the target can finish verification."
  - "Microsoft's cutover guide points MX to an unreachable host during migration, so inbound mail queues at sending servers for about 24 hours."
  - "Cross-tenant mailbox migration moves mailbox data only. The old primary SMTP address does not follow the user to the target."
  - "Lower the MX TTL early, add the TXT record to the target three days ahead, and wait up to an hour after removing the domain."
  - "Recreate transport rules, connectors and allow and block lists in the target tenant yourself."
faq:
  - q: "Can a domain be active in two tenants at the same time?"
    a: "No. Microsoft Learn says domains are associated with one Microsoft Entra ID or Exchange Online tenant only. Verification in the target fails while the domain is still in use in the source, so you remove it from the source first."
  - q: "Does Microsoft document a zero-downtime domain cutover?"
    a: "The pages I read do not. The cutover guide changes the MX record to an unreachable domain during migration, and sending servers queue and retry for about 24 hours, with some senders returning an NDR. An MX backup service can queue mail longer."
  - q: "What do I do before removing the domain from the source tenant?"
    a: "Learn lists these steps in order: move any SharePoint public website to the initial domain, remove Lync licenses, reset default addresses for mailboxes, groups, rooms and resources to the onmicrosoft.com address, remove secondary proxy addresses on the old domain, set the default domain to the onmicrosoft.com routing domain, and find blocking objects with Get-MsolUser -DomainName."
  - q: "Why must target MailUser objects not carry the source domain?"
    a: "The cross-tenant migration page says every SMTP proxy on the target must belong to the target tenant. A non-owned proxy prevents converting the MailUser into a mailbox, and applying an Exchange license removes proxies the tenant has not verified."
  - q: "How long can DNS verification take?"
    a: "The older tenant-to-tenant guide says to add the TXT record in the target three days before migration so DNS can propagate, which can take up to 72 hours. Final verification happens after you remove the domain from the source, and it says you may have to wait one hour."
---

Microsoft's documentation does not offer a zero-downtime custom domain move between two tenants. It documents a controlled cutover: prepare the target, remove the domain from the source, verify and switch MX, and accept that inbound mail queues for a short window. What you can do is shorten that window and avoid the failures that make it longer. Treat any "zero downtime" promise as a design you have tested yourself.

This article combines two Learn pages: the older guide for migrating between Microsoft 365 organizations and the page on native cross-tenant mailbox migration.

## The rule that shapes everything

Domains are associated with one tenant only. After a mailbox moves, the former primary SMTP address is not associated with the user in the target tenant, because only the tenant that owns the domain can use it. The cross-tenant page says the feature migrates mailbox data and nothing else.

Two ways to deal with the domain:

1. **Keep different domains** in each tenant during coexistence, and move the custom domain only at the end.
2. **Cut the domain over** with the process below.

## Preparation weeks before

- **Verify the domain in the target early.** Add the TXT record three days before migration. Verification fails while the source still uses the domain, but it lets DNS propagate, which can take up to 72 hours.
- **Lower the MX TTL.** Set it to a short value such as 5 minutes. If the minimum is higher, change the MX record that many hours ahead. Check with nslookup or MxToolbox.
- **Disable directory sync in the source tenant** at least 24 hours before, since it can take 24 hours or more.
- **Increase target licenses** and create admin accounts in both tenants.
- **Recreate non-synced objects** such as rooms, resources and groups in the target.
- **Build the mapping file.** Use the `onmicrosoft.com` initial domain for source accounts, because the custom domain will keep changing.

For native cross-tenant mailbox migration, also prepare target MailUser objects with matching ExchangeGUID (and ArchiveGUID if needed), the source LegacyExchangeDN as an `x500:` address, and an ExternalEmailAddress that points to the source `onmicrosoft.com` address. Do not license the target before ExchangeGUID and proxies are set, or a new empty mailbox gets provisioned.

## Clear the source tenant

Learn's order for removing the domain:

1. Point any SharePoint public website back to the initial domain.
2. Remove Lync licenses so the SIP address tied to the domain goes away.
3. Reset default email addresses on mailboxes, distribution lists, rooms and resources to the `onmicrosoft.com` address.
4. Remove secondary proxy addresses still using the old domain.
5. Set the default domain to the `onmicrosoft.com` routing domain.
6. Find remaining blockers with `Get-MsolUser -DomainName`. The page's scripts use MSOnline cmdlets, which Microsoft has retired, so look for Microsoft Graph PowerShell equivalents.

## Cutover sequence

On the day:

1. **Stop inbound mail.** Change the primary MX to an unreachable host such as `unreachable.example.com`. Sending servers queue and retry for about 24 hours, and some may return an NDR. An MX backup service can hold mail for days or weeks and release it later.
2. **Finish verification in the target** once the domain is gone from the source. You may have to wait one hour.
3. **Prepare the target.** Optionally set an Autodiscover CNAME, configure AD FS for the new domain if used, assign licenses, and set the domain as primary address on the new users.
4. **Point MX to the target.** After the TTL expires, mail flows into the new mailboxes. Release queued mail from a backup service if you use one.
5. **Verify mail flow** in both directions.
6. **Recreate transport configuration:** mail flow rules, connectors, and blocklists and allowlists.
7. **Migrate data** in passes. For more than 500 users, Learn suggests contacts, calendars and a week of mail first, then older mail. For large migrations it recommends a Microsoft solution provider.
8. **Post-migration:** clear the Outlook Auto-Complete cache or add the legacy DN as an x500 proxy to avoid reply failures.

## Where mail can still go wrong

- **Invalid proxies on the target.** A source-tenant address on the target user raises `NotAcceptedDomainException` during a move. Remove the address and resume the batch.
- **5.1.1 NDR on replies.** Missing x500 addresses on the target cause this for replies to older mail.
- **Free/busy.** Lookups for mail users must target the mailbox location. Update targetAddress on on-premises objects in both tenants.
- **Holds.** Mailboxes on any hold are not migrated by the cross-tenant feature.
- **Source mailbox gone.** After the move the source mailbox becomes a MailUser and is not accessible or discoverable in the source. Export first if you need a copy.
- **Clients.** Outlook needs a rebuilt profile with the new UPN and primary SMTP address.

## Shorten the gap

Choices that reduce risk, all from the pages above: short TTL, early TXT record, a tested script for removing proxies, a backup MX service, and a rehearsal with a test domain or a pilot user. The documented cutover still has a window, so schedule it outside business hours.

## Extra prerequisites for the native cross-tenant feature

If you use the native feature instead of a third-party tool, Learn lists these prerequisites:

- At least one mail-enabled security group in the source tenant to scope which mailboxes can move
- The partner tenant ID as a GUID for the organization relationship, not the domain name
- A **Cross Tenant User Data Migration** license for every user moving to the target, with no exceptions
- Unique domain names in the two tenants while coexisting
- No cross-cloud moves, for example from worldwide to a government cloud

After migration, the source mailbox becomes a MailUser with a targetAddress for routing, and the target MailUser becomes a mailbox. Run `Remove-MigrationEndpoint` and `Remove-OrganizationRelationship` for cleanup. Learn suggests assigning Exchange licenses during the 30-day grace period.

## Related

- [Tenant-to-tenant migration](https://www.m365.fm/entity/tenant-to-tenant-migration/)
- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Microsoft 365](https://www.m365.fm/entity/microsoft-365/)

## Sources

- [How to migrate mailboxes from one Microsoft 365 organization to another](https://learn.microsoft.com/en-us/Exchange/mailbox-migration/migrate-mailboxes-across-tenants)
- [Cross-tenant mailbox migration](https://learn.microsoft.com/en-us/microsoft-365/enterprise/cross-tenant-mailbox-migration)
