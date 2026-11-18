---
title: "Automating Nerdio with the REST API and PowerShell"
summary: "Nerdio Manager for Enterprise can be automated through its REST API and the NerdioManagerPowerShell module, and from inside through scripted actions. This article compares the routes and lists documented pitfalls."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [nerdio-manager-for-enterprise, nerdio-scripted-actions]
keypoints:
  - "Three routes: the REST API and PowerShell module call Nerdio Manager from outside; scripted actions run on session hosts (Windows scripts) or in Azure Automation (runbooks)."
  - "The REST API is off by default. System > Settings > Integrations > REST API runs a three-step wizard (Run, Grant, Generate) that creates an application under nerdio-nmw-app and a client secret."
  - "The NerdioManagerPowerShell module wraps the REST API, authenticates with Connect-NME and is in public preview; Nerdio's help pages state it needs the Premium edition."
  - "Nerdio lists 15 deprecated REST endpoints (all dated 2024-04-25) and several deprecated properties; scripted-action schedule endpoints are among them."
  - "Secure variables keep secrets out of scripts: names are 1 to 20 alphanumeric characters, and a variable can be limited to named scripted actions."
faq:
  - q: "Do I need the PowerShell module to use the Nerdio REST API?"
    a: "No. The module is a wrapper for the REST API, so any HTTP client works, and Nerdio ships a Postman collection plus a Swagger page on each installation. The module saves you from handling tokens and payload shapes yourself, but Nerdio's help pages describe it as public preview and Premium-only."
  - q: "Can I schedule a scripted action through the REST API?"
    a: "The older schedule endpoints are deprecated. Nerdio's deprecation page lists the endpoints under scripted-actions/{id}/schedule and the host pool schedule/script-execution paths, all deprecated on 2024-04-25, and names no replacement. Scheduling is documented in the Nerdio Manager UI (Hosts > Run script > Schedule), so check your installation's Swagger page before building on an API route."
  - q: "Where should the client secret for the REST API live?"
    a: "Not in the script. Nerdio notes the secret cannot be read again after you leave the credentials page and suggests a secure location such as Azure Key Vault. Nerdio's release notes list multiple REST API client secrets that can be created and revoked separately, first in the 8.2.0 Public Preview entry and followed by GA releases from 8.2.1."
---

Nerdio Manager for Enterprise can be automated in two directions: from outside, through its REST API and the NerdioManagerPowerShell module, and from inside, through scripted actions that Nerdio runs on session hosts or in Azure Automation. Pick the route by where the code has to run, then enable the API once and keep the secret out of your scripts.

## Three routes, compared

| | REST API | PowerShell module | Scripted actions |
|---|---|---|---|
| Direction | Your tool calls [Nerdio Manager](https://www.m365.fm/entity/nerdio-manager-for-enterprise/) | Same, wrapped in cmdlets | Nerdio runs your code |
| Typical use | ITSM or onboarding workflows | Admin scripts, reports, exports | Configure a VM, or change Azure resources |
| Auth | Entra application, client secret | `Connect-NME` with the same credentials | Windows scripts: system context on the VM by default; runbooks: Nerdio Manager service principal |
| Status in docs | Documented; Swagger per install | Public preview | Documented; many built-in scripts |

[Nerdio](https://www.m365.fm/entity/nerdio/)'s REST API overview names the use cases: provisioning a new employee's [Azure Virtual Desktop](https://www.m365.fm/entity/azure-virtual-desktop/) desktop in an onboarding workflow, removing access in an offboarding workflow, applying Windows updates to desktop images from an ITSM trigger, exporting logs to a data store, and a self-service portal for session management. Anything that must change a VM or an Azure resource as part of a Nerdio task fits a [scripted action](https://www.m365.fm/entity/nerdio-scripted-actions/).

## Edition and status

Nerdio's help pages for the [PowerShell](https://www.m365.fm/entity/powershell/) module state "This feature is only available in the Nerdio Manager Premium edition" and call the module a public preview. For the [REST API](https://www.m365.fm/entity/rest-api/), Nerdio's April 2022 Premium announcement lists it as a Premium feature, and a February 2024 Premium features PDF places the REST API and the module under its Premium headings. Script repository integration is also marked Premium-only. The REST API pages themselves do not state an edition, so confirm yours before planning around it.

The API keeps changing. Nerdio's release notes list full create, read, update and delete endpoints for scripted action profiles and groups first in the 8.1.0 entry (Public Preview, 21 July 2026), and multiple REST API client secrets plus more manageable areas (RDP profiles, VM profiles, linked resources) first in the 8.2.0 entry (Public Preview, 17 September 2026). GA releases follow both: 8.1.1 on 4 August 2026, and 8.2.1 on 29 September 2026. The notes do not repeat the earlier entries; our reading is that the GA releases carry those features. The notes name 8.2.3 GA of 13 November 2026 as the current release, so compare your installed version with these entries.

## Enable the REST API

The API is disabled by default. Nerdio's Getting Started page gives these steps:

1. In Nerdio Manager, open **System > Settings > Integrations** and find the **REST API** area.
2. Check **Current status**; if it is disabled, select it to start a pop-up wizard. Complete the steps in order.
3. **Step 1, Run:** creates a new Azure application under the existing **nerdio-nmw-app** app registration.
4. **Step 2, Grant:** opens the Azure portal. Select **Grant admin consent for Nerdio**, then return and use the refresh icon to confirm the permissions.
5. **Step 3, Generate:** creates the client secret and the other values needed for calls.
6. Optionally download the Postman collection from the same area.

If your policies require creating the registration yourself, Nerdio's Manual Configuration page describes it. You add an Application ID URI of the form `api://<GUID>` to nerdio-nmw-app, set `accessTokenAcceptedVersion` to `2`, copy the ID of the **RestClient** app role, and create a second app registration whose manifest adds the tag `NMW_REST_API_CLIENT:<app_id>` and a `requiredResourceAccess` entry of type `Role`. You then grant admin consent and create a client secret. The page says to wait a few minutes after the Azure portal changes before checking in Nerdio Manager, and to download a backup of the manifest first.

## Get a token and make a first call

Nerdio's Postman collection contains an "NME API Quick Start" with a **Get token** request: paste the client secret into the body, send, and a successful call returns an access token and 200 OK. On the Swagger page (System > Settings > Integrations, next to **Documentation**) select **Authorize** and paste the same secret to try endpoints in the browser.

Nerdio's pages do not name the flow; our reading is that its setup, an application role plus a client secret, matches the client credentials flow described on Microsoft Learn: the app authenticates as itself with a POST to `/{tenant}/oauth2/v2.0/token` carrying `client_id`, `scope`, `client_secret` and `grant_type=client_credentials`, and the response has `access_token`, `token_type` and `expires_in`. Learn's example shows 3599 seconds, and the flow issues no refresh token, so a long-running job must request a new token when the old one expires. Use the exact scope and request that Nerdio's credentials and collection give you.

Swagger on your own installation is the authority for paths. Nerdio's deprecation page shows the versioned style, for example `api/v1/arm/hostpool/{subscriptionId}/{resourceGroup}/{hostPoolName}/...`.

## Use the PowerShell module

The module wraps the REST API. Per Nerdio's tutorial:

1. Install it from an elevated session: `Install-Module -Name NerdioManagerPowerShell` (Nerdio's preview page uses `-AllowPrerelease` for pre-release builds), then run `Import-Module NerdioManagerPowerShell` and `Get-Command -Module NerdioManagerPowerShell` to list cmdlets.
2. In Nerdio Manager open **System > Settings > Integrations**, expand the REST API area and select **show** next to **Credentials** to get the client ID, tenant ID and scope. The base URL is your deployment's address, for example `https://nmw-app-i55ow6qye6hc6.azurewebsites.net`.
3. Connect, with the secret supplied from your own secure store:

```powershell
Connect-NME -ClientId $NmeClientId -ClientSecret $NmeClientSecret `
  -TenantId $NmeTenantId -ApiScope $NmeScope -NmeUri $NmeUri
Get-NmeWorkspace
```

Nerdio's Manual Configuration page closes with a PowerShell test of the same kind: connect, then `Get-nmeworkspace` to list workspaces. Its export how-to adds `Connect-AzAccount`, `Get-AzSubscription` for the subscription ID, and then `Export-NmeHostPoolConfig -SubscriptionId $subId -resourcegroup $resourceGroup -hostPoolName $hostPoolName`, which writes a JSON object you can redirect to a file. `Get-NmeHostPoolSessionHosts` takes the same parameters.

For create operations, Nerdio's advanced guide describes an "advanced" cmdlet pattern: read the input with `Get-Help New-NmeAppAttachImage -full`, build the payload with the matching `New-...RestPostRequest` cmdlet, pass it to the create cmdlet, and confirm with the `Get-` cmdlet.

## Run code from inside: scripted actions

Scripted actions are PowerShell scripts under **Endpoints > Automation > Scripted Actions**, split into Windows Scripts and Azure Runbooks. Windows scripts run on VMs through the Azure Custom Script Extension, by default in system context. Azure runbooks run in an Automation account that Nerdio creates, as the Nerdio Manager service principal. Nerdio warns that scripts on a session host that target Azure are less efficient and can be unreliable, and that some scripts need a restart or shutdown that is impossible on the session host itself; runbooks avoid both.

Practical points from Nerdio's pages:

- **Triggers:** on a host pool, open the action menu, select **Settings > Scripted Actions** and switch on the "Run scripted actions when..." options for a session host being created, destroyed, stopped or started. The created option has two slots: immediately after VM creation (after domain join, before the AVD agent registers) or after the VM joins the host pool (before users can reach it). Or run a script across a pool with **Hosts > Run script**, now or on a schedule.
- **Runbooks are off by default.** Go to **System > Settings > Nerdio**, expand **Azure Runbooks Scripted Actions**, select **Configure** under Current status and switch on "Use Azure Automation Runbooks?". Switching it off deletes the Automation account.
- **Timeout:** Windows scripts run as custom script extensions, which have a 90-minute timeout set by Azure. Inline Script mode for runbooks may fail with scripts above 500 KB; Nerdio points to a hybrid worker for those. Runbooks in Individual mode also have an Execution Timeout field, in minutes.
- **Variables:** built-ins include `$HostPoolName`, `$AzureSubscriptionId`, `$AzureResourceGroupName`, `$AzureRegionName` and `$AzureVMName`. A runbook declares its own in a `<# Variables: ... #>` block and Nerdio prompts for them on **Run now**.
- **Secrets:** global secure variables live in Azure Key Vault, are managed under **System > Settings > Nerdio** (Secure variables), take names of 1 to 20 alphanumeric characters and are read as `$SecureVars.Variable_Name`. Leaving "Pass variable to specified scripted actions only" cleared sends the variable to every scripted action.
- **Source control:** the Premium script repository integration links GitHub, GitLab or [Azure DevOps](https://www.m365.fm/entity/azure-devops/) and, with auto-synchronization on, syncs hourly.

Nerdio's Windows scripted actions page adds that, as of version 5.3, the REST API takes a `ScriptedActions` list; it says `ScriptedActionsIds` should still work but cannot pass parameters. Its deprecation table, however, lists `ScriptedActionsIds` as deprecated on 2023-07-03 and removed in 6.3. Treat your Swagger page as the answer.

## Pitfalls Nerdio documents

- **Deprecations:** 15 endpoints are deprecated, all dated 2024-04-25, including `scripted-actions/{id}/schedule`, `schedule/reimage` and `schedule/script-execution` paths. The page names replacements only for two renames (TimeRangeWithTimeZone to TimeRange, TimeIntervalWithTimeZone to TimeInterval).
- **Secret handling:** the secret cannot be retrieved after you leave the credentials page. Store it in a secure location such as [Azure Key Vault](https://www.m365.fm/entity/azure-key-vault/) and regenerate it if lost.
- **Execution policy:** the manual test runs `Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope CurrentUser` before the script. Nerdio's page gives no warning or revert step; our recommendation is to keep that change to the test account and set the policy back afterwards.
- **AADSTS90014:** the module troubleshooting page attributes this error on connect to a missing `-ApiScope` switch or a stray character, such as a trailing space after a line-continuation backtick.
- **"Complete" is not always success:** a script can show Complete although it failed. Nerdio suggests opening the Automation account and matching the runbook log by timestamp, and making error-producing commands exit the script so the job shows Fail.
- **Reboots inside scripts fail the run.** Use the restart option or the execution mode "Individual with restart" and split the script.
- **Az modules:** for module errors Nerdio says to upgrade the module in the Automation account and not to use the **Update Az Modules** button, which it says does not update to the latest versions.

## Choosing a route

Use the REST API when another system owns the trigger and you need a documented, versioned interface. Use the module for administrator scripts where cmdlets are easier to read and you accept preview status. Use scripted actions when the code must run on a host or against Azure at a Nerdio-controlled moment, such as host creation or an image update. Test on a development host first and pin your work to the version you run.

## Related

- [Nerdio Manager for Enterprise](https://www.m365.fm/entity/nerdio-manager-for-enterprise/)
- [Nerdio scripted actions](https://www.m365.fm/entity/nerdio-scripted-actions/)
- [REST API](https://www.m365.fm/entity/rest-api/)
- [PowerShell](https://www.m365.fm/entity/powershell/)
- [Azure Automation](https://www.m365.fm/entity/azure-automation/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)

## Sources

- [Nerdio Help: REST API Overview](https://nmehelp.getnerdio.com/hc/en-us/articles/26124297319821-REST-API-Overview)
- [Nerdio Help: Getting Started with REST API Integration](https://nmehelp.getnerdio.com/hc/en-us/articles/26124297445901-Getting-Started-with-REST-API-Integration)
- [Nerdio Help: REST API Endpoint Implementation](https://nmehelp.getnerdio.com/hc/en-us/articles/26124316548877-REST-API-Endpoint-Implementation)
- [Nerdio Help: REST API Manual Configuration](https://nmehelp.getnerdio.com/hc/en-us/articles/27422824784269-REST-API-Manual-Configuration)
- [Nerdio Help: REST API Deprecated Endpoints and Properties](https://nmehelp.getnerdio.com/hc/en-us/articles/29088961923981)
- [Nerdio Help: PowerShell Module: Tutorial](https://nmehelp.getnerdio.com/hc/en-us/articles/26124355338893)
- [Nerdio Help: PowerShell Module: Install the Public Preview Version](https://nmehelp.getnerdio.com/hc/en-us/articles/26124379874061-PowerShell-Module-Install-the-Public-Preview-Version)
- [Nerdio Help: PowerShell Module: Advanced Guide](https://nmehelp.getnerdio.com/hc/en-us/articles/26124358120589)
- [Nerdio Help: PowerShell Module: Troubleshooting](https://nmehelp.getnerdio.com/hc/en-us/articles/26124369328013-PowerShell-Module-Troubleshooting)
- [Nerdio Help: PowerShell Module: Export the Host Pool Configuration](https://nmehelp.getnerdio.com/hc/en-us/articles/26124385859981)
- [Nerdio Help: Scripted actions overview](https://nmehelp.getnerdio.com/hc/en-us/articles/26124327585421)
- [Nerdio Help: Scripted actions for Azure Runbooks](https://nmehelp.getnerdio.com/hc/en-us/articles/26124302308109)
- [Nerdio Help: Windows Scripted Actions: Usage, Supported Features, and Considerations](https://nmehelp.getnerdio.com/hc/en-us/articles/26124368713741-Windows-Scripted-Actions-Usage-Supported-Features-and-Considerations)
- [Nerdio Help: Considerations for Scripted Actions](https://nmehelp.getnerdio.com/hc/en-us/articles/26124352596749-Considerations-for-Scripted-Actions)
- [Nerdio Help: Scripted Actions: Azure runbooks variables integration](https://nmehelp.getnerdio.com/hc/en-us/articles/26124313271053-Scripted-Actions-Azure-runbooks-variables-integration)
- [Nerdio Help: Scripted Actions Global Secure Variables](https://nmehelp.getnerdio.com/hc/en-us/articles/26124302368909)
- [Nerdio Help: Script repositories integration](https://nmehelp.getnerdio.com/hc/en-us/articles/26124385380877)
- [Nerdio Help: Run Bulk Host Scripted Actions](https://nmehelp.getnerdio.com/hc/en-us/articles/26124337068045-Run-Bulk-Host-Scripted-Actions)
- [Nerdio Help: Troubleshoot Scripts](https://nmehelp.getnerdio.com/hc/en-us/articles/26124334376717)
- [Nerdio Help: Release Notes](https://nmehelp.getnerdio.com/hc/en-us/articles/19837802929677)
- [Nerdio: Introducing Nerdio Manager for Enterprise Premium](https://getnerdio.com/blog/introducing-nerdio-manager-enterprise-premium/)
- [Nerdio: Nerdio Manager for Enterprise Premium features (PDF, February 2024)](https://getnerdio.com/wp-content/uploads/2024/02/NME-Premium-Features-02-27-2024.pdf)
- [Learn: OAuth 2.0 client credentials flow on the Microsoft identity platform](https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-client-creds-grant-flow)
