---
title: "Turn SharePoint Lists into Apps and Dashboards with Copilot"
summary: "What Copilot can do with a SharePoint list today: create lists, add views and rules, generate a live HTML dashboard, and when a Power Apps canvas app is the better route. Sources and gaps noted."
status: review
publish: false
author: mirko-p
date: 2026-12-04
topics: [sharepoint, microsoft-lists, copilot, power-apps]
keypoints:
  - "Copilot in SharePoint can create lists from a prompt or an Excel file, add views, rules and conditional formatting, and propose changes that you approve before they apply."
  - "A dashboard generated from a list is an interactive HTML report that refreshes from the list each time it is opened. It requires a Microsoft 365 Copilot license."
  - "For a real data-entry app with add, edit and delete, Microsoft Learn documents a different route: Integrate > Power Apps > Create an app from the list."
  - "Microsoft's pages I read describe views and dashboards from lists. They do not describe a one-click Copilot feature that turns a list into a full app."
  - "Existing permissions and access controls continue to apply to views that Copilot creates."
faq:
  - q: "Can Copilot turn a SharePoint list into an app?"
    a: "Microsoft's adoption material describes Copilot creating lists, views, rules, formatting and interactive HTML dashboards from list data. Microsoft Learn documents a separate Power Apps route that generates a canvas app from a list. The pages I read do not describe a single Copilot feature that builds a full data-entry app from a list."
  - q: "What license does Copilot in SharePoint need?"
    a: "The August 2026 Microsoft SharePoint blog states that Copilot in SharePoint requires a Microsoft 365 Copilot license. The same post says dashboards generated from lists refresh from the list each time they are opened."
  - q: "What is the SharePoint list agent?"
    a: "A Message Center post describes it as a Microsoft 365 Copilot agent that creates SharePoint lists from natural-language requests and can turn structured Copilot content, such as tables, into lists. It requires a Microsoft 365 Copilot license, and the post says admins can turn it off in Org Settings."
  - q: "How do I create a Power Apps app from a list?"
    a: "According to Microsoft Learn, open the list, select Integrate, then Power Apps, then Create an app. You can preview the app and then select Save and publish. The generated app is a single-screen, responsive canvas app for browsing, viewing, adding, editing and deleting items."
  - q: "Do Copilot-created views change permissions?"
    a: "No. Microsoft Support says views don't duplicate or move items and only change how items are displayed, and that existing permissions and access controls continue to apply."
---

Copilot can help you build a lot around a SharePoint list: the list itself, views, rules, formatting and a live dashboard. A full data-entry app is a different job, and Microsoft documents a separate Power Apps route for it. This article separates the two, so you pick the right tool and know where the documentation stops.

## What counts as an "app" here

People use "app from a list" for two different things:

1. A **Copilot-built view or dashboard** on top of the list, mostly for reading, filtering and reporting.
2. A **Power Apps canvas app** generated from the list, for browsing, adding, editing and deleting items.

Microsoft's pages I read document both, but not as one feature. Keep that in mind when you plan the work.

## What Copilot in SharePoint can do with lists

Microsoft's adoption material lists these list capabilities:

- Create, edit and manage lists in natural language.
- Build a structured list from an uploaded file such as Excel, where each row becomes an item.
- Create filtered views, for example only at-risk projects, and set them as the default.
- Add automation and alerts, such as an email when a status changes.
- Apply conditional formatting to color-code rows and columns.

Copilot proposes list changes and you approve them before they apply. That approval step is the main safety net, so read each proposal.

A separate Message Center post describes the **SharePoint list agent**, which creates lists from a request in Copilot or from structured content Copilot has generated. It requires a Microsoft 365 Copilot license. The post says that at general availability the agent is on by default for tenants with Copilot, and that admins can switch it off under Settings > Org Settings > Copilot Agents > SharePoint list agent. I read this post through a mirror site, so verify the path in your admin center.

## Create a view with Copilot

Microsoft Support gives these steps:

1. Open the library or list.
2. Open Copilot in SharePoint with the **Floating Button**.
3. Ask Copilot to create or fill columns. In a list it uses item metadata.
4. Create a new view that uses those columns.
5. Save the view.

Views only filter, group or sort what already exists. They don't copy or move items, you can switch between views any time, and existing permissions still apply. The page lists no license prerequisites, so use the August blog's statement that Copilot in SharePoint requires a Microsoft 365 Copilot license.

## Generate a live dashboard from a list

The August 2026 SharePoint blog says Copilot can generate a dashboard directly from a list as an interactive HTML report. It refreshes from the list each time it is opened. Excel and CSV files can also be sources.

The example prompt in the post asks for health, milestones, risks, budget and owner views, with filters and charts that stay in sync with the list. Suggested uses include project status, inventory, approval pipelines, recruiting and customer escalations.

The September 2026 post adds that tenant-specific HTML guidance helps AI assistants produce HTML that works inside SharePoint's sandbox, and that it supports reports that stay connected to list data with links back to source items.

Caveats from the August post: Microsoft said some customers hit throttling near the upper end of preview usage patterns, and it was still evaluating its general availability approach. The post gives no general availability date.

## When a Power Apps app is the better choice

If users need to add and edit items in a proper form, use Power Apps. Microsoft Learn describes it this way:

1. Open the list in SharePoint or Microsoft Lists.
2. Select **Integrate** > **Power Apps** > **Create an app**.
3. Select **Preview the app**, then **Save and publish**.

You can also start in Power Apps with **Start with data**, choose **SharePoint**, connect to the site, select the list and select **Create app**.

The result is a single-screen, responsive canvas app for browsing items, viewing details and adding, editing or deleting records. Changes are written back to the list. The Learn page does not mention Copilot for this flow, and it doesn't name a specific license tier for it. On-premises lists need a data gateway.

## Decision help

| Need | Route documented |
|---|---|
| New list from a description or spreadsheet | Copilot in SharePoint or the list agent |
| Filtered views, rules, formatting | Copilot in SharePoint |
| Read-only interactive report | Copilot dashboard (HTML report) |
| Form-based data entry app | Power Apps canvas app from the list |

## Common mistakes

- Designing columns poorly and expecting Copilot to fix it. Views and dashboards can only show what is in the list.
- Approving Copilot's list changes without reading them.
- Sharing a dashboard widely without checking list permissions. Existing permissions continue to apply to views, so check who can open the source list.
- Expecting editing inside an HTML report. Treat it as a reporting surface.

## What the sources do not cover

The Microsoft pages I read do not describe a Copilot feature called HTML list views, and they do not document a one-click lists-to-apps feature. The August post links to a video titled "Turn SharePoint Lists into Live Apps with Copilot" but does not describe it beyond dashboards. A commenter on that post reported that Copilot could not yet create or edit lists for them, and the post did not answer. If you need these exact features, test them in a pilot site first.

## Related

- [SharePoint](https://www.m365.fm/entity/sharepoint/)
- [Microsoft Lists](https://www.m365.fm/entity/microsoft-lists/)
- [Microsoft Copilot](https://www.m365.fm/entity/copilot/)
- [Power Apps](https://www.m365.fm/entity/power-apps/)

## Sources

- [What's new in Copilot in SharePoint, August 2026 (Microsoft Tech Community)](https://techcommunity.microsoft.com/t5/microsoft-sharepoint-blog/what-s-new-in-copilot-in-sharepoint-august-2026/ba-p/4535421)
- [What is new in Copilot in SharePoint, September 2026 (SharePoint blog, mirrored)](https://www.elevenforum.com/t/what-is-new-in-copilot-in-sharepoint-for-september-2026.49187/)
- [AI in SharePoint in Action (Microsoft Adoption)](https://adoption.microsoft.com/files/conference-resources/techcon-chicago/2026/AI%20in%20SharePoint%20in%20Action.pdf)
- [Create views in a library or list (Microsoft Support)](https://support.microsoft.com/en-US/SharePoint/copilot-in-sharepoint/create-views-in-a-library-or-list)
- [SharePoint list agent, Message Center MC1208689 (mirrored)](https://www.itelio.com/en/microsoft-message-center/MC1208689)
- [Create a canvas app from a SharePoint list (Microsoft Learn)](https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/app-from-sharepoint)
