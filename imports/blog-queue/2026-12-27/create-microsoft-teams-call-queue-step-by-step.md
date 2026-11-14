---
title: "Create a Microsoft Teams Call Queue: Resource Account, Routing, Overflow and Callback"
summary: "Set up a Teams Phone call queue in the Teams admin center using Microsoft Learn: the eight advanced setup steps, resource account license, agents, routing methods, recommended settings, overflow, timeout, callback, templates and authorized users."
status: review
publish: false
author: mirko-p
date: 2026-12-27
topics: [teams-phone, teams-call-queues]
keypoints:
  - "Create the queue under Voice, Call queues, Add, then choose Advanced setup. The wizard has eight steps and the last one ends with Submit."
  - "Every call queue that directly answers calls needs at least one resource account with a Microsoft Teams Phone Resource Account license."
  - "Learn recommends conference mode On, round robin or longest idle routing, presence-based routing On and an agent alert time of at least 20 seconds."
  - "Overflow defaults to 50 calls with a range of 0 to 200. The timeout ranges from 0 seconds to 45 minutes."
  - "Up to 200 agents can come from a channel. Up to 15 authorized users can be added, and each also needs a voice applications policy."
faq:
  - q: "Where do I create a call queue?"
    a: "According to Microsoft Learn, in the Teams admin center under Voice, Call queues, Add. Select Advanced setup for the eight-step wizard."
  - q: "Do I need a license?"
    a: "Learn says every call queue that directly answers calls needs at least one resource account with a Microsoft Teams Phone Resource Account license. Nested queues that receive calls from an answered auto attendant or call queue do not need one."
  - q: "Which routing method should I choose?"
    a: "Learn describes attendant, serial, round robin and longest idle, and recommends round robin or longest idle. Longest idle requires presence-based routing, which is turned on automatically."
  - q: "How many agents can a queue have?"
    a: "Learn gives up to 200 representatives through a Teams channel, or up to 20 individually plus up to 200 through groups, or through a Shift."
  - q: "Does the page cover callback and recording?"
    a: "Yes. Step 5 covers callback and step 7 covers templates for automatic recording, compliance recording and shared call history."
---

A call queue holds callers and distributes them to a group of representatives. This guide follows the Microsoft Learn article on creating a Teams Phone call queue. Go to the **Teams admin center**, then **Voice**, then **Call queues**, then **Add**, and choose **Advanced setup**. Each of the eight steps ends with **Next**, except step 8, which ends with **Submit**. The page also offers **Quick setup** for simpler routing needs, which covers only general info and who answers the calls. This guide covers Advanced setup.

## Step 1: General info

- **Name** of the queue.
- **Call queue language** for text-to-speech and system prompts. The page lists 54 languages. Text must be entered in the selected language, because the system does not translate it.
- **Resource account:** at least one with a Microsoft Teams Phone Resource Account license, for every queue that directly answers calls. Representatives see the resource account or queue name on incoming calls.
- **Calling ID (optional):** lets representatives pick an outbound caller ID. The resource account needs a Teams Phone Resource Account license and a Calling Plan phone number, an Operator Connect number or an online voice routing policy.
- **Service level threshold (optional):** 0 to 40 minutes. It should be less than the call timeout, but that is not enforced. Blank disables the metric.

## Step 2: Greeting and music

Play an audio file or type a greeting of up to 1,000 characters. Teams provides default royalty-free music on hold, or you can upload your own. You are responsible for clearing rights to uploaded audio.

## Step 3: Call answering

Add up to 200 representatives through a Teams channel, up to 20 users individually plus up to 200 through groups, or through a Shift.

- **Channel:** only standard channels are fully supported, on the Windows and Mac Teams clients. Setup can take up to 24 hours. A known issue is that with a private channel, calls go to all team members.
- **Groups:** distribution lists, security groups, Microsoft 365 Groups or Teams teams. New group members can take up to eight hours to receive their first call.
- **Shift:** shift changes take 15 minutes to sync. Only the first 200 enterprise voice enabled members, alphabetically, are added.
- **Conference mode:** the recommended setting is On. Representatives must be in TeamsOnly mode, and it is required if users consult or transfer calls with queues.

## Step 4: Agent selection

| Routing method | Behavior on the page |
| --- | --- |
| Attendant | Rings all representatives at once. |
| Serial | Rings one at a time in the Call agents list order. |
| Round robin | Balances calls so each representative gets the same number. |
| Longest idle | Routes to the representative idle longest, where idle means presence Available. |

Learn recommends round robin or longest idle. **Presence-based routing** is recommended On. With longest idle it is required and on automatically. **Call agents can opt out** is recommended On. **Agent alert time** has a recommended minimum of 20 seconds.

## Step 5: Callback (optional)

Callers become eligible by wait time, number of calls in queue, or calls to agent ratio. The caller number must be publicly dialable, non-premium and in E.164 format. You set a greeting that includes the key to press. The call timeout must be long enough for the callback to be offered, so a short timeout can fire before that. Some North American prefixes, such as 1-800 and 1-888, are not eligible.

## Step 6: Exception handling

Each exception can disconnect the call or redirect it.

- **Overflow:** maximum calls in the queue, default 50, range 0 to 200.
- **Call timeout:** 0 seconds to 45 minutes.
- **No agents opted or logged in:** queue the call by default, or disconnect or redirect.
- **Redirect targets:** a person in the organization who is voice enabled, a voice app, a resource account, an external number, personal voicemail or shared voicemail.

## Step 7: Templates (optional)

Choose one Automatic Recording template, up to two Compliance Recording templates and one Shared call history template. The page lists known issues for automatic recording: explicit recording consent must be Off, and the Teams administrator who assigns the template must also be a SharePoint site administrator for the site the template uses.

## Step 8: Authorized users

Add up to 15. Each needs a Teams voice applications policy that enables at least one configuration change and an assignment as authorized user on at least one auto attendant or call queue. Some options, such as hiding authorized users, are PowerShell-only through `New-CsCallQueue` or `Set-CsCallQueue`.

## Recommended settings

Conference mode On, round robin or longest idle, presence-based routing On, and an agent alert time of at least 20 seconds.

## Not covered

The page links separate articles for audio file limits. It does not give a phone number assignment procedure for the resource account in this guide's source.

## Related

- [Teams Phone](https://www.m365.fm/entity/teams-phone/)
- [Teams call queues](https://www.m365.fm/entity/teams-call-queues/)

## Sources

- [Setup - Call Queue (Microsoft Learn)](https://learn.microsoft.com/microsoftteams/aa-cq-setup-call-queue)
