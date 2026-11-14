---
title: "Turn an Excel Spreadsheet into a Power App with Copilot: Step by Step"
summary: "How to turn an Excel spreadsheet into a Power App with Copilot: upload the file with Start with data, fix column types, save and publish, plus the Excel Online option and its limits."
status: review
publish: false
author: mirko-p
date: 2026-12-03
topics: [power-apps, copilot-in-power-apps, dataverse]
keypoints:
  - "In the Power Apps maker portal, select Start with data, then Upload file, and Copilot builds a Dataverse table and a first app from your worksheet."
  - "The upload route needs an environment that includes Microsoft Dataverse. Without it, the option is not available."
  - "Review column names and data types before you save. Renaming a column later means updating every formula that uses it."
  - "The alternative, Excel Online (Business), keeps the workbook where it is. The data must be formatted as an Excel table and stored in the cloud."
  - "Copilot output varies from run to run, and Microsoft says Copilot may not be available in every region."
faq:
  - q: "How do I create a Power App from an Excel file?"
    a: "Sign in at make.powerapps.com and select Start with data. On the Create an app page, select Upload file, then Select from device, and import the workbook. Review the generated table, then select Save and open app. Microsoft Learn describes this path in its Copilot exercise and in the article on creating a canvas app from Excel data."
  - q: "Do I need Dataverse to turn Excel into a Power App?"
    a: "For the Upload file route, yes. The Microsoft Learn exercise states that the environment must include Microsoft Dataverse and that the option is not available without it. The alternative route, Excel Online (Business), connects to a workbook in cloud storage instead."
  - q: "Does my Excel data need to be a table?"
    a: "Yes for the connection route. Microsoft Learn says the data must be formatted as an Excel table, or Power Apps cannot read it correctly. The Excel connector also works only with files stored in the cloud, such as OneDrive for Business, OneDrive, Dropbox or Google Drive."
  - q: "How large can the Excel file be?"
    a: "Microsoft Learn lists a maximum upload size of 5 GB. Power Apps uploads the first 20 rows immediately so you can review the table, then uploads the rest in the background."
  - q: "Is there a newer way to build an app from a prompt?"
    a: "Microsoft Learn documents the Power Apps vibe experience at vibe.powerapps.com as a preview. It creates an app from a prompt and can attach work files, emails or chats. The page does not describe uploading an Excel file directly, so use the Start with data route for a worksheet."
---
To turn an Excel spreadsheet into a Power App, sign in to the Power Apps maker portal at make.powerapps.com, select **Start with data**, then **Upload file**, and import the workbook. Copilot reads the worksheet, proposes a table and builds a first app with a gallery and forms. You review the columns, save, test and publish. This article follows Microsoft's Learn exercise and the canvas-app article, and explains the second route, which connects to a workbook that stays in Excel.

## Choose the route first

Microsoft Learn describes three ways to build a canvas app from Excel data:

| Route | Where you start | What happens |
|---|---|---|
| Upload a file | **Start with data** > **Upload file** | Power Apps converts the data into a [Dataverse](https://www.m365.fm/entity/dataverse/) table you can reuse in other apps and flows |
| Connect to an external file | **Start with data** > **Excel Online (Business)** | The workbook stays in cloud storage, and the app reads it there |
| Blank app | **Create** > **Start from blank** | You add the data and build the screens yourself |

Learn presents the upload route as the one for cloud storage, improved security and a reusable table. The connection route is the fastest path when a cloud-hosted Excel table already exists. The blank route gives the most control.

## Before you start

- The upload route needs an environment that includes Microsoft Dataverse, and a Power Apps license or free trial that includes Dataverse. Learn states that without Dataverse the option is not available.
- For the connection route, the data must be formatted as an Excel table, and the file must be in cloud storage. Learn names Dropbox, Google Drive, OneDrive and OneDrive for Business. Power Apps cannot connect to Excel files stored only on a local drive.
- Check the header row. Excel column headers become Dataverse column names.
- Check that Copilot in Power Apps is available to you. Microsoft says it may not be available in every region, and that usage limits or capacity throttling can apply.

## Upload the file and build the app

1. Go to make.powerapps.com and sign in.
2. On the home page, select **Start with data**.
3. On the **Create an app** page, select **Upload file**.
4. Select **Select from device**, choose the workbook and select **Import**.
5. Wait for the preview table. Select the ellipsis (...) on the table, then **View data**.
6. If the headers do not match your Excel headers, turn on **Use first row as column headers**.
7. Review each column name and data type. Learn's sample file has three single-line text columns and three choice columns.
8. To fix a type, select the **Copilot** button in the toolbar and describe the change, for example: change the column types for Product Line, Product Type and Color to Choice. You can also select a column header and use **Edit column**.
9. Optionally select **Row ownership** and choose how it should be managed.
10. Select **Save and open app**, then confirm in the pop-up.

The app opens in Power Apps Studio. Skip the welcome pop-up if it appears, close the Copilot pane so the Save icon is visible, select **Save**, name the app if asked, and then select **Publish**.

## Test the app

Select the **Play** icon to enter preview mode. Learn's exercise suggests three checks:

- Search for part of a value to confirm that the gallery filters on text fields.
- Select a record, use the pencil (**Edit**) icon, change a note and save with the check icon.
- Use the form factor options at the top right to preview phone and tablet layouts.

## Connect to a workbook instead

1. Sign in to Power Apps and select **Start with data**.
2. Select **Excel Online (Business)**.
3. If several connections exist, select the ellipsis to switch or add one.
4. Enter the file location, select the table and select **Create app**.

Choose this route when the workbook should remain the source of truth. If people keep editing the file in Excel, the app reads the current table. If you need a managed, reusable table with security, the upload route fits better.

## Limits and known issues from Microsoft

- Maximum upload file size: 5 GB.
- Power Apps imports the first 20 rows right away and uploads the rest in the background.
- If you change a column type to one that does not match existing values, Power Apps removes those values during table generation.
- Known issue: the upload process ignores the environment's data format setting.
- Copilot output is nondeterministic, so your generated columns can differ from the exercise.
- Copilot guesses which fields the gallery shows. You may need to adjust the gallery columns.
- Saving creates persistent objects. **Save and open app** saves the Dataverse tables and relationships.

The pages I read do not cover delegation or row-count limits for Excel data. Check the Power Apps delegation documentation before you build an app on a large workbook.

## Mistakes to avoid

- **Renaming columns late.** Learn warns that each formula referencing a renamed column must be updated. Fix names and types before the first save.
- **Skipping the type review.** Fixed-value categories fit **Choice**, numbers used in calculations fit **Number** or **Currency**, and dates fit **Date only** or **Date and time**.
- **Marking too many columns Required.** Learn suggests avoiding it unless the table must enforce completeness.
- **Forgetting the table format.** For the Excel Online route, a plain range is not enough.
- **Trusting the first result.** Check the generated screens against how people will use the app.

## What about building from a prompt?

Microsoft Learn also documents the Power Apps vibe experience, which is in preview. You sign in at vibe.powerapps.com, enter a prompt and review a proposed plan. With **+ Add work content** you can attach work files, emails or chats, which requires a Copilot license. Encrypted or protected files are not supported, and Learn notes that large or complex content can reduce quality. The page does not describe uploading an Excel file as a starting point, and it lists limits such as one app per plan and no coauthoring. For a worksheet, the **Start with data** route is the documented path.

## Related

- [Power Apps](https://www.m365.fm/entity/power-apps/)
- [Copilot in Power Apps](https://www.m365.fm/entity/copilot-in-power-apps/)
- [Dataverse](https://www.m365.fm/entity/dataverse/)
- [Microsoft Excel](https://www.m365.fm/entity/excel/)

## Sources

- [Exercise: Create an app from Excel using Copilot (Microsoft Learn)](https://learn.microsoft.com/en-us/training/modules/get-started-with-powerapps/create-app-copilot)
- [Create a canvas app with data from an Excel file (Microsoft Learn)](https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/get-started-create-from-data)
- [Overview of Copilot in Power Apps (Microsoft Learn)](https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/ai-overview)
- [Create an app with a data plan in Power Apps vibe (Microsoft Learn)](https://learn.microsoft.com/en-us/power-apps/vibe/create-app-data-plan)
