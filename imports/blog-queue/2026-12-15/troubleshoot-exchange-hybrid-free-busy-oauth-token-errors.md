---
title: "Troubleshoot Exchange Hybrid Free/Busy Failures and OAuth Token Errors"
summary: "A checklist for hybrid free/busy that fails in one or both directions: confirm the direction, run the checker, read the error, then fix OAuth, certificate, Autodiscover or TLS causes as Microsoft Learn documents them."
status: review
publish: false
author: mirko-p
date: 2026-12-15
topics: [exchange-online, exchange-server, oauth-2-0, microsoft-365]
keypoints:
  - "Identify which direction fails first, then run the Hybrid Free/Busy Checker. It checks OAuth and DAuth settings and changes nothing."
  - "Use Test-OAuthConnectivity to find the error. Invalid signature, key not found and missing signing certificate each have a different fix."
  - "One documented cause of a 401 is a reverse proxy or firewall that preauthenticates. Autodiscover and EWS in hybrid do not support preauthentication."
  - "Misconfigured TLS 1.2 on any Exchange server can break free/busy and the Hybrid Configuration wizard steps."
  - "Rich coexistence now needs the dedicated hybrid app, because EWS access through the shared service principal is blocked since October 31, 2025."
faq:
  - q: "How do I tell whether my hybrid uses OAuth or DAuth?"
    a: "The Exchange team blog labels its log examples by path: OAuth requests use autodiscover.svc or exchange.asmx without /WSSecurity, DAuth requests use exchange.asmx with /WSSecurity. Its OAuth Autodiscover example also shows an S2S~ user value, but the blog states no explicit rule for that. The Hybrid Free/Busy Checker collects both the OAuth and the DAuth settings."
  - q: "What does 'The token has an invalid signature' mean?"
    a: "Per Microsoft Learn, the Microsoft authorization server settings are invalid. Refresh them with Set-AuthServer <name> -RefreshAuthMetadata, wait about 15 minutes or run iisreset /noforce, then check Get-AuthServer. If the values are wrong, rerun the Hybrid Configuration wizard."
  - q: "Free/busy fails with HTTP 401 only through our reverse proxy. Why?"
    a: "Learn lists a perimeter device that preauthenticates requests as the cause. Autodiscover and EWS virtual directories in hybrid deployments do not support preauthentication, so disable it or pass the requests through, then retest with the Remote Connectivity Analyzer."
  - q: "Can TLS settings cause this?"
    a: "Yes. Learn lists, for a user with an on-premises mailbox looking at an Exchange Online user, free/busy that fails or works intermittently, 'Could not update' when adding a shared calendar, and missing MailTips. It says these errors can occur if TLS 1.2 is not fully enabled and configured on all Exchange servers. Fix TLS on every server and retry."
  - q: "Does the OAuth configuration still use a certificate uploaded to the shared service principal?"
    a: "Learn's OAuth configuration page labels the step that uploads the certificate to the shared service principal obsolete and points to the dedicated Exchange hybrid application instead. Servers on older builds cannot use rich coexistence features because EWS access through the shared service principal was permanently blocked on October 31, 2025."
---

Start with the direction. Cloud users that cannot see on-premises free/busy and on-premises users that cannot see cloud free/busy are different problems with different logs. Run Microsoft's checker, capture the real error, and only then change settings. The order of the steps is my own. The content comes from the Learn and Exchange team pages listed under Sources.

## Step 1: Confirm symptom and direction

Hash marks in the Scheduling Assistant mean the lookup failed. Identify the requester and the target mailbox and which side hosts each. Test on-premises to on-premises free/busy first. If that fails, fix it before looking at hybrid. Learn's interactive troubleshooter asks the same question first, but it was written mainly for Exchange 2010/2013 and the DAuth organization relationship (my own caution: its settings examples may not fit an OAuth hybrid).

## Step 2: Run the checks Microsoft recommends

- **Remote Connectivity Analyzer Free/Busy test.** The Exchange team blog says to choose Modern Authentication for the source mailbox, allows only one target mailbox per test and points to the Additional details for the error. The test simulates Outlook desktop, so an OWA-only problem may not reproduce.
- **Hybrid Free/Busy Checker** (CSS-Exchange). It collects availability settings for OAuth and DAuth in Exchange Server and Exchange Online and flags values that differ from standard. It is a beta, makes no changes, and a flagged value is not always wrong. Run it as administrator with the ActiveDirectory and ExchangeOnlineManagement modules. Connect with `Connect-ExchangeOnline -Prefix EO` first, or it reports on-premises only. Output is an HTML and a TXT report.
- **Autodiscover from PowerShell.** `Invoke-RestMethod` against `https://outlook.office365.com/autodiscover/autodiscover.json?Email=<address>&Protocol=EWS` for a cloud and an on-premises address. The blog says this returns the external EWS URL from the Office 365 Autodiscover call.

Capture the exact error. The Exchange team blog names Outlook troubleshooting logging, the OWA F12 Network tab (`GetSchedule` for a cloud source mailbox, `GetUserAvailabilityInternal` for an on-premises one) and Fiddler (look for GetUserAvailability calls and ResponseClass=Error). It searches the ClientRequestID in the IIS, HttpProxy EWS and EWS logs. Its Event ID 4002 example (Application log, source MSExchange Availability) shows a ProxyWebRequest failure. Whether your error matches is for you to check.

## Step 3: Use Test-OAuthConnectivity

From on-premises to Exchange Online:

`Test-OAuthConnectivity -Service EWS -TargetUri https://outlook.office365.com -Mailbox <on-premises mailbox> -Verbose | Format-List`

Learn's free/busy errors page also shows `Test-OAuthConnectivity -Service AutoD -TargetUri <on-premises Autodiscover URL> -Mailbox <mailbox ID>` for Autodiscover and `-Service EWS -TargetUri <external EWS URL> -Mailbox <cloud mailbox ID>` for the on-premises EWS endpoint. My own reading of those examples: they run from Exchange Online PowerShell. The dedicated-app page treats a `ResultType` of `Success` as a good result and says the `Detail` then includes the appId of the dedicated app.

### Common OAuth errors and fixes from Learn

| Error | Cause | First fix |
|---|---|---|
| 401, token has an invalid signature | Authorization server settings invalid | `Set-AuthServer <name> -RefreshAuthMetadata`, wait about 15 minutes or `iisreset /noforce`, verify with `Get-AuthServer`, rerun the Hybrid Configuration wizard if wrong |
| 401, key was not found (AADSTS50012) | On-premises OAuth certificate does not exist in Exchange Online | Compare the on-premises thumbprint with the one published to Exchange Online, then replace the on-premises certificate or upload it to Exchange Online, and confirm the SPN is 00000002-0000-0ff1-ce00-000000000000 |
| 401, missing signing certificate | Auth configuration points to an invalid certificate | Create a new certificate if none exists (`New-ExchangeCertificate`), set it with `Set-AuthConfig -NewCertificateThumbprint`, publish it and clear the previous one |
| `invalid_user`, does not exist | On-premises mailbox and mail user not synced | Run Microsoft Entra Connect |
| `invalid_user`, ambiguous | UPN, SMTP or SIP address used by another object | Find the duplicate with an LDAP query, change or delete it |
| Object moved | TargetSharingEpr wrong | Set TargetSharingEpr to a valid external EWS URL, on the organization relationship (`Set-OrganizationRelationship`) or the intra-organization connector |

Learn gives the exact commands per error. Copy them from the page, because several need your thumbprints or server names. Two cautions. First, the "upload the certificate to Exchange Online" option for the key-not-found error sits uneasily with Learn's OAuth configuration page, which calls uploading the certificate to the shared service principal obsolete and points to the dedicated hybrid app. Learn does not reconcile the two, so read the dedicated-app page before you upload anything. Second, the free/busy errors page uses `Connect-MsolService`, `Get-MsolServicePrincipalCredential` and AzureAD cmdlets in places and does not mention their retirement. My own note: Microsoft has deprecated or retired those modules, so look for Microsoft Graph PowerShell equivalents.

## Step 4: Check the network path

Learn lists a perimeter device that preauthenticates (reverse proxy, firewall, TMG) as one cause of 401 Unauthorized, and says Autodiscover and EWS virtual directories in hybrid deployments do not support preauthentication. Its test: run the Free/Busy test in the Remote Connectivity Analyzer, and if you see a red checkmark, disable preauthentication and retest. Learn also says some 401 entries in the logs are normal. For the log check, look under `%ExchangeInstallPath%\Logging\HttpProxy\Autodiscover` for `ASAutoDiscover/CrossForest/EmailDomain` and under `...\HttpProxy\Ews` for `ASProxy/CrossForest/EmailDomain`. Learn notes the Autodiscover entry does not appear if TargetSharingEpr is set. My own inference: if the entries are missing, the requests probably never reach the server and the problem is upstream.

Other network errors listed on Learn: unable to connect to the remote server (firewall blocks), connection forcibly closed (inbound blocked from Exchange Online IPs), request timed out, and could not create SSL/TLS secure channel.

## Step 5: Check TLS 1.2 on all servers

A separate Learn page says these can occur if TLS 1.2 is not fully enabled and configured on all Exchange servers: intermittent free/busy, "Could not update" when adding a shared calendar, and MailTips not displaying. It also lists Hybrid Configuration wizard failures on Set-FederatedOrganizationIdentifier, Add-FederatedDomain, New-AuthServer and Test-OAuthConnectivity. Run the Hybrid Free/Busy Checker and the Exchange Health Checker, fix TLS per Microsoft's best-practice article, then retry.

## Step 6: Check permissions and organization settings

For the error "The caller does not have access to free/busy data", Learn says to check the Default user on the target calendar with `Get-MailboxFolderPermission <mailbox>:\Calendar`. Learn says the Default user's access rights should be AvailabilityOnly or LimitedDetails. Also verify the cloud or on-premises domain in the organization relationship and the sender's From address. For "Autodiscover failed ... 404 Not Found", Learn says to check that the on-premises domain is in `TargetAddressDomains` (intra-organization connector) or `DomainNames` (organization relationship). For "remote name could not be resolved", check `TargetAutodiscoverEpr`. For "Configuration information for forest/domain ... could not be found in Active Directory", check that the `RemoteRoutingAddress` uses the `<alias>@<initial domain>.mail.onmicrosoft.com` form.

## Step 7: Check the dedicated hybrid app status

Microsoft's dedicated Exchange hybrid application page explains the change. Rich coexistence (free/busy, MailTips, photos) now needs a dedicated Entra ID app, because Exchange Server previously used a shared first-party service principal and EWS access through it was permanently blocked on October 31, 2025. Supported builds are listed on the page. A Graph-based flow is available from the May 2026 Hotfix Update for most scenarios, and per the page's cloud table only in Microsoft 365 Global. Free/busy and profile pictures work through Graph, MailTips only partly (automatic replies), and Move to Archive not yet. The dedicated-app page gives no EWS retirement date and does not mention DAuth. The Exchange team's EWS retirement post says Microsoft starts blocking EWS requests to Exchange Online on October 1, 2026, and points to a later post about the timeline. I found no Microsoft statement in the pages I read that DAuth stops working at that point, so check the current timeline yourself.

Verify with `Test-OAuthConnectivity -Service EWS -TargetUri https://outlook.office365.com -Mailbox <mailbox>`, then check Entra sign-in logs for service principal sign-ins. Depending on organization size, the page says it can take up to 60 minutes for the configuration to be recognized by the Exchange Server processes, and Free/Busy, MailTips and Photos can be temporarily unavailable meanwhile.

## When to stop

If the checker, the connectivity test and the logs do not explain the failure, collect the ClientRequestID, the Test-FederationTrust or Test-OAuthConnectivity output and the checker report before opening a support case.

## Related

- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Exchange Server](https://www.m365.fm/entity/exchange-server/)
- [OAuth](https://www.m365.fm/entity/oauth-2-0/)

## Sources

- [Resolve free/busy errors](https://learn.microsoft.com/en-us/troubleshoot/outlook/calendaring/resolve-free-busy-errors)
- [Resolve free/busy sharing issues in a hybrid Exchange environment (TLS 1.2)](https://learn.microsoft.com/en-us/troubleshoot/exchange/hybrid-configuration-wizard-errors/free-busy-sharing-issues-tls12)
- [Dedicated Exchange hybrid application](https://learn.microsoft.com/en-us/exchange/hybrid-deployment/deploy-dedicated-hybrid-app)
- [Configure OAuth authentication between Exchange and Exchange Online](https://learn.microsoft.com/en-us/exchange/configure-oauth-authentication-between-exchange-and-exchange-online-organizations-exchange-2013-help)
- [Hybrid Free/Busy Checker](https://microsoft.github.io/CSS-Exchange/Diagnostics/FreeBusyChecker/FreeBusyChecker/)
- [Demystifying hybrid free/busy (Exchange Team Blog)](https://techcommunity.microsoft.com/t5/exchange-team-blog/demystifying-hybrid-free-busy-finding-errors-and-troubleshooting/ba-p/607727)
- [Retirement of Exchange Web Services in Exchange Online (Exchange Team Blog)](https://techcommunity.microsoft.com/blog/exchange/retirement-of-exchange-web-services-in-exchange-online/3924440)
- [Troubleshoot free/busy issues in Exchange hybrid](https://learn.microsoft.com/en-us/troubleshoot/exchange/calendars/troubleshoot-freebusy-issues-in-exchange-hybrid)
