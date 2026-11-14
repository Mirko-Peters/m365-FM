---
title: "How to Add Knowledge Sources to a Copilot Studio Agent: Supported Types and Limits"
summary: "Add knowledge sources to a Copilot Studio agent: the supported source types and their limits, the Add knowledge steps for public websites and uploaded files, URL rules, and the agent settings that change grounding, per Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2027-01-21
topics: [copilot-studio, knowledge-source, dataverse]
keypoints:
  - "Add a source with Add knowledge on the Overview or Knowledge page, or in the Properties of a generative answers node. Then name it, describe it and select Add to agent."
  - "Supported types: public websites, documents in Dataverse, SharePoint, Dataverse tables and enterprise data using connectors."
  - "Public website URLs allow up to two levels of depth, must be public and indexed by Bing, and cannot be sites that need authentication, such as SharePoint."
  - "Uploaded files need Dataverse search, may not be encrypted, can be up to 512 MB each, and an agent can hold up to 500 files."
  - "SharePoint, Dataverse and connector sources use the agent user's Microsoft Entra ID authentication, so users see only content they can access."
faq:
  - q: "How do I add a knowledge source to an agent?"
    a: "According to Microsoft Learn, open the agent, select Add knowledge from the Overview or Knowledge page, or from the Properties of a generative answers node, choose the source type, provide the link or file, optionally edit name and description, and select Add to agent. Learn says a detailed description helps generative orchestration."
  - q: "Which knowledge source types are supported?"
    a: "The knowledge sources summary lists public websites, documents uploaded to Dataverse, SharePoint, Dataverse and enterprise data using connectors. In generative mode it lists 25 websites and 25 SharePoint URLs, with unlimited Dataverse and connector sources. Classic mode has lower limits, such as four public URLs and four SharePoint URLs."
  - q: "Why does my public website URL not work?"
    a: "Learn lists restrictions: the URL can have up to two levels of depth, a redirect to another top-level site excludes the content, and sites that require authentication or are not indexed by Bing are not supported. Wikis and SharePoint sites are given as examples of sites you cannot use this way. The knowledge source uses Grounding with Bing Search."
  - q: "What are the rules for uploaded files?"
    a: "Learn says agents need Dataverse search for this source, files larger than 512 MB are not supported, files with encryption such as sensitivity labels or password protection are not supported, and an agent can include up to 500 files. Image, video, executable and audio files cannot be used, and images work only when embedded in PDF files."
  - q: "What does Allow ungrounded responses do?"
    a: "The setting in the Knowledge section of the Generative AI settings requires generative orchestration. When on, the agent can answer from the model's general knowledge without using a source. When off, the agent blocks responses generated in a turn where it used no knowledge source or tool, and the fallback topic triggers."
---

To add a knowledge source to a Copilot Studio agent, open the agent, select **Add knowledge**, choose the source type, provide the link or file, and select **Add to agent**. Which types you can use, and how many, depends on the type and on whether the agent uses classic or generative orchestration. This article follows the knowledge sources summary and two how-to pages on Microsoft Learn.

## How knowledge sources work

Learn says knowledge sources ground your agent's responses in enterprise data. You can add them when you create the agent or later. Published agents that contain knowledge use the configured sources to ground answers. You can add knowledge at the agent level on the **Knowledge** page, or at the topic level with a generative answers node.

By default, a new agent has the **Conversational boosting** system topic with a generative answers node. All sources you add at the agent level go into that node.

## Supported source types

| Type | Kind | What it does | Generative mode | Classic mode |
| --- | --- | --- | --- | --- |
| Public website | External | Searches the query on Bing and returns results only from the provided websites | 25 websites | Four public URLs |
| Documents | Internal | Searches documents uploaded to Dataverse | All documents | Limited by Dataverse file storage |
| SharePoint | Internal | Connects to a SharePoint URL and uses GraphSearch | 25 URLs | Four URLs per generative answers node |
| Dataverse | Internal | Connects to the Dataverse environment with a retrieval-augmented generative technique | Unlimited | Two sources, up to 15 tables each |
| Enterprise data using connectors | Internal | Connects to connectors whose data is indexed by Microsoft Search | Unlimited | Two per custom agent |

SharePoint, Dataverse and connector sources use the agent user's Microsoft Entra ID authentication. Learn explains that this means the agent only surfaces content that the specific user can access. You need to configure user authentication for them.

Notes from the page: generative answers nodes do not support Bing Custom Search, Azure OpenAI or Custom Data as knowledge sources, so use the **Classic data** option for those. Generative orchestration filters knowledge sources with an internal model when there are more than 25. Uploaded files do not count toward that 25-source search limit.

## Add a public website

1. Open the agent.
2. Select **Add knowledge** from **Overview**, **Knowledge** or the **Properties** of a generative answers node.
3. Select **Public websites**.
4. Enter the URL in **Public website link**, or use the variable picker for a variable. Select **Add** to add it to the list.
5. Optionally edit **Name** (the URL by default) and **Description** (auto-populated).
6. Select **Add to agent**.
7. Test the agent with questions about the site, including edge cases. Learn suggests you might need a lower moderation setting to be more inclusive.

### URL rules

- The URL can have up to two levels of depth. `www.fabrikam.com/engines/rotary` is valid, and `www.fabrikam.com/engines/rotary/dual-shaft` is not. A trailing slash is allowed.
- If the URL redirects to another top-level site, content is not included in results.
- URLs for sites that require authentication, or are not indexed by Bing, are not supported. Wikis and SharePoint sites are the examples.
- The agent uses publicly viewable content under the URL you give, including subdomains under a top-level domain. Using `fabrikam.com` covers `www.fabrikam.com` and `news.fabrikam.com`.
- Avoid forum and social network URLs, which can lead to irrelevant or inappropriate answers, and search engine URLs such as bing.com.
- The search request sent to Bing, including the query, cannot exceed 2,048 characters. Long questions, long conversations and multibyte languages such as Japanese, Chinese and Korean can reach this limit, and the agent then skips the search and returns no results from the website.

Learn also describes using variables in public website and SharePoint URLs, for example to scope by product or language. The variable must resolve to a valid public URL, and the depth limits still apply.

## Upload files

1. Open the agent and select **Add knowledge**.
2. Upload the file by drag and drop or by browsing.
3. Add a name (the file name by default) and a detailed description.
4. Select **Add to agent**.

Facts from the page: files are stored in Dataverse, so the number of documents is limited by the available Dataverse file storage. Agents need Dataverse search for this source. The page lists many supported types, among them Word, Excel, PowerPoint, PDF, text, HTML, CSV, XML, JSON and YAML. Files larger than 512 MB are not supported, encrypted files with sensitivity labels or password protection are not supported, and an agent can include up to 500 files.

## Agent settings that change how knowledge is used

On the **Generative AI** settings page:

- **Allow ungrounded responses** (needs generative orchestration). When off, the agent blocks a response in a turn where it used no knowledge source or tool. Learn adds that turning it off does not guarantee the model never uses general knowledge.
- **Use information from the web** also searches all public websites indexed by Bing, in parallel with your configured public websites.
- **Tenant graph grounding with semantic search** improves SharePoint retrieval but needs the agent to share a tenant with a Microsoft 365 Copilot license and has an extra cost for users without such a license, according to the page.
- **Moderation** ranges from Lowest to Highest, and the default is High.

If an answer is withheld although the source has it, Learn explains that with ungrounded responses off, the agent returns an answer only when it includes an in-text citation. Add citation instructions to the agent's instructions, and avoid instructions that force formats that suppress citations.

## Choosing sources (my advice)

This list is my suggestion, not a Microsoft recommendation:

1. Start with the narrowest source that holds the answers, and write a specific description for each. Descriptions guide generative orchestration.
2. Use SharePoint or connectors for content users already have permissions for, rather than uploading copies.
3. Test questions that should not be answerable, and check the ungrounded setting.

## What this article leaves out

The summary page links to separate pages for SharePoint, Dataverse and unstructured data. I did not read those for this article, so the exact steps for them are not described here.

## Related

- [Copilot Studio](https://www.m365.fm/entity/copilot-studio/)
- [Knowledge source](https://www.m365.fm/entity/knowledge-source/)
- [Dataverse](https://www.m365.fm/entity/dataverse/)

## Sources

- [Knowledge sources summary (Microsoft Learn)](https://learn.microsoft.com/microsoft-copilot-studio/knowledge-copilot-studio)
- [Add a public website as a knowledge source (Microsoft Learn)](https://learn.microsoft.com/microsoft-copilot-studio/knowledge-add-public-website)
- [Upload files as a knowledge source (Microsoft Learn)](https://learn.microsoft.com/microsoft-copilot-studio/knowledge-add-file-upload)
