---
title: "Sentinel Built-In Windows Rules Never Fire on Forwarded Events: WindowsEvent vs SecurityEvent"
summary: "Forwarded Windows events reach Microsoft Sentinel, yet the built-in Windows Security Events rules stay silent. The cause is the table: forwarded events land in WindowsEvent, the rules read SecurityEvent."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [microsoft-sentinel, kql, security-information-and-event-management]
keypoints:
  - "Microsoft Learn says events collected through Windows Event Forwarding go to the WindowsEvent table, not to SecurityEvent, even when they come from the Security log."
  - "Many built-in Windows Security Events rules, including some near-real-time rules, query SecurityEvent only, so they cannot match data that sits only in WindowsEvent."
  - "Learn offers two fixes: use the Windows Security Events via AMA connector, or adapt the rule queries to WindowsEvent or supported ASIM parsers."
  - "Routing forwarded events into SecurityEvent with a DCR transformation was described by Microsoft staff in a 2026 thread, but no official documentation was found for it."
faq:
  - q: "Why do my forwarded 4732 and 1102 events not trigger any Sentinel rule?"
    a: "In the July 2026 thread behind this article, the events arrived in the WindowsEvent table, while the built-in near-real-time rules from the Content Hub query SecurityEvent. A rule only evaluates the tables named in its KQL, so it never sees the forwarded data. Microsoft Learn describes the same table split and warns about it."
  - q: "Should I switch to the Windows Security Events via AMA connector?"
    a: "Learn names it as the way to use the built-in rules without changes. It requires Azure Arc on systems that are not Azure virtual machines, installed before you enable the connector. Check whether it fits your design, because your forwarding setup was probably chosen for a reason."
  - q: "Can I just copy the built-in rule and change the table name?"
    a: "Learn says you can adapt the rule queries to WindowsEvent. Community replies add that the schemas differ, so field extraction and entity mapping must be rewritten and tested. Changing only the table name will usually not be enough."
  - q: "Is it safe to ingest the same events through both connectors?"
    a: "Learn does not discuss this. A community reply warned that enabling both paths can create duplicate ingestion and duplicate alerts. Plan the split so each event type reaches only one table."
---

The Windows Event Collector works. Events 1102 and 4732 show up in Microsoft Sentinel. You turn on the built-in near-real-time rules for those events, create a test event, and nothing happens. No alert, no incident.

This exact case was described in a Microsoft Community Hub thread from July 2026. The setup had Windows Event Forwarding to a collector, Azure Arc, the Azure Monitor Agent, and the Windows Forwarded Events connector. The thread did not end with a marked solution. But the cause is documented on Microsoft Learn, and the replies agree with it. This article is a troubleshooting guide, not an official Microsoft procedure.

## Symptoms

- The events appear when you query the `WindowsEvent` table.
- A query on `SecurityEvent` for the same event IDs returns nothing for those machines.
- Rules from the Windows Security Events solution in the Content Hub are enabled, but they never raise alerts for those machines.

## Why it happens

Microsoft Learn explains this on the page about [Windows agent-based connectors](https://learn.microsoft.com/en-us/azure/sentinel/connect-services-windows-based), updated in August 2026. Events collected through Windows Event Forwarding go into the `WindowsEvent` table. That includes events forwarded from the Windows Security log. They are not written to `SecurityEvent`.

Learn also warns that many built-in Windows Security Events rules, including some near-real-time rules, query `SecurityEvent` and do not match data stored only in `WindowsEvent`. A second Learn page, on [Windows security event sets](https://learn.microsoft.com/en-us/azure/sentinel/windows-security-event-id-reference), repeats this: if forwarded events do not trigger a built-in rule, check which table the rule queries.

In the thread, an MCT and another community member gave the same explanation. A rule only evaluates the tables its KQL names.

## Step 1: Prove the table split

In **Logs**, run both queries with the same event ID and time range:

```kql
WindowsEvent
| where EventID == 4732
| take 10
```

```kql
SecurityEvent
| where EventID == 4732
| take 10
```

If the first returns rows and the second does not, you have the case described here. If both are empty, the problem is the collection, not the rules.

## Step 2: Read the rule you expected to fire

In the Defender portal, expand **Microsoft Sentinel**, then **Configuration**, and select **Analytics**. Learn's steps for [creating a rule from a template](https://learn.microsoft.com/en-us/azure/sentinel/create-analytics-rule-from-template) use the **Rule templates** tab, and active rules appear under **Active rules**. In the Azure portal, the same page is under the **Configuration** menu of Microsoft Sentinel. Learn notes that after March 31, 2027, Microsoft Sentinel will be available only in the Defender portal.

Open the rule and read its query. If it starts from `SecurityEvent`, you have found the reason.

## Step 3: Choose one of the options

**Option A: collect the Security channel with the AMA connector.** Learn says to use the Windows Security Events via AMA connector if you need those rules without modification. It also states that, for systems that are not Azure virtual machines, Azure Arc must be installed and enabled before you enable the AMA-based connector. This option changes your collection design, so check it against why you chose forwarding in the first place.

**Option B: adapt the rule.** Learn says to adapt the rule queries to use `WindowsEvent` or supported ASIM parsers. In the thread, a community member listed the practical work:

1. Run a query on `WindowsEvent` to see which fields the events carry for the IDs you need.
2. Copy the rule, so the original template stays as it was.
3. Change the table, add a filter on the channel after checking its real value, and rewrite the field extraction, because the schemas differ.
4. Rebuild the entity mapping from the new fields.
5. If you use an ASIM parser, test it before you rely on it.

Learn's page on [ASIM](https://learn.microsoft.com/en-us/azure/sentinel/normalization) says you can write analytics rules with ASIM, but I found no Windows-specific parser name on it, so I name none here. The thread's replies also did not give the field names. Look at the `EventData` column in your own results.

If the rule is a near-real-time rule, remember the limits on the [NRT rules page](https://learn.microsoft.com/en-us/azure/sentinel/near-real-time-rules): at most 50 rules per customer, queries run once per minute, and up to 30 single-event alerts per run. Learn also says an NRT query may reference more than one table. In theory this allows one rule to read both tables in a mixed estate. I did not test that.

For new detections, the NRT page also says Microsoft recommends Custom detections in Defender XDR. Check whether that fits your data before you build more rules on the Sentinel side.

**Option C: change the data collection rule so the events go to `SecurityEvent`.** A Microsoft staff member said in the thread that they had seen this approach used but found no official documentation for it. The reply named two schema changes: rename `Provider` to `EventSourceName`, and convert `EventData` from dynamic to string. Treat this as unsupported until you confirm it with Microsoft. A support case is the right place for that question.

**Option D: split the collection.** One commenter described a proof of concept: the forwarding connector collects non-security events into `WindowsEvent`, and a Security Events via AMA rule collects the Security channel from the forwarded events into `SecurityEvent`. They reported it seemed to work. A Microsoft reply asked whether anyone had run it in production, and nobody in the thread had. Learn does not describe this design.

## Step 4: Avoid duplicates

Learn does not discuss running both connectors for the same events. A community reply advised against enabling both paths for the same data, to avoid duplicate ingestion and duplicate alerts. Before you add a second path, list which event IDs go where and exclude them from the other path.

## Step 5: Test the fix

1. Create a harmless test event on a pilot server, for example a membership change that produces event 4732 in a test group.
2. Check that the event is in the table your rule queries.
3. Wait. NRT rules run every minute and, per Learn, with a two-minute delay. Scheduled rules follow their own schedule.
4. Look in **Incidents** for the alert, and in **Active rules** for the rule state.

If a rule is later shown with **AUTO DISABLED** at the start of its name, Learn's [analytics rule troubleshooting page](https://learn.microsoft.com/en-us/azure/sentinel/troubleshoot-analytics-rules) says Sentinel does this after repeated permanent failures, for example a deleted table or an invalid function, and adds the reason to the rule description. Fix that cause before you re-enable the rule.

## What remains open

- The thread had no accepted answer and no confirmation from the poster.
- Option C and Option D are not covered by Learn. Both rest on single replies.
- Which table future built-in templates will use for forwarded events is not stated in the sources I read.

## Related

- [Microsoft Sentinel](https://www.m365.fm/entity/microsoft-sentinel/)
- [KQL](https://www.m365.fm/entity/kql/)
- [Security information and event management](https://www.m365.fm/entity/security-information-and-event-management/)

## Sources

- [Microsoft Learn: Connect Microsoft Sentinel with a Windows agent-based data connector](https://learn.microsoft.com/en-us/azure/sentinel/connect-services-windows-based)
- [Microsoft Learn: Windows security event sets that can be sent to Microsoft Sentinel](https://learn.microsoft.com/en-us/azure/sentinel/windows-security-event-id-reference)
- [Microsoft Learn: Create a rule from a template](https://learn.microsoft.com/en-us/azure/sentinel/create-analytics-rule-from-template)
- [Microsoft Learn: Near-real-time analytics rules](https://learn.microsoft.com/en-us/azure/sentinel/near-real-time-rules)
- [Microsoft Learn: Create NRT rules](https://learn.microsoft.com/en-us/azure/sentinel/create-nrt-rules)
- [Microsoft Learn: Advanced Security Information Model (ASIM)](https://learn.microsoft.com/en-us/azure/sentinel/normalization)
- [Microsoft Learn: Troubleshoot analytics rules](https://learn.microsoft.com/en-us/azure/sentinel/troubleshoot-analytics-rules)
- [Microsoft Community Hub: Windows Forwarded Events connector with Windows Security Events NRT rules (July 2026)](https://techcommunity.microsoft.com/discussions/microsoftsentinel/windows-forwarded-events-connector-with-windows-security-events-nrt-rules/4540749)
