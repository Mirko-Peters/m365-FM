---
title: "How to Create a Drop-Down List in Excel (Data Validation)"
summary: "How to create a drop down list in Excel with Data Validation: build the list, set the source, add alerts, keep it up to date, and fix common problems."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [excel, excel-online]
keypoints:
  - "Create a drop down list in Excel with Data, Data Validation: choose List under Allow and point the Source box at your list of values."
  - "Put the values in an Excel Table (Ctrl+T) and the drop-down grows when you add items at the end of the list."
  - "Set the Error Alert style: Stop blocks anything not on the list, while Warning and Information still allow other entries."
  - "Validation only checks what people type. Pasting or filling cells can bypass the list, so protect the sheet if the list must be strict."
  - "A drop-down is as wide as its cell, so widen the column if long entries are cut off."
faq:
  - q: "How do I make a drop-down list in Excel?"
    a: "Type your values in a column, select the cell for the drop-down, then choose Data, Data Validation. On the Settings tab pick List under Allow, click the Source box and select your values, then select OK. Leave In-cell dropdown ticked so the arrow shows up in the cell."
  - q: "How do I add items to an Excel drop-down list?"
    a: "It depends on the source. If the list is in an Excel Table, type the new item at the end and the drop-down updates itself. For a named range, add the item and then edit the range under Formulas, Name Manager. For a typed list, change the Source box in Data Validation."
  - q: "Why is my Excel drop-down list not working?"
    a: "Check that Data Validation is available. If the command is greyed out, the sheet may be protected or shared, or you may still be typing in a cell. Then check that the Source points at the right cells, that In-cell dropdown is ticked, and that the column is wide enough to show entries."
---
To create a drop down list in [Excel](https://www.m365.fm/entity/excel/), enter your choices in a column, select the cell that should offer them, open **Data** > **Data Validation**, choose **List** under **Allow** and select your choices as the **Source**. That's all the basic version takes. This article is for Excel users who build trackers, forms, order sheets or templates and want people to pick from fixed values instead of typing. You'll get the step-by-step method, the options that matter in the dialog, three ways to keep the list current, and the places where drop-downs quietly stop working.

The feature behind the list is called data validation. Microsoft's guide to [creating a drop-down list](https://support.microsoft.com/en-us/excel/get-started/create-a-drop-down-list) covers Excel for Microsoft 365, Excel 2024, 2021, 2019 and 2016. The limits and fixes below come from that page, from Microsoft's page on adding or removing items, and from its notes on [data validation in more detail](https://support.microsoft.com/en-us/office/more-on-data-validation-f38dee73-9900-4ca6-9301-8a5f6e1f0c4c).

## Create a drop-down list from a range of cells

A list that reads its values from cells is the version you'll want most of the time. You can see the values, change them in one place and reuse them.

1. **Enter the items.** Type them in one column on a new worksheet, with one value per cell. A header above them is fine, you just won't select it in a moment.
2. **Make it a table (recommended).** Select any cell in the list and press **Ctrl+T**. Microsoft recommends this, because drop-downs built on a table update when you add or remove items.
3. **Select the target cell.** This is the cell where the drop-down should appear. You can also select several cells and give them all the same list.
4. **Open Data Validation.** Go to the **Data** tab and select **Data Validation**.
5. **Choose List.** On the **Settings** tab, open the **Allow** box and select **List**.
6. **Set the source.** Click in the **Source** box, then select your list on the sheet. In Microsoft's example the list sits in A2:A9 on a sheet named Cities, and the header row in A1 is left out so it doesn't become a choice.
7. **Check the boxes.** Leave **In-cell dropdown** ticked, because that shows the arrow. Tick **Ignore blank** if people may leave the cell empty.
8. Select **OK**.

Click the cell. An arrow appears, and the choices open under it. That's the whole method.

If the Data Validation command is greyed out, Microsoft's explanation is that the worksheet may be protected or shared. Unprotect the sheet or stop sharing the workbook and try again. The command is also unavailable while you're typing in a cell, so press **Enter** or **Esc** first.

### Put the list on another sheet

You're free to keep the values on a different sheet, and for anything you share this is a good idea. It keeps the working sheet clean, and you can hide the list sheet. Microsoft suggests hiding and protecting that sheet so nobody changes the choices by accident. Select the list on the other sheet while the Source box is active, and Excel fills in the reference.

### Type the items directly

For a short list that never changes, such as Yes, No, Maybe, you can skip the cells and type the items into the **Source** box, separated by commas. Microsoft's page on editing lists shows the format as `Yes,No,Maybe`, with no spaces after the commas. This is quick but it hides the values inside the validation rule. Anyone who wants to change them has to open the Data Validation dialog. For anything longer than a handful of items, use cells.

### Make the list readable

A drop-down is as wide as the cell it sits in. If long entries are cut off, widen the column. Microsoft also tells you to check that column width and row height let all entries show. If you edit the list later, check the width again.

## Add messages and decide how strict the list is

The two optional tabs in the Data Validation dialog are where a plain list turns into a usable form.

### The input message

On the **Input Message** tab, tick **Show input message when cell is selected**, then add a title and a message. The text appears as a small prompt when someone selects the cell. Microsoft lets the message run up to 225 characters. Use it to say what the field expects, for example "Pick the department that pays for this".

### The error alert

On the **Error Alert** tab, tick **Show error alert after invalid data is entered** and pick a **Style**. This decides what happens when someone types something that isn't on the list:

- **Stop** prevents entries that aren't in the list. Use it when the values feed formulas, reports or a pivot table and a misspelling would break them.
- **Warning** shows your message but still allows an entry that's not in the list.
- **Information** also shows a message and still allows the entry.

Enter a title and a message. If you leave both empty, Excel uses the title "Microsoft Excel" and the message "The value you entered is not valid. A user has restricted values that can be entered into this cell." That message doesn't help anybody, so write your own, something like "Choose a value from the list, or ask the owner to add it."

Recommendation: use Stop on anything that feeds a report. Use Warning in a template where people sometimes need an exception and you'd rather see it than block it.

## Keep the drop-down list up to date

A list that doesn't follow your data is a list somebody will eventually work around. How you update it depends on how you built the source. These steps come from Microsoft's page on adding or removing items.

### If the source is a table

Go to the end of the list and type the new item. Excel updates the drop-downs that use the list. To remove an item, select it and press **Delete**. To close the gap when you remove an item from the middle, right-click its cell, choose **Delete** and select **OK** so the cells shift up. Pressing Delete alone just clears the cell and leaves an empty line in the list.

This is why the table is worth the extra keystroke at the start. You never touch the validation rule again.

### If the source is a named range

A named range doesn't grow by itself when you type below it. After you add or remove items, edit the range:

1. Go to **Formulas** > **Name Manager**.
2. Select the named range.
3. In the **Refers to** box, delete the current reference and select all the cells that hold the list.
4. Select **Close** and then **Yes** to save.

If you don't know the name, select the list and read it in the Name Box next to the formula bar. To make a named range in the first place, use **Define Name** on the **Formulas** tab. You then type the name with an equals sign, for example `=Choices`, in the Source box. A named range is handy when the same list feeds drop-downs on several sheets.

### If the list is typed in the Source box

Select a cell that has the drop-down, go to **Data** > **Data Validation**, and edit the items on the **Settings** tab. Tick **Apply these changes to all other cells with the same settings** so every cell with the same rule gets the change.

## Why a drop-down stops working

Most problems come from a short list of causes. Microsoft's pages document them.

**Validation doesn't stop pasted data.** Microsoft explains that data validation shows messages and prevents invalid entries only when people type directly in a cell. If someone copies a value from somewhere else and pastes it in, or drags the fill handle, the rule is not applied to what arrives. If the list must be strict, turn off **Enable fill handle and cell drag-and-drop** under **File** > **Options** > **Advanced** > **Editing options**, then protect the worksheet. You will also lose some convenience, so only do that on sheets where accuracy matters most.

**Existing values aren't checked.** If you add a list to cells that already hold data, Excel doesn't flag the old values. To find the ones that don't fit, select the cells and use **Data** > **Data Validation** > **Circle Invalid Data**. The circles disappear when you correct the entries.

**Protected sheets block typing.** Finish your validation settings before you protect the sheet or workbook. Clear the Locked setting on the cells that people should fill in first, or they can't use the drop-down. You can't change validation settings on a shared or protected workbook.

**Formula errors.** Microsoft notes that validation is ignored while formulas in the validated cells return errors such as #REF! or #DIV/0!. It also notes that manual calculation can stop validation from working properly, so set calculation to Automatic.

**Linked tables.** You can't add data validation to an Excel table that is linked to a SharePoint site. Unlink the table or convert it to a range first.

**Finding cells that have a rule.** On the **Home** tab, open **Find & Select** and choose **Data Validation**. That selects all cells with validation on the sheet.

**Removing the list.** Select the cell and use **Data** > **Data Validation** > **Settings** > **Clear All**.

### Excel for the web

[Excel for the web](https://www.m365.fm/entity/excel-online/) is where you should test your file before you rely on it. Microsoft's data validation page says that, for workbooks used in the Excel Web App, you need to create the validation in the desktop version first. That note is old and your current browser version may behave differently, and Microsoft's drop-down page doesn't give web-specific steps. Build the list in desktop Excel, save the workbook, and open it in the browser to see how it behaves for your colleagues.

## Common mistakes

- Selecting the header cell in the Source range, so "Cities" shows up as a choice.
- Typing the items with spaces after the commas, then wondering why the entries show an extra space.
- Using a named range and forgetting that it needs editing when the list grows.
- Setting the Error Alert to Information and expecting it to block typos. Only Stop blocks them.
- Protecting the sheet before freeing the input cells for editing.
- Trusting the drop-down to keep pasted data clean.
- Leaving the column too narrow, so long entries look cut off and people choose the wrong one.

## Related topics to explore

- **Lists that grow by themselves.** Tables are the simple answer. A formula-based named range is the other option if you need more control, and it deserves its own test before you roll it out.
- **Dependent drop-downs.** A second list that changes with the first choice, such as country and city. Microsoft's pages above don't cover it, so treat it as a separate project and test it on a copy.
- **Forms and combo boxes.** Microsoft has a separate article on adding a list box or combo box to a worksheet. These controls need more setup than data validation.
- **Hiding or showing a list based on another cell.** This usually needs conditional formatting or VBA, and you should test it on a copy of the file.
- **Cleaning up first.** If your source list contains repeats, remove them before you build the drop-down. Our article on how to remove duplicates in Excel covers that.

## Next step

To create a drop down list in Excel that holds up, build it on a table, set the Error Alert to Stop and test it by typing and by pasting. Then protect the sheet if the choices must stay strict, and write down where the list lives so the next person can update it.
