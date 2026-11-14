---
title: "Teams External Access vs Guest Access vs Anonymous Join: What Each One Allows"
summary: "Compare Microsoft Teams external access, guest access and anonymous meeting join: who each applies to, what people can do, where admins set them, and which one fits chat, files or one-off meetings."
status: review
publish: false
author: mirko-p
date: 2026-11-29
topics: [teams, guest-access, teams-admin-center]
keypoints:
  - "External access is for chat, calls and meetings with Microsoft identities. Guest access adds a person to a team as an Entra B2B guest. Anonymous join covers unverified people."
  - "Only guests can access Teams resources and share files. External access users can't, according to Microsoft's comparison table."
  - "In meetings, guests show as (Guest), trusted-organization users as (External) and anonymous participants as (Unverified)."
  - "The org-wide setting Anonymous users can join a meeting is going away. Microsoft recommends leaving it On and using the per-organizer Anonymous users can join a meeting unverified policy."
  - "External access is on by default and trust must be mutual. Without it, users from the other organization are treated as anonymous in your meetings."
faq:
  - q: "What is the difference between external access and guest access in Teams?"
    a: "Microsoft Learn says external access lets users find, call and chat with people who have Microsoft identities, including other organizations. Guest access invites people to join a team and gives them an Entra B2B guest account in your directory, so they can also access team resources and share files."
  - q: "Can anonymous users join a Teams meeting?"
    a: "Yes, by default. Microsoft Learn says anonymous meeting access is turned on by default, and admins can turn it off for certain organizers or for everyone. If it is off, anonymous participants can't join at all."
  - q: "Where do I turn off anonymous join in Teams?"
    a: "In the Teams admin center, go to Meetings > Meeting policies, open a policy and set Anonymous users can join a meeting unverified to Off under Meeting join and lobby. The org-wide setting under Meetings > Meeting settings is going away, per Microsoft."
  - q: "Why is someone from a trusted organization shown as unverified in my meeting?"
    a: "Microsoft Learn says participants from other organizations who don't have the correct external access permissions are considered anonymous. Both organizations must trust each other's domains, and users need policies that allow external access."
  - q: "Do guests need a Microsoft 365 license?"
    a: "According to Microsoft Learn, guest access can be used with all Microsoft 365 Business Standard, Enterprise and Education subscriptions, and no extra Microsoft 365 license is necessary. The billing model for Microsoft Entra External ID applies to guests."
---

External access, guest access and anonymous join are three different ways for people outside your organization to take part in Teams. External access is for chat, calls and meetings with people who have Microsoft identities. Guest access adds a person to a team so they can work with files. Anonymous join lets unverified people into a meeting. Pick by what the outside person needs to do.

## The three types in one line each

- **External access:** "A feature that allows users to find, call, and chat with people who have Microsoft identities, including those from other organizations." It is enabled by default.
- **Guest access:** "A feature that allows you to invite people from outside your organization to join a team." Invited people get a Microsoft Entra B2B collaboration guest account in your directory.
- **Anonymous join:** people whose identity can't be verified. They may be logged in to an organization without a mutual trust relationship, or have no account.

## How they appear in a meeting

Microsoft Learn describes the labels:

| Participant type | Label in meetings |
|---|---|
| Guest | (Guest) |
| Person from a trusted organization | (External) |
| Anonymous | (Unverified) |

A verified external participant is a guest signed in with a guest account, or a person from a trusted organization with the required user-level external access permissions. Everyone else is anonymous. Guests must sign in to Teams with their guest account to join as guests. If they are not signed in, they are considered anonymous.

## What each can do

Microsoft's comparison for external access users and guests:

| Capability | External access | Guest |
|---|---|---|
| Chat and call across organizations | Yes | Yes |
| Be invited to a meeting | Yes | Yes |
| Be added to a group chat | Yes | Yes |
| Access Teams resources | No | Yes |
| Share files | No | Yes |
| Search for people in other organizations | Yes, only by email or SIP address | No |
| See out-of-office message | No | Yes |
| Use meet now | No | Yes (allowed by default, admin can turn off) |

Some external access features, such as screen sharing and editing sent messages, are supported for 1:1 chat between Teams-only users in two different organizations, according to the footnotes.

Anonymous participants have fewer capabilities. Microsoft lists that they don't have access to meeting chat before and after the meeting, profile cards or collaborative meeting notes. They can interact with apps already in a meeting if the setting and the app policy allow it, but can't add or manage apps.

## Where admins configure each

### External access

Teams admin center > **Users** > **External access**. Both the organization setting and a user policy must allow it, and both are on by default. Domain options are:

- Allow all external domains (default)
- Allow only specific external domains
- Block specific domains
- Block all external domains

Trust is two-way. The other organization must also trust yours, and its users must be enabled for external access. Blocking contoso.com doesn't block subdomains such as marketing.contoso.com by default. Microsoft gives `Set-CsTenantFederationConfiguration -BlockAllSubdomains $True` for that. You can block specific individuals, up to 200 users. Trial-only tenants are blocked by default.

Skype consumer interoperability with Teams stopped being supported on May 5, 2025.

### Guest access

Guest access is an organization-wide setting and needs related settings in Microsoft Entra ID, Microsoft 365 Groups and SharePoint. Microsoft's guest access page does not give a Teams admin center path, and points to separate guides. You can control guest access to individual teams with sensitivity labels. After a guest is added to a team, it can take up to 12 hours for access to work. All guests must be added to at least one team before guest features apply. Leaving a team does not delete the guest account. A Microsoft Entra admin must remove it.

### Anonymous join

1. Open the Teams admin center and go to **Meetings** > **Meeting policies**.
2. Select or create a policy.
3. Under **Meeting join & lobby**, set **Anonymous users can join a meeting unverified** to **Off**.
4. Select **Save**. Changes might take up to 24 hours.

The org-wide switch is under **Meetings** > **Meeting settings** > **Participants** > **Anonymous users can join a meeting**. Microsoft says this setting is going away. It recommends leaving it **On** and using the per-organizer policy instead.

Organizers also get **Require unverified participants to verify their info before joining** in Meeting options when anonymous join is allowed. It is off by default. With Teams Premium, organizers can require an email one-time passcode if the policy **Anonymous users can join a meeting after verifying** is set to **By email code**. Verified participants show as **Email Verified**.

## Which one to choose

- **A partner's staff need to chat and meet with your people, nothing more:** external access, with trust set up on both sides.
- **A contractor needs to work in a team and edit files:** guest access, or a shared channel. Microsoft notes shared channels allow inviting people without a guest account in Microsoft Entra ID.
- **A one-off meeting with a customer:** anonymous join, with lobby and verification options. Lobby behavior is controlled by separate lobby bypass settings.
- **A non-Microsoft 365 organization where you want people verified in meetings:** add each person as a guest. Microsoft Learn says to add each individual to your directory.

## Common mistakes

- Enabling external access and expecting file sharing to work. Microsoft's table shows it doesn't.
- Blocking a domain and assuming no one can join. Blocked-domain users can still join meetings anonymously if anonymous join is allowed.
- Changing only the org-wide anonymous switch. Per-organizer policies matter, and the org-wide setting is going away.
- Forgetting guest propagation time of up to 12 hours.

## Related

- [Guest access](https://www.m365.fm/entity/guest-access/)
- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Teams admin center](https://www.m365.fm/entity/teams-admin-center/)
- [Entra External ID](https://www.m365.fm/entity/entra-external-id/)

## Sources

- [Use guest access and external access to collaborate with people outside your organization, Microsoft Learn](https://learn.microsoft.com/en-us/microsoftteams/communicate-with-users-from-other-organizations)
- [Guest access in Microsoft Teams, Microsoft Learn](https://learn.microsoft.com/en-us/microsoftteams/guest-access)
- [Manage external meetings and chat with people and organizations using Microsoft identities, Microsoft Learn](https://learn.microsoft.com/en-us/microsoftteams/trusted-organizations-external-meetings-chat)
- [Plan for meetings with external participants in Microsoft Teams, Microsoft Learn](https://learn.microsoft.com/en-us/microsoftteams/plan-meetings-external-participants)
- [Manage anonymous participant access to Teams meetings, Microsoft Learn](https://learn.microsoft.com/en-us/microsoftteams/anonymous-users-in-meetings)
