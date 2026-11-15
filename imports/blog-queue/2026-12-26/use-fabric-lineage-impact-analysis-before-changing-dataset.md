---
title: "Use Fabric Lineage and Impact Analysis Before Changing a Dataset"
summary: "Open the Fabric lineage view and run impact analysis before changing a semantic model or other item: what each shows, who can use them, how to notify workspace contacts, and the limits Microsoft Learn names."
status: review
publish: false
author: mirko-p
date: 2026-12-26
topics: [fabric]
keypoints:
  - "Lineage view shows the items in a workspace and how they connect, plus upstream data sources outside the workspace one level up. Downstream items in other workspaces are not shown."
  - "Impact analysis shows workspaces and items that could be affected by a change. You can notify the contacts of all impacted workspaces."
  - "You need write permissions on an item to run impact analysis on it. Other affected items appear as Limited access."
  - "Any user with a role in the workspace can open its lineage view. Viewers do not see data sources."
  - "Lineage between semantic models and dataflows is displayed correctly only when the connection uses the Get Data UI and the Dataflows connector."
faq:
  - q: "Does lineage view show items in other workspaces?"
    a: "According to Microsoft Learn, it shows upstream data sources outside the workspace, one level up. Downstream items in other workspaces are not shown. To explore downstream connections outside the workspace, use impact analysis."
  - q: "What do I need to run impact analysis?"
    a: "Write permissions on the item. Learn says you see real names only for workspaces and items you can access, and other affected items appear as Limited access."
  - q: "Can I choose how far downstream to look?"
    a: "Yes. Choose Child items for direct children only or All downstream items. Each tab shows the number of affected items and workspaces. For data sources, only direct children are shown."
  - q: "Who gets the notification?"
    a: "Select Notify contacts, enter details about the change and select Send. The email goes to the contact lists of all impacted workspaces, including workspaces you cannot access, and shows your name so recipients can reply."
  - q: "Can viewers see data sources in lineage?"
    a: "No. Any user with a role in the workspace can open lineage view, but users with the Viewer role do not see data sources."
---

Before you rename, move or rebuild a Fabric item such as a semantic model, check who depends on it. Lineage view shows how items connect, and impact analysis lists what a change could affect and lets you warn the owners. This guide follows two Microsoft Learn pages.

## Lineage view

Learn says lineage is reachable from the workspace toolbar, from an item's option menu, for example in the OneLake catalog, and from the menu at the top of an item's details page. The page does not give exact menu labels, because they appear only in screenshots.

### What it shows

- All items in the workspace and how they connect.
- Upstream data sources outside the workspace, one level up. An external item's card shows the name of its workspace.
- Data sources for semantic models and dataflows, with identifying details such as the database name for Azure SQL.
- Downstream items in other workspaces are not shown.

To highlight related items, select the arrow at the bottom-right corner of an item's card. Fabric highlights related items and dims the rest. The view is an interactive canvas with pan, zoom, a full-screen option, keyboard navigation and screen reader support.

### Permissions and limits

Any user with a role in the workspace can open lineage view. Users with the Viewer role do not see data sources. Lineage view is not available in Internet Explorer. Lineage between semantic models and dataflows is displayed correctly only when the connection is set up through the **Get Data** UI and the **Dataflows** connector. It is not guaranteed for manually created Mashup queries.

## Impact analysis

Impact analysis shows the workspaces and Fabric items that could be affected when you change, or are considering changing, an item. You open it from the item's card in lineage view, or from the item's details page under **Lineage**. The page names these entry points without exact button labels.

- **Scope:** choose **Child items** (direct children only) or **All downstream items**. Each tab shows the number of items and workspaces affected.
- **Grouping:** **Browse by item type** or **Browse by workspace**.
- **Data sources:** only direct children are shown, and the connection string is shown. To go further, run impact analysis on the direct children.

## Notify contacts

1. In the side pane, select **Notify contacts**.
2. Enter details about the change in the text box.
3. Select **Send**.

The email goes to the contact lists of all impacted workspaces, including workspaces you cannot access. Your name appears so recipients can reply in a new thread.

## Permissions and privacy

You need write permissions on an item to run impact analysis on it. You see real names only for items and workspaces you can access. Other affected items appear as **Limited access**, because item names may contain personal information. The pane may show a count of items with limited access.

## Accessibility and navigation

The lineage canvas supports keyboard navigation and screen readers. Learn notes that the tab order follows a depth-first traversal, which can differ from the visual layout, so do not assume the order matches what you see. You can pan and zoom with the mouse or touchpad, with the controls in the bottom-right corner, or switch to the full-screen option for large workspaces.

## Reading the results

In impact analysis, the counts on each tab tell you how many items and workspaces sit downstream. A high number of workspaces is a sign to notify contacts before you change anything. Items with limited access are affected items you cannot open, so a change can reach content you cannot see. This reading is my advice, based on the page, not a Microsoft rule.

## A routine before a change

This routine is my advice, built from the pages, not a Microsoft procedure.

1. Open lineage view for the workspace and find the item.
2. Run impact analysis with **All downstream items** and note the affected workspaces.
3. Use **Notify contacts** with the planned change and date.
4. Make the change in a test workspace first if you can, then in production.

## Not covered

The impact analysis page does not describe item or workspace owners beyond contact lists, refresh impact, supported item types or numeric limits. The lineage page does not list supported item types or volume limits.

## Related

- [Microsoft Fabric](https://www.m365.fm/entity/fabric/)

## Sources

- [Lineage in Fabric (Microsoft Learn)](https://learn.microsoft.com/fabric/governance/lineage)
- [Impact analysis (Microsoft Learn)](https://learn.microsoft.com/fabric/governance/impact-analysis)
