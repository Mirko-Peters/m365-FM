---
title: "Azure AD Graph Retirement: Migrate Apps to Microsoft Graph"
summary: "Azure AD Graph reached the end of extended access on 31 August 2025. Learn the documented timeline, the four-step migration checklist, what to compare, and where Learn does not say how to find affected apps."
status: review
publish: false
author: mirko-p
date: 2027-01-04
topics: [azure-ad-graph, graph]
keypoints:
  - "Per Learn, extended access ended on August 31, 2025 and Azure AD Graph is fully retired. Apps that still depend on it need migration."
  - "The documented timeline: 30 June 2023 notice ended, 31 August 2024 new apps blocked without opt-in, 1 February 2025 all apps needed opt-in."
  - "The migration checklist has four steps: review API differences, examine API use, review app details, then deploy, test and extend."
  - "Learn says that in many cases you can change only the endpoint, version and resource name in the code."
  - "The pages read do not explain how to find apps that still call Azure AD Graph, so that part needs other documentation."
faq:
  - q: "Is Azure AD Graph still available?"
    a: "Microsoft Learn describes 31 August 2025 as the end of extended access, when Azure AD Graph is fully retired. Today is after that date, so plan on the basis that apps depending on it need migration to Microsoft Graph."
  - q: "What happened on the earlier dates?"
    a: "Learn lists 31 August 2024, when new apps could not use Azure AD Graph unless they opted in for extended access, and 1 February 2025, when all new and existing apps had to opt in."
  - q: "What are the steps to migrate?"
    a: "The checklist on Learn: review API differences, examine API use, review app details such as app registration, consent, token acquisition and client libraries, then deploy, test and extend."
  - q: "Can I just change the endpoint?"
    a: "Learn says that in many cases you can update only the endpoint, version and resource name in your code. Differences in properties, methods and permissions still need review."
  - q: "How do I find which of my apps use Azure AD Graph?"
    a: "The Learn pages read for this guide do not describe the steps, such as Entra recommendations or sign-in log filters. The page on examining API use only says to catalog the APIs your app calls and compare them with the known differences."
---

Azure AD Graph is retired. Microsoft Learn gives 31 August 2025 as the end of extended access. If an app still calls it, plan the move to Microsoft Graph. This guide covers the documented timeline, the migration checklist and the comparison areas. It also says plainly that the Learn pages read do not explain how to find the affected apps.

## Timeline from Learn

| Date | What it means |
| --- | --- |
| 2019 | Deprecation announced. Retirement was first set for 30 June 2023 |
| 30 June 2023 | The three-year notice period ended and Azure AD Graph entered its retirement cycle |
| 31 August 2024 | New apps created after this date cannot use Azure AD Graph unless they explicitly opt in for extended access. Existing apps continued to work |
| 1 February 2025 | All new and existing apps had to opt in for extended access, including apps created before 31 August 2024 |
| 31 August 2025 | End of extended access. Azure AD Graph is fully retired |

Learn also says Azure AD Graph receives no further investment and no SLA or maintenance commitment beyond security-related fixes. New features go only to Microsoft Graph. For the latest announcement, Learn points to a Tech Community post.

## Why Microsoft Graph

Learn states that Microsoft Graph has the capabilities of Azure AD Graph plus newer APIs, and that all new functionality is available only there. The page names these examples:

- Microsoft 365 group management
- External user invitations
- Restore of deleted users, groups, applications and service principals
- Webhook notifications on users and groups
- Group-based licensing
- Identity governance, such as PIM, access reviews and terms of use
- Security features, such as identity risk events and risky users

## The migration checklist

Learn publishes a checklist with four items.

1. **Review API differences.** Check request call syntax, feature differences such as directory extensions, batching and differential queries, entity resource names and types, properties of request and response objects, methods including parameters and types, and permissions.
2. **Examine API use.** Audit the APIs your app calls and the permissions they need. Compare them with the known differences. For production, confirm that the required APIs are generally available in Microsoft Graph v1.0 and whether they behave the same way as in Azure AD Graph.
3. **Review app details.** Look at app registration and consent changes, token acquisition and authentication libraries, and client libraries for .NET apps.
4. **Deploy, test and extend.** Test thoroughly and stage the rollout to your customers. Switching also opens more datasets and features.

## Practical points from the pages

- In many cases you can update only the endpoint, the version and the resource name in your code.
- Use Graph Explorer at `https://aka.ms/ge` to experiment. For realistic results, sign in as a test user in a test tenant.
- The checklist links to separate pages on request call syntax, feature differences, resource types, properties, methods and permissions.
- Learn names Microsoft Q&A with the tag `azure-ad-graph-deprecation` for questions.

## The gap: finding affected apps

The overview page and the checklist page do not describe how to find apps that use Azure AD Graph. They do not mention Microsoft Entra recommendations, and they give no sign-in log filters or queries. The page on examining API use says to list the Azure AD Graph APIs your app currently calls and compare the list with the known differences. It gives no discovery procedure either.

If you do not own the code, start from your app inventory and ask each owner to run the audit step. For tenant-level discovery, check the current Microsoft Entra documentation. Do not rely on filter syntax from memory.

## A migration plan

The plan below applies the Learn checklist. The ordering is practical advice.

1. List apps and scripts that could depend on Azure AD Graph, including older automation and third-party tools.
2. For each, catalog the APIs and permissions in use.
3. Map each call to its Microsoft Graph equivalent using the differences pages.
4. Change the endpoint, version and resource name where that is enough. Handle property, method and permission differences separately.
5. Review app registrations, consent and token libraries.
6. Test in a test tenant with Graph Explorer or your own test harness.
7. Roll out in stages and watch for failed calls.

## Typical mistakes

- Assuming the endpoint swap alone is enough when permissions differ.
- Testing only in production data.
- Forgetting client libraries and authentication libraries.
- Treating a third-party tool as someone else's problem without asking the vendor.

## Related

- [Azure AD Graph](https://www.m365.fm/entity/azure-ad-graph/)
- [Microsoft Graph](https://www.m365.fm/entity/graph/)
- [Microsoft Graph permissions](https://www.m365.fm/entity/microsoft-graph-permissions/)
- [Graph Explorer](https://www.m365.fm/entity/graph-explorer/)

## Sources

- [Migrate your apps from Azure Active Directory (Azure AD) Graph to Microsoft Graph (Microsoft Learn)](https://learn.microsoft.com/graph/migrate-azure-ad-graph-overview)
- [Azure AD Graph app migration planning checklist (Microsoft Learn)](https://learn.microsoft.com/graph/migrate-azure-ad-graph-planning-checklist)
- [Examine Azure AD Graph API use (Microsoft Learn)](https://learn.microsoft.com/graph/migrate-azure-ad-graph-audit-api-use)
