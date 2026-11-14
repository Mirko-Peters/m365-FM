---
title: "Graph Data Connect and Microsoft Graph Permissions Explained: Setup, Consent, Least Privilege"
summary: "What Microsoft Graph Data Connect does, how it differs from the Graph API, the setup and approval steps, and how Graph permissions (delegated, application, consent) work."
status: review
publish: false
author: mirko-p
date: 2026-11-27
topics: [microsoft-graph-data-connect, microsoft-graph-permissions, graph]
keypoints:
  - "Graph Data Connect extracts Microsoft 365 data in bulk to Azure storage for analytics. The Graph API suits small amounts of data from selected users and groups."
  - "Setup needs a Global Administrator to enable it, an Entra app registration, an Azure Storage account and an admin approval of the data access request."
  - "Pipelines carry about 45 minutes of overhead, and a first run can take over 40 minutes including consent."
  - "Graph permissions come in two types. Delegated permissions act for a signed-in user. Application permissions act without a user and need admin consent."
  - "Microsoft recommends the delegated model when it meets the app's needs, and the smallest permission that works."
  - "Permission names follow {resource}.{operation}.{constraint}, such as Application.ReadWrite.OwnedBy."
faq:
  - q: "What is the difference between Graph Data Connect and the Microsoft Graph API?"
    a: "The Data Connect FAQ on Microsoft Learn says both give access to the same underlying data in different ways. Data Connect is designed to extract large amounts of data in bulk for the whole organization, while the Graph APIs suit small amounts of data from selected users and groups."
  - q: "Who approves a Graph Data Connect application?"
    a: "In Microsoft's quickstart, a Global Administrator approves the request in the Microsoft 365 admin center under Settings > Org settings > Security & privacy > Microsoft Graph Data Connect applications. The quickstart states that you cannot self-approve your own apps."
  - q: "Does every pipeline run need a new consent request?"
    a: "No. According to the Data Connect FAQ, as long as the scope stays the same for datasets, columns, users and sink, a run does not need a new consent request. Running the same scope for different dates is covered."
  - q: "Should an app use delegated or application permissions?"
    a: "Microsoft Learn says application permissions are highly privileged and that, from a least-privilege view, the delegated model is recommended whenever it meets the app's needs. Application permissions always need administrator consent."
---

Microsoft Graph Data Connect and Microsoft Graph permissions are two separate topics that often get searched together. Data Connect is a bulk data extraction service for Microsoft 365 analytics. Graph permissions control what an app may do through the Graph API. Both rely on consent, and both reward the same habit: ask for the least access that does the job.

## What Graph Data Connect is

Microsoft describes Data Connect as secure, scalable access to Microsoft 365 datasets in Microsoft Fabric, Azure Synapse and Azure Data Factory, for enterprise analytics. Data comes from sources such as Microsoft Entra ID, Outlook, Teams, SharePoint, Viva Insights and Microsoft groups.

Datasets fall into three groups: basic (raw customer-created content), cleaned (normalized or de-duplicated) and curated (built for a specific scenario). The dataset list includes, for example, TeamsCallRecords_v1, SharePointPermissions_v1, GroupMembers_v0 and PlannerTasks_v0. Viva Insights datasets require a Viva Insights license, which is the only license note on the dataset page.

## Data Connect or Graph API

The Data Connect FAQ puts it this way: both reach the same underlying data. Data Connect extracts large amounts in bulk across the organization. The Graph APIs suit small amounts of data from selected users and groups. The FAQ suggests combining them, for example Data Connect for the initial extraction and Graph APIs for real-time work afterwards.

Known limits from the FAQ:

- Pipelines have an overhead of around 45 minutes, whatever the data size.
- Exchange on-premises users are not supported, including in hybrid setups.
- Messages and events from resource accounts are not supported.
- Cross-tenant dataset access is not available. Azure resources and Microsoft 365 must be in the same Entra tenant.

## Set-up steps

The quickstart walks through these steps. Menu names are as Microsoft lists them.

1. **Enable Data Connect.** Sign in to admin.microsoft.com as a Global Administrator. Select **Settings** > **Org settings**, then on the **Services** tab select **Microsoft Graph Data Connect**. Tick the option to turn it on for the entire organization and save.
2. **Create the Entra application.** In the Microsoft Entra admin center, go to **App registrations** > **New registration**. Choose "Accounts in this organizational directory only." Copy the application (client) ID and tenant ID, create a client secret and save its value immediately. The application owner needs a mailbox and, per the quickstart, a working E5 subscription.
3. **Create Azure Storage.** Create a storage account in a region that matches your Microsoft 365 region. Grant the application the **Storage Blob Data Contributor** role under **Access control (IAM)**, and create a private container.
4. **Register the application with Data Connect** in the Azure portal. Choose the destination, the application and the datasets and columns.
5. **Approve the request.** A Global Administrator opens **Settings** > **Org settings** > **Security & privacy** > **Microsoft Graph Data Connect applications**. The application shows **Pre-consent**. Review the datasets and select **Approve**. The quickstart warns that you cannot self-approve.
6. **Run the pipeline** in Synapse, Data Factory or Fabric. The status moves through Initializing, Consent Pending, Extracting Data, Persisting Data and Succeeded. The first run can take over 40 minutes.

Supported sinks include Azure Data Lake Storage Gen2, Azure Storage Blob, Azure SQL DB (mapping data flows only) and Microsoft Fabric OneLake. Service principal authentication is the only supported mechanism.

## Consent and cost

Consent covers the scope of the extraction: datasets, columns, users and sink. A run with the same scope does not need a new request. Billing happens through Azure subscriptions, per pipeline run, with fractional units rounded up. The FAQ example: 20 runs of 500 rows each are billed as 20 units, not 10. The pages read do not state rates.

## Graph permissions: the basics

For the Graph API, Microsoft defines two permission types.

| | Delegated | Application |
|---|---|---|
| Acts | On behalf of a signed-in user | Without a user |
| Effective access | Limited by the app's permissions and the user's own | Any data the permission covers |
| Who can consent | Users, or admins for all users | Admin only |
| Other names | Scopes | App roles |

Consent for application permissions needs the Privileged Role Administrator or Global Administrator role. User consent for delegated permissions can still be restricted by tenant app consent policies.

## Naming and least privilege

Permissions follow `{resource}.{operation}.{constraint}`. Operations include Read, ReadWrite, Create and Manage. Constraints include All, OwnedBy and Selected. If no constraint is given, access is limited to data owned by the signed-in user. For example, Application.ReadWrite.OwnedBy manages only applications the app creates or owns, while Application.ReadWrite.All manages all of them.

Microsoft's guidance: grant the minimum permission needed. Use Directory.AccessAsUser.All, Directory.ReadWrite.All and Directory.Read.All with caution and prefer lesser permissions. Resource-specific consent lets a user grant access to one resource instance, such as a team, instead of the whole tenant. It is supported by only a subset of features.

## Common problems

- **Connector agent registration fails.** Learn states that delegated permissions are not supported for connector agent registration. Request least-privileged application permissions and grant tenant-wide admin consent.
- **Members show only id and @odata.type.** The app lacks permission to read that member type.
- **Too many permissions on one app.** Apps whose sign-in audience includes personal Microsoft accounts can request at most 30 permissions; organizational audiences can request up to 400.

## What the documentation does not say

The Data Connect pages read do not describe how long an approval stays valid or give pricing rates. They also do not list license requirements beyond the quickstart's tutorial setup.

## Related

- [Microsoft Graph Data Connect](https://www.m365.fm/entity/microsoft-graph-data-connect/)
- [Microsoft Graph permissions](https://www.m365.fm/entity/microsoft-graph-permissions/)
- [Admin consent](https://www.m365.fm/entity/admin-consent/)
- [Application registration](https://www.m365.fm/entity/app-registration/)

## Sources

- [Microsoft Graph Data Connect overview](https://learn.microsoft.com/en-us/graph/data-connect-concept-overview)
- [Data Connect quickstart](https://learn.microsoft.com/en-us/graph/data-connect-quickstart)
- [Data Connect FAQ](https://learn.microsoft.com/en-us/graph/data-connect-faq)
- [Datasets, regions and sinks](https://learn.microsoft.com/en-us/graph/data-connect-datasets)
- [Overview of Microsoft Graph permissions](https://learn.microsoft.com/en-us/graph/permissions-overview)
