---
title: "The New Microsoft Copilot: Home, Code and Autopilot Explained"
summary: "What Microsoft announced on 25 September 2026: Copilot Home, Code and Autopilot, how licensing and billing split, what admins control, and which parts were in Frontier or preview."
status: review
publish: false
author: mirko-p
date: 2026-12-03
topics: [copilot, copilot-cowork, frontier-program, agent-365]
keypoints:
  - "Home is the new starting point in Copilot and brings Chat and Cowork together. Microsoft says Copilot will route requests to Chat, Cowork or Code."
  - "Code lets non-developers build small apps, dashboards and automations from a description, in a sandbox that can be hosted inside the customer's tenant."
  - "Autopilot, previously called Scout, is a cloud agent with its own identity, memory, computer and workspace, governed by permissions and audit."
  - "Chat and Copilot in Office apps run on user licenses. Cowork, Code and Autopilot run on usage-based billing, with admin cost controls in Agent 365."
  - "Microsoft's pages I read do not use the label Wave 4, and the announcement dates were targets that Microsoft says can change."
faq:
  - q: "What are Copilot Home, Code and Autopilot?"
    a: "According to Microsoft's announcement of 25 September 2026, Home is the new starting point where Chat and Cowork come together. Code lets people without a developer background build small purpose-built solutions from a natural-language description. Autopilot is a persistent, cloud-hosted agent that works on ongoing tasks toward goals the user sets."
  - q: "Is this called Copilot Wave 4?"
    a: "Not in the Microsoft pages I read. Neither the Microsoft blog post nor the Microsoft Source post uses the phrase Wave 4. The video title and some commentary use it, but the official announcement calls it the new Copilot with Home, Code and Autopilot."
  - q: "How is the new Copilot licensed?"
    a: "Microsoft's announcement describes two models. A user subscription license covers Chat and Copilot in Word, Excel, PowerPoint, Outlook and Teams. Usage-based billing covers agentic work such as Cowork, Code and Autopilot. The announcement says Microsoft is evolving Copilot pricing and links to separate details."
  - q: "How do I get early access?"
    a: "Microsoft says Home and Code roll out through the Frontier program. According to Microsoft Learn, an admin turns Frontier on in the Microsoft 365 admin center under Copilot, Settings, by searching for Copilot Frontier and choosing No access, All users, or Specific users and groups."
  - q: "What can admins control?"
    a: "Microsoft names Agent 365 cost management for Cowork, Code and the Managed Runtime, with Copilot Studio agents planned for October. Admins can set spending policies through an API, route credit requests into approval workflows, limit model families per user group and manage plugins centrally in the plugin registry."
---
Microsoft announced the new Copilot on 25 September 2026 as three parts: Home, Code and Autopilot. Home is the starting point that combines Chat and Cowork. Code builds small apps and automations from a description. Autopilot is a persistent cloud agent that works toward goals you set. Some commentary and the video titles call this Copilot "Wave 4". The Microsoft pages I read do not use that label, so this article uses Microsoft's own names. The announcement gave rollout targets, and the October update post says its dates are tentative and subject to change.

## What Home is

According to the announcement, Home is the new starting point in the Copilot app, where Chat and Cowork come together in one place. Chat handles quick questions, lookups and drafts. [Cowork](https://www.m365.fm/entity/copilot-cowork/) runs delegated tasks from start to finish. Microsoft gives an RFP response and a financial close package as examples.

Microsoft also says that soon users will not need to pick a mode, because Copilot will route each request to Chat, Cowork or Code. Word, Excel and PowerPoint are integrated, so Copilot can create or update editable files, and content stays synchronized with the Office apps. A proactive command center called Today was planned for private preview in October.

The October update post adds details for the Copilot app: Home navigation with a shared navigation pane was listed for Frontier in October and worldwide in November, and Projects, which group chats, tasks, instructions and files, were listed for Cowork in October and Copilot Chat in November.

## What Code is

Code lets non-developers build small, purpose-built solutions from natural-language descriptions. Microsoft names desktop widgets, interactive dashboards and cloud-hosted internal apps. It uses the same underlying technology as GitHub Copilot and runs in a sandboxed environment that can be hosted within the customer's tenant.

Hosting runs on the Microsoft Copilot Managed Runtime, which was in preview at announcement. IT governs it, and users can share apps, connect them to live data and open them from anywhere. Microsoft says the runtime supports apps built in Cowork, Code and Copilot Studio, and that it plans to open it to third-party and pro-code developers.

## What Autopilot is

Autopilot, previously called Scout, is a persistent, proactive agent. A user gives it a name, role and goal. It can watch channels, follow up on threads, run recurring work and resume projects days later. It lives in the tenant with its own identity, memory, computer and workspace, and it appears in Teams, Outlook, chats and documents, where it can be @mentioned. Microsoft states that permissions, audit and governance apply. The announcement planned private preview to expand by the end of September, and the October update post lists Frontier in November.

## Licensing and billing

Microsoft describes two models:

| Model | Covers |
|---|---|
| User subscription license | Chat, and Copilot in Word, Excel, PowerPoint, Outlook and Teams, including Auto model selection |
| Usage-based billing | Cowork, Code, Autopilot, new long-running agentic capabilities and frontier models |

Auto weighs accuracy, speed and cost on each request to choose a model. The announcement says Microsoft is evolving Copilot pricing. The pages I read give no prices.

## What admins can control

- **Cost management.** Agent 365 cost management extends to Cowork, Code and Managed Runtime, with Copilot Studio agents planned for October. Learn describes Agent 365 cost management as tracking Copilot Credit use by user, group, agent and service, with spending limits.
- **Spending policies.** Admins can set them at scale through an API, route credit requests into existing approval workflows and see usage.
- **Model access.** Admins can set which model families each user group can use, which also limits what Auto can select.
- **Plugin registry.** A unified catalog for Microsoft, partner and custom plugins. IT approves and manages plugins centrally.
- **Agent visibility.** According to Learn, [Agent 365](https://www.m365.fm/entity/agent-365/) gives one view of agents in the organization through the agent registry in the Microsoft 365 admin center.

The October update post lists two related admin items: Purview retention for Copilot memory and a Purview data loss prevention policy for Cowork, in public preview.

## How to get early access through Frontier

Microsoft says Home and Code roll out through the [Frontier program](https://www.m365.fm/entity/frontier-program/). Learn gives these steps for admins:

1. Sign in to the Microsoft 365 admin center.
2. Go to **Copilot** > **Settings**.
3. Select the **View all** tab and search for **Frontier**.
4. Select **Copilot Frontier** and choose **No access** (the default), **All users** or **Specific users and groups**.

Features can take up to three hours to appear. The admin needs the AI Administrator, Security Administrator or Office Apps Administrator role. Users do not need a Copilot license to be enrolled, but Copilot-related Frontier features need one.

Learn also lists cautions. Frontier features are preview and may change or be discontinued, may not be covered by standard support commitments, and do not include HIPAA Business Associate Agreement coverage. Some Frontier experiences may be paid.

## What this means in practice

- Treat the Frontier items as a pilot. Check which of Home, Code and Autopilot your tenant actually has before you plan around them.
- Decide who pays. Cowork, Code and Autopilot use usage-based billing, so set spending policies before you open them to many users.
- Plan governance first: the plugin registry, model access and Agent 365 views are admin tasks.
- Do not rely on dates from the announcement. Re-read the monthly update post before you set expectations.

## Related

- [Microsoft 365 Copilot](https://www.m365.fm/entity/copilot/)
- [Copilot Cowork](https://www.m365.fm/entity/copilot-cowork/)
- [Microsoft Agent 365](https://www.m365.fm/entity/agent-365/)
- [Microsoft Frontier program](https://www.m365.fm/entity/frontier-program/)

## Sources

- [Introducing the new Copilot with Home, Code and Autopilot (Microsoft blog, 25 September 2026)](https://blogs.microsoft.com/blog/2026/09/25/introducing-the-new-copilot-with-home-code-and-autopilot/)
- [New Microsoft Copilot brings Home, Code and Autopilot together (Microsoft Source EMEA)](https://news.microsoft.com/source/emea/2026/09/new-microsoft-copilot-brings-home-code-and-autopilot-together/)
- [What's new in Microsoft Copilot: October 2026 (Microsoft Tech Community)](https://techcommunity.microsoft.com/blog/microsoft-copilot-blog/what's-new-in-microsoft-copilot--october-2026/4568528)
- [Get started with the Microsoft Copilot Frontier program (Microsoft Learn)](https://learn.microsoft.com/microsoft-365/admin/manage/get-started-frontier)
- [Overview of Microsoft Agent 365 (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-agent-365/overview)
