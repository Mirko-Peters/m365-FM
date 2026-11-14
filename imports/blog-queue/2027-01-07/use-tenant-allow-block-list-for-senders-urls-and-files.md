---
title: "How to Use the Tenant Allow/Block List for Senders, URLs and Files"
summary: "Use the Tenant Allow/Block List in Microsoft Defender: entry types, portal path, block behavior, what allow entries can override, expiration rules, submissions and the five-minute delay, plus documented gaps."
status: review
publish: false
author: mirko-p
date: 2027-01-07
topics: [defender-for-office-365, exchange-online-protection]
keypoints:
  - "The list covers domains and email addresses, spoofed senders, URLs, files, IP addresses and Teams domains and addresses. Open it at security.microsoft.com/tenantAllowBlockList."
  - "Block entries take precedence over allow entries. Blocked domains, addresses and URLs are handled as high confidence phishing and quarantined, and files as malware."
  - "Allow entries for domains, addresses and URLs can override only bulk, spam, high confidence spam and phishing that is not high confidence. Malware and high confidence phishing need a submission."
  - "Block entries default to 30 days and can last up to 90 days or never expire. Allow entries are kept 45 days after the system judges the item clean."
  - "An allow entry added on the Submissions page or a block entry added in the list starts working within 5 minutes."
faq:
  - q: "Where do I manage the list?"
    a: "In the Microsoft Defender portal under Email & collaboration > Policies & rules > Threat policies > Rules > Tenant Allow/Block Lists, or at security.microsoft.com/tenantAllowBlockList."
  - q: "Which wins, allow or block?"
    a: "Learn says block entries take precedence over allow entries."
  - q: "Can I allow a malware file or a high confidence phishing message directly?"
    a: "No. Learn says malware and high confidence phishing cannot be allowed directly. Submit the item, select I've confirmed it's clean and then choose Allow this message, Allow this URL or Allow this file."
  - q: "How long do entries last?"
    a: "Block entries for domains, addresses, files and URLs default to 30 days and can be set to 90 days or never expire. Allow entries are kept 45 days after the system determines the item is clean, or you can set them to expire up to 30 days after creation."
  - q: "How fast do changes apply?"
    a: "Learn says that after you add an allow entry on the Submissions page or a block entry in the Tenant Allow/Block List, the entry starts working within 5 minutes."
---

The Tenant Allow/Block List lets you override Microsoft's filtering verdicts for specific senders, URLs, files and IP addresses. Block entries always win over allow entries, and allow entries are deliberately limited. This guide follows the Microsoft Learn page Manage allows and blocks in the Tenant Allow/Block List. The page links to separate procedures for creating each entry type, which were not read for this guide.

## What the list covers

- Domains and email addresses.
- Spoofed senders.
- URLs.
- Files.
- IP addresses. The linked article is titled Allow or block IPv6 addresses.
- Teams domains and email addresses.

Entries are used during mail flow for email, or at time of click for email, Teams and Office apps. Domain and email entries apply to the From address (5322.From, also called P2), not the MAIL FROM address.

Portal path: **Email & collaboration** > **Policies & rules** > **Threat policies** > **Rules** > **Tenant Allow/Block Lists**.

## What a block entry does

| Entry type | Result |
| --- | --- |
| Domains and addresses | Messages are marked high confidence phishing and quarantined. Internal users cannot send to the blocked domain or address and get a 550 5.7.703 error. The whole message is blocked for all recipients |
| Files | Blocked as malware and quarantined |
| URLs | Blocked as high confidence phishing and quarantined |
| Spoofed senders | If you manually override an existing allow verdict from spoof intelligence, the blocked sender becomes a manual block entry that appears only on the Spoofed senders tab |
| IP addresses | Incoming email from the IP is dropped at the edge |
| Teams domains and addresses | All incoming Teams communication is blocked and existing communication is deleted |

If you want a blocked sender treated as spam instead of high confidence phishing, Learn suggests the blocked senders or blocked domains lists in anti-spam policies.

## What an allow entry can do

- **Domains, addresses and URLs:** an allow entry can override only bulk, spam, high confidence spam and phishing that is not high confidence phishing.
- **Malware and high confidence phishing:** cannot be allowed directly. Submit the message or URL on the Submissions page, select **I've confirmed it's clean**, then select **Allow this message** or **Allow this URL**.
- **Files:** submit the attachment and select **Allow this file**.
- **Spoofed senders:** submit the message, or create an allow entry on the Spoofed sender tab.
- **IP addresses:** an allow entry bypasses IP-based checks, such as connection filtering or IP reputation. It does not change throttling.

Allowed entities skip their associated filters. A message that passes the other checks is delivered, but it must still pass email authentication, URL and file filtering.

## Expiration

| Entry | Default and range |
| --- | --- |
| Block: domains, addresses, files, URLs | 30 days by default, up to 90 days or never expire |
| Block: spoofed senders, IP addresses, Teams entries | Never expire |
| Allow: domains, addresses, files, URLs | Kept 45 days after the system determines the item is clean, or set to expire up to 30 days after creation |
| Allow: spoofed senders | Never expire |

When Microsoft decides an allow entry is no longer needed, it removes it and the built-in alert Removed an entry in Tenant Allow/Block List fires.

## Submissions create allow entries

A false positive submission creates an allow entry on the Files or URLs tab. Later variations of the same URL, such as one with a query string, are also allowed, so you need not report each one. For blocked email, the entry depends on the filter that blocked it:

- Spoof intelligence creates a sender entry on the Spoofed senders tab.
- Impersonation protection creates no list entry. The sender or domain goes to the Trusted senders and domains section of the anti-phishing policy.
- File filters create a Files entry, URL filters a URL entry, and other reasons a Domains & addresses entry.
- A message that was not blocked by filtering creates no entry.

## Timing

After you add an allow entry on the Submissions page or a block entry in the Tenant Allow/Block List, the entry starts working within 5 minutes. The page does not state this timing for allow entries that you create directly in the list, such as for spoofed senders or IP addresses.

## What the page does not say

- The order of filters in the stack.
- Required permissions and roles.
- Entry limits per type.
- PowerShell commands. The page only links to procedures.
- Which license features each capability needs. The only licensing hint is a tip about the Defender for Office 365 Plan 2 trial.
- Teams allow behavior.

## A practical approach

These steps are my advice, built on the page.

1. Prefer a submission over a manual allow entry when a legitimate message was blocked.
2. Use block entries for senders and URLs you know are bad, and choose an expiry on purpose.
3. Review allow entries before they expire, since Microsoft can remove them early.
4. Keep spoofed sender allow entries under review, because they never expire.

## Typical mistakes (my advice)

- Trying to allow a malware file or high confidence phishing message with a plain allow entry.
- Expecting an allow entry to bypass email authentication.
- Blocking a domain and forgetting that internal users can no longer send to it.
- Expecting an instant effect instead of allowing up to 5 minutes.

## Related

- [Microsoft Defender for Office 365](https://www.m365.fm/entity/defender-for-office-365/)
- [Exchange Online Protection](https://www.m365.fm/entity/exchange-online-protection/)
- [Microsoft Defender](https://www.m365.fm/entity/defender/)

## Sources

- [Manage allows and blocks in the Tenant Allow/Block List (Microsoft Learn)](https://learn.microsoft.com/defender-office-365/tenant-allow-block-list-about)
