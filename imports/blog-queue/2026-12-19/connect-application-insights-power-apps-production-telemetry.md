---
title: "Connect Application Insights to a Power Apps Canvas App for Production Telemetry"
summary: "Step-by-step setup of Azure Application Insights for a canvas app: tenant setting, connection string, Trace events, KQL queries, privacy points and the scenarios Microsoft says are not covered."
status: review
publish: false
author: mirko-p
date: 2026-12-19
topics: [power-apps, application-insights, telemetry, power-fx]
keypoints:
  - "A tenant admin must turn on Settings > Tenant settings > Canvas app insights in the Power Platform admin center. The maker then pastes the connection string into the App object and publishes."
  - "Events are sent only from the published app that is played. Previewing in Power Apps Studio does not send events."
  - "Learn lists automatic usage telemetry, a session summary event per session, and custom events from the Trace function with severity and a custom record."
  - "Session summary values are accurate for canvas apps in a web browser. They are not available for Power Apps mobile, and offline player events are not recorded."
  - "Trace events go to the resource named in the connection string, even in another tenant. Keep personal data out of custom records unless you have a legal basis."
faq:
  - q: "Where do I paste the Application Insights connection string?"
    a: "Open the app for editing in Power Apps, select the App object in the tree view and paste the connection string from your Application Insights resource, then save and publish. Microsoft Learn uses the term connection string, not instrumentation key, on this page."
  - q: "Why do I see no events in Application Insights?"
    a: "Learn says events do not send when you preview the app in Power Apps Studio. Play the published app. Also check that the tenant setting Canvas app insights is on in the Power Platform admin center."
  - q: "How do I log a custom event?"
    a: "Use the Trace function in a behavior formula, for example Trace with a message, TraceSeverity.Information and a record of custom values. Learn says Trace can only be used in behavior formulas, and its output also appears in Live Monitor."
  - q: "Which KQL tables hold the data?"
    a: "Learn lists traces for custom trace messages and unhandled errors, customEvents for session summary events, dependencies for HTTP calls, requests for requests received by connected services and pageViews for page view data."
  - q: "Does this work for the Power Apps mobile app and offline mode?"
    a: "Learn says session summary events are not available for Power Apps mobile, offline player events are not recorded, and events from iOS and Android apps are not recorded when the app is suspended."
---

To track production telemetry for a canvas app, create a workspace-based Application Insights resource, turn on the tenant setting, paste the resource's connection string into the app's **App** object, publish, and then play the published app. Telemetry arrives in Application Insights, where you can add your own events with the `Trace` function and query everything with KQL.

## Before you start

According to Microsoft Learn you need:

- A workspace-based Application Insights resource in the Azure portal, and permission to create Azure resources.
- A tenant admin who turns on the setting. In the Power Platform admin center, go to **Settings** > **Tenant settings** > **Canvas app insights**, set it to **On** and save.

## Step 1: Connect the app

1. Sign in to Power Apps and open the app for editing.
2. Select the **App** object in the tree view.
3. Paste the **Connection string** from the Application Insights resource.
4. Select **Save**, then **Publish**.
5. **Play** the published app and open its screens.

Learn is explicit that events are not sent when you preview the app in Power Apps Studio. A common reason for an empty workspace is testing in the editor.

## Step 2: Know what arrives automatically

Learn lists these automatic signals:

- Usage details: where users access the app from, which devices and which browsers.
- A Users view with sessions, events, OS and browser versions and region.
- An Events view of screens viewed across sessions.
- A session summary event, `PowerAppsClient.PublishedApp.SessionLoadSummary`, logged once per session. It covers whether the app opened successfully and how it performed.

The default dimensions include `ms-appId`, `ms-appname`, `ms-appSessionId`, `ms-tenantID`, `ms-environmentId`, `userId`, `ms-currentScreenName` and `ms-targetScreenName`.

## Step 3: Add custom events with Trace

```power-fx
Trace(
  "App Feedback",
  TraceSeverity.Information,
  {
    Screen: "OrderScreen",
    FeedbackValue: "-1"
  }
);
```

Details from the Trace reference:

- Syntax is `Trace( Message [, TraceSeverity [, CustomRecord [, TraceOptions ] ] ] )`.
- Severity options are Information (default), Warning, Error and Critical. The Application Insights page lists the first three in its example.
- `CustomRecord` carries your custom data. `TraceOptions.IgnoreUnsupportedTypes` ignores data types in the record that cannot be serialized.
- Trace can only be used in behavior formulas, such as `OnSelect`.
- Trace output also appears in Power Apps Live Monitor.
- The pages do not state limits on the number of trace records or the size of the custom record, and give no retention figures.

Plan an event naming scheme before you spread Trace calls through the app, for example one message per business action. Use one exact spelling of every custom key. Learn's own sample has a typo that would make two events not match one query.

## Step 4: Query the data

Learn names these tables:

| Table | Content |
|---|---|
| `traces` | Custom trace messages and unhandled errors |
| `customEvents` | Session summary events |
| `dependencies` | HTTP calls, with `requestHeaders` and `x-ms-app-load-state` |
| `requests` | Requests received by connected services |
| `pageViews` | Page view data |

A basic query for your custom event:

```kusto
traces
| where message == "App Feedback"
| extend customdims = parse_json(customDimensions)
| project timestamp, Screen = customdims.Screen, FeedbackValue = customdims.FeedbackValue
| order by timestamp desc
```

The session summary event exposes fields such as `successfulAppLaunch`, `unsuccessfulReason`, `appLoadResult`, `timeToAppInteractive` and `timeToAppFullLoad`. Learn's sample queries use them for app open success rate by day, unsuccessful sessions by reason and app open performance at the 75th percentile. Check the exact dimension names in your own data, because Learn's queries and its dimension table differ in capitalization for the app name.

## Optional experimental settings

Both are pre-release and subject to change. Learn places them under **Settings** > **Updates** > **Experimental**:

- **Pass errors to Azure Application Insights** puts unhandled errors in `traces` with the message "Unhandled error" and a severity level of 3.
- **Enable Azure Application Insights correlation tracing** adds events to `dependencies` and joins on `operation_Id`. It works only with custom connectors, and HTTP requests are captured only if the connected service is also connected to Application Insights.

Either might incur additional Application Insights storage costs.

## Limits Microsoft states

- Session summary events are accurate for canvas apps in a web browser, not for Power Apps mobile, and values might not always be available or accurate for custom pages.
- Offline player events are not recorded.
- Events from iOS and Android apps are not recorded when the app is suspended.
- The pages do not describe sampling, telemetry delay or availability in government clouds, so check those separately if they matter to you.

## Privacy and governance

- Logging personal data brings privacy-law obligations. Learn points to the Microsoft Trust Center and the Service Trust Portal. Avoid putting names or emails in custom records unless you have a basis. Learn's own sample logs user name and email, which is an example of what to review.
- Trace events go to the resource that matches the connection string, even if it is in a different tenant.
- `.msapp` files might contain connection strings, so open an imported app and verify which resource it points to.

## Admin-level alternative

The Power Platform admin center also has data export to Application Insights, under **Manage** > **Data export** > **App Insights**. Learn describes it as available for managed environments only, with data types Dataverse diagnostics and performance, Power Automate and Copilot Studio. It does not name canvas apps. Treat it as a separate source from the in-app connection string above. Learn gives a 24 hour SLA for telemetry delivery for that export, and requires a unique Application Insights environment per Power Platform environment.

## Rollout checklist

1. Create one Application Insights resource per environment or per app group, and document who owns it.
2. Turn on the tenant setting.
3. Add the connection string in the development copy, publish, play and verify the first events.
4. Define the Trace events and the custom keys.
5. Build queries and an Azure workbook or alert on the key events, such as unsuccessful app launches.
6. Review the privacy impact before the production release.

## Related

- [Power Apps](https://www.m365.fm/entity/power-apps/)
- [Application Insights](https://www.m365.fm/entity/application-insights/)
- [Telemetry](https://www.m365.fm/entity/telemetry/)
- [Power Fx](https://www.m365.fm/entity/power-fx/)

## Sources

- [Connect your canvas app to Application Insights (Microsoft Learn)](https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/application-insights)
- [Trace function (Microsoft Learn)](https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/functions/function-trace)
- [Set up data export to Application Insights (Microsoft Learn)](https://learn.microsoft.com/en-us/power-platform/admin/set-up-export-application-insights)
