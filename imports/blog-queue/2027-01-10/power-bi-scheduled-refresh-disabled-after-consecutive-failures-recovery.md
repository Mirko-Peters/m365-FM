---
title: "Power BI Scheduled Refresh Disabled After Consecutive Failures: Causes and Recovery"
summary: "Why Power BI turns off a scheduled refresh after four consecutive failures or after two months of inactivity, how to find the error in refresh history, how to turn the schedule back on, and the daily refresh limits per license."
status: review
publish: false
author: mirko-p
date: 2027-01-10
topics: [power-bi-service]
keypoints:
  - "Power BI deactivates a refresh schedule after four consecutive failures, or earlier on an unrecoverable error such as invalid or expired credentials. The threshold cannot be changed."
  - "To recover, fix the cause, for example update Data source credentials, then set Configure a refresh schedule back to On and select Apply."
  - "A separate pause happens after two months without anyone viewing a report or dashboard on the model. Opening a report on the model resumes it."
  - "Refresh history shows status, duration and error messages for each attempt."
  - "Daily scheduled refresh limits are 8 for Power BI Pro and 48 for Premium per user and Premium or Fabric capacity."
faq:
  - q: "When does Power BI disable a scheduled refresh?"
    a: "Microsoft Learn says the schedule is deactivated after four consecutive failures, or when the service detects an unrecoverable error that needs a configuration update, such as invalid or expired credentials. The threshold cannot be changed."
  - q: "How do I turn the schedule back on?"
    a: "Open the semantic model settings, select Refresh > Schedule refresh, resolve the cause (for example update credentials under Data source credentials), set the Configure a refresh schedule slider to On and select Apply."
  - q: "Where do I see why refreshes failed?"
    a: "Select the semantic model, then Refresh > Refresh history. It shows the status, duration and error message for each attempt."
  - q: "Why was my refresh paused when nothing failed?"
    a: "Scheduled refresh also pauses after two months of inactivity, when no user has viewed a dashboard or report built on the model. The owner is emailed and the schedule shows Disabled."
  - q: "How many scheduled refreshes are allowed per day?"
    a: "The page lists 8 per day for Power BI Pro and 48 for Premium per user and for Premium or Fabric capacity."
---

A Power BI schedule that stops running is usually switched off by the service, not broken. Power BI disables it after repeated failures or after a long period without use. Recovery is a short routine: read the error, fix the cause and turn the schedule back on. This guide follows the Microsoft Learn page on scheduled refresh.

## When Power BI turns the schedule off

- **Consecutive failures.** The refresh schedule is deactivated after four consecutive failures. It is also deactivated when the service detects an unrecoverable error that needs a configuration update, such as invalid or expired credentials. You cannot change the threshold.
- **Inactivity.** Scheduled refresh pauses after two months in which no user has viewed any dashboard or report built on the semantic model. The semantic model owner is emailed and the schedule shows as **Disabled**.

## Find the cause

1. Select the semantic model.
2. Select **Refresh** > **Refresh history**.
3. Read the status, duration and error message for each attempt.

## Recover after failures

1. Go to the semantic model settings and select **Refresh** > **Schedule refresh**.
2. Resolve the underlying issue. For example, update expired credentials under **Data source credentials**.
3. Set the **Configure a refresh schedule** slider back to **On** and select **Apply**.

## Recover after inactivity

Open any report or dashboard that uses the model. Then re-enable the schedule if it is still off.

## Gateway and credential points on the page

- If no gateway is available, the gateway connection option is disabled. A personal gateway appears only when it is online. An enterprise gateway appears only if your account is on the Users tab of the data source configured for that gateway.
- With a personal gateway you supply data source credentials. They are kept with the model, and they may need an update when a password expires or changes.
- With an enterprise gateway the gateway administrator defines the credentials. The Data source credentials section is then grayed out in Power BI.
- For on-premises SharePoint, only Anonymous, Basic and Windows (NTLM or Kerberos) authentication are supported. ADFS and forms-based authentication are not.

## Schedule settings and limits

| License or capacity | Scheduled refreshes per day |
| --- | --- |
| Power BI Pro | 8 |
| Premium per user, Premium or Fabric capacity | 48 |

- To set a schedule, open the workspace, select the semantic model, select **Refresh** > **Schedule refresh**, set **Configure a refresh schedule** to **On**, then define frequency and time slots.
- The refresh target is within 15 minutes of the slot, with a possible delay of up to one hour. It can start as early as five minutes before the slot.
- Power BI has no monthly refresh option. The page suggests Power Automate as a workaround.

## What the page does not say

- Whether the owner is emailed when the schedule is deactivated after failures. The email is described only for inactivity.
- Whether a successful refresh resets the failure count.
- Whether failed manual or API refreshes count toward the four failures.
- Which errors besides invalid or expired credentials cause immediate deactivation.

## A recovery routine

This routine is practical advice built on the page.

1. Open Refresh history and read the latest error before you touch the schedule.
2. Fix the cause first. Re-enabling a schedule with the same fault will fail again.
3. Turn the slider back on and select Apply.
4. Check the next scheduled run in Refresh history.
5. If the model is rarely opened, remember the two-month inactivity pause.

## Typical mistakes

- Turning the schedule on without fixing expired credentials.
- Looking for a threshold setting. The page says it cannot be changed.
- Confusing the inactivity pause with a failure.
- Planning more than 8 refreshes per day on Pro.

## Quick reference

| Situation | What the page says | What to do |
| --- | --- | --- |
| Four consecutive failures | Schedule is deactivated | Fix the cause, set the slider to On, Apply |
| Invalid or expired credentials | Can deactivate the schedule early | Update Data source credentials |
| No viewing for two months | Refresh pauses, owner is emailed | Open a report on the model, re-enable if needed |
| Need error details | Refresh history | Select Refresh > Refresh history |

## Two different reasons, two different fixes

A deactivation after failures needs a technical fix, because the same fault will cause the same failures again. A pause after inactivity needs no fix at all, only a view of a report or dashboard on the model. If the schedule shows Disabled, read Refresh history first. A recent run of failed entries points to the first case. An old last run with no recent errors points to the second.

## Related

- [Power BI service](https://www.m365.fm/entity/power-bi-service/)
- [Power BI](https://www.m365.fm/entity/power-bi/)
- [Power BI Desktop](https://www.m365.fm/entity/power-bi-desktop/)

## Sources

- [Configure scheduled refresh (Microsoft Learn)](https://learn.microsoft.com/power-bi/connect-data/refresh-scheduled-refresh)
