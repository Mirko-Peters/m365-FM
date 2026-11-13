---
title: "Teams Direct Routing: Outbound Calls Fail but Inbound Calls Work"
summary: "Inbound PSTN calls reach Teams, but outbound calls fail and the SBC shows nothing or a SIP 504? Check the gateway, the user setup, the routing chain and the 504 reason text in this order."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [direct-routing, teams-phone, session-border-controller]
keypoints:
  - "Inbound and outbound calls use different checks. A working SIP OPTIONS exchange and working inbound calls do not prove that outbound routing is configured."
  - "Outbound routing is a chain: the user's voice routing policy, its PSTN usages, a voice route with a matching number pattern, and an enabled online PSTN gateway."
  - "A user with only a Teams Phone license has the call dropped when no route matches or all SBCs are unavailable. Users with a Calling Plan can fall back to it."
  - "For SIP 504, Microsoft publishes a table of reason texts that separate connection, TLS certificate, DNS and SIP format problems."
faq:
  - q: "Why do inbound calls work but outbound calls fail in Direct Routing?"
    a: "Inbound calls only need the SBC to reach Teams and the number to be assigned to a user. Outbound calls also need the user's voice routing policy, a PSTN usage, a voice route whose number pattern matches the dialed number, and an enabled gateway. A missing link in that chain breaks only outbound calls. Microsoft Learn describes these checks, and a Microsoft moderator named the same chain in a 2026 thread."
  - q: "What does SIP 504 mean in Direct Routing?"
    a: "On its 504 page, Microsoft lists reason texts that start with Unable to deliver INVITE or Unable to deliver ACK, followed by the detail. The detail points to a lost or refused connection, a TLS or certificate problem, a DNS name that does not resolve, or an invalid SIP message. Match the exact text to Microsoft's table to pick the right fix."
  - q: "Which SIP codes trigger failover to another SBC?"
    a: "Microsoft says the defaults are 408, 503 and 504. Failover happens only if the SBC has not sent any non-100 provisional response. Network-level failures such as a refused connection or a TLS timeout are retried from a different Microsoft datacenter."
  - q: "Does this checklist apply to Calling Plans or Operator Connect?"
    a: "No. Microsoft states that the outbound troubleshooting guidance is for Direct Routing PSTN calls and does not apply to Calling Plan or Operator Connect deployments."
---

Inbound calls from the phone network ring in Teams. The trunk looks healthy. But when a user dials out, the call fails. Sometimes Teams shows a SIP 504, and sometimes the Session Border Controller (SBC) logs show nothing at all.

Two Microsoft Q&A threads from spring 2026 describe exactly this. In one, an administrator confirmed that the trunk was up, that the SBC answered SIP OPTIONS and that inbound calls worked, but outbound calls failed with a 504 and the SBC saw no signaling. In the other, outbound calls from Teams left no trace on the SBC either. Neither thread has an accepted answer or a confirmation from the person who asked, so this article builds the checklist from Microsoft's documentation and uses the threads as the scenario. It is a troubleshooting guide, not an official Microsoft procedure.

## What the symptoms mean

Microsoft's page on [outbound Direct Routing issues](https://learn.microsoft.com/en-us/troubleshoot/microsoftteams/phone-system/direct-routing/issues-with-outbound-calls) sorts the problem into four cases. Find yours first.

1. The caller ID shown to the recipient is wrong.
2. Calls reach the SBC but no connection is made, and the SBC returns an error in the 400 to 699 range.
3. Some users cannot call.
4. No users can call, so calls probably never reach the SBC.

"The SBC sees nothing" points to case 3 or 4. The page applies to Direct Routing only, not to Calling Plan or Operator Connect.

## Step 1: Check that the gateway is enabled

If nobody can call out, Microsoft's first cause is a disabled gateway. In the Teams admin center, confirm that the gateway is available and enabled. In Teams PowerShell, `Enabled` must show `True`:

```powershell
Get-CsOnlinePSTNGateway | fl Identity,Fqdn,SipSignalingPort,MaxConcurrentSessions,Enabled
```

To enable a disabled gateway, Microsoft shows:

```powershell
Set-CsOnlinePSTNGateway -Identity "sbc2.contoso.com" -Enabled $true
```

The second cause on that page is a gateway that does not answer SIP OPTIONS because a firewall or another network device blocks the messages. Allow the SIP signaling IP addresses and FQDNs from the Direct Routing planning page on every device between the SBC and the internet. In your threads this was already ruled out, because OPTIONS worked.

## Step 2: Check the user

If only some people cannot call, look at the user's provisioning. If the dial pad is missing on the **Calls** tab, run:

```powershell
Get-CsOnlineUser -Identity <user> | fl Identity,EnterpriseVoiceEnabled,HostedVoiceMail,OnPremLineURI
```

Then compare the result with Microsoft's page on [enabling users for Direct Routing](https://learn.microsoft.com/en-us/microsoftteams/direct-routing-enable-users). That page assigns the number and turns on Enterprise Voice in one step:

```powershell
Set-CsPhoneNumberAssignment -Identity "<user>" -PhoneNumber <number> -PhoneNumberType DirectRouting
```

If the number is managed on-premises, the page uses `-EnterpriseVoiceEnabled $true` instead. On licensing, the troubleshooting page names an E3 with Phone System or E5 license, while the enable-users page only says to assign a license and links to the licensing requirements in the Direct Routing planning page. Check the current requirement for your tenant before you change anything.

## Step 3: Walk the routing chain

This is the step that explains "inbound works, outbound fails". Microsoft's [voice routing page](https://learn.microsoft.com/en-us/microsoftteams/direct-routing-voice-routing) describes four parts:

- The **voice routing policy** is a container for PSTN usages and is assigned to users.
- A **PSTN usage** is a container for voice routes.
- A **voice route** is a number pattern plus the online PSTN gateways that serve it.
- The **online PSTN gateway** points to the SBC.

For one user, check these points:

1. The user has a voice routing policy. In the Teams admin center, open **Users**, select the user, then **Policies**. You can also run `Get-CsOnlineUser "<user>" | Select OnlineVoiceRoutingPolicy`.
2. The policy contains the PSTN usage that holds your route.
3. A voice route has a number pattern that matches the number as it is dialed. The patterns are regular expressions and match the called number. Microsoft's examples use the full `+` format, so test with a full E.164 number first. If the number has an extension, only the part before `;ext=` is matched.
4. The route lists a gateway that is enabled.
5. The order is right. Usages are checked in order, and the first usage with a match wins. A catch-all such as "International" must come after more specific usages. Lower priority numbers are tried first, and SBCs inside one route are tried in random order.

Microsoft's page on outbound issues adds one trap. If you paste a pattern from Word or another rich text editor, invisible characters can come along and break routing without any visible sign. Remove the policy and type it again in a plain editor such as Notepad.

One more detail from the voice routing page explains why users see a dropped call. Users who have only Teams Phone have the call dropped if no route matches or all SBCs are unavailable. Users who also have a Calling Plan fall back to it. The same page warns that changing the global (Org-wide default) voice routing policy affects all voice-enabled users, including Calling Plan and Operator Connect users, so use custom policies assigned per user.

In the Teams admin center, the routing objects are under **Voice**, then **Direct Routing** (PSTN usages and **Voice routes**), and under **Voice routing policies**.

## Step 4: If calls reach the SBC and fail

When the SBC does receive the call and answers with an error in the 400 to 699 range, Microsoft lists three causes:

- Another telephony device on the same network as the SBC caused the failure. Troubleshoot that device.
- The PSTN provider sent the failure. This is most likely with SIP 403 or 404. Contact the provider.
- The cause is unknown. Contact the SBC vendor.

If the failure is a 504 from Teams, use Microsoft's [SIP 504 page](https://learn.microsoft.com/en-us/troubleshoot/microsoftteams/phone-system/direct-routing/microsoft-sip-response-codes-504). It is a table of exact reason texts. Match the text from your call, not just the number:

- A disconnected or refused connection, or no response, means: check that the SBC is working, reachable on the right IP and port, and not blocked by a firewall.
- A TLS negotiation failure with a certificate name, expiry or untrusted root means: check the SBC certificate. Microsoft asks for a certificate signed by a public root CA from its trusted list, and, if the SBC has several TLS profiles, for the profile that uses a Direct Routing-trusted certificate.
- "No such host is known" means the SBC FQDN does not resolve in DNS. A message about no data of the requested type points to the DNS record type. Microsoft's advice is to check that A or AAAA records are configured, and it adds that a record was found, typically a TXT record added for domain verification, but not an A or AAAA record.
- "Invalid Request/Response line" means the SBC sent a SIP message in a wrong format, for example without `SIP/2.0` in the right headers.

This explains one detail in the thread. A TLS or connection failure can happen before any SIP message is exchanged. This is my reading, not a statement from Microsoft: if the SBC's SIP log is empty, also check its TLS and network logs, not only the SIP trace. A moderator in the thread pointed the other way, to the Teams side, because no signaling arrived at the SBC. Both views are consistent with Microsoft's pages, which is why the steps above cover both.

## Step 5: Know the failover behavior

Microsoft's page on [trunk failover](https://learn.microsoft.com/en-us/microsoftteams/direct-routing-trunk-failover-on-outbound-call) says that if a trunk cannot connect, Teams retries the same trunk from a different Microsoft datacenter, possibly in another region. A common cause of trouble here is an SBC access list that does not include all Microsoft Direct Routing datacenter IP addresses. For SIP responses, the defaults are 408, 503 and 504, and failover happens only if the SBC has not sent any non-100 provisional response. You can change the codes with `Set-CSOnlinePSTNGateway -FailoverResponseCodes`. The page does not say whether your value replaces the defaults or adds to them, so test before relying on it.

## Step 6: Collect data for support

If all checks pass, collect the exact SIP reason text, the time in UTC, the calling user, the dialed number and the SBC logs (SIP, TLS and network) for the same minute. A moderator in the April 2026 thread recommended a support request through the Microsoft 365 admin center (Support, Help & Support) so that an engineer can check the backend configuration.

## Wrong caller ID

If the call works but the displayed number is wrong, Microsoft's cause is a mismatch between the `From` and `P-Asserted-Identity` headers, because the phone network gives priority to the second one. The fix is on the SBC: remove the `P-Asserted-Identity` header or change its content.

## Related

- [Direct Routing](https://www.m365.fm/entity/direct-routing/)
- [Teams Phone](https://www.m365.fm/entity/teams-phone/)
- [Session Border Controller](https://www.m365.fm/entity/session-border-controller/)

## Sources

- [Microsoft Learn: Issues that affect outbound Direct Routing calls](https://learn.microsoft.com/en-us/troubleshoot/microsoftteams/phone-system/direct-routing/issues-with-outbound-calls)
- [Microsoft Learn: Direct Routing call routing](https://learn.microsoft.com/en-us/microsoftteams/direct-routing-voice-routing)
- [Microsoft Learn: Enable users for Direct Routing](https://learn.microsoft.com/en-us/microsoftteams/direct-routing-enable-users)
- [Microsoft Learn: SIP response code 504](https://learn.microsoft.com/en-us/troubleshoot/microsoftteams/phone-system/direct-routing/microsoft-sip-response-codes-504)
- [Microsoft Learn: Trunk failover on outbound calls](https://learn.microsoft.com/en-us/microsoftteams/direct-routing-trunk-failover-on-outbound-call)
- [Microsoft Q&A: Unable to make Teams calls to external numbers (April 2026)](https://learn.microsoft.com/en-us/answers/questions/5875604/unable-to-make-teams-calls-to-external-numbers)
- [Microsoft Q&A: Teams outbound calls issue (March 2026)](https://learn.microsoft.com/en-us/answers/questions/5823185/teams-outbound-calls-issue)
