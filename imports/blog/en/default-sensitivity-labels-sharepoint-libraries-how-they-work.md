---
title: "Default sensitivity labels for SharePoint libraries: how they work"
summary: "A SharePoint library default sensitivity label covers new and edited files, not files at rest. See the setup rules, overrides and how auto-labeling fills in."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [sensitivity-labels, auto-labeling, sharepoint-document-libraries, purview]
keypoints:
  - "A library default label applies to new uploads, edited files and unlabeled files, but not to existing files at rest until they are edited or uploaded."
  - "It does not inspect content, so Microsoft calls it a baseline and recommends adding auto-labeling and manual labeling."
  - "The library default never overrides a manual label, and it overrides an automatic or policy default label only when its own priority is higher."
  - "Label settings with user-defined permissions, an access expiry other than Never or Double Key Encryption are unsuitable as a library default."
  - "To label files already in the library, use a service-side auto-labeling policy, which must run in simulation first and has documented limits."
faq:
  - q: "Does a default label apply to existing files in a SharePoint library?"
    a: "Not to files at rest. Microsoft states that the library default applies to new files uploaded, existing files that are edited, and unlabeled files, but it does not label existing files in SharePoint until they are edited or uploaded. To label files that nobody touches, use an auto-labeling policy for SharePoint and OneDrive."
  - q: "Will a library default label overwrite a manual label?"
    a: "No. Microsoft's override table says a manually applied label is never overridden by the library default, whatever its priority. An automatic or policy default label with lower priority is overridden, and one with higher priority is not. Check your label order in the Purview portal before you roll out defaults."
  - q: "Why can I not pick a default label for my library?"
    a: "Common causes are listed by Microsoft. SharePoint IRM is enabled on the library, the label is not published with the scope Files and other data assets, sensitivity labels are not enabled for Office files in SharePoint and OneDrive, or you are not a site admin. Some label settings, such as user-defined permissions, are also unsuitable."
---

A SharePoint library default sensitivity label puts one label on new uploads, edited files and unlabeled files in a library, with no content inspection. It does not label files that already sit in the library until someone edits or uploads them. This article is for compliance officers who must set a baseline for libraries. You will learn the prerequisites, how the override rules work, why existing files stay out, how to fill that gap with auto-labeling, and see a worked example with invented numbers.

## What does a library default label do?

Microsoft's page on [default sensitivity labels for SharePoint document libraries](https://learn.microsoft.com/purview/sensitivity-labels-sharepoint-default-label) says a site admin can set a default label on a library. It applies to new files that are uploaded, to existing files that are edited, and to unlabeled files. Files that already have a label are also covered when the library label has a higher priority, except manually applied labels, as the override rules below show.

The page calls this automatic, location-based labeling without content inspection, and a baseline level of protection. That is the key to using it well. The label does not know what is in a file. It knows only where the file sits. So it suits a library whose whole purpose is clear, such as a finance close folder, and it does not suit a mixed library.

Timing differs by route. In Office for the web, the default label can be applied without delay. After an upload, it can take a few minutes. In Microsoft 365 Apps on Windows, macOS, iOS and Android, it is applied after the app is closed. These details help when a user asks why a label has not shown yet.

The feature belongs to the wider topic of [sensitivity labels](https://www.m365.fm/entity/sensitivity-labels/), where each label has a priority, a scope and settings that decide what protection it brings. Read the label list first, because the override logic depends on it.

## How do you set a SharePoint library default sensitivity label?

The setting is made by a site admin, following a Microsoft Support article that the Learn page links to. The Learn page does not repeat those steps, so check them in your tenant. It lists the prerequisites:

1. **Publish the labels.** The labels must be created and published, with the scope Files and other data assets, to the users who will set the default.
2. **Enable labels for Office files.** Sensitivity labels must be enabled for Office files in SharePoint and OneDrive. Microsoft gives a check: the tenant property EnableAIPIntegration should be True. For PDF support, EnableSensitivityLabelforPDF should be True.
3. **Do not use SharePoint IRM.** If IRM is enabled on the library, you cannot select a default label.
4. **Use a site admin.** Site admin permissions are needed to apply or change the label.
5. **Mind empty files.** Files must contain content to be labeled. Empty files are labeled when they are updated with content.

The page also names label configurations that are unsuitable for a library default: labels that let users assign permissions with a prompt, labels where user access expires after any period other than Never, and labels that use Double Key Encryption. It also says not to select the setting to extend protection on download, copy or move in the library settings, because that is a preview for a different scenario.

Plan the labels for [document libraries](https://www.m365.fm/entity/sharepoint-document-libraries/) before you switch defaults on. A library that gets an encrypting label changes who can open files, so test with a small library and a few users.

## How do the override rules work?

A library default does not always win. Microsoft gives a table:

- A manually applied label is not overridden, whatever its priority.
- An automatically applied label with lower priority is overridden. With higher priority, it is not.
- A policy default label with lower priority is overridden. With higher priority, it is not.

The page contrasts this with a policy default label, which never overrides an existing label. Its example: a user whose policy default is General saves a new file to a library whose default is Confidential. The file becomes Confidential, because that label has the higher priority.

This leads to a design rule. The order of your labels is part of your protection. Check priorities in the Purview portal before you roll out library defaults, and keep the order in one document that the label owners can read.

## Why do existing files stay unlabeled?

The page states that the library default does not apply to existing files at rest in SharePoint. Files are labeled only when they are edited or uploaded. A library with 40,000 old files and a new default label will keep most of them unlabeled for a long time, because nobody opens them.

This matters for any control that depends on labels. If you plan to use labels for access rules or for Copilot controls, the files at rest are the gap. Microsoft's page recommends that you supplement default labeling with automatic labeling that uses content inspection, and that you encourage manual labeling so that users can change the default when needed.

## How does auto-labeling label files already in the library?

Microsoft's page on [applying sensitivity labels automatically](https://learn.microsoft.com/purview/apply-sensitivity-label-automatically) describes service-side policies for SharePoint and OneDrive. They label data at rest, before or after the policy is created. They run continuously until deleted, and new and modified files are included.

The page lists conditions that shape your plan:

- **Simulation first.** You cannot label files until the policy has run at least one simulation. Microsoft names 12 hours as a target completion time, not a guarantee. Simulation needs auditing to be on, and it supports up to 20,000,000 matched files. If more match, the policy cannot be turned on, and you narrow the scope.
- **Limits.** The page lists 100 auto-labeling policies per tenant and up to 1,000 explicitly included or excluded SharePoint sites per policy in the portal. It states an absolute maximum of 500,000 labeled files per tenant per day across all policies, and says that this is not a guaranteed daily rate.
- **Existing labels.** A policy that applies a label will not remove an existing label to leave content unlabeled. Manually applied labels of lower priority are not overridden by default. Automatically applied or default labels of lower priority are overridden, and higher priority labels are not.
- **File types.** PDF, docx, pptx and xlsx are supported, and PDFs are skipped unless PDF labeling is enabled for the tenant. Files checked out for editing, and files in libraries that require check-out, are excluded at run time.

In daily work, this feature is the other half of the plan: the library default sets a floor for new files, and [auto-labeling](https://www.m365.fm/entity/auto-labeling/) catches content that matches your sensitive information rules, including old files. [Microsoft Purview](https://www.m365.fm/entity/purview/) offers both, and they work best together.

## Why does the default label option not show up?

Check three things before opening a ticket. Only a site admin can configure the default, and a tenant SharePoint admin who is not a site member does not see the library, as [Office 365 for IT Pros noted in 2023](https://office365itpros.com/2023/09/14/document-libraries-admin/). Next, check the tenant switch described in the next section. Last, check licensing: the Learn page names no licenses.

That last point is unclear. In a [Microsoft Q&A thread from November 2026](https://learn.microsoft.com/en-gb/answers/questions/6057780/default-sensitivity-label-for-sharepoint-library-f), a Business Premium tenant with the Purview Suite got "You do not have required licenses" when setting a library default. The only answer came from a fellow user, not Microsoft. Treat it as an open report and check the service description for your plan.

## How do you monitor and switch off the feature?

The Learn page offers two ways to see what happened. The Sensitivity column in the SharePoint library shows label names, but its tooltip for automatic labeling also appears for auto-labeling policies and policy defaults, so it does not tell you which feature applied the label. The audit log helps more: in the Applied sensitivity label file event, a value of 6 in the action source details means the library default label was applied. Map label GUIDs to names with Security and Compliance PowerShell.

To turn the feature off for the tenant, an admin can set DisableDocumentLibraryDefaultLabeling to true with the SharePoint Online Management Shell. The option then disappears from the library settings. Libraries that were configured keep the selection, but it is deactivated, and labels that were already applied are not removed. The change takes about 15 minutes.

## Example: 12 libraries and 40,000 old files

The numbers are invented to show the method. A company has 12 libraries with contracts, HR cases and finance files, and a total of 40,000 existing files. The compliance officer wants a baseline in one quarter.

1. **Labels.** Four labels exist: Public, Internal, Confidential and Highly Confidential, in rising priority. The officer checks that none is configured with user-defined permissions or Double Key Encryption.
2. **Defaults.** 8 libraries are single-purpose, so they get a default label. 5 get Confidential, 3 get Internal. The 4 mixed libraries get no default.
3. **Existing files.** The 8 libraries hold 26,000 files that stay unlabeled until touched. The officer creates one auto-labeling policy for the HR and finance sites and runs it in simulation. The target time is 12 hours, and the result takes a day.
4. **Review.** The simulation matches 3,100 files in those 8 libraries. The officer samples 100, finds 4 wrong matches, adjusts the rules and runs the simulation again.
5. **Enforce.** The policy is turned on. Manually labeled files are left alone, as the override table states.

Count the effect: 8 libraries with a floor for new files, 3,100 old files labeled on a rule, and 4 mixed libraries left for manual labeling and training. About 22,900 files at rest in the 8 libraries are still without a label, and the officer records that in the register of open risks, so nobody assumes full coverage.

## Common mistakes

- **Expecting a default to label old files.** It applies to new and edited files only.
- **Using it on mixed libraries.** The label ignores content, so one label fits one purpose.
- **Choosing an unsuitable label.** User-defined permissions, an expiry and Double Key Encryption do not work as defaults.
- **Ignoring label priority.** The override table depends on your label order.
- **Using SharePoint IRM on the same library.** You then cannot select a default.
- **Skipping simulation.** Auto-labeling needs a simulation run before it can label.

## How software can help

Start with the Purview portal, the audit log and the label columns in the library. When you need a list of libraries with no default, or the share of unlabeled files per site, a script or a reporting tool can build it from library and file metadata. Compare any tool with the Purview results on a few libraries first, and check where it stores the data it reads.

## Next step

Choose three single-purpose libraries and decide the label for each. Then check the prerequisites, set the SharePoint library default sensitivity label, and write down how you will handle the files already at rest.
