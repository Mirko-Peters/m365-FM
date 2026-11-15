---
title: "Create Microsoft Sentinel Analytics Rules From Templates: Steps, Settings and Updates"
summary: "How to create a scheduled analytics rule from a template in Microsoft Sentinel, based on Microsoft Learn: the Defender portal path, wizard settings, query scheduling ranges, incident grouping, template updates, and the March 2027 Azure portal change."
status: review
publish: false
author: mirko-p
date: 2027-01-01
topics: [microsoft-sentinel]
keypoints:
  - "In the Defender portal go to Microsoft Sentinel, Configuration, Analytics, open the Rule templates tab, select a template and then Create rule. The wizard opens with all details autofilled."
  - "The Create rule button may be disabled if a required data source is not enabled. After creation the rule appears on the Active rules tab."
  - "Learn says that after March 31, 2027 Microsoft Sentinel will no longer be supported in the Azure portal and will be available only in the Microsoft Defender portal."
  - "Scheduled rule settings allow Run query every and Lookup data from the last between 5 minutes and 14 days, and the lookback must be at least the query interval."
  - "Rules do not update automatically when a template changes. An Update badge appears on the rule, and Review and update compares the rule with the latest template."
faq:
  - q: "Where do I find rule templates in Microsoft Sentinel?"
    a: "According to Microsoft Learn, in the Defender portal expand Microsoft Sentinel, then Configuration, select Analytics, and open the Rule templates tab. You can filter by rule type Scheduled."
  - q: "Why is the Create rule button disabled?"
    a: "According to Microsoft Learn, each template lists required data sources, and if a data source is not enabled the Create rule button may be disabled or a message may appear."
  - q: "Does a rule change when its template changes?"
    a: "No. According to Microsoft Learn, an active rule is no longer connected to its template, but it remembers the template. An Update badge notifies you of a newer version and you choose whether to update."
  - q: "What happens to Sentinel in the Azure portal?"
    a: "Microsoft Learn says that after March 31, 2027 Microsoft Sentinel will no longer be supported in the Azure portal and will be available only in the Microsoft Defender portal."
---

To create an analytics rule from a template, open **Analytics** in Microsoft Sentinel, go to the **Rule templates** tab, select a template and choose **Create rule**. The wizard opens with the template values filled in, and you can adjust them before the rule is created. This guide follows the Microsoft Learn article on creating a rule from a template, the article Create scheduled analytics rules in Microsoft Sentinel, which covers the wizard, and the article on managing template versions.

## A date to know

Learn states that after March 31, 2027 Microsoft Sentinel will no longer be supported in the Azure portal and will be available only in the Microsoft Defender portal. Azure portal customers will be redirected, and Microsoft recommends planning the transition. The steps below use the Defender portal. A banner on the template version page also says that custom detections are now the best way to create new rules across Microsoft Sentinel and Microsoft Defender XDR.

## What templates are

Scheduled rules are based on Kusto queries that run at regular intervals and examine raw data from a lookback period. If the result count passes the threshold, the rule produces an alert. Templates come through solutions in the Content hub. Learn says the queries are written by security and data science experts, from Microsoft or from the solution vendor.

## Create a rule from a template

1. In the Microsoft Defender portal, expand **Microsoft Sentinel**, then **Configuration**, and select **Analytics**.
2. Open the **Rule templates** tab. To show only scheduled templates, select **Add filter**, **Rule type**, **Scheduled**, then **Apply**.
3. Select a template name, then select **Create rule** in the details pane.
4. Learn says each template lists required data sources, which are checked automatically. If a data source is not enabled, **Create rule** may be disabled or you may see a message.
5. The rule creation wizard opens with all details autofilled. Go through the tabs and adjust the logic and other settings where possible.
6. At the end of the wizard Sentinel creates the rule, and it appears on the **Active rules** tab.

The template article does not name the wizard tabs and does not list prerequisites or roles. The scheduled rule wizard article says the role needed is Microsoft Sentinel Contributor, or any role with write permissions on the Log Analytics workspace and its resource group.

## Settings you can change in the wizard

The wizard article describes these stages: general information, **Set rule logic**, **Incident settings**, **Automated response**, and **Review and create**.

- **General:** name, description, severity (Informational, Low, Medium, High), MITRE ATT&CK tactics and techniques, and status. A disabled rule is created without running and can be enabled later from **Active rules**.
- **Rule query and enrichment:** the query must return `TimeGenerated`. You can map up to 10 entity types, add custom details and customize alert details.
- **Query scheduling:** **Run query every** and **Lookup data from the last** each accept 5 minutes to 14 days. The lookback must be greater than or equal to the interval.
- **Alert threshold and grouping:** for example, generate an alert when the number of results is greater than 100. Enter 0 for no threshold. Events can be grouped into one alert or one alert per event.
- **Suppression:** stop running the query after an alert, for up to 24 hours.
- **Results simulation:** **Test with current data** simulates the rule 50 times against current data.
- **Incident settings:** creating incidents is enabled by default. If Sentinel is onboarded to the Defender portal, Learn says to leave it enabled. Up to 150 alerts can be grouped into one incident.
- **Automated response:** pick or create automation rules. Classic alert automation playbooks cannot be added since June 2023. The page says playbooks already listed there continue to run until the method is deprecated, effective March 2026. That date has already passed, and the page does not say what happens afterwards. It tells you to create an automation rule based on the alert created trigger, call the playbook from it and then remove the playbook from the classic list, so check any classic playbooks you still have.
- **Review and create:** select **Create** when validation passes.

## Rule updates after a template changes

Learn explains that creating a rule copies the template, so the active rule is no longer connected to it. If the template changes, rules are not updated dynamically. The rule remembers its template, so you can revert it and you are notified of updates.

- An **Update** badge appears next to the rule name in **Active rules**.
- Select the rule. **Review and update** appears for rules with the badge, and **Compare with template** for rules without it.
- **Review and update** opens a side-by-side YAML comparison. You can accept the changes, customize first through **Next : Custom changes**, or cancel.
- Updating overwrites your rule with the latest template, so customizations to the query, scheduling or grouping might be lost. Check automation that refers to the rule.
- A major version change, in the format 1.0.0, means something essential changed. A minor change is an improvement you can take or leave. Rules created before October 2021 have no current template version.
- To revert a rule to its original template, select **Compare with template**. On the **Compare to latest version** tab the left side shows the active rule and the right side the original, unchanged template. Select **Review and update** to revert completely, **Next : Custom changes** to customize first, or the X to exit without changes.

Template version management is marked as preview on the Learn page.

## Other ways to enable many rules

Learn says the most efficient way to enable rules for your connected data sources is the data connector page, which lists related rules. Rules can also be created through the REST API or the Az.SecurityInsights PowerShell module. This takes extra effort, because you must first export the rules to JSON.

## Suggestion: a practical start

This section is a practical suggestion and not a Microsoft statement.

1. Connect the data sources first so that templates for them can be created.
2. Create new rules as disabled, review the query and the entity mapping, and enable them once you are satisfied.
3. Use **Test with current data** to see how many alerts a rule would produce before it goes live.
4. Revisit rules when the **Update** badge appears.

## Not covered

The pages I read do not describe the following:

- Prerequisites on the template page itself.
- The Azure portal procedure for the template steps.
- The exact milestone labels of the Defender portal wizard.
- A limit on the number of rules or on query length.

## Related

- [Microsoft Sentinel](https://www.m365.fm/entity/microsoft-sentinel/)

## Sources

- [Create scheduled analytics rules from templates in Microsoft Sentinel (Microsoft Learn)](https://learn.microsoft.com/azure/sentinel/create-analytics-rule-from-template)
- [Create scheduled analytics rules in Microsoft Sentinel (Microsoft Learn)](https://learn.microsoft.com/azure/sentinel/create-analytics-rules)
- [Manage Template Versions for your Scheduled Analytics Rules in Microsoft Sentinel (Microsoft Learn)](https://learn.microsoft.com/azure/sentinel/manage-analytics-rule-templates)
