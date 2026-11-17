---
title: "Copilot Not Working in Microsoft 365 Apps? A Step-by-Step Checklist"
summary: "Copilot button missing, greyed out, or 'Couldn't update license'? Work through this checklist: new button location, license refresh, update channel, privacy settings, network and admin checks."
status: approved
publish: true
author: mirko-p
date: 2026-11-18
topics: [copilot, microsoft-365-apps, copilot-governance]
keypoints:
  - "First look in the lower-right corner of the document. Microsoft moved Copilot into a Dynamic Action Button there, so it may not be missing at all."
  - "Refresh the license with File > Account > Update License, then close and restart all Microsoft 365 apps."
  - "Microsoft Support says Copilot features aren't available on Semi-Annual Enterprise Channel. You need Current Channel or Monthly Enterprise Channel. Separately, Microsoft Learn says Copilot isn't available with device-based licensing for Microsoft 365 Apps for enterprise."
  - "Under File > Account > Account Privacy > Manage Settings, Experiences that analyze your content and All connected experiences must be on."
  - "Admins check the license, the work or school account in Microsoft Entra ID, and that network filtering doesn't block the Copilot endpoints. If a link in a Copilot Chat answer won't open, third-party cookies for Safe Links may be blocked."
faq:
  - q: "Why is the Copilot button missing in Word, Excel or PowerPoint?"
    a: "Microsoft Support lists two first checks. Copilot moved into the Copilot Dynamic Action Button in the lower-right corner of the document, workbook or presentation, and you can move it next to the ribbon. If it still doesn't appear, Copilot may not be included in your subscription or may be restricted by your organization, so check your license."
  - q: "What does 'Couldn't update license' with error code 29 mean?"
    a: "An archived Microsoft Learn page lists this message among the symptoms of Copilot being missing, disabled or not working. Listed causes are a license that was just assigned and hasn't propagated yet, a conflict between personal and work accounts, network problems, a recent Office reset or update, device-based licensing, an unsupported update channel and blocked connected experiences."
  - q: "Do I need a license for Copilot Chat?"
    a: "According to Microsoft Learn's requirements page, Copilot Chat is available to users with an eligible Microsoft 365 subscription and needs no Copilot license for eligible users. Copilot in Word, Excel, PowerPoint and other apps needs a Microsoft Copilot license plus a qualifying prerequisite license."
  - q: "Does Copilot work with a personal Microsoft account at work?"
    a: "The requirements page says users must have a work or school account in Microsoft Entra ID. Learn also lists being signed in with both a personal and a work or school account as a cause that can stop Copilot from validating the license."
  - q: "Which update channel does Copilot need?"
    a: "Current Channel or Monthly Enterprise Channel. Microsoft Support says Copilot features aren't available on Semi-Annual Enterprise Channel. To check, open File > Account and look under Product Information. If you can't change the channel yourself, contact your internal help desk. In the meantime the web versions of the apps work without a channel change."
---

Copilot is missing from the ribbon, the button is greyed out, or an app says **Couldn't update license**. Most of the time one of a few things is behind it: the button moved, the license hasn't refreshed, the update channel isn't supported, or a privacy setting blocks it. This checklist follows the order Microsoft uses, so you can stop as soon as it works.

Note on names: Microsoft is not consistent here. The requirements page on Microsoft Learn calls the paid license "Microsoft Copilot license", the Microsoft Support article says "Copilot license", and older pages say "Microsoft 365 Copilot". In this article, "Copilot license" means the paid license your Microsoft 365 admin assigns to you.

## Step 0: Look for the button in its new place

Microsoft consolidated Copilot into the **Copilot Dynamic Action Button**. In Word, Excel and PowerPoint, look in the lower-right corner of the document, workbook or presentation. You can also move the button next to the ribbon.

Microsoft's page for this problem covers Word, Excel, PowerPoint, Outlook and OneNote on Windows and Mac. If Copilot still doesn't appear, Microsoft says it may not be included with your subscription, or your organization's settings may restrict it. Check which Copilot license you have before you change anything else.

## Step 1: Install the latest Office updates

Install the latest Office updates first. Microsoft Support lists this as the first step and points to its "Install Office updates" article for how to do it. It is cheap to try, and it rules out an old build as the cause.

## Step 2: Refresh the license

1. In any Microsoft 365 app, select **File** > **Account**.
2. Select **Update License**.
3. Close all Microsoft 365 apps and open them again.

If your Microsoft 365 admin just assigned the license, wait a little and repeat. An archived Microsoft Learn page lists a newly assigned license as a cause, because "a new license assignment can take some time to propagate". It gives no fixed waiting time, so don't trust an exact number you find elsewhere.

## Step 3: Check your update channel

Microsoft Support says Copilot features aren't available on **Semi-Annual Enterprise Channel**. To use the features from your Copilot license, you need **Current Channel** or **Monthly Enterprise Channel**.

1. Open any Microsoft 365 app.
2. Select **File** > **Account**.
3. Look under **Product Information**. If it mentions Semi-Annual Enterprise Channel, that is your channel.

Microsoft's page doesn't say you can change the channel yourself. It tells you to contact your internal help desk or technical support. In the meantime, Microsoft says Copilot should be available in the web versions of the apps without a channel update. The archived Learn page about error code 29 gives the same channel requirement.

## Step 4: Check the privacy settings

If your organization manages Microsoft 365, your admin controls these settings and you should ask them. For your own settings:

1. Open any Microsoft 365 app and select **File** > **Account**.
2. Under **Account Privacy**, select **Manage Settings**.
3. Make sure **Experiences that analyze your content** is turned on.
4. Make sure **All connected experiences** is turned on.

The two switch names above come from the Microsoft Support article. The archived Learn page only lists "blocked by your privacy settings" as a possible cause of Copilot not working, without naming the switches.

## Step 5: Check account and license conflicts

- Be signed in with the work or school account that has the license. The requirements page says users need a work or school account in Microsoft Entra ID. The archived Learn page says that being signed in with both a personal and a work or school account can stop Copilot from validating correctly.
- Microsoft Learn says Copilot isn't available with **device-based licensing** for Microsoft 365 Apps for enterprise. The archived Learn page adds that a user-based license is required.
- Copilot isn't available in group mailboxes.
- Some Copilot features need a OneDrive account. Experiences that use mailbox data need a mailbox.

## Step 6: Admin checklist

If the steps above don't help, send this list to your Microsoft 365 admin.

1. **License.** The user has a Copilot license and a qualifying prerequisite license. Copilot Chat needs only an eligible Microsoft 365 subscription.
2. **Policies.** No organization policy blocks Copilot, and connected experiences are allowed.
3. **Network.** The worldwide Microsoft 365 URLs and IP ranges and the Copilot endpoints are allowed. The requirements page says to add `*.cloud.microsoft` to your allow lists and to check that URL filtering, proxy policies, firewall rules, tenant restrictions, Conditional Access policies and app control policies don't block `copilot.cloud.microsoft` or the Copilot app. Allowing only selected addresses inside `*.cloud.microsoft` is not supported. Full WebSocket Secure connectivity to `*.office.com`, `*.cloud.microsoft` and `copilot.cloud.microsoft` is required.
4. **Update task.** The Office Feature Updates task must run on its regular schedule and reach the network resources Copilot needs.
5. **Cookies.** For Copilot to work in Word, Excel and PowerPoint for the web, third-party cookies must be enabled. Separately, when someone selects a link in a Copilot Chat answer, Copilot checks the link with Safe Links first, and that check needs third-party cookies for `*.safelinks.protection.outlook.com`. If the browser blocks them, for example through a managed browser policy, the user sees an "Unable to verify link" message and the link doesn't open. The fix is to allow third-party cookies for `[*.]safelinks.protection.outlook.com`.
6. **Teams content.** Meeting content after a meeting ends needs transcription or recording turned on.

## What to send to support

If everything checks out and Copilot still fails, collect: the exact error text and code, a screenshot of **File** > **Account** showing the version and channel, the license assigned in the admin center, the account type you are signed in with and the time of the last attempt. That is what a support engineer asks for first.

## A short decision path

1. Button missing? Check the lower-right corner.
2. Error about the license? Update License, restart, check for a personal and work account mix.
3. Everything greyed out on a managed PC? Check the update channel and device-based licensing.
4. Some features fail but others work? Check privacy settings, OneDrive and mailbox requirements.
5. Fails for everyone on one network? Ask your admin to check network filtering.

## Related

- [Microsoft 365 Copilot](https://www.m365.fm/entity/copilot/)
- [Microsoft 365 Apps](https://www.m365.fm/entity/microsoft-365-apps/)
- [Copilot governance](https://www.m365.fm/entity/copilot-governance/)

## Sources

- [Microsoft Support: How to find and enable missing Copilot button in Microsoft 365 apps](https://support.microsoft.com/en-US/Office/foundations-experiences/how-to-find-and-enable-missing-copilot-button-in-microsoft-365-apps)
- [Microsoft Support: Use Current Channel or the Monthly Enterprise Channel to access Copilot features](https://support.microsoft.com/en-us/microsoft-365-copilot/use-current-channel-or-the-monthly-enterprise-channel-to-access-copilot-features)
- [Microsoft Learn (archived): Copilot is missing, disabled, or doesn't work correctly](https://learn.microsoft.com/en-us/office/troubleshoot/copilot/copilot-missing-disabled-not-work-correctly)
- [Microsoft Learn: Microsoft Copilot requirements](https://learn.microsoft.com/en-us/copilot/plan/microsoft-copilot-requirements)
