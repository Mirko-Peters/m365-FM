---
title: "Purview Auto-Labeling Did Not Label Your Files: A Checklist for Gaps and Surprises"
summary: "Auto-labeling in Microsoft Purview often labels less than admins expect: old files, attachments, manual labels, visual markings. This checklist separates the documented limits from community reports."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [sensitivity-labels, auto-labeling, purview]
keypoints:
  - "Client-side labeling reacts when a user creates or edits content. Files that already exist need a service-side auto-labeling policy, and that policy must run a simulation before it can label anything."
  - "Microsoft Learn says an email can be labeled while its attachment is not, and that auto-labeling never replaces a manual label unless the policy is set up to do so."
  - "Service-side auto-labeling for SharePoint and OneDrive does not add headers, footers or watermarks, even if the label defines them."
  - "For bulk labeling when a policy is not an option, the Information Protection client cmdlet Set-FileLabel is the documented route."
faq:
  - q: "Why did my auto-labeling policy not label files that already existed?"
    a: "Two common reasons. First, client-side auto-labeling, which is a setting on the label itself, only acts when a user creates or edits content in a supported app. Second, a service-side policy cannot label or remove labels until it has run at least one simulation. In one 2025 community thread, a solved answer drew exactly this client-side versus service-side line. Check which method you actually configured."
  - q: "Why is the email labeled but not its attachment?"
    a: "Microsoft Learn describes this as expected behavior for service-side policies on Exchange: the attachment is scanned for the conditions, but when it matches, the email gets the label and the attachment does not. If the label applies encryption, unencrypted Office attachments are encrypted with settings taken from the email."
  - q: "Can auto-labeling add a watermark or footer to documents in SharePoint?"
    a: "No. Microsoft Learn states that visual markings from the label are not applied to documents by auto-labeling policies. A 2026 community answer, marked as the solution, suggested desktop automation that opens each file. That is a workaround from the community, not a Microsoft-documented feature."
  - q: "Does auto-labeling overwrite a label a user chose?"
    a: "By default, no. Microsoft Learn says manually applied labels are not replaced. A service-side policy can be configured to replace a manual label of lower priority, and the Emails only option lets a policy override an existing label on mail when the policy label has a higher priority."
---

You created a sensitivity label, set up auto-labeling, and checked a few days later. Part of the content has the label. A lot of it does not. Some files, some attachments, and every visual marking are missing.

These gaps showed up in several Microsoft community threads between 2025 and 2026. Most of them are not bugs. They are documented limits of how auto-labeling works. This article walks through them in the order I would check. It is not an official Microsoft procedure. Where a point comes only from a community reply, I say so. The main reference is the Microsoft Learn page on [automatically applying sensitivity labels](https://learn.microsoft.com/en-us/purview/apply-sensitivity-label-automatically), which was updated in November 2026.

## Symptoms from the threads

- Existing documents stayed unlabeled even though an auto-apply label was configured, and DLP alerts fired for the same sensitive information type.
- In Outlook desktop and on the web, pasted text in the email body triggered a label recommendation, but a text file attached to the same email did not.
- An unlabeled Word attachment did not get the label of the email.
- A tenant wanted visible classification in file headers and footers, but service-side labeling did not add them.
- An administrator asked what happens to documents that already carry a lower label when a stricter auto-labeling rule starts to match.

## Step 1: Find out which kind of auto-labeling you built

Learn describes two separate mechanisms.

- **Client-side:** a setting inside the label itself, called auto-labeling for files and emails. It works in Word, Excel, PowerPoint and Outlook. It can recommend a label or apply one while a person works.
- **Service-side:** an auto-labeling policy for SharePoint, OneDrive and Exchange. It runs in the service and does not depend on app versions.

In the 2025 thread, the answer that was marked as the solution made the same point. Client-side labeling applies when content is created or edited after setup, so files created earlier and not touched since stay unlabeled. Content that is already stored needs a service-side policy.

In the Microsoft Purview portal, service-side policies are under **Solutions**, **Information Protection**, **Policies**, **Auto-labeling policies**. Select **Create auto-labeling policy** to start.

## Step 2: Run the simulation first

Learn says you cannot automatically label documents and emails, or remove labels, until the policy has run at least one simulation. Simulation can take up to 12 hours. Review the matches, then turn the policy on. A policy then keeps running until you delete it.

Two timing notes from the same page help you avoid false alarms:

- Activity from Exchange can take 60 to 90 minutes to show up in Activity explorer.
- The labeling progress view updates every 48 hours, and Content explorer counts can take up to seven days.

If you check too early, a working policy looks broken.

## Step 3: Check scope, file types and limits

Learn lists these boundaries for service-side policies:

- For SharePoint and OneDrive, PDF files and Office files in .docx, .pptx and .xlsx formats are supported. PDF labeling must be enabled at tenant level, or PDFs are skipped.
- A tenant can have at most 100 auto-labeling policies.
- Throughput is capped at 500,000 labeled SharePoint and OneDrive files per tenant per day, across all policies. Learn adds that this is a ceiling, not a rate you should expect.
- In the portal, a policy can name up to 1,000 sites, or up to 100 OneDrive users or groups.

The 2025 thread also listed the file types, the policy count and the scope as checks. Those match Learn.

## Step 4: Look for existing labels

By default, auto-labeling does not replace a label that someone applied manually. It also replaces an automatic label only if the new label has a higher priority. Label priority follows the order in the label list: the label placed last has the highest priority.

You can change part of this:

- On the **Additional label settings** page of a service-side policy, you can allow the policy to override a manually applied label of lower priority. Learn marks this as off by default.
- For Exchange, the **Emails only** option lets the policy override an existing label if the policy label has a higher priority.

In the 2026 thread about the 1,000 "Confidential" documents, a community member and a Microsoft representative gave the same outcome. If the old label came from auto-labeling or a default, a higher-priority label wins when the content still matches. If a person applied it, it stays. The replies did not describe a confirmed test, and the asker did not report back.

## Step 5: Treat email and attachments separately

Learn says that service-side policies scan PDF and Office attachments for the conditions. If there is a match, the email is labeled, not the attachment. If the label applies encryption, unencrypted Office attachments are encrypted using Message Encryption, with the settings of the email.

The January 2026 thread fits this. A reply there said that labels on an email are not passed on to attachments. The same reply said a plain text file is only inspected when the Information Protection client is on the endpoint. I could not find the text-file point on the Learn page. Treat it as reported in a community thread, not confirmed in Learn. The Learn page also does not list text files as supported for SharePoint and OneDrive. The poster in that thread never confirmed a fix.

Learn's comparison table also says the client-side setting does not check Exchange attachments for conditions. So client-side recommendations in Outlook are not a good test for attachment behavior.

## Step 6: Expect no visual markings

Learn states plainly that if a label uses visual markings, auto-labeling does not apply them to documents. A second Learn page on [sensitivity labels in Office apps](https://learn.microsoft.com/en-us/purview/sensitivity-labels-office-apps) adds that labels applied outside Office apps, including auto-labeling for SharePoint and OneDrive, apply encryption but not content markings, and that opening the file in Office later does not add them. A user can remove or replace the label in an Office app and apply it again to get the markings.

In the March 2026 thread, the one reply was marked as the solution. It said the document must be opened for markings to be embedded, and suggested Power Automate Desktop on a synced copy, or a third-party RPA tool. That is a community workaround. The thread does not show the poster confirming it, and Microsoft did not document it. If visible classification is a legal requirement, plan for another way, for example labeling in the Office apps.

## Step 7: Bulk labeling when a policy is not possible

A January 2025 thread described a tenant where auto-labeling policies were not available and the PowerShell cmdlet for them was not recognized. The poster believed a regional dependency was the cause, and I did not verify this. A reply suggested scripted labeling, and the poster confirmed it worked, using `Set-FileLabel` because the older `Set-AIPFileLabel` had been deprecated. Treat the deprecation as the poster's statement.

The [Learn page for Set-FileLabel](https://learn.microsoft.com/en-us/powershell/module/purviewinformationprotection/set-filelabel) documents it as a cmdlet of the Information Protection client. It takes a file path and a label ID, and you must use the ID of a sublabel, not the parent. If policy rules require a justification to lower or remove a label, add `-JustificationMessage`, or the file is skipped. Use `-WhatIf` first. The page lists no prerequisites, so read the linked client admin guide before you start. The page was last updated in July 2025.

## Step 8: Check licensing

The 2025 thread ended with a licensing answer. A community MVP said that Microsoft 365 E5 Security does not include auto-labeling and listed qualifying plans. That reply was not the one marked as the solution, and the poster did not confirm it.

Learn lists these SKUs for both client-side and service-side auto-labeling: Microsoft 365 E5, Microsoft 365 E5 Compliance, Microsoft 365 E5 Information Protection & Governance, and Azure Information Protection Premium P2. It also says E3 and Business Premium do not include auto-labeling of files and emails. Check your own plan against the current Learn table.

## What this checklist cannot tell you

- A solid cause for a specific unlabeled file. Use Activity explorer and the simulation results for that.
- Whether Microsoft plans server-side visual markings. The 2026 thread did not answer this.
- Whether a policy count or throughput limit applies to you. Compare with your own numbers.

## Related

- [Sensitivity labels](https://www.m365.fm/entity/sensitivity-labels/)
- [Auto-labeling](https://www.m365.fm/entity/auto-labeling/)
- [Microsoft Purview](https://www.m365.fm/entity/purview/)

## Sources

- [Microsoft Learn: Automatically apply a sensitivity label](https://learn.microsoft.com/en-us/purview/apply-sensitivity-label-automatically)
- [Microsoft Learn: Sensitivity labels in Office apps](https://learn.microsoft.com/en-us/purview/sensitivity-labels-office-apps)
- [Microsoft Learn: Set-FileLabel](https://learn.microsoft.com/en-us/powershell/module/purviewinformationprotection/set-filelabel)
- [Microsoft Community Hub: Auto-Apply Sensitivity Label (July 2025)](https://techcommunity.microsoft.com/discussions/azurepurview/auto-apply-sensitivity-label/4436653)
- [Microsoft Community Hub: Purview client side labeling issue (January 2026)](https://techcommunity.microsoft.com/discussions/azurepurview/microsoft-purview-client-side-labeling-issue/4484208)
- [Microsoft Community Hub: Automatic sensitivity label on existing labeled documents and emails (February 2026)](https://techcommunity.microsoft.com/discussions/azurepurview/automatic-sensitivity-label-on-existing-labeled-documents-and-emails/4496114)
- [Microsoft Community Hub: Auto-labelling does not support content marking (March 2026)](https://techcommunity.microsoft.com/discussions/azurepurview/auto-labelling-does-not-support-content-marking/4498304)
- [Microsoft Q&A: Auto labeling alternative when auto label policy not available (January 2025)](https://learn.microsoft.com/en-us/answers/questions/2149847/auto-labeling-alternative-when-auto-label-policy-n)
