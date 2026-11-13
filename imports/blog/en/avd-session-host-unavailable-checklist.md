---
title: "Azure Virtual Desktop Session Host Shows Unavailable: A Step-by-Step Checklist"
summary: "A session host that is running but marked Unavailable in the host pool cannot take users. Read the failed health check first, then check domain join, services, URLs, autoscale and the agent registration."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [azure-virtual-desktop, avd-host-pool, azure-autoscale, azure-monitor]
keypoints:
  - "A VM in the Running state tells you nothing about the AVD agent. The host status comes from the agent's health checks."
  - "A failed domain join or a broken side-by-side stack listener is a fatal check. A blocked monitoring or metadata endpoint is not."
  - "After an autoscale plan starts and stops hosts, check roles at subscription level, drain mode and the agent services before you reinstall anything."
  - "Reinstall the agent and boot loader with a new registration key only after the cheaper checks have failed."
faq:
  - q: "What does the Unavailable status mean for an AVD session host?"
    a: "Microsoft Learn says the host is either turned off or has failed a fatal health check, so user sessions cannot connect. Fatal checks include the domain joined check, the domain trust check and the side-by-side stack listener check. The status can also appear after a normal shutdown, because the agent stops reporting."
  - q: "How is Unavailable different from Needs Assistance?"
    a: "Needs Assistance means a non-fatal check failed, such as the monitoring agent, the Azure metadata service or required URLs. Users can still connect, although the experience may suffer. Unavailable means users cannot connect."
  - q: "How long can a registration key be valid?"
    a: "On the agent troubleshooting page, Microsoft Learn says the key must be valid for at least one hour and at most 27 days from the time you generate it. Generate a new one in the host pool overview, under Registration key."
  - q: "Where must the autoscale roles be assigned?"
    a: "Microsoft Learn says to assign them at subscription level. The service principal or host pool identity needs the Desktop Virtualization Power On Off Contributor role for power management autoscale. Assigning the role on a resource group, host pool or VM can stop autoscale from working properly."
---

You open the host pool in the Azure portal. The VMs are running. The session hosts show **Unavailable**. Users cannot connect, or they connect to the one host that is still healthy.

Microsoft Q&A has several 2025 and 2026 threads on this. One asker with a new environment fixed it by joining the VM to the domain by hand. Another saw hosts go Unavailable one after another after turning on a scaling plan, and the thread did not end with a confirmed fix. This article follows the order that Microsoft Learn suggests and adds the points from the threads. It is not an official Microsoft procedure. Check each step against the current Learn pages, especially the agent troubleshooting article, whose visible date is older than most of the others.

## What you see

- Host pool, then **Session hosts**: status **Unavailable**, sometimes **Needs Assistance** or **Upgrading**.
- The VM itself is in the Running state.
- After a restart, the VM runs again but the host stays Unavailable.
- In the scaling plan case, hosts turn Unavailable gradually, not all at once.

## Step 1: Read the failing health check

In the portal, open the host pool, select **Session hosts**, and look at the details for one affected host. Learn describes the statuses like this:

- **Available**: all checks passed.
- **Needs Assistance**: a non-fatal check failed. These are the monitoring agent, the Azure Instance Metadata Service and the URL check. Users can still connect.
- **Unavailable**: the host is off, or it failed a fatal check.
- **Upgrading** or **Upgrade Failed**: the agent update is in progress or has failed.

The fatal checks on the Learn page are the domain joined check, the domain trust check and the side-by-side stack listener check. The first one is where the 2025 thread ended.

## Step 2: Check the domain join

The thread with a confirmed fix started with a user who could not connect to a brand-new environment. A volunteer moderator suggested the standard deployment guide and AVD Insights. An advisor listed generic causes (registration, network, permissions). The asker later wrote that the VM had not joined the domain on its own, and joining it by hand and restarting solved the problem.

Check this on the VM:

1. Sign in to the VM with a local administrator account and check whether the machine is a member of your domain.
2. From a command line on the VM, ping the domain name to check that it resolves. Learn gives this as its basic test.

Microsoft Learn lists typical reasons for a failed join in the session host configuration article: wrong credentials in the deployment template, MFA on the join account, missing permissions, and DNS problems. For DNS, the virtual network of the VMs must reach the domain's network (for example by peering), the network's DNS must point to the domain controllers, and the NIC must inherit or use the same DNS servers.

Also check the point about reusing a computer account name. Learn says the account may be blocked after the October 2022 join hardening changes if the joining account lacks rights.

## Step 3: Check the agent services

Connect to the VM. If RDP does not work, the Azure portal's Run Command is an option, as one answer suggested.

1. Open `services.msc` and check that **Remote Desktop Agent Loader** (the boot loader, service name `RDAgentBootLoader`) is running. Start it if it is stopped. One answer in the scaling plan thread also named an `RDAgent` service to check, which Learn does not mention on the pages I read.
2. Open Event Viewer, then **Windows Logs**, then **Application**. Learn names the sources WVD-Agent, WVD-Agent-Updater, RDAgentBootLoader and MsiInstaller. Most errors are event ID 3277 with a keyword in the message.
3. If the loader stops again after you start it, suspect a registration problem (step 6).

If the VM starts slowly, the Learn page also describes a boot timeout case: set the loader's startup type to **Automatic (Delayed Start)**, and if needed raise the `ServicesPipeTimeout` value, starting at 60000 milliseconds. Check antivirus scans and logon scripts at boot too.

## Step 4: Check connectivity to the service

Session hosts only need outbound access. Learn's required endpoint list includes `*.wvd.microsoft.com` on TCP 443, `login.microsoftonline.com`, the monitoring endpoints `gcs.prod.monitoring.core.windows.net` and `*.prod.warm.ingest.monitor.core.windows.net`, and the Azure fabric addresses `169.254.169.254` (metadata) and `168.63.129.16` (WireServer). Learn says traffic to those two addresses must not be intercepted, proxied or redirected. It recommends service tags where your firewall supports them, because there is no fixed IP list.

Test in this order:

1. Run the Azure Virtual Desktop Agent URL Tool on the session host. It checks each required endpoint.
2. For an `INVALID_FORM` event, Learn tells you to read the `BrokerResourceIdURI` and `BrokerResourceIdURIGlobal` values under `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\RDInfraAgent`, add `/api/health` to each address and open it in a browser. A healthy result says the broker is healthy.
3. Look for TLS inspection, a proxy or custom DNS in the path.

A scaling plan thread suggested testing a different health address on `rdweb.wvd.microsoft.com`. I could not find that address on the Learn pages, so I do not recommend it. Use the broker values from the registry.

That thread also claimed that missing monitoring endpoints cause heartbeat failures. Learn lists the monitoring agent as a non-fatal check that produces Needs Assistance, not Unavailable. Open those endpoints anyway, but do not stop looking if the host stays Unavailable.

## Step 5: If it started after you enabled a scaling plan

The thread on scaling plans was posted in June 2026. Hosts moved to Unavailable one by one after the plan was enabled. Opening the firewall names and restarting the VMs did not fix most of them. Two answers listed checks, and no answer was accepted.

Microsoft Learn explains how autoscale behaves, and it helps to compare:

1. **Roles at subscription level.** The service principal or host pool managed identity needs **Desktop Virtualization Power On Off Contributor**, assigned at subscription level. Learn warns that a lower scope can keep autoscale from working properly.
2. **Drain mode.** In ramp-down, autoscale puts the host with the fewest sessions into drain mode, signs users out after the wait time and deallocates the VM. A host that stays in drain mode does not take new sessions, so also check the **Allow new sessions** setting on each host.
3. **Exclusion tag.** Hosts with the exclusion tag are left alone by autoscale. Use it on a test host to see whether the plan is the cause.
4. **Minimum percentage of hosts.** Autoscale respects it, and it shuts a host down only if the remaining hosts can take the sessions. I found no Learn text about a host that is started by autoscale but then fails to report to the service, so after a power-on, repeat steps 2 to 4 on that host.
5. **No mixed scaling.** Learn says you cannot use autoscale and the older Azure Automation or Logic Apps scaling on the same host pool.

For diagnosis, Learn points to the autoscale diagnostics and FAQ pages.

## Step 6: Re-register or reinstall the agent

Do this when the checks above do not show a cause, or when the log shows `INVALID_REGISTRATION_TOKEN`, `EXPIRED_MACHINE_TOKEN` or `NAME_ALREADY_REGISTERED`. Learn's full procedure is:

1. Uninstall these from **Programs and Features**, then restart: Remote Desktop Agent Boot Loader, Remote Desktop Services Infrastructure Agent, Remote Desktop Services Infrastructure Geneva Agent and Remote Desktop Services SxS Network Stack. If you connect by RDP, choose not to close applications when removing the SxS stack.
2. Remove the session host from the host pool: **Azure Virtual Desktop**, **Host pools**, your pool, **Session Hosts**, select the host, **Remove**.
3. Generate a new registration key in the host pool under **Overview**, then **Registration key**. It must be valid for at least one hour and at most 27 days.
4. Install the current agent and boot loader. Paste the key into the agent installer, then run the boot loader installer and restart.
5. Wait for the host to show **Available**.

A thread answer suggested a lighter variant. Learn shows registry values under `HKLM:\SOFTWARE\Microsoft\RDInfraAgent`: set `IsRegistered` to 0, put the new key in `RegistrationToken`, restart the boot loader, and then check that `IsRegistered` is 1 and the token field is empty. Use it only for the token errors named above.

Golden images should not contain the agent. Learn says to install it after you deploy the image.

## Verification

- The host shows **Available** within a few minutes. Learn mentions 5 to 10 minutes after fixing a duplicate name.
- In the portal, the details show no failed check.
- A test user can connect and the session lands on that host.
- Event Viewer shows no new 3277 events.

## Limits

- Only one of the threads has a confirmed cause, a missing domain join.
- The scaling plan thread ended without a fix, so steps in step 5 are a comparison with Learn, not a proven cure.
- If the host is still Unavailable after a clean reinstall, collect the failed check name, event IDs with UTC times and the host pool name, and open a support case.

## Related

- [Azure Virtual Desktop](https://www.m365.fm/entity/azure-virtual-desktop/)
- [AVD host pool](https://www.m365.fm/entity/avd-host-pool/)
- [Azure autoscale](https://www.m365.fm/entity/azure-autoscale/)
- [Azure Monitor](https://www.m365.fm/entity/azure-monitor/)

## Sources

- [Microsoft Learn: Troubleshoot Azure Virtual Desktop agent issues](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-desktop/troubleshoot-agent)
- [Microsoft Learn: Troubleshoot Azure Virtual Desktop session host configuration](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-desktop/troubleshoot-vm-configuration)
- [Microsoft Learn: Session host statuses and health checks](https://learn.microsoft.com/en-us/azure/virtual-desktop/troubleshoot-statuses-checks)
- [Microsoft Learn: Required FQDNs and endpoints](https://learn.microsoft.com/en-us/azure/virtual-desktop/required-fqdn-endpoint)
- [Microsoft Learn: Create and assign an autoscale scaling plan](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scaling-plan)
- [Microsoft Q&A: Azure Virtual Desktop session host is unavailable (September 2025)](https://learn.microsoft.com/en-us/answers/questions/5543975/azure-virtual-desktop-session-host-is-unavailable)
- [Microsoft Q&A: AVD session hosts becoming unavailable after enabling scaling plan (June 2026)](https://learn.microsoft.com/en-us/answers/questions/5923775/avd-session-hosts-becoming-unavailable-after-enabl)
