---
title: "Microsoft Lists Tips: Views, Formatting, Rules and Limits That Matter"
summary: "Practical Microsoft Lists tips based on Microsoft documentation: view formatting, rules for notifications, form layout, Power Automate, and the 5,000 item threshold with other list limits."
status: review
publish: false
author: mirko-p
date: 2026-11-28
topics: [microsoft-lists, sharepoint, sharepoint-list-view-threshold]
keypoints:
  - "Use Format current view for row colors and conditional rules. Anyone who can create and manage views can use it, and it changes only how the list looks."
  - "Rules send notifications when data changes. Only two 'a date approaches' rules are allowed per list, and multi-line text columns are not supported."
  - "For logic beyond notifications, use Power Automate from the Automate menu. Rules alone do not change other column values."
  - "The list view threshold is 5,000 items and cannot be changed in SharePoint Online. Filtered views on indexed columns keep queries under it."
  - "A list can hold up to 30 million items, a file attached to a list item can be up to 250 MB, and unique permissions are recommended to stay under 5,000."
faq:
  - q: "How do I color rows in a Microsoft Lists view?"
    a: "Microsoft Support says to select All items > Format current view, then use alternating row styles or Manage rules > Add rule for conditional formatting. Conditional rules support only 'is equal to' and 'is not equal to'. For more control, Advanced mode lets you use JSON."
  - q: "Can Microsoft Lists notify me when an item changes?"
    a: "Yes. Microsoft Support describes rules that notify someone when list data changes, for example when an item is modified or a date approaches. You need Contribute permission on the list. Group email addresses are not supported as recipients."
  - q: "What is the list view threshold?"
    a: "According to Microsoft Learn it is 5,000 items. A view or query that touches more than that many items at once is blocked. Microsoft Support says the threshold cannot be changed in SharePoint Online, so you keep queries within it, for example with indexed columns and filtered views."
  - q: "How many items can a Microsoft list hold?"
    a: "The SharePoint limits page on Microsoft Learn says a list can have up to 30 million items. That is a storage limit, not a promise that every view will open. Views still have to stay under the list view threshold."
  - q: "Do rules replace Power Automate?"
    a: "Not completely. Microsoft Support presents rules as the simplest option for notifications. Power Automate flows can send notifications, sync files, collect data and perform other tasks, and they are started from the Automate menu."
---

The most useful Microsoft Lists tips are the ones that match documented limits: format views so important rows stand out, use rules for simple notifications, move to Power Automate when you need real logic, and keep views under the 5,000 item threshold. This article collects those tips with the menu paths and limits Microsoft publishes.

A note on sources: Microsoft's own tip lists were partly unreadable for this article, so everything below comes from the specific Support and Learn pages listed at the end. Where those pages are silent, this article says so.

## Tip 1: Format the current view

View formatting changes how items look. It does not change the data in the list.

1. Open the list and the view you want to change.
2. Select **All items** > **Format current view**.
3. Choose **Alternating row styles** and select **Edit row styles** to pick a highlight color, or choose **Manage rules**.
4. In **Manage rules**, select **+ Add rule**, choose a column and a comparison, enter a value and set the appearance of matching rows.

Microsoft Support states that conditional rules support only "is equal to" and "is not equal to". Select **Advanced mode** to write JSON for more complex cases. Microsoft Learn adds that view formatting is for SharePoint Online and that List and Compact List layouts use row formatting, while Gallery and Board layouts use card formatting. Anyone who can create and manage views in the list can apply it.

## Tip 2: Use rules for simple notifications

Rules are if/then automations. According to Microsoft Support, you can notify someone when a column value changes, a new item is created, an item is deleted, or a date approaches.

Menu paths differ between Microsoft pages. The Support article on creating rules says **Integrate** > **Rules**. A Microsoft blog post and the Automate overview say **Automate** > **Create a rule**. Which one you see depends on your interface version, so look for either menu.

Documented limits:

- You need Contribute permission on the list.
- You can email a specific person, several people or a column value. Group email addresses are not supported.
- Only two "a date approaches" rules are allowed per list or library.
- Rules based on a multi-line text column are not supported.
- Notifications come from no-reply@sharepointonline.com, so tell recipients what to expect.

A staff reply in the comments of Microsoft's rules blog post said rules were limited to notifications and did not change other column values at the time. Treat that as a hint, not documentation, and check the current interface.

## Tip 3: Move to Power Automate for anything else

The Automate overview says Power Automate flows can send notifications, sync files, collect data and perform other tasks. From the list, select **Automate** > **Power Automate**, then use **Create a flow**. **See your flows** shows existing flows. **Configure flows** is where you require approval for flows.

Users without permission to create flows can still run flows the list owner created for them from the Automate menu.

## Tip 4: Customize the form layout

Select **Edit form** > **Configure layout** to add a custom header, footer and body with sections and fields. Per Microsoft's blog, this changes only how the form displays and does not change the data. Anyone who can create and manage views can configure forms. The setup uses JSON formatting.

One commenter on that post reported that configuring the body switches the form to a multi-column layout, which made multi-line text fields small. That is user-reported and may have changed.

## Tip 5: Design for the list view threshold

The list view threshold is 5,000 items. Microsoft Learn's error text reads that the number of items exceeds the list view threshold, which is 5000 items. Microsoft Support says:

- Database operations that process more than 5,000 items at once are blocked.
- A warning appears in list settings once a list passes 3,000 items.
- On SharePoint Online the threshold cannot be changed, so keep queries within it.
- Filtered views that use indexed columns return a subset of rows and help stay under the threshold.
- Modern views are less likely to produce errors than classic views.

Support lists other techniques: folders, the search box, personal views, relational lists and offline data. The pages I read do not say how many indexed columns you can create or how to add an index, so follow the linked Microsoft article on indexing before you rely on it.

## Tip 6: Know the hard limits

From the SharePoint limits page on Microsoft Learn and the Support article on large lists:

| Limit | Value |
|---|---|
| Items in a list | Up to 30 million |
| File attached to a list item | 250 MB |
| Lookup operation joins | 12 lookup, Person/Group or workflow status columns |
| Columns in one query | A query using more than 8 columns is blocked |
| Unique permissions per list | 50,000 supported, 5,000 recommended |
| Lists and libraries per site collection | 2,000 combined |
| Permissions inheritance | Cannot be broken on a list, library or folder with more than 100,000 items |

Note that two Microsoft pages give different attachment sizes. The limits page says 250 MB for a file attached to a list item, while the large lists article mentions up to 10 GB per file or attachment. The limits page is the more specific source for lists, so plan with 250 MB.

## A short checklist before you share a list

1. Pick the view layout first, then format that view.
2. Add one conditional rule for the status that needs attention, not five.
3. Set up a rule for the one change people must not miss.
4. Check permissions: unique permissions on thousands of items cause trouble.
5. If the list will pass 3,000 items, plan filtered views and indexes now.

## Related

- [Microsoft Lists](https://www.m365.fm/entity/microsoft-lists/)
- [List view threshold (SharePoint)](https://www.m365.fm/entity/sharepoint-list-view-threshold/)
- [SharePoint](https://www.m365.fm/entity/sharepoint/)

## Sources

- [Microsoft Support: Formatting list views](https://support.microsoft.com/en-US/sharepoint/lists/data-and-lists/formatting-list-views)
- [Microsoft Learn: View formatting](https://learn.microsoft.com/en-us/sharepoint/dev/declarative-customization/view-formatting)
- [Microsoft Support: Create a rule to automate a list or library](https://support.microsoft.com/office/create-a-rule-to-automate-a-list-or-library-151ea008-7fa6-409b-b0bd-b04a3b3cacd5)
- [Microsoft Support: Automate a list](https://support.microsoft.com/en-us/sharepoint/lists/automate-a-list)
- [Microsoft 365 blog: Configure forms and rules in Microsoft Lists](https://techcommunity.microsoft.com/blog/microsoft_365blog/configure-forms-and-rules-in-microsoft-lists/2088300)
- [Microsoft Support: Manage large lists and libraries](https://support.microsoft.com/en-us/office/manage-large-lists-and-libraries-b8588dae-9387-48c2-9248-c24122f07c59)
- [Microsoft Learn: Items exceed the list view threshold](https://learn.microsoft.com/en-us/troubleshoot/sharepoint/lists-and-libraries/items-exceeds-list-view-threshold)
- [Microsoft Learn: SharePoint limits](https://learn.microsoft.com/en-us/office365/servicedescriptions/sharepoint-online-service-description/sharepoint-online-limits)
