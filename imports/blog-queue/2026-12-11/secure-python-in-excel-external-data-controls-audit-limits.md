---
title: "Python in Excel Security: Control External Data Ingestion and What You Can Audit"
summary: "How Python in Excel isolates code, why Power Query is the only way to bring in external data, which admin controls exist (PythonFunctionWarnings) and where Microsoft's pages say nothing about auditing."
status: review
publish: false
author: mirko-p
date: 2026-12-11
topics: [python-in-excel, excel, power-query, python]
keypoints:
  - "Python runs in a hypervisor-isolated container on the Microsoft Cloud with no network access, so code cannot fetch data by itself."
  - "Power Query is the only supported way to import external data for Python in Excel. Control ingestion by controlling Power Query sources."
  - "The PythonFunctionWarnings registry value sets 0 (no warning, default), 1 (security warning) or 2 (block, cells return #BLOCKED!)."
  - "In Protected View, Python formulas do not run. The same applies by default under Microsoft Defender Application Guard."
  - "The security page does not mention auditing or logging of Python execution, so do not promise an audit trail of it."
faq:
  - q: "Can Python code in Excel call the internet or an internal API?"
    a: "According to Microsoft Support, the Python code does not have network access, and it has no access to your computer, devices, account or a user token. External data enters only through a Power Query connection and is read in formulas with xl()."
  - q: "How is external data brought into a Python in Excel workbook?"
    a: "Microsoft Support says Power Query is the only way to import external data for Python in Excel. You load a query with Only Create Connection and reference it in a Python cell with xl('QueryName'). Importing external data this way is not available in Excel for the web."
  - q: "How can an admin block or warn about Python formulas?"
    a: "The data security page describes the PythonFunctionWarnings registry setting under HKCU\\software\\policies\\microsoft\\office\\16.0\\excel\\security. Value 0 shows no warnings and is the default, 1 shows a Security Warning when a workbook with Python formulas opens, and 2 blocks all Python functions, which return #BLOCKED!."
  - q: "Does Python in Excel store my data?"
    a: "Microsoft Support states that Python in Excel does not handle or store any data at rest, that data is not shared with third parties and that it is not used for Copilot AI training. Containers are created in advance and destroyed after use."
  - q: "Can I audit who ran Python formulas?"
    a: "The pages I read do not describe auditing or activity logging of Python execution. They also do not describe privacy levels or credential handling for the Power Query step. Check with Microsoft or test in your own tenant before you make audit claims."
---

Python in Excel is built so that code cannot reach out on its own. It runs in an isolated container with no network access, and external data arrives only through Power Query. That gives you two practical control points: what Power Query can connect to, and whether Python formulas may run at all. Microsoft's pages describe no audit trail for Python execution, so plan compensating controls.

## How Python in Excel is isolated

From Microsoft's data security page:

- Python runs in a secure container on the Microsoft Cloud. Each workbook gets its own dedicated, hypervisor-isolated container, running under a least-privileged account.
- Containers are created in advance and destroyed after use. They stay online while the workbook is open or until a timeout.
- The code has no network access, no access to your computer, devices or account, and no user token.
- Python cannot read other workbook properties such as formulas, charts, PivotTables, macros or VBA.
- Results come back through the `=PY()` function. Python cannot return macros, VBA or other formulas.
- Microsoft states that data is not persisted at rest, is not shared with third parties and is not used for Copilot AI training.
- Libraries come from a curated Anaconda distribution. Existing workbooks keep calculating against the environment version they were created on, and users are prompted to upgrade.

The page says the design assumes everything that runs in the container is malicious, and it restricts inputs and outputs strictly.

## Ingestion: the only door is Power Query

Formulas read cells with `xl()` using cell references. For data outside the workbook, Microsoft Support says **Power Query is the only way to import external data for use with Python in Excel**. This is not available in Excel for the web.

The documented steps:

1. On the **Data** tab, select **Get Data** and choose a source.
2. In the load dialog, pick **Load To...** and then **Only Create Connection**.
3. In a cell, enter `=PY` and then `xl("QueryName")`. The cell returns a DataFrame.

What this means for control: you do not need to inspect Python code to know which external systems feed it. Look at the queries and connections in the workbook (**Queries & Connections** pane) and at which sources your organization allows in Power Query. Because the container has no network, a Python formula cannot add a new source by itself.

Limits of the pages: the Power Query article does not cover privacy levels, data source credentials, size limits or refresh behavior, and it has no security section of its own.

## Admin controls for Python formulas

Windows admins can use the `PythonFunctionWarnings` registry value under `HKCU\software\policies\microsoft\office\16.0\excel\security`, set from an elevated command prompt:

| Value | Behavior |
|---|---|
| 0 | No security warnings. This is the default. |
| 1 | A Security Warning appears in the message bar when a workbook with Python formulas opens. |
| 2 | All Python functions are blocked and return `#BLOCKED!`. |

Other built-in protections:

- Python in Excel follows Excel's policies for internet and untrusted workbooks. In **Protected View**, Python formulas do not run.
- If a workbook opens in Microsoft Defender Application Guard, Python formulas do not run by default.
- Multinational tenants can configure container locations through the Office Configuration Service. Microsoft says containers for EU customers run in the EU.

## What you cannot audit from these pages

The security page does not mention auditing or activity logging of Python execution, and it does not mention Defender for Endpoint scanning of Python code. Do not write policies that assume a log of who ran which Python formula. Practical substitutes that rely on controls Microsoft does document:

- Restrict which workbooks can run Python by setting `PythonFunctionWarnings` to 1 or 2.
- Review the connections inside workbooks that feed Python, since Power Query is the only ingestion path.
- Keep sensitive source data out of workbooks that people share widely. Python reads whatever the query loads.

## A review checklist for a workbook

1. Open **Queries & Connections** and list every query. Each one is a possible entry point for outside data.
2. Check which queries are set to **Only Create Connection** and are referenced by `xl("QueryName")` in Python cells. These are the ones Python actually sees.
3. Decide whether the data in those queries may be processed in the Microsoft Cloud container. Microsoft says containers run within your organization's compliance boundary, and that EU customers' containers run in the EU. Your own data classification decides the rest.
4. Confirm the workbook is not expected to run in Excel for the web if it relies on external data, since that import path is unavailable there.
5. Set the registry policy for the groups that should see a warning or a block.

## Typical mistakes

- Assuming Python can pull data by itself with a web request. It cannot, because the container has no network access.
- Expecting Python to work in Protected View or in Excel for the web with external queries.
- Leaving the default value 0 when your policy requires a warning.
- Treating the compliance statements as an audit record. They describe the service, not your workbook activity.

## Related

- [Python in Excel](https://www.m365.fm/entity/python-in-excel/)
- [Microsoft Excel](https://www.m365.fm/entity/excel/)
- [Power Query](https://www.m365.fm/entity/power-query/)
- [Python](https://www.m365.fm/entity/python/)

## Sources

- [Data security and Python in Excel](https://support.microsoft.com/en-us/excel/python/data-security-and-python-in-excel)
- [Use Power Query to import data for Python in Excel](https://support.microsoft.com/en-us/excel/python/use-power-query-to-import-data-for-python-in-excel)
