---
title: "Microsoft 365 group naming and expiration policies: a setup guide"
summary: "Set up a Microsoft 365 group expiration policy and a naming policy in Entra ID: lifetime, renewal, notices, prefixes and blocked words, plus the Teams effects."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [group-expiration-policy, group-naming-policy, microsoft-365-groups, teams]
keypoints:
  - "A naming policy uses the structure Prefix[GroupName]Suffix, allows 63 characters in total and supports a blocked-word list of up to 5,000 phrases."
  - "The expiration policy needs a lifetime of at least 30 days, and Microsoft Entra allows only one expiration policy for all Microsoft 365 groups."
  - "Owners get renewal emails 30 days, 15 days and 1 day before expiry, unless activity in SharePoint, Outlook, Teams or Viva Engage renews the group automatically."
  - "An expired group is deleted one day after its expiration date and can be restored within 30 days."
  - "Name an alternate notification address for groups without an owner, and test both policies with a small set of groups first."
faq:
  - q: "How long can a Microsoft 365 group live before it expires?"
    a: "You set the group lifetime in days, either with a preset value or a custom value, and Microsoft states it must be 30 days or more. Many tenants choose 180 or 365 days. Activity in the group's apps can renew the group automatically, so the lifetime acts as a limit for groups that nobody uses, not for active ones."
  - q: "What happens to a Team when its group expires?"
    a: "The group is deleted one day after the expiration date, and its Team goes with it. Owners can restore the group within 30 days, and admins can restore any group. Data from apps such as Planner, sites or Teams is permanently deleted 30 days after the group is deleted, unless a legal hold or retention policy applies."
  - q: "Can I exclude certain groups from the expiration policy?"
    a: "Microsoft's policy has three scope options: all groups, selected groups or none. There is no exclusion list. To exclude groups, choose Selected and list the groups that should expire, up to 500 groups. If you need more than 500, you can enable expiration for all groups, and the 500-group limit then no longer applies."
---

To set up Microsoft 365 group policies, create the naming policy first so that new groups follow one pattern, then add an expiration policy with a lifetime of at least 30 days, a notification address for groups without owners and a short test group list. This guide is for the Microsoft 365 admin who wants clean names and fewer abandoned groups, including the Teams that sit on top of them. It covers what each policy does, how to configure them, what happens when a group expires, and how to roll both out without surprises.

## What the two policies do

A [Microsoft 365 group](https://www.m365.fm/entity/microsoft-365-groups/) is the membership object behind a team, a connected SharePoint site and other resources, so one policy on the group affects all of them. Two policies matter for housekeeping:

- The **[group naming policy](https://www.m365.fm/entity/group-naming-policy/)** controls how names and aliases look. It adds prefixes and suffixes, and blocks words you do not want in group names.
- The **[group expiration policy](https://www.m365.fm/entity/group-expiration-policy/)** controls how long a group lives. Groups that nobody uses expire and are deleted, and active groups renew themselves.

Both are features of Microsoft Entra ID and need licenses. The naming policy, according to Microsoft, requires that you possess but not necessarily assign a Microsoft Entra ID P1 or Microsoft Entra Basic EDU license for each unique user who is a member of one or more Microsoft 365 groups. The expiration policy requires that you possess but not necessarily assign P1 or P2 licenses for the members of all groups to which the policy is applied.

## Set up the group naming policy

Microsoft's article on [enforcing a group naming policy](https://learn.microsoft.com/en-us/entra/identity/users/groups-naming-policy) describes two parts: prefixes and suffixes, and a list of blocked words. For Teams, this is your Teams naming convention policy, because the policy applies to the groups behind teams.

### Prefixes and suffixes

The general structure is `Prefix[GroupName]Suffix`. You can define several prefixes and suffixes, but only one `[GroupName]`. The total allowed length of the prefix and suffix strings, including the group name, is 63 characters. The supported user attributes are Department, Company, Office, StateOrProvince, CountryOrRegion and Title. Microsoft advises to use attributes that have values for all users and not to use attributes with long values. Unsupported attributes are treated as fixed strings, so a typo creates a literal name.

A practical pattern is `GRP_[GroupName]_[Department]`, which makes a group from the finance department easy to recognize in lists, reports and the Teams client. Keep it short, because every character of the pattern is taken from the 63.

### Blocked words

A blocked word list is a comma-separated list of phrases. Matching is exact and not case sensitive, with no substring search, so blocking "lass" does not block "Class". The upper limit is 5,000 phrases. Use it for words that cause confusion or risk, such as protected department names.

### Where it applies

The policy applies when groups are created or edited across workloads such as Outlook, Teams, SharePoint, Exchange and Planner, and it is applied to both the group name and the alias. Existing groups are not changed when you save the policy. After a group owner edits the name, the policy is enforced, even if the name does not change. Global Administrators and User Administrators are exempt from the policy.

To configure it, sign in to the Microsoft Entra admin center as at least a Group Administrator, open the groups area, select Naming policy, and choose Group naming policy or Blocked words. Save for the change to take effect.

## How the Microsoft 365 group expiration policy works

Microsoft's article on [setting expiration for Microsoft 365 groups](https://learn.microsoft.com/en-us/entra/identity/users/groups-lifecycle) explains the mechanics:

- **One policy.** You can configure only one expiration policy for all Microsoft 365 groups in a Microsoft Entra organization.
- **Lifetime.** You set the group lifetime in days, with a preset or custom value of 30 days or more.
- **Scope.** All groups, selected groups or none. With Selected, you can add up to 500 groups.
- **Renewal.** Owners can renew their groups. Groups Administrators or User Administrators can renew any Microsoft 365 group.
- **Automatic renewal.** Activity renews a group without a notification to the owner. SharePoint activity such as viewing, editing, downloading, moving, sharing or uploading files counts. So does joining a group or reading and writing group messages in Outlook, visiting a Teams channel, and viewing a post in a Viva Engage community.
- **Notices.** If a group is not renewed automatically, owners receive emails 30 days, 15 days and 1 day before expiry. For groups without an owner, Microsoft lets you specify an address that receives the renewal and expiration notices.
- **Deletion.** The group is deleted one day after the expiration date. Microsoft states that it never deletes a group before the last email is sent.

Existing groups need special attention. When you switch the policy on, any group older than the lifetime is set to 35 days until expiration, unless it is renewed automatically or by its owner. With a lifetime of 30 days, Microsoft Entra first waits five days before sending any email, to avoid notifying groups that have no activity record yet.

## Set up the expiration policy

Microsoft's article documents the configuration with PowerShell. With the Microsoft Graph module, `New-MgGroupLifecyclePolicy` creates the policy with the lifetime in days, the managed group types and the alternate notification address. `Get-MgGroupLifecyclePolicy` shows it, `Update-MgGroupLifecyclePolicy` changes it, and `Remove-MgGroupLifecyclePolicy` removes it and disables expiration.

Follow this order:

1. **Decide the lifetime.** Choose a value that fits your business. A longer lifetime gives owners more time, a shorter lifetime cleans faster.
2. **Choose the scope.** Start with Selected and a test list, for example 20 groups from one department.
3. **Set the alternate notification address.** Use a shared mailbox that someone reads, so notices for ownerless groups do not vanish.
4. **Inform the owners.** Tell them what the emails look like and what to click.
5. **Watch for a cycle.** Check which groups received notices and which were renewed.
6. **Extend the scope.** Move to All when the process works.

## What expiry means for Teams and SharePoint

A team is a group with extra features, so expiry affects [Teams](https://www.m365.fm/entity/teams/) and the site. Expiration notices for groups used in Teams appear in the Teams owners feed, and visiting a Teams channel counts as activity that renews the group. After deletion, the group can be restored within 30 days, and Microsoft states that this period is not customizable. Restoring a group that contains documents or SharePoint sites can take up to 24 hours. Data from apps such as Planner, sites or Teams is permanently deleted 30 days after the group is deleted, unless a legal hold or retention policy applies.

This matters for your communication. Tell team owners that a team without activity can disappear, and that an ownerless team is the highest risk, because no owner is there to renew it, and only an admin can step in. Connect this process with your ownerless-team checks, because a notice that reaches nobody is useless.

## Example: 2,500 groups and a 365-day lifetime

This example uses invented numbers. A tenant has 2,500 Microsoft 365 groups and sets a lifetime of 365 days for all groups, with an alternate notification address for ownerless groups.

- **Auto-renewed:** 1,800 groups show activity and renew themselves without an email.
- **Renewed by owners:** 450 groups receive a notice, and the owners renew them.
- **Expired:** 250 groups get no response and are deleted one day after the expiration date.
- **Restored:** within 30 days, 10 owners ask for restoration, and the admin restores them.

The check: 1,800 + 450 + 250 = 2,500. In this example, 10 percent of the groups expire and 240 groups remain deleted, and no active group is lost because activity renews them. The admin also finds 120 groups without an owner among the 250 that expired. Their notices went to the shared mailbox, which is why the address matters.

## Common mistakes

- **Starting with all groups.** Test with selected groups, because the 35-day countdown for old groups surprises owners.
- **No address for ownerless groups.** Notices without a recipient do not renew anything.
- **Naming pattern too long.** The 63-character limit includes the group name, so long prefixes cut the room for real names.
- **Expecting the naming policy to rename old groups.** It applies when an owner edits the group.
- **Forgetting the licenses.** Both policies need Microsoft Entra ID licenses for the members.
- **Ignoring retention.** A retention policy or legal hold changes what happens to the data after deletion.

## How software can help

The Microsoft Entra admin center covers the naming policy, and PowerShell covers the expiration policy, so no extra tool is needed to configure both. A simple report of groups, owners and expiration dates helps you see which groups will receive notices next. Judge any additional tool by whether it shows owners, last activity and the expiration date in one list, and whether it helps owners answer without asking the admin.

## Next step

Create the naming policy and an expiration policy for a test list of 20 groups, with an alternate notification address that someone reads. Then check after one notice cycle whether your Microsoft 365 group expiration policy renews the active groups and flags the right ones.
