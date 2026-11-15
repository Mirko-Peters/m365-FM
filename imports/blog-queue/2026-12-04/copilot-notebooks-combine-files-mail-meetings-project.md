---
title: "Copilot Notebooks: Combine Files, Emails and Meetings in One Project"
summary: "How Microsoft 365 Copilot Notebooks gather files, emails, meetings and sites as references for one project, how to create a notebook, and the documented limits such as 300 files and no charts."
status: review
publish: false
author: mirko-p
date: 2026-12-04
topics: [copilot-notebooks, copilot, onenote, copilot-pages]
keypoints:
  - "A notebook is a scoped workspace. Copilot answers only from the references you add, not from your whole OneDrive, mailbox or Teams chats."
  - "When you create a notebook you can add files, meetings, emails and sites as references, or upload files, pick them from OneDrive or drag them in."
  - "Copilot uses up to 300 files per notebook. For shared locations it picks the most relevant files, so add critical files directly."
  - "Notebooks can't create charts, graphs, data visualizations or images, and deleting a notebook is permanent."
  - "You need a Microsoft Copilot or Copilot Chat license, plus a SharePoint or OneDrive service plan to create notebooks."
faq:
  - q: "What are Copilot Notebooks?"
    a: "Microsoft Support describes Copilot Notebooks as an AI-powered workspace that brings a project's content together, including Copilot chats, files, pages, meeting notes and links. You can use a lightweight version in the Microsoft Copilot app or the fuller version in OneNote, and the same notebook opens in both."
  - q: "Which license do I need for Copilot Notebooks?"
    a: "Microsoft Support says a Microsoft Copilot or Copilot Chat license is required, and accounts need a SharePoint or OneDrive license (service plan) to create notebooks. Microsoft 365 Personal, Family, Premium and Pro subscribers can also use it."
  - q: "Does a notebook see all my mail and files?"
    a: "No. Microsoft Support says Copilot does not access your entire OneDrive, email, Teams chats or the web through a notebook. It only uses the references you add, so you control what it can see."
  - q: "How many files can a notebook use?"
    a: "According to Microsoft Support, Copilot uses up to 300 files per notebook to generate answers. If you add a shared location such as a SharePoint folder or site, Copilot selects up to 300 files that are most relevant to your prompt. To guarantee a file is included, add it directly."
  - q: "Can a notebook create charts or images?"
    a: "No. The Microsoft Support article on how Notebooks work says notebooks can't create charts, graphs, data visualizations or images. It also says audio overviews are limited to English, Spanish, Japanese, French, German, Portuguese, Italian and Chinese."
---

A Copilot Notebook is the place to gather everything for one project, such as files, emails, meetings and SharePoint sites, so Copilot can answer questions from that material only. You create a notebook, add references, then ask for summaries, themes, drafts or next steps. This article covers the setup and the limits Microsoft documents.

## What a notebook does

Microsoft Support describes Notebooks as an AI-powered workspace for a project's content: Copilot chats, files, pages, meeting notes and links. There are two ways in:

- The lightweight experience in the Microsoft Copilot app.
- The fuller, workspace-focused version in OneNote.

The same notebook opens in both. Microsoft notes that **Home**, a new Copilot starting point, was still rolling out when the article was written, so your screen may differ.

The key design idea is scope. Copilot uses only the content you add as references to answer. That is different from asking Copilot Chat a general question about your work data.

## License and access

Per Microsoft Support:

- A Microsoft Copilot or Copilot Chat license is required.
- Accounts need a SharePoint or OneDrive license (service plan) to create notebooks.
- Microsoft 365 Personal, Family, Premium and Pro subscribers can also use Notebooks.

## Step by step: create a notebook

1. Go to **m365.cloud.microsoft**.
2. In the left navigation, select **Notebooks**. If you don't see it, open the app launcher (waffle menu) and select **Notebooks**.
3. Select **Notebooks** to expand the list, then **All notebooks**, then **New notebook**. For later notebooks, use the plus button next to **Notebooks**.
4. Name the notebook.
5. Under **Add content to References**, review the suggestions Copilot offers and add more.
6. Select **Create**.

To open the workspace version, use the notebook in OneNote at onenote.cloud.microsoft/copilotnotebooks.

## Add files, emails and meetings

In the reference picker you can:

- **Filter** the list by **All**, **Files**, **Meetings**, **Emails** or **Sites**.
- **Search** for a reference by name.
- **Upload** a file from your device.
- Pick a file from **OneDrive**.
- **Drag and drop** files into the drop area.

The Microsoft Support article on how Notebooks work lists these supported file formats: .docx, .pptx, .xlsx, .pdf, .page (Copilot Pages), .loop, and OneNote pages and notebooks. You can also reference specific web pages, and add a SharePoint folder or site as a shared location. References are described as updating as the project changes.

## What you can do once references are in

Microsoft's examples include:

- Summarize project documents with key themes and next steps.
- Summarize updates across references, for example three discussion points from meetings.
- Draft a one-page proposal with an executive summary, objectives and next steps.

You can also set custom instructions, such as tone or format, and generate audio overviews. The getting-started article links to pages on audio overviews, infographics, mind maps and custom instructions but does not explain them, so I won't describe those features in detail here.

## Example prompts to try first

Microsoft's examples show the pattern: name what you want, and say it should come from the notebook. Adapted from them:

- "Summarize the documents in this notebook and list the key themes and next steps."
- "Based on the references that changed recently, give me three points to raise in the next project meeting."
- "Draft a one-page proposal from this notebook with an executive summary, objectives and next steps."

If an answer looks thin, check the reference list first. A missing file or meeting is the most likely cause, because Copilot does not look outside the references.

## Limits to know

| Topic | Documented behavior |
|---|---|
| File cap | Up to 300 files per notebook are used to generate answers |
| Shared locations | Copilot picks up to 300 files most relevant to the prompt. Add a file directly to guarantee it is used |
| Visuals | No charts, graphs, data visualizations or images |
| Audio overview languages | English, Spanish, Japanese, French, German, Portuguese, Italian, Chinese |
| Deletion | Deleting a notebook or Copilot Page is permanent. A notebook recycle bin is described as in development |

## Choosing between a notebook and a normal chat

Use a notebook when the project has a defined set of material and you will come back to it. The reference list keeps Copilot focused on that material. Use a normal Copilot chat for one-off questions.

Two practical consequences follow from the documented limits:

- For a large SharePoint site, don't rely on the site reference alone for the files you must have cited. Add them one by one.
- Don't plan on producing a chart inside a notebook. Build the visual in Excel or another tool.

## Common mistakes

- Expecting the notebook to know about files you did not add.
- Adding a whole site and assuming every file is used. Only the most relevant up to 300 are.
- Deleting a notebook casually. It is permanent.
- Forgetting that sharing and permissions are covered in a separate Microsoft article. The pages I read do not describe sharing rules or permission levels, so check that article before you share a notebook with a team.

The pages I read also do not state limits on file size or retention periods, so confirm those with your admin if they matter for compliance.

## Related

- [Copilot Notebooks](https://www.m365.fm/entity/copilot-notebooks/)
- [Microsoft Copilot](https://www.m365.fm/entity/copilot/)
- [OneNote](https://www.m365.fm/entity/onenote/)
- [Copilot Pages](https://www.m365.fm/entity/copilot-pages/)

## Sources

- [Get started with Microsoft 365 Copilot Notebooks (Microsoft Support)](https://support.microsoft.com/en-us/microsoft-365-copilot/get-started-with-microsoft-365-copilot-notebooks)
- [How Microsoft 365 Copilot Notebooks works (Microsoft Support)](https://support.microsoft.com/en-us/microsoft-365-copilot/how-microsoft-365-copilot-notebooks-works)
