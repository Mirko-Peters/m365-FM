---
title: "Teams for Mac Sign-In Fails After a macOS Upgrade: Troubleshooting"
summary: "After upgrading to macOS 15.3, Teams for Mac can fail to sign in on devices with the Company Portal app, because the upgrade disrupts the Enterprise SSO extension. Learn's workaround is a restart. Includes the documented cause, the sysdiagnose error and the plug-in requirements."
status: review
publish: false
author: mirko-p
date: 2027-01-17
topics: [teams, intune, entra-id, single-sign-on]
keypoints:
  - "Learn describes sign-in problems in Teams for Mac after upgrading to macOS 15.3 on devices that have the Company Portal app installed."
  - "A banner in Teams recommends restarting the device, and Learn's resolution is to restart the macOS device."
  - "The cause is that the upgrade prevents the Enterprise SSO extension framework from working correctly for some users."
  - "The Entra page names the root cause as a potential regression in the PluginKit layer; the sysdiagnose error is Error Domain=PlugInKit Code=16 other version in use."
  - "On macOS the Enterprise SSO plug-in comes with the Intune Company Portal app and needs an MDM-enrolled device with the configuration pushed."
faq:
  - q: "Who is affected?"
    a: "Learn says a device running Teams for Mac with the Company Portal app installed, after an upgrade to macOS 15.3, can have problems signing in or using Teams features. It happens whether you sign in after the upgrade or are already signed in during it."
  - q: "What is the fix?"
    a: "Restart the macOS device. Learn calls this a workaround for the authentication issues, and the banner in Teams recommends a restart."
  - q: "Why does it happen?"
    a: "Per Learn, the macOS upgrade prevents the Enterprise Single Sign-On extension framework from working correctly for some users. The Entra page says the root cause is a potential regression in the PluginKit layer that stops the OS from launching the Microsoft Enterprise SSO Extension."
  - q: "How can I tell whether a Mac is affected?"
    a: "Collect a sysdiagnose and look for Error Domain=PlugInKit Code=16 other version in use. The Entra page also mentions an error tagged 4s8qh."
  - q: "Does this affect only Teams?"
    a: "The Entra page says the issue leads to unexpected authentication failures across all apps integrated with Entra ID on macOS 15.3 and iOS 18.1.1. The Teams page covers Teams for Mac."
---

After an upgrade to macOS 15.3, users of Teams for Mac with the Company Portal app installed can be unable to sign in or use Teams features. Microsoft Learn says the upgrade can disrupt the Enterprise Single Sign-On extension for some users, and that restarting the Mac works around the authentication issue. A banner in Teams recommends a device restart. This article uses Learn's Teams troubleshooting page and the Microsoft Entra page on the Enterprise SSO plug-in for Apple devices.

## Symptoms

On a device that runs Teams for Mac and has the Company Portal app installed, an upgrade to macOS 15.3 can cause problems signing in to Teams or using Teams features. A banner in Teams recommends restarting the device. Learn says the problem occurs in two situations: you try to sign in to Teams after the upgrade, or you are already signed in to Teams during the upgrade.

## Cause

Learn says the macOS upgrade prevents the Enterprise SSO extension framework from working correctly for some users. It links to the Microsoft Entra page, which has a section titled Important update on macOS 15.3 and iOS 18.1.1 impacting Enterprise SSO.

That section says the update to macOS 15.3 and iOS 18.1.1 prevents the Enterprise SSO extension framework from functioning correctly, leading to unexpected authentication failures across all apps integrated with Entra ID. Affected users may also see an error tagged `4s8qh`. The root cause is a potential regression in the underlying PluginKit layer, which prevents the operating system from launching the Microsoft Enterprise SSO Extension. The page says Apple is investigating and working on a resolution. That wording is as I read it, and the page I read does not say whether a resolution has since been released.

## Resolution

Restart the macOS device. The Teams page gives that as the workaround, and the Entra page gives the same recovery step: affected users can reboot their device to recover.

## Check whether a Mac is affected

The Entra page says to collect a sysdiagnose and look for this error:

```text
Error Domain=PlugInKit Code=16 other version in use
```

Its sample entry names the extension `com.microsoft.CompanyPortalMac.ssoextension` and the path of the Company Portal app's SSO extension. If you see this for the extension, the symptom matches the one Learn describes.

## What the Enterprise SSO plug-in is

The Entra page says the Microsoft Enterprise SSO plug-in for Apple devices provides single sign-on for Microsoft Entra accounts on macOS, iOS and iPadOS across apps that support Apple's enterprise single sign-on feature. On macOS it is a built-in feature of the Intune Company Portal app. Requirements listed:

- The device supports and has an installed app that provides the plug-in; for macOS that is Company Portal on macOS 10.15 or later.
- The device is enrolled in MDM, for example through Intune.
- Configuration is pushed to the device to enable the plug-in. Apple requires this.
- Apple devices can reach both the identity provider URLs and Apple's own URLs.

That explains why the Teams page mentions Company Portal: it carries the extension that Teams sign-in relies on in this scenario.

## If a restart does not help

The two pages I read do not give further steps for that case. The Entra page has other relevant material I did not use in full, for example a note that proxies that intercept TLS traffic must exclude certain URLs from inspection, and URLs whose blocking can cause errors such as 1012 NSURLErrorDomain, 1000 com.apple.AuthenticationServices.AuthorizationError or 1001 Unexpected. The Entra page also links an SSO troubleshooting guide for Apple devices, which I did not read. Use those for causes other than the macOS 15.3 regression.

## Reading the two pages together

The Teams page is the short version: symptom, cause and restart. The Entra page explains why a Mac can show Teams sign-in problems in the first place, because Teams relies on the single sign-on extension that Company Portal provides on a managed Mac. The Entra page describes the same regression more broadly, across apps integrated with Entra ID, and across macOS and iOS releases. For an administrator this matters because a ticket that says Teams will not sign in may be one of several apps affected on the same device. The Entra page also notes that the device must be MDM-enrolled with the configuration pushed, so a Mac without that configuration is outside this scenario.

## What I would do

This section is my advice, not a Microsoft statement.

1. **Confirm the pattern first.** Ask whether the problem began right after the macOS upgrade and whether Company Portal is installed. If both are true, a restart is a cheap first step.
2. **Ask users to restart before opening a ticket.** Learn gives it as the recovery, and it takes a minute.
3. **For a fleet, check the macOS version distribution.** Count the Macs on 15.3 so you know how many users could be affected.
4. **Collect a sysdiagnose from one affected Mac** if the restart does not help, and look for the PlugInKit error, so you can tell this cause from a network or configuration problem.
5. **Hold upgrades if you manage them.** If your update policy lets you delay a macOS version, a delay avoids the issue in the meantime. The pages do not recommend this, so weigh it against your own security needs.
6. **Tell users what the banner means.** The banner recommending a restart is the documented symptom, so a short note to staff saves calls.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Single sign-on](https://www.m365.fm/entity/single-sign-on/)

## Sources

- [Can't Sign in to Teams for Mac after macOS Upgrade - Microsoft Teams (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/microsoftteams/teams-on-mac/teams-sign-in-issues-after-os-upgrade)
- [Microsoft Enterprise SSO plug-in for Apple devices - Microsoft identity platform (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/apple-sso-plugin)
