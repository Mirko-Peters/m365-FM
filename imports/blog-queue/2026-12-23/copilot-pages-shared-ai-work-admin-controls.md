---
title: "Copilot Pages: Shared AI-Assisted Work and Admin Controls in Microsoft 365"
summary: "What Copilot Pages are, how users keep a Copilot response as an editable shared page, where pages are stored, and how admins control them with Cloud Policy, licensing and network settings."
status: review
publish: false
author: mirko-p
date: 2026-12-23
topics: [copilot-pages]
keypoints:
  - "Copilot Pages is a persistent canvas next to Copilot chat. A response is moved to a page that opens side by side with chat, then edited and shared."
  - "Pages are stored as .page files in a user-owned SharePoint Embedded container shared with Loop My workspace. Storage counts against the SharePoint quota."
  - "Admins use Cloud Policy at config.office.com. The setting Create and view Copilot Pages and Copilot Notebooks is Enabled by default."
  - "Pages need a OneDrive license and active OneDrive site. A Microsoft 365 Copilot license is not required for pages according to Microsoft Support."
  - "Disabling creation does not delete existing pages. They stay discoverable through search and Purview and admins can export them."
faq:
  - q: "Do users need a Copilot license for Copilot Pages?"
    a: "Microsoft Support says a work or school account needs SharePoint or OneDrive storage and that a Microsoft 365 Copilot license is not required. The Learn requirements page lists a OneDrive license and an active OneDrive site for Pages, and a Copilot or Copilot Chat license for Copilot Notebooks."
  - q: "Where are Copilot Pages stored?"
    a: "Learn says pages are stored as .page files in a user-owned SharePoint Embedded container that is shared with Loop My workspace. The container application name appears as Loop in the SharePoint admin center, PowerShell and Purview audit data."
  - q: "How does an admin turn Copilot Pages off?"
    a: "Learn says they are controlled by Cloud Policy. At config.office.com select Customization, then Policy Management, create or edit a policy, and set Create and view Copilot Pages and Copilot Notebooks to Disabled for the chosen scope. Changes take up to 90 minutes if policies already existed, or up to 24 hours if none existed."
  - q: "What happens to existing pages when creation is disabled?"
    a: "Learn says existing items are not deleted. Users with permission can still view and edit them, they remain discoverable through search and Purview, and admins can export them. Sharing links to Copilot Notebooks do not work."
  - q: "What network access is needed for live editing?"
    a: "Learn says to allow WebSocket traffic to *.svc.ms and *.office.com, which enables live editing, presence and shared cursors, and to allow connections per the Office 365 URLs and IP address ranges."
---

Copilot Pages turns a useful Copilot response into a page that people can edit and share. For admins, the questions are who can create pages, where the content lives and how to switch it off for some users. This guide covers both sides using Microsoft Support and Microsoft Learn.

## What users get

Microsoft Support describes Copilot Pages as a dynamic, persistent canvas in Copilot chat designed for AI-powered group collaboration. The workflow it describes:

1. Chat with Copilot.
2. Move Copilot's response to a new page that opens side by side with chat.
3. Ask Copilot to update existing content or add new content.
4. Edit the page at any time, and ask questions about the page.

When the page is ready, you can share it. Colleagues can reach the page without access to your chat session. Real-time co-authoring is supported, but Support says AI responses may not reflect simultaneous edits until the page is refreshed. Pages can be converted to a Word document or PowerPoint presentation. The Support page notes the new Home starting point is still rolling out, so screens may differ.

Limits it lists: pages mainly work with Microsoft 365 content, deep layout customization is limited, heavy embedded content can be slow, and sparse source content can lead to generic suggestions.

## Requirements

- **Pages:** a OneDrive license and an active OneDrive site, per Learn. If the license is later removed from a user who already has a OneDrive site, existing pages keep working.
- **Notebooks:** a Microsoft Copilot or Copilot Chat license, a separate requirement.
- **Account:** Support says a work or school account needs SharePoint or OneDrive storage and no Microsoft 365 Copilot license. A personal account needs a Microsoft 365 Personal, Family, Premium or Pro subscription.
- **Mailbox:** an Exchange Online mailbox for full functionality including @mentions. On-premises mailboxes have limited capabilities.
- **Network:** connections per the Office 365 URLs and IP ranges, and WebSocket traffic to `*.svc.ms` and `*.office.com` for live editing.

## Where the content lives

Learn says pages are `.page` files in a user-owned SharePoint Embedded container that is shared with Loop My workspace. The container's application name is always Loop in the SharePoint admin center, PowerShell and Purview audit data, and there is no separate filter for Pages. Storage counts against the organization's SharePoint quota.

Pages and Notebooks are independent of Loop but share that container. The container is created if either this policy or Loop's **Create Loop workspaces in Loop** policy allows it. To prevent it, disable both for the same users. Interactive pages in Teams, Outlook, Whiteboard, OneNote or the Loop app need Loop components enabled. Without them, pages are interactive only in the Microsoft Copilot app and supported chat experiences.

## Admin controls

Pages and Notebooks are controlled by Cloud Policy in the Microsoft 365 Apps admin center. Learn lists two settings:

| Setting | Purpose | Default |
| --- | --- | --- |
| Create and view Copilot Pages and Copilot Notebooks | Controls creation and integration | Enabled |
| Enable code previews for AI-generated content in Microsoft Copilot Chat and Copilot Pages | Controls code previews, including lightweight apps | Enabled |

### Configure the policy

1. Sign in to config.office.com with Microsoft 365 admin credentials.
2. Select **Customization**, then **Policy Management**.
3. Create or edit a policy configuration.
4. Under **Choose the scope**, select **All users** or a group.
5. Under **Configure Settings**, set each policy to **Enabled**, **Disabled** or **Not configured**. Not configured behaves like Enabled.
6. Save and adjust group priority. Lower numbers are evaluated first.

Changes take up to 90 minutes if policies already existed, or up to 24 hours if none existed.

### Target a subset

To enable for a subset, create Group A with the policy Enabled and a lower priority number, and Group B for all users with the policy Disabled and a higher number. Swap the values to disable for a subset. Group scoping uses Microsoft 365 Groups, security groups or dynamic groups.

## When creation is disabled

- Users can't create Pages or Notebooks.
- The Notebooks module is hidden in the Microsoft Copilot app. The Pages module remains visible.
- Existing items aren't deleted. Users with permission can still open them in the Loop app, the Microsoft Copilot app or their original OneDrive or SharePoint locations.
- Existing items stay discoverable through search and Purview, and admins can export them.
- Sharing links to Copilot Notebooks don't work.

If your organization disabled OneDrive creation for some users, those users can't create Pages or Notebooks whatever the policy says.

## Governance pointers

The admin configuration page links to a storage and lifecycle page, which I did not read for this article. It does not document PowerShell cmdlets or a separate sharing control for these features.

## Checklist (my advice)

1. Check OneDrive licensing and site creation for the target users.
2. Decide whether Loop components stay enabled.
3. Set the Cloud Policy and allow 90 minutes to 24 hours.
4. Allow WebSocket traffic to `*.svc.ms` and `*.office.com`.
5. Plan SharePoint storage for containers.

## Related

- [Copilot Pages](https://www.m365.fm/entity/copilot-pages/)

## Sources

- [How Microsoft Copilot Pages Works (Microsoft Support)](https://support.microsoft.com/microsoft-365-copilot/how-microsoft-365-copilot-pages-works)
- [Manage Copilot Pages and Copilot Notebooks in your organization (Microsoft Learn)](https://learn.microsoft.com/microsoft-365/loop/cpcn-admin-configuration?view=o365-worldwide)
- [Requirements for Copilot Pages and Copilot Notebooks (Microsoft Learn)](https://learn.microsoft.com/microsoft-365/loop/cpcn-requirements?view=o365-worldwide)
