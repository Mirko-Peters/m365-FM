---
title: "SharePoint site sprawl: how to measure it and slow it down"
summary: "SharePoint site sprawl is measurable: export your site list, count inactive and ownerless sites, then slow growth with creation rules and owner policies."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [microsoft-365-sprawl, sharepoint-site-lifecycle, sharepoint-governance, sharepoint-reporting]
keypoints:
  - "Measure sprawl with a baseline from the Active sites export: total sites, inactive sites, sites with too few owners and storage used by sites nobody opens."
  - "Microsoft documents a limit of 2 million sites per organization, so the real cost of sprawl is findability, orphaned content and oversharing, not a hard stop."
  - "Slow growth at the source: restrict who can create sites, and require an owner and a purpose for every new site."
  - "Microsoft's site lifecycle policies notify owners and can set a site to read-only or archive it, but they do not delete sites."
  - "Run every policy in simulation mode first and review the report before you switch on notifications."
faq:
  - q: "What is SharePoint site sprawl?"
    a: "SharePoint site sprawl is the unmanaged growth of sites that nobody reviews: sites without owners, sites without activity, duplicates and sites that hold content with unclear permissions. It is a governance problem, not a technical limit, because Microsoft allows up to 2 million sites per organization and most tenants never reach that number."
  - q: "How do I find unused SharePoint sites?"
    a: "Open the Active sites page in the SharePoint admin center, show the Last activity and Storage used columns and export the list as a CSV file. Sort by last activity to find candidates. An inactive site policy in SharePoint Advanced Management can then notify the owners and ask them to confirm each site."
  - q: "Does Microsoft delete inactive SharePoint sites automatically?"
    a: "No. Microsoft states that site lifecycle management policies do not delete sites directly. After owners ignore several notices, a policy can take no action, set the site to read-only, or archive it after a configurable read-only period. Only a tenant admin can unlock a read-only site or reactivate an archived one."
---

To measure SharePoint site sprawl, export your site list, count the sites that are inactive, have too few owners or hold storage nobody uses, and repeat the count every month. To slow it down, control who can create sites and let owners confirm their sites on a schedule. This guide is for the IT manager who has been asked why there are so many sites and what to do about it. It shows which numbers to collect, what Microsoft documents, and how to start without deleting anything.

## SharePoint site sprawl: what it is and why it happens

Sprawl means growth that outpaces management. The entity page on [Microsoft 365 sprawl](https://www.m365.fm/entity/microsoft-365-sprawl/) describes it as the unmanaged accumulation of workspaces, sharing links, permissions and guest access in a Microsoft 365 tenant. For SharePoint, the visible symptom is a long list of sites that nobody can explain.

Typical causes are easy to recognize:

- **Self-service creation.** Anyone who can start a team or a site can create a new workspace, and nobody asks whether a suitable site already exists.
- **Projects that end without a closing step.** The project finishes, the people move on, and the site stays.
- **Owners who leave.** The site keeps its content but loses the person who knew why it exists.
- **Duplicates.** Without a way to see what exists, people create a duplicate site for the same purpose.
- **Connected workspaces.** Microsoft's inactive site policy page lists Teams-connected and group-connected sites as their own site type (template STS#3 or Group#0), which is a reminder that many sites exist because someone created a team.

The cost is rarely a technical limit. According to the [SharePoint limits](https://learn.microsoft.com/en-us/office365/servicedescriptions/sharepoint-online-service-description/sharepoint-online-limits) page, an organization can have up to 2 million sites, and a single site can hold up to 25 TB. The total storage of a tenant is not unlimited, though. It is 1 TB plus 10 GB per purchased license for most plans, so forgotten sites compete with active ones for the same pool. The larger costs are softer. People cannot find the right site, ownerless sites keep old permissions, and old content can be surfaced by search and Copilot. Microsoft itself positions its governance tools as helpful for organizations that prepare for Copilot and agents.

## What to measure first

You cannot slow what you cannot count. Start with the list of sites that the SharePoint admin center already holds. On the Active sites page, you can show and hide columns, search by name, URL, primary admin or template, and export the current view as a CSV file. The file lists the hub as a GUID and the template as an ID, for example STS#0, so keep a short lookup table. Microsoft's page on [customizing the site list](https://learn.microsoft.com/sharepoint/customize-admin-center-site-list) names columns such as Last activity, Storage used, Files and Page views.

Build a baseline with six numbers:

1. **Total sites**, split by template. Save the count with the date, because the trend matters more than the total.
2. **Sites without activity** in the last 6 and 12 months. Use the Last activity column.
3. **Sites with fewer than two owners.** The primary admin column shows one person, so you need the owner list from your own script.
4. **Storage in inactive sites.** Sort by Storage used and look at the top 50.
5. **Net growth per month.** New sites minus retired sites. This is your sprawl rate.
6. **Duplicates.** Look for repeated names, such as "Marketing", "Marketing 2" and "Marketing New". This one is manual.

The measurement also feeds your reporting. If you already run [SharePoint reporting](https://www.m365.fm/entity/sharepoint-reporting/) on sharing and permissions, add the site counts to the same monthly review, so that sprawl and oversharing are discussed together. Microsoft lists data access governance reports among its SharePoint Advanced Management tools, for example reports on sites with the most new sharing links in the last 28 days.

## Example: a tenant with 1,800 sites

This example uses invented numbers. An IT manager exports the Active sites list and finds 1,800 sites.

- **Without activity for 12 months:** 540 sites, which is 30 percent.
- **With one owner or none:** 210 sites, which is about 12 percent.
- **Growth:** 45 new sites and 5 retired sites per month, so the net growth is 40 sites per month, or 480 per year. At this rate the tenant has 2,280 sites in a year.

The manager starts a policy in simulation mode for the 540 inactive sites. Suppose 324 owners confirm their site, which is 60 percent. That leaves 216 sites without an answer, and those become candidates for read-only. The manager does not delete anything. The result is a smaller review list and a measured baseline: the next export should show less than 540 inactive sites, and the net growth should fall from 40 toward a lower number. The target for the next quarter is a net growth below 20 sites per month.

## Teams, groups and Microsoft 365 sprawl

Sprawl does not stop at SharePoint. Every team and Microsoft 365 group that people create is a workspace, and the connected sites appear in the same site list. Teams sprawl and site sprawl are therefore one problem seen from two sides. When you count sites, count the connected ones separately, and ask Microsoft Teams owners the same questions as site owners: is the workspace still needed, and who is responsible? A team without an owner is an orphan, and its site becomes an orphan too.

## How to slow down uncontrolled growth

Cleaning up helps only once. To slow the growth, work in three places: provision, life and end of a site.

### At creation

Decide who may create sites, because provision is the cheapest place to prevent a problem. Microsoft's [SharePoint Advanced Management overview](https://learn.microsoft.com/en-us/sharepoint/advanced-management) lists two controls: you can specify which non-Microsoft applications can create sites, and you can use PowerShell to designate who can create OneDrive and SharePoint sites with Microsoft Entra ID security groups. A request step is the other option. Whether you use a form, a Power Automate flow or a ticket, ask for three things: purpose, owner and an expected review date. This is a design choice of your [SharePoint governance](https://www.m365.fm/entity/sharepoint-governance/), and it should be written down together with the decision about who approves requests.

### During the life of the site

Microsoft's [site lifecycle management](https://learn.microsoft.com/en-us/sharepoint/site-lifecycle-management) describes three policy types: a site ownership policy for a minimum number of owners, an inactive site policy, and a site attestation policy that asks for regular confirmation. A policy runs in simulation mode once and creates a report. In active mode, it runs on a schedule and sends notifications.

The [site lifecycle](https://www.m365.fm/entity/sharepoint-site-lifecycle/) policies work through the owners, which is why a missing owner is the first thing to fix. Details of the inactive site policy from Microsoft's documentation:

- It counts activity in SharePoint and in connected workloads such as Teams, Viva Engage and Exchange.
- Owners or admins receive monthly notifications for three months. In the email, they can certify the site, and the site is then not checked for activity for one year.
- If nobody responds, the policy can do nothing, set the site to read-only, or archive the site after a read-only period of 3, 6, 9 or 12 months.
- OneDrive sites, root sites and sites associated with shared and private Teams channels are out of scope.

### At the end of the site

Archive instead of delete. Microsoft states that lifecycle policies do not delete sites directly, and site owners cannot remove read-only mode themselves, so keep a short process for unlock requests. Define in advance who answers them.

## Governance rules that last

A tool does not replace a decision. Write down four rules and publish them:

- **Every site has at least two owners.** Two is a common minimum, so that a site survives when one owner leaves.
- **Every site has a purpose and a review date.** Put both into the request.
- **Inactive means a number.** Choose the period, for example 12 months, and apply it to every site of the same type.
- **Someone owns the review.** A named person looks at the monthly numbers and reports the trend.

Review the list in a short audit every quarter and check each permission model that differs from the standard. Keep the rules short enough that an owner can read them in two minutes. Rules that people cannot read do not reduce sprawl, they only create exceptions. The sprawl governance process should also say what happens to the content: archive, move to another site, or delete after a retention check.

## Common mistakes

- **Starting with deletion.** Deleting sites without owner confirmation creates trust problems and lost content. Start with notification and read-only.
- **Skipping simulation mode.** Run the policy once and read the report before you notify hundreds of owners.
- **Counting only SharePoint activity.** A team site can be quiet in files and busy in chat. Microsoft's policy counts Teams activity, so your own checks should too.
- **Ignoring ownerless sites.** If there is nobody to answer the notice, the policy cannot work. Fix owners first.
- **Overlapping policies.** Microsoft recommends that policies of the same type do not have overlapping scopes.
- **Measuring once.** A single cleanup shows a nice number and then the growth continues. Track the monthly trend.

## How software can help

The Active sites export and a spreadsheet are enough for a first baseline. Microsoft's SharePoint Advanced Management adds ownership, inactive site and attestation policies, but check its prerequisites and licensing in your tenant before you plan around it. Other tools offer dashboards over the same data. Judge any of them by whether they show owners, last activity and storage in one list, and whether they let owners respond without admin work.

## Next step

Export the Active sites list today and save it with the date, then count the sites without activity in the last 12 months. That number is the starting point for your SharePoint site sprawl plan and the first line in your monthly review.
