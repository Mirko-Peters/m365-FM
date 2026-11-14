---
title: "Fix Teams Audio Problems and Choose the Best Audio Settings"
summary: "Which audio settings to check in Microsoft Teams, how to fix a microphone or speaker that does not work, and how noise suppression, test calls and high fidelity music mode behave, based on Microsoft's support pages."
status: review
publish: false
author: mirko-p
date: 2026-11-20
topics: [teams, teams-rooms]
keypoints:
  - "Find the main audio controls under Settings and more > Settings > Devices > Audio settings, where you pick the speaker and microphone and can run Make a test call."
  - "Microsoft does not publish one best setting. Keep noise suppression on by default and turn it off only for a high-fidelity microphone in a quiet room."
  - "For a dead microphone, work through updates, the mute state, the physical mute button, OS and browser privacy permissions, device selection and Windows sound settings, in that order."
  - "High fidelity music mode is meant for music, samples audio at 32 kHz and is unavailable in live events and with spatial audio."
  - "Make a test call is English only and not available in Teams for the web."
faq:
  - q: "What are the best audio settings for Microsoft Teams calls?"
    a: "Microsoft Support does not name a single best configuration. Its audio settings page recommends selecting the right speaker and microphone, using Make a test call to verify them, and optionally turning on Automatically adjust mic sensitivity. The noise suppression page says noise suppression is on by default and suggests turning it off only for high-fidelity microphones in quiet settings such as a studio."
  - q: "Why is my microphone not working in Teams?"
    a: "Microsoft Support lists these checks in order. Install the latest Teams and OS updates, unmute in the meeting, check the headset boom and physical mute button, allow microphone access in Windows, macOS, iOS or browser privacy settings, select the correct microphone in Teams, check the Windows sound input and, if you use Remote Desktop, set remote audio recording to Record from this computer."
  - q: "What is the difference between Background noise only and Voice isolation?"
    a: "The Microsoft Support audio settings page describes Background noise only as suppressing surrounding noise and Voice isolation as suppressing other voices so others hear only you. Voice isolation requires a voice profile if you are not using a headset. A separate Microsoft page describes only a single noise suppression toggle on desktop, so the options you see depend on your Teams version."
  - q: "Should I use high fidelity music mode in meetings?"
    a: "Only for music. Microsoft says the mode is meant for music rather than speech, recommends turning it off for regular calls to save bandwidth and reduce background noise, and notes it is not available in live events or with spatial audio. The page advises turning off noise suppression and echo cancellation for the best listening experience, and it does not say the mode does this for you."
  - q: "Where can I test my speaker and microphone before a meeting?"
    a: "Go to Settings and more > Settings > Devices, choose your devices under Audio settings and select Make a test call. Microsoft says the test call is available in English only and not on Teams for the web."
---

There is no single best audio configuration for Teams that Microsoft documents. What the support pages do give is a set of controls and a fixed order of checks. For most people, the right setup is the correct speaker and microphone selected, noise suppression left on, and a test call to confirm. Most audio failures come down to a muted device, a blocked permission or the wrong device selected.

## Where the audio settings are

On the desktop app, Microsoft Support gives this path:

1. Select **Settings and more** > **Settings**.
2. Select **Devices**, then **Manage devices** to connect or disconnect audio devices.
3. Under **Audio** > **Audio settings**, choose the **Speaker** and **Microphone**.

The same page lists these controls:

- **Automatically adjust mic sensitivity** keeps your volume level consistent for others.
- **Sync device buttons** lets your device's buttons work during meetings.
- **Make a test call** checks your settings.
- **Noise suppression** options, described below.
- **Spatial audio** for more immersive sound.

Some settings may be unavailable because of the organizer's or IT admin's policies.

### Before and during a meeting

On the pre-join screen you choose an audio source: **Computer audio**, **Phone audio**, **Room audio** or **Don't use audio**. The page does not describe the pre-join settings icon in more detail. During a meeting, select the dropdown arrow next to **Mic**, then **More audio settings**. Changes take effect immediately.

## Noise suppression: what the pages say

Two Microsoft pages describe it differently, so check what your build shows.

- The audio settings page lists **Background noise only** and **Voice isolation**. Voice isolation suppresses other voices and needs a voice profile if you are not using a headset.
- The background noise page says noise suppression is on by default and describes a single desktop toggle under **Settings and more** > **Settings** > **Devices**. On iOS it lists **Auto** (default), **Low** and **High**. Low reduces steady noise such as a fan. High suppresses all background sound that is not speech.

The same page suggests turning noise suppression off only for high-fidelity microphones in quiet settings such as a studio. For everyone else, leaving it on is the documented default.

## High fidelity music mode

To turn it on, open the dropdown beside **Mic**, choose more audio settings and switch on the high fidelity music mode toggle. Microsoft's page lists these limits:

- Audio is sampled at 32 kHz and encoded at up to 128 kbps when bandwidth allows, dropping to as low as 48 kbps on weak connections.
- It is not available during Teams live events or when spatial audio is in use.
- It is meant for music, not speech. Turn it off for regular calls.
- The page advises turning off noise suppression and echo cancellation for the best listening experience. It does not say that the mode changes them by itself.
- Microsoft recommends high-quality external audio devices and advises against Bluetooth devices.

## Fix a microphone that does not work

Follow Microsoft's order and stop when it works.

1. **Update.** Install the latest Teams and the latest Windows or macOS update.
2. **Unmute.** Check the **Mic** icon in meeting controls.
3. **Check the hardware.** Make sure the headset boom is not in the mute position and an external microphone's mute button is off.
4. **Check privacy permissions.** On Windows, open **Privacy & security** > **App permissions** > **Microphone** and turn on **Microphone access**, **Let apps access your microphone**, **Microsoft Teams (work or school)** and **Let desktop apps access your microphone**. Then close all apps and restart. On macOS, check **System Preferences** > **Security & Privacy** > **Microphone** and make sure Microsoft Teams is selected, then close all apps and restart. On iOS, turn on the Microsoft Teams toggle under **Settings** > **Privacy** > **Microphone**, then close all apps and restart. For Teams on the web, allow microphone access in the browser's site permissions.
5. **Select the microphone.** Use the **Microphone** dropdown in **Devices** or during the meeting. If it is missing, unplug and replug it. For Bluetooth, make sure it is charged and not connected to another device.
6. **Check Windows sound settings.** Under **System** > **Sound** > **Input**, select your microphone and make sure its volume is not muted. If needed, open **More sound settings**, right-click the microphone on the **Recording** tab and select **Enable**.
7. **Remote Desktop.** Under **Local Resources** > **Remote audio** > **Settings**, set recording to **Record from this computer**.
8. **Last resort.** If no microphone is detected, select **Call me back**, enter your phone number and select **Call me**. Your audio then comes from the phone.

## Fix a speaker that does not work

Microsoft's speaker page follows a similar order. If Teams shows that your speaker is muted, select **Unmute**. Pick the speaker in **Audio settings** and run **Make a test call**. During a meeting, use the **Mic** dropdown, then **More actions** > **Audio settings** to confirm the speaker is selected and unmuted. Then check Windows **Sound settings**, where you select your speaker under **Choose where to play sound**. If it is missing, select **Add device**. For Remote Desktop, set playback to **Play on this computer**.

## Test call limits

**Make a test call** opens a Test Call Bot where you record a short message, play it back and review a summary. Microsoft says it is English only and not available on Teams for the web.

## Common mistakes

- Choosing the correct device in Windows but not in Teams, or the other way around.
- Leaving a Bluetooth headset connected to a second device.
- Keeping high fidelity music mode on for speech calls.
- Turning noise suppression off in a noisy room (my own caution; Microsoft only suggests turning it off for high-fidelity microphones in quiet settings).
- Assuming a policy is broken when an option is greyed out. It may be set by IT.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Microsoft Teams Rooms](https://www.m365.fm/entity/teams-rooms/)

## Sources

- [Microsoft Support: Manage audio settings in a Teams meeting](https://support.microsoft.com/en-us/office/manage-audio-settings-in-a-teams-meeting-6ea36f9a-827b-47d6-b22e-ec94d5f0f5e4)
- [Microsoft Support: My microphone isn't working in Microsoft Teams](https://support.microsoft.com/office/666d1123-9dd0-4a31-ad2e-a758b204f33a)
- [Microsoft Support: My speaker isn't working in Microsoft Teams](https://support.microsoft.com/en-us/office/my-speaker-isn-t-working-in-microsoft-teams-8f1d9b40-7537-499d-a434-fb24faf0dd61)
- [Microsoft Support: Reduce background noise in Teams meetings](https://support.microsoft.com/en-us/office/reduce-background-noise-in-teams-meetings-1a9c6819-137d-4b3b-a1c8-4ab20b234c0d)
- [Microsoft Support: Use high fidelity music mode in Microsoft Teams](https://support.microsoft.com/en-US/teams/notifications-settings/use-high-fidelity-music-mode-to-play-music-in-microsoft-teams)
