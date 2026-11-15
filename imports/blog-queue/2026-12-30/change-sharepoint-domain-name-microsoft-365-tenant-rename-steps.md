---
title: "Change the SharePoint Domain Name of a Microsoft 365 Tenant: Limits, Steps and Impact"
summary: "Rename your SharePoint domain using Microsoft Learn: eligibility limits, pre-checks, the Start-SPOTenantRename schedule and monitoring commands, Advanced Tenant Rename prioritization, user impact by severity and the post-rename review."
status: review
publish: false
author: mirko-p
date: 2026-12-30
topics: [sharepoint]
keypoints:
  - "A rename changes the domain part of SharePoint and OneDrive URLs, for example contoso.sharepoint.com to fabrikam.sharepoint.com. Email addresses are not affected."
  - "Standard rename covers tenants with up to 10,000 sites, Advanced Tenant Rename with SharePoint Advanced Management more. Up to two renames per tenant, and renaming back is not supported."
  - "Schedule with Start-SPOTenantRename at least 24 hours and no more than 30 days ahead. Stop-SPOTenantRename cancels it before it starts."
  - "Each renamed site creates a redirect site using 0.15 MB, and redirects expire one year after the rename. More than 10 percent site failures suspend the tenant rename."
  - "Multi-Geo tenants, government clouds, .de domains, vanity domains and tenants with alternate URLs, BPOS sites or old public sites are blocked or need cleanup first."
faq:
  - q: "How many times can I rename?"
    a: "According to Microsoft Learn, up to two times per tenant lifetime, with no second rename scheduled within 30 days of a completed one. Renaming back to the original name is not supported."
  - q: "Which role and tool do I need?"
    a: "At least the SharePoint Administrator role in Microsoft 365 and the latest SharePoint Online Management Shell, which is not supported on Mac."
  - q: "How do I schedule it?"
    a: "Connect with Connect-SPOService to the admin URL and run Start-SPOTenantRename with DomainName and ScheduledDateTime. The time must be at least 24 hours and no more than 30 days ahead."
  - q: "How long does it take?"
    a: "Learn says several hours to days, depending on the number of sites and OneDrive users. During it, sites on the original domain are temporarily inaccessible until renamed."
  - q: "What happens to old links?"
    a: "Microsoft creates a redirect from the old address that expires one year after the rename."
---

Changing the SharePoint domain name changes the domain in SharePoint and OneDrive URLs. Even if you add a custom domain, SharePoint and OneDrive URLs keep the original onmicrosoft.com name until you rename them this way. This guide follows the Microsoft Learn article on changing your SharePoint domain name. Email addresses are not affected.

## Eligibility

- **Standard rename:** tenants with no more than 10,000 total sites, counting SharePoint sites, OneDrive accounts and SharePoint Embedded containers.
- **Advanced Tenant Rename:** for more than 10,000 sites or more control. It needs SharePoint Advanced Management and allows prioritizing up to 4,000 sites.
- **Frequency:** up to two renames per tenant, not within 30 days of a completed one. Reversal is not supported.
- **Blocked:** Multi-Geo tenants, GCC, GCC High and DoD, .de domains, vanity domains such as teams.contoso.com, and tenants with alternate URLs, BPOS sites or old public sites, which need support requests to remove.

You cannot restore sites deleted after the change, and you cannot use point-in-time restore to a time before it.

## Pre-checks

1. Be at least a SharePoint Administrator and install the latest SharePoint Online Management Shell. Remove old versions first.
2. Check the new name by browsing to the new sharepoint.com address. A 404 suggests it is free, and a sign-in screen means it is taken. Do not test the name in a test tenant, because that blocks its use in production.
3. Add the new onmicrosoft.com domain through the Microsoft 365 admin center, not the generic Add domain option. Do not make it the fallback domain, and confirm it shows Healthy.
4. Reserve storage: each site rename creates a redirect site of 0.15 MB.

If more than 10 percent of sites fail to rename, the tenant rename is suspended and resuming needs a support request.

## Schedule and monitor

```powershell
Connect-SPOService -Url "https://contoso-admin.sharepoint.com"
Start-SPOTenantRename -DomainName fabrikam -ScheduledDateTime "2027-01-16T10:25:00"
```

DomainName is the part before sharepoint.com or onmicrosoft.com. ScheduledDateTime must be at least 24 hours and no more than 30 days ahead, in the local time of the computer. `Stop-SPOTenantRename` cancels it before it starts. To monitor, open a new PowerShell window and run `Get-SPOTenantRenameStatus` and `Get-SPOSiteRenameState`, using the RenameJobID as ParentOperationID to filter failed sites. For Advanced Tenant Rename, `Set-SPOTenantRenameSitePrioritization` prioritizes sites. Root sites cannot be prioritized and changes are accepted until two hours before the start.

## During the rename

Duration is several hours to days. Sites on the original domain are temporarily inaccessible until each is renamed, and creating new OneDrive libraries or sites, including a new team or private channel, is blocked. Learn advises a low-usage period such as a weekend and not changing UPNs until it completes.

## Impact by severity

- **Low:** Office recent lists update over time, Office.com URLs can take 24 hours, and the OneDrive sync app needs version 17.3.6943.0625 or later. The search index can take days to months to update.
- **Medium:** custom apps and Group Policy with absolute URLs, InfoPath forms, Power Automate flows using SharePoint connections, Power BI reports with SharePoint sources, Project Online, SharePoint add-ins, hub sites that must be re-registered, and some Teams tabs and eDiscovery holds.
- **High:** the blockers above, locked sites connected to Teams or groups, which are not renamed, and deleted sites, which cannot be restored after the change.

## After the rename

Check firewall rules for the new domain, make sure browsers trust it including Group Policy, update non-Microsoft apps, custom apps and scripts, and check API access for SharePoint Framework solutions in the SharePoint admin center.

## A communication suggestion

This section is a suggestion, not Microsoft guidance. Announce the window to users and app owners well before the start, and list custom solutions that use absolute URLs.

## Details worth knowing

Status times in the monitoring output are shown in UTC, formatted to the local convention. Sites that cannot be renamed appear under Attention Required, and the state of each site can be Success, Failed or Suspended. Running the prioritization cmdlet from a CSV with all 4,000 sites can take about 4 to 6 hours, so Learn suggests splitting the list into batches. Prioritization does not guarantee a site finishes first. To list failed sites the page shows `Get-SPOSiteRenameState -ParentOperationID <RenameJobID> -State Failed | Export-Csv -Path <Path>`.

## Not covered

The page gives no exact duration formula, no rollback once the rename has begun, no detail on shared or external sharing links that use the old domain.

## Related

- [SharePoint](https://www.m365.fm/entity/sharepoint/)

## Sources

- [Change your SharePoint domain name (Microsoft Learn)](https://learn.microsoft.com/sharepoint/change-your-sharepoint-domain-name)
