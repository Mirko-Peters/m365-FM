---
title: "Collect MDM Diagnostics and Read Intune Policy Status on a Windows Device"
summary: "Collect MDM diagnostic logs on Windows with the Settings report, mdmdiagnosticstool or Event Viewer, then read the HTML report, XML and event logs to see what policies the device received."
status: review
publish: false
author: mirko-p
date: 2027-01-03
topics: [intune]
keypoints:
  - "The quickest method is Settings > Accounts > Access work or school > Info > Create report > Export. The report lands in C:\\Users\\Public\\Documents\\MDMDiagnostics."
  - "mdmdiagnosticstool.exe can collect named areas such as DeviceEnrollment, DeviceProvisioning and Autopilot into a zip file."
  - "MDMDiagHtmlReport.html summarizes MDM configurations and policies, and the .evtx files hold the main MDM events."
  - "In Event Viewer the Admin channel is logged by default. Enable Debug through View > Show Analytic and Debug logs for more detail."
  - "Remote collection through the DiagnosticLog CSP needs MDM server support. The page does not describe an Intune admin center workflow."
faq:
  - q: "How do I create an MDM diagnostic report quickly?"
    a: "According to Microsoft Learn, go to Settings > Accounts > Access work or school, select your work or school account and then Info, select Create report at the bottom, select Export, and open C:\\Users\\Public\\Documents\\MDMDiagnostics in File Explorer."
  - q: "Which command line collects the logs?"
    a: "Microsoft Learn gives mdmdiagnosticstool.exe with an -area value such as DeviceEnrollment;DeviceProvisioning;Autopilot and a -zip path, for example c:\\users\\public\\documents\\MDMDiagReport.zip."
  - q: "What is inside the zip file?"
    a: "For the three areas above, Learn lists Autopilot and provisioning ETL files, MDMDiagHtmlReport.html with a summary of MDM configurations and policies, MDMDiagReport.xml with detailed configuration, a registry dump, a tool log and .evtx event logs including the main MDM events."
  - q: "Where are MDM events in Event Viewer?"
    a: "Learn gives Applications and Services Logs > Microsoft > Windows > DeviceManagement-Enterprise-Diagnostic-Provider. The Admin channel is logged by default, and Debug can be enabled via View > Show Analytic and Debug logs."
  - q: "Can I collect logs remotely?"
    a: "Learn describes remote collection with the DiagnosticLog CSP for an enrolled device. It requires MDM server support, and the page does not describe how to trigger it from the Intune admin center."
---

To see what an MDM-managed Windows device has received from Intune, collect an MDM diagnostic report and read the HTML summary and the MDM event log. The simplest route is the Settings app. For repeatable collection, use the `mdmdiagnosticstool.exe` command. This guide follows the Microsoft Learn page on collecting MDM logs for Windows devices managed by an MDM server.

## Method 1: Create the report in Settings

1. Open **Settings** > **Accounts** > **Access work or school**.
2. Select your work or school account, then **Info**.
3. At the bottom of the page, select **Create report**.
4. In the window that shows the log file path, select **Export**.
5. Open `C:\Users\Public\Documents\MDMDiagnostics` in File Explorer.

The steps end with Create report and then Export.

## Method 2: Use the command line

Learn gives this form:

```
mdmdiagnosticstool.exe -area "DeviceEnrollment;DeviceProvisioning;Autopilot" -zip "c:\users\public\documents\MDMDiagReport.zip"
```

The output goes to `C:\Users\Public\Documents\MDMDiagnostics`.

## What the zip contains

For those three areas, the zip includes:

| File | Content |
| --- | --- |
| `MDMDiagHtmlReport.html` | Summary of MDM configurations and policies: management URL, MDM server device ID, certificates and policies |
| `MDMDiagReport.xml` | Detailed MDM configuration: enrollment variables, provisioning packages, multivariant conditions |
| `MdmDiagReport_RegistryDump.reg` | Dumps of common MDM registry locations |
| `MdmDiagLogMetadata.json` | The command-line arguments used |
| `MdmLogCollectorFootPrint.txt` | Tool logs from the run |
| `DiagnosticLogCSP_Collector_Autopilot_*` | Autopilot ETL files |
| `DiagnosticLogCSP_Collector_DeviceProvisioning_*` | Provisioning ETL files |
| `*.evtx` | Event logs, including the main MDM events in `microsoft-windows-devicemanagement-enterprise-diagnostics-provider-admin.evtx` |

My advice: start with the HTML report to see which policies and the management URL the device holds, then use the event logs for more detail.

## Method 3: Event Viewer on the device

1. Open Event Viewer and go to **Applications and Services Logs** > **Microsoft** > **Windows** > **DeviceManagement-Enterprise-Diagnostic-Provider**.
2. The **Admin** channel is logged by default.
3. For more detail, select **View** > **Show Analytic and Debug logs**, then right-click **Debug** and select **Enable Log**.
4. To save, right-click **Admin** or **Debug**, select **Save all events as**, choose a location and file name, select **Save**, and under **Display information for these languages** choose **English**, then **OK**.

The page itself spells the provider as Diagnostic-Provider in the Event Viewer path and Diagnostics-Provider in channel names and the filter source. Use the name your Event Viewer shows.

## Read ETL and event logs

1. Open `eventvwr.msc`.
2. Right-click **Event Viewer (Local)** and select **Open Saved Log**, then open the `.etl` file.
3. Select **Yes** to save in the new log format.
4. From **Actions**, select **Filter Current Log**.
5. Under event sources, select **DeviceManagement-EnterpriseDiagnostics-Provider** and **OK**.

Use a PC or VM whose OS build matches the build the logs came from, as Learn advises.

## Remote collection

For a device that is already enrolled, Learn describes the DiagnosticLog CSP. It needs MDM server support. The channels are the Admin and Debug channels of the Microsoft-Windows-DeviceManagement-Enterprise-Diagnostics-Provider log. You enable the Debug channel with a SyncML Replace command, export it with an Exec command and retrieve the files with the FileDownload node. The page also describes a remote ETW trace for Windows Holographic and a device state snapshot with the value `SNAP`.

I did not find in this page how to start these from the Intune admin center, so treat them as protocol-level options for MDM servers and not as an Intune click path.

## A troubleshooting routine (my advice)

1. Create the report with Method 1 on the affected device.
2. Open `MDMDiagHtmlReport.html` and check that the management URL and policies match what you expect.
3. If a policy is missing, open the Admin event log and look for events at the time of the last sync.
4. If the problem is enrollment or Autopilot, use the command with the DeviceEnrollment, DeviceProvisioning and Autopilot areas.
5. Enable the Debug channel only when the Admin log does not explain the issue, and disable it afterward to avoid unnecessary logging. Disabling is a general good practice, not a Learn statement.

## Typical mistakes (my advice)

- Looking in the wrong folder. The report goes to the Public Documents MDMDiagnostics folder.
- Saving event logs without choosing English as the display language, which makes sharing harder.
- Reading logs on a PC with a different OS build.
- Assuming the Settings report contains the Autopilot ETLs. The page documents them for the command-line area and for Feedback Hub zip files, not for the Settings report.

## Related

- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)

## Sources

- [Collect MDM logs (Microsoft Learn)](https://learn.microsoft.com/windows/client-management/mdm-collect-logs)
