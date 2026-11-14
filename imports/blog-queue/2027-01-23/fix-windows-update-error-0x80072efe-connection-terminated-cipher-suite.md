---
title: "Fix Windows Update Error 0x80072EFE: Connection Terminated and Cipher Suite Problems"
summary: "Windows Update error 0x80072EFE means the connection with the server was terminated abnormally. After network and proxy checks, Microsoft Learn points to the cipher suite registry key. Read the log, check the two named suites, adjust their order, restart and test."
status: review
publish: false
author: mirko-p
date: 2027-01-23
topics: [windows-update-for-business]
keypoints:
  - "0x80072EFE is WININET_E_CONNECTION_ABORTED: the connection with the server was terminated abnormally. It points to network, proxy or TLS configuration."
  - "In the Windows Update log, repeated FAILED 80072EFE lines and retries suggest a network-related issue."
  - "Check the cipher suites under HKLM SOFTWARE Policies Microsoft Cryptography Configuration SSL 00010002. Learn names two suites and says at least one must be present."
  - "If suites are present but low in the list, try moving them higher. If one is missing, add it manually, in the right order."
  - "Restart the computer, then retry in Windows Update with Check for updates. Learn applies this to Windows 10 or later and Windows Server 2016 and later."
faq:
  - q: "What does 0x80072EFE mean?"
    a: "The Windows error table entry in the Learn log example reads WININET_E_CONNECTION_ABORTED: the connection with the server was terminated abnormally. Learn says the Windows Update error typically indicates a connection issue between your computer and the Windows Update servers. Causes include network problems, proxy settings or TLS configuration issues."
  - q: "When should I look at cipher suites?"
    a: "After you have verified other network components. Learn says the issue can also be related to your cipher suite configuration. If specific cipher suites are configured under the registry key HKLM SOFTWARE Policies Microsoft Cryptography Configuration SSL 00010002, they might prevent the Windows Update client from establishing a secure connection."
  - q: "Which cipher suites does the page tell me to check?"
    a: "It lists TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384 and TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA256, and says at least one of them must be in your configuration. My advice: compare the names with the supported suite list for your Windows version in the Schannel documentation."
  - q: "What do I do if the suites are present but the error stays?"
    a: "Adjust the order. Learn says the sequence of the suites can affect their selection during the handshake. In Registry Editor, open the key, locate the suites and, if they are lower in the list, move them higher or to the top. If one is missing, add it manually in the appropriate order, then restart."
  - q: "Which Windows versions does the page cover?"
    a: "It states that it applies to Windows 10 or later, Windows Server 2016 and later versions of Windows."
---

Windows Update error 0x80072EFE is a connection error. Microsoft Learn describes it as typically indicating a problem between your computer and the Windows Update servers, caused by network problems, proxy settings or Transport Layer Security (TLS) configuration issues. If you have already verified the network side, the Learn page has a specific next check: the cipher suite configuration in the registry. It applies to Windows 10 or later and Windows Server 2016 and later.

## Step 1: Read the Windows Update log

The page shows a log pattern. Requests to the update service repeat with failures like these:

- `FAILED [80072EFE] Send request`
- `FAILED [80072EFE] WinHttp: SendRequestToServerForFileInformation (retrying with default proxy)`
- `FAILED [80072EFE] Library download error. Will retry. Retry Counter:0` and then `1`

The requests go to a URL on `slscr.update.microsoft.com`. Learn says the repeated failures and retries suggest a network-related issue. The last line of the example is the error table entry: `0x80072efe -2147012866 WININET_E_CONNECTION_ABORTED The connection with the server was terminated abnormally`.

So the entry means the connection was aborted. It says nothing about the update itself, which is my reading.

## Step 2: Verify the cipher suite configuration

If specific cipher suites are set in the registry key below, they might prevent the Windows Update client from building a secure connection:

`HKLM\SOFTWARE\Policies\Microsoft\Cryptography\Configuration\SSL\00010002`

Learn lists these cipher suites to check, written as on the page:

- `TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384`
- `TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA256`

Make sure at least one of them is present. The page links to the Cipher Suites in TLS/SSL (Schannel SSP) article.

That Schannel article explains that a cipher suite is a set of cryptographic algorithms, one each for key exchange, bulk encryption and message authentication. It also says that different Windows versions support different TLS cipher suites and priority order, and it links one page of supported suites per Windows version.

## Step 3: Adjust the cipher suite order

If the required suites are present and the error remains, the order might matter, because the sequence can affect which suite is selected in the handshake. Learn's steps:

1. Press Windows key + R, type `regedit` and press Enter.
2. Go to `HKLM\SOFTWARE\Policies\Microsoft\Cryptography\Configuration\SSL\00010002`.
3. Find the suites from Step 2. If they are present but low in the list, try moving them higher, or even to the top.
4. If a suite is missing, add it manually: right-click the registry key, select **Modify**, and enter the correct suite name in the appropriate order.

## Step 4: Restart

Restart the computer for the change to take effect.

## Step 5: Test Windows Update

After the restart, open **Settings** > **Update & Security** > **Windows Update** and select **Check for updates**.

## Quick reference

| Step | What to do | Where |
| --- | --- | --- |
| 1 | Confirm repeated 80072EFE failures and retries | Windows Update log |
| 2 | Check that at least one of the two named suites is present | `HKLM\SOFTWARE\Policies\Microsoft\Cryptography\Configuration\SSL\00010002` |
| 3 | Move the suites higher, or add a missing suite in the right order | Registry Editor |
| 4 | Restart the computer | Windows |
| 5 | Check for updates again | Settings, Windows Update |

## What the page does not cover

The page is short and starts from the assumption that you have already checked other network components. It does not give a procedure for those checks, for proxy settings or for how the registry key gets populated on your devices. The key sits under `Policies`, which suggests that a policy or a script wrote it. That reading, and the advice to look for the source before you edit one machine by hand, are mine and not Learn's.

## A short order of work (my advice)

This is my suggestion, not a Microsoft procedure:

1. Confirm that the error is a connection problem first. The log pattern of repeated 80072EFE lines is the sign the page shows.
2. Check whether the same device can reach the update service from a different network. If it can, the network or proxy is the likelier cause.
3. Look at the registry key from Step 2 on the failing device and on a working one, and compare the lists.
4. Compare the suite names with the supported list for your Windows version in the Schannel documentation before you type anything in. A typing error in a suite name is easy to make.
5. If a Group Policy or MDM setting writes the key, fix it there, so the change survives the next policy refresh.
6. Change one thing at a time, restart, and test, so you know which change helped.

## Related

- [Windows Update for Business](https://www.m365.fm/entity/windows-update-for-business/)

## Sources

- [Troubleshoot Windows Update error 0x80072EFE with cipher suite configuration (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/windows-client/installing-updates-features-roles/troubleshoot-windows-update-error-0x80072efe-with-cipher-suite-configuration)
- [Cipher Suites in TLS/SSL (Schannel SSP) (Microsoft Learn)](https://learn.microsoft.com/windows/win32/secauthn/cipher-suites-in-schannel)
