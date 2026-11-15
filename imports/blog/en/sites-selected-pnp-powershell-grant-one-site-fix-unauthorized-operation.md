---
title: "Sites.Selected With PnP PowerShell: Grant One Site and Fix 'Unauthorized Operation'"
summary: "Sites.Selected is granted but PnP cmdlets still say 'Attempted to perform an unauthorized operation'? Grant the site, pick the right role, test the token and know which gaps are still open."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [pnp-powershell, sharepoint-permissions, app-registration, microsoft-graph-permissions, sharepoint]
keypoints:
  - "Per Microsoft Learn, Sites.Selected needs three things: consent on the app, a role granted on the site, and a token that carries the scope. If one is missing, the app has no access."
  - "PnP PowerShell grants the site role with Grant-PnPEntraIDAppSitePermission (Read, Write, Manage or FullControl). Some operations need a higher level than their name suggests."
  - "Get-PnPCommandPermission shows which permission alternatives a cmdlet accepts, and the PnP docs say Test-PnPConnectionPermission cannot check a Sites.Selected grant."
  - "Community threads from 2025 and 2026 report open gaps: delegated Sites.Selected, sensitivity labels, storage limits and grants by a non-site-collection admin. None has a confirmed fix."
faq:
  - q: "How do I give an app access to only one SharePoint site?"
    a: "Give the app registration the Sites.Selected application permission and consent to it, then grant the app a role on the site. PnP PowerShell does this with Grant-PnPEntraIDAppSitePermission and a role of Read, Write, Manage or FullControl. Learn describes the same three steps through the Graph permissions endpoint and adds that the app also needs a token with the scope."
  - q: "Which role do I grant: Read, Write or FullControl?"
    a: "Start with the lowest role that works for your script. The PnP permissions article warns that some operations need a higher level than the verb suggests. Reading permissions needs a right that only Full Control holds, and customizing pages or applying a theme needs Design rather than Edit. If a cmdlet fails with a lower role, check its requirements with Get-PnPCommandPermission before you raise the role."
  - q: "Can a SharePoint administrator grant Sites.Selected access without being a site collection admin?"
    a: "A December 2025 GitHub issue reports that Grant-PnPAzureADAppSitePermission failed with accessDenied for such an administrator, because the cmdlet looks up the site ID through Graph. A maintainer suggested passing a site object that already holds the ID. Nobody confirmed that this works, and one commenter reported a different error when passing the site ID and said that Site Admin rights were needed. Test it on one site first."
  - q: "Does Sites.Selected work with delegated sign-in?"
    a: "Learn says the Selected scopes support delegated and application modes. A GitHub issue from October 2025 reported Get-PnPSite failing with delegated Sites.Selected after a grant. Several commenters reported the same, and the thread ended without a confirmed solution. Treat delegated Sites.Selected in PnP PowerShell as unverified."
---

Sites.Selected is the least-privilege way to let a script touch SharePoint. The app sees only the sites you name. The catch is that a grant that looks correct can still end in "Attempted to perform an unauthorized operation".

This article draws on four GitHub issues from October 2025 to March 2026, one Microsoft Community Hub how-to post from February 2026, Microsoft Learn and the PnP PowerShell documentation. It is a troubleshooting guide, not an official Microsoft procedure. Where only a community post supports a statement, the text says so.

## What the symptoms look like

- November 2025: an app with Sites.Selected for Microsoft Graph and SharePoint, and a FullControl grant on one site, passed a grant check with `Get-MgSitePermission`. But `Invoke-PnPSiteTemplate`, `New-PnPList`, `Set-PnPList`, `Set-PnPListPermission` and `Add-PnPFolder` failed with the unauthorized message. The same script worked with `Sites.FullControl.All`. The reporter used PnP.PowerShell 3.1.0.
- March 2026: with a certificate and Sites.Selected, `Set-PnPSiteSensitivityLabel` failed. `Set-PnPSite -SensitivityLabel` did nothing and showed no error. Setting storage limits failed too.
- October 2025: after a grant, `Get-PnPSite` failed with a delegated Sites.Selected sign-in.
- December 2025: `Grant-PnPAzureADAppSitePermission` returned `accessDenied` for a SharePoint administrator who was not a site collection administrator.

## How Sites.Selected works

Microsoft Learn (page last updated November 2024) describes three steps:

1. The app is consented to the Sites.Selected scope.
2. A role is granted on the site. Learn lists the roles read, write, owner and fullcontrol, and shows a call to the site permissions endpoint in Microsoft Graph.
3. The app gets a token that contains the scope.

Learn states that if any of the three steps is missed, the app has no access. The caller who grants access needs `Sites.FullControl.All`. Learn calls that requirement necessarily high, because you can grant full control to a site collection with Sites.Selected.

PnP PowerShell wraps step 2. Its permission article says the lowest app-only permission is `Sites.Selected` on the SharePoint application scope, and that you must grant at least Read on the site you pass to `Connect-PnPOnline`.

## Step 1: Grant the site

The PnP article recommends a separate sign-in for the grant: preferably another app registration that has the delegated `AllSites.FullControl` permission on SharePoint, with a Global Administrator or SharePoint Administrator signed in. The cmdlet page lists `Sites.FullControl.All` on Microsoft Graph and notes that it works with delegated permissions, not application permissions.

```powershell
Connect-PnPOnline -Url https://yourtenant.sharepoint.com/sites/projects -Interactive -ClientId <admin-app-client-id>
Grant-PnPEntraIDAppSitePermission -AppId <reports-app-client-id> -DisplayName "Reports app" -Permissions Read -Site https://yourtenant.sharepoint.com/sites/projects
```

The older name `Grant-PnPAzureADAppSitePermission` still appears in some docs and threads. The changelog for 3.2.0 says cmdlets with `AzureAD` in the name were renamed to `EntraID`, with aliases kept for old scripts.

## Step 2: Pick the role on purpose

The cmdlet accepts Read, Write, Manage or FullControl. Learn's Graph role list says read, write, owner and fullcontrol, and the sources do not say how "Manage" and "owner" relate. The PnP permission article gives two examples where the verb misleads you:

- Reading permissions needs the Enumerate Permissions right, which only Full Control holds.
- Customizing pages or applying a theme needs Design, not Edit.

That article says this applies to app-only sign-in with Sites.Selected, because the app has to be granted access per site. A report script that reads role assignments therefore may fail with a Read or Write grant. Check first, then raise the role for that site only. To change a role later, use `Set-PnPEntraIDAppSitePermission -PermissionId <id> -Permissions Write`.

## Step 3: Confirm the grant

```powershell
Get-PnPEntraIDAppSitePermission -Site https://yourtenant.sharepoint.com/sites/projects
```

The cmdlet page says the Roles property is not filled unless you pass `-PermissionId`. This is described as an API limitation. It also says you need the SharePoint Administrator role to read another site's grants.

A February 2026 Community Hub how-to on app-only reporting warns that permission changes can take 10 minutes or more to apply. That figure comes from the post, not from the docs. If a fresh grant fails, wait and retest before you change anything.

## Step 4: Connect to the granted site and test

Use certificate sign-in, which is what Learn says SharePoint requires for app-only access through Entra ID, and connect to the site you granted:

```powershell
Connect-PnPOnline -Url https://yourtenant.sharepoint.com/sites/projects -ClientId <reports-app-client-id> -Tenant yourtenant.onmicrosoft.com -Thumbprint <thumbprint>
Get-PnPWeb
```

Then ask PnP what each failing cmdlet needs. According to the changelog, `Get-PnPCommandPermission` and `Test-PnPConnectionPermission` are new in PnP PowerShell 3.4.0, so older builds do not have them:

```powershell
Get-PnPCommandPermission -CommandName Set-PnPList
Test-PnPConnectionPermission -CommandName Set-PnPList
```

`Get-PnPCommandPermission` needs no connection. It lists alternative permission sets, and it reports how reliable the answer is in `PermissionSource`. The PnP article treats anything other than `Declared` as guidance, not a guarantee. It also lists `ApplicationAvailable`: if that is False, the cmdlet cannot run app-only with any permission.

`Test-PnPConnectionPermission` compares the token claims with the cmdlet's needs. Its page says Sites.Selected is deliberately not treated as covering tenant-wide scopes, and that the check cannot see a Sites.Selected grant on a site. A True result does not prove the grant is there.

If you still get Access Denied, start the trace log, run the cmdlet and read the errors:

```powershell
Start-PnPTraceLog -WriteToLogStream
<run the cmdlet that fails>
Get-PnPTraceLog | Where-Object Level -eq Error
```

The PnP article says that for many, but not all, cmdlets the log names the missing permission. `-Verbose` does not show it.

## Step 5: Go narrower if one site is still too much

The PnP 3.3.0 changelog added cmdlets such as `Grant-PnPEntraIDAppListPermission`, `Grant-PnPEntraIDAppListItemPermission` and `Grant-PnPEntraIDAppFilePermission`. Learn describes matching list, list item and file scopes (`Lists.SelectedOperations.Selected` and similar). It adds that granting these breaks inheritance on the resource. Check the cmdlet pages and Learn before you use them at scale.

## Known gaps from the threads

| Case | What was reported | Status |
|---|---|---|
| Many cmdlets fail after a valid grant | A maintainer suspected a temporary server-side problem and announced closing the issue after three weeks without a reply. The reporter said it worked at the start of one week and then stopped. A direct Graph test with the same grant also returned access denied. | Not resolved |
| Delegated Sites.Selected | `Get-PnPSite` unauthorized after a grant. Commenters reported the same. | Not resolved |
| Sensitivity label and storage limits | A maintainer said Sites.Selected is not enough for `Set-PnPSiteSensitivityLabel`. A commenter said storage limits need `Sites.FullControl.All` and that it is the only alternative they know for labels. | Reported, not confirmed in docs |
| Sharing settings | `Set-PnPWeb -MembersCanShare:$false` and `Set-PnPGroup -AllowMembersEditMembership:$false` worked with Sites.Selected. | Confirmed by one commenter |
| Admin without site collection admin rights | According to the reporter, the grant cmdlet looks up the site ID through Graph. A maintainer suggested `Get-PnPSite -Includes Id,Url` and passing the object to `-Site`. Another commenter reported a different error with the ID passed directly. | Not confirmed |

## Limits and open points

- The Learn page on selected permissions is from 2024. It describes the Graph calls. The PnP pages are the source for cmdlet behavior.
- No thread in this set links a fix or a pull request. The March 2026 issue did produce one confirmed workaround, for sharing settings.
- In one thread a commenter reported that Microsoft told them there is no Graph option for sensitivity labels and none in development. That is a community statement. Check Learn before you rely on it.
- The Community Hub post is a how-to by a community member, not a documented procedure. It has no marked solution.

## Related

- [PnP PowerShell](https://www.m365.fm/entity/pnp-powershell/)
- [SharePoint permissions](https://www.m365.fm/entity/sharepoint-permissions/)
- [Application registration](https://www.m365.fm/entity/app-registration/)
- [Microsoft Graph permissions](https://www.m365.fm/entity/microsoft-graph-permissions/)
- [SharePoint](https://www.m365.fm/entity/sharepoint/)

## Sources

- [Microsoft Learn: Overview of selected permissions in OneDrive and SharePoint](https://learn.microsoft.com/en-us/graph/permissions-selected-overview)
- [Microsoft Learn: Granting access via Entra ID App-Only](https://learn.microsoft.com/en-us/sharepoint/dev/solution-guidance/security-apponly-azuread)
- [PnP PowerShell: How to determine which permissions you need](https://pnp.github.io/powershell/articles/determinepermissions.html)
- [PnP PowerShell: Grant-PnPEntraIDAppSitePermission](https://pnp.github.io/powershell/cmdlets/Grant-PnPEntraIDAppSitePermission.html)
- [PnP PowerShell: Get-PnPEntraIDAppSitePermission](https://pnp.github.io/powershell/cmdlets/Get-PnPEntraIDAppSitePermission.html)
- [PnP PowerShell: Set-PnPEntraIDAppSitePermission](https://pnp.github.io/powershell/cmdlets/Set-PnPEntraIDAppSitePermission.html)
- [PnP PowerShell: Get-PnPCommandPermission](https://pnp.github.io/powershell/cmdlets/Get-PnPCommandPermission.html)
- [PnP PowerShell: Test-PnPConnectionPermission](https://pnp.github.io/powershell/cmdlets/Test-PnPConnectionPermission.html)
- [PnP PowerShell changelog](https://github.com/pnp/powershell/blob/dev/CHANGELOG.md)
- [GitHub: Sites.Selected permission in App Only context not working properly (issue 5169, November 2025)](https://github.com/pnp/powershell/issues/5169)
- [GitHub: Setting Sensitivity Label on a site with Sites.Selected (issue 5267, March 2026)](https://github.com/pnp/powershell/issues/5267)
- [GitHub: SharePoint Delegated Sites.Selected (issue 5139, October 2025)](https://github.com/pnp/powershell/issues/5139)
- [GitHub: Grant-PnPAzureADAppSitePermissions does not work for non-site collection admins (issue 5193, December 2025)](https://github.com/pnp/powershell/issues/5193)
- [Microsoft Community Hub: SharePoint Reporting using PnP PowerShell through Azure Automation (February 2026)](https://techcommunity.microsoft.com/discussions/microsoft-365-migrations/sharepoint-reporting-using-pnp-powershell-through-azure-automation/4495124)
