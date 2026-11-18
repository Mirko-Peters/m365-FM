---
title: "AssistPro and ScriptPro: Nerdio's GenAI assistants explained"
summary: "AssistPro appeared in private preview in February 2024 and as a public preview in April 2024. In Nerdio Manager for Enterprise it is Nerdio Copilot from 6.4.0; this article sorts out names, deployment, cost and data handling."
status: review
publish: false
author: mirko-p
date: 2026-11-18
render: v2
topics: [nerdio-assistpro, nerdio-manager-for-enterprise]
keypoints:
  - "Names depend on the product: NME lists AssistPro in v5.7, Nerdio Copilot from v6.4.0 and Analytics Pro in v7.0.0. Nerdio Manager for MSP still documents AssistPro, with changes in v7.4.0 and v7.4.1."
  - "Our reading is that in NME, Copilot took over AssistPro's job. Nerdio's release notes and help pages do not announce a rename, and nothing shows the MSP product's AssistPro being retired."
  - "NME Copilot is enabled under System > Settings > Nerdio and runs on Azure OpenAI in your own tenant. Cost depends on tokens; Nerdio says an enabled but unused Copilot has no standing cost."
  - "The deployment type is a data-location choice: Learn says Global Standard can process prompts in any geography where the model is deployed, Data Zone Standard only inside the chosen zone."
  - "Nerdio pages describe AssistPro's status differently (private preview, public preview, generally available), so confirm it with Nerdio before you plan around it."
faq:
  - q: "Is AssistPro still a separate product from Nerdio Copilot?"
    a: "It depends on the product. In Nerdio Manager for Enterprise the release notes list Nerdio Copilot from v6.4.0 (September 2024), and the Copilot help page does not mention AssistPro. In Nerdio Manager for MSP, AssistPro is still documented (help page dated 13 October 2026) and its release notes record changes on 21 and 27 October 2026 (v7.4.0 and v7.4.1), so it is still maintained there. Nerdio's release notes and help pages do not announce a rename; treating Copilot as the NME counterpart of AssistPro is our reading."
  - q: "Does the assistant change my AVD environment for me?"
    a: "The Copilot help page describes generated scripts and KQL queries as text you copy, and says they must be tested and validated manually before production. It does not describe the assistant running a script or changing a host pool."
  - q: "Does my data leave my Azure tenant?"
    a: "Nerdio's page says Azure OpenAI is deployed as a private resource in your tenant and that data does not leave it. Microsoft Learn adds that Global Standard deployments may process prompts and responses in any geography where the model is deployed, and describes an abuse-monitoring store for human review of flagged content. Read both before choosing a deployment type."
---

AssistPro and ScriptPro are the names Nerdio used in 2024 for two generative AI assistants. [AssistPro](https://www.m365.fm/entity/nerdio-assistpro/) appeared in private preview in February 2024 and answers support and how-to questions from Nerdio's documentation; ScriptPro was announced in April 2024, when AssistPro became a public preview, for writing scripted actions. In [Nerdio Manager for Enterprise](https://www.m365.fm/entity/nerdio-manager-for-enterprise/) the current help center documents Nerdio Copilot, which includes Script Pro and AnalyticsPro for KQL queries. In Nerdio Manager for MSP, AssistPro remains the documented name.

## Which name belongs to which source

| Source | Name used | What it states |
|---|---|---|
| NME release notes archive, v5.7 (13 February 2024) | "Nerdio AssistPro: Private Preview (Premium)" | AssistPro enhances support by retraining on NME knowledge-based articles and uses a generative large language model. |
| Nerdio blog, 2 April 2024 (NME 6.0 and NMM 5.0) | AssistPro (public preview), ScriptPro (coming soon) | AssistPro "is aware of Nerdio Management documentation" and answers questions without a service request. ScriptPro generates scripted actions. |
| NMM release notes, v5.0 (2 April 2024) and v5.2 (26 June 2024) | AssistPro | v5.0: "AssistPro is now in Public Preview!" v5.2: "AssistPro: Now Generally Available." |
| NME archive, v6.4.0 (Preview, 19 September 2024) | Nerdio Copilot | "an AI-based assistant to quickly search for information about Nerdio Manager, its features, and functions". v6.5.0 lists a new version of Copilot. |
| NME archive, v6.7.0 (Preview, 30 January 2025) | ScriptPro (Public Preview) | "Nerdio Manager Copilot now includes Script Pro". |
| NME archive, v7.0.0 (Preview, 8 April 2025) | "Nerdio Manager AI: Analytics Pro (Public preview)" | Generates Kusto Query Language (KQL) queries from natural language input. |
| NME archive, v7.7.0 (Preview, 6 April 2026) | Nerdio Manager Copilot | "Completely refactored", with a new UI and a deployment that needs a single Azure OpenAI resource. |
| Nerdio blog, 5 May 2026 (NME 8.0) | Nerdio Copilot | Calls it a "reintroduction" of Copilot. |
| NME help, "Manage Nerdio Copilot" | Nerdio Copilot, with Script Pro and AnalyticsPro | Says Copilot "has been completely rebuilt and refactored in NME 8.0". |
| NMM release notes, v7.4.0 (21 October 2026) and v7.4.1 (GA, 27 October 2026) | AssistPro | v7.4.0: "AssistPro now runs on Azure AI Foundry deployed AI Models instead of a deprecated OpenAI model"; "AssistPro remains a preview feature". v7.4.1: fixes a "too many requests" error shown for every prompt. |

Our reading is that in NME the Copilot took over AssistPro's job: the first Copilot entry (v6.4.0) describes an assistant for searching information about Nerdio Manager, and v6.7.0 says Copilot now includes Script Pro. No release note or help page says "renamed" or "replaced", though, and the MSP release notes show AssistPro still being updated, so the two names should not be treated as one product everywhere.

One more detail does not line up: the release notes archive places the refactor in a 7.7.0 preview, while the help page says NME 8.0, and Nerdio does not reconcile the two.

If you deployed Copilot in NME 7.7 or earlier, the help page says to remove the legacy version before enabling the new one. In Nerdio Manager go to **System > Settings > Nerdio**, expand the **Nerdio Manager Copilot** section, select **Configure**, and confirm with **OK** to remove the resources that supported the legacy version.

## AssistPro in Nerdio Manager for MSP

The MSP help page describes AssistPro as a chatbot that uses Azure OpenAI to answer questions about Nerdio Manager. It is deployed at the MSP level: go to **System > System Settings > Integrations**, select **Deploy** in the AssistPro area, name the resources and select **OK**. The page notes that Microsoft requires the subscription to be whitelisted for OpenAI, and that the feature is in private preview and needs Nerdio's team to enable it. Users then open it from the AssistPro icon in the upper-right corner.

The v7.4.0 release note (21 October 2026) says AssistPro now runs on models deployed through Microsoft Foundry (the note's own wording is "Azure AI Foundry") instead of a deprecated OpenAI model, which resolves new AssistPro deployment failures, and that AssistPro remains a preview feature. The v7.4.1 note (27 October 2026) fixes an "AI service is receiving too many requests" error shown for every prompt with a Foundry model.

## What each assistant does in NME

Nerdio's Copilot page describes three jobs:

- **Documentation answers (the AssistPro-style job).** Copilot searches for information about Nerdio Manager. It caches the Nerdio Help Center articles and refreshes the cache daily. **Citations** lists the knowledge base articles behind an answer.
- **Script Pro.** You describe a script in chat, answer follow-up prompts, and copy the code. Nerdio's example prompt asks for a script that sets a registry key on a Windows VM. A warning says every AI-generated script must be tested and validated manually before production.
- **AnalyticsPro.** It turns a natural-language question into a KQL query that you run in your Azure Log Analytics workspace. Nerdio's example asks for the number of active users in the past hour. The same validation warning applies.

The v7.7.0 note adds multiple chats, saved user memories and GPT-5 mini support. The v8.1.0 note (Public Preview, 21 July 2026) adds several scripts or queries per prompt, chat context kept between sessions for 30 days, and visible logging of agent actions.

Version 8.2.1 (GA, 29 September 2026) lists Nerdio Manager MCP support, a read-only **Public Preview** for external AI agents, enabled under **System > Settings > Integrations > Model Context Protocol** according to Nerdio's MCP Connector page; the release note adds that equivalent AI functionality is available natively through Copilot.

## How Copilot is deployed

1. In Nerdio Manager, go to **System > Settings > Nerdio**, expand **Nerdio Manager Copilot**, and select **Enabled**.
2. Choose a **Resource group** for the resources Copilot needs.
3. Choose a **Model** from the drop-down, "based on available quotas".
4. Choose a **Deployment type**: Data Zone Standard or Global Standard. The v8.1.0 note says the types are read from your subscription during the first deployment, and only those available for the selected model and region are shown.
5. Select **OK**. The deployment task takes about 2 to 5 minutes depending on the Azure region; follow it in **Tasks**.
6. Open Copilot from the icon in the upper-right corner of Nerdio Manager.

Azure OpenAI availability varies by region; by default all resources go to the same region, though the Azure OpenAI resources can be created elsewhere. The v7.7.0 note quotes about 30 seconds; plan with the help page's 2 to 5 minutes.

Nerdio's Responsible AI Notice page says Azure requires one user in each tenant to accept the Azure Responsible AI Notice before any Azure AI service can be used. The Copilot page does not list this as a prerequisite, so check your tenant. Disabling Copilot removes all deployed Azure resources except the Smart detector alert rule and takes about 2 to 3 minutes.

## What it costs

For the current Copilot, Nerdio says cost depends on usage: it is per token, varies with the chosen model, and an enabled but unused feature has no standing cost. The refactor's release note lists "Zero idle costs".

The AssistPro help page takes a different approach and lists seven paid Azure components: App Service, Application Insights, an Azure Cosmos DB account, Key Vault, a Log Analytics workspace, Azure OpenAI and Azure AI Search. Azure AI Search on the basic tier is priced there at $0.11 per hour, about $80 per month, and Cosmos DB at $25 for 1 GB at 500 RU/s. Nerdio's estimate for an out-of-the-box setup with up to 7 users, as of version 5.7, is $110 to $120 a month. Nerdio calls these estimates. Since v7.4.0 moved AssistPro to models deployed through Microsoft Foundry, check with Nerdio whether those figures still apply. They describe the AssistPro deployment, not Copilot.

## Where your data goes

Nerdio's "Data Security and Privacy with Azure OpenAI in Nerdio Manager" says Azure OpenAI is deployed as a private resource in your own tenant, that there is no exchange of data with public models such as ChatGPT, and that "Microsoft does not store, review, or extract data from these interactions".

Microsoft Learn's "Data, privacy, and security for Foundry Models sold by Azure in Microsoft Foundry" says prompts and completions are not available to other customers or to OpenAI, and are not used to train any generative AI foundation models without your permission or instruction. It also describes abuse monitoring: for human review, prompts and completions are stored in a data store logically separated by customer resource, and human reviewers can access them only when the monitoring system has flagged them or when they are part of a potentially abusive pattern of use. If Microsoft has approved modified abuse monitoring, that storage and human review are not performed, although automated review may still run. The v8.1.0 note adds that Copilot now conforms to Azure Data Loss Prevention standards for Foundry Tools.

Location follows the deployment type you pick. Learn's "Understanding deployment types in Microsoft Foundry Models" says that for Global deployments the service can process prompts and responses in any geography where the model is deployed. For Data Zone types it processes data only within the specified zone: US, EU or Asia Pacific. Data stored at rest remains in the designated Azure geography.

If prompts could contain customer names, hostnames or sensitive script content, ask your security team to compare Nerdio's statement with Learn's description of abuse monitoring before choosing a deployment type. The AssistPro page adds that users cannot control what data it stores.

## Status, edition and access: what remains open

- **AssistPro status.** Nerdio pages say different things. NME v5.7 (2024): "Private Preview (Premium)". The April 2024 blog and NMM v5.0: public preview. NMM v5.2 (June 2024): "Now Generally Available". The MSP help page (13 October 2026): private preview, enabled by Nerdio's team. NMM v7.4.0 (21 October 2026): "remains a preview feature". We cannot say which applies to your tenant; confirm with Nerdio.
- **Copilot status.** The current Copilot help page carries no preview label. Release labels apply to a whole release: the refactor (7.7.0) and the 8.1.0 additions first appeared in preview releases, and 8.1.1 and later 8.1.x releases are labelled GA.
- **Edition.** NME v5.7 marks AssistPro as Premium, and Nerdio's enterprise pricing page lists "Nerdio AI Copilot and Analytics Pro" among its platform and automation features. Confirm with Nerdio which edition includes it.
- **Access.** The AssistPro page lists as limitations that only accounts assigned to the AVD admin role can interact with AssistPro and that Reviewer accounts see the option but it does not load; for v5.0 it adds a maximum of 7 simultaneous users. The Copilot page states no role requirement or user limit.
- **Limits.** The companion article "Using AI assistants for AVD operations: benefits and limits" covers the Copilot limitations and output review.

Nerdio Copilot is not Microsoft 365 Copilot; it is a chat assistant inside Nerdio Manager.

## Related

- [Nerdio AssistPro](https://www.m365.fm/entity/nerdio-assistpro/)
- [Nerdio Manager for Enterprise](https://www.m365.fm/entity/nerdio-manager-for-enterprise/)
- [Nerdio scripted actions](https://www.m365.fm/entity/nerdio-scripted-actions/)
- [Azure OpenAI](https://www.m365.fm/entity/azure-openai/)
- [KQL](https://www.m365.fm/entity/kql/)

## Sources

- [Nerdio Help: Manage Nerdio Copilot](https://nmehelp.getnerdio.com/hc/en-us/articles/30352365570957-Manage-Nerdio-Copilot)
- [Nerdio Help (Nerdio Manager for MSP): Overview of AssistPro](https://nmmhelp.getnerdio.com/hc/en-us/articles/25498285239565-Overview-of-AssistPro)
- [Nerdio Help (Nerdio Manager for MSP): NMM Release Notes](https://nmmhelp.getnerdio.com/hc/en-us/articles/360055385832-NMM-Release-Notes)
- [Nerdio Help: Data Security and Privacy with Azure OpenAI in Nerdio Manager](https://nmehelp.getnerdio.com/hc/en-us/articles/32928743596045-Data-Security-and-Privacy-with-Azure-OpenAI-in-Nerdio-Manager)
- [Nerdio Help: Azure Responsible AI Notice](https://nmehelp.getnerdio.com/hc/en-us/articles/29088984944269-Azure-Responsible-AI-Notice)
- [Nerdio Help: Nerdio Manager MCP Connector](https://nmehelp.getnerdio.com/hc/en-us/articles/49256623957133-Nerdio-Manager-MCP-Connector)
- [Nerdio Help: Release Notes](https://nmehelp.getnerdio.com/hc/en-us/articles/19837802929677-Release-Notes)
- [Nerdio Help: Release Notes Archive](https://nmehelp.getnerdio.com/hc/en-us/articles/48964190328205-Release-Notes-Archive)
- [Nerdio blog: Unveiling Nerdio Manager for Enterprise 6.0 and MSP 5.0 (2 April 2024)](https://getnerdio.com/blog/unveiling-nerdio-manager-for-enterprise-6-and-nerdio-manager-for-msp-5/)
- [Nerdio blog: What's new in Nerdio Manager for Enterprise 8.0 (5 May 2026)](https://getnerdio.com/blog/whats-new-in-nerdio-manager-for-enterprise-8-0-powering-the-windows-cloud-with-hybrid-ai)
- [Nerdio: Enterprise pricing](https://getnerdio.com/pricing/enterprise/)
- [Learn: Understanding deployment types in Microsoft Foundry Models](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/deployment-types)
- [Learn: Data, privacy, and security for Foundry Models sold by Azure in Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/responsible-ai/openai/data-privacy)
