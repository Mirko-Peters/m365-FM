---
title: "Provision Windows 365 Flex (Formerly Frontline) Cloud PCs for Shift Workers: Dedicated and Shared Mode"
summary: "Provision Windows 365 Frontline Cloud PCs, now named Windows 365 Flex, using Microsoft Learn: what Dedicated and Shared mode are, how licenses map to Cloud PCs and sessions, and the provisioning policy steps in the Intune admin center."
status: review
publish: false
author: mirko-p
date: 2026-12-29
topics: [windows-365-frontline, windows-365]
keypoints:
  - "Learn's What's new page says Windows 365 Frontline was renamed Windows 365 Flex in the week of May 4, 2026, with product, licensing and capabilities unchanged."
  - "One Flex license in Dedicated mode provisions up to three Cloud PCs used nonconcurrently by one user each and provides one concurrent session."
  - "One license in Shared mode provisions one Cloud PC shared nonconcurrently by a group. User data is deleted at sign-out unless User Experience Sync or OneDrive Known Folder Move keeps it."
  - "Create the policy under Devices, Provision Cloud PCs, Provisioning policies, Create policy, and choose License type Windows 365 Flex and Dedicated or Shared."
  - "Shared mode is available only for the Azure Global Cloud, and the All default regions option is not supported for Shared mode."
faq:
  - q: "Is Windows 365 Frontline still a product?"
    a: "According to Microsoft Learn, Windows 365 Frontline was renamed to Windows 365 Flex, and the product, licensing and capabilities are unchanged. The What is Windows 365 Frontline page now describes Flex."
  - q: "What is the difference between Dedicated and Shared mode?"
    a: "Dedicated assigns each Cloud PC to one user, with up to three Cloud PCs per license, and data persists. Shared lets any user in the assigned group use the Cloud PC one at a time, and user data is deleted after each session."
  - q: "How many sessions can run at once?"
    a: "One concurrent session per license. In Dedicated mode the maximum active sessions equal the number of Flex licenses bought, and a concurrency buffer allows exceeding it a limited number of times per day."
  - q: "Where do I create the provisioning policy?"
    a: "In the Microsoft Intune admin center under Devices, Provision Cloud PCs, Provisioning policies, Create policy."
  - q: "What happens when I remove a user or group?"
    a: "In Dedicated mode a removed user's Cloud PC moves into a grace period. In Shared mode removed users lose access, and removing the group from the assignment deprovisions Cloud PCs immediately without a grace period."
---

Shift workers rarely use a Cloud PC all day, so Microsoft sells a license model that shares capacity. Learn's What's new page records that Windows 365 Frontline was renamed Windows 365 Flex in the week of May 4, 2026, with the product, licensing and capabilities unchanged. This guide follows the current Flex pages and uses the old name only where people search for it.

## Two modes

| Aspect | Dedicated | Shared |
| --- | --- | --- |
| Cloud PCs per license | Up to three, each assigned to a single user | One, shared by a group |
| Concurrent sessions per license | One | One |
| Assignment | Each Cloud PC assigned to one user through a Microsoft Entra ID group | Any user in the assigned group |
| Data | Persists between sessions | Deleted after each session. User Experience Sync can store app data and Windows settings |

In Dedicated mode the maximum number of active sessions equals the number of Flex licenses bought, so 10 licenses allow up to 30 Cloud PCs but only 10 active at once. A concurrency buffer allows exceeding that a limited number of times per day, and the Windows 365 Flex connection hourly report and concurrency alert help monitor it. After sign-off a Dedicated Cloud PC stays powered on for two hours. Intelligent prestart can start a Cloud PC for users who connect for at least three days in the past 30, and Session State Retention can hibernate eligible Cloud PCs after an idle period, default two hours.

Shared mode has no concurrency buffer. Only one user connects to a shared Cloud PC at a time, and Cloud Apps can be offered instead of the full desktop. It is available only for the Azure Global Cloud.

## Create the provisioning policy

1. In the Microsoft Intune admin center go to **Devices**, **Provision Cloud PCs**, **Provisioning policies**, **Create policy**.
2. Enter a name. It cannot contain `< > & | " ^`.
3. Choose the **Experience type**. Access only apps is available only for Flex in Shared mode.
4. Set **License type** to **Windows 365 Flex** and **Windows 365 Flex type** to **Dedicated** or **Shared**.
5. Choose the **Join type**: Microsoft Entra Join with a Microsoft hosted network or an Azure network connection, or Hybrid Microsoft Entra join, which needs an Azure network connection. In Shared mode the connection must be in the same region.
6. Choose a gallery or custom image and a language and region. A device name template needs a required `%RAND:Y%` macro. The `%USERNAME:X%` macro is not supported in Shared mode.
7. Under additional services, Windows Autopatch is not available for Shared mode, and User Experience Sync can be enabled for Shared mode only.
8. Assign groups. Nested groups are not supported. In Dedicated mode pick a size per group and optionally reserve licenses. In Shared mode pick a size, a friendly name shown in the Windows app and a Cloud PC number.
9. Review and create. Provisioning starts automatically.

## Managing shared Cloud PCs

Learn lists built-in defaults for shared Cloud PCs: profiles are deleted at sign-out unless Known Folder Move is used, idle sessions sign out after 15 minutes, disconnected sessions end after 30 minutes and Windows Update installs before the first user signs in. The recovery environment is disabled, so a shared Cloud PC is reprovisioned, not reset locally.

## Planning notes

- If a Dedicated group has more users than Cloud PCs for the selected size, some users might not receive one.
- With both modes in a tenant, added licenses provision Dedicated Cloud PCs first.
- Resize and cross region disaster recovery are not yet supported, according to the Flex introduction.

## Not covered

The pages I read do not give license prices or the complete requirements list, which they link separately. The introduction page URL still uses the name introduction-windows-365-frontline in older links and now describes Flex.

## Related

- [Windows 365 Frontline](https://www.m365.fm/entity/windows-365-frontline/)
- [Windows 365](https://www.m365.fm/entity/windows-365/)

## Sources

- [What is Windows 365 Flex?](https://learn.microsoft.com/windows-365/enterprise/introduction-windows-365-flex)
- [Create provisioning policies for Windows 365](https://learn.microsoft.com/windows-365/enterprise/create-provisioning-policy)
- [Managing Windows 365 Flex Cloud PCs](https://learn.microsoft.com/windows-365/enterprise/windows-365-flex-manage)
- [What's new in Windows 365 Enterprise](https://learn.microsoft.com/windows-365/enterprise/whats-new)
