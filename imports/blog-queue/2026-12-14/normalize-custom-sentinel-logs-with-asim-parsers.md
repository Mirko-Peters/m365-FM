---
title: "Normalize Custom Logs in Microsoft Sentinel With ASIM Parsers: Build, Test and Deploy"
summary: "A practical walkthrough for writing an ASIM source-specific parser for a custom log table, testing it with the schema and data testers, and adding it to the unifying parser through a custom unifying parser."
status: review
publish: false
author: mirko-p
date: 2026-12-14
topics: [microsoft-sentinel, kql, security-information-and-event-management]
keypoints:
  - "ASIM users query unifying parsers, which call source-specific parsers. A custom log needs its own source-specific parser, in both a filtering and a parameter-less form."
  - "A parser follows the order filter, parse, prepare fields, and must stay record-local: no joins, no summarize, no mv-expand, no time filter."
  - "Test with ASimSchemaTester and ASimDataTester. Errors block the parser, warnings reduce quality but do not block it."
  - "Built-in unifying parsers cannot be edited. Add your parser to the workspace-deployed custom unifying parser, such as Im_DnsCustom."
  - "To replace a built-in parser, add a custom parser and exclude the built-in one through the ASim Disabled Parsers watchlist."
faq:
  - q: "What is an ASIM parser?"
    a: "Microsoft Learn explains that ASIM users query unifying parsers instead of table names. A unifying parser calls source-specific parsers that handle the details of each source and map its fields to a normalized schema. You write a source-specific parser when your device or log format is not covered by a built-in one."
  - q: "Why do I need both a filtering and a parameter-less parser?"
    a: "Learn says to develop both for each relevant schema. The filtering parser accepts the schema's filter parameters so queries run faster, and the parameter-less parser returns all results without filtering. The custom unifying parser references the filtering one."
  - q: "How do I test a parser?"
    a: "Learn gives two queries. The schema test is the parser name followed by getschema and invoke ASimSchemaTester with the schema name. The data test is the parser name with limit and invoke ASimDataTester. Deploy Microsoft's ASIM testing tools first."
  - q: "How do I replace a built-in parser with my own version?"
    a: "Learn describes creating a custom parser based on the original, adding it to the built-in unifying parser through the custom unifying parser, and adding a record to the ASim Disabled Parsers watchlist that excludes the built-in parser, without a version specifier."
---

Custom security logs are a common blind spot in Microsoft Sentinel. They land in a custom table, with field names nobody else uses, so analytics rules written against normalized schemas never see them. The Advanced Security Information Model (ASIM) fixes that with parsers that map source fields to a standard schema. This guide follows Microsoft Learn's workflow for building one.

## How ASIM is layered

Learn describes two layers:

- **Unifying parsers** are what analysts and rules query. They are named by schema, for example DNS or authentication.
- **Source-specific parsers** handle one source, format or version, and return events in the normalized schema.

You write a source-specific parser when your device is not covered, or when a built-in parser does not match your device's format, version or delivery path.

## Step 1: Plan the mapping

Learn's workflow:

1. Collect sample logs.
2. Identify the schema or schemas the events represent.
3. Map source fields to the schema.
4. Write a filtering parser and a parameter-less parser per schema.
5. Test.
6. Deploy to your workspaces.
7. Add the parser to the relevant unifying parser.

Map all mandatory fields and preferably the recommended ones. Map source values to the allowed normalized values and keep the original value in a separate field, such as `EventOriginalResultDetails`. Start from an existing parser for the same schema, especially for filtering parsers, so the function signature and parameters match.

## Step 2: Write the parser

A parser has three parts: filter, parse, prepare fields. Keep every operation record-local. Learn's rules:

- Read only the declared source table. No joins, no watchlists, no `externaldata`.
- Do not turn one source record into several records, and do not use any `mv-*` operator.
- Do not use `summarize`, `distinct`, `arg_min` or `arg_max`.
- Query-local `datatable` lookups are allowed if each key is unique.
- Do not filter by time. The query that uses the parser applies the time range.

**Filter** early on built-in fields, preferring `==`, `has` and `startswith` over `contains` and regex. For parameters, skip the filter when the parameter has its default value:

```kusto
srcipaddr=='*' or ClientIP==srcipaddr
array_length(domain_has_any) == 0 or Name has_any (domain_has_any)
```

**Parse** with the most efficient operator that works. Learn ranks them from most to least optimized: `split()`, `parse_csv()`, `parse-kv`, `parse`, `extract_all()`, `extract()`, `parse_json()`, `parse_xml()`.

**Prepare fields** by renaming with `project-rename`, converting types with `extend` and `tostring`, and deriving values with `iff`, `case` or a lookup against a query-local `datatable`:

```kusto
| project-rename ActorUserId = InitiatingProcessAccountSid
| extend EventResult = iff(EventId==257 and ResponseCode==0, 'Success', 'Failure')
| extend
    EventCount = int(1),
    EventProduct = 'M365 Defender for Endpoint',
    EventVendor = 'Microsoft',
    EventSchemaVersion = '0.1.0',
    EventSchema = 'ProcessEvent'
```

Use `project-away` to remove temporary fields. Avoid `project`, because it drops non-normalized fields that a parser should keep. For several variants inside one event type, use `iff` or `case`, not `union`, because the same record could be returned twice. For hostnames, helper functions such as `_ASIM_ResolveSrcFQDN` derive host, domain and FQDN fields from a single column.

## Step 3: Deploy

Manually, paste the query into the Logs page and save it as a function. Learn recommends bulk deployment instead:

1. Create a YAML file from the template for your schema and parser type, from `https://aka.ms/ASimYamlTemplates`.
2. Convert it to an ARM template with the converter at `https://aka.ms/ASimYaml2ARM`.
3. For updates, delete older function versions first.
4. Deploy through the Azure portal or PowerShell.

Keep parsers independent of watchlists and other tables.

## Step 4: Test

Deploy the ASIM testing tools from `https://aka.ms/ASimTestingTools`, make sure the source table has varied events, then run:

```kusto
<parser name> | getschema | invoke ASimSchemaTester('<schema>')
<parser name> | limit <X> | invoke ASimDataTester('<schema>')
```

The schema test reports messages such as missing mandatory field, type mismatch and missing mandatory alias. The data test reports type mismatches and invalid values as errors, and empty mandatory fields as warnings. Errors block the parser from working. Warnings reduce result quality but do not block it. The data test is resource-intensive, so use the largest `<X>` that does not time out. Learn suggests reading the percentages: 90 percent empty values suggests a general parsing problem, while 25 percent suggests one variant is not parsed.

## Step 5: Add the parser to the unifying parser

Built-in unifying parsers cannot be edited. ASIM instead uses workspace-deployed custom unifying parsers, and the built-in ones pick them up automatically. Learn gives names such as `Im_DnsCustom`, `Im_AuthenticationCustom` and `Im_ProcessEventCustom`. You can deploy empty versions for all schemas from `https://aka.ms/ASimDeployEmptyCustomUnifyingParsers`.

To add yours:

1. Open the custom unifying parser for the schema.
2. Insert a line that calls your **filtering** parser, passing the schema's parameters by name.
3. Deploy both a filtering parser and a parameter-less parser.
4. If other parsers are already listed, add a comma and use `union isfuzzy=true`, which tolerates a missing source when another resolves.

Before you add the line, check that the custom unifying function declares the parameters you reference, and forward `pack=pack` only if your parser supports it. Set the `disabled` argument to `true` to turn a parser off.

## Replace or pin a built-in parser

Learn's procedure for a modified built-in parser:

1. Create a custom parser based on the original.
2. Add it to the custom unifying parser.
3. Add a record to the `ASim Disabled Parsers` watchlist with the `CallerContext` and `SourceSpecificParser` values that exclude the built-in parser, without a version specifier.

To pin a version, add it explicitly to the custom unifying parser, for example `_Im_Dns_AzureFirewallV02`, and add a watchlist exception for the built-in parser so updates do not override it. Watchlists deploy from `https://aka.ms/DeployASimWatchlists`.

## Common mistakes

- Filtering on time inside the parser.
- Using `project` and losing fields.
- Missing the parameter-less parser.
- Referencing parameters the custom unifying parser does not declare.
- Not recording warnings. For a parser you contribute, Learn asks you to document remaining warnings in the YAML `Exceptions` section.

## Related

- [Microsoft Sentinel](https://www.m365.fm/entity/microsoft-sentinel/)
- [Kusto Query Language](https://www.m365.fm/entity/kql/)
- [Security information and event management](https://www.m365.fm/entity/security-information-and-event-management/)

## Sources

- [Microsoft Learn: Develop ASIM parsers](https://learn.microsoft.com/en-us/azure/sentinel/normalization-develop-parsers)
- [Microsoft Learn: Manage ASIM parsers](https://learn.microsoft.com/en-us/azure/sentinel/normalization-manage-parsers)
