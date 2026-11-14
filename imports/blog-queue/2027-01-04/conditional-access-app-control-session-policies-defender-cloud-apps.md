---
title: "How to Set Up Conditional Access App Control and Session Policies in Defender for Cloud Apps"
summary: "Set up Conditional Access App Control: the Entra Conditional Access policy, the Defender for Cloud Apps access and session policies, session control types, actions, caveats and testing, as documented on Learn."
status: review
publish: false
author: mirko-p
date: 2027-01-04
topics: [microsoft-defender-for-cloud-apps, conditional-access]
keypoints:
  - "Setup has two parts: an Entra Conditional Access policy with Use Conditional Access App Control, then access or session policies in Defender for Cloud Apps."
  - "Both policy types need Defender for Cloud Apps and Microsoft Entra ID P1. Start the Conditional Access policy in Report-only mode."
  - "Path: Cloud Apps > Policies > Policy management > Conditional Access tab > Create policy > Access policy or Session policy."
  - "Session control types are Monitor only, Block activities, Control file download and Control file upload, each with its own actions."
  - "Session controls apply only to browser-based interactive sessions. The Teams desktop app is not supported for session controls."
faq:
  - q: "What is the difference between access and session policies?"
    a: "Learn says access policies allow or block access completely, while session policies allow access and monitor or limit activities within the session. For example, an access policy can block an app on unmanaged devices, and a session policy can block downloads of sensitive files to unmanaged devices."
  - q: "What licenses are required?"
    a: "Learn lists Microsoft Defender for Cloud Apps and Microsoft Entra ID P1, stand-alone or as part of another license, plus the license your IdP needs if you use a non-Microsoft IdP."
  - q: "How do sessions get routed to Defender for Cloud Apps?"
    a: "Through a Microsoft Entra Conditional Access policy with the Use Conditional Access App Control session control. Microsoft Edge uses in-browser protection. Other browsers are redirected through a reverse proxy, and the URL gets an mcas.ms suffix."
  - q: "Which actions can a session policy take?"
    a: "Audit, Block and, for file download only, Protect. Learn also lists step-up authentication as a preview option and block per activity such as print or copy."
  - q: "Which sessions are not covered?"
    a: "Learn says session controls apply only to browser-based interactive sessions. Installed apps with non-interactive sign-in flows cannot use access controls, and the Teams desktop app is not supported for session controls."
---

Conditional Access App Control works in two steps. First a Microsoft Entra Conditional Access policy sends sessions to Defender for Cloud Apps. Then you create an access policy or a session policy in the Defender portal that decides what happens in those sessions. This guide follows three Microsoft Learn pages: the overview, the access policy page and the session policy page.

## How it works

Microsoft Edge uses in-browser protection and shows a lock icon in the address bar. Other browsers are redirected through a reverse proxy to Defender for Cloud Apps, and their URLs get an `*.mcas.ms` suffix. To prevent bypass, Learn says to configure access policies that block native client access and allow only browser-based sessions. No software is installed on the device, which suits unmanaged devices and partner users. Policies apply at the application level, not the file level.

## Prerequisites

- Microsoft Defender for Cloud Apps and **Microsoft Entra ID P1**, stand-alone or as part of another license. If you use a non-Microsoft IdP, also its own license.
- Apps onboarded to Conditional Access App Control. Entra ID apps are onboarded automatically. Non-Microsoft IdP apps must be onboarded manually.
- At least **Conditional Access Administrator** to create the Conditional Access policy. The access policy page does not state a role for creating the Defender policy.

## Step 1: create the Conditional Access policy

1. Sign in to the Microsoft Entra admin center as at least Conditional Access Administrator.
2. Go to **Entra ID** > **Conditional Access** > **Policies** > **New policy**.
3. Enter a name.
4. Under **Assignments** > **Users or workload identities**, include **All users** and exclude your emergency access accounts.
5. Under **Target resources** > **Resources (formerly cloud apps)**, include **Select resources** and pick the apps.
6. Optionally set **Conditions**.
7. Under **Access controls** > **Session**, select **Use Conditional Access App Control**, then **Select**.
8. Set **Enable policy** to **Report-only** and select **Create**. After you verify the results, change it to **On**.

Defender for Cloud Apps uses the enterprise app **Microsoft Defender for Cloud Apps - Session Controls**. Allow access to it. If you block all or selected apps, exclude it unless blocking it is intended. Include it in location-based policies so they work. Learn gives a Graph PowerShell snippet (`New-MgServicePrincipal` with the app ID 8a0c2593-9cbc-4f86-a247-beb7aab00d83) to create the service principal if it is missing.

## Step 2a: create an access policy

Path: Microsoft Defender > **Cloud Apps** > **Policies** > **Policy management** > **Conditional Access** tab > **Create policy** > **Access policy**.

1. Enter a **Policy name**, **Policy severity** and optional description. Keep the **Category** at Access control.
2. Under **Activities matching all of the following**, add filters: App, Client app, Device, IP address, Location, Registered ISP, User, User agent string and User agent tag. **Edit and preview results** shows matches.
3. Under **Actions**, choose **Audit** or **Block**.
4. Optionally configure alerts: an alert per match, email, a daily alert limit, and Power Automate.
5. Select **Create**.

If you omit the App filter, the policy applies to all apps marked **Enabled** under Settings > Cloud Apps > Connected apps > Conditional Access App Control apps.

## Step 2b: create a session policy

Same path, but choose **Create policy** > **Session policy**. You can start from a policy template or fill in everything.

| Session control type | What it does |
| --- | --- |
| Monitor only | Monitors user activity. It monitors only the Login activity |
| Block activities | Blocks activities selected with Activity type, such as print or clipboard cut, copy and paste |
| Control file download (with inspection) | Monitors downloads. Can be combined with block or protect |
| Control file upload (with inspection) | Monitors uploads. Can be combined with block |

For download and upload types you can filter files by sensitivity label, name, extension and size, and choose an inspection method under **Apply to (Preview)**. Actions:

- **Audit:** monitors activities and explicitly allows matching downloads.
- **Block:** blocks matching downloads, with optional email notice and a custom block message.
- **Protect:** applies a sensitivity label to the downloaded copy. Only with Control file download. It does not overwrite files that already have a label.
- Optional: always apply the action even if the data cannot be scanned.

Learn also lists step-up authentication as a preview option, which redirects the session to Entra Conditional Access for reevaluation, and malware blocking with the Microsoft threat intelligence engine.

## Caveats

- Session controls apply only to browser-based, interactive sessions. Apps with non-interactive sign-in flows cannot use access controls. Create an access policy in the Entra admin center too.
- The Teams desktop app is not supported for session controls. Block sign-in from the desktop app for targeted users and allow browser access.
- Apps must support TLS 1.2 or later.
- Policies on a host app such as Teams or Exchange do not cover resource apps such as SharePoint or OneDrive. Create separate policies.
- When two session policies conflict, the more restrictive one applies.
- Server-side blocking can make some apps unusable, and some activities are then secured only client-side.

## Test the setup

Sign out of existing sessions and sign in again with a test user that matches the policy. Try managed and unmanaged devices. Check that pages render and that uploads and downloads work. In the Defender portal, check **Cloud apps** > **Activity log**, where single sign-on log on events are Conditional Access app control events.

## What the pages do not say

Learn does not state the numeric daily alert limit, the exact license SKUs, how long matches take to appear beyond shortly, or whether preview features are generally available. Check current documentation for those.

## Typical mistakes

- Creating Defender policies without the Conditional Access policy that routes sessions.
- Moving the Conditional Access policy to On without Report-only testing.
- Blocking all apps and forgetting to exclude the Session Controls app.
- Assuming a Teams policy also protects SharePoint files.

## Related

- [Microsoft Defender for Cloud Apps](https://www.m365.fm/entity/microsoft-defender-for-cloud-apps/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)

## Sources

- [Conditional Access app control: overview (Microsoft Learn)](https://learn.microsoft.com/defender-cloud-apps/proxy-intro-aad)
- [Create Defender for Cloud Apps access policies (Microsoft Learn)](https://learn.microsoft.com/defender-cloud-apps/access-policy-aad)
- [Create Defender for Cloud Apps session policies (Microsoft Learn)](https://learn.microsoft.com/defender-cloud-apps/session-policy-aad)
