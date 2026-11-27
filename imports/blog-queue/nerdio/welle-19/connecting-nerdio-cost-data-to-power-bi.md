---
title: "Connecting Nerdio cost data to Power BI"
summary: "Nerdio Manager provides a NerdioReporting custom connector and an optional template that load user cost attribution reports into Power BI Desktop. This guide covers setup, scheduled refresh through a gateway and limits."
status: review
publish: false
author: mirko-p
date: 2026-11-18
render: v2
topics: [nerdio-finops-user-cost-attribution, nerdio-manager-for-enterprise]
keypoints:
  - "The connection needs Nerdio Manager Premium with user cost attribution enabled, Power BI Desktop and the NerdioReporting custom connector, installed either by a Nerdio PowerShell script or manually."
  - "In Power BI Desktop you enter the configuration name, base URL and Power BI access key from Nerdio Manager. The connector talks to the App Service, not the storage account."
  - "Several configurations can be loaded into one file, separated by commas. Configurations sharing a subscription or Log Analytics workspace are likely to duplicate data when combined."
  - "A published report refreshes only through an on-premises data gateway that has the connector file, stays online and uses a licensed account. The data source needs the same three values."
  - "Azure cost exports and FinOps toolkit reports cover Azure cost without Nerdio, but in our reading carry no session-based user allocation. Microsoft's Cost Management connector is deprecated."
faq:
  - q: "Can I use Power BI without Nerdio's Premium edition?"
    a: "Not for this connector. Nerdio's pages say user cost attribution, including its export to Power BI, is only available in the Premium edition. Without it you can use exports from Azure Cost Management, which Microsoft recommends over its deprecated Cost Management connector. Both have the limits described in the alternatives section."
  - q: "Why does a published report not refresh in the Power BI service?"
    a: "Because the data comes from a custom connector. Nerdio says a published report needs an on-premises data gateway on a server that holds the connector file, is powered on, is connected to the internet and is signed in with an account that has a Power BI licence and access to the workspace. The gateway data source must also be added manually and mapped to the semantic model."
  - q: "How do I report cost per cost centre?"
    a: "Nerdio's overview says that with Power BI you can add your own data sources, for example one that links a user to a cost centre, and report on AVD cost per cost centre. Nerdio does not document the model in detail, so inspect the user columns in the loaded tables and the template before you build the relationship. Nerdio's release notes for the 8.0 line (June 2026) also list Custom Cost Groups, which let you group specific users in user cost attribution and charge them back, so check that feature in your version before you build a mapping of your own."
---

To connect Nerdio cost data to Power BI, enable the Power BI connector in Nerdio Manager, install the NerdioReporting custom connector on the machine that runs Power BI Desktop, enter the configuration name, base URL and access key, and load the tables. For a report that refreshes in the Power BI service you also need an on-premises data gateway.

This guide is about the connection. How the numbers are calculated, the report types and the validation steps are in [User cost attribution in Nerdio: showback and chargeback per host pool](https://www.m365.fm/community/u/mirko-p/blog/user-cost-attribution-in-nerdio-showback-and-chargeback-per-host-pool/).

## Requirements

- [Nerdio Manager for Enterprise](https://www.m365.fm/entity/nerdio-manager-for-enterprise/) in the Premium edition, with [user cost attribution](https://www.m365.fm/entity/nerdio-finops-user-cost-attribution/) enabled and at least one report configuration.
- [Power BI Desktop](https://www.m365.fm/entity/power-bi-desktop/) on the machine where you build the report.
- For combined reports, configurations that each have a complete previous month of data. Nerdio lists this as an assumption.
- For publishing, a Power BI environment with the minimum licence needed to share reports, and a server for the gateway.

## How the data travels

Nerdio's resources page describes the path. The user cost attribution App Service in Azure builds the reports and controls the files in the storage account. The custom connector, installed on a PC, asks that App Service for report files and imports them into a .pbix file. The Power BI import is authenticated with a secondary API key that authorises only specific Power BI functions, the App Service is the intermediary and the connector never accesses the storage account directly. The keys are held in the dedicated key vault. For the service, the [on-premises data gateway](https://www.m365.fm/entity/on-premises-data-gateway/) uses the same connector.

## Step 1: install the connector

In Nerdio Manager, go to Observability, Insights, Costs & Efficiency, select the User cost attribution area, and choose Power BI beneath the Per-User Cost box. When prompted, select Enable, then choose a setup type.

**Automatic (PowerShell script):**

1. Download and install Power BI Desktop.
2. Download the setup script and run `./Nerdio_User_Cost_Attribution.ps1`.
3. If Windows reports that running scripts is disabled, Nerdio's page says to run `Set-ExecutionPolicy RemoteSigned`, and `Set-ExecutionPolicy Default` after the installation to disable unsigned scripts again. Microsoft Learn adds points that Nerdio's page does not cover. RemoteSigned still blocks an unsigned script that Windows marks as downloaded from the internet, unless you unblock it with `Unblock-File`. Without `-Scope`, the change applies to the whole computer and needs an elevated console; `-Scope Process` or `-Scope CurrentUser` is narrower. A Group Policy setting overrides every scope. In Windows PowerShell 5.1, Learn lists `Default` as Restricted on clients and RemoteSigned on servers, so note `Get-ExecutionPolicy -List` before the change and restore that value instead of assuming `Default`. Clear the change with your endpoint team.

**Manual:**

1. Download and install Power BI Desktop.
2. Add the certificate thumbprint to the registry. Nerdio links a Microsoft article for the details.
3. Optionally download the .pbix template.
4. Download the connector and copy it to Documents, Power BI Desktop, Connectors. Microsoft Learn names the folder `[Documents]\Microsoft Power BI Desktop\Custom Connectors`, to be created if it does not exist; with OneDrive Known Folder Move, Documents may be redirected. If the connector is not listed, check Unblock in the file properties and restart Power BI Desktop. Our reading: the thumbprint step is the trusted-publisher route Learn describes for signed connectors, which avoids lowering the data extension security setting.

## Step 2: load the data

1. Start Power BI Desktop, optionally opening the downloaded template.
2. Select Get data, More, search for NerdioReporting and select Connect.
3. Enter the Configuration Name, Base URL and Power BI Access Key shown in Nerdio Manager. Treat the key like a credential. Our reading: do not paste it into shared documents.
4. In the Navigator, select the tables and choose Load.

Nerdio's two pages differ on the table names. The export page says to select the AVD and MAU rows; the combine page says AVD and CUR, and adds an ERR table that previews months for which no built data could be loaded. Select what the Navigator offers in your connector version and check the ERR table after the first load.

The template includes a predefined report page called Other Cost Detail. According to Nerdio's FAQ it breaks the "other" bucket down by service name, by resource group and in a list of resources with type, service name and meter. Nerdio says the same breakdown is available through the connector.

## Combining configurations

If a subscription appears in more than one configuration, Nerdio says the combined report will likely have duplicated cost and resource data; for a shared Log Analytics workspace it will likely contain duplicate session and VM data. Nerdio's example: with configurations Complete AVD deployment and Config1, type `Complete AVD deployment, Config1` in the report names field. Before you combine:

1. Open System, Settings, Nerdio, User cost attribution, Report configs and note the subscriptions and workspaces of each configuration.
2. Remove any overlap by creating new, non-overlapping configurations. Nerdio's combine page says editing an existing configuration is currently not supported, although its configuration page describes edit controls, so check your version.
3. Keep Log Analytics retention in mind when you create new configurations: Nerdio's cost data page gives 30 days as the default, which limits how far back a new configuration can build.
4. Load the tables, then use the Report drop-down in the upper right of a report page to show all reports together or one only.

## Publishing and scheduled refresh

Nerdio recommends publishing to the Power BI platform instead of sharing the desktop file. Because the data comes from a custom connector, refresh needs an on-premises data gateway. Do these steps on the server that will host it:

1. Install the gateway and sign in with an organisational account that can access your Power BI environment.
2. In the gateway app, open Connectors and, under custom data connectors, load the connector folder. Nerdio notes the path cannot be inside the Users folders. Microsoft Learn explains why: the gateway service account, by default NT SERVICE\PBIEgwService, typically cannot read folders under user profiles.
3. Copy the latest connector file into that folder, restart the gateway and confirm that NerdioReporting is listed.
4. Keep the gateway app open, powered on, online and signed in. Open the .pbix file, select Publish and choose a workspace.
5. In the Power BI service, open the workspace, hover over the semantic model and select Schedule refresh, then Gateway and Cloud Connections. If that tab is missing, the gateway has not synced; restart it and check Settings, Manage Connections and Gateways.
6. In the gateway settings, make sure both options in the Power BI section are selected and save.
7. Under the data sources, select Manually add to gateway and enter a connection name plus the Configuration Name, Base URL and Power BI Access Key exactly as in the report. Select Skip test connection, then Save.
8. Under Maps to, select the new connection and Apply. You can now refresh manually and on a schedule.

Nerdio advises using the same connector version in the file and on the gateway; after a connector update, reset the gateway and republish. Microsoft Learn adds that a custom connector used on the gateway must implement TestConnection, that DirectQuery supports only one custom connector data source, and that Kerberos with Windows authentication is not supported for custom connectors. With Nerdio's connector, follow Nerdio's Skip test connection step. Our reading: the TestConnection rule mainly explains why a self-built connector can fail on the gateway.

Nerdio's performance page says reports rebuild once daily by default and that Azure cost data updates daily, so multiple refreshes in a day have diminishing returns. Our reading: schedule the Power BI refresh after the daily build. Nerdio does not state the build time, so check it in your environment. If credentials are greyed out in the service, see [Power BI data source credentials greyed out](https://www.m365.fm/community/u/mirko-p/blog/power-bi-data-source-credentials-greyed-out-scheduled-refresh-gateway/).

## Sharing through Excel

Once the dataset refreshes, open the report in Power BI, select Export, Analyze in Excel, open the file, select Enable Content, select the pivot table and choose Refresh All. Nerdio notes that the Excel file is created in your organisation's OneDrive and has a built-in connection to the dataset. A scheduled refresh on the dataset makes the latest data available when you refresh in Excel; the pivot table still has to be refreshed there with Refresh All.

## Alternatives and their limits

Our reading: the Nerdio route is the only one in this article that includes session-based user allocation, because the Cost Management data carries no session information. The Azure-native options cover cost per resource, subscription or tag:

- **Exports to a storage account.** Microsoft's FinOps toolkit page generally recommends starting with Cost Management exports, which it says support up to $2-5 million in monthly spend. Learn also names exports as the workaround for agreement types the connector does not support.
- **FinOps toolkit Power BI reports.** They have several backends: storage reports read exports (the FOCUS cost and usage dataset is required) and are not recommended above $2 million per month; KQL reports use FinOps hubs with Azure Data Explorer, which Microsoft suggests for refresh timeouts or data across several tenants; Fabric options also exist.
- **Microsoft Cost Management connector in Power BI Desktop.** Microsoft's FinOps toolkit setup page lists it as deprecated and not recommended for new implementations, and says the Cost Management team no longer updates it and recommends exporting data. If you still use it: it supports direct Microsoft Customer Agreement and Enterprise Agreement accounts, not pay-as-you-go MCA, indirect MCA, Microsoft Partner Agreement or Office 365 GCC accounts. It supports an estimated maximum of $5 million of raw cost details, Power BI does not support data row requests above one million rows, and Learn suggests refreshing once or twice a day because data takes 8 to 24 hours to arrive.

## Troubleshooting

| Symptom | Check |
|---|---|
| Script does not run | Execution policy, a blocked download or a Group Policy override, as in Step 1 |
| No data for a month | The ERR table, and whether a report for that month was built |
| Duplicate cost in a combined report | Overlapping subscriptions or workspaces |
| Gateway tab missing in the service | Gateway sync, connector folder outside Users, restart |
| 502 errors from the user cost attribution console | Nerdio's secret expiry page: create a new client secret on the app registration (730 days recommended), update the matching key vault secret, restart the web app |

The last item is a console symptom on Nerdio's page. Our reading: because the connector goes through the same App Service, an expired secret would also block Power BI refreshes, but Nerdio does not say so.

## Sources

- [Nerdio: User cost attribution export feature](https://nmehelp.getnerdio.com/hc/en-us/articles/25499402662285-User-cost-attribution-export-feature)
- [Nerdio: User cost attribution combine reports using Power BI](https://nmehelp.getnerdio.com/hc/en-us/articles/29123294304013-User-cost-attribution-combine-reports-using-Power-BI)
- [Nerdio: User cost attribution Power BI publishing guidance](https://nmehelp.getnerdio.com/hc/en-us/articles/29286415353741-User-cost-attribution-Power-BI-publishing-guidance)
- [Nerdio: User cost attribution analytics](https://nmehelp.getnerdio.com/hc/en-us/articles/25499395894029-User-cost-attribution-analytics)
- [Nerdio: User cost attribution overview](https://nmehelp.getnerdio.com/hc/en-us/articles/26124340517133-User-cost-attribution-overview)
- [Nerdio: User cost attribution (UCA) Azure resources and permissions](https://nmehelp.getnerdio.com/hc/en-us/articles/49560126573453-User-cost-attribution-UCA-Azure-resources-and-permissions)
- [Nerdio: User cost attribution cost validation FAQs](https://nmehelp.getnerdio.com/hc/en-us/articles/27226128388493-User-cost-attribution-cost-validation-FAQs)
- [Nerdio: User cost attribution build reports and performance](https://nmehelp.getnerdio.com/hc/en-us/articles/26734000753549-User-cost-attribution-build-reports-and-performance)
- [Nerdio: Where does NME show me Azure cost data?](https://nmehelp.getnerdio.com/hc/en-us/articles/48618389927565-Where-does-NME-show-me-Azure-cost-data)
- [Nerdio: Nerdio Manager for Enterprise release notes](https://nmehelp.getnerdio.com/hc/en-us/articles/19837802929677-Release-Notes)
- [Nerdio: User cost attribution secret expiry](https://nmehelp.getnerdio.com/hc/en-us/articles/30394374049165-User-cost-attribution-secret-expiry)
- [Microsoft Learn: Use custom data connectors with the on-premises data gateway](https://learn.microsoft.com/en-us/power-bi/connect-data/service-gateway-custom-connectors)
- [Microsoft Learn: Connect to Microsoft Cost Management data in Power BI Desktop](https://learn.microsoft.com/en-us/power-bi/connect-data/desktop-connect-azure-cost-management)
- [Microsoft Learn: about_Execution_Policies](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies)
- [Microsoft Learn: Connector extensibility in Power BI](https://learn.microsoft.com/en-us/power-bi/connect-data/desktop-connector-extensibility)
- [Microsoft Learn: Azure Cost Management connector for Power Query](https://learn.microsoft.com/en-us/power-query/connectors/azure-cost-management)
- [Microsoft Learn: FinOps toolkit Power BI reports setup](https://learn.microsoft.com/en-us/cloud-computing/finops/toolkit/power-bi/setup)
