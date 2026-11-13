---
title: "Custom Teams App Not Available for Users: Check App Access in the Right Order"
summary: "Approved custom Teams app still 'not available'? Check app status, org-wide settings and either app availability or permission policies, and learn which model your tenant uses."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [teams, teams-admin-center, teams-app-manifest]
keypoints:
  - "Microsoft says an app is usable only if every layer allows it: app status, org-wide app settings and the user-level setting. One block anywhere is enough to stop it."
  - "Tenants are moving from app permission policies to app centric management. Once a tenant is migrated, permission policies no longer apply, so advice for the old model can do nothing."
  - "With app centric management, access is set per app under Users and groups, Availability, Edit availability. Guests cannot use an app that is set to specific users or groups."
  - "Changes can take a few hours. Microsoft names up to 24 hours for app availability, and in rare cases the client can take longer."
faq:
  - q: "Why does my approved custom app still say it is not available?"
    a: "At least one layer still blocks it. Check the app status on Manage apps, the Custom apps setting in the org-wide app settings, and the user-level setting, which is either the app's availability (app centric management) or an app permission policy assigned to the user. Then allow time for the change to reach users."
  - q: "How do I know whether my tenant uses permission policies or app centric management?"
    a: "Microsoft says that on a migrated tenant, the permission policies page may show a message that permission policies no longer apply. You can also open an app on Manage apps and look for the Users and groups tab with an Availability section. Microsoft began automatic migration of tenants in April 2025."
  - q: "Do setup policies give users access to an app?"
    a: "No. Setup policies pin apps and install them for users. If a pinned app is blocked by a permission policy, the user still cannot use it."
  - q: "Can I hide blocked apps from the Teams store completely?"
    a: "Microsoft says users can view apps in the store and request access to apps they cannot use. In a 2025 thread, a moderator said blocked apps can stay visible with a lock icon and that no supported way exists to hide them for all users. That statement is from the thread, not from Learn."
---

You built or approved a custom app for your organization. It appears under **Built for your org**, yet users get "This app is not available" or a permissions message. This pattern shows up in Microsoft Q&A threads from 2025 and 2026. The answers in those threads often suggest settings from the older permission policy model, and one asker could not even find the tabs that the moderator mentioned. This article gives a fixed order for the checks and explains why the model matters. It is not an official Microsoft procedure. Statements that come from a thread are labeled as such.

## What the threads describe

- In October 2025, someone published a custom app, got admin approval, and still saw "This app is not available. Please check with your admin for more details". An answer arrived months later from a community member, without a role label. It blamed app permission policies and listed settings to check. It was not marked as accepted and the person did not confirm anything.
- In June 2025, a global administrator reported that a new custom app would not open for users, although custom apps were set to allow all. A moderator pointed to **Teams apps**, **Manage apps**, **Users and groups**, **Edit availability**, and **Everyone**. The administrator replied that those tabs were missing and asked whether being a Government Community Cloud customer explained it. The thread ended with a recommendation to open a support request. No fix was confirmed.
- In August 2025, someone asked why an app blocked with app centric management still shows in the store. A moderator said that is expected behavior.

## Step 1: Learn which model your tenant uses

This decides which of the later steps apply. Microsoft's page on [app centric management](https://learn.microsoft.com/en-US/microsoftteams/app-centric-management) says it replaces app permission policies. Instead of combining the org-wide third-party setting, the app status and a permission policy, each app carries its own list of users and groups. Microsoft started migrating tenants automatically in April 2025. After the switch, you cannot access, edit or use permission policies, and you cannot go back.

Microsoft's page on [permission policies](https://learn.microsoft.com/en-us/microsoftteams/teams-app-permission-policies) says that on a migrated tenant, permission policies no longer apply and the policy page may show a message about it. So if your tenant is migrated, a fix such as "set Custom apps to Allow all in the permission policy" changes nothing. This is probably why advice in the threads did not work for people. The June 2025 asker's missing tabs fit the same picture: the moderator described the new model while the tenant might still have been on the old one. That is my reading, not something the thread states.

## Step 2: Check how the app arrived

Microsoft's page on [custom apps](https://learn.microsoft.com/en-us/microsoftteams/teams-custom-app-policies-and-settings) lists how an app reaches users and which setting controls it:

| Route | What controls access |
|---|---|
| Admin uploads the package in the Teams or Microsoft 365 admin center | App permission policies and the app **Status** on **Manage apps** |
| A user submits the app and the admin approves it into **Built for your org** | The same two controls |
| A user uploads a package in the Teams client | The org-wide preview setting, the setup policy **Upload custom apps** and the team setting **Allow members to upload custom apps** |

The org-wide setting there is labeled **Let users interact with custom apps in preview**. It is not the right switch for an approved app in the org catalog. Microsoft says that once an app is in the org catalog, the preview setting no longer governs access. One answer in the October 2025 thread named a setting called "Allow interaction with custom apps", which is not the label on Microsoft's page.

## Step 3: Check the app status

In the Teams admin center, open **Teams apps**, then **Manage apps**, and find the app. The status must be **Allowed**. Microsoft says that before an admin allows an app, it shows as **Blocked by publisher**. Select the app and choose **Allow**, or open the details page and change the status.

Microsoft's rule from the [manage apps page](https://learn.microsoft.com/en-us/microsoftteams/manage-apps) is worth keeping in mind: to allow an app you must pass every setting, and to block it, any one is enough. That is why one forgotten layer breaks access.

## Step 4: Check the org-wide app settings

On **Manage apps**, open **Actions**, then **Org-wide app settings**. Under **Custom apps**, Microsoft describes the toggle **Let users install and use available apps by default**. Microsoft states that this org-wide setting does not apply to apps that you set to **Specific users and groups** and saved, to apps set individually to **Everyone** or **No one**, or to blocked apps. So a per-app setting wins over the org-wide default. Org-wide changes take effect after a few hours.

## Step 5: Check the user-level setting

**If your tenant uses app centric management:**

1. On **Manage apps**, select the app name.
2. Open the **Users and groups** tab.
3. Under **Availability**, select **Edit availability**.
4. In the **Available to** menu, choose **Everyone**, **Specific users or groups** or **No one**. For specific users or groups, search and select them.
5. Select **Apply**.

Points from Microsoft's page: **Everyone** includes guests. With **Specific users or groups**, guests cannot use the app even if they are assigned. You can add up to 99 users or groups at a time, the search shows only 20 results, and bulk updates need PowerShell (the page names `Update-M365TeamsApp`). To see why one user has or lacks access, open **Manage users**, select the user and open the **Apps** tab. It shows whether access comes from **Everyone**, a direct assignment or a group.

**If your tenant still uses permission policies:**

1. Open **Teams apps**, then **Permission policies**, and check the **Custom apps** option of the policy the user has.
2. Check that the policy is assigned to the user. Microsoft says permission policies take effect only when assigned, and Teams does not support group assignment for them. Change a single user under **Users**, **Manage users**, **Edit settings**.

Microsoft also notes that a user cannot use any part of an app they are not allowed to use, and that you need to be a Teams Administrator or higher.

## Step 6: Do not rely on setup policies for access

A setup policy pins the app and can install it for users. It does not grant access. Microsoft says that if a pinned app is blocked by a permission policy, the user cannot use it. Use the setup policy for visibility, and the availability setting or permission policy for access.

## Step 7: Allow time, then test with a real user

Microsoft says that after you edit or assign a permission policy, it can take a few hours to take effect. For app centric management, changes can take up to 24 hours to reach all users, and in rare cases the client may need up to six days. Test with a normal account, not an admin account. Ask the user to sign out and back in before you change anything else, so you do not undo a correct setting.

## Step 8: Blocked apps in the store

Microsoft says users can view apps in the store and request access, and that users can ask the admin from the Teams client to allow an unavailable app. In the August 2025 thread, a moderator said blocked apps can stay visible in the catalog with a lock icon, that no supported way exists to hide them for all users (a backend flag exists only through Microsoft Support and works for some apps), and that the asker could use setup and permission policies to focus users on approved apps. These statements are from the thread. I did not find them on the Microsoft pages above.

## When to stop

If every layer allows the app and the message stays after a day, check whether the tenant is a Government Community Cloud tenant. Microsoft's page says that in Microsoft 365 GCC, GCCH and DoD, all third-party apps are blocked by default. It says nothing specific about custom apps there. After that, collect the app ID, an affected user, the time and a screenshot, and open a support request.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Teams admin center](https://www.m365.fm/entity/teams-admin-center/)
- [Teams app manifest](https://www.m365.fm/entity/teams-app-manifest/)

## Sources

- [Microsoft Learn: Use app centric management to manage access to apps](https://learn.microsoft.com/en-US/microsoftteams/app-centric-management)
- [Microsoft Learn: Manage apps in the Teams admin center](https://learn.microsoft.com/en-us/microsoftteams/manage-apps)
- [Microsoft Learn: Manage app permission policies](https://learn.microsoft.com/en-us/microsoftteams/teams-app-permission-policies)
- [Microsoft Learn: Custom app policies and settings](https://learn.microsoft.com/en-us/microsoftteams/teams-custom-app-policies-and-settings)
- [Microsoft Q&A: Custom app for my org shows "This app is not available" (October 2025)](https://learn.microsoft.com/en-us/answers/questions/5595157/after-publishing-custom-app-for-my-org-i-got-this)
- [Microsoft Q&A: Newly created custom Teams app, users do not have permissions to run (June 2025)](https://learn.microsoft.com/en-us/answers/questions/2287646/newly-created-custom-teams-app-users-do-not-have-p)
- [Microsoft Q&A: Blocked apps still visible in Teams catalog (August 2025)](https://learn.microsoft.com/en-us/answers/questions/5537693/blocked-apps-still-visible-in-teams-catalog-how-to)
