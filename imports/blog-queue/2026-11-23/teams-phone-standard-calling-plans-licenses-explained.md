---
title: "Teams Phone Licenses Explained: Teams Phone Standard, Calling Plans and PSTN Options"
summary: "What Teams Phone Standard is, how it differs from Teams Phone with Calling Plan, when you need a Calling Plan, Operator Connect or Direct Routing, and how to assign the licenses in the admin center."
status: review
publish: false
author: mirko-p
date: 2026-11-23
topics: [teams-phone, teams-calling-plans, pstn, microsoft-365-admin-center]
keypoints:
  - "Teams Phone needs two parts: a Teams Phone license per user or resource account, and at least one PSTN solution for external numbers."
  - "Teams Phone Standard is the add-on license with the PBX features. It does not give you phone numbers or carrier minutes by itself."
  - "A Calling Plan makes Microsoft the carrier. Buy it as the Teams Phone with Calling Plan bundle, or as Teams Phone Standard plus a separate Calling Plan."
  - "Operator Connect and Direct Routing need a Teams Phone license too. For on-premises PSTN, assign Teams Phone Standard only and no Calling Plan license."
  - "Microsoft 365 E5 does not connect users to the PSTN. You still need Calling Plans, Direct Routing or Operator Connect."
faq:
  - q: "What is Teams Phone Standard?"
    a: "According to Microsoft Learn it is an add-on license that provides a hosted PBX: cloud voicemail, call forwarding, call transfer, auto attendants, call queues and caller ID. Teams Phone alone needs only this license, but external calling also requires a PSTN connectivity option."
  - q: "What is the difference between Teams Phone Standard and Teams Phone with Calling Plan?"
    a: "Learn lists them as different licenses. Teams Phone with Calling Plan is a bundle that adds Microsoft as the PSTN carrier. Teams Phone Standard has no carrier part, so you connect through a Calling Plan you buy separately, Operator Connect or Direct Routing."
  - q: "Do I need a Calling Plan if I already have Microsoft 365 E5?"
    a: "Yes, if you want Microsoft as your carrier. The Learn page on assigning Teams add-on licenses says assigning E5 does not connect users to the PSTN. You still need a PSTN option such as Calling Plans, Direct Routing or Operator Connect."
  - q: "What is the difference between Phone System and Teams Phone?"
    a: "The Learn pages I read use the name Teams Phone and do not use the term Phone System. The address of the Teams Phone overview page still contains the older name, which suggests it was the earlier name, but Microsoft's page does not state the rename."
  - q: "How long until the dial pad appears after I assign a Calling Plan license?"
    a: "Learn says it can take up to 24 hours for the dial pad to appear in the Teams client after a Calling Plan assignment. If it does not appear after that, check the dial pad configuration."
---

Teams Phone is licensed in layers. The **Teams Phone** license gives a user the calling features. A **PSTN solution** gives them real phone numbers and the ability to call outside the company. Microsoft Learn says Teams Phone requires both to make and receive domestic and international calls. Calls between Teams users in your organization are handled inside Teams and do not go to the PSTN.

Most confusion comes from the product names. This article sorts them out.

## The building blocks

| Name | What it is | What it does not include |
|---|---|---|
| Teams Phone Standard | Add-on license with PBX features: cloud voicemail, forwarding, transfer, auto attendants, call queues, caller ID | Phone numbers and carrier connectivity |
| Calling Plan | Add-on license where Microsoft is the PSTN carrier | The Teams Phone features, unless bought as the bundle |
| Teams Phone with Calling Plan | Bundle of Teams Phone and a Calling Plan | Nothing extra to buy for domestic or international calling, depending on the plan |
| Operator Connect | Your carrier from Microsoft's Operator Connect program manages PSTN calling | The Teams Phone license, which you still need |
| Direct Routing | A customer-provided Session Border Controller connects your telephony to Teams | The Teams Phone license, which you still need |

Learn also lists Teams Phone Mobile, Operator Connect for India and Shared Calling as separate PSTN options. Shared Calling uses the number of a resource account linked to an auto attendant.

The Teams Phone Standard license also covers a variant for Frontline Workers. Learn says it can be used when the tenant also has Frontline Worker licenses.

The product part names differ. Learn gives `MCOEV` for Teams Phone Standard and `MCOTEAMS_ESSENTIALS` for Teams Phone with Calling Plan. They are different licenses.

## A note on "Phone System"

Older articles and admin screens used the name Phone System. The Learn pages used for this article call the product Teams Phone and the license Teams Phone Standard, and they do not use the older term or describe a rename. Treat the two as the same family when you read older material, but check your tenant's license list for the exact SKU.

## Choose the PSTN option

Learn calls Calling Plans the simplest option for external calling. If your carrier is not Microsoft or Calling Plans are not available in your country, use another option.

- **Calling Plans.** Choose when you want one vendor and your country is supported. Availability depends on the country or region, and the country is based on the user's license location in **Active users**, not the billing address.
- **Operator Connect.** Choose when your existing carrier is in the program and you want it to manage the calling.
- **Direct Routing.** Choose when you must keep your own SBC or carrier contracts. For on-premises PSTN connectivity, Learn says to assign only a Teams Phone Standard license and no Calling Plan license.

## Calling Plan types

| Plan | Domestic calls | International calls | Outgoing minutes |
|---|---|---|---|
| Domestic | Yes | No | Included based on license |
| International | Yes | Yes, 196 countries | Domestic and international minutes included |
| Pay-As-You-Go | Yes | Yes, 196 countries | None included; charged by usage |

All plans include unlimited incoming minutes. Users in the same country with the same plan share a minute pool. Pooling applies only to identical plans. Learn gives the example of 100 US users with a Domestic plan sharing 300,000 minutes. Usage beyond the pool is billed per minute.

Pay-As-You-Go must be funded before users can make outgoing calls. Learn also notes that a Know Your Customer review may be needed before you acquire or port numbers, and that such reviews usually finish within three business days.

## Which base plans qualify

Learn's add-on licensing page lists the Microsoft 365 and Teams plans that can take Teams Phone, including Teams Essentials, Microsoft 365 Business Basic, Standard and Premium, E1, E3, Frontline F1 and F3, and some education and government plans. A separate PSTN option also works with Microsoft 365 E5 without Teams. The page does not state a base license requirement on the assignment page itself, so check the add-on licensing article for your plan.

## How to assign the licenses

Learn's general guidance for add-on licenses:

1. Sign in to the Microsoft 365 admin center as a user management admin.
2. Go to **Billing** > **Licenses** to assign to up to 20 users at a time, or **Users** > **Active users** for up to 40 at a time.
3. For hundreds or thousands of users, use PowerShell or group-based licensing in Microsoft Entra ID.
4. For Calling Plans, assign the Calling Plan license, then obtain numbers and assign them to users.

If you have not bought enough Calling Plan licenses, the assignment fails with an error. Buy more and retry.

## Common mistakes

- Buying Teams Phone Standard and expecting to call outside numbers with no PSTN option.
- Assuming Microsoft 365 E5 connects users to the PSTN.
- Assigning a Calling Plan license in a Direct Routing setup.
- Choosing a plan by billing address when the license location decides availability.
- Giving up too early when the dial pad is missing. Wait up to 24 hours first.

## Related

- [Teams Phone](https://www.m365.fm/entity/teams-phone/)
- [Teams Calling Plans](https://www.m365.fm/entity/teams-calling-plans/)
- [Direct Routing](https://www.m365.fm/entity/direct-routing/)
- [Operator Connect](https://www.m365.fm/entity/operator-connect/)

## Sources

- [Teams add-on licensing overview (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoftteams/teams-add-on-licensing/microsoft-teams-add-on-licensing)
- [Assign Teams add-on licenses (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoftteams/teams-add-on-licensing/assign-teams-add-on-licenses)
- [What is Teams Phone (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoftteams/what-is-phone-system-in-office-365)
- [Calling Plans for Microsoft Teams (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoftteams/calling-plans-for-office-365)
