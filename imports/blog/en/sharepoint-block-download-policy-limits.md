---
title: "Block download in SharePoint: what it stops and what it does not"
summary: "The SharePoint block download policy gives browser-only access and stops download, print and sync. See what it blocks, what it misses and how to roll it out."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [block-download-policy, sharepoint-sharing-links, sensitivity-labels, guest-access]
keypoints:
  - "The block download policy is set per site, including OneDrive sites, and cannot be set for the whole organization in one step."
  - "Affected users get browser-only access: no download, print or sync, and no opening of the file in desktop apps such as Word, Excel or PowerPoint."
  - "The policy needs the SharePoint Advanced Management prerequisites and is turned on with Set-SPOSite and the BlockDownloadPolicy parameter."
  - "A view-only sharing link can also block download for one file, but recipients then see the file only on the web, not in desktop or mobile apps."
  - "Block download limits copies, not knowledge: Microsoft's pages do not describe screenshots or copying text, so treat it as one layer, not a vault."
faq:
  - q: "What does the SharePoint block download policy do?"
    a: "It gives affected users browser-only access to a site or OneDrive. Users cannot download, print or sync files, and they cannot open them in apps such as Word, Excel or PowerPoint. Files also cannot be moved to other SharePoint sites. Microsoft says the policy is set per site, not for the whole organization."
  - q: "Does block download stop screenshots or copying text?"
    a: "Microsoft's documentation does not describe screen capture or copy and paste for this policy, so you should not assume that it stops them. People who can read a file in the browser may still copy what they see. Use it to limit file copies, and add labels, access reviews and training for the rest."
  - q: "Can I block download for a single shared file?"
    a: "Yes. When you create a view-only sharing link, you can turn on Block download. Recipients can then view the file on the web, but they cannot download, print or copy it, and they cannot open it in desktop or mobile apps. Admins can limit this option to Office files with a PowerShell setting."
---

A SharePoint block download policy gives users browser-only access to a site: they can view files on the web, but they cannot download, print or sync them. That is what it stops. What it does not stop is just as important, because it does not make a file secret. This article is for security admins who need to decide where to use it. You will learn what Microsoft says it does, how to turn it on, how it differs from a view-only link, where it falls short, and see a worked example.

## What does the SharePoint block download policy do?

Microsoft describes the feature on its page about the [block download policy for SharePoint sites and OneDrive](https://learn.microsoft.com/en-us/sharepoint/block-download-from-sites). It blocks downloads from a site or OneDrive without needing Microsoft Entra Conditional Access policies. The result for the user is browser-only access.

In detail, Microsoft lists these effects:

- Users cannot download, print or sync files.
- Access through apps is blocked, including Microsoft 365 apps such as Word, Excel and PowerPoint.
- Files cannot be moved to other SharePoint sites, and moves by other means such as Power Automate or Quick Steps are blocked too.
- Users who hit the limit see a banner that says their organization does not allow them to download, print or sync from the site.

Two scope points matter. First, the policy is set per site, and that includes OneDrive sites. It cannot be set at the organization level. Second, apps that run in app-only mode, such as antivirus tools and search crawlers, are exempt. So your security tools keep working.

The [block download policy](https://www.m365.fm/entity/block-download-policy/) is therefore a site-level control for sensitive libraries, not a tenant-wide switch.

## How do you turn it on?

You need to meet the SharePoint Advanced Management prerequisites and have the SharePoint Online PowerShell module. Microsoft's page gives the basic command. For a site, run Set-SPOSite with the site URL and the BlockDownloadPolicy parameter set to true. For a OneDrive site, use the OneDrive URL instead.

You can then add exclusions, which is how you keep the people who run the site productive:

- **Site owners.** The ExcludeBlockDownloadPolicySiteOwners parameter lets owners keep normal access.
- **Groups by ID.** The ExcludedBlockDownloadGroupIds parameter takes a list of group IDs.
- **SharePoint groups by name.** The ExcludeBlockDownloadSharePointGroups parameter takes group names.
- **Read-only site.** The ReadOnlyForBlockDownloadPolicy parameter also makes the site read-only.

The page also shows that the policy can be tied to a sensitivity label through the Set-Label cmdlet and its advanced settings, so that sites with a given label get the policy. The example in the page uses placeholder syntax, so check the current text before you copy it. This is where [sensitivity labels](https://www.m365.fm/entity/sensitivity-labels/) and the policy meet.

Plan the rollout in three small steps. First, choose one pilot site and a pilot group of five to ten users, and write down which apps they use every day. Second, turn the policy on for that site, ask the pilot group to repeat their normal tasks, and collect every message or failure. Third, decide the exclusions from what you learned, not from guesses, and only then extend the policy to the next site. A pilot of two weeks is often enough for one site.

Microsoft also warns that blocking downloads can affect some apps, including some Office apps. Its advice is to turn the policy on for a pilot group and test the apps your organization uses, with a special look at Power Apps and Power Automate. With classic SharePoint site templates, site images might not render, because the browser cannot download the original image files.

## How is it different from a view-only sharing link?

There is a second control that is easy to confuse with the policy. Microsoft's support page on [blocking downloads for view-only files](https://support.microsoft.com/en-US/onedrive/block-downloads-for-view-only-files-in-sharepoint-and-onedrive) describes a setting on a single sharing link.

When you create a link, you clear **Allow editing** and turn on **Block download**. Recipients then do not see options to download, print or copy the file. They can view it on the web, but they cannot open it in desktop or mobile apps. The option applies to view-only links for Office documents and other supported types, such as PDFs, images and audio. Admins can limit it to Office files with the BlockDownloadLinksFileType setting in Set-SPOTenant or Set-SPOSite.

The difference is the scope:

- **The policy** covers a whole site, for everyone who is not excluded.
- **The link option** covers one file for the people who get that link.

Use the link option when one outside person needs to read one document. Use the policy when a whole library holds content that should stay inside the browser. A [sharing link](https://www.m365.fm/entity/sharepoint-sharing-links/) with Block download is a good fit for an external reviewer who should read a draft but not keep a copy.

## What does it not stop?

This is the part to explain to your managers. Microsoft's page does not say that the policy covers some things that people often assume.

- **Screenshots and photos of the screen.** The page does not mention screen capture. Anyone who can see a file can photograph it.
- **Copying text.** The page does not mention copy and paste for the site policy. For the link option, Microsoft says recipients do not see options to copy the file.
- **Teams meeting recordings.** The page points to a separate article, so do not assume that this policy covers them.
- **Guests and unmanaged devices.** The page does not explain how these are handled, so test them.
- **Copilot.** The page does not say how the policy relates to Copilot, so do not make claims about it.

The honest summary is that the policy limits copies of the file. It does not limit what a trusted reader can remember or write down. It is also not a replacement for the right [guest access](https://www.m365.fm/entity/guest-access/) decisions: if the wrong person can open the site in the browser, they can read it.

## Which license do you need, and how does Conditional Access fit in?

The policy is a SharePoint Advanced Management feature. Microsoft's page on SharePoint Advanced Management features with a Copilot license lists block download policy among the features that SharePoint admins get when the organization assigns at least one Microsoft Copilot license to a user. That page does not say whether every user or every administrator needs a license, so check the licensing terms before you plan a rollout.

Microsoft positions the site policy as a way to block downloads without Microsoft Entra Conditional Access policies. If your tenant already uses Conditional Access, ask your identity team how it relates to the site policy, and keep the decision in one place so that nobody tests two controls against each other. The site policy is set per SharePoint site, so the tenant also needs a list of the sites that use it, a named owner for each and a review date. The page does not describe how the policy relates to Copilot, so avoid promises in that area.

## Example: a due diligence site with 18 reviewers

The numbers are invented to show the method. A company runs a due diligence site for a possible acquisition. The site holds 240 documents. Eighteen people need access: 12 internal staff, 4 outside advisers and 2 lawyers.

The security admin makes four decisions:

1. Turn on the block download policy for the site, so the 4 advisers and 2 lawyers can read only in the browser.
2. Exclude the 2 site owners with the owner exclusion, so they can still reorganize files.
3. Exclude one security group of 6 internal analysts, because they need to open files in Excel to build models. This is a trade-off, and the admin records it with a reason.
4. Add a review date after 60 days, when the deal should be closed.

Count the effect. Of the 18 users, 2 are owners and 6 are analysts, so 8 are excluded. The other 10 are browser-only: the 4 advisers, the 2 lawyers and the 4 remaining internal staff. The admin tells the deal team that screenshots are still possible, and the contract with the advisers covers that risk.

Also note what the admin did not do. The policy was not applied to the whole tenant, because it cannot be. The admin also did not promise the deal team that data cannot leak. A clear message about limits builds more trust than a claim that cannot be kept, and it keeps the decision with the people who own the risk.

The point is to match the tool to the risk. A simple site setting removes the easiest way to leak 240 files: a bulk download. It does not replace trust and a signed agreement.

## Common mistakes

- **Treating it as a vault.** It stops downloads, not screenshots or memory.
- **Turning it on for a whole department at once.** Pilot it first and test the apps people use.
- **Forgetting the exclusions.** Owners and key groups may need normal access to keep the site working.
- **Confusing the site policy with the link option.** One covers a site, the other a single link.
- **Skipping the review date.** A site that has finished its purpose should lose the restriction or be archived.

## How software can help

Start with the SharePoint admin center and PowerShell. Set-SPOSite shows the policy per site, and a short script can list which sites have it on. If you manage many sites, a report that lists sites by sensitivity, external sharing level and download policy helps you spot gaps. Whatever method you choose, test the policy on a pilot site with a few users first and compare the report with what those users actually see.

## Next step

Pick one site with sensitive content today and test the SharePoint block download policy on it with a pilot group. Write down what it stops, what it does not, and who needs an exclusion.
