---
title: "Copilot Studio Agent Analytics: Conversation Transcripts in Dataverse and Telemetry in Application Insights"
summary: "Two documented ways to analyze a Copilot Studio agent: conversation transcripts in the Dataverse ConversationTranscript table (roles, retention, enhanced transcripts) and agent-level telemetry in Application Insights with KQL, plus what each page leaves open."
status: review
publish: false
author: mirko-p
date: 2026-12-21
topics: [copilot-studio, dataverse, application-insights]
keypoints:
  - "Transcripts live in the Dataverse ConversationTranscript table. Viewing them needs the Bot Transcript Viewer role, and the Environment maker role does not include it."
  - "Dataverse keeps transcripts 30 days by default through a bulk delete job. Cancel that job and create a new one to keep them longer. Copilot Studio storage still deletes after up to 28 days."
  - "A transcript record is saved after 30 minutes of inactivity. Records above 1 MB are split, and you merge them by Name and ConversationStartTime, sorted by BatchId."
  - "Application Insights telemetry is set under Settings, Advanced with a connection string. Test conversations are excluded in KQL with the designMode custom dimension."
  - "The Copilot Studio Dashboard workbook is preview. Makers can be blocked from agent-level telemetry by blocking the Application Insights in Copilot Studio connector in a data policy."
faq:
  - q: "Where are Copilot Studio conversation transcripts stored?"
    a: "Learn says the backend service generates transcripts during user-agent interactions and stores them in the ConversationTranscript table in Dataverse, in JSON and text format. Transcripts are not written for Microsoft Dataverse for Teams environments, and not stored for agents deployed in developer environments."
  - q: "Who can view conversation transcripts?"
    a: "A user needs the Bot Transcript Viewer security role. Learn says only admins can grant it and that makers with the Environment maker role do not automatically have access. Admins can also turn off the ability for makers to view or download transcripts."
  - q: "How do I keep transcripts longer than 30 days?"
    a: "Learn says a Power Apps bulk delete job removes transcripts older than 30 days. Cancel the Bulk Delete Conversation Transcript Records Older Than 1 Month job and create a new bulk deletion job with your own age and schedule. This affects only Dataverse, not Copilot Studio storage."
  - q: "How do I exclude test conversations from Application Insights queries?"
    a: "Learn says all events carry the designMode custom dimension. Extend the query with customDimensions['designMode'] and filter on the value False to exclude conversations from the test canvas."
  - q: "Can I stop makers from sending telemetry to Application Insights?"
    a: "Learn says to block the Application Insights in Copilot Studio connector in a data policy in the Power Platform admin center. This needs the Power Platform administrator or Dynamics 365 administrator role at tenant level."
---

Microsoft Learn describes two separate analysis paths for a Copilot Studio agent. Conversation transcripts are written to a Dataverse table and suit content analysis such as topics, sentiment and outcomes. Agent-level telemetry goes to Azure Application Insights and suits operational questions that you answer with Kusto queries. This article puts both next to each other. It follows the pages read and marks what they do not say.

## Path 1: Conversation transcripts in Dataverse

### Where they are and who can see them

Per Learn, the backend Copilot Studio service creates transcripts during user-agent interactions and stores them in the `ConversationTranscript` table in Dataverse. Three conditions limit where you will find data:

- Conversation transcripts are not written for Microsoft Dataverse for Teams environments.
- Transcripts are not stored for agents deployed in developer environments.
- Administrators can prevent the saving of transcripts to Dataverse. The page points to its transcript access control article for that.

To view transcripts you need the **Bot Transcript Viewer** security role, which only admins can grant. Makers with the Environment maker role do not get access automatically.

### Export from the Power Apps portal

1. Sign in to Power Apps and select **Tables** > **All**.
2. Search for "conversation" and select the **ConversationTranscript** table.
3. Select **Export** > **Export data**, wait a few minutes, then select **Download exported data**. The file is a ZIP archive.

Learn adds one content gap that matters for knowledge answers. When SharePoint is used as a knowledge source, the transcript contains the question and the content of the source documents used (the `search_results` field), but the answer is not included and is marked `REDACTED`.

### How records are written

- A conversation is saved to a transcript record after 30 minutes of inactivity. If it resumes later, new activities go to a new record with the same `Name` but a new `ConversationStartTime`.
- For agents published to the Telephony channel, conversations time out three minutes after an End Conversation event.
- Each record is limited to 1 MB in the `Content` column. A larger transcript is split into several records with the same `Name` and `ConversationStartTime` and different `Metadata.BatchId` values. To merge, take all records with the same `Name` and `ConversationStartTime` and sort them by `BatchId`.

Key columns from the Learn table:

| Field | Description according to Learn |
|---|---|
| `Content` | The entire transcript in JSON |
| `ConversationStartTime` | When the conversation started, not when the record was written |
| `Metadata` | JSON with agent ID, tenant ID, agent name and batch ID |
| `Name` | Custom row name built from the conversation ID and the agent ID |
| `Created on` | When the transcript record was created |

Inside `Content`, activities have a `type` such as `message`, `event` or `trace`, and the `from.role` value tells the direction: 0 is the agent, 1 is the user. The page says the `from.id` is hashed before it is written, and that it can be used to count active users only if the canvas passes a unique user ID, otherwise a unique ID per conversation is passed. Useful value types include `IntentRecognition`, `SessionInfo` (type engaged or unengaged, outcome Escalated, Resolved or Abandon, start and end time, turn count), `CSATSurveyResponse` and `VariableAssignment`.

### Enhanced transcripts

In the agent, open **Settings** > **Advanced** > **Enhance Transcripts** and turn on **Include node-level details in transcripts**. The transcript then contains a `nodeTraceData` activity for each node a topic invokes, with `nodeID`, `nodeType`, `startTime`, `endTime` and `topicDisplayName`.

### Retention

By default, Power Apps downloads the last 30 days, and a bulk delete job removes older transcripts. To keep more:

1. In Power Apps, open **Settings** > **Advanced settings** > **Data Management** > **Bulk Record Deletion**.
2. In the view list, select **Recurring Bulk Deletion System Jobs**, select **Bulk Delete Conversation Transcript Records Older Than 1 Month** and cancel it.
3. Create a new job. Learn's example looks for **ConversationTranscripts**, **ConversationStartTime** older than 12 months, and **SchemaType** equals `powervirtualagents`, running every day.

Learn also notes that this only affects custom analytics: transcript data is retained in Copilot Studio storage for up to 28 days to support agent functionality and then deleted automatically.

### An analysis architecture

A Power Platform reference architecture describes the flow: a user talks to the agent, Copilot Studio logs the transcript, a cloud flow triggers when the transcript record is created, forwards it to AI Builder, which returns sentiment, topics and a summary, the flow stores the structured results in Dataverse, and Power BI visualizes them. The page lists AI Builder capabilities such as sentiment analysis (positive, neutral, negative), flagging personal data, key phrases and issues, escalation indicators and summaries. It points to the Conversation Analyzer in the Copilot Agent Kit as a sample implementation. The page is a reference architecture and gives no step-by-step build, no AI Builder prompt text and no cost figures.

## Path 2: Agent-level telemetry in Application Insights

### Connect

1. In the agent, open **Settings** > **Advanced**.
2. In the **Application Insights** section, enter the **Connection string**.
3. Optionally turn on: **Enable logging**, **Log conversation details** (user ID, user name and message text; with OpenTelemetry tracing enabled it also controls tool input arguments and output results captured in spans), **Log sensitive Activity properties**, and **Node execution events**.

The Learn page says telemetry is logged when users interact with the agent, including during testing in Copilot Studio.

### Query with KQL

In the **Logs** section of the Application Insights resource, the `customEvents` table shows all custom events from Copilot Studio. Learn's example counts distinct users per day over 14 days with `summarize uc=dcount(user_Id) by bin(timestamp, 1d)`. It warns that this count is only correct when users are authenticated with consistent IDs, because anonymous conversations get a random ID.

To leave out test conversations, extend the query with the `designMode` custom dimension and keep the value `False`. Other custom dimensions in the Learn table are `type`, `channelId`, `fromId`, `fromName`, `locale`, `recipientId`, `recipientName` and `text`.

### Dashboard (preview)

The page marks **View monitoring results** as preview and says preview features are not meant for production use. In Application Insights, select **Monitoring** > **Workbooks** and open **Copilot Studio Dashboard**. It shows total conversations, latency, exceptions, tool usage and topic analytics. You can edit and save it, and when you share it, colleagues need at least the Reader role on the connected Application Insights resource.

### Disable it for makers

Block the **Application Insights in Copilot Studio** connector in a data policy: in the Power Platform admin center, **Security** > **Data and privacy** > **Data policy**, add the connector and select **Block**. You need the Power Platform administrator or Dynamics 365 administrator role at tenant level.

## Which path for which question

The comparison below is the author's reading, not a Learn table.

| Question | Where the pages point |
|---|---|
| What did users ask and how did the conversation end? | Transcripts: `SessionInfo`, `IntentRecognition` |
| Which topic nodes ran and how long did they take? | Enhanced transcripts (`nodeTraceData`) or Application Insights with node execution events |
| Daily distinct users, latency, exceptions | Application Insights |
| Long-term history beyond 30 days | Change the Dataverse bulk delete job |

## What the documentation does not say

- The pages do not compare the two paths or recommend one.
- They do not give Application Insights ingestion cost or sampling details.
- They do not say how long Application Insights keeps the data. That depends on the resource, and these pages do not cover it.
- The transcript page does not list what the retention change does to data privacy obligations. Check this with your own compliance team.

## Related

- [Copilot Studio](https://www.m365.fm/entity/copilot-studio/)
- [Dataverse](https://www.m365.fm/entity/dataverse/)
- [Application Insights](https://www.m365.fm/entity/application-insights/)

## Sources

- [Understand downloaded conversation transcripts from Power Apps, Microsoft Copilot Studio (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-transcripts-powerapps)
- [Agent-level telemetry with Application Insights, Microsoft Copilot Studio (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-bot-framework-composer-capture-telemetry)
- [Extract and analyze agent conversation transcripts, Power Platform (Microsoft Learn)](https://learn.microsoft.com/en-us/power-platform/architecture/reference-architectures/analyze-agent-conversation-transcripts)
