---
title: "How to Set Up Inventory Visibility in Dynamics 365 Supply Chain Management"
summary: "Set up the Inventory Visibility add-in for Dynamics 365 Supply Chain Management: prerequisites, separate Entra app per environment, install from LCS or Power Platform admin center, SCM parameters, the periodic job and caveats."
status: review
publish: false
author: mirko-p
date: 2027-01-05
topics: [dynamics-365-inventory-management, dynamics-365-supply-chain-management]
keypoints:
  - "Inventory Visibility is an independent microservice for real-time on-hand changes and queries. A Supply Chain Management license always includes it."
  - "Register a Microsoft Entra application with a client secret for each environment. Reusing the same app and tenant ID for several environments makes only the latest installation valid."
  - "Install from Lifecycle Services under Environment add-ins, or from the Power Platform admin center. If an LCS install takes over an hour, Learn suggests permissions are missing."
  - "In Supply Chain Management set the Inventory Visibility endpoint and enable the periodic job Inventory Visibility Integration."
  - "The feature Inventory Visibility integration is mandatory as of Supply Chain Management version 10.0.45."
faq:
  - q: "What is Inventory Visibility?"
    a: "Microsoft Learn describes an independent and highly scalable microservice for real-time on-hand inventory change postings and visibility tracking across data sources and channels. It supports queries, soft reservations, ATP quantities and allocation."
  - q: "Do I need a separate license?"
    a: "For the add-in version, Learn says a valid Supply Chain Management license always includes Inventory Visibility. The Intelligent Order Management version is included in the IOM bundle."
  - q: "Can I reuse one Entra app for several environments?"
    a: "Learn says to use a separate application for each environment. With the same application ID and tenant ID for several environments, a token issue occurs for older environments and only the latest installation is valid."
  - q: "What does the periodic job do?"
    a: "Under Inventory Management > Periodic tasks > Inventory Visibility Integration, enabling the job posts all inventory change events to Inventory Visibility."
  - q: "What happens if I uninstall the add-in?"
    a: "Learn says it terminates the add-in, unregisters it from LCS and deletes temporary cache data. Primary inventory data synced to Dataverse is not deleted. Uninstalling from the Power Platform admin center is not officially supported."
---

Setting up Inventory Visibility takes four moves: register a Microsoft Entra application, install the add-in, configure Supply Chain Management, and enable the integration job. This guide follows the Microsoft Learn overview and setup pages. Learn splits optional features and the endpoint lookup into other articles, which were not read.

## What it is

Learn describes the add-in as an independent, highly scalable microservice for real-time on-hand inventory change postings and visibility tracking across data sources and channels. It supports real-time on-hand and shortage queries through API calls, soft reservations, ATP quantities with next-available dates, and allocation. It is built on Microsoft Dataverse, so its data can be used in Power Apps and Power BI.

## Licensing and versions

- **Add-in for Supply Chain Management:** for companies with a valid Supply Chain Management license, which always includes Inventory Visibility.
- **Service component for Intelligent Order Management:** for companies using IOM or not using Supply Chain Management as ERP. The license is included in the IOM bundle.

## Prerequisites

- A Supply Chain Management environment linked to a Dataverse environment.
- The add-in prerequisites from the Learn add-ins overview. Dual-write linking is not required.
- A registered Microsoft Entra application with a client secret. Note the **Application (client) ID**, **Client secret** and **Tenant ID**.
- **A separate Entra application for each environment.** With the same application ID and tenant ID across environments, older environments get a token issue and only the latest installation is valid.

## Install from Lifecycle Services

1. Sign in to LCS, open the project and the environment.
2. Under **Power Platform integration** > **Environment add-ins**, confirm the Dataverse environment name.
3. Check the environment details for a **linking mismatch** warning about dual-write linking to a different destination than Power Platform integration. Fix it first.
4. Select **Install a new add-in** and then **Inventory Visibility**.
5. Enter the Microsoft Entra application (client) ID and tenant ID.
6. Accept the terms and select **Install**.
7. Refresh until the status shows **Installed**.
8. In Dataverse, go to **Apps** and check that the **Inventory Visibility** Power App is installed.

If the install takes more than an hour, Learn says the user likely lacks permission to install solutions in Dataverse. Cancel the LCS install and install from the Power Platform admin center.

## Install from the Power Platform admin center

1. In the Microsoft 365 admin center, confirm the user has the **Dynamics 365 Unified Operations Plan** license.
2. In the Power Platform admin center, select the environment.
3. Go to **Resources** > **Dynamics 365 apps** > **Install App**.
4. Install **Dynamics 365 Finance and Operations Platform Tools** first and wait for **Installed**.
5. Select **Install App** again, choose **Dynamics 365 Inventory Visibility** and select **Next**.
6. Enter the application ID and tenant ID of the service, agree to the terms and select **Install**.

Learn lists the supported Azure regions in a table, such as West Europe and North Europe. If your region is not listed, the page does not say what to do.

## Configure Supply Chain Management

1. In **Feature management**, turn on **Inventory Visibility integration**. As of version **10.0.45** this feature is mandatory and cannot be turned off.
2. Go to **Inventory Management** > **Set up** > **Inventory Visibility Integration parameters** > **General** tab and set:
   - **Inventory Visibility endpoint:** the URL of the Inventory Visibility environment. Learn links to an article on finding it.
   - **Maximum number of records in a single request:** a positive integer up to 1,000. The default is 512. Learn says to keep it unless Microsoft Support advises a change or you are otherwise certain that you need to change it.
3. Optionally set up soft reservations and offsets, WMS item support, inventory summary, preloaded on-hand queries and time-series tracking for ATP. Each has its own article.
4. Go to **Inventory Management** > **Periodic tasks** > **Inventory Visibility Integration** and enable the job.

If the job reports it cannot sync more than 500000 records in the same warehouse, Learn gives a partition schema procedure on the same page that uses API calls and Power Apps. My advice: follow its steps as written.

## Update and uninstall

To update: in the Power Platform admin center check the status of **Dynamics 365 Inventory Visibility**. If **Update available** shows, open **More application actions** > **Update**, accept the terms and confirm with the environment name.

To uninstall: disable the periodic job in Supply Chain Management, then select **Uninstall** in LCS. Uninstalling from the Power Platform admin center is not officially supported. Learn warns not to delete all Dataverse solutions if you want to keep using Inventory Visibility.

## Limits and caveats

- Learn states there is no throttling on how often you can call the APIs.
- Adjustments, soft reservations and ATP queries trigger Dataverse calls and fall under Dataverse service protection limits. Most on-hand queries come from an in-memory cache.
- Each full-access user license typically adds 250 MB of database storage and 2 GB of file storage per user, and usage may vary.
- The overview gives the *Total available* calculated measure as an example: On-hand + Purchased - On order - Sold.

## What the pages do not cover

A minimum add-in version or compatibility matrix, Entra API permissions, the endpoint URL format, optional feature setup, install timing beyond one hour, and rollback to an earlier version.

## Typical mistakes (my advice)

- Reusing one Entra application for several environments.
- Installing without Dataverse solution permissions and waiting past an hour.
- Forgetting to enable the periodic job.
- Changing the maximum records value without a good reason.

## Related

- [Dynamics 365 Inventory Management](https://www.m365.fm/entity/dynamics-365-inventory-management/)
- [Dynamics 365 Supply Chain Management](https://www.m365.fm/entity/dynamics-365-supply-chain-management/)
- [Power Platform admin center](https://www.m365.fm/entity/power-platform-admin-center/)

## Sources

- [Inventory Visibility add-in overview (Microsoft Learn)](https://learn.microsoft.com/dynamics365/supply-chain/inventory/inventory-visibility)
- [Install the Inventory Visibility Add-in (Microsoft Learn)](https://learn.microsoft.com/dynamics365/supply-chain/inventory/inventory-visibility-setup)
