---
title: "How to Build a Knowledge Base in SharePoint: Sites, Pages, Templates and Metadata"
summary: "Microsoft has no single knowledge base wizard for SharePoint. This guide assembles the documented building blocks: one site per topic, modern pages and templates, columns and content types, search, and optional Copilot in SharePoint."
status: review
publish: false
author: mirko-p
date: 2026-12-01
topics: [sharepoint, sharepoint-hub-sites, sharepoint-managed-metadata, sharepoint-content-types]
keypoints:
  - "Microsoft documents no one-click knowledge base. You assemble one from sites, pages, page templates, metadata and search."
  - "Modern SharePoint guidance is one site per discrete topic, joined by hubs, rather than subsites."
  - "Create articles as modern pages in the Site Pages library, and save a page as a template so every article has the same structure."
  - "Columns and content types matter most for organizing pages, and deep folder nesting hurts discoverability."
  - "Microsoft Q&A staff described a classic wiki approach in 2023, and uploaded Word or Excel files cannot be shown as site pages."
faq:
  - q: "Does SharePoint have a built-in knowledge base template?"
    a: "The Microsoft sources read for this article do not describe a dedicated knowledge base template. A Microsoft Q&A answer lists general site templates instead, such as Team collaboration site, Document Center, Enterprise wiki and Publishing Portal, and suggests a wiki approach for small scale."
  - q: "Should I use a team site or a communication site?"
    a: "Microsoft Q&A staff considered a team site better suited to a knowledge base in a 2023 thread, because communication sites have no Wiki Pages Library by default. Microsoft's information architecture guidance describes both site types as providing pages, lists and libraries, so decide based on who edits and who reads."
  - q: "How do I keep articles consistent?"
    a: "Microsoft Support documents page templates. Create a page with the sections and web parts you want, select the arrow next to Save and exit, then Save as template. New pages from the template are independent of it, and templates cannot be used across sites."
  - q: "How should articles be organized?"
    a: "Microsoft Learn says columns and content types are the two most important metadata elements, and recommends topic-specific libraries and site columns over deep folder nesting. It advises avoiding folders nested beyond one or two levels."
  - q: "Can Copilot help build or search the knowledge base?"
    a: "Microsoft Learn describes Copilot in SharePoint, in public preview with general availability rolling out from September 30, 2026. It can create pages, libraries and lists, and everyday capabilities are included with a Microsoft 365 Copilot license."
---

SharePoint does not have a button that creates a knowledge base. What Microsoft documents is a set of building blocks: sites to hold content, modern pages for articles, page templates for consistency, metadata for organizing and filtering, and search to find it all. This guide puts those blocks in order. The Microsoft sources on this topic are thin, and the only step-by-step answer from Microsoft staff is a 2023 Q&A reply, so treat the choices below as a design based on documented features rather than an official recipe.

## Step 1: Plan the structure before you create anything

Microsoft Learn's information architecture guidance gives the rules that matter most here:

- **Create one site per discrete topic, task or unit of work.** Subsites are not recommended in modern SharePoint.
- **Connect related sites with hubs**, roll-up web parts such as News, Highlighted content and Sites, inline links and site navigation. A site can belong to only one hub at a time.
- **Plan with the people who will read the articles** and test navigation labels with them.
- **Navigation limit:** site, hub, global and footer navigation are each limited to 500 child links per level.

For a knowledge base, a practical reading is one site per knowledge area, such as IT help or HR policies, joined under a hub. Learn lists three page types worth designing for: home page, navigation pages that help readers decide, and destination pages with the actual information. Put the most important information at the top and use headings and bullets.

## Step 2: Choose a site type

Microsoft's guidance does not name a best site type for knowledge bases. A Microsoft Q&A answer from 2023 listed these templates:

| Template | Suggested use in the answer |
|---|---|
| Team collaboration site | Share content, store files and manage lists |
| Document Center | Large-scale document management with versions, document sets and metadata navigation |
| Enterprise wiki | Quickly capture linked, simple pages |
| Publishing Portal | Portal with approval workflows, many readers and few contributors |

The staff reply preferred a team site for a small wiki, noting communication sites have no Wiki Pages Library by default. It also noted that only .aspx files open as site pages, so uploaded Word or Excel files cannot be displayed as knowledge base content in the page itself. That thread is old and describes classic wiki pages, so for a new build most teams will use modern pages as below.

## Step 3: Create articles as modern pages

Per Microsoft Support:

1. On the site home page, select **+ New** > **Page**, or use **Create** > **Page** in the SharePoint app bar.
2. Choose a template, or **Blank**, then **Create page**.
3. Enter a title in **Add a title**. A title is required to save or publish.
4. Add web parts from the **Toolbox** or with the **+** sign, and add sections and columns as needed.
5. Select **Save as draft** or **Save and exit**, then **Publish**.

Modern pages can only be created in the Site Pages library, and a page URL cannot be changed after creation, so choose titles carefully. Add pages needs edit permission on the site. Comments, likes and views appear at the bottom of pages but not on site home pages. Headings in text web parts get anchors you can link to, which helps with long articles.

## Step 4: Save a page as a template

Consistent structure makes a knowledge base easier to read. Microsoft Support documents page templates:

1. Build a page with the sections and web parts you want, such as a problem statement, steps and related links.
2. Select the down arrow next to **Save and exit**, then **Save as template**.
3. Find it later under **Saved on this site** in the Templates gallery, opened through **+ New** > **Page**.

Edits to a page made from a template do not change the template, and later template edits do not change existing pages. Templates are stored as drafts, cannot be created from a home page and cannot be used across sites. Use **More options** (...) > **Set default selection** to make one the default for everyone on the site.

## Step 5: Add metadata so content can be found and filtered

Microsoft Learn calls **columns** and **content types** the two most important metadata elements. Metadata supports filtering, sorting, search and compliance policies. Learn also advises:

- Use columns in the **Site Pages** library so highlighted content web parts can connect related pages. Examples to consider are product, audience and article owner.
- Avoid folder nesting beyond one or two levels.
- Add topic-specific libraries and use site columns, rather than relying only on the default Documents library.

Learn lists search features that improve results, including acronyms, bookmarks and Q&A.

## Step 6: Set permissions and ownership

Learn recommends giving content creators the **site member** permission level so they can edit sites and pages and publish news, and using Microsoft 365 groups to simplify permissions on team sites. Assign an owner to each site, because Learn describes site owners as responsible for content, branding, permissions and navigation.

## Step 7: Optional, use Copilot in SharePoint

Microsoft Learn describes Copilot in SharePoint, which lets users ask questions, create pages, libraries and lists and use Autofill metadata. It was in public preview, with general availability rolling out from September 30, 2026. Everyday capabilities are included with a Microsoft 365 Copilot license, while advanced work uses Copilot Credits through usage-based billing. It is not supported in GCC, GCC High, DoD, air-gapped clouds or Microsoft 365 operated by 21Vianet. If Restricted Content Discovery is on for a site, Copilot and AI actions do not appear there.

## Common mistakes

- **Using subsites for each topic.** Microsoft recommends separate sites joined by a hub.
- **Burying articles in nested folders.** Use columns instead.
- **Uploading Word files as articles.** They cannot display as site pages. Write the article as a page, or link to the file.
- **Skipping a template.** Without one, every author invents a different structure.
- **Assuming the Q&A wiki steps are current.** They date from 2023 and describe classic pages.

## Related

- [SharePoint](https://www.m365.fm/entity/sharepoint/)
- [SharePoint hub sites](https://www.m365.fm/entity/sharepoint-hub-sites/)
- [SharePoint managed metadata](https://www.m365.fm/entity/sharepoint-managed-metadata/)
- [SharePoint Knowledge Agent](https://www.m365.fm/entity/sharepoint-knowledge-agent/)

## Sources

- [Microsoft Learn: Information architecture in modern SharePoint](https://learn.microsoft.com/en-us/sharepoint/information-architecture-modern-experience)
- [Microsoft Support: Create and use modern pages on a SharePoint site](https://support.microsoft.com/office/create-and-use-mode-pages-on-a-sharepoint-site-b3d46deb-27a6-4b1e-87b8-df851e503dec)
- [Microsoft Support: Page templates in SharePoint](https://support.microsoft.com/en-US/SharePoint/sites-pages/page-templates-in-sharepoint)
- [Microsoft Learn: Copilot in SharePoint (knowledge agent)](https://learn.microsoft.com/sharepoint/knowledge-agent-get-started)
- [Microsoft Q&A: How to create knowledge base in SharePoint Online?](https://learn.microsoft.com/en-us/answers/a/1320573)
