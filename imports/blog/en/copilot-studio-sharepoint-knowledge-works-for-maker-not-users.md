---
title: "Copilot Studio SharePoint Knowledge Works for You but Not for Other Users: A Checklist"
summary: "Your Copilot Studio agent answers from SharePoint in your own tests, but colleagues get the fallback message. Check sign-in, permissions, search index, protected files and tenant settings in this order."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [copilot-studio, sharepoint, restricted-sharepoint-search, sharepoint-permissions]
keypoints:
  - "SharePoint knowledge runs as the person who is chatting, not as the maker, so a maker test proves very little about other users."
  - "A user without read access, a missing search entry or an encrypted file all end in the same quiet result: no answer and no error."
  - "Test the same question as the affected user in Microsoft 365 Copilot Chat to separate an agent problem from a permission or index problem."
  - "Authentication, Restricted SharePoint Search and file limits are tenant-level checks that cost five minutes each."
faq:
  - q: "Why does my Copilot Studio agent work for me but give the fallback answer for other users?"
    a: "Microsoft Learn explains that SharePoint knowledge respects security trimming. The agent searches with the identity of the person chatting, so a user who lacks read access, whose search results are missing or whose sign-in is not set up gets no answer and no error. You, as the maker, usually have access and a working sign-in, so your tests pass."
  - q: "Does the agent read SharePoint files directly?"
    a: "Not in the way many people expect. Microsoft Learn describes that the agent uses Microsoft Search results and only the top three results are used to build an answer. If a file is not indexed, or the user cannot see it in search, the agent cannot use it. Larger files are returned by search but are not processed once they pass the size limits on the Learn page."
  - q: "Can Restricted SharePoint Search cause this?"
    a: "Yes. According to Microsoft Learn, if Restricted SharePoint Search is turned on for the tenant, SharePoint knowledge sources are blocked in Copilot Studio. Ask the SharePoint admin whether it is on, or whether the relevant sites are on the allowed list."
  - q: "What if nothing helps and many users report the same?"
    a: "In August 2026, several community threads described agents that suddenly stopped using SharePoint for everyone, including makers. One thread reported that Microsoft fixed an internal problem. Check service health and the community threads, and open a support case with a conversation ID and a UTC time if your case looks the same."
---

You built a Copilot Studio agent, connected a SharePoint site or library, and tested it. It answers well. Then a colleague opens the same agent in Teams or Microsoft 365 Copilot and gets the generic fallback message, such as "I'm not sure how to help with that" or "Sorry, I am not able to find a related topic".

Three Microsoft Q&A and Microsoft Community Hub threads from March to September 2026 describe exactly this. In one, a tester with read permission on the folder only got fallback answers. In another, a user with read and write access, a Copilot license and a place on the agent's allowed list approved a SharePoint permission prompt and still got nothing. In the third, SharePoint lists added as knowledge showed an error without a message.

This article is a checklist built from those threads and from the current Microsoft Learn troubleshooting page for SharePoint knowledge. It is not an official Microsoft procedure. Where the threads and Learn differ, Learn wins, and I say so.

## Symptoms

- The maker gets correct answers in the test pane. Other users get the fallback message.
- Files uploaded directly to the agent work for the affected user, but the SharePoint source does not.
- The knowledge source shows as ready, and there is no error anywhere.
- Nothing useful appears in the activity view for the affected user.

## Why it fails quietly

Microsoft Learn states that SharePoint knowledge follows Microsoft 365 security trimming. A user needs at least read access, and without it the agent behaves as if the document does not exist. There is no error. The same quiet result appears when the document is not in the search index, when it is encrypted, or when the sign-in setup lacks scopes.

The agent also does not read your library file by file. Learn says it uses only the top three Microsoft Search results to write an answer. If search does not return the right file for that user, there is nothing to summarize.

## Step 1: Reproduce as the affected user

1. Ask the affected user to open the exact file by its SharePoint address. If that fails, you have a permission problem, not an agent problem.
2. Ask the same question, with the same user, in Microsoft 365 Copilot Chat. Learn recommends this test. If Copilot Chat also finds nothing, the cause is permission or indexing. If Copilot Chat works and the agent does not, continue with step 2 and the steps after it.
3. Ask the user to type a unique phrase from inside the file into the SharePoint search box. Use text from the document body, not just the file name.

## Step 2: Check how the agent signs users in

Learn says agents created in Copilot Studio and Teams use **Authenticate with Microsoft** by default, and that SharePoint generative answers then run on behalf of the chatting user. With **No authentication**, the agent does not retrieve SharePoint information at all.

One community answer, marked as the solution in a SharePoint lists thread, reported that connecting failed while authentication was set to no authentication and worked after switching to Authenticate with Microsoft or manual authentication.

1. In Copilot Studio, open the agent and go to its authentication settings.
2. Pick **Authenticate with Microsoft**, unless you need a custom Microsoft Entra ID setup.
3. If you use **Authenticate manually**, add the scopes `Sites.Read.All` and `Files.Read.All` next to the existing `profile` and `openid`. In the app registration, add the delegated permissions `Sites.Read.All` and `Files.Read.All` and grant consent.
4. Publish again. For Teams, Learn notes that changes can take a few hours, and users can type "start over" to restart with the latest version.

Learn also lists two limits: generative answers from SharePoint are not available to guest users in apps with single sign-on, and group chats or channel messages in Teams are not yet supported for the path without manual authentication.

## Step 3: Check permissions on the exact content

Give users at least read access to the sites and files in the knowledge source. Learn adds a warning that you should not rely only on folder-level inheritance. In the tester thread, the answer from Microsoft staff said permissions on the specific folder or files matter, not just the site.

The agent searches the address you registered and everything below it. It does not look at parent folders, sibling folders or other sites unless you add them as separate sources.

## Step 4: Check the search index

Learn says recently uploaded files may not be indexed yet, and some settings can keep a site out of search.

1. Use the keyword test from step 1. If the file does not appear for the affected user, indexing or search settings are the cause.
2. A SharePoint site administrator can ask for a reindex: open **Site Information**, then **View all site settings**, then **Search and offline availability**, and select **Re-index site**.
3. One reply in the Community Hub thread suggested more checks. Confirm that the site setting for appearing in search results is set to yes, that the library is not set to stay out of the index, and that audience targeting on the library is off. It also suggested waiting up to 24 hours after access changes. These points come from a moderator answer without a link to documentation, so treat them as reported, not confirmed.

## Step 5: Look for protected and unsupported content

- **Encryption:** Learn says the agent respects sensitivity labels for access, but it cannot read content that is encrypted. This includes labels that apply encryption, Double Key Encryption and password-protected files. Such a file can show as ready and still return no answer. Test by asking about text that only appears in unprotected files from the same source.
- **Page types:** Modern pages work. Pages with SharePoint Framework components are not supported, and content from classic `.aspx` pages is not used.
- **File size:** Learn gives 7 MB for tenants without a Microsoft 365 Copilot license and 200 MB with one, together with a matching setting called tenant graph grounding with semantic search. Larger files can appear in search but are not processed.
- **Renames:** Learn warns that renaming a site or folder can break the source link. Generate a new link, update the source in the agent, and check permissions on the new location.

## Step 6: Check tenant settings

**Restricted SharePoint Search:** if it is on for the tenant, Learn says SharePoint knowledge is blocked, no matter how the agent is set up. The SharePoint admin must turn it off or add the sites to the allowed list. See [Restricted SharePoint Search](https://www.m365.fm/entity/restricted-sharepoint-search/).

**Lists:** for SharePoint lists, Learn requires Dataverse search to be on in the agent's environment. It also notes that lists with more than 35,000 rows reduce quality, and that you should use no more than 10 lists per agent. A reply from September 2026 in the lists thread mentions the same Dataverse search requirement. Another reply there reported success by recreating the list as a Dataverse table, which is a workaround, not a fix.

**Filters and topic settings:** check the filters on the source (title, author, modified by, modified on) under **Knowledge**, then the source, then **Edit**, then **Advanced settings**. On a topic with a generative answers node, the option to search only selected sources means the agent will not fall back to other knowledge.

## Step 7: Content moderation

Learn lists content moderation as a possible cause. When it blocks an answer, you see no response and no hint. You only see it in logs if the agent sends telemetry to Application Insights. If the questions are harmless and everything above checks out, set up telemetry and look for the filtered result, using the query on the Learn page.

## Collect evidence before you open a case

If all of this passes, write down:

- the conversation ID from the affected user's chat,
- the exact question and the time in UTC,
- the client (Teams, Copilot app or web),
- the environment ID,
- the result of the Copilot Chat test from step 1.

## What the threads did and did not show

- Two of the threads ended without a confirmed fix. The marked "most helpful" answer in the tester thread was a list of likely causes, and the asker did not report back.
- The lists thread has a solution mark on a reply that gives general setup advice. The asker did not confirm it.
- In August 2026, two other threads reported that agents suddenly stopped using SharePoint, including for makers and new agents, starting around 12 and 19 August. One asker wrote that Microsoft fixed an internal problem, but other people kept reporting the issue afterwards. If your case affects everyone, including you, check service health first. This pattern is different from the one in this checklist.

## Related

- [Microsoft Copilot Studio](https://www.m365.fm/entity/copilot-studio/)
- [SharePoint](https://www.m365.fm/entity/sharepoint/)
- [Restricted SharePoint Search](https://www.m365.fm/entity/restricted-sharepoint-search/)
- [SharePoint permissions](https://www.m365.fm/entity/sharepoint-permissions/)

## Sources

- [Microsoft Learn: SharePoint knowledge sources don't return results](https://learn.microsoft.com/en-us/troubleshoot/power-platform/copilot-studio/knowledge/sharepoint-no-response)
- [Microsoft Learn: Add SharePoint as a knowledge source](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-add-sharepoint)
- [Microsoft Q&A: Testers unable to get answers from Copilot agent in Stage environment (April 2026)](https://learn.microsoft.com/en-us/answers/questions/5845996/testers-unable-to-get-answers-from-copilot-agent-i)
- [Microsoft Q&A: Other users unable to chat with Copilot agent using SharePoint knowledge base (March 2026)](https://learn.microsoft.com/en-us/answers/questions/5834973/other-users-unable-to-chat-with-co-pilot-agent-usi)
- [Microsoft Community Hub: SharePoint lists with Copilot Studio error (April 2026)](https://techcommunity.microsoft.com/discussions/copilot-studio/sharepoint-lists-with-copilot-studio-error/4512072)
- [Microsoft Q&A: Copilot Studio cannot use SharePoint documents as knowledge sources (August 2026)](https://learn.microsoft.com/en-us/answers/questions/5979336/copilot-studio-cannot-use-sharepoint-documents-as)
- [Microsoft Q&A: SharePoint Excel knowledge source no longer returns results (August 2026)](https://learn.microsoft.com/en-us/answers/questions/5974158/copilot-studio-agent-sharepoint-excel-knowledge-so)
