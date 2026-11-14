---
title: "AADSTS50053 IdsLocked: Account Locked by Smart Lockout or Blocked by Built-In Protections"
summary: "AADSTS50053 has two causes in the Learn error reference: smart lockout after too many failed sign-ins, or a sign-in blocked from a malicious IP. How to tell them apart in the sign-in log, how lockout values work, SSPR behavior and the pass-through authentication settings."
status: review
publish: false
author: mirko-p
date: 2027-01-22
topics: [entra-id, self-service-password-reset, entra-connect]
keypoints:
  - "AADSTS50053 can mean IdsLocked after too many failed sign-ins, or a sign-in blocked because it came from an IP address with malicious activity."
  - "Tell them apart in the sign-in logs: find the failed sign-in with error code 50053 and read the Failure reason."
  - "Defaults are 10 failed attempts in Azure Public tenants and a 60-second first lockout. Changing the values needs Microsoft Entra ID P1 or higher."
  - "With SSPR, choosing I forgot my password resets the lockout duration to 0 seconds. Choosing I know my password does not."
  - "With pass-through authentication, the Entra lockout threshold must be lower than and the duration longer than the AD DS values."
faq:
  - q: "What are the two causes of AADSTS50053?"
    a: "The Microsoft Entra error code reference lists IdsLocked, where the account is locked because the user tried to sign in too many times with an incorrect user ID or password, and a sign-in blocked because it came from an IP address with malicious activity. To tell which, sign in to the Microsoft Entra admin center as at least a Cloud Application Administrator, open Monitoring and health, Sign-in logs, find the failed sign-in with error code 50053 and check the Failure reason."
  - q: "What are the smart lockout defaults?"
    a: "Learn says smart lockout locks an account after 10 failed attempts in Azure Public and Azure operated by 21Vianet tenants, and three in Azure US Government tenants. The lockout period is one minute at first and longer for subsequent attempts, and Microsoft does not disclose how fast it increases. The Password protection page shows a default duration of 60 seconds."
  - q: "Will the same wrong password lock the account repeatedly?"
    a: "No. Learn says smart lockout tracks the last three bad password hashes to avoid incrementing the lockout counter for the same password. This hash tracking is not available when pass-through authentication is enabled, because authentication happens on-premises."
  - q: "How can a locked user get back in?"
    a: "After a lockout the user can start self-service password reset. If they choose I forgot my password, the lockout duration is reset to 0 seconds. If they choose I know my password, the timer continues and they must change their password or wait for the lockout duration to expire. An administrator can also unlock a cloud account without waiting for the duration to end."
  - q: "What block reason shows when ID Protection blocks a sign-in?"
    a: "Learn says Microsoft Entra ID Protection automatically blocks sign-ins with a very high confidence of being risky, most commonly via legacy authentication protocols or properties of a malicious attempt. The user gets a 50053 error and the sign-in log shows: Sign-in was blocked by built-in protections due to high confidence of risk. Options are adding the sign-in IPs to trusted locations or switching to a modern authentication protocol."
---

AADSTS50053 does not always mean a user typed a wrong password too often. The Microsoft Learn error reference gives it two causes: IdsLocked, an account locked after too many incorrect sign-ins, and a sign-in blocked because it came from an IP address with malicious activity. The fix depends on which one you have, so the first task is to read the sign-in log.

## Step 1: Find the failure reason

The reference gives these steps:

1. Sign in to the Microsoft Entra admin center as at least a Cloud Application Administrator.
2. Go to your Microsoft Entra tenant, then **Monitoring & health** > **Sign-in logs**.
3. Find the failed sign-in with **Sign-in error code** 50053 and check the **Failure reason**.

Two results are described in the Learn pages:

| Failure reason | Meaning | Path |
| --- | --- | --- |
| Account locked after repeated failures (IdsLocked) | Smart lockout | Path A below |
| Sign-in was blocked by built-in protections due to high confidence of risk | ID Protection built-in block | Path B below |

## Path A: Smart lockout

### How it works

From the smart lockout page:

- Smart lockout is always on for all Microsoft Entra customers, with defaults chosen as a mix of security and usability.
- By default it locks an account after 10 failed attempts in Azure Public and Azure operated by 21Vianet tenants, and after three in Azure US Government tenants.
- The account locks again after each further failed attempt. The first lockout is one minute and later ones are longer. Microsoft does not disclose the rate of increase.
- It tracks the last three bad password hashes, so repeating the same wrong password does not raise the counter. Hash tracking is not available with pass-through authentication.
- Familiar and unfamiliar locations have separate lockout counters. To avoid lockout from an unfamiliar location, the user needs the correct password and few previous failed attempts from such locations.
- Lockout state is synchronized across Microsoft Entra data centers, but the number of failures allowed before the lock can differ slightly from the threshold. Once locked, an account is locked everywhere.
- Learn says smart lockout does not guarantee a genuine user is never locked out.

The message a locked user sees: *Your account is temporarily locked to prevent unauthorized use. Try again later, and if you still have trouble, contact your admin.*

### Getting the user back in

- **SSPR.** If the user picks **I forgot my password**, the lockout duration resets to 0 seconds. If the user picks **I know my password**, the lockout timer continues, so they must change their password or wait until the duration expires. Learn also recommends SSPR for a user locked from an unfamiliar location.
- **Administrator.** An admin can unlock a user's cloud account without waiting for the duration to expire. The page links to the article on resetting a user's password.

### Changing the values

Customizing needs Microsoft Entra ID P1 or higher licenses for your users, and is not available for Azure operated by 21Vianet tenants. As at least an Authentication Policy Administrator:

1. Go to **Entra ID** > **Authentication methods** > **Password protection**.
2. Set the **Lockout threshold**, the number of failed sign-ins allowed before the first lockout (default 10 for Azure Public).
3. Set the **Lockout duration in seconds** (default 60).

If the first sign-in after the lockout period also fails, the account locks again, and repeated locks increase the duration.

### Hybrid settings with pass-through authentication

Learn gives two rules:

- The Entra lockout threshold must be less than the AD DS account lockout threshold. Set the AD DS threshold at least two or three times greater.
- The Entra lockout duration must be longer than the AD DS duration. Entra is set in seconds and AD DS in minutes.

Learn's example: Entra at 120 seconds with AD DS at 60 seconds, and an Entra threshold of 10 with an AD DS threshold of 20. The goal is that Entra stops brute-force attacks such as password spray before they lock on-premises accounts. To check the on-premises policy, open Group Policy Management, edit the policy with your lockout settings, go to **Computer Configuration** > **Policies** > **Windows Settings** > **Security Settings** > **Account Policies** > **Account Lockout Policy**, and read the threshold and counter reset values.

For AD FS 2016 and 2019, Learn points to AD FS Extranet Lockout and Extranet Smart Lockout and recommends moving to managed authentication.

## Path B: Blocked by built-in protections

The smart lockout page says Microsoft Entra ID also analyzes signals such as IP traffic and anomalous behavior, and blocks malicious sign-ins by default, returning AADSTS50053 regardless of password validity.

The ID Protection page adds that very high confidence risky sign-ins are blocked automatically, most commonly with legacy authentication protocols or properties of a malicious attempt, and the log shows the reason *Sign-in was blocked by built-in protections due to high confidence of risk*. Two options to unblock:

- **Add the sign-in IPs to Trusted locations**, if the sign-in comes from a known company location.
- **Use a modern authentication protocol**, if the sign-in uses a legacy protocol.

For other kinds of blocks from risk-based policies, the same page lists signing in from a familiar location or device, excluding a user from the policy, or disabling the policy. Those apply to risk-based Conditional Access policies, not to this built-in block. I did not read anything that ties them to a 50053 built-in block, so I do not suggest them for it.

## A short triage (my advice)

This is my experience, not a Microsoft procedure:

1. Read the failure reason before you reset anything. A password reset does not help a user blocked from a bad IP.
2. If many users hit smart lockout at once, think about password spray, and look at the source IPs in the sign-in log.
3. For legacy protocol failures, find the client. Old mail apps and scripts are common causes in my experience.
4. In hybrid setups with pass-through authentication, verify the threshold and duration relation before you change either value.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Self-service password reset](https://www.m365.fm/entity/self-service-password-reset/)
- [Microsoft Entra Connect](https://www.m365.fm/entity/entra-connect/)

## Sources

- [Microsoft Entra authentication and authorization error codes (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/reference-error-codes)
- [Prevent Attacks Using Smart Lockout (Microsoft Learn)](https://learn.microsoft.com/entra/identity/authentication/howto-password-smart-lockout)
- [Remediate risks and unblock users (Microsoft Learn)](https://learn.microsoft.com/entra/id-protection/howto-identity-protection-remediate-unblock)
