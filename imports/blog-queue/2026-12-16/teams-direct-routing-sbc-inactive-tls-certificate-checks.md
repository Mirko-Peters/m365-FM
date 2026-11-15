---
title: "Teams Direct Routing SBC Inactive: TLS Certificate and SIP OPTIONS Checks"
summary: "The SBC shows Inactive or no SIP OPTIONS in Teams Direct Routing? Check certificate trust, FQDN match, TLS version and the SIP OPTIONS exchange, based on Microsoft Learn, with a note on vendor-specific settings."
status: review
publish: false
author: mirko-p
date: 2026-12-16
topics: [direct-routing, session-border-controller, teams-phone]
keypoints:
  - "Learn says the SBC health status rests solely on the SIP OPTIONS exchange, not on call traffic, so calls can work while it shows Inactive. Other Learn pages word this differently."
  - "The SBC certificate must come from a CA in the Microsoft Trusted Root Program, carry the SBC FQDN as CN or SAN and include the Server Authentication EKU."
  - "A wildcard covers one level only. *.contoso.com matches sbc1.contoso.com but not customer10.sbc1.contoso.com."
  - "Microsoft recommends sending SIP OPTIONS to FQDNs, not IP addresses, and configuring all three SIP proxy FQDNs for failover."
  - "Microsoft's page is vendor neutral. AudioCodes menu paths come from AudioCodes documentation, which this article does not cover."
faq:
  - q: "Why does my SBC show Inactive although calls work?"
    a: "Microsoft Learn says the health status is based only on the SIP OPTIONS exchange, not on call traffic. Check that the SBC sends OPTIONS, that the Contact and Record-Route headers carry the correct FQDN, that the FQDN resolves publicly and that firewalls or rate limits do not drop the exchange."
  - q: "Which certificate does the SBC need?"
    a: "According to the Direct Routing plan page, the certificate uses the SBC FQDN as Common Name or Subject Alternative Name, is signed by a CA in the Microsoft Trusted Root Program and includes the Server Authentication EKU. The SBC connectivity troubleshooting page adds that a self-signed certificate is not valid and that the certificate must contain at least one FQDN that belongs to a Microsoft 365 tenant."
  - q: "Can I use a wildcard certificate?"
    a: "Yes, if it complies with RFC 2818. Learn warns that a wildcard does not match lower-level subdomains, so *.contoso.com matches sbc1.contoso.com but not customer10.sbc1.contoso.com."
  - q: "Which SIP proxy FQDNs should the SBC use?"
    a: "Learn lists sip.pstnhub.microsoft.com as primary, sip2.pstnhub.microsoft.com as secondary and sip3.pstnhub.microsoft.com as tertiary. For Microsoft 365, Office 365 and GCC, configure all three for failover. The SBC connects to the proxy on destination port 5061 with SIP/TLS. GCC High and DoD use one FQDN each instead."
  - q: "How long can domain activation take?"
    a: "Learn says that after all requirements are met, activation can take up to 24 hours. At least one licensed user must be assigned to the subdomain that the SBC uses."
---

If a Direct Routing SBC shows **Inactive** or a SIP OPTIONS warning in the Teams admin center, start with the TLS connection and the SBC certificate, then check the SIP OPTIONS headers and DNS. This order is my own. Learn's troubleshooting page lists the SIP OPTIONS issues first and the TLS issues after them. That page says the health status shown in the admin center is based solely on the SIP OPTIONS exchange and does not reflect actual call traffic, so calls may still work while the status is red. The health dashboard page words it differently: it says the service uses SIP options and TLS handshake monitoring to detect SBC health, and it defines Inactive as an SBC with no recent calls or health checks.

This article covers the connection layer, not voice routing. Microsoft's troubleshooting guidance applies to Direct Routing PSTN calls only, not to Calling Plan or Operator Connect.

## Where to look first

In the Teams admin center, go to **Voice** > **Direct Routing**. The health dashboard shows the SBC status, the SIP options status and the TLS connectivity status.

- **SIP options: Warning, no SIP options.** The SBC exists in the tenant, is set up to send options, but the service never saw them.
- **SIP options: Warning, SIP Messages aren't configured.** Trunk monitoring through SIP OPTIONS is not turned on.
- **TLS connectivity.** The dashboard warns when a certificate expires within 30 days. Select the warning for details and recommendations.

By default an SBC sends OPTIONS every minute, but this varies by vendor.

## Step 1: Fix the certificate

Microsoft's plan page sets these rules for the SBC certificate. The troubleshooting page adds two more, listed below the rules.

- The SBC FQDN is the Common Name (CN) or a Subject Alternative Name (SAN).
- A CA from the Microsoft Trusted Root Program signs it.
- It includes the Server Authentication EKU.
- Wildcards are allowed if they follow RFC 2818.

Microsoft recommends generating the certificate signing request on the SBC itself (plan page). According to the troubleshooting page, a self-signed certificate is not valid, and the certificate must contain at least one FQDN that belongs to a Microsoft 365 tenant.

Wildcards match one label only. `*.contoso.com` matches `sbc1.contoso.com`, not `customer10.sbc1.contoso.com`. If the FQDN matches neither CN nor SAN, request a new certificate.

## Step 2: Check the chain and the trust

- Learn describes a case where the installed root or intermediate certificate is not part of the SBC certificate chain issuer. When the SBC starts the handshake, the Teams service cannot validate the chain and resets the connection. The page says the SBC may authenticate again after the public root certificate is refreshed in the service cache or the chain is fixed on the SBC. Confirm that the intermediate and root certificates on the SBC are correct.
- A packet capture can show that the certificate or intermediates are missing from the TLS Hello message even when the settings look right.
- If the SBC does not trust the Microsoft SIP proxy certificate, install the Microsoft Trusted Root certificate from the Microsoft 365 encryption chains page. If mutual TLS is enabled, install all required Microsoft Trusted Root certificates.
- Learn says to set TLS 1.2 or higher on the SBC, because the connection may close right away with an older version. The plan page itself does not name a minimum TLS version or cipher suites. Take cipher details from the SBC vendor.

## Step 3: Renew without leaving old connections

If the dashboard shows an expired or revoked certificate, request a new one from a trusted CA and install it. Then remove the TLS connections that used the old certificate. Learn says this ensures that expiration warnings are not triggered in the admin center. To remove the old connections, restart the SBC during a low-traffic period such as a maintenance window. If you cannot restart, contact the SBC vendor for instructions to force the closure of all old TLS connections.

## Step 4: Check the SIP OPTIONS headers

Learn says that after the TLS connection is established, problems can still affect the format or content of the SIP OPTIONS requests. It lists these conditions to check:

- The FQDN in the **Record-Route** or **Contact** header must match the FQDN configured in Teams.
- The Contact header must contain an FQDN, not an IP address.
- The domain must be fully validated in Microsoft 365.
- After you register a domain for an SBC, you must activate it. The troubleshooting page says in one place to add at least one E3- or E5-licensed user and in another to assign at least one licensed user to the subdomain, and that activation can then take up to 24 hours. The plan page lists Microsoft Teams and Teams Phone as the user licensing requirements. Learn does not reconcile these wordings, so check the licensing section of the plan page.

If the SBC receives SIP 200 OK but never sees OPTIONS from Microsoft, check that the FQDN resolves to the correct IP address. Also check that the firewall allows incoming connections from all SIP proxy signaling IP addresses.

## Step 5: Verify DNS, firewall and ports

- The SBC connects to the Microsoft SIP proxy on destination port 5061 with SIP over TLS. The proxy connects to the SBC on the port configured on the SBC.
- The proxy FQDNs resolve to 52.112.0.0/14 and 52.120.0.0/14. Microsoft tells you to allow signaling to and from all Teams IP ranges, not only the addresses a DNS query returns.
- The SBC FQDN must resolve to a public IP address through public DNS servers.
- Firewalls, load balancers and SBC rate limiting must not interfere with OPTIONS traffic.

## Step 6: Stop intermittent Inactive status

Learn names two causes for a status that flips between Active and Inactive.

1. The SBC sends OPTIONS to IP addresses. Those can change during maintenance or outages and point to an unresponsive datacenter. Configure the SBC to send OPTIONS only to FQDNs, allow all devices in the route to communicate with all Microsoft signaling FQDNs, and configure all three proxy FQDNs for failover: `sip.pstnhub.microsoft.com`, `sip2.pstnhub.microsoft.com` and `sip3.pstnhub.microsoft.com`. Devices that support DNS names can use `sip-all.pstnhub.microsoft.com`.
2. The certificate chain issue from Step 2.

## Where AudioCodes comes in

The Microsoft pages I read are vendor neutral. They do not name AudioCodes menus, parameters or Web interface paths, so this article does not either. Map Microsoft's checks onto your SBC like this:

- Which certificate and chain the SBC presents on its Teams-facing TLS context.
- Which TLS version the context allows.
- Which FQDN the SIP interface puts into Contact and Record-Route.
- Where the SBC sends OPTIONS and how often.

For exact settings use the AudioCodes configuration guide for your SBC model and firmware. That guide was not part of my research.

## If it still fails

If the TLS connection is interrupted or not established although certificates and SBC settings look correct, Learn says an intermediary device such as a firewall or router between the SBC and the Microsoft network may have closed it. Check for connection issues in your managed network and fix them. The plan page says to contact your SBC vendor first, and that Microsoft supports Direct Routing only with certified SBCs. My own suggestion for a lingering problem: collect a packet capture and the dashboard details before you open a case.

## Related

- [Direct Routing](https://www.m365.fm/entity/direct-routing/)
- [Session Border Controller](https://www.m365.fm/entity/session-border-controller/)
- [Teams Phone](https://www.m365.fm/entity/teams-phone/)
- [Teams admin center](https://www.m365.fm/entity/teams-admin-center/)

## Sources

- [SBC connectivity issues (Microsoft Learn)](https://learn.microsoft.com/en-us/troubleshoot/microsoftteams/phone-system/direct-routing/sip-options-tls-certificate-issues)
- [Plan Direct Routing (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoftteams/direct-routing-plan)
- [Health dashboard for Direct Routing (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoftteams/direct-routing-health-dashboard)
