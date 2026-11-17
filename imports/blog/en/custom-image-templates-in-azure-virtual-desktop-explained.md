---
title: "Custom image templates in Azure Virtual Desktop explained"
summary: "A custom image template is a JSON definition of a session host image that Azure Virtual Desktop submits to Azure Image Builder, which builds, generalizes with sysprep and stores the image. This article explains what the template holds, what happens during a build, where the image ends up and how the approach compares with a hand-built golden image."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-custom-image-templates, golden-image]
keypoints:
  - "Custom image templates are built on Azure Image Builder and tailored for Azure Virtual Desktop. A template is a JSON file with the source image, distribution targets, build properties and customizations, and a separate step submits it to Azure Image Builder to build the image."
  - "The portal offers 13 kinds of built-in scripts, for example language packs, FSLogix, RDP Shortpath, Teams optimizations and Windows Updates, plus your own scripts from a publicly reachable URI."
  - "A build runs in a temporary IT_ resource group under a user-assigned managed identity. The packerlogs container in its storage account holds customization.log, the first place to look when a build fails."
  - "The image can go to Azure Compute Gallery, to a managed image or to both. Learn calls managed images legacy and points to the gallery for new features."
  - "The feature was announced as generally available in the Azure public cloud in September 2023. Microsoft Support does not handle problems with customer-written scripts, or with Microsoft scripts that you modified."
faq:
  - q: "Do I need to write any Azure Image Builder JSON to use custom image templates?"
    a: "Not for the portal route. The announcement says admins do not need to write their own scripts, because they pick built-in customizations in the Azure Virtual Desktop portal. The portal still produces a JSON template, and you can add your own scripts when the built-in ones do not cover a need."
  - q: "Does a custom image template update the session hosts that already run?"
    a: "No. The template only produces an image. Learn describes the result as a source image you use when you create or update a host pool, so existing session hosts change only when you deploy or replace them from a new image version."
  - q: "Is a custom image template the same as a golden image?"
    a: "It is one way to produce a golden image. The golden image is the finished, generalized image; the template is the repeatable definition from which the image is built. A manual build and a template build can both end in the same kind of image."
---

A custom image template in Azure Virtual Desktop is a JSON definition of a session host image: the source image, where to store the result, how the build runs and which customizations to apply. You create the template in the Azure portal, then start a build that hands it to Azure Image Builder, which creates the image, generalizes it with sysprep and stores it in Azure Compute Gallery, as a managed image, or both. This article explains the concept and the decisions around it; it is not a step-by-step build guide or an update workflow.

## Template and build are two separate things

Learn splits the creation of a custom image into two parts. First you create a custom image template that defines what the image should contain. Second you build the image from that template by submitting it to Azure Image Builder. The template is the definition; nothing is built until you select the template in the portal list and choose **Start build**. The result is a source image for session hosts, which you pick when you create or update a host pool.

That split matters for how you operate it. The template can be reused for every rebuild, and the portal can import an existing template as the base for a new one (**Import from existing template** on the Basics tab). Rebuilding produces a new image; session hosts change only when you deploy or replace them from it.

The [golden image](/entity/golden-image/) is the finished artifact; the template is one method of producing it. The [Azure Image Builder](/entity/azure-image-builder/) service underneath is a managed Azure service built on [HashiCorp Packer](/entity/hashicorp-packer/), and the custom image templates page describes the feature as built on it and tailored for Azure Virtual Desktop. See also the entity page for [custom image templates](/entity/avd-custom-image-templates/).

## What a template contains

Learn names four parts of the JSON template: the source image, the distribution targets, the build properties and the customizations. In the portal they map to tabs.

| Part | What it decides | Notes from Learn |
|---|---|---|
| Source image | Starting point | Azure Marketplace platform image, managed image, or an Azure Compute Gallery image version. The source must be a supported Azure Virtual Desktop operating system. |
| Distribution targets | Where the result lands | Managed image, Azure Compute Gallery, or both. |
| Build properties | How the build runs | Build timeout, build VM size, optional staging resource group, optional virtual network and subnet. |
| Customizations | What changes in the image | Built-in scripts and your own scripts, in the order you set. |

Two settings must agree with the source. The build VM size must match the generation of the source image, and the VM image definition in a gallery must have the same generation. A mismatch fails validation with the message "Error with Hyper-V Version validation (cross-generation for multiple Hyper-V Versions is not supported)". Trusted Launch and Confidential VM support is inherited from Azure Image Builder, and the Image Builder overview limits it: images marked TrustedLaunchSupported or ConfidentialVMSupported work as sources, while images already typed TrustedLaunch or ConfidentialVM do not, and source and distribution must both be TrustedLaunchSupported. See the entity page for [Trusted launch](/entity/trusted-launch/).

The build timeout is the maximum time for all customizations, validations and distributions. Learn recommends a higher value when you use the language pack or Windows optimization scripts, because they trigger Windows Update automatically. It gives no default for the portal.

## What happens during a build

1. **Identity.** Azure Image Builder uses a user-assigned [managed identity](/entity/managed-identity/) to create resources in your subscription, such as a resource group, a build VM, a Key Vault and a storage account. Learn recommends creating the identity specifically for custom image templates, with a custom role scoped ideally to the resource group that stores the templates.
2. **Staging resource group.** A group named `IT_<ResourceGroupName>_<TemplateName>_<GUID>` is created with the template. Most of its resources are temporary and are deleted after the build. The storage account is the exception.
3. **Build VM.** Image Builder deploys a temporary VM from the source image. If you do not select a virtual network, a temporary virtual network, subnet and public IP address are created. If you select one, the VM can reach other resources on that network.
4. **Download and run.** The build VM needs internet access to download built-in and custom scripts. Built-in scripts come from the RDS-Templates repository on GitHub. Scripts run in the order shown on the Customizations tab, and built-in scripts include restarts where needed.
5. **Generalize and distribute.** Image Builder generalizes the image with [sysprep](/entity/sysprep/) and distributes it to the targets you chose. Compute Gallery handles region replication, versioning and sharing.
6. **Clean up.** The temporary resources go away. The storage account stays, with up to three containers: `shell` for customization scripts, `packerlogs` for logs and `vhds` for the VHD held temporarily before it becomes a managed image or gallery version.

Each build folder inside `packerlogs` is named with a GUID and holds `customization.log` with all output from Packer. Entries for built-in scripts begin with `Starting AVD AIB Customization: {<Script name>}: {<Timestamp>}`, so searching for that string finds errors in those scripts.

Learn lists seven resource providers to register before the first build, including Microsoft.VirtualMachineImages and Microsoft.ContainerInstance. A missing Microsoft.ContainerInstance registration produces an authorization error for `Microsoft.ContainerInstance/register/action`.

## What belongs in the image, and the built-in scripts

Learn lists these built-in scripts: install language packs, set the default operating system language, enable time zone redirection, disable Storage Sense, install [FSLogix](/entity/fslogix/) and configure Profile Container, enable FSLogix with Kerberos, enable [RDP Shortpath](/entity/rdp-shortpath/) for managed networks, enable screen capture protection, configure Teams optimizations, configure session timeouts, disable automatic updates for MSIX applications, add or remove Microsoft Office applications, and apply Windows Updates. In August 2024 the What's new page recorded that new Teams replaced classic Teams in these templates. For the Teams part see [Teams media optimization](/entity/avd-teams-media-optimization/).

Your own scripts need a publicly available location such as GitHub or a web service. A storage account also works if the managed identity has an RBAC role such as Storage Blob Data Reader. One portal note applies to cleanup scripts: Learn says removing or uninstalling the Microsoft Store app is not supported.

The list shows what the feature targets: platform settings that every session host needs. For applications the template is one choice among several. Learn's manual golden image page names two others, [Microsoft Intune](/entity/intune/) for device management and Azure Image Builder with Azure DevOps to automate the build, and says the right strategy depends on the size and complexity of the environment and on how you deploy applications. Each application change inside the image means a new build, so frequently changing apps are worth weighing against delivery outside the image, such as [MSIX app attach](/entity/msix-app-attach/). That is a design consideration, not a Learn statement.

## Where the image goes: managed image or Compute Gallery

The distribution choice has lasting effects.

- **Azure Compute Gallery.** A gallery holds image definitions and versions and can replicate versions to other regions. See [Azure Compute Gallery](/entity/azure-compute-gallery/). In the portal a blank version number is generated automatically. The **Excluded from latest** option keeps a version from being used when `latest` is specified in the image reference.
- **Managed image.** Learn's managed image page calls it the older, legacy technology. It states that all new features, such as ARM64, Trusted Launch and Confidential VM, are supported only through Azure Compute Gallery, and that one managed image supports up to 20 simultaneous deployments. For larger rollouts Learn suggests a gallery image with one replica for every 20 concurrent VM deployments.
- **Both.** The portal allows both targets in one build, each with its own run output name.

The AVD golden image page recommends gallery images for production because of replication and versioning. Details of versions and replication are in the article on Azure Compute Gallery for AVD images.

## How the template route compares with other ways to build an image

| Approach | How the image is made | Strength | Limit |
|---|---|---|---|
| Manual golden image | You deploy a base VM, customize it, run sysprep and capture | Interactive control over the VM | Every step is manual and repeatable only by discipline. Learn warns not to capture the same VM twice and not to capture a VM that is in a host pool. |
| Custom image template | Portal-defined template, built by Azure Image Builder | Repeatable definition, built-in AVD scripts | Scripts must be reachable by the build VM. Microsoft Support does not handle customer-written scripts. |
| Direct Azure Image Builder template | You write the full template and run it from PowerShell, CLI, ARM or a pipeline | Any customization the template format supports | You maintain the JSON and the scripts yourself. |
| Nerdio Manager desktop image | A VM is created from an Azure library image, customized, then converted to an image object | Image handling inside the Nerdio Manager console | The Nerdio help page describes a VM-based flow and does not mention Azure Image Builder. |

The Nerdio row comes from the Nerdio help page on importing images from the Azure library: Nerdio Manager removes local user profiles during image creation, runs scripts on a clone of the image VM before sysprep, and states that creation may take up to an hour. It is a different mechanism from the template. See [Nerdio desktop image management](/entity/nerdio-desktop-image/).

## Status, support scope and limits

What's new records custom image templates as in preview in May 2023, and the Azure Virtual Desktop blog announced general availability on 19 September 2023. That post names the Azure public cloud as generally available and Azure Government and China as entering public preview at that time. The current Learn pages carry no status label, so check them for your cloud.

Support scope is worth knowing before you adopt custom scripts. The troubleshooting page says Microsoft Support does not handle issues with customer-created scripts, or with scripts or templates copied from a Microsoft repository and then modified. Collaboration happens in the Azure/RDS-Templates repository on GitHub.

Cost follows Azure Image Builder: compute, networking and storage at your Azure rates, plus possible egress when you distribute to other regions. The Image Builder overview adds that the service does not support Azure Hybrid Benefit for Windows Server. See [Azure Hybrid Benefit](/entity/azure-hybrid-benefit/).

The Learn overview has no limitations section and refers to the managed image documentation for managed image limits. Treat anything not stated there as unknown.

## A decision summary

A template route fits when you rebuild images regularly, want the same definition every time, and your customizations are mostly platform settings plus a few scripts. A manual build fits a one-off image or an installation that needs interactive steps. A direct Image Builder template fits when you want customizers the portal does not expose, or a build in a pipeline. Whichever you pick, the output is a generalized image that feeds a [host pool](/entity/avd-host-pool/) or [session host configuration](/entity/avd-session-host-configuration/).

## Sources

Retrieved 17 November 2026.

- [Microsoft Learn: Custom image templates in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/custom-image-templates)
- [Microsoft Learn: Create custom image templates and custom images in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/create-custom-image-templates)
- [Microsoft Learn: Troubleshoot custom image templates in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/troubleshoot-custom-image-templates)
- [Microsoft Learn: Create a golden image in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/set-up-golden-image)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Microsoft Learn: Azure VM Image Builder overview](https://learn.microsoft.com/en-us/azure/virtual-machines/image-builder-overview)
- [Microsoft Learn: Azure Compute Gallery](https://learn.microsoft.com/en-us/azure/virtual-machines/azure-compute-gallery)
- [Microsoft Learn: Capture a managed image of a generalized VM in Azure](https://learn.microsoft.com/en-us/azure/virtual-machines/capture-image-resource)
- [Azure Virtual Desktop blog: Announcing general availability of Azure Virtual Desktop custom image templates](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/announcing-general-availability-of-azure-virtual-desktop-custom/3909907)
- [Nerdio Manager help: Import images from the Azure library](https://nmehelp.getnerdio.com/hc/en-us/articles/26124336183821)
