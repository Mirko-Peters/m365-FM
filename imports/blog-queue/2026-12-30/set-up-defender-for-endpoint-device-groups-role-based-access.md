---
title: "Set Up Device Groups and Role-Based Access in Defender for Endpoint: What Learn Documents"
summary: "Plan role-based access control for Microsoft Defender for Endpoint using Microsoft Learn: the three-tier model, role and device group concepts, prerequisites and first-sign-in behavior, the unified RBAC notice for new customers, and the steps the overview page leaves to other articles."
status: review
publish: false
author: mirko-p
date: 2026-12-30
topics: [microsoft-defender-for-endpoint]
keypoints:
  - "From February 16, 2025, new Defender for Endpoint customers only have access to unified role-based access control (URBAC). Existing customers keep their current roles."
  - "RBAC has two controls: who can take specific actions through custom roles, and who can see information on specific device groups, assigned through Entra user groups."
  - "Turning on RBAC removes access for read-only users such as Security Reader until they are assigned to a role. After opting in you cannot revert to the first-login model."
  - "Learn recommends roles with the fewest permissions and limiting Global Administrator to emergencies."
  - "The overview has no click steps. The device groups article gives them, with up to 2,000 device groups per tenant and rank 1 as the highest priority."
faq:
  - q: "Do new customers use this RBAC model?"
    a: "According to Microsoft Learn, starting February 16, 2025 new Defender for Endpoint customers only have access to unified RBAC. Existing customers keep their current roles and permissions."
  - q: "Who gets access before RBAC is configured?"
    a: "Users with the Entra Security Administrator role get full access on first sign-in, and users with Security Reader get read-only access."
  - q: "What do device groups do?"
    a: "You create device groups by criteria such as names, tags and domains, then grant a role access to them using a specific Entra user group. Learn says device group creation is supported in Plan 1 and Plan 2."
  - q: "Who can create the first roles?"
    a: "Only Entra Global Administrator or Security Administrator users can initially create and assign roles, so have the Entra groups ready beforehand."
  - q: "What tiers does Learn describe?"
    a: "Tier 1 local security operations or IT, Tier 2 regional security operations with remediation, and Tier 3 global security operations with all actions."
---

Defender for Endpoint lets you split access by task and by device. This guide follows the Microsoft Learn overview of role-based access control and the Learn article on device groups. The overview describes the model and prerequisites, and the device groups article gives the portal steps.

## Important notice: unified RBAC

Learn states that starting February 16, 2025, new Defender for Endpoint customers only have access to unified role-based access control (URBAC), and existing customers keep their current roles and permissions. It points to the URBAC documentation for details. If you are a new customer, the model below is therefore mainly relevant for understanding existing tenants.

## The model

RBAC lets you create roles and groups in your security operations team to grant access to the Microsoft Defender portal, with fine-grained control over what users see and do. Learn recommends roles with the fewest permissions and limiting Global Administrator to emergency scenarios.

Tier model from the page:

| Tier | Description |
| --- | --- |
| Tier 1 | Local security operations or IT team, triages and investigates alerts in its geolocation and escalates when active remediation is needed |
| Tier 2 | Regional security operations team, sees all devices for its region and performs remediation actions |
| Tier 3 | Global security operations team, authorized to see and do everything in the portal |

Tier 0 assets should use Privileged Identity Management for finer control.

## Two controls

1. **Who can take specific actions:** create custom roles and control which Defender for Endpoint capabilities they can use.
2. **Who can see information on specific device groups:** create device groups by criteria such as names, tags and domains, then grant role access to them through a specific Microsoft Entra user group.

The implementation steps on the page are to define admin roles, assign permissions to them and assign Entra user groups to the roles.

## Before you begin

- Users with the Entra Security Administrator role get full access on first sign-in. Users with Security Reader get read-only access.
- A Defender for Endpoint Global Administrator has unrestricted access to all devices regardless of device group membership and Entra group assignments.
- Only Entra Global Administrator or Security Administrator users can initially create and assign roles, so prepare the Entra groups first.
- Turning on RBAC removes access for read-only users, for example Security Reader, until they are assigned to a role.
- Users with administrator permissions are automatically assigned the built-in Defender for Endpoint Global Administrator role. You can add non-admin users later.
- After opting in you cannot revert to the first-login access model.

The page applies to Defender for Endpoint Plan 1 and Plan 2.

## Planning suggestion

This section is a suggestion, not Microsoft guidance. Map your tiers to Entra groups before you touch the portal, decide which device naming, tag or domain criteria define each region, and list which users currently rely on read-only access, because they will lose it when you turn RBAC on.

## Create a device group

The device groups article (Plan 1 and Plan 2) gives these steps. You can only grant access to Entra user groups that already have RBAC roles assigned.

1. In the Microsoft Defender portal go to **Settings**, **Endpoints**, **Permissions**, **Device groups**, or open `https://security.microsoft.com/securitysettings/endpoints/machine_groups`.
2. Select **Add device group**.
3. On **General** enter a unique name and choose a remediation level: No automated response, Semi with approval for all folders, for non-temporary folders or for system folders, or Full remediation. A description is optional.
4. On **Devices** define the matching rule with device name, domain, tags and OS platform. Devices that match all specified conditions join the group.
5. On **Preview devices** select **Show preview** to see up to 10 matching devices.
6. On **User access** assign the user groups that may access the device group, then **Submit**.

## Rank, defaults and limits

- Groups have a rank, and rank 1 is the highest. A device that matches several groups is added only to the highest-ranked one.
- If you assign no Entra groups, the device group is accessible to all users with portal access.
- Devices that match no group fall into **Ungrouped devices (default)**. You cannot change its rank or delete it, but you can change its remediation level and its user access.
- Up to 2,000 device groups per tenant, and up to 10 values per property type for tags, names and domains. Rows of the same type use OR, and different condition types must all match.
- Changes can take several minutes, and in some environments several hours, to propagate.
- Deleting a group removes it from email notification rules, and a rule that referenced only that group is deleted.

## Not covered

The overview does not give permission names, limits on roles, or the opt-in steps. The device groups page does not list valid OS platform values or a limit on devices per group. Use Learn's URBAC article for the unified model.

## Related

- [Microsoft Defender for Endpoint](https://www.m365.fm/entity/microsoft-defender-for-endpoint/)

## Sources

- [Manage portal access using role-based access control](https://learn.microsoft.com/defender-endpoint/rbac)
- [Create and manage device groups](https://learn.microsoft.com/defender-endpoint/machine-groups)
