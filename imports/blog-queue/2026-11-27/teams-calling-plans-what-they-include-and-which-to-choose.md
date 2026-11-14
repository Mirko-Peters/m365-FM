---
title: "Teams Calling Plans: What the Plans Include and Which One to Choose"
summary: "Compare the Domestic, International and Pay-As-You-Go Calling Plans for Microsoft Teams Phone, learn how minute pooling and licensing work, and see when other PSTN options fit better."
status: review
publish: false
author: mirko-p
date: 2026-11-27
topics: [teams-phone, microsoft-365-admin-center, teams-admin-center]
keypoints:
  - "A Calling Plan provides PSTN connectivity for Teams Phone, so users can place and receive external phone calls. A Teams Phone license is required first."
  - "Three plans exist: Domestic (included minutes, no international), International (adds 196 countries) and Pay-As-You-Go (no included minutes)."
  - "Incoming minutes are unlimited on all three plans. Outgoing minutes depend on the plan and license purchased."
  - "Users in the same country on the same Calling Plan share a pool of minutes. Pooling works only on identical plans."
  - "A user's country is based on the location of the license, not the billing address."
  - "Where Calling Plans are not available, or more control is needed, Operator Connect, Teams Phone Mobile and Direct Routing are the other PSTN options."
faq:
  - q: "What is the difference between a Domestic and an International Calling Plan?"
    a: "According to Microsoft Learn, the Domestic Calling Plan lets users call numbers in the country where they are assigned and includes outgoing minutes. The International Calling Plan includes domestic and international minutes, and the international minutes cover calls to numbers in 196 countries."
  - q: "Do I need a Teams Phone license to buy a Calling Plan?"
    a: "Yes. Microsoft Learn says the Teams Phone add-on license must be purchased first, and a Calling Plan is bought afterwards. A bundle of Teams Phone and a Domestic or International Calling Plan is also offered."
  - q: "How do pooled minutes work?"
    a: "Microsoft Learn explains that all users in the same country with the same Calling Plan share a pool of minutes. In its example, 100 US users with 3,000 minutes each share a pool of 300,000 minutes, and calls beyond the pool are billed per minute."
  - q: "What happens if a Pay-As-You-Go plan is not funded?"
    a: "Microsoft Learn states that users cannot make outgoing calls until the plan is funded. Customers on a Microsoft Customer Agreement pay for the previous month's outgoing minutes, and customers on a Microsoft Online Subscription Agreement buy Communication Credits."
---

A Teams Calling Plan is the Microsoft-operated way to give Teams Phone users a phone number and external calling. Microsoft offers three plans: Domestic, International and Pay-As-You-Go. Pick Domestic if calls stay inside one country, International if staff call abroad regularly, and Pay-As-You-Go if outgoing call volume is low or varies. Every plan needs a Teams Phone license first.

## What a Calling Plan is

According to Microsoft Learn, Calling Plans provide PSTN connectivity for Teams Phone so users can make and receive external calls. Microsoft calls this the simplest option. Where Calling Plans are not available, other PSTN connectivity options exist (covered below).

## The three plans compared

| | Domestic | International | Pay-As-You-Go |
|---|---|---|---|
| Domestic calls | Yes | Yes | Yes |
| International calls | No | Yes, 196 countries | Yes, 196 countries |
| Outgoing minutes | Included, based on license | Included domestic and international, based on license | None included, charged by usage |
| Incoming minutes | Unlimited | Unlimited | Unlimited |
| Microsoft's suggested fit | Users calling within their country or region | Users who regularly call internationally | Low or variable outgoing volume |

Two details are worth knowing.

**Domestic plans come in two variants.** One is for organizations in the United States, Puerto Rico, the United Kingdom and Canada. The other is for organizations in a longer list of European and other countries, which Learn names one by one. Both can be assigned to end users in any market where Calling Plans are available. Mexico has its own Domestic Calling Plan, which has to be bought separately.

**Pay-As-You-Go has three options:** Zone 1 (United States and Puerto Rico, United Kingdom, Canada), Zone 2 (a list of countries mainly in Europe, plus Hong Kong SAR, New Zealand, Singapore and South Africa) and Mexico. The Mexico plan cannot be bought by US or Puerto Rico customers.

## How minutes and pooling work

Users in the same country with the same Calling Plan share a pool of minutes. Microsoft's example: 100 US users on a Domestic Calling Plan, each allocated 3,000 minutes, share 300,000 minutes. Calls beyond the pool are billed per minute. Pooling is only available on identical Calling Plans.

The Learn page does not list the monthly minutes per plan. It points to the country and region availability page for those numbers, so check there before you buy.

## Licensing and country rules

1. Buy the Teams Phone add-on license first. In the Microsoft 365 admin center: **Billing** > **Your products** > **Add more products** > **Add-ons**, select the Teams Phone add-on, then **Buy**. Depending on your plan you may need other add-ons first.
2. Buy a Calling Plan the same way, or buy a Teams Phone and Calling Plan bundle.
3. Assign the plans to users. Different users can have different plans.

A user's country comes from the location of the user's license. Check it in the Microsoft 365 admin center under **Active users**. The billing address under **Settings** > **Org Settings** > **Organization profile** does not decide it.

## Funding Pay-As-You-Go

Until the plan is funded, users cannot place outgoing calls. With a Microsoft Customer Agreement, you pay for the previous month's outgoing minutes after use. With a Microsoft Online Subscription Agreement, you buy Communication Credits to fund the plan.

## Set-up steps in order

Microsoft's setup article lists these steps:

1. Check country and region availability.
2. Complete Know Your Customer (KYC) if required. In the Teams admin center: **Voice** > **Service configuration** > **Know Your Customer** > **Add KYC information**. Wait for the status **Approved**. Most reviews finish within three business days.
3. Buy and assign licenses.
4. Get phone numbers: from the Teams admin center where available, by porting numbers from the current carrier, or through the request form (**Voice** > **Phone Numbers** > **Add** > **Get phone number support**).
5. Add emergency addresses. An emergency address must be associated with a phone number. In the United States this happens when you assign the number to the user.
6. Assign the emergency address and number to each user.
7. Tell users their number. It appears above the dial pad under **Calls** in Teams.

New users can take several hours to show up on the **Voice users** page.

## When a Calling Plan is not the right fit

Microsoft lists four PSTN connectivity options for Teams Phone:

- **Calling Plan:** Microsoft is the operator. Simplest deployment.
- **Operator Connect:** certified third-party landline operators. Requires a contract with the provider.
- **Teams Phone Mobile:** certified mobile operators, so one business number works in Teams and on the mobile SIM. User numbers only.
- **Direct Routing:** any PSTN operator, connected through a certified session border controller (SBC). Requires a provider and an SBC.

Options can be combined, for example by user group or region.

## Common mistakes

- Buying Calling Plans before Teams Phone licenses.
- Judging country availability by the billing address instead of the license location.
- Leaving a Pay-As-You-Go plan unfunded and wondering why calls fail.
- Skipping KYC before acquiring or porting numbers.
- Expecting pooling across different plans.

## What the documentation does not say

The Learn pages read for this article do not state prices. Pricing is on the Microsoft voice calling page that Learn links.

## Related

- [Teams Phone](https://www.m365.fm/entity/teams-phone/)
- [Microsoft 365 admin center](https://www.m365.fm/entity/microsoft-365-admin-center/)
- [Teams admin center](https://www.m365.fm/entity/teams-admin-center/)

## Sources

- [Microsoft Teams Calling Plans](https://learn.microsoft.com/MicrosoftTeams/calling-plan-landing-page)
- [Calling Plans for Microsoft 365](https://learn.microsoft.com/en-us/microsoftteams/calling-plans-for-office-365)
- [Set up Calling Plans](https://learn.microsoft.com/en-us/microsoftteams/set-up-calling-plans)
- [PSTN connectivity options for Teams Phone](https://learn.microsoft.com/en-us/microsoftteams/pstn-connectivity)
