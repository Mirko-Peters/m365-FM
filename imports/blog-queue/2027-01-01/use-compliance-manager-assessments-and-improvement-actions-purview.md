---
title: "Use Compliance Manager Assessments and Improvement Actions in Microsoft Purview"
summary: "How to create and work with Compliance Manager assessments in Microsoft Purview using Microsoft Learn: roles, the Add assessment wizard, groups, status values, controls and improvement actions, access control, updates, export and deletion."
status: review
publish: false
author: mirko-p
date: 2027-01-01
topics: [compliance-manager, purview, compliance-manager-assessment]
keypoints:
  - "Creating an assessment needs the Compliance Manager Administration or Assessor role, or Global Administrator. Start with Add assessment on the Assessments page."
  - "The wizard asks for a regulation, a unique assessment name and group, and the services. It ends with Create assessment, or Try again if it fails."
  - "Assessment status is Complete, Incomplete, None or In progress, based on control and improvement action test statuses."
  - "An assessment's group cannot be changed once it is added, and a group cannot hold two assessments for the same product and certification pair."
  - "Accepting an assessment template update is permanent, and updates apply per group. Deleting an assessment is permanent and not recoverable."
faq:
  - q: "Which roles can create an assessment?"
    a: "According to Microsoft Learn, Compliance Manager Administration, Compliance Manager Assessor or Global Administrator. Learn recommends the role with the fewest permissions."
  - q: "How do I create an assessment?"
    a: "According to Microsoft Learn, select Add assessment on the Assessments page, choose a regulation, enter a name and group, select services, and select Create assessment."
  - q: "What does the Incomplete status mean?"
    a: "According to Microsoft Learn, Incomplete means at least one control is Failed. Complete means all controls Passed, or at least one passed and the rest are Out of scope."
  - q: "Can I limit who sees an assessment?"
    a: "Yes. According to Microsoft Learn, open the assessment details, select Manage user access, and add Readers, Assessors or Contributors."
  - q: "What happens when I delete an assessment?"
    a: "According to Microsoft Learn, deletion is permanent and not recoverable, and improvement actions that appear in no other assessment are deleted with it. Export a report first."
---

In Microsoft Purview Compliance Manager, you create an assessment from a regulatory template, assign it to a group, pick the services it covers, and then work through its controls and improvement actions. This guide follows the Microsoft Learn article on Compliance Manager assessments. That article does not describe the improvement action workflow in detail, and it does not spell out the path in the Purview portal.

## What assessments are

Learn says assessments help your organization evaluate its compliance with industry and regional regulations. Ready-to-use regulatory templates for over 360 regulations contain the controls and improvement actions needed to complete an assessment. One assessment can cover several services. The page's example is a single EU GDPR assessment that covers Microsoft 365, Azure, AWS and Google Cloud Platform.

Which regulations are available by default depends on your licensing agreement. A counter at the top of the Assessments page shows the regulation licenses in use. The Data Protection Baseline is a default assessment included at all subscription levels. It sets your initial compliance score. Learn also describes premium AI templates, such as the EU Artificial Intelligence Act and NIST AI RMF 1.0, which count toward purchased premium licenses.

## Roles

To create assessments you need Compliance Manager Administration, Compliance Manager Assessor, or Global Administrator. Learn recommends using the roles with the fewest permissions and minimizing Global Administrator assignments.

## Create an assessment

1. On the **Assessments** page, select **Add assessment**.
2. **Base your assessment on a regulation:** select **Select regulation**, search, check the regulation, **Save**, confirm, then **Next**.
3. **Add name and group:** the name must be unique across all groups. Choose **Use existing group** or **Create new group**. For a new group you can copy data from an existing group, meaning implementation and testing details and documents. Select **Next**.
4. **Select services:** choose the services available for the regulation and select **Add**, then **Next**. If a service is missing, select **Add new service**. The universal version of the regulation is used and you do implementation and testing manually.
5. If a service has several subscriptions covered by Microsoft Defender for Cloud, select **Manage subscriptions** and remove any with the X.
6. **Review and finish:** select **Create assessment**. If you see **Assessment failed**, select **Try again**.

For custom assessments, Learn points to a separate article. Non-Microsoft services such as Salesforce and Zoom need connectors.

## Groups

- Every assessment belongs to a group. Groups organize assessments by year, regulation, division or geography.
- A group needs at least one assessment, and groups cannot be deleted. Group names must be unique.
- Groups have no security properties. Permissions attach to assessments.
- Once an assessment is added to a group, its grouping cannot be changed.
- A group can hold assessments for the same regulation, but only one per product and certification pair.
- Technical improvement actions update across all groups. Nontechnical actions update only in the group where you apply them.

## Status, controls and actions

The Assessments page shows a status for each assessment:

| Status | Meaning from Learn |
|---|---|
| Complete | All controls Passed, or at least one passed and the rest Out of scope |
| Incomplete | At least one control Failed |
| None | Not all controls tested |
| In progress | Improvement actions are In progress, Partial credit or Undetected |

The details page has an overview and tabs for **Progress**, **Controls**, **Your improvement actions** and **Microsoft actions**. Controls show status, control ID, points achieved and the counts of completed actions. Selecting an improvement action opens its details page, where you manage implementation and testing. That workflow is in a separate article that I did not read. Learn says the Data Protection Baseline sets the initial score and that points roll up per service. It does not explain how scores are calculated.

## Limit access to one assessment

By default, roles apply to all assessments. To limit access, open the assessment details, select **Manage user access**, and use the **Readers**, **Assessors** and **Contributors** tabs with **+ Add**. A new assessment-level role overrides an old one for that user. Admins with permissions from Microsoft Entra ID, such as Global Administrator, do not appear on that pane. A user can hold an overall role and an assessment role at the same time.

## Updates, export and deletion

- **Updates:** a **Pending update** label and a **Review update** banner appear when a template changes. You can download the updated and current templates as Excel files. **Accept update** is permanent, and **Cancel** defers it. Custom assessments do not receive Microsoft updates, and updates apply per group.
- **Export:** **Export actions** creates an Excel snapshot with implementation status, test date and results.
- **Deletion:** permanent and not recoverable. Improvement actions that appear in no other assessment are deleted with it. You cannot delete all assessments, because Compliance Manager needs at least one.

## Suggestion: a first assessment

This section is a practical suggestion and not a Microsoft statement.

1. Pick one regulation that applies to you and one group, named after the year or the business unit.
2. Select only the services that are in scope.
3. Assign owners for the controls with the most failed items first.
4. Export an Excel snapshot before you accept a template update.

## Not covered

The page I read does not describe the following:

- How to set implementation status, assign owners and attach evidence for improvement actions.
- Scoring formulas and point values.
- A maximum number of assessments.
- The Purview portal navigation path to Compliance Manager.
- Pricing of premium regulations and AI templates.

## Related

- [Compliance Manager](https://www.m365.fm/entity/compliance-manager/)
- [Compliance Manager assessment](https://www.m365.fm/entity/compliance-manager-assessment/)
- [Microsoft Purview](https://www.m365.fm/entity/purview/)

## Sources

- [Build and manage assessments in Microsoft Purview Compliance Manager (Microsoft Learn)](https://learn.microsoft.com/purview/compliance-manager-assessments)
