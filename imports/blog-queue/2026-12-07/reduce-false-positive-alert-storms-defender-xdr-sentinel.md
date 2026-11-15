---
title: "Reduce False Positive Alert Storms in Microsoft Defender XDR and Microsoft Sentinel"
summary: "Which tools Microsoft documents for taming noisy alerts: Defender XDR alert tuning rules and classification, Sentinel automation rules, analytics rule exceptions with watchlists, and alert grouping settings."
status: review
publish: false
author: mirko-p
date: 2026-12-07
topics: [defender, microsoft-sentinel]
keypoints:
  - "Defender XDR alert tuning can hide, resolve or convert alerts to behaviors. Hide applies only to Defender for Endpoint alerts. Use it only for known, expected activity."
  - "In Sentinel, automation rules close incidents with an audit trail and expire after 24 hours by default. Watchlist-based exceptions in the analytics rule are the more durable option."
  - "Combine attributes such as IP address and user in one exception to reduce the chance of false negatives, as Learn advises for fine-grained exceptions."
  - "Analytics rule settings control volume: event grouping, alert threshold, suppression of up to 24 hours and incident grouping with a cap of 150 alerts per incident."
  - "Classifying alerts as false positive in Defender XDR helps improve its detection quality. Classifying before tuning is this article's suggested order, not a Learn requirement."
faq:
  - q: "What is the difference between alert tuning and classifying an alert as false positive?"
    a: "Microsoft Learn describes classification as a manual status and classification set on an alert, which helps improve Defender XDR detection quality. Alert tuning creates a rule that automatically hides or resolves matching alerts, or sets them as behaviors. Tuning should be used with caution for known, internal applications and security tests."
  - q: "What can a Defender XDR alert tuning rule match on?"
    a: "According to Microsoft Learn, conditions are based on evidence types such as files, processes and scheduled tasks. Several conditions can be combined with AND, OR and grouping. Condition values are not case sensitive and some properties support wildcards. The pages read state no maximum number of conditions."
  - q: "How long does a Sentinel automation rule exception last?"
    a: "Microsoft Learn says the rule created from an incident expires automatically after 24 hours by default, which reduces the chance of false negatives. To keep the exception longer, set Rule expiration to a later time."
  - q: "Where should long-term exceptions live in Sentinel?"
    a: "Learn recommends placing exceptions in the analytics rule query and, when possible, referencing a watchlist. Analysts can then add exceptions without editing the rule, and one watchlist can serve several rules."
  - q: "Do Sentinel alert grouping settings behave the same in the Defender portal?"
    a: "Not fully. Microsoft Learn says that with Defender portal onboarding, grouping settings act as initial instructions and the Defender correlation engine may group alerts differently. The Re-open closed matching incidents option is not available there."
---

An alert storm usually has one of three causes: a rule that matches normal behavior, a rule that creates one alert per event, or incidents that are not grouped. Microsoft documents a different tool for each. Defender XDR has alert tuning and classification. Microsoft Sentinel has automation rules, analytics rule changes and incident grouping. The safest order is to classify first, then tune narrowly, then change the rule logic.

## Step 1: Find out why the alerts fire

Microsoft Learn names common causes of Sentinel false positives:

- Normal activity by certain users, usually service principals, looks suspicious.
- Intentional security scanning from known IP addresses is detected as malicious.
- A rule that excludes private IP addresses should also exclude some internal addresses that are not private.

Check one alert in detail and decide whether the cause is a user, an application, an IP range or a scanner. That decides which exception type fits.

## Step 2: Classify the alerts in Defender XDR

On the alert page, select **Manage alert** in the summary details. Set the status to **Resolved** and the classification to one of:

- **True positive** (with a threat type)
- **Informational, expected activity** (with an activity type)
- **False positive**

Learn says classifying alerts as false positive helps Defender XDR improve its detection quality. To handle a whole group, select **View similar alerts** in the **INSIGHT** box and classify them together.

## Step 3: Use alert tuning for known, expected activity

Alert tuning was previously called alert suppression. Create a rule under **Settings** > **Microsoft Defender XDR** > **Alert tuning** > **Add new rule**. Select the service sources, add conditions, pick an action, name the rule and save. A rule can also be started from an alert with **Tune alert**.

| Action | Effect |
|---|---|
| **Hide alert** | Suppresses the alert and prevents incident creation. Applies only to Defender for Endpoint alerts. Hidden alerts remain in AlertInfo and AlertEvidence. |
| **Resolve alert** | Resolves the alert and its related incidents automatically. |
| **Set as behavior** | Converts matching signals into behaviors that do not appear in the queue or trigger incidents. Not supported for Defender for Cloud or Defender for Office 365 alerts. |

Learn's caution is clear: use alert tuning only where known internal business applications or security tests trigger expected activity.

Two details matter for current tenants. Defender includes built-in alert tuning rules that suppress common benign noise. They are listed in the same **Alert tuning** area and Learn advises reviewing them. They do not apply to alerts from custom detection rules or custom TI. Learn also notes that alert suppression is not compatible with custom detections, so those need to be fine-tuned in the detection itself. The pages read do not document a maximum number of conditions per rule.

## Step 4: Create a Sentinel automation rule for a time-limited exception

Learn describes this procedure for the Azure portal only. With Sentinel onboarded to the Defender portal, rules must be built from scratch based on incident details.

1. Under **Incidents**, select the incident and choose **Actions** > **Create automation rule**.
2. Rename the rule so it describes the exception.
3. Under **Conditions**, add more analytics rule names if the exception should cover them. Adjust entity conditions, for example from one IP address to a subnet.
4. Keep the **close incident** action, set the closing reason and add a comment.
5. Check **Rule expiration**. It defaults to 24 hours.
6. Select **Apply**.

This method keeps an audit trail and works across several analytics rules. It is meant for analyst-driven, temporary exceptions such as maintenance windows.

## Step 5: Change the analytics rule for permanent exceptions

For lasting exceptions, Learn prefers changes in the rule query, referenced from a watchlist. Examples from the page:

```kusto
let allowlist = (_GetWatchlist('ipallowlist') | project IPAddress);
SigninLogs
| where TimeGenerated >= ago(1d)
| where IPAddress !in (allowlist)
```

Combining attributes is more precise than excluding them independently. The page contrasts two forms. Two separate `where` lines exclude alerts that match either value. A single line with `and` excludes only alerts where both values appear together. For subnets, Learn shows `ipv4_lookup` with `where isempty(network)`. The operator only enriches. The `isempty` filter does the exclusion.

Learn says combining attributes reduces the chance of false negatives. That a broad exception, such as a whole subnet, raises that risk and that the narrowest working scope is best is this article's own inference.

## Step 6: Tune the volume settings of the rule

The analytics rule wizard contains settings that shape alert volume:

- **Run query every** and **Lookup data from the last**: 5 minutes to 14 days. The lookback must be at least as long as the interval.
- **Alert threshold**: alert only when results exceed a number. Enter 0 for no threshold.
- **Event grouping**: **Group all events into a single alert** (default) or **Trigger an alert for each event**. The second option can produce storms.
- **Suppression**: **Stop running query after alert is generated** for up to 24 hours.
- **Alert grouping**: group alerts into incidents when all entities match (recommended), or by selected entities and details. Up to 150 alerts can be grouped into a single incident. Excess alerts go into a new incident.

In the Defender portal, keep **Create incidents from alerts triggered by this analytics rule** enabled. Grouping settings act only as initial instructions there, and **Re-open closed matching incidents** is not available. Learn also says alert-trigger playbooks under **Alert automation (classic)** can no longer be added and that existing ones were deprecated effective March 2026. Migrate them to automation rules.

## Typical mistakes (own reading of the pages above)

- Creating a broad suppression rule before classifying a sample of alerts.
- Letting a 24-hour automation rule expire without moving the exception into a watchlist.
- Excluding a whole subnet when a single scanner IP is the cause.
- Expecting an alert tuning rule to quiet a custom detection rule, which Learn says is not compatible.

## Related

- [Microsoft Sentinel](https://www.m365.fm/entity/microsoft-sentinel/)
- [Microsoft Defender](https://www.m365.fm/entity/defender/)
- [Microsoft Defender for Endpoint](https://www.m365.fm/entity/microsoft-defender-for-endpoint/)
- [Threat analytics](https://www.m365.fm/entity/threat-analytics/)

## Sources

- [Handle false positives in Microsoft Sentinel (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/sentinel/false-positives)
- [Investigate alerts in Microsoft Defender XDR (Microsoft Learn)](https://learn.microsoft.com/en-us/defender-xdr/investigate-alerts)
- [Create scheduled analytics rules in Microsoft Sentinel (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/sentinel/create-analytics-rules)
