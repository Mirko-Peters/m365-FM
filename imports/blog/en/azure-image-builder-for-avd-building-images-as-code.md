---
title: "Azure Image Builder for AVD: building images as code"
summary: "Azure Image Builder turns a JSON template into a finished, generalized VM image and distributes it to Azure Compute Gallery or a managed image. This article explains how the template works, how AVD custom image templates relate to it, and which prerequisites, limits and costs apply."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [azure-image-builder, azure-virtual-desktop]
keypoints:
  - "Azure VM Image Builder is a managed Azure service built on HashiCorp Packer. You submit a template that names a source, customizations and distribution targets, and the service builds and distributes the image."
  - "AVD custom image templates are built on Azure Image Builder and have been generally available in the Azure public cloud since September 2023. The portal route adds built-in scripts for common AVD settings, while a direct template gives full control of the JSON."
  - "The template has three main sections: a source (platform image, managed image or gallery image version), a list of customizers that run in order, and one or more distribution targets."
  - "Build timeout defaults to 240 minutes, with a range of 6 to 960 minutes. For Windows, Learn advises not going below 60 minutes and using at least a Standard_D2_v2 build VM."
  - "Image Builder does not support Azure Hybrid Benefit for Windows Server, and the image template resource is immutable and cannot be moved."
faq:
  - q: "Is Azure Image Builder the same thing as AVD custom image templates?"
    a: "Not exactly. Microsoft Learn says custom image templates in Azure Virtual Desktop are built on Azure Image Builder and tailored for AVD. They give a portal flow with built-in scripts, while Azure Image Builder itself accepts any template you write."
  - q: "Where do I find the build log if a customization fails?"
    a: "Learn says the staging resource group holds a storage account with a packerlogs container. Each build has a folder there with customization.log, and validation.log when validation ran. By default the group is named IT_ followed by the resource group, template name and a GUID. Deleting the template removes the group and these logs."
  - q: "Do I pay for Azure Image Builder?"
    a: "Learn says you incur compute, networking and storage costs similar to building images manually, charged at your Azure rates. It names a small storage cost for the staging resource group and possible egress charges when the image is distributed to other regions."
---

Azure VM Image Builder, often called Azure Image Builder or AIB, builds a VM image from a configuration you submit as a template. The service creates a temporary build VM, runs your customizations, generalizes the image and distributes the result to an Azure Compute Gallery, a managed image or a VHD. For Azure Virtual Desktop it offers a repeatable, reviewable template as an alternative to hand-built golden images. This article explains the template, how to start a build and find its log, the AVD-specific route and the limits.

Microsoft's What's new page and the Azure Virtual Desktop blog announced custom image templates as generally available in September 2023. The blog post names the Azure public cloud and says Azure Government and China entered public preview at that time; the custom image templates pages carry no status label, so check them for your cloud. The overview labels the service's Azure DevOps task as preview. Lifecycle practice and gallery replication are covered in "The golden image lifecycle: build, test, release, retire" and "Azure Compute Gallery for AVD images: versions and replication".

## What the service does

Learn's [overview](https://learn.microsoft.com/en-us/azure/virtual-machines/image-builder-overview) describes a fully managed Azure service built on [HashiCorp Packer](https://www.packer.io/). It works with Azure Marketplace base images and existing custom images, for Windows and Linux, and for generation 1 and generation 2 Hyper-V images. The distributed image always has the generation of the source image. It hides the need to generalize with Sysprep, though advanced users can override that.

You can pass a configuration with Azure PowerShell, the Azure CLI or Azure Resource Manager templates, or call it from a pipeline with the DevOps task (preview). The portal experience has been available since March 2023. Because the template is an Azure resource, the build definition can live in source control next to your other infrastructure code. That is the "as code" part, and it is an operating choice rather than a feature of the service.

## Two routes: custom image templates or a direct template

Learn's [custom image templates article](https://learn.microsoft.com/en-us/azure/virtual-desktop/custom-image-templates) says they are built on Azure Image Builder and tailored for Azure Virtual Desktop. The template is a JSON file with the source image, distribution targets, build properties and customizations, which is submitted to Azure Image Builder.

| Aspect | AVD custom image templates | Direct Azure Image Builder template |
|---|---|---|
| Where you work | **Azure Virtual Desktop**, **Custom image templates**, **+Add custom image template** | PowerShell, CLI, ARM templates or a pipeline task |
| Customizations | Built-in scripts plus your own scripts | Any customizers the template format supports |
| Built-in AVD scripts | Language packs, time zone redirection, FSLogix, RDP Shortpath, Teams optimizations, session timeouts, Windows Updates and more | You write or reuse the scripts yourself |
| Output | Managed image, Azure Compute Gallery or both | Managed image, Azure Compute Gallery or VHD |
| Start a build | **Start build** in the portal list | `Run` action on the template resource |

The built-in scripts are stored in the Azure RDS-Templates GitHub repository. Custom scripts must be at a publicly available location, or in a storage account where the managed identity has an RBAC role such as Storage Blob Data Reader.

## Prerequisites

For custom image templates, Learn's [creation article](https://learn.microsoft.com/en-us/azure/virtual-desktop/create-custom-image-templates) lists:

- Registered resource providers: Microsoft.DesktopVirtualization, Microsoft.VirtualMachineImages, Microsoft.Storage, Microsoft.Compute, Microsoft.Network, Microsoft.KeyVault and Microsoft.ContainerInstance.
- A resource group for templates and images. If you bring your own staging group for the build, it must be empty before the build starts.
- A user-assigned managed identity, which Learn recommends creating specifically for custom image templates, with a custom role. The role's actions are read on galleries, images and image versions, write on image versions, and read, write and delete on managed images. Scope the assignment appropriately, ideally to the resource group you use to store the templates. If you pick a different resource group for a managed image on the distribution targets tab, the identity needs the same role assignment there.
- Optionally an Azure Compute Gallery with an image definition. Do not create a version in advance.
- Optionally a virtual network. If it uses a private service policy, the policy must be disabled for Image Builder to work.

The [VM Image Builder and PowerShell article](https://learn.microsoft.com/en-us/azure/virtual-machines/windows/image-builder-virtual-desktop) lists five providers for a direct template: VirtualMachineImages, Storage, Compute, KeyVault and ContainerInstance.

## Anatomy of a template

Learn's [template reference](https://learn.microsoft.com/en-us/azure/virtual-machines/linux/image-builder-json) gives these building blocks. The fragment below uses its property names with placeholders. It is an illustration, not a tested template, and it is not deployable as it stands: the reference's basic format also wraps the properties in `type` (which must be `Microsoft.VirtualMachineImages/imageTemplates`), `location`, optional `tags` and `identity`, and the deployment supplies an API version.

```json
"properties": {
  "buildTimeoutInMinutes": 120,
  "vmProfile": { "vmSize": "Standard_D2ds_v4", "osDiskSizeGB": 0 },
  "source": {
    "type": "PlatformImage",
    "publisher": "MicrosoftWindowsDesktop",
    "offer": "<offer>",
    "sku": "<generation 2 multi-session sku>",
    "version": "latest"
  },
  "customize": [
    { "type": "PowerShell", "name": "install-apps", "runElevated": true, "runAsSystem": true, "inline": [ "<commands>" ] },
    { "type": "WindowsRestart" },
    { "type": "WindowsUpdate" }
  ],
  "distribute": [
    {
      "type": "SharedImage",
      "galleryImageId": "<gallery image definition resource ID>",
      "runOutputName": "avdOutput",
      "versioning": { "scheme": "Latest", "major": 1 },
      "targetRegions": [ { "name": "<region>", "replicaCount": 2, "storageAccountType": "Standard_ZRS" } ]
    }
  ]
}
```

Points from the reference:

- **Source.** Three types: PlatformImage, ManagedImage (same subscription and region) and SharedImageVersion. Only generalized source images are supported. The overview shows `az vm image list --publisher MicrosoftWindowsDesktop --sku g2 --output table --all` for finding generation 2 SKUs.
- **Build timeout.** If you omit it or set 0, the default is 240 minutes. The minimum is 6 and the maximum 960. For Windows Learn does not recommend less than 60.
- **Build VM.** The default is Standard_D1_v2 for generation 1 and Standard_D2ds_v4 for generation 2. The AVD article says the D1_v2 default is not suitable for Windows and recommends Standard_D2_v2 or greater. A value of 0 for osDiskSizeGB keeps the source size; you cannot reduce it.
- **Customizers.** File, PowerShell, Shell, WindowsRestart and WindowsUpdate run in the order listed. The File customizer suits downloads under 20 MB. For the WindowsUpdate customizer, Microsoft tests and validates the community provisioner and investigates issues with it, but the open-source project itself is not officially supported.
- **Distribution.** ManagedImage, SharedImage and VHD, each with a unique runOutputName. With automatic versioning, scheme Latest increments the version and major pins the major number. Learn's example: with versions up to 2.1.0 in the gallery, major 1 yields 1.2.1. `replicationRegions` is deprecated from API version 2022-07-01 in favour of `targetRegions`.
- **Error handling.** `onCustomizerError` and `onValidationError` accept cleanup or abort. With abort, the service skips cleanup and you remove the temporary resources yourself.

## Rules that stop builds from hanging

The AVD article lists tips for Windows builds. Set `runElevated` and `runAsSystem` to true on PowerShell customizers, or the build stops responding. Use `write-host` so output reaches customization.log. Scripts must exit with 0, because a non-zero code fails the customization. Test scripts on a standalone VM first.

## Deploy and start the build

1. **Submit the template.** The PowerShell article uses `New-AzResourceGroupDeployment` with an ARM template file and parameters. The `identity` block is required: the reference says you must create a user-assigned identity with permissions on the resources, and list it under `identity` as `"type": "UserAssigned"` with its resource ID. Keep secrets out of the template: inline commands can be viewed in the template definition, so the reference says passwords, SAS tokens and authentication tokens belong in scripts in Azure Storage, where access requires authentication.
2. **Optionally validate.** The `validate` property validates platform images and customized images. With `sourceValidationOnly` set to true, the image in `source` is validated directly and no separate build runs. If validation fails, `continueDistributeOnFailure` decides whether the image is still distributed; the reference advises caution with true.
3. **Start the build.** Either set `autoRun` to Enabled, which starts one build when the template is created, or invoke Run. The reference gives:

```powershell
Invoke-AzResourceAction -ResourceName $imageTemplateName -ResourceGroupName $imageResourceGroup -ResourceType Microsoft.VirtualMachineImages/imageTemplates -ApiVersion "2023-07-01" -Action Run -Force
```

```bash
az resource invoke-action --resource-group $imageResourceGroup --resource-type Microsoft.VirtualMachineImages/imageTemplates -n <template-name> --action Run
```

   `autoRun` does not give ongoing builds, so a rebuild needs another Run. In the portal, select the template in **Custom image templates** and choose **Start build**.
4. **Watch the status.** `Start-AzImageBuilderTemplate -NoWait` returns immediately. `Get-AzImageBuilderTemplate` exposes `LastRunStatusRunState`, `LastRunStatusMessage` and `LastRunStatusRunSubState`.
5. **Use the result.** In the host pool wizard, select **See all images**, then **My Items**, and choose **My Images** for managed images or **Shared Images** for a gallery. The VM size must match the image generation.

## Where the logs are

By default the service creates a staging resource group named `IT_<ResourceGroupName>_<TemplateName>_<GUID>`; you can name your own with `stagingResourceGroup` (or on the Build properties tab). Learn says most resources in it are temporary and deleted after the build, except the storage account. In that account, the `packerlogs` container has one folder per build, and each holds `customization.log` and, when validation ran, `validation.log`. The [custom image templates troubleshooting page](https://learn.microsoft.com/en-us/azure/virtual-desktop/troubleshoot-custom-image-templates) says entries for built-in scripts begin `Starting AVD AIB Customization: {<script name>}`. The [Image Builder troubleshooting page](https://learn.microsoft.com/en-us/azure/virtual-machines/linux/image-builder-troubleshoot) gives the download path: storage account, **Data Storage**, **Containers**, `packerlogs`, build folder. For a running build, look in the staging group for the container instance `vmimagebuilder-build-container-...` and its logs.

## Limits, costs and recent changes

- Azure Hybrid Benefit for Windows Server is not supported.
- The image template is immutable and cannot be moved. To relocate it, recreate it with a new name.
- Trusted Launch and Confidential VM: images marked TrustedLaunchSupported or ConfidentialVMSupported work as sources, but TrustedLaunch and ConfidentialVM images do not. Source and distribution must both be TrustedLaunchSupported.
- Cost: compute, networking and storage at your Azure rates, a small storage cost for the staging group, and possible egress to other regions.
- Deleting the template: the overview suggests it to avoid the storage cost, but the reference says the staging resource group is deleted with the template, a VHD distribution is lost with it ("If you delete the image template, then you'll lose the VHD"), and the logs go with the group. Copy VHDs and download logs first. The custom image templates page says the IT_ group is also deleted when you delete the resource group containing the image, while the PowerShell walkthrough says that deleting only the resource group leaves the IT_ group behind. Deleting the template first avoids the question.
- For Azure DevOps builds, the troubleshooting page says the staging group is deleted after a successful build, so a log needs a sleep step to read. The custom image templates page says the group can be deleted after success, provided you do not need the logs.
- March 2026 release notes: after 31 March 2026 new virtual networks default to private subnets without default outbound access. If a template sets `subnetId` or `containerInstanceSubnetId` and the build or validation VMs need internet access, that subnet must have outbound access enabled. Separately, with Azure unmanaged disks retiring, VHDs produced by Image Builder can no longer provision new VMs.

## Sources

Retrieved 17 November 2026.

- [Microsoft Learn: Azure VM Image Builder overview](https://learn.microsoft.com/en-us/azure/virtual-machines/image-builder-overview)
- [Microsoft Learn: Azure VM Image Builder template reference](https://learn.microsoft.com/en-us/azure/virtual-machines/linux/image-builder-json)
- [Microsoft Learn: Troubleshoot Azure VM Image Builder](https://learn.microsoft.com/en-us/azure/virtual-machines/linux/image-builder-troubleshoot)
- [Microsoft Learn: Azure VM Image Builder API update release notes](https://learn.microsoft.com/en-us/azure/virtual-machines/image-builder-api-update-release-notes)
- [Microsoft Learn: Custom image templates in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/custom-image-templates)
- [Microsoft Learn: Create custom image templates and custom images in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/create-custom-image-templates)
- [Microsoft Learn: Troubleshoot custom image templates in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/troubleshoot-custom-image-templates)
- [Microsoft Learn: Create an Azure Virtual Desktop image by using VM Image Builder and PowerShell](https://learn.microsoft.com/en-us/azure/virtual-machines/windows/image-builder-virtual-desktop)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Azure Virtual Desktop blog: Announcing general availability of Azure Virtual Desktop custom image templates](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/announcing-general-availability-of-azure-virtual-desktop-custom/3909907)
