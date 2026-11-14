---
title: "Connect Claude to Power BI via MCP: Setup Options and Risks"
summary: "Which Microsoft MCP servers let an AI client query Power BI semantic models, what permissions they use, and which risks to review. Includes a note on what Microsoft's pages confirm about Claude."
status: review
publish: false
author: mirko-p
date: 2026-12-05
topics: [power-bi, mcp, claude, fabric-iq]
keypoints:
  - "Microsoft documents three Power BI related MCP servers: Authoring, Fabric IQ for consumption, and an older Power BI Consumption server."
  - "For questions over data, Microsoft recommends the Fabric IQ MCP server. The Authoring server is not meant for consumption scenarios."
  - "The pages read name GitHub Copilot as the example client. They do not confirm Claude, only that a client needs Streamable HTTP and OAuth 2.0."
  - "Queries run with the signed-in user's permissions, so row-level security applies. Service principals do not currently support RLS on the older server."
  - "MCP servers do not widen access, but results can travel to the client's LLM provider, so a security review is needed."
faq:
  - q: "Does Microsoft say that Claude works with the Power BI MCP servers?"
    a: "The Microsoft Learn pages I read do not name Claude. The Fabric IQ MCP page says a client must support Streamable HTTP and the required OAuth 2.0 flow, and may need a single-tenant Microsoft Entra app registration. Treat Claude as unconfirmed by Microsoft and test it in a non-production tenant."
  - q: "Which MCP server should be used to ask business questions about a semantic model?"
    a: "Microsoft Learn recommends the Fabric IQ MCP server for consumption. It is described as remote, read-only and able to find reports and semantic models, read metadata and run DAX queries. The older Power BI Consumption server is documented for existing integrations."
  - q: "What permissions does the Fabric IQ MCP server need?"
    a: "Microsoft Learn lists the delegated Power BI Service API permissions Item.Read.All and Item.Execute.All. Service principal and application-only authentication are not supported. Users see only what their own permissions allow, and RLS and OLS can return different results to different users."
  - q: "How many rows can a query return?"
    a: "According to the Fabric IQ MCP page, ExecuteQuery returns up to 250 rows by default and the maxRows setting can raise it. Results can still be truncated by Power BI query limits, and large results come back as an embedded CSV that not every client supports."
  - q: "Is it safe to expose a service principal to end users?"
    a: "Microsoft Learn warns about it for the older Power BI Consumption server. Service principal authentication does not currently support row-level security there, so the agent can reach all data the service principal is authorized for. Review this before you expose such an agent to end users."
---

Claude can only use Power BI data through MCP if the client supports what Microsoft's servers require. Microsoft documents three Power BI related MCP servers, and for asking questions over existing reports and semantic models it recommends the Fabric IQ MCP server. The pages I read do not mention Claude by name. They describe the protocol requirements, so any setup with Claude is something to test, not something Microsoft confirms.

## Pick the right server first

Microsoft Learn's overview separates the servers by job.

| Server | Job | Status per Learn |
|---|---|---|
| Power BI Authoring MCP server | Create, change and document semantic models | Hosted: preview. Local: generally available |
| Fabric IQ MCP server | Answer business questions over Power BI reports and semantic models | Page describes it as generally available |
| Power BI Consumption MCP server (earlier) | Legacy consumption, for existing integrations | Preview, legacy |

Microsoft states that the Authoring server should not be used for consumption. It can run DAX to validate a model, but it is not designed to answer business questions for end users.

## Option A: Fabric IQ MCP server (consumption)

The server is remote and read-only. The agent chooses the tools, writes the DAX and explains the result. The endpoint is:

`https://fabriciq.svc.cloud.microsoft/v1/mcp/fabriciq`

Organizations with private links use `https://api.fabric.microsoft.com/v1/mcp/fabriciq`.

**Prerequisites from Microsoft Learn:**

- A tenant whose home region supports all Fabric workloads. Power BI-only regions and sovereign clouds are not supported.
- A Microsoft Entra work or school account.
- Access to at least one supported report or semantic model. No workspace role, Build permission or item IDs are required. A name or browser URL is enough.

**Client requirements:** Streamable HTTP, the OAuth 2.0 flow, and a runtime call to `tools/list`. Depending on the client, a single-tenant Entra app registration with the delegated permissions `Item.Read.All` and `Item.Execute.All` may be needed. The page's example client is GitHub Copilot CLI, which uses a preregistered app. Do not add an Authorization header, because a configured bearer token overrides interactive sign-in.

**Tools:** DiscoverArtifacts, ResolveFabricItem, GetReportMetadata, GetSemanticModelSchema, ValueSearch and ExecuteQuery. Microsoft says `tools/list` is the authoritative source.

**Verify in three steps:**

1. Connect and confirm the six tools appear.
2. Ask the agent to find a known report by name.
3. Ask a simple aggregate question and check that the generated DAX and the answer make sense.

## Option B: the earlier Power BI Consumption server

Learn documents it for existing integrations and points new work to Fabric IQ. The endpoint is `https://api.fabric.microsoft.com/v1/mcp/powerbi`. A Power BI admin must enable the tenant setting **Users can use the Power BI Model Context Protocol server endpoint (preview)**, and users need Build permission on the model. The page documents Visual Studio Code with GitHub Copilot and does not mention Claude. Its **Generate Query** tool uses Copilot in Power BI, needs a Copilot license and consumes Copilot capacity.

## Risks to review before connecting

**Permissions and RLS.** Queries run as the signed-in user, and row-level security applies. On the earlier server, service principal authentication does not currently support RLS. That is a data exposure risk if end users reach an agent that runs under a service principal.

**Data leaves Power BI.** Learn says MCP servers do not expand data access, but they move data. Metadata, schemas and query results go to the MCP client, which may forward them to the configured LLM provider. Govern this under your AI data-handling policy and the provider's terms.

**Compliance boundaries.** Microsoft notes that these integrations may interact with clients or services that process data outside Microsoft Fabric's compliance boundaries. The organization must confirm that each integration meets its regulatory and contractual duties.

**Write access on the Authoring server.** Clients act with the user's Fabric RBAC rights. Learn warns that an autonomous or misconfigured client might perform destructive actions, and that safeguards such as flags blocking destructive operations are not standardized in MCP and not supported by every client. Use least-privilege roles.

**Answer quality.** The earlier server page lists limits: complex DAX may not translate well from natural language, large models can produce large schema payloads, and each query runs independently. Preparing data for AI, with AI instructions and verified answers, is recommended there.

**Result limits and freshness.** Fabric IQ returns 250 rows by default, and data reflects the latest successful refresh. Users should not treat a truncated or stale result as the full picture.

## A cautious rollout

1. Start with a test workspace and a model that has RLS roles.
2. Test with two users who have different RLS roles and compare answers.
3. Keep the Authoring server out of end-user clients.
4. Document which LLM provider receives query results.
5. Review Entra consent settings, since tenant admins can restrict user consent for the delegated permissions.

## Authoring server: local or hosted

If the goal is to build or document models rather than ask questions, the Authoring server is the one to look at. Microsoft Learn describes it as able to create and change tables, columns, measures, relationships, calculation groups, translations and security roles, to run DAX for validation, and to work with TMDL and PBIP files.

- **Hosted (preview):** nothing to install, and Microsoft manages updates. The endpoint is `https://api.fabric.microsoft.com/v1/mcp/powerbi/authoring`.
- **Local (generally available):** runs on your machine over `stdio`. It adds Power BI Desktop, PBIP files on disk, service principal authentication, transactions and traces.

Learn describes a common pattern: build and document a model with the Authoring server, then expose it to other people through Fabric IQ. That keeps write-capable tooling with the model owners and read-only access with everyone else.

## Questions for a security review

Learn calls MCP a new standard and recommends a review that covers the MCP servers, the client or agent, and the model provider behind it. A short list to start with:

- Which client will connect, and does it support the OAuth 2.0 flow without a stored bearer token?
- Which model provider will see schemas and query results?
- Which semantic models carry sensitive data, and do they have RLS or OLS?
- Who may consent to the delegated permissions in Entra?
- Who owns the review when Microsoft changes a preview feature?

## Related

- [Power BI](https://www.m365.fm/entity/power-bi/)
- [Model Context Protocol](https://www.m365.fm/entity/mcp/)
- [Fabric IQ](https://www.m365.fm/entity/fabric-iq/)
- [Row-level security](https://www.m365.fm/entity/row-level-security/)

## Sources

- [Power BI MCP servers overview (Microsoft Learn)](https://learn.microsoft.com/en-us/power-bi/developer/mcp/mcp-servers-overview)
- [Fabric IQ MCP server (Microsoft Learn)](https://learn.microsoft.com/en-us/fabric/iq/connectors/fabric-iq-mcp)
- [Power BI Consumption MCP server: get started (Microsoft Learn)](https://learn.microsoft.com/en-us/power-bi/developer/mcp/remote-mcp-server-get-started)
