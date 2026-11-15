---
title: "How to Connect Microsoft Defender XDR and Microsoft 365 Data to Microsoft Sentinel"
summary: "Connect the Defender XDR data connector to Microsoft Sentinel in the Azure portal: prerequisites, connecting incidents and alerts, entities and events, which tables stream, the Vulnerability Management tables that do not, and the March 31, 2027 portal change."
status: review
publish: false
author: mirko-p
date: 2027-01-08
topics: [microsoft-sentinel, defender]
keypoints:
  - "The Defender XDR connector streams incidents, alerts and advanced hunting events into Sentinel and keeps incidents synchronized between both portals."
  - "Prerequisites include a Defender XDR license, Security Administrator on the source tenant, read and write on the Sentinel workspace, and the Defender XDR solution from Content Hub."
  - "Connect incidents and alerts with Connect incidents and alerts, and tick the box to turn off Microsoft incident creation rules for these products to avoid duplicates."
  - "Twelve Defender Vulnerability Management tables are not ingested into Sentinel and return no results there."
  - "If Sentinel is onboarded to the Defender portal, the connector is enabled automatically. Learn says Sentinel in the Azure portal ends after March 31, 2027."
faq:
  - q: "What do I need to connect Defender XDR to Sentinel?"
    a: "A valid Defender XDR license, the Security Administrator role on the tenant you stream from or equivalent, read and write permissions on the Sentinel workspace, membership in the same Entra tenant as the workspace to change settings, and the Microsoft Defender XDR solution installed from Content Hub."
  - q: "How do I connect incidents and alerts?"
    a: "In Sentinel select Data connectors, open the Microsoft Defender XDR connector page, mark the option to turn off all Microsoft incident creation rules for these products, and select Connect incidents and alerts."
  - q: "How do I verify it works?"
    a: "Run a query in Logs on SecurityIncident where ProviderName equals Microsoft XDR, or use the connector page's data graph."
  - q: "Which tables are not ingested?"
    a: "Twelve Defender Vulnerability Management tables, such as DeviceTvmSoftwareInventory and DeviceTvmSoftwareVulnerabilities. They appear in the schema but return no results in Sentinel."
  - q: "What changes after March 31, 2027?"
    a: "Learn says Sentinel in the Azure portal is no longer supported after that date and customers are redirected to the Defender portal."
---

The Microsoft Defender XDR connector brings incidents, alerts and advanced hunting events into Microsoft Sentinel and keeps incidents in sync between Sentinel and the Defender portal. This guide follows the Microsoft Learn page Stream data from Microsoft Defender XDR to Microsoft Sentinel in the Azure portal. If your Sentinel workspace is already onboarded to the Defender portal, the connector is enabled automatically and these manual steps are not needed.

## Prerequisites

- A valid Microsoft Defender XDR license.
- The **Security Administrator** role on the tenant you stream from, or equivalent permissions.
- Read and write permissions on the Microsoft Sentinel workspace.
- To change connector settings, membership in the same Microsoft Entra tenant that the workspace is associated with.
- The **Microsoft Defender XDR** solution installed from **Content Hub**. In the Defender portal it installs automatically.
- Sentinel access as your organization requires.
- For on-premises Active Directory sync: onboarding to Microsoft Defender for Identity and the sensor installed.

## Open the connector

1. In Microsoft Sentinel select **Data connectors**.
2. Select **Microsoft Defender XDR** from the gallery and **Open connector page**.
3. Work through the three parts of the **Configuration** section.

## Connect incidents and alerts

1. Mark **Turn off all Microsoft incident creation rules for these products. Recommended**, to avoid duplicate incidents.
2. Select **Connect incidents & alerts**.
3. Check ingestion in **Logs**:

```kusto
SecurityIncident
| where ProviderName == "Microsoft XDR"
```

## Connect entities

This part needs User and Entity Behavior Analytics (UEBA).

1. Select the link to the UEBA configuration page.
2. Under **Entity behavior configuration**, turn the toggle **On** if UEBA is not enabled.
3. Mark **Active Directory (Preview)** and select **Apply**.

## Connect events

Mark the tables you want under the tabs **Defender for Endpoint**, **Defender for Office 365**, **Defender for Identity**, **Defender for Cloud Apps** and **Defender alerts**, then select **Apply Changes**. The page lists these tables per tab.

- **Defender for Endpoint:** DeviceInfo, DeviceNetworkInfo, DeviceProcessEvents, DeviceNetworkEvents, DeviceFileEvents, DeviceRegistryEvents, DeviceLogonEvents, DeviceImageLoadEvents, DeviceEvents and DeviceFileCertificateInfo.
- **Defender for Office 365:** EmailAttachmentInfo, EmailEvents, EmailPostDeliveryEvents, EmailUrlInfo and UrlClickEvents.
- **Defender for Identity:** IdentityDirectoryEvents, IdentityLogonEvents and IdentityQueryEvents.
- **Defender for Cloud Apps:** CloudAppEvents.
- **Defender alerts:** AlertInfo and AlertEvidence.

To query an advanced hunting table in Log Analytics, you enter its table name in the query window.

## What is not ingested

Twelve Defender Vulnerability Management tables, including DeviceTvmSoftwareInventory and DeviceTvmSoftwareVulnerabilities, appear in the schema and can be queried in Advanced Hunting in Defender XDR, but return no results in Sentinel. Using them in Sentinel needs a custom ingestion path.

## Synchronization and checks

The connector keeps incidents synchronized between both portals. The page does not use the term bidirectional and does not describe conflict behavior. The connector page shows a data graph for incidents, alerts and events. The page also gives two 14-day trend queries, one for incidents and one for events from a single table.

## Standalone connectors

Turning on the XDR connector automatically disconnects previously connected Defender component connectors. They may still look connected, but no data flows through them. This changes the alert schema and may affect existing queries.

## Portal change

Learn says that after March 31, 2027, Microsoft Sentinel in the Azure portal is no longer supported and customers are redirected to the Defender portal. It recommends planning the move.

## What the page does not say

- Costs or billing for ingested data.
- The entity types and fields synced by the Active Directory option.
- The direction and conflict behavior of synchronization.
- Architecture and schema mapping. Those are in a separate integration article.

## A connection checklist

This list is my advice, built on the page.

1. Check license, role and workspace permissions.
2. Install the Defender XDR solution from Content Hub.
3. Connect incidents and alerts, with duplicate incident creation turned off.
4. Choose event tables with an eye on ingestion volume, because the page gives no cost information.
5. Verify with the SecurityIncident query.
6. Review analytics rules and queries that used the standalone connectors.

## Typical mistakes (my advice)

- Leaving Microsoft incident creation rules on and creating duplicate incidents.
- Expecting Vulnerability Management tables in Sentinel.
- Keeping queries that depend on the old standalone connector schema.
- Planning only for the Azure portal.

## Related

- [Microsoft Sentinel](https://www.m365.fm/entity/microsoft-sentinel/)
- [Microsoft Defender](https://www.m365.fm/entity/defender/)
- [Advanced hunting](https://www.m365.fm/entity/advanced-hunting/)
- [Microsoft Defender for Endpoint](https://www.m365.fm/entity/microsoft-defender-for-endpoint/)

## Sources

- [Stream data from Microsoft Defender XDR to Microsoft Sentinel in the Azure portal (Microsoft Learn)](https://learn.microsoft.com/azure/sentinel/connect-microsoft-365-defender)
