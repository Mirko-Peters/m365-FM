---
title: "How to Share Your Screen in Teams: Options, Tips and Fixes"
summary: "How to share a screen or window in a Teams meeting, which admin policies can switch sharing off, and a troubleshooting order for a missing Share button or a black or white shared window. Sources are community-heavy."
status: review
publish: false
author: mirko-p
date: 2026-11-30
topics: [teams, teams-admin-center, teams-premium]
keypoints:
  - "In a meeting, select Share, then choose the screen, a window, Microsoft Whiteboard, content from camera or PowerPoint Live."
  - "A greyed-out or missing Share option usually means the organizer or an admin policy does not allow it. The Screen sharing mode policy has the values Entire screen, Single application and Not enabled."
  - "Participants can give or request control is on by default. External participants can give or request control is off by default."
  - "Black or white shared content has several documented causes: missing screen-recording permission on macOS, DRM-protected content, outdated clients and tenant policies."
  - "Detect sensitive content during screen sharing needs Teams Premium. PowerPoint Live, Whiteboard and Shared notes are controlled by admin policy."
faq:
  - q: "How do I share my screen in a Teams meeting?"
    a: "During the meeting, select Share and choose what to share. Microsoft Q&A answers list the entire screen, a specific window, Microsoft Whiteboard, content from camera and PowerPoint Live as options."
  - q: "Why is the Share button greyed out?"
    a: "Microsoft Q&A moderators say the organizer may not allow sharing, or an administrator policy may block it. In the Teams admin center, the Screen sharing mode policy can be set to Not enabled."
  - q: "Why do participants see a black screen when I share?"
    a: "A Microsoft Q&A moderator lists screen-recording permission on macOS, organizer or tenant meeting settings, DRM-protected content such as streaming video, and client or browser versions as likely causes."
  - q: "Can an admin turn off screen sharing?"
    a: "Yes. Microsoft Learn describes the Screen sharing mode meeting policy with the values Entire screen, Single application and Not enabled. It is set under Meetings, Meeting policies, Content sharing in the Teams admin center."
  - q: "Can someone else take control of my shared screen?"
    a: "Only if control sharing is allowed. Microsoft Learn says Participants can give or request control is on by default, and External participants can give or request control is off by default."
---

To share your screen in Teams, select **Share** during a meeting and pick a screen, a window, Microsoft Whiteboard, content from camera or PowerPoint Live. If the option is missing or greyed out, the organizer or an admin policy usually blocks it. If participants see a black or white window, the causes range from macOS permissions to protected video content.

**A note on sources.** Microsoft's end-user support article for sharing content could not be opened for this page. The steps below come from Microsoft Q&A answers, some marked AI-generated, and the policy details come from Microsoft Learn admin pages. Confirm menu names in your own Teams client.

## How to share

1. Join the meeting.
2. Select **Share** in the meeting controls. One Q&A answer describes it as a monitor or upward-arrow icon.
3. Choose what to share. A Q&A moderator thread lists **Screen**, **Window**, **Microsoft Whiteboard**, **Content from camera** and **PowerPoint Live**.
4. Select the item to start sharing. The same thread says a red border surrounds shared content, and that Linux does not show the border and lacks window sharing.
5. To switch, stop sharing by selecting **Close share tray**, then choose the new item. One answer says only one window or screen can be shared at a time.

Permissions usually only need to be granted once, according to a community answer.

## Which option to choose

- **Screen:** shares a whole display. This corresponds to the Entire screen mode in the admin policy.
- **Window:** shares one application window. This corresponds to the Single application mode. Microsoft Learn notes that in Teams on the web, Single application acts as Not enabled.
- **PowerPoint Live:** lets attendees navigate forward and back through a shared presentation, according to Learn.
- **Microsoft Whiteboard:** controlled by admin policy.

## Admin policies that affect sharing

Learn lists these in the Teams admin center under **Meetings** > **Meeting policies** > select a policy > **Content sharing**:

| Setting | Default | Effect |
|---|---|---|
| Screen sharing mode | Entire screen | Entire screen: desktop and application sharing. Single application: application sharing only. Not enabled: sharing is off |
| Participants can give or request control | On | Whether a user can give control of a shared desktop or window. Not supported if either user is in Teams in a browser |
| External participants can give or request control | Off | Whether external, anonymous and guest users can be given or request control. Must be turned on in both organizations |
| PowerPoint Live | On | Whether a user can share PowerPoint presentations. External participants inherit the organizer's policy |
| Whiteboard | On | Whether a user can share Whiteboard. External participants inherit the organizer's policy |
| Shared notes | On | Whether attendees can create shared meeting notes |

The Learn page on the presentation experience for sensitive meetings has a configuration step that appears to describe the external control setting the opposite way from its default. Verify the value in the admin center before relying on it.

In events optimized for large audiences, only presenters, organizers and co-organizers can use screen sharing.

**Who can present** is a separate setting under **Meeting join & lobby**. Values are Only organizers and co-organizers, People in my org and guests, and Everyone, which is the default. The admin policy sets the default for new meetings and users can override it unless a sensitivity label enforces a value.

**Teams Premium** adds **Detect sensitive content during screen sharing**. When triggered, the presenter and organizer get notifications to stop sharing and the presenter sees a **Stop sharing** button. It detects items such as credit card and account numbers.

## Troubleshooting order

### The Share option is missing or greyed out

1. Ask the organizer whether sharing is allowed, and check **Who can present**.
2. Ask your admin to check the **Screen sharing mode** policy.
3. In a browser client, remember that Single application does not work as intended there.

### Participants see a black or blank screen

A Microsoft moderator answer says this is usually not a viewing permission on the viewer's side. Likely causes, in the order listed:

1. The presenter's device has not granted screen-recording permission, especially on macOS. The answer points to **System Settings** > **Privacy & Security** > **Screen Recording** for Teams or the browser.
2. The organizer's or an external tenant's meeting settings restrict sharing.
3. DRM-protected content is being shared. Streaming services can appear black.
4. The browser or app version behaves inconsistently. Try the latest Microsoft Edge or Chrome, or the Teams desktop app.

Another thread adds that viewers must accept the sharing prompt before they see shared content, according to an AI-generated answer in that thread.

### A shared window shows white or black but sharing the screen works

A Microsoft Q&A thread from 2025 describes exactly this on Windows 11 with the Teams desktop app, while window sharing worked in the browser. The thread never names a root cause. The moderator advised updating Teams and Windows, clearing the Teams cache and contacting Microsoft Support if the problem persists. The thread records no confirmed fix, so treat these as steps to try.

### Black screen on an Android tablet

A moderator answer in another thread attributes it to a known Microsoft issue that was rolling out to tenants gradually. It suggested updating Teams from Google Play, clearing the app cache (**Settings** > **Apps** > **Microsoft Teams** > **Storage** > **Clear Cache**), checking Camera, Microphone and Screen Access permissions, joining from the browser at teams.microsoft.com/v2/, restarting the device and installing system updates. The original poster reported that none of these worked, so escalation through an administrator may be needed.

## Good habits

- Close messaging apps before sharing a whole screen.
- Prefer sharing a window when you only need one app.
- Use PowerPoint Live for slides so attendees can move through them.
- Check control settings before you give someone control of your screen.

## Common mistakes

- **Blaming the viewer.** Missing content is usually a presenter-side or policy issue.
- **Forgetting macOS permission.** Screen recording permission blocks sharing until it is granted.
- **Sharing protected video.** DRM content can appear black.
- **Assuming guests can take control.** External control is off by default.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Teams admin center](https://www.m365.fm/entity/teams-admin-center/)
- [Teams Premium](https://www.m365.fm/entity/teams-premium/)

## Sources

- [Microsoft Learn: Configure desktop sharing in Teams](https://learn.microsoft.com/en-us/microsoftteams/configure-desktop-sharing)
- [Microsoft Learn: Teams settings and policies reference](https://learn.microsoft.com/en-us/microsoftteams/settings-policies-reference)
- [Microsoft Learn: Manage the meeting presentation experience for sensitive Teams meetings](https://learn.microsoft.com/en-us/microsoftteams/manage-meeting-presentation-experience)
- [Microsoft Q&A: Screen share not showing from host](https://learn.microsoft.com/en-us/answers/questions/5552138/screen-share-not-showing-from-host)
- [Microsoft Q&A: Sharing a window shows only a white or black screen](https://learn.microsoft.com/en-us/answers/questions/2281459/in-a-teams-meeting-sharing-a-window-shows-only-a-w)
- [Microsoft Q&A: Share Screen in Teams](https://learn.microsoft.com/en-us/answers/questions/5835821/share-screen-in-teams)
- [Microsoft Q&A: How to share my screen in a Teams meeting](https://learn.microsoft.com/en-us/answers/questions/4431378/hello-how-to-share-my-screen-in-a-team-meeting-eve)
