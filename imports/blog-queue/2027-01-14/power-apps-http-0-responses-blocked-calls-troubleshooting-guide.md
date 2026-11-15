---
title: "Power Apps HTTP 0 Responses and Blocked Calls: Troubleshooting Guide"
summary: "An HTTP status 0 in Power Apps or Power Automate means the client never got a response. Check the Remote Address in browser tools, rule out device and network issues, then give your network team the HAR file and the allowlist and SSL inspection fixes."
status: review
publish: false
author: mirko-p
date: 2027-01-14
topics: [power-apps, power-automate, power-platform]
keypoints:
  - "Learn says HTTP status 0 is not a real server response: the client never received one, usually because the request was blocked, dropped or terminated."
  - "Proxy-issued 403, 407, 502 or 503 responses and requests marked failed or canceled share the same pattern: the request is altered or blocked between client and service."
  - "A Remote Address showing only a port and no IP address strongly suggests a proxy, firewall, DNS filter or security agent handled the request locally."
  - "Learn says SSL/TLS inspection is a frequent root cause; bypass it for Power Platform host names and allow the published URLs and IP ranges."
  - "Capture a HAR file and share URLs, time, user and device with your network administrator."
faq:
  - q: "What does HTTP status 0 mean in Power Apps?"
    a: "Microsoft Learn says it is not an actual response from the server. It means the browser or client never received a response from the remote endpoint, usually because the request was blocked, dropped or terminated before a round trip completed. The response typically has no body, no headers and no meaningful error message."
  - q: "Where do I see it?"
    a: "In the Power Apps Live Monitor tool, in flow run history or in browser developer tools. Learn also lists requests shown as failed or canceled on the Network tab, proxy responses such as 403, 407, 502 and 503, and custom code that receives status 0 from fetch or XMLHttpRequest."
  - q: "How do I tell whether the request reached Power Platform?"
    a: "For 4xx and 5xx responses, look for headers such as x-ms-correlation-id or x-ms-request-id with GUID values. Learn says that if at least one is present the request likely reached the service and was rejected there. If they are missing and the response looks like a proxy or gateway page, an intermediary device likely generated it."
  - q: "What does a Remote Address with only a port mean?"
    a: "If the Remote Address field shows only a port such as :443 with no IP address, Learn says the connection was blocked, intercepted or short-circuited before it left the device or local network. That strongly suggests a proxy, firewall, DNS filter or security agent such as Zscaler is handling the request locally."
  - q: "What fixes does Learn list?"
    a: "Allow the Power Platform URLs and IP address ranges through all proxies, firewalls and DNS filters; bypass SSL/TLS inspection for Power Platform host names on gateways such as Zscaler or Netskope; stabilize device connectivity; and review browser extensions or endpoint security products that cancel or rewrite requests."
---

An HTTP status of 0 in Power Apps or Power Automate means the client never received a response. Microsoft Learn says the request was usually blocked, dropped or terminated before it could complete. It is not a rejection by Power Platform. Open browser developer tools, read the Remote Address of the failing request, rule out the device and the network, and hand the evidence to your network team. This guide follows the Learn troubleshooting page for HTTP 0 responses and blocked calls, which applies to Power Apps and Power Automate.

## Symptoms

A connector or web request fails before the Power Platform service can return a successful response. Learn says the failure is often intermittent. It shows up as:

- HTTP status `0` in the Power Apps Live Monitor tool, in flow run history or in browser developer tools. The response typically has no body, no headers and no meaningful error message.
- A request with the displayed status `(failed)` or `(canceled)` on the **Network** tab of browser developer tools.
- A status returned by an intermediary device instead of Power Platform, for example a Zscaler, Netskope or corporate proxy block page: `403 Forbidden`, `407 Proxy Authentication Required`, `502 Bad Gateway` or `503 Service Unavailable`.
- Custom code using `fetch` or `XMLHttpRequest` that receives `status: 0` or a generic network error.

The shared pattern, per Learn: the request is blocked or altered between the client device and the service, instead of being processed and rejected by the service.

## Cause

Status 0 means the browser or client never got a response from the remote endpoint. Proxy-issued statuses such as 403 or 407 mean an intermediary intercepted the request and returned its own response. Learn lists these common causes:

- Transient network outages or unstable connectivity, such as Wi-Fi drops, VPN disconnections or cellular handoffs.
- Corporate proxies, firewalls or SSL/TLS inspection devices that terminate, throttle or silently drop the connection.
- Network appliances that rewrite or strip CORS headers, for example setting `Access-Control-Allow-Origin` to a restrictive value.
- DNS resolution failures or DNS-based filtering that blocks the Power Platform endpoint.
- Secure web gateway or zero-trust products that intercept Power Platform traffic, block or rewrite it, or return a custom error page.
- Browser extensions such as ad blockers and privacy tools, or local antivirus software, that cancel the request.
- Browser local-network protections that treat proxied traffic as local-resource access.
- The user navigating away, closing the tab or putting the device to sleep before the request finishes.

Learn adds a note: these failures originate on the client side or in your network path, not on the Power Platform service, and fixing them usually needs your network administrator.

## Determine the source

### Step 1: verify that the request reaches the network

1. Press F12 in the browser to open developer tools and select the **Network** tab.
2. Reproduce the problem in the app or flow.
3. Find the failing request: status `0`, `(failed)`, `(canceled)`, or a `403`, `407` or `502` that does not look like a Power Platform response.
4. Select the request and read the **Headers** section, especially **Remote Address**, and check the response body for signs of a proxy or security appliance.

For 4xx and 5xx responses, check the headers for service markers such as `x-ms-correlation-id` or `x-ms-request-id` with GUID values. If at least one is present, the request likely reached the service and was rejected there. If they are missing and the response resembles a proxy or gateway page, an intermediary likely created it. If you contact Microsoft Support, include any of these identifiers you captured.

The **Remote Address** is one of the clearest signals:

- An IP address and port, such as `192.0.2.10:443`: the request reached a remote server. The failure is then more likely a TLS, CORS or service-side issue.
- Only a port, such as `:443` or `:80`, and no IP address: the connection was blocked, intercepted or short-circuited before it left the device or local network. Learn says this strongly suggests a proxy, firewall, DNS filter or security agent handling the request locally, and it often appears together with a proxy-issued 403 or 407.

Capture a HAR file of the session to share with your network team.

### Step 2: rule out device and connectivity problems

- Reproduce on a different network, such as a mobile hotspot, to see whether the problem follows the user, the device or the corporate network.
- Try another browser, or an InPrivate or Incognito window with extensions disabled.
- Verify the connection is stable and the device is not suspending Wi-Fi for power management.
- Test from a different device on the same network.

If the call works on another network but fails on the corporate one, Learn says the problem is almost certainly in the corporate network path.

For failures limited to specific regions, Learn also points to DNS response-size filtering. Some Power Platform host name chains produce larger DNS answers because of CNAME expansion and geographic routing, and devices that apply older size assumptions from RFC 1035 can block responses that are valid under RFC 6891.

### Step 3: work with your network administrator

Share the HAR file, the exact URLs (host name and path) of the failing requests, and the approximate time, user and device. Ask the team to verify that:

- All required Power Platform endpoints are allowed end to end through proxies, firewalls and SSL inspection devices, using the list at Power Platform URLs and IP address ranges.
- DNS resolves the endpoints correctly.
- Allowlist rules cover dynamic host names and subdomains. Learn says requests can use long, environment-specific host names, and a rule that allows only a previously observed subdomain can fail at the next routing change.
- CORS headers from Power Platform are preserved end to end.
- Inspection devices support larger DNS responses and EDNS behavior, especially if failures are concentrated by region or office.
- Power Platform host names are allowlisted in web gateways and protected from SSL/TLS inspection. Learn calls SSL inspection a frequent root cause of HTTP 0 responses and unexpected 403 or 502 errors, because the device can break long-lived or chunked connections the connector runtime relies on or return its own block page.

For browser local-network protections, Learn points to Chromium guidance on Private Network Access preflights.

### Step 4: collect more diagnostics

If the problem persists after the network team verifies the configuration:

- Capture a network trace, for example with Wireshark or `pktmon` on Windows, during a failing call.
- Use Live Monitor to see whether the failure is consistent or limited to specific connectors.
- Look in HAR entries for proxy-identifying headers such as `Via`.
- Look for protocol downgrades, such as `HTTP/1.1` where you expect `HTTP/2`. Learn says repeated downgrades often indicate inspection or proxy fallback.
- Note any browser local-network access prompt or denial.
- Note whether failures correlate with times of day, users, locations or connectors.

## Solution

Learn says your IT or network team usually makes the fixes. Apply one or more:

- Allow the Power Platform URLs and IP address ranges through all proxies, firewalls and DNS filters.
- Bypass SSL/TLS inspection for Power Platform host names on Zscaler, Netskope or similar gateways.
- Stabilize device connectivity for affected users.
- Review and reconfigure browser extensions or endpoint security products that cancel or rewrite requests.

If problems continue, collect updated traces and troubleshoot with the networking and security teams.

## A note on method

This is my own advice, not a Microsoft statement. Record the failing URL, time, user and Remote Address value for every report, even when you suspect a one-off. Learn says the failures are often intermittent, and a small log of those fields is what lets a network team find the policy or device involved. I would also test one affected user on a different network before opening a ticket, since that single test splits the problem into device or network.

## Related

- [Power Apps](https://www.m365.fm/entity/power-apps/)
- [Power Automate](https://www.m365.fm/entity/power-automate/)
- [Power Platform](https://www.m365.fm/entity/power-platform/)

## Sources

- [Troubleshoot HTTP 0 Responses and Blocked Calls - Power Apps (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/power-platform/power-apps/connections/troubleshoot-http-0-responses)
