---
title: "Disable Copilot in Windows 11: Uninstall, Block and Policy Options"
summary: "Disable Copilot in Windows 11 by uninstalling the app, blocking it with AppLocker or using the RemoveMicrosoftCopilotApp policy, and why the old policy fails."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [copilot, intune]
keypoints:
  - "Users can remove the Microsoft Copilot app in Settings, Apps, Installed apps by selecting the three dots and then Uninstall."
  - "Admins can block the app with an AppLocker rule for the package MICROSOFT.COPILOT, which stops installation and stops the app from starting."
  - "The old TurnOffWindowsCopilot policy is deprecated and isn't meant for the new Copilot experience, so don't rely on it for the current app."
  - "The RemoveMicrosoftCopilotApp policy uninstalls the app only on devices that meet its conditions, and users can reinstall it."
  - "Copilot in Microsoft 365 apps such as Word and Outlook is a separate product with its own settings."
faq:
  - q: "How do I disable Copilot in Windows 11?"
    a: "Open Settings, then Apps, then Installed apps, select the three dots next to Copilot and choose Uninstall. In a company, an admin can block the app with an AppLocker rule for the package MICROSOFT.COPILOT or use the RemoveMicrosoftCopilotApp policy. Microsoft says users can still reinstall the app after that policy removes it."
  - q: "Does the TurnOffWindowsCopilot policy still work?"
    a: "It's deprecated, and Microsoft says it may be removed in a future release. The policy description also says it isn't for the new Copilot experience. It targeted the old Copilot in Windows sidebar. For the current Microsoft Copilot app, use an AppLocker rule to prevent it or the RemoveMicrosoftCopilotApp policy to uninstall it."
  - q: "Can I stop the Copilot key from opening Copilot?"
    a: "Yes. In Settings, go to Personalization, Text input, Customize Copilot key on keyboard and pick Search, Custom or another app. Admins can set the key's target with the Set Copilot Hardware Key policy. Without a Copilot key, Windows key plus C opens the same prompt box."
---
To disable Copilot in Windows 11, open **Settings**, go to **Apps**, then **Installed apps**, select the three dots next to Copilot and choose **Uninstall**. In a company, an admin has two cleaner options: an AppLocker rule that blocks the Microsoft Copilot app, or the `RemoveMicrosoftCopilotApp` policy that uninstalls it on devices that meet certain conditions. This article is for Windows users who want Copilot gone and for admins who have to do it on many PCs. It also explains why the older policy no longer does the job, what the Copilot key does, and where Copilot keeps appearing even after you remove the app.

## What "Copilot in Windows" means today

The name has covered several things over the last two years, so be clear which one you mean. Microsoft's article on the Windows and Microsoft Copilot Chat experience says the updated experience rolled out from September 2024, first as an optional preview and then in the October 2024 monthly security update for Windows 11. It replaced the legacy Copilot in Windows sidebar. Today's Windows experience is the Microsoft Copilot app, which you can start with the Copilot key, with **Win+C** on a keyboard without that key, or from the app itself.

That has two consequences for anyone who wants to disable [Copilot](https://www.m365.fm/entity/copilot/). Older how-to guides describe a policy and a taskbar toggle for the sidebar, and parts of that advice no longer fit. And Copilot in Windows isn't the same product as Copilot inside Word, Excel or Outlook. Removing the Windows app doesn't change those, and the reverse is true as well.

For work and school accounts, Microsoft adds a detail worth knowing. The consumer Microsoft Copilot app doesn't support Microsoft Entra sign-in. Entra users who sign in there are redirected to `https://m365.cloud.microsoft/chat` in a browser. Microsoft also says that if pinning isn't allowed, Copilot Chat isn't available through the app, Outlook or Teams, but users can still reach it at that web address unless the address is blocked.

## How to disable Copilot in Windows 11 on one PC

This is the user route, and it needs no admin tools.

1. Open **Settings**, then **Apps**, then **Installed apps**.
2. Find the Microsoft Copilot app in the list and select the three dots next to it.
3. Select **Uninstall** and confirm.

That's the route Microsoft documents for self-uninstalling the app. If you're an admin on the machine, you can also remove the app with PowerShell. Microsoft's example first reads the package full name with `Get-AppxPackage -Name "Microsoft.Copilot"` and then passes it to `Remove-AppxPackage -Package`. Run it in an administrator PowerShell window. Check the result on a test account before you script it for others.

Uninstalling doesn't prevent a reinstall. A user can add the app again, and Microsoft says so for the policy-based removal too. If you need it to stay away, use the blocking option in the next section.

## Block the Copilot app for good with AppLocker

For a managed fleet, Microsoft recommends AppLocker over the legacy policy. Its article says to configure it before the Windows update that brings the app. You add a packaged app rule with these values:

- **Publisher:** `CN=MICROSOFT CORPORATION, O=MICROSOFT CORPORATION, L=REDMOND, S=WASHINGTON, C=US`
- **Package name:** `MICROSOFT.COPILOT`
- **Package version:** `*` and above

When the rule is enabled, it prevents the consumer app from being installed if it isn't already there, and it blocks the app from launching if it is. That behavior is what most admins want, and it's the only one of the three options that works both before and after installation. Microsoft links its page on editing an AppLocker policy for the mechanics. Roll the rule out to a pilot group first, and test that the Microsoft 365 Copilot app, which has a different package, still starts where you want it.

## Use the RemoveMicrosoftCopilotApp policy, and skip the old one

Two policies show up in searches, and they do different things.

**TurnOffWindowsCopilot (legacy).** Microsoft's WindowsAI policy documentation marks it as deprecated, says it may be removed in a future release, and says it isn't for the new Copilot experience. In Group Policy it appears as **Turn off Windows Copilot** under **User Configuration**, **Windows Components**, **Windows Copilot**. It was written for the old sidebar and covers Windows 10 and 11 versions that had that sidebar. It also states that the policy applies in upgrade scenarios to prevent installation of the Copilot app from an image that had the old sidebar. Don't use it as your main control for the current app.

**RemoveMicrosoftCopilotApp.** This policy uninstalls the app in a targeted way. It applies to Windows 11 version 24H2 and later, and it's available as a user and device setting. Microsoft lists the conditions under which it removes the app:

- Microsoft 365 Copilot and Microsoft Copilot are both installed.
- The Microsoft Copilot app wasn't installed by the user.
- The Microsoft Copilot app wasn't launched in the last 28 days.

If you enable it, the app is uninstalled, and Microsoft says users can still reinstall it if they choose. With Intune, you can deliver it as a custom setting with the path `./Device/Vendor/MSFT/Policy/Config/WindowsAI/RemoveMicrosoftCopilotApp` and an integer value of 1, where 0 means removal is disabled. If you manage devices with [Intune](https://www.m365.fm/entity/intune/), assign it to a pilot group and check the result on a device before you widen the scope.

Two cautions. First, the conditions mean the policy won't touch a device where someone launched the app recently, so it's a clean-up tool and not a block. Second, Microsoft's documentation is inconsistent on editions. The description says the policy applies to Enterprise, Pro and Education client SKUs, while the edition table marks Pro as not supported. Test on a Pro device before you rely on it there.

## A short rollout plan for admins

Whichever option you choose, the order below keeps surprises small.

1. **Decide what you want to prevent.** Is it the Copilot app on the taskbar, the Copilot key, the web address for Copilot Chat, or the Copilot features inside Microsoft 365 apps? Each one needs a different control, as the sections above show.
2. **Pick the control per goal.** Use an AppLocker rule to keep the Windows app away, `RemoveMicrosoftCopilotApp` to clean up devices that already have it, and **Set Copilot Hardware Key** to point the key somewhere else.
3. **Test on a pilot group.** Include one device on each Windows 11 edition you run, and one account with a Microsoft 365 Copilot license, because the removal policy depends on both apps being present.
4. **Verify on the device.** After a removal, `Get-AppxPackage -Name "Microsoft.Copilot"` is the same command Microsoft uses to read the package name, so you can use it to see whether the package is still installed for the user.
5. **Tell your users.** A short note saves helpdesk calls. Say which Copilot is gone, which one stays, and whom to ask if a team needs it.

Keep one more point in mind. Microsoft's pages are updated often in this area, and policy names have already changed once. Review your settings when a new Windows 11 feature update arrives, and read the policy documentation again before you change anything.

## The Copilot key, Win+C and other places Copilot appears

Many modern keyboards have a Copilot key. Microsoft says that since the May 2025 preview, a short press opens a lightweight prompt box that can be expanded to the full app. Users can change what the key does in **Settings**, **Personalization**, **Text input**, **Customize Copilot key on keyboard**, where the options are **Search**, **Custom**, or a mapped app. Admins can set the key's target with the **Set Copilot Hardware Key** policy under **User Configuration**, **Administrative Templates**, **Windows Components**, **Windows Copilot**. The value is the identifier of an app. Microsoft's example is the identifier of the Microsoft 365 Copilot app.

Voice is another gap. Microsoft says there is no feature-specific toggle to disable voice chat in the Windows experience. Turning off optional connected experiences also turns off web grounding, and Microsoft warns that this affects text Copilot as well.

Finally, other apps have their own switches. Word, Excel and PowerPoint have an **Enable Copilot** checkbox on Windows, which is a separate article in this series. Outlook has its own toggle. Disabling the Windows app leaves those untouched.

## Common mistakes

- **Using the old policy for the new app.** TurnOffWindowsCopilot is deprecated and not meant for the current experience.
- **Expecting uninstall to be permanent.** Users can reinstall the app unless AppLocker blocks the package.
- **Treating RemoveMicrosoftCopilotApp as a block.** It only removes the app on devices that meet its conditions, and it's skipped if the app was launched in the last 28 days.
- **Forgetting that Entra users can still reach Copilot Chat in a browser.** The web address works unless you block it.
- **Assuming one change covers everything.** The Windows app, Microsoft 365 apps and the Copilot key each have their own controls.

## Related topics to explore

- Turn off Copilot in Word and the other Office apps: each app has its own **Enable Copilot** checkbox, which is covered in a separate article.
- AppLocker basics for packaged apps: Microsoft's documentation on editing an AppLocker policy explains the rule types, and the Copilot article links to it.
- Pinning Copilot Chat: the [pinning article](https://learn.microsoft.com/en-us/microsoft-365/copilot/pin-copilot-chat-navbar) explains what happens in the Microsoft 365 apps for work accounts.
- Optional connected experiences: they control web grounding for Copilot and have side effects.
- Copilot key mapping: decide whether the key should open search or another app.

## Next step

To disable Copilot in Windows 11, uninstall the Microsoft Copilot app from **Installed apps**, and add an AppLocker rule for `MICROSOFT.COPILOT` if you need it to stay off on managed devices. Read the [WindowsAI policy documentation](https://learn.microsoft.com/en-us/windows/client-management/mdm/policy-csp-windowsai) and the article on the [Windows and Microsoft Copilot Chat experience](https://learn.microsoft.com/en-us/windows/client-management/manage-windows-copilot) before you build a policy, because the names and conditions have changed more than once.
