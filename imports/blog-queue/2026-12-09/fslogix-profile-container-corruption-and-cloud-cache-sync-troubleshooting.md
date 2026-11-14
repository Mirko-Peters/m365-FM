---
title: "FSLogix Profile Container Corruption and Cloud Cache Sync Problems: Troubleshooting in AVD"
summary: "Start with the FSLogix logs, then check antivirus exclusions, redirections.xml, container size, storage and Cloud Cache sizing. A checklist for corrupted profile containers and Cloud Cache failures in Azure Virtual Desktop, based on Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2026-12-09
topics: [fslogix, azure-virtual-desktop, windows-365]
keypoints:
  - "Read C:\\ProgramData\\FSLogix\\Logs\\Profile\\Profile_%date%.log first. Search for LoadProfile and the user's name, then follow the process id."
  - "Microsoft Learn names antivirus products as one of the most common causes of container corruption, so check the documented exclusions."
  - "Keep redirections.xml simple. Excluding the wrong profile folders can cause unexpected results."
  - "Cloud Cache needs more VM resources. Learn suggests starting with a 2:1 ratio of vCPU to user."
  - "If Cloud Cache cannot read data from any provider, Learn warns of a session hang or even a crash, so watch provider health and capacity."
faq:
  - q: "What is the most common cause of FSLogix container corruption?"
    a: "Microsoft Learn says antivirus products are one of the most common causes. If antivirus software scans or processes data into or out of the container, it can lead to corruption. Learn points to its documented antivirus file and folder exclusions."
  - q: "Where are FSLogix logs stored?"
    a: "Microsoft Learn lists three kinds: client event logs under Event Viewer, Applications and Services Logs, FSLogix; text logs in C:\\ProgramData\\FSLogix\\Logs; and event trace logs. The Profile_%date%.log file in the Profile subfolder is the most common one to read first, and Cloud Cache events appear under the CloudCache node."
  - q: "Where does Cloud Cache keep its local copy?"
    a: "According to Microsoft Learn, in C:\\ProgramData\\FSLogix\\Cache. Learn adds that the local cache only grows up to the maximum container size set in SizeInMBs, and that Cloud Cache flushes changes to all storage providers while the user signs out."
  - q: "How many providers does Cloud Cache read from?"
    a: "Learn says only one provider is used when data is hydrated, chosen by the order of entries in CCDLocations, while data is written to all providers. It advises listing providers by proximity and then preference."
  - q: "Do the Learn pages give a repair procedure for a corrupt VHD?"
    a: "The pages read for this article do not. They describe causes and prevention, and they warn that deleting the wrong data from a container could lead to data loss or profile corruption. Back up the container before any repair attempt."
---

For a corrupted FSLogix container or a Cloud Cache that will not sync, start with the logs, then work through the causes Microsoft documents: antivirus interference, redirections, container size, storage and network health, and VM sizing. This article follows that order. It also says clearly where the Learn pages stop. They describe causes and prevention in detail, but they do not provide a step-by-step repair for a damaged VHD(x) file.

## Step 1: Collect and read the logs

Learn names three log types: client event logs, text log files and event trace logs. The FSLogix Support Tool can gather them into one archive before you open a support case.

- **Event Viewer:** **Applications and Services Logs** > **FSLogix**. Cloud Cache events are in the **Admin** or **Operational** log under **CloudCache**.
- **Text logs:** `C:\ProgramData\FSLogix\Logs`. They need logging settings to be configured. The most useful file is `Profile_%date%.log` in the `Profile` subfolder.

To read the profile log, follow Learn's sequence:

1. Open the latest `Profile_%date%.log`.
2. Search for the sign-in with `LoadProfile: <samaccountname>`.
3. Confirm the time matches the reported issue.
4. Note the process id for that user and use it to follow the whole sign-in or sign-out sequence, because other users may log at the same time.
5. Look for `Begin Session: Logon`, `Begin Session: Logoff`, `loadProfile time:` and `unloadProfile time:`.

Entries are prefixed `[INFO]`, `[WARN:xxxxxx]` or `[ERROR:xxxxxx]`. Warnings and errors carry a code that you can look up in the FSLogix error codes reference. Learn lists codes such as 12 (can't attach to virtual disk), 11 (can't open virtual disk) and 17 (error while formatting virtual disk). It does not label any code as "corrupt".

## Step 2: Check antivirus exclusions

Learn states that antivirus products are one of the most common causes of container corruption. If antivirus software scans or processes data into or out of the container, corruption can follow. Review the antivirus file and folder exclusions in the FSLogix prerequisites and compare them with your endpoint protection configuration.

For slow or failed sign-ins, Learn also lists third-party firewall or intrusion prevention software on the same VM. The suggested test is to disable it temporarily and reproduce the issue. With Cloud Cache, FSLogix can use HTTPS to reach Azure page blobs, so check that path as well.

## Step 3: Review redirections.xml

Learn cautions against excluding profile data just to save capacity. The folders in a profile are not random, and a misconfigured `redirections.xml` can cause unexpected results. The advice is to keep the file simple. Learn also notes that adding exclusions later does not remove data already stored in the container.

## Step 4: Check container size and free space

A container must have more than 200 MB of free space to attach, according to Learn. To check:

1. Read the `SizeInMBs` setting on the VM.
2. Find the user's container on the SMB share.
3. Right-click the VHD(x) file, select **Properties** and compare **Size on disk** with `SizeInMBs`.

FSLogix expands a container automatically when you set a larger `SizeInMBs`, and the change affects all users with dynamic disks where it applies. VHD disk compaction is enabled by default in version 2210 (2.9.8361.52623) and later. Learn also recommends an alert when the file share drops below 20 percent free space. A full storage provider can hang sessions and block containers from mounting or detaching.

## Step 5: Check network, DNS and the Kerberos change

Container attach fails if the VM cannot resolve or reach the storage path. Learn suggests testing from another VM and running `Test-NetConnection -ComputerName <server FQDN> -CommonTCPPort SMB`.

Learn also repeats a notice: an April 2026 Windows Server update changes the default Kerberos encryption type from RC4 to AES-SHA1. File shares that host FSLogix containers and are not upgraded to AES-SHA1 may have access problems, so complete the upgrade first.

## Step 6: Understand Cloud Cache sync behavior

Cloud Cache uses the locally mounted container to send periodic updates to remote storage providers. Points from Learn that help with diagnosis:

- The local cache lives in `C:\ProgramData\FSLogix\Cache` and only grows to the container maximum set by `SizeInMBs`.
- Providers are used in the order of `CCDLocations`. One provider is used for reading, while writes go to all of them.
- If a provider falls behind the local copy, that can indicate an underperforming provider. Learn says `Ping` and `Test-NetConnection` results are poor indicators of transactional I/O performance.
- At sign-in, if a provider is not at the same sequence, Cloud Cache performs a full VHD(x) clone, keeping pending writes in the local cache until all providers match.
- At sign-out, the user's sign-out is delayed until all providers are at the same sequence. The delay depends on `HealthyProvidersRequiredForUnregister` and `CcdUnregisterTimeout`.
- If all providers become unhealthy during a session, the local cache keeps working and growing until a provider recovers.

The serious warning: if a read is requested and Cloud Cache cannot hydrate the data from any provider, this can cause a session hang or, worse, a system crash.

## Step 7: Size the VMs

Learn says Cloud Cache puts an even greater load on the VM and suggests starting at a 2:1 ratio of vCPU to user. It also notes extra I/O and storage needs for the local cache. Too many sessions per VM or too little CPU, memory or disk performance can make sign-ins slow or fail.

## What the pages read do not cover

The Learn pages used here have no dedicated Cloud Cache troubleshooting steps and no procedure to repair a corrupt VHD. The configuration settings page also does not detail the Cloud Cache settings on the section read. If the steps above find nothing, gather logs with the FSLogix Support Tool and open a support case. Before touching a damaged container, make a copy. Learn warns that deleting the wrong data can lead to data loss or profile corruption.

## Related

- [FSLogix](https://www.m365.fm/entity/fslogix/)
- [Azure Virtual Desktop](https://www.m365.fm/entity/azure-virtual-desktop/)
- [Windows 365](https://www.m365.fm/entity/windows-365/)

## Sources

- [Microsoft Learn: FSLogix troubleshooting events, logs and diagnostics](https://learn.microsoft.com/en-us/fslogix/troubleshooting-events-logs-diagnostics)
- [Microsoft Learn: Troubleshoot container corruption](https://learn.microsoft.com/en-us/fslogix/troubleshooting-container-corruption)
- [Microsoft Learn: Cloud Cache in FSLogix](https://learn.microsoft.com/en-us/fslogix/concepts-fslogix-cloud-cache)
- [Microsoft Learn: Troubleshoot long or failed sign-ins](https://learn.microsoft.com/en-us/fslogix/troubleshooting-long-failed-signin)
- [Microsoft Learn: Troubleshoot container size or low disk space](https://learn.microsoft.com/en-us/fslogix/troubleshooting-container-size-space)
- [Microsoft Learn: FSLogix error codes](https://learn.microsoft.com/en-us/fslogix/troubleshooting-error-codes)
