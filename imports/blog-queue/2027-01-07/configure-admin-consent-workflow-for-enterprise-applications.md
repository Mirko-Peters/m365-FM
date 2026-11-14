---
title: "How to Configure the Admin Consent Workflow for Enterprise Applications"
summary: "Turn on the Microsoft Entra admin consent workflow: required role, portal path, reviewer settings, notifications, expiry, reminders, who can approve Graph application permissions, and what the page leaves unsaid."
status: review
publish: false
author: mirko-p
date: 2027-01-07
topics: [entra-id, admin-consent]
keypoints:
  - "Turn the workflow on in Entra ID > Enterprise apps > Consent and permissions > Admin consent settings. Learn says a Global Administrator is required."
  - "Set Users can request admin consent to apps they are unable to consent to to Yes, then choose reviewers, notifications, reminders and the expiry period."
  - "Reviewers can view, block or deny requests. Only Global Administrators can approve requests for Microsoft Graph application permissions."
  - "Designating a reviewer does not elevate their privileges. They need the permissions required to grant admin consent for the requested app."
  - "Enabling the workflow can take up to an hour. New reviewers cannot act on requests created before they were added."
faq:
  - q: "Who can turn on the admin consent workflow?"
    a: "Microsoft Learn says a Global Administrator is required to turn on the workflow. It also advises using roles with the fewest permissions and limiting Global Administrator to cases where no existing role works."
  - q: "Where is the setting?"
    a: "In the Microsoft Entra admin center go to Entra ID > Enterprise apps > Consent and permissions > Admin consent settings. Under Admin consent requests select Yes for Users can request admin consent to apps they are unable to consent to."
  - q: "What can reviewers do?"
    a: "Reviewers can view, block or deny requests and see incoming requests in the My Pending tab. Only Global Administrators can approve requests for apps that ask for Microsoft Graph application permissions."
  - q: "How do expiry reminders work?"
    a: "Per Learn, the first reminder goes out about midway through the expiry period. With a three-day expiry, the first reminder is sent on day 2. The last one goes out almost immediately at expiry."
  - q: "How long does it take to take effect?"
    a: "Learn says enabling the workflow can take up to an hour."
---

The admin consent workflow gives users a way to ask for approval when they cannot consent to an app themselves. You enable it in the Entra admin center, name the reviewers and decide on notifications and expiry. This guide follows the Microsoft Learn page on configuring the admin consent workflow.

## Before you start

- **Role to turn it on:** Global Administrator. Learn advises limiting that role to emergencies or cases where no existing role works.
- **Reviewers:** a reviewer must already have the permissions needed to grant admin consent for the requested app. Naming someone as a reviewer does not elevate their privileges. The prerequisites are on the separate Learn page for granting admin consent, which was not read for this guide.

## Turn on the workflow

1. Sign in to the Microsoft Entra admin center as a Global Administrator.
2. Go to **Entra ID** > **Enterprise apps** > **Consent and permissions** > **Admin consent settings**.
3. Under **Admin consent requests**, set **Users can request admin consent to apps they are unable to consent to** to **Yes**.
4. Configure the options in the next section.
5. Select **Save**. Enabling can take up to an hour.

## The options

| Setting | What it does |
| --- | --- |
| **Who can review admin consent requests** | Users, groups or roles that act as reviewers. They can view, block or deny requests. Requests appear in the **My Pending** tab |
| **Selected users will receive email notifications for requests** | Emails reviewers when a request is made. If you turn it off, emails to requesters on request creation and review are also turned off |
| **Selected users will receive request expiration reminders** | Reminder emails to reviewers before a request expires |
| **Consent request expires after (days)** | How long a request stays valid |

Reminder timing: the first reminder is sent roughly midway through the expiry period. With a three-day expiry, it goes out on day 2, and the last reminder goes out almost immediately at expiry.

## How the workflow runs

1. A user who cannot consent to an app sends a request for admin approval.
2. The request is emailed to the designated reviewers.
3. A reviewer acts on it. Reviewers can view, block or deny.
4. The user is notified of the action.

Only Global Administrators can approve requests for apps that ask for Microsoft Graph application permissions (app roles). Other reviewers can handle the request in the ways listed above.

## Caveats about reviewers

- A reviewer you remove keeps the ability to review requests made while they were a reviewer. They continue to receive expiration reminders for them.
- A new reviewer is not assigned to requests created before they were added.
- A new reviewer cannot act on existing or expired requests.

## Configure it programmatically

Learn points to the Microsoft Graph Update adminConsentRequestPolicy API for setting the policy through code. The page does not list the required Graph permissions, so check the API reference before using it.

## What the page does not say

- What access the user gets after approval, and what changes after a denial or block beyond the notification.
- What block does in detail, and whether a user can withdraw or resubmit a request.
- Default values for the expiry period and reminder timing beyond the example.
- Whether roles other than Global Administrator can change the settings.
- How delegated permissions and other permission types are handled beyond the Graph app role rule.
- Limits on the number of reviewers, licensing, and behavior for guest or multitenant scenarios.

## A rollout outline

This outline is practical advice built on the page.

1. Choose a reviewer group, and check that its members hold a role that can grant admin consent.
2. Decide who approves Graph application permissions. Since only Global Administrators can, plan for that step.
3. Set an expiry period that matches how quickly reviewers can respond.
4. Turn on notifications and reminders, so requests do not sit unread.
5. Test with a nonadmin account that tries to sign in to an app that needs consent.
6. Allow for the delay of up to an hour before you test.

## Typical mistakes

- Naming reviewers who lack the permissions to grant consent.
- Expecting a non-Global-Administrator reviewer to approve Graph application permissions.
- Turning off email notifications and forgetting that requester emails stop too.
- Adding a reviewer and expecting them to handle requests that existed before.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Admin consent](https://www.m365.fm/entity/admin-consent/)
- [Illicit consent grant](https://www.m365.fm/entity/illicit-consent-grant/)

## Sources

- [Configure the admin consent workflow (Microsoft Learn)](https://learn.microsoft.com/entra/identity/enterprise-apps/configure-admin-consent-workflow)
