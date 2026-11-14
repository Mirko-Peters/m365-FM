---
title: "Teams Admin Center Policies Explained: Types, Assignment and Precedence"
summary: "How Teams policies work in the Teams admin center: the main policy types, the global org-wide default, direct and group assignment, which policy wins, policy packages and how to check rollout status."
status: review
publish: false
author: mirko-p
date: 2026-11-22
topics: [teams-admin-center, teams, teams-administrator]
keypoints:
  - "Policies control messaging, meetings, apps and calling. You manage them in the Teams admin center or with the Teams PowerShell module."
  - "A user has one effective policy per policy type. Direct assignment wins, then group assignment, then the global (Org-wide default) policy."
  - "With several group assignments, the group with the highest group assignment ranking for that policy type takes precedence."
  - "Set the global policy first so it applies to the most users, then assign exceptions to users or groups."
  - "Learn says policy changes may take up to 24 hours to take effect. Check progress in Dashboard > Activity Log > View details."
faq:
  - q: "What kinds of policies does Teams have?"
    a: "According to Microsoft Learn, the main types are policy packages, meeting policies, voice and calling policies, app policies and messaging policies. Meeting policies control features for meeting participants, app policies control which apps users can install or pin, and messaging policies control chat and channel features."
  - q: "Which policy applies when a user has several?"
    a: "Microsoft Learn gives a fixed order for each policy type. A direct assignment, individual or batch, takes precedence. Without one, the policy assigned to a group the user belongs to applies, and with several groups the highest group assignment ranking wins. Without either, the user gets the global (Org-wide default) policy."
  - q: "How long does a policy change take?"
    a: "Microsoft Learn on managing Teams with policies says changes may take up to 24 hours to take effect. The policy assignment article does not state a propagation time. It lists activity log statuses such as Not started, In progress, Rolling out to users and Completed."
  - q: "Where do I see the status of a policy assignment?"
    a: "In the left navigation of the Teams admin center, go to Dashboard, then under Activity Log select View details. Microsoft Learn says the activity log covers the last 30 days."
---

Teams policies decide what users can do: whether they can edit sent messages, which apps they can install, which meeting features they get and how calling works. Each policy has several controls, and each user gets exactly one effective policy per policy type. The order that picks it is direct assignment first, then group assignment, then the global default. This guide explains the types, the order and the admin center steps.

## The main policy types

Microsoft Learn lists these in its overview of managing Teams with policies:

| Policy type | What it controls |
|---|---|
| Policy packages | A collection of predefined policies and settings for users with similar roles |
| Meeting policies | Features available to participants in meetings scheduled by your users: audio and video, content and screen sharing, participants, guests and access, and general settings |
| Voice and calling policies | Settings such as emergency calling, call routing and caller ID |
| App policies | Which apps users can install, which are pinned to the Teams app bar and apps installed on users' behalf |
| Messaging policies | Chat and channel feature availability |

Learn gives examples: allowing users to schedule meetings in a channel, enabling users to edit sent messages and controlling whether users can pin apps to the Teams app bar. App setup policies are configured in the Teams admin center.

Teams also has event-specific policies, such as the Teams events policy, that sit next to the meeting policy. Those are covered in Learn's events pages, not in the policy overview read here.

## Where you manage them

Policies are managed in the **Teams admin center** or with the **Teams PowerShell module**. Learn says changes may take up to 24 hours to take effect.

## Step 1: Set the global policy first

Learn advises setting the global (Org-wide default) policies before assigning policies to users or groups, so they cover the most users.

1. In the Teams admin center, open the policy page for the type, for example **Teams** > **Teams policies** or **Messaging policies**.
2. Select **Global (Org-wide default)**.
3. Change the settings and select **Save**.

In PowerShell, Learn shows this pattern:

```powershell
Get-CsTeamsMessagingPolicy -Identity Global
Set-CsTeamsMessagingPolicy -Identity Global -AllowUserEditMessage $false
```

You only specify the settings you want to change.

## Step 2: Assign exceptions

Create a custom policy for the group of users who need something different, then assign it. You can make and view assignments in the Teams admin center. Learn describes two routes:

- **Direct assignment** to an individual or a batch of users.
- **Group assignment**, for example to a security group or a distribution list, through the admin center or the Teams PowerShell module.

For policy packages, Learn says assignment to a group in the admin center was "coming soon" at the time of writing, while PowerShell is available. Check whether that has changed in your tenant.

## Which policy wins

Learn states the order for each policy type:

1. **Direct assignment.** If a user is directly assigned a policy, individually or in a batch, it takes precedence.
2. **Group assignment.** If there is no direct assignment, the policy assigned to a group the user belongs to applies. If the user is in several groups, the policy with the highest group assignment ranking for that type takes precedence.
3. **Global.** With neither, the user gets the global (Org-wide default) policy for that type.

Practical consequence: a direct assignment hides every group assignment of the same type. If a group policy does not apply to someone, check for a direct assignment first.

## Group assignment: ranking and limits

The page on assigning policies to users and groups adds these details:

- **Ranking.** When you assign a policy to a group, you set a ranking relative to other group assignments of the same policy type. A smaller number is a higher ranking, and 1 is the highest. Without a ranking, the assignment gets the lowest one.
- **Changing a ranking.** In the admin center, remove the group assignment first, then assign it again with the new ranking. In PowerShell the Grant cmdlet can change the ranking, for example `Grant-CsTeamsMeetingPolicy -Group <group-id> -PolicyName "<policy>" -Rank 1`.
- **Where.** In the admin center, open the policy type page, for example **Meetings** > **Meeting policies**, select the **Group policy assignment** tab and select **Add group**.
- **Propagation.** The assignment to the group is immediate, but passing it on to members is a background operation that can take time depending on group size. Learn recommends groups of up to 50,000 users, though larger groups also work.
- **Not supported.** Only direct members receive group assignments, not members of nested groups. Groups with `HiddenGroupMembership` enabled, which Class Teams have by default, cannot use group policy assignment. Teams App Permission Policy, Teams Upgrade Policy and Dialout Policy are not supported for group assignment.

## Check status after a change

The policy assignment article does not give a propagation time. It lists activity log statuses: Not started, In progress, Rolling out to users, Completed and Completed with errors. To open the log:

1. In the Teams admin center left navigation, select **Dashboard**.
2. Under **Activity Log**, select **View details**.

The log covers the last 30 days, and group operations appear as **Group policy assignment**. To see whether a user's effective policy is direct or inherited from a group, Learn shows `Get-CsUserPolicyAssignment -Identity <user> -PolicyType <type> | select -ExpandProperty PolicySource`. The output lists the assignment type, Direct or Group, per policy.

## A worked example

Suppose the global messaging policy lets everyone edit sent messages, and you want to block editing for one department. Create a custom messaging policy with that setting off and assign it to the department's security group. Members without a direct messaging policy get the group policy. Anyone with a direct assignment keeps it until you remove it.

## Removing assignments

Learn says you can remove assignments in bulk for all users directly assigned to a policy. In the admin center, go to **Users** > **Manage users**, select **Unassign policies in bulk** from the **Actions** menu, choose a policy type and policy, select **Load data** and then **Unassign policy**. Choosing a policy removes all individually assigned users from it. This is the way to clean up old direct assignments so group or global policies apply again. To remove a single user's direct assignment, open the user under **Manage users**, select the **Policies** tab, select the policy and select **Remove**.

## Common mistakes

- **Editing a custom policy and expecting everyone to change.** Only users assigned to it are affected. Use the global policy for org-wide defaults.
- **Forgetting direct assignments.** They outrank groups.
- **Expecting instant changes.** Allow time and read the activity log.
- **Using the highest-privileged role for policy work.** The pages read do not name a required role, so check your tenant's role setup.

## Limits of the sources

The Microsoft Learn pages read name no required admin role or license for policy assignment, so check your tenant's role setup. Pages on individual policy types, such as meeting or messaging policy settings, were not part of this read.

## Related

- [Teams admin center](https://www.m365.fm/entity/teams-admin-center/)
- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Teams administrator](https://www.m365.fm/entity/teams-administrator/)
- [Microsoft 365 admin center](https://www.m365.fm/entity/microsoft-365-admin-center/)

## Sources

- [Microsoft Learn: Manage Teams with policies](https://learn.microsoft.com/en-us/microsoftteams/manage-teams-with-policies)
- [Microsoft Learn: Assign policies in Teams, getting started](https://learn.microsoft.com/en-us/microsoftteams/policy-assignment-overview)
- [Microsoft Learn: Assign policies to users and groups](https://learn.microsoft.com/en-us/microsoftteams/assign-policies-users-and-groups)
