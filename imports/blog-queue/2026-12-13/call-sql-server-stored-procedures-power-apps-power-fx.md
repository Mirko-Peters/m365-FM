---
title: "Call SQL Server Stored Procedures Directly From Power Apps With Power Fx, Without an Intermediate Flow"
summary: "How to add stored procedures to a canvas app's SQL Server connection, call them in Power Fx, read ResultSets, use the safe-for-galleries option, refresh data, and the gateway, timeout and throttling limits Microsoft documents."
status: review
publish: false
author: mirko-p
date: 2026-12-13
topics: [power-apps, sql-server, transact-sql, on-premises-data-gateway]
keypoints:
  - "Since the July 2024 general availability announcement, canvas apps can call SQL Server stored procedures in Power Fx without a Power Automate flow."
  - "Syntax is DataSource.ProcedureName({param: value}), and the schema name is prepended, so dbo.newlibrarybook becomes dbonewlibrarybook."
  - "Read results with .ResultSets.Table1. Mark a procedure safe for galleries only if it has no side effects and returns fewer than 10,000 records."
  - "Refresh does not work with stored procedures, so reassign a variable after each write."
  - "Through a gateway, OUTPUT values and return values are not available, and only the first result set is returned. Calls time out at 110 seconds."
faq:
  - q: "Do I still need Power Automate to run a stored procedure from Power Apps?"
    a: "No. Microsoft's July 2024 announcement says calling SQL Server stored procedures in Power Fx is generally available in all regions and that makers no longer need a Power Automate flow. Only stored procedures can run. Arbitrary SQL is not allowed, which Microsoft presents as a security measure."
  - q: "How do I read the rows a procedure returns?"
    a: "According to Microsoft Learn, read from the ResultSets property of the call, for example DataSource.dbospshowalllibrarybooks().ResultSets.Table1. Multiple result sets are named Table1, Table2 and so on. The procedure must first be marked Safe to use for galleries and tables for use in this way."
  - q: "Why does Refresh not update my gallery after I call a procedure?"
    a: "Learn says Refresh does not work with stored procedures because they are action behaviors, not tabular sources. Store the result in a variable with Set, bind the gallery to it, and set the variable again after each create, update or delete."
  - q: "What are the limits through an on-premises gateway?"
    a: "The SQL Server connector reference says OUTPUT parameter values are not returned, the ResultSets value is untyped, the return value is not available, only the first result set is returned and dynamic schemas are not supported. Actions time out after 110 seconds."
---

Canvas apps used to need a Power Automate flow to run a SQL Server stored procedure. Microsoft announced general availability of direct calls from Power Fx on July 31, 2024, in all regions. The result is a shorter path and fewer moving parts. It also brings rules about side effects, refresh and limits that are easy to trip over. This article follows the Learn documentation.

## What you can and cannot do

Microsoft's announcement says makers no longer need a Power Automate flow to call a stored procedure. It also says only stored procedures can run and arbitrary SQL is not allowed, which it presents as a security measure. The feature extends the tabular model, which already gave access to tables and views.

You still might choose a flow in some cases. Learn says Power Automate handles asynchronous work best, and a flow can call stored procedures with input variables. For quick request and response calls inside the app, use Power Fx.

## Step 1: Add the connection and the procedures

Add a SQL Server connection to the app. In the table selector, the Learn article shows a list with tables, views and stored procedures. The announcement describes a **Stored Procedure** tab in that selector. Select the procedures the app needs. The feature also works with secure, implicit connections.

After you select a procedure, a child node appears where you can mark it **Safe to use for galleries and tables**. More on that below.

The pages I read do not give click-by-click Data pane steps, so follow the on-screen selector.

## Step 2: Call the procedure in Power Fx

Arguments are a record of named values:

```
<datasourceName>.<StoredprocedureName>({ paramName1: value, paramName2: value })
```

The SQL schema name is prepended to the procedure name. So dbo.newlibrarybook becomes dbonewlibrarybook. A call from the Learn example:

```
Paruntimedb.dbonewlibrarybook({
  book_name: DataCardValue3_2.Text,
  author: DataCardValue1_2.Text
})
```

Power Apps passes text, so convert values where the parameter needs another type. Learn gives Value() for an integer column as an example.

## Step 3: Read results

For a procedure marked safe:

```
Paruntimedb.dbospshowalllibrarybooks().ResultSets.Table1
```

If the procedure returns several result sets, use Table1, Table2 and so on. The result schema must be static. A procedure that returns two tables must always return two tables. For dynamic schemas, Learn says you must provide a specific type, and links to its dynamic results documentation.

## Mark a procedure safe only when it is

**Safe to use for galleries and tables** lets you bind a procedure to the Items property of a gallery or table. Learn gives two conditions:

1. **No side effects.** Power Apps may call the procedure many times, whenever it decides a refresh is needed, and you cannot control when. Do not mark a procedure safe if it, for example, sends emails.
2. **Modest data volume.** Action calls have no row limit and are not paged in 100-record increments. Learn recommends fewer than 10,000 records, since larger results can slow or crash the app.

A read-only procedure that returns a limited set with a WHERE clause is the typical safe case. Procedures that insert, update or delete should stay unmarked and be called from button handlers.

## Step 4: Refresh after writes

Refresh does not work with stored procedures, because they are action behaviors rather than tabular data sources. Learn's pattern is to keep results in a variable:

```
// Screen OnVisible
Set(SP_Books, Paruntimedb.dbospshowalllibrarybooks().ResultSets.Table1);

// Gallery Items
SP_Books

// Button OnSelect after a write
Paruntimedb.dbonewlibrarybook({ book_name: txtName.Text, author: txtAuthor.Text });
Set(SP_Books, Paruntimedb.dbospshowalllibrarybooks().ResultSets.Table1);
```

Form Submit on a tabular source calls Refresh under the hood, and a stored procedure does not get that behavior.

## When procedures are the better choice

Learn lists these cases:

- A table has a trigger. You cannot use Submit for create, update or delete on it, so call a procedure instead. The connector reference adds that inserts and updates fail if a server-side trigger is defined on the table.
- Views only support queries. Use procedures for writes.
- Business logic that should stay in the database.

## Limits and behaviors from the connector reference

- **Timeout:** actions time out if a query or procedure runs longer than 110 seconds. For long-running work, the page points to Logic Apps guidance.
- **Result sets:** only result sets up to the first empty one are returned. Column names in the result schema must be unique and non-empty, including in any inner SELECT.
- **Through an on-premises data gateway:** OUTPUT parameter values are not returned, though input values can be passed. ResultSets is untyped, the return value is not available, only the first result set is returned and dynamic schemas are not supported.
- **Gateway size limits:** request size 2 MB, response size 8 MB.
- **Throttling in Power Apps:** 300 API calls per user per 30 seconds, and 125 concurrent calls per connection. Calls above the concurrency limit return 429.

## Authentication and sharing

The connector lists these authentication types: Microsoft Entra ID Integrated, service principal, SQL Server authentication, Windows authentication and Windows authentication (non shared). Shareable connections, such as SQL Server authentication, Windows authentication and service principal, are shared along with the app. Non-shareable connections, such as Entra ID Integrated, need each new user to create their own connection.

The pages I read do not document the database permissions the connection user needs. Apply least privilege: grant execute only on the procedures the app calls, which is general SQL practice rather than a statement from these pages. With a shared connection, every app user runs the procedures under the same account, so the procedure must enforce its own checks.

## Common mistakes

- Using the dotted SQL name instead of the prefixed one.
- Marking a procedure with side effects as safe for galleries.
- Expecting Refresh to reload procedure data.
- Returning large result sets into a gallery.
- Relying on OUTPUT parameters through a gateway.
- Passing text where the procedure needs a number, without Value().

## Related

- [Power Apps](https://www.m365.fm/entity/power-apps/)
- [Microsoft SQL Server](https://www.m365.fm/entity/sql-server/)
- [Transact-SQL (T-SQL)](https://www.m365.fm/entity/transact-sql/)
- [On-premises data gateway](https://www.m365.fm/entity/on-premises-data-gateway/)

## Sources

- [Microsoft Learn: Access data in SQL Server from canvas apps](https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/connections/sql-connection-access-data)
- [Microsoft Learn: SQL Server connector reference](https://learn.microsoft.com/en-us/connectors/sql/)
- [Microsoft Power Platform blog: Call SQL Server procedures directly in Power Fx, now generally available](https://www.microsoft.com/en-us/power-platform/blog/power-apps/call-sql-server-procedures-directly-in-power-fx-ga/)
- [Microsoft Learn: Connect to SQL Server from Power Apps](https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/connections/connection-azure-sqldatabase)
