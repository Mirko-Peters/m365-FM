---
title: "Azure Automation Runbook Gets 'Insufficient Privileges' From Microsoft Graph: Grant App Roles to the Managed Identity"
summary: "A runbook that signs in with its managed identity fails on Graph calls with Authorization_RequestDenied. The identity has no Graph permissions until you assign app roles with PowerShell."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [azure-automation, managed-identity, microsoft-graph-powershell, microsoft-graph-permissions]
keypoints:
  - "A managed identity starts with no Microsoft Graph permissions. Unattended runbooks need application permissions (app roles), not delegated scopes."
  - "Reported in a 2025 thread and a 2024 Tech Community article: the portal does not let you grant these permissions to a managed identity. Assign the app role with Microsoft Graph PowerShell or REST, using object IDs, not application IDs."
  - "The resource ID is the object ID of the Microsoft Graph service principal in your own tenant. Do not copy an ID from an example."
  - "Grant only the role the script needs. Learn warns that app roles assigned this way take effect at once and are not reviewed."
faq:
  - q: "Why does my runbook fail with 'Insufficient privileges to complete the operation'?"
    a: "The error is a 403 from Microsoft Graph. Microsoft Learn's Graph PowerShell troubleshooting page says such errors usually mean the caller lacks the required permission. A system-assigned managed identity has no Graph permissions by default, so the runbook can sign in but cannot read or write directory data until you assign app roles."
  - q: "Can I grant the permission in the Azure portal?"
    a: "In a 2025 thread a Microsoft moderator said the portal does not show the API permissions tab for managed identities, and a Microsoft Tech Community article from 2024 says the Grant admin consent button is disabled for them. The grant is done with PowerShell or REST. Microsoft Learn's managed identity how-to also uses command-line and REST calls. Check the portal again, because the experience may change."
  - q: "Do I use delegated or application permissions for a runbook?"
    a: "Application permissions. A runbook runs without a signed-in user, so a delegated permission has nothing to act on behalf of. A Microsoft moderator said the same in a 2025 thread. Learn's Graph PowerShell page says app-only access uses preconfigured application permissions that need administrator consent, or app roles assigned with New-MgServicePrincipalAppRoleAssignment."
  - q: "How long until a new permission works?"
    a: "Learn's managed identity how-to warns that the infrastructure caches tokens, so changes to a managed identity's roles can take a long time to apply. It gives no number. Stop the job, wait, start a new job and test again."
---

An Azure Automation runbook connects to Microsoft Graph with its managed identity. The connection succeeds. The first call fails with `[Authorization_RequestDenied] : Insufficient privileges to complete the operation`.

Two Microsoft Q&A threads from September 2025 describe this. In one, an administrator followed a community article to grant Graph permissions and hit errors in the script. In the other, a runbook that should list inactive Entra ID users failed the same way. Neither thread ended with a confirmation. This article puts the pieces together from Microsoft Learn and marks what the threads only reported. It is not an official Microsoft procedure.

## Why the error appears

A system-assigned managed identity is a service principal in Entra ID. Enabling it gives the runbook an identity, but no Graph permissions. A Microsoft Tech Community article from October 2024 says the identity has no Graph permissions by default and that the portal's Grant admin consent button is disabled for it.

Learn's Graph PowerShell troubleshooting page says that most authorization errors come back as 403 and that the usual cause is a missing permission. For app-only access, it says to preconfigure application permissions or assign app roles with `New-MgServicePrincipalAppRoleAssignment`.

Two things went wrong in the threads and are easy to repeat:

- **Wrong permission type.** The asker consented to delegated permissions. A moderator pointed out that a script that gets its token without a user needs application permissions.
- **Wrong resource ID.** The first answer used an example ID for the Microsoft Graph service principal. A moderator then said this ID differs between tenants and has to be looked up in your own tenant. Learn says the same: `resourceId` is the object ID of the resource service principal, not its application ID.

## Step 1: Enable the managed identity and note its object ID

1. In the Azure portal, open the Automation account.
2. Under **Account Settings**, select **Identity**.
3. Set **System assigned** to **On**, select **Save** and confirm.

The same page shows the object ID. Learn also explains how to get it with the Azure CLI. Keep it as `$MI_ID`. This is the object ID, not the application ID.

## Step 2: Find out which permission the call needs

Do not guess, and do not choose `Directory.ReadWrite.All` because it sounds safe. Learn's Graph PowerShell troubleshooting page shows how to look up the permission for a cmdlet:

```powershell
Find-MgGraphCommand -Command Get-MgUser | Select -First 1 -ExpandProperty Permissions
```

(The Learn example uses `New-MgServicePrincipal` in place of `Get-MgUser`.) For a script that reads sign-in activity, Learn's user list reference says the `signInActivity` property needs a Microsoft Entra ID P1 or P2 license and the `AuditLog.Read.All` permission. Learn's inactive-accounts page lists `AuditLog.Read.All` and `User.Read.All`. Learn names Reports Reader as the least privileged role for activity logs.

In the inactive-accounts thread, a moderator suggested adding the Reports Reader or Directory Reader role to the identity and the permissions `AuditLog.Read.All` and `Directory.Read.All`. That answer was not accepted, and Learn does not confirm that a directory role is also needed for app roles. Start with the app roles and add a role only if the call still fails.

## Step 3: Assign the app role with Microsoft Graph PowerShell

You need the right to assign roles. Learn's Graph PowerShell tutorial lists Privileged Role Administrator, and the Tech Community article says a Global Administrator ran its scripts. Sign in as an administrator on your own computer or in Cloud Shell, not in the runbook.

Learn's Exchange managed identity page shows this pattern, with the managed identity as both principal and service principal. Here it is adapted to Graph. The Graph application ID `00000003-0000-0000-c000-000000000000` is from Learn's REST page:

```powershell
Connect-MgGraph -Scopes AppRoleAssignment.ReadWrite.All,Application.Read.All

$graph  = Get-MgServicePrincipal -Filter "AppId eq '00000003-0000-0000-c000-000000000000'"
$roleId = $graph.AppRoles |
  Where-Object { $_.Value -eq 'AuditLog.Read.All' -and $_.AllowedMemberTypes -contains 'Application' } |
  Select-Object -ExpandProperty Id

New-MgServicePrincipalAppRoleAssignment -ServicePrincipalId $MI_ID `
  -PrincipalId $MI_ID -ResourceId $graph.Id -AppRoleId $roleId
```

Notes:

- `$graph.Id` is the Graph service principal's object ID in your tenant. That is the value to use as `ResourceId`.
- The role lookup follows the pattern in Learn's tutorial, which filters `AppRoles` by `Value`. The check for `AllowedMemberTypes` is my addition and follows the community article, which keeps only roles that allow the Application type.
- Learn's tutorial page uses a second form, with the resource's ID as `ServicePrincipalId` and a body parameter. Learn shows both forms. Pick one and check the output.
- Learn's REST page cautions that only appropriate users should hold `AppRoleAssignment.ReadWrite.All`, and that permissions assigned this way take effect at once without a review.

The error in the first thread, "Some App Roles are not found on Graph API service principal", comes from the community script. By its logic, it fires when the number of matched roles differs from the number of names requested. A misspelled name, or a name that is not an application role, would trigger it. This is an inference from reading the script. The article does not state it.

To check, list the assignments on the identity or view the Graph assignment in Entra. Learn's REST page shows listing with `GET .../appRoleAssignedTo` on the resource.

## Step 4: Use the identity in the runbook

Learn's Graph PowerShell page shows the call:

```powershell
Connect-MgGraph -Identity
Get-MgContext
```

For a user-assigned identity, add `-ClientId` with the identity's client ID. `Get-MgContext` shows `AuthType`, which tells you if the session is delegated or app-only. Import the `Microsoft.Graph.Authentication` module, and any submodules you call, into the Automation account first. Learn's modules page describes the import steps and the runtime version choice.

One more point from the inactive-accounts thread. The script used `Connect-AzAccount -Identity` and `Get-AzADUser` with a `SignInActivity` filter. A moderator suggested `-Property SignInActivity`. I could not confirm in Learn that this works. For `signInActivity`, Learn documents the Graph request `GET /v1.0/users?$select=displayName,userPrincipalName,signInActivity`, with a maximum page size of 500. Using Graph directly is the safer path.

## Step 5: Wait, then test with a fresh job

Learn's managed identity how-to warns that token caching can delay changes. If the runbook still fails right after the grant, stop the job, wait and start a new one. In the first thread, the permission showed on the enterprise application after the resource ID was fixed, but the runbook still failed. The thread does not say whether the delay, the wrong permission type or the missing permission was the reason.

## Removing a wrong grant

The asker in the first thread wanted to remove permissions granted in Graph Explorer, and got no answer. For app roles, Learn's tutorial shows `Remove-MgServicePrincipalAppRoleAssignedTo`, and the REST page shows a `DELETE` on `appRoleAssignedTo`. The community article's cleanup script uses `Remove-MgServicePrincipalAppRoleAssignment`. For delegated grants made through `oauth2PermissionGrants`, look for the matching removal in the Learn page on granting consent. I did not verify that path.

## Limits

- Neither thread confirmed a fix. The steps here follow Learn, not a confirmed outcome.
- The Learn Exchange page used for the cmdlet pattern was last updated in 2023. The cmdlet and parameters match the newer Graph PowerShell tutorial, but run your own test.
- Keep the permission small. Use `AuditLog.Read.All` for sign-in data, not a directory-wide write role.

## Related

- [Azure Automation](https://www.m365.fm/entity/azure-automation/)
- [Managed identity](https://www.m365.fm/entity/managed-identity/)
- [Microsoft Graph PowerShell](https://www.m365.fm/entity/microsoft-graph-powershell/)
- [Microsoft Graph permissions](https://www.m365.fm/entity/microsoft-graph-permissions/)

## Sources

- [Microsoft Learn: Troubleshoot common errors in Microsoft Graph PowerShell](https://learn.microsoft.com/en-us/powershell/microsoftgraph/troubleshooting?view=graph-powershell-1.0)
- [Microsoft Learn: Grant or revoke API permissions programmatically (Graph REST)](https://learn.microsoft.com/en-us/graph/permissions-grant-via-msgraph)
- [Microsoft Learn: Grant app roles using Microsoft Graph PowerShell](https://learn.microsoft.com/en-us/powershell/microsoftgraph/tutorial-grant-app-only-api-permissions)
- [Microsoft Learn: Assign an app role to a managed identity](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/how-to-assign-app-role-managed-identity-powershell)
- [Microsoft Learn: Enable a managed identity for Azure Automation](https://learn.microsoft.com/en-us/azure/automation/enable-managed-identity-for-automation)
- [Microsoft Learn: Use Azure managed identities to connect to Exchange Online PowerShell](https://learn.microsoft.com/en-us/powershell/exchange/connect-exo-powershell-managed-identity)
- [Microsoft Learn: Microsoft Graph PowerShell authentication commands](https://learn.microsoft.com/en-us/powershell/microsoftgraph/authentication-commands?view=graph-powershell-1.0)
- [Microsoft Learn: signInActivity resource type](https://learn.microsoft.com/en-us/graph/api/resources/signinactivity)
- [Microsoft Learn: List users](https://learn.microsoft.com/en-us/graph/api/user-list?view=graph-rest-1.0&tabs=http)
- [Microsoft Learn: Manage inactive user accounts in Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/identity/monitoring-health/howto-manage-inactive-user-accounts)
- [Microsoft Learn: Manage modules in Azure Automation](https://learn.microsoft.com/en-us/azure/automation/shared-resources/modules)
- [Microsoft Tech Community: Grant Graph API permission to Azure Automation system-assigned managed identity (October 2024)](https://techcommunity.microsoft.com/blog/integrationsonazureblog/grant-graph-api-permission-to-azure-automation-system-assigned-managed-identity/4278846)
- [Microsoft Q&A: Unable to grant Graph API permission to Managed Identity Enterprise application (September 2025)](https://learn.microsoft.com/en-us/answers/questions/5542293/unable-to-grant-graph-api-permission-to-managed-id)
- [Microsoft Q&A: Azure Runbook automation to identify and list inactive accounts (September 2025)](https://learn.microsoft.com/en-us/answers/questions/5543535/azure-runbook-automation-to-identify-and-list-inac)
