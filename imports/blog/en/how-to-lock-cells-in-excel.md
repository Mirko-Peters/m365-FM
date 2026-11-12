---
title: "How to Lock Cells in Excel: Protect Formulas, Allow Input"
summary: "How to lock cells in Excel: unlock the input cells, then use Review, Protect Sheet. Also hide formulas, let people edit set ranges, and fix common problems."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [excel, vba]
keypoints:
  - "Every cell is locked by default, but locking does nothing until you protect the sheet with Review, Protect Sheet."
  - "The usual recipe is to unlock the cells people should fill in, then protect the sheet, so everything else becomes read-only."
  - "To keep formulas from view, tick Hidden on the Protection tab of Format Cells and protect the sheet. Those cells then can't be edited either."
  - "Allow Edit Ranges lets named groups of cells stay editable under sheet protection, with a password or user permissions for each range."
  - "Sheet protection is not real security, and Microsoft cannot recover a forgotten password, so keep an unprotected backup."
faq:
  - q: "How do I lock cells in Excel?"
    a: "Select the cells, open Format Cells with Ctrl+1, and tick Locked on the Protection tab. Then go to Review and select Protect Sheet. Locking only takes effect once the sheet is protected, because every cell is already locked by default. Unlock any cells people need to edit before you protect the sheet."
  - q: "How do I lock only some cells in Excel?"
    a: "Select the cells that people should be able to edit, open Format Cells, and clear Locked on the Protection tab. Leave the rest as they are. Then choose Review, Protect Sheet. After protection is on, only the unlocked cells accept changes, and every other cell stays read-only."
  - q: "How do I unlock cells in Excel?"
    a: "To unprotect the sheet, go to Review and select Unprotect Sheet, then enter the password if there is one. To let people edit particular cells even when the sheet is protected, select those cells before you protect it, open Format Cells, and clear Locked on the Protection tab."
---
To lock cells in Excel, you do two things: make sure the cells are marked as locked, then protect the sheet. Select the cells, press **Ctrl+1**, tick **Locked** on the **Protection** tab, then go to **Review** > **Protect Sheet**. The second step is what turns the lock on. This article is for Excel users who share budgets, trackers, templates and grade sheets and want people to type in the input cells without breaking the formulas. You'll see the right order of steps, how to hide formulas, how to open selected ranges for specific people, and what to check when protection doesn't behave.

The part that confuses most people is the default. In an unprotected sheet, every cell already counts as locked. Microsoft's article on [locking cells to protect them](https://support.microsoft.com/en-us/excel/lock-cells-to-protect-them-in-excel) says locking takes effect only after you protect the sheet or workbook. So the real work in [Excel](https://www.m365.fm/entity/excel/) is the reverse of what the title suggests: you unlock the cells that people may change, and then switch protection on.

## Lock only the cells you choose

This is the standard recipe, and it follows Microsoft's guide to [protecting a worksheet](https://support.microsoft.com/en-us/excel/protect-a-worksheet).

1. **Decide what stays editable.** Write down which cells people must be able to fill in: the input area, a date, a status column.
2. **Select those cells.** Drag across the range. To pick several separate areas, hold **Ctrl** while you select.
3. **Open Format Cells.** Press **Ctrl+1**, or right-click and choose **Format Cells**.
4. **Clear Locked.** On the **Protection** tab, clear the **Locked** check box and select **OK**.
5. **Protect the sheet.** On the **Review** tab, select **Protect Sheet**.
6. **Choose what people may do.** Excel shows a list of allowed actions. Leave the defaults, or tick more, for example sorting or using AutoFilter.
7. **Add a password if you want one.** Select **OK**. If you set a password, Excel asks you to type it again.

Now only the cells you unlocked accept changes. If someone tries to edit a locked cell, Excel shows a message that the cell is protected.

Microsoft's other route works too: select the cells you want to lock, open the **Alignment Settings** arrow on the **Home** tab, tick **Locked** on the **Protection** tab and then protect the sheet. Because everything starts out locked, though, unlocking the exceptions is usually the shorter path.

### The list of allowed actions

When you protect the sheet, Excel lists what all users may still do. Microsoft's list includes: select locked cells, select unlocked cells, format cells, format columns, format rows, insert columns, insert rows, insert hyperlinks, delete columns, delete rows, sort, use AutoFilter, use PivotTable reports, edit objects and edit scenarios.

Think about this list for a minute. If people need to sort a table, tick **Sort**. If you leave everything unticked, the sheet is as rigid as it gets. If you untick **Select locked cells**, people can't even click on a locked cell, which is useful on a form that you only want them to fill in.

### Check and remove protection

When a sheet is protected, the **Protect Sheet** button on the Review tab changes to **Unprotect Sheet**. To remove protection, select it, or go to **File** > **Info** > **Protect** > **Unprotect Sheet**. If you set a password, enter it and select **OK**.

### On a Mac

Microsoft documents the same two-step logic for Excel for Mac. Select the cells, press **Command+1**, and use the **Protection** tab to set or clear **Locked**. Then go to **Review** and select **Protect Sheet** or **Protect Workbook**. Enter a password and retype it under **Verify**, or leave it empty, in which case anyone can unprotect the sheet. In the same dialog, clear **Select locked cells** to stop users from selecting locked cells, or keep **Select unlocked cells** ticked so they can work in the open ones. To change protection later, choose **Unprotect Sheet**, adjust the cells, and protect again.

### A worked example: a monthly budget sheet

Say a budget sheet has monthly figures typed into B2:M20, and totals in row 21 and in column N that add them up. Here is how the steps map onto it:

1. Select B2:M20 and clear **Locked**. The totals stay locked, because they were locked all along.
2. Select row 21 and column N, tick **Hidden** if you don't want the formulas visible.
3. Protect the sheet. Leave **Select locked cells** ticked, so people can click a total and read its value.
4. Test it. Type a number in B2: it works. Try to overtype a total in N5: Excel refuses.
5. Keep an unprotected copy of the file named so you recognize it, for the day you need to change a formula.

The test in step 4 is the part people skip. Do it every time, and do it as a different user if you can, not only as the author.

## Lock and hide formulas

A formula cell is the most common reason to protect a sheet. Locking stops overwriting. Hiding stops people from seeing the logic in the formula bar.

First, find the cells. One quick way is **Go To Special**: press **Ctrl+G**, select **Special**, choose **Formulas** and select **OK**. That selects every cell that holds a formula, so you can check how many there are before you lock them. Because the cells are locked by default, you often need no further change for locking.

To also hide the formulas, follow Microsoft's article on [displaying or hiding formulas](https://support.microsoft.com/en-us/excel/display-or-hide-formulas):

1. Select the cells whose formulas you want to hide.
2. Go to **Home** > **Format** > **Format Cells**.
3. On the **Protection** tab, tick **Hidden** and select **OK**.
4. Go to **Review** > **Protect Sheet**.
5. Keep **Protect worksheet and contents of locked cells** ticked and select **OK**.

Microsoft points out two things. Hiding formulas also stops those cells from being edited. And hiding takes effect only once the sheet is protected. To show the formulas again, select **Unprotect Sheet**. If that button is unavailable, turn off the Shared Workbook feature first.

One more thing that people mix up: the shortcut **Ctrl + `** (grave accent) toggles between showing formulas and showing results across the sheet. It doesn't hide anything from other users.

## Let selected people edit selected ranges

Sometimes the editable area depends on the person. The finance team may fill in one block, while managers fill in another. Excel's **Allow Edit Ranges** feature handles this. The steps come from Microsoft's page on [locking or unlocking specific areas of a protected worksheet](https://support.microsoft.com/en-us/office/lock-or-unlock-specific-areas-of-a-protected-worksheet-75481b72-db8a-4267-8c43-042a5f2cd93a).

1. Select the worksheet. It must not be protected yet. Microsoft says the command is available only when the worksheet is not protected.
2. On the **Review** tab, select **Allow Edit Ranges**.
3. In the **Allow Users to Edit Ranges** dialog box, select **New**.
4. Enter a name in the **Title** box.
5. In the **Refers to cells** box, type an equal sign and the range, for example `=B2:B20`, or use the Collapse Dialog button to select the cells.
6. Enter a **Range password** if you want people to need one.
7. To grant access by user instead, select **Permissions** and then **Add**, enter the user names, use **Check Names** to verify them, and set **Allow** or **Deny** for each. Then select **Apply**.
8. Select **OK**, and then **Protect Sheet** in the same dialog. Choose the allowed actions and, if you wish, set a sheet password.

Two requirements from Microsoft: permissions per user need your computer to be in a domain. Without one, give each range a password instead. And if a cell belongs to more than one range, a person authorized for any of those ranges can edit it. If someone selects several cells and is authorized for only some of them, Excel prompts them to edit the cells one by one.

## Protect the workbook structure

Protecting a sheet doesn't stop someone from deleting the sheet itself. For that, use **Review** > **Protect Workbook**. Microsoft's page on protecting a workbook says it stops other users from viewing hidden worksheets, and from adding, moving, deleting, hiding or renaming worksheets. The password is optional, but without one anybody can remove the protection.

Note what it doesn't do. It doesn't stop people from opening the file, and it doesn't lock the data in cells. Cell protection stays a sheet-level job. Use both when the file goes to many people: sheet protection for the cells and workbook protection for the structure.

## Limits and passwords you should know about

Microsoft is clear on three points.

**Sheet protection is not security.** The page says worksheet protection isn't a security feature. It only stops users from changing locked cells on that sheet. It doesn't protect the whole file. If the content is confidential, use file-level protection instead of relying on locked cells.

**Forgotten passwords are gone.** Microsoft says it cannot retrieve a forgotten password. For workbook protection it says Excel can't recover it either. Keep an unprotected copy of the file in a safe place before you apply a password.

**Choose a strong password if you use one.** Microsoft suggests a mix of upper and lower case letters, numbers and symbols, at least 8 characters, and notes that a passphrase of 14 or more characters is stronger. Remember that "protect without a password" is a legitimate choice: anyone can then remove protection with one click, which is fine to prevent accidents but not to keep data private.

The feature isn't available everywhere either. Microsoft notes that worksheet protection isn't available in U.S. Government Community Cloud High (GCCH) or Department of Defense (DOD) environments. Its pages also give no steps for Excel for the web, so test the file in the browser if colleagues will use it there.

## When protection doesn't work

- **People can still edit "locked" cells.** The sheet isn't protected yet, or the cells were unlocked. Check that the button says **Unprotect Sheet**. Then select a cell and look at its Protection tab.
- **Nobody can type in the input cells.** They are still locked. Unlock the cells and protect the sheet again.
- **Unprotect Sheet is unavailable.** Microsoft notes that the Shared Workbook feature blocks unprotecting a sheet. Turn that feature off first, then try again.
- **A dropdown list or a button doesn't respond.** The cell it writes to is locked. Unlock the linked cell first. This is the classic way to break a form after protection.
- **Allow Edit Ranges is grayed out.** The sheet is protected already. Unprotect it, set up the ranges, and protect again.

## Common mistakes

- Locking cells and forgetting to protect the sheet. Nothing is protected until you do.
- Protecting the sheet before unlocking the input cells, so users can't type anywhere.
- Losing the password with no backup copy.
- Treating sheet protection as security for confidential data.
- Hiding formulas but leaving the sheet unprotected. Hidden has no effect until protection is on.
- Protecting the sheet and forgetting the workbook structure, so the sheet can still be deleted.

## Related topics to explore

- **Locking cells with VBA.** Macros can unprotect, change and protect a sheet again, or react when a value changes. Our [VBA](https://www.m365.fm/entity/vba/) page collects related material. Treat anything that depends on user names as a convenience, not as security.
- **Forms and drop-downs on protected sheets.** Unlock the linked input cells, protect the sheet, then test every control.
- **Tracking changes after protection.** If the file is stored in a place that keeps versions, you may be able to see earlier copies. Check what your storage offers.
- **Protecting the whole file.** Microsoft has separate pages on requiring a password to open or modify a workbook. Look at those if the data is sensitive.

## Next step

Open a copy of your file, unlock the input cells, protect the sheet and try to break it. Once you know how to lock cells in Excel without trapping your own users, write the password down somewhere safe and keep an unprotected original.
