---
title: "Privacy and consent in remote support: how Console Connect handles it"
summary: "In Console Connect, whether a user is asked before a technician connects depends on the Session confirmation option at the customer-account level, and several situations bypass the prompt. This guide sets out the settings, the cases without a prompt, and what Nerdio says is not recorded or logged."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [nerdio-console-connect, nerdio-manager-for-msp]
keypoints:
  - "Nerdio's MSP help page says that without the Session confirmation option, a Console Connect connection is established without prompting the user. Our recommendation, not Nerdio's: turn it on and write the confirmation text for every customer account."
  - "Nerdio's MSP FAQ lists cases where no prompt appears: connecting before the user has signed in or unlocked the device, and rejoining a session a previous technician left open by closing the tab. For those two, exiting and reconnecting triggers the prompt. Unattended access is a separate case, and the pages do not say whether toolbox sessions show the prompt."
  - "MSP-level settings control whether users may uninstall the agent or stop the service, and whether the connection dialog shows Nerdio branding or a custom name and icon."
  - "Nerdio's FAQs say that currently session recording is not available and tasks performed during a session are not logged. The Enterprise release notes also list a Session Logs page for Console Connect without saying what it records, so check your portal. Our suggestion, not a Nerdio feature: keep your own ticket notes."
  - "Traffic goes through a cloud-hosted broker on TLS port 443, and Zoho provides the underlying infrastructure. This article reports what Nerdio's pages say and makes no legal assessment."
faq:
  - q: "Does the user always get a prompt before a technician connects?"
    a: "No. The MSP help page says that if Session confirmation is not selected, the connection is established without prompting the user. Nerdio's FAQ adds that no prompt appears if the technician connects before the user has signed in or unlocked the device, or if a previous technician closed the browser tab without exiting. Exiting and reconnecting prompts the user in those two cases."
  - q: "Are Console Connect sessions recorded or logged?"
    a: "Nerdio's FAQs say that currently session recording is not available and tasks performed during a session are not logged. Two release notes sit beside that: Enterprise version 8.0 (Public Preview, 2 June 2026) lists a new Session Logs details page for Console Connect, and MSP version 7.2.0 says Console Connect tasks now include individual endpoint names. Neither says that it covers what a technician did inside a session, so check what your portal shows."
  - q: "Can end users remove the agent or stop the service?"
    a: "The MSP-level Console Connect settings include an option to let users uninstall the agent and a separate option to let users stop the service. Nerdio's page describes both as options you enable and does not state the default. The same page documents how an administrator removes the agent: Remove in the MSP-level Console Connect menu, or Console Connect > Uninstall CC in a device's action menu."
---

Whether a user is asked before a technician connects is a setting, not a given. In Nerdio Manager for MSP, the Session confirmation option at the customer-account level decides it, and Nerdio's help pages list several situations in which the prompt does not appear. This guide covers how [Console Connect](/entity/nerdio-console-connect/) handles consent, what you can configure, and what is recorded.

It reports what Nerdio's help pages state and makes no legal assessment of data protection law, works council agreements or customer contracts; take those to your own counsel.

## What the pages say about consent

Nerdio's April 2024 announcement of Nerdio Manager for MSP 5.0 said that by default users have to authorize a console connection, and that Console Connect can administer a VM with admin rights with or without a connected user session. The current MSP help page is more specific: at the account level, a Session confirmation option configures a prompt displayed on the desktop when a remote session starts, with a field for the confirmation text. If the option is not selected, the connection is established without the user being prompted.

Because those two statements read differently, do not assume a default. Check the setting on each customer account.

The help page describes the connection step as: connect, then the end user approves, then you troubleshoot. That approval step only applies when Session confirmation is on. For Windows 365 Cloud PCs, Nerdio's Enterprise documentation says the session starts once the user has accepted the connection.

## Configure consent and visibility: steps

These steps follow Nerdio's MSP help page. Menu names can change between versions, so compare them with your portal.

1. **Accept the terms and enable at MSP level.** Go to System > System Settings > Integrations, expand Console Connect, select I acknowledge and agree, confirm with OK, then toggle the feature on. The 6.3.0 release notes (listed as Preview, 11 August 2025) say the terms of service and the Data Protection Addendum (DPA) must be accepted on enablement, and that existing installs are asked to acknowledge them. The account-level setting only becomes available after this.
2. **Decide on user control of the agent.** Two MSP-level options exist: Allow users to uninstall the agent, and Allow users to stop the service. Keep them disabled if you want the agent to stay in place on managed devices, and enable them where a customer wants users to be able to remove it. Nerdio describes what each option does, does not name a default and does not recommend a setting.
3. **Choose branding.** Console Connect uses default Nerdio branding, or Custom, where you enter a name that appears in the connection dialog on the remote desktop and upload an icon. Nerdio notes that branding applies only to the incoming connection screen; everything else stays Zoho-branded and is not configurable. In our view, a recognisable name helps users see who is asking to connect.
4. **Turn on Session confirmation per customer account.** In the account, go to Settings > Integrations > Console Connect, toggle it on, select Session confirmation, and enter the confirmation text. An illustrative wording, not Nerdio's: "Fabrikam IT support would like to connect to your session to work on your ticket. Accept only if you requested help."
5. **Deploy agents.** Install the agent on the devices that should be reachable, and filter by agent status (Not installed, Offline, Online, Other) to see where coverage is missing.
6. **Test on a pilot device.** Connect to a device with a signed-in user and confirm that the prompt appears with your text. Then connect to a locked device, an unattended one and a toolbox session.
7. **End sessions with the exit icon.** Closing the browser tab without exiting can leave the session open for the next technician, as the next section shows.

## When no prompt appears

Nerdio's MSP FAQ answers the question about a missing authorization prompt with two reasons:

- **Connecting before the user has signed in or unlocked the device.** Nerdio lists this as a case where no authorization prompt was shown.
- **A previous technician closed the Console Connect browser tab without exiting.** Nerdio lists this as the second case.

For both reasons the FAQ says that exiting the session and reconnecting makes the user get the authorization prompt. The Enterprise FAQ points to the Session confirmation option for the same question.

Unattended access has its own FAQ entry. Nerdio says that as long as no one is actively logged in, you can access the device without approval, and that anyone who walks by the device sees the Console Connect connection dialog in the bottom right corner of the screen.

Toolbox sessions are a separate point. The MSP setup page says a toolbox session can be interactive or unattended and therefore not affect the end user. It does not say whether Session confirmation applies to toolbox sessions, so treat that as untested and check it on a pilot device.

For internal procedure, this suggests a rule that is the author's reading, not Nerdio's: have technicians exit sessions rather than close tabs, and treat any connection to a signed-in user without a prompt as a reason to check the account's Session confirmation setting.

## What is recorded or logged

The MSP and Enterprise FAQs are direct on two points, and for both they say "currently":

- Session recording is currently not available.
- Tasks performed during a session are currently not logged.

Two release notes sit next to those statements. The Nerdio Manager for Enterprise release notes for version 8.0 (Public Preview, 2 June 2026) list a Session Logs item: a new session details page for Console Connect that gives improved visibility into session activity. They do not say what the page records, and the Enterprise FAQ, last updated on 6 November 2026, still says tasks are not logged. The MSP release notes list no comparable entry. The MSP release notes for version 7.2.0 (Public Preview, 28 July 2026) say Console Connect tasks now include individual endpoint names for troubleshooting, which again does not say what a technician did inside a session.

Nerdio's pages therefore do not establish a technician audit trail, and in our reading the Session Logs page is worth inspecting in your portal before you rely on it. For a record of who connected to which device and what was done, keep your own ticket notes: technician, device, start and end time, and a summary of changes. This is a practical suggestion, not a Nerdio feature.

Sessions have no time limit while the device has internet access, and they reconnect after a reboot if the technician keeps the tab open and the user signs back in. The MSP FAQ also says that only a single technician can be connected to a device or a user's AVD session. Define internally when a session must be closed.

## Where the data goes

Console Connect is delivered in partnership with Zoho, who provide the underlying infrastructure. The Enterprise architecture page describes a Console Connect Region as a cloud-hosted broker that manages communication between the support session and endpoints, handles device registration and identification and the IP addresses of hosts, and ensures traffic is encrypted. The same page also says traffic is routed locally. Device registration, metadata exchange, remote sessions and file transfer use TLS on TCP 443. According to that page, this works without direct inbound connectivity to the endpoint.

The region is a choice, and the regions differ by edition. The MSP help page says the feature is currently for the United States, Canada, EU and Australia, and not available for Nerdio Manager for MSP: Gov Edition. The Enterprise help page lists the United States, United Kingdom, EU, Canada, Japan and Australia. The Enterprise release notes add the UK region in version 8.0.1 (GA, 16 June 2026) and Japan in version 8.1.0 (Public Preview, 21 July 2026), the latter described as support for the Japan region for data residency. The [Console Connect article for MSP](/community/u/mirko-p/blog/console-connect-in-nerdio-manager-for-msp-remote-support-for-endpoints/) covers the setup.

Nerdio's [Console Connect Terms of Service](https://getnerdio.com/console-connect-terms-of-service/) (effective 24 July 2025) say that Console Connect integrates with a third-party remote support service and that you can select the data center region where your information is processed. They state that the data residency, security and compliance implications of that choice are solely the customer's responsibility, that Nerdio does not control the security, availability or compliance of the third-party service, and that Zoho Corporation is the provider. Our reading: the region is worth agreeing with each customer.

Nerdio's Console Connect help pages and terms page do not say how long session data is kept. Read the terms and the DPA first; anything they leave open, such as retention periods, is a question for Nerdio and Zoho in writing.

The agent also shows up on the device. Nerdio's firewall guidance lists the Zoho directories and executables that antivirus must allow, and the MSP setup page says that apart from the incoming connection screen, icons, navigation and UI elements stay Zoho-branded. Customer IT teams reviewing allow lists will see Zoho names.

## Limits and alternatives

- **Platforms.** Nerdio's FAQ says Windows endpoints only, while the 6.6.0 release notes (listed as Preview, 16 December 2025) mention macOS and Linux agent downloads; the [Console Connect article for MSP](/community/u/mirko-p/blog/console-connect-in-nerdio-manager-for-msp-remote-support-for-endpoints/) has more on platforms. Check current behaviour before telling a customer which devices are covered.
- **Roles.** The Enterprise pages name Admin, Help Desk and Console Connect Operator roles. The two MSP Console Connect pages do not describe how roles map to Console Connect, so confirm in your portal who can open the Console Connect page.
- **Microsoft Remote Help.** Microsoft's [Remote Help](/entity/intune-remote-help/) for [Intune](/entity/intune/) is a different tool with its own controls. Its Learn page says Conditional Access policies and the chat function apply to sessions that an end user accepts, and not to unattended access. On Windows, unattended remote sign-in applies only to physical, corporate-owned, Intune-managed devices; Android unattended control requires an Android Enterprise dedicated device. Helper permissions follow Intune role-based access control. Reports show who helped whom, on which device and for how long, and sessions appear in the Intune audit logs under Tenant Administration > Audit Logs, although auditing is limited for unenrolled devices. If audit reporting is a requirement, compare it with the limits above.

## Pre-rollout checklist

- Session confirmation is on, with text, for every account where Console Connect is enabled.
- The uninstall and stop-service options match what each customer agreed.
- Technicians know: exit, do not close the tab; one technician per device; no recording and no task log in the FAQs, as things stand; toolbox sessions tested.
- Ticket notes capture who connected, when, and what changed.
- The Enterprise Session Logs page has been checked in your portal, if you use Enterprise.
- The processing region is agreed with each customer, and open questions about retention are written down and sent to Nerdio.

## Sources

- [Nerdio help center (MSP): Enable Console Connect (remote support)](https://nmmhelp.getnerdio.com/hc/en-us/articles/26125609444109-Enable-Console-Connect-remote-support)
- [Nerdio help center (MSP): Console Connect Troubleshooting/FAQs](https://nmmhelp.getnerdio.com/hc/en-us/articles/31946604792077-Console-Connect-Troubleshooting-FAQs)
- [Nerdio help center (MSP): NMM Release Notes](https://nmmhelp.getnerdio.com/hc/en-us/articles/360055385832-NMM-Release-Notes)
- [Nerdio help center (Enterprise): Enable Console Connect (remote support)](https://nmehelp.getnerdio.com/hc/en-us/articles/36031072264205-Enable-Console-Connect-remote-support)
- [Nerdio help center (Enterprise): Console Connect architecture and region setup](https://nmehelp.getnerdio.com/hc/en-us/articles/40742906883597-Console-Connect-architecture-and-region-setup)
- [Nerdio help center (Enterprise): Console Connect FAQs](https://nmehelp.getnerdio.com/hc/en-us/articles/36477008572557-Console-Connect-FAQs)
- [Nerdio help center (Enterprise): Release Notes](https://nmehelp.getnerdio.com/hc/en-us/articles/19837802929677-Release-Notes)
- [Nerdio: Console Connect Terms of Service](https://getnerdio.com/console-connect-terms-of-service/)
- [Nerdio help center (Enterprise): Role-based access control (RBAC): Custom roles](https://nmehelp.getnerdio.com/hc/en-us/articles/26124328221709-Role-based-access-control-RBAC-Custom-roles)
- [Nerdio blog: Unveiling Nerdio Manager for Enterprise 6.0 and Nerdio Manager for MSP 5.0](https://getnerdio.com/blog/unveiling-nerdio-manager-for-enterprise-6-and-nerdio-manager-for-msp-5/)
- [Microsoft Learn: Use Remote Help to assist users authenticated by your organization](https://learn.microsoft.com/en-us/intune/remote-help/)
