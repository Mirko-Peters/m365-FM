---
title: "Windows 365 Azure Network Connection Health Check Failures and Join Errors"
summary: "How to fix Windows 365 Enterprise provisioning that fails on the Azure network connection: health check by health check, hybrid join and domain join errors, IP exhaustion, permissions and Entra sync timing."
status: review
publish: false
author: mirko-p
date: 2026-12-07
topics: [windows-365, intune, hybrid-entra-join]
keypoints:
  - "Open Devices > Provision Cloud PCs > Azure network connection in the Intune admin center and use View details on the failed check."
  - "The ANC refreshes every six hours, and provisioning fails if a refresh fails during provisioning."
  - "For hybrid join, Microsoft recommends computer objects syncing every 30 minutes and no more than 60. Provisioning fails if the object does not arrive within 90 minutes."
  - "Required roles for the Windows 365 service are Reader on the subscription, Windows365 Network Interface Contributor on the resource group and Windows365 Network User on the virtual network."
  - "Failed provisioning is retried up to three times, and each retry takes a new IP address, so a narrow subnet runs dry."
faq:
  - q: "Where do I see why an Azure network connection failed?"
    a: "Microsoft Learn says each ANC shows a status in the Azure network connection tab and View details on a failed check shows the technical details. After fixing the cause, retry the health check. This needs the Intune Administrator or Windows 365 Administrator role."
  - q: "How long can Entra device sync take before provisioning fails?"
    a: "The troubleshooting article recommends computer objects appearing within 30 minutes, accepts up to 60 minutes and says provisioning fails if the object does not arrive within 90 minutes. The health check page notes that the Entra device sync check is a warning because hybrid join sync can take up to 90 minutes."
  - q: "Why do I run out of IP addresses?"
    a: "Each Cloud PC creates a virtual NIC and takes an address from the subnet. Learn says failed provisioning is retried up to three times, each retry allocating a new vNIC and IP, and addresses are released after hours. Resource locks that block deletion of network interfaces make it worse."
  - q: "What does the domain join account need?"
    a: "Microsoft Learn says the account must be able to join computers to the domain and write to the target OU, must not be restricted in how many computers it can join (default maximum is 10 per user), and the subnet must reach a domain controller."
  - q: "Do Microsoft's pages agree on the PowerShell execution policy?"
    a: "No. The create-ANC article says the execution policy must allow RemoteSigned scripts, while the troubleshooting article says to set Unrestricted if not using Azure CloudShell. Check the current pages for your scenario."
---

When a Windows 365 Enterprise Cloud PC fails to provision, the Azure network connection (ANC) is the first place to look. Each ANC runs a list of health checks, and the failed check names the layer: DNS, domain join, endpoints, IP addresses, Azure permissions or Entra sync. This guide follows the order of Microsoft's pages and keeps to what they document.

A related topic, Azure Policy blocking network interface creation, is only touched on here.

## Step 1: Read the status and the failed check

In the Microsoft Intune admin center, go to **Devices** > **Provision Cloud PCs** > **Azure network connection** (the path Learn gives for creating one). Each connection shows one of these statuses:

- **Running checks**: the list refreshes every five minutes. Wait before assigning the ANC to a policy.
- **Checks successful**: ready to use.
- **Checks successful with warnings**: a non-critical check, such as Entra device sync, may have issues. Policies can still use the ANC.
- **Checks failed**: fix the cause and retry.
- **Inactive**: checks are paused until the ANC is reactivated.

Select **View details** on the failed check. Learn adds that the ANC is refreshed every six hours and provisioning fails if a refresh fails while provisioning runs.

## Step 2: Work through the checks

### DNS and domain join

The check **DNS can resolve Active Directory domain** looks for `_ldap._tcp` SRV records. Learn's fixes: point the vNet's DNS servers to an internal DNS server that can resolve the domain, route the subnet to it, and confirm VMs in the subnet can run `nslookup` against it and receive internal names. If the domain also resolves on the internet, make sure the DNS servers are internal and resolve Active Directory records.

For **Active directory domain join**, each health check run creates a disabled computer object in the OU, with a name similar to `CPC-Hth`. Learn lists the checks:

- The join account has permission to join the domain and to write to the OU.
- The account is not limited in how many computers it can join. The default maximum is 10 per user.
- The subnet can reach a domain controller.
- `Add-Computer` works with those credentials from a VM on the same vNet and subnet.

The provisioning errors page adds: verify domain, OU and credentials in the ANC, since a changed password is a typical cause.

### WinRM and endpoints

WinRM is required to complete ANC setup. Learn says WinRM must not be restricted to specific IP addresses through GPO or the Intune configuration service provider.

For **Endpoint connectivity**, Learn says to avoid TLS inspection on the vNet, confirm the required endpoints resolve and are reachable, check for proxies and firewall rules, and test from a VM on the same subnet. Required endpoints are listed on the Windows 365 network requirements page.

### Entra device sync

A Microsoft Entra ID object must exist for the Cloud PC before MDM enrollment. Learn gives 30 minutes as recommended, 60 minutes as the maximum acceptable and 90 minutes as the failure point. Check the sync period, that Microsoft Entra Connect is healthy, and time a manual `Add-Computer` into the Cloud PC OU. The **Entra ID Sync Warning** can appear when the check runs right after a sync and needs no action if provisioning works.

### Subnet IP usage

Each Cloud PC takes an address. Learn's fixes: leave room for three provisioning retries, remove unused vNICs, use a dedicated subnet and expand the subnet if needed (not possible while devices are connected). `CanNotDelete` resource locks at the resource group level or higher stop automatic deletion of network interfaces, so those vNICs must be removed manually before a retry. The create-ANC page also asks for at least 50% of the subnet's addresses to be free for disaster recovery.

### Azure tenant, network and permission checks

- **Azure tenant readiness**: confirm the subscription is enabled and healthy, since billing problems often disable subscriptions, and check **Policies** for anything blocking resource creation.
- **Azure virtual network readiness**: the vNet must be in a supported region.
- **First party app permissions**: the Windows 365 service principal needs **Reader** on the subscription, **Windows365 Network Interface Contributor** on the resource group and **Windows365 Network User** on the virtual network. Classic subscription administrator roles are not sufficient.
- **Environment and configuration are ready**: infrastructure issues or deleted resources. Retry, then contact support.

## Step 3: Check join-type specific errors

The provisioning errors article lists these:

| Error | Cause and fix from Learn |
|---|---|
| Entra service connection point misconfigured | The SCP does not exist or cannot be discovered. Confirm it exists for all target forests, configured through Microsoft Entra Connect |
| Domain join failed | Verify AD domain, OU and credentials, permissions and domain controller reachability. Test a domain join from an Azure VM on the same vNet |
| Microsoft Entra hybrid join failed | Usually an insufficient AD sync period or slow on-premises replication. Sync computer objects every 30 minutes, no more than 60. The overall window is five hours |
| Intune enrollment failed | Required Intune endpoints must be reachable. No MDM enrollment restrictions may block Windows corporate enrollment. Do not target the Cloud PC OU for Configuration Manager client push |
| Not enough IP addresses | See the subnet section above |
| Request disallowed by policy | An Azure Policy blocks vNIC creation. Look at **Policy** in the Azure portal |

## What the pages do not give

The health checks page lists 15 checks but, for most, no specific fix text. The troubleshooting article gives scenarios by section heading, not exact error strings for every check. The two articles disagree on the PowerShell execution policy (RemoteSigned versus Unrestricted), so verify it for your setup.

## Typical mistakes

- Using a domain join account that is limited to 10 joins.
- Using a public DNS server that cannot resolve the AD domain.
- Placing a `CanNotDelete` lock on the resource group and letting vNICs pile up.
- Not allowing for the 90-minute sync window in hybrid scenarios.
- Revoking the Windows 365 service principal's roles after setup.

## Related

- [Windows 365](https://www.m365.fm/entity/windows-365/)
- [Azure Virtual Desktop](https://www.m365.fm/entity/azure-virtual-desktop/)
- [Microsoft Entra hybrid join](https://www.m365.fm/entity/hybrid-entra-join/)
- [Microsoft Entra Connect](https://www.m365.fm/entity/entra-connect/)

## Sources

- [Azure network connection health checks in Windows 365 (Microsoft Learn)](https://learn.microsoft.com/en-us/windows-365/enterprise/health-checks)
- [Create an Azure network connection (Microsoft Learn)](https://learn.microsoft.com/en-us/windows-365/enterprise/create-azure-network-connection)
- [Troubleshoot Azure network connections (Microsoft Learn)](https://learn.microsoft.com/en-us/windows-365/enterprise/troubleshoot-azure-network-connection)
- [Troubleshoot provisioning errors (Microsoft Learn)](https://learn.microsoft.com/en-us/windows-365/enterprise/provisioning-errors)
