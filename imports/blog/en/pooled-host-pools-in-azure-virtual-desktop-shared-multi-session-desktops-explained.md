---
title: "Pooled host pools in Azure Virtual Desktop: shared multi-session desktops explained"
summary: "A pooled host pool lets user sessions be load balanced to any session host, with several users on one VM at the same time. This article explains how sessions, load balancing, profiles, updates and power management work in a pooled pool."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-pooled-host-pool, avd-host-pool]
keypoints:
  - "In a pooled host pool several users share one session host, and users are not assigned to hosts. Learn describes the result as a shared experience with lower costs and greater efficiency."
  - "Pooled pools use breadth-first or depth-first load balancing. Depth-first requires a maximum session limit, autoscale on a pooled pool requires a custom one even with breadth-first, and under high concurrent load a host can exceed the limit."
  - "Users in pooled pools should keep their profile in FSLogix, because a new sign-in can land on a different session host."
  - "Windows is kept current by redeploying session hosts from updated images, and in-place upgrades from Windows 10 to Windows 11 are not supported on pooled session hosts."
  - "Power management autoscaling is generally available. Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, in July 2026, while some Learn pages still carry preview wording, so check the current page before relying on a limit."
faq:
  - q: "How many users can share one session host in a pooled host pool?"
    a: "It depends on the maximum session limit you set and on the VM's resources. The multi-session FAQ gives no fixed number and says concurrent sessions depend on vCPU, memory, disk and vGPU, how users work and how heavy the workload is. Learn's sizing guidelines list maximum users per vCPU as a starting estimate: Light 6, Medium 4, Heavy 2, Power 1. Validate on your own system."
  - q: "Do pooled host pools need FSLogix?"
    a: "Learn says users in pooled host pools should store their profile data in FSLogix, because they can be load balanced to different session hosts. It also says FSLogix comes pre-installed on all available Windows Enterprise multi-session images. FSLogix profile containers for cloud-only and external identities were announced as generally available in May 2026, and the FSLogix article describes them on Azure Files."
  - q: "Can a pooled host pool publish RemoteApp?"
    a: "Yes. Learn says RemoteApp application groups are available with pooled host pools only, while desktop application groups work with pooled or personal pools. A pooled pool can have one desktop application group and several RemoteApp application groups."
---

A pooled host pool in Azure Virtual Desktop is a group of session hosts that many users share. When a user signs in, the service load balances the session to a host in the pool, and several users can be on one host at the same time. Users are not assigned to hosts, so the user profile should not live on the VM. This article explains the moving parts: sessions, profiles, updates and power management.

Comparison with personal pools, sizing arithmetic, load-balancing algorithms and scaling plans each have their own articles: "Pooled or personal host pools: a decision guide", "Sizing a pooled host pool: users per VM, VM size and cost", "Breadth-first vs depth-first: which load balancing algorithm should a host pool use" and "Azure Virtual Desktop scaling plans explained: schedules, phases and host pools". This one ties the pooled model together.

## What makes a pool "pooled"

Microsoft Learn's [terminology article](https://learn.microsoft.com/en-us/azure/virtual-desktop/terminology) defines the type: user sessions can be load balanced to any session host in the [host pool](/entity/avd-host-pool/), and there can be multiple different users on a single [session host](/entity/avd-session-host/) at the same time. Learn says a [pooled host pool](/entity/avd-pooled-host-pool/) provides a shared remote experience that ensures lower costs and greater efficiency.

Compared with a personal pool, the page states these differences:

- Users are not assigned to session hosts. After a user signs out and back in, the session might be load balanced to a different host.
- The number of sessions per host is set by the maximum session limit property.
- Windows is updated by redeploying session hosts from updated images instead of traditional updates.
- Users should store their profile data in FSLogix.

All hosts in a pool should be sourced from the same image for a consistent user experience.

## The operating system behind it

Shared sessions need a multi-session capable OS. Learn's [FAQ for Windows Enterprise multi-session](https://learn.microsoft.com/en-us/azure/virtual-desktop/windows-multisession-faq) says Windows 10 and Windows 11 Enterprise multi-session allow multiple concurrent interactive sessions, which previously only Windows Server could do. Facts worth knowing before you build:

- Licensing: you can use existing per-user Windows licensing instead of RDS Client Access Licenses. The [prerequisites page](https://learn.microsoft.com/en-us/azure/virtual-desktop/prerequisites) lists the entitling licenses, such as Microsoft 365 E3, E5, A3, A5, F3 and Business Premium, and Windows Enterprise E3 and E5. For Windows Server session hosts it lists RDS CALs with Software Assurance.
- Where it may run: Learn says it does not allow Windows Enterprise multi-session in production outside the Azure Virtual Desktop service, and it does not activate against on-premises KMS.
- Edition changes: you cannot upgrade an existing VM running Windows Professional or Enterprise to multi-session.
- In-place upgrade: for example from Windows 10 to Windows 11, this is not supported for session hosts in a pooled host pool.
- Reporting: the OS reports ProductType 3, the same value as Windows Server. Some installers may block installation if they detect a client ProductType.
- Join type: the FAQ says Windows Enterprise multi-session can be Microsoft Entra joined. For profiles, the [prerequisites page](https://learn.microsoft.com/en-us/azure/virtual-desktop/prerequisites) says FSLogix Profile Container with Entra joined session hosts needs profiles on Azure Files or Azure NetApp Files and user accounts that are hybrid identities, created in AD DS and synchronized to Microsoft Entra ID. Newer Learn pages go further. What's new for May 2026 announces general availability of FSLogix profile containers for cloud-only and external identities on pooled host pools, and the [FSLogix article on Azure Files and Microsoft Entra ID](https://learn.microsoft.com/en-us/fslogix/how-to-configure-profile-container-azure-ad) lists cloud-only and external identities as supported, in the Azure cloud only. The prerequisites page still states only the hybrid condition, so check the FSLogix article for your identity type.

## Sessions in a pooled pool

Learn's terminology page distinguishes three session states: active, disconnected, and pending. A pending session is a placeholder that reserves a spot on the load-balanced VM while the user signs in, so the user is not kicked out if another user completes sign-in first. Sign-in can take between 30 seconds and five minutes depending on the user profile.

Two load-balancing algorithms exist, set under the pool's **Properties**: breadth-first spreads new sessions across hosts, and depth-first fills one host before moving to the next and requires a [maximum session limit](/entity/avd-maximum-session-limit/). Learn's [load-balancing article](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-host-pool-load-balancing) has the details; see [breadth-first](/entity/avd-breadth-first-load-balancing/), [depth-first](/entity/avd-depth-first-load-balancing/) and [drain mode](/entity/avd-drain-mode/) for the rules.

One point matters for capacity planning. The comparison table on Learn's terminology page says that under high concurrent connection load, when several users connect at the same time, the number of sessions on a host can exceed the maximum session limit. As a planning suggestion, not a Learn statement: leave headroom below the hardware ceiling rather than setting the limit at it.

## Profiles: why they should not live on the VM

Because a user can land on a different host at each sign-in, a profile stored on one VM's disk would not follow them. Learn therefore says pooled users should store profile data in [FSLogix](/entity/fslogix/). FSLogix comes pre-installed on all available Windows Enterprise multi-session images. The FSLogix overview says FSLogix uses a filter driver to virtualize and redirect the profile at the file system level, so applications are unaware the profile is on the network.

The same overview says profile containers can be used with Cloud Cache for high availability and disaster recovery solutions. It also says Office Container (ODFC) is not used together with Profile Container under most circumstances. FSLogix storage design, permissions and sizing need their own planning, and Learn recommends skills in identity and authentication, storage design and architecture, and Windows deployment, among others, for it.

## Updates: replace rather than patch

For pooled pools Learn says Windows is updated by redeploying session hosts from updated images. Learn's What's new page for June 2026 introduces "automated host pools": pools where a single session host configuration (SHC) enforces settings across all session hosts, so updates are made by changing the configuration instead of each host. This article uses "automated host pool" for that case. Learn's [host pool management approaches](https://learn.microsoft.com/en-us/azure/virtual-desktop/host-pool-management-approaches) page says the session host configuration approach can be used with pooled host pools only. See [session host configuration](/entity/avd-session-host-configuration/) for the object itself, and the article "The golden image lifecycle: build, test, release, retire" for building the images.

Session host configuration and update belong to the enhanced host pool management that Microsoft announced as generally available in July 2026. In an automated host pool, [session host update](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update) deallocates or deletes existing VMs and creates new ones with the updated configuration. Files, registry keys or certificates added manually do not survive. Put them in the image, in configuration management such as Intune or Group Policy, or in the custom configuration script. Learn also says to disable autoscale before an update and keep it disabled until it finishes, because an enabled scaling plan can make the update fail with a runtime error.

Choose this approach deliberately. Learn states that the management approach is set when you create the host pool and cannot be changed later, and that a pool created without a session host configuration cannot get one afterwards. With a session host configuration you also cannot create, update or scale session hosts outside the Azure Virtual Desktop service using tools designed for standard management, and you cannot retrieve a registration token to add hosts created outside the service. Session host update is only available in the global Azure cloud, not in clouds such as Azure US Government or Azure operated by 21Vianet.

### Limits at creation

Per the [host pool creation article](https://learn.microsoft.com/en-us/azure/virtual-desktop/create-host-pools-azure-marketplace): up to 500 session hosts with a session host configuration, and up to 400 with standard management, both depending on subscription quota, and you can add more later.

## How many users fit on a host

The Windows multi-session FAQ gives no fixed user count. It says the number of simultaneously active sessions depends on vCPU, memory, disk and vGPU, how users work in their sessions and how heavy the workload is, and suggests validating on your own system. The [sizing guidelines](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/session-host-virtual-machine-sizing-guidelines) do give starting values for multi-session as maximum users per vCPU: Light 6, Medium 4, Heavy 2 and Power 1. The page calls its examples generic guidelines to use only for initial performance estimates, and adds that a host which copes with steady load may still not cope with everyone signing in at once. The article "Sizing a pooled host pool: users per VM, VM size and cost" covers core counts and the arithmetic.

## Power management for pooled pools

Pooled pools can start and stop hosts to match demand. The terminology page's comparison table says autoscale for pooled host pools turns VMs on and off based on the capacity thresholds and schedules you define. Learn names two scaling methods:

- **[Power management autoscaling](/entity/avd-power-management-autoscaling/)** powers hosts on and off. The [autoscale scenarios page](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios) labels it generally available, and it is the option for pools with standard management.
- **[Dynamic autoscaling](/entity/avd-dynamic-autoscaling/)** also creates and deletes session hosts. It can only be used for pooled host pools with a session host configuration. Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, session host configuration and update, and ephemeral OS disks, in July 2026 ([Tech Community announcement](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)). Some Learn pages, for example the scenarios and glossary pages and the module version 5.4.2-preview that the scaling plan article requires for PowerShell, still carry preview wording; check the current page before relying on a limit. What's new says in June 2026 that it is "now available" for pooled host pools with session host configuration. The scenarios page says it is not supported in Azure Government.

"Power management autoscaling vs dynamic autoscaling: which one fits your host pools" compares them.

Both methods share one prerequisite for pooled pools that is easy to miss. The [scaling plan article](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan) says that when you use autoscale for a pooled host pool, you must set a custom maximum session limit, and it says not to use the default value. The [load-balancing article](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-host-pool-load-balancing) gives the breadth-first default as 999999. So breadth-first pools also need an explicit limit before autoscale is switched on.

Autoscale also changes which algorithm counts. The scenarios page says that for pooled host pools, autoscale ignores the load-balancing algorithm in the host pool settings and instead applies load balancing based on the schedule configuration. Choosing breadth-first or depth-first in the host pool therefore matters for pools without autoscale; with autoscale, the scaling plan schedule decides. The article "Depth-first load balancing and autoscale: how the schedule overrides the host pool setting" walks through this.

[Start VM on Connect](https://learn.microsoft.com/en-us/azure/virtual-desktop/start-virtual-machine-connect) behaves differently in pooled pools: it powers on a host only when none are on, and starts further VMs only when the first reaches the session limit. It starts a VM every five minutes at most, so a user may see "No resources available" and need to retry.

## Application groups on pooled pools

Pooled pools support both [application group](/entity/avd-application-group/) types, while [RemoteApp](/entity/avd-remoteapp/) groups are available with pooled pools only. The article "Application groups in Azure Virtual Desktop: desktop and RemoteApp groups explained" covers the rules.

## Checklist before you build

1. Confirm that users can share a machine and that their profile can move to FSLogix.
2. Choose a multi-session image and verify your license entitlement.
3. Set a maximum session limit: required for depth-first, and required as a custom value, not the default, for any pooled pool that uses autoscale. Choose a load-balancing algorithm for pools without autoscale; with autoscale the schedule applies the load balancing instead.
4. Decide between standard management and a session host configuration before you create the pool. Learn says the approach is set at creation and cannot be changed later, and a pool created without a session host configuration cannot get one afterwards. Plan image updates as redeployments, not in-place patches.
5. Decide how hosts are powered on and off, and check the current Learn page for the limits of that method.
6. Pilot, then measure sessions per host and logon times.

## Sources

Retrieved 17 November 2026.

- [Microsoft Learn: Azure Virtual Desktop terminology](https://learn.microsoft.com/en-us/azure/virtual-desktop/terminology)
- [Microsoft Learn: FAQ for Windows Enterprise multi-session](https://learn.microsoft.com/en-us/azure/virtual-desktop/windows-multisession-faq)
- [Microsoft Learn: Prerequisites for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/prerequisites)
- [Microsoft Learn: Configure host pool load balancing in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-host-pool-load-balancing)
- [Microsoft Learn: Host pool management approaches](https://learn.microsoft.com/en-us/azure/virtual-desktop/host-pool-management-approaches)
- [Microsoft Learn: Session host update in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update)
- [Microsoft Learn: Create a host pool in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/create-host-pools-azure-marketplace)
- [Microsoft Learn: Autoscale scaling plans and example scenarios](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Microsoft Learn: Autoscale glossary](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-glossary)
- [Microsoft Learn: Create and assign an autoscale scaling plan](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Azure Virtual Desktop blog: Enhanced host pool management for Azure Virtual Desktop is now generally available](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
- [Microsoft Learn: Start VM on Connect](https://learn.microsoft.com/en-us/azure/virtual-desktop/start-virtual-machine-connect)
- [Microsoft Learn: What is FSLogix](https://learn.microsoft.com/en-us/fslogix/overview-what-is-fslogix)
- [Microsoft Learn: Use Azure Files and Microsoft Entra ID with FSLogix profile containers](https://learn.microsoft.com/en-us/fslogix/how-to-configure-profile-container-azure-ad)
- [Microsoft Learn: Session host virtual machine sizing guidelines](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/session-host-virtual-machine-sizing-guidelines)
