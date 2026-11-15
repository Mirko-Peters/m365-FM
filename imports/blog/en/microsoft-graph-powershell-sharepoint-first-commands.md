---
title: "Microsoft Graph PowerShell for SharePoint admins: first commands"
summary: "Microsoft Graph PowerShell for SharePoint: install the SDK, sign in with the right scope, list sites with Get-MgSite and fix the 403 errors admins hit first."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [microsoft-graph-powershell, graph, sharepoint, microsoft-graph-permissions]
keypoints:
  - "Microsoft Graph PowerShell is an SDK that wraps the Graph APIs, so every command needs a Connect-MgGraph sign-in with the right permission scopes first."
  - "Get-MgSite lists SharePoint sites and needs the Sites.Read.All permission at minimum, which is the least privileged option Microsoft documents for it."
  - "Get-MgContext shows which scopes your current session holds, which is the fastest way to explain a 403 Forbidden error."
  - "Find-MgGraphCommand and Find-MgGraphPermission tell you which permission a command needs, so you do not have to guess scope names."
  - "Delegated sign-in suits a person at a keyboard, while app-only sign-in with a certificate or managed identity suits unattended jobs."
faq:
  - q: "What is Microsoft Graph PowerShell?"
    a: "Microsoft Graph PowerShell is the PowerShell SDK for the Microsoft Graph APIs. It turns Graph calls into cmdlets such as Get-MgSite and Get-MgUser. You install it from the PowerShell Gallery, sign in with Connect-MgGraph, and then run commands against users, groups, sites, mail and other Microsoft 365 data."
  - q: "How do I list all SharePoint sites with Microsoft Graph PowerShell?"
    a: "Install the module, run Connect-MgGraph -Scopes \"Sites.Read.All\", then run Get-MgSite -All. The -All switch follows paging so you get every result. The Graph list endpoint covers sites in your default geography only, so a multi-geo tenant needs the cross-geography command, Get-MgAllSite, as well."
  - q: "Why do I get a 403 Forbidden error in Microsoft Graph PowerShell?"
    a: "A 403 usually means the signed-in user or app lacks a permission the command needs. Run Get-MgContext to see your current scopes, use Find-MgGraphCommand to find the required permission, and reconnect with that scope. Application permissions also need administrator consent before they work."
---

Microsoft Graph PowerShell for SharePoint means using the Graph SDK to read and manage sites from the command line. You install one module, sign in with `Connect-MgGraph` and a permission scope, and run cmdlets such as `Get-MgSite`. This guide is for SharePoint admins who already know the SharePoint admin center and want a safe first path into scripting. You will install the SDK, sign in with the smallest scope that works, list sites, and learn how to read the errors that appear first.

## What Microsoft Graph PowerShell is, and why admins use it

[Microsoft Graph](https://www.m365.fm/entity/graph/) is the single API for Microsoft 365 data: users, groups, files, mail, Teams and SharePoint sites. The Microsoft Graph PowerShell SDK wraps the Graph API in cmdlets. You do not write web requests to each endpoint. You run `Get-MgSite` and get site objects back.

For a SharePoint admin, this has three practical benefits.

- **One tool across services.** The same sign-in works for sites, users and groups. A script can list sites, then look up their owners.
- **A permission model you can read.** Every call needs named permissions, called scopes. You can see which scopes a session holds and why a call was refused.
- **A path away from older modules.** The entity notes for [Microsoft Graph PowerShell](https://www.m365.fm/entity/microsoft-graph-powershell/) describe it as the replacement for the retired Azure AD PowerShell and MSOnline modules.

The community PnP PowerShell module is the other common choice for SharePoint scripting, and its documentation notes that some cmdlets talk to Graph as well. Graph PowerShell does not replace every SharePoint admin tool. It covers what the Graph API exposes. Some tenant settings still live in the SharePoint admin center or in other modules. Treat Graph as one tool in your set, not the only one.

## Step 1: install the SDK and sign in

The [installation guide](https://learn.microsoft.com/en-us/powershell/microsoftgraph/installation?view=graph-powershell-1.0) recommends PowerShell 7 or later on all platforms. Windows PowerShell needs version 5.1 or later, .NET Framework 4.7.2 or later, and an execution policy of `RemoteSigned` or less restrictive.

Follow these steps:

1. Install the module for your own account: `Install-Module Microsoft.Graph -Scope CurrentUser -Repository PSGallery -Force`. Use `-Scope AllUsers` only if you have admin rights and need a shared install.
2. Check the result with `Get-InstalledModule Microsoft.Graph`.
3. Know that the main module installs over 47 sub-modules. The page says you can install only the ones you need, and that `Microsoft.Graph.Authentication` comes with them.
4. Update later with `Update-Module Microsoft.Graph`. An out-of-date module is a listed cause of version conflicts.

Installing in one PowerShell version does not install it in the other, so run the command in the version you will use.

Now sign in. The page on [authentication commands](https://learn.microsoft.com/en-us/powershell/microsoftgraph/authentication-commands?view=graph-powershell-1.0) explains that the SDK supports two types of access: delegated and app-only. Delegated access acts for a signed-in user, and its permissions are scopes. App-only access runs without a user, with a certificate, a client secret or a managed identity.

For your first commands, use delegated access and ask for one read-only scope:

`Connect-MgGraph -Scopes "Sites.Read.All"`

A browser window opens for sign-in. To check what you got, run `Get-MgContext | Select -ExpandProperty Scopes`. Microsoft documents `Get-MgContext` as the command that returns the details of your current session, such as the client ID, tenant ID, scopes and authentication type. When you finish, run `Disconnect-MgGraph`. The page says you stay signed in until you do, because tokens are cached under the default `CurrentUser` scope. Add `-ContextScope Process` to `Connect-MgGraph` if you want the sign-in to last only for the current session.

## First commands for SharePoint sites

The reference for [Get-MgSite](https://learn.microsoft.com/en-us/powershell/module/microsoft.graph.sites/get-mgsite?view=graph-powershell-1.0) lists the main parameters: `-Filter`, `-Search`, `-Property` (alias `-Select`), `-Top`, `-Sort` and `-All`. The page's own examples are short:

- `Get-MgSite` lists sites.
- `Get-MgSite -Property "siteCollection,webUrl" -Filter "siteCollection/root ne null"` returns only root site collections, with two properties.

Build up from there:

1. **List with paging.** Run `Get-MgSite -All` to follow every page of results. Without `-All`, you may see only the first page.
2. **Pick the columns.** Add `-Property "id,displayName,webUrl"` so the output stays small and readable.
3. **Search by keyword.** Run `Get-MgSite -Search "finance"`. The Graph search API matches free text across several site properties.
4. **Get one site.** Run `Get-MgSite -SiteId <id>`, where the ID is the `id` value from a previous result. It has the form of a host name, then two GUIDs, separated by commas.

Each of these cmdlets maps to a REST call. `Get-MgSite -All` reads the sites collection at `https://graph.microsoft.com/v1.0/sites`, the URL that the REST documentation shows for listing sites, and `-Filter`, `-Search` and `-Property` become query options on that URL. The SDK gets its tokens through the Microsoft Authentication Library (MSAL). If a cmdlet is missing for a call you need, `Invoke-MgGraphRequest` can call a URI directly. The troubleshooting page uses it to check the URI behind a Bad request error.

Two limits matter. First, the Graph list endpoint returns sites in the organization's default geography. For all geographies, Microsoft points to the `getAllSites` API, which matches the cmdlet `Get-MgAllSite`. Second, the search API can sort only by `createdDateTime`.

## Which permissions do you need? Microsoft Graph PowerShell and SharePoint scopes

[Microsoft Graph permissions](https://www.m365.fm/entity/microsoft-graph-permissions/) are the part that surprises new users. For site reads, the cmdlet page lists `Sites.Read.All` as the least privileged choice and `Sites.ReadWrite.All` as the more privileged one. Pick the first unless a script must change something.

You do not have to remember scope names. Two helper commands do the lookup:

- `Find-MgGraphCommand` shows which permissions a cmdlet or API requires. The troubleshooting page uses `Find-MgGraphCommand -command New-MgServicePrincipal | Select -First 1 -ExpandProperty Permissions` as its example.
- `Find-MgGraphPermission` finds permissions by area or name, such as `Find-MgGraphPermission application`. The output shows the type (delegated or application), whether consent is by an admin, and a description.

Note one point of disagreement in the documentation. The REST page for listing sites shows only application permissions for that call and marks delegated access as not supported. The cmdlet page for `Get-MgSite` lists both. Test your own call in a non-production tenant and read the error text if it fails. Do not assume the cmdlet page is right for every call.

For unattended jobs, you need app-only access. That means an app registration in Microsoft Entra, application permissions (also called API permissions) and administrator consent. The troubleshooting page says application permissions require administrator consent. Use a certificate or a managed identity, not a typed password.

## Example: a stale-site inventory in five commands

The numbers in this example are made up.

An admin wants a first list of sites that nobody has changed for a year.

1. `Connect-MgGraph -Scopes "Sites.Read.All"`
2. `$sites = Get-MgSite -All -Property "id,displayName,webUrl,lastModifiedDateTime"`
3. `$sites.Count` returns 480 in this example.
4. `$old = $sites | Where-Object { $_.LastModifiedDateTime -lt (Get-Date).AddYears(-1) }`
5. `$old | Select DisplayName, WebUrl, LastModifiedDateTime | Export-Csv stale-sites.csv -NoTypeInformation`

Say the file holds 60 rows. That is 60 of 480, or 12.5 percent, a short list to review with the site owners. The admin has read access only and changed nothing. A site's last modified date does not prove nobody uses it, so the list is a starting point for questions, not a delete list.

## Common mistakes

- **Connecting without a scope.** A sign-in without the right scope leads to 403 errors. Run `Get-MgContext` and compare the scopes with what the cmdlet needs.
- **Asking for write scopes for a read job.** `Sites.ReadWrite.All` is more than a report needs. Start with `Sites.Read.All`.
- **Forgetting `-All`.** Without it, a list can look complete when it is only the first page.
- **Mixing up the module versions.** Microsoft recommends the v1.0 module for scripts. The beta module is in preview and can change without notice.
- **Skipping the update.** An old `Microsoft.Graph` version is a listed cause of version conflicts. Run `Update-Module Microsoft.Graph` before you chase other causes.
- **Staying signed in on a shared machine.** Tokens are cached. Run `Disconnect-MgGraph` when you are done.

## How software can help

Most first-time needs are met by tools you already own. The Microsoft Graph PowerShell SDK handles reads and exports. The SharePoint admin center shows site lists and settings without code. Excel or Power BI turns a CSV into a report that site owners can read. For scheduled runs, Azure Automation can run a script with a managed identity.

Look for gaps only after the first month. If you keep rebuilding the same inventory by hand, a saved script with a fixed output folder and a monthly reminder is usually enough.

## Next step

Install the SDK, run `Connect-MgGraph -Scopes "Sites.Read.All"` and export the output of `Get-MgSite -All` to a CSV today. Then use `Find-MgGraphCommand` on your next cmdlet to learn its permission before you run Microsoft Graph PowerShell for SharePoint tasks in production.
