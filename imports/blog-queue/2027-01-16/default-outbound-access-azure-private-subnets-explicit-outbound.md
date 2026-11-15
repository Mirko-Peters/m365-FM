---
title: "Default Outbound Access in Azure: Private Subnets and How to Set Explicit Outbound"
summary: "New Azure virtual networks created with the API released after March 31, 2026 default to private subnets, so VMs need an explicit outbound method. Learn what default outbound access is, what is and is not affected, how to configure private subnets and what to use instead."
status: review
publish: false
author: mirko-p
date: 2027-01-16
topics: [azure-virtual-network, azure-load-balancer, azure-virtual-machines, azure-virtual-machine-scale-sets]
keypoints:
  - "Default outbound access gives a VM without an explicit outbound method a Microsoft owned public IP that can change without notice."
  - "For the API released after March 31, 2026, subnets in new virtual networks have defaultOutboundAccess set to false, so VMs there need an explicit outbound method."
  - "Existing virtual networks are not changed, and you can still configure new subnets as nonprivate if you depend on default outbound IPs."
  - "Learn names a NAT gateway as the recommended explicit method for most scenarios; others are a Standard load balancer with outbound rules, a public IP on the NIC, or a firewall or NVA with a UDR."
  - "Existing VMs must be stopped and deallocated for a subnet change to take effect on their network interfaces."
faq:
  - q: "What is default outbound access?"
    a: "When you deploy a VM in a virtual network without an explicit outbound connectivity method, Azure assigns it an outbound public IP address. Learn says that address is owned by Microsoft and can change without notice, and that the behavior relies on the platform, not on a resource you configure."
  - q: "Does the change break my existing virtual networks?"
    a: "Learn says existing virtual networks are not changed. Existing VMs and new VMs created in those networks can continue to receive default outbound IPs unless the subnets are explicitly made private. Learn still recommends explicit outbound connectivity."
  - q: "What do I need for a VM in a private subnet to reach the internet?"
    a: "An explicit method: a NAT gateway on the subnet, a Standard load balancer with outbound rules, a Standard public IP on the network interface, or a firewall or network virtual appliance reached through a user defined route. Learn calls the NAT gateway the recommended method for most scenarios."
  - q: "Why do I still see a default outbound IP alert although I use a NAT gateway?"
    a: "Learn says a default outbound IP can still be assigned to VMs in a nonprivate subnet even with an explicit method configured, but it is not used for egress unless the explicit method is removed. To remove it, make the subnet private and stop and deallocate the VMs."
  - q: "What breaks in a private subnet?"
    a: "Learn lists activation and updates of VM operating systems such as Windows, which need an explicit method, and UDR routes with next hop type Internet. Service endpoints are not affected because they use a different next hop type."
---

Default outbound access is the public IP address Azure gives a VM that has no explicit outbound method. Learn says that address is owned by Microsoft and can change without notice. For the API version released after March 31, 2026, subnets in new virtual networks default to private, with defaultOutboundAccess set to false. VMs in those subnets need an explicit outbound method, and the NAT gateway is the one Learn recommends for most scenarios. Existing virtual networks are not changed. This guide follows the Microsoft Learn page on default outbound access.

## What default outbound access is

When you deploy a VM in a virtual network without an explicit outbound connectivity method, Azure automatically assigns it an outbound public IP address. It lets the VM reach the internet and public endpoints within Microsoft. Learn lists these as explicit methods:

- A subnet associated with a NAT gateway.
- The backend pool of a Standard load balancer with outbound rules defined.
- The backend pool of a basic public load balancer.
- A public IP address explicitly associated with the VM.

Learn says default outbound connectivity relies on implicit platform behavior and can be affected by platform-level changes, and recommends an explicit configuration where outbound behavior must be predictable.

A note that confuses many people: a default outbound IP can still be assigned to VMs in a nonprivate subnet even when an explicit method such as a NAT gateway or a UDR to a firewall is set up. That does not mean the default IP is used for egress, unless the explicit method is removed. To remove the default IPs completely, the subnet must be made private and the VMs stopped and deallocated.

## What changes and what does not

**Affected.** For the API version released after March 31, 2026, subnets in new virtual networks have `defaultOutboundAccess` set to `false` by default. VMs in them cannot rely on default outbound access. The Azure portal already defaults to private subnets, and deployments with earlier API versions keep the earlier default. Learn says earlier versions of ARM templates, or tools such as Terraform that can specify older versions, continue to set the property to null, which implicitly allows outbound access.

**Not affected.** Existing virtual networks are not changed. Existing and new VMs in those networks can still receive default outbound IPs unless you make the subnets private. VMs that already use an explicit method keep using it, for example a NAT gateway on the subnet, a public IP on the network interface, or outbound rules on a Standard public load balancer. You can also still create new subnets as nonprivate with any supported method if your infrastructure depends on default outbound IPs.

## Why Learn recommends turning it off

Learn gives three reasons: security, because default internet access contradicts Zero Trust principles; clarity, because explicit connectivity is preferred over implicit access; and stability, because the default IP is not customer-owned and can change. It lists configurations that do not work well with default outbound: multiple NICs on a VM can produce inconsistent outbound IPs, scaling virtual machine scale sets can change outbound IPs, and the IPs are not consistent or contiguous across scale set instances. Default outbound IPs also do not support fragmented packets or ICMP pings.

## Configure a private subnet

In the Azure portal:

1. Go to **Virtual networks** and select the network.
2. Select **Subnets**, then the subnet.
3. Set **Default outbound access** to **Disabled**.
4. Select **Save**.

This sets `defaultOutboundAccess = false`. For the command line, Learn shows the Azure CLI form:

```azurecli
az network vnet subnet update --resource-group rgname --name subnetname --vnet-name vnetname --default-outbound false
```

Learn also gives a PowerShell script that loops over the subnets and sets `DefaultOutboundAccess` to `$false`, and an ARM template that sets `defaultoutboundaccess` to false on the subnet.

Important: existing VMs must be stopped and deallocated for a subnet change, in either direction, to take effect on their network interfaces. If you want to move a VM back to default outbound after making the subnet private, make the subnet nonprivate first and then stop and deallocate the VM.

For a new private subnet, set up the explicit method before a workload needs to reach public endpoints. For an existing nonprivate subnet, plan and configure explicit outbound connectivity before you make it private.

## Add an explicit outbound method

Learn lists four options:

1. A **NAT gateway** on the VM's subnet. Learn calls this the recommended method for most scenarios.
2. A **Standard load balancer** configured with outbound rules.
3. A **Standard public IP** on any of the VM's network interfaces.
4. A **firewall or network virtual appliance** in the virtual network, with traffic pointed to it by a user defined route.

For scale sets, Learn says Flexible orchestration mode is secure by default: instances created that way do not have the default outbound IP, so an explicit method is required.

## Limits of private subnets

- Activating or updating VM operating systems, such as Windows, needs an explicit outbound method. Learn gives Windows Activation and Windows Updates as examples of services that do not work without one.
- UDR routes with next hop type `Internet` break in a private subnet. The page's example is a default route to a firewall with exceptions to certain service tags that use next hop `Internet`. Unless the source also has an explicit method, connections to those destinations fail. Service endpoints are not affected.
- VMs can still reach Azure Storage accounts in the same region from a private subnet without an explicit method, and Learn recommends NSGs to control egress.
- Private subnets do not apply to delegated or managed subnets that host PaaS services. Outbound there is managed by the service.
- A load balancer backend pool configured by IP address uses default outbound access because of a known issue. Learn suggests a NAT gateway for the VMs in such a pool.

## Find VMs that still have a default outbound IP

Learn says a NIC-level parameter, `defaultOutboundConnectivityEnabled`, tracks whether a default IP is allocated, and drives a portal banner and Azure Advisor recommendations. In the Azure portal, open **Advisor**, select **Operational Excellence**, and look for **Add explicit outbound method to disable default outbound** and the scale set variant, which are two separate items. Selecting one lists the NICs with default outbound enabled. To clear the alert: use an explicit method, make the subnet private, and stop and deallocate the flagged VMs.

## A rollout plan

This section is my advice, not a Microsoft statement.

1. **Inventory first.** Use the Advisor recommendations to list VMs that rely on default outbound, then check what each one reaches on the internet.
2. **Choose the method per workload.** A shared NAT gateway on the subnet is the simplest for most; use a firewall where you need inspection.
3. **Note the outbound IPs** the NAT gateway or public IPs give you, because partners that allow-list your addresses need the new ones, not the old default ones.
4. **Switch one subnet at a time,** and plan the stop and deallocate step in a maintenance window.
5. **Test updates and activation** from a VM in the private subnet, since Learn names them as breaking without an explicit method.
6. **Check your deployment tooling.** If a pipeline pins an older API version, it keeps the earlier default, so decide on purpose which behavior you want.

## Related

- [Azure Virtual Network](https://www.m365.fm/entity/azure-virtual-network/)
- [Azure Load Balancer](https://www.m365.fm/entity/azure-load-balancer/)
- [Azure Virtual Machines](https://www.m365.fm/entity/azure-virtual-machines/)
- [Azure Virtual Machine Scale Sets](https://www.m365.fm/entity/azure-virtual-machine-scale-sets/)

## Sources

- [Default Outbound Access in Azure - Azure Virtual Network (Microsoft Learn)](https://learn.microsoft.com/azure/virtual-network/ip-services/default-outbound-access)
