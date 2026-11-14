---
title: "How to Configure Safe Attachments Policies in Defender for Office 365"
summary: "Create and manage Safe Attachments policies in the Defender portal: permissions, wizard steps, response options, quarantine policy, redirect, encrypted attachment handling, priority and presets, PowerShell and timing, with gaps the Learn page leaves."
status: review
publish: false
author: mirko-p
date: 2027-01-10
topics: [defender-for-office-365]
keypoints:
  - "Create a policy under Email & collaboration > Policies & rules > Threat policies > Safe Attachments and select Create. Use least-privilege roles."
  - "The unknown malware response can be Off, Monitor, Block (default and used in Standard and Strict) or Dynamic Delivery. Redirect works only with Monitor."
  - "Allow up to 30 minutes for a policy to take effect. Typical scanning completes within 15 minutes, though retries can extend this."
  - "Built-in protection gives Safe Attachments to all recipients by default. Strict and Standard presets override custom policy settings for their users."
  - "The page lists no portal option for scan timeouts or errors. Dynamic Delivery behavior and Monitor behavior are explained elsewhere."
faq:
  - q: "Where do I create a Safe Attachments policy?"
    a: "In the Defender portal go to Email & collaboration > Policies & rules > Threat policies > Safe Attachments, or open security.microsoft.com/safeattachmentv2, and select Create."
  - q: "Which responses are available?"
    a: "Off, Monitor, Block, and Dynamic Delivery (Preview messages). Block is the default and is used in the Standard and Strict preset policies."
  - q: "Which quarantine policy is the default?"
    a: "AdminOnlyAccessPolicy, whose quarantine notifications are disabled. Create or select a policy with notifications on if recipients should be notified. For encrypted attachments that cannot be scanned the default is DefaultFullAccessWithNotificationPolicy."
  - q: "How long until a new policy works?"
    a: "Allow up to 30 minutes for a new or updated policy to be applied. Separately, typical attachment scanning completes within 15 minutes, although retries and analysis time can extend that."
  - q: "Do I need a custom policy at all?"
    a: "Built-in protection provides Safe Attachments to all recipients by default and there is no default Safe Attachments policy. The page recommends turning on Standard or Strict presets for all users rather than managing many custom policies."
---

Safe Attachments opens email attachments in a safe environment before delivery to look for malware. This guide follows the Microsoft Learn page Set up Safe Attachments policies in Microsoft Defender for Office 365. The page is intended for business customers who have Defender for Office 365, and it points to a 90-day Plan 2 trial.

## Permissions

- **Create, modify, delete:** Organization Management or Security Administrator in Email & collaboration permissions, and Organization Management in Exchange Online permissions.
- **Read-only:** Global Reader or Security Reader, or View-Only Organization Management in Exchange Online.
- **Defender XDR unified RBAC:** applies when both the Defender for Office 365 and Exchange Online permissions toggles under Email & collaboration are Active, and only in the Defender portal. The page names Core Security settings (manage) or (read).
- **Microsoft Entra:** Global Administrator, Security Administrator, Global Reader or Security Reader. The page advises least privilege and limiting Global Administrator to emergencies.
- If saving fails with a 403 or `CmdletAccessDeniedException`, an Exchange RBAC refresh may be needed. Contact Microsoft Support.

## Built-in protection and presets

Built-in protection provides Safe Attachments to all recipients by default. There is no default Safe Attachments policy. Standard and Strict preset security policies are managed on the preset security policies page. Settings in custom policies are ignored for recipients who are also in the Standard or Strict presets. The page recommends turning on Standard or Strict for all users rather than managing many custom policies.

## Create a policy

Go to **Email & collaboration** > **Policies & rules** > **Threat policies** > **Safe Attachments** and select **Create**.

1. **Name.** Required name, optional description.
2. **Users and domains.** Select users, groups or domains, or leave all blank to apply to all recipients. Exceptions are optional. Dynamic distribution groups are not supported.
3. **Settings.**
   - **Safe Attachments unknown malware response:** Off, Monitor, Block (default) or Dynamic Delivery (Preview messages).
   - **Quarantine policy:** applies to messages quarantined by Block or Dynamic Delivery. The default is AdminOnlyAccessPolicy, with notifications disabled.
   - **Redirect messages with detected attachments:** select **Enable redirect** and enter an address. Available only for Monitor.
   - **Block messages containing encrypted attachments that could not be scanned:** appears only with Block. Select Block unscanned attachments to quarantine messages with encrypted (password-protected) attachments that cannot be scanned. You can then exclude types: Acrobat (pdf), archives (zip, gzip, 7z, rar, tar only), Office files (doc, docx, xls, xlsx, ppt, pptx only) and all other file types. The default quarantine policy there is DefaultFullAccessWithNotificationPolicy.
4. **Review.** Select **Submit**, then **Done**.

Allow up to 30 minutes for a new or updated policy to be applied. Separately, typical attachment scanning completes within 15 minutes, though retries and analysis time can extend this. Users cannot release their own messages quarantined by Safe Attachments. They can only request release, if the quarantine policy allows it.

## Manage

- Columns: Name, Status (On or Off), Priority.
- The flyout offers Edit, Turn on or off, priority changes and Delete for custom policies.
- You cannot modify or disable the Standard preset, Strict preset or built-in protection here.
- You can export the list to CSV and open the Threat protection status report with View reports.
- Selecting the check box next to a policy offers More actions: enable, disable or delete selected policies.

## Priority

1. Strict Preset Security Policy, if assigned.
2. Standard Preset Security Policy, if enabled.
3. Custom policies by priority, 0 highest.
4. Built-in protection, always lowest.

Protection stops after the first applicable policy. Values in the same recipient condition use OR. Different condition types use AND.

## PowerShell

A policy has a safe attachment policy and a rule. The portal creates both with the same name.

```powershell
New-SafeAttachmentPolicy -Name "Contoso All" -Enable $true
New-SafeAttachmentRule -Name "Contoso All" -SafeAttachmentPolicy "Contoso All" -RecipientDomainIs contoso.com
```

The default action is Block. Removing a policy does not remove its rule, and removing a rule does not remove its policy. The policy cannot be renamed in PowerShell, and renaming in the portal renames only the rule. A policy created in PowerShell is not visible in the portal until a rule uses it.

## Global settings

Safe Attachments for SharePoint, OneDrive and Microsoft Teams is turned on separately. The page links to it, and to Safe Documents in Microsoft 365 E5, as features configured in the global settings that do not depend on Safe Attachments policies.

## What the page does not say

- A portal option for scans that time out or fail. The only unscanned option covers encrypted attachments. The PowerShell section says the policy controls delivery when scanning cannot complete, but the syntax shown has no named parameter for it.
- How Dynamic Delivery and Monitor behave. Other pages cover them.
- Licensing details. They are only linked.
- A guaranteed scan time.

## A setup outline

This outline is my advice, built on the page. Its first two steps reflect the page's tip that Microsoft typically recommends the Standard and Strict presets over custom policies.

1. Check whether the presets already cover your users.
2. Add a custom policy only for exceptions.
3. Choose a quarantine policy with notifications if recipients should know.
4. Wait up to 30 minutes, then test.
5. Review priorities if you have several custom policies.

## Typical mistakes (my advice)

- Using redirect with Block. It works only with Monitor.
- Expecting users to release their own quarantined mail.
- Forgetting that preset policies override custom ones.
- Deleting a policy and leaving the rule in PowerShell.

## Related

- [Defender for Office 365](https://www.m365.fm/entity/defender-for-office-365/)
- [Exchange Online Protection](https://www.m365.fm/entity/exchange-online-protection/)
- [SharePoint](https://www.m365.fm/entity/sharepoint/)
- [Teams](https://www.m365.fm/entity/teams/)

## Sources

- [Set up Safe Attachments policies in Microsoft Defender for Office 365 (Microsoft Learn)](https://learn.microsoft.com/defender-office-365/safe-attachments-policies-configure)
