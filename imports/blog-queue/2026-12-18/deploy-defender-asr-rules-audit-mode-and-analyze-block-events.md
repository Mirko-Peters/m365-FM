---
title: "Deploy Defender ASR Rules in Audit Mode and Analyze Block and Audit Events"
summary: "How to roll out attack surface reduction rules safely: set audit mode with Intune or PowerShell, read the ASR rules report, advanced hunting and Event Viewer, add exclusions and move to block or warn, based on Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2026-12-18
topics: [attack-surface-reduction-rules, intune, microsoft-defender-for-endpoint, advanced-hunting]
keypoints:
  - "Learn recommends enabling all ASR rules in Audit mode on a small pilot ring first, then reviewing the data before Block or Warn."
  - "Standard protection rules can typically go straight to Block or Warn. Test the other rules in Audit mode."
  - "Review audit data in the ASR rules report under Reports > Endpoints, in advanced hunting with ActionType starting with Asr, or in Event Viewer with event ID 1122."
  - "Rule modes use the values 0 off, 1 block, 2 audit, 5 not configured and 6 warn."
  - "Excluded files run without any report or event, so use per-rule exclusions and prefer them to turning a rule off."
faq:
  - q: "How do I turn on ASR rules in audit mode?"
    a: "According to Microsoft Learn, the recommended method is Intune. Go to Endpoint security, then Attack surface reduction, select Create policy, choose the Windows platform and the Attack Surface Reduction Rules profile, and set each rule to Audit. Group Policy, Configuration Manager, MDM and PowerShell also work, and the deployment method does not affect the reporting data."
  - q: "Where do I see what audit mode would have blocked?"
    a: "Microsoft Learn lists the ASR rules report in the Microsoft Defender portal, the device timeline, advanced hunting and Windows Event Viewer. Event ID 1122 in Microsoft-Windows-Windows Defender Operational marks rules in Audit mode. The first three need Defender for Endpoint Plan 2 or Defender for Business, except the report, which Learn also lists for Plan 1."
  - q: "How do I query ASR events in advanced hunting?"
    a: "Microsoft Learn shows a query on the DeviceEvents table that filters ActionType with startswith 'Asr' and reads AdditionalFields for IsAudit and RuleId. Each rule has its own action types, such as AsrOfficeChildProcessAudited and AsrOfficeChildProcessBlocked."
  - q: "Should I exclude files or turn the rule off when it causes false positives?"
    a: "Microsoft Learn says rule exclusions are better than turning off rules or switching them back to Audit mode, and that Warn mode can limit disruption without disabling a rule. It also warns that excluded files are allowed to run and that no report or event is recorded for them."
  - q: "Which rules do not support warn mode?"
    a: "Microsoft Learn marks two: Block credential stealing from the Windows local security authority subsystem, and Block Office applications from injecting code into other processes. Warn mode is supported by most other rules."
---

The safe path for ASR rules is the one Microsoft Learn describes: turn the rules on in Audit mode for a small ring of devices, read what they would have blocked, add exclusions for legitimate software, and only then move to Block or Warn. Audit mode does not affect users, but it writes events you can analyze in several places.

## Step 1: Prepare the pilot

Before testing, disable any ASR rules that are currently in Block or Warn mode, and use the ASR rules report to find them. Start with ring 1, a small pilot group of devices or ASR rule champions. Learn says standard protection rules can typically be enabled in Block or Warn mode without testing, and the other rules should be tested in Audit mode first.

The rule modes use these values in Intune, Group Policy and MDM:

| Mode | Value |
|---|---|
| Off | 0 |
| Block | 1 |
| Audit | 2 |
| Not configured | 5 |
| Warn | 6 |

## Step 2: Set audit mode

### Intune (recommended)

1. In the Intune admin center, open **Endpoint security** and select **Attack surface reduction**.
2. Select **Create policy**, platform **Windows**, profile **Attack Surface Reduction Rules**.
3. Set each rule to **Audit**.
4. Assign the policy to Microsoft Entra device groups. Learn says Defender for Endpoint management supports device objects only, so user targeting is not supported.

### PowerShell

```powershell
Set-MpPreference -AttackSurfaceReductionRules_Ids <RuleGUID1>,<RuleGUID2> -AttackSurfaceReductionRules_Actions AuditMode,AuditMode
```

Learn notes that `Set-MpPreference` overwrites the existing rule list. Local settings have the lowest precedence, and any policy-based method overwrites them at startup.

### Avoid conflicts

Do not configure the same rules in both Group Policy and MDM. When both set a rule, Group Policy wins by default unless `MDMWinsOverGP` is set to 1. Learn also mentions controlled configuration, which enforces Intune or Defender security settings management and ignores conflicting Group Policy, Configuration Manager and local settings.

## Step 3: Analyze the events

Learn lists four review methods:

| Method | Needs |
|---|---|
| ASR rules report in the Defender portal | Defender for Endpoint Plan 1 or 2, or Defender for Business |
| Device timeline | Plan 2 or Defender for Business |
| Advanced hunting | Plan 2 |
| Windows Event Viewer | Any plan |

### ASR rules report

In the Microsoft Defender portal go to **Reports** > **Endpoints** > **Attack surface reduction rules**. The **Detections** tab defaults to Standard protection rules and the last 30 days. Change the rules filter to **All** to see every rule. It shows audit detections and blocked detections, with columns for detected file, rule, source app, device and user. The table lists up to 200 rows, so use **Export** for the rest. The **Configuration** tab shows which devices have rules off, in audit, warn or block mode. The **Add exclusions** tab shows the expected impact of an exclusion.

### Advanced hunting

Learn gives this pattern for one file:

```kql
DeviceEvents
| where Timestamp >= ago(1d)
| where FileName == 'svchost.exe'
| where ActionType startswith 'Asr'
| extend ParsedFields=parse_json(AdditionalFields)
| distinct ActionType, Audit=tostring(ParsedFields.IsAudit), InitiatingProcessFileName, InitiatingProcessCommandLine, FolderPath, FileName, ProcessCommandLine, ASRRuleId=tostring(ParsedFields.RuleId)
| take 1000
```

Each rule has paired action types, for example `AsrOfficeChildProcessAudited` and `AsrOfficeChildProcessBlocked`. The warn-capable rules can also show a bypass action type.

### Event Viewer

Open **Applications and Services Logs** > **Microsoft** > **Windows** > **Windows Defender** > **Operational** and look for event ID 1122 for rules in Audit mode. Learn suggests Windows Event Forwarding to centralize the events. This works on any plan.

### Estimate the impact

With Plan 2, Defender Vulnerability Management recommendations under **Exposure management** > **Recommendations** show a user impact percentage on the Devices tab, the share of devices that can accept a block-mode policy without hurting productivity.

## Step 4: Add exclusions

Learn warns that excluded files are allowed to run, and no report or event is recorded for them. Use the same method as for the rules. In Intune, an **ASR only per rule exclusions** section appears after you set a rule to Audit, Block or Warn. Global exclusions use paths such as `"C:\folder"`. In Group Policy, per-rule exclusions use the rule GUID as the value name. Quotation marks and extra spaces are not supported in ASR values in Group Policy. If **Disable admin merge** is true, per-rule or local exclusions do not apply.

The report's flyout can open Intune to add an exclusion and can generate `AsrExclusionPaths.csv` with the file paths.

## Step 5: Move to warn or block

Learn says to review the audit data before enabling Block or Warn, and that Warn mode limits disruption without disabling a rule. Most rules support Warn. The rule for credential stealing from LSASS and the rule for Office code injection do not.

Some rules have extra requirements. Three need cloud-delivered protection: executables that do not meet prevalence, age or trusted list criteria, potentially obfuscated scripts, and advanced ransomware protection. For several rules, EDR alerts appear only at certain cloud protection levels. Learn gives High plus or Zero tolerance for alerts and High or above for user notifications.

## Typical mistakes

- Leaving old Block or Warn rules in place during the audit test.
- Targeting a user group in Intune.
- Setting the same rule in Group Policy and in MDM.
- Judging audit data from a short window that misses month-end work.
- Excluding broad folders instead of a specific process.

## What the sources do not say

The pages read give no fixed audit period. They do not describe the block event ID, and the report page did not include Event Viewer details. Verify event IDs for Block and Warn in the ASR reference before building alerts.

## Related

- [Attack surface reduction rules](https://www.m365.fm/entity/attack-surface-reduction-rules/)
- [Intune](https://www.m365.fm/entity/intune/)
- [Microsoft Defender for Endpoint](https://www.m365.fm/entity/microsoft-defender-for-endpoint/)
- [Advanced hunting](https://www.m365.fm/entity/advanced-hunting/)

## Sources

- [Test attack surface reduction rules](https://learn.microsoft.com/en-us/defender-endpoint/attack-surface-reduction-rules-deployment-test)
- [Enable attack surface reduction rules](https://learn.microsoft.com/en-us/defender-endpoint/enable-attack-surface-reduction)
- [ASR rules report in the Microsoft Defender portal](https://learn.microsoft.com/en-us/defender-endpoint/attack-surface-reduction-rules-report)
- [Attack surface reduction rules reference](https://learn.microsoft.com/en-us/defender-endpoint/attack-surface-reduction-rules-reference)
