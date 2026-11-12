---
title: "Conditional Formatting in Excel: Rules, Formulas and Examples"
summary: "Conditional formatting in Excel colors cells by rule. Learn Highlight Cells, Top/Bottom, data bars, color scales, icon sets, formulas, order and clearing."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [excel, conditional-formatting]
keypoints:
  - "Select your cells and choose Conditional Formatting on the Home tab. You can also use the Quick Analysis button or Ctrl+Q."
  - "Highlight Cells Rules and Top/Bottom Rules cover most everyday needs: Greater Than, Between, Text that Contains, Duplicate Values, Above Average."
  - "For your own logic, choose New Rule, then Use a formula to determine which cells to format. The formula must start with = and return TRUE or FALSE."
  - "Rules run from top to bottom in Manage Rules. When two rules conflict, the higher one wins, and Stop If True halts evaluation."
  - "Conditional formatting can't reference other workbooks, and text criteria are limited to 255 characters."
faq:
  - q: "How do I apply conditional formatting in Excel?"
    a: "Select the cells you want to format, go to the Home tab and select Conditional Formatting. Point to a rule type such as Highlight Cells Rules, pick a rule like Greater Than, enter your value and choose a format. The cells change color as soon as they meet the condition and update when the data changes."
  - q: "How do I use a formula in conditional formatting?"
    a: "Select the range, choose Conditional Formatting, then New Rule, then Use a formula to determine which cells to format. Type a formula that starts with an equals sign and returns TRUE or FALSE, for example =B2<TODAY(). Write it for the first cell of the range, choose a format and select OK."
  - q: "How do I remove conditional formatting in Excel?"
    a: "Select the cells, go to Home, Conditional Formatting, Clear Rules, and choose Clear Rules from Selected Cells. To remove every rule on the sheet, choose Clear Rules from Entire Sheet. Deleting a rule also brings back any manual formatting that the rule was covering."
---
Conditional formatting in Excel changes how a cell looks, its fill color, font or an icon, depending on what's in it. You select the cells, go to the **Home** tab, choose **Conditional Formatting** and pick a rule such as **Greater Than** or **Duplicate Values**. When the data changes, the formatting changes with it. This article is for [Excel](https://www.m365.fm/entity/excel/) users who build reports, trackers or lists and want overdue dates, duplicates or top results to stand out without checking every row by hand. You'll learn the built-in rule types, how to write a formula rule, how rule order works, and how to clear and troubleshoot rules.

The source for most details here is Microsoft's page on how to [use conditional formatting to highlight information in Excel](https://support.microsoft.com/en-us/excel/use-conditional-formatting-to-highlight-information-in-excel). Where I add something that isn't on that page, I say so.

## How to apply conditional formatting in Excel

Microsoft says you can apply conditional formatting to a selected range, a named range or an Excel table. In Excel for Windows it also works on PivotTable reports. There are two ways in.

**From the ribbon.**

1. Select the cells.
2. On the **Home** tab, select **Conditional Formatting**.
3. Point to a rule type, choose a rule and follow the dialog that opens. For most rules it asks for a value or text and a format.

**With Quick Analysis.**

1. Select your data. A small Quick Analysis button appears at the lower-right corner of the selection.
2. Select the button, or press **Ctrl+Q**.
3. On the **Formatting** tab, hover over an option to preview it, then click it. If a **Text that Contains** dialog appears, enter the text and select **OK**.

The options on that tab depend on the data. A selection that contains only text offers choices such as Text, Duplicate, Unique, Equal To and Clear. A numeric selection offers Data Bars, Colors, Icon Sets, Greater, Top 10% and Clear. It's the fastest way to try a look before you commit to it.

The menu on the Home tab is the real toolbox, and the rest of this article follows it: Highlight Cells Rules, Top/Bottom Rules, Data Bars, Color Scales, Icon Sets, New Rule, Manage Rules and Clear Rules. If you want background on the feature itself, see the [conditional formatting](https://www.m365.fm/entity/conditional-formatting/) page.

## Highlight cells with simple rules

**Highlight Cells Rules** are the quick ones. Microsoft lists rules such as Between, Equal To, Text that Contains, A Date Occurring and Duplicate Values (Greater Than and Less Than sit in the same menu). Each one asks a simple question about a cell, and highlights the cells where the answer is yes.

Typical uses:

- **Greater Than** on a sales column to mark everything over a target.
- **Between** to show values in an acceptable range, and the same rule on the outside of the range if you want the outliers.
- **Equal To** for an exact value, such as a status code or a score of 100.
- **Text that Contains** to mark every cell with a word like "late" or a product name. Partial words match too, because the rule looks for the text anywhere in the cell.
- **A Date Occurring** to mark dates that fall in a chosen period. Excel offers presets in the dialog, so pick one there instead of typing a date by hand.
- **Duplicate Values** to mark repeats in a list. It's the quickest check before you build a pivot table or a lookup.

**Top/Bottom Rules** work on ranking: Top 10 Items, Bottom 10 %, Above Average and Below Average. Microsoft's limits for these: the top or bottom number runs from 1 to 1000, or 1 to 100 when you use percent, and percentiles run from 0 to 100 (you type the number without a percent sign).

A small example makes this concrete. Say column C holds order values. Select C2 down to the last row, choose **Highlight Cells Rules** > **Greater Than**, enter your target, and choose a green fill. Add **Less Than** with a floor value and an orange fill on the same cells. Now the strongest and weakest orders stand out, and the middle stays plain. Change a number and the colors move.

## Data bars, color scales and icon sets

These three show how values compare across a range, not whether they pass a test. Microsoft's pages describe them this way:

- **Data Bars** put a bar in each cell. A longer bar means a larger value. You can choose gradient or solid fill, show borders, show bars only and format negative values.
- **Color Scales** use two or three colors. In a two-color scale one color marks high values and the other marks low ones. A three-color scale adds a middle color.
- **Icon Sets** use three to five categories, and each icon covers a range of values. You can reverse the icon order, show icons only, or hide the icon for certain cells with **No Cell Icon**.

The steps are the same for all three: select the cells, go to **Home** > **Conditional Formatting**, point to the type and click a style. Microsoft's page on [data bars, color scales and icon sets](https://support.microsoft.com/en-us/excel/use-data-bars-color-scales-and-icon-sets-to-highlight-data) adds a practical tip: widening a column that has data bars makes the differences between values easier to see. Icon sets can be combined with other conditional formats.

Use them carefully. A column full of three-color scales on top of fills and icons is hard to read. One signal per column is a good habit. Color alone also shouldn't carry the meaning, since some readers can't tell red from green. Icons or a text column help with that, and I'd add one to any report that goes to a wide audience.

For limits on color scales, Microsoft states that the minimum must be less than the maximum, and that the midpoint defaults to 50 percent.

## Build your own rule with a formula

When the built-in rules aren't enough, use **New Rule**. It opens the **New Formatting Rule** dialog, where you select **Use a formula to determine which cells to format**. Microsoft's rule: the formula must start with `=` and return TRUE or FALSE. Cells where it returns TRUE get the format. Test your formula for errors first, and use IS functions or `IFERROR` if errors may appear.

Write the formula for the first cell of the selected range. If the range starts in B2, write it as if you're looking at B2, and Excel applies the same logic to the other cells. This is the part that trips people up, so a dollar sign matters: `$B2` locks the column and lets the row move, which is how you format a whole row based on one column.

Microsoft's examples show what's possible:

- **Expiring dates.** `=B2<TODAY()` for a red fill on expired badges, and `=B2<TODAY()+60` for yellow on badges that expire within 60 days. The red rule must sit higher in the list than the yellow one, or the yellow rule would also catch the expired ones.
- **Alternating rows.** `=MOD(ROW(),2)=1` shades every odd-numbered row.
- **Duplicates.** `=COUNTIF($A$2:$A$400,A2)>1` flags duplicates in A2:A400.
- **Two conditions.** Microsoft's budget example uses `AND` and `OR` to color a result green when a down payment and a monthly payment both fit the budget, and red when either one doesn't.

Notice the pattern in the COUNTIF example: the range is absolute (`$A$2:$A$400`) and the cell being tested is relative (`A2`). That's the shape of most useful formula rules.

If the rule doesn't seem to work, check that the formula really does return TRUE for the first cell, and that you wrote it for the top-left cell of the selection. A rule written for the wrong cell shifts by one row and looks random.

## A worked example: a task tracker

Here's a setup you can copy in five minutes. Column A has task names, column B has due dates, column C has a status such as Open or Done, and column D has hours.

1. Select B2 down to the last row. Add a formula rule with `=B2<TODAY()` and a red fill. This marks everything past due.
2. On the same cells, add `=B2<TODAY()+7` with a yellow fill and move the red rule above it in Manage Rules. Now overdue tasks are red, tasks due within a week are yellow, and the rest stay plain.
3. Select the whole table, A2 to D100, and add a formula rule such as `=$C2="Done"` with a gray font. The dollar sign locks the column, so the whole row turns gray when the status says Done. That formula is my own pattern, not one of Microsoft's examples, but it follows the same rules: it starts with an equals sign and returns TRUE or FALSE.
4. Select D2 down and apply **Data Bars** so the heaviest tasks are easy to see.

Two things can go wrong. If the red rule sits below the yellow one, overdue tasks look yellow, because both are true and the higher rule wins. If the Done rule is on top and you set Stop If True, the date colors on finished tasks disappear, which is probably what you want. Try it on a copy first and change the order to see the effect.

## Control the order of rules

Open **Conditional Formatting** > **Manage Rules** to see the **Conditional Formatting Rules Manager**. Microsoft explains how it works:

- Rules are evaluated from top to bottom, and new rules go to the top by default. **Move Up** and **Move Down** reorder them.
- When rules don't conflict, they all apply. For example, one rule can set a bold font and another a red fill.
- When rules conflict, the higher one wins.
- A conditional format that is true overrides a manual format on the same cells. If you delete the rule, the manual format comes back.
- **Stop If True** halts evaluation once a rule is true. Microsoft says it mimics older Excel behavior. You can't set it on data bar, color scale or icon set rules.

If you see a color you didn't expect, the Rules Manager is where to look.

## Copy, find and clear conditional formatting

- **Copy to other cells.** Use **Format Painter** on the Home tab. Double-click it to paint several areas, and press **Esc** to stop. If the rule uses a formula, check the references afterward.
- **Find formatted cells.** Use **Find & Select** > **Conditional Formatting**, or **Go To Special** > **Conditional formats**.
- **Clear rules.** Select cells, then **Home** > **Conditional Formatting** > **Clear Rules** > **Clear Rules from Selected Cells**, or **Clear Rules from Entire Sheet**.

One limit from Microsoft: pasting formatted cells into another Excel instance doesn't carry the rule over, so copy within one instance if you need the rules to stay.

## Limits and why a rule may not work

- **Another workbook.** Conditional formatting can't reference external workbooks. Bring the data into the file first.
- **PivotTables.** In the Values area of a PivotTable, you can't format by text, by date or by unique and duplicate values. Only number-based rules work there.
- **Long text.** Text criteria are limited to 255 characters.
- **Order.** A higher rule overrides a lower one. Move the more specific rule up.
- **Manual fill.** If a cell has a manual fill and the rule is true, the rule wins. If it looks wrong, check whether the rule is actually true.
- **Excel for the web.** The page I used doesn't list web-specific steps or limits. I wouldn't promise that every rule type behaves the same in the browser. Test on a copy.

## Common mistakes

- Writing the formula for the wrong cell, so the highlight lands one row off.
- Using absolute references (`$A$1`) when you needed a relative one, and coloring everything or nothing.
- Piling rules on rules until nobody knows why a cell is red. Open Manage Rules and clean up.
- Pasting formatted cells into another Excel window and expecting the rules to come along. Microsoft says they don't.
- Relying on red and green alone.
- Applying a rule to a whole column when only 200 rows need it.

## Related topics to explore

- **Highlight duplicates before you remove them.** The Duplicate Values rule is a good check before you clean a list.
- **Dropdown lists and rules together.** Mark a row by the status someone picks from a list.
- **Conditional formatting in PivotTables.** Only number-based rules work in the Values area, so plan your layout.
- **Dashboards.** A mix of data bars, icons and slicers makes a report readable at a glance.
- **Performance on large sheets.** Keep ranges tight and the number of rules small. Microsoft's page doesn't publish numbers, so test with your own data.

## Next step

Open a real sheet and apply one rule with Highlight Cells Rules. Then try a formula rule such as `=B2<TODAY()` on a date column, and open Manage Rules to see how the order works. Keep conditional formatting in Excel simple: one clear signal per column beats a rainbow.
