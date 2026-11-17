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
  - "The public Winget community repository is read-only in UAM. A private repository in your own Azure subscription lets you upload installers, set custom install commands and keep several versions."
  - "Packages must be installable unattended (for EXE-based apps the silent flag is required), and only Machine scope can be deployed. The console disables User scope."
  - "AVD policies can use a maintenance window, drain mode, a reboot after installation and a concurrency limit. Intune targets support no maintenance window or drain mode, and only policy-based deployment."
  - "A device that fails a task is skipped for 24 hours. Logs are on the host in C:\\Windows\\Temp\\NMWLogs\\ and can be requested from the Deployment status page."
faq:
  - q: "Can I use the public Winget repository with Nerdio without building anything?"
    a: "Yes for deploying. Nerdio's MSP help page says the Winget community repository is linked by default when UAM is enabled. On the Enterprise side, the repository is added with Link, and the supported-configurations page lists it as read-only: apps can be deployed but not uploaded or changed. To add your own installers or custom install commands you need a private repository."
  - q: "Does Nerdio's Winget delivery support per-user installs?"
    a: "Not according to Nerdio's help pages. The import page says only Machine scope can be deployed and that User scope is disabled in the console. Nerdio's MSP getting-started page says UAM currently supports per-device deployments, not per-user, and calls per-user support coming soon."
  - q: "What do I do when a deployment fails on a host?"
    a: "Read the status and logs first. Nerdio skips a device that fails one or more tasks for 24 hours so that you can investigate. After a fix, use Run now with Ignore current device status to retry. The device log is in C:\\Windows\\Temp\\NMWLogs\\, and the Deployment status page can request and download the app management logs."
---

Nerdio Manager delivers Winget packages to Azure Virtual Desktop session hosts through its Unified Application Management feature. You choose an app from a Winget repository, import it if needed, and create a deployment policy that installs it on the target host pools.

Nerdio's help pages call the feature Unified Application Management (UAM); the release notes use both "Unified App Management" and "Unified Application Management". See also the [Nerdio Unified App Catalog](/entity/nerdio-unified-app-catalog/) entity. This article covers Winget delivery only, not SCCM import or Shell Apps.

## What Winget is, and what Nerdio adds

Microsoft Learn describes WinGet as a command-line tool to discover, install, upgrade, remove and configure applications on Windows 10, Windows 11 and Windows Server 2025. Learn says it is supported on Windows 10 version 1809 (build 17763) or later and is not available until a user has logged on for the first time.

Nerdio puts a policy layer on top of winget. You search a catalog, deploy once or by policy, and see the status per device. A policy can carry a maintenance window and a drain mode.

## Two kinds of Winget repository

| | Community repository | Private repository |
|---|---|---|
| Access in UAM | Read-only | Read/write |
| What you can do | Deploy apps | Upload, manage and deploy apps |
| Install commands | Installation properties cannot be changed | Custom install commands |
| Versions | Not stated | Versioning, several deployable versions |
| Hosted by | Microsoft | Your Azure subscription |

The table follows Nerdio's Enterprise "Supported configurations" page. The MSP repository page adds that the community repository is Microsoft-managed and linked by default, and that Nerdio publishes the application list "as is" without maintaining it.

A private repository is built from Azure resources in your subscription. It rests on Microsoft's open-source winget-cli-restsource project, a reference implementation of a REST package source (winget source type Microsoft.Rest) that uses Azure Functions and Azure Cosmos DB. A Nerdio help page says the private repository feature uses that project, which currently runs on .NET 8. Azure Functions support for .NET 8 ended on 10 November 2026: apps keep running, but without security updates or customer service for .NET 8. Nerdio says it will keep using the .NET 8 release until the project publishes a .NET 10 based revision, and plans to upgrade once that is tested.

## Create or link a repository

The Enterprise configuration page gives these steps. Navigate to System > Settings > Nerdio and use the Unified Application Management area.

1. To link a repository, select **Link**, set the type to WinGet, enter a friendly name and the repository URL under **Location**, and select **OK**.
2. To create a private repository, select **Add** instead.
3. Enter a display name, then choose a resource group, a storage account, a Log Analytics workspace and an App Service Plan.
4. Optionally enable private endpoints. The page says this adds endpoints for the storage account, Key Vault, Cosmos DB and the function app, and disables public access on the first three (Azure service IPs stay allowed on Cosmos DB). The function app keeps public access by default so that physical clients can still install Winget apps. The page asks for a subnet for the web app and one for the endpoints.
5. Optionally set resource name prefixes. Nerdio adds a random suffix. Select **OK**.

The MSP page says an additional repository in another region adds an App Service Plan, which "incurs additional costs".

## Import an app into the private repository

The Enterprise "Manage applications" page describes two Winget imports. Both start at Applications > Catalog > All Apps.

**Copy a catalog app into your private repository.** Find the app, open its action menu and select **Import**. Choose the package version, the private repository and the package ID. The option **Synchronize the latest version** is described as ensuring that the latest version of the source application is automatically imported if it has not been imported already. The page does not say when that check runs.

**Upload your own package.** Select **Import application**. The form has these parts:

- **General**: repository (the private one), package ID and version, locale, name, publisher and license.
- **Installer**: a file or a URL with a SHA256 hash, the installer type, platform, product code and scope. Only Machine scope can be deployed; User scope is disabled in the console.
- **Install switches**: interactive, silent, silent with progress, install location, log, upgrade and custom arguments. The page says packages must be deployable in unattended or silent mode, and that for EXE-based applications the silent flag is a requirement. The silent field itself is marked optional.
- **Install detection**: custom criteria for a successful install, using folders, files with version checks, or registry keys and values.

You can also deploy a catalog app directly with **Deploy**. Without the option **Create policy using this configuration**, that deployment is a one-time event and no policy is created.

Test silent behaviour before you import. Nerdio's Supported configurations page says some applications do not support fully silent installs or removals, and their tasks then fail. It suggests validating locally with `winget [install/remove] --id [Application.ID] --silent`; if no silent operation happens, contact the vendor. Learn describes `--silent` as running the installer in silent mode, which suppresses all UI.

The page says packages can be uploaded as APPX, BURN, EXE, INNO, MSI, MSIX, MSSTORE, NULLSOFT, PORTABLE, PWA, WIX or ZIP, while the supported-configurations page names .EXE, .MSI and .MSIX plus .ZIP packages with a single installer. A known issue: some imported apps can be recorded under the Winget community repository ID, which causes policy failure messages even though the app installs. Entering the correct product code on the Installer page is the documented fix.

## Create the deployment policy

1. Go to **Applications > Deployment > Deployment Policies** and select **New**.
2. Name the policy. It is enabled by default.
3. Under **Applications**, pick an action: install or uninstall an app or a group. Nerdio recommends not mixing install and uninstall tasks in one policy.
4. Under **Deploy to**, choose Azure Virtual Desktop and add targets: an AVD workspace, a global pool (Nerdio lists Global Pools as public preview), or a multi-session or single-session [host pool](/entity/avd-host-pool/).
5. Set the scheduling options described below and select **Save**.

Once saved, a policy starts deploying to the desktops in scope. The Supported-configurations page says policy assessment runs on new AVD devices every 15 minutes, and that a stopped in-scope AVD desktop is started for the task and returned to its original state afterwards.

### Settings that matter on session hosts

- **Maintenance window**: tasks run only inside it, either the target pool's own window or a manual one with days, time zone and times. Nerdio recommends using one.
- **Drain mode**: hosts enter [drain mode](/entity/avd-drain-mode/) before tasks run, and tasks wait until no sessions are present. You set a delay in minutes and a message for users.
- **Reboot after installation**: drains the host and restarts it once no sessions remain. It applies to install actions only.
- **Desired host state**: All (the default, applies immediately even with active sessions), Shutdown only, or No sessions.
- **Concurrency balancer**: a maximum job count, either global or per host pool.
- **Do not uninstall if upgrade fails**: for Winget apps, a failed upgrade is marked failed and the existing installation is kept. The release notes list it under version 8.2.0 (public preview, 17 September 2026) at policy and application group level. The 8.2.1 to 8.2.3 entries are marked GA (8.2.3: 13 November 2026) but do not mention it again, and the help pages describe it without a preview label, so check your installed version.

If another tool adds or removes an app, the policy may not notice. Nerdio's workaround is to create a policy that performs the needed action, or to edit the existing one to match the device state, let it run, and change it back. **Run now** on the policy menu requests a re-evaluation; its **Ignore current device status** option forces failed devices to retry.

## Winget delivery to Intune devices

The same catalog can target Intune-enrolled Windows devices, including Windows 365 Cloud PCs. The documented differences:

- Maintenance windows and drain mode are not supported. Tasks follow the Intune agent's schedule.
- Only policy-based deployment is supported, not one-time deployment.
- Winget apps are deployed through Intune scripts, so they do not appear on the Intune applications page. Check status on the UAM policy's details page.
- The Intune repository type, a separate source from Winget, currently supports MSI (line-of-business) and EXE (Win32) apps in the Device/System context.
- Separately, the deployment policy page lists a **Use Task Worker** option, labelled public preview, for non-Intune applications. During the preview UAM processes only the first 1,000 devices.

## Where it fits among delivery methods

| Method | What the sources say |
|---|---|
| Nerdio Winget policy | Installs through a policy onto in-scope AVD hosts (stopped hosts are started for the task and returned to their original state) or onto Intune devices. Maintenance window, drain mode and desired host state apply to AVD only. |
| App in the image | Installed in the [golden image](/entity/golden-image/). See also [Nerdio desktop image management](/entity/nerdio-desktop-image/). |
| [App Attach](/entity/msix-app-attach/) | Per Learn, apps are attached to the user session and not installed locally on hosts or images. Needs an SMB share and MSIX, Appx or App-V packages. |


## Troubleshooting and known issues

- **Logs**: on the device in `C:\Windows\Temp\NMWLogs\`; in Nerdio Manager under Applications > Deployment > Deployment Status, where you can request and download the app management logs.
- **"Application [app name] not found on target host after installation"**: the install did not finish. Check the logs.
- **"Set-LocalUser: An unspecified error occurred: status = 3221226252"**: Nerdio Manager cannot create a local admin account. Nerdio says the policies "UIA elevation prompt without secure desktop" and "Admin Approval Mode for Built-in Administrator" must be disabled, in Intune or Group Policy.
- **"Write-ExtendedLog is not recognized"**: an Attack Surface Reduction policy may block the UAM policy. Nerdio has an ASR exclusions page for this.
- **"No newer package versions are available from the configured application"**: the Deployment status page warns this can occur when versions contain unexpected characters such as < or >, and gives a one-time uninstall policy and redeploy as the fix. The release notes for v8.0.1 (GA, 16 June 2026) word it "...configured sources" and say the error was resolved for < or >: source and target version are now treated as identical and no action is taken. The warning says "such as" < or >, while the release notes describe the fix for those two characters only.
- **Updating imported apps**: the import dialog has a **Synchronize the latest version** option, but Nerdio documents neither when it runs nor whether it updates apps imported earlier. A community request asked for an easier way to compare imported apps with the public repository, which it describes as a manual search; Nerdio's reply said only that it would discuss the suggestion with the development team.

## Sources

- [UAM: Supported configurations (Nerdio Manager for Enterprise)](https://nmehelp.getnerdio.com/hc/en-us/articles/26124323091981-UAM-Supported-configurations)
- [Configure Nerdio Manager for Unified Application Management](https://nmehelp.getnerdio.com/hc/en-us/articles/26124344709517)
- [UAM: Manage applications](https://nmehelp.getnerdio.com/hc/en-us/articles/25499402166285)
- [UAM: Manage deployment policies](https://nmehelp.getnerdio.com/hc/en-us/articles/26124385135245)
- [UAM: Deployment status](https://nmehelp.getnerdio.com/hc/en-us/articles/26124356911757)
- [Troubleshoot common UAM deployment issues](https://nmehelp.getnerdio.com/hc/en-us/articles/34054417337741-Troubleshoot-common-UAM-deployment-issues)
- [2026-11-10 End of Support (EoS) for .NET 8: Nerdio Manager WinGet Repository .NET Framework](https://nmehelp.getnerdio.com/hc/en-us/articles/31019168087949)
- [Nerdio Manager for Enterprise release notes](https://nmehelp.getnerdio.com/hc/en-us/articles/19837802929677-Release-Notes)
- [Easier way to update imported Winget applications (Nerdio community)](https://nmehelp.getnerdio.com/hc/en-us/community/posts/30327724149645-Easier-way-to-update-imported-Winget-applications-unified-catalog)
- [Unified Application Management: Configure Repositories (Nerdio Manager for MSP)](https://nmmhelp.getnerdio.com/hc/en-us/articles/26125608840333)
- [Get started with Unified Application Management in Nerdio Manager (MSP)](https://nmmhelp.getnerdio.com/hc/en-us/articles/35395876385933-Get-started-with-Unified-Application-Management-UAM-in-Nerdio-Manager)
- [Use WinGet to install and manage applications (Microsoft Learn)](https://learn.microsoft.com/en-us/windows/package-manager/winget/)
- [winget install command (Microsoft Learn)](https://learn.microsoft.com/en-us/windows/package-manager/winget/install)
- [winget source command (Microsoft Learn)](https://learn.microsoft.com/en-us/windows/package-manager/winget/source)
- [App attach overview for Azure Virtual Desktop (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/virtual-desktop/app-attach-overview)
- [winget-cli-restsource (GitHub, Microsoft)](https://github.com/microsoft/winget-cli-restsource)
