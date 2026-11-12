---
title: "How to Share Your Outlook Calendar: Permissions, Edit and Delegate"
summary: "How to share Outlook calendar access in new Outlook, on the web, on Mac and mobile: pick the right permission, share outside your organization and stop sharing."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [outlook, exchange-online, outlook-web]
keypoints:
  - "In new Outlook, select Calendar, then Share calendar on the Home tab, enter a name, pick a permission from the drop-down and select Share."
  - "The levels are Can view when I'm busy, Can view titles and locations, Can view all details, Can edit and Delegate."
  - "You can't give Edit or Delegate access to people outside your organization. External sharing is limited to the view-only options."
  - "Sharing inside one Microsoft 365 tenant syncs instantly; sharing with another tenant syncs about every three hours, and Gmail may take 24 to 48 hours."
  - "To stop sharing, open the sharing settings and select Remove next to the person, or use Unpublish for a published calendar."
faq:
  - q: "What permission should I give when I share my Outlook calendar?"
    a: "Give the least that does the job. Can view when I'm busy shows only free and busy times. Titles and locations adds what the meeting is called and where. All details shows everything except private items. Edit lets someone change your calendar, and Delegate adds the right to schedule and respond to meetings for you."
  - q: "Can I share my Outlook calendar with someone outside my company?"
    a: "Yes, with limits. Your admin has to allow external sharing in the Microsoft 365 admin center. Outside people can get only the view-only options, not Edit or Delegate. Someone without a Microsoft 365 or Outlook.com account can get an HTML or ICS link if you publish the calendar, and those links are read-only."
  - q: "How do I stop sharing my Outlook calendar?"
    a: "In new Outlook, select Calendar, then Share calendar on the Home tab, and select Remove next to the person. Inside your organization, the calendar disappears from their list. Outside it, their copy stays but stops updating. For a published calendar, go to the shared calendars settings and select Unpublish."
---
To share your Outlook calendar, select Calendar, choose Share calendar on the Home tab, type the person's name or email address, pick a permission from the drop-down and select Share. They get an email invitation, and once they accept, your calendar shows up in their list. In Outlook on the web it's the Share button on the calendar toolbar, and on a phone it's the gear icon next to the calendar. This article is for [Outlook](https://www.m365.fm/entity/outlook/) users who want to share a schedule with a colleague, an assistant or someone outside the company, and it explains which permission to pick so you don't give away more than you meant to.

## The five permission levels

Before you click Share, decide how much the other person should see. Microsoft's article on [calendar sharing in Microsoft 365](https://support.microsoft.com/en-us/outlook/calendar-sharing-in-microsoft-365) lists the simplified levels in current Outlook clients.

- **Can view when I'm busy.** Free and busy times only. No titles, no locations.
- **Can view titles and locations.** Busy times plus the title and location of each item.
- **Can view all details.** Everything on the calendar. The person can see it but can't change it.
- **Can edit.** The person can change your calendar.
- **Delegate.** Edit rights plus the right to schedule and respond to meetings on your behalf.

There's also a **Custom** level for intermediate roles such as Author, Contributor or Publishing Editor. Per Microsoft, only an admin can set those, using the `Add-MailboxFolderPermission` or `Set-MailboxFolderPermission` cmdlets in Exchange Online PowerShell.

Items you mark **Private** show only their time to most people. The exception is a delegate you allow to see private events.

My rule of thumb: start with Can view titles and locations for colleagues and with Can view when I'm busy for anyone outside your team. Move up only when someone asks and has a reason.

## How to share your calendar in new Outlook for Windows

These steps are from Microsoft's page on [sharing a calendar as view-only](https://support.microsoft.com/en-us/outlook/sharing/share-an-outlook-calendar-as-view-only-with-others).

1. In the navigation pane, select **Calendar**.
2. On the **Home** tab, select **Share calendar**. If you have more than one calendar, choose which one.
3. In the **Enter an email address or contact name** box, type the recipient. Pick the name from the list or press Enter.
4. Open the drop-down next to the name and choose an access level.
5. Select **Share**. To cancel before sharing, select **Remove**.

The recipient gets an email invitation. After they accept, they can add your calendar to their own view. If you don't see the steps on your screen, you may be on classic Outlook, where the menus differ.

Shared and delegate calendars aren't visible by default on the receiving side. The recipient selects **Show all** in the calendar list, finds the calendar under **People's calendars** and selects it. The ribbon's **Split view** shows several calendars side by side.

Microsoft also notes that adding someone else's calendar directly (Calendar, Add calendar, Add from directory) works only with work or school accounts. People on personal accounts need an invitation.

## Outlook on the web

Microsoft's page on [sharing your calendar in Outlook on the web](https://support.microsoft.com/en-us/outlook/share-your-calendar-in-outlook-on-the-web) gives these steps.

1. Select the **Calendar** icon.
2. On the toolbar, select **Share** and choose the calendar. You can only share calendars you own.
3. Enter the person's name or email address.
4. Choose a permission level.
5. Select **Share**.

To change or stop sharing, right-click the calendar under **Calendars**, select **Sharing and permissions**, and pick a new level or the remove icon. If your screen doesn't match, you may be on classic Outlook on the web, where menus differ and Delegate is available only for your primary calendar.

## Outlook for Mac

In Calendar view, find your calendar in the left navigation, hover over the account name, click the ellipsis (...) or right-click, and choose **Sharing Permissions**. In the Calendar Properties window, click the plus (+) button, type the person's name or email address, choose a level in the Permissions drop-down (for example Can view when I'm busy, Can view all details or Can edit), click **Add** and then **Done**. This is from Microsoft's article on delegation and shared calendars in Outlook for Mac, which says a Microsoft Exchange Server account is required. To stop sharing, select the person and click the minus (-) button.

## Outlook for iOS and Android

Microsoft's mobile page says you can share your own calendar from the app:

1. Open the **Calendar** tab.
2. Open the menu in the upper-left corner.
3. Tap the gear icon next to the calendar you want to share.
4. Tap **Add people** and choose who to share with.
5. Tap a person to change their permissions or remove their access.
6. Confirm your changes.

To open a calendar someone shared with you, tap the same gear, then **Add a shared calendar**, enter the person's name and tap the plus sign by it. One of Microsoft's pages is labeled for Outlook for iOS, so the steps may differ a little on Android.

## Classic Outlook for Windows

Classic Outlook has a **Share Calendar** command on the **Home** tab of the Calendar view. Microsoft's pages that I opened show the classic steps on a separate tab that I couldn't load, so check the Classic Outlook tab on the pages linked above if your ribbon looks different. The permission names are the same as in the list above, and the older labels map as Free/Busy, Free/Busy with subject and location, Reviewer and Editor.

## What the other person has to do

Sharing is a two-sided job, and many "it doesn't work" reports come from the receiving side. The person gets an email invitation and has to accept it. In new Outlook, a shared or delegate calendar isn't visible by default. They select **Show all** in the calendar list, find the calendar under **People's calendars** and select it. They can also use **Add calendar**, then **Add from directory** and choose you, but Microsoft says that direct route works only with work or school accounts. Users with personal accounts have to wait for your invitation.

On a phone, the person taps the calendar menu in the upper left, taps the gear, then **Add a shared calendar**, enters your name and taps the plus sign by it. To see your free or busy status in a color of their choice, they tap the gear icon next to your name. They only see what you allowed, so a viewer with Can view when I'm busy sees blocks of time and nothing else.

## Share or publish?

The two words sound the same, but they work differently.

- **Share** sends an invitation to a named person. You choose their permission, you can change it later and you can remove them. Inside your organization it syncs instantly.
- **Publish** creates a link. Anyone with the link can see the calendar at the detail level you chose, and the link comes in two forms: HTML for viewing in a browser and ICS for subscribing from another calendar program. Both are read-only, and how often an ICS calendar refreshes depends on the recipient's email provider.

If the person has a Microsoft 365 or Outlook.com account, share. If they use Gmail, Apple Calendar or anything else and just need to see your times, publishing is the practical way, and you accept that you can't tell who opens the link. Choose the lowest level of detail and unpublish when the project ends.

## Edit or Delegate: which one?

This is where people give too much.

**Edit** means the person can view and change your calendar. Editors can be assigned to your main calendar or to calendars you created. **Delegate** means the same as edit plus the right to schedule and respond to meetings on your behalf, and delegates can only be assigned to your main calendar.

Microsoft's page on [edit and delegate permissions](https://support.microsoft.com/en-us/outlook/sharing/share-and-access-a-calendar-with-edit-or-delegate-permissions-in-outlook) describes the steps in new Outlook:

1. In the navigation pane, select **Calendar**. On the **Home** tab, select **Share Calendar**.
2. On the **Sharing and permissions** page, enter the person's name or email. You can add only one person at a time.
3. Open the drop-down next to the name and select **Can edit** or **Delegate**.
4. For a delegate, you can optionally check **Let delegate view private events** and **Let delegate manage categories**.
5. Select **Share**.
6. Under **Delegates**, next to **Send invitations and responses to**, choose one option: **Delegate only**, **Delegate and send me a copy**, or **Both my delegate and me**. Repeat this for each delegate.

Requirements: delegate access needs a work or school account in Microsoft 365 or Exchange Online. And Microsoft recommends one delegate per calendar, because multiple delegates on one calendar aren't a goal of the design.

An executive's assistant is the textbook delegate case. A colleague who only needs your free and busy times doesn't need Edit, never mind Delegate.

## Sharing outside your organization

You can share with people outside your company, but with fewer options.

- **Permission limits.** Microsoft says you can't give editor or delegate access to people outside your organization. Outside access is limited to the view-only options.
- **Admin switch.** In the Microsoft 365 admin center, under Settings, Org Settings, Services, Calendar, an admin controls whether users can share with people outside the organization who have Office 365 or Exchange, and whether anyone can access calendars with an email invitation. For anonymous access, the admin picks how much shows: free/busy with time only, time with subject and location, or all appointment information. The details are in Microsoft's admin article on [sharing calendars with external users](https://learn.microsoft.com/en-us/microsoft-365/admin/manage/share-calendars-with-external-users?view=o365-worldwide).
- **Gmail and other providers.** On the web, people outside Outlook, such as Gmail users, can accept invitations only with a Microsoft 365 or Outlook.com account. Otherwise you can publish the calendar and send them an HTML link (view in a browser) or an ICS link (subscribe). Both are read-only.
- **Publishing.** In the web app go to Settings, Shared calendars, and under Publish a calendar choose the calendar and the level of detail, then select Publish. To undo it, select Unpublish in the same place. In new Outlook for Windows the path is View, Calendar settings, Calendar, Shared calendars.

Treat a published link like a key that might get forwarded. You can't know who has it, so publish a separate calendar with only the details you want out in the open.

### How fast does sharing sync?

According to Microsoft's sharing article, sharing between Microsoft 365 users in the same tenant is instant. Sharing with another Microsoft 365 tenant is periodic, about every three hours. Microsoft 365 to Outlook.com is an ICS subscription, about every three hours. Sharing to a third party such as Gmail is an ICS subscription too, and Gmail may update every 24 to 48 hours. If a person says your new appointment is missing, this is the first thing to check. Microsoft 365 groups aren't supported for calendar sharing yet, but individual users and security groups are.

## Stopping a share

In new Outlook, select **Calendar**, then **Share Calendar** on the Home tab. Pick the right calendar, and select **Remove** next to the person. You can't remove permissions from calendars owned by others. Inside your organization, the calendar is removed from their list, unless your default "My Organization" group still has access, in which case they keep it at that default level. Outside your organization, their copy stays but stops syncing and receiving updates. A published calendar goes away when you select Unpublish.

## Fixing sharing problems

1. **The invitation never arrived.** Ask the person to check junk and other folders, then remove them and share again.
2. **Wrong detail level.** Open Sharing and permissions and change the level. Remember that private items show only their time.
3. **Missing events or slow updates.** Check the sync table above. Cross-tenant and Gmail updates are delayed by design.
4. **Mac Calendar app.** Instant sync isn't supported for EWS-based clients, including the Mac OS X Calendar app, according to Microsoft.
5. **External sharing is blocked.** Ask your admin. Sharing may be restricted by your organization's settings.
6. **Shared calendar hidden.** Select Show all in the calendar list and look under People's calendars.

## Common mistakes

- **Giving Edit when View is enough.** Anyone with Edit can move or delete your meetings.
- **Sharing your main calendar with clients.** Use a separate calendar for outside parties.
- **Forgetting private items.** Mark sensitive entries Private before you share. Most people then only see the time.
- **Expecting instant updates everywhere.** Cross-tenant and ICS links update on a delay.
- **Adding several delegates.** Microsoft recommends one.
- **Not reviewing shares.** People change jobs. Look at the list every few months and remove anyone who no longer needs it.

## Related topics to explore

- **Delegate setup for assistants.** The delegate options, including who gets meeting responses, deserve their own walkthrough.
- **External sharing controls.** Admins in [Exchange Online](https://www.m365.fm/entity/exchange-online/) decide what outsiders can see.
- **Shared mailbox and resource calendars.** Microsoft says any shareable calendar is eligible, including shared mailbox and resource mailbox calendars.
- **Using the calendar on the web.** The [Outlook on the web](https://www.m365.fm/entity/outlook-web/) menus are the ones Microsoft's admin article points users to.

## Next step

Open your calendar's sharing settings today and read the list of people who can see it. Remove anyone who doesn't need access and lower any permission that is higher than the job requires. Then you know how to share your Outlook calendar with confidence, and what each person can actually do with it.
