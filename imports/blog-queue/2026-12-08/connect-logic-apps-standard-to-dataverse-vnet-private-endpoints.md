---
title: "Connect Azure Logic Apps Standard to Dataverse with VNet integration and private endpoints"
summary: "What Microsoft documents for private networking between Logic Apps Standard and Dataverse: VNet integration, private endpoints, managed connector limits, push trigger caveats and where the documentation stops."
status: review
publish: false
author: mirko-p
date: 2026-12-08
topics: [azure-logic-apps, dataverse, azure-private-link, azure-virtual-network]
keypoints:
  - "VNet integration affects outbound traffic only. Private endpoints secure inbound traffic. Configure both under Settings > Networking in the logic app."
  - "Built-in operations can use VNet integration. Shared managed connectors cannot. Learn names the Dataverse trigger as an example of a managed API trigger."
  - "Managed API push triggers and actions, with Dataverse named as an example, do not work with inbound private endpoints because they need a public endpoint."
  - "With VNet integration on, the subnet must allow outbound traffic to the managed connector IP addresses for your region."
  - "Power Platform VNet support works in the other direction, from Power Platform to your network. The pages I read do not describe a private endpoint for Dataverse itself."
faq:
  - q: "Can the Dataverse connector in Logic Apps Standard use VNet integration?"
    a: "According to Microsoft Learn, shared managed connectors run in shared connector clusters and cannot benefit from VNet integration. Built-in operations run in the same cluster as the Logic Apps runtime and can use it. Learn names the Dataverse trigger as an example of a managed API trigger, but the pages read do not state in so many words that every Dataverse operation is a shared managed connector, so plan for outbound access to the managed connector IP addresses."
  - q: "What is the difference between VNet integration and a private endpoint?"
    a: "The Logic Apps networking article says virtual network integration affects only outbound traffic, while private endpoints secure inbound traffic to the logic app. They are configured under Settings > Networking > Inbound traffic configuration and Outbound traffic configuration."
  - q: "Do Dataverse triggers work with an inbound private endpoint?"
    a: "No. Learn lists managed API push triggers and actions, naming Dataverse and Event Grid triggers as examples, as not working with inbound private endpoints, because they need a public endpoint. Some scenarios instead use access restrictions and the PowerPlatformInfra service tag, using the non-region version."
  - q: "What subnet do I need for VNet integration?"
    a: "Learn says the subnet must have no delegations and that you cannot change its size after assignment. It recommends a /26 subnet with 64 addresses, and notes that the Azure portal requires /27 as the minimum size when you create the subnet during integration."
  - q: "Does Power Platform VNet support let me reach Dataverse privately?"
    a: "The VNet support overview describes outbound traffic from Power Platform to resources in your network, using a delegated subnet and an enterprise policy. It lists Dataverse plug-ins and several connectors as covered. It does not describe inbound private access to Dataverse, so check current Power Platform documentation for that scenario."
---

For Logic Apps Standard and Dataverse, Microsoft documents private networking for the logic app side. The Logic Apps networking page names the Dataverse trigger as an example of a managed API trigger, and managed connectors in shared clusters cannot use VNet integration. That limits what VNet integration can do for Dataverse operations. Plan the design around three facts: VNet integration is outbound only, private endpoints are inbound only, and managed connectors do not run inside your virtual network.

## What each setting does

The Logic Apps Standard networking article describes two separate settings.

- **Private endpoints** secure inbound traffic to the logic app, for example calls to a Request trigger.
- **Virtual network integration** affects outbound traffic only.

Where to configure them in the Azure portal: open the logic app, then **Settings** > **Networking**. Use **Inbound traffic configuration** > **Private endpoints** > **Add**, or **Outbound traffic configuration** > **Virtual network integration** > **Add virtual network integration**.

## Prerequisites for VNet integration

Learn says you need a virtual network with a subnet that has no delegations. You cannot change the subnet size after assignment. Microsoft recommends a `/26` subnet with 64 addresses, and the portal requires at least `/27` when you create the subnet during integration.

By default the **Outbound internet traffic** setting routes all outbound traffic through the virtual network, and the app setting `WEBSITE_VNET_ROUTE_ALL` is ignored in that case. If you use your own DNS server, set `WEBSITE_DNS_SERVER` and optionally `WEBSITE_DNS_ALT_SERVER`.

If the storage account behind the logic app uses a private endpoint, the integrated subnet must reach it: TCP 443 for storage, TCP 445 for the SMB file share, and TCP 20000 to 30000 for communication between the App Service plan and the Standard logic app nodes.

## Why Dataverse is a special case

The connector comparison article explains the split.

- **Built-in operations** run in the same cluster as the Logic Apps runtime and can use VNet integration to reach private resources.
- **Shared managed connectors** run in shared connector clusters that are separate from the runtime, and they cannot benefit from VNet integration.

For managed connectors to work with VNet integration on, the subnet must allow outbound traffic to the managed connector IP addresses for the region. If a network security group, user-defined route or firewall is in place, add those addresses.

The Dataverse connector page describes the connector for Logic Apps Consumption and Standard, with a trigger such as **When a row is added, modified or deleted** and actions such as **Add a new row** and **List rows**. It does not describe a private network path to Dataverse. This article's reading is that the Logic Apps side can be locked down, but if the Dataverse operations run as shared managed connectors the call to Dataverse still goes through the managed connector infrastructure. The pages I read do not say whether Dataverse traffic from that infrastructure stays on Microsoft's backbone, so do not claim it in a security review without a source.

## Push triggers and inbound private endpoints

Learn lists a limitation: managed API push triggers and actions, with Dataverse and Event Grid triggers as examples, do not work when the logic app has only an inbound private endpoint, because they need a public endpoint. The Dataverse connector page adds that some scenarios call for access restrictions on the logic app to control inbound access from public networks. If you allow inbound communication from Power Platform with the **PowerPlatformInfra** service tag, use the non-region version.

Two more notes from the connector page:

- In Standard workflows, instance reallocation or an app restart can cause the Dataverse trigger to start a duplicate run, which creates a duplicate `callbackregistrations` entry.
- Copying a Dataverse organization copies webhooks. If you copy before disabling the workflows mapped to the organization, the copied webhooks point at the same logic app workflows, which then get notifications from multiple organizations.

## The other direction: Power Platform VNet support

Do not confuse this with Power Platform virtual network support. Per the Learn overview, it manages outbound traffic from Power Platform to enterprise resources, using a delegated subnet linked to an environment through an enterprise policy. It covers Dataverse plug-ins and connectors such as SQL Server, Azure Blob Storage, Azure Key Vault and custom connectors. It does not describe inbound access to Dataverse, and Trial and Dataverse for Teams environments are not supported.

## A practical decision path

1. **Do you need private inbound access to the workflow?** Add a private endpoint, and test the workflow URL from a VM in the network. A caller outside the network should get `403 Forbidden`.
2. **Does the workflow call private resources?** Use VNet integration and built-in operations where they exist.
3. **Do you use Dataverse push triggers?** Expect conflicts with an inbound-only private endpoint. Consider access restrictions instead.
4. **Does a firewall control outbound traffic?** Allow the regional managed connector IP addresses.

## Common mistakes (own reading of the pages above)

- Expecting VNet integration to secure inbound calls.
- Using a subnet with delegations.
- Blocking managed connector IPs in the NSG or firewall.
- Assuming a private endpoint makes managed connector traffic private. The pages read do not say so.
- Using the region-specific PowerPlatformInfra service tag.

## What to ask before you design

- Is the requirement private inbound access to the workflow, private outbound access from it, or both?
- Does the workflow rely on a Dataverse push trigger, or can it poll?
- Who owns the firewall rules for the managed connector IP addresses, and how are they updated?
- Does the security team accept that the managed connector runs outside your virtual network?

Writing these answers down early avoids a redesign when a push trigger turns out not to work with an inbound-only private endpoint.

## Related

- [Azure Logic Apps](https://www.m365.fm/entity/azure-logic-apps/)
- [Dataverse](https://www.m365.fm/entity/dataverse/)
- [Azure Private Link](https://www.m365.fm/entity/azure-private-link/)
- [Azure Virtual Network](https://www.m365.fm/entity/azure-virtual-network/)

## Sources

- [Secure traffic between Standard logic apps and Azure virtual networks using private endpoints](https://learn.microsoft.com/en-us/azure/logic-apps/secure-single-tenant-workflow-virtual-network-private-endpoint)
- [Differences between built-in operations and Azure connectors in Logic Apps (Standard)](https://learn.microsoft.com/en-us/azure/connectors/compare-built-in-azure-connectors)
- [Connect to Microsoft Dataverse from workflows in Azure Logic Apps](https://learn.microsoft.com/en-us/azure/connectors/connect-common-data-service)
- [Virtual Network support overview for Power Platform](https://learn.microsoft.com/en-us/power-platform/admin/vnet-support-overview)
