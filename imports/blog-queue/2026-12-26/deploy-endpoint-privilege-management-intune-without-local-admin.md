---
title: "Deploy Endpoint Privilege Management in Intune So Users Do Not Need Local Admin"
summary: "Plan and deploy Intune Endpoint Privilege Management: prerequisites and supported Windows builds, elevation settings and rules policies, elevation types, rule properties, the limit of 100 rules per policy and security recommendations from Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2026-12-26
topics: [intune]
keypoints:
  - "EPM lets users run as standard users and still complete tasks that normally need elevation. It requires a subscription in addition to Intune Plan 1 or Plan 2."
  - "Devices must be Microsoft Entra joined or hybrid joined, and enrolled in Intune or co-managed. Windows 10 22H2 and 21H2 and Windows 11 builds with listed KBs are supported."
  - "Create an elevation settings policy first. Rules have no effect without it. Each elevation rules policy supports up to 100 rules."
  - "Elevation types are Automatic, User confirmed, Support approved, Elevate as current user and Deny. Deny rules always win."
  - "Microsoft recommends a default elevation response of Require support approval or Deny, a file path in all rules, and starting with an audit policy."
faq:
  - q: "What do I need to use EPM?"
    a: "According to Microsoft Learn, a subscription in addition to Microsoft Intune Plan 1 or Plan 2. The page links to plans and pricing and does not name the add-on or suite."
  - q: "Which devices are supported?"
    a: "Microsoft Entra joined or hybrid joined devices, enrolled in Intune or co-managed with Configuration Manager. Learn lists 64-bit Windows 11 24H2, 23H2, 22H2 and 21H2 and Windows 10 22H2 and 21H2 builds, plus Azure Virtual Desktop single-session VMs and Windows 365."
  - q: "How many rules can a policy hold?"
    a: "Learn says each elevation rules policy supports up to 100 rules."
  - q: "Which file types does it support?"
    a: "exe, msi and ps1 files. Learn also says files on network shares are not supported."
  - q: "What default elevation response should I choose?"
    a: "Learn recommends Require support approval or Deny, not Require user confirmation, as the default elevation response."
---

Endpoint Privilege Management (EPM) in Microsoft Intune lets users work as standard users and still complete tasks that normally need elevation, such as application installs or driver updates. You deploy it with two policies: an elevation settings policy that turns EPM on, and elevation rules that decide what can elevate. This guide follows the Microsoft Learn overview, deployment planning and elevation rules pages.

## Prerequisites

- **Licensing:** a subscription in addition to Intune Plan 1 or Plan 2. The page links to plans and pricing and does not say whether it is a suite or add-on.
- **Windows versions (64-bit, Arm64 included):** Windows 11 24H2, 23H2 (22631.2506 or later with KB5031455), 22H2 (22621.2215 or later with KB5029351), 21H2 (22000.2713 or later with KB5034121), and Windows 10 22H2 and 21H2 (19045.3393 and 19044.3393 or later with KB5030211).
- **Windows 10:** reached end of support on October 14, 2025. It remains an allowed version in Intune, but functionality is not guaranteed and can vary.
- **Join and management:** Microsoft Entra joined or hybrid joined, and enrolled in Intune or co-managed with Configuration Manager.
- **Network:** clear line of sight, without SSL inspection, to the required endpoints, which the page links to.
- **Virtual platforms:** Azure Virtual Desktop single-session VMs and Windows 365.

## Policies

- **Elevation settings policy:** controls the EPM client, reporting level and default elevation response. Assigning it installs the EPM client.
- **Elevation rules policy:** defines elevation behavior for binaries or scripts.
- **Elevation system settings policy:** lets standard users change selected Windows system settings, including IPv4, IPv6 and DNS server configuration.

Create the settings policy first, because rules have no effect without it.

## Elevation types

- **Automatic:** elevates without user input. Broad rules here can widely affect security posture.
- **User confirmed:** users select **Run with elevated access**. Admins can require a business justification, Windows authentication or both.
- **Support approved:** users submit a request, an admin approves it and the user is notified.
- **Elevate as current user:** runs under the signed-in user's account. Learn says it widens the attack surface and recommends it only when virtual account elevation causes failures.
- **Deny:** blocks a file from running in an elevated context.

Most types use an isolated virtual account that is not in the local Administrators group.

## Create an elevation rules policy

1. Go to **Endpoint security** > **Endpoint Privilege Management** > **Policies**, then **Create Policy**.
2. Set **Platform** to **Windows** and **Profile** to **Windows elevation rules policy**.
3. Add a name, then add one rule per file in **Configuration settings**. New rules default to **User confirmed**.
4. Assign to users or device groups, then **Create**.

A rule can use file name (wildcards `?` and `*`, not in automatic rules), file path, signature source, certificate type, file hash, minimum version, file description, product name, internal name and an allow list of arguments. A file hash is the strongest identifier and is required for automatic rules. A file name alone, or a certificate plus file name alone, is not recommended because standard users can rename files in writable directories.

## Precedence

Rules are merged on the client. Device-assigned rules apply to every user on the device, and user-assigned rules take precedence over device rules. Deny rules take precedence over conflicting allow rules. The default elevation response applies only when no rule matches and elevation is triggered from **Run with elevated access**.

## Security recommendations from Learn

- Set the default elevation response to **Require support approval** or **Deny**.
- Specify a file path in all rule types.
- Tightly control installer elevation and minimize runtime elevation.
- Use stricter rules for high-risk apps such as browsers and PowerShell.
- Start with an audit policy and build rules from reports.

## Planning checklist

The planning page gives a checklist. Review the technical and licensing prerequisites. Define target user personas so that you can build rules with logical grouping. Understand the elevation settings and elevation rules policies, including default settings, file identification by hash, metadata or certificates, rule arguments, child process behavior, elevation types and how rule conflicts are handled. Find the right balance between security and flexibility. Plan a rollout with stakeholder management, user communication and training, and monitoring. The page also warns that a certificate rule can allow any app signed by that certificate to elevate, so be careful with vendors that sign all their apps with the same certificate.

## Not covered

The pages I read do not give the full elevation settings configuration (reporting scope and data sending), the required network endpoints or support approval workflow details. They link to separate articles for those.

## Related

- [Intune](https://www.m365.fm/entity/intune/)

## Sources

- [Learn about using Endpoint Privilege Management with Microsoft Intune (Microsoft Learn)](https://learn.microsoft.com/intune/epm/overview)
- [Plan and Prepare for Endpoint Privilege Management Deployment (Microsoft Learn)](https://learn.microsoft.com/intune/epm/deployment-planning)
- [Creating elevation rules with Endpoint Privilege Management (Microsoft Learn)](https://learn.microsoft.com/intune/epm/create-elevation-rules)
