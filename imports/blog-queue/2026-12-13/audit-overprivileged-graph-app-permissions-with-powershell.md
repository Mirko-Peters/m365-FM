---
title: "Audit Overprivileged Microsoft Graph App Permissions With PowerShell: Find, Review and Revoke"
summary: "How to list the application and delegated Microsoft Graph permissions granted to apps in your tenant with Microsoft Graph PowerShell, flag high-privilege scopes, and review or revoke them, based on Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2026-12-13
topics: [microsoft-graph-permissions, microsoft-graph-powershell, service-principal, least-privilege]
keypoints:
  - "Application permissions are stored as appRoleAssignment objects and delegated permissions as oAuth2PermissionGrant objects, so an audit needs both."
  - "Get-MgServicePrincipalAppRoleAssignment returns the roles an app has been granted on other resources such as Microsoft Graph."
  - "Learn calls Directory.ReadWrite.All and Directory.Read.All high-privilege and says to prefer lesser-privileged permissions."
  - "Portal revocation works only for admin-consented permissions. User-consented grants need Graph or PowerShell."
  - "Revoking a grant does not stop users from consenting again, so also review the user consent settings."
faq:
  - q: "Which cmdlet lists the Graph permissions an app has been granted?"
    a: "According to the Microsoft Graph PowerShell reference, Get-MgServicePrincipalAppRoleAssignment returns the app role assignments granted to the specified service principal. In the Learn example, PrincipalId is the queried app and ResourceId is the API it can access, such as Office 365 SharePoint Online."
  - q: "Who can consent to application permissions?"
    a: "The Microsoft Graph permissions overview says only the Privileged Role Administrator and the Global Administrator can consent to application permissions. Delegated permissions can be consented by users for their own data or by admins for all users, unless tenant consent policies restrict it."
  - q: "Which role do I need to review permissions in the portal?"
    a: "Microsoft Learn names Cloud Application Administrator as the minimum role for the portal, PowerShell and Graph steps on reviewing permissions granted to enterprise applications. Application Administrator also works."
  - q: "Does revoking a permission stop users from granting it again?"
    a: "No. Learn states that revoking does not stop users from re-consenting. To prevent it, stop the app from requesting the permission through dynamic consent, or restrict user consent in the tenant settings."
---

An app is overprivileged when it holds Microsoft Graph permissions it does not need for its task. Microsoft Learn calls granting more privileges than needed a poor security practice. Finding such apps takes two lookups: the application permissions each service principal holds, and the delegated permission grants made in your tenant. This article shows a PowerShell approach built on cmdlets that Learn documents, plus the review and revoke steps that Learn describes.

## Know the two permission types first

Learn describes two models:

- **Delegated permissions** let an app act for a signed-in user. The app cannot access anything the user could not access. Consent creates an oAuth2PermissionGrant object.
- **Application permissions** let an app act with its own identity, with no signed-in user. The app can access any data the permission covers. For example, Files.Read.All lets an app read any file in the organization. Consent creates an appRoleAssignment object.

Learn calls application permissions highly privileged. It also says the delegated model is recommended whenever it meets the application's needs. So an app that uses an application permission where a delegated one would work is a good candidate for review.

## Which permissions deserve a closer look

The permissions overview names several. Directory.AccessAsUser.All is described as the highest-privileged delegated permission. Directory.ReadWrite.All is second in privilege ranking. Directory.Read.All is the highest-privileged read-only permission for Microsoft Entra ID resources. User.ReadWrite.All as an application permission can update many writable user properties, including for users with privileged admin roles. Learn says to use these only when necessary and to prefer lesser-privileged options.

Permission names follow the pattern resource, operation, constraint. A constraint such as OwnedBy narrows access. Application.ReadWrite.OwnedBy, for example, manages only apps that the calling app creates or owns. Use the permissions reference to find the narrowest permission for a given operation.

## Step 1: Connect with read-only scopes

For the list call behind the cmdlet, the Graph API reference shows Application.Read.All as the least-privileged permission, both delegated and application. The delegated route also requires a supported Entra role such as Directory Readers, Application Administrator or Cloud Application Administrator. The reference does not list the delegated permission-grant lookup, so check the API page for the cmdlet you choose.

```powershell
Connect-MgGraph -Scopes "Application.Read.All"
```

## Step 2: List application permissions per app

The following script is my own sketch, assembled from cmdlets and properties that Learn documents. Test it in a non-production tenant before you rely on it. The servicePrincipal query for Microsoft Graph in the permissions overview shows that the appRoles property holds the application permissions, which is how the script turns role IDs into names.

```powershell
$watch = @(
  "Directory.ReadWrite.All", "Directory.Read.All",
  "User.ReadWrite.All", "Files.Read.All"
)
$resourceCache = @{}
$report = foreach ($sp in Get-MgServicePrincipal -All) {
  $assignments = Get-MgServicePrincipalAppRoleAssignment -ServicePrincipalId $sp.Id -All
  foreach ($a in $assignments) {
    if (-not $resourceCache.ContainsKey($a.ResourceId)) {
      $resourceCache[$a.ResourceId] = Get-MgServicePrincipal -ServicePrincipalId $a.ResourceId
    }
    $role = $resourceCache[$a.ResourceId].AppRoles | Where-Object Id -eq $a.AppRoleId
    [pscustomobject]@{
      App      = $sp.DisplayName
      AppId    = $sp.AppId
      Resource = $a.ResourceDisplayName
      Role     = $role.Value
      Flagged  = $watch -contains $role.Value
    }
  }
}
$report | Sort-Object Flagged, App -Descending | Export-Csv .\app-permissions.csv -NoTypeInformation
```

Three points about the script:

- The watch list contains only permissions that Learn calls out as broad. Extend it with your own policy.
- The cmdlet returns assignments where the queried app is the principal, meaning roles the app holds on other resources. It does not return who is assigned to the app.
- The Graph API reference notes that recently granted or removed assignments may take time to appear because of replication delay.

## Step 3: List delegated grants

The revoke script in Learn uses Get-MgOauth2PermissionGrant -All and filters on clientId equal to the service principal ID. You can use the same pattern to export every grant with its scope string and consent type, then review who consented and to what. The pages I read do not describe the properties of the grant object, so check the API reference before you build a report on them.

## Step 4: Review in the portal

Learn describes the portal path. Sign in to the Microsoft Entra admin center as at least Cloud Application Administrator, then go to **Entra ID** > **Enterprise apps** > **All applications**, select the app and open **Permissions**. The **Admin consent** tab shows organization-wide grants, and the **User consent** tab shows grants for specific users. Select a permission to open the **Permission Details** pane.

## Step 5: Revoke what is not needed

In the portal, open the **Admin consent** tab, select the **...** control next to a permission and choose **Revoke permission**. You cannot revoke from the **User consent** tab in the portal. Use Graph calls or PowerShell for those.

For PowerShell, Learn documents these removal commands:

- Remove-MgOauth2PermissionGrant for delegated grants, with the OAuth2PermissionGrantId.
- Remove-MgServicePrincipalAppRoleAssignedTo for application permissions, with the service principal ID and the AppRoleAssignmentId.

The scopes needed for these scripts in Learn are Application.ReadWrite.All, Directory.ReadWrite.All, DelegatedPermissionGrant.ReadWrite.All and AppRoleAssignment.ReadWrite.All. These are themselves high-privilege scopes, so use a dedicated admin session. Learn's sample scripts remove all permissions for an app, so adapt them to remove only the grants you identified. Learn also describes a way to restore revoked permissions in a separate article.

## After revoking

- Revocation does not stop re-consent. Stop the app from requesting the permission through dynamic consent, and consider the tenant user consent settings.
- Review other authorization systems that can expose sensitive data. Learn names Microsoft Entra built-in roles, Exchange RBAC and Teams resource-specific consent.
- Permissions granted through Entra built-in roles do not limit an app to calling Microsoft Graph only, according to the permissions overview.

## Common mistakes

- Checking only application permissions and ignoring delegated grants.
- Treating a name match on the watch list as proof of a problem. Check what the app does first.
- Revoking a permission for a production app without testing, because the app may stop working.
- Forgetting that the app may have another way in through an Entra role.

## What the pages I read do not cover

Learn's page on reviewing enterprise app permissions does not include a procedure for detecting overprivileged apps. It only says you may review permissions when you find a malicious app or one with more permissions than needed. The detection logic above is therefore a sketch, not a Microsoft-documented audit method.

## Related

- [Microsoft Graph permissions](https://www.m365.fm/entity/microsoft-graph-permissions/)
- [Microsoft Graph PowerShell](https://www.m365.fm/entity/microsoft-graph-powershell/)
- [Service principal](https://www.m365.fm/entity/service-principal/)
- [Least privilege](https://www.m365.fm/entity/least-privilege/)

## Sources

- [Microsoft Learn: Review permissions granted to enterprise applications](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/manage-application-permissions)
- [Microsoft Learn: Overview of Microsoft Graph permissions](https://learn.microsoft.com/en-us/graph/permissions-overview)
- [Microsoft Learn: Get-MgServicePrincipalAppRoleAssignment](https://learn.microsoft.com/en-us/powershell/module/microsoft.graph.applications/get-mgserviceprincipalapproleassignment)
- [Microsoft Learn: List appRoleAssignments granted to a service principal](https://learn.microsoft.com/en-us/graph/api/serviceprincipal-list-approleassignments?view=graph-rest-1.0)
