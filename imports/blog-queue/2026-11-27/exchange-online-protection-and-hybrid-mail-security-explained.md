---
title: "Hybrid Mail Security Explained: Exchange Online Protection with On-Premises Mailboxes"
summary: "How Exchange Online Protection (EOP) protects mail in a hybrid Exchange setup: filtering layers, MX record choices, centralized mail transport, Enhanced Filtering and the on-premises add-on."
status: review
publish: false
author: mirko-p
date: 2026-11-27
topics: [exchange-online-protection, exchange-online, defender-for-office-365]
keypoints:
  - "Microsoft Learn now calls EOP the built-in security features for cloud mailboxes. They are included with every Exchange Online cloud mailbox and cannot be switched off."
  - "Filtering runs in order: connection filtering, malware check, policy filtering (mail flow rules), then anti-spam and anti-phishing."
  - "In a hybrid deployment, pointing the MX record to Microsoft 365 is recommended and is required to protect on-premises mailboxes with the built-in features."
  - "Centralized mail transport is off by default. Microsoft recommends it only for organizations with specific compliance needs."
  - "If the MX record does not point to Microsoft 365, Enhanced Filtering for Connectors keeps the original sender IP visible to the filters."
  - "Organizations without cloud mailboxes can buy the same protection as the Built-in security add-on for on-premises mailboxes."
faq:
  - q: "What is Exchange Online Protection?"
    a: "Microsoft Learn describes the built-in security features for cloud mailboxes, long known as EOP, as protection against spam, malware and phishing that is included with every Exchange Online cloud mailbox. The default anti-malware, anti-spam and anti-phishing policies apply to all recipients and cannot be turned off, though they can be overridden by preset or custom policies."
  - q: "Where should the MX record point in a hybrid deployment?"
    a: "Microsoft Learn recommends pointing it to Microsoft 365 for hybrid deployments. It states that this configuration is required to use the built-in security features for all cloud mailboxes to protect the on-premises organization. Keeping the MX record on-premises does not allow that protection."
  - q: "When do I need Enhanced Filtering for Connectors?"
    a: "Microsoft Learn says it is for mail that reaches Microsoft 365 through another hop, for example hybrid setups where internet mail is routed through on-premises Exchange first, or through a non-Microsoft filtering service. It preserves the source IP address and sender information so filtering can evaluate the original sender."
  - q: "Is EOP the same as Defender for Office 365?"
    a: "No. Microsoft Learn says the built-in features address basic email threats and points to Defender for Office 365 for phishing prevention, post-delivery remediation, threat investigation and end-user resilience. Plan 1 includes Safe Links and Safe Attachments, and Plan 2 adds hunting and investigation tools."
---

In a hybrid Exchange setup, Exchange Online Protection (EOP) can filter mail for both cloud and on-premises mailboxes, but only if mail is routed through Microsoft 365 first. The deciding setting is the MX record. If it points to Microsoft 365, mail passes the cloud filters before it reaches on-premises mailboxes. If it stays on-premises, the built-in features do not protect the on-premises organization, according to Microsoft Learn.

## A note on names

Microsoft Learn now titles the feature set "Built-in security features for cloud mailboxes." The page address still contains eop-about, and the service description still mentions Exchange Online Protection. This article uses EOP and the newer name as the same thing. Standalone EOP, for on-premises mailboxes, is offered as the Built-in security add-on for on-premises mailboxes.

## What the built-in features do

They are included with every Exchange Online cloud mailbox, with no setup. The default threat policies for anti-malware, anti-spam and anti-phishing apply to all recipients. You cannot turn them off, but preset security policies or custom threat policies can override them. Microsoft's recommendation: turn on the Standard and/or Strict preset security policies and add all recipients to them.

The feature list includes connection filtering, anti-phishing, anti-spoofing, zero-hour auto purge (ZAP), the Tenant Allow/Block List, Directory Based Edge Blocking, quarantine, message trace, mail flow rules, connectors and Enhanced Filtering for Connectors.

## Order of filtering

Microsoft lists the layers in this order:

1. **Connection filtering** checks sender reputation. Most spam is rejected here.
2. **Malware check.** Malware goes to quarantine, which only admins can view by default.
3. **Policy filtering** applies Exchange mail flow rules. DLP checks for on-premises organizations with Exchange Enterprise CAL with Services licenses run here.
4. **Anti-spam and anti-phishing** classify the message as bulk, spam, high-confidence spam, phishing, high-confidence phishing or spoofing. High-confidence phishing always goes to quarantine.

A message that passes all layers is delivered.

## Hybrid mail flow: three decisions

### 1. Where the MX record points

| MX record | What Microsoft says |
|---|---|
| Microsoft 365 | Recommended for hybrid. All mail to any recipient goes through Exchange Online first. Required for the built-in features to protect on-premises mailboxes |
| On-premises | All mail goes through on-premises Exchange. Can help organizations with an on-premises journaling solution. Does not allow cloud protection of on-premises mailboxes |

The Hybrid Configuration wizard does not configure inbound internet routing. You set the MX record manually.

### 2. Whether to use centralized mail transport

With centralized mail transport, outbound mail from Exchange Online is routed through the on-premises organization, so on-premises compliance rules can apply. It is off by default, in which case Exchange Online sends directly to the internet. Microsoft recommends it only for organizations with specific compliance needs. Messages between recipients in the same Exchange Online organization do not go through on-premises.

### 3. Whether something sits in front of Microsoft 365

Learn says not to place servers, services or devices that modify messages between on-premises Exchange and Microsoft 365, because secure mail flow depends on information in the messages. Firewalls that pass SMTP on port 25 without modification are supported.

If the MX record does not point to Microsoft 365, use **Enhanced Filtering for Connectors**. It preserves the source IP and sender information and can recover from DKIM failures caused by an intermediate hop. In the Microsoft Defender portal:

1. Go to **Email & Collaboration** > **Policies & Rules** > **Threat policies** > **Rules** > **Enhanced filtering**.
2. Select the inbound connector.
3. Under **IP addresses to skip**, choose to disable the feature, to automatically detect and skip the last IP address, or to enter the addresses.
4. Choose **Apply to entire organization** or a small set of users. Microsoft suggests testing with a small set.
5. Save.

Supported only for linear routing such as Internet, non-Microsoft service, on-premises, Microsoft 365. Non-linear paths such as Internet, Microsoft 365, on-premises, Microsoft 365 are not supported. Disable mail flow rules that set SCL -1 for messages through the connector.

## On-premises specifics

- In environments where the cloud protects on-premises mailboxes, Microsoft says to configure mail flow rules in on-premises Exchange that recognize the spam filtering verdicts from the cloud. If you do not want cloud-detected spam moved to the Junk Email folder, the action can be changed in the anti-spam policies.
- If an on-premises server cannot accept mail, Microsoft 365 queues it. Deferred messages are retained for one day.
- Licensing: the transport routing article notes you might need to purchase the built-in security add-on for on-premises mailboxes if on-premises recipients are protected by the cloud features.
- A hybrid deployment itself needs a current cumulative update, directory synchronization and a license for each mailbox in Exchange Online.

## EOP or Defender for Office 365

The built-in features cover basic threats. Defender for Office 365 Plan 1 adds Safe Links, Safe Attachments and real-time detection, and is in certain business subscriptions such as Microsoft 365 Business Premium. Plan 2 adds advanced threat hunting, automation and investigation, and is in enterprise subscriptions such as Microsoft 365 E5. The Learn page does not give a feature-by-feature comparison with EOP.

## Common mistakes

- Keeping the MX record on-premises and assuming cloud filtering protects on-premises mailboxes.
- Placing a message-modifying device between on-premises and Microsoft 365.
- Enabling centralized mail transport without a compliance reason.
- Leaving old SCL -1 rules active on a connector with Enhanced Filtering.
- Forgetting to teach on-premises Exchange the cloud spam verdicts.

## What the documentation does not say

The hybrid routing article read here is part of the Exchange 2013 and 2010 hybrid documentation, and it does not mention EOP by name. Its routing principles match the current hybrid overview, but check the current Exchange Server hybrid pages for your version.

## Related

- [Exchange Online Protection](https://www.m365.fm/entity/exchange-online-protection/)
- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Microsoft Defender for Office 365](https://www.m365.fm/entity/defender-for-office-365/)
- [Exchange Server](https://www.m365.fm/entity/exchange-server/)

## Sources

- [Built-in security features for all cloud mailboxes](https://learn.microsoft.com/en-us/defender-office-365/eop-about)
- [Mail flow in EOP](https://learn.microsoft.com/defender-office-365/mail-flow-about)
- [Built-in security features service description](https://learn.microsoft.com/en-us/office365/servicedescriptions/exchange-online-protection-service-description/exchange-online-protection-service-description)
- [Built-in security add-on for on-premises mailboxes](https://learn.microsoft.com/en-us/exchange/standalone-eop/standalone-eop)
- [Transport routing in Exchange hybrid deployments](https://learn.microsoft.com/en-us/exchange/exchange-2013-and-2010-hybrid/transport-routing)
- [Enhanced Filtering for Connectors in Exchange Online](https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/enhanced-filtering-for-connectors)
- [Exchange Server hybrid deployments](https://learn.microsoft.com/en-us/exchange/exchange-hybrid)
