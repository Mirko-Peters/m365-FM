---
title: "Fix Teams Screen Sharing Video Lag and Choppy Display During Meetings"
summary: "Why shared video looks choppy in Teams: screen sharing uses a low frame rate by default to keep static content sharp. The fix from Microsoft Learn, the Optimize control on the presenter toolbar, the older Ctrl+Alt+Shift+T toggle, how to check frame rate in Call health, and other sharing options."
status: review
publish: false
author: mirko-p
date: 2027-01-25
topics: [teams]
keypoints:
  - "By default Teams screen sharing uses a low frame rate, because commonly shared content like Excel or Word is static, and a low rate keeps it sharp."
  - "When you share video or other high-motion content, attendees can see lag or dropped frames at that low frame rate."
  - "Use the Optimize control on the presenter toolbar to reduce choppiness when you share video. It is visible only to the presenter."
  - "The Ctrl+Alt+Shift+T toggle, for Teams 1.6.00.12455 and later, is described by Learn as being deprecated soon in favor of the presenter toolbar."
  - "Resolution of shared content might drop to allow the higher frame rate, depending on device capability and bandwidth. Check the values in Settings, Call health."
faq:
  - q: "Why does a video I share in Teams look choppy to attendees?"
    a: "Microsoft Learn says the default frame rate for screen sharing in Teams is low, because commonly shared content such as an Excel workbook or Word document is static, and the low frame rate gives attendees the highest possible resolution. For video the same setting can make playback appear to lag, with frames dropped now and then."
  - q: "How do I fix it?"
    a: "Use the Optimize control on the presenter toolbar while you share. The Teams support page says Optimize reduces choppiness or lag when you share video content. Learn also describes a keyboard shortcut for Teams 1.6.00.12455 and later, Ctrl+Alt+Shift+T after selecting the Teams app, but says it will be deprecated soon."
  - q: "Does high-motion sharing cost anything?"
    a: "Learn says the resolution of the shared content might drop to accommodate the higher frame rate, depending on factors such as device capability and available bandwidth."
  - q: "How do I know whether the keyboard shortcut is on?"
    a: "You do not see a visual indication. The shortcut is a toggle, and using it twice returns Teams to the default behavior. To see the frame rate, resolution and other details, select More, then Settings, then Call health in the meeting, and scroll to the Screen Sharing section."
  - q: "Do attendees hear the sound of my video?"
    a: "Only if you share sound. The support page says to turn on Include sound in the Share dialog before you start sharing, or use Share audio on the presenter toolbar. Sound from your computer, including notifications, is then audible to participants."
---

A video that plays smoothly on your screen can look choppy to everyone else in a Teams meeting. This is not a fault in most cases. It is the default way Teams shares a screen. The Microsoft Learn page on screen sharing video lag is short, so this article adds the relevant guidance from the Microsoft Support page on sharing content in Teams meetings, and marks my own advice separately.

## Symptoms

During a call you share a video or other content that needs a higher frame rate. For the other attendees the display appears to lag and frames are dropped now and then.

## Cause

By default Teams uses a low frame rate for screen sharing. The reason is that commonly shared content, such as an Excel workbook or a Word document, is static, and the low frame rate gives attendees the highest possible resolution of that content. The default becomes a problem when the shared content is a video, which can look laggy because of the low frame rate.

## Fix 1: Use Optimize on the presenter toolbar

Learn's note says the keyboard shortcut (below) will be deprecated soon, and that a new presenter control toolbar lets a user optimize for video when screen sharing.

1. Start sharing in your meeting with **Share**, and choose a window or your entire screen.
2. Move your cursor to the top of the shared screen to drop down the presenter toolbar. Only the presenter sees it.
3. Select **Optimize**. The support page says it reduces choppiness or lag when you share video content.

The toolbar can be pinned with **Pin** to keep it where you placed it.

## Fix 2: The keyboard shortcut

In Teams 1.6.00.12455 and later:

1. Start sharing your screen in Teams.
2. Select the Teams app, and then press **Ctrl+Alt+Shift+T**.

Learn says there is no visual indication that high-motion viewing is on. The shortcut is a toggle. Using it twice returns Teams to the default behavior of not forcing high-motion screen sharing. Learn also says the shortcut will be deprecated soon, so use the toolbar if you have it.

## What you give up

The resolution of the shared content might drop to allow the higher frame rate. Learn says this depends on several factors, such as device capability and available bandwidth. So use the optimized mode for the time that you play video, and not for a slide deck.

## Check the frame rate

1. In the meeting select **More**.
2. Select **Settings**, then **Call health**.
3. Scroll to the **Screen Sharing** section to see the frame rate, resolution and other details of the sharing session.

## Related sharing options

From the Teams support page on sharing content:

- **Window or entire screen.** You can present either. Slide control is not available if you share the entire screen or desktop, so share the window with your presentation.
- **Include sound.** In the **Share** dialog, turn on **Include sound** before you start. Or use **Share audio** on the presenter toolbar. Sound from your computer, including notifications, is then audible to participants.
- **Layout with your camera.** Your camera must be on and you must be sharing content. The options named are Content only, Standout, Side-by-side and Reporter.
- **Live share.** You can share a PowerPoint file, an Excel file or a Whiteboard live.
- **Mac.** If prompted, select **Allow** and, if needed, turn on the **Microsoft Teams** toggle under **Screen & System Audio Recording** in System Settings. Native macOS sharing is opt-in under **Settings** > **General** > **Screen sharing** > **Use macOS content sharing**, and it does not support giving or taking control.
- **Teams on the web.** The support page says to use Google Chrome or the latest Microsoft Edge, and that Linux is not supported.
- **Known issue.** The page says sharing indicators and control panels may be affected by DisplayLink or other docking station versions on macOS 14 and later.

## When it is still choppy

The Learn page gives no other steps. The causes it names are the frame rate and the trade-off with resolution and bandwidth. If the problem remains after you use Optimize, the next checks are mine.

## Habits that help (my advice)

This is my suggestion, not guidance from the page:

1. Test before an important meeting. Start a meeting with a colleague, share the video and ask how it looks. Then look at Call health.
2. For a long video, consider sending the file or a link beforehand and playing it from the attendees' own devices. This avoids the screen sharing frame rate altogether.
3. If sound is needed, turn on Include sound before you start. It is easy to forget once you share.
4. Close other heavy apps while you share video, since device capability affects the result, as Learn says.
5. Switch Optimize off again when you return to slides, so the text stays sharp.
6. Share one window and not the whole screen, so notifications do not appear in the shared content.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)

## Sources

- [Fix screen sharing video display lag issue in Teams (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/microsoftteams/meetings/fix-choppy-video)
- [Share content in Microsoft Teams meetings (Microsoft Support)](https://support.microsoft.com/office/share-content-in-microsoft-teams-meetings-fcc2bf59-aecd-4481-8f99-ce55dd836ce8)
