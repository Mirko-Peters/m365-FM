---
title: "SharePoint HTML Pages with Copilot: Create, Upload, Edit and Publish"
summary: "How HTML pages work in SharePoint: create one with Copilot or upload a file, edit and publish it, which licenses apply, what the sandbox blocks, and what is unclear about HTML list views."
status: review
publish: false
author: mirko-p
date: 2026-12-04
topics: [sharepoint, sharepoint-html-pages, microsoft-lists, copilot]
keypoints:
  - "HTML pages live in the Site Pages library. You create them with Copilot or upload an .html file of up to 10 MB, then edit, publish and share like other pages."
  - "Creating or editing with the Copilot pane needs a Copilot license. Uploading, editing text directly, publishing and viewing do not."
  - "Pages run in a sandboxed iframe. Arbitrary fetch requests and outbound API calls are blocked, and only Chart.js, Mermaid, React, Fluent UI and Babylon CDN libraries are allowed."
  - "Publishing makes the page visible to people who already have permission. It does not grant new access."
  - "Microsoft's pages I read do not document HTML list views, so treat that feature as unverified until you see it in your tenant."
faq:
  - q: "What is an HTML page in SharePoint?"
    a: "Microsoft Support describes it as a page you create with Copilot or by uploading an existing HTML file. It is stored in the Site Pages library, where you can edit, publish and share it alongside modern pages. Some features were rolling out gradually to Microsoft Frontier program participants when the article was written."
  - q: "Do I need a Copilot license to use HTML pages?"
    a: "Only for some tasks. Microsoft Support says opening the HTML creation screen and using the Copilot chat pane need a Copilot license. Uploading or moving HTML into Site Pages, editing content directly, publishing, sharing and viewing do not."
  - q: "How big can an uploaded HTML file be?"
    a: "Microsoft Support gives a limit of 10 MB per HTML file. Images and videos don't count toward it, because SharePoint copies them to the Site assets folder. To shrink a file, link to hosted assets, reduce inline CSS and JavaScript or remove unused markup."
  - q: "Can an admin turn HTML pages off for the tenant?"
    a: "According to Microsoft Support, HTML pages are enabled by default and you can't disallow or restrict them tenant-wide. Site owners control the setting per site, using Site Pages, then File types, then Allow HTML files."
  - q: "Are HTML list views a documented feature?"
    a: "The Microsoft pages I read do not mention HTML list views. The Support article says HTML pages can share live data from lists and Excel without arbitrary fetch, but it says nothing about a dedicated list view type. Check your own tenant and Microsoft's current documentation before relying on it."
---

SharePoint now lets you create an HTML page with Copilot, or upload your own HTML file, and publish it from the Site Pages library like any other page. The page runs in a sandbox, so there are firm limits on scripts and external calls. This guide covers the steps, the license rules and the restrictions Microsoft documents.

## Availability

Microsoft's Message Center post MC1479517, dated 25 September 2026, gives this schedule:

- Public preview began in early October 2026.
- General availability, worldwide, begins mid-November 2026 and should finish by late December 2026.

The Support article adds that some features roll out gradually to Frontier program participants. Your tenant may therefore show only part of what follows. The post says no admin action is required before rollout.

## Create a page with Copilot

Entry points per Microsoft Support:

- On a site, select **+ New** > **HTML page**.
- On a site, select the floating Copilot button in the lower-right corner.
- On the Publish landing page, select **Create** > **HTML page**.

Steps:

1. Open one of the entry points.
2. Describe the page in the prompt box and optionally attach files.
3. Submit. Copilot creates a draft in edit mode.
4. Confirm the page is in **Site Pages**. If not, ask Copilot to move it or move it yourself.

Put content, layout and color requirements into the prompt. Copilot-created pages follow accessibility requirements and use site branding automatically. Uploaded HTML gets neither, but you can ask Copilot to update it.

## Upload an HTML file

- From the creation screen, select **Upload HTML page**, choose the `.html` file and the page opens in edit mode.
- From **Site Pages**, select **Create or upload**, then **Upload HTML page** or **Upload HTML folder**.
- The limit is **10 MB** per HTML file. Images and videos don't count, since SharePoint copies them to **Site assets**.

To move an existing file into Site Pages, either use **...** > **Edit** > **Edit in SharePoint** (this moves the file out of the original library) or select the files and use **Move to** > **Site Pages** > **Move here**.

## Edit, publish and share

- Select **Edit** and click text to change it directly. No HTML coding is needed.
- With a Copilot license, open the Copilot chat pane and describe the change. Name the section or element and the result you expect.
- Select **Publish** to make the current version visible to people who already have permission. Select **Save and close** to keep it unpublished.
- Select **Share** to add people or groups, copy a link, or send a summary and link by email.

The September 2026 SharePoint blog adds that you can comment on AI-generated HTML as in a Word document, and Copilot then applies edits to the HTML, CSS and layout.

## License matrix

| Task | Copilot license |
|---|---|
| Open the HTML creation screen (+ New or Create) | Yes |
| Create or edit with the Copilot chat pane | Yes |
| Upload or move HTML to Site Pages | No |
| Edit content directly | No |
| Publish or share | No |
| View a published page | No |

Each task still needs the matching SharePoint permission, such as create or edit pages.

## What the sandbox blocks

Pages render in a sandboxed iframe, isolated from the SharePoint header, footer and navigation, with Content Security Policy rules on top. Microsoft lists these restrictions:

- Arbitrary fetch requests and outbound API calls are blocked, as is cross-tenant communication.
- Only Microsoft-managed libraries are allowed from CDN: Chart.js, Mermaid, React, Fluent UI and Babylon.
- JavaScript must be in the same HTML file, and browser localStorage is not accessible.
- Links to other domains can fail with a message that your organization doesn't allow access. A site admin can add the domain under **Settings** > **Site information** > **View all site settings** > **HTML Field Security**.

The September post says each tenant has an `_html` guidance page that helps AI assistants write HTML that works inside this sandbox. Standard web HTML from other AI tools may not work without it.

## Not supported yet

Per Microsoft Support, these are not supported: stock or AI-generated images, inline video and audio, inline Office files and PDFs, third-party live data, promote to news post, save as template, private drafts, co-authoring, and reactions and comments. Mobile editing and viewing in some apps are listed as not supported or rolling out later.

Supported items include scheduling and approvals, analytics, anchor links, and live data sharing from lists and Excel without arbitrary fetch.

## HTML list views: what is known

The Microsoft pages I read, including the Support article, the Message Center post and both SharePoint blog posts, do not mention HTML list views. A third-party site summarized a community demo by an MVP, dated 9 November 2026, that describes asking Copilot inside a list to build a custom HTML view. That summary says users can't add or edit items inside the view and that licensing and availability were not covered. Treat it as unverified, and test in your tenant before you promise it to anyone.

## Common mistakes

- Embedding large assets inline and hitting the 10 MB limit.
- Calling an external API from the page and wondering why it fails.
- Assuming publish shares the page. It only makes it visible to people who already have permission.
- Pasting HTML from another AI tool and expecting it to work as-is.

## Related

- [SharePoint](https://www.m365.fm/entity/sharepoint/)
- [SharePoint HTML pages](https://www.m365.fm/entity/sharepoint-html-pages/)
- [Microsoft Lists](https://www.m365.fm/entity/microsoft-lists/)
- [Microsoft Copilot](https://www.m365.fm/entity/copilot/)

## Sources

- [Create, upload, edit, and publish HTML pages in SharePoint (Microsoft Support)](https://support.microsoft.com/en-us/sharepoint/create-edit-publish-html-pages)
- [MC1479517: SharePoint HTML pages (Message Center, mirrored)](https://mc.merill.net/message/MC1479517)
- [What is new in Copilot in SharePoint, September 2026 (SharePoint blog, mirrored)](https://www.elevenforum.com/t/what-is-new-in-copilot-in-sharepoint-for-september-2026.49187/)
- [SharePoint HTML list views demo summary (HubSite 365, third party)](https://www.hubsite365.com/en-ww/crm-pages/your-sharepoint-list-can-be-an-app-now-html-list-views.htm)
