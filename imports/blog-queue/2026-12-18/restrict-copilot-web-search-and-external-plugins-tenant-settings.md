---
title: "Restrict Web Search and Third-Party Plugins in Microsoft 365 Copilot Tenant Settings"
summary: "How admins limit Copilot web grounding with the Allow web search in Copilot policy and block external publisher agents and plugins in the Microsoft 365 admin center, with the paths, options and limits Microsoft documents."
status: review
publish: false
author: mirko-p
date: 2026-12-18
topics: [copilot, copilot-web-search, copilot-governance, agent-registry]
keypoints:
  - "Web search is controlled by the Allow web search in Copilot policy in the Cloud Policy service, not by a toggle on the Copilot settings page."
  - "The policy has three options, including one that disables web search in Work mode but keeps it in Web mode and Copilot Chat."
  - "If the policy is not configured, web search is available unless optional connected experiences in Office are disabled."
  - "Block external publisher content with Agents > Settings > Agent and plugin access, and limit who can use agents with Agents > Settings > User access."
  - "Blocking a plugin does not necessarily revoke consent, remove indexed connector data or stop a remote service."
faq:
  - q: "How do I turn off web search for Microsoft 365 Copilot?"
    a: "According to Microsoft Learn, use the Allow web search in Copilot policy in the Cloud Policy service for Microsoft 365. It applies to Microsoft Copilot and Copilot Chat. Choose the disabled option to switch web search off, and users then see the Web content toggle dimmed."
  - q: "What happens if I never configure the web search policy?"
    a: "Microsoft Learn says web search is available to users in both services, unless Allow the use of additional optional connected experiences in Office is set to Disabled. In US government clouds (GCC and DoD) web search is off by default and stays off until the policy is configured."
  - q: "Does the Microsoft data protection agreement cover web search queries?"
    a: "Microsoft Learn says the Microsoft Products and Services DPA does not apply to generated web search queries, and HIPAA compliance and the EU Data Boundary do not apply to them either. The page also says the queries are treated as customer confidential information and are not used to train foundation models."
  - q: "How do I stop users installing agents and plugins from external publishers?"
    a: "Microsoft Learn describes three toggles under Agents, Settings, Agent and plugin access: built by Microsoft, built by your organization and built by external publishers. A disabled option hides that type from the Agent store. Users still see Microsoft-built items when that toggle is off, but cannot install them."
  - q: "Does blocking a plugin remove its access to my data?"
    a: "Not necessarily. Microsoft Learn warns that blocking or uninstalling a plugin does not necessarily stop a remote service, revoke consent, remove indexed connector data or prevent another plugin from using the same MCP server or connector, so check the documented effect of each action."
---

Two separate controls limit what Microsoft 365 Copilot can reach outside your tenant. Web search is governed by the **Allow web search in Copilot** policy. Third-party agents and plugins are governed by settings on the **Agents** page of the Microsoft 365 admin center. Neither is a single master switch, and each has side effects worth knowing before you change it.

## Part 1: Restrict web search (web grounding)

### What it does

Learn describes web search as an optional feature that lets Copilot ground answers in current web content. Copilot builds a short query and sends it to Bing. The query is not the full prompt unless the prompt is very short. It does not include whole files or Entra identifiers such as username, domain or tenant ID. It does include the client IP address, which Bing uses to localize results.

### The policy

The policy is **Allow web search in Copilot**, available in the Cloud Policy service for Microsoft 365. Learn links to the Cloud Policy overview but gives no click path on the web search page. It applies to Microsoft Copilot and Copilot Chat. When enabled, you pick one of three options:

1. Enabled in Microsoft Copilot and Microsoft Copilot Chat.
2. Disabled in Microsoft Copilot and Microsoft Copilot Chat.
3. Disabled in Microsoft Copilot Work mode, enabled in Microsoft Copilot Web mode and Microsoft Copilot Chat.

### What users see

| Configuration | Result |
|---|---|
| Policy disabled | The **Web content** toggle is dimmed and users cannot turn web search on |
| Policy enabled | Users can still turn web search off with their own toggle |
| Option 3 | Web search is also disabled in Researcher and Cowork |
| Policy not configured | Web search is available, unless optional connected experiences in Office are disabled |
| GCC and DoD | Off by default, and stays off until the policy is configured |

Turning off optional connected experiences in Microsoft 365 apps does not by itself stop web search in every case, according to Learn. Check the policy, not only the connected experiences setting.

### Data handling points to tell your compliance team

- Prompts and responses stay in the Microsoft 365 service boundary, and enterprise data protection applies to them.
- The generated queries sent to Bing are treated as customer confidential information and are not used to improve Bing, build ad profiles or train foundation models.
- The Microsoft Products and Services DPA does not apply to generated web search queries. HIPAA compliance and the EU Data Boundary do not apply either.
- Admins can audit the exact queries through audit log activities, Copilot interaction events in the Office 365 Management API, eDiscovery, and Activity explorer in Purview DSPM for AI.

The Learn page does not say how long a policy change takes to apply.

## Part 2: Restrict third-party agents and plugins

### Agent and plugin access

In the Microsoft 365 admin center go to **Agents** > **Settings** > **Agent and plugin access**. Learn lists three toggles:

- Allow agents and plugins built by Microsoft.
- Allow agents and plugins built by your organization.
- Allow agents and plugins built by external publishers.

A disabled option hides that type from the Agent store. Users still see Microsoft-built items when that option is off, but they cannot install them. Plugins here include tools, MCP servers, connectors and skills.

### User access

Go to **Agents** > **Settings** > **User access** and choose **All users** (the default), **No users**, or **Specific users or groups**, then save. Other users with install permissions in the Agent Registry still cannot use agents and plugins unless they are selected.

Learn adds a warning: data processed by non-Microsoft services is not covered by Microsoft agreements. Review each publisher's terms and your own policies before allowing access.

### Sharing

The **Sharing** setting controls who can share agents across the organization, with options All users, No users or Specific users. Learn says it applies only to agents built with Microsoft Copilot Agent Builder. Choosing No users still allows direct sharing with specific individuals.

### Block a single plugin or agent

For plugins, the Copilot extensibility governance page gives these paths:

| Goal | Path |
|---|---|
| Change who can use a plugin | **Agents** > **Tools** > **Plugins** > **Users** |
| Respond to access requests | **Agents** > **Tools** > **Requests** |
| Stop use across the organization | **Agents** > **Tools** > **Plugins**, then block |

For agents, the Agent Registry lets you search shared agents and block those deemed unsafe or noncompliant, and review publish requests. Learn says members can only access agents you have allowed.

### Limits of blocking

Learn warns that blocking or uninstalling a plugin does not necessarily stop a remote service, revoke consent, remove indexed connector data, or prevent another plugin from using the same MCP server or connector. In Cowork, blocking applies to new conversations, and conversations already using the plugin continue until they end. Test access in a new conversation after any change.

Researcher and Analyst are part of the core Copilot chat experience and do not fall under agent settings.

## A practical order

1. Decide whether web search is allowed, and set the Cloud Policy option.
2. Turn off external publisher access, or restrict user access to a pilot group.
3. Review the Agent Registry for agents already shared.
4. Test with an allowed and a non-allowed user in a new conversation.
5. Record the settings, exceptions and an owner.

## Typical mistakes

- Looking for a web search toggle on the Copilot settings page.
- Assuming connected experiences settings fully control web search.
- Expecting the Sharing setting to cover agents that were not built with Microsoft Copilot Agent Builder.
- Expecting a block to delete consent or indexed data.
- Testing in an old conversation.

## What the sources do not say

The pages read do not name the admin roles needed for agent settings, do not give propagation times for the web search policy, and do not define Work mode and Web mode beyond the policy options.

## Related

- [Microsoft 365 Copilot](https://www.m365.fm/entity/copilot/)
- [Copilot web search](https://www.m365.fm/entity/copilot-web-search/)
- [Copilot governance](https://www.m365.fm/entity/copilot-governance/)
- [Agent registry](https://www.m365.fm/entity/agent-registry/)

## Sources

- [Manage web search for Microsoft Copilot and Copilot Chat](https://learn.microsoft.com/en-us/copilot/microsoft-365/manage-public-web-access)
- [Agent settings in the Microsoft 365 admin center](https://learn.microsoft.com/microsoft-agent-365/admin/agent-settings)
- [Manage agents in the Microsoft 365 admin center](https://learn.microsoft.com/microsoft-365/admin/manage/manage-copilot-agents-integrated-apps)
- [Governing Microsoft 365 Copilot plugins](https://learn.microsoft.com/microsoft-365-copilot/extensibility/manage)
