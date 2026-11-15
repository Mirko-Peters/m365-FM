---
title: "Exchange Online Connectors for On-Premises Mail Flow: Create Both Connectors Step by Step"
summary: "Create the two Exchange Online connectors that route mail between Microsoft 365 and your own email server, following Microsoft Learn: prerequisites, the connector wizard screens, certificate or IP identification, the New-SendConnector example, validation and how multiple connectors are matched."
status: review
publish: false
author: mirko-p
date: 2026-12-29
topics: [exchange-online]
keypoints:
  - "Two connectors are needed: Office 365 to your organization's email server, and your organization's email server to Office 365. Create them in the Exchange admin center under Mail flow, Connectors."
  - "The Learn page is for your own on-premises or other server. It warns against using it for partner email services, where delivery can fail."
  - "Prerequisites include TLS with a valid CA-signed certificate, port 25 open and connections allowed from all Microsoft 365 IP addresses."
  - "On the inbound connector, identify your server by certificate subject name (recommended) or by its IP address."
  - "With several connectors, Exchange Online chooses an exact domain match first, then all accepted domains, then wildcard patterns."
faq:
  - q: "Do I need two connectors?"
    a: "According to Microsoft Learn, yes. One routes mail from Microsoft 365 to your on-premises server and the second routes mail from your server to Microsoft 365."
  - q: "Where do I create a connector?"
    a: "Open the Exchange admin center, go to Mail flow, then Connectors, and select Add a connector. Learn says to reach the admin center through the Exchange link under Admin centers in the Microsoft 365 admin center."
  - q: "Can I use this page for a partner's email service?"
    a: "No. Learn warns that partner services should not follow these steps and points to a separate article on connectors for secure mail flow with a partner organization."
  - q: "How does Microsoft 365 recognise mail from my server?"
    a: "The connector from your server verifies either the certificate subject name, which Learn recommends, or the IP address of the sending server."
  - q: "How do I handle validation failures?"
    a: "Learn says to double-click the failure message for details and refers to its Validate connectors article."
---

Exchange Online connectors define how mail moves between Microsoft 365 and a mail server you run yourself. This guide follows the Microsoft Learn article on connectors for on-premises email servers, including servers that use the Built-in security add-on. Partner organizations and third-party mail services are out of scope.

## Scope and warning

Learn warns that partner email services should not follow these steps and refers to a separate article on partner connectors. I did not read that article, so nothing here applies to partner mail flow.

## Prerequisites on your side

1. Your on-premises server is set up and can send and receive internet email.
2. TLS is enabled with a valid CA-signed certificate. Learn recommends that the certificate subject name include the domain of your primary email server.
3. If you use certificates, make the Receive connector present the right one. For Exchange, the page sets the TlsCertificateName parameter of `Set-ReceiveConnector` in the Exchange Management Shell.
4. Note the name of your external-facing server, for Exchange the FQDN of the Edge Transport server or Client Access server that receives mail from Microsoft 365.
5. Open port 25 on the firewall.
6. Allow connections from all Microsoft 365 IP addresses, which Learn publishes on its URLs and IP address ranges page.
7. Note an email address in each of your domains for testing.

## Prerequisites in Microsoft 365

You need permissions for connectors in Exchange Online. To relay on-premises mail to the internet through Microsoft 365, use a certificate whose subject name matches an accepted domain, or make sure all sender domains and subdomains are accepted domains. Decide whether to deliver mail for all accepted domains, which most businesses choose, or use mail flow rules.

## Part 1: Office 365 to your server

Check for existing connectors first, because the Hybrid Configuration wizard may have created some. Then:

1. In the Exchange admin center select **Mail flow**, **Connectors**, **Add a connector**.
2. Under **Connection from** choose **Office 365** and under **Connection to** choose **Your organization's email server**.
3. Enter a connector name.
4. On **Use of connector** choose when it applies. The page points to a section called Options determining use of connector, but the current page has no such section. Its multiple-connector example shows two choices, all accepted domains or only specific domains.
5. On **Routing** enter the domain name or IP address of the host that receives the mail, then select the plus sign. Next stays unavailable until you do.
6. On **Security restrictions** you can require TLS, which Learn recommends. If you set certificate criteria, choose one option, for example a certificate issued by a trusted CA, and optionally match a subject name or SAN to a domain.
7. On **Validation email** enter an address in your domain, select the plus sign, then **Validate**.
8. Review and select **Create connector**.

Afterward, point your domain's MX record to Microsoft 365, as described in Learn's article on adding DNS records.

## Part 2: Your server to Office 365

1. Add another connector. Choose **Your organization's email server** under **Connection from**. The destination is set to Office 365.
2. Enter a name.
3. For **Authenticating sent email**, verify either the certificate subject name that matches your domain (recommended) or the IP address of the sending server, which must belong exclusively to your organization.
4. Review and create.

## Configure Exchange to send through Microsoft 365

On an Exchange server, create a Send connector with smart host routing. The page's example is:

```powershell
New-SendConnector -Name "My company to Office 365" -AddressSpaces * -CloudServicesMailEnabled $true -Fqdn mail.contoso.com -RequireTLS $true -DNSRoutingEnabled $false -SmartHosts contoso-com.mail.protection.outlook.com -TlsAuthLevel CertificateValidation
```

The smart host follows the pattern shown in the example, with your domain's dot replaced by a hyphen. The page notes that CloudServicesMailEnabled needs Exchange 2013 or later.

## How multiple connectors are matched

Learn says one connector per mail flow direction is enough for most customers. When several exist, Microsoft 365 chooses in this order: a connector that exactly matches the recipient domain, then one that applies to all accepted domains, then wildcard patterns. In Learn's example, a connector for all accepted domains, one for contoso.com and one for *.contoso.com send mail for fabrikam.com, contoso.com and sales.contoso.com respectively.

## Not covered

The pages do not describe the three Use of connector options in detail, message size limits, error code catalogs or the exact MX record values. Learn's text also calls the external server's FQDN an IP address in one prerequisite, so rely on the FQDN meaning.

## Related

- [Exchange Online](https://www.m365.fm/entity/exchange-online/)

## Sources

- [Set up connectors to route mail between Microsoft 365 or Office 365 and your own email servers (Microsoft Learn)](https://learn.microsoft.com/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail)
