---
title: "How to Send Email From Printers and Apps: Direct Send, SMTP AUTH or a Connector"
summary: "Compare the four ways Learn lists for devices and apps to send mail through Microsoft 365: client SMTP submission, SMTP relay with a connector, Direct Send and High Volume Email. See ports, TLS, limits, connector setup and when to choose which."
status: review
publish: false
author: mirko-p
date: 2027-01-16
topics: [exchange-online, exchange-online-powershell, security-defaults]
keypoints:
  - "Learn lists four methods: client SMTP submission (SMTP AUTH), SMTP relay with an inbound connector, Direct Send and High Volume Email."
  - "Client SMTP submission uses smtp.office365.com on port 587 or 25 with TLS 1.2 or 1.3, a licensed mailbox, and limits of 10,000 recipients per day and 30 messages per minute."
  - "SMTP relay and Direct Send use your MX endpoint on port 25; relay needs a certificate-based or static IP connector, and Direct Send reaches only recipients in your organization."
  - "Basic authentication for client SMTP submission is scheduled for deprecation, and Learn names alternatives such as High Volume Email and Azure Communication Services Email."
  - "Learn says most customers do not need Direct Send and recommends it only for advanced customers who accept email server admin responsibilities."
faq:
  - q: "Which method should a printer use?"
    a: "Learn lists four methods and gives requirements for each. Client SMTP submission needs the device to sign in with a licensed mailbox and support TLS 1.2 or 1.3. SMTP relay needs a connector with a certificate or static IP address. Direct Send needs no sign-in but reaches only your own recipients. The right choice depends on what the device supports."
  - q: "Can a device send to external recipients?"
    a: "Client SMTP submission and SMTP relay can relay to the internet through Microsoft 365. Direct Send and High Volume Email cannot; Direct Send mail to recipients outside your cloud-based organization is rejected."
  - q: "What are the client SMTP submission settings?"
    a: "Server smtp.office365.com, never an IP address; port 587 (recommended) or 25; TLS or StartTLS enabled with TLS 1.3 or 1.2; and the sign-in credentials of the designated mailbox."
  - q: "What is the MX endpoint for relay and Direct Send?"
    a: "It is the Points to address or value from the MX record of the accepted domain you send from, in the form <YourCustomDomain>-com.mail.protection.outlook.com. Learn says not to use an IP address in its place."
  - q: "Why do relayed messages end up in junk?"
    a: "Learn says SMTP relay and Direct Send do not bypass anti-spam filtering and recommends an SPF record entry for your static IP address. For Direct Send it also asks you to configure DKIM and DMARC correctly."
---

Microsoft 365 offers four ways for printers, scanners and line-of-business apps to send mail: client SMTP submission (SMTP AUTH), SMTP relay with an inbound connector, Direct Send, and High Volume Email. Choose by what the device can do. If it can sign in with a mailbox and use TLS 1.2 or 1.3, client submission fits. If it cannot, a connector-based relay is the next option, and Direct Send is the one for devices that cannot do either and only mail your own users. This guide follows Microsoft Learn's device setup page and its troubleshooting page.

## The four methods side by side

| | Client SMTP submission | SMTP relay | Direct Send | High Volume Email |
| --- | --- | --- | --- | --- |
| Send to your domains | Yes | Yes | Yes | Yes |
| Relay to the internet | Yes | Yes | No | No |
| Open TCP port | 587 or 25 | 25 | 25 | 587 |
| TLS | Required | Optional | Optional | Required |
| Authentication | Mailbox username and password | Static IP address or certificate | None | HVE account credentials or OAuth token |
| Saves to Sent Items | Yes | No | No | No |
| Third-party hosted apps | Yes | No | Yes, update SPF | Yes |

Limits from the same page: client submission allows 10,000 recipients per day and 30 messages per minute. SMTP relay has reasonable limits, and cannot be used to send spam or bulk mail. Direct Send has standard throttling for anonymous mail from the internet. High Volume Email has no recipient or message rate limits.

## Client SMTP submission

Settings Learn gives:

| Device setting | Value |
| --- | --- |
| Server | `smtp.office365.com`, not an IP address |
| Port | 587 (recommended) or 25 |
| TLS/StartTLS | Enabled, TLS 1.3 or TLS 1.2 |
| Credentials | The designated licensed mailbox |

Points to know:

- The mailbox address appears as the sender. If the device sends from another address, the sign-in account needs **Send As** on it, otherwise mail comes back with `5.7.60 SMTP; Client does not have permissions to send as this sender`. For that case Learn says to use SMTP relay.
- A device that defaults to port 465 does not support the required TLS versions.
- SMTP AUTH is disabled for organizations created after January 2020, but you can enable it per mailbox. Check this first when the device cannot authenticate.
- Learn says client SMTP submission with basic authentication is scheduled for deprecation, and is not compatible with security defaults. It recommends OAuth where possible.

## SMTP relay with a connector

Use this when client submission with OAuth, High Volume Email, Azure Communication Services Email and an on-premises server do not work for you, or when the device needs to send more than a mailbox allows. An inbound connector authenticates the device by a TLS certificate (recommended) or by public IP address. The device can send from any address in an accepted domain, including one with no mailbox. It does not need a licensed mailbox.

Device settings: server is your MX endpoint, for example `contoso-com.mail.protection.outlook.com`; port 25; TLS enabled; for a certificate connector, the certificate Subject or SAN must contain an accepted domain.

To create the connector in the Exchange admin center, go to **Mail flow** > **Connectors** > **Add a connector**, choose **Your organization's email server** as the source, name it, keep **Turn it on** selected and **Retain internal Exchange email headers** cleared. On the **Authenticating sent email** page, choose certificate verification, entering an accepted domain that matches the certificate (Learn suggests `*.contoso.com` if the certificate names several hosts), or choose IP address verification and enter the device's public IP. Dynamic IP addresses are not supported, and the IP must not be shared outside your organization. Then add the source to your SPF record and send a test message.

Limits: mail can be disrupted if your IP addresses land on a spam blocklist, you need a static unshared IP unless you use a certificate, and the device must retry failed connections. Learn says you cannot use SMTP relay from a third-party hosted service such as Azure.

## Direct Send

Learn's note: most customers do not need Direct Send, and Microsoft is working on an option to disable it by default. It recommends it only for advanced customers willing to take on email server admin responsibilities, and only when the device supports none of the other methods. No Microsoft 365 setting is needed. The device uses your MX endpoint on port 25 with optional TLS and an address in an accepted domain. Mail goes only to recipients in your cloud-based organization, and everything arrives like anonymous internet mail with all scanning applied. Learn asks for a static IP with SPF, plus DKIM and DMARC configured correctly.

## High Volume Email

For internal recipients only, with an HVE account authenticated by basic or OAuth, on port 587. Learn points to its HVE page for details.

## Troubleshooting pointers from Learn

- **Authentication unsuccessful (535 5.7.3, 5.7.57):** check SMTP AUTH on the mailbox, MFA, security defaults and a Conditional Access policy blocking legacy authentication.
- **Client was not authenticated to send anonymous mail during MAIL FROM:** the device connects to smtp.office365.com without credentials. Enter credentials, or use relay or Direct Send. The reverse mistake, pointing Direct Send at smtp.office365.com, gives the same message.
- **550 5.1.8 Bad outbound sender:** the mailbox is on a spam blocklist. Use the Restricted Users portal.
- **Relay stopped to external recipients:** the static IP changed. Update the connector and SPF.
- **5.7.64 TenantAttribution; Relay Access Denied:** a changed IP address or certificate. Update the inbound connector.
- **TLS 1.0 or 1.1 devices:** Learn describes an opt-in with `AllowLegacyTLSClients` and the endpoint `smtp-legacy.office365.com`.
- Test port connectivity with Telnet to `smtp.office365.com` on 587 or 25. A `220` greeting means the port is open.

## How I would choose

This section is my advice, not a Microsoft statement.

1. Try client submission with OAuth first if the app or device supports it.
2. For a simple printer with only username and password and TLS 1.2, client submission works today, but plan for the deprecation Learn mentions.
3. For devices that send from many addresses or send a lot, use relay with a certificate if the device can use one.
4. Pick Direct Send last, and keep it limited to internal recipients with SPF, DKIM and DMARC in place.
5. Document the IP address and the connector name for every relay device.

## Related

- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Exchange Online PowerShell](https://www.m365.fm/entity/exchange-online-powershell/)
- [Security defaults](https://www.m365.fm/entity/security-defaults/)

## Sources

- [How to set up a multifunction device or application to send email using Microsoft 365 or Office 365 (Microsoft Learn)](https://learn.microsoft.com/exchange/mail-flow-best-practices/how-to-set-up-a-multifunction-device-or-application-to-send-email-using-microsoft-365-or-office-365)
- [Fix issues with printers, scanners, and LOB apps that send email using Microsoft 365 - Exchange (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/exchange/email-delivery/fix-issues-with-printers-scanners-and-lob-applications-that-send-email-using-off)
- [Enable or disable SMTP AUTH in Exchange Online (Microsoft Learn)](https://learn.microsoft.com/exchange/clients-and-mobile-in-exchange-online/authenticated-client-smtp-submission)
