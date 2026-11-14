---
title: "Secure Power Pages Web API and Table Permissions Against Anonymous Data Exposure"
summary: "How to stop anonymous visitors from reading Dataverse data through a Power Pages site: Web API site settings, table permissions, the Anonymous Users web role, column permissions and the security scan."
status: review
publish: false
author: mirko-p
date: 2026-12-17
topics: [power-pages, power-pages-web-api, power-pages-table-permissions, dataverse]
keypoints:
  - "The Web API is off for every table until the site setting Webapi/<table>/enabled is set to true, and it only exposes the columns you list."
  - "Table permissions decide record access. If the Anonymous Users web role is on a table permission, anyone who visits the site can read that table."
  - "The Anonymous Users role respects only table permissions, so no other rule or page permission narrows it."
  - "Column permissions are evaluated after table permissions and only apply to the portals Web API. Sites on enhanced authorization use column security profiles instead."
  - "Run the Security workspace deep scan, then review every table permission that lists the Anonymous Users role."
faq:
  - q: "Is the Power Pages Web API open to anonymous users by default?"
    a: "No. According to Microsoft Learn, the Web API setting Webapi/<table-name>/enabled defaults to False, and records are restricted until table permissions are tied to web roles. Anonymous access only exists when you enable a table and give the Anonymous Users web role a table permission."
  - q: "What happens if I add the Anonymous Users role to a table permission?"
    a: "Microsoft Learn states that when the Anonymous users web role is granted access to a table, any user who visits the site can access the data in the table. Clear the check mark next to Anonymous users on the permission to remove that access."
  - q: "Do column permissions protect data read through forms and lists?"
    a: "The Learn page on column permissions says they restrict access only when data is accessed through the portals Web API. It does not describe how other access paths are affected, so do not rely on them for forms or lists."
  - q: "Can I use the wildcard in the Web API fields setting?"
    a: "No. Microsoft Learn says support for the wildcard value in Webapi/<table-name>/fields is deprecated and that requests for tables configured with the wildcard fail until you list explicit column names. A short explicit list is also the safer setting."
  - q: "Does the Web API need an authentication token?"
    a: "Per Microsoft Learn, you do not add authentication code because the application session handles authentication and authorization, but every Web API call must include a Cross-Site Request Forgery token. The page notes that the contact ID is null for anonymous users."
---

Anonymous data exposure on a Power Pages site almost always has the same cause: a table is enabled for the Web API, and a table permission gives the Anonymous Users web role access to it. Microsoft Learn is direct about the result. When the Anonymous users web role is granted access to a table, any user who visits the site can access the data in the table. The fix is to review three layers in order: Web API site settings, table permissions with web roles, and column permissions.

## How the layers fit together

Learn describes Power Pages security as several layers: site visibility, authenticated users, web roles, table permissions, page permissions, HTTP headers and a security scan. Access to Dataverse records is restricted automatically for forms, lists, Liquid and the Web API. Table permissions tied to web roles open that access up.

The Web API adds its own gate. It uses the route `/_api`, for example `/_api/accounts`, follows the table permissions of the user's web roles and needs a CSRF token on every call. Learn also says the API is built for rich pages inside the portal and is not optimized for third-party services or integration.

## Step 1: Inventory what the Web API exposes

The Web API is controlled by site settings. Use the table logical name, such as `account`.

| Site setting | What it does | Default |
|---|---|---|
| `Webapi/<table-name>/enabled` | Turns the API on for the table | False |
| `Webapi/<table-name>/fields` | Lists the column logical names exposed | none |
| `Webapi/<table-name>/UseFieldsFromView` | Takes columns from the system view **Power Pages Web API Columns** | False |
| `Webapi/error/innererror` | Adds InnerError details to error responses | False |

Review the site settings in the Portal Management app and list every table with `enabled` set to true. For each one, check the `fields` value. Learn says the wildcard `*` is deprecated and that requests for tables using it fail until explicit columns are configured. List only the columns the page needs.

If you use the view method, Learn says to create a public system view named **Power Pages Web API Columns** in the **Data workspace**, add the columns, save and publish, and set `UseFieldsFromView` to true. Changes to the view can take up to five minutes to reach the Web API. When both `fields` and the view are set, the two sources are combined.

Leave `Webapi/error/innererror` at False on a public site unless you are debugging. The page does not describe the content of InnerError, so treat it as extra detail you do not need to expose.

## Step 2: Find every table permission that includes anonymous users

Open the design studio and go to the **Security** workspace, then **Table permissions**. The Learn page on assigning table permissions describes the steps:

1. Select the ellipsis next to the table and choose **Edit**.
2. Review the selected roles.
3. Clear the check mark next to **Anonymous users** if the data should not be public.
4. Select **Save**.

Learn says that when site visibility is public, a message in the design studio warns that the data displayed in the site can be seen by anyone, and suggests changing or removing the Anonymous role in table permissions.

Also open the Portal Management app, go to **Security**, then **Web Roles**, and check the **Anonymous Users Role** setting. A site can have only one Anonymous Users web role. Learn says this role is used with table permissions and respects no other rules or permissions. That means a table permission is the only control that limits what anonymous visitors can reach.

## Step 3: Choose the narrowest access type

Learn lists these access types in the design studio:

- **Global access**: all records for the selected roles
- **Contact access**: records associated with the signed-in user
- **Account access**: records associated with the user's account
- **Self access**: only the user's own contact record
- **Custom Access** (preview): records matching a FetchXML filter, on sites with enhanced authorization

Prefer Contact, Account or Self access for signed-in users over Global access. Global access for an anonymous role is the widest setting there is. Contact and Account access need a table relationship.

Users can hold several web roles, and Learn says access is cumulative. Check the combined effect of the Authenticated Users role and any other roles, not only a single permission.

If a table permission is deactivated, it becomes ineffective. Learn also notes that child permissions of a deactivated parent stay active but do not take effect.

## Step 4: Add column permissions for sensitive columns

Column permissions are an optional extra layer. Learn says they apply only when data is accessed through the portals Web API, and that table permissions are evaluated first. If no column permissions exist, table permissions apply to all columns.

To add a profile, open the Portal Management app, select **Security** and **Web Roles**, choose the role, and under **Related** select **Column Permission Profiles**. Set **All Column Permissions** to the smallest combination of Create, Read and Update, then grant specific columns what they need. The page does not document Delete as a column permission.

Sites on the enhanced authorization model do not apply column permissions. On those sites, Learn points to column security profiles instead.

## Step 5: Run the security scan

In the **Security** workspace, select **Run Deep Scan**. By default, only anonymous pages are scanned. You can include authenticated pages by supplying a username and password. Learn says the scan needs Power Pages Core version 1.0.2403.84 or later and sends an email when it finishes. The summary lists failed checks and alerts with fix descriptions, and you can download a PDF.

The page does not list the individual checks, so use the scan to find site-level problems, not as proof that table permissions are correct.

## Typical mistakes

- Enabling a table in site settings, then forgetting it when the page that needed it is removed.
- Keeping the Anonymous Users web role on a table permission with Global access.
- Assuming column permissions protect forms and lists.
- Relying on page permissions to protect Dataverse rows. Table permissions govern record access.
- Leaving a site public while testing. Learn says new sites default to internal visibility until you make them public.

## What the sources do not say

The pages read for this article do not list the individual privileges of a table permission. They also do not explain how overlapping permissions are combined beyond the cumulative role behavior. Check your own permissions in a test with an anonymous browser session.

## Related

- [Power Pages](https://www.m365.fm/entity/power-pages/)
- [Power Pages Web API](https://www.m365.fm/entity/power-pages-web-api/)
- [Power Pages table permissions](https://www.m365.fm/entity/power-pages-table-permissions/)
- [Dataverse](https://www.m365.fm/entity/dataverse/)

## Sources

- [Power Pages security overview](https://learn.microsoft.com/en-us/power-pages/security/power-pages-security)
- [Portals Web API overview](https://learn.microsoft.com/en-us/power-pages/configure/web-api-overview)
- [Set table permissions](https://learn.microsoft.com/en-us/power-pages/security/table-permissions)
- [Assign table permissions](https://learn.microsoft.com/en-us/power-pages/security/assign-table-permissions)
- [Create web roles](https://learn.microsoft.com/en-us/power-pages/security/create-web-roles)
- [Column permissions](https://learn.microsoft.com/en-us/power-pages/security/column-permissions)
- [Security scan](https://learn.microsoft.com/en-us/power-pages/security/security-scan)
