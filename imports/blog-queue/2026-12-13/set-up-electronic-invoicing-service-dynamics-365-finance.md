---
title: "Set Up the Electronic Invoicing Service for Dynamics 365 Finance: Add-in, Azure Resources and Endpoint"
summary: "The ordered setup for the Electronic invoicing service with Dynamics 365 Finance or Supply Chain Management: LCS add-in, feature enablement, Azure Key Vault and storage, Globalization features and the service endpoint."
status: review
publish: false
author: mirko-p
date: 2026-12-13
topics: [electronic-invoicing, d365-finance-operations, dynamics-365-supply-chain-management, azure-key-vault]
keypoints:
  - "The Electronic invoicing service is hosted by Microsoft. You register each Finance or Supply Chain environment through an LCS add-in."
  - "Setup order matters. Microsoft says skipping a mandatory step causes failures in later steps and in normal use."
  - "You need your own Azure Key Vault and Azure storage account. The storage account holds the documents the service creates or receives."
  - "Enable Electronic invoicing integration in Feature management and set Endpoint URL and Environment in Electronic document parameters."
  - "The pages I read name only Finance and Supply Chain Management as supported apps, and I found no service named Global Invoicing Service."
faq:
  - q: "What is the Electronic invoicing service?"
    a: "Microsoft Learn describes it as a hyper-scalable multitenant service that processes electronic invoices and exchanges electronic documents. You configure the processing and integration rules, and the service runs that logic outside Finance and Supply Chain Management. Electronic invoicing does not support on-premises deployments."
  - q: "Which apps does the setup article cover?"
    a: "The setup pages require a Lifecycle Services project with Dynamics 365 Finance or Dynamics 365 Supply Chain Management. The overview names only those two apps. It does not mention Commerce or Business Central, so check separate documentation if you use those."
  - q: "Which Azure resources do I have to create?"
    a: "According to Microsoft Learn, an Azure Key Vault and an Azure storage account are mandatory. Use a separate key vault for Electronic invoicing. The storage account stores the electronic documents and files, and the service reads it through a SAS token held in a Key Vault secret. A SharePoint connection is optional."
  - q: "Do I have to repeat the add-in installation per environment?"
    a: "Yes. Learn says to complete the add-in installation for every environment you want to connect, including production, user acceptance testing and development environments."
---

Electronic invoicing in Dynamics 365 runs on a separate Microsoft-hosted service. Finance or Supply Chain Management hands documents to it, and it transforms, signs, submits and receives them according to the configuration you create. This article puts the setup steps in the order Microsoft recommends. Learn warns that skipping a mandatory step causes failures later, so follow the order.

## A note on naming

The task name mentions a Global Invoicing Service. The pages I read do not use that name. They describe the **Electronic invoicing** service, configured through **Globalization features** in the **Globalization Studio** workspace, with the Regulatory Configuration Service (RCS) as an earlier configuration route. Use the Learn names when you search the documentation.

## What the service is

Learn describes the service as hyper-scalable and multitenant. It is deployed in Azure geographies including the United States, Europe, United Kingdom, Asia, Japan, Switzerland, Brazil, United Arab Emirates, Australia, Canada, France, India, Norway and South Africa. The activation article lists a slightly shorter set of geographies for the app deployment, so confirm yours. It does not support on-premises deployments.

Feature highlights from the overview: Electronic reporting format configurations that produce XML, JSON, TXT and CSV, web service submission with certificate handling, response handling, electronic signatures such as XMLDSig, delivery by email and SharePoint, and batch processing of electronic invoice messages.

## Prerequisites

- A Lifecycle Services (LCS) account with access to the project.
- A deployed, running Finance or Supply Chain Management environment in the LCS project.
- The Microsoft Entra ID tenant ID of your Azure subscription.
- Azure resources for Electronic invoicing, created in step 4.

## Step 1: Install the add-in in LCS

1. Sign in to LCS and open the project.
2. On the **Environments** dashboard, select a deployed environment that is running.
3. On the **Power Platform Integration** tab, under **Environment add-ins**, select **Install a new add-in**.
4. Select **Electronic Invoicing**.
5. In **AAD application ID** enter the fixed value 091c98b0-a1c9-4b02-b62c-7753395ccabe. Enter only the GUID, with no spaces, commas, periods or quotation marks.
6. In **AAD tenant ID** enter your Entra tenant ID.
7. Accept the terms and select **Install**. The status changes from Installing to Installed after a few minutes. You may need to refresh.

Installing the add-in registers the environment in the list of applications allowed to connect to the service. Repeat it for production, UAT and development environments.

## Step 2: Enable the integration feature

In **Feature management**, search the **All** tab for **Electronic invoicing integration**. If it does not appear, select **Check for updates**. Select the feature and **Enable now**. The **E-Invoicing designer workspace** is enabled by default, but after the add-in installation it can take 45 minutes to become available.

## Step 3: Service environment name, only for existing RCS setups

If you used RCS before, go to **Organization administration** > **Setup** > **Electronic document parameters**. On the **Electronic invoicing** tab, under **Service parameters**, enter the previously deployed service environment in **Environment**. Skip this if you configure through Globalization Studio for the first time. Once the initial configuration is saved, the field becomes unavailable, so settle the name first.

## Step 4: Create the Azure resources

The Azure resources article lists:

1. **Azure Key Vault (mandatory).** Use a separate key vault for Electronic invoicing and do not store secrets for other applications in it. Create the secrets and certificates your scenarios need, and at least one secret for the SAS token of the storage account.
2. **Azure storage account (mandatory).** It stores all electronic documents and files the service generates or receives. You own this data. The service reads it with the SAS token from the Key Vault secret.
3. **SharePoint connection (optional).** Only if files must be saved to and retrieved from SharePoint folders.

You can do this in the Azure portal, with an Azure PowerShell script or with an ARM template. The page I read covers the portal. It does not state which roles are required to create the resources or give naming rules, so agree these with your Azure administrators.

## Step 5: Configure Globalization features

A Globalization feature is a set of components that defines how electronic documents are transformed and processed, including sending to and receiving from external channels. You can use Microsoft's features or create your own. The setup overview refers to the Globalization feature components article for deployment, which I did not read in detail. For inbound documents by email or SharePoint, see the article on processing incoming electronic documents.

## Step 6: Set the endpoint and environment in Finance

1. In Finance or Supply Chain Management, go to **Organization administration** > **Setup** > **Electronic document parameters**.
2. On the **Electronic invoicing** tab, enter **Endpoint URL**. Learn says to use the service endpoint for your Azure geography, taken from the **Service endpoint URI** parameter in RCS.
3. Enter **Environment**, the name of the service environment you published to Electronic invoicing.
4. Select **Save**.

The endpoint must be configured before you can issue electronic invoices.

## Verification checklist

1. Add-in status shows Installed for every environment.
2. Electronic invoicing integration is enabled.
3. The E-Invoicing designer workspace is available, after the 45-minute delay.
4. The key vault and storage account exist and the SAS secret is stored.
5. Endpoint URL and Environment are saved.
6. A test document runs through a non-production environment first.

## Common mistakes

- Typing the AAD application ID with extra characters.
- Using a shared key vault for other applications.
- Forgetting to repeat the add-in step in UAT or sandbox environments.
- Changing the environment name after saving the initial configuration, which is locked.
- Starting Globalization feature work before the add-in and integration feature are in place.

## What the pages I read do not cover

I did not find sandbox versus production service types, regional endpoint values or the role requirements for the Azure resources in the pages I read. For country-specific formats, such as the French or Italian examples Learn lists, follow the country article.

## Related

- [Electronic invoicing](https://www.m365.fm/entity/electronic-invoicing/)
- [Dynamics 365 Finance and Operations](https://www.m365.fm/entity/d365-finance-operations/)
- [Dynamics 365 Supply Chain Management](https://www.m365.fm/entity/dynamics-365-supply-chain-management/)
- [Azure Key Vault](https://www.m365.fm/entity/azure-key-vault/)

## Sources

- [Microsoft Learn: Electronic invoicing overview](https://learn.microsoft.com/en-us/dynamics365/finance/localizations/global/e-invoicing-service-overview)
- [Microsoft Learn: Activate and set up integration with Electronic invoicing](https://learn.microsoft.com/en-us/dynamics365/finance/localizations/global/e-invoicing-activate-setup-integration)
- [Microsoft Learn: Install the add-in for Electronic invoicing microservices](https://learn.microsoft.com/en-us/dynamics365/finance/localizations/global/e-invoicing-install-add-in-microservices-lcs)
- [Microsoft Learn: Set up Azure resources for Electronic invoicing](https://learn.microsoft.com/en-us/dynamics365/finance/localizations/global/e-invoicing-set-up-azure-resources)
- [Microsoft Learn: Set up electronic invoicing in Globalization Studio](https://learn.microsoft.com/dynamics365/finance/localizations/global/gs-e-invoicing-set-up-overview)
