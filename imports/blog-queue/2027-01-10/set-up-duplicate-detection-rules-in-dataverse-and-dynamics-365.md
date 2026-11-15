---
title: "How to Set Up Duplicate Detection Rules in Dataverse and Dynamics 365"
summary: "Create, publish and edit duplicate detection rules in the Power Platform admin center: required roles, base and matching record types, criteria options, matchcode length, the five-rule limit per record type and what the Learn page leaves out."
status: review
publish: false
author: mirko-p
date: 2027-01-10
topics: [dataverse]
keypoints:
  - "Model-driven and customer engagement apps include default duplicate detection rules for accounts and contacts only. Other record types need a new rule."
  - "Create a rule in the Power Platform admin center under Environments > Settings > Data management > Duplicate detection rules."
  - "A rule has a base record type, a matching record type and criteria such as Exact Match or Same First Characters. Publishing creates a matchcode for every record."
  - "You can publish only five rules per base record type at a time. To edit a published rule, unpublish it first."
  - "The page does not cover turning detection on for the organization, when detection runs, or bulk detection jobs. It only links to those topics."
faq:
  - q: "Which roles can create duplicate detection rules?"
    a: "Microsoft Learn lists System Administrator, System Customizer, Sales Manager, Vice President of Sales, Vice President of Marketing or CEO-Business Manager, or equivalent permissions."
  - q: "Where do I create a rule?"
    a: "In the Power Platform admin center select Manage > Environments, select an environment, select Settings, expand Data management and select Duplicate detection rules."
  - q: "How many rules can be active?"
    a: "You can publish five rules per base record type at a time. Delete or unpublish an existing rule if you reach the limit."
  - q: "How do I change a published rule?"
    a: "Select the rule, choose Actions > Unpublish, make your changes and publish it again."
  - q: "Do default rules exist?"
    a: "Yes, for accounts and contacts in model-driven apps and customer engagement apps such as Dynamics 365 Sales and Customer Service. Other record types need a new rule."
---

Duplicate detection rules tell Dataverse which records count as duplicates, for example two contacts with the same email address. This guide follows the Microsoft Learn page on setting up duplicate detection rules. That page covers rule creation and publishing. It only links to the topics of turning detection on and running bulk detection jobs.

## Defaults and permissions

- Model-driven apps and customer engagement apps such as Dynamics 365 Sales and Customer Service include default rules for accounts and contacts only. Other record types need a new rule.
- Permissions: System Administrator, System Customizer, Sales Manager, Vice President of Sales, Vice President of Marketing or CEO-Business Manager, or equivalent permissions.

## Open the rules

1. Sign in to the Power Platform admin center.
2. Select **Manage** > **Environments**.
3. Select an environment, then select **Settings** on the command bar.
4. Expand **Data management** and select **Duplicate detection rules**.

## Create a rule

1. Select **New** and enter a name and a description.
2. Under **Duplicate Detection Rule Criteria**, choose the **Base Record Type**, for example Contacts.
3. Choose the **Matching Record Type**. It is usually the same as the base type, but it can differ, for example comparing the email of Contacts with the email of Leads.
4. Set the options:
   - **Exclude inactive matching records.** Only active records are considered. The page also recommends it if a criterion uses a status field.
   - **Case-sensitive.**
5. For each criterion choose the field. Use **Field** for the same type, or **Base Record Field** and **Matching Record Field** for different types.
6. Choose a **Criteria** operator such as **Exact Match**. For **Same First Characters** or **Same Last Characters**, set **No. of Characters**.
7. Optionally select **Ignore Blank Values**. With only one condition, blank values are ignored in duplicate detection jobs, and the setting does not work when the user is offline.
8. Watch **Current matchcode length** at the bottom of the list. The number of criteria is limited by matchcode storage. The page gives no number.
9. Select **Save and Close**.

## Publish, unpublish and the limit

- Select the rule and then **Publish** to make it active. Publishing creates a matchcode for every record of the matching type.
- To edit a published rule, select it, choose **Actions** > **Unpublish**, change it and publish it again.
- You can publish only five rules per base record type, for example Account, at a time. Delete or unpublish an existing rule when you reach the limit.

## Page guidance

- Base criteria on a field with unique values, such as email.
- A record type can have more than one duplicate detection rule.

## What the page does not say

- How to turn duplicate detection on or off for the whole organization. It links to a separate article.
- When detection runs, for example on create, update, Outlook sync or import.
- The steps for a bulk detection job. It links to a separate article.
- The matchcode length limit as a number.
- Performance effects, merge behavior and what a rule change does to existing duplicates.

## A rule design outline

This outline is practical advice built on the page.

1. Start with one rule on a unique field such as email.
2. Keep an eye on the matchcode length when you add criteria.
3. Use the active-records option if your criteria depend on status.
4. Publish and then test with a sample record.
5. Plan the five-rule limit per record type.

## Typical mistakes

This list is my own advice, not from the page.

- Expecting rules for every table. Defaults cover accounts and contacts only.
- Editing a rule without unpublishing it first.
- Adding many criteria and running out of matchcode length.
- Assuming the page explains bulk detection. It only links to it.

## Quick reference

| Item | Value on the page |
| --- | --- |
| Portal path | Environments > Settings > Data management > Duplicate detection rules |
| Default rules | Accounts and contacts |
| Operators named | Exact Match, Same First Characters, Same Last Characters |
| Rule options | Exclude inactive matching records, Case-sensitive, Ignore Blank Values |
| Active rule limit | Five per base record type |
| Edit a published rule | Actions > Unpublish, change, publish |

## Different base and matching types

The matching record type does not have to equal the base type. The page gives the example of comparing the email of Contacts with the email of Leads. In that case you pick a Base Record Field and a Matching Record Field instead of one Field. The page calls it useful to be able to compare different record types.

## Blank values

With the option Ignore Blank Values, records with empty values in the criteria field are not treated as matches. The page adds one caution: if a rule has only one condition, blank values are ignored during duplicate detection jobs, and the setting does not work when the user is offline.

## Related

- [Dataverse](https://www.m365.fm/entity/dataverse/)
- [Power Platform admin center](https://www.m365.fm/entity/power-platform-admin-center/)
- [Managed Environments](https://www.m365.fm/entity/managed-environments/)

## Sources

- [Set up duplicate detection rules to keep your data clean - Power Platform (Microsoft Learn)](https://learn.microsoft.com/power-platform/admin/set-up-duplicate-detection-rules-keep-data-clean)
