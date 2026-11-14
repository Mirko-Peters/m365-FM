---
title: "SharePoint eSignature Setup: Signature Requests, Teams Approvals Tracking and Power Automate Limits"
summary: "How to set up Microsoft 365 eSignature for SharePoint PDFs: pay-as-you-go billing, admin center steps, providers, external signers, tracking in the Teams Approvals app, and what Microsoft Learn does not document for Power Automate."
status: review
publish: false
author: mirko-p
date: 2026-12-18
topics: [sharepoint-premium, power-automate, microsoft-365-admin-center, sharepoint-document-libraries]
keypoints:
  - "eSignature needs an Azure subscription linked for pay-as-you-go billing, and an admin turns it on under Settings > Org settings > Pay-as-you-go services."
  - "A request supports up to 10 recipients and 50 fields, and only unencrypted PDF documents are supported for the built-in service."
  - "Requests can be tracked in the Approvals app in Teams, and the Purview audit log records eSignature activities."
  - "External signers need Entra B2B integration and guest sharing, and sensitivity labels or conditional access can block them."
  - "The Learn pages read describe no Power Automate trigger or action for eSignature, so automation around it is not documented there."
faq:
  - q: "What do I need before I can use SharePoint eSignature?"
    a: "According to Microsoft Learn, you must link an Azure subscription to pay-as-you-go billing, and a SharePoint Administrator or Global Administrator must set up eSignature in the Microsoft 365 admin center. Under Org settings, open Pay-as-you-go services, select the Settings tab, choose eSignature and select Let people in your organization use eSignature. The service is fully operational within 24 hours."
  - q: "How many people can sign one request?"
    a: "Microsoft Learn states that a request can have up to 10 internal or external recipients, at least one required signature field per recipient and up to 50 fields in the document. Only unencrypted PDF documents are supported at this time for requests started from a SharePoint document library."
  - q: "Where can I track the status of requests?"
    a: "Microsoft Learn says you can track requests in the Approvals app in Teams, on the SharePoint tab, and open the file location from there. Admins can also search the Purview audit log for activities named eSignature*, such as request created, sent, completed or declined."
  - q: "Why can an external signer not open the document?"
    a: "Microsoft Learn lists Entra B2B integration and guest sharing as requirements for new external signers. Sensitivity labels can block external sends, and conditional access policies may block signers, in which case adding the eSignature app to the approved apps list is a common fix."
  - q: "Can Power Automate start or react to an eSignature request?"
    a: "The Microsoft Learn pages read for this article do not mention Power Automate for the built-in eSignature service, and the Approvals page does not describe workflow-created requests. Check the current connector list in Power Automate and Learn before designing a flow around it."
---

SharePoint eSignature lets users send PDFs from a document library for signature and keeps the signed result in Microsoft 365. Setting it up means linking billing, enabling the service in the Microsoft 365 admin center, choosing providers and sites, and preparing for external signers. This article follows Microsoft Learn and is explicit about one gap: the pages read do not document Power Automate integration.

## Step 1: Meet the prerequisites

- **Billing:** Link an Azure subscription to pay-as-you-go billing. Billing is based on the type and number of transactions. Learn mentions a trial of up to five free requests through June 2026, which may have passed, so check the current terms.
- **Roles:** SharePoint Administrator or Global Administrator. Learn recommends the role with the fewest permissions.
- **Region:** Available worldwide through the public cloud, except Indonesia. In multi-geo tenants it is available in the home geo only.
- **Legal:** The service uses simple electronic signatures as defined under law such as the eIDAS Regulation. Learn tells you to decide whether that fits your needs and read the terms of service.

## Step 2: Turn it on

1. In the Microsoft 365 admin center, select **Settings** > **Org settings**.
2. Select **Pay-as-you-go services**, then the **Settings** tab.
3. Under **Document & image services**, select **eSignature**.
4. Select **Let people in your organization use eSignature**.

Learn says the service is fully operational within 24 hours. Under **Where can eSignature be used?**, choose **All sites** or **Selected sites**, up to 100 sites, chosen directly or from a CSV. The panel also lets you choose which signature providers can be used. Adobe Acrobat Sign and Docusign are the providers named in the overview. Learn says you are not charged for using other providers, but pay-as-you-go billing must still be set up.

To show eSignature fields in Word desktop, select **Word (Desktop)** under **Which apps can use eSignature?**, and also deploy the **Allow the use of eSignature for Microsoft Word** policy, or set the documented registry value. Word support is for the Beta, Current and Monthly Enterprise Channels.

## Step 3: Send a request

From a SharePoint document library, open the PDF and select the pen icon (**Get signatures**). Then:

1. Add recipients, optionally turn on **Recipients must sign in order**, and select **Next**.
2. Place **Signature**, **Initials** and **Date** fields for each recipient.
3. Enter a title and optional message, then select **Send**.

Learn lists the limits: up to 10 recipients, at least one required signature field per recipient and up to 50 fields in the document. Only unencrypted PDFs are supported at this time. The creator needs edit and sharing permissions, because the service creates a sharing link for signers. The first request in a tenant can take seconds to minutes, so Learn suggests sending a first request in a SharePoint site as a final setup step.

With another provider, select the eSignature icon in the viewer, choose the provider, sign in and finish on the provider's site. Those requests can be cancelled and tracked in the Approvals app or on the provider's website.

## Step 4: Plan for external signers

For people who are not existing guests, Learn requires Microsoft Entra B2B integration for SharePoint and OneDrive and guest sharing. External signers are treated as guests. Points to check:

- If a guest is deleted during a request, they lose access to the document and signed copy, and you must resend.
- A sensitivity label on the site may block external sends. Enable **Let people who use this label share the site with people outside your organization**, or move the file.
- Conditional access can block signers. A common fix is adding **eSignature** to the approved apps list in the Entra admin center.
- Microsoft 365 settings do not control external recipients when you use third-party providers.

Recipients do not need a SharePoint license or a Microsoft account to sign.

## Step 5: Track approvals and audit

In Teams, open **Approvals** and select the **SharePoint** tab. You can filter requests, select one to see details, select **Review** to start signing, and select **Open file location**. Recipients see only requests that originate from their own tenant. Requests from external senders are tracked through email. For other providers' requests, you can see status and cancel, but you cannot open the signed document location from Approvals.

For auditing, search the Purview audit log for `eSignature*` in the operation names. Logged activities include request created, sent, canceled, declined and completed, link expired, and document viewed, signed or downloaded.

Request statuses are In progress, Completed, Canceled and Declined. After completion, signers can download the signed copy from the email for 30 days. The signed file is saved to the originating folder and carries an audit trail, and Microsoft digitally signs it with a certificate. Declined or canceled requests do not save a copy.

## Where Power Automate fits

The pages read do not describe a Power Automate trigger or action for the built-in eSignature service, and the Approvals page does not mention workflow-created requests. Learn documents tracking in the Teams Approvals app and the Purview audit log. If you plan an automated approval step before a signature request, check the current Power Automate connector reference and treat any flow design as unverified until you do.

## Typical mistakes

- Skipping pay-as-you-go billing and finding the feature unavailable.
- Sending an encrypted PDF.
- Forgetting B2B integration and guest sharing for new external signers.
- Deleting a guest while a request is still open.
- Expecting the Word action to appear with only the admin center toggle.

## What the sources do not say

The pages read give no request expiration, no reminder behavior, no Power Automate integration, and no steps for provider-specific setup. For Microsoft's own service, the storage location rule is documented in the review and sign page, and the setup page lists a five year retention for working copies.

## Related

- [SharePoint Premium](https://www.m365.fm/entity/sharepoint-premium/)
- [Power Automate](https://www.m365.fm/entity/power-automate/)
- [Microsoft 365 admin center](https://www.m365.fm/entity/microsoft-365-admin-center/)
- [SharePoint document libraries](https://www.m365.fm/entity/sharepoint-document-libraries/)

## Sources

- [Overview of SharePoint eSignature](https://learn.microsoft.com/en-us/microsoft-365/syntex/esignature-overview)
- [Set up SharePoint eSignature](https://learn.microsoft.com/en-us/microsoft-365/syntex/esignature-setup)
- [Create a signature request](https://learn.microsoft.com/microsoft-365/syntex/esignature-send-requests)
- [Review and sign a signature request](https://learn.microsoft.com/en-za/microsoft-365/syntex/esignature-review-sign-requests)
- [Track and manage eSignature requests using Approvals in Teams](https://learn.microsoft.com/microsoft-365/syntex/esignature-approvals)
