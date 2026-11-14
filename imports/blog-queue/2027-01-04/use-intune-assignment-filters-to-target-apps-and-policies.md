---
title: "How to Use Assignment Filters in Intune to Target Apps and Policies"
summary: "Use Intune assignment filters to include or exclude devices from app and policy assignments: how filters evaluate, admin center path, rule syntax, supported platforms, limits and documented caveats."
status: review
publish: false
author: mirko-p
date: 2027-01-04
topics: [intune]
keypoints:
  - "Filters are reusable rules that decide whether a managed device or app receives an assigned app, policy or profile, using device or app properties."
  - "Create them under Tenant administration > Assignment filters > Create. Learn gives limits of 200 filters per tenant and 3,072 characters per filter."
  - "Assignment has three modes: Do not apply a filter, Include filtered devices in assignment and Exclude filtered devices in assignment."
  - "Filters for managed apps apply only to app protection policies and app configuration policies."
  - "A filter cannot be deleted while any assignment uses it. Remove it from all assignments first."
faq:
  - q: "What is an assignment filter?"
    a: "According to Microsoft Learn, a reusable rule that dynamically evaluates whether a managed device or managed app receives an assigned app, policy or profile, based on properties such as OS version or manufacturer."
  - q: "When is a filter evaluated?"
    a: "Learn says it is evaluated when the device enrolls, checks in with the Intune service, or at any other time a policy is evaluated. Filters do not need group membership processing, so group size and membership timing do not affect targeting."
  - q: "Where do I create one?"
    a: "Learn gives Tenant administration > Assignment filters > Create. It is also reachable under Devices > Organize devices > Assignment filters and under Apps > Organize devices > Assignment filters."
  - q: "What are the limits?"
    a: "Learn states up to 200 assignment filters per tenant and up to 3,072 characters per filter. Managed devices must be enrolled in Intune."
  - q: "Why can I not delete a filter?"
    a: "Learn says you must remove the filter from all policy assignments first. Otherwise the error says an assignment filter is associated with existing assignments."
---

An assignment filter narrows who receives an app, policy or profile after you have chosen the groups. You create the filter once, write a rule on device or app properties, and then attach it to an assignment in include or exclude mode. This guide follows the Microsoft Learn page on assignment filters.

## What filters do

Learn describes filters as reusable rules that dynamically evaluate whether a managed device or managed app receives an assigned app, policy or profile. Examples of properties are OS version and manufacturer. The filter is evaluated when the device enrolls, checks in with Intune, or whenever a policy is evaluated. It does not depend on group membership processing, so group size and membership timing do not change targeting.

## The three assignment modes

| Mode | Result |
| --- | --- |
| Do not apply a filter | All targeted users or devices receive the app or policy |
| Include filtered devices in assignment | Only devices that match the filter receive it |
| Exclude filtered devices in assignment | Devices that match the filter do not receive it. All others do |

## Create a filter

Path: Intune admin center > **Tenant administration** > **Assignment filters** > **Create**. Learn also lists **Devices** > **Organize devices** > **Assignment filters** and **Apps** > **Organize devices** > **Assignment filters**.

1. Select **Managed devices** or **Managed apps**.
2. On **Basics**, enter a name, an optional description and a platform.
3. On **Rules**, use the rule builder with Property, Operator, Value and **Add expression**. Or select **Edit** in Rule syntax and then **OK**.
4. Optionally select **Preview devices**.
5. Optionally add **Scope tags**.
6. Select **Review + create**, then **Create**.

An example of rule syntax from the page:

```
(device.osVersion -eq "10.0.18362") and (device.manufacturer -eq "Microsoft")
```

The page does not list all properties and operators. It shows `-eq` and the rule builder operators `equals` and `contains`, and links to a separate reference page for device and app properties.

## Platforms

- **Managed devices:** Android device administrator, Android Enterprise, Android (AOSP), iOS/iPadOS, macOS and Windows 10 and later.
- **Managed apps:** Android, iOS/iPadOS and Windows.

Android device administrator is deprecated and unavailable for devices with access to Google Mobile Services.

## What filters can be applied to

- **Managed devices:** Intune-enrolled devices. Learn gives compliance policies and device configuration profiles as examples and links to a separate page with the full list of supported workloads.
- **Managed apps (MAM):** only app protection policies and app configuration policies. Filters for managed apps do not apply to compliance policies or device configuration profiles.

## Limits

- Up to 200 assignment filters per tenant.
- Up to 3,072 characters per filter.
- Managed devices must be enrolled in Intune.

## Caveats from Learn

- **Validation.** Rules are validated when saved, and errors are shown.
- **Rule builder.** Syntax the builder does not support disables it. Nested parentheses are an example. You then edit the rule syntax directly.
- **Preview.** Experimental properties cannot be previewed, but you can still use them in filters.
- **Deletion.** Remove the filter from all policy assignments first. Otherwise you see an error that an assignment filter is associated with existing assignments.
- **Choosing a tool.** Learn says to use filters for Intune device and app targeting. Use dynamic groups for cross-workload scenarios such as Conditional Access and licensing, for Autopilot profile assignment, or for user-based grouping.
- **Roles.** Sign in as an Intune administrator. Learn links to RBAC for details and does not name specific roles. Scope tags limit filters to specific IT groups.

## Not covered on the page

The page does not describe an explicit Not applicable status. It says a filter result shows whether the app or policy applies. For status values, Learn points to the article on assignment filter reports and troubleshooting.

## A working approach

The steps below are practical advice, built on the Learn description.

1. Decide whether the question is about people or devices. If it is about people, a group may be enough.
2. Keep the group assignment simple and use the filter to narrow it.
3. Prefer one clear property per filter. Name filters after their rule, such as Windows 11 only.
4. Use Preview devices before you attach the filter.
5. Start with an assignment where a wrong match is easy to undo.
6. Document which assignments use which filter, because deletion is blocked until they are removed.

## Typical mistakes

- Mixing up include and exclude mode.
- Using a MAM filter on a compliance policy.
- Using filters where a dynamic group is the better tool, for example for Conditional Access.
- Writing nested expressions and then wondering why the rule builder is disabled.

## Related

- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)

## Sources

- [Use assignment filters in Microsoft Intune (Microsoft Learn)](https://learn.microsoft.com/intune/intune-service/fundamentals/filters)
