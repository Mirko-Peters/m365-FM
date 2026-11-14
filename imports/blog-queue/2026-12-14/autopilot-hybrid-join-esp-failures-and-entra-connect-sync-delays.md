---
title: "Autopilot Hybrid Join ESP Failures: Entra Connect Sync Delays and Other Causes to Check"
summary: "A checklist for Windows Autopilot deployments that fail or time out in the Enrollment Status Page during Microsoft Entra hybrid join, covering the connector, domain mismatch, sync timing, known issues and log collection."
status: review
publish: false
author: mirko-p
date: 2026-12-14
topics: [windows-autopilot, hybrid-entra-join, entra-connect, intune]
keypoints:
  - "Microsoft recommends Microsoft Entra join for new devices and states that deploying new devices as hybrid joined is not recommended, including through Autopilot."
  - "Learn says the sync-join error that the device object isn't found is expected until Entra Connect Sync finishes. The default sync cycle runs every 30 minutes."
  - "Check the Intune Connector for Active Directory first: version 6.2501.2000.5 or later, same domain as the targeted devices, and a managed service account with enough rights."
  - "Error 0x80004005 in hybrid deployments is a documented known issue that is resolved in specific cumulative updates for 23H2, 24H2 and 25H2."
  - "Learn does not quantify a hybrid join sync delay for Autopilot and does not state a default ESP timeout, so measure both in your own environment."
faq:
  - q: "Why does Autopilot hybrid join fail while waiting for Microsoft Entra Connect?"
    a: "Microsoft Learn's hybrid join troubleshooting says that for sync-join the device object is created in Active Directory and synced to Microsoft Entra ID by Entra Connect Sync. A DirectoryError saying the device object isn't found is expected until that sync finishes, and the next attempt succeeds after the sync completes."
  - q: "How often does Entra Connect Sync run?"
    a: "Learn states that by default a synchronization cycle runs every 30 minutes. You can start a delta cycle manually with Start-ADSyncSyncCycle -PolicyType Delta and view the scheduler settings with Get-ADSyncScheduler."
  - q: "What does error 0x80070774 mean in Autopilot hybrid deployments?"
    a: "The Autopilot troubleshooting FAQ says it might occur when the domain where the Intune Connector for Active Directory is installed doesn't match the domain where device configurations are targeted. The fix is to configure the connector in the matching domain."
  - q: "What is the default ESP timeout?"
    a: "The ESP troubleshooting article read for this guide does not state a default value. It says the timeout is set in the ESP profile and gives a five-minute timeout with more than 15 required apps as an example of a timeout that is too short."
---

A hybrid joined Autopilot deployment crosses more systems than a cloud-only one: the device, Intune, the Intune Connector for Active Directory, a domain controller and Entra Connect Sync. When the Enrollment Status Page (ESP) fails or times out, the problem can sit in any of them. This guide orders the checks the way Microsoft's documentation does.

Before you start, note Microsoft's position. The hybrid Autopilot page says Microsoft recommends deploying new devices as cloud-native using Microsoft Entra join, and that deploying new devices as Microsoft Entra hybrid joined, including through Windows Autopilot, isn't recommended. If a redesign is possible, that is the cleanest fix.

## What the Learn pages do and do not say about sync delays

The title of this problem assumes a sync delay. Here is what the pages actually support:

- For sync-join, the device object is created in Active Directory and synced to Microsoft Entra ID through Entra Connect Sync. Learn says the error that the device object by the given ID isn't found is expected because the object hasn't synced yet. The fix is to wait for Entra Connect Sync to finish.
- Entra Connect Sync runs a cycle every 30 minutes by default.
- The hybrid Autopilot page does not quantify a sync interval or delay for Autopilot, and the ESP article does not state a default timeout.

One inference, which Learn does not state: if the ESP timeout is shorter than the time the device needs to appear in Entra ID, the ESP can fail even though nothing is misconfigured. Compare your ESP timeout with the real time between domain join and device registration in your tenant.

## Step 1: Check the Intune Connector for Active Directory

The hybrid Autopilot page lists several connector rules:

- Versions older than 6.2501.2000.5 are deprecated and can no longer process enrollment requests.
- There can be at most one connector per server, and a connector processes requests only for the domain of the server it runs on.
- The connector creates computer objects in the OU you set in the domain join profile. A container such as `CN=Computers` is not valid in the profile, and the OU must be in distinguished name format.
- By default, an account can join only 10 computers to a domain, so the managed service account stops working after 10 joins unless it has the Create Computer objects permission on the target OU.
- Logs are under Event Viewer > Applications and Services Logs > Microsoft > Intune > ODJConnectorService.

The Autopilot troubleshooting FAQ adds a matching error: 0x80070774 during ESP in hybrid deployments can occur when the connector's domain does not match the domain where device configurations are targeted. Install the connector in the matching domain.

## Step 2: Check Microsoft Entra Connect scope

If domain and OU filtering is configured in Entra Connect, Learn says the default OU for Autopilot devices must be in the sync scope. Verify device registration with `Get-MgDevice`, which Learn names for that purpose.

To see the scheduler and force a delta cycle on the sync server:

```powershell
Get-ADSyncScheduler
Start-ADSyncSyncCycle -PolicyType Delta
```

A delta cycle runs delta import, delta sync and export on all connectors. Learn warns that a full cycle can be very time consuming, so use delta for this check.

## Step 3: Confirm domain line of sight

The hybrid join troubleshooting article lists a precheck phase: the device needs line of sight to a domain controller, on the internal network or over a VPN. The Autopilot page gives a VPN setting, **Skip Domain Connectivity Check** in the profile, which Learn also calls **Skip AD connectivity check**. Check the exact label in your portal. Learn adds that always-on VPNs should not require it.

A separate known issue, added September 1, 2026, says pre-provisioning fails when policy conflict resolution needs domain controller connectivity and the device has no line of sight. The workaround is to avoid assigning such policies during the technician flow, or to pre-provision on a network that reaches a domain controller.

## Step 4: Check the service connection point and discovery

The same article lists the discover phase. The device reads the service connection point (SCP) from Active Directory and then reaches `https://enterpriseregistration.windows.net` in system context. Two documented SCP errors:

- `DSREG_AUTOJOIN_ADCONFIG_READ_FAILED` (0x801c001d): the SCP can't be read.
- `DSREG_DISCOVERY_TENANT_NOT_FOUND` (0x801c003a): the SCP has the wrong tenant ID, or the tenant has no active subscriptions.

On a device that fails after domain join, `dsregcmd /status` shows `DomainJoined` and `AzureAdJoined`. `AzureAdJoined : NO` means the Entra join has not finished. For devices that are domain joined but not hybrid joined, a Diagnostic Data section on Windows 10 1803 and later shows the registration type, error phase and error codes.

## Step 5: Compare with the known issues list

The Autopilot known issues page lists these hybrid items:

| Issue | Status |
|---|---|
| Hybrid deployments time out with error 0x80004005 | Resolved in KB5065789 or later for 25H2, KB5065426 or later for 24H2, KB5070312 or later for 23H2 |
| Quality updates time out during OOBE when Allow OOBE Updates is set in the ESP profile | Resolved in KB5079473 and later |
| Duplicate device objects in Entra ID | By design: a device object is precreated at registration, and hybrid deployment creates another |
| Hybrid compliance state shows N/A until a user signs in | Described as expected, a user must sign in |
| Users don't get administrator rights in user-driven hybrid deployments | No fix stated |

The page also notes that clock skew can make provisioning fail. The workaround is `w32tm /resync /force`.

## Step 6: Tune the ESP and read the logs

Learn's ESP article says timeouts during app deployment usually mean the profile timeout is too short for the number of required apps. Its example is a five-minute timeout with more than 15 apps. If any app reports an installation state of 4 (Error), ESP stops installing apps, so check the Intune Management Extension log for that app.

Collect logs with the command that matches the scenario. For user-driven deployments on Windows 10 1809 and later:

```powershell
mdmdiagnosticstool.exe -area Autopilot -cab <pathToOutputCabFile>
Install-Script -Name Get-AutopilotDiagnostics -Force
Get-AutopilotDiagnostics -CABFile <pathToOutputCabFile>
```

On the device, press Shift+F10 in OOBE to open a command prompt. The ESP's **Collect logs** option copies logs to a USB drive after a timeout. In the troubleshooting FAQ, Autopilot event IDs 807, 809, 815 and 908 point to hardware hash, profile and serial number problems rather than join problems.

## Quick triage order

1. Is Entra join an option for this device group? If yes, plan for it.
2. Is the connector at 6.2501.2000.5 or later, in the right domain, with the MSA permission fixed?
3. Is the Autopilot OU inside the Entra Connect sync scope?
4. Does the device see a domain controller, directly or through VPN?
5. Is the SCP correct and is `enterpriseregistration.windows.net` reachable?
6. Is the device build above the fix for 0x80004005?
7. Is the ESP timeout larger than your measured registration time plus app install time?

## Related

- [Windows Autopilot](https://www.m365.fm/entity/windows-autopilot/)
- [Microsoft Entra hybrid join](https://www.m365.fm/entity/hybrid-entra-join/)
- [Entra Connect](https://www.m365.fm/entity/entra-connect/)
- [Intune](https://www.m365.fm/entity/intune/)

## Sources

- [Microsoft Learn: Windows Autopilot for Microsoft Entra hybrid join](https://learn.microsoft.com/en-us/autopilot/windows-autopilot-hybrid)
- [Microsoft Learn: Windows Autopilot known issues](https://learn.microsoft.com/autopilot/known-issues)
- [Microsoft Learn: Windows Autopilot troubleshooting FAQ](https://learn.microsoft.com/en-us/autopilot/troubleshooting-faq)
- [Microsoft Learn: Troubleshoot the Enrollment Status Page](https://learn.microsoft.com/en-us/troubleshoot/mem/intune/device-enrollment/understand-troubleshoot-esp)
- [Microsoft Learn: Troubleshoot Microsoft Entra hybrid joined devices](https://learn.microsoft.com/en-us/entra/identity/devices/troubleshoot-hybrid-join-windows-current)
- [Microsoft Learn: Microsoft Entra Connect Sync scheduler](https://learn.microsoft.com/en-us/entra/identity/hybrid/connect/how-to-connect-sync-feature-scheduler)
