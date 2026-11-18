---
title: "Delivering apps with Nerdio: Winget, SCCM connector and policies"
summary: "In Nerdio Manager an app reaches a host in two steps: into a repository via Winget, an SCCM import or a Shell App, then onto the pool via a deployment policy. Covers the SCCM connector, imports and documented errors."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [nerdio-unified-app-catalog, nerdio-manager-for-enterprise]
keypoints:
  - "Choose by installer type: Winget for standard silent installers, an SCCM import for Configuration Manager packages, a Shell App for scripted installs. A policy then handles all three."
  - "The SCCM connector is Premium only, uses the Azure Arc agent on the SCCM server or a proxy VM, needs the Read only analyst role in all scopes and a private Winget repository."
  - "Single-file SCCM apps go to a private Winget repository; scripted apps go to Shell Apps, and their detection rules are not imported. Nerdio pages disagree on Shell Apps' status, so check them."
  - "For imported apps: a Shell App must be public before deployment, Nerdio advises testing against a test pool first, and Global Pools are in public preview."
  - "A device that fails a task is skipped for 24 hours. Logs sit in C:\\Windows\\Temp\\NMWLogs\\ on the device, and SCCM export logs are on the SCCM server."
faq:
  - q: "Do I need the SCCM connector to deliver apps with Nerdio?"
    a: "No. Winget packages and Shell Apps work without it. The connector, which Nerdio's help page says is only available in the Premium edition, is for importing applications that already exist in Configuration Manager into the catalog so you can reuse the package files you already have."
  - q: "Does the SCCM connector import detection rules?"
    a: "No for scripted applications. Nerdio's help page says detection rules are not imported and must be edited manually before deployment. For scripted apps the detect tab shows the SCCM-returned content for reference only, and you replace it with a new detection script that you mark as verified."
  - q: "Which SCCM applications can the connector import?"
    a: "Nerdio's help page says installers must be system-wide or dual-installation, and user-based installers are not supported. Single-file applications go into a private Winget repository that must already exist. Scripted applications such as PSADT packages go into a Shell Apps repository, with the preview caveat described in this article."
---

An app reaches a Nerdio-managed host in two steps. First it has to be in a repository that Nerdio Manager can read, as a Winget package, an SCCM import or a Shell App. Then a deployment policy installs it on the target pool or devices and reports the status per device.

This guide covers the SCCM connector, the import of SCCM apps and what changes in a policy for imported apps. The Winget route and the general policy settings (maintenance window, drain mode, desired host state, concurrency, Intune behaviour) are in "Delivering apps with Winget through Nerdio", and the concept is in "Nerdio Unified App Catalog explained". The feature is documented as Unified Application Management (UAM) in [Nerdio Manager for Enterprise](https://www.m365.fm/entity/nerdio-manager-for-enterprise/); see also the [Nerdio Unified App Catalog](https://www.m365.fm/entity/nerdio-unified-app-catalog/) entity.

## Pick the entry route first

| Route | Use when | Where it ends up |
|---|---|---|
| Winget package | The app has a standard installer that runs silently | Public community repository (read-only) or a private Winget repository |
| SCCM import, single file | The app is already packaged in [Microsoft Configuration Manager](https://www.m365.fm/entity/configuration-manager/) | A private Winget repository |
| SCCM import, scripted | The package is script-driven, for example a PSADT package | A Shell Apps repository |
| Shell App | Detect, install and uninstall need your own [PowerShell](https://www.m365.fm/entity/powershell/) | A Shell Apps repository |

Shell Apps need a note before you build on them. Nerdio's Shell Apps overview page says "this is a preview feature" and lists SCCM integration (ingesting scripted installations with their binaries) and secure variable support as not currently available. Other Nerdio pages disagree on both. The SCCM integration page describes importing scripted applications into Shell Apps. The pages "UAM: Shell apps secure variables" and "UAM: Shell apps technical reference guide" document secure variables for Shell Apps, the latter from Nerdio Manager v6.1 and with the remark that secure variables are not supported for Intune devices and cause a deployment error. Check these pages and test the import in a non-production environment first. Shell Apps run only in the device system context, which avoids a service account, and PowerShell remoting (WSMan) must be enabled on the target devices.

The Winget package is the simplest. In the catalog under **Applications > Catalog > All Apps**, **Deploy** installs a catalog app directly, and Nerdio says the deployment is a one-time event unless you select **Create policy using this configuration**. Winget installs run in an administrative context, so UAM uses a service account; Nerdio's help page says the default is a local user account that the Nerdio deployment task creates automatically. Before version 6.5 this was also a local administrative account, kept through Credential Manager; from 6.5 the account is enabled only for the task and its password is rotated afterwards, as the concept article describes.

## Set up the SCCM connector

Nerdio's SCCM integration page says the feature is only available in the Premium edition. It connects to a remote SCCM instance, queries its applications and imports them into the unified catalog.

**Account and server requirements, per the help page:**

- Read permission on the share that holds the application source files.
- Membership in the Remote management group on the local SCCM server.
- The Read only analyst role in SCCM, assigned to all scopes.
- Installers must be system-wide or dual-installation. User-based installers are not supported.
- A private Winget repository must exist before you import a single-file app.
- With a proxy VM, the SCCM console must be installed on it, the service account needs Read and Execute on `C:\program files\Microsoft Configuration Manager` on the primary site server and Read on the `SMS_[Site Name]` share. Proxy VM support arrived in version 5.6.
- If the SCCM binaries sit on an external file share, you need a proxy VM and the app service setting `SccmConfiguration:UseSessionConfigWithRunAsCred` set to True. Nerdio says the service account is then added to the proxy VM's local administrators group temporarily during each export.

**Steps:**

1. Install the Azure Arc agent. In the Azure portal open **Azure Arc resources > Machines**, select **Add/Create > Add a machine**, and under **Add a single server** select **Generate script**. Run the script in an elevated PowerShell session on the SCCM server or proxy VM, sign in in the browser window that opens, and confirm the machine shows as connected. [Azure Arc](https://www.m365.fm/entity/azure-arc/) is the management channel Nerdio uses for the remote SCCM server. For an SCCM server that already runs in Azure, the page recommends linking it directly without Arc, and says Arc management for Azure-hosted servers is supported only for evaluation and non-production. If the SCCM server is already registered with and managed by Azure Arc, or runs as an Azure VM that Arc does not manage, skip ahead to step 2, where you link it in Nerdio Manager.
2. In Nerdio Manager go to **System > Settings > Azure** and make sure the SCCM server's resource group is linked in the **Linked resource groups** area.
3. Go to **System > Settings > Nerdio**. In the **Unified Application Management** area, under **SCCM servers**, select **Link**.
4. Choose the execution mode (with a proxy machine, or directly on the SCCM server), select the proxy machine or SCCM server, enter the server FQDN (for a proxy VM, the primary site server) and a domain username and password. The optional **Automatic Synchronization** toggle sets a regular sync interval with time zone, start time and repeat.
5. Go to **Applications > Integrations > Configuration Manager**, select **Load metadata** and confirm. Progress shows under SCCM Tasks. Nerdio says this adds a script extension to the SCCM server and can take some time.

## Import an SCCM app

**Single-file application.** Under **Applications > Integrations**, open the **Configuration Manager** area, find the app and choose **Import** from its action menu. The wizard has General (repository), File (mode and source), Package (ID, version, locale, name, publisher, license), Installer (type, platform, product code, scope, success codes) and Install switches. The page notes that 32-bit and 64-bit installers need different product codes. Complete the silent switch for EXE installers; Nerdio's supported-configurations page says tasks fail for apps that cannot install silently.

**Scripted application such as PSADT.** Import to a Shell Apps repository and manage it as a Shell App:

1. In the General area select the Shell Apps repository and the SCCM deployment type you want. On the Package tab set name, description and publisher, and leave **Public** off.
2. On the File tab enable the file, set the mode to "SCCM: Export .ZIP directly to repository", select the files, and select **Start Download**. It runs in the background.
3. On the Detect tab clear the SCCM-returned content, which is for reference only and cannot detect the app, and write a new detection script. Select **Script is verified (required)**. Then write the install script and the uninstall script and select **Script is verified (required)** on each of those tabs as well.
4. Select **Import** once the files have downloaded, and do not close the console during import.
5. After the import completes, open the app, go to the Package area and toggle **Public** on. That makes it available for deployment from the unified catalog. Nerdio says to test it thoroughly against a test pool before deploying to production users, so assign it to a test pool first. A public Shell App cannot go back to Hidden while a policy assignment exists.

### When the SCCM connection or export fails

The help pages give these logs and causes. Metadata loading logs to `C:\Windows\Temp\NMWLogs\SccmDiscoverApps.log` and export to `C:\Windows\Temp\NMWLogs\SccmExportBinaries.log`, both on the SCCM server.

| Message | Likely cause per Nerdio |
|---|---|
| "Connecting to remote server localhost failed... Access is denied." | Wrong credentials, or user not in the Remote management group |
| "CMSite disk was not found." | Missing Read only analyst role in all scopes |
| "C:\Windows\TEMP\NMW-export-... files not found." | No read permission on the source file share |
| "Access to the path '\\\\[Server FQDN]\\SMS_[SITE]\\Client' is denied." | Proxy service account lacks read access to required locations |
| "The User name or password is incorrect / Access Denied" | Where binaries are on a network share, use a proxy server configuration with `SccmConfiguration:UseSessionConfigWithRunAsCred` set to True |
| "The current deserialized object size of the data received from the remote server exceeds the allowed maximum object" | Exported metadata may exceed the default 200 MB PowerShell transfer limit in large environments |

For the last error, Nerdio's workaround needs version 6.4.2 (GA) or later. Add the app service setting `ExtendedConfiguration:SccmFilterRegex`, a regular expression that filters applications by `LocalizedDisplayName` and legacy packages by `Name`, then restart the app service. The example value `Note|^B|^A` returns names that contain "Note" or start with B or A. Nerdio calls this a workaround. The 8.1.0 public preview notes (21 July 2026) also shortened the temp directory name used in SCCM exports to avoid Windows path-length failures.

## Build the deployment policy

Policies hold scope and timing, whichever route the app took in. The policy steps, the scheduling settings (maintenance window, drain mode, desired host state, concurrency limit, reboot after installation) and the Intune target behaviour are in "Delivering apps with Winget through Nerdio", so this section covers only what changes for imported apps. Policies are under **Applications > Deployment > Deployment Policies**.

- **Visibility.** An imported Shell App must be public before it can be deployed, and it cannot go back to Hidden while a policy assignment exists.
- **Test pool first.** Nerdio says to test a Shell App thoroughly against a test pool before production. Our reading: create the first policy against a test pool and widen the scope once the detect, install and uninstall scripts have passed there.
- **Reboots.** Our reading, not a Nerdio rule: script-based packages such as PSADT may need a restart, and **Reboot after installation** (available for Install app or Install group) and drain mode make that wait until sessions have ended. Whether a package needs it depends on the package.
- **Global pools.** AVD targets include workspaces, global pools, global pool groups and host pools. Nerdio's Global Pools Overview page says global pools are in Public Preview and available in Premium only. The 8.2.0 release notes (17 September 2026) added global pools and their pool groups as policy targets.

## Check status and recover

- The **Details...** option in the policy's action menu shows per-device status. The Deployment Status page, under **Applications > Deployment > Deployment Status**, searches by device or user and filters by policy type, scope and status.
- The 24-hour skip for failed devices, **Run now**, **Ignore current device status** and the device logs in `C:\Windows\Temp\NMWLogs\` work as described in the Winget article.
- For SCCM imports, start on the SCCM server with the two log files and the error table above.

## Sources

- [UAM: SCCM integration](https://nmehelp.getnerdio.com/hc/en-us/articles/26124368428045)
- [Resolve SCCM metadata export errors](https://nmehelp.getnerdio.com/hc/en-us/articles/30884034657805-Resolve-SCCM-Metadata-Export-Errors)
- [UAM: Manage deployment policies](https://nmehelp.getnerdio.com/hc/en-us/articles/26124385135245)
- [UAM: Manage applications](https://nmehelp.getnerdio.com/hc/en-us/articles/25499402166285)
- [UAM: Shell apps overview and usage](https://nmehelp.getnerdio.com/hc/en-us/articles/25499430784909-UAM-Shell-apps-overview-and-usage)
- [UAM: Shell apps secure variables](https://nmehelp.getnerdio.com/hc/en-us/articles/26733998315277-UAM-Shell-apps-secure-variables)
- [UAM: Shell apps technical reference guide](https://nmehelp.getnerdio.com/hc/en-us/articles/32612189461261-UAM-Shell-apps-technical-reference-guide)
- [Global Pools Overview](https://nmehelp.getnerdio.com/hc/en-us/articles/47890093534477-Global-Pools-Overview)
- [UAM: Manage shell apps](https://nmehelp.getnerdio.com/hc/en-us/articles/25499415545997)
- [UAM: Supported configurations](https://nmehelp.getnerdio.com/hc/en-us/articles/26124323091981-UAM-Supported-configurations)
- [UAM: Service accounts](https://nmehelp.getnerdio.com/hc/en-us/articles/26124340699021)
- [UAM: Deployment status](https://nmehelp.getnerdio.com/hc/en-us/articles/26124356911757)
- [Troubleshoot common UAM deployment issues](https://nmehelp.getnerdio.com/hc/en-us/articles/34054417337741-Troubleshoot-common-UAM-deployment-issues)
- [Configure Nerdio Manager for Unified Application Management](https://nmehelp.getnerdio.com/hc/en-us/articles/26124344709517)
- [Nerdio Manager for Enterprise release notes](https://nmehelp.getnerdio.com/hc/en-us/articles/19837802929677-Release-Notes)
