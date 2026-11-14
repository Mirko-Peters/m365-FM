---
title: "Power BI Dynamic Row-Level Security with an Organizational Hierarchy"
summary: "How to build dynamic RLS for manager hierarchies in Power BI with USERPRINCIPALNAME, PATH and PATHCONTAINS, plus testing, role assignment and the documented limits such as DirectQuery and workspace roles."
status: review
publish: false
author: mirko-p
date: 2026-12-07
topics: [power-bi, row-level-security, dax]
keypoints:
  - "Dynamic RLS uses USERPRINCIPALNAME() or USERNAME() with a user-mapping table, so one role filters differently for each user."
  - "PATH builds a delimited string of all managers above an employee. PATHCONTAINS checks whether a person is in that chain."
  - "PATH and PATHCONTAINS are not supported in DirectQuery mode when used in calculated columns or RLS rules."
  - "RLS only restricts Viewers. Admin, Member and Contributor roles in the workspace are not filtered."
  - "Only Microsoft Entra security groups, distribution groups and mail-enabled groups can be role members. Microsoft 365 groups cannot."
faq:
  - q: "What does PATH return?"
    a: "According to Microsoft Learn, PATH returns a delimited text string with the identifiers of all parents of the current identifier, starting with the oldest. The delimiter is the vertical bar. The ID and parent columns must be text or integer and of the same type."
  - q: "Does PATHCONTAINS work in DirectQuery RLS rules?"
    a: "No. Microsoft Learn states that PATH and PATHCONTAINS are not supported in DirectQuery mode when used in calculated columns or row-level security rules."
  - q: "Who is subject to RLS in a workspace?"
    a: "Microsoft Learn says RLS only restricts data access for users with Viewer permissions. It does not apply to workspace Admin, Member or Contributor roles, because they have edit permission for the semantic model. Viewers with Build permission are still restricted."
  - q: "Which groups can be added to an RLS role?"
    a: "Learn lists distribution groups, mail-enabled groups and Microsoft Entra security groups. It states that Microsoft 365 groups are not supported and cannot be added to any RLS role, and that service principals cannot be added either."
  - q: "How should I test an RLS role?"
    a: "Use Test as role in the Power BI service, or View as in Desktop, and test for expected and unexpected values. Learn also suggests adding a measure such as Who Am I = USERNAME() to a card visual to see which identity the model receives."
---

Dynamic row-level security (RLS) for an organizational hierarchy lets a manager see their own rows and the rows of everyone below them, using one role for the whole company. The building blocks are a user-to-employee mapping, the DAX functions PATH and PATHCONTAINS, and a filter on the employee table that propagates to the fact tables. Microsoft documents each block. The complete rule below is a composition of them, so test it with your own data.

## What Microsoft documents

- Dynamic RLS is the most common approach, because one role definition filters data differently per user based on a user-mapping table in the model. The page shows `[UserEmail] = USERPRINCIPALNAME()` as the typical rule.
- In Power BI Desktop, `USERNAME()` returns `DOMAIN\User` and `USERPRINCIPALNAME()` returns `user@contoso.com`. In the Power BI service, both return the user principal name.
- PATH returns "a delimited text string with the identifiers of all the parents of the current identifier". The page's example is an Employee table with `PATH(Employee[EmployeeKey], Employee[ParentEmployeeKey])`.
- PATHCONTAINS returns TRUE if an item exists in a path.

PATH rules from Learn worth knowing: values in the parent column must exist in the ID column, a blank parent returns the ID itself, duplicate IDs with different parents cause an error, and an ID containing the vertical bar causes an error.

## Step 1: Prepare the employee table

The table needs a unique ID column, a parent (manager) ID column and a column holding the user principal name. Both ID columns must have the same data type, text or integer.

Create a calculated column:

```dax
Path = PATH(Employee[EmployeeKey], Employee[ParentEmployeeKey])
```

Each row now holds the chain of managers from the top down to the employee.

## Step 2: Relate the employee table to the facts

Learn recommends filters on dimension tables rather than fact tables, relying on relationships for propagation. It also warns that RLS filters propagate only through active relationships and advises avoiding `LOOKUPVALUE` when relationships can do the same job. Relate Employee to the fact table, for example sales by salesperson, with a single-direction filter from Employee to the facts.

## Step 3: Define the role

In Power BI Desktop select **Modeling** > **Manage roles** > **New**. Name the role without a comma. Select the Employee table and switch to the DAX editor. A rule built from the documented functions:

```dax
PATHCONTAINS(
    Employee[Path],
    LOOKUPVALUE(
        Employee[EmployeeKey],
        Employee[UserPrincipalName], USERPRINCIPALNAME()
    )
)
```

Read it from the inside. The lookup finds the key of the signed-in person. PATHCONTAINS then returns TRUE for every employee whose manager chain includes that key. The person's own row is included because PATH ends with the current ID. This is the one place where `LOOKUPVALUE` is hard to avoid, because the mapping happens inside the rule. Learn's advice to measure the impact with and without RLS applies here, so compare query times with View as.

Two cautions. The Learn pages say PATH and PATHCONTAINS are not supported in DirectQuery mode in calculated columns or RLS rules, so this pattern needs Import mode. And a user with no matching UPN gets no rows, which Learn lists as a common cause of empty reports (missing, misspelled or changed UPNs).

## Step 4: Handle people in several hierarchies

Learn says users mapped to several roles get additive filters. There is no "once denied, always denied". If an executive group needs full access, a second role with `TRUE()` gives it, but anyone in both roles sees everything. Prefer one role per user's full set of permissions.

The same page warns against unsafe dynamic rules. An `IF(USERNAME() = "Worker", filter, TRUE())` rule returns all rows for a misspelled value, so end the logic with an explicit `FALSE()`.

## Step 5: Assign members in the service

You cannot assign users in Desktop. In the Power BI service, publish the model, open the semantic model's **Security** and add members to the role. Learn lists what can be added:

- Distribution groups
- Mail-enabled groups
- Microsoft Entra security groups
- Individual users, including users external to the organization

Microsoft 365 groups are not supported and groups created in Power BI cannot be added. Service principals cannot be added to an RLS role, which means RLS is not applied for apps that use a service principal as the final identity. Learn recommends mapping security groups to roles where possible.

Only semantic model owners or workspace admins can add members to roles according to the guidance page, and Contributors or higher see the **Security** option according to the service page.

## Step 6: Test

1. In the service, select **More options** (...) next to the role and choose **Test as role**.
2. Use **Now viewing as** to test a specific person or a combination of roles.
3. Add a `Who Am I = USERNAME()` measure to a card to see the identity the model uses.

Test as role does not work for DirectQuery models with SSO enabled or for paginated reports, and dashboards are not available for testing.

## Who is not filtered

RLS only restricts Viewers. Admin, Member and Contributor roles have edit permission on the semantic model, so RLS does not apply to them. To enforce RLS for people in a workspace, assign them the Viewer role. Learn's guidance page adds that content consumers and creators should hold only Read permission on the underlying semantic model when RLS must be enforced.

## Performance and design notes

- RLS applies filters to every DAX query. Measure with and without it, using View as.
- The option **Apply security filter in both directions** can hurt performance in models with many relationships. Learn says to test before production.
- RLS filters rows, not columns or measures. For columns, Learn points to object-level security.
- For simple static audiences, separate semantic models can be faster, at the price of duplicated content.

## Typical mistakes

- Using the pattern on a DirectQuery model.
- Testing only as the model owner, who is not filtered.
- Forgetting that a changed email address breaks the mapping.
- Adding a Microsoft 365 group to a role and expecting it to work.

## Related

- [Power BI](https://www.m365.fm/entity/power-bi/)
- [Row-level security (RLS)](https://www.m365.fm/entity/row-level-security/)
- [DAX](https://www.m365.fm/entity/dax/)

## Sources

- [Row-level security (RLS) with Power BI (Microsoft Learn)](https://learn.microsoft.com/en-us/fabric/security/service-admin-row-level-security)
- [Row-level security guidance in Power BI Desktop (Microsoft Learn)](https://learn.microsoft.com/en-us/power-bi/guidance/rls-guidance)
- [PATH function (DAX) (Microsoft Learn)](https://learn.microsoft.com/en-us/dax/path-function-dax)
- [PATHCONTAINS function (DAX) (Microsoft Learn)](https://learn.microsoft.com/en-us/dax/pathcontains-function-dax)
