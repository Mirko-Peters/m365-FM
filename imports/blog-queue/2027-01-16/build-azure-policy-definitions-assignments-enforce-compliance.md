---
title: "How to Build Azure Policy Definitions and Assignments to Enforce Compliance"
summary: "Follow Microsoft Learn's Azure Policy tutorial: assign a built-in tag policy, write a custom deny definition for G series VMs, group policies into an initiative, check compliance and resolve a denied deployment with an exclusion. Includes the Learn CLI and PowerShell commands."
status: review
publish: false
author: mirko-p
date: 2027-01-16
topics: [azure-policy, azure-policy-initiative, azure-portal]
keypoints:
  - "Assign a policy in the portal through Policy, Assignments, Assign Policy, choosing scope, definition, parameters, remediation and a non-compliance message."
  - "A definition holds the condition and the effect; the tutorial writes a custom definition with a deny effect for virtual machine SKUs matching Standard_G*."
  - "An initiative groups several definitions, and the same definition can be added twice with different parameters."
  - "Assignments with modify or deployIfNotExists effects need a managed identity; the tutorial's tag policy gets a system-assigned one with the Contributor role."
  - "A denied deployment can be resolved with an exclusion on a resource group, and Learn also mentions policy exemptions."
faq:
  - q: "What is the difference between a definition and an assignment?"
    a: "Learn says a policy definition defines under what condition a policy is enforced and what effect to take. An assignment is a policy that has been assigned to take place within a specific scope."
  - q: "Can I test a policy without enforcing it?"
    a: "Learn says that when Policy enforcement is set to Disabled, the setting allows testing the outcome of the policy without triggering the effect. The tutorial leaves it Enabled."
  - q: "When does an assignment need a managed identity?"
    a: "Learn says the box must be checked when the policy or initiative includes a policy with the deployIfNotExists or modify effect. The tutorial's tag policy uses modify, so the portal checks it automatically with a system-assigned identity and the Contributor role."
  - q: "How do I find out which policy denied a deployment?"
    a: "On the resource group, select Deployments and open the failed deployment, then select the Failed link on the Deployment Overview page. Under Error Details are the GUIDs of the related policy objects. On the Policy page, the Compliance view shows the Deny count and an Events tab."
  - q: "Can I skip evaluation without an exclusion?"
    a: "Learn notes that a policy exemption can also be used to skip the evaluation of a resource, and points to its scope documentation for more."
---

To enforce compliance with Azure Policy you assign a policy definition to a scope, and for rules you need beyond the built-ins you write your own definition first. Microsoft Learn's tutorial walks through four tasks: assign a policy for resources created in the future, create and assign an initiative that tracks several policies, resolve a non-compliant or denied resource, and roll out a new policy across an organization. This guide follows that tutorial and keeps its examples.

## Step 1: assign a built-in policy

The tutorial assigns the built-in definition **Inherit a tag from the resource group if missing**. It adds a tag, with the value from the parent resource group, to new or updated resources that lack it.

1. In the Azure portal, search for and select **Policy**.
2. Select **Assignments**, then **Assign Policy** at the top of the page.
3. On the **Basics** tab, choose the **Scope** with the ellipsis. Pick a management group or subscription and optionally a resource group. Learn says exclusions start one level below the scope and are optional.
4. Open the **Policy definition** list, filter **Type** to *Built-in* if you like, and select the definition. The search term `inherit a tag` finds it.
5. The **Version** fills in with the latest major version, set to autoinjest non-breaking changes. **Overrides** are optional.
6. Keep the assignment name or change it, and add a description if you want.
7. Leave **Policy enforcement** as *Enabled*. Learn says *Disabled* tests the outcome without triggering the effect.
8. On **Parameters**, enter *Environment* as the **Tag Name**.
9. On **Remediation**, leave **Create a remediation task** unchecked. **Create a Managed Identity** is checked automatically because the definition uses the modify effect, with a system-assigned identity and the Contributor permission.
10. On **Non-compliance messages**, enter *This resource doesn't have the required tag*. Learn says it appears when a resource is denied or non-compliant during regular evaluation.
11. Select **Review + create**, then **Create**.

## Step 2: write a custom definition

The tutorial's goal is cost: block virtual machines in the G series.

1. Under **Authoring**, select **Definitions**, then **+ Policy definition**.
2. Choose the **Definition location**. Learn says that if you plan to apply the definition to several subscriptions, the location must be a management group containing them. The same is true for an initiative definition.
3. Enter the name *Require VM SKUs not in the G series*, a description and a category such as *Compute*.
4. Paste this rule and select **Save**:

```json
{
    "policyRule": {
        "if": {
            "allOf": [{
                    "field": "type",
                    "equals": "Microsoft.Compute/virtualMachines"
                },
                {
                    "field": "Microsoft.Compute/virtualMachines/sku.name",
                    "like": "Standard_G*"
                }
            ]
        },
        "then": {
            "effect": "deny"
        }
    }
}
```

Learn says the `field` value must be a supported one and points to the policy definition structure page for the list. It also points to its Azure Policy samples.

### The same from the command line

Learn shows PowerShell and Azure CLI with a Storage example. In PowerShell, `New-AzPolicyDefinition` takes a name, a description and a policy rule, either inline, from a local file or from a URL, and the result is kept in a variable for the assignment. `Get-AzPolicyDefinition` lists all definitions including built-ins. In Azure CLI the commands are:

```azurecli
az policy definition create --name 'denyCoolTiering' --description 'Deny cool access tiering for storage' --rules '<rule JSON>'
az policy definition list
```

The page also shows a REST call, a PUT to `management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.authorization/policydefinitions/{policyDefinitionName}` with an `api-version` parameter.

## Step 3: group policies in an initiative

1. Under **Authoring** select **Definitions**, then **+ Initiative Definition**.
2. Set the **Initiative location**, name it *Get Secure*, add a description and a category, and set a **Version** such as *1.0*. Learn says the version is metadata only and is not used for updates.
3. On **Policies**, add built-in definitions. The tutorial adds Allowed locations, Endpoint protection should be installed on machines, Non-internet-facing virtual machines should be protected with network security groups, Azure Backup should be enabled for Virtual Machines, Disk encryption should be applied on virtual machines, and Add or replace a tag on resources twice. Each copy gets a different reference ID.
4. Skip **Groups** and **Initiative parameters** for the tutorial. Learn warns that initiative parameters cannot be deleted once saved.
5. On **Policy parameters**, set Allowed locations to *Set value* with *East US 2*. For the two tag policies, set Tag Name to *Env* and *CostCenter* and Tag Value to *Test* and *Lab*.
6. Select **Review + create**, then **Create**.

CLI and PowerShell equivalents are `az policy set-definition create` and `New-AzPolicySetDefinition`.

To assign it, open the initiative under **Definitions** and select **Assign**. Set scope, exclusions and the assignment name, keep enforcement **Enabled**, and on **Remediation** leave **Create a Managed Identity** unchecked, since none of these policies uses deployIfNotExists or modify.

## Step 4: check compliance

Select **Compliance**, find **Get Secure** and open it. The state may show **Not started** at first and changes to **Compliant** once evaluation completes. Select any policy to see resource-level details.

## Step 5: resolve a denied resource

With the location policy assigned, a resource created elsewhere is denied. In the portal, on the target resource group, select **Deployments** and the failed deployment. The denied resource shows *Forbidden*. Select the **Failed** link on the Deployment Overview page, and under **Error Details** you find the GUIDs of the policy objects. On **Compliance**, the Deny count rises and the **Events** tab shows who tried the deployment.

The tutorial then creates a resource group named **LocationsExcluded** and adds it as an exclusion: **Assignments**, open *Get Secure*, set **Exclusion** with the ellipsis, **Add to Selected Scope**, **Save**. Exclusions can apply to a subscription, resource group or single resource. Learn notes that a policy exemption can also skip evaluation.

## Clean up

Under **Authoring**, open **Definitions** or **Assignments**, search for the item, select the ellipsis or right-click, and choose **Delete definition** or **Delete assignment**.

## My advice for real use

This section is my advice, not a Microsoft statement.

1. Try a new policy with enforcement **Disabled** and read the compliance results before you turn on a deny effect.
2. Assign at the highest scope that makes sense, and keep exclusions short and documented.
3. Put definitions in a management group if more than one subscription will use them.
4. Write a clear non-compliance message, because it is what the person with a denied deployment reads.
5. Start with a small initiative and add policies in steps.

## Related

- [Azure Policy](https://www.m365.fm/entity/azure-policy/)
- [Azure Policy initiative](https://www.m365.fm/entity/azure-policy-initiative/)
- [Azure portal](https://www.m365.fm/entity/azure-portal/)

## Sources

- [Tutorial: Build policies to enforce compliance - Azure Policy (Microsoft Learn)](https://learn.microsoft.com/azure/governance/policy/tutorials/create-and-manage)
