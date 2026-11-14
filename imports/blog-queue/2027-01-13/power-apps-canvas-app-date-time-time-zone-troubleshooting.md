---
title: "Power Apps Canvas App Date and Time Problems: Time Zone Troubleshooting"
summary: "Canvas app dates off by a day or an hour? Follow Microsoft's steps: check the stored UTC value, match the Dataverse column behavior to the Date Picker DateTimeZone setting, and test other time zones."
status: review
publish: false
author: mirko-p
date: 2027-01-13
topics: [power-apps, dataverse]
keypoints:
  - "Learn says date and time values off by a day or a few hours are often caused by time zone or daylight saving adjustments."
  - "First check whether the stored value is wrong, since Date and Time values are usually stored as UTC and a bad stored value shows wrongly everywhere."
  - "A common mistake is a mismatch between the data source behavior and the Date Picker DateTimeZone property, for example Time-Zone Independent with Local."
  - "Use the TimeZoneOffset function to show the user's offset, and temporarily show the time part of Date Only values."
  - "Changing a User Local column to Date Only behavior is permanent and cannot be undone."
faq:
  - q: "Why does my canvas app show the wrong date for some users?"
    a: "Microsoft Learn explains that the Date Only value can show the wrong date for some users and time zones when time zone adjustments, applied by Dataverse or by the canvas app, move the date forward or backward by a day. This happens with Time-Zone Independent and User Local behaviors, which always have a time component."
  - q: "How do I check the value stored in Dataverse?"
    a: "Learn says date and time values are usually stored as UTC and that for Dataverse tables you can view the raw value with a Web API query. The model-driven app article shows a query that selects one column for a row and notes that a trailing Z means the value is in UTC."
  - q: "What is the common Date Picker mistake?"
    a: "According to Learn, a common mistake is mismatching the data source and control settings. If a Dataverse column is Time-Zone Independent but the Date Picker DateTimeZone is Local, the UTC value from the server is shown in the user's time zone. The reverse also holds: a User Local value is shown as UTC when DateTimeZone is UTC."
  - q: "Which time zone does a canvas app use?"
    a: "Learn states that canvas apps use the system time zone, so to test another time zone you change it in Windows, Android, iOS or macOS. This differs from model-driven apps, which also have a time zone setting in personal options."
  - q: "Can I remove the time picker from a Date Only column on a form?"
    a: "Learn says a form shows a time picker for Time-Zone Independent and User Local columns because they always have a time component. You can remove the time picker, or for User Local columns that need no adjustment change the behavior to Date Only. Learn warns this is permanent and might break other apps, plugins or workflows."
---

If a canvas app shows a date that is a day or a few hours off, the cause is usually a time zone or daylight saving adjustment applied in the wrong place. Microsoft Learn's troubleshooting steps start with one question: is the stored value wrong, or is the app adjusting it incorrectly? Answer that first. Then compare the data source's time zone behavior with the Date Picker's **DateTimeZone** setting, and test with a different time zone.

## Symptoms the Learn article covers

- The **Date and Time** field shows UTC instead of local time, or the other way round.
- The **Date Only** value shows the wrong date for some users and time zones.
- Entering a daylight saving switchover date gives a date off by one day or a time off by one hour.

## Step 1: Server or client?

Canvas apps are web apps. They read data from cloud services, and the same data can feed several apps. So the error can sit on the server or in the app.

If the value in the data source is unexpected, Learn says it will likely appear wrong everywhere, not only in canvas apps. Verifying the stored value is therefore the important first step.

Learn says date and time values are usually stored as UTC. For Dataverse tables you can view the raw value with a Web API query. The model-driven app troubleshooting article shows the pattern: a GET request to the organization URI under `/api/data/v9.2/` with the entity set name, the row ID and `$select=<column name>`. It uses logical names for table and column, not display names. A value ending in `Z` is UTC. For other data sources such as Microsoft Lists or Excel, Learn points to their own documentation.

That article also explains a second check, the formatted value from the server. If the formatted value is wrong, it is a server issue. If it is right, the problem is on the client side.

## Step 2: Match data source and control settings

Some data sources have already been adjusted for time zones. The **Date Picker** control can also adjust time zones through its **DateTimeZone** property.

Learn names the common mistake directly: mismatched settings.

| Dataverse column behavior | Date Picker DateTimeZone | What happens (per Learn) |
| --- | --- | --- |
| Time-Zone Independent | Local | The UTC value from the server is displayed according to the user's time zone |
| User Local | UTC | The User Local value is displayed as UTC |

Learn adds that this conflict does not occur in model-driven apps, because time zone handling cannot be customized for individual controls there.

## Step 3: Try another time zone

To see whether time zone or daylight saving adjustment causes the issue, change the user's time zone. Learn says canvas apps use the **system time zone**. It refers you to the Windows, Android, iOS or macOS documentation to change it.

For model-driven apps, Learn names a second setting in personal options and suggests combinations such as matching both settings, using UTC, or using a time zone with the same offset that does not observe daylight saving. That advice is about model-driven apps. For canvas apps only the system time zone matters, according to the page I read.

## Three aids that make problems visible

Learn lists these tips:

1. **Show the user's time zone.** The `TimeZoneOffset` function returns the number of minutes between UTC and the user's time zone. Learn gives the example that Pacific Standard Time returns 480. This is the same offset that the Date Picker and Power Fx use. With it you can check whether date and time values were adjusted correctly.
2. **Change the Date Only format to Date and Time.** If a date-only value is off by a day, showing the time part helps you see whether adjustment is the cause.
3. **Do not use 2-digit years.** Learn says they are ambiguous, for example 40 could mean 1940, 2040 or 2140, and that the interpretation can change over time. It strongly recommends 4-digit years, especially when entering dates.

## Dataverse Date and Time column issues

### Date Only column shows the wrong date for some users

Learn says this can occur for **Time-Zone Independent** and **User Local** behaviors, which always have a time component. Adjustments by Dataverse or by the canvas app can move the date by a day. To solve it, show the time component and check the adjustment settings.

### Form shows a time picker for a Date Only column

Same cause. Because those behaviors have a time component, a form assumes you need a time. If users should not see or edit the time:

- Remove the time picker.
- For **User Local** columns that need no time zone adjustment, change the adjustment behavior to **Date Only**.

Learn adds an important note: this is different from the **Date Only** format. It is a permanent change that cannot be undone, and other apps, plugins or workflows that previously adjusted the column for time zones might not work correctly.

## My practical order

This is my advice, built on the Learn steps.

1. Pick one record that looks wrong and one user. Write down the user's time zone and the date and time you expect.
2. Read the stored value. Is it right in UTC?
3. Look at the column behavior in Dataverse and the DateTimeZone value of the Date Picker.
4. Show the time part and `TimeZoneOffset` next to the date in a test screen.
5. Change the system time zone on a test device and repeat.
6. Before changing a column to Date Only behavior, list every app, plugin and workflow that uses it.

## What the page does not give

The canvas article describes causes and checks. It does not list formulas that convert between time zones for every case, so test any conversion formula with users in at least two time zones, including one on the other side of a daylight saving change.

## Related

- [Power Apps](https://www.m365.fm/entity/power-apps/)
- [Dataverse](https://www.m365.fm/entity/dataverse/)

## Sources

- [Troubleshoot date and time issues in canvas apps - Power Apps (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/power-platform/power-apps/create-and-use-apps/troubleshoot-canvas-app-date-time-issues)
- [Troubleshoot date and time issues in model-driven apps - Power Apps (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/power-platform/power-apps/create-and-use-apps/troubleshoot-model-driven-app-date-time-issues)
