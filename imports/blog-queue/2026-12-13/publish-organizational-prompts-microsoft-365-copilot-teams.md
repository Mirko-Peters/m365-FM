---
title: "Centralized Prompt Libraries for Microsoft 365 Copilot: Publish Organizational Prompts to Copilot Chat and Teams"
summary: "How admins create, import and publish organizational prompts for Microsoft Copilot, where users see them in Copilot Chat, Edge and Teams, which limits apply, and how team-shared prompts in Prompt Gallery differ."
status: review
publish: false
author: mirko-p
date: 2026-12-13
topics: [copilot, copilot-prompt-gallery, microsoft-365-admin-center, teams]
keypoints:
  - "Admins manage organizational prompts in the Microsoft 365 admin center under Copilot > Prompts, and need the AI Administrator or Search Editor role."
  - "Published prompts are suggested in Microsoft Copilot Chat, Microsoft Edge and Microsoft Teams as users type, and appear in the prompt lab."
  - "Limits per Microsoft Learn: 1,000 published prompts, four pinned prompts, 100 prompts and 5 MB per import."
  - "There is no automatic translation. Create one prompt per language, and use department and task type for filtering."
  - "Prompt Gallery is the user-level feature for saving and sharing prompts with a team. It is separate from admin-published organizational prompts."
faq:
  - q: "Where do I publish prompts for the whole organization?"
    a: "According to Microsoft Learn, go to the Microsoft 365 admin center, expand Copilot and select Prompts. Admins can create, view, update, delete, import and publish prompts there. You need the AI Administrator or Search Editor role, or a role with equivalent permissions."
  - q: "How many organizational prompts can I publish?"
    a: "Microsoft Learn states you can publish up to 1,000 organizational prompts in your tenant and pin up to four. A bulk import is limited to 5 MB and 100 prompts at a time. It typically takes about 3 hours for prompts to show in the prompt lab."
  - q: "Can I target prompts at specific groups?"
    a: "The organizational prompts article does not describe audience scoping or targeting. It describes prompts appearing across the tenant, with department and language as the filters users can use. Check the article for updates before you plan a department-specific rollout."
  - q: "What is the difference between organizational prompts and Prompt Gallery?"
    a: "The Prompt Gallery article describes categories for Microsoft-curated prompts, a user's own prompts and prompts shared with a team. Organizational prompts are the ones admins publish for all users. Learn says the gallery has analytics and export for admins but does not describe an organizational prompts category there."
---

A central prompt library gives users tested starting points instead of a blank text box. In Microsoft Copilot, Microsoft calls this feature **organizational prompts**: prompts your organization creates and publishes for its end users. Learn states that admins can create, view, update, delete, import and publish them, and that as users type in Copilot, matching organizational prompts are suggested automatically.

## Where users see the prompts

The organizational prompts article says the prompts are displayed in Microsoft Copilot Chat, Microsoft Edge and Microsoft Teams. In Copilot, there are three surfaces:

1. **Suggested prompts** in Copilot Chat. A **Suggested** button on the home page opens the pinned prompts, with a link to the prompt lab.
2. **Prompt lab**, which lists all organizational prompts available to the user. Users can search by keyword and filter by task type and department. Selecting a prompt puts it in the message box without submitting it.
3. **Autosuggest** in the input box. Matching prompts appear as typeahead suggestions.

The article does not describe a separate prompt gallery inside Teams. The closest equivalent is the prompt lab. If your plan depends on a specific Teams surface, verify it in the tenant.

## Who can manage them and where

Use the **AI Administrator** or **Search Editor** role, or a role with equivalent permissions. Open the Microsoft 365 admin center, expand **Copilot** and select **Prompts**. The logo shown in Copilot Chat is not set there. Learn says company branding is edited in the Microsoft Entra admin center under **Company branding**, using the **Square logo**.

The article does not state license requirements, so check your Copilot licensing separately.

## Design the library before you load it

Each prompt has fields with documented limits:

| Field | Required | Limit |
|---|---|---|
| Title | Yes | 35 characters |
| Display prompt | Yes | 132 characters |
| Prompt | Yes | 8000 characters |
| Department | No | 120 characters |
| Description | No | 200 characters, internal only |

Language, task type and supported apps are also required. Task type, for example Analyze, Create or Edit, drives the task-type filter. Department is free text and drives the department filter. Supported apps sets the Copilot surfaces where the prompt appears.

Practical rules that follow from these fields:

- Keep titles short, since the limit is 35 characters.
- Use one consistent spelling of department names, because the filter is built from free text.
- Write the full prompt with placeholders for the user to replace, and keep the display prompt a readable summary.
- Create a separate prompt per language. Learn says automatic translation or conversion to other languages is not available currently. Example locales in the article are en-US, es-ES and ja-JP.

## Create and publish

You can create prompts one by one in the admin center or import them in bulk. For import, Learn gives these limits: file size 5 MB, up to 100 prompts at a time. If you export all prompts to CSV for backup or bulk edits, remove any columns that are not in the prompt-import-template.csv file, such as Last Updated, before importing again.

Other documented limits and behavior:

- You can publish up to 1,000 organizational prompts in your tenant.
- You can pin up to four prompts. Pinned prompts appear at the top of the list and as suggested prompts in Copilot Chat.
- It typically takes about 3 hours for prompts to display in the prompt lab.
- Deletion is permanent. Export first if you may want the prompt later.

## Measure what works

The article says admins can review data for the last 7, 14 or 28 days. **Active users** is the number of distinct users who use a prompt. **Submissions** is the total number of times the prompt is submitted to Copilot. Use these to retire prompts nobody uses and to promote the ones that are popular, within the four-pin limit.

## Fixing validation errors

Learn lists three errors:

- "Prompt basic validation failed" means required fields are missing or the structure is invalid.
- "Tenant prompts published items limit has been reached" means you hit the 1,000 limit. Delete unused prompts.
- "Failed to batch insert prompt items to SDS collection" means retry, then file a support ticket if it persists.

## How Prompt Gallery fits in

Prompt Gallery is a user-level feature in Microsoft Copilot and Copilot Chat. The Learn article describes three categories: **Suggested** (Microsoft-curated), **Your Prompts** (created and saved by the user) and **Teams** (prompts shared with a team). Users can save and share prompts across teams. Admins can use analytics and reporting to see what a user saved, liked or shared and which prompts a team shares, and can export that data. The article does not describe other admin controls such as turning the gallery off or restricting sharing.

User-created and group-created prompts are stored in collections in the Microsoft 365 Substrate data store within the tenant boundary, according to the same article.

A simple split works for most organizations. Use organizational prompts for the vetted, tenant-wide library. Let teams use Prompt Gallery sharing for their own working prompts, and review the exported usage data to find prompts worth promoting into the central library.

## A rollout checklist

1. Collect candidate prompts from teams and test them in Copilot.
2. Assign task type, department, language and supported apps for each.
3. Check titles and display prompts against the character limits.
4. Import in batches of up to 100, or create them in the admin center.
5. Pin up to four.
6. Wait about 3 hours, then check the prompt lab as a normal user.
7. Review the 7, 14 or 28 day analytics and adjust.

## What the source does not say

The organizational prompts article does not describe licensing, audience targeting or rollout dates. The page metadata I read shows a publication date of 2026-09-21, which is not a rollout date. Check the Microsoft 365 message center and your tenant for the current state.

## Related

- [Microsoft 365 Copilot](https://www.m365.fm/entity/copilot/)
- [Copilot Prompt Gallery](https://www.m365.fm/entity/copilot-prompt-gallery/)
- [Microsoft 365 admin center](https://www.m365.fm/entity/microsoft-365-admin-center/)
- [Microsoft Teams](https://www.m365.fm/entity/teams/)

## Sources

- [Microsoft Learn: Organizational prompts overview](https://learn.microsoft.com/en-us/microsoft-365/copilot/organizational-prompts)
- [Microsoft Learn: Copilot Prompt Gallery](https://learn.microsoft.com/en-us/microsoft-365/copilot/copilot-prompt-gallery)
