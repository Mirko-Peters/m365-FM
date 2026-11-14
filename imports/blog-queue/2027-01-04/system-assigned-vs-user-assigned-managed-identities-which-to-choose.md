---
title: "System-Assigned vs User-Assigned Managed Identities: Which to Choose"
summary: "System-assigned vs user-assigned managed identities: lifecycle, sharing and role assignment differences, when Microsoft recommends each, and the caveats on token caching, orphaned roles and exposure."
status: review
publish: false
author: mirko-p
date: 2027-01-04
topics: [managed-identity, azure-rbac]
keypoints:
  - "System-assigned identities live and die with the resource. User-assigned identities are independent and can be shared by several resources."
  - "Learn says user-assigned identities are more efficient in a broader range of scenarios, for example rapid creation, replicated resources and access needed before deployment."
  - "Choose system-assigned when each resource needs its own identity and unique permissions, and when audit logs should name the specific resource."
  - "Managed identity tokens are cached per resource URI for about 24 hours, so group and role changes can take hours to apply."
  - "Deleting an identity does not delete its role assignments. Orphaned assignments show Identity not found and need manual cleanup."
faq:
  - q: "What is the main difference between the two types?"
    a: "According to Microsoft Learn, a system-assigned identity is created and deleted with the resource and belongs to one resource. A user-assigned identity has its own lifecycle, can be used by multiple resources and must be deleted manually."
  - q: "When does Microsoft recommend user-assigned identities?"
    a: "Learn lists rapid creation of ephemeral compute, replicated resources that need the same permissions, compliance with fewer identities to approve, and access needed before deployment. It says user-assigned identities are more efficient in a broader range of scenarios."
  - q: "When is system-assigned the better choice?"
    a: "Learn says to choose it when each resource needs its own identity and unique permissions, and the identity should be deleted with the resource. It also helps audit logging, because logs identify the specific resource rather than a shared identity."
  - q: "Why do permission changes take hours to apply?"
    a: "Learn says group and role membership are token claims, and managed identity tokens are cached per resource URI for about 24 hours. It adds that you cannot force a managed identity's token to be refreshed before expiry."
  - q: "Can anyone with code access misuse a managed identity?"
    a: "Learn says anyone who can run code on a resource can use all identities assigned to it. Restrict the roles that can install or run code on resources with managed identities, and grant only the permissions needed."
---

Choose a user-assigned managed identity when several resources share the same permissions, when you create many resources quickly, or when access must exist before the resource does. Choose a system-assigned identity when each resource needs its own identity and the identity should disappear with the resource. This guide follows the Microsoft Learn page on managed identity best practices.

## The two types side by side

| Aspect | System-assigned | User-assigned |
| --- | --- | --- |
| Lifecycle | Created and deleted with the resource | Independent of associated resources |
| Deletion | Automatic with the resource | Manual, even if no resources use it |
| Role assignments | Cannot be created in advance, so a deployment can fail if the deploying user lacks role-assignment rights | Can be configured before the resources that use them exist |
| Sharing | One identity per resource | Shared by multiple resources, including different types |
| Admin overhead | More identities and role assignments | Fewer of both |

A resource can have both a system-assigned identity and one or more user-assigned identities.

## When Learn points to each type

Learn states that user-assigned identities are more efficient in a broader range of scenarios.

| Scenario | Choice | Reason on the page |
| --- | --- | --- |
| Rapid creation of ephemeral compute | User-assigned | Creating many system-assigned identities quickly can hit the Microsoft Entra object creation rate limit (HTTP 429). One user-assigned identity creates one service principal |
| Replicated resources | User-assigned | Resources doing the same task usually need the same permissions, and they need not be the same type |
| Compliance | User-assigned | Fewer identities need approval |
| Access needed before deployment | User-assigned | A system-assigned identity may not exist in time |
| Audit logging by resource | System-assigned | Logs identify the specific resource instead of a shared identity |
| Permissions lifecycle | System-assigned | Permissions are removed with the resource |

Choose system-assigned when each resource needs its own identity and unique permissions, and the identity should be deleted with the resource.

## How many role assignments you save

Learn gives an example: four VMs accessing two storage accounts and a key vault need 8 role assignments with system-assigned identities, and 2 with one user-assigned identity. Security groups can reduce role assignments too, but Learn says that approach does not offer the same Resource Manager template capabilities as user-assigned identities.

## Limits and counting

The page gives no numeric limits and links to the managed identity limits and Azure RBAC limits. It does state:

- Creating many identities quickly can exceed the Entra object creation rate limit.
- A deleted system-assigned identity counts toward your limit until fully purged after 30 days.
- Role assignments must be deleted manually so the limit of role assignments per subscription is not exceeded.

## Caveats you should plan for

1. **Orphaned role assignments.** Deleting an identity does not delete its role assignments. They show Identity not found in the portal. Learn gives a PowerShell snippet that finds assignments with object type Unknown and removes them.
2. **Delayed authorization changes.** Managed identity tokens are cached per resource URI for about 24 hours, and you cannot force a refresh. Changes can take several hours. Human user tokens typically expire after 1 hour. As a mitigation, Learn suggests a user-assigned identity with permissions applied directly, instead of adding and removing identities from groups that hold permissions.
3. **Least privilege.** Extra permissions, such as Contributor on a subscription, increase the security blast radius.
4. **Code execution exposure.** Anyone who can run code on a resource can use all of its identities. Learn's example is a user without storage access who can run code in a Logic App whose managed identity has read and write access to the storage account, and so can read and write it. Users who can assign identities can also attach them to other resources.

The page does not discuss federation. It mentions that app roles can be assigned to managed identities.

## A decision flow

1. Do several resources need identical permissions? Choose user-assigned.
2. Will you create many short-lived resources? Choose user-assigned.
3. Do you need the identity before the resource exists? Choose user-assigned.
4. Does each resource need unique permissions that should vanish with it? Choose system-assigned.
5. Do you need logs that name the exact resource? Choose system-assigned.
6. Could the choice mix? A resource can have both.

## Typical mistakes

- Using system-assigned identities for hundreds of short-lived resources and hitting rate limits.
- Sharing one user-assigned identity widely with broad permissions.
- Forgetting to delete unused user-assigned identities and their role assignments.
- Expecting group membership changes to apply within minutes.

## Related

- [Managed identity](https://www.m365.fm/entity/managed-identity/)
- [Azure RBAC](https://www.m365.fm/entity/azure-rbac/)
- [Entra Workload ID](https://www.m365.fm/entity/entra-workload-id/)

## Sources

- [Managed identity best practice recommendations (Microsoft Learn)](https://learn.microsoft.com/entra/identity/managed-identities-azure-resources/managed-identity-best-practice-recommendations)
