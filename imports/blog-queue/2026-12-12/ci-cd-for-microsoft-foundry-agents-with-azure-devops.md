---
title: "CI/CD for Microsoft Foundry Agents With Azure DevOps: Pipeline, Evaluation Gate and Promotion"
summary: "How to structure a CI/CD pipeline for Microsoft Foundry agents in Azure DevOps: separate projects per stage, the AIAgentEvaluation task, evaluation gates, approvals, authentication and rollback by version."
status: review
publish: false
author: mirko-p
date: 2026-12-12
topics: [microsoft-foundry, foundry-agent-service, azure-devops, ai-agent]
keypoints:
  - "Microsoft's evaluation extension for Azure DevOps runs the AIAgentEvaluation@2 task against agents listed as agent-name:version. It is in preview."
  - "A Microsoft Tech Community article treats the agent version as the deployment unit and recommends separate Foundry projects for Dev, Test and Prod."
  - "Use an Azure Resource Manager service connection with Microsoft Entra ID. Microsoft's guidance prefers OIDC or workload identity over stored secrets."
  - "Gate each promotion on evaluation results and require human approval before production through an Azure DevOps environment."
  - "Roll back by switching the active version to the last known good one rather than redeploying."
faq:
  - q: "Which Azure DevOps task evaluates a Foundry agent?"
    a: "Microsoft Learn describes the AI Agent Evaluation extension, whose AIAgentEvaluation@2 task invokes your agents with the queries in a dataset, evaluates the responses and produces a summary report. The page marks the feature as preview, without an SLA, and not recommended for production workloads."
  - q: "How do I identify the agent to test?"
    a: "The task takes agent-ids in the agent-name:version format, comma-separated, for example my-agent:1,my-agent:2. Microsoft Learn says to copy the Agent ID from the details pane of the agent in the Foundry portal."
  - q: "Should each environment have its own Foundry project?"
    a: "Microsoft's training module says each environment requires its own Microsoft Foundry project, agent deployments and connected resources. The Tech Community article recommends separate projects for Dev, Test and Prod, and accepts one project with version tags only for small teams or prototypes."
  - q: "Does Microsoft Learn document a full Azure DevOps deployment pipeline for agents?"
    a: "The Learn page read covers evaluation in Azure DevOps. The deployment and promotion stages come from a Tech Community article and a GitHub Actions training module, so adapt them to Azure DevOps and verify against current documentation."
---

A CI/CD pipeline for Microsoft Foundry agents builds or validates the agent, runs an evaluation gate, deploys a new agent version to a development project, and promotes the same version through test to production with approvals. The Learn pages read document the Azure DevOps evaluation task directly. The surrounding pipeline design comes from a Microsoft Tech Community article and a training module that uses GitHub Actions, so those parts need adapting to Azure DevOps.

## What a Foundry agent release consists of

The Tech Community article describes the deployment unit as the agent version, an immutable artefact that bundles the model selection, system instructions, tool definitions and configuration. Promotion happens per agent version, and release gates depend on evaluation results. For hosted agents the container image is tagged with the commit SHA.

The article's CI stage builds a Docker image for hosted agents, or validates YAML for prompt-based agents. It runs static checks and tests, then an evaluation gate that fails the pipeline when thresholds are missed. Continuous delivery then deploys to Dev, promotes to Test with scenario tests, human validation and safety evaluation, and promotes to Production after required reviewers approve.

## One Foundry project per environment

Microsoft's multi-environment training unit says each environment needs its own Foundry project, agent deployments and connected resources. Its table gives a model: development for experimentation with synthetic data, staging for production-like validation, and production for live data. The Tech Community article agrees and recommends separate projects for production, with Dev developers limited to Dev, and the CI/CD identity alone allowed to promote to Test and Production.

Keep environment differences in configuration, not code. The training unit shows model choice passed as configuration, with a smaller model in dev and a different one in staging and production. It also says never to share Key Vaults across environments.

## Authentication from Azure DevOps

Microsoft Learn's evaluation page recommends Microsoft Entra ID through an Azure Resource Manager service connection. Create the service connection in the Azure DevOps project, then call `AzureCLI@2` before the evaluation task. The page does not cover whether to use workload identity federation or a service principal, or which roles to assign on the Foundry project. The Tech Community article says its pipelines use OIDC or workload identity federation, with no long-lived credentials in pipeline secrets, and gives each environment its own variable group. The training unit's own sample stores a service principal secret, but its architecture section calls for OIDC without stored credentials. Prefer the latter.

## Add the evaluation gate

Install the AI Agent Evaluation extension from the Visual Studio Marketplace into your organization. You also need a Foundry project and an agent. The task inputs are:

| Input | Required | Meaning |
|---|---|---|
| `azure-ai-project-endpoint` | Yes | Project endpoint from the **Overview** page in the Foundry portal |
| `deployment-name` | Yes | Model deployment used for evaluation |
| `data-path` | Yes | Path to the dataset JSON file |
| `agent-ids` | Yes | Agents as `agent-name:version`, comma-separated |
| `baseline-agent-id` | No | Baseline for comparison. The first agent is used if omitted |

The dataset file has a `name`, an `evaluators` list taken from the evaluator catalog (for example `builtin.fluency`, `builtin.task_adherence`) and a `data` array of queries with optional `ground_truth` and `context`. A minimal pipeline looks like this:

```yaml
steps:
  - task: AzureCLI@2
    displayName: "Azure login"
    inputs:
      azureSubscription: "<arm-service-connection>"
      scriptType: "bash"
      scriptLocation: "inlineScript"
      inlineScript: "az account show"
  - task: AIAgentEvaluation@2
    displayName: "Evaluate AI Agents"
    inputs:
      azure-ai-project-endpoint: "$(AzureAIProjectEndpoint)"
      deployment-name: "$(DeploymentName)"
      data-path: "$(System.DefaultWorkingDirectory)/evals/dataset.json"
      agent-ids: "$(AgentIds)"
```

The `AzureCLI@2` wrapper is an illustration. Microsoft names the task order but does not show it. Results appear in the pipeline summary with scores per metric, confidence intervals and, when you compare several agents, a pairwise statistical comparison. Microsoft's task page does not describe how to fail the build on a threshold, so check the task options and the evaluator parameters in the dataset for thresholds.

## Deploy and promote

For the deploy step, the Tech Community article uses the `azure-ai-projects` Python SDK to create an agent version with the model, name, instructions, tools and metadata such as the git SHA and environment. It runs deploy and promote scripts and states that its Azure DevOps pipeline uses Azure DevOps Environments with required approvers and per-environment variable groups. The article does not show the scripts, so you must write them against the current SDK.

For approvals, the training unit explains the principle with GitHub Environments: the pipeline pauses at the production environment until reviewers approve. In Azure DevOps, the equivalent is an environment with approvals. Reviewers should check that staging passed, evaluation metrics are acceptable and timing suits customers.

The training unit also points out a trap. Its sample deploys an image tagged `latest`, which is mutable and breaks reproducible promotion. Pin the image or version to the same tag that was tested.

## Roll back

Per the Tech Community article, roll back by switching the active version pointer to the previous known-good version, which avoids a redeployment. The training unit says automated rollback is covered in a later unit that was not read here.

## Keep the evaluation set healthy

The Tech Community article advises treating the golden evaluation set as a first-class engineering artefact, because stale datasets give misleading results. Production thresholds should be stricter than CI thresholds, and every promotion should be gated on quality, safety and performance.

## What the sources do not settle

- The Azure DevOps evaluation feature is preview.
- Learn does not document role assignments for the pipeline identity on a Foundry project in the page read.
- A complete Azure DevOps YAML for deploy and promote is not provided on the pages read.

## Related

- [Microsoft Foundry](https://www.m365.fm/entity/microsoft-foundry/)
- [Foundry Agent Service](https://www.m365.fm/entity/foundry-agent-service/)
- [Azure DevOps](https://www.m365.fm/entity/azure-devops/)
- [AI agent](https://www.m365.fm/entity/ai-agent/)

## Sources

- [Microsoft Learn: Run Foundry agent evaluations in Azure DevOps](https://learn.microsoft.com/en-us/azure/foundry/how-to/evaluation-azure-devops)
- [Microsoft Learn: Configure multi-environment agent deployment strategies](https://learn.microsoft.com/en-us/training/modules/aaai-implement-cicd-multi-agent-systems-github-actions/4-configure-multi-environment-agent-strategies)
- [Microsoft Tech Community: CI/CD for AI agents on Microsoft Foundry](https://techcommunity.microsoft.com/blog/educatordeveloperblog/cicd-for-ai-agents-on-microsoft-foundry/4522218)
