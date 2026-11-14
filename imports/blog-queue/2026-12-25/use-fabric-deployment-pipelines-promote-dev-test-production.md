---
title: "Use Fabric Deployment Pipelines to Promote Power BI Content From Dev to Production"
summary: "Create a Fabric deployment pipeline, assign workspaces to Development, Test and Production, deploy fully or selectively, set deployment rules for data sources and parameters, and note the documented limits and the semantic model notice."
status: review
publish: false
author: mirko-p
date: 2026-12-25
topics: [fabric-deployment-pipelines, power-bi]
keypoints:
  - "A pipeline has 2 to 10 stages, default Development, Test and Production. The stage count is fixed after creation."
  - "You must be an admin of a Fabric workspace. Each stage is assigned one Premium workspace, as the page words it."
  - "Deploy fully, selectively, or backward. Backward deployment works only if the target stage is empty. Deploying overwrites paired items."
  - "Deployment rules change data sources or parameters in the target stage. You must own the item, rules cannot be created in the development stage, and they apply at the next deployment."
  - "The overview says that from February 12, 2026, which has already passed, deployment pipelines retire support for semantic models not upgraded to Enhanced Metadata."
faq:
  - q: "How many stages can a pipeline have?"
    a: "According to Microsoft Learn, 2 to 10 stages, with a default of three: Development, Test and Production. The stage count is fixed after creation."
  - q: "What do I need to create a pipeline?"
    a: "Learn says a Fabric subscription and admin rights on a Fabric workspace. Each stage is assigned one Premium workspace, and the page links to a capacity FAQ for details."
  - q: "What happens to existing items when I deploy?"
    a: "Learn says paired items in the target stage are overwritten, and items that do not exist in the source stage remain unchanged. Unpaired items with the same name, type and folder are not overwritten. A duplicate is created and paired."
  - q: "How do I point Production at a different data source?"
    a: "Create a deployment rule in the target stage under the item, then deploy. Learn says you must own the item, and that data source rules only work when you change data sources of the same type."
  - q: "Is there a retirement notice for semantic models?"
    a: "Yes. The overview says that beginning February 12, 2026, deployment pipelines retire support for semantic models that are not upgraded to Enhanced Metadata. That date has already passed."
---

Fabric deployment pipelines let you build and test content in a development stage and promote it to test and production. You create a pipeline, assign a workspace to each stage and deploy. This guide follows Microsoft Learn's overview, the get-started article and the deployment rules article.

## How a pipeline works

The overview says you can clone content from one stage to another, typically from development to test and from test to production. You can have 2 to 10 stages. The default is three. Development is for building content, Test for testers and larger data volumes, and Production for the final version shared with business users.

Each stage is associated with a workspace. Pairing links an item in one stage with the same item in the adjacent stage. It happens when you assign a workspace or deploy new unpaired content. Paired items stay paired after renaming. Items added after workspace assignment are not paired automatically.

## Prerequisites

- A Fabric subscription. The page does not name a license tier.
- Admin rights on a Fabric workspace.
- One Premium workspace per stage, as the page words it. It links to a capacity FAQ and does not state SKU requirements.

## Create the pipeline

1. From the **Workspaces** flyout, select **Deployment pipelines**, then **Create pipeline** or **+ New pipeline**. Creating one from a workspace assigns that workspace automatically.
2. Enter a name and description, select **Next** and define the stages. Select **Create** or **Create and continue**.
3. Assign a workspace to each stage. The exact steps are in a separate article.
4. Optionally set the final stage as public. It is public by default. Use the stage settings icon and **Make this stage public**.

## Deploy

Choose one of these:

- **Full deployment:** all content to the target stage.
- **Selective deployment:** chosen items only.
- **Backward deployment:** from a later stage to an earlier one, only if the target stage is empty.

Then select **Review your deployment and leave a note**. A confirmation appears when the deployment would change items in the target stage. Paired items are overwritten, and items missing from the source stage remain unchanged. You can review deployment history and compare stage content before deploying.

## Deployment rules

Stages often use different databases or parameter values. A rule is defined in the target stage under the item, and content deployed afterwards inherits the value as long as the rule is unchanged and valid.

| Item | Data source rule | Parameter rule | Default lakehouse rule |
| --- | --- | --- | --- |
| Dataflow gen1 | Yes | Yes | No |
| Semantic model | Yes | Yes | No |
| Paginated report | Yes | No | No |
| Mirrored database | Yes | No | No |
| Notebook | No | No | Yes |

To add a rule in the new UI, select **Deployment rules** in the stage, find the item, select the rule type and select **Add rule**. You must own the item.

### Rule limitations

- Rules cannot be created in the development stage.
- Data source rules only work when you change data sources of the same type.
- Rules apply only at the next deployment to that stage.
- Deleting an item deletes its rules. Unassigning and reassigning a workspace loses that workspace's rules.
- If a source or parameter used by a rule changes or is removed in the source stage, the rule becomes invalid and deployment fails.

## Folders and automation

The overview says the folder hierarchy is applied to the target stage. In folder view you can select only items at the same folder level, and the flat list view lets you select items across folders. You can also deploy programmatically with the Power BI or Fabric deployment pipelines REST APIs, which the page links to without giving endpoints.

## Notices and gaps

Beginning February 12, 2026, deployment pipelines retire support for semantic models that are not upgraded to Enhanced Metadata. That date has already passed, so check your semantic models. The new pipeline UI and some items are in preview. The pages I read do not state deploy-specific permissions, exact license tiers or what first deployment to an empty stage creates, and they link to other articles for those.

## Related

- [Fabric deployment pipelines](https://www.m365.fm/entity/fabric-deployment-pipelines/)
- [Power BI](https://www.m365.fm/entity/power-bi/)

## Sources

- [Overview of Fabric deployment pipelines (Microsoft Learn)](https://learn.microsoft.com/fabric/cicd/deployment-pipelines/intro-to-deployment-pipelines)
- [Get started using deployment pipelines, the Fabric Application lifecycle management (ALM) tool (Microsoft Learn)](https://learn.microsoft.com/fabric/cicd/deployment-pipelines/get-started-with-deployment-pipelines)
- [Create deployment rules for Fabric's ALM (Microsoft Learn)](https://learn.microsoft.com/fabric/cicd/deployment-pipelines/create-rules)
