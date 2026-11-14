---
title: "Exchange Hybrid Configuration Wizard Fails: HCW Error Causes and Fixes"
summary: "Fix common Hybrid Configuration Wizard failures with the causes and steps Microsoft documents: HCW8019 to HCW8023, HCW8078, HCW8083, HCW8084, HCW8091, HCW8100 and the Set-WebServicesVirtualDirectory exception."
status: review
publish: false
author: mirko-p
date: 2026-12-23
topics: [exchange-online, exchange-server]
keypoints:
  - "HCW8091 means the Windows Remote Management service is not running on the Exchange server. Start it, then run the wizard again."
  - "HCW8100, HCW8084 and HCW8083 are usually transient connection problems. Close and rerun the wizard to start a new connection."
  - "HCW8078 comes from throttling of New-MigrationEndpoint. Use the latest wizard, or create the endpoint with Exchange Online PowerShell."
  - "HCW8019 to HCW8023 point to an incorrect setting in the hybrid configuration object. Run Remove-HybridConfiguration, then run the wizard again."
  - "A Set-WebServicesVirtualDirectory exception means the wizard ran from a server without the Client Access role. Run it from a server that has the role."
faq:
  - q: "What causes HCW8091?"
    a: "The error text is WinRM service is not enabled. Microsoft Learn says it occurs if a required service is not running on the Exchange server, specifically Windows Remote Management. Check Services.msc, make sure Windows Remote Management is running and run the wizard again."
  - q: "Are HCW8083, HCW8084 and HCW8100 permanent errors?"
    a: "Learn calls them usually transient issues caused by a network connection or device. The resolution is to close the wizard and run it again, which starts a new connection."
  - q: "What is HCW8078?"
    a: "The message is Migration Endpoint can't be created. Learn says the migration service throttles concurrent or closely spaced New-MigrationEndpoint calls. Use the latest wizard, which retries automatically, or create the endpoint in Exchange Online PowerShell."
  - q: "Does Remove-HybridConfiguration break my hybrid deployment?"
    a: "Learn says that for HCW8019 to HCW8023, running Remove-HybridConfiguration removes the hybrid configuration object and that existing hybrid deployment configuration settings are not disabled or removed by this step. You then run the wizard again."
  - q: "Where do I download the wizard?"
    a: "The Learn pages point to aka.ms/HybridWizard. They note that the wizard inside the Exchange Management Console of Exchange Server 2010 is no longer supported."
---

The Hybrid Configuration Wizard (HCW) configures hybrid connections between Exchange Server and Exchange Online. When it fails, the error code usually tells you where. This article lists the error pages Microsoft has published and their documented fixes. It does not claim to cover every HCW code, and for codes not listed here you should search Microsoft Learn for the exact number.

## First steps for any failure

1. Download the current wizard from aka.ms/HybridWizard. Learn says the wizard built into the Exchange Management Console in Exchange Server 2010 is no longer supported.
2. Note the exact code and message text.
3. Look at the wizard logs. One Learn page names the Update-HybridConfiguration log under the Exchange server's `V14\Logging\Update-HybridConfiguration\` folder. The path applies to that Exchange version, so look in the matching logging folder for yours.

## HCW8091: WinRM service is not enabled

**Cause.** A required service isn't running on the Exchange server that completes the underlying PowerShell session. The service is Windows Remote Management.

**Fix.**

1. On the Exchange server, select **Start**, then **Run**, type `Services.msc` and press Enter.
2. Find **Windows Remote Management** and make sure it is running.
3. Run the wizard again.

## HCW8100, HCW8084, HCW8083: connection dropped

The messages say the connection to the Remote PowerShell server was disconnected (HCW8100 and HCW8084), or that WinRM can't complete the operation, with a hint to check the computer name, network access and a firewall exception for WinRM (HCW8083).

**Cause.** Learn says this is usually a transient issue caused by a network connection or device.

**Fix.** Close the wizard and run it again. A rerun starts a new connection and should resolve it. If it keeps happening, the HCW8083 text points you at the computer name, network reachability and the WinRM firewall exception.

## HCW8078: Migration Endpoint can't be created

The logs may show `MigrationConnectionTestedTooRecentlyException` with a message that the last connection attempt happened too recently.

**Cause.** The migration service throttles concurrent or closely spaced calls to `New-MigrationEndpoint`.

**Fix, method 1.** Use the latest wizard. It retries automatically, waits for the service-recommended time, usually 15 seconds to two minutes, and shows a retry message.

**Fix, method 2.** If it still fails, connect to Exchange Online PowerShell and create the endpoint with the syntax examples at aka.ms/MEP.

## HCW8019, HCW8021, HCW8022, HCW8023: upgrade errors

The messages say the HybridConfiguration Active Directory object must be upgraded (HCW8019), or that parts of the hybrid configuration weren't properly created or removed during the upgrade (HCW8021 to HCW8023). The Learn page applies to Exchange Online and Exchange Server 2013.

**Cause.** The hybrid configuration object contains an incorrect setting.

**Fix.**

1. Open the Exchange Management Shell.
2. Run `Remove-HybridConfiguration` and confirm with **Yes**. Learn says existing hybrid deployment settings aren't disabled or removed by this step.
3. Run the wizard again.

## Set-WebServicesVirtualDirectory exception

Two messages appear: one that execution of the `Set-WebServicesVirtualDirectory` cmdlet threw an exception which may indicate invalid parameters in your hybrid configuration, and a COM error about `IRemoteWebConfigurationHostServer` with HRESULT 0x80040155.

**Cause.** The wizard was run from a server that doesn't have the Client Access server role installed.

**Fix.** Run the wizard from a server that has the Client Access role.

## Quick triage table

| Code | Likely cause per Learn | Action |
| --- | --- | --- |
| HCW8091 | WinRM service not running | Start Windows Remote Management |
| HCW8083, HCW8084, HCW8100 | Transient connection issue | Close and rerun |
| HCW8078 | Throttled endpoint creation | Latest wizard, or PowerShell |
| HCW8019 to 8023 | Bad setting in hybrid configuration object | Remove-HybridConfiguration, rerun |
| Set-WebServicesVirtualDirectory error | No Client Access role on the server | Run from a CAS server |

## Limits of this article

The pages I read apply to specific Exchange versions, such as 2010, 2013 and 2016, and I did not verify their wording against Exchange Server Subscription Edition. Check the Applies to line on each Learn page for your version. I also did not read the generic Hybrid Configuration Wizard documentation page, because its address from my notes returned no content, so general prerequisites are not covered here.

## Related

- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Exchange Server](https://www.m365.fm/entity/exchange-server/)

## Sources

- [HCW8091 error when running the Hybrid Configuration Wizard](https://learn.microsoft.com/troubleshoot/exchange/hybrid-configuration-wizard-errors/hcw8091-error-when-running-hybrid-configuratio-wizard)
- [HCW8100, HCW8084, or HCW8083 error](https://learn.microsoft.com/troubleshoot/exchange/hybrid-configuration-wizard-errors/hcw8100-hcw8084-or-hcw8083-error)
- [HCW8078 error: Migration Endpoint could not be created](https://learn.microsoft.com/troubleshoot/exchange/hybrid-configuration-wizard-errors/migration-endpoint-could-not-be-created)
- [HCW8019, HCW8021, HCW8022, or HCW8023 error](https://learn.microsoft.com/troubleshoot/exchange/hybrid-configuration-wizard-errors/hcw-errors-about-hybrid-configuration)
- [Can't run the Hybrid Configuration wizard with an exception error](https://learn.microsoft.com/troubleshoot/exchange/hybrid-configuration-wizard-errors/run-hcw-exception-error)
