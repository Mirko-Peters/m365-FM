---
title: "Group Policy vs Microsoft Intune: When to Move and What to Check First"
summary: "How Group Policy and Intune differ, what Microsoft says to check before moving, how Group Policy analytics and the Settings catalog work, and how conflicts are resolved when both manage the same device."
status: review
publish: false
author: mirko-p
date: 2026-12-02
topics: [group-policy, intune, hybrid-entra-join, security-baselines]
keypoints:
  - "Microsoft's planning guide says not to move Group Policy to Intune until you know what each policy does. Build new policies from requirements with the Settings catalog."
  - "Group Policy analytics imports GPO XML files up to 4 MB and shows which settings have an Intune equivalent. It applies to Windows only."
  - "The Migrate option is disabled for AppLocker and Firewall rules. Configure those under Endpoint Security instead."
  - "If both manage the same Policy CSP setting, MDMWinsOverGP makes Intune win, but it does not cover other CSPs such as Defender."
  - "On-premises AD join and hybrid join need domain controller connectivity, so Microsoft does not consider them suitable for cloud-native endpoints."
faq:
  - q: "Should I migrate all my GPOs to Intune?"
    a: "Microsoft Learn advises against it. The cloud-native endpoint planning guide says not to move Group Policy to Intune until you know what the policies do, and the migrate page says to review settings first because some do not apply to cloud-native endpoints."
  - q: "What does Group Policy analytics do?"
    a: "According to Microsoft Learn, it imports exported GPO XML reports, shows the percentage of settings with an Intune equivalent under MDM Support, lists unknown settings and can lead to a Settings catalog policy. It applies to Windows only."
  - q: "What happens when Group Policy and Intune set the same setting?"
    a: "Microsoft Learn says to avoid configuring the same setting in both unless MDMWinsOverGP controls it, because otherwise there is a race condition with no guaranteed winner. For Defender Antivirus, Microsoft lists Group Policy above Intune in its order of precedence."
  - q: "Does MDMWinsOverGP solve every conflict?"
    a: "No. Microsoft Learn says it applies only to policies in the Policy CSP. It does not cover equivalent settings in other CSPs such as the Defender CSP, and for Windows Update it recommends IgnoreWindowsUpdateGroupPolicies."
  - q: "Can I run both at the same time?"
    a: "Yes, for a transition. A Microsoft Q&A answer describes hybrid Microsoft Entra joined devices receiving both on-premises GPOs and Intune policies. Microsoft's planning guide, however, calls hybrid join a temporary step toward Microsoft Entra join for cloud-native endpoints."
---

Group Policy and Intune both configure Windows, but they work differently. Group Policy applies settings to domain-joined machines through Active Directory. Intune delivers settings as policies assigned to users and groups through mobile device management. The practical advice from Microsoft is to understand what your GPOs do before moving anything, then rebuild what you need in the Settings catalog and security baselines, and avoid configuring the same setting in both places.

## How the two differ

The Microsoft Learn troubleshooting page for cloud-native endpoints notes that Intune policies are deployed to users and groups, not applied in the local, site, domain, OU order that Group Policy uses. Group Policy depends on domain controller connectivity. Microsoft's planning guide says on-premises AD join and hybrid Microsoft Entra join need domain controller connectivity for sign-in, Group Policy and password changes, so they are not suitable for cloud-native endpoints. For new devices it recommends Microsoft Entra join.

The Settings catalog is the Intune profile type that lists the settings you can configure for a platform in one place. Microsoft says that if you configure settings at a granular level, similar to on-premises GPOs, the Settings catalog is a natural transition to cloud-based policy. It does not describe a one-to-one mapping. User-scope settings write to HKCU and device-scope settings write to HKLM.

## When to move

Microsoft does not rank the two in general. The signals it gives:

- **Cloud-native devices:** If devices are Microsoft Entra joined and used from anywhere, Intune is the management plane. Group Policy cannot reach them without domain connectivity.
- **Hybrid transition:** A Microsoft Q&A answer describes hybrid as the usual starting point, with both GPOs and Intune policies reaching hybrid joined devices while migration proceeds gradually. The planning guide calls hybrid join a temporary step.
- **Devices used only on-premises:** The planning guide says devices used only on-premises should not be migrated to cloud-native.

## What to check first

The planning guide for cloud-native endpoints lists these checks, in order:

1. Which endpoints need a cloud identity.
2. How each device is joined today.
3. Which apps depend on Kerberos or on-premises authentication. Microsoft Entra Kerberos does not solve connectivity issues or machine authentication problems.
4. Which apps and resources exist only on-premises and need VPN.
5. File shares and how users reach them.
6. Active GPOs, and which are legacy, unused or complex, such as WMI filters, inheritance blocking, loopback and security filtering.
7. Policies for certificates, BitLocker and endpoint protection, to recreate in Intune or Configuration Manager.
8. Software deployment and update methods. The page calls updates the first workload to transition.

The troubleshooting page adds common failures: machine authentication does not work for cloud-native endpoints, Active Directory login scripts are not available, standard print management does not work on Entra joined endpoints (Microsoft recommends Universal Print), and synchronized accounts with User must change password at next logon cannot complete first sign-in.

## Analyze GPOs with Group Policy analytics

Group Policy analytics applies to Windows only. Roles: Intune administrator, or a role with Security baselines and Device Configuration permissions.

**Export:** In `GPMC.msc`, expand your domain and Group Policy Objects, right-click the GPO, choose **Save report** and select **XML File**. Each file must be 4 MB or less and must be properly Unicode encoded, or import fails.

**Import:** In the Intune admin center go to **Devices > Manage devices > Group Policy analytics**, select **Import**, choose files, pick scope tags (Default applies if none), then **Next** and **Create**.

The results list **MDM Support**, the percentage of settings with an Intune equivalent, plus **Unknown Settings**, **Targeted in AD** and **Last imported**. Per setting you see CSP name, CSP mapping and minimum OS version. Under **Reports > Device management > Group policy analytics** a migration readiness report marks settings Ready for migration, Not supported or Deprecated.

Limits: only non-ADMX settings in English are analyzed accurately, and Group Policy analytics parses the Policy, PassportForWork, BitLocker, Firewall and AppLocker CSPs and Group Policy Preferences. Others appear as unknown.

## Migrate to the Settings catalog

On **Devices > Manage devices > Group Policy analytics**, select the **Migrate** checkbox next to a GPO, then **Migrate**. Select settings on the **Settings to migrate** tab, review values, name the profile, optionally assign scope tags, assign groups and select **Create**. The policy appears under **Devices > Manage devices > Configuration**.

Microsoft's documented limits:

- Migration is best effort. Only settings with a Settings catalog equivalent migrate, and some values may differ.
- Conflicting values across GPOs must be resolved by unchecking one setting.
- For AppLocker and Firewall rules, **Migrate** is disabled. Use **Endpoint Security**.
- The page advises against migrating all settings without review.

## Handling conflicts while both exist

Microsoft Learn's Policy CSP page for ControlPolicyConflict says to avoid configuring the same setting in both unless the settings are controlled by MDMWinsOverGP, because otherwise there is a race condition and no guarantee which one wins.

- **MDMWinsOverGP** set to 1 makes an MDM policy win over the equivalent Group Policy, which is blocked. It is device scope, applies to Pro, Enterprise, Education and IoT Enterprise, and needs Windows 10 version 1803 or later.
- **Limits:** it applies only to Policy CSP settings and not to other CSPs such as Defender.
- **Windows Update:** Microsoft recommends IgnoreWindowsUpdateGroupPolicies, which makes Group Policy settings for Windows Update ignored.
- A Microsoft Q&A answer states that by default GPO wins over Intune when both apply to the same setting.

For Defender Antivirus, Microsoft's precedence list places Group Policy above Intune. Remove the Group Policy setting after you verify the Intune policy applies.

## A safe sequence

1. Inventory and group your GPOs by purpose.
2. Run Group Policy analytics and read the readiness report.
3. Rebuild wanted settings in the Settings catalog or Endpoint Security, using security baselines where they fit.
4. Pilot, confirm the settings apply, then remove the matching GPO setting.
5. Move update management early, as the planning guide suggests.

## Related

- [Group Policy](https://www.m365.fm/entity/group-policy/)
- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Microsoft Entra hybrid join](https://www.m365.fm/entity/hybrid-entra-join/)
- [Co-management](https://www.m365.fm/entity/co-management/)

## Sources

- [Microsoft Learn: Update your workloads to support cloud-native endpoints](https://learn.microsoft.com/en-us/intune/solutions/cloud-native-endpoints/planning-guide)
- [Microsoft Learn: Common issues and resolutions with cloud-native endpoints](https://learn.microsoft.com/en-us/intune/solutions/cloud-native-endpoints/troubleshoot)
- [Microsoft Learn: Analyze on-premises GPOs using Group Policy analytics in Intune](https://learn.microsoft.com/mem/intune/configuration/group-policy-analytics)
- [Microsoft Learn: Create a Settings catalog policy using your imported GPOs](https://learn.microsoft.com/en-us/intune/device-configuration/migrate-group-policy)
- [Microsoft Learn: Use the settings catalog to configure settings in Intune](https://learn.microsoft.com/en-us/intune/device-configuration/settings-catalog/)
- [Microsoft Learn: Policy CSP, ControlPolicyConflict](https://learn.microsoft.com/en-us/windows/client-management/mdm/policy-csp-controlpolicyconflict)
- [Microsoft Learn: Troubleshoot Microsoft Defender Antivirus settings](https://learn.microsoft.com/en-us/defender-endpoint/troubleshoot-settings)
- [Microsoft Q&A: Group Policy vs Intune policies](https://learn.microsoft.com/en-us/answers/questions/5868874/group-policy-vs-intune-policies)
