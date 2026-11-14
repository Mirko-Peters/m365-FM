---
title: "How to Deploy Azure Bastion to Connect to a VM Without a Public IP"
summary: "Deploy Azure Bastion from the portal: prerequisites, required roles and ports, the three deployment options with default, custom and Developer SKU steps, removing the VM public IP, billing from deployment and gaps such as NSG rules and prices."
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
    a: "In the custom settings steps, the subnet is named AzureBastionSubnet (selected automatically if it exists) and its size must be /26 or larger. The page describes no network security group rules for Bastion."
---

Azure Bastion lets you reach a VM over RDP or SSH from the Azure portal using its private IP address. The VM does not need a public IP. This guide follows the Microsoft Learn quickstart Deploy Azure Bastion from the Azure portal, and it says where that page is silent.

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

After deployment you can configure additional settings or upgrade the SKU.

## Deploy with custom settings

1. Go to your virtual network or VM, select **Connect** > **Bastion** and then **Configure manually**.
2. On **Create a Bastion**, set the instance details: **Name**, **Region** (where your virtual network resides), **Availability zone** (optional, only certain regions support zones), **Tier** (the SKU) and **Instance count** (host scaling in scale unit increments).
3. Select your virtual network.
4. For the subnet, an existing **AzureBastionSubnet** is selected automatically. If there is none, select **Edit subnet**, choose the subnet purpose **Azure Bastion**, enter the IPv4 address range and starting address, and select a size of **/26** or larger.
5. For the **Public IPv4 address**, select **Create new** and enter a name, or **Use existing**.
6. Optionally open the **Advanced** tab, then select **Review + Create** and **Create**.

## Deploy the Developer SKU

1. Confirm that your virtual network is in a region that supports Bastion Developer.
2. Go to your virtual network, select **Connect** > **Bastion**, choose the **Authentication Type**, enter your credentials and select **Connect**.

Bastion Developer deploys automatically on the first connect, the connection opens in the Azure portal, and the resource stays deployed after you disconnect. It uses a shared pool, is not dedicated to you, and has limited features. You can upgrade it to a specific SKU.

## Connect to the VM

You connect over SSH or RDP with the VM's private IP. Connected VMs need no public IP, client software, agent or special configuration. The text of this page that was read does not contain a separate connection procedure for the dedicated deployments.

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

- Network security group rules, apart from the VM's inbound ports.
- Prices and the list of supported regions (the page links to the pricing and SKU comparison pages for these).
- The details of the Advanced tab settings (the page links to the configuration settings article).

My advice: for a production deployment, also read the Bastion configuration settings article before you pick a subnet and SKU.

## A deployment checklist

This list is my advice, built on the page.

1. Confirm that you have Reader on the VM and its NIC.
2. Confirm that RDP or SSH is allowed on the VM.
3. Pick Default, Custom or Developer, depending on whether this is production or dev and test.
4. Deploy, then connect with the private IP.
5. Remove the VM's public IP if nothing else uses it.
6. Delete test deployments, because billing runs by the hour.

## Typical mistakes (my advice)

- Leaving a test Bastion running and paying hourly.
- Using the Developer SKU in an unsupported region.
- Removing a public IP that another service still uses.
- Skipping the subnet planning, such as the AzureBastionSubnet size of /26 or larger on the custom settings steps.

## Related

- [Azure Bastion](https://www.m365.fm/entity/azure-bastion/)
- [Azure Virtual Network](https://www.m365.fm/entity/azure-virtual-network/)
- [Azure Virtual Machines](https://www.m365.fm/entity/azure-virtual-machines/)

## Sources

- [Quickstart: Deploy Azure Bastion from the Azure portal (Microsoft Learn)](https://learn.microsoft.com/azure/bastion/quickstart-host-portal)
