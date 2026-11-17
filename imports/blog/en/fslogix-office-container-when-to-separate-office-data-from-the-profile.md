---
title: "FSLogix Office container: when to separate Office data from the profile"
summary: "Microsoft Learn recommends one FSLogix profile container that holds both profile and Office data, and describes a separate Office container (ODFC) as optional. Separate only when you need a different storage location, isolation, per-component control or different sizes."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [fslogix-office-container, fslogix]
keypoints:
  - "By default a profile container holds all profile and Office content in one VHD(x). Learn calls that the recommended configuration and says the ODFC container brings no extra benefit when profile containers are your primary solution."
  - "Learn names four reasons to use both containers: a separate storage location, isolation from loss or corruption in one container, control over which Office components are included, and different container sizes (its example is a 10 GB profile container with a 50 GB ODFC container)."
  - "Two Learn pages pull in different directions: the ODFC configuration page says the dual-container setup is not necessary or recommended, the container types page lists four situations for using both. Learn recommends ODFC in a single container configuration with third-party roaming profile products; it does not define the term, and in our reading it means ODFC without a profile container."
  - "ODFC includes Office activation, Outlook, Outlook personalization, SharePoint, OneDrive and Skype for Business by default. IncludeTeams, IncludeOneNote and IncludeOneNote_UWP default to 0."
  - "Converting from single to dual is possible: FSLogix copies the data into the new ODFC container and leaves the original data in the profile container for you to remove manually."
faq:
  - q: "Do I need an Office container to run Microsoft 365 apps with FSLogix?"
    a: "No. Learn's FAQ says the ODFC container is primarily used in VDI solutions where another roaming profile product is used, and advises using a single profile container unless business or workload requirements need the separation. The Configure ODFC containers page adds that profile containers already include all the benefits of ODFC containers."
  - q: "What happens to my existing data if I add an ODFC container later?"
    a: "Learn's FAQ says that when the ODFC container is created, FSLogix copies the data from the profile container, but the original data is not removed. The original data must be removed manually, so until then it also remains in the profile container."
  - q: "Can two sessions of one user share an ODFC container?"
    a: "Not within the same Azure Virtual Desktop host pool, according to Learn. Concurrent connections (a second session of the same user on the same computer) are not supported there, and the Configuration Examples page says Azure Virtual Desktop does not support multiple connections within the same host pool. Where multiple connections (a new session on a different computer) are used at all, Learn supports them only with difference disks, and the reference lists VHDAccessMode 1, 2 and 3 while the concurrent connections page names 3. With IncludeOneDrive at its default of 1, Learn says OneDrive does not support concurrent or multiple connections to the same container under any circumstance."
---

Microsoft Learn's default answer is not to separate: a single profile container holds both profile and Office data, and Learn's FAQ says to use one profile container unless business or workload requirements need the separation. A separate Office container (ODFC) is worth the extra file only when you need a different storage location, isolation between the two data sets, per-component control or different sizes. This article explains what the container holds, the four reasons Learn gives, and the settings that change once you split.

To decide step by step, see [Profile container vs Office container: how to decide](/community/u/mirko-p/blog/profile-container-vs-office-container-how-to-decide/).

## What the Office container is

An [FSLogix Office container](/entity/fslogix-office-container/) is a VHD(x) that stores profile content unique to Microsoft Office applications. Learn's [container types page](https://learn.microsoft.com/en-us/fslogix/concepts-container-types) lists Office apps, OneDrive, Teams, SharePoint and OneNote as examples and says ODFC is most commonly implemented alongside other roaming profile solutions, for example traditional roaming profiles, Citrix User Profile Management or VMware Dynamic Environment Manager. The default contents are:

- Office activation
- Outlook
- Outlook personalization
- SharePoint
- OneDrive
- Skype for Business (legacy support)

Learn adds that most of this data comes from remote systems and is easily replaced if the container is corrupted or deleted. Its example is that Outlook data files are generated from remote email servers such as Microsoft 365.

## The default: one container

The same page says that, unless configured otherwise, the [profile container](/entity/fslogix-profile-container/) holds all profile and ODFC content in the same VHD(x), and that this is the recommended configuration. The [Configure ODFC containers page](https://learn.microsoft.com/en-us/fslogix/how-to-configure-odfc-containers) is more direct: all ODFC benefits are automatic in a single-container configuration, there is no need or benefit to ODFC when profile containers are your primary solution, and if you have already configured a profile container you do not need an ODFC container.

Its Important box separates two cases:

- ODFC in a single container configuration is recommended with third-party roaming profile solutions. Learn does not define the term here; our reading is that it means ODFC without a profile container, next to the other product's profile. The page says to exclude the paths ODFC manages from the other product's roaming.
- ODFC in a dual-container configuration, alongside a profile container, is described as not necessary or recommended.

## Two Learn pages, two emphases

The Configure ODFC containers page calls the dual configuration not necessary or recommended. The container types page, in the next section, lists four situations in which profile and ODFC containers should be used together. Learn does not reconcile the two statements, and it uses the phrase single container configuration in more than one sense: for one profile container that holds everything (the Configure ODFC containers page, footnote 4 on the container types page, and Examples 1 to 6 on the Configuration Examples page, where ODFC is not configured), for a profile plus an ODFC container (Example 7 on that page uses the row label "Single container" for exactly that), and, in the Important box, for ODFC next to a third-party product. Our reading is that the four situations are the exceptions to the default, and the FAQ wording points the same way: always use a single profile container unless your business or workload requirements need the separation.

## Four reasons Learn gives for using both

Learn lists these as the situations where profile and ODFC containers should be used together:

| Reason | What it means in practice |
|---|---|
| Discretion over storage location | Office data and other profile data can sit in different storage locations; the ODFC container has its own VHDLocations setting |
| Isolation from loss or corruption | Learn's wording is isolation from data loss or corruption in one of the containers; it notes ODFC is not backed up or replicated because its data is recoverable from the source |
| Choice of Office components | The Include settings pick which components are redirected, which a single container cannot do |
| Different container sizes | Learn's example is a 10 GB profile container with a 50 GB ODFC container, for specific workloads or OneDrive-synced data |

If none of the four applies to your environment, the page gives no reason to split.

## What changes when you split

**Two files, two ceilings.** Each container has its own SizeInMBs, and Learn's reference gives 30000 as the default for both. With defaults left in place, a split therefore allows more total space per user (our reading), so set both values on purpose. The mechanics of sizing are covered in [the profile container settings article](/community/u/mirko-p/blog/profile-container-settings-that-matter-size-locking-and-concurrency/).

**Two sets of settings.** The reference documents ODFC settings only under HKEY_LOCAL_MACHINE\SOFTWARE\Policies\FSLogix\ODFC, and the steps on the Configure ODFC containers page use that path. Learn's [Group Policy templates page](https://learn.microsoft.com/en-us/fslogix/how-to-use-group-policy-templates) explains the two branches: settings under HKLM\SOFTWARE\FSLogix are preferences, not policies, so if a Group Policy is removed or set to Not Configured the registry value stays on the machine, while ODFC settings under SOFTWARE\Policies\FSLogix\ODFC reset themselves. The PowerShell example on the Configure ODFC containers page writes to HKLM:\SOFTWARE\FSLogix\ODFC instead, a key the reference does not list for ODFC, and Learn does not say why the example uses it. If you copy the example, confirm which key your hosts and policies actually use, and check the result with frx list-redirects as shown below. The example also does not set IncludeTeams, although the table on the same page lists IncludeTeams = 1 as recommended.

The page's other values are Enabled = 1 (required), VHDLocations (an SMB path such as \\<storage-account-name>.file.core.windows.net\<share-name>), and recommended FlipFlopProfileDirectoryName = 1, VolumeType = VHDX, LockedRetryCount = 3, LockedRetryInterval = 15, ReAttachIntervalSeconds = 15 and ReAttachRetryCount = 3.

**A copy, not a move.** The FAQ says that on conversion from single to dual, FSLogix copies the data from the profile container when the ODFC container is created, and the original data is not removed. Remove it manually, or the profile container keeps carrying the Office data.

## Choosing what goes in: the Include settings

The ODFC reference lists these toggles. Each is a DWORD, and 1 means redirected to the container.

| Setting | Default | Notes from Learn |
|---|---|---|
| IncludeOfficeActivation | 1 | Specific to Office 2016 and later |
| IncludeOneDrive | 1 | OneDrive cache; no concurrent connections to the same container |
| IncludeOneNote | 0 | OneNote notebook files |
| IncludeOneNote_UWP | 0 | OneNote UWP notebook files |
| IncludeOutlook | 1 | Supports classic Outlook and new Outlook for Windows; applies to ODFC configurations only |
| IncludeOutlookPersonalization | 1 | Does not apply to new Outlook for Windows |
| IncludeSharepoint | 1 | SharePoint data |
| IncludeSkype | 1 | Skype for Business Global Address List |
| IncludeTeams | 0 | Classic and new Teams; when 1, new Teams is registered by family name at sign-in |

Two cautions follow. IncludeTeams is off by default, so if you run a separate ODFC container and want Teams data in it, set it; [the article on new Teams with FSLogix](/community/u/mirko-p/blog/new-teams-on-avd-with-fslogix-what-to-know/) covers version requirements. And the Outlook paths differ by client: classic Outlook uses the Roaming and Local Microsoft\Outlook folders, while new Outlook for Windows uses a package folder and %LocalAppData%\Microsoft\olk. Settings such as OutlookCachedMode and MirrorLocalOSTToVHD are likewise documented as not applying to new Outlook.

### Excluding the same paths from another roaming product

If a third-party product also roams the profile, Learn says the folders ODFC manages should not be roamed by that product, and the paths depend on which Include settings are on. Examples from the Configure ODFC containers page: with IncludeOutlook, %userprofile%\AppData\Local\Microsoft\Outlook; with IncludeOneDrive, %userprofile%\AppData\Local\Microsoft\OneDrive; with IncludeOfficeActivation, %userprofile%\AppData\Local\Microsoft\Office\16.0\Licensing. For IncludeSkype the table lists %userprofile%\AppData\Local\Microsoft\Office\15.0\Lync and \AppData\Local\Microsoft\Office\16.0\Lync, the second without the %userprofile% prefix. The IncludeSharepoint row has no exclusion path.

## Concurrent sessions work differently for ODFC

Profile containers use ProfileType. The ODFC container uses VHDAccessMode, which Learn defines this way:

| Value | Behavior |
|---|---|
| 0 | Direct access; the simplest model, only one concurrent session (default) |
| 1 | A difference disk on the network; allows simultaneous sessions |
| 2 | A difference disk on the local machine; allows simultaneous sessions |
| 3 | A unique VHD(x) for each concurrent session, usually kept for the next session |

Learn's conditions: all sessions using the VHD concurrently must have a matching VHDAccessMode, and if access is not concurrent it should be 0. Modes 1 and 2 should not be used with Outlook cached mode; if the ODFC container is used with cached mode, use 0 or 3. NumSessionVHDsToKeep, default 2, applies to mode 3 and sets how many session VHDs persist.

The [concurrent connections page](https://learn.microsoft.com/en-us/fslogix/concepts-multi-concurrent-connections) separates two cases. Concurrent connections are a second session of the same user on the same computer; its warning says they are not supported by session hosts in an [Azure Virtual Desktop](/entity/azure-virtual-desktop/) host pool. Multiple connections are a new session on a different computer, supported only with difference disks; however, the Configuration Examples page states that Azure Virtual Desktop does not support multiple connections within the same host pool. For ODFC the page says VHDAccessMode needs to be 3 to use either, while the reference describes modes 1 and 2 as allowing simultaneous session access. Learn does not reconcile the two pages; treating the narrower statement as the safer one is our reading. The page also lists fDenyTSConnections and fSingleSessionPerUser, both set to 0 under HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server, as required settings for concurrent connections. Session-based files are named ODFC-%username%-SESSION-<SessionNumber>.VHD(x), numbered 0 to 9, so at most 10 exist.

Separately, a warning on the concurrent connections page says that OneDrive does not support concurrent or multiple connections using the same container, under any circumstance. IncludeOneDrive defaults to 1.

## Recovery, backup and shared behavior

Learn notes that the ODFC container is not backed up or replicated to alternate locations because its data is recoverable from the source. That holds for data that exists elsewhere. If users keep data in the container that exists nowhere else, for example OneNote notebook files stored locally after you set IncludeOneNote to 1, that data would need the same protection as the profile. That is our reading; Learn does not state it.

Some behavior applies to both containers regardless. Learn describes [Cloud Cache](/entity/fslogix-cloud-cache/) as an optional configuration for profile and ODFC containers, not a container type. Learn says VHD disk compaction affects Profile and ODFC containers and runs every time a user signs out. The CleanupInvalidSessions setting, off by default, applies to the next sign-in after a session ended abruptly: FSLogix then tries to clean up the invalid session so the container can attach, and the setting affects both container types.

## Verify the split

Sign in as a standard user and run frx list-redirects from C:\Program Files\FSLogix\Apps. In Learn's sample output, paths such as the Outlook, OneDrive, Office licensing and Teams folders are listed as redirections from \Device\HarddiskVolume4 to targets under \Device\HarddiskVolume6, for example the Outlook folder to \Device\HarddiskVolume6\ODFC. Learn does not explain the volume numbers. Then open the folder set in VHDLocations and confirm the user's folder holds the ODFC VHDX. Learn's steps also look for the profile VHDX there; our reading: with separate locations, check the profile container's own VHDLocations path.

## Sources

- [Microsoft Learn: FSLogix container types](https://learn.microsoft.com/en-us/fslogix/concepts-container-types)
- [Microsoft Learn: Configure ODFC containers](https://learn.microsoft.com/en-us/fslogix/how-to-configure-odfc-containers)
- [Microsoft Learn: FSLogix configuration examples](https://learn.microsoft.com/en-us/fslogix/concepts-configuration-examples)
- [Microsoft Learn: FSLogix configuration settings reference](https://learn.microsoft.com/en-us/fslogix/reference-configuration-settings?tabs=odfc)
- [Microsoft Learn: FSLogix frequently asked questions](https://learn.microsoft.com/en-us/fslogix/overview-faq)
- [Microsoft Learn: Concurrent and multiple connections to a single container](https://learn.microsoft.com/en-us/fslogix/concepts-multi-concurrent-connections)
- [Microsoft Learn: VHD disk compaction](https://learn.microsoft.com/en-us/fslogix/concepts-vhd-disk-compaction)
- [Microsoft Learn: Use FSLogix Group Policy template files](https://learn.microsoft.com/en-us/fslogix/how-to-use-group-policy-templates)
