---
title: "How to Configure Quick Access in Entra Private Access for On-Premises Resources"
summary: "Configure Quick Access in Microsoft Entra Private Access: roles, minimum connector version, application segments, private DNS suffixes, user assignment, Conditional Access and the traffic forwarding profile."
status: review
publish: false
author: mirko-p
date: 2027-01-04
topics: [entra-private-access, global-secure-access]
keypoints:
  - "Configuring Quick Access needs the Global Secure Access Administrator and Application Administrator roles. The connector minimum version is 1.5.3417.0."
  - "Path: Global Secure Access > Applications > Quick access. Create the app with a connector group first, then add application segments."
  - "A Quick Access app holds up to 500 application segments. Destination types are IP address, FQDN including wildcard, CIDR range and IP-to-IP range."
  - "Users must be assigned directly or through a group. Nested groups are not supported."
  - "Learn calls Quick Access a transition state. After it replaces your VPN, move to per-app access for granular controls."
faq:
  - q: "What do I need before I configure Quick Access?"
    a: "Learn lists the Global Secure Access Administrator and Application Administrator roles, and at least one active Microsoft Entra private network connector in a connector group with a minimum version of 1.5.3417.0. Managing connector groups needs the Application Administrator role and Microsoft Entra ID P1 or P2."
  - q: "What can an application segment contain?"
    a: "An IPv4 address, an FQDN including a wildcard such as *.contoso.com, an IP address range in CIDR notation, or an IP-to-IP range, each with ports. Learn allows up to 500 application segments per Quick Access app."
  - q: "How do I write multiple ports?"
    a: "Separate ports with commas and use hyphens for ranges. Spaces are removed on apply. The example on Learn is 400-500, 80, 443."
  - q: "Why would I add a private DNS suffix?"
    a: "Private DNS lets Private Access resolve internal hostnames through your internal DNS servers, so you do not need an FQDN segment for each app. Learn's example lets users reach 10.8.0.5 by typing https://benefits."
  - q: "Does traffic flow after I save the app?"
    a: "Not by itself. Learn says no traffic is forwarded until both the app and the Private access traffic forwarding profile are configured."
---

Quick Access gives remote users a single Private Access app that reaches on-premises IPs, ranges and FQDNs through a connector group. You create the app, add application segments, assign users, optionally apply Conditional Access and enable the Private access traffic forwarding profile. This guide follows the Microsoft Learn article on configuring Quick Access.

## Prerequisites

**Roles and licenses**

- Configure Quick Access: **Global Secure Access Administrator** and **Application Administrator** in Microsoft Entra ID.
- Manage private network connector groups: **Application Administrator** and **Microsoft Entra ID P1 or P2** licenses.
- For product licensing, Learn points to the licensing section of its Global Secure Access overview.

**Connector**

- At least one **active Microsoft Entra private network connector** in a connector group.
- Minimum connector version **1.5.3417.0**. If you installed a connector earlier, reinstall it. When upgrading, uninstall the existing connector and delete related folders.

## High-level steps

1. Create a connector group with at least one active connector.
2. Configure Quick Access.
3. Assign users and groups to the app.
4. Configure Conditional Access policies.
5. Enable the Private access traffic forwarding profile.

## Step 1: create the Quick Access app

1. Sign in to the Microsoft Entra admin center at `entra.microsoft.com` with the required roles.
2. Browse to **Global Secure Access** > **Applications** > **Quick access**.
3. Enter a name. Learn says to use the name Quick Access.
4. Select a **Connector group** from the dropdown.
5. Select **Save**. This creates the app without FQDNs, IP addresses or private DNS suffixes.

## Step 2: add application segments

1. Browse to **Global Secure Access** > **Applications** > **Quick Access** and select **Add Quick Access application segment**.
2. In **Create application segment**, select a **Destination type**.

| Destination type | Input |
| --- | --- |
| IP address | IPv4 address, for example 192.168.2.1, and ports |
| Fully qualified domain name | FQDN and ports. Wildcards use the format `*.contoso.com` |
| IP address range (CIDR) | Starting address and network mask, for example 192.168.2.0/24, and ports |
| IP address range (IP to IP) | Start IP, end IP and ports |

3. Enter ports and protocol, then select **Apply**. Separate multiple ports with commas and use hyphens for ranges. Spaces are removed on apply. Example: `400-500, 80, 443`.
4. Select **Save**.

Common ports on the page: 22 SSH, 80 HTTP, 443 HTTPS, 445 SMB, 3389 RDP. The limit is **500 application segments** per Quick Access app.

## Step 3: private DNS suffixes

Private DNS lets Private Access resolve internal hostnames through your internal DNS servers, so you do not need an FQDN segment for each app.

1. In Quick Access, open the **Private DNS** tab.
2. Select the checkbox to enable private DNS.
3. Select **Add DNS suffix**, enter the suffix and select **Add**.

Learn's example: with the range 10.8.0.0 to 10.8.255.255 configured, a suffix lets users reach an app on 10.8.0.5 by typing `https://benefits`. The Global Secure Access client uses the suffix to route the request. For Kerberos single sign-on, Learn links to a separate article.

## Step 4: assign users and groups

Configuring Quick Access creates an enterprise application. Find it from Quick Access or under **Enterprise applications**. If you search there, clear all filters first.

1. Select **Edit application settings**, then **Users and groups**.
2. Add users or groups.

Users must be assigned directly or through a group assigned to the app. **Nested groups are not supported.**

## Step 5: Conditional Access and traffic forwarding

- Conditional Access policies can be applied to the Quick Access app. Learn links to its article on creating a Conditional Access policy for Private Access apps.
- Enable the Private access profile in the **Traffic forwarding** area of Global Secure Access. You can enable it before you configure Quick Access, but no traffic is forwarded until the app and the profile are both configured.

## What the page does not say

The page lists no Global Secure Access client operating system or version requirements. The only version stated is the connector minimum. It points to a separate page on known limitations.

## Quick Access is a transition state

Learn describes Quick Access as a transition state. After it replaces your VPN, configure per-app access for application segmentation and granular controls. Treat Quick Access as a first step, not the end state.

## Typical mistakes

- Using an old connector build below 1.5.3417.0.
- Assigning a nested group and finding that users have no access.
- Expecting traffic to flow before the traffic forwarding profile is on.
- Creating one FQDN segment per internal app instead of using private DNS suffixes.
- Typing ports with unexpected separators. Use commas and hyphens.

## Related

- [Entra Private Access](https://www.m365.fm/entity/entra-private-access/)
- [Global Secure Access](https://www.m365.fm/entity/global-secure-access/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)

## Sources

- [Configure Quick Access for Global Secure Access (Microsoft Learn)](https://learn.microsoft.com/entra/global-secure-access/how-to-configure-quick-access)
