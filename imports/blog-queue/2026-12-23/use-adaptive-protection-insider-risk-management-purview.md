---
title: "Use Adaptive Protection in Insider Risk Management: Setup, Risk Levels and Timing"
summary: "How Microsoft Purview Adaptive Protection works: risk levels, quick setup versus custom setup, how DLP and Conditional Access apply, roles, timing of up to 72 hours and the limits listed on Learn."
status: review
publish: false
author: mirko-p
date: 2026-12-23
topics: [insider-risk-management]
keypoints:
  - "Adaptive Protection uses machine learning in Insider Risk Management and applies controls from DLP, Data Lifecycle Management (preview) and Entra Conditional Access (preview)."
  - "Risk levels are Elevated, Moderate and Minor, based on user insights, and differ from alert severity of Low, Medium and High."
  - "Quick setup creates a data leaks policy, a report-only Conditional Access policy, test-mode DLP policies and a data lifecycle policy, and can take up to 72 hours."
  - "DLP in Adaptive Protection supports only Exchange, Teams and devices. Custom setup needs the condition User's insider risk level for Adaptive Protection is."
  - "Disabling takes up to six hours to stop assigning and reset levels. Do not disable before quick setup has finished."
faq:
  - q: "What does Adaptive Protection do?"
    a: "Microsoft Learn says it uses machine learning in Insider Risk Management to identify high-priority insider risks, then dynamically applies controls from Purview Data Loss Prevention, Data Lifecycle Management (preview) and Microsoft Entra Conditional Access (preview). Assignments update automatically as a user's risk level changes."
  - q: "What are the risk levels?"
    a: "Elevated, Moderate and Minor. Learn describes Elevated as high-severity alerts, at least three high-severity sequence insights or confirmed high-severity alerts, Moderate as medium-severity alerts or at least two high-severity data exfiltration activities, and Minor as low-severity alerts or at least one high-severity data exfiltration activity."
  - q: "What is the difference between quick and custom setup?"
    a: "Quick setup, from the Adaptive Protection dashboard, creates the needed policies for you, with a report-only Conditional Access policy and DLP policies in test mode. Custom setup is for organizations with existing policies, and needs you to configure risk level conditions and turn Adaptive Protection on in its settings tab."
  - q: "How long does it take to start working?"
    a: "Learn says quick setup can take up to 72 hours to complete, and custom setup up to 36 hours before actions appear. Disabling can take up to six hours."
  - q: "Is it available in US Government clouds?"
    a: "Learn says Insider Risk Management is available in supported geographies and commercial clouds, and is not available in US Government cloud programs."
---

Adaptive Protection links insider risk scoring to the controls that act on users. Low-risk users keep working normally, while users at higher risk levels get stricter controls. This guide follows the Microsoft Purview page for Adaptive Protection.

## What it is

Learn says Adaptive Protection uses machine learning in Insider Risk Management to identify high-priority insider risks, and then applies controls from:

- Microsoft Purview Data Loss Prevention
- Microsoft Purview Data Lifecycle Management (preview)
- Microsoft Entra Conditional Access (preview)

Assignments update automatically as risk levels change.

## Requirements

- Licensing is described on the Microsoft 365 plans page that Learn links to. If you lack a qualifying subscription, Learn points to a Purview risk and compliance trial, or an Entra trial for Conditional Access.
- Insider Risk Management is available in supported geographies and commercial clouds, not in US Government cloud programs.
- Insider Risk Management, DLP and Conditional Access policies, created by quick setup or custom setup.

## Insider risk levels

Levels are based on user insights, meaning aggregated activity and severity, not raw event counts.

| Level | Learn's description |
| --- | --- |
| Elevated | High-severity alerts, at least three high-severity sequence insights, or one or more confirmed high-severity alerts |
| Moderate | Medium-severity alerts, or at least two high-severity data exfiltration activities |
| Minor | Low-severity alerts, or at least one high-severity data exfiltration activity |

Levels are customizable. Past activity detection (5 to 30 days, default 7) and the insider risk level timeframe (5 to 30 days, default 7) control evaluation and reset. Insider risk levels are different from alert severity, which is Low, Medium or High.

## Quick setup

Path: Microsoft Purview portal, **Insider Risk Management**, **Adaptive protection**. Use **Dashboard** > **Quick setup**, or **Turn on Adaptive Protection** on the Purview home page or the DLP Overview page. Scoped admins for Microsoft Purview can't use quick setup.

It creates a data leaks based Insider Risk Management policy, a Conditional Access policy in report-only mode, DLP policies in test mode and a data lifecycle management policy.

## Custom setup

For organizations with existing policies:

1. Create or select an Insider Risk Management policy.
2. Configure the **Insider risk levels** conditions.
3. Create or edit a DLP policy with the condition **User's insider risk level for Adaptive Protection is**.
4. Create or edit a Conditional Access policy, set **Insider risk** to **Yes** and select a level.
5. On the **Adaptive Protection settings** tab, turn **Adaptive Protection** to **On**.

## How controls apply

- **DLP.** Supports Exchange, Teams and devices only. In quick setup, Elevated is blocked, and Moderate and Minor are audited.
- **Conditional Access.** Applies access controls per level, for example blocking Elevated users from Office 365 apps.
- **Data lifecycle management.** Preserves SharePoint, OneDrive and Exchange content deleted by Elevated users for 120 days. Custom setup requires explicit opt-in. You can opt out without disabling Adaptive Protection.

## Roles

- Conditional Access policies: Global Administrator, Conditional Access Administrator or Security Administrator.
- DLP policies: Compliance Administrator, Compliance Data Administrator, DLP Compliance Management or Global Administrator.
- Insider risk settings: Insider Risk Management or Insider Risk Management Admins.
- Viewing risk levels: Insider Risk Management, Analysts or Investigators.

Microsoft recommends the role with the fewest permissions.

## Timing

- Quick setup: up to 72 hours to complete.
- Custom setup: up to 36 hours before actions appear.
- Disabling: up to six hours to stop assigning and reset levels. Don't disable before quick setup finishes.

## Limits

- DLP supports only Exchange, Teams and devices.
- Data lifecycle management and Conditional Access are preview.
- Usernames aren't anonymized in Conditional Access, and anonymization isn't preserved outside Insider Risk Management.

## Rollout advice (my advice)

Because quick setup creates test-mode DLP and report-only Conditional Access, you have a chance to review impact before enforcement. Check the report-only results, and tune the thresholds under **Insider risk levels** before you move policies to enforce. Tell HR and legal how the signals will be used, since the page notes that user names are visible in Conditional Access. That last point is advice, not a statement from the page.

## Related

- [Insider Risk Management](https://www.m365.fm/entity/insider-risk-management/)

## Sources

- [Help dynamically mitigate risks with Adaptive Protection (Microsoft Learn)](https://learn.microsoft.com/purview/insider-risk-management-adaptive-protection)
