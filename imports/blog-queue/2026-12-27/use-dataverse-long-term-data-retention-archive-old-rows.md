---
title: "Use Dataverse Long-Term Data Retention to Archive Old Rows: Policy Setup and Limits"
summary: "Set up a Dataverse long-term retention policy: required role, enabling a table, testing a view, creating a retention policy, what happens to retained rows, the 72 to 96 hour run time and the table and timeout limitations in Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2026-12-27
topics: [dataverse]
keypoints:
  - "You need the Power Platform administrator role. Enable long-term retention on the parent table, and child tables are enabled automatically."
  - "Create and test a Dataverse view that selects only the rows to retain. Test with a TOP N statement when the row count is large."
  - "Once rows are retained as long-term inactive data they cannot be moved back to the active data store."
  - "A policy run takes 72 to 96 hours irrespective of data volume, runs at low priority and counts against your plan's API request allocation."
  - "Activity Pointer, Activity Party and Attachment tables and tables that do not support bulk delete cannot have a policy."
faq:
  - q: "Who can create a retention policy?"
    a: "According to Microsoft Learn, you must have the Power Platform administrator role to set up retention policies."
  - q: "How do I enable a table?"
    a: "In Power Apps go to Tables and open the table, select Properties next to Table properties, expand Advanced options, select Enable long term retention and Save. The table is available for policy setup in about 15 to 30 minutes, and longer with more child tables."
  - q: "Can I get retained rows back?"
    a: "No. Learn says once rows are retained as long-term inactive data, they cannot be moved back to the active data store."
  - q: "How long does a policy run take?"
    a: "Learn says 72 to 96 hours irrespective of the data volume. Retention runs at low priority in the background."
  - q: "Which tables are not supported?"
    a: "Activity Pointer, Activity Party and Attachment tables, and any table that does not support bulk delete. Tables with twenty-five or more child tables in a cascade chain and large volumes may time out."
---

Dataverse long-term data retention moves old rows out of the active data store into long-term storage, based on a view that you define. This guide follows the Microsoft Learn article on setting a retention policy for a table.

## Prerequisites

- **Role:** Power Platform administrator.
- **Parent table:** enable the parent root table for long-term retention. Related child tables are then enabled automatically and cannot be disabled while the parent is enabled. A solution import is the exception and does not auto-enable child tables.
- **A tested view:** create a Dataverse view that selects only the rows to retain. Test it with a `TOP N` statement such as TOP 10, especially when the row count is large, and verify it in an app before using it in a policy. The article's example is closed cases from 2015.

## Enable a table

1. In Power Apps, go to **Tables** and open the table.
2. Select **Properties** next to **Table properties**, expand **Advanced options** and select **Enable long term retention**.
3. Select **Save**.

The table is available for policy setup in about 15 to 30 minutes, and longer with more child tables.

## Create a retention policy

1. In Power Apps, select **Retention policies** in the left navigation.
2. Select **New retention policy** on the command bar.
3. Set the **Table** (the parent root table), a **Name** and the **Criteria**, which is your tested view.
4. Set the schedule: a **Start date**, which is the first run date and runs during the off hours of the environment's region, and a **Frequency** of **Once**, **Daily**, **Weekly**, **Monthly** or **Yearly**.
5. Select **Save**.

## What happens to retained rows

- The parent rows and all related child rows are marked and stored in long-term storage as a set, similar to bulk delete policies. Activities, emails and attachments are included.
- Lookup values are denormalized, so the ID and name values are retained with the data.
- Once retained as long-term inactive data, rows cannot be moved back to the active data store.
- Existing delete logic for parent and child tables still runs during the policy run.
- A policy run takes 72 to 96 hours irrespective of data volume and runs at low priority.
- Policy API requests count against your plan's existing API request allocation.
- If two policies share common child tables, the second stays at **Pending delete** until the first moves beyond **Pending reconciliation**.
- Policies do not start in environments with administration mode enabled.

## Limitations

- Policies cannot be set on the Activity Pointer, Activity Party or Attachment tables, or on any table that does not support bulk delete.
- Tables with twenty-five or more child tables in a cascade chain and large volumes may time out. The workaround is to enable a few child tables first, then the parent.

## Working with child tables

Because related child rows are retained together with the parent as a set, the table design matters. Enabling the parent root table also enables its children, and you cannot disable a child while the parent is enabled. If you import a solution, child tables are not enabled automatically, so enabling them is part of the deployment (my advice). When two policies share child tables, the second stays at Pending delete until the first moves beyond Pending reconciliation, so I would avoid scheduling overlapping policies on related tables on the same day (my advice).

## A cautious rollout

This list is my advice, built from the page, not a Microsoft procedure.

1. Run the view in a test environment and confirm the row count is what you expect.
2. Because retained rows cannot be moved back, review the criteria with the data owners before the first scheduled run.
3. Start with a policy frequency of **Once** and check the result, then switch to a recurring schedule.
4. Plan around the 72 to 96 hour run time when you choose the start date.

## Not covered

The article does not describe licensing or capacity requirements beyond the API note, managed environments, whether retained rows can be edited, or how to view, restore or delete retained data. It points to separate articles on managing policies and the developer documentation.

## Related

- [Dataverse](https://www.m365.fm/entity/dataverse/)

## Sources

- [Set a data retention policy for a table (Microsoft Learn)](https://learn.microsoft.com/power-apps/maker/data-platform/data-retention-set)
