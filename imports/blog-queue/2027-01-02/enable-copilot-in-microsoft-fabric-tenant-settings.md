---
title: "Enable Copilot in Microsoft Fabric: Tenant Settings, Capacity and Workspace Steps"
summary: "How to enable Copilot in Microsoft Fabric: capacity prerequisites, the four tenant settings, delegated capacity settings, workspace assignment and Power BI Desktop, per Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2027-01-02
topics: [copilot-in-fabric, fabric-tenant-settings]
keypoints:
  - "Copilot needs a paid Fabric capacity (F2 or higher) or a Power BI Premium capacity (P1 or higher) in a supported region."
  - "Learn says Copilot is enabled by default for tenants with paid Fabric capacities, but you should verify the tenant and capacity settings."
  - "Four tenant settings relate to Copilot: two for Azure OpenAI and two for OpenAI as a Microsoft subprocessor, each with a data-processing setting."
  - "You cannot enable individual Copilot experiences. You control Copilot only at the workload level."
  - "Pro and PPU workspaces do not directly support Copilot unless a Fabric Copilot capacity is enabled and assigned to the workspace."
faq:
  - q: "Which capacity do I need for Copilot in Fabric?"
    a: "According to Microsoft Learn, a paid Fabric capacity (F2 or higher) or a Power BI Premium capacity (P1 or higher), in a supported region. Pro and PPU workspaces do not directly support Copilot."
  - q: "Where do I turn Copilot on?"
    a: "Microsoft Learn says to sign in to the Fabric admin portal, select Tenant settings and enable the Copilot settings. You can apply each setting to specific security groups instead of the whole organization."
  - q: "Can I enable only some Copilot experiences?"
    a: "No. Learn says you cannot enable only specific Copilot experiences, such as Copilot in the DAX query view. You control whether Copilot is enabled at the workload level."
  - q: "Do I need to enable Fabric to use Copilot in Power BI?"
    a: "Learn says you do not need to enable Fabric to use Copilot in Power BI. You can enable Copilot for the Power BI workload without the other Fabric workloads, for example with a P SKU."
  - q: "Why does Copilot not work in Power BI Desktop?"
    a: "Per Microsoft Learn, Power BI Desktop must connect to a workspace assigned to a Copilot-enabled Fabric capacity. Select such a workspace as your active workspace. Usage counts against that capacity."
---

To enable Copilot in Microsoft Fabric, you need a paid Fabric capacity (F2 or higher) or a Power BI Premium capacity (P1 or higher), you enable the Copilot tenant settings in the Fabric admin portal, you enable them again at capacity level if they are delegated, and you assign workspaces to a Copilot-enabled capacity. This guide follows Microsoft Learn.

## What Microsoft says about the default

Learn says Copilot in Fabric is an AI assistant that helps transform data, generate insights and create visualizations across Fabric and Power BI. It also says Copilot is enabled by default for tenants with paid Fabric capacities (F2 or higher). Even so, you need to verify tenant settings, manage capacity-level options and control which users and workspaces have access.

Learn warns that enabling Copilot for the whole tenant without planning can lead to higher capacity utilization and other risks. It suggests enabling it for specific security groups and workspaces after you prepare.

## Prerequisites

- A paid Fabric capacity (F2 or higher) or a Power BI Premium capacity (P1 or higher).
- A capacity in a supported region.
- One or more security groups to scope who can use Copilot. You can create and manage them in the Microsoft 365 admin center.

Pro and PPU workspaces do not directly support Copilot. To use Copilot there, enable a Fabric Copilot capacity and assign the workspace to it.

You do not need to enable Fabric to use Copilot in Power BI. Learn says you can enable Copilot for the Power BI workload alone, for instance with a P SKU.

## The four steps

| Step | Where | Purpose |
| --- | --- | --- |
| 1. Enable Copilot tenant settings | Fabric admin portal, Tenant settings | Enable the settings and scope them to security groups |
| 2. Configure delegated capacity settings | OneLake catalog, Govern | Needed only if settings are delegated to capacity admins |
| 3. Assign workspaces and provision access | Workspace settings | Put the workspace on a Copilot-enabled capacity and grant roles |
| 4. Enable Copilot in Power BI Desktop | Power BI Desktop | Optional, select a Copilot-enabled workspace |

## Step 1: Enable the tenant settings

1. Sign in to the Fabric admin portal.
2. Select **Tenant settings**.
3. Enable these four settings:
   - **Users can use Copilot and other features powered by Azure OpenAI**
   - **Data sent to Azure OpenAI can be processed outside your capacity's geographic region, compliance boundary, or national cloud instance**
   - **Users can use Copilot, AI Agents, and other AI experiences powered by OpenAI as a Microsoft subprocessor**
   - **Data sent to OpenAI as a Microsoft subprocessor can be processed outside your capacity's geographic region, compliance boundary, or national cloud instance**
4. Optionally apply each setting to specific security groups rather than the entire organization.

Learn adds that you cannot enable only specific Copilot experiences, such as Copilot in the DAX query view of Power BI semantic models. Control is at the workload level.

The two data-processing settings matter for compliance. They allow data to be processed outside the capacity's geographic region, compliance boundary or national cloud. My advice: check them against your data residency requirements before enabling. Learn points to separate pages for the Copilot tenant settings and for OpenAI as a subprocessor in Fabric.

## Step 2: Delegated capacity settings

If the Copilot tenant settings are delegated to capacity administrators, each capacity admin must also enable Copilot for their capacity:

1. In **OneLake catalog** > **Govern** > **Capacities**, open the Fabric capacity you plan to use.
2. In the delegated tenant settings, enable the same four settings as above.
3. Optionally apply each setting to specific security groups.

Learn says each capacity administrator must also enable Copilot for their capacity when the settings are delegated, so this step matters on delegated capacities.

## Step 3: Assign workspaces and grant access

Fabric items that use Copilot must be in a workspace assigned to a supported capacity. Assign the workspace to a capacity that has Copilot enabled, then grant workspace roles to the users who need Copilot. Learn says items using Copilot must be in this workspace, but they might consume or refer to items in other workspaces or capacities.

## Step 4: Power BI Desktop

1. Open Power BI Desktop.
2. Select a workspace that has Copilot enabled as your active workspace.

Copilot usage in Power BI Desktop counts against the Fabric capacity assigned to the selected workspace.

## Checks when Copilot does not appear (my advice)

Work through the list in the order of the steps:

1. Is the capacity F2 or higher, or P1 or higher, and in a supported region?
2. Are all four tenant settings on, and does the user belong to the security group they are scoped to?
3. Are the settings delegated? If so, are they on for the specific capacity?
4. Is the workspace assigned to that capacity, and does the user hold a role in it?
5. In Power BI Desktop, is a Copilot-enabled workspace the active workspace?

The Learn page does not list error messages or a fixed delay for settings to take effect, so this list only follows the documented setup order.

## Plan the rollout (my advice)

Because Copilot usage consumes capacity, use security groups to start with a pilot. Learn names training as one example of a prerequisite you might require before adding people to the group. Widen the group once you have seen the effect on capacity utilization.

## Related

- [Copilot in Fabric](https://www.m365.fm/entity/copilot-in-fabric/)
- [Fabric tenant settings](https://www.m365.fm/entity/fabric-tenant-settings/)
- [Fabric workspace](https://www.m365.fm/entity/fabric-workspace/)

## Sources

- [Enable and configure Copilot in Microsoft Fabric (Microsoft Learn)](https://learn.microsoft.com/fabric/fundamentals/copilot-enable-fabric)
