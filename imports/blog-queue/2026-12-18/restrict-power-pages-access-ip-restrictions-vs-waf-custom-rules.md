---
title: "Power Pages IP Restrictions and WAF Custom Rules: How to Restrict Site Access"
summary: "How to restrict a Power Pages site by IP address with the allow list, and when to switch to Web Application Firewall custom rules for geo, IP and rate limit control, including the conflict between the two features."
status: review
publish: false
author: mirko-p
date: 2026-12-18
topics: [power-pages, power-platform-admin-center, azure-front-door, azure-web-application-firewall]
keypoints:
  - "The platform IP Restrictions feature is an allow list. Requests from other addresses get a static HTTP 403 page."
  - "IP Restrictions are not supported while the Web Application Firewall is enabled. Use WAF custom rules for IP filtering instead."
  - "WAF needs a Production site, runs in Prevention mode and is powered by Azure Front Door."
  - "Custom rules are either Match or Rate limit, evaluated in priority order, and can take up to one hour to propagate."
  - "Review the WAF logs before disabling a managed rule that seems to block valid traffic."
faq:
  - q: "Does Power Pages have a deny list for IP addresses?"
    a: "According to Microsoft Learn, the IP Restrictions feature works as an allow list. If a request comes from an address that is not on the list, the site returns a static HTTP 403 page. For deny rules, Learn points to WAF custom rules, which can block by IP address, geo location or request URI."
  - q: "Can I use IP Restrictions and WAF at the same time?"
    a: "No. Microsoft Learn states that the IP Restrictions feature under Site Details and Security is not supported when WAF is enabled. To filter by IP while WAF is active, use WAF custom rules."
  - q: "Who can configure these settings?"
    a: "Microsoft Learn says adding IP addresses needs the Service Administrator role or the System Administrator role of the Dataverse environment selected for the site. WAF and its custom rules need an administrator, and the site must be a Production site."
  - q: "How long do WAF custom rule changes take?"
    a: "Microsoft Learn says changes can take up to one hour to propagate to all edge locations globally. Plan changes with that delay in mind and avoid testing a rule seconds after saving."
  - q: "Where do I find the traffic data to build rules?"
    a: "Microsoft Learn says that once WAF is enabled, all requests are logged. The logs contain client IPs, socket IPs and request URIs, and can be used to build IP or rate limit rules."
---

Power Pages offers two ways to restrict who can reach a site. The IP Restrictions feature is a simple allow list. The Web Application Firewall (WAF) adds managed rules plus custom rules for IP address, geo location, request URI and rate limits. The two cannot run together. Microsoft Learn says IP Restrictions are not supported while WAF is enabled, so choose one approach per site.

## Option 1: IP Restrictions (allow list)

### How it behaves

- A newly provisioned site is open to every computer. With no addresses on the list, or after all are removed, the site is accessible from all IP addresses.
- Once the list has entries, only those addresses get through. Any other request receives a static HTTP 403 page, which cannot be changed.
- The list takes public addresses. Learn says private IP addresses cannot be accessed by the website.
- Each entry has a type, IPv4 or IPv6, and an address in CIDR notation.

### Steps

You need the Service Administrator role, or the System Administrator role in the Dataverse environment of the site.

1. Open the Power Platform admin center.
2. Under **Resources**, select **Power Pages sites**, then select the site.
3. In the **Security** section, select **IP Restrictions**.
4. Select **+ New**, choose IPv4 or IPv6, and enter the address in CIDR notation.
5. Select **OK**.

To remove an entry, select it on the same panel, select the ellipsis, choose **Delete** and confirm.

A site set to private mode still requires credentials, so an allowed address does not replace sign-in.

The Learn page does not state a limit on the number of entries, how long a change takes, or how makers in Power Pages Studio are affected.

## Option 2: WAF custom rules

### Prerequisites

- The site must be a Production site. Trial sites are not supported.
- WAF is not available in Singapore Local, China and the UAE regions. Custom rules and managed rules cannot be configured in China and UAE.
- WAF is powered by Azure Front Door. Traffic is routed through it and inspected before it reaches the site.
- For a custom domain, enabling WAF needs a one-time domain ownership check with a TXT record. Learn says validation typically completes within minutes to 48 hours. Sites on the generated Power Pages URL do not need it.

### Enable WAF

In the Power Platform admin center, open the site and turn on **Enable Web Application Firewall** on the **Performance & protection** card. WAF is enabled by default when a trial site is converted to production, unless an administrator opts out before the conversion. The policy runs in Prevention mode, so requests that match the managed rule set are blocked.

### Create a custom rule

1. In the **Security** workspace, select **+ Add New Rule**.
2. Enter a rule name.
3. Choose the rule type. **Match** allows or blocks requests. **Rate limit** counts requests and throttles those above a threshold, with a window of 1 to 5 minutes.
4. Choose the match type: **Geo location**, **IP address** or **Request URI**.
5. Choose the match variable if offered. **RemoteAddr** is the original client IP, often from the `X-Forwarded-For` header. **SocketAddr** is the address of the direct connection, which is the proxy address if one sits in between.
6. Set the traffic setting to allow or deny, and select **Save**.

Rules are evaluated in priority order. Change the order from the ellipsis menu on a rule. Changes can take up to one hour to reach all edge locations.

### Example from Microsoft Learn

To accept traffic only from the United States, create two rules in this order. Rule 1 is a Match rule with the Geo location type, RemoteAddr, United States and Allow. Rule 2 is a Match rule on Request URI with the value `/` and Deny. Traffic from the United States matches the first rule and later rules are skipped. Everything else reaches rule 2 and is blocked.

For rate limiting, Learn gives a rule on Request URI `/` with a 5 minute window, 1500 allowed requests and Deny for a site that averages 1,500 requests in 5 minutes.

## Managed rules and false positives

When WAF is on, a subset of Azure managed rules is enabled by default. Learn names these threat categories: cross-site scripting, local file inclusion, remote file inclusion, session fixation, protocol attackers and protocol enforcement.

If a rule blocks valid requests:

1. Download and review the WAF logs first.
2. In the **Security** workspace, select **Web Application Firewall** and then the **Managed rules** tab.
3. Select the rule and choose **Disable**, then **Save**.

Disabling rules can reduce protection. To restore one, select **Add new rule**, choose **Managed** and pick the rule. Bot protection rules for good bots, bad bots and unknown bots can be added the same way. Rule set upgrades for the Microsoft Default Rule Set and the Bot Manager Rule Set keep custom rules but cannot be rolled back.

## Which option fits

| Need | Fits |
|---|---|
| Fixed list of office or VPN addresses, no other filtering | IP Restrictions |
| Block countries, ranges or paths, or limit request rates | WAF custom rules |
| Protection against common web attacks | WAF managed rules |
| IP filtering while WAF is on | WAF custom rules, because IP Restrictions are not supported |

## Typical mistakes

- Expecting IP Restrictions to keep working after enabling WAF.
- Adding a private address range, which the site cannot use.
- Placing a deny rule above the allow rule.
- Testing a new rule within minutes and assuming it failed.
- Disabling a managed rule without checking the logs.

## What the sources do not say

The pages read do not state a maximum number of IP entries or custom rules, do not describe log retention, and do not list rule actions beyond allow, deny and rate limit.

## Related

- [Power Pages](https://www.m365.fm/entity/power-pages/)
- [Power Platform admin center](https://www.m365.fm/entity/power-platform-admin-center/)
- [Azure Front Door](https://www.m365.fm/entity/azure-front-door/)
- [Azure Web Application Firewall](https://www.m365.fm/entity/azure-web-application-firewall/)

## Sources

- [Restrict website access by IP address](https://learn.microsoft.com/en-us/power-pages/admin/ip-address-restrict)
- [Web Application Firewall for Power Pages](https://learn.microsoft.com/power-pages/security/web-application-firewall)
- [Configure Web Application Firewall for Power Pages](https://learn.microsoft.com/en-us/power-pages/security/configure-web-application-firewall)
- [Configure WAF custom rules](https://learn.microsoft.com/en-us/power-pages/security/web-application-firewall-custom-rule-sets)
- [Configure managed rules](https://learn.microsoft.com/en-us/power-pages/security/configure-managed-rules)
- [Power Pages WAF FAQ](https://learn.microsoft.com/power-pages/security/waf-faq)
