---
title: "How to Create a Cloud Auto Attendant in Teams Phone"
summary: "Create a cloud auto attendant in the Teams admin center: Quick and Advanced setup, call handling hours, greetings, menu options, holidays, dial scope, documented limits and caveats such as dial keys and directory search."
status: review
publish: false
author: mirko-p
date: 2027-01-05
topics: [teams-auto-attendant, teams-phone]
keypoints:
  - "Path: Teams admin center > Voice > Auto attendants > Add. You can use Quick setup or Advanced setup."
  - "Callers reach the auto attendant through a resource account or through a voice app when it is nested behind another Teams Phone Agent, auto attendant or call queue."
  - "Business hours default to 9:00 AM to 5:00 PM every day if you leave them unchanged. Set the time zone first."
  - "If you assign dial keys, set Directory search to None, because dial keys are matched first."
  - "Typed greetings and announcements are limited to 1,000 characters and are not translated."
faq:
  - q: "Where do I create an auto attendant?"
    a: "According to Microsoft Learn, in the Teams admin center go to Voice > Auto attendants and select Add. You can then choose Quick setup for simple routing or Advanced setup for complex routing."
  - q: "Do I need a resource account?"
    a: "For the option Through a resource account, yes. Creation steps are in the separate Learn article on Teams resource accounts. The option Through a voice app needs no resource account and is for nesting behind another Teams Phone Agent, auto attendant or call queue."
  - q: "What are the default business hours?"
    a: "Learn says business hours default to 9:00 AM to 5:00 PM every day if you do not change them."
  - q: "Why do callers get transferred before they finish dialing a name?"
    a: "Learn says dial keys are matched first. If you assign dial keys, set Directory search to None. To offer both dial by name and dial by extension, enable name search on the main auto attendant and transfer to a second auto attendant that uses dial by extension."
  - q: "How long can a typed greeting be?"
    a: "Up to 1,000 characters. The text must be in the selected language, and the system does not translate it."
---

Create an auto attendant in the Teams admin center under Voice > Auto attendants > Add. Choose Quick setup for simple routing or Advanced setup for hours, holidays, menus and dial scope. This guide follows the Microsoft Learn article on creating a cloud auto attendant. It says where the article sends you to other pages, for example for licensing, phone numbers and resource accounts.

## Before you start

The Learn page does not list license SKUs, phone number steps or resource account steps. It links to other articles for them.

- **Licensing:** see the Learn page on prerequisites and licensing. People who receive redirected calls must be voice enabled.
- **Resource account:** required for the option **Through a resource account**. The creation steps are in the Learn article on Teams resource accounts.
- **Phone numbers:** not covered on this page.

## Choose a setup type

| Setup | Use it for |
| --- | --- |
| Quick setup | Simpler call routing |
| Advanced setup | Complex routing, or to add features to an auto attendant created with Quick setup |
| Teams Phone Agent | AI-driven self-service call flows, described in a separate article |

### Quick setup

1. **General info:** enter a name, the time zone (it sets the after-hours schedule), the language for system prompts and text-to-speech greetings, and how the auto attendant receives calls.
2. Select **Next**, then choose a destination or a menu to play to the caller.
3. Select **Submit**.

## Advanced setup, step by step

**Step 1: General info.**

- **Name.**
- **How do callers reach this auto attendant:** **Through a resource account**, or **Through a voice app (no resource account needed)**.
- **Language** for system-generated prompts. Learn gives a table of languages with flags for text-to-speech and speech recognition.
- **Voice inputs**, which turn menu options into speech-recognition keywords.
- **Operator**, optional but recommended.

**Step 2: Call handling hours.** Set the time zone, then **Start at** and **End at** for each weekday. Use **+** to add several blocks, for example for a lunch break.

**Step 3: Business-hours call flow.**

- **Greeting:** no greeting, play an audio file, or add a greeting message.
- **Call routing:** disconnect, redirect the call, or play menu options. Redirect targets are a person in the organization, a voice app, a resource account, an external phone number or voicemail.
- **Force listen:** callers must hear the full menu first. Input before the menu ends is ignored.
- **Menu options:** map keys 0 to 9, `*` and `#` to a destination. Each option has a dial key, a voice command and a destination.
- **Directory search:** None, Dial by name or Dial by extension.

**Step 4: After-hours call flow.** The fields match step 3.

**Step 5: Holidays (optional).** Select **Add**, then set a name, the holiday, greeting, routing and directory search. Repeat for more holidays.

**Step 6: Dial scope (optional).** The default is **All online users**. Use **Include** or **Exclude** with a **Custom user group** to pick Microsoft 365 groups, distribution lists or security groups.

**Step 7: Authorized users (optional).** Add users who may change the auto attendant. Permissions depend on the Teams voice applications policy.

**Step 8: Review and submit.** Check the flow in the **Call Flow** visualizer, optionally export it to PDF, then select **Submit**.

## Limits and caveats on the page

- Typed greetings and announcements: up to **1,000 characters**, in the selected language.
- Languages without speech recognition disable voice inputs, and dial by name then works by keypad only.
- If you assign dial keys, set **Directory search** to **None**.
- An **Operator** key must be mapped, or the Operator option is disabled.
- Authorized users need a voice applications policy that allows at least one configuration change, and an assignment as authorized user for at least one auto attendant or call queue.
- Voicemail destinations need the Microsoft 365 admin center setting **Let people outside the organization email this team** for the group.
- New users may take up to 36 hours to appear in the directory.
- Audio file formats and sizes are in a separate limits article.
- Learn warns about a daylight saving change on 1 November 2026 for some Canadian auto attendants that use US-based time zones. They need manual time zone updates, and the page lists the replacement zones per province.

## Tools and PowerShell

Some options exist only in PowerShell, for example `New-CsAutoAttendant -UserNameExtension` for office or department details in dial-by-name results. Learn also names a diagnostic test in the Microsoft 365 admin center, at `aka.ms/TeamsAADiag`, that checks whether an auto attendant can receive calls.

## What the page does not say

It gives no license SKUs, no phone number steps, no numeric limits for menu options, holidays or auto attendants per tenant, and no audio format caps. Check the linked pages for those.

## A build order

The order below is practical advice.

1. Create or confirm the resource account and its number.
2. Set time zone and hours first. The after-hours behavior depends on them.
3. Build the business-hours flow, then after-hours, then holidays.
4. Decide between dial keys and directory search, not both.
5. Test with the diagnostic tool and a real call.

## Typical mistakes

- Leaving the default 9:00 to 5:00 hours.
- Using dial keys together with dial by name.
- Forgetting to map an operator key.
- Pasting a greeting longer than 1,000 characters or in the wrong language.

## Related

- [Teams auto attendant](https://www.m365.fm/entity/teams-auto-attendant/)
- [Teams Phone](https://www.m365.fm/entity/teams-phone/)
- [Teams call queues](https://www.m365.fm/entity/teams-call-queues/)

## Sources

- [Create a cloud auto attendant (Microsoft Learn)](https://learn.microsoft.com/microsoftteams/create-a-phone-system-auto-attendant)
