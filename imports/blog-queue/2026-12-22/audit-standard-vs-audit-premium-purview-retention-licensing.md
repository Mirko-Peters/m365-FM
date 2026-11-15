---
title: "Audit Standard vs Audit Premium in Microsoft Purview: Retention, Events and Licensing"
summary: "Compare Microsoft Purview Audit (Standard) and Audit (Premium): retention periods, the 10-year add-on, audit retention policies, extra events, API bandwidth, and what the Learn page does not say about licensing."
status: review
publish: false
author: mirko-p
date: 2026-12-22
topics: [microsoft-purview-audit]
keypoints:
  - "Audit Standard keeps records for 180 days. Audit Premium adds up to one year of retention, a 10-year option, audit log retention policies and intelligent insights."
  - "Premium keeps Entra ID, Exchange, OneDrive and SharePoint records for one year by default. Other records stay at 180 days unless a policy extends them."
  - "Ten-year retention needs Audit Premium licensing plus an additional per-user 10-Year Audit Log Retention add-on license, and is not retroactive."
  - "Premium gives access to extra activity properties, such as MailItemsAccessed SensitivityLabel and 14 Teams activities, plus about twice the API bandwidth."
  - "The Learn page links to subscription requirements instead of naming SKUs, so verify licensing there before you buy."
faq:
  - q: "How long does Audit Standard keep records?"
    a: "Microsoft Learn says 180 days. The page adds that Standard logs generated before October 17, 2023 are retained for 90 days, and logs generated on or after that date follow the 180-day default."
  - q: "What retention does Audit Premium add?"
    a: "Learn lists up to one-year retention, 10-year retention, and audit log retention policies. Premium keeps Microsoft Entra ID, Exchange, OneDrive and SharePoint records for one year by default."
  - q: "What do I need for 10-year retention?"
    a: "Learn says retaining logs for 10 years requires Audit Premium licensing and an additional per-user 10-Year Audit Log Retention add-on license. The policy is not retroactive, and records from non-user entities are kept for a fixed one year."
  - q: "What extra detail does Premium provide?"
    a: "Learn says Premium provides access to extra activity properties: the SensitivityLabel property on the Exchange Online MailItemsAccessed activity, and properties such as AppAccessContext, ParticipantInfo, IsJoinedFromLobby and ArtifactShared on 14 Microsoft Teams activities. Premium also provides intelligent insights such as when and what a user searched for."
  - q: "Does Premium include everything in Standard?"
    a: "Yes. Learn states that Audit (Premium) includes all Audit (Standard) functionality, including search in the Microsoft Purview portal, CSV export, the Audit Search Graph API, Search-UnifiedAuditLog and the Office 365 Management Activity API."
---

Both Audit editions record activity in Microsoft 365 and let you search it. The differences are how long records last, how much extra detail is captured, and how you control retention. This comparison follows the Microsoft Purview audit solutions overview.

## Side-by-side

Learn's comparison table lists these capabilities:

| Capability | Standard | Premium |
| --- | --- | --- |
| Enabled by default | Yes | Yes |
| Thousands of searchable audit events | Yes | Yes |
| Audit search tool in the Purview portal | Yes | Yes |
| Audit Search Graph API | Yes | Yes |
| Search-UnifiedAuditLog cmdlet | Yes | Yes |
| Export audit records to CSV | Yes | Yes |
| Office 365 Management Activity API | Yes | Yes |
| 180-day retention | Yes | Yes |
| Up to 1-year retention | No | Yes |
| 10-year retention | No | Yes |
| Audit log retention policies | No | Yes |
| Intelligent insights | No | Yes |

Premium includes all Standard functionality.

## Retention

**Standard.** Records are kept for 180 days. Learn adds a date note: logs generated before October 17, 2023 were retained for 90 days, and logs generated on or after that date follow the 180-day default.

**Premium.** Records for Microsoft Entra ID, Exchange, OneDrive and SharePoint are kept for one year by default. Other records stay at 180 days unless you create a retention policy that extends them.

**Retention policies.** In Premium you can create policies by service, specific activity or user, with retention up to one year, or up to 10 years with the add-on. Custom policies take precedence over the default policy.

**Ten years.** Learn says retaining logs for 10 years needs Audit Premium licensing plus an additional per-user 10-Year Audit Log Retention add-on license. The policy is not retroactive. Records from non-user entities, such as service principals, system events and application activities, are kept for a fixed one year that you cannot change.

## Extra events and insights

Learn says Premium provides access to the following activity properties and insights (these activities need users to hold the appropriate Audit (Premium) license):

- **Exchange Online:** the SensitivityLabel property on the MailItemsAccessed activity.
- **Microsoft Teams:** 14 listed activities, such as ChatCreated, MessageSent and MeetingParticipantDetail, with properties like AppAccessContext, ParticipantInfo, IsJoinedFromLobby and ArtifactShared.
- **Intelligent insights:** records such as the sensitivity label of accessed mail items and when and what a user searched for in Exchange Online and SharePoint Online.

The overview describes these as activity properties and insights. It does not name Send or SearchQueries as Premium-only events. Use only what it states, and check the audit activities reference for a specific event before you plan an investigation around it (my advice).

## API bandwidth

Both editions start at a baseline of 2,000 requests per minute for the Office 365 Management Activity API. Learn says the baseline rises with seat count and licensing, so Premium gets about twice the bandwidth of Standard, and the limit is applied per tenant rather than per publisher. E5, A5 and G5 organizations get about twice the bandwidth of organizations without those licenses.

## Licensing

The overview gives the licensing detail only by link to its subscription requirements page. It names the 10-Year Audit Log Retention add-on as a separate per-user license for 10-year retention. The page I read does not list which plans include Audit (Premium). Verify the current plan list on the linked requirements page before you change licenses.

## Which one fits (my summary)

| Need | Edition |
| --- | --- |
| Search the last 180 days and export to CSV | Standard |
| One year of Entra ID, Exchange, OneDrive and SharePoint records | Premium |
| Different retention by service, activity or user | Premium |
| Seeing mail access and search activity for investigations | Premium |
| Records for 10 years | Premium plus the add-on |

## Search change worth knowing

Learn notes that Classic Search was retired on November 30, 2023, and New Search is the current experience.

## Practical steps (my advice)

1. Decide your retention requirement in writing, including whether any records must last beyond a year.
2. Check which users need Premium licensing under the subscription requirements page.
3. If you need more than 180 days, create audit retention policies and review how they interact with the default policy.
4. Treat 10-year retention as a planned license purchase, since it is not retroactive.
5. For investigations, confirm the specific events you rely on are listed for your edition before an incident.

## Related

- [Microsoft Purview Audit](https://www.m365.fm/entity/microsoft-purview-audit/)

## Sources

- [Learn about auditing solutions in Microsoft Purview (Microsoft Learn)](https://learn.microsoft.com/purview/audit-solutions-overview)
