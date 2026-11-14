---
title: "SharePoint HTML Pages: What They Are, How to Create Them, and What the Limits Are"
summary: "SharePoint HTML pages are .html files stored in Site Pages that you can create with Copilot or upload, edit, publish and share. This guide covers the steps, licensing, the sandbox and file limits."
status: review
publish: false
author: mirko-p
date: 2026-12-02
topics: [sharepoint-html-pages, sharepoint, copilot]
keypoints:
  - "HTML pages are .html files stored in the Site Pages library. They can be edited, published and shared like other site pages."
  - "Create one via + New > HTML page, the floating Copilot button, or Create > HTML page on the Publish landing page."
  - "Creating or editing with Copilot needs a Microsoft 365 Copilot license. Uploading, direct editing, publishing and viewing do not."
  - "Pages run in a sandboxed iframe. Outbound fetch calls are blocked, and only a short list of Microsoft-managed CDN libraries is supported."
  - "The maximum HTML file size is 10 MB, not counting images and videos. Tenant admins cannot turn the feature off tenant-wide, only site owners per site."
faq:
  - q: "What is a SharePoint HTML page?"
    a: "According to Microsoft Support, it is an HTML file stored in the Site Pages library that SharePoint can render, edit, publish and share next to ordinary modern pages. You can create it with Copilot or upload an existing .html file."
  - q: "Do I need a Copilot license to use HTML pages?"
    a: "Microsoft Support says a Microsoft 365 Copilot license is required to open the creation screen from + New or Create and to create or edit with the Copilot chat pane. Uploading, moving, direct editing, publishing, sharing and viewing do not require it."
  - q: "Can an admin disable HTML pages for the whole tenant?"
    a: "Microsoft Support states that tenant admins cannot disallow HTML pages tenant-wide. Site owners can allow or disallow them per site with the Allow HTML files setting under File types in Site Pages."
  - q: "Can JavaScript run in an HTML page?"
    a: "Microsoft Support says JavaScript works when it is contained in the same HTML file, inside a sandboxed iframe. Arbitrary fetch requests, outbound API calls and cross-tenant communication are blocked, and only Microsoft-managed CDN libraries such as Chart.js, Mermaid, React, Fluent UI and Babylon are supported."
  - q: "When is the feature generally available?"
    a: "Message Center post MC1479517 and a Tech Community post list Public Preview from early October 2026 and worldwide general availability starting mid-November 2026, expected to finish by late December 2026. Your tenant may therefore not show the option yet."
---

SharePoint now supports HTML pages alongside the familiar modern (ASPX) pages. An HTML page is an .html file that lives in the Site Pages library of a site. You can ask Copilot to build it from a prompt, or upload an existing file, then edit, publish and share it. Publishing does not change permissions, so the existing SharePoint permissions still decide who can see the page. This guide covers what Microsoft documents about creating, editing, publishing and limiting these pages.

## What an HTML page is

According to Microsoft Support, SharePoint renders an HTML page inside a sandboxed iframe, separate from the SharePoint header, footer and navigation. Content Security Policy adds further isolation. The page is stored in Site Pages, so it appears with other pages for the site and can be scheduled, approved and sent as an email link.

Microsoft's Message Center post (MC1479517) describes the same feature as a way to create pages with Copilot or upload existing HTML files. It also notes that the site-scoped agent creation option is removed from the + New menu on site pages. Agents can still be created from a document library or list command bar, or from the context menu of selected files, according to the Tech Community post.

## Availability and licensing

- **Rollout:** The Tech Community post and MC1479517 give Public Preview from early October 2026. General availability worldwide begins in mid-November 2026 and is expected to finish by late December 2026. If the option is missing, the rollout may not have reached the tenant yet.
- **Copilot license:** A Microsoft 365 Copilot license is required to open the creation screen from **+ New** or **Create**, and to create or edit with the Copilot chat pane.
- **No Copilot license needed:** Uploading, moving, direct editing, publishing, sharing and viewing.
- **Admin action:** MC1479517 says no admin action is required before rollout. It suggests informing authors, updating authoring guidance and reviewing Copilot license assignments.

## Create a page

Microsoft Support lists three entry points:

1. On a site, select **+ New**, then **HTML page**.
2. On a site, select the floating Copilot button in the lower-right corner.
3. On the Publish landing page, select **Create**, then **HTML page**.

With Copilot, describe the page in the prompt box and attach files for context. Copilot opens a draft in edit mode. Confirm that the draft is saved in **Site Pages**. If it is not, ask Copilot to move it or move it yourself.

## Upload an existing HTML file

- From the creation screen, select **Upload HTML page** and choose the .html file.
- From **Site Pages**, select **Create or upload**, then **Upload HTML page** or **Upload HTML folder**.
- To convert a file that is in another document library, select **...** next to it, then **Edit**, then **Edit in SharePoint**. This moves it to Site Pages. Alternatively, select the files, choose **...**, then **Move to**, select **Site Pages**, and choose **Move here**.

Microsoft Support notes that pages created with Copilot use the site branding and follow accessibility requirements. Uploaded HTML does not get either automatically, but you can ask Copilot to match the site or to update the page.

## Edit, publish and share

- **Text changes:** Select **Edit** and change text directly on the page. No HTML coding is needed.
- **Larger changes:** Open the Copilot chat pane in edit mode and describe the change. Name the section or element and the result you expect, such as a color, an image or a new section.
- **Publish:** Select **Publish** on the command bar to make the current version visible to people who already have permission. Select **Save and close** to keep a draft.
- **Share:** Select **Share** in the upper-right area, then **Share page** (specific people, groups or a copied link) or **Send to email** (a summary and link to site members).

## Limits and security rules

The Microsoft Support article lists the following.

| Area | What Microsoft documents |
|---|---|
| File size | Up to 10 MB per HTML file, not counting images and videos. Those are copied to the Site assets folder. |
| JavaScript | Works when contained in the same HTML file. The sandbox cannot access browser localStorage. |
| Network calls | Arbitrary fetch requests, outbound API calls and cross-tenant communication are blocked. |
| Libraries | Only Microsoft-managed CDN libraries: Chart.js, Mermaid, React, Fluent UI and Babylon. |
| External links | Links to other tenants or outside SharePoint need the domain on the site's allow list. Go to **Settings**, **Site information**, **View all site settings**, then **HTML Field Security**. |
| Images | User-added images (base64 or same-domain URLs) are supported. Stock, organization and AI-generated images are not. |
| Live data | Data from lists and Excel is supported. Third-party live data, such as Jira, is not. |

Features that Microsoft lists as not supported include inline video and audio, promote to news post, rich email, Amplify to Teams or Viva Engage, mobile editing, save as template, private drafts, co-authoring, reactions and comments.

## Turning HTML pages on or off

HTML pages are on by default. A site owner can turn them off per site, and turn them back on, in Site Pages under **File types** with the **Allow HTML files** setting. Tenant admins cannot disallow HTML pages tenant-wide. To check a site with PowerShell, Microsoft Support points to `Get-PnPFeature`. When HTML files are enabled, the feature name is HtmlPages.

## Practical checks before you publish

- Reduce file size by linking to hosted assets instead of embedding them, trimming inline CSS and JavaScript, and removing unused markup.
- Confirm that any libraries you use are on the supported list. Other CDN or open-source sources are not supported.
- Review the audience. Publishing grants no new permissions, so check the site and page permissions if the content is sensitive.
- Test on desktop. Mobile editing and viewing in the Teams mobile app and the iOS and Android apps are listed as not supported, with Microsoft noting a later rollout.

The pages read do not describe how HTML pages interact with other governance tools such as retention or sensitivity labels, so verify those separately in your tenant.

## Related

- [HTML pages in SharePoint](https://www.m365.fm/entity/sharepoint-html-pages/)
- [SharePoint](https://www.m365.fm/entity/sharepoint/)
- [Microsoft 365 Copilot](https://www.m365.fm/entity/copilot/)

## Sources

- [Microsoft Support: Create, upload, edit, and publish HTML pages in SharePoint](https://support.microsoft.com/en-us/sharepoint/create-edit-publish-html-pages)
- [Microsoft Tech Community: SharePoint HTML pages with Copilot, create, upload, edit and publish (community post, October 2026)](https://techcommunity.microsoft.com/discussions/microsoft-365/sharepoint-html-pages-with-copilot-create-upload-edit-and-publish/4563209)
- [Message Center MC1479517: SharePoint HTML pages (mirror)](https://mc.merill.net/message/MC1479517)
