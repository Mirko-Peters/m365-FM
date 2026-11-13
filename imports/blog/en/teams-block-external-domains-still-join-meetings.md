---
title: "Teams 'Block All External Domains' Is On, but Users Still Join External Meetings: Which Setting Does What"
summary: "External access is blocked in Teams, yet people still call, chat or join meetings with outsiders. Learn which settings control chat, meeting join, anonymous join and guests, and where to change each one."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [teams, teams-admin-center, guest-access, cross-tenant-access-settings]
keypoints:
  - "Block all external domains in Teams external access controls federated chat and calls between organizations. It does not control meeting links, guests or anonymous join."
  - "Meeting access is set in the meeting policy under Meeting join and lobby: 'People can join external meetings hosted by' and 'Anonymous users can join a meeting'."
  - "Guests are accounts in your own directory, so Teams treats them like members for chat, calls and meetings. Limit them in Microsoft Entra and in Teams guest access."
  - "To block single people or domains, use the blocked users list or the Tenant Allow/Block List in the Defender portal. Check the current Learn page, because the Defender option was in preview."
faq:
  - q: "Does 'Block all external domains' stop my users from joining a meeting hosted by another company?"
    a: "No. That setting covers federation for chat and calls between organizations. Joining a meeting by link depends on the meeting policy setting 'People can join external meetings hosted by', whose default is Anyone, and on the host organization's anonymous-join and lobby settings."
  - q: "Why can a guest still chat, call and join meetings?"
    a: "A guest has an account in your directory. Teams treats that account like an internal user for these actions. If you do not want this, turn off Teams guest access, restrict invitations in Microsoft Entra, or remove guest accounts you no longer need."
  - q: "Should I turn off the organization-wide setting 'Anonymous users can join a meeting'?"
    a: "Microsoft Learn recommends leaving the org-wide setting On and controlling anonymous join through the user-level meeting policy of the same name. Learn also says the org-wide setting will be removed in the future. The first moderator answer in the community thread advised turning it off, but a later answer from the same moderator says to keep it On, in line with Learn."
  - q: "How do I block one specific external person?"
    a: "In the Teams admin center, open Users, then External access, turn on 'Block specific users from communicating with people in my organization', select Block a user and enter the address. Microsoft Learn lists a limit of 200 blocked users."
---

An administrator sets **Block all external domains** in Teams external access. A few days later, users are still calling people from other companies and joining their meetings. The admin asks the community what went wrong.

The setting did what it promises. It just does less than the name suggests. This article is based on a March 2026 Microsoft Q&A thread where a moderator explained the gap, plus the current Microsoft Learn pages for external access and meeting settings. It is a troubleshooting guide, not an official Microsoft procedure. Names and paths can change, so compare them with your admin center.

## What the symptoms look like

- External access is set to **Block all external domains**, but users still chat, call or meet with outsiders.
- Users join meetings that other companies host, just by clicking the invite link.
- External people join your meetings as anonymous attendees.
- Guests from partner companies can chat and call your staff without restriction.

## Why it happens: four separate controls

Teams has four layers that people often mix up. Each has its own setting.

| Layer | What it controls | Where it lives |
|---|---|---|
| External access (federation) | Chat and calls between your org and other Microsoft 365 organizations, set by domain. Unmanaged Teams accounts and Skype users have their own settings on the same page | Teams admin center, **Users**, **External access** |
| Guest access | Outside people who have an account in your directory and belong to your teams | Teams admin center, guest access settings, and Microsoft Entra |
| Meeting join policies | Which external meetings your users may join, and who may join yours | Teams admin center, **Meetings**, **Meeting policies**, **Meeting join & lobby** |
| Lobby | Who enters a meeting directly and who waits | Same policy page, **Who can bypass the lobby** |

Microsoft Learn is explicit about the first layer. External access lets people chat and meet with others outside the organization. People from blocked domains can still join your meetings anonymously if anonymous access is allowed. Organizations you do not trust are treated as anonymous in your meetings. So blocking domains does not close the meeting door.

The moderator in the March 2026 thread said the same: guests are internal to the directory, and meeting access follows the policies of the organizer's tenant.

## Step 1: Confirm what external access really blocks

In the Teams admin center, open **Users**, then **External access**. Under **Teams and Skype for Business users in external organizations**, check the option. Learn lists these choices: allow all external domains (the default), allow only specific domains, block only specific domains, and block all external domains.

Two details from Learn:

- Blocking a domain does not block its subdomains. To include them, run `Set-CsTenantFederationConfiguration -BlockAllSubdomains $True`.
- Each external-access feature needs both an organization setting and a user policy to allow it. Both are on by default.

Do not test this by joining a meeting. Test it by starting a chat with an address from a blocked domain.

## Step 2: Limit which external meetings your users can join

Open **Meetings**, then **Meeting policies**, and select the policy that your users have. Under **Meeting join & lobby**, find **People can join external meetings hosted by**. Learn gives the default as Anyone. The moderator in the thread suggested setting it to **No one** to stop users from joining outside meetings. In a later answer the moderator added that this applies only to signed-in users: anonymous joining stays possible if the external organizer allows it. Learn does not list the other values on the page I read, so check the drop-down in your tenant for the exact choices.

Remember that policies are assigned per user. Check the policy assignment for the people you test with, not only the Global policy.

## Step 3: Decide how anonymous join should work

Anonymous join has two switches:

- **Anonymous users can join a meeting** in the meeting policy. Learn says it is On by default and includes people from organizations that are not on your allowed list.
- **Anonymous users can join a meeting** in the org-wide settings: **Meetings**, **Meeting settings**, **Participants**. Learn says that if this is Off, no anonymous user can join any meeting, regardless of the policy.

Here the thread contradicts itself. The first moderator answer advised turning the org-wide setting off. A later answer from the same moderator, and Learn, recommend leaving it On. Learn says the org-wide setting will be removed in the future and points to the user-level policy instead. Follow Learn and use the policy. If you only want to make anonymous attendees wait, narrow **Who can bypass the lobby**. The thread names **People in my organization**, while Learn gives the default as **People in my org and guests**, so check the exact labels in the drop-down.

Also note that **Anonymous users and dial-in callers can start a meeting** is Off by default. Leave it Off.

## Step 4: Review guest access

Guests are the usual reason that "blocked" people still reach your staff.

1. In the Teams admin center, open the guest access settings. Turn guest access off if you do not want any cross-company collaboration.
2. In the Microsoft Entra admin center, open **External Identities**, then **External collaboration settings**. Under **Collaboration restrictions**, choose **Allow invitations only to the specified domains** if you want an allow list. Learn describes this as the most restrictive choice.
3. Remember that the Entra list does not affect external users who have already accepted an invitation. Review the existing guest accounts and remove those you do not need.

Learn also notes that the invitation allow and block list is separate from the SharePoint and OneDrive sharing lists. File sharing needs its own setting.

## Step 5: Block single people or domains

If you only need to stop a few contacts:

1. In **Users**, **External access**, turn on **Block specific users from communicating with people in my organization**.
2. Select **Block a user**, enter the email address and select **Apply**. Learn lists a limit of 200 users and says existing one-to-one and group chats with a blocked user are removed.

For domains, Learn describes an option named **Allow my security team to manage blocked domains**. When it is on, the blocked-domain list moves to the Tenant Allow/Block Lists in the Microsoft Defender portal. Learn names the **Teams domains** tab there. The moderator in the thread called it **Teams senders**, so trust the label you see. The Learn page I read, last updated in November 2025, marked this feature as public preview and required Defender for Office 365 Plan 1 or 2. Check whether that is still true. The moderator in the thread explained that the missing **Block specific users** option on the External access page was a side effect of having this security-team option switched on. Learn does not state this, so check the option first if the Block specific users setting is gone.

## Step 6: Retest

The moderator in the thread suggested waiting up to 24 hours for policy changes. I could not find that number on the Learn pages I read, so treat it as a rule of thumb. Retest in this order: a chat to a blocked domain, a meeting link from an outside organizer, an anonymous join to one of your meetings, and a guest account chat.

## Limits and open points

- The thread ended with the asker saying the explanation gave clarity. No answer was formally marked as accepted.
- Learn says that communication with unmanaged Teams accounts and Skype users is not available in GCC, GCC High, DoD or private cloud deployments.
- The other organization must also allow external access. Without that, its users are treated as anonymous in your meetings.
- Blocking the meeting join policy affects every user on that policy. Plan a pilot group first.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Teams admin center](https://www.m365.fm/entity/teams-admin-center/)
- [Guest access](https://www.m365.fm/entity/guest-access/)
- [Cross-tenant access settings](https://www.m365.fm/entity/cross-tenant-access-settings/)

## Sources

- [Microsoft Learn: Manage external meetings and chat with people and organizations using Microsoft identities](https://learn.microsoft.com/en-us/microsoftteams/trusted-organizations-external-meetings-chat)
- [Microsoft Learn: Manage external access in Teams](https://learn.microsoft.com/en-us/microsoftteams/manage-external-access)
- [Microsoft Learn: Meeting settings and policies reference](https://learn.microsoft.com/en-us/microsoftteams/settings-policies-reference)
- [Microsoft Learn: Meeting settings in Teams](https://learn.microsoft.com/en-us/microsoftteams/meeting-settings-in-teams)
- [Microsoft Learn: Allow or block invitations to B2B users from specific organizations](https://learn.microsoft.com/en-us/entra/external-id/allow-deny-list)
- [Microsoft Q&A: Users still can call and join external Teams users even though External Access is set to Block all external domains (March 2026)](https://learn.microsoft.com/en-us/answers/questions/5824697/users-still-can-call-join-external-teams-users-eve)
