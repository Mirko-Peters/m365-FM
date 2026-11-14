---
title: "Teams Approvals and Power Automate Approval Workflows: How They Work and How to Set Them Up"
summary: "How the Approvals app in Teams works, how to send an approval, when to build a Power Automate approval flow instead, the approval types, prerequisites, licensing, admin controls and limits."
status: review
publish: false
author: mirko-p
date: 2026-11-23
topics: [teams, power-automate, dataverse, microsoft-forms]
keypoints:
  - "The Approvals app is a personal Teams app for all users and is enabled by default. Send a request with New approval request, then check the Sent tab."
  - "Approvals run on Power Automate and are stored in Microsoft Dataverse. The first approval provisions the Approval solution in the default environment."
  - "Power Automate offers five approval types, from Everyone must approve and First to respond to Sequential approval."
  - "Approvers can respond from Outlook email, a Teams adaptive card or the Power Automate action center."
  - "Approval templates are capped at 400 per team and 50,000 requests per template. Admins can audit activity in the Microsoft Purview portal."
faq:
  - q: "Where do I find Approvals in Teams?"
    a: "Per Microsoft Learn, select More added apps (...) in Teams, search for approvals and open the app. Learn says it is a personal app available to all Teams users, and users can pin it to the menu bar. Admins can also pin it through an app setup policy."
  - q: "Do I need a Power Automate license to use Teams Approvals?"
    a: "The Learn admin page lists a license for Power Automate, Microsoft 365 or Dynamics 365 as a prerequisite. The Power Automate approvals page says the approvals actions use a standard connector, so any license that grants Power Automate access and standard connectors is enough, including an Office 365 license."
  - q: "What is the difference between the Approvals app and a Power Automate approval flow?"
    a: "The app lets people send and track approvals themselves, including from templates. A flow built with the Start and wait for an approval action pauses until approvers respond, then continues with further steps. Learn describes both as built on the same approvals capability and stored in Dataverse."
  - q: "Can approvers outside my tenant respond?"
    a: "Power Automate can assign approvals to users in the Dataverse environment or Microsoft Entra tenant, including guests and Microsoft 365 groups. Learn says assignment does not work if the Entra AllowAdHocSubscriptions setting is disabled, if a security group controls environment access, or on US Government plans, and guests who have not accepted their B2B invitation are removed."
  - q: "How can an admin turn off or audit Approvals?"
    a: "To turn it off, go to Teams apps > Manage apps in the Teams admin center, search for Approvals and toggle it off. For auditing, Learn says events appear in the Microsoft Purview portal under Audit, filtered by Microsoft Teams approvals activities."
---

The Approvals app in Teams is the simplest way to ask someone to approve something and keep a record. Select the app, choose **New approval request**, fill in the form and send it. For anything that must trigger other steps after the answer, build a Power Automate flow with an approval action instead.

Both rely on the same capability. This article shows the setup for each, the approval types and the limits Microsoft documents.

## The Approvals app in Teams

Microsoft Learn describes Approvals as a personal app available to all Teams users. It adds auditing, compliance and accountability to approvals, and users can pin it to the menu bar. It is enabled by default. Learn notes it is not yet released to GCC High or DoD users.

### Send an approval

1. In Teams, select **More added apps (...)**, search for **approvals** and open the app.
2. Select **New approval request** in the top right.
3. Fill in the form. Learn recommends turning on **Require a response from all approvers** if everyone must respond, and leaving it off if one approver is enough.
4. Select **Send**. The request appears on the **Sent** tab.

Learn adds a known issue: approvals created through this Teams experience are created in your organization's default environment.

### Use a template

Microsoft Support describes a faster path for repeated requests:

1. Open the Approvals hub and start a new request.
2. In the dialog, choose **Templates** and pick one.
3. Enter the request name, recipients and details, then send.

You can also start from the Approvals icon inside a chat or channel. If a team owner or admin has preset recipients on a template, you may not be able to add or remove recipients.

Learn says team owners can create templates for teams they own. Org-wide templates are created by admins, and the first one creates a Microsoft Entra group for tenant admins as owners. Templates are limited to 400 per team and 50,000 requests per template.

## Build a Power Automate approval flow

Use a flow when the answer should drive the next step, such as publishing a document, updating a list or notifying a manager.

Learn says the quickest start is the **Start and wait for an approval** action. You define the request and the approvers, and the flow pauses until they respond. Related actions are **Create an approval** and **Wait for an approval**.

The approval types:

| Type | Behavior |
|---|---|
| Approve/Reject, everyone must approve | Continues after all respond, or immediately on a single rejection |
| Approve/Reject, first to respond | The first response completes the request |
| Custom responses, wait for all | You define the options and all approvers must respond |
| Custom responses, wait for one | You define the options and any one response completes it |
| Sequential approval | Approvers respond one at a time in a set order |

Approvers can respond from an Outlook email, a Teams adaptive card or the Power Automate action center. You can assign approvers from your Dataverse environment or Entra tenant, including guests and Microsoft 365 groups.

## Prerequisites and licensing

From the Learn admin page for the Approvals app:

- Permission to create a Microsoft Dataverse database.
- A Power Automate account and an administrator role in the target environment.
- A license for Power Automate, Microsoft 365 or Dynamics 365.
- A Microsoft Forms license for users who set up new approval templates.

The Power Automate page adds that the user who runs the first approval flow in a non-default environment must be an environment administrator, and provisioning can take a few minutes. In the default environment the database is created automatically. Approvals use a standard connector, so a Power Automate, Office 365 or Dynamics 365 license with standard connector use is sufficient.

Users are automatically added to the **Approvals User** role on their first approval assignment.

## Where the data lives

Learn says the first approval triggers provisioning of the Approval solution in the default Dataverse environment. For template-based approvals, metadata is stored in Dataverse and responses are stored in Microsoft Forms. Deleting a Forms template on the Forms site breaks the related approval template, and users then see a "CDB TableNotFound" error.

The default Dataverse environment does not currently support backups, according to Learn. Admins can set custom retention policies for Dataverse tables.

## Admin controls

- **Turn off:** Teams admin center > **Teams apps** > **Manage apps**, search for **Approvals**, toggle it off.
- **Pin:** edit the global app setup policy or assign a custom one.
- **E-signature providers** (Adobe Sign, DocuSign): on the app's **Settings** tab. They are enabled by default and users need a license from the provider.
- **Audit:** Microsoft Purview portal > **Audit**, filtered to Microsoft Teams approvals activities. For deeper detail, enable auditing in Power Automate for the Approval, Approval Request and Approval Response entities.

## Common mistakes

- Using the Teams app for a process that needs follow-up steps. Use a flow.
- Deleting a Forms template and breaking the approval template.
- Assigning approvers who have not accepted a guest invitation. They are dropped from the list.
- Expecting the Approvals app on GCC High or DoD.
- Skipping the Forms license for people who author templates.

## Related

- [Power Automate](https://www.m365.fm/entity/power-automate/)
- [Dataverse](https://www.m365.fm/entity/dataverse/)
- [Multistage approvals](https://www.m365.fm/entity/multistage-approvals/)
- [Microsoft Teams admin center](https://www.m365.fm/entity/teams-admin-center/)

## Sources

- [Manage the Approvals app in Microsoft Teams (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoftteams/approval-admin)
- [Create an approval from the Approvals app (Microsoft Learn)](https://learn.microsoft.com/en-us/power-automate/teams/create-approval-from-teams-app)
- [Get started with approvals in Power Automate (Microsoft Learn)](https://learn.microsoft.com/en-us/power-automate/get-started-approvals)
- [Create an approval request with a template (Microsoft Support)](https://support.microsoft.com/en-us/office/create-an-approval-request-with-a-template-7d281bf2-4e60-42ea-afc3-e472dd20c93d)
