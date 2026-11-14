---
title: "Defender Antivirus Causes High CPU: Use Performance Analyzer to Find the Scan Source"
summary: "Use the Microsoft Defender Antivirus performance analyzer to find files, extensions and processes that slow scans: requirements, New-MpPerformanceRecording, Get-MpPerformanceReport, SkipReason, CSV and JSON export, and gaps on exclusions and CPU settings."
status: review
publish: false
author: mirko-p
date: 2027-01-10
topics: [microsoft-defender-for-endpoint]
keypoints:
  - "The performance analyzer is a PowerShell tool that identifies files, extensions and processes that slow antivirus scans on one endpoint. It applies to Defender for Endpoint Plan 1 and Plan 2."
  - "It needs platform version 4.18.2108.7 or later. Record with New-MpPerformanceRecording in an elevated PowerShell window while you reproduce the slowdown."
  - "Analyze the .etl file with Get-MpPerformanceReport, for example with -TopFiles and -TopScansPerFile."
  - "The SkipReason column, from version 4.18.2206.X, shows Not Skipped, Optimization or User skipped."
  - "The page does not cover exclusions guidance, scan settings or CPU throttling. It describes the data as support for remediation without detailing actions."
faq:
  - q: "What does the performance analyzer do?"
    a: "It is a PowerShell tool that helps identify files, file extensions and processes that cause performance problems during Microsoft Defender Antivirus scans on an individual endpoint."
  - q: "What do I need to run it?"
    a: "Microsoft Defender Antivirus platform version 4.18.2108.7 or later, Windows 10, Windows 11 or Windows Server 2016 and later, and PowerShell opened as administrator. Windows Server 2012 R2 needs the Windows ADK and the modern unified solution."
  - q: "How do I record a trace?"
    a: "Run New-MpPerformanceRecording -RecordTo with a full path to an .etl file, reproduce the slow scenario, then press Enter to stop and save or Ctrl+C to cancel."
  - q: "How do I read the result?"
    a: "Run Get-MpPerformanceReport with -Path to the recording. The page example uses -TopFiles 3 -TopScansPerFile 10 to list the top ten scans for each of the top three files."
  - q: "What if the recorder is already running?"
    a: "The page shows the command wpr -cancel -instancename MSFT_MpPerformanceRecording to cancel the existing recording."
---

When Microsoft Defender Antivirus uses a lot of CPU, the first question is which files, extensions or processes trigger the scans. The performance analyzer answers it with a recording and a report. This guide follows the Microsoft Learn page on tuning Defender Antivirus performance. The page applies to Microsoft Defender for Endpoint Plan 1 and Plan 2.

## What it is

The performance analyzer is a PowerShell tool. It helps identify files, file extensions and processes that cause performance problems during antivirus scans on an individual endpoint.

## Requirements

- Microsoft Defender Antivirus platform version 4.18.2108.7 or later.
- Windows 10, Windows 11 and Windows Server 2016 and later.
- PowerShell 5.1 or PowerShell ISE. Remote PowerShell and PowerShell 7.x need 4.18.2201.10 or later.
- Windows Server 2012 R2 needs the Windows Assessment and Deployment Kit with the Windows Performance Toolkit, and must be onboarded through the modern unified solution.

## Record

1. Open PowerShell as administrator.
2. Start the recording:

```powershell
New-MpPerformanceRecording -RecordTo <recording.etl>
```

3. Reproduce the slow scenario.
4. Press **Enter** to stop and save, or **Ctrl+C** to cancel.

`-RecordTo` is the full path of the trace file. The recording captures Microsoft-Antimalware-Engine events.

If you see that Windows Performance Recorder is already recording, cancel it:

```powershell
wpr -cancel -instancename MSFT_MpPerformanceRecording
```

## Analyze

```powershell
Get-MpPerformanceReport -Path <recording.etl> -TopFiles 3 -TopScansPerFile 10
```

The page says this returns the top ten scans for each of the top three files that affect performance. Available views include top paths, files, processes and extensions, and combinations such as top scans per file per process. The data includes scan count, duration (total, minimum, average, maximum and median), path, process and reason for the scan.

## SkipReason

From Defender version 4.18.2206.X the report has a SkipReason column:

- **Not Skipped**
- **Optimization**, typically performance-related.
- **User skipped**, typically user-set exclusions.

## Export

```powershell
(Get-MpPerformanceReport -Path .\Repro-Install.etl -Topscans 1000).TopScans | Export-CSV -Path .\Repro-Install-Scans.csv -Encoding UTF8 -NoTypeInformation
```

The page also shows conversion to CSV output with ConvertTo-Csv for the top 100 scans and to JSON with a depth of one level for the top 1000. It recommends the -Raw parameter for machine-readable output and gives no example. The page writes the parameter as -TopScansPerFile in one example and -Topscans in others, so check the cmdlet reference before scripting.

## What the page does not say

- Exclusions guidance. It mentions only that SkipReason can show user-set exclusions.
- Scan settings and CPU throttling.
- Which remediation actions to take. It says only that the data supports remediation.
- A full parameter list. It links to the cmdlet documentation.

## A troubleshooting routine

This routine is practical advice built on the page.

1. Confirm the platform version first.
2. Record while the slowdown is happening, not afterwards.
3. Look at the top files, extensions and processes in the report.
4. Check SkipReason to see whether exclusions already apply.
5. Decide on changes using the separate exclusion and tuning documentation.

## Typical mistakes

- Recording without reproducing the slow scenario.
- Using a relative or short path for the .etl file.
- Forgetting to open PowerShell as administrator.
- Adding exclusions before you know the scan source.

## Quick reference

| Task | Command or setting | Detail from the page |
| --- | --- | --- |
| Record | New-MpPerformanceRecording -RecordTo | Full path to an .etl file, run as administrator |
| Stop and save | Enter | Ctrl+C cancels |
| Cancel a stuck recorder | wpr -cancel -instancename MSFT_MpPerformanceRecording | Use when WPR is already recording |
| Report | Get-MpPerformanceReport -Path | Top files, extensions, processes and paths |
| Export | Export-CSV or ConvertTo-Json | CSV for 1000 scans, JSON with depth 1 |
| Minimum platform | 4.18.2108.7 | Remote PowerShell and PowerShell 7 need 4.18.2201.10 |

## What the report columns tell you

Each row shows how often a path, file, process or extension was scanned and how long the scans took. The page lists total, minimum, average, maximum and median duration, plus the path, the process and the reason for the scan. A file with a high total duration, or a process that triggers many scans, is the first thing to look at. The combined views, such as top scans per file per process, help when one file is scanned by several processes.

## Related

- [Microsoft Defender for Endpoint](https://www.m365.fm/entity/microsoft-defender-for-endpoint/)
- [Microsoft Defender](https://www.m365.fm/entity/defender/)
- [Microsoft Intune](https://www.m365.fm/entity/intune/)

## Sources

- [Performance analyzer for Microsoft Defender Antivirus (Microsoft Learn)](https://learn.microsoft.com/defender-endpoint/tune-performance-defender-antivirus)
