---
title: "Azure Arc Connected Machine Agent Shows Disconnected or Expired: Fix Steps"
summary: "What Disconnected and Expired mean for an Azure Arc-enabled server, the heartbeat and 45-day rules, how to reconnect with azcmagent, selected error codes with fixes, log locations and the gaps in the Learn pages."
status: review
publish: false
author: mirko-p
date: 2027-01-09
topics: [azure-arc, azure-connected-machine-agent]
keypoints:
  - "The agent sends a heartbeat every five minutes. If heartbeats stop, the status changes to Disconnected within 15 to 30 minutes and returns to Connected automatically when they resume."
  - "If a machine stays disconnected for 45 days, its status might change to Expired. An expired machine cannot be managed until an administrator disconnects and reconnects it."
  - "The managed identity certificate is valid for 90 days. The agent tries to renew when 45 or fewer days remain, as long as it stays connected."
  - "Logs are in %ProgramData%\\AzureConnectedMachineAgent\\Log\\azcmagent.log on Windows and /var/opt/azcmagent/log/azcmagent.log on Linux. Use azcmagent check and the --verbose flag."
  - "The troubleshooting page does not define Expired or give a reconnect procedure. Those facts come from the Arc overview and identity pages."
faq:
  - q: "What does Disconnected mean?"
    a: "Microsoft Learn says the agent sends a heartbeat every five minutes. If the service stops receiving heartbeats, it considers the machine offline and the status changes to Disconnected within 15 to 30 minutes. It returns to Connected automatically when heartbeats resume."
  - q: "What does Expired mean?"
    a: "If a machine remains disconnected for 45 days, its status might change to Expired. An expired machine cannot be managed through Azure Arc until a server administrator disconnects and then reconnects it. The credential is valid for up to 90 days and renews every 45 days."
  - q: "How do I fix an expired agent?"
    a: "Learn says an expired machine cannot be managed until a server administrator disconnects and then reconnects it, and that the agent cannot restore its connection automatically. The agent troubleshooting page shows azcmagent disconnect and azcmagent connect in its error fixes and examples. The identity page points to a separate re-onboarding page that was not read for this article."
  - q: "Where are the agent logs?"
    a: "On Windows, %ProgramData%\\AzureConnectedMachineAgent\\Log\\azcmagent.log. On Linux, /var/opt/azcmagent/log/azcmagent.log. Root access is required on Linux to run azcmagent."
  - q: "How do I test connectivity?"
    a: "Run azcmagent check to see whether a firewall is blocking access to Microsoft Entra ID or Azure Resource Manager."
---

A machine that shows Disconnected has stopped sending heartbeats to the service. One that shows Expired has been disconnected long enough that it cannot return on its own. This guide combines three Microsoft Learn pages: the Arc-enabled servers overview for the status rules, the managed identity page for the certificate, and the agent onboarding troubleshooting page for error codes. The troubleshooting page itself does not define the two statuses.

## Status rules

- **Where to look:** in the Azure portal under **Azure Arc** > **Machines**.
- **Disconnected:** the agent sends a heartbeat every five minutes. If the service stops receiving heartbeats, it considers the machine offline and the status changes to Disconnected within 15 to 30 minutes. When a heartbeat arrives again, the status goes back to Connected automatically.
- **Expired:** if a machine stays disconnected for 45 days, its status might change to Expired. An expired machine cannot be managed through Azure Arc until a server administrator disconnects and reconnects it. The exact date depends on the expiration of the managed identity's credential.
- **Cloning:** a machine that receives 429 errors or shows intermittent connection status may be an incorrectly cloned machine. The page links to cloning guidelines.

## Why the certificate matters

The certificate behind the managed identity is valid for 90 days. The agent tries to renew it when 45 or fewer days remain, and as long as the agent stays connected it rotates the credential automatically. If the agent is offline long enough for the credential to expire, the agent becomes expired too and does not connect. The agent cannot automatically restore its connection then, and the machine must be disconnected and reconnected.

The agent stores the certificate in `C:\ProgramData\AzureConnectedMachineAgent\Certs\` on Windows and `/var/opt/azcmagent/certs` on Linux. Learn says not to change access to the certificate files or modify them yourself. Disconnecting removes the resource in Azure, including its managed identity.

## Fix a Disconnected machine

The pages give no dedicated procedure for this, and the error tables cover connection and onboarding problems rather than the Disconnected status as such. The steps below are my advice, built on what the pages state.

1. Check that the machine is on and can reach Azure. Run `azcmagent check`, which tests whether a firewall blocks Microsoft Entra ID (`login.windows.net`) or Azure Resource Manager (`management.azure.com`).
2. Make sure the agent service, HIMDS, is running. The error table says to start or restart it as needed.
3. Look at the log file for the error code.

## Fix an Expired machine

Disconnect and reconnect the agent. The troubleshooting page shows these commands in its error fixes and verbose-log examples:

- `azcmagent disconnect` removes the current connection.
- `azcmagent disconnect --force-local-only` is for cases where the Azure resource was deleted first.
- `azcmagent connect` with the resource group, tenant ID, location and subscription ID connects again. Add `--verbose` for detailed logging.

The page does not give a full reconnect walkthrough.

## Logs

- Windows: `%ProgramData%\AzureConnectedMachineAgent\Log\azcmagent.log`.
- Linux: `/var/opt/azcmagent/log/azcmagent.log`.
- Windows MSI install log: `%SystemRoot%\AzureConnectedMachineAgent\temp\installationlog.txt`.
- Root access is required to run azcmagent on Linux.

## Selected error codes from the troubleshooting page

| Code | Cause | Fix per Learn |
| --- | --- | --- |
| AZCM0004 | Arc proxy service is not running | Make sure HIMDS is running and try again |
| AZCM0018 | No administrative privileges | Retry in an elevated context |
| AZCM0026 | Network error or service unavailable | Check that the required endpoints are reachable |
| AZCM0041 | Invalid credentials | Check device-login access or the service principal's client ID, secret and expiry |
| AZCM0044 | Resource name already exists | Use another resource name or delete the existing server in Azure |
| AZCM0063 | Disconnect failed | If the error persists, delete the resource in Azure, then run `azcmagent disconnect --force-local-only` |
| AZCM0067 | Already connected | Run `azcmagent disconnect`, then connect again |
| AZCM0081 | Managed identity certificate download failed | If this happens while connecting, delete the resource in Azure and connect again |

For connection errors, the connection table also says to verify that you or the service principal are members of the **Azure Connected Machine Onboarding** role (for a 403 authorization error) and to register the resource providers (when the subscription is not registered for the Microsoft.HybridCompute namespace).

## What the pages do not say

- A page that documents `azcmagent show`.
- How the Expired status looks in agent output.
- How to find the credential expiry date.
- The recovery steps for an expired machine. The identity page links to a separate re-onboarding section that was not read for this article.
- Proxy guidance in one place. It is spread across the error tables.

## A recovery outline (my advice)

This outline is my own advice, built on the pages.

1. Check the status and how long the machine has been offline.
2. If it is under 45 days, restore connectivity and wait for heartbeats.
3. If it is expired, plan a disconnect and reconnect with onboarding credentials.
4. Review extensions and configuration afterward, because disconnecting removes the Azure resource.

## Typical mistakes (my advice)

- Waiting for an expired machine to come back by itself.
- Editing certificate files.
- Running azcmagent without elevation.
- Cloning an Arc-connected machine without following the cloning guidelines.

## Related

- [Azure Arc](https://www.m365.fm/entity/azure-arc/)
- [Azure Connected Machine Agent](https://www.m365.fm/entity/azure-connected-machine-agent/)
- [Azure Monitor](https://www.m365.fm/entity/azure-monitor/)

## Sources

- [Troubleshoot Azure Connected Machine agent connection issues (Microsoft Learn)](https://learn.microsoft.com/azure/azure-arc/servers/troubleshoot-agent-onboard)
- [Azure Arc-enabled servers Overview (Microsoft Learn)](https://learn.microsoft.com/azure/azure-arc/servers/overview)
- [Managed identity and access control (Microsoft Learn)](https://learn.microsoft.com/azure/azure-arc/servers/security-identity-authorization)
