---
title: "Fix AADSTS50131: Conditional Access Failed, Bad Device State or Suspicious Activity"
summary: "AADSTS50131 (ConditionalAccessFailed) is a broad code for Conditional Access failures such as bad Windows device state or a request blocked as suspicious. Use the sign-in log Conditional Access tab, the What If tool and service dependency checks to find the actual policy."
status: review
publish: false
author: mirko-p
date: 2027-01-15
topics: [entra-id, conditional-access, conditional-access-report-only-mode]
keypoints:
  - "The Entra error reference describes AADSTS50131 as various Conditional Access errors, such as bad Windows device state, suspicious activity blocks and policy decisions."
  - "Because the code is broad, the sign-in log Conditional Access tab, not the code, tells you which policy interrupted the sign-in."
  - "Find the event by correlation ID, user, date or resource and filter the Conditional Access column to failures."
  - "The What If tool does not test service dependencies, so a result for Teams ignores policies on Exchange Online."
  - "If every admin is locked out by a policy, Learn says to submit a support request; keep emergency access accounts excluded to avoid that."
faq:
  - q: "What does AADSTS50131 mean?"
    a: "The Microsoft Entra error reference lists it as ConditionalAccessFailed. It indicates various Conditional Access errors such as bad Windows device state, a request blocked due to suspicious activity, or access policy or security policy decisions. The reference gives no single cause."
  - q: "How do I find the policy that caused it?"
    a: "In the Microsoft Entra admin center, sign in as at least Reports Reader, open Entra ID, Monitoring and health, Sign-in logs, find the failed event and open the Conditional Access tab. It lists the policy or policies that resulted in the interruption. Select a policy name to see its configuration."
  - q: "What should I send to Microsoft support?"
    a: "Learn says to include the request ID, time and date from the sign-in event in the incident details. The More Details link on the error page also shows troubleshooting information that helps find the event."
  - q: "Can the What If tool explain the failure?"
    a: "It can show which enabled or report-only policies would apply to a simulated sign-in, with the controls required. It needs identity, target resource, device platform and client app as inputs. Learn warns that it does not test service dependencies, such as the Exchange Online policy that affects Teams."
  - q: "Which configurations are risky for all users and all resources?"
    a: "Block access, Require device to be marked as compliant, Require Hybrid Microsoft Entra joined device and Require app protection policy. Learn says these can block the whole organization or lock out admins who have no enrolled device."
---

AADSTS50131, named ConditionalAccessFailed, is a broad code. The Microsoft Entra error reference says it covers various Conditional Access errors, such as bad Windows device state, a request blocked due to suspicious activity, or access policy or security policy decisions. The code alone does not name the policy. The fastest route is to open the failed sign-in in the Entra sign-in logs and read the Conditional Access tab. This guide follows Microsoft Learn's page on troubleshooting sign-in problems with Conditional Access and its page on the What If tool.

## What the code tells you, and what it does not

The reference row gives three example causes: a bad Windows device state, a request blocked due to suspicious activity, and policy decisions. It does not give steps. Learn's Conditional Access troubleshooting page lists more specific sign-in error codes, including 53000 DeviceNotCompliant, 53001 DeviceNotDomainJoined, 53002 ApplicationUsedIsNotAnApprovedApp, 53003 BlockedByConditionalAccess, 53004 ProofUpBlockedDueToRisk and 53009 for an application that needs to enforce Intune protection policies. If your sign-in shows 50131, the log is where to look for the policy and the reason.

## Step 1: read what the user saw

For a browser sign-in, the error page usually has detailed information that describes the problem and suggests a solution. Learn's example error says the application can be used only from devices or client apps that meet the company's mobile device management policy. Ask the user to select **More Details** on the error page. It shows troubleshooting information that helps when you search the sign-in events or open a support incident.

## Step 2: find the sign-in event

1. Sign in to the Microsoft Entra admin center as at least a Reports Reader.
2. Go to **Entra ID** > **Monitoring & health** > **Sign-in logs**.
3. Narrow the list with filters. Learn names **Correlation ID** for a specific event, **Conditional Access** to see failures only, **Username**, **Date** and **Resource**.
4. Open the event and select the **Conditional Access** tab. It shows the policies that resulted in the interruption.
5. Read the **Troubleshooting and support** tab, which might give a clear reason, such as a device that did not meet compliance requirements.
6. Select the **Policy Name** to open the policy configuration.

The **Basic Info**, **Location**, **Device Info**, **Authentication Details** and **Additional Details** tabs hold the user and device details that were used in the policy assessment. For a bad device state, check the device details first.

## Step 3: understand why a policy applied

Learn says policies apply only when all conditions are satisfied or not configured. The ellipsis next to a policy in a sign-in event shows policy details: the left side gives details collected at sign-in, the right side shows whether they satisfy the policy requirements.

If that is not enough, use the sign-in diagnostic under **Basic info** > **Troubleshoot Event**, or the What If tool.

### The What If tool

Find it under **Entra ID** > **Conditional Access** > **Policies** > **What If**. It simulates a sign-in for a user, agent identity or single tenant service principal and reports the policies that apply, those that do not, and the grant and session controls to satisfy. The required inputs are identity, target resource, device platform and client app. Other conditions default to none.

Points from Learn:

- Only policies that are enabled or in report-only mode are evaluated.
- For each policy that does not apply, the reason is the first condition that was not satisfied.
- Give the app ID. Groups of apps such as Office 365 or Microsoft Admin Portals do not result in a match.
- The API expects all sign-in parameters, and conditions without a supplied value cannot be evaluated.
- It does not test service dependencies. For a Teams policy test, the result ignores policies on Exchange Online, which is a dependency of Teams.

## Step 4: check service dependencies and audience

Learn says some users are blocked because a cloud app depends on a resource that a policy blocks. In the sign-in log, check both the application and the resource. Its example: the application is the Azure portal and the resource is Azure Resource Manager.

The sign-in log also has audience reporting. A user who signs in to Teams requests several resources, and policies apply across all of them. **Audience** lists the resources requested, and it explains why a policy applied even though the user thought they signed in to a single app.

## Settings that cause broad failures

Learn warns against these for all users and all resources:

- **Block access**, which blocks the whole organization.
- **Require device to be marked as compliant**, which blocks users with unenrolled devices from all access, including the Intune portal, and can lock out an admin without an enrolled device.
- **Require Hybrid Microsoft Entra domain joined device**, which blocks users without such a device.
- **Require app protection policy**, which blocks users without an Intune policy or a client app that has one.

Check recent policy changes against these first when the failures start suddenly for many users.

## If you are locked out

Check for other admins who are not blocked yet. One of them can disable the policy. If no admin in the organization can update the policy, Learn says to submit a support request, and Microsoft support reviews and, after confirming, updates the policies that prevent access. When you open an incident, include the request ID, time and date from the sign-in event.

## A short plan

This is my own plan, not a Microsoft statement.

1. Get the correlation ID and time of one failed sign-in.
2. Read the Conditional Access tab and name the policy.
3. Decide whether the policy is right and the user or device is wrong, or the reverse. A bad device state is a device problem to fix. A policy that catches the wrong people is a policy problem to fix.
4. Test the change in report-only mode before enforcing it, and keep emergency access accounts excluded.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)
- [Conditional Access report-only mode](https://www.m365.fm/entity/conditional-access-report-only-mode/)

## Sources

- [Troubleshooting sign-in problems with Conditional Access - Microsoft Entra ID (Microsoft Learn)](https://learn.microsoft.com/entra/identity/conditional-access/troubleshoot-conditional-access)
- [The Conditional Access What If tool - Microsoft Entra ID (Microsoft Learn)](https://learn.microsoft.com/entra/identity/conditional-access/what-if-tool)
- [Microsoft Entra authentication & authorization error codes - Microsoft identity platform (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/reference-error-codes)
