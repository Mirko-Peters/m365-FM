---
title: "Fix AADSTS50105: The Signed-In User Is Not Assigned to a Role for the Application"
summary: "Fix AADSTS50105 in Microsoft Entra: why Assignment required causes it, how to assign users or groups or turn the setting off, direct group membership rules, Default Access, Global Administrator exemption and what to verify."
status: review
publish: false
author: mirko-p
date: 2027-01-07
topics: [entra-id, admin-consent]
keypoints:
  - "AADSTS50105 appears when the enterprise application has Assignment required set to Yes and the user has no app role assignment."
  - "Fix 1: keep the setting and assign the user or a group under Users and groups > Add user/group. Fix 2: set Assignment required to No and save."
  - "A group works only if the user is a direct member. Learn says not to rely on nested group membership."
  - "Group-based assignment needs Microsoft Entra ID P1 or P2. Default Access satisfies the requirement when the app exposes no named role."
  - "Do not test with a Global Administrator, because the assignment requirement does not apply to that role."
faq:
  - q: "What causes AADSTS50105?"
    a: "Per Microsoft Learn, the enterprise application's service principal has Assignment required set to Yes, and the user has no app role assignment to the application."
  - q: "How do I fix it and keep access restricted?"
    a: "In the enterprise application select Users and groups, then Add user/group, choose the user or group, pick a role (Default Access if none is exposed) and select Assign."
  - q: "How do I allow everyone in the tenant?"
    a: "Open the application's Properties, set Assignment required to No and select Save. Learn warns that this broadens eligibility, and Conditional Access and app-specific authorization still apply."
  - q: "Does group membership count?"
    a: "Yes, if the group is assigned and the user is a direct member. Learn says to avoid relying on nested group membership."
  - q: "Why does it work for me as an admin?"
    a: "The assignment requirement does not apply to Global Administrators, so test with the affected user."
---

AADSTS50105 means the sign-in reached an enterprise application that requires user assignment, and the user has no assignment. You fix it by assigning the user or a group, or by turning off the requirement. Microsoft Learn describes both. This guide follows the Learn troubleshooting article for this error, plus the Learn page on assigning users and groups to an app.

## The error

When a user signs in to the application, they see: Error AADSTS50105 - The signed in user is not assigned to a role for the application. The check can apply to applications that use SAML, OpenID Connect, OAuth 2.0, WS-Federation or Application Proxy preauthentication.

## Why it happens

- The enterprise application's service principal has **Assignment required?** set to **Yes**.
- The user has no app role assignment to the application.

A user can get access in two ways: assigned directly, or through an assigned group where the user is a direct member. Learn says to avoid relying on nested group membership. The assignment page adds that nested group memberships are not currently supported and that assignment does not cascade to nested groups.

## Check the setting

1. Sign in to the Microsoft Entra admin center.
2. Go to **Entra ID** > **Enterprise apps** > **All applications**.
3. Select the application and then **Properties**.
4. Read **Assignment required?**.

The troubleshooting page spells the path as Microsoft Entra ID, while the assignment page says Entra ID. Use whatever your portal navigation shows.

## Who can make the change

- A role that can update the enterprise application's properties and app role assignments, such as Cloud Application Administrator or Application Administrator.
- Or an owner of the application's service principal.
- The assignment page also lists User Administrator among the roles.
- Group-based assignment needs Microsoft Entra ID P1 or P2.

## Fix 1: keep assignment required

Use this when access should stay limited to selected people.

1. In the enterprise application select **Users and groups**.
2. Select **Add user/group**.
3. On the **Add Assignment** pane, choose the user or group.
4. Select a role. If the application exposes none, select **Default Access**.
5. Select **Assign**.

Default Access satisfies the requirement when the app has no named role. It does not add a roles claim to the token. Assigning a user also adds the app to their My Apps portal.

## Fix 2: do not require assignment

Use this only if everyone authorized in the tenant should reach the app.

1. Open the application's **Properties**.
2. Set **Assignment required?** to **No**.
3. Select **Save**.

Learn warns that this broadens token eligibility to unassigned users and applications. Conditional Access and application-specific authorization still apply. Use it only if it matches your access policy.

## Verify

Test with the user who got the error. Do not test with a Global Administrator, because the assignment requirement does not apply to that role.

## Related error

Learn mentions AADSTS501051, an app-only assignment failure, and points to a page on restricting an app to a set of users. The full code list is on the authentication and authorization error codes page.

## Assign with Graph or PowerShell

The assignment page shows a Microsoft Graph call that posts to the appRoleAssignedTo endpoint of the resource service principal. It needs three identifiers: principalId, resourceId and appRoleId. The default role ID is all zeros. It lists the permissions Application.ReadWrite.All and AppRoleAssignment.ReadWrite.All. It also names cmdlets such as New-MgUserAppRoleAssignment and New-MgGroupAppRoleAssignment. Read that page before using them in production.

## What the pages do not say

- Minimum permissions for each step, beyond the named roles.
- Which role to choose when several are exposed.
- Whether nested groups are unsupported or only unreliable, since the two pages word it differently.
- How to read token claims or a specific sign-in to confirm the cause.
- The assignment page does not name the Assignment required setting or its location. The troubleshooting page does.

## A checklist

This list is practical advice.

1. Confirm the application name from the sign-in error.
2. Check Assignment required.
3. Check whether the user is assigned directly or is a direct member of an assigned group.
4. Assign the user or a group, or decide with the app owner that assignment is not required.
5. Ask the user to sign in again.

## Typical mistakes

- Adding a group and then relying on a user who is only in a nested group.
- Testing as a Global Administrator.
- Turning off Assignment required to silence the error, without considering who can then sign in.
- Assigning a group on a tenant without the P1 or P2 license.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Admin consent](https://www.m365.fm/entity/admin-consent/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)

## Sources

- [Error AADSTS50105 - The signed-in user isn't assigned to a role for the application (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/entra/entra-id/app-integration/error-code-aadsts50105-user-not-assigned-role)
- [Manage users and groups assignment to an application (Microsoft Learn)](https://learn.microsoft.com/entra/identity/enterprise-apps/assign-user-or-group-access-portal)
