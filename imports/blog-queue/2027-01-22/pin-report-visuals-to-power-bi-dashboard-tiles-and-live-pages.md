---
title: "How to Pin Report Visuals and Live Pages to a Power BI Dashboard"
summary: "Pin a single visual or a whole report page from a Power BI report to a dashboard: steps in the service, why Pin to a dashboard can be missing, how live tiles differ from visual tiles, and the formatting and interactivity limits, per Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2027-01-22
topics: [power-bi, power-bi-service]
keypoints:
  - "Dashboards exist only in the Power BI service. You cannot create them in Power BI Desktop or the mobile apps, but you can view and share them on mobile."
  - "Open the report in Editing view, hover over a visual and select the pin icon. Then choose an existing or a new dashboard."
  - "Pinning a whole page, via More options and Pin to a dashboard, creates live tiles you can interact with on the dashboard."
  - "You cannot pin from reports that are only shared with you. Without edit permission the Pin to a dashboard option does not appear."
  - "Pinned tiles ignore border, shadow, background and title formatting, and conditional formatting is not applied."
faq:
  - q: "How do I pin a visual to a dashboard?"
    a: "According to Microsoft Learn, open the report in the Power BI service and select Edit for Editing view, hover over a visualization and select the pin icon. Choose an existing dashboard from the dropdown or enter a name for a new one, then select Pin. After the Pinned to dashboard message, select Go to dashboard. If prompted to save the report, select Save."
  - q: "How do I pin a whole report page?"
    a: "Open the report, go to the page, and with no visualization selected open the More options menu in the upper-right corner and select Pin to a dashboard. Choose an existing or new dashboard and select Pin live. The tiles are live, so changes in the report editor, such as a filter or different fields, are reflected in the dashboard tile when the page is refreshed."
  - q: "Why is Pin to a dashboard missing?"
    a: "Learn says you need edit permissions for the report. You cannot pin tiles from reports that are shared with you or reports where you only have view access. Shared dashboards also do not appear in the existing dashboard dropdown, and pinning live tiles works only in the Power BI service."
  - q: "Why does my pinned tile look different from the report visual?"
    a: "Learn lists that the pinned tile ignores border, shadow and background settings and all title and subtitle formatting apart from the text. Card visuals use the DIN font family with black text, conditional formatting is not applied and fonts outside the supported list are not applied. A custom dashboard theme can change the text color for all tiles."
  - q: "Do buttons and slicers work on a dashboard tile?"
    a: "Button visuals that trigger bookmarks or apply or clear filters have no action in a dashboard tile, because the tile is a snapshot and a hyperlink. If you pin just a visual, filters and slicers might not persist or apply the same way. Live tiles from a pinned page can be interacted with on the dashboard, but they are not interactive in the Power BI mobile apps."
---

To put a report visual on a dashboard, open the report in the Power BI service, switch to Editing view, hover over the visual and select the pin icon. You can pin one visual at a time or a whole page as live tiles. Dashboards are a Power BI service feature, so the whole process happens in the browser. This article follows two Microsoft Learn pages: creating a dashboard from a report, and pinning an entire report page.

## Before you start

Learn gives these ground rules:

- Dashboards are a feature of the Power BI service, not Power BI Desktop. You cannot create dashboards in the Power BI mobile apps, but you can view and share them there.
- You need edit permission on the report. Reports that are shared with you do not allow pinning, and the **Pin to a dashboard** option does not show for view-only access.
- Dashboards that were shared with you do not appear in the **Existing dashboard** dropdown.

## Pin a single visual

1. Open the report and select **Edit** to open Editing view.
2. Hover over the visualization and select the pin icon.
3. In the **Pin to dashboard** window, choose **Existing dashboard** and pick one from the dropdown, or choose **New dashboard** and enter a name.
4. Select **Pin**. For a new dashboard, Power BI creates it in the current workspace.
5. When the **Pinned to dashboard** message appears, select **Go to dashboard**. If you are asked to save the report, select **Save**.

The new dashboard opens with one tile, the visual you pinned. Select the tile to return to the report. To add more tiles, pin again and pick **Existing dashboard**.

## Pin an entire report page

Pinning a page adds more than one visualization at a time, and the tiles are live. Steps from the page:

1. Open a report in the Power BI service and go to the page you want.
2. With no visualization selected, open **More options** (...) in the upper-right corner of the report and select **Pin to a dashboard**.
3. In the dialog, choose an existing or a new dashboard. The dialog notes that pinning the live page lets changes to the report appear in the dashboard tile when the page is refreshed.
4. Select **Pin live**. A success message appears near the top right.

On the dashboard you can rename, resize, link and move the live tile. Selecting a bar in a chart cross-filters and cross-highlights the other visuals in that tile. Report tiles are not interactive in the Power BI mobile apps.

## Visual tile or live page

| | Pinned visual | Pinned page (live) |
| --- | --- | --- |
| What you pin | One visualization | A whole report page |
| Interaction on the dashboard | A snapshot and a hyperlink back to the report | You can interact with the tiles on the dashboard |
| Report changes | A change from line to bar chart in the report does not change the tile type, though data may refresh | Changes such as a filter or different fields appear when the page is refreshed |
| Slicers and filters | Might not persist or apply the same way | Can respond across tiles pinned from a live page |

The last row follows Learn's statement that a slicer across tiles works only if each tile was pinned from a live page.

## What changes when you pin

The Learn page lists many limitations. The ones people notice first:

**Formatting**
- Border, shadow and background settings are ignored, and so are title and subtitle formatting other than the text.
- Card values use the DIN font family with black text. A custom dashboard theme can change the text color for all tiles.
- Conditional formatting is not applied, and custom fonts outside Power BI's supported list are not applied.
- When you pin, you can keep the report theme or use the dashboard theme. Some tiles can lose formatting when the dashboard theme is applied.

**Interactivity**
- Button visuals that trigger bookmarks or clear or apply filters do nothing in a tile.
- Viewers of a dashboard often cannot move or resize tiles.

**Visual types and size**
- Some custom visuals, certain slicer visuals or unsupported visuals might not pin.
- Visuals adjust to the tile size, so the layout can differ from the report.
- A large background image can stop a pin. Learn suggests reducing the image size or compressing it.
- You can pin visuals from different reports or datasets onto one dashboard, but you cannot create new visuals on the dashboard that combine data from different datasets.

**Dashboard limits**
- A dashboard has one page, while a report can have many.

## Checks when a pin fails (my advice)

This order is my suggestion, not a Microsoft procedure:

1. Check your role and whether the report is yours or shared with you.
2. Confirm you are in the Power BI service and in Editing view, not Desktop.
3. Check the visual type, since unsupported visuals might not pin. Try pinning a standard visual from the same page as a test.
4. If a background image is involved, test a smaller image.
5. If the tile looks wrong, compare it against the formatting list above before you change the report.

## What the pages leave open

The Learn page says dashboard tile refresh and behavior might depend on dataset refresh and cache. It gives no schedule, and this article states no refresh timing.

## Related

- [Power BI](https://www.m365.fm/entity/power-bi/)
- [Power BI service](https://www.m365.fm/entity/power-bi-service/)

## Sources

- [Create a Power BI dashboard from a report (Microsoft Learn)](https://learn.microsoft.com/power-bi/create-reports/service-dashboard-create)
- [Pin an Entire Report Page to a Power BI Dashboard (Microsoft Learn)](https://learn.microsoft.com/power-bi/create-reports/service-dashboard-pin-live-tile-from-report)
