---
title: "Requirements for running AVD session hosts on-premises with Azure Arc"
summary: "Before you register on-premises session hosts with Azure Virtual Desktop Hybrid, you need an Azure side (providers, roles, a host pool with a managed identity), a host side (supported OS, Arc agent, domain join) and outbound network access. This checklist lists each requirement with its source."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-hybrid, azure-virtual-desktop]
keypoints:
  - "Three resource providers matter: Microsoft.DesktopVirtualization for AVD, plus Microsoft.HybridCompute, Microsoft.GuestConfiguration and Microsoft.HybridConnectivity for Azure Arc-enabled servers."
  - "The host pool needs a managed identity, and that identity needs the Reader role on the resource group that holds the Arc-enabled servers. Learn warns that a future release will keep session hosts from becoming available without it."
  - "Create a standard host pool without adding VMs. Session host configuration is not supported on Azure Virtual Desktop Hybrid."
  - "Arc traffic is outbound on TCP 443, and the Azure Virtual Desktop endpoints are outbound too. No inbound ports are needed. Learn does not say which of the Azure fabric address rows apply to on-premises hosts, so test with the Agent URL Tool."
  - "Learn says Azure Arc is not recommended for short-lived or VDI virtual machines. Plan Hybrid session hosts as long-lived machines that you do not delete and recreate under the same name."
faq:
  - q: "Which Azure resource providers do I have to register for Azure Virtual Desktop Hybrid?"
    a: "The Hybrid deployment page requires Microsoft.DesktopVirtualization in the subscription. The Azure Arc prerequisites page requires Microsoft.HybridCompute, Microsoft.GuestConfiguration and Microsoft.HybridConnectivity. Microsoft.AzureArcData is only for Arc-enabled SQL Server, and Microsoft.Compute is listed for Azure Update Manager and automatic extension upgrades."
  - q: "How long does a session host take to show as Available?"
    a: "Learn says it can take up to 15 minutes for the session host to report Available in the host pool after the Arc extension reports Succeeded."
  - q: "Do I need to open inbound firewall ports?"
    a: "No inbound ports are listed. The Azure Connected Machine agent communicates outbound over TCP port 443. The Azure Virtual Desktop required-endpoints page says all entries are outbound and that you do not need to open inbound ports for Azure Virtual Desktop."
---

Running session hosts on-premises with Azure Virtual Desktop Hybrid needs three things in place before the first host registers: the Azure resources and roles, a supported and Arc-enabled Windows machine, and outbound access to the Azure Arc and Azure Virtual Desktop endpoints. This article is a checklist, in the order you will hit each item. For the concept and the decision to use Hybrid, see the [Hybrid explainer](/entity/avd-hybrid/). The page on [Azure Arc](/entity/azure-arc/) covers the connection layer in general.

Azure Virtual Desktop Hybrid was announced as generally available on 1 September 2026. Learn's overview and deployment pages, dated 2 September 2026, show no preview notice.

## 1. Azure side

**Resource providers.** The deployment page requires that **Microsoft.DesktopVirtualization** is registered in your subscription. The Azure Arc prerequisites page lists these providers for Arc-enabled servers: **Microsoft.HybridCompute**, **Microsoft.GuestConfiguration** and **Microsoft.HybridConnectivity**. It also lists Microsoft.AzureArcData (only for Arc-enabled SQL Server) and Microsoft.Compute (for Azure Update Manager and automatic extension upgrades). Learn registers them like this:

```azurepowershell
Register-AzResourceProvider -ProviderNamespace Microsoft.HybridCompute
Register-AzResourceProvider -ProviderNamespace Microsoft.GuestConfiguration
Register-AzResourceProvider -ProviderNamespace Microsoft.HybridConnectivity
```

**Roles.** Host pool management needs the Desktop Virtualization Contributor role. To onboard machines to Arc, you need the Azure Connected Machine Onboarding role or Contributor on the resource group you manage the servers in. To read, modify and delete a machine, you need Azure Connected Machine Resource Administrator on that resource group.

**Host pool, workspace, application group.** Create a standard [host pool](/entity/avd-host-pool/) by following the normal deployment instructions, without adding virtual machines. Learn says not to add VMs to this pool. Session host configuration is not supported. Then create a workspace and an application group if you have none, add the group to the workspace, and assign users.

**Managed identity.** On the host pool's **Identity** tab, assign a managed identity. Learn links to its page on configuring a [managed identity for a host pool](/entity/avd-managed-identity/). That identity needs the **Reader** role on the resource group that contains your Arc-enabled servers. Learn marks this as important: if the identity lacks Reader access to the Arc resource group, "a future release will prevent session hosts from becoming available". In the portal:

1. Open **Resource groups** and select the group with your Arc-enabled servers.
2. Select **Access control (IAM)**, then **Add** and **Add role assignment**.
3. Search for **Reader**, select it and select **Next**.
4. For **Assign access to**, choose **Managed identity**, then **Select members**.
5. Pick your subscription, choose **Host pool** in the **Managed identity** list, select your host pool's identity and confirm with **Review + assign**.

Or in Azure PowerShell:

```azurepowershell
$hostPool    = Get-AzWvdHostPool -Name "<HostPoolName>" -ResourceGroupName "<HostPoolResourceGroup>"
$principalId = $hostPool.IdentityPrincipalId
New-AzRoleAssignment -ObjectId $principalId -RoleDefinitionName "Reader" -ResourceGroupName "<ArcServersResourceGroup>"
```

## 2. The machine

**Operating system and licensing.** Learn lists Windows Server 2025, 2022, 2019 and 2016 (virtual machines and headless physical servers), and Windows 11 and Windows 10 Enterprise (virtual machines, or dedicated headless physical hosts; no laptops or personal PCs). Multi-session editions are not supported. Users need the matching entitlement plus the Azure Virtual Desktop Hybrid service user license.

**Identity.** Windows client hosts can be Microsoft Entra ID-joined, AD DS-joined or hybrid-joined. Windows Server hosts must be AD DS-joined or hybrid-joined, because Entra-only join is not supported. Nerdio's help page for its own tooling says the VMs must be domain joined before the Azure Arc extension is installed. Learn does not state an order, so treat that as a Nerdio requirement and do it in that order anyway.

**Arc agent.** The Azure Connected Machine agent must be installed and configured on each session host. Learn leaves the method open and refers to the Arc deployment options. Several points from the Arc pages matter for desktops:

- The agent supports Windows Server 2016 to 2025 and Windows 10 and 11 clients. For clients, Arc supports them only in a server-like role: always connected to the internet, connected to power and powered on.
- Learn says Microsoft does not recommend running Azure Arc on short-lived servers or VDI virtual machines. Arc cannot tell whether an agent is offline for maintenance or because the VM was deleted, so stale resources can conflict with a recreated VM of the same name. The same page says AVD on Azure Local does not use short-lived VMs and supports Arc on the desktop VMs. For Hybrid, the sources do not address pooled, re-imaged hosts, so assume persistent hosts and test a replacement cycle before production.
- Do not connect a golden image to Arc with `azcmagent connect` before cloning. Cloned machines would share one Azure resource ID and end up disconnected. You can install the `azcmagent` package into the image and connect each clone afterwards with a unique name. Learn says a 429 error is a typical symptom of the cloned-ID case, and gives `azcmagent disconnect --force-local-only` followed by a new `azcmagent connect` as the fix.
- If Group Policy manages "Log on as a service", add `NT SERVICE\himds`, which runs the Hybrid Instance Metadata Service.
- Exclude the installer location from antivirus scans during installation.
- Stay on an agent version from the last year. Learn says only those are officially supported.
- For TLS, Learn says Windows agents from version 1.56 need at least one of the listed cipher suites for TLS 1.2 or 1.3, for example `TLS_AES_256_GCM_SHA384` or `TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384`.

## 3. Network

**Azure Arc.** The agent communicates outbound over TCP port 443. Learn lists these service tags: `AzureActiveDirectory`, `AzureTrafficManager`, `AzureResourceManager`, `AzureArcInfrastructure`, `Storage` and `AzureFrontDoor.Frontend` (required as of April 2026). Among the URLs marked "Always" are `login.microsoftonline.com`, `*.login.microsoft.com`, `pas.windows.net`, `*.his.arc.azure.com`, `*.guestconfiguration.azure.com`, `guestnotificationservice.azure.com` and `*.servicebus.windows.net` (or `azgn*.servicebus.windows.net`). `management.azure.com` is needed when you connect or disconnect a server, and `download.microsoft.com` at installation and automatic update time. For regional Entra token endpoints, allow `*.login.microsoft.com` or `<region>.login.microsoft.com` for each region where the servers are registered. Learn says the Arc agent does not support a Log Analytics gateway as a proxy, and that an Arc private link scope is an option instead of public paths and proxies. If you filter by `AzureArcInfrastructure`, allow the full tag range, not only a regional one.

Traffic is light. Learn gives a heartbeat every five minutes (under 64 KB) and one persistent WebSocket connection. Extension packages can be up to 2 GB, so the install of the AVD extension is the heaviest moment.

**Azure Virtual Desktop.** The deployment page requires that session hosts reach the AVD required URLs. In the Azure cloud list, these include `login.microsoftonline.com` (TCP 443), `*.wvd.microsoft.com` (TCP 443), `*.service.windows.cloud.microsoft`, `*.windows.cloud.microsoft` and `*.windows.static.microsoft` (TCP 443), `mrsglobalsteus2prod.blob.core.windows.net` (agent and side-by-side stack updates), `gcs.prod.monitoring.core.windows.net` and `*.prod.warm.ingest.monitor.core.windows.net` (agent traffic), and `azkms.core.windows.net` on TCP 1688 for Windows activation. Learn says Microsoft does not support deployments where these entries are blocked, and recommends service tags and FQDN tags, because AVD has no IP list to allow instead.

The same page lists two Azure fabric addresses, `169.254.169.254` and `168.63.129.16`, for session host VMs and Cloud PCs. It says traffic to them must not be intercepted, proxied or redirected. Neither the required-endpoints page nor the Hybrid pages say how these rows apply to a machine on your own hypervisor, where Arc serves the metadata endpoint locally (`IMDS_ENDPOINT` points to `http://localhost:40342`). Run the Azure Virtual Desktop Agent URL Tool on a host, which Learn describes as validating each required FQDN and endpoint, and do not assume.

**Proxies.** Learn recommends bypassing proxies for AVD traffic, advises against SSL termination and against authenticating proxies, because the agent components run in the system context and do not support proxies that require authentication.

**Clients.** Users need the end-user endpoints from the same page, for example `*.wvd.microsoft.com`, `login.microsoftonline.com` and `graph.microsoft.com` on TCP 443. [Windows App](/entity/windows-app/) is the client that Learn names for Hybrid.

## 4. Register the host

In the portal:

1. Open **Azure Arc**, then **Infrastructure**, then **Machines**, and select the machine.
2. Under **Settings**, select **Extensions**, then **Add**.
3. Select the **Azure Virtual Desktop Hybrid** extension and select **Next**.
4. Choose the subscription, resource group and host pool, then **Review + Create** and **Create**.

In PowerShell, you need the `Az.DesktopVirtualization` and `Az.ConnectedMachine` modules. Generate a registration key (Learn's example uses 24 hours), then run the extension with it:

```azurepowershell
$expiresUtc = (Get-Date).ToUniversalTime().AddHours(24).ToString("yyyy-MM-ddTHH:mm:ss.fffffffZ")
$regInfo    = New-AzWvdRegistrationInfo -ResourceGroupName $HostPoolRG -HostPoolName $HostPoolName -ExpirationTime $expiresUtc
$protectedSettings = @{ registrationToken = $regInfo.Token }
New-AzConnectedMachineExtension -Name 'Microsoft.AzureVirtualDesktop.CloudDeviceExtension' -ResourceGroupName '<ResourceGroupName>' -MachineName '<MachineName>' -Location '<Azure Region>' -Publisher 'Microsoft.AzureVirtualDesktop' -ExtensionType 'CloudDeviceExtension' -ProtectedSetting $protectedSettings
```

On Windows Server, the extension enables the Remote Desktop Session Host role and reboots the host if it has to install the role. Install the role first to avoid that reboot.

## 5. Verify

1. In the Arc machine's **Extensions** list, the status of `Microsoft.AzureVirtualDesktop.CloudDeviceExtension` shows **Succeeded**. The PowerShell check is `Get-AzConnectedMachineExtension`.
2. In the host pool's **Session hosts** list, the host is **Available**. Learn says this can take up to 15 minutes after the extension succeeds.
3. If a host does not appear, check the Arc side first. The agent sends a heartbeat every five minutes, and Learn says a server silent for more than 15 minutes may be offline, blocked by the network or have a stopped agent. Logs are in `%ProgramData%\AzureConnectedMachineAgent\Log` (`himds.log`, `azcmagent.log`).
4. If Arc is healthy and the host is still not Available, the cause is on the Azure Virtual Desktop side. Check the Reader role on the Arc resource group, the registration key's expiry and the required endpoints, then work through the existing checklist for session hosts that show Unavailable.

## Sources

All pages retrieved on 17 November 2026.

- [Microsoft Learn: Deploy Azure Virtual Desktop Hybrid on-premises](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop-hybrid)
- [Microsoft Learn: Azure Virtual Desktop Hybrid overview](https://learn.microsoft.com/en-us/azure/virtual-desktop/hybrid-overview)
- [Microsoft Learn: Required FQDNs and endpoints for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/required-fqdn-endpoint)
- [Microsoft Learn: Proxy server guidelines for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/proxy-server-support)
- [Microsoft Learn: Connected Machine agent prerequisites](https://learn.microsoft.com/en-us/azure/azure-arc/servers/prerequisites)
- [Microsoft Learn: Overview of the Azure Connected Machine agent](https://learn.microsoft.com/en-us/azure/azure-arc/servers/agent-overview)
- [Microsoft Learn: Azure Arc network requirements](https://learn.microsoft.com/en-us/azure/azure-arc/network-requirements-consolidated)
- [Tech Community: Microsoft Azure Virtual Desktop Hybrid is now generally available](https://techcommunity.microsoft.com/t5/azure-virtual-desktop-blog/microsoft-azure-virtual-desktop-hybrid-is-now-generally/ba-p/4550523)
- [Nerdio Manager help: AVD Hybrid Support](https://nmehelp.getnerdio.com/hc/en-us/articles/45272022792461-AVD-Hybrid-Support)
