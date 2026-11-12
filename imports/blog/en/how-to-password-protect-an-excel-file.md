---
title: "How to Password Protect an Excel File (and Sheets) Step by Step"
summary: "How to password protect an Excel file: File, Info, Protect Workbook, Encrypt with Password. Plus sheet and workbook protection, lost passwords and sharing tips."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [excel, bitlocker]
keypoints:
  - "To password protect an Excel file, go to File, Info, Protect Workbook, Encrypt with Password, type a password, confirm it and save."
  - "Passwords in Excel are case-sensitive, and Microsoft can't retrieve a forgotten one, so store it before you close the file."
  - "Protect Sheet and Protect Workbook are not file passwords. They stop edits to cells or sheets but don't stop anyone from opening the file."
  - "Microsoft warns that password-protected files may not be secure enough for very sensitive data, such as credit card numbers."
  - "Send the file and the password through different channels, and never put the password in the same email as the attachment."
faq:
  - q: "How do I password protect an Excel file so it can't be opened?"
    a: "Open the workbook, select File, then Info, then Protect Workbook and choose Encrypt with Password. Type a password, select OK, retype it and select OK again, then save the file. The next time anyone opens it, Excel asks for the password before showing any data."
  - q: "What happens if I forget my Excel password?"
    a: "Microsoft cannot retrieve a forgotten Excel password, and passwords are case-sensitive. Check your password manager first, then ask the person who set it. If you have an older unprotected copy, use that. Be careful with free password-removal tools, which can damage files or expose your data."
  - q: "What is the difference between protecting a file, a workbook and a sheet?"
    a: "File protection with Encrypt with Password stops people from opening the file at all. Workbook protection locks the structure, so sheets can't be added, moved, renamed or unhidden. Sheet protection locks cells on one sheet. Only the first one controls who can read the data."
---
To password protect an Excel file, open the workbook and go to **File** > **Info** > **Protect Workbook** > **Encrypt with Password**. Type a password, select **OK**, retype it, select **OK** again and save the file. From then on, Excel asks for that password before it shows a single cell. This article is for Excel users who have a workbook with salaries, customer lists or draft numbers and want to keep it from being opened by the wrong person. You'll also see how the other protection options differ, what to do about a lost password, and how to share the file safely.

One thing to settle first: "protect" means three different things in [Excel](https://www.m365.fm/entity/excel/). Only the first one keeps people out of the file.

## Choose the right kind of protection

Microsoft's own pages separate these on purpose, and mixing them up is the most common mistake.

- **File protection (Encrypt with Password).** Nobody can open the file without the password. This is what most people mean by "password protect an Excel file".
- **Workbook protection (structure).** Anyone can open the file, but they can't add, move, delete, hide, unhide or rename sheets without the password. Microsoft states that protecting the workbook is not the same as protecting an Excel file with a password.
- **Worksheet protection.** Anyone can open the file, but cells that are locked can't be changed. Microsoft's page on [protecting a worksheet](https://support.microsoft.com/en-us/office/protect-a-worksheet-3179efdb-1285-4d49-a9c3-f4ca36276de6) says plainly that this isn't a security feature. It stops users from changing locked cells on that sheet and nothing more.

So if the goal is "only these people can read the data", use file protection. If the goal is "people can read the data but shouldn't break my formulas", use sheet protection. If you need both, you can combine them.

## How to password protect an Excel file

These are the steps on Microsoft's page [Protect an Excel file](https://support.microsoft.com/en-us/excel/get-started/protect-an-excel-file). Microsoft lists the same set of steps for Excel for Microsoft 365, Excel 2024, 2021, 2019 and 2016, and for the Mac versions of Microsoft 365, 2024 and 2021.

1. Open the workbook you want to protect.
2. Select **File**, then **Info**.
3. Select the **Protect Workbook** box and choose **Encrypt with Password**.
4. Type a password in the **Password** box and select **OK**.
5. Retype it in the **Reenter Password** box and select **OK**.
6. Save the file. The protection is part of the saved file, so a version you haven't saved isn't protected.
7. Close the workbook and open it again. Excel should ask for the password before it shows anything. This is the only real test, so do it every time.

On Mac, the **Info** pane may look different or may not be where you expect it. Microsoft's page doesn't describe separate Mac menu paths. A different Microsoft page, which covers Excel for Mac, describes protection through the **Review** tab with **Protect Sheet** and **Protect Workbook**, and that page does not mention an open password. If you can't find **Encrypt with Password** on your Mac, check for the same command under the File or Review menu in your version, and test the result by reopening the file.

### What Microsoft says about the password

Microsoft's page gives a few rules that are easy to overlook:

- Passwords are case-sensitive. "Budget2026" and "budget2026" are different passwords.
- Microsoft can't retrieve a forgotten password. There is no reset button and no support ticket that fixes it.
- The page sets no limits on length, characters or numbers.
- Password-protected files may not be secure enough for sensitive data such as credit card numbers.
- Sharing the file or the password carries risk, because a password can end up with people you didn't intend. A password also doesn't necessarily protect a file from someone with bad intent.

The last two points matter for how you use the feature. A password on a workbook is a good lock for casual access: a shared laptop, a stray email, a file on a USB stick. It isn't a replacement for proper access control on sensitive records. If the content is regulated or very sensitive, keep it out of Excel files that travel by email and ask your IT or compliance team what your organization requires.

### Pick a password you can use

For worksheet passwords, Microsoft's guidance is to mix uppercase and lowercase letters, numbers and symbols, and to aim for at least 8 characters, or 14 or more for a passphrase. That's a reasonable starting point for file passwords too, although the file page itself doesn't state a rule. A few practical points:

- A passphrase of several unrelated words is easier to remember than a short string of symbols, and it's longer.
- Don't reuse a password that you use for email or banking. If you share the file, you're also sharing that password.
- Save the password where you'll find it later, such as a password manager. Do this before you close the file, not after.
- Don't put the password in the file name or on a sticky note under the keyboard.

## Protect a sheet or the workbook structure

Use these when the file can be opened by others, but you need to protect its layout or formulas.

**Protect the workbook structure.** Go to **Review** > **Protect Workbook**, enter an optional password, select **OK** and retype the password. Microsoft's page on [protecting a workbook](https://support.microsoft.com/en-us/office/protect-a-workbook-7e365a4d-3e89-4616-84ca-1931257c1517) says this stops other users from viewing hidden worksheets and from adding, moving, deleting, hiding or renaming sheets. You can see that it's on because the Protect Workbook icon is highlighted and the sheet options like Insert, Delete and Rename are unavailable. To remove it, click **Review** > **Protect Workbook**, enter the password and click **OK**.

**Protect one sheet.** First free the cells people may edit: select them, press **Ctrl+1**, open the **Protection** tab and clear **Locked**. Then go to **Review** > **Protect Sheet**. Under "Allow all users of this worksheet to", tick what you want to allow, such as formatting cells, inserting rows or using PivotTable reports. Add a password if you want one, select **OK** and confirm it. A protected sheet shows **Unprotect Sheet** instead of **Protect Sheet** on the Review tab.

### What the Protect Sheet options allow

The dialog is a list of permissions, and the defaults surprise people. From Microsoft's list:

- **Select locked cells** and the matching option for cells that are not locked are both allowed by default, so people can still click into protected cells. They just can't change them.
- **Format cells**, **Format columns** and **Format rows** allow formatting changes, including column width, row height and hiding columns or rows.
- **Insert columns**, **Insert rows** and **Insert hyperlinks** allow adding those elements. **Delete columns** and **Delete rows** are separate. If you allow insert but not delete, people can add rows but not remove them.
- **Sort** is allowed only on ranges without locked cells. Sorting a range that contains locked cells is blocked regardless of the setting.
- **Use AutoFilter** lets people change filters on existing AutoFilters. Applying or removing an AutoFilter is blocked regardless.
- **Use PivotTable reports** allows formatting, refreshing and changing PivotTables.
- **Edit objects** and **Edit scenarios** cover charts, shapes, controls, notes and scenarios.

The practical consequence: protect first with the defaults, then open one box at a time when somebody complains that a task no longer works. Users of sorted lists and filters hit the Sort and AutoFilter limits most often.

In both cases the password is optional. Without a password, anyone can unprotect the workbook or the sheet with one click, so a "protected" sheet without a password only prevents accidents. If you have never locked cells before, learn how locking cells works first, because a protected sheet locks every cell by default.

## Lost the password? What you can and can't do

This is the part that hurts. Microsoft says it can't recover a lost file password, and the workbook pages say Excel can't either. In practice you have these options, from safest to riskiest:

1. **Check where you stored it.** A password manager, the email where you first sent the file, a team document.
2. **Ask the person who protected it.** Often the file came from a colleague who still has the password.
3. **Look for an unprotected copy.** An earlier version, a backup or the original export that you encrypted later.
4. **Ask IT.** Some organizations keep recovery procedures or licensed tools for this, and they'll decide whether it's allowed.

Free online password-removal sites are a different matter. Microsoft doesn't offer or endorse them. They can damage a file, and uploading a confidential workbook to an unknown website defeats the purpose of having a password. If you must try a tool, work on a copy and only with your IT team's approval.

### Remove or change a password you know

To remove the file password, open the file with the password, go back to **File** > **Info** > **Protect Workbook** > **Encrypt with Password**, delete the characters in the Password box, select **OK** and save. To change it, type the new password in the same box instead. Microsoft's page I read describes adding the password, not removing it, so check the result by reopening the file.

For sheet or workbook protection, the removal steps are the ones above: **Review** > **Unprotect Sheet** or **Protect Workbook**, and enter the password.

## Excel for the web, OneDrive and sharing

Microsoft's article on differences between the browser and desktop Excel says that workbooks protected with a password (encrypted) can be viewed and edited in Excel for the web, and that protected worksheets can only be viewed there. To remove sheet protection, open the workbook in the desktop app. Set file passwords in the desktop app too. I didn't find a Microsoft page that documents setting an open password in the browser, so don't plan on it.

Phones and tablets: Microsoft's pages I opened don't describe protection options in the mobile apps, so I'm not making a claim either way.

### Share the file without leaking the password

- Send the password through a different channel than the file. If you email the workbook, give the password by phone call or a message in another app.
- Don't paste the password into the same email, even in a "second email" to the same inbox. A mailbox with both messages gives away both.
- For recurring sharing, change the password now and then, and tell people when you do.
- Share only with the right people. If the file contains data about customers or staff, check who is on the recipient list before you send the password.
- Consider using permissions instead of a password. If the file lives in OneDrive or SharePoint, you can control who can open it by sharing it with named people. That way you don't have to manage a password for each person.

## Protect the device as well

A file password protects one workbook. It does nothing for the other twenty files on a stolen laptop. [BitLocker](https://www.m365.fm/entity/bitlocker/) is the Windows feature for that. Microsoft's [BitLocker overview](https://learn.microsoft.com/en-us/windows/security/operating-system-security/data-protection/bitlocker/) describes it as encryption of entire volumes that protects data on lost, stolen or decommissioned devices, so it's unreadable to someone who removes the drive. It doesn't guard data once the volume is open and you're signed in, which is why the two layers do different jobs: BitLocker for the device, an Excel password for a single file you plan to send around. Your IT team may already have BitLocker turned on for company laptops, so ask before you do anything yourself.

## Common mistakes

- Setting a sheet password and believing the file is secure. Sheet protection doesn't stop anyone from opening the file.
- Not saving the file after setting the password, then finding it unprotected on the next open.
- Forgetting to test. Close the file and reopen it every time.
- Using a password you can't recall, and having no copy stored anywhere.
- Emailing the file and the password together.
- Uploading a confidential workbook to a free password-removal site.
- Leaving the sheet password blank and calling it protected.

## Related topics to explore

- **Lock cells before you protect a sheet.** Clear the Locked setting on the input cells, then protect, so people can type only where you want them to.
- **Hidden sheets.** Workbook structure protection also stops people from viewing hidden worksheets, which is worth knowing before you hide a sheet.
- **Sensitivity labels.** If your organization uses them, ask your IT team whether a label can restrict a file without a password you have to share.
- **Share without a password.** Use OneDrive or SharePoint permissions for named people instead of one shared password.
- **Device encryption.** Learn how [BitLocker](https://www.m365.fm/entity/bitlocker/) and device encryption protect the whole laptop.

## Next step

Open the one workbook that worries you most. Follow the steps for how to password protect an Excel file, save, close it and reopen it to prove the prompt appears. Then put the password in your password manager, and send it to the recipient by a different route than the file.
