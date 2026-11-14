---
title: "Loop Workspace Storage, Lifecycle and eDiscovery: What Admins Can Control"
summary: "Where Microsoft Loop content is stored, how workspace lifecycle works when owners leave, and how eDiscovery, retention and holds apply to Loop workspaces, based on Microsoft Learn's Loop admin pages."
status: review
publish: false
author: mirko-p
date: 2026-12-14
topics: [microsoft-loop, loop-workspaces, ediscovery, sharepoint-embedded]
keypoints:
  - "Loop app workspaces live in SharePoint Embedded containers, count against the organization's SharePoint storage quota, and have no admin-set limit per container."
  - "A personal My workspace container follows the OneDrive deletion lifecycle, with one manual handoff step when the user leaves."
  - "Retention policies for all SharePoint sites apply to Loop workspaces. Retention labels cannot be applied to the containers themselves."
  - "eDiscovery search and collection are supported, while review and HTML export need Premium. Legal hold on My workspace has a documented rollout caveat."
  - "There is no end-user recycle bin for whole workspaces. Admin-restored workspaces reappear in the Loop app only after a user opens a saved page link."
faq:
  - q: "Where is Loop workspace content stored?"
    a: "Microsoft Learn says content created in the Loop app is stored in SharePoint Embedded containers. Components created in Teams private chats, Outlook or OneNote live in the user's OneDrive, and Teams channel content lives in the channel's SharePoint site."
  - q: "What happens to a workspace when its owners leave?"
    a: "For tenant-owned shared workspaces, Learn says the workspace becomes ownerless, stays in the tenant and is not deleted automatically. Only an owner can delete a workspace, so an admin has to add new owners first."
  - q: "Can I put a retention label on a Loop workspace?"
    a: "No. The Loop compliance summary states that retention labels don't apply to containers such as SharePoint sites or Loop workspaces. Use retention policies for the containers, and labels for the files inside."
  - q: "Does eDiscovery cover Loop content?"
    a: "Yes. The compliance summary lists Purview eDiscovery search and collection as supported for Loop. Review and HTML export require Premium. Copilot Pages and Loop share one application identity, so audit logs and eDiscovery have no separate Copilot Pages filter."
---

Loop content is not stored in one place. Components that people paste into Teams chats or Outlook sit in OneDrive, while workspaces created in the Loop app sit in SharePoint Embedded containers that most admins have never opened. That split decides how storage, deletion and compliance tools behave. This guide walks through what Microsoft Learn documents for each layer, and where the pages say a feature is limited.

## Where Loop content lives

Learn's storage page maps the creation point to the storage location:

| Created in | Stored in |
|---|---|
| Loop app, any workspace | SharePoint Embedded containers |
| Teams chat notes | SharePoint Embedded containers |
| Teams private chat or meeting | The user's OneDrive |
| Teams channel or channel meeting | The channel's SharePoint site |
| Outlook, OneNote, Whiteboard | The user's OneDrive |

Three container ownership models exist:

- **My workspace** is a user-owned container, private by default. Copilot Pages and Copilot Notebooks share the same container, and admin tools show the application name as Loop.
- **Tenant-owned shared workspaces** use a roster for permissions.
- **Microsoft 365 group-owned workspaces** follow the group's permissions and lifetime, similar to Teams sites.

Shared workspaces create one container per workspace. All of it counts against the organization's SharePoint storage quota. Learn's storage page lists a maximum of 25 TB per container, while the compliance summary says there is no admin control to set storage limits for individual containers. Both statements can hold at once: you cannot tune the cap.

## Find and inspect containers

In the SharePoint admin center, expand **SharePoint Embedded** and select **Active containers**. Filter by application name Loop, and optionally by ownership type. The page lists columns such as principal owner, storage, owner count and sensitivity label.

For scripting, Learn gives the Loop application ID filter:

```powershell
Get-SPOContainer -OwningApplicationId 'a187e399-0c36-4b98-8f04-1edc167a0996' | FT
```

`Get-SPOContainer` returns results in pages, so use `-Paged` and the paging token for large tenants. To list ownerless workspaces, filter on `OwnersCount -eq 0`.

Membership roles map as follows: Owner in the admin center equals Owner in Loop, Manager equals Editor, and Writer and Reader are not used. Learn adds that tenant-owned workspaces created on or after April 2025 can be managed in the admin center, while older ones use a legacy roster that is being deprecated.

## Lifecycle: departures, ownerless workspaces and deletion

**A user leaves.** The My workspace container follows the OneDrive deletion lifecycle. After the account is deleted, the container stays active for a configurable retention period, then moves to a recycle bin, then is permanently deleted. One control governs both OneDrive and user-owned containers. The Loop pages do not state the number of days. The OneDrive retention page says the default is 30 days, followed by 93 days in the site collection recycle bin.

OneDrive delegates access to the manager automatically. User-owned containers do not, so the admin completes that step manually. Learn gives two options:

1. Add a custodian as owner in the container's **Membership** tab, send them the Container Redirect URL, and have them copy the content.
2. Reassign the container with the principal owner transfer capability of `Set-SPOContainer`, supported only for user-owned containers. This resets the deletion schedule to the new owner.

If nobody is granted access before the retention period ends, the content is permanently deleted.

**Shared workspaces.** If all owners leave a tenant-owned workspace, it becomes ownerless and is not deleted automatically. Members cannot delete it, because only an owner can. An admin adds new owners first.

**Deleted containers.** In the SharePoint admin center, **Deleted containers** lists removed containers. Learn's SharePoint Embedded admin page says deleted containers are permanently purged after 93 days, unless a retention policy changes the outcome. Restore from the **Restore** button, or with `Restore-SPODeletedContainer -Identity <ContainerId>`.

Two caveats from the compliance summary:

- There is no end-user recycle bin for Loop workspaces. Components and pages do have one.
- A workspace restored through admin tools does not update in the Loop app. The user must visit a saved page link to see it again.

## Compliance tools and their documented limits

The Loop compliance summary lists status per feature:

| Feature | Status |
|---|---|
| Purview eDiscovery | Search and collection supported. Review and HTML export need a Premium license. |
| Legal hold | Supported. Content is stored in the Preservation Hold Library. |
| Retention policies | Supported. Policies for all SharePoint sites apply to .loop files, or can target a single workspace. |
| Retention labels | Limited manual application. |
| Sensitivity labels | Supported on pages, components and workspaces. Workspace labels are set per container. |
| DLP | Supported with policy tips. |
| Audit | Events exist for all activity and can be exported. |
| Information Barriers | Not supported for SharePoint Embedded containers. |

Details worth knowing:

- Retention labels can't be viewed or applied from a Loop component. Users must open the file in the Loop app. Record labels can't be applied manually at all.
- For legal hold on My workspace, selecting the container in the custodian picker was described as rolling out with an expected date of October 2026. Until then, retrieve the container URL and add it as a data source manually. Check whether the picker has reached your tenant.
- Version history for SharePoint Embedded content defaults to 50 major versions per file, changeable with `Set-SPOApplication -ItemMajorVersionLimit`.

## Target a specific workspace in Purview

The Purview management page explains how to scope policies and searches:

1. Sign in to the SharePoint admin center with the SharePoint Embedded administrator role.
2. Expand **SharePoint Embedded**, then open **Active containers** or **Deleted containers**.
3. Open the container flyout, go to the **General** tab and copy the container URL.

That URL is for Purview targeting only, not a shareable link. For a search on one workspace, use the full container URL followed by `/*` as the file, folder or site condition. A keyword search on the container GUID also works. For audit searches, Learn gives the Loop web application ID `a187e399-0c36-4b98-8f04-1edc167a0996`. Because Loop, Copilot Pages and Copilot Notebooks share the identity, there is no separate Copilot Pages filter in audit logs or eDiscovery.

## Control who creates workspaces

Creation is controlled by the Cloud Policy setting **Create Loop workspaces in Loop**, or in the Microsoft 365 admin center under **Org settings > Services > Loop**. To stop a personal container from being created, disable both that setting and **Create and view Copilot Pages and Copilot Notebooks** for the same user. Disabling only one leaves a creation path open. These controls do not restrict access to existing workspaces.

## Checklist

1. Inventory containers with the Loop application ID, and list ownerless ones.
2. Add a manual step to the leaver process for My workspace containers.
3. Use retention policies for the containers, labels only for files.
4. Test an eDiscovery collection on a pilot workspace, including the Premium-only review step.
5. Document that restored workspaces need a saved link to reappear.

## Related

- [Microsoft Loop](https://www.m365.fm/entity/microsoft-loop/)
- [Loop workspaces](https://www.m365.fm/entity/loop-workspaces/)
- [eDiscovery](https://www.m365.fm/entity/ediscovery/)
- [SharePoint Embedded](https://www.m365.fm/entity/sharepoint-embedded/)

## Sources

- [Microsoft Learn: Loop storage](https://learn.microsoft.com/microsoft-365/loop/loop-storage)
- [Microsoft Learn: Loop compliance summary](https://learn.microsoft.com/microsoft-365/loop/loop-compliance-summary)
- [Microsoft Learn: Manage Loop workspace experiences in SharePoint Embedded](https://learn.microsoft.com/microsoft-365/loop/loop-workspaces-configuration)
- [Microsoft Learn: Managing SharePoint Embedded containers for Loop](https://learn.microsoft.com/en-us/microsoft-365/loop/spe-management)
- [Microsoft Learn: Grant access to containers](https://learn.microsoft.com/en-us/microsoft-365/loop/grant-access)
- [Microsoft Learn: Purview management for Loop](https://learn.microsoft.com/microsoft-365/loop/purview-management)
- [Microsoft Learn: Manage SharePoint Embedded containers in the SharePoint admin center](https://learn.microsoft.com/sharepoint/dev/embedded/concepts/admin-exp/consuming-tenant-admin/ctaux)
- [Microsoft Learn: SharePoint Embedded container management in PowerShell](https://learn.microsoft.com/sharepoint/dev/embedded/concepts/admin-exp/consuming-tenant-admin/ctapowershell)
- [Microsoft Learn: OneDrive and SharePoint retention and deletion](https://learn.microsoft.com/en-us/sharepoint/retention-and-deletion)
