---
title: "Fix Windows Update Error 0x8024402C Installing an Update or Feature on Demand"
summary: "Error 0x8024402C means a proxy or server name could not be resolved. Learn's resolution steps for direct Windows Update and WSUS setups, Feature on Demand version limits, policy checks and where to get FoD media."
status: review
publish: false
author: mirko-p
date: 2027-01-20
topics: [windows-update-for-business, windows-server]
keypoints:
  - "Learn defines 0x8024402C as WU_E_PT_WINHTTP_NAME_NOT_RESOLVED: the proxy server or target server name cannot be resolved."
  - "On a PC that connects directly to Windows Update, suspect the local network or internet connection. With WSUS, suspect the connection to the WSUS server."
  - "WSUS can deliver Feature on Demand packages only to Windows 11 22H2 or later and Windows Server 2025 or later."
  - "Other versions without direct Windows Update access need a network repository, local media or a network-mounted ISO image."
  - "Also check Group Policy and policy CSP settings that could block updates, and read the Windows Update log for the WinHttp warnings."
faq:
  - q: "What does error 0x8024402C mean?"
    a: "According to Microsoft Learn, the Microsoft Error Lookup Tool defines it as WU_E_PT_WINHTTP_NAME_NOT_RESOLVED, the same as ERROR_WINHTTP_NAME_NOT_RESOLVED, which means the proxy server or target server name cannot be resolved. The visible message says Windows could not complete the requested changes and asks you to reboot and try again."
  - q: "Why does it occur on a PC that uses WSUS?"
    a: "Learn says that on a computer that uses an intranet service such as Windows Server Update Services, the error indicates that the issue might occur in the local network and that the computer cannot connect to the WSUS server."
  - q: "Can WSUS deliver Feature on Demand packages to every Windows version?"
    a: "No. Learn states that to get an FoD package from WSUS, the computer must run Windows 11, version 22H2 or later, or Windows Server 2025 or later. Other versions need a network repository, local media or a network-mounted ISO image."
  - q: "Which tests does Learn suggest first?"
    a: "Check that the computer can connect to the local network, for example by using ping or nslookup to reach other devices and resolve DNS addresses. If necessary, check the Windows Update logs to find the source of the problem."
  - q: "Where can I get FoD ISO packages?"
    a: "Learn lists the Microsoft 365 Admin Portal, which needs an administrative Microsoft 365 account and replaced the Volume Licensing Service Center, the OEM, the Microsoft Evaluation Center, MSDN Platforms with a Visual Studio subscription, and GitHub OpenSSH packages. The package must match the Windows version."
---

Error 0x8024402C means that Windows could not resolve the name of a proxy server or of the target server. Microsoft Learn describes it as a network or name resolution problem. On a PC that talks to Windows Update directly, check the local network, internet access, proxy, firewall and DNS. On a PC managed by WSUS, check the connection to the WSUS server and the Windows version when the goal is a Feature on Demand.

## What you see

When you manually install a Windows update or a Feature on Demand (FoD) package, you get a message that resembles: Windows couldn't complete the requested changes. The changes couldn't be completed. Please reboot your computer and try again. Error code 0x8024402C.

## What the code means

The Microsoft Error Lookup Tool (err.exe) gives this definition: `WU_E_PT_WINHTTP_NAME_NOT_RESOLVED`, the same as `ERROR_WINHTTP_NAME_NOT_RESOLVED`, meaning the proxy server or target server name cannot be resolved.

Learn draws two conclusions:

- On a computer that connects directly to the Windows Update service, the issue might be in the local network or the internet connection.
- On a computer that uses an intranet service such as Windows Server Update Services (WSUS), the issue might be in the local network, and the computer cannot connect to the WSUS server.

## Step by step resolution

Learn lists these steps in order.

1. **Check the local network.** Use `ping` or `nslookup` to confirm that the computer reaches other devices and resolves DNS addresses correctly. If needed, check the Windows Update logs to find the source of the problem.
2. **If the computer connects directly to Windows Update:**
   - Verify that it can reach the internet. If not, check proxy and firewall configurations and make sure DNS works.
   - Verify that Windows is configured correctly to access Windows Update. Learn refers to the pages on managing connection endpoints for Windows 11 Enterprise and the Delivery Optimization section of the page on managing connections from Windows components to Microsoft services.
3. **If the computer uses an intranet update service and you want to install an FoD instead of an update,** check the Windows version, for example by entering `winver` in the search bar.
   - Windows Server 2025 or later, or Windows 11 22H2 or later: continue with the next step.
   - Windows Server 2022 or 2019, Windows 11 21H2 or earlier, or Windows 10: use an ISO image or FoD repository, described below.
4. **If the computer uses an intranet update service and you want to install an update manually,** verify that it can connect to the WSUS server. This also applies to manually installing an FoD on a supported version. If it cannot connect, check proxy and firewall configurations and make sure DNS works.
5. **Make sure no settings block updates.** Check Group Policy or policy configuration service provider (CSP) settings. Learn names Policy CSP ADMX_Servicing, Policy CSP Update, the Specify intranet Microsoft update service location setting, the page on using Windows Update client policies and WSUS together, and the page on managing additional Windows Update settings.

For OpenSSH Server or Client, Learn points to a separate article about not being able to install OpenSSH features.

## Reading the Windows Update log

Learn shows a log excerpt with WinHttp warnings such as `SendRequestUsingProxy failed` for a server URL, ending in `Skipping scan, self-update check returned 0x8024402C` and `Exit code = 0x8024402C`. The excerpt helps you see when the update process failed and which URL it tried to reach. Learn links to its page on Windows Update log files for how to collect and review them.

## Feature on Demand without direct Windows Update access

WSUS delivers FoD packages only to Windows 11 version 22H2 or later and Windows Server 2025 or later. For other versions that cannot reach Windows Update directly, you need a repository or media on your network. Learn lists these affected versions: Windows Server 2022 and 2019, Windows 11 21H2 or earlier, and Windows 10.

| Source | Details from Learn |
| --- | --- |
| Microsoft 365 Admin Portal | Needs an administrative Microsoft 365 account. It replaced the Volume Licensing Service Center |
| OEM | Typically needs a support agreement |
| Microsoft Evaluation Center | May not include packages for older Windows versions |
| MSDN Platforms | Needs a Visual Studio subscription |
| GitHub OpenSSH packages | You are responsible for configuration and future updates |

Two rules apply. The FoD ISO package must match your Windows version, for example a package for Windows 11 version 21H2 for a device on that version. And the downloaded files must sit on a drive or network share that the target computer can reach. Learn also links to pages on FoD repositories, building a custom FoD and language pack repository, and FoD media.

## Which path applies

| Situation | Learn's direction |
| --- | --- |
| Direct to Windows Update, name resolution fails | Check network, DNS, proxy, firewall, and connection endpoints |
| WSUS, installing an update | Check connection to the WSUS server, then policies |
| WSUS, installing an FoD on Windows 11 22H2 or later | Same as above |
| No Windows Update access, older Windows | FoD repository or mounted ISO |

## A short checklist (my advice)

This list is my suggestion, not a Microsoft procedure:

1. Run `nslookup` for the exact server name in the log. The log tells you which URL failed.
2. If the name is the WSUS server, test from another machine on the same network segment to see whether the problem is the device or the network.
3. Compare the proxy settings of a working and a failing device.
4. For FoD on an older Windows version, skip the troubleshooting and go to media, because WSUS will not deliver the package.

## Related

- [Windows Update for Business](https://www.m365.fm/entity/windows-update-for-business/)
- [Windows Server](https://www.m365.fm/entity/windows-server/)

## Sources

- [Error Code 0x8024402C When You Try to Install a Windows Update or a Feature on Demand (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/windows-client/installing-updates-features-roles/error-0x8024402c-installing-update-feature-on-demand)
