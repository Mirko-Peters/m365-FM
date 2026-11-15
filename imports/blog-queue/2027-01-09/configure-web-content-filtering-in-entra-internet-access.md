---
title: "How to Configure Web Content Filtering in Microsoft Entra Internet Access"
summary: "Configure web content filtering in Entra Internet Access: prerequisites, creating a policy with web category, URL or FQDN rules, linking it to a security profile, Conditional Access, rule evaluation, propagation times and verification."
status: review
publish: false
author: mirko-p
date: 2027-01-09
topics: [entra-internet-access, global-secure-access]
keypoints:
  - "You need the Global Secure Access Administrator and Conditional Access Administrator roles, the Global Secure Access client and the Internet Access forwarding profile turned on."
  - "Create a web content filtering policy with rules for web categories, URLs or FQDNs, link it to a security profile and apply the profile through Conditional Access."
  - "Rules are evaluated in priority order and stop at the first match. URL rules are a preview feature with a maximum of 1,000 URLs per tenant."
  - "DNS over HTTPS and the browser's built-in DNS client must be disabled. QUIC is not supported, so Learn suggests a firewall rule to block it."
  - "Policy changes typically take under 5 minutes, Conditional Access about an hour and a new security profile up to 60-90 minutes. The page names no license."
faq:
  - q: "Which roles do I need?"
    a: "Global Secure Access Administrator and Conditional Access Administrator, according to Microsoft Learn."
  - q: "How do I create a policy?"
    a: "In the Entra admin center go to Global Secure Access > Secure > Web content filtering policies, select Create policy, name it, add rules by web category, URL or FQDN, and select Create policy."
  - q: "How do I apply the policy?"
    a: "Link it to a security profile under Secure > Security profiles, then create a Conditional Access policy that targets All internet resources with Global Secure Access and uses the security profile in the Session controls."
  - q: "What are the URL limits?"
    a: "URL filtering is a preview feature with a maximum of 1,000 URLs per tenant. FQDN entries must not include https:// or ports, and a wildcard such as *.domain.com does not match the root domain."
  - q: "How long do changes take?"
    a: "Learn says Global Secure Access web content filtering changes typically take effect in less than 5 minutes, Conditional Access changes in approximately one hour, and applying a new security profile can take up to 60-90 minutes."
---

Web content filtering in Microsoft Entra Internet Access lets you allow or block web destinations by category, URL or FQDN. You build a policy, link it to a security profile and apply the profile through Conditional Access. This guide follows the Microsoft Learn page How to configure Global Secure Access web content filtering. The page does not name a license.

## Prerequisites

- Roles: Global Secure Access Administrator and Conditional Access Administrator.
- The Global Secure Access client is installed on devices.
- The Internet Access forwarding profile is turned on.
- DNS over HTTPS is disabled, and the browser's built-in DNS client is disabled.
- IPv6 traffic is not acquired by the client and goes directly to the network, so Learn says to set the network adapter properties to IPv4 preferred.
- QUIC over UDP is not supported. Learn suggests a firewall rule that blocks QUIC so traffic falls back to TCP.
- TLS inspection is needed for rules that use the source type or HTTP method on HTTPS traffic. Without it, filtering is based on the SNI only.

## Create a web content filtering policy

1. In the Microsoft Entra admin center go to **Global Secure Access** > **Secure** > **Web content filtering policies**.
2. Select **Create policy** and enter a name.
3. Select **Add rule**. Choose a **web category**, or enter **URLs** or **FQDNs**.
4. Optionally add conditions for **Source type** (Agent or User) and **HTTP method**.
5. Select **Create policy**.

Rule details:

- URL filtering is a preview feature with a maximum of 1,000 URLs per tenant.
- FQDN entries must not include `https://` or ports.
- `*.domain.com` does not match the root domain `domain.com`.
- Enter a list as comma-separated values without spaces.

The page's creation steps do not show where to choose allow or block. Its examples say to set the policy action to Block, and its Graph API example sets `"action": "block"` on the policy and a priority of 100 when linking the policy to the baseline profile. It gives no portal steps for setting priority between policies.

## Link the policy to a security profile

1. Go to **Secure** > **Security profiles** and select **Create profile**.
2. Select **Link a policy** > **Existing policy**.
3. Choose your policy.

## Apply it with Conditional Access

1. Go to **Microsoft Entra ID** > **Conditional Access** > **Policies** and select **New policy**.
2. Under **Assignments** > **Users or workload identities** > **Include**, the page selects **All users**.
3. Under target resources choose **All internet resources with Global Secure Access**.
4. Select **Session** > **Use Global Secure Access security profile**, choose your security profile and select **Select**.
5. Make sure **Enable policy** is **On** and select **Create**.

Learn also lists assigning users or groups to the traffic forwarding profile as a high-level step. The Explicit Forward Proxy preview is not included in the All internet resources group and has its own Conditional Access article.

For remote networks, the baseline security profile enforces policies at the lowest priority, applies to all Internet Access traffic routed through the service (client-based and remote network traffic) and needs no Conditional Access policy for remote network traffic. The page's screenshot shows priority 65000 for it. Source traffic type rules are not supported for remote networks.

## How rules are evaluated

- Rules are processed in priority order and stop at the first match.
- The most restrictive action wins.
- Several values of the same attribute are combined with OR. Different attributes are combined with AND.
- A blocked HTTP request returns a plaintext error. A blocked HTTPS request shows Connection Reset.

## Timing

- Global Secure Access web content filtering changes typically take effect in less than 5 minutes.
- Conditional Access changes take effect in approximately one hour.
- Applying a new security profile can take up to 60-90 minutes, because the user needs a new access token with the new profile ID. Changes to existing profiles are enforced much more quickly.
- To speed up Conditional Access changes for testing, the page suggests revoking user sessions.

## Verify

Use **Advanced Diagnostics** > **Forwarding profile** to check that traffic is acquired, and **Monitor** > **Traffic logs** to see the action taken on requests.

## What the page does not say

- A license requirement.
- Portal steps for choosing allow or block when you add a rule (only the examples and the Graph API sample mention the action).
- Portal steps for setting priorities between policies.
- Behavior for unsupported protocols beyond QUIC.

## A rollout outline

This outline is my advice, built on the page.

1. Check prerequisites on a pilot device: client, forwarding profile, DNS settings.
2. Create a policy with one category rule and test with a pilot group.
3. Wait for propagation before you judge the result.
4. Check the traffic logs.
5. Widen the Conditional Access scope.

## Typical mistakes (my advice)

- Leaving DNS over HTTPS on in the browser.
- Expecting a wildcard FQDN to match the root domain.
- Testing before the propagation time has passed.
- Relying on HTTP method rules without TLS inspection.

## Quick reference

| Item | Value on the page |
| --- | --- |
| Portal path for policies | Global Secure Access > Secure > Web content filtering policies |
| Portal path for profiles | Global Secure Access > Secure > Security profiles |
| Conditional Access target | All internet resources with Global Secure Access |
| URL limit | 1,000 per tenant (preview) |
| Block behavior | Plaintext error for HTTP, Connection Reset for HTTPS |

## Related

- [Microsoft Entra Internet Access](https://www.m365.fm/entity/entra-internet-access/)
- [Global Secure Access](https://www.m365.fm/entity/global-secure-access/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)

## Sources

- [How to configure Global Secure Access web content filtering (Microsoft Learn)](https://learn.microsoft.com/entra/global-secure-access/how-to-configure-web-content-filtering)
