---
title: "Copilot Studio Agent Missing in the Microsoft 365 Mobile App: How to Make It Appear"
summary: "Your shared Copilot Studio agent works on desktop but phone-only users cannot find it. See why install links fail on mobile and how org-catalog publishing and admin approval fix it."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [copilot-studio, microsoft-365-admin-center, agent-registry, teams-admin-center]
keypoints:
  - "Microsoft Learn says installation links cannot be used in the Teams mobile app. Users who only own a phone need the agent shown in the app store of their organization."
  - "In a June 2026 thread, the accepted answer was to submit the agent with 'Show to everyone in my org', let an admin approve it, and deploy it to the target users."
  - "Sharing with specific people is not enough for mobile-only users, because the 'Shared with you' route depends on an install link or the store on desktop or web."
  - "Learn points to two admin locations (Manage apps in the Teams admin center and Requests in the Microsoft 365 admin center). Check both if you cannot find the submission."
faq:
  - q: "Why does my Copilot Studio agent show on desktop but not on my phone?"
    a: "Microsoft Learn says installation links cannot be used in the Teams mobile app, and that the agent must be shown in the Teams app store to reach mobile users. In a June 2026 community thread, users who had installed the agent once on desktop or web saw it on mobile afterwards, while phone-only users could not add it. That thread's accepted answer called this a platform limitation and pointed to org-wide publishing with admin approval."
  - q: "Do I need an admin to make the agent available on mobile?"
    a: "For the route that Learn documents for mobile users, yes. 'Show to everyone in my org' submits the agent to the org catalog and an admin has to approve it. After approval, Learn says users find the agent under 'Built for your org' in the Teams app store or under 'Built by your org' in the Microsoft 365 Agent Store."
  - q: "Can users add the agent from the mobile app itself?"
    a: "A June 2026 thread says agents cannot be added directly from the Microsoft 365 mobile app and that users must add them on desktop or web first. One reply in the same thread also said the Agent Store exists on Android and iOS. The Learn pages used for this article do not confirm that, so test it with a pilot user before you promise it."
  - q: "After approval, can I narrow the access again?"
    a: "Learn warns against it. After you submit the agent for admin approval, do not reduce the access level below everyone in the organization. Otherwise people in the organization can install the agent but cannot chat with it."
---

A colleague opens the Microsoft 365 app on a phone and cannot find the agent you built in Copilot Studio. On a laptop, the same person can open your link, add the agent, and chat with it. After that, the agent even shows up on the phone. But a person who only has a phone has no way to get started.

This pattern was described in a Microsoft Community Hub thread from June 2026. The agent was published to the Teams and Microsoft 365 channels and shared with specific users. All users had the same Copilot license. The thread has a marked and confirmed solution, and this article checks that solution against current Microsoft Learn pages. It is a troubleshooting guide, not an official Microsoft procedure.

## What the symptoms look like

- The agent was published at least once and works for people on desktop or web.
- People who open the install link on a computer can add the agent. After that, it appears in the mobile app.
- Mobile-only users do not see the agent in the app, and the install link does nothing useful on the phone.
- Licenses and sharing look correct.

## Why this happens

Microsoft Learn is direct about one part of this. In the article about connecting an agent to Teams and Microsoft 365, it says that installation links cannot be used in the Teams mobile app. To reach mobile users, the agent has to be shown in the Teams app store.

Learn also lists where users can find a Copilot Studio agent. These places are not equal for phone users:

- The **Shared with you** section of the Microsoft 365 Agent Store, for shared users only.
- The installation link, which Learn says you cannot use in the Teams mobile app.
- **Built for your org** in the Teams app store, after admin approval.
- **Built by your org** in the Microsoft 365 Agent Store, after admin approval.
- The Teams app bar, if an admin pins the agent with an app setup policy.

The thread's marked solution matches this. It described the problem as a platform limitation, not a user mistake, and recommended publishing the agent to the whole organization so that an admin can approve it.

## Step 1: Check the basics

Before you change the publishing mode, rule out the prerequisites that Learn lists:

1. The agent has been published at least once.
2. Users have access to Microsoft Copilot.
3. Power Platform apps are allowed in Teams. Learn says that if they are not allowed, users cannot install the agent directly or find it in the Teams app store.
4. The agent is shared with the users. Learn says to share it first so they can install it and chat with it.

If the agent uses a connector or flow that needs a connection for each user, also read the sharing page of Copilot Studio. It notes that such users need the **End user access** permission, and that connections are tied to each person's identity.

## Step 2: Confirm the channel is on

In Copilot Studio, open the agent and go to **Channels**. Select the **Microsoft 365 and Microsoft Teams** tile. Learn describes this order:

1. Under **Turn on Microsoft 365**, select **Make agent available in Microsoft Copilot** if you want the agent in Copilot. Without this option, the agent is available only in Teams.
2. Select **Add channel**.
3. Publish the agent again if you changed anything.

## Step 3: Choose the right availability option

Open **Availability options** on the same page. Learn describes three choices:

- **Copy link** gives you an installation link. Only people who can access the agent can use it.
- **Show to my teammates and shared users** adds the agent to the **Shared with you** section of the Microsoft 365 Agent Store.
- **Show to everyone in my org** submits the agent for admin approval. You select **Submit to org catalog** and then **Yes** at the confirmation prompt.

For people who only use a phone, the first two options are the weak ones, because Learn says an installation link cannot be used in the Teams mobile app. The org catalog route is the one the thread's marked solution used.

## Step 4: Approve and deploy the agent as an admin

After the maker submits the agent, an admin has to act. Microsoft Learn describes this in two places, and they do not name the same portal:

- The Copilot Studio page says the submission is sent to your admin for approval and that admins manage agents in **Built for your org** separately on the **Manage apps** page of the **Teams admin center**. It does not say where the review itself happens. The maker can check the status with **Refresh** or from **Make the agent available to others** on the **Publish** page. After approval, the status changes to **Approved**.
- The Microsoft 365 admin center page about agent requests gives this path: **Agents** > **All agents** > **Requests**. It says that administrator approval is needed before an agent is available across the tenant, and that agents created with Copilot Studio can be submitted for approval.

The thread said the admin approves under **Copilot** > **Agents** in the Microsoft 365 admin center. That wording does not match the Learn path exactly, so follow Learn and look for the request under **Agents** > **All agents** > **Requests**.

In the Microsoft 365 admin center, the steps for a request in the state **Pending review** are:

1. Select the requested agent and review its details.
2. Select **Publish to store** to open the wizard.
3. Choose the users or groups who can install the agent. You can also choose people to preinstall it for.
4. Choose a policy template and review permissions.
5. Select **Publish**.

If the requests list looks empty, Learn gives a tip: check whether a filter, such as the state or channel filter, is active.

Admins can also use an app setup policy to install and pin the agent in the Teams app bar. Learn lists this as an option, not as a requirement.

## Step 5: Tell users where to look

After approval, ask the affected users to look in these places:

1. In the Teams app store, the **Built for your org** section.
2. In the Microsoft 365 Agent Store, the **Built by your org** section.

Learn adds a practical warning. Teams caches app data. If the new agent does not appear, sign out and in again on desktop, or refresh the browser on web. For the phone, closing and reopening the app is a reasonable first test, but Learn does not describe that step.

## Step 6: Use the interim workaround if you cannot wait for approval

Two replies in the thread describe the same temporary workaround. A user installs the agent once on desktop or web. After that, the agent appears in the mobile app. One reply added that the team simply sent the agent's direct link and had everyone open it once in the Microsoft 365 web experience.

Learn only says that installation links cannot be used in the Teams mobile app, so a link opened on a computer is the part that works. It is a workaround for people who have a computer at hand. It does not help someone who owns only a phone. The second reply was not marked as a solution and the person who asked did not confirm it.

## How to verify the fix

1. Pick one pilot user who has no desktop access to the agent.
2. Confirm in the admin center that the agent status is approved and that the pilot user is in the audience.
3. Ask the pilot user to open the Teams app store or the Microsoft 365 Agent Store on the phone and look for the agent in the sections above.
4. Ask the pilot to send one question and check that the agent answers. This also tests access, not only visibility.

## Limits and open points

- The thread's marked solution said that the Agent Store is available on Android and iOS after org publishing. The Learn pages used here only state that installation links do not work in the Teams mobile app and that the agent must be shown in the Teams app store. The Agent Store on mobile is therefore a community statement, not a confirmed Learn statement.
- In the same thread, the person who asked wrote that Microsoft support had told them the goal was impossible. After the marked answer, that person confirmed the problem was solved. The thread does not say which store section they used on the phone.
- An older Q&A thread from 2025 about agents missing in the Copilot mobile app has no confirmed solution. One answer there relayed that mobile support was still planned at that time. That relay came from a community member and is not attributed to a Microsoft employee, so treat older answers with care because mobile support may have changed since.
- Learn warns about side effects once the agent is approved: changes to details, descriptions or the icon need a new approval, content-only changes do not, and users who installed from a link may not see detail changes until they reinstall.
- Do not reduce access below everyone in the organization after submitting for approval, or org users may not be able to chat with the agent.
- Knowledge sources that need user authentication, such as SharePoint, do not work in group or channel chats. Those agents work only in one-to-one chats. This is not a mobile problem, but it often shows up in the same rollout.

## Related

- [Microsoft Copilot Studio](https://www.m365.fm/entity/copilot-studio/)
- [Microsoft 365 admin center](https://www.m365.fm/entity/microsoft-365-admin-center/)
- [Agent Registry](https://www.m365.fm/entity/agent-registry/)
- [Teams admin center](https://www.m365.fm/entity/teams-admin-center/)

## Sources

- [Microsoft Learn: Connect and configure an agent for Teams and Microsoft 365](https://learn.microsoft.com/en-us/microsoft-copilot-studio/publication-add-bot-to-microsoft-teams)
- [Microsoft Learn: Manage agent requests in the Microsoft 365 admin center](https://learn.microsoft.com/en-us/microsoft-agent-365/admin/agent-requests)
- [Microsoft Learn: Manage agents in the Microsoft 365 admin center](https://learn.microsoft.com/en-us/microsoft-365/admin/manage/manage-copilot-agents-integrated-apps)
- [Microsoft Learn: Share agents with other users](https://learn.microsoft.com/en-us/microsoft-copilot-studio/admin-share-bots)
- [Microsoft Community Hub: Copilot Studio agent not visible in M365 mobile app without desktop access (June 2026)](https://techcommunity.microsoft.com/discussions/copilot-studio/copilot-studio-agent-not-visible-in-m365-mobile-app-without-desktop-access/4524492)
- [Microsoft Q&A: I can't see agents in Copilot 365 mobile app (2025)](https://learn.microsoft.com/en-us/answers/questions/2279430/i-cant-see-agents-in-copilot-365-mobile-app)
