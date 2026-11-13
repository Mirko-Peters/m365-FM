---
title: "Device Code Flow Sign-In Succeeded Although Conditional Access Blocks It: How to Investigate"
summary: "A sign-in used device code flow even though a Conditional Access policy blocks it. Learn what to check in the sign-in log, how the policy really works, and which containment steps Microsoft documents."
status: approved
publish: false
author: mirko-p
date: 2026-11-13
topics: [conditional-access, device-code-flow, entra-id, microsoft-entra-sign-in-logs, conditional-access-report-only-mode]
keypoints:
  - "Block device code flow with the Authentication flows condition, not with the Other clients setting. Start in report-only mode and exclude emergency access accounts."
  - "The Conditional Access tab of the sign-in log shows whether the policy applied, was excluded, or was only evaluated in report-only mode."
  - "A session that started with device code flow is protocol tracked, and Learn says that tracking survives token refreshes."
  - "If you suspect a compromise, disable the user, revoke sessions, reset the password, and review registered MFA methods. Existing access tokens can stay valid for up to an hour."
  - "The 2026 thread has no confirmed root cause. The causes listed here are checks, not findings."
faq:
  - q: "How do I block device code flow in Conditional Access?"
    a: "Create a policy for All users and All resources, set Conditions, then Authentication flows, to Yes with Device code flow selected, and use Block access as the grant control. Microsoft Learn recommends creating it in report-only mode first and excluding emergency access accounts."
  - q: "Why did a device code sign-in succeed if my policy blocks it?"
    a: "Microsoft staff in a 2026 Q&A thread named these checks: the user or app scope, exclusions, report-only mode, and a refresh token that was issued earlier. Open the Conditional Access tab of that sign-in to see what the policy did. The thread never confirmed the actual cause."
  - q: "Does 'Other clients' block device code flow?"
    a: "Two replies in the thread suggested checking it, but the Microsoft Learn pages on blocking authentication flows do not mention it. The documented control is the Authentication flows condition, so build the block with that condition and do not rely on Other clients."
  - q: "What should I do right away if an account might be compromised?"
    a: "Microsoft Learn describes disabling the account, revoking sessions, and for hybrid accounts resetting the on-premises password twice. For cloud-only accounts, reset the password and review MFA methods as separate steps."
---

Device code flow lets a user sign in on a device that has no browser or keyboard, for example a signage screen. The user types a short code on another device and approves the sign-in there. Attackers use the same flow in phishing. Microsoft recommends blocking it wherever you can.

In April 2026, an administrator posted a question on Microsoft Q&A. A mailbox had been compromised. The Entra logs showed a successful sign-in in March that used the device code protocol. The author said a tenant-wide Conditional Access policy blocking device code flow had been in place since May 2025. How did the sign-in succeed?

Three Microsoft-affiliated contributors answered. No answer was marked as accepted, and the root cause was never confirmed. That is why this article does not present a fix. It shows how to check your own tenant, using the replies and Microsoft Learn. It is not an official Microsoft procedure.

## What the situation looks like

- The sign-in log has an entry with authentication protocol **Device code** and result **Success**.
- You have a Conditional Access policy that is meant to block device code flow.
- The affected account may show unusual mail activity or other signs of misuse.

## Step 1: Build the policy the documented way

Check how your policy is built. Microsoft Learn describes it like this:

1. In the Microsoft Entra admin center, open **Entra ID**, then **Conditional Access**, then **Policies**, and select **New policy**.
2. Under **Users**, include **All users**. Exclude your emergency access accounts and any other account you must exclude. Review that list regularly.
3. Under **Target resources**, include **All resources**.
4. Under **Conditions**, open **Authentication flows**, set **Configure** to **Yes**, and select **Device code flow**.
5. Under **Grant**, choose **Block access**.
6. Create the policy in **Report-only** mode first. Switch it to **On** after you have checked the impact.

Two replies in the thread told the author to confirm that **Other clients** is covered under client apps. The two Learn pages on blocking authentication flows never mention Other clients, and the documented control for device code flow is the Authentication flows condition. Where the thread and Learn differ, follow Learn.

## Step 2: Open the Conditional Access tab of the sign-in

All three replies start here, and so does Microsoft's troubleshooting page.

1. Go to **Entra ID**, then **Monitoring & health**, then **Sign-in logs**. You need at least the Reports Reader role.
2. Find the suspicious sign-in. Filtering by **Authentication protocol** set to device code helps.
3. Open the entry and select the **Conditional Access** tab.
4. For each policy, check whether it was applied, not applied, or evaluated in report-only mode.
5. Select the policy name, then the ellipsis, to see why it matched or did not. The page shows the sign-in data on one side and the policy conditions on the other. A policy applies only when all configured conditions match.

The replies named these typical reasons for "not applied":

- The user was excluded, directly or through a group. Check the break-glass exclusions especially.
- The policy was in report-only mode on that date, or was switched on later than you remember.
- The policy did not cover all resources, or the user was not in scope.

The audit log of the policy shows when it was changed.

## Step 3: Understand protocol tracking and old tokens

Learn describes a behavior that surprises many administrators. A session that began with device code flow is protocol tracked. The policy applies to that session, and the tracking continues through token refreshes. A later sign-in to a different app in the same session can be blocked even though it did not use device code flow.

This works in the other direction as well. The replies raise a refresh token that existed before the block was in place. The sign-in details show the **Original transfer method** next to the authentication protocol. If the original transfer method is **Device code flow**, the session is protocol tracked. When the policy applies to all applications, a blocked sign-in of this kind can show error `AADSTS530036`, which Learn describes as a refresh token that is invalid because of authentication flow checks by Conditional Access.

Learn does not say in clear words what happens to a token issued before the policy existed. It only says that, if the policy was disabled or in report-only mode, you may need to get a fresh token to use the device again. So the question "was there a valid refresh token before the block?" can only be answered from your logs. Look for earlier sign-ins of the same user and session.

## Step 4: Test with What If

Use the What If tool in Conditional Access with the affected user, the target app, and the device code flow condition if it is offered, and see whether the blocking policy is listed. A reply in the thread recommended this. It tells you whether the policy is built correctly today. It does not tell you what happened on the day of the sign-in, so combine it with step 2.

## Step 5: Contain the account

If a compromise is possible, do not wait for the root cause. The replies agree on the order, and Learn's page on revoking access supports it.

For a cloud-only account:

1. Disable the account, or at least revoke its sessions. In the admin center, open the user and select **Revoke sessions**. In PowerShell, Learn uses `Revoke-MgUserSignInSession` for this.
2. Reset the password. Learn describes the password reset only for the on-premises part, so do the cloud reset as its own step.
3. Review the registered MFA methods. Learn's page does not cover this, but the replies list it. Remove methods that the user does not recognize and ask for a new registration.

For a hybrid account, Learn says to disable the account in Active Directory and reset the password twice with random values, because replication can be delayed.

Timing matters. Revoking stops new tokens, but an existing access token stays valid until it expires. The default lifetime is one hour. Apps that support continuous access evaluation can end access sooner.

## Step 6: Handle legitimate device code use

Before you switch the policy to **On**, find real users of the flow. In the sign-in logs, filter by authentication protocol device code, or look at the report-only results. Learn gives one example that needs a decision: since September 2024, a policy that targets all resources also applies to the Device Registration Service. If your processes register devices with device code flow, exclude that service in the policy. In the portal, this is under **Target resources**, **Exclude**, **Select excluded cloud apps**, then **Device Registration Service**.

Learn's own example of a permitted case is a conference room device on a known network. Build such exceptions with extra conditions, and keep the exceptions narrow.

## Limits of this guide

- The thread never says why the March sign-in worked. Do not copy its conclusion to your tenant.
- Learn describes protocol tracking but gives no detail on how tokens that are older than the policy are handled.
- Service principals are not blocked by user-scoped policies. Learn points to Conditional Access for workload identities for that case.

## Related

- [Conditional Access](https://www.m365.fm/entity/conditional-access/)
- [Device code flow](https://www.m365.fm/entity/device-code-flow/)
- [Report-only mode (Conditional Access)](https://www.m365.fm/entity/conditional-access-report-only-mode/)
- [Microsoft Entra sign-in logs](https://www.m365.fm/entity/microsoft-entra-sign-in-logs/)
- [Emergency access accounts](https://www.m365.fm/entity/emergency-access-accounts/)

## Sources

- [Microsoft Learn: Block authentication flows with Conditional Access](https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-block-authentication-flows)
- [Microsoft Learn: Conditional Access authentication flows](https://learn.microsoft.com/en-us/entra/identity/conditional-access/concept-authentication-flows)
- [Microsoft Learn: Troubleshoot Conditional Access sign-in problems](https://learn.microsoft.com/en-us/entra/identity/conditional-access/troubleshoot-conditional-access)
- [Microsoft Learn: Revoke user access in Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/identity/users/users-revoke-access)
- [Microsoft Q&A: Entra login shows a successful deviceCodeFlow login when this is globally blocked (April 2026)](https://learn.microsoft.com/en-us/answers/questions/5858896/entra-login-shows-a-successful-devicecodeflow-logi)
