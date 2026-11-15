---
title: "Copilot Studio Agent Approval Requests in the Microsoft 365 Admin Center"
summary: "How a Copilot Studio agent is submitted for admin approval, where the request appears in the Microsoft 365 admin center, how to publish, reject or update it, and which roles and limits Microsoft Learn documents."
status: review
publish: false
author: mirko-p
date: 2026-12-17
topics: [copilot-studio, copilot-governance, microsoft-365-admin-center, copilot]
keypoints:
  - "A maker submits an agent from Copilot Studio with Availability options > Show to everyone in my org > Submit for admin approval."
  - "Admins find the request under Agents > All agents > Requests in the Microsoft 365 admin center and can publish it or reject it."
  - "Requests carry a state: Pending review, Pending update or Pending activate. Until an update is approved, users keep the previous version."
  - "Publishing opens a wizard for audience, an optional preinstall group, a policy template and the permission consent."
  - "The agents admin guide lists AI Admin, Global Admin and Global Reader (view-only) and recommends the least privileged role. No page read names the role for publishing."
faq:
  - q: "Where do Copilot Studio agent approval requests appear?"
    a: "Microsoft Learn says an agent published from Copilot Studio is displayed in the Requests tab of the All agents list in the Microsoft 365 admin center. For agents submitted for admin approval, the path is Agents > All agents > Requests."
  - q: "What can an admin do with a requested agent?"
    a: "Microsoft Learn lists two main actions: publish the agent, labeled Publish to store on one page and Publish on another, or reject the submission. A rejected agent gets the status Rejected, stays visible in the Requests list and is not made available to members of the organization."
  - q: "What happens when the maker updates an approved agent?"
    a: "The Microsoft Learn page on agent requests says the update appears with the status Update pending, and users continue to use the previous version until the admin approves it with Update in store. Copilot Studio says a new approval is needed only when the agent details change, not for content updates."
  - q: "Who can approve agents?"
    a: "The Microsoft Learn agents admin guide lists AI Admin, Global Admin and Global Reader (view-only, no edit) for configuring, managing and deploying agents, and recommends the least privileged role needed. The activation page says activation requests need AI admin approval. The pages read do not name a specific role for publishing a requested agent, so verify that in your tenant."
  - q: "Can users request third-party agents through this workflow?"
    a: "No. Microsoft Learn states that the request and approval workflow for blocked agents supports only Microsoft-built agents. Users cannot request third-party agents in the admin center, and administrators, including Global Administrators, cannot approve access to them there."
---

An approval workflow for Copilot Studio agents already exists, and it has two sides. The maker submits the agent for admin approval from Copilot Studio. An administrator then reviews the request in the **Requests** list of the Microsoft 365 admin center and publishes or rejects it. This article follows Microsoft Learn for both sides.

## How the workflow fits together

Learn describes the flow like this. When a member of the organization publishes an agent to the tenant, the agent needs administrator approval before it becomes available tenant-wide. The admin center receives all metadata about the agent definition, including the description, owner, data and tools. The admin reviews it and then publishes or rejects it, and can scope the audience to specific users or groups, or everyone.

The same list also holds agents created with Microsoft Foundry or the Microsoft 365 Agents Toolkit when they are submitted for approval.

## Step 1: The maker submits the agent

In Copilot Studio, the agent must have been published at least once. Then:

1. Open the agent, select **Channels** and the **Teams and Microsoft 365 Copilot** tile.
2. Select **Availability options**.
3. Confirm the agent is not shown to teammates or shared users. Remove it if it says **Added to Teams**.
4. Select **Show to everyone in my org**.
5. Review the requirements and select **Submit for admin approval**, then **Yes**.

Learn adds several points for makers:

- Once submitted, a different user cannot resubmit the agent until an admin approves or rejects the previous submission.
- Remove the agent from the **Built with Power Platform** section first, or it may show up in two places.
- After submission, do not change the agent's access setting to less than everyone in the organization. Otherwise users cannot chat with the agent after installing it.
- A new approval is needed only if agent details such as icon or description change. Content updates can be published without a new approval.
- After the admin approves, the status changes to **Approved**. Until then the maker can check the status with **Refresh**.

## Step 2: The admin reviews the request

1. Sign in to the Microsoft 365 admin center.
2. Select **Agents** > **All agents** > **Requests**.
3. Select the agent and read the details. Confirm capabilities, data sources, security and permissions, and the custom actions the agent can invoke.

Learn lists three request states: **Pending review**, **Pending update** and **Pending activate**. You can filter the list by state and by channel, such as Microsoft Teams, Copilot, Outlook, Word, Excel or PowerPoint. If expected agents are missing, check for a filter that is still set.

The pages read for this article use different labels for the same step. The Copilot Studio page refers to the **Data & tools** tab, the agent requests page to the **Available** tab, and the publish action appears as **Publish** or **Publish to store**. Learn does not explain the difference, so use whichever your tenant shows.

## Step 3: Publish or reject

Choose **Publish to store** to start the publishing wizard. The steps Learn lists are:

1. Select the users or groups that can install the agent.
2. Optionally select users or groups who get it preinstalled.
3. Choose a policy template: an existing, the default or a custom template.
4. In **Review permissions**, review what the agent requests and grant admin consent if appropriate.
5. Review the settings and select **Publish**.

The Copilot Studio page describes the scope choice more briefly: everyone, no one or specific users or groups.

Once published, the agent is part of the agent inventory, and the selected members can find it in Microsoft Copilot. If the maker deployed it to Teams, members can reach it there too. Learn notes that the maker also governs whether visibility is tenant-wide or limited.

To reject, select the action next to the agent name, or use the ellipsis and **Reject submission**. The status becomes **Rejected**, the agent is not published, and you can still see its metadata for reconsideration or audit.

## Step 4: Handle updates and activation

When a developer publishes an update to an approved agent, the update shows as **Update pending**. Users keep the previous version until you select **Update in store**. Learn says the update appears in the **Pending approval** list, while the rest of that page calls the list **Requests**. I read both as the same list.

Activation is a related governance step. When a user asks to activate an agent so they can create instances, the request needs AI admin approval. The admin reviews the same details, scopes the audience, applies a template and reviews permissions. The default template provides controls from Microsoft Entra, Microsoft Purview and SharePoint and assigns the license automatically. The policy table on the same page also lists Microsoft Defender entries. Learn notes that AI Administrators are not authorized to configure Conditional Access policies or Microsoft Entra access package policies. Those actions need a highly privileged role.

## Roles

The agents admin guide lists **AI Admin**, **Global Admin** and **Global Reader** (view-only, no edit) for configuring, managing and deploying agents. It recommends the least privileged role for the task, because Global Admin has more permissions than many tasks need. The page does not say which role can publish or reject a requested agent. Only the activation page names AI admin approval, and only for activation.

## Related admin actions

If an agent causes problems after publishing, the same list offers **Block** and **Unblock** for the whole organization, **Install** and **Uninstall**, and **Delete**. A deleted agent is kept for 30 days and can be restored. Learn also warns that admin actions can fail on agents in an environment with the Power Platform IP firewall in active enforcement mode, because the request comes from an upstream service IP.

Teams-side approval has its own place. The Copilot Studio page says admins manage agents in the **Built for your org** section separately in the Teams admin center on the **Manage apps** page.

## Typical mistakes

- Submitting an agent while it is still shown in **Built with Power Platform**.
- Setting agent access to a smaller audience after submission.
- Expecting content changes to need a new approval, or detail changes not to need one.
- Searching the list with an old filter still active.
- Expecting to approve third-party agent requests in the admin center.

## What the sources do not say

The pages read for this article do not describe notification emails sent to makers or admins (the activation page only says the requester is notified), and they do not state a time limit for review. They also do not explain how the Requests list in the Microsoft 365 admin center and the Teams admin center approval relate when both apply, so test one agent end to end before you rely on a process.

## Related

- [Copilot Studio](https://www.m365.fm/entity/copilot-studio/)
- [Copilot governance](https://www.m365.fm/entity/copilot-governance/)
- [Microsoft 365 admin center](https://www.m365.fm/entity/microsoft-365-admin-center/)
- [Copilot](https://www.m365.fm/entity/copilot/)

## Sources

- [Agent Requests in Microsoft 365 Admin Center](https://learn.microsoft.com/en-us/microsoft-365/admin/manage/agent-requests?view=o365-worldwide)
- [Manage requested Copilot Studio agents](https://learn.microsoft.com/en-us/microsoft-365/copilot/agent-essentials/agent-lifecycle/agent-copilot-studio-requested)
- [Governance and Lifecycle actions for agents available in Microsoft 365 admin center](https://learn.microsoft.com/en-us/microsoft-365/admin/manage/agent-actions?view=o365-worldwide)
- [Agents admin guide for Microsoft 365](https://learn.microsoft.com/en-us/microsoft-365/copilot/agent-essentials/m365-agents-admin-guide)
- [Connect and configure an agent for Teams and Microsoft 365 Copilot](https://learn.microsoft.com/en-us/microsoft-copilot-studio/publication-add-bot-to-microsoft-teams)
