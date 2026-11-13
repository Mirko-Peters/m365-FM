---
title: "Teams Group Policy Assignment Not Applying: Why Members Still Get the Global Policy"
summary: "You assigned a Teams policy to a group, but members keep the default policy? Check the effective policy with the right cmdlet, then direct assignments, rank, nested groups and policy type."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [teams, teams-admin-center, powershell]
keypoints:
  - "Get-CsOnlineUser shows only direct policy assignments. A blank value there does not prove that a group assignment failed. Use Get-CsUserPolicyAssignment to see the effective policy."
  - "A policy assigned directly to a user always beats a group assignment of the same type. Remove the direct assignment so the group policy can apply."
  - "Group assignments reach only direct members of the group, not members of nested groups, and propagation runs in the background and can take 24 hours or more for large groups."
  - "Not every policy type supports group assignment. Check the Learn lists before you build a design around it."
faq:
  - q: "Which cmdlet shows the policy a user really gets from a group?"
    a: "Get-CsUserPolicyAssignment. Microsoft says it returns the effective policy for each policy type, whether assigned directly or inherited from a group, and its PolicySource output shows Direct or Group. Get-CsOnlineUser shows only direct assignments, according to the New-CsGroupPolicyAssignment reference."
  - q: "What wins if a user is in two groups with the same policy type?"
    a: "The assignment with the better rank. Rank 1 is the highest. If you do not specify a rank, the assignment gets the lowest rank. A direct user assignment is treated like rank 0 and beats all group assignments."
  - q: "Do nested groups work for Teams group policy assignment?"
    a: "No. Microsoft says assignments are propagated only to users who are direct members of the group, not to members of nested groups. Groups with hidden membership, which includes class teams by default, cannot be used."
  - q: "How long does it take until group members get the policy?"
    a: "The assignment to the group is immediate, but passing it on to the members runs in the background. Microsoft says it depends on the group size and that for large groups it may take 24 hours or more."
---

You created a custom Teams policy and assigned it to a security group. A day later, the members still have the default policy. Assigning the same policy to single users works. This is a recurring pattern in Microsoft Q&A threads, including one from January 2026 about a custom Audio Conferencing policy for about 200 licensed users. This article follows Microsoft's own rules for group policy assignment and uses the threads as the scenario. It is a troubleshooting guide, not an official Microsoft procedure. None of the threads below has a confirmed fix, so the value here is in the order of the checks.

## What the threads describe

- January 2026: an administrator assigned a custom Audio Conferencing policy to a group of about 200 users. The activity log showed propagation as done, but meetings still showed only the default dial-in number. A moderator suggested checking for direct assignments, assigning per user, or contacting support. The administrator answered that users had no direct assignment and fell back to the Global policy, that a partner would have to contact Microsoft, and that per-user batch assignment was the workaround for now. Nothing was confirmed as the cause.
- May 2024 (locked thread): a Compliance Recording policy assigned to a group with `New-CsGroupPolicyAssignment` and rank 1 never reached the members, although `Get-CsGroupPolicyAssignment` showed the assignment. The single answer talked about on-premises Active Directory and Windows Group Policy tools, which look unrelated to a Teams policy assignment made with PowerShell. No accepted answer.
- August 2024: an administrator assigned an External Access policy to a group with a rank of 5, then checked the user with `Get-CsOnlineUser | Select-Object ExternalAccessPolicy` and saw a blank value. The moderator's answer, accepted by the asker, suggested checking the policy list, the group membership and waiting for replication.
- A 2020 thread (older, but the same pattern): after the person removed the Global policy that was directly assigned to users, members inherited the group's meeting policy.

## Step 1: Check the effective policy with the right cmdlet

Start here, because the most common check is the misleading one. The Microsoft reference for [New-CsGroupPolicyAssignment](https://learn.microsoft.com/en-us/powershell/module/microsoftteams/new-csgrouppolicyassignment?view=teams-ps) says that `Get-CsOnlineUser` shows only direct assignments and does not show the effect of group policy assignments. A blank value there is therefore expected for a user who gets the policy from a group. This is consistent with the August 2024 thread, though that thread never states it.

Use `Get-CsUserPolicyAssignment` instead. The [reference](https://learn.microsoft.com/en-us/powershell/module/microsoftteams/get-csuserpolicyassignment?view=teams-ps) says it returns the effective policy for each policy type, whether direct or from a group:

```powershell
Get-CsUserPolicyAssignment -Identity <user> -PolicyType TeamsMeetingPolicy | select -ExpandProperty PolicySource
```

The output lists an `AssignmentType` of `Direct` or `Group`, the policy name and, for groups, the group ID. Replace `TeamsMeetingPolicy` with the type you assigned. If the policy type does not appear at all, Microsoft says the user gets the tenant global default.

## Step 2: Look for a direct assignment

Microsoft's page on [assigning policies to users and groups](https://learn.microsoft.com/en-us/microsoftteams/assign-policies-users-and-groups) is clear: a policy assigned directly to a user takes precedence over any policy of the same type assigned to a group, and you must remove the direct policy before the user can inherit from a group.

Typical sources of direct assignments are earlier per-user assignments, scripts, or batch operations. A batch assignment is also a direct assignment. This matters if you use the per-user workaround from the January 2026 thread: those users will keep that policy even after a group assignment is in place, until you remove it.

To remove a direct assignment:

```powershell
Grant-CsTeamsMeetingPolicy -Identity <user> -PolicyName $null
```

Use the `Grant-` cmdlet that matches your policy type. In the Teams admin center, open **Users**, then **Manage users**, select the user, open the **Policies** tab, select the policy and choose **Remove**. For many users, Microsoft shows **Actions**, **Unassign policies in bulk**, but warns that choosing a policy there removes all individually assigned users from that policy.

## Step 3: Verify the group assignment and its rank

List what is assigned to the group, or all assignments of one type:

```powershell
Get-CsGroupPolicyAssignment -GroupId <group-id>
Get-CsGroupPolicyAssignment -PolicyType TeamsMeetingPolicy
```

If the user is in several groups that have a policy of the same type, the best rank wins. Microsoft says rank 1 is the highest, that a missing rank is treated as the lowest, and that the New-CsGroupPolicyAssignment reference treats a direct assignment like rank 0. So a group at rank 5 loses against a group at rank 1 that also contains the user. In the admin center, to change a rank you first remove the group assignment and add it again with the new rank.

The reference also says that `New-CsGroupPolicyAssignment` will be deprecated. Going forward, use the `Grant-Cs...Policy` cmdlet for your type with `-Group` and `-Rank`:

```powershell
Grant-CsTeamsMeetingPolicy -Group <group-id> -PolicyName "<policy>" -Rank 1
```

The Learn page on assigning policies shows this form. For the Audio Conferencing policy in the January 2026 thread, the `Grant-CsTeamsAudioConferencingPolicy` reference lists `-Group` and `-Rank` too.

## Step 4: Check the group itself

Microsoft names several conditions:

- Assignments are propagated only to users who are direct members. They are not propagated to members of nested groups.
- Groups with `HiddenGroupMembership` enabled cannot be used. Class teams have this enabled by default.
- The reference says a policy can be assigned to a Microsoft 365 group, a security group or a distribution list.
- A policy type can be assigned to at most 64 groups across policy instances of that type. Microsoft recommends up to 50,000 users per group.

If users sit in a nested group, add them to the assigned group directly or assign the policy to the nested group as well.

## Step 5: Check that the policy type supports groups

Microsoft's lists do not fully agree, so check both. The page on assigning policies says group assignment is not supported for the Teams App Permission policy, the Teams Upgrade policy and the Dialout policy. The New-CsGroupPolicyAssignment reference says that since May 2023 all policy types are supported except App Permission, Network Roaming, Emergency Call Routing, Voice Applications and Upgrade. The pages are not identical, and the cmdlet page may be the more current one for the PowerShell module. If your type appears on either list, plan for direct assignment or a different method.

## Step 6: Wait, but know what you are waiting for

Microsoft says the policy is assigned to the group immediately, while passing it on to members is a background job whose length depends on the group size. The cmdlet reference says that for large groups it may take 24 hours or more. A moderator in the August 2024 thread talked about a few minutes, which fits only small groups. In the January 2026 thread, the policy was assigned on a Friday and the activity log showed propagation as complete by Monday, so waiting alone does not look like the cause there.

Re-check the effective policy of one test user after any change. Effective policies are recalculated when a user is added to or removed from the group, when a policy is unassigned from the group or when a direct assignment is removed.

## What this does not solve

In the January 2026 case, the administrator had no direct assignments and still did not see the new dial-in numbers. Microsoft's pages do not explain that. Also, whether a specific meeting invitation shows the new numbers depends on more than the policy assignment, and I did not verify that. If `Get-CsUserPolicyAssignment` shows the group policy as effective for the user and the behavior is still wrong, the policy assignment is working and the question moves to the feature. Open a support case with the output of `Get-CsUserPolicyAssignment`, the group ID and the time of the assignment.

## Quick checklist

1. Run `Get-CsUserPolicyAssignment` for one affected user and read `PolicySource`.
2. Remove direct assignments of the same policy type.
3. Run `Get-CsGroupPolicyAssignment` and check the rank.
4. Confirm the user is a direct member of the group.
5. Confirm that the policy type supports group assignment.
6. Allow time for large groups and re-check.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Teams admin center](https://www.m365.fm/entity/teams-admin-center/)
- [PowerShell](https://www.m365.fm/entity/powershell/)

## Sources

- [Microsoft Learn: Assign policies to users and groups](https://learn.microsoft.com/en-us/microsoftteams/assign-policies-users-and-groups)
- [Microsoft Learn: New-CsGroupPolicyAssignment](https://learn.microsoft.com/en-us/powershell/module/microsoftteams/new-csgrouppolicyassignment?view=teams-ps)
- [Microsoft Learn: Get-CsUserPolicyAssignment](https://learn.microsoft.com/en-us/powershell/module/microsoftteams/get-csuserpolicyassignment?view=teams-ps)
- [Microsoft Learn: Grant-CsTeamsAudioConferencingPolicy](https://learn.microsoft.com/en-us/powershell/module/microsoftteams/grant-csteamsaudioconferencingpolicy?view=teams-ps)
- [Microsoft Q&A: Teams custom Audio Conferencing policy not propagating when assigned to group (January 2026)](https://learn.microsoft.com/en-us/answers/questions/5740555/teams-custom-audio-conference-policy-not-propagati)
- [Microsoft Q&A: Teams Policy is not being applied via Group Policy (May 2024)](https://learn.microsoft.com/en-us/answers/questions/4414166/teams-policy-is-not-being-applied-via-group-policy)
- [Microsoft Q&A: policy is not applying (August 2024)](https://learn.microsoft.com/en-ca/answers/questions/1983877/policy-is-not-applying)
- [Microsoft Q&A: Group policy in Teams not being applied to group members (2020, background)](https://learn.microsoft.com/en-us/answers/questions/4397781/group-policy-in-teams-not-being-applied-to-group-m)
