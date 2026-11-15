---
title: "Hybrid Joined Devices Stuck in Pending State in Entra ID: A Step-by-Step Check"
summary: "Domain-joined Windows devices show Pending in Microsoft Entra ID and Conditional Access blocks them? Check dsregcmd, the service connection point, network endpoints, sync scope and the join task in this order."
status: approved
publish: false
author: mirko-p
date: 2026-11-13
topics: [hybrid-entra-join, entra-id, entra-connect, conditional-access, intune]
keypoints:
  - "Pending means the device object synced from Active Directory but the device never finished registration. A pending device cannot get a Primary Refresh Token or satisfy device-based Conditional Access."
  - "Run dsregcmd /status in an elevated prompt first. Learn tells you to read DomainJoined, AzureAdJoined and the failed phase and error code."
  - "Most causes are outside the device: a missing or wrong service connection point, blocked endpoints, SSL inspection, or OU moves out of the Entra Connect sync scope."
  - "Learn documents one reset for the moved-OU case: dsregcmd /leave, restart, and let the Automatic-Device-Join task run again."
  - "Do not delete Active Directory computer objects or clear device attributes on advice from a forum alone. Learn does not document that step."
faq:
  - q: "What does the Pending state mean for a hybrid joined device?"
    a: "According to Microsoft Learn, a pending device has been synced from on-premises Active Directory to Entra ID but has not completed device registration. It cannot get a Primary Refresh Token for single sign-on and cannot satisfy device-based Conditional Access policies. The state applies only to Microsoft Entra hybrid joined devices."
  - q: "How do I list all pending devices in my tenant?"
    a: "Microsoft Learn uses the Microsoft Graph PowerShell SDK. After Connect-MgGraph, it filters devices by TrustType ServerAd and keeps those that have no AlternativeSecurityIds. The article contains the exact command and a CSV export example."
  - q: "Which URLs must a hybrid join device reach?"
    a: "Learn names https://enterpriseregistration.windows.net and https://login.microsoftonline.com, both reachable in the system context, plus the federation endpoints for federated domains. A community answer also lists device.login.microsoftonline.com and login.windows.net. Check them against the current Learn page."
  - q: "Why do devices go Pending after an OU move?"
    a: "Learn describes the sequence. A device moved out of the Entra Connect sync scope is deleted in Entra ID. When it moves back, sync creates a new pending object, and registration fails because the device was registered before. The documented fix is dsregcmd /leave, then a restart."
---

You roll out Microsoft Entra hybrid join. Entra Connect shows no sync errors. Some devices join and register without trouble. Others sit in the Microsoft Entra admin center with a registration status of **Pending**, sometimes for days, and Conditional Access policies that need a compliant or hybrid joined device keep blocking them.

Several Microsoft Q&A and Tech Community threads between July 2025 and June 2026 describe this. In one, a Microsoft moderator's answer was accepted by the author. In the others, the thread ended without a confirmed fix. This article merges the advice into one order, and checks the key points against Microsoft Learn. It is a troubleshooting guide, not an official Microsoft procedure.

## What the symptoms look like

- Devices appear under **Entra ID**, **Devices**, **All devices** with the join type **Microsoft Entra hybrid joined** and registered state **Pending**.
- Some devices show **Microsoft Entra registered** for days before they change to **Hybrid joined**.
- `dsregcmd /status` reports `AzureAdJoined : NO` while `DomainJoined : YES`.
- Users get sign-in blocks in Outlook, Teams or SharePoint, because Conditional Access cannot see a registered device.
- The scheduled tasks for workplace join show as **Ready** and the devices stay unchanged after a restart.

## What Pending means

Microsoft Learn explains the state in its page on pending devices. Entra Connect Sync creates the device object in Entra ID first and temporarily sets its registered state to Pending, and the device has to finish registration afterwards. Until then the state stays Pending. A pending device cannot get a Primary Refresh Token and cannot meet device-based Conditional Access. This is why the effect is felt at sign-in, not at the join.

## Step 1: Read the state on one affected device

Open an elevated Command Prompt on the device and run:

```
dsregcmd /status
```

Learn's hybrid join troubleshooting page tells you to read these values:

| Field | What you want to see |
|---|---|
| `DomainJoined` | YES. Without it, hybrid join cannot happen. |
| `AzureAdJoined` | YES when the join is finished. NO means it did not complete. |
| `WorkplaceJoined` | NO for a domain joined computer that is also hybrid joined. |

If the device is domain joined but the hybrid join failed, Windows 10 version 1803 and later show a **Previous Registration** section under **Diagnostic Data**, with the error phase, client error code and server error code. Learn names the phases Precheck, Discover, Authentication and Join. The same section lists test results for AD connectivity, AD configuration, DRS discovery and DRS connectivity. More detail is in **Event Viewer**, under **Applications and Services Logs**, **Microsoft**, **Windows**, **User Device Registration**. For join failures, Learn points to events 304, 305 and 307. A March 2026 reply names the **Admin** log under that node.

In the March and June 2026 threads, the moderators first asked for `DeviceAuthStatus` and, in June, also `AzureAdPrt`. Learn lists `DeviceAuthStatus` as a field for joined devices, with the values SUCCESS or a failure text, and `AzureAdPrt` in the SSO state. Run the command in the user's context for the second one.

## Step 2: Check the service connection point

The discover phase needs a valid service connection point (SCP) in the Active Directory forest that points to a verified domain in your tenant. A wrong tenant ID leads to the error `DSREG_DISCOVERY_TENANT_NOT_FOUND`. A missing SCP leads to `DSREG_AUTOJOIN_ADCONFIG_READ_FAILED`, according to Learn.

A volunteer in a June 2026 thread gave this query for a domain controller or an RSAT machine. Learn does not contain this exact line, so adapt it with care and replace the domain parts:

```powershell
Get-ADObject -SearchBase "CN=Device Registration Configuration,CN=Services,CN=Configuration,DC=yourdomain,DC=com" -LDAPFilter "(objectClass=serviceConnectionPoint)" -Properties keywords | Select-Object -ExpandProperty keywords
```

Check that the tenant ID and name in the keywords match your tenant. A stale SCP from an old tenant sends devices to the wrong place.

## Step 3: Test the network path in the system context

Learn names two endpoints that the device must reach in the system context: `https://enterpriseregistration.windows.net` for discovery and registration, and `https://login.microsoftonline.com` for realm discovery and authentication. For federated domains, the on-premises WS-Trust and MEX endpoints are also needed. If you use an outbound proxy, the computer account must be able to find it and sign in silently.

The March 2026 and June 2026 replies also list `device.login.microsoftonline.com`, and the June reply adds `login.windows.net`. These two are not in the Learn page I checked, so compare them with the current Microsoft endpoint lists.

The June 2026 reply makes a point worth repeating. SSL inspection is a common silent blocker, because the TLS handshake still works while the device authentication breaks. Learn supports the idea from another side: a proxy that returns an HTML page with HTTP 200 can produce the error `E_INVALIDDATA`. Look at the proxy and firewall logs for these URLs from the affected computers.

## Step 4: Check Entra Connect scope and the OU history

Two causes look alike and need different checks.

**A new device that never registers.** Check the sync of the device object, and check whether the Active Directory OU is inside the Entra Connect sync scope. The thread replies add the group policy for automatic registration and, if you also use Intune enrollment, the policy for automatic MDM enrollment as items to verify. One reply also names missing Intune licenses as a reason why devices stay registered but never enroll. Learn does not cover these two points on the pages used here.

**A device that moved out of scope and back.** Learn describes this sequence in detail. The device moves to an OU that sync does not include, sync deletes the Entra device, the device returns to an in-scope OU, and sync creates a new pending object. Registration fails because the device had registered before. Learn does not describe what happens when you delete only the Entra device object while the on-premises object stays in scope.

## Step 5: Reset the registration on the device

For the moved-device case, Learn documents this reset:

1. In an elevated Command Prompt on the device, run `dsregcmd /leave`.
2. Restart the device.
3. The scheduled task starts the registration again. On Windows 10 and later, find it in Task Scheduler under **Task Scheduler Library**, **Microsoft**, **Windows**, **Workplace Join**, **Automatic-Device-Join Task**.

The threads add `dsregcmd /join` and a delta sync on the Entra Connect server (`Start-ADSyncSyncCycle -PolicyType Delta`) to speed things up. Those commands are standard, but the Learn page on pending devices does not list them as part of this fix. Use them if the task does not run. For one stuck device, a volunteer also recommended `dsregcmd /debug /leave`, a restart, and then `dsregcmd /debug /join`, to get detailed output that shows whether the failure is discovery, certificate enrollment or the network.

Be careful with another suggestion from a January 2026 thread: deleting the computer object in Active Directory or clearing the `msDS-DeviceID` attribute. That came from one advisor and was not confirmed. Learn does not describe it. Do not do this on many production devices without a Microsoft source or a support case.

## Step 6: Look at time and other side effects

A June 2026 reply suggests checking the time sync of the domain controllers. A clock skew of more than a few minutes could make certificate issuance fail without a clear client error. The thread gives no source for this. Treat it as a cheap check that costs nothing.

## How to verify the result

1. On the device, run `dsregcmd /status` again. You want `AzureAdJoined : YES`. Then check `DeviceAuthStatus : SUCCESS` and, in the user's session, `AzureAdPrt : YES`.
2. In the admin center, the registered state should no longer show Pending.
3. To see what remains, use Learn's Graph PowerShell method. After `Connect-MgGraph`, count devices with `TrustType` equal to `ServerAd` that have no `AlternativeSecurityIds`. Learn gives the exact command and a CSV export.
4. Sign in as a test user and confirm that the Conditional Access policy no longer blocks.

## Limits of this guide

- Two of the threads ended without a confirmed solution. The accepted answer from November 2025 is a list of checks, not one fix.
- If many devices are affected and every check passes, the cause is rarely the devices. Collect `dsregcmd` output, event logs, and the data Learn describes for support, and open a case. Learn lists the diagnostic tool and trace scripts for that.
- Learn's pending devices page does not define how long a pending object may live. Use the Graph list to track progress, not a fixed number of days.

## Related

- [Microsoft Entra hybrid join](https://www.m365.fm/entity/hybrid-entra-join/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Microsoft Entra Connect](https://www.m365.fm/entity/entra-connect/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)
- [Microsoft Intune](https://www.m365.fm/entity/intune/)

## Sources

- [Microsoft Learn: Pending devices in Microsoft Entra ID](https://learn.microsoft.com/troubleshoot/azure/active-directory/pending-devices)
- [Microsoft Learn: Troubleshoot Microsoft Entra hybrid joined devices](https://learn.microsoft.com/en-us/entra/identity/devices/troubleshoot-hybrid-join-windows-current)
- [Microsoft Learn: Troubleshoot devices with the dsregcmd command](https://learn.microsoft.com/en-us/entra/identity/devices/troubleshoot-device-dsregcmd)
- [Microsoft Q&A: Hybrid Entra ID devices stuck in Pending state (November 2025)](https://learn.microsoft.com/en-us/answers/questions/5615527/hybrid-entra-id-devices-stuck-in-pending-state)
- [Microsoft Q&A: Troubleshooting Entra hybrid join for Windows 11, stuck in Pending Registration (January 2026)](https://learn.microsoft.com/en-us/answers/questions/5733210/troubleshooting-entra-hybrid-join-for-windows-11-e)
- [Microsoft Q&A: Entra registration status for hybrid device pending for many days (March 2026)](https://learn.microsoft.com/en-us/answers/questions/5838537/entra-registration-status-for-hybrid-device-on-pen)
- [Microsoft Q&A: Devices showing Pending status in Microsoft Entra ID (June 2026)](https://learn.microsoft.com/en-us/answers/questions/5926949/devices-showing-pending-status-in-microsoft-entra)
- [Microsoft Community Hub: Hybrid Entra ID device stuck in Pending (July 2025)](https://techcommunity.microsoft.com/discussions/microsoft-intune/hybrid-entra-id-device-stuck-in-pending/4428909)
