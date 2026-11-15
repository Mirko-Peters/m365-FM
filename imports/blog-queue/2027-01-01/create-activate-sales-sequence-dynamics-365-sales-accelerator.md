---
title: "Create and Activate a Sales Sequence in Dynamics 365 Sales: Steps and Limits"
summary: "How to create and activate a sequence in Dynamics 365 Sales, based on Microsoft Learn: roles, the Sales Insights settings path, step types, assignment options, the 250 active sequences limit, and the activation error that can occur when a wait step is last."
status: review
publish: false
author: mirko-p
date: 2027-01-01
topics: [dynamics-365-sales, dynamics-365-sales-accelerator]
keypoints:
  - "Go to Change area, Sales Insights settings, then under Sales accelerator select Sequences and New sequence. You can start from a template or a blank sequence."
  - "The entity defaults to Lead. Sequence start here is added automatically as step 1, and you add activities with the plus icon."
  - "Steps, Conditions, Commands and LinkedIn are the four categories of activities listed on the page."
  - "You can have up to 250 active sequences at a time in your organization. An error might occur if Set wait time is the last activity."
  - "Deactivate a sequence before assigning it. Assignment options are Record owner, a team member in a record field, Owner team or Access team."
faq:
  - q: "Where do I create a sequence?"
    a: "According to Microsoft Learn, in your sales app go to Change area, then Sales Insights settings, and under Sales accelerator select Sequences, then New sequence."
  - q: "Why does activation fail?"
    a: "According to Microsoft Learn, an error might occur if Set wait time is the last activity. Delete that last Set wait time activity, then save and activate the sequence again."
  - q: "How many sequences can be active?"
    a: "The Learn page states a limit of up to 250 active sequences at a time in your organization."
  - q: "Which roles do I need?"
    a: "According to Microsoft Learn, the Administration and customization roles to configure the feature, and the Primary sales roles to use sales-related features. Some tasks need Functional roles."
---

To create a sequence in Dynamics 365 Sales, open **Sales Insights settings**, select **Sequences** under **Sales accelerator**, choose **New sequence**, define its properties, add steps in the designer, and save. Then activate it and connect it to records. This guide follows the Microsoft Learn article Sequence creation and activation in the sales accelerator, which carries the page date 2025-07-11.

## Before you start

- **License:** the page lists no license tiers. It points to the Dynamics 365 Sales comparison table and licensing guide.
- **Roles:** the Administration and customization roles are needed to configure the feature, and the Primary sales roles to use sales-related features. Some tasks need Functional roles.
- **Enablement:** your administrator must have turned the feature on.
- **App:** the steps apply to the out-of-the-box Sales Hub and Sales Professional apps. Custom apps may differ.

## Create a sequence

1. Sign in to your sales app. In the lower-left corner go to **Change area**, then **Sales Insights settings**.
2. Under **Sales accelerator**, select **Sequences**.
3. On the **Sequences** page, select **New sequence**.
4. In the **Create a sequence** dialog choose **Use template**, which starts from a template with guided activities, or **Use blank sequence**.
5. In **Define sequence properties** enter the **Sequence name** (required), an optional **Description**, and the **Entity**, which is the record type the sequence applies to. It defaults to **Lead**.
6. Select **Next**. The sequence designer opens, and **Sequence start here** is added as step 1.
7. Select the plus icon after **Sequence start here** and configure a step.
8. Repeat for each activity, then **Save**.

## Step types

The page groups activities into four categories:

| Category | Purpose |
|---|---|
| Steps | Seller engagement tasks such as email, phone call and task |
| Conditions | Decide the next action depending on whether a completed activity is met or not met |
| Commands | Decide the next action based on a field value or the stage of a business process |
| LinkedIn | Social selling activities that use LinkedIn |

Each category has its own linked article. The page names a **Set wait time** activity but does not explain its duration options.

## Assign a sequence

Deactivate the sequence first. Open the sequence, select **Properties**, and choose an option under **Assign to**:

| Option | Behavior |
|---|---|
| Record owner | Assigned to the record owner when connected. Selected by default |
| Team member specified in a record field | Assigned to the user named in a chosen record field |
| Owner team | Assigned to the owner team when connected. The record owner must be the owner team |
| Access team | Assigned to the access team when connected. The record owner must be the access team |

For team options you can add conditions that target individuals, using **Condition is empty** to define them. Different sellers can have different sequences on the same record, for example a seller and an account manager.

## Activate

1. Open the sequence and select **Activate**. Learn states a limit of up to 250 active sequences at a time in your organization.
2. Select **Activate** in the confirmation message.

The page notes that an error might occur if you added **Set wait time** as the last activity. Delete that last **Set wait time** activity, then save and activate the sequence again. The page lists no other activation checks. After success, the sequence shows its status next to its name on the designer home page.

## Connect to records

The page does not describe connecting a sequence to records. It points to the article Connect a sequence to records as the next step.

## Sequence home page

You can sort and filter by column headers, reorder columns by dragging, and search. Search covers only the name and description of a sequence.

## Suggestion: a first sequence

This section is a practical suggestion and not a Microsoft statement.

1. Start from a template and read its steps before you change them.
2. Keep the first version short, so that sellers can follow it.
3. End the sequence with a real activity, not a wait step.
4. Test with one lead owned by a test user before you assign it widely.

## Not covered

The pages I read do not describe the following:

- Editing an active sequence and version history.
- Wait time durations and wait step behavior.
- A maximum number of steps per sequence.
- License specifics.
- The contents of sequence templates.
- Connecting a sequence to records.

## Related

- [Dynamics 365 Sales](https://www.m365.fm/entity/dynamics-365-sales/)
- [Dynamics 365 Sales accelerator](https://www.m365.fm/entity/dynamics-365-sales-accelerator/)

## Sources

- [Sequence creation and activation in the sales accelerator (Microsoft Learn)](https://learn.microsoft.com/dynamics365/sales/create-and-activate-a-sequence)
