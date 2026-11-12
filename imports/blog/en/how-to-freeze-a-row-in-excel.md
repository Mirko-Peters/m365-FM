---
title: "How to Freeze a Row in Excel: Top Row, Several Rows, Columns"
summary: "How to freeze a row in Excel: use View, Freeze Panes, Freeze Top Row or select the cell below the rows you want to keep. Also columns, unfreezing and fixes."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [excel]
keypoints:
  - "To freeze the top row, go to View, Freeze Panes, Freeze Top Row. The row stays visible while you scroll down."
  - "To freeze several rows or rows and columns, select the cell below and to the right of what you want to keep, then choose View, Freeze Panes, Freeze Panes."
  - "Freeze Panes always locks the rows above and the columns to the left of the selected cell, so the cell you pick decides everything."
  - "To undo it, choose View, Freeze Panes, Unfreeze Panes. The same menu item switches between freezing and unfreezing."
  - "If the commands are grayed out, switch from Page Layout to Normal view on the View tab, and remove any split you added earlier."
faq:
  - q: "How do I freeze the top row in Excel?"
    a: "Open the View tab, select Freeze Panes, then choose Freeze Top Row. Excel keeps row 1 in view and draws a slightly darker line under it. You don't have to select a cell first. Scroll down to check that your headers stay in place."
  - q: "How do I freeze more than one row in Excel?"
    a: "Select the cell in column A that sits directly below the last row you want to keep, for example A3 to keep rows 1 and 2. Then choose View, Freeze Panes, Freeze Panes. Excel freezes every row above the selected cell and every column to its left."
  - q: "How do I unfreeze rows in Excel?"
    a: "Go to the View tab, open Freeze Panes and choose Unfreeze Panes. All frozen rows and columns scroll normally again. If you want to split the window instead of freezing it, that is a different command, Split, on the same tab."
---
To freeze a row in Excel, open the **View** tab, select **Freeze Panes** and choose **Freeze Top Row**. The first row then stays on screen while you scroll down through the rest of the sheet. To freeze more than one row, select the cell below the last row you want to keep and choose **Freeze Panes** > **Freeze Panes**. This article is for people who work with long lists in [Excel](https://www.m365.fm/entity/excel/) and keep losing track of which column is which. You'll learn the three ways to freeze, how Excel decides what to lock, how to undo it, and what to check when the commands don't respond.

Microsoft's article on how to [freeze panes to lock rows and columns](https://support.microsoft.com/en-us/excel/get-started/freeze-panes-to-lock-rows-and-columns) states the core rule in one line: Freeze Panes freezes the rows above and the columns to the left of the selected cell. Keep that in mind and the rest of this guide takes care of itself.

## Freeze the top row

This is the case most people need: a header in row 1 and hundreds of rows of data below it.

1. Open the worksheet.
2. Go to the **View** tab.
3. Select **Freeze Panes**, then **Freeze Top Row**.

A thin line appears under row 1. Scroll down and the header stays where it is while the rest of the data moves. On a Mac, Microsoft's article for [Excel for Mac](https://support.microsoft.com/en-us/excel/freeze-panes-to-lock-the-first-row-or-column-in-excel-for-mac) puts the buttons on the **View** tab too, and describes a slightly darker border under row 1 as the sign that it worked. You do not need to select anything beforehand.

Check that row 1 really holds the headers. If your sheet has a title in row 1 and the column names in row 2, Freeze Top Row would lock only the title. Use the next method for that.

## Freeze the first column

Wide sheets have the opposite problem. You scroll right and lose the names or IDs in column A.

1. Go to the **View** tab.
2. Select **Freeze Panes**, then **Freeze First Column**.

A line appears to the right of column A. Scroll right and column A stays. As with the top row, nothing needs to be selected first.

## Freeze several rows, or rows and columns

When the headers sit in two or more rows, or when you want a row and a column locked together, you use the plain **Freeze Panes** command. What it locks depends on where your cursor is.

1. Decide which rows and columns must stay visible.
2. Click the cell directly below the last row you want to keep and directly to the right of the last column you want to keep.
3. Go to **View** > **Freeze Panes** > **Freeze Panes**.

A few examples make the rule clear:

- To keep rows 1 and 2, click **A3**. Everything above row 3 is frozen, and because you're in column A, no column is frozen.
- To keep row 1 and column A together, click **B2**.
- To keep the first two columns, select the third column, as Microsoft's example does. Then choose **Freeze Panes**.
- In the Mac article, selecting **D5** freezes the top four rows and the leftmost three columns.

If you click in the wrong place, nothing is lost. Unfreeze and try again. The most common slip is clicking the last header row itself instead of the row below it. The header row you clicked then scrolls away.

One practical limit: freeze only what you need. Each frozen row takes space from the visible part of the window. If you lock many rows, or work on a small laptop screen, you may be left with room to scroll through only a few rows of data.

## Three layouts and the cell to click

The same command gives different results depending on the layout. Here are the three you'll meet most often.

**A plain list.** Headers in row 1, data from row 2 down. Use **Freeze Top Row**. There's nothing to select and nothing to calculate.

**A list with a title.** Row 1 holds a report title, row 2 is empty or holds a date, row 3 holds the column names, and the data starts in row 4. You want rows 1 to 3 to stay visible. Click **A4**, the first cell below the header row, and choose **Freeze Panes** > **Freeze Panes**. You can't freeze row 3 alone, because the rule always locks everything above the selected cell. If the title rows eat too much screen space, move the title out of the sheet's top rows and freeze just the header.

**A wide report with row labels.** Column A holds the account names, row 1 holds the months, and there are twelve or more months to the right. Click **B2** and choose **Freeze Panes**. Now both the month names and the account names stay in view, and you can scroll in either direction. This is the layout where freezing pays off most, because you can always read a number in the bottom right corner against its row and column label.

## A quick way to choose

1. Is there only one header row in row 1, and nothing to the left that matters? Use **Freeze Top Row**.
2. Is there only a label column to keep? Use **Freeze First Column**.
3. Do you need a row and a column, or more than one row? Click the cell below and to the right of what you want to keep, then use **Freeze Panes**.
4. Do you want two distant parts of the sheet visible at once? Use **Split** instead.
5. Is the result wrong? Go to **Unfreeze Panes**, fix the cell and try again.

## Unfreeze rows and columns

Go to **View** > **Freeze Panes** > **Unfreeze Panes**. All frozen rows and columns scroll normally again. The command sits in the same drop-down as the freeze options. After you unfreeze, the cell you selected doesn't matter any more. Pick a new one and freeze again if you want a different layout.

## Freeze panes versus Split

The View tab also has a **Split** command, and the two get mixed up. Microsoft's article on [splitting panes](https://support.microsoft.com/en-us/excel/split-panes-to-lock-rows-or-columns-in-separate-worksheet-areas) describes how it works: you select the row below, the column to the right, or a cell below and to the right of the split point, and then choose **View** > **Window** > **Split**. The sheet then has separate areas, and each scrolls on its own. Select **Split** again to remove it.

Use Freeze Panes for the normal case, a header that stays put. Use Split when you want to look at two distant parts of the same sheet at once, for example the top of the list and row 180. If you set up a split by accident, remove it before you troubleshoot anything else.

## When freeze panes does not work

Most of the time a freeze fails for one of four reasons.

**The command is grayed out.** Microsoft's Mac article says to go to the **View** tab and select **Normal** if the freeze buttons are grayed out. The same fix is the first thing to try on Windows: if you're in Page Layout view, switch back to Normal view.

**You can't find the View tab.** Microsoft notes that if you don't see the View tab, you may be using Excel Starter, which doesn't support all features.

**The wrong rows are frozen.** You selected the wrong cell. Unfreeze, click the cell below and to the right of the area you want to lock, and freeze again.

**A split is active.** If the window has a split bar in it, select **View** > **Window** > **Split** to remove it, then freeze.

### Excel for the web and mobile

Microsoft's main article doesn't list Excel for the web among its versions and gives no steps for the browser, so there's no verified menu path to quote here. Look at the View tab in your own version. For the mobile apps, Microsoft has a separate article for Excel on iPad and iPhone. On an iPad, tap **View** > **Freeze Panes** and choose the option you need. On an iPhone, tap the ellipsis to show the ribbon, then **Home** > **View**, scroll down and tap **Freeze Panes**. To freeze multiple rows on a phone or tablet, select the row just below the last row you want locked, and then use the same command.

## Common mistakes

- Selecting the header row instead of the row below it, then wondering why the header isn't locked.
- Using Freeze Top Row when the real headers are in row 2 or 3.
- Freezing so many rows that there is hardly any space left to scroll.
- Leaving a split in the window and then trying to freeze on top of it.
- Working in Page Layout view and wondering why the freeze commands are grayed out.
- Forgetting that Freeze Panes is a screen setting. It doesn't repeat the header on printed pages.

## Related topics to explore

- **Headers with merged cells.** A merged title in row 1 freezes like any other row, but merged cells cause other problems. Read our guide on how to merge cells in Excel before you build a header that way.
- **Tables and frozen rows.** How a table header and a frozen row work together when you scroll. Test it on a copy of your sheet.
- **Excel on the web and on phones.** What the View tab offers in your version, since Microsoft's main article doesn't cover the web.
- **Printing headers on every page.** Freeze Panes affects the screen, so look for the page setup option that repeats rows at the top of each printed page.
- **Troubleshooting grayed-out commands.** Most of these come back to view mode, splits or an unsupported edition.

## Next step

Open your biggest worksheet and freeze its header row now. If it has a title above the headers, click the cell below the header row and use Freeze Panes. The next time you scroll past row 500, you will know how to freeze a row in Excel and still see what each column means.
