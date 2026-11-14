---
title: "Deploy Power BI semantic models through the XMLA endpoint with a service principal"
summary: "What Microsoft documents for automating semantic model deployment through XMLA endpoints: enabling read-write, connection strings, permissions, service principal setup, supported tools such as Tabular Editor and the limits to plan around."
status: review
publish: false
author: mirko-p
date: 2026-12-10
topics: [power-bi, tabular-editor, power-bi-premium, power-bi-service]
keypoints:
  - "Write operations through XMLA need the XMLA Endpoint setting on Read Write for the capacity or Premium Per User. Read-only is the default."
  - "The connection string is powerbi://api.powerbi.com/v1.0/myorg/<workspace name>, with the workspace name URI encoded. Contributors and above have write permission."
  - "Service principals need the tenant setting Service principals can call Fabric public APIs, workspace access as Member or Admin, and a new workspace. Classic workspaces are not supported."
  - "Tabular Editor 2.x and ALM Toolkit need read-write for metadata operations. Learn does not document Tabular Editor command-line deployment, so check the tool's own documentation."
  - "A write through XMLA to a model authored in Power BI Desktop stops it from being downloaded as a PBIX. XMLA can create data source connections but cannot set credentials."
faq:
  - q: "How do I enable XMLA write operations?"
    a: "Microsoft Learn says read-only is the default. For a Premium capacity, an admin selects Settings > Admin portal, goes to the capacity under Power BI Premium, and sets the XMLA Endpoint setting under Workloads to Read Write. For Premium Per User, the setting is under Semantic model workload settings in the Premium Per User admin page."
  - q: "What is the XMLA connection string?"
    a: "Learn gives powerbi://api.powerbi.com/v1.0/[tenant name]/[workspace name], and says myorg can replace the tenant name in the home tenant. Workspace names must be URI encoded, for example Sales%20Workspace."
  - q: "Can a service principal deploy models?"
    a: "Yes. Learn says service principals can be used with the XMLA endpoint for tasks such as provisioning workspaces, deploying models and refresh, with PowerShell, Azure Automation, Azure Logic Apps or custom clients. They need the tenant setting enabled, workspace access, and a new workspace. They do not work with RLS and OLS and cannot be added as model role members."
  - q: "Which tools work with the endpoint?"
    a: "Learn lists SSMS 18.9 or higher, Visual Studio with extension 2.9.14 or higher, Tabular Editor 2.x, ALM Toolkit, DAX Studio and the SqlServer PowerShell module version 21.1.18256 or higher. Azure Analysis Services cmdlets in Az.AnalysisServices are not supported for Power BI semantic models."
  - q: "What can go wrong after deploying through XMLA?"
    a: "Learn says a write operation on a semantic model authored in Power BI Desktop prevents it from being downloaded as a PBIX file, so keep the original. XMLA metadata can create data source connections but cannot set credentials, and default Power BI semantic models cannot be modified through the endpoint."
---

Automated semantic model deployment through XMLA needs four things: the XMLA endpoint set to read-write on the capacity, a service principal allowed to use Power BI APIs, workspace access for that principal, and a client tool that writes model metadata. This article follows what Microsoft Learn documents and notes where it stops, notably for Tabular Editor command-line use.

## Prerequisites from Learn

- The workspace must be on a Premium capacity, Premium Per User, or a Fabric capacity. Learn does not name a specific minimum Fabric SKU in the page I read.
- The tenant setting **Allow XMLA endpoints and Analyze in Excel with on-premises semantic models** must be enabled. Learn says the related tenant settings are enabled by default.
- Write operations require XMLA read-write on the capacity or PPU settings.

## Step 1: Enable read-write

Read-only is on by default. For a Premium capacity, an admin selects **Settings** > **Admin portal**, goes to **OneLake catalog** > **Govern** > **Capacities** > **Power BI Premium**, selects the capacity, and under **Workloads** sets **XMLA Endpoint** to **Read Write**. The setting applies to all workspaces and semantic models assigned to the capacity. For Premium Per User, expand **Semantic model workload settings** in the admin portal and set **XMLA Endpoint** to **Read Write**.

## Step 2: Create the service principal

Learn's steps for service principals:

1. Create an app registration in Microsoft Entra ID, and save the app name, application (client) ID, directory (tenant) ID and client secret.
2. Optionally create a dedicated security group for service principals, so you can limit tenant settings to it.
3. In **OneLake catalog** > **Govern** > **Configurations** > **Tenant settings**, expand **Developer settings** and enable **Service principals can call Fabric public APIs**. Learn recommends applying it to specific security groups. Setting names change between portal versions, so use the name shown in your admin portal.
4. In the workspace, select **More** > **Workspace access** and add the application as **Member** or **Admin**.

Learn limits: only new workspaces support XMLA connections with service principals, not classic workspaces. Write operations still need XMLA read-write. For models published from Power BI Desktop, the page says to enable the enhanced metadata format. Without a restricted group, service principals can use any tenant setting enabled for them, possibly the entire organization.

## Step 3: Connect

The XMLA address is:

```
powerbi://api.powerbi.com/v1.0/myorg/<workspace name>
```

`myorg` replaces the tenant name in the home tenant, and the workspace name must be URI encoded. For a service principal, Learn gives this connection string:

```
Data Source=powerbi://api.powerbi.com/v1.0/myorg/<workspace name>; Initial Catalog=<dataset name>;User ID=app:<appId>@<tenantId>;Password=<app_secret>;
```

With AMO or ADOMD.NET, the page requires version 15.1.42.26 or later. Store the secret in a vault or pipeline secret store, not in the script. Learn's own PowerShell sample builds a credential from the app ID and secret and calls `Invoke-ProcessTable` with `-ServicePrincipal`.

## Step 4: Pick the tool

| Tool | Requirement from Learn |
|---|---|
| SSMS | Version 18.9 or higher, authentication Active Directory - Universal with MFA for users |
| Visual Studio (SSDT) | Extension 2.9.14 or higher, model at compatibility level 1500 or higher, read-write |
| Tabular Editor 2.x | Read-only for queries, read-write for metadata operations |
| ALM Toolkit | Read-only for queries, read-write for metadata operations |
| DAX Studio | Read-only for queries |
| PowerShell | SqlServer module 21.1.18256 or higher, read-write |

The Learn page covers Tabular Editor 2.x. It does not document command-line options for deploying with Tabular Editor. I could not read Tabular Editor's own documentation while preparing this article, so confirm the deployment switches, overwrite behavior and handling of roles, partitions and connections there before building a pipeline.

Learn also says Azure Analysis Services cmdlets in `Az.AnalysisServices` are not supported for Power BI semantic models.

## Permissions

Learn says workspace contributors and above have Write semantic model permissions, effectively the same as Analysis Services database admins. Users with Build permission are like database readers and RLS is honored for them. Service principals get permissions only through workspace access, like user accounts.

## Limits to plan around

- A write through XMLA on a model authored in Power BI Desktop prevents downloading it back as a PBIX. Keep the original.
- Metadata sent through XMLA can create data source connections but cannot set data source credentials. Plan a separate step for credentials.
- Default Power BI semantic models cannot be modified through the endpoint.
- Not accessible: live connections to Azure Analysis Services or SQL Server Analysis Services, cross-workspace live connections, push-dataset models and Excel workbook models.
- Operations that need Analysis Services server admin rights, rather than database admin, are generally not supported.
- Service principals do not work with RLS and OLS and cannot be role members.
- Refreshes through XMLA are not limited to 48 per day and the scheduled refresh timeout does not apply.

## A deployment outline

1. Develop in a source-controlled format and keep the PBIX or project as the source of truth.
2. In the pipeline, authenticate as the service principal and run the deployment tool against the target workspace.
3. Run the refresh with the service principal or a TMSL command.
4. Set credentials separately, since XMLA cannot.
5. Verify the model and report connections after deployment.

Learn does not describe this pipeline end to end, so treat it as an outline built from the documented parts.

## Typical mistakes

- Deploying to a workspace on a capacity still set to read-only.
- Using a classic workspace with a service principal.
- Expecting credentials to deploy with the metadata.
- Overwriting a model and then needing the PBIX, which can no longer be downloaded.

## Related

- [Power BI](https://www.m365.fm/entity/power-bi/)
- [Tabular Editor](https://www.m365.fm/entity/tabular-editor/)
- [Power BI Premium](https://www.m365.fm/entity/power-bi-premium/)
- [Power BI service](https://www.m365.fm/entity/power-bi-service/)

## Sources

- [Semantic model connectivity with the XMLA endpoint](https://learn.microsoft.com/en-us/power-bi/enterprise/service-premium-connect-tools)
- [Automate Premium workspace and semantic model tasks with service principals](https://learn.microsoft.com/en-us/power-bi/enterprise/service-premium-service-principal)
