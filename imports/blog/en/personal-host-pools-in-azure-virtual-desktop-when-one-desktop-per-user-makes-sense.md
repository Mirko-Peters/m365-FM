---
title: "Personal host pools in Azure Virtual Desktop: when one desktop per user makes sense"
summary: "A personal host pool assigns each session host VM to one user, so the desktop keeps its own state on the VM's OS disk. This article sets out when that model fits and which cost controls apply."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-personal-host-pool, avd-host-pool]
keypoints:
  - "In a personal host pool each session host is assigned to one user, the maximum session limit is one, and the user can keep profile data on the VM's OS disk instead of in FSLogix."
  - "Learn describes personal pools as dedicated desktops for performance and data separation, and pooled pools as the shared option for lower costs and greater efficiency. A personal pool means one dedicated VM per assigned user."
  - "Per Learn's autoscale FAQ, autoscale for personal desktops deallocates a host only if the user has signed out, cannot force a sign-out, and does not set drain mode first, so a user who connects during deallocation sees 'No resources available'. The scaling plan's disconnect timer can also act on disconnected sessions, and the pages do not reconcile the two, so test with your timer settings."
  - "Hibernation is available only for personal host pools. FSLogix and App Attach do not support it, and the OS disk must be large enough to hold the VM's memory contents."
  - "Session host configuration supports only pooled host pools, so personal pools use standard management: you create, update and scale the session hosts yourself."
faq:
  - q: "Does a personal host pool need FSLogix?"
    a: "Not by default. Microsoft Learn says that in a personal host pool each user only ever uses one session host, so profile data can stay on the VM's OS disk. If you do use FSLogix with a personal pool, Learn says not to enable hibernation, because FSLogix does not support it."
  - q: "How many users can be on one session host in a personal host pool?"
    a: "One. The maximum session limit of a personal host pool is one, and users always have their sessions on the session host they are assigned to. One user can, however, be assigned several personal desktops (several hosts), but only with direct assignment; each host still has one user."
  - q: "Can autoscale sign users out of a personal desktop?"
    a: "No. Microsoft Learn's autoscale FAQ says autoscale does not force users to sign out of personal desktops, and that it only deallocates session hosts if the user has signed out. Another FAQ answer says \"signed out or disconnected\", and a scaling plan can act on disconnected sessions through a disconnect timer, so test with your settings. A session host that was turned on and never used is deallocated after a period of inactivity that the page does not define."
---

A personal host pool in Azure Virtual Desktop assigns each session host virtual machine to one user. That user always lands on the same VM, and the desktop can keep its files and settings on the VM's OS disk. The model fits users who need dedicated resources or data separation and where the cost of one VM per user is acceptable. This article sets out the criteria, the sizing starting points and the cost controls that apply to personal pools.

Prices are outside the scope of this article. For the side-by-side comparison with pooled pools, including load balancing and autoscale differences, see the sibling article "Pooled or personal host pools: a decision guide". For assignment procedures, see "Assigning personal desktops: automatic vs direct assignment".

## What a personal host pool is

Microsoft Learn's [terminology article](https://learn.microsoft.com/en-us/azure/virtual-desktop/terminology) defines a [host pool](/entity/avd-host-pool/) as a collection of Azure virtual machines registered as [session hosts](/entity/avd-session-host/). In a [personal host pool](/entity/avd-personal-host-pool/), each session host is assigned to an individual user. Learn describes the result as dedicated desktops that optimize environments for performance and data separation.

Three consequences matter for planning:

- The maximum session limit is one, and sessions go to the host the user is assigned to (a user who is not yet assigned is load balanced to the next available host), so in our reading there is no load-balancing algorithm to choose once users are assigned.
- Because each user only ever uses one session host, the user profile can live on the VM's OS disk instead of in a profile container.
- Windows can be updated with Windows Update, Microsoft Configuration Manager or other tools.

Learn's [personal desktop assignment article](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-host-pool-personal-desktop-assignment-type) adds that these desktops suit resource-intensive workloads. The pooled-versus-personal comparison table is in the decision guide, so this article does not repeat it.

## When one desktop per user makes sense

Learn describes use cases for each pool type rather than a formal selection rule. The criteria below are our reading of those descriptions, so test them with a pilot group.

1. **The workload needs a whole machine.** Learn's workload table in the [session host sizing guidelines](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/session-host-virtual-machine-sizing-guidelines) names software engineers and content creators as heavy workloads, and graphic designers, 3D model makers and machine learning researchers as power workloads. The single-session table on that page lists only Light, Medium and Heavy and has no Power row. For other single-session scenarios, Learn says to ask the software vendors specific to your workload.
2. **The user needs persistent state on the VM.** Learn says files and settings can persist on the OS disk after sign-out. If users install tools or keep local data that you do not want to move into a profile container, a dedicated VM is the simpler model. Learn's training module on [personal and pooled desktops](https://learn.microsoft.com/en-us/training/modules/azure-virtual-desktop-architecture/4-personal-pooled-desktops) adds that users of a personal VM are typically local administrators, so they can install or uninstall apps without affecting other users, and that dedicated resources can help in some manufacturing or development use cases.
3. **Users must be separated from each other.** Learn names data separation as a purpose of the model. A user never shares the operating system instance with another user.
4. **One person needs several environments.** Learn describes multiple personal desktops per user for cases such as a developer switching between backend and frontend work, or between testing and production. This works only with direct assignment.
5. **The extra cost is acceptable.** Learn's terminology page says pooled host pools provide a shared remote experience that ensures lower costs and greater efficiency. In our reading, a personal pool trades that sharing for isolation.

This is an assessment, not a Learn statement: personal is a weaker fit when many users run light, similar workloads and keep their profile in [FSLogix](/entity/fslogix/).

## Sizing starting points

The same sizing page gives minimums for single-session VMs:

| Workload | vCPU, RAM, OS storage | Example Azure instances | Profile container storage minimum |
|---|---|---|---|
| Light | 2 vCPUs, 8 GB, 32 GB | D2s_v5, D2s_v4 | 30 GB |
| Medium | 4 vCPUs, 16 GB, 32 GB | D4s_v5, D4s_v4 | 30 GB |
| Heavy | 8 vCPUs, 32 GB, 32 GB | D8s_v5, D8s_v4 | 30 GB |

Learn calls these generic guidelines for initial performance estimates only. It also recommends at least two physical CPU cores per VM, typically four vCPUs with hyper-threading, so the 2-vCPU Light row is a floor to validate rather than a default. For other single-session scenarios it tells you to ask the software vendors of your workload. It also says running on virtual machines can incur a 15 to 20 percent capacity cost compared with bare metal, based on internal testing. The profile container column applies only if you use profile containers.

## Cost controls for personal desktops

A personal pool has one VM per user, so in our reading the main cost question is how long each VM runs. Learn's [autoscale FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq) documents these rules:

- Autoscale for personal desktops only deallocates session hosts if the user has signed out of their user session, and it cannot force users to sign out.
- Autoscale does not put the host in drain mode before it deallocates. A user who connects during deallocation receives "No resources available".
- If a session host is turned on by autoscale, [Start VM on Connect](/entity/avd-start-vm-on-connect/) or an admin and nobody signs in, autoscale deallocates it after a period of inactivity. The page does not say how long.
- If you choose not to have autoscale start personal desktops in ramp-up, you must either enable Start VM on Connect or start the desktops yourself.

The FAQ is not fully consistent on disconnected sessions: one answer says autoscale deallocates only after sign-out, another says it deallocates when the session is "signed out or disconnected". The scaling plan article, [Create and assign an autoscale scaling plan](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan), documents separate timers for personal schedules. **When disconnected for** and **When logged off for** accept 0 to 360 minutes, and the action is deallocate, hibernate or do nothing. Check in a pilot pool what happens to disconnected sessions with your timer settings before you rely on either wording.

Learn's [Start VM on Connect article](https://learn.microsoft.com/en-us/azure/virtual-desktop/start-virtual-machine-connect) says that for personal pools it only powers on an existing session host that is already assigned or can be assigned to the user. Users should expect a longer connection time, because the VM must power on first. The service needs the **Desktop Virtualization Power On Contributor** role, assigned to a managed identity of the host pool or to the Azure Virtual Desktop service principal at a scope that contains the host pool and its session hosts. The account that configures the feature needs the **Desktop Virtualization Host Pool Contributor** role, and you can only configure it on an existing host pool. The steps are in the sibling article "How to configure Start VM on Connect for personal and pooled host pools".

### Hibernation

Learn's [deployment article](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop) says hibernation is available only for personal host pools. Three constraints matter, two of which the decision guide also lists:

- FSLogix and App Attach currently do not support hibernation, and Learn says not to enable it if you use them for personal pools.
- With hibernation enabled, the OS disk must be large enough to store the contents of the memory.
- If a scaling plan is set to hibernate but the hosts do not have hibernation enabled, autoscale does nothing: no hibernate and no deallocate.

The [Azure VM hibernation article](https://learn.microsoft.com/en-us/azure/virtual-machines/hibernate-resume) states that a hibernated VM is not billed for VM usage, while storage and networking resources attached to it still are. It lists limits that affect planning: hibernation is supported only on listed VM series with up to 64 GB of RAM (general purpose) or 112 GB (GPU), you cannot resize a VM while it is hibernated, and Azure Backup, ephemeral OS disks and managed images are not supported with hibernation. Check the page for the current series list before you choose a VM size. Hibernating from inside the guest OS does not stop billing; it must be triggered through the Azure portal, CLI, PowerShell, SDKs or APIs.

## Operating personal pools

The same deployment article states that session host configuration supports only pooled host pools. A personal pool therefore uses standard management, where you manage creating, updating and scaling the session hosts. In the portal this is **Host pools**, **Create**, with **Host pool type** set to **Personal**. You can deploy up to 400 session hosts in the creation flow, depending on subscription quota.

Because each VM is a long-lived machine, you patch it in place with the tools Learn lists, or you replace it from a new image. As a suggestion rather than a Learn rule, keep the image in an [Azure Compute Gallery](/entity/azure-compute-gallery/) so that new personal desktops start from the same baseline; the sibling article on gallery versions and replication covers that. If you plan to use hibernation, the Azure VM hibernation article says an image used for creation must support it.

## A selection checklist

1. List the users who need a dedicated VM and write down why: workload, local state, separation or several environments.
2. Estimate one VM per user using the single-session table, then validate with a pilot.
3. Decide where the profile lives. If it stays on the OS disk, plan how you back up the VM. If you use FSLogix, plan for deallocation rather than hibernation.
4. Decide how VMs are started: autoscale ramp-up, Start VM on Connect, or both.
5. Choose automatic or direct assignment.
6. Define how you patch and replace personal VMs.

## Sources

Accessed 17 November 2026.

- [Microsoft Learn: Azure Virtual Desktop terminology](https://learn.microsoft.com/en-us/azure/virtual-desktop/terminology)
- [Microsoft Learn: Configure personal desktop assignment in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-host-pool-personal-desktop-assignment-type)
- [Microsoft Learn: Session host virtual machine sizing guidelines for Azure Virtual Desktop and Remote Desktop Services](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/session-host-virtual-machine-sizing-guidelines)
- [Microsoft Learn: Azure Virtual Desktop autoscale FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq)
- [Microsoft Learn: Create and assign an autoscale scaling plan for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: Start VM on Connect](https://learn.microsoft.com/en-us/azure/virtual-desktop/start-virtual-machine-connect)
- [Microsoft Learn: Deploy Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop)
- [Microsoft Learn: Azure VM hibernation overview](https://learn.microsoft.com/en-us/azure/virtual-machines/hibernate-resume)
- [Microsoft Learn Training: Personal and pooled desktops](https://learn.microsoft.com/en-us/training/modules/azure-virtual-desktop-architecture/4-personal-pooled-desktops)
