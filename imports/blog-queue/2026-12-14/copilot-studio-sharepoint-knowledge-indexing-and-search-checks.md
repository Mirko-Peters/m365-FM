---
title: "Copilot Studio SharePoint Knowledge: Indexing and Search Checks That Improve Generative Answers"
summary: "How Copilot Studio reads SharePoint knowledge, which indexing and search checks Microsoft documents, and the limits on file size, pages, lists and freshness that decide whether generative answers appear."
status: review
publish: false
author: mirko-p
date: 2026-12-14
topics: [copilot-studio, sharepoint, microsoft-search]
keypoints:
  - "Copilot Studio offers two SharePoint paths: a copy in Dataverse that syncs every four to six hours, or the SharePoint connector that queries SharePoint search directly."
  - "Content must be indexed by Microsoft Search first. Test by searching a unique keyword from the file in SharePoint, and use Re-index site only for urgent updates."
  - "Copilot Studio uses only the top three search results to build an answer, so an empty or weak result set means no response."
  - "Encrypted, DKE-protected or password-protected files can show Ready and still return nothing."
  - "File size for generative answers is 7 MB without a Microsoft 365 Copilot license in the tenant and 200 MB with one and semantic search grounding turned on."
faq:
  - q: "Why does my agent say it is not sure how to help with SharePoint content?"
    a: "Microsoft Learn's troubleshooting page lists missing search results as the first cause. Copilot Studio uses only the top three SharePoint search results, and content must be indexed by Microsoft Search and meet page and format constraints. Missing permissions, protected files and filters are the next checks."
  - q: "How long until new SharePoint files are available to the agent?"
    a: "With the file upload option, Learn says content syncs every four to six hours. With the SharePoint connector option, Learn describes real-time querying of SharePoint search, though new or updated items may not be available until search indexing finishes. You cannot trigger a manual refresh."
  - q: "What file size limits apply to SharePoint knowledge?"
    a: "Learn's troubleshooting page lists 7 MB without a Microsoft 365 Copilot license in the same tenant and 200 MB with a license and Tenant graph grounding with semantic search turned on. Larger files are returned by Graph search but not processed. Uploaded files can be up to 512 MB."
  - q: "Does Restricted SharePoint Search affect Copilot Studio?"
    a: "Yes. Learn states that Restricted SharePoint Search blocks SharePoint as a knowledge source regardless of configuration. Turn it off, or add the relevant sites to the allowed list."
---

When a Copilot Studio agent ignores SharePoint content, the cause is usually not the model. It is indexing, permissions, file type or a setting on the knowledge source. Microsoft documents a fixed set of checks, and working through them in order saves time. This guide explains the two SharePoint paths, then walks through the checks in a practical order based on Learn's troubleshooting page. The order of the steps is this article's own, not Learn's.

One boundary first: the Learn pages read for this article do not describe tuning crawled properties or managed properties for Copilot Studio. What they describe is how indexing, security trimming and limits behave.

## Two ways to connect SharePoint

The Add knowledge dialog offers two options, and they index differently.

| | Upload files, SharePoint | SharePoint connector |
|---|---|---|
| Where content lives | Copied into Dataverse | Stays in SharePoint |
| How it is searched | Dataverse semantic index built from the copied content | SharePoint search infrastructure, queried directly |
| Freshness | Synchronized every four to six hours | Real time, reflecting the latest available content |
| Advanced filters | Not available | Title, author, modified by, modified date |
| Sensitivity labels | Not supported | Supported |
| Dataverse storage | Consumed | Not consumed |

When you first enable unstructured data support, Learn says Dataverse can take 5 to 30 minutes to configure and index before it processes files. Both options need user authentication, and the Knowledge page must show the item as **Ready**.

## Step 1: Confirm the content is indexed

For SharePoint sources, Learn says content must be indexed by Microsoft Search. The check is simple:

1. Open the SharePoint site and search for a unique keyword from the target document.
2. If the file does not appear, indexing is incomplete.
3. Wait for the automated indexing cycle.

For urgent updates, a site administrator can go to **Site Information > View all site settings > Search and offline availability > Re-index site**. Treat this as a last resort for specific sites, not a routine step.

Learn also states that newly added or updated items might not be available until search indexing finishes, and that you cannot manually trigger a refresh of the background sync.

## Step 2: Check page and file types

Learn's troubleshooting page says:

- Modern pages are supported. Modern pages that contain SharePoint Framework (SPFx) components are not.
- Content from classic `.aspx` pages is not used to generate answers.
- Only documents in supported formats are used to generate responses.

Separately, the unstructured data article lists an unsupported character in a SharePoint file name as one reason a file shows up in the knowledge source but gives no answers.

The unstructured data article says the connector behind the **Upload files > SharePoint** option does not currently support Pages. The troubleshooting page, which covers agent-level and topic-level SharePoint sources, says modern pages are supported. The two statements refer to different options, so check which option you use and test a modern page in your own tenant before you rely on pages as a source.

## Step 3: Check the top-three limit

Learn says Copilot Studio uses only the top three search results to generate a response. If none are returned, there is no response. That makes retrieval quality more important than volume. Two practical suggestions follow from this, and they are this article's advice, not a Learn recommendation. The limits in the last bullet are from Learn.

- Point the source at the folder or library that holds the relevant answers instead of a whole site full of unrelated files.
- Keep duplicate and outdated copies out of the scope. They compete for the same three slots.
- Each agent can have at most 500 knowledge objects, and an agent can use only five different sources at a time.

If a folder holds more files than the limit, Learn says Copilot Studio indexes up to the maximum and does not indicate which items were skipped.

## Step 4: Check permissions

Copilot Studio respects Microsoft 365 security trimming. Users need at least read permission on the site and files. Without it there is no error, the content simply looks absent.

To verify, have the user open the exact document path, then run the same query in Microsoft 365 Copilot Chat with the same account. If Copilot Chat cannot retrieve an answer either, the cause is permissions or indexing.

## Step 5: Check protection and sensitivity

The agent-level source respects sensitivity labels for trimming, but cannot ground on encrypted content. That includes encrypting sensitivity labels, Double Key Encryption and password-protected files. Learn notes these files can show **Ready** and still return nothing. Either remove the protection if policy allows, or publish an unprotected copy in a location the agent can read.

## Step 6: Check file size

Learn's table for generative answers:

| Scenario | Maximum file size | Required setting |
|---|---|---|
| No Microsoft 365 Copilot license in the same tenant | 7 MB | Tenant graph grounding with semantic search off |
| Microsoft 365 Copilot license in the same tenant | 200 MB | Tenant graph grounding with semantic search on |

Larger files are returned by Microsoft Graph search but are not processed. As an alternative, uploaded files can be up to 512 MB.

## Step 7: Check authentication, tenant settings and filters

- The app registration needs at least `Sites.Read.All` and `Files.Read.All`, and the agent's authentication settings need those scopes plus `profile` and `openid`. Missing scopes or consent produce silent no-results.
- Restricted SharePoint Search blocks SharePoint as a knowledge source regardless of configuration.
- Generative answers from SharePoint sources are not available to guest users in SSO-enabled apps.
- Renaming a site or folder used by an agent-level source can break the link. Generate a new source link and update the knowledge source.
- Advanced settings filters on Title, Author, Modified by or Modified on can exclude the target content. A topic-level node with **Search only selected sources** turned on will not fall back to other sources.

## Lists need their own checks

For SharePoint lists, Learn lists these causes of empty results:

- Dataverse search must be on in the environment.
- Lists over 35,000 rows can reduce result quality and add latency.
- Select up to 10 lists at a time, with best results at no more than 10 per agent.
- A shared list may be missing from Recent Lists. Open it once in SharePoint, or paste its URL.

## Content moderation can hide answers

Moderated content produces no response and no indication. Events are logged only if the agent sends telemetry to Application Insights. Learn provides a KQL query that filters `GenerativeAnswers` events where the result contains `Filtered`. Lowering moderation may reduce answer accuracy.

## Order of work

1. Search the keyword in SharePoint.
2. Confirm page and file types.
3. Test permissions with Copilot Chat.
4. Check for encrypted or password-protected files.
5. Compare file size with the limit.
6. Review scopes, Restricted SharePoint Search and filters.
7. Check moderation in Application Insights.

## Related

- [Copilot Studio](https://www.m365.fm/entity/copilot-studio/)
- [SharePoint](https://www.m365.fm/entity/sharepoint/)
- [Microsoft Search](https://www.m365.fm/entity/microsoft-search/)
- [Restricted SharePoint Search](https://www.m365.fm/entity/restricted-sharepoint-search/)

## Sources

- [Microsoft Learn: Unstructured data as a knowledge source](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-unstructured-data)
- [Microsoft Learn: SharePoint knowledge sources don't return results](https://learn.microsoft.com/en-us/troubleshoot/power-platform/copilot-studio/knowledge/sharepoint-no-response)
