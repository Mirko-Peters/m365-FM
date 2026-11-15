---
title: "Create a Custom Sensitive Information Type in Microsoft Purview: Steps and Limits"
summary: "Create or copy a custom sensitive information type in the Microsoft Purview portal: menu path, primary and supporting elements, confidence levels, regex rules, documented limits and what Microsoft Learn leaves out."
status: review
publish: false
author: mirko-p
date: 2026-12-24
topics: [purview, dlp]
keypoints:
  - "The portal path is Information Protection > Classifiers > Sensitive info types > Create sensitive info type. The page does not name required roles."
  - "A pattern needs a primary element (regex, keyword list, keyword dictionary or function), a character proximity and a confidence level. Supporting elements and additional checks are optional."
  - "Regexes must use exactly one primary capturing group and no ^ or $ anchors. The page names Boost.RegEx 5.1.3 as the engine."
  - "Documented limits include 500 custom SITs created in the portal, 1024 characters per regex and 20 distinct regexes per SIT."
  - "SharePoint and OneDrive content must be recrawled before a new SIT detects existing content. The page has no testing procedure."
faq:
  - q: "Where do I create a custom sensitive information type?"
    a: "According to Microsoft Learn, in the Microsoft Purview portal under Information Protection > Classifiers > Sensitive info types, then Create sensitive info type."
  - q: "Which permissions do I need?"
    a: "The Learn page I read does not specify any role or permission. It points to the licensing pages and the SIT limits page for prerequisites."
  - q: "What are the main limits?"
    a: "The sensitive information type limits page lists 500 custom SITs created through the portal, 1024 characters per regular expression, 50 characters per keyword term, 2048 terms per keyword list and 20 distinct regexes per SIT."
  - q: "How do I change a built-in type?"
    a: "Copy it and edit the copy. Learn lists SITs that cannot be copied, and says a SIT with 10 text processors or restricted text processors cannot be copied in the UI. Use PowerShell instead."
  - q: "Why is my new SIT not finding existing files?"
    a: "Learn says SharePoint and OneDrive content must be recrawled before a new SIT detects existing content, and links to a SharePoint article for requesting a recrawl."
---

A custom sensitive information type (SIT) lets Microsoft Purview detect content that the built-in types do not cover, such as an internal ID format. You create it in the Microsoft Purview portal by defining a pattern with a primary element, a proximity and a confidence level. This guide follows Microsoft Learn.

## Before you start

The Learn page does not name required roles or permissions. It tells you to understand sensitive information types, review the SIT limits and check the licensing pages. My advice: plan your pattern on paper first, including sample values that should and should not match.

## Create a SIT from scratch

The menu path is **Microsoft Purview portal** > **Information Protection** > **Classifiers** > **Sensitive info types** > **Create sensitive info type**.

1. Enter a **Name** and **Description**, then select **Next**.
2. Select **Create pattern**. You can create several patterns with different elements and confidence levels.
3. Set the default confidence level for the pattern: **Low confidence**, **Medium confidence** or **High confidence**.
4. Define the **Primary element**: a **Regular expression** with an optional validator, a **Keyword list**, a **Keyword dictionary** or a preconfigured **Function**.
5. Set the **Character proximity** value.
6. Optionally add **Supporting elements**: a regex with optional validator, a keyword list, a keyword dictionary or a predefined function. Each can have its own character proximity.
7. Optionally add additional checks.
8. Select **Create**, then **Next**.
9. Choose the **recommended confidence level** for the SIT.
10. Review and select **Save**.
11. On the **Sensitive info types** tab, select **Refresh**, then search for the new SIT.

## Regex rules

The page lists three requirements:

- Do not use positional anchors such as `^` and `$`.
- Use exactly one primary capturing group in the form `(?:prefix)(primary capturing group)(?:suffix)`, and noncapturing groups for any other grouping.
- Handle variants inside that single group with `|`. Top-level alternation across several capturing groups is blocked during validation.

A valid example from the page:

```
(?:[\s,;])([A-Z]{2}[0-9]{3}|[A-Z]{2}[A-Z]{4}[0-9]|[A-Z]{2}[0-9]{5})(?:[\s,;])
```

The page names Boost.RegEx 5.1.3 as the regex engine.

## Copy and modify an existing SIT

1. Open the SIT under **Information Protection** > **Classifiers** > **Sensitive info types**.
2. Select **Copy**, then **Yes** to edit the copy.
3. Enter a new name and description.
4. Create, edit or delete patterns, then save.

Some SITs cannot be copied, including the U.S. and Canada driver's license numbers, several EU identifiers and the ICD-9-CM and ICD-10-CM classifications. A SIT with 10 text processors or restricted text processors cannot be copied in the UI, and Learn says to use PowerShell for those.

## Documented limits

The separate limits page lists these values as published:

| Limit | Value |
| --- | --- |
| Custom SITs created through the Microsoft Purview portal | 500 |
| Length of a regular expression | 1024 characters |
| Length of a term in a keyword list | 50 characters |
| Terms in a keyword list | 2048 |
| Distinct regexes per SIT | 20 |
| Combined size of all keyword dictionaries (after compression) | 1 MB |
| Rule packages | 10 |
| SITs per rule package | 50 |
| Size of a rule package | 150 KB |

If you need more than 500 custom SITs, the page says to raise a support ticket. It does not say whether the 500 limit applies to PowerShell or API creation.

## After you save

Custom SITs are stored in the `Microsoft.SCCManaged.CustomRulePack` rule package. SharePoint and OneDrive content must be recrawled before a new SIT detects existing content. Microsoft support cannot help you write custom classifications or regex patterns, but can provide sample patterns or help troubleshoot one that does not match.

## Keywords in Chinese, Japanese and Korean

The page says Purview supports Chinese (simplified and traditional), Japanese and Korean. For mixed-script keywords, create two variants, one with a space and one without. Keep double-byte special characters out of keywords, and use string match rather than word match in keyword lists.

## Not covered by the pages

The page has no testing procedure and no details on character proximity, validators or additional checks, which it links elsewhere. It also does not describe how confidence levels behave beyond naming them. Test with sample content in a policy in test mode where your product allows it, which is a suggestion and not from the page.

## Related

- [Microsoft Purview](https://www.m365.fm/entity/purview/)
- [Data loss prevention](https://www.m365.fm/entity/dlp/)

## Sources

- [Create custom sensitive information types (Microsoft Learn)](https://learn.microsoft.com/purview/sit-create-a-custom-sensitive-information-type)
- [Sensitive information type limits (Microsoft Learn)](https://learn.microsoft.com/purview/sit-limits)
