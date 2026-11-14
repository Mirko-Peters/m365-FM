---
title: "Microsoft Copilot vs Microsoft 365 Copilot: What Is the Difference?"
summary: "The difference between Microsoft Copilot and Microsoft 365 Copilot: personal versus work accounts, Copilot Chat versus the licensed add-on, what data each can use, and how Microsoft's naming is changing."
status: review
publish: false
author: mirko-p
date: 2026-11-16
topics: [copilot, copilot-chat, enterprise-data-protection]
keypoints:
  - "Which Copilot you get depends first on the account. A personal Microsoft account leads to the Copilot app. A work or school Entra account leads to Copilot Chat or the licensed Copilot."
  - "Copilot Chat is included with eligible Microsoft 365 subscriptions. It is grounded in the web and cannot use Microsoft Graph data on its own."
  - "The licensed add-on adds automatic grounding in work data through Microsoft Graph and Work IQ, plus priority access to Copilot in Word, Excel, PowerPoint and OneNote."
  - "Enterprise data protection applies when you sign in with a Microsoft Entra account. Prompts and responses are not used to train foundation models."
  - "Microsoft's own pages use changing names, so check the current Learn pages before you write them into a policy or a purchase order."
faq:
  - q: "What is the main difference between Copilot Chat and Microsoft 365 Copilot?"
    a: "Microsoft Learn says Copilot Chat is grounded in the web and is included with eligible Microsoft 365 licenses, while the licensed Copilot can also reason over work data from Microsoft Graph. Without the license, Copilot Chat cannot access organizational data through Microsoft Graph."
  - q: "Is Copilot Chat free for work accounts?"
    a: "Microsoft's Copilot Chat page describes it as available at no additional cost for all Microsoft Entra account users with an eligible Microsoft 365 subscription. Microsoft Learn adds that agents beyond web-grounded ones are priced on a pay-as-you-go basis."
  - q: "Does Copilot use my data to train models?"
    a: "Microsoft Learn's Copilot FAQ states that under enterprise data protection, prompts and responses are not used to train foundation models. It also says the data is not available to OpenAI or used to train OpenAI models. Enterprise data protection applies when you sign in with a Microsoft Entra account."
  - q: "Can I use my personal Copilot at work?"
    a: "Microsoft Support says that if your employer has multi-account access turned on, you can use a personal Copilot subscription at work, but access and permissions stay tied to your work account."
---
The short answer: Microsoft documents several Copilot experiences. The Microsoft Copilot app is the entry point for personal accounts, Copilot Chat is the baseline for work accounts with eligible Microsoft 365 subscriptions, and Microsoft 365 Copilot is the licensed work version that can use your organization's data. The practical difference comes down to the account you sign in with, the license you hold and which data the assistant may use.

## Step 1: Which account are you using?

Microsoft Learn separates two sign-in paths. With a work or education Microsoft Entra account, you get Copilot Chat with enterprise data protection. With a personal Microsoft account, you reach the Microsoft Copilot app on web, desktop and mobile, plus other entry points listed on the same page. Learn gives visual cues for a work account, including a "Work" label under the user profile and the green data protection shield.

Microsoft Support adds that Microsoft Copilot is also available in Microsoft 365 Personal, Family and Premium plans under the Microsoft Services Agreement. That coverage applies to its Personal, Family, Premium and Pro subscriptions.

## Step 2: What does Copilot Chat give you at work?

Microsoft Learn defines Copilot Chat as a secure, enterprise-ready AI chat that primarily uses web data and has limited use of organizational content. It is included with eligible Microsoft 365 licenses and also appears in Edge, Outlook and Teams. Microsoft's Copilot Chat page says it is available at no additional cost to Entra account users with an eligible subscription.

Without the Microsoft 365 Copilot add-on, Learn says Copilot Chat can use organizational data only when you upload files, use it with open content in Outlook or Teams, or use a pay-as-you-go agent. It cannot use Microsoft Graph automatically.

## Step 3: What does the licensed Copilot add?

Learn describes the premium tier as having the Microsoft 365 Copilot add-on license with priority access to the full experience of Copilot in Word, Excel, PowerPoint and OneNote. It uses both web and organizational data through Microsoft Graph and Work IQ and pulls information automatically, so you do not need to upload files by hand. Admins get advanced management controls and analytics.

The comparison in Microsoft's licensing table:

| Capability | Copilot Chat (Basic) | Microsoft 365 Copilot (Basic) | Microsoft 365 Copilot (Premium) |
|---|---|---|---|
| Add-on license | No | No | Yes (priority access) |
| Copilot in Word, Excel, PowerPoint, OneNote | No | Standard access | Priority access, full experience |
| Work data via Graph | No | No | Yes, automatic |
| Agents | Declarative agents grounded in instructions and public websites; custom or other agents are pay-as-you-go only | Agents using web data; pay-as-you-go work data agents | Agents using web and work data |
| Admin controls | Not listed | Basic usage management controls and reporting | Advanced management controls and analytics |

The same page also lists a usage-based billing column, which this guide does not cover.

## Cost and license facts to verify

Microsoft's Copilot Chat page lists Microsoft 365 Copilot at $30.00 per user per month paid yearly, and Microsoft 365 Copilot Business at $18.00 per user per month (originally $21.00) for up to 300 users, with the discount stated for July 1 to December 31, 2026. That page also says a separate license for a qualifying Microsoft 365 plan is required for Copilot Business. Prices and offers change, so confirm them on Microsoft's pricing page. The Learn licensing page says the licensed Copilot is available with Microsoft 365 E7 or as an add-on for eligible plans, and that Microsoft Copilot Business is for organizations with up to 300 users. It advises checking Product Terms and the service description before buying.

## Data protection

Microsoft Learn states that Copilot Chat and the licensed tiers are protected by enterprise data protection when you sign in with an Entra account, under the same contractual terms customers trust for Exchange email and SharePoint files. The FAQ says prompts and responses are not used to train foundation models, are not available to OpenAI, and can be retained and audited with Microsoft Purview capabilities. It also says Copilot Chat has no advertising for users signed in with Entra ID.

## A note on names

Microsoft's naming is moving. Several Learn pages now say "Microsoft Copilot" where earlier material said "Microsoft 365 Copilot", while table headings still read "Microsoft 365 Copilot (Basic)" and "(Premium)". One support page on subscriptions uses "Microsoft Copilot" for the assistant and "Copilot in Microsoft 365 apps" for the in-app features. A support page on Copilot app changes says you need to sign in to the updated Copilot app by December 31, 2026 to preserve eligible chats and content, and that content not migrated will be permanently deleted after that date. Use the exact names from the page you are quoting, and check dates when you plan a rollout.

## How to decide

- Personal use at home: the Microsoft Copilot app with your personal account.
- Work staff who mainly need secure web-grounded chat: Copilot Chat, already included.
- Staff who need answers from their own mail, files and meetings, or priority Copilot in Office apps: the licensed Microsoft 365 Copilot.
- Developers and security teams: GitHub Copilot and Security Copilot are separately licensed products, according to Learn.

## Common mistakes

- Assuming Copilot Chat sees your SharePoint files without a license.
- Mixing personal and work accounts and expecting the same data.
- Quoting old product names in policies.

## Related

- [Microsoft 365 Copilot](https://www.m365.fm/entity/copilot/)
- [Microsoft 365 Copilot Chat](https://www.m365.fm/entity/copilot-chat/)
- [Enterprise data protection (Copilot)](https://www.m365.fm/entity/enterprise-data-protection/)

## Sources

- [Microsoft Learn: What is Microsoft Copilot?](https://learn.microsoft.com/copilot/overview)
- [Microsoft Learn: Which Copilot for your organization](https://learn.microsoft.com/en-ca/microsoft-365/copilot/which-copilot-for-your-organization)
- [Microsoft Learn: Copilot FAQ](https://learn.microsoft.com/en-ca/copilot/faq)
- [Microsoft Learn: License options for Microsoft Copilot](https://learn.microsoft.com/microsoft-365-copilot/microsoft-365-copilot-licensing)
- [Microsoft Learn: Microsoft Copilot overview](https://learn.microsoft.com/microsoft-365-copilot/microsoft-365-copilot-overview)
- [Microsoft Support: FAQ about Copilot in Microsoft 365 subscriptions](https://support.microsoft.com/en-us/microsoft-365-copilot/frequently-asked-questions-about-copilot-in-microsoft-365-subscriptions)
- [Microsoft Support: Updates to Copilot and the Microsoft 365 Copilot app](https://support.microsoft.com/en-us/microsoft-365-copilot/learning/changes-microsoft-copilot-app)
- [Microsoft: Microsoft 365 Copilot Chat](https://www.microsoft.com/en-us/microsoft-365-copilot/chat)
