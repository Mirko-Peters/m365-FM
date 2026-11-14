---
title: "Bicep vs ARM JSON Templates: Syntax Compared and When to Switch"
summary: "Compare Bicep and ARM JSON side by side using Learn's examples: parameters, variables, strings, conditions, resources, loops, dependencies, references, outputs and modules. Includes what Learn says about Bicep's benefits and how to decompile an existing template."
status: review
publish: false
author: mirko-p
date: 2027-01-17
topics: [bicep, arm-template, azure-resource-manager]
keypoints:
  - "Learn says Bicep syntax is less verbose than the equivalent JSON in most cases, and its side-by-side example is about half the size."
  - "Bicep needs no bracketed expressions, uses symbolic names, and creates implicit dependencies when one resource references another."
  - "A Bicep ternary is the equivalent of the JSON if function, not of the condition property, so outputs can differ when a condition is false."
  - "Bicep modules replace linked templates for splitting a solution into several files."
  - "az bicep decompile converts JSON to Bicep on a best-effort basis; Learn warns there is no guaranteed mapping and fixes may be needed."
faq:
  - q: "Is Bicep a different deployment engine?"
    a: "Per Learn, Bicep is a transparent abstraction over a Resource Manager JSON template that does not lose its capabilities. During deployment the Bicep CLI converts a Bicep file into a Resource Manager JSON template."
  - q: "Can Bicep use the newest resource types and API versions?"
    a: "Learn says Bicep immediately supports all preview and GA versions for Azure services. As soon as a resource provider introduces new types and API versions, you can use them in a Bicep file."
  - q: "How do I convert an existing ARM template?"
    a: "Run az bicep decompile with the JSON file name. It creates a .bicep file in the same directory, and you may need to fix warnings and errors. Learn says there is no guaranteed mapping from JSON to Bicep."
  - q: "Do I still write dependsOn?"
    a: "Usually not. Learn says Bicep manages dependencies when one resource declaration references another by its symbolic name, and an explicit dependsOn is not recommended."
  - q: "Where can I see both syntaxes together?"
    a: "The Bicep Playground shows Bicep and equivalent JSON side by side, and it has a Decompile option for your own ARM template."
---

Bicep and ARM JSON describe the same Azure resources and deploy through Azure Resource Manager. Microsoft Learn says Bicep provides syntax that is less verbose than the equivalent JSON in most cases, and that Bicep is a transparent abstraction over a Resource Manager template. The Bicep CLI converts a Bicep file into JSON during deployment. This guide compares the syntax with Learn's side-by-side examples and notes what Learn says about benefits and conversion.

## What Learn says about the two languages

From the Bicep overview: Bicep is a domain-specific language with declarative syntax, concise syntax, type safety and code reuse. Resource types, API versions and properties that are valid in a Resource Manager template are valid in a Bicep file. Bicep supports all preview and GA versions of Azure services immediately, so you do not wait for tooling updates. The overview also lists these benefits: idempotent deployments, orchestration by Resource Manager, modules, integration with Azure Policy and template specs, the what-if operation, no state files to manage because Azure stores state, and no cost, with Microsoft Support support.

The comparison page says the Bicep Playground shows Bicep and equivalent JSON side by side. For its SQL server and database example, the Bicep is about half the size of the ARM template.

## Syntax side by side

| Task | Bicep | ARM JSON |
| --- | --- | --- |
| Expression | `func()` | `"[func()]"` |
| Parameter with default | `param orgName string = 'Contoso'` | A `parameters` entry with `type` and `defaultValue` |
| Use a parameter | `name: orgName` | `"[parameters('orgName')]"` |
| Variable | `var description = 'example value'` | A `variables` entry |
| String join | `'${namePrefix}-vm'` | `"[concat(parameters('namePrefix'), '-vm')]"` |
| Logical AND | `isMonday && isNovember` | `[and(parameters('isMonday'), parameters('isNovember'))]` |
| Conditional value | `isMonday ? 'valueIfTrue' : 'valueIfFalse'` | `[if(parameters('isMonday'), 'valueIfTrue', 'valueIfFalse')]` |
| Target scope | `targetScope = 'subscription'` | A `$schema` for the subscription deployment template |
| Conditional resource | `= if(deployVM) {` | A `condition` property |
| Loop | `[for storageName in storageAccountNames: {` | A `copy` block with `name` and `count` |
| Module or linked file | Modules | Linked templates |

Declaring a resource differs too. In Bicep: `resource virtualMachine 'Microsoft.Compute/virtualMachines@2025-04-01' = {`. In JSON, a `resources` array entry carries `type` and `apiVersion` separately. To get the ID of a resource in the same template, Bicep uses `nic1.id`, JSON uses `resourceId('Microsoft.Network/networkInterfaces', variables('nic1Name'))`.

## Dependencies

Learn says that for Bicep you can set an explicit dependency, but this approach is not recommended. Instead, rely on implicit dependencies. An implicit dependency is created when one resource declaration references the identifier of another resource, as in `netSecurityGroup.id` on a network interface. If you must set one, use `dependsOn: [ storageAccount ]`. The overview adds that you can avoid `dependsOn` when the symbolic name of a resource is used in another resource declaration.

## Referencing properties

To read a property from a resource in the same template, Bicep uses `storageAccount.properties.primaryEndpoints.blob`; JSON uses the `reference` function with `resourceId`. For an existing resource not deployed in the template, Bicep declares it with the `existing` keyword and then uses it as often as needed, while JSON needs the `reference` expression every time. For a nested resource such as a subnet, Bicep uses the nested accessor, for example `VNet1::Subnet1.properties.addressPrefix`.

## Outputs and one trap

A Bicep output is a single line, such as `output hostname string = publicIP.properties.dnsSettings.fqdn`. Learn also shows a conditional output, and warns about a difference. The Bicep ternary operator is the equivalent of the JSON `if` function, not of the `condition` property. The ternary has to evaluate to one value or the other. If the condition is false in Learn's sample, Bicep outputs a hostname with an empty string, but JSON outputs no values.

## Structure and flexibility

The overview says you can declare parameters, variables and outputs anywhere in a Bicep file. In JSON they must sit in their sections. It also says you do not use bracketed expressions in Bicep, because you call functions and read parameters and variables directly, and that each deployed resource gets a symbolic name.

## Converting an existing template

Learn's decompile page says the Bicep CLI must be installed. The command is:

```azurecli
az bicep decompile --file main.json
```

It creates main.bicep next to main.json, and `--force` overwrites an existing file. Learn warns that decompilation attempts to convert the file, there is no guaranteed mapping from JSON to Bicep, and you may need to fix warnings and errors, or the decompile may fail. The decompile and build commands produce templates that are functionally equivalent, though not necessarily identical. JSON parameter names with periods have their periods replaced by underscores, because Bicep identifiers allow only letters, digits and underscores. You can also export a resource group template and decompile it:

```azurecli
az group export --name "your_resource_group_name" > main.json
az bicep decompile --file main.json
```

Learn notes that decompiling helps you get started and that you might revise the Bicep file to implement best practices.

## When to switch

This section is my advice, not a Microsoft statement. Learn's comparison page does not tell you when to switch, so these points are my own reading.

1. **Start new work in Bicep** if your team can install the Bicep tooling, since the syntax is shorter and dependencies are implicit.
2. **Leave stable JSON alone** until you have a reason to touch it. Decompile it when you next change it, and review the result line by line. Learn says you might need to fix warnings and errors and may want to revise the file to follow best practices.
3. **Convert in small steps.** Decompile one template, run what-if against a test resource group, and compare the preview with the JSON deployment.
4. **Watch conditional outputs and parameter names** after conversion, because these are two pitfalls the pages spell out: the ternary versus the `condition` property, and periods in parameter names.
5. **Retire explicit dependsOn** during the move, and check that the deployment order still works.
6. **Use the Playground** to explain the two forms to colleagues who know only JSON.

## Related

- [Bicep](https://www.m365.fm/entity/bicep/)
- [ARM template](https://www.m365.fm/entity/arm-template/)
- [Azure Resource Manager](https://www.m365.fm/entity/azure-resource-manager/)

## Sources

- [Compare syntax for Azure Resource Manager templates in JSON and Bicep - Azure Resource Manager (Microsoft Learn)](https://learn.microsoft.com/azure/azure-resource-manager/bicep/compare-template-syntax)
- [What is Bicep? - Azure Resource Manager (Microsoft Learn)](https://learn.microsoft.com/azure/azure-resource-manager/bicep/overview)
- [Decompile a JSON Azure Resource Manager template to Bicep - Azure Resource Manager (Microsoft Learn)](https://learn.microsoft.com/azure/azure-resource-manager/bicep/decompile)
