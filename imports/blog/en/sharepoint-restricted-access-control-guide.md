---
title: "Restricted Access Control for SharePoint sites: when to use it"
summary: "SharePoint restricted access control limits a site to named groups, even for people with permissions or links. See when to use it, setup steps and limits."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [restricted-access-control, sharepoint-permissions, sharepoint-advanced-management, oversharing]
keypoints:
  - "Restricted access control limits a site and its content to members of up to 10 named Microsoft Entra security groups or Microsoft 365 groups."
  - "It overrides existing permissions and sharing links: someone outside the group is denied, even with direct file access or a link that worked before."
  - "Group membership alone grants nothing. A person still needs a normal permission to the site or its content."
  - "Search and Copilot honor the policy, so users outside the group do not see the site's content there, though the search index can take time to catch up."
  - "Use it for a few truly sensitive sites, such as a due diligence site, because it is a site-by-site control that does not scale to dozens of overshared sites."
faq:
  - q: "What does restricted access control do in SharePoint?"
    a: "It limits access to a site and its content to users in specified Microsoft Entra security groups or Microsoft 365 groups. People outside those groups are denied, even if they had permissions or a sharing link. Users need both the site permission and membership in the control group. Microsoft says you can name up to 10 groups per site."
  - q: "Does adding someone to the control group give them access?"
    a: "No. Restricted access control narrows who can use existing permissions. It does not create new ones. A user added to the group still needs a permission to the site or its content, granted the normal way. This is why you need both the group membership and a regular permission to open anything."
  - q: "Does restricted access control affect Copilot and search?"
    a: "Yes. Microsoft states that organization-wide search and Copilot honor the policy, so users who are denied cannot see the site's content in either. File access is enforced right away, but the search index needs time to reflect the policy, and larger sites take longer. Test with a user account that should be blocked."
---

SharePoint restricted access control limits a site and its content to the members of the groups you name, even for people who already have permissions or a sharing link. Use it for the few sites where "only this group" must be true: a due diligence room, a legal case, an executive site. This article is for SharePoint admins who need a hard boundary, not just a hidden site. You will learn how it works, how to set it up, what to watch for with sharing, and see a worked example.

## What does SharePoint restricted access control do?

Microsoft's page on [restricting site access with groups](https://learn.microsoft.com/en-us/sharepoint/restricted-access-control) describes it. The policy limits access to a SharePoint site and its content to users in a specified Microsoft Entra security group or Microsoft 365 group, called the control group. The policy is evaluated when a user opens a site or accesses a file.

The rules that matter:

- Users outside the group cannot access the site or its content, even if they had prior permissions or a shared link.
- Users need both the site or content permission and membership in the control group.
- Adding people to the control group does not grant access by itself.

In other words, [restricted access control](https://www.m365.fm/entity/restricted-access-control/) narrows who can use their existing permissions. It does not create new ones. Microsoft's training module on [locking down sites](https://learn.microsoft.com/en-us/training/modules/govern-sharepoint-onedrive-copilot/7-restricted-access-control) puts it this way: the check on group membership comes before any permission or link is evaluated.

That makes it different from tools that only hide a site. If a person is outside the group, the door is closed.

## Which sites does it support?

Microsoft lists four site types: Microsoft 365 group-connected sites, Teams-connected sites, non-group-connected sites and OneDrive.

There is one trap. Shared channel and private channel sites are separate site collections. Team-level restricted access control does not apply to them, so you must configure it on each of them separately as a non-group-connected site.

For group-connected sites, the connected Microsoft 365 group is the default control group, shown as the Default group. You can keep it and add other groups. Microsoft says you can use up to 10 Microsoft Entra security groups or Microsoft 365 groups per site, with at least one group configured for the policy to apply. Dynamic security groups can be used when you want membership based on user properties.

The page does not state a maximum number of protected sites, and it lists the SharePoint Advanced Management prerequisites without naming licenses inline. Check the [SharePoint permissions](https://www.m365.fm/entity/sharepoint-permissions/) model of each site before you turn it on, because the policy sits on top of it.

## How do you set it up?

Start at the tenant level. In the SharePoint admin center, go to Policies, then Access control, then Site-level access restriction, select Allow access restriction and save. In PowerShell, run Set-SPOTenant with the EnableRestrictedAccessControl parameter set to true. Microsoft says it can take up to one hour to take effect.

Then set the policy for each site. In the admin center, go to Sites, Active sites, select the site, open the Settings tab and edit Restricted site access. Check the option to restrict access to users in specified groups, add the groups and save. In PowerShell, you use Set-SPOSite with these parameters:

- **RestrictedAccessControl** turns the policy on for the site.
- **AddRestrictedAccessControlGroups** adds groups by their IDs.
- **RestrictedAccessControlGroups** replaces the list of groups.
- **RemoveRestrictedAccessControlGroups** removes groups.
- **ClearRestrictedAccessControl** resets the policy.

You can read the current state with Get-SPOSite and the RestrictedAccessControl properties. Write down the group IDs and the reason for each site in a register. Six months later, nobody will remember why a site has three groups.

## What happens to sharing links and guests?

This is where mistakes happen. Microsoft states that users who have a shared link or earlier permissions but are not in the control group are denied access. The policy overrides both.

Sharing outside the control group is off by default. To keep it blocked, the tenant setting AllowSharingOutsideRestrictedAccessControlGroups must be false. With that setting, sharing with users outside the group is blocked. Sharing with groups is allowed only for Microsoft Entra security groups or Microsoft 365 groups that are in the policy's group list. Other groups, including Everyone except external users and SharePoint groups, are blocked. Nested security groups inside the policy groups can be used.

For shared channel sites, the page says the policy applies only to internal users in the resource tenant. External participants are not evaluated against it, so their access depends on the shared channel and site permissions. Review those sites by hand.

The same page notes that delegation to site admins is off by default. If you turn it on with the DelegateRestrictedAccessControlManagement setting, site admins must provide a justification whenever they update the policy.

## What happens in search and Copilot?

Microsoft states that organization-wide search and Microsoft Copilot honor the policy. Users who are denied cannot see the site's content in either, and users with direct file permissions who are outside the control group do not see those files in search or Copilot.

There is a timing detail. File access is enforced immediately, but the search index takes time to reflect the policy, and larger sites take longer. The training module recommends verifying with a test account that should be blocked before you assume the restriction is fully in effect. Do that test, and write down the result.

For reporting, Microsoft documents two PowerShell reports. One lists the protected sites, and the other shows actions blocked by the policy, with options such as all denials, top users, top sites and site distribution. The reports can take a few hours. Policy changes and admin justifications also appear as audit events in the Microsoft Purview portal.

## Example: a due diligence site for 25 people

The numbers are invented to show the method. A company prepares to buy a smaller firm. The deal team has 15 internal members, 6 advisers from two outside firms and 4 lawyers. The data room is a SharePoint site that holds 900 documents. The site has existing sharing links to 11 people and a company-wide Visitors group from an old template.

The admin does the following:

1. Creates one security group for the deal team with 25 members, and a second group for the 4 lawyers.
2. Turns on restricted access control for the site with both groups, so access is limited to those 25 people.
3. Keeps sharing outside the groups blocked with the tenant setting.
4. Tests with a regular employee account, which must be denied, and with an adviser account, which must get in.
5. Checks the search result after a few hours, then after a day.

The test shows that the company-wide Visitors group no longer gives access, and the 11 old links work only for people in the groups. Two of the old link holders were not in the deal team, and they are now denied. The admin sends the sponsor a list of those two, and the sponsor decides they should not have had access at all.

Count the effect. Access dropped from the whole company to 25 named people, and the register records who approved the list and when the deal should end. After closing, the admin removes the policy and archives the site. A hard boundary was proportionate here, because a leak would be expensive.

## Common mistakes

- **Using it for every site.** It is a site-by-site control, and it often is stricter than most sites need.
- **Assuming group membership grants access.** Users still need a normal permission.
- **Forgetting private and shared channel sites.** They need their own configuration.
- **Skipping the test account.** The search index may lag behind the file access.
- **Leaving the sharing setting open.** Keep sharing outside the groups blocked unless you have a reason.
- **No register.** Without group names and reasons, nobody can maintain the policy.

## How software can help

Start with the SharePoint admin center, the PowerShell cmdlets and the two Microsoft reports. If you protect many sites, a script can export the groups per site and compare them with the current membership, so you see who has dropped out of the control group. A reporting tool can combine those lists with site owners and last activity. Compare the output of any tool with the Microsoft reports on a few sites before you rely on it.

## Next step

Pick the one site where "only this group" must be true, and plan restricted access control for it this week. Name the group, the owner and the review date, then test it with an account that should be denied.
