---
title: "Copilot Connector Content Shows in Microsoft Search but Not in Copilot: A Checklist"
summary: "Your Copilot (Graph) connector is Ready and indexed, but Copilot ignores it? Check Copilot Visibility, item permissions, staged rollout, the All vertical and the connection description, in this order."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [copilot-connectors, microsoft-search, copilot-search, copilot-chat, copilot-studio]
keypoints:
  - "Microsoft Learn describes a Copilot Visibility toggle per connection (Copilot, Connectors, Your Connections). When it is off, the connector is left out of Copilot Search and Copilot Chat, although it keeps crawling."
  - "Items are only shown to users who may see them. Check an item and a user with the index browser and its Check user access function. Permission changes need a full crawl and can take up to 24 hours."
  - "In a 2025 Q&A thread, an asker confirmed that Copilot returned connector results only after the source was in the All vertical. Learn does not say Copilot depends on that setting."
  - "Several other threads with the same symptom, mostly for Confluence, never got a confirmed fix."
faq:
  - q: "Where is the Copilot Visibility setting?"
    a: "According to Microsoft Learn, open the Microsoft 365 admin center, go to Copilot, then Connectors, then Your Connections, select the connection, and use the Copilot Visibility toggle. Save the change. Learn says it is visible by default and that changes can take up to 30 minutes to reach all Copilot experiences."
  - q: "Does Copilot need the connector to be in the All vertical of Microsoft Search?"
    a: "Learn does not say so. It describes the All vertical as the place where connector results show up for Microsoft Search users. In one 2025 community thread, however, an asker confirmed that Copilot started to use connector data once the source was added to the All vertical. Treat this as a reported workaround and check the setting if your connector is missing."
  - q: "Why do some users see connector items and others do not?"
    a: "Learn says synced connectors respect source permissions. Access is based on the permission mode you chose, either only users with access or everyone, and on identity mapping that matches users by email to the user principal name or mail attribute in Entra ID by default. A staged rollout to a subset of users also limits who sees results."
  - q: "My Copilot Studio agent cannot see the connector. What should I check?"
    a: "Learn says your tenant admin must configure the connector first, and that you should choose Advanced in the Add knowledge dialog if you do not see it. For published agents, the manual authentication setting must include the ExternalItem.Read.All scope. A 2024 community thread with the status unknown had no confirmed answer."
---

The connector shows **Ready**. The last sync was successful. Users find the items in Microsoft Search. Still, when someone asks Microsoft 365 Copilot about that content, the answer does not use it.

This pattern appeared in several Microsoft community threads between 2024 and 2025. Most never reached a confirmed fix. This article therefore turns the Microsoft Learn documentation into an ordered checklist and marks what was only reported in the threads. It is a troubleshooting guide, not an official Microsoft procedure. The feature was formerly called Microsoft Graph connectors, and Learn now uses the name Microsoft 365 Copilot connectors.

## What the threads reported

- **March 2025, Microsoft Q&A.** An asker had connectors for a content management system, Jira and Confluence working in Microsoft Search. Copilot returned nothing from them. A Microsoft moderator said that connected content in a tenant shows in both Search and Copilot, and asked for prompts and sample data. A community member wrote that Copilot gave results only after the data source was added to the **All** vertical, and that Jira and Confluence results then appeared after a few hours. The asker confirmed that this was the problem: re-registering the connector had kept removing it from the All vertical. No answer was marked as accepted.
- **February to July 2025, two Q&A threads about Confluence Cloud.** Copilot said it had no access to Confluence, or answered from a wrong page, although the connector was active and had indexed pages. One commenter noted that the same setup worked for Jira. These threads have no confirmed fix.
- **June 2024, Tech Community.** A Jira connector appeared in Search, but showed the status "unknown" in Copilot Studio. Two other users reported the same for SQL Server, MediaWiki and file share connectors. No solution.

So the only confirmed result is a workaround for one tenant. The rest of the checklist comes from Learn.

## Step 1: Confirm that items are really indexed

In the Microsoft 365 admin center, open the connection and check its state. Learn lists **Ready** as the state where there is no active crawl and a successful last sync, and **Failed** as a critical failure that needs manual intervention. Learn says data that was indexed before the failure remains searchable.

Then check single items with the **index browser**. Learn says you enter the unique ID of the item, and the ID format depends on the connector (for example a work item ID for Azure DevOps, or the final URL in lowercase for the Intranet connector). The browser shows the item status, its properties and its permissions. Two statuses matter here:

- **Partially indexed**: some properties, user details or content are missing, but the item is still searchable in Microsoft Search and Microsoft 365 Copilot. Open the **Errors** tab.
- **Deny all**: the item is indexed but nobody can access it. Learn says temporary issues can cause this and it may clear on the next full crawl.

Learn also says to test with a searchable or queryable property.

## Step 2: Check Copilot Visibility

This is the first setting that Learn ties directly to Copilot. In the Microsoft 365 admin center:

1. Go to **Copilot**, then **Connectors**, then **Your Connections**.
2. Select the connection.
3. Under **Copilot Visibility**, check that the toggle is on, then choose **Save**.

Learn says connectors are visible by default and that changes can take up to 30 minutes to reach all Copilot experiences. If the toggle is off, the connector is left out of Copilot Search and Copilot Chat, but it can still crawl. That matches the symptom exactly: indexed, searchable in Search, silent in Copilot. Learn's overview page also says that Copilot Search includes indexed connector content without extra setup.

## Step 3: Check permissions with a real user

Copilot only shows what the signed-in user may see. Learn says that synced connectors keep source permissions by mapping access control lists to Microsoft 365 and Entra ID.

In the connection settings, **Access Permissions** has two modes: only users with access to the content, or everyone in the organization. By default, the system matches users by comparing their email address with `UserPrincipalName` or `Mail` in Entra ID. You can set a custom mapping formula.

To test a person:

1. Open the item in the index browser.
2. Use **Check user access** and enter the user name or email address.
3. Look at the groups returned. Learn says that if the user is denied in any of those groups, the user's overall permission to view the item is revoked.

If a user is missing, Learn says it may be a failed user mapping or a user that was not discovered, for example because the Entra ID user ID was not found. Check the user mapping formula and the error reports. Also remember the timing: Learn says permission changes can take up to 24 hours to show, and that updates happen in a full crawl, not an incremental one. If permissions changed after the last full crawl, start a full crawl on demand.

Learn's FAQ suggests creating test users for ACL testing. Do not test only as an administrator.

## Step 4: Check the staged rollout

Learn's deployment steps include a staged rollout, which deploys the connector to a subset of users first. The FAQ lists "staged rollout" as a reason why results are not displayed and tells you to confirm which users are in the rollout. If your tester is not in that group, they will not see the content, in Search or in Copilot.

## Step 5: Check the All vertical for Microsoft Search

This step follows the March 2025 thread. Learn's FAQ says that if results do not show in Microsoft Search, the setting to include results in the All vertical must be on. It says this is on by default for prebuilt connectors and must be enabled manually for custom ones.

Learn's page on connectors in the All tab gives the click path: in the admin center, go to **Search & Intelligence**, then **Customizations**, then **Verticals**, and select the **All** vertical. In the **Manage connection results** panel, check that **Show results inline** is selected and that your connection is ticked. The same page lists requirements and limits:

- One source property must be mapped to the semantic label `title`.
- Inline results are not available at the SharePoint site search scope.
- The results come from an AI ranking model, so a user may see none or many connector results depending on the query.

Learn does not say that Copilot depends on the All vertical. The reported fix in the thread is therefore a workaround from one tenant. It is cheap to check, and it explains why a re-registered connector can silently drop out. After every re-registration, check the vertical and the Copilot Visibility toggle again.

## Step 6: Improve the connection name and description

Learn says a meaningful connection name and description help Copilot match connector content to a request. A good description names the content type, the scope, keywords people use, and alternative names. For Microsoft-built connectors, go to **Settings**, **Copilot**, **Connectors**, select the connector, choose **Edit description**, and save. Learn says updates usually show within minutes. On-premises connectors use the update externalConnection API instead.

This will not fix a hidden or unpermitted connector. It may help when Copilot has the data but picks the wrong source.

## Step 7: Copilot Studio agents

For the "unknown" status in Copilot Studio, Learn gives these points:

- The tenant admin must configure the connector before it appears in the agent's knowledge list.
- In the **Add knowledge** dialog, select **Advanced** if you do not see the connector.
- When you publish an agent to channels, the manual authentication setting must include the `ExternalItem.Read.All` scope.
- Learn recommends a Microsoft 365 Copilot license in the same tenant as the agent for better results.

The 2024 Tech Community thread does not confirm that any of these resolved the "unknown" status.

## Limits of this checklist

- No single cause is confirmed for the Confluence threads. They may be a product issue and not a configuration issue.
- The All vertical link to Copilot is reported in one thread and not documented on Learn.
- If every setting is correct and a full crawl has completed, collect the connection ID, a test item ID, a test user and the time of your tests, then open a support case.

## Related

- [Copilot connectors](https://www.m365.fm/entity/copilot-connectors/)
- [Microsoft Search](https://www.m365.fm/entity/microsoft-search/)
- [Microsoft 365 Copilot Search](https://www.m365.fm/entity/copilot-search/)
- [Microsoft 365 Copilot Chat](https://www.m365.fm/entity/copilot-chat/)
- [Copilot Studio](https://www.m365.fm/entity/copilot-studio/)

## Sources

- [Microsoft Learn: Copilot connectors overview](https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/overview)
- [Microsoft Learn: Manage Copilot connectors](https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/manage-connector)
- [Microsoft Learn: Deploy connectors in the Microsoft 365 admin center](https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/deployment-overview)
- [Microsoft Learn: Search and validate indexed connector content](https://learn.microsoft.com/en-us/microsoftsearch/connectors-index-search)
- [Microsoft Learn: Copilot connectors FAQ](https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/frequently-asked-questions)
- [Microsoft Learn: Connectors in the All tab](https://learn.microsoft.com/en-us/microsoftsearch/connectors-in-all-vertical)
- [Microsoft Learn: Enhancing Copilot discovery with connector content](https://learn.microsoft.com/en-us/microsoftsearch/enhancing-microsoft-copilot-discovery-with-graph-connector-content)
- [Microsoft Learn: Add Copilot connectors as a knowledge source (Copilot Studio)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-copilot-connectors)
- [Microsoft Q&A: Is the "Microsoft Graph connectors for Microsoft 365 Copilot" document still accurate? (March 2025)](https://learn.microsoft.com/en-us/answers/questions/2223981/is-the-microsoft-graph-connectors-for-microsoft-36)
- [Microsoft Q&A: Copilot is not using my configured Confluence connector (June 2025)](https://learn.microsoft.com/en-us/answers/questions/2281453/copilot-is-not-using-my-configured-confluence-conn)
- [Microsoft Q&A: Confluence graph connector issue (February 2025)](https://learn.microsoft.com/en-ie/answers/questions/2180339/confluence-graph-connector-issue)
- [Microsoft Community Hub: Adding enterprise data to Custom Copilot via Graph Connector (June 2024)](https://techcommunity.microsoft.com/discussions/bingchatenterprise/adding-enterprise-data-to-custom-copilot-via-graph-connector/4177268)
