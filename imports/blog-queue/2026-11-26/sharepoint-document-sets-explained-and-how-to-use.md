---
title: "SharePoint Document Sets: What They Are and How to Use Them"
summary: "Document sets group related files into one managed unit with shared metadata, default content and versioning. How they work, how to set them up, and why Microsoft's own sources are thin for Microsoft 365."
status: review
publish: false
author: mirko-p
date: 2026-11-26
topics: [sharepoint, sharepoint-content-types, sharepoint-document-libraries]
keypoints:
  - "A document set is a special kind of folder, built on a content type, that manages one work product made of several files as a single unit."
  - "Set-level settings include allowed content types, default content, shared columns, welcome page columns and a default welcome page view."
  - "In a library, a document set is created from the New menu once its content type has been added to that library."
  - "Per a 2019 Microsoft post, modern libraries show sets like ordinary folders. Capture Version and Version History are in the context menu, custom welcome pages are not supported."
  - "Microsoft's current documentation for SharePoint in Microsoft 365 is thin here. Most official pages describe SharePoint Server, so verify steps in your own tenant."
faq:
  - q: "What is a document set in SharePoint?"
    a: "Microsoft's planning documentation says document sets let an organization manage a single deliverable or work product that can include multiple documents or files. It describes a document set as a special kind of folder that combines folder and document behavior with its own metadata and user interface. Examples it gives are a legal case file and a sales RFP."
  - q: "How is a document set different from a folder?"
    a: "A document set is a content type, so it carries its own metadata, allowed content types, default content and versioning. A 2020 Microsoft 365 community docs article says document sets are not folders even though they look like them, and advises against mixing folders and sets in one library. The Microsoft Support introduction does not compare the two."
  - q: "Do document sets work in modern SharePoint libraries?"
    a: "A 2019 post by a Microsoft employee on the Microsoft Community Hub says sets look and feel like ordinary folders in modern libraries, with shared metadata, default content and versioning commands still working. Custom welcome pages are not supported there, and other set-specific ribbon actions exist only in classic. The post is old, so test in your tenant."
  - q: "How do I turn document sets on?"
    a: "An archived community article on Microsoft Learn describes activating the Document Sets site collection feature under Site Settings, then Site collection features. After that you create a Document Set content type and add it to a library. Microsoft's SharePoint Server planning page gives the same feature step for server farms."
  - q: "Is there a limit on files in a document set?"
    a: "The SharePoint Server planning page states no limit on documents per set, but says display is bound by the list view threshold, which is 5,000 items by default. It also says a plain folder structure may suit very large collections. That page applies to SharePoint Server, not to Microsoft 365."
---

A document set is a group of related files that SharePoint treats as one item. Think of a contract package, a case file or a tender response. The set has its own metadata, can start with default documents, and can be versioned as a whole.

One caveat first. Most of Microsoft's current pages on document sets describe SharePoint Server, and the planning page marks SharePoint in Microsoft 365 as not applicable. For Microsoft 365, the best evidence I could read is a 2019 Microsoft post, an archived community wiki article and a Microsoft 365 community docs article. Those are labeled below. Treat menu names as a starting point and check them in your tenant.

## What a document set is

Microsoft's planning page describes a document set as a special kind of folder that combines unique document set attributes with the behavior of folders and documents. It supports a UI, metadata and object model elements to manage the whole work product.

A document set content type can define:

- **Allowed content types:** which kinds of files can be stored.
- **Default content:** documents created automatically in each new set.
- **Shared columns:** metadata that is applied to every file in the set.
- **Welcome page columns:** which properties show on the set's home page.
- **Default welcome page view:** how the contents are listed.

The Microsoft Support introduction adds that a set can be sent to the Content Organizer for routing, that review or approval workflows can run on the whole set as if it were one file, and that authors can capture a version snapshot of the properties and documents.

## When to use one

Use a document set when several files belong together and share properties, and when you want to create the same starter documents every time. Microsoft's examples are a legal team collecting documents, photos and audio for a case, and a sales team building an RFP.

Use a plain folder or a metadata column in a library when you only need to separate files. The planning page itself says that for a collection with a large number of items, a folder structure in a document library may be a better solution.

## Set it up in SharePoint Online

The archived wiki article is community-contributed, last updated in January 2024, and its author writes "I hope it works". Its steps use classic navigation, so labels may differ in your tenant.

1. **Activate the feature.** Select the gear icon, then **Site Information** > **View all site settings**. Under **Site Collection Administration**, select **Site collection features** and activate **Document Sets**. The article says the feature is not enabled by default.
2. **Create the content type.** In **Site Settings**, under **Web Designer Galleries**, select **Site content types** > **Create**. Name it and choose **Document Set Content Types** as the source, with **Document Set** as the parent.
3. **Configure it.** Add site columns. Open **Document Set settings** to add templates, shared columns and welcome page columns.
4. **Add it to a library.** In library settings, open **Advanced Settings**, set **Allow management of content types** to **Yes**, then select **Add from existing site content types** and add your document set type.
5. **Create a set.** In the library, select **New** and choose the document set type. Fill in the properties and save.

The Microsoft 365 community docs article, written in 2020, describes the same flow. It also shows shared columns in practice: a value set on the set is passed to the files inside, and changing it updates those files, while a column that is not shared stays per file.

## What changes in modern libraries

A 2019 post by a Microsoft employee on the Microsoft Community Hub explains how sets behave in modern libraries. According to the post:

- Sets look and feel like ordinary folders.
- Drag and drop upload, pinning and flows on items work.
- Shared metadata, default content and default view settings still apply.
- Welcome page columns sort to the top of the details pane.
- **Capture Version** and **Version History** appear in the context menu.
- Customized welcome pages with custom HTML or web parts are not supported and still show in classic.
- Other set-specific ribbon actions are available only in classic.

Replies in the thread report problems over the years, such as shared columns not syncing when files are copied or moved in, and a missing update command. Those are user reports, not Microsoft statements.

## Classic steps (SharePoint Server)

The Microsoft Support page for SharePoint Server 2019 and 2016 describes the classic flow. Open a library with the set type, select the **File** tab, open the arrow next to **New Document** and choose **Document Set**. Enter a name and description. The welcome page opens, where the **Manage** tab holds **Permissions**, **Capture Version**, **Version History** and **E-mail a Link**.

By default a set inherits the library's permissions. Unique permissions need the Design or Full Control level, and the page warns that per-set permissions can get complicated and suggests library-level permissions when many sets need similar access. Versioning must be enabled on the library for the version commands.

## Limits to know

These come from the SharePoint Server planning page and may not match Microsoft 365:

| Item | Documented behavior |
|---|---|
| Files per set | No limit stated, display bound by the list view threshold (5,000 by default) |
| Folders inside a set | Allowed, but metadata navigation cannot be used |
| Send to | Total size of a set cannot exceed 50 MB |
| Shared metadata updates | With more than 10 items, a timer job runs every 15 minutes |

## Common mistakes

- Mixing folders and sets in one library, which the community article advises against.
- Relying on a custom welcome page in modern libraries.
- Assuming server limits apply online without checking.
- Skipping the planning step: decide allowed types, defaults and shared columns before users create sets.

## Related

- [SharePoint](https://www.m365.fm/entity/sharepoint/)
- [SharePoint content types](https://www.m365.fm/entity/sharepoint-content-types/)
- [SharePoint document libraries](https://www.m365.fm/entity/sharepoint-document-libraries/)

## Sources

- [Microsoft Support: Introduction to Document Sets](https://support.microsoft.com/en-us/sharepoint/libraries/introduction-to-document-sets)
- [Microsoft Support: Create and manage Document Sets (SharePoint Server)](https://support.microsoft.com/en-us/sharepoint/libraries/create-and-manage-document-sets)
- [Microsoft Learn: Document sets planning (SharePoint Server)](https://learn.microsoft.com/en-us/SharePoint/governance/document-set-planning)
- [Microsoft Community Hub: Update, Document Sets in Modern Document Libraries (2019)](https://techcommunity.microsoft.com/discussions/sharepoint_general/update-document-sets-in-modern-document-libraries/464058)
- [Microsoft 365 Community docs: Document sets are magic (community content)](https://pnp.github.io/community-docs/articles/document-sets-are-magic.html)
- [Microsoft Learn archive: Modern SharePoint Online document set (TechNet wiki, community content)](https://learn.microsoft.com/ko-kr/archive/technet-wiki/54069.modern-sharepoint-online-document-set)
