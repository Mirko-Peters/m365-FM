---
title: "How to Use Environment Variables and Connection References in Solutions"
summary: "Use environment variables and connection references in Power Platform solutions: data types, default versus current values, creating both in a solution, import behavior, limits such as 2,000 characters, and known issues."
status: review
publish: false
author: mirko-p
date: 2027-01-07
topics: [power-platform-solution, power-platform-alm]
keypoints:
  - "Environment variables hold parameter values that change between environments. Connection references let solution-aware flows and canvas apps bind to a connection instead of a fixed credential."
  - "Create an environment variable with New > More > Environment variable in a solution. Create a connection reference with New > More > Connection Reference."
  - "A current value overrides the default value. Current and default values are limited to 2,000 characters, and names to 100 characters."
  - "Flows use connection references for all connectors. Canvas apps use them only for implicitly shared (non-OAuth) connections."
  - "Known issues include custom connector references in canvas apps and after a copy environment, and the ConnectionAuthorizationFailed error."
faq:
  - q: "What is the difference between an environment variable and a connection reference?"
    a: "Per Microsoft Learn, an environment variable holds a parameter value such as text, JSON or a data source choice that other components consume. A connection reference is a solution component that points to a connection for a specific connector, so flows and apps bind to the reference, not the connection."
  - q: "How do I create an environment variable?"
    a: "In a solution select New > More > Environment variable, then fill in Display name, Name, Data Type, Current Value and Default Value and select Save."
  - q: "Which value is used when both exist?"
    a: "The current value. Learn says a defined value is used even if a default value is also present. The default is used if there is no current value."
  - q: "Where do canvas apps and flows use connection references?"
    a: "Flows use them for all connectors. Canvas apps use them only for implicitly shared, non-OAuth connections such as SQL Server Authentication."
  - q: "What does ConnectionAuthorizationFailed mean?"
    a: "The user who activates a flow lacks permission to at least one of its connections. Have the connection owners share the connections with that user, or have the single owner turn the flow on."
---

Environment variables and connection references keep a solution portable. An environment variable carries values that differ per environment. A connection reference lets flows and apps use whatever connection exists in the target environment. This guide follows two Microsoft Learn pages: one on environment variables and one on connection references in solutions.

## Environment variables

Environment variables hold parameter keys and values that other objects consume. They are solution components, so they travel with the solution. One variable can be used across many components, and changing its value does not require editing the apps or flows that use it.

**Data types:** Decimal number, Text, JSON, Two options, Data source and Secret. A Data source variable needs a connector, a valid connection and a parameter type, but it does not store the connection. A Secret needs Azure Key Vault set up, which is described on a separate page.

**Default versus current value**

- **Current Value** is optional. A defined value is used even if a default is present.
- **Default Value** is optional and used when there is no current value.
- This split lets a publisher ship a default without overwriting a customer's value on update.

**Create one**

1. Sign in to Power Apps and select **Solutions**.
2. Open or create a solution.
3. Select **New** > **More** > **Environment variable**.
4. Fill in **Display name**, **Name** (generated, editable), **Data Type**, **Current Value** and **Default Value**, then select **Save**.

An option on the **General** tab in Power Apps settings can create environment variables automatically when you add data sources.

**Where they are used:** canvas apps, Power Automate flows, plug-ins, and Power BI dashboards added to model-driven apps. For SharePoint, use a connection plus separate variables for site and list. For SQL Server, use separate variables for server and database. Updated values might take up to an hour to reach apps and flows.

**Import and export**

- The import experience lets you enter values. Prefilled values are labeled as coming from the solution, the target environment or the default.
- To keep a value out of an export, select the variable's current value, then **Remove from this solution**. The value stays in the development environment.
- Values are stored as separate JSON files in the exported solution and can be edited offline.
- For automated imports, Power Platform Build Tools can supply values from a deployment settings file.

**Limits:** current and default values up to 2,000 characters, display and schema names up to 100 characters, and a solution package size limit of 95 MB. Validation happens in the UIs and consuming components, not in Dataverse. The page says there is no hard limit on the number of variables.

## Connection references

A connector is a wrapper around an API. A connection is a stored credential for a connector. A connection reference is a solution component that points to a connection for one connector. Solution-aware canvas apps and flow actions bind to the reference.

**Create one**

1. In Power Apps or Power Automate select **Solutions** and open a solution.
2. Select **New** > **More** > **Connection Reference**.
3. Enter a **Display name**, an optional description, the **Connector** and the **Connection**.
4. Select **Create**.

References are also created by importing a solution, or implicitly when you build solution-aware flows or apps. Learn recommends renaming the default name to explain its purpose.

**Usage:** flows use connection references for all connectors. Canvas apps use them only for implicitly shared (non-OAuth) connections such as SQL Server Authentication.

**On import:** a connection is provided for all connection references so that referencing flows can turn on automatically after import. The page does not describe the exact prompt.

**Update or upgrade:** to change a connection, edit the reference in the solution. To upgrade an existing flow, export as unmanaged and import, then use the flow checker action that removes connections so references can be added. For a canvas app, remove the connection and add one with a connection reference.

## Permissions and known issues

- The user who turns on a flow must own or have permission to use all its connections.
- ConnectionAuthorizationFailed means the activating user lacks permission to at least one connection.
- Canvas apps do not recognize connection references on custom connectors. After import, remove and re-add the connection.
- After a copy environment, custom connector references break and need new references.
- Import custom connectors in a separate solution before their references or flows.
- An Invalid Connection warning on a flow means the connection is in a bad state.
- Ownership of a connection reference cannot be transferred from the Solutions area. The classic solution explorer can change its privileges.

## Which to use when

Learn advises against environment variables for shared connections such as SQL basic authentication. Use connection references for what would otherwise sit in a connection string.

## What the pages do not say

Formula or expression syntax for reading a variable, Key Vault setup steps, a definition of connection reference columns, programmatic creation, and step-by-step recovery after a copy environment.

## A solution checklist

This list is practical advice.

1. Put every environment-specific value into a variable with a sensible default.
2. Give connection references descriptive names.
3. Supply values and connections during import through the import experience or a deployment settings file.
4. Test that flows turn on in the target environment.

## Typical mistakes

- Expecting a value change to reach apps instantly.
- Putting a shared SQL connection in an environment variable.
- Forgetting that the user who activates a flow needs access to every connection.
- Importing a flow before its custom connector.

## Related

- [Environment variables](https://www.m365.fm/entity/environment-variables/)
- [Power Platform solution](https://www.m365.fm/entity/power-platform-solution/)
- [Power Platform ALM](https://www.m365.fm/entity/power-platform-alm/)
- [Power Platform pipelines](https://www.m365.fm/entity/power-platform-pipelines/)

## Sources

- [Use environment variables in Power Platform solutions (Microsoft Learn)](https://learn.microsoft.com/power-apps/maker/data-platform/environmentvariables)
- [Use a connection reference in a solution (Microsoft Learn)](https://learn.microsoft.com/power-apps/maker/data-platform/create-connection-reference)
