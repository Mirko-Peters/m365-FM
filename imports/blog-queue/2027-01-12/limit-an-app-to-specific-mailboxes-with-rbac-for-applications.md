---
title: "How to Limit an App to Specific Mailboxes With Role Based Access Control for Applications"
summary: "Scope an app's Exchange Online access with RBAC for Applications: service principal pointer, management scope, application roles, role assignment, testing, the union with Entra consent, propagation delay and the migration from application access policies."
status: review
publish: false
author: mirko-p
date: 2027-01-12
topics: [exchange-online, graph]
keypoints:
  - "RBAC for Applications grants an app permissions to Exchange Online data, optionally limited to a scope of mailboxes. It replaces Application Access Policies and supports Graph and EWS."
  - "Steps: optional management scope, New-ServicePrincipal pointer, choose an application role, New-ManagementRoleAssignment, then test with Test-ServicePrincipalAuthorization."
  - "Assigned permissions add to Entra grants. An unscoped Mail.Read in Entra plus a scoped one in RBAC is effectively unscoped, so remove the Entra grant."
  - "Changes are cached for 30 minutes to 2 hours depending on recent app usage. The test command bypasses the cache."
  - "You need the Organization Management role group and the Exchange Administrator role. The page does not state a preview status, and Autodiscover does not work with these roles."
faq:
  - q: "What is RBAC for Applications?"
    a: "It lets admins grant permissions to an app that accesses Exchange Online data independently, optionally limited to a resource scope such as specific mailboxes. It extends Exchange Online RBAC and replaces Application Access Policies."
  - q: "How do I scope an app to certain mailboxes?"
    a: "Create a management scope with New-ManagementScope, create a pointer with New-ServicePrincipal, then run New-ManagementRoleAssignment with the app, an application role such as Application Mail.Read and the custom resource scope."
  - q: "How do I test the result?"
    a: "Run Test-ServicePrincipalAuthorization with the app and the -Resource of a target mailbox. It returns InScope as true or false. Without -Resource it returns Not Run. The test ignores permissions granted in Entra ID."
  - q: "Why is my app still seeing all mailboxes?"
    a: "Assigned permissions act in addition to Entra grants. If the app has an unscoped Mail.Read in Entra, the result is effectively unscoped. Remove the Entra grant."
  - q: "How long do changes take?"
    a: "Changes are subject to cache maintenance of 30 minutes to 2 hours, depending on recent app usage. Apps with no inbound calls reset after 30 minutes and active apps are cached for up to 2 hours."
---

Apps that read mail or calendars through Microsoft Graph or EWS often get access to every mailbox in the tenant. RBAC for Applications in Exchange Online lets you limit that to chosen mailboxes. This guide follows the Microsoft Learn page on it. The page says the feature replaces Application Access Policies.

## The model

A management role assignment ties together a principal (the app), a role and a custom resource scope. The page's example is a room booking system limited to calendar data in specific regions with a management scope. These grants are independent of unscoped grants in Microsoft Entra ID.

## Steps

After `Connect-ExchangeOnline`:

1. **Create a resource scope (optional).**

```powershell
New-ManagementScope -Name "Canadian users" -RecipientRestrictionFilter "CustomAttribute1 -eq '012332'"
```

You can use an Entra administrative unit instead.

2. **Create a pointer to the Entra service principal.** Use the IDs from the Enterprise applications page, not App registrations.

```powershell
New-ServicePrincipal -AppId <Client Application ID> -ObjectId <Service principal object ID> -DisplayName <name>
```

3. **Choose an application role.** Application roles are assignable only to apps. List them with `Get-ManagementRole`. Examples: Application Mail.Read, Application Calendars.Read, Application EWS.AccessAsApp.
4. **Create the role assignment.**

```powershell
New-ManagementRoleAssignment -App <ObjectID, AppID, or DisplayName> -Role <role> -CustomResourceScope <Management Scope>
```

For an admin unit the page recommends `-RecipientAdministrativeUnitScope` with the admin unit ID. Change an assignment with `Set-ManagementRoleAssignment` and remove it with `Remove-ManagementRoleAssignment`.

5. **Test.**

```powershell
Test-ServicePrincipalAuthorization -Identity <app> -Resource <target mailbox>
```

With `-Resource` the result shows `InScope` as true or false. Without it the result is Not Run. The test ignores permissions granted separately in Entra ID.

## Permissions you need

- Exchange: membership in the Organization Management role group, or delegated assignments through Exchange Online RBAC.
- Entra ID: the Exchange Administrator role.

## Caveats from the page

- **Union with Entra.** Assigned permissions act in addition to Entra grants. An unscoped Mail.Read in Entra plus a scoped Mail.Read in RBAC is effectively unscoped. Remove the Entra grant. Learn recommends Entra for organization-wide permissions and RBAC for resource-scoped ones.
- **Two permissions on one endpoint.** An endpoint that needs both Mail.Read and Calendar.Read must have both against the same mailbox.
- **Propagation.** Changes are cached for 30 minutes to 2 hours. The test command bypasses the cache.
- **Exclusive scopes** do not restrict app access.
- **Deleting the Entra service principal** removes its Exchange assignments, but not the management scopes.
- **Scale.** Up to 10,000 applications per organization.
- **Limitations.** Apps cannot be members of role groups, application roles cannot be copied, and the supported protocols are Microsoft Graph and EWS. Autodiscover does not work with these roles.

## Migrate from Application Access Policies

1. Create a management scope with the `MemberOfGroup` filter and the group's distinguished name. Only direct membership counts, and nested members are out of scope.
2. Create the service principal pointer.
3. Assign permissions with the management scope.
4. Remove the consent in Azure.
5. Remove the Application Access Policy.

## What the page does not say

- A portal path for removing the consent in Entra. A consolidated view of app permissions is described as upcoming.
- Whether the feature is in preview. The page does not state it, though it offers a feedback alias.
- How to force a cache refresh other than the test command.
- Exact syntax for the -Resource parameter. The syntax and the example differ.
- The page's metadata dates do not match, so its currency is unclear.

## A rollout outline

This outline is practical advice built on the page.

1. List the apps that use Graph or EWS against Exchange and the mailboxes each really needs.
2. Create a scope per use case, preferably based on a group or an admin unit.
3. Assign the narrowest application role.
4. Remove the unscoped Entra grant for the app.
5. Test with Test-ServicePrincipalAuthorization for one in-scope and one out-of-scope mailbox, and allow for the cache time.

## Typical mistakes

- Leaving the unscoped Entra consent in place.
- Using IDs from App registrations instead of Enterprise applications.
- Using nested groups in a MemberOfGroup filter.
- Judging the result before the cache has refreshed.

## Related

- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Microsoft Graph](https://www.m365.fm/entity/graph/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)

## Sources

- [Role Based Access Control for Applications in Exchange Online (Microsoft Learn)](https://learn.microsoft.com/exchange/permissions-exo/application-rbac)
