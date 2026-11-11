---
title: "Sharing link expiration in SharePoint: sensible defaults"
summary: "Set SharePoint sharing link expiration with care: how Anyone link expiry, guest access expiry and verification code limits work, and how to choose defaults."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [sharepoint-sharing-links, guest-access, sharepoint]
keypoints:
  - "Three separate settings control expiry: how long Anyone links last, how long guests keep access to a site or OneDrive, and how often people who use a verification code must sign in again."
  - "If you shorten the Anyone link expiry, existing links update to the shorter value. If you lengthen it, existing links keep their current expiry date."
  - "Each site has its own external sharing setting, and it must be the same as or more restrictive than the organization setting."
  - "Microsoft's guidance does not give one right number of days, so choose the default from the purpose of the sharing, not from habit."
  - "A shorter expiry cuts the number of live links at any time, which is the quickest way to shrink the unseen sharing surface."
faq:
  - q: "How do I make SharePoint sharing links expire?"
    a: "In the SharePoint admin center, open Policies, then Sharing. Under More external sharing settings, require Anyone links to expire and set the maximum number of days. You can also set guest access to expire after a number of days. Save the change. Individual sites can be set to the same or a stricter level."
  - q: "What happens to existing links when I change the expiration?"
    a: "Microsoft states that if the new expiry is longer, existing links keep their current expiration time. If the new expiry is shorter, existing links update to the shorter value. Plan the change with that in mind, and tell users before a short limit takes effect, so that active sharing does not stop without warning."
  - q: "Can an expired Anyone link be renewed?"
    a: "No. Microsoft's guest sharing reference says expired links cannot be renewed, and users must create a new link if they need to keep sharing. That is a feature, not a flaw, because every new link is a fresh decision. Make sure users know how to create one."
---

SharePoint sharing link expiration is controlled by three separate settings. One limits how long Anyone links stay valid. One limits how long guests keep access to a site or OneDrive. One decides how often people who sign in with a verification code must repeat the sign-in. This article is for SharePoint admins who have to choose defaults that protect content without blocking work. You will learn what each setting does, how changes affect existing links, how to pick the number of days, and see a worked example with invented figures.

## How does SharePoint sharing link expiration work?

Microsoft describes the settings on its page about [managing sharing settings](https://learn.microsoft.com/en-us/sharepoint/turn-external-sharing-on-or-off). They sit under the advanced settings for external sharing.

- **Anyone links.** You can require all Anyone links to expire and set the maximum number of days. An Anyone link works without sign-in, so it is the loosest kind of [sharing link](https://www.m365.fm/entity/sharepoint-sharing-links/).
- **Guest access.** You can make guest access to a site or OneDrive expire automatically after a number of days. Each invited guest, or each guest with shared items, has access for that period.
- **Verification code reauthentication.** People who use a verification code must sign in again after a number of days.

These three do different jobs. The first protects against forgotten links. The second protects against forgotten guests. The third limits how long a stolen or shared session stays useful. If you only set one, you leave the other two gaps open.

Note that Microsoft's page does not give default values or ranges for these settings. Check the admin center for what it offers today, because the screens change.

## What happens to existing links when you change a limit?

This is the question admins forget to ask. Microsoft gives a clear rule for Anyone links. If you change the expiration time and the new setting is longer, existing links keep their current expiration time. If the new setting is shorter, existing links update to the new, shorter value.

The practical meaning: a shorter limit takes effect on links that already exist. A project that shared a file with a customer link last week may find the link dead sooner than expected. Tell people before you change the setting, and tell them how to create a new link.

Microsoft's [guest sharing settings reference](https://learn.microsoft.com/en-us/microsoft-365/solutions/microsoft-365-guest-settings?view=o365-worldwide) adds that expired Anyone links cannot be renewed, and users create a new link if they need to continue sharing. That page is archived, so treat it as background and test the behavior in your tenant. The principle still helps: expiry turns sharing into a series of decisions instead of one decision that lasts forever.

## How do organization and site settings work together?

Each site has its own sharing setting. Microsoft states that it must be at the same or a more restrictive level than the organization setting. The OneDrive setting can be more restrictive than the SharePoint setting, but not more permissive. Group and Teams guest sharing settings also affect the connected SharePoint sites.

For expiry, this means you set the organization default first and then tighten specific sites where needed. A legal site, a finance site or a site with customer data may deserve a stricter setting than the company default. A marketing site that shares files with agencies may need a longer one. Plan these exceptions on a short list, with a named owner for each.

The steps in the admin center are short. Expand **Policies**, then select **Sharing**. Under **External sharing**, choose the level for SharePoint and OneDrive. Expand **More external sharing settings**, choose your options and select **Save**.

Two cautions from the same page help you avoid surprises. If you turn external sharing off and later turn it on again, guests regain access, so turn it off for specific sites first if that is not what you want. And when you restrict or turn off external sharing, guests typically lose access within one hour.

## How do you choose sensible defaults?

Microsoft does not name one correct number of days. So decide from purpose. Ask four questions.

1. **What is the sharing for?** A one-off file handover needs days. A project with an agency needs weeks or months.
2. **How sensitive is the content?** The more sensitive, the shorter the expiry and the stricter the site setting.
3. **Who owns the renewal?** If nobody will renew a guest's access, a long expiry only delays the cleanup.
4. **What can users live with?** If the limit is so short that people work around it, it fails. Test it with a pilot team.

A useful rule is to match the expiry to the longest normal use. If most customer handovers close in two weeks, a two-week Anyone link limit costs nothing. If projects run for a quarter, guest access should be reviewed on that rhythm.

Also review whether you need Anyone links at all. Microsoft describes four sharing levels: Anyone, new and existing guests, existing guests, and only people in your organization. Many organizations can work with the second or third level. Guests who sign in leave an account behind that you can review. See also how [guest access](https://www.m365.fm/entity/guest-access/) fits into your wider policy.

## How do you roll out a shorter expiry without upsetting users?

A change in expiry is a change in daily work, so run it like a small project.

1. **Announce it.** Tell staff what changes, when, and why. Two sentences in the intranet and a note in Teams are enough.
2. **Pilot it.** Apply the new limit to one team or one site for two weeks and collect the problems.
3. **Explain the replacement.** Show people how to create a new link, or how to share with named people instead.
4. **Set the date.** Remember that a shorter limit updates existing links. Pick a day, and avoid peak periods such as quarter end.
5. **Keep an exception list.** A few sites need longer limits. Record the owner and the reason for each one.
6. **Check after a month.** Look at the number of support tickets and at link activity, then adjust.

Most complaints come from surprise, not from the limit itself. A clear note and a short pilot remove most of them.

## Example: how expiry changes the number of live links

The numbers are invented to show the logic. Employees create about 20 Anyone links per working day. Count working days only to keep the arithmetic simple, and treat each link as live until it expires.

- **No expiry:** after one year of 250 working days, about 20 × 250 = 5,000 links are live, and the number keeps growing.
- **180 days expiry:** at any time, about 20 × 180 = 3,600 links are live.
- **90 days expiry:** about 20 × 90 = 1,800 links are live.
- **14 days expiry:** about 20 × 14 = 280 links are live.

The ratio is the point. Going from no expiry to 14 days cuts the live links from 5,000 to 280 after one year, a drop of about 94 percent in this example. For an admin, 280 links are something you can review, while 5,000 are not. The cost is that users create new links more often. For a team that shares a file once and is done, that cost is small.

Combine this with a guest access limit. If you set guest access to expire after 90 days, a guest who left a project in the first month disappears from the list within three months, without anyone remembering to remove them.

## Common mistakes

- **Setting only one expiry.** Anyone links, guest access and verification codes are three separate settings.
- **Changing the limit without notice.** A shorter value updates existing links.
- **Choosing a number by habit.** Pick it from the purpose of the sharing.
- **Forgetting site-level exceptions.** A sensitive site may need a stricter setting than the default.
- **Never testing with a pilot team.** If people work around the limit, you gain nothing.

## How software can help

Start with the SharePoint admin center settings and the data access governance reports, which show sharing link activity for the last 28 days. When you need a recurring list of links by age and owner, a script or a reporting tool can provide it. Compare any such tool with these built-in options first.

## Next step

Open the SharePoint admin center today, check what is set for SharePoint sharing link expiration, and write down the three values: Anyone links, guest access and verification code. If any of them is off, choose a value from the purpose of your sharing and test it with one team.
