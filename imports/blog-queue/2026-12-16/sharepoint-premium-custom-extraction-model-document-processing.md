---
title: "SharePoint Premium Custom Extraction Models: Automate Document Processing in a Library"
summary: "Choose between unstructured, freeform and structured models, train one, publish it and apply it to a SharePoint library. Includes what Microsoft Learn documents and what it leaves open."
status: review
publish: false
author: mirko-p
date: 2026-12-16
topics: [sharepoint-premium, azure-ai-document-intelligence]
keypoints:
  - "Pick the model by document type: unstructured for varied text patterns, freeform for PDFs and images without classification, structured for consistent forms."
  - "Structured and freeform models are built with AI Builder. Add at least five example files per collection, tag fields and tables, then train and publish."
  - "Applying a model adds its content type to the library and shows the extracted fields as columns. Files uploaded later are processed automatically."
  - "Existing files need Classify and extract. Folders or large migrations can take up to 24 hours."
  - "The Classification Date column triggers a Power Automate flow after processing."
faq:
  - q: "Which model type should I choose for invoices?"
    a: "Microsoft Learn recommends a structured model for forms or invoices with consistent layouts, because it extracts values from fixed positions. A prebuilt invoice processing model is also listed, and Learn says prebuilt models remove the need for manual training or configuration. My own advice: check whether it covers your fields first."
  - q: "How many example files does a structured or freeform model need?"
    a: "Learn says to add at least five example files for each collection of document layouts. The training page gives no maximum or file size limit. The comparison page says freeform and structured models train on .pdf, .jpg or .png files with a total of 50 MB and 500 pages, and the training page points to a separate AI Builder requirements page."
  - q: "Are existing files processed when I apply a model?"
    a: "No. According to Learn, an applied model processes files and folders uploaded after it is applied. For existing content, select the items and choose Classify and extract. Folders or large migrations can take up to 24 hours."
  - q: "How do I run a flow after a file is processed?"
    a: "Learn says the Classification Date field is filled when a model has processed a file. The SharePoint trigger When a file is classified by a content understanding model uses it to start a Power Automate flow with the extracted information."
---

A custom extraction model in SharePoint Premium is trained on example documents, published, and then applied to a document library. After that, the model identifies files with its content type and fills the extracted values into library columns. The choice that matters most is the model type: unstructured, freeform or structured. The rest is a repeatable sequence of steps.

Microsoft's documentation still uses the name Syntex in places, for example in the name of the flow template and in older URL paths. The steps below follow the pages as I read them.

## Step 1: Choose the model type

Microsoft Learn describes three custom model types.

| Model | Best for | Does it classify? |
|---|---|---|
| Unstructured | Letters or contracts without a consistent layout but with recognizable text patterns | Yes, and it extracts data. Setup option: single class model |
| Freeform | Data that can appear anywhere, such as scanned letters, faxes or PDFs | No, extraction only. Setup option: freeform extraction model |
| Structured | Forms or invoices with consistent layouts, values at fixed positions | No, extraction only. Setup option: structured extraction model |

Learn adds that unstructured models support the broadest range of file types and more than 40 languages, that freeform models work on PDF and image formats, and that structured models support the widest range of languages. The comparison page puts numbers on the languages: more than 40 for unstructured and freeform, more than 100 for structured. It lists the classification type as not applicable for freeform and structured models, and it says unstructured models train on 5 to 10 files, including negative examples. Freeform and structured models are built with Microsoft Power Apps AI Builder. Learn says availability of freeform models varies by region.

If your document is a common type, check the prebuilt models first. Learn lists contract, invoice and receipt processing, sensitive information processing and simple document processing. Prebuilt models need no training. Simple document processing extracts key-value pairs, selection marks, named entities and barcodes, and Learn calls it an alternative when custom labeling is not feasible.

## Step 2: Decide where the model lives

Every model is linked to a SharePoint content type, which defines the columns for the extracted data.

- **Enterprise models** are created in a content center and can be reused across several SharePoint sites.
- **Local models** are created directly in a document library and apply only to that library.

My own rule of thumb from the scope difference: use an enterprise model when several sites receive the same document type, and a local model for a single library.

## Step 3: Add example documents

For a structured or freeform model, the creation flow opens a **Choose information to extract** page. Define the fields and tables you want, for example Name, Address or Amount. Then:

1. Create collections for your document layouts. The page says you can create as many collections of document layouts as you want the model to process.
2. Add at least five example files per collection.
3. Let AI Builder analyze the files. Learn says this usually takes a few seconds.

Learn points to a separate AI Builder page for the input document requirements, which I did not read. The training page lists no file size or format limits. The comparison page says freeform and structured models train on .pdf, .jpg or .png files, total 50 MB and 500 pages, so check both before you collect samples.

## Step 4: Tag, train and publish

Tag the fields and tables in the example files so the model learns what to extract. When training is finished, select **Publish**. On the model home page you then get the option to apply the model to a library.

The pages I read do not describe how to test accuracy before publishing, and they do not give accuracy figures. Plan your own check with documents the model has not seen.

## Step 5: Apply the model to a library

You need **Manage Lists** permission or **Edit** rights on the library. The model type must be enabled for the site. Learn warns that if the service is turned off later, the model no longer runs. A note on the page says that to see custom commands like **Classify and extract** when you add a document library web part to a SharePoint site page, you must have a pay-as-you-go subscription.

1. On the model home page, select **Apply model** on the **Apply model to libraries** tile, or select **Add library** under **Where the model is applied**.
2. Pick the site, then the document library.
3. Optionally open **Advanced settings** to keep the current view or use a new view with model information and file thumbnails.
4. Select **Add**.

Applying the model adds the content type to the library and updates the default view with the extracted labels as columns. To confirm, open the library, go to **Automate** > **View models** and check the **Applied** tab.

## Step 6: Process new and existing files

An applied model processes files and folder content that are uploaded after it is applied. For content that is already there:

1. Select the files and folders in the library.
2. Select **Classify and extract** in the ribbon.

The selected items go into a queue. Learn says that classification of folders or of a large migrated set can take up to 24 hours.

## Step 7: React to processed files

When a custom model is applied, a **Classification Date** field is added to the library. It stays empty until the model has processed a file, and then holds a date and time stamp. The SharePoint connector trigger **When a file is classified by a content understanding model** uses this field to start a Power Automate flow. The flow can use any extracted information. Learn gives a template, **Send an email after Syntex processes a file**, Select a file, then select **Integrate** > **Power Automate** > **Create a flow**, and pick the template on the **Create a flow** panel.

## Keeping the model current

If you add or remove an extractor, push the change to the libraries. On the model home page, select **Sync all** under **Where the model is applied**, or select specific libraries and then **Sync**.

## Several models in one library

- With two or more unstructured models, a file is classified with the model that has the highest average confidence score.
- With an unstructured model plus a freeform or structured model, the file is classified by the unstructured model. Empty columns that match the other model are filled with its extracted values.

## Typical mistakes (my own reading)

- Choosing a structured model for documents whose layout changes. Use unstructured or freeform instead.
- Forgetting existing files. An applied model processes files uploaded after it is applied, so run Classify and extract for old content.
- Treating the model as live everywhere after a change. Sync the libraries.

## What the read pages do not say

The three main pages do not give prices or licensing amounts. The comparison page says that with per-user licensing, freeform and structured models use AI Builder credits (3,500 credits per license per month, and one million credits allow processing of 10,000 file pages), and that pay-as-you-go does not apply to them. A note on that page says Microsoft announced a progressive end of AI Builder credits in October 2025. I did not read the licensing pages, so check the current licensing and pay-as-you-go information before a large rollout.

## Related

- [SharePoint Premium](https://www.m365.fm/entity/sharepoint-premium/)
- [Azure AI Document Intelligence](https://www.m365.fm/entity/azure-ai-document-intelligence/)
- [Intelligent document processing](https://www.m365.fm/entity/intelligent-document-processing/)
- [SharePoint document libraries](https://www.m365.fm/entity/sharepoint-document-libraries/)

## Sources

- [Overview of document processing model types (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-365/documentprocessing/model-types-overview?view=o365-worldwide)
- [Compare custom models for document processing (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-365/documentprocessing/difference-between-document-understanding-and-form-processing-model?view=o365-worldwide)
- [Train a structured or freeform document processing model (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-365/documentprocessing/create-a-form-processing-model?view=o365-worldwide)
- [Apply a document processing model to a document library (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-365/documentprocessing/apply-a-model?view=o365-worldwide)
