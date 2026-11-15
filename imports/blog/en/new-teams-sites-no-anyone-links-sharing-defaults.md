---
title: "Why Anyone Links Are Missing on Teams Sites and How to Change the Sharing Defaults"
summary: "The tenant allows Anyone links, but new Teams sites do not offer or preselect them. Check the site sharing level, the default link type and sensitivity labels, in that order, and change only the sites you mean to."
status: approved
publish: false
author: mirko-p
date: 2026-11-13
topics: [sharepoint, sharepoint-sharing-links, microsoft-365-groups, sensitivity-labels, guest-access]
keypoints:
  - "Each site has its own external sharing level, and it can never be more open than the organization setting."
  - "The sharing level (what is allowed) and the default link type (what the Share dialog preselects) are two separate settings, and you may need to change both."
  - "Learn says you need at least the SharePoint Administrator role to change a site's sharing level in the admin center. Site owners cannot."
  - "Per Learn, group-connected sites such as Teams sites do not default to Only people in your organization, so an org-only result calls for a check of guest settings, labels and past changes."
  - "A script that loops over all team sites changes old sites too. Target specific sites, or use a sensitivity label, and test on one new team first."
faq:
  - q: "Why does the Share dialog on a new team site not offer Anyone links?"
    a: "The organization setting only sets the ceiling. Each site has its own sharing level that must be the same or more restrictive. If the site is set to a lower level, or the organization level is not Anyone, the Anyone option is missing. An administrator with at least the SharePoint Administrator role can change the site level under Active sites."
  - q: "What is the difference between the sharing level and the default link type?"
    a: "The sharing level decides which kinds of sharing are allowed on the site (for example Anyone, New and existing guests, Existing guests, or Only people in your organization). The default link type decides which link the Share dialog preselects: Anyone, People in your organization or Specific people. In the admin center the default link settings sit under Sharing for the site, and you clear Same as organization-level setting before you change them."
  - q: "Can a sensitivity label set the default sharing link for new sites?"
    a: "Yes. Microsoft Learn says a label whose scope includes Groups & sites can set the default sharing link type and permission through the AdvancedSettings parameter of Set-Label or New-Label in Security & Compliance PowerShell. Users can still change the link type before they send the link. Learn does not say what happens to existing sites when you apply such a label."
  - q: "Do Anyone links work in a Teams shared channel site?"
    a: "No. Microsoft Learn says Anyone links cannot be used with files in a Microsoft Teams shared channel site. Specific people links to such files can only go to other people in the channel."
---

An administrator set the tenant to the most open sharing level and chose "Anyone with the link" for files and folders. Yet every site that was created with a new team showed "People in your organization" only, so the admin had to change each one by hand. In a second thread, a user could not find an "All users with the link" option at all. These two Microsoft Q&A threads (October 2025 and August 2026) are common, and in both the asker accepted an answer. Neither asker wrote what the result was, so this article checks the advice against current Microsoft Learn pages. It is a troubleshooting guide, not an official Microsoft procedure.

## What the symptoms look like

- The Share dialog on a team site does not offer **Anyone**, or it preselects **People in your organization** or **Specific people**.
- The site's sharing setting in the SharePoint admin center is lower than the organization setting.
- A user without admin rights has no way to open the setting.

## Step 1: Understand the three layers

Microsoft Learn describes three shareable link types: **Anyone**, **People in your organization** and **Specific people**. The default link settings also offer **People with existing access**. These layers control which one a user can pick:

1. **Organization level.** In the SharePoint admin center, expand **Policies**, select **Sharing**, and look at **External sharing** for SharePoint and OneDrive. Learn lists the options **Anyone**, **New and existing guests**, **Existing guests** and **Only people in your organization**.
2. **Site level.** Each site has its own setting, and Learn says it must be at the same or a more restrictive level than the organization.
3. **Default link settings.** These decide what the Share dialog preselects. Learn says the default link setting applies only to libraries that use the new experience.

If you set the organization to Anyone and a site stays lower, users of that site cannot create Anyone links. If you set the site to Anyone and the organization is lower, the organization wins.

## Step 2: Check what a new site gets by default

Learn gives a table of default sharing levels by site type. For classic sites, communication sites and modern sites without a group, the default is **Only people in your organization**. OneDrive defaults to **Anyone**. For group-connected sites, including Teams sites, the table says the default is **New and existing guests** if the group setting **Let group owners add people outside the organization to groups** is On, and **Existing guests** otherwise. The root communication site (`<tenant>.sharepoint.com`) defaults to **Anyone**.

This means the Learn table does not list "Only people in your organization" as the default for a group-connected site. In the first thread, the asker saw that value, and the moderator said new sites use safer defaults than the tenant setting, without a citation. So when you see org-only on a new team site, check these before you assume a default:

- the group-level guest setting named above
- guest settings for Microsoft 365 Groups and Teams, which Learn says affect the connected SharePoint site
- Microsoft Entra external collaboration settings, which control who can invite guests
- a sensitivity label on the team (see step 5)

## Step 3: Change the sharing level of a site

Learn says you must be at least a SharePoint Administrator to change the setting, and site owners cannot. In the SharePoint admin center:

1. Open **Active sites** and select the site.
2. On the **Settings** tab, select **More sharing settings**.
3. Choose the option you want, for example **Anyone**, and select **Save**.

For a user who is not an admin, the accepted reply in the second thread says to use **Specific people**, enter the full email address of the external person and send the link. Learn says Specific people links can go to people inside or outside the organization, and the recipient has to sign in.

## Step 4: Change the default link type

Learn describes this for one site:

1. In **Active sites**, select the site and choose **Sharing** on the command bar.
2. Under **Default sharing link type**, clear **Same as organization-level setting**, pick the type and select **Save**.
3. For the default permission, clear the checkbox under **Default link permission** and pick a setting.

For a Teams private or shared channel site, Learn says to use `Set-SPOSite` instead.

## Step 5: PowerShell for several sites

The moderator's reply in the first thread (the one the asker accepted) offered a script that finds all active sites with the template `GROUP#0` and sets the sharing level and default link on each. Two points about it:

- The date filter in the script was commented out, so it hits every team site, not only new ones. Review the target list before you run it.
- The template code `GROUP#0` comes from the thread. I did not verify it in Learn.

The cmdlet parameters themselves are documented. Connect with `Connect-SPOService -Url https://<tenant>-admin.sharepoint.com`, then for one site:

```powershell
Set-SPOSite -Identity https://contoso.sharepoint.com/sites/TeamA -SharingCapability ExternalUserAndGuestSharing
Set-SPOSite -Identity https://contoso.sharepoint.com/sites/TeamA -DefaultShareLinkScope Anyone
```

Learn describes `-SharingCapability` values as follows: `Disabled` means sharing outside the organization is disabled. `ExistingExternalUserSharingOnly` allows only external users already in the directory. `ExternalUserSharingOnly` enables sharing by email but not anonymous links. `ExternalUserAndGuestSharing` enables both.

For the default link, the thread's script uses `-DefaultSharingLinkType AnonymousAccess`. The Learn reference describes that parameter as to be replaced by `-DefaultShareLinkScope`, with the values `Anyone`, `Organization`, `SpecificPeople` and `Uninitialized`, so the example above uses the newer one. Learn also says `-DefaultLinkToExistingAccess $true` overrides the default link type, so set it to `$false` if "People with existing access" keeps winning. Another parameter, `-OverrideSharingCapability`, is documented with the remark that the effective site setting is the most restrictive of tenant, partition and site unless you set it to `$true`.

## Step 6: Use a sensitivity label for new sites

The first thread also suggested a Purview sensitivity label for groups and sites. Learn confirms the default-link part. A label whose scope includes **Groups & sites** can set the default sharing link type for the site, and the default is preselected when users select **Share**. Users can still override it. You configure it with `Set-Label` or `New-Label` and `-AdvancedSettings` in Security & Compliance PowerShell. The settings are `DefaultSharingScope` (`SpecificPeople`, `Organization` or `Anyone`), `DefaultShareLinkPermission` (`View` or `Edit`) and `DefaultShareLinkToExistingAccess`.

I did not verify the thread's other claims about the label's own external sharing option in the Purview portal. The Learn page also does not say what happens to existing sites when you apply a label, so test with one new team before you publish a label to everyone who creates teams.

## Step 7: Verify

1. Create a new test team.
2. In **Active sites**, open the site and check the sharing level under **More sharing settings**.
3. In the library, select **Share** and confirm the preselected link type.

## Limits and open points

- Neither asker confirmed the outcome in writing. They accepted an answer, nothing more.
- "People in your organization" links do not work for guests in the directory, according to Learn, and Anyone links are not allowed in shared channel sites.
- An organization that turns Anyone links on widely should check the governance side first. Learn describes Anyone links as freely transferable, and says access through them cannot be audited.

## Related

- [SharePoint sharing links](https://www.m365.fm/entity/sharepoint-sharing-links/)
- [Microsoft 365 Groups](https://www.m365.fm/entity/microsoft-365-groups/)
- [Sensitivity labels](https://www.m365.fm/entity/sensitivity-labels/)
- [Guest access](https://www.m365.fm/entity/guest-access/)
- [SharePoint](https://www.m365.fm/entity/sharepoint/)

## Sources

- [Microsoft Learn: Manage sharing settings for SharePoint and OneDrive](https://learn.microsoft.com/en-us/sharepoint/turn-external-sharing-on-or-off)
- [Microsoft Learn: Change the external sharing setting for a site](https://learn.microsoft.com/en-us/sharepoint/change-external-sharing-site)
- [Microsoft Learn: Change the default sharing link for a site](https://learn.microsoft.com/en-us/sharepoint/change-default-sharing-link)
- [Microsoft Learn: How shareable links work in OneDrive and SharePoint](https://learn.microsoft.com/en-us/sharepoint/shareable-links-anyone-specific-people-organization)
- [Microsoft Learn: Set-SPOSite](https://learn.microsoft.com/en-us/powershell/module/sharepoint-online/set-sposite)
- [Microsoft Learn: Use sensitivity labels to configure the default sharing link type](https://learn.microsoft.com/en-us/purview/sensitivity-labels-default-sharing-link)
- [Microsoft Q&A: SharePoint Collaboration Site External Sharing settings keep defaulting to Only People in my organization (October 2025)](https://learn.microsoft.com/en-us/answers/questions/5588742/sharepoint-collaboration-site-external-sharing-set)
- [Microsoft Q&A: SharePoint external user sharing (August 2026)](https://learn.microsoft.com/en-us/answers/questions/5972943/sharepoint-external-user-sharing)
