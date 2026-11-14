---
title: "Renew the Exchange Hybrid TLS Certificate on Mailbox and Edge Transport Servers Safely"
summary: "What Microsoft Learn documents for replacing the third-party certificate used for hybrid mail flow: requirements, renewal steps, the TlsCertificateName and Hybrid Configuration wizard trap, Edge Subscription handling and a post-change check."
status: review
publish: false
author: mirko-p
date: 2026-12-20
topics: [exchange-server, exchange-online, public-key-infrastructure]
keypoints:
  - "Hybrid mail transport needs a third-party CA certificate on all Mailbox servers and all Edge Transport servers. Edge servers must share the same issuing CA and subject."
  - "After a certificate swap, a stale TlsCertificateName on the hybrid receive connector causes missing STARTTLS and failed mail from Microsoft 365. Rerunning the Hybrid Configuration wizard updates it."
  - "When you enable the new certificate for SMTP, choose No at the prompt to overwrite the default certificate, otherwise EdgeSync breaks and has to be re-created."
  - "If you renew or replace a CA-issued certificate on a subscribed Edge Transport server, Learn says to remove the old certificate and then delete and recreate the Edge Subscription."
  - "No page read promises zero downtime. A staged change, with the new certificate installed and verified before the old one is removed, is the author's suggestion."
faq:
  - q: "Which certificate does Exchange hybrid mail flow need?"
    a: "Learn says a hybrid deployment must use a certificate purchased from a trusted third-party CA for secure mail transport. It must be installed on all on-premises Mailbox servers and, when Edge Transport servers are deployed, on all Edge Transport servers as well."
  - q: "What symptoms appear if the receive connector still points to the old certificate?"
    a: "Learn lists mail from the Internet or Microsoft 365 failing with TLS, the STARTTLS command missing in a Telnet session on port 25, and Event ID 12014 from MSExchangeFrontEndTransport in the Application log."
  - q: "What do I do about Edge Subscriptions after renewing a certificate?"
    a: "The Learn article on renewing Exchange certificates says that for a CA-issued certificate renewed or replaced on a subscribed Edge Transport server, you remove the old certificate and then delete and recreate the Edge Subscription."
  - q: "Which certificate does Exchange pick for inbound STARTTLS?"
    a: "Per Learn, Exchange looks up the receive connector TlsCertificateName or FQDN, then requires an X.509 v3 certificate with a private key, a matching subject or SAN, and SMTP enabled. Among eligible certificates it sorts by the most recent Valid from date."
  - q: "Is Exchange 2016 or 2019 still supported for this?"
    a: "The Learn pages read state that Exchange Server 2016 and 2019 reach end of support on October 14, 2025, a date already passed. Check which Exchange version your hybrid server runs and plan an upgrade."
---

Replacing the TLS certificate used for Exchange hybrid mail flow is mostly a question of order. The new certificate has to be installed, enabled for SMTP and referenced correctly by the hybrid receive connector before the old one disappears, and Edge Transport servers need extra handling. Microsoft Learn documents each part separately. It does not promise a zero-downtime procedure, so this article lays out the documented steps and marks the suggested staging as the author's own.

## What the certificate must be

Learn's certificate requirements for hybrid deployments say:

- Use a certificate purchased from a trusted third-party CA for hybrid secure mail transport.
- The certificate must be installed on all on-premises Mailbox servers (Exchange 2016 and newer).
- With Edge Transport servers, the certificate must also be installed on all of them. Each Edge Transport server must use a certificate that shares the same issuing CA and the same subject, for hybrid secure mail to work correctly.
- With Exchange servers in multiple Active Directory forests, use a separate third-party certificate per forest.
- The suggested minimum names are the primary shared SMTP domain as subject, the external Autodiscover FQDN as a SAN, and the external FQDN of the Edge Transport servers as a SAN.

Learn also weighs one certificate across servers (cheaper but replacement touches every server) against one certificate per server (replacement affects only that server). The on-premises federation trust uses a self-signed certificate by default, and Learn says there is no need to replace it with a third-party certificate unless you have specific requirements.

## How Exchange picks the inbound certificate

The page on inbound STARTTLS certificate selection explains why a new certificate is sometimes ignored. In order:

1. The receive connector must have **TLS** in its **AuthMechanism**. Otherwise the server does not advertise X-STARTTLS and loads no certificate.
2. The `TlsCertificateName` value is read from the connector. If it is null, the connector FQDN is used, and then the server's physical FQDN.
3. The local certificate store is searched for certificates that match. If none is found, X-STARTTLS is not advertised and **Event ID 12014** is logged.
4. Eligible certificates must be X.509 version 3 or later, have a private key, contain the name in Subject or SAN, and have SMTP enabled with `Enable-ExchangeCertificate`. Learn notes that a matching certificate without SMTP enabled is still chosen, but TLS fails later.
5. Eligible certificates are sorted by the most recent **Valid from** date, and the first valid PKI certificate is used. If none exists, the first self-signed certificate is used.

An expired certificate logs Event ID 12016 but STARTTLS is still advertised. Learn says you must renew it regardless.

## Documented renewal steps

The article on renewing Exchange certificates covers Exchange 2016, 2019 and Subscription Edition:

- Renew a CA-issued certificate with the same CA that issued it. If you change CAs or the original has a problem, create a new certificate request instead.
- In the Exchange admin center (Exchange 2019 CU15 and later), go to **Servers** > **Certificates**, select the server, select the certificate and use **Renew**. In earlier builds, use the Exchange Management Shell.
- The shell route creates a renewal request with `Get-ExchangeCertificate -Thumbprint <Thumbprint> | New-ExchangeCertificate -GenerateRequest`. Without the `KeySize` parameter the key is 2048 bit RSA.
- You then complete the pending request on the server with the certificate the CA returns.
- Learn warns that removing, renewing or assigning services to a certificate can remove it from Exchange Back End and Default Web Site, so check bindings afterward.

For Edge: if you renew or replace a CA-issued certificate on a subscribed Edge Transport server, remove the old certificate and then delete and recreate the Edge Subscription.

## The hybrid receive connector trap

Learn's troubleshooting article describes a known failure after installing a new certificate. Symptoms:

- No mail from the Internet or Microsoft 365 over TLS.
- The `STARTTLS` command is missing in a Telnet session to port 25.
- Event ID 12014 from MSExchangeFrontEndTransport.
- The hybrid connectivity check fails with a 450 4.4.101 proxy session error that mentions "STARTTLS is required to send mail".

The cause is the `TlsCertificateName` property of the hybrid server's receive connector holding old certificate information after the old certificate was removed. The Hybrid Configuration wizard sets the property correctly when run after a new certificate is installed. If the wizard is not run, or fails, the property stays stale.

The documented resolution:

1. Enable the new certificate for SMTP with `Enable-ExchangeCertificate <thumbprint> -services SMTP`. When asked whether to overwrite the default certificate, choose **No**. Learn says otherwise EdgeSync breaks and has to be re-created.
2. Remove the `TlsCertificateName` property from the receive connector with `Get-ReceiveConnector "ServerName\Default Frontend ReceiveConnector" | Set-ReceiveConnector -TlsCertificateName $null`.
3. Rerun the Hybrid Configuration wizard so it writes the new certificate information.

## A staged change (author's suggestion)

The sequence below is not a Learn procedure. It only orders documented actions:

1. Request and install the new certificate on every Mailbox server and Edge Transport server, keeping the old one in place.
2. Check that the new certificate meets the selection criteria above and that SMTP is enabled where intended.
3. Fix the receive connector `TlsCertificateName` and rerun the Hybrid Configuration wizard.
4. For Edge servers, plan the Edge Subscription recreation in a quiet window.
5. Test inbound and outbound mail with the hybrid connectivity check and a Telnet session, then remove the old certificate.

Learn does not say how long mail flow can be interrupted during the Edge Subscription recreation, so test it first.

## What the documentation does not say

The pages read do not describe a zero-downtime guarantee, a recommended time window or the exact behavior of mail queues during an Edge Subscription change. A Microsoft Community Hub article on TLS certificates in hybrid exists, but its body could not be read for this article, so nothing here relies on it.

## Related

- [Exchange Server](https://www.m365.fm/entity/exchange-server/)
- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Public key infrastructure](https://www.m365.fm/entity/public-key-infrastructure/)

## Sources

- [Certificate requirements for hybrid deployments (Microsoft Learn)](https://learn.microsoft.com/en-us/exchange/certificate-requirements)
- [Renew an Exchange Server certificate (Microsoft Learn)](https://learn.microsoft.com/en-us/exchange/architecture/client-access/renew-certificates)
- [Can't receive mail if installing new certificate (Microsoft Learn)](https://learn.microsoft.com/en-us/troubleshoot/exchange/email-delivery/cannot-receive-mail-with-new-certificate)
- [Selection of inbound STARTTLS certificates (Microsoft Learn)](https://learn.microsoft.com/en-us/exchange/mail-flow/mail-routing/inbound-starttls-certificates-selection)
