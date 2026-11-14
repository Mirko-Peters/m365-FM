---
title: "How to Set Up Static Row-Level Security in Power BI"
summary: "Static row-level security in Power BI step by step: define a role with a fixed DAX filter in Power BI Desktop, publish, add members in the service, and test as role. Includes who RLS does not apply to and documented limits."
status: review
publish: false
author: mirko-p
date: 2027-01-20
topics: [power-bi, power-bi-desktop, power-bi-service]
keypoints:
  - "Workflow per Learn: define roles and rules in Power BI Desktop, publish, add members to roles in the service, then validate with Test as role."
  - "Static RLS uses a fixed value in a DAX filter, for example [Region] = 'West'. Only rows that evaluate to TRUE stay visible."
  - "RLS restricts only users with the Viewer role. It does not apply to workspace Admin, Member or Contributor roles."
  - "Role members can be Microsoft Entra security groups, distribution groups or mail-enabled groups. Microsoft 365 groups are not supported."
  - "Roles are additive, service principals cannot be role members, and RLS does not hide columns. Object-level security covers that."
faq:
  - q: "What is static row-level security in Power BI?"
    a: "Learn describes RLS as filters, defined in roles, that restrict data at row level for specific users of a semantic model. A static rule uses a fixed value, for example the filter [Region] = West in a DAX expression. Learn contrasts it with dynamic RLS, which uses functions such as USERPRINCIPALNAME to filter per user."
  - q: "Who does RLS not apply to?"
    a: "According to Microsoft Learn, RLS only restricts data access for users with Viewer permissions. It does not apply to workspace Admin, Member or Contributor roles, because those roles can edit the semantic model. If you want RLS to apply to people in a workspace, assign them the Viewer role."
  - q: "Where do I add users to a role?"
    a: "Not in Power BI Desktop. In the service, open the workspace, select More options for the semantic model and then Security. Learn says users with the workspace Contributor role or higher see the Security option, and that Security only works for models that already have roles defined."
  - q: "Which kinds of groups can I add to an RLS role?"
    a: "Learn lists distribution groups, mail-enabled groups and Microsoft Entra security groups. It states that Microsoft 365 groups are not supported and cannot be added to RLS roles, and that groups created in Power BI cannot be added either."
  - q: "How do I test a role?"
    a: "In the service, select More options next to the role and then Test as role. Learn says this does not work for DirectQuery semantic models with single sign-on enabled, and that dashboards cannot be tested this way. Sign in as an actual Viewer user in those cases."
---

Static row-level security (RLS) in Power BI means a role carries a fixed filter, for example `[Region] = "West"`, and every member of that role sees only matching rows. You define the role in Power BI Desktop, publish the semantic model, add members to the role in the Power BI service and test it with **Test as role**. This article follows the Microsoft Learn page on RLS with Power BI.

## How RLS works, in Learn's words

RLS restricts data access for specific users of a semantic model. Filters restrict data at the row level, and you define the filters within roles. In the Power BI service, users with access to a workspace have access to the semantic models in it. RLS only restricts users with **Viewer** permissions. It does not apply to workspace **Admin**, **Member** or **Contributor** roles.

The high-level workflow has four parts:

1. Define roles and rules in Power BI Desktop using DAX filter expressions.
2. Publish the semantic model and report to the Power BI service.
3. Add members to roles in the service.
4. Validate with **Test as role**.

## Step 1: Define the role in Power BI Desktop

1. Import data into your report, or configure a DirectQuery connection.
2. On the **Modeling** tab, select **Manage Roles**.
3. In **Manage roles**, select **New**.
4. Under **Roles**, enter a name and press Enter. Learn says a role name cannot contain a comma, for example `London,ParisRole`.
5. Under **Select tables**, choose the table to filter.
6. Under **Filter data**, use the default editor, or select **Switch to DAX editor**. The expression returns true or false for each row. Only rows that return TRUE are visible, and everything else is removed.
7. Select **Save**.

For a static role, the DAX filter looks like this, using the example from Learn:

```dax
[Region] = "West"
```

Learn's example: a `Sales` table has the columns `Region`, `Product` and `Amount`. For users in the West role, only rows where `Region` is West remain visible. If the table holds five rows from the West, East and South regions, the West role sees the two West rows.

Notes from the page:

- In the expression box, use commas to separate DAX function arguments, even in a locale that normally uses semicolons, such as French or German.
- The default editor cannot define every filter. Dynamic rules with `username()` or `userprincipalname()` need the DAX editor. If you switch editors and information could be lost, Learn says a warning appears, and you can select **Cancel** to keep editing in the DAX editor.
- You cannot assign users to a role in Power BI Desktop.

## Step 2: Publish

Publish the report. Learn says the role definitions are published with it. Roles you previously defined in the service must be re-created in Desktop. You can define RLS only on semantic models created with Power BI Desktop. Excel-based models must be converted to PBIX files first.

## Step 3: Add members in the service

1. Open the workspace in the service. Select **More options** for the semantic model.
2. Select **Security**. This opens the Row-Level Security page.
3. Select the role and type the email address or name of a user or security group.
4. To remove a member, select the **X** next to the name.

Details from Learn:

- Users with the workspace **Contributor** role or higher see **Security**. Semantic model ownership or **Build** permission might also be required, depending on the scenario.
- You can only manage security on models with roles already defined.
- You can add members external to your organization.
- Supported groups: distribution groups, mail-enabled groups and Microsoft Entra security groups. **Microsoft 365 groups are not supported**, and you cannot add groups created in Power BI.
- A number in parentheses next to the role name shows the member count.

## Step 4: Validate with Test as role

1. Next to the role, select **More options** (...) and then **Test as role**.
2. Check that the report shows only the rows that match your filter.
3. Use **Now viewing as** in the page header to test other roles, a combination of roles or a specific person.
4. Select **Back to Row-Level Security** to return.

Limits from Learn: dashboards are not available for testing, and you are redirected to the report published with the model if one exists. The feature does not work for DirectQuery models with single sign-on enabled, does not work for paginated reports, shows only reports from the semantic model's workspace, and cannot validate every element, such as Q&A visuals, quick insights visuals and Copilot.

## Why you may see all the data while testing (check the workspace role)

A likely surprise is opening the report as its author, with an Admin, Member or Contributor role, and seeing all data. Learn explains why: Admin, Member and Contributor have edit permission on the semantic model, so RLS does not apply to them. Even Viewers with **Build** permission remain restricted. For example, Analyze in Excel is restricted by RLS for them.

## Other documented rules

- A user can belong to more than one role, and roles are additive. A member of both Sales and Marketing sees data for both.
- RLS does not limit columns or measures. A user who can see a row sees all its columns. Learn points to object-level security for that.
- You cannot use RLS to hide details but show summaries. Users see either.
- With import models, security roles in the data source are not used. With DirectQuery, the source's security roles apply as well.
- Service principals cannot be added to an RLS role.
- Live connections to Analysis Services are secured in the on-premises model. The security option does not appear for them.
- Using `USERELATIONSHIP()` in DAX queries and measures with RLS enabled might cause unexpected errors.
- By default, RLS filtering is single-directional. Bi-directional security filtering is possible with the **Apply security filter in both directions** checkbox. Learn cautions about query performance.

## Static or dynamic (my advice)

Learn says dynamic RLS is the most common approach because one role definition can filter differently per user via a user mapping table. My view: static roles are easy to read and test, but each region or team needs its own role and its own member list. With many regions, dynamic RLS is easier to maintain.

## Related

- [Power BI](https://www.m365.fm/entity/power-bi/)
- [Power BI Desktop](https://www.m365.fm/entity/power-bi-desktop/)
- [Power BI Service](https://www.m365.fm/entity/power-bi-service/)

## Sources

- [Row-level security (RLS) with Power BI (Microsoft Learn)](https://learn.microsoft.com/fabric/security/service-admin-row-level-security)
