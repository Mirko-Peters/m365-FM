---
title: "How to Install and Uninstall Extensions in Business Central"
summary: "Install, set up and uninstall apps and extensions in Business Central: Manage Apps in the Admin Center versus Extension Management, required permissions, per-tenant extension upload, dependents and deleting extension data."
status: review
publish: false
author: mirko-p
date: 2027-01-20
topics: [business-central-extensions, dynamics-365-business-central]
keypoints:
  - "Manage apps on the Manage Apps page in the Business Central Admin Center, or on the Extension Management page inside an environment."
  - "Extension Management needs membership in the D365 Extension MGT user group or the EXTEND. MGT. - ADMIN permission set. The Admin Center needs an Entra role."
  - "Uninstalling keeps the data by default. The Delete Extension Data toggle removes it, plus data of dependent apps, and cannot be undone."
  - "An app cannot be uninstalled unless its dependents are uninstalled too. Learn shows a dialog that lists them."
  - "Per-tenant extensions are uploaded on Extension Management with Manage > Upload Extension. Force schema sync mode handles breaking schema changes."
faq:
  - q: "Where do I install apps in Business Central?"
    a: "Microsoft Learn says administrators manage apps and extensions on the Manage Apps page in the Business Central Admin Center, or on the Extension Management page in an environment. To open the latter, search for Extension using the Search for Page or Report icon. Marketplace apps come from Marketplace.microsoft.com or the View Marketplace action."
  - q: "Which permissions do I need?"
    a: "To use the Manage Apps page you need an Entra role that grants access to the Admin Center. For the Extension Management page you must be a member of the D365 Extension MGT user group or have the EXTEND. MGT. - ADMIN permission set. To use an extension, you need the permission sets that come with it."
  - q: "Is my data deleted when I uninstall an app?"
    a: "By default no. Learn says that if you reinstall the app, the data is available again. To delete the data during uninstall, turn on the Delete Extension Data toggle and confirm. Later you can delete remaining data on the Delete Orphaned Extension Data page by choosing the app and Delete Data."
  - q: "Why can I not uninstall an app?"
    a: "Learn lists two reasons. Other apps may depend on it, and you cannot uninstall an app unless you also uninstall its dependents. Also some apps are required and cannot be deleted on the Extension Management page."
  - q: "How do I upload a per-tenant extension?"
    a: "On the Extension Management page choose Manage and then Upload Extension, specify the .app file on the Upload and Deploy Extension page, select Accept and then the Deploy action. If the extension has breaking schema changes, set Schema Sync Mode to Force and confirm."
---

Install apps in Business Central from the **Manage Apps** page in the Business Central Admin Center, or from the **Extension Management** page inside an environment. Uninstall from the same pages with the **Uninstall** action. Microsoft Learn notes that uninstalling does not delete data unless you choose to, and that dependent apps are uninstalled with the app.

## Permissions first

Learn separates the two places where you manage apps:

- **Manage Apps page in the Admin Center:** you must be assigned an Entra role that grants access to the Admin Center.
- **Extension Management page in an environment:** you must be a member of the **D365 Extension MGT** user group or have the **EXTEND. MGT. - ADMIN** permission set.

Administrators can assign user groups and permissions to other users in the company. To use an installed extension, users need the permission sets that come with it.

## Step 1: Open the management page

Administrators manage apps in **Manage Apps** in the Admin Center. Alternatively, open **Extension Management** from Home, or choose the **Search for Page or Report** icon in the top-right corner, enter **Extension** and choose the related link.

## Step 2: Get the app

New apps come from the marketplace at Marketplace.microsoft.com. It offers all available apps for Business Central, plus apps and content packs for other Microsoft products. Sign in with the email account you use for Business Central, so the experience is smooth.

You can also start from inside Business Central. On **Extension Management** you see the installed apps, and the **Microsoft Marketplace Apps** page shows the apps available in the marketplace. The **View Marketplace** action takes you to the website. When you choose an app, read what it does, open its Help, and agree to its terms of use. If you start from the marketplace website, you are signed in to Business Central to finish the installation.

Learn adds that some apps are provided by Microsoft and others by other companies, and recommends learning more about an app before you install it. The page lists the Microsoft-provided apps, for example Sales and Inventory Forecast, VAT Group, PayPal Payments Standard and Late Payment Predictions, among others.

## Step 3: Set up the app

After installation an app might need setup. For PayPal Payments Standard, for example, you specify the email or the merchant account ID for your PayPal account. When installation completes, Business Central asks whether you want to set up the app right away. Setup can be required or optional.

- A required setup opens as a page or an assisted setup guide.
- If you do not finish, use the **Setups for (app name)** page, which lists all setups for the app. Required setups are shown in bold.
- To set up later, open **Installed Extensions** and choose **Set up**.

Other apps only add fields to an existing page or add a new page, and need no setup.

## Upload a per-tenant extension (PTE)

You upload and schedule installation of a PTE on the **Manage Apps** page in the Admin Center, or on **Extension Management** in an environment.

1. On **Extension Management**, choose **Manage** > **Upload Extension**.
2. On **Upload and Deploy Extension**, specify the `.app` file.
3. Choose **Accept**, and then **Deploy**.

If the PTE has breaking schema changes, you can force the upload. In **Schema Sync Mode**, choose **Force**, and confirm that you want to proceed.

## Uninstall an app

1. Open **Manage Apps** in the Admin Center or **Extension Management** in the environment.
2. Select the app and choose **Uninstall**.
3. If you also want to delete its data, turn on **Delete Extension Data** and confirm. Then uninstall and confirm again.

Important points from Learn:

| Topic | What Learn says |
| --- | --- |
| Data | Not deleted by default. If you reinstall the app, the data is available again |
| Dependents | You cannot uninstall an app unless you also uninstall its dependents. A dialog lists them, and **Yes** removes the app and the dependents |
| Delete Extension Data | Deletes data for the app and for all dependent apps. It cannot be undone |
| Required apps | Some apps are required and cannot be deleted on **Extension Management** |
| Later cleanup | The **Delete Orphaned Extension Data** page lists apps you still have data for. Choose the app, then **Delete Data** |

## Choosing between the two places (my advice)

This is my suggestion, not a Microsoft rule. Use the Admin Center when you work across environments and your account has the Entra role. Use Extension Management when you work inside one environment and have the user group or permission set. The permission model is different, so the right place often depends on who you are.

## A safe uninstall routine (my advice)

1. Look at the dependents dialog before you confirm. If it lists apps you did not expect, stop.
2. Uninstall without deleting data first. You can still reinstall and keep the data.
3. Delete the data later from Delete Orphaned Extension Data, once you are sure.

## What the page does not cover

The page I read does not describe scheduling windows for updates, environment types or sandbox behavior, so this article makes no claims there. For managing apps from the Admin Center, Learn links to separate pages on managing apps and on Marketplace apps.

## Related

- [Business Central extensions](https://www.m365.fm/entity/business-central-extensions/)
- [Dynamics 365 Business Central](https://www.m365.fm/entity/dynamics-365-business-central/)

## Sources

- [Install and uninstall apps (Microsoft Learn)](https://learn.microsoft.com/dynamics365/business-central/ui-extensions-install-uninstall)
