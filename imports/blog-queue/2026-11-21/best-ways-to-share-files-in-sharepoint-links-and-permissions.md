---
title: "Best Ways to Share Files in SharePoint: Links, Permissions and External Sharing"
summary: "How to share a SharePoint file or folder: specific people versus copied links, what Can edit, Can view and Can't download do, which link type to pick, and the admin settings that decide whether external sharing works."
status: review
publish: false
author: mirko-p
date: 2026-11-21
topics: [sharepoint, sharepoint-sharing-links, guest-access]
keypoints:
  - "Select the item, then Share. Use Specific people to email invitations and track who you invited, or Copy link to share with many people."
  - "Link types are Anyone, People in your organization, People with existing access and Specific people. Specific people links are nontransferable and need the recipient to sign in."
  - "Permissions on a link are Can edit, Can review (Word only), Can view and Can't download. Expiration and password are available only on Anyone links."
  - "Sharing several items at once is not supported. Put the files in a folder and share the folder."
  - "Site sharing settings can match or be stricter than the organization setting. The most restrictive value applies."
faq:
  - q: "What is the best way to share a file in SharePoint?"
    a: "According to Microsoft Support, use Specific people when you want to send an email invitation and track who you invited, and use Copy link to share with many people, including people you do not know. For sensitive content, a link limited to specific people is the more controlled choice because those recipients must sign in as the named user."
  - q: "What is the difference between Anyone and People in your organization links?"
    a: "Microsoft Learn says an Anyone link works for anyone who has it, with no authentication, and access cannot be audited. A People in your organization link works only for members of your Microsoft 365 directory and guests cannot use it. Both are transferable and revocable."
  - q: "How do I stop sharing a file in SharePoint?"
    a: "Microsoft Support says that if an item is already shared, a Shared with list appears at the bottom of the share dialog. Select a profile photo or the group initials to open Manage Access and change someone's access level. The support article refers to a separate article for the full steps to stop sharing."
  - q: "Why can't I create an Anyone link?"
    a: "Microsoft Support says administrators can grey out the Anyone option. Microsoft Learn explains that the Anyone setting must be allowed at the organization level, that a site can only be the same or more restrictive, and that the most restrictive value applies when the two differ."
  - q: "Can I share several files at once in SharePoint?"
    a: "No. Microsoft Support says sharing multiple items at once is not supported. Put the items in a folder and share the folder instead."
---

To share a file in SharePoint, select it, choose **Share**, and then pick between emailing named people and copying a link. Which one is best depends on who the audience is and how sensitive the file is. This guide walks through both methods, explains the link types and permissions, and covers the admin settings that decide what is possible. Details come from Microsoft Support and Microsoft Learn.

## Share a file or folder step by step

1. In the library, select the item's circle icon. It is on the left in List view and in the top-right corner in Tiles view.
2. Select **Share** at the top of the page.
3. Choose a method.

Microsoft says sharing multiple items at once is not supported. Put the items in a folder and share the folder.

### Specific people

Use this to send email invitations and keep track of who you invited.

1. Enter names, groups or email addresses in **Name, group or email**.
2. Select the pencil icon to set **Can edit**, **Can view** or **Can't download**. For Word documents, **Can review** allows comments and suggestions without edits.
3. Add a message if you like and select **Send**.

### Copy link

Use this to share with many people, including people you do not know.

1. Select the settings gear next to **Copy link**.
2. Choose who can use the link.
3. Under **More settings**, pick the permission and any restrictions.
4. Select **Apply**, then **Copy link** and paste it where you need it.

## The four link types

| Link | Who can use it | Notes from Microsoft |
|---|---|---|
| Anyone | Anyone who has the link, inside or outside the organization | No sign-in, access cannot be audited, transferable. Microsoft Support says to avoid it unless absolutely necessary. |
| People in your organization | Members of your directory only | Guests cannot use it. Transferable and revocable. |
| People with existing access | Only people who already have access | Listed on the Microsoft Support share page. The Learn link-types article does not cover it. |
| Specific people | Only the people you name, internal or external | Nontransferable and revocable. Recipients must authenticate as the named user. |

Two details from Microsoft Learn help in practice. Creating an Anyone or People in your organization link does not make the content searchable or available to Copilot for everyone, because the link must be redeemed first. A Specific people link does make the item searchable for those people. Also, sending a People in your organization link from SharePoint, Outlook or Teams chat redeems it automatically for individual recipients, up to 100, but not for group recipients or Teams channel posts.

## Permissions and restrictions on a link

- **Can edit** is on by default.
- **Can review** appears for Word documents only.
- **Can view** lets recipients open the item without changing it. With an Anyone link, no sign-in is required and access cannot be audited.
- **Can't download** blocks downloads. Microsoft Support does not call it Block download.
- **Set expiration date** and **Set password** are available only for Anyone links. After the expiration date, the link stops working and you must create a new one.

Microsoft Learn separately says administrators can enable an expiration policy for People in your organization links. Newly created links then get an expiry date. An expired link does not delete the file, and anyone with access through other permissions can still open it.

## Choosing the right method

- **A few named colleagues:** Specific people. You get invitations and a clear list.
- **A wide internal audience:** People in your organization with Can view.
- **A one-off external recipient:** Specific people, because the recipient must sign in as the named user.
- **A public handout:** Anyone with Can view, an expiration date and a password, if your admin allows it.
- **Someone already has access but needs the address:** People with existing access.

Microsoft also advises storing confidential information in a site with external sharing turned off and creating separate sites for external collaboration.

## What the admin settings decide

At the organization level, Microsoft Learn lists four external sharing options in the SharePoint admin center under **Policies** > **Sharing**:

- **Anyone**
- **New and existing guests**
- **Existing guests**
- **Only people in your organization**, which turns external sharing off

To allow external sharing on any site, it must be allowed at the organization level. Each site can then be restricted. If the site and organization settings differ, the most restrictive value applies. OneDrive settings can match or be stricter than SharePoint's. External sharing is on by default for the entire SharePoint and OneDrive environment, and Microsoft says you might want to turn it off globally before people start using sites or until you know exactly how you want to use the feature.

To change the default link type for one site, go to **Active sites** in the SharePoint admin center, select the site, choose **Sharing**, clear **Same as organization-level setting** under **Default sharing link type**, pick the option and select **Save**. Teams private and shared channel sites need the Set-SPOSite PowerShell cmdlet.

## Mistakes to avoid

- Using Anyone links for convenience when Specific people would do.
- Sharing one file at a time from a busy library instead of sharing a folder.
- Forgetting that guests added to a shared folder can see each other's names in the Manage Access panel.
- Removing the group's permission to a group-connected site. Microsoft says all group members need access to the site, and without it many collaboration tasks such as sharing files in Teams chats will not work.
- Relying on old invitations. Microsoft says that since June 2024 legacy SharePoint Invitation Manager invitations no longer grant access, so users must reshare.

## Related

- [SharePoint](https://www.m365.fm/entity/sharepoint/)
- [SharePoint sharing links](https://www.m365.fm/entity/sharepoint-sharing-links/)
- [Guest access](https://www.m365.fm/entity/guest-access/)
- [SharePoint permissions](https://www.m365.fm/entity/sharepoint-permissions/)

## Sources

- [Microsoft Support: Share SharePoint files or folders](https://support.microsoft.com/office/share-sharepoint-files-or-folders-1fe37332-0f9a-4719-970e-d2578da4941c)
- [Microsoft Learn: Securing shareable links in SharePoint and OneDrive](https://learn.microsoft.com/en-us/sharepoint/shareable-links-anyone-specific-people-organization)
- [Microsoft Learn: Overview of external sharing in SharePoint and OneDrive](https://learn.microsoft.com/en-us/sharepoint/external-sharing-overview)
- [Microsoft Learn: Turn external sharing on or off](https://learn.microsoft.com/en-us/sharepoint/turn-external-sharing-on-or-off)
- [Microsoft Learn: Change the default sharing link type for a site](https://learn.microsoft.com/en-us/sharepoint/change-default-sharing-link)
