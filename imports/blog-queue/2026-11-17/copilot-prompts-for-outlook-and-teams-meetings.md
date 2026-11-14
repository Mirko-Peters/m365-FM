---
title: "Copilot Prompts for Outlook and Teams Meetings: Practical Examples"
summary: "Example Copilot prompts for Outlook and Teams meetings, based on Microsoft's own examples and the goal, context, source and expectations structure, plus the transcription and license requirements that decide whether they work."
status: review
publish: false
author: mirko-p
date: 2026-11-17
topics: [copilot, copilot-chat, outlook, copilot-prompt-gallery]
keypoints:
  - "Microsoft's prompt structure has four parts: goal, context, source and expectations. Only a clear goal is required."
  - "Teams meeting prompts quoted by Microsoft include 'What ideas were discussed?' and 'Where do we disagree on this topic?'"
  - "To ask Copilot about a meeting after it ends, a transcript must exist, so someone has to turn on transcription during the meeting."
  - "In Outlook, Copilot can summarize a thread, draft with a chosen tone and length, coach on tone, and prepare you for a meeting."
  - "Copilot in Outlook does not work on signed or encrypted emails or on group mailboxes. Always review generated text before you send it."
faq:
  - q: "How should I structure a Copilot prompt?"
    a: "According to Microsoft Support, a strong prompt can include a goal, context, source and expectations. Only a clear goal is required. Adding the others, such as the tone or the material Copilot should use, gives more useful results, and you can refine with follow-up prompts."
  - q: "Why can't Copilot answer questions about my Teams meeting afterwards?"
    a: "Microsoft Support says that to prompt Copilot about a meeting or see its history after the meeting, live transcription must have been turned on during the meeting. In the Only during the meeting setting, untranscribed speech and Copilot interactions are unavailable after the meeting ends."
  - q: "Where do I find Copilot for a finished meeting?"
    a: "Microsoft Support describes two routes: select Open Copilot in the upper-right corner of the meeting chat, or open the Recap tab and use the Copilot pane. Both show the same conversation history."
  - q: "What can Copilot do in Outlook?"
    a: "According to Microsoft Support, it can summarize email threads, draft emails with tone and length options, coach on tone and clarity, schedule meetings, prepare you for a meeting, prioritize your inbox and help triage mail. Core features are for customers with a Microsoft Copilot work license."
  - q: "Are there emails Copilot cannot handle?"
    a: "Yes. Microsoft Support lists signed or encrypted emails, IRM-protected emails and some MIP-labeled emails as unsupported, and says it cannot access S/MIME or Double Key Encryption emails. It also does not work on group mailboxes or mailboxes not hosted on Exchange Online."
---

The best Copilot prompts name a clear goal and add context, a source and the format you want. For Outlook, that means asking for summaries, drafts with a stated tone and length, and meeting preparation. For Teams meetings, it means asking about ideas, decisions and open questions, and it only works after the meeting if a transcript exists. The examples below start with wording Microsoft publishes and then show how to adapt it.

## The structure Microsoft recommends

Microsoft Support describes four parts of a prompt:

- **Goal.** The task you want done. This is the only required part.
- **Context.** Why you need it and who is involved.
- **Source.** The material Copilot should use, such as a file, a web page or, with a work account, your emails, chats and files.
- **Expectations.** Format, tone, length or style.

Microsoft's tips: start with a clear goal, add detail if the first result misses, refine with follow-up prompts, verify the answers, and expect that the same prompt can give somewhat different results.

## Outlook: prompts and how to run them

### Summarize a thread

This is a button before it is a prompt. Select the conversation, then select **Summary by Copilot** or **Summarize** at the top of the thread. The summary may include numbered citations linking to the emails. In new Outlook, if the email has PDF, PowerPoint or Word attachments, select **Summarize a file**.

A prompt-style example from Microsoft Support that uses a source: "Write a summary based on all emails from Sam in the past two weeks."

### Draft a new email or reply

In new Outlook, select **Home** > **New mail**, then the Copilot icon and **Draft**. Type a prompt, select the **Generate** arrow, review the draft, adjust length or tone from the dropdown, then select **Keep it**. Microsoft's own examples:

- "Write an email to congratulate the project lead and team on the launch."
- "Write a warm, casual thank-you note to my neighbor for watering my plants. Keep it under 80 words."

The second shows the expectations part in action: tone and a length limit.

Adapting the pattern for work (these are illustrations built on Microsoft's structure, not quotes from Microsoft):

- Goal and context: "Reply to this thread and confirm we can deliver on Friday. The customer is worried about the delay."
- Expectations: "Keep it polite and under 120 words, with one clear next step."

### Other Outlook features worth knowing

According to Microsoft Support's FAQ for Copilot in Outlook:

- **Coaching by Copilot** suggests improvements to tone, sentiment and clarity.
- **Schedule with Copilot** creates meetings with up to two other people or adds events such as focus time.
- **Prepare for your meeting** gathers key information, action items and related emails, chats and pre-reads from the calendar item.
- **Prioritize my inbox** assigns high, normal or low priority with a reason.
- **Triage and rules** pins, flags, archives or deletes mail from Copilot chat and creates rules in natural language.

### Limits in Outlook

Copilot does not work on signed or encrypted emails, IRM-protected emails or some MIP-labeled emails, and cannot access S/MIME or Double Key Encryption emails. It works on primary, shared and delegate mailboxes. It does not work on group mailboxes. Meeting preparation can be generic if there are no shared documents, prior emails or chat history. Review AI-generated output before you send it.

## Teams meetings: prompts and requirements

### Before you prompt: transcription

Microsoft Support says transcription is not needed to turn Copilot on during a meeting. To prompt Copilot about the meeting, or see its history after it ends, live transcription must be turned on during the meeting. Organizers control this under **Online meeting options** > **Copilot and other AI**:

- **During and after the meeting.** Transcription is required. Stopping it also stops Copilot.
- **Only during the meeting.** Real-time use only. Only transcribed portions remain after the meeting.
- **Off.** Copilot, recording and transcription are disabled.

### During the meeting

Select the **Copilot** icon in the meeting controls, then **View prompts** or type a question. If you join more than 5 minutes late and Copilot is active, select **Open Copilot** in the notification for a catch-up summary.

### After the meeting

Select **Open Copilot** in the upper-right corner of the meeting chat, or open the **Recap** tab and use the **Copilot** pane.

### Prompts from Microsoft

- "What ideas were discussed?"
- "Where do we disagree on this topic?"
- "What questions can I ask to move the meeting forward?"
- "Create a table with the ideas discussed and their pros and cons."
- "List the ideas, including people's feedback, from transcript and chat."
- "What questions were asked during the meeting?"

The Microsoft Copilot Prompt Gallery also lists meeting-related prompts, such as "Identify and list all action items agreed upon during the meeting, including the person responsible" and "List all open questions raised during the meeting that have not yet been answered or resolved." The gallery text shown on the page is truncated, so use the gallery itself for full wording.

### Limitations

- Copilot does not work in meetings hosted outside your organization.
- Without a transcript, post-meeting Copilot in the meeting chat uses only chat content.
- In recurring meetings, earlier Copilot conversation history is lost if a later meeting in the series is transcribed.
- Exporting a response to Word is only possible for responses over 1,300 characters, and Excel export only for table-formatted responses.
- Intelligent recap needs Teams Premium or a Microsoft Copilot license.

## A simple routine

1. Before the meeting, ask Copilot to prepare you from the calendar item.
2. Start transcription at the beginning of every meeting you may want to query.
3. After the meeting, ask for decisions, open questions and action items, then verify names and dates against the transcript.
4. Turn the result into a follow-up email with a tone and length stated in the prompt.

## Related

- [Microsoft 365 Copilot](https://www.m365.fm/entity/copilot/)
- [Copilot Chat](https://www.m365.fm/entity/copilot-chat/)
- [Outlook](https://www.m365.fm/entity/outlook/)
- [Copilot Prompt Gallery](https://www.m365.fm/entity/copilot-prompt-gallery/)

## Sources

- [Microsoft Support: Get started writing prompts in Microsoft Copilot](https://support.microsoft.com/topic/f6c3b467-f07c-4db1-ae54-ffac96184dd5)
- [Microsoft Support: Frequently asked questions about Copilot in Outlook](https://support.microsoft.com/outlook/frequently-asked-questions-about-copilot-in-outlook)
- [Microsoft Support: Catch up on meetings with Microsoft 365 Copilot in Teams](https://support.microsoft.com/en-US/teams/copilot/catch-up-on-meetings-with-microsoft-365-copilot-in-teams)
- [Microsoft Learn: Communicate effectively with Outlook and Teams](https://learn.microsoft.com/en-us/training/modules/copilot-productivity-workflows/5-communicate-effectively-with-outlook-and-teams)
- [Microsoft Copilot Prompt Gallery](https://adoption.microsoft.com/en-us/copilot/prompt-gallery/)
