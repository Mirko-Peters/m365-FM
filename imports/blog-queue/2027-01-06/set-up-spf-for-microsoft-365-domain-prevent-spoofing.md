---
title: "How to Set Up SPF for a Microsoft 365 Domain to Prevent Spoofing"
summary: "Set up SPF for a Microsoft 365 domain: the core record, adding the TXT record at your DNS host, one record per domain, the 10 lookup limit, hard fail vs soft fail, subdomains, parked domains and common syntax mistakes."
status: review
publish: false
author: mirko-p
date: 2027-01-06
topics: [exchange-online-protection, spf]
keypoints:
  - "Most Microsoft 365 organizations need the record v=spf1 include:spf.protection.outlook.com -all, published as a TXT record at the DNS host. The admin center has no SPF option."
  - "Only one SPF TXT record is allowed per domain or subdomain. Several records cause permerror, so combine all senders in one record."
  - "More than 10 DNS lookups returns permerror. include, a, mx, exists and redirect count, while ip4, ip6 and all do not."
  - "Learn recommends -all for Microsoft 365 domains. Soft fail with ~all is accepted but marked, and DMARC is effectively ignored for ~all failures when DKIM is missing."
  - "Do not flatten the Microsoft 365 include. Its IP addresses change frequently."
faq:
  - q: "What is the SPF record for Microsoft 365?"
    a: "Most organizations need v=spf1 include:spf.protection.outlook.com -all. GCC High and DoD use include:spf.protection.office365.us, and 21Vianet uses include:spf.protection.partner.outlook.cn."
  - q: "Where do I add it?"
    a: "At your domain registrar or DNS hosting provider as a TXT record. Learn says there are no Microsoft 365 admin portal or PowerShell options for SPF, and recommends a TTL of at least 3600 seconds."
  - q: "Can I have two SPF records?"
    a: "No. Only one SPF TXT record is allowed per domain or subdomain. Multiple records cause permerror. Combine all authorized sources into one record."
  - q: "What is the lookup limit?"
    a: "Ten DNS lookups. Exceeding it returns permerror and the message is rejected with an NDR such as The message required too many lookups. Learn lists include, a, mx, exists and redirect as counting, and ip4, ip6 and all as not counting."
  - q: "Should I use -all or ~all?"
    a: "Learn recommends -all for Microsoft 365 domains, so that DMARC can act on SPF failures. ~all accepts and marks messages. ?all is for testing and not recommended in production."
---

Publish one SPF TXT record per domain at your DNS host. For a domain that sends only through Microsoft 365, the record is `v=spf1 include:spf.protection.outlook.com -all`. Add other senders to the same record, keep within 10 lookups and use hard fail. This guide follows the Microsoft Learn page on setting up SPF in Microsoft 365 to prevent spoofing.

## The core record

```text
v=spf1 include:spf.protection.outlook.com -all
```

Other regions use different include values: `include:spf.protection.office365.us` for GCC High and DoD, and `include:spf.protection.partner.outlook.cn` for 21Vianet. The general form is `v=spf1 [ip4:/ip6: addresses] [include:domain...] <-all | ~all | ?all>`. An example with on-premises servers:

```text
v=spf1 ip4:192.168.0.10 ip4:192.168.0.12 include:spf.protection.outlook.com -all
```

## Add or update the record

- There is no Microsoft 365 admin portal option or PowerShell command for SPF. You create the TXT record at your registrar or DNS hosting provider.
- Learn recommends a TTL of at least 3600 seconds.
- If you are unfamiliar with DNS, contact your registrar.
- You cannot change the SPF record for `*.onmicrosoft.com`. Microsoft manages it.

## One record, many senders

- Only one SPF TXT record is allowed per domain or subdomain. Multiple records cause `permerror`.
- Combine all authorized sources in the one record with `ip4:`, `ip6:` and `include:`.
- Each subdomain that sends mail needs its own record. The record for `contoso.com` does not cover `marketing.contoso.com`.
- Receivers evaluate sources left to right and stop when the sender matches.

## The 10 lookup limit

Exceeding 10 lookups returns `permerror` and the message is rejected with an NDR such as the message required too many lookups.

| Counts as a lookup | Does not count |
| --- | --- |
| `include:`, `a`, `mx`, `exists`, `redirect` | `ip4:`, `ip6:`, `all` |

Nested includes add lookups. An include that points to a record with three more includes adds four lookups in total.

To reduce lookups:

- Replace an include with `ip4:` or `ip6:` values if the vendor publishes stable IPs.
- Move non-Microsoft senders to subdomains, each with its own 10-lookup budget.
- Consolidate non-Microsoft email services.
- Do not flatten `include:spf.protection.outlook.com`, because its IPs change often.

Flattening needs ongoing upkeep: document changes, monitor vendor IPs, review at least quarterly and retest after each change.

## Hard fail, soft fail, neutral

| Ending | Meaning on Learn |
| --- | --- |
| `-all` | Hard fail. Unlisted sources are not authorized, and messages are typically discarded. Recommended for Microsoft 365 domains |
| `~all` | Soft fail. Messages are accepted but marked, for example by quarantine, Junk or a subject tag |
| `?all` | Neutral. For testing and not recommended in production |

DMARC treats both `-all` and `~all` as SPF failures. But DMARC is effectively ignored for `~all` failures when messages also lack DKIM signatures. Microsoft recommends `-all` so DMARC can act on SPF failures.

## Subdomains and parked domains

- For services you do not control, such as bulk email, use a subdomain like `marketing.contoso.com` to protect the main domain's reputation and lookup budget.
- For domains that send no email, such as contoso.net, publish `v=spf1 -all`. If your registrar supports wildcards, use the hostname `_*.contoso.net` with the same value.
- Undefined subdomains are covered by DMARC and inherit the parent's DMARC settings unless overridden.

## Examples from the page

Main domain with an on-premises server at 192.168.0.10:

```text
v=spf1 ip4:192.168.0.10 include:spf.protection.outlook.com -all
```

Bulk service on a subdomain, `marketing.contoso.com`, that requires `include:servers.adatum.com`:

```text
v=spf1 include:servers.adatum.com include:spf.protection.outlook.com -all
```

## Common mistakes from the page

- A trailing period, as in `outlook.com.`.
- `include=` instead of `include:`.
- A space after the colon.
- An include target that does not resolve or has no SPF record, which gives `permerror`. Verify includes by querying their TXT records.

## Caveats

SPF alone is not enough. Configure DKIM and DMARC too. A DMARC reporting service helps find unknown senders and SPF failures.

## What the page does not cover

Registrar-specific steps, a procedure for merging an existing record with a new sender beyond the one-record rule, names of lookup tools, CIDR size guidance, DNS propagation time and how to verify a change in Microsoft 365.

## A setup order

The order is practical advice.

1. List every system that sends mail for the domain.
2. Build one record with Microsoft 365 plus the other senders.
3. Count lookups, including nested includes.
4. Publish the TXT record with a TTL of 3600 or more.
5. Test mail from each sender.
6. Move to `-all` once you are confident the list is complete, and set up DKIM and DMARC.

## Related

- [Exchange Online Protection](https://www.m365.fm/entity/exchange-online-protection/)
- [SPF](https://www.m365.fm/entity/spf/)
- [DKIM](https://www.m365.fm/entity/dkim/)
- [DMARC](https://www.m365.fm/entity/dmarc/)

## Sources

- [Set up SPF to help prevent spoofing (Microsoft Learn)](https://learn.microsoft.com/defender-office-365/email-authentication-spf-configure)
