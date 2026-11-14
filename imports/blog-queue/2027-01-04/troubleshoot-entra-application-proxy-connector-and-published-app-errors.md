---
title: "Troubleshoot Entra Application Proxy Connector Problems and Published App Errors"
summary: "Troubleshoot Microsoft Entra Application Proxy: connector service and Event Viewer checks, published app configuration issues, Kerberos error codes and user-facing errors with the causes and fixes Learn documents."
status: review
publish: false
author: mirko-p
date: 2027-01-04
topics: [entra-id]
keypoints:
  - "Check first that the Microsoft Entra private network connector service is running, then read the connector Admin log in Event Viewer."
  - "An app that renders badly often has content outside the published path. Publish at the highest-level path and look for HTTP 404 in Fiddler or F12 tools."
  - "Kerberos error codes 12008, 13016, 13019, 13020 and 13022 point to SPN, UPN claim, trust or time synchronization problems."
  - "Users with a Microsoft account or guest access cannot use integrated Windows authentication apps. They need a matching corporate account."
  - "Inline TLS inspection between connectors and the cloud service can cause ConnectorError Unauthorized. Learn says to disable it."
faq:
  - q: "What should I check first for connector problems?"
    a: "Learn lists three checks: the Microsoft Entra private network connector service is enabled and running, the Event Viewer log under Applications and Services Logs > Microsoft > Microsoft Entra private network > Connector > Admin, and the connector session logs."
  - q: "Why does my published app render incorrectly?"
    a: "Learn says content may live outside the published path. Publish at the highest-level path the app needs, for example the site root instead of a sub-path, and look for HTTP 404 errors in Fiddler or browser F12 tools."
  - q: "What does Kerberos error 13020 mean?"
    a: "Learn says the back-end server SPN is not defined. Verify the SPN configuration, make sure the domain controller trusts Microsoft Entra ID and both use the same domain, and synchronize date and time."
  - q: "Why does the user see This corporate app can not be accessed with a license message?"
    a: "Learn says the user needs a license for Microsoft Entra ID P1 or P2. Assign a Premium license to the user or group on the Licenses tab."
  - q: "What causes ConnectorError Unauthorized?"
    a: "Learn says the connector client certificate fails to reach the endpoint, often because a network device does TLS inspection or termination. It advises disabling inline inspection and termination of outbound TLS between the connectors and the Application Proxy cloud services."
---

Troubleshoot Application Proxy in three layers: the connector, the published app configuration and the user-facing error. Start with the connector service and its event log. If they look healthy, move to the app settings and then to the error text. This guide follows the Microsoft Learn troubleshooting article for Application Proxy.

## Layer 1: connector checks

1. **Check the service.** Open the Windows Services console. The **Microsoft Entra private network connector** service must be enabled and show **Running**.
2. **Check Event Viewer.** Go to **Applications and Services Logs** > **Microsoft** > **Microsoft Entra private network** > **Connector** > **Admin** and read the connector events.
3. **Review detailed logs.** Turn on the private network connector session logs. Learn points to its connector concepts article for how.
4. **Escalate to connector troubleshooting.** If connector problems persist, Learn points to the separate article on troubleshooting private network connectors, and then back to this one for application issues.

The page lists no network requirements or ports inline. It refers to a separate article on ports to open for an Application Proxy application.

## Layer 2: published app configuration

| Symptom | Cause or fix on Learn |
| --- | --- |
| App does not render correctly, with no error message | Content lives outside the published path. Publish at the highest-level path needed, for example `https://yourapp/` instead of `https://yourapp/app`. Confirm by loading the page with Fiddler or browser F12 tools and looking for HTTP 404 |
| App takes too long to load | Change the network topology. Learn links to network considerations |
| Cannot publish as one application | Publish several apps and link them. Consider custom domains, which need your own certificate and FQDNs |
| Connectivity issues | See the ports article |
| Configuration issues in the admin portal | See the article on single sign-on in Application Proxy |
| Back-end authentication issues | See the Kerberos constrained delegation and PingAccess articles |
| This corporate app can not be accessed | Possible configuration error. See the bad gateway time-out article |

## Layer 3a: Kerberos errors

| Error | Fix on Learn |
| --- | --- |
| Failed to retrieve the current execution policy for running PowerShell scripts | Make sure the PowerShell execution policy is not disabled. In Group Policy: Computer Configuration > Administrative Templates > Windows Components > Windows PowerShell > Turn on Script Execution. Use Not Configured, or Enabled with Allow local scripts and remote signed scripts or Allow all scripts |
| 12008 | Exceeded the maximum Kerberos authentication attempts to the back-end server. Verify Entra ID and back-end configuration and synchronize date and time on both |
| 13016 | No UPN in the edge token or access cookie. Fix the UPN claim configuration in the STS |
| 13019 | General API error. Verify configuration, especially the SPN. Check domain controller trust and the same domain. Synchronize date and time |
| 13020 | Back-end server SPN not defined. Verify the SPN, trust and domain. Synchronize date and time |
| 13022 | Back-end responds with HTTP 401. Verify configuration and synchronize date and time. See the Kerberos constrained delegation article |

## Layer 3b: errors users see

| Error text (shortened) | Cause and fix on Learn |
| --- | --- |
| The website cannot display the page (IWA app) | Incorrect SPN. Correct it |
| The website cannot display the page (OWA app) | Incorrect SPN, or the user signed in with a Microsoft account or is a guest (IWA apps do not allow these), or the user lacks on-premises permissions to the back-end app |
| This corporate app can not be accessed. You are not authorized. Authorization failed | The user used a Microsoft account or guest access. Use a matching corporate account. Assign the user or group under the Application tab > Users and Groups |
| This corporate app can not be accessed right now. The connector timed out | The user lacks required on-premises permissions for the back-end app |
| Not authorized. Make sure the user has a license for Microsoft Entra ID P1 or P2 | Assign a Premium license to the user or group on the Licenses tab |
| A server with the specified host name could not be found | Custom domain misconfigured. Check the certificate and the DNS record |
| Forbidden: This corporate app can not be accessed, or the user could not be authorized | Add the connector machine account to the Windows Authorization Access Group built-in domain group (KB 331951) |
| InternalServerError: ConnectorError Unauthorized | The connector client certificate fails to reach the endpoint, often due to TLS inspection or termination. Disable inline inspection and termination of outbound TLS between connectors and the cloud services |

## A troubleshooting order

The order below is a suggestion based on the article's structure.

1. Is the connector service running, and does the Admin log show errors?
2. Is the problem one app or all apps? One app points to the app settings. All apps point to the connector or the network.
3. Does the app render but look broken? Check the published path.
4. Does the user see an authorization message? Check assignment, account type and license.
5. Does a Kerberos code appear? Check SPN, UPN claim, trust and clock sync.
6. Is TLS inspection active on the outbound path from the connector?

## Typical mistakes

- Testing with a Microsoft account or a guest account against an IWA app.
- Forgetting to assign the user or group to the app.
- Fixing the SPN but leaving the clocks of the domain controller and back end out of sync.
- Publishing a sub-path and wondering why scripts and images fail with HTTP 404.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Global Secure Access](https://www.m365.fm/entity/global-secure-access/)
- [Entra Private Access](https://www.m365.fm/entity/entra-private-access/)

## Sources

- [Troubleshoot Application Proxy problems and error messages (Microsoft Learn)](https://learn.microsoft.com/entra/identity/app-proxy/application-proxy-troubleshoot)
