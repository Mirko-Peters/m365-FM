---
title: "Troubleshoot the Entra MFA NPS Extension: Error Codes and Event Log Entries"
summary: "Where the NPS extension for Microsoft Entra MFA logs its events and what the common error codes mean: HTTPS and connect errors, AccessReject, registry and request format errors, alternate login ID errors, user-facing errors, harmless warnings and throttling. The source page is in the Learn archive."
status: review
publish: false
author: mirko-p
date: 2027-01-25
topics: [mfa, entra-id]
keypoints:
  - "NPS extension logs are in Event Viewer under Applications and Services Logs, Microsoft, AzureMfa, with AuthN and AuthZ entries, on the server where the extension is installed."
  - "HTTPS_COMMUNICATION_ERROR points to firewalls and TLS 1.2. Check bidirectional traffic to adnotifications.windowsazure.com. With TLS 1.2 off, authentication fails and System log event 36871 appears."
  - "REGISTRY_CONFIG_ERROR means a key is missing under HKLM\\SOFTWARE\\Microsoft\\AzureMfa, which can happen if the PowerShell script was not run after installation."
  - "InvalidSession means verification took more than three minutes. Users must respond to the code or app notification within three minutes."
  - "PAP supports all MFA methods. CHAPV2 and EAP support phone call and mobile app notification only. Learn marks this page as archived, so check current guidance."
faq:
  - q: "Where do I find the NPS extension logs?"
    a: "In Event Viewer on the server where the NPS extension is installed, under Applications and Services Logs, Microsoft, AzureMfa, with the AuthN and AuthZ logs. The page states this path at the start."
  - q: "What does HTTPS_COMMUNICATION_ERROR mean?"
    a: "The NPS server cannot receive responses from Microsoft Entra multifactor authentication. Verify that firewalls are open in both directions for traffic to and from adnotifications.windowsazure.com and that TLS 1.2 is enabled, which is the default. If TLS 1.2 is disabled, user authentication fails and event ID 36871 from source SChannel is written to the System log."
  - q: "Why does REQUEST_MISSING_CODE appear?"
    a: "The password encryption protocol between the NPS and NAS servers may not support the secondary method in use. Learn says PAP supports phone call, one-way text message, mobile app notification and mobile app verification code. CHAPV2 and EAP support phone call and mobile app notification."
  - q: "A user gets InvalidSession. What can I do?"
    a: "The session took more than three minutes. Make sure the user enters the verification code or responds to the app notification within three minutes of starting the request. If that does not fix it, check for network latency between the client, the NAS server, the NPS server and the Microsoft Entra multifactor authentication endpoint."
  - q: "Are all the messages errors?"
    a: "No. Learn lists messages that are intentional warnings, such as OathCodeIncorrect, SMSAuthFailedWrongCodeEntered, maximum allowed code retry reached, and the throttling messages AuthenticationThrottled and AuthenticationMethodLimitReached. Throttling does not apply to the Microsoft Authenticator or verification codes."
---

The NPS extension adds Microsoft Entra multifactor authentication to RADIUS requests handled by a Network Policy Server. When it fails, the cause can be the network, the registry, the RADIUS setup or the user's verification methods. The Microsoft Learn page on NPS extension errors lists the codes and the checks for each. This article groups them by who has to act. One note first: the Learn page I read is in the Learn archive, flagged as archived. It may not reflect the newest guidance, so compare it with the current documentation before you change a production server.

## Where to look

NPS extension logs are in Event Viewer on the server where the extension is installed, under **Applications and Services Logs** > **Microsoft** > **AzureMfa**, with the **AuthN** and **AuthZ** logs.

## Errors in the extension (server side)

| Code or message | What to check |
| --- | --- |
| CONTACT_SUPPORT | Contact support and give as much as you can about what happened before the error, including tenant ID and user principal name (UPN) |
| CLIENT_CERT_INSTALL_ERROR | A problem with how the client certificate was installed or tied to your tenant. Use the troubleshooting section of the NPS extension article |
| ESTS_TOKEN_ERROR | Investigate client certificate and security token problems with the same section |
| HTTPS_COMMUNICATION_ERROR | The NPS server cannot receive responses from Entra MFA. Verify firewalls are open both ways for traffic to and from `https://adnotifications.windowsazure.com`, and that TLS 1.2 is enabled (the default). With TLS 1.2 disabled, authentication fails and event ID 36871 with source SChannel appears in the System log |
| HTTP_CONNECT_ERROR | On the NPS extension server, verify that you can reach `https://adnotifications.windowsazure.com` and `https://login.microsoftonline.com/`. If not, troubleshoot connectivity on that server |
| REGISTRY_CONFIG_ERROR | A key is missing for the application, possibly because the PowerShell script was not run after installation. The message should name the key. Check the key under `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\AzureMfa` |
| REQUEST_FORMAT_ERROR (RADIUS request missing mandatory userName or Identifier attribute) | Usually an installation issue. Install the extension on NPS servers that receive RADIUS requests. NPS servers installed as dependencies for services like RDG and RRAS do not receive RADIUS requests, and the extension does not work there |
| REQUEST_MISSING_CODE | The password encryption protocol between NPS and NAS must support your secondary method. PAP supports phone call, one-way text message, mobile app notification and mobile app verification code. CHAPV2 and EAP support phone call and mobile app notification |
| USERNAME_CANONICALIZATION_ERROR | Verify the user exists in on-premises Active Directory and that the NPS service has permission to access it. With forest trusts, contact support |

### AccessReject and AccessChallenge messages

The extension only performs secondary authentication for RADIUS requests in the AccessAccept state, so it logs and ignores other states.

- **AccessReject.** Learn says this usually reflects an authentication failure in AD, or that the NPS server cannot receive responses from Entra ID. Verify firewalls are open both ways for traffic to and from `https://adnotifications.windowsazure.com` and `https://login.microsoftonline.com` on ports 80 and 443. Also check that on the **Dial-in** tab, Network Access Permissions is set to control access through NPS Network Policy. The error can also be triggered when the user has no license.
- **AccessChallenge.** This response is used when more information is required from the user. The NPS server sends a challenge. It usually comes before an Access-Accept or Access-Reject.
- **Challenge requested in Authentication Ext for User.** With a RADIUS protocol other than PAP, VPN authorization can fail, with these events in the AuthZOptCh log of the NPS extension server. You can configure the NPS server to support PAP. If PAP is not an option, you can set `OVERRIDE_NUMBER_MATCHING_WITH_OTP = FALSE` to fall back to approve or deny push notifications. The page points to its article on number matching with the NPS extension.

### Alternate login ID errors

All use the code ALTERNATE_LOGIN_ID_ERROR:

| Message | What to check |
| --- | --- |
| userObjectSid lookup failed | The user must exist in on-premises AD. With forest trusts, contact support |
| Alternate LoginId lookup failed | `LDAP_ALTERNATE_LOGINID_ATTRIBUTE` must be a valid AD attribute. If `LDAP_FORCE_GLOBAL_CATALOG` is True, or `LDAP_LOOKUP_FORESTS` has a value, a Global Catalog must be configured with the AlternateLoginId attribute added to it. Check the `LDAP_LOOKUP_FORESTS` value, and separate several forest names with semicolons, not spaces |
| Alternate LoginId value is empty | The AlternateLoginId attribute must be configured for the user |

## Errors your users may see

| Code | Meaning | What to do |
| --- | --- | --- |
| AccessDenied | Caller tenant has no access permission to authenticate the user | Check that the tenant domain and the UPN domain match, for example user@contoso.com against the Contoso tenant |
| AuthenticationMethodNotConfigured | The method is not configured for the user | The user adds or verifies verification methods |
| AuthenticationMethodNotSupported | The method is not supported | Collect logs with this error and contact support, with the username and the method |
| BecAccessDenied | The username probably is not defined in the tenant | The user exists in on-premises AD but is not synced to Entra ID, or is missing in the tenant. Add the user and have them add verification methods |
| InvalidFormat or StrongAuthenticationServiceInvalidParameter | Phone number in an unrecognizable format | The user corrects their phone numbers |
| InvalidSession | Session invalid or expired | The session took over three minutes. The user must respond within three minutes. If that does not help, check network latency between client, NAS, NPS and the Entra MFA endpoint |
| NoDefaultAuthenticationMethodIsConfigured | No default method | The user adds or verifies methods and chooses a default |
| ProofDataNotFound | No proof data for the method | Try another method or add a new one. If it persists after checking, contact support |
| TenantIsBlocked | Tenant is blocked | Contact support with the tenant ID from the Entra properties page |
| UserNotFound | User not found | The tenant is no longer visible as active. Check the subscription and required first-party apps, and that the tenant in the certificate subject is as expected and the certificate is valid and registered under the service principal |
| OathCodePinIncorrect, SMSAuthFailedWrongCodePinEntered | Wrong code and PIN | Learn says these are not expected in the NPS extension. Contact support |

## Messages that are not errors

Learn says these are intentional warnings that explain why a request was denied:

- **OathCodeIncorrect** and **SMSAuthFailedWrongCodeEntered:** the user entered a wrong code. They can request a new code or sign in again.
- **SMSAuthFailedMaxAllowedCodeRetryReached:** too many failed challenges. Depending on settings, an admin may need to unblock the user.
- **AuthenticationThrottled** and **AuthenticationMethodLimitReached:** Microsoft can limit repeated attempts by the same user, and for the second code, by the same method type, voice call or SMS. This does not apply to the Microsoft Authenticator or a verification code, so users can switch to those or try again in a few minutes.

## Errors that need support

Learn says no standard steps exist for these: several InvalidParameter messages (for example request must not be null, UserPrincipalName must not be null or empty, TenantId not in correct format, SessionId must not be null or empty), InternalError, VersionNotSupported and MFAPinNotSetup. Contact support with the steps that led to the error and your tenant information.

## A checking order (my advice)

This is my suggestion, not an order from the page:

1. Read the event on the NPS server first and note the code, the user and the time.
2. If many users fail at once, check network and TLS on the server, since the connectivity codes explain broad failures.
3. If one user fails, check the user-facing table: methods, phone number, license and sync.
4. For new installations, check the registry key and the NPS server role before anything else.
5. Test with PAP in a lab if a method seems missing, since the page ties method support to the protocol.
6. Because the page is archived, check current Learn documentation for the NPS extension before you rely on any step here.

## Related

- [Multifactor authentication (MFA)](https://www.m365.fm/entity/mfa/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)

## Sources

- [Troubleshooting Microsoft Entra multifactor authentication NPS extension (Microsoft Learn, archive)](https://learn.microsoft.com/previous-versions/entra/identity/authentication/howto-mfa-nps-extension-errors)
