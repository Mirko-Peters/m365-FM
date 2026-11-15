---
title: "Fix Azure Load Balancer Health Probe Status Down for Backend VMs"
summary: "When backend VMs show down behind an Azure Load Balancer, work through Learn's four causes: unhealthy VM, nothing listening on the probe port, firewall or NSG blocking 168.63.129.16, and other misconfiguration. Includes probe behavior, timing and limits."
status: review
publish: false
author: mirko-p
date: 2027-01-15
topics: [azure-load-balancer, network-security-group, azure-virtual-machines]
keypoints:
  - "A backend VM must pass the probe check to take part in the load balancer set; a failed probe stops new connections to that instance."
  - "Learn lists four causes: unhealthy VM, VM not listening on the probe port, firewall or NSG blocking the port, and other misconfigurations."
  - "Probes come from 168.63.129.16, which firewalls and NSGs must allow; a Deny All rule with higher priority than the default allow rule breaks it."
  - "For non-HTTP services use a TCP probe on a port that reflects the health of the service."
  - "An HTTP or HTTPS probe fails on any response other than 200, on no response within the timeout, or on a TCP reset."
faq:
  - q: "Why does the load balancer mark my VM as down?"
    a: "Microsoft Learn names four causes: the backend VM is unhealthy, the VM is not listening on the probe port, a firewall or network security group blocks the probe port, or another misconfiguration in the load balancer. Work through them in that order."
  - q: "Which IP address do the probes come from?"
    a: "All IPv4 health probes come from 168.63.129.16. Learn says you must allow it in network security groups and local firewall policies, and that the AzureLoadBalancer service tag identifies it and permits probe traffic by default. IPv6 probes use a link-local address, fe80::1234:5678:9abc, as their source."
  - q: "What makes an HTTP probe fail?"
    a: "A response code other than 200, no response during the minimum of the probe interval and the 30 second timeout, or a connection closed with a TCP reset. A TCP probe fails if the listener does not respond during the timeout period or the instance sends a TCP reset."
  - q: "What if my service is not HTTP?"
    a: "Learn says to configure a TCP health probe on a port that represents the health of the service and confirm each backend VM listens on it. Its example is an internal load balancer for AD DS probing TCP 389 or 3268."
  - q: "Does a down probe cut existing connections?"
    a: "For a single instance, new TCP connections go to the remaining healthy endpoints and established connections to the down instance continue. With all probes down on a Standard load balancer, established TCP flows continue if the pool has more than one instance, and no new flows are sent."
---

If backend VMs show as down behind an Azure Load Balancer, the VMs are not answering the health probe. Microsoft Learn's troubleshooting page lists four causes in this order: the VM is unhealthy, the VM is not listening on the probe port, a firewall or network security group blocks the port, or there is another misconfiguration. Probes come from 168.63.129.16, so that address must be allowed everywhere. This guide follows Learn's troubleshooting page and adds details from its health probe overview.

## What the symptom means

Learn's troubleshooting page says that for backend servers to participate in the load balancer set, they must pass the probe check. The health probes overview adds that when a probe fails, the load balancer stops sending new connections to that instance, and that outbound connectivity is not affected, only inbound.

## Use a TCP probe for non-HTTP services

An HTTP or HTTPS probe fails when the backend service does not answer HTTP requests. For a non-HTTP service, Learn says to configure a TCP probe on a port that represents the health of the service, and to confirm that each backend VM listens on it. Its example is an internal load balancer for Active Directory Domain Services probing TCP 389 for LDAP or 3268 for Global Catalog LDAP. For port-specific balancing, create one load-balancing rule per AD DS port and associate the rules with the TCP probe. The ports listed are LDAP 389, LDAPS 636, Global Catalog LDAP 3268 and Global Catalog LDAPS 3269.

## Cause 1: the backend VM is unhealthy

Sign in to the participating VMs, check that the VM state is healthy, and test whether it answers PsPing or TCPing from another VM in the pool. If it is unhealthy or cannot answer the probe, fix it before it can take part in load balancing.

## Cause 2: the VM is not listening on the probe port

If the VM is healthy but does not answer, the probe port may be closed or nothing may be listening on it.

1. Sign in to the backend VM.
2. Run `netstat -an` in a command prompt and check that an application listens on the probe port.
3. If the port state is not **LISTENING**, configure the proper port.
4. Alternatively, pick another port that is listed as LISTENING and update the load balancer configuration to match.

## Cause 3: a firewall or NSG blocks the probe

A guest firewall, or a network security group on the subnet or the VM, can stop the probe from reaching the port.

1. If the firewall is enabled, check that it allows the probe port, then test again.
2. Make sure the VM firewall does not block probe traffic from `168.63.129.16`.
3. Check listening ports with `netstat -a` on Windows or `netstat -l` on Linux. Check firewall rules with `netsh advfirewall show allprofiles | more` on Windows or `sudo iptables -L` on Linux.
4. In the network security groups, check whether incoming or outgoing traffic on the probe port is affected.
5. Check for a **Deny All** rule on the NIC or subnet with a higher priority than the default rule that allows load balancer probes and traffic. The NSGs must allow the load balancer address 168.63.129.16.
6. Remove and reconfigure any rule that blocks probe traffic, then check whether the VM answers.

The overview page adds that the `AzureLoadBalancer` service tag identifies the probe address and permits probe traffic by default, and that blocking the probe IP or port in NSG rules is an unsupported scenario that can make NSG rules take effect late and make probe results inaccurate.

## Cause 4: other misconfigurations

If the first three are ruled out, test connectivity yourself and collect traces.

1. From another VM in the virtual network, run PsPing against the probe port, for example `.\psping.exe -t 10.0.0.4:3389`, and record the result.
2. Run TCPing the same way, for example `.\tcping.exe 10.0.0.4 3389`.
3. If neither gets an answer, run a Netsh trace on the target VM and on a test VM in the same network while PsPing runs, then stop and analyze the capture.
   - No incoming packets on the backend VM point to a network security group or user defined route (UDR) misconfiguration blocking the traffic.
   - No outgoing packets mean the VM needs to be checked for unrelated issues, for example an application blocking the probe port.
   - Check whether probe packets are being forced to another destination, possibly through UDR settings, before reaching the backend VM.
4. Change the probe type, for example HTTP to TCP, and configure the matching port in NSG rules and the firewall, to see whether the problem is the probe response configuration.

## How probes decide up and down

From the health probes overview:

| Probe | Fails when |
| --- | --- |
| TCP | The listener does not respond in the timeout period, or the instance sends a TCP reset |
| HTTP or HTTPS | The endpoint returns anything other than 200, does not respond within the minimum of the probe interval and the 30 second timeout, or closes the connection with a TCP reset |

An HTTPS probe needs certificates with a minimum signature hash of SHA256 across the whole chain. Learn lists these limits: HTTPS probes do not support mutual authentication with a client certificate, HTTP probes do not support hostnames for backends, and HTTP probes cannot use ports 19, 21, 25, 70, 110, 119, 143, 220 and 993. It also warns that enabling TCP timestamps can cause throttling or other performance problems that make probes time out.

The interval defaults to 5 seconds in the Azure portal. With ARM templates, the REST API, Azure CLI or PowerShell the default is 15 seconds, with a minimum of 5. The threshold is the number of consecutive successes or failures needed to change state. For HTTP probes, explicit 200 and non-200 answers change the state immediately, so the threshold applies only to timeouts.

Other design points from the page that cause surprises: stopped VMs are not probed; the probe port does not have to match the application port, though Learn says using the same port is generally recommended; and you should not configure your virtual network with the Microsoft owned address range that contains 168.63.129.16. With several network interfaces, answer the probe on the interface it arrived on.

## A short routine

This section is my advice, not a Microsoft statement.

1. Check the probe's protocol and port first, then confirm from inside the VM that something listens there.
2. Test from a second VM in the same network, because a test from the VM itself skips the NSG and routing path.
3. Read NSG rules by priority, looking for any deny that sits above the default allow.
4. For a custom HTTP health endpoint, return 200 only when the application is really healthy.
5. Change one thing at a time and wait for the next probe interval before judging.

## Related

- [Azure Load Balancer](https://www.m365.fm/entity/azure-load-balancer/)
- [Network security group](https://www.m365.fm/entity/network-security-group/)
- [Azure Virtual Machines](https://www.m365.fm/entity/azure-virtual-machines/)

## Sources

- [Troubleshoot Azure Load Balancer health probe status - Azure (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/azure/load-balancer/load-balancer-troubleshoot-health-probe-status)
- [Azure Load Balancer health probes (Microsoft Learn)](https://learn.microsoft.com/azure/load-balancer/load-balancer-custom-probe-overview)
