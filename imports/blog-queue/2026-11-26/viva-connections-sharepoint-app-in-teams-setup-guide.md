---
title: "Viva Connections in Teams: Setup and Best Practices (Now the SharePoint App in Teams)"
summary: "Viva Connections is now called the SharePoint app in Teams. What changed, the licenses, how to set up a home site, pin the app, build the dashboard and plan content, with notes on pages that may be outdated."
status: review
publish: false
author: mirko-p
date: 2026-11-26
topics: [viva-connections, teams, sharepoint-home-site]
keypoints:
  - "Microsoft Learn now calls Viva Connections the SharePoint app in Teams. Existing configurations, custom app names and logos keep working."
  - "Home sites are created in the SharePoint admin center under Settings > SharePoint apps > Home sites. Older pages describe a Microsoft 365 admin center console."
  - "An Enterprise, Frontline or Academic license is needed. One experience per tenant is the default and up to 50 need a Viva Suite or Viva Communications and Communities license."
  - "Plan around key tasks: Microsoft says not every task should become a dashboard card. Pick short, high-impact tasks and target them by audience."
  - "Pin the app in the Teams admin center under Teams apps > Setup policies. Status and rank-order changes can take up to 24 hours."
faq:
  - q: "Is Viva Connections renamed?"
    a: "Yes. The Microsoft Learn overview says the product is now the SharePoint app in Teams, formerly Viva Connections. A May 2026 Message center post (MC1304293) announced the rename, with Targeted Release from early May 2026 and general availability by late June 2026. It says existing branding, custom app names and logos stay the same."
  - q: "What do I need to set up the SharePoint app in Teams?"
    a: "Microsoft Learn says you need an Enterprise, Frontline or Academic license to create an experience, and SharePoint admin permissions. A home site is not a requirement for Viva Connections itself, though the new home site pages describe creating one in the SharePoint admin center. One experience is allowed per tenant, and up to 50 need a Viva Suite or Viva Communications and Communities license."
  - q: "How do I make the app appear in Teams for everyone?"
    a: "On the page I read, a Teams administrator pins it. In the Teams admin center go to Teams apps > Setup policies, open Global (Org-wide default), scroll to Pinned apps, select Add apps, search for the app by its name, add it and save. The setup page says status and rank-order changes for experiences can take up to 24 hours. It gives no propagation time for the pin itself."
  - q: "What are the main parts of the experience?"
    a: "Microsoft Learn lists News (SharePoint news, boosted news, followed and frequent sites), Dashboard (cards for tasks), Resources (curated links) and Announcements, which is available only in SharePoint home sites. An older overview also lists a Spotlight area and says the Feed was replaced by the News reader."
  - q: "How should I decide what goes on the dashboard?"
    a: "Microsoft's planning page says to identify key scenarios and owners, and warns that not every task should become a card. It recommends tasks that are most impactful and can be done in a short time, such as help tickets, pay information, news, directories and shifts, and to target cards to specific audiences."
---

Viva Connections still exists, but under a new name: the SharePoint app in Teams. It gives employees a branded landing page inside Teams with news, a dashboard of task cards and a list of resources. Setup now starts with a SharePoint home site, a Teams pin by an admin and a plan for what the dashboard should show.

Microsoft's pages are mid-transition. The overview and home site pages use the new name, while the older setup and planning pages still say Viva Connections and describe the Microsoft 365 admin center console. This article marks which is which.

## What changed

The Microsoft Learn overview, last updated in September 2026, says the product is now the SharePoint app in Teams, formerly Viva Connections. The home site page and Message center post MC1304293 describe the rollout: Targeted Release from early May 2026 and general availability by late June 2026.

According to those pages:

- Existing home sites, content, branding and look stay the same.
- Existing configurations, including custom app names and logos, keep working.
- SharePoint admins can create and designate home sites in the SharePoint admin center.
- A new Resources web part and a new Announcements web part are available.
- The extra Viva license requirement for Announcements was removed.
- For noncustomized experiences, Teams branding changes from Viva Connections to SharePoint.
- The Message center post says no action is required. It recommends informing the help desk and users.

## What it contains

The overview lists four components:

- **News:** SharePoint news, boosted news, followed and frequent sites and people the user works with.
- **Dashboard:** adaptive cards for tasks such as clocking in, training or pay information.
- **Resources:** curated links to popular destinations.
- **Announcements:** short messages, available only in SharePoint home sites.

An older overview page also lists a Spotlight area with up to 11 items and says the Feed is replaced by the News reader. It says up to 48 resource links can be created. Those pages may be out of date, so verify in your tenant.

## Licenses and roles

- An Enterprise (E), Frontline (F) or Academic (A) license is needed to create an experience.
- Users with those licenses are limited to one experience. Two or more, up to 50, need every user in the tenant to have a Viva Suite or Viva Communications and Communities license.
- Creating experiences needs SharePoint admin permissions. Pinning the app needs a Teams administrator or higher. Editing needs owner or member rights, and Microsoft recommends at least two owners per experience.

## Set it up

### Home site (current path)

From the home site page:

1. Open the SharePoint admin center and sign in with the SharePoint admin role.
2. Select **Settings**, then under **SharePoint apps** select **Home sites**.
3. Select **Add a home site**.
4. Choose **Create a new site** (use the Home site template, name it, add an owner, set language and time zone) or **Use an existing communication site** and enter its URL.
5. After setup, open the home site and select **Settings** to configure the SharePoint app in Teams.

### Older console path

The older setup page describes the Microsoft 365 admin center: **Settings** > **Viva** > **Viva Connections** > **Create and manage Viva Connections experiences**, then **+ Create new**. It covers permissions, audiences, order and an **Enable experience** checkbox in the **General** tab. That setup page says Viva Connections and SharePoint home site administration are being combined in the Microsoft 365 admin center, while the newer home site page describes creating home sites in the SharePoint admin center. I could not confirm which steps still apply in every tenant, so compare with what your admin center shows.

### Pin it in Teams

1. Open the Teams admin center and go to **Teams apps** > **Setup policies**.
2. Select **Global (Org-wide default)**.
3. Under **Pinned apps**, select **+ Add apps**, search for the app by the name you gave it, and add it.
4. Drag it to the top and select **Save**.

Microsoft says the app icon and name are managed at tenant level. The setup page says status and rank-order changes for experiences can take up to 24 hours.

## Build the dashboard

From the Learn page on editing the experience:

1. Select **Edit**. Default cards are Approvals, Assigned tasks, Shifts, Top news and Viva Learning. Remove or edit them.
2. Use the pencil icon to open a card's properties and set its size.
3. Add cards from the toolbox. Partner cards come from the SharePoint store. Custom cards are Adaptive Card Extensions built with SharePoint Framework.
4. Use **Preview** and choose desktop or mobile.
5. Apply audience targeting. The edit page says cards can be filtered by roles, regions or departments. The planning page says scenarios can be targeted with Microsoft 365 groups.

The banner has no draft state, so changes show to everyone when you save. Maximum card count is not stated.

## Best practices from Microsoft's planning page

- Start with a small team of stakeholders and write down key scenarios and owners.
- Do not turn every task into a card. Focus on high-impact tasks that take little time. Common examples are paystubs, help tickets, news, lunch menus, people directory and shift management.
- Ask for each scenario: who is the audience, what do they need to do, which tools do they use today.
- Prioritize modern sites. Classic sites open in a separate browser window instead of in Teams.
- Keep Resources to the most important and popular portals, and target them by audience.
- Know that dashboard cards refresh when users select Refresh or restart Teams, so an idle Teams window may show old data.
- Plan adoption with early adopters, office hours in the first month and guidance for frontline and hybrid users.
- Measure with Connections analytics, Microsoft 365 usage analytics and SharePoint site reports. A card linking to a Microsoft Form can collect feedback.
- Name a person or team to maintain it.

## Known limits

Organization branding is disabled for users in dark mode in Teams. Custom fonts are not supported on mobile. SharePoint Framework is the only customization option. A deleted experience leaves its site in the SharePoint admin center.

## Related

- [Viva Connections](https://www.m365.fm/entity/viva-connections/)
- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [SharePoint home site](https://www.m365.fm/entity/sharepoint-home-site/)

## Sources

- [Microsoft Learn: Overview of the SharePoint app in Teams (formerly Viva Connections)](https://learn.microsoft.com/en-us/viva/connections)
- [Microsoft Learn: Overview of Viva Connections](https://learn.microsoft.com/en-us/viva/connections/viva-connections-overview)
- [Microsoft Learn: Updates to SharePoint home sites](https://learn.microsoft.com/sharepoint/homesitesimprovements)
- [Message center post MC1304293, Updates to SharePoint home sites (read via the community mirror mc.merill.net)](https://mc.merill.net/message/MC1304293)
- [Microsoft Learn: Plan Microsoft Viva Connections for your organization](https://learn.microsoft.com/en-us/viva/connections/plan-viva-connections)
- [Microsoft Learn: Set up Viva Connections in the Microsoft 365 admin center](https://learn.microsoft.com/en-us/viva/connections/set-up-admin-center)
- [Microsoft Learn: Edit the Viva Connections experience](https://learn.microsoft.com/en-us/viva/connections/edit-viva-home)
