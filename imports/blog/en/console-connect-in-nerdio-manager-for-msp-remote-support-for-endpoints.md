---
title: "Console Connect in Nerdio Manager for MSP: remote support for endpoints"
summary: "Console Connect is a remote support feature in Nerdio Manager that lets a technician open a browser-based session to AVD session hosts, servers, Intune devices and desktop images. It is delivered in partnership with Zoho, and it needs two enable steps plus an agent on every device."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [nerdio-console-connect, nerdio-manager-for-msp]
keypoints:
  - "Console Connect lets technicians connect from the Nerdio Manager portal to a user session, session host, server, Intune device or desktop image. The session opens in a browser tab."
  - "It is delivered in partnership with Zoho, who provide the underlying infrastructure. Zoho branding still shows in executable names, parts of the UI and the required network rules."
  - "In Nerdio Manager for MSP it is switched on twice: at the MSP level under System > System Settings > Integrations, then per customer account. An agent must then be installed on each device, and the device must be powered on."
  - "A session can be interactive, where the user is asked to approve only if the Session confirmation option is selected for the account, or a toolbox session with PowerShell, services, Task Manager and registry tools that can run unattended."
  - "Nerdio announced it in April 2024 as a private preview. Today's help pages carry no preview label, list supported regions, and state limits such as one technician per device, no session recording and no task logging."
faq:
  - q: "Does Console Connect cost extra?"
    a: "For Nerdio Manager for Enterprise, Nerdio's FAQ says it is included with all existing SKUs for AVD, Windows 365 and physical endpoints, with no additional licensing, and names a default of 5,000 devices per region. The Enterprise release notes for version 8.2.1 (29 September 2026) say the default license cap was raised from 5,000 to 15,000, so confirm the current limit with Nerdio. The two MSP Console Connect pages (setup and FAQ) state no price or device limit, so confirm the terms for Nerdio Manager for MSP with Nerdio or your agreement."
  - q: "Can I use it on devices that Nerdio Manager does not manage?"
    a: "Nerdio's MSP FAQ says no: a device must be manageable from Nerdio Manager, and the installer can only be deployed from Nerdio Manager. The release notes for version 6.6.0 (listed as Preview, 16 December 2025) mention an agent download for Windows, macOS and Linux targets outside Azure and Intune, while the FAQ says Windows only, so check the current behaviour before planning around it."
  - q: "Which operating systems does it support?"
    a: "The MSP FAQ says Console Connect supports Windows endpoints only. The technician can connect from any modern browser, whatever the technician's own operating system is."
---

Console Connect is the remote support feature built into Nerdio Manager. A technician selects a device in the portal, and a session opens in a browser tab. It is delivered in partnership with Zoho, and in [Nerdio Manager for MSP](/entity/nerdio-manager-for-msp/) it works at both the partner level and the customer-account level. An agent has to be installed on each device before anyone can connect.

This article explains what [Console Connect](/entity/nerdio-console-connect/) is, what it can reach, how it is enabled, what a session looks like, and where its limits are. Consent prompts, the cases in which no prompt appears, and what is logged are covered in the companion article on privacy and consent; this article stays with setup and behaviour.

## What Console Connect is

Nerdio's help center describes Console Connect as a way to remotely connect to user sessions, session hosts, endpoints and desktop images to perform support functions. Nerdio's April 2024 announcement of Nerdio Manager for MSP 5.0 gave the reason: partners had asked for the ability to connect to servers, desktops and cloud PCs directly from within the product, and the feature lets technicians support users across the whole customer base by sharing their screens on virtual or physical endpoints.

The feature is delivered in partnership with Zoho, who provide the underlying infrastructure. Nerdio's Enterprise FAQ explains that Zoho Assist powers Console Connect and that Zoho branding still appears in some places, such as executable names, some UI elements and the required network rules.

## What it can connect to

The MSP help page says Nerdio Manager currently supports Console Connect on servers, host pools, desktop images and Intune devices. It does not mention Windows 365 or Azure Local. Nerdio's Enterprise help center, which documents the same feature for the Enterprise edition, lists these targets, so check in your MSP portal which of them apply:

- [Azure Virtual Desktop](/entity/azure-virtual-desktop/) [session hosts](/entity/avd-session-host/), including AVD for Azure Local and AVD Hybrid on Nutanix
- [Windows 365](/entity/windows-365/) Cloud PC sessions
- Endpoints managed through [Intune](/entity/intune/)
- Desktop images, including images that have no direct network line of sight for RDP

Only Windows endpoints are supported, according to the MSP FAQ. A device must be powered on to connect, and for Intune devices the agent is deployed through Intune, so the install is subject to Intune's check-in cycle. Nerdio's FAQ says a sync can take up to 8 hours and suggests running the install task and then rebooting the device to prompt a check-in.

## How the connection works

The Enterprise architecture page lists two components that connect support staff with the endpoint and its agent: the Nerdio Manager app, where support staff work, and a Console Connect Region, a cloud-hosted broker that handles device registration, identification and the host addresses needed during a session. According to that page:

1. Support staff ask Nerdio Manager for a connection to a device.
2. Nerdio Manager contacts the Console Connect Region to retrieve the device details.
3. The region validates the target endpoint and establishes the initial connection request.
4. Once authorized, support staff establish a session with the endpoint.

Traffic between all parties is brokered over TLS on TCP 443, and the page says this lets staff run remote sessions and transfer files without direct inbound connectivity to the endpoint. The page names three roles that work with the Nerdio Manager app: Admin, Help Desk and Console Connect Operator. That page belongs to the Enterprise knowledge base. The two MSP Console Connect pages do not describe which roles can use it, so check in your own portal which technician roles can see the Console Connect page.

## Setting it up in Nerdio Manager for MSP

Before enabling anything, the firewall and proxy rules matter, because the agent and the viewer use Zoho components:

- Exclude TCP and WebSocket traffic for the listed domains from firewall and proxy inspection. The list includes `*.console-connect.com`, `*.zoho.com`, `*.zoho.eu`, `*.zohoassist.com`, `*.zohomeeting.com` and `*.zohocdn.com`, among others.
- For IP allow lists on TCP 80 and 443, run `nslookup gateway.console-connect.com`; Nerdio says this returns the addresses for all regions.
- In antivirus, allow the ZohoMeeting directories under `%localappdata%` and `%programfiles%` (or `%programfiles(x86)%` on 64-bit) and the executables Nerdio lists, such as `agent.exe`, `ZMAgent.exe` and `ViewerUI.exe`.

Then enable it in two layers, as described on the MSP help page:

1. **MSP level.** Go to System > System Settings > Integrations, expand Console Connect, accept the terms of service, and toggle it on. The terms to accept include a Data Protection Addendum; the 6.3.0 release notes (listed as Preview, 11 August 2025) say both the terms of service and the DPA must be accepted on enablement. Here you also choose whether users may uninstall the agent or stop the service, and whether the connection dialog shows default Nerdio branding or a custom name and icon.
2. **Account level.** In each customer account, go to Settings > Integrations > Console Connect, toggle it on, and choose the Intune groups whose devices should be added automatically. The MSP-level setting must be on first. The same page has a Session confirmation option with a confirmation text field. Nerdio states that if it is not selected, the connection is established without the user being prompted.
3. **Agents.** Install the agent per device type: session hosts under Manage Hosts, servers under Azure > Servers > List Servers, Intune devices under Endpoints > Devices > All Devices, and desktop images under Cloud Desktops > AVD > Desktop Images. Session hosts and Intune devices have a Console Connect > Install CC action; for servers, Nerdio documents the bulk action Console Connect > Install CC on selected, which also works for a single server.

The release notes show the tooling around this growing: version 6.4.0 (listed as Preview, 24 September 2025) added bulk install and uninstall for Intune devices, session hosts and servers, a filter by agent status, and installing the agent on desktop and global images at power-on. The status filter on the Servers, Intune devices and session hosts pages offers Not installed, Offline, Online and Other.

## Starting a session

A technician starts a session from the Console Connect page at the MSP level, or from the device's own menu at the account level (Endpoints > Console Connect > All Devices). Two session types exist:

- **Interactive session.** The technician shares the user's screen. The user is asked to approve only if Session confirmation is selected for the account; otherwise the connection is established without a prompt. In the Enterprise documentation, the console opens in a browser tab, a Diagnostics option gives access to a command prompt or PowerShell, and the technician ends the session with the exit icon and confirms with End now.
- **Toolbox session.** Nerdio describes it as access to PowerShell, Windows services, Task Manager, registry editors and other tools, either interactive or unattended, so it need not affect the end user. The technician selects Toolbox instead of the interactive option.

Behaviour worth knowing before the first ticket: only one technician can be connected to a device or a user's AVD session at a time. If a second technician connects, the first sees a message and can no longer see what is happening, and, according to the FAQ, the end user will not see any change on their end besides the connected user. Nerdio suggests Microsoft Teams screen sharing when several people need to watch. Sessions have no time limit while the device has internet access, and a session reconnects after a reboot if the technician keeps the browser tab open and the user signs back in.

## Status, regions and what is not there

Nerdio announced Console Connect on 2 April 2024 as "private preview" in Nerdio Manager for MSP 5.0. The current MSP and Enterprise help pages carry no preview or general availability label for the feature itself. The MSP release notes label whole releases, and those labels apply to the release, not to a single feature; version 7.4.2 is listed as GA (13 November 2026). The notes for version 7.4.0 (21 October 2026) list, under resolved escalations, a fix that lets the Console Connect Devices page load for accounts with large device counts without rate-limit errors, and a device sync request when an agent install on Intune devices stays in progress or fails. Versions 7.4.1 and 7.4.2 contain those items. Treat the feature as documented and still changing.

On regions, the two help centers differ. The MSP page says the feature is currently available for the United States, Canada, the EU and Australia, and that it is not available for Nerdio Manager for MSP: Gov Edition. The Enterprise page lists the United States, the United Kingdom, the EU, Canada, Japan and Australia. Confirm your own region in the portal.

Nerdio's FAQ lists these limits:

- No session recording.
- Tasks performed during a session are not logged.
- Nerdio scripted actions cannot be run from inside a Console Connect session, but PowerShell script files can, and scripted actions can still be run from Nerdio Manager.
- Windows endpoints only, and only devices that Nerdio Manager can manage.
- The agent installer is available only through Nerdio Manager because of licensing restrictions.

## Alternatives

Console Connect is not the only way to support users. Microsoft's [Remote Help](/entity/intune-remote-help/) for Intune is a cloud-based service in which helpers and sharers sign in with Microsoft Entra accounts of the same organization, and it is not enabled by default for a tenant. Microsoft's page lists Windows, macOS and Android, and uses Intune role-based access control for helpers. Its overview does not mention Azure Virtual Desktop or multi-session Windows. It also states that both parties must sign in with corporate Entra ID accounts, so Remote Help only works within one organization's tenant and helpers cannot assist users in another tenant or external organization. For an MSP supporting several customer tenants, that is a point to check against how Console Connect is documented. Teams screen sharing, which Nerdio itself suggests for multi-person viewing, is another route for ad-hoc cases.

## A worked example

A fictional [managed service provider](/entity/managed-service-provider/) supports four customers: two with AVD host pools and two with Intune-managed laptops. It enables Console Connect at the MSP level, leaves the uninstall and stop-service options off, and keeps default branding. It then enables the feature for the first customer, selects an Intune group of 12 pilot laptops, and selects Session confirmation with a short confirmation text. The agent reaches the laptops through the group, so the provider allows for the Intune check-in, which can take up to 8 hours, and checks the status filter until a laptop shows Online. A technician then opens Endpoints > Console Connect > All Devices and connects to that laptop, and the user sees the prompt and approves. Without the Session confirmation option, the connection would be established without a prompt. Names and counts are illustrative.

## Sources

- [Nerdio help center (MSP): Enable Console Connect (remote support)](https://nmmhelp.getnerdio.com/hc/en-us/articles/26125609444109-Enable-Console-Connect-remote-support)
- [Nerdio help center (MSP): Console Connect Troubleshooting/FAQs](https://nmmhelp.getnerdio.com/hc/en-us/articles/31946604792077-Console-Connect-Troubleshooting-FAQs)
- [Nerdio help center (MSP): NMM Release Notes](https://nmmhelp.getnerdio.com/hc/en-us/articles/360055385832-NMM-Release-Notes)
- [Nerdio help center (Enterprise): Enable Console Connect (remote support)](https://nmehelp.getnerdio.com/hc/en-us/articles/36031072264205-Enable-Console-Connect-remote-support)
- [Nerdio help center (Enterprise): Console Connect architecture and region setup](https://nmehelp.getnerdio.com/hc/en-us/articles/40742906883597-Console-Connect-architecture-and-region-setup)
- [Nerdio help center (Enterprise): Console Connect FAQs](https://nmehelp.getnerdio.com/hc/en-us/articles/36477008572557-Console-Connect-FAQs)
- [Nerdio help center (Enterprise): Release Notes](https://nmehelp.getnerdio.com/hc/en-us/articles/19837802929677-Release-Notes)
- [Nerdio blog: Unveiling Nerdio Manager for Enterprise 6.0 and Nerdio Manager for MSP 5.0](https://getnerdio.com/blog/unveiling-nerdio-manager-for-enterprise-6-and-nerdio-manager-for-msp-5/)
- [Microsoft Learn: Use Remote Help to assist users authenticated by your organization](https://learn.microsoft.com/en-us/intune/remote-help/)
