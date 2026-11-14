---
title: "Does Teams Come With Office 365 and Microsoft 365? What Is Included Today"
summary: "Is Microsoft Teams included in Office 365 or Microsoft 365? It depends on the plan and purchase date. Learn how the no-Teams enterprise suites, business suites and Teams Essentials work, and how admins manage the Teams license."
status: review
publish: false
author: mirko-p
date: 2026-11-29
topics: [teams, microsoft-365, microsoft-365-admin-center]
keypoints:
  - "Teams can be licensed as part of qualifying Microsoft 365 offerings or as a standalone SKU. Whether your plan has it depends on the plan and when you bought it."
  - "Since April 1, 2024, new Enterprise customers buy an E1, E3 or E5 (no Teams) suite plus a Teams standalone SKU. In the EEA and Switzerland this started October 1, 2023."
  - "Customers who subscribed to Teams-inclusive suites before April 1, 2024 can keep using, renewing and adjusting them."
  - "Microsoft 365 Business suites (up to 300 users) and Frontline suites are available both with and without Teams."
  - "Each user needs a Teams license, except for joining meetings anonymously. Removing it disables Teams for that user, which takes about 24 hours."
faq:
  - q: "Is Microsoft Teams included in Microsoft 365?"
    a: "Sometimes. Microsoft Learn says Teams can be licensed as part of qualifying Microsoft 365 offerings or as a standalone SKU. Business suites and Frontline suites come with and without Teams, and new Enterprise customers buy Teams separately."
  - q: "Does Office 365 E3 include Teams?"
    a: "Microsoft Learn says that Microsoft 365 E3 and E5 and Office 365 E1, E3 and E5 suites that include Teams are no longer available to new customers. Customers who subscribed before April 1, 2024 can continue to renew and adjust those suites."
  - q: "What is Teams Essentials?"
    a: "Microsoft Learn describes Teams Essentials as a standalone Teams subscription with meetings, chat and collaboration for small businesses. The pages I read do not go further than that description."
  - q: "How do I remove Teams from a user?"
    a: "Per Microsoft Learn, remove the Teams license on the Licenses page or the Active users page in the Microsoft 365 admin center. Teams is then disabled for that user, who no longer sees it in the app launcher, and the change takes about 24 hours."
  - q: "Can someone join a Teams meeting without a license?"
    a: "Yes, as an anonymous participant. Microsoft Learn says that, except for joining Teams meetings anonymously, each user in your organization must have a Teams license before they can use Teams."
---

Whether Teams comes with Office 365 or Microsoft 365 depends on the plan and on when the subscription started. Teams can be licensed as part of qualifying Microsoft 365 offerings or as a standalone product. Older enterprise suites include it. New enterprise purchases since April 1, 2024 do not. Business and Frontline suites exist in versions with and without Teams.

One caveat: the Microsoft Learn pages I read describe the licensing change but do not give a plan-by-plan table. For exact plan contents, Microsoft points to its Business and Enterprise plan comparisons.

## The short answer by customer type

| Situation | Is Teams included? |
|---|---|
| Enterprise customer who subscribed to a Teams-inclusive suite before April 1, 2024 | Yes. Microsoft says they can continue to use, renew, upgrade and adjust those subscriptions. |
| New Enterprise customer after April 1, 2024 | Buy an E1, E3 or E5 (no Teams) suite plus a Teams standalone SKU if you want both. |
| Enterprise customer in the EEA or Switzerland | The change took effect October 1, 2023. |
| Microsoft 365 Business suites (up to 300 users) | Available with and without Teams. |
| Frontline worker suites | Available with and without Teams. |
| Small business without a suite | Teams Essentials, a standalone Teams subscription. |

The Teams standalone SKUs named by Microsoft are Microsoft Teams Enterprise and Microsoft Teams EEA.

## What changed and when

Microsoft Learn states: starting April 1, 2024, all new Enterprise customers who want both Teams and the value in existing Microsoft 365 or Office 365 Enterprise suites (E1, E3, E5) need to purchase two SKUs. One is the E1, E3 or E5 (no Teams) suite. The other is Teams standalone.

A footnote on the Teams add-on licensing page adds that Microsoft 365 E3 and E5 and Office 365 E1, E3 and E5 suites that include Teams are no longer available for purchase by new customers. Office 365 F3 is available to new customers through Cloud Solution Providers only.

For Enterprise customers in the European Economic Area and Switzerland, the change was effective October 1, 2023. The page does not give a separate date for other regions beyond "all new Enterprise customers" from April 1, 2024.

## Why you may see "no Teams" in a SKU name

The add-on licensing page uses names such as "Microsoft 365 E3 (no Teams)" and "Office 365 E1/E3 (no Teams) plus Teams Enterprise". The same page lists EEA variants such as "Microsoft 365 E3 EEA (no Teams) plus Teams EEA". If you see "(no Teams)" in your licenses, the suite itself does not give users Teams, and a separate Teams SKU must be assigned.

## How to check what your users have

Microsoft's license management page describes where licenses are handled:

1. Sign in to the Microsoft 365 admin center. Managing licenses needs at least the User Management Administrator role.
2. Use the **Licenses** page to manage licenses for specific products (up to 20 users at a time), or the **Active users** page to manage licenses for specific users.
3. For many users, Microsoft recommends PowerShell or group-based licensing in Microsoft Entra ID.

The pages I read do not describe a way to tell a no-Teams suite apart other than the SKU name. Check the product names in your subscriptions.

## Remove or disable Teams

When you remove a Teams license from a user, Teams is disabled for that user, and they no longer see Teams in the app launcher or on the homepage. Microsoft says it takes about 24 hours for disabling a Teams SKU to take effect.

For plan-level control, Microsoft gives the service plan identifier `TEAMS1` (and `TEAMS_GOV` and `TEAMS_DOD` for government clouds). You can disable it for a licensing plan with `Set-MgUserLicense -DisabledPlans "TEAMS1"`. Microsoft warns that `Set-MgUserLicense` enables all services that were previously disabled unless your script names them. Services you want to keep disabled, such as Exchange or Sway, must be included.

## Do people without a license need Teams?

Mostly yes. Microsoft says, except for joining Teams meetings anonymously, each user must have a Teams license before using Teams. It recommends enabling Teams for all users so that teams can form organically for projects and other dynamic initiatives. For a pilot, it suggests keeping Teams enabled for all and targeting communications only to the pilot group.

## Common mistakes

- Assuming that "Office 365" and "Microsoft 365" always include Teams. New enterprise purchases since April 2024 do not.
- Assuming the Teams license is bundled with Audio Conferencing. The add-on licensing page says E1 and E3 buyers still need a separate Audio Conferencing license, and E5 includes it.
- Forgetting the 24-hour delay when removing a Teams license.
- Mixing up business and enterprise rules. The two-SKU rule applies to Enterprise customers. Business suites come both ways.

## A quick way to decide for your own tenant

1. List every subscription in the admin center and note whether the name contains "(no Teams)".
2. For each user group, check whether a Teams license or a Teams service plan is assigned. Microsoft says each user needs a Teams license before using Teams.
3. If Teams is missing for a group, check whether the group's suite is a no-Teams version and whether a Teams standalone SKU is assigned alongside it.
4. If a user has the license but still doesn't see Teams, allow time for licensing changes to apply. Microsoft names about 24 hours for disabling a Teams SKU, and the pages I read give no figure for enabling it.
5. Document the result so that renewals and new hires get the same setup.

## What changes for existing customers

Microsoft says enterprise customers already subscribed to suites that include Teams before April 1, 2024 can continue to use, renew, upgrade and otherwise adjust them as before. That means two tenants of the same size can have different answers to "does my suite include Teams", depending on when each one subscribed. If you are not sure when your subscription started, check your subscription records or ask your Microsoft partner.

## What the pages do not cover

The pages I read do not define a free Teams offering and do not describe what each Business plan includes. For those, use the Microsoft 365 Business plan comparison that Microsoft links from its Teams licensing page.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Microsoft 365](https://www.m365.fm/entity/microsoft-365/)
- [Microsoft 365 admin center](https://www.m365.fm/entity/microsoft-365-admin-center/)
- [Microsoft 365 E3](https://www.m365.fm/entity/microsoft-365-e3/)

## Sources

- [Manage Teams licenses, Microsoft Learn](https://learn.microsoft.com/en-us/microsoftteams/user-access)
- [Microsoft Teams add-on licensing, Microsoft Learn](https://learn.microsoft.com/en-us/microsoftteams/teams-add-on-licensing/microsoft-teams-add-on-licensing)
- [Microsoft Teams service description (licensing), Microsoft Learn](https://learn.microsoft.com/en-us/microsoftteams/office-365-licensing)
