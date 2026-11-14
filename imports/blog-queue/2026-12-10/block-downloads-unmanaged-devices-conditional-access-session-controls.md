---
title: "Block file downloads on unmanaged devices with Conditional Access session controls"
summary: "Three documented ways to stop downloads from SharePoint and OneDrive on unmanaged personal devices: limited web-only access, Defender for Cloud Apps session policies and the site-level block download policy, with the trade-offs Microsoft states."
status: review
publish: false
author: mirko-p
date: 2026-12-10
topics: [onedrive, sharepoint, conditional-access, microsoft-defender-for-cloud-apps]
keypoints:
  - "The SharePoint admin center option Allow limited, web-only access gives browser-only access with no download, print or sync on unmanaged devices. It blocks Office desktop apps too."
  - "Selecting that option creates a Conditional Access policy for all users and disables earlier policies created from that page. Changes can take up to 24 hours."
  - "A Defender for Cloud Apps session policy behind Conditional Access App Control can block downloads of files matching filters such as sensitivity label. It needs Entra ID P1 as well."
  - "The block download policy set with Set-SPOSite -BlockDownloadPolicy works per site without Conditional Access and cannot be set at organization level."
  - "Session controls apply to the app you target. Learn says Defender for Cloud Apps policies apply to the host app, not connected resource apps, so create a separate policy."
faq:
  - q: "How do I allow only browser access from personal devices?"
    a: "In the SharePoint admin center, go to Access control, select Unmanaged devices, choose Allow limited, web-only access and save. Microsoft Learn says users on unmanaged devices then have browser-only access with no ability to download, print or sync files, and cannot use apps including the Office desktop apps."
  - q: "How long does the change take?"
    a: "Learn says it can take up to 24 hours, and it does not take effect for users already signed in from unmanaged devices. Reverting to Allow Full Access can also take up to 24 hours."
  - q: "Can I allow viewing but block editing in the browser?"
    a: "Learn says that by default the policy lets users view and edit files in the browser. The PowerShell parameters -AllowEditing $false and -ReadOnlyForUnmanagedDevices $true are listed for stricter behavior."
  - q: "How do I block downloads of only sensitive files?"
    a: "Learn describes a Conditional Access policy with the session control Use Conditional Access App Control and a Defender for Cloud Apps session policy of type Control file download (with inspection). The policy can filter by sensitivity label, file name, extension or size, and the action Block blocks matching downloads."
  - q: "Does the SharePoint block download policy need Conditional Access?"
    a: "No. Learn says the Set-SPOSite -BlockDownloadPolicy feature controls access without Conditional Access policies. It can be set for individual sites, not at the organization level, and also prevents moving files to other SharePoint sites."
---

To stop downloads from personal, unmanaged devices, Microsoft documents three routes: the SharePoint limited web-only access setting, a Conditional Access policy that hands the session to Microsoft Defender for Cloud Apps, and the site-level block download policy. They differ in scope, licensing and how much they block, so the choice depends on whether you want to block all downloads or only sensitive ones.

## Option 1: Limited, web-only access

This is the simplest route and works for the whole organization or for individual sites.

1. Go to **Access control** in the SharePoint admin center and select **Unmanaged devices**.
2. Select **Allow limited, web-only access**, then **Save**. The page also offers **Block access**.

Learn describes the result: "Users on unmanaged devices have browser-only access with no ability to download, print, or sync files. They also won't be able to access content through apps, including the Microsoft Office desktop apps." Managed devices keep full access, unless they use an unsupported OS and browser combination.

Things to plan for, per Learn:

- The setting relies on Microsoft Entra Conditional Access. Selecting an option disables previous policies you created from this page and creates a new policy for all users. Earlier customizations are not carried over.
- The change can take up to 24 hours, and does not apply to users already signed in from unmanaged devices.
- Reverting to **Allow Full Access** can also take up to 24 hours.
- For tenant-wide control, Learn recommends a Conditional Access policy that selects the **Office 365** cloud app.
- By default, users can still view and edit files in the browser.

PowerShell offers the same control and finer options:

```powershell
Set-SPOTenant -ConditionalAccessPolicy AllowLimitedAccess
Set-SPOSite -Identity https://<tenant>.sharepoint.com/sites/<site> -ConditionalAccessPolicy AllowLimitedAccess
```

Learn lists advanced parameters: `-AllowEditing $false`, `-ReadOnlyForUnmanagedDevices $true` and `-LimitedAccessFileType` with the values `OfficeOnlineFilesOnly`, `WebPreviewableFiles` (default) and `OtherFiles`. If an organization-wide policy exists, the site-level setting must be at least as restrictive. A sensitivity label can apply it per site with the **Access from unmanaged devices** setting.

The page does not state a license requirement beyond pointing to Entra ID licensing information.

## Option 2: Conditional Access App Control

Use this when you only want to block files that match conditions, such as a sensitivity label. It is a two-part setup.

**Part 1, Conditional Access policy.** In the Microsoft Entra admin center go to **Entra ID** > **Conditional Access** > **Policies** > **New policy**. Include all users, exclude emergency access accounts, select the target apps, add device conditions if needed, and under **Access controls** > **Session** select **Use Conditional Access App Control**. Start in **Report-only**, then switch it on.

Learn adds a note: allow the **Microsoft Defender for Cloud Apps - Session Controls** enterprise app, and if you block access broadly, exclude it from the block policy unless blocking it is intentional.

**Part 2, session policy in Defender.** In the Defender portal, go to **Cloud Apps** > **Policies** > **Policy management** > **Conditional Access**, then **Create policy** > **Session policy**. Set **Session control type** to **Control file download (with inspection)**. Under activities, choose the app and optionally the **Device** (device tags or device types). Under files, filter by **Sensitivity label**, **File name**, **Extension** or **File size (MB)**. Under **Actions**, select **Block**. **Audit** only monitors, and **Protect** applies a sensitivity label.

Licensing per Learn: Defender for Cloud Apps and Microsoft Entra ID P1, each standalone or included in another license. Limits to note:

- Policies apply to the host app only, not connected resource apps such as SharePoint or OneDrive for Teams, so create a separate policy for those.
- When policies conflict, the more restrictive one wins.
- Access policies with the **Client app** filter set to **Mobile and desktop** can affect authentication for some apps.

The Learn page links to a tutorial for the exact unmanaged-device scenario, which I did not read, so verify the device condition against that tutorial.

## Option 3: Block download policy per site

```powershell
Set-SPOSite -Identity <SiteURL> -BlockDownloadPolicy $true
```

Learn says this controls access without Conditional Access policies, works for individual sites or OneDrive accounts but not at organization level, and requires meeting SharePoint Advanced Management prerequisites. It also prevents users from moving files to other SharePoint sites, including through Power Automate or Quick Steps. Optional parameters exclude site owners, Entra groups by ID, or SharePoint groups by name, and can make the site read-only. Users see browser-only access and cannot access content through Microsoft 365 apps.

The page does not describe targeting only unmanaged devices with this policy, so treat it as a block for everyone who is not excluded.

## Choosing between them

| Need | Option |
|---|---|
| Block all downloads from personal devices, simplest setup | Limited, web-only access |
| Block only labeled or filtered files | Conditional Access App Control |
| Lock down a few sites for everyone | Block download policy |

## Typical mistakes

- Expecting the setting to affect users already signed in.
- Customizing a Conditional Access policy that the SharePoint page later replaces.
- Forgetting that limited access also blocks Office desktop apps.
- Targeting only SharePoint with a session policy and leaving connected apps such as Teams uncovered.

## Related

- [OneDrive](https://www.m365.fm/entity/onedrive/)
- [SharePoint](https://www.m365.fm/entity/sharepoint/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)
- [Microsoft Defender for Cloud Apps](https://www.m365.fm/entity/microsoft-defender-for-cloud-apps/)

## Sources

- [Control access from unmanaged devices](https://learn.microsoft.com/en-us/sharepoint/control-access-from-unmanaged-devices)
- [Conditional Access session controls](https://learn.microsoft.com/en-us/entra/identity/conditional-access/concept-conditional-access-session)
- [Create session policies in Defender for Cloud Apps](https://learn.microsoft.com/en-us/defender-cloud-apps/session-policy-aad)
- [Block download policy for SharePoint sites and OneDrive](https://learn.microsoft.com/en-us/sharepoint/block-download-from-sites)
