---
title: "How to Use Power Apps Monitor to Debug a Canvas App"
summary: "Use live monitor in Power Apps to debug a canvas app: open it from Studio or for a published app, read events, use the Debug published app setting and its performance cost, and learn from the documented Northwind throttling example."
status: review
publish: false
author: mirko-p
date: 2027-01-07
topics: [power-apps, canvas-app]
keypoints:
  - "Live monitor is available by default for all canvas apps. It traces events during authoring in Power Apps Studio or while the published app runs in the web player."
  - "Open it from Studio with Advanced tools > Open live monitor, or for a published app from Apps > Live monitor > Play published app."
  - "To map events to formulas in a published app, turn on Debug published app under File > Settings. Learn says this hurts performance for all users, so turn it off afterward."
  - "Learn's Northwind example traced throttling (HTTP 429) to a formula that ran CountRows, which is not delegated for Dataverse, on every createRow call."
  - "The page does not list the event columns, filters, log download options, permissions or limits."
faq:
  - q: "How do I open live monitor from Studio?"
    a: "Sign in to Power Apps, edit the app, select Advanced tools in the left pane and then Open live monitor. It opens in a new tab connected to your Studio session."
  - q: "How do I monitor a published app?"
    a: "In Power Apps select Apps, select the app, open the drop-down next to Details, select Live monitor and then Play published app. The app opens in a new tab connected to your monitor session."
  - q: "What does Debug published app do?"
    a: "It publishes source expressions with the app so events can be mapped to specific formulas. Without it you still see events but cannot map them to expressions. Learn says it has a detrimental effect on performance for all users, so turn it off when you finish."
  - q: "Does live monitor affect my app?"
    a: "A tip on the Learn page says live monitor has no impact on your app and can be used with any app in a test environment or in production. A separate note on the page warns that the Debug published app setting has a detrimental impact on performance for all users."
  - q: "Can I use it with Power Apps mobile?"
    a: "Learn describes a preview: select Copy monitor link instead of Play published app, then open the link in Power Apps mobile, not a browser. It notes the option on make.preview.powerapps.com."
---

When a canvas app is slow or throws intermittent errors, live monitor shows what the app actually does, event by event. You can attach it while you edit in Studio or while users run the published app. This guide follows the Microsoft Learn page on live monitor for canvas apps. The page uses the names live monitor and Monitor interchangeably.

## What it is

Live monitor is available by default for all canvas apps. It traces events as they occur, either while you author in Power Apps Studio or while you run the published app in the web player. Learn says it has no impact on your app and can be used in test or production environments.

## Open it from Studio

1. Sign in to Power Apps at make.powerapps.com.
2. Create or edit a canvas app.
3. In the left pane select **Advanced tools**.
4. Select **Open live monitor**.

It opens in a new browser tab connected to your Studio session. A notification shows it is a Studio session.

## Monitor a published app

1. In Power Apps select **Apps** and then an app.
2. Select the drop-down next to **Details** and then **Live monitor**.
3. Select **Play published app**.

The app opens in a new tab connected to your monitor session. A notification says the session is for the published version. For Power Apps mobile (preview), select **Copy monitor link** instead and open the link in Power Apps mobile, not a browser.

## Debug an app

1. Open live monitor from Studio or for the published app.
2. Play the app. Live monitor shows a table of events with details for each.
3. Select an event to see its details, such as an error message.

## Debug published app

In Studio go to **File** > **Settings** and turn on **Debug published app**. It publishes source expressions with the app, so events can be mapped to formulas. Without it you still see events but cannot tie them to expressions.

Learn warns that the setting has a detrimental impact on performance for all your users. Turn it off when you no longer need it.

## The Northwind example from the page

The sample app showed performance degradation and intermittent errors. Some responses were HTTP 429 with the message Rate limit exceeded and a retry time. Live monitor showed the cause: the ProgressCount.Text formula ran on each createRow call and triggered CountRows on several entities. CountRows is not delegated for Dataverse, so it appeared as getRows requests. Learn says each record added could cause up to 12 extra requests, which led to throttling.

My takeaway, not stated on the page: look for repeated requests that a single user action triggers.

## Studio session or published session

The two entry points give two kinds of session. Learn marks each session with a notification, so you can tell which one you opened: a Studio session for the editor, and a session for the published version of the app. The next two sentences are my reading, not text from the page. A published-app session matters when a problem appears only for users or only in production. Because the page says live monitor has no impact on your app and can be used in production, attaching it while a user reproduces the problem should be possible, but the page does not describe that scenario. Keep the separate Debug published app performance warning in mind.

## Why delegation shows up in monitor

In the Northwind example, CountRows was not delegated for Dataverse, and the monitor showed it as getRows requests. As practical advice, when you see a burst of data requests after a single user action, check which formula triggers them and whether it is delegated.

## What the page does not say

- The columns of the event table or the list of event types.
- Filtering options and how to download or upload logs.
- Required roles or permissions, beyond signing in.
- Session, retention or event limits.
- Browser support, and behavior when a session closes or reconnects.
- A separate publish step. It only mentions publishing source expressions through the setting.

The page links to the Live monitor overview article, which was not read for this guide.

## A debugging routine

This routine is my advice, built on the page.

1. Reproduce the problem in Studio with live monitor open.
2. Select the failing event and read its error message.
3. For a published issue, use Play published app and repeat the action.
4. If you cannot tie an event to a formula, turn on Debug published app for a short test, then turn it off.
5. Look for patterns like many getRows calls after one user action, and check delegation.

## Typical mistakes (my advice)

- Leaving Debug published app on in production.
- Ignoring delegation warnings, as in the CountRows case.
- Opening the monitor link for mobile in a desktop browser.
- Looking only at the error and not at the request count behind it.

## Related

- [Power Apps](https://www.m365.fm/entity/power-apps/)
- [Canvas app](https://www.m365.fm/entity/canvas-app/)
- [Dataverse](https://www.m365.fm/entity/dataverse/)

## Sources

- [Debugging canvas apps with Live monitor (Microsoft Learn)](https://learn.microsoft.com/power-apps/maker/monitor-canvasapps)
