---
title: "Shared Copilot Agent That Colleagues Cannot Add: An Admin Settings Checklist"
summary: "You built a Copilot agent and sent it to colleagues, but they see an error that blocks installing it. Check the share dialog, the admin center agent settings, licenses and ownership in this order."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [copilot-agent-builder, copilot-studio, microsoft-365-admin-center, agent-registry]
keypoints:
  - "Sending a link is not the same as sharing: in one 2026 thread the whole problem was an agent that was never shared."
  - "Three separate admin settings decide what happens: who may share agents, which agent types are allowed, and who may use agents at all."
  - "Agent Builder sharing and Copilot Studio sharing are different mechanisms with different roles and different documentation."
  - "Org-wide sharing that is not honored, while direct sharing works, was reported but has no confirmed fix."
faq:
  - q: "What does 'Your organization has prevented this agent from being installed' mean?"
    a: "It is a block message that users see when the agent cannot be installed for them. In a 2026 thread the cause was simple: the creator had sent a link but had not shared the agent. Other possible causes are admin settings in the Microsoft 365 admin center under Agents, Settings, such as the sharing rule, the allowed agent types or the user access setting."
  - q: "Where do admins control who can share agents built with Agent Builder?"
    a: "In the Microsoft 365 admin center under Agents, then Settings, in the Sharing section. Microsoft Learn lists three options: all users, specific users or groups, and no users. With no users, org-wide sharing is off and the toggle in the share dialog is grayed out. Changes only affect new sharing actions."
  - q: "Does the user access setting hide an agent or block it?"
    a: "According to Microsoft Learn, if user access is set to specific users or groups, other users may still be able to install an agent from the registry, but they cannot use it. This can look like an agent that is visible but not usable."
  - q: "Do users need a Microsoft 365 Copilot license?"
    a: "Learn says agent capabilities depend on the user's Microsoft 365 Copilot license, and users without the needed license may get an error. Check the license for the affected user before you change any tenant setting."
---

A colleague builds an agent in Microsoft 365 Copilot, shares it, and the people it was meant for cannot add it. They see a message such as "Your organization has prevented this agent from being installed" or "You don't have permissions to add this agent. Please contact your IT admin for help".

Three Microsoft Q&A threads from April to August 2026 show different versions of this. In one, the maker had only sent a link. In another, an agent was visible under "Built by your org" but users could add it only after being named as a viewer. In a third, an admin handed an agent to a new owner, who could not find it. This article puts the checks in a sensible order. It is not an official Microsoft procedure. Menu names in the Microsoft 365 admin center change often, so compare each step with the current Learn page.

## Which kind of agent is it?

The checks differ:

- **Agent Builder agents** are made inside Microsoft 365 Copilot. They are shared from the share dialog, and sharing is controlled by an admin setting.
- **Copilot Studio agents** are shared from Copilot Studio and may be published to the Microsoft 365 Copilot channel.

Microsoft Learn says the admin sharing setting applies only to agents built with Agent Builder. Learn also says it does not cover how Copilot Studio sharing works with the Microsoft 365 Copilot channel. Keep that gap in mind.

## Step 1: Check that the agent is actually shared

The thread with a confirmed resolution is the simplest one. The asker came back and wrote that they had sent a link to colleagues but never shared the agent.

For Agent Builder, the Learn page describes the share dialog as follows:

- Add people, groups or email addresses and pick a role. **Can chat** lets people use the agent. **Can edit** makes them an owner. Groups can only get **Can chat**.
- Turn on **Org-wide sharing for chat access** to let everyone in the tenant find the agent in the Agent Store and chat with it.
- The dialog also offers copy links. Learn does not say whether a link alone gives access to someone who was not shared with. Do not assume it does.

Test: share the agent with one named colleague, ask them to look for it, and then widen the sharing.

## Step 2: Check the admin sharing rule

In the Microsoft 365 admin center, go to **Agents**, then **Settings**, and open the sharing setting.

| Setting | Effect according to Learn |
|---|---|
| All users | Everyone can share with the organization. This is the default. |
| Specific users or groups | Broad sharing is limited to those people. |
| No users | Org-wide sharing is off. Users can still share directly with named people. The toggle in the share dialog is grayed out. |

Learn adds that changes apply to new sharing actions only. An agent that was already shared keeps the access it had until someone changes it.

## Step 3: Check which agent types are allowed

Learn describes a section for agent and plugin access with separate switches for agents built by Microsoft, by your organization, and by external publishers. If a type is off, its agents do not show in the Agent Store.

In the August 2026 thread, an advisor named a page called "Allowed agent types". The current Learn page calls the same area agent and plugin access, so the label has changed or the thread used an older name. Look for the switch for agents built by your organization.

## Step 4: Check user access

The user access setting is also under **Agents**, **Settings**. Learn lists three options:

- **All users** is the default.
- **No users** means nobody in the organization can access agents and plugins.
- **Specific users or groups** limits use to those people. Learn says other users may still be able to install from the agent registry, but they cannot use the agent.

The last option fits the picture in the "visible but cannot add" thread. An AI-generated answer in that thread pointed to it. The asker did not confirm that this was the cause, so treat it as a candidate to rule out, not as the answer.

## Step 5: Check the agent's status and requests

An advisor in the August thread suggested two more places in the admin center: the list of all agents, to see whether the agent is blocked, and the requests page, in case an admin approval is waiting. Learn says that agents published by an organization need approval before users can use them, and that admins manage agents and requests in the agent registry. The Learn page does not give exact menu paths for blocking, unblocking or approving. The paths in the thread are reported by an advisor, so verify them in your own admin center.

## Step 6: Check licenses

Learn states that what an agent can do depends on the user's Microsoft 365 Copilot license, and that users without the required license may get an error. Copilot Studio sharing has its own rule on the Learn page. It says you can share only with users who have a Copilot Studio per-user license, and unlicensed users can sign up for a trial. Compare this with your agent type before you blame a setting.

## Step 7: If an admin changed the owner

In the April 2026 thread, an admin changed the owner of an Agent Builder agent in the admin center. The new owner could not find it in the Agents area of the Copilot Chat page. The asker found it by choosing **New agent** and then **Agent Builder**, where the agent was listed. The asker described this as a navigation issue, not a permission problem.

Learn confirms that admins can reassign ownership of shared agents, but it does not say where the new owner finds the agent. Treat the thread result as reported.

## Step 8: Copilot Studio agent shown to everyone but not installable

One August 2026 thread reported a Copilot Studio agent that was published with the option to show it to everyone in the organization, listed under "Built by your org", and still not addable by licensed users. When the asker added a user as a viewer, that user could add and use the agent. Removing the viewer entry brought the error back. Republishing did not change this.

An AI-generated answer, which the asker accepted, pointed to the admin center settings above and suggested direct assignment as a workaround. The asker's own comments said that organization-wide permission looked like it was not being honored. No Microsoft staff reply and no confirmed root cause appear on the page.

What you can do today:

1. Run through steps 2 to 4 and 6 above.
2. Share with a security group instead of relying on the organization option. Learn says a Copilot Studio agent can be shared with security groups, and that sharing needs user authentication set to manual with Microsoft Entra ID and the setting that requires sign-in. Microsoft 365 groups that are not security enabled cannot be used for chat sharing.
3. If a group does not help, note the time, the agent name, the user and the exact message, and open a support case.

## Verification

After each change:

1. Ask a test user with a Copilot license to sign out and back in, then look for the agent in the Agent Store.
2. Try to add it.
3. Start a chat and ask a question that needs the agent's knowledge.

Learn does not say how long admin center changes take to apply. A thread about an agent that only appeared after eight hours, or after signing out and back in, is unresolved, so allow time and test with a fresh session before you undo a setting.

## Limits of this checklist

- Only the "link was not shared" case has a confirmed solution in the threads.
- The org-wide sharing case and the ownership case rest on single threads.
- Admin center labels differ between the threads and the current Learn pages.

## Related

- [Copilot Agent Builder](https://www.m365.fm/entity/copilot-agent-builder/)
- [Microsoft Copilot Studio](https://www.m365.fm/entity/copilot-studio/)
- [Microsoft 365 admin center](https://www.m365.fm/entity/microsoft-365-admin-center/)
- [Agent registry](https://www.m365.fm/entity/agent-registry/)

## Sources

- [Microsoft Learn: Agent settings in the Microsoft 365 admin center](https://learn.microsoft.com/en-us/microsoft-365/admin/manage/agent-settings)
- [Microsoft Learn: Manage agents in the Microsoft 365 admin center](https://learn.microsoft.com/microsoft-365/admin/manage/manage-copilot-agents-integrated-apps)
- [Microsoft Learn: Share and manage agents built in Agent Builder](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/agent-builder-share-manage-agents)
- [Microsoft Learn: Share agents with other users in Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/admin-share-bots)
- [Microsoft Q&A: Copilot created agent, your organization has prevented this agent from being installed (August 2026)](https://learn.microsoft.com/en-us/answers/questions/5968801/copilot-created-agent-your-organization-has-preven)
- [Microsoft Q&A: Users can see Copilot agent in Built by your org but cannot add it (August 2026)](https://learn.microsoft.com/en-us/answers/questions/5965007/users-can-see-copilot-agent-in-built-by-your-org-b)
- [Microsoft Q&A: Created an agent on Copilot Chat and assigned a new owner, the new owner doesn't see it (April 2026)](https://learn.microsoft.com/en-us/answers/questions/5852788/created-an-agent-on-copilot-chat-agent-builder-and)
- [Microsoft Q&A: Intermittent post-deployment issues with Copilot agent using SharePoint knowledge sources (August 2026)](https://learn.microsoft.com/en-us/answers/questions/5984936/intermittent-post-deployment-issues-with-copilot-a)
