---
title: "Pin Microsoft Copilot Chat in Microsoft 365 Apps: Admin Center, Teams Policy and Cloud Policy"
summary: "Control whether Microsoft Copilot Chat is pinned in Microsoft 365 apps using Microsoft Learn: admin center path and role, the two options, Teams app setup policy, group level Cloud Policy, the 48 hour delay and a date inconsistency on the page."
status: review
publish: false
author: mirko-p
date: 2026-12-27
topics: [copilot-chat, copilot]
keypoints:
  - "Go to the Microsoft 365 admin center, then Copilot, Settings, Pin Microsoft Copilot Chat. The AI administrator role is required."
  - "Copilot Chat is pinned by default. The options are to pin it in Microsoft 365 apps (recommended) or not to pin it. Changes take up to 48 hours."
  - "In Teams, pinning for users can only be changed in the Teams admin center through an app setup policy."
  - "Group level control uses Microsoft 365 Cloud Policy, which Learn says is not recommended for most customers because of management complexity."
  - "The page gives two dates, January 28, 2026 and January 20, 2026, for when Copilot Chat cannot be unpinned for all tenants. Check the page."
faq:
  - q: "Where do I change the pin setting?"
    a: "According to Microsoft Learn, in the Microsoft 365 admin center under Copilot, Settings, then Pin Microsoft Copilot Chat."
  - q: "Which role is needed?"
    a: "The AI administrator role. Learn advises using roles with the fewest permissions and limiting Global Administrator to emergency scenarios."
  - q: "What happens with the Do not pin option?"
    a: "Learn says Copilot Chat is not available by default in Teams and Outlook, but users can still add Copilot from their app store."
  - q: "How do I control pinning in Teams?"
    a: "Learn says it can only be changed in the Teams admin center, by adding the Copilot app to the Pinned apps of an app setup policy and also allowing Copilot Chat through an app permission policy or app centric management."
  - q: "How long does a change take?"
    a: "Learn says changes can be made at any time and take up to 48 hours to take effect."
---

Microsoft Copilot Chat can be pinned to the navigation bar of Microsoft 365 apps on web, desktop and mobile, such as Teams and Outlook. This guide follows the Microsoft Learn article.

## Scope

The page covers only the Copilot Chat experience in the navigation bar. Copilot Chat is an integrated chat experience within Microsoft 365 apps. The Microsoft Copilot app is a standalone application with access to Chat, Search, Agents (if enabled), Notebooks and Create. Pinning the app to the Windows taskbar is a separate article.

## Set the tenant default

1. Sign in to the Microsoft 365 admin center with the **AI administrator** role.
2. Go to **Copilot**, then **Settings**.
3. Select **Pin Microsoft Copilot Chat**.
4. Choose an option.

| Option | Effect |
| --- | --- |
| Pin Copilot Chat in Microsoft 365 apps (recommended) | Copilot Chat is pinned automatically for all users, who are not prompted. This is the default. |
| Do not pin Copilot Chat in Microsoft 365 apps | Copilot Chat is not available by default in Teams and Outlook. Users can add Copilot from their app store. |

Changes take up to 48 hours. Admins who previously cleared the option to ask users whether to pin now have Do not pin. If a user unpins Copilot Chat, it stays unpinned in future sessions. Only users who sign in with a Microsoft Entra account can have it pinned.

## Dates to verify

The page says the setting no longer applies to the Microsoft Copilot app and that Copilot Chat cannot be unpinned from navigation for all tenants worldwide as of January 28, 2026. In the group-level section it says January 20, 2026. Both dates are already past. The page also says users who unpin Copilot Chat have that choice respected. These statements do not fit together cleanly, so treat the behavior as something to test in your tenant.

## Teams

Pinning for Teams users can only be changed in the Teams admin center. Add the Copilot app to Pinned apps in an app setup policy and assign it to users with Entra accounts. You must also allow Copilot Chat through an app permission policy or app centric management. If the tenant setting is Pin, assigned users get the position from the policy and others get a default position. If it is Do not pin, Teams pins Copilot Chat only for the assigned users.

## Group or user level

Sign in to the Microsoft 365 Apps admin center at config.office.com, open Microsoft 365 Cloud Policy from the Office policies card, select **Create**, set the basics and scope, then search for **Pin Microsoft Copilot Chat**. Choose an option and **Apply**. **Enabled** behaves like the pin option. Review and select **Create**. Learn says this is not recommended for most customers.

## User experience

Users without a Copilot license can choose to pin or unpin Copilot Chat, and they can also adjust pinning in their application settings. Learn says these choices apply to Microsoft Teams, Outlook and the Microsoft Copilot app. If an admin switches to Do not pin, Copilot honors that choice. If a user unpins Copilot Chat, it respects that choice in future sessions.

## Before you change anything

This checklist is my advice, built from the page, not a Microsoft procedure.

1. Check that you hold the AI administrator role, not Global Administrator.
2. Decide whether Teams needs its own app setup policy, because the page says pinning for Teams users can only be changed in the Teams admin center.
3. Check that Copilot Chat is also allowed for those users through an app permission policy or app centric management.
4. Wait up to 48 hours before you judge the result.
5. Test with a user who has unpinned Copilot Chat to see which behavior you actually get.

## Taskbar

Pinning the Microsoft Copilot app to the Windows taskbar applies only to users with an active Intune license and requires the Intune Administrator role.

## Not covered

The page does not describe how to install the Microsoft 365 Copilot app. It also does not explain how pinning interacts with a user's own Microsoft 365 license beyond the unlicensed user note above, so test with both licensed and unlicensed accounts.

## Related

- [Copilot Chat](https://www.m365.fm/entity/copilot-chat/)
- [Copilot](https://www.m365.fm/entity/copilot/)

## Sources

- [Pin Microsoft Copilot Chat in the Microsoft 365 apps (Microsoft Learn)](https://learn.microsoft.com/copilot/implement/pin-copilot-chat-navbar)
