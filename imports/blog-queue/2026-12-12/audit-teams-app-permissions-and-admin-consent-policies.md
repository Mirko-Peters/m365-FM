---
title: "Audit Third-Party Teams App Permissions and Tenant Admin Consent Policies"
summary: "How to review which Teams apps are allowed, what permissions they hold and who can consent: Teams admin center, app centric management, Microsoft Entra consent settings and Graph PowerShell checks."
status: review
publish: false
author: mirko-p
date: 2026-12-12
topics: [teams, teams-admin-center, entra-id, microsoft-graph-permissions]
keypoints:
  - "Teams availability and Microsoft Graph consent are two separate controls. Review both in the Teams admin center and in Microsoft Entra."
  - "Under app centric management each app has its own access definition, set to Everyone, Specific users or groups, or No one."
  - "Only a Global Administrator can grant org-wide consent to Graph permissions in the Teams admin center. Teams Administrators can only view them."
  - "In Entra, open Enterprise apps, select the app and then Permissions to see Admin consent and User consent grants."
  - "Revoking a grant does not stop users from consenting again, so check the user consent settings too."
faq:
  - q: "Where do I see what permissions a Teams app has?"
    a: "Microsoft Learn says to open Teams apps and Manage apps in the Teams admin center, then use the View details link in the Permissions column or open the app and select the Permissions tab. The Entra admin center shows granted consent under Enterprise apps, the app, then Permissions."
  - q: "Who can grant admin consent for a Teams app?"
    a: "According to Microsoft Learn, only Global Administrators can grant consent in the Teams admin center to the Microsoft Graph permissions an app requests on behalf of all users. Teams Administrators can view the required permissions but cannot grant consent."
  - q: "Can I revoke a user's consent in the portal?"
    a: "Microsoft Learn states that user consent grants cannot be revoked in the portal. Use Microsoft Graph or PowerShell cmdlets. Admin consent can be revoked in the portal on the Admin consent tab by selecting the permission and then Revoke permission."
  - q: "Does revoking consent prevent users from granting it again?"
    a: "No. Microsoft Learn says revoking a granted permission does not stop users from consenting again. Stop the app from requesting the permissions through dynamic consent, or limit user consent in the consent settings."
---

Auditing third-party Teams apps means checking three things: which apps users can use in Teams, which Microsoft Graph permissions each app holds, and who is allowed to grant new consent. They live in different admin centers, so a full audit visits both the Teams admin center and Microsoft Entra. The steps below use Microsoft Learn documentation.

## Step 1: Check which apps are available in Teams

Learn says that starting from April 2025 tenants are automatically migrated to app centric management, but also that not every organization has the feature available. The permission policies page warns that if your organization has moved to this model, permission policies no longer apply. Under app centric management, each app has its own access definition, with three choices:

| Availability | Who gets the app |
|---|---|
| Everyone | All users, new users and guests |
| Specific users or groups | Only the selected users and groups. Guests cannot use the app, even if assigned |
| No one | Nobody |

Microsoft says tenants were migrated automatically from April 2025 where only the default global policy was in use, and that after migration you cannot revert or edit permission policies. To review the result:

1. In the Teams admin center, select **Teams apps** > **Manage apps**.
2. Filter and sort the list by availability and status.
3. Open an app and use the **Users and groups** tab to see who has access.
4. For a user view, open **Users** > **Manage users**, select the user and open the **Apps** tab. It shows whether access comes from everyone, a direct assignment or a group.

Note two caveats from Microsoft. Blocked apps appear as unblocked but assigned to No one after migration. And Learn's known limitations say an app allowed in the global policy but blocked in a custom policy becomes available to all users after migration, except for EDU customers, where it becomes available to none. The auto-migration section words this differently (allowed for the affected user), so check any app with that history. Changes can take up to 24 hours, and in rare cases the client up to six days.

If your tenant still uses permission policies, the page describes options per category (Microsoft apps, third-party apps, custom apps): allow all, allow specific and block others, block specific and allow others, or block all. Policies apply only when assigned to a user, and Teams does not support group assignment for them.

## Step 2: Review org-wide app settings

On **Manage apps**, the **Actions** menu opens **Org-wide app settings**. It contains controls for Microsoft apps, third-party apps and custom apps. Microsoft says disallowing third-party apps blocks them all. The app details page also has a **Security and Compliance** tab with certification status, publisher attestation and key security attributes. Microsoft 365 certified and publisher-attested apps provide security information that you can use in your review.

## Step 3: Review Graph permissions per app

Microsoft's page on granting consent to Teams app permissions describes two kinds:

- **Microsoft Graph permissions, delegated and application.** Learn says only Global Administrators can grant org-wide consent to them in the Teams admin center. Admins can classify some delegated permissions as low risk so that users can consent to them. Application permissions cannot be classified as low risk, so only an admin can consent to them.
- **Resource-specific consent (RSC).** These are defined in the app manifest. Team owners can grant them when they add an app to a team or chat. They are listed on the app's **Permissions** tab as well.

To review them, open the app in **Manage apps** and select the **Permissions** tab. Only Global Administrators can accept org-wide consent there. If a new app version adds permissions that need admin consent, users cannot use it until you grant consent to the updated app.

## Step 4: Audit grants in Microsoft Entra

The authoritative list of what is granted is in Entra:

1. Sign in to the Microsoft Entra admin center as at least a Cloud Application Administrator.
2. Select **Entra ID** > **Enterprise apps** > **All applications** and open the app.
3. Select **Permissions**.
4. Switch between **Admin consent**, for the whole organization, and **User consent**, for specific users or groups.
5. Select a permission to open the **Permission Details** pane.

To review at scale, Learn shows Graph PowerShell. The lines below are the first part of its script that revokes all permissions of an app, and I left out the removal steps. Learn connects with four scopes for the whole script (`Application.ReadWrite.All`, `Directory.ReadWrite.All`, `DelegatedPermissionGrant.ReadWrite.All`, `AppRoleAssignment.ReadWrite.All`). The shorter scope list in my code is my own reduction and I did not test it, so adjust it in a test tenant:

```powershell
Connect-MgGraph -Scopes "Application.ReadWrite.All", "DelegatedPermissionGrant.ReadWrite.All"
$sp = Get-MgServicePrincipal -ServicePrincipalId "<object ID>"
Get-MgOauth2PermissionGrant -All | Where-Object { $_.ClientId -eq $sp.Id }
```

Application permissions are the app role assignments on the service principal, read with `Get-MgServicePrincipalAppRoleAssignment`. In Learn's script the listing and removal cmdlets differ between its sections (for example `Remove-MgServicePrincipalAppRoleAssignedTo` in one and `Remove-MgServicePrincipalAppRoleAssignment` in another). The page does not comment on this, so verify cmdlet names before running any removal script.

## Step 5: Review who can consent

In the Entra admin center, go to **Identity** > **Applications** > **Enterprise apps** > **Consent and permissions** > **User consent settings**. Microsoft recommends **Allow user consent for apps from verified publishers, for selected permissions**, which relies on permissions you classify as low impact. The alternative **Allow user consent for apps** allows consent to any permission that does not require admin consent. Changes affect only future consent. Existing grants stay until you remove them. On roles, the two pages disagree: the Entra page lists Privileged Role Administrator (Global Administrator only when you use the admin center), while the Teams consent page names Global Administrator, Application Administrator or Cloud Application Administrator. Check what your tenant accepts.

Turn on the admin consent workflow so users can request review of apps they cannot consent to. Microsoft links a separate article for it.

## Step 6: Revoke and prevent

- **Admin consent:** on the **Admin consent** tab, select the permission, then **...** and **Revoke permission**.
- **User consent:** not revocable in the portal. Use Graph or PowerShell.
- **Prevent re-consent:** Microsoft warns revoking does not stop users consenting again. Block the app's dynamic consent request or tighten user consent settings.

Microsoft also tells admins to review other authorization systems, such as Entra built-in roles, Exchange RBAC and Teams resource-specific consent.

## A simple audit checklist (my own)

1. Export the Manage apps list and note apps assigned to Everyone.
2. For each third-party app, check the Permissions tab and the certification data.
3. Compare with the Entra Admin consent and User consent tabs.
4. Remove grants for apps you no longer use.
5. Confirm user consent settings and the admin consent workflow.

Learn documents a CSV export of the app catalog on the Manage apps page. Its screenshot text names columns such as app name, status, availability, publisher and certification, not permissions. The pages read do not describe a bulk export of app permissions from the Teams admin center, so use the Graph scripts above for that.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Teams admin center](https://www.m365.fm/entity/teams-admin-center/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Microsoft Graph permissions](https://www.m365.fm/entity/microsoft-graph-permissions/)

## Sources

- [Microsoft Learn: App centric management in Teams admin center](https://learn.microsoft.com/en-us/microsoftteams/app-centric-management)
- [Microsoft Learn: App permission policies in Teams](https://learn.microsoft.com/en-us/microsoftteams/teams-app-permission-policies)
- [Microsoft Learn: Manage apps in the Teams admin center](https://learn.microsoft.com/en-us/microsoftteams/manage-apps)
- [Microsoft Learn: Grant and manage consent to Teams app permissions](https://learn.microsoft.com/en-us/microsoftteams/manage-consent-app-permissions)
- [Microsoft Learn: Review permissions granted to enterprise applications](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/manage-application-permissions)
- [Microsoft Learn: Configure how users consent to applications](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/configure-user-consent)
