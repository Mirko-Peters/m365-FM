---
title: "Anti-Phishing Policies and Impersonation Protection in Defender for Office 365"
summary: "How anti-phishing policies work in Defender for Office 365: default and custom policies, spoof intelligence, user and domain impersonation limits, mailbox intelligence, thresholds and safety tips."
status: review
publish: false
author: mirko-p
date: 2027-01-03
topics: [defender-for-office-365]
keypoints:
  - "The default anti-phishing policy applies to all recipients. In Defender for Office 365 it covers spoof protection and mailbox intelligence, but impersonation and thresholds are not configured."
  - "User impersonation protection covers up to 350 users per policy. Domain impersonation protection covers up to 50 custom domains per policy."
  - "Phishing email thresholds are Standard (default), Aggressive, More aggressive and Most aggressive. Higher settings increase false positives."
  - "Impersonation settings and phishing thresholds are available only in Defender for Office 365. Spoof intelligence is included for all cloud mailboxes."
  - "Configure policies in the Defender portal under Email and collaboration > Policies and rules > Threat policies > Anti-phishing."
faq:
  - q: "What do anti-phishing policies protect against?"
    a: "According to Microsoft Learn, they combine spoof protection (EOP and Defender for Office 365) with impersonation protection and phishing thresholds (Defender for Office 365 only). Spoof intelligence and mailbox intelligence are on by default in the default policy."
  - q: "How many users and domains can I protect from impersonation?"
    a: "Microsoft Learn states a limit of 350 users per policy for user impersonation protection and 50 custom domains per policy for domain impersonation protection. Learn gives a maximum of 1,024 entries for the trusted senders and domains lists."
  - q: "What is the default action when a spoofed sender is blocked?"
    a: "Learn says the default action is to move messages to the recipients' Junk Email folders. You can choose Quarantine the message instead and select a quarantine policy."
  - q: "Which threshold should I choose?"
    a: "Learn lists Standard as the default and describes Aggressive, More aggressive and Most aggressive as treating progressively lower-confidence phishing verdicts as very high confidence. It warns that a higher setting increases false positives."
  - q: "Do I need Defender for Office 365 for these features?"
    a: "Spoof intelligence, the first contact safety tip and unauthenticated sender indicators are available for all cloud mailboxes. Impersonation settings, phishing thresholds, enhanced spoof intelligence and AI/ML detection need Defender for Office 365, according to Learn, which does not say which plan includes which feature."
---

Anti-phishing policies decide how Microsoft 365 handles messages that look spoofed or impersonate people and domains. Exchange Online Protection provides spoof protection for everyone. Defender for Office 365 adds impersonation protection, mailbox intelligence and phishing thresholds. This guide follows the Microsoft Learn page that explains the policies.

## Policy types

- **Default policy.** It is created automatically and applies to all recipients. Its name and description are read-only, and you cannot add conditions or exceptions. In Defender for Office 365 it provides spoof protection and mailbox intelligence. Impersonation protection and phishing thresholds are not configured by default.
- **Custom policies.** They need at least one condition under **Users, groups, and domains**. You can add a description, but you cannot rename the policy in the portal after you create it.
- **Preset policies.** Learn mentions only that anti-spoofing is enabled in the Standard and Strict preset security policies.

Multiple values of the same condition or exception use OR logic, different types of exceptions use OR logic, and different types of conditions use AND logic. Dynamic distribution groups and dynamic Microsoft Entra membership groups are not supported.

## Spoof protection (EOP and Defender for Office 365)

- **Enable spoof intelligence:** Microsoft recommends leaving it on. Anti-spoofing is on in the default policy and in new custom policies.
- **Action for blocked spoofed senders:** **Move messages to the recipients' Junk Email folders** is the default. **Quarantine the message** lets you pick a quarantine policy.
- **Honor DMARC record policy:** when a message is detected as spoof and the sender's DMARC policy is `p=quarantine`, you can choose Quarantine or Move to Junk. For `p=reject`, you can choose Quarantine or Reject.
- **Unauthenticated sender indicators:** available when spoof intelligence is on. **Show (?)** marks unauthenticated senders, and **Show "via" tag** appears when the From domain differs from the DKIM or MAIL FROM domain.

## Impersonation protection (Defender for Office 365 only)

| Setting | What it does | Limit or default |
| --- | --- | --- |
| User impersonation protection | Protects listed users | 350 users per policy. Action defaults to Don't apply any action |
| Domain impersonation protection | Protects custom domains | 50 custom domains per policy. Action defaults to Don't apply any action |
| Mailbox intelligence | Learns normal sender patterns | Enable mailbox intelligence is on by default. Enable intelligence for impersonation protection is off by default |
| Trusted senders and domains | Exempt from impersonation actions | 1,024 entries for these lists |

The available actions for user and domain impersonation, and for mailbox intelligence, are Don't apply any action (default), Redirect, Move to Junk, Quarantine, Deliver and add Bcc, and Delete before delivery. Mailbox intelligence takes action only when both of its settings are on. Trusted domains do not include subdomains, so add each subdomain separately.

## Phishing email thresholds (Defender for Office 365 only)

1. **Standard:** the default.
2. **Aggressive:** high-confidence phishing is treated as very high confidence.
3. **More aggressive:** medium and high confidence are treated as very high.
4. **Most aggressive:** low, medium and high confidence are treated as very high.

Learn warns that a higher setting increases false positives.

## Safety tips

- **First contact safety tip:** stamped as `SFTY` 9.25 in the `X-Forefront-Antispam-Report` header. It does not depend on spoof or impersonation settings. Learn recommends it on. It is not stamped on S/MIME-signed messages, messages that bypass filtering with SCL -1, or messages to mailboxes created fewer than 7 days ago.
- **User impersonation:** `SFTY` 9.20.
- **Domain impersonation:** `SFTY` 9.19.
- **User impersonation unusual characters:** available with user impersonation protection.

## Licensing

| Capability | All cloud mailboxes | Defender for Office 365 |
| --- | --- | --- |
| Spoof intelligence, first contact tip, unauthenticated sender indicators | Yes | Yes |
| Impersonation settings, phishing thresholds | No | Yes |
| Enhanced spoof intelligence, AI/ML detection, extra reporting | No | Yes |

The page does not say which Defender for Office 365 plan includes which feature. It mentions a 90-day Plan 2 trial from the Defender portal trials hub.

## Where to configure

- **Defender portal:** **Email & collaboration** > **Policies & rules** > **Threat policies** > **Anti-phishing**, at security.microsoft.com/antiphishing.
- **Spoofed sender overrides:** the **Spoofed senders** tab in Tenant Allow/Block Lists.
- **PowerShell:** `New-AntiPhishPolicy` and `Set-AntiPhishPolicy`. The protected-users parameter is `TargetedUsersToProtect`.

## A practical approach (my advice)

1. Keep spoof intelligence on and decide whether blocked spoofs go to Junk or Quarantine.
2. Create a custom policy for high-value targets such as executives and finance staff, scoped by a group condition.
3. List your own custom domains for domain impersonation protection and any partner domains that attackers often copy.
4. Leave the threshold at Standard until you have measured false positives.
5. Review the first contact safety tip, which has no dependency on the other settings.

## Typical mistakes (my advice)

- Assuming the default policy covers impersonation. Learn says impersonation protection is not configured in it by default.
- Adding more than 350 users to one policy instead of splitting policies.
- Forgetting subdomains in trusted domains.
- Raising the threshold without reviewing false positives.

## Related

- [Defender for Office 365](https://www.m365.fm/entity/defender-for-office-365/)
- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Microsoft Defender](https://www.m365.fm/entity/defender/)

## Sources

- [Anti-phishing policies in Microsoft 365 (Microsoft Learn)](https://learn.microsoft.com/defender-office-365/anti-phishing-policies-about)
