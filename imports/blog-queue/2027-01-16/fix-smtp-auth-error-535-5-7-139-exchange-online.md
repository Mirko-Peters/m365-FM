---
title: "Fix SMTP AUTH Error 535 5.7.139 and Disabled Client Authentication in Exchange Online"
summary: "SMTP AUTH can be off at three levels: the organization setting, a per-mailbox override and security defaults or an authentication policy. Check each with Get-TransportConfig and Get-CASMailbox, and learn what Learn says about the two 535 5.7.139 federation variants."
status: review
publish: false
author: mirko-p
date: 2027-01-16
topics: [exchange-online, exchange-online-powershell, security-defaults]
keypoints:
  - "SMTP AUTH is controlled by an organization-wide setting and a per-mailbox setting that overrides it; the mailbox setting takes precedence."
  - "If security defaults is enabled, SMTP AUTH is already disabled in Exchange Online; an authentication policy that disables basic authentication for SMTP also blocks it."
  - "Check the tenant with Get-TransportConfig and a mailbox with Get-CASMailbox, then set Set-CASMailbox -SmtpClientAuthenticationDisabled to False."
  - "The Learn troubleshooting page lists two 535 5.7.139 variants, both about an on-premises federation service that is unreachable or lacks HTTPS."
  - "Learn recommends disabling SMTP AUTH in the organization and enabling it only for mailboxes that still need it, and says basic authentication for client submission is scheduled for deprecation."
faq:
  - q: "Where is SMTP AUTH switched off?"
    a: "Microsoft Learn names an organization-wide setting, a per-mailbox setting that overrides it, security defaults, and authentication policies. Mailbox values are True for disabled, False for enabled and blank for use the organization setting."
  - q: "How do I check and enable it for one mailbox?"
    a: "Run Get-CASMailbox -Identity <mailbox> | Format-List SmtpClientAuthenticationDisabled. If the value is True, run Set-CASMailbox -Identity <mailbox> -SmtpClientAuthenticationDisabled $false. A value of $null returns control to the organization setting."
  - q: "How do I check the organization setting?"
    a: "Run Get-TransportConfig | Format-List SmtpClientAuthenticationDisabled. True means SMTP AUTH is disabled for the organization. In the Exchange admin center it is the Turn off SMTP AUTH protocol for your organization toggle under Mail Flow settings."
  - q: "What do the two 535 5.7.139 messages on Learn mean?"
    a: "Learn lists 535 5.7.139 Authentication unsuccessful, federated STS service was unreachable, and 535 5.7.139 Authentication unsuccessful, the federated STS URL does not support HTTPS. Both relate to federation gateway servers hosted on-premises, where Microsoft could not reach the server or set up the secure connection."
  - q: "Is this setting a good idea long term?"
    a: "Learn highly recommends disabling SMTP AUTH in the organization and enabling it only for accounts that still require it. It also notes that client SMTP submission with basic authentication is scheduled for deprecation and recommends OAuth where the client supports it."
---

If SMTP AUTH fails with a 535 5.7.139 error, find out which of two situations you are in. If the error text says authentication was unsuccessful because a federated STS service could not be reached or does not support HTTPS, the problem sits with your on-premises federation server. If SMTP AUTH is simply switched off for the tenant or mailbox, check the organization setting, the mailbox override, security defaults and any authentication policy. This guide follows Learn's page on enabling or disabling SMTP AUTH, its troubleshooting page for devices that send mail, and its device setup page.

## What Learn says about the settings

SMTP AUTH, also called authenticated client SMTP submission, is used by POP3 and IMAP4 clients that need to send mail, and by applications, reporting servers and multifunction devices. It typically uses TCP port 587 and supports OAuth modern authentication in addition to basic authentication. Learn says virtually all modern email clients, such as Outlook, Outlook on the web, iOS Mail and Outlook for iOS and Android, do not use SMTP AUTH to send mail.

For that reason Learn highly recommends disabling SMTP AUTH in the organization and enabling it only for the mailboxes that still need it, using two settings:

- An organization-wide setting.
- A per-mailbox setting that overrides the organization-wide one. The mailbox setting takes precedence.

Two notes override both settings:

- If **security defaults** is enabled, SMTP AUTH is already disabled in Exchange Online. To use it you need to disable security defaults.
- If your authentication policy disables basic authentication for SMTP, clients cannot use SMTP AUTH even when the settings above allow it.

The device setup page adds a tip: SMTP AUTH is disabled for organizations created after January 2020, but you can enable it per mailbox.

## Check the organization setting

```powershell
Get-TransportConfig | Format-List SmtpClientAuthenticationDisabled
```

True means SMTP AUTH is disabled for the organization. To change it, run `Set-TransportConfig -SmtpClientAuthenticationDisabled $false` to enable, or `$true` to disable. In the Exchange admin center, go to the **Mail Flow** settings page and use **Turn off SMTP AUTH protocol for your organization**.

## Check and change one mailbox

```powershell
Get-CASMailbox -Identity <MailboxIdentity> | Format-List SmtpClientAuthenticationDisabled
```

Read the value as Learn does: `False` is enabled, `True` is disabled, blank means the organization setting applies. To enable it for the mailbox:

```powershell
Set-CASMailbox -Identity sean@contoso.com -SmtpClientAuthenticationDisabled $false
```

`$null` returns control to the organization setting. In the Microsoft 365 admin center the same switch is under **Users** > **Active users**, select the user, **Mail**, **Manage email apps**, and the **Authenticated SMTP** checkbox.

To list mailboxes where SMTP AUTH is enabled, Learn gives `Get-CASMailbox -ResultSize unlimited` filtered on `SmtpClientAuthenticationDisabled -eq $false`. Use `$true` for disabled and `$null` for controlled by the organization setting.

## The 535 5.7.139 variants on Learn

The troubleshooting page for printers, scanners and line of business apps lists two messages with this code:

- **535 5.7.139 Authentication unsuccessful, federated STS service was unreachable.** It relates to federation gateway servers hosted on-premises by customers. Microsoft could not reach the configured server location and so could not authenticate the federated user.
- **535 5.7.139 Authentication unsuccessful, the federated STS URL does not support HTTPS.** Also about on-premises federation servers. Microsoft could not establish the required secure connection. Learn notes this may be due to the deprecation of TLS 1.0 and TLS 1.1 in 2022 and says servers must be able to use TLS 1.2.

The same page lists other SMTP AUTH errors with their own checks. For `535 5.7.3 Authentication unsuccessful` and `5.7.57 Client not authenticated to send mail`, check that SMTP AUTH is enabled on the licensed mailbox, disable MFA for that mailbox, check security defaults, and exclude the mailbox from a Conditional Access policy that blocks legacy authentication. Learn adds a caution not to turn off security defaults unless you understand the risks.

The Learn pages I used do not contain the wording some clients show for a tenant with SMTP AUTH disabled. If your error text differs from the ones above, compare the message with the checks in this guide, and treat the Learn wording as the reference.

## What else to check

From the device setup page:

- The server is `smtp.office365.com`, never an IP address.
- The port is 587 (recommended) or 25, and the device must support TLS 1.3 or TLS 1.2. A device that defaults to port 465 does not support the required TLS versions for client submission.
- The sign-in mailbox must be licensed. If the device sends from another address, the sign-in account needs Send As on it, or you get 5.7.60.
- Client submission limits: 10,000 recipients per day and 30 messages per minute.
- Basic authentication for client SMTP submission is scheduled for deprecation. Learn lists alternatives such as High Volume Email for internal recipients only, and Azure Communication Services Email for internal and external recipients.

## A short order of checks

This section is my advice, not a Microsoft statement.

1. Copy the exact error text, since the checks differ for federation messages and for disabled authentication.
2. Check the mailbox value first, then the organization value, since the mailbox wins.
3. Check security defaults and authentication policies if both look fine.
4. Enable SMTP AUTH for the single mailbox the device needs, not for the whole tenant.
5. Plan the move to OAuth or another supported method, since Learn says the basic authentication path is scheduled for deprecation.

## Related

- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Exchange Online PowerShell](https://www.m365.fm/entity/exchange-online-powershell/)
- [Security defaults](https://www.m365.fm/entity/security-defaults/)

## Sources

- [Enable or disable SMTP AUTH in Exchange Online (Microsoft Learn)](https://learn.microsoft.com/exchange/clients-and-mobile-in-exchange-online/authenticated-client-smtp-submission)
- [Fix issues with printers, scanners, and LOB apps that send email using Microsoft 365 - Exchange (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/exchange/email-delivery/fix-issues-with-printers-scanners-and-lob-applications-that-send-email-using-off)
- [How to set up a multifunction device or application to send email using Microsoft 365 or Office 365 (Microsoft Learn)](https://learn.microsoft.com/exchange/mail-flow-best-practices/how-to-set-up-a-multifunction-device-or-application-to-send-email-using-microsoft-365-or-office-365)
