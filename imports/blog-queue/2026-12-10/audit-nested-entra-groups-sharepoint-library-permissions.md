---
title: "Audit nested Entra security groups behind SharePoint library permissions"
summary: "How to check whether nested Microsoft Entra security groups and broken inheritance explain unexpected SharePoint access, what Microsoft documents about nesting limits, and where the documentation contradicts itself."
status: review
publish: false
author: mirko-p
date: 2026-12-10
topics: [sharepoint-permissions, microsoft-entra, sharepoint-document-libraries, microsoft-graph-powershell]
keypoints:
  - "Microsoft's pages disagree: a Learn Q&A answer says nested security groups work for SharePoint permissions, while the Entra page says nested groups do not gain the parent's access."
  - "Nesting is documented only for security groups. Microsoft 365 groups cannot contain other groups, and groups cannot be added to groups synced from on-premises Active Directory."
  - "Learn states SharePoint Online allows up to 2,047 security groups per user including indirect membership. Past that, authentication and search results can become unpredictable."
  - "Graph's transitiveMembers returns a flat list of all nested members, which makes it the right tool for an audit."
  - "Broken inheritance and nested groups are separate causes. Check unique permissions on the library, folders and items before blaming the groups."
faq:
  - q: "Do nested Entra security groups give SharePoint access to the members of the child group?"
    a: "The sources I read disagree. A Learn Q&A answer says you can add a nested group to SharePoint site permissions if both are security groups and that all nested members then have access. The Microsoft Entra page on managing groups says nested groups do not gain access to shared resources and applications assigned to the parent group. Test the exact setup in a non-production site before relying on it."
  - q: "Which group types can be nested?"
    a: "Learn says nesting is for security groups. It lists unsupported cases: adding groups to a group synced from on-premises Active Directory, adding security groups to Microsoft 365 groups, adding Microsoft 365 groups to other groups, and adding distribution groups."
  - q: "Is there a limit on group membership that affects SharePoint?"
    a: "Yes. Microsoft Entra limits documentation says a SharePoint Online user can be part of up to 2,047 security groups in total, including direct and indirect membership. Past that limit, authentication and search results can become unpredictable."
  - q: "How do I list every user behind a nested group?"
    a: "Learn describes GET /groups/{id}/transitiveMembers in Microsoft Graph. It is transitive and returns a flat list of all nested members. The least privileged permission is GroupMember.ReadBasic.All."
  - q: "How do I find items in a library that no longer inherit permissions?"
    a: "Microsoft Support says that if a list has items with unique permissions, the Permissions page shows a message. Select Show these items to open the Exceptions dialog. A list or library over 100,000 items cannot have inheritance broken or restored on the list itself."
---

If a SharePoint library shows people with access that the group list does not explain, there are two separate things to check: how nested Entra security groups resolve to users, and where inheritance was broken. Microsoft's documentation does not give one clear answer on whether nested groups work for SharePoint permissions, so the audit has to verify the real behavior in your tenant.

## What the documentation says about nesting

Microsoft Learn offers two statements that do not fit together.

A Learn Q&A answer says nested groups can be added to SharePoint site permissions, as long as both groups are security groups. The same answerer confirmed that all members of the nested groups then have access. The page does not state the answerer's employer, so treat it as community-level guidance.

The Microsoft Entra page on managing groups says nested groups can be used for membership and Conditional Access scopes, and that "nested groups don't gain access to shared resources and applications that are assigned to the parent group." The service limits page also lists app role assignment as unsupported for nested groups. Neither page names SharePoint.

Do not resolve this by assumption. Create a test security group, nest it in a group used on a test site, and sign in as a member of the child group.

## Group types and limits that matter

Learn lists these nesting scenarios as unsupported:

- Adding groups to a group synced with on-premises Active Directory.
- Adding security groups to Microsoft 365 groups.
- Adding Microsoft 365 groups to security groups or other Microsoft 365 groups.
- Adding distribution groups in nesting scenarios.
- Adding groups as members of a role-assignable group.
- Assigned membership to shared resources and apps for nested security groups, and applying licenses to nested security groups (also on the Entra page).

Microsoft's limits page adds one SharePoint-specific number. A user can be part of up to 2,047 security groups in total, including direct and indirect membership, and past that limit "authentication and search results can become unpredictable." My own inference: deep nesting inflates indirect membership quickly, so this could be a cause of odd behavior for users in many groups. The page states no maximum nesting depth.

## Step 1: Expand the group to real users

List who is behind a group with Microsoft Graph. The `transitiveMembers` endpoint "returns a flat list of all nested members":

```http
GET https://graph.microsoft.com/v1.0/groups/{id}/transitiveMembers
```

The least privileged permission is `GroupMember.ReadBasic.All`. To count only child groups, Learn gives this example, which needs the `ConsistencyLevel: eventual` header and `$count`:

```http
GET https://graph.microsoft.com/v1.0/groups/{id}/transitiveMembers/microsoft.graph.group?$count=true
```

Calling the cast on a Microsoft 365 group returns a 400 error because Microsoft 365 groups cannot have other groups as members. For PowerShell, the same page shows `Get-MgGroupTransitiveMember -GroupId $groupId` for the full list and `Get-MgGroupTransitiveMemberAsGroup -GroupId $groupId -CountVariable CountVar -ConsistencyLevel eventual` for the group-only cast.

Compare the flat list with the people who actually reach the library. My own diagnostic reading, not a Microsoft statement: a user in the list but without access suggests nesting does not resolve in SharePoint. A user with access but not in the list points to other routes: a direct permission, a sharing link or an item-level grant.

## Step 2: Find where inheritance is broken

Group analysis is useless if the library inherits nothing from the site. In a library, go to **Settings** > **Library settings** > **Permissions for this document library**. Microsoft Support says that if the library contains items with unique permissions, the page shows a message. Select **Show these items** to open the **Exceptions** dialog, where owners can use **Manage permissions** per item.

Keep these documented behaviors in mind:

- Sharing an item breaks inheritance for that item automatically, and the inherited permissions are copied to it. Later parent changes do not apply to that item.
- **Delete unique permissions** restores inheritance for the library or list.
- A list, library or folder with more than 100,000 items cannot have inheritance broken or restored on itself.
- Removing a user or group on the parent also removes access from child items with broken inheritance and cannot be restored.
- Microsoft says breaking inheritance is supported in reasonable use but not recommended, and suggests managing team site permissions through the associated Microsoft 365 group.

## Step 3: Decide what to change

| Finding | Likely action |
|---|---|
| Child-group members have no access | Add the child group directly to the SharePoint permission, or flatten the nesting |
| Users exceed the 2,047-group limit | Reduce group count and nesting for those users |
| Many items with unique permissions | Review the Exceptions list and restore inheritance where there is no reason for it |
| Access from a Microsoft 365 group | Remember Microsoft 365 groups cannot contain groups, so look for direct members |

My own suggestion: flattening is the conservative option because it does not depend on the unresolved documentation question.

## Typical mistakes

- Assuming the group list is the full access list. Sharing links and item-level grants are separate.
- Nesting a Microsoft 365 group or a distribution group and expecting it to work.
- Checking one site and forgetting that the same groups may be used in many libraries.
- Restoring inheritance on a library without first noting which exceptions were intentional.

## Related

- [SharePoint permissions](https://www.m365.fm/entity/sharepoint-permissions/)
- [Microsoft Entra](https://www.m365.fm/entity/microsoft-entra/)
- [SharePoint document libraries](https://www.m365.fm/entity/sharepoint-document-libraries/)
- [Microsoft Graph PowerShell](https://www.m365.fm/entity/microsoft-graph-powershell/)

## Sources

- [Manage groups in Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/fundamentals/how-to-manage-groups)
- [Microsoft Entra service limits and restrictions](https://learn.microsoft.com/en-us/entra/identity/users/directory-service-limits-restrictions)
- [List group transitive members](https://learn.microsoft.com/en-us/graph/api/group-list-transitivemembers?view=graph-rest-1.0)
- [Edit permissions for a list, library, folder or item](https://support.microsoft.com/en-us/office/edit-permissions-for-a-list-library-folder-or-item-02d770f3-59eb-4910-a608-5f84cc297782)
- [Microsoft Q&A: Are nested groups inside Azure Active Directory working in SharePoint Online](https://learn.microsoft.com/en-us/answers/a/726447)
