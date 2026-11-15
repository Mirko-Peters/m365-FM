---
title: "Organize Fabric Workspaces With Domains and Subdomains: Roles, Setup and Certification"
summary: "Group Fabric workspaces by business area using domains and subdomains, per Microsoft Learn: domain roles, creating a domain, three ways to assign workspaces, default domains, delegated tenant settings and certification at domain level."
status: review
publish: false
author: mirko-p
date: 2026-12-29
topics: [fabric-domains, fabric]
keypoints:
  - "A domain groups an organization's data by business area, and workspaces assigned to it pass the domain to their items as metadata. Domains do not change item visibility or permissions."
  - "Roles are Fabric admin, domain admin and domain contributor. Domain admins cannot delete a domain, change its name or add other domain admins."
  - "Create a domain as a Fabric admin in the admin portal under Domains, Create new domain. Subdomains inherit the parent's domain admins and currently have general settings only."
  - "Assign workspaces by name, by workspace admin or by capacity. Admin and capacity assignment exclude My workspaces and affect only existing workspaces."
  - "Certification settings and a default sensitivity label can be delegated to the domain level, so each business unit sets its own rules."
faq:
  - q: "What does a domain do?"
    a: "According to Microsoft Learn, it logically groups data by business area, such as marketing or sales, to support a data mesh architecture. Items in a workspace inherit the domain as a metadata attribute, and domains are used mainly to filter content in the OneLake catalog."
  - q: "Does assigning a workspace to a domain change access?"
    a: "No. Learn says domain assignment does not change item visibility or access. Permissions depend on workspace roles and item permissions."
  - q: "Who can do what?"
    a: "Fabric admins create and edit domains and set domain admins and contributors. Domain admins update the description, contributors and workspace assignments and override delegated settings. Domain contributors are workspace admins who can assign their own workspaces."
  - q: "How do I assign workspaces?"
    a: "On the domain page select Assign workspaces and choose by workspace name, by workspace admin or by capacity. Learn says an existing assignment can be overridden only if the tenant setting Allow tenant and domain admins to override workspace assignments is enabled."
  - q: "How does endorsement fit in?"
    a: "At the domain level you can enable or disable certification for items, specify certifiers who are domain experts and provide a documentation URL, by overriding the tenant admin selection."
---

Fabric domains organize workspaces by business area so teams can govern their own data. This guide follows the Microsoft Learn article on Fabric domains. The page gives no numeric limits for domains, subdomains or workspaces.

## Key concepts

A domain groups workspaces. Items in an assigned workspace inherit the domain as a metadata attribute. All tenant users can see all domains, and domain assignment does not change who can see or open items. Subdomains refine a domain. A default domain can be set for chosen users or groups.

## Roles

| Role | What it can do |
| --- | --- |
| Fabric admin or higher | Create and edit domains, specify domain admins and contributors, associate workspaces and delete domains |
| Domain admin | Update the description, define contributors, associate workspaces, set the image and override delegated tenant settings. Cannot delete the domain, change its name or add or delete other domain admins |
| Domain contributor | A workspace admin allowed to assign their workspaces to a domain, using workspace settings |

To assign a workspace, a contributor must hold the Admin role in it.

## Create a domain and subdomain

1. As a Fabric admin, open the admin portal and select the **Domains** tab.
2. Select **Create new domain**, enter a name and optionally domain admins, and select **Create**.
3. To add a subdomain, open the domain, select **New subdomain**, name it and select **Create**. Fabric admins or domain admins can do this.

Subdomains have no domain admins of their own. They inherit the parent's.

## Assign workspaces

On the domain or subdomain page select **Assign workspaces**. Three methods exist:

- **By workspace name:** search and select several workspaces.
- **By workspace admin:** select users or security groups, and all workspaces they administer are assigned.
- **By capacity:** select capacities, and all workspaces on them are assigned.

The admin and capacity methods exclude My workspaces and affect only existing workspaces. A workspace already in another domain triggers a warning. Override works only if the tenant setting for overriding workspace assignments (preview) is enabled. To unassign, tick workspaces and select **Unassign**.

## Default domain

When a domain is the default for users or security groups, their existing unassigned workspaces are assigned to it and workspaces they create later are assigned too. Workspaces that already have a domain keep it. Those users generally become domain contributors for those workspaces.

## Domain settings

Open **Domain settings**. The side pane has six tabs: General settings, Image, Admins, Contributors, Default domain and Delegated settings. Contributors can be everyone in the organization (the default), specific users or groups, or only tenant admins and the specific domain admins.

## Delegated settings

- **Default sensitivity label:** if the feature is enabled, expand Delegated Settings, choose Information protection and select a label under Set a default label for this domain.
- **Certification:** enable or disable certification for items in the domain, specify certifiers and provide a documentation URL. Select Override tenant admin selection to configure it.

## Auditing and APIs

Creating, editing or deleting a domain is recorded in the Fabric audit log and activity log. Most actions are available through the Fabric REST Admin APIs for domains.

## A starting structure

This is a suggestion, not Microsoft guidance. Start with a few domains that match business owners, assign workspaces by name where naming conventions exist, and add subdomains only when a team needs a separate grouping. Check the contributor setting early, because the default lets everyone in the organization who is a workspace admin assign their workspaces.

## What a domain is used for

The page describes domains as a way to support a data mesh style of governance, where business areas own their data. In practice, domain metadata is used to filter content in the OneLake catalog, so a user can look at the items of one business area. My advice: because every tenant user can see all domains, a domain name should be understandable outside the team that owns it.

## Checks after setup

This list is a suggestion, not Microsoft guidance. Open the domain page and confirm that the workspace count matches your expectation. Check who is listed as domain admin and contributor. Review the Delegated settings tab to see whether the domain overrides the tenant certification setting. Finally, look in the audit log for the domain events to confirm that changes are recorded.

## Not covered

The page does not describe endorsement in detail beyond certification, and it links separate articles for that and for domain-level sensitivity labels.

## Related

- [Fabric domains](https://www.m365.fm/entity/fabric-domains/)
- [Fabric](https://www.m365.fm/entity/fabric/)

## Sources

- [Domains (Microsoft Learn)](https://learn.microsoft.com/fabric/governance/domains)
