---
title: "CI/CD for Logic Apps Standard With Dataverse Connections Across Environments"
summary: "How to build and release Standard logic app workflows across dev, test and production with parameterized connections, ARM templates for API connections and ZIP deploy, plus what Microsoft's pages do not say about Dataverse."
status: review
publish: false
author: mirko-p
date: 2026-12-14
topics: [azure-logic-apps, dataverse, azure-devops, power-platform-alm]
keypoints:
  - "Standard logic apps deploy as an immutable ZIP artifact, kept separate from infrastructure that you provision with ARM templates."
  - "Parameterize connections.json so each environment uses its own connections and endpoints, and keep secrets in app settings, not in the repo."
  - "Managed API connections are separate Azure resources. Learn calls an ARM template the easiest way to create them, and each needs an access policy for the logic app identity."
  - "The Learn pages read do not describe a Dataverse-specific deployment path, and the Dataverse connector page lists OAuth, service principal and client certificate, not managed identity."
  - "The Azure DevOps extension generates CI, CD and infrastructure pipelines as YAML, and currently supports only ARM templates for infrastructure scripts."
faq:
  - q: "How are Standard logic apps deployed between environments?"
    a: "Microsoft Learn describes building, assembling and zipping the logic app project into an artifact, copying it to the host environment and starting the app. Infrastructure such as plans, storage and API connections is provisioned separately, for example with ARM templates, so the app artifact can move unchanged between environments."
  - q: "What must I change in connections.json for each environment?"
    a: "Learn says to parameterize connections.json and update the endpoints so each environment uses its own connections and functions. For managed API connections, the local authentication object must change from the raw key format to the Azure format before release."
  - q: "Do I need to recreate Dataverse connections in every environment?"
    a: "Managed API connections are Azure resources, and Learn says to create them in the target if its region or subscription differs from development, with an ARM template as the easiest route. The pages read do not give Dataverse-specific steps, so validate authentication in a test environment."
  - q: "Why does the deployed workflow not authenticate after a successful ZIP deploy?"
    a: "Learn says that after the zip deployment completes you must open the Standard logic app in the Azure portal and create access policies for each API connection. App settings must also exist in the target, either from the pipeline's appSettings parameter or set manually."
---

A Standard logic app that works in a developer's environment can still fail in production for plain reasons: the connection points at the wrong environment, a setting is missing, or an access policy was never created. A repeatable pipeline removes those surprises. This guide covers the documented building blocks for Standard logic apps and is explicit about the Dataverse part that Microsoft's pages leave open.

## What Microsoft documents

Learn's DevOps overview for Standard logic apps makes a few design points:

- You build, assemble and zip the project into an artifact, copy it to the host and start it.
- You can deploy the app separately as an immutable artifact to different environments. Workflow definitions change more often than infrastructure.
- Infrastructure such as virtual networks and connectivity is provisioned with ARM templates in separate pipelines.
- Environment values are read at runtime through app settings and parameters, so you do not need to redeploy as often.

## Project structure

Each workflow has a `workflow.json`. The root contains `connections.json`, `host.json` and `local.settings.json`. Learn says:

- `connections.json` holds metadata, endpoints and keys for managed API connections and Azure functions. To use different connections and functions per environment, parameterize it and update the endpoints.
- `local.settings.json` is ignored during deployment and can contain secrets, so exclude it from source control.
- The ZIP must contain the build artifacts at the root level, including workflow folders, `host.json`, `connections.json` and `local.settings.json`. Do not add extra folders.

In Visual Studio Code, answer **Yes** when prompted to allow parameterization for connections. Learn says this lets the project use parameters in connection definitions for different environments.

## Prepare the target environment

The target needs these resources:

| Resource | Needed? |
|---|---|
| Standard logic app on the Workflow Standard plan | Required |
| Storage account | Required for stateful and stateless workflows |
| API connections | Required if workflows use them |
| Application Insights | Optional |

Managed API connections run separately as Azure resources. Built-in connections are packaged into the same build artifact, which Learn says works well with deployment pipelines. If the target region or subscription differs, create the managed connections before deployment. Learn says an ARM template is the easiest way and shows a `Microsoft.Web/connections` resource. To find the `parameterValues` a connector needs, call the managed APIs endpoint for the connector and read `connectionParameters`.

## Authentication in the pipeline

The local `connections.json` uses a raw key that is created for local use in Visual Studio Code. Learn gives the change needed before release for managed connections:

```json
"authentication": {
   "type": "ManagedServiceIdentity"
}
```

Learn says managed identity is the default and recommended type for managed connections that run in Azure, and that raw keys are for development only because they expire after seven days. If you disable the logic app's system-assigned identity, connections stop working at runtime. Every managed API connection also needs an access policy for the logic app's identity, created in the portal after the ZIP deployment.

**The Dataverse caveat.** The `ManagedServiceIdentity` example above comes from a SQL connection example. The Dataverse connector page I read lists authentication types of OAuth, Service Principal (client ID and secret) and Client Certificate, plus a deprecated default. It does not list managed identity, and it does not mention Logic Apps at all. It also states a limit of 6,000 API calls per connection per 300 seconds. So do not assume the SQL pattern carries over. Decide your Dataverse authentication type, create the connection per environment, and test it in a pre-production environment before the first release. Microsoft's Dataverse-specific ALM for solutions, pipelines and environments is a separate topic that these pages do not connect to Logic Apps Standard.

## Build and release

For GitHub, Learn shows the Azure Functions action with the logic app name, the build ZIP and a publish profile:

```yaml
- name: 'Run Azure Functions Action'
  uses: Azure/functions-action@v1
  with:
   app-name: 'MyLogicAppName'
   package: 'MyBuildArtifact.zip'
   publish-profile: 'MyLogicAppPublishProfile'
```

App settings can be set two ways. The recommended way is the `appSettings` parameter of the Azure Function App Deploy task in Azure DevOps, or the equivalent in GitHub Actions. The manual way is creating them in the portal from `local.settings.json`. Store secrets in Azure Key Vault and reference them through app settings when managed identity is not available.

## Azure DevOps with generated pipelines

The Azure Logic Apps (Standard) extension for Visual Studio Code can generate deployment scripts. Learn describes:

1. Create the workspace and allow parameterization for connections.
2. Select **Generate deployment scripts**, choose Azure DevOps Pipeline, and name the logic app, storage account and App Service plan.
3. The extension creates a `deployment/{logic-app-name}` folder with `pipelines` (`CI-pipeline.yml`, `CD-pipeline.yml`, `infrastructure-pipeline.yml` and variable files), `infrastructure` (ARM templates and parameters) and `workflowparameters` (`parameters.json`).
4. Push to your repository and create the three pipelines from the existing YAML files. In `CD-pipeline.yml`, rename the `source` attribute to match your CI pipeline name.

Prerequisites include the Azure Logic Apps (Standard) Build and Release tasks, an Azure Resource Manager service connection with a service principal, and an existing resource group. Limits: only Standard projects are supported, custom code projects are currently ignored, you must connect the pipelines to Azure DevOps and create triggers yourself, and only ARM templates are supported for infrastructure scripts. When you target another environment, update the values in the generated parameters and variable files.

## Release checklist

1. Parameterize `connections.json`, keep `local.settings.json` out of source control.
2. Provision the plan, storage and API connections with ARM templates per environment.
3. Convert connection authentication to the Azure format for managed connections.
4. Build the ZIP with artifacts at the root.
5. Deploy with the pipeline, passing app settings.
6. Create access policies for each API connection.
7. Run a smoke test that calls the Dataverse action in the target environment.

## Gotchas

- Snapshots: Learn warns you can keep only up to 10 snapshots for the same logic app, otherwise you get an error about non-decryptable secrets backups.
- Deleting an app does not delete snapshots, so extra files must be removed by hand.
- Deployment slots and Bicep are not covered by the pages I read.

## Related

- [Azure Logic Apps](https://www.m365.fm/entity/azure-logic-apps/)
- [Dataverse](https://www.m365.fm/entity/dataverse/)
- [Azure DevOps](https://www.m365.fm/entity/azure-devops/)
- [Power Platform ALM](https://www.m365.fm/entity/power-platform-alm/)

## Sources

- [Microsoft Learn: DevOps deployment for Standard logic app workflows](https://learn.microsoft.com/en-us/azure/logic-apps/devops-deployment-single-tenant-azure-logic-apps)
- [Microsoft Learn: Set up DevOps deployment for Standard logic app workflows](https://learn.microsoft.com/en-us/azure/logic-apps/set-up-devops-deployment-single-tenant-azure-logic-apps)
- [Microsoft Learn: Automate build and deployment for Standard logic apps with Azure DevOps](https://learn.microsoft.com/en-us/azure/logic-apps/automate-build-deployment-standard)
- [Microsoft Learn: Microsoft Dataverse connector reference](https://learn.microsoft.com/en-us/connectors/commondataserviceforapps/)
