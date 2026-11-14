---
title: "How to Create and Assign Teams Meeting Policies in the Teams Admin Center"
summary: "How Teams meeting policies work: the global policy and custom policies, per-organizer and per-user behavior, creating and editing a policy in the Teams admin center, assignment options, the 64-character name limit and what the overview page leaves to other articles."
status: review
publish: false
author: mirko-p
date: 2027-01-11
topics: [teams-admin-center, teams]
keypoints:
  - "Users get the global policy unless you create and assign a custom policy. A user can have only one meeting policy and one events policy at a time."
  - "Create a policy under Meetings > Meeting policies in the Teams admin center, select Add, enter a name and description and select Save. The name cannot be changed later."
  - "A policy name cannot contain special characters or exceed 64 characters. You cannot delete a policy while users are assigned to it."
  - "Policy settings work per organizer, per user, or both. Who can bypass the lobby follows the organizer. Meeting recording depends on both."
  - "The page does not cover assignment precedence, propagation time or the full settings list. It links to other articles for them."
faq:
  - q: "What policy do users get by default?"
    a: "Users get the global policy unless you create and assign a custom policy. You can edit the global policy or create custom ones."
  - q: "How do I create a meeting policy?"
    a: "In the Teams admin center go to Meetings > Meeting policies, select Add, enter a name and description, choose the settings and select Save."
  - q: "Can I rename a policy?"
    a: "No. After creation the name cannot be changed. The name also cannot contain special characters or exceed 64 characters."
  - q: "How do I assign a policy?"
    a: "You can assign it to individual users, to users in batches where supported, or to a group of users where supported. The details are on a separate article about policy assignment."
  - q: "Can I delete a policy that is in use?"
    a: "No. You cannot delete a policy while users are assigned to it. Reassign those users first."
---

Teams meeting policies control what users can do in meetings, such as recording, lobby handling and who can present. This guide follows the Microsoft Learn overview of meeting policies. The page explains how policies are structured and how to create and edit them. It leaves assignment details and the settings reference to other articles.

## How policies work

- Users get the global policy unless you create and assign a custom policy.
- A user can be assigned only one meeting policy and one events policy at a time.
- Policies work in three ways:
  - **Per organizer.** Participants inherit the organizer's policy. Example: Who can bypass the lobby.
  - **Per user.** The policy allows or prevents a feature for each user. Example: Meet now in channel meetings.
  - **Per organizer and per user.** Both the participant's policy and the organizer's policy matter. Example: Meeting recording.

This means a policy assigned to one person can affect other people in the meeting when that person is the organizer.

## Create a policy

1. In the Teams admin center go to **Meetings** > **Meeting policies** (or **Events policies**).
2. Select **Add**.
3. Enter a name and description. The name cannot contain special characters or exceed 64 characters.
4. Choose the settings.
5. Select **Save**.

After creation you cannot change the name. The page also mentions a newer unified experience under **Settings & policies**.

## Edit a policy

1. Go to **Meetings** > **Meeting policies**.
2. Click to the left of the policy name and select **Edit**.
3. Make your changes and select **Save**.

## Assign a policy

You can assign a policy to individual users, to users in batches where the policy type supports it, or to a group whose members are users where supported. The page does not describe the Manage users or group assignment screens. It links to a separate article about assigning policies.

You cannot delete a policy while users are assigned to it. Reassign those users first.

## PowerShell

The page only says policies can be managed through Teams PowerShell. It shows no examples.

## What the page does not say

- Policy assignment precedence, such as how a direct assignment interacts with a group assignment.
- How long a change takes to apply.
- The full list of settings and categories. A settings reference is linked.
- PowerShell examples.

## A policy outline

This outline is practical advice built on the page.

1. Decide which groups of users need different behavior.
2. Create one custom policy per group and give it a clear name, because you cannot rename it.
3. Remember that organizer settings affect all participants, so assign policies to organizers carefully.
4. Assign the policy and then test with a pilot user.
5. Read the policy assignment article for precedence and timing before a broad rollout.

## Typical mistakes

- Choosing a name with special characters or more than 64 characters.
- Trying to delete a policy that still has users.
- Expecting a per-user setting to cover every participant. Some settings follow the organizer.
- Assuming the page explains timing and precedence.

## Quick reference

| Item | Value on the page |
| --- | --- |
| Create | Meetings > Meeting policies > Add |
| Edit | Click left of the policy name, then Edit |
| Name limit | 64 characters, no special characters |
| Rename after creation | Not possible |
| Policies per user | One meeting policy and one events policy |
| Delete | Not while users are assigned |

## Examples of how settings behave

The page gives one example for each behavior. Who can bypass the lobby follows the organizer, so a participant gets the organizer's setting. Meet now in channel meetings is a per-user setting, so it applies to the user who has it. Meeting recording needs both the organizer's and the participant's policies to allow it. When you design policies, ask for each setting whose policy counts, because that decides whom you must assign the policy to.

## Global policy as the fallback

Every user who has no custom policy uses the global policy. Editing the global policy therefore changes the behavior for all of these users at once. Creating a custom policy and assigning it to a group limits the change to that group.

## Related

- [Teams admin center](https://www.m365.fm/entity/teams-admin-center/)
- [Teams](https://www.m365.fm/entity/teams/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)

## Sources

- [Meeting policies in Teams (Microsoft Learn)](https://learn.microsoft.com/microsoftteams/meeting-policies-overview)
