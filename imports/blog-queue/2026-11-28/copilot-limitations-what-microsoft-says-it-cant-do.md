---
title: "Why Copilot Feels Useless: Documented Limits and What Microsoft Says It Can't Do"
summary: "Why Microsoft Copilot disappoints: the limits Microsoft documents, from accuracy and ungrounded answers to licensing, language gaps, Excel restrictions and setup problems you can fix."
status: review
publish: false
author: mirko-p
date: 2026-11-28
topics: [copilot, copilot-governance, copilot-adoption]
keypoints:
  - "Microsoft says Copilot can produce ungrounded results, so answers must be reviewed. It is not intended for conclusions in financial, legal or medical matters."
  - "Many complaints trace back to setup, not the model: missing license, device-based licensing, group mailboxes, blocked network endpoints or third-party cookies."
  - "Copilot supports fewer languages than Microsoft 365, and Microsoft says Copilot in Excel was mainly trained on English sources."
  - "Copilot in Excel has documented gaps: editing needs Automatic calculation, and checked-out files from SharePoint do not work on Windows or Mac."
  - "Copilot only sees what the user can access, so messy permissions and poor content hygiene lead to poor or risky answers."
faq:
  - q: "Why does Copilot give wrong or made-up answers?"
    a: "Microsoft's application card for Copilot says AI can make mistakes and may fabricate content that sounds reasonable but is inaccurate. It also says Copilot may include information that is not present in its input sources, so users should review responses and double-check facts."
  - q: "Is Copilot suitable for financial, legal or medical decisions?"
    a: "Microsoft Learn says to carefully consider use cases in high stakes domains such as medical or financial. The Word, Excel and PowerPoint agents FAQ states they are not intended for drawing conclusions or making decisions in financial, legal, medical or other sensitive domains."
  - q: "Why is Copilot missing features my colleague has?"
    a: "The Learn requirements page ties Copilot to a Copilot license plus a qualifying license, a work or school account in Microsoft Entra ID, and eligible mailboxes. Device-based licensing for Microsoft 365 Apps and group mailboxes are not supported. Copilot Chat needs only an eligible subscription."
  - q: "Does Copilot work well in languages other than English?"
    a: "Learn says Copilot supports fewer languages than Microsoft 365 and returns an error message for an unsupported language. The Excel support page says prompts in many languages are supported but results may be weaker when prompts or data are not in English."
  - q: "Can Copilot see all of my company's files?"
    a: "No. Microsoft's security page says Copilot operates within existing permissions and access controls. That means oversharing can surface content to people who should not see it, and poorly governed content can affect Copilot results."
---

Copilot often feels useless for three documented reasons. It can state things that are not in its sources, so output needs checking. Many features depend on licenses, accounts, network settings and file conditions that are easy to miss. And it works only with the data a person can already reach, so a messy tenant gives messy answers. Microsoft publishes these limits itself. This article lists them, so you can separate real limits from setup problems.

## Limit 1: It can be wrong, and Microsoft says so

Microsoft's application card for Copilot says AI can make mistakes. It could generate nonsensical content or fabricate content that sounds reasonable but is factually inaccurate. In the grounding section the same page says Copilot may include information in its response that is not present in its input sources, which Microsoft calls ungrounded results.

Learn asks users to review responses, to check facts before acting on them and to be aware of the risk of overreliance.

What this means in practice:

- Treat a summary as a draft. Open the cited source for anything that matters.
- Ask for sources and compare them with the answer.
- Do not paste unchecked numbers into reports.

## Limit 2: Some uses are explicitly out of scope

The application card tells readers to avoid use that could cause significant physical or psychological injury, or that could have a consequential impact on life opportunities or legal status. It asks for careful consideration in high stakes domains such as medical or financial work. The FAQ for Word, Excel and PowerPoint agents says these agents are not intended for conclusions or decisions in financial, legal, medical or other sensitive domains and are not a replacement for human expertise.

## Limit 3: Licensing and account conditions

Many "Copilot does nothing" cases come from requirements, not from the model. The Learn requirements page lists:

- A Copilot license plus a qualifying prerequisite license. Copilot Chat is available with an eligible subscription and needs no Copilot license for eligible users.
- A work or school account in Microsoft Entra ID.
- Not available with device-based licensing for Microsoft 365 Apps for enterprise.
- Mailbox features need a primary Exchange Online mailbox. Group mailboxes are not supported.
- Some features need OneDrive. Meeting content after a meeting needs transcription or recording.
- Word, Excel and PowerPoint for the web need third-party cookies. Blocked cookies for `*.safelinks.protection.outlook.com` cause "Unable to verify link".
- Network filtering must allow the entire `*.cloud.microsoft` domain. Learn says allowing only selected application URLs inside it is not supported, and full WebSocket connectivity is required.

If Copilot is missing or greyed out, check these items in order before you judge the product.

## Limit 4: Language coverage

Learn says Copilot currently supports fewer languages than Microsoft 365. If the language in a prompt is not supported, you get an error message. For Excel, the support page says many languages are supported, including English (US), Spanish and Japanese, but that Copilot was mainly trained on English sources, so results may be weaker for other languages.

## Limit 5: Copilot in Excel has specific gaps

The Excel FAQ on Microsoft Support lists these conditions:

- Copilot editing is only supported when calculation options are set to Automatic.
- If your organization requires check-out in SharePoint, Copilot in Excel on Windows or Mac does not work for files from that site. Excel for the web still works.
- Strict Open XML Spreadsheet files trigger "Unsupported file state". Saving as .xlsx resolves it.
- On iPhone and Android, chat is the only mode. iPad supports chat and plan but not full edit mode yet.
- You cannot delete individual conversations, only your full Copilot activity history.

The page does not state row or file size limits, so do not trust numbers from third-party articles without testing them.

## Limit 6: Customization and performance

The application card lists further considerations: limited customization to fit specific workflows, a dependence on internet connectivity, possible latency during peak usage and limited compatibility with third-party apps and nonstandard configurations. It also says effective use requires users to understand capabilities and limits, which is a training point rather than a technical one.

## Limit 7: It only knows what the user can reach

Microsoft's security page says Copilot operates within existing permissions and access controls and that overshared or poorly governed content can affect results and increase risk. The foundational deployment blueprint is organized around three pillars: remediate oversharing, set up guardrails and meet regulations. If a team site has outdated drafts and wide permissions, Copilot can use that material.

## Sorting a real limit from a setup problem

| Symptom | Likely group | First check |
|---|---|---|
| Button missing or greyed out | Setup | License, account type, device-based licensing |
| Answer sounds right but is wrong | Real limit | Open the cited sources and verify |
| Fails in one workbook only | Excel condition | Calculation mode, check-out, file format |
| Weak output in your language | Real limit | Try an English prompt to compare |
| Shows content people should not see | Governance | Permissions and oversharing review |

## Related

- [Microsoft 365 Copilot](https://www.m365.fm/entity/copilot/)
- [Copilot governance](https://www.m365.fm/entity/copilot-governance/)
- [Copilot adoption](https://www.m365.fm/entity/copilot-adoption/)

## Sources

- [Microsoft Learn: Application card for Microsoft Copilot](https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-transparency-note)
- [Microsoft Learn: Microsoft Copilot requirements and restrictions](https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-requirements)
- [Microsoft Learn: FAQ about Word, Excel and PowerPoint agents](https://learn.microsoft.com/microsoft-365/copilot/faq-wordexcelppt-agents)
- [Microsoft Support: Frequently asked questions about Copilot in Excel](https://support.microsoft.com/office/7a13758f-d61e-4a56-8440-f2c9a07802ec)
- [Microsoft Learn: Security for Microsoft Copilot](https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-ai-security)
- [Microsoft Learn: Secure and govern Microsoft Copilot](https://learn.microsoft.com/en-us/microsoft-365/copilot/secure-govern-copilot-foundational-deployment-guidance)
