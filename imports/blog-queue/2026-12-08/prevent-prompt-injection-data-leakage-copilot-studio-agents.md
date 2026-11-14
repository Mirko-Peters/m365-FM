---
title: "Prevent prompt injection and data leakage in Copilot Studio agents"
summary: "Which Copilot Studio controls Microsoft documents against prompt injection and data leakage: built-in protection, external threat detection, data policies, authentication defaults, the security scan and auditing."
status: review
publish: false
author: mirko-p
date: 2026-12-08
topics: [copilot-studio, prompt-injection, dlp]
keypoints:
  - "Microsoft says custom agents have built-in protection against user prompt injection (UPIA) and cross-domain prompt injection (XPIA). The pages I read do not list tuning options for it."
  - "External threat detection is an optional extra layer. It is called before each tool invocation and can allow or block it, and it only applies to generative agents."
  - "If the provider does not answer within one second, the agent allows the tool call by default. The error behavior can be switched to block."
  - "Keep secure defaults: Authenticate with Microsoft, end user credentials for tools and no organization-wide sharing. The security scan warns makers when they change these."
  - "Data policies in the Power Platform admin center govern connectors, knowledge sources, triggers and channels. Audit logs go to Microsoft Purview."
faq:
  - q: "Does Copilot Studio protect agents against prompt injection by default?"
    a: "According to Microsoft Learn, custom agents have built-in protection against user prompt-injection attacks and cross-domain prompt-injection attacks. The documentation I read describes the protection but gives no settings to tune it. The optional external threat detection feature adds a second, configurable layer."
  - q: "How does external threat detection work?"
    a: "Learn says every time the orchestrator considers invoking a tool, it sends data about the proposed use to the provider's endpoint. The provider returns allow or block. A blocked request stops processing and notifies the user. It is only called on generative agents that use generative orchestration, and the page labels the feature as preview."
  - q: "What happens if the threat detection provider is slow or down?"
    a: "The page states that if the agent gets no decision within one second by default, it proceeds to allow the tool to run. In the Power Platform admin center the Set error behavior option can be changed from Allow the agent to respond to Block the query."
  - q: "Which settings does the Copilot Studio security scan warn about?"
    a: "The security scan page lists three: setting authentication to No authentication, choosing Maker-provided credentials under Credentials to use, and sharing the agent with everyone in the organization. The defaults are Authenticate with Microsoft, End user credentials, and shared with no one."
  - q: "How can admins limit what data agents can reach?"
    a: "The security and governance page lists data policies in the Power Platform admin center that govern actions, connectors, knowledge sources, HTTP requests, triggers and channel publication. Admins can also disable publishing of generative AI agents, and review maker activity in Microsoft Purview audit logs."
---

No single switch stops prompt injection. Microsoft documents several layers for Copilot Studio: built-in protection against prompt injection, an optional external threat detection hook, secure defaults for authentication and credentials, data policies for connectors and knowledge sources, and audit logging. Use all of them and keep the defaults unless you have a reason to change them.

## What prompt injection means here

Prompt injection tries to make an agent follow instructions that did not come from its owner. Microsoft Learn separates two kinds: **user prompt-injection attacks (UPIA)**, where the user message contains the attack, and **cross-domain prompt-injection attacks (XPIA)**, where the attack sits in content the agent reads, such as a document, web page or tool output. Learn says custom agents have built-in protection against both. The pages I read describe this protection but do not list settings to tune it, so the controls below reduce what a successful attack can reach.

## Layer 1: Keep the secure defaults

Learn's security scan page says Copilot Studio automatically runs a security scan and warns makers before publishing when they change a secure default:

| Setting | Secure default | Risky choice that triggers a warning |
|---|---|---|
| Authentication | Authenticate with Microsoft | No authentication |
| Credentials to use | End user credentials | Maker-provided credentials |
| Sharing | Shared with no one | Everyone in the organization |

End user credentials matter for data leakage. Learn's FAQ says the system tailors responses based on who is speaking and the permissions they have. If a tool runs with the maker's credentials, a user can reach data through the agent that they cannot reach directly.

## Layer 2: Restrict data with data policies

The security and governance page lists data policy controls in the Power Platform admin center. They cover actions, connectors, Azure Bot Service skills, HTTP requests, triggers, channel publication and Application Insights. Admins can also restrict knowledge sources, and the FAQ says policies can control SharePoint, public websites or documents as knowledge sources at environment or tenant level.

Practical steps:

1. Review which connectors your agents depend on. Learn mentions connector dependency insights for this.
2. Block connectors that move data to services you do not trust.
3. Control whether agents can use public URLs as knowledge sources.
4. Consider disabling agent publishing in environments where it is not needed.

The FAQ adds that Copilot Studio supports sensitivity labels to prevent oversharing and data loss prevention endpoint filtering for SharePoint knowledge sources.

## Layer 3: Add external threat detection

For extra runtime oversight, Learn describes external threat detection. The page labels it as preview, so check the current status before you plan a rollout.

How it works:

- Every time the orchestrator considers invoking a tool, it sends data about the proposed tool use to a threat detection endpoint.
- The provider returns allow or block. A block stops processing and tells the user the message is blocked.
- It is only called on generative agents that use generative orchestration. Classic agents are skipped.

The shared data includes the user's recent prompt, chat history, outputs of earlier tools, agent and user identity, and the proposed tool with its reasoning and inputs. Learn warns that the provider's data handling can differ from Microsoft's, including processing outside your region, so confirm compliance before connecting.

Setup, as Learn describes it:

1. Register a Microsoft Entra application, for example with the `Create-CopilotWebhookApp.ps1` script, and configure its federated identity credential.
2. In the Power Platform admin center, select **Security** > **Threat detection** > **Additional threat detection**.
3. Select the environment and choose **Set up**.
4. Select **Allow Copilot Studio to share data with a threat detection provider**, enter the Entra app ID and endpoint, and set the error behavior.

You need the Power Platform Administrator role. The setting is per environment, with no tenant-wide option. If no decision arrives within one second, the tool call is allowed by default, so choose **Block the query** if that risk is too high.

## Layer 4: Audit and monitor

Learn lists maker audit logs in Microsoft Purview and agent activity alerts in Microsoft Sentinel. Agent 365 adds inventory and ownership context. Customer-managed keys encrypt Copilot Studio data when enabled.

## Common mistakes

- Sharing an agent with the whole organization before reviewing its knowledge sources.
- Using maker credentials for tools that read sensitive data.
- Assuming threat detection covers classic agents.
- Forgetting to enable threat detection for a new environment.
- Treating the built-in protection as a replacement for least privilege.

## What the pages do not cover

The pages I read do not name jailbreak settings, content moderation levels for tenants, or sharing controls beyond the scan warning. Verify those in the current Copilot Studio documentation before you promise them to stakeholders.

## A review checklist before publishing

1. Open the agent and confirm authentication is still **Authenticate with Microsoft**.
2. Check that tools and flows use end user credentials, not maker credentials.
3. List the knowledge sources and ask who can already read each one.
4. Confirm the sharing scope is a named group, not the whole organization.
5. Ask the admin whether data policies and, if used, external threat detection are enabled for the environment.
6. Test with a prompt that tries to override the agent's instructions, and record the result.

The last step is a practical habit, not a Microsoft requirement. It gives you evidence for your own risk review.

## Related

- [Copilot Studio](https://www.m365.fm/entity/copilot-studio/)
- [Prompt injection](https://www.m365.fm/entity/prompt-injection/)
- [Data loss prevention](https://www.m365.fm/entity/dlp/)

## Sources

- [Security and governance in Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/security-and-governance)
- [Copilot Studio security FAQ](https://learn.microsoft.com/en-us/microsoft-copilot-studio/security-faq)
- [Automatic security scan for Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/security-scan)
- [External threat detection for Copilot Studio agents](https://learn.microsoft.com/en-us/microsoft-copilot-studio/external-security-provider)
