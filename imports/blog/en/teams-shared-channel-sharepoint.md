---
title: "Teams shared channels and SharePoint: where the files really live"
summary: "Teams shared channel SharePoint basics: each shared or private channel gets its own site, with its own member list. See where files live and who can open them."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [shared-channels, teams-channels, sharepoint, sharepoint-permissions]
keypoints:
  - "Standard channels share the team's SharePoint site and use one folder each, while every private channel and every shared channel has its own SharePoint site."
  - "Only members of a shared channel can open its site; people in the parent team and admins do not get access unless they are channel members."
  - "Site permissions of a shared channel site follow the channel membership and cannot be managed independently in SharePoint."
  - "Access granted to a file through SharePoint is not removed when someone leaves the channel or the team, so review file-level sharing separately."
  - "Each private or shared channel adds a site, so channels increase your site count and belong in your site inventory."
faq:
  - q: "Where are the files of a Teams shared channel stored?"
    a: "Each shared channel has its own SharePoint site, and the files live in the default document library of that channel site. Microsoft states that the site is created in the same geographic region as the parent team's site. Standard channels differ: they use a folder in the parent team's site."
  - q: "Can team owners or admins see files in a shared channel?"
    a: "Not automatically. Microsoft states that only people with owner or member permissions in the channel have access to the content, and that people in the parent team and admins do not have access unless they are channel members. Team owners can see the channel name and delete the channel, but not its files."
  - q: "Can I manage a channel site's permissions in SharePoint?"
    a: "No. For shared channels, Microsoft states that site permissions are kept in sync with the channel membership and cannot be managed independently through SharePoint. For private channels, the permissions come from the channel and appear in read-only mode in SharePoint. Change the channel membership in Teams instead."
---

Each standard channel in a team stores its files in a folder of the team's SharePoint site, while every private channel and every shared channel has its own separate [SharePoint](https://www.m365.fm/entity/sharepoint/) site, with its own list of people. This guide is for the Teams admin who is asked why a person can see a team but not a channel's files, or why a team suddenly has more sites than expected. It explains the mapping, who has access, what sharing is possible, and what you can and cannot control as an admin.

## Teams shared channel SharePoint sites: where the files live

Microsoft's overview of [Teams and SharePoint integration](https://learn.microsoft.com/en-us/sharepoint/teams-connected-sites) describes three cases:

- **Standard channels.** All standard channels in a team share the same SharePoint site. The Files tab of each channel is connected to a folder in the default document library of the parent site, with a separate folder per channel.
- **Private channels.** Each private channel has its own SharePoint site, and its files live in the default document library of that channel site.
- **Shared channels.** Each [shared channel](https://www.m365.fm/entity/shared-channels/) has its own SharePoint site, built the same way.

The channel site is created when you create the channel. Microsoft states that when you create a new private or shared channel, a new SharePoint site is created and connected to that channel. This is the answer to the question of the shared channel files location: not in the team's site, but in a site that belongs to the channel.

Microsoft's article on [shared channels](https://learn.microsoft.com/en-us/microsoftteams/shared-channels) adds details. The channel site is created in the same geographic region as the site of the parent team, and it inherits the sensitivity label of the parent team. If the site is deleted outside of Teams, it is restored automatically within four hours, as long as the shared channel is still active.

## Who has access to the files

Access follows the type of channel, and this is where surprises come from.

- **Standard channel.** The team's membership is stored in a Microsoft 365 group, and that group also gives the people access to the parent site. Team owners and members are automatically included in the site owners and members. Microsoft recommends managing all permissions through Teams.
- **Private channel.** Only members of the private channel can access its site. Microsoft states that the permissions are inherited from the channel itself and cannot be managed in SharePoint, but they are displayed in read-only mode.
- **Shared channel.** According to the shared channels article, only people with owner or member permissions in the channel have access to the content in the channel site. People in the parent team and admins do not have access unless they are also channel members. The site's owner and member groups are kept in sync with the channel membership, and the site permissions cannot be managed independently through SharePoint.

One caveat: the Learn pages are not fully consistent for shared channels. The overview page defines the site as accessible only to members of the shared channel, but its table also says that team owners and members are included in the site groups. The shared channels article is explicit, so treat it as the authority, and test a real channel in your tenant before you promise anything to a team.

This model is the reason that a team member can see a channel in the list yet not open its files: for a private channel, they are not members; for a shared channel, they were never in the channel. The team owners also have limits. Microsoft states that team owners can see the names of shared channels and delete any of them, but they cannot see the files, the conversations or the member list unless they are members of that channel.

## Shared channels in Microsoft Teams: external users and sensitivity

Shared channels in Microsoft Teams exist so that you can work with external users and people who are not in the team. A few rules matter for your policies:

- **Guests cannot be added.** People with guest accounts in your organization cannot join a shared channel.
- **External participants** use Microsoft Entra B2B direct connect, and shared channels with external participants do not use guest accounts. Guest access in Teams must still be enabled to invite them.
- **Site sharing.** A private or shared channel site cannot be shared separately. Files and folders can be shared with people in the organization and with external participants in the channel by using sharable links. Sharing with people outside the organization who are not channel members is not supported.
- **Sensitivity.** A file encrypted by a sensitivity label cannot be opened by external participants unless permissions are granted.

A last caveat is important for audits. Microsoft states that if a user is granted access to a file, folder or notebook in a shared channel through SharePoint, removing the user from the team or the shared channel does not remove the user's access to that file. Channel membership is not the only door, so include file-level sharing in your reviews of [SharePoint permissions](https://www.m365.fm/entity/sharepoint-permissions/).

## What admins can and cannot control

In the SharePoint admin center, you can set the site quota and the default sharing link type for both the parent site and the channel sites, according to Microsoft's overview. Guest access expiration can be set only on the parent site, and the sensitivity of channel sites is inherited from the parent. Compliance features apply as well: Microsoft states that communication compliance, data loss prevention and retention policies apply to shared channels, which inherit the host organization's communication compliance and DLP policies and the parent team's retention policy.

Some lifecycle behavior surprises admins:

- **Inactive site policy.** Microsoft's [inactive site policy](https://learn.microsoft.com/sharepoint/inactive-site-policy) page lists sites associated with shared and private Teams channels as out of scope.
- **Archive.** According to the [Microsoft 365 Archive guide](https://learn.microsoft.com/en-us/microsoft-365/archive/archive-manage), archiving is blocked in the SharePoint admin center for a team site that has channel sites associated, with the message that the group connected site with channel sites associated cannot be archived. With PowerShell or Graph, only the main site and its standard channels are archived, and private and shared channel sites remain active.
- **Ownerless channels.** If the last shared channel owner leaves, an organization member is promoted if one exists. Otherwise, the channel remains ownerless until a Teams admin assigns an owner.

Plan your clean-up routines with these exceptions in mind, because the usual lifecycle tools do not reach every channel site.

## Example: 200 teams and a hidden doubling

This example uses invented numbers. A company has 200 teams. Its inventory counts 200 team sites, one per team. An audit finds that the teams have 150 private channels and 50 shared channels in total.

- **Sites before:** 200, one per team.
- **Sites added by channels:** 150 + 50 = 200.
- **Sites in total:** 200 + 200 = 400.

The number of sites doubles without anyone creating a site by hand. For the IT team, three consequences follow. The site inventory must include channel sites. The reviews of permissions must include the channel membership, because it decides who can open the files. And the cleanup policies need a manual path for channel sites. The admin also checks one shared channel with an external partner: the 12 internal members and 3 external participants are the only people with access, and the 2 team owners who are not channel members have none.

## Common mistakes

- **Looking for channel files in the team site.** Private and shared channel files are in their own sites.
- **Trying to fix access in SharePoint.** Channel site permissions follow the channel, so change the channel membership in Teams.
- **Assuming team owners see everything.** For shared channels, they do not see files unless they are channel members.
- **Forgetting file-level links.** A direct share keeps access after the person leaves the channel.
- **Leaving channel sites out of the inventory.** Each private or shared channel adds a site that reports and policies must cover.

## How software can help

The SharePoint admin center and PowerShell show sites and quotas, and the Teams client shows channel membership. For a recurring review, an export that maps each team to its channels, channel sites and members saves time. Judge any reporting tool by whether it connects a [Teams channel](https://www.m365.fm/entity/teams-channels/) to its SharePoint site and member list in one view.

## Next step

Pick one team that uses a shared channel and trace the files from the channel to its site and members. Then you know how a Teams shared channel SharePoint site behaves in your tenant, and you can write the rule for the next audit.
