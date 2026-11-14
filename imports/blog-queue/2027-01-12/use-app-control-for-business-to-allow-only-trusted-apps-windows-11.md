---
title: "How to Use App Control for Business to Allow Only Trusted Apps on Windows 11"
summary: "What App Control for Business is, how it differs in intent from antivirus, supported Windows versions and editions, Smart App Control and the Intelligent Security Graph, and the policy, audit and deployment topics that the Learn overview leaves to other articles."
status: review
publish: false
author: mirko-p
date: 2027-01-12
topics: [intune, microsoft-defender-for-endpoint]
keypoints:
  - "Application control changes Windows from running all code unless antivirus predicts it is bad to running code only if your policy says so. It is not a replacement for antivirus."
  - "It covers more than apps: scripts, MSI installers, batch files and interactive PowerShell sessions, which run in Constrained Language Mode."
  - "The page applies to Windows 11, Windows 10 and Windows Server 2016 to 2025, on Pro, Enterprise, Pro Education/SE and Education editions."
  - "Smart App Control starts in evaluation mode and switches off within 48 hours on enterprise managed devices unless the user turns it on first."
  - "The overview gives no audit or enforced mode definitions, no AppLocker comparison, no Intune or Group Policy deployment steps and no managed installer details."
faq:
  - q: "What is App Control for Business?"
    a: "A Windows application control technology. Microsoft Learn says it changes Windows from a place where all code runs unless antivirus predicts it is bad to one where code runs only if your policy says so. It is not a replacement for antivirus."
  - q: "What does it control?"
    a: "More than apps: scripts, Microsoft installers (MSI), command-line batch files and interactive sessions of Windows PowerShell, which run in Constrained Language Mode."
  - q: "How is it related to AppLocker?"
    a: "The page says Windows includes two application control technologies, App Control for Business and AppLocker, to be used depending on your scenario. It links to a separate article for the comparison."
  - q: "What is the Intelligent Security Graph?"
    a: "The service Smart App Control uses to predict what code is safe to run. It is also available in App Control for Business, where it is called the Intelligent Security Graph."
  - q: "Which editions are supported?"
    a: "Windows Pro, Enterprise, Pro Education/SE and Education. License entitlements come from Windows Pro, Pro Education/SE, Enterprise E3 or E5, and Education A3 or A5."
---

Antivirus blocks code it recognizes as bad. App Control for Business turns that around: only code that your policy allows runs. This guide follows the Microsoft Learn overview page on App Control for Business. The overview is conceptual and points to other articles for policy creation and deployment, so this guide does not give deployment steps.

## The idea

Learn says application control changes Windows from a place where all code runs unless your antivirus solution confidently predicts it is bad, to one where code runs only if your policy says so. It can significantly harden computers against malicious code, but it is not a replacement for antivirus.

It covers more than applications. The page names scripts, Microsoft installers (MSI), command-line batch files and interactive Windows PowerShell sessions, which run in Constrained Language Mode.

## Two technologies

The page says Windows includes two application control technologies, App Control for Business and AppLocker, and you choose depending on your scenario and requirements. It does not compare them. It links to a separate overview that does.

## Where it applies

- Windows 11 and Windows 10.
- Windows Server 2025, 2022, 2019 and 2016.
- Editions: Windows Pro, Enterprise, Pro Education/SE and Education.
- License entitlements come from Windows Pro, Pro Education/SE, Enterprise E3 or E5, and Education A3 or A5.

## Smart App Control and the Intelligent Security Graph

The page describes Smart App Control as using a service to predict what code is safe to run. That service is also available in App Control for Business under the name Intelligent Security Graph (ISG).

- Smart App Control starts in evaluation mode. On enterprise managed devices it switches off within 48 hours unless the user turns it on first.
- When Smart App Control or ISG is enabled with a non-Microsoft antivirus, Microsoft Defender Antivirus is set to passive or hybrid mode. The page describes this as expected.
- The registry value `VerifiedAndReputablePolicyState` under `HKLM\SYSTEM\CurrentControlSet\Control\CI\Policy` controls Smart App Control: 0 is off, 1 is enforce and 2 is evaluation. After a change, run `CiTool.exe -r` for it to take effect.

## Policy authoring

The page mentions the App Control Wizard as a policy authoring tool, bundled with the Smart App Control policy. An example policy is at `%windir%/schemas/CodeIntegrity/ExamplePolicies/SmartAppControl.xml`. If you use it as a base, you must remove the option Enabled:Conditional Windows Lockdown Policy. A link leads to guidance on creating a policy for lightly managed devices.

## What the page does not say

- What audit mode and enforced mode mean for App Control policies.
- A comparison with AppLocker.
- Deployment through Intune, Group Policy or the multiple policy format.
- Managed installer details.
- ISG configuration beyond its definition.
- Step-by-step policy creation.

## A starting outline

This outline is practical advice built on the page, which leaves the details to other articles.

1. Decide which devices are fully managed and which are lightly managed, since the page links separate guidance for lightly managed devices.
2. Read the AppLocker comparison before you choose a technology.
3. Learn the audit and enforcement concepts in the linked articles, and start with a small pilot.
4. Keep antivirus in place, because the page says application control does not replace it.
5. Check Smart App Control behavior on managed devices, since it switches off within 48 hours unless users turn it on.

## Typical mistakes

- Treating application control as a replacement for antivirus.
- Copying the example Smart App Control policy without removing Enabled:Conditional Windows Lockdown Policy.
- Forgetting the CiTool command after a registry change.
- Expecting the overview to explain deployment through Intune.

## Quick reference

| Topic | What the page says |
| --- | --- |
| Model | Code runs only if policy allows it |
| Antivirus | Not replaced by application control |
| Covers | Apps, scripts, MSI, batch files, PowerShell in Constrained Language Mode |
| Technologies | App Control for Business and AppLocker |
| Windows client | Windows 11 and Windows 10 |
| Windows Server | 2025, 2022, 2019, 2016 |
| Smart App Control values | 0 off, 1 enforce, 2 evaluation |
| Apply a change | `CiTool.exe -r` |

## Reading the page as a starting point

This is practical advice. Treat the overview as the place to understand the idea and the limits. Then follow its links for policy creation and deployment, because the page itself does not cover them. Write down which devices fall under the editions listed above before you plan a pilot, since the page names the editions that are supported.

## Related

- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Microsoft Defender for Endpoint](https://www.m365.fm/entity/microsoft-defender-for-endpoint/)
- [Windows Autopatch](https://www.m365.fm/entity/windows-autopatch/)
- [Windows Hello for Business](https://www.m365.fm/entity/windows-hello-for-business/)

## Sources

- [App Control for Business overview (Microsoft Learn)](https://learn.microsoft.com/windows/security/application-security/application-control/app-control-for-business/appcontrol)
