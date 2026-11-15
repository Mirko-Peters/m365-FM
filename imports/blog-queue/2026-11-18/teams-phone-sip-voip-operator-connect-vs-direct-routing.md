---
title: "Teams Phone: SIP, VoIP and Operator Connect vs Direct Routing Explained"
summary: "How Teams Phone connects to the phone network: where SIP fits in, how Calling Plans, Operator Connect, Teams Phone Mobile and Direct Routing differ, and what each one needs, based on Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [teams-phone, direct-routing, operator-connect, teams-admin-center]
keypoints:
  - "Teams Phone is the call control and PBX layer in Microsoft 365. A separate PSTN solution provides phone numbers and access to the public phone network."
  - "Microsoft documents four PSTN options: Calling Plan, Operator Connect, Teams Phone Mobile and Direct Routing. You can combine them."
  - "SIP appears in two places: Direct Routing, where a certified SBC talks SIP over TLS to Microsoft, and SIP Gateway, which lets compatible SIP phones act as Teams endpoints."
  - "Direct Routing needs a Microsoft-certified SBC, a verified domain for the SBC FQDN (not onmicrosoft.com) and a trusted certificate."
  - "Operator Connect avoids running your own SBC. The operator handles PSTN connectivity and number porting, and you administer users in the Teams admin center."
faq:
  - q: "What does SIP mean in Teams Phone?"
    a: "The Microsoft pages read for this article do not define SIP. They use it in two ways: Direct Routing, where the Session Border Controller exchanges SIP signaling with Microsoft over TLS on TCP port 5061, and SIP Gateway, which lets compatible SIP devices sign in to Teams and act as Teams endpoints."
  - q: "Is Teams Phone the same as VoIP?"
    a: "Microsoft Learn does not use the term VoIP on the Teams Phone pages read here. It says calls between Teams users are handled natively in Teams and never go to the PSTN, and that Teams Phone adds options to reach the PSTN for outside calls."
  - q: "Do I need a Teams Phone license if I use Direct Routing?"
    a: "Yes. According to Microsoft Learn, Direct Routing users require Microsoft Teams and Teams Phone, and additional licensing may be needed depending on the deployment. A PSTN solution is separate from the Teams Phone license."
  - q: "Can I use more than one PSTN option in the same tenant?"
    a: "Yes. Microsoft Learn says organizations can combine PSTN connectivity options, and its example mixes Calling Plans, Teams Phone Mobile, Operator Connect and Direct Routing for different groups of users."
  - q: "Do SIP desk phones work with Teams?"
    a: "Compatible ones do, through SIP Gateway. Microsoft Learn lists supported vendors and firmware, and requires users to have a phone number with PSTN calling enabled. The calling policy setting that allows SIP devices is off by default."
---

Teams Phone is the part of Microsoft 365 that handles call control and PBX features. It does not, by itself, connect you to the public phone network. For that you add a PSTN solution: Microsoft as the carrier (Calling Plan), a certified operator (Operator Connect or Teams Phone Mobile), or your own carrier through a Session Border Controller (Direct Routing). SIP is the signaling protocol you meet mostly in the last case, and in SIP Gateway for desk phones.

## License and PSTN are two separate things

Microsoft Learn describes two components of Teams Phone. One is the license for the Teams Phone application. The other is at least one PSTN operator solution that gives your tenant phone numbers and access to domestic, international and emergency calling. In Microsoft's words, a PSTN solution is separate from a Teams Phone license.

Calls between Teams users in your organization are handled natively in Teams and never go to the PSTN. You only need a PSTN solution for calls to and from regular phone numbers.

On licensing, Microsoft Learn lists Teams Phone Standard as an add-on to Teams. For external calls you also choose a PSTN option. Some options need an additional license, some do not. The Calling Plan can be bought as a separate add-on or in a Teams Phone with Calling Plan bundle.

## The four PSTN options

| Option | Who provides the PSTN | What it requires |
|---|---|---|
| Calling Plan | Microsoft | A Teams Calling Plan license |
| Operator Connect | A certified operator | A contract with the operator |
| Teams Phone Mobile | A certified mobile operator | A contract with the operator |
| Direct Routing | Your chosen carrier | A carrier contract and a certified SBC |

Microsoft's own guidance on fit, from the comparison table:

- **Calling Plan:** a fully Microsoft-managed solution with the simplest deployment.
- **Operator Connect:** working with a participating provider while managing users and numbers in Teams.
- **Teams Phone Mobile:** mobile-first employees who want one business number across Teams and their mobile device.
- **Direct Routing:** advanced telephony integration, existing infrastructure or maximum flexibility.

Teams Phone Mobile supports user phone numbers only. The other three also support Audio Conferencing and voice application numbers. You can mix options. Microsoft's example starts with Calling Plans for everyone and adds Teams Phone Mobile, Operator Connect and Direct Routing for specific groups.

## Where SIP fits in

The Learn pages used here do not define SIP or VoIP. They show SIP in two concrete places.

**Direct Routing.** The SBC connects your carrier's trunks to Teams. The SBC exchanges SIP signaling with the Microsoft SIP proxy over TLS. Microsoft documents `sip.pstnhub.microsoft.com` as the primary signaling FQDN, with `sip2` and `sip3` as secondary and tertiary, on TCP port 5061. Media goes through Microsoft Media Processors unless Media Bypass is enabled.

**SIP Gateway.** This is for devices, not carriers. It lets compatible SIP phones sign in with corporate credentials and act as Teams endpoints. Microsoft lists Poly, Yealink and AudioCodes among supported vendors, and Cisco phones must run multiplatform firmware. Users need a phone number with PSTN calling enabled.

## Direct Routing: what Microsoft requires

- A Microsoft-certified SBC. Microsoft may decline support requests involving non-certified SBCs.
- A public IP address reachable by Teams and a public DNS entry for the SBC FQDN.
- An SBC FQDN in a verified Microsoft 365 domain. The default `*.onmicrosoft.com` domain does not work.
- A trusted TLS certificate that uses the SBC FQDN as CN or SAN and is signed by a CA in the Microsoft Trusted Root Program.
- Firewall rules for signaling to all Microsoft Teams IP ranges, not only the addresses returned by DNS.
- Users homed online, with Teams and Teams Phone licenses.

Direct Routing is not supported in Islands mode.

## Operator Connect: what Microsoft requires

Operator Connect suits you if you want a managed PSTN without deploying and maintaining SBCs. The onboarding prerequisites on Learn are:

1. Users have the required Teams Phone licenses.
2. Users are in Teams Only mode.
3. You have the right administrator permissions for Teams Phone.
4. A certified operator is available in the countries where you deploy.

You then enable the operator in the Teams admin center and assign numbers to users. The support split is clear: Microsoft handles Teams and the admin center, the operator handles PSTN connectivity, number provisioning and porting, and PSTN troubleshooting.

## Enable SIP devices for users

If you plan SIP desk phones, first check availability:

1. Open the Teams admin center and select **Teams devices**. If a **SIP devices** tab is visible, SIP Gateway is enabled.
2. Go to **Voice** > **Calling policies** and open the policy assigned to your users.
3. Turn on **SIP devices can be used for calls** and save.

The default is off, and policy changes can take up to 24 hours. PowerShell equivalent: `Set-CsTeamsCallingPolicy -Identity <PolicyName> -AllowSIPDevicesCalling $True`. Microsoft also notes that SIP Gateway does not publish presence, so presence-based routing is not supported.

## Common mistakes

- Buying a Teams Phone license and expecting phone numbers. The PSTN solution is a separate decision.
- Using a `*.onmicrosoft.com` name for the SBC.
- Opening the firewall only for DNS-resolved addresses.
- Assigning Operator Connect numbers to users who are not in Teams Only mode.
- Forgetting that SIP devices stay blocked until the calling policy allows them.

## Related

- [Teams Phone](https://www.m365.fm/entity/teams-phone/)
- [Direct Routing](https://www.m365.fm/entity/direct-routing/)
- [Operator Connect](https://www.m365.fm/entity/operator-connect/)
- [Session border controller](https://www.m365.fm/entity/session-border-controller/)

## Sources

- [PSTN connectivity options for Teams Phone](https://learn.microsoft.com/en-us/microsoftteams/pstn-connectivity)
- [Plan Direct Routing](https://learn.microsoft.com/en-us/microsoftteams/direct-routing-plan)
- [Plan Operator Connect](https://learn.microsoft.com/en-us/microsoftteams/operator-connect-plan)
- [What is Teams Phone](https://learn.microsoft.com/en-us/microsoftteams/what-is-phone-system-in-office-365)
- [Teams add-on licensing](https://learn.microsoft.com/en-us/microsoftteams/teams-add-on-licensing/microsoft-teams-add-on-licensing)
- [Plan for SIP Gateway](https://learn.microsoft.com/microsoftteams/sip-gateway-plan)
- [Configure SIP Gateway](https://learn.microsoft.com/en-us/microsoftteams/sip-gateway-configure)
