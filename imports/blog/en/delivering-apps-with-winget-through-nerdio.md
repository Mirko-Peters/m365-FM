---
title: "Delivering apps with Winget through Nerdio"
summary: "Nerdio Manager's Unified Application Management uses Winget packages from the public community repository or a private repository in your own Azure subscription, and installs them on session hosts through deployment policies. This article covers the repository setup, the import and policy steps, and the documented limits."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [nerdio-unified-app-catalog]
keypoints:
  - "Nerdio's Unified Application Management (UAM) lets you pick apps from a Winget repository and deploy them to AVD host pools or Intune-managed devices with a deployment policy instead of running winget by hand."
  - "The public Winget community repository is read-only in UAM. Only a private Winget repository, created in your own Azure subscription, lets you upload installers, set custom install commands and keep several versions."
  - "Imports need silent install arguments for unattended installs, and only Machine scope can be deployed. The console disables User scope."
  - "AVD policies can use a maintenance window, drain mode, a reboot after installation and a concurrency limit. Intune targets support neither maintenance windows nor drain mode, and take policy-based deployment only."
  - "A device that fails a task is skipped for 24 hours. Logs are on the host in C:\\Windows\\Temp\\NMWLogs\\ and can be requested from the Deployment status page."
faq:
  - q: "Can I use the public Winget repository with Nerdio without building anything?"
    a: "Yes for deploying. Nerdio's MSP help page says the Winget community repository is linked by default when UAM is enabled, and the Enterprise page lists it as a read-only repository: apps can be deployed but not uploaded or changed. To add your own installers or custom install commands you need a private repository."
  - q: "Does Nerdio's Winget delivery support per-user installs?"
    a: "Not according to Nerdio's help pages. The import page says only Machine scope can be deployed and that User scope is disabled in the console. Nerdio's MSP getting-started page says UAM currently supports per-device deployments, not per-user, and calls per-user support coming soon."
  - q: "What do I do when a deployment fails on a host?"
    a: "Read the status and logs first. Nerdio skips a device that fails one or more tasks for 24 hours so that you can investigate. After a fix, use Run now with Ignore current device status to retry. The device log is in C:\\Windows\\Temp\\NMWLogs\\, and the Deployment status page can request and download the app management logs."
---

Nerdio Manager delivers Winget packages to Azure Virtual Desktop session hosts through its Unified Application Management feature. You choose an app from a Winget repository, import it if needed, and create a deployment policy that installs it on the target host pools. This article explains how that works, which repository to use, and where the documented limits are.

Nerdio's help pages call the feature Unified Application Management (UAM) and the release notes say "Unified App Management". The [Nerdio Unified App Catalog](/entity/nerdio-unified-app-catalog/) entity covers the same feature. This article covers Winget delivery only, not SCCM import or Shell Apps.

## What Winget is, and what Nerdio adds

Microsoft Learn describes WinGet as a command-line tool to discover, install, upgrade, remove and configure applications on Windows 10, Windows 11 and Windows Server 2025. It is the client for the Windows Package Manager service and ships as part of the App Installer. Learn says it is supported on Windows 10 version 1809 (build 17763) or later and is not available until a user has logged on for the first time. Learn names no other Windows Server version, so check the client on your host operating system before you plan around it.

On its own, winget installs on one machine per command. Nerdio puts a policy layer on top. Per Nerdio's Enterprise help pages, you search a catalog, deploy once or by policy, and see the status per device. A policy can carry a maintenance window and a drain mode so that installs do not disturb signed-in users.

## Two kinds of Winget repository

| | Community repository | Private repository |
|---|---|---|
| Access in UAM | Read-only | Read/write |
| What you can do | Deploy apps | Upload, manage and deploy apps |
| Install commands | Installation properties cannot be changed | Custom install commands |
| Versions | Not covered on the page | Versioning, several deployable versions |
| Hosted by | Microsoft | Your Azure subscription |

The table follows Nerdio's Enterprise "Supported configurations" page. The MSP repository page adds that the community repository is a Microsoft-managed repository of vendor-distributed packages, that it is linked by default, and that Nerdio does not maintain the application list: it publishes it "as is."

A private repository is built from Azure resources in your subscription. Microsoft's open-source winget-cli-restsource project is a reference implementation of a REST package source for the winget client. It uses Azure Functions for the endpoints and Azure Cosmos DB for the manifests, and the winget source type for it is Microsoft.Rest. A Nerdio help page says Nerdio's private repository feature uses that Microsoft project, which at the time of that page ran on .NET 6. Nerdio wrote that it would keep using the available .NET 6 release until a .NET 8 revision exists. The page notes that Azure Functions support for .NET 6 ended on 12 November 2024: apps keep running, but without security updates.

## Create or link a repository

The Enterprise help page gives these steps. The menu path differs by interface: Settings > Nerdio environment in the Classic UI, Settings > Environment > Nerdio in the New UI.

1. Open the Unified Application Management tile.
2. To use an existing repository, select **Link**, set the type to WinGet, enter a friendly name and the repository URL under **Location**, and select **OK**.
3. To create a private repository, select **Add** instead.
4. Enter a display name, then choose a resource group, a storage account, a Log Analytics workspace and an App Service Plan. You can create a new storage account or workspace in the same dialog.
5. Optionally enable private endpoints. The page says this adds endpoints for the storage account, Key Vault, Cosmos DB and the function app, and disables public access on Key Vault, Cosmos DB and the storage account. The function app keeps public access by default so that physical clients can still install Winget apps. You must give subnets for the web app and the endpoints.
6. Optionally set resource name prefixes. Nerdio adds a random suffix. Select **OK**.

The MSP page says an additional repository in another region adds an App Service Plan, which "incurs additional costs", and suggests reusing an existing plan to limit them. A Nerdio release note for version 8.1.1 (GA, 4 August 2026) fixed a case where adding a private repository could fail on the first attempt because of a Key Vault authorization timing error, with retry logic added.

## Import an app into the private repository

The Enterprise "Manage applications" page covers the import form. In the catalog under Applications you import from a linked repository, and the form has these parts:

- **General**: repository, package ID and version, locale, name, publisher and license.
- **Installer**: a file or a URL with a SHA256 hash, the installer type, platform, product code and scope. Only Machine scope can be deployed; User scope is disabled in the console.
- **Install switches**: interactive, silent, silent with progress, install location, log, upgrade and custom arguments. The page says silent arguments are required for unattended installs.
- **Install detection**: custom criteria for a successful install, using folders, files with version checks, or registry keys and values.

Test the silent behaviour before you import. Nerdio's page suggests running winget locally with `--silent` and the application ID. Learn says `--silent` suppresses all UI and that `--accept-package-agreements` accepts the package licence, so a non-interactive test looks like `winget install --id <Id> -e --silent --accept-package-agreements`. If an app cannot install or remove silently, Nerdio's page says to contact the vendor.

The import form lists installer types such as EXE, MSI, MSIX, ZIP, WIX, INNO, BURN and PORTABLE, while the supported-configurations page names .EXE, .MSI and .MSIX plus .ZIP packages with a single installer. Test other types before relying on them. The same page says apps that install in both Machine and User contexts are preferred, and Machine should be chosen when available. A known issue: some imported apps can be recorded under the Winget community repository ID, which causes policy failure messages even though the app installs. Entering the correct product code on the Installer page is the documented fix.

## Create the deployment policy

The policy is where Winget delivery meets your session hosts.

1. Go to **Applications > Deployment > Deployment Policies** and select **New**.
2. Name the policy. It is enabled by default.
3. Under **Applications**, pick an action: install or uninstall an app or a group. Nerdio recommends not mixing install and uninstall tasks in one policy.
4. Under **Deploy to**, choose Azure Virtual Desktop and add targets: an AVD workspace, a global pool, or a multi-session or single-session [host pool](/entity/avd-host-pool/). The same policy can cover several personal and pooled pools.
5. Set the scheduling options described below and select **Save**.

Once saved, a policy starts deploying to the desktops in scope. The Supported-configurations page says policy assessment runs on new AVD devices every 15 minutes.

### Settings that matter on session hosts

- **Maintenance window**: tasks run only inside it, either the target pool's own window or a manual one with days, time zone and times. Nerdio recommends using one.
- **Drain mode**: hosts enter [drain mode](/entity/avd-drain-mode/) before tasks run, and tasks wait until no sessions are present. You set a delay in minutes and a message for users.
- **Reboot after installation**: drains the host and restarts it once no sessions remain. It applies to install actions only.
- **Desired host state**: All (the default, applies immediately even with active sessions), Shutdown only, or No sessions.
- **Concurrency balancer**: a maximum job count, either global or per host pool.
- **Do not uninstall if upgrade fails**: for Winget apps, a failed upgrade is marked failed and the existing installation is kept. The release note for version 8.2.0, a public preview release dated 17 September 2026, lists this option on the Install WinGet application action at policy and application group level.

If another tool adds or removes an app, the policy may not notice. Nerdio's workaround is to create a policy that performs the needed action, or to edit the existing one to match the device state, let it run, and change it back. **Run now** on the policy menu requests a re-evaluation; its **Ignore current device status** option forces failed devices to retry.

## Winget delivery to Intune devices

The same catalog can target Intune-enrolled Windows devices, including Windows 365 Cloud PCs. The documented differences:

- Maintenance windows and drain mode are not supported. Tasks follow the Intune agent's schedule.
- Only policy-based deployment is supported, not one-time deployment.
- Winget apps are deployed through Intune scripts, so they do not appear on the Intune applications page. Check status on the UAM policy's details page.
- The Intune repository supports MSI (line-of-business) and EXE (Win32) apps in the Device/System context.
- The deployment policy page lists a **Use Task Worker** option, labelled public preview, for non-Intune applications. During the preview UAM processes only the first 1,000 devices.

Nerdio's MSP getting-started page adds that UAM deployments there are initialized through the Microsoft Intune agent and apply on its refresh cycle.

## Where it fits among delivery methods

| Method | What the sources say |
|---|---|
| Nerdio Winget policy | Installs onto the running host or Intune device, with scheduling, drain mode and status. The host's installed software changes. |
| App in the image | Installed in the [golden image](/entity/golden-image/), the template that bundles the OS, updates and applications. See also [Nerdio desktop image management](/entity/nerdio-desktop-image/). |
| [MSIX app attach](/entity/msix-app-attach/) | Learn says apps are attached from a package to the user session and are not installed locally on session hosts or images. Needs an SMB share and MSIX, Appx or App-V packages. |

The methods answer different needs. Winget through Nerdio fits apps with a silent installer when you want one catalog across AVD and Intune. App attach fits teams that prefer not to install apps on hosts, and Learn lists upgrades without a maintenance window as a benefit.

## Troubleshooting and known issues

- **Logs**: on the device in `C:\Windows\Temp\NMWLogs\`; in Nerdio Manager on the Applications > Deployment status page, where you can request and download the app management logs.
- **"Application [app name] not found on target host after installation"**: the install did not finish. Check the logs for a download or install problem.
- **"Set-LocalUser: An unspecified error occurred: status = 3221226252"**: Nerdio Manager cannot create a local admin account. Nerdio points to the User Account Control settings in Intune or Group Policy.
- **"Write-ExtendedLog is not recognized"**: an Attack Surface Reduction policy may block the UAM policy. Nerdio has an ASR exclusions page for this.
- **"No newer package versions are available from the configured application"**: can occur when version numbers use unexpected characters such as < or >. The fix is a one-time uninstall policy, then letting the policy redeploy the version.
- **Updating imported apps**: a community request asked for an easier comparison of imported apps against the public repository. Nerdio's reply said only that it would discuss the request with the development team, so plan a manual review cycle.

## Sources

Retrieved 17 November 2026.

- [UAM: Supported configurations (Nerdio Manager for Enterprise)](https://nmehelp.getnerdio.com/hc/en-us/articles/26124323091981-UAM-Supported-configurations)
- [Configure Nerdio Manager for Unified Application Management](https://nmehelp.getnerdio.com/hc/en-us/articles/26124344709517)
- [UAM: Manage applications](https://nmehelp.getnerdio.com/hc/en-us/articles/25499402166285)
- [UAM: Manage deployment policies](https://nmehelp.getnerdio.com/hc/en-us/articles/26124385135245)
- [UAM: Deployment status](https://nmehelp.getnerdio.com/hc/en-us/articles/26124356911757)
- [Troubleshoot common UAM deployment issues](https://nmehelp.getnerdio.com/hc/en-us/articles/34054417337741-Troubleshoot-common-UAM-deployment-issues)
- [Nerdio Manager WinGet Repository .NET Framework Support](https://nmehelp.getnerdio.com/hc/en-us/articles/31019168087949-Nerdio-Manager-WinGet-Repository-NET-Framework-Support)
- [Nerdio Manager for Enterprise release notes](https://nmehelp.getnerdio.com/hc/en-us/articles/19837802929677-Release-Notes)
- [Easier way to update imported Winget applications (Nerdio community)](https://nmehelp.getnerdio.com/hc/en-us/community/posts/30327724149645-Easier-way-to-update-imported-Winget-applications-unified-catalog)
- [Unified Application Management: Configure Repositories (Nerdio Manager for MSP)](https://nmmhelp.getnerdio.com/hc/en-us/articles/26125608840333)
- [Get started with Unified Application Management in Nerdio Manager (MSP)](https://nmmhelp.getnerdio.com/hc/en-us/articles/35395876385933-Get-started-with-Unified-Application-Management-UAM-in-Nerdio-Manager)
- [Use WinGet to install and manage applications (Microsoft Learn)](https://learn.microsoft.com/en-us/windows/package-manager/winget/)
- [winget install command (Microsoft Learn)](https://learn.microsoft.com/en-us/windows/package-manager/winget/install)
- [winget source command (Microsoft Learn)](https://learn.microsoft.com/en-us/windows/package-manager/winget/source)
- [App attach overview for Azure Virtual Desktop (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/virtual-desktop/app-attach-overview)
- [winget-cli-restsource (GitHub, Microsoft)](https://github.com/microsoft/winget-cli-restsource)
