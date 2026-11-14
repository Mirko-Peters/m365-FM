---
title: "Fix NDR 550 5.4.1 Recipient Address Rejected: Access Denied in Exchange Online"
summary: "Fix the Exchange Online NDR 550 5.4.1 Recipient address rejected: Access denied using Microsoft documentation: what Directory Based Edge Blocking does, admin checks for one recipient or a whole domain, hybrid cases, and the Relay Access Denied variant."
status: review
publish: false
author: mirko-p
date: 2027-01-01
topics: [exchange-online]
keypoints:
  - "Learn describes 550 5.4.1 Recipient address rejected: Access denied as Directory Based Edge Blocking rejecting a message because the recipient address is treated as invalid."
  - "First check the recipient address in the NDR for spelling, then find out whether one recipient or the whole domain is affected."
  - "For a whole domain, switch the accepted domain type from Authoritative to Internal relay and back to Authoritative in the Exchange admin center under Mail flow, Accepted domains."
  - "For one on-premises mailbox in a hybrid setup, reset the SMTP proxy address to a temporary one and back. Allow up to 24 hours for DBEB to update."
  - "The NDR reference lists a second 5.4.1 entry, Relay Access Denied, which points to mail server or DNS misconfiguration."
faq:
  - q: "What does 550 5.4.1 Recipient address rejected: Access denied mean?"
    a: "According to Microsoft Learn, Directory Based Edge Blocking rejected the message because the recipient address does not exist in Exchange Online, so it is treated as invalid and blocked at the service edge."
  - q: "Who fixes this error?"
    a: "The Microsoft support article is written for email admins in the recipient's organization. A sender can first check the address for spelling mistakes."
  - q: "How do I resync a whole domain?"
    a: "According to Microsoft Learn, in the Exchange admin center go to Mail flow, Accepted domains, open the domain, switch the type from Authoritative to Internal relay, save, and then switch it back to Authoritative."
  - q: "What is the other 5.4.1 error in the NDR reference?"
    a: "The Learn NDR reference lists Relay Access Denied, where the mail server generating the error does not accept mail for the recipient's domain. It names mail server or DNS misconfiguration as the cause."
---

The NDR 550 5.4.1 Recipient address rejected: Access denied means Exchange Online refused the message at the edge because the recipient address is not valid in the organization. Directory Based Edge Blocking (DBEB) does this. The fix is on the recipient side: check the address, then check whether the recipient or the whole domain is missing from Exchange Online. This guide combines the Microsoft Learn pages Email nondelivery reports (NDRs) and SMTP errors in Exchange Online and Use Directory-Based Edge Blocking to reject messages sent to invalid recipients in Exchange Online, and a Microsoft support article for this exact error.

## What the error means

Learn says DBEB lets you reject messages for invalid recipients at the service network perimeter. A message to a valid address continues through anti-malware, anti-spam and mail flow rules. If the address does not exist, the service blocks the message before any filtering and returns an NDR. The DBEB page shows the example `550 5.4.1 Recipient address rejected: Access denied`.

The NDR reference has two 5.4.1 entries:

- **Recipient address rejected: Access denied:** the recipient's address does not exist. The fix is the DBEB article.
- **Relay Access Denied:** the mail server that generates the error does not accept mail for the recipient's domain. Learn names mail server or DNS misconfiguration as the cause and links to a support article for it.

The NDR reference text does not show the 550 prefix for either entry, so confirm the exact code and wording in your NDR. It also lists 5.7.504, which has the same wording Recipient address rejected: Access denied but a different code. Its described fix is to verify the recipient address and try again.

## Check 1: The address

The support article starts with the simplest step: check the recipient's address in the NDR for spelling errors. A sender can do this before involving an admin.

## Check 2: One recipient or the whole domain

Find out whether only one recipient or the whole domain is affected. The support article uses contoso.com as the domain example.

## Fix for a whole domain

The support article says to resync the domain:

1. In the Exchange admin center go to **Mail flow**, **Accepted domains**.
2. Open the domain and change the type from **Authoritative** to **Internal relay**. Save.
3. Change it back to **Authoritative**. Save.

The DBEB article uses the same pages. It says to keep the domain as **Internal relay** until all valid recipients have been added to Exchange Online and replicated, and to switch to **Authoritative** only after that. The page does not spell out the consequence of switching early. My inference, not a Microsoft statement: mail to a recipient that has not replicated yet would be treated as invalid.

## Fixes for a single recipient in a hybrid setup

The support article gives three cases:

1. **On-premises user mailbox, with directory sync pushing changes to Microsoft Entra ID:** reset the mailbox's SMTP proxy address. Change it to a temporary address, then restore the original. Allow up to 24 hours for DBEB to update.
2. **On-premises mail-enabled public folder:** confirm the folder has synced to Exchange Online. If it has not, use the Sync-ModernMailPublicFolder PowerShell script.
3. **On-premises dynamic distribution group:** these groups cannot sync, so create a mail contact in Exchange Online with the same external address. The DBEB article gives the same workaround.

The DBEB page also states that for DBEB to work in a hybrid environment, the MX record for the domain must point to Microsoft 365. It says that after switching to Authoritative there may be infrequent instances where addresses that do not exist are allowed to relay.

## Where the sources disagree or stop

- The support article is marked as applying to Microsoft Business Productivity Online Dedicated and Suite Federal, which looks like older product naming. The steps still match the DBEB page.
- The support article is written for email admins only. It has no steps for senders beyond the address check, and no MX record, connector or mailbox existence checks.
- The DBEB article has no PowerShell commands, no verification steps and no rollback instructions.

## Suggestion: a triage order

This section is a practical suggestion and not a Microsoft statement.

1. Copy the full NDR text and confirm whether it says Access denied or Relay Access Denied.
2. Check the spelling of the address.
3. Test a second recipient in the same domain.
4. If the whole domain fails, review the accepted domain type and the MX record.
5. If one hybrid recipient fails, check how its object syncs to Exchange Online.
6. After a change, wait before you retest, since the support article mentions up to 24 hours for one case.

## Not covered

The pages I read do not describe the following:

- Step-by-step fixes for the Relay Access Denied variant, which are on a linked support page.
- How to test that DBEB works or how to roll it back.
- A sender-side troubleshooting list.
- Timing for replication before switching to Authoritative.

## Related

- [Exchange Online](https://www.m365.fm/entity/exchange-online/)

## Sources

- [Email nondelivery reports (NDRs) and SMTP errors in Exchange Online (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/exchange/email-delivery/ndr/non-delivery-reports-in-exchange-online)
- [Use Directory-Based Edge Blocking to reject messages sent to invalid recipients in Exchange Online (Microsoft Learn)](https://learn.microsoft.com/exchange/mail-flow-best-practices/use-directory-based-edge-blocking)
- [Fix email delivery issues for error code 5.4.1 in Exchange Online (Microsoft Support)](https://support.microsoft.com/topic/c0e98a8e-81db-49c2-9bf1-32a1734d3e77)
