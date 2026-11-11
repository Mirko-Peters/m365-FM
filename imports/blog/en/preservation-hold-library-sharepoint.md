---
title: "The Preservation Hold Library in SharePoint: why it fills up storage"
summary: "The Preservation Hold Library in SharePoint keeps copies of edited and deleted files for retention, and they use quota. See why it grows and what you can do."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [retention-policies, retention-labels, sharepoint, sharepoint-reporting]
keypoints:
  - "The Preservation Hold Library is a hidden system library. SharePoint copies the original of an edited or deleted file into it when retention or a hold requires it."
  - "You are not supposed to edit, delete or move its files yourself. Microsoft points admins to compliance tools instead."
  - "Deleting a file does not free its space while a retention rule still applies, because the copy waits in the library until the retention period ends."
  - "After the period ends, content passes through the recycle bins. Microsoft documents up to 37 days in the library cleanup cycle and then 93 days in the recycle bins."
  - "To reclaim space early you must change the retention design or use a controlled feature such as Priority cleanup, with simulation and a second approver."
faq:
  - q: "What is the Preservation Hold Library in SharePoint?"
    a: "It is a hidden system library that SharePoint and OneDrive create on a site when retention requires it. When a file under a retention policy is edited, or any file under retention is deleted, the original content is copied there. Users do not work in it, and Microsoft says not to edit, delete or move its files."
  - q: "Does the Preservation Hold Library count against SharePoint storage?"
    a: "Independent experts who have measured it report that it does. Tony Redmond wrote that everything counts against the tenant's storage quota, and in a 2026 article that it can take 20 percent or more of a site's space. Microsoft Learn's retention page does not state this, so check your own sites."
  - q: "How do I delete files from the Preservation Hold Library?"
    a: "Do not delete them by hand, because Microsoft does not support that. Files leave the library when their retention period ends and the cleanup job runs. To remove them earlier, Microsoft offers Priority cleanup in Microsoft Purview, which needs a simulation run and approval from a second person."
---

The Preservation Hold Library in [SharePoint](https://www.m365.fm/entity/sharepoint/) is a hidden library where SharePoint keeps copies of files that retention or a legal hold requires it to keep. It fills up storage because deleting a file does not remove it while a rule says it must be kept, so the space is used twice. This article is for SharePoint admins who see storage grow after people delete content, and who need to explain why and decide what to do. It covers where the files go, how long they stay and how to reclaim space without breaking compliance.

## What the Preservation Hold Library in SharePoint is

Microsoft describes it in the article [Learn about retention for SharePoint and OneDrive](https://learn.microsoft.com/en-us/purview/retention-policies-sharepoint) as a hidden system location that is not designed to be used interactively. It stores files automatically when that is needed for compliance reasons. SharePoint and OneDrive create it if the site does not have one. Admins often call it the PHL. It appears on SharePoint sites and OneDrive accounts where retention or holds apply.

The same page lists when content is copied into it. When a user changes an item that is subject to a [retention policy](https://www.m365.fm/entity/retention-policies/), or to a [retention label](https://www.m365.fm/entity/retention-labels/) that marks items as a record, the original content is copied there. When a user deletes any item that is subject to retention, the original content is copied there as well. A standard retention label that is not a record behaves a little differently: editing an item does not copy it, but deleting it does.

So the library is not a bin that users fill by mistake. It is the place where the platform keeps its promise to retain content. That is why the storage use can look strange. The live document library may show 10 GB, while the SharePoint site reports much more as used. Users never see the gap, because they cannot open the folder, so they ask the admin why the quota in Microsoft 365 is full.

## Why it fills up storage

Four things make it grow.

1. **Edits create copies.** Every change to a file under retention policies leaves the earlier content behind. A busy site with many edits adds up quickly.
2. **Deleting does not free space.** The deleted file moves to the library instead of disappearing, so deleting items from the document library or a folder does not reduce the total. Users clear the recycle bin and see no change in the storage figure.
3. **Retention periods are long.** If the policy keeps content for seven years, the copy stays at least that long.
4. **Version limits stop applying.** Microsoft says the default is a minimum of 500 major versions, but under a retention policy or an eDiscovery hold the versioning limits of the document library are ignored until the retention period of the document is reached. Old versions stay.

Does the library count against your quota? Microsoft's retention page does not say. Independent experts who have looked at tenants say it does. Tony Redmond wrote in [Office 365 for IT Pros](https://office365itpros.com/2021/10/07/retention-changing-sharepoint-onlines-preservation-hold-library/) that everything counts against the tenant's overall SharePoint storage quota, and he noted that per-site storage reports did not break out the library. In a January 2026 article on [Practical365](https://practical365.com/?p=62964) he wrote that it is easy for sites to use 20 percent or more of their occupied space for it. Treat these as expert observations, and measure your own tenant.

## How long files stay in the library and the recycle bin

Microsoft documents the cleanup cycle. A timer job runs on the library. For content that has been there for more than 30 days, it compares the content to the queries of its retention settings. Content that is older than the retention period, and not waiting for disposition review, is deleted from the library. The job runs every seven days, so together with the minimum 30 days it can take up to 37 days for content to be deleted from the library.

Deletion also passes through the recycle bins. Microsoft says content from the library goes through the second-stage recycle bin, and a 93-day period spans both the first-stage and second-stage bins. Only site collection admins can see the second-stage bin.

An example shows what this means in time. A retention policy keeps files for three years. A file is deleted on day 400. Its copy waits in the library until the retention period ends, then the cleanup job needs up to 37 days to pick it up, and then the recycle bin holds it for up to 93 more days. Space comes back well after the three years are over.

Other rules can extend the stay. Microsoft notes that permanent deletion is always suspended if the same item must be retained because of another retention policy, a label, or an eDiscovery hold.

## Example: where 49 GB comes from

This example uses invented numbers and a simplified model. A team site has a library with 2,000 files of about 5 MB each, so 10 GB of live content. A retention policy covers the site. During the year, each file is edited four times, and for this example each edit leaves one 5 MB copy.

- Live content: 2,000 files × 5 MB = 10,000 MB, about 10 GB.
- Copies from edits: 2,000 files × 4 edits × 5 MB = 40,000 MB, about 39 GB.
- Space used by the site: about 49 GB, almost five times what users see.

Real numbers depend on how SharePoint handles versions on your site. Microsoft says that to retain all versions of a file, versioning must be turned on for the site. The point of the example is the ratio, not the exact figure: a site's storage can be many times its visible content.

## How to delete content and reclaim space safely

Start with the cause, not the library. Configure the rules first, and only then troubleshoot the symptom. Do not try to empty the library manually. Microsoft says it is not supported to edit, delete or move the files yourself, or to change or remove labels for them.

1. **Find the sites where the gap is large.** Compare what the library shows with what the site reports as used. Use your usual [SharePoint reporting](https://www.m365.fm/entity/sharepoint-reporting/) to rank sites by size.
2. **Check whether the rule is too broad.** A policy that keeps everything on every site for ten years may be stronger than your legal duty. Compliance owners must decide this, not admins alone.
3. **Narrow the rule if the law allows it.** Moving some content under a shorter rule lets copies expire sooner.
4. **Use Priority cleanup for justified cases.** Microsoft's article on [Priority cleanup](https://learn.microsoft.com/en-us/purview/priority-cleanup-onedrive-sharepoint) describes it as a way to override retention settings or eDiscovery holds to delete content from OneDrive and SharePoint. It uses a KeyQL query such as `ParentLink:PreservationHoldLibrary`, requires at least one simulation run, and requires another person to approve the deletion. Items go to the second-stage recycle bin and follow the normal time periods.
5. **Plan for departing users.** Microsoft says a user's OneDrive cannot be deleted while items with an unexpired retention period are in the library, and Priority cleanup can help here.

Priority cleanup has limits. Microsoft says it cannot be used for items marked as a record or regulatory record. It is also not a quick fix, because the policy status can take up to seven days to show as enabled.

## Common mistakes

- **Treating the library as a cleanup target.** Manual deletion is not supported and can break your compliance position.
- **Blaming users.** Users cannot see this library, so telling them to delete more files does not help.
- **Skipping the legal check.** Overriding retention is a legal decision. Involve compliance before you create a Priority cleanup policy.
- **Forgetting the recycle bin time.** After the library, content spends up to 93 days in the bins.
- **Not measuring.** Without a baseline per site, you cannot tell whether a rule change helped.

## How software can help

Start with Microsoft's own tools: the storage view in the SharePoint admin center, the Purview retention pages and Priority cleanup. For ongoing control, export site sizes on a schedule with PowerShell and keep them in a simple sheet. Watch the sites with the biggest gap between live content and total use. Reports from third-party tools can also give a per-site overview, but they need the same care about which numbers include hidden content.

## Next step

Pick the three largest sites that have a retention policy and check how much of their storage the Preservation Hold Library in SharePoint holds. Then ask your compliance owner whether each rule needs to be as broad and as long as it is today.
