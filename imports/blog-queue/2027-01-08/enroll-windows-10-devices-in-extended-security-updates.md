---
title: "How to Enroll Windows 10 Devices in Extended Security Updates for Business"
summary: "Enroll Windows 10 22H2 devices in Extended Security Updates with a MAK: prerequisites, required updates, retrieving the key, slmgr commands, activation IDs per program year, phone and VAMT activation, and how to check status."
status: review
publish: false
author: mirko-p
date: 2027-01-08
topics: [extended-security-updates, windows-update-for-business]
keypoints:
  - "ESU gives organizations critical and important security updates for enrolled Windows 10 PCs after end of support on October 14, 2025. It is a paid subscription."
  - "The page covers MAK-based activation with slmgr.vbs. It needs Windows 10 22H2 with KB5066791 or later, then the ESU licensing preparation package KB5072653 installed after it."
  - "Activate with slmgr.vbs /ipk using the ESU MAK, then slmgr.vbs /ato with the Activation ID for the program year."
  - "Check status with slmgr.vbs /dlv. The output shows the ESU program name and License Status as Licensed."
  - "LTSB and LTSC releases are not covered by the Windows 10 ESU program. Home users have a separate consumer page."
faq:
  - q: "What are Windows 10 ESU?"
    a: "Per Microsoft Learn, the program lets organizations receive critical and important security updates for PCs enrolled in the paid subscription service, extending the use of Windows 10 devices past the end of support date on October 14, 2025."
  - q: "What do I need before activation?"
    a: "Windows 10 version 22H2 with KB5066791 or later, the ESU licensing preparation package KB5072653 installed after KB5066791, administrator rights, internet access to the listed activation endpoints, and the ESU MAK."
  - q: "How do I activate a device?"
    a: "Run slmgr.vbs /ipk with the ESU MAK, then slmgr.vbs /ato with the Activation ID for the program year. Learn gives separate IDs for Year1, Year2 and Year3."
  - q: "How do I confirm enrollment?"
    a: "Run slmgr.vbs /dlv from an elevated Command Prompt. The output shows the ESU program name and License Status as Licensed."
  - q: "Does the page cover Intune or Windows Update for Business enrollment?"
    a: "No. The page covers MAK-based activation, phone activation and VAMT. It does not describe the Settings app, Intune or Windows Update for Business enrollment."
---

Windows 10 reached end of support on October 14, 2025. Organizations that still run Windows 10 can buy Extended Security Updates (ESU) and activate each device with an ESU key. The Microsoft Learn page behind this guide documents MAK-based activation with the slmgr.vbs tool. It does not describe enrollment through Intune, Windows Update for Business or the Settings app, so this guide does not either.

## What ESU is

The ESU program lets organizations receive critical and important security updates for PCs enrolled in the paid subscription service. It extends the use of Windows 10 devices past October 14, 2025. Windows 10 LTSB and LTSC releases have their own lifecycles and are not covered. Individuals and Windows 10 Home customers are pointed to a separate consumer ESU page.

## Prerequisites

- Windows 10, version 22H2.
- Windows 10 22H2 with KB5066791 or a later update.
- The ESU Licensing Preparation Package, KB5072653, installed after KB5066791.
- Administrator rights on the device.
- Internet access and reachability of the listed activation and licensing endpoints, such as `activation.sls.microsoft.com`. The page lists 13 endpoints.
- The ESU MAK. To see it in the Microsoft 365 admin center you need the Product Key Reader or VL Administrator role in Microsoft Entra ID. The page gives the path Billing > Your Products > Volume licensing > Contracts > View product keys.

## Activate online

1. Install the key from an elevated prompt: `slmgr.vbs /ipk <ESU MAK>`.
2. Find the Activation ID for the program year.
3. Activate: `slmgr.vbs /ato <Activation ID>`.

| ESU program | Activation ID |
| --- | --- |
| Win10 ESU Year1 | f520e45e-7413-4a34-a497-d2765967d094 |
| Win10 ESU Year2 | 1043add5-23b1-4afb-9a0f-64343c8f3f8d |
| Win10 ESU Year3 | 83d49986-add3-41d7-ba33-87c7bfb5c0fb |

The IDs are the same across all eligible Windows ESU editions and all devices enrolled for that program.

## Check enrollment

Run `slmgr.vbs /dlv` from an elevated Command Prompt. The output shows the name of the ESU program and License Status as Licensed for that program.

## Devices without internet

- **Phone activation:** use `slmgr.vbs /dti` and `/atp`, together with the Microsoft Product Activation portal. The confirmation ID must not contain spaces.
- **Large-scale offline activation:** use the Volume Activation Management Tool (VAMT) proxy activation scenario. VAMT needs the latest ADK and an update that adds the PkeyConfig files for Windows 10 ESU MAK keys.

Reimaging may need extra activations. The page says to request an increase to the MAK activation limit when needed.

## What the page does not say

- Pricing, and how long each ESU year lasts. It shows Year1 to Year3 in the table without end dates.
- Enrollment through the Settings app, Intune, Windows Update for Business or Windows Update.
- Other checks of enrollment status in a management console.
- What happens to devices after ESU ends.
- Windows Server, and Windows 10 versions other than 22H2.
- Cloud and virtual machine enrollment. The page refers to a separate article.

If you expected a Windows Update for Business or Intune route, read the other Learn pages on ESU before you plan a rollout.

## Notes on the tools and the key

- The activation IDs stay the same for all eligible Windows ESU editions and all devices enrolled for that program year, which, as practical advice, means one command sequence can serve a whole fleet. The page does not describe scripting.
- A MAK has an activation limit. If you reimage devices, you may need more activations, and the page says to request an increase to the limit.
- The key is a multiple activation key from your volume licensing contract, shown under the product keys view in the Microsoft 365 admin center. Without the Product Key Reader or VL Administrator role you cannot see it there.
- The commands need an elevated prompt and the device must reach the activation endpoints, unless you use phone activation or VAMT.

## A rollout outline

This outline is practical advice built on the page.

1. Inventory devices. Confirm each is on Windows 10 22H2 and not LTSC.
2. Install KB5066791 or later, then KB5072653.
3. Collect the ESU MAK with a role that can see it.
4. Test the commands on a pilot device and check with `slmgr.vbs /dlv`.
5. Decide per device whether online, phone or VAMT activation fits.
6. Plan which program year each device needs.

## Typical mistakes

- Installing KB5072653 before KB5066791.
- Assuming LTSC devices can enroll.
- Using the wrong Activation ID for the program year.
- Blocking the activation endpoints at the firewall.

## Related

- [Extended Security Updates](https://www.m365.fm/entity/extended-security-updates/)
- [Windows Update for Business](https://www.m365.fm/entity/windows-update-for-business/)
- [Windows Autopatch](https://www.m365.fm/entity/windows-autopatch/)

## Sources

- [Enable Windows 10 Extended Security Updates (Microsoft Learn)](https://learn.microsoft.com/windows/whats-new/enable-extended-security-updates)
