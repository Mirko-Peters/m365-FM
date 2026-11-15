---
title: "Azure Virtual Desktop Sign-In Fails on Entra-Joined Session Hosts: A Checklist"
summary: "Users get 'Your credentials did not work', a sign-in loop or 'Sign in failed' on Entra-joined AVD hosts. Check the role, per-user MFA, SSO and Conditional Access in this order."
status: approved
publish: false
author: mirko-p
date: 2026-11-13
topics: [azure-virtual-desktop, conditional-access, azure-rbac, single-sign-on]
keypoints:
  - "Learn ties 'Your account is configured to prevent you from using this device' to a missing Virtual Machine User Login role. Owner or Contributor does not grant sign-in."
  - "Legacy per-user MFA (Enabled or Enforced) breaks sign-in to Entra-joined session hosts. Disable it and enforce MFA with Conditional Access."
  - "With single sign-on, Conditional Access has to cover two apps, Azure Virtual Desktop and Windows Cloud Login, with matching sign-in frequency. A policy on only one app causes duplicate prompts."
  - "The Entra sign-in log shows the AADSTS code and the policy that fired. Read it before you change anything."
faq:
  - q: "Which Azure role does a user need to sign in to an Entra-joined AVD session host?"
    a: "According to Microsoft Learn, Virtual Machine User Login for regular users or Virtual Machine Administrator Login for administrators. You can assign it on the VM, the resource group or the subscription. Learn recommends assigning it at resource group level to the same group used for the application group. Owner or Contributor does not give sign-in rights."
  - q: "Why do users get repeated sign-in prompts after I enable single sign-on?"
    a: "Learn's single sign-on troubleshooting page names several causes, among them: different sign-in frequencies on the Azure Virtual Desktop and Windows Cloud Login policies, per-user MFA turned on next to Conditional Access, no Conditional Access policy for Windows Cloud Login, and an unhidden consent dialog. Check the Conditional Access tab of the failed sign-in in the Entra sign-in log to see which policy applies."
  - q: "Do I need targetisaadjoined or enablerdsaadauth?"
    a: "They do different jobs. Learn's single sign-on page sets the RDP property enablerdsaadauth to 1 (or the Microsoft Entra single sign-on option on the host pool). Learn's deployment page says that web, Android, macOS and iOS clients, and Windows PCs that are not joined or registered, need targetisaadjoined:i:1 when you do not use single sign-on, and those connections are limited to user name and password."
  - q: "Is per-user MFA still allowed with AVD on Entra-joined hosts?"
    a: "Learn says legacy per-user MFA must be disabled for sign-in to Entra-joined session hosts, and that Conditional Access should be used instead. If it stays on, users can see 'The sign-in method you're trying to use isn't allowed' or repeated prompts."
---

The password is right, the user is licensed, and the Entra sign-in log says Success. Still the Windows App says "Your credentials did not work", loops through a pop-up, or disconnects with "Sign in failed".

Four Microsoft Q&A threads from December 2025 to June 2026 describe versions of this. None of them ended with a confirmed fix from the asker, and several answers contradicted each other. This article does not repeat that guesswork. It takes the failure messages the threads reported and maps them to what Microsoft Learn documents. It is a troubleshooting guide, not an official Microsoft procedure.

## What the threads reported

- A cloud-only user on an Entra-joined multi-session host got "Your credentials did not work". The sign-in log showed Success and no Conditional Access policy applied. The one answer, from a volunteer moderator, said single sign-on had apparently not been configured. The asker never confirmed.
- A new user on a Mac with the Windows App first had credentials rejected. After single sign-on was configured, a pop-up appeared and disappeared in a loop. No answer was confirmed.
- One user out of many got "Disconnected. Sign in failed." in the web client. Other users were fine. Many checks ruled out the profile, the SID mapping and group membership. The thread is open.
- New and reset users could open a full desktop but got "wrong password" errors for published apps (RemoteApp). The thread is open. The asker's last post said that three password reset methods had not helped.

The common point is that the Entra sign-in succeeds while a second layer fails. That second layer is the sign-in to the session host itself. The checks below follow that layer.

## Step 1: Match the message to a known cause

Microsoft Learn's page on connections to Entra-joined VMs in AVD lists these messages:

| Message | Cause and fix according to Learn |
|---|---|
| "Your account is configured to prevent you from using this device." | The user lacks the Virtual Machine User Login role. Assign it. |
| "The user name or password is incorrect" | Wrong credentials, a missing role, or a Conditional Access policy that requires MFA for the Azure Windows VM Sign-In app. Learn says to exclude that app from the MFA requirement. |
| "The logon attempt failed" (Windows client) | The client PC must be Entra joined or hybrid joined to the same tenant. PKU2U must be enabled on the PC and the host. Per-user MFA must be off. |
| "The sign-in method you're trying to use isn't allowed" | A Conditional Access policy restricts access. Enforce MFA the documented way. |
| "A specified logon session does not exist" | The Kerberos server object is missing or wrong. |
| Web client: "Sign in failed. Please check your username and password" | Enable connections from other clients (the `targetisaadjoined:i:1` property, see step 4). |

If you see none of these, go to step 6 and read the sign-in log.

## Step 2: Assign the Azure role

1. In the Azure portal, open the resource group that holds the session host VMs.
2. Open **Access control (IAM)** and assign **Virtual Machine User Login** to the user group. Use **Virtual Machine Administrator Login** for administrators.
3. Wait a few minutes and retry.

Learn's sign-in page explains why Owner and Contributor do not help. Those roles give no sign-in rights, by design, to separate the people who manage VMs from the people who can sign in to them. It also says that adding a user to the local administrators group by hand is not supported. Use the Azure roles. Learn also says that host pools that use a session host configuration do not need this role assignment. One 2025 thread asker had already checked the roles, so this step will not fix every case.

## Step 3: Turn off per-user MFA

Learn says VM sign-ins do not support per-user Enabled or Enforced MFA on Entra-joined hosts. Learn's Conditional Access guidance for AVD points to **Identity**, **Users**, **All users**, **Per-user MFA**. Set each AVD user to **Disabled** and enforce MFA through Conditional Access instead.

In the 2025 thread, the asker had checked per-user MFA with Microsoft Graph and found it disabled, so again this does not explain every case.

## Step 4: Check single sign-on and the RDP properties

Learn's single sign-on page lists the steps:

1. In the Azure portal, open **Microsoft Entra ID**, then **Devices**, then **Remote connection configuration**, then **Windows Cloud Login**, and turn on **Enable Microsoft Entra ID authentication protocol to authenticate users to remote devices**. This takes Application Administrator or Cloud Application Administrator rights.
2. On the host pool, set **Microsoft Entra single sign-on** to use Microsoft Entra authentication, or set the RDP property `enablerdsaadauth` to `1`.
3. Optionally hide the consent dialog with a dynamic device group. Learn says Entra remembers up to 15 hosts for 30 days before prompting again.

If you do not use single sign-on, Learn's deployment page says that the web, Android, macOS and iOS clients, and Windows PCs that are not joined or registered to the same tenant, need `targetisaadjoined:i:1` as a custom RDP property. Those connections accept only user name and password.

The threads mixed these two properties up. In the March 2026 "Sign in failed" thread, a Microsoft moderator suggested `targetisaadjoined:i:1` to a user who already used `enablerdsaadauth:i:1`. Learn describes them for different situations, not as alternatives.

For hybrid-joined hosts, or Entra-joined hosts in an environment with domain controllers, Learn also requires a Kerberos server object. Without it you may see "the specific session doesn't exist" or a standard credentials dialog.

## Step 5: Fix Conditional Access for both apps

Learn's Conditional Access guidance for AVD recommends two separate policies:

- Policy 1 targets **Azure Virtual Desktop** (`9cdead84-a844-4324-93f2-b2e6bb768d07`).
- Policy 2 targets **Windows Cloud Login** (`270efc09-cd0d-444b-a71f-39af4910ec45`).

Learn's single sign-on troubleshooting page then names the causes of loops:

1. **Different sign-in frequency.** Give both policies the same value, or give Windows Cloud Login the same or a longer one. The **Every time** option works only on Windows Cloud Login.
2. **No policy on Windows Cloud Login.** Users are asked for MFA twice.
3. **Per-user MFA** next to Conditional Access (step 3).

Two more details from Learn. Do not block the **Windows 365** app, because the Windows App authenticates to it even for AVD-only users. And if you do not want to limit sign-in to strong methods such as Windows Hello for Business, exclude the **Azure Windows VM Sign-In** app from the policy.

Two anonymous answers in June 2026 threads named "Microsoft Remote Desktop" as an app that policies must not block or must include. The Learn pages used here do not list it. Follow Learn, and use the sign-in log to confirm what actually fires.

## Step 6: Read the sign-in log

Open the Entra sign-in logs, filter by the user, open the failed attempt and look at the **Conditional Access** tab. Learn's single sign-on troubleshooting page maps these codes:

- AADSTS50058: sign out of the Windows App and sign in again. If it persists, clear the Web Account Manager cache on the client.
- AADSTS50076: the user has no registered MFA method, or per-user MFA is on.
- AADSTS530002: a compliance requirement fails. Scope connection-time compliance to client devices.
- AADSTS530032: Security Defaults may be on, or a Block access policy applies.
- AADSTS65001: hide the consent prompt or grant admin consent for Windows Cloud Login.

If your sign-in logs go to Azure Monitor, the Learn page on connections to Entra-joined VMs gives a query on `AADNonInteractiveUserSignInLogs` filtered on `AppId == "372140e0-b3b7-4226-8ef9-d57986796201"`. It shows the MFA result and the Conditional Access policies that applied to the VM sign-in.

One answer in the RemoteApp thread listed more AADSTS codes, such as 50055 and 50126. They were not confirmed by Learn on these pages. Treat them as hints.

## Step 7: Check the client and the host

- The Windows client PC must be Entra joined, hybrid joined, or (Windows 10 or 11 version 2004 or later) Entra registered to the same tenant, unless you use `targetisaadjoined:i:1`.
- Learn says that for an Entra-registered client you enter `AzureAD\UPN`, and that a temporary password can cause "Your credentials didn't work". Have the user sign in once in a browser and set a permanent password.
- Check that the user is in the application group for what they launch. One answer noted that a user in the desktop group only will not see RemoteApps. That is common sense, not a Learn quote.
- On the host, one answer in the "Sign in failed" thread suspected the **Deny log on through Remote Desktop Services** policy because the Security log showed a silent audit failure. The thread did not confirm it. If you see a similar silent denial, run a Resultant Set of Policy report.

## Verify

1. Sign in with a test user who has only the role and the application group assignment.
2. Check that the sign-in log shows one clean sign-in for each app, with the expected policies.
3. Repeat from a client type that failed before (web, Mac, Windows).

## Limits

- No thread here has a confirmed root cause. This is a Learn-based checklist, not a record of fixes.
- Learn pages change. Compare the role names, app names and portal paths above with the live pages before you change a production tenant.

## Related

- [Azure Virtual Desktop](https://www.m365.fm/entity/azure-virtual-desktop/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)
- [Azure RBAC](https://www.m365.fm/entity/azure-rbac/)
- [Single sign-on](https://www.m365.fm/entity/single-sign-on/)

## Sources

- [Microsoft Learn: Troubleshoot connections to Microsoft Entra joined VMs in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/troubleshoot-azure-ad-connections)
- [Microsoft Learn: Configure single sign-on for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-single-sign-on)
- [Microsoft Learn: Troubleshoot single sign-on and Conditional Access for Azure Virtual Desktop](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-desktop/troubleshoot-sso-conditional-access)
- [Microsoft Learn: Enforce MFA for Azure Virtual Desktop using Conditional Access](https://learn.microsoft.com/en-us/azure/virtual-desktop/set-up-mfa)
- [Microsoft Learn: Deploy Microsoft Entra joined VMs in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-ad-joined-vm)
- [Microsoft Learn: Sign in to a Windows VM in Azure using Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/identity/devices/howto-vm-sign-in-azure-ad-windows)
- [Microsoft Q&A: Cannot sign into VM with Entra ID, only local admin can (December 2025)](https://learn.microsoft.com/en-ie/answers/questions/5668779/cannot-sign-into-vm-with-entra-id-only-local-admin)
- [Microsoft Q&A: One user in Azure Virtual Desktop getting "Disconnected. Sign in failed." (March 2026)](https://learn.microsoft.com/en-us/answers/questions/5814709/one-user-in-azure-virtual-desktop-getting-disconne)
- [Microsoft Q&A: Published app logins in Azure Virtual Desktop fail (June 2026)](https://learn.microsoft.com/en-nz/answers/questions/5907926/published-app-logins-in-azure-virtual-desktop-fail)
- [Microsoft Q&A: Unable to sign in to an Azure Virtual Desktop workspace (June 2026)](https://learn.microsoft.com/en-us/answers/questions/5920929/unable-to-sign-in-to-an-azure-virtual-desktop-work)
