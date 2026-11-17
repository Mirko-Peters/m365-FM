---
title: "Building a custom image template: apps, customisations and distribution"
summary: "A custom image template for Azure Virtual Desktop is built on seven portal tabs, then run with Start build. This walkthrough covers the decisions on each tab, how to order built-in and own scripts, where the image goes and what to check when a build fails."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-custom-image-templates, golden-image]
keypoints:
  - "The portal has seven tabs, from Basics to Review and create. Creating the template builds nothing: a build only starts when you select Start build."
  - "Customizations run in the order listed. Add built-in scripts such as FSLogix or Teams optimizations, or your own scripts from a public URI or a storage account the managed identity can read."
  - "The source image generation must match the gallery image definition; a mismatch is a documented validation failure. Build VM and session host sizes must match the generation too, per Learn."
  - "Distribute to a managed image, an Azure Compute Gallery or both. A blank gallery version is generated automatically; Excluded from latest set to Yes keeps a build out of latest."
  - "customization.log in the packerlogs container shows which script failed. Scripts have to exit with 0 and never wait for input."
faq:
  - q: "In what order should I add scripts to a custom image template?"
    a: "Learn says customizers run in the order specified and that one failure fails the whole customization. It gives no preferred order for apps. A sensible suggestion is to put language, profile and optimization settings first, your own application installs next and Apply Windows Updates last, so nothing installed afterwards is missed. Test the order on a build before you rely on it."
  - q: "Can I install my own applications with a custom image template?"
    a: "Yes. Choose + Add your own script, enter a name and a URI. The URI must be publicly reachable, for example GitHub or a web service, or a storage account where the managed identity has a role such as Storage Blob Data Reader. The script must exit with 0 and must not prompt for input. Microsoft Support does not handle customer-created scripts."
  - q: "Does the template itself deploy session hosts?"
    a: "No. The template builds an image. You then pick it when you create a host pool or add session hosts, under See all images, from your managed images or Azure Compute Gallery shared images. The VM size must match the image generation."
---

To build an image from a custom image template in Azure Virtual Desktop, you fill in seven tabs in the Azure portal, save the template and then select **Start build**. Azure Image Builder runs your customizations in the listed order, generalizes the image with [sysprep](/entity/sysprep/) and writes it to a managed image, an Azure Compute Gallery, or both. This article is the practical sequence: what to decide on each tab, how to arrange apps and settings, how to distribute the result and how to read a failed build.

The concept is explained elsewhere, and prerequisites, the template format and cost notes are in "Azure Image Builder for AVD: building images as code". The release and retirement stages are in "The golden image lifecycle: build, test, release, retire". Here the focus is the portal build itself. Microsoft announced general availability in the Azure public cloud in September 2023, with Azure Government and China in public preview at that time (Azure Virtual Desktop blog). The custom image templates pages on Learn carry no status label, so check the status for your cloud.

## Before you open the portal

Learn's [creation article](https://learn.microsoft.com/en-us/azure/virtual-desktop/create-custom-image-templates) asks for registered resource providers, a resource group, a user-assigned managed identity with a custom role and, optionally, a gallery and a virtual network. Three decisions from that list shape the rest of the work:

- **Generation.** If you distribute to a gallery, create the image definition first and choose generation 1 or 2. The source image generation must match it.
- **No pre-made version.** Create the gallery and the image definition, but not an image version. Learn says Azure Virtual Desktop creates the version.
- **Empty staging group.** If you name your own resource group for Azure Image Builder, it must be empty before the build starts.

## Step by step in the portal

Go to **Azure Virtual Desktop**, then **Custom image templates**, then **+ Add custom image template**.

1. **Basics.** Enter a template name, subscription, resource group, location and the managed identity. **Import from existing template** set to **Yes** starts a new template from an existing one.
2. **Source image.** Choose the source type: **Platform image (marketplace)**, **Managed image** or an Azure Compute Gallery image (name, image definition, version). Each list shows the generation. A managed image has to be in the same subscription and location as the Basics tab. Confidential VM and Trusted Launch support is inherited from Azure VM Image Builder.
3. **Distribution targets.** Tick a managed image, an Azure Compute Gallery image, or both. The fields are described below.
4. **Build properties.** Set the build timeout, the build VM size (it must match the source generation), the OS disk size and an optional staging group, build VM managed identity, virtual network and subnet.
5. **Customizations.** Add built-in scripts and your own scripts, then order them.
6. **Tags.** A default tag `AVD_IMAGE_TEMPLATE : AVD_IMAGE_TEMPLATE` is added automatically.
7. **Review and create.** Select **Create**. Learn says the template can take about 20 seconds to appear, so use **Refresh** under **Custom image templates**.

Creating the template does not build anything. To build, tick the template in the list, select **Start build** and use **Refresh** to follow progress. The template name opens the **Build run state**.

## Choosing the build timeout and network

The timeout field is the maximum wait for the whole build, including customizations, validations and distributions. Learn advises a higher value when you use the Language Pack or Configure Windows Optimization scripts, because Windows Update runs automatically for them. The portal page gives no default. The underlying Image Builder template reference states a default of 240 minutes, a range of 6 to 960 and advice not to go below 60 for Windows.

If you leave the virtual network blank, the custom image templates page says a temporary virtual network, subnet and public IP address are created. The Image Builder networking page describes a different layer, how the service reaches the build VM through a container instance, and says Image Builder does not deploy a public IP for direct connectivity; it does not say whether the build VM itself gets a public IP address. Check the staging resource group after a first build to see what was created in your subscription. The build VM needs internet access to download built-in and own scripts. If you choose your own subnet, check its outbound access: the Image Builder release notes say that after 31 March 2026 new virtual networks in Azure default to private subnets without default outbound access, and that a subnet specified for the build VM must have outbound access enabled if the build needs it. The managed identity also needs access to an existing virtual network or its resource group, and a private service policy on the subnet must be disabled, or the build fails with `PrivateLinkService Network Policy is not disabled for the given subnet`.

## Planning the customization list

Customizers run in the order listed, and one failure fails the whole customization. The **Move up**, **Move down**, **Move to top** and **Move to bottom** actions set the order.

Learn's overview gives these built-in scripts as examples, so the list may not be complete:

- Install language packs, and set the default language
- Enable time zone redirection
- Disable Storage Sense
- Install [FSLogix](/entity/fslogix/) and configure Profile Container, or enable FSLogix with Kerberos
- Enable RDP Shortpath for managed networks
- Enable screen capture protection
- Configure Teams optimizations (the WebRTC redirector service and the Visual C++ Redistributable)
- Configure session timeouts
- Disable automatic updates for MSIX applications
- Add or remove Microsoft Office applications
- Apply Windows Updates

Built-in scripts restart where needed and are stored in the Azure RDS-Templates GitHub repository. Removing or uninstalling the Microsoft Store app is not supported.

The following order is an illustration for a pooled host pool, not a Learn recommendation:

| Position | Item | Reason |
|---|---|---|
| 1 | Language packs and default language | Triggers Windows Update, so it is a long step |
| 2 | FSLogix and Profile Container | Settings that apply to every host |
| 3 | Teams optimizations, session timeouts, time zone redirection | Configuration steps |
| 4 | Office add or remove, then your own app scripts | Apps most likely to change between builds |
| 5 | Apply Windows Updates | Last in this illustration, so updates run after the installs |

Apps that change often may not belong in the image at all. "MSIX app attach explained" covers delivering them separately.

### Writing your own app script

**+ Add your own script** takes a name and a URI. Learn requires a publicly available location such as GitHub or a web service, or a storage account where the managed identity has a role such as **Storage Blob Data Reader**. If the address is unreachable, the build reports `Resource <URI> is unavailable. Please check the file exists, and that Image Builder can access it.` The portal page lists only a name and a URI and does not say what kind of script is expected or which account runs it; the skeleton below is our assumption of a Windows PowerShell script. The Image Builder troubleshooting guidance adds these rules for script customizations:

- The script must return exit code 0. A nonzero code fails the build, and a script must not prompt for input.
- Print progress with `Write-Host` so the lines can be found in `customization.log`.
- Use `Invoke-WebRequest` inside the script for large downloads. The Image Builder File customizer is meant for files under 20 MB and is not a portal option.

A skeleton, with placeholders and untested, which only shows the shape:

```powershell
Write-Host "Installing <app name>"
Invoke-WebRequest -Uri "<installer URL>" -OutFile "C:\Windows\Temp\<installer file>"
$p = Start-Process -FilePath "C:\Windows\Temp\<installer file>" -ArgumentList "<silent switches from the vendor>" -Wait -PassThru
Write-Host "Exit code: $($p.ExitCode)"
$successCodes = @(0)   # add the vendor's documented success codes
if ($successCodes -contains $p.ExitCode) { exit 0 } else { exit $p.ExitCode }
```

Check with the vendor which exit codes mean success and map them to 0 in the script, because a nonzero code fails the build and the portal page lists no field for valid exit codes. Microsoft Support does not handle customer-created scripts or modified copies of Microsoft scripts. Issues with the built-in ones can be raised at the RDS-Templates repository.

## Distribution: managed image or gallery

For a **managed image**, give the resource group, image name (existing or **Create a managed image**), location and a run output name. If the group differs from the one on Basics, add the same role assignment for the managed identity there.

For an **Azure Compute Gallery** target, set the gallery, image definition and a run output name. The remaining fields:

- **Gallery image version.** Optional. If left blank, a version is generated automatically. The portal page does not say which numbering scheme is used.
- **Replicated regions.** The template region is selected automatically.
- **Excluded from latest.** **Yes** stops this version being used when `latest` is specified in the image reference. Otherwise choose **No**. It can be changed later.
- **Storage account type.** Type and redundancy of the stored image.

"Azure Compute Gallery for AVD images: versions and replication" covers replica counts, and the golden image lifecycle article covers retirement.

## Using the image

When adding session hosts, the Virtual Machines tab offers the default image list and **See all images**, which includes images you stored as an Azure Compute Gallery shared image or a managed image. Learn's creation article describes the path as **See all images**, then **My Items**, then **My Images** (managed images) or **Shared Images** (gallery). Choose a VM size that matches the image generation.

## When a build fails

Open `customization.log` first. By default it is in the `packerlogs` container of the storage account in the `IT_<ResourceGroupName>_<TemplateName>_<GUID>` resource group, in a folder named by GUID; if you named a staging group, look there. Entries for built-in scripts begin `Starting AVD AIB Customization: {<Script name>}`. Search for `(telemetry)` from the bottom of the log to find the last customizer that ran.

| Symptom | Cause | Fix |
|---|---|---|
| You named your own staging resource group and it is not empty | Must be empty before the build starts | Delete its resources or set a new group on Build properties |
| Validation error about Hyper-V version | Source generation differs from the gallery image definition | Match the two generations |
| `Microsoft.ContainerInstance/register/action` authorization error | Resource provider not registered | Register Microsoft.ContainerInstance and retry |
| `Timeout waiting for microservice to complete: 'context deadline exceeded'` | Build too slow or a customizer is waiting for input | Find the last customizer, suppress prompts, raise the timeout or use a larger build VM |
| `Error publishing MDI to Azure Compute Gallery ... context deadline exceeded` | Replication wait ran out of time | Raise the build timeout |
| Language install fails on a Windows 10 Enterprise or multi-session image | Group policy blocks language packs, or no Windows Update access | Check Restrict Language Pack and Language Feature Installation, and connectivity |

The portal can also show a red X on **Source image** when the type is a gallery. Learn says to go back to **Basics** and forward again.

## Sources

- [Microsoft Learn: Use custom image templates to create custom images - Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/create-custom-image-templates)
- [Microsoft Learn: Custom image templates in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/custom-image-templates)
- [Microsoft Learn: Troubleshoot custom image templates in Azure Virtual Desktop](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-desktop/troubleshoot-custom-image-templates)
- [Microsoft Learn: Troubleshoot Azure VM Image Builder](https://learn.microsoft.com/en-us/azure/virtual-machines/linux/image-builder-troubleshoot)
- [Microsoft Learn: Azure VM Image Builder template reference](https://learn.microsoft.com/en-us/azure/virtual-machines/linux/image-builder-json)
- [Microsoft Learn: Azure VM Image Builder networking options](https://learn.microsoft.com/en-us/azure/virtual-machines/linux/image-builder-networking)
- [Microsoft Learn: What's new in Azure VM Image Builder](https://learn.microsoft.com/en-us/azure/virtual-machines/image-builder-api-update-release-notes)
- [Microsoft Learn: Add session hosts to a host pool](https://learn.microsoft.com/en-us/azure/virtual-desktop/add-session-hosts-host-pool)
- [Azure Virtual Desktop blog: Announcing general availability of Azure Virtual Desktop custom image templates](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/announcing-general-availability-of-azure-virtual-desktop-custom/3909907)
