---
title: "Entra Connect Created a Duplicate User or Skipped an Attribute: Soft Match, Hard Match and Duplicate Values"
summary: "A new on-premises user created a second cloud account with an onmicrosoft.com UPN, or the mail address never updated. Learn how matching works, how to read the errors and how to relink safely."
status: approved
publish: false
author: mirko-p
date: 2026-11-13
topics: [entra-connect, entra-id, entra-connect-health, microsoft-graph-powershell]
keypoints:
  - "Entra tries a hard match on sourceAnchor against ImmutableId first, then a soft match on userPrincipalName or the primary SMTP address, and otherwise creates a new object."
  - "If the on-premises UPN suffix is not verified in the tenant, Entra builds a new UPN from the mailNickName and the initial onmicrosoft.com domain."
  - "Duplicate attribute resiliency quarantines a conflicting proxyAddresses or UPN value instead of failing, so sync can look healthy while one value is missing."
  - "Since July 1, 2026, Learn says hard match can be blocked for cloud accounts that already have onPremisesObjectIdentifier set or hold or are eligible for a privileged role."
faq:
  - q: "What is the difference between soft match and hard match?"
    a: "Hard match compares the on-premises sourceAnchor, stored in Entra ID as ImmutableId, with existing cloud objects. Soft match compares userPrincipalName or the primary SMTP address of a new object. Microsoft Learn says Entra tries hard match first, then soft match, and creates a new object if both fail."
  - q: "Why did Entra Connect create a user with an onmicrosoft.com UPN?"
    a: "Learn says that when the on-premises UPN suffix is not verified in the tenant, Entra calculates a new UPN from the mailNickName attribute and the initial domain. This is one documented way to end up with an onmicrosoft.com UPN. In the community thread I used, the cause was not stated, so check your suffix first."
  - q: "Soft match only works for new objects. What if I change an existing object?"
    a: "Learn says soft match is evaluated only for new objects coming from on-premises AD. If you change an existing object so that it matches, you get an error instead of a match."
  - q: "Where do I see duplicate attribute errors?"
    a: "Learn points to the Synchronization Errors report in Microsoft Entra Connect Health, which refreshes about every 30 minutes. For quarantined values it shows PowerShell using Connect-Entra and Get-EntraDirectoryObjectOnPremisesProvisioningError."
---

Two situations bring people to Entra Connect matching rules. In the first, a new on-premises user appears in the cloud twice: the account you wanted, plus a new synced account with a `.onmicrosoft.com` sign-in name. In the second, the sync runs without errors, but a user's `mail` or `proxyAddresses` in Entra ID still shows the old address.

Both came up in Microsoft Q&A threads, one from January 2025 and one from October 2025. In each, the person who asked reported what solved it. I checked the technical background against current Microsoft Learn pages. This is a troubleshooting guide, not an official Microsoft procedure. Test every change on one user first.

## How Entra matches objects

Learn describes this order for a new object arriving from AD:

1. **Hard match.** Entra compares the `sourceAnchor` with the `ImmutableId` of existing cloud objects. The default `sourceAnchor` is the Base64 form of `mS-Ds-ConsistencyGUID`, or of `ObjectGUID`, depending on the configuration.
2. **Soft match.** If there is no hard match, Entra compares `userPrincipalName` or the primary `SMTP:` value of `proxyAddresses`.
3. **New object.** If neither matches, Entra creates a new object.

Learn adds two limits. Soft match is evaluated only for new objects. And on a soft match, Entra takes over the cloud object and overwrites every attribute that has a value on-premises. Cloud-only attributes can be lost, and with password hash sync the cloud password hash is replaced by the on-premises one.

## Scenario 1: a second user with an onmicrosoft.com UPN

**What the thread reported.** An administrator created a user in on-premises AD. Entra Connect created a second Entra user with a `.onmicrosoft.com` UPN and the on-premises sync flag. The intended cloud user had no sync flag. The accepted reply described both soft match and hard match. The person who asked later wrote that the hard-match approach solved the problem.

### Why the match may have failed

The thread did not say why. Learn gives one documented reason for the onmicrosoft.com name: if the on-premises UPN suffix is not verified in the tenant, Entra calculates a new UPN from the `MailNickName` and the initial domain. That also means the UPN cannot match the cloud user. This is a lead, not a diagnosis. Compare these on both accounts:

- UPN suffix and whether it is a verified domain in your tenant
- primary SMTP address (the `SMTP:` entry in `proxyAddresses`)
- whether the cloud user already shows an on-premises link

### Option A: make soft match work

The thread's first workaround was to make the on-premises UPN and proxy addresses match the cloud user, delete the duplicate and sync again. Learn says soft match is evaluated only for new objects, and it does not cover whether an object that is already linked is evaluated again after the duplicate is deleted. The person who asked used Option B in the end, so treat Option A as unproven.

### Option B: hard match

1. Find out which attribute your Entra Connect uses as `sourceAnchor`. Learn names `mS-Ds-ConsistencyGUID` or `ObjectGUID`.
2. Convert the on-premises GUID to Base64. The thread's reply used this pattern:

```powershell
$guid = (Get-ADUser <sam-account-name>).ObjectGuid
[System.Convert]::ToBase64String($guid.ToByteArray())
```

3. Set the result as the cloud user's `ImmutableId`. The thread's reply used `Set-MsolUser`, which is from the older MSOnline module. Current Learn pages use Microsoft Graph PowerShell. The `Update-MgUser` page documents the `-OnPremisesImmutableId` parameter and says that only specific privileged administrator roles can update it. Check the parameter notes there before you run it.
4. Run a delta sync:

```powershell
Start-ADSyncSyncCycle -PolicyType Delta
```

5. Confirm the intended cloud user now shows the sync flag, then deal with the leftover duplicate.

Learn does not describe the cleanup order for this exact case. The thread's reply set the ImmutableId first, synced, checked and removed the duplicate afterwards. Before deleting anything, check licences and mailbox data on the duplicate.

Learn documents a related error, `InvalidSoftMatch`. It occurs when hard match finds nothing, soft match finds a cloud object, but that object has a different `ImmutableId` than the incoming `sourceAnchor`. This suggests the cloud object was synced from another on-premises object. Learn's fix is the same as for `AttributeValueMustBeUnique`: identify the duplicated value and the objects involved, decide which object keeps it, and remove the value from the other object in the directory where it is sourced.

### New protections since July 2026

Learn says that from July 1, 2026, a hard match can be blocked when the target cloud account:

- already has `onPremisesObjectIdentifier` set,
- has a privileged Microsoft Entra role assigned, or
- is eligible for a privileged Microsoft Entra role.

Cloud-managed accounts with writeback enabled are excluded. Learn says these protections do not disable hard match for safe targets. It also describes tenant-wide flags, `BlockSoftMatchEnabled` and `BlockCloudObjectTakeoverThroughHardMatchEnabled`, and a temporary bypass, `AllowOnPremUpdateOfOnPremisesObjectIdentifierEnabled`, which is off by default. Learn warns that the bypass reduces protection and should be switched off afterwards. By default, Entra also does not soft match on-premises users to cloud users that hold an admin role, and Microsoft strongly advises against syncing on-premises accounts with preexisting admin accounts.

So if the hard match from the 2025 thread fails today, one of these protections may be the reason.

## Scenario 2: sync is quiet, but the address never changes

**What the thread reported.** Contractors needed their own external email addresses instead of the company address. The on-premises accounts showed the right addresses in ADUC, but `mail` and `proxyAddresses` in Entra still held the company address. The asker found the cause alone: cloud-only guest accounts, created for SharePoint access, used the same external addresses as the new on-premises accounts. The asker wrote that this was the conflict.

Note that the accepted reply in that thread was generic, and the diagnosis came from the person who asked.

### What Learn adds

- Entra ID needs unique values for `mail`, `proxyAddresses`, `signInName` and `userPrincipalName`. Adding or updating a value that another object already holds causes `AttributeValueMustBeUnique`.
- Duplicate attribute resiliency is the default behavior and cannot be turned off. It handles only UPN and SMTP `proxyAddresses` values: Entra quarantines a duplicate one instead of failing the export. It does not fix the data, and Learn's page does not list `mail` among the attributes it covers.
- For a duplicate UPN, a placeholder is assigned, in the form `<OriginalPrefix>+<4DigitNumber>@<InitialTenantDomain>.onmicrosoft.com`. A quarantined SMTP proxy address is held back while the object is still created or updated.
- Because the export succeeds, the sync client logs no error and does not retry.

That matches what the thread described: no visible failure, one value missing. The accepted reply mentioned duplicate attribute resiliency only in general terms, and nobody confirmed that it applied, so this is a plausible explanation, not a confirmed one.

### How to find the conflicts

1. In the Microsoft Entra admin center, open the Synchronization Errors report in Microsoft Entra Connect Health. Learn says it refreshes about every 30 minutes and shows errors from the latest sync attempt.
2. For quarantined values, Learn shows:

```powershell
Connect-Entra
Get-EntraDirectoryObjectOnPremisesProvisioningError | Where-Object PropertyCausingError -eq 'ProxyAddresses'
```

3. Learn's fix is the same for `AttributeValueMustBeUnique` and `InvalidSoftMatch`: identify the duplicated value and the objects involved, decide which object keeps it, remove it from the other object **in the directory where that object is sourced**, then let Entra Connect sync. In some cases you may need to delete one of the conflicting objects.
4. A background job removes quarantined attributes once the conflict is gone. Learn says it runs hourly.

In the guest case, that means changing or removing the address on the cloud-only guest, then waiting for the next sync.

## Verify

1. Look up the user in Entra ID and compare `mail`, `proxyAddresses` and UPN with AD.
2. Run `Start-ADSyncSyncCycle -PolicyType Delta`, then check again.
3. Check that the error report no longer lists the object.

For bulk changes, Learn's staging server article describes a way to preview pending exports with `csexport` and `CSExportAnalyzer` before you switch to active mode.

## Limits

- The threads do not prove which step fixed your case.
- The hard-match commands in the thread use an older module. Use current Learn guidance.
- Learn does not document the cleanup order after a wrongly created duplicate. Test with one user.

## Related

- [Microsoft Entra Connect](https://www.m365.fm/entity/entra-connect/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Entra Connect Health](https://www.m365.fm/entity/entra-connect-health/)
- [Microsoft Graph PowerShell](https://www.m365.fm/entity/microsoft-graph-powershell/)

## Sources

- [Microsoft Learn: Soft match vs hard match, Entra Connect for an existing tenant](https://learn.microsoft.com/en-us/entra/identity/hybrid/connect/how-to-connect-install-existing-tenant)
- [Microsoft Learn: Troubleshoot errors during synchronization](https://learn.microsoft.com/en-us/entra/identity/hybrid/connect/tshoot-connect-sync-errors)
- [Microsoft Learn: Identity synchronization and duplicate attribute resiliency](https://learn.microsoft.com/en-us/entra/identity/hybrid/connect/how-to-connect-syncservice-duplicate-attribute-resiliency)
- [Microsoft Learn: Plan for UserPrincipalName and Alternate login ID](https://learn.microsoft.com/en-us/entra/identity/hybrid/connect/plan-connect-userprincipalname)
- [Microsoft Learn: Staging server](https://learn.microsoft.com/en-us/entra/identity/hybrid/connect/how-to-connect-sync-staging-server)
- [Microsoft Learn: Update-MgUser](https://learn.microsoft.com/en-us/powershell/module/microsoft.graph.users/update-mguser?view=graph-powershell-1.0)
- [Microsoft Q&A: Entra Connect Sync created a second user with an onmicrosoft.com domain (October 2025)](https://learn.microsoft.com/en-us/answers/questions/5595866/entra-connect-sync-has-created-a-second-user-with)
- [Microsoft Q&A: AD Connect sync, mail and proxyAddresses not updated (January 2025)](https://learn.microsoft.com/en-us/answers/questions/2151900/ad-connect-sync)
