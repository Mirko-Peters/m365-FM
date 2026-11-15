---
title: "How to Search the Audit Log With PowerShell and Export Large Result Sets"
summary: "How the Microsoft Learn sample script uses Search-UnifiedAuditLog to pull audit records in time slices and export them to CSV: prerequisites, the seven variables, the 5,000 and 50,000 limits, what to change on errors, and how to format the AuditData column in Excel."
status: review
publish: false
author: mirko-p
date: 2027-01-24
topics: [microsoft-purview-audit, exchange-online-powershell, powershell, power-query]
keypoints:
  - "Learn names three ways to get audit logs: the Office 365 Management Activity API, the audit log search tool in the Purview portal, and Search-UnifiedAuditLog."
  - "The sample script retrieves 50,000 audit records per cmdlet run and exports them to a CSV file. It slices the date range into intervals to avoid timeouts."
  - "Before you run it, check UnifiedAuditLogIngestionEnabled and make sure you have the View-Only Audit Logs or Audit Logs role in Exchange Online."
  - "Keep resultSize at 5000. If you see the error maximum results limitation reached, reduce intervalMinutes to 30 or 15 and rerun."
  - "If a run returns 50,000 results, records are likely missing. Split the date range into smaller periods and run each one."
faq:
  - q: "When should I use the script and not the Purview portal?"
    a: "Learn says the portal search is good for quickly finding records of specific operations in shorter time ranges. For manual retrieval for a specific investigation, especially over longer ranges in larger organizations, Search-UnifiedAuditLog might be the best option. For regular retrieval of millions of records, it suggests a solution based on the Office 365 Management Activity API."
  - q: "What do I need before I run the script?"
    a: "Audit logging must be enabled. Check with Get-AdminAuditLogConfig piped to FL UnifiedAuditLogIngestionEnabled, where True means it is on. You need the View-Only Audit Logs or Audit Logs role in Exchange Online, assigned by default to the Compliance Management and Organization Management role groups. Connect to Exchange Online PowerShell first."
  - q: "What do the intervalMinutes and resultSize variables do?"
    a: "resultSize is the number of results per cmdlet call, and 5,000 is the maximum the cmdlet supports, so leave it. intervalMinutes slices the date range so each interval, not the whole range, is subject to the 5,000 record limit. The default is 60 minutes. If you get a maximum results limitation reached error, use 30 or even 15 minutes."
  - q: "The script returned exactly 50,000 records. Is that everything?"
    a: "Probably not. Learn says there is a 50,000 limit for records returned each time you run the cmdlet in the script, and that records for activities in the date range likely were not included. Divide the range into smaller durations and run the script for each. Its example splits a 90-day range into two 45-day runs."
  - q: "Is the script supported by Microsoft?"
    a: "No. Learn says the sample script is not supported under any Microsoft standard support program or service and is provided as is without warranty. Test it before you rely on it."
---

For a specific investigation, the audit log search in the Microsoft Purview portal can return too much to handle, especially over a long date range in a large organization. The Microsoft Learn page on searching the audit log with a PowerShell script gives a sample that works around the limits of `Search-UnifiedAuditLog` by slicing the range into short intervals and exporting everything to a CSV file. This article explains how the script works, what to change, and how to handle the limits.

## Choose the right tool first

Learn lists three ways to retrieve audit logs:

- The Office 365 Management Activity API.
- The audit log search tool in the Microsoft Purview portal.
- The `Search-UnifiedAuditLog` cmdlet in Exchange Online PowerShell.

The page's guidance on which to use:

| Need | Suggested tool |
| --- | --- |
| Regular retrieval, large organizations, millions of records on an ongoing basis | A solution that uses the Office 365 Management Activity API |
| Quickly find records for specific operations in a shorter time range | Audit log search tool in the Purview portal |
| Manual retrieval for a specific investigation or incident, especially a longer date range in a larger organization | `Search-UnifiedAuditLog`, for example with the sample script |

The script retrieves 50,000 audit records each time you run the cmdlet and exports them to a CSV file. Learn says it also minimizes the chance that large searches time out in the service.

## Before you run it

1. **Audit logging must be on.** It is on by default for Microsoft 365 and Office 365 enterprise organizations. To verify, run this in Exchange Online PowerShell:

   ```powershell
   Get-AdminAuditLogConfig | FL UnifiedAuditLogIngestionEnabled
   ```

   `True` means audit log search is turned on.
2. **You need a role.** *View-Only Audit Logs* or *Audit Logs* in Exchange Online. By default they are assigned to the *Compliance Management* and *Organization Management* role groups.
3. **Expect a long run.** The time depends on the date range and the interval. Larger ranges and smaller intervals take longer.
4. **No support.** The sample is not supported under any Microsoft standard support program and is provided as is.

## Step 1: Connect

Connect to Exchange Online PowerShell with modern authentication or MFA. Learn links its page on connecting to Exchange Online PowerShell.

## Step 2: Configure and run the script

Save the script from the Learn page as a .ps1 file, for example SearchAuditLog.ps1. I do not copy the whole script here. Copy it from the page, since it is long and you should get it from the source. The page gives two versions. The second uses the `moreRecordsAvailable` value instead of the result count to decide when an interval is complete. Both do the same job:

- Loop over the date range in slices of `$intervalMinutes`.
- For each slice create a session ID and call `Search-UnifiedAuditLog` with `-SessionCommand ReturnLargeSet` and `-ResultSize $resultSize`, repeatedly, until the slice is complete.
- Append each batch to the CSV with `Export-Csv`, and write progress to a log file.

The first seven lines hold the variables to change:

| Variable | Sample value | Meaning |
| --- | --- | --- |
| `$logFile` | d:\AuditLogSearch\AuditLogSearchLog.txt | Progress log, with UTC timestamps |
| `$outputFile` | d:\AuditLogSearch\AuditLogRecords.csv | CSV that receives the records |
| `$start` and `$end` | Previous 24 hours | Date range. Without a time, the default is midnight. Put date strings in double quotation marks, for example 2021-01-01 to 2021-01-31 |
| `$record` | AzureActiveDirectory | Record type, meaning the service or feature that triggered the activity. Use `$null` for all record types |
| `$resultSize` | 5000 | Results per cmdlet call. 5,000 is the maximum, so leave it |
| `$intervalMinutes` | 60 | Slice size, so each interval is subject to the 5,000 limit and not the whole range |

Learn says the sample values are only examples, so change them, except `$resultSize`. For the list of record types it links the Office 365 Management Activity API schema, and says you can use the name or the enum value.

Then open Windows PowerShell, go to the folder with the script and run:

```powershell
.\SearchAuditLog.ps1
```

The script shows progress while it runs. When done, it creates the log file and the CSV in the locations from `$logFile` and `$outputFile`.

## Handle the limits

- **5,000 per call.** This is the cmdlet maximum and the reason for the intervals. If the script reports `maximum results limitation reached`, lower `$intervalMinutes`, for example to 30 or even 15, and rerun. The default of 5,000 records per 60-minute interval should suit most organizations, according to the page.
- **50,000 per run.** Each time you run the cmdlet in the script, at most 50,000 records are returned. If your run returns 50,000, records for activities in the range were likely not included. Divide the range into smaller durations and run the script for each. Learn's example: a 90-day range that returns 50,000 can be run twice, 45 days each.

## Step 3: Make the CSV readable

The detail of each record is in the **AuditData** column as a JSON object. Learn suggests the Power Query JSON transform in Excel to split each property into its own column, and points to the step on formatting the exported log in Power Query Editor on its page about exporting, configuring and viewing audit log records.

## Working habits (my advice)

This is my suggestion, not guidance from the page:

- Test with a short range and one record type first, so you see the CSV shape and the run time.
- Use a new output file name for each run. The script appends to the file, so reusing a name mixes results.
- Record the start and end values and the record type next to the file, so the search can be repeated and explained later.
- If you need all record types, expect more records per interval. Start with a smaller interval. The page only says that `$null` returns all record types. The link to the interval size is my reasoning.
- Keep the CSV in a protected location, since audit data can contain sensitive details.

## Related

- [Microsoft Purview Audit](https://www.m365.fm/entity/microsoft-purview-audit/)
- [Exchange Online PowerShell](https://www.m365.fm/entity/exchange-online-powershell/)
- [PowerShell](https://www.m365.fm/entity/powershell/)
- [Power Query](https://www.m365.fm/entity/power-query/)

## Sources

- [Use a PowerShell script to search the audit log (Microsoft Learn)](https://learn.microsoft.com/purview/audit-log-search-script)
