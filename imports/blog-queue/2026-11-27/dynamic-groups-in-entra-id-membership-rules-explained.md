---
title: "Dynamic Groups in Entra ID: Membership Rules Explained with Examples"
summary: "How dynamic membership groups work in Microsoft Entra ID: license and role requirements, rule syntax and operators, user and device rules, limits and common mistakes, with steps."
status: review
publish: false
author: mirko-p
date: 2026-11-27
topics: [entra-id, microsoft-365-groups]
keypoints:
  - "A dynamic group fills its membership from a rule on user or device attributes. Members cannot be added or removed manually."
  - "Dynamic membership needs Microsoft Entra ID P1 (or Intune for Education) for each unique user in dynamic groups. Devices need no license."
  - "Rules use the form property operator value. Rule text is limited to 3,072 characters and a tenant can have 15,000 dynamic groups."
  - "A rule cannot mix users and devices, and device rules can only reference device attributes."
  - "The rule builder handles up to five expressions. Use the text box for more, for -contains and for operator precedence."
  - "Create groups as at least a Groups Administrator in the Microsoft Entra admin center under Groups > All groups > New group."
faq:
  - q: "What license do dynamic groups need?"
    a: "According to Microsoft Learn, dynamic membership requires a Microsoft Entra ID P1 license or an Intune for Education license for each unique user who is a member of one or more dynamic groups. The licenses do not have to be assigned to those users, but the tenant must own enough to cover them. Devices in device-based dynamic groups need no license."
  - q: "Can I add a member to a dynamic group by hand?"
    a: "No. Microsoft Learn states that you cannot manually add or remove a member of a dynamic membership group. Membership comes only from the rule. If you need manual control, use an assigned group."
  - q: "What is the maximum size of a membership rule?"
    a: "Microsoft Learn states that the body of a membership rule cannot exceed 3,072 characters. A single tenant can have a maximum of 15,000 dynamic membership groups."
  - q: "Can a dynamic group contain both users and devices?"
    a: "Not in one rule. Microsoft Learn says you cannot create a rule that contains both users and devices. Security groups can contain either users or devices, and Microsoft 365 groups can contain only users."
---

A dynamic membership group in Microsoft Entra ID adds and removes members automatically based on a rule. You write a rule such as `user.department -eq "Sales"`, and everyone whose attribute matches becomes a member. This guide explains the syntax, the limits and the mistakes that cause rules to fail.

## Requirements first

- **License:** Microsoft Entra ID P1 or Intune for Education, for each unique user who is a member of one or more dynamic groups. Learn gives an example: 1,000 unique users across all dynamic groups need at least 1,000 licenses in the organization. Devices need no license.
- **Role:** at least Groups Administrator to create and manage these rules in the Microsoft Entra admin center.
- **Group types:** security groups can include users or devices. Microsoft 365 groups can include only users.
- **Not for role-assignable groups:** these require assigned membership, not dynamic.

## Create a dynamic group

1. Sign in to the Microsoft Entra admin center as at least a Groups Administrator.
2. Go to **Microsoft Entra ID** > **Groups** > **All groups** > **New group**.
3. Enter a name and description. Choose a **Membership type** for users or devices, then select **Add dynamic query**.
4. Build the rule in the rule builder, then **Save** and **Create**.

To change a rule later, open the group, select **Dynamic membership rules**, edit and save. Learn describes no separate validate button. Validation happens when you save, and the portal explains why an invalid rule cannot be processed.

## Rule syntax

A single expression is `<Property> <Operator> <Value>`, written as `object.property`:

```
user.department -eq "Sales"
```

Join expressions with `-and`, `-or` and `-not`:

```
(user.department -eq "Sales") -and -not (user.jobTitle -startsWith "SDE")
```

Operators include -eq, -ne, -startsWith, -endsWith, -contains, -notContains, -match, -notMatch, -in and -notIn. Operator precedence runs from the comparison operators, then -not, then -and, then -or. Use parentheses when you mix them.

Points from the Learn page that trip people up:

- Property names are case sensitive. Regex and string operations are not.
- `-contains` matches partial strings, not items in a collection. Microsoft advises minimizing `-match` and `-contains`.
- To compare with null, use `-eq null` or `-ne null`. Do not use `-not` for null.
- Escape double quotes with a backtick.
- For collections such as proxyAddresses, `-any` is satisfied by at least one matching item and `-all` requires every item. The underscore stands for the current item.

## Useful patterns

| Goal | Rule |
|---|---|
| Everyone in a department list | `user.department -in ["50001","50002","50003"]` |
| All users, including guests | `user.objectId -ne null` |
| Members only | `(user.objectId -ne null) -and (user.userType -eq "Member")` |
| Users with a given extension attribute | `(user.extensionAttribute15 -eq "Marketing")` |
| Direct reports of a manager | `Direct Reports for "<manager object ID>"` |
| All devices | `device.objectId -ne null` |
| Company-owned devices | `device.deviceOwnership -eq "Company"` |

Direct reports rules work only in the text box and cannot be combined with other rules. The manager is also added to the group.

Extension attributes 1 to 15 are string-only. Custom extension properties use `user.extension_[GUID]_[Attribute]`.

## Rule builder or text box

The rule builder supports up to five expressions and works only for user-based groups. Use the text box for more than five expressions, direct reports, `-contains` or `-notContains`, operator precedence and complex expressions. The builder does not change syntax or processing.

## Device rules

- Device rules cannot be mixed with user rules.
- Device rules can only reference device attributes, not attributes of the device owner.
- deviceTrustType values: AzureAD for joined, ServerAD for hybrid joined, Workplace for registered.
- organizationalUnit is no longer listed and should not be used.
- For Intune app and policy targeting, Learn recommends assignment filters. Dynamic groups fit non-Intune or cross-workload cases such as Conditional Access, licensing or Autopilot profile assignment.

## Limits

- 15,000 dynamic membership groups per tenant.
- 3,072 characters per rule body.
- Five expressions in the rule builder.
- Rules evaluate every user and device in the tenant, including stale ones. Clean up inactive users and devices before creating a rule.
- Agent identities (service principals) are not supported as members.

## Processing and status

Membership updates are event driven: when attributes of a user or device change, the system evaluates the rules for dynamic groups. The Learn pages read do not give a processing time. Check the group overview page for **Dynamic rule processing status**, which can show Evaluating, Processing, Update complete, Processing error, Update paused or Not started. A Groups Administrator can pause and resume processing.

## Security consideration

Microsoft advises auditing write permissions for every attribute you use in a rule, in Entra ID and at the source such as on-premises Active Directory. Restrict self-service write access to attributes used in security-sensitive groups. Membership follows these attributes, so whoever can write them influences who joins.

## Common mistakes

- Mixing user and device conditions in one rule.
- Mistyping property case, for example `user.Department`.
- Using `-not` to test for null.
- Using Microsoft 365 groups for devices.
- Expecting to add exceptions by hand.

## What the documentation does not say

The pages read do not state how many minutes a membership change takes, and they do not discuss nested groups. Test with a small rule and watch the processing status.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Microsoft 365 Groups](https://www.m365.fm/entity/microsoft-365-groups/)

## Sources

- [Dynamic membership groups in Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/identity/users/groups-dynamic-membership)
- [Create or update a dynamic membership group](https://learn.microsoft.com/en-us/entra/identity/users/groups-create-rule)
