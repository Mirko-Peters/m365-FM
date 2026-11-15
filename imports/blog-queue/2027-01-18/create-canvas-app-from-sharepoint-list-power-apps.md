---
title: "How to Create a Canvas App From a SharePoint List in Power Apps"
summary: "You can build a canvas app from a SharePoint list in two ways: start from Power Apps with Start with data, or open the list and choose Integrate, Power Apps, Create an app. Learn the steps, what the generated app looks like and what the prerequisites are."
status: review
publish: false
author: mirko-p
date: 2027-01-18
topics: [power-apps, canvas-app, microsoft-lists, sharepoint]
keypoints:
  - "Two routes exist: from Power Apps at make.powerapps.com with Start with data and SharePoint, or from the list itself with Integrate, Power Apps and Create an app."
  - "From Power Apps you enter the site URL, connect, pick the list and select Create app."
  - "The generated layout depends on the template in your environment: a responsive single screen, or an updated template with grid and list views plus separate create and edit screens."
  - "Prerequisites per Learn are subscriptions to Microsoft 365 and Power Platform; on-premises lists connect through a data gateway."
  - "Learn's sample is a device orders list with columns such as Employee name, Device type, Request date, Reason for the order, Approved or denied, and Status."
faq:
  - q: "How many ways are there to create the app?"
    a: "Two, according to Learn. You can start from Power Apps and connect to the SharePoint list, or you can start in the list and use the Integrate menu to create an app."
  - q: "What does the generated app look like?"
    a: "Learn says the layout depends on the template available in your environment. The responsive single-screen template combines browsing and record editing on one screen. The updated modern-controls template has a records screen with grid and list views plus separate screens for creating and editing records."
  - q: "What do I need before I start?"
    a: "Learn lists subscriptions to Microsoft 365 and Power Platform. If the list is on-premises, you connect through a data gateway."
  - q: "Where in the list do I start the app?"
    a: "In SharePoint or Microsoft Lists, open the list, select Integrate, then Power Apps, then Create an app."
  - q: "Do I need to save and publish?"
    a: "Learn's steps end with previewing the app, then saving and publishing it. It says that information you add or edit in the app also updates in SharePoint or Lists."
---

You can create a canvas app from a SharePoint list in two ways. From Power Apps, go to make.powerapps.com, select **Start with data** and **SharePoint**, enter the site URL, pick the list and select **Create app**. From the list itself, open it, select **Integrate**, then **Power Apps**, then **Create an app**. Both produce a generated app that you can preview, save and publish. This article follows Microsoft Learn's page on creating a canvas app with data from a list.

## Before you start

Learn lists these prerequisites:

- Subscriptions to Microsoft 365 and Power Platform.
- For a list on-premises, a data gateway for the connection.

Learn's example uses a list of device orders, with the columns Employee name, Device type, Request date, Reason for the order, Approved or denied, and Status. You can follow along with a list of your own with a similar shape.

## Route 1: start from Power Apps

1. Go to make.powerapps.com and sign in.
2. Choose **Start with data**, then **SharePoint**.
3. Enter the URL of the SharePoint site, then select **Connect**. If the site appears in the recent list, you can pick it there.
4. Select the list you want.
5. Select **Create app**.

Power Apps generates the app from the list. Learn says to preview it, then save and publish.

## Route 2: start from the list

1. In SharePoint or Microsoft Lists, open the list.
2. Select **Integrate**.
3. Choose **Power Apps**.
4. Select **Create an app**.

This route begins where your data already is, so there is no URL to type. Learn's page also notes that SharePoint list views redirect to Microsoft Lists, which is why the page uses both names.

## What gets generated

Learn says Power Apps Studio opens with a generated app connected to your list, and that the layout depends on the template available in your environment. It describes two:

- The **responsive single-screen template** combines browsing and record editing on one screen.
- The **updated modern-controls template** provides a responsive records screen with grid and list views, plus separate screens for creating and editing records. It uses responsive containers, a modern data grid and modern forms, and Learn says it is not the same as a customized list form hosted inside SharePoint.

For the updated template, Learn adds these details. The grid view shows the edit action when exactly one row is selected. The template generates filter tabs from the connected data; grid view filters a generated collection, while list view filters the connected data source, so check the same filter in both views. Generated counts and collection-backed results do not guarantee that every record in a large list is loaded, so review delegation limits. The new-record form uses one column below an app width of 768 and two columns at 768 or greater, and its save action calls `SubmitForm`. When you customize the screens, Learn says to preserve the generated DataSource, Item, navigation formulas and the form's success and failure actions unless you mean to replace them, and to use the control names in your own app rather than names from an older tutorial.

## Preview, save and publish

Select the **Preview the app** icon to see how the app works. Learn then says to save and publish the app, and notes that information you add or edit in the app also updates in SharePoint or Lists.

For the updated template, Learn gives this check before you share the app: preview grid and list views at narrow and wide widths, apply a filter and check both views show the expected records, create and edit a test record and confirm the values in the source list, and test required fields and a failed save. It adds that a notification alone is not proof that a data operation succeeded.

## Choosing a route

This section is my advice, not a Microsoft statement.

1. **Use the list route when you are a list owner.** It saves a step and keeps you in the context of the data.
2. **Use the Power Apps route when you work across several sites.** You can start from the maker portal and connect to whichever site you need.
3. **Clean up the list before you generate the app.** Rename unclear columns and remove ones you do not need before you generate the app, because the app is built on the list's data.
4. **Treat the generated app as a first draft.** It gives you a working layout, but you will likely adjust labels, order and rules to match the process.
5. **Check permissions on the list.** Users of the app need access to the data in the list. The page does not describe list permissions for app users, so test with a second account.
6. **Mind the connection if your list is on-premises.** Learn says to use a data gateway, so involve the person who manages it.

## A test routine before you share

This section is my advice, not a Microsoft statement.

- Create a test item in the app and confirm it appears in the list.
- Edit the item in the app and confirm the change in the list.
- Check the layout at narrow and wide widths, as Learn's check list for the updated template suggests.
- Remove a field from the list in a copy of the environment, if you can, to see how the app reacts, before you do it in production.
- Write down which list the app is bound to, so that the next maker knows where the data lives.

## What the page does not cover

Learn's page is a tutorial for the generation step. It does not explain in depth how to customize the app, how to manage licensing for premium connectors, or how delegation limits work; it links to separate pages on delegation limits and on SharePoint data types and delegable operations. If your list has many items or complex column types, use those pages.

## Reading the two routes side by side

This section is my advice, not a Microsoft statement. The two routes end in the same place, a generated app bound to your list, so the choice is about workflow. If you are already in the list, adding a quick app is a natural next step. If you build many apps, the maker portal gives you one starting point for all of them, with the recent sites list saving typing. Whichever route you use, record which one you took and which list the app uses, so a colleague can recreate the app if it has to be rebuilt.

## Related

- [Power Apps](https://www.m365.fm/entity/power-apps/)
- [Canvas app](https://www.m365.fm/entity/canvas-app/)
- [Microsoft Lists](https://www.m365.fm/entity/microsoft-lists/)
- [SharePoint](https://www.m365.fm/entity/sharepoint/)

## Sources

- [Create a canvas app with data from a list - Power Apps (Microsoft Learn)](https://learn.microsoft.com/power-apps/maker/canvas-apps/app-from-sharepoint)
