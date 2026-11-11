---
title: "How to find all external users with access to your SharePoint sites"
summary: "Find external users in SharePoint with three views: guest accounts in Microsoft Entra, Get-SPOExternalUser per site and sharing reports. Steps, limits, traps."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [guest-access, sharepoint-permissions, entra-external-id, sharepoint-essentials-toolkit]
keypoints:
  - "No single list shows every external person with access, because guest accounts, link-only access and per-site invitations live in different places."
  - "Microsoft Entra holds the guest accounts of the tenant, and Get-EntraUser with the filter userType eq 'Guest' lists them all."
  - "Get-SPOExternalUser lists external users per site, returns at most 50 users per call and pages with a Position value, so large sites need several calls."
  - "A guest report can miss people who use Anyone links, because those links grant access without a guest account."
  - "Combine the three views, then decide for each guest whether the access is still needed, who owns it and when it ends."
faq:
  - q: "How do I list all guest users in Microsoft 365?"
    a: "Use Microsoft Entra, where guest accounts live. With Entra PowerShell, connect with the User.Read.All scope and run Get-EntraUser with the filter userType eq 'Guest' and the -All switch. Select the display name, mail, created date and account state, and export the result to a CSV file for review."
  - q: "How do I see external users on one SharePoint site?"
    a: "Use Get-SPOExternalUser with the SiteUrl parameter to list external users for that site. PageSize must be 50 or less, and Position sets the start index, so you page through large lists. You can also open a file or folder, select Share, then Manage access, where external users carry an External User label."
  - q: "Can a guest report miss people who have access?"
    a: "Yes. Anyone links and similar links can give access without a guest account, so a list of guest users does not cover them. Review sharing links as well. The data access governance reports include sharing link activity for the last 28 days, which helps you see who created links."
---

To find external users in SharePoint, combine three views. Microsoft Entra lists the guest accounts of the whole tenant. The `Get-SPOExternalUser` cmdlet lists external users for each site. The sharing reports in the SharePoint admin center show links that can reach people who have no guest account. This article is for security admins who must answer, "Who outside our company can open our content?" You will get the steps for each view, the limits Microsoft documents, a worked example and the traps that lead to a list that is too short.

## Who counts as an external user?

Start with the definition, because it drives the method. An external user is a person outside your organization who can reach your content, and [guest access](https://www.m365.fm/entity/guest-access/) is the most common way they do. There are two main routes.

The first is a **guest account**. A guest is invited, accepts, and then exists as a user object in your directory. Microsoft Entra holds these accounts, and [Microsoft Entra External ID](https://www.m365.fm/entity/entra-external-id/) is the area that covers external collaboration. Guests show up in lists and can be reviewed, disabled or removed.

The second is a **link**. An Anyone link works without sign-in, so the person has no account in your directory and appears on no guest list. Microsoft's reference on [sharing settings](https://learn.microsoft.com/en-us/sharepoint/turn-external-sharing-on-or-off) describes four sharing levels: Anyone, new and existing guests, existing guests, and only people in your organization. Which levels your tenant allows decides how much of the problem sits in each route.

So a complete answer covers guest accounts and links. Treat any tool that shows only one of them as a partial answer.

## How do you list all guest accounts in Microsoft Entra?

Microsoft's page on [managing guest accounts with Entra PowerShell](https://learn.microsoft.com/en-us/powershell/entra-powershell/manage-guest-users?view=entra-powershell) gives the basic command. Connect with the scope `User.Read.All`, then run `Get-EntraUser` with the filter `userType eq 'Guest'` and the `-All` switch. Select the properties you need, for example display name, mail, created date and account enabled, and export them to a CSV file.

Microsoft lists the minimum roles for viewing guests: Guest Inviter or User Administrator. Disabling or removing guests needs the `User.ReadWrite.All` scope and the User Administrator role.

This list answers the tenant-level question: how many guests exist, and when were they created? It does not tell you which SharePoint sites they can reach. For that, you need the next two views.

## How do you find external users in SharePoint, site by site?

The cmdlet [Get-SPOExternalUser](https://learn.microsoft.com/en-us/powershell/module/microsoft.online.sharepoint.powershell/get-spoexternaluser?view=sharepoint-ps), documented in the SharePoint Online PowerShell reference, returns external users based on criteria. Four parameters matter:

- `-SiteUrl` limits the result to one site. Without it, you get external users for all sites.
- `-PageSize` sets the maximum number of users to return, and it must be 50 or less.
- `-Position` is the zero-based index of the first result, so you use it to page.
- `-Filter` limits results to users whose first name, last name or email begins with your text. Wildcards do not work.

The 50-user limit has a practical effect. A site with 130 external users needs three calls, with positions 0, 50 and 100. Write a small loop that increases the position until a call returns fewer than 50 users, and export each page.

Microsoft's notes also say that the page does not document the output properties, so check them with `Get-Member` before you build a report. There is also a switch that shows users who accepted an invite with a different account than the invited one. That is a useful clue for cleanup, because those users may be hard to match to a person.

## How do you find external access through links and reports?

Use the reports in the SharePoint admin center for the link route. Microsoft's page on [data access governance reports](https://learn.microsoft.com/en-us/sharepoint/data-access-governance-reports) describes sharing link reports that cover the last 28 days: Anyone links, People in the organization links and Specific people links. In PowerShell, the report entities include `SharingLinks_Guests` for Specific people links created in that period.

You can also use the per-user report for a list of guests. It shows every site a given user can reach and whether the access is for the full site or for items only. Because the report needs user principal names, use the full guest UPN, which contains `#EXT#`. The reports need SharePoint Advanced Management, so check the licensing page first.

For a single file or folder, open **Share**, then **Manage access**. According to Microsoft, external users appear by email address and carry the label External User. This is the right check when someone asks, "Who outside can open this contract?"

## What is a practical workflow?

Run the views in this order.

1. **Count the guests.** Use the Entra list to get the total and the creation dates.
2. **Map guests to sites.** For each important site, run `Get-SPOExternalUser -SiteUrl` with paging. Combine the results into one table with site, user and date.
3. **Add the link view.** Run the sharing link reports for Anyone and Specific people links.
4. **Assign an owner to each finding.** For every guest and every site, name a business owner who can say whether the access is still needed.
5. **Decide and act.** Remove, disable or keep with an end date. Write the decision down.

Step 4 is the one most teams skip. A list without owners is a list nobody acts on.

## Example: counting calls and findings for six sites

The numbers are invented to show the method. Entra shows 1,400 guest accounts in the tenant. You choose six sites with sensitive content. The external user counts are 130, 48, 75, 12, 210 and 5.

With a page size of 50, the number of calls per site is the count divided by 50, rounded up: 3, 1, 2, 1, 5 and 1. That is 13 calls in total for 480 external user entries. A short script handles that in minutes.

You then find that 62 of the 480 entries belong to guests whose project ended last year. Another 9 entries are guests who accepted with a different account than the invited one. Your actions: ask the six site owners to confirm the 62, disable those accounts after approval, and contact the 9 users to confirm who they are. The sharing link report adds 14 Anyone links on two of the six sites, which you hand to the owners for review.

The result is a short action list with names, not a vague worry. It also gives you numbers for the next audit: 480 external entries, 62 stale, 9 mismatched, 14 links.

## What should you do with the list afterwards?

A list of external users is only the start. Sort it by risk and by age, then decide in rounds.

- **Round one: stale guests.** Guests whose project has ended, or whose accounts you cannot match to a person. Disable them first. Disabling is reversible, while removing an account is not.
- **Round two: broad access.** Guests who can reach whole sites, not just single files. Ask the owner whether that scope is needed.
- **Round three: ownership.** Every remaining guest needs a named internal sponsor or site owner who vouches for the access and for its end date.

Keep a record of each decision. Next quarter, you run the same three views again and compare the numbers. A falling count of stale guests is the best sign that the routine works. If the count rises, look at how guests get invited and who is allowed to invite them.

## Common mistakes

- **Relying on the guest list alone.** Anyone links give access without a guest account.
- **Ignoring paging.** With a limit of 50 per call, a first call alone shows a fraction of the users on big sites.
- **Deleting before asking.** Removal of a guest account cannot be undone, so disable first and confirm with the owner.
- **Looking only at the tenant.** A guest list shows who exists, not where they have access.
- **No owner per finding.** Without an owner, the list ages and the access stays.

## How software can help

The built-in route is Microsoft Entra, the SharePoint Online PowerShell module and the data access governance reports. They cover the three views, but you must join the results yourself. A reporting tool can bring permission reports and sharing links into one place. Cognillo's [SharePoint Essentials Toolkit](https://www.m365.fm/entity/sharepoint-essentials-toolkit/) is one example. According to its product page, it offers permission reports for sites, folders and items, can show everything one person can access, and reports on sharing links. These are the vendor's statements and M365.FM did not test them. Compare any tool with the built-in views before you decide.

Disclosure: Cognillo sponsors M365.FM.

## Next step

Run the Entra guest list today, pick the three sites with the most sensitive content, and find the external users on those sites with Get-SPOExternalUser. Send each site owner their list and ask for a decision within two weeks.
