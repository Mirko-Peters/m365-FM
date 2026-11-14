---
title: "How to Create Custom Detection Rules in Microsoft Defender XDR"
summary: "Create custom detection rules in Microsoft Defender XDR: roles, the six wizard steps, query columns, frequency and lookback, alert enrichment, response actions, scope, and documented limits such as 150 alerts per run."
status: review
publish: false
author: mirko-p
date: 2027-01-06
topics: [defender, advanced-hunting]
keypoints:
  - "Start from Advanced hunting with a validated query and select Create detection rule, or use Custom detection rules > Create detection rule in the Defender portal."
  - "Roles: Security settings (manage), Security Administrator, or Security Operator when RBAC is off in Defender for Endpoint. Sentinel data needs Microsoft Sentinel Contributor or higher."
  - "Each rule can generate 150 alerts per run. A new rule runs immediately against the past 30 days and then repeats at the chosen frequency."
  - "Continuous (NRT) frequency requires a single-table query with supported operators, no joins, unions or comments."
  - "Response actions include isolating devices, collecting an investigation package, quarantining files, marking users compromised and moving or deleting email."
faq:
  - q: "Which roles can create custom detection rules?"
    a: "For Defender data, Microsoft Learn names Security settings (manage), Security Administrator, or Security Operator, which is sufficient only if RBAC is turned off in Defender for Endpoint. For Microsoft Sentinel data, Microsoft Sentinel Contributor or higher. You also need permissions for the devices in the rule's scope."
  - q: "How do I create one?"
    a: "Prepare and run a query in Advanced hunting, then select Create detection rule. Or go to Custom detection rules > Create detection rule and paste a query. The wizard covers the query, alert details, alert enrichment, actions, scope and review."
  - q: "What are the frequency options?"
    a: "Every 24 hours, 12 hours, 3 hours, hour, Continuous (NRT), and Custom for rules based solely on Microsoft Sentinel data, from 5 minutes to 14 days."
  - q: "What are the limits?"
    a: "150 alerts per rule per run, 20 custom detail pairs with 4 KB combined per alert, up to three columns per dynamic title or description field, and a lookback of 5 minutes to 30 days."
  - q: "What does a new rule do when I create it?"
    a: "It runs immediately against the past 30 days of data and then repeats at the chosen frequency. Edits take effect at the next scheduled run."
---

Build and test the query in Advanced hunting, check that it returns the columns you need, and then create the rule from the query. The wizard asks for alert details, enrichment, response actions and scope. This guide follows the Microsoft Learn article on custom detection rules in Defender XDR.

## Roles

| Data | Needed |
| --- | --- |
| Defender data | **Security settings (manage)**, or **Security Administrator**, or **Security Operator**. Security Operator suffices only if RBAC is off in Defender for Endpoint. With RBAC configured, the user also needs the Manage Security Settings permission for Defender for Endpoint |
| Microsoft Sentinel data | **Microsoft Sentinel Contributor** or higher, at workspace, resource group or subscription scope |

You also need permissions for each Defender solution whose tables the query uses. For example `Email*` tables need Defender for Office 365 permissions. To create or edit a rule, you need permissions for the devices in its scope. Learn advises using the role with the fewest permissions.

## Where to start

- **From Advanced hunting:** run the query, then select **Create detection rule**. This lets you validate results first.
- **From the list:** select **Custom detection rules** > **+ Create detection rule** and write or paste the query.

The wizard steps: prepare the query, create the rule and provide alert details, define alert enrichment, specify actions, set the rule scope, and review and turn on the rule with **Create**. The rule runs immediately.

## Prepare the query

Each rule can generate **150 alerts** per run, so tune the query. Recommended columns:

| Table type | Columns |
| --- | --- |
| All | `Timestamp` or `TimeGenerated` |
| Defender for Endpoint tables | `DeviceId` and `ReportId` |
| Other Defender tables | `Timestamp` and `ReportId` from the same event |

To map impacted assets automatically, project one strong identifier: for devices `DeviceId`, `DeviceName` or `RemoteDeviceName`, for mailboxes `RecipientEmailAddress` and similar, for accounts `AccountObjectId`, `AccountSid` or `AccountUpn`. Do not filter on `Timestamp` or `TimeGenerated` to control the window. The service prefilters by the lookback. With Microsoft Sentinel scoping, project `SentinelScope_CF`.

Learn's sample query:

```kusto
DeviceEvents
| where ingestion_time() > ago(1d)
| where ActionType == "AntivirusDetection"
| summarize (Timestamp, ReportId)=arg_max(Timestamp, ReportId), count() by DeviceId
| where count_ > 5
```

## Frequency and lookback

Options: every 24 hours, every 12 hours, every 3 hours, every hour, **Continuous (NRT)**, and **Custom** (only for rules based solely on Sentinel data, 5 minutes to 14 days). A new rule runs immediately against the past 30 days and then repeats. Edits take effect at the next scheduled run.

Lookback for Defender data is fixed by frequency:

| Frequency | Lookback |
| --- | --- |
| Every 24 hours | 30 days |
| Every 12 hours | 48 hours |
| Every 3 hours | 12 hours |
| Hourly | 4 hours |

**Continuous (NRT)** needs a query that references one table only, uses only supported KQL operators, has no joins, unions or `externaldata`, contains no comment lines and uses only generally available columns. Learn lists supported tables, for example `DeviceEvents`, `DeviceProcessEvents`, `EmailEvents` and `IdentityLogonEvents`.

## Alert details and enrichment

- **Detection name** must be unique. **Alert title** and **Description** are plaintext, and HTML, Markdown and code are sanitized. URLs must be percent-encoded.
- Set severity, category, MITRE tactic, techniques and recommended actions.
- Dynamic text: reference result columns in double curly brackets, up to three columns per field.
- **Custom details:** up to 20 key-value pairs, with 4 KB combined per alert. If exceeded, the whole array is dropped from the alert.
- **Entity linking:** at most one column per entity type. Defender data maps automatically, while Sentinel data needs manual selection. Entities affect incident grouping.

## Actions

Actions are available for rules that use Defender data.

- **Devices:** isolate device, collect investigation package, run antivirus scan, initiate investigation, restrict app execution.
- **Files:** allow or block (needs Remediate permissions and a file identifier such as SHA-1, and applies to device groups), quarantine file.
- **Users:** mark user as compromised, disable user, reset user authentication. SaaS governance actions are in preview for Box, Google Workspace and Salesforce.
- **Emails:** move to mailbox folder (Junk, Inbox or Deleted items), or delete email as soft or hard delete. Needs `NetworkMessageId` and `RecipientEmailAddress`.

## Scope

Choose **All devices** or **Specific device groups**. Scope affects only device-based rules, not mailbox or identity-only rules.

## Limits and caveats

- 150 alerts per rule per run. The page does not say whether alerts are truncated or dropped beyond that.
- Custom details: 20 pairs and 4 KB.
- Lookback: 5 minutes to 30 days.
- Frequency is based on event timestamp, not ingestion time, so small delays can occur.
- When lookback exceeds frequency, duplicates can occur and the service deduplicates them.

## What the page does not cover

The full list of supported KQL operators and NRT tables, pricing or plan requirements beyond the applies-to list, the Graph API for rules, and how to manage existing rules.

## A cautious start

The steps are practical advice.

1. Run the query in Advanced hunting and read the results.
2. Add the identifier and `ReportId` columns.
3. Create the rule without response actions first.
4. Watch the alerts for a few days, then add automated actions where you trust the precision.

## Typical mistakes

- Using a query that returns far more than 150 rows per run.
- Choosing Continuous (NRT) with a joined query.
- Turning on device isolation before checking false positives.
- Forgetting the identifier columns, so no entity is linked.

## Related

- [Microsoft Defender](https://www.m365.fm/entity/defender/)
- [Advanced hunting](https://www.m365.fm/entity/advanced-hunting/)
- [Microsoft Defender for Endpoint](https://www.m365.fm/entity/microsoft-defender-for-endpoint/)
- [Microsoft Sentinel](https://www.m365.fm/entity/microsoft-sentinel/)

## Sources

- [Create and manage custom detection rules in Microsoft Defender XDR (Microsoft Learn)](https://learn.microsoft.com/defender-xdr/custom-detection-rules)
