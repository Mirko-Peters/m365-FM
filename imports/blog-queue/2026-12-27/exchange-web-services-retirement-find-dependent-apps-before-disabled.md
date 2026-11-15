---
title: "Exchange Web Services Retirement in Exchange Online: Find Dependent Apps Before EWS Is Disabled"
summary: "EWS disablement in Exchange Online starts in October 2026 and is complete in April 2027, per Microsoft Learn. See the timeline, the tools to find apps that use EWS, the Graph parity roadmap and what is not planned, plus what the page does not say."
status: review
publish: false
author: mirko-p
date: 2026-12-27
topics: [exchange-online, exchange-web-services]
keypoints:
  - "Learn lists October 2026 as the start of EWS being disabled globally for all organizations and April 2027 as the date EWS is fully disabled. It gives no day in either month."
  - "Find dependent apps with the EWS usage reports in the Microsoft 365 admin center, the EWS usage reporting tool and the EWS Analyzer for code."
  - "Generic public folder CRUD, generic Microsoft 365 Group mailbox CRUD and discovery mailbox access are not planned for Microsoft Graph."
  - "If an EWS capability is not in the parity roadmap table, do not plan on a Graph or Exchange Admin API equivalent before EWS is fully disabled."
  - "The page does not cover an allow list, ApplicationImpersonation, the EWSEnabled property or cmdlets, or what errors look like on each date."
faq:
  - q: "When is EWS disabled in Exchange Online?"
    a: "According to Microsoft Learn, EWS starts to be disabled globally for all organizations in October 2026 and is fully disabled in April 2027. The page gives no day within either month and links to an end-game page for the full process."
  - q: "How do I find which apps use EWS?"
    a: "Learn names EWS usage reports in the Microsoft 365 admin center, an EWS usage reporting tool, the EWS Analyzer for code analysis and a separate article on identifying third-party apps. The Baseline Security Mode settings page lists EWS requirements for Microsoft products."
  - q: "What will not get a Graph equivalent?"
    a: "Learn lists generic public folder CRUD, generic Microsoft 365 Group mailbox CRUD, for which it says to use Graph group conversations, threads and posts, and discovery mailbox access, for which it says to use Microsoft Purview eDiscovery APIs."
  - q: "Can I disable EWS myself earlier?"
    a: "The page says admins can manually disable EWS at the organization and user levels and links to a page for how. It names no specific settings or cmdlets."
  - q: "Should I wait for all Graph gaps to close?"
    a: "No. Learn says not to wait for all parity gaps to be closed. Investigate your EWS footprint, prioritize with security and executive teams, migrate what you can now and work with vendors."
---

Microsoft is turning off Exchange Web Services (EWS) in Exchange Online. Learn's retirement page lists disablement starting in October 2026 and EWS fully disabled in April 2027. The start month is already behind us as of mid-November 2026. The page opens with a banner for organizations whose EWS applications have stopped working, and it points to a Tech Community blog post for the latest timeline and disablement process. This article summarizes the timeline, the tools to find dependent apps and the Graph roadmap on that page, and it says plainly what the page leaves out.

## Timeline from the page

| When | What the page says |
| --- | --- |
| July 2018 | EWS deprecation announced |
| 2023 | EWS disablement date set to 10/2026 |
| January 2024 | The Midnight Blizzard security incident elevated the urgency of the deprecation effort |
| October 2026 | EWS starts to be disabled globally for all organizations |
| April 2027 | EWS is fully disabled |

The page gives no day within October 2026 or April 2027, and it links to an end-game page for the full process. It does not describe exactly what breaks on each date.

## Find apps that depend on EWS

- **EWS usage reports** in the Microsoft 365 admin center, with a direct link to the weekly usage report and a separate documentation page.
- **EWS usage reporting tool**, linked from the page.
- **EWS Analyzer** for code analysis.
- **Third-party apps:** the page links to an article on how to learn whether your third-party applications use EWS.
- **Microsoft products:** the Baseline Security Mode settings page lists EWS requirements.

The page does not describe message tracing or audit logs as ways to find EWS usage.

## Graph parity roadmap

The page says the roadmap is estimated and subject to change, and that if an EWS capability is not listed, you should not plan on a Graph or Exchange Admin API equivalent before EWS is fully disabled. The Q3 CY2026 targets are already past and the page still lists them with those ETAs, so check availability yourself before relying on them (my advice).

- **Q3 CY2026:** Notes (`IPM.StickyNote`), Contact Lists, additional contact properties.
- **Q4 CY2026:** import and export for archive, public folder and group mailboxes, in-place archive generic CRUD, the Exchange Admin API, sovereign cloud availability, Report Message, non-draft MIME update and creation, user configuration objects and Mark All Items As Read.

### Not planned for Graph

Plan migrations without a Graph equivalent for these:

- Generic public folder CRUD.
- Generic Microsoft 365 Group mailbox CRUD. Use Graph group conversations, threads and posts instead.
- Discovery mailbox access. Use Microsoft Purview eDiscovery APIs.

## Migration help on the page

The page links to direct mappings between EWS operations and Graph APIs, a migration series, an AI-assisted refactoring tutorial and low-code options with Power Platform or a Copilot agent. Its call to action says not to wait for all parity gaps to be closed.

## Disablement controls

Admins can manually disable EWS at the organization and user levels, and the page links to instructions. It names no settings or cmdlets, so follow the linked page.

## What the page asks you to do

The call to action on the page has four parts. First, investigate your EWS footprint. Second, prioritize with security and executive teams. Third, migrate what you can now. Fourth, work with vendors. The page frames this as urgent because the January 2024 Midnight Blizzard incident raised the urgency of the deprecation effort.

## Reading the roadmap table

The roadmap lists capabilities by estimated quarter, and the page says the estimates are subject to change. Treat a Q4 CY2026 item as a planned capability, not a delivered one, and do not make a migration depend on it until you see it available. For items that are not in the table, the page only says not to plan on an equivalent before EWS is fully disabled. My reading: treat them with the same caution as the not-planned list, although only the not-planned list is a confirmed no.

## Microsoft products and the admin center

For Microsoft products, the page points to the Baseline Security Mode settings page for EWS requirements. For your own tenant, the weekly EWS usage report in the Microsoft 365 admin center is the first place the page sends you, so start there before you run code analysis.

## A plan before the dates

This plan is my advice, built from the page, not a Microsoft procedure.

1. Pull the EWS usage report and list every app and vendor that appears.
2. Run the EWS Analyzer on code you own.
3. Compare each needed capability with the roadmap and the not-planned list.
4. Migrate what has a Graph equivalent now, and contact vendors about the rest.
5. Re-check the Learn page for date changes before you finalize your schedule.

## Not covered

The page does not describe an allow list, ApplicationImpersonation, any exemption or exception process, the `EWSEnabled` property or `Set-OrganizationConfig`, the error responses after disablement, or whether any roadmap date will hold. It links to a separate section about HTTP 403 responses in the EWS access control article.

## Related

- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Exchange Web Services](https://www.m365.fm/entity/exchange-web-services/)

## Sources

- [Deprecation of Exchange Web Services in Exchange Online (Microsoft Learn)](https://learn.microsoft.com/exchange/clients-and-mobile-in-exchange-online/deprecation-of-ews-exchange-online)
