---
title: "A Power Automate flow that asks site owners if a site is still needed"
summary: "Build a Power Automate site owner confirmation flow: a review list, a monthly schedule and an approval that asks owners if each SharePoint site is needed."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [power-automate, sharepoint-site-owner, sharepoint-site-lifecycle, sharepoint-governance]
keypoints:
  - "A Power Automate site owner confirmation flow needs three parts: a review list with one row per site, a scheduled trigger, and an approval request to the owner."
  - "The flow should write every answer back to the list, because a confirmation that lives only in an email cannot be reported or audited later."
  - "Silence is an answer too, so a second scheduled run should find owners who did not respond and escalate to a named admin."
  - "Microsoft's built-in site attestation policy does the same job with set frequencies of 3, 6 or 12 months, so check it before you build your own."
  - "Keep the flow owned by a service account or shared with co-owners, so it does not become an orphaned flow when its builder leaves."
faq:
  - q: "Can Power Automate ask site owners to confirm a SharePoint site is still needed?"
    a: "Yes. Keep a list with one row per site and its owner's email. A scheduled flow reads the rows, sends each owner an approval request with Start and wait for an approval, and writes the answer back. Rejected or unanswered rows go to an admin for follow-up."
  - q: "Is there a built-in way to do site owner reviews?"
    a: "Yes. SharePoint Advanced Management includes a site attestation policy. It sends owners a periodic request to confirm a site is still needed, at an interval of 3, 6 or 12 months. The Microsoft page does not name a license and points to the prerequisites page, so check that before you decide."
  - q: "What should happen when a site owner does not answer?"
    a: "Decide it before you launch. A simple rule is one reminder after a week, then escalation to a named admin or a second owner. Do not delete or lock a site on silence alone. Record the non-response in the review list so the next step is a human decision."
---

A Power Automate site owner confirmation flow works like this. A scheduled flow reads a list of sites, sends each owner an approval request, and writes the answer back to the list. This guide is for SharePoint admins who want a lightweight review cycle without buying anything new. You will build the data list, the flow, the follow-up for silent owners and the report. You will also see where Microsoft's built-in attestation policy does the same job, so you can pick the right path.

## Why ask site owners at all?

Admins can see when a site was last changed. They cannot see whether the project behind it is over. Only the users who run the site know that. The [site owner](https://www.m365.fm/entity/sharepoint-site-owner/) is the right person to ask, and a short yes-or-no question gets answered faster than a long survey.

Microsoft describes the same idea in its page on [SharePoint site lifecycle management](https://learn.microsoft.com/en-us/sharepoint/site-lifecycle-management). Its site attestation policy "requests periodic confirmation that a site is still needed and meets organizational requirements." The inactive site policy works on detected activity, while attestation asks for an explicit review. A home-made flow follows the attestation pattern, with one difference: you choose the questions, the schedule and the escalation rules.

The goal is not to delete sites. The goal is to have a recorded answer for each site, from a named person, on a known date. That record feeds [SharePoint governance](https://www.m365.fm/entity/sharepoint-governance/) work such as archiving, ownership clean-up and access reviews.

## Check the built-in option first

The [site attestation guide](https://learn.microsoft.com/en-us/sharepoint/request-site-attestations) shows what the built-in policy does. Compare it with your needs before you build.

- **Frequency:** 3 months, 6 months or 12 months.
- **Who is asked:** site owners, site admins, or both.
- **Scope:** a CSV of up to 10,000 URLs, or a selection by site template, sensitivity label or creation source.
- **No answer:** notifications are monthly, and enforcement follows three notifications. The options are do nothing, read-only access, or read-only followed by archiving.
- **Reports:** counts of sites to attest, attested, set to read-only and archived, plus a downloadable CSV.

The page does not name a license. It only says to see the SharePoint Advanced Management prerequisites. If you have that capability, the policy is part of [site lifecycle](https://www.m365.fm/entity/sharepoint-site-lifecycle/) management and may be all you need. Build your own flow when you lack it, when you want custom questions, or when you want the answers inside a list you already use for other work.

## Step 1: build the review list

A flow is only as good as its data. Create a SharePoint list called "Site review" with these columns:

1. **Site URL** (single line of text).
2. **Site name** (single line of text).
3. **Owner email** (single line of text, one address per row).
4. **Status** (choice: Not asked, Asked, Confirmed, Not needed, No answer).
5. **Asked on** (date).
6. **Answered on** (date).
7. **Owner comment** (multiple lines of text).

Fill it from a report. The site attestation page notes that you can export a list of sites from the active sites page of the SharePoint admin center. Start with that CSV and add the owner emails. Where a site has no owner, mark it for the admin team to fix first, because a flow cannot ask a person who does not exist.

Who counts as the owner? On a SharePoint team site, the Owners group has the Full Control permission level and can manage site permissions, settings and appearance. On a team site connected to a Microsoft 365 group, the group owners are the site owners. A site collection administrator is a separate role, so decide whether you ask owners, admins or both. To read owners inside a flow, the SharePoint connector has the action **Send an HTTP request to SharePoint**. Microsoft's connector reference says it can run any SharePoint REST API you have access to, and asks you to proceed with caution. For a first version, an exported list with owner emails is safer than live lookups.

One row per site keeps the logic simple. If a site has two owners, put both addresses in the field and send one request to both, or assign one primary owner.

## Step 2: build the flow

Using Power Automate, build the flow as a scheduled cloud flow. Microsoft's guide to [scheduled cloud flows](https://learn.microsoft.com/en-us/power-automate/run-scheduled-tasks) says you can set the frequency by day, week or month, and that a month runs on the same date each month. Pick monthly, and a start time during working hours.

Then add these actions:

1. **Get items** from the "Site review" list, to retrieve the sites that still need a review. Use a filter query such as `Status eq 'Not asked'`. The connector lets you set a filter query and a top count, so you can limit each run to a batch.
2. **Apply to each** item returned.
3. **Update item**, to set Status to "Asked" and fill "Asked on". Do this before the approval, because the approval step pauses the flow.
4. **Start and wait for an approval**. The [approval tutorial](https://learn.microsoft.com/en-us/power-automate/modern-approvals) describes this action as the one that sends a request and pauses the flow until a response arrives. Put the owner email in **Assigned to**. In **Details**, write the site name, the URL and one clear question: "Is this site still needed?"
5. **Condition** after the approval. The tutorial sets the left value to the approver response, the operator to "is equal to" and the right value to "Approve".
6. In the **True** branch, update the item to "Confirmed" and fill "Answered on".
7. In the **False** branch, update the item to "Not needed", and add a task or email for the admin team to review the site.

The tutorial lists email, the approvals center and the Power Automate mobile app as ways for approvers to respond. Keep the details field short and put your policy link in it, so owners know what happens next.

Watch the connector limits. The SharePoint connector reference lists a throttle of 600 API calls per 60 seconds per connection. A batch of a few dozen sites is far below that. A batch of thousands is not, so run in batches.

## What should the approval request ask the owner to check?

The built-in policy asks owners to confirm that the site is still needed and that its ownership, membership, permissions and sharing settings are appropriate. You can copy that scope in the **Details** field of your approval request. Keep it to three short checks:

1. The site is still needed.
2. The owners and members are still the right people. This includes the members of the connected Microsoft 365 group, if there is one.
3. Site permissions and sharing are still right for the content.

The owner answers with one button. A "Reject" answer means "not needed". If the owner finds a permission problem, they should say so in a reply to the admin team. Do not ask the owner to fix permissions inside the request. Use the Recurrence trigger for the monthly run, and a manual trigger for your pilot, so you can start a test whenever you want.

## Step 3: handle owners who do not answer

An approval that nobody answers is an open row. Build a second scheduled flow for that case.

- Run it weekly.
- Get items where Status is "Asked" and "Asked on" is older than seven days.
- For the first miss, send a reminder email to the owner.
- For the second miss, set Status to "No answer" and notify a named admin.

Add error handling too. If a run shows an error at the approval step, ensure the row does not stay on "Asked" forever. The weekly flow can also catch rows that never changed. This is a design suggestion, not a Microsoft setting. Choose the numbers to match how your organization works. The key rule is that silence leads to a conversation, not to an automatic deletion. Microsoft's built-in policy offers read-only and archive steps, but only after three monthly notifications and only if you select them.

## Example: one month of review for 40 sites

The numbers below are made up.

An admin loads 40 sites into the list and runs the flow once. After two weeks, 24 owners confirmed, 4 said the site is not needed, and 12 did not answer. That is 60 percent confirmed, 10 percent not needed and 30 percent silent.

The weekly follow-up flow sends 12 reminders. Seven more owners confirm and one says "not needed". The remaining four are marked "No answer" and go to the admin, who calls them. By the end of the month, the list shows 31 confirmed, 5 not needed, 4 for follow-up. Nothing was deleted. The admin now has a short list of five sites to archive after a final check, and a dated record for all 40.

## Common mistakes

- **Using a list with missing or wrong owner emails.** The flow sends requests into the void. Check the owner column before the first run.
- **Asking too many questions.** One yes-or-no question gets answered. A form with ten fields does not.
- **Not writing the answer back to the list.** An approval history alone is hard to report on. Keep the list as the single record.
- **Acting on silence.** No answer is not a "no". Escalate to a person.
- **Building the flow under your own account only.** If you leave, the flow can become an orphaned flow. Use a service account or add co-owners.
- **Running the first pass on all sites at once.** Start with a pilot of one department, fix the wording, then expand.

## How software can help

Start with what Microsoft provides. The site attestation policy in SharePoint Advanced Management is the closest built-in match, and it has its own reports. Power Automate with a SharePoint list covers custom needs. A PowerShell script can pull the site and owner data into the list, and Excel or Power BI can chart the status column.

Judge any tool by one test: does it keep a dated answer for each site and make follow-up easy? If your list and flow do that, you do not need more.

## Next step

Pick ten sites from one department, build the review list for them, and run the flow once. Use what you learn about owner replies to refine your Power Automate site owner confirmation process before you roll it out to the whole tenant.
