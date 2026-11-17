---
title: "How to enable screen capture protection with Group Policy or Intune"
summary: "Enable the policy setting Enable screen capture protection on the session hosts, either in an Intune Settings catalog profile or in Group Policy after adding the Azure Virtual Desktop administrative template. Restart the session hosts, then connect in a new session to test."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-screen-capture-protection, azure-virtual-desktop]
keypoints:
  - "Both routes configure the same policy, Enable screen capture protection, on the session hosts. In Intune it is in the Settings catalog under Administrative templates; in Group Policy it needs the Azure Virtual Desktop administrative template first."
  - "Choose between Block screen capture on client and Block screen capture on client and server. In the Intune toggle, off means client only and on means client and server."
  - "Restart the session hosts after the policy applies, and test from a new session. Reconnecting to an existing session does not pick up the change."
  - "Native Windows and macOS clients follow this policy without an Intune MAM policy. Android, iOS/iPadOS and web connections need MAM and Conditional Access on top."
  - "The Learn steps use a domain or Intune role: Domain Admins for Group Policy, and the Policy and Profile manager built-in role for Intune."
faq:
  - q: "Do I have to restart the session hosts?"
    a: "Yes. Learn says to restart the computers providing a remote session once the policy applies, for both Intune and Group Policy. Users then need to connect in a new session, because Learn says you must sign out of any existing session and sign back in for the change to take effect."
  - q: "Which value should I pick in the Intune toggle?"
    a: "In the Intune profile, Learn says to toggle Screen Capture Protection Options (Device) to off for Block screen capture on client, or on for Block screen capture on client and server. The second value also stops tools and services inside the VM or Cloud PC from capturing the screen. Learn gives no rule for choosing, so pick it from your threat model and test on one host."
  - q: "Where do I get the administrative template for Group Policy?"
    a: "Learn points to the download at aka.ms/avdgpo, a .cab file and a .zip archive to extract. You copy terminalserver-avd.admx and en-US\\terminalserver-avd.adml to the PolicyDefinitions folder or the Group Policy Central Store. In Intune the template is already in the Settings catalog."
---

To enable screen capture protection on Azure Virtual Desktop session hosts, turn on the policy setting **Enable screen capture protection** and choose whether it blocks capture on the client only or on the client and the server. You set it either with an Intune Settings catalog profile or with Group Policy, restart the session hosts, and test from a new session. This guide walks through both routes, the checks Learn gives, and what to do when it does not seem to work. For what the feature does and does not block, see the explainer on screen capture protection.

Both routes configure the same policy on the VMs. Learn says that native Windows and macOS clients enforce it without an Intune MAM app protection policy. The same Learn page covers Android, iOS/iPadOS and web connections, which need MAM and [Conditional Access](/entity/conditional-access/) as well; those are outside the steps below. The page was last updated on 8 October 2026 and carries no preview label.

## Before you start

Confirm these items, all from Learn's prerequisites for [screen capture protection](/entity/avd-screen-capture-protection/):

- Session hosts (or Windows 365 Cloud PCs) run Windows 11, version 22H2 or later, or Windows 10, version 22H2 or later.
- Users connect with a supported native client. For [Windows App](/entity/windows-app/) on Windows and macOS Learn lists any version for desktop sessions; the Remote Desktop client needs 1.2.1672 on Windows or 10.7.0 on macOS. RemoteApp sessions from Windows need a local Windows 11, version 22H2 or later.
- For Intune: a Microsoft Entra account with the **Policy and Profile manager** built-in role, and a group that contains the VMs or Cloud PCs.
- For Group Policy: a domain account in **Domain Admins**, and a security group or organizational unit with the session hosts.

Decide the value first. **Block screen capture on client** stops capture on the local device of applications running in the remote session. **Block screen capture on client and server** also stops tools and services inside the VM or Cloud PC from capturing the screen. Pick one per policy; Learn describes the setting as applying to the computers the policy targets.

## Option 1: Microsoft Intune

Learn's steps for [Intune](/entity/intune/), in the order shown on the page:

1. Sign in to the Microsoft Intune admin center at intune.microsoft.com.
2. Create or edit a configuration profile for **Windows 10 and later** with the **Settings catalog** profile type.
3. In the settings picker, browse to **Administrative templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Azure Virtual Desktop**.
4. Select **Enable screen capture protection**, then close the settings picker.
5. Expand the **Administrative templates** category and set **Enable screen capture protection** to **Enabled**.
6. Set the toggle **Screen Capture Protection Options (Device)**: **off** for Block screen capture on client, **on** for Block screen capture on client and server. Select **OK**, then **Next**.
7. Optionally add a scope tag on the **Scope tags** tab.
8. On **Assignments**, select the group that contains the computers providing a remote session, then **Next**.
9. On **Review + create**, review the settings and select **Create**.
10. After the policy applies to the computers, restart them so the settings take effect.

Two notes on this route. First, the Learn page for the administrative template says that Intune configures session hosts that are enrolled in Intune and joined to Microsoft Entra ID or Microsoft Entra hybrid joined, and that the template is in the Settings catalog without further configuration. Enrollment is therefore a precondition. Second, if your pool uses Windows Enterprise multi-session, Learn's Intune page says to use the Settings catalog for those hosts and notes that Intune does not deliver unsupported templates to them. This procedure uses the Settings catalog, but check in your tenant that the setting is offered for your hosts, for example by filtering the picker for the **Enterprise multi-session** OS edition.

## Option 2: Group Policy

For [Group Policy](/entity/group-policy/) the Azure Virtual Desktop administrative template must be available first. Learn's steps for an Active Directory domain:

1. Download the Azure Virtual Desktop administrative template files from aka.ms/avdgpo and extract the contents of the `.cab` file and the `.zip` archive.
2. On your domain controllers, copy `terminalserver-avd.admx` and `en-US\terminalserver-avd.adml` to the right place. In the local folders these are `C:\Windows\PolicyDefinitions\` and `C:\Windows\PolicyDefinitions\en-US\`. In a Central Store they are `\\contoso.com\SYSVOL\contoso.com\Policies\PolicyDefinitions` and the same path with `\en-US`. Replace `contoso.com` with your domain, and `en-US` for another language.
3. Open the Group Policy Management Console and create or edit a policy that targets the session hosts.
4. Go to **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Azure Virtual Desktop**. Seeing the AVD settings there confirms the template is installed.
5. Double-click **Enable screen capture protection** and select **Enabled**.
6. In the drop-down, choose **Block screen capture on client** or **Block screen capture on client and server**, then **OK**.
7. Make sure the policy is applied to the computers providing a remote session, then restart them.

Learn also describes local Group Policy on each session host: copy the same two files to the local `PolicyDefinitions` folders and use the Local Group Policy Editor, where the path starts at **Computer Configuration** > **Administrative Templates**. Learn does not recommend this for managing session hosts at scale.

## Test it

Use Learn's verification steps:

1. Connect to a new remote session with a supported client. Do not reconnect to an existing one; sign out of any existing session and sign in again.
2. From the local device, take a screenshot or share your screen in a Teams call or meeting. The remote content should be blocked or hidden.
3. On Windows or macOS, if you chose the client and server value, try to capture the screen with a tool or service inside the VM or Cloud PC. That content should be blocked or hidden too.
4. Connect from a device that is not supported. Learn says you should see an error saying screen capture protection is enabled and that you need a supported client.

Test with one pilot host before the whole pool. Learn lists Teams sharing and macOS behavior as known limits, so include a Teams share in the pilot.

## When it does not work

Learn's page contains no troubleshooting list for the native-client path, so these checks are ours, based on the steps above:

- **Policy not applied.** Confirm the VMs are in the group or organizational unit you targeted and that Intune or Group Policy reports the policy as applied. In Intune, device-based configuration must be assigned to devices; Learn's multi-session page says a device policy assigned to users is reported as Error or Not applicable.
- **Not restarted.** The change takes effect after a restart, per both Learn procedures.
- **Old session.** A user who stayed connected will not see the effect; sign out and in.
- **Unsupported client.** A client that cannot comply is refused with an error, which is expected once the policy is on.
- **Mobile or web users blocked.** Those clients need an Intune MAM app protection policy that blocks screen capture, plus Conditional Access; without it Learn says the connection is blocked.
- **Black Teams sharing.** Learn says protected content can appear black in Teams when unsupported configurations are used. Check its Teams compatibility guidance.

Learn does not document a rollback procedure for these two routes. Our reading is that setting the policy to a disabled or not configured state and restarting the hosts reverses it, but test that on a pilot host before relying on it.

## What to configure alongside it

Learn's tip is to disable clipboard, drive and printer redirection too, since screen capture protection does not stop copying out of the session, and to consider [watermarking](/entity/avd-watermarking/) against photographs. Watermarking appears in the same administrative template, so the Group Policy template you just installed also holds it.

## Sources

Retrieved on 17 November 2026.

- [Microsoft Learn: Screen capture protection in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/screen-capture-protection)
- [Microsoft Learn: Add the administrative template for Azure Virtual Desktop to Group Policy](https://learn.microsoft.com/en-us/azure/virtual-desktop/administrative-template)
- [Microsoft Learn: Using Azure Virtual Desktop multi-session with Microsoft Intune](https://learn.microsoft.com/en-us/intune/solutions/azure-virtual-desktop-multi-session)
