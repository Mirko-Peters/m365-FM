---
title: "Update the Secure Boot Certificates on Windows Devices: Checks and Rollout Steps"
summary: "The 2011 Secure Boot certificates began expiring in June 2026 and Microsoft is replacing them with 2023 certificates. Devices still boot, but may miss future boot protections. This guide covers the signs to check, the firmware-first order, pilot groups and the deployment options Learn lists."
status: review
publish: false
author: mirko-p
date: 2027-01-19
topics: [windows-update-for-business, bitlocker, intune]
keypoints:
  - "Learn says the 2011 Secure Boot certificates expire in June 2026 and are replaced by 2023 certificates; that month has already passed."
  - "Devices that are not updated still boot and receive standard updates, but may not receive future Secure Boot protections for early boot components."
  - "Signs to check on a device are Event ID 1801, Event ID 1795 and the UEFICA2023Status registry value not showing Updated."
  - "Outdated firmware raises the risk of validation errors, BitLocker recovery prompts and loops, startup hangs and boot failures."
  - "Learn's order is: review the estate, update OEM firmware first, pilot across hardware and BitLocker setups, then deploy with Intune, registry keys, the Windows Configuration system or Group Policy."
faq:
  - q: "What happens if a device is not updated?"
    a: "Learn and the support article say the device continues to start and to receive standard Windows updates. It may not receive future Secure Boot protections for early boot components."
  - q: "Should I turn off Secure Boot as a workaround?"
    a: "No. The Microsoft Support article tells you not to disable Secure Boot as a workaround."
  - q: "How do I see whether a device has the new certificate?"
    a: "Learn lists Event ID 1801 and Event ID 1795 as signs, and the registry value UEFICA2023Status, which should show Updated when the process is done."
  - q: "Why update firmware first?"
    a: "Learn says devices with outdated firmware are at higher risk of validation errors, BitLocker recovery prompts and loops, startup hangs and boot failures, so update the OEM firmware before the certificate update."
  - q: "Which products does the support article cover?"
    a: "The Microsoft Support article lists Windows 10 including LTSC and 22H2, Windows 11 versions 21H2 to 24H2, and Windows Server from 2012 with Extended Security Updates through Server 2025."
---

Microsoft is replacing the Secure Boot certificates that were issued in 2011 with certificates issued in 2023. Learn's article for Windows client says the 2011 certificates expire in June 2026, and that month has passed. If your fleet has not been updated, the practical work now is to find devices that are still on the old certificates, update OEM firmware, and deploy the certificate update in controlled groups. This article follows Learn's troubleshooting article on updating Secure Boot certificates and the Microsoft Support article on what happens when they expire. I read the Support article through a summarizing fetch, so its details are secondhand.

## A note on dates

The Learn article is written in the future tense and carries a 2026 date. Because June 2026 is now behind us, I describe the expiry as having started. The Support article says the certificates begin expiring in June 2026 and does not give a specific day in the text I saw. Treat any statement that there is still time before the expiry as outdated, and check the Learn page for the latest wording.

## What the impact is

The Learn article says a device that is not updated still boots and still receives standard Windows updates. What it may not receive are future Secure Boot protections for early boot components. The Support article agrees that devices continue to start and update, but will lack new early-boot protections. It also says not to disable Secure Boot as a workaround.

## Signs to look for

Learn lists these indicators on a device:

- **Event ID 1801**, in the event log.
- **Event ID 1795**, in the event log.
- **Registry value UEFICA2023Status** that does not show Updated.

It adds that devices with outdated firmware are at higher risk of problems such as validation errors, BitLocker recovery prompts and loops, startup hangs and boot failures.

## The order of work Learn describes

1. **Review your estate.** Identify devices and their manufacturers and firmware versions.
2. **Update OEM firmware first.** The vendor firmware needs to be current before the certificate update.
3. **Pilot.** Test on multiple OEMs and firmware versions, and include devices with BitLocker enabled.
4. **Deploy.** Learn lists several ways: Microsoft Intune, registry keys, the Windows Configuration system (the Windows Configuration CSP) and Group Policy.

The article points to a Secure Boot playbook on the Tech Community blog for more detail. The Support article lists further resources, including IT guidance, a troubleshooting guide, an FAQ and the short link aka.ms/securebootplaybook. I did not read those.

## Which systems are affected

According to the Support article, the topic applies to Windows 10 including LTSC and 22H2, Windows 11 versions 21H2 to 24H2, and Windows Server from 2012 with Extended Security Updates up to Server 2025. Also note that Windows 10 support ended on October 14, 2025. In my view, check how each Windows 10 device you still run receives updates, because that decides whether it can get this fix at all.

The Support article says most devices receive the update automatically, while some need an OEM firmware update first.

## A practical rollout

This section is my advice, not a Microsoft statement.

1. **Build an inventory column for the state.** Collect Event 1801 or 1795 data and the UEFICA2023Status value with your management tool, so you have a status per device instead of a single guess.
2. **Group by hardware model.** Firmware behaves per model, so group devices that way and pilot one model per group.
3. **Check BitLocker status before changes.** Learn names BitLocker recovery as a risk. Confirm recovery keys are stored in Microsoft Entra ID or your key store before the pilot, and have a process to retrieve them.
4. **Start small.** A pilot of a few devices per model, with the help desk informed, shows problems cheaply.
5. **Keep a rollback and support plan.** Know who can reach the firmware setup on a device that fails to start, and what you will do for remote users.
6. **Do not disable Secure Boot.** Both pages warn against it as a workaround, and doing so weakens the boot chain.
7. **Handle old devices on purpose.** For hardware that no vendor firmware update supports, decide whether to replace it, restrict it or accept the risk, and write the decision down.
8. **Report progress.** A simple count of updated, pending and blocked devices keeps the project visible.

## Mistakes to avoid

This section is my advice, not a Microsoft statement.

- **Updating certificates before firmware.** This reverses Learn's order and invites the problems it lists.
- **Piloting only on one vendor.** Learn asks for multiple OEMs and firmware versions in the pilot.
- **Forgetting devices that are offline.** Laptops that rarely connect may miss automatic updates, so check for them separately.
- **Treating the event IDs as a complete picture.** Combine them with the registry value, and with firmware information.

## What I did not read

I read the Learn article in full. It is short and does not include step-by-step instructions for each deployment method; those are in the linked playbook, which I did not read. I also saw in search results a Learn page on troubleshooting Windows Server Secure Boot certificate update issues, but did not read it, so check it if you manage servers.

## Related

- [Windows Update for Business](https://www.m365.fm/entity/windows-update-for-business/)
- [BitLocker](https://www.m365.fm/entity/bitlocker/)
- [Microsoft Intune](https://www.m365.fm/entity/intune/)

## Sources

- [Update Secure Boot Certificates for Windows Devices - Windows Client (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/windows-client/windows-security/update-secure-boot-certificates)
- [When Secure Boot certificates expire on Windows devices (Microsoft Support)](https://support.microsoft.com/topic/when-secure-boot-certificates-expire-on-windows-devices-c83b6afd-a2b6-43c6-938e-57046c7b5c2b)
