---
title: "How to Add Copilot to Outlook: License, Setup and Fixes"
summary: "How to add Copilot to Outlook: you need a Microsoft Copilot license, a supported Outlook app and an Exchange Online mailbox. Steps, where it appears and fixes."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [copilot, outlook]
keypoints:
  - "Copilot isn't installed as an add-in. It appears in Outlook after an admin assigns a Microsoft Copilot license on top of a qualifying license."
  - "Copilot in Outlook works with supported versions of classic Outlook and new Outlook for Windows and Mac, and mailbox features need an Exchange Online mailbox."
  - "Once available, Copilot shows up as Summarize on a thread, a Copilot button on the ribbon while drafting, and a Copilot icon in the navigation header."
  - "Group mailboxes, signed or encrypted messages and mailboxes not hosted in Exchange Online are not supported."
  - "Microsoft Copilot Chat is separate from the licensed features and is available to eligible users without a Copilot license."
faq:
  - q: "How do I get Copilot in Outlook?"
    a: "An admin assigns a Microsoft Copilot license in the Microsoft 365 admin center, on top of a qualifying Microsoft 365 license. You also need a supported Outlook app and an Exchange Online mailbox. After that, Copilot appears in Outlook as a Summarize button, a ribbon button while drafting and an icon in the navigation header."
  - q: "Why don't I see Copilot in Outlook?"
    a: "The usual causes are a missing Copilot license, an unsupported Outlook version, a mailbox that isn't in Exchange Online, or a group mailbox. Check these in that order. Messages that are signed, encrypted or protected with some labels are also excluded. If your admin assigned the license recently, restart Outlook and give it time."
  - q: "Does Copilot in Outlook work with a personal Outlook.com account?"
    a: "Microsoft's FAQ for Copilot in Outlook says that Chat with Copilot requires a work or school account and a Microsoft Copilot subscription. The pages checked for this article don't describe personal Microsoft 365 plans for Outlook features. For a personal account, check Microsoft's current plan descriptions before you buy anything."
---
You don't add [Copilot](https://www.m365.fm/entity/copilot/) to [Outlook](https://www.m365.fm/entity/outlook/) the way you add an add-in. Copilot appears in Outlook once an admin assigns you a Microsoft Copilot license on top of a qualifying Microsoft 365 license, and once you use a supported Outlook app with an Exchange Online mailbox. This article is for Outlook users who wonder why the Copilot button is missing and for admins who need to switch it on. It covers the requirements, the admin steps, where the buttons show up, what Copilot can't do in a mailbox, and a short checklist for when nothing appears. The details come from Microsoft's requirements page and its FAQ for Copilot in Outlook.

## What you need before Copilot shows up in Outlook

Three things have to be true at the same time.

**A license.** Microsoft's requirements page says users need a Microsoft Copilot license and a qualifying prerequisite license. The qualifying plans are listed on the license options page. Microsoft describes the Copilot license as available with Microsoft 365 E7 or as an add-on for eligible commercial, government and education plans. Microsoft also notes that the license isn't available with device-based licensing for Microsoft 365 Apps for enterprise.

**A supported Outlook app.** Microsoft's requirements page says Copilot works with supported versions of classic Outlook and new Outlook for Windows and Mac. The FAQ for Copilot in Outlook lists Outlook for Microsoft 365, Outlook for Microsoft 365 for Mac, new Outlook for Windows, Outlook for Android and Outlook for iOS in its applies-to list, and it mentions Outlook on the web. It doesn't list classic Outlook for Windows there. The two pages don't agree word for word, so check your build on Microsoft's pages if you run classic Outlook.

**The right mailbox.** An Exchange Online mailbox is required for experiences that use email, calendar, meeting or other mailbox data. Microsoft says Copilot supports primary mailboxes hosted in Exchange Online, and that it can also use content you may access in archive, shared and delegate mailboxes. It isn't available in group mailboxes. The pages I checked don't say anything about on-premises or hybrid mailboxes, but the FAQ states that Copilot isn't available for mailboxes not hosted on Exchange Online.

For desktop apps, Microsoft adds a maintenance point: the Office Feature Updates task must run on its regular schedule and reach the required network resources, or the core Copilot experiences in apps such as Word, Excel and PowerPoint may not work. Admins should check that this task runs and can reach the network before they blame the license.

## How to add Copilot to Outlook step by step

This is the admin path. Without a license, the user can't do anything to make the buttons appear.

1. **Check the base license.** Confirm that the user has one of the qualifying licenses from Microsoft's license options page.
2. **Buy or find the Copilot license.** Microsoft describes it as an add-on for eligible plans, or part of E7.
3. **Assign it.** Microsoft's page says to assign licenses to users in the Microsoft 365 admin center. For a check on a specific account, Microsoft points to its Microsoft Copilot service plan diagnostic tool.
4. **Confirm the mailbox.** The user's primary mailbox must be hosted in Exchange Online.
5. **Ask the user to restart Outlook.** Sign out and in again if the buttons still don't show.
6. **Test one feature.** Open a long email thread and look for the **Summarize** button, which is the easiest feature to find.

If you're a user and your admin isn't sure about the license, send them Microsoft's requirements page. It saves a round of questions.

Admins who manage many users usually assign the license to a group through group-based licensing. Microsoft's pages I opened don't describe that method, so confirm it in the admin center help before you depend on it.

## Where Copilot appears in Outlook once it works

Microsoft's FAQ lists the entry points, and they differ by feature.

- **Summarize.** The **Summarize** button at the top of a message thread produces "Summary by Copilot".
- **Draft with Copilot.** The Copilot button on the ribbon while you write a message. You can choose tone and length. "Coaching by Copilot" sits in the same place.
- **Schedule with Copilot.** On the ribbon when you open an email thread.
- **Chat with Copilot.** The Copilot icon in the navigation header. The FAQ states that Chat with Copilot requires a work or school account.
- **Themes by Copilot.** In **Appearance Settings**.
- **Prepare for your meeting.** From the calendar item of a meeting.

Use the thread summary first. It shows quickly whether Copilot can read your mailbox, and the result is easy to check against the thread you just read. Microsoft advises reviewing and verifying all AI-generated content, and that goes for drafts, too.

## Language and settings worth knowing

A few smaller details from the FAQ can save a support call.

- **Languages.** Many languages are supported, and Microsoft links a list of supported languages for Copilot. **Prioritize my inbox** supports only Tier 1 languages for now. If a user writes mostly in another language, set expectations.
- **Summary language.** On Android, iOS and Mac you can set the summary language to match the app language. Microsoft says this doesn't persist after you close Outlook, so users may have to set it again.
- **Customizing drafts.** **Draft with Copilot** lets you choose the tone and the length. A short prompt with the audience and the one thing the reader must do gives better drafts than a long one that lists everything.
- **Prioritize my inbox.** You can customize it in Settings.
- **Rollout timing.** According to the FAQ, Copilot in Outlook deploys to Targeted and Standard Release at the same time, and new Outlook for Windows and the web roll out directly to Standard Release environments after meeting advance notice requirements. If you're waiting for a feature, the rollout timing may be the reason it isn't there yet.

One more practical tip for admins: write down the license, the Outlook version and the mailbox type of the first test user. If a second user doesn't see the buttons, you can compare those three values in a minute and usually find the difference.

## Limits, privacy and what Copilot can't read

Microsoft's FAQ lists several limits you should know before you promise anything to your users.

- Copilot isn't available on signed or encrypted emails, emails with IRM, or some emails that carry certain sensitivity labels.
- It can't access S/MIME or Double Key Encryption emails.
- It isn't available in group mailboxes or in mailboxes not hosted on Exchange Online.
- For In-Place or Online Archive mailboxes, results appear only when you search from the search bar with the **Current Mailbox** or **All Folders** scope.
- Prepare for your meeting may give generic results when a meeting has no shared content or related history.
- Copilot won't summarize meetings with potentially harmful or offensive content.

If your organization works mostly with encrypted or labeled mail, expect gaps, and say so in the rollout note. The tool is useful for ordinary threads, and unreliable as a general inbox reader if half of the mail is protected.

## Copilot Chat versus the licensed features

Two names cause confusion. Microsoft Copilot Chat is available to users with an eligible Microsoft 365 subscription, and the requirements page says a Copilot license isn't required for it. The licensed features are the ones grounded in your mailbox, like thread summaries and drafts based on your mail. Admins also decide whether Copilot Chat is pinned in the Microsoft 365 apps, under **Copilot**, **Settings**, **Pin Microsoft Copilot Chat** in the Microsoft 365 admin center. Microsoft's pinning article names Teams and Outlook as examples of where it appears, and says users can unpin it themselves.

So when a user says "I don't have Copilot in Outlook", ask which one they mean. An unlicensed user may well see Copilot Chat but not the Summarize button.

## Common mistakes

- **Looking for an add-in to install.** There isn't one. A license and a supported app make it appear.
- **Assigning the license but ignoring the mailbox.** If the primary mailbox isn't in Exchange Online, mailbox features won't work.
- **Testing on a group or shared mailbox.** Microsoft says group mailboxes aren't supported.
- **Expecting it to read encrypted mail.** Signed, encrypted and some labeled messages are excluded.
- **Mixing up Copilot Chat and licensed Copilot.** Chat is available without the license for eligible users.
- **Skipping the restart.** A new license may need a restart or a fresh sign-in before the buttons show.

## Related topics to explore

- Turn off Copilot in Outlook: Outlook has its own **Turn on Copilot** toggle, which Microsoft describes in its [turn-off article](https://support.microsoft.com/en-us/privacy/turn-off-copilot-in-microsoft-365-apps).
- Use Copilot in Outlook day to day: summarize threads, draft replies and prepare for meetings, as listed in the [Outlook Copilot FAQ](https://support.microsoft.com/en-us/outlook/frequently-asked-questions-about-copilot-in-outlook).
- Licensing in depth: the [license options](https://learn.microsoft.com/en-us/copilot/plan/copilot-license-options) page shows which base plans qualify.
- Requirements for rollouts: the [requirements page](https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-requirements) covers apps, mailboxes and the Office Feature Updates task.
- Copilot Chat pinning: decide whether the entry point should appear for unlicensed users.

## Next step

To add Copilot to Outlook, make sure the user has a Microsoft Copilot license and a qualifying license, a supported Outlook app and an Exchange Online mailbox, then restart Outlook and look for the **Summarize** button. If nothing appears, work through the license, the app version and the mailbox type in that order before you open a support case.
