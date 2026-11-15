---
title: "A communication plan for SharePoint migrations and cleanups"
summary: "A SharePoint migration communication plan for migration leads: who to tell, what to say, when to say it and how to announce a cleanup without surprises."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [sharepoint-migration, sharepoint-governance, migration-wave]
keypoints:
  - "Users often see a migration as effortless because files simply move, so the plan must tell them what changes, when, and what to do in the meantime."
  - "Microsoft's migration guidance asks for clear statements of timing, expectations and impact to the individual, plus training for users and the helpdesk before cutover."
  - "Split your audiences into sponsors, site owners, helpdesk and end users, and give each group a different message at a different time."
  - "Each wave needs its own short sequence: an early notice, a reminder, a cutover notice, and a follow-up that says where content is and how to get help."
  - "Cleanups need the same care: say what will be removed or archived, when, and how to ask for something back, and use the pilot to improve your messages."
faq:
  - q: "What should a SharePoint migration communication plan include?"
    a: "It should name the audiences, the messages, the channels, the timing and one person who sends them. Tell users when the migration starts and ends, where their content will be, what to do in the meantime, and how to get help. Include the helpdesk, and plan a follow-up message after cutover."
  - q: "When should you tell users about a SharePoint migration?"
    a: "Tell them early enough to prepare, then again close to the date. Microsoft's guidance says to state timing, expectations and impact to the individual, and to let users know how they are affected during the migration. Use a pilot to test the message, and send a short notice again when the content has moved."
  - q: "How do you announce a SharePoint cleanup to users?"
    a: "Say what will change, why, when it happens and how to ask for something back, and name a contact. Send it to site owners first, because they know their content, then to the affected users. Give a short window for objections, and record what was removed so you can restore it quickly."
---

A SharePoint migration communication plan is the part of the project that decides whether people see the move as a success or as something that happened to them. This guide is for migration leads who have a technical SharePoint migration plan and need a message plan to match. You will see why people misjudge migrations, who your audiences are, what each group needs to hear, how to time the messages around each wave, and how to adapt the plan when the work is a cleanup, not a move. A worked example with made-up numbers shows one wave from the first notice to the follow-up.

## Why people need more than a date

The RSM article on [communication plans for SharePoint migrations](https://technologyblog.rsmus.com/it-infrastructure/sharepoint-migration-communication-plans-essential/) makes a simple observation: staff often see a migration as effortless, because their files just move. They may not realize that content could be unavailable for a time, or that a migration could fail. That gap in expectations causes most of the unhappy calls to the helpdesk.

Microsoft's [SharePoint Server team sites migration guide](https://learn.microsoft.com/sharepointmigration/sp-teams-sites-migration-guide) points the same way. It tells you to plan user onboarding early, to prepare people for change and how it affects them, and to develop a communications plan with clear statements of timing, expectations and impact to the individual. It also lists what to include: the timeline and any calls to action, an assurance that content already in SharePoint is safe and not overwritten, and whether people can opt out.

This is user communication as part of change management. A migration to SharePoint Online changes where people work, how they find things and sometimes how they share. A plain notice that says "we are moving on Friday" covers the date but not the change. The plan should cover both.

Treat the plan as part of [SharePoint migration](https://www.m365.fm/entity/sharepoint-migration/) itself, not as an add-on written the week before cutover. Write the first draft of the message plan when you write the migration schedule.

## Who needs to hear what

Not everyone needs the same message. Four groups cover most projects.

- **Sponsors and managers.** They need the schedule, the risks, the decisions you need from them and the points where they will be asked questions. They also carry the message to their teams, so give them two or three sentences they can repeat.
- **Site owners.** They know their content and their people. They need to know their role, what to review or clean up before the move, such as pages or lists they chose to customize, and what happens to their site. Microsoft's [communication plan page for the older SharePoint 2010 upgrade](https://learn.microsoft.com/en-us/previous-versions/office/sharepoint-server-2010/cc263345%28v=office.14%29), which is dated but still a useful outline, separates messages for site owners, who need to know their role and any issues found before the upgrade, from messages for site users.
- **The helpdesk.** Microsoft's guide says to train the helpdesk on key features and common questions before cutover. The RSM article says to include the helpdesk in communications so staff understand the plan before people call.
- **End users.** They need the dates, what is different for them, where their content will be, what to do in the meantime and how to get help.

Assign one person to send the migration emails, so every team that has to migrate hears one voice about the migration. RSM suggests this, and it prevents conflicting messages.

## What a SharePoint migration communication plan covers

The RSM article lists four things worth deciding: audiences, channels, timing and content. Use them as a checklist of best practices for migration messages, and write the result on one page.

**Audiences.** The four groups above, plus anyone who depends on a specific site or a file share that is moving, such as a team that runs a monthly report from a library. For each content set, identify the stakeholders who need notice.

**Channels.** Email is the main channel in the article, with a company-wide migration plan and a daily migration report during the move. It also suggests a section on the intranet homepage that shows where to find migrated content. Keep one page as the source of truth, and link to it from every message.

**Timing.** Tell stakeholders when the migration will start, when it is likely to finish and when their old content will no longer be available in its original location. RSM advises running a test migration first to estimate how long the move takes on your network. If plans shift, tell people. The Microsoft 2010 page adds one more point worth keeping: choose dates far enough ahead that the team can finish its preliminary steps, and schedule time to validate the sites afterward.

**Content.** Explain where people can find their new content and what they should do in the meantime, such as saving files locally or in a SharePoint site or Microsoft Teams channel. Confirm the scope with stakeholders so duplicate or archived content can be left out. If a migration fails, explain what happened and give a resolution estimate when you can.

## A message sequence for each wave

Large estates migrate in groups. A [migration wave](https://www.m365.fm/entity/migration-wave/) is a batch of workloads that migrate together, and each wave deserves its own short sequence of messages. The sequence below is our own suggestion, built from the sources, so adapt the lead times to your calendar.

1. **Early notice.** Several weeks before, tell sponsors and site owners what is planned, what they need to do, and when. Ask owners to confirm their content and remove what is not needed.
2. **User notice.** Tell everyone affected the dates, the impact, any calls to action and where to get help. Say plainly if their content will be unavailable, and give the expected downtime.
3. **Reminder.** Send a short message a few days before cutover with the same facts, and a link to the source page.
4. **Cutover notice.** On the day, say that the move has started, which locations are read-only or closed, and where to go instead. Microsoft's guide recommends directing people to the new environment and disabling the old team sites so people do not edit the wrong copy.
5. **Follow-up.** When the move is done, say where the content is, what to check, how to ask for help and when the old location goes away. Microsoft's guide lists regular emails, training and documentation for making the switch as part of the follow-up.

Use the first wave as a pilot for the messages as well as the technology. Microsoft's guide says the pilot should validate the process, including performance and user communication, and gather a sample of user feedback. It adds that you may update your user communication template to address the questions pilot users asked. Keep a list of those questions, and answer them in the next wave's notice before anyone asks.

## Base the notices on the migration assessment

Your messages are only as accurate as your inventory. Microsoft's guide says to assess the source environment before you migrate, because what you find influences the strategy, the timing and the amount of content you move. It suggests working with users to find older content that is obsolete or redundant and can be deleted. For a SharePoint Server 2013 farm, it names the SharePoint Migration Assessment Tool (SMAT), which produces reports on issues that could affect the migration, and the SharePoint Migration Tool (SPMT), a free SharePoint migration tool that Microsoft describes as available at no cost. The guide also advises deciding how sites map to a modern hub architecture. Describe that new information architecture to users in plain words, so they know where migrating to SharePoint Online puts their site collection, and what the new SharePoint will look like.

## Announcing a cleanup

A cleanup is a different kind of message. A migration moves content and promises it will still be there. A cleanup removes, archives or restricts something, such as a permission, and some people will feel it as a loss. The plan above still applies, but add four things.

- **Say what will go and why.** "Sites with no activity for two years will be archived" is clear. "We are tidying up" is not.
- **Name the date and the way back.** Give the date and explain how to ask for something back. Record what was removed, so a restore takes minutes.
- **Tell owners first.** They can object, correct the list or confirm it. Then tell the people on those sites.
- **Give a short window.** A few days for objections turns a surprise into a decision.

The wider rules about who decides what belong in your [SharePoint governance](https://www.m365.fm/entity/sharepoint-governance/) work. Keep the message short and the contact name visible.

## Example: one wave from notice to follow-up

The numbers are made up.

A migration lead moves 1,200 libraries in six waves. Wave 2 has 180 libraries to migrate for 400 people across two departments, with a cleanup of 40 unused libraries beforehand.

Five weeks before cutover, she emails the two sponsors and 22 site owners with the schedule, the list of libraries and a request to confirm the list within a week. Owners remove 11 libraries from the move and approve 29 of the 40 for archive; 11 stay after objections. Three weeks before cutover, the 400 staff members get a short email with the dates, the effect and the link to the source page. The helpdesk gets a one-page sheet with the five questions the pilot group asked in wave 1.

Three days before, a reminder goes out. On Friday, the cutover notice says the old libraries are read-only and gives the new address. On Monday, a follow-up asks them to check three things and tells them who to call. In the first week, the helpdesk logs 14 calls, against 31 for the pilot wave. The lead cannot tell how much of the drop came from the messages, but she keeps the same structure for wave 3.

## Common mistakes

- **Sending one email on the day.** People need time to prepare, so send a sequence.
- **Describing the date but not the impact.** Say what it means for the individual.
- **Forgetting the helpdesk.** They take the calls, so brief them first.
- **Letting several people send messages.** One owner keeps dates and wording consistent.
- **Ignoring pilot feedback.** The pilot's questions are the best draft of the next notice.
- **Announcing a cleanup without a way back.** Say how to ask for content back.

## How software can help

Start with the tools you have in Microsoft 365: your email system, a team chat channel, the intranet homepage and a shared page that holds the schedule and the questions. A simple tracking list can serve as the workflow and record each wave, audience, message, send date and owner. Migration tools, including third-party ones, often produce progress reports that you can reuse in a status update, but check what they show before you send them on to staff.

## Next step

Take your next SharePoint wave and write a one-page SharePoint migration communication plan: four audiences, one message each, five dates and one named sender. Send the first migration notice to the site owners this week, and add the questions they ask to the next message.
