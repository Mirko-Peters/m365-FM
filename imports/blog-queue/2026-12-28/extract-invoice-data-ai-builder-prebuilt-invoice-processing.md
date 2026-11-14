---
title: "Extract Invoice Data With AI Builder Invoice Processing: Fields, Limits and Custom Options"
summary: "Use the AI Builder prebuilt invoice processing model using Microsoft Learn: supported files and size limits, extracted fields, confidence scores, key-value pairs, the 360 calls per minute limit and how to combine it with a custom document model in Power Automate."
status: review
publish: false
author: mirko-p
date: 2026-12-28
topics: [ai-builder, power-automate, power-platform]
keypoints:
  - "The prebuilt model reads JPEG, PNG or PDF files up to 20 MB. Images must be between 50 x 50 and 10,000 x 10,000 pixels, and only the first 2,000 PDF pages are processed."
  - "It extracts fields such as InvoiceId, InvoiceDate, VendorName, InvoiceTotal and AmountDue, plus lists for payment details, tax details and line items."
  - "The limit is 360 calls per environment per 60 seconds, shared across all document processing prebuilt models."
  - "Key-value pairs return every label found on the invoice. Use Create HTML table to view them or Filter array to pick one value."
  - "The page does not describe licensing or AI Builder credits and links separate pages for the Power Automate and Power Apps steps."
faq:
  - q: "Which file types and sizes are supported?"
    a: "According to Microsoft Learn, JPEG, PNG and PDF up to 20 MB. Images must be at least 50 x 50 and at most 10,000 x 10,000 pixels. PDFs can be up to 17 x 17 inches and only the first 2,000 pages are processed."
  - q: "What does the model return?"
    a: "Header fields such as InvoiceId, InvoiceDate, DueDate, VendorName, SubTotal, TotalTax, InvoiceTotal and AmountDue, plus PaymentDetails, TaxDetails, PaidInFourInstallements and Items lists."
  - q: "What is the call limit?"
    a: "360 calls per environment every 60 seconds. Learn says it applies across all document processing prebuilt models, including receipt processing."
  - q: "How do I get a value that is not in the field list?"
    a: "Use the key-value pairs. Add a Create HTML table action to see all pairs or a Filter array action to get one value, such as the value for a given key."
  - q: "What does the page say about licensing?"
    a: "Nothing. The page contains no information about licensing, AI Builder credits or billing, so check the AI Builder documentation or your licensing terms."
---

The AI Builder invoice processing model is a prebuilt model that extracts key invoice data. Microsoft Learn says it is optimized for common elements such as invoice ID, invoice date and amount due. This guide summarizes the model page and notes where it points elsewhere.

## Supported files

For best results, provide one clear photo or scan per invoice.

- Formats: JPEG, PNG or PDF.
- Maximum file size: 20 MB.
- Images: 50 x 50 pixels minimum, 10,000 x 10,000 pixels maximum.
- PDFs: at most 17 x 17 inches, and only the first 2,000 pages are processed.

Learn lists 37 supported language and region entries, among them English (several regions), French, German, Spanish, Italian, Dutch, Japanese, Korean and Chinese variants.

## What the model extracts

- **Header and party fields:** CustomerName, CustomerId, PurchaseOrder, InvoiceId, InvoiceDate, DueDate, VendorName, VendorAddress, CustomerAddress, BillingAddress, ShippingAddress, RemittanceAddress and ServiceAddress, with recipient fields.
- **Amounts and dates:** SubTotal, TotalDiscount, TotalTax, InvoiceTotal, AmountDue, PreviousUnpaidBalance, ServiceStartDate and ServiceEndDate.
- **Identifiers and terms:** VendorTaxId, CustomerTaxId, PaymentTerm and KVKNumber, the identifier for businesses registered in the Netherlands.
- **Lists:** PaymentDetails (IBAN, BankAccountNumber, BPay fields, SWIFT), TaxDetails (Amount, Rate), PaidInFourInstallements (Amount, DueDate) and Items (Amount, Date, Description, Quantity, ProductCode, Tax, TaxRate, Unit, UnitPrice).

The page's descriptions for PaidInFourInstallements and Items both read List of tax details, which looks like a copy error. Check actual output in your flow.

## Confidence scores

Most fields carry a confidence score. The page does not explain the score range, but its examples use a threshold of 0.65.

## Key-value pairs

Key-value pairs are all labels detected on the invoice with their values. They help when you need a value outside the predefined list.

- To view all pairs, add a Create HTML table action to the cloud flow and run it.
- To get one value, use a Filter array action on the pairs. The page's example retrieves the value for the key Tel .:.

## Use in Power Automate or Power Apps

This page does not give step-by-step instructions. It links separate articles for Power Automate and Power Apps, and a Learn training module on extracting invoice data with the prebuilt model.

## Limits

| Action | Limit | Renewal period |
| --- | --- | --- |
| Calls per environment | 360 | 60 seconds |

The limit applies across all document processing prebuilt models in the environment, including receipt and invoice processing.

## Go beyond the prebuilt model

If you need extra fields or the standard fields extract poorly, the page lists three options: use the custom Invoices model, read the raw OCR text from the model output, or build a custom document processing model. You can combine a custom model with the prebuilt one in a cloud flow. The page gives three examples:

- A custom model extracts a loyalty number that appears only on certain vendors' invoices, in a flow that runs when a file is added to a SharePoint folder and saves results to Excel.
- When the prebuilt confidence for the invoice total is below 0.65, the flow calls a custom model.
- A custom model trained on the top 20 vendors runs first, and if its confidence is below 0.65 the flow calls the prebuilt model.

## Preparing invoices

This list is a suggestion built from the page's file limits, not a Microsoft procedure.

1. Send one invoice per file, because the page recommends one clear photo or scan per invoice.
2. Keep PDFs within 17 x 17 inches and images within the pixel range, and stay below 20 MB.
3. Test with your own invoices and check the confidence score of the fields you rely on, for example the invoice total.
4. Decide your own threshold for sending low-confidence results to a person. The page uses 0.65 in its examples but does not recommend a value.
5. If you process many invoices at once, design the flow around the 360 calls per 60 seconds limit per environment.

## Not covered

The page contains no information about licensing, AI Builder credits or billing. It does not give the full flow steps.

## Related

- [AI Builder](https://www.m365.fm/entity/ai-builder/)
- [Power Automate](https://www.m365.fm/entity/power-automate/)
- [Power Platform](https://www.m365.fm/entity/power-platform/)

## Sources

- [Invoice processing prebuilt AI model](https://learn.microsoft.com/ai-builder/prebuilt-invoice-processing)
