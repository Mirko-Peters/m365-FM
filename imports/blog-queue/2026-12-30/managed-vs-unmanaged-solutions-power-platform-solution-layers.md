---
title: "Managed vs Unmanaged Solutions in Power Platform: What Differs and How Layers Fit In"
summary: "Compare managed and unmanaged Power Platform solutions using Microsoft Learn: where each is used, what you can edit, export and delete, upgrades versus patches, publishers, dependencies and the little the concepts page says about solution layers."
status: review
publish: false
author: mirko-p
date: 2026-12-30
topics: [power-platform-solution, power-platform-alm]
keypoints:
  - "Unmanaged solutions are for development and are your source for assets. Managed solutions are deployed to non-development environments such as test, UAT and production."
  - "You cannot export a managed solution. Generate it by exporting an unmanaged solution as managed and treat it as a build artifact."
  - "Deleting an unmanaged solution removes only the container. Uninstalling a managed solution removes its customizations and can delete data in its custom tables and columns."
  - "Updates and patches cannot delete components. An upgrade removes components that are no longer in the new version."
  - "The concepts page covers solution layers only briefly and links to a separate article for the system layer, ordering and merge behavior."
faq:
  - q: "When do I use managed and unmanaged solutions?"
    a: "According to Microsoft Learn, develop in unmanaged solutions in development environments and deploy managed solutions to any non-development environment such as test, UAT, SIT and production."
  - q: "Can I edit a managed component?"
    a: "Not directly. Add the component to an unmanaged solution first. Learn warns this creates a dependency, and the managed solution cannot be uninstalled until it is removed."
  - q: "What is the difference between a patch and an upgrade?"
    a: "A patch contains only changes for a parent managed solution and cannot delete components. An upgrade replaces the solution, removes components not in the new version and rolls patches up."
  - q: "Can I import the managed version where I built it?"
    a: "No. Learn says you cannot import a managed solution into the environment that contains the originating unmanaged solution, so test in a separate environment."
  - q: "What happens when I uninstall a managed solution?"
    a: "It removes all customizations and extensions in it, and you lose data in custom tables and in custom columns it added to other tables."
---

Managed and unmanaged describe the state of a Power Platform solution. This article follows the Microsoft Learn solution concepts page. That page has no comparison table of its own, so the table below summarizes its statements.

## The comparison

| Aspect | Unmanaged | Managed |
| --- | --- | --- |
| Purpose | Development | Deployment to non-development environments |
| Edit components | Yes | No, add them to an unmanaged solution first |
| Export | As unmanaged or as managed | Cannot be exported |
| Source of truth | Yes, check exports into source control | Build artifact |
| Delete | Removes only the container, customizations remain in the default solution | Removes all customizations and extensions it contains |

## Unmanaged solutions

Unmanaged solutions are used in development environments while you change the application. Learn says exported unmanaged versions should be in source control and are your source for Power Platform assets. When you customize in a development environment you are working in the unmanaged layer.

## Managed solutions

Managed solutions are deployed to environments such as test, UAT, SIT and production, and can be serviced independently of other managed solutions. As an ALM best practice, generate them by exporting an unmanaged solution as managed and treat them as a build artifact. Some managed components cannot be edited, and the managed properties article lists which.

Important rules:

- You cannot import a managed solution into the environment that contains the originating unmanaged solution.
- Uninstalling a managed solution removes its customizations and extensions. You lose data in its custom tables and in custom columns it added to tables that are not part of it.
- Editing a managed component creates a dependency between your unmanaged customizations and the managed solution.

## Update, upgrade and patch

- **Update:** changes deployed to the parent managed solution, and you cannot delete components with an update.
- **Upgrade:** import as an upgrade to an existing managed solution. It removes unused components and applies upgrade logic, and patches are rolled up. You can upgrade immediately or stage the upgrade to run extra steps first.
- **Patch:** contains only changes for a parent managed solution, similar to a hotfix. Patches layer on top of the parent and cannot delete components.

## Publisher

Every solution has a publisher. Learn recommends creating your own rather than using the default, defining a single publisher, and setting the prefix before you create apps or metadata, because metadata names cannot be changed afterward. Once a managed solution introduces a publisher for a component, you cannot change it, and ownership can move only within the same publisher.

## Dependencies

A dependent solution cannot be installed until its base solution is installed, and a base solution cannot be uninstalled while a dependent one exists. Components also depend on each other, for example a column on a table.

## What the page says about layers

Very little. Customizing in the development environment works in the unmanaged layer. A managed solution is imported into the managed layer. Unmanaged customizations that remain after you delete an unmanaged solution belong to the default solution. For the system layer, the full order of layers and the merge behavior, the page refers to its separate solution layers article, which I did not read.

## A simple rule

This is a suggestion, not Microsoft guidance. Build in unmanaged in development only, export as managed for everything else, and avoid editing managed components in place, because the unmanaged active layer you create will block uninstalling.

## Recommendations the page states or implies

- Build in unmanaged solutions in development environments, and keep the unmanaged export in source control.
- Generate managed solutions from unmanaged ones and treat them as build artifacts.
- Deploy managed solutions to test, UAT, SIT and production, not to the development environment.
- Create your own publisher with a meaningful name and prefix before building anything.
- Use patches for small fixes and upgrades for rolled-up releases.

## Caveats to remember

The page also states that a solution can be up to 95 MB in size. Updates and patches cannot delete components, while upgrades can. Some managed components are not editable. Prefixes and metadata names cannot be changed after items are created. Because deleting a managed solution can delete data, plan which tables hold production data before you decide what goes into a solution.

## Not covered

The page has no solution layer ordering, no managed property rules, no pipelines and no version numbering.

## Related

- [Power Platform solutions](https://www.m365.fm/entity/power-platform-solution/)
- [Power Platform ALM](https://www.m365.fm/entity/power-platform-alm/)

## Sources

- [Solution concepts with Power Platform (Microsoft Learn)](https://learn.microsoft.com/power-platform/alm/solution-concepts-alm)
