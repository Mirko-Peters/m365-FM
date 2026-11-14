---
title: "Excel Power Query Web Connector: Fixing Authentication and Paging Errors"
summary: "How to fix Web connector credential errors, timeouts and incomplete API results in Excel Power Query and dataflows: authentication kinds, changing credentials, Web.Contents options, paging with List.Generate and the privacy firewall."
status: review
publish: false
author: mirko-p
date: 2026-12-07
topics: [excel, power-query, power-platform-dataflows]
keypoints:
  - "Web.Contents supports Anonymous, Windows, Basic, Web API, Organizational Account and Service Principal. POST requests can only be made anonymously."
  - "Change or clear saved credentials under Data > Get Data > Data Source Settings > Global permissions > Edit Permissions."
  - "Web.Contents times out after 100 seconds by default. Raise it with the Timeout option or the Command timeout in minutes setting."
  - "Paging mechanisms differ per API, so the examples need adapting. Table.GenerateByPage with List.Generate calls a next-page function until it returns null."
  - "In the cloud, Web page and browser-based sources need an on-premises data gateway. Web API authentication is not supported in the Power BI service."
faq:
  - q: "Which authentication types does the Web connector support?"
    a: "Microsoft Learn lists, for Web.Contents, Anonymous, Windows, Basic, Web API, Organizational Account and Service Principal. Service principal is available in Power Query Online and is not supported with an on-premises or VNet data gateway. POST requests can only be made anonymously."
  - q: "How do I change a wrong saved credential in Excel?"
    a: "Microsoft Learn says to select Get Data > Data Source Settings on the Data tab, choose Global permissions, select the data source, then Edit Permissions, and under Credentials select Edit. Clear Permissions deletes the saved credentials."
  - q: "What does 'credential type isn't supported for this resource' mean?"
    a: "The Web connector troubleshooting page says that OAuth/Microsoft Entra ID authentication, which some services support out of the box, does not work in most cases. When this error appears, its remedy is to contact the service owner, who needs to change the authentication configuration or build a custom connector."
  - q: "How does Power Query page through a REST API?"
    a: "Learn says Power Query supports many paging mechanisms but each needs adaptation. The Table.GenerateByPage helper calls a function for each page, passes the previous page, and stops when the function returns null. Next-page links are commonly carried as metadata on each page."
  - q: "What is the Formula.Firewall error?"
    a: "Microsoft Learn describes it as raised when a step both references another query and directly accesses a data source. The documented fix is to combine those steps into one query so they run in one partition."
---

Web connector problems in Excel Power Query fall into four groups: the wrong credential type, a timeout, incomplete results because paging is missing, and the data privacy firewall. This guide follows the Microsoft Learn pages and states where they stop. They do not describe Excel dataflows in detail, so notes on Power Query Online are limited to what the connector page says.

## Step 1: Pick the right authentication kind

Learn lists which kinds each Web function supports:

| Function | Authentication kinds |
|---|---|
| Web.Contents | Anonymous, Windows, Basic, Web API, Organizational Account, Service Principal |
| Web.BrowserContents | Anonymous, Windows, Basic, Web API |
| Web.Page | Anonymous, Windows (current user), Web API |

Notes from the page:

- **Web API** is for resources that use an API key. It is available in Power BI Desktop and in Power Query in Excel, but not in the Power BI service.
- **Service principal** appears in Power Query Online and is not supported with an on-premises data gateway or a VNet data gateway.
- **POST requests** can only be made anonymously with Web.Contents.
- In Excel, connect with **From Web** on the **Data** ribbon. Authentication applies at the URL level you choose, so a top-level address covers its subaddresses.

## Step 2: Change or clear a saved credential

Once you set an authentication method for a URL level, Power Query does not ask for it again for that address or its subaddresses, so a wrong choice has to be changed in the settings. Learn's steps:

1. On the **Data** tab, select **Get Data** > **Data Source Settings**.
2. Choose **Global permissions** and select the data source.
3. Select **Edit Permissions**, then under **Credentials** select **Edit**.
4. Enter the right type, select **Save** and **OK**.

**Clear Permissions** removes the credentials for one source and **Clear All Permissions** for all of them.

If the message reads "We were unable to connect because this credential type isn't supported for this resource", the troubleshooting page says that OAuth/Microsoft Entra ID authentication, which some services support out of the box, does not work in most cases. Contact the service owner, because the authentication configuration needs to change or a custom connector must be built. The same page states that Power Query does not currently support connecting to Microsoft Graph REST APIs.

For key-based APIs, Web.Contents has an `ApiKeyName` option. You give the name of the key parameter in M, choose Web API authentication and enter the key value in the credential. The Web.Contents page gives `Web.Contents("https://contoso.com/api/customers/get", [ApiKeyName="api_key"])` as the example, which generates a request to `https://contoso.com/api/customers/get?api_key=******`, so the secret does not sit in the M code.

## Step 3: Handle timeouts

The default timeout for both POST and GET is 100 seconds. In the dialog, the **Command timeout in minutes** advanced option extends it. In M, Web.Contents accepts a `Timeout` option as a duration.

## Step 4: Build paging yourself

Learn states that REST APIs transmit large volumes in pages, and that Power Query supports many mechanisms, so the examples usually need changes. Four questions must be answered for any API:

1. How is the next page requested?
2. Is the next URL calculated or taken from the response?
3. How do you know when to stop?
4. Are there page-size parameters?

The helper `Table.GenerateByPage` does the heavy lifting. Its `getNextPage` function receives the previous page (null on the first call) and returns the next page, or null when no pages remain. The core is:

```powerquery-m
List.Generate(
    () => getNextPage(null),
    (lastPage) => lastPage <> null,
    (lastPage) => getNextPage(lastPage)
)
```

The helper page says the next page URL (or page number, or whatever other values the paging logic uses) is generally carried as `meta` values on the page before it is returned, for example `current meta [Next=link]`. The columns and table type of the combined table come from the first page, and `getNextPage` should normalize each page. Learn's worked example (a GitHub paged table) reads a next link from the page metadata. The pages read do not show offset, page number or cursor patterns in code, so adapting the loop to such APIs is your own work. Test the stop condition carefully.

For dynamic URLs, `Web.Contents` accepts `Query` and `RelativePath` options. Learn says they can be used to dynamically query a static base URL. The pages do not say whether this affects refresh in the service, so test a scheduled refresh.

## Step 5: Fix the privacy firewall error

The message looks like: `Formula.Firewall: Query 'Query1' (step 'Source') references other queries or steps, so it may not directly access a data source. Please rebuild this data combination.`

Learn says the firewall splits queries into partitions, and a partition may access compatible data sources or reference other partitions, but not both. The documented fix is to merge the referencing step and the data-accessing step into one query. Learn also mentions the privacy option **Ignore the Privacy Levels and potentially improve performance** as an alternative (it disables the firewall altogether) and notes that privacy levels are unavailable in Power Platform dataflows. A further note says the old restriction, that a partition cannot access data sources and reference other partitions at the same time, is relaxed in certain products.

## Step 6: Cloud and dataflow considerations

- Web.Page and Web.BrowserContents need an on-premises data gateway when published to a cloud service. Web.Page needs Internet Explorer 10 on the gateway machine. Web.BrowserContents needs the WebView2 runtime, and the gateway service account (usually PBIEgwService) needs access to its install folder.
- In Power Query Online, **Web page** requires a gateway because HTML pages are retrieved by a browser control. **Web API** does not use one.
- For dynamic pages that fail only sometimes, the troubleshooting page says to use the `WaitFor` option of Web.BrowserContents.
- If the URL points to a file, use the specific file connector.
- The connector uses HTTP 1.1. It cannot be switched to HTTP 1.0.

## Typical mistakes (own reading of the pages above)

- Entering credentials once at the wrong URL level and never clearing them.
- Using Web API authentication and then moving the query to the Power BI service.
- Writing paging code without a clear null stop condition.
- Mixing a data source call and a query reference in one step.

## Related

- [Power Query](https://www.m365.fm/entity/power-query/)
- [Power Platform dataflows](https://www.m365.fm/entity/power-platform-dataflows/)
- [REST API](https://www.m365.fm/entity/rest-api/)
- [Microsoft Excel](https://www.m365.fm/entity/excel/)

## Sources

- [Web connector (Microsoft Learn)](https://learn.microsoft.com/en-us/power-query/connectors/web/web)
- [Troubleshooting the Web connector (Microsoft Learn)](https://learn.microsoft.com/en-us/power-query/connectors/web/web-troubleshoot)
- [Authentication in desktop apps (Microsoft Learn)](https://learn.microsoft.com/en-us/power-query/connector-authentication)
- [Handling paging (Microsoft Learn)](https://learn.microsoft.com/en-us/power-query/handling-paging)
- [Helper functions for M extensions, Table.GenerateByPage (Microsoft Learn)](https://learn.microsoft.com/en-us/power-query/helper-functions)
- [Web.Contents (Microsoft Learn)](https://learn.microsoft.com/en-us/powerquery-m/web-contents)
- [Behind the scenes of the Data Privacy Firewall (Microsoft Learn)](https://learn.microsoft.com/en-us/power-query/data-privacy-firewall)
