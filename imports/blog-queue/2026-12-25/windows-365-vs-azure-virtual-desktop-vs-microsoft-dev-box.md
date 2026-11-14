---
title: "Windows 365 vs Azure Virtual Desktop vs Microsoft Dev Box: Which Fits Which Workload"
summary: "Compare Windows 365, Azure Virtual Desktop and Microsoft Dev Box using Microsoft Learn: hosting, management, licensing, scaling and fit, plus the Dev Box retirement dates the Learn overview states, with a decision guide per workload."
status: review
publish: false
author: mirko-p
date: 2026-12-25
topics: [windows-365, azure-virtual-desktop, microsoft-dev-box]
keypoints:
  - "Learn recommends choosing per workload, not per company. Azure Virtual Desktop suits multi-session density and RemoteApp. Windows 365 suits predictable per-user capacity."
  - "Windows 365 Enterprise and Business give a dedicated Cloud PC per user. Frontline uses concurrent-user licensing."
  - "Azure Virtual Desktop is a platform service where you manage session hosts, images and networking."
  - "The Dev Box overview states a retirement notice: closing-down period from 14 September 2026 and retirement at 17:00 UTC on 18 September 2028."
  - "The comparison page gives no pricing, SKUs or feature limits."
faq:
  - q: "What is the main difference between Windows 365 and Azure Virtual Desktop?"
    a: "According to Microsoft Learn, Azure Virtual Desktop is a platform service where Microsoft manages the control plane and you manage session hosts, images and networking. Windows 365 is a SaaS Cloud PC service where Microsoft hosts the Cloud PCs and manages most platform infrastructure."
  - q: "How is Windows 365 licensed?"
    a: "Learn says Enterprise and Business editions provide a dedicated Cloud PC per user, one to one. The Frontline edition uses concurrent-user licensing, and capacity aligns to license assignment."
  - q: "Which should I pick for shift workers?"
    a: "Learn lists Windows 365 Frontline for shift-based workers, and Azure Virtual Desktop for task workers, shared desktops and app-only publishing."
  - q: "Is Microsoft Dev Box being retired?"
    a: "The Dev Box overview says it retires at 17:00 UTC on 18 September 2028, with the closing-down period beginning at 16:00 UTC on 14 September 2026. It recommends moving workflows to Windows 365 or another solution."
  - q: "Does Learn compare Dev Box with Azure Virtual Desktop?"
    a: "The Dev Box page does not compare it with Azure Virtual Desktop. It mentions Windows 365 only as a transition target."
---

Azure Virtual Desktop and Windows 365 solve similar problems in different ways, and Microsoft Dev Box targets developers but is being retired. This article uses the Microsoft Learn comparison of Azure Virtual Desktop and Windows 365 and the Dev Box overview. It does not add figures those pages do not give.

## Comparison from Learn

| Area | Azure Virtual Desktop | Windows 365 |
| --- | --- | --- |
| Hosting | Platform service. Microsoft manages the control plane. You manage session hosts, images and networking. | SaaS Cloud PC service. Microsoft hosts the Cloud PCs and manages most platform infrastructure. |
| Management | Azure portal plus endpoint tools, depending on the join and management approach | Intune-centric, with lifecycle tasks handled as device operations |
| Licensing | Pooled multi-session desktops reduce cost per user when concurrency stays below total user count | Enterprise and Business: dedicated Cloud PC per user. Frontline: concurrent-user licensing. |
| Scaling | You scale host capacity by demand and schedules and control VM sizing and placement | Capacity follows license assignment |
| Network | Full network design control | Microsoft-hosted network by default, or an Azure network connection when required |

## Fit by workload

- **Azure Virtual Desktop:** task workers, shared desktops, app-only publishing, bursty or seasonal demand and specialized network integration.
- **Windows 365:** knowledge workers with steady usage and simplified operations. Frontline suits shift-based workers.
- **Either, by case:** developers and power users (Azure Virtual Desktop personal or Windows 365) and contractors (Windows 365 or Azure Virtual Desktop pooled).

Learn recommends choosing per workload rather than per company. Use Azure Virtual Desktop for multi-session density, RemoteApp publishing or deep Azure integration. Use Windows 365 for predictable per-user capacity, Intune-first operations or Frontline shift access.

## Where Dev Box fits

The Dev Box overview describes self-service cloud workstations called dev boxes, which can be preconfigured with project-specific tools and source code. They run on Azure virtual machines with Azure Premium SSDs. It describes three roles: platform engineers and IT admins who set policies, developer team leads with the DevCenter Project Admin role, and developers with the DevCenter Dev Box User role. Management uses a dev center, projects and dev box pools. Dev boxes enroll in Microsoft Intune automatically.

Dev Box governance and cost controls, as the overview describes them, include project policies that restrict networks, images and SKUs, autostop schedules and hibernation. The network configuration determines the region where a dev box is created. Images come from image definitions with YAML-based customizations, custom images in Azure Compute Gallery or marketplace images. Catalogs attached to the dev center run setup tasks during creation. For identity, the page lists native join to Microsoft Entra ID or Active Directory, Conditional Access that requires compliant devices, multifactor authentication and risk-based sign-in.

### Retirement notice

The page states that Microsoft Dev Box retires at 17:00 UTC on 18 September 2028. The closing-down period begins at 16:00 UTC on 14 September 2026, which has already started as of this writing. The page recommends transitioning workflows to Windows 365 or another appropriate solution before the retirement date. It gives no migration steps itself and links to a separate Microsoft Dev Box retirement guide. It also tells you to start a retirement plan now to validate feature differences and to secure licenses and capacity.

## Features at a glance

Learn lists these features. Azure Virtual Desktop offers pooled multi-session and personal desktops, RemoteApp publishing for individual apps, high workload density and full network design control. Windows 365 offers dedicated per-user Cloud PCs, Frontline concurrent-user access and predictable per-user capacity. The page only says that with Azure Virtual Desktop you own the profile solution and storage decisions, and it does not describe those solutions, so check them separately.

## A short decision guide

This guide restates the Learn guidance, with one addition that is a suggestion and not from the page.

1. Ask who uses the desktop: shift workers, knowledge workers, developers or contractors.
2. If you need multi-session density, RemoteApp or deep Azure networking, start with Azure Virtual Desktop.
3. If you want predictable per-user capacity and Intune-first operations, start with Windows 365.
4. For new developer workstations, take the Dev Box retirement dates into account before you commit.

## Not covered

The comparison page gives no pricing, license SKUs, regions, GPU options, protocol details or security features. It does not describe differences between Windows 365 Enterprise and Business beyond their labels. The Dev Box page gives no pricing and no migration steps, and links to a retirement guide.

## Related

- [Windows 365](https://www.m365.fm/entity/windows-365/)
- [Azure Virtual Desktop](https://www.m365.fm/entity/azure-virtual-desktop/)
- [Microsoft Dev Box](https://www.m365.fm/entity/microsoft-dev-box/)

## Sources

- [Compare Azure Virtual Desktop with Windows 365 (Microsoft Learn)](https://learn.microsoft.com/training/modules/explore-azure-virtual-desktop/03-compare-azure-virtual-desktop-windows-365)
- [Microsoft Dev Box for Cloud-Based Development (Microsoft Learn)](https://learn.microsoft.com/azure/dev-box/overview-what-is-microsoft-dev-box)
