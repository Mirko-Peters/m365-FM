---
title: "Power Automate formatDateTime: Syntax, Format Strings and Examples"
summary: "Power Automate formatDateTime explained: syntax, the format strings that matter, time zones with convertTimeZone, and the mistakes behind wrong dates and times."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [power-automate]
keypoints:
  - "The syntax is formatDateTime(timestamp, format, locale), where the format and the locale are optional and the result is always a string."
  - "Without a format, the function returns the ISO 8601 round-trip pattern, for example 2018-03-15T00:00:00.0000000."
  - "Case matters in format strings: MM is the month and mm is the minute, and HH is a 24-hour hour while hh is a 12-hour hour."
  - "Power Automate works in UTC by default, so convert the time zone first with convertTimeZone or convertFromUtc and then format the result."
  - "Wrap typed values and format strings in single quotes, but never wrap dynamic content in single quotes."
faq:
  - q: "What is the syntax of formatDateTime in Power Automate?"
    a: "It's formatDateTime(timestamp, format, locale). Only the timestamp is required. The format is a standard single-letter string such as 'D' or a custom pattern such as 'yyyy-MM-dd'. The locale defaults to en-us. Without a format, you get the ISO 8601 round-trip pattern. The function returns text, not a date value."
  - q: "How do I format a date as dd/MM/yyyy in Power Automate?"
    a: "Use the expression formatDateTime(triggerBody()?['date'], 'dd/MM/yyyy'), replacing the first argument with your own dynamic content or a quoted ISO 8601 date. Use capital MM for the month, because lowercase mm means minutes. Dynamic content goes in without quotes, and the format string stays in single quotes."
  - q: "Why does formatDateTime show the wrong time?"
    a: "Power Automate uses UTC by default, and utcNow() returns UTC, so the clock time is often a few hours off for local users. Convert first, for example with convertTimeZone(utcNow(), 'UTC', 'Eastern Standard Time'), then wrap the result in formatDateTime. Also check that you used HH for 24-hour time and hh with tt for 12-hour time."
---
Power Automate formatDateTime turns a date and time into the text you want. The syntax is `formatDateTime(timestamp, format, locale)`, where the format and the locale are optional and the result is a string. For example, `formatDateTime(utcNow(), 'dd-MM-yyyy')` returns the current UTC date as day, month and year. This article is for people who build flows and keep ending up with dates like `2023-10-22T00:00:00Z` in emails, file names or SharePoint columns. It covers the syntax, the format strings you'll use most, the time zone trap, a table of common patterns, and the mistakes behind wrong results.

## How formatDateTime works

The function takes a timestamp and rewrites it. Microsoft's article on formatting date and time values in a flow describes the first argument as the date and time you want to format. It can be typed by hand or come from dynamic content. Typed values should be in ISO 8601 form, such as `2009-06-15T13:45:30`. The second argument is the format string. A single character is a standard format string. More than one character is a custom format string, which controls the position and precision of the month, day, year, hour, second and so on.

Three details from Microsoft's workflow expression reference are worth remembering:

- **The format is optional.** If you leave it out, the default is the pattern `o`, which Microsoft describes as ISO 8601 with time zone information preserved. `formatDateTime('03/15/2018')` returns `'2018-03-15T00:00:00.0000000'`.
- **An invalid format raises an error.** The flow run fails, so a typo in the pattern shows up in your run history.
- **The locale is optional.** If you leave it out, it's `en-us`. An invalid locale is an error. This is how you get month and day names in another language: `formatDateTime('01/31/2016', 'dddd MMMM d', 'fr-fr')` returns `'dimanche janvier 31'`, while the same call without the locale returns `'Sunday January 31'`.

The return value is a string. That matters in practice. Once you format a date, you've got text, and you shouldn't use the result for date math. Do the calculation first with functions such as `addDays` or `addToTime`, and format at the very end. In [Power Automate](https://www.m365.fm/entity/power-automate/), the formatted value is usually what you put into an email body, a file name or a text column.

## How to use formatDateTime in Power Automate step by step

Microsoft's article gives a clear way to insert the expression in a flow.

1. Select the input field in your action where the formatted value should go, for example the **Body** of a **Send an email (V2)** action.
2. Select **Add dynamic content**, then open the **Expression** tab. In the flow designer this appears as the ***fx*** button.
3. Type `formatDateTime(`, or find the function in the list of **Date and time** functions.
4. Add the value. Type a fixed value in single quotes, or pick dynamic content. Don't put single quotes around dynamic content.
5. Add the format string in single quotes, for example `'MM/dd/yyyy'`.
6. Select **OK** to insert the expression.

The pattern from Microsoft's page looks like this: `formatDateTime('2023-10-22', 'dd/MM/yyyy hh:mm tt')` for a fixed value in quotes, and the same call with a dynamic content item in place of the quoted value, without quotes.

The worked example in the article uses a manually triggered flow with a **Date** input. The expression is `formatDateTime(triggerBody()?['date'], 'MM/dd/yyyy')`. With a date of `2023-10-22`, the email shows the date in the `MM/dd/yyyy` form.

To check an expression before you build around it, use a **Compose** action with a fixed timestamp in single quotes, run the flow and read the output in the run history. It takes a minute and saves you from fixing a broken format in a flow that already sends real emails.

## Format strings you will actually use

Standard strings are a single letter. Microsoft's examples for the timestamp `2009-06-15T13:45:30`:

- `'g'` returns `6/15/2009 1:45 PM`, the general date and time pattern with a short time.
- `'D'` returns `Monday, June 15, 2009`, the long date pattern.

The .NET documentation lists more standard letters. Examples with the same timestamp: `'d'` gives `6/15/2009`, `'t'` gives `1:45 PM`, `'T'` gives `1:45:30 PM`, `'s'` gives the sortable `2009-06-15T13:45:30`, and `'Y'` gives `June 2009`. Most of these follow the culture rules, so the same letter can look different with another locale. The ones that always look the same everywhere are `o`, `r`, `s` and `u`.

Custom strings give you control. These are the specifiers that matter for flows:

- `yyyy` is the four-digit year, and `yy` the two-digit year.
- `MM` is the month with a leading zero, `MMM` the short month name and `MMMM` the full month name. `M` is the month without a leading zero.
- `dd` is the day with a leading zero, `ddd` the short day name and `dddd` the full day name.
- `HH` is the hour on a 24-hour clock, with a leading zero. `hh` is the hour on a 12-hour clock, with a leading zero.
- `mm` is the minute, `ss` the second, and `fff` the milliseconds.
- `tt` is AM or PM.

Following that table, `formatDateTime('2009-06-15T13:45:30', 'yyyy-MM-dd')` gives `2009-06-15`, and `'hh:mm tt'` gives `01:45 PM`. Microsoft's flow article also shows `formatDateTime(utcNow(), 'MMMM dd, yyyy, HH:mm')`, which returns the current UTC date and time in the pattern `June 15, 2009, 16:50`, using a fixed sample date.

Two quirks come from the .NET rules. First, a single letter is always read as a standard string. If you want a single custom specifier, put a percent sign in front of it, for example `'%d'`. Second, to insert fixed text in a pattern, escape the character with a backslash or put the text in quotes. Other characters that aren't specifiers are copied to the output as they are. The slash and the colon are replaced by the separators of the locale, which can surprise you when you pass another locale.

## Time zones: format after you convert

Power Automate uses UTC by default, and `utcNow()` returns the current date and time in UTC. If your users are in Berlin or New York, the clock time in your email will be off unless you convert it first.

Microsoft's article combines both functions: `formatDateTime(convertTimeZone(utcNow(), 'UTC', 'Eastern Standard Time'), 'yyyy-MM-dd HH:mm:ss')`. The inner function changes the time zone, the outer one formats the result. The time zone names are the Windows names, such as `UTC`, `Pacific Standard Time` and `Eastern Standard Time`. For other regions, use the matching Windows time zone name from Microsoft's list.

The workflow reference also describes `convertFromUtc`, which takes a UTC timestamp and a destination time zone and returns the converted time without the UTC offset. Its example: `convertFromUtc('2018-01-01T08:00:00.0000000Z', 'Pacific Standard Time')` returns `"2018-01-01T00:00:00.0000000"`. There's also `convertToUtc`, which goes the other way. And Power Automate has a **Convert time zone** action with the inputs **Base time**, **Source time zone**, **Destination time zone** and an optional **Format string**, if you prefer an action over an expression.

If the input isn't valid ISO 8601, expect an error such as "The date time string must match ISO8601 format." A date typed as `15/03/2018` is a typical cause. For dates that arrive in a local format, the reference describes `parseDateTime` with a locale and a format, for example `parseDateTime('21052019', 'fr-fr', 'ddMMyyyy')`, which returns `'2019-05-21T00:00:00.0000000'`. Parse first, then format.

## Common mistakes

- **Using `mm` for the month.** Lowercase `mm` is the minute and `MM` is the month. A date formatted as `dd/mm/yyyy` shows the minutes where the month should be.
- **Combining `HH` with `tt`.** Microsoft's own example `'M/dd/yyyy HH:mm:ss tt'` produces `6/15/2009 13:45:30 PM`, which is contradictory. Use `hh` with `tt`, or `HH` without it.
- **Quoting dynamic content.** Dynamic content must not have single quotes, or the flow treats the name as plain text.
- **Forgetting the time zone.** The default is UTC. Convert before you format.
- **Doing math on the result.** The output is a string. Calculate first, format last.
- **Trusting the sample outputs for `utcNow()`.** The dates in the documentation are fixed examples. Your result reflects the current time.
- **Passing a non-ISO date.** Parse it with a locale and a format first.

## Related topics to explore

- Convert time zones: Microsoft's article on [converting time zones](https://learn.microsoft.com/en-us/power-automate/convert-time-zone) covers both the action and the expression.
- Add or subtract time: `addDays` and `addToTime` take the same optional format, so you can shift and format in one call.
- Parse local date formats: `parseDateTime` takes a locale and a format for dates that don't arrive as ISO 8601.
- The full function list: the [workflow expression reference](https://learn.microsoft.com/en-us/azure/logic-apps/expression-functions-reference) documents every date and time function.
- All custom specifiers: the [custom date and time format strings](https://learn.microsoft.com/en-us/dotnet/standard/base-types/custom-date-and-time-format-strings) page lists every letter.

## Next step

For reliable Power Automate formatDateTime results, start with an ISO 8601 date, convert the time zone before you format, and test the pattern in a **Compose** action. Then read Microsoft's article on how to [customize or format date and time values in a flow](https://learn.microsoft.com/en-us/power-automate/date-time-values), and keep a short list of the patterns your team uses most.
