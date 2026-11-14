---
title: "Business Central Quality Management: Setup, Templates and Inspection Rules"
summary: "Business Central Quality Management from 2026 release wave 1: what it covers, how to install and set it up, permission sets, inspection generation rules, triggers and handling of failed goods."
status: review
publish: false
author: mirko-p
date: 2026-12-06
topics: [dynamics-365-business-central, quality-management-system]
keypoints:
  - "Quality Management is a Microsoft extension, new in Business Central 2026 release wave 1. It installs automatically on new environments."
  - "Inspections can be created automatically, manually or on a schedule at purchasing, production, assembly and warehouse steps."
  - "Generation rules decide which inspection template applies to a transaction. Sort order sets priority, and the activation trigger controls manual or automatic use."
  - "The Quality Inspector permission set must be assigned explicitly. Changing quantities or reopening finished inspections needs the Admin and Supervisor set."
  - "The Premium experience is required for production capabilities. Essential is enough otherwise."
faq:
  - q: "What is Quality Management in Business Central?"
    a: "Microsoft Learn describes it as a quality inspection application introduced in Business Central 2026 release wave 1. It creates inspections at key points in purchasing, production, assembly and warehouse processes, using templates with measurements and pass or fail criteria."
  - q: "How do I get it in an existing environment?"
    a: "Microsoft Learn says it is a Microsoft-published extension that installs automatically on new environments. On existing environments you install it from the Extension Management page or from Microsoft Marketplace."
  - q: "Which license experience do I need?"
    a: "According to the setup page, the Premium experience is required for production capabilities, and the Essential experience is sufficient otherwise."
  - q: "What can I do with items that fail an inspection?"
    a: "The overview lists moving items to quarantine bins, negative adjustments for disposal, transfer orders, purchase returns to vendors and blocking or unblocking lots based on results."
  - q: "Who can reopen or delete a finished inspection?"
    a: "Microsoft Learn says reopening or deleting a finished inspection, changing quantity, passed quantity, failed quantity or sample size, and reassigning inspections are restricted to Quality Admin and Supervisor (or SUPER)."
---
Business Central Quality Management adds inspections to receiving, production, assembly and warehouse work. You define templates with measurements and pass or fail criteria, then rules that tell Business Central when to create an inspection. This article follows Microsoft's setup order and points out the settings that change behavior most.

## What it is

Microsoft Learn calls Quality Management a quality inspection application for Business Central, introduced in 2026 release wave 1. The related release plan entry gives general availability as April 1, 2026, and that page is archived as of October 2026. It is a Microsoft-published extension. It installs on its own in new environments. In existing environments, install it from **Extension Management** or Microsoft Marketplace.

Inspections can be created three ways:

1. **Automatically:** by purchase receipts, production or assembly output, or warehouse movements.
2. **Manually:** on demand, for reactive cases.
3. **On a schedule:** periodically through job queues.

## Prepare base data and permissions

Set up locations (including bins for inspection areas), items (item tracking codes, lot number series, inventory posting groups) and the vendors involved in purchase receipt inspections. Then assign permission sets:

| Permission set | Purpose |
|---|---|
| Quality Admin & Supervisor | Full access to setup, templates, generation rules and inspections |
| Quality Inspector | Takes ownership of unassigned inspections, records values, finishes inspections. Must be assigned explicitly |
| Quality Auditor | Read-only |
| Quality Inspection - Create | Minimum rights for transactions that create inspections |

## Run the assisted setup

1. Press **Alt+Q**, search for **Assisted Setup** and open it.
2. Select **Quality Management** and then **Open My Settings**.
3. Set **Role** to **Quality Manager** and close **My Settings**.
4. Return to Assisted Setup and select **Done**.

This does not create templates, rules or demo data. Demo data comes from **Install Demo Data** on the setup page, which can open Marketplace for the Contoso Coffee demo dataset.

## Configure the setup page

Search for **Quality Management Setup**. Key fields on the **General** FastTab:

- **Quality Inspection Nos.:** the default number series. A series on a template takes precedence.
- **Inspection Creation Option:** for example **Always create new inspection**, **Create a reinspection if matching inspection is finished** or **Use existing open inspection if available**. A reused inspection keeps its status, results and measurements.
- **Inspection Search Criteria:** how an existing inspection is found.

The **Generation Rule Trigger Defaults** FastTab sets default triggers per area, such as purchase orders (when received or when released), warehouse receipts, production orders (for example when output is posted) and warehouse movements. The **Item Tracking Before Finishing** setting controls whether lot or serial numbers must be posted, reserved or merely non-empty before an inspection can finish.

## Create inspection generation rules

A generation rule decides which inspection template applies to a transaction. Search for **Quality Inspection Generation Rules** and select **New**. Main fields:

- **Sort Order:** priority among rules for the same source table. Lower numbers are chosen first.
- **Template Code:** the template to use.
- **Intent and Table:** the type of source document, such as purchase, production, assembly, warehouse, returns or transfers.
- **Condition, Item and Attribute Filter:** when the template applies.
- **Activation Trigger:** Manual or Automatic, Manual only, Automatic only or Disabled.
- **Schedule Group:** lets one schedule refer to several rules.

The page also offers assisted actions: **Create Receiving Rule**, **Create Bin Movement Rule**, **Create Production Rule** and **Create Assembly Rule**. A bin movement rule is typically used to move noncompliant goods to a quarantine bin.

## Handle failed items

Microsoft lists these responses to noncompliant items: move them to quarantine bins, post negative adjustments for disposal, transfer them to other locations, create purchase returns, and block or unblock lots based on results. Workflows can automate responses when inspections are created or finished.

## Watch out for

- Posting an open purchase order releases it and triggers inspection creation. If posting fails, the order returns to **Open**, but the inspection remains. A retry may create another one, depending on **Inspection Creation Option**.
- Production capabilities need the Premium experience.
- Reusing an existing inspection does not change its test data.

## What the pages do not say

The overview does not describe permissions in detail and does not give a feature management toggle. The release plan page does not list geographic or language availability. Check the Learn pages on templates and workflows before you design your tests.

## Related

- [Dynamics 365 Business Central](https://www.m365.fm/entity/dynamics-365-business-central/)
- [Quality management system](https://www.m365.fm/entity/quality-management-system/)

## Sources

- [Quality management overview](https://learn.microsoft.com/dynamics365/business-central/qms-overview)
- [Quality management setup](https://learn.microsoft.com/en-us/dynamics365/business-central/qms-setup)
- [Quality inspection generation rules](https://learn.microsoft.com/en-us/dynamics365/business-central/qms-test-generation-rules)
- [Evaluate the quality of goods and materials, 2026 release wave 1](https://learn.microsoft.com/en-us/dynamics365/release-plan/2026wave1/smb/dynamics365-business-central/evaluate-quality-incoming-goods-materials)
