---
title: "Replicate Azure VMs to Another Region With Azure Site Recovery"
summary: "Enable Azure-to-Azure replication with Site Recovery: prerequisites, permissions, outbound URLs, the portal steps, what gets created, and why you should run a disaster recovery drill afterwards."
status: review
publish: false
author: mirko-p
date: 2026-12-23
topics: [azure-site-recovery]
keypoints:
  - "Create a Recovery Services vault in a region other than the source region, then Enable replication under Azure virtual machines in the vault."
  - "You need Site Recovery Contributor for vault operations and Virtual Machine Contributor, or equivalent rights, to create target VMs."
  - "Replication installs the Site Recovery Mobility service extension on each VM and uses a cache storage account in the source region. Target VMs are created only at failover."
  - "Outbound access is needed to blob storage, login.microsoftonline.com, hypervrecoverymanager.windowsazure.com and servicebus.windows.net. Authentication proxies are not supported."
  - "You can select up to 10 VMs in one go. Run a disaster recovery drill to verify failover."
faq:
  - q: "Which roles are needed for Azure Site Recovery?"
    a: "Microsoft Learn says creating a vault needs Admin or Owner on the subscription, managing vault operations needs the Site Recovery Contributor built-in role, and creating target VMs needs Virtual Machine Contributor or permissions to create VMs in the virtual network and write to storage accounts and managed disks."
  - q: "Where should the vault be?"
    a: "Learn's tutorial says to choose a region other than the source region for the Recovery Services vault."
  - q: "Are target VMs created during replication?"
    a: "No. Learn says target VMs are not created until failover, when they are restored from a recovery point. Replication creates the vault, the Mobility service extension on each VM, a cache storage account in the source region, recovery points and default replication settings."
  - q: "What network access is required?"
    a: "Outbound connectivity to *.blob.core.windows.net, login.microsoftonline.com, *.hypervrecoverymanager.windowsazure.com and *.servicebus.windows.net, or the matching service tags Storage, Microsoft Entra ID, EventsHub and AzureSiteRecovery on port 443. Authentication proxies are not supported."
  - q: "How many VMs can I enable at once in the tutorial?"
    a: "The tutorial says to select up to 10 VMs on the Virtual machines tab."
---

Azure Site Recovery (ASR) replicates Azure VMs to another region so you can fail over if the source region has an outage. This guide follows the Microsoft Learn tutorial for enabling Azure-to-Azure replication, with the prerequisites that commonly block the first attempt.

## Prerequisites

From the tutorial:

- An Azure subscription.
- A supported region. Vaults in South Central India and North East US 5 aren't supported for Azure-to-Azure disaster recovery.
- Windows or Linux VMs that aren't encrypted. For encrypted VMs the tutorial points to the Azure Disk Encryption article. Windows Client licensing isn't preserved after failover, so validate licensing on the recovered VM.
- Permissions: Admin or Owner on the subscription to create a vault, the **Site Recovery Contributor** role for vault operations, and **Virtual Machine Contributor**, or rights to create VMs in the virtual network and write to storage accounts and managed disks, for target VMs.
- Quota in the target region for VM sizes matching the source.
- Latest Windows updates, or Linux root certificates and CRLs.

### Outbound connectivity

Commercial URLs from the page:

- `*.blob.core.windows.net` for cache storage
- `login.microsoftonline.com` for Microsoft Entra ID
- `*.hypervrecoverymanager.windowsazure.com` for replication
- `*.servicebus.windows.net` for monitoring

For network security groups, use the service tags Storage, Microsoft Entra ID, EventsHub and AzureSiteRecovery on port 443. GuestAndHybridManagement is optional, for automatic agent upgrades. Authentication proxies aren't supported, and you should bypass `169.254.169.254` (IMDS) on any proxy.

## Steps in the Azure portal

### Create the vault

1. Sign in to the Azure portal, search for recovery and select **Recovery Services vaults**.
2. Select **+ Create**. On **Basics**, set **Subscription**, **Resource group**, **Vault name** and **Region**. Choose a region other than the source region.
3. Select **Review + create**, **Create**, then **Go to resource**.
4. On the vault overview, select **Enable Site Recovery**.

### Enable replication

1. On the **Site Recovery** page, under **Azure virtual machines**, select **Enable replication**.
2. **Source** tab: set the source **Region**, **Subscription** and **Resource group**, keep **Resource Manager** as the deployment model and keep **Disaster recovery between availability zones** at **No**. Select **Next**.
3. **Virtual machines**: select up to 10 VMs, then **Next**.
4. **Replication settings**: review the defaults created for the target region. For High Churn, go to **Storage** > **View/edit storage configuration** > **Churn for the VM**. Select **Next**.
5. **Manage**: choose a **Replication policy**. Create a **Replication group** only for multi-VM consistent recovery points. Set **Extension settings** (update settings and automation account). Select **Next**.
6. **Review**: check the settings and select **Enable replication**.

The VMs then appear on the vault's **Replicated items** page.

## What gets created

- A Recovery Services vault.
- A **Site Recovery Mobility service extension** on each VM that registers it with Site Recovery.
- A **cache storage account** in the source region that receives disk writes before they go to the target region.
- Recovery points generated from replicated data.
- Default replication settings and a policy for the target region.

Target VMs are not created until failover.

## Notes from the page

- Premium SSD v2 and Ultra Disk use Premium SSD v1 replica disks but keep their source disk type at failover.
- For shared cluster disks, follow the shared-disk guidance and disable and re-enable protection for the whole cluster. Don't use **Add disks**.
- The tutorial uses default settings. For customized configurations, see the enable replication how-to article.

## Next step: a drill

The tutorial's next step is a disaster recovery drill, to verify failover works before you need it. Treat the drill as part of the setup, not an optional extra. The page I read does not cover failover or failback steps, so use the Azure to Azure drill and failover articles for those.

## Where first attempts usually go wrong

The tutorial does not have a troubleshooting section, but its prerequisites point to the likely blockers:

- The vault was created in an unsupported region, or in the same region as the source VMs.
- The VM uses disk encryption, which needs the separate encryption article.
- Outbound traffic to the listed URLs is blocked by a firewall, or goes through an authentication proxy, which isn't supported.
- The account has Contributor rights but not Site Recovery Contributor on the vault.
- The target region has no quota for the VM size.

Checking these before you start saves a failed enablement. This list is derived from the prerequisites rather than quoted from a Microsoft troubleshooting page.

## Checklist

1. Check supported regions and VM encryption.
2. Confirm roles and quota in the target region.
3. Allow the outbound URLs or service tags.
4. Create the vault in a different region from the VMs.
5. Enable replication for up to 10 VMs at a time.
6. Wait for the VMs to appear under **Replicated items**.
7. Run a drill.

## Related

- [Azure Site Recovery](https://www.m365.fm/entity/azure-site-recovery/)

## Sources

- [Tutorial: Set up disaster recovery for Azure VMs](https://learn.microsoft.com/azure/site-recovery/azure-to-azure-tutorial-enable-replication)
