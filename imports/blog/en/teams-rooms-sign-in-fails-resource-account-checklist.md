---
title: "Teams Rooms Sign-In Fails or Shows No License: A Resource Account Checklist"
summary: "A Teams Rooms device says the room account could not be authenticated, shows Sync failed, or reports no license? Use the event logs, the sign-in test and seven account checks from Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [teams-rooms, conditional-access, exchange-online]
keypoints:
  - "Teams Rooms signs in to Exchange and to Teams. Meetings missing from the console usually point to Exchange, and a missing Join button usually points to Teams, according to Learn."
  - "Event ID 2001 in the Skype Room System log and Event ID 1098 in the Microsoft Entra ID log show the failing step and the AADSTS error code."
  - "Learn lists seven causes: MFA, Conditional Access, expired password, wrong credentials, network, missing mailbox and missing Teams Rooms license."
  - "Resource accounts need a Teams Rooms Pro or Basic license. Enterprise per-user suite licenses are not authorized on shared meeting devices."
  - "Neither of the two 2026 community threads reported a confirmed fix, so the steps here come from Learn, not from the threads."
faq:
  - q: "Where do I find out why a Teams Rooms device cannot sign in?"
    a: "Microsoft Learn names three places: the Teams Rooms Pro Management portal, where the Sign in (Exchange) and Sign in (Teams) signals show Unhealthy, the Event Viewer on the device, and the Microsoft Entra sign-in logs. On the device, Event ID 2001 under Skype Room System shows the Exchange and Teams sign-in status, and Event ID 1098 under the Microsoft Entra ID operational log shows the AADSTS error."
  - q: "Should a Teams Rooms resource account use multi-factor authentication?"
    a: "No. Learn says Teams Rooms resource accounts should not be configured to use MFA, and the authentication page says the device needs no user interaction and does not support interactive second-factor sign-in. Errors AADSTS50076 and AADSTS50079 in the logs mean MFA is applied to the account. Learn recommends other factors such as a compliant device or a known network location."
  - q: "Which license does a Teams Rooms device need?"
    a: "A Teams Rooms Pro or Teams Rooms Basic license, according to Learn. The licensing page says enterprise per-user Microsoft 365 suite licenses are not authorized on shared meeting devices. Basic licenses are limited to 25 and cannot license Teams panels."
  - q: "The error comes back after a reboot. What does that mean?"
    a: "In a February 2026 thread, an administrator reported that a reboot cleared the error for a while and it returned within about 48 hours. A moderator suggested that signing out and back in may help temporarily if the problem is token related. Learn does not describe this pattern. Look in the sign-in logs for the time the error returns and match the AADSTS code to the list in this article."
---

A meeting room is dark. The device shows that the room account could not be authenticated, or the Teams Rooms Pro Management portal shows a sign-in signal as unhealthy, or the console reports that no license was found. This article is a checklist for that situation.

It is based on two Microsoft Q&A threads from 2026 and on the current Microsoft Learn troubleshooting page for resource account sign-in. In the first thread (February 2026), a device reported "The room account couldn't be authenticated", and the message returned within 48 hours after each reboot. The poster also saw Sync failed, and the device was missing from the Pro Management portal. In the second thread (August 2026), a device reported no license found although a license was assigned. Switching between Pro and Basic did not help. Neither thread ended with a confirmed fix. A moderator in the first one gave a list of things to check, and an independent advisor in the second one pointed to a connectivity test. So the thread content is the scenario, and Learn is the source for the solution. This is not an official Microsoft procedure.

## How Teams Rooms signs in

According to Learn, a Teams Rooms device signs in to Exchange (Online or Server) and to Microsoft Teams. Exchange gives it the calendar. Teams lets it join meetings. The Pro Management portal at `https://portal.rooms.microsoft.com` watches both with the signals **Sign in (Exchange)** and **Sign in (Teams)**.

That split helps you read the symptoms:

- The console shows a banner that sign-in fails. Meetings are not listed, or the room name is missing. Learn says this usually means an Exchange sign-in failure.
- Meetings are listed, but the **Join** button is not available and you cannot start an unscheduled meeting. Learn says this usually means a Teams sign-in failure.

## Step 1: Read Event ID 2001

On the device, open Event Viewer and go to **Applications and Services Logs** > **Skype Room System**. Learn says the app checks every five minutes whether it is signed in to Teams and has network and Exchange connectivity. If one check fails, it logs Event ID 2001. The event text includes three fields that matter:

- **Exchange status**: sign-in status of the resource account in Exchange Online, or Exchange Server for on-premises mailboxes.
- **Signin status**: status in Skype for Business Server. It shows NotApplicable in Teams-only mode.
- **Teams Signin status**: status in Microsoft Teams.

One example in Learn shows an Exchange status with the code `80131500 : AADSTS50076` and a Teams sign-in status of Unhealthy. The AADSTS code is your first real clue.

## Step 2: Run the sign-in test

Learn describes an automated check in the Microsoft Remote Connectivity Analyzer, called **Microsoft Teams Rooms Sign in**. You need a Global Administrator account, and the tool is not available for GCC and GCC High. Sign in, enter the resource account's user name, select the device type in **Device Selection**, enter the verification code, accept the terms and select **Perform Test**. Each check comes back as succeeded, failed, or successful with warnings, with links for details. In the August 2026 thread, an independent advisor pointed to this same test.

## Step 3: Check the seven causes

Learn lists these manual checks. Use the AADSTS code from the device or from the Microsoft Entra sign-in logs.

**1. Multi-factor authentication.** Resource accounts should not use MFA. On the device, look in **Applications and Services Log** > **Microsoft** > **Windows** > **Microsoft Entra ID** > **Operational** for Event ID 1098. AADSTS50076 or AADSTS50079 means MFA applies to the account. In the sign-in log it shows as a failure with code 50076 or 50079. Remove the MFA requirement for this account, with your identity team.

**2. Conditional Access.** Event ID 1098 with AADSTS53003 means a Conditional Access policy blocks the sign-in. The sign-in log shows an interrupted sign-in with code 53003. Learn links to a page on supported Conditional Access and compliance settings for Teams Rooms. The authentication page adds that Windows does not know which account the Teams Rooms app uses, so device-level policies require the device to be enrolled in Intune.

**3. Expired password.** AADSTS50055 means the password expired. Reset the password, enter the new one in **Settings** on the device, and turn off password expiration for the account so it does not repeat.

**4. Wrong credentials.** AADSTS50126 means the user name or password is wrong. It can also show up some time after a password expired. Reset the password and update it in **Settings** on the device.

**5. Network.** Teams Rooms must reach the standard Microsoft 365 endpoints, and Learn says Teams Rooms does not support proxy authentication. If the sign-in log shows no attempts at all, the connection to the sign-in endpoints may be blocked. If the log shows a successful sign-in but the device still fails, check that the account has valid licenses and that Microsoft 365, Teams or Exchange endpoints are reachable.

**6. Room mailbox.** The account needs a mailbox. If Event 2001 shows an Exchange status of `GeneralError`, check the mailbox. Make sure the account is a resource account that is password enabled. For an Exchange hybrid setup, make sure the on-premises mailbox is synchronized.

**7. Teams Rooms license.** Learn says the device needs Teams Rooms Pro or Teams Rooms Basic. To confirm a missing license, download the device diagnostic logs, extract the zip, open `App\Microsoft\Teams\Logs.txt` and look for this line: `errorCode: FailedAuthentication, errorStep: get_skype_license, errorState: licenseError`. You can also sign in to Teams on the web with the account. If it says an admin must enable Microsoft Teams for the account, the license or the Teams service plan is missing. The fix is to assign a Pro or Basic license and make sure the Teams app is applied through that license.

## About the license thread

The August 2026 asker had assigned a license and had switched between Pro and Basic. Learn gives you points to verify before you blame the license itself:

- The Teams Rooms licensing page says devices should only get Teams Rooms Basic or Pro (legacy licenses are also valid), and that enterprise per-user suite licenses are not authorized on shared meeting devices.
- A license is meant for one room. Using the same account across devices that are not in the same room breaks the license terms.
- On the licensing page, the 48-hour figure appears for the move from the legacy Standard or Premium licenses to Basic or Pro. I did not find a general propagation time there. An AI-generated answer in the thread gave "up to 48 hours". Do not rely on that.
- Learn also says to avoid OneDrive for Business licenses on IT-managed room accounts.

A later comment in that thread described clearing the Teams cache and stored credentials on one vendor's device. It is specific to that device, the asker never confirmed it, and I do not include the steps. If you think the local cache is the problem, ask the device maker.

## About the 48-hour pattern and Sync failed

The February 2026 moderator suggested checking the room account for a password that never expires, no MFA, no Conditional Access rule that blocks non-compliant devices, and a Basic or Pro license. This agrees with Learn's list. The moderator also said that Sync failed can appear when Exchange sign-in fails while Teams meetings keep working. Learn does not use the words Sync failed, but it does split the symptoms by Exchange and Teams as described above. That poster later reported that the device was missing from the Pro Management portal and that the Teams admin center showed the device health as Critical. A second moderator said to check the last check-in time in Intune before enrolling the device again, and to open a support ticket. The poster did not report a result.

## Step 4: Verify

After the fix, wait for the next heartbeat and check:

1. The room console lists the day's meetings and the **Join** button works.
2. In the Pro Management portal, **Sign in (Exchange)** and **Sign in (Teams)** are healthy again.
3. The Event ID 2001 entries stop. Learn says the check runs every five minutes.

## Limits

- No community answer in the two threads is confirmed. Use Learn's list, not the thread claims.
- The Remote Connectivity Analyzer test needs a Global Administrator account and does not work in GCC or GCC High.
- If every check passes and the error returns, collect the device logs, the Event 2001 and 1098 entries and the sign-in log lines with times, and open a support case.

## Related

- [Microsoft Teams Rooms](https://www.m365.fm/entity/teams-rooms/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)
- [Exchange Online](https://www.m365.fm/entity/exchange-online/)

## Sources

- [Microsoft Learn: Resolve Teams Rooms resource account sign-in issues](https://learn.microsoft.com/en-us/microsoftteams/troubleshoot/teams-rooms-and-devices/teams-rooms-resource-account-sign-in-issues)
- [Microsoft Learn: Authentication in Microsoft Teams Rooms on Windows](https://learn.microsoft.com/en-us/microsoftteams/rooms/rooms-authentication)
- [Microsoft Learn: Microsoft Teams Rooms licensing](https://learn.microsoft.com/en-us/microsoftteams/rooms/rooms-licensing)
- [Microsoft Q&A: Teams room error (February 2026)](https://learn.microsoft.com/en-us/answers/questions/5789263/teams-room-error)
- [Microsoft Q&A: Teams Room license, no license found (August 2026)](https://learn.microsoft.com/en-us/answers/questions/5968569/teams-room-room-license-no-license-found)
