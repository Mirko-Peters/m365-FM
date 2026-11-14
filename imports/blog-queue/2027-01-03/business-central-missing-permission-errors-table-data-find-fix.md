---
title: "Business Central Missing Permission Errors on Table Data: Find and Fix the Gap"
summary: "Find and fix missing permission errors in Business Central: how Read, Insert, Modify, Delete and Execute levels work, indirect permission, Effective Permissions, permission sets and record permissions."
status: review
publish: false
author: mirko-p
date: 2027-01-03
topics: [dynamics-365-business-central]
keypoints:
  - "Permissions have five types: Read, Insert, Modify, Delete and Execute. Each can be blank, Indirect or Yes."
  - "Indirect permission lets a user use an object only through another object, for example posting through a codeunit without direct access to the table."
  - "Use the Effective Permissions page on the user card to see which permission sets grant a permission. Only users with SECURITY or SUPER can see other users' effective permissions."
  - "Record Permissions captures the permissions needed for a task while you perform it, then adds them to a permission set."
  - "Editing a permission set changes it for every user who has it. The page documents no specific error message lookup."
faq:
  - q: "How do I see which permissions a user effectively has?"
    a: "According to Microsoft Learn, open the user card and choose Effective Permissions. The Permissions part lists accessible objects and the By Permission Set part shows the granting sets, source and type. Only users assigned SECURITY or SUPER can view other users' effective permissions."
  - q: "What is indirect permission?"
    a: "Learn says indirect permission lets a user use an object only through another object. Its example is a user with Indirect permission on table 37 Sales Line who can post through codeunit 80 Sales-Post but cannot modify Sales Line by other methods."
  - q: "How can I capture the permissions needed for a task?"
    a: "Learn describes Record Permissions. Create a permission set, choose Permissions, then Record Permissions and Start, perform the tasks, choose Stop and Yes to add the recorded permissions, then specify insert, modify and delete rights for each object."
  - q: "What happens if a permission is in an included and an excluded set?"
    a: "Learn says it is excluded. It also says entitlement permissions from the license override lower-ranked values, and overridden values appear in brackets."
  - q: "Is it safe to edit a permission set?"
    a: "Editing affects every user assigned to that set, according to Learn. Only User-Defined sets are editable on Effective Permissions. Learn also advises caution with Insert or Modify on tables 9001 User Group Member and 9003 User Group Permission Set."
---

When Business Central reports a missing permission on table data, find which object the user lacks access to, see which permission sets already grant what, and then add the smallest change to a user-defined permission set. Microsoft Learn documents the permission model and the tools for this in the page on granular permissions. That page does not describe a specific error message lookup procedure, so this article works from the tools it does describe.

## The permission model

Permission types are **Read**, **Insert**, **Modify**, **Delete** and **Execute**. Each access level is one of:

- **Blank:** the user cannot perform the action on the object.
- **Indirect:** the user can perform the action only through a related object that they have full access to.
- **Yes:** the user can perform the action on the object.

Indirect ranks below Yes and above Blank in Learn's ordering, so a Yes overrides it.

### Why indirect permission matters

Learn gives this example. A user with Indirect permission on table 37, Sales Line, can post through codeunit 80, Sales-Post, but cannot modify Sales Line by other methods. If the permission needed by the codeunit is missing, the codeunit cannot complete its tasks and the user gets an error. That is a typical source of missing-permission errors on table data: the user can start the task but lacks a permission on something it touches.

## Step 1: See what the user effectively has

1. Open the user card and choose **Effective Permissions**.
2. In the **Permissions** part, find the object. This lists objects the user can access.
3. In the **By Permission Set** part, see the permission sets that grant access, with source and type. Selecting a row shows which sets grant that permission.

Only users assigned **SECURITY** or **SUPER** can view other users' effective permissions. Other places to look:

- **Permission Set by User**, from the **Users** page, shows which users have each set. Select **All Users** to assign a set to everyone.
- **Permission Sets by Security Group**, from **Security Groups**, shows the sets and individual permissions per group.

## Step 2: Choose where to fix it

Learn says only **User-Defined** permission sets are editable on **Effective Permissions**. Editing a set changes it for every user who has it. So decide whether the gap belongs to one role or to everyone with that set. If the existing set is shared, create a new set or copy one rather than editing a shared one.

## Step 3: Create or change a permission set

1. Search for **Permission Sets** (Alt+Q) and choose the related link.
2. Choose **New** and fill in the fields, then choose **Permissions**.
3. On the **Permission Set** page, set **Type** to **Include** or **Exclude**, set the access levels, then set **Object Type** and **Object ID**. The placeholder defaults, **Table Data** and **0**, are not used.
4. Optionally set a **Security Filter** for Table Data objects.
5. Optionally add other permission sets on the **Permission Sets** pane.

Copy options: **Copy by reference** keeps the original and added sets listed on **Results**, **Flat permission copy** creates a single flat list, and **Clone** makes an exact copy.

## Step 4: Record the permissions a task needs

When you cannot tell which objects a task touches, record them:

1. Create the new permission set, choose **Permissions**, then **Record Permissions** > **Start**.
2. Perform the tasks to capture, then choose **Stop**.
3. Choose **Yes** to add the recorded permissions.
4. For each object, specify the insert, modify and delete rights.

Review the recorded list before you assign it. Recording captures what the task used, so trim anything broader than the role needs.

## Rules that explain surprising results

- **Entitlement** (license) permissions override lower-ranked values. Overridden values appear in brackets.
- If a permission is in both an included set and an excluded set, it is excluded.
- Excluding a whole set creates an **Excluded** line. Delete it to include the set again.
- A **Blank Company** on an assignment applies to all companies.
- **SUPER** imposes no restriction beyond the license.
- System permissions added to a user-defined set update automatically when Microsoft changes them.
- Learn warns about Insert or Modify on tables 9001 User Group Member and 9003 User Group Permission Set, because users could assign themselves to other groups.

## Clean up

On the **Permission Sets** page, **Remove Obsolete Permissions** cleans up obsolete permissions across all sets. If you import permission sets and **Update existing permissions** is unchecked, sets with matching names are skipped and reported.

## A routine for each report

1. Note the object named in the error and the action: read, insert, modify, delete or execute.
2. Open **Effective Permissions** for the user and find that object.
3. Check whether Indirect applies and which related object is missing.
4. Add the smallest permission in a user-defined set, or use **Record Permissions** and trim.
5. Test with the user and review other users of the same set.

## Typical mistakes

- Editing a shared set and changing access for everyone.
- Granting SUPER to make an error go away.
- Forgetting that an excluded permission wins over an included one.
- Giving Insert or Modify on the user group tables.

## Related

- [Dynamics 365 Business Central](https://www.m365.fm/entity/dynamics-365-business-central/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)

## Sources

- [Define granular permissions in Business Central (Microsoft Learn)](https://learn.microsoft.com/dynamics365/business-central/ui-define-granular-permissions)
