---
title: "Create and Distribute a Power BI App: Publish a Workspace App With Audiences"
summary: "How to publish and distribute a Power BI workspace app, based on Microsoft Learn: licenses, the Create app, Setup, Content, Audience and Publish steps, audience rules, updating, unpublishing, limits, and how org apps differ."
status: review
publish: false
author: mirko-p
date: 2027-01-01
topics: [power-bi-org-apps, power-bi]
keypoints:
  - "The Learn page covers workspace apps, widely called Power BI apps. Org apps are a different, newer Fabric item that the page does not explain."
  - "Creating or updating an app needs Power BI Pro or Premium Per User. Viewers need Pro or PPU unless the workspace is in Premium capacity or Fabric F64 or higher."
  - "The steps are Create app, Setup, Content, Audience and Publish app. An app can have up to 25 audience groups."
  - "Each workspace can have one app. Publish and update time out after 1 minute, and an app can have up to 200 dashboards."
  - "Removing a report and updating the app makes app users lose their bookmarks and comments, and removing app permissions does not remove access that users already have."
faq:
  - q: "Which license do I need to publish an app?"
    a: "According to Microsoft Learn, creating or updating an app requires a Power BI Pro or Premium Per User license."
  - q: "How many audiences can an app have?"
    a: "According to Microsoft Learn, an app can have up to 25 audience groups, up to 10,000 users and groups in total, and up to 1,000 users or groups per audience."
  - q: "How do I publish to the entire organization?"
    a: "Select Entire organization in Manage audience access on the Audience tab. According to Microsoft Learn it is disabled if Install this app automatically is selected, if you are a guest user with a workspace role, or if your admin has not allowed it in the app tenant settings."
  - q: "Is this page about org apps?"
    a: "No. According to Microsoft Learn the page covers workspace apps. Org apps are a different, newer Fabric item, and existing workspace apps are not migrated automatically."
---

You publish a Power BI workspace app from the workspace: select **Create app**, fill in **Setup**, add **Content**, define **Audience** groups and select **Publish app**. People then get the app through a link, the **Get apps** page, or automatic install. This guide follows the Microsoft Learn article on publishing a workspace app.

## Workspace apps and org apps

The Learn page says it covers workspace apps, widely called Power BI apps. Org apps are a different, newer Fabric item. The two can coexist, existing workspace apps are not migrated automatically, and the page does not describe how to create an org app. Purpose-built Fabric application items are covered in the Fabric Apps documentation. If you need an org app, use that documentation.

## Licenses

- Creating or updating an app requires Power BI Pro or Premium Per User (PPU).
- If the workspace is not in Premium capacity or Fabric F64 or higher, all business users who view the app need Pro or PPU.
- If the workspace is in Premium capacity or Fabric F64 or higher, business users without Pro or PPU can view the content but cannot copy reports. With Build permission they can create reports from a semantic model on qualifying capacity and save them to My workspace, but they cannot share them without Pro or PPU.

## Publish the app

1. In the workspace list view, select **Create app**.
2. **Setup:** give the app a name and description. Optionally set a theme color, a support site link and contact information. Under **Advanced settings** you find the options to let users make a copy of the reports, to allow access to hidden content, and to show Copilot in app navigation. Learn warns that anyone with a direct link to any content in the app can reach hidden items. Select **Next: Add content**.
3. **Content:** select **Add content** to choose items from the workspace, or **Add a link** for other websites. Reorder with drag and drop or **Move up** and **Move down**. When you publish, all content is included by default. When you update an app, newly added content is not included by default. Select **Next: Add audience**.
4. **Audience:** select **New Audience** and rename it. Use the hide and show icon to control what each audience sees. In **Manage audience access** add groups or users, or select **Entire organization**. Under **Advanced** per audience you can allow users to share or build content with the semantic models.
5. **Publish app.** A **Successfully published** message shows the app link. You can also use **Copy link** on the Setup page.

If a report has paginated report visuals, include the referred paginated reports in the app, or make sure the audience has access to them in the workspace.

## Audience rules that cause problems

- Hiding content from an audience makes it unavailable to that audience. Dashboard tiles that point to hidden reports show an error saying the report does not exist or you lack permission.
- If the app relies on semantic models in other workspaces, all app users need access to those models.
- Build permissions apply only to semantic models in the same workspace as the app, and do not apply to paginated reports.
- **Entire organization** is disabled if **Install this app automatically** is selected, if you are a guest user with a workspace role, or if your admin has not allowed it in the app tenant settings.

## Access requests

By default users without access see a denial message and can request access by email. In the app's access request settings you can select **Replace with automated custom message** to explain how to get access. Custom messages are not supported in the Power BI mobile apps. To manage requests, open the **Apps** page, select **More options**, then **Manage permissions**, which has **Direct access** and **Pending access** tabs.

## Update, unpublish and install

- **Update:** open the workspace and select **Update app**. The workspace is a staging area, and changes are not live until you publish again. Removing a report from an app and updating makes app users lose customizations such as bookmarks and comments, and these cannot be restored even if the report is added back. Removing app permissions does not remove access that users already have, so remove it from the semantic model's **Manage permissions** if needed.
- **Unpublish:** an Admin or Member selects **More options**, then **Unpublish app**. This uninstalls the app for everyone but does not delete the workspace.
- **Install:** users can use **Get apps**, a direct link, or automatic install if your Fabric admin enabled it. Power BI sends no email to internal users when you distribute or update an app, and external users receive an email with a direct link. For automatic install, Learn advises publishing during off hours and verifying with several users first.

## Limits

| Limit | Value on the page |
|---|---|
| Apps per workspace | 1 |
| Audience groups per app | 25 |
| Users and groups per app | 10,000 combined |
| Users or groups per audience | 1,000 |
| Dashboards per app | 200 |
| Publish and update timeout | 1 minute |

Workspace users are counted per audience. The page's example is four workspace users across five audiences, which count as 20 entries. If an app is too large to update, reduce items or recreate it as an org app.

## Suggestion: a rollout order

This section is a practical suggestion and not a Microsoft statement.

1. Decide the audiences on paper first, then choose the content for each.
2. Publish to a test audience of a few people and check dashboards, reports and tiles.
3. Add real audiences, using groups and not single users.
4. Publish outside working hours when you use automatic install.

## Not covered

The page I read does not describe the following:

- How to create an org app.
- Sensitivity labels and information protection settings.
- Admin portal steps for automatic install, publishing to the entire organization and Copilot.
- Pricing beyond the license categories.

## Related

- [Power BI org apps](https://www.m365.fm/entity/power-bi-org-apps/)
- [Power BI](https://www.m365.fm/entity/power-bi/)

## Sources

- [Publish a workspace app in Power BI (Microsoft Learn)](https://learn.microsoft.com/power-bi/collaborate-share/service-create-distribute-apps)
