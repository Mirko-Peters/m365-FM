---
title: "Automate Teams Retention and Inactive Team Cleanup With Microsoft Graph and PowerShell"
summary: "Which parts of Teams retention and inactive team cleanup you can automate with Graph and PowerShell: activity reports, archiving, the group expiration policy API and Purview retention policies, with Microsoft's documented limits."
status: review
publish: false
author: mirko-p
date: 2026-12-14
topics: [teams, retention-policies, graph, microsoft-graph-powershell]
keypoints:
  - "Two separate systems are involved: Purview retention policies control how long Teams messages are kept, and the Microsoft 365 group expiration policy controls whether inactive teams are deleted."
  - "The Graph report getTeamsTeamActivityDetail gives a Last Activity Date per team for periods of 7, 30, 90 or 180 days with the Reports.Read.All permission."
  - "POST /teams/{id}/archive archives a team asynchronously and returns 202 Accepted. The team needs an owner."
  - "The groupLifecyclePolicy API and Graph PowerShell cmdlets manage the single expiration policy. Deleted groups can be restored for 30 days."
  - "Teams retention policies can take up to seven days to apply, and expired messages are removed by a timer job that typically takes 1 to 7 days."
faq:
  - q: "Can I clean up inactive teams with Graph?"
    a: "Yes, in two ways. Microsoft Learn documents the getTeamsTeamActivityDetail report to find teams by last activity, the team archive API to archive them, and the groupLifecyclePolicy API to set an expiration policy that deletes unrenewed Microsoft 365 groups. Deleted groups can be restored within 30 days."
  - q: "Does the expiration policy delete inactive teams automatically?"
    a: "Microsoft Learn says groups with user activity are renewed automatically as expiration nears, owners are notified to renew otherwise, and groups that are not renewed are deleted. Visiting a Teams channel counts as activity. The policy applies to Microsoft 365 groups, and a team is backed by one."
  - q: "How long does a Teams retention policy take to apply?"
    a: "Learn says it can take up to seven days after you create and submit a retention policy. If the status shows an error about taking longer than expected, Set-RetentionCompliancePolicy with -RetryDistribution, or Set-AppRetentionCompliancePolicy for some locations, retries distribution."
  - q: "Do Teams retention policies cover files?"
    a: "No. Learn states that emails and files used with Teams are not included in retention policies for Teams. Channel files fall under policies for Microsoft 365 Group mailboxes and sites or SharePoint sites, and files from chats need a policy that includes the organizer's OneDrive account."
---

Teams cleanup sounds like one task, but it is two. One system decides how long chat and channel messages are kept. A different system decides whether a team that nobody uses still exists. Graph and PowerShell can automate parts of both, with different tools and different limits. This guide separates them and shows how to chain them into a routine.

A boundary note: the Learn pages read for this article configure Teams retention through the Microsoft Purview portal and PowerShell. They do not document a Graph endpoint for creating Teams retention policies, so the Graph parts below concern reporting, archiving and group expiration.

## Part 1: Find inactive teams

The Graph usage report returns one row per team:

```http
GET /reports/getTeamsTeamActivityDetail(period='D90')
```

Learn lists the details:

- Permission: `Reports.Read.All`, for delegated and application access.
- Period values: `D7`, `D30`, `D90`, `D180`. A `date` parameter is also available for the past 30 days.
- Response: a `302 Found` that redirects to a preauthenticated download URL. The URL expires after a few minutes and does not need an `Authorization` header.
- CSV columns include Team Name, Team Id, Team Type, Last Activity Date, Active Users, Active Channels, Guests, Meetings Organized and Active External Users.

The longest period is 180 days, so that is the oldest inactivity signal this report can give. Pick a rule, for example a Last Activity Date older than your cutoff in the D90 report and no meetings organized, then export those team IDs as the cleanup candidates.

## Part 2: Notify and archive

Archiving is the gentle step before deletion. The Graph call is:

```http
POST /teams/{id}/archive
```

Documented behavior:

- Least privileged permissions are `TeamSettings.ReadWrite.All` (delegated) and `TeamSettings.ReadWrite.Group` (application, using resource-specific consent).
- The optional body `shouldSetSpoSiteReadOnlyForMembers` sets members to read-only on the team's SharePoint site. It is not supported in the application context.
- A successful call returns `202 Accepted` with a `Location` header that points to a `teamsAsyncOperation`. The team is archived only after that operation completes.
- Once archived, users can no longer send or like messages, or edit the team's name, description or settings. Membership changes are still allowed.
- The team and its group must have an owner.

To undo it, the unarchive API restores the team. A sensible script waits on the async operation, logs the result, and skips teams that have no owner, since the call would fail for them.

## Part 3: Let the expiration policy do the deletion

For deletion, use the Microsoft 365 group expiration policy rather than your own delete script. Learn describes it as one policy for all Microsoft 365 groups in the organization:

- Groups with user activity are renewed automatically as expiration nears, around 35 days before it.
- Visiting a Teams channel counts as activity, as do SharePoint, Outlook and Viva Engage actions.
- Owners get renewal emails at 30, 15 and 1 day before expiration if the group is not auto-renewed.
- A group that is not renewed is deleted one day after its expiration date.
- Deleted groups can be restored for 30 days. That period is not customizable.
- The group lifetime must be 30 days or more.
- Using the policy requires owning, though not necessarily assigning, Microsoft Entra ID P1 or P2 licenses for the members of the groups it covers.

With Microsoft Graph PowerShell, Learn gives these cmdlets:

```powershell
Connect-MgGraph -Scopes "Directory.ReadWrite.All"

# One policy: 365 days for all Microsoft 365 groups
New-MgGroupLifecyclePolicy -AlternateNotificationEmails emailaddress@contoso.com `
   -GroupLifetimeInDays 365 -ManagedGroupTypes All

Get-MgGroupLifecyclePolicy

# Apply to selected groups only
Add-MgGroupToLifecyclePolicy -GroupLifecyclePolicyId "<policyId>" -GroupId "<groupId>"
```

The Graph resource `groupLifecyclePolicy` has the properties `groupLifetimeInDays`, `managedGroupTypes` (All, Selected or None) and `alternateNotificationEmails`, which receives notices for groups without owners. `Invoke-MgRenewGroup` renews a group. In the Entra admin center, the Selected scope allows up to 500 groups, and the All scope does not have that limit. Reading a group's expiry date uses the beta `expirationDateTime` property.

Two retention interactions matter before you turn this on:

- If a group mailbox is on legal hold, Learn says it is retained after the group is deleted, while Planner, site and Teams data is permanently deleted 30 days after deletion.
- With a retention policy, group conversations and site files are kept in a retention container for the policy's duration. Users cannot see the group after expiration, but data can be recovered through eDiscovery.

## Part 4: Teams retention policies

Teams message retention is configured in Purview, not by the expiration policy. Learn's retention pages say:

- You configure the **Teams channel messages** and **Teams chats** locations. Choosing Teams locations automatically excludes other locations, so one policy cannot cover everything.
- Shared channels inherit retention settings from the parent team. Private channels also inherit them after the migration described in Learn.
- It can take up to seven days for a new policy to apply.
- A timer job that typically takes 1 to 7 days moves expired items to the SubstrateHolds folder. Items stay there at least one day. Learn's example is that a delete after 1 day could take 16 days before permanent deletion.
- Retention policies for Teams don't cover code snippets, voice memos from the mobile client, or emoticon reactions.
- Files are separate. Channel files need policies on the group mailboxes and sites or SharePoint locations.

The `New-RetentionCompliancePolicy` reference documents the Teams parameters:

```powershell
New-RetentionCompliancePolicy -Name "Teams chats" -TeamsChatLocation All
```

Learn describes `-TeamsChannelLocation` and `-TeamsChatLocation` as the parameters that select teams or users, with `-TeamsChannelLocationException` and `-TeamsChatLocationException` for exclusions when All is used. The page says a policy is not valid until you add a rule with `New-RetentionComplianceRule`, but the page I read does not list that cmdlet's parameters. Check its reference before scripting the rule.

Some settings cannot be changed after saving: Learn says the policy name, the scope type (adaptive or static) and retention settings other than the retention period are fixed once the policy is saved. Plan the policy before you automate it.

## A routine that ties it together

1. Weekly: download the activity report and list teams with no recent activity.
2. Email the owners of those teams, using the alternate notification address when a team has no owner.
3. After the notice window, archive the teams that stayed idle, and log each async operation.
4. Let the expiration policy delete groups that are neither renewed nor active.
5. Review Purview retention separately, and do not assume deletion removes held data.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Retention policies](https://www.m365.fm/entity/retention-policies/)
- [Microsoft Graph](https://www.m365.fm/entity/graph/)
- [Microsoft Graph PowerShell](https://www.m365.fm/entity/microsoft-graph-powershell/)

## Sources

- [Microsoft Learn: Microsoft 365 group expiration policy](https://learn.microsoft.com/en-us/entra/identity/users/groups-lifecycle)
- [Microsoft Learn: groupLifecyclePolicy resource type](https://learn.microsoft.com/en-us/graph/api/resources/grouplifecyclepolicy)
- [Microsoft Learn: team archive API](https://learn.microsoft.com/en-us/graph/api/team-archive)
- [Microsoft Learn: reportRoot getTeamsTeamActivityDetail](https://learn.microsoft.com/en-us/graph/api/reportroot-getteamsteamactivitydetail)
- [Microsoft Learn: Create and configure retention policies](https://learn.microsoft.com/en-us/purview/create-retention-policies)
- [Microsoft Learn: Learn about retention for Teams](https://learn.microsoft.com/en-us/purview/retention-policies-teams)
- [Microsoft Learn: New-RetentionCompliancePolicy](https://learn.microsoft.com/en-us/powershell/module/exchange/new-retentioncompliancepolicy)
