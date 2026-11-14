---
title: "Teams Rooms Pro Management and Conditional Access policies: setup and supported controls"
summary: "How to enable the Teams Rooms Pro Management portal, which licenses it needs, and how to apply Conditional Access and Intune compliance to Teams Rooms resource accounts without breaking sign-in, using Microsoft's supported and unsupported control lists."
status: review
publish: false
author: mirko-p
date: 2026-12-10
topics: [teams-rooms, conditional-access, intune, teams]
keypoints:
  - "Conditional Access for Teams Rooms needs a Teams Rooms Pro license. Entra ID P1 is included in it. Basic licenses are capped at 25 rooms and do not include Conditional Access."
  - "Enable the Pro Management portal by assigning an Entra role such as Teams Devices Administrator or the Teams Rooms Pro Manager role, then sign in at portal.rooms.microsoft.com."
  - "Exclude Teams Rooms resource accounts from your existing Conditional Access policies and create a dedicated policy. Interactive MFA is not supported for them."
  - "Supported grant controls on Windows are block, grant and require compliant device. Sign-in frequency, app enforced restrictions and token protection are not supported."
  - "Do not set operating system version rules in Intune compliance for Teams Rooms on Windows. Rooms update automatically and such rules can block sign-in after an update."
faq:
  - q: "Which license do I need for Conditional Access on Teams Rooms?"
    a: "Microsoft Learn says to use Conditional Access with a Teams Rooms device you need to assign a Microsoft Teams Rooms Pro license. A Microsoft Entra ID P1 service plan is required for Conditional Access and is included in the Teams Rooms Pro and Shared Device licenses."
  - q: "Can I use Teams Rooms Basic licenses everywhere?"
    a: "Learn says you can assign up to 25 Teams Rooms Basic licenses, and that additional systems need Teams Rooms Pro. Basic can license Teams Rooms systems only, not Teams Panels. Entra Conditional Access policies are listed as a Pro-only security feature."
  - q: "Can I require MFA for room accounts?"
    a: "Learn says not to require user interactive MFA, because resource accounts have no second device to approve the request. On Teams Rooms on Windows the Require multifactor authentication grant is listed as not supported. On Android it is listed as supported, with a note not to enforce it for seamless sign-on."
  - q: "Which Intune compliance rules are risky?"
    a: "For Teams Rooms on Windows, Learn lists operating system version rules and all password policies as not supported. It says rooms update Windows automatically, so version values could block sign-in after an update, and password policies can prevent the local account from signing in automatically."
  - q: "Who can open the Pro Management portal?"
    a: "Learn lists the Entra roles Global Administrator, Teams Administrator, Teams Devices Administrator and Global Reader, plus direct assignments in the portal such as Teams Rooms Pro Manager, Site Lead and Site Technician. A Teams Administrator assigned to an administrative unit cannot access the portal, because administrative units are not yet supported."
---

Teams Rooms can be protected with Conditional Access and Intune compliance, but only with a Teams Rooms Pro license and only with the controls Microsoft lists as supported. Rooms are userless devices, so policies built for people, such as interactive MFA or sign-in frequency, can lock a room out. This article covers enabling the Pro Management portal and then building a safe policy.

## Licensing first

Learn lists two room licenses. **Teams Rooms Basic** is at no additional cost with a certified room system and covers core meeting features. It can be assigned to up to 25 Teams Rooms systems, only to Teams Rooms systems and not Teams Panels. **Teams Rooms Pro** adds management features and Microsoft Entra Conditional Access policies, can license both Teams Rooms systems and Teams Panels, and has no quantity cap.

Learn adds assignment rules: room devices managed by central IT should get only Teams Rooms Pro or Basic plus licenses needed for calling or enhanced security. Licenses are for a single room, so using one account across rooms that are not the same room violates the terms. Enterprise per-user suites are not authorized for shared meeting devices.

For Conditional Access, Learn says a Microsoft Entra ID P1 service plan is required and is included in the Pro and Shared Device licenses.

## Step 1: Enable the Pro Management portal

1. Assign users to a role. Learn lists the Entra built-in roles **Global Administrator**, **Teams Administrator**, **Teams Devices Administrator** and **Global Reader**, or direct assignment inside the portal. Microsoft recommends the roles with the fewest permissions and says Global Administrator should be limited to emergency scenarios.
2. Sign in to the portal at `portal.rooms.microsoft.com`. GCC High customers use a separate link given in Learn.
3. To assign the Teams Rooms Pro Manager role, go to **Settings** > **Roles**, select **Teams Rooms Pro Manager**, open **Assignments**, and select **Add**. The wizard applies the assignment to all rooms and room groups.
4. Enroll devices following Learn's "Enroll a Teams Rooms device" article.

Built-in portal roles are **Teams Rooms Pro Manager**, **Site Lead** and **Site Technician**, and you can create custom roles. Learn warns that an administrator assigned to an administrative unit cannot open the portal.

For Intune, Learn's deployment overview says Teams Rooms on Android and Teams panels enroll automatically at first sign-in. Teams Rooms on Windows can enroll with Autopilot and autologin or other Intune enrollment methods.

## Step 2: Prepare the resource accounts

Learn's guidance:

- Put all Teams Rooms resource accounts in one Entra user group. Use a naming standard such as a shared prefix so a dynamic group can include them automatically.
- Exclude the resource accounts from all existing Conditional Access policies, and create a new policy specific to them.
- Do not require user interactive MFA. Use alternative methods for userless devices that satisfy at least two of something you are, know and have.
- Exclude them from policies that need action during sign-in, such as adding authentication methods. The registration prompt is not supported on Teams devices and blocks sign-in.

## Step 3: Build the Conditional Access policy

Learn's example conditions, all of which must be met:

1. The account is a member of the shared devices group.
2. The account only accesses the resources listed on the supported policies page. Attempts to sign in to any other client app are rejected.
3. Modern authentication only, with legacy authentication blocked.
4. The sign-in is on the Windows or Android device platform.
5. The sign-in is from a known, trusted location.
6. The sign-in comes from a compliant device.

Supported controls from the supported policies page:

| Control | Teams Rooms on Windows | Android, phones, panels |
|---|---|---|
| Block, grant access | Supported | Supported |
| Require device to be marked as compliant | Supported | Supported |
| Require multifactor authentication | Not supported | Supported, but do not enforce for seamless sign-on |
| Require authentication strength | Not supported | Not supported |
| Require hybrid joined device, approved app, app protection | Not supported | Not supported |
| Sign-in frequency, persistent browser, app enforced restrictions | Not supported | Not supported |
| Token protection (preview) | Not supported | Not supported |

If you check **Customize continuous access evaluation**, Learn says it must be set to **Disable** or you will experience instability. On Android, do not block device code flow, and the list of resources you should not block includes Microsoft 365 App Catalog Services, Marketplace Extensions Runtime and Office Voice Front Door. Learn also warns that sign-in frequency makes devices sign out periodically and that setting it on individual Microsoft 365 services can interrupt the sign-in flow.

The pages I read do not describe the Entra admin center click path for this scenario or report-only mode specifically. Use report-only first, as Microsoft recommends for Conditional Access in general, and verify with a test room.

## Step 4: Add Intune compliance

Learn's Windows examples: require a firewall, require Microsoft Defender, require Secure Boot, code integrity, TPM and BitLocker only if BitLocker is enabled first. Not supported are:

- Operating system version rules, because rooms update Windows automatically and values could block sign-in after an update.
- All password policies, because they can prevent the local account from automatically signing in.
- Minimum Microsoft Defender Anti-malware version, which updates itself.

For Android and panels, Learn's examples are a minimum OS version above Android 10, blocking rooted devices and requiring storage encryption. Assign the compliance policy to the devices and the resource accounts. Non-compliant devices are marked as such, which then blocks sign-in if Conditional Access requires compliance.

## Typical mistakes

- Applying a tenant-wide MFA or sign-in frequency policy to room accounts.
- Using Basic licenses and expecting Conditional Access.
- Setting an OS version minimum in compliance and losing rooms after an update.
- Blocking device code flow on Android and losing remote sign-in at microsoft.com/devicelogin.
- Assigning a portal role to an administrator scoped to an administrative unit.

## Related

- [Microsoft Teams Rooms](https://www.m365.fm/entity/teams-rooms/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)
- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Microsoft Teams](https://www.m365.fm/entity/teams/)

## Sources

- [Teams Rooms licensing](https://learn.microsoft.com/en-us/microsoftteams/rooms/rooms-licensing)
- [Accessing the Teams Rooms Pro Management portal](https://learn.microsoft.com/en-us/microsoftteams/rooms/enrolling-mtrp-managed-service)
- [Teams Rooms deployment overview](https://learn.microsoft.com/en-us/microsoftteams/rooms/rooms-deploy)
- [Conditional Access and Intune compliance for Teams Rooms and panels](https://learn.microsoft.com/en-us/microsoftteams/rooms/conditional-access-and-compliance-for-devices)
- [Supported Conditional Access and Intune device compliance policies for Teams Rooms](https://learn.microsoft.com/en-us/microsoftteams/rooms/supported-ca-and-compliance-policies)
