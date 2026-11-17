---
title: "What is a Cloud PC? Windows 365 explained for admins"
summary: "A Cloud PC is a Windows virtual machine that the Windows 365 service creates and hosts for a user. Admins do not build it by hand: in most editions assigning a license triggers the creation, and in Enterprise a provisioning policy and Intune management shape the result."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [windows-365]
keypoints:
  - "Microsoft Learn defines a Cloud PC as a highly available, optimized and scalable virtual machine hosted by the Windows 365 service. In Enterprise, Business and Government it has a 1:1 relationship with one user. Windows 365 Flex works differently: in Shared mode a group of users shares one Cloud PC non-concurrently."
  - "Per Learn's overview, admins do not create Cloud PCs manually: Windows 365 creates them when a license is assigned to a user in an appropriate Microsoft Entra group. Windows 365 Reserve works differently: its Cloud PCs are provisioned on demand from Intune or the Windows App. Enterprise adds a provisioning policy and Intune enrollment, Business uses default settings, and Windows 365 for Agents has its own provisioning policies and a pool model."
  - "Windows 365 Frontline was renamed Windows 365 Flex in the week of 4 May 2026. Learn says the product, licensing and capabilities are unchanged."
  - "Enterprise needs licenses for Windows E3, Intune, Microsoft Entra ID P1 and Windows 365. Cloud PCs run on a Microsoft hosted network, which needs no Azure subscription for Entra joined devices, or on your own network through an Azure network connection."
  - "In Enterprise, day-two actions include resize, which can upgrade or downgrade RAM and CPU but never shrinks the disk, and restore from short-term, long-term or manual restore points."
faq:
  - q: "Is a Cloud PC the same as an Azure Virtual Desktop session host?"
    a: "Not in how it is operated. In most editions a Cloud PC is created by the Windows 365 service when a license is assigned (in Enterprise, with a provisioning policy), and in Enterprise, Business and Government it belongs to one user. Learn also says Windows 365 Enterprise uses Azure Virtual Desktop for remote connectivity. A detailed comparison of operations, scaling and cost is a separate topic."
  - q: "Can I install FSLogix in a custom Cloud PC image?"
    a: "No. Learn's device image requirements say custom images cannot contain FSLogix components. They also must be generalized, single-session Windows 10 or 11 Enterprise images with no recovery partition, and newly created custom images must be generation 2; existing generation 1 images stay active. You can upload up to 20 custom images."
  - q: "Can a resize shrink the disk of a Cloud PC?"
    a: "No. Learn's Resize page says the action can upgrade RAM, CPU and storage but can only downgrade RAM and CPU, and that it does not let you downsize disk space. GPU Cloud PCs are not supported for resizing, and resizing disconnects the user and can take 15 to 20 minutes."
---

A Cloud PC is a Windows 10 or 11 virtual machine that the Windows 365 service creates, hosts and keeps available for a user. Microsoft Learn calls it a highly available, optimized and scalable virtual machine with a rich Windows desktop experience, reachable from any device. For an admin the practical consequence is that you assign a license instead of building a VM (Windows 365 Reserve is provisioned on demand, see below); in Enterprise you also assign a provisioning policy.

This article covers editions, licensing, identity, network, image and day-two actions. From the provisioning section onward it describes Windows 365 Enterprise; the other editions differ in places, as the editions section shows. The comparison with Azure Virtual Desktop session hosts is in a separate article.

## The definition, and the one-user rule

According to Learn's [Windows 365 overview](https://learn.microsoft.com/en-us/windows-365/overview), Windows 365 is a cloud-based software-as-a-service that automatically creates Cloud PCs for end users. In Windows 365 Enterprise, Business and Government, users have a 1:1 relationship with their Cloud PC: it is their own personal PC in the cloud. Windows 365 Flex differs, as the editions table shows: one license covers up to three Cloud PCs (Dedicated mode) or one shared Cloud PC (Shared mode), both for non-concurrent use.

Windows 365 Enterprise builds on three services: Microsoft Intune manages the Cloud PCs, [Microsoft Entra ID](/entity/entra-id/) provides identity and access control, and [Azure Virtual Desktop](/entity/azure-virtual-desktop/) provides remote connectivity.

## Editions and the Flex rename

| Edition | What Learn says |
|---|---|
| Business | Made for smaller companies, up to 300 seats, with ready-to-use Cloud PCs and simple management |
| Enterprise | Unlimited seats, custom device images, more management options and full Intune integration |
| Government | Spans a regulated US Government Community Cloud (GCC) and a public-facing cloud |
| Flex | One license can provision up to three Cloud PCs for non-concurrent use (dedicated mode), or one Cloud PC shared non-concurrently by a group (shared mode), for users who need a Cloud PC for limited time per day |
| Reserve | A version of Windows 365 for users who mainly work on physical PCs: short-term Cloud PC access during disruptions, up to 10 days per user per year |
| For Agents | Compute platform for AI-powered computer-using agents; sandbox Cloud PCs for user-prompted tasks. The Windows 365 overview page still labels it "(preview)", while the Agents what's new page lists general availability in the week of 1 June 2026 |

Learn's what's new page says that in the week of 4 May 2026 Windows 365 Frontline was renamed Windows 365 Flex, and that product, licensing and capabilities are unchanged. The [Windows 365 Flex (formerly Frontline)](/entity/windows-365-frontline/) entity page has the short definition.

The editions differ in how much an admin configures. Learn's Business and Enterprise comparison says Business provisioning is simplified: Cloud PCs are provisioned automatically with a standard image after a license is assigned, and policy management is not supported. Business device management is limited to assigning and unassigning licenses in the Microsoft 365 admin center; app deployment is supported only with an Intune license, and Windows Update runs on default client policies that can be edited only with one. With an Intune license some device management is possible, but those Cloud PCs are not visible on the Windows 365 page. Enterprise admins select the network and assign a policy to a Microsoft Entra group. Windows 365 for Agents has its own provisioning policies (agents), groups Cloud PCs into pools, and uses a check-out/check-in model; Learn's Windows 365 overview says agent Cloud PCs are billed pay-as-you-go.

Windows 365 Reserve is provisioned differently. Learn says admins provision its Cloud PCs on demand with the Provision action under Cloud PC Users in the Reserve policy in Intune, not automatically when the policy is created, or users can do it from the Windows App if the admin enables that setting. Provisioning is possible seven days after a license is assigned, and the 10-day period starts when the Cloud PC is provisioned. The what's new page lists Reserve as generally available since the week of 17 November 2025. The Windows 365 overview does not mention it, but the policy wizard offers it as a license type.

Microsoft also sells [Windows 365 Link](/entity/windows-365-link/), described as a device built to connect users directly to a Cloud PC, available in select markets.

## How an Enterprise Cloud PC comes into being

Learn's overview says the Windows 365 service automatically creates Cloud PCs when a Windows 365 license is assigned to a user in an appropriate Microsoft Entra group, and that admins do not create them manually (Reserve is the exception, see editions). For Windows 365 Enterprise, Learn's Enterprise overview adds that provisioning starts automatically and the Cloud PC is enrolled in Intune. Two objects sit between the license and the machine:

- **A Microsoft Entra group.** The Cloud PC is provisioned when a licensed user is in an appropriate group.
- **A provisioning policy.** It holds the rules the service uses to set up the Cloud PC. Learn says that for each Cloud PC license only one provisioning policy sets up the Cloud PC, and the service always uses the first assigned policy. Nested groups are not currently supported for the policy's assignments.

The policy wizard asks for the general settings (name, experience type, license type of Enterprise, Flex or Reserve, join type), the image, the configuration (language and region, optional device name template and additional services), optional scope tags, assignments, and a review. If you use Microsoft Entra hybrid join, Learn says the policy creation can take up to 60 minutes, depending on the last Microsoft Entra Connect sync.

## What you need in place

Learn's requirements page lists these for Windows 365 Enterprise:

- Users need licenses for Windows E3, Intune, Microsoft Entra ID P1 and Windows 365. For Flex, users need the first three licenses and must be added to the Entra security group in the provisioning policy.
- A valid and working Intune and Entra tenant, with the default Intune device type enrollment restriction set to allow the Windows (MDM) platform for corporate enrollment.
- For hybrid joined Cloud PCs, an infrastructure that automatically hybrid joins devices that domain-join to the on-premises Active Directory, and user accounts with synced identities in both directories. Microsoft Entra Domain Services is not supported because it does not support hybrid join.

Billing for human-use Cloud PCs is per user per month, and Learn adds that additional costs may apply based on network usage.

## Network: Microsoft hosted or your own

Learn's requirements page says no Azure or domain configuration is needed to provision Entra joined Cloud PCs on a Microsoft hosted network. If you provision on your own network, you need an active Azure subscription with specific roles: reader on the subscription, the Windows365 network interface contributor role on the resource group, and the Windows365 network user role on the virtual network.

The object that links a Cloud PC to your network is the **Azure network connection (ANC)**. Learn defines it as an Intune admin center object that gives provisioning profiles the information to connect to network-based resources. When a policy runs, the Cloud PC is created in a Microsoft hosted Azure subscription and a virtual network interface card is injected into your virtual network. An ANC is required for hybrid join; each tenant is limited to 50 ANCs; and the subnet needs enough free private IP addresses for the Cloud PCs you plan plus capacity for disaster recovery and reprovisioning.

For a policy with a Microsoft hosted network, you pick a geography and region. Learn's provisioning page recommends all default regions within the geography for resiliency and provisioning success, and says that option is not supported for Flex in shared mode.

## The image

Enterprise Cloud PCs are based on a gallery image (Windows Enterprise images) or a custom image. Per Learn's device image page, you can upload up to 20 custom images, new ones must be generation 2 (existing generation 1 images stay active), and each must be generalized, single-session, free of a recovery partition and FSLogix components, and never joined to Active Directory or Entra ID or enrolled in Intune.

## Day-two actions

In Enterprise, Cloud PCs are Intune-managed devices, so configuration, apps and updates follow your normal device management. Two Enterprise actions follow.

**Resize** (Enterprise, per Learn's Resize page). The remote action preserves user and disk data. It upgrades RAM, CPU and storage or downgrades RAM and CPU, never disk space, without reprovisioning. It does not support GPU Cloud PCs, disconnects the user, and can leave the Cloud PC unavailable for 15 to 20 minutes. With group-based licenses the Cloud PC waits in a Resize pending license state for up to 48 hours until the source license is removed and the target license assigned, in either order.

For Flex, Learn is not uniform. The Flex page still lists the Resize remote action among the features not yet supported. The what's new page records resize for Flex dedicated Cloud PCs as generally available since the week of 2 March 2026, and Learn's page on resizing Flex Cloud PCs in Dedicated mode says Shared mode Cloud PCs cannot be resized.

**Restore.** Learn describes three kinds of Enterprise restore points: short-term points every 4, 6, 12, 16 or 24 hours (10 kept), four fixed long-term points every seven days, and one manual point, created only by admins, which expires after about 28 days if not overwritten. Restoring loses everything changed since the point, including applications and downloads; OneDrive data is not lost. Admins can allow users to restore their own Cloud PCs.

## How users connect

The planning guide says all users connect through the Windows App client or a supported browser. Learn's page on accessing Cloud PCs lists the Windows App and a web client at windows.cloud.microsoft for Business, Enterprise, Flex and Government. The overview still names windows365.microsoft.com; in our reading the access page is the more specific source, so give users windows.cloud.microsoft and the Windows App.

## Checklist for a first pilot

1. Confirm the edition (Business, Enterprise, Government, Flex, Reserve or For Agents). The steps below assume Enterprise; for Reserve, use the Provision action under Cloud PC Users.
2. Confirm the licenses: Windows E3, Intune, Entra ID P1, Windows 365, and that the provisioning admin is an Intune Administrator or Windows 365 Administrator.
3. Decide the join type and, with it, whether a Microsoft hosted network or an ANC is needed.
4. Pick gallery or custom image.
5. Create a provisioning policy and assign it to a pilot group; allow up to 60 minutes for hybrid join policies.
6. Define who may resize and restore, and agree what users must save outside the Cloud PC.

## Sources

Retrieved on 17 November 2026.

- [Microsoft Learn: What is Windows 365?](https://learn.microsoft.com/en-us/windows-365/overview)
- [Microsoft Learn: What is Windows 365 Enterprise?](https://learn.microsoft.com/en-us/windows-365/enterprise/overview)
- [Microsoft Learn: Windows 365 requirements](https://learn.microsoft.com/en-us/windows-365/enterprise/requirements)
- [Microsoft Learn: Create provisioning policies for Windows 365](https://learn.microsoft.com/en-us/windows-365/enterprise/create-provisioning-policy)
- [Microsoft Learn: Azure network connections](https://learn.microsoft.com/en-us/windows-365/enterprise/azure-network-connections)
- [Microsoft Learn: Device images in Windows 365](https://learn.microsoft.com/en-us/windows-365/enterprise/device-images)
- [Microsoft Learn: Resize a Cloud PC](https://learn.microsoft.com/en-us/windows-365/enterprise/resize-cloud-pc)
- [Microsoft Learn: Cloud PC restore overview](https://learn.microsoft.com/en-us/windows-365/enterprise/restore-overview)
- [Microsoft Learn: Windows 365 planning guide](https://learn.microsoft.com/en-us/windows-365/enterprise/planning-guide)
- [Microsoft Learn: What's new in Windows 365 Enterprise](https://learn.microsoft.com/en-us/windows-365/enterprise/whats-new)
- [Microsoft Learn: Compare Windows 365 Business and Enterprise](https://learn.microsoft.com/en-us/windows-365/business-enterprise-comparison)
- [Microsoft Learn: What is Windows 365 for Agents?](https://learn.microsoft.com/en-us/windows-365/agents/introduction-windows-365-for-agents)
- [Microsoft Learn: What is Windows 365 Flex?](https://learn.microsoft.com/en-us/windows-365/enterprise/introduction-windows-365-flex)
- [Microsoft Learn: Resize Windows 365 Flex Cloud PCs in Dedicated mode](https://learn.microsoft.com/en-us/windows-365/enterprise/resize-windows-365-flex-cloud-pc)
- [Microsoft Learn: What is Windows 365 Reserve?](https://learn.microsoft.com/en-us/windows-365/enterprise/introduction-windows-365-reserve)
- [Microsoft Learn: What's new in Windows 365 for Agents](https://learn.microsoft.com/en-us/windows-365/agents/whats-new)
- [Microsoft Learn: Managing Windows 365 Reserve](https://learn.microsoft.com/en-us/windows-365/enterprise/windows-365-reserve-manage)
- [Microsoft Learn: Accessing Cloud PCs](https://learn.microsoft.com/en-us/windows-365/end-user-access-cloud-pc)
