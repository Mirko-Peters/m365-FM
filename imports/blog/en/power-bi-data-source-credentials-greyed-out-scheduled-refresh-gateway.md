---
title: "Power BI Data Source Credentials Greyed Out and Scheduled Refresh Blocked: Gateway Checklist"
summary: "The Data source credentials fields are greyed out and scheduled refresh will not run. With an on-premises gateway this is by design. Check the gateway data source, user list, name match and schedule."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [power-bi, power-bi-service, on-premises-data-gateway, semantic-model]
keypoints:
  - "Microsoft Learn says Data source credentials are greyed out when the semantic model uses an on-premises data gateway, because the gateway administrator defines the credentials on the gateway data source."
  - "The gateway only shows up under Gateway and cloud connections if your account is in the Users list of the matching data source and the server and database names match exactly."
  - "Power BI turns off a refresh schedule after four consecutive failures or an unrecoverable error such as expired credentials, and you must switch it on again yourself."
  - "A personal gateway needs you to enter credentials yourself, but it is meant for a single author, runs only as an interactive app and supports Import models only."
faq:
  - q: "Why are my data source credentials greyed out in Power BI?"
    a: "Microsoft Learn says the Data source credentials section is greyed out when you use an on-premises data gateway that gateway admins manage, because the gateway administrator defines the credentials for the data source. You do not enter them in the semantic model. A gateway admin sets them in Manage connections and gateways."
  - q: "Why is my gateway not listed under Gateway and cloud connections?"
    a: "Learn gives two conditions. Your account must be listed in the Users tab of the gateway data source, and the server and database names in the gateway data source must match the names in Power BI Desktop exactly."
  - q: "Why did my scheduled refresh switch itself off?"
    a: "Learn says Power BI deactivates a refresh schedule after four consecutive failures, or when the service finds an unrecoverable error that needs a configuration change, such as invalid or expired credentials. You cannot change the threshold of four. Fix the cause, then set Configure a refresh schedule back to On and select Apply."
  - q: "Can I use a personal gateway instead?"
    a: "Learn says personal mode works only with Power BI, only with Import semantic models, and only one personal gateway per user. It runs as an interactive application, not as a Windows service. In a March 2026 Q&A thread, the person who asked said refresh worked after they added a personal gateway. Learn recommends the standard gateway when several people manage data sources, or when you need DirectQuery, high availability or central governance."
---

You published a report that reads from an on-premises SQL Server. In the Power BI service you open the semantic model settings. The **Data source credentials** section is greyed out, and scheduled refresh does not work.

Two Microsoft Q&A threads from 2026 describe this. In March, a person published a semantic model from SQL Server, could not connect it to the gateway, and saw greyed-out credentials. In August, a person saw greyed-out credentials, no scheduled refresh, and refresh failures after changes to the local Power BI Desktop file. Neither thread has a reliable, confirmed fix. This article uses them as scenarios and builds the solution from current Microsoft Learn pages. It is a troubleshooting guide, not an official Microsoft procedure.

## What the symptoms look like

- **Data source credentials** cannot be edited.
- **Gateway and cloud connections** shows no gateway, or the gateway you expect is missing from the list.
- The refresh schedule cannot be turned on, or it switched itself off.
- Refresh worked on the desktop but fails in the service.

## What the two threads actually established

- The March 2026 thread has an AI-generated answer that carries an "accepted by question author" label. Its steps cover creating a SQL Server data source on the enterprise gateway and adding users. The same person then wrote that refresh worked after they added a personal gateway and configured it. So the person did not confirm the enterprise gateway steps. The accepted label sits on an AI answer, which is not a source for this article.
- The August 2026 thread has a moderator reply that only points to another community, plus an AI answer. Nobody accepted or confirmed anything.
- A third thread from September 2026 about a gateway connection error in Power Apps and Power Automate is a different product and a different error, so it is not covered here.

The Learn pages below explain the main symptom clearly.

## Step 1: Understand why the fields are greyed out

Learn's page on scheduled refresh says the **Data source credentials** section is greyed out when you use an on-premises data gateway managed by gateway admins. The gateway administrator defines the credentials for the data source. You do not supply credentials in the semantic model in this case.

So greyed-out credentials are not a bug when an enterprise gateway is in use. The real question is whether the gateway data source exists, is mapped to your model, and has valid credentials.

## Step 2: Open the refresh settings and check the gateway

1. In the Power BI service, open the workspace and select the semantic model.
2. On the details page, select **Refresh** and then **Schedule refresh**.
3. Open **Gateway and cloud connections**.

Learn says an enterprise gateway appears there only if your account is listed in the **Users** tab of the data source configured for that gateway. If no gateway is available at all, **Gateway connection** is disabled and a message explains how to install a personal gateway.

## Step 3: Ask the gateway admin to check the data source

The gateway admin can do this in the service. Learn gives the path: select the **Settings** icon in the header, then **Manage connections and gateways**.

1. Check that a data source for your SQL Server exists. If not, select **New**, choose **On-premises**, enter the **Gateway cluster name**, a **Connection name**, the connection type, the **Server** and the **Database**.
2. Choose an **Authentication Method**. For SQL Server, Learn names **Windows** and **Basic** (for SQL authentication). All queries use these credentials unless Kerberos single sign-on is configured.
3. Set the **Privacy level** if needed, then select **Create**. For DirectQuery, Learn says it can take several minutes before the connection is usable.
4. Select the data source, select **Manage users**, add the report owner or a security group, choose a role and select **Share**. Learn lists the roles **User**, **User with resharing** and **Owner**.

Each data source has its own user list, so add people to each data source they need. Learn also warns that users with access can use the stored credentials, so share with trusted accounts and preferably use a narrowly scoped service account.

## Step 4: Make the names match exactly

Learn says the link between a semantic model and the gateway data source rests on the server and database names, and they must match exactly:

- If Power BI Desktop uses an IP address, the gateway data source must use the same IP address.
- If Power BI Desktop uses `SERVER\INSTANCE`, the gateway data source must use `SERVER\INSTANCE`.
- Learn says matching is case-sensitive, and that mismatched casing, for example with case-sensitive collations, can make queries fail or return no data.

The AI answer in the March thread used the same principle with a machine-style name and instance, which fits Learn.

## Step 5: Check the gateway version and status

Learn's refresh troubleshooting page says that an outdated gateway causes `GatewayNotReachable` when you set credentials, and the fix is to install the latest gateway and try again. For dataflows, it says the gateway must be within the last six supported versions.

Also check on the gateway machine that the gateway is running and shows as online. This is a general check, not a step from the Learn pages above.

## Step 6: Turn the schedule on again

Learn explains that Power BI deactivates a schedule after four consecutive failures, or when it finds an unrecoverable error that needs a configuration update, such as invalid or expired credentials. You cannot change the threshold.

To re-enable the schedule:

1. On the semantic model, select **Refresh** and then **Schedule refresh**.
2. Fix the cause first. For example, ask the gateway admin to update expired credentials on the gateway data source.
3. Set **Configure a refresh schedule** to **On**.
4. Select **Apply**.

Two more reasons for a switched-off schedule, from the same page: after two months without views of any report or dashboard built on the model, scheduled refresh pauses, and the schedule shows as **Disabled**. Opening a report that uses the model resets the counter. Learn also lists daily limits: up to 8 scheduled refreshes per day for Power BI Pro, and up to 48 for Premium per User and Premium or Fabric capacity.

## Step 7: Consider personal mode only for a single author

Learn describes the personal gateway as a way for one author to refresh a few Import models without shared data sources or central credentials. With a personal gateway, there is no central credential management. If a refresh prompts for credentials, Learn says to update them in the **Data source credentials** pane of the semantic model in the Power BI service.

Limits from Learn's personal mode page:

- It works only with Power BI, and not with Power Apps or Power Automate.
- Each user can have only one personal gateway. A newer install on another computer replaces the old one.
- It supports Import models only. It does not support DirectQuery, live connection to Analysis Services, composite models, clustering or high availability.
- It runs only as an interactive application, not as a Windows service. The computer must be on and the gateway signed in at refresh time.

That fits the March thread, where the fix described was a personal gateway. Learn recommends the standard gateway when several authors or admins manage data sources, when you need DirectQuery or high availability, or when you need central auditing.

## Step 8: Handle credential errors for cloud sources

If the error is "Access to the resource is forbidden" or a refresh fails after a password change, Learn describes expired cached credentials. Clear the browser cache, sign in to Power BI, and open `https://app.powerbi.com?alwaysPromptForContentProviderCreds=true` to force a credential update. For sources that use Microsoft Entra ID OAuth, Learn says the token expires in about one hour while a large load can run much longer, so a credentials error can appear during a long load. Learn does not tie these entries to a gateway, so try them when your model has no gateway and the credentials are entered in the service.

## How to verify the fix

1. Open **Gateway and cloud connections** and confirm the gateway is listed and selected.
2. Check **Refresh history** for the semantic model and look at status, duration and any error.
3. Wait for the next scheduled time slot. Learn says refresh starts within 15 minutes of the slot and can be delayed by up to an hour if resources are short.
4. If the schedule still switches off, read the error in **Refresh history** instead of guessing.

## Limits and open points

- The August thread also said refresh fails after local changes to the Power BI Desktop file. No human answer covered that, and the Learn pages used here have no matching text. If you change columns or tables locally, check the error in **Refresh history** and compare it with the model in the service. Treat any other advice on this as unverified.
- Learn's refresh troubleshooting page has no entry for greyed-out credentials by name. The explanation comes from the scheduled refresh page.
- Whether your tenant lets you see gateway settings depends on your role. Learn notes that a user sees only the connections they belong to.

## Related

- [Power BI](https://www.m365.fm/entity/power-bi/)
- [Power BI service](https://www.m365.fm/entity/power-bi-service/)
- [On-premises data gateway](https://www.m365.fm/entity/on-premises-data-gateway/)
- [Semantic model](https://www.m365.fm/entity/semantic-model/)

## Sources

- [Microsoft Learn: Configure scheduled refresh](https://learn.microsoft.com/en-us/power-bi/connect-data/refresh-scheduled-refresh)
- [Microsoft Learn: Add or remove a gateway data source](https://learn.microsoft.com/en-us/power-bi/connect-data/service-gateway-data-sources)
- [Microsoft Learn: Manage a SQL Server data source](https://learn.microsoft.com/en-us/power-bi/connect-data/service-gateway-enterprise-manage-sql)
- [Microsoft Learn: Troubleshoot refresh scenarios](https://learn.microsoft.com/en-us/power-bi/connect-data/refresh-troubleshooting-refresh-scenarios)
- [Microsoft Learn: Personal gateway in Power BI](https://learn.microsoft.com/en-us/power-bi/connect-data/service-gateway-personal-mode)
- [Microsoft Q&A: Unable to connect to gateway in Power BI service (March 2026)](https://learn.microsoft.com/en-us/answers/questions/5845320/unable-to-connect-to-gateway-in-power-bi-service)
- [Microsoft Q&A: Not able to perform scheduled refresh in Power BI Fabric (August 2026)](https://learn.microsoft.com/en-us/answers/questions/5968159/no-able-to-do-perform-scheduled-refresh-in-power-b)
