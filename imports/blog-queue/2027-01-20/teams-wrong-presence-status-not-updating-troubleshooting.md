---
title: "Teams Shows the Wrong Presence Status or Does Not Update: Troubleshooting"
summary: "Teams stays on Away after you return to your desk? How presence is calculated, which two Microsoft tests find the cause, and which documented behaviors (mobile app, on-premises mailbox, manual status) explain a stale status."
status: review
publish: false
author: mirko-p
date: 2027-01-20
topics: [teams, outlook]
keypoints:
  - "Learn describes the typical symptom: Teams shows Away after the desktop was idle and does not switch back to Available when you resume activity."
  - "Two tests find the cause: the Teams Presence Based on Calendar Events connectivity test, and the Teams Presence diagnostic in the Microsoft 365 admin center."
  - "A locked computer, idle or sleep mode, or active use of the Teams mobile app instead of the desktop all count as desktop inactivity."
  - "For users with an on-premises mailbox, Learn says presence delays of up to one hour are expected."
  - "A manually set status stays until its duration ends: indefinitely for Appear offline, 1 day for Busy or Do not disturb, 7 days for other statuses."
faq:
  - q: "Why does Teams still show Away after I am back at my computer?"
    a: "Learn lists this as the typical symptom. Presence changes to Away when the desktop is inactive for more than five minutes and should return to Available when activity resumes. Inactivity includes a locked computer, idle or sleep mode, and using the Teams mobile app instead of Teams on the desktop. If the status does not recover, run the connectivity test or the admin center diagnostic that Learn describes."
  - q: "Which tools does Microsoft provide to find the cause?"
    a: "Learn names two. Anyone can run the Teams Presence Based on Calendar Events test in the Microsoft Remote Connectivity Analyzer. Administrators can run the Teams Presence diagnostic in the Microsoft 365 admin center. Learn says both tools are unavailable for some government and sovereign environments, so check the notes on the page for your cloud."
  - q: "Can presence be delayed for users with an on-premises mailbox?"
    a: "Yes. The presence article on Microsoft Learn states that for users whose mailbox is hosted on-premises, presence delays of one hour at most are expected. The page does not explain the mechanism in detail, so treat this as a known limit and not as a fault by itself."
  - q: "How long does a manually set status last?"
    a: "According to Microsoft Learn, if a user sets no duration, Appear offline stays indefinitely, Busy and Do not disturb stay for 1 day, and any other status stays for 7 days. A user can also set a duration when choosing the status."
  - q: "Does the status depend on which device I use?"
    a: "Learn says that when a user is signed in on two or more devices, the device where they were active most recently determines presence. On mobile, presence becomes Away when the app is in the background and Offline after 24 hours of inactivity."
---

When Teams shows Away after you return to your desk, or any other status that does not match reality, the first step is to separate normal behavior from a fault. Microsoft documents several cases where a delayed or unexpected status is expected. If none of them apply, Microsoft Learn points to two tests: the Teams Presence Based on Calendar Events connectivity test, which anyone can run, and the Teams Presence diagnostic in the Microsoft 365 admin center, which administrators run.

## What the problem looks like

Learn describes the symptom this way. Presence changes to **Away** when the desktop is inactive for more than five minutes. When activity resumes on the desktop, the status does not change back to **Available**.

Learn counts these situations as desktop inactivity:

- You lock your computer.
- The computer enters idle or sleep mode.
- You are actively using the Teams mobile app instead of Teams on the desktop.

The last point matters. If you are working on your phone, the desktop is inactive by this definition, so the status logic follows the phone.

## Rule out documented behavior first

The presence article for admins describes how Teams calculates status. These rules explain many reports:

- **Activity, app state and calendar drive the status.** Normally the status comes from user activity (Available or Away), the state of the Teams app (for example In a call or Presenting) and the Outlook calendar (for example In a meeting).
- **Computers and phones behave differently.** On a computer, presence becomes Away if the user is inactive for a few minutes or the computer is locked, and becomes Offline when the computer enters sleep mode. On a mobile device, presence becomes Away whenever the app is in the background, and Offline after 24 hours of inactivity.
- **The most recently active device wins.** With two or more devices signed in, the device where the user was active most recently determines presence.
- **Manual status has a lifetime.** Users can choose any status that is less available than the calculated one, and during a call or meeting any status. Without a duration, the manual status lasts indefinitely for Appear offline, 1 day for Busy or Do not disturb, and 7 days for any other status.
- **On-premises mailboxes add delay.** For users whose mailbox is hosted on-premises, Learn says presence delays of one hour at most are expected.

If someone appears Busy for a day or Away for a week, check whether a manual status is still active before you open a ticket.

## Method 1: Run the connectivity test

Both administrators and non-administrators can run the **Teams Presence Based on Calendar Events** test in the Microsoft Remote Connectivity Analyzer. It verifies the requirements for updating a user's presence from calendar events in Outlook. Learn notes that the tool is not available for the GCC and GCC High Microsoft 365 Government environments.

1. Open a web browser and go to the Teams Presence Based on Calendar Events test on testconnectivity.microsoft.com.
2. Sign in with the credentials of the affected user account.
3. Enter the verification code that is displayed, and select **Verify**.
4. Select the checkbox to accept the terms of agreement, and then select **Perform Test**.

When the test finishes, the page lists the checks that ran and whether the test succeeded, failed, or succeeded with warnings. Learn says to select the provided links for details about warnings and failures and how to resolve them.

## Method 2: Run the self-help diagnostic (admins)

Administrators can run the **Teams Presence** diagnostic in the Microsoft 365 admin center. It verifies the requirements for displaying a user's presence in Teams. Learn says the feature is not available for Microsoft 365 Government, Microsoft 365 operated by 21Vianet or Microsoft 365 Germany.

1. Select **Run Tests** on the Learn page. This populates the diagnostic in the Microsoft 365 admin center.
2. In the **Username or Email** field, enter the email address of the affected user, and select **Run Tests**.

## Resolution

The troubleshooting page keeps the resolution short. After the diagnostic finishes, select the provided links to resolve the issues it found. The page does not list individual fixes of its own, so the output of the test or diagnostic is your guide.

## A short checklist (my advice)

This order is my suggestion, not a Microsoft procedure:

1. Ask whether the user was on the phone app, locked the screen or let the computer sleep. These count as inactivity.
2. Ask whether a status was set manually, and if so, when.
3. For on-premises mailboxes, wait for the documented delay before assuming a fault.
4. Run the connectivity test with the affected account.
5. As an admin, run the Teams Presence diagnostic and follow its links.

## Privacy and external visibility

If colleagues in another organization see a different status than your own people do, the presence article also covers external access settings and privacy mode. Privacy mode keeps presence from being shared outside your organization regardless of external access settings. Learn gives the PowerShell setting `Set-CsPrivacyConfiguration -Identity global -EnablePrivacyMode $True` to turn it on and says changes can take several hours to propagate. That is another reason a status can look different from what the user expects.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Microsoft Outlook](https://www.m365.fm/entity/outlook/)

## Sources

- [The correct presence status isn't reflected in Teams (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/microsoftteams/teams-im-presence/presence-not-show-actual-status)
- [User presence in Teams (Microsoft Learn)](https://learn.microsoft.com/microsoftteams/presence-admins)
