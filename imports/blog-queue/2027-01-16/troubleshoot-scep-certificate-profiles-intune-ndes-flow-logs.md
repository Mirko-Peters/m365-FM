---
title: "Troubleshoot SCEP Certificate Profiles in Intune: Follow the NDES Flow and Logs"
summary: "When an Intune SCEP certificate does not arrive, follow Learn's six-step flow: profile deployment, device to NDES, NDES policy module, CA, delivery and reporting. Includes the key logs, event IDs 306, 36 and 39, IIS status codes and the common NDES fixes."
status: review
publish: false
author: mirko-p
date: 2027-01-16
topics: [intune, certificate-authority, x509-certificate]
keypoints:
  - "Learn splits SCEP troubleshooting into six steps: deploy the profile, device to NDES, NDES to the policy module, NDES to the CA, delivery to the device, and reporting to Intune."
  - "The SCEP profile and the trusted certificate profile it references must be assigned to the same user or the same device."
  - "A Windows device logs event 306 when the policy arrives, event 36 when the certificate request is generated, and event 39 when the certificate is installed."
  - "On the NDES server, IIS status 200 means the device reached NDES; 500 can point to the Impersonate a client after authentication right for IIS_IUSRS."
  - "Browsing to the SCEP server URL should return HTTP Error 403.0 Forbidden; other results point to a Connector, application pool, proxy or request filtering problem."
faq:
  - q: "Where do I start when a SCEP certificate does not arrive?"
    a: "Learn says to narrow down where the problem sits in the communication flow. The flow has six steps: deploy the profile, device contacts NDES, NDES forwards the challenge to the Intune Certificate Connector policy module, NDES asks the CA, the certificate is delivered, and the connector reports to Intune. Check the logs for each step in order."
  - q: "What must be true about the profile assignment?"
    a: "The SCEP certificate profile and the trusted certificate profile named in it must be assigned to the same user or the same device. Learn gives a table of mixed assignments where user plus device on either side always works, but a user assignment on one and a device assignment on the other fails."
  - q: "Which Windows events show progress?"
    a: "In DeviceManagement-Enterprise-Diagnostic-Provider Admin: event 306 shows the policy arrived, with result 0x2ab0003 meaning DM_S_ACCEPTED_FOR_PROCESSING; event 36 shows SCEP: Certificate request generated successfully; event 39 shows SCEP: Certificate installed successfully."
  - q: "What should the SCEP server URL return in a browser?"
    a: "HTTP Error 403.0 Forbidden. Learn says that result means the URL is functioning correctly. Other results have their own causes, such as a failed Intune Connector installation, a stopped SCEP application pool or Application Proxy settings."
  - q: "Does the guidance cover macOS?"
    a: "No. Learn says the information applies to Android, iOS/iPadOS and Windows devices, and that similar information for macOS is not available."
---

When an Intune SCEP certificate does not arrive, check the flow one step at a time. Microsoft Learn describes six steps: the profile is deployed, the device contacts the NDES server, NDES passes the challenge to the Intune Certificate Connector policy module, NDES asks the certification authority, the certificate is delivered, and the connector reports the result to Intune. Find the first step whose log does not show success. This guide follows Learn's overview page and its pages for each step. The guidance covers Android, iOS/iPadOS and Windows, and Learn says similar macOS information is not available.

## Before you start

Learn says to meet the prerequisites for SCEP certificate profiles first, including a root certificate deployed through a trusted certificate profile. The SCEP profile and the trusted certificate profile it names must go to the same user or the same device. User plus device on either side always succeeds. A user assignment on one profile and a device assignment on the other fails.

## Which logs to read

On the NDES server, Learn names the Intune connector logs under **Event Viewer** > **Applications and Services Logs** > **Microsoft** > **Intune** > **CertificateConnectors** > **Admin** and **Operational**, and the IIS logs in `c:\inetpub\logs\LogFiles\W3SVC1`. On devices:

- **Windows:** **DeviceManagement-Enterprise-Diagnostic-Provider** > **Admin** in Event Viewer.
- **Android:** `OMADM.log` for personally owned work profile devices, `CloudExtension.log` for corporate-owned work profile, fully managed and dedicated devices. Enable verbose logging first.
- **iOS/iPadOS:** console logs collected on a Mac, with info and debug messages included. Learn says the Company Portal log has no SCEP information.

## Step 1: did the profile reach the device?

In the Intune admin center, go to **Troubleshooting + Support** > **Troubleshoot**, set **Assignments** to **Configuration profiles**, and check the user, the user's group membership and the last check-in time.

On Windows, look in the Admin log for **event 306**, with a description like `SCEP: CspExecute for UniqueId ... Result : (Unknown Win32 Error code: 0x2ab0003)`. Learn says 0x2ab0003 translates to DM_S_ACCEPTED_FOR_PROCESSING, and that a non-successful code might hint at the underlying problem. On Android look for the profile in the OMADM log, and on iOS for entries naming the ModelName and PayloadDependencyDomainCertificate.

## Step 2: did the device reach NDES?

On the NDES server, open the newest IIS log and look for requests to `mscep.dll` such as `operation=GetCACaps` and `operation=GetCACert`.

- Status **200**: the connection to NDES works.
- Status **500**: Learn says the IIS_IUSRS group might lack permissions. Its fix: run `secpol.msc`, open **Local Policies** > **User Rights Assignment**, add **IIS_IUSRS** to **Impersonate a client after authentication**, restart the computer and test again.
- Another status: test the SCEP server URL, below.
- No entry at all: the request might be blocked on the network between device and server.

On Windows the device logs **event 36**, `SCEP: Certificate request generated successfully`, with the NDES URL.

### Test the SCEP server URL

Copy the Server URL from the SCEP profile, for example `https://contoso.com/certsrv/mscep/mscep.dll`, and open it in a browser. The expected result is **HTTP Error 403.0 - Forbidden**. Learn's guidance for other results:

| Result | Cause and fix from Learn |
| --- | --- |
| General Network Device Enrollment Service message | Usually a Microsoft Intune Connector installation problem. Check SetupMsi.log, reinstall the connector if it failed, or run iisreset. |
| HTTP Error 503 | The SCEP application pool is not started. If it crashes, causes include intermediate CA certificates in the Trusted Root store, unreachable CRL URLs, Windows Authentication enabled on CertificateRegistrationSvc, or an expired NDESPolicy module certificate. |
| GatewayTimeout | The Microsoft Entra application proxy Connector service is not started. Set it to run and to start Automatic. |
| HTTP 414 Request-URI Too Long | Set maximum URL length and maximum query string to 65534 bytes in IIS request filtering, check the MaxFieldLength and MaxRequestBytes registry values, and restart the server. |
| This page can't be displayed | With Application Proxy, the external URL is wrong. Use the default yourtenant.msappproxy.net domain. |
| 500 - Internal server error | The NDES service account is locked or its password expired, or the MSCEP-RA certificates expired. |

## Steps 3 and 4: the policy module and the CA

Success looks like this on the NDES server: an IIS entry `POST /CertificateRegistrationSvc/Certificate/VerifyRequest` with status 201, NDESPlugin log lines `Verify challenge returns true` and `Exiting VerifyRequest with 0x0`, and `VerifyRequest Finished with status True` in CertificateRegistrationPoint.svclog.

If not, Learn lists these:

- **NDESPlugin.log error 12175** with `WINHTTP_CALLBACK_STATUS_FLAG_CERT_CN_INVALID`: a problem with the SSL certificate. Issue the web server certificate with the external server name as Common Name and the external and internal names as Subject Alternative Names, and bind it to port 443.
- **Error 403 Forbidden:** the client certificate may be untrusted, caused by intermediate CA certificates in the Trusted Root Certification Authorities store. Remove them. Find them with `Get-Childitem -Path cert:\LocalMachine\root -Recurse | Where-Object {$_.Issuer -ne $_.Subject}`.
- **Challenge returns false:** read CertificateRegistrationPoint.svclog. For a signing certificate error, check that the SigningCertificate value exists under `HKLM\SOFTWARE\Microsoft\MicrosoftIntune\NDESConnector`, restart the Intune Connector Service if not, and suspect connectivity between the NDES server and Intune if it stays missing.

For step 4, if the success entries are missing, check **Failed Requests** in the Certification Authority console and the CA's application event log.

## Step 5: delivery to the device

On the CA, an issued certificate appears in the list. On Windows look for **event 39**, `SCEP: Certificate installed successfully`, and check `certmgr.msc` for the root certificate under **Trusted Root Certification Authorities** and the requested certificate in the current user's **Personal** store. Learn says delivery and installation errors are typically related to Windows operations and not to Intune. Android device administrator devices prompt the user to install, while Android Enterprise and Samsung Knox install silently.

## Step 6: reporting

The reporting page says its details apply to the older PFX Certificate Connector and Microsoft Intune Connector, whose support ended in July 2021 when the Certificate Connector for Microsoft Intune replaced them. If files stick in `%ProgramFiles%\Microsoft Intune\CertificateRequestStatus\Processing`, check that the Intune Connector Service is running and look for errors in Ndesconnector.svclog. For the newer connector, use Learn's connector overview page.

## A working order

This section is my advice, not a Microsoft statement.

1. Confirm assignments and the trusted certificate profile first, since it costs nothing.
2. Test the SCEP URL from a machine outside the corporate network if devices are remote. The expected 403.0 tells you the front door works.
3. Read the IIS log for the time of a test attempt, and write down the first step without a success entry.
4. Check certificate expiry on the NDES server before deeper work, since expired RA or policy module certificates cause several symptoms above.
5. Change one thing at a time and retest from a single device.

## Related

- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Certificate authority](https://www.m365.fm/entity/certificate-authority/)
- [X.509 certificate](https://www.m365.fm/entity/x509-certificate/)

## Sources

- [Troubleshoot use of Simple Certificate Enrollment Protocol (SCEP) certificate profiles to provision certificates with Microsoft Intune - Intune (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/mem/intune/certificates/troubleshoot-scep-certificate-profiles)
- [Troubleshoot deployment of Simple Certificate Enrollment Protocol (SCEP) certificate profiles to devices with Microsoft Intune - Intune (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/mem/intune/certificates/troubleshoot-scep-certificate-profile-deployment)
- [Troubleshoot managed device to Network Device Enrollment Service (NDES) communication in Microsoft Intune - Intune (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/mem/intune/certificates/troubleshoot-scep-certificate-device-to-ndes)
- [Troubleshoot the NDES policy module that installs the Intune Certificate Connector - Intune (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/mem/intune/certificates/troubleshoot-scep-certificate-ndes-policy-module)
- [Troubleshoot delivery of Simple Certificate Enrollment Protocol (SCEP) certificates - Intune (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/mem/intune/certificates/troubleshoot-scep-certificate-delivery)
- [Troubleshoot reporting for SCEP certificate deployment to devices with Microsoft Intune - Intune (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/mem/intune/certificates/troubleshoot-scep-certificate-reporting)
