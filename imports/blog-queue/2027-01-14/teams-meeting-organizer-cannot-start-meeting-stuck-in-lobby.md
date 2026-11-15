---
title: "Teams Meeting Organizer Cannot Start the Meeting and Is Stuck in the Lobby: Causes and Fixes"
summary: "An organizer who joins as a regular participant and sees no Start or Admit controls usually has mismatched Teams and Outlook identities. Align accounts, check delegate cases and use the lobby settings reference."
status: review
publish: false
author: mirko-p
date: 2027-01-14
topics: [teams, teams-admin-center]
keypoints:
  - "Learn says the issue typically occurs when different accounts are used in Teams and Outlook, so the organizer is treated as a regular participant."
  - "Typical signs: stuck in the lobby, no Start meeting, Admit or meeting management options, and attendees waiting."
  - "Check which account and calendar created the meeting in Outlook, then confirm Teams uses the same account and tenant."
  - "Sign out of both apps, reopen Outlook first and then Teams, and rejoin from the Teams calendar or join link."
  - "For shared or delegated mailbox meetings, start with the same identity that scheduled it, or recreate the meeting from the intended organizer."
faq:
  - q: "Why can the meeting organizer join but not start the meeting?"
    a: "Microsoft Learn says the issue usually occurs when the identity Teams uses does not match the identity that scheduled the meeting in Outlook. Scenarios include different accounts in Outlook and Teams, a meeting created from a shared or delegated mailbox while Teams runs under the primary account, and cached credentials or stale tokens."
  - q: "What does the organizer see in this situation?"
    a: "Learn lists these signs: the organizer is stuck in the lobby and cannot admit attendees, Teams does not show organizer controls such as Start meeting, Admit or meeting management options, and attendees wait while the organizer looks like a regular participant."
  - q: "What is the first fix?"
    a: "Open the meeting in Outlook to identify the account and calendar that created it. Then confirm in Teams, by selecting the profile picture, that the account and tenant are the same. If they differ, sign out of both apps, close them, reopen Outlook first and then Teams, sign in with the organizer's account and rejoin."
  - q: "What if the meeting was created from a shared mailbox?"
    a: "Learn says to start the meeting with the same organizer and delegate identity that scheduled it. If needed, recreate the meeting from the intended organizer account and resend the invites."
  - q: "How can an admin check lobby settings?"
    a: "The Teams admin center page for lobby options lists policies such as Who can bypass the lobby and Who can admit from lobby. Learn also describes a lobby diagnostic tool that explains the expected lobby experience for a specific user in a specific meeting."
---

If the organizer joins a Teams meeting but cannot start it, sits in the lobby and sees no **Start meeting** or **Admit** controls, the most likely cause is an identity mismatch. Microsoft Learn says the issue typically occurs when different accounts are used in Teams and Outlook. Match the account in both apps, sign out and back in, and rejoin. Shared and delegated mailbox meetings need extra care.

## What it looks like

Learn lists these signs:

- The organizer is in the lobby or virtual lobby and cannot admit attendees.
- Teams does not show organizer controls such as **Start meeting**, **Admit** or meeting management options.
- Attendees wait while the organizer appears as a regular participant.

## Why it happens

The identity that Teams uses does not match the identity that scheduled the meeting in Outlook. Learn names three common scenarios:

- Outlook is signed in with one account and Teams with another.
- The meeting was created from a shared mailbox or delegated mailbox, but Teams runs under the user's primary account.
- Cached credentials or stale sign-in tokens make Teams and Outlook use different identities.

## Fix: align the identities

1. **Confirm the organizer account.** Open the meeting in Outlook and identify which account and calendar created it.
2. **Match the account in both apps.** In Outlook, confirm the signed-in account used to create the meeting. In Teams, select your profile picture and confirm your account and tenant. Both apps must use the same account and tenant.
3. **Sign out and back in.** Sign out of Teams and Outlook, close both apps completely, reopen Outlook first and then Teams, and sign in with the organizer's account.
4. **Rejoin.** Use the Teams calendar or the Teams join link after sign-in is aligned, and verify that organizer controls appear.

## Shared or delegated mailbox meetings

If the meeting was created in a delegate or shared mailbox context, Learn says to start it with the same organizer and delegate identity that scheduled it. If needed, recreate the meeting from the intended organizer account and resend the invitations.

## If it still fails

1. Test by joining from Teams on the web in an InPrivate or Incognito window with the organizer account.
2. If the web version works but the desktop app does not, clear the desktop sign-in and the cache, then retry.

Learn's page does not give the exact steps to clear the Teams cache on each platform, so use the Teams documentation for your operating system.

## What admins can check

The organizer controls depend on role, not only on identity. Learn's lobby page explains that the lobby holds back certain participants until an organizer, co-organizer or presenter admits them, and that organizers, co-organizers and presenters are notified when someone waits there. The same page lists the meeting policy settings that control the lobby in the Teams admin center under **Meetings** > **Meeting policies**, in the **Meeting join & lobby** section:

- **Who can bypass the lobby**
- **Who can admit from lobby** (default value **Organizers and presenters**)
- **People dialing in can bypass the lobby**
- **Anonymous users can join a meeting**
- **Anonymous users and dial-in callers can start a meeting**

The page says changes can take up to 24 hours to take effect. It also says organizers can change several defaults through their **Meeting options**, so a value you set as admin may differ in a single meeting.

One more point from that page: when **Anonymous users and dial-in callers can start a meeting** is **Off**, which is the default, anonymous participants and dial-in users wait in the lobby until a verified participant joins. That case differs from the organizer problem here, but it can look similar to attendees who just see a waiting screen.

Learn also describes a lobby diagnostic tool, available when you are signed in as a Teams administrator. It explains the expected lobby experience for a specific user in a specific meeting and gives guidance if the experience does not match your configuration.

## A quick triage

This is my own summary.

1. Organizer sees no controls: suspect identity. Compare the Outlook and Teams accounts.
2. Meeting made from a shared mailbox: use the delegate path or recreate the meeting.
3. Attendees, not the organizer, are stuck: look at the lobby policies and meeting options.
4. One organizer only: try the web client, then clear the desktop sign-in.
5. Many organizers: check policy changes and wait for the 24 hour propagation window before reverting.

## Prevention and what to note before you escalate

This section is my advice, not a Microsoft statement.

- Schedule meetings from the account you will use to start them. If a delegate schedules on your behalf, agree in advance who starts the meeting and from which identity.
- After a password change or a sign-in to a second tenant, sign out and back in to both apps, because stale tokens are one of the causes Learn lists.
- If the problem repeats for one person, note the time of the meeting, the organizer account shown in Outlook, the account shown in Teams, and whether the meeting was created from a shared or delegated mailbox. This turns a vague report into something an admin can compare with the lobby policy and the lobby diagnostic tool.
- Tell attendees what to expect. If they see a waiting screen, it does not always mean the organizer has a problem, because the lobby settings can also hold back guests and dial-in callers.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Teams admin center](https://www.m365.fm/entity/teams-admin-center/)

## Sources

- [Teams meeting organizer can't start meeting - Microsoft Teams (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/microsoftteams/teams-conferencing/organizer-cant-start-teams-meeting)
- [IT Admins - Manage lobby options in Microsoft Teams - Microsoft Teams (Microsoft Learn)](https://learn.microsoft.com/microsoftteams/who-can-bypass-meeting-lobby)
