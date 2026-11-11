---
title: "Site labels or file labels in SharePoint: what is the difference?"
summary: "Sensitivity label site vs file: a container label sets the rules of a workspace, a file label protects one document. See what each does and how to combine them."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [container-labels, sensitivity-labels, sharepoint, guest-access]
keypoints:
  - "A site label (container label) controls the workspace: privacy, guest access, external sharing and access from unmanaged devices. It does not touch the files inside."
  - "A file label classifies and protects one document or email, for example with encryption and visual markings, and it travels with the file."
  - "Files do not inherit a site label. Encryption and content markings only come from a label applied to the file itself."
  - "One label can have scope for both containers and items, but a label scoped only to groups and sites never appears in Office apps."
  - "Site owners can change external sharing settings by switching the label, so only publish those settings if you want that."
faq:
  - q: "Does a sensitivity label on a SharePoint site label the files inside it?"
    a: "No. Microsoft states that items in a labeled container do not inherit the label and do not get item-level settings such as encryption or content markings. The site label only applies workspace settings. To label files, apply file labels separately, manually, by default library label or by auto-labeling policy."
  - q: "Can the same sensitivity label be used for sites and files?"
    a: "Yes, if the label scope includes both Files and emails and Groups and sites. The label then offers both kinds of settings. If you select only the Groups and sites scope, the label is not shown in Office apps and cannot be applied to files or emails."
  - q: "Who can change a site's sensitivity label?"
    a: "For a group-connected site, the owners of the Microsoft 365 group can change the label. For a site that is not group-connected, a SharePoint site admin can. Shared channels in Teams use the label of the parent team, and it cannot be removed or replaced for the channel."
---

If you wonder about the sensitivity label site vs file question, the short answer is scope. A site label (Microsoft calls it a container label) sets the rules for a whole workspace: who can join, whether guests are allowed and how members can share content from the site. A file label protects one document and goes wherever the document goes. This article is for compliance officers who must decide which label does which job before they roll out sensitivity labels in Microsoft 365, and who need to explain the difference to site owners.

## What a site label controls

A site label belongs to a workspace such as a [SharePoint](https://www.m365.fm/entity/sharepoint/) site, not to a document. Microsoft's guide to [sensitivity labels for groups and sites](https://learn.microsoft.com/en-us/purview/sensitivity-labels-teams-groups-sites) says you can protect Microsoft Teams sites, Microsoft 365 groups, SharePoint sites, Viva Engage communities and Loop workspaces this way. On the M365.FM topic page, these are called [container labels](https://www.m365.fm/entity/container-labels/).

The settings a container label can enforce include:

- **Privacy:** public or private, locked when the label is applied.
- **External user access:** whether the owner may add guests, the setting behind [guest access](https://www.m365.fm/entity/guest-access/).
- **External sharing from SharePoint sites:** how far the site may be shared.
- **Access from unmanaged devices:** this setting uses Microsoft Entra Conditional Access. Microsoft notes that without the dependent policy for SharePoint, the option has no effect.
- **Authentication context:** users who do not meet the condition are denied access.

Two more settings, the default sharing link type and some site sharing options, are configured with PowerShell only. Notice what is missing from the list: encryption and content marking. A site label never adds those.

## What a file label controls

A file label is the classic [sensitivity label](https://www.m365.fm/entity/sensitivity-labels/) on a document or email. It classifies the item and can add encryption, headers, footers or watermarks. Sensitivity labels protect documents in SharePoint Online and Office files in OneDrive. Labels can be applied to documents in SharePoint through Office apps, Office for the web or defaults. Because the label sits on the file, it stays with the file after download or email. A labeled file keeps its watermark and its encryption wherever it goes.

People apply file labels in Office apps. If you turn on built-in labeling for files in SharePoint and OneDrive, they can also apply labels in Office for the web and in the details pane without opening the file. Microsoft explains the details in [enabling sensitivity labels for files in SharePoint and OneDrive](https://learn.microsoft.com/en-us/purview/sensitivity-labels-sharepoint-onedrive-files). That page also says that until you enable the feature, SharePoint and OneDrive cannot process encrypted files, so co-authoring, eDiscovery, data loss prevention and search do not work for them.

Files can also get a label without a person choosing it: through a default label on a document library or through an auto-labeling policy. Those are separate features from site labels. Microsoft notes that automatic labeling in Office for the web supports conditions based on sensitive information types only, not trainable classifiers. A default sensitivity label for a library is a simpler option for applying labels to new files.

## Sensitivity label site vs file: a side-by-side comparison

The two label types differ on five points.

1. **What gets labeled.** A site label goes on a team, group or site. A file label goes on a document or email.
2. **What it enforces.** A site label enforces workspace rules such as privacy and guest access. A file label enforces protection of the content, such as encryption and markings.
3. **Inheritance.** Microsoft says items in these containers do not inherit the label. A file in a Confidential site is not Confidential just because the site is.
4. **Movement.** A file label travels with the file. A site label stays with the site.
5. **Who applies it.** Site labels are chosen at creation or by owners and admins. File labels are chosen by users, defaults or policies.

For data security, think of a site label as the lock on the room and a file label as the lock on the folder inside it. Locking the room does not lock the folder. Locking the folder does not decide who may enter the room.

## Use sensitivity labels in Microsoft 365 for both

You do not need two parallel sets of labels. When you use sensitivity labels, you choose a scope in the label settings, and a label can cover files and emails, groups and sites, or both. The groups scope covers Teams and Microsoft 365 groups, and the files scope covers Office files. Microsoft warns that when only the Groups and sites scope is selected, the label is not displayed in Office apps and cannot be applied to files and emails.

Some labels fit both. A label named "Highly confidential" can lock a site to private with no guests and also encrypt documents that people label with it. That combination helps reduce the risk of leaks, because it covers sensitive data at both levels. Some labels fit only one. "Public" may make sense for a site and add no value on a single file. Best practices for naming are simple: use the same words for both uses, and describe the effect in the label description. Otherwise people will assume the site label protects the content.

Mismatches are possible, because the permission to upload does not depend on the label. If a user uploads a file with a higher-priority label to a site with a lower-priority label, the upload is not blocked. Microsoft says an audit event and an email about an incompatible label are generated instead. That is a signal to review, not a control.

## Example: a project site with guests

This example uses invented numbers. A company with one Microsoft 365 tenant has 400 sites and defines three site labels: General, Internal only and Restricted. After an inventory, the compliance team finds:

- 260 sites are General: private or public, guests allowed.
- 100 sites are Internal only: private, no guests.
- 40 sites are Restricted: private, no guests, external sharing off, access from unmanaged devices limited.

Then a project team in one of the 260 General sites invites two guests and shares a draft contract. The site label allows guests, so nothing is wrong at site level. But the contract has no file label, so nothing encrypts it. If a guest downloads it and forwards it, nothing stops that.

The compliance team has two options. It can move the project to a Restricted site without guests. Or it can keep the guests, apply a file label with encryption to the contract and name the people who may open it. In both cases it also asks for a default file label on the project library, so new files are labeled from the start.

The numbers show where the effort goes. Restricted sites are only 40 of the 400 sites, or 10 percent, but file labels must reach every file inside them. Site labels are a one-time setting per site. File labeling needs a default, a policy and training, and it never really ends.

## How to apply sensitivity labels with Microsoft Purview

Microsoft Purview Information Protection holds the labels, and the path from label to site has four steps. Each one can fail quietly.

1. **Create and publish sensitivity labels** in Microsoft Purview. Configure sensitivity labels for sites and select the Groups and sites scope, with or without Files and emails.
2. **Synchronize it to Microsoft Entra ID.** Microsoft's guide names a PowerShell command, `Execute-AzureAdLabelSync`, for this step.
3. **Add it** to one of your label policies. Users who get the policy can select the label for sites and groups, and you decide who gets which labels.
4. **Apply it.** People choose it from the Sensitivity dropdown when they create a team. To add a sensitivity label to an existing team or group, an owner or admin edits it afterwards. For a SharePoint site, people choose it under Advanced settings. Admins can edit an existing site under Active sites and the Policies tab in the SharePoint admin center, or label many sites with `Set-SPOTenant`. Teams applies the same label to the Microsoft 365 group and its connected team site.

After that, the site label is hard to change by accident. For a group-connected site, only the owners of the Microsoft 365 group can change it. For a site without a group, a SharePoint site admin can. Shared channels in Microsoft Teams use the label of the parent team, and it cannot be removed or replaced for the channel.

## Common mistakes

- **Assuming the site label protects the files.** It does not. Encryption and markings come only from file labels.
- **Publishing sharing settings by accident.** Microsoft warns that when you configure the external sharing and authentication context settings, site owners can change them by changing the label. Do not configure them if you do not want that.
- **Forgetting the dependent policies.** The unmanaged device setting needs a Conditional Access policy, and an authentication context must exist in Entra before you can use it.
- **Skipping the sync and the wait.** Labels must be synchronized to Microsoft Entra ID before they can be used for groups, and Microsoft advises waiting at least an hour for a new label and 24 hours for an existing one.
- **Enabling file labels late.** Labels applied before SharePoint was enabled for sensitivity labels are not recognized. Those files must be downloaded and uploaded again.

## How software can help

You can do most of this with Microsoft's own tools. The SharePoint admin center lets you edit the label of an existing site under its Policies tab, and PowerShell commands such as `Set-SPOTenant` and `Set-SPOSite` apply labels in bulk. For the review, keep a simple inventory that lists each site, its label, its owners and its guest setting, and compare it with a sample of files from the most sensitive sites. A spreadsheet and a regular export are enough to start.

## Next step

Pick one sensitive site this week and write down its site label and the file labels its documents actually carry. Then decide whether your sensitivity label site vs file rules need a default library label, or a change in who may switch the site label.
