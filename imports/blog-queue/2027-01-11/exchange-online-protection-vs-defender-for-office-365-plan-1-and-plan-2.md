---
title: "Exchange Online Protection vs Defender for Office 365 Plan 1 and Plan 2"
summary: "Compare Exchange Online Protection with Microsoft Defender for Office 365 Plan 1 and Plan 2: what each layer adds, the feature cheat sheet, licensing examples, trial, SIEM integration and gaps in the Learn comparison page."
status: review
publish: false
author: mirko-p
date: 2027-01-11
topics: [exchange-online-protection, defender-for-office-365]
keypoints:
  - "EOP is built in and stops broad, known attacks. Plan 1 adds protection against zero-day malware, phishing and BEC. Plan 2 adds simulations, investigation, hunting and automation."
  - "Plan 1 adds anti-phishing with impersonation protection, Safe Attachments, Safe Links and real-time detections."
  - "Plan 2 adds attack simulation training, priority account protection, Threat Explorer, Threat Trackers, AIR and advanced hunting."
  - "Plan 1 is included in subscriptions such as Microsoft 365 E3 and Business Premium, Plan 2 in subscriptions such as E5. Add-ons exist, and a 90-day Plan 2 trial is available."
  - "The page has no direct EOP-versus-MDO table and no prices. Safe Documents sits outside the plans."
faq:
  - q: "What does EOP include?"
    a: "Built-in protection included with all Microsoft 365 subscriptions with cloud mailboxes. Learn says it prevents broad, volume-based, known email attacks."
  - q: "What does Plan 1 add?"
    a: "Anti-phishing policies with impersonation protection, Safe Attachments including SharePoint, OneDrive and Teams, Safe Links, Tenant Allow/Block List for Teams, user-reported Teams items, real-time detections, user tags and ZAP for Teams."
  - q: "What does Plan 2 add on top of Plan 1?"
    a: "Attack simulation training, priority account protection, Threat Explorer, Threat Trackers, automated investigation and response, advanced hunting and incident and alert investigation in Defender XDR, and advanced hunting on Teams messages."
  - q: "Which subscriptions include the plans?"
    a: "Plan 1 is included in some subscriptions such as Microsoft 365 E3 and G3 and Business Premium. Plan 2 is included in some such as A5, E5 and G5. Both are also available as add-ons."
  - q: "Is there a trial?"
    a: "Yes. The page offers a 90-day Plan 2 trial."
---

All organizations with cloud mailboxes get built-in security features, which this guide calls EOP. The page itself says Microsoft Defender for Office 365 is the primary email and collaboration security solution for Microsoft 365, with two plans on top of the built-in layer. This guide follows the Microsoft Learn page Why do I need Microsoft Defender for Office 365? The page calls the first layer the built-in security features for all cloud mailboxes and compares each plan against it. It has no separate EOP-versus-Defender table.

## The protection ladder

- **EOP.** Built in with all cloud mailboxes. It prevents broad, volume-based, known email attacks.
- **Plan 1.** Adds protection against zero-day malware, phishing and business email compromise.
- **Plan 2.** Adds phishing simulations, post-breach investigation, hunting and response, and automation.

## What Plan 1 adds

- Anti-phishing policies with impersonation protection and phishing email thresholds.
- Safe Attachments, including Safe Attachments for SharePoint, OneDrive and Microsoft Teams.
- Safe Links.
- Tenant Allow/Block List for Teams and user-reported Teams items.
- Real-time detections, user tags including Priority account, the Email entity page and the Teams message entity panel.
- ZAP for Teams.
- User and domain impersonation protection, mailbox intelligence impersonation protection, URL trace and Defender for Office 365 reports.

The page says the presence of Real-time detections in the Defender portal is a quick way to tell Plan 1 from Plan 2. Plan 2 has Explorer instead.

## What Plan 2 adds

Plan 2 includes everything in Plan 1, plus:

- Attack simulation training and priority account protection.
- Threat Explorer instead of real-time detections, and Threat Trackers.
- Campaigns.
- Automated investigation and response, from Threat Explorer and for compromised users.
- Advanced hunting, incident investigation and alert investigation in Microsoft Defender XDR.
- Advanced hunting on Teams messages and removing users from Teams chats.

## SIEM integration

For SIEM integration, Plan 1 covers alerts and detections. Plan 2 adds automated investigations, attack simulation and the Defender XDR APIs for advanced hunting, incidents and streaming.

## Licensing

| Layer | Included in |
| --- | --- |
| EOP | All Microsoft 365 subscriptions with cloud mailboxes |
| Plan 1 | Some subscriptions for small and medium businesses, for example Microsoft 365 E3/G3 and Business Premium |
| Plan 2 | Some subscriptions for enterprises, for example Microsoft 365 A5, E5 and G5 |

Defender for Office 365 is also available as an add-on to many subscriptions with cloud mailboxes. A 90-day Plan 2 trial is available. The page points to the Entra service plan reference as the exhaustive source for which subscription includes which plan.

## Email authentication

The page also says that, whether you use only the onmicrosoft.com domain or custom domains, you should configure email authentication (SPF, DKIM and DMARC records in DNS) for used and unused domains, so that Microsoft 365 can protect more accurately against spoofing.

## What the page does not say

- A direct EOP-versus-Defender comparison. Plans are compared with the built-in column.
- Prices. It links to a comparison page for purchasing.
- Complete feature availability. It refers to the service description.
- Safe Documents is outside the plans. It is available with Microsoft 365 A5 or Microsoft Defender Suite licenses.
- Consumer subscribers are directed to a separate support article.

## A choice outline

This outline is my advice, built on the page.

1. Start with what your subscription already includes and check the service plan reference.
2. If you need Safe Attachments, Safe Links or impersonation protection, you need Plan 1 or higher.
3. If you need simulations, Threat Explorer, AIR or hunting, you need Plan 2.
4. Use the 90-day Plan 2 trial to test before you buy.
5. Check the service description for feature availability in your cloud.

## Typical mistakes (my advice)

- Assuming Plan 1 includes attack simulation training. It is a Plan 2 feature.
- Assuming Safe Documents comes with the plans.
- Judging by examples of subscriptions instead of checking the service plan reference.
- Expecting prices on the comparison page.

## Quick reference

| Capability | EOP | Plan 1 | Plan 2 |
| --- | --- | --- | --- |
| Built-in protection against broad, known attacks | Yes | Yes | Yes |
| Safe Attachments and Safe Links | No | Yes | Yes |
| Anti-phishing with impersonation protection | No | Yes | Yes |
| Real-time detections | No | Yes | Replaced by Threat Explorer |
| Attack simulation training | No | No | Yes |
| Threat Explorer, Threat Trackers, AIR | No | No | Yes |
| Advanced hunting in Defender XDR | No | No | Yes |

The table restates the page's cheat sheet and detailed rows. The EOP column is an inference from the page's statement that the listed Plan 1 and Plan 2 capabilities are not in the built-in features.

## Reading the ladder (my reading)

The page says Plan 1 contains a subset of the features in Plan 2, and that all levels of the ladder can protect, detect, investigate and respond, but the available features and automation increase as you move up. It describes Plan 1 as adding more prevention and detection, and Plan 2 as expanding investigation and response with automation. My reading: the question is rarely one or the other. It is how far up the ladder your risk and your team's skills justify going.

## Related

- [Exchange Online Protection](https://www.m365.fm/entity/exchange-online-protection/)
- [Defender for Office 365](https://www.m365.fm/entity/defender-for-office-365/)
- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Microsoft Defender](https://www.m365.fm/entity/defender/)

## Sources

- [Why do I need Microsoft Defender for Office 365? (Microsoft Learn)](https://learn.microsoft.com/defender-office-365/mdo-about)
