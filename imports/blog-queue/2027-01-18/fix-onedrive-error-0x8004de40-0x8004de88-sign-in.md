---
title: "Fix OneDrive Sign-In Error 0x8004DE40 or 0x8004DE88"
summary: "OneDrive error 0x8004DE40 or 0x8004DE88 means the client has trouble connecting to the cloud when signing in. Learn points to TLS 1.2 and cipher suites on Windows 10, then dsregcmd leave and join, and a OneDrive reset. Follow the documented order and see what each step changes."
status: review
publish: false
author: mirko-p
date: 2027-01-18
topics: [onedrive, onedrive-sync-engine, tls-inspection]
keypoints:
  - "Both codes mean OneDrive has trouble connecting to the cloud while signing in, per Learn."
  - "First verify the internet connection and review the TLS 1.0 and 1.1 deprecation."
  - "On Windows 10, put the four Azure Front Door TLS 1.2 cipher suites at the top of the order with Group Policy or Enable-TlsCipherSuite."
  - "Learn also says to enable TLS 1.0, 1.1 and 1.2 in Internet Options, then restart, then try dsregcmd leave and join on the corporate network."
  - "For older Windows versions Learn offers the Easy Fix tool and a KB article; for all computers it lists a OneDrive reset."
faq:
  - q: "What do the two error messages say?"
    a: "0x8004de40 shows OneDrive Cannot sign in with a message that login was either interrupted or unsuccessful. 0x8004de88 shows We cannot sign into your account, please try again later. Learn says both mean OneDrive has trouble connecting to the cloud."
  - q: "Which cipher suites does Learn name?"
    a: "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384, TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256, TLS_DHE_RSA_WITH_AES_256_GCM_SHA384 and TLS_DHE_RSA_WITH_AES_128_GCM_SHA256, which Azure Front Door supports for TLS 1.2. They should be at the top of the cipher suite order."
  - q: "How do I move a cipher suite to the top?"
    a: "Learn offers Group Policy or the PowerShell command Enable-TlsCipherSuite with the Name and Position 0, then verification with Get-TlsCipherSuite."
  - q: "What does dsregcmd do here?"
    a: "As a last step on Windows 10, Learn says to run dsregcmd /leave and then dsregcmd /join in an elevated Command Prompt while on the corporate network, restart, and sign in again."
  - q: "Is there a fix for every computer?"
    a: "Learn lists resetting OneDrive under steps for all computers. It also lists operating system specific steps for Windows 10 and for older versions."
---

OneDrive error 0x8004de40 or 0x8004de88 appears when the sync client cannot sign in because it has trouble connecting to the cloud. Microsoft Learn tells you to verify the internet connection and review the TLS 1.0 and 1.1 deprecation, then gives operating system specific steps: for Windows 10, cipher suites, TLS settings and a device re-registration with `dsregcmd`, and for all computers, a OneDrive reset. This article keeps Learn's order.

## What you see

Learn lists two messages:

- **0x8004de40:** OneDrive Cannot sign in, with the text that login was either interrupted or unsuccessful.
- **0x8004de88:** We cannot sign into your account, please try again later.

The page says the meaning is the same for both: OneDrive is having trouble connecting to the cloud.

## First checks

Learn starts with two steps that apply everywhere:

1. Verify that the internet connection works.
2. Review the deprecation of TLS 1.0 and 1.1, because the connection to Microsoft 365 services expects TLS 1.2.

If the machine cannot reach the internet at all, the rest of the page does not apply.

## Windows 10

Learn gives three solutions. They are cumulative, so go in order.

### Solution 1: cipher suites for TLS 1.2

Learn names four cipher suites that Azure Front Door supports for TLS 1.2:

- TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
- TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
- TLS_DHE_RSA_WITH_AES_256_GCM_SHA384
- TLS_DHE_RSA_WITH_AES_128_GCM_SHA256

The step is to put them at the top of the cipher suite order. Learn offers two ways: Group Policy, or PowerShell with a command of this form:

```powershell
Enable-TlsCipherSuite -Name "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384" -Position 0
```

You then verify the order with `Get-TlsCipherSuite`. The command in Learn's example places one suite at position 0, so repeat it for each suite you want at the top, and check the resulting order with the verification command.

### Solution 2: enable TLS in Internet Options

Run `inetcpl.cpl`, go to the **Advanced** tab and enable TLS 1.0, TLS 1.1 and TLS 1.2. This is what Learn says, even though the page also tells you to review the deprecation of the older versions. I read the page as listing the setting as a troubleshooting step and not as a long-term recommendation to keep old protocols on, but the page does not say so.

### Solution 3: restart and re-register the device

Restart the computer. If the error remains, open an elevated Command Prompt while the device is on the corporate network and run:

```text
dsregcmd /leave
dsregcmd /join
```

Then restart again and sign in to OneDrive. This changes the device's registration state, so involve whoever manages device identity before you do it on a managed fleet.

## Older Windows versions

For Windows 8, Windows 7, Windows Server 2012 and Windows Server 2008 R2, Learn offers the Easy Fix tool, which sets the registry keys for TLS 1.1 and 1.2, plus a KB article for Windows 8 (KB 3140245). It also suggests considering disabling the DHE cipher suites. In my advice, check whether these operating systems are still supported in your environment before you invest time in them.

## All computers: reset OneDrive

Learn lists resetting OneDrive as a step for all computers. Use the reset instructions on the page. I did not repeat them here because the reset has its own side effects for sync state, which the page explains.

## Working through it

This section is my advice, not a Microsoft statement.

1. **Confirm the code first.** Both codes are covered by one page, so match the exact text on screen to the two messages above.
2. **Check the network path before the client.** A proxy or TLS inspection device that interferes with TLS 1.2 would produce the same symptom. Learn does not discuss this, so treat it as a hypothesis to test, not a documented cause.
3. **Read the current cipher suite order before changing it.** Run `Get-TlsCipherSuite` and save the output, so you can restore the old order if needed.
4. **Prefer Group Policy for many devices.** The PowerShell command works on one device at a time.
5. **Leave the dsregcmd step for last.** It affects device registration, while the earlier steps only change TLS settings.
6. **Record what fixed it.** If one step solves the problem on one device, the same step may solve the rest of the affected group.

## Why TLS appears in a sign-in error

This section is my advice, not a Microsoft statement. The page points at TLS because the sign-in call needs a secure channel to the service. If the client and the service cannot agree on a protocol version and cipher suite, the sign-in fails before any account check happens, and the client shows a generic message about connecting. That explains why a mismatch in cipher suite order can look like a sign-in problem even when the account is fine.

## What the page does not cover

I read the page as published. It does not describe behavior on current Windows 11 builds, it does not list proxy settings, and it does not say how to roll back the cipher suite changes. For those cases, use Microsoft's general guidance on TLS and your network team's documentation.

## Keeping track of what you changed

This section is my advice, not a Microsoft statement. The steps in Learn touch several layers: the cipher suite order, the Internet Options protocol settings, device registration and the OneDrive client itself. If you try them one after another on a single computer, note the time and result of each. When the problem disappears, you know which layer was responsible, and you can apply only that change to other computers instead of all of them. If nothing helps, the notes also make a support case faster, because they show what was already tried and with what outcome.

## Related

- [OneDrive](https://www.m365.fm/entity/onedrive/)
- [OneDrive sync engine](https://www.m365.fm/entity/onedrive-sync-engine/)
- [TLS inspection](https://www.m365.fm/entity/tls-inspection/)

## Sources

- [Error Code 0x8004de40 or 0x8004de88 when signing in to OneDrive - SharePoint (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/sharepoint/sync/error-0x8004de40-in-onedrive)
