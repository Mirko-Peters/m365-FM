---
title: "Parse nested arrays and bad JSON in Power Automate expressions: what Microsoft documents"
summary: "How to work with nested JSON arrays in Power Automate using Parse JSON, Select, Filter array and workflow expressions such as json(), first() and coalesce(), plus where Microsoft's pages stop on corrupted payloads."
status: review
publish: false
author: mirko-p
date: 2026-12-10
topics: [power-automate, json, power-automate-run-history]
keypoints:
  - "Parse JSON turns a payload into dynamic content tokens. You can paste a schema or generate one with Use sample payload to generate schema."
  - "Select reshapes objects but cannot change the number of items. Filter array reduces items but cannot reshape them and its text matching is case-sensitive."
  - "json() converts a string or XML into a JSON value. Without an XML schema the structure from json(xml(...)) can differ greatly from what you expect."
  - "The pages I read do not describe Parse JSON schema validation errors or nullable property handling, so test with a bad sample payload yourself."
  - "In the 28-day run history, open the failed run and the failed step, then read the error details in the right pane. The page does not list Parse JSON error texts."
faq:
  - q: "How do I get a schema for Parse JSON?"
    a: "Microsoft Learn says you can enter a JSON schema in the Schema box or select Use sample payload to generate schema, paste a sample JSON object and select Done. The schema then drives the dynamic content tokens for later actions."
  - q: "Can Select remove items from an array?"
    a: "No. Learn says you can add, remove or rename elements inside each object with Select, but you can't change the number of objects in the array. Use Filter array to reduce the number of items."
  - q: "Is Filter array case-sensitive?"
    a: "Yes. Learn says the text on which you filter is case-sensitive, and Filter array can't change the shape of the objects in the array."
  - q: "What does json() do?"
    a: "The workflow expression reference says json() returns the JSON native type, object or array of objects for a string or XML. For example, json('{\"fullName\": \"Sophia Owen\"}') returns an object with a fullName property."
  - q: "Where do I see why an expression failed?"
    a: "Learn's troubleshooting page says to select the date of the failed run in the 28-day run history, open the failed step (marked with a red exclamation icon) and review the error message, with details and a how-to-fix hint in the right pane. The page does not list expression or Parse JSON error texts."
---

For nested arrays in Power Automate, parse the payload with **Parse JSON**, reshape objects with **Select**, narrow items with **Filter array**, and use expressions for the cases the designer cannot express. Microsoft's pages describe these tools well, but they say little about corrupted or inconsistent payloads. This article covers what is documented and flags the rest as something to test.

## What each tool does

| Tool | Documented behavior | Cannot do |
|---|---|---|
| Parse JSON | Creates tokens for properties from a schema or a sample payload | The pages I read do not describe validation of non-matching payloads |
| Select | Changes the shape of objects: add, remove or rename elements | Change the number of objects |
| Filter array | Reduces an array to items matching a condition | Reshape objects, and matching is case-sensitive |
| Compose | Holds a value or array for reuse | Not applicable |

The Learn page on Parse JSON is part of the Azure Logic Apps documentation. Power Automate and Logic Apps share the same workflow expression language, and the function reference below is from the Logic Apps docs.

## Step 1: Parse the payload

Add **Parse JSON** after the action that returns the payload, set **Content** to the body, and provide a schema. If you have none, select **Use sample payload to generate schema**, paste a representative sample and select **Done**. Learn's example schema describes a `Member` object with `Email`, `FirstName` and `LastName` strings, and later actions pick them from the dynamic content list.

Use a sample that contains every shape you expect, including arrays with several items and objects with all optional properties. The generator works from what it sees. Learn does not describe how a property missing from the sample or a different type at runtime is handled, so verify this with a deliberately wrong test payload before relying on it.

## Step 2: Work with the array

Use **Select** when each object needs different fields. Learn's example turns `first` and `last` into `FirstName`, `FamilyName` and `FullName`. The output array has the same number of items as the input.

Use **Filter array** when you need fewer items. Remember two documented notes: it is case-sensitive, and it cannot change object shape. If the source is an HTTP response, Learn says to run **Parse JSON** first, otherwise Filter array reads only the body and not the structure.

For text output, **Join** turns an array into a delimited string, and **Create CSV table** turns a JSON array into CSV. Learn's CSV page shows an output header that does not match the input keys in its screenshot text, so check actual header names in your own run.

## Step 3: Use expressions for what the designer misses

From the workflow expression reference:

- `json('<value>')` returns a JSON native type, object or array for a string or XML. `json('[1, 2, 3]')` returns `[1, 2, 3]`. The page warns that `json(xml(...))` without an XML schema can return a structure that greatly differs from the expected format.
- `string(<value>)` returns the string version of a value. `string( { "name": "Sophie Owen" } )` returns `"{ \"name\": \"Sophie Owen\" }"`.
- `first(<collection>)` returns the first item of a string or array.
- `coalesce(...)` returns the first non-null value from its parameters, according to the summary table.
- `empty(<collection>)` and `length(<collection>)` check whether a collection is empty and how many items it holds.
- `if(<expression>, <valueIfTrue>, <valueIfFalse>)` returns one of two values.
- `item()` and `items('<loopName>')` return the current item inside an array action or a for-each loop.
- `union`, `take` and `skip` combine, truncate or trim collections.
- `removeProperty(<object>, '<property>')` returns the original object if the property does not exist. `setProperty` adds the property if it is missing.

A common pattern for payloads that arrive as a JSON string inside a field is `json(<field>)` first, then Parse JSON on the result. The reference does not describe this pattern as such, so treat it as a combination of the documented pieces and test it.

The `string()` entry mentions that a non-existent property can be accessed with the `?` operator and then converts to an empty string. The pages I read do not define the operator further. Test how your own flow behaves for missing properties.

## Step 4: Find the failing step

In the **28-day run history** section of the failed flow, select the date of the failed run. At least one step shows a red exclamation icon. Open that step and review the error message. Learn says the right pane shows the details of the error and how to fix it. The page I read does not list error texts for expression or Parse JSON failures, and it does not describe the Inputs and Outputs panes, so use them as you know them from the designer and treat that as my own note.

For error codes **400** (Bad request) or **404** (Not found), Learn says the cause is a setting in an action that does not work as expected and that the error details should say how to correct it. The page does not name schema changes as a cause.

## What the documentation does not cover

For corrupted payloads specifically, the pages I read give no recipe. They do not describe schema validation errors, nullable types, or how to recover malformed JSON. If you need a defensive design, a reasonable approach is to keep the raw string in a **Compose** action, parse it in a scope, and handle failure separately. That is a design suggestion, not something Learn prescribes.

## Typical mistakes

- Generating a schema from a single sample that omits optional properties.
- Using Filter array and expecting renamed fields, or Select and expecting fewer items.
- Filtering on text with different capitalization.
- Expecting `json(xml(...))` to give a stable structure without an XML schema.

## Related

- [Power Automate](https://www.m365.fm/entity/power-automate/)
- [JSON](https://www.m365.fm/entity/json/)
- [Power Automate run history](https://www.m365.fm/entity/power-automate-run-history/)

## Sources

- [Perform operations on data in workflows: Parse JSON, Select, Filter array](https://learn.microsoft.com/en-us/azure/logic-apps/logic-apps-perform-data-operations)
- [Use data operations in Power Automate](https://learn.microsoft.com/en-us/power-automate/data-operations)
- [Reference guide to workflow expression functions](https://learn.microsoft.com/en-us/azure/logic-apps/expression-functions-reference)
- [Troubleshoot cloud flow failures](https://learn.microsoft.com/en-us/power-automate/fix-flow-failures)
