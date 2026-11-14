---
title: "Publish an On-Premises App With Microsoft Entra Application Proxy: Settings and Consent"
summary: "Publish an on-premises web app with Microsoft Entra application proxy using Microsoft Learn: prerequisites, the connector, app settings, the admin consent for User.Read needed for new apps from June 30, 2026, test user assignment, DNS notes and troubleshooting."
status: review
publish: false
author: mirko-p
date: 2026-12-30
topics: [entra-id]
keypoints:
  - "You need Microsoft Entra ID P1 or P2, an Application Administrator account and a connector, the Microsoft Entra private network connector, installed on a Windows server."
  - "Add the app under Entra ID, Enterprise apps, New application, Add an on-premises application, and set Name, Internal URL, External URL, Pre Authentication and Connector Group."
  - "Keep Pre Authentication on Microsoft Entra ID, which enables Conditional Access and MFA. Passthrough needs backend authentication configured."
  - "From June 30, 2026 application proxy no longer grants admin consent for User.Read automatically on newly created apps, so grant it yourself."
  - "The connector must resolve and reach the chained DNS records ending in msappproxy.net or servicebus.windows.net. There is no fixed list of records."
faq:
  - q: "What do I need before publishing an app?"
    a: "According to Microsoft Learn, a Microsoft Entra ID P1 or P2 subscription, an Application Administrator account, synchronized or cloud user identities and an installed connector."
  - q: "What is the difference between Microsoft Entra ID and Passthrough pre-authentication?"
    a: "With Microsoft Entra ID, users are redirected to sign in, which enables Conditional Access and MFA and is required for Defender for Cloud Apps monitoring. Passthrough does no Entra authentication, so backend authentication must be configured."
  - q: "What changed on June 30, 2026?"
    a: "Application proxy no longer automatically grants admin consent for User.Read on newly created apps. A Cloud Application Administrator grants it under Permissions, Grant admin consent."
  - q: "What are the default timeout values?"
    a: "The Backend Application Timeout default is 85 seconds, and Long raises it to 180 seconds for slow apps."
  - q: "What can break app creation?"
    a: "Learn lists permissions, URLs that are not unique, URLs that do not start with http or https and end with a slash, and using an IP address instead of a domain name. For custom domains, an expired, self-signed or private-key-less certificate."
---

Microsoft Entra application proxy lets users reach on-premises web apps by signing in with their Entra account. This guide follows the Microsoft Learn tutorial on adding an on-premises application.

## Prerequisites

- A Microsoft Entra ID P1 or P2 subscription.
- An Application Administrator account.
- Synchronized user identities from an on-premises directory, or identities created in Entra ID. Synchronization lets Entra preauthenticate users and supplies the identifier for SSO.
- A connector installed on a Windows server. Learn calls it the Microsoft Entra private network connector, shared with Entra Private Access, and refers to a separate article for installation. The tutorial page itself gives no server requirements, ports or TLS requirements.

## Network and DNS

Public DNS records for application proxy endpoints are chained CNAME records pointing to an A record. The connector always accesses host names with the suffixes msappproxy.net or servicebus.windows.net. The connector server, firewall or outbound proxy must resolve every record in the chain and allow connections to the resolved IP addresses. Learn says there is no fixed list of records, because the chain can change. For several regions, choose the closest application proxy cloud region for each connector group.

## Add the application

1. In the Entra admin center go to **Entra ID**, **Enterprise apps**, **New application**.
2. Select **Add an on-premises application**.
3. Configure the fields below, then expand additional settings if needed and select **Add**.

| Field | Notes from Learn |
| --- | --- |
| Name | Shown in My Apps and the admin center |
| Maintenance Mode | Temporarily disables access for all users |
| Internal URL | URL inside the private network. A published path must include all images, scripts and style sheets the app needs |
| External URL | Address users use from outside. A custom domain is possible |
| Pre Authentication | Microsoft Entra ID (default, keep it) or Passthrough |
| Connector Group | Groups connectors by region, network or purpose. WebSockets need connectors 1.5.612.0 or later |

Additional settings include Backend Application Timeout (default 85 seconds, Long is 180), Use HTTP-Only Cookie (leave unselected for Remote Desktop Services), Use Persistent Cookie (keep unselected), Translate URLs in Headers (keep selected unless the app needs the original host header), Translate URLs in Application Body (keep unselected unless HTML hardcodes links) and Validate Backend TLS Certificate.

## Grant admin consent

Learn says starting June 30, 2026, application proxy no longer automatically grants admin consent for User.Read on newly created apps. A Cloud Application Administrator opens **Identity**, **Applications**, **Enterprise applications**, selects the app, **Permissions**, **Grant admin consent for** the tenant, reviews and accepts. Verify that User.Read shows as Delegated and granted through Admin consent. Note that the prerequisites name Application Administrator while this step names Cloud Application Administrator.

## Assign and test

Under **Getting started** select **Assign a user for testing**, add a user and group, and assign. Confirm first that the user can reach the app from inside the network. Then open **Application Proxy** for the app, select **Test Application**, launch it and download the diagnostic report for guidance.

## Troubleshooting from the page

- **App creation fails:** check the error details, your permissions, that internal and external URLs are unique, that they start with http or https and end with a slash, and that you used a domain name, not an IP address.
- **Custom domain certificates:** common problems are an expired certificate, a self-signed certificate and a missing private key.

## Suggested checks

This section is a suggestion, not Microsoft guidance. Test the internal URL from the connector server itself, publish the app with the narrowest path that works, and keep default settings until a specific symptom needs a change.

## Why Pre Authentication matters

With Microsoft Entra ID pre-authentication, users are redirected to sign in before they reach the app, which enables Conditional Access and MFA and is required for Microsoft Defender for Cloud Apps monitoring. With Passthrough, Entra does no authentication, so you must configure authentication on the backend. Learn tells you to keep the default.

## Internal URL details

You can publish a specific path instead of the root. If you do, include everything the app needs. Learn's example is an app at https://yourapp/app that uses images at https://yourapp/media, where you should publish https://yourapp/. The internal URL does not need to be the landing page users see.

## Not covered

The tutorial does not give connector OS or hardware requirements, outbound ports, TLS 1.2 requirements, custom domain steps, limits per tenant or the full PowerShell consent command. Its cleanup section is empty.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)

## Sources

- [Tutorial: Add an on-premises application for remote access through application proxy](https://learn.microsoft.com/entra/identity/app-proxy/application-proxy-add-on-premises-application)
