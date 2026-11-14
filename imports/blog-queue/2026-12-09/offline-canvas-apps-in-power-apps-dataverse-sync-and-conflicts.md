---
title: "Offline Canvas Apps in Power Apps: Dataverse Offline, Sync Conflicts and Error Handling"
summary: "Build an offline canvas app on Dataverse: enable tables and the app, pick an offline profile, and handle sync errors. Learn what Microsoft documents about conflicts, and what the LoadData and SaveData route leaves to you."
status: review
publish: false
author: mirko-p
date: 2026-12-09
topics: [power-apps, canvas-app, dataverse]
keypoints:
  - "Canvas apps only run offline in the native Power Apps Mobile players on iOS, Android and Windows, not in a browser."
  - "For Dataverse apps, use the built-in offline-first feature. Turn on Can be taken offline for each table and Can be used offline in the app settings."
  - "By default Dataverse stores the last update to each column, so a sync does not fail on conflicting changes. Server-side plug-ins and validation can still revert changes."
  - "Rejected changes are written to the Sync Error table. Learn suggests a model-driven app or a cloud flow to review and notify."
  - "LoadData and SaveData do not resolve merge conflicts. Conflict handling is up to the maker's own formulas."
faq:
  - q: "Can a canvas app work offline in a web browser?"
    a: "No. Microsoft Learn states that offline capability for canvas apps is available in the native Power Apps Mobile players on iOS, Android and Windows. Canvas apps running in web browsers cannot run offline, even in a browser on a mobile device."
  - q: "How does Dataverse offline resolve conflicting changes?"
    a: "Microsoft Learn says updates to each column are pushed to Dataverse when the network returns and the last update to each column is stored, so the sync does not fail because of conflicting changes. Server-side plug-ins and validation can invalidate changes, which are reverted locally and logged in the Sync Error table."
  - q: "Do the conflict detection settings in the admin center apply to canvas apps?"
    a: "No. The Learn page on resolving sync conflicts says the conflict resolution settings do not apply to canvas apps. The Enable conflict detection for mobile offline synchronization option applies to model-driven apps."
  - q: "What are the main limits of offline canvas apps?"
    a: "Learn lists, among others, standalone canvas apps only, no non-Dataverse connectors such as SharePoint, no virtual or elastic tables, no Power Automate flows offline, a limit of 3,000,000 synced records, and no many-to-many relationships. The Relate and Unrelate functions are not supported."
---

For a canvas app that must work offline with its data, use Dataverse and the built-in offline-first feature rather than building your own cache. You turn offline on for the tables and for the app, choose an offline profile, and Power Apps syncs changes in both directions. Microsoft documents a simple conflict model for this route, plus a Sync Error table for changes the server rejects. The hand-built route with `LoadData` and `SaveData` is simpler but leaves conflict handling entirely to you.

## Know the platform limits first

Microsoft Learn sets these ground rules:

- Offline works only in the native **Power Apps Mobile** players on iOS, Android and Windows. Canvas apps in a browser cannot run offline.
- Offline-first works for **standalone canvas apps** only, not embedded apps, custom pages or apps in Teams.
- Non-Dataverse connectors, such as SharePoint, are not supported in offline mode. Learn suggests importing Excel, CSV or SharePoint list data into Dataverse first.
- Virtual tables and elastic tables are not supported. Power Automate flows are not supported in offline mode.
- The total number of synced records is limited to 3,000,000, including hidden tables used for offline.
- Many-to-many relationships are not supported. Lookup filters go one level deep, and self-referential lookups are not supported. `Relate` and `Unrelate` are not supported.
- Data syncs regularly only while Power Apps runs in the foreground with the screen unlocked.

## Step 1: Allow tables to go offline

1. Sign in to Power Apps and select **Tables**.
2. Select a table, then **Edit** > **Edit table properties**.
3. Under **Advanced options**, find **Rows in this table** and select **Can be taken offline**.
4. Select **Save**.

## Step 2: Turn on offline in the app

1. In Power Apps Studio, open the app and select **Settings** > **General**.
2. Turn on **Can be used offline**. If the option is missing, the app must be in a solution.
3. Choose a profile: **Auto-generated** or a custom mobile profile.
4. Save and publish the app.

The auto-generated profile downloads all tables used in the app, and Learn calls it a starting point that can be resource-intensive. It also does not handle filters, so every row the user can access is downloaded. A custom profile lets you add only the relevant tables, filters and columns. Publish the profile before you select it, and publish the app again after editing a profile. Users with only the Basic User role cannot open an offline app. Learn describes a custom security role with read privileges on the Canvas App, Mobile offline profile and Sync Error tables.

An Offline template page is inserted automatically. Its globe icon uses `Connection.Sync` to show states such as connected, pending upsync or error, and `ShowHostInfo(HostInfo.OfflineSync)` opens the device status page.

## Step 3: Understand how conflicts are handled

Learn describes the default behavior:

- Updates to each column are pushed to Dataverse as soon as the network is available.
- The last update to each column is stored, so the sync does not fail because of conflicting changes.
- Server-side plug-ins and validation can invalidate changes. Those changes are reverted locally, and an error is written to the **Sync Error** Dataverse table.

The conflict detection option in the Power Platform admin center applies to model-driven apps. Learn says the conflict resolution settings do not apply to canvas apps. If you need rules beyond last update per column, the pages read do not describe a built-in per-record merge for canvas apps.

## Step 4: Surface sync errors

The Sync Error table holds columns including Error Time, Error Message, Error Type, Record, Owner and Error Code. Learn suggests:

- Giving users a role with read access to the table.
- Building a model-driven app that lists errors by user and offers **Retry changes**.
- Creating an automated cloud flow with the Dataverse trigger **When a row is added, modified or deleted** that sends an email or a device notification. The Owner column of the Sync Error row gives you the user to notify.
- Setting up the device status page in canvas apps, which is not out of the box as in model-driven apps.

For on-device messages, Learn's troubleshooting article lists errors such as a timeout calculating data to download for a table, no profile assigned to the user, and a record count above the supported limit. Typical actions are simplifying profile filters and reducing the records the profile downloads. The "no profile assigned" message refers to the user and app module, which are model-driven concepts, and the page does not say how it applies to canvas apps, so confirm with your admin. The canvas setup article says not to add users under Users with offline access, because that setting applies only to model-driven apps. That page describes canvas sync errors as appearing in a dialog when the app is first opened and labels canvas support there as preview, so confirm the current status in the documentation.

## Step 5: Design for performance

Learn's best practices for offline apps include:

- Use a view for related-table columns instead of a lookup.
- Set a gallery's Items directly to filtered Dataverse data rather than copying into a collection.
- Bulk patch a collection instead of patching records one by one.
- Configure only necessary tables for offline, and test airplane mode behavior against online data.
- Roll out in phases and move to a manual profile if first sync takes too long.
- The limitations page adds that without an explicit sort, gallery items may appear in a different order offline, so choose a sort order.

## The alternative: LoadData and SaveData

For apps without Dataverse, Learn describes storing collections on the device with `LoadData` and `SaveData`, checking `Connection.Connected`, queuing writes in a collection and syncing with a timer. Limits: they operate on in-memory collections, generally 30 to 70 MB available, and **they do not automatically resolve merge conflicts**. Configuration on what is saved and how to handle reconnection is up to the maker. Canvas apps in Teams are limited to 1 MB through these functions. A collection filled by `LoadData` cannot update Dataverse data that includes a lookup field.

## Before you move to production

If you use ALM, test the offline profile for all use cases in the target environment. Learn adds that ALM is not currently supported for auto-generated profiles, and that the offline profile is a dependency of the app and must be in the exported solution.

## Related

- [Power Apps](https://www.m365.fm/entity/power-apps/)
- [Canvas app](https://www.m365.fm/entity/canvas-app/)
- [Dataverse](https://www.m365.fm/entity/dataverse/)

## Sources

- [Microsoft Learn: Develop offline-capable canvas apps](https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/offline-apps)
- [Microsoft Learn: Mobile offline for canvas apps overview](https://learn.microsoft.com/en-us/power-apps/mobile/canvas-mobile-offline-overview)
- [Microsoft Learn: Set up mobile offline for canvas apps](https://learn.microsoft.com/en-us/power-apps/mobile/canvas-mobile-offline-setup)
- [Microsoft Learn: Resolve sync conflicts](https://learn.microsoft.com/en-us/power-apps/mobile/resolve-sync-conflicts)
- [Microsoft Learn: Mobile offline limitations for canvas apps](https://learn.microsoft.com/en-us/power-apps/mobile/limitations-canvas-apps)
- [Microsoft Learn: Best practices for developing an app for offline use](https://learn.microsoft.com/en-us/power-apps/mobile/best-practices-offline)
- [Microsoft Learn: Troubleshoot offline sync errors in the Power Apps mobile app](https://learn.microsoft.com/en-us/troubleshoot/power-platform/power-apps/mobile-apps/mobile-offline-troubleshooting)
