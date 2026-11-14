---
title: "Microsoft Teams Templates: Create, Use and Manage Them"
summary: "How team templates work in Teams: the 15 prebuilt ones, limits, creating custom templates in the admin center, hiding templates with policies, and where the documentation disagrees or is silent."
status: review
publish: false
author: mirko-p
date: 2026-11-26
topics: [teams-templates, teams, teams-admin-center]
keypoints:
  - "A team template predefines a team's structure: settings, channels, apps and tabs. Membership, team picture, files and channel settings are not carried by templates."
  - "The admin center offers 15 prebuilt templates that can be duplicated but not edited. A template holds at most 15 channels, 20 tabs per channel and 50 apps."
  - "Create custom templates under Teams > Team templates > Add: brand new, from an existing team, or from an existing template."
  - "Templates policies hide templates from users. A policy hides at most 100 templates, assignment is per user (not per group) and can take up to 24 hours."
  - "Private and shared channels cannot be created by a template. Custom templates can take up to 24 hours to show in the gallery."
faq:
  - q: "What is a Microsoft Teams team template?"
    a: "Microsoft Learn describes a team template as a definition of a team's structure designed around a business need or project. It includes predefined settings, channels and apps so teams are created consistently. Admins can use prebuilt templates, create custom ones and apply template policies to control which templates users see."
  - q: "Where do I create a custom team template?"
    a: "In the Teams admin center, go to Teams > Team templates and select Add. Microsoft Learn describes three starting points: create a brand new template, use an existing team as a template, or start from an existing template. Fill in the template settings, add channels and apps, then select Submit."
  - q: "Can I edit the prebuilt Teams templates?"
    a: "No. According to Microsoft Learn, prebuilt templates can be duplicated but not edited. To change one, select it, choose Duplicate, and edit the copy, which opens with the word Copy added to its name."
  - q: "How do I stop users from seeing certain templates?"
    a: "Create a templates policy under Teams > Templates policies, select the templates to hide and save. Then assign it to users. Microsoft Learn says new templates are visible by default, a policy can hide up to 100 templates, group-based assignment is not supported, and changes can take up to 24 hours."
  - q: "Do Teams templates copy members and files from an existing team?"
    a: "Not according to Microsoft Learn. Its supported and unsupported lists say team membership, files and content, channel settings and the team picture are not supported by templates. The page on creating a template from an existing team does not say which properties of the source team carry over, so check the result on a test team."
---

A Teams template lets you create new teams with the same channels, apps and settings every time. Admins build or pick a template, optionally hide others with a policy, and users then choose from what remains when they create a team. This article covers team templates first and meeting templates briefly.

Several Learn pages cover templates and they differ in small ways. Where they disagree, that is noted. The user-side Support page for creating a team from a template was blocked in my research, so the client steps are not described here.

## What a template can and cannot hold

Microsoft Learn says a template defines a team's structure around a business need or project. The admin center page lists these supported properties: template type, team name, description, visibility (public or private), team settings, autofavorite channel, installed apps and pinned tabs.

Not yet supported: team membership, team picture, channel settings, connectors, and files and content. The Graph page also lists pinned tabs and team settings as unsupported, so the pages disagree on tabs and settings. Test one template before you roll it out.

Documented limits for the admin center:

| Item | Limit |
|---|---|
| Channels per template | 15 |
| Tabs per channel | 20 |
| Apps per template | 50 |

Channels, tabs and apps can still be added to a team after it exists. Private and shared channels are not supported in template definitions.

## The prebuilt templates

The admin center page lists 15 prebuilt templates. Those marked with an asterisk are Microsoft 365 connected templates that add SharePoint components to the General channel.

- Manage a Project*, Manage an Event*, Onboard Employees*
- Adopt Office 365, Organize Help Desk*, Incident Response
- Crisis Communications*, Manage a Store*, Bank Branch
- Patient Care, Hospital, Quality and Safety
- Retail for Managers*, Manage Volunteers, Frontline Collaboration

The Graph documentation describes a different, smaller set of prebuilt templates for developers: Standard, Education Class Team, Education Staff Team and Education PLC Team. Do not mix the two lists.

## Create a custom template

Path: Teams admin center > **Teams** > **Team templates** > **Add**.

### Brand new

1. Select **Add**, then **Create a brand new template**.
2. In **Template settings**, enter the name, short and long descriptions and locale visibility, then select **Next**.
3. Under channels, tabs and apps, select **Channels** > **Add**. Name the channel, add a description, choose whether it shows by default, search for an app to add, then select **Apply**.
4. Select **Submit**.

### From an existing team

1. Select **Add** and choose **Use an existing team as a template**.
2. Pick the team, then complete the template settings.
3. Add or adjust channels and apps, then select **Submit**.

Microsoft's page does not say which properties of the source team are copied. It also lists no roles or licenses.

### From an existing template

Select a template in the list and choose **Duplicate**, or use **Add** > **Start with an existing template**. The copy opens with the word Copy in its name. You can change the name, descriptions, locale visibility, existing channels and their apps, and add channels or apps. Select **Submit** to save it to the template library.

### Known issues in the docs

- It can take up to 24 hours for users to see a custom template in the gallery.
- The Website tab option in templates is described as early preview on the create page.
- Sensitivity labels are not supported in GCC environments in the create-from-template flow.

## Control which templates users see

A templates policy lists templates as viewable or hidden. Path: **Teams** > **Templates policies** > **Add**.

1. Enter a name and short description.
2. Select templates in **Viewable templates** and choose **Hide**.
3. Select **Save**.

Rules from the page:

- New templates are visible by default, so hide them explicitly if needed.
- A policy can hide at most 100 templates.
- Deleted templates are removed from all policies.
- Assign policies to users directly. Group-based assignment is not supported.
- Changes can take up to 24 hours.

To assign in bulk in the admin center, go to **Users** > **Manage users**, select users, choose **Edit settings**, set **Templates policy** and select **Apply**. PowerShell cannot create or edit these policies, but `New-CsBatchPolicyAssignmentOperation` with the policy type `TeamsTemplatePermissionPolicy` can assign them. The page does not describe what users with no assigned policy see.

## Meeting templates in short

Meeting templates are a separate feature. The Learn page on meeting template policies says some features described there require Teams Premium, without saying which. Path: **Meetings** > **Meeting template policies** > **Add**. As with team templates you hide templates from the viewable list, save, then assign the policy to users or groups. The Global (Org-wide default) policy shows all default and custom templates. A policy has no effect until it is assigned.

## Practical advice

1. Start from a prebuilt template that is close and duplicate it.
2. Keep the structure small. Channels can be added later, and the 15-channel cap is real.
3. Build a test team from the template and check tabs, apps and channels before publishing.
4. Plan for the 24-hour delay when announcing a new template.
5. Hide templates you do not want used and assign the policy per user, since groups do not work.

## Related

- [Teams templates](https://www.m365.fm/entity/teams-templates/)
- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Microsoft Teams admin center](https://www.m365.fm/entity/teams-admin-center/)

## Sources

- [Microsoft Learn: Get started with team templates in the Teams admin center](https://learn.microsoft.com/en-us/microsoftteams/get-started-with-teams-templates-in-the-admin-console)
- [Microsoft Learn: Get started with team templates (Microsoft Graph)](https://learn.microsoft.com/en-us/microsoftteams/get-started-with-teams-templates)
- [Microsoft Learn: Create a custom team template](https://learn.microsoft.com/en-us/microsoftteams/create-a-team-template)
- [Microsoft Learn: Create a template from an existing team](https://learn.microsoft.com/en-us/microsoftteams/create-template-from-existing-team)
- [Microsoft Learn: Create a team template from an existing team template](https://learn.microsoft.com/en-us/microsoftteams/create-template-from-existing-template)
- [Microsoft Learn: Manage team templates in the admin center (templates policies)](https://learn.microsoft.com/en-us/microsoftteams/templates-policies)
- [Microsoft Learn: Manage meeting templates in Microsoft Teams](https://learn.microsoft.com/en-us/microsoftteams/manage-meeting-templates)
