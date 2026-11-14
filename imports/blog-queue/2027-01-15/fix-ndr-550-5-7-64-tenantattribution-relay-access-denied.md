---
title: "Fix NDR 550 5.7.64 TenantAttribution Relay Access Denied in Exchange Online"
summary: "NDR 550 5.7.64 TenantAttribution; Relay Access Denied SMTP means Exchange Online cannot match your on-premises mail to an inbound connector. Check the connector certificate and IP address, rerun the Hybrid Configuration Wizard or fix the connector by hand."
status: review
publish: false
author: mirko-p
date: 2027-01-15
topics: [exchange-online, exchange-server, exchange-online-powershell]
keypoints:
  - "Only an email admin can fix this NDR; the bounce arrives when mail relayed through Microsoft 365 for external recipients is refused."
  - "Learn ties the error to an inbound connector from your on-premises environment whose settings no longer match the sending server."
  - "Two causes are named: the certificate on the connector no longer matches the on-premises certificate, or the IP address on the connector no longer matches the submitting server."
  - "Option 1 is to rerun the Hybrid Configuration Wizard and select the new certificate; option 2 is to check send connector logs and update the connector by hand."
  - "To relay through Microsoft 365, the sender domain or the certificate domain must be verified in the tenant, otherwise an ATT36 error can appear as well."
faq:
  - q: "What does 550 5.7.64 TenantAttribution; Relay Access Denied mean?"
    a: "Microsoft Learn describes it as a bounce for mail that users send externally and that is relayed out through Microsoft 365. The cause named is an inbound connector that no longer matches the submitting on-premises server."
  - q: "What are the two causes?"
    a: "First, the connector uses a certificate from on-premises to identify the sending server, and that certificate no longer matches what is specified in Microsoft 365, for example after a configuration change or a new or renewed certificate with a different name. Second, the IP address on the connector no longer matches the IP address the submitting server uses."
  - q: "Do I need the Hybrid Configuration Wizard?"
    a: "It is option 1 and Learn recommends it for hybrid customers. Be aware that manual customizations to a hybrid configuration may have to be redone afterwards. Option 2 changes the inbound connector without the wizard."
  - q: "Where do I see the certificate that was sent?"
    a: "In the send connector protocol log on the on-premises server. Learn shows how to find the log path with Get-SendConnector and which fields hold the certificate subject, issuer, serial number and thumbprint."
  - q: "What is the ATT36 error?"
    a: "Learn says that if neither the sender domain nor the certificate domain is verified in the Microsoft 365 tenant, you may see the same error plus an explicit ATT36 error, and links a separate page on certificate based connectors."
---

NDR 550 5.7.64 TenantAttribution; Relay Access Denied means Microsoft 365 could not match mail relayed from your on-premises environment to a correctly configured connector. Microsoft Learn names two causes: the certificate on the inbound connector no longer matches the one the on-premises server presents, or the IP address on the connector no longer matches the sending server. The fix is to update the connector, either by rerunning the Hybrid Configuration Wizard or by changing it by hand. This guide follows two Learn pages on this error.

## What the bounce says and who can fix it

Users see this when they send mail externally and the mail is relayed out through Microsoft 365:

> 550 5.7.64 TenantAttribution; Relay Access Denied SMTP.

Learn says only an email admin in your Microsoft 365 organization can fix it, so a user who gets the bounce should pass the information to the admin. The **Diagnostic information for administrators** section of the bounce holds the original error message from when Microsoft 365 tried to send the message to the external server or service.

## Cause

Learn's general page says the problem happens when you use an inbound connector to receive messages from your on-premises environment and something changed on-premises that makes the connector configuration incorrect. Examples it gives:

- The host name in the certificate on the inbound connector no longer matches the source email server.
- The IP address of the source email server no longer matches the source IP address on the inbound connector.

The detailed page words the same two causes this way. The connector verifies the identity of the submitting server with a certificate from on-premises, which Learn calls the recommended method, the alternative being the IP address. Either the on-premises certificate no longer matches the certificate specified in Microsoft 365, for example after a configuration change or a new or renewed certificate that uses a different name, or the IP address on the Microsoft 365 connector no longer matches the one the submitting server uses.

To identify the submitting server and authorize relay, a connector must be configured correctly in Microsoft 365 and must match the submitting server.

## Option 1: rerun the Hybrid Configuration Wizard

Learn recommends this for hybrid customers. Rerunning the wizard updates the inbound connector in Exchange Online.

1. Download and run the Hybrid Configuration Wizard from the Exchange Online admin center.
2. On the transport certificate page, make sure the new certificate is selected.

When the wizard completes, the `TLSSenderCertificate` name should match the certificate that the on-premises server uses. Changes may take some time to take effect. Learn warns that any manual customization of the hybrid configuration, which it calls uncommon, may need to be redone, and points to the wizard logs for the earlier TLS sender certificate values and the changes made.

## Option 2: change the inbound connector without the wizard

First confirm that the new certificate is actually sent from on-premises Exchange to Microsoft 365 when users send external mail. If it is not, the problem is a certificate configuration on-premises. Confirm by enabling logging on the send connector that routes mail to Microsoft 365 and reading the logs.

To find the log location, run this against the source servers listed in the send connector. The page assumes a send connector named "outbound to Microsoft 365".

For Exchange 2010:

```powershell
(Get-SendConnector "outbound to Microsoft 365").SourceTransportServers | foreach {get-transportserver $_.name} | Select-Object name,SendProtocolLogPath
```

For Exchange 2013 and later:

```powershell
(Get-SendConnector "outbound to Microsoft 365").SourceTransportServers | foreach {get-transportservice $_.name} | Select-Object name,SendProtocolLogPath
```

Then:

1. In the send connector log, find the certificate given to Exchange Online. The sample log lines on the page show the certificate subject, issuer name, serial number and thumbprint.
2. Find the matching inbound connector in Microsoft 365 and check that its certificate value matches. In the page's example, the `TlsSenderCertificateName` value must be set to `*.contoso.com`.

## The verified domain requirement

Learn adds a note to option 2. To relay messages through Microsoft 365, the domain of the sender, or the domain of contoso.com in the example, must be verified in the Microsoft 365 tenant. Otherwise you may see an error like the one above together with an explicit ATT36 error. Learn links a separate page on configuring a certificate based connector to relay email through Microsoft 365 for the ATT36 error. I did not read that page, so I do not describe it here.

## A practical order of checks

This section is my advice, not a Microsoft statement.

1. **Ask what changed.** The two causes both start with a change on-premises: a renewed certificate, a new name on the certificate, or a new outbound IP address. Check change records and certificate renewal dates first.
2. **Decide which identification method your connector uses**, certificate or IP address, and compare only that value.
3. **Read the bounce's diagnostic section** and keep one full NDR for support.
4. **If you run hybrid,** try the wizard path first, as Learn recommends, and keep the wizard logs.
5. **If you change the connector by hand,** record the old values before you edit so you can go back.
6. **Send a test message** to an external address afterwards. Allow time for the change to take effect, as Learn says.
7. **Put certificate expiry on a calendar.** A renewed certificate with a different name is the cause I would expect to see again.

## Related

- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Exchange Server](https://www.m365.fm/entity/exchange-server/)
- [Exchange Online PowerShell](https://www.m365.fm/entity/exchange-online-powershell/)

## Sources

- [Fix NDR error 5.7.64 in Exchange Online - Exchange (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/exchange/email-delivery/ndr/fix-error-code-5-7-64-in-exchange-online)
- [550 5.7.64 TenantAttribution when users send mails externally - Exchange (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/exchange/email-delivery/ndr/relay-access-denied-smtp)
