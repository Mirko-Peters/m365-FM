---
title: "Purview Data Security Posture Management for AI: Secure Prompts and Grounding Data Step by Step"
summary: "What Microsoft Purview DSPM for AI covers, the prerequisites, how to review prompts and responses in Activity explorer, fix oversharing in grounding data, and how the classic version relates to the new DSPM."
status: review
publish: false
author: mirko-p
date: 2026-12-13
topics: [purview, dspm-for-ai, copilot, azure-ai-foundry]
keypoints:
  - "Microsoft Learn describes DSPM for AI (classic) as replaced by the new Data Security Posture Management, with no further investment in the classic version."
  - "Turn on Purview Audit first. Third-party AI sites also need the Purview browser extension and onboarded devices."
  - "One-click policies need at least 24 hours before data shows. Prompts and responses appear only with the right permissions."
  - "Data risk assessments find oversharing in grounding data. The default assessment covers the top 100 SharePoint sites by usage."
  - "Remediation options include restricting access by label, Restricted Content Discovery, auto-labeling and retention."
faq:
  - q: "Is DSPM for AI still the product to use?"
    a: "Microsoft Learn says the DSPM for AI (classic) article has been replaced by a new version that supports AI apps and agents and simplifies management. No improvements will be added to the classic version. The new Data Security Posture Management is in the Purview portal under Solutions > DSPM."
  - q: "What do I need before DSPM for AI shows data?"
    a: "Learn lists Microsoft Purview Audit turned on (on by default for new tenants), an account with compliance permissions such as the Compliance Administrator role, and Microsoft 365 Copilot licenses for Copilot and agent activity insights. For third-party AI sites you also need the Purview browser extension and onboarded devices."
  - q: "How often does the default data risk assessment run?"
    a: "According to Learn, the default assessment runs automatically and weekly for the top 100 SharePoint sites by usage. The first run has a 4-day delay before results display. Custom assessments are separate and their results expire after 30 days."
  - q: "Can I see the prompts users send?"
    a: "Activity explorer shows AI interaction events, and prompts and responses appear there only with the right permissions, per Learn. For Copilot in Fabric and Security Copilot, a recommendation to secure interactions is needed to capture prompts and responses. Without it only audit events are captured."
---

Securing AI use in Microsoft 365 has two sides. One is what users send into AI apps, the prompts. The other is the data those apps can reach, the grounding data. Microsoft Purview Data Security Posture Management for AI (DSPM for AI) is the place Microsoft describes for both. This article follows the Learn documentation and flags a naming change you should know about before you start.

## Which version are you looking at?

The Learn article on DSPM for AI is titled as the classic version. It says the classic version has been replaced by a new version that supports AI apps and agents, adds features and simplifies management, and that improvements will not be added to the classic version. The current product is named **Data Security Posture Management** and sits in the Microsoft Purview portal under **Solutions** > **DSPM**. It covers traditional apps and AI apps and agents, and consolidates data loss prevention, Insider Risk Management, sensitivity labels and Data Security Investigations.

The tenant you use may show either experience. The classic entry appears as **DSPM for AI (classic)**. Learn offers a task-mapping guide for people who know the old tasks. The steps below use the classic article for details and mention the newer pages where they differ.

## Prerequisites

From the classic article:

- The Microsoft Purview portal at purview.microsoft.com.
- An account with compliance permissions, for example the Microsoft Entra Compliance Administrator role.
- To create one-click policies that apply to all users, you must be an unrestricted administrator in terms of administrative units.
- **Microsoft Purview Audit** turned on. It is on by default for new tenants. Copilot and agent activity insights also need users assigned Microsoft 365 Copilot licenses.
- For third-party AI sites, the **Microsoft Purview browser extension** and **onboarded devices**.
- For item-level scanning, a registered Entra application and a one-time authentication.

The classic considerations article adds three prerequisites. Copilot in Fabric and Security Copilot need the enterprise version of Microsoft Purview data governance and a collection policy such as the one from **Secure interactions for Microsoft Copilot experiences**. Monitoring other AI apps in Edge needs an Edge configuration policy. For AI apps other than Microsoft 365 Copilot and Microsoft Facilitator, you must have set up pay-as-you-go billing, and the UI shows notices where this applies. Neither the classic nor the newer DSPM article lists license tiers. Both refer to the Microsoft Purview service description.

## Step 1: Review the overview and recommendations

In the classic experience go to **Solutions** > **DSPM for AI (classic)**. On **Overview**, keep **All AI apps** selected and work through the **Get started** actions: turn on Purview Audit, install the browser extension, onboard devices and extend insights for data discovery. Then open **Recommendations**. Examples named in the article include:

- Protect your data from potential oversharing risks.
- Protect your data with sensitivity labels.
- Protect items with sensitivity labels from Microsoft 365 Copilot and agent processing.
- Detect risky interactions in AI apps, using the Insider Risk Management Risky AI usage template.
- Secure interactions for Microsoft Copilot experiences and for enterprise apps.

Learn says to allow at least 24 hours for data collection and for changes to default settings to appear. Reports need at least one day of data.

## Step 2: Check what users are sending

**Activity explorer** is where prompts show up. It lists activity type and user, date and time, AI app category and app, the app accessed, sensitive information types and files referenced. Example activities are AI interaction, Sensitive info types and AI website visit. Learn says prompts and responses appear in AI interaction events only with the right permissions. The **Web queries** filter identifies AI interactions that include web queries.

Coverage depends on setup:

- Copilot in Fabric and Security Copilot: without the **Secure interactions for Microsoft Copilot experiences** recommendation, only audit events are captured, not prompts and responses.
- Entra-registered AI apps, the ChatGPT Enterprise connector and apps built on Microsoft Foundry: the **Secure interactions from enterprise apps** recommendation captures prompts and responses.
- Third-party AI sites such as Gemini and ChatGPT: the browser extension and device onboarding apply.

In the newer DSPM, the equivalent is **Discover** > **Activity explorer** > **AI activities** tab. It shows AI interactions, prompts and responses and whether they contained sensitive information, and when a DLP rule matched. The **AI observability** page gives an inventory of AI apps and agents with activity in the last 30 days.

## Step 3: Find oversharing in grounding data

Copilot and agents can only surface what users can already access, so oversharing becomes visible through AI. **Data risk assessments** address this. The default assessment runs automatically and weekly for the top 100 SharePoint sites by usage. The first run has a 4-day delay. It reports total items found, sensitive data detected and links that share data with anyone. The Microsoft 365 tab covers SharePoint and OneDrive oversharing insights and the Fabric tab covers Fabric workspaces. Fabric assessments need a one-time setup with an Entra-registered app first. A custom assessment's results do not update after the run, so Learn says to wait at least 48 hours and create a new assessment to see changes.

For a custom assessment, select **Create custom assessment** and choose users, data sources and scan level. Results expire after 30 days, and you can duplicate an assessment to rerun it. Item-level scanning flags items with external or anonymous sharing links and shows the label and owner. It is Microsoft 365 only, restricted to SharePoint sites, limited to 10 sites, and does not support OneDrive.

Limits for Microsoft 365 assessments: up to 200,000 items per location, and file counts may be inaccurate above 100,000 files per location.

## Step 4: Remediate

The **Protect** tab of an assessment offers these options, per the classic article:

- **Restrict access by label**, a DLP policy for Copilot and agents.
- **Restrict all items**, using SharePoint Restricted Content Discovery.
- **Create an auto-labeling policy** in Information Protection.
- **Create retention policies** for content not accessed for at least 3 years.

The **Monitor** tab shows items shared with anyone, everyone in the organization, specific people and externally, and offers to start a SharePoint site access review. For item-level findings, actions include Resolve, Apply sensitivity label, Notify the site owner and Remove sharing link. Learn says to use link removal sparingly.

## Step 5: Add policies

One-click policies apply to all users and are activated with a single click. **Extend your insights for data discovery** creates policies that collect information about users visiting third-party generative AI sites and sending sensitive information to them. A default policy such as **DSPM for AI - Unethical behavior in Copilot** is managed in its own solution, for example Communication Compliance. The Policies page does not show older retention policies for Teams chats and Copilot interactions. Create separate retention policies for Microsoft Copilot experiences to see them there.

## Supported AI apps

The classic article groups reports and Activity explorer into three categories:

- **Copilot experiences and agents:** the examples it gives are Microsoft 365 Copilots and Copilot Studio. The considerations article also names Microsoft 365 Copilot Chat, Security Copilot, Copilot in Fabric and Microsoft Facilitator.
- **Enterprise AI apps:** ChatGPT Enterprise, Entra-registered AI apps and applications built on Microsoft Foundry.
- **Other AI apps:** the supported third-party AI sites, such as those used for Gemini and ChatGPT.

For the current list of third-party sites, use Microsoft's page on supported AI sites for Purview, which I did not read.

## Common mistakes

- Expecting data on day one. Allow at least a day.
- Assuming audit is on in an older tenant without checking.
- Reading the default assessment as a full tenant scan, when it covers the top 100 sites by usage.
- Using link removal broadly without telling site owners.
- Treating the classic experience as the long-term home for new work.

## Related

- [Microsoft Purview](https://www.m365.fm/entity/purview/)
- [Data Security Posture Management for AI (DSPM for AI)](https://www.m365.fm/entity/dspm-for-ai/)
- [Microsoft 365 Copilot](https://www.m365.fm/entity/copilot/)
- [Azure AI Foundry](https://www.m365.fm/entity/azure-ai-foundry/)

## Sources

- [Microsoft Learn: Data Security Posture Management for AI (classic)](https://learn.microsoft.com/en-us/purview/dspm-for-ai)
- [Microsoft Learn: Considerations for deploying DSPM for AI (classic)](https://learn.microsoft.com/en-us/purview/dspm-for-ai-considerations)
- [Microsoft Learn: Data Security Posture Management in Microsoft Purview](https://learn.microsoft.com/en-us/purview/data-security-posture-management-learn-about)
