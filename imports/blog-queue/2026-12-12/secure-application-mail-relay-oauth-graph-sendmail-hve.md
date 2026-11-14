---
title: "Secure Application Mail in Exchange Online: OAuth SMTP, Graph sendMail or High Volume Email"
summary: "Choose and secure a mail path for internal applications in Microsoft 365: OAuth with SMTP, Microsoft Graph sendMail with scoped mailbox access, or High Volume Email, with documented limits and throttling handling."
status: review
publish: false
author: mirko-p
date: 2026-12-12
topics: [exchange-online, oauth-2-0, microsoft-graph-permissions]
keypoints:
  - "Client SMTP submission is limited to 10,000 recipients per day and 30 messages per minute, so it does not suit high-volume applications."
  - "High Volume Email has no recipient or message rate limits, but sends only to internal recipients and is billed pay-as-you-go per delivered recipient."
  - "Graph sendMail needs the Mail.Send permission and returns 202 Accepted. Delivery is still subject to Exchange Online limits and throttling."
  - "RBAC for Applications in Exchange Online scopes Mail.Send to specific mailboxes. The organization-wide Entra grant must be removed, or scoping has no effect."
  - "Handle 429 responses by waiting for the Retry-After value and by reducing request frequency."
faq:
  - q: "What are the limits of client SMTP submission?"
    a: "Microsoft Learn lists 10,000 recipients per day and 30 messages per minute. The page also says Basic authentication for client SMTP submission is scheduled for deprecation and recommends OAuth. It does not give a retirement date in the text read."
  - q: "Which method suits high volume to internal recipients?"
    a: "Microsoft Learn recommends High Volume Email for internal-only high volume. It lists no recipient or message rate limits, up to 50 recipients and 10 MB per message, and internal recipients only. For internal and external recipients, the page recommends Azure Communication Services Email."
  - q: "How do I limit an app that uses Mail.Send to certain mailboxes?"
    a: "Use RBAC for Applications in Exchange Online. Microsoft Learn describes creating a service principal pointer, a management scope or administrative unit, and a role assignment for Application Mail.Send. It warns that an unscoped Mail.Send grant in Microsoft Entra ID cancels the scoping, so remove that grant."
  - q: "What should an application do when Graph returns 429?"
    a: "Microsoft Learn says to wait the number of seconds in the Retry-After header, then retry, and keep honoring the delay if 429 returns. Avoid immediate retries, because all requests count against usage limits. Without a header, use exponential backoff."
---

For an internal application that sends large volumes of mail, the choice is between three documented paths: SMTP with OAuth, Microsoft Graph `sendMail`, and High Volume Email (HVE). Each has different limits and security controls. This article compares them using Microsoft Learn and shows how to restrict what the application can do.

## Compare the paths

Microsoft's mail-sending options page describes SMTP-based methods. Its limits and the HVE page give this picture:

| Path | Limits documented | Recipients | Notes |
|---|---|---|---|
| Client SMTP submission (SMTP AUTH) | 10,000 recipients per day, 30 messages per minute | Internal and external | Needs a licensed mailbox. Saves to Sent Items. OAuth recommended |
| SMTP relay | Reasonable limits, no figures given | Internal and external | Uses an inbound connector, with a certificate or static IP |
| Direct Send | Standard anonymous throttling | Microsoft 365 recipients only | Legacy devices, last resort |
| High Volume Email | No recipient or message rate limits | Internal only | 50 recipients and 10 MB per message, up to 100 accounts |
| Graph `sendMail` | Subject to Exchange Online limits and throttling | Internal and external | Uses the Mail.Send permission |

Microsoft's recommendations: for internal-only high volume, use HVE. For internal and external recipients, use Azure Communication Services Email. The page also says Basic authentication for client SMTP submission is scheduled for deprecation, is incompatible with Security defaults in Microsoft Entra ID, and that OAuth is recommended. It does not give a date in the text read, so follow Microsoft's published timeline.

## Option A: SMTP with OAuth

For app-only access, Microsoft documents the client credentials flow:

1. In the app registration, add the **Office 365 Exchange Online** application permission **SMTP.SendAsApp** and grant admin consent.
2. Register the service principal in Exchange Online PowerShell with `New-ServicePrincipal -AppId <id> -ObjectId <object id>`. The Object ID must come from the **Enterprise application** page, not App registrations, or authentication fails.
3. Grant the service principal access to the sending mailbox with `Add-MailboxPermission -Identity <mailbox> -User <service principal ID> -AccessRights FullAccess`.
4. Request a token with the scope `https://outlook.office365.com/.default`.
5. Send `AUTH XOAUTH2` with the token in the SASL XOAUTH2 format.

Use `smtp.office365.com` on port 587 with TLS. With SendAs, grant SendAs to the sender. The page does not mention enabling SMTP AUTH per mailbox, which the mail-sending options page treats separately, so check that setting. The 10,000 recipient and 30 per minute limits still apply, which is the reason this path suits moderate volume only.

## Option B: Graph sendMail

The Graph call is `POST /users/{id | userPrincipalName}/sendMail`, with the `Mail.Send` permission, delegated or application. The body carries the `message` and an optional `saveToSentItems`, and MIME is accepted as a base64 string. A successful call returns `202 Accepted`, which means the request was accepted, not that delivery finished. Delivery stays subject to Exchange Online limits and throttling.

Application permission `Mail.Send` allows the app to send as any user. Restrict it.

### Scope the app to chosen mailboxes

Microsoft's RBAC for Applications in Exchange Online lets you grant the app access only to defined mailboxes:

1. Optionally create a scope, for example `New-ManagementScope -Name "App senders" -RecipientRestrictionFilter "CustomAttribute1 -eq 'appmail'"`, or use an administrative unit.
2. Create the service principal pointer with `New-ServicePrincipal`, again with IDs from Enterprise applications.
3. Assign the role: `New-ManagementRoleAssignment -App <ObjectID> -Role "Application Mail.Send" -CustomResourceScope "<scope name>"`.
4. Test with `Test-ServicePrincipalAuthorization -Identity <app> -Resource <mailbox>`.

Two warnings from the page. First, RBAC assignments add to Entra grants. If the app still holds an organization-wide `Mail.Send` grant in Microsoft Entra ID, there is no effective scoping, so remove that grant. Second, permission changes can take 30 minutes to 2 hours to propagate, and the test command bypasses the cache. RBAC for Applications replaces Application Access Policies and supports Microsoft Graph and EWS.

## Option C: High Volume Email

HVE uses dedicated accounts with no mailbox. Create them in the Exchange admin center under **Mail flow** > **High Volume Email** > **Add an HVE account**, or with `New-MailUser -HVEAccount`. Do not assign licenses. Settings: server `smtp.hve.mx.microsoft`, port 587, TLS required. OAuth is the recommended authentication. Basic works but is disabled if Security Defaults are on.

Each account needs a billing policy, because HVE uses pay-as-you-go billing through a linked Azure subscription. The page lists $0.000042 per delivered recipient, counted after distribution list expansion. HVE accounts cannot send externally or receive mail, so set a Reply-To for replies. The page was last updated on 2026-06-02, and it lists Microsoft 365 Worldwide only, with other clouds under evaluation.

## Handle throttling

Microsoft's guidance applies to Graph calls:

- Detect throttling with HTTP 429 and use the `Retry-After` header. Wait that many seconds, retry, and continue honoring the delay.
- Do not retry immediately, because every request counts against the limit.
- Without `Retry-After`, use exponential backoff. Microsoft's SDKs already include such handlers.
- Reduce calls per request and call frequency.
- In batches, each request is evaluated separately and failed ones are not retried automatically by the SDK.

The Outlook-specific numeric limits were not available in the pages read, so check the Graph service-specific limits page for the current figures before you size a design.

## Practical design

1. Pick HVE if everything stays internal and volume is high.
2. Pick Graph with scoped RBAC if you need Sent Items, external recipients or attachments.
3. Keep OAuth for any SMTP path, and avoid shared secrets in code. Prefer certificates or managed identities where your host supports them, which Microsoft's pages for this scenario do not detail.
4. Test with a small mailbox set, then raise volume while watching 429 responses.

## Related

- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [OAuth 2.0](https://www.m365.fm/entity/oauth-2-0/)
- [Microsoft Graph permissions](https://www.m365.fm/entity/microsoft-graph-permissions/)
- [Outlook](https://www.m365.fm/entity/outlook/)

## Sources

- [Microsoft Learn: Send email from a device or application with Microsoft 365](https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/how-to-set-up-a-multifunction-device-or-application-to-send-email-using-microsoft-365-or-office-365)
- [Microsoft Learn: Authenticate an SMTP application by using OAuth](https://learn.microsoft.com/en-us/exchange/client-developer/legacy-protocols/how-to-authenticate-an-imap-pop-smtp-application-by-using-oauth)
- [Microsoft Learn: High Volume Email for Microsoft 365](https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/high-volume-mails-m365)
- [Microsoft Learn: user: sendMail](https://learn.microsoft.com/en-us/graph/api/user-sendmail)
- [Microsoft Learn: RBAC for Applications in Exchange Online](https://learn.microsoft.com/en-us/exchange/permissions-exo/application-rbac)
- [Microsoft Learn: Microsoft Graph throttling guidance](https://learn.microsoft.com/en-us/graph/throttling)
