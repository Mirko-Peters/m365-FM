---
title: "How to Turn On the Unified Audit Log in Microsoft Purview"
summary: "Check whether auditing is on with Get-AdminAuditLogConfig, turn it on in the Microsoft Purview portal or with Set-AdminAuditLogConfig, what to expect (up to 60 minutes, several hours until events are searchable), which licenses do not have it on by default, and what happens when it is turned off."
status: review
publish: false
author: mirko-p
date: 2027-01-25
topics: [microsoft-purview-audit, audit-logs, exchange-online-powershell]
keypoints:
  - "Audit logging is on by default for Microsoft 365 organizations, but for a new organization you should verify the status."
  - "It is not on by default for SMB licenses such as Business Basic, Standard and Premium, or for unmanaged tenants with enterprise trials. There you must turn it on manually."
  - "Verify with Get-AdminAuditLogConfig piped to Format-List UnifiedAuditLogIngestionEnabled in Exchange Online PowerShell. True means on."
  - "Turn it on with the Start recording banner on the Audit page, or with Set-AdminAuditLogConfig -UnifiedAuditLogIngestionEnabled true. It can take up to 60 minutes to take effect."
  - "Turning auditing off means searches return no results and the Management Activity API and Microsoft Sentinel cannot access audit data."
faq:
  - q: "Is the unified audit log on by default?"
    a: "Microsoft Learn says audit logging is on by default for Microsoft 365 organizations, but you should verify the status when you set up a new one. It is not enabled by default for Small and Medium Business licenses, including Microsoft 365 Business Basic, Business Standard and Business Premium, or for unmanaged tenants that use free trials of enterprise licenses. In those cases you must enable it manually."
  - q: "How do I check the status?"
    a: "In Exchange Online PowerShell run Get-AdminAuditLogConfig piped to Format-List UnifiedAuditLogIngestionEnabled. True means auditing is on and False means it is not. Learn warns to run it in Exchange Online PowerShell, because in Security and Compliance PowerShell the property is always False, even when auditing is on."
  - q: "What permission do I need?"
    a: "The Audit Logs role in Exchange Online. By default the Compliance Management and Organization Management role groups on the Permissions page in the Exchange admin center have it. The page says a global admin can turn auditing off."
  - q: "How long until I can search?"
    a: "Enabling can take up to 60 minutes to take effect, and Learn says audit events might take several hours after you turn auditing on before they become searchable in the audit log."
  - q: "What happens if I turn auditing off?"
    a: "Searches of the audit log in Microsoft Purview return no results, and Search-UnifiedAuditLog in Exchange Online PowerShell returns no results. You also cannot use the Office 365 Management Activity API or Microsoft Sentinel to access audit data for your organization."
---

The unified audit log records user and admin activity across Microsoft 365, and you cannot search what was never recorded. So the first task with auditing is to check that it is on. The Microsoft Learn page on turning auditing on or off covers the check, the steps in the Microsoft Purview portal and in PowerShell, and the effects of turning it off. This article follows it.

## What to know first

- Audit logging is on by default for Microsoft 365 organizations. For a new organization, verify the status anyway.
- When auditing is on, the log records user and admin activity and automatically retains it for 180 days. Retention starts when the data is added to the log and follows audit log retention policies and the license assigned to users. Changes to licensing or retention policies also change the expiration date of audit data.
- Auditing is **not** enabled by default for Small and Medium Business licenses, including Microsoft 365 Business Basic, Business Standard and Business Premium. It is also off by default for unmanaged tenants that use free trials of enterprise licenses. In both cases you must enable it manually.

## Permissions

You need the **Audit Logs** role in Exchange Online. By default the **Compliance Management** and **Organization Management** role groups on the **Permissions** page of the Exchange admin center have it.

## Step 1: Verify the status

In Exchange Online PowerShell run:

```powershell
Get-AdminAuditLogConfig | Format-List UnifiedAuditLogIngestionEnabled
```

`True` means auditing is on. `False` means it is not.

Learn warns that you must run this in Exchange Online PowerShell. The cmdlet also exists in Security & Compliance PowerShell, but there the property is always `False`, even when auditing is on.

## Step 2: Turn auditing on

You can use the portal or PowerShell. Audit events might take several hours after you turn on auditing before they can be searched.

### In the Microsoft Purview portal

1. Sign in to the Microsoft Purview portal.
2. Select the **Audit** solution card. If it is not shown, select **View all solutions** and then **Audit** in the **Core** section.
3. If auditing is not on, a banner prompts you to start recording user and admin activity.
4. Select the **Start recording user and admin activity** banner.

Enabling can take up to 60 minutes to take effect.

### With Exchange Online PowerShell

1. Connect to Exchange Online PowerShell.
2. Run:

   ```powershell
   Set-AdminAuditLogConfig -UnifiedAuditLogIngestionEnabled $true
   ```

A message says enabling auditing might take up to 60 minutes to take effect.

## Step 3: Check again

After a while, run the command from step 1 again. The value should be `True`. In the portal, the banner on the **Audit** page should no longer appear. This check is my addition. The page describes the same two checks for turning auditing off, in reverse.

## Turn auditing off

Some organizations do not want to record and keep audit data. A global admin can turn auditing off, using Exchange Online PowerShell:

```powershell
Set-AdminAuditLogConfig -UnifiedAuditLogIngestionEnabled $false
```

After a while verify with `Get-AdminAuditLogConfig | FL UnifiedAuditLogIngestionEnabled`, which should return `False`, or open the **Audit** page in the Purview portal, where the banner asks you to start recording.

Learn's warning about the effects:

- You cannot use the Office 365 Management Activity API or Microsoft Sentinel to access audit data for your organization.
- Searches of the audit log in Microsoft Purview return no results.
- `Search-UnifiedAuditLog` in Exchange Online PowerShell returns no results.

## Changes to the status are audited

Your organization audits changes to the auditing status. Records are logged when auditing is turned on or off. To find them, run this in Exchange Online PowerShell:

```powershell
Search-UnifiedAuditLog -Operations Set-AdminAuditLogConfig
```

The records show when the status changed, which admin changed it, and the IP address of the computer used. In the `AuditData` property, look at the result value of `UnifiedAuditLogIngestionEnabled`, which shows whether auditing was turned on or off, in the portal or by the cmdlet.

## Quick reference

| Task | How |
| --- | --- |
| Check status | `Get-AdminAuditLogConfig \| Format-List UnifiedAuditLogIngestionEnabled` in Exchange Online PowerShell |
| Turn on (portal) | Purview portal, Audit, Start recording user and admin activity banner |
| Turn on (PowerShell) | `Set-AdminAuditLogConfig -UnifiedAuditLogIngestionEnabled $true` |
| Turn off | `Set-AdminAuditLogConfig -UnifiedAuditLogIngestionEnabled $false` |
| Find who changed it | `Search-UnifiedAuditLog -Operations Set-AdminAuditLogConfig` |

## Good practice (my advice)

This is my suggestion, not guidance from the page:

1. Add the status check to your tenant setup checklist, especially for SMB tenants and trials, since the page names them as off by default.
2. Do the check before an incident. Turning auditing on afterward does not give you the events from before, and the page says events take hours to become searchable.
3. Limit who can turn auditing off, and consider an alert for the Set-AdminAuditLogConfig operation, since the change itself is audited.
4. Before turning it off for any reason, list the tools that depend on the log, such as Sentinel connectors and reports, because Learn says they lose access.
5. Check the retention policies and licenses that apply, since the 180-day default depends on them.

## Related

- [Microsoft Purview Audit](https://www.m365.fm/entity/microsoft-purview-audit/)
- [Audit logs](https://www.m365.fm/entity/audit-logs/)
- [Exchange Online PowerShell](https://www.m365.fm/entity/exchange-online-powershell/)

## Sources

- [Turn auditing on or off (Microsoft Learn)](https://learn.microsoft.com/purview/audit-log-enable-disable)
