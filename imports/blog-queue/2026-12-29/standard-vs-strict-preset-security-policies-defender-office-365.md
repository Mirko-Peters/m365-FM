---
title: "Standard vs Strict Preset Security Policies in Defender for Office 365: Which to Apply"
summary: "Compare Standard, Strict and Built-in protection preset security policies using Microsoft Learn: what differs in anti-spam and anti-phishing, who gets which, how to turn them on in the Defender portal, recipient scope logic and policy precedence."
status: review
publish: false
author: mirko-p
date: 2026-12-29
topics: [defender-for-office-365]
keypoints:
  - "Standard is a baseline profile for most users. Strict is a more aggressive profile for selected users such as high value targets or priority users."
  - "The differences are in anti-spam and anti-phishing actions and thresholds. Strict quarantines where Standard moves to Junk Email. Anti-malware, Safe Attachments and Safe Links do not differ."
  - "Preset policies take precedence over custom threat policies. Strict is applied first, then Standard, then custom and default policies."
  - "Standard and Strict apply to no one until you turn them on and assign recipients. Built-in protection covers everyone by default unless you add exclusions."
  - "Impersonation protection for users is limited to 350 users and custom domains to 50 in the Standard or Strict policy."
faq:
  - q: "What is the difference between Standard and Strict?"
    a: "According to Microsoft Learn, Standard is a baseline profile suitable for most users and Strict is more aggressive for selected users. In Standard, spam and bulk mail above the threshold go to Junk Email, while Strict quarantines them. The bulk threshold is 6 for Standard and 5 for Strict."
  - q: "Which policy wins if a user is in several?"
    a: "Strict, then Standard, then Defender for Office 365 evaluation policies, then custom threat policies by priority, then Built-in protection and the default policies."
  - q: "Where do I turn them on?"
    a: "In the Microsoft Defender portal under Email and collaboration, Policies and rules, Threat policies, Preset Security Policies. Slide the toggle to On and select Manage protection settings."
  - q: "Can I change settings in a preset policy?"
    a: "Nearly all settings cannot be changed. You choose recipients, impersonation protection users and domains, and trusted senders."
  - q: "What is Built-in protection?"
    a: "A preset policy that gives basic Safe Attachments and Safe Links protection to users who are not excluded and not in Standard, Strict or custom Safe Attachments or Safe Links policies."
---

Preset security policies apply Microsoft's recommended email protection settings. Unlike custom threat policies, nearly all of their settings cannot be changed. This guide follows the Microsoft Learn article on preset security policies in cloud organizations.

## The three presets

- **Standard protection:** a baseline profile suitable for most users.
- **Strict protection:** a more aggressive profile for selected users, such as high value targets or priority users.
- **Built-in protection:** basic Safe Attachments and Safe Links protection in Defender for Office 365 for users who are not excluded, not in Standard or Strict and not in custom Safe Attachments or Safe Links policies.

Until you turn on Standard and Strict and assign users, they apply to no one. Built-in protection applies to all recipients by default, and you can add exclusions, which Learn marks as not recommended unless users lack Defender for Office 365 licenses.

## What differs between Standard and Strict

| Setting | Standard | Strict |
| --- | --- | --- |
| Spam action | Move to Junk Email folder | Quarantine |
| Bulk action when threshold met | Move to Junk Email folder | Quarantine |
| Bulk email threshold | 6 | 5 |
| Spoof detection action | Move to Junk Email folder | Quarantine |
| Mailbox intelligence impersonation action | Move to Junk Email folder | Quarantine |
| Phishing email threshold | 3 - More aggressive | 4 - Most aggressive |
| Anti-malware, Safe Attachments, Safe Links | No difference | No difference |

Both show the first contact safety tip. Built-in protection differs from Standard and Strict in Safe Links: it lets users click through to the original URL, does not rewrite URLs and does not apply Safe Links to internal messages.

## Turn them on

1. Open the Microsoft Defender portal and go to **Email & collaboration**, **Policies & rules**, **Threat policies**, **Preset Security Policies**, or open `security.microsoft.com/presetSecurityPolicies`.
2. Slide the Standard or Strict toggle to **On**, then select **Manage protection settings**.
3. Choose recipients for the built-in Exchange Online Protection features, then for Defender for Office 365 protection.
4. Add users for impersonation protection (maximum 350) and domains (maximum 50 custom domains), and trusted senders to exempt from impersonation flagging. Trusted domain entries do not include subdomains.
5. Review and confirm.

Recipient conditions of the same type use OR logic and different condition types use AND logic. For example, naming a user and a group applies the policy to that user only if they are also in the group. Learn does not support dynamic distribution groups or dynamic membership Microsoft 365 Groups as recipients.

## Precedence

When a recipient is in several policies, they apply in this order:

1. Strict preset.
2. Standard preset.
3. Defender for Office 365 evaluation policies.
4. Custom threat policies by priority.
5. Built-in protection and the default policies.

Learn's preferred approach is to use unambiguous recipient groups, so that no exceptions are needed. If overlap is unavoidable, make recipients exceptions in the higher-precedence policy.

## Check that it works

Pick a setting where the profiles differ. A spam message that is not high confidence goes to Junk Email for Standard users and is quarantined for Strict users.

## PowerShell

The preset policies are managed through rules, for example `Enable-EOPProtectionPolicyRule` and `Enable-ATPProtectionPolicyRule` with the identity Standard Preset Security Policy. Learn warns not to create, modify or remove the individual threat policies in them.

## Which one to choose

This guidance is a suggestion. Use Standard for most users and Strict for a small group of high-risk users, since Strict quarantines more and may add review work. Learn does not give user counts or a rollout plan.

## Permissions

Learn lists the roles that can manage preset security policies. Membership in the Security Administrator role in Microsoft Entra ID or in the Organization Management role group in Exchange Online allows changes. Global Reader allows read-only access. Global Administrator and Defender XDR Unified RBAC permissions also work, and Learn advises limiting Global Administrator to emergencies. Check the page for the full list before delegating the task.

## What you can and cannot adjust

You cannot edit the individual anti-spam, anti-phishing, anti-malware, Safe Attachments or Safe Links values in Standard and Strict. What you choose is who is covered, which users and domains get impersonation protection and which senders are trusted. Learn contrasts the presets with custom threat policies, which are fully configurable but sit below the presets in precedence.

## Not covered

The page does not describe licensing beyond saying that Built-in protection applies with any number of Defender for Office 365 licenses and that Microsoft recommends buying enough licenses.

## Related

- [Defender for Office 365](https://www.m365.fm/entity/defender-for-office-365/)

## Sources

- [Preset security policies (Microsoft Learn)](https://learn.microsoft.com/defender-office-365/preset-security-policies)
