---
title: "Migrate From the MSOnline and Azure AD PowerShell Modules to Microsoft Graph PowerShell"
summary: "A migration plan for MSOnline and AzureAD scripts: Microsoft's deprecation and retirement timeline, how to find usage, and the cmdlet, permission and output changes when moving to Microsoft Graph PowerShell."
status: review
publish: false
author: mirko-p
date: 2026-12-22
topics: [microsoft-graph-powershell, powershell]
keypoints:
  - "Learn says the Azure AD, Azure AD Preview and MSOnline PowerShell modules are deprecated and Microsoft Graph PowerShell is the module to use."
  - "Per Microsoft's March 2025 update post, MSOnline retirement started in April 2025 and AzureAD support ended on March 30, 2025."
  - "Find usage with the Entra recommendation about retiring MSOnline and AzureAD usage, and by filtering sign-in logs for Azure Active Directory PowerShell."
  - "Migrate in order: document scripts, start with simple ones, map cmdlets, parameters and filters, then request least-privilege scopes."
  - "Output objects changed. Check them with Get-Member, and use -ConsistencyLevel eventual for Count, Filter and Search."
faq:
  - q: "Are the MSOnline and AzureAD modules still supported?"
    a: "Microsoft Learn says the Azure AD, Azure AD Preview and MSOnline modules are deprecated. A Microsoft Entra blog post updated in March 2025 gave March 30, 2025 as end of support and described the MSOnline retirement as starting in April 2025. Check the current Microsoft announcements for the latest status."
  - q: "How do I find scripts that still use the old modules?"
    a: "The Entra blog post recommends the Entra recommendation Migrate from the retiring MSOnline and AzureAD PowerShell usage to Microsoft Graph PowerShell, which covers the last 30 days, and a review of sign-in logs filtered to the application Azure Active Directory PowerShell."
  - q: "Which cmdlet replaces Get-AzureADUser?"
    a: "Learn gives Get-MgUser as the equivalent and points to the cmdlet map for others. The page example uses Connect-MgGraph with the User.Read.All scope."
  - q: "Why does my search filter fail after migrating?"
    a: "Learn says the equivalent of -SearchString is -Search used with -ConsistencyLevel eventual, or you can use -Filter. The ConsistencyLevel parameter enables Count, Filter and Search for advanced queries."
  - q: "Do I get permissions automatically in Graph PowerShell?"
    a: "No. Learn says permissions are not pre-authorized. You request the scopes your script needs, for example with Connect-MgGraph -Scopes, and Learn recommends dedicated apps and least privilege."
---

Scripts written for the MSOnline or AzureAD modules need to move to Microsoft Graph PowerShell. Microsoft Learn states that Azure AD, Azure AD Preview and MSOnline are deprecated, and that Microsoft Graph PowerShell is the module for working with Microsoft Entra ID and other Microsoft services. This guide covers the timeline, how to find what you still run, and the migration steps from Learn.

## Timeline

The Microsoft Entra blog post "Action required: MSOnline and AzureAD PowerShell retirement - 2025 info and resources", published January 13, 2025 and last updated March 13, 2025, gave this schedule:

| Module | End of support | Retirement |
| --- | --- | --- |
| MSOnline | March 30, 2025 | Early April to late May 2025 |
| AzureAD | March 30, 2025 | After July 1, 2025 |

Both modules were deprecated on March 30, 2024, according to the post. It also described temporary outages for MSOnline in early 2025 where cmdlets failed with a message that MS Online PowerShell is disallowed. Those dates are in the past as of this article, and I did not re-verify the live status of each module, so check current Microsoft announcements before you rely on a leftover script. The post does not mention the AzureAD-Preview module at all.

## Step 1: find what still uses the old modules

The blog post suggests:

1. Check the Entra recommendation **Migrate from the retiring MSOnline and AzureAD PowerShell usage to Microsoft Graph PowerShell**, under **Identity** > **Overview** > **Recommendations**. It covers the last 30 days.
2. Review sign-in logs and filter the application to **Azure Active Directory PowerShell**, for both interactive and non-interactive sign-ins.

Scripts that run on a schedule from a server are the easy ones to miss, so search script repositories and scheduled tasks as well. That search is general advice, not a step from the Learn page.

## Step 2: document the current scripts

Learn's migration page starts with an inventory. For each script, record:

- Purpose, location, frequency of execution, importance and length
- Cmdlets used and the number of calls
- Whether it is still required, or whether existing or new product functionality can do the same job
- Improvement points, such as filtering to the left of the pipeline, using modern authentication or running PSScriptAnalyzer

You can score scripts by adding the criteria scores to set an upgrade order. The page's example rates importance as Critical (4), High (3), Medium (2) or Low (1).

## Step 3: update the scripts

Learn lists these steps:

1. **Start simple.** Test with the least complex, least business-critical scripts first.
2. **Map cmdlets.** Use the cmdlet map to find equivalents.
3. **Map parameters and switches** to Microsoft Graph PowerShell syntax.
4. **Map filters** to the new syntax.
5. **Read the cmdlet documentation.** Samples are added frequently.
6. **Use dedicated apps and least privilege.** Permissions are not pre-authorized, so request them as needed.
7. **Find required permissions** with `Find-MgGraphCommand` and `Find-MgGraphPermission`.
8. **Inspect output objects** with `Get-Member`, because the output objects changed.
9. Optionally, learn the underlying API with `Find-MgGraphCommand`, Graph Explorer and the API reference.

## Example: Get-AzureADUser

`Get-AzureADUser` maps to `Get-MgUser`. The Learn example:

```powershell
Connect-MgGraph -Scopes 'User.Read.All'
Get-MgUser -ConsistencyLevel eventual -Count userCount -Filter "startsWith(DisplayName, 'a')" -Top 1
```

The `-ConsistencyLevel` parameter enables `Count`, `Filter` and `Search` as advanced queries.

## Tips from the page

- The equivalent of `-SearchString` is `-Search` together with `-ConsistencyLevel eventual`. You can also use `-Filter`, for example `Get-MgUser -Filter "DisplayName eq 'Lee Gu'"`.
- Pass nested parameters as hash tables.
- Request only the scopes the script needs. The first run asks for consent for those scopes.

## Step 4: remove the old modules

Learn's next-steps list links to uninstalling AzureAD PowerShell before installing the new module, and to installing the Microsoft Graph PowerShell SDK. Do this after the scripts are tested, not before.

## Microsoft Entra Connect Sync note

The blog post says that if you use Microsoft Entra Connect Sync, you should upgrade to the latest version before April 7, 2025, because installation wizard versions older than 2.4.18.0 are affected until the client is updated. If that date has passed in your environment, confirm your version is current.

## What the pages do not say

The Learn migration page gives no retirement dates, and the blog post is the only source for the timeline here. The page also does not map every cmdlet. Use the official cmdlet map rather than guessing equivalents, and test each converted script against a non-production tenant first.

## Related

- [Microsoft Graph PowerShell](https://www.m365.fm/entity/microsoft-graph-powershell/)
- [PowerShell](https://www.m365.fm/entity/powershell/)

## Sources

- [Migrate from Azure AD and MSOnline PowerShell to Microsoft Graph PowerShell](https://learn.microsoft.com/powershell/microsoftgraph/migration-steps)
- [Action required: MSOnline and AzureAD PowerShell retirement, 2025 info and resources (Microsoft Entra Blog)](https://techcommunity.microsoft.com/blog/identity/-/4364991)
