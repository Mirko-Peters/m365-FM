---
title: "Connect Foundry agents to Azure AI Search with hybrid retrieval"
summary: "How to connect a Microsoft Foundry agent to an Azure AI Search index: index prerequisites, the project connection, keyless roles, query types including hybrid, and the networking and single-index limits Microsoft documents."
status: review
publish: false
author: mirko-p
date: 2026-12-10
topics: [azure-ai-foundry, azure-ai-search, ai-agent, hybrid-search]
keypoints:
  - "The index needs searchable text fields, searchable vector fields, a retrievable content field to cite and a retrievable source URL field for links."
  - "Add the connection under Connected resources in the project. For keyless auth, give the Foundry account's managed identity Search Index Data Contributor and Search Service Contributor."
  - "The tool defaults to query_type vector_semantic_hybrid and top_k 5. Supported types are simple, vector, semantic, vector_simple_hybrid and vector_semantic_hybrid."
  - "Hybrid search runs full-text and vector queries in parallel and merges them with Reciprocal Rank Fusion. Semantic ranking is an optional add-on."
  - "The tool can target only one index, needs the same tenant, and private search resources need the standard agent with virtual network injection and keyless authentication."
faq:
  - q: "What must the Azure AI Search index contain?"
    a: "Microsoft Learn lists one or more Edm.String fields that are searchable and retrievable, one or more Collection(Edm.Single) vector fields that are searchable, at least one retrievable text field with the content to cite, and a retrievable field with a source URL so citations can include a link."
  - q: "Which roles does the Foundry managed identity need?"
    a: "For keyless authentication, Learn says to use the system-assigned managed identity of the Foundry account that contains your project and assign Search Index Data Contributor and Search Service Contributor on the search service."
  - q: "What is the default query type?"
    a: "Learn says query_type defaults to vector_semantic_hybrid and top_k defaults to 5. Supported values are simple, vector, semantic, vector_simple_hybrid and vector_semantic_hybrid. The filter parameter applies to all queries the agent makes to the index."
  - q: "What does hybrid search do?"
    a: "Learn describes hybrid search as a single query request with both search and vectorQueries that runs full-text and vector search in parallel and merges results with Reciprocal Rank Fusion. Semantic ranking is optional and Learn suggests setting k to 50 when you use it."
  - q: "Can an agent query several indexes?"
    a: "The Learn page says the Azure AI Search tool can only target one index. Your search resource and your Foundry agent must also be in the same tenant."
---

A Foundry agent reaches enterprise data in Azure AI Search through the Azure AI Search tool. You prepare a vector-enabled index, create a project connection, attach the tool with a query type, and check the networking rules. The tool defaults to hybrid retrieval with semantic ranking, which suits most enterprise content, but the limits below decide whether it fits your setup.

## Step 1: Check the index

Learn requires an index configured for vector search with:

- One or more `Edm.String` fields that are searchable and retrievable.
- One or more `Collection(Edm.Single)` vector fields that are searchable.
- At least one retrievable text field with the content the agent should cite.
- A retrievable field with a source URL, and optionally a title, so citations can include a link.

You also need a basic or standard agent environment, a Foundry project with an endpoint and a model deployment, and authentication such as `DefaultAzureCredential`.

## Step 2: Create the project connection

In the Foundry portal:

1. Open your project and select **Manage** > **Project details**.
2. Select the **Connected resources** tab and **Add connection**.
3. Select **Azure AI Search**, browse for your search service, and choose the type of authentication.
4. Select **Add connection**.

For keyless authentication, Learn says to use the system-assigned managed identity of the Foundry account that contains your project, and assign **Search Index Data Contributor** and **Search Service Contributor** on the search service. For the older classic page, key-based authentication needed the key from **Settings** > **Keys**. Prefer keyless where you can.

## Step 3: Attach the tool

The tool parameters per Learn:

| Parameter | Notes |
|---|---|
| `project_connection_id` | Required, the resource ID of the connection |
| `index_name` | Required, the index name in your search resource |
| `top_k` | Optional, defaults to 5 |
| `query_type` | Optional, defaults to `vector_semantic_hybrid`. Others: `simple`, `vector`, `semantic`, `vector_simple_hybrid` |
| `filter` | Optional, applies to all queries the agent makes to the index |

Learn's Python sample imports `AzureAISearchTool`, `AzureAISearchToolResource`, `AISearchIndexResource` and `AzureAISearchQueryType` from `azure.ai.projects.models`, and passes the connection ID, index name and query type inside a `PromptAgentDefinition`. The agent instructions in the sample require citations in a fixed format. The page also describes adding the tool through a toolbox and attaching it as an MCP tool, with REST endpoints under `/toolboxes/`.

Because `filter` applies to every query, use it for stable scoping, such as a business unit, and not for per-user security filters. The page I read does not describe per-user security trimming for this tool, so verify how your access rules are enforced before exposing sensitive content.

## Step 4: Choose the query type

Learn's hybrid search overview describes hybrid as one request with both `search` and `vectorQueries`. Full-text and vector queries run in parallel and the results are merged with Reciprocal Rank Fusion into one ranked set. Semantic ranking is an optional add-on invoked with `queryType=semantic`.

| Query type | Use when |
|---|---|
| `simple` | Exact keyword matching is enough |
| `vector` | Meaning matters more than wording |
| `semantic` | You want semantic reranking of keyword results |
| `vector_simple_hybrid` | You want keyword plus vector without semantic ranking |
| `vector_semantic_hybrid` | The default, hybrid plus semantic ranking |

The overview advises setting `k` to 50 when you use semantic ranker, and notes that explicit sort orders override relevance ranking. The Foundry tool page does not say how `top_k` maps to that `k` value, so test retrieval quality with your own questions. Learn gives no figures for relevance gains, only that hybrid retrieval with semantic ranker offers significant benefits in its benchmarks.

## Step 5: Check limits and networking

From the Foundry tool page:

- The tool can only target one index. For several indexes, the classic page suggests connected agents.
- The search resource and the Foundry agent must be in the same tenant.
- Basic agent deployments do not support private Azure AI Search resources, or search with public access disabled and a private endpoint. Deploy the standard agent with virtual network injection.
- Without virtual network injection, the tool can fail to connect to a search service with a private endpoint, and enabling public access does not guarantee connectivity.
- With a private virtual network, you must use Entra project managed identity. Key-based authentication is not supported.

The classic tool page also carries a notice that Agents (classic) are deprecated and will be retired on March 31, 2027, so use the current Foundry Agents Service pages for new work.

## A short test plan

Before sharing the agent, ask questions in three groups: ones answered by exact terms such as product codes, ones answered by meaning with different wording, and ones the index cannot answer. Check that citations point to the right source URL, that the agent says it has no answer for the third group, and that results change sensibly if you switch `query_type`. Learn does not publish accuracy figures for this tool, so your own question set is the only evidence you will have.

## Typical mistakes

- Indexing text without a vector field, then choosing a vector query type.
- Forgetting the source URL field and getting citations without links.
- Skipping the role assignments for keyless authentication. Use the two roles Learn lists.
- Running a basic agent against a private search service.
- Expecting one agent tool to query two indexes.

## Related

- [Azure AI Foundry](https://www.m365.fm/entity/azure-ai-foundry/)
- [Azure AI Search](https://www.m365.fm/entity/azure-ai-search/)
- [AI agent](https://www.m365.fm/entity/ai-agent/)
- [Hybrid search](https://www.m365.fm/entity/hybrid-search/)

## Sources

- [Connect an Azure AI Search index to Foundry agents](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/ai-search)
- [Azure AI Search tool (classic, deprecated)](https://learn.microsoft.com/en-us/azure/ai-foundry/agents/how-to/tools/azure-ai-search)
- [Hybrid search overview in Azure AI Search](https://learn.microsoft.com/en-us/azure/search/hybrid-search-overview)
