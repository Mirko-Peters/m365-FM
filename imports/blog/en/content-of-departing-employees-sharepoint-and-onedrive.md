---
title: "Content of departing employees: SharePoint and OneDrive"
summary: "When someone leaves, their files do not all sit in one place. This article explains what happens to OneDrive and SharePoint content, how long deleted data is kept, and how to hand over files safely."
status: review
publish: false
author: mirko-p
date: 2026-12-23
topics: [user-offboarding, onedrive, retention-labels]
faq:
  - q: "How long can I recover a deleted user's OneDrive files?"
    a: "According to Microsoft Learn, the default retention for a deleted user's OneDrive is 30 days. After that, the OneDrive moves to the site collection recycle bin, where it is kept for 93 days. The retention time can be increased. Check the current Microsoft Learn pages before you rely on these values."
  - q: "Do I need to move a leaving employee's SharePoint files?"
    a: "No. SharePoint files stay with the sites they are stored in, so they are not tied to the person's account. Only the personal OneDrive needs to be handled. It is still worth checking who owns the sites the person managed, so that every site keeps an active owner."
  - q: "Does deleting a user account stop the license cost?"
    a: "No. According to Microsoft Learn, deleting the account does not stop the license cost, because licenses are reduced separately. Review your license assignments after offboarding. Also note that accounts with e-mail forwarding or a converted shared mailbox should not be deleted."
---

When an employee leaves, the account is only the visible part. Behind it sit personal files, shared documents, sites they owned and mailboxes that other people still use. If the account is deleted too early or without a plan, content can become hard to reach or disappear after the retention period.

This article explains how [user offboarding](https://www.m365.fm/entity/user-offboarding/) works for files in Microsoft 365. It focuses on the difference between a personal [OneDrive](https://www.m365.fm/entity/onedrive/) and SharePoint sites, and on what to decide before you remove anything. Details can change, so verify the current behaviour on Microsoft Learn.

## Two places, two different problems

Files of a departing employee usually live in two locations.

**OneDrive** is the person's personal work storage. It belongs to that user, so it is directly affected when the account is removed. Microsoft documents it on the [OneDrive documentation](https://learn.microsoft.com/onedrive/) pages.

**SharePoint sites** hold team content. According to Microsoft Learn, SharePoint files do not need to be moved when someone leaves, because they stay with the sites. The content does not depend on the person's account.

Imagine a project manager who keeps drafts in OneDrive and final documents in a team site. When she leaves, the team site content is still there. The drafts are the part that needs a decision.

What does need attention on the SharePoint side is ownership. If the person was the only owner of a site, the site may have no one who can manage permissions. Checking site ownership is a sensible part of an offboarding routine, even though no files have to be moved.

## What happens to OneDrive when you remove a user

The order of your steps matters. Microsoft Learn describes two situations.

**License removed, account kept.** An admin can access the user's OneDrive files directly. This can give you time to review the content.

**Account deleted.** The account can be restored for 30 days. After that, the data is permanently deleted. For OneDrive, the default retention for deleted users is also 30 days. After that, the OneDrive moves to the site collection recycle bin, where it is kept for 93 days. While it sits there, content that was shared from that OneDrive is not accessible to other people. The retention time can be increased.

Two consequences follow:

- According to Microsoft Learn, content shared from a deleted user's OneDrive is not accessible to other people while the OneDrive sits in the site collection recycle bin. If other people depend on those files, move them first.
- The retention window is a safety net, not a plan. Treat it as a way back if something was missed.

Check the pages on [deleting a user](https://learn.microsoft.com/en-us/microsoft-365/admin/add-users/delete-a-user) and on [handling a former employee's OneDrive](https://learn.microsoft.com/en-us/microsoft-365/admin/add-users/remove-former-employee-step-5) for the current values, because they can be adjusted.

## Handing over the files

Microsoft Learn describes two ways to give another person access to a former employee's files:

1. **Add the person as site collection administrator** of the former employee's OneDrive. The manager can then open the content. Changing site collection administrators changes access, so see the test note below.
2. **Create a link to the files and download or move them** to another location.

There is a limit to know about: when documents with version history are moved or copied this way, only the latest version is moved. If the version history matters for a document, for example for a contract draft, clarify this before the move.

Two further points from the documentation:

- Files that were synced to the person's computer stay there. An admin cannot wipe them through this process. Handle returned devices as part of your normal device process.
- Do not delete accounts with e-mail forwarding or a converted shared mailbox. Microsoft Learn advises against deleting such accounts.

**Test first.** Moving files, changing site collection administrators and deleting accounts change access and can lose data. Try your process with a test account or pilot user in a test tenant first, and make sure you have a backup or a way back before you apply it to real accounts. Do not start a deletion before the handover is confirmed by the manager, and make sure a restore option or backup exists.

## Where retention labels fit in

[Retention labels](https://www.m365.fm/entity/retention-labels/) are Microsoft Purview labels applied to individual items such as documents or e-mails. They define when retention starts, how long the item is kept and what happens at the end of the period.

Retention labels are applied to individual items and define their retention settings. They are designed to help with content that must be kept for a defined time. How this plays out when an author leaves depends on your configuration.

Be careful with assumptions, though. How retention settings interact with deleted accounts and OneDrive retention depends on how your policies and labels are configured. Do not assume that a label automatically protects everything in a departing user's OneDrive. Read the Microsoft Purview documentation on Microsoft Learn and test the behaviour with a pilot account before you rely on it.

A useful split of responsibilities:

- **Retention labels and policies** answer: how long must this content be kept?
- **Offboarding steps** answer: who takes over this content now?

Both questions need an owner. Neither replaces the other.

## A simple offboarding flow

Here is a hypothetical sequence you can adapt. It is not an official Microsoft procedure.

1. **Plan before the last day.** Agree with HR and the line manager on who takes over which content.
2. **Review OneDrive.** Ask the person to hand over relevant files. Decide what the manager needs.
3. **Check ownership.** List the sites, teams and groups the person owns and assign new owners.
4. **Check mail dependencies.** Look for forwarding rules and shared mailbox needs before any deletion.
5. **Block sign-in and reduce licenses carefully.** Remember that the license cost continues until you reduce licenses separately.
6. **Give the manager access** to the OneDrive and let them copy what is needed.
7. **Delete the account last,** and note the date. From then on, the restore and retention periods apply.
8. **Document what you did,** so the next offboarding is faster.

Run this flow against a test account first, and keep a way back for every step that changes access or removes data.

## Practical takeaways

- Treat OneDrive and SharePoint separately: SharePoint files stay with the sites, OneDrive needs a handover.
- Do not rely on retention windows as your plan. A deleted account can be restored for 30 days by default, and OneDrive retention for deleted users is 30 days by default, followed by 93 days in the site collection recycle bin. Verify current values on Microsoft Learn.
- Moving files from OneDrive keeps only the latest version of each document.
- Deleting an account does not stop license costs. Reduce licenses separately.
- Do not delete accounts with e-mail forwarding or a converted shared mailbox, as Microsoft Learn advises.
- Check site ownership so no site is left without an owner.
- Use retention labels for content that must be kept for a defined time, and test how they behave in your tenant.
- Test your process on a pilot account and keep a backup or recovery path before running it for real.
