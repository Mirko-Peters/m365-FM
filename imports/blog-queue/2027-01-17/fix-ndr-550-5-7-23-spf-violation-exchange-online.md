---
title: "Fix NDR 550 5.7.23 Rejected Because of a Sender Policy Framework Violation"
summary: "NDR 550 5.7.23 usually means an SPF problem for a domain you send from in Microsoft 365. Learn lists four checks: verify the SPF DNS record, provision all your domains, add on-premises IPs, and rule out the high-risk delivery pool. Includes SPF syntax and the 10-lookup limit."
status: review
publish: false
author: mirko-p
date: 2027-01-17
topics: [exchange-online, spf, dkim, dmarc]
keypoints:
  - "Learn says error 550 5.7.23 most likely indicates an SPF configuration issue in your Microsoft 365 organization, and only an email admin can fix it."
  - "The checks are: verify the SPF record for your domain, provision all domains you own, add on-premises IPs to the SPF record, and rule out the high-risk delivery pool."
  - "A typical SPF record for Microsoft 365 only is v=spf1 include:spf.protection.outlook.com -all, and each domain or subdomain may have only one SPF record."
  - "SPF fails with a permanent error if evaluating the record needs more than 10 DNS lookups; each include counts, ip4 and ip6 values do not."
  - "Messages in the high-risk delivery pool will not pass SPF checks, so the destination can reject them."
faq:
  - q: "Who can fix error 5.7.23?"
    a: "Only an email admin in the Microsoft 365 organization. A user who receives the bounce should pass the information to the admin. The bounce's Diagnostic information for administrators section holds the original error from the external server."
  - q: "What does the SPF record for Microsoft 365 look like?"
    a: "For a domain whose only mail source is Microsoft 365, Learn gives v=spf1 include:spf.protection.outlook.com -all. With an on-premises server, its example adds an ip4 value before the include."
  - q: "Why do on-premises IPs matter?"
    a: "Learn says to add your on-premises IPs, if any, to the SPF record of any domains you send for, including unprovisioned domains you relay through Microsoft 365."
  - q: "What is the high-risk delivery pool?"
    a: "A separate IP address pool used to send outbound messages that Microsoft 365 determined to be spam. Learn says messages in it will not pass SPF checks and are not accepted by the destination organization, and that delivery is not guaranteed."
  - q: "How many DNS lookups may an SPF record need?"
    a: "No more than 10. Learn says each include, a, mx, exists and redirect counts as a lookup, while ip4 and ip6 values and the all mechanism do not."
---

NDR 550 5.7.23 means a receiving server rejected a message because of a Sender Policy Framework violation. Microsoft Learn says it most likely points to an SPF configuration issue in your Microsoft 365 organization, and that only an email admin can fix it. The page lists four checks. This article follows them and adds the SPF syntax rules from Learn's SPF setup page and the facts about the high-risk delivery pool.

## If you got the bounce

Learn says only an email admin in your organization can fix this. Pass the information to them. The **Diagnostic information for administrators** section of the bounce holds the original error message from when Microsoft 365 tried to send to the external server, so forward the whole bounce.

## Learn's four checks for admins

1. **Verify the SPF DNS record for your domain.** Learn recommends a publicly available SPF or DNS record checker.
2. **Provision all the domains you own.** Learn says Microsoft limits the number of emails with unprovisioned domains that a tenant can send.
3. **Add your on-premises IPs, if any, to the SPF record** of any domains you send for. That includes unprovisioned domains you relay through Microsoft 365.
4. **Check the high-risk delivery pool.** Verify that the outbound message was not identified as spam and routed through it. Messages in that pool will not pass SPF checks, so the destination organization will not accept them. If you want Bcc copies of outbound messages determined to be spam, Learn points to the outbound spam policy notifications. If a message was wrongly detected as spam, contact support.

## SPF syntax in Microsoft 365

Learn's SPF page gives this form:

```text
v=spf1 <valid mail sources> <enforcement rule>
```

For a domain whose only source of mail is Microsoft 365:

```text
v=spf1 include:spf.protection.outlook.com -all
```

For one with an on-premises server and Microsoft 365, Learn's example is:

```text
v=spf1 ip4:192.168.0.10 include:spf.protection.outlook.com -all
```

Points from the page:

- You create the record at your domain registrar or DNS host. There is no admin portal or PowerShell cmdlet in Microsoft 365 to manage SPF records.
- Each defined domain or subdomain needs its own SPF record, and only one SPF record is allowed per domain or subdomain. Multiple records cause `permerror`.
- Learn recommends `-all` (hard fail) for Microsoft 365 domains because it also recommends DKIM and DMARC. `~all` is soft fail, and `?all` is neutral and not recommended in production.
- You cannot modify the SPF record for `*.onmicrosoft.com`.
- For services you do not control, such as bulk mail services, Learn recommends a subdomain so problems do not affect the reputation of your main domain.
- For parked domains, Learn gives `v=spf1 -all`.

Learn's list of common syntax mistakes: a trailing period after the domain name, an equals sign instead of a colon after `include`, and a space between the colon and the domain name.

## The 10-lookup limit

SPF validation fails with a permanent error if checking the record needs more than 10 DNS lookups. The destination may then reject the message with an error such as the message exceeded the hop count or required too many lookups. Learn says `include`, `a`, `mx`, `exists` and `redirect` each count as a lookup, nested includes add more, and `ip4`, `ip6` and `all` do not count. To reduce lookups, Learn lists replacing includes with IP addresses for vendors with stable documented IPs, using subdomains (each has its own budget), and consolidating services. It advises against flattening Microsoft 365's include, because Microsoft's sending infrastructure uses dynamic IP addresses.

## The high-risk delivery pool

Learn says all outbound messages from Microsoft 365 datacenter servers that are determined to be spam go through the high-risk delivery pool, a separate IP address pool for low-quality messages. IP addresses in it can land on blocklists by design, and delivery to the recipients is not guaranteed. Messages whose source domain has no A record and no MX record in public DNS always go through it. To see which pool a message used, an Exchange Service Administrator or Global Administrator can use message trace and look at the `OutboundIpPoolName` property.

Forwarded or relayed messages may use a separate relay pool. Learn says to avoid it, the outbound sender must be in an accepted domain of the organization, or SPF must pass for the sending domain when the message arrives at Microsoft 365.

## A working order

This section is my advice, not a Microsoft statement.

1. **Read the diagnostic section of the bounce** for the receiving server's wording before you change DNS.
2. **Check the SPF record of the exact domain in the sender address.** A record on the parent domain does not cover a subdomain, as Learn says.
3. **Look for two SPF records.** It is a common cause of permerror, and easy to check.
4. **Count lookups** with a checker that does it, and trim if you are near 10.
5. **Run a message trace** for a failed message and read `OutboundIpPoolName`. If the high-risk pool shows up, the SPF record is not the real issue, and you should look at why the message was classified as spam.
6. **Set up DKIM and DMARC** alongside SPF, as Learn recommends for the best protection.

## What the NDR page does not say

The NDR page is short. It does not explain the limit on emails with unprovisioned domains, give the numbers, or describe how to provision a domain. Use the Microsoft 365 domains documentation for that, which I did not read for this article.

## Related

- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [SPF](https://www.m365.fm/entity/spf/)
- [DKIM](https://www.m365.fm/entity/dkim/)
- [DMARC](https://www.m365.fm/entity/dmarc/)

## Sources

- [Fix NDR error 5.7.23 in Exchange Online - Exchange (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/exchange/email-delivery/ndr/fix-error-code-5-7-23-in-exchange-online)
- [Set up SPF to identify valid email sources for your Microsoft 365 domain - Microsoft Defender for Office 365 (Microsoft Learn)](https://learn.microsoft.com/defender-office-365/email-authentication-spf-configure)
- [Outbound delivery pools - Microsoft Defender for Office 365 (Microsoft Learn)](https://learn.microsoft.com/defender-office-365/outbound-spam-high-risk-delivery-pool-about)
