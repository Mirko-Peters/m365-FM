---
title: "How to Delete a Page in Word: Full, Blank and Last Pages"
summary: "How to delete a page in Word: select it with Ctrl+G and \\page, clear page breaks and section breaks, and fix the stubborn blank last page that won't go away."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [word, microsoft-365-apps]
keypoints:
  - "To delete a page with content in Word, click in the page, press Ctrl+G, type \\page, press Enter, select Close and press Delete."
  - "To delete a blank page, turn on formatting marks with Ctrl+Shift+8 and remove the empty paragraphs, page break or section break that create it."
  - "A paragraph mark after a table at the end of a document cannot be deleted, but you can shrink it to 1 pt or hide it so the blank last page disappears."
  - "On a Mac, the Go To shortcut is Option+Command+G and formatting marks are toggled with Command+8."
  - "In Word for the web, a Section Break (Next Page) cannot be deleted, so open the file in desktop Word for that step."
faq:
  - q: "How do I delete a page in Word that has text on it?"
    a: "Click anywhere on the page and press Ctrl+G (Option+Command+G on a Mac). In the page number box type \\page and press Enter, then select Close. Word now highlights the whole page. Check that the right content is selected and press Delete."
  - q: "Why won't the blank page at the end of my Word document delete?"
    a: "Word always keeps one final paragraph mark, and if a table, page break or full page of text pushes that mark onto a new page, the page stays. Show formatting marks, delete extra breaks, then shrink the last mark to 1 pt or hide it."
  - q: "Can I delete a page in Word for the web?"
    a: "You can delete content and empty paragraphs, but Microsoft Community answerers say a Section Break (Next Page) cannot be removed in Word for the web. Open the document in Word on Windows or Mac for that step, save it, then return to the web version."
---

To delete a page in Word, click anywhere on that page, press **Ctrl+G**, type `\page`, press **Enter**, select **Close**, and then press **Delete**. That works for a page with text, pictures or empty lines. A blank page needs a slightly different fix, because something invisible is creating it: an empty paragraph, a page break, a section break or the paragraph mark after a table. This article is for anyone who has a stray page in a [Word](https://www.m365.fm/entity/word/) document and wants it gone without wrecking the layout.

## How do you delete a page that has content?

There are two reliable ways. Use the first when you want a quick, exact selection, and the second when you only need part of the page.

**With Go To (any page, any length).** Microsoft's page [Delete a page or remove a blank page in Word](https://support.microsoft.com/en-us/word/delete-a-blank-page) gives these steps, listed for Word in Microsoft 365, 2024, 2021, 2019 and 2016:

1. Click or tap anywhere on the page you want to delete.
2. Press **Ctrl+G**. On a Mac, press **Option+Command+G**.
3. In the **Enter page number** box, type `\page`.
4. Press **Enter**, then select **Close**.
5. Check that the full page is highlighted, then press **Delete**.

The `\page` entry is a special name for "the page I'm on", so you don't need to know the page number.

**By selecting by hand.** Click at the start of the content you want to remove, hold **Shift**, click at the end, and press **Delete**. This is better when the page break falls in the middle of a section you want to keep.

One thing to check before you press Delete: if the page contains a table, a picture or text you still need, copy it somewhere first. **Ctrl+Z** undoes the deletion, but only if you notice quickly.

## How do you delete a blank page in Word?

A blank page isn't empty. Word thinks something is on it. To see what, show the formatting marks: select the **¶** button on the **Home** tab, or press **Ctrl+Shift+8**. On a Mac, Microsoft's page on [adding or deleting a page in Word for Mac](https://support.microsoft.com/en-us/office/add-or-delete-a-page-in-word-for-mac-5513dfc4-02c8-4e24-afc4-804d9690dae4) says to press **Command+8** to show paragraph marks.

Now look at the blank page. You'll usually find one of these:

- **Empty paragraph marks (¶).** Select them and press **Delete** or **Backspace**. Microsoft's Mac page uses the same method for blank pages, including a blank page at the end of the document.
- **A manual page break.** It appears as a dotted line labeled "Page Break". Select it and press **Delete**.
- **A section break.** It appears as "Section Break (Next Page)" or similar. Place the cursor directly before it and press **Delete**.

A section break needs one more thought. If it sits at the very end of the document, deleting it is fine. If it sits in the middle, a Microsoft Community advisor suggests changing it instead: go to **Layout**, open the **Page Setup** dialog from the small arrow at the corner of the group, and on the **Layout** tab set **Section start** to **Continuous**. That keeps the section but removes the forced new page. Afterwards, check your headers, footers and page numbers, because they're often tied to sections.

If the blank page is in the middle and you see nothing on it, check the paragraph settings of the last line on the page before it. In the **Paragraph** dialog, on the **Lines and Breaks** tab, make sure **Page break before** isn't ticked on the paragraph that sits on the blank page.

### Can you delete a page from the Navigation Pane?

Sometimes. Open the **View** tab, tick **Navigation Pane**, switch to **Pages**, click the thumbnail of the blank page and press **Delete**. A Microsoft Community advisor lists this among the fixes. It's a good way to see which page you're dealing with in a long document, but if nothing happens, go back to the formatting marks, because the cause is still there.

## How do you fix the blank last page that won't delete?

This is the case that causes most of the frustration. Backspace does nothing, and the page stays.

The reason is a rule of the program: Word needs a paragraph mark after a table, and that final paragraph mark can't be deleted. Answers in a [Microsoft Community thread about a blank page after a table](https://learn.microsoft.com/en-us/answers/questions/4785676/unable-to-delete-blank-page-at-end-of-table-docume?forum=msoffice-all) say it plainly, and a second thread says the same about the paragraph after a table. If your table fills the last page to the bottom, that mark gets pushed onto a new page, and you see a blank page you can't remove.

You don't have to delete the mark. You have to make it small enough to fit on the previous page. Try these in order:

1. **Show formatting marks** (Ctrl+Shift+8) and click in the last paragraph mark.
2. **Shrink it.** Set its font size to 1 pt. Then open the **Paragraph** dialog and set **Line spacing** to **Exactly** 1 pt, and **Before** and **After** spacing to 0 pt. One community answer uses the line spacing and spacing settings, another uses the font size, and both aim at the same result.
3. **Hide it.** Select the mark, open the **Font** dialog and tick **Hidden**. If the mark still shows, go to **File** > **Options** > **Display** and clear the **Hidden text** option.
4. **Change the margin a little.** Reduce the top or bottom margin by a small amount, for example from 1" to 0.95", so the mark moves back onto the page before. If that doesn't work, try a smaller change.
5. **Move the table up.** In one thread, the table sat too low against the footer. Raising its bottom edge removed the blank page.

If the extra page comes after text and not after a table, remove surplus Enter presses and manual page breaks at the end first. Then look at the section break.

## What if you work in Word for the web, on a Mac or on a phone?

**Mac.** The steps are the same ideas with different keys: **Option+Command+G** for Go To and **Command+8** for formatting marks, per Microsoft's pages above.

**Word for the web.** Two limits appear in a [Microsoft Community thread on Word for the web](https://learn.microsoft.com/en-us/answers/questions/5724170/how-do-i-delete-a-blank-page-in-word-at-end-of-doc). First, the **¶** button may be hidden if the ribbon is in the single-line layout. Click the arrow at the far right of the ribbon and choose **Classic Ribbon** to bring it back. Second, an answerer states that a **Section Break (Next Page)** can't be deleted in Word for the web. Open the document in Word on Windows or Mac, delete the break, save, and continue on the web if you like. On the web, you can still delete extra page breaks and empty paragraph marks.

**Phone or tablet.** Microsoft's page-deletion articles cover Windows and Mac and don't list steps for the mobile apps, so don't count on the same buttons being there. If the formatting marks are hard to reach, finish the job in desktop Word.

## How do you stop blank pages from coming back?

Most stray pages come from the way the page was started, not from the one you just deleted.

- **Don't press Enter to reach the next page.** Insert a page break instead (**Insert** > **Page Break**), or use the **Page break before** setting on a heading style, so the break moves with the content.
- **Leave room after tables.** If a table ends a page, expect the paragraph mark after it to spill over. Make that mark small from the start.
- **Use sections for a reason.** A **Next Page** section break forces a new page. Use **Continuous** when you only want different columns or margins on the same page.
- **Check before you send.** Turn on formatting marks and scroll through the document once. It takes a minute, and you'll find the stray breaks that only show up on another person's printer or screen.
- **Be careful with templates.** Pages in a template can come from a section break or page break in the original. Fix them there once, not in every document.

## Common mistakes

- **Pressing Backspace repeatedly.** You may delete content on the previous page without noticing.
- **Deleting a section break in the middle of the document.** Headers, footers and page numbers can change. Check them afterwards.
- **Trying to delete the final paragraph mark.** It can't be removed. Shrink or hide it.
- **Forgetting hidden formatting.** Without the ¶ view, you're guessing.
- **Fixing the symptom with a smaller font on the whole page.** Change only the mark that causes the problem.
- **Not saving a copy of long documents.** Make a backup before you remove sections.

## Related topics to explore

- **Page numbering across sections.** How to restart numbering or link headers and footers when you delete a page between section breaks.
- **Odd and even pages in reports.** How section breaks control where chapters start in books and long reports.
- **Clean document structure.** Styles, page break settings and section use that prevent layout problems.
- **Working in the Word apps on mobile.** What the phone and tablet versions can and can't do for layout.
- **Other [Microsoft 365 apps](https://www.m365.fm/entity/microsoft-365-apps/).** How the same formatting habits help in documents you share through the apps in your plan.

## Next step

To delete a page in Word without surprises, turn on the formatting marks first and look at what is on the page. Open your document now, press Ctrl+Shift+8 and scroll through once, deleting the breaks you don't need and shrinking the last paragraph mark if a table ends the document.
