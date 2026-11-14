---
title: "How to Use Deployment Slots in Azure App Service for Zero-Downtime Releases"
summary: "Use Azure App Service deployment slots for staged releases: required tiers, adding a slot, what a swap does, sticky slot settings, swap with preview, auto swap, traffic routing, warm-up and rollback by swapping back."
status: review
publish: false
author: mirko-p
date: 2027-01-08
topics: [azure-app-service, azure-app-service-plan]
keypoints:
  - "Slots need a Standard, Premium or Isolated App Service plan. A slot is a live app with its own host name, and a swap exchanges content and configuration between two slots."
  - "A swap applies target settings to the source, restarts and warms up the source, then switches routing. The target stays online, so keep production as the target."
  - "Mark app settings and connection strings as Deployment slot setting to keep them in a slot. Some settings, such as custom domains and scale settings, never swap."
  - "Swap with preview pauses after the first phase so you can validate. Auto swap is not supported for Linux web apps or Web App for Containers."
  - "To roll back, swap the same two slots again."
faq:
  - q: "Which tiers support deployment slots?"
    a: "Microsoft Learn says Standard, Premium or Isolated App Service plan tiers. Lower tiers cannot use multiple slots. The page states that Standard supports five slots and refers to the limits page for the others."
  - q: "What happens during a swap?"
    a: "App Service applies the target slot's slot-specific settings to the source instances, restarts them, warms them up, and then swaps the routing rules. The source ends up holding the previous production app. The target stays online throughout."
  - q: "How do I keep a setting from swapping?"
    a: "In the slot's Environment Variable settings, add or edit a setting and select Deployment slot setting. Connection strings and mounted storage accounts can also be made slot-specific."
  - q: "How do I roll back?"
    a: "Learn says to swap the same two slots again immediately to restore the pre-swap state."
  - q: "Can I send some users to a slot?"
    a: "Yes. Set Traffic % for the slot on the Deployment slots page. Routed clients are pinned for one hour or until they delete cookies. You can also use the x-ms-routing-name query parameter."
---

A deployment slot is a live copy of your app with its own host name. You deploy to the slot, let it warm up and then swap it into production, so users never hit a cold app. This guide follows the Microsoft Learn page Set Up Staging Environments for Azure App Service. The page also has Azure CLI and Azure PowerShell tabs for adding, swapping and deleting slots, which this guide does not reproduce.

## Requirements and basics

- Slots are separate live apps used alongside the default production slot. Content and configuration can be swapped between two slots, including production.
- You need a Standard, Premium or Isolated App Service plan tier. Use **Upgrade** on the Scale tab if the app is on a lower tier.
- No extra charge is stated for slots. Counts vary by tier. The page names only the Standard limit of five slots and refers to the App Service limits page for the rest.
- Slot URL form: `sitename-slotname.azurewebsites.net`. Site name up to 40 characters, slot name up to 19, and the combined length must be fewer than 59.

## Add a slot

1. Open the app and go to **Deployment** > **Deployment slots** > **Add**.
2. Name the slot. Optionally clone configuration from an existing slot: app settings, connection strings, language framework versions, web sockets, HTTP version and platform bitness.
3. Select **Add**, then **Close**.

The new slot has **Traffic %** set to 0, so all customer traffic goes to production. A new slot has no content even if settings are cloned. Deploy with Git, from another branch or repo, or with a publish profile. A private endpoint is not cloned.

## What a swap does

1. App Service applies the target slot's slot-specific app settings, connection strings, continuous deployment settings and authentication settings to all source instances. This restarts them.
2. It waits for every source instance to restart. If any fails, changes to the source are reverted and the swap stops.
3. If local cache is enabled, it sends an HTTP request to `/` on each source instance, which causes another restart.
4. With auto swap and custom warm-up, it runs `applicationInitialization`. Otherwise it sends an HTTP request to the application root, and any response counts as warmed up.
5. When all instances are warm, it swaps the routing rules.
6. The source now holds the previous production app, and App Service applies settings and restarts its instances again.

Initialization happens on the source slot, and the target stays online. Keep production as the target. Former production instances are recycled at the end, so long-running operations are abandoned, including in function apps. Write fault-tolerant code.

## Settings that swap and settings that stay

**Swapped (not slot-specific):** language framework versions, 32-bit or 64-bit platform, WebSockets, app settings and connection strings unless marked slot-specific, mounted storage unless marked slot-specific, handler mappings, public certificates, WebJobs content, hybrid connections, service endpoints, Azure CDN and path mappings.

**Not swapped:** protocol settings such as Https Only and TLS version, publishing endpoints, custom domain names, nonpublic certificates, scale settings, WebJobs schedulers, IP restrictions, Always On, diagnostic log settings, CORS, managed identities, settings ending in `_EXTENSION_VERSION`, Service Connector settings and virtual network integration.

Some of these can be made swappable with the setting `WEBSITE_OVERRIDE_PRESERVE_DEFAULT_STICKY_SLOT_SETTINGS` set to 0 or false on every slot. All marked settings then switch together.

To make an app setting stick to a slot, open the slot's **Settings** > **Environment Variable**, add or edit the setting, select **Deployment slot setting** and **Apply**.

## Swap with preview

Select **Perform swap with preview**. App Service pauses after step 1 so you can validate the source with the target's settings. Then choose **Complete Swap** or **Cancel Swap**. It is not available when site authentication is enabled in one of the slots. A half-done swap blocks other changes with the message that the slot's configuration settings have been prepared for swap. Complete or cancel it.

## Auto swap

On the source slot, set **Auto swap enabled** to **On** and pick the **Auto swap deployment slot** under **Settings** > **Configuration** > **General settings**. Each code push to the source triggers a swap after warm-up. Learn recommends testing with a nonproduction target first. Auto swap is not supported for web apps on Linux or Web App for Containers.

## Route some traffic to a slot

Set **Traffic %** between 0 and 100 on **Deployment slots** and save. Routed clients are pinned for one hour or until cookies are deleted. The `x-ms-routing-name` cookie shows `staging` or `self`. You can also route manually with the `x-ms-routing-name` query parameter.

## Warm-up and failures

- Warm-up settings: `WEBSITE_SWAP_WARMUP_PING_PATH` (default `/`), `WEBSITE_SWAP_WARMUP_PING_STATUSES` and `WEBSITE_WARMUP_PATH`.
- Each swap HTTP request times out after 90 seconds and is retried up to five times.
- URL rewrite rules can block warm-up requests.
- Check the activity log for Swap Web App Slots when a swap fails.

## Roll back

Swap the same two slots again immediately to restore the state before the swap.

## What the page does not say

The slot counts for Premium and Isolated tiers (the page refers to the App Service limits page) and the permissions needed beyond a pointer to the resource provider operations list (search for slot). The page shows Azure CLI and Azure PowerShell commands, a sample `Web.config` fragment for `applicationInitialization` and an Azure Resource Manager template for swapping with `buildVersion` and `targetBuildVersion`, but this guide does not repeat them. For more detail on customizing `applicationInitialization`, the page points to a blog post.

## A release routine

This routine is my advice, built on the page.

1. Deploy to the staging slot.
2. Mark settings that differ between slots as slot settings.
3. Use swap with preview for risky releases.
4. Swap, then watch the app.
5. Keep the previous version in the staging slot so you can swap back.

## Typical mistakes (my advice)

- Expecting custom domains or scale settings to follow a swap.
- Forgetting that a new slot is empty.
- Choosing a production slot as the swap source.
- Leaving a swap with preview unfinished.

## Related

- [Azure App Service](https://www.m365.fm/entity/azure-app-service/)
- [Azure App Service plan](https://www.m365.fm/entity/azure-app-service-plan/)
- [Azure Monitor](https://www.m365.fm/entity/azure-monitor/)

## Sources

- [Set Up Staging Environments (Microsoft Learn)](https://learn.microsoft.com/azure/app-service/deploy-staging-slots)
