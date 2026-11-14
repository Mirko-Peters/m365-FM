---
title: "Teams Calls Go Straight to Voicemail or Ring Without Answer: Checks for Admins"
summary: "Check why Teams calls go to voicemail or ring without answer using Microsoft documentation: call forwarding, unanswered settings and delay, simultaneous ring, call groups, the 1:1 call rule, license needs and the PowerShell settings that control them."
status: review
publish: false
author: mirko-p
date: 2026-12-31
topics: [teams-phone, teams-admin-center, teams]
keypoints:
  - "The Learn calling troubleshooting page could not be read for this guide, so the checks come from the Teams call forwarding support article and the Set-CsUserCallingSettings reference."
  - "Users find the settings in Teams under Settings, Calls, Call handling and forwarding. Forwarding applies to one-to-one calls only."
  - "Immediate forwarding to voicemail, a simultaneous ring setup or a short unanswered delay can each explain calls that skip the user."
  - "In PowerShell, ForwardingType is Immediate or Simultaneous, and UnansweredDelay allows 5 to 60 seconds with a default of 20 seconds."
  - "The support article names an Enterprise Voice or Business Voice license for the call forwarding and simultaneous ring options."
faq:
  - q: "Why do calls go straight to voicemail for one user?"
    a: "According to the Microsoft support article and the cmdlet reference, call forwarding can be set to forward immediately and the target type can be voicemail. Check the forwarding settings of that user first."
  - q: "Where does a user change these settings?"
    a: "The Microsoft support article names Settings and more, Settings, Calls, and then Call handling and forwarding in Teams."
  - q: "Does forwarding work for meeting or group calls?"
    a: "According to the support article, call forwarding works for one-to-one calls only."
  - q: "How long does a call ring before the unanswered rule applies?"
    a: "The Set-CsUserCallingSettings reference lists an UnansweredDelay of 5 to 60 seconds with a default of 20 seconds."
  - q: "Which license is needed for forwarding and simultaneous ring?"
    a: "According to the support article, if you do not see the call forwarding or simultaneous ring options, you likely do not have an Enterprise Voice or Business Voice license. The article makes no license statement in its call group section."
---

If Teams calls go straight to voicemail, or ring and nobody can answer, the first thing to check is the user's call handling settings: forwarding, simultaneous ring, call groups and the unanswered rule. This guide is built from the Microsoft support article on call forwarding, call groups and simultaneous ring, and from the Microsoft Learn reference for `Set-CsUserCallingSettings`.

A note on sources: the Learn page on Teams calling issues could not be read when this guide was written. The checks below therefore cover settings only. They do not cover network quality, device problems or carrier issues.

## Where users change call handling

The support article describes this path in Teams: **Settings and more**, **Settings**, **Calls**, and then **Call handling and forwarding**. From there a user can set forwarding, a call group and simultaneous ring.

Three rules from the article matter for troubleshooting:

- Call forwarding works for one-to-one calls only.
- If you do not see the options for call forwarding or simultaneous ring, the article says you likely do not have an Enterprise Voice or Business Voice license. License changes can take up to 24 hours to apply. The call group section names no license.
- A call group can have up to 25 members, who must be people in your organization. The ring order is either **Everyone at once** or **In the order below**. The cmdlet reference adds that InOrder works only if the call group has 5 or fewer members.

The article also describes a simultaneous ring delay of up to 20 seconds, with a default of **No delay**, and a setting to redirect external phone calls that is off by default. It describes SIP feature codes `*33*`, `*34*` and `*32*`. For forwarding, the article says calls can be sent to voicemail, a new number, a specific contact, a call group or your delegates. The article does not cover do not disturb.

## Check 1: Is forwarding switched on and sent to voicemail

A forwarding rule is the first thing to look at (my advice, not a Microsoft statement). The `Set-CsUserCallingSettings` reference documents these parameters:

- `IsForwardingEnabled` turns forwarding on or off.
- `ForwardingType` is `Immediate` or `Simultaneous`.
- `ForwardingTargetType` is `Voicemail`, `SingleTarget`, `MyDelegates` or `Group`. For a user, `Voicemail` is supported only for immediate forwarding.

An immediate forward with the target `Voicemail` sends every call to voicemail without ringing the user. A simultaneous forward rings the user and the target at the same time.

To switch forwarding off for a user, the reference gives this example:

```powershell
Set-CsUserCallingSettings -Identity user1@contoso.com -IsForwardingEnabled $false
```

The reference states that you need Teams PowerShell module version 4.0.0 or later and a Phone System license. It also says that the cmdlet writes a whole settings group, so review all values before you change one.

## Check 2: The unanswered rule

When a call rings and nobody answers, the unanswered rule decides what happens next:

- `IsUnansweredEnabled` turns the rule on or off.
- `UnansweredTargetType` sets the target, for example voicemail.
- `UnansweredDelay` sets how long the call rings. The reference lists 5 to 60 seconds, in steps of 5 seconds between 5 and 15 and 10 seconds above that, with a default of 20 seconds. Its example 10 shows the default settings for a user: forwarding off and unanswered calls sent to voicemail after 20 seconds. Example 11 turns the unanswered rule off, which the Teams client shows as If unanswered Do nothing.

My advice, not a Microsoft statement: if callers say that the phone rings only briefly before voicemail starts, the delay value is the first thing to read. If the delay is long, callers may hang up before the rule applies.

## Check 3: Call groups and simultaneous ring

If a user's calls also ring other people or devices, review the call group and simultaneous ring settings in the **Call handling and forwarding** page. With **In the order below**, members ring one after another. With **Everyone at once**, all members ring together. My advice, not a Microsoft statement: a long ring chain can delay the moment a call reaches voicemail.

Remember that forwarding applies only to one-to-one calls, so a rule that works for a direct call will not apply to other call types.

## Check 4: Delegates

The reference says that delegates are managed with `New-CsUserCallingDelegate` and the related cmdlets. If the forwarding target type is `MyDelegates`, calls go to the delegates, so check the delegate list before you assume that voicemail is the problem. The reference adds that delegates cannot be configured with this cmdlet, and that forwarding to `MyDelegates` needs at least one delegate. The support article also mentions delegates as forwarding and simultaneous ring targets.

## Suggestion: a short triage order

This section is a practical suggestion and not a Microsoft statement.

1. Ask the user whether forwarding or unanswered rules were changed recently.
2. Open **Call handling and forwarding** for the affected user and note every active rule.
3. Check forwarding type and target, then the unanswered delay.
4. Check the license of the user against the license named in the support article.
5. Test with a one-to-one call from another account.

## Not covered

The pages I read do not describe the following:

- The Learn troubleshooting page for calling issues, which could not be read.
- Network, device and carrier causes.
- Do not disturb behavior.
- The syntax and output of the read cmdlet `Get-CsUserCallingSettings`, which the reference only links to.
- Admin center paths for these settings.

## Related

- [Teams Phone](https://www.m365.fm/entity/teams-phone/)
- [Teams admin center](https://www.m365.fm/entity/teams-admin-center/)
- [Microsoft Teams](https://www.m365.fm/entity/teams/)

## Sources

- [Call forwarding, call groups, and simultaneous ring in Microsoft Teams (Microsoft Support)](https://support.microsoft.com/office/call-forwarding-call-groups-and-simultaneous-ring-in-microsoft-teams-a88da9e8-1343-4d3c-9bda-4b9615e4183e)
- [Set-CsUserCallingSettings (Microsoft Learn)](https://learn.microsoft.com/powershell/module/microsoftteams/set-csusercallingsettings)
