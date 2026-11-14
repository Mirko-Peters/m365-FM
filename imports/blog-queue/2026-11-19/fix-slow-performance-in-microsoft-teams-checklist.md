---
title: "How to Fix Slow Performance in Microsoft Teams (Checklist)"
summary: "A step-by-step checklist for slow Microsoft Teams: check resource use and hardware, reduce video load, update, test the network and Call health, and clear the cache only as a targeted step."
status: review
publish: false
author: mirko-p
date: 2026-11-19
topics: [teams, teams-admin-center]
keypoints:
  - "First find out what is slow: open Task Manager and look at the Teams process (Teams.exe or ms-teams.exe) for high CPU or memory."
  - "Minimum Windows requirements are 4 GB RAM and a two-core CPU. Microsoft's training suggests at least 8 GB per user, and a four-core CPU from 2018 for meetings of 10 or more."
  - "In a meeting, turn off your video and incoming video, and drop background effects, to see if performance recovers."
  - "Check Call health under More actions for round-trip time, packet loss and jitter. Microsoft Q&A calls a consistent round-trip time above 100 ms a concern."
  - "Clear the cache last. Microsoft says it is a targeted step and does not fix missing messages or chats."
faq:
  - q: "How much RAM does Teams need?"
    a: "Microsoft Learn's system requirements list 4.0 GB RAM as the minimum on Windows and Mac. A Microsoft Learn training module says Teams needs about 4 GB beyond other system requirements and recommends at least 8 GB per user computer. Teams uses available memory, so it uses less when memory is scarce."
  - q: "Should I turn off GPU hardware acceleration in Teams?"
    a: "A Microsoft Learn training module lists it as a way to reduce CPU use, under Settings, General, with a restart of Teams. That module dates from 2021. Commenters on a Microsoft Q&A thread say the option is not in the same place, or not present, in new Teams, and the pages I read don't confirm where it is today."
  - q: "Will clearing the Teams cache make it faster?"
    a: "Only in a few local cases. Microsoft Learn calls clearing the cache a targeted step and says it does not fix problems such as missing messages, chat history that doesn't load, or wrong notifications. It also deletes diagnostic logs. After clearing, the first start can be slower while the cache is rebuilt."
  - q: "Can the network make Teams slow even on a good PC?"
    a: "Yes. The Microsoft Learn training module lists latency, file upload delays and slow chats as network symptoms. It suggests the Microsoft 365 network connectivity test, name resolution checks, routing to Microsoft data centers, split-tunnel VPN and QoS."
  - q: "What do I send to support if nothing helps?"
    a: "An answer on Microsoft Q&A describes right-clicking the Teams icon in the system tray, selecting Collect Support Files, and uploading the generated folders with a service request in the Microsoft 365 admin center. Describe the steps you tried."
---
Slow Teams is rarely one problem. It can be a PC that is short of memory, a heavy meeting, a poor network, or a damaged local cache. This checklist goes from the cheapest test to the most disruptive one, so you can stop as soon as the problem is gone. It draws on Microsoft Learn, including a 2021 training module and a Microsoft Q&A answer, so a few menu names may differ in your build.

## Step 1: See what is slow

Open Task Manager (Ctrl+Shift+Esc) and look at the Teams process while the problem happens. A Microsoft Q&A answer from Microsoft Community Support names two process names to look for in the Task Manager Details tab: `Teams.exe` and `ms-teams.exe`. Which one you see depends on the Teams client you run. The Microsoft Learn training shows the same idea on the **Processes** tab, where high CPU and memory use point to a client problem.

Separate three cases:

- Everything on the PC is slow: look at memory and other running apps.
- Only meetings are slow: look at video, effects and the network.
- Only one tab or chat is slow: test the Teams web app at teams.microsoft.com to see whether the account or the service is involved.

## Step 2: Check the hardware against Microsoft's numbers

Microsoft Learn's Teams client requirements for Windows list a processor at 1.1 GHz or faster with two cores, 4.0 GB RAM, 3.0 GB free disk space and a 1024 x 768 display. The same page recommends a four-core processor from 2018 or newer for large meetings (10 or more participants) and for Teams live events. The training module states that Teams needs about 4 GB of RAM beyond other requirements, so at least 8 GB per user computer is recommended. If memory is short, add memory or close other workloads.

## Step 3: Close other apps and cut video load

Close unused apps and browser tabs. In the meeting, select **Turn camera off**, and use **More actions** > **Turn off incoming video** to test. Avoid background blur and effects. Microsoft's answer on slow performance lists these as the first tests. The training module adds that background effects need Windows 10 or a processor with the AVX2 instruction set.

If the laptop is docked to a 4K monitor, the Microsoft Q&A answer suggests connecting the monitor directly to the laptop's video port and trying 1920 x 1080.

## Step 4: Update Teams and Windows drivers

Install the latest Teams version, because updates often include performance fixes, and keep chipset, graphics, audio and network drivers current. The Q&A answer also suggests checking the power mode. Set it to **Best performance** during meetings, and check whether the manufacturer's power tool throttles the CPU.

## Step 5: Test the network

In a meeting, select **More actions** > **Call health** and review the **Network** tab for round-trip time, packet loss and jitter. The Q&A answer treats a consistent round-trip time above 100 ms as a concern. It also suggests testing on wired Ethernet to rule out Wi-Fi.

For admins, the Microsoft Learn training lists these checks in order:

1. In the Microsoft 365 admin center, go to **Health** > **Network connectivity** and run the **Network connectivity test**.
2. Use the Teams **Network planner** in the Teams admin center to calculate requirements.
3. Check that clients resolve external DNS queries for Microsoft 365 services and that firewalls aren't blocking them.
4. Route Microsoft 365 traffic through local or regional egress points.
5. Configure split-tunnel VPN so Microsoft 365 traffic bypasses the VPN. Microsoft says this strongly improves Teams performance and quality.
6. Implement QoS for Teams on managed networks.

## Step 6: Adjust client settings

The training module lists settings that reduce CPU use. In classic Teams these were under **Settings** > **General**:

- **Disable GPU hardware acceleration (requires restarting Teams).**
- Clear **Register Teams as the chat app for Office**.
- Remove workloads you don't need, such as the Teams Meeting Add-in in Outlook.

Be careful here. The module is from 2021, and commenters on Microsoft Q&A say the hardware acceleration option is not available in the same place in new Teams. The pages I read don't state where it is in the current client, so treat this step as classic Teams guidance.

## Step 7: Check security software

The Microsoft Q&A answer suggests running a scan and, if your IT policy allows, excluding the Teams process and data folder from antivirus scanning. The thread names `%appdata%\Microsoft\Teams`, which Microsoft Learn's clear-cache page gives as the classic Teams folder. For new Teams, that page uses a path under the `MSTeams_8wekyb3d8bbwe` package folder. Check which one applies before you add an exclusion, and let your security team decide.

## Step 8: Clear the cache, but only now

Microsoft Learn says clearing the cache is a targeted step. It does not fix missing messages, chat history that doesn't load, a team or channel that doesn't appear, or wrong notification counts, and it deletes the diagnostic logs needed to find the cause.

For new Teams on Windows, quit Teams, then go to **Settings** > **Apps** > **Installed apps**, find the new Microsoft Teams app, select **More options** > **Advanced options** and select **Reset** in the **Reset** section. Reset deletes app data, including personalization settings. Restart Teams.

## Step 9: Collect evidence and open a ticket

If the problem stays, the Q&A answer describes this route: right-click the Teams icon in the system tray, select **Collect Support Files**, wait a few minutes, and upload the generated folders. An admin then opens a service request in the Microsoft 365 admin center under **Support** > **New service request**. Describe every step you already tried. The thread does not say in which Teams client the menu option exists, so confirm it in your version.

## Quick decision path

| Symptom | Start with |
|---|---|
| High CPU or memory in Task Manager | Steps 1, 2, 3 and 6 |
| Slow only in meetings | Steps 3, 4 and 5 |
| Slow on Wi-Fi or VPN only | Step 5 |
| Slow only after an update | Step 8, then a ticket |
| Fine in the browser, slow in the app | Steps 6, 7 and 8 |

## Common mistakes

- Clearing the cache first and losing diagnostic logs.
- Following classic Teams paths in new Teams.
- Blaming the PC when the network is the cause. Check Call health first.
- Docking to a 4K display and never testing a direct connection.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Microsoft Teams admin center](https://www.m365.fm/entity/teams-admin-center/)
- [Teams certified devices](https://www.m365.fm/entity/teams-certified-devices/)

## Sources

- [Microsoft Learn: Troubleshoot Teams desktop client performance issues (training)](https://learn.microsoft.com/en-us/training/modules/configure-troubleshoot-microsoft-teams-clients-services/5-troubleshoot-desktop-client-performance)
- [Microsoft Learn: Teams client system requirements](https://learn.microsoft.com/en-us/microsoftteams/teams-client-system-requirements)
- [Microsoft Learn: Clear the Teams client cache](https://learn.microsoft.com/en-us/troubleshoot/microsoftteams/teams-administration/clear-teams-cache)
- [Microsoft Q&A: How do I troubleshoot slow performance in Microsoft Teams?](https://learn.microsoft.com/en-us/answers/a/1536232)
- [Microsoft Q&A: Microsoft Teams slows workstation during meetings](https://learn.microsoft.com/en-us/answers/a/8509945)
