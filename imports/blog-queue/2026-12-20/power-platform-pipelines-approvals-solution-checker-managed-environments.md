---
title: "Power Platform Pipelines: Add Approval Gates and Solution Checker Enforcement in Managed Environments"
summary: "How to combine pipeline gated extensions and delegated deployment approvals with solution checker enforcement (None, Warn, Block) in managed environments, with the steps, limits and gaps Microsoft Learn documents."
status: review
publish: false
author: mirko-p
date: 2026-12-20
topics: [power-platform-pipelines, power-platform-alm, power-platform-environment]
keypoints:
  - "Pipelines have three gated extensions: Pre-export Step Required, Is Delegated Deployment and Pre-deployment Step Required. Each adds a pending step that your flow must complete or reject."
  - "Solution checker enforcement is a managed environment setting with three levels: None, Warn and Block. Only highly critical issues block an import in Block mode."
  - "Learn says all environments used in pipelines other than the host and developer environments must be managed environments, and personal pipelines created in Power Apps cannot be extended."
  - "The pages read do not say that a pipeline step runs solution checker for you. Enforcement happens at solution import in the managed target environment."
  - "Rule exclusions and a suppress-emails option exist for solution checker enforcement, and PowerShell can set the level per environment."
faq:
  - q: "What are the approval options in Power Platform pipelines?"
    a: "Learn lists three gated extensions: Pre-export Step Required, Is Delegated Deployment and Pre-deployment Step Required. Is Delegated Deployment requires approval from an authorized identity and deploys with a service principal or the pipeline stage owner identity."
  - q: "How does a cloud flow complete or reject a pipeline step?"
    a: "According to Learn, the flow uses Perform an unbound action with the action for the extension. For the status parameters, 10 is the pending status set by the system, 20 completes the step and 30 rejects it, which sets the deployment to failed."
  - q: "What do the solution checker enforcement levels do?"
    a: "Learn says None turns off automatic validation. Warn verifies custom solutions during import and continues the import even for highly critical issues, with a message and an email. Block cancels the import before any change is made when a solution has highly critical issues."
  - q: "Does solution checker enforcement work in Administration mode?"
    a: "No. A note on the Learn page says solution checker enforcement is not available when the environment is in Administration mode."
  - q: "Do the target environments of a pipeline have to be managed environments?"
    a: "Learn says the host and developer environments do not have to be managed, but all other environments used in pipelines must be enabled as managed environments. Starting in October 2026, the admin deployment page notifies admins about deployments to unmanaged targets."
---

Power Platform pipelines and solution checker enforcement control two different moments in a deployment. Pipeline gated extensions control whether a deployment request moves forward, and Power Automate flows can approve or reject each step. Solution checker enforcement in a managed environment controls whether a solution with highly critical issues can be imported at all. Microsoft Learn documents both. It does not document one combined switch, so the two are configured separately and used together.

## What each control does

| Control | Where it acts | Configured in |
|---|---|---|
| Gated extensions | Custom steps inside the pipeline deployment progression | The pipeline stage settings and Power Automate cloud flows in the pipelines host |
| Solution checker enforcement | Solution import into a managed environment | Power Platform admin center, managed environment settings |

Learn describes pipelines as a way for admins to put safeguards around solution deployment. Solutions are exported when a deployment request is submitted, the exported artifacts are stored in the host, and the same artifact is deployed through the stages in order. Learn states that this prevents customization from bypassing QA environments or approval processes.

## Approval gates with gated extensions

Learn lists three gated extensions. Each inserts a custom step at a different point, and they can be used alone or together:

- **Pre-export Step Required** runs custom validation logic when a deployment request is submitted. Pipelines does not export the solution from the development environment until the step is completed. Learn says to enable it only for the first stage in a pipeline.
- **Is Delegated Deployment** carries out the deployment with a service principal or the pipeline stage owner's identity instead of the requesting maker's. Makers can then request deployments without elevated access in target environments. It requires approval from an authorized identity.
- **Pre-deployment Step Required** inserts a custom step after a deployment is approved, for example a final approval.

Steps stay pending until your logic signals the pipelines host to complete or reject them. Makers can see that a deployment is pending and can cancel the request up to the final step.

### Build the flow

The triggers are available in cloud flows in the pipelines host environment, under the Dataverse connector trigger **When an action is performed**. Learn gives these settings: **Catalog** is Microsoft Dataverse Common, **Category** is Power Platform Pipelines, and **Table name** is (None). The **Action name** is one of OnDeploymentRequested, OnApprovalStarted, OnApprovalCompleted, OnPreDeploymentStarted, OnPreDeploymentCompleted, OnDeploymentStarted or OnDeploymentCompleted. Approval and pre-deployment events trigger only when the corresponding extension is enabled. OnDeploymentRequested triggers for all deployments.

To finish a step, the flow uses **Perform an unbound action**. Learn names UpdatePreExportStepStatus for the pre-export step and UpdatePreDeploymentStepStatus for the pre-deployment step. For the status values, 10 is pending, 20 completes the step and 30 rejects it. A rejected step stops the deployment and sets it to failed. You can add comments that makers see in run history.

To keep flow runs low and limit logic to one pipeline or stage, Learn recommends trigger conditions. It shows expressions that compare DeploymentPipelineName or DeploymentStageName, for example with `equals` for one stage or `contains` for stages whose name includes QA.

Learn also points to two sample solutions: pipelines extensibility samples and delegated deployment samples.

### Limits to know

- New pipelines extensions roll out gradually across regions and might not be available yet.
- Existing pipelines customers may need to update the Power Platform pipelines application.
- Personal pipelines created within Power Apps cannot be extended.

## Solution checker gates in a managed environment

Learn describes solution checker as a static analysis of solution objects against best practice rules. For managed environments, admins can enforce it at import.

| Setting | Behavior according to Learn |
|---|---|
| None | No automatic validation at import. |
| Warn | Custom solutions are verified during import. Highly critical issues produce a warning, the import continues, a message is shown afterward and a summary email is sent. |
| Block | Custom solutions are verified. With highly critical issues, the import is canceled before the actual import, so the environment does not change. A message and a summary email follow. |

To turn it on:

1. Sign in to the Power Platform admin center.
2. Select **Manage** > **Environments**.
3. Select a managed environment.
4. On the command bar, select **Edit Managed Environments** and choose the setting under **Solution checker enforcement**.

Further options on the same page:

- **Excluded Rules** lets you exclude rules from enforcement. Only critical severity rules block a solution.
- Emails go to users with the Power Platform administrator and Dynamics 365 service administrator roles and to weekly digest recipients. By default, emails are sent for medium and above severities. A checkbox suppresses emails in warn mode, and in block mode except for critical violations.
- PowerShell: `SetManagedEnvironmentSolutionCheckerEnforcementLevel` with `-Level block`, `warn` or `none`, and `-RuleExclusions`. The functions come from the PowerApps-Samples repository.
- Enforcement is not available in Administration mode.

## Managed environment requirements for pipelines

The pipelines FAQ says developer environments and the host do not have to be managed. All other environments used in pipelines must be managed environments, and licenses with premium use rights are required for managed environments. Tenant admins can automatically convert pipeline target environments to managed environments through **Deployments** > **Settings** in the admin center. Learn also notes a change starting in October 2026: admins get a notification about deployments to unmanaged targets, and after the approval window, future deployments to that target are blocked.

## How to combine them (author's suggestion)

The following is an interpretation, not a documented procedure:

1. Set the production target environment to **Block** so that highly critical issues cannot be imported there. Consider **Warn** in earlier stages.
2. Use a pre-deployment or delegated approval for the production stage.
3. Keep trigger conditions specific to the stage so flows do not run for every deployment.

## What the documentation does not say

The pages read do not say that a pipeline step runs solution checker, and they do not describe how a Block result appears in pipeline run history. They also do not describe an extension point tied to solution checker results. If you need a check before export, build it as your own logic in the Pre-export step and verify the behavior in a test pipeline.

## Related

- [Power Platform pipelines](https://www.m365.fm/entity/power-platform-pipelines/)
- [Power Platform ALM](https://www.m365.fm/entity/power-platform-alm/)
- [Power Platform environment](https://www.m365.fm/entity/power-platform-environment/)

## Sources

- [Extend pipelines in Power Platform (Microsoft Learn)](https://learn.microsoft.com/en-us/power-platform/alm/extend-pipelines)
- [Overview of pipelines in Power Platform (Microsoft Learn)](https://learn.microsoft.com/en-us/power-platform/alm/pipelines)
- [Solution checker enforcement in managed environments (Microsoft Learn)](https://learn.microsoft.com/en-us/power-platform/admin/managed-environment-solution-checker)
- [Set up pipelines in Power Platform (Microsoft Learn)](https://learn.microsoft.com/en-us/power-platform/alm/set-up-pipelines)
