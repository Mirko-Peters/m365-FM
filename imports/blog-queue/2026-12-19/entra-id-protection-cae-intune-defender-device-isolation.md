---
title: "Entra ID Protection, Continuous Access Evaluation and Device Isolation: What Intune and Defender Can Do"
summary: "What Microsoft documents for responding to a risky user or device: CAE critical events, ID Protection risk policies, Intune compliance with Defender risk score, and Defender for Endpoint isolation, plus the gap between them."
status: review
publish: false
author: mirko-p
date: 2026-12-19
topics: [continuous-access-evaluation, microsoft-entra-id-protection, intune, device-compliance]
keypoints:
  - "CAE revokes access near real time for critical events such as high user risk from ID Protection, but it works at the token and session level. It does not isolate a device from the network."
  - "The Intune remote action list on Learn has no isolate action. Network isolation is a Microsoft Defender for Endpoint feature with its own RBAC role and limits."
  - "Intune can mark a device noncompliant when Defender for Endpoint reports a machine risk score above your threshold. Conditional Access then blocks access for devices that are not compliant."
  - "Defender isolation lasts up to seven days, needs Active remediation actions rights and can be triggered automatically by attack disruption, which is documented as a preview."
  - "The pages read do not describe a built-in chain from an ID Protection risk event to automatic device isolation. Building one would be custom work that needs its own testing."
faq:
  - q: "Does continuous access evaluation isolate a device?"
    a: "No. Microsoft Learn describes CAE as services subscribing to critical Entra events such as account disabled, password reset, revoked refresh tokens or high user risk, and enforcing them near real time. That ends access to the services it covers. It does not describe any network or device isolation."
  - q: "Can Intune isolate a device from the network?"
    a: "The Intune device actions list on Learn includes actions such as Retire, Wipe, Restart, Quick Scan and Full Scan, but no isolation action. Device isolation is documented in Microsoft Defender for Endpoint, where it disconnects the device from the network while keeping its connection to the Defender service."
  - q: "How can Intune react to a risky device?"
    a: "With the Intune and Defender for Endpoint connection enabled, a compliance policy can use Require the device to be at or under the machine risk score. Devices above the threshold are marked not compliant, and a Conditional Access policy with Require device to be marked as compliant blocks them."
  - q: "How long does Defender device isolation last?"
    a: "Learn says isolation is automatically lifted after seven days. If a device is offline when the action is submitted, Defender retries enforcing it for up to three days."
  - q: "Does CAE work for guest users?"
    a: "Learn says CAE does not support guest user accounts, and that revocation events and IP-based Conditional Access policies are not enforced instantaneously for them."
---

Continuous access evaluation, Intune and Microsoft Defender for Endpoint each respond to risk, but at different layers. CAE ends sessions when Entra events occur. Intune compliance decides whether a device can pass Conditional Access. Defender for Endpoint can cut a device off from the network. Microsoft Learn documents each part, but the pages read do not document a built-in path from an Entra ID Protection risk event to automatic device isolation.

## Layer 1: CAE and ID Protection act on the session

Learn explains that services such as Exchange Online, SharePoint Online and Teams subscribe to critical Entra events and enforce them near real time. The critical events are:

- the user account is deleted or disabled;
- the password is changed or reset;
- multifactor authentication is enabled for the user;
- an administrator explicitly revokes all refresh tokens;
- high user risk is detected by Microsoft Entra ID Protection.

Critical event evaluation does not rely on Conditional Access policies, so it is available in any tenant. CAE also evaluates network location changes from Conditional Access IP policies.

What to expect, per Learn:

- Response is near real time, but latency of up to 15 minutes may be observed because of event propagation. IP location enforcement is instant.
- Policy and group membership changes can take up to one day.
- CAE sessions can have access tokens of up to 28 hours, since critical events and policy evaluation drive revocation.
- Support is partial. Office web apps are not supported, Teams is partially supported, and CAE does not support guest accounts.
- When IP ranges in location policies sum to more than 5,000, CAE cannot enforce location changes in real time.

All of this ends access to services. None of it touches the device or its network connection.

## Layer 2: Risk policies in Conditional Access

To turn ID Protection risk into access decisions, Learn describes user risk and sign-in risk policies in Conditional Access:

- Microsoft recommends **Require risk remediation** when user risk is **High**. This applies an authentication strength grant control and sign-in frequency **Every time**.
- For sign-in risk, Microsoft recommends requiring MFA when the level is **Medium** or **High**.
- Do not combine sign-in risk and user risk in one policy.
- The configuration path is **Entra ID** > **Conditional Access** > **New policy**, starting in report-only mode.
- Full ID Protection features need Microsoft Entra ID P2 or the Entra Suite license. Legacy risk policies are scheduled to retire on October 1, 2026.

The page says nothing about device compliance in these examples.

## Layer 3: Intune compliance with Defender risk

The device-side signal comes from Intune and Defender for Endpoint together. Learn's setup:

1. In the Intune admin center, go to **Endpoint security** > **Defender for Endpoint** and check the connection status.
2. In the Defender portal, go to **System** > **Settings** > **Endpoints** > **General** > **Advanced features** and turn on **Intune connection**.
3. In Intune, enable compliance policy evaluation for the platforms you need, for example **Connect Windows devices to Defender for Endpoint**.
4. Onboard devices, for example with an Endpoint detection and response policy.
5. Create a compliance policy under **Devices** > **Compliance** > **Policies** and set **Require the device to be at or under the machine risk score** to Clear, Low, Medium or High.

Devices above the threshold become **Not compliant**. Then a Conditional Access policy with **Require device to be marked as compliant** blocks access to the target resources, such as SharePoint Online. Learn advises starting in report-only mode, waiting about 24 hours and reviewing the sign-in logs.

Noncompliance actions are limited. Learn lists mark noncompliant, email, remote lock on some platforms, add to the retire list and push notification. None is an isolation. Retirement removes company data and the device from Intune management, and the admin must confirm it.

The Intune remote action list contains actions such as Retire, Wipe, Restart, Collect diagnostics, Full Scan and Quick Scan. It contains no isolate action.

## Layer 4: Isolation lives in Defender for Endpoint

Learn describes isolation as disconnecting the compromised device from the network while keeping connectivity to the Defender service. Key facts:

- **Manual:** select **Isolate device** on the device page, add a comment and confirm. Release with **Release from isolation**.
- **Role:** at least the `Active remediation actions` role, plus access to the device group.
- **Full isolation** is available on Windows 11, Windows 10 version 1703 or later and Windows Server 2012 R2 and later. Selective isolation also covers macOS. Linux is supported with prerequisites such as `iptables`.
- **Duration:** automatically lifted after seven days. Offline devices get up to three days of retries.
- **Proxies and VPN:** devices might not recover from isolation behind web proxies, so use selective isolation. Full VPN tunnels cut the device off from the Defender cloud service, so Learn recommends split tunneling.
- **Automatic isolation:** automatic attack disruption can isolate a device that might be compromised. Learn marks this as a preview, limited to end-user workstations onboarded to Defender for Endpoint, scoped to devices involved in the incident and time-limited. Exclusions are possible with a device tag.

Automatic isolation is driven by Defender detections. The page does not describe Entra ID Protection risk as a trigger.

## Where the documented chain ends

A realistic design with only documented pieces:

| Signal | Documented response |
|---|---|
| High user risk in ID Protection | CAE critical event ends sessions. A user risk policy requires remediation. |
| Device risk reported by Defender | Intune marks the device not compliant. Conditional Access blocks access. |
| Active compromise on the device | Defender isolation, manual or via attack disruption (preview). |

Linking the first row to the third, so that a risky identity automatically isolates its devices, is not described in the pages read. If you build it with your own automation, treat it as a custom solution: test it on a pilot group, define who can release devices, and remember the seven-day expiry and the Active remediation actions requirement.

## Practical steps

1. Enable the Intune and Defender connection, and confirm devices are onboarded.
2. Create the compliance policy with a machine risk threshold. Learn recommends Low for balanced security.
3. Create the Conditional Access policy requiring compliant devices, in report-only mode first, with break-glass accounts excluded.
4. Create user risk and sign-in risk policies in report-only mode.
5. Write a runbook for isolation: who may isolate, how to release, and what happens behind proxies and VPNs.
6. Test with one pilot user and one test device, and record how long each step takes.

## Related

- [Continuous access evaluation (CAE)](https://www.m365.fm/entity/continuous-access-evaluation/)
- [Microsoft Entra ID Protection](https://www.m365.fm/entity/microsoft-entra-id-protection/)
- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Device compliance](https://www.m365.fm/entity/device-compliance/)

## Sources

- [Continuous access evaluation (Microsoft Learn)](https://learn.microsoft.com/en-us/entra/identity/conditional-access/concept-continuous-access-evaluation)
- [Configure risk policies in Conditional Access (Microsoft Learn)](https://learn.microsoft.com/en-us/entra/id-protection/howto-identity-protection-configure-risk-policies)
- [Configure Intune and Defender for Endpoint integration (Microsoft Learn)](https://learn.microsoft.com/en-us/intune/intune-service/protect/advanced-threat-protection-configure)
- [Actions for noncompliance in Intune (Microsoft Learn)](https://learn.microsoft.com/en-us/intune/intune-service/protect/actions-for-noncompliance)
- [Device management actions in Intune (Microsoft Learn)](https://learn.microsoft.com/en-us/intune/intune-service/remote-actions/device-management)
- [Isolate devices in Defender for Endpoint (Microsoft Learn)](https://learn.microsoft.com/en-us/defender-endpoint/respond-machine-alerts)
