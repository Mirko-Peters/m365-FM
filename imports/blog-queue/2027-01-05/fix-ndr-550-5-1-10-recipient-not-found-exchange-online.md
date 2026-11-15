---
title: "Fix NDR 550 5.1.10 RESOLVER.ADR.RecipientNotFound in Exchange Online"
summary: "Fix NDR 550 5.1.10 in Exchange Online: sender resend steps, license and directory checks, hybrid sync, accepted domain type, MX records, backscatter and broken forwarding rules, as documented on Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2027-01-05
topics: [exchange-online]
keypoints:
  - "Learn names two reasons for 550 5.1.10: the address does not exist or cannot be found, and backscatter. Broken forwarding rules and settings appear as a fix step."
  - "The sender can resend after removing a bad Auto-Complete entry. The recipient's admin checks the user, license, hybrid sync, accepted domain and MX record."
  - "Change an accepted domain to Internal Relay only in a hybrid setup, and only with a matching connector, or mail flow to on-premises recipients breaks."
  - "Exchange Online supports only one MX record per domain. DNS updates usually propagate in a few hours but can take up to 72 hours."
  - "The page covers the basic code 550 5.1.10 and does not mention the enhanced status code RESOLVER.ADR.RecipientNotFound."
faq:
  - q: "What does 550 5.1.10 mean?"
    a: "According to the Microsoft Learn fix article, the recipient's address was not found or does not exist. The article lists causes and fixes for the sender and for the recipient's email admin."
  - q: "What can the sender do?"
    a: "Open the bounce, use Send Again on the Report tab, delete the recipient address from the To box, remove it from the Auto-Complete list, retype the full address and send. Outlook on the web has equivalent steps."
  - q: "What should the admin check?"
    a: "In the Microsoft 365 admin center, Users > Active users: confirm the user exists, the username matches the address and a license is assigned. For hybrid, run a delta sync. Also check the accepted domain type and the MX record."
  - q: "What is backscatter?"
    a: "Learn says spammers forge the From address, so the bounce goes to you even though you did not send the original message. The bounce is harmless and can be deleted, though heavy backscatter may point to malware on your device."
  - q: "Does the page explain RESOLVER.ADR.RecipientNotFound?"
    a: "No. The page covers the basic code 550 5.1.10 and does not mention the enhanced status code."
---

NDR 550 5.1.10 means the message went to an address that Exchange Online cannot find. The sender should check the address and the Auto-Complete entry. The recipient's admin should check that the user exists, is licensed, is synced in a hybrid setup and that the domain and MX settings are right. This guide follows the Microsoft Learn article on fixing error 550 5.1.10. The article does not mention the enhanced code RESOLVER.ADR.RecipientNotFound, and this guide adds nothing about it.

## Cause 1: the address does not exist or cannot be found

### Sender steps

1. Open the bounce message. On the **Report** tab, choose **Send Again**.
2. In the new copy, select the recipient's address in the **To** box and press **Delete**.
3. Remove the address from the Auto-Complete list. A bad or outdated entry can cause the problem.
4. Retype the entire address, spelled correctly, and send.

Outlook on the web has equivalent steps: choose **To send this message again, click here** in the reading pane, then delete the address and retype it. If the original message had an attachment larger than 10 MB, Send Again may be unavailable or fail. Resend from **Sent Items** instead.

Also compare the address in the NDR with the address in your Sent Items copy. If they differ, the recipient may have a forwarding rule that points to a bad address. Ask them to correct or remove it.

### Admin steps

**Confirm the recipient exists and is licensed.**

1. In the Microsoft 365 admin center go to **Users** > **Active users**.
2. In **Filters**, search for part of the recipient's name.
3. If the user does not exist, create a mailbox or contact.
4. If the user exists, confirm the username matches the address the sender used.
5. For Exchange Online mailboxes, open the user and check **Product licenses**. If none is assigned, choose **Edit** and assign one.

**Hybrid only: synchronize directories.** On the server that runs Microsoft Entra Connect Sync, run in Windows PowerShell:

```powershell
Start-ADSyncSyncCycle -PolicyType Delta
```

After the sync completes, repeat the check above.

**Review the accepted domain type (new EAC).** Go to **Mail flow** > **Accepted domains**, open the domain, select **Internal Relay** and **Save**. Learn's cautions:

- Do this only in a hybrid setup where you have confirmed Internal Relay is right.
- Internal Relay needs a matching connector to your on-premises environment. Without it, mail flow to on-premises recipients breaks.
- With **Authoritative**, the service looks only in the Exchange Online organization and stops delivery if the recipient is not found. With Internal Relay, unknown recipients are relayed on-premises.
- Changing the type can cause other problems, so proceed with caution.

**Check the MX record for custom domains.**

1. Go to **Settings** > **Domains**, select the domain and choose **Check DNS** in the **Required DNS settings** pane.
2. Confirm there is only one MX record. Microsoft does not support multiple MX records for an Exchange Online domain.
3. Fix issues in the admin center or at your DNS host.

Typically, the MX record points to `<your domain>.mail.protection.outlook.com` or `<your domain>.subdomain.mx.microsoft`. DNS record updates usually propagate in a few hours, but they can take up to 72 hours.

## Cause 2: backscatter

Spammers forge the **From** address, so the bounce lands with you although you did not send the original message. Nobody needs to act on the bounce. Delete it. Learn adds that a lot of backscatter may mean your device is infected with spam-sending malware, so consider running an anti-malware scan. Admins who want to reduce impersonation can set up SPF, which Learn links.

## Fix step: broken forwarding rules or settings

| Mechanism | Who can change it | Where |
| --- | --- | --- |
| Inbox rules | User or delegate | Settings > Your app settings > Mail > Mail > Automatic processing > Inbox and sweep rules |
| Account forwarding | User or email admin | Admin: Microsoft 365 admin center > Users > Active users > the user > Mail Settings > Email forwarding > Edit. User: Settings > Your app settings > Mail > Accounts > Forwarding |
| Mail flow (transport) rules | Email admin only | Exchange admin center > Mail flow > Rules. Look for redirect rules |

Inbox rules belong to the user's mailbox. Mail flow rules are organization-wide.

## What the page does not cover

The enhanced code RESOLVER.ADR.RecipientNotFound, Exchange Online PowerShell commands for checking recipients, forwarding or mail flow rules (only the sync command appears), message trace or NDR header analysis, steps to create a mailbox or contact, and the behavior of 5.1.10 with non-Microsoft recipients.

## A quick triage (my advice)

The order is my own suggestion, not taken from the page.

1. Sender: resend with a retyped address.
2. Admin: check that the user exists and is licensed.
3. Hybrid: run a delta sync.
4. Custom domain: check the MX record.
5. Still failing: check forwarding rules and mail flow rules.
6. Bounce for a message nobody sent: treat it as backscatter.

## Typical mistakes (my advice)

- Resending from the same stale Auto-Complete entry.
- Switching an accepted domain to Internal Relay without a connector.
- Adding a second MX record for failover.
- Treating backscatter as an outage.

## Related

- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Microsoft Entra Connect](https://www.m365.fm/entity/entra-connect/)
- [Exchange Online PowerShell](https://www.m365.fm/entity/exchange-online-powershell/)

## Sources

- [Fix NDR error 550 5.1.10 in Exchange Online (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/exchange/email-delivery/ndr/fix-error-code-550-5-1-10-in-exchange-online)
