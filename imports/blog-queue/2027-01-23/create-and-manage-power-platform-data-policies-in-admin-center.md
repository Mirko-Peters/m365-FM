---
title: "How to Create and Manage Power Platform Data Policies"
summary: "Create a tenant-level or environment-level data policy in the Power Platform admin center: classify connectors into Business, Non-business and Blocked, set the default group, choose scope and environments, then edit, delete and enforce. Permissions and a worked example from Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2027-01-23
topics: [power-platform-admin-center, power-platform]
keypoints:
  - "Data policies define which connectors can share business data in Power Apps and Power Automate. Connectors sit in Business, Non-business or Blocked, and only one group at a time."
  - "Tenant-level policies need the Power Platform Administrator role. Environment-level policies need Environment Admin, or System Administrator if the environment has a Dataverse database."
  - "Create a policy in the admin center under Security, Data and privacy, Data policy, New Policy. The steps are name, connectors, custom connectors, scope, environments and review."
  - "Learn recommends keeping the default group for new connectors as Non-business. Connectors that cannot be blocked stay in Non-business even if the default is Blocked."
  - "Environment-level policies cannot override tenant-wide policies, and environment admins cannot edit or delete policies created by the tenant admin."
faq:
  - q: "What does a data policy do?"
    a: "Microsoft Learn says you can create and enforce data policies that define the consumer connectors that specific business data can be shared with. For example, a company might not want business data stored in SharePoint published automatically to its Twitter feed. Connectors in the Business group cannot share data with connectors in other groups, and the same holds for Non-business."
  - q: "Which role do I need?"
    a: "To create, edit or delete data policies you need Environment Admin or Power Platform admin permissions. For tenant-level policies, sign in as a Power Platform Administrator. For environment-level policies you need Environment Admin permissions, or the System Administrator role for environments with a Dataverse database."
  - q: "What are the three connector groups?"
    a: "Business is for sensitive data, Non-business is for non-sensitive data and holds unassigned connectors by default, and Blocked connectors cannot be used where the policy applies. A connector can reside in only one group. Connectors that cannot be blocked stay in Non-business."
  - q: "What should the default group for new connectors be?"
    a: "Learn recommends keeping Non-business, which maps new connectors that Power Platform adds after you create the policy. You can assign them to Business or Blocked later by editing the policy. If you set Blocked, new blockable connectors are blocked, and new unblockable ones go to Non-business."
  - q: "Do changes disable existing connections?"
    a: "Learn says you can consider enforcing data policies on connections. Enforcing disables existing connections that violate any data policy and enables previously disabled connections that no longer violate any."
---

Data policies are the main guardrail in Power Platform for which connectors can be combined in Power Apps and Power Automate. This article follows the Microsoft Learn page "Manage data policies", including its worked example. The page's canonical address is `prevent-data-loss`, and it covers creating, editing and deleting policies and the default data group.

## What a data policy does

A data policy defines the connectors that business data can be shared with. Each connector sits in one of three groups:

| Group | Meaning on the page |
| --- | --- |
| Business | Connectors for sensitive data. They cannot share data with connectors in other groups |
| Non-business (default) | Connectors for non-sensitive data. They cannot share data with other groups. Unassigned connectors show here by default |
| Blocked | Cannot be used where the policy applies. Unblockable connectors stay in Non-business |

A connector can reside in only one group at a time. For connectors that cannot be blocked, such as SharePoint in the page's example, the **Block** action is not available and a warning appears.

## Permissions

- Creating, editing or deleting a policy needs Environment Admin or Power Platform admin permissions.
- **Tenant-level policies** can include or exclude specific environments. Sign in as a Power Platform Administrator.
- **Environment-level policies** need Power Apps Environment Admin. For environments with a Dataverse database, you need the System Administrator role instead.
- If you use PowerShell with the `SingleEnvironment` environment type, the account must have environment-level and must not have tenant-level permissions, otherwise a Bad Request error is returned and the policy is not created.

## The five steps

1. Name the policy.
2. Classify connectors.
3. Define the scope. This does not apply to environment-level policies.
4. Select environments.
5. Review.

## Walkthrough: a tenant-level policy

Learn's example puts SharePoint and Salesforce in Business, Facebook and Twitter in Blocked, leaves the rest in Non-business, and excludes test environments.

1. Sign in to the Power Platform admin center.
2. Select **Security**, then under Settings **Data and privacy**.
3. In **Data policy**, select **+ New Policy**.
4. Enter a policy name and select **Next**.
5. On **Pre-built connectors** you see the attributes Name, Blockable, Class (Premium or Built-in/Standard), Publisher and About. Select connectors and use **Move to Business** or the block action. The ellipsis on a row offers the same.
6. Review **Set default group** (see below).
7. On **Custom connectors**, select the custom connectors to include.
8. On **Scope**, choose the scope. In the example, **Exclude certain environments**.
9. On **Environments**, move the test environments to **Excluded from policy**. The page searches for "sandbox". With **Exclude certain environments**, the **Available** list is the set that the policy applies to.
10. On **Review**, select **Create policy**.

For an environment-level policy you can only select a single environment.

### Result in the example

| From / to | SharePoint (Business) | Salesforce (Business) | Outlook.com (Non-business) | Facebook / Twitter (Blocked) |
| --- | --- | --- | --- | --- |
| SharePoint | Allowed | Allowed | Denied | Denied |
| Salesforce | Allowed | Allowed | Denied | Denied |
| Outlook.com | Denied | Denied | Allowed | Denied |

The two Business connectors can be combined in non-test environments. Outlook.com cannot be combined with them. In the excluded test environments no policy applies, so apps and flows can use any set of connectors together. Learn says it is good practice to share the list of data policies with your organization so makers know them before they build apps.

## Default group for new connectors

**Set default group** decides where connectors that Power Platform adds after you create the policy land. Learn recommends **Non-business**. You can assign them to Business or Blocked later, after review. If the default is **Blocked**, new blockable connectors are blocked, and new unblockable connectors go to Non-business because they cannot be blocked.

To change it later, sign in as a Power Platform admin, open the policy with **Edit Policy**, go to the **Prebuilt connectors** step, select **Set default group**, choose a group and select **Apply**.

## Find, edit and delete

- **Find:** under **Data policy** the list shows Name, Scope (environment-level or tenant-level), Applied to (all environments, all except n, n environments or a single environment), Created by and on, Modified by and on. Use Search for long lists.
- **Edit:** select the policy, then **Edit Policy**, go through the same steps, and select **Update Policy**. Environment admins cannot edit policies created by the tenant admin, and environment-level policies cannot override tenant-wide policies.
- **Delete:** select the policy, **Delete Policy** and confirm. Environment admins cannot delete policies created by the tenant admin.
- **Enforce:** Learn says to consider enforcing data policies on connections. Enforcing disables existing connections that violate any data policy and enables previously disabled connections that no longer violate any.

For PowerShell, the page points to the data policy commands in its PowerShell article, and to the data policies SDK. I did not read those pages, so I list no cmdlets.

## Rollout order (my advice)

This is my suggestion, not Microsoft guidance:

1. Start with the default environment, since all makers use it, and design the Business group around the sources you must protect.
2. Keep new-connector default at Non-business, as the page recommends, and review new connectors on a schedule.
3. Before you enforce, list existing flows and apps that use mixed groups. Enforcement disables violating connections.
4. Use separate environments with a looser policy for experiments, and keep production strict.
5. Tell makers where they can read the policies, and what to do to request an exception.

## Related

- [Power Platform admin center](https://www.m365.fm/entity/power-platform-admin-center/)
- [Power Platform](https://www.m365.fm/entity/power-platform/)

## Sources

- [Manage data policies (Microsoft Learn)](https://learn.microsoft.com/power-platform/admin/prevent-data-loss)
