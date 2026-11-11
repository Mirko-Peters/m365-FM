---
title: "Offboarding a user in SharePoint: find access, hand over, remove"
summary: "When someone leaves, their access doesn't disappear with the account. A practical walk through finding what a former employee could reach in SharePoint and OneDrive, handing it over safely, and removing the account."
status: review
publish: false
author: mirko-p
date: 2026-12-17
topics: [user-offboarding, sharepoint-permissions, sharepoint-essentials-toolkit]
faq:
  - q: "How long can a deleted Microsoft 365 user account be restored?"
    a: "According to Microsoft Learn, a deleted user account can be restored for 30 days by default. After that period the data is permanently deleted. Check the current Microsoft Learn page on deleting a user before you plan your offboarding timeline, because retention settings can differ in your tenant."
  - q: "What happens to a leaving employee's OneDrive files?"
    a: "Microsoft Learn describes a default retention of 30 days for the OneDrive of a deleted user. After that, it moves to the site collection recycle bin for 93 days. During that time, content shared from that OneDrive is not accessible to others. The retention time can be increased."
  - q: "Do I need to move SharePoint site files when someone leaves?"
    a: "No. Microsoft Learn states that SharePoint files do not need to be moved, because they stay with the sites. What you should review is the person's permissions and sharing links, plus any sites where they were the only owner."
---

When an employee leaves, the account is only part of the job. The files they owned, the sites they managed and the links they created all continue to exist after they are gone.

Good [user offboarding](https://www.m365.fm/entity/user-offboarding/) in Microsoft 365 therefore follows a simple order: find what the person could access, hand over what the organization needs, and only then remove the account. This article walks through that order with a focus on SharePoint and OneDrive.

## Know what offboarding covers

Offboarding means handling a user's data and access when they leave. In Microsoft 365, Microsoft Learn describes several points that shape how you plan it:

- If only the license is removed and the account is not deleted, an admin can get access to the user's OneDrive files directly.
- If the account is deleted, it can be restored for 30 days. After that, the data is permanently deleted.
- Deleting the account does not stop the license cost. Licenses are reduced separately.
- Accounts with e-mail forwarding or a converted shared mailbox should not be deleted.

The last point matters in practice. Imagine a sales employee whose mailbox is forwarded to a colleague for a few months. Deleting the account too early would break that arrangement. Check the current Microsoft Learn pages on removing a former employee and on deleting a user before you finalize your own process.

## Understand where access comes from

Before you can find a person's access, it helps to know how access is granted. [SharePoint permissions](https://www.m365.fm/entity/sharepoint-permissions/) work on several levels, as described on Microsoft Learn:

- **Team sites** are by default connected to a Microsoft 365 group. Group owners become site owners, group members become site members.
- **Communication sites** are not connected to a group and use the SharePoint groups Owners, Members and Visitors.
- **Private and shared channel sites** have their permissions managed in Teams.
- **Sharing links** give access to single files or folders. The three link types are Anyone, People in your organization and Specific people.

On a team site, the three groups map to the permission levels Full Control (Owners), Edit (Members) and Read (Visitors). A Microsoft 365 group has no view-only access, so people who should only read must be added directly to the Visitors group.

This matters for offboarding because access can sit in several places at once. Imagine a person who is a member of a team (and therefore of its site), a Visitor on a communication site, and the creator of a dozen sharing links to documents on other sites. Removing the account removes the person from those memberships. Sharing links and any direct permissions are the part that deserves a closer look, especially if the person created links for external recipients. How existing links behave after an account is deleted depends on your tenant, so check Microsoft Learn and verify in a test.

## Find access before you remove it

Start with a list. For each leaving person, you want to answer three questions:

1. Which sites do they own, and are they the only owner?
2. Where do they have direct permissions on folders or files, outside of group membership?
3. Which sharing links did they create, and who can still use them?

Natively, you can review site membership in the SharePoint admin center and in the Microsoft 365 admin center, and you can check the sharing settings of individual sites and files. Check Microsoft Learn for the current options. This is manageable for a handful of sites, but can take time when a person was active across many sites.

Reporting tools are designed to help here. The [SharePoint Essentials Toolkit](https://www.m365.fm/entity/sharepoint-essentials-toolkit/) from [Cognillo](https://www.m365.fm/entity/cognillo/) is one option. According to the vendor's product page, it offers permission reports for sites, folders and items, a view of everything one person can access, and the ability to replace one user with another. It also lists reports on sharing links and content open to everyone. These are vendor statements and were not tested by M365.FM. Cognillo sponsors M365.FM. Other tools and scripts exist as well, so compare what fits your tenant, your budget and your admin skills.

Whichever route you take, record what you find. A simple list of sites, permissions and links per leaver makes the next step easier and gives you something to check against later.

## Hand over what the organization needs

Once you know what exists, decide who takes over. Microsoft Learn describes how this works for OneDrive:

- An admin can add another person as site collection administrator of the former employee's OneDrive, or create a link to the files and download or move them.
- When documents with version history are moved or copied this way, only the latest version is moved. If version history matters for some files, plan for that before you move anything.
- SharePoint files do not need to be moved, because they stay with the sites.
- Files that were synced to the person's computer stay there. An admin cannot wipe them.

Timing is important. By default, the OneDrive of a deleted user is kept for 30 days. After that, it moves to the site collection recycle bin, where it is kept for 93 days. While it sits there, content shared from that OneDrive is not accessible to other people. The retention time can be increased. Confirm the current values in your tenant and on Microsoft Learn.

For SharePoint, the handover is about ownership and access rather than moving files. Imagine a project site where the leaving person was the only owner. Before the account is removed, add a new owner. Then check the permissions that were set directly for that person and replace them where the access is still needed.

**Important:** Changing permissions, replacing users, moving files and any bulk action can cause lost access or lost data if done wrongly. Test your steps first on a pilot site or in a test tenant, and make sure you have a way back, for example a documented list of the previous permissions and a backup of the content you move. This applies equally to native tools, scripts and third-party tools.

## Remove the account in the right order

When access is reviewed and content is handed over, you can remove the account. A sensible order looks like this:

1. Confirm that the OneDrive content you need has been copied, moved or shared with a new owner.
2. Confirm that new owners are set on sites where the person was the only owner.
3. Check for mail forwarding or a converted shared mailbox, and do not delete accounts that depend on them.
4. Remove the license or delete the account, depending on your process. Removing only the license keeps the account and gives admins direct access to the OneDrive files. Deleting the account starts the 30-day restore window.
5. Reduce the licenses you pay for, since deleting the account does not do that.
6. Re-check sharing links and permissions after a few days, so that anything that surfaced late is caught while the account can still be restored within the 30-day window. Restoring is itself a change that should be tested first and documented.

If something goes wrong in the first 30 days, a deleted account can be restored, according to Microsoft Learn. That window is a safety net, not a plan. Do not rely on it to cover a rushed handover.

## Practical takeaways

- Work in order: find access, hand over, then remove the account.
- Remember that SharePoint access comes from several places: group membership, SharePoint groups, direct permissions and sharing links.
- Do not delete accounts that have e-mail forwarding or a converted shared mailbox.
- Plan around the retention periods: 30 days to restore a deleted account, and the OneDrive retention described on Microsoft Learn. Verify the values for your tenant.
- Remember that moving or copying OneDrive documents keeps only the latest version, and that files synced to a computer stay there.
- Deleting an account does not reduce license cost. Adjust licenses separately.
- Test permission changes and bulk actions on a pilot site first, and keep a record of the previous state.
- For many sites, consider reporting tools or scripts, and compare options against your needs. Native Microsoft features come first. Third-party tools such as the SharePoint Essentials Toolkit are one option among others.
- Keep a short written offboarding checklist and assign an owner for the SharePoint part, not only for the account.

For the official steps and current values, see the Microsoft Learn pages on [removing a former employee](https://learn.microsoft.com/en-us/microsoft-365/admin/add-users/remove-former-employee-step-5) and [deleting a user](https://learn.microsoft.com/en-us/microsoft-365/admin/add-users/delete-a-user), as well as the documentation on [SharePoint sharing and permissions](https://learn.microsoft.com/en-us/sharepoint/modern-experience-sharing-permissions).
