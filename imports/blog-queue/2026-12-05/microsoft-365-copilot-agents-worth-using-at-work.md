---
title: "Microsoft 365 Copilot Agents Worth Using at Work: A Practical Guide"
summary: "Which Microsoft-built Copilot agents exist, what each does, how to find and add them, and how to choose by task. Based on Microsoft Support and Learn, with no ranking that Microsoft does not publish."
status: review
publish: false
author: mirko-p
date: 2026-12-05
topics: [copilot, ai-agent, copilot-studio, copilot-agent-builder]
keypoints:
  - "Microsoft lists three built-in agents in the Copilot left navigation: Analyst, Researcher and Visual Creator."
  - "Idea Coach, Writing Coach, Prompt Coach, Learning Coach and Career Coach are added by the user through All agents."
  - "Open Agents in the left navigation at microsoft365.com/copilot, select an agent, or add one from All agents."
  - "Admins can install, block and remove agents, and can block Researcher and Analyst tenant-wide."
  - "Microsoft publishes no ranking of the best agents, so choose by task and test with real work."
faq:
  - q: "Which Copilot agents does Microsoft build itself?"
    a: "According to Microsoft Support, the built-in agents are Analyst, Researcher and Visual Creator. Agents you add yourself include Idea Coach, Writing Coach, Prompt Coach, Learning Coach and Career Coach. The page says more agents are coming."
  - q: "How do I open an agent in Microsoft 365 Copilot?"
    a: "Microsoft Support describes four steps: sign in at microsoft365.com/copilot, select Agents in the left navigation panel, select an agent, and if it is not listed, go to All agents and add it."
  - q: "Why is an agent missing or returning an error?"
    a: "Microsoft Support says you may lack a Microsoft Copilot license, or your administrator may not have enabled the agent. Feature availability depends on your subscription type, so check which license your plan includes."
  - q: "Can an administrator control which agents people use?"
    a: "Yes. Microsoft Learn describes three installation paths: Microsoft-installed, admin-installed and user-installed agents. Admins can install, block and remove agents for some or all users, and can block Researcher and Analyst tenant-wide, which grays out the per-user and per-group controls."
  - q: "Can I build my own agent instead?"
    a: "Learn says users can install their own custom agents built with SharePoint, Agent Builder in Microsoft Copilot or Copilot Studio. Such agents are used by individuals and can optionally be shared in the organization, subject to the admin's policies."
---

There is no official top list of the best Copilot agents, and a ranking from a single test would only describe that test. The useful question for work is which agent fits which task. Microsoft Support documents a small set of Microsoft-built agents, and Microsoft Learn explains how they get into a user's Copilot. This guide maps both to everyday jobs and leaves out claims the documentation does not make.

## The agents Microsoft documents

The Support article "Agents built by Microsoft" splits them in two groups.

**Built-in agents** appear in the left navigation panel under **Agents**:

| Agent | What Microsoft says it does |
|---|---|
| Analyst | Turns raw data into insights, visualizes trends, and supports forecasts and business-metric analysis |
| Researcher | Gathers in-depth research from academic and industry sources and identifies citations to support credibility |
| Visual Creator | Turns ideas into visuals, prototypes, videos or virtual scenarios from a description |

**Agents you add yourself** do not show in the navigation until you add them through **All agents**:

| Agent | What Microsoft says it does |
|---|---|
| Idea Coach | Generates and refines ideas and turns them into action plans |
| Writing Coach | Gives AI feedback on tone, grammar and style for emails, reports and documents |
| Prompt Coach | Teaches how to structure prompts for more useful responses |
| Learning Coach | Helps master subjects and build study plans |
| Career Coach | Helps students and institutions build skills, set goals and plan careers |

## Choosing by task

The table below is a suggestion built from those descriptions, not a Microsoft recommendation.

| Task | Agent to try first |
|---|---|
| Make sense of a spreadsheet or look for trends | Analyst |
| Research a topic and keep the sources visible | Researcher |
| Turn a rough idea into a visual or prototype | Visual Creator |
| Improve a draft email or report | Writing Coach |
| Learn to ask Copilot better questions | Prompt Coach |
| Plan a study path | Learning Coach |

Check any output from Researcher against its citations, and any Analyst result against the source data. The Support page describes what the agents are meant to do. It does not give accuracy figures.

## How to open an agent

1. Sign in at microsoft365.com/copilot.
2. Select **Agents** in the left navigation panel.
3. Select an agent.
4. If the agent you want is not listed, go to **All agents** and add it.

## If an agent is missing

Support gives two causes: you may not have a Microsoft Copilot license, or your administrator may not have enabled the agent. Feature availability depends on the subscription, so check the license first. Then ask the admin whether the agent is blocked.

## How agents get into Copilot

Microsoft Learn describes three paths.

1. **Microsoft-installed agents.** Researcher and Analyst are preinstalled or pinned for licensed users. Admins can block them tenant-wide. Users can share and unpin them.
2. **Admin-installed agents.** Admins can install custom, Microsoft-built or partner-built agents, place them on the Copilot rail, or make them available through the Agent Store in Microsoft Copilot. They can install, block and remove agents for some or all users.
3. **User-installed agents.** Users can install agents from the Agent Store, subject to admin policy. They can also create their own with SharePoint, Agent Builder in Microsoft Copilot or Copilot Studio, and optionally share them.

The Learn page also notes that disabling or restricting Copilot extensibility affects non-Microsoft agents as well.

## Terms and data protection

Microsoft Learn says Researcher and Analyst are governed by the Supplementary Terms of Service for Teams apps powered by Microsoft 365 services and applications. That document refers to the Microsoft 365 Product Terms and, by reference, the Data Protection Addendum. The same Product Terms and Data Protection Addendum govern the Microsoft Copilot service. For a compliance review, start from those documents rather than from marketing pages, and ask legal to confirm how they apply to your tenant.

## For admins: a short rollout plan

- Decide whether Researcher and Analyst stay on for everyone. Blocking them tenant-wide removes the finer controls.
- Pick one or two pilot agents per team, based on a real recurring task.
- Document which agents are approved and who may share custom ones.
- Review the Microsoft 365 admin center article on managing agents for the current steps. The page I read does not give menu paths.

## Typical mistakes

- Judging an agent after one prompt. Test with three real tasks.
- Expecting a missing agent to be a bug. It is often a license or admin setting.
- Sharing custom agents widely before anyone has checked what data they use.
- Treating a coach agent as a reviewer of facts. The descriptions cover style and structure.

## What the sources do not say

The pages I read give no usage statistics, benchmark results or ranking. They also do not list which license tier unlocks each agent beyond the general Copilot license point. A claim such as "the five best agents out of one hundred" would need its own test method and data, which is not in Microsoft's documentation.

## Related

- [Microsoft 365 Copilot](https://www.m365.fm/entity/copilot/)
- [AI agent](https://www.m365.fm/entity/ai-agent/)
- [Copilot Studio](https://www.m365.fm/entity/copilot-studio/)
- [Copilot Agent Builder](https://www.m365.fm/entity/copilot-agent-builder/)

## Sources

- [Agents built by Microsoft (Microsoft Support)](https://support.microsoft.com/en-us/microsoft-365-copilot/agents-built-by-microsoft)
- [Copilot agent installation and governance (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-365/copilot/copilot-agent-install)
