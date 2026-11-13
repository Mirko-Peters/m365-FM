---
title: "Copilot Not Working in Microsoft 365 Apps? A Step-by-Step Checklist"
summary: "Copilot button missing, greyed out, or 'Couldn't update license'? Work through this checklist: new button location, license refresh, update channel, privacy settings, network and admin checks."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [copilot, microsoft-365-apps, copilot-governance]
keypoints:
  - "First look in the lower-right corner of the document. Microsoft moved Copilot into a Dynamic Action Button there, so it may not be missing at all."
  - "Refresh the license with File > Account > Update License, then close and restart all Microsoft 365 apps."
  - "Copilot needs Current Channel or Monthly Enterprise Channel. Semi-Annual Enterprise Channel does not get it, and device-based licensing is not supported."
  - "Under File > Account > Account Privacy > Manage Settings, Experiences that analyze your content and All connected experiences must be on."
  - "Admins check the license, the work or school account in Microsoft Entra ID, and that network filtering doesn't block the Copilot endpoints."
faq:
  - q: "Why is the Copilot button missing in Word, Excel or PowerPoint?"
    a: "Microsoft Support lists two first checks. Copilot moved into the Copilot Dynamic Action Button in the lower-right corner of the document, workbook or presentation, and you can move it next to the ribbon. If it still doesn't appear, Copilot may not be included in your subscription or may be restricted by your organization, so check your license."
  - q: "What does 'Couldn't update license' with error code 29 mean?"
    a: "Microsoft Learn lists this message among the symptoms of Copilot being missing, disabled or not working. Listed causes are a license that was just assigned and hasn't propagated yet, a conflict between personal and work accounts, network problems, a recent Office reset or update, device-based licensing, an unsupported update channel and blocked connected experiences."
  - q: "Do I need a license for Copilot Chat?"
    a: "According to Microsoft Learn's requirements page, Copilot Chat is available to users with an eligible Microsoft 365 subscription and needs no Copilot license for eligible users. The Copilot in Word, Excel, PowerPoint and other apps needs a Copilot license plus a qualifying base license."
  - q: "Does Copilot work with a personal Microsoft account at work?"
    a: "The requirements page says users must have a work or school account in Microsoft Entra ID. Learn also lists being signed in with both a personal and a work or school account as a cause that can stop Copilot from validating the license."
  - q: "Which update channel does Copilot need?"
    a: "Current Channel or Monthly Enterprise Channel. Microsoft Support says Copilot features aren't available on Semi-Annual Enterprise Channel. To check, open File > Account and look under Product Information. Moving a managed device to another channel is a job for your IT team."
---

Copilot is missing from the ribbon, the button is greyed out, or an app says **Couldn't update license**. Most of the time one of a few things is behind it: the button moved, the license hasn't refreshed, the update channel isn't supported, or a privacy setting blocks it. This checklist follows the order Microsoft uses, so you can stop as soon as it works.

Note on names: Microsoft's current requirements pages call the paid license Microsoft Copilot, and the Support article still uses Microsoft 365 Copilot. Both refer to the same license you assign in the admin center.

## Step 0: Look for the button in its new place

Microsoft consolidated Copilot into the **Copilot Dynamic Action Button**. In Word, Excel and PowerPoint, look in the lower-right corner of the document, workbook or presentation. You can also move the button next to the ribbon.

If Copilot doesn't appear in Word, Excel, PowerPoint or OneNote at all, it may not be part of your subscription, or your organization may restrict it. Check which Copilot license you have before you change anything else.

## Step 1: Install the latest Office updates

Update Microsoft 365 apps to the latest build. An old build can lack the button or fail the license check. Then restart the apps.

## Step 2: Refresh the license

1. In any Microsoft 365 app, select **File** > **Account**.
2. Select **Update License**.
3. Close all Microsoft 365 apps and open them again.

If an admin just assigned the license, wait a little and repeat. Microsoft Learn lists a newly assigned license as a cause, because assignment can take time to propagate. The pages I read don't give a fixed waiting time, so don't trust any exact number you find elsewhere.

## Step 3: Check your update channel

Copilot features aren't available on **Semi-Annual Enterprise Channel**. You need **Current Channel** or **Monthly Enterprise Channel**.

1. Open any Microsoft 365 app.
2. Select **File** > **Account**.
3. Look under **Product Information**. If it mentions Semi-Annual Enterprise Channel, that is your channel.

Moving a managed device to another channel is a job for your IT team. Until then, the web versions of the apps work without a channel change.

## Step 4: Check the privacy settings

If your organization manages Microsoft 365, your admin controls these settings and you should ask them. For your own settings:

1. Open any Microsoft 365 app and select **File** > **Account**.
2. Under **Account Privacy**, select **Manage Settings**.
3. Make sure **Experiences that analyze your content** is turned on.
4. Scroll down and make sure **All connected experiences** is turned on.

Microsoft says these privacy controls for connected experiences can affect which Copilot features are available.

## Step 5: Check account and license conflicts

- Be signed in with the work or school account that has the license. Learn says users need a work or school account in Microsoft Entra ID, and that being signed in with both a personal and a work account can stop Copilot from validating.
- Copilot isn't available with **device-based licensing** for Microsoft 365 Apps. A user-based license is required.
- Copilot isn't available in group mailboxes.
- Some features need a OneDrive account. Outlook mailbox features need an Exchange Online mailbox.

## Step 6: Admin checklist

If the steps above don't help, send this list to your Microsoft 365 admin.

1. **License.** The user has a Copilot license and a qualifying base license. Copilot Chat needs only an eligible Microsoft 365 subscription.
2. **Policies.** No organization policy blocks Copilot, and connected experiences are allowed.
3. **Network.** The worldwide Microsoft 365 URLs and IP ranges and the Copilot endpoints are allowed. Learn says to allow `*.cloud.microsoft` and to check that URL filtering, proxy, firewall, tenant restrictions, Conditional Access and app control don't block `copilot.cloud.microsoft` or the Copilot app. Allowing only selected addresses inside `*.cloud.microsoft` is not supported. Full WebSocket Secure connectivity to `*.office.com`, `*.cloud.microsoft` and `copilot.cloud.microsoft` is required.
4. **Update task.** The Office Feature Updates task must run on its regular schedule and reach the network resources Copilot needs.
5. **Cookies on the web.** Copilot in Word, Excel and PowerPoint for the web needs third-party cookies. Blocking them for `*.safelinks.protection.outlook.com` can cause "Unable to verify link" messages.
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
- [Microsoft Learn: Copilot is missing, disabled, or doesn't work correctly](https://learn.microsoft.com/en-us/office/troubleshoot/copilot/copilot-missing-disabled-not-work-correctly)
- [Microsoft Learn: Microsoft Copilot requirements](https://learn.microsoft.com/en-us/copilot/plan/microsoft-copilot-requirements)
