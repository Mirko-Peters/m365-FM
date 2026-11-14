---
title: "SMTP AUTH Basic Authentication Retirement in Exchange Online: Timeline and Migration Options"
summary: "Basic authentication for SMTP AUTH client submission in Exchange Online: the schedule in Message Center post MC786329 (updated January 27, 2026), what Learn says about other protocols, the alternatives and a migration order."
status: review
publish: false
author: mirko-p
date: 2027-01-24
topics: [exchange-online, oauth-2-0, graph]
keypoints:
  - "Learn says Basic authentication is disabled in all tenants for most protocols, and SMTP AUTH was disabled in tenants where it was unused. SMTP AUTH client submission is retired separately."
  - "Message Center update of January 27, 2026: unchanged until December 2026, off by default for existing tenants at the end of December 2026, final removal date announced in the second half of 2027."
  - "New tenants created after December 2026 get Basic authentication for SMTP AUTH unavailable by default, with OAuth as the supported method."
  - "The earlier plan of March 1 to April 30, 2026 for removal is on hold according to the same post."
  - "Options named: OAuth for SMTP AUTH, Microsoft Graph sendMail, Microsoft 365 High Volume Email in public preview for internal recipients, hybrid with on-premises Exchange, or a third-party solution."
faq:
  - q: "Is Basic authentication for SMTP AUTH already gone?"
    a: "Not completely, according to the sources read. Learn says Basic authentication is disabled in all tenants for the protocols it lists and that SMTP AUTH was disabled in tenants where it was not being used. For SMTP AUTH client submission, the Message Center post MC786329, as updated on January 27, 2026, says the behavior stays unchanged until December 2026, then Basic is disabled by default for existing tenants at the end of December 2026 and admins can still enable it. Check your tenant, since the dates may have moved again."
  - q: "What is the final removal date?"
    a: "The January 27, 2026 update says Microsoft will announce the final removal date in the second half of 2027, with a follow-up Message Center post. The earlier schedule of March 1 to April 30, 2026 is on hold. Learn points to the Exchange team blog for the latest milestones, so use the current official announcement."
  - q: "What are the alternatives to SMTP AUTH with a password?"
    a: "Use OAuth for SMTP AUTH if your client supports it. Learn also names the Microsoft Graph API for sending mail. The Message Center post names Microsoft 365 High Volume Email, which was in public preview, for sending to recipients inside your tenant, a hybrid setup with on-premises Exchange using Basic authentication or a Receive connector that allows anonymous relay, or a third-party solution."
  - q: "How do I find which devices and apps still use Basic authentication?"
    a: "The Message Center post says the SMTP AUTH Clients Submission Report in the Exchange admin center has an Authentication Protocol column since October 18, 2024. It shows whether Basic authentication or OAuth is used. Use it to list devices such as printers and scanners, scripts and line of business apps."
  - q: "Does Outlook support OAuth for POP and IMAP?"
    a: "Learn says OAuth 2.0 support for POP, IMAP and SMTP AUTH was released in 2020, that updated client apps such as Thunderbird support it, and that there is no plan for Outlook clients to support OAuth for POP and IMAP. Outlook can connect using MAPI over HTTP on Windows and EWS on Outlook for Mac."
---

Basic authentication for SMTP AUTH client submission is the last part of the Exchange Online Basic authentication story that is still moving. The Microsoft Learn page on the deprecation says Basic authentication is now disabled in all tenants for the listed protocols, and points to the Exchange team announcement for the SMTP AUTH timeline. This article combines the Learn page with the Message Center post MC786329, in its version updated on January 27, 2026, which I read through a public mirror of the Message Center text. Dates can change again, so check your own Message Center and the official announcement before you plan.

## What Learn says about the earlier retirement

- Before December 31, 2022 you could re-enable the affected protocols. Now no one, neither you nor Microsoft support, can re-enable Basic authentication in a tenant for those protocols.
- Microsoft removed Basic authentication for Exchange ActiveSync (EAS), POP, IMAP, Remote PowerShell, Exchange Web Services (EWS), Offline Address Book (OAB), Autodiscover, Outlook for Windows and Outlook for Mac.
- SMTP AUTH was disabled in all tenants where it was not being used.
- Cloud environments differed: Office 365 operated by 21Vianet began on March 31, 2023, and the others were subject to October 1, 2022.

The reason given is that Basic authentication sends a username and password with every request, makes stolen credentials easier to reuse, and makes MFA hard or impossible to enforce. OAuth 2.0 access tokens have a limited lifetime and are specific to an app and resource.

## SMTP AUTH: the timeline from Message Center

The Message Center post (MC786329, last updated January 27, 2026, as shown on the mirror I read) lists:

| When | What |
| --- | --- |
| Until December 2026 | Basic authentication behavior for SMTP AUTH client submission unchanged |
| End of December 2026 | Basic authentication disabled by default for existing tenants. Admins can still enable it if needed |
| Tenants created after December 2026 | Basic authentication unavailable by default, OAuth is the supported method |
| Second half of 2027 | Microsoft announces the final removal date, in a follow-up Message Center post |

The earlier schedule, removal starting March 1, 2026 and finishing April 30, 2026, is on hold. Learn confirms the situation in another way. It says SMTP AUTH is currently available, that Microsoft has announced plans to retire Basic authentication for it, and that, since the timeline has been updated, you should use the latest official announcement. I could not open that blog post itself, so I rely on the Message Center text.

Because this article is dated after the end of December 2026, check whether your tenant default has already changed. Learn and the post do not name the setting for it, and I will not guess the name.

## Find what still uses Basic

The Message Center post says that on October 18, 2024 the **SMTP AUTH Clients Submission Report** in the Exchange admin center gained an **Authentication Protocol** column that shows Basic or OAuth. Use it first. Typical senders are printers and scanners, monitoring tools, scripts and line-of-business apps. The post does not list them, and that list is my experience.

## Your options

1. **Switch the client to OAuth.** If the client supports OAuth for SMTP AUTH, follow the Learn instructions for authenticating an IMAP, POP or SMTP connection by using OAuth. Application developers keep the protocol but must implement modern authentication on top of the Microsoft identity platform. Learn also names a PowerShell script to test IMAP access after you enable OAuth.
2. **Use Microsoft Graph.** Learn names the Graph API, for example send mail, as an alternative for sending authenticated mail.
3. **Microsoft 365 High Volume Email.** The post names it, as public preview at the time of the update, for sending to recipients inside your tenant.
4. **Hybrid with on-premises Exchange.** Authenticate with on-premises Exchange using Basic, or configure a Receive connector that allows anonymous relay.
5. **Third-party solution.** The post says that if you must use Basic to send through Exchange Online, you should use one of the alternatives or a third-party solution, whatever your email volume.

## Related protocol notes from Learn

- Outlook for Windows since 2016 has modern authentication on by default. Outlook 2013 needs a registry setting. Outlook 2007 and 2010 cannot use it.
- Outlook for iOS and Android natively supports modern authentication.
- The Exchange Online PowerShell module uses modern authentication. Learn explains that enabling Basic on WinRM on the local machine is not the same as using Basic to authenticate to the service.
- EWS supports modern authentication already, but Learn notes it will eventually be deprecated and recommends Graph.

## Migration order (my advice)

This is my suggestion, not Microsoft guidance:

1. Export the SMTP AUTH client report and assign an owner to each sender.
2. Split senders into three groups: can use OAuth, can use another route such as Graph, and cannot change.
3. For the third group, decide early between a relay design and a replacement device, since the final date is still open.
4. Test with one device or app per group before you change all.
5. Document the sender, mailbox and method, so the next review is short.
6. Re-check the Message Center every few months, since the dates have already moved once.

## Related

- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [OAuth 2.0](https://www.m365.fm/entity/oauth-2-0/)
- [Microsoft Graph](https://www.m365.fm/entity/graph/)

## Sources

- [Deprecation of Basic authentication in Exchange Online (Microsoft Learn)](https://learn.microsoft.com/exchange/clients-and-mobile-in-exchange-online/deprecation-of-basic-authentication-exchange-online)
- [MC786329 - Exchange Online to retire Basic Auth for Client Submission (SMTP AUTH) (Microsoft 365 Message Center, public mirror)](https://mc.merill.net/message/MC786329)
