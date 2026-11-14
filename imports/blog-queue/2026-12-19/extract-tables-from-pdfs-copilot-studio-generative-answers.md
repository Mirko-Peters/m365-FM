---
title: "Extract Complex Tables From PDFs for Copilot Studio Generative Answers: What Is Documented"
summary: "What Microsoft Learn says about PDFs and tables in Copilot Studio knowledge, where the documentation is silent, and how Document Intelligence layout output or code interpreter can fill the gap."
status: review
publish: false
author: mirko-p
date: 2026-12-19
topics: [copilot-studio, azure-ai-document-intelligence, knowledge-source]
keypoints:
  - "The Copilot Studio Learn pages read for this article do not describe how tables inside PDFs are extracted or chunked. Test your own documents instead of assuming table fidelity."
  - "Uploaded PDFs go through Dataverse, which splits files into chunks and builds semantic indexes. Files can be up to 512 MB, with page-level citations for PDF on the Upload SharePoint path."
  - "Learn advises code interpreter instead of semantic search for Excel content, because semantic search has limitations for cell indexing. It supports xlsx and csv, up to 10 files of 16 MB."
  - "Azure Document Intelligence layout returns rows, columns, spans and header flags, and can output Markdown where tables are HTML tables. It handles PDFs up to 2,000 pages."
  - "Custom instructions in a generative answers node are limited to 8,000 characters, and Learn gives no confirmation that table formatting works. Test it."
faq:
  - q: "Does Copilot Studio extract tables from PDFs in knowledge sources?"
    a: "The Learn pages on knowledge sources and unstructured data do not describe table extraction. They say the SharePoint file upload option supports text within images for certain document types such as PDF files, but not how tables are read. Test with your own PDFs."
  - q: "What are the PDF file limits for uploaded knowledge?"
    a: "Learn's quotas page lists 512 MB per file for OneDrive and Upload SharePoint sources, with supported types doc, docx, xls, xlsx, ppt, pptx and pdf. It does not state a page limit and does not describe how tables or images in documents are processed."
  - q: "Which files cannot be answered from?"
    a: "Learn says documents labeled confidential or highly confidential, and password-protected documents, cannot be indexed. They can show as ready but do not return responses."
  - q: "What can I use when tables must be read exactly?"
    a: "Learn documents the Document Intelligence layout model, which returns row and column counts, spans and column header flags for tables, and can output Markdown. For spreadsheets, Learn points to code interpreter, which runs Python on xlsx and csv files."
  - q: "How big can a PDF be for Document Intelligence layout?"
    a: "Learn states up to 2,000 pages for PDFs and TIFFs, and 500 MB on the paid S0 tier or 4 MB on the free F0 tier. With the free tier only the first two pages are processed."
---

Copilot Studio can answer from PDFs, but Microsoft Learn does not document how it reads tables inside them. The knowledge pages describe chunking, semantic indexing and limits, and say nothing about merged cells, multi-page tables or table fidelity. When a table must be read exactly, the documented options are to pre-process the PDF with Document Intelligence or to move the data into a spreadsheet and use code interpreter.

## What Learn documents for PDFs

For uploaded files and SharePoint or OneDrive sources, Learn describes this pipeline:

- Dataverse stores the raw files, splits them into chunks and creates semantic indexes and vector embeddings.
- At query time, the chunks that best match the user's intent are returned.
- The SharePoint file upload option supports "text within images for certain document types like PDF files". The page does not say whether this is OCR or which PDFs qualify.
- Initial indexing can take 5 to 30 minutes.

Documented limits:

| Item | Value |
|---|---|
| File size, OneDrive and Upload SharePoint | 512 MB per file |
| Supported types | doc, docx, xls, xlsx, ppt, pptx, pdf |
| Files per source | Up to 1,000 files, 50 folders and 10 levels of subfolders |
| Knowledge objects per agent | 500 |
| Source types per agent | Five at a time |
| Sync | Every 4 to 6 hours for uploads, real time for the SharePoint connector option |

Page-level citations are available for PDF files on the **Upload files > SharePoint** path. Other types fall back to document-level citations.

## What Learn does not document

The pages read for this article state no page limit, and none describes how tables or images inside unstructured documents are processed. That matters for complex tables with merged headers, rotated layouts or tables that continue across pages. Treat table accuracy as untested until you have checked it with real questions.

A few documented causes of missing answers are worth ruling out first:

- The Knowledge page does not show the file as **Ready**.
- The sensitivity label is Confidential or Highly Confidential, or the file is password-protected.
- The file type is not supported.
- The user has no permission in the source system. Live permission checks run on every query.

## Option 1: Pre-process with Document Intelligence layout

The layout model in Azure Document Intelligence (shown on Learn as Document Intelligence in Foundry Tools) extracts tables as structured data. According to Learn, it returns:

- the number of rows and columns, row spans and column spans;
- each cell with a bounding polygon and a flag showing whether it is a `columnHeader`;
- support for rotated tables.

With `outputContentFormat=markdown`, the result contains Markdown in the `content` section. In API version 2024-11-30 tables in that output are HTML tables, which Learn says enables merged cells and multirow headers.

Limits from the page:

- PDFs and TIFFs up to 2,000 pages. The free tier processes only the first two pages.
- 500 MB on the paid S0 tier, 4 MB on the free F0 tier.
- Password-protected PDFs need the lock removed first.
- Table analysis is not supported for XLSX input.

For tables that span pages, Learn advises splitting the PDF into pages before analysis and merging the tables afterwards in post-processing.

How you feed the result back to the agent is your design decision. One way is to write the extracted tables into a Word document, a SharePoint list or a Dataverse table, and add that as the knowledge source. The pages read for this article do not describe a ready-made Copilot Studio connection to the layout model, so that part needs your own flow or code and your own testing.

## Option 2: Move tabular data to Excel or CSV and use code interpreter

Learn is direct about spreadsheets: to search over Excel content, use code interpreter instead of semantic search, because semantic search has limitations for cell indexing.

Code interpreter, a preview feature, lets the agent generate and run Python for tasks such as statistical analysis, table joins and chart generation on CSV and Excel files. Documented details:

- Supported files: `.xlsx` and `.csv`.
- Limits: 16 MB per file and a maximum of 10 files.
- Enable it under **Settings** > **Generative AI** > **File processing capabilities**. For user uploads, turn on **File uploads** and **Code interpreter**. For a SharePoint knowledge source, turn on **Code interpreter** and, under **Search**, select **Turn on Work IQ**.
- It counts as a premium text and generative AI feature for billing. Sovereign clouds are not supported.
- Learn lists tested scenarios such as single-sheet lookups in Excel, and lookups and aggregates across one or several CSV files. Other scenarios might work but are not guaranteed.

Because preview features are not meant for production use, check the status before building on it.

## Shape the answer with instructions

A generative answers node accepts custom instructions through the data source configuration pane. Learn lists the use cases as context, personality, what to answer and not answer, and response format. The limit is 8,000 characters. Its advice: be specific, use examples, keep it simple and give the agent an out such as answering "not found" when the answer is not present.

Learn's format example is a bolded step list. It does not confirm table output, so an instruction such as "present the answer as a Markdown table" is something to test, not something to rely on. For full control, Learn describes clearing **Send a message** on the node and rendering the stored answer yourself with an Adaptive Card and a Power Fx formula.

## A practical test routine

1. Pick five PDFs with the hardest tables.
2. Write ten questions whose answers are single cells, totals or comparisons.
3. Ask them against the uploaded PDFs and note which fail.
4. For failures, run the same files through the layout model and compare the extracted cells.
5. Decide per document type: keep the PDF, convert to structured data, or exclude it.

## Related

- [Copilot Studio](https://www.m365.fm/entity/copilot-studio/)
- [Azure AI Document Intelligence](https://www.m365.fm/entity/azure-ai-document-intelligence/)
- [Knowledge source](https://www.m365.fm/entity/knowledge-source/)
- [Chunking](https://www.m365.fm/entity/chunking/)

## Sources

- [Knowledge sources summary (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-copilot-studio)
- [Unstructured data as a knowledge source (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-unstructured-data)
- [Quotas and limits for Copilot Studio (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-quotas)
- [Code interpreter for structured data (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-code-interpreter-structured-data)
- [Generative answers node (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/nlu-boost-node)
- [Prompt modification (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/nlu-generative-answers-prompt-modification)
- [Document Intelligence layout model (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/prebuilt/layout?view=doc-intel-4.0.0)
