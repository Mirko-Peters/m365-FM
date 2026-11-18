---
title: "Using AI assistants for AVD operations: benefits and limits"
summary: "Nerdio's AI assistant can find documented answers and draft scripts and KQL queries, but Nerdio says every generated script and query must be tested manually. This article shows where it helps and how to review a draft."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [nerdio-assistpro, nerdio-manager-for-enterprise]
keypoints:
  - "Three documented uses: answers from Nerdio Help Center articles with citations, script drafts (Script Pro) and KQL drafts (AnalyticsPro). Output is text you copy; it runs nothing."
  - "Nerdio warns twice that AI-generated scripts and queries must be tested and validated manually before production. Treat every draft as unreviewed code."
  - "Documented limits: non-deterministic answers, no throttling control, no notifications, no false-positive filter, and older chat text is dropped past the token limit."
  - "Nerdio's own ChatGPT sample shows why review matters: a mismatched variable description, a wrongly required value, unbalanced braces and an unregistered event-log source."
  - "Use the assistant for drafting and explaining; keep deployment, bulk runs and policy decisions with a human and a test host."
faq:
  - q: "Can I let the assistant fix problems in my host pools directly?"
    a: "Nothing on Nerdio's Copilot help page says it can. The page describes generated scripts and KQL queries that you copy, and tells you to test and validate them manually before production. The v8.1.0 release note mentions an agent file system and logged actions but no host-pool changes. Nerdio's MCP support, in Public Preview since version 8.2.1, is read-only."
  - q: "How should I check a generated KQL query?"
    a: "Confirm that the table and columns exist in your Log Analytics workspace, pin down what the question means by terms such as 'active', run it over a short time range first, and compare the result with a number you can see elsewhere, such as the session count in the AVD portal. Our companion article on KQL diagnostics lists queries taken from Microsoft Learn that you can compare against."
  - q: "Does the assistant always give the same answer to the same question?"
    a: "No. Nerdio's help pages say answers are not deterministic because the assistant is a large language model, and they offer feedback through a comment or the standard support escalation path when you notice an incorrect answer."
---

Nerdio Copilot, the AI assistant in [Nerdio Manager for Enterprise](https://www.m365.fm/entity/nerdio-manager-for-enterprise/), can be used for three drafting jobs: finding what the documentation says, writing a first version of a script, and writing a first version of a KQL query. Nerdio says all generated scripts and queries must be tested and validated manually before they reach production. This article covers what the documentation supports, where the limits are, and a review routine you can apply, with the sample from Nerdio's ChatGPT guide as the example. For the names, deployment steps, cost and data handling, see the companion article "AssistPro and ScriptPro: Nerdio's GenAI assistants explained".

## Where an assistant helps

**Finding the documented answer.** Nerdio Copilot answers from Nerdio Help Center articles, which it caches and refreshes daily. The **Citations** option lists the articles behind an answer, so a quick check against the source takes a click. The cache means a very recent help page change may not appear yet.

**A first draft of a script.** [Script Pro](https://www.m365.fm/entity/nerdio-assistpro/) is part of Copilot. Nerdio's example asks for a management script for a Windows VM that sets a registry key, then you answer follow-up prompts and copy the code. Nerdio's ChatGPT guide for scripted actions adds practical advice for a general chat model: be as specific as possible, say so if the script must run as an Azure runbook, give an existing scripted action as a sample, and supply the table of global variables as context.

**A first draft of a KQL query.** AnalyticsPro turns a question such as "the number of active users from the past hour" into a query you copy and run in your Azure Log Analytics workspace. It supports follow-up questions and refinement.

**An explanation of a script (ChatGPT guide).** Step 9 of Nerdio's guide recommends asking the model to explain a finished script and identify errors, because this "can expose bugs, logic errors, and typos". In Nerdio's example the model found 7 areas for improvement.

In all four cases the output is text. The Copilot help page describes copying it out; it does not describe the assistant running a script or changing a host pool. The v8.1.0 release note (Public Preview) lists an internal virtual file system with which the agent can read, search, write and validate data, visible logging of agent actions, and several scripts or queries from one prompt. It does not say that generated scripts are tested against your environment, so the manual test stays with you. Nerdio's separate MCP support (Public Preview since version 8.2.1) gives external AI agents read-only access to areas such as Host Pools and Logs. Nerdio's MCP Connector page warns that because it queries live data, an agent may take several minutes to respond in larger environments.

## Documented limits and caveats

- **Answers vary.** Nerdio's pages say the assistant uses a large language model, so "answers are not deterministic". Ask the same question twice and compare before you rely on a result.
- **Long chats lose context.** The number of tokens, made up of the system prompt, your input and the model's output, determines how much of an earlier exchange the bot retains. If a conversation exceeds the model's maximum token count, older data is dropped, although the chat history stays visible in the interface until you delete it. For a long scripting session, restate the current script in full.
- **No usage controls.** The Known limitations list says users cannot control the throttling limit per day or month, there is no support for notifications, and there is no mechanism for identifying and filtering out false positives. Cost is per token, so our recommendation is to watch the Azure OpenAI resource in Azure Cost Management yourself.
- **Region dependence.** Azure OpenAI availability is limited and varies by Azure region, and the model list depends on your quotas.
- **Leftovers on disable.** Smart detector alert rules are not deleted when Copilot is disabled.
- **Role and user limits.** The AssistPro help page, written for Nerdio Manager for MSP, lists as limitations that only accounts assigned to the AVD admin role can interact with AssistPro and, for v5.0, a maximum of 7 simultaneous users. The Copilot page states no role requirement or user limit, so test your own role setup; the MCP Connector page says deploying it needs the Admin role in Nerdio Manager, after which any user with read access to a module can use it. The MSP release notes move AssistPro to models deployed through Microsoft Foundry in v7.4.0 (21 October 2026; the note says "Azure AI Foundry") and fix an error in v7.4.1, so check whether the AssistPro limits still apply.
- **Status.** Nerdio pages differ on preview status, especially for AssistPro; see the companion article before you plan around it.

## A review routine for a generated script

1. **Name the kind of script in the prompt.** Nerdio's guide says a runbook must be requested explicitly. Check that the draft matches the kind you chose under **Endpoints > Automation > Scripted Actions**.
2. **Check the header.** Nerdio's guide says every scripted action must start with a comment line that describes it, and that the next line can hold tags, for example `#tags: Nerdio, Preview`.
3. **Check the Variables block against the code.** Names, descriptions and the required flag must match what the script does, and in a runbook the block must keep the JSON form shown on Nerdio's runbook variables page (Description, IsRequired, DefaultValue). Nerdio documents a param block for Windows scripts instead, and its pages do not say whether Windows scripts evaluate this comment block, although the guide's Windows sample carries one. Recheck it after every rename.
4. **Read the whole script.** In Nerdio's guide the model showed only the last requested change, so the author had to ask for the full script.
5. **Check how errors surface.** Our recommendation is to confirm that a failing command stops the script, including native programs, as described in the companion article "Writing a safe scripted action: parameters, secrets and testing".
6. **Test in layers.** Run it on a development host, then through Nerdio on one VM, then in bulk with a failure threshold. The same companion article details those layers.

## A worked review: Nerdio's own sample

The guide is a ChatGPT session, not Nerdio Copilot, so read the points below as lessons about reviewing any model's output. It starts from the gallery script **Optimize Microsoft Edge for WVD**. Appendix A holds the full source as of Step 7; later steps appear only as snippets and screenshots. Its header reads "(PREVIEW) Configures policy settings for Microsoft Edge to optimize performance in AVD". It writes five values under `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Edge` with `reg add`: `SleepingTabsEnabled` 1, `StartupBoostEnabled` 1, `HardwareAccelerationModeEnabled` 0, `MaxRasterThreads` 2 and `ContinueRunningBackgroundAppsWhenMicrosoftEdgeIsClosed` 0. Then it logs a variable to the Windows event log. Nerdio presents it as a sample of the process, and applying the routine above to Appendix A raises these points:

- **A rename the guide does not show through.** Appendix A still uses `VNetName`. In Step 8 the guide asks the model to change `VNetName` to `LogString`, and the output, shown as a screenshot, has the logging lines renamed. The guide does not show the full script after that step, so it is not visible whether the Variables block was renamed too. Check that block yourself after any rename.
- **An example description that does not fit.** The Variables block carries the example description the guide's author typed into the Step 6 prompt ("VNet in which to create the temp VM", with access to the FSLogix file share), although the script only logs the value as a message. The block is also marked `IsRequired: true`, which the Step 6 prompt asked for, so a value that is only logged is required.
- **Unbalanced braces.** The Variables block in Appendix A opens two braces and closes one, by our count, whereas the example on Nerdio's runbook variables page, which documents the block for runbooks, is balanced, so confirm that the block is valid before relying on it.
- **An event source nothing creates.** The script calls `Write-EventLog` with the source "Nerdio Script". Learn says that to write an event, "the source must be registered for the event log", and the appendix contains no step that registers one. Confirm the source exists on the target host or the logging line may fail. Learn documents this cmdlet under Windows PowerShell 5.1, which matters if you test the script in a newer PowerShell version.
- **No exit-code check after `reg add`.** `reg add` is a native program, so a failure will not necessarily stop the script, as covered in the companion article.
- **Policies chosen for you.** The script's own notes say disabling hardware acceleration "may improve performance on systems with limited resources". Whether that suits your hosts, for example GPU-enabled ones, is your decision, not the model's.

None of this means the assistant is unusable. It shows that a draft that reads well can still contain mismatches, and that a review is short compared with an unreviewed bulk run, which can touch every host in a pool.

## A review routine for a generated KQL query

AnalyticsPro's example asks for active users in the past hour. Before running anything on a conclusion:

1. **Pin down the term.** "Active" could mean connected, signed in or generating activity. Decide which, then check the query uses it.
2. **Check the table.** The query must read a table that your diagnostic settings actually fill. Our companion article "Useful KQL queries for Azure Virtual Desktop diagnostics" names tables and settings for queries copied from Learn.
3. **Run a short range first.** Try a narrow time window and read the rows, not only the summary.
4. **Compare with a known number.** Match the count against something you can see elsewhere, such as current sessions in the AVD portal.

## Which tasks suit an assistant

| Task | Fit (our assessment) | Why |
|---|---|---|
| Find where a setting lives in Nerdio Manager | Good | Answers cite Help Center articles you can open. |
| Draft a script for one VM | Good as a draft | Review and test as above. |
| Draft a KQL question about usage | Good as a draft | Compare with a known value. |
| Change many hosts at once | Draft only | Use a test host and a failure threshold; the Copilot help page does not describe it checking blast radius. |
| Decide policy or security settings | Poor | The Copilot help page describes no validation of the model's choices. |
| Read environment data from an external agent | Separate feature | MCP is read-only and Public Preview. |

## Related

- [Nerdio AssistPro](https://www.m365.fm/entity/nerdio-assistpro/)
- [Nerdio Manager for Enterprise](https://www.m365.fm/entity/nerdio-manager-for-enterprise/)
- [Nerdio scripted actions](https://www.m365.fm/entity/nerdio-scripted-actions/)
- [KQL](https://www.m365.fm/entity/kql/)
- [Azure Virtual Desktop](https://www.m365.fm/entity/azure-virtual-desktop/)

## Sources

- [Nerdio Help: Manage Nerdio Copilot](https://nmehelp.getnerdio.com/hc/en-us/articles/30352365570957-Manage-Nerdio-Copilot)
- [Nerdio Help: Generate Scripted Actions with ChatGPT](https://nmehelp.getnerdio.com/hc/en-us/articles/26124343795597-Generate-Scripted-Actions-with-ChatGPT)
- [Nerdio Help (Nerdio Manager for MSP): Overview of AssistPro](https://nmmhelp.getnerdio.com/hc/en-us/articles/25498285239565-Overview-of-AssistPro)
- [Nerdio Help (Nerdio Manager for MSP): NMM Release Notes](https://nmmhelp.getnerdio.com/hc/en-us/articles/360055385832-NMM-Release-Notes)
- [Nerdio Help: Windows Scripted Actions: Usage, Supported Features, and Considerations](https://nmehelp.getnerdio.com/hc/en-us/articles/26124368713741-Windows-Scripted-Actions-Usage-Supported-Features-and-Considerations)
- [Nerdio Help: Scripted Actions: Azure runbooks variables integration](https://nmehelp.getnerdio.com/hc/en-us/articles/26124313271053-Scripted-Actions-Azure-runbooks-variables-integration)
- [Nerdio Help: Nerdio Manager MCP Connector](https://nmehelp.getnerdio.com/hc/en-us/articles/49256623957133-Nerdio-Manager-MCP-Connector)
- [Nerdio Help: Release Notes](https://nmehelp.getnerdio.com/hc/en-us/articles/19837802929677-Release-Notes)
- [Learn: Write-EventLog](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/write-eventlog)
