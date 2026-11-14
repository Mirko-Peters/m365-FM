---
title: "Intune Win32 App Supersedence: How Uninstall Previous Version, Targeting and Auto-Update Behave"
summary: "How Win32 app supersedence works in Microsoft Intune: update versus replacement, the Uninstall previous version toggle, targeting rules, chains, limits and auto-update, based on the Microsoft Learn page, including a conflict in its node limits."
status: review
publish: false
author: mirko-p
date: 2026-12-20
topics: [intune, windows-autopilot, azure-virtual-desktop]
keypoints:
  - "Supersedence works only for Win32 apps. You configure it in the Supersedence step of the app, and the Uninstall previous version toggle decides whether Intune sends an uninstall command."
  - "Superseding apps are not targeted automatically. An untargeted superseding app is ignored by the agent, while the superseded app does not need targeting for the replacement to happen."
  - "Learn describes an app update (toggle off, the installer updates the old version) and an app replacement (toggle on, old app uninstalled, then the new one installed)."
  - "The Learn page names both 10 and 11 as the maximum node count of a supersedence graph. Plan for the smaller number until the page is clarified."
  - "Auto-update applies only to Available assignments and needs two device check-ins, which Learn puts at 8 to 16 hours in total."
faq:
  - q: "What does Uninstall previous version do in Intune Win32 supersedence?"
    a: "Learn says it controls whether Intune sends an uninstall command for each superseded app. If the new installer updates the old app by itself, no uninstall command is needed. When you replace an app with a different app, you might need to turn it on."
  - q: "Does the superseding app need an assignment?"
    a: "Yes. Learn says superseding apps do not get automatic targeting, and untargeted superseding apps are ignored by the agent. The superseded app does not need targeting for supersedence to take place on a device that receives the superseding app."
  - q: "How many apps can be in a supersedence relationship?"
    a: "The Learn page is inconsistent. It states a maximum of 10 nodes in several places and 11 nodes in a single supersedence graph in the limitations section. For auto-update, a Win32 app can have a maximum of 10 superseding apps."
  - q: "Why does the superseding app not appear in the status view?"
    a: "Learn says only apps that are targeted show install statuses in the Microsoft Intune admin center. Check the assignment of the superseding app first."
  - q: "Does supersedence update apps that were installed with Required intent?"
    a: "The auto-update feature does not. Learn says the supersedence auto-update applies only to Available assignments. Users who have the superseded app through Required intent do not receive the superseding app through auto-update."
---

Win32 app supersedence in Microsoft Intune lets one app update or replace another. The setting that matters most is **Uninstall previous version**. With it off, the newer installer is expected to update the old app. With it on, Intune uninstalls the old app first and then installs the new one. Microsoft Learn also documents targeting rules, chain behavior, limits and an auto-update option. This article follows that page and points out one contradiction in it.

## Requirements

- Supersedence applies to Win32 apps only. Learn adds that it does not currently let you interchange the Win32 app with an app dependency.
- You need an Intune permission for supersedence and dependency relationships: **Relate**, in the **Mobile apps** category. Learn says admins need it from service release 2202 to add supersedence or dependency apps when creating or editing a Win32 app.
- Learn says the permission is part of the built-in roles **Application Manager** and **School administrator**.

## Create the relationship

Steps from the Learn page, in the Microsoft Intune admin center:

1. Select **Apps** > **All Apps** and select the Win32 app (the one that will be the superseding app).
2. Select **Properties**.
3. In the **Supersedence** section, select **Edit** > **Add** and choose the apps to be superseded.
4. For each selected app, set **Uninstall previous version**.
5. Select **Review + save** > **Save**.

You can also set this in the **Supersedence** step of the wizard when you add or modify a Win32 app.

## Update versus replacement

Learn separates two cases and ties them to the toggle:

| Case | Toggle | Expected behavior according to Learn |
|---|---|---|
| App update (newer version of the same app) | Off | The installer of the newer version updates the older version. No uninstall command is sent. |
| App replacement (a different app) | On | The superseded app is uninstalled and the superseding app is installed. Both actions use your defined install and uninstall command lines. |

Learn's example cases with both apps detected show the difference. With the toggle off and both apps present, nothing happens because the superseding app is already detected. With the toggle on and both apps present, the superseded app is uninstalled. For a replacement where only the old app is present, Learn says the old app is uninstalled and, once the agent no longer detects it, the new app is installed. If detection keeps reporting the old app as present, the agent does not install the new app. That makes the detection rule of the superseded app part of the process.

Learn also says to review app detection rules after either update type. Two update styles differ in scope: an in-place update swaps content, metadata, detection and install commands for one app at a time, while a supersedence update can change everything and update devices that hold several older versions with one configuration.

## Targeting rules

Learn's key warning: superseding apps do not get automatic targeting. Each app must have explicit targeting to take effect, and superseding apps that are not targeted are ignored by the agent. If the superseding app is targeted to a device that has the superseded app, supersedence happens whether or not the superseded app has targeting. This differs from dependencies, which do not need targeting.

For the behavior matrix, Learn lists three scenarios:

1. Superseded app present and **Uninstall previous version** set to **Yes**: with required intent, the superseded app is uninstalled and the superseding app is installed, even if the superseded app is not targeted. With available intent, only the superseding app appears in the Company Portal.
2. Superseded app present and the toggle set to **No**: with required intent, the superseding app is installed, and whether the old app disappears depends on the new installer.
3. Superseded app not present: the superseding app is installed, or appears in the Company Portal for available intent.

## Chains and dependencies

- All apps in a chain (A superseded by B, B superseded by C) are superseded by the final app, C.
- Supersedence and dependency relationships can exist in the same app graph. Enforcement prefers supersedence. If there is a conflict, Intune reports it. Learn's example is A depends on B and C supersedes B, where A reports a conflict.
- Learn gives an example where supersedence does not go through: A depends on B and C, and B supersedes C.

## Limits, including a contradiction

Learn states a maximum of 10 nodes in a supersedence relationship in the step list and for chains. In the limitations section it states a maximum of 11 nodes in a single supersedence graph, counting the superseding app, the superseded apps and all subsequent related apps. These numbers do not match, so plan for 10 until Microsoft clarifies the page.

Further limits listed by Learn:

- Azure Virtual Desktop multi-session supports supersedence only with system-context (device-based) apps.
- Only targeted apps show install status in the admin center.
- In the Company Portal, if several apps supersede one app, the superseded app's page links to the first superseding app that was set up.

## Auto-update for available apps

Learn describes auto-update for Win32 apps that users installed from the Company Portal:

1. Add the superseding app and select the app to update on the **Supersedence** step.
2. On the **Assignments** step, add a group under **Available for enrolled devices**.
3. In the **Auto-update** column, select the current setting for the group and choose **Auto-update**.
4. Select **OK**, then **Next** > **Create**.

Conditions and behavior from the page:

- The assignment type must be **Available for enrolled devices**. Users with the old app through required intent do not get the update through this feature.
- Two device check-ins for available apps are needed. Learn says the first usually happens 1 to 8 hours after the assignment is created, the second about 8 hours later, so 8 to 16 hours in total.
- The user must be signed in to the device, and a Win32 app can have a maximum of 10 superseding apps.
- If the update fails, Intune retries until the user requests the app in the Company Portal.
- Removing the user from the targeted group, removing the assignment, or changing the intent from Available (for example to Uninstall or Exclude) removes user consent. Retargeting later does not restore auto-update. Learn adds that Uninstall intent takes precedence over Available.
- Any assignment change deletes the component that performs the auto-update, and that component cannot be configured manually. Learn advises studying assignments before deployment.

## What the documentation does not say

The page does not describe how to roll back a failed replacement beyond one auto-update case: if app B fails to install after app A was removed, users cannot reinstall A from the Company Portal because it is superseded, but they can try B again. It also gives no guidance on writing detection rules, uninstall command lines or testing in a production tenant. A pilot group with a copy of the app is the author's suggestion for that, not a Learn procedure.

## Related

- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Windows Autopilot](https://www.m365.fm/entity/windows-autopilot/)
- [Azure Virtual Desktop](https://www.m365.fm/entity/azure-virtual-desktop/)

## Sources

- [Add Win32 app supersedence, Microsoft Intune (Microsoft Learn)](https://learn.microsoft.com/en-us/intune/app-management/deployment/configure-win32-supersedence)
