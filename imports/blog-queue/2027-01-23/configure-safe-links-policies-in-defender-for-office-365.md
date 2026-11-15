---
title: "How to Configure Safe Links Policies in Defender for Office 365"
summary: "Create, edit, prioritize and remove Safe Links policies in the Microsoft Defender portal or Exchange Online PowerShell. Covers preset policies and Built-in protection, the URL and click protection settings, the policy and rule split in PowerShell, the six hour delay and how to test."
status: review
publish: false
author: mirko-p
date: 2027-01-23
topics: [safe-links, defender-for-office-365, exchange-online-powershell]
keypoints:
  - "There is no default Safe Links policy, but the Built-in protection preset covers all recipients not in the Standard or Strict presets or in custom policies."
  - "Learn typically recommends turning on and adding all users to the Standard or Strict preset security policies instead of managing custom policies."
  - "Create custom policies under Email and collaboration, Policies and rules, Threat policies, Safe Links. Allow up to 6 hours for a new or updated policy to apply."
  - "Preset policies are always applied first. Custom policies follow in priority order, 0 is highest, and processing stops at the first policy that applies to a recipient."
  - "In PowerShell a policy is two objects: the safe links policy for settings and the safe links rule for priority and recipients."
faq:
  - q: "Do I need a custom Safe Links policy?"
    a: "Learn says there is no default Safe Links policy, but the Built-in protection preset security policy provides Safe Links protection to all recipients by default. Recipients in the Standard or Strict presets or in custom policies are not affected by it. Learn typically recommends turning on the Standard or Strict preset and adding all users, instead of creating and managing custom policies. Custom policies give greater granularity for specific users, groups or domains."
  - q: "Which permissions do I need?"
    a: "To create, modify and delete policies you need membership in Organization Management or Security Administrator in Email and collaboration RBAC and Organization Management in Exchange Online RBAC, or the Core Security settings manage permission in Unified RBAC, or a Microsoft Entra role such as Security Administrator. Read-only access comes with roles such as Global Reader or Security Reader. The page names Global Administrator as an option but advises least privilege."
  - q: "How long does a change take?"
    a: "Learn says to allow up to 6 hours for a new or updated policy to be applied. The Teams setting might take up to 24 hours to take effect."
  - q: "What is the difference between a safe links policy and a safe links rule?"
    a: "In PowerShell, the policy turns on protection and holds settings, and the rule holds the priority and recipient filters. The Defender portal creates both with the same name. In PowerShell you create the policy first, then the rule that names it. Removing one does not remove the other."
  - q: "How can I test that Safe Links works?"
    a: "Learn suggests using the URL http://spamlink.contoso.com. It is similar to the GTUBE string for testing anti-spam solutions, it is not harmful, but it triggers a Safe Links protection response. You can also check the policy list, status and priority in the portal, or run Get-SafeLinksPolicy and Get-SafeLinksRule."
---

Safe Links scans links in email, Microsoft Teams and supported Office apps in organizations with Microsoft Defender for Office 365. This article follows the Microsoft Learn page on setting up Safe Links policies: when to use a custom policy, the portal steps, what each setting does, how priority works and the PowerShell route.

## Before you create a policy

- There is no default Safe Links policy. The **Built-in protection** preset security policy gives Safe Links protection to all recipients by default, except recipients in the Standard or Strict preset policies or in custom Safe Links policies.
- Learn typically recommends turning on the Standard or Strict preset security policies and adding all users to them, rather than creating custom policies. Custom policies are for greater granularity, for specific users, groups or domains.
- Preset policies are always applied first. Membership in or exclusion from Built-in protection or custom policies does not affect recipients in the Standard or Strict presets.
- Allow up to 6 hours for a new or updated policy to apply.
- Licensing: see the licensing terms linked on the page.

### Permissions

You have these options, per the page:

- Unified RBAC: **Authorization and settings/Security settings/Core Security settings (manage)** or **(read)**. This applies to the Defender portal only, not PowerShell.
- Email and collaboration permissions plus Exchange Online permissions. To create, modify and delete policies you need **Organization Management** or **Security Administrator** in Email and collaboration RBAC and **Organization Management** in Exchange Online RBAC. Read-only access comes from **Global Reader** or **Security Reader**, or **View-Only Organization Management**.
- Microsoft Entra roles: **Global Administrator**, **Security Administrator**, **Global Reader** or **Security Reader**. The page advocates least privilege and says to limit Global Administrator to emergencies.

If saves fail with a 403 or `CmdletAccessDeniedException` although permissions are right, Learn says the cause might be an Exchange Online RBAC configuration problem and suggests contacting Microsoft Support and referencing "RBAC configuration refresh".

## Create a policy in the Defender portal

Go to **Email & collaboration** > **Policies & rules** > **Threat policies** > **Safe Links**, or open `https://security.microsoft.com/safelinksv2`, and select **Create**.

1. **Name your policy:** a unique name and an optional description.
2. **Users and domains:** pick users, groups or domains. Leave all three blank to apply the policy to all recipients. Subdomains are included unless you exclude them. Values of one condition use OR logic, and different condition types use AND logic. For example, user romain@contoso.com plus group Executives applies the policy to Romain only if he is also in Executives. Exceptions use OR logic across types. If not all users have Defender for Office 365 licenses, Learn says you can exclude them with user or group exceptions.
3. **URL & click protection settings:** see the next section.
4. **Notification:** use the default text, or custom text of up to 200 characters, optionally with Microsoft Translator for localization.
5. **Review** and **Submit**.

## URL and click protection settings

**Email**

- Turn on Safe Links for links in email. URLs are rewritten by default. Sub-options: apply to messages sent within the organization, apply real-time URL scanning for suspicious links and links that point to files, and wait for URL scanning to complete before delivering the message (the page says the recommended setting is On).
- **Do not rewrite URLs, do checks via SafeLinks API only** prevents URL wrapping but still scans URLs before delivery. In supported Outlook versions (Windows, Mac and Outlook on the web), Safe Links is called through APIs at click time.
- **Do not rewrite the following URLs in email** lets you manage a list. Learn notes that these URLs are not scanned or wrapped during mail flow but might still be blocked at click time. To avoid that, report the URL as clean and select Allow this URL, which adds an allow entry to the Tenant Allow/Block List.

**Teams:** Safe Links checks links when users click them in Teams, and URLs are not rewritten. The setting might take up to 24 hours.

**Office 365 apps:** Safe Links checks links in files in supported Office desktop, mobile and web apps. URLs are not rewritten.

**Click protection:** **Track user clicks** stays selected to track clicks. Clear **Let users click through to the original URL** to block click-through on warning pages. You can also display organization branding on notification and warning pages. In advanced hunting, click events on wrapped URLs have `AppName` value `Mail` in the `UrlClickEvents` table.

## Priority and precedence

Policies are processed in the order shown on the Safe Links page:

1. Strict Preset Security Policy, if assigned to users.
2. Standard Preset Security Policy, if enabled.
3. Custom policies in priority order. A lower value means higher priority, 0 is the highest, new policies get the next number, and no two share a value.
4. Built-in protection (Microsoft), always Lowest and not changeable.

Safe Links protection stops for a recipient after the first policy applies. In the portal, open a custom policy and use **Increase priority** or **Decrease priority**.

## Manage existing policies

In the portal you can enable, disable or delete selected policies with **More actions**, or use the details flyout to edit sections, turn the policy on or off, change priority or delete it. You cannot modify, disable or delete the preset-linked policies (Standard, Strict and Built-in protection) here. Use the **Preset security policies** page for those.

## PowerShell

A Safe Links policy has two elements in PowerShell:

- The **safe links policy** (`*-SafeLinksPolicy` cmdlets) turns on protection and holds settings.
- The **safe links rule** (`*-SafeLinksRule` cmdlets) holds priority and recipient filters.

The portal creates both with the same name. In PowerShell you create the policy, then the rule that names it, for example:

```powershell
New-SafeLinksPolicy -Name "Contoso All" -EnableSafeLinksForEmail $true -EnableSafeLinksForOffice $true -EnableSafeLinksForTeams $true -ScanUrls $true -DeliverMessageAfterScan $true -EnableForInternalSenders $true -AllowClickThrough $false
New-SafeLinksRule -Name "Contoso All" -SafeLinksPolicy "Contoso All" -RecipientDomainIs contoso.com
```

Further points from the page:

- A policy created in PowerShell is not visible in the portal until it is assigned to a rule. A rule cannot be tied to more than one policy.
- Removing the policy does not remove the rule, and the reverse.
- You cannot rename a policy in PowerShell. Renaming in the portal renames only the rule.
- Enabling or disabling the rule enables or disables the whole policy: `Enable-SafeLinksRule` and `Disable-SafeLinksRule`.
- Set priority with `Set-SafeLinksRule -Identity "<RuleName>" -Priority <Number>`, which shifts other rules.
- For `DoNotRewriteUrls`, use `@{Add="Entry1"; Remove="Entry3"}` to change entries without replacing the list.

## Verify

Check the list, Status and Priority on the Safe Links page, or run `Get-SafeLinksPolicy -Identity "<Name>"; Get-SafeLinksRule -Identity "<Name>"`. To test protection, use `http://spamlink.contoso.com`, which is harmless but triggers a Safe Links response.

## Rollout order (my advice)

This is my suggestion, not Microsoft guidance:

1. Start with the Standard preset for all licensed users, as the page suggests, and add custom policies only for real exceptions.
2. Document who is in which policy, since the first match wins.
3. Do changes in a pilot group and wait the six hours before judging the result.
4. Keep the do-not-rewrite list short and reviewed.

## Related

- [Safe Links](https://www.m365.fm/entity/safe-links/)
- [Microsoft Defender for Office 365](https://www.m365.fm/entity/defender-for-office-365/)
- [Exchange Online PowerShell](https://www.m365.fm/entity/exchange-online-powershell/)

## Sources

- [Set up Safe Links policies in Microsoft Defender for Office 365 (Microsoft Learn)](https://learn.microsoft.com/defender-office-365/safe-links-policies-configure)
