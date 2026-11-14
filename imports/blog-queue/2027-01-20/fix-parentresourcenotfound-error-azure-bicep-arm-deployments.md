---
title: "Fix ParentResourceNotFound Errors in Azure Deployments (Bicep and ARM)"
summary: "ParentResourceNotFound means a child resource was deployed before its parent could be found. Causes and fixes from Microsoft Learn for Bicep and ARM templates: dependencies, the existing keyword, naming format and resource groups."
status: review
publish: false
author: mirko-p
date: 2027-01-20
topics: [azure-resource-manager, bicep, arm-template]
keypoints:
  - "ParentResourceNotFound appears when a child resource is deployed and Resource Manager cannot find or associate the parent resource."
  - "The child name must follow the pattern parent-name/child-name, and the parent must exist before the child is created."
  - "Same template: create a dependency, in Bicep by nesting the child or using the parent property, in ARM templates with dependsOn."
  - "Parent in another template: do not set a dependency. Deploy the child to the same resource group and reference the parent with the existing keyword."
  - "A child in a different resource group than its parent, or a wrongly formatted name, also triggers the error."
faq:
  - q: "What does ParentResourceNotFound mean?"
    a: "According to Microsoft Learn, it appears when you deploy a resource that is a child of another resource and the parent cannot be found. The documented message reads: Can not perform requested operation on nested resource. Parent resource 'exampleserver' not found. The parent must exist before the child resource is created."
  - q: "How do I fix it when parent and child are in the same template?"
    a: "Learn says to use a dependency. In Bicep, nesting the child inside the parent creates the dependency, and the child takes its type and API version from the parent. In an ARM template, add a dependsOn entry on the parent resource."
  - q: "How do I fix it when the parent was deployed in a different template?"
    a: "Learn says not to set a dependency. Deploy the child to the same resource group and provide the parent's name. In Bicep, declare the parent with the existing keyword and set the parent property on the child. In JSON, build the child name from the parent name and the child name."
  - q: "Why does a correctly deployed parent still produce the error?"
    a: "Learn lists two causes when the parent already exists and is not part of the template: the child resource name is not in the right format, or the child is deployed to a different resource group than the parent."
  - q: "Is it fine to write the full child name in Bicep?"
    a: "It works if you also set a dependency explicitly, but the Bicep child resources page says setting the full resource name and type is not the recommended approach because it is less type safe than the nested or parent property approaches."
---

ParentResourceNotFound means Azure Resource Manager could not find, or could not associate, the parent of a child resource you are deploying. It happens in Bicep files and ARM templates. The fix depends on where the parent lives: in the same template you need a dependency, and in a different template you reference the existing parent in the same resource group.

## What the error looks like

Microsoft Learn documents this output:

```
Code=ParentResourceNotFound,
Message=Can not perform requested operation on nested resource. Parent resource 'exampleserver' not found.
```

The page's example is a SQL database that is a child of a SQL server, but the same logic applies to any child resource.

## Why it happens

Learn explains the rule first: when one resource is a child of another, the parent must exist before the child is created. The child name defines the connection to the parent. The full name uses the format `<parent-resource-name>/<child-resource-name>`.

Two situations produce the error:

1. **Parent and child are in the same template without a dependency.** The database deployment can start before the server has deployed, and then fails.
2. **The parent already exists and is not in the template.** Resource Manager cannot associate the child with a parent. Learn gives two reasons: the child name is not in the correct format, or the child is deployed to a resource group that is different from the parent's resource group.

## How child names and types are built

The Bicep child resources page gives the patterns. The full name is `{parent-resource-name}/{child-resource-name}`, and with more than two levels you keep repeating parent names. The full type is `{resource-provider-namespace}/{parent-resource-type}/{child-resource-type}`, repeating parent types the same way. Counting the segments between slashes, the type always has one segment more than the name. This is a quick check for a malformed child declaration.

## Solution 1: parent and child in the same template

Create a dependency so Resource Manager deploys the parent first.

**Bicep.** Nest the child inside the parent. Learn says that this creates the dependency and the child gets its resource type and API version from the parent:

```bicep
resource sqlServer 'Microsoft.Sql/servers@2022-02-01-preview' = {
  name: sqlServerName
  properties: {
    ...
  }
  resource sqlDatabase 'databases' = {
    name: databaseName
    ...
  }
}
```

Inside the parent, type and name are single segments without slashes. A nested declaration must sit at the top level of the parent resource syntax. The full types stay the same, and you do not repeat the parent name or type.

**ARM template (JSON).** Use `dependsOn` on the child:

```json
"dependsOn": [
  "[variables('sqlServerName')]"
]
```

## Solution 2: parent deployed in a different template

Do not set a dependency. Deploy the child to the same resource group and provide the name of the parent.

**Bicep.** Use the `existing` keyword to reference the parent that was deployed in a separate file. The child uses the `parent` element with the parent's symbolic name:

```bicep
resource sqlServer 'Microsoft.Sql/servers@2022-02-01-preview' existing = {
  name: sqlServerName
}

resource sqlDatabase 'Microsoft.Sql/servers/databases@2022-02-01-preview' = {
  parent: sqlServer
  name: databaseName
  location: location
}
```

**ARM template (JSON).** The `name` element combines parent and child names, for example with `concat(parameters('sqlServerName'), '/', parameters('databaseName'))`, and the resource type is the full child type.

Because the parent is in the same resource group by requirement, a deployment scoped to a different group will keep failing until you fix the scope.

## Bicep options at a glance

| Declaration style | Name you write | Dependency |
| --- | --- | --- |
| Nested inside the parent | Child name only | Inferred |
| Outside the parent with `parent` property | Child name only, full type with slashes | Inferred |
| Full name outside the parent | Full name such as `examplestorage/default` | You must set `dependsOn` |

The Bicep page says you might declare the child outside the parent when the parent is not deployed in the same template, or when you want to use a loop to create several child resources. To reference a nested child from outside the parent, qualify it with the parent's symbolic name and the `::` operator. The same page says a parent may not access properties of the resources nested inside it, because this would cause a cyclic dependency.

## Checklist for a failing deployment (my advice)

This order is my suggestion, not a Microsoft procedure:

1. Read the parent name in the error message and check whether that exact resource exists in the target resource group.
2. If the parent is in the same file, confirm the child either nests inside it or has a dependency.
3. If the parent comes from another deployment, confirm the target resource group and that the child name matches the pattern.
4. Count slashes in the type and name of the child. The type should have one more segment.
5. Prefer the `parent` property or nesting over writing full names by hand, as the Bicep page recommends.

## What the Learn page does not cover

The troubleshooting page is short. It does not describe hierarchies deeper than one parent and child, or other tools such as what-if previews, so I do not make claims about them here. The Bicep page refers to a linter rule named use-parent-property for the discouraged full-name style.

## Related

- [Azure Resource Manager](https://www.m365.fm/entity/azure-resource-manager/)
- [Bicep](https://www.m365.fm/entity/bicep/)
- [ARM template](https://www.m365.fm/entity/arm-template/)

## Sources

- [Parent resource errors (Microsoft Learn)](https://learn.microsoft.com/azure/azure-resource-manager/troubleshooting/error-parent-resource)
- [Child resources in Bicep (Microsoft Learn)](https://learn.microsoft.com/azure/azure-resource-manager/bicep/child-resource-name-type)
