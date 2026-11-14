---
title: "Install and Configure an On-Premises Data Gateway for Power BI"
summary: "Install a standard mode on-premises data gateway: gateway types, minimum and recommended requirements, installation steps, recovery key, region, clusters, documented limits such as 1,000 data sources and what the pages do not cover about ports."
status: review
publish: false
author: mirko-p
date: 2026-12-27
topics: [power-bi]
keypoints:
  - "Standard mode serves many users and services. Personal mode works only with Power BI and cannot be shared. A VNet data gateway needs no installation."
  - "Minimum: .NET Framework 4.8, Windows 10, 11 or Server 2019, 2022 or 2025, and 4 GB disk space. Recommended: 8 cores, 8 GB memory and SSD storage."
  - "The gateway cannot be installed on a domain controller, on Server Core or in Windows containers. The user installing it must be admin of the machine."
  - "Keep the recovery key safe. Microsoft does not have access to it and cannot retrieve it."
  - "Microsoft supports only the last six releases, with a new update every month. Each gateway cluster supports a maximum of 1,000 data sources."
faq:
  - q: "What are the minimum requirements?"
    a: "According to Microsoft Learn, .NET Framework 4.8, Windows 10, Windows 11 or Windows Server 2019, 2022 or 2025, 4 GB of disk space for performance monitoring logs and a screen resolution of at least 1280 x 800. Recommended is an 8-core CPU, 8 GB of memory, 64-bit Windows Server and SSD storage for spooling."
  - q: "Can I install it on a domain controller or a laptop?"
    a: "Not on a domain controller. Learn also says not to install a gateway on a computer like a laptop that might be turned off, asleep or disconnected from the internet."
  - q: "What if I lose the recovery key?"
    a: "Learn says you are responsible for keeping it safe. Microsoft does not have access to the key and cannot retrieve it. It is required to recover or move the gateway."
  - q: "Do I need to open inbound ports?"
    a: "The overview says the gateway requires no inbound ports, only outbound ports to the Azure web service it connects to. The pages I read do not list the outbound ports or endpoints."
  - q: "How many data sources can a gateway cluster have?"
    a: "The overview states a limitation of 1,000 data sources maximum on each enterprise or personal gateway cluster."
---

An on-premises data gateway is a locally installed Windows application that bridges on-premises data sources and Microsoft cloud services. For Power BI you normally install it in standard mode. This guide follows the Microsoft Learn overview and installation pages.

## Gateway types

- **Standard mode:** lets multiple users connect to multiple on-premises sources, and one installation serves all supported services, such as Power BI, Power Apps, Power Automate, Logic Apps, Azure Analysis Services, Azure Data Factory and Microsoft Fabric.
- **Personal mode:** lets one user connect, cannot be shared and works only with Power BI.
- **VNet data gateway:** a Microsoft managed service for data sources secured by virtual networks. No installation is required.

The gateway initiates outbound connections to the cloud and requires no inbound connections.

## Requirements

**Minimum**

- .NET Framework 4.8.
- Windows 10, Windows 11, or Windows Server 2019, 2022 or 2025.
- 4 GB of disk space for performance monitoring logs in the default configuration.
- Screen resolution of 1280 x 800 or higher.

**Recommended:** an 8-core CPU, 8 GB of memory, 64-bit Windows Server 2019, 2022 or 2025, and SSD storage for spooling.

## Related considerations from the page

- Gateways are not supported on Server Core installations or on Windows containers.
- The user installing must be the admin of the machine.
- The gateway cannot be installed on a domain controller.
- For Windows authentication, install it on a computer that is a member of the same Microsoft Entra environment as the data sources. For a remote domain, use a domain-joined machine with a trust relationship to the target domain.
- Do not install on a computer that might be turned off, asleep or disconnected, such as a laptop.
- Use a wired connection where possible. Virtualization layers and other applications on the machine can reduce performance.
- Up to two gateways can run on one computer: one personal mode and one standard mode. You cannot have more than one gateway in the same mode on one computer.
- Private link is not supported with the on-premises gateway. The article recommends the VNet data gateway.

## Install in standard mode

1. Download the standard gateway and run the installer.
2. Keep the default installation path, accept the terms and select **Install**.
3. Enter your organization account email and select **Sign in**.
4. Select **Register a new gateway on this computer**, then **Next**.
5. Enter a gateway name, which must be unique across the tenant, and a recovery key, then select **Configure**.
6. Review the summary and select **Close**.

The recovery key is required to recover or move the gateway. Learn warns that you are responsible for keeping it safe, and Microsoft cannot retrieve it.

### Installer options

- **Add to an existing gateway cluster.**
- **Region:** you can change the data center region. Changing the region restricts the regions in which you can use the gateway. The picker is supported only for the Public cloud.
- **Azure Relay:** you can provide your own details.

## Clusters

A cluster avoids a single point of failure. Each gateway in a cluster must be on a different computer and should run the same version. High-availability clusters need the November 2017 update or later. Offline members hurt performance, so remove or disable them. To join, choose **Add to an existing cluster**, select the primary gateway, enter its recovery key and select **Configure**.

## After installation

Add gateway admins in the Power BI service or the Power Platform admin center, configure the gateway for your firewall and network requirements, and troubleshoot errors using the linked articles.

## Limits and support

- For Logic Apps, Power Apps and Power Automate, there is a 2-MB payload limit for writes, a 2-MB request limit and 8-MB compressed response limit for reads, and a GET URL limit of 2048 characters.
- Power BI DirectQuery has a 16-MB uncompressed response limit.
- Credentials are cached on the gateway client, and the cache expires in a matter of hours, so changed credentials may not apply right away.
- Each gateway cluster supports a maximum of 1,000 data sources.
- Microsoft actively supports only the last six releases, and a new update is released every month.

## Not covered

The pages do not list outbound ports, endpoints or proxy settings, the Windows service account, update steps, recovery or migration procedures, or performance tuning. They link to separate articles for these.

## Related

- [Power BI](https://www.m365.fm/entity/power-bi/)

## Sources

- [What is an on-premises data gateway?](https://learn.microsoft.com/data-integration/gateway/service-gateway-onprem)
- [Install an on-premises data gateway](https://learn.microsoft.com/data-integration/gateway/service-gateway-install)
