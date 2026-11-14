---
title: "How to Get Started With Planning Optimization in Dynamics 365 Supply Chain Management"
summary: "Set up Planning Optimization in Dynamics 365 Supply Chain Management: prerequisites, the configuration key, installing the add-in in Lifecycle Services, checking the connection status, and the caveats about the deprecated engine and batch jobs."
status: review
publish: false
author: mirko-p
date: 2027-01-08
topics: [planning-optimization, dynamics-365-supply-chain-management]
keypoints:
  - "Planning Optimization is the master planning engine for Supply Chain Management, provided by an external add-in. It is licensed as part of the standard licenses at no extra cost."
  - "Prerequisites: a tier 2 or higher high-availability environment, not OneBox, on version 10.0.23 or later, with Power Platform integration and an admin account with Read-Write access."
  - "Setup has three steps: enable the Planning Optimization configuration key, install the add-in in Lifecycle Services, and check Connection status under Planning Optimization parameters."
  - "Install the add-in separately on every environment where you use it. It is not supported on on-premises deployments."
  - "Planning batch jobs created for the deprecated engine fail when Use Planning Optimization is Yes."
faq:
  - q: "What is Planning Optimization?"
    a: "Per Microsoft Learn, master planning in Supply Chain Management is provided by an external service called the Planning Optimization Add-in. It is the master planning engine for Supply Chain Management."
  - q: "Does it cost extra?"
    a: "No. Learn says it is licensed as part of the standard licenses for the system and has no extra costs. To install the add-in, your Entra account must have a Supply Chain Management license."
  - q: "What are the environment requirements?"
    a: "A Lifecycle Services-enabled high-availability environment of tier 2 or higher, not OneBox, running Supply Chain Management version 10.0.23 or later, with Power Platform integration set up."
  - q: "How do I install it?"
    a: "Enable the Planning Optimization configuration key under License configuration, install the add-in on the Environment add-ins FastTab in Lifecycle Services, then check that Connection status is Connected under Planning Optimization parameters."
  - q: "What happens to old planning batch jobs?"
    a: "Learn says planning batch jobs created for the deprecated engine fail if they run while Use Planning Optimization is Yes."
---

Planning Optimization is the master planning engine for Dynamics 365 Supply Chain Management. It runs as an external add-in, so you install and connect it before it can plan. This guide follows the Microsoft Learn page on getting started with Planning Optimization. The page covers setup only. It does not describe how to run a planning job.

## What it is

Master planning in Supply Chain Management is provided by an external service called the Planning Optimization Add-in. It is licensed as part of the standard licenses for the system, with no extra costs. It is available in the Azure geographies the page lists, including the United States, Canada, Europe, the United Kingdom, Australia, Asia Pacific, Japan and India. Installing from an unsupported region shows a message that the geography is not supported. It does not support on-premises deployments.

## Prerequisites

- A Lifecycle Services-enabled high-availability environment of tier 2 or higher. It cannot be a development (OneBox) environment, and the installation there will not complete.
- Supply Chain Management version 10.0.23 or later.
- Power Platform integration set up for the system.
- A Supply Chain Management license assigned to your Microsoft Entra account.
- A Power Platform account with administrator privileges and access mode **Read-Write**. To check, open the environment in the Power Platform admin center, go to **Settings** > **Users**, select your user, open **Client Access License (CAL) information** and confirm **Access Mode**.

## Step 1: enable the configuration key

1. Turn on maintenance mode.
2. Go to **System administration** > **Setup** > **License configuration**.
3. On the **Configuration keys** tab, select **Planning Optimization**.
4. Turn off maintenance mode.

## Step 2: install the add-in

1. In Lifecycle Services, open the environment and go to **Full details**.
2. On the **Environment add-ins** FastTab, select **Install a new add-in** and then **Planning Optimization**.
3. Agree to the terms and select **Install**. Wait until the status changes from Installing to Installed.

Install the add-in separately on each environment where you use Planning Optimization, regardless of any code moved between environments.

## Step 3: check the connection

Go to **Master planning** > **Setup** > **Planning Optimization parameters** and open the **General** tab. Check **Connection status**.

| Connection status | Usable? |
| --- | --- |
| Connected | Yes |
| Enabling connection | No |
| Disconnected | No |
| Disabling connection | No |
| Getting status | No |

When the status is Connected, **Use Planning Optimization** is read-only and set to Yes.

## Where each task happens

The setup moves between three places, which is easy to miss.

- **Supply Chain Management itself** holds the configuration key under License configuration and the Planning Optimization parameters page where you read the connection status.
- **Lifecycle Services** is where you install the add-in on the environment.
- **The Power Platform admin center** is used only to check that your account has the Read-Write access mode. The page does not use it to install the add-in.

As practical advice, if the connection status is not Connected, check these three things in order: the configuration key, the add-in installation on that particular environment, and the installing account's access mode. The page does not give a troubleshooting sequence itself.

## Caveats

- In most cases Planning Optimization is the only planning engine, and you cannot turn it off. In rare cases Microsoft Support may make the deprecated engine available for specific companies.
- You can keep using the deprecated engine for previously created companies until you migrate them. The page links to instructions.
- Planning batch jobs created for the deprecated engine fail when they run while Use Planning Optimization is Yes.

## What the page does not say

- How to run master planning after setup.
- Feature-level differences between Planning Optimization and the old engine. There is a separate comparison article.
- Roles beyond the administrator account, Read-Write access and the license.
- Troubleshooting. It points to a separate article. The migration steps are also on a separate page.
- The page does not mention feature management. The configuration key sits under License configuration, and the add-in is installed from Lifecycle Services, not from the Power Platform admin center.

## A setup checklist

This list is practical advice built on the page.

1. Confirm environment tier, version and region.
2. Confirm your account's license and Read-Write access mode.
3. Enable the configuration key during a maintenance window.
4. Install the add-in and wait for Installed.
5. Check Connection status shows Connected.
6. Review old planning batch jobs before you switch.

## Typical mistakes

- Trying to install on a OneBox environment.
- Forgetting to install on each environment.
- Leaving old planning batch jobs scheduled.
- Using an account with the wrong access mode.

## Related

- [Planning Optimization](https://www.m365.fm/entity/planning-optimization/)
- [Master planning](https://www.m365.fm/entity/master-planning/)
- [Dynamics 365 Supply Chain Management](https://www.m365.fm/entity/dynamics-365-supply-chain-management/)

## Sources

- [Get started with Planning Optimization (Microsoft Learn)](https://learn.microsoft.com/dynamics365/supply-chain/master-planning/planning-optimization/get-started)
