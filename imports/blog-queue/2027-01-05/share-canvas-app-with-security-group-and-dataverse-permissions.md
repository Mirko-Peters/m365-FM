---
title: "How to Share a Canvas App With a Security Group and Set Dataverse Permissions"
summary: "Share a Power Apps canvas app with a Microsoft Entra security group: User vs Co-Owner, classic sharing, Microsoft 365 group requirement, Dataverse security roles, data source permissions, limits and caveats."
status: review
publish: false
author: mirko-p
date: 2027-01-05
topics: [power-apps, dataverse-security-roles]
keypoints:
  - "Open the app in make.powerapps.com, select Share, type the security group, choose User or Co-Owner and select Share. Save and publish the app first."
  - "In its classic sharing steps, Learn says to use a security group for more than 100 users and that you cannot share with a distribution group."
  - "Sharing the app does not grant data access. Users need a Dataverse security role and permissions on other data sources such as Excel files."
  - "Roles can be assigned to Entra security groups, not Microsoft 365 groups. The Assign a security role action needs System Administrator on the Dataverse database."
  - "A Microsoft 365 group must have security enabled before it appears in the sharing panel."
faq:
  - q: "How do I share an app with a security group?"
    a: "Per Microsoft Learn: sign in to make.powerapps.com, select Apps, select the app, select Share, type the name of the Microsoft Entra security group, choose User or Co-Owner, optionally add a message and select Share."
  - q: "What can a Co-Owner do?"
    a: "Learn says a Co-Owner can use, edit and share the app, but cannot delete it or change owners. A User can only use the app."
  - q: "Can I share with a distribution group?"
    a: "No. Learn says you cannot share with a distribution group in your organization or with a group outside your organization in classic sharing."
  - q: "Do users need Dataverse permissions?"
    a: "Yes. Users must belong to a security role that allows the operations the app needs, such as create, read, write and delete. Learn says that in many cases you will want custom roles with the exact permissions users need."
  - q: "Why does my Microsoft 365 group not appear?"
    a: "Learn says the group must have security enabled, which the owner must enable. After a few minutes the group appears in the sharing panel."
---

Share the app with an Entra security group, choose User or Co-Owner, and then make sure the same people have the right Dataverse security role and access to every other data source the app uses. This guide follows the Microsoft Learn article on sharing a canvas app. Learn links to other pages for managed environment sharing limits and for sharing app resources, and those are not covered here.

## Before you share

- Save the app to the cloud (not locally) and **publish** it before sharing. Republish after every change so others see it.
- Apps with premium components such as map or address input require users to have a Power Apps license. You can request licenses from your admin, but not for groups or distribution lists.

## Share with a security group

1. Sign in to Power Apps at `make.powerapps.com`.
2. In the left pane, select **Apps** and select the app.
3. On the command bar, select **Share**, or use the **Commands** menu next to the app name.
4. In the **Share** dialog, type the name or alias of the Microsoft Entra security group.
5. Select the down arrow and choose **User** or **Co-Owner**.
6. Optionally add a message. The overflow menu offers **Upload app image**. **Manage access** shows app access details and has an **Additional data access** tab.
7. Select **Share**.

Classic sharing is available through the overflow menu (**Use classic sharing**). There you can enter several names separated by semicolons, tick **Co-owner**, optionally send an email invitation, and select **Share**.

## User or Co-Owner

| Permission | What it allows |
| --- | --- |
| User | Run the app only |
| Co-Owner | Use, edit and share the app. Cannot delete it or change owners |

To remove access, select the Remove (x) icon. To let a co-owner only run the app, clear the Co-owner check box in classic sharing.

## Limits and restrictions

- You cannot share with a distribution group in your organization, or with a group outside your organization (classic sharing).
- Learn says to use a security group when sharing with more than 100 users, to avoid degraded experiences.
- In classic sharing you cannot grant Co-owner to a security group if the app was created inside a solution. Learn points to a PowerShell cmdlet for role assignment, but its link names a different cmdlet from the text, so verify the exact name before use.
- For managed environments, Learn refers to a separate sharing limits article without listing the limits.

## How group permissions work

- Existing members inherit the group's permission. New members inherit it when they join. Members who leave lose access through that group but may keep access through another assignment.
- You can give a member more than the group has. If the group can run the app and one member is a Co-Owner, only that member can edit.
- If the group is Co-Owner and a member is only User, the member can still edit.
- Users must be explicit members. A group owner who is not a member must add themselves.

## Microsoft 365 groups

The group must have **security enabled**, and the owner must enable it. Setting `SecurityEnabled` to `True` does not change how Power Apps or Microsoft 365 features work. Learn shows Microsoft Graph PowerShell commands for it (`Update-MgGroup` with `SecurityEnabled = $true`). After a few minutes the group appears in the sharing panel.

## Dataverse security roles

- Users must belong to a security role that allows the app's operations, such as create, read, write and delete. Learn says that in many cases you will want custom roles with the exact permissions users need.
- The **Assign a security role** action under **Data permissions** needs **System Administrator** on the Dataverse database.
- Roles can go to individual users and Entra security groups, not Microsoft 365 groups.
- If a user is not in the Dataverse root business unit, share the app without a role and set the role directly.
- Once assigned, a role cannot be unassigned from the sharing panel. Use the admin portal.
- App-level security roles, if enabled by an admin, are App reader, App user, App maker and App admin.

## Connections and other data sources

A shared app works as expected only if you also manage permissions for its data sources. For Excel on OneDrive for Business, share the file with the same users. Flows, gateways and connections may need sharing too. Learn links to an article on sharing canvas app resources.

## Teams

When sharing in Teams, the recipient must be in the same tenant and have access to the app. The error This app cannot be found means no access.

## What the page does not cover

Numeric limits for managed environments, exact group sync timing beyond a few minutes, full cmdlet syntax, connection sharing mechanics and guest sharing.

## A sharing checklist (my advice)

The checklist is my own suggestion.

1. Publish the latest version.
2. Create or pick an Entra security group.
3. Share with User first. Add Co-Owner only for makers.
4. Assign a Dataverse security role to the same group.
5. Share other data sources and connections.
6. Test with an account that is only in the group.

## Typical mistakes (my advice)

- Sharing the app but not the data.
- Using a distribution group or an M365 group without security enabled.
- Granting Co-Owner broadly.
- Forgetting to republish after changes.

## Related

- [Power Apps](https://www.m365.fm/entity/power-apps/)
- [Dataverse security roles](https://www.m365.fm/entity/dataverse-security-roles/)
- [Microsoft 365 groups](https://www.m365.fm/entity/microsoft-365-groups/)

## Sources

- [Share a canvas app with your organization (Microsoft Learn)](https://learn.microsoft.com/power-apps/maker/canvas-apps/share-app)
