---
title: "How to Create a SharePoint Site: Team vs Communication Site"
summary: "How to create a SharePoint site in minutes: choose a team or communication site, fill in the settings that can't be changed later and add owners and members."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [sharepoint, sharepoint-site-provisioning]
keypoints:
  - "On the SharePoint start page, select + Create site, choose Team site or Communication site, pick a template, name the site and select Create site."
  - "A team site is for collaboration and creates a Microsoft 365 group. A communication site shares information with a broad audience and doesn't create a group."
  - "The default language of a site can't be changed after you create it, so choose it deliberately. The site address can only contain underscores, dashes, single quotes and periods."
  - "The person who creates a team site becomes a site owner. A new site doesn't inherit permissions or navigation from other sites."
  - "If + Create site is missing or the Site card is greyed out, self-service site creation is probably turned off. Ask your SharePoint administrator."
faq:
  - q: "How do I create a SharePoint site?"
    a: "Open SharePoint, select + Create site and choose Team site or Communication site. Pick a template and select Use template, enter a name, adjust the address and description if you want, choose privacy settings and the language, then select Create site. Add members and owners and select Finish."
  - q: "What is the difference between a team site and a communication site?"
    a: "A team site is for collaboration, where most members contribute, and it creates a Microsoft 365 group. A communication site is for sharing news and information with a broad audience, where typically only a small set of members contribute. A communication site doesn't create a Microsoft 365 group."
  - q: "Why can't I create a SharePoint site?"
    a: "If the + Create site button is missing or the Site card is greyed out, self-service site creation is probably disabled in your organization. Your SharePoint or Microsoft 365 administrator can allow it or create the site for you. Site creation also isn't available in the SharePoint mobile app."
---
To create a SharePoint site, open the SharePoint start page, select **+ Create site**, choose **Team site** or **Communication site**, pick a template, give the site a name and select **Create site**. This article is for new site owners who want the decision and the settings explained before they click, and for people who ask why the button is missing. You'll see how to choose between the two site types, what each field means, which choices are permanent and what to do right after the site exists.

## Choose the site type first

The first choice shapes everything after it, so spend a minute on it. Microsoft describes the two types like this:

- **Team site.** For collaboration on projects, where most members contribute. It includes a set of related pages, a default document library, lists for data and web parts you can customize. A team site also creates a Microsoft 365 group.
- **Communication site.** For sharing information with a broad audience. Typically only a small set of members contribute content for a much larger audience. A communication site does not create a Microsoft 365 group.

A simple rule works for most cases. If the people who read the site are the same people who add files to it, use a team site. If ten people publish and a thousand people read, use a communication site. If you plan to connect the site to Microsoft Teams, you need a group-connected team site, because Microsoft says every Microsoft 365 group creates a team site.

The name of the template that Microsoft suggests for a general team site is **Standard team**. Pick it when none of the other templates matches what you're building. The templates page shows a preview and a **Site capabilities** list, so you can compare before you commit.

Microsoft's page [Create a team site in SharePoint](https://support.microsoft.com/sharepoint/sites-in-sharepoint/create-a-team-site-in-sharepoint) is the basis for the steps below, together with the [communication site page](https://support.microsoft.com/sharepoint/sites-in-sharepoint/create-a-communication-site-in-sharepoint).

## Create the site in eight steps

You need a Microsoft 365 account with SharePoint. Sign in, select the app launcher and then the **SharePoint** tile. If the tile is missing, look under **More apps**. If SharePoint still doesn't show up, your subscription may not include it. Ask your Microsoft 365 administrator.

1. On the SharePoint start page, select **+ Create site**.
2. Choose **Team site** or **Communication site**.
3. Select a template and then **Use template**. For a general team site, choose **Standard team**.
4. Enter a **Site name**. For a team site, the group email address and the site address fill in automatically and you can change them.
5. Enter a **Site description** that explains what the site is for. Write it for the person who finds the site in search.
6. If you're offered **Privacy settings**, choose **Public** (anyone in your organization) or **Private** (members only). If your admin turned on sensitivity labels or site classification, choose those too.
7. Select the default **language** for the site.
8. Select **Create site**. In the **Add members** box, add people by name or email and select **Finish**. You can also select **Finish** and add people later.

The SharePoint home page has a second path: select **Build** in the left app bar, then the **Site** card in **Start building**, choose the type and a template, and continue with the same fields. Microsoft describes this path on its team site page too, so the steps may differ a little in your tenant.

Our overview of [SharePoint](https://www.m365.fm/entity/sharepoint/) explains where sites sit in the larger structure of a tenant.

### Settings to get right first

Two choices deserve a second look before you click **Create site**:

- **Language.** Microsoft says you can't change the language of the site to something else later. You can add alternate languages.
- **Site address.** It fills in from the site name. A short address is easier to type and share. If an address is already in use, SharePoint offers a modified one. As an example from Microsoft's admin page, "Marketing" is offered as `/sites/marketing2` if `/sites/marketing` exists.

For a team site, the group email address is generated from the name. Members who join the Microsoft 365 group are added to the site's members group automatically.

## What to do in the first hour

An empty site looks finished and isn't. Do these four things before you tell anybody about it.

1. **Check the owners.** The person who creates a team site automatically becomes a site owner. Add a second owner now so the site isn't orphaned when someone leaves.
2. **Add members and visitors.** A new site does not inherit permissions or navigation from other sites. For a communication site, use **Share a site** to give people access.
3. **Fix the document library.** A team site starts with a default document library. Rename it if you want, and create the top-level folders or views your team needs. If you want to organize by folders, our [SharePoint document libraries](https://www.m365.fm/entity/sharepoint-document-libraries/) overview explains the basics.
4. **Write the description and the home page.** A page that says who the site is for and what belongs in it saves you from questions later.

If you want the new site to belong to a hub, go to the hub site and select the **Create site** link in the top right corner. The new site is associated with the hub automatically.

## When you can't create a site

Two situations come up often.

**The button is missing or greyed out.** If **+ Create site** doesn't appear, or the **Site** card is greyed out, self-service site creation is probably disabled. Contact your SharePoint or Microsoft 365 administrator. Site creation also isn't available in the SharePoint mobile app.

**Your screen doesn't match these steps.** If the screens look different, your administrator may have set classic site creation. Microsoft says you then select **+ Create site**, enter a name and select **Create**. The site is created in a location your administrator predefined, and no Microsoft 365 group is created.

## For admins: who can create sites

By default, users can create communication sites and Microsoft 365 group-connected team sites. Microsoft's page [Manage site creation in SharePoint](https://learn.microsoft.com/sharepoint/manage-site-creation) says SharePoint Administrators and higher roles control it:

1. In the SharePoint admin center, go to **Settings** and select **Site creation**.
2. To allow users to create sites, select **Allow** under **Control site creation from tools**. This covers SharePoint, OneDrive, the PnP PowerShell cmdlet and the REST API. Microsoft says this setting doesn't affect whether users can create teams or Microsoft 365 groups and their connected sites.
3. Under **/sites** or **/teams**, choose whether to create Microsoft 365 group-connected team sites, then set the default time zone and storage limit for new sites.
4. Select **Save**.

Note the catch: disabling site creation doesn't stop users from creating Microsoft 365 groups or things that depend on them, such as Microsoft Teams. Every group creates a team site. To limit that, you have to restrict who can create Microsoft 365 groups, which is a separate setting.

Admins can also create a site themselves. In the SharePoint admin center, go to **Active sites**, select **Create**, choose **Team site**, **Communication site** or **Browse more sites**, select a template and set name, owner and language. The role needed is at least SharePoint Administrator. A governed process for new sites is a topic by itself. See our page on [site provisioning](https://www.m365.fm/entity/sharepoint-site-provisioning/) if you manage requests for many sites.

## Common mistakes

- **Choosing the wrong type.** A communication site can't give you a Microsoft 365 group. Decide whether you need a group before you click.
- **Skipping the language check.** Microsoft says the language can't be changed later.
- **One owner only.** If that person leaves, nobody can manage permissions.
- **Creating a site for a single folder.** If you only need a place for ten files, a library in an existing site might be enough.
- **Making it public by default.** Choose **Private** unless the content is meant for everyone in your organization.
- **Expecting permissions to carry over.** A new site doesn't inherit anything from other sites. Add people on purpose.

## Related topics to explore

- **Who should be owner and member.** The group-connected team site puts the owner and members in a Microsoft 365 group. Decide who is in which role before you invite a department.
- **Folders in a library.** Learn how to create a folder in a SharePoint document library and when a column or view works better.
- **Deleting and restoring a site.** Sites you no longer need can be deleted and, for a limited time, restored. This has its own page.
- **Hub sites.** Hub sites group related sites. You can associate a new site with a hub at creation, as described above.
- **Using SharePoint every day.** Once the site exists, the next question is how people will find, share and edit files in it.

## Next step

Open SharePoint, write down the site name, the type and the two owners, then create the site with the steps above. After you create a SharePoint site, add the second owner and the members before you share the link.

## Sources

- [Create a team site in SharePoint (Microsoft Support)](https://support.microsoft.com/sharepoint/sites-in-sharepoint/create-a-team-site-in-sharepoint)
- [Create a communication site in SharePoint (Microsoft Support)](https://support.microsoft.com/sharepoint/sites-in-sharepoint/create-a-communication-site-in-sharepoint)
- [Manage site creation in SharePoint (Microsoft Learn)](https://learn.microsoft.com/sharepoint/manage-site-creation)
- [Create a site in the SharePoint admin center (Microsoft Learn)](https://learn.microsoft.com/sharepoint/create-site-collection)
