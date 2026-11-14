---
title: "Fix NDR 550 5.7.1 Delivery Not Authorized or Unable to Relay in Exchange Online"
summary: "NDR 5.7.1 (and 5.7.0 to 5.7.999) means a security setting blocks the message: no permission to send, a restricted group, a blocklisted IP, MX, SPF or hybrid connector problems. Steps for senders, group owners and admins."
status: review
publish: false
author: mirko-p
date: 2027-01-14
topics: [exchange-online, spf]
keypoints:
  - "Learn says 5.7.1 typically means a security setting in your organization or the recipient's organization prevents delivery; it also applies to 5.7.0 through 5.7.999."
  - "For restricted groups the NDR names the groups you cannot send to; groups with more than 5,000 members get moderation and large message limits automatically."
  - "An external sender on Microsoft's blocklist should forward the NDR to the delist address given in the NDR and can use the delist portal."
  - "Admins check the domain status, a single correct MX record, SPF, and hybrid connectors, and may need to rerun the Hybrid Configuration Wizard."
  - "Disabling an on-premises account can trigger a 5.7.129 style rejection; Learn says to delete the account to stop all communication."
faq:
  - q: "What does NDR 5.7.1 mean?"
    a: "Microsoft Learn says it typically indicates that a security setting in your organization or the recipient's organization is preventing the message from reaching the recipient. Examples: you lack permission to send to the recipient or to a group, you lack permission to send through a server between you and the recipient, or the message was routed to the wrong server."
  - q: "What can the sender do?"
    a: "Learn says you typically cannot fix it yourself. For an external recipient, contact them and ask them to tell their admin. For an internal group, the NDR names the restricted groups, and you ask the group owner for permission. For a group with more than 5,000 members, join the group or ask the owner or moderator to approve the message."
  - q: "How does a group owner fix it?"
    a: "Learn lists three options: remove the sender restriction, for example by adding the sender to the allowed senders list through a mail contact or mail user for an external sender, or configure the group to accept external senders; adjust a mail flow rule that restricts senders; or approve the moderated message or add the sender to the group."
  - q: "What if my IP is on Microsoft's blocklist?"
    a: "The NDR diagnostics will say the client host is blocked using a blocklist and will give a removal address. Learn says to forward the NDR to that address, and also points to the delist portal for removing yourself from the blocked senders list."
  - q: "What is the RESOLVER.RST.AuthRequired error for a public folder?"
    a: "Learn says an external sender gets a 5.7.1 NDR with RESOLVER.RST.AuthRequired when sending to a mail-enabled public folder that requires authentication. The fix in the Exchange admin center is to edit the folder's mail flow settings, clear Require that all senders are authenticated and select All senders."
---

NDR 5.7.1 means a security setting stopped the message. It applies to codes 5.7.0 through 5.7.999 as well. Microsoft Learn says it typically cannot be fixed by the sender alone. Check who you were sending to, read the NDR text for a group name or a blocklist notice, then involve the recipient's admin or your own. This guide follows the Learn article for NDR 5.7.1 in Exchange Online.

## What the error means

Learn says the error typically indicates a security setting in your organization or the recipient's organization is preventing your message from reaching the recipient. Its examples:

- You do not have permission to send to the recipient.
- The recipient is a group and you do not have permission to send to the group or one of its subgroups.
- You do not have permission to send through an email server between you and the recipient.
- The message was routed to the wrong email server.

## If you are the sender

Learn says you typically cannot fix this yourself. Options by situation:

- **External recipient.** Contact them by phone or in person and ask them to tell their email admin. The admin might need to reconfigure the mailbox so it accepts email from you.
- **Internal group.** You might lack permission to send to the group or a subgroup. The NDR names the restricted groups. Ask the group owner for permission. To find the owner in Outlook, select the NDR, double-click the group name on the **To** line and choose **Contact**. In Outlook on the web, select the NDR, choose the group name on the **To** line and choose **Owner**.
- **Large distribution group.** Groups with more than 5,000 members automatically get these restrictions: messages need approval by a moderator, and large messages cannot be sent (large messages produce a different NDR). Join the group or ask the owner or moderator to approve the message.

## If you own a restricted group

Learn gives these options:

- **Remove the sender restriction.** Add the sender to the allowed senders list. For an external sender you must first create a mail contact or mail user to represent them. If the restriction is because the sender is external, configure the group to accept messages from external senders. If a mail flow rule restricts senders, change the rule.
- **Large group restrictions.** Approve the sender's message or add the sender to the group.
- Learn links articles on moderated recipients and on creating and managing distribution groups.

## If you are the email admin

### The sender is external

If only this recipient has trouble accepting messages from external senders, configure the recipient or your email servers to accept messages from external or anonymous senders.

### The recipient is a public folder

An external sender gets `RESOLVER.RST.AuthRequired; authentication required` in the NDR. To fix it in the Exchange admin center:

1. Go to **Public folders** > **Public folders**.
2. Select the folder and choose **Edit**.
3. Open **Mail flow settings**.
4. Under **Message Delivery Restrictions** > **Accept messages from**, clear **Require that all senders are authenticated** and select **All senders**.
5. Save.

### The sender's IP is on Microsoft's blocklist

The **Diagnostics for administrators** section would show that the client host is blocked using a blocklist and gives a removal address. Forward the NDR message to that address. Learn also points to the delist portal.

### Domain not fully enrolled

Verify that your domain shows **Healthy** in the Microsoft 365 admin center under **Settings** > **Domains**. If not, finish adding the domain.

### MX record problems

1. Check sender and recipient domains for incorrect or stale MX records using **Advanced diagnostics** > **Exchange Online** in Microsoft Support and Recovery Assistant.
2. Check with your registrar or DNS host that the MX record is right. For a domain enrolled in Exchange Online it uses the syntax `<domain>.mail.protection.outlook.com` or `<domain>.subdomain.mx.microsoft`, according to Learn.
3. Verify **Inbound SMTP Email** and **Outbound SMTP Email** in the Microsoft Remote Connectivity Analyzer.
4. Verify only one MX record is configured. Learn says Microsoft does not support more than one MX record for a domain enrolled in Exchange Online.

### SPF problems

The SPF record might be incomplete and might not include all email sources. Learn links its article on setting up SPF.

### Hybrid configuration

The Hybrid Configuration Wizard should configure the connectors automatically, but you can verify them. In the Exchange admin center, go to **Mail Flow** > **Connectors**, select the hybrid connector and choose **Edit**. Check:

- **Delivery.** If **Route mail through smart hosts** is selected, confirm the IP address or FQDN. If **MX record associated with the recipient domain** is selected, confirm the MX record points to the right server.
- **Scope.** To route inbound internet mail to your on-premises organization, **Domains** must include all email domains used on-premises. An asterisk routes all outbound internet mail through the on-premises organization.

If the connectors are wrong, rerun the Hybrid Configuration Wizard on-premises.

### Disabled on-premises accounts

If you disable an on-premises Active Directory account, senders can get a message that they lack permission to send, which Learn ties to DSN 5.7.129. To stop all communication with the Exchange Online mailbox, Learn says to delete the on-premises account instead of disabling it. Another route is removing the license, but then you need a mail flow rule to stop the user receiving mail, because the user would otherwise keep receiving messages for about 30 days after the license removal.

## A triage order

This is my own summary.

1. Is the recipient a group? Read the group name in the NDR.
2. Is the recipient external? Involve their admin.
3. Does the diagnostic text mention a blocklist? Use the removal address and portal.
4. Does it mention authentication required? Check public folders.
5. For many senders or many recipients, check domain health, MX, SPF and hybrid connectors.

## Related

- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [SPF](https://www.m365.fm/entity/spf/)

## Sources

- [Fix NDR error 550 5.7.1 in Exchange Online - Exchange (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/exchange/email-delivery/ndr/fix-error-code-550-5-7-1-in-exchange-online)
