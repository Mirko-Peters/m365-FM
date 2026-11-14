---
title: "Copilot Notebooks for Every Project: How to Create One and Add References"
summary: "How to open Microsoft 365 Copilot Notebooks, create a notebook for a project, add references, and what the limits are, including conflicting Microsoft guidance about emails, meetings and chats as references."
status: review
publish: false
author: mirko-p
date: 2026-12-01
topics: [copilot-notebooks, copilot, copilot-pages, microsoft-loop]
keypoints:
  - "A Copilot notebook is a scoped workspace. Copilot answers only from the references you add, not from the rest of your account."
  - "Create one under Notebooks > All notebooks > New notebook, name it, add references, then select Create."
  - "Supported references include Word, PowerPoint, Excel and PDF files, Copilot Pages, Loop files, OneNote pages, web URLs and SharePoint folders or sites."
  - "Copilot grounds on up to 300 references for Copilot users. Copilot Chat users can add up to 50, according to the add-references article."
  - "Microsoft pages disagree on whether emails, meetings and chats can be references, so test this in your own tenant."
faq:
  - q: "What is a Copilot notebook?"
    a: "Microsoft Support describes it as an AI-powered workspace for a focused task or project. Copilot gives answers grounded in the references you add, and the notebook opens in both the Copilot app and OneNote."
  - q: "Where do I find Notebooks?"
    a: "According to Microsoft Support, go to m365.cloud.microsoft and select Notebooks in the left navigation. If it is missing, open the app launcher and select Notebooks. A Tech Community reply says the entry point moved to the App Launcher in some cases."
  - q: "How many references can a notebook use?"
    a: "The Microsoft Support article on adding references says Microsoft Copilot users can add more than 300 references but only the first 300 are used for grounding, while Copilot Chat users can add up to 50 and all are used. The how-it-works article states a cap of 300 files per notebook."
  - q: "Can I add emails and meetings to a notebook?"
    a: "The Get started article lists Meetings and Emails as filters for suggested references, but the add-references article and the updated-experience blog list only file, page, URL and OneDrive or SharePoint sources. Microsoft's pages are not consistent here, so check the Add references panel in your tenant."
  - q: "What licenses are needed?"
    a: "Microsoft Support says a Microsoft Copilot or Copilot Chat license is required and creating notebooks needs a SharePoint or OneDrive service plan. A Tech Community post states the refreshed experience requires a Microsoft 365 Copilot license."
---

A Copilot notebook gives one project its own AI workspace. You pick the files and links that matter, and Copilot answers only from those. That makes it a good fit for onboarding, recurring reports and focused deliverables. This guide shows how to open and create a notebook, how to add references, and which limits Microsoft documents. One caveat first: Microsoft's own pages are inconsistent about which reference types are supported, so verify in your tenant.

## What a notebook is

Microsoft Support describes Copilot Notebooks as an AI-powered workspace designed for the content that matters most to a task. Each notebook is scoped. Copilot uses only the references you add, not other content in your account, and the references update as the source files change. You can work in the Microsoft Copilot app or in OneNote, and the same notebook opens in both.

A Microsoft Tech Community post about the updated experience (published March 2026) adds that the layout shows references, Copilot Pages and Copilot chats side by side, and that an overview page summarizes the references. It also lists quick create options such as drafts, audio overviews, flash cards and quizzes.

## Requirements

- Microsoft Support: a Microsoft Copilot or Copilot Chat license, plus a SharePoint or OneDrive service plan to create notebooks.
- The Tech Community post: the refreshed experience is generally available to commercial users with work or school accounts, requires a Microsoft 365 Copilot license and an active SharePoint or OneDrive license, and is not available to Personal, Family and Premium subscribers.
- Support notes that features roll out gradually and the Copilot Home experience may change what you see.

## Create a notebook

Steps from Microsoft Support:

1. Go to m365.cloud.microsoft and select **Notebooks** in the left navigation. If it is missing, open the app launcher and select **Notebooks**.
2. Select **Notebooks** to expand the list, then **All notebooks**.
3. Select **New notebook**. Later, use the plus button next to **Notebooks**.
4. Enter a name.
5. Under **Add content to References**, add content (see below).
6. Select **Create**.

For the OneNote experience, Support points to onenote.cloud.microsoft/copilotnotebooks.

## Add references

Microsoft Support lists these methods:

- **Suggested references:** Copilot proposes items. Filters named in the Get started article are **All**, **Files**, **Meetings**, **Emails** and **Sites**.
- **Search:** find a file, or a SharePoint site, library or folder you can access.
- **Upload:** pick a file from your device.
- **Link:** a URL to a file or folder in your organization's OneDrive or SharePoint, or a public web page. External links must be publicly accessible. Authenticated or paywalled content and linked subpages are not supported.
- **OneDrive:** pick a file or whole folder.
- **Drag and drop:** drop files into the references area.

To add more later, open the notebook, select **Add references** at the top of the Content pane in the Copilot app, or the plus button next to **References** in OneNote, choose a method and select **Add**.

Supported file types listed by Microsoft: .docx, .pptx, .xlsx, .pdf, .loop, .page, .txt, .rtf and OneNote pages.

### The email, meeting and chat question

The task title mentions mails, meetings and chats. Microsoft's pages do not agree:

- The Get started page lists **Meetings** and **Emails** as filters and mentions chats and meeting notes in its introduction.
- The add-references page says it does not mention meetings, emails or Copilot chat as reference sources.
- The Tech Community post lists only files, OneNote pages, PDFs and Copilot Pages and says more types are coming.
- The how-it-works page lists files, Pages, Loop files, OneNote, web URLs and SharePoint locations.

The safe reading is that files, pages, links and SharePoint or OneDrive locations are documented as supported. Treat emails, meetings and chats as something to test in your own notebook before you promise it to a team.

## Limits

- Copilot uses up to 300 files per notebook to generate answers. When you add a SharePoint folder or site, Copilot selects up to 300 of the most relevant files you can access. To guarantee a file is included, add it directly.
- Copilot Chat users can add up to 50 references, and all 50 are used.
- You cannot create charts, graphs or images in a notebook.
- Deleted notebooks and Copilot Pages cannot currently be undone, and a notebook recycle bin is in development.
- Audio overviews support English, Spanish, Japanese, French, German, Portuguese, Italian and Chinese.

## Using the notebook

Ask Copilot to summarize documents, find themes, draft an email or plan, or prepare talking points. Because answers draw only on the references, a good habit is to add the project charter, the latest status report and the key decision documents first, then ask questions. Microsoft's example prompts include a summary of project documents and a one-page proposal drafted from notebook files.

## Sharing

When you share a notebook, recipients are invited to the linked files unless some are outside their access. You need permission to share each linked file, or recipients must request access. Microsoft Copilot users can reach premium sources such as Teams, SharePoint and OneDrive content, while Copilot Chat users have standard sources only.

## Common mistakes

- Adding a huge SharePoint site and expecting every file to be used. Only up to 300 are selected.
- Linking a page behind a login. Authenticated content is not supported.
- Sharing a notebook while recipients lack access to the files.
- Deleting a notebook without a copy of what you need.

## Related

- [Copilot Notebooks](https://www.m365.fm/entity/copilot-notebooks/)
- [Copilot Pages](https://www.m365.fm/entity/copilot-pages/)
- [Microsoft Loop](https://www.m365.fm/entity/microsoft-loop/)
- [Microsoft 365 Copilot](https://www.m365.fm/entity/copilot/)

## Sources

- [Microsoft Support: Get started with Microsoft 365 Copilot Notebooks](https://support.microsoft.com/en-us/microsoft-365-copilot/get-started-with-microsoft-365-copilot-notebooks)
- [Microsoft Support: How Microsoft 365 Copilot Notebooks works](https://support.microsoft.com/en-US/Microsoft-365-Copilot/how-microsoft-365-copilot-notebooks-works)
- [Microsoft Support: Add references to your Microsoft 365 Copilot Notebook](https://support.microsoft.com/en-us/Microsoft-365-Copilot/add-references-to-your-microsoft-365-copilot-notebook)
- [Microsoft Tech Community: Meet the updated Copilot Notebooks experience](https://techcommunity.microsoft.com/t5/microsoft-365-copilot-blog/meet-the-updated-copilot-notebooks-experience-your-home-for/ba-p/4501383)
