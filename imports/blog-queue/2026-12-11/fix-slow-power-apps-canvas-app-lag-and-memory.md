---
title: "Slow Power Apps Canvas App: Fix Performance Lag and Memory Bloat in Large Apps"
summary: "A practical checklist for heavy canvas apps: find slow requests with Live monitor, trim startup work, shrink data payloads, move OnStart to named formulas and split oversized apps. Based on Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2026-12-11
topics: [power-apps, power-fx, dataverse]
keypoints:
  - "Measure first. Live monitor shows data operations with HTTP status codes, so slow requests and throttling (429) become visible."
  - "Avoid filling collections with large data. Read-only data should be accessed directly from the source."
  - "Move App.OnStart logic to named formulas in App.Formulas. Microsoft measured Studio load time reductions of as much as 80 percent."
  - "Keep payloads small: delegable queries, explicit column selection and no thousands of records on the first screen."
  - "Microsoft's pages give no memory limit or control count threshold. If an app is too big, partition it into separate apps or custom pages."
faq:
  - q: "How do I find out what makes my canvas app slow?"
    a: "Use Live monitor. In Power Apps open the app, go to Apps, select the app, open the drop-down next to Details, choose Live monitor and select Play published app. Microsoft Learn says it shows data operations and responses including HTTP status codes, for example 429 rate limit errors."
  - q: "Should I put my data into collections at startup?"
    a: "Microsoft Learn advises against populating collections with large data using ClearCollect, because loading must finish before galleries or tables show data. Use collections for small data you need to calculate on, such as an order basket, and read read-only data directly from the source."
  - q: "What does moving App.OnStart to App.Formulas change?"
    a: "OnStart expressions run exactly at app start. Named formulas let Power Apps evaluate them just in time. In the large apps article, Microsoft reports Studio load time reductions of as much as 80 percent in its tests."
  - q: "Is there a memory limit for canvas apps?"
    a: "The pages I read give no memory figures and no control count threshold. They say apps can reach thousands of controls and hundreds of data sources, and that this slows Power Apps Studio. The overview says many successful implementations use more than 100 tables and over 50 screens."
  - q: "How big can a formula be before Studio slows down?"
    a: "Microsoft Learn reports that nearly all apps with long Studio load times have at least one formula over 256,000 characters, and the slowest have formulas over 1 million characters."
---

Heavy canvas apps are usually slow for a handful of reasons: too much work at startup, too much data, repeated calculations, and oversized formulas. Measure with Live monitor, then fix in this order: startup, data, calculations, structure. Microsoft's pages give no memory limits, so the guidance below is about reducing work rather than staying under a number.

## Step 1: Measure with Live monitor

For a published app:

1. Sign in to Power Apps and select **Apps**.
2. Select the app, open the drop-down next to **Details** and choose **Live monitor**.
3. Select **Play published app**.

Live monitor shows events with data operations and their responses, including HTTP status codes. Learn's scenario shows HTTP 429 responses with a rate limit message, which points to too many calls rather than slow formulas. To map events to formulas, turn on **File** > **Settings** > **Debug published app** before publishing. Microsoft warns it can hurt performance for all users, so turn it off afterwards. While authoring, use **Advanced tools** > **Open live monitor**.

## Step 2: Trim what happens at startup

- **Do not fill collections with large data.** Learn says loading must finish before a gallery or table shows data, which slows app load and navigation. Keep collections for small working data and read read-only data from the source.
- **Avoid calling Power Automate to fill a collection.** Learn gives roughly 0.6 seconds of cost to instantiate Power Automate.
- **Use a light first screen.** The first logical screen is bundled with app initialization whether or not users navigate to it, so make `App.StartScreen` point to a screen without galleries or data references. Remove unused screens.
- **Centralize cross-screen references.** Dependencies between screens force the load of additional pages.
- **Check media.** Delete unused media, use smaller SVG instead of PNG where it fits and avoid resolution higher than the device needs.

## Step 3: Replace OnStart with named formulas

Expressions in `App.OnStart` run exactly when the app starts. Named formulas defined in `App.Formulas` are evaluated just in time and can be reused.

```power-fx
FacilitiesList =
    ForAll(
        Facilities,
        { Name: 'Facility Name', Id: Facility }
    );
```

Named formulas are immutable, so keep `Set` for values that change. In Microsoft's tests, moving OnStart logic to named formulas reduced Studio load time by as much as 80 percent.

`Concurrent` runs formulas in parallel and gives modest speedups, but adding many data sources can cause timing and throttling problems. Use it selectively.

## Step 4: Shrink data payloads

- A gallery or table connected to a source pages in small increments, for example 100 records. Delegable queries do this automatically.
- For `CountRows` or `CountIf` on sources that cannot delegate, Power Apps downloads from a default of 500 up to a configured maximum of 10,000 rows. Results can be wrong beyond that limit.
- **Explicit column selection** is on by default for new apps. It can lose column lineage through collections and variables. Force it with `ShowColumns`. Learn's example says needing 10 columns from a 100-column table downloads ten times the data you need.
- Use server-side views, default filters and required search input instead of showing thousands of records on the first screen.
- Do not show images in galleries unless they are Dataverse thumbnails (about 1 KB, stored inline). Other image references, including all SharePoint images, need a separate call.

## Step 5: Fix expensive calculations

- Invert `ForAll(x, Collect(y, {...}))` to `Collect(y, ForAll(x, {...}))` so dependent rules are evaluated once.
- Avoid `Gallery.AllItems` unless you need its values, because each read creates a new output table. Use `Gallery.AllItemsCount` for a count.
- For flexible-height galleries, enforce a minimum `TemplateSize` such as `Max(20, varFoo + rectBar.Height)`, because a value of 0 tries to render everything.
- Use `DelayOutput` on search inputs to avoid reacting to every keystroke.
- Split very long formulas with named formulas, `With` or components. Learn ties slow Studio loading to formulas over 256,000 characters.

## Step 6: Partition an oversized app

The large apps article describes two options: split into separate canvas apps joined by a switchboard component, or build sections as custom pages inside a model-driven app. `Launch` discards the current app state, so pass values with parameters read by `Param`, or save them first.

## Quick triage

| Symptom | Likely area | First action |
|---|---|---|
| Long wait before the first screen | Startup work, first screen | Move OnStart logic to named formulas, lighten the start screen |
| Galleries load slowly | Data volume, images | Use delegable filters, ShowColumns, thumbnails |
| Errors or pauses with HTTP 429 in Live monitor | Too many calls | Reduce calls, avoid Concurrent with many sources |
| Power Apps Studio itself is slow | Very long formulas, huge app | Split formulas, partition the app |
| UI freezes while typing in search | Reacting to each keystroke | Use DelayOutput |

Change one thing at a time and replay the same user path in Live monitor, so you can see which change helped.

## What the pages do not say

No page I read gives a memory limit, a control count threshold or a figure for component library impact. Treat reports of "memory bloat" as a symptom, then use Live monitor and the steps above to find which data, screen or formula causes it.

## Related

- [Power Apps](https://www.m365.fm/entity/power-apps/)
- [Power Fx](https://www.m365.fm/entity/power-fx/)
- [Dataverse](https://www.m365.fm/entity/dataverse/)

## Sources

- [Overview of creating performant apps](https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/common-performance-issue-resolutions)
- [Work with large and complex apps](https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/working-with-large-apps)
- [Fast app and page load](https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/fast-app-page-load)
- [Small data payloads](https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/small-data-payloads)
- [Efficient calculations](https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/efficient-calculations)
- [Monitor canvas apps](https://learn.microsoft.com/en-us/power-apps/maker/monitor-canvasapps)
