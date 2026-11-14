---
title: "How to Deploy Azure Bastion to Connect to a VM Without a Public IP"
summary: "Deploy Azure Bastion from the portal with default settings: prerequisites, required roles and ports, the three deployment options, removing the VM public IP, billing that starts at deployment, and gaps such as subnet and NSG requirements."
status: review
publish: false
author: mirko-p
date: 2027-01-08
topics: [azure-bastion, azure-virtual-network]
keypoints:
  - "Deploy from the virtual network or VM: Connect > Bastion > Deploy Bastion. A dedicated deployment takes about 10 minutes."
  - "Learn offers three options: Default settings (Standard SKU), Custom settings, and the free Developer SKU for dev/test in select regions."
  - "You connect over RDP or SSH using the VM's private IP. The VM needs no public IP, client software or agent."
  - "You need Reader on the VM and on the network adapter with the private IP. The VM must allow RDP (3389) or SSH (22)."
  - "Hourly billing starts when Bastion is deployed, regardless of outbound data usage. Delete test deployments after use."
faq:
  - q: "How do I deploy Azure Bastion with default settings?"
    a: "Go to your virtual network or VM, select Connect > Bastion in the left pane, select Deploy Bastion and wait about 10 minutes."
  - q: "Do I need a public IP on the VM?"
    a: "No. Learn says connected VMs need no public IP, client software, agent or special configuration. You connect with the VM's private IP address."
  - q: "What roles do I need?"
    a: "Reader on the virtual machine and Reader on the network adapter (NIC) that has the VM's private IP."
  - q: "What does Bastion cost?"
    a: "Hourly billing starts when Bastion is deployed, regardless of outbound data usage. The page gives no prices. The Developer SKU is described as free for dev and test."
  - q: "What size must the Bastion subnet be?"
    a: "The page does not say. It states no subnet name, size or address range, and it describes no network security group rules for Bastion."
---

Azure Bastion lets you reach a VM over RDP or SSH from the Azure portal using its private IP address. The VM does not need a public IP. This guide follows the Microsoft Learn quickstart for deploying Bastion from the portal, and it says where that page is silent.

## Prerequisites

- An Azure subscription.
- A virtual network to which Bastion will be deployed.
- A virtual machine in that network. The VM is not part of the Bastion configuration and does not become the bastion host.
- **Reader** on the virtual machine and **Reader** on the network adapter (NIC) with the VM's private IP.
- Inbound ports on the VM: RDP (3389) for Windows, SSH (22) for Linux.
- For the Developer SKU only: a VM in a region that supports Bastion Developer.

## Choose a deployment option

| Option | What it is |
| --- | --- |
| Default settings | Quick deployment with the Standard SKU |
| Custom settings | Full control over SKU, scaling, availability zones and other features |
| Developer SKU (free) | No-cost, basic features for dev and test, shared pool architecture, select regions only |

Dedicated deployments, which are Default and Custom, take about 10 minutes. The Developer SKU deploys in seconds.

## Deploy with default settings

1. Go to your virtual network or VM. In the left pane select **Connect** > **Bastion**.
2. In the **Bastion** pane select **Deploy Bastion**.
3. Wait about 10 minutes for the deployment.

The page gives steps only for default settings. It does not describe the custom or Developer SKU procedures in the text read.

## Connect to the VM

You connect over SSH or RDP with the VM's private IP. Connected VMs need no public IP, client software, agent or special configuration. The connection procedures, including native clients and scale sets, are on separate pages that were not read for this guide.

## Remove the VM's public IP

A public IP is not needed to connect through Bastion. If the IP is not used elsewhere:

1. Open the VM's **Overview** page and select the **Public IP address**.
2. On the Public IP page, check **Associated to** and select **Dissociate**.
3. Select **Yes** and confirm the IP no longer appears under Associated to.
4. Select **Delete** on the Public IP page and then **Yes**.

## Cost

Hourly billing starts when Bastion is deployed, regardless of outbound data usage. For tests or tutorials, Learn recommends deleting the resource after use. The page gives no prices.

## Clean up

Delete the resource group: search for it in the portal, select **Delete resource group**, type the group name and select **Delete**.

## Caveats

- Bastion works with Azure Private DNS zones, with restrictions described in the Bastion FAQ.
- The Developer SKU uses a shared pool and is limited to select regions.

## What the page does not say

- The required subnet name, size or address range.
- How to create a public IP for the Bastion host itself.
- Network security group rules, apart from the VM's inbound ports.
- Procedures for custom settings and the Developer SKU.
- Prices and the list of supported regions.

If you plan a production deployment, read the Bastion configuration and FAQ pages before you pick a subnet, because this quickstart leaves those details open.

## A deployment checklist

This list is practical advice built on the page.

1. Confirm that you have Reader on the VM and its NIC.
2. Confirm that RDP or SSH is allowed on the VM.
3. Pick Default, Custom or Developer, depending on whether this is production or dev and test.
4. Deploy, then connect with the private IP.
5. Remove the VM's public IP if nothing else uses it.
6. Delete test deployments, because billing runs by the hour.

## Typical mistakes

- Leaving a test Bastion running and paying hourly.
- Using the Developer SKU in an unsupported region.
- Removing a public IP that another service still uses.
- Skipping the subnet planning that the quickstart does not cover.

## Related

- [Azure Bastion](https://www.m365.fm/entity/azure-bastion/)
- [Azure Virtual Network](https://www.m365.fm/entity/azure-virtual-network/)
- [Azure Virtual Machines](https://www.m365.fm/entity/azure-virtual-machines/)

## Sources

- [Quickstart: Deploy Azure Bastion with default settings (Microsoft Learn)](https://learn.microsoft.com/azure/bastion/quickstart-host-portal)
