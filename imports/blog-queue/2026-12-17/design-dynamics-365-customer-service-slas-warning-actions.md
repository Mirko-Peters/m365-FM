---
title: "Design Dynamics 365 Customer Service SLAs with KPIs, Pause Rules and Warning Actions"
summary: "How to build service-level agreements in Copilot Service admin center: SLA KPIs, SLA items, business hours, pause and resume levels, warn and fail durations, and the Power Automate actions, with the limits Microsoft documents."
status: review
publish: false
author: mirko-p
date: 2026-12-17
topics: [dynamics-365-customer-service, dynamics-365-case-management, dynamics-365]
keypoints:
  - "Build the SLA in order: prerequisites and a timer lookup field, SLA KPIs, the SLA with its items, actions in Power Automate, then activate."
  - "An SLA item holds Applicable When, Success Conditions, pause settings and Warn and Fail durations. Setting Warning Duration to null skips the nearing noncompliance status."
  - "Pause settings can be set at entity, KPI and item level, and the more specific level overrides the broader one. Resuming creates a new SLA KPI instance."
  - "Warning and failure actions run in a predefined Power Automate flow with the steps Is Nearing Non-Compliance, Is Succeeded and Is Non-compliant. Do not edit the predefined flow."
  - "Learn recommends at most 15 SLA items per SLA (enhanced SLA page), no frequently changing fields in Applicable When and no direct updates of SLA KPI instance values."
faq:
  - q: "Where do I create SLAs in Dynamics 365 Customer Service?"
    a: "According to Microsoft Learn, in Copilot Service admin center select Service terms under Operations. Use the SLA KPIs section to create KPIs and the Service-level agreements section to create the SLA and its items."
  - q: "How many SLA items should one SLA have?"
    a: "Microsoft Learn recommends, on the enhanced SLA page, no more than 15 SLA items in an SLA for performance reasons, because too many items can negatively affect create and update operations on the record the SLA is applied to or reevaluated on."
  - q: "How do warning actions work in the current setup?"
    a: "Per Microsoft Learn, you select Configure Actions on the SLA item, which opens a predefined Power Automate flow. It has the conditions Is Nearing Non-Compliance, Is Succeeded and Is Non-compliant, and you add actions such as msdyn_SendEmailFromTemplate to each. Learn recommends not editing the predefined flow."
  - q: "Which pause setting wins if I set it in several places?"
    a: "Microsoft Learn says pause conditions set on an SLA item override those set at the SLA KPI and entity level, and KPI-level conditions override entity-level conditions. Override Criteria must be set to Yes, and Allow Pause and Resume must be enabled."
  - q: "Why was my SLA canceled before it succeeded or failed?"
    a: "Microsoft Learn says a KPI instance is canceled if the Applicable When condition stops being met after the SLA triggers, so frequently updated fields are a risk. In the web client SLA documentation, conflicting conditions, such as Case Status Active in Applicable When and not Active in Success Criteria, also cancel the SLA."
---

A usable SLA design starts with a short list of KPIs, one clear start time, realistic business hours and a small number of items per SLA. The rest is configuration in Copilot Service admin center and one Power Automate flow per SLA item for the warning, success and failure actions. Microsoft Learn describes SLAs configured in Copilot Service admin center, and this article follows that setup.

## Plan before you click

Decide these points first:

1. Which entity gets the SLA. For the Case entity, Learn says two KPI fields exist by default. For other entities, the enhanced SLA page says a system customizer must create lookup fields that refer to the SLA KPI Instance entity.
2. Which KPIs matter, such as First Response By and Resolve By. A case can have several KPIs triggered at different start points in its life cycle.
3. Which date and time field starts the clock. The **Applicable From** value must be a datetime field, not a date.
4. Which business hours apply. If no customer service schedule is selected, Learn says work hours are all day, every day.
5. When the clock should pause, such as while waiting for the customer.

Learn recommends not adding customizations to the SLA, SLA KPI and SLA item admin forms. It also notes that SLAs can be created only in environments with customer engagement apps such as Customer Service, and that in the Singapore region SLA functionality supports only tenants allowlisted for Power Automate.

## Prepare roles and the timer field

Administrators need the CSR Manager role or equivalent. Learn also lists permissions on Connector, ProcessStageParameter, and on the SLA, SLA KPI and SLA KPI instance tables. The enhanced SLA page, which describes the deprecated web client setup, names the Customer Service Manager, System Administrator or System Customizer role for creating SLAs. Representatives need the Customer Service Representative role. Users who activate or manage the monitoring flow `SLAInstanceMonitoringWarningAndExpiryFlow` and the SLA action flows need global read and write privileges on SLA KPI instances.

Create a lookup field on the target entity that points to **SLA KPI Instance**, for example `EscalatedByKPI` on Case. Add the timer control to the form so agents see the time remaining.

## Create the SLA KPIs

1. In Copilot Service admin center, select **Service terms** in **Operations**.
2. In the **SLA KPIs** section, select **Manage**, then **New**.
3. Enter the **Name**, **Owner**, **Entity Name**, **KPI Field** and **Applicable From**, then **Save**.
4. Optionally set pause conditions at KPI level.
5. Select **Activate**.

The failure, warning and Applicable From fields must be datetime. A pause followed by a resume cancels the SLA KPI instance and creates a new one.

## Create the SLA and its items

In **Service-level agreements (SLAs)**, select **Manage** and **New**. Enter the name and primary entity and save. The **SLA Items** section then appears. For each item, set:

- **Name** and **KPI**.
- **Allow Pause and Resume**. You cannot toggle it after the first save.
- **Business Hours**.
- **Applicable When**, the conditions that trigger the SLA. Learn says the SLA triggers only while the condition stays true, and if it stops being true, the KPI instance is canceled. Avoid fields that change often.
- **Success Conditions**. Learn shows a recommendation message if you define them on the same entity as Applicable When.
- **Warn and Fail Duration**. If you do not need a warning, set Warning Duration to null so the instance never reaches **Nearing noncompliance**.

Learn calculates warning and failure time after applying the selected business hours.

A sample on the enhanced SLA page (web client setup) for a lead KPI: for hot leads, failure after 1 day, warning after 16 hours, success when the status is Contacted. The sample uses tiered rows for Hot, Warm and a Default row at the end, and copying that pattern is my suggestion.

## Set pause rules at the right level

Learn describes three levels:

| Level | Where | Overrides |
|---|---|---|
| Entity | **Service terms** > **Other SLA Settings** > **Manage** > **Service Configuration Settings** > **Select SLA Pause Status** | none |
| SLA KPI | **Pause Conditions** with **Override Criteria** set to **Yes** | entity level |
| SLA item | **Pause Configurations** with **Override Criteria** set to **Yes** | KPI and entity level |

Override works only when **Allow Pause and Resume** is enabled. The pause page mentions a General tab for that setting without saying which record. The configuration page puts the toggle on the SLA item, which is my reading of it. KPIs without their own pause conditions keep using the entity-level setting.

## Configure the warning, success and failure actions

On the SLA item, select **Edit SLA Item**, then **Configure Actions** in the **Actions** area. Power Automate opens in a new tab. Accept the default settings or configure a connection, select **Continue**, and the predefined flow appears. Select **Switch** and use these branches (the flow labels the first one **[Do not delete or update] Is Nearing Non-Compliance**):

- **Is Nearing Non-Compliance**: runs at the warning time.
- **Is Succeeded**: runs when the SLA succeeds.
- **Is Non-compliant**: runs when the SLA fails.

Add an action to each branch, such as **Perform an unbound action** with `msdyn_SendEmailFromTemplate`, and fill in From, To Item, Cc Item, Regarding and Template. Learn recommends not editing the predefined flow, because that can break it. Save, then **Save & Close** the item and **Activate** the SLA.

Design the actions around people. A warning to the case owner at the warning time and an escalation to a manager on failure is the pattern in Learn's samples. The Learn sample for failure also updates a record field, such as marking a case as escalated, but that sample is written for the older workflow-based setup.

## Keep it fast and stable

Learn lists these recommendations. The 15-item advice and the advice about plug-ins and Dynamics 365 for Outlook are on the enhanced SLA page for the web client setup. The Applicable When advice is on the main configuration page.

- No more than 15 SLA items per SLA.
- Do not create plug-ins or processes that update SLA KPI instance values directly.
- Do not create or update SLAs through Dynamics 365 for Outlook.
- Do not use frequently updated fields in Applicable When.

Also remember that an SLA KPI instance stops calculating **Elapsed Time** and **Paused on** once it reaches **Succeeded** or **Noncompliant**.

## Typical mistakes

- Choosing a date field for Applicable From.
- Setting success conditions that contradict Applicable When (documented on the web client SLA page).
- Editing the predefined flow.
- Leaving Warning Duration filled in when no warning is wanted.
- Changing the pause setting at the wrong level and wondering why nothing happens.

## What the sources do not say

The pages read for this article do not give a maximum number of SLAs per entity, and they do not describe how existing SLAs react when business hours or holiday schedules change. They also do not cover how to apply an SLA to cases, which Learn handles on a separate Apply SLAs page that I did not read. The enhanced SLA page also refers to deprecated web client SLAs, so check which client created your SLAs before you edit them.

## Related

- [Dynamics 365 Customer Service](https://www.m365.fm/entity/dynamics-365-customer-service/)
- [Dynamics 365 case management](https://www.m365.fm/entity/dynamics-365-case-management/)
- [Dynamics 365](https://www.m365.fm/entity/dynamics-365/)

## Sources

- [Configure service-level agreements in Dynamics 365 Customer Service](https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/define-service-level-agreements)
- [Create enhanced service-level agreements in Dynamics 365 Customer Service](https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/create-enhanced-sla)
- [Configure pause conditions for SLA-enabled entities](https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/set-pause-conditions-sla)
