---
title: "How to Set Up Journaling in Exchange Online"
summary: "Plan journaling in Exchange Online: rule scopes, journal recipients, journaling and alternate journaling mailboxes, unreachable report handling, duplicates, IRM decryption and spoofing caveats, and why Microsoft recommends retention instead."
status: review
publish: false
author: mirko-p
date: 2027-01-08
topics: [exchange-online, microsoft-purview-data-lifecycle-management]
keypoints:
  - "Learn calls journaling an older Exchange feature that moves data outside Microsoft 365, and recommends Microsoft 365 retention for in-place compliance."
  - "Journal rules have three scopes: internal messages only, external messages only, or all messages. A rule can target a recipient SMTP address, and wildcards are not allowed."
  - "You cannot use an Exchange Online mailbox as the journaling mailbox or as the alternate journaling mailbox."
  - "If the journaling mailbox is unavailable, delivery is retried for up to 24 hours, then an NDR with the journal report goes to the alternate journaling mailbox."
  - "The page does not give steps to create journal rules. It points to the Microsoft 365 security center and Purview portal."
faq:
  - q: "What is journaling in Exchange Online?"
    a: "Per Microsoft Learn, a journal report is the message the Journaling agent generates when a message matches a journal rule, with the original message attached unaltered. Envelope journaling is the only method supported by Microsoft 365. Learn also calls it an older feature that moves data outside Microsoft 365."
  - q: "Should I use journaling or retention?"
    a: "Learn recommends Microsoft 365 retention to archive and manage data in place. Journaling may suit organizations that need a third-party solution to receive copies of email."
  - q: "Can I send journal reports to an Exchange Online mailbox?"
    a: "No. Learn says you cannot designate an Exchange Online mailbox as a journaling mailbox, and an alternate journaling mailbox in Exchange Online is not supported. In a hybrid setup you can use an on-premises mailbox."
  - q: "What happens if the journaling mailbox is down?"
    a: "Journal reports stay in the transport queue and delivery is retried for up to 24 hours. After that, an NDR containing the journal report goes to the alternate journaling mailbox."
  - q: "How do I create a journal rule?"
    a: "The page does not say. It refers readers to the Microsoft 365 security center and the Microsoft Purview portal, and states that these features are no longer available in the new Exchange admin center."
---

Journaling copies email that matches a rule to a separate mailbox, normally outside Microsoft 365. Microsoft Learn is blunt about it: it is an older Exchange feature, it moves data out of your tenant, and Microsoft 365 retention is the recommended alternative. This guide follows the Learn page on journaling in Exchange Online. That page explains the design and caveats and does not give creation steps.

## Journaling or retention

Learn recommends Microsoft 365 retention to archive and manage data in place for compliance. Some organizations may need a third-party solution to receive copies of email, and journaling serves that case. Because journaled data leaves Microsoft 365, you must secure it and handle any duplication it causes. Retention and other Purview compliance solutions keep data inside your tenant and avoid that overhead.

## How it works

A journal report is the message that the Journaling agent generates when a message matches a journal rule. The original message is included unaltered as an attachment. This is envelope journaling, the only method supported by Microsoft 365.

## Rule scope

- **Internal messages only:** messages between recipients inside your Exchange organization.
- **External messages only:** messages sent to or received from outside your organization.
- **All messages:** everything that passes through your organization.

If sender and recipients are in accepted domains of the same organization, messages are not treated as external, even when a header says anonymous.

## Journal recipient

- You can target a rule at the SMTP address of a mailbox, distribution group, dynamic distribution group, mail user or contact.
- With no recipient, all messages to or from recipients matching the scope are journaled.
- The address cannot contain a wildcard, such as `*@contoso.com`.

## Journaling mailbox

- Use one mailbox for all rules or different ones per rule.
- You cannot use an Exchange Online mailbox. In hybrid, you can use an on-premises mailbox for both Exchange Online and on-premises mailboxes.
- Learn recommends policies that govern who can access the journaling mailboxes.

## Alternate journaling mailbox

It receives journal reports as attachments in NDRs when the journaling mailbox rejects them or is unavailable. After the journaling mailbox returns, use **Send Again** in Outlook to resubmit the reports. Cautions from the page:

- If the alternate mailbox also rejects reports at the same time, those reports are lost.
- An Exchange Online mailbox is not supported as the alternate mailbox.
- Messages addressed directly to the alternate mailbox are not journaled.

## Unreachable journal reports

If a rule points to a mailbox that does not exist or is unavailable, journal reports stay in the transport queue and delivery is retried periodically for up to 24 hours. After that, an NDR for the journal report goes to the alternate journaling mailbox.

## Other behavior to know

- **Duplicates in hybrid.** Cloud-to-cloud forking and hybrid routing can produce duplicates, which Learn treats as by design. For on-premises to cloud, `Set-TransportConfig -PreventDuplicateJournalingEnabled $true` can prevent them.
- **Encrypted mail.** Journaling does not decrypt items encrypted by external organizations. `Set-IRMConfiguration -JournalReportDecryptionEnabled $true` turns on decryption, with a compliance admin account. Decryption does not support OME branding applied through mail flow rules.
- **Spoofing.** Messages count as internal if the MAIL FROM domain is an accepted domain, so external-scoped rules may not match spoofed messages.
- **Out of Office.** The mail from field is empty for automatic replies, so external-scoped rules can journal them.
- **Quarantine.** Messages quarantined by a mail flow rule are not journaled until released.
- **Several rules.** Matching rules with different mailboxes send separate reports. A shared mailbox gets one.

## Limits

There is a limit on the number of journal rules in Exchange Online. The page gives no number and links to the limits article.

## What the page does not say

- Steps, portal paths or cmdlets to create journal rules. It only says the features are in the Microsoft 365 security center and the Purview portal and not in the new Exchange admin center.
- Permissions for managing rules.
- A formal definition of journaling or archiving.
- How an on-premises alternate mailbox behaves beyond the cautions above.
- The page also advises asking legal representatives about applicable laws.

## A planning checklist

This list is practical advice built on the page.

1. Check whether retention meets the requirement before you choose journaling.
2. If you need journaling, pick the target system, outside Exchange Online.
3. Choose scope and recipients, and avoid wildcard addresses.
4. Set up an alternate journaling mailbox that is also outside Exchange Online.
5. Plan how you will resubmit reports with Send Again after an outage.
6. Decide about duplicate prevention and decryption.

## Typical mistakes

- Pointing a rule at an Exchange Online mailbox.
- Having no alternate mailbox, or one that fails at the same time.
- Using wildcards in the recipient.
- Expecting spoofed or out-of-office messages to behave like normal external mail.

## Related

- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Microsoft Purview Data Lifecycle Management](https://www.m365.fm/entity/microsoft-purview-data-lifecycle-management/)
- [Exchange Online Protection](https://www.m365.fm/entity/exchange-online-protection/)

## Sources

- [Journaling in Exchange Online (Microsoft Learn)](https://learn.microsoft.com/exchange/security-and-compliance/journaling/journaling)
