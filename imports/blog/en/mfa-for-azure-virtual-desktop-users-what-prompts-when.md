---
title: "MFA for Azure Virtual Desktop users: what prompts when"
summary: "Users see Microsoft Entra multifactor authentication prompts in Azure Virtual Desktop when a new access token is needed: at subscribe or feed refresh, at connection through the gateway, and at session host sign-in when single sign-on is on. This article maps each moment to the Entra app and setting that controls it."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [azure-virtual-desktop, avd-single-sign-on]
keypoints:
  - "Learn says users are prompted only when a new access token is requested from Microsoft Entra ID for a resource. Two apps matter: Azure Virtual Desktop for the service and Windows Cloud Login for session host sign-in with single sign-on."
  - "Once a connection is established, users are not prompted again, even if the session outlasts the sign-in frequency. A network disruption that forces the session to be re-established after that period triggers a new prompt."
  - "Sign-in frequency Every time is supported only on the Windows Cloud Login app. On the Azure Virtual Desktop app it causes constant prompts on feed refresh and diagnostics upload."
  - "With single sign-on, a session lock disconnects the session by default, and Conditional Access, including MFA and sign-in frequency, is re-evaluated at reconnect."
  - "Repeated prompts usually trace to mismatched sign-in frequency, legacy per-user MFA, a missing Windows Cloud Login policy, or the consent dialog that appears for each new session host."
faq:
  - q: "Will a user get an MFA prompt every time they open a remote desktop?"
    a: "Not necessarily. Microsoft Learn says users are prompted only when a new access token is needed. With periodic sign-in frequency, a connection launched within the period reuses the earlier authentication. With Every time on Windows Cloud Login, a new connection after about 5 to 10 minutes prompts again."
  - q: "Does a session that stays open for days keep prompting?"
    a: "No. Learn says that after a connection is established users are not prompted, even if it lasts longer than the sign-in frequency. A re-established session after a network disruption, or a reconnect after a session lock disconnect, is evaluated again."
  - q: "Why do some users see a prompt that is not MFA?"
    a: "With single sign-on, users see a dialog to allow the Remote Desktop connection when they connect to a new session host. Entra remembers up to 15 hosts for 30 days. Administrators can hide it with a trusted device group on the Windows Cloud Login service principal."
---

Microsoft Entra multifactor authentication prompts in Azure Virtual Desktop follow one rule: users are prompted only when a new access token is requested from Microsoft Entra ID for a resource. In practice that means at subscribe or feed refresh, at connection through the gateway, and, with single sign-on, at session host sign-in. This article maps each moment to the Entra app that evaluates it and to the setting that decides how often the prompt returns. How to design the policies themselves is a separate topic. Sources are listed at the end, retrieved on 17 November 2026.

## Two layers of authentication

Learn's authentication overview separates cloud service authentication from remote session authentication. Cloud service authentication is to the Azure Virtual Desktop service: subscribing to resources, connecting to the gateway when launching a connection, and sending diagnostic information. It runs against Microsoft Entra ID, and the resource is the **Azure Virtual Desktop** app, app ID `9cdead84-a844-4324-93f2-b2e6bb768d07`. This is where Conditional Access applies. Learn adds that the app was previously named Windows Virtual Desktop in tenants that registered the `Microsoft.DesktopVirtualization` resource provider before the display name changed, with the same app ID.

Remote session authentication is to the session host. With [single sign-on](/entity/avd-single-sign-on/) enabled, Windows signs the user in with an Entra token and a second app, **Windows Cloud Login** (`270efc09-cd0d-444b-a71f-39af4910ec45`), is evaluated. Without single sign-on, the client prompts for session host credentials on every connection unless the user saves them, and Learn recommends saving credentials only on secure devices. Learn also lists in-session authentication as a third layer, for applications and websites inside the remote session.

A third app, **Azure Virtual Desktop Azure Resource Manager Provider** (`50e95039-b200-4007-bc97-8d5790743a63`), retrieves the user feed only. Learn says not to select it in a Conditional Access policy that requires MFA.

## What prompts when

The table combines the authentication overview, the MFA article and the single sign-on article.

| Moment | What is evaluated | Prompt behavior |
|---|---|---|
| User subscribes or manually refreshes the resource list | Azure Virtual Desktop app | Reauthentication when the sign-in frequency period has elapsed |
| Background feed refresh and diagnostics upload | Azure Virtual Desktop app | After the period ends they fail silently until the user completes the next interactive Entra sign-in |
| Connection through the gateway | Azure Virtual Desktop app | Prompt when a new token is needed |
| Sign-in to the session host with single sign-on | Windows Cloud Login app | Prompt when a new token is needed |
| Sign-in to the session host without single sign-on | Session host credentials | Credential prompt on every connection unless saved in the client |
| First connection to a new session host with single sign-on | Consent dialog | Users see a dialog to allow the Remote Desktop connection |
| Reconnect after a session lock disconnect | Conditional Access re-evaluated | Can require MFA to return to the session |
| Session re-established after a network disruption | Whichever app needs a new token | New prompt if the configured sign-in frequency has passed |
| Established session that outlasts the sign-in frequency | None | No prompt |

When both apps are configured correctly, Learn says users see a single MFA prompt, if required, and then enter the session. If only the Azure Virtual Desktop app has a policy, the user is prompted at the service layer and again at the session host single sign-on layer.

## Sign-in frequency decides how often

Sign-in frequency is a session control in the Conditional Access policy. In the Microsoft Entra admin center it is under **Access controls**, **Session**, **Sign-in frequency**. There are two modes.

- **Periodic reauthentication** takes a value and a unit. Learn's example is 1 hour, which requires MFA if a connection is launched more than an hour after the last user authentication. Learn gives no recommended value and says to set it by your security requirements.
- **Every time** is supported only on the Windows Cloud Login app, and only when single sign-on is enabled. Learn says users are then prompted to reauthenticate when launching a new connection after 5 to 10 minutes since their last authentication.

Learn warns about one mistake: setting **Every time** on the Azure Virtual Desktop app instead of Windows Cloud Login causes constant MFA prompts on feed refresh and diagnostics upload. For the two apps, Learn recommends matching the policies except for the sign-in frequency, and for the Windows Cloud Login policy to match or exceed the frequency of the Azure Virtual Desktop policy. A mismatch is a documented cause of reprompts, because one app's session expires before the other.

An illustration with invented values. The Azure Virtual Desktop policy uses periodic reauthentication of 8 hours and the Windows Cloud Login policy uses 4 hours. Five hours after the last sign-in, the service token is still within its period but the session host sign-in is not, so a new connection prompts at the session host layer. Setting Windows Cloud Login to 8 hours or more, as Learn advises, removes that mismatch.

## Session lock and reconnect

With single sign-on, the default behavior when a remote session locks is to disconnect it. The user gets a dialog and can choose **Reconnect**. Learn lists the effects of disconnecting: Conditional Access policies, including MFA and sign-in frequency, are re-evaluated at reconnect; you can require MFA to return to the session and stop users from unlocking with a simple user name and password; and passwordless methods such as passkeys and FIDO2 are fully supported only when the session disconnects, not with the remote lock screen.

You change the behavior in Intune with the settings catalog: under **Administrative templates**, **Windows Components**, **Remote Desktop Services**, **Remote Desktop Session Host**, **Security**, the setting **Disconnect remote session on lock for Microsoft identity platform authentication**. Enabled disconnects the session, disabled shows the remote lock screen. For legacy protocols, the default is the remote lock screen, and users re-enter credentials when they reconnect. Learn lists minimum updates for this feature, for example KB5037770 for Windows 11. If users see repeated prompts after a lock, Learn's troubleshooting page says to configure the host pool so that locking disconnects the session.

## The consent dialog is not MFA

With single sign-on, users see a dialog to allow the Remote Desktop connection when connecting to a new session host. Entra remembers up to 15 hosts for 30 days before prompting again. Learn's troubleshooting page notes that this dialog looks like a sign-in prompt. You hide it by putting the session hosts in one or more Entra groups and adding the group IDs to a property on the Windows Cloud Login service principal. In the portal this is under **Devices**, **Remote connection configuration**, **Windows Cloud Login**, **Target device groups to enable SSO**, with up to 10 device groups. Learn recommends a dynamic group, which requires Microsoft Entra ID P1.

## Entra joined session hosts

Two points affect prompts on [Entra joined](/entity/avd-entra-join/) hosts. First, legacy per-user MFA together with Conditional Access causes the error "The sign-in method you're trying to use isn't allowed" or repeated prompts. Learn says to set per-user MFA to **Disabled** for the users under **Identity**, **Users**, **All users**, **Per-user MFA**, and to enforce MFA through Conditional Access. Second, if you do not want to restrict sign-in to strong methods such as Windows Hello for Business, exclude the **Azure Windows VM Sign-In** app from the policy. Learn also notes that on devices not registered with Entra, a "Stay signed in to all your apps" prompt can appear, and that users who choose to sign in to the app only may be prompted more often.

## Checking why a prompt appeared

Use the Entra sign-in logs, under **Identity**, **Monitoring & health**, **Sign-in logs**, and look at both apps. Learn notes that web client sign-ins show the client app ID `a85cf173-4192-42f8-81fa-777a763e6e2c`, because it is linked to the server app where the policy was set. See also [Microsoft Entra sign-in logs](/entity/microsoft-entra-sign-in-logs/). Learn's troubleshooting page also maps errors to causes, for example AADSTS50076 for MFA required by Conditional Access or per-user enforcement. Check that the user has a registered method and that the network and device meet the policy conditions.

## Related

- [Azure Virtual Desktop](/entity/azure-virtual-desktop/)
- [Conditional Access](/entity/conditional-access/)
- [Multifactor authentication](/entity/mfa/)
- [Windows App](/entity/windows-app/)

## Sources

All retrieved on 2026-11-17.

- [Microsoft Learn: Enforce Microsoft Entra multifactor authentication for Azure Virtual Desktop using Conditional Access](https://learn.microsoft.com/en-us/azure/virtual-desktop/set-up-mfa)
- [Microsoft Learn: Authentication in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/authentication)
- [Microsoft Learn: Configure single sign-on for Azure Virtual Desktop using Microsoft Entra ID](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-single-sign-on)
- [Microsoft Learn: Configure the session lock behavior](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-session-lock-behavior)
- [Microsoft Learn: Troubleshoot single sign-on and Conditional Access for Azure Virtual Desktop](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-desktop/troubleshoot-sso-conditional-access)
- [Microsoft Learn: Microsoft Entra joined session hosts in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/azure-ad-joined-session-hosts)
