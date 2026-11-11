---
title: "How Copilot treats sensitivity-labelled files in SharePoint"
summary: "Copilot sensitivity labels in SharePoint add rules on top of permissions. See how EXTRACT and VIEW, encryption and inheritance change what Copilot returns."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [sensitivity-labels, copilot, purview, sharepoint]
keypoints:
  - "Labels add a second layer to permissions: when a label encrypts a file, a user needs the EXTRACT usage right as well as VIEW for Copilot to return its content."
  - "With VIEW but no EXTRACT, Copilot does not summarize the content, but it can reference the item with a link."
  - "Microsoft recommends enabling sensitivity labels for SharePoint and OneDrive, otherwise encrypted files that Copilot can reach are limited to files in use in Office apps on Windows."
  - "Copilot Chat shows the highest priority label from the data it used, and new content in Word, PowerPoint and Outlook inherits the source label."
  - "Some items are outside the rules: container labels are not inherited by items, and Double Key Encryption content is not returned."
faq:
  - q: "Does Copilot respect sensitivity labels?"
    a: "Yes, in defined ways. Microsoft states that data is never returned to a user, or used by the model, if the user lacks access. When a label applies encryption, the user also needs the EXTRACT usage right as well as VIEW. Copilot Chat shows the highest priority label from the data it used."
  - q: "Can Copilot read encrypted files in SharePoint?"
    a: "It depends on the setup. Microsoft recommends enabling sensitivity labels for SharePoint and OneDrive. Without that, encrypted files that Copilot and agents can reach are limited to data in use from Office apps on Windows. For files you have not opened, the user also needs EXTRACT in certain cases, such as user-defined permissions."
  - q: "How do I stop Copilot from summarizing a labeled file?"
    a: "Two routes exist. Use a label that encrypts without granting EXTRACT, so users can view the file but Copilot does not summarize it. Or create a Microsoft Purview DLP policy for the Copilot location that restricts processing of files with chosen labels. In both cases, Copilot may still reference the item with a link."
---

Copilot treats a labeled file in two steps. First it checks whether the person asking has access, as it does for every file. Then the label adds its own rules: if the label encrypts the file, the person needs the EXTRACT usage right as well as VIEW, and Copilot shows and passes on the label in its answers. This article is for compliance officers who must tell the business what labels do and do not stop. You will see the rules Microsoft documents, the gaps, and a worked example with invented numbers.

## What rules do labels add on top of permissions?

Microsoft's page on [Purview protections for Microsoft 365 Copilot](https://learn.microsoft.com/purview/ai-m365-copilot) states the baseline. AI apps use existing controls so that data in your tenant is never returned to a user, or used by the language model, if that user does not have access to it. That is the same rule as for permissions in [SharePoint](https://www.m365.fm/entity/sharepoint/): [Copilot](https://www.m365.fm/entity/copilot/) does not widen access.

[Sensitivity labels](https://www.m365.fm/entity/sensitivity-labels/) then add a second layer. The page lists three effects:

- **Display.** When a file is open in Word, Excel or PowerPoint, or an email is open in Outlook, the label name and content markings such as header or footer text are shown. Loop components and pages support the same labels.
- **Encryption.** When a label applies encryption, users need the EXTRACT usage right as well as VIEW for the AI apps to return the data.
- **Data in use.** Protection extends to data stored outside your tenant, for example on local storage or network shares, when it is open in an Office app.

So the question for a compliance officer is not only "who can open the file?" but also "which usage rights does the label grant?" A file that a user may view can still be kept out of a Copilot summary if the label withholds EXTRACT.

## What are EXTRACT and VIEW in practice?

Microsoft's [considerations page](https://learn.microsoft.com/en-us/purview/ai-m365-copilot-considerations) explains the practical side. If a user has VIEW without EXTRACT, then while the content is open in an app, they cannot use Copilot on it. Copilot will not summarize the content, but it can reference it with a link.

EXTRACT is also called Copy. In the Purview portal it appears as "Copy and extract content (EXTRACT)". In Office on Windows, a user can check My Permission and the Copy value. The permission levels that include EXTRACT are Editor, which is the default in the portal, and Owner. With the older Read and Change dialog, Read does not allow copying, while Change does, and an option to allow users with read access to copy content adds EXTRACT to Read.

Use this to design labels on purpose. A label for highly confidential files that grants VIEW but withholds EXTRACT keeps those files out of Copilot summaries. A label for internal files that grants Editor rights lets Copilot work with them for people who are allowed to edit. Write down for each label which of the two you intend.

## Which SharePoint files can Copilot reach when labels encrypt?

This is where many surprises start. Microsoft recommends enabling sensitivity labels for SharePoint and OneDrive. If you do not, the encrypted files that Copilot and agents can access are limited to data in use from Office apps on Windows. The first step in your plan is therefore to check that labels are enabled for those services.

The considerations page adds details for files that nobody has opened:

- A labeled and encrypted file in SharePoint or OneDrive with user-defined permissions is not accessible unless the label is a default label that extends SharePoint permissions to downloaded documents, or the file is referenced by typing "/". In both cases the user needs EXTRACT.
- Files that are open in an app are always accessible, as data in use.
- For SharePoint IRM library settings, usage rights apply on download, not on creation or upload. To stop summarization of files at rest, the page says to use labels that encrypt without EXTRACT.
- Container labels, which apply to Teams, SharePoint sites, Microsoft 365 groups, Loop workspaces and Viva Engage, are not inherited by items. A channel chat from a team labeled Confidential does not show that label in Copilot Chat.

The last point matters for sites. A site label controls the site, not the files in it. If you rely on a Confidential site label to protect the files, check that the files carry their own labels.

## What does Copilot show and pass on?

Copilot Chat displays the sensitivity label for items listed in its responses and citations. The latest response, and threaded summaries in Copilot in Teams chat and channels, show the highest priority label from the data used. Priority is the number set in the Purview portal, and a higher number usually means more sensitive content with more restrictive permissions.

New content also inherits labels. In Copilot in Word, PowerPoint and Outlook, content created from a labeled source gets the source label and its protection settings. The page gives examples such as drafting with Copilot from a referenced file in Word and creating a presentation from a file in PowerPoint. With several source files, the label with the highest priority is inherited. Users can override or remove an inherited label, unless mandatory labeling is in use.

The page lists conditions under which inheritance fails. It fails if the destination is read-only, if it is already encrypted and the user lacks EXPORT or FULL CONTROL, or if the inherited label is not published to the user. It is unsupported when encryption uses user-defined permissions or is applied independently of the label.

For a compliance officer, this gives two checks. Make sure your labels are published to the people who use Copilot. And keep mandatory labeling on where the business cannot accept an unlabeled result.

## Copilot sensitivity labels in SharePoint: which gaps remain?

Microsoft's pages state several limits. Plan for them and tell the business.

1. **Double Key Encryption.** Copilot and agents cannot access Double Key Encryption content, so it is not returned.
2. **Other encryption.** S/MIME protected emails are not returned by Copilot. Password-protected documents cannot be accessed by AI apps unless the user has already opened them in the same app. Items encrypted with Microsoft Purview Customer Key or your own root key are supported.
3. **Meeting labels.** Labels on Teams meetings and chats are not recognized, while labels on meeting invites and calendar events are.
4. **External sources.** Labels and encryption from external plugins and Graph connectors are not recognized. Admins can turn off plugins or disconnect Graph connections.
5. **Channel agent in Teams.** It honors EXTRACT only for the requesting user, so it may summarize content that some channel members cannot open. DLP cannot prevent it from summarizing labeled files.
6. **Edge and Windows Copilot.** Unless DLP is used in Edge, Copilot can reference encrypted content in the active tab when the user lacks EXTRACT.

The considerations page was last updated in 2026 and says nothing about when these gaps will close. Check it again before each review.

DLP is the second tool. A [Microsoft Purview](https://www.m365.fm/entity/purview/) DLP policy for the Microsoft 365 Copilot and Copilot Chat location can restrict processing of prompts with sensitive information types and of files and emails with specific labels. Copilot can still reference the item with a link. This is the same logic as the VIEW without EXTRACT case.

## Example: four labels and a test with six users

The numbers are invented to show the method. A company uses four labels: Public, Internal, Confidential and Highly Confidential. Confidential encrypts and grants Editor rights to the finance team, which includes EXTRACT. Highly Confidential encrypts with VIEW for a named group and no EXTRACT.

The compliance officer tests before the Copilot pilot:

1. **Setup.** Sensitivity labels are enabled for SharePoint and OneDrive. 5,000 files in a finance library carry Confidential, and 300 files in a board library carry Highly Confidential.
2. **Test.** Six test users, two from each of three groups, ask Copilot to summarize ten files from each library.
3. **Result.** For Confidential, the two finance users get summaries and the four others get none, because they lack access. For Highly Confidential, the named group can open the files but gets no summaries, only links, because the label has no EXTRACT.
4. **Gap found.** The board library sits on a site that carries a Highly Confidential site label, but 40 of the 300 files have no label of their own. The container label does not pass to them.

The actions: label the 40 files, turn on an auto-labeling policy for the board library, and add a DLP policy for the Copilot location as a second line. The officer repeats the test with the same six users and gets the expected results for all 300 files.

## Common mistakes

- **Assuming labels replace permissions.** Access still comes first. Labels add rules.
- **Relying on a site label.** Container labels are not inherited by items.
- **Forgetting to enable labels for SharePoint and OneDrive.** Without it, encrypted files are limited to data in use.
- **Not deciding about EXTRACT.** Define for each label whether Copilot may summarize its files.
- **Unpublished labels.** Inheritance fails if the label is not published to the user.
- **Testing once.** Pages change, so repeat the test before each rollout step.

## How software can help

Start with the Purview portal and the DLP policy settings. When you need to see which files in many libraries have no label, or which sites hold labeled files with broad access, a script or a reporting tool can export both views side by side. Compare any tool with Purview's own results on a few libraries, and check where it stores the data it reads.

## Next step

Pick one library with confidential files and one with public files. Ask two test users to summarize ten files from each with Copilot, and write down for each label whether the result matches the policy you intended. Then fix the labels, not the test.
