---
title: "Trigger Customer Insights Real-Time Journeys From Dataverse Changes and Custom Triggers"
summary: "How to start a real-time journey in Dynamics 365 Customer Insights - Journeys from a Dataverse table change or a custom trigger, build the journey, and plan for the documented limits of 2,500 triggers per minute and 29 attributes."
status: review
publish: false
author: mirko-p
date: 2026-12-18
topics: [dynamics-365-customer-insights-journeys, dynamics-365-customer-insights, dataverse]
keypoints:
  - "A Dataverse trigger starts a journey from a record being created or updated in any table, with no code."
  - "A custom trigger for website or app actions uses a generated JavaScript snippet that contains an ingestion key you must protect."
  - "Documented limits include up to 2,500 triggers per minute and 29 attributes per custom trigger, and events above the rate may be dropped."
  - "Use segment-based journeys for business events that affect every contact, because raising a trigger for each contact likely exceeds the fair use policy."
  - "Publish the trigger and mark the content Ready to send before a trigger-based journey goes live."
faq:
  - q: "How do I start a journey from a Dataverse table change?"
    a: "According to Microsoft Learn, create a trigger on the Triggers page, choose the option for when a record related to a customer is created or updated, select the table, select the attribute that holds the audience, select the activating action and columns, and then select Ready to use. Learn describes this as a no-code option."
  - q: "Does the trigger fire only for a specific value, such as resolved cases?"
    a: "No. Microsoft Learn says the Dataverse trigger captures any change to the chosen column, not only one value. You add a filter condition, for example Status equals Resolved, when you create the journey from the trigger."
  - q: "What are the documented limits for trigger-based journeys?"
    a: "Microsoft Learn's fair use policy lists throughput of up to 2,500 triggers per minute and a latency target of P90 under 3 minutes and P95 under 5 minutes up to that rate. Triggers above it may be slower and some events may be dropped. A custom trigger can have 29 input attributes."
  - q: "Should I use a trigger for a billing run that affects every customer?"
    a: "Microsoft Learn advises against it. For business events such as a billing cycle, use a segment-based journey, because a trigger raised for every contact or lead likely goes over the fair use policy for triggers."
  - q: "How do I keep a custom trigger from being abused?"
    a: "Microsoft Learn says the code snippet contains an ingestion key, and an attacker with it could send spurious triggers that start unintended journeys. Protect the key where possible and limit the attributes used for personalization to reduce risks such as cross-site scripting."
---

Real-time journeys in Dynamics 365 Customer Insights - Journeys can start from two kinds of source events: a change to a Dataverse table, or a custom trigger raised by a website or app. Microsoft Learn documents both. The Dataverse route is no-code. The custom route needs a developer to integrate a generated snippet. The pages read do not use the term Dataverse business events, so this article uses the documented names: Dataverse record change triggers and custom triggers.

## Choose the right trigger type

Learn lists three types in the triggers catalog: custom triggers, interaction triggers and business triggers. Business triggers represent record changes in apps such as Sales and Service, and several exist by default, such as contact created, lead created, incident created and opportunity created. You can also build your own trigger from any Dataverse record change.

| Source of the event | Trigger to use |
|---|---|
| A row created or updated in a Dataverse table | Dataverse record change trigger |
| A customer action on a website or app | Custom trigger with the JavaScript snippet |
| A customer response to an email, SMS or push | Interaction trigger |
| A business event affecting all contacts, such as a billing cycle | Segment-based journey, not a trigger |

## Option 1: Trigger from a Dataverse record change

1. In the Customer Insights - Journeys app, open **Triggers** and select **New trigger**.
2. Enter a name, for example "Support case status updated".
3. Select **When a record related to a customer is created or updated** and select **Create**.
4. Select the Dataverse table, for example Case.
5. On **Which attribute contains the audience?**, select the attribute that identifies the customer. A table can have more than one.
6. Select the action that activates the trigger and the columns that must change, for example Status.
7. Select **Ready to use** to publish it for live journeys.

Learn notes that the trigger captures any change to the Status column, not only closure. Add a filter condition such as Status equals Resolved when you select **Use this to create a journey**. The trigger can then be used for journey entry, goal and exit, in attribute conditions, in wait tiles and for content personalization.

To test, change a row in a Dynamics 365 app, for example resolve a case, add a row in Power Apps, or call a Dataverse API with the SDK. The pages read do not state required security roles or prerequisites beyond access to the app.

## Option 2: Create a custom trigger

1. Select **New trigger** and choose **When a customer interacts with a website/app**.
2. Give it a title and description.
3. Add attributes with a name and data type. Types are text, number, true or false, date/time and entity reference. The type decides which comparators the journey offers.
4. Keep the default **Customer data** attribute, which identifies the customer who acted. When a trigger is tied to a data profile, include `contactpoint_email` and `contactpoint_phone` so the customer can be reached.
5. Download the generated code snippet and give it to developers. It contains JavaScript instructions for integrating the trigger with external systems.
6. After integration, the Triggers page confirms it works and marks it **Ready to use**.

Learn warns that the snippet holds an ingestion key. Anyone with it could send spurious triggers that start unintended journeys, so protect the key and limit the attributes used for personalization.

The pages read do not describe a way to call the trigger with Power Automate or with a Dataverse custom API, so check the in-app snippet for supported integration paths.

## Build the journey

1. Choose **trigger-based journey** and select your trigger at the start.
2. Add conditions from the trigger's table or related tables. Learn says you can add up to 29 attributes to a trigger.
3. Set a goal, for example a Purchase completed trigger.
4. Set the exit. A trigger-based exit removes customers who perform the trigger.
5. Build the actions on the canvas: email, text, push, branches and waits.
6. Before going live, set content to **Ready to send**, publish the triggers and integrate their code.

You build the journey while content is in Draft, but publishing needs Ready to send.

## Plan for the limits

The fair use policy lists:

| Item | Limit |
|---|---|
| Throughput | Up to 2,500 triggers per minute |
| Latency | P90 under 3 minutes and P95 under 5 minutes, up to 2,500 triggers per minute |
| Custom trigger inputs | 29 attributes |

Triggers beyond the rate are subject to slower processing and potential failures, which Learn describes as dropped events. Learn also says that raising a trigger for every contact for a business event likely goes over the fair use policy, so use a segment-based journey, with an attribute on the contact or lead that moves them into the segment.

## Typical mistakes

- Expecting the Dataverse trigger to fire only for one value, instead of filtering in the journey.
- Using a trigger for a bulk business event.
- Publishing a journey with content still in Draft.
- Leaving the ingestion key in a public page without considering abuse.
- Choosing an audience attribute that does not identify a contact or lead.

## What the sources do not say

The pages read do not document re-entry behavior, required Dataverse security roles, or any API for raising a trigger other than the generated JavaScript snippet. They also do not mention custom Dataverse business events by name.

## Related

- [Dynamics 365 Customer Insights - Journeys](https://www.m365.fm/entity/dynamics-365-customer-insights-journeys/)
- [Dynamics 365 Customer Insights](https://www.m365.fm/entity/dynamics-365-customer-insights/)
- [Dataverse](https://www.m365.fm/entity/dataverse/)
- [Customer Insights - Data](https://www.m365.fm/entity/dynamics-365-customer-insights-data/)

## Sources

- [Customer Insights - Journeys triggers](https://learn.microsoft.com/en-us/dynamics365/customer-insights/journeys/real-time-marketing-triggers)
- [Custom triggers in Customer Insights - Journeys](https://learn.microsoft.com/en-us/dynamics365/customer-insights/journeys/real-time-marketing-custom-triggers)
- [Trigger a journey based on a Dataverse record change](https://learn.microsoft.com/en-us/dynamics365/marketing/real-time-marketing-dataverse-trigger)
- [Create a trigger-based journey](https://learn.microsoft.com/en-us/dynamics365/customer-insights/journeys/real-time-marketing-trigger-based-journey)
- [Fair use policy for Customer Insights - Journeys](https://learn.microsoft.com/en-us/dynamics365/customer-insights/journeys/fair-use-policy)
