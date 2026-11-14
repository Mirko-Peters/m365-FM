---
title: "How to Set Object-Level Security in Power BI to Hide Tables and Columns"
summary: "Set object-level security in a Power BI semantic model with TMDL view or Tabular Editor to hide tables and columns from viewers: steps, role assignment, who is exempt, unsupported features and gaps."
status: review
publish: false
author: mirko-p
date: 2027-01-07
topics: [power-bi, row-level-security]
keypoints:
  - "Object-level security (OLS) secures tables or columns and also hides object names and metadata from restricted users. It is defined in model roles, like row-level security."
  - "Set metadataPermission to none on a table or column in TMDL view, or set the table or column permission to None in Tabular Editor."
  - "After publishing, open Security from the semantic model's More options menu and assign members or groups to the roles."
  - "OLS applies only to Viewers. Workspace Admin, Member and Contributor roles have Edit permission on the model, so OLS does not apply to them."
  - "Models with OLS are not supported with Quick insights, Smart narrative visualizations or the Excel Data Types gallery."
faq:
  - q: "What does object-level security do?"
    a: "According to Microsoft Learn, it lets model authors secure specific tables or columns from report viewers and also restricts object names and metadata. For a user without permission, the secured objects effectively do not exist."
  - q: "How do I set it?"
    a: "Define it in a model role. In TMDL view, write a createOrReplace script that sets metadataPermission to none on a table or column. In Tabular Editor, set the table or column permission to None. Then publish and assign members to the role."
  - q: "Who is not affected by OLS?"
    a: "Learn says OLS applies only to Viewers. Workspace members with the Admin, Member or Contributor role have Edit permission on the semantic model, so OLS does not apply to them."
  - q: "What does a restricted user see?"
    a: "Visuals that use a secured field show an error saying the field cannot be found, or that the column cannot be found or may not be used in this expression."
  - q: "Which features are unsupported with OLS?"
    a: "Quick insights visualizations, Smart narrative visualizations and the Excel Data Types gallery."
---

Object-level security (OLS) lets you hide a table or a column from report viewers so completely that it looks as though it does not exist. You define it in a role on the semantic model, publish the model and assign members to the role. This guide follows the Microsoft Learn page on object-level security in Power BI and Fabric.

## What OLS does

OLS secures specific tables or columns from report viewers. It can also restrict object names and metadata, so restricted users cannot discover sensitive fields such as employee or financial records. For a user without permission, the secured objects effectively do not exist.

## Prerequisites

- OLS is defined within model roles, the same mechanism as row-level security (RLS). The page links to the RLS section for creating roles and rules in Power BI Desktop.
- You author the model in Power BI Desktop and use either **TMDL view** or **Tabular Editor**. Tabular Editor is an external tool and must be installed separately if it does not appear on the **External tools** ribbon.
- You publish the model to the Power BI service, where you assign members to roles.

## Option A: TMDL view

1. Open **TMDL view** and create a new script tab.
2. Write a `createOrReplace` script with a role and a `metadataPermission` on a table or column. `none` enforces OLS and hides the object from the role. `read` makes it visible.

Secure a whole table:

```text
createOrReplace

    role CategoriesOLS
        modelPermission: read

        tablePermission Customers
            metadataPermission: none
```

Secure one column:

```text
createOrReplace

    role CategoriesOLS
        modelPermission: read

        tablePermission Customers
            columnPermission Address
                metadataPermission: none
```

3. Select **Preview** to review the changes, then **Apply** to run the script.
4. Publish the model to the Power BI service.
5. In the service, select **More options (...)** on the semantic model, open **Security** and assign members or groups to the roles.

## Option B: Tabular Editor

1. In Power BI Desktop, build the model and create the roles.
2. On the **External tools** ribbon, select **Tabular Editor**. It connects to the model automatically.
3. In **Model** view, expand **Roles** and select a role.
4. Expand **Table Permissions** and set the table or column permission to **None** or **Read**.
5. Save the role definitions and publish the model from Power BI Desktop.
6. In the service, open **Security** from the semantic model's **More options (...)** menu and assign members or groups.

## What restricted users see

Visuals that use a secured field show an error. The error says the field cannot be found, or that the column cannot be found or may not be used in this expression. Plan reports so that restricted audiences do not rely on those fields.

## Limits and restrictions

- **Who is exempt:** OLS applies only to Viewers. Workspace members with the Admin, Member or Contributor role have Edit permission on the semantic model, so OLS does not apply to them.
- **Unsupported features:** a model with OLS on one or more tables or columns does not support Quick insights visualizations, Smart narrative visualizations or the Excel Data Types gallery.
- **Other restrictions:** the page links to the Azure Analysis Services documentation for further OLS restrictions and does not repeat them.

## What the page does not say

- Whether DirectQuery, live connection or Direct Lake models support OLS. The page's description mentions imported models, but the body does not state the restriction.
- Calculation groups, licensing or capacity requirements, and the minimum Power BI Desktop version for TMDL view.
- How measures, relationships or calculated columns that reference a secured column behave, beyond the generic error.
- How OLS and RLS combine when one role has both.
- The page's examples use a role named CategoriesOLS but secure a table called Customers, and the Tabular Editor steps mention a categories table. Use your own names.

## A cautious rollout

The steps are practical advice.

1. Decide which tables or columns are sensitive, and list the roles that should not see them.
2. Build the role in a development copy of the model.
3. Test with a Viewer account, not with a workspace Admin, Member or Contributor, because those roles bypass OLS.
4. Check every report page for errors on restricted fields.
5. Publish and assign members or groups.

## Typical mistakes

- Testing as a workspace Admin and concluding that OLS does not work.
- Hiding a column that reports and measures still use.
- Expecting Quick insights, Smart narrative or Excel Data Types to work on the same model.
- Copying the page's example names into a real model.

## Related

- [Power BI](https://www.m365.fm/entity/power-bi/)
- [Row-level security](https://www.m365.fm/entity/row-level-security/)
- [Tabular Editor](https://www.m365.fm/entity/tabular-editor/)
- [Semantic model](https://www.m365.fm/entity/semantic-model/)

## Sources

- [Object-level security (OLS) in Power BI (Microsoft Learn)](https://learn.microsoft.com/fabric/security/service-admin-object-level-security)
