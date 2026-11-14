---
title: "Use the Conditional Access What If Tool to Find Out Why a Policy Applied or Not"
summary: "Use the Conditional Access What If tool in Microsoft Entra to simulate a sign-in: portal path, required inputs, how to read policies that apply and do not apply, caveats about dependencies and parameters, and gaps."
status: review
publish: false
author: mirko-p
date: 2027-01-07
topics: [conditional-access, entra-id]
keypoints:
  - "Open it at Entra ID > Conditional Access > Policies > What If. It simulates a sign-in for a user, agent identity (preview) or single tenant service principal."
  - "Identity, target resource, device platform and client app are required. Other conditions are optional and default to none."
  - "The results list policies that apply with their grant and session controls, and policies that do not apply with the first condition that was not satisfied."
  - "Only policies that are enabled or in report-only mode are evaluated. Service dependencies, such as Exchange Online for a Teams test, are not considered."
  - "Learn says the API expects all sign-in parameters. If details for a policy's conditions are missing, it cannot evaluate them, and results can differ from the legacy tool."
faq:
  - q: "Where is the What If tool?"
    a: "In the Microsoft Entra admin center go to Entra ID > Conditional Access > Policies > What If."
  - q: "What inputs are required?"
    a: "Learn lists identity, target resource, device platform and client app as required. All other conditions are optional and default to none. The page's example adds Location and Sign-in risk."
  - q: "How does it explain a policy that did not apply?"
    a: "Each policy that does not apply is listed with a reason. The reason is the first condition that was not satisfied."
  - q: "What does it not test?"
    a: "It does not test Conditional Access service dependencies. For example, a Teams test does not consider policies for Exchange Online. Only enabled and report-only policies are evaluated."
  - q: "Why did my result change compared with the old tool?"
    a: "Learn says results differ from the legacy What If evaluation when sign-in details are missing. The new API reports Does not apply where the legacy tool said Applies. With all parameters supplied, both report Applies."
---

The What If tool answers a narrow question: for this identity, this resource and these conditions, which Conditional Access policies would apply, and why did the others not? It simulates a sign-in without anyone signing in. This guide follows the Microsoft Learn page The Conditional Access What If tool.

## What it does

The tool simulates a sign-in for a user, an agent identity (preview) or a single tenant service principal. It estimates which policies apply and produces a report, so you can troubleshoot and test complex scenarios without real sign-ins. It is powered by the What If Evaluation API, which Learn names as conditionalAccessRoot-evaluate in Microsoft Graph.

Open it in the Microsoft Entra admin center: **Entra ID** > **Conditional Access** > **Policies** > **What If**.

## Inputs

- The identity: a user, an agent identity (preview) or a single tenant service principal.
- The target: cloud apps, a user action, or sensitive data protected by authentication context.
- The sign-in conditions.

Required conditions are identity, target resource, device platform and client app. Every other condition is optional and defaults to none. The page's example uses Location and Sign-in risk. For an application, enter the App ID. Groups such as Office 365 or Microsoft Admin Portals do not match.

The page does not name every possible condition, so check the policy-building article for the full list.

## Reading the results

- An indicator shows whether classic policies exist in the environment.
- **Policies that apply** show the grant and session controls that must be satisfied.
- **Policies that don't apply** show a reason. The reason is the first condition that was not satisfied.
- **Has filter** shows whether the policy has app filters that use custom security attributes.

This reason is the answer to why a policy did not apply. For deeper detail on a policy, Learn points to per-policy reporting and the Conditional Access insights and reporting workbook.

## Caveats

- The tool does not test Conditional Access service dependencies. A Teams test does not consider Exchange Online policies.
- Only policies that are enabled or in report-only mode are evaluated.
- The What If API expects all sign-in parameters to be defined for the most accurate results. If your tenant has policies with specific conditions and you do not provide the sign-in details for them, the API cannot evaluate those conditions. The Conditions section of the same page says optional conditions are assumed to be none when you give no value, so the two statements pull in different directions. Supply every value you know.
- Results differ from the legacy What If evaluation. In Learn's example, a policy targets all users, Office 365, United States and high sign-in risk. With only three of the four values provided, the legacy tool said Applies and the new API said Does not apply. With all four, both said Applies.

## The page's worked example

Learn uses one policy to show why complete inputs matter. The policy applies to all users, targets Office 365, applies to the United States and applies to high sign-in risk. Four inputs can match it: identity, target app, location and sign-in risk.

- With only the first three inputs (and also with fewer), the legacy tool reported that the policy applies and the new evaluation reported that it does not apply. The page does not explain the reason beyond saying the API cannot evaluate conditions for which no sign-in details are provided.
- With all four inputs, both tools reported that the policy applies.

My reading: a Does not apply result can mean the condition was not met or was not supplied. Check which one before you decide the policy is wrong.

## What the page does not say

- Required roles or Microsoft Graph permissions.
- The full list of input fields, such as IP address, device state, country, user risk, service principal risk and device filter.
- API request examples.
- The exact reason strings for policies that do not apply.

## A troubleshooting routine

This routine is my advice, built on the page.

1. Take the facts from a real failed or unexpected sign-in: user, app, platform and client app.
2. Enter the identity and target, then fill in every other condition you know.
3. Run it and read the list of policies that apply.
4. For a policy you expected, read its reason under policies that do not apply. Compare that condition with the real sign-in.
5. If a dependent service is involved, run the tool again for that service's resource.
6. Check report-only policies as well, since they appear in the evaluation.

## Typical mistakes (my advice)

- Leaving optional conditions empty and reading Does not apply as final.
- Entering a group name such as Office 365 instead of an App ID.
- Testing one resource and ignoring its dependencies.
- Comparing results with the legacy tool without accounting for missing parameters.

## Related

- [Conditional Access](https://www.m365.fm/entity/conditional-access/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Multifactor authentication](https://www.m365.fm/entity/mfa/)

## Sources

- [The Conditional Access What If tool (Microsoft Learn)](https://learn.microsoft.com/entra/identity/conditional-access/what-if-tool)
