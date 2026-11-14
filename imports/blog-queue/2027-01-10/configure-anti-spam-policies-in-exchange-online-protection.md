---
title: "How to Configure Anti-Spam Policies in Exchange Online Protection"
summary: "Create and manage inbound anti-spam policies in the Defender portal: permissions, wizard steps, bulk threshold, actions, quarantine retention, allow and block lists, default policy, priority order, PowerShell cmdlets and a GTUBE test."
status: review
publish: false
author: mirko-p
date: 2027-01-10
topics: [exchange-online-protection, defender-for-office-365]
keypoints:
  - "Create an inbound policy under Email & collaboration > Policies & rules > Threat policies > Anti-spam, then Create > Create policy > Inbound."
  - "Actions can be set for spam, high confidence spam, phishing, high confidence phishing and bulk. High confidence phishing always quarantines."
  - "Spam is retained in quarantine for 1 to 30 days, 15 by default. Zero-hour auto purge and Safety Tips are on by default."
  - "The default policy applies to everyone, is always on and has the lowest priority. Preset Standard and Strict policies override custom and default settings."
  - "The page covers inbound policies only. Outbound policies and the bulk threshold slider range are not described."
faq:
  - q: "Where do I create an anti-spam policy?"
    a: "In the Defender portal go to Email & collaboration > Policies & rules > Threat policies > Anti-spam, or open security.microsoft.com/antispam, then select Create > Create policy > Inbound."
  - q: "Which roles are needed?"
    a: "To add, modify or delete, the Exchange Online roles Organization Management or Security Administrator. Read-only roles are Global Reader, Security Reader or View-Only Organization Management. Entra roles include Global Administrator and Security Administrator."
  - q: "How long is spam kept in quarantine?"
    a: "The valid range is 1 to 30 days and the default is 15. The setting also controls retention for anti-phishing quarantines."
  - q: "How many allow and block entries can I add in the portal?"
    a: "The portal limit is 30 entries. The overall list limit is about 1,000. Use PowerShell for more than 30. Microsoft says the Tenant Allow/Block List has mostly replaced these lists."
  - q: "Which policy wins when several apply?"
    a: "Strict preset first, then Standard preset, then custom policies by priority with 0 highest, then the default policy. Protection stops after the first applicable policy."
---

Anti-spam policies in Exchange Online Protection decide what happens to inbound mail that is judged to be spam, phishing or bulk. This guide follows the Microsoft Learn page Configure spam filter policies. The page covers inbound policies only.

## Permissions

- **Exchange Online:** Organization Management or Security Administrator to add, modify and delete. Global Reader, Security Reader or View-Only Organization Management for read-only access.
- **Microsoft Entra roles:** Global Administrator, Security Administrator, Global Reader or Security Reader. Global Administrator should be limited to emergencies or cases where another role cannot be used.
- **Defender XDR unified RBAC:** applies when both the Defender for Office 365 and Exchange Online permissions toggles under Email & collaboration are Active, and only in the Defender portal (not PowerShell, the Purview portal or the Exchange admin center). The page names Core Security settings (manage) or (read) under Authorization and settings > Security settings.
- If saving fails with a 403 or `CmdletAccessDeniedException` despite correct permissions, the page says an Exchange RBAC configuration refresh may be needed. Contact Microsoft Support.

## Create an inbound policy

Go to **Email & collaboration** > **Policies & rules** > **Threat policies** > **Anti-spam**, or open `https://security.microsoft.com/antispam`. Select **Create** > **Create policy** > **Inbound**.

1. **Name.** Enter a required name and an optional description.
2. **Users, groups and domains.** Add the recipients. Values within one condition use OR. Different condition types use AND. Exceptions use OR. Dynamic distribution groups are not supported.
3. **Bulk email threshold and spam properties.** A slider sets the bulk complaint level threshold. Higher means more likely spam, and the range is not stated. Advanced Spam Filter settings are off by default. Language and country filters can be On or Off.
4. **Actions.** Set message actions for spam, high confidence spam, phishing, high confidence phishing and bulk. Quarantine is preselected for verdicts that quarantine by default. High confidence phishing always quarantines, and recipients can only request release.
5. **Allow and block list.** Allowed and blocked senders and domains. The portal limit is 30 entries and the overall limit is about 1,000.
6. **Review.** Select **Create** and **Done**.

Other settings on the actions page:

- **Retain spam in quarantine:** 1 to 30 days, default 15.
- **Safety Tips:** enabled by default.
- **Zero-hour auto purge:** on by default, with phishing and spam sub-settings both on.
- **Intra-organizational messages:** the default matches high confidence phishing.
- **Bulk moves enabled:** in preview. Bulk mail is tagged Bulk, and mail below the threshold goes to the Promotions folder.

## Manage policies

- Select the policy row to open the flyout and use **Edit**.
- The default policy name cannot be changed. It has no recipient filters.
- Preset policies cannot be edited in the flyout. Use the preset security policies page.
- Turn on, turn off, priority changes and delete work for custom policies only. Deletion is permanent.

## Priority

1. Strict Preset Security Policy, if assigned.
2. Standard Preset Security Policy, if enabled.
3. Custom policies by priority. 0 is highest.
4. The default policy, always on, lowest priority, cannot be disabled or deleted.

Protection stops after the first applicable policy. Settings in default or custom policies are ignored for recipients who are also in the Standard or Strict presets.

## PowerShell

A policy has two parts, a spam filter policy and a rule:

```powershell
New-HostedContentFilterPolicy -Name "Contoso Executives" -HighConfidenceSpamAction Quarantine -SpamAction Quarantine -BulkThreshold 6
New-HostedContentFilterRule -Name "Contoso Executives" -HostedContentFilterPolicy "Contoso Executives" -SentToMemberOf "Contoso Executives Group"
```

The page also covers Get-, Set-, Enable-, Disable- and Remove- cmdlets for policies and rules. `Set-HostedContentFilterRule -Priority` sets the priority, and enabling or disabling the rule switches the whole policy. Removing a policy does not remove its rule, and removing a rule does not remove its policy. Further PowerShell points from the page: the `-MakeDefault` switch on `Set-HostedContentFilterPolicy` turns a policy into the default policy; a policy cannot be renamed in PowerShell (renaming in the portal renames only the rule); a rule can be created disabled or with a priority; a policy created in PowerShell is not visible in the Defender portal until a rule uses it; and `MarkAsSpamBulkMail` is on by default and available only in PowerShell. The text says a BCL of 7, 8 or 9 triggers the action, while the example uses 6, so verify the intended value.

## Test

Send a GTUBE test message as one line with no spaces or line breaks. It works only if the sending organization does not scan outbound spam.

## What the page does not say

- Outbound anti-spam policies.
- The range of the bulk threshold slider.
- Default quarantine policy names.
- Full parameter lists for the cmdlets.

## A setup outline

This outline is my advice, built on the page. Its first step reflects the page's tip that Microsoft typically recommends the Standard and Strict preset security policies over custom anti-spam policies.

1. Check whether the Standard or Strict preset already covers your users, because presets override custom settings.
2. Create a custom policy only for groups that need different handling.
3. Keep the default quarantine retention unless a rule requires otherwise.
4. Test with GTUBE.
5. Review priorities when you have several custom policies.

## Typical mistakes (my advice)

- Editing the default policy and expecting it to override presets.
- Adding more than 30 entries in the portal.
- Treating the allow list as the first choice. The page says the Tenant Allow/Block List has mostly replaced it.
- Deleting only the policy in PowerShell and leaving the rule.

## Related

- [Exchange Online Protection](https://www.m365.fm/entity/exchange-online-protection/)
- [Defender for Office 365](https://www.m365.fm/entity/defender-for-office-365/)
- [Exchange Online](https://www.m365.fm/entity/exchange-online/)

## Sources

- [Configure spam filter policies (Microsoft Learn)](https://learn.microsoft.com/defender-office-365/anti-spam-policies-configure)
