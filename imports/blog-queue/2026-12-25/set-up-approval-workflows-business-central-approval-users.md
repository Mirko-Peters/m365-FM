---
title: "Set Up Approval Workflows in Business Central: Approval Users and Limits"
summary: "Prepare and set up approval workflows in Dynamics 365 Business Central: the order of tasks, the Approval User Setup page and its fields, amount limits, substitutes, the approval administrator and what the pages leave out."
status: review
publish: false
author: mirko-p
date: 2026-12-25
topics: [dynamics-365-business-central]
keypoints:
  - "Before creating approval workflows, set up workflow users and approval users, then specify how users are notified, then create the workflows."
  - "Open Approval User Setup with Search (Alt+Q), create a line per user, and run the Approval User Setup Test action."
  - "Amount limits are set per user for sales, purchases and purchase quotes in local currency, or unlimited approval can be selected."
  - "A substitute can be the Substitute user, the direct approver or the approval administrator, in that order. Only one person can be the approval administrator."
  - "Do not make the same user both requestor and approver in a workflow user group, or requests are approved automatically."
faq:
  - q: "In what order do I set up approval workflows?"
    a: "According to Microsoft Learn, set up workflow users and approval users, specify how users are notified of workflow steps, then create the workflow by connecting events and responses or from a template."
  - q: "Where are approval users set up?"
    a: "Select Search (Alt+Q), enter Approval User Setup and choose the related link. Create a new line for each user and use the Approval User Setup Test action."
  - q: "How do approval limits work?"
    a: "Learn lists Sales Amount Approval Limit and Purchase Amount Approval Limit in local currency, plus Request Amount Approval Limit for purchase quotes, which needs the Approver Chain option. Selecting the unlimited option for a type means its limit field cannot be filled in."
  - q: "What if an approver is unavailable?"
    a: "The substitute approves requests. Learn says it can be the user in the Substitute field, the direct approver or the approval administrator, in that order of priority."
  - q: "What if a scenario needs an event the standard workflow does not support?"
    a: "Learn suggests signing up for Power Automate, getting an app from Marketplace or working with a Microsoft partner to customize the application code."
---

Approval workflows in Business Central connect tasks done by different users, such as requesting and granting approval before a record is created. The setup order is workflow users, approval users, notifications, and then the workflow itself. This guide follows two Microsoft Learn pages.

## Order of tasks

The overview says to do these before you create approval workflows:

1. Set up workflow users and user groups.
2. Set up approval users.
3. Specify how users are notified of workflow steps, and optionally customize the notification email, which Learn names as report 1320, Notification Email.
4. Set up an SMTP server for email if you use email notifications.
5. Create the workflow by connecting events and responses, or from a template.

Learn also describes sharing workflows between databases by exporting and importing them, and a walkthrough for a purchase approval workflow.

## How a workflow is built

On the **Workflow** page you list steps on lines. Each step has a workflow event, moderated by event conditions, and a workflow response, moderated by response options. Steps are chosen from fixed lists of events and responses that the application code supports. If a scenario needs an event or response that the default version does not support, Learn suggests signing up for Power Automate, getting an app from Marketplace or working with a Microsoft partner.

## Set up approval users

1. Select **Search** (`Alt`+`Q`), enter **Approval User Setup** and choose the related link.
2. Create a new line and fill in the fields.
3. Choose the **Approval User Setup Test** action to test the setup.
4. Repeat for every approval user.
5. Set up notifications next.

### Fields

| Field | Meaning |
| --- | --- |
| User ID | The person involved in the approval process |
| Salespers./Purch. Code | The salesperson or purchaser code that applies to the user |
| Approver ID | The user who must approve requests made by the User ID user |
| Sales Amount Approval Limit | Maximum sales amount in local currency the user can approve |
| Unlimited Sales Approval | Approve all sales requests. The limit field then cannot be filled in. |
| Purchase Amount Approval Limit | Maximum purchase amount in local currency |
| Unlimited Purchase Approval | Approve all purchase requests |
| Request Amount Approval Limit | Maximum amount for purchase quotes. Requires the Approver Chain option in the Approver Limit Type field on the Workflow Response page. |
| Unlimited Request Approval | Approve all purchase quotes |
| Substitute | The user who approves if the approver is unavailable |
| Email | The email address of the user |
| Approval Administrator | The user who can unblock approval workflows, for example by delegating requests to new substitutes or deleting overdue requests. Only one person can be the approval administrator. |

The substitute can be the user in the Substitute field, the direct approver or the approval administrator, in that order of priority.

## Important warnings

Do not make the same user both a requestor and an approver in a workflow user group, because their requests are then approved automatically. With multiple approvers, only approvers with a higher sequence number can change a request's status to Approved. Lower-sequence approvals do not affect the status.

## Suggested preparation

This list is a suggestion, not from the pages. Before you open the Workflow page, write down who requests and who approves each document type, the amount limits per approver and a substitute for each approver. Decide who the single approval administrator will be. Then enter those values on the Approval User Setup page and run the setup test for every line, so errors surface before users send real requests.

## Not covered

The pages I read do not give the menu path for opening Workflows, the template steps, how to enable a workflow, the available events and responses, or licenses and permissions. The user page does not describe the Direct Approver and Specific Approver chain types or what the setup test reports. Use the linked articles on creating approval workflows for those.

## Related

- [Dynamics 365 Business Central](https://www.m365.fm/entity/dynamics-365-business-central/)

## Sources

- [Set up approval workflows](https://learn.microsoft.com/dynamics365/business-central/across-set-up-workflows)
- [Set up approval users](https://learn.microsoft.com/dynamics365/business-central/across-how-to-set-up-approval-users)
