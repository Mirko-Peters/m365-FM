---
title: "How Zero-Hour Auto Purge Works and What to Check When Messages Move to Junk"
summary: "How zero-hour auto purge (ZAP) acts after delivery: per-verdict outcomes, defaults, settings to check, exceptions, the 48-hour window, how to see ZAP actions in Threat Explorer and the Mailflow report, and Teams specifics."
status: review
publish: false
author: mirko-p
date: 2027-01-06
topics: [zero-hour-auto-purge, defender-for-office-365]
keypoints:
  - "ZAP retroactively acts on phishing, spam or malware already delivered to cloud mailboxes. It looks back 48 hours and does not notify users."
  - "Malware and high confidence phishing are quarantined whether read or unread. Spam is handled only if unread."
  - "For phishing and spam, ZAP follows the verdict action in the anti-spam policy: Move to Junk or Quarantine act, while X-header, subject prefix, redirect and delete do not."
  - "To see ZAP actions use Threat Explorer with Additional action = ZAP, or the Mailflow status report. ZAP actions are not logged in mailbox audit logs."
  - "ZAP for Teams needs Defender for Office 365 Plan 1 or Plan 2 and is not available in GCC, GCC High or DoD."
faq:
  - q: "What does ZAP do?"
    a: "Per Microsoft Learn, it retroactively detects and neutralizes malicious phishing, spam or malware messages already delivered to cloud mailboxes. Its search is limited to the last 48 hours of delivered email, and users are not notified when ZAP moves a message."
  - q: "Why did a message move to Junk after I saw it in my Inbox?"
    a: "ZAP can act after delivery when a verdict changes. For phishing that is not high confidence, the outcome follows the action configured for the Phishing verdict in the anti-spam policy, and Move message to Junk Email is the default in the default policy. Spam is moved only if unread."
  - q: "Which messages are quarantined?"
    a: "Malware and high confidence phishing, read or unread. Recipients cannot release them, although they can request release if the quarantine policy allows. Only admins can view them by default."
  - q: "How do I find ZAP actions?"
    a: "In Threat Explorer, on the All email tab, filter by Additional action = ZAP. The Mailflow status report also shows the number of ZAP-affected messages for a date range."
  - q: "What can override ZAP?"
    a: "Allowlists and Exchange mail flow rules can override ZAP actions. For malware and high confidence phishing, admin submissions, SecOps mailbox entries in the Advanced delivery policy and, for high confidence phishing, third-party phishing simulation URLs also apply."
---

ZAP acts after delivery. When a message that reached a cloud mailbox is later judged to be malware, phishing or spam, ZAP moves or quarantines it within a 48-hour window. If a message moved to Junk on its own, check the verdict, the policy action and any allow entries. This guide follows the Microsoft Learn page on zero-hour auto purge in Defender for Office 365.

## What ZAP is

ZAP applies in all organizations with cloud mailboxes. It does not apply to on-premises mailboxes protected by Microsoft 365. It also acts on messages in Deleted Items, using the same per-verdict actions as the anti-spam, anti-phishing and anti-malware policies. The search is limited to the last 48 hours of delivered email, and users are not notified.

## What ZAP does per verdict

| Verdict | Messages affected | Outcome |
| --- | --- | --- |
| Malware | Read or unread | Quarantined. Recipients cannot release it, but may request release if the quarantine policy allows. Admins only can view by default |
| High confidence phishing | Read or unread | Quarantined, with the same release rules |
| Phishing, not high confidence | Read or unread | Follows the action set for the Phishing verdict |
| Spam and high confidence spam | Unread only | Follows the action set for the Spam or High confidence spam verdict |

For phishing and spam, the action decides what ZAP does:

- **Move message to Junk Email:** ZAP moves it to Junk.
- **Quarantine message:** ZAP quarantines it.
- **Add X-Header, Prepend subject, Redirect, Delete:** ZAP takes no action.

**Defaults for phishing:** Move to Junk in the default anti-spam policy and in custom policies created in PowerShell. Quarantine in the Standard and Strict preset policies and in custom policies created in the Defender portal.

**Defaults for spam:** Move to Junk in the default policy, new custom policies and Standard, and Quarantine in Strict. For high confidence spam: Move to Junk in the default policy and new custom policies, and Quarantine in Standard and Strict.

## Settings to check

- ZAP for malware: on by default in anti-malware policies.
- ZAP for phishing and ZAP for spam: on by default in anti-spam policies.
- ZAP for high confidence phishing: on by default.
- The verdict actions in anti-spam policies. The page links to the policy articles and gives no exact portal toggle paths.

## What can stop or change ZAP

- Allowlists and Exchange mail flow rules can override ZAP actions.
- For malware and high confidence phishing: admin false-positive submissions (by default, allow entries exist for 45 days after the last used date), SecOps mailboxes in the Advanced delivery policy.
- For high confidence phishing only: non-Microsoft phishing simulation URLs in the Advanced delivery policy, and an MX record pointing to another service with a mail flow rule that bypasses spam filtering.
- For messages in other folders (for example, moved by Inbox rules), ZAP can act if the message was not deleted and the same or a stronger action was not already applied.
- ZAP does not quarantine messages that are in Dynamic Delivery scanning of a Safe Attachments policy. It reverts to Move to Junk if a phishing or spam signal arrives during that process and the anti-spam verdict takes some action on the message (Move to Junk, Redirect, Delete or Quarantine).

Learn warns that bypassing filtering can weaken your security posture.

## How to see ZAP actions

- **Mailflow status report:** shows the number of ZAP-affected messages for a date range.
- **Threat Explorer:** on the **All email** tab, filter by **Additional action = ZAP**.
- ZAP actions are **not logged** in Exchange mailbox audit logs as a system action.
- For Teams, only admins can view ZAP-quarantined messages in the Defender portal.

## Teams

ZAP for Teams needs Defender for Office 365 Plan 1 or Plan 2, included or as an add-on. It is not available in GCC, GCC High or DoD.

- Chats: internal messages only, for malware and high confidence phishing. Everyone in the chat gets the same copy.
- Standard channels: internal messages only. Shared channels: internal and external. Private channels: not supported.

## What the page does not say

It does not mention message trace as a way to see ZAP actions, describe an already-read exception beyond the verdict table, or give exact portal paths for the toggles. It does not say how to disable ZAP for a verdict. It describes ZAP on Deleted Items in the intro and on other folders in the FAQ without reconciling the two.

## A check when mail moved to Junk (my advice)

The order is my own suggestion, not taken from the page.

1. Open Threat Explorer and filter by Additional action = ZAP for the message.
2. Note the verdict. Malware and high confidence phishing end in quarantine, not Junk.
3. Read the anti-spam policy action for that verdict. Move to Junk explains a move to Junk.
4. Check whether the message was unread, since spam is touched only if unread.
5. For a false positive, submit it through the normal process, and review allow entries and mail flow rules that may override ZAP.

## Typical mistakes (my advice)

- Expecting a notification to the user.
- Looking for ZAP actions in the mailbox audit log.
- Setting a verdict action to Delete or Redirect and expecting ZAP to act.
- Expecting ZAP to look back further than 48 hours.

## Related

- [Zero-hour auto purge](https://www.m365.fm/entity/zero-hour-auto-purge/)
- [Defender for Office 365](https://www.m365.fm/entity/defender-for-office-365/)
- [Exchange Online Protection](https://www.m365.fm/entity/exchange-online-protection/)

## Sources

- [Zero-hour auto purge in Microsoft Defender for Office 365 (Microsoft Learn)](https://learn.microsoft.com/defender-office-365/zero-hour-auto-purge)
