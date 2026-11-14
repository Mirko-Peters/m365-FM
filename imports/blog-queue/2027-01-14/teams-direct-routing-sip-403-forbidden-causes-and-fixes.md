---
title: "Teams Direct Routing SIP 403 Forbidden: Causes and Fixes by Microsoft Response Code"
summary: "A SIP 403 on Teams Direct Routing maps to specific Microsoft response codes such as 10199, 510532, 510560 and 510562. Look up your code, then fix calling policy, trunk FQDN, Enterprise Voice or voice routes."
status: review
publish: false
author: mirko-p
date: 2027-01-14
topics: [teams-phone, direct-routing, session-border-controller]
keypoints:
  - "Learn lists 403 combinations with Microsoft response codes 10199, 10500, 10553, 510532, 510534, 510546, 510559, 510560, 510562, 510563 and 560403."
  - "10199 means private calling is disabled for the callee; turn on Make private calls in the calling policy."
  - "510532 No trunk config was found: check the SBC FQDN and that the Contact header FQDN is registered under your tenant."
  - "510560 and 510562 point to a missing Phone System license or Enterprise Voice and Direct Routing enablement."
  - "510559 No viable path: the dialed number must match a number pattern in a voice route for the user."
faq:
  - q: "What does SIP 403 mean in Direct Routing?"
    a: "Microsoft Learn does not treat 403 as one error. It lists combinations of the SIP 403 code with Microsoft response codes, each with its own suggested action. The Microsoft response code in your SBC trace tells you which row applies. The guidance covers Direct Routing PSTN calls only, not Calling Plan or Operator Connect."
  - q: "How do I fix 510532 No trunk config was found?"
    a: "Learn says to verify that calls are sent from the correct SBC FQDN associated with your tenant, and that the FQDN in the Contact header of the SIP INVITE is registered under your tenant. For the variant with RuntimeApi trunk config not found, verify the trunk configuration for the tenant."
  - q: "What about 510560 and 510562?"
    a: "For 510560, user is not Enterprise Voice enabled, Learn says to verify the user has a Phone System license and enable Enterprise Voice. For 510562, user is not allowed to make outbound PSTN calls, verify the Phone System license and that the user is correctly enabled for Direct Routing."
  - q: "What does 510559 No viable path mean?"
    a: "Learn says to make sure the dialed number matches a number pattern in a voice route for the user. It adds that this can occur because a wrong number was dialed or because the customer's own policy prevents calls to certain countries or number patterns."
  - q: "What if the 403 comes from the SBC itself?"
    a: "For 560403 Forbidden; Call rejected, Learn suggests checking the logs on the SBC to find out why the call was rejected."
---

A SIP 403 on a Direct Routing call is a family of errors. Microsoft Learn lists eleven Microsoft response codes that come with a 403, each with its own action. Find the Microsoft response code in your SBC trace or call log, then use the matching section below. The guidance is for Teams Direct Routing PSTN calls only and does not apply to Calling Plan or Operator Connect.

## Quick lookup

| Microsoft code | Description in Learn | Where to look |
| --- | --- | --- |
| 10199 | Call rejected as private calling is disabled for the callee | Calling policy |
| 10500 | Current call site state prevents fork to this entity | Location-Based Routing |
| 10553 | Participant call leg canceled because an invite to a required recorder failed | Compliance recording |
| 510532 | RuntimeApi trunk config not found for customer, or No trunk config was found | Trunk and SBC FQDN |
| 510534 | Blocked calling number for customer | Inbound call blocking |
| 510546 | No trunk config found by LBR selection criteria | Location-Based Routing and toll bypass |
| 510559 | No viable path (Forbidden) | Voice routes |
| 510560 | User is not Enterprise Voice enabled | License and Enterprise Voice |
| 510562 | User is not allowed to make outbound PSTN calls | License and Direct Routing enablement |
| 510563 | User is only allowed to make domestic calls | Calling restriction |
| 560403 | Forbidden; Call rejected | SBC logs |

## Calling policy and user enablement

**10199, private calling disabled for the callee.** In the calling policy assigned to the affected user, turn on the **Make private calls** setting.

**510560, user is not Enterprise Voice enabled** (also with the text "not allowed to make user based dial out"). Verify the user has a Phone System license and enable Enterprise Voice for the user.

**510562, user is not allowed to make outbound PSTN calls.** Verify the user has a Phone System license and is correctly enabled for Direct Routing. Learn links an article on issues that affect outbound Direct Routing calls.

**510563, only domestic calls allowed.** Check whether the user is limited to domestic calls. The call was international.

## Trunk and SBC configuration

**510532, trunk config not found for customer.** Verify the trunk (gateway) configuration for the specific tenant. Learn points to its article on configuring call routing for Direct Routing.

**510532, no trunk config was found.** Verify that calls come from the correct SBC FQDN associated with your tenant, and that the FQDN in the Contact header of the SIP INVITE is registered under your tenant. A related fact from Learn's SIP protocol page: the Contact header must carry the SBC FQDN, and an INVITE or OPTIONS with an IP address instead of an FQDN in the Contact header is refused with 403 Forbidden.

**560403, Forbidden; Call rejected.** Check the logs on the SBC to find out why the call was rejected. Learn gives no further detail for this code.

## Routing

**510559, no viable path.** Make sure the dialed number in Teams matches a number pattern in a voice route for the user. Learn says it can also happen because a wrong number was dialed or because your own policy blocks calls to a country or number pattern.

**510546, no trunk config found by LBR selection criteria.** If you use Location-Based Routing for Direct Routing, check whether toll bypass is restricted for the user's location. If it is, Learn says the error is expected and no action is needed. Otherwise fix the misconfiguration.

If you do not use Direct Routing, check the `PreventTollBypass` setting in the Teams calling policy. Learn gives these commands:

```powershell
Get-CsTeamsCallingPolicy -Identity <PolicyName>
Set-CsTeamsCallingPolicy -Identity <PolicyName> -PreventTollBypass $false
```

Run the second command only if the first shows `PreventTollBypass` as `True` and that value is not intended.

**10500, call site state prevents fork.** Verify that Location-Based Routing is set up correctly and fix misconfigurations.

## Compliance and call blocking

**10553, required recorder invite failed.** Verify that compliance recording is set up correctly, including provisioning the recorder bot. Work with the compliance recording partner to find out why the bot cannot be invited.

**510534, blocked calling number.** Check the inbound call blocking settings for blocked caller numbers.

## A working order

This is my suggested order, not a Microsoft sequence.

1. Capture the call with the SIP response and the Microsoft response code.
2. Look up the code above. Do not apply fixes from other rows.
3. For user-specific codes (10199, 510560, 510562, 510563) check one affected user and one working user side by side: license, policy, number and routing policy.
4. For tenant-wide codes (510532) check the SBC FQDN and Contact header first.
5. For routing codes (510559, 510546, 10500) review voice routes, number patterns and Location-Based Routing.

## What to capture from the trace

This section is my advice, not a Microsoft statement.

- The full SIP response line and the Microsoft response code that comes with it, plus the time of the call to the second, so that the SBC log and any Microsoft-side record can be matched.
- The calling and called numbers in the format the SBC sent them, because number pattern matching is the cause behind several of the routing codes.
- The FQDN in the Contact header of the INVITE or OPTIONS and the FQDN registered for the trunk, side by side.
- The user's calling policy, voice routing policy and license state, if the code points to a single user.

With these four items, most 403 cases in the table can be assigned to a row without another test call.

## Related

- [Microsoft Teams Phone](https://www.m365.fm/entity/teams-phone/)
- [Direct Routing](https://www.m365.fm/entity/direct-routing/)
- [Session Border Controller](https://www.m365.fm/entity/session-border-controller/)

## Sources

- [SIP 403 and Microsoft response codes - Microsoft Teams (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/microsoftteams/phone-system/direct-routing/microsoft-sip-response-codes-403)
- [Teams Phone System Direct Routing: SIP protocol - Microsoft Teams (Microsoft Learn)](https://learn.microsoft.com/microsoftteams/direct-routing-protocols-sip)
