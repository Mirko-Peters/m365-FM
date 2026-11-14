---
title: "Fix NDR 5.7.57: Client Was Not Authenticated to Send Anonymous Mail"
summary: "NDR 5.7.57 means a device or application connected to smtp.office365.com without valid authentication. Learn says to verify the credentials and TLS, and its device setup page compares client SMTP submission, SMTP relay and Direct Send with ports and TLS."
status: review
publish: false
author: mirko-p
date: 2027-01-19
topics: [exchange-online, security-defaults]
keypoints:
  - "5.7.57 appears when you connect to smtp.office365.com to submit mail and do not authenticate with a user who has an Exchange Online mailbox."
  - "Learn says the problem is in the configuration of the connecting application or device, so admin and end user roles blur."
  - "Check that the credentials are correct and that the device can negotiate TLS, because TLS is required in order to authenticate."
  - "Client SMTP submission uses smtp.office365.com on port 587 (recommended) or 25 with TLS 1.2 or 1.3; port 465 does not meet the TLS requirement."
  - "Learn says Basic authentication for client SMTP submission is scheduled for deprecation and recommends alternatives such as OAuth, High Volume Email or Azure Communication Services Email."
faq:
  - q: "What does 5.7.57 mean?"
    a: "Learn says that when you connect to the smtp.office365.com endpoint to submit or relay messages through Microsoft 365, you must authenticate with the credentials of a user who has an Exchange Online mailbox. The bounce indicates a problem in the configuration of the connecting application or device."
  - q: "What are the two fixes on the NDR page?"
    a: "Verify that the credentials in the application or device are correct, and verify that it can negotiate TLS, since TLS is required to authenticate."
  - q: "Which port and server should a device use?"
    a: "For client SMTP submission, smtp.office365.com on TCP port 587 (recommended) or 25, with TLS or STARTTLS enabled using TLS 1.3 or 1.2. Learn says a device that defaults to port 465 does not support the required TLS versions for this method, and says to use the DNS name rather than an IP address."
  - q: "Is SMTP AUTH enabled for every mailbox?"
    a: "Learn's tip says SMTP AUTH is disabled for organizations created after January 2020 but can be enabled per mailbox. Verify it is enabled for the designated mailbox."
  - q: "Is Basic authentication still the way to go?"
    a: "Learn notes that client SMTP submission using Basic authentication in Exchange Online is scheduled for deprecation and recommends alternatives, and says it is not compatible with Security defaults in Microsoft Entra ID. It recommends OAuth for client SMTP submission."
---

NDR 550 5.7.57, with the text that the client was not authenticated to send anonymous mail during MAIL FROM, means a device or application submitted mail to Microsoft 365 without authenticating as a mailbox user. Microsoft Learn says the problem lies in the configuration of the connecting application or device. Its NDR page gives two checks: verify the credentials, and verify that the device can negotiate TLS. This article adds the setup facts from Learn's page on devices and applications that send email through Microsoft 365.

## What the NDR page says

When you connect to the `smtp.office365.com` endpoint to submit or relay messages through Microsoft 365, you must authenticate with the credentials of a user who has an Exchange Online mailbox. The bounce indicates a problem in the configuration of the connecting application or device. Learn notes that the distinction between end user and admin is blurred for this bounce because the problem sits in the application or device configuration.

The fixes:

1. In the configuration of the application or device, verify that the specified credentials are correct.
2. Verify that the application or device can negotiate TLS, because TLS is required to authenticate.

The NDR page is short. The rest of this article comes from the setup page.

## How the client SMTP submission method is set up

Learn describes client SMTP submission, also called authenticated SMTP submission or SMTP AUTH, as sending authenticated email using the credentials of a cloud mailbox. The settings in its table:

| Setting | Value |
| --- | --- |
| Server or smart host | smtp.office365.com, not an IP address |
| TCP port | 587 (recommended) or 25 |
| TLS or STARTTLS | Enabled, TLS 1.3 or TLS 1.2 |
| Username and password | Sign-in credentials of the designated mailbox |

Requirements and tips from the same page:

- You need a licensed Microsoft 365 mailbox that the device uses to send from.
- Port 25 may be blocked by firewalls or ISPs. If a device defaults to port 465, Learn says it does not support the required TLS versions for this method.
- SMTP AUTH is disabled for organizations created after January 2020, but you can enable it per mailbox.
- If the device sends from a different address than the one it signs in with, the sign-in account needs Send As permission, otherwise you get a different NDR, 5.7.60.
- If the device does not support TLS 1.2 or later, you cannot use this method. Learn suggests relaying through an on-premises email server instead.

## Basic authentication warning

Learn's setup page says client SMTP submission using Basic authentication in Exchange Online is scheduled for deprecation, and strongly recommends alternatives:

- **Internal recipients only:** High Volume Email for Microsoft 365.
- **Internal and external recipients:** Azure Communication Services Email.
- **On-premises email servers:** Basic authentication with the on-premises server, or anonymous relay (not open relay) on that server.

It also says Basic authentication is not compatible with Security defaults in Microsoft Entra ID and recommends OAuth for client SMTP submission.

## The other methods in short

Because the bounce text mentions anonymous mail, it is worth knowing what Learn says about methods that do not use a mailbox sign-in.

- **SMTP relay:** authenticates with an inbound connector, using a TLS certificate (recommended) or a static public IP address. It uses port 25 and the MX endpoint of your domain, and does not need a licensed mailbox. Learn says you cannot use it from a third-party hosted service such as Azure.
- **Direct Send:** sends unauthenticated mail directly to Microsoft 365 recipients only. Learn says most customers do not need it, and recommends it only for advanced customers. Mail to recipients outside your organization is rejected.
- **High Volume Email:** for large volumes to internal recipients, using an HVE account.

## Working through it

This section is my advice, not a Microsoft statement.

1. **Find out which method the device is meant to use.** Learn does not name the method that causes this bounce. My reading: the wording about anonymous mail may point to a device that is set up like relay or Direct Send, which do not sign in with a mailbox, but that connects to smtp.office365.com. Compare the device's server and port with Learn's tables.
2. **Check the server name.** Client submission uses smtp.office365.com, while relay and Direct Send use your domain's MX endpoint.
3. **Test the credentials interactively.** Sign in to the mailbox with the same username and password to rule out an expired password or a locked account.
4. **Check TLS support in the device.** Older printers and scanners may not offer TLS 1.2. Learn says if so, client submission cannot be used.
5. **Check whether SMTP AUTH is on for that mailbox.** Learn's tip says it can be off by default for newer organizations.
6. **Plan for the Basic authentication change.** If the device only supports username and password over Basic authentication, make a plan now, using the alternatives Learn lists.
7. **Document the working configuration.** Write down method, server, port and mailbox, so the next replacement device is quick to set up.

## What the pages do not cover

Neither page says exactly when Basic authentication for client SMTP submission stops working. The setup page links to a timeline article for that, so check it before you plan dates. How to enable SMTP AUTH for a mailbox is covered on a separate Learn page that the setup page links to.

## Related

- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Security defaults](https://www.m365.fm/entity/security-defaults/)

## Sources

- [Fix NDR error 5.7.57 in Exchange Online - Exchange (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/exchange/email-delivery/ndr/fix-error-code-5-7-57-in-exchange-online)
- [How to set up a multifunction device or application to send email using Microsoft 365 or Office 365 (Microsoft Learn)](https://learn.microsoft.com/exchange/mail-flow-best-practices/how-to-set-up-a-multifunction-device-or-application-to-send-email-using-microsoft-365-or-office-365)
