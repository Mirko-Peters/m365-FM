---
title: "Profile container vs Office container: how to decide"
summary: "Microsoft Learn recommends a single FSLogix profile container and calls the Office container (ODFC) optional; its pages differ on when to use both. This guide shows how to decide between them."
status: review
publish: false
author: mirko-p
date: 2026-11-18
render: v2
topics: [fslogix-office-container, fslogix]
keypoints:
  - "Learn calls a single profile container with profile and Office data in one VHD(x) the recommended configuration, unless business or workload requirements need separation."
  - "Learn's container types page lists four conditions for using both containers; the ODFC page calls the dual setup unnecessary. Our reading: single container by default, a second for a named need."
  - "The four conditions: separate storage location, isolation from corruption in one container, a choice of Office components, and different sizes (e.g. 10 GB profile, 50 GB ODFC)."
  - "With a third-party roaming profile product, Learn recommends the Office container in a single container configuration and excluding its paths from that product. Learn uses that term two ways."
  - "You can convert a single container to profile plus Office later. FSLogix copies the data into the new container, but the original stays in the profile container until removed manually."
faq:
  - q: "Do I need an Office container to use Microsoft 365 apps with FSLogix?"
    a: "No. The FSLogix FAQ says the Office container is primarily used in VDI solutions where another roaming profile product is used, and to always use a single profile container unless business or workload requirements need the separation. The ODFC page adds that all benefits of the Office container are automatic with profile containers in a single container configuration."
  - q: "Can I use an Office container together with a third-party roaming profile product?"
    a: "Yes, Learn recommends this. The ODFC page's Important box says using the ODFC container in a single container configuration is recommended with third-party roaming profile solutions, and the same page says the folders it manages should not be roamed by the other product. Our reading: in that bullet, single container means the Office container next to the other product's profile, not next to an FSLogix profile container."
  - q: "What happens to my data when I move from one container to two?"
    a: "The FAQ says FSLogix copies the data from the profile container when the Office container is created, and that the original data is not removed. Plan to remove the old copy manually and to check container sizes afterwards."
---

Use one FSLogix profile container per user unless you can name a specific reason for a second one. Microsoft Learn describes the single container, which holds profile and Office data in the same VHD(x) file, as the recommended configuration, and the separate Office container (ODFC) as optional. This guide gives a short way to decide, then the points that differ per outcome. For the settings, the Include table and verification, see [FSLogix Office container: when to separate Office data from the profile](https://www.m365.fm/community/u/mirko-p/blog/fslogix-office-container-when-to-separate-office-data-from-the-profile/) in this series.

## What each container holds

The [profile container](https://www.m365.fm/entity/fslogix-profile-container/) stores the user profile data, which Learn describes as nearly everything under `C:\Users\<username>`, apart from the exclusions FSLogix applies. The [Office container](https://www.m365.fm/entity/fslogix-office-container/), short for Office Data and Files Container (ODFC), is meant for profile content that is unique to Microsoft Office applications. Learn's examples of Office data are the Office apps, OneDrive, Teams, SharePoint and OneNote, and Learn calls the Office container a subset of the profile container.

## Where the two Learn pages differ

Learn's container types page says: "Profile and ODFC containers should be used together when" four conditions apply, listed in the next section.

Learn's Configure ODFC containers page says there is "no need or benefit" to using the ODFC container when profile containers are your primary profile management solution. It also says the ODFC container can optionally be used with profile containers in a dual container configuration, to place Microsoft 365 app data in a different VHD. In its Important box it adds that using the ODFC container in a dual container configuration "isn't necessary or recommended". The FAQ points the same way: always use a single profile container unless your business or workload requirements need the separation.

The pages do not reconcile these statements. Our reading: single container is the default, and the four conditions describe what a second container gives you. Add one when a requirement from the list applies. The container types page does not say whether one condition is enough or all must apply, so test each against your own requirement.

A second source of confusion is the phrase "single container configuration". The configuration examples page uses a "Single container" row in Examples 1 to 6 for one profile container with no ODFC container configured. In Example 7 (Complex + Disaster Recovery, active / active), the same row says "A Profile and ODFC container exists or is created for each user." The container types page uses the phrase only in footnote 4, without defining it. The ODFC page uses it twice, with two meanings. Its opening paragraph says all benefits of the ODFC container are automatic "when using profile containers in a single container configuration", which means a profile container without an ODFC container. Its Important box says "Using the ODFC container in a single container configuration is recommended with third party roaming profile solutions". Our reading: in that Important bullet it means the Office container used next to the other product's profile. That fits the container types page, which says the ODFC container is most commonly implemented alongside other roaming profile solutions.

## A quick decision table

| Your situation | Choice | Basis |
|---|---|---|
| No special requirements | One profile container | Recommended configuration (container types page, FAQ) |
| Another roaming product already handles the profile | Office container next to that product, with exclusions | ODFC page, Important box |
| Office data needs a different storage location | Profile plus Office container | Condition 1 |
| Isolation from loss or corruption in one container | Profile plus Office container | Condition 2 |
| You want to choose which Office components are included | Profile plus Office container | Condition 3, not available in a single container |
| A workload or OneDrive-synced data needs a different container size | Profile plus Office container | Condition 4 |

The last four rows rest on the container types page. The ODFC page's "isn't necessary or recommended" applies to the same configuration, so treat them as deliberate choices and record why.

## The four conditions on the container types page

1. **Separate storage location.** You want discretion over where Office data sits compared with the rest of the profile. Each container has its own `VHDLocations` value, and Nerdio's help page says the two containers can be stored on different file shares.
2. **Isolation.** Data loss or corruption in one container does not affect the other. Learn's footnote says the Office container is not backed up or replicated to alternate locations, because its data is recoverable from the source. The same page says Cloud Cache is an optional configuration for profile and ODFC containers; see the [Cloud Cache](https://www.m365.fm/entity/fslogix-cloud-cache/) articles in this series.
3. **Component choice.** You choose which Office components have their data included in the container. Learn notes this is not available with a single container configuration.
4. **Different sizes.** Learn's footnote says: configure 10 GB profile container with a 50 GB ODFC container. The page ties different sizes to specific workloads or data synced from OneDrive. The default `SizeInMBs` for both container types is 30000 MB. Our reading: use the 10 GB and 50 GB figures as Learn's example for that case, and measure your own data before you size.

## What a second container adds

- **Two sets of settings.** The Office container has its own registry location, `HKLM\SOFTWARE\Policies\FSLogix\ODFC`, with its own `Enabled`, `VHDLocations` and `SizeInMBs` values. Our reading: that is more to keep consistent in a Group Policy object.
- **Two VHD(x) files per user.** Learn's verification steps end with both a profile and an ODFC VHDX file in the user's folder. Each needs space and a path.
- **A recovery premise.** Learn's footnote says the Office container is not backed up because its data is recoverable from the source. If your recovery plan needs Outlook or OneDrive cache data to survive a loss, check that premise first.

## Decide in five steps

1. **Check for another roaming product.** If one manages the profile, plan an Office container next to it and see "With a third-party roaming product" below.
2. **If FSLogix handles the whole profile, assume one container.** Write down the requirement that would justify a second one.
3. **Test each of the four conditions against a real requirement**, such as "OneDrive data must sit on a different share" or "we want to choose which Office components are included". If none fits, stop here.
4. **If one fits, decide the Include settings and sizes**, then pilot with a small group.
5. **Record the decision**, so that the next administrator knows why two VHD(x) files exist per user.

One caution for step 4: the Include settings decide which data is redirected into the Office container, and `IncludeTeams` does more than that. The reference page's default is 0. With 0, Teams data is not redirected to the ODFC container and the new Teams AppX package is not registered during sign-in. With 1, Teams data is redirected and the new Teams AppX package is registered by family name during sign-in. The ODFC page lists `IncludeTeams = 1` as recommended. The reference page does not say whether the setting keeps that data out of the profile. To keep folders out of a container, see the [redirections.xml](https://www.m365.fm/entity/fslogix-redirections-xml/) article in this series. The series article "New Teams on AVD with FSLogix: what to know" covers the Teams details.

## Add an Office container next to a profile container

Learn's setup steps use the registry path `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\FSLogix\ODFC`. `Enabled` (DWORD, 1) is required, and `VHDLocations` points to your SMB share. Learn warns that changing `FlipFlopProfileDirectoryName` in an existing environment can cause users to get new profiles.

The PowerShell examples on the ODFC page write to `HKLM:\SOFTWARE\FSLogix\ODFC\` instead, and the page does not say why. The Group Policy templates page explains that settings under `HKLM\SOFTWARE\FSLogix` are treated as preferences and stay on the virtual machine when a Group Policy is removed or set to Not Configured, while ODFC settings under the Policies path reset themselves. Our advice: use the Policies path, and confirm after deployment which values your hosts apply. The Office container explainer in this series has the full value list and the verification steps (`frx list-redirects`, and both VHDX files in the user's `VHDLocations` folder).

## With a third-party roaming product

Learn recommends the Office container in a single container configuration here. It says the folders the Office container manages should not be roamed by the other product, and that the paths to exclude depend on which Include settings you enable. The ODFC page has the exclusion table, with one row per Include setting; the Office container explainer lists examples. `IncludeSharepoint` lists no exclusion path there.

## If you manage the hosts with Nerdio

Nerdio's FSLogix help page for [Nerdio Manager for Enterprise](https://www.m365.fm/entity/nerdio-manager-for-enterprise/) describes the Office container as a part of a profile storage configuration. Under **Cloud Desktops > Azure Virtual Desktop > Host Pool Profiles**, select **New profile**, then **FSLogix**, and under FSLogix Profiles storage select **Add**. The page says Office containers separate Microsoft Office data, for example OST files, from the overall user profile for easier troubleshooting. It describes these Office container options:

- A toggle to redirect only the areas of the profile that are specific to Microsoft Office.
- A field for the FSLogix Office Container path (VHDLocation).
- FSLogix Office Container Registry Options, where an Edit mode list offers All settings or Advanced. For the profile field (FSLogix Registry Options), the page describes Advanced entries as DWORD values in the format `"ValueName":dword:ValueData` and string values as `"ValueName":"ValueData"`, for example `"VolumeType":"vhdx"`. The page gives no format for the Office container field. Our reading: Include settings such as `IncludeTeams` are entered the same way, but check the field in your version.

The page also says session hosts should not receive conflicting FSLogix configurations from Group Policy. If you use Nerdio Manager for the registry values, avoid setting the same ODFC values in a GPO.

## Changing your mind later

Moving from a single container to profile plus Office container is supported. The FAQ says that when the Office container is created, FSLogix copies the data from the profile container and does not remove the original, so the profile container keeps the Office data until you delete it. The FAQ covers only the conversion from one container to two and does not describe the reverse path, so test it before you promise it.

The OneDrive disk space policies check the FSLogix VHD rather than the operating system disk when containers are in use, according to the FAQ. Size the container that holds OneDrive data with that in mind. The FAQ also says container size does not affect sign-in times or performance, so a second container is not a fix for slow sign-ins.

## Sources

- [Microsoft Learn: Types of containers](https://learn.microsoft.com/en-us/fslogix/concepts-container-types)
- [Microsoft Learn: Configure ODFC containers](https://learn.microsoft.com/en-us/fslogix/how-to-configure-odfc-containers)
- [Microsoft Learn: FSLogix configuration settings reference](https://learn.microsoft.com/en-us/fslogix/reference-configuration-settings?tabs=odfc)
- [Microsoft Learn: Use FSLogix Group Policy template files](https://learn.microsoft.com/en-us/fslogix/how-to-use-group-policy-templates)
- [Microsoft Learn: FSLogix configuration examples](https://learn.microsoft.com/en-us/fslogix/concepts-configuration-examples)
- [Microsoft Learn: FSLogix FAQ](https://learn.microsoft.com/en-us/fslogix/overview-faq)
- [Nerdio Manager for Enterprise: FSLogix settings and configuration](https://nmehelp.getnerdio.com/hc/en-us/articles/25499417371661-FSLogix-settings-and-configuration)
