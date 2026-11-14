---
title: "Copilot Studio ALM: Move Agents Between Dev, Test and Production Environments Step by Step"
summary: "Automate Copilot Studio application lifecycle management with solutions, managed exports, environment variables, connection references and Power Platform pipelines. Includes post-import steps and known limits, per Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2026-12-09
topics: [copilot-studio, application-lifecycle-management, power-platform-alm, power-platform-pipelines]
keypoints:
  - "Learn recommends at least three environments: development, test and production. Production should be a production type, the others sandbox type."
  - "Work in a custom solution, export and deploy as managed, and use environment variables and connection references for environment-specific settings."
  - "Some Copilot Studio items are not solution-aware: Application Insights, manual authentication, Direct Line and web channel security, deployed channels and sharing."
  - "After import, configure user authentication again, publish the agent and allow up to 24 hours for the icon to appear."
  - "Power Platform pipelines, Azure DevOps and GitHub Actions are the documented automation options. Pipelines target managed environments."
faq:
  - q: "Can I deploy agents from the default solution to another environment?"
    a: "Microsoft Learn says agents are created in the default solution automatically, but to export, import and manage agents between environments you need to create and use a custom solution. Add the agent and its required components to it before exporting."
  - q: "Should I export managed or unmanaged solutions?"
    a: "Microsoft Learn's ALM golden rules say to export and deploy solutions as managed, unless you set up a development environment. The import and export page adds that managed solutions cannot be exported, so if you change an unmanaged solution to managed, you create a new solution."
  - q: "What do I have to redo after importing an agent?"
    a: "Learn lists configuring user authentication again, publishing the agent before sharing it, and allowing up to 24 hours for the agent icon to appear. The ALM guidance also names items that are not solution-aware and need post-deployment steps: Application Insights settings, manual authentication, Direct Line and web channel security, deployed channels and sharing."
  - q: "Which automation tools does Microsoft list for deploying agents?"
    a: "Microsoft Learn compares Azure DevOps, GitHub Actions for Power Platform and Power Platform pipelines for Copilot Studio. Pipelines have the lowest setup complexity and suit citizen developers. Azure DevOps suits enterprise teams that need full ALM control."
---

To move a Copilot Studio agent between environments in a repeatable way, put it in a custom solution, add its required components, export it as managed from development, and import it into test and production, ideally through a pipeline. Environment variables and connection references carry the settings that differ per environment. A few items are not solution-aware and need steps after each deployment. This article follows Microsoft Learn's ALM guidance for Copilot Studio.

## Step 1: Set up the environments

Learn recommends at least three environments: development, test and production. Make the production environment a **production type** environment and the others **sandbox type**. Secure every environment with an Entra security group that limits access to its members. Changes move from development to test, bugs get fixed in development and promoted again, and only passing builds go to production.

## Step 2: Follow the ALM golden rules

From Learn:

1. Do not customize outside a development environment.
2. Always work in the context of solutions.
3. Use a custom publisher and prefix.
4. Create separate solutions only if you need to deploy components independently.
5. Use environment variables for settings and secrets that change across environments.
6. Export and deploy solutions as managed, unless you set up a development environment.
7. Consider automating ALM for source control and automated deployments.

## Step 3: Create a custom solution

An agent is created in the default solution automatically. Learn says that to export, import and manage agents between environments you need a custom solution. You need at least the **System Customizer** role, and the solution explorer inherits your security role privileges.

1. In the Copilot Studio solution explorer, create a new solution.
2. Select **Add existing** > **Agent** > **Agent**, select the agents and choose **Add**.
3. Add required components before exporting. Under **Agents**, select the three dots, then **Advanced** > **Add required objects**. Do the same for Power Automate flows.
4. Add environment variables with **Add existing** > **More** > **Environment variable**, or **Add required objects** if the solution already has some.
5. For custom connectors, import the connectors first and then the connection reference with the agent solution.

Learn warns not to remove or change unmanaged agent components directly in the solution. Make topic changes in the Copilot Studio UI, because direct changes cause export and import to fail.

## Step 4: Export and import

1. In the solution explorer, select the unmanaged solution and choose **Export solution**.
2. Complete the export following the Power Apps export steps.
3. In the target environment, open the solution explorer and select **Import solution**.
4. Complete the import following the Power Apps import steps.

If an import fails, select **Download log file** for an XML file with the details. Learn says the most common cause is a missing required component. For agents with more than 250 topics or more than 100 entities, Learn points to the standard harness export instructions.

## Step 5: Finish the deployment

Learn's steps after import:

1. Open the imported agent from the solution's **Agents** list.
2. Configure user authentication again.
3. **Publish** the agent before sharing it.
4. Allow up to 24 hours for the agent icon to appear everywhere.

The ALM guidance also lists items that are not solution-aware and need post-deployment steps: Azure Application Insights settings, manual authentication settings, Direct Line and web channel security settings, deployed channels, and sharing with makers or end users.

## Step 6: Choose the automation

Learn compares three options:

| | Azure DevOps | GitHub Actions for Power Platform | Power Platform pipelines |
|---|---|---|---|
| Best for | Enterprise teams needing full ALM control | Dev and admin teams managing many environments | Organizations empowering citizen developers |
| Setup complexity | High | Moderate | Low |

To use pipelines from Copilot Studio, open the solution explorer and select **Pipelines** under the list of solutions. Facts from the Power Platform pipelines documentation:

- The same exported solution artifact passes through the stages in order, and Learn says tampering with it is prevented.
- Deployments are prevalidated against the target environment, and missing dependencies are detected before deployment.
- Pipelines deploy connections, connection references and environment variables for the target. Service principal connections can be used for connectors that support them.
- The pipelines host should be a production environment, but it does not have to be a managed environment. Learn's licensing FAQ says the other environments used in pipelines must be enabled as managed environments, and that licenses with premium use rights are required for all managed environments. The same FAQ also says developer environments used for development and testing are not required to be managed, and its example setup lists development and QA as developer environments with no standalone license. Check your own setup against that page.
- Pipelines do not deploy to a different tenant (Learn suggests Azure DevOps or GitHub for that) and handle one solution at a time. Learn recommends always deploying managed solutions to non-development environments and says unmanaged solutions cannot be deployed. The default import behavior is Upgrade without Overwrite customizations, and advanced import options such as update versus upgrade are not currently available.
- Starting in October 2026, the admin deployment page notifies admins when pipelines deploy to unmanaged target environments, with 30 days to approve managed environments before deployments are blocked.

## Known limitations

Learn lists these for solution-based export and import:

- Comments are not exported, and some properties such as conversation ID and environment ID do not transfer.
- Custom topics and knowledge sources may be missing if stored as separate resources or Dataverse tables.
- Removing an agent from a solution does not remove its components.
- Topic names cannot contain periods, or the solution cannot be exported.

## Habits that help

- Use component collections to share topics, knowledge and actions across agents, and track versions for consistency and rollback, as Learn describes.
- Test each stage. Learn lists a testing strategy as part of ALM.
- Keep a checklist of the non-solution-aware items so each release covers them.

The pages read here do not give a full list of everything that can go into a solution or a complete connection reference walkthrough for agents. Check the Power Platform solution documentation for those.

## Related

- [Microsoft Copilot Studio](https://www.m365.fm/entity/copilot-studio/)
- [Power Platform ALM](https://www.m365.fm/entity/power-platform-alm/)
- [Power Platform pipelines](https://www.m365.fm/entity/power-platform-pipelines/)
- [Connection references](https://www.m365.fm/entity/connection-references/)

## Sources

- [Microsoft Learn: Establish an application lifecycle management strategy for Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/alm)
- [Microsoft Learn: Export and import agents using solutions](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-solutions-import-export)
- [Microsoft Learn: Create and manage solutions in Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-solutions-overview)
- [Microsoft Learn: Pipelines in Power Platform](https://learn.microsoft.com/en-us/power-platform/alm/pipelines)
