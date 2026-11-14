---
title: "Microsoft Teams Tabs, Wiki and Apps: How to Add and Use Them"
summary: "What Teams tabs are, where they appear, how to add one when the plus icon is missing, and what happened to the Wiki tab. Microsoft's end-user pages could not be read, so this article flags where sources are thin."
status: review
publish: false
author: mirko-p
date: 2026-11-30
topics: [teams, teams-channels, teams-personal-tabs, onenote]
keypoints:
  - "A tab is a full-screen web experience inside Teams. Microsoft's developer documentation says tabs can be added in chats, channels and meetings."
  - "Some users no longer see the plus icon for adding tabs. A Microsoft Q&A answer says a Teams update moved it to a new icon at the top right of the channel, then App and Pin a Tab."
  - "Tab options in the menu include Settings (if offered), Rename and Remove on desktop."
  - "The Wiki tab was announced for retirement starting January 2024. Microsoft's replacement is a notes capability in channels based on a OneNote notebook."
  - "Exporting a wiki to OneNote has known limits, according to a community report: hyperlinks, private channel wikis and conversation context are not carried over."
faq:
  - q: "What is a tab in Microsoft Teams?"
    a: "Microsoft's developer documentation describes a tab as a large canvas for app content, a full-screen web experience in Teams. Tabs can be added in chats, channels and meetings."
  - q: "Where did the plus icon for adding a tab go?"
    a: "A Microsoft Q&A answer says a recent Teams update removed the plus tab icon and moved tab-adding to a new icon in the top-right area of the channel. Select App, then Pin a Tab."
  - q: "Is the Teams Wiki tab still available?"
    a: "A 2023 Microsoft Tech Community post titled Now in public preview: Future of wiki and Notes in Teams says wikis will be retired from Teams starting January 2024. Check your tenant, because this article could not confirm the current state in the client."
  - q: "What replaces the Wiki tab?"
    a: "The same Tech Community post says Microsoft is offering note-taking capabilities within Teams channels, using a OneNote notebook included with the channel."
  - q: "How do I rename or remove a tab?"
    a: "Microsoft's developer documentation lists Rename and Remove in the tab menu on desktop, and Delete on mobile. Settings appears when the app offers it."
---

A tab in Teams is a full-screen view of an app or web content shown at the top of a channel, chat or meeting. You add one from the add-a-tab option in the channel. In some recent Teams versions the plus icon moved, and the documented route is the new icon at the top right of the channel, then **App** and **Pin a Tab**. The Wiki tab was retired in favor of a notes capability.

**A note on sources.** Microsoft's end-user support article for adding tabs could not be opened for this page. This article uses Microsoft's developer documentation, Microsoft Q&A answers and Tech Community posts. Menu labels may differ in your Teams version, so confirm them on screen.

## What tabs are

Microsoft's developer documentation on tab design describes tabs as a large canvas for app content. They appear in three places:

- **Chat**
- **Channel**
- **Meeting**, before, during or after the meeting

Users can also add a tab from the Microsoft Teams Store (AppSource).

When you add an app as a tab, a short setup dialog appears. According to the design page it contains the app logo and name, an area for app content such as settings or sign-in, an About link, a Close button, a Back button, a Save button and an option to notify team members. Setup can include single sign-on with Microsoft credentials.

## How to add a tab

The documented steps vary by Teams version.

1. Open the channel or chat.
2. Look for the add-a-tab control. In older layouts this was a plus icon next to the tab names.
3. If you cannot see the plus icon, use the replacement described in a Microsoft Q&A answer: open the channel, select the new icon at the top right of the channel, select **App**, then choose **Pin a Tab**.
4. Choose the app or content type, complete the setup dialog and select **Save**.

On mobile, the design page says to select the **More** button in the channel or chat where the app was added.

One older Q&A answer gives these steps for the Wiki tab from Microsoft Support: select the channel, select the **Add a tab** button next to the other tab names, select **Wiki** from the tab gallery, name the tab and start writing. As the next section explains, Wiki is no longer the recommended path.

### If the plus icon is missing

A Microsoft Q&A thread titled "I can't add any tabs to my Teams channels today. The '+' icon is missing" is marked as having 20 or more same-question reports. The answers describe it as a known issue from a Teams update. Fixes in the order given:

1. Signing out and back in did not help for at least one user.
2. Use the new top-right icon, then **App** and **Pin a Tab**.
3. Reset Teams. On Windows, right-click the Teams icon in the Start menu, choose **App Settings** and select **Reset**. For some users this makes the new icon appear.

The thread offers no Mac equivalent for the reset, and no official fix or timeline. Several users also asked where Microsoft announced the change and got no answer there.

## Using and managing tabs

The design page lists the tab menu actions:

- **Settings**, when the app offers it
- **Rename**
- **Remove** on desktop, **Delete** on mobile
- On mobile, also **Open in browser** and **Copy link**

Other behaviors:

- **Tab chat:** a conversation shown next to the tab content. It opens at the side on desktop.
- **Notifications:** after a tab is added, users can post to the channel or chat to notify team members.
- **Role-based views:** the tab experience can differ by user. Some people may need to sign in and may see different content.

## What happened to the Wiki tab

A Microsoft Tech Community post from March 28, 2023, titled "Now in public preview: Future of wiki and Notes in Teams", says wikis will be retired from Teams starting January 2024. It says Microsoft is offering note-taking capabilities within Teams channels, using a OneNote notebook included with the channel. The page that was read cuts off at that point, so the full wording is not available.

A separate community post, which is not an official Microsoft announcement, reports the following about moving wiki content:

- Wiki content can be exported to OneNote.
- Hyperlinks inside the wiki are not carried over, although external links worked in the author's test.
- Private channel wikis are not exported.
- Conversations shown beside wiki pages can be lost, and the exported wiki becomes read-only.
- Exporting combines a channel's wiki into one OneNote page per section, so structure and page breaks are lost.
- The author states that the original wiki pages remain on SharePoint, though the Wiki page and app are no longer accessible.

Treat those details as one author's experience. The official post read does not describe a migration procedure. If you still have wiki content, check your tenant first and keep a backup before you change anything.

## Choosing between tab types

Microsoft's pages read for this article do not rank tab types. As a practical way to decide:

1. **Documents or lists the team uses daily:** pin them as a tab in the channel so they are one click away.
2. **A web page or dashboard:** add it as an app or website tab.
3. **Notes the team edits together:** use the channel notes capability based on a OneNote notebook.
4. **Meeting content:** add apps as meeting tabs before the meeting.

## Common mistakes

- **Searching for the old plus icon.** In affected versions, use the top-right icon, then App and Pin a Tab.
- **Planning new content in the Wiki tab.** It is documented as retired from January 2024.
- **Assuming an export is lossless.** Community reports describe lost links, structure and private channel content.
- **Adding too many tabs.** The documentation does not give a limit, so keep the tab list short enough to scan.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Teams channels](https://www.m365.fm/entity/teams-channels/)
- [Teams personal tabs](https://www.m365.fm/entity/teams-personal-tabs/)
- [OneNote](https://www.m365.fm/entity/onenote/)

## Sources

- [Microsoft Learn: Design tabs for desktop, web and mobile](https://learn.microsoft.com/en-us/microsoftteams/platform/tabs/design/tabs)
- [Microsoft Q&A: I can't add any tabs to my Teams channels, the plus icon is missing](https://learn.microsoft.com/en-us/answers/questions/4437421/i-cant-add-any-tabs-to-my-teams-channels-today-the)
- [Microsoft Q&A: How can I get to the team wiki tab](https://learn.microsoft.com/en-us/answers/questions/4439976/how-can-i-get-to-the-team-wiki-tab)
- [Microsoft Tech Community: Future of wiki and Notes in Teams](https://techcommunity.microsoft.com/t5/microsoft-teams-public-preview/now-in-public-preview-future-of-wiki-and-notes-in-teams/m-p/3821525)
- [Microsoft Tech Community: Wiki page retiring in January 2024](https://techcommunity.microsoft.com/discussions/microsoftteams/microsoft-teams-news-wiki-page-retiring-in-january-2024--there-are-things-you-mu/3722900)
