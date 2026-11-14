---
title: "Enforce a DMARC reject policy and fix third-party email delivery failures"
summary: "Move a Microsoft 365 domain from p=none to p=reject without blocking legitimate mail. Covers SPF and DKIM prerequisites, third-party senders, alignment failures, ARC and reading the headers."
status: review
publish: false
author: mirko-p
date: 2026-12-08
topics: [dmarc, spf, dkim, exchange-online-protection]
keypoints:
  - "Microsoft recommends going from p=none to p=quarantine to p=reject, using pct values such as 10, 25, 50, 75 and 100 to raise the share of affected mail gradually."
  - "A message passes DMARC if SPF or DKIM passes and aligns with the From domain. Third-party services usually fail because they use their own MAIL FROM and DKIM domain."
  - "Send bulk and third-party mail from a subdomain such as marketing.contoso.com. Each subdomain needs its own SPF and DKIM."
  - "Read the Authentication-Results header: dmarc=fail action=oreject means the sender's p=reject policy applied."
  - "For legitimate forwarded mail that fails DMARC, Microsoft prefers a trusted ARC sealer over mail flow rules or Tenant Allow/Block List entries."
faq:
  - q: "Which DMARC rollout order does Microsoft recommend?"
    a: "According to Microsoft Learn, start with p=none and monitor reports, then move to p=quarantine, then to p=reject. The page suggests raising pct in steps of 10, 25, 50, 75 and 100 during each stage, and repeating the process for subdomains of increasing volume while leaving the parent domain for last."
  - q: "Why does mail from my marketing platform fail DMARC?"
    a: "Microsoft Learn explains that the service often uses its own domain in MAIL FROM and does not sign with your domain. Then neither SPF nor DKIM aligns with your From address. The fix is to configure DKIM signing with your domain at the service, or to change the MAIL FROM to your domain or subdomain."
  - q: "Does Microsoft 365 reject mail from other domains that publish p=reject?"
    a: "With the Honor DMARC record policy setting on, which Learn marks as recommended, inbound mail that fails DMARC with p=reject is rejected during SMTP with a 550 5.7.1 error. Mail with p=quarantine goes to the Junk Email folder, configurable to quarantine."
  - q: "Should I use SPF ~all or -all?"
    a: "The SPF page on Microsoft Learn recommends -all (hard fail) because DKIM and DMARC are also recommended. It explains that with ~all the DMARC policy is effectively ignored for SPF failures when the message has no DKIM signature."
  - q: "Can I manage DMARC records in the Microsoft 365 admin center?"
    a: "Only for the onmicrosoft.com domain. Learn says there are no admin portals or PowerShell cmdlets in Microsoft 365 to manage DMARC records for custom domains, so you create the _dmarc TXT record at your DNS host. For the onmicrosoft.com domain you add it under Settings > Domains > DNS records."
---

To enforce `p=reject` safely, make sure every legitimate sender passes SPF or DKIM with a domain that matches your From address, watch the DMARC reports at `p=none`, and then tighten the policy in steps. Most delivery failures after enforcement come from third-party services that send as your domain without being set up for it.

## Prerequisites: SPF and DKIM first

Microsoft Learn says you need SPF TXT records and DKIM signing for all custom domains and subdomains you use to send email before DMARC can work.

**SPF.** The standard record for a domain that only uses Microsoft 365 is:

```text
v=spf1 include:spf.protection.outlook.com -all
```

Keep these rules in mind:

- Only one SPF record per domain or subdomain. Multiple records cause a permanent error.
- A limit of 10 DNS lookups applies. `include:`, `a`, `mx`, `exists` and `redirect` each count, and nested includes add more.
- Microsoft recommends `-all`. With `~all`, DMARC is effectively ignored for SPF failures when the message has no DKIM signature.
- Do not flatten `include:spf.protection.outlook.com`, because the sending IP addresses change frequently.

**DKIM.** In the Defender portal, go to **Email & collaboration** > **Policies & rules** > **Threat policies** > **Email authentication settings**, or open `https://security.microsoft.com/authentication`, then select the **DKIM** tab. Publish the two CNAME records (`selector1._domainkey` and `selector2._domainkey`) at your DNS host and enable signing. Copy the exact target values from the portal or from `Get-DkimSigningConfig`, because the format can differ between domains.

## Roll out the policy in stages

Learn recommends this order for the `_dmarc` TXT record:

1. `v=DMARC1; p=none; pct=100; rua=mailto:rua@contoso.com` to collect aggregate reports.
2. Move to `p=quarantine`, raising `pct` through 10, 25, 50, 75 and 100.
3. Move to `p=reject` after enough monitoring, again with optional `pct` steps.
4. Repeat for subdomains, saving the parent domain for last.

Subdomains inherit the parent record unless they have their own. If `pct` is missing, the default is 100. Microsoft 365 does not send forensic (`ruf`) reports, but it sends aggregate reports to domains with a valid `rua` address when the MX record points directly to Microsoft 365.

## Why legitimate mail fails

A message passes DMARC if one or both of the SPF and DKIM checks pass **and align** with the From domain. It fails if both fail. Learn lists the common causes:

| Scenario | Cause | Fix |
|---|---|---|
| Third-party service sends as you | MAIL FROM uses the service's domain and there is no DKIM signature with your domain | Configure DKIM with your domain at the service, or change MAIL FROM to your domain or subdomain |
| DKIM passes, DMARC fails | The `d=` domain does not match the From domain | Sign with the exact From domain |
| Subdomain with strict alignment | `aspf=s` fails for subdomain senders | Use `aspf=r` or match the From address |
| Forwarding | The envelope sender changes and DKIM may break | Trusted ARC sealer at the destination |
| Mailing lists | Body changes break DKIM | ARC, or accept some failures |

## Handle third-party senders

Microsoft's advice is to use a subdomain for services you do not control, such as bulk mail platforms. That keeps their reputation separate from your main domain. Each subdomain needs its own SPF and DKIM records.

For each service:

1. Ask the vendor how to sign with your own domain (a DKIM public key to publish as a TXT or CNAME record).
2. Publish that key under the subdomain.
3. Add the vendor's `include:` to the subdomain SPF record, mindful of the 10-lookup limit.
4. Send a test message and check the headers.

## Read the headers

In the Authentication-Results header, `dmarc=fail action=oreject` means the sender published `p=reject`. `action=quarantine` means `p=quarantine`, and `action=pct.reject` or `action=pct.quarantine` means the message fell in the sampled percentage. `dmarc=bestguesspass` means no DMARC record was published and Microsoft inferred a pass. If SPF and DKIM both pass but `dmarc=fail`, the domains are not aligned.

## Inbound mail from others

For mail you receive, the **Honor DMARC record policy** setting in the anti-phishing policy controls what happens. With it on, `p=reject` mail is rejected at SMTP. To check it:

```powershell
Get-AntiPhishPolicy | Format-List Name, HonorDmarcPolicy, DmarcQuarantineAction, DmarcRejectAction
```

If a service in front of your mailbox changes messages, add it as a **trusted ARC sealer** under the **ARC** tab on the same Email authentication settings page. Use the vendor's signing domain from the `d=` value in the ARC-Seal header, not your own. Learn says allow up to 30 minutes for the change, and that ARC overrides DMARC only, not spam filtering. Other options, a mail flow rule or a Tenant Allow/Block List entry, are less preferred, and the allow entry expires in 30 days.

## Common mistakes

- Jumping to `p=reject` without reading aggregate reports.
- Forgetting parked domains. Learn suggests `v=DMARC1; p=reject;` for domains that send no mail.
- Adding a vendor to SPF but not signing with DKIM.
- Using a trailing period or `=` instead of `:` in the SPF record.
- Adding an ARC sealer you do not fully trust.

## Related

- [DMARC](https://www.m365.fm/entity/dmarc/)
- [SPF](https://www.m365.fm/entity/spf/)
- [DKIM](https://www.m365.fm/entity/dkim/)
- [Exchange Online Protection](https://www.m365.fm/entity/exchange-online-protection/)

## Sources

- [Set up DMARC in Microsoft 365](https://learn.microsoft.com/en-us/defender-office-365/email-authentication-dmarc-configure)
- [Set up SPF in Microsoft 365](https://learn.microsoft.com/en-us/defender-office-365/email-authentication-spf-configure)
- [Set up DKIM for custom domains](https://learn.microsoft.com/en-us/defender-office-365/email-authentication-dkim-configure)
- [Configure trusted ARC sealers](https://learn.microsoft.com/en-us/defender-office-365/email-authentication-arc-configure)
