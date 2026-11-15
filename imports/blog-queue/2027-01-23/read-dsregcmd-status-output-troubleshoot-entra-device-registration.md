---
title: "Read dsregcmd /status Output to Troubleshoot Microsoft Entra Device Registration"
summary: "How to read each section of dsregcmd /status: device state, device details and DeviceAuthStatus, tenant details, user state, SSO state and PRT diagnostics, pre-join and post-join diagnostics, and the Windows Hello for Business prerequisite check, with the error phases from Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2027-01-23
topics: [entra-id, hybrid-entra-join, windows-hello-for-business]
keypoints:
  - "Run dsregcmd /status as a domain user account. Some sections need a user context, and the key test and system-context diagnostics need an elevated prompt."
  - "Device state comes from AzureAdJoined, EnterpriseJoined and DomainJoined. YES, NO, YES means Microsoft Entra hybrid joined."
  - "DeviceAuthStatus shows SUCCESS if the device is present and enabled, and FAILED if it is disabled or deleted. The field arrived in Windows 10 version 21H1."
  - "In the SSO state, AzureAdPrt and the PRT diagnostics fields show whether a primary refresh token exists and why a failed attempt happened."
  - "The pre-join diagnostics report an error phase, pre-check, discover, auth or join, plus client and server error codes, for domain joined devices that cannot hybrid join."
faq:
  - q: "How do I run dsregcmd /status?"
    a: "Run the dsregcmd /status utility as a domain user account. Microsoft Learn says that some sections, such as User state and SSO state, need a user context to show valid status. The diagnostic data is closest to the real join when you run the command from an elevated command prompt, because the join runs in SYSTEM context."
  - q: "How do I tell the join state of a device?"
    a: "Use the table in Learn. AzureAdJoined YES with EnterpriseJoined NO and DomainJoined NO is Microsoft Entra joined. NO, NO, YES is domain joined. YES, NO, YES is Microsoft Entra hybrid joined. NO, YES, YES is on-premises DRS joined. A Microsoft Entra registered device appears in the User state section as WorkplaceJoined."
  - q: "What does DeviceAuthStatus tell me?"
    a: "It checks the health of the device in Microsoft Entra ID. SUCCESS means the device is present and enabled. FAILED, Device is either disabled or deleted, means exactly that. FAILED, ERROR means the test could not run, because it needs network connectivity to Microsoft Entra ID under the system context. The field was added in Windows 10 May 2021 update, version 21H1."
  - q: "Which sections help with a failed hybrid join?"
    a: "The pre-join diagnostics, shown only if the device is domain joined and unable to hybrid join. They run an AD connectivity test, an AD configuration test for the service connection point, a DRS discovery test, a DRS connectivity test and a token acquisition test, then report the error phase and the client and server error codes."
  - q: "What do AadRecoveryEnabled and KeySignTest mean?"
    a: "They are post-join checks. If AadRecoveryEnabled is YES, the keys stored in the device are not usable and the device is marked for recovery. The next sign-in triggers the recovery flow and re-registers the device. KeySignTest PASSED means the device keys are healthy. A failing test usually marks the device for recovery. KeySignTest needs elevated privileges."
---

`dsregcmd /status` prints the state of a device in Microsoft Entra ID in several boxed sections. Microsoft Learn documents what each field means. This article walks through the output in the order you would read it when a device has a registration, join or sign-in problem. Run the command as a domain user account.

## Context matters

- Sections such as **User state** and **SSO state** only give valid status when you run the command in a user context.
- The actual join runs in SYSTEM context. For the pre-join diagnostics, running `dsregcmd /status` from an elevated command prompt is closest to the real join, and the page says the diagnostic user context can be SYSTEM, un-elevated user or elevated user.
- The **WamDefaultSet** field can show an error if the command runs from an elevated prompt.
- The **KeySignTest** needs elevated privileges.

## Device state

| AzureAdJoined | EnterpriseJoined | DomainJoined | Device state |
| --- | --- | --- | --- |
| YES | NO | NO | Microsoft Entra joined |
| NO | NO | YES | Domain joined |
| YES | NO | YES | Microsoft Entra hybrid joined |
| NO | YES | YES | On-premises DRS joined |

A device cannot be both EnterpriseJoined and AzureAdJoined. The Microsoft Entra registered (workplace joined) state shows in the **User state** section. **DomainName** shows the domain when the device is domain joined.

## Device details

This section appears only for Microsoft Entra joined or hybrid joined devices, not for registered ones. Fields:

- **DeviceId**: the unique ID of the device in the tenant.
- **Thumbprint** and **DeviceCertificateValidity**: the device certificate and its validity.
- **KeyContainerId**, **KeyProvider**, **TpmProtected**: where the device private key is stored. TpmProtected is YES if it is in a hardware TPM.
- **DeviceAuthStatus**: the health check against Microsoft Entra ID. SUCCESS if the device is present and enabled. FAILED with the text that the device is disabled or deleted. FAILED with ERROR if the test could not run, since it needs network connectivity to Microsoft Entra ID under the system context. This field was added in Windows 10 version 21H1.
- **Virtual Desktop**: NOT SET, YES with metadata such as provider, type (persistent or non-persistent), user mode and extensions, or INVALID if the metadata is present but wrong.

## Tenant details

Also only for joined and hybrid joined devices. It lists the tenant name and ID, the identity provider and endpoints, the MDM URLs, and the join, key, WebAuthN and device management service URLs. Learn adds two notes about MDM:

- Empty MDM URL fields mean MDM was not configured, or the current user is not in scope of MDM enrollment. Check the Mobility settings in Microsoft Entra ID.
- MDM URLs do not prove the device is managed. They show when the tenant has MDM configuration for automatic enrollment, even if the device itself is not managed.

## User state

- **NgcSet** and **NgcKeyId**: whether a Windows Hello key is set for the signed-in user, and its ID.
- **CanReset**: whether the user can reset the Windows Hello key. Values are DestructiveOnly, NonDestructiveOnly, DestructiveAndNonDestructive, or Unknown if there is an error.
- **WorkplaceJoined**: YES if Microsoft Entra registered accounts were added in the current NTUSER context.
- **WamDefaultSet**, **WamDefaultAuthority**, **WamDefaultId**, **WamDefaultGUID**: the Web Account Manager default account. The authority shows organizations for Microsoft Entra ID.

## SSO state

You can ignore this section for Microsoft Entra registered devices.

- **AzureAdPrt**: YES if a primary refresh token (PRT) is present for the signed-in user. **AzureAdPrtUpdateTime** and **AzureAdPrtExpiryTime** give the last update and the expiry if not renewed, in UTC.
- **EnterprisePrt** and its time fields: YES if the device has a PRT from on-premises AD FS. A hybrid joined device can have both. On-premises joined devices only have an enterprise PRT.
- **OnPremTgt**, **CloudTgt**, **KerbTopLevelNames**: Cloud Kerberos ticket status, added in the original Windows 11 release.

### PRT diagnostics

These fields arrived with Windows 10 version 21H1. They show only if the acquire or refresh failure happened after the last successful PRT update. On a shared device they might come from another user's sign-in. Under **AcquirePrtDiagnostics** and **RefreshPrtDiagnostics** you see:

- Previous Prt Attempt (time, UTC) and Attempt Status (client HRESULT).
- User Identity and Credential Type (commonly Password or NGC for Windows Hello).
- Correlation ID, Endpoint URI, HTTP Method.
- HTTP Error (WinHttp code), HTTP Status, Server Error Code and Server Error Description.

The sample on the page shows a failed password attempt with HTTP status 400, server error invalid_grant, and the description AADSTS50126. That is Learn's example, not a general rule.

## Pre-join diagnostics

Shown only if the device is domain joined and unable to hybrid join. The tests:

| Test | What it checks | What a failure suggests |
| --- | --- | --- |
| AD Connectivity Test | Connectivity to the domain controller | Join errors in the pre-check phase |
| AD Configuration Test | The service connection point (SCP) object in the on-premises forest | Join errors in the discover phase, with error code 0x801c001d |
| DRS Discovery Test | DRS endpoints from the discovery metadata and a user realm request | Join errors in the discover phase |
| DRS Connectivity Test | Basic connectivity to the DRS endpoint | The page gives no more detail than the basic connectivity test |
| Token Acquisition Test | A Microsoft Entra token if the user tenant is federated | Join errors in the authentication phase |

If authentication fails, sync-join is tried as a fallback, unless disabled with the `FallbackToSyncJoin` value (REG_DWORD) under `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\CDJ`. 0x0 disables it, 0x1 enables it, and no key means enabled. The **Fallback to Sync-Join** line is available from Windows 10 1803.

After the tests, these fields report the last failed attempt: **Previous Registration** time, **Error Phase** (pre-check, discover, auth or join), **Client ErrorCode** (HRESULT), **Server ErrorCode**, **Server Message**, **Https Status** and **Request ID** to correlate with server logs. The page also shows a sample where all tests pass and the attempt still fails with a directory error in the join phase. For sync-join, Learn says that is expected, and the device joins after the Microsoft Entra Connect synchronization job finishes.

## Post-join diagnostics

For devices that are joined to the cloud:

- **AadRecoveryEnabled**: YES means the keys stored on the device are not usable and the device is marked for recovery. The next sign-in triggers recovery and re-registers the device.
- **KeySignTest**: PASSED means the keys are healthy. A failure usually marks the device for recovery. For hybrid joined devices the recovery is silent. Microsoft Entra joined or registered devices prompt the user to authenticate to recover and re-register.

## NGC prerequisites check

This section checks the prerequisites for Windows Hello for Business. You might not see it if the user has configured Windows Hello for Business successfully. Fields include IsDeviceJoined, IsUserAzureAD, PolicyEnabled, PostLogonEnabled (YES if the platform triggers enrollment natively, NO if a custom mechanism does), DeviceEligible, SessionIsNotRemote, and **PreReqResult**, where Will Provision means enrollment starts as a post-login task at the next sign-in. Certificate trust deployments add CertEnrollment, AdfsRefreshToken, AdfsRaIsReady and LogonCertTemplateReady. For Cloud Kerberos trust, **OnPremTGT** appears, named CloudTGT before Windows 11 version 23H2.

## A reading order (my advice)

This is my suggestion, not a Microsoft procedure:

1. Check Device state first, to confirm the device has the join type you expect.
2. For a joined device, check DeviceAuthStatus, then the SSO state for a PRT.
3. For a domain joined device that does not hybrid join, run the command in an elevated prompt and read Error Phase and the failing test together.
4. Copy the Correlation ID or Request ID with the time stamp when you open a case, since they match server-side logs.
5. Compare the output with a healthy device of the same type before you decide what is wrong.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Microsoft Entra hybrid join](https://www.m365.fm/entity/hybrid-entra-join/)
- [Windows Hello for Business](https://www.m365.fm/entity/windows-hello-for-business/)

## Sources

- [Troubleshoot devices by using the dsregcmd command (Microsoft Learn)](https://learn.microsoft.com/entra/identity/devices/troubleshoot-device-dsregcmd)
