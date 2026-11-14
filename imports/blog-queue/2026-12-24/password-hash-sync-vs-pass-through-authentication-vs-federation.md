---
title: "Password Hash Sync vs Pass-Through Authentication vs Federation: Choosing a Sign-In Method"
summary: "Compare Microsoft Entra password hash synchronization, pass-through authentication and federation: where sign-in happens, infrastructure, user account states, outage behavior, Conditional Access and Identity Protection notes."
status: review
publish: false
author: mirko-p
date: 2026-12-24
topics: [entra-connect, entra-id]
keypoints:
  - "Microsoft's decision guide starts with whether Entra ID can handle sign-in without on-premises components, which is the simplest case for password hash sync."
  - "Pass-through authentication enforces on-premises account policy at sign-in, such as disabled, locked out or expired accounts and sign-in hours. Learn recommends three agents."
  - "Federation is needed when an authentication requirement is not natively supported, and Learn says it is more complex to operate and troubleshoot."
  - "Learn says Entra ID Protection needs password hash sync whichever sign-in method you choose, to provide the Users with leaked credentials report."
  - "Fail over from pass-through authentication to password hash sync is not automatic. You switch the sign-on method manually in Entra Connect."
faq:
  - q: "Which method needs the least infrastructure?"
    a: "Microsoft Learn says password hash synchronization requires the least effort for deployment, maintenance and infrastructure. The comparison table lists no on-premises server requirements for it, while pass-through needs one server for each additional agent and federation needs two or more AD FS servers and two or more WAP servers."
  - q: "Does pass-through authentication respect on-premises account states?"
    a: "Yes. Learn says it enforces the on-premises account policy at sign-in, so access is denied when the account is disabled, locked out, expired or the password is expired or the attempt is outside permitted sign-in hours. Password hash sync lists disabled accounts with up to a 30-minute delay."
  - q: "Why enable password hash sync if I use PTA or federation?"
    a: "Learn says Microsoft Entra ID Protection requires password hash sync regardless of sign-in method for the Users with leaked credentials report. It also recommends it as a backup for federation and notes organizations with it enabled recovered faster after on-premises outages."
  - q: "How many pass-through authentication agents should I run?"
    a: "Learn recommends three lightweight agents, which means two extra agents in addition to the first on the Microsoft Entra Connect server. Agents need access to on-premises Active Directory and outbound internet access, and deploying them in a perimeter network is not supported."
  - q: "When do I need federation?"
    a: "Learn says a federated solution is required when you have an authentication requirement that Microsoft Entra ID doesn't support natively, such as third-party authentication solutions or multi-site on-premises authentication."
---

Hybrid organizations choose one of three ways for users to sign in to Microsoft Entra ID with their on-premises password. This comparison follows Microsoft Learn's hybrid authentication decision guide and keeps to what it states.

## The three methods

- **Password hash synchronization (PHS).** The simplest way to enable authentication for on-premises directory objects in Entra ID. Users use the same username and password without extra infrastructure.
- **Pass-through authentication (PTA).** A software agent on one or more on-premises servers validates passwords directly against on-premises Active Directory, so validation does not happen in the cloud.
- **Federation.** Entra ID hands authentication off to a separate trusted system, such as AD FS, to validate the password.

## Questions in the decision guide

1. Can Entra ID handle sign-in without relying on on-premises components to verify passwords?
2. Can Entra ID hand off sign-in to a trusted provider such as AD FS?
3. Do you need user-level Active Directory policies on each sign-in, such as account expired, disabled, password expired, locked out or sign-in hours? If so, Entra ID needs some on-premises components.
4. Do you need a feature not natively supported, such as third-party authentication or a multi-site on-premises solution?
5. Identity Protection needs PHS whichever method you pick.

## Comparison

| Consideration | Password hash sync | Pass-through | Federation (AD FS) |
| --- | --- | --- | --- |
| Where authentication happens | In the cloud | In the cloud, after a secure exchange with the on-premises agent | On-premises |
| On-premises servers | None | One server per additional agent | Two or more AD FS servers and two or more WAP servers |
| TLS or SSL certificate | No | No | Yes |
| Health monitoring | Not required | Agent status in the Entra admin center | Entra Connect Health |
| Account states enforced | Disabled accounts, with up to a 30-minute delay | Disabled, locked out, expired, password expired, sign-in hours | Same as pass-through |
| Extra scenarios | Smart password lockout, leaked credential reports (P2) | Smart password lockout | Multisite low-latency authentication, AD FS extranet lockout, third-party identity integration |

## Detail by method

### Password hash sync

Least effort for deployment, maintenance and infrastructure. It is highly available as a cloud service, and Learn recommends a second Entra Connect server in staging mode as standby. Learn notes PHS doesn't immediately enforce changes in on-premises account state: a user keeps access to cloud apps until the state syncs.

### Pass-through authentication

Needs one or more lightweight agents, with three recommended, on existing servers that reach on-premises AD DS and have outbound internet. Deploying agents in a perimeter network is not supported. It enforces on-premises account policy at sign-in. Failover to PHS is not automatic, and you switch manually in Entra Connect.

### Federation

The federated system is maintained outside Entra ID's control. Learn says it is needed for requirements Entra ID does not support natively, and recommends deploying PHS alongside it as a backup. It says federation is more complex to operate and troubleshoot than cloud authentication.

## Conditional Access, MFA and Identity Protection

- Conditional Access needs Microsoft Entra ID P1 licenses and Identity Protection needs P2, according to the page.
- Organizations that need MFA with PHS or PTA must use Microsoft Entra multifactor authentication or Conditional Access custom controls, and can't use third-party or on-premises MFA that relies on federation.
- Custom controls in Conditional Access don't currently support device registration.
- If you can't join Windows devices to Entra ID, Learn recommends seamless SSO with PHS.

## Recommendations on the page

- Avoid single points of failure for PTA and federation by deploying redundant servers.
- Enable PHS regardless of the method. Learn cites organizations with PHS back online in hours after an on-premises outage, while others took weeks to restore on-premises identity.

## How to choose

1. If no requirement forces otherwise, start with PHS.
2. If you must enforce on-premises account states and sign-in hours at every sign-in, consider PTA, plus PHS for leaked credential reports.
3. If you need third-party authentication or multi-site on-premises sign-in, federation is the option Learn names, with PHS as backup.

## Limits of the page

The page does not give numbers for sign-in latency or agent throughput, and it does not cover Entra Cloud Sync. Check the specific method documentation before committing.

## Related

- [Microsoft Entra Connect](https://www.m365.fm/entity/entra-connect/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)

## Sources

- [Choose the right authentication method for your Microsoft Entra hybrid identity solution](https://learn.microsoft.com/entra/identity/hybrid/connect/choose-ad-authn)
