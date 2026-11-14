---
title: "Entra Access Packages and Entitlement Management Explained"
summary: "What Microsoft Entra access packages and entitlement management are, how catalogs and policies work, the steps to create a package, the roles and license it needs, and when a package is the right tool."
status: review
publish: false
author: mirko-p
date: 2026-11-21
topics: [access-packages, entra-id-governance, microsoft-entra]
keypoints:
  - "An access package bundles the resources a person needs for a project or task, such as groups, Teams, apps and SharePoint sites, with rules for who can request them."
  - "Packages live in catalogs. Each package has one or more policies that set who can request, who approves and when access expires."
  - "Create one under ID Governance > Entitlement management > Access package > New access package. The minimum role is Identity Governance Administrator."
  - "Assignment expiry can be set from 0 to 3660 days, and access can be extended or put under a recurring access review."
  - "Entitlement management requires Microsoft Entra ID Governance or Microsoft Entra Suite. Some capabilities may work with Microsoft Entra ID P2."
faq:
  - q: "What is an access package in Microsoft Entra?"
    a: "According to Microsoft Learn, an access package is a bundle of all the resources with the access an identity needs to work on a project or perform a task. It can govern access for internal identities and for identities that originate outside your organization. Packages are managed in entitlement management and always sit in a catalog."
  - q: "What can an access package contain?"
    a: "Microsoft Learn lists Microsoft Entra security groups, Microsoft 365 Groups and Teams, enterprise applications, and SharePoint Online sites. Preview items include API permissions for agents and SAP IAG business roles. Other resources such as Microsoft 365 licensing or Azure access can be controlled indirectly through groups."
  - q: "What is the difference between a catalog and a policy?"
    a: "A catalog is a container of related resources and access packages, used for delegation. A policy belongs to an access package and defines the rules for assignment: who can request, the approval process, and how long access lasts. A package can have more than one policy."
  - q: "What happens when access expires?"
    a: "Microsoft Learn says assignments are time-limited and expire if not renewed. In the create steps, expiration can be a date, a number of days from 0 to 3660, a number of hours, or never, and users can be allowed to extend access. When an external user's last assignment expires, their B2B account in your directory can be removed automatically."
  - q: "What license do access packages need?"
    a: "Microsoft Learn says entitlement management requires Microsoft Entra ID Governance or Microsoft Entra Suite subscriptions for your users, and that some capabilities may work with a Microsoft Entra ID P2 subscription. Using Sponsors as approvers requires a Microsoft Entra ID Governance license."
---

An access package is a ready-made bundle of access. Instead of asking IT to add someone to five groups, two apps and a site, a person requests one package, an approver says yes, and the access expires on its own date. Entitlement management is the Microsoft Entra ID Governance feature that runs this. The details below come from Microsoft Learn.

## The idea in one paragraph

Microsoft says entitlement management lets organizations manage identity and access lifecycle at scale by automating access request workflows, access assignments, reviews and expiration. It works for employees and for people outside your organization, using Microsoft Entra B2B for external identities.

## The building blocks

| Term | What it is |
|---|---|
| Access package | A bundle of resources governed by policies, always inside a catalog |
| Catalog | A container of related resources and access packages, used for delegation |
| Resource | An asset such as a group, Team, application or SharePoint site |
| Resource role | The permission set a resource defines, for example group member or owner |
| Policy | Rules for the package: who can request, approvers, duration |
| Assignment | A person's right to all resource roles in the package, usually time-limited |
| Connected organization | An external Entra directory or domain with a relationship to yours |

Supported resources are Microsoft Entra security groups, Microsoft 365 Groups and Teams, enterprise applications, and SharePoint Online sites. Agent-related items and SAP IAG roles are listed as preview. Other things can be reached through groups, for instance Microsoft 365 licensing through group-based licensing.

## Who does what

Microsoft lists these delegation roles:

- **Administrator:** can add resources to any catalog.
- **Catalog creator:** can create catalogs and becomes the owner of each one.
- **Catalog owner:** adds resources they own and can add co-owners or access package managers.
- **Access package manager:** defines policies for who can request, who approves and when access expires.

A nonadministrator can only add resources they own to a catalog. This lets departments run their own packages without IT, within the limits of the catalog.

## Create an access package

Sign in to the Microsoft Entra admin center and go to **ID Governance** > **Entitlement management** > **Access package**, then select **New access package**. The minimum role is Identity Governance Administrator, and Catalog owner or Access package manager also work.

1. **Basics.** Enter a display name and description and pick a catalog, or create a new one.
2. **Resource roles.** Choose a resource type (**Groups and Teams**, **Applications**, **SharePoint sites**, or preview types), select resources and the role to assign. You can skip this and add resources later.
3. **Requests.** Choose who can get access: specific users and groups, all members, all users including guests, specific or all connected organizations, or none for administrator direct assignment only. Set whether approval and justification are required, how many approval stages (1, 2 or 3), and the approvers.
4. **Requestor information.** Add questions in short text, multiple choice or long text, and mark them required if needed.
5. **Lifecycle.** Set expiration and optional extensions, and decide whether an access review is required.
6. **Review + create.** Check for errors and select **Create**. Set **Hidden** to **No** to show the package to everyone in scope.

An existing access package cannot be moved to a different catalog, so plan the catalog first.

## Approval and expiration rules worth knowing

- Approvers can be the manager, sponsors, or specific people. A fallback can be added for manager and sponsor approvers.
- The decision window is set in days. Requests not approved in time are automatically denied.
- For alternate approvers, the main approvers need at least four days, and forwarding cannot happen on the last day.
- Expiration can be a date, 0 to 3660 days, a number of hours, or never.
- If extensions are allowed, users get reminder emails 14 days and one day before expiry.
- Guest accounts are blocked and deleted by default after their last assignment expires or is canceled, unless configured otherwise.

## Assignment without a request

Access does not have to be requested. Microsoft lists direct assignment by an administrator, automatic assignment based on rules, and lifecycle workflows as other routes.

## When an access package fits

Microsoft says access packages do not replace other mechanisms. They fit best for:

- Migrating access policy definitions from a third-party role management system.
- Time-limited access for a specific task.
- Access that needs manager or designated approver sign-off.
- Access assigned automatically for a job role but also requestable elsewhere.
- Department-managed access without IT involvement.
- Projects with partners that need B2B identities.

## License and prerequisites

Entitlement management requires Microsoft Entra ID Governance or Microsoft Entra Suite subscriptions. Some capabilities may work with Microsoft Entra ID P2. Using Sponsors as approvers needs an ID Governance license. Adding Verified ID requirements needs the Global Administrator role.

## Common mistakes

- Choosing the wrong catalog, then finding the package cannot be moved.
- Setting a very short decision window so requests are denied automatically.
- Leaving expiry on never, which defeats the purpose of time-limited access.
- Skipping a recurring access review on long-lived packages.

## Related

- [Access packages](https://www.m365.fm/entity/access-packages/)
- [Microsoft Entra ID Governance](https://www.m365.fm/entity/entra-id-governance/)
- [Access reviews](https://www.m365.fm/entity/access-reviews/)
- [Microsoft Entra](https://www.m365.fm/entity/microsoft-entra/)

## Sources

- [Microsoft Learn: What is entitlement management?](https://learn.microsoft.com/en-us/entra/id-governance/entitlement-management-overview)
- [Microsoft Learn: Create an access package in entitlement management](https://learn.microsoft.com/en-us/entra/id-governance/entitlement-management-access-package-create)
