---
title: "Application Gateway 502 Bad Gateway: Find the Cause With a Documented Checklist"
summary: "Work through the six causes of Azure Application Gateway 502 errors from Microsoft Learn: NSG, UDR or DNS blocks, probe failures, backend timeouts, empty pools and unhealthy instances, plus certificate mismatches, with the commands and defaults the page gives."
status: review
publish: false
author: mirko-p
date: 2026-12-30
topics: [azure-application-gateway]
keypoints:
  - "Learn lists six causes: NSG, UDR or DNS blocks, default probe failures, invalid custom probes, backend timeouts, and an empty pool or unhealthy instances. A certificate mismatch is also covered."
  - "The default probe uses http://127.0.0.1/ with a 30 second interval, a 30 second timeout and an unhealthy threshold of 3. It must return HTTP 200 on the backend setting port."
  - "The backend request timeout is 20 seconds by default and ranges from 1 to 86400 seconds. On v2 a second timeout returns a 504, not a 502."
  - "Raising the timeout hides the symptom if the backend is slow, so investigate the backend response time first."
  - "A probe can succeed while the return path is dropped, for example when a route sends the response through a firewall or NVA."
faq:
  - q: "What are the documented causes of a 502?"
    a: "According to Microsoft Learn, an NSG, UDR or custom DNS blocking the backend, the default health probe unable to reach backend VMs, an invalid custom probe, a backend request timeout, an empty or unconfigured backend pool, and all instances in the pool being unhealthy. It also covers an upstream certificate that does not match the host name."
  - q: "What are the default probe settings?"
    a: "URL http://127.0.0.1/, interval 30 seconds, timeout 30 seconds and unhealthy threshold 3."
  - q: "What is the default backend request timeout?"
    a: "20 seconds, configurable per backend HTTP setting from 1 to 86400 seconds."
  - q: "Why would v2 return a 504 instead?"
    a: "On v2 the request is retried against a second pool member. If that also times out, the client gets a 504."
  - q: "How do I check the backend pool?"
    a: "Run Get-AzApplicationGateway and confirm each backend address pool has addresses in BackendAddresses and a ProvisioningState of Succeeded."
---

A 502 from Azure Application Gateway means the gateway received an invalid response, or none, from a backend. This guide follows the Microsoft Learn troubleshooting article. Learn presents six causes and does not say the list is exhaustive.

## 1. NSG, UDR or custom DNS

An NSG, a user-defined route or custom DNS can block the backend, so probes fail. Check, in this order:

1. NSGs on the Application Gateway subnet do not block backend traffic.
2. The UDR on the gateway subnet does not send traffic away from the backend subnet, for example to a network virtual appliance or through default routes learned over ExpressRoute or VPN.
3. Effective NSGs and routes on the backend VM's NIC, using `Get-AzEffectiveNetworkSecurityGroup` and `Get-AzEffectiveRouteTable`.
4. Whether the virtual network uses custom DNS, visible as DhcpOptions in `Get-AzVirtualNetwork`, and whether that server resolves each backend FQDN.

Learn adds a return-path case. A probe may reach the backend, but the response is dropped or redirected before it returns, because a UDR, peering route or BGP route sends it through a firewall or NVA. For a v2 gateway that is not a private deployment you can use Connection troubleshoot in the portal, or `az network watcher test-connectivity` from a diagnostic VM.

## 2. Default probe cannot reach backends

| Probe property | Default |
| --- | --- |
| URL | http://127.0.0.1/ |
| Interval | 30 seconds |
| Timeout | 30 seconds |
| Unhealthy threshold | 3 |

Make sure a default site listens on 127.0.0.1 and on the port in the backend HTTP setting, that protocol://127.0.0.1:port returns HTTP 200 within 30 seconds, and that no firewall or NSG blocks the port.

## 3. Invalid custom probe

A wrong host, path or timing value can mark healthy instances down. The host is not the VM host name. In v1 it is only the host header, and in v2 it is the host header and the SNI value. The path must start with a slash, and `http://host:port/path` must return HTTP 200. For an HTTPS probe on v2 the host name is sent as SNI and must match the backend certificate's SAN, or CN if there is no SAN. The gateway does not send SNI when the host is an IP address, including the default 127.0.0.1.

## 4. Backend request timeout

The gateway waits 20 seconds by default for a backend response. The range is 1 to 86400 seconds, per backend HTTP setting. On v1 a missing response gives a 502. On v2 the request is retried on a second pool member, and a second timeout gives a 504. To raise it in the portal open the gateway, select **Backend settings**, choose the setting, increase **Request time-out (seconds)** and save. The CLI equivalent is `az network application-gateway http-settings update ... --timeout`. Learn cautions that this hides a slow backend, for example one with high CPU or memory use or database contention.

## 5. Empty backend pool

With no VMs or scale set in the pool the gateway cannot route requests. Run `Get-AzApplicationGateway` and confirm BackendAddresses is not empty and ProvisioningState is Succeeded.

## 6. All instances unhealthy

Confirm the instances are healthy and the application is deployed, ping them from another VM in the virtual network, and for a public endpoint confirm a browser request works. For HTTPS backends, an expired certificate, an incomplete chain or a trusted root mismatch can fail probes.

## Certificate does not match the host name

By default the gateway forwards the client's Host header unchanged. For end-to-end TLS set the backend protocol to HTTPS and make sure the certificate's DNS name matches the host name the backend receives. Learn links further detail on Pick host name from backend target and Override with specific domain name.

## A triage suggestion

This section is a suggestion, not Microsoft guidance. Check backend health in the portal first to see which probe fails, then follow the matching section above.

## Not covered

The page gives no command for checking backend health and sends 504 handling to a separate article. It does not claim to list every cause of a 502.

## Related

- [Azure Application Gateway](https://www.m365.fm/entity/azure-application-gateway/)

## Sources

- [Troubleshooting bad gateway errors in Application Gateway](https://learn.microsoft.com/azure/application-gateway/application-gateway-troubleshooting-502)
