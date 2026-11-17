---
title: "Slow logons on AVD: finding the FSLogix bottleneck"
summary: "Split the logon into the stages Azure Virtual Desktop Insights reports, read the FSLogix profile log for the attach time, then check VM load, antivirus exclusions, DNS and SMB reachability, and storage latency and throttling in that order. This article gives the sources and checks for each step."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [fslogix, azure-virtual-desktop]
keypoints:
  - "Insights splits time to connect into a connection stage and a logon stage, and the logon stage into Profiles, Group Policy Objects, Shell Start and FSLogix (Frxsvc). Use it to see which part of the logon is slow before touching storage."
  - "The FSLogix profile log under C:\\ProgramData\\FSLogix\\Logs\\Profile records loadProfile and unloadProfile times in milliseconds for each sign-in, once logging is configured."
  - "Learn's FSLogix troubleshooting names five causes: an overloaded or small VM, a full container, third-party firewall or IPS software, network or DNS problems, and a storage provider that is full or underperforming."
  - "For Azure Files, compare Success E2E Latency with Success Server Latency and split Transactions by response type to see throttling. A large gap points at the network or client, not the share."
  - "The FSLogix FAQ says container size does not affect sign-in time. A container with too little free space can fail to attach, and Learn says it needs more than 200 MB free."
faq:
  - q: "Does a large profile container slow down logon?"
    a: "The FSLogix FAQ says no: container size does not affect sign-in times or performance, and other factors are much more important. Size still matters for a different reason. Learn says a container needs more than 200 MB free to attach, and the FAQ recommends at least 30% free space."
  - q: "Where do I find the time FSLogix needed to attach a profile?"
    a: "In the profile log at C:\\ProgramData\\FSLogix\\Logs\\Profile\\Profile_%date%.log. Search for LoadProfile: followed by the user name, then read the lines containing loadProfile time: (the unit is milliseconds). Learn says text logs require the logging settings to be configured first."
  - q: "Can Cloud Cache make sign-out slow?"
    a: "Yes. The FSLogix FAQ says Cloud Cache merges the local cache into all configured storage providers at sign-out, that underperforming or high-latency providers take longer, and that FSLogix holds the sign-out until the merge finishes. Learn also says to size VMs for Cloud Cache starting at a 2:1 ratio of vCPU to user."
---

Start by splitting the logon into stages, then read the FSLogix profile log for the attach time, and only then change storage or VM settings. Microsoft documents both tools, and they usually show whether the delay is in the profile, in Group Policy, in the shell, or before the session host is involved. The sections below follow that order and name the source for each check.

## Step 1: find the slow stage

[Azure Virtual Desktop Insights](/entity/avd-insights/) defines **time to connect** as the time between a user opening a resource and the desktop being loaded and ready, per the [Insights glossary](https://learn.microsoft.com/en-us/azure/virtual-desktop/insights-glossary). It has two stages: **connection**, the time for the service to route the user to a session host, and **logon**, the time for the service to sign the user in and establish the session on the host. For a desktop, the measurement ends when the `ShellReady` checkpoint appears.

The glossary breaks the logon stage into four parts:

| Logon stage | Learn's definition |
|---|---|
| Profiles | Time to load a user's profile for new sessions |
| Group Policy Objects | Time to apply group policies to new sessions |
| Shell Start | Time to launch the shell, usually explorer.exe |
| FSLogix (Frxsvc) | Time to launch FSLogix in new sessions |

A separate measure, shell start to shell ready, covers the time from the shell starting to being fully loaded. Learn does not say in the glossary exactly which stage contains the container attach, so treat the Profiles and FSLogix stages together and confirm with the FSLogix log in step 2.

Insights needs data collection to be set up first: a Log Analytics workspace, diagnostic settings for the host pool tables including Connections and Checkpoints, and the Azure Monitor Agent with a data collection rule for performance counters and Windows event logs, per the [Insights requirements](https://learn.microsoft.com/en-us/azure/virtual-desktop/insights). Learn gives thresholds for user input delay (good below 150 ms, poor from 500 to 2,000 ms) and for round-trip time in its use-case article (latency generally below 100 ms, a session broadly low quality over 200 ms), but states none for logon duration. Build your own baseline: take the median and 95th percentile for the same host pool on a day without complaints, and compare.

If the connection stage is slow rather than the logon stage, FSLogix is not the cause. The same glossary splits it into user route and stack connected, which points to the network between the client and the service.

## Step 2: read the FSLogix profile log

Learn's [logging and diagnostics page](https://learn.microsoft.com/en-us/fslogix/troubleshooting-events-logs-diagnostics) gives the locations:

- Text log: `C:\ProgramData\FSLogix\Logs\Profile\Profile_%date%.log`. The page says text logs require the logging settings to be configured.
- Event Viewer: **Applications and Services Logs > FSLogix**, with most data under **Apps** (Admin or Operational log) and Cloud Cache data under **CloudCache**.

To read one sign-in:

1. Open the latest `Profile_%date%.log` and note the computer name and FSLogix version.
2. Search for `LoadProfile: <samaccountname>`.
3. Confirm the entry matches the time of the complaint and note the process ID, which stays the same for the whole sign-in or sign-out.
4. Find `Begin Session: Logon`, `loadProfile time:` and, at sign-out, `unloadProfile time:`. The unit is milliseconds.

Warnings and errors are prefixed `[WARN:xxxxxx]` and `[ERROR:xxxxxx]` with an error code. If you need to hand logs to support, the [FSLogix Support Tool](https://learn.microsoft.com/en-us/fslogix/troubleshooting-fslogix-support-tool) collects logs, registry settings and system information into one archive, and it requires logging to be enabled beforehand. Run it with local administrator rights when collecting from remote computers.

Compare the `loadProfile time:` value with the Insights stage. A large value in the log means the attach itself is slow, so go to steps 3 and 4. A small value alongside a slow Profiles or FSLogix stage means the time is going somewhere other than the attach, so widen the search to the VM and the other causes in step 3.

## Step 3: check the VM and the machine itself

Learn's [long or failed sign-ins article](https://learn.microsoft.com/en-us/fslogix/troubleshooting-long-failed-signin) lists the causes in this order:

| Cause | Check | Source guidance |
|---|---|---|
| VM too small or too many users | vCPU, memory and OS disk performance during logon waves | Reduce simultaneous sessions or increase the VM size. For Cloud Cache, start at a 2:1 ratio of vCPU to user |
| Container full | Compare `Size on disk` of the VHD(X) with `SizeInMBs` | The container must have more than 200 MB free to attach. Raising `SizeInMBs` grows dynamic disks at next sign-in |
| Third-party firewall or IPS on the VM | Disable it temporarily and reproduce | Review the recommended exclusions |
| Network or DNS | `Test-NetConnection -ComputerName <server-fqdn> -CommonTCPPort SMB` | Fix name resolution or the SMB path |
| Storage provider full or slow | Capacity and performance of the share | Increase capacity |

The same page says that deleting content from a container lets it compact at sign-out, and that compaction needs FSLogix 2210 (2.9.8361.52623) or later. It also warns that deleting the wrong data can cause data loss or profile corruption.

### Antivirus exclusions

The [FSLogix prerequisites page](https://learn.microsoft.com/en-us/fslogix/overview-prerequisites) lists exclusions and says to validate them after policy deployment to prevent login delays. They include the processes `frxsvc.exe` and `frxccds.exe`, the drivers `frxdrv.sys`, `frxdrvvt.sys` and `frxccd.sys`, the folders `C:\Program Files\FSLogix\Apps\`, `C:\ProgramData\FSLogix\` and `C:\Users\%username%\AppData\Local\FSLogix\`, the Cloud Cache cache and proxy folders, temporary VHD and VHDX files under `%TEMP%` and `%WINDIR%\TEMP`, the container files on the SMB share (`.VHD`, `.VHDX`, `.lock`, `.meta`, `.metadata`), the FSLogix registry keys, and the profile mount points. Learn says to apply them in all security layers, including endpoint antivirus, network scanning and DLP.

## Step 4: check the storage side

The FSLogix prerequisites page says network latency, bandwidth and proximity to the storage provider are pivotal to the user's experience. For [Azure Files](/entity/azure-files/), Learn's performance troubleshooting and metrics pages suggest this routine:

1. In the Azure portal, open the storage account, then **Monitoring > Metrics**, and set the metric namespace to **File**.
2. Chart **Success E2E Latency** and **Success Server Latency** (average aggregation). Learn says a high difference between them points at the network or the client rather than the share.
3. Chart **Transactions** and apply splitting by response type. For standard shares, throttling appears as `ClientAccountRequestThrottlingError` or `ClientAccountBandwidthThrottlingError`. For premium shares it appears as `SuccessWithShareIopsThrottling`, `ClientShareIopsThrottlingError` and the related egress and ingress types.
4. Look at the metadata metrics. Learn describes **Success with Metadata Warning** as metadata IOPS approaching the limit and **Success with Metadata Throttling** as the limit exceeded. Operations such as opening and closing files and querying directories are metadata-heavy, and Learn lists them as a cause of higher latency.
5. Check where the client is. Learn lists a client VM in a different region from the file share as a cause of high latency.

Possible fixes named on Learn: moving from standard (HDD) to premium (SSD) shares often avoids throttling, and for premium shares you increase the provisioned share size to raise the IOPS limit. For premium shares, Learn also says to enable SMB Multichannel and keep the total channels at four or fewer, then unmount, wait 60 seconds and remount after changing settings. If the storage choice itself is open, see the article comparing Azure Files and Azure NetApp Files, and the [Azure NetApp Files](/entity/azure-netapp-files/) entity.

### Cloud Cache

[FSLogix Cloud Cache](/entity/fslogix-cloud-cache/) changes the picture. The FSLogix FAQ says it updates remote storage lazily and asynchronously during the session, then merges the local cache to all listed providers at sign-out, and FSLogix holds the sign-out until that finishes. Its recommendations for slow sign-outs are to review network topology and latency to every provider, move to a higher-performing storage tier, disable `VHDCompactDisk`, and avoid `ProfileType = 3` and `VHDAccessMode` values of 1, 2 or 3.

### Other settings

The FAQ says many `redirections.xml` include or exclude statements cost performance, because each file system request is checked against the list, and that redirections for small folders do not help the user experience. See [redirections.xml](/entity/fslogix-redirections-xml/) for the file itself. Separately, Learn warns that a Windows change included in the April 2026 Windows Server update moves the default Kerberos encryption type from RC4 to AES-SHA1, and that file shares hosting FSLogix containers not yet upgraded to AES-SHA1 might have access issues. If failed sign-ins start after that update, check this first.

## A worked reading (illustrative)

Suppose Insights shows the median logon stage rising from a baseline to several times that value on Monday mornings, while the connection stage is unchanged. The Profile log shows `loadProfile time:` values in the same range. In Azure Files, **Success Server Latency** rises together with **Success E2E Latency**, and **Transactions** split by response type show throttling types on a premium share. That pattern points at the share's IOPS limit during the logon wave, so you raise the provisioned size or move logons apart. If instead E2E latency is far above server latency, check the network path and the region of the session hosts. If both latencies are flat but the VM's CPU is high during logons, size the VM or reduce sessions per host. The numbers here are placeholders to show the reasoning; use your own baseline.

## Sources

Retrieved on 17 November 2026.

- [Microsoft Learn: Azure Virtual Desktop Insights glossary](https://learn.microsoft.com/en-us/azure/virtual-desktop/insights-glossary)
- [Microsoft Learn: Enable Insights to monitor Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/insights)
- [Microsoft Learn: Use cases for Azure Virtual Desktop Insights](https://learn.microsoft.com/en-us/azure/virtual-desktop/insights-use-cases)
- [Microsoft Learn: Troubleshooting issues with long or failed sign-ins (FSLogix)](https://learn.microsoft.com/en-us/fslogix/troubleshooting-long-failed-signin)
- [Microsoft Learn: Troubleshooting with logging and diagnostics (FSLogix)](https://learn.microsoft.com/en-us/fslogix/troubleshooting-events-logs-diagnostics)
- [Microsoft Learn: FSLogix Support Tool](https://learn.microsoft.com/en-us/fslogix/troubleshooting-fslogix-support-tool)
- [Microsoft Learn: FSLogix prerequisites](https://learn.microsoft.com/en-us/fslogix/overview-prerequisites)
- [Microsoft Learn: FSLogix FAQ](https://learn.microsoft.com/en-us/fslogix/overview-faq)
- [Microsoft Learn: Troubleshoot Azure Files performance issues](https://learn.microsoft.com/en-us/azure/storage/files/files-troubleshoot-performance)
- [Microsoft Learn: Analyze Azure Files metrics](https://learn.microsoft.com/en-us/azure/storage/files/analyze-files-metrics)
