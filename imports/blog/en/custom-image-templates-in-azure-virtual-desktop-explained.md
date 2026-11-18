---
title: "Custom image templates in Azure Virtual Desktop explained"
summary: "A custom image template is a JSON definition of a session host image that Azure Virtual Desktop submits to Azure Image Builder, which builds, generalizes and stores it. Compared here with a hand-built golden image."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-custom-image-templates, golden-image]
keypoints:
  - "A custom image template is a JSON file with source image, distribution targets, build properties and customizations. A separate build step submits it to Azure Image Builder, which creates the image."
  - "Learn gives 13 example built-in scripts, such as language packs, FSLogix, RDP Shortpath and Windows Updates. Your own scripts need a public location or a storage account with an RBAC role."
  - "A build runs under a user-assigned managed identity. The staging group IT_<ResourceGroupName>_<TemplateName>_<GUID> exists from template creation; its storage account stays after the build."
  - "The image can go to Azure Compute Gallery, to a managed image or to both. Learn calls managed images legacy and points to the gallery for new features."
  - "General availability in the Azure public cloud was announced in September 2023. Microsoft Support does not handle problems with customer-written or modified Microsoft scripts."
faq:
  - q: "Do I need to write any Azure Image Builder JSON to use custom image templates?"
    a: "Not for the portal route. The announcement says admins do not need to write their own scripts, because they pick built-in customizations in the Azure Virtual Desktop portal. The portal still produces a JSON template, and you can add your own scripts when the built-in ones do not cover a need."
  - q: "Does a custom image template update the session hosts that already run?"
    a: "Learn describes the template as producing an image that you can use as the source image for session hosts when you create or update a host pool. It does not describe a template or build changing running session hosts by itself. How you move existing hosts to a new image is a separate step."
  - q: "Is a custom image template the same as a golden image?"
    a: "It is one way to produce a golden image. The golden image is the finished, generalized image; the template is the repeatable definition from which the image is built. A manual build and a template build can both end in the same kind of image."
---

A custom image template in Azure Virtual Desktop is a JSON definition of a session host image: the source image, where to store the result, how the build runs and which customizations to apply. You create the template in the Azure portal, then start a build that hands it to Azure Image Builder, which creates the image, generalizes it with sysprep and stores it in Azure Compute Gallery, as a managed image, or both. This article covers the concept and the decisions around it, not a step-by-step build.

## Template and build are two separate things

Learn splits the creation of a custom image into two parts: you create a template that defines what the image should contain, then build the image by submitting the template to Azure Image Builder. The template is the definition; nothing is built until you select the template in the portal list and choose **Start build**.

The portal can import an existing template as the base for a new one (**Import from existing template** on the Basics tab). The resulting image is the source for session hosts when you create or update a host pool, according to Learn; the template and build pages do not describe them changing running session hosts.

The [golden image](https://www.m365.fm/entity/golden-image/) is the finished artifact; the template is one method of producing it. Learn describes custom image templates as built on [Azure Image Builder](https://www.m365.fm/entity/azure-image-builder/) and tailored for Azure Virtual Desktop, and its troubleshooting page says Azure Image Builder uses [HashiCorp Packer](https://www.m365.fm/entity/hashicorp-packer/). See also [custom image templates](https://www.m365.fm/entity/avd-custom-image-templates/).

## What a template contains

Learn names four parts of the JSON template: the source image, the distribution targets, the build properties and the customizations.

| Part | What it decides | Notes from Learn |
|---|---|---|
| Source image | Starting point | Azure Marketplace, an Azure Compute Gallery image, a managed image or, per the overview, an existing custom image template. The portal's Source type offers marketplace, managed image and Compute Gallery. The source must be a supported Azure Virtual Desktop operating system. |
| Distribution targets | Where the result lands | Managed image, Azure Compute Gallery, or both. |
| Build properties | How the build runs | Build timeout, build VM size, optional staging resource group, optional virtual network and subnet. |
| Customizations | What changes in the image | Built-in scripts and your own scripts, in the order you set. |

Two settings must agree with the source. Learn says to choose a build VM size that matches the generation of the source image, and the VM image definition in a gallery must have the same generation as the source. For the gallery case the troubleshooting page shows the validation message "Error with Hyper-V Version validation (cross-generation for multiple Hyper-V Versions is not supported)". Trusted Launch and Confidential VM support is inherited from Azure Image Builder and has conditions on source and distribution types; see [Trusted launch](https://www.m365.fm/entity/trusted-launch/) and the Image Builder overview.

The build timeout is the maximum time for all customizations, validations and distributions. Learn recommends a higher value for the language pack or Windows optimization scripts, which need Windows Update. It gives no portal default.

## What happens during a build

1. **Identity.** Azure Image Builder uses a user-assigned [managed identity](https://www.m365.fm/entity/managed-identity/) to create resources in your subscription, such as a resource group, a build VM, a Key Vault and a storage account. Learn recommends a dedicated identity with a custom role, ideally scoped to the resource group that stores the templates.
2. **Staging resource group.** Learn says this group is created when the template is created, not when the build starts. The default name is `IT_<ResourceGroupName>_<TemplateName>_<GUID>`; you can name your own instead, and a group you name must be empty before the build starts. Most of its resources are temporary and are deleted after the build. The storage account is the exception.
3. **Build VM.** Image Builder deploys a temporary VM from the source image. If you do not select a virtual network, a temporary virtual network, subnet and public IP address are created.
4. **Download and run.** The build VM needs internet access to download scripts; built-in ones come from the RDS-Templates repository on GitHub. Scripts run in the order shown on the Customizations tab, and built-in scripts include restarts where needed.
5. **Generalize and distribute.** Image Builder generalizes the image with [sysprep](https://www.m365.fm/entity/sysprep/) and distributes it to the targets you chose. Compute Gallery handles region replication, versioning and sharing.
6. **Clean up.** The temporary resources go away. Learn says the group can be deleted after a successful build if you do not need the logs. Until then the storage account stays, with up to three containers: `shell` for customization scripts, `packerlogs` for logs and `vhds` for the VHD held temporarily before it becomes a managed image or gallery version.

Each GUID-named folder inside `packerlogs` holds `customization.log` with all Packer output. Entries for built-in scripts begin with `Starting AVD AIB Customization: {Script name}: {Timestamp}`.

Learn lists seven resource providers to register, including Microsoft.VirtualMachineImages and Microsoft.ContainerInstance; a missing ContainerInstance registration produces an authorization error for `Microsoft.ContainerInstance/register/action`.

## What belongs in the image, and the built-in scripts

Learn gives these built-in scripts as examples: install language packs, set the default operating system language, enable time zone redirection, disable Storage Sense, install [FSLogix](https://www.m365.fm/entity/fslogix/) and configure Profile Container, enable FSLogix with Kerberos, enable [RDP Shortpath](https://www.m365.fm/entity/rdp-shortpath/) for managed networks, enable screen capture protection, configure Teams optimizations, configure session timeouts, disable automatic updates for MSIX applications, add or remove Microsoft Office applications, and apply Windows Updates. Learn presents them as examples, so the list may be incomplete: the creation page also refers to a Windows optimization script, and What's new mentions a Remove AppX package list in the built-in customization settings for removing Clipchamp. What's new records that in August 2024 new Teams replaced classic Teams in these templates; see [Teams media optimization](https://www.m365.fm/entity/avd-teams-media-optimization/).

Your own scripts need a publicly available location such as GitHub or a web service. A storage account also works if the managed identity has an RBAC role such as Storage Blob Data Reader. A tip on the creation page says removing or uninstalling the Microsoft Store app is not supported.

In our reading, the examples are mostly platform settings that many environments need. For applications the template is one choice among several. Learn's manual golden image page names two others, [Microsoft Intune](https://www.m365.fm/entity/intune/) for device management and Azure Image Builder with Azure DevOps to automate the build, and says the right strategy depends on the size and complexity of the environment and on how you deploy applications. Each application change inside the image means a new build, so frequently changing apps are worth weighing against delivery outside it, such as [App Attach](https://www.m365.fm/entity/msix-app-attach/). That weighing is a design consideration, not a Learn statement.

## Where the image goes: managed image or Compute Gallery

- **Azure Compute Gallery.** A gallery holds image definitions and versions and can replicate versions to other regions. See [Azure Compute Gallery](https://www.m365.fm/entity/azure-compute-gallery/). The **Excluded from latest** option keeps a version from being used when `latest` is specified in the image reference.
- **Managed image.** Learn's managed image page calls it the older, legacy technology. It states that all new features, such as ARM64, Trusted Launch and Confidential VM, are supported only through Azure Compute Gallery, and that one managed image supports up to 20 simultaneous deployments. For larger rollouts Learn suggests a gallery image with one replica per 20 concurrent VM deployments.
- **Both.** The portal allows both targets in one build, each with its own run output name.

The AVD golden image page recommends gallery images for production because of replication and versioning. Versions and replication are covered in the article on Azure Compute Gallery for AVD images.

## How the template route compares with other ways to build an image

| Approach | How the image is made | Strength | Limit |
|---|---|---|---|
| Manual golden image | You deploy a base VM, customize it, run sysprep and capture | Interactive control over the VM | Every step is manual and repeatable only by discipline. Learn warns against capturing the same VM twice or a VM in a host pool. |
| Custom image template | Portal-defined template, built by Azure Image Builder | Repeatable definition, built-in AVD scripts | Scripts must be reachable by the build VM. Microsoft Support does not handle customer-written scripts. |
| Direct Azure Image Builder template | You write the full ARM or Bicep template yourself and submit it, for example from a pipeline such as Azure DevOps | Full control of the template, including its customizers | You maintain the JSON and the scripts yourself. |
| Nerdio Manager desktop image | A VM is created from an Azure library image or an existing Azure VM, customized, then turned into an image, by default stored in an Azure Compute Gallery | Scripted actions run on a clone before sysprep; Compute Gallery distribution on by default | The page describes a VM-based flow and does not describe Azure Image Builder. |

The Nerdio row comes from the Nerdio help page "Create a Desktop Image" (dated 9 November 2026). Nerdio Manager for Enterprise removes local user profiles before sysprep, with an option to skip that step. Windows scripts run through the Azure Custom Script extension on a clone of the image VM before sysprep, while Azure runbooks run through the Azure automation account. The target VM for a scripted action can be the clone (default) or the source VM. Geographic distribution with an Azure Compute Gallery is enabled by default, and creation may take up to an hour. See [Nerdio desktop image management](https://www.m365.fm/entity/nerdio-desktop-image/).

## Status, support scope and limits

What's new records custom image templates as in preview in May 2023 and as generally available in September 2023; the Azure Virtual Desktop blog announced general availability on 19 September 2023. That post names the Azure public cloud as generally available and Azure Government and China as entering public preview at that time. Check the current Learn pages for your cloud.

The troubleshooting page says Microsoft Support does not handle issues with customer-created scripts, or with scripts or templates copied from a Microsoft repository and then modified.

Cost follows Azure Image Builder: compute, networking and storage, plus possible egress. The Image Builder overview adds that the service does not currently support [Azure Hybrid Benefit](https://www.m365.fm/entity/azure-hybrid-benefit/) for Windows Server.

## A decision summary

A template route fits when you rebuild images regularly, want the same definition every time, and your customizations are mostly platform settings plus a few scripts. A manual build fits a one-off image or an installation that needs interactive steps. A direct Image Builder template fits when you want to write the customizers yourself, which the template reference documents as File, PowerShell, WindowsRestart and WindowsUpdate for Windows (Shell is the Linux customizer), or submit it from an Azure DevOps pipeline. These fits are our own reading, not Learn statements. Whichever you pick, the output is a generalized image that feeds a [host pool](https://www.m365.fm/entity/avd-host-pool/) or [session host configuration](https://www.m365.fm/entity/avd-session-host-configuration/).

## Sources

- [Microsoft Learn: Custom image templates in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/custom-image-templates)
- [Microsoft Learn: Use custom image templates to create custom images](https://learn.microsoft.com/en-us/azure/virtual-desktop/create-custom-image-templates)
- [Microsoft Learn: Troubleshoot custom image templates in Azure Virtual Desktop](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-desktop/troubleshoot-custom-image-templates)
- [Microsoft Learn: Create an Azure Virtual Desktop golden image](https://learn.microsoft.com/en-us/azure/virtual-desktop/set-up-golden-image)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Microsoft Learn: Azure VM Image Builder overview](https://learn.microsoft.com/en-us/azure/virtual-machines/image-builder-overview)
- [Microsoft Learn: Azure Compute Gallery](https://learn.microsoft.com/en-us/azure/virtual-machines/azure-compute-gallery)
- [Microsoft Learn: Create a legacy managed image in Azure](https://learn.microsoft.com/en-us/azure/virtual-machines/capture-image-resource)
- [Azure Virtual Desktop blog: Announcing general availability of Azure Virtual Desktop custom image templates](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/announcing-general-availability-of-azure-virtual-desktop-custom-image-templates/3909907)
- [Nerdio Manager help: Create a Desktop Image](https://nmehelp.getnerdio.com/hc/en-us/articles/48898864381453-Create-a-Desktop-Image)
- [Microsoft Learn: Azure VM Image Builder template reference](https://learn.microsoft.com/en-us/azure/virtual-machines/linux/image-builder-json)
