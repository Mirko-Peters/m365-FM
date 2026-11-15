---
title: "Unattended Power Automate Desktop Flows: Secure the Credentials and Fix Machine Connection Failures"
summary: "How to protect the credentials behind unattended desktop flows with Key Vault, certificates and run owners, and how to work through the documented session and machine connection error codes in order."
status: review
publish: false
author: mirko-p
date: 2026-12-13
topics: [power-automate-desktop, unattended-desktop-flow, desktop-flow, azure-key-vault]
keypoints:
  - "A desktop flow connection can't be shared directly. Sharing is limited to service principals with Can use or Can edit."
  - "Store the Windows account secret in Azure Key Vault or CyberArk (preview) instead of typing it into the connection."
  - "Certificate-based authentication needs Power Automate for desktop 2.49 or later, a .pfx in Azure Key Vault and Entra-joined machines."
  - "Unattended runs need all users signed out and use an RDP session. The documented errors include RDP permission and fPromptForPassword causes."
  - "Don't clone a VM after installing the machine runtime. Delete and re-register the machine if SessionNotFound follows a clone."
faq:
  - q: "Where should unattended desktop flow credentials be stored?"
    a: "According to Microsoft Learn, a desktop flow connection can use a credential whose secret is stored in Azure Key Vault or CyberArk (preview). Learn does not say where credentials typed directly into the connection are kept, so a vault-backed credential is the documented option for central control."
  - q: "What license do unattended runs need?"
    a: "Microsoft Learn says unattended desktop automation requires the Power Automate Process plan. The Manage machines page also speaks of allocating process capacity or unattended RPA capacity to create unattended bots, so licensing wording differs between pages. Check your own licensing."
  - q: "Why does the run fail with MSEntraMachineAlwaysPromptingForPassword?"
    a: "Learn says Power Automate for desktop cannot validate the Microsoft Entra credentials on the machine, typically because of a group policy setting. It lists three resolutions: certificate-based authentication, Entra authentication for Remote Desktop with username and password, or disabling Always prompt for password upon connection."
  - q: "Can I run unattended while someone is signed in to the machine?"
    a: "No. Learn says the machine must be available with all users signed out. On Windows 10 and 11, runs fail if any user session is active, even a locked one. On Windows Server you get an error if a locked session exists for the same user as the connection."
---

Unattended desktop flows sign in to a Windows machine on their own, run a desktop flow and sign out. That makes the account behind the connection a valuable target and a common failure point. This article covers how to limit the exposure of those credentials and how to work through the connection errors Microsoft documents, in the order that makes sense for troubleshooting.

## How an unattended run works

Learn explains that a cloud flow triggers the desktop flow. Power Automate uses the selected desktop flow connection to sign in to the machine, signs out when the flow ends and reports activity. It creates a remote desktop (RDP) session, because the machine's console session is not available for unattended runs. The screen stays locked so no one can watch the flow.

Requirements from the same page:

- The Power Automate Process plan is required for unattended automation.
- The machine must be available with all users signed out.
- The connection user must be able to create an RDP session, usually as a member of Remote Desktop Users.
- Unattended flows cannot run with elevated privileges.
- Signing in to the machine during a run is not supported and might fail the flow.

Learn also says to make sure the machine is secured and its admins are trusted before registering it to run flows from the cloud.

## Part 1: Secure the credentials

### Choose a vault-backed credential

When you create a connection (**Data** > **Connections** > **New connection** > **Desktop flows**), Learn describes two methods, **Connect with username and password** and **Connect with Sign-in**. The sign-in method works only for attended runs and fails when run unattended, so it is not an option for the unattended runs this article covers. With username and password you can select a credential whose secret is stored in **Azure Key Vault** or **CyberArk** (preview), or enter the account and password directly. The pages do not say where directly entered credentials are stored. Preferring a vault-backed credential is my own recommendation, not a statement from Learn.

Account formats listed by the connection page are DOMAIN\User, username@domain.com for Entra accounts and MACHINENAME\User or local\User for local accounts. The errors page (WindowsIdentityIncorrect) additionally lists a plain username and .\username for local accounts.

### Consider certificate-based authentication

Learn describes certificate-based authentication (CBA) for unattended runs. Requirements:

- A tenant admin to perform setup, with Entra CBA configured.
- A certificate in .pfx format (PEM is not supported), stored in Azure Key Vault.
- Power Automate for desktop 2.49 or later, and Windows Server 2019 or later if you use Windows Server.
- Target machines joined to Microsoft Entra ID.
- Admin consent for unattended runs that use certificate credentials on a Microsoft Entra joined device.

Limits: CBA credentials work only for the Windows session credentials of the connection. They cannot be used inside the desktop flow or with other connectors, and Azure Key Vault is the only supported vault.

### Control who can use the connection

Learn's connection page contains both a note that a desktop flow connection cannot be shared with other users and a sharing section for service principal users. Read together, sharing is limited to service principals, with the permissions **Can use** or **Can edit**. Sharing works only with a specified run owner identity, and **Can Share** is not available. The run owner is the identity whose permissions are checked during execution. By default it is the connection's creator.

For auditing, the **Run status** page shows the run owner for each run, and the **Desktop Flow activity** page summarizes run owner usage.

### Control who can use the machine

Machine sharing is under **Monitor** > **Machines** > **Manage access**. Co-owners have full control. Users can only run desktop flows. The roles are Desktop Flows Machine Owner, Desktop Flows Machine User, and Desktop Flows Machine User Can Share. Environment admins can restrict the actions by editing the Flow Machine and Flow Machine Group permissions of a security role. A machine group can have at most 50 machines.

## Part 2: Work through connection failures

Check the basics first, then match the error code.

### Check 1: Is the machine registered and reachable?

- Install the machine runtime app from Power Automate for desktop and sign in. The machine registers in the selected environment. Registration needs the Environment Maker or Desktop Flow Machine Owner role.
- Do not clone a VM after installing the machine runtime. For SessionNotFound after a clone, Learn says to delete the machine in the portal and register it again.
- NoListenerConnected and ConnectionTimeout point to the machine being offline or unable to reach the required Power Automate endpoints. ConnectionNotEstablished can come from routing or firewall configuration. DnsError and EndpointDoNotExist call for registering the machine again.
- Check that the UIFlowService is running (UIFlowAgentNotAvailable) and that the Power Automate agent launcher service is running.

### Check 2: Is the Windows identity correct?

- WindowsIdentityIncorrect: confirm you can sign in to the machine with the connection credentials, using one of the supported formats.
- SessionCreationInvalidCredentials: use user@domain.com on Entra-joined machines and domain\user on domain-joined ones.
- AccountLockedOut: an on-premises policy locked the account after too many attempts. Learn says to check whether password rotation causes wrong sign-ins during scheduled runs.

### Check 3: Is an RDP session possible?

- RDPIsNotEnabled: enable Remote Desktop.
- RdpPermissionNotGranted: confirm the user is in Administrators or Remote Desktop Users. In secpol.msc under **Security Settings** > **Local Policies** > **User Rights Assignment**, make sure Deny log on locally and Deny log on through Remote Desktop Services do not include the UIFlowService account.
- UIFlowServiceNoRdpPermissions and SessionNotFoundAfterCreation: add the service account (usually NT SERVICE\UIFlowService) to Remote Desktop Users and make sure group policy does not remove it.
- SessionExistsForTheUserWhenUnattended: check that you are not signed in with the same user on the machine, whatever the session state. Win10AlreadyHasActiveSession (Windows 10 only) and TooManyActiveSessions (Windows Server only): sign out the active session or sessions.

### Check 4: Session creation errors

Learn's session creation article lists three:

- **SessionCreationErrorWithThirdPartyCredentialProvider:** unsupported third-party credential providers interfere. Check subkeys under HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Authentication\Credential Providers for the ones the article names, and ask your administrator to remove the provider.
- **SessionCreationUserPromptedForCredentialsAfterConnection:** the machine prompts for credentials after the RDP connection is up. Run dsregcmd /status, then check the fPromptForPassword, SecurityLayer and UserAuthentication values the article lists, and restart after registry changes.
- **SessionCreationError:** unknown cause. Test that you can RDP to the machine, check for a login legal notice (legalnoticecaption and legalnoticetext), look for third-party login software, and try the UPN format on Entra or hybrid joined devices.

### Check 5: MSEntraMachineAlwaysPromptingForPassword

The article gives three resolutions:

1. **Entra authentication for Remote Desktop with a user certificate.** Needs version 2.50 or later and is for cases where no MFA exception can be granted to the connection account.
2. **Entra authentication with username and password.** Needs version 2.49 or later and an account without MFA, or with an MFA exception. Set the UseRdsAadAuthentication DWORD value to 1 under HKLM\SOFTWARE\WOW6432Node\Microsoft\Power Automate Desktop\Service, hide the consent prompt for the target machine group, and restart the Power Automate service. The run-unattended page names version 2.50 or later as a prerequisite for Entra username and password with NLA, while this error page says 2.49, so check which applies to your build.
3. **Disable fPromptForPassword.** In gpedit.msc go to **Computer Configuration** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Security** and check **Always prompt for password upon connection**. If enabled, work with IT to disable it. Learn says changing the registry value alone is generally not sufficient, as it might be reverted.

If the flow fails with MSEntraRemoteDesktopAppConsentRequired, the consent dialog appeared during session setup. Learn describes admin consent for unattended runs using certificate or sign-in credentials with NLA, with the AppID a4a365df-50f1-4397-bc59-1a1564b8bb9c.

### Check 6: Capacity and throttling

NoCandidateMachine means the run exceeded the queue waiting limit, so add machines or spread runs. DesktopFlowsActionThrottled means too many desktop flows use the same connection, so assign them to several connections.

## Reusing sessions

Under **Monitor** > **Machines**, select the machine or group, choose **Settings** and enable **Reuse sessions for unattended runs**. Session reuse is not supported on machines that allow multiple sessions per user.

## Common mistakes (my own summary, not from Learn)

- Using the same all-powerful account for every machine.
- Typing passwords into connections instead of using a vault credential.
- Leaving an admin signed in to the machine.
- Cloning a registered VM.
- Fixing fPromptForPassword in the registry when a group policy sets it.

## Related

- [Power Automate Desktop](https://www.m365.fm/entity/power-automate-desktop/)
- [Unattended desktop flow](https://www.m365.fm/entity/unattended-desktop-flow/)
- [Desktop flow](https://www.m365.fm/entity/desktop-flow/)
- [Azure Key Vault](https://www.m365.fm/entity/azure-key-vault/)

## Sources

- [Microsoft Learn: Run unattended desktop flows](https://learn.microsoft.com/en-us/power-automate/desktop-flows/run-unattended-desktop-flows)
- [Microsoft Learn: Manage desktop flow connections](https://learn.microsoft.com/en-us/power-automate/desktop-flows/desktop-flow-connections)
- [Microsoft Learn: Configure certificate-based authentication](https://learn.microsoft.com/en-us/power-automate/desktop-flows/configure-certificate-based-auth)
- [Microsoft Learn: Manage machines](https://learn.microsoft.com/en-us/power-automate/desktop-flows/manage-machines)
- [Microsoft Learn: Error code occurs when running an attended or unattended desktop flow](https://learn.microsoft.com/en-us/troubleshoot/power-platform/power-automate/desktop-flows/troubleshoot-errors-running-attended-or-unattended-desktop-flows)
- [Microsoft Learn: Session creation error codes in unattended desktop flow runs](https://learn.microsoft.com/en-us/troubleshoot/power-platform/power-automate/desktop-flows/troubleshoot-session-creation-errrors)
- [Microsoft Learn: Unattended Desktop Flow Run Fails with MSEntraMachineAlwaysPromptingForPassword](https://learn.microsoft.com/en-us/troubleshoot/power-platform/power-automate/desktop-flows/msentramachinealwayspromptingforpassword-error)
