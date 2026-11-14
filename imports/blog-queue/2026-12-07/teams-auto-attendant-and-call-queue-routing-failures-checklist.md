---
title: "Teams Auto Attendant and Call Queue Routing Failures: A Troubleshooting Checklist"
summary: "Calls not reaching an auto attendant or call queue in Microsoft Teams Phone? Check resource account licensing, phone numbers, business hours, dial keys, agent settings, overflow and timeout rules in Microsoft's order."
status: review
publish: false
author: mirko-p
date: 2026-12-07
topics: [teams, teams-auto-attendant, teams-call-queues]
keypoints:
  - "Each resource account needs a Microsoft Teams Phone Resource Account license. External callers also need a service, Operator Connect or Direct Routing number on it."
  - "Run the Microsoft diagnostics at aka.ms/TeamsAADiag with the resource account name before changing settings."
  - "In auto attendants, dial keys beat directory search, the Operator needs a mapped key, and the time zone decides business hours."
  - "In call queues, agents must be Enterprise Voice users in TeamsOnly mode. Presence-based routing, opt-out and alert time decide who rings."
  - "Overflow (default 50 calls, range 0 to 200), timeout and No Agents rules can redirect or disconnect calls by design."
faq:
  - q: "Which license does a resource account need?"
    a: "Microsoft Learn says each resource account needs a free Microsoft Teams Phone Resource Account license. Teams Phone subscriptions include a zero-cost allocation, but the purchase process must still be completed. Resource accounts must stay disabled for sign-in."
  - q: "Why does a call to an auto attendant ignore my menu key and behave oddly?"
    a: "Microsoft Learn explains that dial keys are matched first, so callers who press a key are transferred before they finish a name or extension. Microsoft recommends setting Directory search to None when dial keys are assigned. Force listen also ignores input given before the menu ends."
  - q: "Why do new agents not receive calls?"
    a: "The call queue article says new users added to a group can take up to eight hours for their first call. Channel-based queues can take up to 24 hours to become fully operational. Agents also need to be Enterprise Voice enabled and in TeamsOnly mode."
  - q: "What are the default overflow settings of a call queue?"
    a: "Per Microsoft Learn, Maximum calls in the queue defaults to 50 with a range of 0 to 200. If it is set to 0 the greeting cannot play. Maximum wait time ranges from 0 seconds to 45 minutes. Both can disconnect or redirect the call."
  - q: "Does the time zone matter for after-hours routing?"
    a: "Yes. The auto attendant time zone calculates business hours, with 09:00 to 17:00 every day as the default. Learn also lists time zone changes that customers in parts of Canada must make after daylight saving time ended on November 1, 2026."
---

When calls do not reach an auto attendant or call queue, or reach the wrong place, the cause is almost always in one of four layers: the resource account, the call flow, the queue's agent rules, or the exception rules that send calls away on purpose. Check them in this order and stop when the symptom matches.

## Step 1: Run Microsoft's diagnostic

Microsoft's auto attendant article describes a diagnostic. Open https://aka.ms/TeamsAADiag, enter the resource account in **Username or Email** and select **Run Tests**. The tool looks for tenant, policy or resource account problems that stop calls from arriving and gives fix steps. Run it first because it can save the rest of the checklist.

## Step 2: Check the resource account

Learn's licensing page states:

- Each resource account needs a free **Microsoft Teams Phone Resource Account** license. Teams Phone subscriptions include a zero-cost allocation of these licenses, but the purchase step must still be completed.
- Resource accounts are disabled for sign-in and must remain so. Chat and presence do not work for them.
- A User Administrator or higher role is required to create and license them.
- Nested auto attendants and call queues that transfer externally do not need their own resource account. License the resource account on the first auto attendant or call queue receiving the call.

If a license is changed from **Teams Phone Standard** to the resource account license, do it in one license activity. Learn warns that removing, saving and then adding can leave the account not working, in which case a new resource account is recommended.

### Phone numbers

Internal callers reach the service through the resource account in Teams. External callers need a number on the account. Learn lists a Microsoft service number, an Operator Connect number or a Direct Routing number, or a hybrid number. Transfers to external numbers, the callback feature and on-behalf-of outbound calling line ID need additional setup depending on the number type: a funded pay-as-you-go license or Communications credits for Microsoft-provided numbers, and an online voice routing policy for Direct Routing. Transfers between Calling Plan, Operator Connect and Direct Routing trunks are not supported.

Assign numbers in the Teams admin center under **Voice** > **Resource accounts** > **Assign/unassign**.

## Step 3: Check the auto attendant call flow

In the Teams admin center, open **Voice** > **Auto attendants**. Points that Learn lists as common causes of misrouting:

- **Time zone and hours.** The time zone drives after-hours flows. The default business hours are 09:00 to 17:00 every day. Anything outside is after hours, and holidays use their own flow.
- **Daylight saving.** The page lists changes for Alberta, British Columbia, Manitoba and parts of Ontario after November 1, 2026, with specific time zone selections to switch to.
- **Dial keys versus directory search.** Dial keys are matched first. Microsoft recommends **None** for **Directory search** when keys are assigned, and a separate auto attendant for name or extension dialing.
- **Operator.** It is used when the caller makes no selection, when a processing error occurs or when the caller says or presses Operator. An Operator key must also be mapped on the menu, or the feature is not enabled.
- **Force listen.** Input before the menu finishes is ignored.
- **Destinations.** A person must be voice enabled. A shared voicemail needs "Let people outside the organization email this team" enabled in the Microsoft 365 admin center.
- **Nested flows.** An auto attendant reached through a voice app relies on the parent to answer first.
- **Directory.** A new user can take up to 36 hours to appear in the directory, and users hidden from the Exchange GAL are excluded.

## Step 4: Check the call queue

Learn lists these agent rules. Open **Voice** > **Call queues**.

- Agents must be Enterprise Voice enabled and, in the Teams app, in **TeamsOnly** mode. Others are not included in the routing list.
- Limits: up to 20 agents individually and up to 200 via groups or a Teams channel. New group members can take up to eight hours before their first call, and channel queues up to 24 hours to be fully operational.
- **Conference mode** is recommended on and required for consult or transfer.
- **Routing method:** attendant, serial, round robin or longest idle. Microsoft recommends round robin or longest idle.
- **Presence-based routing** is recommended on. Agents who are not Available are skipped. With longest idle it is required and enabled automatically.
- **Call agents can opt out:** opted-out agents do not receive calls whatever their status.
- **Agent alert time:** the recommended minimum is 20 seconds.

Calls from a Direct Routing gateway with Location-Based Routing can show a call toast that the agent cannot answer, until the call is answered, abandoned or times out.

## Step 5: Check exception handling

Calls can leave the queue by design. Learn lists:

| Setting | Default and range | Result |
|---|---|---|
| Maximum calls in the queue | 50, range 0 to 200 | Disconnect or redirect |
| Maximum wait time | 0 seconds to 45 minutes | Disconnect or redirect |
| No agents opted in or logged in | Queue call by default | Queue, disconnect or redirect |

A maximum of 0 prevents the greeting from playing. With **Longest idle** and **New Calls Only**, a known issue means the No Agents treatment does not work for newly queued calls. For callback to be offered, the call timeout must be long enough. Learn's example shows a 120-second timeout expiring before a roughly two-minute music file ends, so callback is never offered.

Redirect targets such as a person must be voice enabled. Shared voicemail destinations need a greeting without special characters.

## Step 6: Recheck changes after a short wait

Several settings need time. The pages give 8 hours (new group members), 24 hours (channels) and 36 hours (directory). Shift changes sync with the call queue in 15 minutes. Wait for these windows before concluding that a setting failed.

## Typical mistakes

- Putting a call queue directly on a number when business hours and holidays matter. Call queues have no separate off-hours routing, so Microsoft recommends an auto attendant in front.
- Turning presence-based routing off and then wondering why agents ring while busy.
- Setting overflow to 0 by accident.
- Forgetting the time zone after a daylight saving change.

## Related

- [Teams auto attendant](https://www.m365.fm/entity/teams-auto-attendant/)
- [Teams call queues](https://www.m365.fm/entity/teams-call-queues/)
- [Teams Phone](https://www.m365.fm/entity/teams-phone/)
- [Public switched telephone network (PSTN)](https://www.m365.fm/entity/pstn/)

## Sources

- [Plan for Teams auto attendants and call queues (Microsoft Learn)](https://learn.microsoft.com/microsoftteams/plan-auto-attendant-call-queue)
- [Create a call queue (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoftteams/create-a-phone-system-call-queue)
- [Create an auto attendant (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoftteams/create-a-phone-system-auto-attendant)
- [Technical prerequisites and licensing requirements (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoftteams/aa-cq-reference-prerequisites-licensing)
- [Manage resource accounts in Teams (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoftteams/manage-resource-accounts)
