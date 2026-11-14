---
title: "Fix Teams Sign-In Error 0xCAA70004 and 0xCAA70007: Event Viewer and Network Checks"
summary: "Teams sign-in errors 0xCAA70004 and 0xCAA70007 point to Microsoft's article on connection problems after updating Office 2016 build 16.0.7967. That archived page covers the broker plug-in, network blocks, repeated prompts and device state, and this guide walks through its checks."
status: review
publish: false
author: mirko-p
date: 2027-01-19
topics: [teams, microsoft-365-apps, entra-id]
keypoints:
  - "Learn's Teams sign-in page says that 0xCAA70004 and 0xCAA70007, or the same problem in other Office apps, are covered by the article on Office 2016 build 16.0.7967 connection issues."
  - "That article is archived, and it describes sign-in through Web Account Manager on Windows 10, with advice to update to the latest build."
  - "The archived text names the pattern 0x?AA7???? and 0xCAA70007 with the message You'll need the internet for this; it does not list 0xCAA70004 by name."
  - "Check Event Viewer under Applications and Services Logs, Microsoft, Windows, AAD, Operational, then test login.microsoftonline.com in the browser."
  - "Do not block Microsoft.AAD.BrokerPlugin.exe, backgroundTaskHost.exe or login.microsoftonline.com."
faq:
  - q: "What do these two codes mean?"
    a: "Learn's Teams sign-in article lists them and sends you to the connection issues article for Office 2016 build 16.0.7967. The archived article ties the sign-in failure to Web Account Manager connectivity and device state rather than to Teams itself."
  - q: "Is 0xCAA70004 described anywhere on that page?"
    a: "I did not find 0xCAA70004 spelled out in the archived article. It shows the pattern 0x?AA7???? and the specific code 0xCAA70007, so 0xCAA70004 falls under the same pattern, which is my reading."
  - q: "Which message goes with 0xCAA70007?"
    a: "The archived article says the message is You'll need the internet for this, even if the device is online."
  - q: "What if the app keeps asking for credentials?"
    a: "The article lists TPM errors, a disabled device (AADSTS135011) and a deleted device (AADSTS50155) as causes, with manual recovery steps using dsregcmd."
  - q: "Is this still relevant on supported systems?"
    a: "The archived article is written for Windows 10, whose support ended on October 14, 2025. Treat it as a reference for the checks, and check your current Windows and Microsoft 365 Apps versions."
---

Teams sign-in errors 0xCAA70004 and 0xCAA70007 are not explained on Teams pages themselves. Learn's article on fixing Teams sign-in errors lists them and says that these codes, or the same issue in other Office apps, are covered by an article on connection issues after updating to Office 2016 build 16.0.7967. That article is archived. Its checks are still a practical starting list: look at the Event Viewer entries for the sign-in broker, test the sign-in endpoint in a browser, and confirm that nothing blocks the broker components or Microsoft's sign-in host.

## What the Teams page says

On the Teams sign-in errors page, a row for 0xCAA70004 and 0xCAA70007 sends you to the connection issue article instead of giving steps of its own. The same applies if the same issue appears in other Office apps.

## What the archived article says

The archived article states that it is archived, and describes the situation as follows:

- Starting with Office 2016 build 16.0.7967, Office apps on Windows 10 use Web Account Manager (WAM) to sign in.
- The recommended first step is to update to the latest build, and to make sure Windows 10 22H2 is in use.

Note on dates: Windows 10 support ended on October 14, 2025, so the Windows 10 advice is historical for most readers. Check which Windows version and which Microsoft 365 Apps build the affected device runs before you apply any of the steps.

I did not find 0xCAA70004 by name in that text. The article describes the pattern of codes 0x?AA7????, along with 0xCAA70007 and its message. I read 0xCAA70004 as belonging to that pattern, but that is my interpretation, not a Microsoft statement.

## Symptom 1: You'll need the internet for this (0xCAA70007)

The article gives these checks:

1. **Event Viewer.** Open Applications and Services Logs, Microsoft, Windows, AAD, Operational. Look for entries with the operation XMLHTTPWebRequest and error codes of the form 0x?AA7????, 0x?AA8????, 0x?AA3????, 0x102 or 0x80070102. These point to a network-level cause.
2. **Browser test.** Open login.microsoftonline.com in Microsoft Edge, and also in an InPrivate window, to see whether the endpoint is reachable.
3. **Do not block the broker.** Make sure that Microsoft.AAD.BrokerPlugin.exe and backgroundTaskHost.exe are not blocked by a firewall or proxy.
4. **Do not block the sign-in host.** login.microsoftonline.com must be reachable.

## Symptom 2: repeated credential prompts

The article lists these causes and fixes:

- **TPM problems**, visible as event codes of the forms 0x?028????, 0x?029???? and 0x?009????.
- **A disabled device**, shown as AADSTS135011.
- **A deleted device**, shown as AADSTS50155.

For manual recovery, it uses `dsregcmd /status` to look at the device registration state, and then:

- For hybrid joined devices, run `dsregcmd /leave` and let the device register again.
- For registered devices, remove the work account and add it again.
- For Microsoft Entra joined devices, the article describes a sequence of backing up data, creating a local admin account, disconnecting the device from the organization and reconnecting it.

In my view, these steps change the device identity, so involve the device owner and your identity admins before you use them.

## Symptoms 3 and 4

- **Navigation to non-SSL destination.** The article says to enable HTTPS on the identity servers involved.
- **Non-persistent VDI with federated single sign-on.** The article describes a ULS error 0xc0f10005 and says to submit a support request.

## A practical order of work

This section is my advice, not a Microsoft statement.

1. **Capture the exact code and the app.** Check whether other Office apps on the same device fail the same way. If they do, the problem is below Teams.
2. **Test the network path first.** The cheapest check is the browser test against login.microsoftonline.com, on the affected device and on the same network.
3. **Check the proxy and firewall.** Look for rules that apply to the broker executables or to the sign-in host, and compare the failing network with a working one.
4. **Read the AAD Operational log.** Match the code in the event to the patterns in the article, so you know whether you are in the network branch or the device branch.
5. **Check device state in Entra.** If the log shows a disabled or deleted device, fix the device object before you touch the client.
6. **Update before you reset.** Install pending updates for Windows and Microsoft 365 Apps, then test again.
7. **Use the recovery steps last.** Leaving and rejoining a device is disruptive. Use it when the evidence points to device registration.
8. **Record what fixed it.** Add the code, the cause and the fix to your internal notes so the next case starts further along.

## Cases to separate

This section is my advice, not a Microsoft statement.

- **One user, one device.** Start with device state, TPM and cached accounts.
- **Many users on one network.** Start with the proxy, DNS and firewall.
- **Only VDI sessions.** Look at the non-persistent VDI note in the article, and at how your profile and token caching work.
- **Only after an update.** Compare the Office build with the one that worked, and note any change to security software.

## What I did not read

I read the Teams sign-in errors page and the archived article. I did not read the separate Learn pages on dsregcmd, TPM troubleshooting or the Web Account Manager, so I do not describe their details.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Microsoft 365 Apps](https://www.m365.fm/entity/microsoft-365-apps/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)

## Sources

- [Fix Teams sign-in errors - Microsoft Teams (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/microsoftteams/teams-sign-in/resolve-sign-in-errors)
- [Connection Issues When Signing In After Updating to Office 2016 Build 16.0.7967 (Microsoft Learn)](https://learn.microsoft.com/previous-versions/troubleshoot/microsoft-365/microsoft-365-apps/activation/connection-issue-when-sign-in-office-2016)
