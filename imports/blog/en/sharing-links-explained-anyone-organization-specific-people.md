---
title: "Sharing links explained: anyone, organization, specific people"
summary: "Anyone, organization, existing access or specific people: this guide explains what each SharePoint sharing link scope does, who can open it, and how it relates to guest access and tenant settings."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [sharepoint-sharing-links, sharepoint, guest-access]
faq:
  - q: "What is the difference between an Anyone link and a Specific people link?"
    a: "An Anyone link works for whoever holds it, with no sign-in required, and can be forwarded freely. A Specific people link is meant for the named recipients, who may need to verify their identity. If the content is sensitive, Specific people is usually the more controlled option."
  - q: "Does a sharing link always grant access to the whole site?"
    a: "No. A sharing link is created for a specific file or folder and grants access to that item. It does not by itself make someone a member of the site. Which scopes are offered depends on tenant and site settings, so check Microsoft Learn for your configuration."
  - q: "Why can't I choose the Anyone option when I click Share?"
    a: "Admins can restrict sharing at tenant level, and site-level settings can only be as permissive as the tenant allows or stricter. If Anyone links are not offered, a policy is probably limiting them. Ask your SharePoint admin which sharing setting applies to the site."
---

Every time someone clicks **Share** on a file in SharePoint or OneDrive, they make a small access decision. The link they create can be opened by a named colleague, by everyone in the company, or by anybody who ends up with the URL. It is easy to accept the default without looking closely at which one was picked.

This article explains the link scopes, how they relate to guest access and tenant settings, and what admins and site owners can do to keep sharing understandable. Where behaviour depends on configuration, check Microsoft Learn for your tenant.

## What a sharing link is (and what it is not)

[SharePoint sharing links](https://www.m365.fm/entity/sharepoint-sharing-links/) are links created with the Share option in SharePoint and OneDrive. They grant access to a file or folder, and the **scope** of the link defines who can use it. The scopes are:

- **Anyone**
- **People in the organization**
- **People with existing access**
- **Specific people**

A sharing link is tied to an item, not to the whole site. Someone who receives a link to one document is not automatically a member of the site and does not automatically see its other content. Site membership and permission groups are a separate mechanism.

That distinction matters in practice. [SharePoint](https://www.m365.fm/entity/sharepoint/) holds the files behind Teams, team sites, communication sites and document libraries, and many files are shared with links rather than through permission groups. Links are convenient, but they create access paths that are less visible than a membership list.

## The four scopes in plain language

### Anyone

An Anyone link works for whoever holds the URL. Depending on configuration, no sign-in is required, and the link can be forwarded by the recipient to anyone else. You lose control over who actually opens the file.

This scope can make sense for genuinely public material, such as a product brochure. It is a poor fit for contracts, HR documents or anything confidential. Admins can restrict or disable this scope at tenant level.

### People in the organization

This link works for people in your organization who are signed in. It is useful for broad internal distribution, for example a policy document that everyone should be able to read.

The risk is that "everyone in the organization" is wider than many users assume. A link with this scope that gets posted in a large chat or channel can be opened by any internal colleague, whether or not they were the intended audience.

### People with existing access

This option does not grant new permissions. It creates a link that works only for people who can already open the item. It is handy when you want to point colleagues to a file in a chat or email without changing who can see it.

If a recipient does not have access, the link will not open the file for them. That is the intended behaviour, and it avoids accidental widening of access.

### Specific people

A Specific people link is intended for the recipients you name, who may need to verify their identity to open it. This is usually the most controlled option and a sensible choice for sensitive content or for sharing with external partners.

Even here, the details depend on settings. Whether external recipients can be named at all is governed by the sharing configuration of your tenant and site, which leads to the next topic.

## Tenant and site settings set the ceiling

Users can only choose among the scopes that the configuration allows. In general terms, the tenant-level sharing setting defines the most permissive option available, and an individual site can be configured to be equally restrictive or stricter, but not more permissive than the tenant.

Imagine a tenant that allows sharing with new and existing guests but disables Anyone links. Users on every site will not see the Anyone option. Now imagine a single site holding confidential project material: its owners and admins can limit that site further, so that external sharing is switched off there entirely.

This layering is why two users in the same company can see different options in the Share dialog. If someone asks "why can't I pick Anyone?", the answer is usually a policy, not a bug. The exact setting names and options change over time, so use the SharePoint documentation on [Microsoft Learn](https://learn.microsoft.com/sharepoint/) as the reference for your tenant.

Link-related options such as default link type and link expiration also exist in the sharing configuration. A safer default means users have to make a conscious choice to widen access instead of widening it by accident. Check Microsoft Learn to see which of these options are available and how they behave in your environment.

## Sharing links and guest access

Sharing links and [guest access](https://www.m365.fm/entity/guest-access/) are related but not the same thing.

Guest access is the ability to add people from outside the organization to Microsoft 365 groups and Teams as guest objects in Microsoft Entra ID. It is controlled at tenant, team and sensitivity-label level. A guest becomes a directory object that can be a member of a team and can be assigned access like other members.

A sharing link, by contrast, grants access to one file or folder for the people the link allows. A Specific people link addressed to an external email address gives that person access to the item, without necessarily making them a member of a team or group.

In practice this means external access can arise in two ways:

1. **Through membership:** a guest is added to a team or group and inherits what that membership allows.
2. **Through links:** an external person receives a link to a specific item.

If you review only team membership, you will miss access that exists through links. If you review only links, you will miss guests who are members of teams. A decent governance routine looks at both.

## Reviewing what already exists

Sharing links accumulate. A link created for a one-off review two years ago may still work today. Some practical places to look:

- **Manage access on an item:** shows who and which links have access to a file or folder. Useful for spot checks on files that matter.
- **Site sharing and permission reports:** the SharePoint admin center and site settings offer ways to review sharing at site level. The exact reports and their names depend on your licensing and the current product version, so verify them on Microsoft Learn.
- **Guest membership lists:** review which external users are guests in your directory and which teams or groups they belong to.

A caution before you change anything: **removing a link or permission changes who can reach content and can break work in progress.** Someone may be relying on that link to do their job, and a deleted link may not be easy to restore in the same form. Try the process first on a pilot site or in a test tenant, tell the affected owners beforehand, and keep a record of what you removed (for example an export of the sharing report) so you have a way back. Bulk changes, especially via PowerShell, deserve the same care: test on a small, non-critical scope first.

Third-party tools exist alongside the native features, for example the SharePoint Essentials Toolkit from [Cognillo](https://www.cognillo.com/). Whether any third-party tool fits depends on your size, your licensing and what the built-in features already cover for you. Start with what Microsoft 365 offers natively, and only add tooling if you identify a gap.

## Practical takeaways

- **Know the four scopes:** Anyone, people in the organization, people with existing access, specific people. Teach users the difference in one short paragraph rather than a long policy.
- **Prefer Specific people for sensitive content,** and treat Anyone links as the exception, if you allow them at all.
- **Use the tenant setting as your ceiling** and tighten individual sites that hold confidential material.
- **Consider safer defaults and link expiration** where your configuration offers them, and check Microsoft Learn for current options.
- **Review links and guests together.** Membership and links are two separate routes to external access.
- **Test before you remove.** Use a pilot site or test tenant, communicate with owners, and keep a record so changes can be reversed.
- **Spot-check regularly.** Open Manage access on a few frequently shared files each quarter and see what is really out there.
