---
title: "How to Use Power Automate: Build, Test and Fix Your First Flow"
summary: "How to use Power Automate: pick a flow type, build a cloud flow with a trigger and actions, test it, read the run history and fix the most common failures."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [power-automate, power-apps]
keypoints:
  - "Sign in at make.powerautomate.com, then create a flow either by describing it to Copilot or with the Create button and a blank flow or template."
  - "Every cloud flow has a trigger that starts it and actions that run afterwards, and the flow type is automated, instant or scheduled."
  - "Test the flow from the toolbar, then open My flows and Details to see the 28-day run history with the inputs and outputs of each step."
  - "A red exclamation icon in a run shows the failed step, and the error usually points to a connection, a setting or a temporary service problem."
  - "A connection error with 401 or 403 is fixed with Reconnect under Manage connections, followed by Resubmit."
faq:
  - q: "How do I start using Power Automate?"
    a: "Go to make.powerautomate.com and sign in. Select Create, then start from a template or a blank flow, or describe the flow to Copilot. Choose a trigger, add the actions that should follow, save the flow, and select Test on the toolbar. Start with a simple flow, such as an email sent on a schedule."
  - q: "What are the three types of cloud flows?"
    a: "Automated flows start when an event happens, such as an email arriving. Instant flows start when you select a button, for example to send a reminder to a team. Scheduled flows run at set times, such as a daily data upload to SharePoint. If you use Copilot, your description decides which type you get."
  - q: "Where can I see why my flow failed?"
    a: "Open My flows, select the flow, and look at the 28-day run history. Select the date of the failed run and find the step with the red exclamation icon. The right pane shows the error and suggested fixes. Expand Inputs and Outputs on that action to see what was sent and returned."
---
To use Power Automate, sign in at `make.powerautomate.com`, select **Create**, choose a trigger that starts your flow, add the actions that should follow, save, and select **Test**. You can also describe the flow in plain language and let Copilot build a first version. This article is for people who work in Microsoft 365 and want to automate routine tasks, such as a reminder email, a notification when something changes, or a repeated copy of data. It explains the flow types, walks you through a first flow, shows how to test and manage it, and covers the failures you'll meet in the first weeks.

## What Power Automate does and which flow type to pick

[Power Automate](https://www.m365.fm/entity/power-automate/) builds cloud flows. Microsoft's definition is short: a cloud flow performs one or more actions when an event occurs. Two words matter from the start. A **trigger** is the event that starts the flow. An **action** is what the flow does after the trigger happens. Connectors link your accounts and services, so the flow can talk to your email, your files and other apps.

Microsoft's overview names three types of cloud flow:

- **Automated.** The flow is triggered by an event, such as an email arriving from a specific person or a mention of your company on social media.
- **Instant.** You start the flow by selecting a button, for example to send a reminder to your team or to start an approval in Teams or SharePoint.
- **Scheduled.** The flow runs on a schedule, such as a daily data upload to SharePoint or a database.

Pick the type before you pick anything else. Ask what should start the work. If the answer is "something happens", use an automated flow. If it's "I decide", use an instant flow. If it's "every Monday at nine", use a scheduled flow. If you use Copilot to build the flow, Microsoft says your prompt determines the type.

You can also use flows together with [Power Apps](https://www.m365.fm/entity/power-apps/). Microsoft has an article called Add a cloud flow to an app for that, which is a good second project once your first flow works.

## How to use Power Automate: build your first cloud flow

There are two ways in. Microsoft says Copilot is on by default, but admins can disable it, so you may not see it. The second way, without Copilot, uses the **Create** button.

**Option 1: describe the flow to Copilot.**

1. Sign in at `https://make.powerautomate.com`.
2. In the left navigation pane, make sure **Home** is selected.
3. In the **Create your automation with Copilot** field, write a specific prompt. Microsoft's tutorial uses a scheduled newsletter: it names the day, the time, the time zone, the recipient, the subject and the body text.
4. Select **Generate**. Copilot proposes a trigger and actions. In the tutorial, that's the **Recurrence** trigger and a **Send an email** action.
5. Select **Keep it and continue**.
6. Check the connections. A green checkmark means a connection is valid. If asked, select **Sign in**.
7. Select **Create flow**, then **Save**.

Replace any example address with your own, so you see the results yourself. Microsoft also says a person should review anything an AI generated for accuracy.

**Option 2: build it yourself in the designer.** Use **Create** to start from a blank flow or a template. Then add steps. Microsoft's example uses the trigger **When a new tweet is posted**, and the steps are the same for other triggers:

1. Select the plus sign after the trigger.
2. In **Search for an action or connector**, type `send email`.
3. Under **Office 365 Outlook**, select **Send an email (V2)**.
4. Enter your address in the **To** field.
5. In **Subject**, type some fixed text. To insert a value from the trigger, select the lightning bolt and pick an item such as **Tweeted by**. If it isn't visible, select **See more**.
6. Fill in the **Body** the same way.
7. Select **Save**.

Microsoft's tip is to use **Send an email (V2)** when you want formatting such as bold, lists or links in the message.

Power Automate has a new designer, which is the default, and a classic designer. Copilot works only in the new one, and the steps are similar in both.

## Plan the flow on paper before you build it

Five minutes of planning save an hour in the designer. Write four lines before you open the editor.

1. **The trigger.** What event or schedule starts the flow? Be exact, for example "a new file in this folder" or "every Monday at 8:00".
2. **The result.** What should be different when the flow has run? An email in a mailbox, a row in a list, a message in a channel.
3. **The data in between.** Which values from the trigger does the action need? In the designer, you pick these values as dynamic content with the lightning bolt, so you need to know what the trigger offers.
4. **The failure case.** What happens if the action can't run, and who finds out?

If you can't fill in line 2 in one sentence, the flow is too big for a first attempt. Split it in two. Two small flows that each do one job are easier to test, easier to fix and easier to hand over to a colleague than one large flow with twenty steps.

It also helps to decide who owns the flow. Flow owners receive the repair tips emails, so make sure the owner is someone who reads them. Write the owner's name in the flow description.

## Test and run the flow

A saved flow isn't a working flow until you've tested it. Microsoft's tutorial gives these steps:

1. On the toolbar, select **Test**.
2. In the **Test flow** pane, select **Manually**, then **Test**.
3. In the **Run flow** pane, select **Run flow**.
4. When the run starts, select **Done**. The message "Your flow ran successfully" appears.
5. To return to the flow details, use the **Back** arrow below the **Power Automate** title bar, not the browser's back button.

To run a flow later, select **My flows** in the left menu, hover over the flow and select the **Run** icon, then **Run flow** in the pane. For an event-based flow, trigger the event yourself, for example by sending the test email, and wait. Microsoft's example says to expect the notification in about a minute.

The details screen shows the owner, the creation date, the flow type, the connections and the **28-day run history**. That panel tells you whether runs succeeded, failed or are still running.

## Manage your flows

Open **My flows** in the left navigation pane. Select the vertical ellipsis next to a flow to see the options:

- **Turn off** pauses a flow, and **Turn on** resumes it.
- **Edit**, or the pencil icon, opens the flow in the designer.
- **Details** shows the run history.
- **Delete** removes the flow after a second confirmation.

Microsoft's page notes a limit of 600 flows per account. If you reach it, delete one before you create another. Delete test flows when you finish with them, so you never get near that number. Name your flows by purpose, such as "Weekly report reminder", so you can find them in six months.

## Fix a failed flow

Flows fail, usually for ordinary reasons. Microsoft's troubleshooting page gives a clear routine.

1. Select **My flows**, then the flow that failed.
2. In the **28-day run history**, select the date of the failed run. At least one step shows a red exclamation icon.
3. Open the failed step and read the error message. The right pane shows details and how to fix them.
4. Expand **Inputs** and **Outputs** on the failed action to see what was sent and what came back.

Then match the error to a fix:

- **401 Unauthorized or 403.** A connection problem. Under **Connections**, select **Edit**, then **Manage connections**, find the connection with the error and select **Reconnect**. Choose your credentials and resubmit if needed.
- **400 Bad request or 404 Not found.** A problem in the flow's settings. Select **Edit**, correct the definition, select **Save**, then **Resubmit**.
- **500 Internal server error or 502 Bad gateway.** These are usually temporary. Select **Resubmit**.

The page also mentions that flow owners get repair tips emails when a flow fails. Select **Fix my flow** in the email to follow the steps, or turn the emails off in the flow's properties menu. In the new designer, Copilot can also summarize errors and suggest fixes where possible.

## Common mistakes

- **Starting with a big process.** Build a flow that does one thing first. A scheduled email teaches you triggers, actions and connections in ten minutes.
- **Testing only the happy path.** Try an empty value or a missing file once, so you learn what the failure looks like.
- **Ignoring connections.** Errors 401 and 403 point to the connection, as the troubleshooting page explains. Check the green checkmark on every connection.
- **Sending to real people while testing.** Use your own address until the flow works.
- **Leaving test flows running.** Turn off or delete flows you don't need.
- **Assuming a licence question doesn't exist.** The pages I checked for this article don't cover licensing, so ask your admin which plan you have before you build something others depend on.

## Related topics to explore

- Run tasks on a schedule: Microsoft has a page named Run tasks on a schedule for daily, date-based and interval flows.
- Add steps and conditions: the page named Add steps shows how to build multi-step flows.
- Format dates and times: dates from triggers often need formatting, which the `formatDateTime` function handles.
- Triggers and actions in depth: the [tutorial for cloud flows](https://learn.microsoft.com/en-us/power-automate/get-started-with-cloud-flows) points to a page on working with triggers and actions.
- Troubleshooting: the page on [fixing flow failures](https://learn.microsoft.com/en-us/power-automate/fix-flow-failures) goes deeper into connections and Conditional Access errors.

## Next step

To use Power Automate, build one small flow this week: a scheduled email to yourself, tested with **Test** and checked in the run history. Read Microsoft's [cloud flow tutorial](https://learn.microsoft.com/en-us/power-automate/get-started-logic-flow) and the [overview of cloud flow types](https://learn.microsoft.com/en-us/power-automate/overview-cloud), then pick a real task and build it the same way.
