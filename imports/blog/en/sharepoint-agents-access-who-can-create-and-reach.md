---
title: "Agents in SharePoint: who can create them and what they can reach"
summary: "SharePoint agents access follows file permissions: anyone who can create files can create an agent, and answers depend on each user's access. See the controls."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [sharepoint-agents, copilot-governance, sharepoint-permissions, agent-sprawl]
keypoints:
  - "Agents in SharePoint are .agent files, and only users who can create or access files on a site can create or access agents there."
  - "Responses depend on each user's access to the data sources, so a user without access to a referenced site gets answers without that content."
  - "Users with a Copilot license can use SharePoint agents, and pay-as-you-go billing can cover users without one through a security group."
  - "Restricted access control, restricted content discovery and Purview DLP with sensitivity labels each limit what agents can use in different ways."
  - "Admins can review and block agents in the Microsoft 365 admin center, but Microsoft notes that blocking currently affects Copilot Chat only."
faq:
  - q: "Who can create an agent in SharePoint?"
    a: "Anyone who can create files on a SharePoint site. Microsoft states that agents are .agent files and that only users who can create or access files on a site can create or access agents there. To use agents, a user needs a Microsoft Copilot license, or access through pay-as-you-go billing set up by an admin for a security group."
  - q: "Can a SharePoint agent show content a user is not allowed to see?"
    a: "Microsoft states that agent responses depend on each user's permissions to the data sources. A user who has access to the agent but not to a referenced site or library gets responses that exclude that content. The agent file's own permissions decide who can open or edit the agent, which is a separate question."
  - q: "How do I stop agents from using a sensitive site?"
    a: "Use the site controls. Restricted access control limits the site to a named group, and only that group sees its content in Copilot. Restricted content discovery hides the agent icon, so users cannot use or create agents on the site. Purview DLP with a sensitivity label condition can exclude labeled items from processing."
---

SharePoint agents follow file permissions: anyone who can create files on a site can create an agent there, and what an agent answers depends on what each user can already open. That is the core of SharePoint agents access, and it is simpler than it first sounds. This article is for SharePoint admins who must say who can build agents, who can use them and what they can reach. You will learn the rules, the controls Microsoft names, the gaps to watch, and see a worked example with invented numbers.

## Who can create SharePoint agents?

Microsoft's page on [managing access to agents in SharePoint](https://learn.microsoft.com/en-us/sharepoint/manage-access-agents-in-sharepoint) states that agents are .agent files. Only users who can create or access files on a SharePoint site can create or access agents there.

So the creation right is not a separate setting. It follows the file permissions of the site. A person who is a member of a site with Edit rights can create an agent file in a library, and a person with Read rights cannot. This is why [SharePoint agents](https://www.m365.fm/entity/sharepoint-agents/) belong in your permission review: every Edit-level member is a possible agent author.

The page also says that the permissions on the .agent file decide who can access or edit the agent. That is a second layer. You can have access to the site and still not be allowed to open a specific agent file.

## Who can use them, and who pays?

Using an agent needs a license or a billing setup. According to the same page, users with a Microsoft Copilot license can use agents. For each user, admins can turn Microsoft Copilot for SharePoint on or off on the license details page.

For users without a Copilot license, admins can use pay-as-you-go billing that is assigned to a security group. Plan that group like any other access group: name an owner, and review its members.

Microsoft's [agents admin guide](https://learn.microsoft.com/en-us/microsoft-365/copilot/agent-essentials/m365-agents-admin-guide) adds that SharePoint agents require either pay-as-you-go enabled for SharePoint or a Microsoft 365 Copilot license. It also lists the admin roles for managing agents: AI Admin, Global Admin, or Global Reader for view-only access, with a recommendation to use the least privileged role.

## What does SharePoint agents access include?

Agents use SharePoint sites, pages and document libraries as knowledge sources. The page does not address scoping to folders or single files, so do not promise that to your users.

The key rule for reach is this: agent responses depend on each user's permissions to the data sources. A user who has access to the agent but not to a referenced site or library gets responses that exclude that content. So an agent does not widen access. It narrows to what the asking user can already open.

That is good news for governance, but it has a limit. If a library is open to the whole company, the agent built on it is open to the whole company too, as far as its answers go. The agent will not hide the problem. It will make the content easier to ask about, in the same way that Copilot does.

The Microsoft admin guide adds a point on sharing. Declarative SharePoint agents can be shared from SharePoint to Teams, based on existing permissions. They cannot be published to the organization catalog.

## Which controls limit what agents can use?

Microsoft's page names four site-level controls:

1. **Site access controls.** Agents can only reach what the people asking can already open, so site permissions and group membership come first. Check your [SharePoint permissions](https://www.m365.fm/entity/sharepoint-permissions/) first, because the other controls sit on top of them.
2. **Restricted access control.** It limits all access to a site or OneDrive to the group named in the policy. Only that group sees the content in Microsoft Copilot.
3. **Restricted content discovery.** It hides the agent icon on a site, so users cannot use the site's ready-made agent, create agents or add the site's content to other agents. Site access is unchanged, but the site's content is not surfaced in Microsoft Copilot or in organization-wide search.
4. **Microsoft Purview DLP.** You can create a custom policy with a condition on sensitivity labels. Labeled items are excluded from processing.

The page adds a gap: you cannot yet apply a sensitivity label directly to an .agent file, so the label route protects the content that agents read, not the agent files themselves.

Use these in combination. Restricted access control closes a site. Restricted content discovery hides it from agents. DLP keeps labeled files out of answers. Each solves a different problem, and none replaces a clean permission model. Keeping these choices written down is part of [Copilot governance](https://www.m365.fm/entity/copilot-governance/).

## How do admins see and block agents?

Tenant admins and AI admins can view and block or unblock agents in the Microsoft 365 admin center, under Agents in the Copilot Control System. The page says that blocking currently affects only Copilot Chat. It does not yet apply to OneDrive, SharePoint or Teams. So blocking is not a way to stop SharePoint agents today.

The admin guide describes an agent inventory with a Missing an owner filter for agents with no owner. It also recommends governance steps: review each agent's capabilities, knowledge sources and actions before assigning or deploying it, avoid oversharing by assigning agents only to users who need them, follow a staged rollout, and remove or reassign agents that have no owner.

Note that the inventory describes agents managed through the admin center, while SharePoint agents are .agent files that live in site libraries. A site owner can also designate one main agent for a site. So you may need a site-level check in addition to the inventory, and that is the core of [agent sprawl](https://www.m365.fm/entity/agent-sprawl/) in SharePoint.

A short review routine follows from Microsoft's recommendations. Before you assign an agent, review its capabilities, knowledge sources and actions. Give access only to the users who need it, which keeps oversharing down. Roll agents out in stages, starting with a pilot group. When an agent has no owner, reassign it or remove it. Block agents that your organization does not need. Write these five rules on one page and give it to every site owner, because the people who create agent files are site members, not admins.

Treat the page as a living document. Microsoft marks some agent features as still developing, and the blocking limit above is one example, so check the two Learn pages again each quarter and update your rules when the behavior changes.

## Example: 150 sites, three kinds of risk

The numbers are invented to show the method. A company has 150 sites and 400 Copilot-licensed users. The SharePoint admin runs a check on agent readiness.

1. **Authors.** About 900 users have Edit rights on at least one site, so about 900 could create agent files, even though only 400 have licenses. The admin decides that this is acceptable, because only licensed users can use agents, but notes it for review.
2. **Sensitive sites.** 12 sites hold confidential content. For 5 of them, the admin uses restricted access control with a named group. For 4, the admin uses restricted content discovery while owners fix permissions. For 3, the admin adds a DLP policy for the confidential label.
3. **Ownerless agents.** The admin finds 30 agent files with unclear owners in 10 old project sites. Owners are asked to confirm or delete them.

Count the effect. Of the 12 sensitive sites, all are covered by one control or another, and the team has a list of 30 agent files with owners to confirm. The admin also adds one sentence to the site owner guide: agents see what the asking user can see, so clean permissions come first.

## Common mistakes

- **Assuming agents have their own permissions.** They follow the asking user's access to the data.
- **Forgetting the agent file's own permissions.** They decide who can open or edit the agent.
- **Relying on blocking.** Microsoft says blocking currently affects Copilot Chat only.
- **Skipping sensitive sites.** Use restricted access control, restricted content discovery or DLP for them.
- **Ignoring ownerless agents.** Files without an owner are never reviewed.
- **No guidance for site owners.** Owners need to know what an agent file means on their site.

## How software can help

Start with the SharePoint admin center, the Microsoft 365 admin center agent inventory and the Purview audit log. For many sites, a script or reporting tool can list .agent files by site, owner and last change, and compare them with the permissions of the site. Compare the output of any tool with the admin center on a few sites first, and check what data the tool reads and where it stores it.

## Next step

List the sites that hold your most sensitive content and check which control covers them against agents: restricted access control, restricted content discovery or DLP. Then add one line about SharePoint agents access to your site owner guide.
