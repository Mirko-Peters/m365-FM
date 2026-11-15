---
title: "Troubleshoot Primary Refresh Token (PRT) Issues on Windows Devices"
summary: "How to check PRT status with dsregcmd, find the error code from the Attempt Status field or Event Viewer events 1006 and 1007, and match it to cause and fix: status codes, CloudAP codes, XML, AADSTS50155, 50034, 50126 and WinHTTP errors, plus log and trace collection."
status: review
publish: false
author: mirko-p
date: 2027-01-24
topics: [entra-id, hybrid-entra-join, single-sign-on]
keypoints:
  - "A background attempt to refresh the PRT is made once every four hours during lock, unlock or sign-in. If refresh keeps failing, the PRT expires and SSO breaks."
  - "Run dsregcmd /status and read the SSO State section. AzureAdPrt NO means an error when acquiring the PRT, and an update time older than four hours suggests a refresh problem."
  - "The error code is in Attempt Status on Windows 10 21H1 or later, or in AAD operational and analytic logs between Event ID 1006 and 1007."
  - "Many codes lead to a server error code in Event ID 1081 or 1088, so look up the AADSTS value in the Entra error code reference."
  - "AADSTS50155 means device authentication failed. Learn says the device might be deleted or disabled and should be re-registered based on join type."
faq:
  - q: "What is the PRT and why does it matter?"
    a: "On devices joined to Microsoft Entra ID or hybrid joined, the PRT is the main component of authentication. You get it by signing in with Entra credentials the first time, it is cached, and later sign-ins use it. If it cannot refresh and expires, single sign-on to Entra resources is affected and sign-in prompts appear."
  - q: "How do I check whether a device has a PRT?"
    a: "Sign in as the affected user, open Command Prompt and run dsregcmd /status. In the SSO State section check AzureAdPrt. If it is NO, an error occurred when trying to get the PRT. If AzureAdPrtUpdateTime is more than four hours old, a problem likely prevents the refresh. Lock and unlock the device to force a refresh and check whether the time updates."
  - q: "Where do I find the error code?"
    a: "On Windows 10 May 2021 update (21H1) or later, the Attempt Status field under AzureAdPrt in the dsregcmd output shows it, for example 0xc000006d. Otherwise open Event Viewer, enable Show Analytic and Debug Logs, expand Applications and Services Logs, Microsoft, Windows, AAD, find Event ID 1006 and 1007 in the Analytic log, and read the error code from the properties of Event ID 1007."
  - q: "What does AADSTS50126 mean for the PRT?"
    a: "Either the user entered a wrong username or password, or on a hybrid joined device with password hash synchronization enabled the user recently changed the password and it has not synchronized yet. In the second case wait for Microsoft Entra synchronization to finish to get a fresh PRT."
  - q: "What should I collect before I open a support request?"
    a: "Learn recommends collecting Microsoft Entra logs and following the checklist first, ideally within a repro session. It describes the Auth scripts (Start-auth.ps1 and stop-auth.ps1), network traces with netsh and, for specific cases, time travel traces of lsass.exe, which contain extremely sensitive data."
---

The primary refresh token (PRT) is what lets a user sign in once on a Windows device and reach Microsoft Entra resources without further prompts. When it fails, users see repeated sign-in prompts and single sign-on stops working. The Microsoft Learn page on troubleshooting PRT issues on Windows gives a four-step checklist: get the PRT status, get the error code, look up the cause and fix, and collect logs if needed. This article follows that checklist.

## How the PRT behaves

On devices joined to Microsoft Entra ID or hybrid joined, the PRT is the main component of authentication. You obtain it when you sign in to Windows with Entra credentials on the device for the first time. It is cached, and later sign-ins use the cached token to get you to the desktop.

When the device is locked and unlocked or you sign in again, a background network authentication attempt is made once every four hours to refresh the PRT. If something prevents the refresh, the PRT eventually expires. That affects single sign-on to Entra resources and causes sign-in prompts.

Learn recommends that you collect Entra logs and follow the checklist before you file a support request, ideally within a repro session.

## Step 1: Get the PRT status

1. Sign in to Windows as the user who has the problem.
2. Open **Command Prompt** and run `dsregcmd /status`.
3. Find the **SSO State** section. It contains fields such as `AzureAdPrt`, `AzureAdPrtUpdateTime`, `AzureAdPrtExpiryTime` and `AzureAdPrtAuthority`, and equivalents for the enterprise PRT.
4. If `AzureAdPrt` is **NO**, an error occurred when the device tried to get the PRT from Entra ID.
5. If `AzureAdPrtUpdateTime` is more than four hours old, a problem is likely preventing the refresh. Lock and unlock the device to force a refresh and check whether the time updates.

## Step 2: Get the error code

**Method 1: dsregcmd output.** This works on the Windows 10 May 2021 update (version 21H1) or later. Under `AzureAdPrt` in the SSO State section, the `Attempt Status` field holds the error code. Learn's example is `0xc000006d`. The same block also shows fields such as `Credential Type`, `HTTP status`, `Server Error Code` and `Server Error Description`, for example invalid_grant with AADSTS50126.

**Method 2: Event Viewer.**

1. Open **Event Viewer**. In the **View** menu make sure **Show Analytic and Debug Logs** is checked.
2. Expand **Applications and Services Logs** > **Microsoft** > **Windows** > **AAD**. You see **Operational** and **Analytic**.
3. Learn notes that CloudAP plug-in error events go to the Operational log and information events to the Analytic log, so you need to look at both.
4. In the **Analytic** log find Event ID **1006** (start of the PRT acquisition flow) and **1007** (end). Everything in the AAD logs between them belongs to that flow.
5. Open the Event ID 1007 row and copy the error code from the **General** tab. It is a 10-character string that starts with `0x`.

## Step 3: Match the code to cause and fix

### Status codes (0xc000...)

| Code | Cause | What to do |
| --- | --- | --- |
| STATUS_LOGON_FAILURE 0xc000006d, STATUS_WRONG_PASSWORD 0xc000006a | The device cannot connect to the Entra authentication service, or got a 400 Bad Request from it or from a WS-Trust endpoint (needed for federated authentication) | If an outbound proxy is required, make sure the device computer account can discover and silently authenticate to it. Get the server error code and description (Event ID 1081 for the Entra service, 1088 for WS-Trust) and look up the AADSTS value. Event ID 1022 in the analytic log shows the URL |
| STATUS_REQUEST_NOT_ACCEPTED 0xc00000d0 | 400 Bad Request from Entra or a WS-Trust endpoint | Get the server error code and description as above |
| STATUS_NETWORK_UNREACHABLE 0xc000023c, STATUS_BAD_NETWORK_PATH 0xc00000be, STATUS_UNEXPECTED_NETWORK_ERROR 0xc00000c4 | A 4xx response from Entra or WS-Trust, or a network connectivity problem to a required endpoint | Use Event ID 1081 or 1088 for server errors. For connectivity get the URL from Event ID 1022 (analytic) and the suberror from Event ID 1084 (operational) |
| STATUS_NO_SUCH_LOGON_SESSION 0xc000005f | User realm discovery failed because Entra cannot find the user's domain | Add the domain of the user's UPN as a custom domain in Entra ID (Event ID 1144 shows the UPN). If the on-premises domain is not routable, such as jdoe@contoso.local, configure Alternate Login ID |

### CloudAP plug-in codes (0xc004...)

| Code | Cause | What to do |
| --- | --- | --- |
| OAUTH_USERNAME_IS_MALFORMED 0xc004844c | The UPN is not in the expected format. For Entra joined devices it is the text typed at sign-in, for hybrid joined devices it is the UPN the domain controller returns | Set the UPN to an internet-style sign-in name (RFC 822). Check Event ID 1144. On hybrid joined devices check with `whoami /upn`. If AD has the correct UPN, collect time travel traces of lsass.exe. For non-routable domains configure Alternate Login ID |
| OAUTH_USER_SID_IS_EMPTY 0xc0048442 | The user SID is missing in the ID token from Entra | Make sure the network proxy does not interfere with or modify the server response |
| WSTRUST_SAML_TOKENS_ARE_EMPTY 0xc00484c1 | Error from the WS-Trust endpoint | Check the proxy. Get the server error from Event ID 1088 |
| HTTP_PASSWORD_URI_IS_EMPTY 0xc004848b | The Metadata Exchange (MEX) endpoint is misconfigured and its response has no password URLs | Check the proxy and fix the MEX configuration |
| HTTP_CERTIFICATE_URI_IS_EMPTY 0xc004848c | MEX response has no certificate endpoint URLs | Check the proxy and fix the MEX configuration in the identity provider |

### XML code (0xc00c...)

`WC_E_DTDPROHIBITED 0xc00cee4f`: the XML response from the WS-Trust endpoint included a document type definition, which is not expected, and parsing fails. Fix the identity provider configuration so it does not send the DTD, and get the URL from Event ID 1022 in the analytic log.

### Server error codes (AADSTS)

| Code | Cause | What to do |
| --- | --- | --- |
| AADSTS50155 Device authentication failed | Entra ID cannot authenticate the device to issue a PRT. The device might have been deleted or disabled | Re-register the device based on its join type. Learn points to its FAQ entry on a disabled or deleted device whose local state still says registered |
| AADSTS50034 User account does not exist in the directory | Entra cannot find the user account in the tenant | Check that the user enters the correct UPN, and that the on-premises account is synchronized to Entra ID. Event ID 1144 shows the UPN |
| AADSTS50126 Error validating credentials | A wrong username or password, or on a hybrid joined device with password hash synchronization the user recently changed the password and it is not synchronized yet | Wait for Entra synchronization to finish, then a fresh PRT can be acquired |

The full list of server codes is in the Entra error code reference.

### Network codes (ERROR_WINHTTP_...)

For ERROR_WINHTTP_TIMEOUT (12002), NAME_NOT_RESOLVED (12007), CANNOT_CONNECT (12029) and CONNECTION_ERROR (12030), the cause is general network issues. Get the URL from Event ID 1084 (operational) or 1022 (analytic). If an outbound proxy is required, make sure the device computer account can discover and silently authenticate to it. Then collect a network trace. Learn says not to use Fiddler during this procedure:

1. Run `netsh trace start scenario=InternetClient_dbg capture=yes persistent=yes`.
2. Lock the device. On a hybrid joined device wait at least 60 seconds for the PRT acquisition task.
3. Unlock the device.
4. Run `netsh trace stop`.

## Step 4: Collect logs and traces

**Regular logs.** Download the Auth script archive (the page links aka.ms/authscripts) and extract it. In an administrative PowerShell session in that folder run `.\Start-auth.ps1 -vAuth -acceptEULA`. Switch to the problem user's session, lock the device, wait at least 60 seconds if it is hybrid joined, unlock, switch back and run `.\stop-auth.ps1`. Wait until all tracing stops.

**Time travel traces.** Learn warns that these contain personal data, and that traces of lsass.exe hold extremely sensitive information, so handle them with best practices for storage and sharing. In an elevated Command Prompt, create `c:\temp`, find the lsass.exe process ID with `tasklist /m lsasrv.dll`, start `TTD.exe -attach <lsass-pid> -out c:\temp`, lock and unlock the device, stop with `TTD.exe -stop all`, and take the latest lsass##.run file.

## Quick triage (my advice)

This is my suggestion, not an order from the page:

1. If many users fail at once, think network, proxy or federation first, since most codes above lead there.
2. If one user fails, think UPN format, a recent password change or a disabled device.
3. Always note the Attempt Status and the server error from the same attempt. A code taken from an older attempt can mislead you.
4. Treat lsass.exe traces as a last step and store them securely.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Microsoft Entra hybrid join](https://www.m365.fm/entity/hybrid-entra-join/)
- [Single sign-on (SSO)](https://www.m365.fm/entity/single-sign-on/)

## Sources

- [Troubleshoot primary refresh token issues on Windows devices (Microsoft Learn)](https://learn.microsoft.com/entra/identity/devices/troubleshoot-primary-refresh-token)
