---
title: "Intune Plan 1 vs Plan 2 vs Suite: Licensing Options Compared"
summary: "Intune comes in three plans: Plan 1 as the base, Plan 2 adding Remote Help and Advanced Analytics, and the Suite which includes Plan 2. See who needs a license, device-only licenses, unlicensed admin access and co-management rules."
status: review
publish: false
author: mirko-p
date: 2027-01-14
topics: [intune, configuration-manager, co-management]
keypoints:
  - "Microsoft Intune has three plans: Plan 1 is the base service, Plan 2 is additive to Plan 1, and the Suite is additive to Plan 1 and includes Plan 2."
  - "Learn names Remote Help and Advanced Analytics as Plan 2 capabilities; the Suite adds advanced endpoint management and security capabilities."
  - "Any user or device that benefits directly or indirectly from Intune needs a license, including access through a Microsoft API."
  - "Device-only licenses cover shared and no-user-affinity devices but do not support app protection policies, Conditional Access or user-based features."
  - "Admins can sign in without an Intune license; this is on by default for tenants created after July 2021 and cannot be undone once enabled in older tenants."
faq:
  - q: "What are the Intune plans?"
    a: "Microsoft Learn names three. Microsoft Intune Plan 1 is the base service for cloud-based unified endpoint management of devices and apps. Plan 2 is additive to Plan 1 and adds advanced endpoint management capabilities, including Remote Help and Advanced Analytics. The Microsoft Intune Suite is additive to Plan 1, unifies advanced endpoint management and security capabilities, and includes Plan 2."
  - q: "Do I have to buy Intune on its own?"
    a: "Not necessarily. Learn says most organizations get Intune as part of a Microsoft 365 bundle, such as Microsoft 365 E3, E5 or E7, rather than buying the plans directly. For what each bundle includes, current pricing and how to buy, Learn points to the Microsoft Intune plans and pricing page and the Microsoft 365 enterprise plan comparison."
  - q: "Who needs an Intune license?"
    a: "Learn says a license is required for any user or device that benefits directly or indirectly from the Intune service, including access through a Microsoft API. It also says Intune is included only with the licenses listed on the plans and pricing page."
  - q: "When is a device-only license used?"
    a: "For devices not tied to a specific user, such as kiosks, dedicated devices, phone-room devices and IoT. Learn lists enrollment methods that use a device license, among them Windows Autopilot self-deploying mode, Apple Device Enrollment without user affinity, Android Enterprise dedicated and a device enrollment manager account. Those devices do not support app protection policies, Conditional Access or user-based features such as email and calendaring."
  - q: "Do administrators need an Intune license?"
    a: "Not always. Learn says admins can sign in to and manage Intune without an assigned license. This is enabled by default for tenants created after July 2021. For older tenants, an admin needs a license unless the setting Allow access to unlicensed admins is turned on, and Learn says that setting cannot be undone."
---

Intune is licensed in three plans. Plan 1 is the base service, Plan 2 is additive to Plan 1 and adds capabilities such as Remote Help and Advanced Analytics, and the Intune Suite is additive to Plan 1 and includes Plan 2. Most organizations receive Intune through a Microsoft 365 bundle rather than as a separate purchase. This comparison follows the Microsoft Learn page on Intune licensing plans and options.

## The three plans side by side

| Plan | What Learn says |
| --- | --- |
| Microsoft Intune Plan 1 | The base service. Cloud-based unified endpoint management for devices and apps. |
| Microsoft Intune Plan 2 | Additive to Plan 1. Advanced endpoint management capabilities, including Remote Help and Advanced Analytics. |
| Microsoft Intune Suite | Additive to Plan 1. Unifies advanced endpoint management and security capabilities. Includes Plan 2. |

"Additive" means you start from Plan 1 and add to it. The Learn page says the Intune documentation and the Microsoft Intune admin center use these plan names to show which capabilities need which plan. When a feature page says it needs Plan 2 or the Suite, that is the place to check before you plan a rollout.

The Learn page does not list every feature per plan. For the full contents, current prices and how to buy, it points to the Microsoft Intune plans and pricing page and to the Microsoft 365 enterprise plan comparison. This article does not list features that the page does not name.

## Bundles versus standalone

Learn says most organizations get Intune as part of a Microsoft 365 bundle, such as Microsoft 365 E3, E5 or E7. Check the bundle contents on the pricing page. For Education, Learn says Intune Plan 1 for Education is included in Microsoft 365 Education A5 and A3.

## Who needs a license

Learn says an Intune license is required for any user or device that benefits directly or indirectly from the Microsoft Intune service, including access through a Microsoft API. Intune is included only with the licenses listed on the plans and pricing page.

## Device-only licenses

A device-only subscription is for devices that are not affiliated with specific users: kiosks, dedicated devices, phone-room devices, IoT and other single-use devices. Learn says to assign device licenses based on your estimated usage. A device license applies when the device is enrolled through one of these methods:

- Windows Autopilot self-deploying mode
- Apple Device Enrollment Program without user affinity, or with Entra shared device mode
- Apple School Manager without user affinity
- Apple Configurator without user affinity
- Android Enterprise dedicated
- A device enrollment manager account

Devices under a device-only subscription support device-targeted management for eligible enrollment methods, including shared-device and no-user-affinity scenarios. A signed-in user without an Intune license does not stop device-targeted policies, apps or management actions from being processed.

Learn lists three functions that are not supported when a device is enrolled with a device license:

- Intune app protection policies
- Conditional Access
- User-based management features, such as email and calendaring

If you need Conditional Access or app protection for a user, that user needs a user license, not only a device license.

## Unlicensed admin access

Administrators can sign in to and manage Intune without an Intune license. The rules depend on when the tenant was created:

- **Created after July 2021.** Supported by default. No action needed.
- **Created before July 2021.** Admins need an Intune license unless **Allow access to unlicensed admins** is turned on. Learn says this setting cannot be undone after it is enabled.

Learn's important notes:

- Intune supports up to 1000 unlicensed admins per security group. For more administrators in one role assignment, use multiple security groups.
- Members of nested security groups are not included. Admins in nested groups still need a license.
- Access changes can take up to 48 hours to take effect.

This access covers sign-in and management in the Intune admin center. It does not replace license requirements for other features. Learn gives the example that features depending on Microsoft Entra ID P1 or P2 still need that license. To enable the setting in an older tenant, use an account with the Intune Administrator Microsoft Entra role, then go to **Tenant administration** > **Roles** > **Administrator Licensing** and select **Allow access to unlicensed admins** > **Yes**. Learn calls that role privileged and says to use it only when necessary.

## Co-management with Configuration Manager

Learn says most licenses that include Intune also grant the rights to use Microsoft Configuration Manager as long as the subscription remains active. For co-management that enrolls existing Configuration Manager devices into Intune at scale without user interaction, it uses a Microsoft Entra feature called auto-enrollment. That scenario requires Microsoft Entra ID P1 or P2 for each user and Intune Plan 1, which is included automatically. You no longer need to assign individual Intune licenses for this scenario. Other enrollment scenarios still need Intune licenses.

## Confirm what you have

In the Intune admin center, go to **Tenant administration** > **Tenant status**. On the **Tenant details** tab you can see the **MDM authority**, **Total licensed users** and **Total Intune licenses**. For Entra ID P1 or P2, sign in to the Azure portal, open **Microsoft Entra ID** > **Overview** and look under **Basic information**.

## How I would decide

This section is my advice, not a Microsoft statement.

1. Start from what you already own. List the Microsoft 365 bundles in the tenant, then look up which Intune plan each includes on the pricing page.
2. Name the capabilities you need beyond the base service. If a feature page you rely on says Plan 2 or Suite, mark it. Remote Help and Advanced Analytics are the two Learn names for Plan 2.
3. Split users from shared devices. Shared kiosks and no-user-affinity devices can use device licenses, but you lose Conditional Access and app protection on them.
4. Check the admin accounts. If the tenant is older than July 2021, find out whether the unlicensed admin setting is on before you assume admins can sign in without a license.
5. Re-check the pricing page before you buy, because Learn sends you there for current prices and contents.

## Related

- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Configuration Manager](https://www.m365.fm/entity/configuration-manager/)
- [Co-management](https://www.m365.fm/entity/co-management/)

## Sources

- [Microsoft Intune Licensing Plans and Options - Microsoft Intune (Microsoft Learn)](https://learn.microsoft.com/intune/fundamentals/licensing)
