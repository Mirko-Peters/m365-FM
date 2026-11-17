---
title: "Conditional Access for Azure Virtual Desktop: policies that work"
summary: "With single sign-on, Azure Virtual Desktop needs two separate, aligned Conditional Access policies: one for the Azure Virtual Desktop app and one for Windows Cloud Login. Leave the Azure Resource Manager Provider app out and check any broad All cloud apps policy, because one that requires device compliance can break sign-in."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [azure-virtual-desktop, conditional-access]
keypoints:
  - "Target two apps with two separate policies: Azure Virtual Desktop (the service and gateway) and Windows Cloud Login (the session host sign-in when single sign-on is on). Never target the Azure Virtual Desktop Azure Resource Manager Provider app."
  - "A policy that targets All cloud apps with device compliance can break sign-in. Learn's fix is to exclude Windows Cloud Login and Azure Virtual Desktop from it and create AVD-specific policies."
  - "Sign-in frequency on Windows Cloud Login should match or exceed the one on Azure Virtual Desktop. Every time is supported only on Windows Cloud Login."
  - "Learn says to disable legacy per-user MFA and use Conditional Access exclusively. Security Defaults cannot be used together with Conditional Access."
  - "Connection-time compliance applies to the client device. In-session compliance, for example on a Microsoft 365 app, applies to the session host."
faq:
  - q: "Do I need one policy or two for Azure Virtual Desktop?"
    a: "Two. For single sign-on, Microsoft Learn says: \"Create two separate policies rather than one combined policy.\" One targets the Azure Virtual Desktop app and one targets Windows Cloud Login, with the same users and MFA requirement. If Windows Cloud Login has no policy, Learn lists a double MFA prompt, once at the service and once at the session host. With both policies aligned, Learn says users see a single prompt (if required)."
  - q: "Which license do I need?"
    a: "Learn says to assign users a license that includes Microsoft Entra ID P1 or P2. It also says Conditional Access cannot be used while Security Defaults are enabled, so disable those first."
  - q: "Why is my compliance policy blocking Azure Virtual Desktop sign-in?"
    a: "Learn's troubleshooting page maps error AADSTS530002 to a policy that requires a compliant device. A connection-time policy on Azure Virtual Desktop or Windows Cloud Login evaluates the client device. An in-session policy, for example on a Microsoft 365 app, evaluates the session host. Open the Conditional Access tab of the sign-in log to see which one failed."
---

Use two separate Conditional Access policies for Azure Virtual Desktop when single sign-on is on: one that targets the Azure Virtual Desktop app and one that targets the Windows Cloud Login app, both requiring multifactor authentication for the same users, with aligned sign-in frequency. This article is about designing those policies. Fixing a sign-in that already fails is covered in the article on Entra-joined sign-in failures, and the prompt sequence users see in "MFA for Azure Virtual Desktop users: what prompts when".

Learn's page on MFA for Azure Virtual Desktop was last updated in late July 2026.

## Which apps a policy must target

Learn names these apps in Azure Virtual Desktop sign-ins:

| App (application ID) | What it covers | In your policy? |
|---|---|---|
| Azure Virtual Desktop (`9cdead84-a844-4324-93f2-b2e6bb768d07`) | Subscribing to the service, authenticating to the gateway during a connection, and sending diagnostics from the client | Yes |
| Windows Cloud Login (`270efc09-cd0d-444b-a71f-39af4910ec45`) | Authenticating to the session host when single sign-on is enabled | Yes, with single sign-on |
| Azure Virtual Desktop Azure Resource Manager Provider (`50e95039-b200-4007-bc97-8d5790743a63`) | Retrieving the user feed only | No: Learn says it must not have MFA enforced |

The first app was previously called Windows Virtual Desktop, so older tenants may show either name. The web client's sign-in log shows the client app ID `a85cf173-4192-42f8-81fa-777a763e6e2c`, because that client is linked to the server app internally.

Two warnings from Learn. The Windows App authenticates to both the Azure Virtual Desktop and Windows 365 (`0af06dc6-e4b5-4f28-818e-e78e62d137a5`) apps, even for users who only have Azure Virtual Desktop resources, so a policy that blocks the Windows 365 app causes sign-in failures. And if you connect with thin clients, Learn says to contact the client's provider to confirm that Windows Cloud Login is the right app for your Conditional Access policies.

## One policy or two

| Design | What happens | Verdict from Learn |
|---|---|---|
| One policy on Azure Virtual Desktop only | MFA at the service, no policy of its own on Windows Cloud Login, so a second prompt appears at the session host | Listed as a common misconfiguration |
| One combined policy on both apps | Not recommended | "Create two separate policies rather than one combined policy." |
| Two aligned policies | One policy per app, each with its own session controls | Recommended structure for single sign-on; users then see a single MFA prompt (if required) |

Learn's note under the policy tables gives one reason, which concerns sign-in frequency: both apps need policies that are aligned with each other, or users see MFA prompts at unexpected times. Our reading, not Learn's wording: a single policy carries one set of session controls, so two policies are the way to give each app its own sign-in frequency. Learn does say that the **Every time** option is supported only on Windows Cloud Login, and that applying it to the Azure Virtual Desktop app causes constant prompts on feed refresh and diagnostics upload.

## Check All cloud apps policies

One of the five misconfigurations in Learn's list is an existing tenant-wide policy that targets All cloud apps with device compliance: sign-in fails because the session host does not meet the compliance policy. Learn's resolution is to exclude Windows Cloud Login and Azure Virtual Desktop from that policy and to create separate Azure Virtual Desktop-specific policies. Learn's checklist also asks you to list every policy that targets All cloud apps before you enable single sign-on, because these policies reach Azure Virtual Desktop sessions and can block access unexpectedly. Learn does not say to exclude the two apps from every All cloud apps policy. Our reading: an exclusion removes that policy's controls for those apps, so exclude only where a policy blocks sign-in, and make sure the two Azure Virtual Desktop policies enforce what you need. For compliance there is another route in Learn's troubleshooting page: scope connection-time compliance to client devices (see Device compliance below).

## Build the policies

Learn's steps, in the Microsoft Entra admin center as at least a Conditional Access Administrator:

1. Go to **Protection > Conditional Access > Policies** and select **New policy**.
2. Name it by your naming standard and, under **Users**, include the group that holds your Azure Virtual Desktop users.
3. Under **Target resources**, select the Azure Virtual Desktop app (policy 1) or Windows Cloud Login (policy 2). When you search, start with the full app name in order: entering `Azure Virtual` finds the app, while `virtual` alone does not.
4. Under **Conditions > Client apps**, set **Configure** to **Yes**. Select **Browser** for the web client, **Mobile apps and desktop clients** for the other clients, or both. Leave the legacy authentication clients deselected.
5. Under **Grant**, select **Grant access** and **Require multifactor authentication**.
6. Under **Session > Sign-in frequency**, choose **Periodic reauthentication** (a value and a unit) or **Every time**.
7. Set **Enable policy** to **On** and select **Create**.

Learn's MFA page ends at the **On** state. The Entra documentation describes **report-only** mode as a way to test most policies first: it evaluates the policy at sign-in without enforcing grant or session controls and shows the result on the **Report-only** tab of the sign-in log. Policies that use the user actions scope cannot be evaluated in report-only mode. That page also warns that report-only policies requiring a compliant device can prompt users on macOS, iOS and Android to select a device certificate, and recommends excluding those platforms from such report-only policies.

## Sign-in frequency

Learn's example for periodic reauthentication is 1 hour and it gives no default. Learn also notes that users may see a "Stay signed in to all your apps" prompt if their Windows device is not registered with Microsoft Entra ID; if they deselect **Allow my organization to manage my device** and select **No, sign in to this app only**, they may be prompted more often. The rule for the pair is that the Windows Cloud Login policy should match or exceed the Azure Virtual Desktop policy, and Learn warns that differing settings can cause MFA prompts at unexpected times. **Every time** prompts users when they launch a new connection more than 5 to 10 minutes after their last authentication. Learn presents it as a Windows Cloud Login option, not as a pattern to combine with a different periodic value on the other app, so treat that combination as a deliberate decision. When each prompt appears, including what happens on session lock and reconnect, is covered in "MFA for Azure Virtual Desktop users: what prompts when".

## Conditions that need care

**Device compliance.** Learn says Microsoft Entra joined session hosts may not satisfy compliance policies designed for user endpoints. Its troubleshooting page for error AADSTS530002 separates two cases:

- A **connection-time** policy, targeting Azure Virtual Desktop or Windows Cloud Login, applies to the client device. Onboard the client to [Intune](/entity/intune/) and make it compliant, or exclude that device population.
- An **in-session** policy, for example on a Microsoft 365 app, applies to the session host. Enroll the host and make it compliant, or exclude hosts with a device filter.

Learn's guidance is to scope connection-time compliance to client endpoints, not session hosts.

**Location.** For the Azure Virtual Desktop app, location-based policies evaluate against the user's client IP. For Windows Cloud Login the IP address Conditional Access sees may differ from the client IP, depending on network routing. Learn says to test location-based policies against both apps before enforcing them.

**Token Protection.** Learn's security recommendations say to require Token Protection on the endpoint that runs the Windows App, and that it does not apply to the session host. The page refers to a Windows App platform comparison for which clients support it, so check that list before you require it.

## Entra-joined session hosts

Two rules from Learn apply to [Entra-joined](/entity/avd-entra-join/) session hosts. First, disable legacy per-user MFA (**Identity > Users > All users > Per-user MFA**, status **Disabled**) and use Conditional Access exclusively; otherwise users can see "The sign-in method you're trying to use isn't allowed". Second, if you do not want to restrict sign-in to strong methods such as Windows Hello for Business, exclude the **Microsoft Azure Windows Virtual Machine Sign-in** app (application ID `372140e0-b3b7-4226-8ef9-d57986796201`, shown as **Azure Windows VM Sign-in** in some tenants). Our reading: excluding it removes that enforcement for RDP sign-ins to the VM, so treat it as a fallback. The step-by-step fix, and the Azure role users need on the VMs, are in the sign-in failure article.

## Checks before you enable single sign-on

Learn's pre-configuration checklist adds items beyond the ones above:

1. Confirm that the Azure Virtual Desktop and Windows Cloud Login apps exist in your tenant.
2. Verify that no policy blocks Windows Cloud Login or the Windows 365 app.
3. Confirm that per-user MFA is **Disabled** for all Azure Virtual Desktop users.
4. If the tenant uses Security Defaults, disable them first, because Conditional Access cannot be used while they are on.

Enabling Windows Cloud Login under **Microsoft Entra ID > Devices > Remote connection configuration** is part of the single sign-on setup, not of the policies. See [single sign-on](/entity/avd-single-sign-on/).

## An example policy set

The names and values below are an example that combines the settings Learn describes. They are not an official template.

| Policy | Target app | Users | Client apps | Grant | Sign-in frequency |
|---|---|---|---|---|---|
| AVD-01 Require MFA | Azure Virtual Desktop | Group "AVD users" | Browser, mobile apps and desktop clients | Require multifactor authentication | Periodic, 8 hours |
| AVD-02 Require MFA host sign-in | Windows Cloud Login | Group "AVD users" | Browser, mobile apps and desktop clients | Require multifactor authentication | Periodic, 8 hours (matches AVD-01) |

Keep the Azure Resource Manager Provider app out of both policies. If an All cloud apps policy with device compliance blocks sign-in, Learn's resolution is to exclude both apps from that policy; the two policies above then have to carry the controls you need. Exclude your [emergency access accounts](/entity/emergency-access-accounts/) (Microsoft recommends two or more) from policies that block or restrict sign-in.

## Verify

Connect with the Windows App and confirm that you see a single MFA prompt, if your policy requires one. In **Identity > Monitoring & health > Sign-in logs**, filter by the user and find the entries for both Azure Virtual Desktop and Windows Cloud Login. For each entry, check that the correct Conditional Access policy was applied. If an entry shows **Failure**, open its **Conditional Access** tab to see which policy blocked the sign-in.

## Sources

Retrieved 17 November 2026.

- [Microsoft Learn: Enforce Microsoft Entra multifactor authentication for Azure Virtual Desktop using Conditional Access](https://learn.microsoft.com/en-us/azure/virtual-desktop/set-up-mfa)
- [Microsoft Learn: Configure single sign-on for Azure Virtual Desktop using Microsoft Entra authentication](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-single-sign-on)
- [Microsoft Learn: Troubleshoot single sign-on and Conditional Access for Azure Virtual Desktop](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-desktop/troubleshoot-sso-conditional-access)
- [Microsoft Learn: Sign in to a Windows VM in Azure using Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/identity/devices/howto-vm-sign-in-azure-ad-windows)
- [Microsoft Learn: Conditional Access report-only mode](https://learn.microsoft.com/en-us/entra/identity/conditional-access/concept-conditional-access-report-only)
- [Microsoft Learn: Security recommendations for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/security-recommendations)
- [Microsoft Learn: Emergency access accounts in Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/security-emergency-access)
