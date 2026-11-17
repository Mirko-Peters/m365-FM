---
title: "An Azure Virtual Desktop security checklist"
summary: "A seven-part checklist for Azure Virtual Desktop: trust boundary, identity, network, session host hardening, data leaving the session, platform protection, and patching and monitoring. It follows Microsoft's security recommendations and adds requirements, limits and status for screen capture protection, watermarking and Private Link."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [azure-virtual-desktop, avd-screen-capture-protection]
keypoints:
  - "Microsoft runs the control plane, physical hosts and network. Identity, user devices, apps, the session host OS, deployment configuration and network controls stay with you."
  - "Pick the isolation by trust level: multi-session for standard users of one organization, a personal host pool for users who need admin rights, a separate tenant and subscription for different organizations."
  - "Drive, clipboard, printer and USB redirection are disabled by default in remote sessions. Enable each one only after you have checked the alternatives Learn lists."
  - "Screen capture protection blocks screenshots and screen sharing on the client. It is not DRM and does not stop a photo of the screen; watermarking is the added deterrent."
  - "Administrator protection is not supported on Windows 11 session hosts. Learn says that baselines from the Microsoft Security Compliance Toolkit, applied through Group Policy, turn it on from the October 2026 Windows security update."
faq:
  - q: "Does Microsoft secure the session hosts for me?"
    a: "No. Microsoft Learn's shared responsibility table gives Microsoft the virtualization control plane, the physical hosts, the physical network and the datacenter. Identity, user devices, app security, the session host operating system, deployment configuration and network controls are listed as the responsibility of the customer or partner."
  - q: "Is screen capture protection the same as data loss prevention?"
    a: "No. Learn says screen capture protection is not digital rights management and should be one part of a defense-in-depth strategy. It does not stop someone from photographing the screen with a physical camera. Learn suggests watermarking to discourage that, and says clipboard, drive and printer redirection should also be disabled."
  - q: "Can I enable every hardening feature on every session host?"
    a: "Not without checks. Learn says not to use BitLocker on the disk that stores FSLogix profile data, to target application control policies at the device level, and not to enable administrator protection on Windows 11 session hosts. Pilot each control on one host first."
---

Secure Azure Virtual Desktop by working through seven areas: the trust boundary, identity and access, network, session host hardening, what leaves the session, platform and boot protection, and patching and monitoring. This checklist follows Microsoft Learn's security recommendations page and the dedicated pages for screen capture protection, watermarking and Private Link.

## What you are responsible for

Microsoft manages the virtualization control plane, physical hosts, physical network and datacenter. You or your partner manage identity, user devices, app security, the session host operating system, the deployment configuration and the network controls.

## 1. Choose the trust boundary

| Users | Learn's recommended solution |
|---|---|
| One organization, standard privileges | Windows Enterprise multi-session OS |
| Need administrative privileges | A personal host pool, one session host per user |
| Different organizations | A separate Azure tenant and Azure subscription |

Learn says not to grant local administrator rights in multi-session pooled scenarios, because those users can cross session or NTFS boundaries, shut down the VM or cause data loss. See [pooled and personal host pools](/entity/avd-pooled-host-pool/) for the functional differences.

## 2. Identity and access

- Require multifactor authentication for all users and administrators with [Microsoft Entra multifactor authentication](/entity/mfa/).
- Use [Conditional Access](/entity/conditional-access/) to evaluate who signs in, how and from which device; the sibling article "Conditional Access for Azure Virtual Desktop: policies that work" covers the policies.
- Require Token Protection on the endpoint that runs the Windows App; Learn states it does not apply to the session host.
- Limit Azure permissions with [Azure RBAC](/entity/azure-rbac/). Learn's RBAC page describes Desktop Virtualization Session Host Operator as viewing and removing session hosts and changing drain mode, and Desktop Virtualization User Session Operator as sending messages, disconnecting sessions and signing users out. Both are narrower than Desktop Virtualization Host Pool Contributor, which allows managing all aspects of a host pool.
- Collect audit logs from Azure Activity Log, Microsoft Entra, the session hosts and Key Vault.

## 3. Network

- Control network access with segmentation and filtering. Session hosts can reach any internet resource by default; to limit this, use [Azure Firewall](/entity/azure-firewall/), network virtual appliances or proxies, with the rules Azure Virtual Desktop requires.
- Avoid direct RDP access to hosts; if needed, use just-in-time access from Defender for Cloud.
- If users must not reach the service over the public internet, [Azure Private Link](/entity/azure-private-link/) provides private endpoints: `connection` (one per host pool), `feed` (one per workspace) and `global` (one for the whole deployment). Private Link for Azure Virtual Desktop has been generally available since 14 July 2023, and UDP over Private Link since February 2026, according to Microsoft's announcements. Key limits from the Private Link page: enable Private Link on each Azure subscription you want to use it with, allow the entire TCP range 1-65535 to the `connection` private endpoint, and opt in to UDP on the host pool's **Networking** page with the public Shortpath options (STUN and TURN) turned off. The Private Link article in this series has the details.
- For FSLogix profiles, Learn says to follow the security recommendations of your SMB share provider. Its example is private endpoints for Azure Files, which make the share reachable only within an Azure virtual network.

## 4. Session host hardening

- Enable endpoint protection on every session host: Learn names Windows Defender Antivirus (see [Microsoft Defender Antivirus](/entity/microsoft-defender-antivirus/)) or a third-party program. Exclude FSLogix or other VHD-mounting file extensions.
- Deploy endpoint detection and response. On server operating systems with Defender for Cloud enabled, this deploys [Microsoft Defender for Endpoint](/entity/microsoft-defender-for-endpoint/); client operating systems can use it or a third-party product.
- Do not give users admin access; distribute software through [Intune](/entity/intune/) or similar tools.
- Restrict what can run. Learn says RemoteApp is not a security feature and points to [App Control for Business](/entity/app-control-for-business/) and AppLocker. In its section headlined "Windows Defender Application Control", it advises targeting policies at the device, because a user-targeted policy affects all users on the device equally.
- Learn also suggests Global Secure Access on session hosts (external identities support is preview), the Security Policy Advisor for Microsoft 365 Apps, and restricting who can access user profiles.
- Hide drive mappings, apply least-privilege file system permissions, and encrypt session hosts with managed disk encryption.
- Configure idle disconnect and screen lock. Learn gives no numeric value and advises caution with long-running apps such as CAD rendering, because a disconnect can interrupt their work.

## 5. Control what leaves the session

### Device redirection

Learn says drives, clipboard, printers and USB are disabled by default in remote sessions; evaluate each before enabling it. Its alternatives:

| Redirection | Learn's suggested alternative |
|---|---|
| Drive | OneDrive for Business for file transfer |
| Clipboard | Clipboard transfer direction instead of bidirectional transfer. Restricting the content type also lets you enable the clipboard without the risk of files being transferred |
| Printer | Universal Print |
| USB | Not needed for common peripherals such as mouse, keyboard and webcam; enable only when required |

On the host pool these map to RDP properties such as `redirectclipboard` (default 0), `redirectprinters` (default 0), `drivestoredirect` and `usbdevicestoredirect` (both empty by default), according to the RDP properties page. Other redirections default to on: COM ports (`redirectcomports`), smart cards (`redirectsmartcards`), WebAuthn (`redirectwebauthn`) and MTP or PTP devices such as cameras (`devicestoredirect`). Review them as well when data must not leave the session.

### Screen capture protection

[Screen capture protection](/entity/avd-screen-capture-protection/) uses client operating system features to block remote content in screenshots and screen sharing. It applies to Azure Virtual Desktop session hosts and Windows 365 Cloud PCs. Learn's what's new page lists it as generally available since August 2021, and as available for web connections since August 2026. Requirements:

- Session host OS: Windows 11 22H2 or later, or Windows 10 22H2 or later.
- Native clients: Windows App on Windows and macOS, and the Remote Desktop client for Windows (1.2.1672 or later) and macOS (10.7.0 or later). RemoteApp sessions from Windows also need local Windows 11 22H2 or later.
- Mobile clients (Windows App on iOS and iPadOS 11.2.4 or later, Android 11.0.0.94 or later) use hybrid enforcement: the connection is allowed only when an Intune MAM app protection policy with **Screen capture** set to **Block** applies to the app. Learn pairs this with a Conditional Access policy that requires an app protection policy for Azure Virtual Desktop (and **Windows Cloud Login** if single sign-on is on).
- Web client on Windows: Microsoft Edge for Business 134.0.3124.51 or later (147 or later on devices managed by a different organization), in an Edge work profile on a personal or other-organization device; same-tenant managed devices are not supported. It needs its own Intune MAM policy for Edge, with **Allow cut, copy, and paste for** set to **Org data destinations and org data sources**, and its own Conditional Access policy for the Windows platform and the **Browser** client app. A policy that combines the Windows platform with **Mobile apps and desktop clients** blocks native Windows clients.
- On the session hosts, enable **Enable screen capture protection** with an Intune Settings catalog profile or Group Policy. **Block screen capture on client** blocks capture on the local device; **Block screen capture on client and server** also blocks tools and services inside the VM. Once the policy applies, restart the session hosts for it to take effect. Users must then sign out of existing sessions and connect to a new one.

Known limits: it is not DRM, content can appear black in Teams sharing with unsupported configurations, and some macOS apps may not fully respect it.

### Watermarking

[Watermarking](/entity/avd-watermarking/) has been generally available since July 2023, according to Learn's what's new page. It shows QR codes in the remote desktop that hold the connection ID (default) or the device ID, so a photographed screen can be traced to a session. The device ID is only for personal host pool session hosts that are Microsoft Entra joined or hybrid joined.

You enable it in the same Intune Settings catalog area (Group Policy has the same setting), selecting **Enable watermarking** (not the deprecated entry), setting it to **Enabled** and syncing the session hosts with Intune. Supported clients include the Remote Desktop client for Windows (1.2.3317 or later), macOS (10.9.5 or later), iOS and iPadOS (10.5.4 or later) and web, and Windows App on Windows, macOS, iOS, iPadOS and web. Windows App on Android and ChromeOS is in preview.

Learn's limits: once enabled, only supporting clients can connect, and others fail with a non-specific message. It applies only to full desktops (RemoteApp connections are allowed without it), and direct `mstsc.exe` connections bypass it. Learn lists Azure Virtual Desktop Insights as a prerequisite; you look up a connection ID from a QR code in Insights or with a Log Analytics query on `WVDConnections`.

## 6. Platform and boot protection

- **Trusted launch**: when you add session hosts in the Azure portal, Learn says the default security type is Trusted virtual machines. See [Trusted launch](/entity/trusted-launch/).
- **Confidential VMs** encrypt memory in use and are supported for Windows 11 Enterprise and Enterprise multi-session, Windows 10 Enterprise and Enterprise multi-session, and Windows Server 2022 and 2019, in versions in active support.
- Secure Boot, vTPM, virtualization-based security, HVCI and Credential Guard add boot and kernel protection. Learn recommends enabling vTPM to use remote attestation. Secrets bound to vTPM tie to one VM and pooled users can land on any VM, so check the impact first. Learn also warns not to use BitLocker on the disk that stores FSLogix profile data.
- **Administrator protection** is not supported on Windows 11 session hosts, including custom images. If enabled, users may see unexpected prompts or elevation failures. Learn says that applying the Microsoft Security Compliance Toolkit baselines through Group Policy turns it on starting with the October 2026 Windows security update, even if you did not enable it. To turn it off, set **User Account Control: Configure type of Admin Approval Mode** to **Legacy Admin Approval Mode** and restart the host. Learn says Administrator protection is not available on Windows Server, and its interim advice is to configure users as standard users.

## 7. Patching and monitoring

- Enable [Microsoft Defender for Cloud](/entity/microsoft-defender-for-cloud/) enhanced security features, review your Secure Score and run threat and vulnerability management assessments to find vulnerabilities.
- Patch the OS, apps and the images you build hosts from. Learn recommends patching base images monthly.
- Keep Windows Update reachable through firewall and proxy rules.
- Monitor with Azure Monitor and create service health alerts.

## How to use the checklist

1. Record the trust boundary for each user group before building host pools.
2. Apply sections 2, 3, 4, 6 and 7, plus the redirection review from section 5, as a baseline to every host pool.
3. Add screen capture protection and watermarking for groups that handle data that must not leave the session.
4. Pilot each control on one host, because watermarking, screen capture protection and application control change what users see.
5. Re-check the list when you adopt new Microsoft security baselines, because a baseline can change a default.

## Sources

Accessed 17 November 2026.

- [Microsoft Learn: Security recommendations for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/security-recommendations)
- [Microsoft Learn: Screen capture protection in Azure Virtual Desktop and Windows 365](https://learn.microsoft.com/en-us/azure/virtual-desktop/screen-capture-protection)
- [Microsoft Learn: Watermarking in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/watermarking)
- [Microsoft Learn: Azure Private Link with Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/private-link-overview)
- [Microsoft Learn: Supported RDP properties](https://learn.microsoft.com/en-us/azure/virtual-desktop/rdp-properties)
- [Microsoft Learn: Built-in Azure RBAC roles Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/rbac)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Microsoft Learn: Application Control for Windows](https://learn.microsoft.com/en-us/windows/security/application-security/application-control/app-control-for-business/appcontrol)
- [Microsoft Tech Community: Announcing the general availability of Private Link for Azure Virtual Desktop](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/announcing-the-general-availability-of-private-link-for-azure/3874429)
- [Microsoft Tech Community: RDP Shortpath UDP over Private Link is now generally available](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/rdp-shortpath-udp-over-private-link-is-now-generally-available/4494644)
