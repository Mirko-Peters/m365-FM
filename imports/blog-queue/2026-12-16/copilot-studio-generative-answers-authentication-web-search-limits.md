---
title: "Copilot Studio Generative Answers: Lock Down Authentication and Web Search"
summary: "Control who can use an agent's generative answers and what it may ground on: authentication options, Require users to sign in, the Web Search toggle, ungrounded responses, node-level sources and moderation."
status: review
publish: false
author: mirko-p
date: 2026-12-16
topics: [copilot-studio, copilot-grounding, power-platform-admin-center]
keypoints:
  - "SharePoint, Dataverse and Copilot connector knowledge sources use the agent user's Microsoft Entra ID authentication, so the agent needs authentication configured."
  - "No authentication lets anyone with the link chat with the agent. A Power Platform data policy can require authentication."
  - "Use information from the web is the same control as Web Search. It searches public websites indexed by Bing and requires generative orchestration."
  - "Turn off Allow ungrounded responses so the agent blocks answers that did not use a knowledge source or tool, though this does not fully rule out general knowledge."
  - "Generative answers nodes can search only selected sources, and node-level moderation takes precedence over the agent level."
faq:
  - q: "Do I need authentication for SharePoint knowledge sources?"
    a: "Yes. Microsoft Learn says that for SharePoint, Dataverse or enterprise data with Copilot connectors you need to incorporate authentication, because the agent surfaces only content that the specific user can access. Authentication for Teams and SharePoint channels is set up automatically by Authenticate with Microsoft."
  - q: "What does No authentication allow?"
    a: "Learn warns that it allows anyone who has the link to chat and interact with the agent, and that you cannot control which users in your organization can chat with it. Access is limited to public information and resources."
  - q: "Where do I switch off web grounding?"
    a: "Learn says Use information from the web on the Generative AI settings page and Web Search in the Knowledge section of the Overview page are the same control. It searches public websites indexed by Bing, and it needs generative orchestration."
  - q: "Does turning off ungrounded responses stop all general knowledge?"
    a: "No. Learn says that with Allow ungrounded responses off, the agent blocks responses in a turn where it used no knowledge source or tool, and the fallback topic triggers. It adds that the model might still blend general knowledge with retrieved information."
  - q: "Which content moderation level is the default?"
    a: "High. Learn says levels range from Lowest to Highest, lower levels generate more answers that might contain harmful content, and the node-level setting takes precedence at runtime over the agent-level setting."
---

To lock down generative answers in Copilot Studio, configure authentication so knowledge sources respect each user's permissions, decide whether the agent may search the web, turn off ungrounded responses and restrict each generative answers node to the sources it needs. Microsoft documents each of these settings separately. The pages do not give a single hardening recipe, so the order below is a suggestion built from them.

## Step 1: Choose the authentication option

In the agent, go to **Settings** > **Security** > **Authentication**, choose an option and save. Changes take effect only after you publish.

| Option | What it means |
|---|---|
| No authentication | Users do not sign in. Anyone with the link can chat with the agent. Not available when a data policy requires authentication |
| Authenticate with Microsoft | Sets up Microsoft Entra ID authentication for Teams, SharePoint, Power Apps and Microsoft Copilot. Needed for the built-in Teams and Microsoft 365 channel |
| Authenticate manually | You configure the identity provider, for other channels. Provides `User.AccessToken` |

Learn says the agent user authentication means that the agent surfaces only content that the specific user can access. For SharePoint, Dataverse and Copilot connector sources, you need to incorporate authentication.

For manual authentication on knowledge sources, the generative answers page says to use the service provider type Microsoft Entra ID and to include delegated Microsoft Graph permissions `Files.Read.All` and `Sites.Read.All`. The authentication page advises setting only necessary scopes, following least privilege.

## Step 2: Require sign-in

With **Authenticate manually**, turn on **Require users to sign in** for agents that handle sensitive or restricted information. This adds a read-only system topic. Users who fail to sign in go to the Escalate topic. If it is off, the agent asks for sign-in only when a topic needs it. The setting is not available with No authentication or Authenticate with Microsoft, and a Power Platform data policy that requires authentication locks it.

Sharing control differs by option. With Authenticate with Microsoft, use agent sharing. With manual Microsoft Entra ID, turn on Require users to sign in to control access through sharing. With Generic OAuth 2 you cannot control specific users through sharing.

If your agent has tools that need user credentials, do not turn authentication off at agent level, because those tools stop working.

## Step 3: Decide on web grounding

**Use information from the web**, on the Generative AI settings page, and **Web Search**, in the Knowledge section of the Overview page, are the same control. When enabled:

- It triggers when a user's question might benefit from web information.
- It searches all public websites indexed by Bing, using Grounding with Bing Search.
- It runs in parallel with your configured public website sources, and results are interleaved with them.
- It requires generative orchestration.

If you want answers only from your own sources, keep it off. In a generative answers node, the page's recipe for custom-data-only answers keeps Web search and the general knowledge option off. For public websites you add as knowledge, the node page says you must confirm which websites your organization owns that Bing will search through Copilot Studio.

The pages I read do not describe a tenant-wide switch for web search. Check the admin documentation for your tenant.

## Step 4: Turn off ungrounded responses

**Allow ungrounded responses** is in the Knowledge section of the Generative AI settings and requires generative orchestration.

- **On:** the agent may answer from general knowledge even without using a source or tool.
- **Off:** the agent blocks any response in a turn where it used no knowledge source or tool, and the fallback topic triggers.

Learn is explicit that off does not guarantee the agent never uses general knowledge. The model might blend it with retrieved information. With the setting off, an answer can also be withheld if the model leaves out the citation.

## Step 5: Narrow the sources per node

In a generative answers node, **Search only selected sources**:

- **Off (default):** the node searches all agent-level knowledge sources, except sources you turned off.
- **On:** the node searches only the sources you select. They replace the agent-level set and there is no fallback to it. Trigger conditions are ignored for explicitly selected sources.

Sources defined in the node override agent-level sources. Use specific sources per node for tighter answers.

## Step 6: Set content moderation

Moderation applies at agent level (Generative AI settings), topic level (the generative answers node, via **Properties**) and prompt level. The node setting takes precedence at runtime. Levels range from Lowest to Highest, default High. Lower levels give more answers that might contain harmful content, and a strict level might return no answer.

## Step 7: Know the limits

- Knowledge sources in generative answers nodes do not support Bing Custom Search, Azure OpenAI or Custom Data. Use the Classic data option.
- Citations from a knowledge source cannot be used as inputs to other tools or actions.
- Tenant graph grounding with semantic search needs Authenticate with Microsoft, can add cost and requires a Microsoft 365 Copilot license in the tenant.
- Agents using Microsoft authentication cannot be embedded in Power BI reports with iframe-based visuals.
- Turning off authentication turns topics that use authentication variables into Unknown variables. Fix them before you publish.

## Quick checklist

1. Authentication on, with Require users to sign in for sensitive agents.
2. Only the Graph scopes the knowledge sources need.
3. Web Search off unless the use case needs it.
4. Allow ungrounded responses off.
5. Nodes restricted to selected sources.
6. Moderation level reviewed per node.
7. Test with a user who lacks access to a document and confirm it is not cited.

## Related

- [Copilot Studio](https://www.m365.fm/entity/copilot-studio/)
- [Copilot grounding](https://www.m365.fm/entity/copilot-grounding/)
- [Copilot web search](https://www.m365.fm/entity/copilot-web-search/)
- [Power Platform admin center](https://www.m365.fm/entity/power-platform-admin-center/)

## Sources

- [Knowledge sources summary (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-copilot-studio)
- [Use generative answers in a topic (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/nlu-boost-node)
- [Configure user authentication in Copilot Studio (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/configuration-end-user-authentication)
