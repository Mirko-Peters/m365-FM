---
title: "How to Move Microsoft Sentinel to the Microsoft Defender Portal: Plan, Configure, Operate"
summary: "After March 31, 2027 Microsoft Sentinel is supported only in the Defender portal. Follow Microsoft's transition phases: plan and onboard, review connectors, analytics rules, automation and APIs, then update analyst processes."
status: review
publish: false
author: mirko-p
date: 2027-01-14
topics: [microsoft-sentinel, microsoft-defender-for-cloud, advanced-hunting, azure-logic-apps]
keypoints:
  - "Learn says Microsoft Sentinel is no longer supported in the Azure portal after March 31, 2027 and will be available only in the Defender portal."
  - "The transition has no extra cost, even for customers without E5; billing stays based on Sentinel consumption."
  - "Alerts from Microsoft security products move to the Defender XDR connector, and the Fusion analytics rule is disabled because the Defender XDR engine takes over correlation."
  - "Automation rules and playbooks need review: incident provider values, alert triggers, batching windows and delays of up to 5 or 10 minutes."
  - "Analysts work from a unified incident queue; Learn recommends training and says SOC processes might need updating."
faq:
  - q: "What happens after March 31, 2027?"
    a: "Microsoft Learn says Microsoft Sentinel will no longer be supported in the Azure portal after March 31, 2027 and will be available only in the Microsoft Defender portal. Customers still using the Azure portal will be redirected to the Defender portal."
  - q: "Do I need Defender XDR or an E5 license?"
    a: "No. Learn says Microsoft Sentinel is generally available in the Defender portal, including for customers without Defender XDR or an E5 license, and that the transition has no extra cost. Without Defender capabilities, some features are limited or unavailable: Microsoft Security Exposure Management, custom detection rules and the Action center."
  - q: "What happens to my data connectors?"
    a: "Existing non-Microsoft connectors keep working. After onboarding with Defender XDR, alerts from Microsoft security products are routed through the Microsoft Defender XDR connector instead of standalone alert connectors. Several of those connectors are not shown on the Data connectors page in the Defender portal but remain listed in Sentinel in the Azure portal."
  - q: "Do I lose the Fusion rule or alert correlation?"
    a: "Learn says the Fusion analytics rule is disabled when you onboard, and that you do not lose alert correlation because the Defender portal uses Defender XDR incident creation and correlation instead."
  - q: "Where do the Azure portal menu items go?"
    a: "Learn has a quick reference. For example Logs becomes Investigation and response, Hunting, Advanced hunting; Incidents becomes Investigation and response, Incidents and alerts, Incidents; Data connectors, Analytics, Watchlists and Automation sit under the Microsoft Sentinel section; Settings is under System, Settings, Microsoft Sentinel."
---

Microsoft Learn says that after March 31, 2027 Microsoft Sentinel will no longer be supported in the Azure portal and will be available only in the Microsoft Defender portal. Customers who are still in the Azure portal will be redirected. The move has no extra cost, and you do not need Defender XDR or an E5 license. This guide follows the order of Learn's transition article: plan and onboard, configure and review, then run operations. It also uses the Learn overview page for the feature comparison and navigation changes.

## Before you start

The transition article is for customers with an existing workspace enabled for Microsoft Sentinel. Learn says a new customer who onboarded with the permissions of a subscription Owner or User Access Administrator has workspaces onboarded to the Defender portal automatically. Learn also notes that transitioning has no extra cost, even for non-E5 customers, and that you continue to be billed as usual for Sentinel consumption.

## Phase 1: plan and set up (security architects)

Learn says to review all planning guidance and finish all prerequisites before you onboard a workspace. Points from the page:

- **Permissions.** After onboarding, the Microsoft Sentinel Contributor role is assigned to the Microsoft Threat Protection and WindowsDefenderATP apps in your subscription. Learn points to unified role-based access control (URBAC) in the Defender portal and to a mapping of Defender XDR URBAC permissions to existing RBAC permissions.
- **Onboarding without Defender XDR.** If you plan to use Sentinel without Defender XDR, you need an extra step to trigger the connection between Sentinel and the Defender portal.
- **Data storage and privacy.** In the Azure portal the Microsoft Sentinel policies apply. In the Defender portal the Microsoft Defender XDR policies apply instead, even for Sentinel data. Learn gives a table that links the storage location, retention and sharing sections of both. For business continuity, it says Azure portal customers are responsible for replicating their data, while Microsoft Defender uses automation for BCDR on control planes.
- **Customer-managed keys.** If you enabled CMK before onboarding, all log data in the workspace stays CMK-encrypted, old and new. Analytic rules and other Sentinel content such as automation rules also stay CMK-encrypted, but alerts and incidents are no longer CMK-encrypted after onboarding. CMK is not fully supported for data in the Sentinel data lake, where data is encrypted with Microsoft-managed keys.
- **Multiple workspaces and tenants.** The Defender multitenant portal lets you connect one primary workspace and multiple secondary workspaces per tenant. You onboard each workspace separately.

## Phase 2: configure and review (security engineers)

### Data collection

Learn says the architecture of data collection stays intact and existing non-Microsoft data connectors keep running. What changes is alert ingestion for Microsoft security products, which is routed through the Microsoft Defender XDR connector instead of standalone alert connectors. Log data storage in Log Analytics does not change.

In multi-workspace setups, the Defender XDR connector is connected to the primary workspace only. Standalone connectors for Defender for Office 365, Entra ID Protection, Defender for Cloud Apps, Defender for Endpoint and Defender for Identity are disconnected automatically in secondary workspaces, so tenant-based alerts from those products appear only in the primary workspace.

Make sure incidents and alerts from the Defender connector are turned on. For Defender for Cloud, Learn says to prevent duplicate events: with the tenant-based connector take action to avoid duplicates, and with the legacy subscription-based connector alerts might still be forwarded to the primary workspace through the Defender XDR connector. Some connectors, including the Defender XDR and both Defender for Cloud connectors, are not shown on the **Data connectors** page in the Defender portal after onboarding but are still listed in the Azure portal. The routing change causes schema differences for some alerts, and Learn links a comparison page.

### Analytics rules

Analytics rule functionality stays the same: wizard, repositories and API. Learn lists changes to check:

- Fusion is disabled and replaced by Defender XDR correlation.
- Alert grouping and incident merging are controlled by the Defender XDR correlation engine, so several rules that each create an incident per alert can end up as merged incidents.
- Rules set to alerts only, with incident creation turned off, produce alerts that are not visible in the Defender portal.
- Incident names might change after correlation, so Learn advises against using incident titles as automation conditions.
- Active Microsoft security incident creation rules are deactivated to avoid duplicates.

### Automation rules and playbooks

Playbooks are Azure Logic Apps workflows. Learn lists these limitations to plan for:

- Automation rules with alert triggers act only on Sentinel alerts unless you use the **Enhanced Alert Trigger**.
- The **Incident provider** condition is removed, so existing rules run on both Sentinel and Defender XDR incidents. Rules that name an analytics rule run only on incidents containing alerts from that rule.
- The **SecurityIncident** table no longer includes a **Description** field, so rules that depend on it stop working.
- Playbook triggers can be delayed up to 5 minutes, and automation rules can take up to 10 minutes to run after an incident is created or updated in the Defender portal.
- Several changes to one incident within 5 to 10 minutes produce one update with only the latest change.
- Running playbooks manually on an alert or entity is not currently supported in the Defender portal.
- Adding or removing alerts from incidents is not supported from playbooks after onboarding.

### APIs

For unified incidents and alerts Learn recommends the Microsoft Graph REST API. The Sentinel `SecurityInsights` API still covers Sentinel resources such as analytics and automation rules, but incident responses change. The provider name becomes `Microsoft XDR`, and a `providerIncidentUrl` field links to the incident.

## Phase 3: run operations (security analysts)

Learn says the unified incident queue consolidates incidents across products, so triage changes and training is recommended. Note these differences:

- Advanced hunting gives access to existing log tables, KQL queries and functions. Bookmarks are not available there but remain under **Microsoft Sentinel** > **Threat management** > **Hunting**.
- Entity pages for users, devices and IP addresses are consolidated with Sentinel and Defender data.
- Adding entities to threat intelligence from incidents is supported only in the Azure portal.
- The `IdentityInfo` table becomes a native Defender table that does not support table-level RBAC, so that access control is no longer available.
- Workbooks continue to work, and the similar incidents preview is not supported in the Defender portal.
- Editing existing incident comments is not supported in the Defender portal, and incidents created through the API, a Logic App playbook or manually in the Azure portal are not synchronized to the Defender portal.

## A checklist from my own experience

This section is my advice, not a Microsoft statement.

1. Export a list of automation rules and note which use incident provider, incident title, the Description field or alert triggers.
2. Check the playbooks for manual-run use and for alert-removal actions.
3. List the Microsoft security connectors you use, and decide which workspace is primary.
4. Check CMK, table-level RBAC and any `IdentityInfo` access restrictions before onboarding.
5. Brief analysts on the new menu locations. Learn's quick reference maps each Azure portal item.

## Related

- [Microsoft Sentinel](https://www.m365.fm/entity/microsoft-sentinel/)
- [Microsoft Defender for Cloud](https://www.m365.fm/entity/microsoft-defender-for-cloud/)
- [Advanced hunting](https://www.m365.fm/entity/advanced-hunting/)
- [Azure Logic Apps](https://www.m365.fm/entity/azure-logic-apps/)

## Sources

- [Transition Your Microsoft Sentinel Environment to the Defender Portal (Microsoft Learn)](https://learn.microsoft.com/azure/sentinel/move-to-defender)
- [Microsoft Sentinel in the Microsoft Defender portal (Microsoft Learn)](https://learn.microsoft.com/azure/sentinel/microsoft-sentinel-defender-portal)
