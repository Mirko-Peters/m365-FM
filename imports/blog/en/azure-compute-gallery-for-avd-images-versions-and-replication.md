---
title: "Azure Compute Gallery for AVD images: versions and replication"
summary: "Azure Compute Gallery stores image definitions and numbered image versions and copies them to the regions where you deploy session hosts. This article explains the structure, version rules, replication settings, sharing and limits that matter for Azure Virtual Desktop."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [azure-compute-gallery, azure-virtual-desktop]
keypoints:
  - "A gallery holds image definitions, and each definition holds image versions. You deploy from a version, never from the definition itself."
  - "Versions are named major.minor.patch with integers. 'latest' resolves to the highest major, then minor, then patch, and 'exclude from latest' keeps a version out of that choice."
  - "Each version is created in a source region, which must also be one of its target regions, and has a replica count per region. Learn's gallery overview recommends one replica for every 20 VMs created at the same time and at least three replicas for production images; the session host update how-to page recommends at least two replicas of the image you use."
  - "There is no charge for the gallery itself. You pay for the storage of each replica and for network egress when the first copy leaves the source region."
  - "Learn disagrees with itself on cross-subscription images for session host configuration: two pages updated in July 2026 list a gallery image in another subscription as unsupported, while What's new for September 2025 announces support within the same tenant. Test it before centralizing images."
faq:
  - q: "Do I need an Azure Compute Gallery to use a custom image in Azure Virtual Desktop?"
    a: "No. Microsoft Learn says custom images can be stored in an Azure Compute Gallery, as a managed image, or both. The gallery adds management of region replication, versioning and sharing."
  - q: "What happens when an image version reaches its end of life date?"
    a: "Learn's image definition page says end-of-life dates are informational and users can still create VMs from versions past that date. To block deletion before end of life, the gallery page points to the BlockDeletionBeforeEndOfLife setting."
  - q: "Does the version number have to follow a format?"
    a: "Yes. Learn says the image version name must be in major.minor.patch format using integers, within the range of a 32-bit integer, and made of numbers and periods. Example: 1.0.0."
---

[Azure Compute Gallery](/entity/azure-compute-gallery/) is the Azure resource that stores custom images as named, numbered versions and replicates them to the regions where you deploy. For [Azure Virtual Desktop](/entity/azure-virtual-desktop/) it is the usual place for a session host image: host pools can select a gallery image when you create or add session hosts. This article covers how the pieces fit, how versions and replication behave, and which limits and costs apply.

For how a full image is built, tested, released and retired, see the sibling article "The golden image lifecycle: build, test, release, retire" (see also the [golden image](/entity/golden-image/) entity page).

## The three levels

Learn's [Azure Compute Gallery overview](https://learn.microsoft.com/en-us/azure/virtual-machines/azure-compute-gallery) describes gallery, image definition and image version as resources, which means you can share each one with Azure RBAC roles.

- **Gallery.** The container. Learn says gallery names can contain letters, digits, dots and underscores, but no dashes, and must be unique within the subscription ([create a gallery](https://learn.microsoft.com/en-us/azure/virtual-machines/create-gallery)).
- **Image definition.** A logical grouping with identity and requirements. Publisher, offer and SKU are used in combination, and each definition needs a unique set of the three. Definitions also carry the operating system type, the OS state (generalized or specialized, required), the Hyper-V generation, an architecture, features such as hibernation support, and a security type such as Trusted Launch supported ([share VM images in a compute gallery](https://learn.microsoft.com/en-us/azure/virtual-machines/shared-image-galleries)). The default generation depends on the API version. The older image definitions page says the default is generation 1, while the [gallery overview](https://learn.microsoft.com/en-us/azure/virtual-machines/azure-compute-gallery) says that starting with API 2025-03-03 new definitions default to generation 2 (V2) and Trusted Launch supported. Set the generation explicitly instead of relying on the default.
- **Image version.** The deployable copy. Learn says you do not deploy a VM from the definition but from the versions created from it.

For Azure Virtual Desktop, the generation matters. The [custom image templates](/entity/avd-custom-image-templates/) [article](https://learn.microsoft.com/en-us/azure/virtual-desktop/create-custom-image-templates) says the generation of the source image must match the generation set in the image definition, and that you should not create an image version yourself at that stage, because Azure Virtual Desktop does it when the build runs. For session host update, the [update how-to](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update-configure) adds that an image used with Trusted launch or Confidential virtual machines must be for generation 2 VMs. The [session host update article](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update) says the new image must be supported for Azure Virtual Desktop and for the generation of virtual machine.

## Versions

Learn says the version name must follow major.minor.patch with integers, and always uses that format. A version can come from a VM (generalized or specialized), a managed image, managed disks or snapshots, VHDs in a storage account, or another image version.

Selection rules:

- **latest.** When a deployment asks for latest, Azure chooses the highest major version, then minor, then patch.
- **Exclude from latest.** You can set it per version and per region, and Learn says the regional flag takes precedence over the global one.
- **End of life date.** The definition page says it is informational: users can still create VMs from older versions.
- **Editable later.** Regional replica count, target regions, exclude from latest and the end-of-life date can be updated after creation.

Pin a specific version in production host pools when you need repeatable builds. Use latest only where you accept that a newly published version is picked up by the next deployment. This is a practical suggestion, not a Learn rule. The session host update page does not say whether a latest reference is supported, so test it in a test host pool.

## Replication

Learn's [image version article](https://learn.microsoft.com/en-us/azure/virtual-machines/image-version) separates the region where you create the version from the target regions that receive copies. You need to replicate to the source region as well, so the first replica in the list is in the region where you created the image. The [gallery overview](https://learn.microsoft.com/en-us/azure/virtual-machines/azure-compute-gallery) says replication time depends on the amount of data copied and the number of regions, and can take a few hours in some cases. After replication completes in a region, you can deploy a VM or scale set from the version there.

Replica settings:

| Setting | What Learn says |
|---|---|
| Replica count | Set per region, or as a common count that regions inherit |
| Maximum | 100 replicas per image version; 50 are described as sufficient for most uses; a separate note gives 50 per region |
| Sizing rule | Keep one replica for every 20 VMs created concurrently |
| Production images | Keep a minimum of three replicas |
| Session host update | The how-to page recommends at least two replicas of the gallery image you use |
| Storage type | Standard LRS by default; Standard ZRS for regions with availability zones; the gallery page also mentions Premium LRS |
| Shallow replication | Supports images up to 32 TB, but you cannot deploy a large number of VMs from such a version, and Learn's What's new entry of January 2023 says shallow replication is only for test images |

The two replica recommendations come from different pages and have different scopes: the gallery overview speaks of at least three replicas for production images, while the session host update how-to speaks of at least two for the image you use. In our reading, size to the larger figure when you also deploy many hosts at once. The gallery overview gives both maximums: a maximum of 100 replicas per image version, and, in its recommendations list, a maximum of 50 replicas per region. It does not reconcile them. As a suggestion, treat 50 per region as the working ceiling.

For disaster recovery, Learn recommends at least two galleries in separate regions. Images cannot be replicated across clouds, and a gallery cannot be moved to another subscription.

### Create a version with replication

The image version article gives these portal steps once the image definition exists:

1. On the definition's **Get started** tab, select **Create a version**.
2. In **Region**, select the region where the image is created.
3. In **Version number**, enter a value such as 1.0.0, in major.minor.patch format with integers.
4. Choose the source, then on the **Replication** tab select the storage type and set the **Default replica count**, which you can override per region.
5. Add target regions, adjust their replica counts, then select **Review + create**.

The Azure CLI reference for `az sig image-version create` shows the same settings in one command. Its example copies a version to several regions with per-region replica counts and storage types:

```azurecli
az sig image-version create --resource-group MyResourceGroup \
--gallery-name MyGallery --gallery-image-definition MyImage \
--gallery-image-version 1.0.0 --replica-count 1 \
--storage-account-type Standard_ZRS --managed-image image-name \
--target-regions eastus2 ukwest=3 southindia=standard_lrs \
brazilsouth=2=standard_lrs
```

The reference says the home location of the image source must be in the list of target regions, and that the default replica count is 1 and the default storage type Standard LRS.

## Sharing

Learn recommends sharing at the gallery level and not sharing individual image versions. RBAC works for people, groups and service principals, including people outside the tenant. A direct shared gallery, which covers all users in a subscription or tenant, is labelled preview. It allows at most 30 subscriptions and 5 tenants, cannot contain encrypted image versions, and needs a gallery created with sharing permissions set to Groups. Community galleries publish images to all Azure customers, and Learn says the Publisher, Offer and SKU of their image definitions are publicly available ([community gallery](https://learn.microsoft.com/en-us/azure/virtual-machines/share-gallery-community)).

Within Azure Virtual Desktop, the cross-subscription case is documented in two ways. Two pages, both with a July 2026 update date, say it is not supported: the [session host update article](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update) says session host configurations do not currently support accessing a gallery image in a different subscription than the host pool, and the [update how-to](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update-configure) says that using a shared image in a different subscription from the host pool is not currently supported. The [What's new entry of September 2025](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new), titled "Managed identity support for all host pools using session host configuration and cross-subscription image support", lists "Support for accessing images hosted in another Azure subscription within the same tenant" among the managed identity changes. The pages disagree, and the newer dates sit on the "not supported" side, as the sibling articles on session host configuration and the golden image lifecycle also note. If you centralize images in a shared subscription, test a host pool that uses session host configuration with a managed identity before you rely on it.

## Using gallery images in a host pool

Gallery images appear in the host pool wizard. Under **Host pools**, the pool, **Session hosts**, **+ Add**, **Next: Virtual Machines**, the **Image** list includes images stored as an Azure Compute Gallery shared image or a managed image, and **See all images** shows more ([add session hosts](https://learn.microsoft.com/en-us/azure/virtual-desktop/add-session-hosts-host-pool)). Session host update is only available in the global Azure cloud. The image list described here applies to standard management. With a session host configuration the image is part of the configuration, which the sibling articles on session host configuration and on managing session host updates cover. If you build with custom image templates, the **Distribution targets** tab can write to a gallery, a managed image or both. For galleries you can set a version number, replicated regions, **Excluded from latest** and the storage account type. Leave the version blank and one is generated.

## Gallery or managed image

- **Hibernation:** an image definition can declare hibernation support, while managed images are not supported with hibernation.
- **Azure Image Builder source:** a managed image used as a source for a template must be in the same subscription and region as that template.

As a suggestion rather than a Learn rule, start a new image design with a gallery.

## Costs and limits

Learn says there is no extra charge for the gallery service. You pay for storage, billed on the occupied size of the image version times replicas times regions, and for egress when the first copy is replicated from the source region. Learn's example: a 127 GB OS disk occupying 10 GB, replicated to three regions with two replicas each, gives six snapshots of 10 GB.

Limits per subscription and region: 100 galleries, 1,000 image definitions and 10,000 image versions. Images must be smaller than 2 TB, and shallow replication supports up to 32 TB.

## A starting layout for AVD images

1. Create the gallery, with a resource lock, and separate galleries for test and production, as Learn suggests.
2. As a suggestion, create one image definition per OS and generation, with consistent publisher, offer and SKU.
3. As a suggestion, replicate only to regions with session hosts, with replicas sized for your deployment batch.

## Sources

Accessed 17 November 2026.

- [Microsoft Learn: Azure Compute Gallery overview](https://learn.microsoft.com/en-us/azure/virtual-machines/azure-compute-gallery)
- [Microsoft Learn: Share VM images in a compute gallery](https://learn.microsoft.com/en-us/azure/virtual-machines/shared-image-galleries)
- [Microsoft Learn: Create an image definition and an image version](https://learn.microsoft.com/en-us/azure/virtual-machines/image-version)
- [Microsoft Learn: Create an Azure Compute Gallery](https://learn.microsoft.com/en-us/azure/virtual-machines/create-gallery)
- [Microsoft Learn: Share images using a community gallery](https://learn.microsoft.com/en-us/azure/virtual-machines/share-gallery-community)
- [Microsoft Learn: az sig image-version](https://learn.microsoft.com/en-us/cli/azure/sig/image-version)
- [Microsoft Learn: Create custom image templates and custom images in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/create-custom-image-templates)
- [Microsoft Learn: Custom image templates in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/custom-image-templates)
- [Microsoft Learn: Session host update in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update)
- [Microsoft Learn: Update session hosts in a host pool with a session host configuration](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update-configure)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Microsoft Learn: What's new in Azure Compute Gallery](https://learn.microsoft.com/en-us/azure/virtual-machines/compute-gallery-whats-new)
- [Microsoft Learn: Add session hosts to a host pool](https://learn.microsoft.com/en-us/azure/virtual-desktop/add-session-hosts-host-pool)
- [Microsoft Learn: Azure VM hibernation overview](https://learn.microsoft.com/en-us/azure/virtual-machines/hibernate-resume)
- [Microsoft Learn: Azure VM Image Builder JSON template reference](https://learn.microsoft.com/en-us/azure/virtual-machines/linux/image-builder-json)
