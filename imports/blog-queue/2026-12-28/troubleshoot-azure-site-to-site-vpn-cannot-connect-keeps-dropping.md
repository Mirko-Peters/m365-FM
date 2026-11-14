---
title: "Azure Site-to-Site VPN Cannot Connect or Keeps Dropping: Troubleshooting Checklist"
summary: "Troubleshoot an Azure site-to-site VPN that worked and then stopped, using the Microsoft Learn checklist in order: resets, gateway type, validated device, shared key, peer IPs, UDR and NSG, local network address, subnets, health probe and perfect forward secrecy."
status: review
publish: false
author: mirko-p
date: 2026-12-28
topics: [azure-virtual-network]
keypoints:
  - "Learn first suggests resetting the Azure VPN gateway and resetting the tunnel from the on-premises VPN device before the numbered steps."
  - "Compare the shared key on both sides and check that the peer IPs in the Local Network Gateway and on the device match."
  - "Remove user-defined routes and network security groups from the gateway subnet as a test, then reapply what they provided."
  - "Browse to the gateway health probe on port 8081, or 8083 for the second address of an Active/Active gateway. Basic SKU gateways do not respond."
  - "Perfect forward secrecy on the on-premises device can cause disconnections. The page does not cover NAT, BGP, firewall ports or logs."
faq:
  - q: "What should I try first?"
    a: "According to Microsoft Learn, reset the Azure VPN gateway and reset the tunnel from the on-premises VPN device. If the problem persists, follow the steps in order."
  - q: "How do I check the shared key?"
    a: "In the portal open the VPN gateway, then Connections, open the connection and select Authentication Type to update the key. In PowerShell, Get-AzVirtualNetworkGatewayConnectionSharedKey shows it for the Resource Manager model."
  - q: "How does the gateway health probe work?"
    a: "Browse to https://<gateway IP>:8081/healthprobe and click through the certificate warning. A response means the gateway is considered healthy. No response may mean the gateway is unhealthy or an NSG is blocking it."
  - q: "Can I ping the gateway?"
    a: "No. Learn says VPN gateways do not respond to ICMP on their local address."
  - q: "Does this page cover IKE parameters, NAT or BGP?"
    a: "No. Beyond the IPsec/IKE policy reference in the PFS step, the page does not address IKE parameter matching, NAT, traffic selectors, firewall ports, BGP or diagnostic logs."
---

This checklist is for a site-to-site VPN connection that worked, then stopped and cannot reconnect. It follows the Microsoft Learn troubleshooting article and keeps its order.

## Try these first

Learn recommends two fixes before the steps: reset the Azure VPN gateway, and reset the tunnel from the on-premises VPN device. If the problem persists, continue in order.

## Prerequisite: check the gateway type

In the Azure portal, open the virtual network gateway for your virtual network. On the Overview page, note the gateway type, VPN type and gateway SKU.

## Step 1: Is the on-premises device validated

Check whether your VPN device and operating system version are on the validated list. If not, you might need to contact the manufacturer about compatibility. Also confirm the device is configured correctly, using the device configuration samples.

## Step 2: Verify the shared key

Compare the shared key on the device with the one in Azure.

- Portal: open the VPN gateway, go to Connections, open the connection and select Authentication Type. Update and save the key if needed.
- PowerShell, Resource Manager model: `Get-AzVirtualNetworkGatewayConnectionSharedKey -Name <Connection name> -ResourceGroupName <Resource group name>`.
- Classic model: `Get-AzureVNetGatewayKey`. The page prints the parameter names without values, so supply them yourself.

## Step 3: Verify the VPN peer IPs

The IP in the Local Network Gateway object in Azure should match the on-premises device IP, and the Azure gateway IP set on the device should match the Azure gateway IP.

## Step 4: Check UDRs and NSGs on the gateway subnet

Remove user-defined routes and network security groups from the gateway subnet and test. If the problem goes away, reapply the settings they provided and validate as you go.

## Step 5: Check the device's external interface address

If the Internet-facing IP address of the VPN device is included in the Local network definition in Azure, you might see sporadic disconnections.

## Step 6: Subnets must match exactly (policy-based gateways)

Verify that the virtual network address spaces match exactly between Azure and the on-premises definition, and that the subnets match exactly between the Local Network Gateway and the on-premises network definition.

## Step 7: Check the gateway health probe

Browse to `https://<YourVirtualNetworkGatewayIP>:8081/healthprobe`. For Active/Active gateways, also check `https://<YourVirtualNetworkGatewayIP2>:8083/healthprobe`. Click through the certificate warning. A response means the gateway is considered healthy. No response means the gateway might be unhealthy or an NSG on the gateway subnet blocks the probe.

- Basic SKU gateways do not respond to the health probe. Learn does not recommend them for production workloads.
- VPN gateways do not respond to ICMP (ping) on their local address.

## Step 8: Perfect forward secrecy

PFS can cause disconnections. If it is enabled on the on-premises device, disable it, then update the VPN gateway IPsec policy. The page links an article on configuring an IPsec/IKE policy.

## Matching a symptom to a step

This mapping is a suggestion drawn from the wording of the steps, not a Microsoft table.

- The tunnel never comes up after a change: start with Step 2 (shared key) and Step 3 (peer IPs).
- Sporadic disconnections: Step 5 mentions them for the device's external interface address, and Step 8 says perfect forward secrecy can cause disconnections.
- Connectivity broke after a network change in Azure: Step 4 on user-defined routes and network security groups on the gateway subnet.
- A policy-based gateway with mismatched networks: Step 6, which applies only to Azure policy-based gateways.
- Unsure whether the gateway itself is healthy: Step 7, the health probe.

## What to record while you work

This is a suggestion, not Microsoft guidance. Note the gateway SKU and type from the prerequisite step, what changed on either side before the drops began, and the result of each step, so that a support case starts with facts.

## Not covered

The page does not address IKE and IPsec parameter matching beyond the policy link, NAT or NAT-T, traffic selectors beyond subnet matching, firewall rules and ports on the on-premises side, BGP, or gateway and connection logs. It points to separate articles on diagnostic logs and the IPsec/IKE policy.

## Related

- [Azure Virtual Network](https://www.m365.fm/entity/azure-virtual-network/)

## Sources

- [Troubleshoot a site-to-site VPN that cannot connect](https://learn.microsoft.com/azure/vpn-gateway/vpn-gateway-troubleshoot-site-to-site-cannot-connect)
