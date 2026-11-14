---
title: "Teams Notifications Not Working on iPhone: Troubleshooting Steps"
summary: "Four iPhone cases from the Microsoft Support page on Teams mobile notifications: some missing, none at all, too many, and a wrong badge count. Settings to check in Teams and iOS, the block options, and what to do if Teams is not listed."
status: review
publish: false
author: mirko-p
date: 2027-01-24
topics: [teams]
keypoints:
  - "On iOS, Chat, Mentions, Replies, Calls and Meeting started notifications are on by default."
  - "If only some notifications arrive, tap your profile picture, Notifications, and choose All activity."
  - "If none arrive, check Notifications in Teams, then open the device Settings app, go to Notifications, Teams, and turn on Allow Notifications. If Teams is not listed, reinstall it."
  - "To reduce noise, use the Block notifications options: when active on other devices, when in meetings and in-app notifications."
  - "An incorrect unread count on the iOS app badge is described as a known issue under investigation. The desktop app shows the correct count."
faq:
  - q: "Which Teams notifications are on by default on iPhone?"
    a: "The Microsoft Support page lists Chat, Mentions, Replies, Calls and Meeting started as enabled by default on iOS."
  - q: "I get some notifications but not others. What do I change?"
    a: "The cause can be customized notification settings with some turned off. Tap your profile picture at the top left, then Notifications, and choose All activity. That enables chats, calls, at-mentions, channels, meetings and more."
  - q: "I get no notifications at all. What should I check?"
    a: "The page names three causes: Teams notifications are disabled, the permission prompt was skipped at first launch, or notifications were turned off in the device Settings app. In Teams tap your profile picture and Notifications, and if they are off tap Open settings. In iOS Settings go to Notifications, Teams and turn on Allow Notifications. If Teams does not appear in iOS settings, uninstall and reinstall Teams."
  - q: "Why do I get notifications on my phone while I am at my computer?"
    a: "Mobile notifications are on by default regardless of activity elsewhere. Under Notifications in Teams, use the Block notifications options: When active on other devices, When in meetings and In-app notifications. The page says mobile notifications resume after you have been inactive on web or desktop for a few minutes, and that call notifications still reach mobile even when you are active on desktop."
  - q: "The badge number on the Teams icon is wrong. Is that my setting?"
    a: "The page describes an incorrect notification count as a known issue under investigation. The iOS app badge may show an incorrect unread count, while the desktop app on Windows and Mac shows the correct count."
---

When Teams notifications do not behave on a phone, the cause is usually one of three things: a Teams setting, an iOS setting, or the way Teams decides where to notify you. This article follows the Microsoft Support page on troubleshooting notifications for the Teams mobile apps. This article covers the iPhone (iOS) content only. The page also has an Android tab, which is not described here.

## Defaults on iOS

Notifications are enabled by default for Chat, Mentions, Replies, Calls and Meeting started.

## Case 1: Some notifications arrive, others do not

**Cause.** Notifications may be customized and some are turned off.

**Fix.**

1. In Teams, tap your profile picture at the top left.
2. Tap **Notifications**.
3. Choose **All activity**. This enables chats, calls, at-mentions, channels, meetings and more.

## Case 2: No notifications at all

**Causes** listed on the page:

- Teams notifications are disabled.
- You skipped the permission prompt the first time you opened the app.
- Notifications are turned off in the device Settings app.

**Steps.**

1. In Teams, tap your profile picture, then **Notifications**.
2. If notifications are off, tap **Open settings**.
3. In the iOS Settings app, go to **Notifications** > **Teams** and turn on **Allow Notifications**.
4. Optionally turn on sound so you hear a chime when notifications arrive.

If Teams does not appear in the iOS settings list, the page says to uninstall and reinstall Teams.

## Case 3: Too many notifications

**Cause.** Mobile notifications are on by default, regardless of what you do in Teams on the web or on desktop.

**Steps.** Tap your profile picture, then **Notifications**, and look under **Block notifications**:

| Option | Effect |
| --- | --- |
| When active on other devices | Blocks mobile notifications while you are active on desktop or other devices |
| When in meetings | Allows or blocks notifications during meetings |
| In-app notifications | Turn off to stop notifications while you use the Teams app |

Notes from the page:

- Mobile notifications resume after you have been inactive on web or desktop for a few minutes.
- Call notifications still reach your mobile even when you are active on desktop.
- For scheduled muting the page points to Quiet time in Microsoft Teams.
- If you still do not get a notification, tap your profile picture, then **Settings** > **Help and feedback** > **Send feedback**.

## Case 4: Wrong notification count

The page lists this as a known issue under investigation. The badge on the iOS app may show an incorrect unread count. The desktop app on Windows and Mac shows the correct count. The page does not mention a setting to change. My reading: treat the desktop count as the reference.

## How the settings fit together (my reading)

This section is my own explanation, not text from the page. The notification settings live in two layers. The first layer is inside Teams, where your profile picture leads to **Notifications**. There you choose which activity types alert you and which situations block alerts. The second layer is the operating system. If iOS does not allow notifications for Teams, nothing set inside Teams can bring them back, which is why the Open settings button in Teams leads you to the iOS Settings app. When you troubleshoot, work from the Teams layer outward, and keep in mind that the page describes the permission prompt at first launch as one of the causes. In my experience, that is an easy thing to miss, and the fix is the iOS setting described in the second case.

The block options in the third case are not faults. They are features that can look like faults. A user who turned on the block for being active on other devices will get fewer alerts on the phone by design, and the page explains that notifications return after a few minutes of inactivity on web or desktop.

## What this article does not cover

- Android steps. The page has an Android tab, which is not described here.
- Admin-side reasons, such as policies. The iOS content of the page does not discuss them.

## A short order of work (my advice)

This is my suggestion, not guidance from the page:

1. Decide which of the four cases fits. "All or nothing" points to the iOS permission, and "some but not others" points to the Teams setting.
2. Check the Notifications entry in Teams before iOS Settings, since it tells you whether Teams thinks notifications are off, and its Open settings button leads to the right iOS screen.
3. Check iOS focus or do-not-disturb features separately. The page does not cover them, but they are a normal reason for a silent phone.
4. If you get alerts on the phone while at your desk, test the block option for when you are active on other devices before you change anything else.
5. Keep the Teams app updated, and restart the phone after a reinstall.

For a support desk, a short reply template with the four cases and the profile picture path saves many tickets.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)

## Sources

- [Troubleshoot notifications in Microsoft Teams mobile apps (Microsoft Support)](https://support.microsoft.com/office/troubleshoot-notifications-for-teams-mobile-apps-6d125ac2-e440-4fab-8e4c-2227a52d460c)
