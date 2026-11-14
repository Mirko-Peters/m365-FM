---
title: "Power Pages Liquid and Lists: Check for Unintended Data Exposure Through Table Permissions"
summary: "What Microsoft Learn says about how table permissions govern Liquid output and lists in Power Pages, which tag parameters take request values, and a review checklist, with a clear note on what the pages read do not document."
status: review
publish: false
author: mirko-p
date: 2026-12-20
topics: [power-pages, power-pages-table-permissions, power-platform]
keypoints:
  - "Learn says table permissions govern all data accessed by Liquid objects and tags, and that this cannot be switched off. Liquid output is therefore only as safe as the table permissions behind it."
  - "New websites enforce table permissions for all lists regardless of the Enable Table Permissions setting. Anonymous access must be configured explicitly with the Anonymous Users web role."
  - "The entitylist and entityview tags accept parameters such as filter, metafilter, order and search, and Learn's examples often fill them from request parameters. Treat those values as user input."
  - "Learn recommends checking permissions in Liquid, for example with the table object's permissions property, before retrieving data."
  - "The pages read do not describe a Liquid code leak or an unfiltered EntityList metadata issue as such. This article covers the documented controls and says where the documentation stops."
faq:
  - q: "Do table permissions apply to Liquid?"
    a: "Yes. Learn says table permissions govern all data that is accessed by Liquid objects and tags, and that it is not possible to switch off this feature. The output varies with the current website user, their web roles and the associated table permission rows."
  - q: "How do I check access in a Liquid template before showing data?"
    a: "Learn shows an example that retrieves a record and checks account.permissions.can_read before rendering it, with a fallback for users without access and a message for anonymous visitors. It describes the Permissions property of the table object as the way to verify specific privileges."
  - q: "Does a list expose records without table permissions?"
    a: "Learn says that to secure a list you must configure table permissions for the table. Starting with release 9.3.7.x, newly created websites enforce table permissions for all lists irrespective of the Enable Table Permissions setting."
  - q: "What does the ShowRecordLevelActions site setting do?"
    a: "Per Learn, setting EntityList/ShowRecordLevelActions to true shows the record-level actions that apply to the signed-in user. If it is false and the table has multiple permissions, all record-level actions are visible, and an error appears when a user tries an action without authorization."
  - q: "Does the editable tag process Liquid in its content?"
    a: "Learn lists a liquid parameter for the editable tag with a default of true, meaning Liquid template code found in the rendered text is processed, and an escape parameter whose default is false. Review who can edit such content."
---

Power Pages Liquid does not bypass security. Microsoft Learn states that table permissions govern all data accessed by Liquid objects and tags and that this cannot be turned off. When a page shows data it should not, the cause is usually a table permission that is too broad, an anonymous web role that was granted more than intended, or a template that trusts request values. This article collects what Learn documents for those controls. The pages read do not describe a "Liquid code leak" or an "unfiltered EntityList metadata" problem by those names, so the checklist below is built from the documented behavior.

## What Learn guarantees

From the Liquid data security unit:

- Liquid extensions give access to Microsoft Dataverse.
- Table permissions apply to everything Liquid objects and tags retrieve. They also make output dynamic, because it varies with the current website user, their web roles and the associated table permission rows.
- Developers can check particular access rights before retrieving data. Learn's example assigns an account from the signed-in user, tests `account.permissions.can_read`, and shows "Unknown company" otherwise. For anonymous visitors, it shows a generic message.

From the page on securing lists:

- To secure a list, configure table permissions for the table whose records are displayed.
- Starting with release 9.3.7.x, newly created websites enforce table permissions for all lists regardless of the **Enable Table Permissions** setting. The same applies to sites converted from trial to production.
- For anonymous access, use table permissions related to the **Anonymous Users** web role, or a custom web role with the **Anonymous Users Role** option.
- For per-user data, add a relationship between the table and the contact or account table and use the permission types **Account** or **Contact** with the right web roles.
- If a role has no permission for a table, Learn says the user should not have access to the page at all, and recommends page permissions as well.

## Where tag parameters meet user input

The Dataverse Liquid tags page documents the `entitylist` and `entityview` tags. Several `entityview` parameters are designed to take their value from the request, and Learn's examples do exactly that:

- `filter` (user or account), `metafilter`, `order`, `page`, `page_size` and `search` are shown with `request.params` values.
- `metafilter` sets the list metadata filter expression for view results, and is valid only when `entityview` is used inside an `entitylist` block.
- When `entityview` sits inside an `entitylist` block, it inherits the list's default configuration such as page size and filter options.

Learn does not say these values are validated against a policy beyond table permissions. Based on that, a reasonable reading is that anything a user can append to the URL changes what the tag asks for, while table permissions decide what the tag can return. That is the author's interpretation, not a Learn statement.

The `editable` tag has two parameters that matter for content editors. `liquid` defaults to true, so Liquid code in the rendered text is processed, and `escape` defaults to false, so the value is not HTML-encoded unless you set it. Learn's `searchindex` example uses the `escape` filter on result URLs and titles.

## Review checklist (author's suggestion)

The items below are suggestions that apply the documented controls:

1. List every table permission that is related to the **Anonymous Users** web role. Check the privileges and the scope.
2. For each list page, confirm that table permissions exist for the list's table, and that the page itself is protected with page permissions where users without table access should not see it.
3. In templates that use `entitylist` or `entityview` with `request.params`, check which permissions apply to the tables behind them.
4. Test as a signed-in user with the lowest web role and as an anonymous visitor, not as the maker. Learn notes that the design studio shows values according to the maker's privileges, so results there can differ from the live site.
5. Review who can edit content that is rendered with the `editable` tag.
6. Set **EntityList/ShowRecordLevelActions** to true if the list should show only the actions that apply to the signed-in user.

## What the documentation does not say

The pages read do not describe how metadata of a list, such as its view columns or filter definitions, is exposed to users, and they do not list a Power Pages setting that hides it. They also do not describe a case where raw Liquid code is shown to visitors. If you see either, the Learn pages read give no troubleshooting steps, so check the site's table permissions and web templates first and open a support case if the behavior persists.

## Related

- [Power Pages](https://www.m365.fm/entity/power-pages/)
- [Power Pages table permissions](https://www.m365.fm/entity/power-pages-table-permissions/)
- [Power Platform](https://www.m365.fm/entity/power-platform/)

## Sources

- [Data security and Liquid (Microsoft Learn)](https://learn.microsoft.com/en-us/training/modules/power-pages-liquid/data-security-liquid)
- [Securing lists (Microsoft Learn)](https://learn.microsoft.com/en-us/power-pages/configure/securing-lists)
- [Dataverse Liquid tags (Microsoft Learn)](https://learn.microsoft.com/en-us/power-pages/configure/liquid/dataverse-liquid-tags)
