---
title: "Copilot in Excel Python Analysis Failures: Troubleshooting Guide"
summary: "What to check when Copilot in Excel fails on advanced analysis with Python: data format, file state, calculation mode, Python in Excel errors such as #CALC! and #BUSY!, the 100 MB limit and unsupported platforms."
status: review
publish: false
author: mirko-p
date: 2026-12-07
topics: [copilot, excel, python-in-excel]
keypoints:
  - "Copilot's Python analysis works with single tables or table-like ranges. Microsoft says unstructured data is not supported."
  - "Copilot does not modify the workbook in Python analysis. Results may be static tables or images, and a refreshable Python cell is a separate step."
  - "Edit features need Calculation Options set to Automatic. A checked-out file in SharePoint or a Strict Open XML file triggers Unsupported file state."
  - "Python in Excel errors have set meanings: #BUSY! over 60 seconds, #CALC! for volatile cells or more than 100 MB, #TIMEOUT!, #BLOCKED! and #CONNECT!."
  - "Python in Excel needs internet access and is not supported on iPad, iPhone, Android or device-based and shared computer activation subscriptions."
faq:
  - q: "What data does Copilot's Python analysis accept?"
    a: "Microsoft Support says it works with single tables or table-like ranges, or multiple such ranges in the workbook, and that unstructured data is not supported. Copilot does not modify the workbook in this mode, and static tables or images it returns are not refreshable."
  - q: "What does the Unsupported file state error mean?"
    a: "The Copilot in Excel FAQ lists a checked-out file in SharePoint, a SharePoint check-out requirement on Windows or Mac, and Strict Open XML Spreadsheet files as causes. Check the file back in, use Excel for the web, or save as an Excel Workbook (.xlsx)."
  - q: "What is the limit for Python calculations?"
    a: "The Python in Excel troubleshooting article says calculations can process up to 100 MB of data at a time. Exceeding it, or referencing cells with volatile values such as RAND, causes a #CALC! error. Using a smaller dataset is the fix."
  - q: "What do #BUSY! and #CONNECT! mean?"
    a: "Per Microsoft Support, #BUSY! means calculations are still running in the Microsoft Cloud, and if it lasts longer than 60 seconds the runtime should be reset. #CONNECT! means the connection to the cloud failed, and resetting the Python runtime is the fix."
  - q: "Do the Microsoft pages explain data modeling failures in Copilot?"
    a: "Not directly. The pages read describe Copilot's analysis, edit modes and Python errors, but contain no dedicated data modeling troubleshooting. The page on formatting data for Copilot in Excel also had no table-format rules in the version read."
---

When Copilot in Excel fails on a Python-based analysis, three layers can be responsible: the data and file state that Copilot reads, the Copilot mode and settings, and the Python in Excel runtime that executes the code. Microsoft documents each layer in a separate place. This guide combines them and points out gaps. Two source pages were retired or empty on the points asked, which is noted below.

## How Copilot uses Python

Microsoft Support says Copilot uses Python-based analysis to interpret a question, find relevant data in the workbook and compute the answer. You can expand the answer to see the Python code, which includes comments. You can also ask Copilot to summarize the code to check its logic.

Key facts:

- It works with single tables or table-like ranges, or several in the workbook. Unstructured data is not supported.
- In this mode, Copilot does not modify the workbook. It may return static tables or images that can be inserted but are not refreshable.
- **Advanced analysis mode** opens a new sheet and runs Python for deeper analysis. You can modify and insert the underlying code as a refreshable Python cell. To leave, select **Stop advanced analysis**.

The support page does not describe error handling for failed analysis. It only gives general tips such as asking a specific question and refining with follow-ups.

## Step 1: Check the file and the workbook state

The Copilot in Excel FAQ lists the **Unsupported file state** error with causes:

- The file is checked out in SharePoint. Check it back in, then close and reopen it in Excel, or use Excel for the web.
- Your organization requires check-out. Copilot in Excel on Windows or Mac does not work with those files, while Excel for the web does.
- The file is in the Strict Open XML Spreadsheet format. Save it as an Excel Workbook (.xlsx).

The FAQ also states that editing works only when **Calculation Options** are set to **Automatic**.

## Step 2: Check the data layout

Make the data table-like, because unstructured data is not supported. Microsoft Support's page on formatting data for Copilot in Excel was read, but the version available had no table or range rules. The advice to use headers and avoid scattered blocks or free-form text areas is general Excel practice, not a quote from that page. One tip it does give is to name the columns or ranges that Copilot should work with.

Language matters too. The FAQ says Copilot was trained mainly on English sources and may perform worse with other languages in prompts or data.

## Step 3: Check platform, mode and licensing

- Edit, chat and plan modes work on Windows, Mac and the web. iPad has chat and plan, iPhone and Android chat only.
- The Copilot button needs a suitable license, app version, network and privacy settings. If it is missing, check those first.
- The FAQ states that Copilot can make mistakes and that results should be reviewed.

## Step 4: Decode Python in Excel errors

If Copilot inserts a Python cell, the Python in Excel runtime applies. Microsoft's troubleshooting article lists:

| Error | Meaning and fix |
|---|---|
| #PYTHON! | Likely a syntax error. The diagnostics task pane opens, so read it |
| #BUSY! | Still calculating in the Microsoft Cloud. If it lasts longer than 60 seconds, reset the runtime (Formulas > Python > **Reset runtime**, or Ctrl+Alt+Shift+F9) |
| #CONNECT! | Connection to the cloud failed. Reset the runtime |
| #BLOCKED! | Python in Excel must be enabled, with access to Microsoft 365 connected services. Device-based subscriptions and shared computer activation are not supported |
| #CALC! | References to volatile cells such as RAND, or a calculation over 100 MB. Use a smaller dataset |
| #SPILL! | A cell in the output range already has data |
| #TIMEOUT! | Maximum execution time exceeded. Run again, reset the runtime, or change **Python Formula Timeout** under File > Options > Advanced > When calculating this workbook |
| #UNKNOWN! | The Excel version likely does not support Python in Excel |

## Step 5: Know the platform limits of Python in Excel

- Calculations run on Microsoft Cloud servers, so internet access is required.
- Calculations process up to 100 MB of data at a time.
- Excel for iPad, iPhone and Android are not supported. Workbooks with Python can be viewed there, but Python cells show an error when recalculated.
- Users with a qualifying subscription get limited premium compute each month, after which compute transitions to standard compute.
- A Python in Excel add-on license can take 24 to 72 hours to update across multiple computers. Use **File** > **Account** > **Update License** to refresh it.
- Python code runs in a secure container, with no access to your computer or network and no access to workbook formulas, charts or PivotTables, as the data security page states. That page still describes a preview and is dated, so check current availability.

## A short decision path

1. Error before any code is shown: check file state, calculation mode and platform.
2. Copilot answers but gives odd numbers: check the table layout and ask Copilot to explain its code.
3. Error in a Python cell: use the error table above.
4. Slow or busy: reduce data below 100 MB and reset the runtime.

## What the pages do not cover

No page read describes data modeling failures, such as relationships or Data Model measures, in the context of Copilot's Python analysis. The retired Support article on Copilot in Excel with Python gave no content. If your failure involves the Excel Data Model, test the same question on a small, flat table first to separate the data model from the Python path.

## Related

- [Python in Excel](https://www.m365.fm/entity/python-in-excel/)
- [Microsoft 365 Copilot](https://www.m365.fm/entity/copilot/)
- [Microsoft Excel](https://www.m365.fm/entity/excel/)

## Sources

- [Get direct answers to your data analysis questions (Microsoft Support)](https://support.microsoft.com/en-us/excel/get-direct-answers-to-your-data-analysis-questions)
- [Frequently asked questions about Copilot in Excel (Microsoft Support)](https://support.microsoft.com/office/7a13758f-d61e-4a56-8440-f2c9a07802ec)
- [Get started with Copilot in Excel (Microsoft Support)](https://support.microsoft.com/en-us/excel/welcome-to-copilot-in-excel)
- [Troubleshoot Python in Excel errors (Microsoft Support)](https://support.microsoft.com/en-us/excel/python/troubleshoot-python-in-excel-errors)
- [Introduction to Python in Excel (Microsoft Support)](https://support.microsoft.com/en-US/Excel/python/introduction-to-python-in-excel)
- [Data security and Python in Excel (Microsoft Support)](https://support.microsoft.com/en-gb/office/data-security-and-python-in-excel-33cc88a4-4a87-485e-9ff9-f35958278327)
