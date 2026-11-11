---
title: "How to choose users and sites for a safe Copilot pilot"
summary: "Choose a Copilot pilot group and the sites it can reach with care: pick champions across teams, check their access first and set clear feedback rules."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [copilot-adoption, copilot-governance, champions-network, copilot]
keypoints:
  - "A safe pilot has two parts: the right people, chosen across business groups, and the right content, meaning the sites those people can already open."
  - "Microsoft describes three phases: pilot with a small group, deploy to a larger group, then operate and monitor usage and adoption."
  - "Pick early adopters and champions who share a process or department, are willing to onboard first and will give feedback, ideally with high use of existing Microsoft 365 features."
  - "Because Copilot uses everything a user can open, check the access of each pilot user before you assign licenses, not after."
  - "Microsoft does not name a pilot size, so set one your team can support, and agree the feedback loop and success measures before day one."
faq:
  - q: "How many users should be in a Copilot pilot?"
    a: "Microsoft's guidance does not state a pilot size or duration. It describes the pilot as a test with a small group. Choose a size that your team can support with training, feedback and access checks, and that covers several business groups. A pilot you cannot support properly gives weaker results than a smaller one that you can follow closely."
  - q: "Who should be in the Copilot pilot group?"
    a: "Choose users across business groups, ideally people with high use of existing Microsoft 365 features, as Microsoft suggests. Add champions who share a process or department and are willing to onboard first, and early adopters who will share feedback. Include an executive sponsor who explains why the rollout happens, and one person from IT to log problems."
  - q: "Can guests get Copilot licenses for a pilot?"
    a: "No. Microsoft states that it is not supported to assign Copilot licenses to cross-tenant users, including guests. Pilot users need a work or school account in your own Microsoft Entra directory, with the prerequisite Microsoft 365 license assigned first. Keep guests out of the pilot plan and handle their access separately."
---

A safe Copilot pilot group is small, mixed across teams, willing to give feedback, and checked for access before the first license is assigned. That is the short answer to how to choose users and sites for a Copilot pilot. This article is for IT managers who must plan the first wave. You will learn how to pick people and champions, why the sites they can reach matter as much as the people, how to set up feedback, and see a worked example with invented numbers.

## What does a Copilot pilot need to prove?

A pilot has two jobs. It tests whether Copilot helps people work, and it tests whether your content is safe to expose. Most plans cover the first job and forget the second.

Microsoft's page on [setting up Copilot and assigning licenses](https://learn.microsoft.com/en-us/microsoft-365/copilot/microsoft-365-copilot-setup) describes three phases: Pilot, where you test with a small group, Deploy, where you assign Copilot to a larger group, and Operate, where you monitor usage and adoption. The same page recommends that before broad deployment you focus on preventing oversharing and use sensitivity labels to classify and protect sensitive information.

So write down what the pilot must show before you start:

1. **Value.** Which tasks get faster or better, and how do you know?
2. **Safety.** Which sites and files do pilot users reach that they should not?
3. **Support.** What questions and problems come up, and who answers them?
4. **Decision.** What result lets you move to the Deploy phase, and what result stops it?

Without these four, the pilot turns into a free trial for a few curious people.

## Who should be in the pilot group?

Microsoft's guidance gives the main criteria. On its page on creating early adopters, it suggests identifying users across business groups, ideally those with high use of existing Microsoft 365 features, by reviewing usage metrics in the admin center. It then suggests assigning licenses, onboarding them, and using these users as product champions to help their peers.

Microsoft's [adoption planning checklist](https://adoption.microsoft.com/en-us/copilot/essential-guide/plan/) adds roles:

- **Executive sponsor.** The person who explains to employees why Copilot is being rolled out.
- **Core team.** Business leaders, IT staff and the people who will run the user community and skilling.
- **Champions.** Business users who share a process or department and are willing to onboard first.
- **Early adopters.** Users who will use new capabilities and share feedback.

The page does not state a pilot size, a duration or specific success numbers. So decide those yourself. A good test: can your team talk to every pilot user at least once in the first two weeks? If not, the pilot is too large.

Mix the group on purpose. Include different departments, different jobs and different levels of comfort with new tools. A group of only enthusiasts hides problems that ordinary users will hit.

Also name one person in IT who owns the pilot log. This person answers questions, collects access surprises and reports to the sponsor, so that problems do not stay in chat threads. Without a named owner, problems are noticed by many people and fixed by nobody.

Keep guests out. Microsoft states that it is not supported to assign Copilot licenses to cross-tenant users, including guests. Pilot users need a work or school account in your directory, with a qualifying license in place first.

## Which sites matter for a safe pilot?

This is the step that makes the pilot safe. Copilot only surfaces data to which a user has at least view permission, according to Microsoft's page on [SharePoint and Copilot best practices](https://learn.microsoft.com/en-us/sharepoint/sharepoint-copilot-best-practices). The page also says Copilot uses all data a user can access, which may include broadly shared files that the user does not know about.

So the content in the pilot is not the content you plan to show. It is everything the pilot users can already open. To find it, do three things for each pilot user or group:

1. **List the sites the group belongs to.** Start with team sites, communication sites and shared mailboxes.
2. **List the broad groups they sit in.** Everyone except external users gives access to every internal user, so every pilot user reaches those sites.
3. **List the sensitive sites in the tenant.** HR, finance, legal and executive sites, and check which of them have broad access.

The overlap between the second and third list is your fix list. Put it into the plan before licenses are assigned. Microsoft's guidance for [copilot governance](https://www.m365.fm/entity/copilot-governance/) points to tools such as data access governance reports, restricted access control and restricted content discovery. Use them for the sites that you cannot fix by the start date.

## How do you set up feedback and champions?

A pilot without feedback is a guess. Microsoft's checklist suggests sharing example prompts, resources and training sessions, running user feedback surveys, collecting success stories and addressing training issues. It also describes periodic service health reviews with leaders, technical staff, user enablement and business stakeholders, using data from the admin center and the Copilot dashboard.

For the pilot, keep it light:

- **A weekly question.** Send one short question each week: what did you use Copilot for, and what went wrong?
- **A channel.** One place for questions and tips. For companies that use Viva Engage, Microsoft recommends the Copilot community template there. Smaller companies can use Teams or another chat tool.
- **A log.** One shared list of problems, including surprises about content that users should not have seen.
- **A standing check.** A short review every two weeks with the sponsor, IT and two champions.

[Copilot adoption](https://www.m365.fm/entity/copilot-adoption/) depends on people who share what works. The champions, who form a [champions network](https://www.m365.fm/entity/champions-network/), are the link between IT and the teams, so give them time for the role. Agree with their managers that the role takes an hour or two per week, and write that into the plan so that it does not become unpaid extra work.

## What should the pilot not do?

A few limits keep it safe and credible.

- **Do not start before the access check.** One surprise file in week one can end the pilot.
- **Do not promise results.** Share what you learn, including what did not work.
- **Do not widen the pilot silently.** Every new user needs the same access check.
- **Do not skip the exit rule.** Decide in advance what result moves the group to the Deploy phase, and what result pauses it.

## Example: a 60-user pilot across six teams

The numbers are invented to show the method. A company with 1,200 employees picks 60 pilot users across six departments: sales, finance, HR, operations, legal and marketing. Each department supplies 10 people, including one champion.

The IT manager does the access check before assigning licenses:

1. The 60 users belong to 40 sites through their teams.
2. All 60 are in Everyone except external users, so they can reach every site with that group. A report shows 22 such sites.
3. Of those 22, 5 hold sensitive content: an old HR project, a finance archive, two legal sites and an executive site.

The plan: close the 5 sites first, with restricted access control for two and cleaned groups for three, before licenses are assigned. The other 17 go to owner reviews during the pilot. The manager also sets a weekly question, a Teams channel and a review every two weeks.

Count the effect. Before the check, 60 pilot users could reach 5 sensitive sites by accident. After the fixes, none can. The first feedback round collects 38 answers from 60 users, and the log has 14 entries. Three of the entries are about content that was still too open, and those sites move to the top of the next cleanup list. The pilot did its second job.

## Common mistakes

- **Choosing only enthusiasts.** Mixed groups reveal more problems.
- **Choosing a group too big to follow.** You cannot support what you cannot see.
- **Checking access after the licenses.** The first surprise then happens in front of users.
- **No feedback loop.** Without it, you learn nothing about value or safety.
- **Including guests.** Copilot licenses cannot be assigned to guests.
- **No exit rule.** Without one, the pilot never ends and never decides.

## How software can help

Start with what Microsoft provides: usage metrics in the admin center, the Copilot dashboard, data access governance reports and the license assignment pages. A simple shared sheet can hold the pilot list, the site check and the feedback log. For the access check across many sites, a script or reporting tool can list what each pilot group can open. Compare any such output with the admin center reports on a few sites before you trust it.

## Next step

Write the pilot group down this week: names, teams, champions and the sponsor. Then run the access check for that Copilot pilot group before you assign a single license.
