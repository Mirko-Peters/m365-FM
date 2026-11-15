---
title: "Teams with no owner: how to find them and assign new owners"
summary: "Teams with no owner cannot be managed or renewed. Find ownerless teams in the admin center, assign new owners and set the Microsoft ownerless group policy."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [teams, microsoft-365-groups, sharepoint-site-owner, teams-admin-center]
keypoints:
  - "A team is backed by a Microsoft 365 group, so a team with no owner is an ownerless group, and you can filter for ownerless groups in the Microsoft 365 admin center."
  - "Assign owners in the admin center, in the Exchange admin center with Add group owners, or with the Add-TeamUser cmdlet and the Owner role."
  - "Microsoft's ownerless group policy emails the most active members weekly and asks them to accept ownership; up to two members per group can accept."
  - "The policy covers up to 50 groups, and when nobody accepts, a tenant admin has to find and assign an owner."
  - "Prevent the problem with two owners per team, an offboarding step and an alternate notification address for expiring groups."
faq:
  - q: "What happens to a team when the last owner leaves?"
    a: "The team keeps its members and content, but nobody can manage it, and notices such as expiration emails reach no one. An admin can step in and assign an owner. Microsoft's ownerless group policy can also ask the most active members to accept ownership, and up to two of them can accept."
  - q: "How do I find teams with no owner?"
    a: "In the Microsoft 365 admin center, open Teams and groups, then Active teams and groups, select Filter and choose Ownerless groups. Select a group to assign an owner. The Exchange admin center offers the same filter under Groups, and the Purview audit log records the activity Unattended ownerless group."
  - q: "How do I make someone the owner of a team with PowerShell?"
    a: "Use the Add-TeamUser cmdlet from the Microsoft Teams module with the GroupId of the team, the user principal name and the Role parameter set to Owner. Microsoft states that the user is then also added as a member. The change can take between 24 and 48 hours to show in the Teams client."
---

A team with no owner still has members and content, but nobody can manage it, so you find these teams through the ownerless filter in the Microsoft 365 admin center and assign a new owner there or with PowerShell. This guide is for the Teams admin who has just learned that an owner left the company. It explains why ownerless teams matter, how to find them, how to assign owners, how to set up Microsoft's ownerless group policy so that members are asked automatically, and how to stop the problem from coming back.

## Teams with no owner: what happens and why it matters

Every team in [Microsoft Teams](https://www.m365.fm/entity/teams/) is backed by a [Microsoft 365 group](https://www.m365.fm/entity/microsoft-365-groups/), so a team without an owner is an ownerless group. Owners manage membership and settings and are the people Microsoft addresses when something needs a decision. When the last owner leaves, three things stop working:

- **Management.** Nobody inside the team can add or remove members or change settings.
- **Notices.** Microsoft's expiration policy emails owners before a group expires. For groups without an owner, the notices go to the alternate address that you configured, so without one, nobody is warned.
- **Accountability.** Nobody answers when a user asks who is responsible for the content.

Members can usually keep working in the channels, which is why the problem stays invisible. But if the group has an expiration policy and nobody renews it, Microsoft deletes the group one day after it expires, and the team goes with it.

Admins often call these orphaned teams. A team becomes ownerless when an owner leaves and nobody has taken ownership. Microsoft's article names one technical cause: a team or group can become ownerless if you delete an owner's account in Microsoft 365. The page does not say what happens when an account is only disabled, so check your offboarding process for that case. The cause is almost always the same: the only owner leaves the company or the team, or a second owner who was meant to take over removes themselves. The team may become ownerless without any warning, and it looks fine for months until a problem appears, for example a member asks for access and nobody can approve it.

Ownerless teams also affect SharePoint. A team site connected to a group has [site owners](https://www.m365.fm/entity/sharepoint-site-owner/) who manage permissions and settings, and an ownerless team leaves that site without a responsible person. Microsoft's site ownership policy in SharePoint Advanced Management addresses the same problem on the site side, by setting minimum owner or admin counts.

## How to find ownerless teams

Microsoft's article on [managing ownerless Microsoft 365 groups and teams](https://learn.microsoft.com/en-us/microsoft-365/admin/create-groups/ownerless-groups-teams?view=o365-worldwide) names three places:

- **Microsoft 365 admin center.** Expand Teams and groups, select Active teams and groups, click Filter and select Ownerless groups. Select a group to assign an owner.
- **Exchange admin center.** Select Groups under Recipients, click Filter and choose Ownerless groups. Select a group and choose Add group owners.
- **Microsoft Purview audit log.** Search for the activity Unattended ownerless group to see which groups were flagged. The activity Updated the ownerless group policy shows changes to the policy itself.

The [Teams admin center](https://www.m365.fm/entity/teams-admin-center/) is the portal for Teams usage reports, templates and policies, so use it for your wider Teams reporting, and use the Microsoft 365 admin center for the ownerless filter. Save the result of the filter with the date, so that you can see the trend.

## How to assign new owners

Decide who should own the team before you click. Good candidates are the most active member, the manager of the department that uses the team, or a person who the former owner named. Avoid assigning yourself, because then you have the same problem again.

You have three ways to assign an owner:

1. **Microsoft 365 admin center.** In the ownerless filter, select the group and assign an owner.
2. **Exchange admin center.** Select the group and choose Add group owners.
3. **PowerShell.** The [Add-TeamUser](https://learn.microsoft.com/en-us/powershell/module/microsoftteams/add-teamuser?view=teams-ps) cmdlet in the Microsoft Teams module adds an owner or member to the team and to the Microsoft 365 group behind it. Use the `GroupId` of the team, the user principal name in `User` and the value `Owner` in `Role`. Microsoft states that when you specify Owner, the user is also added as a member. The command returns immediately, but the update can take between 24 and 48 hours to appear in the Teams client.

According to Microsoft's page on [managing teams with PowerShell](https://learn.microsoft.com/en-us/microsoftteams/teams-powershell-managing-teams), end users can run the team cmdlets only on teams that they own or belong to, while a Global Administrator or Teams Administrator can act on all teams in the organization. Microsoft recommends roles with the fewest permissions, and limits Global Administrator to emergency scenarios.

After you assign an owner, ask the new owner to add a second one. A team with one owner is only one resignation away from the next ownerless team, while a team with two owners survives when one owner leaves.

## Set up the ownerless group policy

You do not have to find every team by hand. Microsoft's ownerless group policy asks members to take ownership automatically. According to the article, an Exchange administrator or Groups administrator can create a policy that asks the members who are the most active in the group whether they accept ownership. If there is no group activity, the policy asks random group members.

To turn it on with the default configuration, open the Microsoft 365 admin center, expand Settings, select Org settings, open the Services tab and select Microsoft 365 Groups. Select the checkbox for emailing and asking active group members to become an owner when there is no owner, and save.

To customize it, select Configure policy and set these options:

- **Weekly notification options.** Choose who can receive notifications, for example by limiting recipients to a security group, plus the number of active members to notify and the number of weeks to send.
- **Sender.** Pick a user mailbox or a group mailbox. Shared mailboxes are not supported.
- **Subject, message and guideline URL.** You can customize the text and link to your policy page. The language does not change by recipient.
- **Target groups.** Choose specific groups or all groups.

### What members and admins see

Notifications go out weekly, starting within 24 hours of creating the policy. Up to two members per group can accept the invitation to become an owner, and after someone accepts, the policy stops sending notifications to the group. A member who declines stops receiving them, and a member who does not respond keeps receiving them for the number of weeks that you set. If nobody accepts, the policy stops after the notification period, and tenant admins need to find and assign an owner for each ownerless group.

### Requirements and limits

- **Licenses.** You need an eligible Microsoft 365 subscription, such as Business Premium or Enterprise E3 or E5, or an Azure P1 or P2 premium plan. Microsoft states that all notification options require an Azure premium plan because a security group specifies who receives the notifications.
- **Group types.** The policy applies only to Microsoft 365 groups.
- **Scale.** You can select up to 50 groups, and you can only search for and add one group at a time.
- **Email limits.** Exchange Online can throttle the notification emails if there are too many ownerless groups, because mailboxes are limited to 10,000 sent emails per day.
- **Forwarded emails.** The Yes and No buttons are not available in a forwarded email.

Because of the 50-group limit, the policy is a safety net for selected, important teams and a regular clean-up routine for the rest.

## Common issues with the ownerless group policy

Microsoft's article lists problems that admins meet after the policy is on. These fixes come from that page:

- **Members do not see the Yes and No buttons.** Ask them to open the notification email in a separate window, not in a preview pane, and make sure that the user principal name and the primary email address of the sender are the same.
- **Nobody receives notifications.** This happens if the sender in the policy has no user or group mailbox in Exchange Online. Members without a user mailbox in Exchange Online do not receive the notifications either. Check the Microsoft Purview audit log to see whether notifications were sent.
- **A forwarded email cannot be answered.** The person who gets a forwarded notification cannot accept or decline.
- **Throttling.** The policy sends all notifications from one mailbox, so many ownerless groups can hit the Exchange Online limit of 10,000 sent emails per day. The page names no fix, so start with fewer groups.

To track the policy itself, search the audit log for the activity Updated the ownerless group policy. Accepting ownership is also logged there.

## Reassign, archive or delete?

Microsoft's article stops where the policy stops: when nobody accepts, the policy takes no further action, and a tenant admin has to find and assign an owner. It does not cover archiving or deleting ownerless groups, so the decision is yours. A practical order is to ask the former owner's manager first. If the team is still in use, assign an owner. If nobody can name a use, follow your own retention and archive rules before you remove anything.

## Prevent ownerless teams

A few habits cost little and prevent most cases:

- **At least two owners per team.** Make this a rule in your team creation process, and review it every quarter, so that no team becomes ownerless when one owner leaves.
- **An offboarding step.** When an owner leaves, list the teams they own and name a successor before the account is disabled, so that the team does not become ownerless.
- **An alternate address for expiring groups.** If you use an expiration policy, set the address for groups without an owner to a mailbox that somebody reads.
- **Training for owners.** Tell owners what the role means and who should take over.
- **A governance rule.** Write the two-owner rule and the offboarding step into your governance policy, so that nobody has to remember them, and delete or archive teams that nobody wants to own.

## Example: 600 teams and 54 without an owner

This example uses invented numbers. A Teams admin filters the active groups and finds 54 ownerless groups among 600 teams, which is 9 percent.

- The policy takes up to 50 groups, so the admin adds the 50 most important ones, one by one, with a weekly notice to the 3 most active members for 4 weeks. The other 4 groups are handled by hand.
- After 4 weeks, in 31 of the 50 groups, a member has accepted. In the other 19 groups, nobody responded.
- The admin assigns an owner to those 19 groups and to the 4 groups outside the policy, which makes 23 manual assignments.

The check: 31 + 19 + 4 = 54 groups handled, and 31 were automatic and 23 manual. The new rule is that every team needs two owners, and the next monthly filter should show a lower number of ownerless groups.

## Common mistakes

- **Waiting for an incident.** An ownerless team has no one to ask, so the problem surfaces only when something breaks.
- **Assigning the admin as owner.** The admin becomes the owner of hundreds of teams, which defeats the purpose.
- **Expecting the policy to cover all groups.** It covers up to 50 groups.
- **Using a shared mailbox as sender.** Microsoft does not support shared mailboxes as the sender.
- **Forgetting the Teams delay.** After an Add-TeamUser command, the Teams client can take 24 to 48 hours to show the change.

## How software can help

The admin center filter and PowerShell are enough for a first clean-up. A monthly export of owners per team, with a count of teams that have fewer than two owners, keeps the number visible. Judge any additional tool by whether it shows owners, activity and expiration status in one list, and whether it lets members respond to an ownership request without admin help.

## Next step

Open the Microsoft 365 admin center today, apply the ownerless filter and count the result. Then pick the most important ownerless teams and assign owners, so that your next list of teams with no owner is shorter.
