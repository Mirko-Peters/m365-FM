---
title: "Copilot Data Retention, Residency and Storage: Where Prompts and Responses Are Kept"
summary: "Where Microsoft Copilot stores prompts and responses, how Purview retention policies apply, how residency and the EU Data Boundary work, and how users and admins delete Copilot history."
status: review
publish: false
author: mirko-p
date: 2026-11-28
topics: [copilot, purview, data-residency, retention-policies]
keypoints:
  - "Copilot stores the user's prompt, the response and citations. Prompts and responses sit in a hidden folder in the user's Exchange Online mailbox."
  - "Retention and deletion follow your Microsoft Purview retention policies. Microsoft's pages describe no default retention period."
  - "Purview timer jobs typically take 1 to 7 days, so a retention policy does not delete Copilot data instantly. Holds can suspend permanent deletion."
  - "Microsoft Copilot is a covered workload in data residency commitments since March 1, 2024. For EU customers it is an EU Data Boundary service, with an exception for Anthropic models."
  - "Audit records show who used Copilot and what it accessed, but not the text of prompts or responses. Use eDiscovery or DSPM for AI for the text."
faq:
  - q: "Where does Microsoft Copilot store prompts and responses?"
    a: "Microsoft Learn says a hidden folder in the user's Exchange Online mailbox stores user prompts and Copilot responses. Other locations include Purview Audit logs, Preservation Hold libraries, a OneDrive folder for files uploaded to Copilot Chat, and a SharePoint Embedded container for Copilot Pages and Notebooks."
  - q: "How long does Copilot keep my data?"
    a: "Microsoft's privacy and architecture pages say retention follows the Microsoft Purview retention policies you configure, and they do not state a default retention period. Without a policy, the pages I read do not give a fixed number of days."
  - q: "Does a Purview retention policy delete Copilot data right away?"
    a: "No. Microsoft Learn says the timer job typically takes 1 to 7 days to run, and items stay in the SubstrateHolds folder for at least one day. A delete after 1 day could take 16 days before the message is permanently deleted so it no longer appears in eDiscovery searches."
  - q: "Is Copilot data stored in the EU for EU customers?"
    a: "Learn says that for EU customers Microsoft Copilot is an EU Data Boundary service and EU traffic stays within the EU Data Boundary. It also says models provided by Anthropic as a subprocessor are currently excluded from the EU Data Boundary."
  - q: "How can users delete their Copilot history?"
    a: "Microsoft Learn says users can delete their Copilot activity history, including prompts and responses, in the My Account portal at myaccount.microsoft.com. The page does not say whether this also removes copies held for admin tools such as Content search or Purview."
---

Copilot keeps the prompt, the response and citations to the sources it used. For Microsoft 365 data, the prompts and responses sit in a hidden folder in the user's Exchange Online mailbox, and how long they stay is controlled by the Microsoft Purview retention policies your organization sets. Microsoft's pages describe no default retention period. This article lays out where data sits, how retention policies behave, what residency commitments exist and how deletion works.

## What Copilot stores

Microsoft's privacy page says the stored data includes the user's prompt and Copilot's response, including citations to information used to ground the response. Microsoft calls this the user's Copilot activity history. It applies to interactions in Word, PowerPoint, Excel, OneNote, Loop or Whiteboard, and the history is also shown in Copilot Chat and in Teams meetings.

Learn says the data is encrypted while stored and is not used to train foundation models.

## Where it is stored

The Copilot data protection architecture page lists these locations:

| Location | What it holds |
|---|---|
| User mailbox (Exchange Online) | A hidden folder with user prompts and Copilot responses |
| Microsoft Purview Audit | Audit logs of Copilot interactions |
| Preservation Hold libraries (SharePoint and OneDrive) | Versions of files Copilot referenced, when a retention policy for cloud attachments applies |
| User's OneDrive | A folder with files uploaded to Copilot Chat |
| SharePoint Embedded container | Copilot Pages and Copilot Notebooks, in a user-owned container that Loop My workspace also uses |

For Teams chats with Copilot, admins can use the Teams Export APIs. Admins can also use Content search or Purview to view and manage stored data.

## What the audit log does and does not show

Purview Audit logs Copilot interactions automatically. Each record shows who interacted with Copilot, when and where, and which files, sites or other resources Copilot accessed. Microsoft states that audit records do not contain the text of prompts or responses. To view the text, use eDiscovery or Data Security Posture Management (DSPM) for AI.

## How retention works

Learn says retention and deletion of this data follow your configured Purview retention policies. For new policies, the supported locations are grouped as:

- **Microsoft Copilot experiences:** Microsoft 365 Copilot, Security Copilot, Copilot in Fabric and Copilot Studio.
- **Enterprise AI apps:** Entra-registered AI apps, ChatGPT Enterprise and Microsoft Foundry.
- **Other AI apps:** ChatGPT, Google Gemini, the consumer Microsoft Copilot and DeepSeek.

Microsoft says retention policies for Copilot and Copilot Chat are now separate from Teams chats. To set one up, the Learn retention page points to the general article on creating and configuring retention policies in Microsoft Purview. It gives no portal menu path of its own.

### Timing

The Learn page on retention for Copilot gives these details:

- The timer job typically takes 1 to 7 days to run.
- Messages remain in the SubstrateHolds folder for at least 1 day. If eligible, the timer job deletes them the next time it runs.
- Example: retain 30 days, then delete means permanent deletion typically within 1 to 7 days after the minimum of one day.
- Example: a delete action after 1 day could take 16 days before the message is permanently deleted so it is no longer returned in eDiscovery.

### What can block deletion

Permanent deletion from SubstrateHolds is suspended if the mailbox is affected by another retention policy for the same location, a Litigation Hold, a delay hold or an eDiscovery hold. Until deletion, messages remain searchable by eDiscovery tools. For departed users, messages sit in an inactive mailbox and stay subject to any retention policy that applied before the mailbox became inactive.

Learn also warns that what users see in an AI app is not an accurate reflection of retention. Cached or delayed updates mean users can keep seeing messages for a short time.

## Deleting history as a user

Microsoft's privacy page says users can delete their Copilot activity history, including prompts and responses, in the My Account portal at myaccount.microsoft.com. The page does not say whether this removes copies kept for admin tools such as Content search or Purview, so do not promise users that it does. Learn adds that messages leave the app only when users delete the chat (where available) or submit a request to delete their history of all Copilot interactions.

## Data residency and the EU Data Boundary

Microsoft's statements, as written on the privacy page:

- Microsoft Copilot was added as a covered workload in the data residency commitments in the Microsoft Product Terms on March 1, 2024.
- Advanced Data Residency and Multi-Geo offerings include residency commitments for Copilot customers as of March 1, 2024.
- For EU customers, Copilot is an EU Data Boundary service. EU traffic stays within the EU Data Boundary, while worldwide traffic can be sent to the EU and other countries or regions for LLM processing.
- Calls to the language model are routed to the closest data centers in the region but can go to other regions when capacity is needed at high utilization.
- Models provided by Anthropic as a subprocessor are currently excluded from the EU Data Boundary.
- Customers outside the EU may have queries processed in the US, EU or other regions.

The page does not name specific storage regions. It says interaction data is processed and stored in line with contractual commitments for your other Microsoft 365 content.

## Encryption and labeled content

Learn says Microsoft 365 uses service-side technologies including BitLocker, per-file encryption, TLS and IPsec to encrypt customer content at rest and in transit. For labeled or encrypted content, a user must have both VIEW and EXTRACT usage rights for Copilot to summarize or return it. Copilot does not use content protected by Double Key Encryption. The architecture page does not describe encryption of Copilot interaction data inside each storage location.

## What to check in your tenant

1. Confirm a Purview retention policy exists for Copilot locations, and note its duration.
2. Check for holds on mailboxes that would suspend deletion.
3. Decide who may search Copilot content in eDiscovery.
4. Document residency commitments against your contract, including the Anthropic exception if you use those models.
5. Tell users how to delete their own history, and what remains.

## Related

- [Microsoft 365 Copilot](https://www.m365.fm/entity/copilot/)
- [Microsoft Purview](https://www.m365.fm/entity/purview/)
- [Data residency](https://www.m365.fm/entity/data-residency/)
- [Retention policies](https://www.m365.fm/entity/retention-policies/)

## Sources

- [Microsoft Learn: Data, Privacy, and Security for Microsoft Copilot](https://learn.microsoft.com/en-us/copilot/plan/microsoft-365-copilot-privacy)
- [Microsoft Learn: Copilot data protection architecture](https://learn.microsoft.com/en-us/copilot/plan/architecture-data-protection-auditing)
- [Microsoft Learn: Retention for Copilot interactions](https://learn.microsoft.com/en-us/purview/retention-policies-copilot)
- [Microsoft Learn: Security for Microsoft Copilot](https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-ai-security)
