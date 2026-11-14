---
title: "Assign Permission Sets and Granular Permissions in Business Central"
summary: "Create, copy and assign permission sets in Dynamics 365 Business Central: permission set types, Yes and Indirect levels, Include and Exclude, security groups, recording permissions, export and import, effective permissions and security cautions."
status: review
publish: false
author: mirko-p
date: 2026-12-26
topics: [dynamics-365-business-central]
keypoints:
  - "Access has two layers: the license-based entitlement and detailed permissions. Users need a license-based user and at least one permission set."
  - "Create a permission set from Search (Alt+Q) with Permission Sets, then New and Permissions. Set Read, Insert, Modify, Delete and Execute per object."
  - "Permission levels are Yes (direct, highest), Indirect (through a related object) and blank (no access). If a permission is in both an included and an excluded set, it is excluded."
  - "Use security groups to give one permission set to many users. User groups are the legacy alternative."
  - "Be careful with Insert or Modify on tables 9001 and 9003, because users could assign themselves to other groups."
faq:
  - q: "Where do I create a permission set?"
    a: "According to Microsoft Learn, select Search with Alt+Q, enter Permission Sets, choose the related link, then New. Choose Permissions to define the object permissions."
  - q: "What do the permission levels mean?"
    a: "Learn lists Yes as direct access and the highest rank, Indirect as access only through another related object the user has full access to, and blank as no ability to perform the action."
  - q: "How do I give a permission set to many users?"
    a: "Use security groups to assign or change one permission set for many users at once. The page links to user groups as a legacy alternative."
  - q: "How can I see what a user can really do?"
    a: "Open Effective Permissions from the user card. It shows permissions, the permission sets that grant them and security filters. Viewing other users' permissions requires the SECURITY or SUPER permission."
  - q: "What is risky about user group tables?"
    a: "Learn cautions about Insert or Modify on tables 9001 (User Group Member) and 9003 (User Group Permission Set), because users could assign themselves to other groups."
---

In Business Central, a user needs a license-based setup and at least one permission set before they can work. Permission sets then control which objects they can read, insert, modify, delete or execute. This guide follows the Microsoft Learn article on granular permissions.

## How access is built

Access has two layers: the license-based entitlement, which gives default permission sets per license type, and the detailed permissions you assign in Business Central. Learn says users must be created according to their license and assigned one or more permission sets before they can access the product. To change one permission set for many users, use security groups. User groups are the legacy alternative.

### Permission set types

- **System:** provided by Microsoft. If you copy one, you can turn on **Notify on Changed Permission Set**, which requires the *Original System permission set changed* notification on the **My Notifications** page.
- **User-Defined:** created by admins. Only these can be edited from the Effective Permissions page.
- **Extension:** can be added to other sets. The page does not describe them in detail.

### Permission levels

| Level | Meaning on the page |
| --- | --- |
| Yes | Direct access to perform the action on the object. Highest rank. |
| Indirect | Access only through another related object the user has full access to. Second highest. |
| Blank | The user cannot perform the action. Lowest rank. |

For included permissions or added sets, the exclude options are **Blank** (use the access level from the set's permission hierarchy), **Exclude** (remove the access level) and **Reduce to indirect**. If a permission is in both an included and an excluded set, it is excluded.

## Create a permission set

1. Select **Search** (`Alt`+`Q`), enter **Permission Sets** and choose the related link.
2. Choose **New** and fill in the new line.
3. Choose **Permissions**.
4. In the **Type** field choose **Include** or **Exclude**, then set Read, Insert, Modify, Delete and Execute.
5. Use **Object Type** and **Object ID** to select the object.
6. Optionally set a **Security Filter** for Table Data, or add other permission sets on the **Permission Sets** pane.

## Other procedures

- **Copy:** choose **Copy Permission Set**, name it and select a copy operation: **Copy by reference**, **Flat permission copy** or **Clone**.
- **Record permissions:** choose **Record Permissions**, then **Start**, perform the tasks, then **Stop** and confirm with **Yes**. Then set insert, modify or delete rights for each recorded table. Use the pop-out window or the same tab, or recording may not capture your actions.
- **Export and import:** use **Export Permission Sets** in the source tenant and **Import Permission Sets** in the target tenant. Select **Update existing permissions** to merge matching names. Otherwise matching sets are skipped.
- **Assign to a user:** use the **User Permission Sets** FastTab on the **User Card**, or the **Permission Set by User** action on the **Users** page.
- **Company scope:** leave **Company** blank to apply a set to all companies. To limit it, assign the set separately per company.

## Check what users can do

**Effective Permissions** from a user card shows permissions, the permission sets that grant them and security filters. Viewing other users' permissions requires the **SECURITY** or **SUPER** permission. **Permissions Overview** shows which sets and objects are linked and which users and security groups use each set.

## Cautions

- Changing a permission set affects every user assigned to it.
- Changes Microsoft makes to system permissions automatically update user-defined sets that include them.
- Entitlement values overrule lower-ranked values in other sets.
- **SUPER** removes detailed restrictions and grants access to everything the license allows.
- Use caution with Insert or Modify on tables 9001 (User Group Member) and 9003 (User Group Permission Set).
- Delegated admins appear in the Users list with pseudonymous names such as `User123456@partnerdomain.com`.

## More details from the page

- **Exclusions:** an exclusion applies only to the set being expanded. To re-include an excluded set, delete its line on the **Permission Sets** pane. The result pane shows **Partial** when something is excluded.
- **Remove Obsolete Permissions:** choose this action on the **Permission Sets** page to clean up.
- **Time constraints:** use **User Setup** to define posting periods, sign-in time logging and responsibility centers.
- **Higher-ranked values:** in non-entitlement sets they appear in brackets because they are ineffective.

## Not covered

The page does not cover security filter syntax, how to create security groups in depth, how license entitlement defaults are configured or the legacy user group procedures. It links to separate articles for those.

## Related

- [Dynamics 365 Business Central](https://www.m365.fm/entity/dynamics-365-business-central/)

## Sources

- [Assign permissions to users and groups](https://learn.microsoft.com/dynamics365/business-central/ui-define-granular-permissions)
