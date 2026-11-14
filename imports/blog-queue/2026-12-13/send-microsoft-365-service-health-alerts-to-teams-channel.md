---
title: "Send Microsoft 365 Service Health Alerts to a Teams Channel: Graph Polling and Workflows Webhooks"
summary: "Built-in service health notifications, the Graph service communications API for issues, and how to post new incidents into a Teams operations channel with a Workflows webhook now that Office 365 connectors are retired."
status: review
publish: false
author: mirko-p
date: 2026-12-13
topics: [microsoft-365-admin-center, microsoft-graph-permissions, teams, change-notifications]
keypoints:
  - "The admin center sends service health emails to up to two addresses per admin, for incidents, advisories or both, for the services you pick."
  - "The Graph service communications API exposes issues at /admin/serviceAnnouncement/issues and needs ServiceHealth.Read.All."
  - "Learn's service communications overview does not mention change notifications or webhooks, so a scheduled poll is the documented pattern."
  - "Office 365 connectors and connector-based incoming webhooks in Teams were retired in May 2026. Use a Workflows webhook instead."
  - "Workflows webhooks accept up to 28 KB per message, throttle above four requests per second, and need co-owners to avoid orphaned flows."
faq:
  - q: "Can the admin center send service health alerts by email?"
    a: "Yes. Microsoft Learn says to select Customize > Email in Service health, turn on Send me email notifications about service health, and choose up to two addresses, incidents, advisories or both, and the services to monitor. You can also manage notifications per issue. The limit of two addresses applies per admin account."
  - q: "Which Graph permission reads service health issues?"
    a: "The List issues reference shows ServiceHealth.Read.All as the least-privileged permission, both delegated and application. Learn says both versions can only be granted by an administrator. Delegated access also requires the signed-in user to hold at least one Microsoft Entra admin role."
  - q: "Can I use a Teams incoming webhook connector for this?"
    a: "Not any more. Microsoft Learn says Office 365 Connectors in Teams, including connector-based incoming webhooks, were retired in May 2026, and the Workflows app replaces them. Workflows linked to specific users, so add co-owners."
  - q: "Where do I see planned maintenance?"
    a: "Learn says planned maintenance is not shown in Service health. Use the Message center and filter for Plan for change instead."
---

Service health problems are easy to miss if they only appear in the Microsoft 365 admin center. Operations teams usually want them in the channel where they already work. Microsoft documents three building blocks: notifications in the admin center, the Graph service communications API, and Teams Workflows webhooks. This article puts them together and is clear about what the documentation does not say.

## Start with the built-in notifications

In the Microsoft 365 admin center go to **Health** > **Service health**. Users with the Service Support admin or Helpdesk admin role can view it, and Learn links to other roles that can too.

For email:

- **Tenant-wide:** select **Customize** > **Email**, select **Send me email notifications about service health**, and specify up to two email addresses, whether to receive incidents, advisories or both, and which services to monitor.
- **Per issue:** select an active issue, choose **Manage notifications for this issue**, and add up to two addresses.
- The two-address limit applies per admin account, so each admin sets their own.

Two other channels exist. The Microsoft 365 Admin app shows Service health and sends push notifications. If you cannot sign in to the admin center, use the service status page at status.cloud.microsoft.

A shared mailbox address is a simple way to use the email option for a team. Teams can then pick up the email with a mailbox-based workflow. The pages I read do not describe that route, so treat it as an idea to test.

## When you need automation

Use the Graph API if you want the data itself, for example to filter by service or to post a custom message. The Service communications API provides service health and Message center posts. Endpoints sit under https://graph.microsoft.com/v1.0/admin/serviceAnnouncement/, with operations such as healthOverviews, issues and messages. National clouds use different base URLs, which Learn lists.

Permissions from the overview:

| Use | Permission |
|---|---|
| Health overviews, issues, incident reports | ServiceHealth.Read.All |
| Service messages | ServiceMessage.Read.All |

Both delegated and application versions can only be granted by an administrator. Delegated access requires a signed-in user with at least one Entra admin role. Application access suits backend services such as monitoring pipelines that run with their own identity. Throttling applies per tenant per application, and the page gives no numbers.

## What List issues returns

**GET /admin/serviceAnnouncement/issues** returns serviceHealthIssue objects. The example response includes id, title, classification (Incident in the example), origin, status (ServiceRestored in the example), service, feature, featureGroup, startDateTime, endDateTime, lastModifiedDateTime, isResolved, impactDescription, details and posts. The Prefer header with odata.maxpagesize sets the page size, up to 1000 and 100 by default. Follow @odata.nextLink for further pages.

The reference says the method supports OData query parameters but does not list which ones. I did not confirm that a filter on lastModifiedDateTime or isResolved works server-side, so test it on your tenant. A safe fallback is to read recent issues and compare lastModifiedDateTime on the client.

## Polling pattern

The service communications overview does not mention change notifications or webhooks, and points to another article for guidance on access. A scheduled poll is therefore the pattern these pages support:

1. Run a scheduled job, for example every few minutes, with an app identity that has ServiceHealth.Read.All.
2. Call the issues endpoint and keep the highest lastModifiedDateTime you have processed.
3. For each issue that is new or changed since then, build a short message with id, title, service, status and impactDescription.
4. Post the message to the Teams webhook URL.
5. Store the processed state so a restart does not repost everything.

Permissions for this identity are high-value. Keep the app registration minimal, with only ServiceHealth.Read.All, and protect its secret or certificate.

## Posting to Teams with Workflows

Learn states that Office 365 Connectors in Teams, including connector-based incoming webhooks, were retired in May 2026, and that the Workflows app replaces them. Workflows is built on Power Automate.

To create a webhook:

1. In Teams, go to the team and channel.
2. Select **More options (...)** next to the channel, then **Workflows**.
3. Choose a template such as **Send webhook alerts to a channel**, configure the parameters and select **Save**.
4. Copy the generated webhook URL.

Alternatively, build a workflow from scratch with the **When a Teams webhook request is received** trigger.

Sending is a plain POST with JSON:

```
POST <WEBHOOK_URL>
Content-Type: application/json

{ "text": "Hello from a webhook workflow!" }
```

Limits and behavior from Learn:

- Adaptive Card payloads are supported. MessageCard payloads render but not their interactive HTTP POST action buttons.
- The message size limit is 28 KB. Above that you receive an error.
- More than four requests in a second causes throttling. Learn recommends retry with exponential backoff.
- Workflows support private channels.
- Workflows belong to their owners, not a team or channel, and can become orphaned without an owner. Add co-owners with full control, set up authentication for any connections and make sure the flow is enabled.

Keep alert text short. A summary with a link to the admin center issue stays far below 28 KB, and batching several issues in one post avoids the rate limit.

## Plan for change belongs elsewhere

Service health does not show planned maintenance. For that, use the Message center and filter for **Plan for change**. The same Graph API exposes messages through ServiceMessage.Read.All, so a second poll can feed a separate channel for upcoming changes.

## Common mistakes

- Using a retired connector URL and expecting posts to arrive.
- Assuming a Graph webhook exists for service health because other Graph resources have one.
- Using a personal account as the only owner of the Workflows flow.
- Posting every update of an issue as a new message, which floods the channel.
- Granting broader Graph permissions than ServiceHealth.Read.All.

## What the pages I read do not cover

They do not describe Graph change notifications for service health, supported OData filters on issues, or the authentication setup for an HTTP step in Power Automate. Verify those in the Graph and Power Automate documentation before you build.

## Related

- [Microsoft 365 admin center](https://www.m365.fm/entity/microsoft-365-admin-center/)
- [Microsoft Graph permissions](https://www.m365.fm/entity/microsoft-graph-permissions/)
- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Change notifications and webhooks](https://www.m365.fm/entity/change-notifications/)

## Sources

- [Microsoft Learn: How to check Microsoft 365 service health](https://learn.microsoft.com/en-us/microsoft-365/enterprise/view-service-health)
- [Microsoft Learn: Service communications API overview](https://learn.microsoft.com/en-us/graph/api/resources/service-communications-api-overview)
- [Microsoft Learn: List issues](https://learn.microsoft.com/en-us/graph/api/serviceannouncement-list-issues?view=graph-rest-1.0)
- [Microsoft Learn: Create incoming webhooks in Teams with Workflows](https://learn.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook)
- [Microsoft Learn: Webhooks and connectors in Teams](https://learn.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/what-are-webhooks-and-connectors)
