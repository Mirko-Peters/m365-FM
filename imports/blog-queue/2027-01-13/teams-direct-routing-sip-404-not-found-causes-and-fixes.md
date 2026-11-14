---
title: "Teams Direct Routing SIP 404 Not Found: Causes and Fixes"
summary: "A SIP 404 on a Teams Direct Routing call has two documented Microsoft response codes, 10202 and 511404. See what each means, how number format matters and which SBC settings to check."
status: review
publish: false
author: mirko-p
date: 2027-01-13
topics: [teams-phone, direct-routing, session-border-controller]
keypoints:
  - "Microsoft Learn lists two SIP 404 combinations for Direct Routing: response code 10202 and response code 511404."
  - "10202 means a replacement call was not found, seen in call merge and consultative transfer when the SBC retries after a failed first attempt."
  - "511404 means the reverse number lookup could not find the user, so the callee number format must match what is assigned to the user or resource account."
  - "Microsoft usually expects calls in E.164 normalized format, and the Request-URI phone number must contain a plus sign."
  - "This guidance applies to Direct Routing only, not to Calling Plan or Operator Connect deployments."
faq:
  - q: "What does SIP 404 mean for Teams Direct Routing?"
    a: "Microsoft Learn does not give one meaning. It lists two combinations of the SIP 404 code with Microsoft response codes: 10202, replacement call was not found, and 511404, getting user info by number from RuntimeAPI failed. The Microsoft response code tells you which case you have."
  - q: "How do I fix Microsoft response code 511404?"
    a: "Learn says this code indicates the user cannot be found during the reverse number lookup. The fix is to make sure the callee number format on your SBC or PSTN trunk provider matches the format assigned to the user or resource account. Microsoft usually expects E.164 normalized numbers with country code, network destination code and subscriber number."
  - q: "What is response code 10202 with SIP 404?"
    a: "The Learn page describes it as replacement call was not found. In call merge and consultative transfer scenarios the SBC might retry the call if the first attempt fails, so Microsoft suggests checking whether your SBC is configured to try a replacement call after an initial failure."
  - q: "Does this apply to Calling Plans or Operator Connect?"
    a: "No. The Learn page notes that its guidance is intended for Teams Direct Routing PSTN calls and does not apply to Microsoft Calling Plan or Operator Connect deployments."
  - q: "Does the phone number need a plus sign?"
    a: "According to the Direct Routing SIP protocol page on Microsoft Learn, the phone number in the Request-URI must currently contain a plus sign. The From header number also needs a plus sign for blocked-number checks and caller name lookup to work."
---

A SIP 404 on a Direct Routing call is not one error. Microsoft Learn lists two combinations of SIP 404 with a Microsoft response code, and each has a different fix. Response code **511404** means the user could not be found by the number that was dialed, which usually points to a number format mismatch. Response code **10202** means a replacement call was not found, which relates to call merge and consultative transfer. Read the Microsoft response code in your SBC logs first.

The Learn guidance covers Teams Direct Routing PSTN calls only. It does not apply to Calling Plan or Operator Connect deployments.

## Step 1: Find the Microsoft response code

The SIP status line alone is not enough. Your SBC trace or the Direct Routing diagnostics should show a Microsoft response code next to the 404. Learn lists these two:

| Microsoft code | Description | Direction of the fix |
| --- | --- | --- |
| 10202 | Replacement call was not found | SBC retry behavior in transfer and merge scenarios |
| 511404 | Getting user info by number from RuntimeAPI failed | Number format and user lookup |

If you see a different Microsoft response code, this page does not cover it. Learn publishes separate pages for other SIP codes.

## Fix for 511404: the user cannot be found

Learn says this code indicates the user cannot be found during the reverse number lookup. To fix it, make sure the callee number format sent by your SBC or PSTN trunk provider matches the format assigned to the user or resource account. Microsoft usually expects calls in **E.164 normalized format**: country or region code, network destination code and subscriber number.

What to check, based on the Direct Routing SIP protocol page on Learn:

1. **Plus sign in the Request-URI.** For incoming calls the Request-URI is used to match the phone number to a user. The number must currently contain a plus sign, for example `INVITE sip:+18338006777@sip.pstnhub.microsoft.com`.
2. **Plus sign in the From header.** Learn says the From header is used to check the caller against the callee's blocked number list and to look up the caller's name. For those lookups the number must also contain a plus sign.
3. **The assigned number.** Compare the number in the SBC trace with the number assigned to the user or resource account. Mismatches in country code, extension notation or leading digits are the usual suspects. That list is my practical advice, not text from Learn.
4. **The tenant lookup.** Before the number lookup, the SIP proxy finds the tenant. According to Learn it first tries the full FQDN from the Contact header as a registered domain name in a Microsoft 365 organization. If that fails, it removes the host portion and tries the remaining domain. If neither is found, the call fails. The reverse number lookup then runs in the tenant it found. If your SBC FQDN is registered in an unexpected tenant, the number will not be found there.
5. **The user=phone parameter.** Learn says that if `user=phone` is in the Request-URI, the service treats it as a phone number. If it is missing, the proxy applies heuristics to decide between a phone number and a SIP address. Microsoft recommends always adding the `user=phone` parameter to simplify call setup.

Learn also states that Microsoft does not support a third-party SIP proxy or user agent server between the Microsoft SIP proxy and the paired SBC if it modifies the Request-URI. If your trunk path rewrites the URI, test without it.

## Fix for 10202: replacement call not found

Learn describes this as appearing in call merge and consultative transfer. The SBC might retry the call if the first call attempt fails. The suggested action is to check whether your SBC is configured to try a replacement call after an initial failure.

Related facts from the SIP protocol page:

- Direct Routing rejects SIP requests with `Replaces` headers if the SBC sends them in ordinary requests, so check your SBC configuration and do not use Replaces headers in SIP requests.
- The same page also says the SBC must support Invite with Replaces for the replace option. These two statements concern different situations, so read that section before changing SBC settings.
- For transfers, Learn describes two methods. The SIP proxy uses a Refer sent to the SBC if the SBC reports Refer as an allowed method. Otherwise it acts as referee and the SBC must support Notify.

I did not find a documented step-by-step for 10202 beyond the one suggested action on the 404 page, so the transfer and retry checks above are the documented starting points.

## A short checklist for the SBC engineer

This list is my own summary of the sources above.

1. Capture the failing INVITE and the 404 response with the Microsoft response code.
2. If 511404: check the Request-URI and From number format, the plus sign, and the match with the number assigned in Teams.
3. If 10202: check the SBC retry behavior in transfer and merge flows.
4. Confirm the Contact header carries the SBC FQDN and not an IP address. Learn says an INVITE or OPTIONS with an IP in the Contact header is refused with 403 Forbidden, which is a different error.
5. Repeat the test call and compare traces.

## Related

- [Microsoft Teams Phone](https://www.m365.fm/entity/teams-phone/)
- [Direct Routing](https://www.m365.fm/entity/direct-routing/)
- [Session Border Controller](https://www.m365.fm/entity/session-border-controller/)

## Sources

- [SIP 404 and Microsoft response codes - Microsoft Teams (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/microsoftteams/phone-system/direct-routing/microsoft-sip-response-codes-404)
- [Teams Phone System Direct Routing: SIP protocol - Microsoft Teams (Microsoft Learn)](https://learn.microsoft.com/microsoftteams/direct-routing-protocols-sip)
