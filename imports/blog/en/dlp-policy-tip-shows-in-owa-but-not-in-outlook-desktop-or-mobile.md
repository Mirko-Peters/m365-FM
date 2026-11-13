---
title: "DLP Policy Tip Shows in Outlook on the Web but Not in Outlook Desktop or Mobile"
summary: "A Purview DLP rule works in OWA but the policy tip or override prompt is missing in desktop Outlook or the mobile app. Here are the checks, the settings that matter, and what is still unconfirmed."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [dlp, purview]
keypoints:
  - "OWA, classic Outlook, new Outlook and Outlook mobile do not behave the same for DLP policy tips, so a tip that works in one client proves the policy, not the client."
  - "Override only appears if the rule blocks with override and BlockAccess is true. In Outlook on the web the policy must also be set to Turn it on."
  - "Policy tips in Outlook for Android, iOS and macOS are off by default and are switched on in the Microsoft 365 Apps admin center."
  - "A moderator-confirmed workaround for nested exception groups in desktop Outlook exists in a 2026 thread, but Microsoft Learn does not document it."
faq:
  - q: "Why does my DLP policy tip appear in Outlook on the web but not in desktop Outlook?"
    a: "The two clients evaluate and display tips differently. Microsoft Learn's tip reference lists features that differ between them, for example the oversharing dialog exists in Outlook for Microsoft 365 and new Outlook but not in Outlook on the web. In two 2026 threads, Microsoft Q&A moderators described desktop Outlook as relying on client-side processing. That explanation is not in Learn. Check rule settings first, then the Outlook MailTips option, then complex exceptions."
  - q: "Why is there no business justification prompt for my DLP rule?"
    a: "Learn says that if NotifyAllowOverride is set to WithoutJustification, WithJustification or FalsePositives, BlockAccess must be true and BlockAccessScope must have a suitable value. Otherwise the tip appears but the user finds no way to override. Override in Outlook on the web also needs the policy to be in the Turn it on state."
  - q: "Do DLP policy tips work in Outlook for Android and iOS?"
    a: "Learn's mobile page says yes, but the policy tip UI is turned off by default in Outlook for Android, iOS and macOS. An administrator must enable the setting called Enable Purview Data Loss Prevention (DLP) policy tips in Outlook in the Microsoft 365 Apps admin center. In a June 2026 thread, a user could not find that setting in their tenant, and the case ended without a confirmed fix."
  - q: "How long should I wait after changing a DLP rule before I test again?"
    a: "Learn says there can be latency before a tip appears but gives no number for Outlook. In a July 2026 thread, a moderator advised waiting about an hour. Treat that as community-level guidance, and test again after that time before you change anything else."
---

A DLP policy is set to block external mail with a sensitive attachment and let users continue with a justification. You test it in Outlook on the web and it works. The same message in desktop Outlook shows no tip, or blocks without any chance to override. In the mobile app, the justification prompt never appears.

This pattern appeared in three Microsoft Q&A threads between June and August 2026. None of them ended with a clean, confirmed root cause. They are still a good map of where to look. This is not an official Microsoft procedure. I separate what Microsoft Learn says from what was only reported in a thread.

## What the threads reported

- **Attachment over 1 MB, external recipient:** the tip showed in OWA and not in Outlook desktop for the same user and message. A moderator said the policy configuration looked fine and the difference came from how the clients work. The poster later wrote that the issue was resolved, but did not say what fixed it.
- **Nested exceptions:** a rule with a trusted-domain exception worked in OWA. In desktop Outlook, a message to one internal recipient and one exempted external recipient was blocked. Turning off policy tips on the rule made the message go through.
- **Mobile override:** the justification prompt worked in desktop Outlook and OWA, but not in Outlook for Android. Mobile did show the forwarding restriction. This one stayed open. A moderator said that a missing admin setting may mean the feature has not reached the tenant and that the product team would need to look.

## Step 1: Do not expect identical clients

Learn's [policy tips reference](https://learn.microsoft.com/en-us/purview/dlp-policy-tips-reference) shows that clients differ. It says the oversharing dialog is available in Outlook for Microsoft 365 and in new Outlook for Windows, and not in Outlook on the web. The same table lists a custom compliance URL for Outlook for Microsoft 365 only. Outlook mobile and Outlook for Mac are described as supporting a subset of conditions and actions. So a successful test in OWA is a good sign for the policy, but it cannot show that every client will behave the same.

## Step 2: Check the rule, not just the policy

Open the rule in the Microsoft Purview portal and check these items. All of them come from the Learn page on [notifications and policy tips](https://learn.microsoft.com/en-us/purview/dlp-use-notifications-and-policy-tips), last updated in June 2026.

1. The policy state must be **Turn it on** if you want users to see override in Outlook on the web, and the action must be configured to block with override. Learn also says that the tip comes from the highest-priority, most restrictive matching rule, and that this includes rules in simulation mode. A simulation rule can therefore hide the tip you expected.
2. If the user notification action allows override (without justification, with justification, or false positives), BlockAccess must be true and BlockAccessScope must have a suitable value. Otherwise the tip shows but offers no override.
3. Justification is only asked for the combination of block, allow override and with justification.
4. Tips do not appear for mail encrypted with Purview Message Encryption when the rule uses the detected-encryption condition.
5. Policy tips come from one location. If tips are also configured in the Exchange admin center, they hide the Purview tips in Outlook on the web and Outlook 2013 and later until you turn those off. Learn says existing mail flow rules keep working until you switch to the Purview portal.

## Step 3: Check what Learn says about conditions

For Outlook policy tips, Learn lists the common conditions as supported in Outlook for Microsoft 365, OWA and new Outlook: sensitive info types, sensitivity labels, sender and recipient conditions, and others. The reference does not say anything about nested groups or exceptions. That matters for the next step.

## Step 4: Check the Outlook client option

Learn's troubleshooting page for [DLP policy tips](https://learn.microsoft.com/en-us/troubleshoot/microsoft-365/purview/data-loss-prevention/data-loss-prevention-policy-tips) (updated September 2025) lists a client-side cause for Outlook 2013 and later. In Outlook, go to **File**, **Options**, **Mail**, then **MailTips Options**. Make sure **Policy tip notification** is selected, and that **Display automatically when MailTips apply** is selected under the MailTip bar options. Restart Outlook.

The same page tells global administrators to use the automated diagnostic in the Microsoft 365 admin center. You enter the user, the DLP rule name or GUID, and choose Outlook or OWA, then select **Run Tests**.

If the tip is wrong or missing in OWA itself, Learn has a separate [HAR diagnostic](https://learn.microsoft.com/en-us/troubleshoot/microsoft-365/purview/data-loss-prevention/diagnose-dlp-policy-tip-display-issues) in the Purview portal. You record a browser network trace while you reproduce the issue, then upload the file (maximum 100 MB). The diagnostic reads the policy tip call and shows which rules matched. It covers Outlook on the web only.

## Step 5: Complex exceptions in desktop Outlook

This step comes from a single thread. It is not documented by Microsoft.

In the July 2026 case, the exception group contained a nested branch: sender in a group AND recipient domain in two domains. A moderator first suggested flattening the exceptions into top-level entries. The poster then found a different fix: add the tenant's own domain to every "recipient domain is" condition inside the nested exception branches, next to the real exempted domains. The poster tested three cases: internal plus exempted external, internal plus the combined exception, and a non-exempt external recipient, which was still blocked. The moderator later agreed and said to keep the nested logic with the internal domain added, because flattening would change the business meaning. The moderator's reason was that the desktop evaluator checks the recipients together instead of one by one. None of these claims links to Learn, and the same moderator's first answer had called flattening the "supported fix" and later said keeping the nested logic is better, so the advice is not fully consistent.

Treat this as a tested workaround from one tenant, backed by a Microsoft Q&A moderator, not as a documented rule. Before you use it, test with a pilot group and keep a non-exempt external recipient in the test so you see that blocking still works. The moderator advised waiting about an hour after saving, and suggested a support case if you want the behavior tracked as a product issue.

## Step 6: Mobile needs a switch

Learn's [Outlook mobile policy tip page](https://learn.microsoft.com/en-au/Purview/dlp-outlook-mobile-policy-tip-ref) says the policy tip UI is off by default in Outlook for Android, iOS and macOS. The admin setting is called **Enable Purview Data Loss Prevention (DLP) policy tips in Outlook**. It is in the Microsoft 365 Apps admin center, under **Customization** and **Policy Management**. The values are **Disabled** (default) and **Enabled**, and you can target individuals or groups for a gradual rollout.

The same page says override and justification are supported on Android and iOS through the oversharing dialog, with a default set of justification options that you cannot change. It also says DLP Wait-to-Send is not supported in Outlook for Android and iOS.

In the June 2026 thread, the poster could not find this setting in the tenant. The moderator said the feature might not have reached the tenant and that the product team would need to look. No fix was confirmed. If you cannot find the setting, collect the app version, the user scope and what the user sees, then open a support case.

One more conflict: the older Learn troubleshooting page says policy tips are not supported for Outlook for Mac and iOS. The newer mobile page says they are supported once enabled. Follow the newer page, but test it.

## Step 7: Scope and groups

If you limit the policy to a group, check the type. For the Exchange location, Learn's [DLP policy reference](https://learn.microsoft.com/en-us/purview/dlp-policy-reference) lists mail-enabled security groups, distribution groups and Microsoft 365 groups as supported for both policy creation and rule evaluation. Non-mail-enabled security groups are marked as supported at creation but not during rule evaluation, with a note that this is enabled for specific customers only. A policy scoped to a group of that type may look right in the portal and still not evaluate as you expect.

## Quick verification

After each change:

1. Wait, then send a test message in OWA and in the client that fails, with the same recipients.
2. Test one case that must be blocked and one that must be allowed.
3. If a user is in simulation rules too, remember that those rules can supply the tip.
4. If nothing changes, run the admin center diagnostic and attach its output to a support case.

## Limits of this article

- The cause behind the first thread was never stated. The poster only said it was resolved.
- The nested-exception workaround and the one-hour wait come from a Q&A moderator, not from Learn.
- Learn gives no version list for mobile. Check your Outlook app build and licensing against the current pages.

## Related

- [Data loss prevention](https://www.m365.fm/entity/dlp/)
- [Microsoft Purview](https://www.m365.fm/entity/purview/)

## Sources

- [Microsoft Learn: Send email notifications and show policy tips for DLP policies](https://learn.microsoft.com/en-us/purview/dlp-use-notifications-and-policy-tips)
- [Microsoft Learn: Data Loss Prevention policy tips reference](https://learn.microsoft.com/en-us/purview/dlp-policy-tips-reference)
- [Microsoft Learn: Resolve issues that affect DLP policy tips](https://learn.microsoft.com/en-us/troubleshoot/microsoft-365/purview/data-loss-prevention/data-loss-prevention-policy-tips)
- [Microsoft Learn: Diagnose DLP policy tip issues by using the HAR diagnostic](https://learn.microsoft.com/en-us/troubleshoot/microsoft-365/purview/data-loss-prevention/diagnose-dlp-policy-tip-display-issues)
- [Microsoft Learn: Outlook mobile DLP policy tips](https://learn.microsoft.com/en-au/Purview/dlp-outlook-mobile-policy-tip-ref)
- [Microsoft Learn: DLP policy reference](https://learn.microsoft.com/en-us/purview/dlp-policy-reference)
- [Microsoft Q&A: DLP Policy Tip Not Appearing in Outlook Desktop (August 2026)](https://learn.microsoft.com/en-us/answers/questions/5962586/dlp-policy-tip-not-appearing-in-outlook-desktop)
- [Microsoft Q&A: Outlook desktop Policy Tip falsely blocks DLP-exempted recipient (July 2026)](https://learn.microsoft.com/en-au/answers/questions/5951417/m365-e5-outlook-desktop-policy-tip-falsely-blocks)
- [Microsoft Q&A: Purview DLP policy with Block, Allow users to override and Require business justification (June 2026)](https://learn.microsoft.com/en-us/answers/questions/5923412/microsoft-purview-dlp-policy-with-block-allow-user)
