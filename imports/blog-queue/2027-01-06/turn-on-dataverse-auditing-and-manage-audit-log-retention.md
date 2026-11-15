---
title: "How to Turn On Dataverse Auditing and Manage Audit Log Retention"
summary: "Turn on Dataverse auditing at environment, table and column level, set audit log retention in the Power Platform admin center, view and delete audit logs, and learn what is not audited, with limits from Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2027-01-06
topics: [dataverse, power-platform-admin-center]
keypoints:
  - "Turning auditing on needs System administrator or System customizer, or equivalent. Viewing history, summary and deleting history each have their own privilege."
  - "Enable at three levels: environment (admin center), table (Audit changes to its data) and column (Enable auditing). Publish after table and column changes."
  - "Retention is Forever by default. A custom period can be up to 24,855 days, and each log keeps the retention that was active when it was created."
  - "Table and column definition changes, authentication, retrieve and export operations are not audited by this feature."
  - "After deleting logs you can no longer view the history they covered. Bulk deletion runs asynchronously at about 100 million records per day."
faq:
  - q: "Which role do I need to turn auditing on?"
    a: "Microsoft Learn names System administrator or System customizer, or equivalent permissions. Viewing Audit History needs View Audit History, the Audit Summary view needs View Audit Summary, and deleting change history needs Delete Audit Record Change History."
  - q: "Where do I enable auditing for the environment?"
    a: "In the Power Platform admin center go to Security > Compliance, select the Auditing tile, select the environment, then Set up auditing > Turn on auditing. Alternatively use Manage > Environments > environment > Settings > Audit and logs > Audit settings."
  - q: "What is the default retention?"
    a: "Forever. A custom period can be up to 24,855 days. Learn says changing the retention period does not change it for existing records, which keep the period active when they were created. A later note says the Security page auditing option can apply the policy to existing logs."
  - q: "What is not audited?"
    a: "Table or column definition changes, authentication, retrieve operations and export operations. Learn points to Dataverse and model-driven apps activity logging for retrieve and export."
  - q: "Can I export audit logs in the UI?"
    a: "Learn says exporting audit logs is currently not supported. Use the Web API or the SDK for .NET to retrieve audit data."
---

Turn auditing on for the environment, then for the tables and columns you care about, and choose how long to keep logs. Learn describes several paths, depending on whether you start in the Power Platform admin center or in Power Apps. This guide follows the Microsoft Learn article on managing Dataverse auditing.

## Roles and privileges

| Task | Needed |
| --- | --- |
| Turn auditing on or off for environment, table or column | System administrator or System customizer, or equivalent |
| View Audit History | View Audit History privilege |
| View the Audit Summary view | View Audit Summary privilege |
| Delete a record's change history | Delete Audit Record Change History privilege |

The activity logging option is visible only when minimum Microsoft Office licensing requirements are met, and the page does not name the licenses. Read logs and access logs go to Microsoft Purview for production environments only.

## Enable auditing

### Environment level, option A

1. In the Power Platform admin center go to **Security** > **Compliance**.
2. Select the **Auditing** tile.
3. Select the environment, then **Set up auditing** > **Turn on auditing**.
4. Decide whether to cover **Common entities across Dynamics 365 apps**, which enables a predefined list of tables such as account, contact, lead, product, systemuser, opportunity, incident and team.
5. Set **Event log retention** and choose the period.

### Environment level, option B

1. Go to **Manage** > **Environments**, select the environment, then **Settings**.
2. Expand **Audit and logs** > **Audit settings**.
3. Under **Retain these logs for**, choose the retention period.
4. Select **Global Audit Settings**, turn on **Start Auditing**, select the entities and select **OK**.
5. Select **Save**.

Environment settings also include **Log access**, which logs sign-ins and other system access, and **Read logs**, which sends logs to the Microsoft Purview compliance portal.

### Table level

1. In Power Apps at `make.powerapps.com`, select the environment > **Dataverse** > **Tables** and select a table.
2. Select **Edit** > **Edit table properties** and expand **Advanced options**.
3. Select or clear **Audit changes to its data**.
4. Select **Save**, then **Publish**.
5. If **Read Logs** is on, also enable single record auditing (log a record when opened) and multiple record auditing (log all records displayed on an opened page).

### Column level

Open the table > **Columns** > the column, expand **Advanced options**, select or clear **Enable auditing**, then **Save** and **Publish**.

## Retention

- The default is **Forever**, and the system does not delete logs.
- A **Custom** period can be up to **24,855 days**. The system deletes records once they exceed it.
- Each log is stamped with the retention period active when it was created. Changing from 30 to 90 days means older records are deleted after 30 days and newer ones after 90.
- A note on the page says the Security page auditing option offers the flexibility to apply the retention policy to existing logs.
- The retention setting is not available for Dynamics 365 Customer Engagement (on-premises).

## View audit logs

- **Audit History for one record:** open the record in a model-driven app > **Related** > **Audit History**. Use **Filter on** to filter by field.
- **Audit Summary view for all logs:** open the **Power Platform Environment Settings** app, or select Settings > **Advanced Settings** > **System** > **Auditing** > **Audit Summary view**. The Record column filter does not work. Filter by entity with **Contains** and the table name.
- **Export:** the page says exporting audit logs is currently not supported. Use the Web API or the SDK for .NET to retrieve audit data.

## Delete audit logs

To delete one record's history, open the record > **Related** > **Audit History**, set **Filter on** to **All fields**, then **Delete Change History** > **Delete**.

For bulk deletion, in the admin center go to **Manage** > **Environments**, select the environment and under **Auditing** select **Delete audit logs**. Choose one of: by table, access logs by people and systems, or all logs up to and including a date. Select **Delete** and confirm. Monitor jobs under **Settings** > **Data management** > **Bulk deletion**. The page also describes an older Delete Logs flow whose **View Audit Logs** list you can filter and sort only by the **Changed Date** column.

## Caveats and limits

- Not audited: table or column definition changes, authentication, retrieve operations and export operations.
- Non-customizable tables cannot be audited. The page lists 31, for example ActivityPointer, Annotation, Calendar, KbArticle, Resource, Service, Subject, Workflow and WorkflowLog.
- Updates are logged only when the new value differs from the old one.
- Logs can take time to show in Audit History and Audit Summary, because they sit in log storage. The page gives no delay time.
- Large attribute values such as Email.description or Annotation are capped at about 5 KB.
- With column auditing off, before and after values go to Purview as an asterisk.
- After deleting audit logs, you can no longer view the audit history for the period, tables or user access they covered. Bulk deletion runs at about 100 million records per day.
- To keep original choice labels in audit logs, Learn gives a setting, `{"StoreLabelNameforPicklistAudits":true}`.

## What the page does not say

The license names for activity logging, storage capacity figures and billing (the page only says audit logs consume log storage capacity), whether bulk delete jobs can be canceled, Purview retention, specific audit delay times, and any PowerShell or CLI method. For programmatic setup, Learn refers to the developer documentation.

## A rollout order (my advice)

The order is my own suggestion, not taken from the page.

1. Decide the retention period before you turn auditing on, since the page says existing records keep the period they were stamped with.
2. Turn on environment auditing.
3. Enable tables that hold sensitive data, then only the columns that matter.
4. Publish and test with a change you can see in Audit History.
5. Plan how you will export logs, since the UI cannot.

## Typical mistakes (my advice)

- Forgetting to publish after table or column changes.
- Assuming a retention change automatically applies to existing records.
- Expecting retrieve and export operations in the log.
- Enabling auditing for every column and growing storage needlessly.

## Related

- [Dataverse](https://www.m365.fm/entity/dataverse/)
- [Power Platform admin center](https://www.m365.fm/entity/power-platform-admin-center/)
- [Microsoft Purview Audit](https://www.m365.fm/entity/microsoft-purview-audit/)

## Sources

- [Manage Dataverse auditing (Microsoft Learn)](https://learn.microsoft.com/power-platform/admin/manage-dataverse-auditing)
