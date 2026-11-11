---
title: "Guest access or sharing links: which should you use for outsiders?"
summary: "Guest access vs sharing links in SharePoint: when to invite a guest, when a Specific people link is enough and when an Anyone link fits. With a worked example."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [guest-access, sharepoint-sharing-links, entra-external-id]
keypoints:
  - "Use a Specific people link for a one-off file or folder, and guest access for ongoing work with the same outsiders on a site or team."
  - "A guest account lives in your directory, so you can review, expire, disable and remove it. An Anyone link leaves no account behind."
  - "Use an Anyone link only when you truly need unauthenticated access, and then limit it to view and give it an expiry date."
  - "Microsoft recommends avoiding the Existing guests setting, because guests can be added to the directory in ways outside SharePoint and OneDrive."
  - "Set Specific people as the default link type to reduce oversharing, and use guest expiry and domain limits to keep external access under control."
faq:
  - q: "What is the difference between guest access and a sharing link?"
    a: "Guest access creates or uses a guest account in your directory, and the person must sign in or enter a verification code. A sharing link is a URL for one file or folder. Anyone links need no sign-in at all. Guest accounts can be reviewed and removed, while Anyone links leave no account to review."
  - q: "When should I use an Anyone link?"
    a: "Only when people must open a file without any sign-in, such as a public brochure. Microsoft advises choosing Anyone only if you need to allow unauthenticated access to files or folders. Limit the link to view permission, set an expiry and expect the link to travel, because anyone who has it can use it."
  - q: "Is a Specific people link safer than an Anyone link?"
    a: "Generally yes. A Specific people link requires the sharer to name the recipients, so it is bound to identified people. An Anyone link works for whoever holds the URL. Microsoft lists Specific people as a configurable default link type, and setting it as the default is a way to reduce oversharing."
---

Use a Specific people link when you share one file or folder once. Use guest access when the same outsiders work with you on a site or team over time. Use an Anyone link only when people must open content without signing in. That is the short answer to guest access vs sharing links in SharePoint. This article is for site owners who often get the question, "How do I share this with someone outside the company?" You will see what each method is, how to choose with a few questions, which controls help, and a worked example.

## What are the options for sharing with outsiders?

Microsoft compares the methods on its page about [sharing and collaboration options](https://learn.microsoft.com/en-us/sharepoint/collaboration-options). Here are the ones that matter.

- **Anyone link.** Anyone who has the link can open the item, including people who are not signed in. It can be set to expire and to allow view or edit.
- **Specific people link.** The sharer lists the people who can use it.
- **People in your organization link.** Anyone inside the company who has the link can use it. It is internal only.
- **Guest account.** When an item is shared with a new guest, a guest account is created in your directory through Microsoft Entra B2B collaboration. Guests must sign in or provide a verification code. They can get access to whole sites or to single files and folders.
- **Verification code.** Guests with non-Microsoft addresses, such as Gmail, receive a code when they try to open content. The reauthentication period can be configured.

Note that [guest access](https://www.m365.fm/entity/guest-access/) and [sharing links](https://www.m365.fm/entity/sharepoint-sharing-links/) are not exclusive. Depending on your settings, a Specific people link to an outside person can also involve a guest account. The difference is the scope of the access. A link points at one item. A guest who is added to a site or group can reach everything that site or group gives.

This matters for permissions. A link gives the external user access to the item it points to. A guest who is a member of the SharePoint site gets the permissions of that group, and every file inside it is in reach unless it has unique permissions. When you review who can see what, check both the links on an item and the groups on the site. The admin who only checks one of them will miss part of the picture.

## How do you choose between guest access and sharing links?

Ask these five questions in order.

1. **Do the people need to open the item without any sign-in?** If yes, and only then, an Anyone link is the option. If no, move on.
2. **Is it a one-off item?** A single contract, a report, a folder for a delivery. Use a Specific people link with a view permission and an expiry.
3. **Will the same outsiders work with you for weeks?** Use guest access on the site or team, so they have their own account, with a group that you can review.
4. **Is the content sensitive?** Prefer guest access with sign-in, a short guest expiry and a site-level setting that is stricter than the default.
5. **Who will own the access?** Name a person who will answer, "Does this person still need this?" If nobody can, do not grant it.

The answers separate the cases. The first question filters the Anyone link, which carries the most risk. The next questions split single items from ongoing work.

## Why is an Anyone link the riskiest choice?

An Anyone link is a URL that works for whoever holds it. It can be forwarded, posted or copied, and no sign-in checks who uses it. Microsoft states that you should choose Anyone only if you need to allow unauthenticated access to files or folders. It also states that Anyone links can be set to expire, and to give view permission only.

Another point is traceability. A guest account is an object you can list, disable and remove. An Anyone link leaves no person behind. You may see the link in a report, but you cannot see who used it as easily as you can see which guests exist. That is why reviews of external access need both views: guest lists and link reports.

If you do use Anyone links, apply three rules: view only, a short expiry and a named owner for the file. Set the expiry in the sharing settings of the SharePoint admin center.

## Which controls make either method safer?

Microsoft's page lists controls that apply to both routes.

- **Guest expiration.** Guest access to a site or OneDrive expires automatically after a number of days that you set. Sharers can extend it before it ends.
- **Verification code reauthentication.** People who use a verification code must sign in again after a number of days.
- **Domain restriction.** You can limit external sharing by domain. The page notes that this applies to SharePoint and OneDrive only. Use Microsoft Entra ID to apply it across Microsoft 365.
- **Group restriction.** You can allow only users in specific security groups to share externally.
- **Site-level scope.** The tenant setting is the ceiling for external sharing. Individual sites can be locked down further, but not made more permissive than the organization setting, as Microsoft's page on [managing sharing settings](https://learn.microsoft.com/en-us/sharepoint/turn-external-sharing-on-or-off) explains.
- **Default link type.** You can choose which link option shows by default. Setting Specific people as the default is a way to reduce the risk of oversharing.

Microsoft also advises against the setting "Existing guests", because guests can be added to the directory in many ways outside SharePoint and OneDrive. The page recommends leaving external sharing enabled with controls, since it can be more secure and governable than email attachments or consumer file sharing services. If you want no external sharing at all, choose "Only people in your organization".

In practice, set the external sharing level for the whole tenant first, then check the sharing setting of each SharePoint site that holds sensitive content, and the OneDrive setting for personal files. A site with a stricter site level than the tenant is fine. A site that tries to be looser than the tenant is not possible.

Teams and Microsoft 365 groups add one more route. Microsoft notes that the guest sharing settings of a group or a team also affect the connected SharePoint site, so a guest added in Teams is not only a Teams question. Ask your Teams admin and your SharePoint admin to agree on one rule for external users, so that the same person is not allowed in one place and blocked in another. Write the rule down in one page that every site owner can read.

The [Microsoft Entra External ID](https://www.m365.fm/entity/entra-external-id/) settings also matter, because they decide who may invite guests. Check them together with your SharePoint settings.

## Can a site be more permissive than the organization setting?

No. Microsoft's [external sharing overview](https://learn.microsoft.com/en-us/sharepoint/external-sharing-overview) says you must allow external sharing at the organization level before any site can use it. If a site's option and the organization-level option do not match, the most restrictive value always applies. OneDrive settings can be the same as or stricter than SharePoint settings. Not all new sites allow external sharing by default, even when the organization does.

Does sharing change permissions? The page describes access as permission levels on the shared item, and a guest added as a site member gets Edit permissions. Whether a guest account is created depends on the model. With Microsoft Entra B2B enabled for files and folders, a guest account is always created and Entra settings apply. With external authentication, no new guest account is created. To end access, remove the person's permissions from the item or remove them as a guest in your directory. Guests who need OneDrive storage or Power Automate flows need an appropriate license.

## What happens when the work with outsiders ends?

Access should end when the reason ends. The method decides how you do that.

For a link, the expiry date does the work if you set one. If you did not, someone has to find the link and remove it, which is harder than it sounds. For guest access, Microsoft's article on setting up and managing access requests gives these rules: you can withdraw an invitation before the guest accepts it, and you can resend an invitation within 90 days, though resending does not extend the deadline. After a guest has accepted, you remove the guest from the permission group of the site.

Make this part of the project close-out. When the project ends, the owner removes the guests, checks the links on the project site and confirms in writing. A five-minute close-out check prevents the stale access that audits keep finding.

## Example: three outsiders, three methods

The numbers are invented to show the method. A company has three external needs in one week.

1. **An auditor needs one signed contract, once.** A Specific people link to the auditor's address, view only, expiry in 14 days. One item, one person, one end date.
2. **An agency of 6 people works on a campaign for 6 months.** The agency staff are added as guests to the campaign team site. Guest access expires after 180 days, and the site owner renews it only if the campaign continues. The site owner reviews the 6 names every month.
3. **A public brochure must open for 2,000 event visitors without sign-in.** An Anyone link, view only, expiry on the day after the event. The link goes only to a copy of the brochure in a separate library, not to a working folder.

Count the review work. Case one: 1 link, 1 person. Case two: 6 guests, 6 monthly checks over 6 months = 36 checks. Case three: 1 link, auto-expiry. Total: manageable, and every case has an owner and an end date. Compare this with sharing all three through Anyone links: no names, no end dates and no way to know who opened what.

## Common mistakes

- **Using Anyone links for convenience.** Anyone links should be the exception that you can explain.
- **Giving a project guest access to the whole company site.** Put the work in a dedicated site and add guests there.
- **Choosing "Existing guests" as a compromise.** Microsoft advises against it.
- **No expiry for guests.** Forgotten guests are a typical finding in audits.
- **Ignoring who may invite.** If everyone may invite guests, your lists grow without owners.

## How software can help

The built-in tools cover the choice: the sharing settings in the SharePoint admin center, the Manage access panel for single items, the Microsoft Entra guest list and the data access governance reports for links. If you review many sites, a script or reporting tool can join guests and links in one list. Compare any such tool with the built-in views before you decide.

## Next step

Open the SharePoint admin center today and check three settings: the default link type, the guest expiration and the sharing level of your most sensitive site. Then apply the five questions above to the next request you receive about guest access vs sharing links.
