---
title: "How to Configure the IP Firewall for a Power Platform Environment"
summary: "Configure the IP firewall for a managed Power Platform environment: what it protects, admin center steps, audit-only versus enforcement mode, CIDR format and limits, advanced settings, application users and documented caveats."
status: review
publish: false
author: mirko-p
date: 2027-01-08
topics: [power-platform-admin-center, managed-environments]
keypoints:
  - "The IP firewall restricts access to Dataverse to requests from allowed IP ranges and is available only for managed environments."
  - "Set it up in the Power Platform admin center under Security > Identity and access > IP firewall. Learn recommends audit-only mode for at least a week before enforcing."
  - "Allowed ranges use CIDR format, separated by commas, up to 200 ranges and 4,000 characters. IPv4 and IPv6 are supported. Changes typically take about 5-10 minutes."
  - "Advanced settings control service tag bypass, Microsoft trusted services, all application users and reverse proxy IP addresses."
  - "Misconfigured ranges can make Dataverse requests fail, and Power Automate flows may break if trusted services and application users are both blocked."
faq:
  - q: "What does the IP firewall protect?"
    a: "Per Microsoft Learn, it restricts access to Dataverse to requests from allowed IP ranges, evaluated in real time. It addresses insider data exfiltration, such as downloads through Excel or Power BI from disallowed locations, and token replay from outside allowed ranges."
  - q: "Where do I turn it on?"
    a: "In the Power Platform admin center go to Security > Identity and access > IP firewall, select an environment and Set up IP firewall, set IP Firewall to On, add the allowed IP addresses and select Save."
  - q: "What is audit-only mode?"
    a: "It records the IP addresses calling the environment and allows all requests, in or out of range. Learn recommends running it for at least a week and reviewing the audit logs before enforcing."
  - q: "How do I write the allowed ranges?"
    a: "In CIDR format, separated by commas. The field allows up to 4,000 characters and 200 ranges, and supports IPv4 and IPv6."
  - q: "What can go wrong?"
    a: "Misconfigured ranges can make Dataverse requests fail. Power Automate flows may break if Microsoft trusted services and all application users are both disabled, and unexpected blocks behind a reverse proxy may need the Forwarded header."
---

The IP firewall for Power Platform environments restricts Dataverse access to requests that come from IP ranges you allow. Because a wrong range can lock people out, the page recommends running it in audit-only mode first. This guide follows the Microsoft Learn page on the IP firewall in Power Platform environments.

## What it does

- It restricts access to Microsoft Dataverse to requests from allowed IP ranges.
- It checks the IP address of each request in real time. A denied request gets a message that access to the IP is blocked.
- It works for interactive and noninteractive scenarios.
- It targets insider data exfiltration, for example downloads through Excel or Power BI from disallowed locations, and token replay from outside the allowed ranges.
- It works at the network layer and evaluates the request after authentication completes.

## Requirements

- The feature is available only for managed environments.
- A Power Platform admin role is needed to turn it on or off.
- Managed environments are included with standalone Power Apps, Power Automate, Copilot Studio, Power Pages and Dynamics 365 licenses with premium usage rights. Users in enforced environments also need one of the listed Microsoft 365 or Office 365 subscriptions, such as A5, E5 or G5 plans or the listed compliance, information protection and insider risk add-ons. The page says users in the environments where the firewall is enforced need one of them, without saying more about which users.

## Set it up

1. Sign in to the Power Platform admin center as an administrator.
2. Select **Security**, then **Identity and access**, then **IP firewall**.
3. Select an environment and **Set up IP firewall**.
4. Set **IP Firewall** to **On**.
5. Enter the **Allowed list of IP addresses** and review the advanced settings.
6. Select **Save**.

For several environments, use the **Environment groups** tab. Settings then apply to all environments in the group. The page also shows an OData call that patches the organization record with the same settings.

## Audit-only and enforcement

- **Audit-only mode** records the callers' IP addresses and allows all requests, in range or not. It is on by default in the UI. Learn recommends at least a week of audit-only operation and a review of the audit logs before you enforce.
- **Enforcement mode** blocks requests from IPs outside the allowed ranges.
- Recommended order: test in a test environment, run audit-only in production, then enforce.
- The page's FAQ says you download the audit log through the Dataverse OData API in JSON format, using the audits table with action 118.

## Allowed ranges

- CIDR format, separated by commas.
- Up to 4,000 alphanumeric characters and 200 ranges.
- IPv4 and IPv6 are supported, and IPv6 can be written in hexadecimal or compressed form.
- Changes to the list typically take effect in about 5 to 10 minutes.

## Advanced settings

| Setting | Default | Effect |
| --- | --- | --- |
| Allowed list of service tags | Not stated | Service tags selected from the list can bypass the firewall |
| Allow access for Microsoft trusted services | On | Lets services such as monitoring and the support user bypass the firewall |
| Allow access for all application users | On | Allows third-party and first-party application users. When cleared, it only blocks third-party application users |
| Enable IP firewall in audit-only mode | On | Enables the firewall but allows requests regardless of IP address |
| Reverse proxy IP addresses | Not stated | Comma-separated. Applies to both IP-based cookie binding and the IP firewall. The proxy must send client IPs in the Forwarded header |

To allow specific application users while blocking others, the page describes adding the application user, finding its systemuserid and setting `isallowedbyipfirewall` to true, then clearing Allow access for all application users.

## What the firewall does not restrict (my summary)

The page has no section with this title. Putting its settings together: requests from service tags in the allowed list, from Microsoft trusted services when that setting is enabled, and from application users while Allow access for all application users is enabled are not restricted. The page also says the firewall is enforced only on managed environments.

## Caveats

- Power Automate flows may break if Microsoft trusted services and all application users are both disabled. The FAQ points to the managed connectors outbound IP addresses.
- If a reverse proxy causes unexpected blocks, confirm it forwards the client IP in the Forwarded header.
- Audit logs are not supported in tenants that use bring-your-own-key encryption. Learn recommends migrating to a customer-managed key.
- Misconfigured ranges can make Dataverse requests fail.

## What the page does not say

- Whether the firewall covers anything beyond Dataverse, such as canvas apps or non-Dataverse connectors.
- How the audit-only default relates to the FAQ statement that the firewall is not enabled by default.
- How long audit data is retained.
- The HTTP status code of a denial.
- What happens to users without the listed subscriptions.

## A rollout outline

This outline is my advice, built on the page.

1. List the office, VPN and proxy egress ranges.
2. Turn on the firewall in a test environment in audit-only mode.
3. Repeat in production for at least a week and review the logs.
4. Add missing ranges and review flows that run as application users.
5. Switch to enforcement and watch for denials.

## Typical mistakes (my advice)

- Enforcing before reviewing audit logs.
- Forgetting remote users and cloud services that call Dataverse.
- Blocking trusted services and application users together without checking flows.
- Assuming it works in environments that are not managed.

## Related

- [Power Platform admin center](https://www.m365.fm/entity/power-platform-admin-center/)
- [Managed environments](https://www.m365.fm/entity/managed-environments/)
- [Dataverse](https://www.m365.fm/entity/dataverse/)

## Sources

- [IP firewall in Power Platform environments (Microsoft Learn)](https://learn.microsoft.com/power-platform/admin/ip-firewall)
