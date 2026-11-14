---
title: "Configure Conditional Access Named Locations and Trusted IPs"
summary: "How to create Conditional Access named locations in Microsoft Entra: IP ranges, countries and regions, trusted locations, documented limits, GPS caveats and proxy or VPN pitfalls."
status: review
publish: false
author: mirko-p
date: 2027-01-04
topics: [conditional-access, entra-id]
keypoints:
  - "Create named locations in the Microsoft Entra admin center under Entra ID > Conditional Access > Named locations. Conditional Access Administrator is the minimum role."
  - "IP range locations need public ranges. Learn gives limits of 195 named locations, 2,000 IP ranges per location and CIDR masks greater than /8."
  - "A trusted location cannot be deleted until its trusted designation is removed. MFA trusted IPs are not recommended for general use."
  - "Entra evaluates the proxy or VPN IP, not the X-Forwarded-For header. Microsoft recommends source IP restoration through Global Secure Access."
  - "Location-based blocks are restrictive, so test thoroughly before enforcing them."
faq:
  - q: "Where do I create a named location?"
    a: "According to Microsoft Learn, in the Microsoft Entra admin center go to Entra ID > Conditional Access > Named locations. The Conditional Access Administrator role is the minimum needed to create and update them."
  - q: "What are the limits for named locations?"
    a: "Microsoft Learn states no more than 195 named locations, no more than 2,000 IP ranges per named location, and only CIDR masks greater than /8. IPv6 ranges must use CIDR notation."
  - q: "Which IP address do I enter for my office?"
    a: "Learn says to use the public address your network presents to the internet, for example 198.51.100.3, not the internal client address such as 10.55.99.3."
  - q: "Why does my VPN or proxy break location policies?"
    a: "Learn says Microsoft Entra ID evaluates the IP of the cloud proxy, and the X-Forwarded-For header is not used because it cannot be validated. It recommends source IP restoration with Global Secure Access, or a device-based policy such as hybrid joined or compliant."
  - q: "Can I delete a trusted location?"
    a: "Not directly. Learn says a trusted location cannot be deleted until the trusted designation is removed. Deleted policies and named locations can be restored within the 30-day soft-delete period."
---

To define where sign-ins come from, create named locations in the Microsoft Entra admin center, mark your own public ranges as trusted if appropriate, and then select those locations in a Conditional Access policy. Microsoft Learn documents the setup, the limits and several caveats around proxies, GPS and evaluation timing. This guide follows the Learn pages on the Conditional Access network assignment and named locations.

## Create a named location

Path: Microsoft Entra admin center (entra.microsoft.com) > **Entra ID** > **Conditional Access** > **Named locations**. The minimum role is **Conditional Access Administrator**.

### IP range locations

1. Enter a **Name**.
2. Add one or more **public** IPv4 or IPv6 ranges.
3. Optionally select **Mark as trusted location**.

IPv6 ranges must use CIDR notation, for example `2001:db8::1/128` for one address or `2001:db8:abcd:0012::/64` for a subnet.

Limits stated by Learn:

- No more than **195** named locations.
- No more than **2,000** IP ranges per named location.
- Only CIDR masks greater than **/8** are allowed.

For private networks, use the public address your network presents to the internet, such as `198.51.100.3`, not the intranet client address such as `10.55.99.3`.

### Country and region locations

1. Enter a **Name**.
2. Choose **Determine location by IP address** or **Determine location by GPS coordinates**.
3. Add one or more countries or regions.
4. Optionally select **Include unknown countries/regions**, which captures IP addresses that cannot be mapped to a country.

With the IP method, Entra resolves the user's IPv4 or IPv6 address to a country or region using a periodically updated mapping table.

## Trusted locations

Marking a location as trusted is optional and applies to IP-based locations such as your organization's public ranges. Conditional Access can include or exclude trusted locations, and sign-ins from trusted locations improve the accuracy of Microsoft Entra ID Protection risk calculation. A trusted location cannot be deleted until the trusted designation is removed.

MFA trusted IPs from the MFA service settings also appear in the location list. Learn says this control accepts only IPv4 addresses and is not recommended for general use.

## How a policy uses locations

The network assignment in a policy has four choices:

| Option | Meaning |
| --- | --- |
| Any network or location | All IP addresses, including internet addresses. You can exclude locations, for example trusted ones, to target off-network access |
| All trusted networks and locations | All locations marked trusted, plus MFA trusted IPs if configured |
| All Compliant Network locations | Users and devices that comply with organizational policies. Requires Global Secure Access |
| Selected networks and locations | Only when the user connects from one or more selected named locations |

## GPS-based locations: read the caveats first

GPS-based country locations need the **Microsoft Authenticator** app. Learn describes these behaviors:

- The location is requested about hourly. The first request prompts the user in the app.
- Jailbroken devices are treated as invalid and denied. On Android, if the Google Play Integrity API is unavailable, access is denied unless the policy is disabled.
- Users who modify the reported GPS location are denied.
- In report-only mode, users are still prompted, and not sharing may result in a block.
- With passwordless phone sign-in, GPS works only if MFA push notifications are also enabled.
- Users may be prompted hourly, so Learn says to use GPS only for very sensitive apps or where a country-level restriction is required.

## Proxies, VPNs and evaluation timing

- **Cloud proxy or VPN:** Entra evaluates the proxy's IP address. The X-Forwarded-For header is not used. Learn says keeping IP lists current for cloud proxies is nearly impossible and recommends source IP restoration through Global Secure Access. A policy that requires a hybrid joined or compliant device may be easier to manage.
- **Initial sign-in:** locations are evaluated at initial sign-in.
- **Modern authentication apps:** mobile and desktop apps refresh tokens about hourly by default, so a location change is detected within an hour.
- **Apps without modern authentication:** evaluated on each token request.
- **Web apps:** the policy applies at sign-in and lasts for the session lifetime.

## Safety notes

- Location-based blocks are restrictive. Test thoroughly before you enforce them.
- Conditional Access is enforced after first-factor authentication and is not a front-line defense against denial-of-service attacks.
- Named locations are available through the Microsoft Graph `namedLocation` API.

## A practical setup order

1. List your office and datacenter egress addresses as public ranges and create one IP range location.
2. Decide whether it should be trusted. Remember that trusted status feeds ID Protection risk calculation.
3. Create country locations only when you need country-based rules.
4. Use a policy with the location condition in report-only mode first. Check the sign-in logs for unexpected blocks. This reflects common admin practice, and the Learn pages read here do not describe report-only for IP locations.
5. Enforce, and keep a break-glass exclusion according to your organization's standard.

## Typical mistakes

- Entering internal addresses instead of the public egress address.
- Forgetting that a proxy or VPN changes the IP that Entra sees.
- Using GPS locations broadly and annoying users with hourly prompts.
- Relying on MFA trusted IPs, which Learn does not recommend for general use.

## Related

- [Conditional Access](https://www.m365.fm/entity/conditional-access/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Global Secure Access](https://www.m365.fm/entity/global-secure-access/)

## Sources

- [Conditional Access: Network assignment (Microsoft Learn)](https://learn.microsoft.com/entra/identity/conditional-access/concept-assignment-network)
- [Conditional Access: Named locations (Microsoft Learn)](https://learn.microsoft.com/entra/identity/conditional-access/location-condition)
