---
title: "Microsoft Workflows in Teams and Microsoft 365: What They Are and How to Automate Work"
summary: "Microsoft uses the name Workflows for two things: the Workflows app in Teams, built on Power Automate, and the Workflows agent in Microsoft Copilot. Learn how each is opened, what it can do and where the limits are."
status: review
publish: false
author: mirko-p
date: 2026-12-01
topics: [teams, power-automate, workflows-agent, copilot]
keypoints:
  - "The Workflows app in Teams creates Power Automate flows from templates, from a description in the workflow builder, or from scratch."
  - "The Workflows agent in Microsoft Copilot turns a plain-language prompt into a workflow for Outlook, Teams, SharePoint, Planner and Approvals."
  - "The Workflows agent requires the Frontier program, is English only and its workflows cannot be shared, according to Microsoft Support."
  - "Flows made in the Teams Workflows app always land in the organization's default Power Automate environment."
  - "Conditional Access policies must match between Teams and Power Automate, or authentication errors can appear."
faq:
  - q: "What is the Workflows app in Microsoft Teams?"
    a: "According to Microsoft Support, it is a Teams app for creating, finding and managing workflows that automate everyday tasks. Microsoft Learn adds that you open it from Apps in Teams and that it must be enabled in the Teams admin center."
  - q: "Is Workflows in Teams the same as Power Automate?"
    a: "Not exactly. Microsoft Learn says flows created in the Workflows app are stored in the default environment and are also accessible from Power Automate. Selecting Create a flow opens the full Power Automate designer inside Teams, so the app is a Teams entry point to the same flow engine."
  - q: "What is the Workflows agent in Microsoft Copilot?"
    a: "Microsoft Support describes it as an agent that automates work across Microsoft 365. You describe a task in natural language and it generates a workflow using supported services. It is available through the Frontier program."
  - q: "Can I share a workflow built with the Workflows agent?"
    a: "No. Microsoft Support lists that workflows cannot be shared among its limitations. It also lists English-only support, a limited set of Microsoft 365 connectors and no automatic fixing of errors in existing workflows."
  - q: "Where do I find non-Microsoft connectors?"
    a: "Microsoft Support says non-Microsoft and custom connectors are not supported by the Workflows agent and points to Power Automate for advanced and non-Microsoft scenarios."
---

Microsoft currently uses the word Workflows for two related features. One is the Workflows app in Microsoft Teams, which creates Power Automate flows from inside Teams. The other is the Workflows agent in Microsoft Copilot, which builds a workflow from a sentence you type. Both automate routine work such as sending a message, requesting an approval or posting an update. They differ in access, scope and limits, which is the part most guides skip.

## Workflows app in Teams

### What it is

Microsoft Support describes the app as a place to create, find and manage workflows that automate everyday tasks. The Support page marks it as public preview that might change before general release, so confirm the status in your tenant. Microsoft Learn adds that it must be enabled in the Teams admin center.

### Open it

Per Microsoft Learn, select **Apps** in the left pane and then **Workflows** at the bottom, or search for "workflows" under Apps and select **Open**. Microsoft Support also lists other entry points:

- In a chat or channel, select **More options** next to the name, then **Workflows**.
- On a message, select **More options** > **More actions** > **Create new action**.
- In the compose box, select **Actions and apps**, then **Workflows**.

### Create a workflow

Microsoft documents four paths:

1. **From a template.** Open the **Create** tab and select a template. By default only Teams-optimized templates show, and filters at the top right show all Power Automate templates. Name the flow, sign in to the required services (a green check means authenticated), select **Continue**, enter parameters and finish. The flow then appears on the **Home** tab.
2. **From a message.** Use **More actions** > **Create new action** to see templates with the "For a selected message" manual trigger.
3. **With the workflow builder.** Open Workflows from a chat or channel, select **Workflow builder** and describe the task, for example emailing managers when a team finishes a sprint. Review the suggested flow, select **Next**, sign in to the apps, select **Create flow**, add steps with **New step** and select **Done**. The Flow checker flags errors, and Support warns that suggestions may not match your description.
4. **From scratch.** Select **Create a flow** at the top right. This opens the full Power Automate designer inside Teams.

### Manage workflows

In your workflow list, **More actions** offers **Edit**, **Turn on** or **Turn off**, **Details** and **Delete**. On the details page you can add a co-owner under **Owners**.

### Known issues and admin notes

- Flows created in the app always go into the organization's default environment, and they are also visible at make.powerautomate.com.
- Teams exchanges a token with Power Automate. Microsoft Learn recommends targeting the **Office 365** app or **All cloud apps** in Conditional Access. If you target individual apps, include **Microsoft Flow Service** alongside Teams with matching requirements, or authentication errors can occur.
- The Learn page does not cover licensing, premium connector rules or quotas. Check the Power Automate licensing documentation for those.

## Workflows agent in Microsoft Copilot

### What it is

Microsoft Support describes Workflows as an agent in Microsoft Copilot that automates work across Microsoft 365. You describe the task, and it generates a working workflow. Workflows can run on a schedule or in response to events, collect input through Teams adaptive cards and be tested and managed in a visual designer. A Microsoft 365 blog post gives an example: a Teams update every Monday that lists launch deadlines and key tasks from Planner.

### Access

- You must be in the Frontier program, which Support describes as early access to experimental features that may change.
- Sign in to Microsoft Copilot, select **Agents** in the left navigation and add **Workflows Agent (Frontier)**.
- The Support page says it is rolling out to Frontier early access for Microsoft 365 Personal, Family, Premium and Pro plans, starting in the United States in English, and that users with a Microsoft Copilot license can add the agent with the same steps.

### Create a workflow

1. Open **Workflows Agent (Frontier)** under Agents.
2. Write a prompt that states the schedule, the data source such as your inbox, the processing rules, the output format and the destination such as a Teams channel.
3. Name the services you want. The agent may ask you to confirm a Teams channel or SharePoint site.
4. Review the generated workflow, save it and test it in chat or with **Test** on the workflow page.

The **Activity** page shows each trigger and action with its status. From the ellipsis menu you can turn a workflow on or off, or delete it. Deletion cannot be undone.

### Supported building blocks

Support lists a limited set: recurrence and AI actions; Prompt Copilot; Outlook actions such as get emails, send email and create event; Teams actions such as post message, post adaptive card and create chat; SharePoint add, list and delete item; Planner list my tasks; Approvals create approval and wait for response; and Office 365 Users profile and manager lookups.

### Limitations stated by Microsoft

- Review and test AI-generated workflows before production use.
- Workflows cannot be shared.
- Non-Microsoft and custom connectors are not supported. Use Power Automate for those cases.
- It cannot automatically fix errors in existing workflows.
- Similar site or channel names can send a workflow to the wrong target.
- Workflows is available only in English.

### Admin prerequisites

Support lists DLP and Power Platform requirements. The DLP policy must include the SharePoint, Approvals, Teams, Planner, M365Copilot and Outlook connectors plus AI actions, and the AI prompt feature must be enabled in the Power Platform admin center. Access is controlled in the Microsoft 365 admin center under **Copilot** > **Settings** > **Agents**.

## Which one should you use?

| Need | Better fit, per the documentation |
|---|---|
| A quick automation from a chat, channel or message in Teams | Workflows app in Teams |
| Pick from ready templates | Workflows app, **Create** tab |
| Describe the automation in plain language and test it in chat | Workflows agent, or the workflow builder in Teams |
| Non-Microsoft or custom connectors | Power Automate |
| Share the automation with colleagues | Teams app flows with a co-owner, since agent workflows cannot be shared |

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Power Automate](https://www.m365.fm/entity/power-automate/)
- [Workflows agent](https://www.m365.fm/entity/workflows-agent/)
- [Microsoft 365 Copilot](https://www.m365.fm/entity/copilot/)

## Sources

- [Microsoft Support: Get started with the Workflows app in Microsoft Teams](https://support.microsoft.com/en-US/Teams/apps-service/get-started-with-the-workflows-app-in-microsoft-teams)
- [Microsoft Support: Create a workflow automatically in Microsoft Teams](https://support.microsoft.com/en-US/teams/apps-service/create-a-workflow-automatically-in-microsoft-teams)
- [Microsoft Learn: Workflows app in Microsoft Teams](https://learn.microsoft.com/en-au/power-automate/teams/teams-app-create)
- [Microsoft Support: Get started with Workflows in Microsoft 365 Copilot](https://support.microsoft.com/topic/get-started-with-workflows-in-microsoft-365-copilot-8c6aba25-db31-443d-8319-bc79747b280a)
- [Microsoft 365 Blog: Microsoft 365 Copilot now enables you to build apps and workflows](https://microsoft.com/en-us/microsoft-365/blog/2025/10/28/microsoft-365-copilot-now-enables-you-to-build-apps-and-workflows)
